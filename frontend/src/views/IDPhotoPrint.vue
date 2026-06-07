<template>
  <div class="id-photo-print">
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
        <el-step title="选择规格" description="选择证件照尺寸和相纸大小" />
        <el-step title="上传照片" description="上传您的证件照原图" />
        <el-step title="下载使用" description="下载排版图片直接送去冲印" />
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
              <span>排版预览</span>
              <el-tag size="small" type="success" class="header-tag">
                本地处理 · 安全可靠
              </el-tag>
            </div>
          </template>

          <div class="preview-wrapper">
            <div v-if="!sourceImage" class="preview-placeholder">
              <el-icon><Picture /></el-icon>
              <span>请先上传证件照</span>
              <p class="placeholder-hint">将自动排列 {{ photoCols }} × {{ photoRows }} = {{ totalPhotos }} 张 {{ currentPhotoSize?.name }} 照片</p>
            </div>
            <div v-else class="canvas-wrapper">
              <canvas ref="canvas" class="preview-canvas" />
            </div>
          </div>

          <div class="preview-info" v-if="sourceImage">
            <el-tag size="small">证件照: {{ currentPhotoSize?.name }} ({{ currentPhotoSize?.width }}×{{ currentPhotoSize?.height }}mm)</el-tag>
            <el-tag size="small" type="info">相纸: {{ currentPaperSize?.name }} ({{ currentPaperSize?.width }}×{{ currentPaperSize?.height }}mm)</el-tag>
            <el-tag size="small" type="success">排版: {{ photoCols }} × {{ photoRows }} = {{ totalPhotos }} 张</el-tag>
            <el-tag size="small" type="warning">输出: {{ outputWidth }} × {{ outputHeight }} px @ {{ dpi }}dpi</el-tag>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card class="size-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="18" color="#165DFF">
                <MagicStick />
              </el-icon>
              <span>规格设置</span>
            </div>
          </template>

          <div class="size-section">
            <div class="size-subtitle">
              <el-icon :size="14" color="#165DFF"><Camera /></el-icon>
              <span>证件照尺寸</span>
            </div>
            <div class="size-grid">
              <div
                v-for="size in photoSizes"
                :key="size.id"
                class="size-card-item"
                :class="{ active: selectedPhotoSizeId === size.id }"
                @click="selectPhotoSize(size.id)"
              >
                <div class="size-preview" :style="getPhotoPreviewStyle(size)">
                  <div class="size-avatar">
                    <el-icon :size="14"><User /></el-icon>
                  </div>
                </div>
                <div class="size-info">
                  <div class="size-name">{{ size.name }}</div>
                  <div class="size-dim">{{ size.width }}×{{ size.height }}mm</div>
                </div>
                <el-tag v-if="size.hot" size="small" type="danger" effect="light">常用</el-tag>
              </div>
            </div>
          </div>

          <el-divider />

          <div class="size-section">
            <div class="size-subtitle">
              <el-icon :size="14" color="#165DFF"><Document /></el-icon>
              <span>相纸尺寸</span>
            </div>
            <div class="size-grid">
              <div
                v-for="size in paperSizes"
                :key="size.id"
                class="size-card-item"
                :class="{ active: selectedPaperSizeId === size.id }"
                @click="selectPaperSize(size.id)"
              >
                <div class="size-preview paper-preview" :style="getPaperPreviewStyle(size)">
                  <div class="paper-inner" :style="getPaperInnerStyle(size)"></div>
                </div>
                <div class="size-info">
                  <div class="size-name">{{ size.name }}</div>
                  <div class="size-dim">{{ size.width }}×{{ size.height }}mm</div>
                </div>
                <el-tag v-if="size.hot" size="small" type="success" effect="light">热门</el-tag>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="upload-card" v-if="!sourceImage">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Upload />
              </el-icon>
              <span>上传证件照</span>
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
                将证件照拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  建议使用高清证件照，支持 JPG、PNG、WEBP 格式，文件大小不超过 10MB
                </div>
              </template>
            </el-upload>
          </div>

          <div class="privacy-note">
            <el-icon><Lock /></el-icon>
            <span>所有操作均在浏览器本地完成，照片不会上传到服务器</span>
          </div>

          <el-card class="image-spec-card" shadow="never">
            <template #header>
              <div class="spec-header">
                <el-icon :size="14" color="#165DFF"><InfoFilled /></el-icon>
                <span>图片规格说明</span>
              </div>
            </template>
            <div class="spec-list">
              <div class="spec-item">
                <el-icon color="#67c23a"><SuccessFilled /></el-icon>
                <div class="spec-content">
                  <span class="spec-label">无需提前裁剪</span>
                  <span class="spec-value">系统会自动按选定的证件照尺寸适配裁切</span>
                </div>
              </div>
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
                  <span class="spec-label">文件大小</span>
                  <span class="spec-value">不超过 10MB</span>
                </div>
              </div>
              <div class="spec-item">
                <el-icon color="#67c23a"><SuccessFilled /></el-icon>
                <div class="spec-content">
                  <span class="spec-label">当前选定尺寸</span>
                  <span class="spec-value">{{ currentPhotoSize?.name }}（{{ currentPhotoSize?.width }}×{{ currentPhotoSize?.height }}mm）</span>
                </div>
              </div>
              <div class="spec-item">
                <el-icon color="#67c23a"><SuccessFilled /></el-icon>
                <div class="spec-content">
                  <span class="spec-label">{{ dpi }}dpi推荐像素</span>
                  <span class="spec-value">{{ photoWidthPx }} × {{ photoHeightPx }} 像素以上</span>
                </div>
              </div>
            </div>
            <div class="spec-tips">
              <el-icon :size="12" color="#e6a23c"><Warning /></el-icon>
              <span>提示：建议上传高清证件照原图，分辨率越高打印越清晰。照片比例接近所选证件照比例效果最佳，系统会自动居中裁切或缩放适配。</span>
            </div>
          </el-card>
        </el-card>

        <template v-if="sourceImage">
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon :size="20" color="#165DFF">
                  <Setting />
                </el-icon>
                <span>排版设置</span>
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
                <el-form-item label="照片间距 (mm)">
                  <el-slider v-model="photoGap" :min="0" :max="10" :step="0.5" show-input />
                </el-form-item>

                <el-form-item label="相纸边距 (mm)">
                  <el-slider v-model="paperMargin" :min="0" :max="20" :step="1" show-input />
                </el-form-item>

                <el-form-item label="输出DPI">
                  <el-radio-group v-model="dpi" size="small">
                    <el-radio-button :value="150">150</el-radio-button>
                    <el-radio-button :value="300">300</el-radio-button>
                    <el-radio-button :value="600">600</el-radio-button>
                  </el-radio-group>
                  <div class="form-tip">冲印店标准为 300dpi，更高dpi可获得更清晰的打印效果</div>
                </el-form-item>

                <el-form-item label="背景颜色">
                  <el-color-picker v-model="bgColor" show-alpha />
                </el-form-item>

                <el-form-item label="照片边框">
                  <el-switch v-model="showBorder" />
                </el-form-item>

                <el-form-item v-if="showBorder" label="边框颜色">
                  <el-color-picker v-model="borderColor" />
                </el-form-item>

                <el-form-item v-if="showBorder" label="边框宽度 (mm)">
                  <el-slider v-model="borderWidth" :min="0.1" :max="2" :step="0.1" show-input />
                </el-form-item>

                <el-form-item label="裁切方式">
                  <el-radio-group v-model="cropMode" size="small">
                    <el-radio-button value="cover">填充裁切</el-radio-button>
                    <el-radio-button value="contain">完整显示</el-radio-button>
                    <el-radio-button value="stretch">拉伸铺满</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
          </el-card>

          <el-card class="action-card">
            <div class="layout-info">
              <el-alert :closable="false" type="info" :title="layoutInfoText" show-icon />
            </div>
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="downloadLayout" :loading="downloading">
                <el-icon><Download /></el-icon>
                下载排版图片
              </el-button>
            </div>
            <el-alert :closable="false" class="print-tip">
              <template #title>
                <div class="print-tip-content">
                  <p><strong>📌 冲印提示：</strong></p>
                  <p>1. 下载后将图片文件带到冲印店，告知店员按 <strong>{{ currentPaperSize?.name }}</strong> 尺寸原比例冲印即可</p>
                  <p>2. 冲印时请勿让店员再次缩放或裁剪，以免影响证件照尺寸精度</p>
                  <p>3. 如使用自助打印机，选择 <strong>原尺寸/100%比例</strong> 打印</p>
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
  Camera,
  Document,
  User,
  SuccessFilled,
  Warning
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'

