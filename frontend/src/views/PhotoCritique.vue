<template>
  <div class="photo-critique" @paste="handlePaste">
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
        <el-step title="上传摄影作品" description="上传1-9张你想获得点评的摄影作品" />
        <el-step title="AI 专业分析" description="从构图、曝光、色彩等六大维度深度点评" />
        <el-step title="查看点评报告" description="获取综合评分、改进建议和学习路径" />
      </el-steps>
    </el-card>

    <el-card class="scenario-card" v-if="uploadedImages.length === 0">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <MagicStick />
          </el-icon>
          <span>适用场景</span>
          <el-tag size="small" type="success" class="header-tag">
            你的私人摄影导师
          </el-tag>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="6" v-for="scenario in scenarios" :key="scenario.title">
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

    <el-card class="tips-card" v-if="uploadedImages.length === 0">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <Light />
          </el-icon>
          <span>点评维度</span>
          <el-tag size="small" type="warning" class="header-tag">
            六大专业维度全面评估
          </el-tag>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="8" v-for="dim in critiqueDimensions" :key="dim.name">
          <div class="dimension-card">
            <div class="dimension-header" :style="{ borderColor: dim.color }">
              <el-icon :size="24" :color="dim.color">
                <component :is="dim.icon" />
              </el-icon>
              <span class="dimension-name">{{ dim.name }}</span>
            </div>
            <p class="dimension-desc">{{ dim.desc }}</p>
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
              <span>摄影作品</span>
              <template v-if="uploadedImages.length > 0">
                <el-tag size="small" type="success" class="header-tag">
                  已上传 {{ uploadedImages.length }} 张
                </el-tag>
              </template>
              <el-tag size="small" type="info" class="header-tag" v-else>
                等待上传
              </el-tag>
              <div class="header-actions" v-if="uploadedImages.length > 0">
                <el-button size="small" text type="danger" @click="clearAllImages">
                  <el-icon><Delete /></el-icon>
                  清空全部
                </el-button>
              </div>
            </div>
          </template>

          <div class="gallery-container" v-if="uploadedImages.length > 0">
            <div
              class="gallery-item"
              v-for="(img, index) in uploadedImages"
              :key="index"
            >
              <img :src="img.dataUrl" :alt="`作品 ${index + 1}`" />
              <div class="gallery-overlay">
                <el-button
                  size="small"
                  type="danger"
                  text
                  @click="removeImage(index)"
                >
                  <el-icon><Close /></el-icon>
                  删除
                </el-button>
              </div>
              <div class="gallery-index">{{ index + 1 }}</div>
            </div>
            <div
              class="gallery-item add-more"
              v-if="uploadedImages.length < 9"
              @click="triggerUpload"
            >
              <el-icon class="add-icon"><Plus /></el-icon>
              <span>继续添加</span>
              <span class="add-tip">最多9张</span>
            </div>
          </div>

          <div class="preview-container upload-placeholder" v-else @click="triggerUpload">
            <el-icon class="placeholder-icon"><UploadFilled /></el-icon>
            <div class="placeholder-text">点击上传摄影作品</div>
            <div class="placeholder-subtext">或使用 Ctrl+V 粘贴图片</div>
            <div class="placeholder-tip">支持 JPG、PNG、WEBP 格式 · 单张不超过 10MB · 最多上传 9 张</div>
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :multiple="true"
              :limit="9"
              accept="image/*"
              :on-change="handleFileChange"
              :on-exceed="handleExceed"
              class="hidden-uploader"
            />
          </div>

          <div class="paste-hint" v-if="uploadedImages.length === 0">
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
        <el-card class="settings-card" v-if="!critiquing && !critiqueResult">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Setting />
              </el-icon>
              <span>点评设置</span>
              <div class="header-actions" v-if="uploadedImages.length > 0">
                <el-button size="small" text @click="clearAllImages">
                  重置
                </el-button>
              </div>
            </div>
          </template>

          <div class="upload-section" v-if="uploadedImages.length === 0">
            <div class="section-title">
              <el-icon :size="16" color="#165DFF"><Upload /></el-icon>
              <span>上传摄影作品</span>
            </div>
            <el-upload
              drag
              :auto-upload="false"
              :multiple="true"
              :limit="9"
              accept="image/*"
              :on-change="handleFileChange"
              :on-exceed="handleExceed"
              class="image-uploader"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                将摄影作品拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 JPG、PNG、WEBP 格式，单张不超过 10MB，最多上传 9 张作品同时点评
                </div>
              </template>
            </el-upload>
          </div>

          <el-divider />

          <div class="style-section">
            <div class="section-title">
              <el-icon :size="16" color="#165DFF"><Aim /></el-icon>
              <span>选择摄影风格</span>
              <el-tag size="small" type="primary" effect="light" class="section-tag">
                不同风格采用不同评价标准
              </el-tag>
            </div>
            <div class="style-grid">
              <div
                class="style-option"
                v-for="style in photoStyles"
                :key="style.key"
                :class="{ active: selectedStyle === style.key }"
                :style="{ '--style-color': style.color }"
                @click="selectedStyle = style.key"
              >
                <div class="style-icon">
                  <el-icon :size="22" :color="selectedStyle === style.key ? '#fff' : style.color">
                    <component :is="getStyleIcon(style.icon)" />
                  </el-icon>
                </div>
                <div class="style-name">{{ style.name }}</div>
                <div class="style-desc">{{ style.description }}</div>
                <div class="style-check" v-if="selectedStyle === style.key">
                  <el-icon><CircleCheck /></el-icon>
                </div>
              </div>
            </div>
            <div class="style-hint">
              <el-alert
                :title="currentStyleHint"
                type="info"
                :closable="false"
                show-icon
                class="style-alert"
              />
            </div>
          </div>

          <el-divider v-if="uploadedImages.length > 0" />

          <div class="tips-section" v-if="uploadedImages.length === 0">
            <div class="section-title">
              <el-icon :size="16" color="#67c23a"><Medal /></el-icon>
              <span>点评小贴士</span>
            </div>
            <div class="tips-list">
              <div class="tip-item" v-for="(tip, idx) in critiqueTips" :key="idx">
                <span class="tip-num">{{ idx + 1 }}</span>
                <span class="tip-text">{{ tip }}</span>
              </div>
            </div>
          </div>

          <el-divider v-if="uploadedImages.length === 0" />

          <div class="capability-section">
            <div class="section-title">
              <el-icon :size="16" color="#e6a23c"><MagicStick /></el-icon>
              <span>AI 点评能力</span>
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
            <span>您的作品仅用于本次点评，不会存储或用于其他用途</span>
          </div>
        </el-card>

        <el-card class="action-card" v-if="uploadedImages.length > 0 && !critiquing && !critiqueResult">
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="startCritique">
              <el-icon><Search /></el-icon>
              开始专业点评
            </el-button>
          </div>
        </el-card>

        <el-card class="progress-card" v-if="critiquing">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF" class="is-loading">
                <Loading />
              </el-icon>
              <span>AI 正在点评中...</span>
            </div>
          </template>
          <div class="progress-content">
            <div class="progress-status">{{ progressStatus }}</div>
            <el-progress :percentage="progressPercent" :stroke-width="12" status="success" />
            <div class="progress-tip">
              <el-icon :size="14"><Warning /></el-icon>
              <span>AI 正在从多维度深度分析您的作品，请稍候片刻</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="result-card" v-if="critiqueResult">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Document />
          </el-icon>
          <span>点评报告</span>
          <el-tag
            size="small"
            type="primary"
            effect="plain"
            class="header-tag"
          >
            {{ critiqueResult.styleName }}
          </el-tag>
          <el-tag
            size="small"
            :type="getGradeType(critiqueResult.overallGrade)"
            class="header-tag"
            effect="dark"
          >
            综合评级：{{ critiqueResult.overallGrade }}
          </el-tag>
          <div class="header-actions">
            <el-button size="small" text @click="resetAll">
              <el-icon><Refresh /></el-icon>
              重新点评
            </el-button>
          </div>
        </div>
      </template>

      <el-alert
        :title="critiqueResult.styleNote"
        type="info"
        :closable="false"
        show-icon
        class="style-note-alert"
      />

      <div class="overall-section">
        <div class="overall-score-card">
          <div class="score-ring">
            <el-progress
              type="dashboard"
              :percentage="critiqueResult.overallScore"
              :stroke-width="14"
              :color="getScoreColor(critiqueResult.overallScore)"
              :width="180"
            />
          </div>
          <div class="overall-info">
            <div class="overall-grade">{{ critiqueResult.overallGrade }}</div>
            <div class="overall-score-label">综合得分</div>
            <div class="overall-comment">{{ critiqueResult.overallComment }}</div>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="dimensions-section">
        <div class="section-header">
          <el-icon :size="18" color="#165DFF"><DataAnalysis /></el-icon>
          <span class="section-title-text">六大维度评分</span>
        </div>
        <el-row :gutter="16">
          <el-col :span="8" v-for="dim in critiqueResult.dimensions" :key="dim.name">
            <div class="dimension-score-card">
              <div class="dim-header">
                <span class="dim-name">{{ dim.name }}</span>
                <span class="dim-score" :style="{ color: getScoreColor(dim.score) }">
                  {{ dim.score }}
                  <span class="dim-max">/ {{ dim.maxScore }}</span>
                </span>
              </div>
              <el-progress
                :percentage="dim.score"
                :stroke-width="8"
                :color="getScoreColor(dim.score)"
                :show-text="false"
              />
              <p class="dim-description">{{ dim.description }}</p>
              <div class="dim-highlights" v-if="dim.highlights.length > 0">
                <div class="dim-subtitle good">
                  <el-icon :size="14"><CircleCheck /></el-icon>
                  亮点
                </div>
                <ul>
                  <li v-for="(h, i) in dim.highlights" :key="'h-' + i">{{ h }}</li>
                </ul>
              </div>
              <div class="dim-improvements" v-if="dim.improvements.length > 0">
                <div class="dim-subtitle warn">
                  <el-icon :size="14"><Warning /></el-icon>
                  改进建议
                </div>
                <ul>
                  <li v-for="(imp, i) in dim.improvements" :key="'imp-' + i">{{ imp }}</li>
                </ul>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-divider />

      <el-row :gutter="24">
        <el-col :span="12">
          <div class="strengths-card">
            <div class="section-header">
              <el-icon :size="18" color="#67c23a"><CircleCheck /></el-icon>
              <span class="section-title-text good-text">作品亮点</span>
            </div>
            <ul class="insight-list">
              <li v-for="(s, i) in critiqueResult.strengths" :key="'s-' + i">
                <span class="insight-bullet good-bullet">{{ i + 1 }}</span>
                {{ s }}
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="weaknesses-card">
            <div class="section-header">
              <el-icon :size="18" color="#f56c6c"><Warning /></el-icon>
              <span class="section-title-text warn-text">待提升方向</span>
            </div>
            <ul class="insight-list">
              <li v-for="(w, i) in critiqueResult.weaknesses" :key="'w-' + i">
                <span class="insight-bullet warn-bullet">{{ i + 1 }}</span>
                {{ w }}
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <el-tabs v-model="activeTab" class="result-tabs">
        <el-tab-pane label="构图建议" name="composition">
          <div class="tab-content">
            <ul class="suggestion-list">
              <li v-for="(item, i) in critiqueResult.compositionInsights" :key="'c-' + i">
                <el-icon :size="16" color="#165DFF"><Aim /></el-icon>
                {{ item }}
              </li>
            </ul>
          </div>
        </el-tab-pane>

        <el-tab-pane label="技术建议" name="technical">
          <div class="tab-content">
            <ul class="suggestion-list">
              <li v-for="(item, i) in critiqueResult.technicalSuggestions" :key="'t-' + i">
                <el-icon :size="16" color="#e6a23c"><Setting /></el-icon>
                {{ item }}
              </li>
            </ul>
          </div>
        </el-tab-pane>

        <el-tab-pane label="创意建议" name="creative">
          <div class="tab-content">
            <ul class="suggestion-list">
              <li v-for="(item, i) in critiqueResult.creativeAdvice" :key="'cr-' + i">
                <el-icon :size="16" color="#9b59b6"><MagicStick /></el-icon>
                {{ item }}
              </li>
            </ul>
          </div>
        </el-tab-pane>

        <el-tab-pane label="后期技巧" name="postprocess">
          <div class="tab-content">
            <ul class="suggestion-list">
              <li v-for="(item, i) in critiqueResult.postProcessingTips" :key="'p-' + i">
                <el-icon :size="16" color="#67c23a"><Brush /></el-icon>
                {{ item }}
              </li>
            </ul>
          </div>
        </el-tab-pane>

        <el-tab-pane label="学习路径" name="learning">
          <div class="tab-content">
            <ul class="learning-list">
              <li v-for="(item, i) in critiqueResult.learningPath" :key="'l-' + i">
                <div class="learning-step">{{ i + 1 }}</div>
                <div class="learning-content">{{ item }}</div>
              </li>
            </ul>
          </div>
        </el-tab-pane>

        <el-tab-pane label="适用场景" name="scenarios">
          <div class="tab-content">
            <div class="scenario-tag-list">
              <div
                class="scenario-tag-item"
                v-for="(item, i) in critiqueResult.suitableScenarios"
                :key="'sc-' + i"
              >
                <el-icon :size="16" color="#165DFF"><Promotion /></el-icon>
                {{ item }}
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card class="history-card" v-if="critiqueHistory.length > 0 && !critiqueResult">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Clock />
          </el-icon>
          <span>点评历史</span>
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
          <div class="history-thumbs">
            <img
              v-for="(img, imgIdx) in item.images.slice(0, 3)"
              :key="imgIdx"
              :src="img.dataUrl"
              :alt="`历史作品 ${imgIdx + 1}`"
            />
            <div class="history-more" v-if="item.images.length > 3">
              +{{ item.images.length - 3 }}
            </div>
          </div>
          <div class="history-info">
            <div class="history-score">
              <span class="history-score-num">{{ item.result.overallScore }}</span>
              <span class="history-score-label">分</span>
              <el-tag size="small" :type="getGradeType(item.result.overallGrade)" effect="light">
                {{ item.result.overallGrade }}
              </el-tag>
            </div>
            <div class="history-meta">
              <span>{{ item.images.length }} 张作品</span>
            </div>
          </div>
          <div class="history-time">{{ formatTime(item.time) }}</div>
        </div>
      </div>
      <div class="history-footer" v-if="critiqueHistory.length > 6">
        <el-button text size="small" @click="showAllHistory = !showAllHistory">
          {{ showAllHistory ? '收起' : `查看全部 ${critiqueHistory.length} 条记录` }}
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
  Light,
  CircleCheck,
  Delete,
  Close,
  Plus,
  Aim,
  DataAnalysis,
  Brush,
  Trophy,
  Reading,
  Sunny,
  ChatDotRound,
  Camera,
  Mountain,
  User,
  Goods
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { photoCritiqueApi, photoStyles, type PhotoCritique, type DimensionScore } from '@/api/photoCritique'

