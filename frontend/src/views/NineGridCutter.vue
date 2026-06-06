<template>
  <div class="nine-grid-cutter">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <el-steps :active="sourceImage ? 3 : 0" finish-status="success" simple class="guide-steps">
        <el-step title="选择模式" description="按平台或张数选择宫格" />
        <el-step title="上传图片" description="选择需要切割的图片" />
        <el-step title="下载使用" description="按顺序上传到社交平台" />
      </el-steps>
    </el-card>

    <el-row :gutter="24">
      <el-col :span="14">
        <el-card class="preview-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <View />
              </el-icon>
              <span>预览效果（{{ gridRows }} × {{ gridCols }} = {{ totalCells }} 张）</span>
              <el-tag size="small" type="success" class="header-tag">
                本地处理 · 安全可靠
              </el-tag>
            </div>
          </template>

          <div class="preview-wrapper">
            <div v-if="sourceImage" class="grid-preview" :style="gridStyle">
              <div
                v-for="(cell, index) in totalCells"
                :key="index"
                class="grid-cell"
                :style="getCellStyle(index)"
              >
                <div class="cell-number">{{ index + 1 }}</div>
              </div>
            </div>
            <div v-else class="preview-placeholder">
              <el-icon><Grid /></el-icon>
              <span>请先上传图片</span>
              <p class="placeholder-hint">已选择 {{ currentModeLabel }}：{{ gridRows }} × {{ gridCols }} 共 {{ totalCells }} 张</p>
            </div>
          </div>

          <div class="preview-info" v-if="sourceImage">
            <el-tag size="small">原图: {{ imageWidth }} × {{ imageHeight }}</el-tag>
            <el-tag size="small" type="info">总图: {{ totalWidth }} × {{ totalHeight }}</el-tag>
            <el-tag size="small" type="success">单张: {{ cellWidth }} × {{ cellHeight }}</el-tag>
            <el-tag size="small" type="warning">{{ currentModeLabel }} · {{ totalCells }} 张</el-tag>
          </div>
        </el-card>

        <el-card class="result-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Picture />
              </el-icon>
              <span>切割结果（共 {{ totalCells }} 张，点击图片可单独下载）</span>
            </div>
          </template>
          <div v-if="sourceImage" class="result-grid" :style="resultGridStyle">
            <div
              v-for="(cell, index) in totalCells"
              :key="index"
              class="result-item"
              @click="downloadSingle(index)"
            >
              <img :src="gridImages[index]" class="result-image" />
              <div class="result-overlay">
                <el-icon><Download /></el-icon>
                <span>下载第 {{ index + 1 }} 张</span>
              </div>
              <div class="result-badge">{{ index + 1 }}</div>
            </div>
          </div>
          <el-empty v-else description="上传图片后将显示切割结果" />
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card class="mode-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="18" color="#165DFF">
                <MagicStick />
              </el-icon>
              <span>选择切割模式</span>
              <el-tag size="small" type="warning" class="header-tag">先选模式再传图，效果最佳</el-tag>
            </div>
          </template>

          <div class="mode-section">
            <div class="mode-subtitle">
              <el-icon :size="14" color="#165DFF"><Platform /></el-icon>
              <span>按社交平台快速选择</span>
            </div>
            <div class="platform-grid">
              <div
                v-for="p in platforms"
                :key="p.name"
                class="platform-card"
                :class="{ active: currentPlatform === p.name }"
                @click="selectPlatform(p)"
              >
                <div class="platform-icon-wrap" :style="{ background: p.bgColor }">
                  <el-icon :size="22" :color="p.iconColor">{{ p.icon }}</el-icon>
                </div>
                <div class="platform-info">
                  <div class="platform-name">{{ p.name }}</div>
                  <div class="platform-desc">{{ p.rows }}×{{ p.cols }} · {{ p.rows*p.cols }} 张</div>
                </div>
                <el-icon v-if="currentPlatform === p.name" :size="16" color="#165DFF"><CircleCheckFilled /></el-icon>
              </div>
            </div>
          </div>

          <el-divider />

          <div class="mode-section">
            <div class="mode-subtitle">
              <el-icon :size="14" color="#165DFF"><Grid /></el-icon>
              <span>按图片张数选择</span>
            </div>
            <div class="count-grid">
              <div
                v-for="c in countOptions"
                :key="c.count"
                class="count-card"
                :class="{ active: totalCells === c.count && currentPlatform === '' }"
                @click="selectByCount(c)"
              >
                <div class="count-preview" :style="getCountPreviewStyle(c)">
                  <div v-for="i in c.count" :key="i" class="count-cell"></div>
                </div>
                <div class="count-info">
                  <div class="count-num">{{ c.count }} 张</div>
                  <div class="count-size">{{ c.rows }}×{{ c.cols }}</div>
                </div>
                <el-tag size="small" type="success" v-if="c.hot" effect="light">热门</el-tag>
              </div>
            </div>
          </div>

          <el-divider />

          <div class="mode-section">
            <div class="mode-subtitle">
              <el-icon :size="14" color="#165DFF"><Setting /></el-icon>
              <span>自定义行列数</span>
            </div>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="行数" class="custom-form-item">
                  <el-input-number
                    v-model="gridRows"
                    :min="1"
                    :max="6"
                    size="small"
                    controls-position="right"
                    style="width: 100%"
                    @change="clearPlatformSelection"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="列数" class="custom-form-item">
                  <el-input-number
                    v-model="gridCols"
                    :min="1"
                    :max="6"
                    size="small"
                    controls-position="right"
                    style="width: 100%"
                    @change="clearPlatformSelection"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div class="custom-tip">
              当前：<strong>{{ gridRows }} × {{ gridCols }} = {{ totalCells }} 张</strong>
              <span v-if="totalCells > 9">（部分平台最多支持 9 张图）</span>
            </div>
          </div>
        </el-card>

        <el-card class="upload-card" v-if="!sourceImage">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Upload />
              </el-icon>
              <span>上传图片</span>
              <el-tag size="small" type="info" class="header-tag">支持 JPG、PNG、WEBP</el-tag>
            </div>
          </template>
          <div class="upload-area">
            <el-upload
              ref="uploadRef"
              drag
              :auto-upload="false"
              :limit="1"
              accept="image/*"
              :on-change="handleFileChange"
              :on-exceed="handleExceed"
              class="image-uploader"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                将图片拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 JPG、PNG、WEBP 格式，文件大小建议不超过 10MB
                </div>
              </template>
            </el-upload>
          </div>

          <div class="privacy-note">
            <el-icon><Lock /></el-icon>
            <span>所有操作均在浏览器本地完成，图片不会上传到服务器</span>
          </div>
        </el-card>

        <template v-if="sourceImage">
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon :size="20" color="#165DFF">
                  <Setting />
                </el-icon>
                <span>输出设置</span>
                <div class="header-actions">
                  <el-button size="small" @click="handleReupload">
                    <el-icon><Upload /></el-icon>
                    重新上传
                  </el-button>
                </div>
              </div>
            </template>

            <div class="settings-form">
              <el-form label-position="top">
                <el-form-item label="输出单张尺寸">
                  <el-radio-group v-model="presetSize" size="small" @change="handlePresetChange">
                    <el-radio-button :value="300">300px</el-radio-button>
                    <el-radio-button :value="600">600px</el-radio-button>
                    <el-radio-button :value="900">900px</el-radio-button>
                    <el-radio-button :value="0">自定义</el-radio-button>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="自定义单张尺寸" v-if="presetSize === 0">
                  <el-slider v-model="customSize" :min="100" :max="2000" :step="50" show-input :marks="sizeMarks" />
                </el-form-item>

                <el-form-item label="输出图片格式">
                  <el-radio-group v-model="outputFormat" size="small">
                    <el-radio-button value="png">PNG（无损）</el-radio-button>
                    <el-radio-button value="jpeg">JPEG（体积小）</el-radio-button>
                    <el-radio-button value="webp">WEBP（推荐）</el-radio-button>
                  </el-radio-group>
                </el-form-item>

                <el-form-item v-if="outputFormat === 'jpeg' || outputFormat === 'webp'" label="图片质量">
                  <el-slider v-model="imageQuality" :min="50" :max="100" show-input :format-tooltip="val => val + '%'" />
                </el-form-item>
              </el-form>
            </div>
          </el-card>

          <el-card class="action-card">
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="downloadAll" :loading="downloading">
                <el-icon><Download /></el-icon>
                下载全部 {{ totalCells }} 张图片
              </el-button>
            </div>
            <el-alert :type="totalCells > 9 ? 'warning' : 'info'" :closable="false" class="download-tip">
              <template #title>
                <div class="download-tip-content">
                  <p><strong>📌 发布顺序：</strong>请按 <strong>1 → 2 → 3 → ... → {{ totalCells }}</strong> 的顺序（从左到右、从上到下）依次上传。</p>
                  <p v-if="currentPlatform" style="margin-top: 6px">
                    ✅ 已匹配 <strong>{{ currentPlatform }}</strong> {{ gridRows }}×{{ gridCols }} 模式，共 {{ totalCells }} 张，正好符合该平台推荐。
                  </p>
                  <p v-else-if="totalCells === 6" style="margin-top: 6px">
                    ✅ 6 张图模式适合微博、朋友圈横版发布，无需再删除多余图片。
                  </p>
                  <p v-else-if="totalCells === 4" style="margin-top: 6px">
                    ✅ 4 张图模式适合小红书、朋友圈简洁四宫格发布。
                  </p>
                  <p v-else-if="totalCells === 9" style="margin-top: 6px">
                    ✅ 经典九宫格模式，适合朋友圈、微博满格发布。
                  </p>
                  <p v-else-if="totalCells > 9" style="margin-top: 6px">
                    ⚠️ 当前 {{ totalCells }} 张超过了大部分平台的 9 张上限，请分批上传或减少行列数。
                  </p>
                </div>
              </template>
            </el-alert>
          </el-card>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {
  InfoFilled,
  View,
  Upload,
  UploadFilled,
  MagicStick,
  Lock,
  Setting,
  Download,
  Picture,
  Grid,
  SuccessFilled,
  Warning,
  Platform,
  CircleCheckFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'

interface Platform {
  name: string
  icon: string
  bgColor: string
  iconColor: string
  rows: number
  cols: number
}

interface CountOption {
  count: number
  rows: number
  cols: number
  hot?: boolean
}

const uploadRef = ref()

const sourceImage = ref<string>('')
const imageWidth = ref(0)
const imageHeight = ref(0)
const downloading = ref(false)

const gridRows = ref(2)
const gridCols = ref(3)
const currentPlatform = ref('')

const outputFormat = ref<'png' | 'jpeg' | 'webp'>('png')
const presetSize = ref(600)
const customSize = ref(600)
const imageQuality = ref(92)

const gridImages = ref<string[]>([])

const platforms: Platform[] = [
  { name: '微博 6 图', icon: 'Share', bgColor: '#ffe8e8', iconColor: '#e6162d', rows: 2, cols: 3 },
  { name: '朋友圈 9 图', icon: 'ChatDotRound', bgColor: '#e8f8ee', iconColor: '#07c160', rows: 3, cols: 3 },
  { name: '小红书 4 图', icon: 'Collection', bgColor: '#ffebee', iconColor: '#ff2442', rows: 2, cols: 2 },
  { name: '朋友圈 4 图', icon: 'ChatLineSquare', bgColor: '#ecf5ff', iconColor: '#165DFF', rows: 2, cols: 2 }
]

const countOptions: CountOption[] = [
  { count: 4, rows: 2, cols: 2 },
  { count: 6, rows: 2, cols: 3, hot: true },
  { count: 8, rows: 2, cols: 4 },
  { count: 9, rows: 3, cols: 3, hot: true },
  { count: 12, rows: 3, cols: 4 },
  { count: 16, rows: 4, cols: 4 }
]

const sizeMarks = {
  100: '100',
  500: '500',
  1000: '1000',
  1500: '1500',
  2000: '2000'
}

const totalCells = computed(() => gridRows.value * gridCols.value)

const currentModeLabel = computed(() => {
  if (currentPlatform.value) return currentPlatform.value
  return '自定义模式'
})

const baseSize = computed(() => {
  return presetSize.value === 0 ? customSize.value : presetSize.value
})

const cellWidth = computed(() => baseSize.value)
const cellHeight = computed(() => baseSize.value)

const totalWidth = computed(() => cellWidth.value * gridCols.value)
const totalHeight = computed(() => cellHeight.value * gridRows.value)

const gridStyle = computed(() => {
  const maxDim = 500
  const ratio = totalWidth.value / totalHeight.value
  let w: number, h: number
  if (ratio >= 1) {
    w = Math.min(maxDim, totalWidth.value)
    h = w / ratio
  } else {
    h = Math.min(maxDim, totalHeight.value)
    w = h * ratio
  }
  return {
    width: `${w}px`,
    height: `${h}px`,
    gridTemplateColumns: `repeat(${gridCols.value}, 1fr)`,
    gridTemplateRows: `repeat(${gridRows.value}, 1fr)`
  }
})

const resultGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.min(gridCols.value, 4)}, 1fr)`
}))

const getCellStyle = (index: number) => {
  return {
    backgroundImage: sourceImage.value ? `url(${gridImages.value[index] || ''})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}

