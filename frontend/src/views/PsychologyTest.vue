<template>
  <div class="psychology-test">
    <el-card class="hero-card">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <el-icon :size="28" color="#165DFF"><Avatar /></el-icon>
            了解自己，从这里开始
          </h1>
          <p class="hero-subtitle">
            选择适合您的心理测评，快速获得专业的自我评估结果
          </p>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-value">{{ psychologyScales.length }}</div>
            <div class="stat-label">专业量表</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">4</div>
            <div class="stat-label">测评类别</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">~5min</div>
            <div class="stat-label">平均时长</div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="recommend-card" v-if="!showGuide && !recommendedScale">
      <div class="recommend-header">
        <el-icon :size="24" color="#E6A23C"><MagicStick /></el-icon>
        <h3 class="recommend-title">不知道测什么？</h3>
        <span class="recommend-desc">回答2个简单问题，为您推荐最合适的测评</span>
      </div>
      <el-button type="primary" size="large" class="recommend-btn" @click="startGuide">
        <el-icon><MagicStick /></el-icon>
        开始智能匹配
      </el-button>
    </el-card>

    <el-card class="guide-card" v-if="showGuide">
      <div class="guide-header">
        <h3 class="guide-title">
          <el-icon :size="22" color="#165DFF"><Search /></el-icon>
          智能匹配
        </h3>
        <el-button text @click="closeGuide">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>

      <div class="guide-progress">
        <el-steps :active="guideStep" finish-status="success" simple>
          <el-step title="选择方向" />
          <el-step title="选择困扰" />
          <el-step title="获取推荐" />
        </el-steps>
      </div>

      <div class="guide-content">
        <div v-if="guideStep === 0" class="guide-question">
          <h4 class="question-text">您主要想了解哪方面的情况？</h4>
          <div class="option-grid">
            <el-card
              v-for="option in guideOptions.step1"
              :key="option.value"
              class="option-card"
              :class="{ selected: selectedStep1 === option.value }"
              shadow="hover"
              @click="selectStep1(option.value)"
            >
              <el-icon :size="32" :color="option.color"><component :is="option.icon" /></el-icon>
              <span class="option-label">{{ option.label }}</span>
              <span class="option-desc">{{ option.desc }}</span>
            </el-card>
          </div>
        </div>

        <div v-if="guideStep === 1" class="guide-question">
          <h4 class="question-text">您最近是否有以下困扰？</h4>
          <div class="option-grid">
            <el-card
              v-for="option in guideOptions.step2"
              :key="option.value"
              class="option-card"
              :class="{ selected: selectedStep2 === option.value }"
              shadow="hover"
              @click="selectStep2(option.value)"
            >
              <el-icon :size="28" :color="option.color"><component :is="option.icon" /></el-icon>
              <span class="option-label">{{ option.label }}</span>
            </el-card>
          </div>
        </div>

        <div v-if="guideStep === 2" class="guide-result">
          <div class="result-icon" :style="{ backgroundColor: recommendedScale!.color + '20', color: recommendedScale!.color }">
            <el-icon :size="48"><component :is="recommendedScale!.icon" /></el-icon>
          </div>
          <h4 class="result-title">为您推荐</h4>
          <h3 class="result-scale">{{ recommendedScale!.name }}</h3>
          <p class="result-desc">{{ recommendedScale!.description }}</p>
          <div class="result-tags">
            <el-tag size="small" type="info">{{ recommendedScale!.questionCount }}题</el-tag>
            <el-tag size="small" type="success">{{ recommendedScale!.testDuration }}</el-tag>
          </div>
          <el-alert type="info" :closable="false" class="match-reason">
            {{ matchReason }}
          </el-alert>
        </div>
      </div>

      <div class="guide-actions">
        <el-button v-if="guideStep > 0" @click="prevStep" :icon="ArrowLeft">上一步</el-button>
        <div v-if="guideStep < 2" class="action-right">
          <el-button text @click="closeGuide">跳过</el-button>
          <el-button
            type="primary"
            @click="nextStep"
            :disabled="(guideStep === 0 && !selectedStep1) || (guideStep === 1 && !selectedStep2)"
            :icon="ArrowRight"
          >
            下一步
          </el-button>
        </div>
        <div v-else class="action-right">
          <el-button @click="restartGuide" :icon="Refresh">重新匹配</el-button>
          <el-button
            type="primary"
            @click="startRecommendedTest"
            :icon="ArrowRight"
            :style="{ backgroundColor: recommendedScale!.color, borderColor: recommendedScale!.color }"
          >
            开始测评
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="quick-entry-card" v-if="!showGuide">
      <div class="card-header">
        <el-icon :size="20" color="#165DFF"><Lightning /></el-icon>
        <span>快速入口</span>
        <span class="header-hint">根据您的当下需求快速选择</span>
      </div>
      <div class="quick-tags">
        <el-tag
          v-for="tag in quickTags"
          :key="tag.id"
          size="large"
          effect="plain"
          class="quick-tag"
          @click="quickSelect(tag.scaleId)"
        >
          <el-icon><component :is="tag.icon" /></el-icon>
          {{ tag.label }}
        </el-tag>
      </div>
    </el-card>

    <el-card class="scales-card" v-if="!showGuide">
      <div class="card-header">
        <el-icon :size="20" color="#165DFF"><List /></el-icon>
        <span>全部量表</span>
        <el-tag size="small" type="info" class="header-tag">共 {{ psychologyScales.length }} 个</el-tag>
      </div>

      <el-tabs v-model="activeCategory" class="category-tabs">
        <el-tab-pane
          v-for="(info, key) in categoryInfo"
          :key="key"
          :label="info.name"
          :name="key"
        >
          <template #label>
            <el-icon><component :is="info.icon" /></el-icon>
            <span class="tab-label">{{ info.name }}</span>
            <el-tag size="small" type="info" class="tab-count">
              {{ getScalesByCategory(key as string).length }}
            </el-tag>
          </template>
        </el-tab-pane>
      </el-tabs>

      <div class="scales-grid">
        <el-card
          v-for="(scale, index) in getScalesByCategory(activeCategory)"
          :key="scale.id"
          class="scale-card"
          :class="{ 'recommended': isRecommended(scale.id) }"
          shadow="hover"
          @click="startTest(scale.id)"
        >
          <el-tag
            v-if="index === 0 && activeCategory === 'emotion'"
            class="recommend-tag"
            type="warning"
            effect="light"
          >
            <el-icon><Star /></el-icon>
            推荐首次
          </el-tag>
          <div class="scale-icon" :style="{ backgroundColor: scale.color + '20', color: scale.color }">
            <el-icon :size="32"><component :is="scale.icon" /></el-icon>
          </div>
          <h3 class="scale-name">{{ scale.name }}</h3>
          <p class="scale-desc">{{ scale.description }}</p>
          <div class="scale-scenarios">
            <el-tag
              v-for="scenario in getScenarios(scale.id)"
              :key="scenario"
              size="small"
              class="scenario-tag"
            >
              {{ scenario }}
            </el-tag>
          </div>
          <div class="scale-meta">
            <span class="meta-item">
              <el-icon><Document /></el-icon>
              {{ scale.questionCount }}题
            </span>
            <span class="meta-item">
              <el-icon><Timer /></el-icon>
              {{ scale.testDuration }}
            </span>
            <span class="meta-item">
              <el-icon><User /></el-icon>
              {{ scale.suitablePopulation }}
            </span>
          </div>
          <el-button type="primary" class="start-btn" :style="{ backgroundColor: scale.color, borderColor: scale.color }">
            开始测试
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-card>
      </div>
    </el-card>

    <el-alert type="warning" :closable="false" class="disclaimer">
      <template #title>
        <el-icon><WarningFilled /></el-icon>
        <span>重要提示</span>
      </template>
      本测评结果仅供参考，不能替代专业诊断。如有严重心理困扰，请及时寻求专业心理咨询师或精神科医生的帮助。
    </el-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  InfoFilled,
  List,
  Document,
  Timer,
  ArrowRight,
  ArrowLeft,
  Heart,
  Cpu,
  User,
  Warning,
  Avatar,
  MagicStick,
  Search,
  Close,
  Refresh,
  Lightning,
  Star,
  WarningFilled,
  Moon,
  Suitcase,
  Coffee,
  Trophy,
  ChatDotRound,
  View
} from '@element-plus/icons-vue'
import { psychologyScales, categoryInfo, type PsychologyScale } from '@/data/psychologyScales'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeCategory = ref<string>('emotion')
const showGuide = ref(false)
const guideStep = ref(0)
const selectedStep1 = ref<string | null>(null)
const selectedStep2 = ref<string | null>(null)
const recommendedScale = ref<PsychologyScale | null>(null)

