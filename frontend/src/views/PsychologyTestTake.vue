<template>
  <div class="psychology-test-take" v-if="scale">
    <el-card class="intro-card" v-if="currentStep === 'intro'">
      <div class="intro-header">
        <div class="scale-icon" :style="{ backgroundColor: scale.color + '20', color: scale.color }">
          <el-icon :size="48"><component :is="scale.icon" /></el-icon>
        </div>
        <div class="intro-info">
          <h2 class="scale-title">{{ scale.name }}</h2>
          <p class="scale-description">{{ scale.description }}</p>
          <div class="scale-meta">
            <el-tag size="small" type="info">
              <el-icon><Document /></el-icon>
              共 {{ scale.questionCount }} 题
            </el-tag>
            <el-tag size="small" type="success">
              <el-icon><Timer /></el-icon>
              预计 {{ scale.testDuration }}
            </el-tag>
            <el-tag size="small" type="warning">
              <el-icon><User /></el-icon>
              {{ scale.suitablePopulation }}
            </el-tag>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="intro-content">
        <h4 class="section-title">
          <el-icon><Reading /></el-icon>
          量表介绍
        </h4>
        <p class="full-description">{{ scale.fullDescription }}</p>

        <h4 class="section-title">
          <el-icon><Warning /></el-icon>
          注意事项
        </h4>
        <ul class="tips-list">
          <li>请根据您最近一周的实际情况作答，不要过多思考</li>
          <li>所有题目均为必答题，请选择最符合您情况的选项</li>
          <li>答案没有对错之分，只需根据真实感受选择</li>
          <li>测评结果仅供参考，不能作为诊断依据</li>
          <li>如果感到严重不适，请及时寻求专业帮助</li>
        </ul>

        <h4 class="section-title">
          <el-icon><DataLine /></el-icon>
          评分说明
        </h4>
        <p class="scoring-info">{{ scale.scoringInstructions }}</p>
      </div>

      <div class="intro-actions">
        <el-button @click="goBack" :icon="ArrowLeft">返回列表</el-button>
        <el-button type="primary" @click="startTest" :icon="ArrowRight" size="large" :style="{ backgroundColor: scale.color, borderColor: scale.color }">
          开始测评
        </el-button>
      </div>
    </el-card>

    <el-card class="question-card" v-if="currentStep === 'test'">
      <div class="test-header">
        <div class="test-title">
          <el-icon :size="20" :color="scale.color"><component :is="scale.icon" /></el-icon>
          <span>{{ scale.name }}</span>
        </div>
        <div class="progress-info">
          <span class="progress-text">{{ currentQuestionIndex + 1 }} / {{ scale.questions.length }}</span>
          <el-progress
            :percentage="progressPercentage"
            :color="scale.color"
            :show-text="false"
            class="progress-bar"
          />
        </div>
      </div>

      <div class="question-content">
        <div class="question-number">第 {{ currentQuestionIndex + 1 }} 题</div>
        <h3 class="question-text">{{ currentQuestion?.text }}</h3>

        <el-radio-group
          v-model="currentAnswer"
          class="options-group"
          @change="onAnswerChange"
        >
          <el-radio-button
            v-for="(option, index) in currentQuestion?.options"
            :key="index"
            :value="option.score"
            class="option-button"
          >
            <span class="option-label">{{ option.text }}</span>
          </el-radio-button>
        </el-radio-group>
      </div>

      <div class="test-actions">
        <el-button @click="previousQuestion" :disabled="currentQuestionIndex === 0" :icon="ArrowLeft">
          上一题
        </el-button>
        <div class="action-center">
          <el-button text @click="goToQuestion(0)">
            <el-icon><Top /></el-icon>
            第一题
          </el-button>
          <el-button text @click="showQuestionNavigator = true">
            <el-icon><Grid /></el-icon>
            答题卡
          </el-button>
        </div>
        <el-button
          v-if="currentQuestionIndex < scale.questions.length - 1"
          type="primary"
          @click="nextQuestion"
          :disabled="currentAnswer === null"
          :icon="ArrowRight"
          :style="{ backgroundColor: scale.color, borderColor: scale.color }"
        >
          下一题
        </el-button>
        <el-button
          v-else
          type="success"
          @click="submitTest"
          :disabled="!isAllAnswered"
          :icon="Check"
          size="large"
        >
          提交测评
        </el-button>
      </div>
    </el-card>

    <el-dialog v-model="showQuestionNavigator" title="答题卡" width="480px">
      <div class="navigator-grid">
        <el-button
          v-for="(q, index) in scale.questions"
          :key="q.id"
          :type="isAnswered(q.id) ? (currentQuestionIndex === index ? 'primary' : 'success') : 'default'"
          :plain="currentQuestionIndex !== index"
          size="large"
          class="navigator-btn"
          @click="goToQuestion(index)"
        >
          {{ index + 1 }}
          <el-icon v-if="isAnswered(q.id)" class="check-icon"><Check /></el-icon>
        </el-button>
      </div>
      <div class="navigator-footer">
        <span class="answer-count">已答 {{ answeredCount }} / {{ scale.questions.length }} 题</span>
        <el-button @click="showQuestionNavigator = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="showSubmitConfirm" title="提交确认" width="400px">
      <div class="submit-confirm-content">
        <el-icon :size="48" color="#E6A23C"><WarningFilled /></el-icon>
        <p>您已完成所有题目，确定要提交测评吗？</p>
        <p class="submit-hint">提交后将无法修改答案</p>
      </div>
      <template #footer>
        <el-button @click="showSubmitConfirm = false">再检查一下</el-button>
        <el-button type="primary" @click="confirmSubmit">确认提交</el-button>
      </template>
    </el-dialog>
  </div>

  <el-empty v-else description="未找到对应的测评量表">
    <el-button type="primary" @click="goBack">返回列表</el-button>
  </el-empty>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Document,
  Timer,
  User,
  Reading,
  Warning,
  DataLine,
  ArrowLeft,
  ArrowRight,
  Check,
  Top,
  Grid,
  WarningFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { psychologyScales, type PsychologyScale, type Question, calculateScore } from '@/data/psychologyScales'

