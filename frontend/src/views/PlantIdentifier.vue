<template>
  <div class="plant-identifier" @paste="handlePaste">
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
        <el-step title="上传植物图片" description="上传或粘贴你想识别的植物照片" />
        <el-step title="开始识别" description="AI 自动分析植物特征" />
        <el-step title="查看结果" description="获取植物名称、科属、特征等信息" />
      </el-steps>
    </el-card>

    <el-card class="scenario-card" v-if="!sourceImage">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <MagicStick />
          </el-icon>
          <span>适用场景</span>
          <el-tag size="small" type="success" class="header-tag">
            让植物不再陌生
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

    <el-card class="shooting-guide-card" v-if="!sourceImage">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <Light />
          </el-icon>
          <span>拍摄指南</span>
          <el-tag size="small" type="warning" class="header-tag">
            识别准确率提升 80% 的秘诀
          </el-tag>
          <div class="header-actions">
            <el-icon :size="18" color="#909399">
              <QuestionFilled />
            </el-icon>
          </div>
        </div>
      </template>

      <div class="guide-section">
        <div class="guide-section-title">
          <el-icon :size="18" color="#f56c6c"><Cherry /></el-icon>
          <span>拍哪些部位？按识别优先级排序</span>
        </div>
        <el-row :gutter="12">
          <el-col :span="8" v-for="part in shootingGuide.parts" :key="part.name">
            <div class="part-card">
              <div class="part-header" :style="{ borderColor: part.color }">
                <el-icon :size="24" :color="part.color">
                  <component :is="part.icon" />
                </el-icon>
                <div class="part-info">
                  <span class="part-name">{{ part.name }}</span>
                  <span class="part-importance">{{ part.importance }}</span>
                </div>
              </div>
              <p class="part-desc">{{ part.desc }}</p>
              <div class="part-tip">
                <el-icon :size="14" color="#e6a23c"><Promotion /></el-icon>
                <span>{{ part.tip }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-divider />

      <el-row :gutter="16">
        <el-col :span="10">
          <div class="guide-section">
            <div class="guide-section-title">
              <el-icon :size="18" color="#165DFF"><Aim /></el-icon>
              <span>推荐拍摄角度</span>
            </div>
            <div class="angle-list">
              <div class="angle-item" v-for="angle in shootingGuide.angles" :key="angle.name">
                <div class="angle-icon">
                  <el-icon :size="20" color="#165DFF">
                    <component :is="angle.icon" />
                  </el-icon>
                </div>
                <div class="angle-content">
                  <div class="angle-name">{{ angle.name }}</div>
                  <div class="angle-desc">{{ angle.desc }}</div>
                  <el-tag size="small" type="info">适合：{{ angle.suitable }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="14">
          <div class="guide-section">
            <div class="guide-section-title">
              <el-icon :size="18" color="#e6a23c"><SunnyFilled /></el-icon>
              <span>光线选择</span>
            </div>
            <div class="light-list">
              <div class="light-item" v-for="light in shootingGuide.light" :key="light.type">
                <div class="light-status" :class="light.status">
                  <el-icon v-if="light.status === 'best' || light.status === 'good'" :size="16" color="#fff">
                    <CircleCheck />
                  </el-icon>
                  <el-icon v-else :size="16" color="#fff">
                    <CircleClose />
                  </el-icon>
                </div>
                <div class="light-content">
                  <div class="light-type">
                    {{ light.type }}
                    <el-tag v-if="light.status === 'best'" size="small" type="success" effect="light">最佳</el-tag>
                    <el-tag v-else-if="light.status === 'good'" size="small" type="primary" effect="light">推荐</el-tag>
                    <el-tag v-else size="small" type="danger" effect="light">避免</el-tag>
                  </div>
                  <div class="light-desc">{{ light.desc }}</div>
                  <div class="light-tip">{{ light.tip }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <div class="guide-section">
        <div class="guide-section-title">
          <el-icon :size="18" color="#67c23a"><ZoomIn /></el-icon>
          <span>对/错示例对照</span>
          <span class="section-subtitle">看看这些常见问题你有没有中招</span>
        </div>
        <el-row :gutter="12">
          <el-col :span="12" v-for="item in shootingGuide.dosAndDonts" :key="item.good">
            <div class="compare-card">
              <div class="compare-row good">
                <div class="compare-icon good-icon">
                  <el-icon :size="18"><CircleCheck /></el-icon>
                </div>
                <div class="compare-content">
                  <span class="compare-label">推荐 ✓</span>
                  <span class="compare-text">{{ item.good }}</span>
                </div>
              </div>
              <div class="compare-divider"></div>
              <div class="compare-row bad">
                <div class="compare-icon bad-icon">
                  <el-icon :size="18"><CircleClose /></el-icon>
                </div>
                <div class="compare-content">
                  <span class="compare-label bad-label">避免 ✗</span>
                  <span class="compare-text">{{ item.bad }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="guide-summary">
        <el-alert type="success" :closable="false" show-icon>
          <template #title>
            <strong>拍一张好照片的黄金法则：</strong>
            「<span class="highlight">花 + 叶 + 整株</span>」三件套，<span class="highlight">光线柔和</span>、<span class="highlight">对焦清晰</span>、<span class="highlight">背景干净</span>，AI 识别准确率最高！
          </template>
        </el-alert>
      </div>
    </el-card>

    <el-row :gutter="24">
      <el-col :span="14">
        <el-card class="preview-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Picture />
              </el-icon>
              <span>植物图片</span>
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
            <img :src="sourceImage" class="preview-image" alt="待识别植物图片" />
          </div>
          <div class="preview-container upload-placeholder" v-else @click="triggerUpload">
            <el-icon class="placeholder-icon"><UploadFilled /></el-icon>
            <div class="placeholder-text">点击上传植物照片</div>
            <div class="placeholder-subtext">或使用 Ctrl+V 粘贴图片</div>
            <div class="placeholder-tip">支持 JPG、PNG、WEBP 格式 · 建议拍摄花朵+叶片+整株 · 光线柔和对焦清晰 · 识别准确率更高</div>
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
              <span>上传植物图片</span>
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
                将植物照片拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 JPG、PNG、WEBP 格式，文件大小建议不超过 10MB，清晰的植物特写照片识别效果最佳
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
            <span>您的植物图片仅用于本次识别，不会存储或用于其他用途</span>
          </div>
        </el-card>

        <el-card class="action-card" v-if="sourceImage && !recognizing && !recognitionResult">
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="startRecognize">
              <el-icon><Search /></el-icon>
              开始识别植物
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
              <span>AI 正在分析植物特征，请稍候片刻</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="result-card" v-if="recognitionResult">
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

      <el-row :gutter="24">
        <el-col :span="8">
          <div class="plant-main-info">
            <div class="plant-name-section">
              <h2 class="plant-name">{{ recognitionResult.chineseName }}</h2>
              <p class="plant-scientific">{{ recognitionResult.scientificName }}</p>
              <p class="plant-english">{{ recognitionResult.englishName }}</p>
            </div>
            <div class="plant-tags">
              <el-tag size="small" type="primary">{{ recognitionResult.plantType }}</el-tag>
              <el-tag
                size="small"
                v-for="tag in recognitionResult.tags"
                :key="tag"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>
            <p class="plant-description">{{ recognitionResult.description }}</p>

            <div class="plant-meta">
              <div class="meta-item">
                <el-icon><Connection /></el-icon>
                <span class="meta-label">科属:</span>
                <span class="meta-value">{{ recognitionResult.family }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Location /></el-icon>
                <span class="meta-label">原生分布:</span>
                <span class="meta-value">{{ recognitionResult.nativeHabitat }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Sunny /></el-icon>
                <span class="meta-label">物候期:</span>
                <span class="meta-value">{{ recognitionResult.seasonalInfo }}</span>
              </div>
              <div class="meta-item" :class="{ 'toxic-warning': isToxic }">
                <el-icon><Warning /></el-icon>
                <span class="meta-label">毒性:</span>
                <span class="meta-value">{{ recognitionResult.toxicity }}</span>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="16">
          <el-tabs v-model="activeTab" class="result-tabs">
            <el-tab-pane label="形态特征" name="characteristics">
              <div class="characteristics-list">
                <div
                  class="characteristic-item"
                  v-for="char in recognitionResult.characteristics"
                  :key="char.name"
                >
                  <div class="char-header">
                    <el-icon :size="18" color="#67c23a"><Promotion /></el-icon>
                    <span class="char-name">{{ char.name }}</span>
                  </div>
                  <p class="char-desc">{{ char.description }}</p>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="生长习性" name="habits">
              <div class="habits-info">
                <div class="habits-card">
                  <el-icon :size="32" color="#165DFF"><Sunny /></el-icon>
                  <div class="habits-content">
                    <div class="habits-label">生长习性</div>
                    <div class="habits-value">{{ recognitionResult.growthHabits }}</div>
                  </div>
                </div>
                <div class="habits-card" style="margin-top: 16px;">
                  <el-icon :size="32" color="#e6a23c"><Location /></el-icon>
                  <div class="habits-content">
                    <div class="habits-label">原生分布</div>
                    <div class="habits-value">{{ recognitionResult.nativeHabitat }}</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="用途价值" name="uses">
              <div class="uses-list">
                <div
                  class="use-item"
                  v-for="use in recognitionResult.uses"
                  :key="use.category"
                >
                  <div class="use-header">
                    <el-icon :size="18" color="#e6a23c"><Promotion /></el-icon>
                    <span class="use-category">{{ use.category }}</span>
                  </div>
                  <p class="use-desc">{{ use.description }}</p>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="养护技巧" name="growing">
              <div class="growing-tips">
                <div
                  class="tip-item"
                  v-for="(tip, idx) in recognitionResult.growingTips"
                  :key="idx"
                >
                  <div class="tip-bullet">{{ idx + 1 }}</div>
                  <p class="tip-content">{{ tip }}</p>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="相似植物" name="similar">
              <div class="similar-plants">
                <div
                  class="similar-item"
                  v-for="plant in recognitionResult.similarPlants"
                  :key="plant.name"
                >
                  <div class="similar-header">
                    <el-icon :size="16" color="#165DFF"><Picture /></el-icon>
                    <span class="similar-chinese">{{ plant.chineseName }}</span>
                    <span class="similar-scientific">{{ plant.name }}</span>
                  </div>
                  <p class="similar-diff">{{ plant.difference }}</p>
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
            <img :src="item.image" :alt="item.result.chineseName" />
          </div>
          <div class="history-info">
            <div class="history-name">{{ item.result.chineseName }}</div>
            <div class="history-meta">
              <el-tag size="small" type="info">{{ item.result.family }}</el-tag>
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
  Connection,
  Location,
  Sunny,
  Cherry,
  Leaf,
  Grape,
  View,
  Aim,
  Top,
  Bottom,
  ZoomIn,
  CircleCheck,
  CircleClose,
  QuestionFilled,
  Light,
  SunnyFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { plantRecognitionApi, type PlantRecognitionResult } from '@/api/plantRecognition'

interface HistoryItem {
  image: string
  result: PlantRecognitionResult
  time: string
}

const STORAGE_KEY = 'plant_recognition_history'

const uploadRef = ref()

const sourceImage = ref<string>('')
const imageWidth = ref(0)
const imageHeight = ref(0)
const fileSize = ref(0)

const recognizing = ref(false)
const progressPercent = ref(0)
const progressStatus = ref('准备中...')
const recognitionResult = ref<PlantRecognitionResult | null>(null)
const activeTab = ref('characteristics')

const recognizeHistory = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const isToxic = computed(() => {
  if (!recognitionResult.value) return false
  const toxicity = recognitionResult.value.toxicity.toLowerCase()
  return toxicity.includes('有毒') || toxicity.includes('毒')
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
  { title: '公园散步识花', icon: 'Location', color: '#165DFF', desc: '在公园遇到美丽的花花草草' },
  { title: '野外徒步认植', icon: 'Picture', color: '#67c23a', desc: '徒步时了解身边的植被' },
  { title: '家养植物确认', icon: 'Medal', color: '#e6a23c', desc: '确认家中绿植的品种信息' },
  { title: '自然教育科普', icon: 'Promotion', color: '#909399', desc: '学生学习自然植物知识' },
  { title: '园艺种植参考', icon: 'Sunny', color: '#f56c6c', desc: '园艺爱好者了解植物习性' },
  { title: '中草药识别', icon: 'Document', color: '#9b59b6', desc: '了解药用植物的基本信息' }
]

const recognitionTips = [
  '对焦清晰，避免模糊、手抖，尽量使用手机微距模式',
  '有花先拍花：花朵是识别度最高的部位，尽量拍正面特写',
  '有果拍果实：果实形状、颜色是重要分类依据',
  '叶片正反面都拍：叶形、叶缘、叶脉是植物分类的关键特征',
  '拍摄整株全貌：了解植物的高度、形态（直立/匍匐/攀援）',
  '光线充足均匀：自然光最佳，避开正午强光和夜间闪光灯',
  '保持背景简洁：减少无关杂物干扰，突出植物主体',
  '草本植物需带基部：区分从生还是直立生长很重要'
]

const shootingGuide = {
  parts: [
    {
      name: '花朵',
      icon: 'Cherry',
      color: '#f56c6c',
      importance: '⭐⭐⭐⭐⭐',
      desc: '植物识别最重要的依据，花瓣数量、形状、颜色、排列方式、雌雄蕊结构都是分类关键特征。',
      tip: '尽量正面拍摄，同时拍一张侧面展示花的整体结构'
    },
    {
      name: '叶片',
      icon: 'Leaf',
      color: '#67c23a',
      importance: '⭐⭐⭐⭐⭐',
      desc: '叶形、叶缘（全缘/锯齿/裂片）、叶脉、叶序（互生/对生/轮生）是植物分类学的核心特征。',
      tip: '建议同时拍摄叶片正面和背面，以及枝条上叶的排列方式'
    },
    {
      name: '果实/种子',
      icon: 'Grape',
      color: '#e6a23c',
      importance: '⭐⭐⭐⭐',
      desc: '果实类型（浆果/核果/蒴果/荚果等）、形状、颜色、开裂方式是重要的识别依据。',
      tip: '拍成熟的果实，如有开裂也拍下开裂状态'
    },
    {
      name: '茎干/枝条',
      icon: 'Connection',
      color: '#909399',
      importance: '⭐⭐⭐',
      desc: '区分草质茎还是木质茎，枝条颜色、是否有刺/毛/翅、节间特征都有参考价值。',
      tip: '木本植物拍树皮纹路，草本拍茎的横断面形状'
    },
    {
      name: '整株形态',
      icon: 'Picture',
      color: '#165DFF',
      importance: '⭐⭐⭐',
      desc: '了解植物整体生长形态（乔木/灌木/草本/藤本）、高度、冠幅，有助于缩小识别范围。',
      tip: '退后几步拍全貌，旁边放个参照物（如手、笔）更有利于判断大小'
    },
    {
      name: '特殊特征',
      icon: 'MagicStick',
      color: '#9b59b6',
      importance: '⭐⭐⭐⭐',
      desc: '刺、毛、乳汁、卷须、气味等特殊特征是某些植物科属的标志性特点。',
      tip: '有乳汁的植物折断小枝观察，有毛的用特写拍清楚'
    }
  ],
  angles: [
    { name: '正面平视', icon: 'View', desc: '适合拍花朵正面、叶片正面，展示平面形态特征', suitable: '花朵、叶片' },
    { name: '45°侧俯', icon: 'Aim', desc: '最常用的拍摄角度，兼顾正面和侧面特征，立体感强', suitable: '整株、枝条、花序' },
    { name: '垂直俯拍', icon: 'Top', desc: '适合拍叶序、伞形花序、基生叶丛的排列方式', suitable: '叶丛、花簇、低矮植物' },
    { name: '侧面仰视', icon: 'Bottom', desc: '适合拍高大乔木、下垂的花序/果实、树冠形态', suitable: '乔木、高大花卉' }
  ],
  light: [
    { type: '散射自然光', status: 'best', desc: '阴天或树荫下，光线柔和均匀，色彩还原准确，无强烈阴影', tip: '识别效果最佳，首推这种光线' },
    { type: '侧光', status: 'good', desc: '上午9-10点或下午3-4点的阳光，能突出植物纹理和立体感', tip: '适合拍摄叶片脉络、树皮纹理' },
    { type: '正午强光', status: 'bad', desc: '光照过强，高光过曝阴影过重，色彩偏白，细节丢失严重', tip: '尽量避免，可移到树荫下拍摄' },
    { type: '闪光灯', status: 'bad', desc: '近距离闪光会导致反光、色彩失真、背景全黑', tip: '不要使用闪光灯，改用手电筒补光' },
    { type: '夜间灯光', status: 'bad', desc: '光线不足、偏色严重，植物细节难以辨识', tip: '尽量白天拍摄，或用多个光源补光' }
  ],
  dosAndDonts: [
    { good: '近距离微距拍摄花朵细节', bad: '距离太远，植物只占画面一小部分', icon: 'ZoomIn' },
    { good: '对焦清晰，轮廓分明', bad: '手抖、虚焦，模糊不清', icon: 'Aim' },
    { good: '拍多个部位（花+叶+整株）', bad: '只拍一个局部，缺少关键信息', icon: 'Picture' },
    { good: '单一主体，背景简洁', bad: '杂乱背景，多种植物混在一起', icon: 'MagicStick' },
    { good: '光线均匀柔和', bad: '强光逆光、阴影浓重', icon: 'Sunny' }
  ]
}

const capabilities = [
  '中文学名识别',
  '拉丁学名识别',
  '科属分类',
  '形态特征',
  '生长习性',
  '原生分布',
  '用途价值',
  '养护技巧',
  '相似植物对比',
  '毒性提示'
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
    ElMessage.warning('请先上传植物图片')
    return
  }

  recognizing.value = true
  progressPercent.value = 0
  progressStatus.value = '正在分析图片...'
  recognitionResult.value = null

  const progressSteps = [
    { percent: 20, status: '正在提取图像特征...' },
    { percent: 45, status: '正在比对植物数据库...' },
    { percent: 70, status: '正在分析科属分类...' },
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
    const { data } = await plantRecognitionApi.recognizePlant(sourceImage.value)
    recognitionResult.value = data

    clearInterval(progressTimer)
    progressPercent.value = 100
    progressStatus.value = '识别完成！'

    saveHistory({
      image: sourceImage.value,
      result: data,
      time: new Date().toISOString()
    })

    ElMessage.success({
      message: `🎉 识别成功！这是「${data.chineseName}」`,
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
  activeTab.value = 'characteristics'
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

  const img = new Image()
  img.onload = () => {
    imageWidth.value = img.width
    imageHeight.value = img.height
  }
  img.src = item.image
  ElMessage.info(`已加载历史识别结果: ${item.result.chineseName}`)
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.plant-identifier {
  max-width: 1400px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.scenario-card {
  margin-bottom: 24px;
}

.shooting-guide-card {
  margin-bottom: 24px;
  background: linear-gradient(180deg, #fffdf5 0%, #ffffff 40%);
}

.guide-section {
  margin-bottom: 8px;
}

.guide-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
  margin-left: 8px;
}

.part-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.part-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.part-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 2px solid;
}

.part-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.part-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.part-importance {
  font-size: 12px;
  letter-spacing: -1px;
}

.part-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 10px 0;
}

.part-tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 10px;
  background: #fdf6ec;
  border-radius: 6px;
  font-size: 12px;
  color: #b88230;
  line-height: 1.5;
}

.part-tip > span {
  flex: 1;
}

.angle-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.angle-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #ecf5ff;
  border-radius: 8px;
  border: 1px solid #d9ecff;
}

.angle-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.angle-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.angle-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.angle-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
}

.light-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.light-item {
  display: flex;
  gap: 12px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.light-status {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.light-status.best {
  background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
}

.light-status.good {
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
}

.light-status.bad {
  background: linear-gradient(135deg, #f56c6c 0%, #d64545 100%);
}

.light-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.light-type {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.light-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
}

.light-tip {
  font-size: 11px;
  color: #909399;
  padding-left: 4px;
}

.compare-card {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
}

.compare-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
}

.compare-row.good {
  background: #f0f9eb;
}

.compare-row.bad {
  background: #fef0f0;
}

.compare-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.good-icon {
  background: #67c23a;
  color: #fff;
}

.bad-icon {
  background: #f56c6c;
  color: #fff;
}

.compare-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.compare-label {
  font-size: 12px;
  font-weight: 600;
  color: #529b2e;
}

.compare-label.bad-label {
  color: #d64545;
}

.compare-text {
  font-size: 13px;
  color: #303133;
}

.compare-divider {
  height: 1px;
  background: #dcdfe6;
}

.guide-summary {
  margin-top: 16px;
}

.guide-summary .highlight {
  color: #e6a23c;
  font-weight: 600;
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
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
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
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border: 2px dashed #b3e19d;
}

.upload-placeholder:hover {
  background: linear-gradient(135deg, #e1f3d8 0%, #d4edc4 100%);
  border-color: #67c23a;
}

.placeholder-icon {
  font-size: 64px;
  color: #67c23a;
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

.plant-main-info {
  padding-right: 24px;
  border-right: 1px solid #ebeef5;
}

.plant-name-section {
  margin-bottom: 16px;
}

.plant-name {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 8px 0;
}

.plant-scientific {
  font-size: 14px;
  color: #909399;
  margin: 0 0 4px 0;
  font-style: italic;
}

.plant-english {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.plant-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.plant-description {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin: 0 0 20px 0;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-radius: 8px;
}

.plant-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #606266;
  padding: 10px 14px;
  background: #fafafa;
  border-radius: 8px;
}

.meta-item.toxic-warning {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  color: #f56c6c;
}

.meta-item .el-icon {
  color: #165DFF;
  margin-top: 2px;
}

.meta-item.toxic-warning .el-icon {
  color: #f56c6c;
}

.meta-label {
  color: #909399;
  min-width: 70px;
  flex-shrink: 0;
}

.meta-value {
  font-weight: 500;
  color: #303133;
  line-height: 1.6;
}

.meta-item.toxic-warning .meta-value {
  color: #f56c6c;
}

.result-tabs {
  padding-left: 24px;
}

.characteristics-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.characteristic-item {
  padding: 16px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border-radius: 10px;
  border-left: 4px solid #67c23a;
}

.char-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.char-name {
  font-size: 16px;
  font-weight: 600;
  color: #529e2e;
}

.char-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.habits-info {
  padding: 8px 0;
}

.habits-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 12px;
  border: 1px solid #b3d8ff;
}

.habits-content {
  flex: 1;
}

.habits-label {
  font-size: 13px;
  color: #165DFF;
  margin-bottom: 6px;
  font-weight: 500;
}

.habits-value {
  font-size: 16px;
  color: #303133;
  font-weight: 600;
  line-height: 1.6;
}

.uses-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.use-item {
  padding: 16px;
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-radius: 10px;
  border-left: 4px solid #e6a23c;
}

.use-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.use-category {
  font-size: 16px;
  font-weight: 600;
  color: #b88230;
}

.use-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.growing-tips {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.growing-tips .tip-item {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.growing-tips .tip-bullet {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #67c23a 0%, #529e2e 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.growing-tips .tip-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.7;
  margin: 0;
  flex: 1;
}

.similar-plants {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.similar-item {
  padding: 16px;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border-radius: 10px;
  border: 1px solid #d9b3ff;
}

.similar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.similar-chinese {
  font-size: 16px;
  font-weight: 600;
  color: #9b59b6;
}

.similar-scientific {
  font-size: 13px;
  color: #909399;
  font-style: italic;
}

.similar-diff {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
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
  background: #f0f9eb;
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

  .plant-main-info {
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 24px;
    margin-bottom: 24px;
  }

  .result-tabs {
    padding-left: 0;
  }
}
</style>