const getCountPreviewStyle = (c: CountOption) => ({
  gridTemplateColumns: `repeat(${c.cols}, 1fr)`,
  gridTemplateRows: `repeat(${c.rows}, 1fr)`
})

const selectPlatform = (p: Platform) => {
  currentPlatform.value = p.name
  gridRows.value = p.rows
  gridCols.value = p.cols
}

const selectByCount = (c: CountOption) => {
  currentPlatform.value = ''
  gridRows.value = c.rows
  gridCols.value = c.cols
}

const clearPlatformSelection = () => {
  currentPlatform.value = ''
}

const handlePresetChange = () => {
  if (presetSize.value !== 0) {
    customSize.value = presetSize.value
  }
}

const handleFileChange = async (file: UploadFile) => {
  if (!file.raw) return
  if (!file.raw.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  if (file.raw.size > 10 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 10MB')
    return
  }

  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      sourceImage.value = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        imageWidth.value = img.width
        imageHeight.value = img.height
        nextTick(() => generateGrid())
      }
      img.src = sourceImage.value
    }
    reader.readAsDataURL(file.raw)
  } catch (e) {
    console.error('Failed to load image:', e)
    ElMessage.error('图片加载失败，请检查文件是否损坏')
  }
}

const handleExceed = () => {
  ElMessage.warning('请先删除已上传的图片再重新上传')
}