interface PhotoSize {
  id: string
  name: string
  width: number
  height: number
  hot?: boolean
}

interface PaperSize {
  id: string
  name: string
  width: number
  height: number
  hot?: boolean
}

const photoSizes: PhotoSize[] = [
  { id: '1inch', name: '一寸', width: 25, height: 35, hot: true },
  { id: 'small-1inch', name: '小一寸', width: 22, height: 32 },
  { id: 'large-1inch', name: '大一寸', width: 33, height: 48 },
  { id: '2inch', name: '二寸', width: 35, height: 49, hot: true },
  { id: 'small-2inch', name: '小二寸', width: 35, height: 45 },
  { id: 'large-2inch', name: '大二寸', width: 35, height: 53 },
  { id: 'id-card', name: '身份证照', width: 26, height: 32 },
  { id: 'passport', name: '护照照片', width: 33, height: 48 }
]

const paperSizes: PaperSize[] = [
  { id: '5inch', name: '5寸', width: 89, height: 127, hot: true },
  { id: '6inch', name: '6寸', width: 102, height: 152, hot: true },
  { id: '7inch', name: '7寸', width: 127, height: 178 },
  { id: 'a4', name: 'A4纸', width: 210, height: 297 }
]

const uploadRef = ref()
const canvas = ref<HTMLCanvasElement | null>(null)

