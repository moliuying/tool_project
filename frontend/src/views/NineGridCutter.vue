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
        <el-step title="上传图片" description="选择需要切割的图片" />
        <el-step title="设置宫格" description="选择或自定义宫格行列数" />
        <el-step title="预览下载" description="实时预览切割效果并下载" />
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
              <p class="placeholder-hint">图片将按设置的行列比例自动裁剪切割</p>
            </div>
          </div>

          <div class="preview-info" v-if="sourceImage">
            <el-tag size="small">原图尺寸: {{ imageWidth }} × {{ imageHeight }}</el-tag>
            <el-tag size="small" type="info">输出总图: {{ totalWidth }} × {{ totalHeight }}</el-tag>
            <el-tag size="small" type="success">单张小图: {{ cellWidth }} × {{ cellHeight }}</el-tag>
            <el-tag size="small" type="warning">宫格: {{ gridRows }} × {{ gridCols }}</el-tag>
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

          <el-divider />

          <div class="preset-section">
            <div class="preset-title">
              <el-icon :size="16" color="#165DFF"><Grid /></el-icon>
              <span>常用宫格预设</span>
            </div>
            <div class="preset-grid">
              <div
                v-for="preset in presets"
                :key="preset.label"
                class="preset-card"
                :class="{ active: preset.rows === 3 && preset.cols === 3 }"
              >
                <div class="preset-preview" :style="getPresetStyle(preset)">
                  <div
                    v-for="i in preset.rows * preset.cols"
                    :key="i"
                    class="preset-cell"
                  ></div>
                </div>
                <div class="preset-info">
                  <div class="preset-label">{{ preset.label }}</div>
                  <div class="preset-desc">{{ preset.rows }} × {{ preset.cols }} · {{ preset.rows * preset.cols }} 张</div>
                </div>
              </div>
            </div>
          </div>

          <el-divider />

          <div class="scene-section">
            <div class="scene-title">
              <el-icon :size="16" color="#165DFF"><MagicStick /></el-icon>
              <span>适用场景</span>
            </div>
            <el-row :gutter="12">
              <el-col :span="12" v-for="scene in scenes" :key="scene.name">
                <div class="scene-card">
                  <el-icon :size="24" :color="scene.color">{{ scene.icon }}</el-icon>
                  <span>{{ scene.name }}</span>
                </div>
              </el-col>
            </el-row>
          </div>

          <el-divider />

          <el-card class="tips-card" shadow="never">
            <template #header>
              <div class="spec-header">
                <el-icon :size="14" color="#165DFF"><InfoFilled /></el-icon>
                <span>图片规格要求</span>
              </div>
            </template>
            <div class="spec-list">
              <div class="spec-item">
                <el-icon color="#67c23a"><SuccessFilled /></el-icon>
                <div class="spec-content">
                  <span class="spec-label">支持格式</span>
                  <span class="spec-value">JPG、PNG、WEBP</span>
                </div>
              </div>
              <div class="spec-item">
                <el-icon color="#67c23a"><SuccessFilled /></el-icon>
                <div class="spec-content">
                  <span class="spec-label">宫格模式</span>
                  <span class="spec-value">支持自定义行数 1-6、列数 1-6</span>
                </div>
              </div>
              <div class="spec-item">
                <el-icon color="#67c23a"><SuccessFilled /></el-icon>
                <div class="spec-content">
                  <span class="spec-label">输出尺寸</span>
                  <span class="spec-value">300 / 600 / 900 / 自定义</span>
                </div>
              </div>
              <div class="spec-item">
                <el-icon color="#67c23a"><SuccessFilled /></el-icon>
                <div class="spec-content">
                  <span class="spec-label">切割方式</span>
                  <span class="spec-value">按行列比例居中裁剪后均分</span>
                </div>
              </div>
            </div>
            <div class="spec-tips">
              <el-icon :size="12" color="#e6a23c"><Warning /></el-icon>
              <span>提示：图片将按行列比例自动居中裁剪，建议主体内容放在图片中央区域。非标准比例可手动调整行列数。</span>
            </div>
          </el-card>

          <div class="privacy-note">
            <el-icon><Lock /></el-icon>
            <span>所有操作均在浏览器本地完成，图片不会上传到服务器，保障您的隐私安全</span>
          </div>
        </el-card>

        <template v-if="sourceImage">
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon :size="20" color="#165DFF">
                  <Setting />
                </el-icon>
                <span>切割设置</span>
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
                <el-form-item label="宫格预设">
                  <div class="preset-select">
                    <div
                      v-for="preset in presets"
                      :key="preset.label"
                      class="preset-select-item"
                      :class="{ active: gridRows === preset.rows && gridCols === preset.cols }"
                      @click="applyPreset(preset)"
                    >
                      <div class="preset-select-preview" :style="getPresetMiniStyle(preset)"></div>
                      <span>{{ preset.label }}</span>
                    </div>
                  </div>
                </el-form-item>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="行数">
                      <el-input-number
                        v-model="gridRows"
                        :min="1"
                        :max="6"
                        size="small"
                        controls-position="right"
                        style="width: 100%"
                      />
                      <div class="size-hint">范围：1 - 6 行</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="列数">
                      <el-input-number
                        v-model="gridCols"
                        :min="1"
                        :max="6"
                        size="small"
                        controls-position="right"
                        style="width: 100%"
                      />
                      <div class="size-hint">范围：1 - 6 列</div>
                    </el-form-item>
                  </el-col>
                </el-row>

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
                  <div class="size-hint">单张小图短边尺寸，总尺寸将按 {{ gridRows }} × {{ gridCols }} 比例计算</div>
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
            <el-alert type="info" :closable="false" class="download-tip">
              <template #title>
                <div class="download-tip-content">
                  <p><strong>发布顺序提示：</strong></p>
                  <p>社交平台发布宫格图时，请按 <strong>1 → 2 → 3 → ... → {{ totalCells }}</strong> 的顺序（从左到右、从上到下）依次上传，即可组成完整画面。</p>
                  <p v-if="gridRows === 3 && gridCols === 3" style="margin-top: 8px">💡 典型场景：微信朋友圈 3×3 九宫格、微博多图发布等。</p>
                  <p v-else-if="gridRows === 2 && gridCols === 2" style="margin-top: 8px">💡 典型场景：小红书 2×2 四宫格、简洁排版等。</p>
                  <p v-else-if="gridRows === 2 && gridCols === 3" style="margin-top: 8px">💡 典型场景：长图横版展示 2×3 六宫格。</p>
                  <p v-else style="margin-top: 8px">💡 当前：{{ gridRows }} × {{ gridCols }} 共 {{ totalCells }} 张，请根据平台支持的图片数量合理设置。</p>
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
  Warning
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'

