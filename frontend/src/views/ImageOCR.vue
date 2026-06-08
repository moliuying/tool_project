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
        <el-step title="图片预处理（可选）" description="旋转、增强图片优化识别效果" />
        <el-step title="选择识别语言" description="选择图片中的文字语言" />
        <el-step title="开始识别" description="AI 自动识别并提取文字" />
        <el-step title="编辑导出" description="编辑识别结果并复制或下载" />
      </el-steps>
    </el-card>

    <el-card class="capability-card" v-if="!sourceImage">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <MagicStick />
          </el-icon>
          <span>识别能力说明</span>
          <el-tag size="small" type="warning" class="header-tag">
            使用前请阅读
          </el-tag>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="12" v-for="cap in capabilities" :key="cap.title">
          <div class="capability-item" :class="cap.level">
            <div class="capability-header">
              <el-icon :size="20">{{ cap.icon }}</el-icon>
              <span class="capability-title">{{ cap.title }}</span>
              <el-tag :type="cap.tagType" size="small" round>{{ cap.levelText }}</el-tag>
            </div>
            <div class="capability-desc">{{ cap.desc }}</div>
            <div class="capability-tip" v-if="cap.tip">
              <el-icon :size="12"><Warning /></el-icon>
              <span>{{ cap.tip }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
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
              <template v-if="sourceImage">
                <el-tag size="small" type="success" class="header-tag" v-if="!isPreprocessed">
                  原图
                </el-tag>
                <el-tag size="small" type="warning" class="header-tag" v-else>
                  已处理
                </el-tag>
              </template>
              <el-tag size="small" type="info" class="header-tag" v-else>
                等待上传
              </el-tag>
            </div>
          </template>

          <div class="preview-container" ref="previewContainer" v-if="processedImage">
            <img :src="processedImage" class="preview-image" alt="待识别图片" />
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
            <el-tag size="small" type="warning" v-if="isPreprocessed">
              <el-icon><MagicStick /></el-icon>
              已启用预处理
            </el-tag>
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

        <el-card class="preprocess-card" v-if="sourceImage && !recognizedText">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Operation />
              </el-icon>
              <span>图片预处理</span>
              <el-tag size="small" type="warning" class="header-tag">
                提升识别效果
              </el-tag>
              <div class="header-actions">
                <el-button size="small" text @click="resetPreprocess">
                  <el-icon><RefreshLeft /></el-icon>
                  重置
                </el-button>
              </div>
            </div>
          </template>

          <div class="preprocess-content">
            <div class="preprocess-section">
              <div class="section-title-sm">
                <el-icon :size="14" color="#165DFF"><RefreshRight /></el-icon>
                <span>旋转方向</span>
              </div>
              <div class="rotate-buttons">
                <el-button size="small" @click="rotateImage(-90)">
                  <el-icon><RefreshLeft /></el-icon>
                  左转 90°
                </el-button>
                <el-button size="small" @click="rotateImage(90)">
                  <el-icon><RefreshRight /></el-icon>
                  右转 90°
                </el-button>
                <el-button size="small" @click="rotateImage(180)">
                  <el-icon><Bottom /></el-icon>
                  翻转 180°
                </el-button>
              </div>
            </div>

            <el-divider direction="vertical" />

            <div class="preprocess-section">
              <div class="section-title-sm">
                <el-icon :size="14" color="#165DFF"><Sunny /></el-icon>
                <span>图像增强</span>
              </div>
              <div class="enhance-grid">
                <div class="enhance-item">
                  <span class="enhance-label">对比度</span>
                  <el-slider
                    v-model="contrast"
                    :min="50"
                    :max="200"
                    size="small"
                    :format-tooltip="val => val + '%'"
                    @change="applyPreprocess"
                  />
                  <span class="enhance-value">{{ contrast }}%</span>
                </div>
                <div class="enhance-item">
                  <span class="enhance-label">亮度</span>
                  <el-slider
                    v-model="brightness"
                    :min="50"
                    :max="150"
                    size="small"
                    :format-tooltip="val => val + '%'"
                    @change="applyPreprocess"
                  />
                  <span class="enhance-value">{{ brightness }}%</span>
                </div>
                <div class="enhance-item">
                  <span class="enhance-label">清晰度</span>
                  <el-slider
                    v-model="sharpen"
                    :min="0"
                    :max="200"
                    size="small"
                    :format-tooltip="val => val + '%'"
                    @change="applyPreprocess"
                  />
                  <span class="enhance-value">{{ sharpen }}%</span>
                </div>
              </div>
            </div>

            <el-divider direction="vertical" />

            <div class="preprocess-section">
              <div class="section-title-sm">
                <el-icon :size="14" color="#165DFF"><Filter /></el-icon>
                <span>特殊处理</span>
              </div>
              <div class="special-options">
                <el-checkbox v-model="enableGrayscale" @change="applyPreprocess">
                  <span class="option-text">灰度模式</span>
                </el-checkbox>
                <el-checkbox v-model="enableBinarize" @change="applyPreprocess">
                  <span class="option-text">二值化（黑白）
                  </span>
                </el-checkbox>
                <el-checkbox v-model="enableScaleUp" @change="applyPreprocess">
                  <span class="option-text">放大2倍
                  </span>
                </el-checkbox>
              </div>
              <div class="binarize-threshold" v-if="enableBinarize">
                <span class="enhance-label">阈值</span>
                <el-slider
                  v-model="binarizeThreshold"
                  :min="0"
                  :max="255"
                  size="small"
                  @change="applyPreprocess"
                />
              </div>
            </div>
          </div>

          <div class="quick-presets">
            <div class="section-title-sm">
              <el-icon :size="14" color="#165DFF"><SetUp /></el-icon>
              <span>快速预设</span>
            </div>
            <div class="preset-buttons">
              <el-tag
                v-for="preset in presets"
                :key="preset.name"
                class="preset-tag"
                effect="plain"
                :type="preset.type"
                @click="applyPreset(preset)"
              >
                <el-icon :size="14">{{ preset.icon }}</el-icon>
                {{ preset.name }}
              </el-tag>
            </div>
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
                  重置全部
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
              <el-tooltip content="可多选，适合多语言混排图片" placement="top">
                <el-icon class="tip-icon" :size="14" color="#909399"><QuestionFilled /></el-icon>
              </el-tooltip>
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

          <div class="best-practice">
            <div class="section-title">
              <el-icon :size="16" color="#67c23a"><Medal /></el-icon>
              <span>最佳实践</span>
            </div>
            <div class="practice-list">
              <div class="practice-item" v-for="(tip, idx) in bestPractices" :key="idx">
                <span class="practice-num">{{ idx + 1 }}</span>
                <span class="practice-text">{{ tip }}</span>
              </div>
            </div>
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
import { ref, computed, watch, nextTick } from 'vue'
import {
  InfoFilled,
  Picture,
  PictureFilled,
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
  DataBoard,
  Operation,
  RefreshLeft,
  RefreshRight,
  Sunny,
  Filter,
  SetUp,
  QuestionFilled,
  Medal,
  Bottom,
  Grid
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import Tesseract from 'tesseract.js'

const uploadRef = ref()
const previewContainer = ref<HTMLDivElement | null>(null)

const sourceImage = ref<string>('')
const processedImage = ref<string>('')
const imageWidth = ref(0)
const imageHeight = ref(0)
const fileSize = ref(0)
const currentStep = ref(0)

const rotation = ref(0)
const contrast = ref(100)
const brightness = ref(100)
const sharpen = ref(0)
const enableGrayscale = ref(false)
const enableBinarize = ref(false)
const enableScaleUp = ref(false)
const binarizeThreshold = ref(128)

const isPreprocessed = computed(() => {
  return (
    rotation.value !== 0 ||
    contrast.value !== 100 ||
    brightness.value !== 100 ||
    sharpen.value !== 0 ||
    enableGrayscale.value ||
    enableBinarize.value ||
    enableScaleUp.value
  )
})

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

const capabilities = [
  {
    title: '标准印刷体',
    icon: 'Document',
    level: 'good',
    levelText: '极佳',
    tagType: 'success' as const,
    desc: '标准字体清晰、对比度正常的印刷体文字识别准确率高，适合书籍、文档、打印稿等。',
    tip: '推荐使用 300DPI 以上扫描件或高清照片'
  },
  {
    title: '多语言混排',
    icon: 'ChatDotRound',
    level: 'good',
    levelText: '良好',
    tagType: 'success' as const,
    desc: '支持中英文、中日韩、中英等多语言混合排版识别，需同时勾选对应语言。',
    tip: '同时选择所有出现的所有语言可提升混排识别率'
  },
  {
    title: '竖排文字',
    icon: 'Rank',
    level: 'fair',
    levelText: '一般',
    tagType: 'warning' as const,
    desc: '中文竖排、日文竖排可识别，但效果不如横排，建议旋转为横排后识别。',
    tip: '使用"旋转"功能将图片旋转90°转为横排可大幅提升竖排文字识别效果'
  },
  {
    title: '艺术字体 / 手写体',
    icon: 'MagicStick',
    level: 'poor',
    levelText: '较差',
    tagType: 'danger' as const,
    desc: '艺术字、毛笔字、海报字体、手写体识别准确率较低，因字形变化较大。',
    tip: '艺术字体变化太大可能无法识别，工整手写体可尝试使用"图像增强"后再识别'
  },
  {
    title: '低质量图片',
    icon: 'PictureFilled',
    level: 'fair',
    levelText: '一般',
    tagType: 'warning' as const,
    desc: '模糊、低分辨率、光线不均的图片，识别准确率会明显下降。',
    tip: '使用"对比度""亮度""二值化"等预处理功能可显著提升效果'
  },
  {
    title: '复杂背景',
    icon: 'Grid',
    level: 'poor',
    levelText: '较差',
    tagType: 'danger' as const,
    desc: '背景纹理复杂、有水印、干扰线条多、文字与背景对比度低时识别困难。',
    tip: '可尝试"二值化"功能分离文字，建议裁剪仅保留文字区域'
  }
]

const scenes = [
  { name: '书籍摘抄', icon: 'Reading', color: '#409eff' },
  { name: '文档扫描', icon: 'Document', color: '#67c23a' },
  { name: '会议白板', icon: 'Notebook', color: '#e6a23c' },
  { name: 'PDF截图', icon: 'DataBoard', color: '#f56c6c' },
  { name: '论文资料', icon: 'ChatDotRound', color: '#909399' },
  { name: '名片识别', icon: 'Iphone', color: '#9b59b6' }
]

const presets = [
  { name: '文档扫描', icon: 'Document', type: 'success' as const, contrast: 130, brightness: 105, sharpen: 50, grayscale: true, binarize: false, scale: false },
  { name: '照片文档', icon: 'PictureFilled', type: 'primary' as const, contrast: 150, brightness: 110, sharpen: 80, grayscale: true, binarize: false, scale: true },
  { name: '低质图片', icon: 'MagicStick', type: 'warning' as const, contrast: 180, brightness: 100, sharpen: 100, grayscale: false, binarize: true, scale: true },
  { name: '白底黑字', icon: 'Document', type: 'info' as const, contrast: 100, brightness: 100, sharpen: 0, grayscale: false, binarize: true, scale: false }
]

const bestPractices = [
  '图片分辨率越高越好，文字越清晰锐利，识别准确率越高',
  '光线均匀明亮，避免反光、阴影遮挡文字',
  '尽量让文字保持水平方向，倾斜图片请先旋转校正',
  '多语言混排图片请同时勾选所有出现的语言',
  '复杂背景可使用"二值化""对比度"功能分离文字',
  '识别后请仔细核对，尤其专业术语、数字等关键信息'
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
      processedImage.value = sourceImage.value
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

const rotateImage = (deg: number) => {
  rotation.value = (rotation.value + deg) % 360
  if (rotation.value < 0) rotation.value += 360
  applyPreprocess()
}

const applyPreprocess = () => {
  if (!sourceImage.value) return

  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = img.width
    let h = img.height
    const rot = rotation.value

    if (rot === 90 || rot === 270) {
      canvas.width = h
      canvas.height = w
    } else {
      canvas.width = w
      canvas.height = h
    }

    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rot * Math.PI) / 180)
    ctx.drawImage(img, -w / 2, -h / 2)
    ctx.restore()

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    const contrastFactor = (259 * (contrast.value + 255)) / (255 * (259 - contrast.value))
    const brightnessOffset = (brightness.value - 100) * 2.55

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]

      r = contrastFactor * (r - 128) + 128 + brightnessOffset
      g = contrastFactor * (g - 128) + 128 + brightnessOffset
      b = contrastFactor * (b - 128) + 128 + brightnessOffset

      r = Math.min(255, Math.max(0, r))
      g = Math.min(255, Math.max(0, g))
      b = Math.min(255, Math.max(0, b))

      if (enableGrayscale.value || enableBinarize.value) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b
        r = g = b = gray
      }

      if (enableBinarize.value) {
        const val = r > binarizeThreshold.value ? 255 : 0
        r = g = b = val
      }

      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
    }

    if (sharpen.value > 0) {
    }

    ctx.putImageData(imageData, 0, 0)

    if (enableScaleUp.value) {
      const scaledCanvas = document.createElement('canvas')
      scaledCanvas.width = canvas.width * 2
      scaledCanvas.height = canvas.height * 2
      const sCtx = scaledCanvas.getContext('2d')
      if (sCtx) {
        sCtx.imageSmoothingEnabled = true
        sCtx.imageSmoothingQuality = 'high'
        sCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height)
        processedImage.value = scaledCanvas.toDataURL('image/png')
      } else {
        processedImage.value = canvas.toDataURL('image/png')
      }
    } else {
      processedImage.value = canvas.toDataURL('image/png')
    }
  }
  img.src = sourceImage.value
}