const route = useRoute()
const router = useRouter()

const scale = ref<PsychologyScale | null>(null)
const currentStep = ref<'intro' | 'test'>('intro')
const currentQuestionIndex = ref(0)
const currentAnswer = ref<number | null>(null)
const answers = ref<Map<number, number>>(new Map())
const showQuestionNavigator = ref(false)
const showSubmitConfirm = ref(false)

const scaleId = computed(() => route.params.id as string)

const currentQuestion = computed<Question | undefined>(() => {
  return scale.value?.questions[currentQuestionIndex.value]
})

const progressPercentage = computed(() => {
  if (!scale.value) return 0
  return Math.round(((currentQuestionIndex.value + 1) / scale.value.questions.length) * 100)
})

const answeredCount = computed(() => answers.value.size)

const isAllAnswered = computed(() => {
  return scale.value && answers.value.size === scale.value.questions.length
})

onMounted(() => {
  const foundScale = psychologyScales.find(s => s.id === scaleId.value)
  if (foundScale) {
    scale.value = foundScale
  }
})

const goBack = () => {
  router.push('/psychology-test')
}

const startTest = () => {
  currentStep.value = 'test'
  currentQuestionIndex.value = 0
  answers.value.clear()
  currentAnswer.value = null
}

const onAnswerChange = (value: number) => {
  if (currentQuestion.value) {
    answers.value.set(currentQuestion.value.id, value)
  }
}

const isAnswered = (questionId: number): boolean => {
  return answers.value.has(questionId)
}

const goToQuestion = (index: number) => {
  if (scale.value && index >= 0 && index < scale.value.questions.length) {
    showQuestionNavigator.value = false
    currentQuestionIndex.value = index
    const question = scale.value.questions[index]
    currentAnswer.value = answers.value.get(question.id) || null
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    const question = scale.value?.questions[currentQuestionIndex.value]
    currentAnswer.value = question ? (answers.value.get(question.id) || null) : null
  }
}

