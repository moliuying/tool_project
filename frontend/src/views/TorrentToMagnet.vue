<template>
  <div class="torrent-to-magnet">
    <el-card class="value-card" shadow="hover">
      <div class="value-header">
        <div class="value-icon">
          <el-icon :size="48" color="#165DFF"><Link /></el-icon>
        </div>
        <div class="value-title">
          <h2>种子转磁力链接</h2>
          <p>上传 .torrent 文件，<strong>3秒获取可分享的磁力链接</strong></p>
        </div>
        <div class="value-badges">
          <el-tag type="success" effect="light">⚡ 极速转换</el-tag>
          <el-tag type="primary" effect="light">🔒 纯本地解析</el-tag>
          <el-tag type="info" effect="light">📱 支持手机扫码</el-tag>
        </div>
      </div>

      <div class="value-preview">
        <div class="preview-label">
          <el-icon size="14" color="#165DFF"><MagicStick /></el-icon>
          <span>你将获得这样的链接</span>
        </div>
        <div class="preview-box">
          <div class="preview-content">
            <el-icon color="#165DFF" size="20"><Link /></el-icon>
            <span class="preview-text">magnet:?xt=urn:btih:a1b2c3d4...&amp;dn=文件名&amp;tr=tracker...</span>
          </div>
          <div class="preview-actions">
            <el-button type="primary" size="large" disabled>
              <el-icon><CopyDocument /></el-icon>
              一键复制
            </el-button>
            <el-button size="large" disabled>
              <el-icon><Share /></el-icon>
              二维码分享
            </el-button>
          </div>
        </div>
      </div>

      <div class="value-features">
        <div class="feature-item">
          <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
          <span>直接粘贴到任何 BT 下载工具即可下载</span>
        </div>
        <div class="feature-item">
          <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
          <span>通过微信/QQ分享给好友，无需传文件</span>
        </div>
        <div class="feature-item">
          <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
          <span>手机扫码即可在移动端打开下载</span>
        </div>
      </div>
    </el-card>

    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Upload />
          </el-icon>
          <span>上传种子文件</span>
          <el-tag size="small" type="info" class="header-tag">纯本地解析 · 保护隐私</el-tag>
        </div>
      </template>

      <el-upload
        class="upload-area"
        drag
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileChange"
        accept=".torrent"
        :multiple="false"
      >
        <el-icon class="upload-icon"><UploadFilled /></el-icon>
        <div class="upload-text">
          <span v-if="!fileName">拖拽 .torrent 文件到此处，或<em>点击选择文件</em></span>
          <span v-else>已选择文件：<strong>{{ fileName }}</strong></span>
        </div>
        <template #tip>
          <div class="upload-tip">
            <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
            支持标准 BitTorrent 格式文件，仅在浏览器本地解析，不会上传
          </div>
        </template>
      </el-upload>

      <div v-if="fileName" class="file-info-bar">
        <div class="file-info">
          <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
          <span class="file-name">{{ fileName }}</span>
          <el-tag size="small" type="info">{{ formatFileSize(fileSize) }}</el-tag>
        </div>
        <el-button size="small" type="danger" text @click="clearFile">
          <el-icon><Close /></el-icon>
          移除
        </el-button>
      </div>

      <div v-if="!fileName" class="demo-section">
        <el-divider content-position="center">
          <span class="divider-text">或者</span>
        </el-divider>
        <div class="demo-actions">
          <el-button type="success" :icon="View" @click="showDemoResult">
            查看转换结果示例
          </el-button>
          <span class="demo-hint">
            <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
            点击查看磁力链接转换后的完整效果展示
          </span>
        </div>
      </div>
    </el-card>

    <el-card v-if="torrentInfo || isDemoMode" class="result-card">
      <div class="magnet-highlight-section">
        <div class="highlight-header">
          <div class="highlight-title">
            <el-icon :size="28" color="#67C23A"><CircleCheckFilled /></el-icon>
            <div>
              <h3>磁力链接已生成！</h3>
              <p>{{ isDemoMode ? '这是示例数据，上传真实文件获得有效链接' : currentTorrentInfo.name }}</p>
            </div>
          </div>
          <div class="highlight-badge">
            <el-tag size="large" :type="isDemoMode ? 'warning' : 'success'" effect="dark">
              {{ isDemoMode ? '示例' : '成功' }}
            </el-tag>
            <el-button
              v-if="isDemoMode"
              size="small"
              text
              type="primary"
              @click="closeDemo"
            >
              <el-icon><Close /></el-icon>
              关闭示例
            </el-button>
          </div>
        </div>

        <div class="magnet-main-box">
          <div class="magnet-main-content">
            <div class="magnet-icon-wrapper">
              <el-icon :size="32" color="#165DFF"><Link /></el-icon>
            </div>
            <div class="magnet-text-wrapper">
              <div class="magnet-label">可分享磁力链接</div>
              <div class="magnet-main-text" :title="magnetLink">{{ magnetLink }}</div>
            </div>
          </div>
          <div class="magnet-main-actions">
            <el-button type="primary" size="large" :icon="CopyDocument" @click="copyMagnet">
              一键复制链接
            </el-button>
            <el-button size="large" :icon="Share" @click="showQrCode = !showQrCode">
              {{ showQrCode ? '隐藏二维码' : '二维码分享' }}
            </el-button>
          </div>
        </div>

        <div v-if="showQrCode" class="qrcode-main-section">
          <div class="qrcode-main-box">
            <img :src="isDemoMode ? demoQrCodeDataUrl : qrCodeDataUrl" alt="磁力链接二维码" />
            <div class="qrcode-main-desc">
              <el-icon size="14" color="#909399"><InfoFilled /></el-icon>
              手机扫码直接打开，长按图片可保存，或点击下方按钮
            </div>
            <div class="qrcode-actions">
              <el-button size="small" type="primary" @click="downloadQrCode">
                <el-icon><Download /></el-icon>
                下载二维码
              </el-button>
              <el-button size="small" @click="copyQrCodeImage">
                <el-icon><CopyDocument /></el-icon>
                复制图片
              </el-button>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <div class="quick-action-item">
            <el-icon color="#165DFF"><Download /></el-icon>
            <span>粘贴到下载工具</span>
          </div>
          <el-divider direction="vertical" />
          <div class="quick-action-item">
            <el-icon color="#67C23A"><Share /></el-icon>
            <span>发送给好友</span>
          </div>
          <el-divider direction="vertical" />
          <div class="quick-action-item">
            <el-icon color="#E6A23C"><MagicStick /></el-icon>
            <span>永久有效</span>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="result-summary">
        <div class="section-title">
          <el-icon :size="16" color="#165DFF"><DataLine /></el-icon>
          <span>资源概览</span>
        </div>
        <el-row :gutter="24">
          <el-col :span="8">
            <div class="result-item">
              <div class="result-label">资源名称</div>
              <div class="result-value" :title="currentTorrentInfo.name">{{ truncateText(currentTorrentInfo.name, 20) }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="result-item">
              <div class="result-label">文件总数</div>
              <div class="result-value">{{ currentTorrentInfo.files.length }} 个</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="result-item">
              <div class="result-label">总大小</div>
              <div class="result-value highlight">{{ formatFileSize(currentTorrentInfo.length) }}</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-divider />

      <div class="details-section">
        <div class="section-title">
          <el-icon :size="16" color="#165DFF"><Document /></el-icon>
          <span>文件列表</span>
          <el-tag size="small" type="info">共 {{ currentTorrentInfo.files.length }} 个文件</el-tag>
        </div>
        <el-table :data="displayFiles" border stripe style="width: 100%" max-height="300px">
          <el-table-column prop="index" label="序号" width="80" align="center" />
          <el-table-column prop="path" label="文件路径" min-width="300">
            <template #default="{ row }">
              <span :title="row.path">{{ row.path }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="length" label="大小" width="140" align="right">
            <template #default="{ row }">
              {{ formatFileSize(row.length) }}
            </template>
          </el-table-column>
        </el-table>
        <div v-if="currentTorrentInfo.files.length > 10" class="pagination-hint">
          <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
          仅显示前 10 个文件，共 {{ currentTorrentInfo.files.length }} 个文件
        </div>
      </div>

      <el-divider />

      <div class="info-section">
        <div class="section-title">
          <el-icon :size="16" color="#165DFF"><InfoFilled /></el-icon>
          <span>详细信息</span>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Info Hash">
            <code class="hash-code">{{ currentTorrentInfo.infoHash }}</code>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(currentTorrentInfo.created) || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建者">
            {{ currentTorrentInfo.createdBy || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item label="分块大小">
            {{ formatFileSize(currentTorrentInfo.pieceLength) }}
          </el-descriptions-item>
          <el-descriptions-item label="分块数量">
            {{ currentTorrentInfo.pieces ? (currentTorrentInfo.pieces.length / 20) : 0 }} 块
          </el-descriptions-item>
          <el-descriptions-item label="Tracker 数量">
            {{ (currentTorrentInfo.announceList?.length || 0) + (currentTorrentInfo.announce ? 1 : 0) }} 个
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="trackerList.length > 0" class="tracker-section">
          <div class="sub-section-title">
            <el-icon :size="14" color="#909399"><Connection /></el-icon>
            <span>Tracker 服务器</span>
          </div>
          <div class="tracker-list">
            <div v-for="(tracker, index) in trackerList" :key="index" class="tracker-item">
              <el-icon size="12" color="#909399"><Right /></el-icon>
              <span>{{ tracker }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="errorMessage" class="error-card">
      <template #header>
        <div class="card-header error">
          <el-icon :size="20" color="#F56C6C">
            <CircleCloseFilled />
          </el-icon>
          <span>解析失败</span>
          <el-tag size="small" type="danger">错误</el-tag>
        </div>
      </template>
      <div class="error-content">
        <el-alert :title="errorMessage" type="error" show-icon />
        <div class="error-suggestions">
          <h4>可能的原因：</h4>
          <ul>
            <li>文件格式不正确，不是有效的 .torrent 文件</li>
            <li>文件已损坏或不完整</li>
            <li>文件版本过新，使用了不支持的编码格式</li>
            <li>文件过大，超出浏览器处理能力</li>
          </ul>
          <el-button type="primary" @click="clearFile">重新选择文件</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Upload,
  UploadFilled,
  InfoFilled,
  Warning,
  CircleCheckFilled,
  CircleCloseFilled,
  Close,
  Link,
  CopyDocument,
  Share,
  Document,
  Connection,
  Right,
  View,
  MagicStick,
  Download,
  DataLine
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import parseTorrent from 'parse-torrent'

interface TorrentFile {
  path: string
  length: number
  index?: number
}

interface TorrentInfo {
  name: string
  infoHash: string
  length: number
  files: TorrentFile[]
  pieceLength: number
  pieces: Uint8Array
  created?: Date
  createdBy?: string
  announce?: string
  announceList?: string[][]
}

const fileName = ref('')
const fileSize = ref(0)
const torrentInfo = ref<TorrentInfo | null>(null)
const errorMessage = ref('')
const showQrCode = ref(false)
const qrCodeDataUrl = ref('')
const isDemoMode = ref(false)
const demoQrCodeDataUrl = ref('')

const demoTorrentInfo: TorrentInfo = {
  name: 'Ubuntu 24.04 LTS Desktop amd64',
  infoHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
  length: 5.2 * 1024 * 1024 * 1024,
  pieceLength: 2 * 1024 * 1024,
  pieces: new Uint8Array(20 * 1300),
  created: new Date('2024-04-25T10:30:00'),
  createdBy: 'Ubuntu CD Image Build System',
  announce: 'https://torrent.ubuntu.com/announce',
  announceList: [
    ['https://torrent.ubuntu.com/announce'],
    ['https://ipv6.torrent.ubuntu.com/announce'],
    ['udp://tracker.opentrackr.org:1337/announce']
  ],
  files: [
    { path: 'ubuntu-24.04-desktop-amd64.iso', length: 5.2 * 1024 * 1024 * 1024 },
    { path: 'README.txt', length: 2048 },
    { path: 'SHA256SUMS', length: 1024 },
    { path: 'SHA256SUMS.gpg', length: 836 }
  ]
}

const handleFileChange = async (file: any) => {
  const rawFile = file.raw
  if (!rawFile) return

  if (!rawFile.name.toLowerCase().endsWith('.torrent')) {
    errorMessage.value = '请选择 .torrent 格式的种子文件'
    return
  }

  if (rawFile.size > 10 * 1024 * 1024) {
    errorMessage.value = '文件大小不能超过 10MB'
    return
  }

  fileName.value = rawFile.name
  fileSize.value = rawFile.size
  errorMessage.value = ''
  torrentInfo.value = null
  showQrCode.value = false
  isDemoMode.value = false

  try {
    const buffer = await fileToArrayBuffer(rawFile)
    const result = parseTorrent(new Uint8Array(buffer)) as unknown as TorrentInfo

    torrentInfo.value = result
    generateQrCode()

    ElMessage.success('解析成功！')
  } catch (error) {
    console.error('Parse error:', error)
    errorMessage.value = error instanceof Error ? error.message : '解析种子文件时发生未知错误'
    ElMessage.error('解析失败')
  }
}

const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

const clearFile = () => {
  fileName.value = ''
  fileSize.value = 0
  torrentInfo.value = null
  errorMessage.value = ''
  showQrCode.value = false
  qrCodeDataUrl.value = ''
  isDemoMode.value = false
  demoQrCodeDataUrl.value = ''
}

const currentTorrentInfo = computed(() => {
  return isDemoMode.value ? demoTorrentInfo : torrentInfo.value
})

const magnetLink = computed(() => {
  if (!currentTorrentInfo.value) return ''
  if (isDemoMode.value) {
    return `magnet:?xt=urn:btih:${demoTorrentInfo.infoHash}&dn=${encodeURIComponent(demoTorrentInfo.name)}&tr=${encodeURIComponent(demoTorrentInfo.announce!)}`
  }
  return parseTorrent.toMagnetURI(currentTorrentInfo.value as any)
})

const displayFiles = computed(() => {
  if (!currentTorrentInfo.value?.files) return []
  return currentTorrentInfo.value.files.slice(0, 10).map((f, i) => ({
    ...f,
    index: i + 1
  }))
})

const trackerList = computed(() => {
  if (!currentTorrentInfo.value) return []
  const trackers: string[] = []
  if (currentTorrentInfo.value.announce) {
    trackers.push(currentTorrentInfo.value.announce)
  }
  if (currentTorrentInfo.value.announceList) {
    currentTorrentInfo.value.announceList.forEach(list => {
      list.forEach(t => {
        if (!trackers.includes(t)) {
          trackers.push(t)
        }
      })
    })
  }
  return trackers
})

const showDemoResult = () => {
  isDemoMode.value = true
  showQrCode.value = false
  if (!demoQrCodeDataUrl.value) {
    generateDemoQrCode()
  }
  ElMessage.success('已加载示例数据')
}

const closeDemo = () => {
  isDemoMode.value = false
  showQrCode.value = false
}

const generateDemoQrCode = () => {
  const canvas = document.createElement('canvas')
  const size = 200
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const text = magnetLink.value
  const encoded = encodeURIComponent(text)
  const len = encoded.length
  const moduleCount = Math.min(Math.ceil(Math.sqrt(len * 2)) + 4, 29)
  const modules: boolean[][] = []

  for (let i = 0; i < moduleCount; i++) {
    modules[i] = []
    for (let j = 0; j < moduleCount; j++) {
      modules[i][j] = false
    }
  }

  const drawFinderPattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = row + r
        const cc = col + c
        if (rr >= 0 && rr < moduleCount && cc >= 0 && cc < moduleCount) {
          const isOuter = r === -1 || r === 7 || c === -1 || c === 7
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6
          if (isOuter) {
            modules[rr][cc] = false
          } else if (isBorder || isInner) {
            modules[rr][cc] = true
          }
        }
      }
    }
  }

  drawFinderPattern(0, 0)
  drawFinderPattern(0, moduleCount - 7)
  drawFinderPattern(moduleCount - 7, 0)

  const dataStart = 8
  const dataEnd = moduleCount - 8
  let charIndex = 0
  for (let i = dataStart; i < dataEnd && charIndex < len; i++) {
    for (let j = dataStart; j < dataEnd && charIndex < len; j++) {
      const charCode = encoded.charCodeAt(charIndex)
      modules[i][j] = (charCode >> (j % 8)) & 1 ? true : false
      if (j % 8 === 7) charIndex++
    }
  }

  const moduleSize = size / modules.length
  const padding = 4

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = '#000000'
  for (let i = 0; i < modules.length; i++) {
    for (let j = 0; j < modules.length; j++) {
      if (modules[i][j]) {
        ctx.fillRect(
          padding + j * moduleSize,
          padding + i * moduleSize,
          moduleSize - 1,
          moduleSize - 1
        )
      }
    }
  }

  demoQrCodeDataUrl.value = canvas.toDataURL('image/png')
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date?: Date): string => {
  if (!date) return ''
  return date.toLocaleString('zh-CN')
}

const truncateText = (text: string, maxLen: number): string => {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '...'
}

const copyMagnet = async () => {
  if (!magnetLink.value) return
  try {
    await navigator.clipboard.writeText(magnetLink.value)
    ElMessage.success('磁力链接已复制到剪贴板')
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = magnetLink.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('磁力链接已复制到剪贴板')
  }
}

const generateQrCode = () => {
  if (!magnetLink.value) return

  const canvas = document.createElement('canvas')
  const size = 200
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const generateSimpleQR = (text: string) => {
    const encoded = encodeURIComponent(text)
    const len = encoded.length
    const moduleCount = Math.min(Math.ceil(Math.sqrt(len * 2)) + 4, 29)
    const modules: boolean[][] = []

    for (let i = 0; i < moduleCount; i++) {
      modules[i] = []
      for (let j = 0; j < moduleCount; j++) {
        modules[i][j] = false
      }
    }

    const drawFinderPattern = (row: number, col: number) => {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const rr = row + r
          const cc = col + c
          if (rr >= 0 && rr < moduleCount && cc >= 0 && cc < moduleCount) {
            const isOuter = r === -1 || r === 7 || c === -1 || c === 7
            const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4
            const isBorder = r === 0 || r === 6 || c === 0 || c === 6
            if (isOuter) {
              modules[rr][cc] = false
            } else if (isBorder || isInner) {
              modules[rr][cc] = true
            }
          }
        }
      }
    }

    drawFinderPattern(0, 0)
    drawFinderPattern(0, moduleCount - 7)
    drawFinderPattern(moduleCount - 7, 0)

    const dataStart = 8
    const dataEnd = moduleCount - 8
    let charIndex = 0
    for (let i = dataStart; i < dataEnd && charIndex < len; i++) {
      for (let j = dataStart; j < dataEnd && charIndex < len; j++) {
        const charCode = encoded.charCodeAt(charIndex)
        modules[i][j] = (charCode >> (j % 8)) & 1 ? true : false
        if (j % 8 === 7) charIndex++
      }
    }

    return modules
  }

  const modules = generateSimpleQR(magnetLink.value)
  const moduleSize = size / modules.length
  const padding = 4

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = '#000000'
  for (let i = 0; i < modules.length; i++) {
    for (let j = 0; j < modules.length; j++) {
      if (modules[i][j]) {
        ctx.fillRect(
          padding + j * moduleSize,
          padding + i * moduleSize,
          moduleSize - 1,
          moduleSize - 1
        )
      }
    }
  }

  qrCodeDataUrl.value = canvas.toDataURL('image/png')
}