const guideOptions = {
  step1: [
    { value: 'emotion', label: '情绪状态', desc: '了解最近的心情变化', icon: 'Heart', color: '#F56C6C' },
    { value: 'stress', label: '压力水平', desc: '评估当前的压力状况', icon: 'Warning', color: '#E6A23C' },
    { value: 'intelligence', label: '认知能力', desc: '测试逻辑思维能力', icon: 'Cpu', color: '#67C23A' },
    { value: 'curious', label: '都想试试', desc: '探索更多可能', icon: 'View', color: '#165DFF' }
  ],
  step2: [
    { value: 'low', label: '没有明显困扰，只是想了解', icon: 'Coffee', color: '#67C23A' },
    { value: 'mood', label: '最近情绪低落，开心不起来', icon: 'Moon', color: '#909399' },
    { value: 'anxious', label: '经常感到紧张、担心', icon: 'Lightning', color: '#E6A23C' },
    { value: 'pressure', label: '工作/学习压力大', icon: 'Suitcase', color: '#F56C6C' },
    { value: 'sleep', label: '睡眠不好，容易疲劳', icon: 'Moon', color: '#909399' },
    { value: 'improve', label: '想提升自己的能力', icon: 'Trophy', color: '#67C23A' }
  ]
}

const quickTags = [
  { id: 'sad', label: '最近心情不好', icon: 'Moon', scaleId: 'sds' },
  { id: 'anxious', label: '总是感到焦虑', icon: 'Lightning', scaleId: 'sas' },
  { id: 'pressure', label: '工作压力大', icon: 'Suitcase', scaleId: 'pss' },
  { id: 'iq', label: '想测测智商', icon: 'Cpu', scaleId: 'raven' },
  { id: 'sleep', label: '睡不好觉', icon: 'Moon', scaleId: 'sas' },
  { id: 'first', label: '第一次来，推荐', icon: 'Star', scaleId: 'sds' }
]

