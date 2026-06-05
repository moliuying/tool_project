<template>
  <div class="holiday-avatar-maker">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Picture />
          </el-icon>
          <span>节日头像制作</span>
          <el-tag size="small" type="success">快速生成专属节日头像</el-tag>
        </div>
      </template>

      <div class="maker-container">
        <div class="upload-section">
          <div class="section-title">
            <el-icon><Upload /></el-icon>
            <span>上传照片</span>
          </div>
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeUpload"
            accept="image/*"
            drag
          >
            <div v-if="!userImage" class="upload-placeholder">
              <el-icon class="uploader-icon"><Plus /></el-icon>
              <div class="upload-text">点击或拖拽上传</div>
              <div class="upload-hint">将图片拖到此处</div>
            </div>
            <img v-else :src="userImage" class="uploaded-image" />
          </el-upload>
          <el-button v-if="userImage" type="danger" text @click="clearImage" class="clear-btn">
            <el-icon><Delete /></el-icon>
            重新上传
          </el-button>
          
          <el-card class="image-spec-card" shadow="never">
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
                  <span class="spec-label">推荐尺寸</span>
                  <span class="spec-value">400 x 400 像素（正方形）</span>
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
                  <span class="spec-value">不超过 5MB</span>
                </div>
              </div>
              <div class="spec-item">
                <el-icon color="#67c23a"><SuccessFilled /></el-icon>
                <div class="spec-content">
                  <span class="spec-label">建议比例</span>
                  <span class="spec-value">1:1（人物居中）</span>
                </div>
              </div>
            </div>
            <div class="spec-tips">
              <el-icon :size="12" color="#e6a23c"><Warning /></el-icon>
              <span>提示：非正方形图片会自动裁剪为圆形，横版/竖版图片可使用旋转功能调整方向，建议使用正脸清晰、背景简洁的照片</span>
            </div>
          </el-card>
        </div>

        <div class="preview-section">
          <div class="section-title">
            <el-icon><View /></el-icon>
            <span>预览效果</span>
          </div>
          <div class="preview-container" ref="previewContainer">
            <canvas ref="canvas" class="preview-canvas" :width="canvasSize" :height="canvasSize"></canvas>
            <div v-if="!userImage" class="preview-placeholder">
              <el-icon><Picture /></el-icon>
              <span>请先上传照片</span>
            </div>
          </div>
          <div class="preview-controls">
            <div class="control-buttons">
              <el-button-group>
                <el-button :disabled="!userImage" @click="rotateImage(-90)" title="逆时针旋转">
                  <el-icon><RefreshLeft /></el-icon>
                </el-button>
                <el-button :disabled="!userImage" @click="rotateImage(90)" title="顺时针旋转">
                  <el-icon><RefreshRight /></el-icon>
                </el-button>
                <el-button :disabled="!userImage" @click="flipImage('h')" title="水平翻转">
                  <el-icon><Switch /></el-icon>
                </el-button>
                <el-button :disabled="!userImage" @click="flipImage('v')" title="垂直翻转">
                  <el-icon><Bottom /></el-icon>
                </el-button>
              </el-button-group>
              <el-button :disabled="!userImage" type="primary" text @click="resetTransform">
                重置位置
              </el-button>
            </div>
            <div class="control-group">
              <span class="control-label">缩放</span>
              <el-slider v-model="imageScale" :min="0.5" :max="2" :step="0.01" class="control-slider" />
              <span class="control-value">{{ Math.round(imageScale * 100) }}%</span>
            </div>
            <div class="control-group">
              <span class="control-label">X轴偏移</span>
              <el-slider v-model="imageOffsetX" :min="-150" :max="150" class="control-slider" />
              <span class="control-value">{{ imageOffsetX }}px</span>
            </div>
            <div class="control-group">
              <span class="control-label">Y轴偏移</span>
              <el-slider v-model="imageOffsetY" :min="-150" :max="150" class="control-slider" />
              <span class="control-value">{{ imageOffsetY }}px</span>
            </div>
          </div>
        </div>

        <div class="frame-section">
          <div class="section-title">
            <el-icon><Grid /></el-icon>
            <span>选择节日边框</span>
          </div>
          <div class="frame-categories">
            <el-radio-group v-model="activeCategory" size="small">
              <el-radio-button v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="frame-list">
            <div
              v-for="frame in filteredFrames"
              :key="frame.id"
              class="frame-item"
              :class="{ active: selectedFrame?.id === frame.id }"
              @click="selectFrame(frame)"
            >
              <div class="frame-preview" :style="getFrameStyle(frame)">
                <span class="frame-emoji">{{ frame.emoji }}</span>
              </div>
              <span class="frame-name">{{ frame.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="action-bar">
        <el-button type="primary" size="large" :disabled="!canDownload" @click="downloadAvatar">
          <el-icon><Download /></el-icon>
          下载头像
        </el-button>
        <el-button size="large" @click="resetAll">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>
    </el-card>

    <el-card class="tips-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="16" color="#e6a23c">
            <InfoFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <el-steps :active="3" finish-status="success" simple>
        <el-step title="上传照片" description="上传您的个人头像照片" />
        <el-step title="选择边框" description="挑选喜欢的节日主题边框" />
        <el-step title="调整位置" description="缩放和移动照片到最佳位置" />
        <el-step title="下载使用" description="保存头像并分享到社交平台" />
      </el-steps>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  Picture,
  Upload,
  Plus,
  View,
  Grid,
  Download,
  Refresh,
  InfoFilled,
  Delete,
  SuccessFilled,
  Warning,
  RefreshLeft,
  RefreshRight,
  Switch,
  Bottom
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Frame {
  id: string
  name: string
  category: string
  emoji: string
  bgColor: string
  borderColor: string
  pattern?: string
}

const categories = [
  { label: '全部', value: 'all' },
  { label: '春节', value: 'spring' },
  { label: '国庆', value: 'national' },
  { label: '圣诞', value: 'christmas' },
  { label: '其他节日', value: 'other' }
]

const frames: Frame[] = [
  { id: 'spring-1', name: '新春大吉', category: 'spring', emoji: '🧧', bgColor: '#ffe4e1', borderColor: '#ff4d4f' },
  { id: 'spring-2', name: '福满人间', category: 'spring', emoji: '福', bgColor: '#fff1f0', borderColor: '#cf1322' },
  { id: 'spring-3', name: '龙年吉祥', category: 'spring', emoji: '🐉', bgColor: '#fff7e6', borderColor: '#fa8c16' },
  { id: 'spring-4', name: '岁岁平安', category: 'spring', emoji: '🎆', bgColor: '#fff0f6', borderColor: '#eb2f96' },
  { id: 'national-1', name: '我爱中国', category: 'national', emoji: '🇨🇳', bgColor: '#fff1f0', borderColor: '#cf1322' },
  { id: 'national-2', name: '国庆快乐', category: 'national', emoji: '🎊', bgColor: '#e6f7ff', borderColor: '#1890ff' },
  { id: 'national-3', name: '五星红旗', category: 'national', emoji: '⭐', bgColor: '#fff1f0', borderColor: '#ff4d4f' },
  { id: 'christmas-1', name: '圣诞快乐', category: 'christmas', emoji: '🎄', bgColor: '#f6ffed', borderColor: '#52c41a' },
  { id: 'christmas-2', name: '圣诞老人', category: 'christmas', emoji: '🎅', bgColor: '#fff1f0', borderColor: '#ff4d4f' },
  { id: 'christmas-3', name: '冬日祝福', category: 'christmas', emoji: '❄️', bgColor: '#e6f7ff', borderColor: '#1890ff' },
  { id: 'christmas-4', name: '礼物满满', category: 'christmas', emoji: '🎁', bgColor: '#fff7e6', borderColor: '#fa8c16' },
  { id: 'other-1', name: '中秋团圆', category: 'other', emoji: '🥮', bgColor: '#fffbe6', borderColor: '#faad14' },
  { id: 'other-2', name: '元宵佳节', category: 'other', emoji: '🏮', bgColor: '#fff1f0', borderColor: '#ff4d4f' },
  { id: 'other-3', name: '情人节', category: 'other', emoji: '💕', bgColor: '#fff0f6', borderColor: '#eb2f96' },
  { id: 'other-4', name: '元旦快乐', category: 'other', emoji: '🎉', bgColor: '#f9f0ff', borderColor: '#722ed1' }
]

const canvas = ref<HTMLCanvasElement | null>(null)
const previewContainer = ref<HTMLDivElement | null>(null)
const userImage = ref<string>('')
const selectedFrame = ref<Frame | null>(frames[0])
const activeCategory = ref('all')
const canvasSize = 400
const imageScale = ref(1)
const imageOffsetX = ref(0)
const imageOffsetY = ref(0)
const imageRotation = ref(0)
const flipH = ref(false)
const flipV = ref(false)

const filteredFrames = computed(() => {
  if (activeCategory.value === 'all') return frames
  return frames.filter(f => f.category === activeCategory.value)
})

const canDownload = computed(() => {
  return userImage.value && selectedFrame.value
})

const getFrameStyle = (frame: Frame) => {
  return {
    background: `linear-gradient(135deg, ${frame.bgColor} 0%, ${frame.borderColor}22 100%)`,
    borderColor: frame.borderColor
  }
}

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请上传图片文件！')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    userImage.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  return false
}

const clearImage = () => {
  userImage.value = ''
  resetTransform()
}

const resetTransform = () => {
  imageScale.value = 1
  imageOffsetX.value = 0
  imageOffsetY.value = 0
  imageRotation.value = 0
  flipH.value = false
  flipV.value = false
}

const rotateImage = (deg: number) => {
  imageRotation.value = (imageRotation.value + deg) % 360
}

const flipImage = (direction: 'h' | 'v') => {
  if (direction === 'h') {
    flipH.value = !flipH.value
  } else {
    flipV.value = !flipV.value
  }
}

const selectFrame = (frame: Frame) => {
  selectedFrame.value = frame
}

const drawPreview = () => {
  if (!canvas.value || !selectedFrame.value) return
  
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvasSize, canvasSize)
  
  const frame = selectedFrame.value
  
  ctx.fillStyle = '#f5f5f5'
  ctx.fillRect(0, 0, canvasSize, canvasSize)
  
  if (userImage.value) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const centerX = canvasSize / 2 + imageOffsetX.value
      const centerY = canvasSize / 2 + imageOffsetY.value
      
      const isRotated = Math.abs(imageRotation.value % 180) === 90
      const imgWidth = isRotated ? img.height : img.width
      const imgHeight = isRotated ? img.width : img.height
      
      const minDim = Math.min(imgWidth, imgHeight)
      const scale = (canvasSize * imageScale.value) / minDim
      const drawWidth = imgWidth * scale
      const drawHeight = imgHeight * scale
      
      ctx.save()
      ctx.beginPath()
      ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 20, 0, Math.PI * 2)
      ctx.clip()
      
      ctx.translate(centerX, centerY)
      ctx.rotate((imageRotation.value * Math.PI) / 180)
      ctx.scale(flipH.value ? -1 : 1, flipV.value ? -1 : 1)
      
      if (isRotated) {
        ctx.drawImage(
          img,
          -drawHeight / 2,
          -drawWidth / 2,
          drawHeight,
          drawWidth
        )
      } else {
        ctx.drawImage(
          img,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight
        )
      }
      
      ctx.restore()
      
      drawFrame(ctx, frame)
    }
    img.src = userImage.value
  } else {
    drawFrame(ctx, frame)
  }
}