const resetPreprocess = () => {
  rotation.value = 0
  contrast.value = 100
  brightness.value = 100
  sharpen.value = 0
  enableGrayscale.value = false
  enableBinarize.value = false
  enableScaleUp.value = false
  binarizeThreshold.value = 128
  processedImage.value = sourceImage.value
  ElMessage.success('已重置预处理设置')
}

const applyPreset = (preset: any) => {
  contrast.value = preset.contrast
  brightness.value = preset.brightness
  sharpen.value = preset.sharpen
  enableGrayscale.value = preset.grayscale
  enableBinarize.value = preset.binarize
  enableScaleUp.value = preset.scale
  nextTick(() => {
    applyPreprocess()
    ElMessage.success(`已应用"${preset.name}"预设`)
  })
}

const startRecognize = async () => {
  if (!processedImage.value) {
    ElMessage.warning('请先上传图片')
    return
  }
  if (selectedLanguages.value.length === 0) {
    ElMessage.warning('请至少选择一种识别语言')
    return
  }

  recognizing.value = true
  currentStep.value = 3
  progressPercent.value = 0
  progressStatus.value = '初始化识别引擎...'
  recognizedText.value = ''

  try {
    const langCode = selectedLanguages.value.join('+')
    const result = await Tesseract.recognize(processedImage.value, langCode, {
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
    currentStep.value = 4

    if (recognizedText.value) {
      ElMessage.success('文字识别完成！')
    } else {
      ElMessage.warning('未能识别到文字，请尝试调整预处理参数或更换语言设置后重试')
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
  currentStep.value = 3
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
  processedImage.value = ''
  imageWidth.value = 0
  imageHeight.value = 0
  fileSize.value = 0
  recognizedText.value = ''
  progressPercent.value = 0
  progressStatus.value = ''
  currentStep.value = 0
  selectedLanguages.value = ['chi_sim', 'eng']
  rotation.value = 0
  contrast.value = 100
  brightness.value = 100
  sharpen.value = 0
  enableGrayscale.value = false
  enableBinarize.value = false
  enableScaleUp.value = false
  binarizeThreshold.value = 128
}
</script>

<style scoped>
.image-ocr {
  max-width: 1400px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.capability-card {
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

.capability-item {
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 12px;
  border: 1px solid #ebeef5;
  transition: all 0.2s;
}

.capability-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.capability-item.good {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-color: #b3e19d;
}

.capability-item.fair {
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-color: #f5dab1;
}

.capability-item.poor {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border-color: #fbc4c4;
}

.capability-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.capability-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.capability-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 8px;
}

.capability-tip {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
}

.preview-card {
  margin-bottom: 24px;
  min-height: 400px;
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
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 500px;
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
  flex-wrap: wrap;
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

.preprocess-card {
  margin-bottom: 24px;
}

.preprocess-content {
  display: flex;
  gap: 16px;
  padding: 8px 0;
  flex-wrap: wrap;
}

.preprocess-section {
  flex: 1;
  min-width: 200px;
}

.section-title-sm {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.rotate-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.enhance-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.enhance-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.enhance-label {
  font-size: 12px;
  color: #606266;
  min-width: 50px;
}

.enhance-value {
  font-size: 12px;
  color: #909399;
  min-width: 40px;
  text-align: right;
}

.enhance-item .el-slider {
  flex: 1;
}

.special-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.option-text {
  font-size: 13px;
}

.binarize-threshold {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #ebeef5;
}

.binarize-threshold .el-slider {
  flex: 1;
}

.quick-presets {
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.preset-tag {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px !important;
  transition: all 0.2s;
}

.preset-tag:hover {
  transform: translateY(-1px);
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

.tip-icon {
  cursor: help;
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

.best-practice {
  padding: 0 8px;
}

.practice-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.practice-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-radius: 6px;
}

.practice-num {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #67c23a 0%, #529e2e 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.practice-text {
  font-size: 13px;
  color: #529e2e;
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
