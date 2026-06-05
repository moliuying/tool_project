<template>
  <div class="subtitle-puzzle-maker">
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
        <el-step title="上传截图" description="上传多条字幕或台词截图" />
        <el-step title="调整顺序" description="拖拽调整图片拼接顺序" />
        <el-step title="设置样式" description="自定义间距、背景、圆角等" />
        <el-step title="下载长图" description="一键生成并下载拼图长图" />
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
              <span>预览效果</span>
              <el-tag size="small" type="success" class="header-tag">
                本地处理 · 安全可靠
              </el-tag>
            </div>
          </template>

          <div class="preview-container" ref="previewContainer">
            <div v-if="imageList.length === 0" class="preview-placeholder">
              <el-icon><Picture /></el-icon>
              <span>请先上传字幕截图</span>
            </div>
            <div v-else class="puzzle-preview-wrapper">
              <canvas ref="canvas" class="preview-canvas" />
            </div>
          </div>

          <div class="preview-info" v-if="imageList.length > 0">
            <el-tag size="small">图片数量: {{ imageList.length }}</el-tag>
            <el-tag size="small" type="info">拼图尺寸: {{ finalWidth }} x {{ finalHeight }}</el-tag>
            <el-tag size="small" type="success">输出格式: PNG</el-tag>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Upload />
              </el-icon>
              <span>上传截图</span>
              <el-tag size="small" type="info" class="header-tag">支持批量上传</el-tag>
            </div>
          </template>
          <div class="upload-area">
            <el-upload
              ref="uploadRef"
              drag
              multiple
              :auto-upload="false"
              :limit="50"
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
                  支持批量选择多张图片，单张不超过 10MB
                </div>
              </template>
            </el-upload>
          </div>

          <div class="image-list" v-if="imageList.length > 0">
            <div class="list-header">
              <span>已上传 {{ imageList.length }} 张图片</span>
              <el-button size="small" type="danger" text @click="clearAll">
                <el-icon><Delete /></el-icon>
                清空全部
              </el-button>
            </div>
            <draggable
              v-model="imageList"
              item-key="id"
              class="image-drag-list"
              ghost-class="ghost-item"
              animation="200"
              @end="onDragEnd"
            >
              <template #item="{ element, index }">
                <div class="image-item">
                  <div class="item-index">{{ index + 1 }}</div>
                  <img :src="element.src" class="item-thumb" />
                  <div class="item-info">
                    <div class="item-name">{{ element.name }}</div>
                    <div class="item-size">{{ element.width }} x {{ element.height }}</div>
                  </div>
                  <div class="item-actions">
                    <el-button size="small" text @click="moveUp(index)" :disabled="index === 0">
                      <el-icon><Top /></el-icon>
                    </el-button>
                    <el-button size="small" text @click="moveDown(index)" :disabled="index === imageList.length - 1">
                      <el-icon><Bottom /></el-icon>
                    </el-button>
                    <el-button size="small" type="danger" text @click="removeImage(index)">
                      <el-icon><Close /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
            </draggable>
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

          <div class="privacy-note">
            <el-icon><Lock /></el-icon>
            <span>所有操作均在浏览器本地完成，图片不会上传到服务器，保障您的隐私安全</span>
          </div>
        </el-card>

        <template v-if="imageList.length > 0">
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon :size="20" color="#165DFF">
                  <Setting />
                </el-icon>
                <span>样式设置</span>
                <div class="header-actions">
                  <el-button size="small" text @click="resetSettings">
                    重置设置
                  </el-button>
                </div>
              </div>
            </template>

            <div class="settings-form">
              <el-form label-position="top">
                <el-form-item label="拼图宽度">
                  <el-radio-group v-model="widthMode" size="small">
                    <el-radio-button value="max">最宽图片</el-radio-button>
                    <el-radio-button value="custom">自定义</el-radio-button>
                  </el-radio-group>
                  <el-slider
                    v-if="widthMode === 'custom'"
                    v-model="customWidth"
                    :min="300"
                    :max="1200"
                    :step="10"
                    show-input
                    class="mt-2"
                  />
                </el-form-item>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="图片间距">
                      <el-slider v-model="gap" :min="0" :max="50" show-input />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="内边距">
                      <el-slider v-model="padding" :min="0" :max="60" show-input />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="圆角大小">
                      <el-slider v-model="borderRadius" :min="0" :max="30" show-input />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="阴影效果">
                      <el-slider v-model="shadowSize" :min="0" :max="30" show-input />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="背景颜色">
                  <el-color-picker v-model="bgColor" show-alpha />
                  <span class="color-presets">
                    <span
                      v-for="color in bgPresets"
                      :key="color"
                      class="color-preset"
                      :style="{ background: color }"
                      @click="bgColor = color"
                    />
                  </span>
                </el-form-item>

                <el-form-item label="序号标记">
                  <el-switch v-model="showNumber" />
                  <div v-if="showNumber" class="number-settings">
                    <el-row :gutter="16">
                      <el-col :span="8">
                        <el-form-item label="位置">
                          <el-select v-model="numberPosition" size="small">
                            <el-option label="左上" value="top-left" />
                            <el-option label="右上" value="top-right" />
                            <el-option label="左下" value="bottom-left" />
                            <el-option label="右下" value="bottom-right" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="字体大小">
                          <el-slider v-model="numberSize" :min="12" :max="48" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="颜色">
                          <el-color-picker v-model="numberColor" show-alpha size="small" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>

                <el-form-item label="外框装饰">
                  <el-switch v-model="showBorder" />
                  <div v-if="showBorder" class="border-settings">
                    <el-row :gutter="16">
                      <el-col :span="8">
                        <el-form-item label="边框宽度">
                          <el-slider v-model="borderWidth" :min="1" :max="10" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="边框颜色">
                          <el-color-picker v-model="borderColor" show-alpha size="small" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </el-card>

          <el-card class="action-card">
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="downloadImage" :loading="downloading" :disabled="imageList.length === 0">
                <el-icon><Download /></el-icon>
                下载拼团长图
              </el-button>
            </div>
            <el-alert type="info" :closable="false" class="download-tip">
              <template #title>
                <span>下载说明：图片将以 PNG 格式保存，支持透明背景。所有处理均在本地完成，不会上传任何数据。</span>
              </template>
            </el-alert>
          </el-card>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import {
  InfoFilled,
  View,
  Upload,
  UploadFilled,
  MagicStick,
  Lock,
  Setting,
  Delete,
  Download,
  Picture,
  Top,
  Bottom,
  Close
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import draggable from 'vuedraggable'

interface ImageItem {
  id: string
  src: string
  name: string
  width: number
  height: number
  img: HTMLImageElement | null
}

const uploadRef = ref()
const canvas = ref<HTMLCanvasElement | null>(null)
const previewContainer = ref<HTMLDivElement | null>(null)

const imageList = ref<ImageItem[]>([])
const downloading = ref(false)

const widthMode = ref<'max' | 'custom'>('max')
const customWidth = ref(800)
const gap = ref(16)
const padding = ref(24)
const borderRadius = ref(12)
const shadowSize = ref(8)
const bgColor = ref('#ffffff')

const showNumber = ref(false)
const numberPosition = ref('top-left')
const numberSize = ref(24)
const numberColor = ref('#165DFF')

const showBorder = ref(false)
const borderWidth = ref(2)
const borderColor = ref('#e5e7eb')

const bgPresets = [
  '#ffffff',
  '#f3f4f6',
  '#18181b',
  '#0f172a',
  '#fef3c7',
  '#dbeafe',
  '#fce7f3',
  '#dcfce7'
]

const scenes = [
  { name: '影视台词', icon: 'VideoPlay', color: '#409eff' },
  { name: '金句汇总', icon: 'ChatDotRound', color: '#67c23a' },
  { name: '对话摘录', icon: 'ChatLineSquare', color: '#e6a23c' },
  { name: '课程笔记', icon: 'Notebook', color: '#f56c6c' }
]

const targetWidth = computed(() => {
  if (widthMode.value === 'custom' || imageList.value.length === 0) {
    return customWidth.value
  }
  return Math.max(...imageList.value.map(img => img.width))
})

const finalWidth = computed(() => {
  return targetWidth.value + padding.value * 2
})

const finalHeight = computed(() => {
  if (imageList.value.length === 0) return 0
  const totalImageHeight = imageList.value.reduce((sum, img) => {
    const scale = targetWidth.value / img.width
    return sum + img.height * scale
  }, 0)
  const totalGap = gap.value * (imageList.value.length - 1)
  return totalImageHeight + totalGap + padding.value * 2
})

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
      const src = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        imageList.value.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          src,
          name: file.name || `图片${imageList.value.length + 1}`,
          width: img.width,
          height: img.height,
          img
        })
        nextTick(() => drawPuzzle())
      }
      img.src = src
    }
    reader.readAsDataURL(file.raw)
  } catch (e) {
    console.error('Failed to load image:', e)
    ElMessage.error('图片加载失败，请检查文件是否损坏')
  }
}