const drawFrame = (ctx: CanvasRenderingContext2D, frame: Frame) => {
  const centerX = canvasSize / 2
  const centerY = canvasSize / 2
  const radius = canvasSize / 2 - 20
  
  ctx.strokeStyle = frame.borderColor
  ctx.lineWidth = 12
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.stroke()
  
  ctx.strokeStyle = frame.bgColor
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius - 8, 0, Math.PI * 2)
  ctx.stroke()
  
  const decorRadius = radius + 25
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const x = centerX + Math.cos(angle) * decorRadius
    const y = centerY + Math.sin(angle) * decorRadius
    
    ctx.fillStyle = frame.borderColor
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()
  }
  
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  const badgeX = canvasSize - 50
  const badgeY = 50
  
  ctx.fillStyle = frame.bgColor
  ctx.beginPath()
  ctx.arc(badgeX, badgeY, 30, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.strokeStyle = frame.borderColor
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(badgeX, badgeY, 30, 0, Math.PI * 2)
  ctx.stroke()
  
  ctx.font = '28px Arial'
  ctx.fillText(frame.emoji, badgeX, badgeY)
}

const downloadAvatar = () => {
  if (!canvas.value || !canDownload.value) return
  
  const link = document.createElement('a')
  link.download = `节日头像_${selectedFrame.value?.name || ''}_${Date.now()}.png`
  link.href = canvas.value.toDataURL('image/png')
  link.click()
  
  ElMessage.success('头像下载成功！')
}

