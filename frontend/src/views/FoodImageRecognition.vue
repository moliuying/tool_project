<template>
  <div class="food-recognition" @paste="handlePaste">
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
        <el-step title="上传菜品图片" description="上传或粘贴你想识别的美食照片" />
        <el-step title="开始识别" description="AI 自动分析菜品信息" />
        <el-step title="查看结果" description="获取菜品名称、食材、烹饪方式等信息" />
      </el-steps>
    </el-card>

    <el-card class="scenario-card" v-if="!sourceImage">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <MagicStick />
          </el-icon>
          <span>适用场景</span>
          <el-tag size="small" type="warning" class="header-tag">
            让美食不迷茫
          </el-tag>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="8" v-for="scenario in scenarios" :key="scenario.title">
          <div class="scenario-item">
            <div class="scenario-icon">
              <el-icon :size="28" :color="scenario.color">{{ scenario.icon }}</el-icon>
            </div>
            <div class="scenario-title">{{ scenario.title }}</div>
            <div class="scenario-desc">{{ scenario.desc }}</div>
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
              <span>菜品图片</span>
              <template v-if="sourceImage">
                <el-tag size="small" type="success" class="header-tag">
                  已上传
                </el-tag>
              </template>
              <el-tag size="small" type="info" class="header-tag" v-else>
                等待上传
              </el-tag>
            </div>
          </template>

          <div class="preview-container" v-if="sourceImage">
            <img :src="sourceImage" class="preview-image" alt="待识别菜品图片" />
          </div>
          <div class="preview-container upload-placeholder" v-else @click="triggerUpload">
            <el-icon class="placeholder-icon"><UploadFilled /></el-icon>
            <div class="placeholder-text">点击上传美食照片</div>
            <div class="placeholder-subtext">或使用 Ctrl+V 粘贴图片</div>
            <div class="placeholder-tip">支持 JPG、PNG、WEBP 格式，建议使用清晰的菜品特写照片</div>
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
        <el-card class="settings-card" v-if="!recognizing && !recognitionResult">
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
              <span>上传菜品图片</span>
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
                将美食照片拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 JPG、PNG、WEBP 格式，文件大小建议不超过 10MB，清晰的菜品特写照片识别效果最佳
                </div>
              </template>
            </el-upload>
          </div>

          <el-divider v-if="sourceImage" />

          <div class="tips-section" v-if="sourceImage">
            <div class="section-title">
              <el-icon :size="16" color="#67c23a"><Medal /></el-icon>
              <span>识别小技巧</span>
            </div>
            <div class="tips-list">
              <div class="tip-item" v-for="(tip, idx) in recognitionTips" :key="idx">
                <span class="tip-num">{{ idx + 1 }}</span>
                <span class="tip-text">{{ tip }}</span>
              </div>
            </div>
          </div>

          <el-divider v-if="sourceImage" />

          <div class="capability-section">
            <div class="section-title">
              <el-icon :size="16" color="#e6a23c"><MagicStick /></el-icon>
              <span>AI 识别能力</span>
            </div>
            <div class="capability-grid">
              <div class="capability-tag" v-for="cap in capabilities" :key="cap">
                {{ cap }}
              </div>
            </div>
          </div>

          <el-divider />

          <div class="privacy-note">
            <el-icon><Lock /></el-icon>
            <span>您的菜品图片仅用于本次识别，不会存储或用于其他用途</span>
          </div>
        </el-card>

        <el-card class="action-card" v-if="sourceImage && !recognizing && !recognitionResult">
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="startRecognize">
              <el-icon><Search /></el-icon>
              开始识别菜品
            </el-button>
          </div>
        </el-card>

        <el-card class="progress-card" v-if="recognizing">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF" class="is-loading">
                <Loading />
              </el-icon>
              <span>AI 正在识别中...</span>
            </div>
          </template>
          <div class="progress-content">
            <div class="progress-status">{{ progressStatus }}</div>
            <el-progress :percentage="progressPercent" :stroke-width="12" status="success" />
            <div class="progress-tip">
              <el-icon :size="14"><Warning /></el-icon>
              <span>AI 正在分析菜品特征，请稍候片刻</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="result-card" v-if="recognitionResult && currentDisplayData">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Document />
          </el-icon>
          <span>识别结果</span>
          <el-tag size="small" type="success" class="header-tag">
            置信度: {{ (recognitionResult.confidence * 100).toFixed(0) }}%
          </el-tag>
          <div class="header-actions">
            <el-button size="small" text @click="resetAll">
              <el-icon><Refresh /></el-icon>
              重新识别
            </el-button>
          </div>
        </div>
      </template>

      <div class="region-selector" v-if="hasRegionalVersions">
        <div class="region-selector-header">
          <el-icon :size="18" color="#e6a23c"><Location /></el-icon>
          <span class="region-selector-title">选择地区版本</span>
          <el-tag size="small" type="info">不同地区做法差异较大</el-tag>
        </div>
        <div class="region-tabs">
          <div
            v-for="(version, idx) in recognitionResult.regionalVersions"
            :key="version.region"
            :class="['region-tab', { active: activeRegionIndex === idx }]"
            @click="activeRegionIndex = idx"
          >
            <span class="region-icon">{{ version.regionIcon }}</span>
            <span class="region-name">{{ version.region }}</span>
            <el-tag v-if="version.isDefault" size="small" type="warning" effect="dark">推荐</el-tag>
          </div>
        </div>
      </div>

      <el-row :gutter="24">
        <el-col :span="8">
          <div class="dish-main-info">
            <div class="dish-name-section">
              <h2 class="dish-name">{{ recognitionResult.dishName }}</h2>
              <p class="dish-english">{{ recognitionResult.englishName }}</p>
            </div>
            <div class="dish-tags">
              <el-tag size="small" type="primary">{{ currentDisplayData.cuisine }}</el-tag>
              <el-tag
                size="small"
                v-for="tag in recognitionResult.dietaryTags"
                :key="tag"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>
            <p class="dish-description">{{ currentDisplayData.description }}</p>

            <div class="dish-meta">
              <div class="meta-item">
                <el-icon><Timer /></el-icon>
                <span class="meta-label">烹饪时长:</span>
                <span class="meta-value">{{ currentDisplayData.cookingTime }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Medal /></el-icon>
                <span class="meta-label">难度:</span>
                <span class="meta-value">{{ currentDisplayData.difficulty }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Flame /></el-icon>
                <span class="meta-label">热量:</span>
                <span class="meta-value">{{ currentDisplayData.calories }}</span>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="16">
          <el-tabs v-model="activeTab" class="result-tabs">
            <el-tab-pane label="主要食材" name="ingredients">
              <div class="ingredients-list">
                <div
                  class="ingredient-item"
                  v-for="ing in currentDisplayData.mainIngredients"
                  :key="ing.name"
                >
                  <div class="ingredient-info">
                    <span class="ingredient-name">{{ ing.name }}</span>
                    <span class="ingredient-prob">
                      {{ (ing.probability * 100).toFixed(0) }}%
                    </span>
                  </div>
                  <el-progress
                    :percentage="Math.round(ing.probability * 100)"
                    :stroke-width="8"
                    :show-text="false"
                    status="success"
                  />
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="烹饪方式" name="cooking">
              <div class="cooking-methods">
                <div
                  class="method-item"
                  v-for="method in currentDisplayData.cookingMethods"
                  :key="method.name"
                >
                  <div class="method-header">
                    <el-icon :size="18" color="#e6a23c"><Promotion /></el-icon>
                    <span class="method-name">{{ method.name }}</span>
                  </div>
                  <p class="method-desc">{{ method.description }}</p>
                </div>
              </div>
              <div class="flavor-info">
                <span class="flavor-label">口味特点:</span>
                <el-tag type="warning" size="large">{{ currentDisplayData.flavor }}</el-tag>
              </div>
            </el-tab-pane>

            <el-tab-pane label="营养信息" name="nutrition">
              <div class="nutrition-info">
                <div class="nutrition-card">
                  <el-icon :size="32" color="#67c23a"><Medal /></el-icon>
                  <div class="nutrition-content">
                    <div class="nutrition-label">营养特点</div>
                    <div class="nutrition-value">{{ currentDisplayData.nutritionalInfo }}</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="烹饪技巧" name="tips">
              <div class="cooking-tips">
                <div
                  class="tip-item"
                  v-for="(tip, idx) in currentDisplayData.cookingTips"
                  :key="idx"
                >
                  <div class="tip-bullet">{{ idx + 1 }}</div>
                  <p class="tip-content">{{ tip }}</p>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="相似菜品" name="similar">
              <div class="similar-dishes">
                <div
                  class="similar-item"
                  v-for="dish in recognitionResult.similarDishes"
                  :key="dish"
                >
                  <el-icon :size="16" color="#165DFF"><KnifeFork /></el-icon>
                  <span>{{ dish }}</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="history-card" v-if="recognizeHistory.length > 0">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Clock />
          </el-icon>
          <span>识别历史</span>
          <el-button size="small" text type="danger" @click="clearHistory">
            清空记录
          </el-button>
        </div>
      </template>

      <div class="history-list">
        <div
          class="history-item"
          v-for="(item, index) in displayHistory"
          :key="index"
          @click="loadFromHistory(item)"
        >
          <div class="history-thumb">
            <img :src="item.image" :alt="item.result.dishName" />
          </div>
          <div class="history-info">
            <div class="history-name">{{ item.result.dishName }}</div>
            <div class="history-meta">
              <el-tag size="small" type="info">{{ item.result.cuisine }}</el-tag>
              <span class="history-confidence">
                置信度 {{ (item.result.confidence * 100).toFixed(0) }}%
              </span>
            </div>
          </div>
          <div class="history-time">{{ formatTime(item.time) }}</div>
        </div>
      </div>
      <div class="history-footer" v-if="recognizeHistory.length > 6">
        <el-button text size="small" @click="showAllHistory = !showAllHistory">
          {{ showAllHistory ? '收起' : `查看全部 ${recognizeHistory.length} 条记录` }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  Warning,
  Promotion,
  Medal,
  Clock,
  KnifeFork,
  Timer,
  Flame,
  Location
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { foodRecognitionApi, type FoodRecognitionResult, type RegionalVersion } from '@/api/foodRecognition'

interface HistoryItem {
  image: string
  result: FoodRecognitionResult
  time: string
}

const STORAGE_KEY = 'food_recognition_history'

const uploadRef = ref()

const sourceImage = ref<string>('')
const imageWidth = ref(0)
const imageHeight = ref(0)
const fileSize = ref(0)

const recognizing = ref(false)
const progressPercent = ref(0)
const progressStatus = ref('准备中...')
const recognitionResult = ref<FoodRecognitionResult | null>(null)
const activeTab = ref('ingredients')
const activeRegionIndex = ref(0)

const recognizeHistory = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const hasRegionalVersions = computed(() => {
  return recognitionResult.value?.regionalVersions && recognitionResult.value.regionalVersions.length > 0
})

const currentDisplayData = computed(() => {
  if (!recognitionResult.value) return null
  if (hasRegionalVersions.value && recognitionResult.value.regionalVersions) {
    const version = recognitionResult.value.regionalVersions[activeRegionIndex.value]
    return {
      ...recognitionResult.value,
      cuisine: version.cuisine,
      mainIngredients: version.mainIngredients,
      cookingMethods: version.cookingMethods,
      flavor: version.flavor,
      description: version.description,
      difficulty: version.difficulty,
      cookingTime: version.cookingTime,
      calories: version.calories,
      nutritionalInfo: version.nutritionalInfo,
      cookingTips: version.cookingTips
    }
  }
  return recognitionResult.value
})

const currentStep = computed(() => {
  if (recognitionResult.value) return 2
  if (recognizing.value) return 1
  if (sourceImage.value) return 1
  return 0
})

const displayHistory = computed(() => {
  const reversed = recognizeHistory.value.slice().reverse()
  if (showAllHistory.value) return reversed
  return reversed.slice(0, 6)
})

const scenarios = [
  { title: '餐厅菜品认识', icon: 'Location', color: '#165DFF', desc: '看到陌生菜品想知道是什么' },
  { title: '朋友圈美食复刻', icon: 'Picture', color: '#e6a23c', desc: '想复刻朋友分享的美味佳肴' },
  { title: '旅行特色菜识别', icon: 'Medal', color: '#67c23a', desc: '旅游时了解当地特色美食' },
  { title: '家庭烹饪学习', icon: 'KnifeFork', color: '#f56c6c', desc: '看图学习新菜品做法' },
  { title: '外卖点餐参考', icon: 'Promotion', color: '#909399', desc: '识别图片了解菜品详情' },
  { title: '食材成分查询', icon: 'Document', color: '#9b59b6', desc: '了解菜品主要食材构成' }
]

const recognitionTips = [
  '使用清晰明亮的菜品特写照片，避免模糊和反光',
  '尽量拍摄完整的菜品，避免只拍局部',
  '光线均匀充足，避免阴影遮挡菜品细节',
  '纯色背景或简单背景能提高识别准确率',
  '尽量减少其他无关物体出现在画面中'
]

const capabilities = [
  '菜品名称识别',
  '主要食材分析',
  '烹饪方式判断',
  '口味特点描述',
  '菜系分类',
  '烹饪难度评估',
  '营养信息概览',
  '烹饪技巧推荐'
]

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
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
      }
      img.src = sourceImage.value
      recognitionResult.value = null
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
    ElMessage.warning('请先上传菜品图片')
    return
  }

  recognizing.value = true
  progressPercent.value = 0
  progressStatus.value = '正在分析图片...'
  recognitionResult.value = null

  const progressSteps = [
    { percent: 20, status: '正在提取图像特征...' },
    { percent: 45, status: '正在比对菜品数据库...' },
    { percent: 70, status: '正在分析食材构成...' },
    { percent: 90, status: '正在生成识别结果...' }
  ]

  let stepIndex = 0
  const progressTimer = setInterval(() => {
    if (stepIndex < progressSteps.length) {
      progressPercent.value = progressSteps[stepIndex].percent
      progressStatus.value = progressSteps[stepIndex].status
      stepIndex++
    }
  }, 500)

  try {
    const { data } = await foodRecognitionApi.recognizeFood(sourceImage.value)
    recognitionResult.value = data

    if (data.regionalVersions && data.regionalVersions.length > 0) {
      const defaultIndex = data.regionalVersions.findIndex(v => v.isDefault)
      activeRegionIndex.value = defaultIndex >= 0 ? defaultIndex : 0
    } else {
      activeRegionIndex.value = 0
    }

    clearInterval(progressTimer)
    progressPercent.value = 100
    progressStatus.value = '识别完成！'

    saveHistory({
      image: sourceImage.value,
      result: data,
      time: new Date().toISOString()
    })

    const versionInfo = data.regionalVersions && data.regionalVersions.length > 0
      ? `，共 ${data.regionalVersions.length} 个地区版本`
      : ''
    ElMessage.success({
      message: `🎉 识别成功！这是「${data.dishName}」${versionInfo}`,
      type: 'success',
      duration: 3000,
      showClose: true
    })
  } catch (e) {
    console.error('Recognition Error:', e)
    ElMessage.error('识别失败，请重试或更换图片')
  } finally {
    clearInterval(progressTimer)
    recognizing.value = false
  }
}