interface UploadedImage {
  dataUrl: string
  fileSize: number
  width: number
  height: number
}

interface HistoryItem {
  images: UploadedImage[]
  result: PhotoCritique
  time: string
}

const STORAGE_KEY = 'photo_critique_history'

const uploadRef = ref()

const uploadedImages = ref<UploadedImage[]>([])
const critiquing = ref(false)
const progressPercent = ref(0)
const progressStatus = ref('准备中...')
const critiqueResult = ref<PhotoCritique | null>(null)
const activeTab = ref('composition')
const selectedStyle = ref<string>('standard')

const critiqueHistory = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const iconComponents: Record<string, any> = {
  Aim,
  Camera,
  Mountain,
  User,
  Sunny,
  Picture,
  Goods,
  MagicStick
}

const getStyleIcon = (iconName: string) => {
  return iconComponents[iconName] || Aim
}

const currentStyleHint = computed(() => {
  const style = photoStyles.find(s => s.key === selectedStyle.value)
  if (!style) return ''
  if (style.key === 'street') return '街头摄影：瞬间的捕捉比画质的完美更重要'
  if (style.key === 'landscape') return '风光摄影：构图精致、光影迷人、画质极致'
  if (style.key === 'portrait') return '人像摄影：传神的眼神和情绪是灵魂'
  if (style.key === 'bw') return '黑白摄影：影调层次和光影对比为核心'
  if (style.key === 'minimalist') return '极简主义：少即是多，每个元素都应有意义'
  if (style.key === 'commercial') return '商业摄影：产品展示效果和技术控制为第一优先级'
  if (style.key === 'artistic') return '艺术创意：观念表达高于技术正确，鼓励突破常规'
  return '通用标准：均衡评价技术与艺术，适合大多数场景'
})

