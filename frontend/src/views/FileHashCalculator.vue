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
      <el-steps :active="currentStep" finish-status="success" simple class="guide-steps">
        <el-step title="选择文件" description="通过拖拽或点击选择要校验的文件" />
        <el-step title="计算哈希" :description="isCalculating ? `已用时 ${elapsedTimeText} · 预计剩余 ${remainingTimeText}` : '系统自动计算 MD5、SHA1、SHA256 哈希值'" />
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
      </div>
    </el-card>

    <el-card v-if="selectedFile" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataLine />
          </el-icon>
          <span>计算结果</span>
          <el-tag
            v-if="hasAllResults"
            size="small"
            type="success"
            :icon="CircleCheck"
          >
            全部计算完成 · 用时 {{ elapsedTimeText }}
          </el-tag>
          <el-tag
            v-else-if="isCalculating"
            size="small"
            type="warning"
            effect="dark"
            :icon="Loading"
          >
            正在计算 · {{ overallProgress }}%
          </el-tag>
          <el-tag v-else size="small" type="info">等待计算</el-tag>
        </div>
        <div class="header-actions">
          <el-button
            size="small"
            :icon="CopyDocument"
            @click="copyAllHashes"
            :disabled="!hasAllResults || isCalculating"
          >
            复制全部
          </el-button>
        </div>
      </template>

      <div v-if="isCalculating" class="overall-progress-section">
        <div class="progress-header">
          <span class="progress-title">
            <el-icon class="is-loading"><Loading /></el-icon>
            总进度
          </span>
          <span class="progress-time">
            <el-icon><Timer /></el-icon>
            已用: <strong>{{ elapsedTimeText }}</strong>
            <span class="time-sep">|</span>
            <el-icon><Hourglass /></el-icon>
            剩余: <strong>{{ remainingTimeText }}</strong>
          </span>
        </div>
        <el-progress
          :percentage="overallProgress"
          :stroke-width="14"
          :text-inside="true"
          status="success"
          :striped="true"
          :striped-flow="true"
        />
        <div class="progress-stages">
          <el-tag
            v-for="(stage, idx) in stages"
            :key="idx"
            size="small"
            :type="getStageTagType(idx)"
            :effect="getStageTagEffect(idx)"
            class="stage-tag"
          >
            <el-icon v-if="stageStatus[idx] === 'done'"><CircleCheck /></el-icon>
            <el-icon v-else-if="stageStatus[idx] === 'active'" class="is-loading"><Loading /></el-icon>
            <el-icon v-else><Clock /></el-icon>
            {{ stage.name }} {{ stageProgress[idx] }}%
          </el-tag>
        </div>
      </div>

      <div v-if="isCalculating && selectedFile.size > 50 * 1024 * 1024" class="large-file-tip">
        <el-alert
          type="info"
          :closable="false"
          show-icon
          title="检测到大文件，计算需要一定时间，请耐心等待..."
          description="MD5 使用纯 JS 计算，速度较慢；SHA-1/SHA-256 使用浏览器原生 API，速度较快。您可以继续浏览其他页面，计算不会中断。"
        />
      </div>

      <div class="hash-results">
        <div
          v-for="(item, key) in hashResultList"
          :key="key"
          class="hash-item"
          :class="{ 'is-calculating': item.status === 'calculating', 'is-done': item.status === 'done' }"
        >
          <div class="hash-header">
            <div class="hash-algo">
              <el-tag :type="item.tagType" size="large">{{ item.name }}</el-tag>
              <span class="hash-desc">{{ item.desc }}</span>
              <el-tag
                v-if="item.status === 'done'"
                size="small"
                type="success"
                effect="plain"
              >
                <el-icon><CircleCheck /></el-icon>
                已完成
              </el-tag>
              <el-tag
                v-else-if="item.status === 'calculating'"
                size="small"
                type="warning"
                effect="dark"
              >
                <el-icon class="is-loading"><Loading /></el-icon>
                计算中 {{ stageProgress[item.stageIndex] }}%
              </el-tag>
              <el-tag v-else size="small" type="info" effect="plain">等待中</el-tag>
            </div>
            <el-tooltip
              v-if="!item.value"
              content="计算完成后可复制"
              placement="top"
            >
              <el-button
                type="primary"
                link
                :icon="CopyDocument"
                @click="copyHash(item.value, item.name)"
                size="small"
                disabled
              >
                复制
              </el-button>
            </el-tooltip>
            <el-button
              v-else
              type="primary"
              link
              :icon="CopyDocument"
              @click="copyHash(item.value, item.name)"
              size="small"
            >
              复制
            </el-button>
          </div>

          <el-progress
            v-if="item.status === 'calculating'"
            :percentage="stageProgress[item.stageIndex]"
            :stroke-width="6"
            :show-text="false"
            status="warning"
            class="hash-progress"
          />

          <div
            class="hash-value-wrapper"
            :class="{ 'can-copy': item.value, 'is-loading': item.status === 'calculating' }"
            @click="item.value && copyHash(item.value, item.name)"
          >
            <div v-if="item.status === 'calculating'" class="hash-loading">
              <el-icon class="is-loading" :size="18"><Loading /></el-icon>
              <span>正在计算 {{ item.name }} ({{ stageProgress[item.stageIndex] }}%)，请稍候...</span>
            </div>
            <div v-else-if="item.status === 'pending'" class="hash-pending">
              <el-icon :size="18"><Clock /></el-icon>
              <span>等待计算 (排在第 {{ item.stageIndex + 1 }} 位)...</span>
            </div>
            <template v-else>
              <code class="hash-value">{{ item.value }}</code>
              <div class="hash-copy-hint">
                <el-icon :size="12"><CopyDocument /></el-icon>
                <span>点击复制</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="selectedFile && hasAllResults" class="verify-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <CircleCheck />
          </el-icon>
          <span>哈希值校验</span>
        </div>
      </template>
      <div class="verify-section">
        <h4 class="verify-title">粘贴官方提供的哈希值进行比对验证</h4>
        <div class="verify-input">
          <el-input
            v-model="verifyHash"
            placeholder="例如：d41d8cd98f00b204e9800998ecf8427e"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onUnmounted } from 'vue'
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
  CopyDocument,
  Loading,
  Clock,
  Timer,
  Hourglass
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

