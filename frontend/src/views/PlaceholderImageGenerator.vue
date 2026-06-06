<template>
  <div class="placeholder-generator">
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
        <el-step title="设置尺寸" description="输入图片宽度和高度，或选择常用预设" />
        <el-step title="自定义样式" description="设置显示文字、文字颜色和背景颜色" />
        <el-step title="预览效果" description="实时查看生成的占位图片效果" />
        <el-step title="下载使用" description="一键下载图片或复制图片地址" />
      </el-steps>
    </el-card>

    <el-row :gutter="24">
      <el-col :span="10">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Setting />
              </el-icon>
              <span>参数设置</span>
              <el-tag size="small" type="success" class="header-tag">本地生成 · 无需联网</el-tag>
            </div>
          </template>

          <div class="settings-form">
            <el-form label-position="top">
              <el-form-item label="图片尺寸">
                <div class="size-input-group">
                  <el-input-number
                    v-model="width"
                    :min="1"
                    :max="4096"
                    :step="10"
                    controls-position="right"
                    size="large"
                  />
                  <span class="size-separator">×</span>
                  <el-input-number
                    v-model="height"
                    :min="1"
                    :max="4096"
                    :step="10"
                    controls-position="right"
                    size="large"
                  />
                  <span class="size-unit">px</span>
                </div>
              </el-form-item>

              <el-form-item label="常用预设">
                <div class="preset-grid">
                  <div
                    v-for="preset in presets"
                    :key="preset.name"
                    class="preset-item"
                    :class="{ active: width === preset.width && height === preset.height }"
                    @click="applyPreset(preset)"
                  >
                    <span class="preset-name">{{ preset.name }}</span>
                    <span class="preset-size">{{ preset.width }}×{{ preset.height }}</span>
                  </div>
                </div>
              </el-form-item>

              <el-divider />

              <el-form-item label="显示文字">
                <el-input
                  v-model="text"
                  placeholder="留空则显示尺寸信息"
                  maxlength="50"
                  show-word-limit
                  size="large"
                />
                <div class="text-tip">
                  <el-icon :size="12" color="#909399"><InfoFilled /></el-icon>
                  <span>提示：留空将自动显示「宽×高」格式的尺寸文字</span>
                </div>
              </el-form-item>

              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="背景颜色">
                    <div class="color-picker-group">
                      <el-color-picker
                        v-model="bgColor"
                        size="large"
                        show-alpha
                      />
                      <el-input
                        v-model="bgColor"
                        size="large"
                        placeholder="#CCCCCC"
                        class="color-input"
                      />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="文字颜色">
                    <div class="color-picker-group">
                      <el-color-picker
                        v-model="textColor"
                        size="large"
                        show-alpha
                      />
                      <el-input
                        v-model="textColor"
                        size="large"
                        placeholder="#FFFFFF"
                        class="color-input"
                      />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="常用配色">
                <div class="color-presets">
                  <div
                    v-for="scheme in colorSchemes"
                    :key="scheme.name"
                    class="color-scheme-item"
                    :class="{ active: bgColor === scheme.bg && textColor === scheme.text }"
                    @click="applyColorScheme(scheme)"
                  >
                    <div class="color-swatch-group">
                      <span class="color-swatch" :style="{ backgroundColor: scheme.bg }"></span>
                      <span class="color-swatch-text" :style="{ backgroundColor: scheme.text, color: scheme.bg }">Aa</span>
                    </div>
                    <span class="scheme-name">{{ scheme.name }}</span>
                  </div>
                </div>
              </el-form-item>

              <el-divider />

              <el-form-item label="文字大小">
                <el-slider
                  v-model="fontSizePercent"
                  :min="5"
                  :max="50"
                  show-input
                  :format-tooltip="val => val + '%'"
                />
                <div class="slider-tip">基于图片较短边的百分比</div>
              </el-form-item>

              <el-form-item label="输出格式">
                <el-radio-group v-model="format" size="small">
                  <el-radio-button value="png">PNG</el-radio-button>
                  <el-radio-button value="jpeg">JPEG</el-radio-button>
                  <el-radio-button value="webp">WebP</el-radio-button>
                </el-radio-group>
              </el-form-item>

              <template v-if="format === 'jpeg'">
                <el-form-item label="JPEG 质量">
                  <el-slider
                    v-model="quality"
                    :min="10"
                    :max="100"
                    show-input
                    :format-tooltip="val => val + '%'"
                  />
                </el-form-item>
              </template>
            </el-form>
          </div>

          <div class="action-buttons">
            <el-button type="primary" size="large" @click="downloadImage">
              <el-icon><Download /></el-icon>
              下载图片
            </el-button>
            <el-button size="large" @click="copyImageUrl">
              <el-icon><CopyDocument /></el-icon>
              复制图片地址
            </el-button>
            <el-button size="large" @click="resetSettings">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </div>
        </el-card>

        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="16" color="#E6A23C">
                <LightBulb />
              </el-icon>
              <span>适用场景</span>
            </div>
          </template>
          <div class="scenes-list">
            <div class="scene-item">
              <el-icon :size="20" color="#409eff"><Document /></el-icon>
              <div class="scene-content">
                <span class="scene-title">原型设计</span>
                <span class="scene-desc">快速填充页面布局中的图片位</span>
              </div>
            </div>
            <div class="scene-item">
              <el-icon :size="20" color="#67c23a"><Monitor /></el-icon>
              <div class="scene-content">
                <span class="scene-title">前端开发</span>
                <span class="scene-desc">调试响应式布局和图片尺寸适配</span>
              </div>
            </div>
            <div class="scene-item">
              <el-icon :size="20" color="#e6a23c"><Tickets /></el-icon>
              <div class="scene-content">
                <span class="scene-title">文档编写</span>
                <span class="scene-desc">为技术文档和产品说明添加示意图</span>
              </div>
            </div>
            <div class="scene-item">
              <el-icon :size="20" color="#f56c6c"><Grid /></el-icon>
              <div class="scene-content">
                <span class="scene-title">UI 设计</span>
                <span class="scene-desc">快速产出不同尺寸的占位素材</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="14">
        <el-card class="preview-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <View />
              </el-icon>
              <span>实时预览</span>
              <el-tag size="small" type="success" effect="light" class="header-tag">
                <el-icon><Lightning /></el-icon>
                修改参数自动更新
              </el-tag>
              <el-tag size="small" type="info" class="header-tag">{{ width }} × {{ height }} px</el-tag>
            </div>
          </template>

          <el-alert type="success" :closable="false" show-icon class="preview-notice">
            <template #title>
              <span>修改左侧任意参数后，预览图将自动刷新，无需手动点击生成。满意后点击「下载图片」即可保存。</span>
            </template>
          </el-alert>

          <div class="preview-wrapper">
            <div class="preview-container" ref="previewContainer">
              <canvas ref="canvas" class="preview-canvas" />
            </div>
          </div>

          <div class="preview-info">
            <div class="info-item">
              <span class="info-label">文件格式</span>
              <el-tag size="small" type="primary">{{ format.toUpperCase() }}</el-tag>
            </div>
            <div class="info-item">
              <span class="info-label">显示文字</span>
              <el-tag size="small">{{ displayText || '(自动显示尺寸)' }}</el-tag>
            </div>
            <div class="info-item">
              <span class="info-label">背景色</span>
              <span class="color-chip" :style="{ backgroundColor: bgColor }"></span>
              <code class="color-code">{{ bgColor }}</code>
            </div>
            <div class="info-item">
              <span class="info-label">文字色</span>
              <span class="color-chip" :style="{ backgroundColor: textColor }"></span>
              <code class="color-code">{{ textColor }}</code>
            </div>
          </div>
        </el-card>

        <el-card class="tip-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="16" color="#909399">
                <Warning />
              </el-icon>
              <span>小贴士</span>
            </div>
          </template>
          <div class="tips-content">
            <div class="tip-item">
              <el-icon color="#67c23a"><CircleCheckFilled /></el-icon>
              <span>所有图片均在浏览器本地生成，不会上传任何数据，安全可靠</span>
            </div>
            <div class="tip-item">
              <el-icon color="#67c23a"><CircleCheckFilled /></el-icon>
              <span>支持最大 4096×4096 像素的图片生成</span>
            </div>
            <div class="tip-item">
              <el-icon color="#67c23a"><CircleCheckFilled /></el-icon>
              <span>需要透明背景？选择 PNG 格式并将背景色设为透明</span>
            </div>
            <div class="tip-item">
              <el-icon color="#67c23a"><CircleCheckFilled /></el-icon>
              <span>「复制图片地址」功能可直接粘贴到 Markdown 文档中使用</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import {
  InfoFilled,
  Setting,
  Download,
  CopyDocument,
  Refresh,
  View,
  LightBulb,
  Document,
  Monitor,
  Tickets,
  Grid,
  Warning,
  CircleCheckFilled,
  Lightning
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const canvas = ref<HTMLCanvasElement | null>(null)
const previewContainer = ref<HTMLDivElement | null>(null)

const width = ref(800)
const height = ref(600)
const text = ref('')
const bgColor = ref('#cccccc')
const textColor = ref('#ffffff')
const fontSizePercent = ref(20)
const format = ref<'png' | 'jpeg' | 'webp'>('png')
const quality = ref(90)

interface Preset {
  name: string
  width: number
  height: number
}

const presets: Preset[] = [
  { name: '头像', width: 200, height: 200 },
  { name: '缩略图', width: 300, height: 200 },
  { name: '文章配图', width: 800, height: 450 },
  { name: 'Banner', width: 1200, height: 400 },
  { name: '海报', width: 750, height: 1334 },
  { name: '横版壁纸', width: 1920, height: 1080 },
  { name: '竖版壁纸', width: 1080, height: 1920 },
  { name: '正方形', width: 1080, height: 1080 },
  { name: '4K 超清', width: 3840, height: 2160 }
]

interface ColorScheme {
  name: string
  bg: string
  text: string
}

const colorSchemes: ColorScheme[] = [
  { name: '经典灰', bg: '#cccccc', text: '#ffffff' },
  { name: '科技蓝', bg: '#165DFF', text: '#ffffff' },
  { name: '活力橙', bg: '#ff7a45', text: '#ffffff' },
  { name: '清新绿', bg: '#52c41a', text: '#ffffff' },
  { name: '优雅紫', bg: '#722ed1', text: '#ffffff' },
  { name: '玫瑰红', bg: '#eb2f96', text: '#ffffff' },
  { name: '暖色黄', bg: '#faad14', text: '#ffffff' },
  { name: '深黑', bg: '#262626', text: '#ffffff' },
  { name: '纯白', bg: '#ffffff', text: '#262626' },
  { name: '天空蓝', bg: '#e6f4ff', text: '#165DFF' },
  { name: '薄荷绿', bg: '#f6ffed', text: '#52c41a' },
  { name: '樱花粉', bg: '#fff0f6', text: '#eb2f96' }
]

const displayText = computed(() => {
  return text.value.trim() || `${width.value} × ${height.value}`
})

const applyPreset = (preset: Preset) => {
  width.value = preset.width
  height.value = preset.height
}

const applyColorScheme = (scheme: ColorScheme) => {
  bgColor.value = scheme.bg
  textColor.value = scheme.text
}

const resetSettings = () => {
  width.value = 800
  height.value = 600
  text.value = ''
  bgColor.value = '#cccccc'
  textColor.value = '#ffffff'
  fontSizePercent.value = 20
  format.value = 'png'
  quality.value = 90
  ElMessage.info('已恢复默认设置')
}

const drawPlaceholder = () => {
  if (!canvas.value || !previewContainer.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const w = width.value
  const h = height.value

  const maxWidth = previewContainer.value.clientWidth
  const maxHeight = 500
  const scale = Math.min(1, maxWidth / w, maxHeight / h)

  canvas.value.width = w * scale
  canvas.value.height = h * scale

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.scale(scale, scale)

  if (bgColor.value.toLowerCase() === 'transparent' || bgColor.value === '') {
    ctx.clearRect(0, 0, w, h)
  } else {
    ctx.fillStyle = bgColor.value
    ctx.fillRect(0, 0, w, h)
  }

  ctx.fillStyle = textColor.value
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const minDim = Math.min(w, h)
  const fontSize = Math.max(12, Math.floor(minDim * (fontSizePercent.value / 100)))

  ctx.font = `bold ${fontSize}px Arial, "Microsoft YaHei", sans-serif`

  const lines = wrapText(ctx, displayText.value, w * 0.9)
  const lineHeight = fontSize * 1.3
  const totalHeight = lines.length * lineHeight
  const startY = h / 2 - (totalHeight - lineHeight) / 2

  lines.forEach((line, index) => {
    ctx.fillText(line, w / 2, startY + index * lineHeight)
  })

  if (lines.length === 1 && !text.value.trim()) {
    ctx.font = `bold ${Math.floor(fontSize * 0.4)}px Arial, "Microsoft YaHei", sans-serif`
    ctx.fillStyle = textColor.value
    ctx.globalAlpha = 0.6
    ctx.fillText('Placeholder Image', w / 2, h / 2 + fontSize * 0.8)
    ctx.globalAlpha = 1
  }
}

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split('')
  const lines: string[] = []
  let currentLine = ''

  for (const char of words) {
    const testLine = currentLine + char
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine)
      currentLine = char
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines.length > 0 ? lines : [text]
}

const getDataUrl = (): string => {
  if (!canvas.value) return ''

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width.value
  tempCanvas.height = height.value
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return ''

  if (bgColor.value.toLowerCase() === 'transparent' || bgColor.value === '') {
    tempCtx.clearRect(0, 0, width.value, height.value)
  } else {
    tempCtx.fillStyle = bgColor.value
    tempCtx.fillRect(0, 0, width.value, height.value)
  }

  tempCtx.fillStyle = textColor.value
  tempCtx.textAlign = 'center'
  tempCtx.textBaseline = 'middle'

  const minDim = Math.min(width.value, height.value)
  const fontSize = Math.max(12, Math.floor(minDim * (fontSizePercent.value / 100)))

  tempCtx.font = `bold ${fontSize}px Arial, "Microsoft YaHei", sans-serif`

  const lines = wrapText(tempCtx, displayText.value, width.value * 0.9)
  const lineHeight = fontSize * 1.3
  const totalHeight = lines.length * lineHeight
  const startY = height.value / 2 - (totalHeight - lineHeight) / 2

  lines.forEach((line, index) => {
    tempCtx.fillText(line, width.value / 2, startY + index * lineHeight)
  })

  if (lines.length === 1 && !text.value.trim()) {
    tempCtx.font = `bold ${Math.floor(fontSize * 0.4)}px Arial, "Microsoft YaHei", sans-serif`
    tempCtx.fillStyle = textColor.value
    tempCtx.globalAlpha = 0.6
    tempCtx.fillText('Placeholder Image', width.value / 2, height.value / 2 + fontSize * 0.8)
    tempCtx.globalAlpha = 1
  }

  const mimeType = format.value === 'jpeg' ? 'image/jpeg' : format.value === 'webp' ? 'image/webp' : 'image/png'
  const qualityValue = format.value === 'jpeg' ? quality.value / 100 : undefined

  return tempCanvas.toDataURL(mimeType, qualityValue)
}

const downloadImage = () => {
  try {
    const dataUrl = getDataUrl()
    if (!dataUrl) {
      ElMessage.error('图片生成失败')
      return
    }

    const link = document.createElement('a')
    const ext = format.value
    link.download = `placeholder_${width.value}x${height.value}_${Date.now()}.${ext}`
    link.href = dataUrl
    link.click()

    ElMessage.success('图片下载成功！')
  } catch (e) {
    console.error('Download failed:', e)
    ElMessage.error('图片下载失败，请重试')
  }
}

const copyImageUrl = async () => {
  try {
    const dataUrl = getDataUrl()
    if (!dataUrl) {
      ElMessage.error('图片生成失败')
      return
    }

    await navigator.clipboard.writeText(dataUrl)
    ElMessage.success('图片地址已复制到剪贴板！')
  } catch (e) {
    console.error('Copy failed:', e)
    ElMessage.error('复制失败，请手动复制')
  }
}

watch(
  [width, height, text, bgColor, textColor, fontSizePercent],
  () => {
    nextTick(() => drawPlaceholder())
  }
)

onMounted(() => {
  nextTick(() => drawPlaceholder())

  window.addEventListener('resize', () => {
    nextTick(() => drawPlaceholder())
  })
})
</script>

<style scoped>
.placeholder-generator {
  max-width: 1400px;
  margin: 0 auto;
}

.guide-card,
.settings-card,
.preview-card,
.info-card,
.tip-card {
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

.guide-steps {
  padding: 10px 0;
}

.settings-form {
  padding: 8px 0;
}

.size-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.size-input-group :deep(.el-input-number) {
  flex: 1;
  width: auto;
}

.size-separator {
  font-size: 18px;
  font-weight: bold;
  color: #909399;
}

.size-unit {
  font-size: 14px;
  color: #909399;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: #fafafa;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-item:hover {
  background: #ecf5ff;
  border-color: #b3d8ff;
  transform: translateY(-2px);
}

.preset-item.active {
  background: linear-gradient(135deg, #409eff 0%, #165DFF 100%);
  border-color: #165DFF;
}

.preset-item.active .preset-name,
.preset-item.active .preset-size {
  color: #fff;
}

.preset-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.preset-size {
  font-size: 11px;
  color: #909399;
  font-family: 'Monaco', 'Menlo', monospace;
}

.text-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.color-picker-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-input {
  flex: 1;
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.color-scheme-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  background: #fafafa;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.color-scheme-item:hover {
  background: #ecf5ff;
  border-color: #b3d8ff;
  transform: translateY(-1px);
}

.color-scheme-item.active {
  border-color: #165DFF;
  background: #f0f7ff;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

.color-swatch-group {
  display: flex;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
}

.color-swatch {
  width: 28px;
  height: 24px;
}

.color-swatch-text {
  width: 28px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.scheme-name {
  font-size: 11px;
  color: #606266;
}

.slider-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  margin-top: 16px;
}

.action-buttons .el-button {
  flex: 1;
  min-width: 120px;
}

.scenes-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.scene-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.scene-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.scene-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.scene-desc {
  font-size: 11px;
  color: #909399;
  line-height: 1.4;
}

.preview-notice {
  margin-bottom: 16px;
}

.preview-notice :deep(.el-alert__title) {
  font-size: 13px;
  line-height: 1.5;
}

.preview-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 350px;
}

.preview-container {
  width: 100%;
  min-height: 350px;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 16px;
}

.preview-canvas {
  max-width: 100%;
  max-height: 500px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 13px;
  color: #909399;
  min-width: 60px;
}

.color-chip {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.color-code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #165DFF;
  background: #ecf5ff;
  padding: 2px 8px;
  border-radius: 4px;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.tip-item .el-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

@media (max-width: 992px) {
  .el-col {
    width: 100% !important;
  }

  .preset-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .color-presets {
    grid-template-columns: repeat(4, 1fr);
  }

  .scenes-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .preview-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .color-presets {
    grid-template-columns: repeat(3, 1fr);
  }

  .scenes-list {
    grid-template-columns: 1fr;
  }
}
</style>
