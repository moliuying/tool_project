<template>
  <div class="image-ocr" @paste="handlePaste">
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
        <el-step title="上传/粘贴图片" description="上传或粘贴包含文字的图片" />
        <el-step title="选择识别语言" description="选择图片中的文字语言" />
        <el-step title="开始识别" description="AI 自动识别并提取文字" />
        <el-step title="编辑导出" description="编辑识别结果并复制或下载" />
      </el-steps>
    </el-card>

    <el-row :gutter="24">
      <el-col :span="14">
        <el-card class="preview-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Picture />
              </el-icon>
              <span>图片预览</span>
              <el-tag size="small" type="success" class="header-tag" v-if="sourceImage">
                已加载
              </el-tag>
              <el-tag size="small" type="info" class="header-tag" v-else>
                等待上传
              </el-tag>
            </div>
          </template>

          <div class="preview-container" ref="previewContainer" v-if="sourceImage">
            <img :src="sourceImage" class="preview-image" alt="待识别图片" />
          </div>
          <div class="preview-container upload-placeholder" v-else @click="triggerUpload">
            <el-icon class="placeholder-icon"><UploadFilled /></el-icon>
            <div class="placeholder-text">点击上传图片</div>
            <div class="placeholder-subtext">或使用 Ctrl+V 粘贴图片</div>
            <div class="placeholder-tip">支持 JPG、PNG、WEBP、BMP 格式</div>
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :limit="1"
              accept="image/*"
              :on-change="handleFileChange"
              :on-exceed="handleExceed"
              class="hidden-uploader"
            />
          </div>

          <div class="preview-info" v-if="sourceImage">
            <el-tag size="small">尺寸: {{ imageWidth }} x {{ imageHeight }}</el-tag>
            <el-tag size="small" type="info">文件大小: {{ formatFileSize(fileSize) }}</el-tag>
          </div>

          <div class="paste-hint" v-if="!sourceImage">
            <el-alert type="info" :closable="false" show-icon>
              <template #title>
                <div class="hint-content">
                  <el-icon :size="16"><Promotion /></el-icon>
                  <span>快捷操作：按 <kbd>Ctrl</kbd> + <kbd>V</kbd> 可直接粘贴剪贴板中的图片</span>
                </div>
              </template>
            </el-alert>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card class="settings-card" v-if="!recognizedText">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Setting />
              </el-icon>
              <span>识别设置</span>
              <div class="header-actions" v-if="sourceImage">
                <el-button size="small" text @click="resetAll">
                  重置
                </el-button>
              </div>
            </div>
          </template>

          <div class="upload-section" v-if="!sourceImage">
            <div class="section-title">
              <el-icon :size="16" color="#165DFF"><Upload /></el-icon>
              <span>上传图片</span>
            </div>
            <el-upload
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
                  支持 JPG、PNG、WEBP、BMP 格式，文件大小建议不超过 10MB
                </div>
              </template>
            </el-upload>
          </div>

          <el-divider v-if="sourceImage" />

          <div class="language-section" v-if="sourceImage">
            <div class="section-title">
              <el-icon :size="16" color="#165DFF"><Iphone /></el-icon>
              <span>选择识别语言</span>
            </div>
            <div class="language-tags">
              <div
                v-for="lang in languages"
                :key="lang.value"
                class="lang-tag"
                :class="{ active: selectedLanguages.includes(lang.value) }"
                @click="toggleLanguage(lang.value)"
              >
                <span class="lang-emoji">{{ lang.emoji }}</span>
                <span class="lang-name">{{ lang.name }}</span>
              </div>
            </div>
            <div class="selected-hint" v-if="selectedLanguages.length > 0">
              <el-tag size="small" type="info">
                已选择 {{ selectedLanguages.length }} 种语言
              </el-tag>
            </div>
          </div>

          <el-divider v-if="sourceImage" />

          <div class="scene-section">
            <div class="section-title">
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
            <span>所有处理均在浏览器本地完成，图片不会上传到服务器，保障您的隐私安全</span>
          </div>
        </el-card>

        <el-card class="action-card" v-if="sourceImage && !recognizing && !recognizedText">
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="startRecognize" :disabled="selectedLanguages.length === 0">
              <el-icon><Search /></el-icon>
              开始文字识别
            </el-button>
          </div>
          <el-alert v-if="selectedLanguages.length === 0" type="warning" :closable="false" show-icon>
            <template #title>请至少选择一种识别语言</template>
          </el-alert>
        </el-card>

        <el-card class="progress-card" v-if="recognizing">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF" class="is-loading">
                <Loading />
              </el-icon>
              <span>正在识别中...</span>
            </div>
          </template>
          <div class="progress-content">
            <div class="progress-status">{{ progressStatus }}</div>
            <el-progress :percentage="progressPercent" :stroke-width="12" />
            <div class="progress-tip">
              <el-icon :size="14"><Warning /></el-icon>
              <span>首次使用会自动下载语言包，请耐心等待</span>
            </div>
          </div>
        </el-card>

        <el-card class="result-card" v-if="recognizedText">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Document />
              </el-icon>
              <span>识别结果</span>
              <el-tag size="small" type="success" class="header-tag">
                共 {{ charCount }} 字 / {{ lineCount }} 行
              </el-tag>
              <div class="header-actions">
                <el-button size="small" text @click="resetAll">
                  <el-icon><Refresh /></el-icon>
                  重新识别
                </el-button>
              </div>
            </div>
          </template>

          <div class="result-toolbar">
            <el-button size="small" @click="copyText" :disabled="!recognizedText">
              <el-icon><CopyDocument /></el-icon>
              复制文本
            </el-button>
            <el-button size="small" @click="downloadText" :disabled="!recognizedText">
              <el-icon><Download /></el-icon>
              下载 TXT
            </el-button>
            <el-button size="small" @click="clearResult">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
            <el-tooltip content="去除多余空行" placement="top">
              <el-button size="small" @click="trimEmptyLines">
                <el-icon><Rank /></el-icon>
                整理格式
              </el-button>
            </el-tooltip>
          </div>

          <el-input
            v-model="recognizedText"
            type="textarea"
            :rows="16"
            placeholder="识别结果将显示在这里..."
            class="result-textarea"
            resize="none"
          />

          <div class="result-stats">
            <el-tag size="small" v-for="stat in textStats" :key="stat.label" :type="stat.type">
              {{ stat.label }}: {{ stat.value }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  InfoFilled,
  Picture,
  Upload,
  UploadFilled,
  Setting,
  MagicStick,
  Lock,
  Search,
  Loading,
  Document,
  Refresh,
  CopyDocument,
  Download,
  Delete,
  Rank,
  Warning,
  Promotion,
  Iphone,
  Notebook,
  Reading,
  ChatDotRound,
  DataBoard
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import Tesseract from 'tesseract.js'

const uploadRef = ref()
const previewContainer = ref<HTMLDivElement | null>(null)

const sourceImage = ref<string>('')
const imageWidth = ref(0)
const imageHeight = ref(0)
const fileSize = ref(0)
const currentStep = ref(0)

const selectedLanguages = ref<string[]>(['chi_sim', 'eng'])
const recognizedText = ref('')
const recognizing = ref(false)
const progressPercent = ref(0)
const progressStatus = ref('准备中...')

const languages = [
  { value: 'chi_sim', name: '简体中文', emoji: '🇨🇳' },
  { value: 'chi_tra', name: '繁体中文', emoji: '🇭🇰' },
  { value: 'eng', name: 'English', emoji: '🇺🇸' },
  { value: 'jpn', name: '日本語', emoji: '🇯🇵' },
  { value: 'kor', name: '한국어', emoji: '🇰🇷' },
  { value: 'fra', name: 'Français', emoji: '🇫🇷' },
  { value: 'deu', name: 'Deutsch', emoji: '🇩🇪' },
  { value: 'spa', name: 'Español', emoji: '🇪🇸' }
]

const scenes = [
  { name: '书籍摘抄', icon: 'Reading', color: '#409eff' },
  { name: '文档扫描', icon: 'Document', color: '#67c23a' },
  { name: '会议白板', icon: 'Notebook', color: '#e6a23c' },
  { name: 'PDF截图', icon: 'DataBoard', color: '#f56c6c' },
  { name: '论文资料', icon: 'ChatDotRound', color: '#909399' },
  { name: '名片识别', icon: 'Iphone', color: '#9b59b6' }
]

const charCount = computed(() => recognizedText.value.replace(/\s/g, '').length)
const lineCount = computed(() => recognizedText.value.split('\n').filter(l => l.trim()).length)

const textStats = computed(() => {
  const text = recognizedText.value
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const english = (text.match(/[a-zA-Z]/g) || []).length
  const numbers = (text.match(/[0-9]/g) || []).length
  return [
    { label: '中文字符', value: chinese, type: '' as const },
    { label: '英文字母', value: english, type: 'info' as const },
    { label: '数字', value: numbers, type: 'success' as const }
  ]
})

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const toggleLanguage = (lang: string) => {
  const idx = selectedLanguages.value.indexOf(lang)
  if (idx > -1) {
    selectedLanguages.value.splice(idx, 1)
  } else {
    selectedLanguages.value.push(lang)
  }
}

const handleFileChange = async (file: UploadFile) => {
  if (!file.raw) return
  loadImageFromFile(file.raw)
}

const handleExceed = () => {
  ElMessage.warning('请先删除已上传的图片再重新上传')
}

const loadImageFromFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 10MB')
    return
  }

  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      sourceImage.value = e.target?.result as string
      fileSize.value = file.size
      const img = new Image()
      img.onload = () => {
        imageWidth.value = img.width
        imageHeight.value = img.height
        currentStep.value = 1
      }
      img.src = sourceImage.value
    }
    reader.readAsDataURL(file)
  } catch (e) {
    console.error('Failed to load image:', e)
    ElMessage.error('图片加载失败，请检查文件是否损坏')
  }
}

const handlePaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      e.preventDefault()
      const file = items[i].getAsFile()
      if (file) {
        loadImageFromFile(file)
        ElMessage.success('已从剪贴板粘贴图片')
      }
      break
    }
  }
}

const triggerUpload = () => {
  uploadRef.value?.$el.querySelector('input')?.click()
}

const startRecognize = async () => {
  if (!sourceImage.value) {
    ElMessage.warning('请先上传图片')
    return
  }
  if (selectedLanguages.value.length === 0) {
    ElMessage.warning('请至少选择一种识别语言')
    return
  }

  recognizing.value = true
  currentStep.value = 2
  progressPercent.value = 0
  progressStatus.value = '初始化识别引擎...'
  recognizedText.value = ''

  try {
    const langCode = selectedLanguages.value.join('+')
    const result = await Tesseract.recognize(sourceImage.value, langCode, {
      logger: (m) => {
        if (m.status) {
          const statusMap: Record<string, string> = {
            'loading tesseract core': '加载识别核心...',
            'initializing tesseract': '初始化引擎...',
            'loading language traineddata': '下载语言包...',
            'initializing api': '初始化 API...',
            'recognizing text': '正在识别文字...'
          }
          progressStatus.value = statusMap[m.status] || m.status
          if (m.progress !== undefined) {
            progressPercent.value = Math.round(m.progress * 100)
          }
        }
      }
    })

    recognizedText.value = result.data.text.trim()
    currentStep.value = 3

    if (recognizedText.value) {
      ElMessage.success('文字识别完成！')
    } else {
      ElMessage.warning('未能识别到文字，请尝试使用更清晰的图片或更换语言设置')
    }
  } catch (e) {
    console.error('OCR Error:', e)
    ElMessage.error('识别失败，请重试')
  } finally {
    recognizing.value = false
  }
}

