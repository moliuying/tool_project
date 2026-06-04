<template>
  <div class="psychology-test-result" v-if="scale && result">
    <el-card class="result-card">
      <div class="result-header">
        <div class="scale-icon" :style="{ backgroundColor: scale.color + '20', color: scale.color }">
          <el-icon :size="40"><component :is="scale.icon" /></el-icon>
        </div>
        <div class="result-title">
          <h2 class="scale-name">{{ scale.name }}</h2>
          <p class="result-tagline">测评完成，以下是您的评估结果</p>
        </div>
      </div>

      <el-divider />

      <div v-if="scaleId === 'emotion-screening'" class="screening-result-section">
        <div class="dimension-compare">
          <div class="dimension-card depression">
            <div class="dimension-icon">
              <el-icon :size="28"><Moon /></el-icon>
            </div>
            <div class="dimension-info">
              <h4 class="dimension-name">抑郁倾向</h4>
              <div class="dimension-score">
                <span class="score-num">{{ emotionScreeningResult?.depressionScore }}</span>
                <span class="score-max">/ 9</span>
              </div>
            </div>
            <el-progress
              type="dashboard"
              :percentage="Math.round(((emotionScreeningResult?.depressionScore || 0) / 9) * 100)"
              :color="getDimensionColor(emotionScreeningResult?.depressionScore || 0)"
              :stroke-width="10"
              :width="80"
              :show-text="false"
            />
          </div>
          <div class="vs-divider">
            <span>VS</span>
          </div>
          <div class="dimension-card anxiety">
            <div class="dimension-icon">
              <el-icon :size="28"><Lightning /></el-icon>
            </div>
            <div class="dimension-info">
              <h4 class="dimension-name">焦虑倾向</h4>
              <div class="dimension-score">
                <span class="score-num">{{ emotionScreeningResult?.anxietyScore }}</span>
                <span class="score-max">/ 9</span>
              </div>
            </div>
            <el-progress
              type="dashboard"
              :percentage="Math.round(((emotionScreeningResult?.anxietyScore || 0) / 9) * 100)"
              :color="getDimensionColor(emotionScreeningResult?.anxietyScore || 0)"
              :stroke-width="10"
              :width="80"
              :show-text="false"
            />
          </div>
        </div>

        <div class="tendency-badge" :class="emotionScreeningResult?.primaryTendency">
          <el-icon :size="20"><TrendCharts /></el-icon>
          <span>{{ getTendencyLabel(emotionScreeningResult?.primaryTendency) }}</span>
        </div>
      </div>

      <div v-else class="score-section">
        <div class="score-display">
          <div class="score-circle" :style="{ borderColor: getLevelColor(result.level) }">
            <div class="score-value" :style="{ color: getLevelColor(result.level) }">
              {{ standardScore }}
            </div>
            <div class="score-label">标准分</div>
          </div>
          <div class="score-details">
            <div class="level-badge" :style="{ backgroundColor: getLevelColor(result.level) }">
              {{ result.level }}
            </div>
            <div class="raw-score">
              <span>原始分：</span>
              <strong>{{ rawScore }}</strong>
            </div>
            <div class="full-mark">
              <span>满分：</span>
              <strong>{{ maxScore }}</strong>
            </div>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-labels">
            <span class="progress-label-start">低</span>
            <span class="progress-label-end">高</span>
          </div>
          <el-progress
            :percentage="scorePercentage"
            :color="getProgressColors()"
            :stroke-width="24"
            class="score-progress"
          />
          <div class="progress-markers">
            <span
              v-for="(interpretation, index) in scale.resultInterpretations"
              :key="index"
              class="marker"
              :style="{ left: getMarkerPosition(interpretation) }"
            >
              {{ interpretation.level }}
            </span>
          </div>
        </div>
      </div>

      <el-alert type="warning" :closable="false" class="disclaimer">
        <template #title>
          <el-icon><Warning /></el-icon>
          <span>结果仅供参考</span>
        </template>
        本测评结果仅作为初步自我评估参考，不能替代专业诊断。如需准确评估，请咨询专业心理咨询师或精神科医生。
      </el-alert>

      <div class="interpretation-section">
        <h3 class="section-title">
          <el-icon :size="20" :color="scale.color"><Reading /></el-icon>
          结果解读
        </h3>
        <p class="interpretation-text">{{ result.description }}</p>
      </div>

      <div class="suggestion-section">
        <h3 class="section-title">
          <el-icon :size="20" :color="scale.color"><ChatDotRound /></el-icon>
          建议
        </h3>
        <div class="suggestion-content">
          <el-icon size="24" color="#165DFF"><InfoFilled /></el-icon>
          <p class="suggestion-text">{{ result.suggestion }}</p>
        </div>
      </div>

      <div v-if="scaleId === 'emotion-screening' && recommendedScaleInfo" class="recommend-scale-section">
        <el-alert type="info" :closable="false" class="recommend-alert">
          <template #title>
            <el-icon><MagicStick /></el-icon>
            <span>为您推荐详细测评</span>
          </template>
          {{ emotionScreeningResult?.description }}
        </el-alert>

        <el-card class="recommend-scale-card" shadow="hover" @click="goToTest(emotionScreeningResult?.recommendedScale)">
          <div class="recommend-scale-icon" :style="{ backgroundColor: recommendedScaleInfo.color + '20', color: recommendedScaleInfo.color }">
            <el-icon :size="36"><component :is="recommendedScaleInfo.icon" /></el-icon>
          </div>
          <div class="recommend-scale-info">
            <h4 class="recommend-scale-name">{{ recommendedScaleInfo.name }}</h4>
            <p class="recommend-scale-desc">{{ recommendedScaleInfo.description }}</p>
            <div class="recommend-scale-meta">
              <span class="meta-item">
                <el-icon><Document /></el-icon>
                {{ recommendedScaleInfo.questionCount }}题
              </span>
              <span class="meta-item">
                <el-icon><Timer /></el-icon>
                {{ recommendedScaleInfo.testDuration }}
              </span>
            </div>
          </div>
          <el-button type="primary" size="large" :style="{ backgroundColor: recommendedScaleInfo.color, borderColor: recommendedScaleInfo.color }">
            开始测评
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-card>
      </div>

      <div class="scoring-info-section" v-if="showScoringInfo">
        <h3 class="section-title" @click="showScoringInfo = !showScoringInfo" style="cursor: pointer;">
          <el-icon :size="20" :color="scale.color"><DataLine /></el-icon>
          评分标准
          <el-icon class="toggle-icon" :class="{ expanded: showScoringInfo }"><CaretBottom /></el-icon>
        </h3>
        <div class="scoring-content" v-show="showScoringInfo">
          <p class="scoring-text">{{ scale.scoringInstructions }}</p>
          <el-table :data="scale.resultInterpretations" border size="small" class="scoring-table">
            <el-table-column prop="minScore" label="最低分" width="100" align="center" />
            <el-table-column prop="maxScore" label="最高分" width="100" align="center" />
            <el-table-column prop="level" label="等级" width="150" align="center">
              <template #default="{ row }">
                <el-tag :color="getLevelColor(row.level)" effect="light">{{ row.level }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="说明" />
          </el-table>
        </div>
      </div>

      <div class="answers-review-section" v-if="showAnswers">
        <h3 class="section-title" @click="showAnswers = !showAnswers" style="cursor: pointer;">
          <el-icon :size="20" :color="scale.color"><Document /></el-icon>
          查看答题详情
          <el-icon class="toggle-icon" :class="{ expanded: showAnswers }"><CaretBottom /></el-icon>
        </h3>
        <div class="answers-content" v-show="showAnswers">
          <el-table :data="answersList" border size="small" class="answers-table">
            <el-table-column prop="questionNumber" label="题号" width="80" align="center" />
            <el-table-column prop="questionText" label="题目" min-width="300" />
            <el-table-column prop="answer" label="您的选择" width="180" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.answerText" size="small">{{ row.answerText }}</el-tag>
                <span v-else style="color: #F56C6C;">未作答</span>
              </template>
            </el-table-column>
            <el-table-column prop="score" label="得分" width="80" align="center" />
          </el-table>
        </div>
      </div>

      <div class="result-actions">
        <el-button @click="goBack" :icon="ArrowLeft">返回列表</el-button>
        <div class="action-right">
          <el-button @click="retakeTest" :icon="Refresh">重新测试</el-button>
          <el-button type="primary" @click="shareResult" :icon="Share" :style="{ backgroundColor: scale.color, borderColor: scale.color }">
            分享结果
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="related-tests">
      <h3 class="section-title">
        <el-icon :size="20" color="#165DFF"><Connection /></el-icon>
        推荐测评
      </h3>
      <div class="related-grid">
        <el-card
          v-for="relatedScale in relatedScales"
          :key="relatedScale.id"
          class="related-card"
          shadow="hover"
          @click="goToTest(relatedScale.id)"
        >
          <div class="related-icon" :style="{ backgroundColor: relatedScale.color + '20', color: relatedScale.color }">
            <el-icon :size="24"><component :is="relatedScale.icon" /></el-icon>
          </div>
          <div class="related-info">
            <h4 class="related-name">{{ relatedScale.name }}</h4>
            <p class="related-desc">{{ relatedScale.description }}</p>
          </div>
          <el-icon class="related-arrow"><ArrowRight /></el-icon>
        </el-card>
      </div>
    </el-card>
  </div>

  <el-empty v-else description="未找到测评结果">
    <el-button type="primary" @click="goBack">返回列表</el-button>
  </el-empty>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Warning,
  Reading,
  ChatDotRound,
  InfoFilled,
  DataLine,
  Document,
  ArrowLeft,
  Refresh,
  Share,
  ArrowRight,
  Connection,
  CaretBottom,
  Moon,
  Lightning,
  TrendCharts,
  MagicStick,
  Timer
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  psychologyScales,
  calculateStandardScore,
  getResultInterpretation,
  calculateEmotionScreeningResult,
  type PsychologyScale,
  type ResultInterpretation,
  type EmotionScreeningResult
} from '@/data/psychologyScales'