const resetAll = () => {
  sourceImage.value = ''
  imageWidth.value = 0
  imageHeight.value = 0
  fileSize.value = 0
  recognitionResult.value = null
  progressPercent.value = 0
  progressStatus.value = ''
  activeTab.value = 'ingredients'
  activeRegionIndex.value = 0
}

const loadHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      recognizeHistory.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
}

const saveHistory = (item: HistoryItem) => {
  recognizeHistory.value.push(item)
  if (recognizeHistory.value.length > 50) {
    recognizeHistory.value = recognizeHistory.value.slice(-50)
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recognizeHistory.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

const clearHistory = () => {
  recognizeHistory.value = []
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear history:', e)
  }
  ElMessage.success('历史记录已清空')
}

const loadFromHistory = (item: HistoryItem) => {
  sourceImage.value = item.image
  recognitionResult.value = item.result

  if (item.result.regionalVersions && item.result.regionalVersions.length > 0) {
    const defaultIndex = item.result.regionalVersions.findIndex(v => v.isDefault)
    activeRegionIndex.value = defaultIndex >= 0 ? defaultIndex : 0
  } else {
    activeRegionIndex.value = 0
  }

  const img = new Image()
  img.onload = () => {
    imageWidth.value = img.width
    imageHeight.value = img.height
  }
  img.src = item.image
  ElMessage.info(`已加载历史识别结果: ${item.result.dishName}`)
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.food-recognition {
  max-width: 1400px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.scenario-card {
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

.scenario-item {
  padding: 20px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border: 1px solid #ebeef5;
  text-align: center;
  transition: all 0.3s;
  margin-bottom: 12px;
}

.scenario-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #165DFF;
}

.scenario-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.scenario-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.scenario-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
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

.tips-section {
  padding: 8px 0;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-radius: 6px;
}

.tip-num {
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

.tip-text {
  font-size: 13px;
  color: #529e2e;
  line-height: 1.5;
}

.capability-section {
  padding: 0 8px;
}

.capability-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.capability-tag {
  padding: 6px 14px;
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border: 1px solid #f5dab1;
  border-radius: 20px;
  font-size: 12px;
  color: #e6a23c;
  font-weight: 500;
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
  margin-top: 16px;
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
  margin-bottom: 8px;
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

.region-selector {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-radius: 12px;
  border: 1px solid #f5dab1;
}

.region-selector-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #b88230;
}

.region-selector-header .el-tag {
  margin-left: auto;
  font-weight: normal;
}

.region-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.region-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #fff;
  border: 2px solid #e4e7ed;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.region-tab:hover {
  border-color: #e6a23c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.15);
}

.region-tab.active {
  background: linear-gradient(135deg, #ff9c6e 0%, #e6a23c 100%);
  border-color: #e6a23c;
  color: #fff;
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
}

.region-tab.active .el-tag {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #fff !important;
}

.region-icon {
  font-size: 20px;
}

.dish-main-info {
  padding-right: 24px;
  border-right: 1px solid #ebeef5;
}

.dish-name-section {
  margin-bottom: 16px;
}

.dish-name {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 8px 0;
}

.dish-english {
  font-size: 14px;
  color: #909399;
  margin: 0;
  font-style: italic;
}

.dish-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.dish-description {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin: 0 0 20px 0;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8faff 0%, #eef3ff 100%);
  border-radius: 8px;
}

.dish-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
  padding: 10px 14px;
  background: #fafafa;
  border-radius: 8px;
}

.meta-item .el-icon {
  color: #165DFF;
}

.meta-label {
  color: #909399;
  min-width: 70px;
}

.meta-value {
  font-weight: 600;
  color: #303133;
}

.result-tabs {
  padding-left: 24px;
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ingredient-item {
  padding: 12px 16px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.ingredient-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ingredient-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.ingredient-prob {
  font-size: 13px;
  color: #67c23a;
  font-weight: 600;
}

.cooking-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.method-item {
  padding: 16px;
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-radius: 10px;
  border-left: 4px solid #e6a23c;
}

.method-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.method-name {
  font-size: 16px;
  font-weight: 600;
  color: #b88230;
}

.method-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.flavor-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
  border-radius: 8px;
}

.flavor-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.nutrition-info {
  padding: 8px 0;
}

.nutrition-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-radius: 12px;
  border: 1px solid #b3e19d;
}

.nutrition-content {
  flex: 1;
}

.nutrition-label {
  font-size: 13px;
  color: #67c23a;
  margin-bottom: 6px;
  font-weight: 500;
}

.nutrition-value {
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.cooking-tips {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cooking-tips .tip-item {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.cooking-tips .tip-bullet {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.cooking-tips .tip-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.7;
  margin: 0;
  flex: 1;
}

.similar-dishes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.similar-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border: 1px solid #d9b3ff;
  border-radius: 24px;
  font-size: 14px;
  color: #9b59b6;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.similar-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(155, 89, 182, 0.2);
}

.history-card {
  margin-bottom: 24px;
}

.history-card .card-header {
  justify-content: space-between;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  gap: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: #f8faff;
}

.history-item:last-child {
  border-bottom: none;
}

.history-thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #ebeef5;
}

.history-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.history-confidence {
  font-size: 12px;
  color: #909399;
}

.history-time {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.history-footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
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

  .dish-main-info {
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 24px;
    margin-bottom: 24px;
  }

  .result-tabs {
    padding-left: 0;
  }

  .region-tabs {
    flex-direction: column;
  }

  .region-tab {
    justify-content: center;
  }

  .region-selector-header {
    flex-wrap: wrap;
    gap: 8px;
  }

  .region-selector-header .el-tag {
    margin-left: 0;
  }
}
</style>