const handleExceed = () => {
  ElMessage.warning('最多上传 50 张图片')
}

const clearAll = () => {
  imageList.value = []
}

const removeImage = (index: number) => {
  imageList.value.splice(index, 1)
}

const moveUp = (index: number) => {
  if (index > 0) {
    const temp = imageList.value[index]
    imageList.value[index] = imageList.value[index - 1]
    imageList.value[index - 1] = temp
  }
}

const moveDown = (index: number) => {
  if (index < imageList.value.length - 1) {
    const temp = imageList.value[index]
    imageList.value[index] = imageList.value[index + 1]
    imageList.value[index + 1] = temp
  }
}

const onDragEnd = () => {
  drawPuzzle()
}

const resetSettings = () => {
  widthMode.value = 'max'
  customWidth.value = 800
  gap.value = 16
  padding.value = 24
  borderRadius.value = 12
  shadowSize.value = 8
  bgColor.value = '#ffffff'
  showNumber.value = false
  numberPosition.value = 'top-left'
  numberSize.value = 24
  numberColor.value = '#165DFF'
  showBorder.value = false
  borderWidth.value = 2
  borderColor.value = '#e5e7eb'
}

const drawPuzzle = () => {
  if (!canvas.value || imageList.value.length === 0) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const w = finalWidth.value
  const h = finalHeight.value

  const maxPreviewWidth = previewContainer.value?.clientWidth || 600
  const scale = Math.min(1, maxPreviewWidth / w)
  canvas.value.width = w * scale
  canvas.value.height = h * scale

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.scale(scale, scale)

  ctx.fillStyle = bgColor.value
  ctx.fillRect(0, 0, w, h)

  let currentY = padding.value

  imageList.value.forEach((item, index) => {
    const scaleRatio = targetWidth.value / item.width
    const drawWidth = targetWidth.value
    const drawHeight = item.height * scaleRatio
    const x = padding.value
    const y = currentY

    if (shadowSize.value > 0) {
      ctx.save()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
      ctx.shadowBlur = shadowSize.value
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = shadowSize.value / 2
    }

    if (borderRadius.value > 0) {
      ctx.beginPath()
      ctx.roundRect(x, y, drawWidth, drawHeight, borderRadius.value)
      ctx.clip()
    }

    if (item.img) {
      ctx.drawImage(item.img, x, y, drawWidth, drawHeight)
    }

    if (borderRadius.value > 0 || shadowSize.value > 0) {
      ctx.restore()
    }

    if (showNumber.value) {
      drawNumber(ctx, index + 1, x, y, drawWidth, drawHeight)
    }

    if (showBorder.value && borderWidth.value > 0) {
      ctx.save()
      ctx.strokeStyle = borderColor.value
      ctx.lineWidth = borderWidth.value
      if (borderRadius.value > 0) {
        ctx.beginPath()
        ctx.roundRect(x, y, drawWidth, drawHeight, borderRadius.value)
        ctx.stroke()
      } else {
        ctx.strokeRect(x, y, drawWidth, drawHeight)
      }
      ctx.restore()
    }

    currentY += drawHeight + gap.value
  })
}