const handleReupload = () => {
  sourceImage.value = ''
  imageWidth.value = 0
  imageHeight.value = 0
  gridImages.value = []
}

const generateGrid = () => {
  if (!sourceImage.value) return

  const img = new Image()
  img.onload = () => {
    const rows = gridRows.value
    const cols = gridCols.value
    const total = rows * cols

    const ratio = cols / rows
    let cropW: number, cropH: number
    const imgRatio = img.width / img.height

    if (imgRatio >= ratio) {
      cropH = img.height
      cropW = cropH * ratio
    } else {
      cropW = img.width
      cropH = cropW / ratio
    }

    const sx = (img.width - cropW) / 2
    const sy = (img.height - cropH) / 2

    const cw = cellWidth.value
    const ch = cellHeight.value
    const srcCellW = cropW / cols
    const srcCellH = cropH / rows

    const images: string[] = []
    let count = 0

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const canvas = document.createElement('canvas')
        canvas.width = cw
        canvas.height = ch
        const ctx = canvas.getContext('2d')
        if (!ctx) continue

        ctx.drawImage(
          img,
          sx + col * srcCellW,
          sy + row * srcCellH,
          srcCellW,
          srcCellH,
          0,
          0,
          cw,
          ch
        )

        const mimeType = outputFormat.value === 'png'
          ? 'image/png'
          : outputFormat.value === 'jpeg'
          ? 'image/jpeg'
          : 'image/webp'
        const quality = (outputFormat.value === 'jpeg' || outputFormat.value === 'webp')
          ? imageQuality.value / 100
          : undefined

        images[row * cols + col] = canvas.toDataURL(mimeType, quality)
        count++

        if (count === total) {
          gridImages.value = images
        }
      }
    }
  }
  img.src = sourceImage.value
}