const route = useRoute()
const router = useRouter()

const scale = ref<PsychologyScale | null>(null)
const rawScore = ref(0)
const result = ref<ResultInterpretation | null>(null)
const showScoringInfo = ref(false)
const showAnswers = ref(false)
const userAnswers = ref<Record<string, number>>({})
const emotionScreeningResult = ref<EmotionScreeningResult | null>(null)

const scaleId = computed(() => route.params.id as string)

const standardScore = computed(() => {
  return calculateStandardScore(rawScore.value, scaleId.value)
})

const maxScore = computed(() => {
  if (!scale.value) return 0
  const maxPerQuestion = Math.max(...scale.value.questions.map(q => Math.max(...q.options.map(o => o.score))))
  return scale.value.questions.length * maxPerQuestion
})

const scorePercentage = computed(() => {
  if (!scale.value) return 0
  if (scaleId.value === 'raven') {
    return Math.round((rawScore.value / 15) * 100)
  }
  if (scaleId.value === 'emotion-screening') {
    return Math.round((rawScore.value / 18) * 100)
  }
  return Math.min(100, Math.round((standardScore.value / 100) * 100))
})

const recommendedScaleInfo = computed(() => {
  if (!emotionScreeningResult.value) return null
  return psychologyScales.find(s => s.id === emotionScreeningResult.value?.recommendedScale)
})