const currentStep = computed(() => {
  if (critiqueResult.value) return 2
  if (critiquing.value) return 1
  if (uploadedImages.value.length > 0) return 1
  return 0
})

const displayHistory = computed(() => {
  const reversed = critiqueHistory.value.slice().reverse()
  if (showAllHistory.value) return reversed
  return reversed.slice(0, 6)
})

const scenarios = [
  { title: '摄影学习自评', icon: 'Reading', color: '#165DFF', desc: '快速发现作品短板，明确提升方向' },
  { title: '投稿质量评估', icon: 'Medal', color: '#e6a23c', desc: '比赛投稿前自检，提高获奖概率' },
  { title: '社交发布筛选', icon: 'Promotion', color: '#f56c6c', desc: '精选最佳作品，打造高质量内容' },
  { title: '竞赛备赛练习', icon: 'Trophy', color: '#9b59b6', desc: '模拟评委视角，针对性强化训练' },
]

const critiqueDimensions = [
  { name: '构图', icon: 'Aim', color: '#165DFF', desc: '画面布局、主体位置、视觉引导、空间层次' },
  { name: '曝光', icon: 'Sunny', color: '#e6a23c', desc: '明暗控制、高光暗部细节、动态范围利用' },
  { name: '色彩', icon: 'Brush', color: '#f56c6c', desc: '色彩搭配、白平衡、饱和度、色调情感' },
  { name: '主题表达', icon: 'Document', color: '#67c23a', desc: '主体清晰度、拍摄意图、叙事能力' },
  { name: '情感传递', icon: 'ChatDotRound', color: '#9b59b6', desc: '情绪感染力、氛围营造、观众共鸣' },
  { name: '技术执行', icon: 'Setting', color: '#909399', desc: '对焦精准度、快门控制、景深运用、画质' },
]