const getExtension = () => {
  if (outputFormat.value === 'jpeg') return 'jpg'
  return outputFormat.value
}

const downloadSingle = (index: number) => {
  if (!gridImages.value[index]) {
    ElMessage.warning('图片尚未生成完成')
    return
  }

  const link = document.createElement('a')
  link.download = `宫格图_${index + 1}.${getExtension()}`
  link.href = gridImages.value[index]
  link.click()
}

const downloadAll = async () => {
  const total = totalCells.value
  if (gridImages.value.length < total) {
    ElMessage.warning('图片尚未生成完成，请稍候')
    return
  }

  downloading.value = true
  const ext = getExtension()

  try {
    for (let i = 0; i < total; i++) {
      const link = document.createElement('a')
      link.download = `宫格图_${i + 1}.${ext}`
      link.href = gridImages.value[i]
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      await new Promise(resolve => setTimeout(resolve, 250))
    }
    ElMessage.success(`共 ${total} 张图片下载成功！请按 1-${total} 顺序上传到社交平台`)
  } catch (e) {
    console.error('Download failed:', e)
    ElMessage.error('下载失败，请重试')
  } finally {
    downloading.value = false
  }
}

watch(
  [sourceImage, outputFormat, presetSize, customSize, imageQuality, gridRows, gridCols],
  () => {
    if (sourceImage.value) {
      generateGrid()
    }
  }
)
</script>