const scenariosMap: Record<string, string[]> = {
  sds: ['情绪低落', '兴趣减退', '睡眠困扰', '持续两周以上'],
  sas: ['紧张担心', '心跳加快', '难以放松', '莫名恐慌'],
  raven: ['逻辑推理', '智力评估', '思维训练', '能力提升'],
  pss: ['工作压力', '生活变故', '情绪烦躁', '身心疲惫']
}

const matchReason = computed(() => {
  const step1Label = guideOptions.step1.find(o => o.value === selectedStep1.value)?.label || ''
  const step2Label = guideOptions.step2.find(o => o.value === selectedStep2.value)?.label || ''
  return `根据您选择的"${step1Label}"和"${step2Label}"，我们推荐您先进行${recommendedScale.value?.name}，它能帮助您更好地了解当前的心理状态。`
})

const getScalesByCategory = (category: string): PsychologyScale[] => {
  return psychologyScales.filter(scale => scale.category === category)
}

const getScenarios = (scaleId: string): string[] => {
  return scenariosMap[scaleId] || []
}

const isRecommended = (scaleId: string): boolean => {
  return recommendedScale.value?.id === scaleId
}

const startGuide = () => {
  showGuide.value = true
  guideStep.value = 0
  selectedStep1.value = null
  selectedStep2.value = null
  recommendedScale.value = null
}

const closeGuide = () => {
  showGuide.value = false
}

const selectStep1 = (value: string) => {
  selectedStep1.value = value
}

const selectStep2 = (value: string) => {
  selectedStep2.value = value
}

const prevStep = () => {
  if (guideStep.value > 0) {
    guideStep.value--
  }
}

const nextStep = () => {
  if (guideStep.value === 0 && selectedStep1.value) {
    guideStep.value = 1
  } else if (guideStep.value === 1 && selectedStep2.value) {
    calculateRecommendation()
    guideStep.value = 2
  }
}

const calculateRecommendation = () => {
  let scaleId = 'sds'

  if (selectedStep1.value === 'stress') {
    scaleId = 'pss'
  } else if (selectedStep1.value === 'intelligence') {
    scaleId = 'raven'
  } else if (selectedStep1.value === 'emotion') {
    if (selectedStep2.value === 'anxious' || selectedStep2.value === 'sleep') {
      scaleId = 'sas'
    } else if (selectedStep2.value === 'mood') {
      scaleId = 'sds'
    }
  } else if (selectedStep1.value === 'curious') {
    if (selectedStep2.value === 'improve') {
      scaleId = 'raven'
    } else if (selectedStep2.value === 'pressure') {
      scaleId = 'pss'
    } else if (selectedStep2.value === 'anxious') {
      scaleId = 'sas'
    }
  }

  if (selectedStep2.value === 'mood') {
    scaleId = 'sds'
  } else if (selectedStep2.value === 'anxious') {
    scaleId = 'sas'
  } else if (selectedStep2.value === 'pressure') {
    scaleId = 'pss'
  } else if (selectedStep2.value === 'improve') {
    scaleId = 'raven'
  }

  recommendedScale.value = psychologyScales.find(s => s.id === scaleId) || psychologyScales[0]
}