const sourceImage = ref<string>('')
const imageWidth = ref(0)
const imageHeight = ref(0)
const downloading = ref(false)

const selectedPhotoSizeId = ref('1inch')
const selectedPaperSizeId = ref('6inch')
const photoGap = ref(2)
const paperMargin = ref(3)
const dpi = ref(300)
const bgColor = ref('#ffffff')
const showBorder = ref(false)
const borderColor = ref('#cccccc')
const borderWidth = ref(0.5)
const cropMode = ref<'cover' | 'contain' | 'stretch'>('cover')

const currentPhotoSize = computed(() => photoSizes.find(s => s.id === selectedPhotoSizeId.value))
const currentPaperSize = computed(() => paperSizes.find(s => s.id === selectedPaperSizeId.value))

const mmToPx = (mm: number) => Math.round(mm * dpi.value / 25.4)

const photoWidthPx = computed(() => mmToPx(currentPhotoSize.value?.width || 25))
const photoHeightPx = computed(() => mmToPx(currentPhotoSize.value?.height || 35))

const paperWidthPx = computed(() => mmToPx(currentPaperSize.value?.width || 102))
const paperHeightPx = computed(() => mmToPx(currentPaperSize.value?.height || 152))

const outputWidth = computed(() => paperWidthPx.value)
const outputHeight = computed(() => paperHeightPx.value)

const photoGapPx = computed(() => mmToPx(photoGap.value))
const paperMarginPx = computed(() => mmToPx(paperMargin.value))
const borderWidthPx = computed(() => mmToPx(borderWidth.value))