const critiqueTips = [
  '上传原片效果最佳，避免过度压缩的图片',
  '一次可上传多张同主题作品，获得更全面的点评',
  '建议同时上传同一场景的不同构图版本做对比',
  '可以尝试上传后期前后的对比图，评估后期效果',
]

const capabilities = [
  '构图专业分析',
  '曝光质量评估',
  '色彩搭配诊断',
  '主题表达评价',
  '情感传递分析',
  '技术执行评分',
  '后期处理建议',
  '个性化学习路径',
  '作品亮点总结',
  '改进方向指导',
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

const getScoreColor = (score: number) => {
  if (score >= 85) return '#67c23a'
  if (score >= 70) return '#165DFF'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

const getGradeType = (grade: string) => {
  if (grade.includes('S') || grade.includes('A+')) return 'success'
  if (grade.startsWith('A') || grade.startsWith('B')) return 'primary'
  if (grade.startsWith('C')) return 'warning'
  return 'danger'
}

const handleFileChange = async (file: UploadFile) => {
  if (!file.raw) return
  await loadImageFromFile(file.raw)
}

const handleExceed = () => {
  ElMessage.warning('最多上传 9 张作品，请先删除部分作品')
}

const loadImageFromFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('单张图片大小不能超过 10MB')
    return
  }
  if (uploadedImages.value.length >= 9) {
    ElMessage.warning('最多上传 9 张作品')
    return
  }

  try {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        uploadedImages.value.push({
          dataUrl,
          fileSize: file.size,
          width: img.width,
          height: img.height,
        })
        critiqueResult.value = null
        ElMessage.success(`已添加 ${uploadedImages.value.length} 张作品`)
      }
      img.src = dataUrl
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

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
  critiqueResult.value = null
}