interface Preset {
  label: string
  rows: number
  cols: number
  desc?: string
}

const uploadRef = ref()

const sourceImage = ref<string>('')
const imageWidth = ref(0)
const imageHeight = ref(0)
const downloading = ref(false)

const gridRows = ref(3)
const gridCols = ref(3)
const outputFormat = ref<'png' | 'jpeg' | 'webp'>('png')
const presetSize = ref(600)
const customSize = ref(600)
const imageQuality = ref(92)

const gridImages = ref<string[]>([])

const presets: Preset[] = [
  { label: '四宫格', rows: 2, cols: 2, desc: '小红书常用' },
  { label: '六宫格', rows: 2, cols: 3, desc: '横版排版' },
  { label: '九宫格', rows: 3, cols: 3, desc: '朋友圈经典' },
  { label: '十二宫格', rows: 3, cols: 4, desc: '长图展示' },
  { label: '十六宫格', rows: 4, cols: 4, desc: '高密度' },
  { label: '自定义', rows: 3, cols: 3, desc: '自由设置' }
]

const sizeMarks = {
  100: '100',
  500: '500',
  1000: '1000',
  1500: '1500',
  2000: '2000'
}

const scenes = [
  { name: '微信朋友圈', icon: 'ChatDotRound', color: '#07c160' },
  { name: '微博', icon: 'Share', color: '#e6162d' },
  { name: '小红书', icon: 'Collection', color: '#ff2442' },
  { name: '摄影作品', icon: 'Camera', color: '#409eff' }
]

const totalCells = computed(() => gridRows.value * gridCols.value)

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

const getPresetStyle = (preset: Preset) => ({
  gridTemplateColumns: `repeat(${preset.cols}, 1fr)`,
  gridTemplateRows: `repeat(${preset.rows}, 1fr)`
})

const getPresetMiniStyle = (preset: Preset) => ({
  width: `${preset.cols * 8}px`,
  height: `${preset.rows * 8}px`,
  backgroundImage: `linear-gradient(#165DFF 1px, transparent 1px), linear-gradient(90deg, #165DFF 1px, transparent 1px)`,
  backgroundSize: `${8}px ${8}px`
})

const applyPreset = (preset: Preset) => {
  gridRows.value = preset.rows
  gridCols.value = preset.cols
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
  margin-left: 12px;
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
}

.preview-placeholder .el-icon {
  font-size: 80px;
}

.placeholder-hint {
  margin: 0;
  font-size: 13px;
  color: #c0c4cc;
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

.upload-card {
  margin-bottom: 24px;
}

.upload-area {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.image-uploader :deep(.el-upload-dragger) {
  width: 100%;
  padding: 40px 20px;
}

.image-uploader :deep(.el-upload) {
  width: 100%;
}

.preset-section {
  padding: 0 8px;
}

.preset-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.preset-card {
  padding: 12px 8px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border: 2px solid #ebeef5;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.preset-card:hover {
  border-color: #409eff;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
  transform: translateY(-2px);
}

.preset-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

.preset-preview {
  display: grid;
  gap: 2px;
  width: 60px;
  height: 60px;
  padding: 4px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #ebeef5;
}

.preset-cell {
  background: linear-gradient(135deg, #409eff 0%, #165DFF 100%);
  border-radius: 2px;
}

.preset-info {
  text-align: center;
}

.preset-label {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.preset-desc {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

.scene-section {
  padding: 0 8px;
}

.scene-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.scene-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border-radius: 8px;
  border: 1px solid #ebeef5;
  margin-bottom: 12px;
  font-size: 13px;
  color: #606266;
  transition: all 0.2s;
}

.scene-card:hover {
  border-color: #165DFF;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
  transform: translateY(-2px);
}

.tips-card {
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
}

.tips-card :deep(.el-card__header) {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-bottom: none;
}

.tips-card :deep(.el-card__body) {
  padding: 16px;
}

.spec-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.spec-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spec-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.spec-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.spec-label {
  font-size: 12px;
  color: #909399;
}

.spec-value {
  font-size: 13px;
  color: #303133;
  font-weight: 500;
}

.spec-tips {
  margin-top: 16px;
  padding: 10px 12px;
  background: #fdf6ec;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #b88230;
  line-height: 1.5;
}

.privacy-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 8px;
  font-size: 13px;
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

.preset-select {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preset-select-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  color: #606266;
}

.preset-select-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.preset-select-item.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #409eff 0%, #165DFF 100%);
  color: #fff;
}

.preset-select-preview {
  border-radius: 2px;
  flex-shrink: 0;
}

.size-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
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
  line-height: 1.8;
}

.download-tip-content p {
  margin: 4px 0;
}

@media (max-width: 992px) {
  .el-col {
    width: 100% !important;
  }
}
</style>