const resetAll = () => {
  userImage.value = ''
  selectedFrame.value = frames[0]
  activeCategory.value = 'all'
  resetTransform()
}

watch([userImage, selectedFrame, imageScale, imageOffsetX, imageOffsetY, imageRotation, flipH, flipV], () => {
  drawPreview()
}, { immediate: true })

onMounted(() => {
  drawPreview()
})
</script>

<style scoped>
.holiday-avatar-maker {
  max-width: 1400px;
  margin: 0 auto;
}

.main-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.maker-container {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 24px;
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.upload-section {
  display: flex;
  flex-direction: column;
}

.avatar-uploader {
  width: 100%;
  aspect-ratio: 1;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.upload-placeholder:hover {
  border-color: #165DFF;
  background: #f0f7ff;
}

.uploader-icon {
  font-size: 48px;
  color: #8c8c8c;
  margin-bottom: 12px;
}

.upload-text {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #909399;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
}

.clear-btn {
  margin-top: 12px;
  align-self: center;
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

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-container {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  position: relative;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-canvas {
  max-width: 100%;
  height: auto;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #909399;
}

.preview-placeholder .el-icon {
  font-size: 64px;
}

.preview-controls {
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-label {
  font-size: 13px;
  color: #606266;
  min-width: 60px;
  font-weight: 500;
}

.control-slider {
  flex: 1;
}

.control-value {
  font-size: 12px;
  color: #909399;
  min-width: 50px;
  text-align: right;
}

.frame-section {
  display: flex;
  flex-direction: column;
}

.frame-categories {
  margin-bottom: 16px;
}

.frame-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 4px;
}

.frame-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  background: #fafafa;
}

.frame-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.frame-item.active {
  border-color: #165DFF;
  background: #f0f7ff;
  box-shadow: 0 0 0 4px rgba(22, 93, 255, 0.1);
}

.frame-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}

.frame-emoji {
  font-size: 24px;
}

.frame-name {
  font-size: 12px;
  color: #606266;
  text-align: center;
  font-weight: 500;
}

.action-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.tips-card {
  margin-bottom: 24px;
}

@media (max-width: 1200px) {
  .maker-container {
    grid-template-columns: 1fr 1fr;
  }
  
  .frame-section {
    grid-column: 1 / -1;
  }
  
  .frame-list {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 768px) {
  .maker-container {
    grid-template-columns: 1fr;
  }
  
  .frame-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