const clearAllImages = () => {
  uploadedImages.value = []
  critiqueResult.value = null
}

const startCritique = async () => {
  if (uploadedImages.value.length === 0) {
    ElMessage.warning('请先上传至少一张摄影作品')
    return
  }

  critiquing.value = true
  progressPercent.value = 0
  progressStatus.value = '正在分析作品...'
  critiqueResult.value = null

  const progressSteps = [
    { percent: 15, status: '正在分析构图与画面布局...' },
    { percent: 30, status: '正在评估曝光与明暗控制...' },
    { percent: 45, status: '正在诊断色彩与色调搭配...' },
    { percent: 60, status: '正在解读主题表达与叙事...' },
    { percent: 75, status: '正在分析情感传递与氛围...' },
    { percent: 90, status: '正在生成综合点评报告...' },
  ]

  let stepIndex = 0
  const progressTimer = setInterval(() => {
    if (stepIndex < progressSteps.length) {
      progressPercent.value = progressSteps[stepIndex].percent
      progressStatus.value = progressSteps[stepIndex].status
      stepIndex++
    }
  }, 600)

  try {
    const imagesBase64 = uploadedImages.value.map(img => img.dataUrl)
    const { data } = await photoCritiqueApi.critiquePhotos(imagesBase64, selectedStyle.value)
    critiqueResult.value = data

    clearInterval(progressTimer)
    progressPercent.value = 100
    progressStatus.value = '点评完成！'

    saveHistory({
      images: [...uploadedImages.value],
      result: data,
      time: new Date().toISOString()
    })

    ElMessage.success({
      message: `🎉 点评完成！综合得分 ${data.overallScore} 分，评级「${data.overallGrade}」`,
      type: 'success',
      duration: 4000,
      showClose: true
    })
  } catch (e: any) {
    console.error('Critique Error:', e)
    ElMessage.error(e?.response?.data?.message || '点评失败，请重试')
  } finally {
    clearInterval(progressTimer)
    critiquing.value = false
  }
}