const drawNumber = (
  ctx: CanvasRenderingContext2D,
  num: number,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  ctx.save()
  ctx.font = `bold ${numberSize.value}px Arial, "Microsoft YaHei", sans-serif`
  ctx.fillStyle = numberColor.value
  ctx.textBaseline = 'top'

  const text = num.toString()
  const metrics = ctx.measureText(text)
  const textW = metrics.width
  const textH = numberSize.value
  const margin = 12

  let drawX = x + margin
  let drawY = y + margin

  switch (numberPosition.value) {
    case 'top-right':
      drawX = x + w - textW - margin
      drawY = y + margin
      break
    case 'bottom-left':
      drawX = x + margin
      drawY = y + h - textH - margin
      break
    case 'bottom-right':
      drawX = x + w - textW - margin
      drawY = y + h - textH - margin
      break
  }

  const pad = 6
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.beginPath()
  ctx.roundRect(drawX - pad, drawY - pad, textW + pad * 2, textH + pad * 2, 6)
  ctx.fill()

  ctx.fillStyle = numberColor.value
  ctx.fillText(text, drawX, drawY)
  ctx.restore()
}

const downloadImage = () => {
  if (imageList.value.length === 0) return

  downloading.value = true

  setTimeout(() => {
    try {
      const exportCanvas = document.createElement('canvas')
      const w = finalWidth.value
      const h = finalHeight.value
      exportCanvas.width = w
      exportCanvas.height = h
      const ctx = exportCanvas.getContext('2d')
      if (!ctx) return

      ctx.fillStyle = bgColor.value
      ctx.fillRect(0, 0, w, h)

      let currentY = padding.value

      imageList.value.forEach((item, index) => {
        const scaleRatio = targetWidth.value / item.width
        const drawWidth = targetWidth.value
        const drawHeight = item.height * scaleRatio
        const x = padding.value
        const y = currentY

        if (shadowSize.value > 0) {
          ctx.save()
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
          ctx.shadowBlur = shadowSize.value
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = shadowSize.value / 2
        }

        if (borderRadius.value > 0) {
          ctx.beginPath()
          ctx.roundRect(x, y, drawWidth, drawHeight, borderRadius.value)
          ctx.clip()
        }

        if (item.img) {
          ctx.drawImage(item.img, x, y, drawWidth, drawHeight)
        }

        if (borderRadius.value > 0 || shadowSize.value > 0) {
          ctx.restore()
        }

        if (showNumber.value) {
          drawNumber(ctx, index + 1, x, y, drawWidth, drawHeight)
        }

        if (showBorder.value && borderWidth.value > 0) {
          ctx.save()
          ctx.strokeStyle = borderColor.value
          ctx.lineWidth = borderWidth.value
          if (borderRadius.value > 0) {
            ctx.beginPath()
            ctx.roundRect(x, y, drawWidth, drawHeight, borderRadius.value)
            ctx.stroke()
          } else {
            ctx.strokeRect(x, y, drawWidth, drawHeight)
          }
          ctx.restore()
        }

        currentY += drawHeight + gap.value
      })

      const link = document.createElement('a')
      link.download = `字幕拼图_${Date.now()}.png`
      link.href = exportCanvas.toDataURL('image/png')
      link.click()

      downloading.value = false
      ElMessage.success('拼图下载成功！')
    } catch (e) {
      console.error('Download failed:', e)
      downloading.value = false
      ElMessage.error('拼图下载失败，请重试')
    }
  }, 100)
}