const answersList = computed(() => {
  if (!scale.value) return []
  return scale.value.questions.map((q, index) => {
    const answerScore = userAnswers.value[q.id] || 0
    const answerOption = q.options.find(o => o.score === answerScore)
    return {
      questionNumber: index + 1,
      questionText: q.text,
      answer: answerScore,
      answerText: answerOption?.text || '',
      score: q.reverse ? (q.options.length + 1 - answerScore) : answerScore
    }
  })
})

const relatedScales = computed(() => {
  if (!scale.value) return []
  return psychologyScales
    .filter(s => s.id !== scale.value?.id && s.category === scale.value?.category)
    .slice(0, 3)
})

onMounted(() => {
  const foundScale = psychologyScales.find(s => s.id === scaleId.value)
  if (!foundScale) {
    return
  }

  scale.value = foundScale

  const scoreParam = route.query.score as string
  const answersParam = route.query.answers as string

  if (scoreParam) {
    rawScore.value = parseInt(scoreParam, 10)
    result.value = getResultInterpretation(foundScale, rawScore.value)
  }

  if (answersParam) {
    try {
      userAnswers.value = JSON.parse(answersParam)
      
      if (scaleId.value === 'emotion-screening') {
        const answersMap = new Map<number, number>()
        Object.entries(userAnswers.value).forEach(([key, value]) => {
          answersMap.set(parseInt(key, 10), value)
        })
        emotionScreeningResult.value = calculateEmotionScreeningResult(answersMap)
      }
    } catch (e) {
      console.error('Failed to parse answers:', e)
    }
  }
})