const nextQuestion = () => {
  if (scale.value && currentQuestionIndex.value < scale.value.questions.length - 1) {
    currentQuestionIndex.value++
    const question = scale.value.questions[currentQuestionIndex.value]
    currentAnswer.value = answers.value.get(question.id) || null
  }
}

const submitTest = () => {
  if (isAllAnswered.value) {
    showSubmitConfirm.value = true
  } else {
    const unanswered = scale.value?.questions.filter(q => !answers.value.has(q.id))
    if (unanswered && unanswered.length > 0) {
      ElMessage.warning(`还有 ${unanswered.length} 题未作答，请完成所有题目`)
      goToQuestion(scale.value!.questions.findIndex(q => q.id === unanswered[0].id))
    }
  }
}

const confirmSubmit = () => {
  if (!scale.value) return

  const totalScore = calculateScore(scale.value, answers.value)
  const answersObj = Object.fromEntries(answers.value)

  router.push({
    path: `/psychology-test/${scaleId.value}/result`,
    query: {
      score: totalScore.toString(),
      answers: JSON.stringify(answersObj)
    }
  })
}
</script>

<style scoped>
.psychology-test-take {
  max-width: 900px;
  margin: 0 auto;
}

.intro-card {
  margin-bottom: 24px;
}

.intro-header {
  display: flex;
  gap: 24px;
  align-items: center;
}

.scale-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.intro-info {
  flex: 1;
}

.scale-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 8px 0;
}

.scale-description {
  font-size: 14px;
  color: #606266;
  margin: 0 0 12px 0;
}

.scale-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.scale-meta .el-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.intro-content {
  padding: 10px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 12px 0;
}

.section-title:first-child {
  margin-top: 0;
}

.full-description {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin: 0;
  text-indent: 2em;
}

.tips-list {
  font-size: 14px;
  color: #606266;
  line-height: 2;
  padding-left: 20px;
  margin: 0;
}

.tips-list li {
  list-style-type: decimal;
}

.scoring-info {
  font-size: 14px;
  color: #909399;
  line-height: 1.8;
  margin: 0;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.intro-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.question-card {
  margin-bottom: 24px;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.test-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
}

.progress-text {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.progress-bar {
  flex: 1;
}

.question-content {
  padding: 20px 0;
}

.question-number {
  display: inline-block;
  padding: 4px 12px;
  background: #e6f4ff;
  color: #165DFF;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 16px;
}

.question-text {
  font-size: 18px;
  color: #303133;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.options-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.option-button {
  width: 100%;
  margin-right: 0 !important;
}

.option-button :deep(.el-radio-button__inner) {
  width: 100%;
  padding: 16px 20px;
  text-align: left;
  font-size: 15px;
  border-radius: 8px !important;
  border: 2px solid #e4e7ed;
}

.option-button :deep(.el-radio-button__inner:hover) {
  border-color: #165DFF;
  color: #165DFF;
}

.option-button.is-active :deep(.el-radio-button__inner) {
  background: #165DFF;
  border-color: #165DFF;
  color: #fff;
}

.option-label {
  margin-left: 8px;
}

.test-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  margin-top: 20px;
}

.action-center {
  display: flex;
  gap: 16px;
}

.navigator-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  padding: 20px 0;
}

.navigator-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  position: relative;
}

.check-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 12px;
}

.navigator-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

.answer-count {
  font-size: 14px;
  color: #606266;
}

.submit-confirm-content {
  text-align: center;
  padding: 20px;
}

.submit-confirm-content p {
  font-size: 16px;
  color: #303133;
  margin: 16px 0 8px 0;
}

.submit-hint {
  font-size: 13px !important;
  color: #909399 !important;
  margin: 0 !important;
}

@media (max-width: 768px) {
  .intro-header {
    flex-direction: column;
    text-align: center;
  }

  .scale-meta {
    justify-content: center;
  }

  .intro-actions {
    flex-direction: column;
    gap: 12px;
  }

  .intro-actions .el-button {
    width: 100%;
  }

  .test-actions {
    flex-direction: column;
    gap: 12px;
  }

  .test-actions .el-button {
    width: 100%;
  }

  .navigator-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