const resetAll = () => {
  uploadedImages.value = []
  critiqueResult.value = null
  progressPercent.value = 0
  progressStatus.value = ''
  activeTab.value = 'composition'
}

const loadHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      critiqueHistory.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
}

const saveHistory = (item: HistoryItem) => {
  critiqueHistory.value.push(item)
  if (critiqueHistory.value.length > 30) {
    critiqueHistory.value = critiqueHistory.value.slice(-30)
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(critiqueHistory.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

const clearHistory = () => {
  critiqueHistory.value = []
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear history:', e)
  }
  ElMessage.success('历史记录已清空')
}

const loadFromHistory = (item: HistoryItem) => {
  uploadedImages.value = [...item.images]
  critiqueResult.value = item.result
  ElMessage.info(`已加载历史点评记录：${item.result.overallScore} 分`)
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.photo-critique {
  max-width: 1400px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.scenario-card,
.tips-card {
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

.section-tag {
  margin-left: 8px;
}

.style-section {
  margin-bottom: 8px;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.style-option {
  position: relative;
  padding: 12px;
  border: 2px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;
}

.style-option:hover {
  border-color: var(--style-color, #165DFF);
  background: linear-gradient(135deg, #fff 0%, #f5f7fa 100%);
  transform: translateY(-2px);
}

.style-option.active {
  border-color: var(--style-color, #165DFF);
  background: linear-gradient(135deg, var(--style-color, #165DFF) 0%, var(--style-color, #165DFF)dd 100%);
  color: #fff;
}

.style-option.active .style-desc {
  color: rgba(255, 255, 255, 0.85);
}

.style-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--style-color, #165DFF);
  background-opacity: 0.1;
  background-color: var(--style-color, #165DFF)15;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.style-option.active .style-icon {
  background: rgba(255, 255, 255, 0.25);
}

.style-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.style-desc {
  font-size: 11px;
  color: #909399;
  line-height: 1.5;
}

.style-check {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #fff;
  font-size: 18px;
}

.style-hint {
  margin-top: 4px;
}

.style-alert {
  --el-alert-padding: 10px 12px;
  font-size: 12px;
}

.style-note-alert {
  margin-bottom: 20px;
  --el-alert-padding: 12px 16px;
}

.scenario-item {
  padding: 20px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border: 1px solid #b3e19d;
  text-align: center;
  transition: all 0.3s;
  margin-bottom: 12px;
}

.scenario-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(103, 194, 58, 0.12);
  border-color: #67c23a;
}

.scenario-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: #fff;
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

.dimension-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.dimension-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.dimension-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 2px solid;
}

.dimension-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.dimension-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.preview-card {
  margin-bottom: 24px;
  min-height: 400px;
}

.gallery-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 8px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #ebeef5;
  transition: all 0.3s;
  cursor: pointer;
}

.gallery-item:hover {
  border-color: #165DFF;
  box-shadow: 0 4px 16px rgba(22, 93, 255, 0.15);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-overlay :deep(.el-button) {
  color: #fff;
  font-size: 14px;
}

.gallery-index {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.gallery-item.add-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border: 2px dashed #a0cfff;
  color: #165DFF;
  gap: 6px;
}

.gallery-item.add-more:hover {
  background: linear-gradient(135deg, #d9ecff 0%, #c6e2ff 100%);
  border-color: #165DFF;
}

.add-icon {
  font-size: 36px;
}

.gallery-item.add-more span {
  font-size: 14px;
  font-weight: 500;
}

.add-tip {
  font-size: 12px !important;
  color: #909399;
  font-weight: normal !important;
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

.upload-placeholder {
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border: 2px dashed #a0cfff;
}

.upload-placeholder:hover {
  background: linear-gradient(135deg, #d9ecff 0%, #c6e2ff 100%);
  border-color: #165DFF;
}

.placeholder-icon {
  font-size: 56px;
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
  padding: 0 24px;
  text-align: center;
  line-height: 1.6;
}

.hidden-uploader {
  display: none;
}

.paste-hint {
  margin-top: 16px;
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

kbd {
  display: inline-block;
  padding: 2px 8px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-family: monospace;
  font-size: 12px;
  color: #606266;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.tip-num {
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
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
  color: #606266;
  line-height: 1.6;
  padding-top: 1px;
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
  border-radius: 16px;
  font-size: 12px;
  color: #b88230;
}

.privacy-note {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #909399;
}

.action-card {
  margin-top: 16px;
}

.action-buttons {
  display: flex;
  justify-content: center;
}

.action-buttons :deep(.el-button) {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

.progress-card {
  margin-top: 16px;
}

.progress-content {
  padding: 8px 0;
}

.progress-status {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 16px;
  text-align: center;
}

.progress-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12px;
  color: #909399;
  justify-content: center;
}

.result-card {
  margin-bottom: 24px;
}

.overall-section {
  padding: 8px 0;
}

.overall-score-card {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 24px 32px;
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f9eb 100%);
  border-radius: 16px;
}

.score-ring {
  flex-shrink: 0;
}

.overall-info {
  flex: 1;
}

.overall-grade {
  font-size: 32px;
  font-weight: bold;
  color: #165DFF;
  margin-bottom: 4px;
}

.overall-score-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
}

.overall-comment {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
}

.dimensions-section {
  padding: 8px 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.section-title-text {
  font-size: 17px;
  font-weight: 600;
  color: #303133;
}

.good-text {
  color: #529b2e;
}

.warn-text {
  color: #d64545;
}

.dimension-score-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.dimension-score-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.dim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.dim-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.dim-score {
  font-size: 20px;
  font-weight: bold;
}

.dim-max {
  font-size: 13px;
  font-weight: normal;
  color: #909399;
}

.dim-description {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 12px 0;
}

.dim-highlights,
.dim-improvements {
  margin-top: 12px;
}

.dim-subtitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.dim-subtitle.good {
  color: #529b2e;
}

.dim-subtitle.warn {
  color: #d64545;
}

.dim-highlights ul,
.dim-improvements ul {
  margin: 0;
  padding-left: 18px;
}

.dim-highlights li,
.dim-improvements li {
  font-size: 12px;
  color: #606266;
  line-height: 1.7;
}

.strengths-card,
.weaknesses-card {
  padding: 8px;
}

.insight-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.insight-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.insight-list li:last-child {
  border-bottom: none;
}

.insight-bullet {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  color: #fff;
}

.good-bullet {
  background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
}

.warn-bullet {
  background: linear-gradient(135deg, #f56c6c 0%, #d64545 100%);
}

.result-tabs {
  padding: 8px 0;
}

.tab-content {
  padding: 16px 8px;
}

.suggestion-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #303133;
  line-height: 1.7;
  transition: all 0.3s;
}

.suggestion-list li:hover {
  background: #f0f0f0;
}

.learning-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.learning-list li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}

.learning-list li:last-child {
  border-bottom: none;
}

.learning-step {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #165DFF 0%, #0d47a1 100%);
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.learning-content {
  flex: 1;
  font-size: 14px;
  color: #303133;
  line-height: 1.7;
  padding-top: 4px;
}

.scenario-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.scenario-tag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border: 1px solid #a0cfff;
  border-radius: 24px;
  font-size: 14px;
  color: #165DFF;
  transition: all 0.3s;
}

.scenario-tag-item:hover {
  background: linear-gradient(135deg, #d9ecff 0%, #c6e2ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.history-card {
  margin-bottom: 24px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.history-item:hover {
  background: #fafafa;
  border-color: #165DFF;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.08);
}

.history-thumbs {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.history-thumbs img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ebeef5;
}

.history-more {
  width: 56px;
  height: 56px;
  background: #f0f0f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #909399;
}

.history-info {
  flex: 1;
}

.history-score {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.history-score-num {
  font-size: 22px;
  font-weight: bold;
  color: #165DFF;
}

.history-score-label {
  font-size: 13px;
  color: #909399;
}

.history-meta {
  font-size: 12px;
  color: #909399;
}

.history-time {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.history-footer {
  margin-top: 16px;
  text-align: center;
}
</style>