const getLevelColor = (level: string): string => {
  const colorMap: Record<string, string> = {
    '正常范围': '#67C23A',
    '压力较低': '#67C23A',
    '逻辑思维能力待提高': '#E6A23C',
    '轻度抑郁': '#E6A23C',
    '轻度焦虑': '#E6A23C',
    '中度压力': '#E6A23C',
    '中等水平': '#409EFF',
    '良好水平': '#409EFF',
    '中度抑郁': '#F56C6C',
    '中度焦虑': '#F56C6C',
    '压力较高': '#F56C6C',
    '重度抑郁': '#F56C6C',
    '重度焦虑': '#F56C6C',
    '优秀水平': '#67C23A'
  }
  return colorMap[level] || '#409EFF'
}

const getProgressColors = () => {
  return [
    { color: '#67C23A', percentage: 35 },
    { color: '#E6A23C', percentage: 60 },
    { color: '#F56C6C', percentage: 100 }
  ]
}

const getMarkerPosition = (interpretation: ResultInterpretation): string => {
  if (!scale.value) return '0%'
  const totalRange = interpretation.maxScore - interpretation.minScore
  const midPoint = interpretation.minScore + totalRange / 2
  const maxPossible = scaleId.value === 'raven' ? 15 : 100
  return `${Math.round((midPoint / maxPossible) * 100)}%`
}

const getDimensionColor = (score: number): string => {
  if (score <= 2) return '#67C23A'
  if (score <= 5) return '#E6A23C'
  return '#F56C6C'
}

const getTendencyLabel = (tendency: string): string => {
  const labelMap: Record<string, string> = {
    'depression': '抑郁倾向更明显',
    'anxiety': '焦虑倾向更明显',
    'both': '抑郁和焦虑双倾向',
    'none': '无明显情绪困扰'
  }
  return labelMap[tendency] || ''
}

const goBack = () => {
  router.push('/psychology-test')
}

const retakeTest = () => {
  router.push(`/psychology-test/${scaleId.value}`)
}

const goToTest = (testId: string) => {
  router.push(`/psychology-test/${testId}`)
}

const shareResult = () => {
  if (!scale.value || !result.value) return

  const shareText = `我在【${scale.value.name}】中的测评结果：${result.value.level}（标准分：${standardScore.value}）。${result.value.description}`

  if (navigator.share) {
    navigator.share({
      title: `${scale.value.name} 测评结果`,
      text: shareText
    }).catch(err => {
      console.log('分享取消:', err)
    })
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      ElMessage.success('结果已复制到剪贴板，快去分享给朋友吧！')
    }).catch(() => {
      ElMessage.info('请手动复制以下结果：\n' + shareText)
    })
  }
}
</script>

<style scoped>
.psychology-test-result {
  max-width: 900px;
  margin: 0 auto;
}

.result-card {
  margin-bottom: 24px;
}

.result-header {
  display: flex;
  gap: 20px;
  align-items: center;
}

.scale-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.result-title {
  flex: 1;
}

.scale-name {
  font-size: 22px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 4px 0;
}

.result-tagline {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.screening-result-section {
  margin: 30px 0;
}

.dimension-compare {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
}

.dimension-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.dimension-card.depression {
  border: 2px solid #409EFF;
}

.dimension-card.anxiety {
  border: 2px solid #E6A23C;
}

.dimension-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dimension-card.depression .dimension-icon {
  background: #ecf5ff;
  color: #409EFF;
}

.dimension-card.anxiety .dimension-icon {
  background: #fdf6ec;
  color: #E6A23C;
}

.dimension-info {
  flex: 1;
}

.dimension-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 8px 0;
}

