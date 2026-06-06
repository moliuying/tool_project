<template>
  <div class="file-hash-calculator">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <el-steps :active="0" finish-status="wait" simple class="guide-steps">
        <el-step title="选择文件" description="通过拖拽或点击选择要校验的文件" />
        <el-step title="计算哈希" description="系统自动计算 MD5、SHA1、SHA256 哈希值" />
        <el-step title="校验比对" description="与官方提供的哈希值进行比对确认文件完整性" />
        <el-step title="复制使用" description="一键复制哈希值用于文件校验" />
      </el-steps>
      <el-divider />
      <div class="hash-info">
        <h4 class="info-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          哈希算法说明
        </h4>
        <el-row :gutter="16">
          <el-col :span="8" v-for="algo in algorithms" :key="algo.name">
            <div class="algo-item">
              <div class="algo-name">{{ algo.name }}</div>
              <div class="algo-desc">{{ algo.desc }}</div>
              <div class="algo-length">输出长度: {{ algo.length }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <FolderOpened />
          </el-icon>
          <span>文件哈希计算器</span>
          <el-tag size="small" type="info" class="header-tag">MD5 / SHA1 / SHA256</el-tag>
        </div>
      </template>

      <div
        class="upload-area"
        :class="{ 'is-dragover': isDragover, 'has-file': selectedFile }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <input
          ref="fileInputRef"
          type="file"
          class="file-input"
          @change="handleFileChange"
        />
        <div v-if="!selectedFile" class="upload-placeholder">
          <el-icon :size="64" color="#165DFF" class="upload-icon">
            <UploadFilled />
          </el-icon>
          <div class="upload-text">
            <span class="upload-main">拖拽文件到此处或点击选择文件</span>
            <span class="upload-sub">支持任意类型和大小的文件</span>
          </div>
          <el-button type="primary" size="large" class="choose-btn">
            <el-icon><FolderOpened /></el-icon>
            选择文件
          </el-button>
        </div>
        <div v-else class="file-info" @click.stop>
          <div class="file-icon-wrap">
            <el-icon :size="48" color="#165DFF">
              <Document />
            </el-icon>
            <div class="file-details">
              <div class="file-name" :title="selectedFile.name">{{ selectedFile.name }}</div>
              <div class="file-meta">
                <el-tag size="small" type="info">大小: {{ formatFileSize(selectedFile.size) }}</el-tag>
                <el-tag v-if="selectedFile.type" size="small">类型: {{ selectedFile.type || '未知' }}</el-tag>
                <el-tag size="small" type="success">最后修改: {{ formatFileDate(selectedFile.lastModified) }}</el-tag>
              </div>
            </div>
          </div>
          <div class="file-actions">
            <el-button
              type="primary"
              :icon="Refresh"
              :loading="isCalculating"
              @click.stop="calculateHashes"
              :disabled="isCalculating"
            >
              {{ isCalculating ? '计算中...' : '重新计算' }}
            </el-button>
            <el-button
              :icon="Delete"
              @click.stop="clearFile"
              :disabled="isCalculating"
            >
              移除文件
            </el-button>
          </div>
        </div>
        <el-progress
          v-if="isCalculating"
          :percentage="progress"
          :stroke-width="8"
          :text-inside="true"
          status="success"
          class="progress-bar"
        />
      </div>

      <el-divider v-if="hashes.md5 || hashes.sha1 || hashes.sha256" />

      <div v-if="hashes.md5 || hashes.sha1 || hashes.sha256" class="verify-section">
        <h4 class="verify-title">
          <el-icon :size="16" color="#67C23A"><CircleCheck /></el-icon>
          <span>哈希值校验</span>
        </h4>
        <div class="verify-input">
          <el-input
            v-model="verifyHash"
            placeholder="粘贴官方提供的哈希值进行比对验证"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><Key /></el-icon>
            </template>
          </el-input>
          <el-button
            size="large"
            type="primary"
            @click="verifyHashValue"
            :disabled="!verifyHash.trim()"
          >
            比对验证
          </el-button>
        </div>
        <el-alert
          v-if="verifyResult !== null"
          :title="verifyResult ? '✅ 校验通过！文件未被篡改' : '❌ 校验失败！文件可能已被篡改或损坏'"
          :type="verifyResult ? 'success' : 'error'"
          :closable="false"
          show-icon
          class="verify-alert"
        />
      </div>
    </el-card>

    <el-card v-if="hashes.md5 || hashes.sha1 || hashes.sha256" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataLine />
          </el-icon>
          <span>计算结果</span>
          <el-tag size="small" type="success">计算完成</el-tag>
        </div>
        <div class="header-actions">
          <el-button size="small" :icon="CopyDocument" @click="copyAllHashes">复制全部</el-button>
        </div>
      </template>

      <div class="hash-results">
        <div
          v-for="(item, key) in hashResultList"
          :key="key"
          class="hash-item"
        >
          <div class="hash-header">
            <div class="hash-algo">
              <el-tag :type="item.tagType" size="large">{{ item.name }}</el-tag>
              <span class="hash-desc">{{ item.desc }}</span>
            </div>
            <el-button
              type="primary"
              link
              :icon="CopyDocument"
              @click="copyHash(item.value, item.name)"
              size="small"
            >
              复制
            </el-button>
          </div>
          <div class="hash-value-wrapper" @click="copyHash(item.value, item.name)">
            <code class="hash-value">{{ item.value || '-' }}</code>
            <div class="hash-copy-hint">
              <el-icon :size="12"><CopyDocument /></el-icon>
              <span>点击复制</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  InfoFilled,
  Warning,
  FolderOpened,
  UploadFilled,
  Document,
  Refresh,
  Delete,
  Key,
  CircleCheck,
  DataLine,
  CopyDocument
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const algorithms = [
  { name: 'MD5', desc: '广泛用于文件校验和数字签名', length: '128位 (32字符)' },
  { name: 'SHA-1', desc: 'SHA家族第一代，已不推荐用于安全场景', length: '160位 (40字符)' },
  { name: 'SHA-256', desc: 'SHA-2家族，安全性更高', length: '256位 (64字符)' }
]

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragover = ref(false)
const isCalculating = ref(false)
const progress = ref(0)
const verifyHash = ref('')
const verifyResult = ref<boolean | null>(null)

const hashes = reactive({
  md5: '',
  sha1: '',
  sha256: ''
})

const hashResultList = computed(() => [
  { name: 'MD5', desc: '信息摘要算法第五版', tagType: 'warning' as const, value: hashes.md5 },
  { name: 'SHA-1', desc: '安全哈希算法 1', tagType: 'info' as const, value: hashes.sha1 },
  { name: 'SHA-256', desc: '安全哈希算法 256位', tagType: 'success' as const, value: hashes.sha256 }
])

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatFileDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const triggerFileInput = () => {
  if (fileInputRef.value && !isCalculating.value) {
    fileInputRef.value.click()
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    hashes.md5 = ''
    hashes.sha1 = ''
    hashes.sha256 = ''
    verifyResult.value = null
    calculateHashes()
  }
}

const handleDragOver = () => {
  if (!isCalculating.value) {
    isDragover.value = true
  }
}

const handleDragLeave = () => {
  isDragover.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragover.value = false
  if (event.dataTransfer && event.dataTransfer.files.length > 0 && !isCalculating.value) {
    selectedFile.value = event.dataTransfer.files[0]
    hashes.md5 = ''
    hashes.sha1 = ''
    hashes.sha256 = ''
    verifyResult.value = null
    calculateHashes()
  }
}

const clearFile = () => {
  selectedFile.value = null
  hashes.md5 = ''
  hashes.sha1 = ''
  hashes.sha256 = ''
  verifyHash.value = ''
  verifyResult.value = null
  progress.value = 0
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const addUnsigned = (lX: number, lY: number): number => {
  const lX4 = lX & 0x80000000
  const lY4 = lY & 0x80000000
  const lX8 = lX & 0x40000000
  const lY8 = lY & 0x40000000
  const lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
  if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8
  if (lX4 | lY4) {
    if (lResult & 0x40000000) return lResult ^ 0xC0000000
    else return lResult ^ 0x40000000
  } else return lResult ^ lX8 ^ lY8
}

const rotateLeft = (lValue: number, iShiftBits: number): number => {
  return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
}

const md5F = (x: number, y: number, z: number): number => (x & y) | (~x & z)
const md5G = (x: number, y: number, z: number): number => (x & z) | (y & ~z)
const md5H = (x: number, y: number, z: number): number => x ^ y ^ z
const md5I = (x: number, y: number, z: number): number => y ^ (x | ~z)

const md5FF = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
  return addUnsigned(rotateLeft(addUnsigned(a, addUnsigned(addUnsigned(md5F(b, c, d), x), ac)), s), b)
}
const md5GG = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
  return addUnsigned(rotateLeft(addUnsigned(a, addUnsigned(addUnsigned(md5G(b, c, d), x), ac)), s), b)
}
const md5HH = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
  return addUnsigned(rotateLeft(addUnsigned(a, addUnsigned(addUnsigned(md5H(b, c, d), x), ac)), s), b)
}
const md5II = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
  return addUnsigned(rotateLeft(addUnsigned(a, addUnsigned(addUnsigned(md5I(b, c, d), x), ac)), s), b)
}