const restartGuide = () => {
  guideStep.value = 0
  selectedStep1.value = null
  selectedStep2.value = null
  recommendedScale.value = null
}

const startRecommendedTest = () => {
  if (recommendedScale.value) {
    startTest(recommendedScale.value.id)
  }
}

const quickSelect = (scaleId: string) => {
  const scale = psychologyScales.find(s => s.id === scaleId)
  if (scale) {
    ElMessage.success(`已为您选择「${scale.name}」`)
    setTimeout(() => startTest(scaleId), 300)
  }
}

const startTest = (scaleId: string) => {
  router.push(`/psychology-test/${scaleId}`)
}
</script>

<style scoped>
.psychology-test {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.hero-card :deep(.el-card__body) {
  padding: 32px;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

.hero-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #fff;
}

.hero-subtitle {
  font-size: 15px;
  margin: 0;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  opacity: 0.8;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

.recommend-card {
  margin-bottom: 24px;
  border: 2px dashed #E6A23C;
  background: linear-gradient(135deg, #fef9f0 0%, #fff7e6 100%);
}

.recommend-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
}

.recommend-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.recommend-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.recommend-desc {
  font-size: 14px;
  color: #909399;
  margin-left: 8px;
}

.recommend-btn {
  border-radius: 24px;
  padding: 0 28px;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.guide-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.guide-progress {
  margin-bottom: 32px;
}

.guide-question {
  text-align: center;
}

.question-text {
  font-size: 18px;
  color: #303133;
  margin: 0 0 24px 0;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.option-card {
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  border: 2px solid transparent;
}

.option-card :deep(.el-card__body) {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.option-card:hover {
  border-color: #165DFF;
  transform: translateY(-2px);
}

.option-card.selected {
  border-color: #165DFF;
  background: #ecf5ff;
}

.option-label {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.option-desc {
  font-size: 12px;
  color: #909399;
}

.guide-result {
  text-align: center;
  padding: 20px 0;
}

.result-icon {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.result-title {
  font-size: 14px;
  color: #909399;
  margin: 0 0 8px 0;
}

.result-scale {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 12px 0;
}

.result-desc {
  font-size: 14px;
  color: #606266;
  margin: 0 0 16px 0;
}

.result-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.match-reason {
  max-width: 500px;
  margin: 0 auto;
  text-align: left;
}

.guide-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.action-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.quick-entry-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.header-hint {
  font-size: 13px;
  color: #909399;
  font-weight: normal;
  margin-left: 8px;
}

.header-tag {
  margin-left: 12px;
  font-weight: normal;
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quick-tag {
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 20px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.quick-tag:hover {
  background: #165DFF;
  color: #fff;
  border-color: #165DFF;
  transform: translateY(-2px);
}

.scales-card {
  margin-bottom: 24px;
}

.category-tabs {
  margin-bottom: 24px;
}

.category-tabs :deep(.el-tabs__item) {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 48px;
}

.tab-label {
  margin-left: 4px;
}

.tab-count {
  margin-left: 6px;
}

.scales-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.scale-card {
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  position: relative;
  overflow: visible;
}

.scale-card.recommended {
  border: 2px solid #E6A23C;
  box-shadow: 0 4px 20px rgba(230, 162, 60, 0.2);
}

.scale-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.scale-card :deep(.el-card__body) {
  padding: 24px 20px;
}

.recommend-tag {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
}

.scale-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  transition: all 0.3s;
}

.scale-card:hover .scale-icon {
  transform: scale(1.1);
}

.scale-name {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 8px 0;
}

.scale-desc {
  font-size: 13px;
  color: #606266;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.scale-scenarios {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}

.scenario-tag {
  background: #f5f7fa;
  border-color: #e4e7ed;
  color: #606266;
  font-weight: normal;
}

.scale-meta {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 12px;
  color: #909399;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.start-btn {
  width: 100%;
  height: 40px;
  border-radius: 8px;
}

.disclaimer {
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .hero-stats {
    width: 100%;
    justify-content: space-around;
  }

  .recommend-card :deep(.el-card__body) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .recommend-header {
    flex-direction: column;
    gap: 8px;
  }

  .recommend-btn {
    width: 100%;
  }

  .scales-grid {
    grid-template-columns: 1fr;
  }

  .quick-tags {
    justify-content: center;
  }

  .guide-actions {
    flex-direction: column;
    gap: 12px;
  }

  .guide-actions .el-button {
    width: 100%;
  }

  .action-right {
    width: 100%;
    flex-direction: column;
  }

  .option-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