.dimension-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.dimension-score .score-num {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.dimension-score .score-max {
  font-size: 16px;
  color: #909399;
}

.vs-divider {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vs-divider span {
  color: #fff;
  font-weight: bold;
  font-size: 14px;
}

.tendency-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  margin: 0 auto;
  width: fit-content;
}

.tendency-badge.depression {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
}

.tendency-badge.anxiety {
  background: linear-gradient(135deg, #E6A23C 0%, #f5d79e 100%);
}

.tendency-badge.both {
  background: linear-gradient(135deg, #F56C6C 0%, #f7ba2a 100%);
}

.tendency-badge.none {
  background: linear-gradient(135deg, #67C23A 0%, #95d475 100%);
}

.recommend-scale-section {
  margin-top: 24px;
}

.recommend-alert {
  margin-bottom: 16px;
}

.recommend-scale-card {
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 24px;
  border: 2px dashed #409EFF;
  background: #f5faff;
}

.recommend-scale-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.2);
}

.recommend-scale-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  width: 100%;
}

.recommend-scale-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recommend-scale-info {
  flex: 1;
}

.recommend-scale-name {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 8px 0;
}

.recommend-scale-desc {
  font-size: 14px;
  color: #606266;
  margin: 0 0 12px 0;
}

.recommend-scale-meta {
  display: flex;
  gap: 16px;
}

.recommend-scale-meta .meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
}

.score-section {
  display: flex;
  gap: 40px;
  margin: 30px 0;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f4ff 100%);
  border-radius: 12px;
}

.score-display {
  display: flex;
  gap: 24px;
  align-items: center;
}

.score-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.score-value {
  font-size: 48px;
  font-weight: bold;
  line-height: 1;
}

.score-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-badge {
  display: inline-block;
  padding: 6px 16px;
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.raw-score,
.full-mark {
  font-size: 14px;
  color: #606266;
}

.raw-score strong,
.full-mark strong {
  color: #303133;
  font-size: 16px;
}

.progress-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: #909399;
}

.score-progress {
  margin-bottom: 8px;
}

.progress-markers {
  position: relative;
  height: 24px;
}

.marker {
  position: absolute;
  transform: translateX(-50%);
  font-size: 11px;
  color: #606266;
  white-space: nowrap;
  padding: 2px 6px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.disclaimer {
  margin: 20px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 24px 0 12px 0;
}

.section-title:first-of-type {
  margin-top: 0;
}

.toggle-icon {
  margin-left: auto;
  transition: transform 0.3s;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.interpretation-text {
  font-size: 15px;
  color: #303133;
  line-height: 1.8;
  margin: 0;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  border-left: 4px solid #165DFF;
}

.suggestion-content {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f0f9eb;
  border-radius: 8px;
  border-left: 4px solid #67C23A;
}

.suggestion-text {
  font-size: 15px;
  color: #303133;
  line-height: 1.8;
  margin: 0;
  flex: 1;
}

.scoring-content,
.answers-content {
  margin-top: 12px;
}

.scoring-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin: 0 0 16px 0;
}

.scoring-table,
.answers-table {
  margin-top: 12px;
}

.result-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.action-right {
  display: flex;
  gap: 12px;
}

.related-tests {
  margin-bottom: 24px;
}

.related-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-card {
  cursor: pointer;
  transition: all 0.3s;
}

.related-card:hover {
  transform: translateX(4px);
}

.related-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
}

.related-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.related-info {
  flex: 1;
}

.related-name {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 4px 0;
}

.related-desc {
  font-size: 13px;
  color: #606266;
  margin: 0;
}

.related-arrow {
  color: #c0c4cc;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .score-section {
    flex-direction: column;
    gap: 20px;
  }

  .score-display {
    flex-direction: column;
    text-align: center;
  }

  .result-actions {
    flex-direction: column;
    gap: 12px;
  }

  .result-actions .el-button {
    width: 100%;
  }

  .action-right {
    width: 100%;
    flex-direction: column;
  }

  .progress-markers {
    display: none;
  }
}
</style>