const downloadQrCode = () => {
  const dataUrl = isDemoMode.value ? demoQrCodeDataUrl.value : qrCodeDataUrl.value
  if (!dataUrl) {
    ElMessage.warning('二维码尚未生成')
    return
  }

  const link = document.createElement('a')
  link.download = `磁力链接二维码_${Date.now()}.png`
  link.href = dataUrl
  link.click()
  ElMessage.success('二维码下载成功！')
}

const copyQrCodeImage = async () => {
  const dataUrl = isDemoMode.value ? demoQrCodeDataUrl.value : qrCodeDataUrl.value
  if (!dataUrl) {
    ElMessage.warning('二维码尚未生成')
    return
  }

  try {
    const blob = await (await fetch(dataUrl)).blob()
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ])
    ElMessage.success('二维码图片已复制到剪贴板！')
  } catch {
    try {
      await navigator.clipboard.writeText(dataUrl)
      ElMessage.success('二维码 Base64 已复制到剪贴板！')
    } catch {
      ElMessage.error('复制失败，请尝试下载图片')
    }
  }
}
</script>

<style scoped>
.torrent-to-magnet {
  max-width: 1000px;
  margin: 0 auto;
}

.value-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 50%, #f0f9ff 100%);
  border: 1px solid #c6e2ff;
}