const photoRows = computed(() => {
  if (!currentPaperSize.value || !currentPhotoSize.value) return 0
  const availableHeight = paperHeightPx.value - paperMarginPx.value * 2
  const photoTotalHeight = photoHeightPx.value + photoGapPx.value
  return Math.max(0, Math.floor((availableHeight + photoGapPx.value) / photoTotalHeight))
})

const photoCols = computed(() => {
  if (!currentPaperSize.value || !currentPhotoSize.value) return 0
  const availableWidth = paperWidthPx.value - paperMarginPx.value * 2
  const photoTotalWidth = photoWidthPx.value + photoGapPx.value
  return Math.max(0, Math.floor((availableWidth + photoGapPx.value) / photoTotalWidth))
})

const totalPhotos = computed(() => photoRows.value * photoCols.value)

const layoutInfoText = computed(() => {
  const ps = currentPhotoSize.value
  const pp = currentPaperSize.value
  if (!ps || !pp) return ''
  return `在 ${pp.name}(${pp.width}×${pp.height}mm) 相纸上可排列 ${totalPhotos.value} 张 ${ps.name}(${ps.width}×${ps.height}mm) 照片 (${photoCols.value}列 × ${photoRows.value}行)`
})

const selectPhotoSize = (id: string) => {
  selectedPhotoSizeId.value = id
}

const selectPaperSize = (id: string) => {
  selectedPaperSizeId.value = id
}

const getPhotoPreviewStyle = (size: PhotoSize) => {
  const maxW = 44
  const maxH = 56
  const ratio = size.width / size.height
  let w: number, h: number
  if (ratio > maxW / maxH) {
    w = maxW
    h = w / ratio
  } else {
    h = maxH
    w = h * ratio
  }
  return {
    width: `${w}px`,
    height: `${h}px`
  }
}

const getPaperPreviewStyle = (size: PaperSize) => {
  const maxW = 50
  const maxH = 60
  const ratio = size.width / size.height
  let w: number, h: number
  if (ratio > maxW / maxH) {
    w = maxW
    h = w / ratio
  } else {
    h = maxH
    w = h * ratio
  }
  return {
    width: `${w}px`,
    height: `${h}px`
  }
}