type HashStatus = 'pending' | 'calculating' | 'done'
type StageStatus = 'pending' | 'active' | 'done'

interface HashResultItem {
  name: string
  desc: string
  tagType: 'warning' | 'info' | 'success'
  value: string
  status: HashStatus
  stageIndex: number
}

const algorithms = [
  { name: 'MD5', desc: '广泛用于文件校验和数字签名', length: '128位 (32字符)' },
  { name: 'SHA-1', desc: 'SHA家族第一代，已不推荐用于安全场景', length: '160位 (40字符)' },
  { name: 'SHA-256', desc: 'SHA-2家族，安全性更高', length: '256位 (64字符)' }
]

const STAGE_READ = 0
const STAGE_MD5 = 1
const STAGE_SHA1 = 2
const STAGE_SHA256 = 3

const stages = [
  { name: '读取文件', weight: 15 },
  { name: '计算 MD5', weight: 55 },
  { name: '计算 SHA-1', weight: 15 },
  { name: '计算 SHA-256', weight: 15 }
]

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragover = ref(false)
const isCalculating = ref(false)
const verifyHash = ref('')
const verifyResult = ref<boolean | null>(null)

const stageProgress = reactive<number[]>([0, 0, 0, 0])
const stageStatus = reactive<StageStatus[]>(['pending', 'pending', 'pending', 'pending'])

const hashStatus = reactive<Record<string, HashStatus>>({
  md5: 'pending',
  sha1: 'pending',
  sha256: 'pending'
})