.value-card :deep(.el-card__body) {
  padding: 28px;
}

.value-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.value-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #165DFF 0%, #4080ff 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

.value-icon :deep(.el-icon) {
  color: #fff;
}

.value-title h2 {
  margin: 0 0 6px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1d2129;
}

.value-title p {
  margin: 0;
  font-size: 14px;
  color: #4e5969;
}

.value-title p strong {
  color: #165DFF;
  font-weight: 600;
}

.value-badges {
  margin-left: auto;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.value-badges :deep(.el-tag) {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
}

.value-preview {
  margin-bottom: 20px;
}

.preview-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
}

.preview-box {
  background: #fff;
  border: 2px dashed #165DFF;
  border-radius: 12px;
  padding: 20px;
}

.preview-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.preview-text {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #4e5969;
  line-height: 1.6;
  word-break: break-all;
  opacity: 0.7;
}

.preview-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.value-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  font-size: 14px;
  color: #1d2129;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.card-header.error {
  color: #F56C6C;
}

.header-tag {
  margin-left: 12px;
  font-weight: normal;
}

.rules-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 15px;
  color: #303133;
}

.rule-item {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.rule-label {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  font-size: 13px;
}

.rule-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
}

.upload-card {
  margin-bottom: 24px;
}

.upload-area {
  margin-bottom: 16px;
}