const getPaperInnerStyle = (size: PaperSize) => {
  const ps = currentPhotoSize.value
  if (!ps) return { opacity: 0 }
  const scaleX = size.width / (currentPaperSize.value?.width || 102)
  const scaleY = size.height / (currentPaperSize.value?.height || 152)
  const cols = Math.floor((size.width - 6) / (ps.width + 2))
  const rows = Math.floor((size.height - 6) / (ps.height + 2))
  const pw = (ps.width / size.width) * 100
  const ph = (ps.height / size.height) * 100
  return {
    backgroundSize: `${100 / cols}% ${100 / rows}%`,
    backgroundImage: `repeating-linear-gradient(0deg, #409eff 0, #409eff ${ph * 0.8}%, transparent ${ph * 0.8}%, transparent 100%), repeating-linear-gradient(90deg, transparent 0, transparent ${pw}%, #fff ${pw}%, #fff ${pw + 1}%)`
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
        nextTick(() => drawLayout())
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
}

const drawLayout = () => {
  if (!canvas.value || !sourceImage.value) return

  const c = canvas.value
  const ctx = c.getContext('2d')
  if (!ctx) return

  const maxDisplayWidth = 560
  const maxDisplayHeight = 700
  const ratio = paperWidthPx.value / paperHeightPx.value
  let displayW: number, displayH: number
  if (ratio > maxDisplayWidth / maxDisplayHeight) {
    displayW = maxDisplayWidth
    displayH = displayW / ratio
  } else {
    displayH = maxDisplayHeight
    displayW = displayH * ratio
  }

  const scale = displayW / paperWidthPx.value
  c.width = displayW
  c.height = displayH
  ctx.scale(scale, scale)

  ctx.fillStyle = bgColor.value
  ctx.fillRect(0, 0, paperWidthPx.value, paperHeightPx.value)

  const img = new Image()
  img.onload = () => {
    const cols = photoCols.value
    const rows = photoRows.value
    const pw = photoWidthPx.value
    const ph = photoHeightPx.value
    const gap = photoGapPx.value
    const margin = paperMarginPx.value

    const totalWidth = cols * pw + (cols - 1) * gap
    const totalHeight = rows * ph + (rows - 1) * gap
    const startX = margin + ((paperWidthPx.value - margin * 2) - totalWidth) / 2
    const startY = margin + ((paperHeightPx.value - margin * 2) - totalHeight) / 2

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (pw + gap)
        const y = startY + row * (ph + gap)

        ctx.save()

        if (showBorder.value) {
          ctx.strokeStyle = borderColor.value
          ctx.lineWidth = borderWidthPx.value
          ctx.strokeRect(
            x - borderWidthPx.value / 2,
            y - borderWidthPx.value / 2,
            pw + borderWidthPx.value,
            ph + borderWidthPx.value
          )
        }

        ctx.beginPath()
        ctx.rect(x, y, pw, ph)
        ctx.clip()

        let sx = 0, sy = 0, sw = img.width, sh = img.height
        let dx = x, dy = y, dw = pw, dh = ph

        if (cropMode.value === 'cover') {
          const imgRatio = img.width / img.height
          const targetRatio = pw / ph
          if (imgRatio > targetRatio) {
            sh = img.height
            sw = sh * targetRatio
            sx = (img.width - sw) / 2
            sy = 0
          } else {
            sw = img.width
            sh = sw / targetRatio
            sx = 0
            sy = (img.height - sh) / 2
          }
        } else if (cropMode.value === 'contain') {
          const imgRatio = img.width / img.height
          const targetRatio = pw / ph
          if (imgRatio > targetRatio) {
            dw = pw
            dh = dw / imgRatio
            dx = x
            dy = y + (ph - dh) / 2
          } else {
            dh = ph
            dw = dh * imgRatio
            dx = x + (pw - dw) / 2
            dy = y
          }
          sw = img.width
          sh = img.height
        }

        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)

        ctx.restore()
      }
    }
  }
  img.src = sourceImage.value
}