const hashes = reactive({
  md5: '',
  sha1: '',
  sha256: ''
})

const startTime = ref<number>(0)
const elapsedMs = ref<number>(0)
let timerId: number | null = null

const overallProgress = computed(() => {
  let total = 0
  for (let i = 0; i < stages.length; i++) {
    total += (stageProgress[i] / 100) * stages[i].weight
  }
  return Math.round(total)
})

const hasAllResults = computed(() => hashes.md5 && hashes.sha1 && hashes.sha256)

const currentStep = computed(() => {
  if (!selectedFile.value) return 0
  if (!hasAllResults.value) return 1
  if (verifyResult.value === null) return 2
  return 3
})

const hashResultList = computed<HashResultItem[]>(() => [
  { name: 'MD5', desc: '信息摘要算法第五版', tagType: 'warning', value: hashes.md5, status: hashStatus.md5, stageIndex: STAGE_MD5 },
  { name: 'SHA-1', desc: '安全哈希算法 1', tagType: 'info', value: hashes.sha1, status: hashStatus.sha1, stageIndex: STAGE_SHA1 },
  { name: 'SHA-256', desc: '安全哈希算法 256位', tagType: 'success', value: hashes.sha256, status: hashStatus.sha256, stageIndex: STAGE_SHA256 }
])

const elapsedTimeText = computed(() => formatDuration(elapsedMs.value))
const remainingTimeText = computed(() => {
  if (!isCalculating.value || overallProgress.value < 5 || elapsedMs.value < 1000) {
    return '估算中...'
  }
  const totalEstimated = (elapsedMs.value / overallProgress.value) * 100
  const remaining = Math.max(0, totalEstimated - elapsedMs.value)
  return formatDuration(remaining)
})

const getStageTagType = (idx: number) => {
  if (stageStatus[idx] === 'done') return 'success'
  if (stageStatus[idx] === 'active') return 'warning'
  return 'info'
}