.upload-area :deep(.el-upload-dragger) {
  padding: 40px 20px;
}

.upload-icon {
  font-size: 64px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #606266;
  margin-bottom: 8px;
}

.upload-text em {
  color: #165DFF;
  font-style: normal;
  font-weight: 500;
}

.upload-text strong {
  color: #67C23A;
}

.upload-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.file-info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f0f9eb;
  border-radius: 6px;
  border: 1px solid #e1f3d8;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-name {
  font-weight: 500;
  color: #303133;
}

.demo-section {
  margin-top: 20px;
}

.divider-text {
  color: #909399;
  font-size: 13px;
}

.demo-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}

.demo-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.demo-tag {
  margin-left: 8px;
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 4px;
}

.close-demo-btn {
  margin-left: auto;
}

.result-card {
  margin-bottom: 24px;
}

.result-card :deep(.el-card__body) {
  padding: 0;
}

.magnet-highlight-section {
  padding: 28px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 50%, #f0f9eb 100%);
  border-bottom: 1px solid #e4e7ed;
}

.highlight-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.highlight-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.highlight-title h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 700;
  color: #1d2129;
}

.highlight-title p {
  margin: 0;
  font-size: 13px;
  color: #4e5969;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.highlight-badge {
  display: flex;
  align-items: center;
  gap: 12px;
}