const downloadLayout = () => {
  if (!sourceImage.value) {
    ElMessage.warning('请先上传证件照')
    return
  }

  if (totalPhotos.value === 0) {
    ElMessage.warning('当前规格无法排列任何照片，请调整参数')
    return
  }

  downloading.value = true

  try {
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = paperWidthPx.value
    exportCanvas.height = paperHeightPx.value
    const ctx = exportCanvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    ctx.fillStyle = bgColor.value
    ctx.fillRect(0, 0, paperWidthPx.value, paperHeightPx.value)

    const img = new Image()
    img.onload = () => {
      const cols = photoCols.value
      const rows = photoRows.value
      const pw = photoWidthPx.value
      const ph = photoHeightPx.value
      const gap = photoGapPx.value
      const margin = paperMarginPx.value

      const totalWidth = cols * pw + (cols - 1) * gap
      const totalHeight = rows * ph + (rows - 1) * gap
      const startX = margin + ((paperWidthPx.value - margin * 2) - totalWidth) / 2
      const startY = margin + ((paperHeightPx.value - margin * 2) - totalHeight) / 2

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = startX + col * (pw + gap)
          const y = startY + row * (ph + gap)

          ctx.save()

          if (showBorder.value) {
            ctx.strokeStyle = borderColor.value
            ctx.lineWidth = borderWidthPx.value
            ctx.strokeRect(
              x - borderWidthPx.value / 2,
              y - borderWidthPx.value / 2,
              pw + borderWidthPx.value,
              ph + borderWidthPx.value
            )
          }

          ctx.beginPath()
          ctx.rect(x, y, pw, ph)
          ctx.clip()

          let sx = 0, sy = 0, sw = img.width, sh = img.height
          let dx = x, dy = y, dw = pw, dh = ph

          if (cropMode.value === 'cover') {
            const imgRatio = img.width / img.height
            const targetRatio = pw / ph
            if (imgRatio > targetRatio) {
              sh = img.height
              sw = sh * targetRatio
              sx = (img.width - sw) / 2
              sy = 0
            } else {
              sw = img.width
              sh = sw / targetRatio
              sx = 0
              sy = (img.height - sh) / 2
            }
          } else if (cropMode.value === 'contain') {
            const imgRatio = img.width / img.height
            const targetRatio = pw / ph
            if (imgRatio > targetRatio) {
              dw = pw
              dh = dw / imgRatio
              dx = x
              dy = y + (ph - dh) / 2
            } else {
              dh = ph
              dw = dh * imgRatio
              dx = x + (pw - dw) / 2
              dy = y
            }
            sw = img.width
            sh = img.height
          }

          ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)

          ctx.restore()
        }
      }

      const link = document.createElement('a')
      const ps = currentPhotoSize.value
      const pp = currentPaperSize.value
      link.download = `证件照排版_${ps?.name || ''}_${pp?.name || ''}_${dpi.value}dpi_${Date.now()}.jpg`
      link.href = exportCanvas.toDataURL('image/jpeg', 0.95)
      link.click()

      ElMessage.success(`排版图片下载成功！共 ${totalPhotos.value} 张 ${ps?.name} 照片`)
      downloading.value = false
    }
    img.onerror = () => {
      ElMessage.error('图片加载失败')
      downloading.value = false
    }
    img.src = sourceImage.value
  } catch (e) {
    console.error('Download failed:', e)
    ElMessage.error('下载失败，请重试')
    downloading.value = false
  }
}

watch(
  [sourceImage, selectedPhotoSizeId, selectedPaperSizeId, photoGap, paperMargin, dpi, bgColor, showBorder, borderColor, borderWidth, cropMode],
  () => {
    if (sourceImage.value) {
      nextTick(() => drawLayout())
    }
  }
)
</script>

<style scoped>
.id-photo-print {
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
  min-height: 500px;
  align-items: center;
}

.canvas-wrapper {
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  padding: 20px;
  border-radius: 12px;
}

.preview-canvas {
  display: block;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 100%;
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

.size-card {
  margin-bottom: 24px;
}

.size-section {
  padding: 4px 0;
}

.size-subtitle {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.size-card-item {
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

.size-card-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
  transform: translateY(-2px);
}

.size-card-item.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

.size-card-item :deep(.el-tag) {
  position: absolute;
  top: -6px;
  right: -6px;
}

.size-preview {
  background: linear-gradient(135deg, #e8f3ff 0%, #c9dfff 100%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #a8c5e8;
  overflow: hidden;
}

.size-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #165DFF;
  background: linear-gradient(180deg, #409eff 0%, #165DFF 100%);
  color: white;
}

.paper-preview {
  background: white;
  border: 1px solid #d0d0d0;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2px;
}

.paper-inner {
  width: 100%;
  height: 100%;
  background: #409eff;
  opacity: 0.15;
}

.size-info {
  flex: 1;
  min-width: 0;
}

.size-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.size-dim {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
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

.image-spec-card {
  margin-top: 16px;
  border: 1px solid #ebeef5;
}

.image-spec-card :deep(.el-card__header) {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-bottom: none;
}

.image-spec-card :deep(.el-card__body) {
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

.settings-card {
  margin-bottom: 24px;
}

.settings-form {
  padding: 8px 0;
}

.form-tip {
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
}

.action-card {
  margin-bottom: 24px;
}

.layout-info {
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.print-tip {
  margin-bottom: 0;
}

.print-tip-content {
  line-height: 1.7;
}

.print-tip-content p {
  margin: 2px 0;
}

@media (max-width: 992px) {
  .el-col {
    width: 100% !important;
  }
}
</style>