watch(
  [
    imageList,
    widthMode,
    customWidth,
    gap,
    padding,
    borderRadius,
    shadowSize,
    bgColor,
    showNumber,
    numberPosition,
    numberSize,
    numberColor,
    showBorder,
    borderWidth,
    borderColor
  ],
  () => {
    if (imageList.value.length > 0) {
      nextTick(() => drawPuzzle())
    }
  },
  { deep: true }
)
</script>

<style scoped>
.subtitle-puzzle-maker {
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
  min-height: 500px;
}

.preview-container {
  width: 100%;
  min-height: 400px;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
  padding: 20px;
}

.puzzle-preview-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.preview-canvas {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #909399;
  padding: 80px 0;
}

.preview-placeholder .el-icon {
  font-size: 64px;
}

.preview-info {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  flex-wrap: wrap;
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
  padding: 30px 20px;
}

.image-uploader :deep(.el-upload) {
  width: 100%;
}

.image-list {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #606266;
}

.image-drag-list {
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.image-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: move;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.image-item:hover {
  background: #f0f5ff;
  border-color: #b3d8ff;
}

.ghost-item {
  opacity: 0.5;
  background: #e6f4ff !important;
  border-color: #409eff !important;
}

.item-index {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #409eff 0%, #165DFF 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.item-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 13px;
  color: #303133;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-size {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

.item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
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

.color-presets {
  display: inline-flex;
  gap: 8px;
  margin-left: 12px;
  vertical-align: middle;
}

.color-preset {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
}

.color-preset:hover {
  transform: scale(1.1);
  border-color: #409eff;
}

.number-settings,
.border-settings {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #ebeef5;
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

.mt-2 {
  margin-top: 8px;
}

@media (max-width: 992px) {
  .el-col {
    width: 100% !important;
  }
}
</style>
