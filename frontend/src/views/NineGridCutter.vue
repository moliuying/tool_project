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
        <el-step title="上传图片" description="选择需要切割的图片（建议使用正方形）" />
        <el-step title="预览效果" description="实时预览九宫格切割效果" />
        <el-step title="下载图片" description="逐张下载或批量下载全部图片" />
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
              <span>九宫格预览</span>
              <el-tag size="small" type="success" class="header-tag">
                本地处理 · 安全可靠
              </el-tag>
            </div>
          </template>

          <div class="preview-wrapper">
            <div v-if="sourceImage" class="grid-preview" :style="gridStyle">
              <div
                v-for="(cell, index) in 9"
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
              <p class="placeholder-hint">图片将自动居中裁剪为正方形后切割</p>
            </div>
          </div>

          <div class="preview-info" v-if="sourceImage">
            <el-tag size="small">原图尺寸: {{ imageWidth }} x {{ imageHeight }}</el-tag>
            <el-tag size="small" type="info">输出尺寸: {{ outputSize }} x {{ outputSize }}</el-tag>
            <el-tag size="small" type="success">每张小图: {{ cellSize }} x {{ cellSize }}</el-tag>
          </div>
        </el-card>

        <el-card class="result-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Picture />
              </el-icon>
              <span>切割结果（点击图片可单独下载）</span>
            </div>
          </template>
          <div v-if="sourceImage" class="result-grid">
            <div
              v-for="(cell, index) in 9"
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
                  <span class="spec-label">推荐尺寸</span>
                  <span class="spec-value">900 x 900 像素（正方形）</span>
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
                  <span class="spec-label">每张小图</span>
                  <span class="spec-value">300 x 300 像素（可调整）</span>
                </div>
              </div>
              <div class="spec-item">
                <el-icon color="#67c23a"><SuccessFilled /></el-icon>
                <div class="spec-content">
                  <span class="spec-label">切割方式</span>
                  <span class="spec-value">居中裁剪为正方形后均分 3x3</span>
                </div>
              </div>
            </div>
            <div class="spec-tips">
              <el-icon :size="12" color="#e6a23c"><Warning /></el-icon>
              <span>提示：非正方形图片会自动居中裁剪为正方形，建议提前将主体内容放在图片中央区域</span>
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
                <el-form-item label="输出图片格式">
                  <el-radio-group v-model="outputFormat" size="small">
                    <el-radio-button value="png">PNG（无损）</el-radio-button>
                    <el-radio-button value="jpeg">JPEG（体积小）</el-radio-button>
                    <el-radio-button value="webp">WEBP（推荐）</el-radio-button>
                  </el-radio-group>
                </el-form-item>

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
                  <div class="size-hint">单张小图尺寸，总图尺寸为 {{ customSize * 3 }} x {{ customSize * 3 }}</div>
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
                下载全部 9 张图片
              </el-button>
            </div>
            <el-alert type="info" :closable="false" class="download-tip">
              <template #title>
                <div class="download-tip-content">
                  <p><strong>发布顺序提示：</strong></p>
                  <p>微信朋友圈/微博九宫格发布时，请按 <strong>1→2→3→4→5→6→7→8→9</strong> 的顺序依次上传，即可组成完整画面。</p>
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

const uploadRef = ref()

const sourceImage = ref<string>('')
const imageWidth = ref(0)
const imageHeight = ref(0)
const downloading = ref(false)

const outputFormat = ref<'png' | 'jpeg' | 'webp'>('png')
const presetSize = ref(600)
const customSize = ref(600)
const imageQuality = ref(92)

const gridImages = ref<string[]>([])

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

const cellSize = computed(() => {
  return presetSize.value === 0 ? customSize.value : presetSize.value
})

const outputSize = computed(() => cellSize.value * 3)

const gridStyle = computed(() => {
  const size = Math.min(500, outputSize.value)
  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundImage: sourceImage.value ? `url(${sourceImage.value})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

const getCellStyle = (index: number) => {
  return {
    backgroundImage: sourceImage.value ? `url(${gridImages.value[index] || ''})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
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
    const size = Math.min(img.width, img.height)
    const sx = (img.width - size) / 2
    const sy = (img.height - size) / 2

    const cell = cellSize.value
    const srcCell = size / 3

    const images: string[] = []
    let count = 0

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const canvas = document.createElement('canvas')
        canvas.width = cell
        canvas.height = cell
        const ctx = canvas.getContext('2d')
        if (!ctx) continue

        ctx.drawImage(
          img,
          sx + col * srcCell,
          sy + row * srcCell,
          srcCell,
          srcCell,
          0,
          0,
          cell,
          cell
        )

        const mimeType = outputFormat.value === 'png'
          ? 'image/png'
          : outputFormat.value === 'jpeg'
          ? 'image/jpeg'
          : 'image/webp'
        const quality = (outputFormat.value === 'jpeg' || outputFormat.value === 'webp')
          ? imageQuality.value / 100
          : undefined

        images[row * 3 + col] = canvas.toDataURL(mimeType, quality)
        count++

        if (count === 9) {
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
  link.download = `九宫格_${index + 1}.${getExtension()}`
  link.href = gridImages.value[index]
  link.click()
}

const downloadAll = async () => {
  if (gridImages.value.length < 9) {
    ElMessage.warning('图片尚未生成完成，请稍候')
    return
  }

  downloading.value = true
  const ext = getExtension()

  try {
    for (let i = 0; i < 9; i++) {
      const link = document.createElement('a')
      link.download = `九宫格_${i + 1}.${ext}`
      link.href = gridImages.value[i]
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    ElMessage.success('全部图片下载成功！请按 1-9 顺序上传到社交平台')
  } catch (e) {
    console.error('Download failed:', e)
    ElMessage.error('下载失败，请重试')
  } finally {
    downloading.value = false
  }
}

watch(
  [sourceImage, outputFormat, presetSize, customSize, imageQuality],
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
  grid-template-columns: repeat(3, 1fr);
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
  grid-template-columns: repeat(3, 1fr);
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