const copyText = async () => {
  try {
    await navigator.clipboard.writeText(recognizedText.value)
    ElMessage.success('已复制到剪贴板')
  } catch (e) {
    const textarea = document.createElement('textarea')
    textarea.value = recognizedText.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('已复制到剪贴板')
  }
}

const downloadText = () => {
  if (!recognizedText.value) return
  const blob = new Blob([recognizedText.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `文字识别结果_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.txt`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('文件已下载')
}

const clearResult = () => {
  recognizedText.value = ''
  currentStep.value = 2
}

const trimEmptyLines = () => {
  if (!recognizedText.value) return
  recognizedText.value = recognizedText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
  ElMessage.success('格式已整理')
}

const resetAll = () => {
  sourceImage.value = ''
  imageWidth.value = 0
  imageHeight.value = 0
  fileSize.value = 0
  recognizedText.value = ''
  progressPercent.value = 0
  progressStatus.value = ''
  currentStep.value = 0
  selectedLanguages.value = ['chi_sim', 'eng']
}

onMounted(() => {
})

onBeforeUnmount(() => {
})
</script>

<style scoped>
.image-ocr {
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
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.upload-placeholder {
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(135deg, #f8faff 0%, #eef3ff 100%);
  border: 2px dashed #c6d8ff;
}

.upload-placeholder:hover {
  background: linear-gradient(135deg, #eef3ff 0%, #e0eaff 100%);
  border-color: #165DFF;
}

.placeholder-icon {
  font-size: 64px;
  color: #165DFF;
  margin-bottom: 16px;
}

.placeholder-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.placeholder-subtext {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}

.placeholder-tip {
  font-size: 12px;
  color: #909399;
}

.hidden-uploader {
  display: none;
}

.preview-info {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.paste-hint {
  margin-top: 16px;
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.hint-content kbd {
  padding: 2px 8px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.settings-card {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.upload-section {
  padding: 8px 0;
}

.image-uploader :deep(.el-upload-dragger) {
  width: 100%;
  padding: 30px 20px;
}

.image-uploader :deep(.el-upload) {
  width: 100%;
}

.language-section {
  padding: 8px 0;
}

.language-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.lang-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  color: #606266;
}

.lang-tag:hover {
  border-color: #409eff;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
  transform: translateY(-1px);
}

.lang-tag.active {
  background: linear-gradient(135deg, #409eff 0%, #165DFF 100%);
  color: #fff;
  border-color: #165DFF;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.lang-emoji {
  font-size: 16px;
}

.selected-hint {
  margin-top: 8px;
}

.scene-section {
  padding: 0 8px;
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

.action-card {
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.progress-card {
  margin-bottom: 24px;
}

.progress-content {
  padding: 16px 0;
}

.progress-status {
  font-size: 14px;
  color: #606266;
  margin-bottom: 16px;
  text-align: center;
}

.progress-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12px;
  color: #909399;
}

.result-card {
  margin-bottom: 24px;
}

.result-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.result-textarea :deep(.el-textarea__inner) {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', Consolas, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.8;
  padding: 16px;
}

.result-stats {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  flex-wrap: wrap;
}

.is-loading {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .el-col {
    width: 100% !important;
  }
}
</style>