const convertToWordArray = (input: string): number[] => {
  let lWordCount
  const lMessageLength = input.length
  const lNumberOfWordsTemp1 = lMessageLength + 8
  const lNumberOfWordsTemp2 = Math.floor((lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64)
  const lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16
  const lWordArray: number[] = new Array(lNumberOfWords - 1).fill(0)
  let lBytePosition = 0
  let lByteCount = 0
  while (lByteCount < lMessageLength) {
    lWordCount = Math.floor((lByteCount - (lByteCount % 4)) / 4)
    lBytePosition = (lByteCount % 4) * 8
    lWordArray[lWordCount] = lWordArray[lWordCount] | (input.charCodeAt(lByteCount) << lBytePosition)
    lByteCount++
  }
  lWordCount = Math.floor((lByteCount - (lByteCount % 4)) / 4)
  lBytePosition = (lByteCount % 4) * 8
  lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
  lWordArray[lNumberOfWords - 2] = lMessageLength << 3
  lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
  return lWordArray
}

const wordToHex = (lValue: number): string => {
  let wordToHexValue = ''
  let lByte
  for (let lCount = 0; lCount <= 3; lCount++) {
    lByte = (lValue >>> (lCount * 8)) & 255
    wordToHexValue += ('0' + lByte.toString(16)).slice(-2)
  }
  return wordToHexValue
}

const md5FromString = (string: string): string => {
  const x = convertToWordArray(string)
  let a = 0x67452301
  let b = 0xEFCDAB89
  let c = 0x98BADCFE
  let d = 0x10325476

  const S11 = 7, S12 = 12, S13 = 17, S14 = 22
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21

  for (let k = 0; k < x.length; k += 16) {
    const AA = a
    const BB = b
    const CC = c
    const DD = d

    a = md5FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
    d = md5FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
    c = md5FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
    b = md5FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
    a = md5FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
    d = md5FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
    c = md5FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
    b = md5FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
    a = md5FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
    d = md5FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
    c = md5FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
    b = md5FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
    a = md5FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
    d = md5FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
    c = md5FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
    b = md5FF(b, c, d, a, x[k + 15], S14, 0x49B40821)

    a = md5GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
    d = md5GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
    c = md5GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
    b = md5GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
    a = md5GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
    d = md5GG(d, a, b, c, x[k + 10], S22, 0x2441453)
    c = md5GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
    b = md5GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
    a = md5GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
    d = md5GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
    c = md5GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
    b = md5GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
    a = md5GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
    d = md5GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
    c = md5GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
    b = md5GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)

    a = md5HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
    d = md5HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
    c = md5HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
    b = md5HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
    a = md5HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
    d = md5HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
    c = md5HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
    b = md5HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
    a = md5HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
    d = md5HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
    c = md5HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
    b = md5HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
    a = md5HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
    d = md5HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
    c = md5HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
    b = md5HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)

    a = md5II(a, b, c, d, x[k + 0], S41, 0xF4292244)
    d = md5II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
    c = md5II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
    b = md5II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
    a = md5II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
    d = md5II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
    c = md5II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
    b = md5II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
    a = md5II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
    d = md5II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
    c = md5II(c, d, a, b, x[k + 6], S43, 0xA3014314)
    b = md5II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
    a = md5II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
    d = md5II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
    c = md5II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
    b = md5II(b, c, d, a, x[k + 9], S44, 0xEB86D391)

    a = addUnsigned(a, AA)
    b = addUnsigned(b, BB)
    c = addUnsigned(c, CC)
    d = addUnsigned(d, DD)
  }
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase()
}

const bufferToHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

const calculateHashes = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }

  const file = selectedFile.value
  isCalculating.value = true
  progress.value = 0
  hashes.md5 = ''
  hashes.sha1 = ''
  hashes.sha256 = ''
  verifyResult.value = null

  try {
    const chunkSize = 2 * 1024 * 1024
    const totalChunks = Math.ceil(file.size / chunkSize)
    const allChunks: Uint8Array[] = []

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)
      const buffer = await chunk.arrayBuffer()
      allChunks.push(new Uint8Array(buffer))
      progress.value = Math.round(((i + 1) / totalChunks) * 100)
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    const totalLength = allChunks.reduce((sum, chunk) => sum + chunk.length, 0)
    const combined = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of allChunks) {
      combined.set(chunk, offset)
      offset += chunk.length
    }

    let binary = ''
    for (let i = 0; i < combined.byteLength; i++) {
      binary += String.fromCharCode(combined[i])
    }
    hashes.md5 = md5FromString(binary)

    if (crypto && crypto.subtle) {
      const sha1Buffer = await crypto.subtle.digest('SHA-1', combined)
      hashes.sha1 = bufferToHex(sha1Buffer)

      const sha256Buffer = await crypto.subtle.digest('SHA-256', combined)
      hashes.sha256 = bufferToHex(sha256Buffer)
    }

    ElMessage.success('哈希值计算完成')
  } catch (error) {
    console.error('计算哈希值失败:', error)
    ElMessage.error('计算哈希值失败')
  } finally {
    isCalculating.value = false
  }
}