const getStageTagEffect = (idx: number) => {
  if (stageStatus[idx] === 'active') return 'dark'
  return 'plain'
}

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}小时${minutes}分${seconds}秒`
  }
  if (minutes > 0) {
    return `${minutes}分${seconds}秒`
  }
  return `${seconds}秒`
}

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

const startTimer = () => {
  startTime.value = Date.now()
  elapsedMs.value = 0
  timerId = window.setInterval(() => {
    elapsedMs.value = Date.now() - startTime.value
  }, 200)
}

const stopTimer = () => {
  if (timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }
  elapsedMs.value = Date.now() - startTime.value
}

const setStage = (idx: number, status: StageStatus, progress: number = 0) => {
  stageStatus[idx] = status
  stageProgress[idx] = progress
}

const triggerFileInput = () => {
  if (fileInputRef.value && !isCalculating.value) {
    fileInputRef.value.click()
  }
}

const resetHashState = () => {
  hashes.md5 = ''
  hashes.sha1 = ''
  hashes.sha256 = ''
  hashStatus.md5 = 'pending'
  hashStatus.sha1 = 'pending'
  hashStatus.sha256 = 'pending'
  for (let i = 0; i < stages.length; i++) {
    stageStatus[i] = 'pending'
    stageProgress[i] = 0
  }
  verifyResult.value = null
  elapsedMs.value = 0
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    resetHashState()
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
    resetHashState()
    calculateHashes()
  }
}

const clearFile = () => {
  stopTimer()
  selectedFile.value = null
  resetHashState()
  verifyHash.value = ''
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

const wordToHex = (lValue: number): string => {
  let wordToHexValue = ''
  let lByte
  for (let lCount = 0; lCount <= 3; lCount++) {
    lByte = (lValue >>> (lCount * 8)) & 255
    wordToHexValue += ('0' + lByte.toString(16)).slice(-2)
  }
  return wordToHexValue
}

class MD5Stream {
  a: number
  b: number
  c: number
  d: number
  buffer: Uint8Array
  bufferLen: number
  totalLen: number

  constructor() {
    this.a = 0x67452301
    this.b = 0xEFCDAB89
    this.c = 0x98BADCFE
    this.d = 0x10325476
    this.buffer = new Uint8Array(64)
    this.bufferLen = 0
    this.totalLen = 0
  }

  private processBlock(block: Uint8Array) {
    const S11 = 7, S12 = 12, S13 = 17, S14 = 22
    const S21 = 5, S22 = 9, S23 = 14, S24 = 20
    const S31 = 4, S32 = 11, S33 = 16, S34 = 23
    const S41 = 6, S42 = 10, S43 = 15, S44 = 21

    const x: number[] = new Array(16)
    for (let i = 0; i < 16; i++) {
      x[i] = block[i * 4] |
             (block[i * 4 + 1] << 8) |
             (block[i * 4 + 2] << 16) |
             (block[i * 4 + 3] << 24)
    }

    let a = this.a, b = this.b, c = this.c, d = this.d

    a = md5FF(a, b, c, d, x[0], S11, 0xD76AA478)
    d = md5FF(d, a, b, c, x[1], S12, 0xE8C7B756)
    c = md5FF(c, d, a, b, x[2], S13, 0x242070DB)
    b = md5FF(b, c, d, a, x[3], S14, 0xC1BDCEEE)
    a = md5FF(a, b, c, d, x[4], S11, 0xF57C0FAF)
    d = md5FF(d, a, b, c, x[5], S12, 0x4787C62A)
    c = md5FF(c, d, a, b, x[6], S13, 0xA8304613)
    b = md5FF(b, c, d, a, x[7], S14, 0xFD469501)
    a = md5FF(a, b, c, d, x[8], S11, 0x698098D8)
    d = md5FF(d, a, b, c, x[9], S12, 0x8B44F7AF)
    c = md5FF(c, d, a, b, x[10], S13, 0xFFFF5BB1)
    b = md5FF(b, c, d, a, x[11], S14, 0x895CD7BE)
    a = md5FF(a, b, c, d, x[12], S11, 0x6B901122)
    d = md5FF(d, a, b, c, x[13], S12, 0xFD987193)
    c = md5FF(c, d, a, b, x[14], S13, 0xA679438E)
    b = md5FF(b, c, d, a, x[15], S14, 0x49B40821)

    a = md5GG(a, b, c, d, x[1], S21, 0xF61E2562)
    d = md5GG(d, a, b, c, x[6], S22, 0xC040B340)
    c = md5GG(c, d, a, b, x[11], S23, 0x265E5A51)
    b = md5GG(b, c, d, a, x[0], S24, 0xE9B6C7AA)
    a = md5GG(a, b, c, d, x[5], S21, 0xD62F105D)
    d = md5GG(d, a, b, c, x[10], S22, 0x2441453)
    c = md5GG(c, d, a, b, x[15], S23, 0xD8A1E681)
    b = md5GG(b, c, d, a, x[4], S24, 0xE7D3FBC8)
    a = md5GG(a, b, c, d, x[9], S21, 0x21E1CDE6)
    d = md5GG(d, a, b, c, x[14], S22, 0xC33707D6)
    c = md5GG(c, d, a, b, x[3], S23, 0xF4D50D87)
    b = md5GG(b, c, d, a, x[8], S24, 0x455A14ED)
    a = md5GG(a, b, c, d, x[13], S21, 0xA9E3E905)
    d = md5GG(d, a, b, c, x[2], S22, 0xFCEFA3F8)
    c = md5GG(c, d, a, b, x[7], S23, 0x676F02D9)
    b = md5GG(b, c, d, a, x[12], S24, 0x8D2A4C8A)

    a = md5HH(a, b, c, d, x[5], S31, 0xFFFA3942)
    d = md5HH(d, a, b, c, x[8], S32, 0x8771F681)
    c = md5HH(c, d, a, b, x[11], S33, 0x6D9D6122)
    b = md5HH(b, c, d, a, x[14], S34, 0xFDE5380C)
    a = md5HH(a, b, c, d, x[1], S31, 0xA4BEEA44)
    d = md5HH(d, a, b, c, x[4], S32, 0x4BDECFA9)
    c = md5HH(c, d, a, b, x[7], S33, 0xF6BB4B60)
    b = md5HH(b, c, d, a, x[10], S34, 0xBEBFBC70)
    a = md5HH(a, b, c, d, x[13], S31, 0x289B7EC6)
    d = md5HH(d, a, b, c, x[0], S32, 0xEAA127FA)
    c = md5HH(c, d, a, b, x[3], S33, 0xD4EF3085)
    b = md5HH(b, c, d, a, x[6], S34, 0x4881D05)
    a = md5HH(a, b, c, d, x[9], S31, 0xD9D4D039)
    d = md5HH(d, a, b, c, x[12], S32, 0xE6DB99E5)
    c = md5HH(c, d, a, b, x[15], S33, 0x1FA27CF8)
    b = md5HH(b, c, d, a, x[2], S34, 0xC4AC5665)

    a = md5II(a, b, c, d, x[0], S41, 0xF4292244)
    d = md5II(d, a, b, c, x[7], S42, 0x432AFF97)
    c = md5II(c, d, a, b, x[14], S43, 0xAB9423A7)
    b = md5II(b, c, d, a, x[5], S44, 0xFC93A039)
    a = md5II(a, b, c, d, x[12], S41, 0x655B59C3)
    d = md5II(d, a, b, c, x[3], S42, 0x8F0CCC92)
    c = md5II(c, d, a, b, x[10], S43, 0xFFEFF47D)
    b = md5II(b, c, d, a, x[1], S44, 0x85845DD1)
    a = md5II(a, b, c, d, x[8], S41, 0x6FA87E4F)
    d = md5II(d, a, b, c, x[15], S42, 0xFE2CE6E0)
    c = md5II(c, d, a, b, x[6], S43, 0xA3014314)
    b = md5II(b, c, d, a, x[13], S44, 0x4E0811A1)
    a = md5II(a, b, c, d, x[4], S41, 0xF7537E82)
    d = md5II(d, a, b, c, x[11], S42, 0xBD3AF235)
    c = md5II(c, d, a, b, x[2], S43, 0x2AD7D2BB)
    b = md5II(b, c, d, a, x[9], S44, 0xEB86D391)

    this.a = addUnsigned(this.a, a)
    this.b = addUnsigned(this.b, b)
    this.c = addUnsigned(this.c, c)
    this.d = addUnsigned(this.d, d)
  }

  update(data: Uint8Array) {
    this.totalLen += data.length
    let offset = 0

    if (this.bufferLen > 0) {
      const needed = 64 - this.bufferLen
      if (data.length >= needed) {
        this.buffer.set(data.subarray(0, needed), this.bufferLen)
        this.processBlock(this.buffer)
        this.bufferLen = 0
        offset = needed
      } else {
        this.buffer.set(data, this.bufferLen)
        this.bufferLen += data.length
        return
      }
    }

    while (offset + 64 <= data.length) {
      this.processBlock(data.subarray(offset, offset + 64))
      offset += 64
    }

    if (offset < data.length) {
      this.buffer.set(data.subarray(offset), this.bufferLen)
      this.bufferLen += data.length - offset
    }
  }

  digest(): string {
    const totalBits = this.totalLen * 8
    const padding = new Uint8Array(64)
    padding[0] = 0x80

    if (this.bufferLen < 56) {
      padding.set(padding.subarray(0, 56 - this.bufferLen), 0)
      this.update(padding.subarray(0, 56 - this.bufferLen))
    } else {
      padding.set(padding.subarray(0, 64 - this.bufferLen), 0)
      this.update(padding.subarray(0, 64 - this.bufferLen))
      this.update(padding.subarray(0, 56))
    }

    const lenBytes = new Uint8Array(8)
    lenBytes[0] = totalBits & 0xff
    lenBytes[1] = (totalBits >>> 8) & 0xff
    lenBytes[2] = (totalBits >>> 16) & 0xff
    lenBytes[3] = (totalBits >>> 24) & 0xff
    lenBytes[4] = (totalBits >>> 32) & 0xff
    lenBytes[5] = (totalBits >>> 40) & 0xff
    lenBytes[6] = (totalBits >>> 48) & 0xff
    lenBytes[7] = (totalBits >>> 56) & 0xff
    this.update(lenBytes)

    return (wordToHex(this.a) + wordToHex(this.b) + wordToHex(this.c) + wordToHex(this.d)).toLowerCase()
  }
}

const bufferToHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

const readFileInChunks = async (file: File, onProgress?: (percent: number) => void): Promise<Uint8Array[]> => {
  const chunkSize = 2 * 1024 * 1024
  const totalChunks = Math.ceil(file.size / chunkSize)
  const chunks: Uint8Array[] = []

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    const buffer = await chunk.arrayBuffer()
    chunks.push(new Uint8Array(buffer))
    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalChunks) * 100))
    }
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  return chunks
}

const calculateMD5Stream = async (chunks: Uint8Array[], onProgress?: (percent: number) => void): Promise<string> => {
  const md5 = new MD5Stream()
  const reportEvery = Math.max(1, Math.ceil(chunks.length / 100))

  for (let i = 0; i < chunks.length; i++) {
    md5.update(chunks[i])
    if (onProgress && ((i + 1) % reportEvery === 0 || i === chunks.length - 1)) {
      onProgress(Math.round(((i + 1) / chunks.length) * 100))
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }
  return md5.digest()
}

const calculateSHA1Stream = async (chunks: Uint8Array[], onProgress?: (percent: number) => void): Promise<string> => {
  if (!crypto || !crypto.subtle) return ''

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0)
  const combined = new Uint8Array(totalLength)
  let offset = 0
  const reportEvery = Math.max(1, Math.ceil(chunks.length / 50))

  for (let i = 0; i < chunks.length; i++) {
    combined.set(chunks[i], offset)
    offset += chunks[i].length
    if (onProgress && ((i + 1) % reportEvery === 0 || i === chunks.length - 1)) {
      onProgress(Math.round(((i + 1) / chunks.length) * 50))
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  if (onProgress) onProgress(60)
  const buffer = await crypto.subtle.digest('SHA-1', combined)
  if (onProgress) onProgress(100)
  return bufferToHex(buffer)
}

const calculateSHA256Stream = async (chunks: Uint8Array[], onProgress?: (percent: number) => void): Promise<string> => {
  if (!crypto || !crypto.subtle) return ''

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0)
  const combined = new Uint8Array(totalLength)
  let offset = 0
  const reportEvery = Math.max(1, Math.ceil(chunks.length / 50))

  for (let i = 0; i < chunks.length; i++) {
    combined.set(chunks[i], offset)
    offset += chunks[i].length
    if (onProgress && ((i + 1) % reportEvery === 0 || i === chunks.length - 1)) {
      onProgress(Math.round(((i + 1) / chunks.length) * 50))
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  if (onProgress) onProgress(60)
  const buffer = await crypto.subtle.digest('SHA-256', combined)
  if (onProgress) onProgress(100)
  return bufferToHex(buffer)
}

const calculateHashes = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }

  const file = selectedFile.value
  isCalculating.value = true
  resetHashState()
  startTimer()

  try {
    setStage(STAGE_READ, 'active', 0)
    const chunks = await readFileInChunks(file, (p) => {
      stageProgress[STAGE_READ] = p
    })
    setStage(STAGE_READ, 'done', 100)

    setStage(STAGE_MD5, 'active', 0)
    hashStatus.md5 = 'calculating'
    hashes.md5 = await calculateMD5Stream(chunks, (p) => {
      stageProgress[STAGE_MD5] = p
    })
    hashStatus.md5 = 'done'
    setStage(STAGE_MD5, 'done', 100)

    setStage(STAGE_SHA1, 'active', 0)
    hashStatus.sha1 = 'calculating'
    hashes.sha1 = await calculateSHA1Stream(chunks, (p) => {
      stageProgress[STAGE_SHA1] = p
    })
    hashStatus.sha1 = 'done'
    setStage(STAGE_SHA1, 'done', 100)

    setStage(STAGE_SHA256, 'active', 0)
    hashStatus.sha256 = 'calculating'
    hashes.sha256 = await calculateSHA256Stream(chunks, (p) => {
      stageProgress[STAGE_SHA256] = p
    })
    hashStatus.sha256 = 'done'
    setStage(STAGE_SHA256, 'done', 100)

    ElMessage.success(`哈希值计算完成，用时 ${elapsedTimeText.value}`)
  } catch (error) {
    console.error('计算哈希值失败:', error)
    resetHashState()
    ElMessage.error('计算哈希值失败')
  } finally {
    stopTimer()
    isCalculating.value = false
  }
}

const copyHash = async (value: string, name: string) => {
  if (!value) {
    ElMessage.warning('请等待计算完成后再复制')
    return
  }
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
  if (!hasAllResults.value || isCalculating.value) {
    ElMessage.warning('请等待所有哈希值计算完成后再复制')
    return
  }
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
  if (!hasAllResults.value) {
    ElMessage.warning('请等待计算完成后再进行校验')
    return
  }
  const target = verifyHash.value.trim().toLowerCase()
  if (!target) {
    ElMessage.warning('请输入要比对的哈希值')
    return
  }
  const computed = [hashes.md5.toLowerCase(), hashes.sha1.toLowerCase(), hashes.sha256.toLowerCase()]
  verifyResult.value = computed.includes(target)
}

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.file-hash-calculator {
  max-width: 1000px;
  margin: 0 auto;
}

.guide-card,
.upload-card,
.result-card,
.verify-card {
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

.overall-progress-section {
  padding: 16px 20px;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #b3d8ff;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.progress-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #165DFF;
}

.progress-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}

.progress-time strong {
  color: #303133;
}

.time-sep {
  color: #c0c4cc;
}

.progress-stages {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.stage-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.large-file-tip {
  margin-bottom: 20px;
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
  transition: all 0.3s;
}

.hash-item.is-calculating {
  border-color: #E6A23C;
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
}

.hash-item.is-done {
  border-color: #67C23A;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
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
  flex-wrap: wrap;
}

.hash-desc {
  font-size: 13px;
  color: #909399;
}

.hash-progress {
  margin-bottom: 12px;
}

.hash-value-wrapper {
  position: relative;
  transition: all 0.2s ease;
}

.hash-value-wrapper.can-copy {
  cursor: pointer;
}

.hash-value-wrapper.can-copy:hover .hash-value {
  border-color: #165DFF;
  background: #f0f7ff;
}

.hash-value-wrapper.can-copy:hover .hash-copy-hint {
  opacity: 1;
  visibility: visible;
}

.hash-value-wrapper.is-loading {
  cursor: progress;
}

.hash-loading,
.hash-pending {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #ebeef5;
  font-size: 14px;
  color: #909399;
  font-style: italic;
}

.hash-loading :deep(.el-icon) {
  color: #E6A23C;
}

.hash-pending :deep(.el-icon) {
  color: #909399;
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

.verify-section {
  padding: 0 4px;
}

.verify-title {
  font-size: 15px;
  font-weight: 500;
  color: #606266;
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

  .progress-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