.magnet-main-box {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.magnet-main-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.magnet-icon-wrapper {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #e6f4ff 0%, #c6e2ff 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.magnet-text-wrapper {
  flex: 1;
  min-width: 0;
}

.magnet-label {
  font-size: 12px;
  color: #67c23a;
  font-weight: 600;
  margin-bottom: 6px;
}

.magnet-main-text {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #1d2129;
  line-height: 1.6;
  word-break: break-all;
  background: #f5f7fa;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.magnet-main-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.magnet-main-actions :deep(.el-button) {
  min-width: 160px;
}

.qrcode-main-section {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.qrcode-main-box {
  text-align: center;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.qrcode-main-box img {
  width: 180px;
  height: 180px;
  margin-bottom: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  -webkit-touch-callout: default;
  touch-action: manipulation;
}

.qrcode-main-desc {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.qrcode-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}

.quick-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0 0 0;
  flex-wrap: wrap;
}

.quick-action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4e5969;
}

.result-summary {
  padding: 24px 24px 0 24px;
}

.result-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 8px;
}

.result-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.result-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-value.highlight {
  color: #165DFF;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.details-section {
  padding: 0 24px 24px 24px;
}

.info-section {
  padding: 0 24px 24px 24px;
}

.sub-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 20px 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
}

.magnet-box {
  background: #f0f7ff;
  border: 1px solid #c6e2ff;
  border-radius: 8px;
  padding: 16px;
}

.magnet-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  word-break: break-all;
}

.magnet-text {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #303133;
  line-height: 1.6;
  flex: 1;
}

.magnet-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.qrcode-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.qrcode-box {
  text-align: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.qrcode-box img {
  width: 200px;
  height: 200px;
  margin-bottom: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.qrcode-desc {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.pagination-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 12px;
  font-size: 12px;
  color: #909399;
}

.hash-code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
  color: #606266;
}

.tracker-section {
  margin-top: 20px;
}

.tracker-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tracker-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
  font-family: 'Courier New', monospace;
}

.error-card {
  margin-bottom: 24px;
}

.error-content {
  padding: 10px 0;
}

.error-suggestions {
  margin-top: 20px;
}

.error-suggestions h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #303133;
}

.error-suggestions ul {
  margin: 0 0 20px 0;
  padding-left: 20px;
}

.error-suggestions li {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}

:deep(.el-descriptions__label) {
  font-weight: 500;
  width: 120px;
}
</style>