const copyHash = async (value: string, name: string) => {
  if (!value) return
  try {
    await navigator.clipboard.writeText(value)
    ElMessage.success(`${name} 已复制到剪贴板`)
  } catch (e) {
    const textarea = document.createElement('textarea')
    textarea.value = value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success(`${name} 已复制到剪贴板`)
  }
}

const copyAllHashes = async () => {
  const lines: string[] = []
  if (hashes.md5) lines.push(`MD5: ${hashes.md5}`)
  if (hashes.sha1) lines.push(`SHA-1: ${hashes.sha1}`)
  if (hashes.sha256) lines.push(`SHA-256: ${hashes.sha256}`)
  const all = lines.join('\n')
  try {
    await navigator.clipboard.writeText(all)
    ElMessage.success('所有哈希值已复制')
  } catch (e) {
    const textarea = document.createElement('textarea')
    textarea.value = all
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('所有哈希值已复制')
  }
}

const verifyHashValue = () => {
  const target = verifyHash.value.trim().toLowerCase()
  if (!target) {
    ElMessage.warning('请输入要比对的哈希值')
    return
  }
  const computed = [hashes.md5.toLowerCase(), hashes.sha1.toLowerCase(), hashes.sha256.toLowerCase()]
  verifyResult.value = computed.includes(target)
}
</script>

<style scoped>
.file-hash-calculator {
  max-width: 1000px;
  margin: 0 auto;
}

.guide-card,
.upload-card,
.result-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.header-tag {
  margin-left: 12px;
  font-weight: normal;
}

.header-actions {
  margin-left: auto;
}

.guide-steps {
  padding: 10px 0;
}

.hash-info {
  padding: 0 4px;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: #303133;
  margin: 0 0 16px;
}

.algo-item {
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
  height: 100%;
}

.algo-name {
  font-size: 16px;
  font-weight: 600;
  color: #165DFF;
  margin-bottom: 6px;
}

.algo-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}

.algo-length {
  font-size: 12px;
  color: #909399;
  font-family: 'Monaco', 'Menlo', monospace;
}

.upload-area {
  position: relative;
  border: 2px dashed #dcdfe6;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #165DFF;
  background: #f0f7ff;
}

.upload-area.is-dragover {
  border-color: #165DFF;
  background: #ecf5ff;
  border-style: solid;
}

.upload-area.has-file {
  padding: 24px;
}

.file-input {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-icon {
  margin-bottom: 8px;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upload-main {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.upload-sub {
  font-size: 13px;
  color: #909399;
}

.choose-btn {
  margin-top: 8px;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  cursor: default;
}

.file-icon-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.file-details {
  text-align: left;
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.file-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.progress-bar {
  margin: 20px 0 0;
}

.verify-section {
  margin-top: 8px;
}

.verify-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px;
}

.verify-input {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.verify-alert {
  margin-top: 12px;
}

.hash-results {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hash-item {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.hash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.hash-algo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hash-desc {
  font-size: 13px;
  color: #909399;
}

.hash-value-wrapper {
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hash-value-wrapper:hover .hash-value {
  border-color: #165DFF;
  background: #f0f7ff;
}

.hash-value-wrapper:hover .hash-copy-hint {
  opacity: 1;
  visibility: visible;
}

.hash-value {
  display: block;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #165DFF;
  word-break: break-all;
  line-height: 1.6;
  padding: 12px 100px 12px 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #ebeef5;
  transition: all 0.2s ease;
}

.hash-copy-hint {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #165DFF;
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
}

@media (max-width: 768px) {
  .file-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .file-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .verify-input {
    flex-direction: column;
  }

  .verify-input .el-input,
  .verify-input .el-button {
    width: 100%;
  }
}
</style>