<style scoped>
.nine-grid-cutter {
  max-width: 1400px;
  margin: 0 auto;
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

.header-tag {
  margin-left: auto;
  font-weight: normal;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.preview-card {
  margin-bottom: 24px;
}

.preview-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  min-height: 400px;
  align-items: center;
}

.grid-preview {
  display: grid;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.grid-cell {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s;
  background-size: cover;
  background-position: center;
}

.grid-cell:hover {
  filter: brightness(1.1);
}

.cell-number {
  position: absolute;
  top: 6px;
  left: 6px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #909399;
  text-align: center;
}

.preview-placeholder .el-icon {
  font-size: 80px;
}

.placeholder-hint {
  margin: 0;
  font-size: 13px;
  color: #165DFF;
  background: #ecf5ff;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 500;
}

.preview-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.result-card {
  margin-bottom: 24px;
}

.result-grid {
  display: grid;
  gap: 12px;
  padding: 8px 0;
}

.result-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
  background: #f5f7fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.result-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.result-item:hover .result-overlay {
  opacity: 1;
}

.result-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.result-overlay {
  position: absolute;
  inset: 0;
  background: rgba(22, 93, 255, 0.75);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.25s;
  font-size: 13px;
  font-weight: 500;
}

.result-overlay .el-icon {
  font-size: 28px;
}

.result-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 28px;
  height: 28px;
  background: #165DFF;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.mode-card {
  margin-bottom: 24px;
}

.mode-section {
  padding: 4px 0;
}

.mode-subtitle {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.platform-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background: #fafafa;
  border: 2px solid #ebeef5;
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
}

.platform-card:hover {
  border-color: #409eff;
  background: #ecf5ff;
  transform: translateY(-2px);
}

.platform-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

.platform-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.platform-info {
  flex: 1;
  min-width: 0;
}

.platform-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.platform-desc {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

.count-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.count-card {
  padding: 12px 8px;
  border-radius: 10px;
  background: #fafafa;
  border: 2px solid #ebeef5;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

.count-card:hover {
  border-color: #409eff;
  background: #ecf5ff;
  transform: translateY(-2px);
}

.count-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

.count-card :deep(.el-tag) {
  position: absolute;
  top: -6px;
  right: -6px;
}

.count-preview {
  display: grid;
  gap: 2px;
  width: 52px;
  height: 52px;
  padding: 4px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #ebeef5;
}

.count-cell {
  background: linear-gradient(135deg, #409eff 0%, #165DFF 100%);
  border-radius: 2px;
}

.count-info {
  text-align: center;
}

.count-num {
  font-size: 13px;
  font-weight: 700;
  color: #303133;
}

.count-size {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

.custom-form-item {
  margin-bottom: 0;
}

.custom-form-item :deep(.el-form-item__label) {
  font-size: 12px;
  color: #606266;
  padding-bottom: 6px;
}

.custom-tip {
  margin-top: 10px;
  padding: 10px 12px;
  background: #f0f9ff;
  border-radius: 6px;
  font-size: 13px;
  color: #165DFF;
  line-height: 1.5;
}

.custom-tip span {
  color: #e6a23c;
  font-size: 12px;
  display: block;
  margin-top: 4px;
}

.upload-card {
  margin-bottom: 24px;
}

.upload-area {
  display: flex;
  justify-content: center;
  padding: 12px 0 20px;
}

.image-uploader :deep(.el-upload-dragger) {
  width: 100%;
  padding: 30px 20px;
}

.image-uploader :deep(.el-upload) {
  width: 100%;
}

.privacy-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 8px;
  font-size: 12px;
  color: #166534;
}

.privacy-note .el-icon {
  color: #22c55e;
}

.settings-card {
  margin-bottom: 24px;
}

.settings-form {
  padding: 8px 0;
}

.action-card {
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.download-tip {
  margin-bottom: 0;
}

.download-tip-content {
  line-height: 1.7;
}

.download-tip-content p {
  margin: 2px 0;
}

@media (max-width: 992px) {
  .el-col {
    width: 100% !important;
  }
}
</style>
