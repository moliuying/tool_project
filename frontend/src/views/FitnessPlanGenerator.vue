<template>
  <div class="fitness-plan-generator">
    <el-card class="intro-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>功能说明</span>
        </div>
      </template>
      <el-steps :active="currentStep" finish-status="success" simple class="intro-steps">
        <el-step title="填写个人信息" description="年龄、性别、身高、体重" />
        <el-step title="选择健身目标" description="增肌、减脂、塑形或提升体能" />
        <el-step title="设置训练条件" description="每周可训练天数、每次时长、训练场景" />
        <el-step title="获取专属计划" description="AI 为你生成科学的训练方案" />
      </el-steps>
    </el-card>

    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <DataBoard />
          </el-icon>
          <span>个人信息与训练目标</span>
          <el-tag size="small" type="success" class="header-tag">科学定制 · 高效训练</el-tag>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        :disabled="isGenerating"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number
                v-model="formData.age"
                :min="10"
                :max="100"
                :step="1"
                placeholder="请输入年龄"
                style="width: 100%"
              />
              <span class="unit">岁</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="formData.gender">
                <el-radio-button :value="Gender.MALE">
                  <el-icon><Male /></el-icon> 男
                </el-radio-button>
                <el-radio-button :value="Gender.FEMALE">
                  <el-icon><Female /></el-icon> 女
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="身高" prop="height">
              <el-input-number
                v-model="formData.height"
                :min="100"
                :max="250"
                :step="1"
                placeholder="请输入身高"
                style="width: 100%"
              />
              <span class="unit">cm</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体重" prop="weight">
              <el-input-number
                v-model="formData.weight"
                :min="20"
                :max="300"
                :step="0.5"
                placeholder="请输入体重"
                style="width: 100%"
              />
              <span class="unit">kg</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="健身目标" prop="goal">
          <el-radio-group v-model="formData.goal">
            <el-radio-button :value="FitnessGoal.MUSCLE_GAIN">
              <el-icon><Dish /></el-icon> 增肌
            </el-radio-button>
            <el-radio-button :value="FitnessGoal.FAT_LOSS">
              <el-icon><Promotion /></el-icon> 减脂
            </el-radio-button>
            <el-radio-button :value="FitnessGoal.BODY_SHAPING">
              <el-icon><MagicStick /></el-icon> 塑形
            </el-radio-button>
            <el-radio-button :value="FitnessGoal.FITNESS_IMPROVEMENT">
              <el-icon><Trophy /></el-icon> 提升体能
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="每周天数" prop="availableDaysPerWeek">
              <el-slider
                v-model="formData.availableDaysPerWeek"
                :min="1"
                :max="7"
                :step="1"
                show-stops
                show-input
                style="width: calc(100% - 60px)"
              />
              <span class="unit">天</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每次时长" prop="availableMinutesPerSession">
              <el-slider
                v-model="formData.availableMinutesPerSession"
                :min="15"
                :max="180"
                :step="5"
                show-stops
                :marks="durationMarks"
                show-input
                style="width: calc(100% - 60px)"
              />
              <span class="unit">分钟</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="训练场景" prop="trainingScene">
          <el-radio-group v-model="formData.trainingScene">
            <el-radio-button :value="TrainingScene.HOME">
              <el-icon><HomeFilled /></el-icon> 家庭健身
            </el-radio-button>
            <el-radio-button :value="TrainingScene.GYM">
              <el-icon><OfficeBuilding /></el-icon> 健身房
            </el-radio-button>
            <el-radio-button :value="TrainingScene.BOTH">
              <el-icon><Connection /></el-icon> 两者结合
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <div class="form-actions">
          <el-button
            type="success"
            size="large"
            :icon="isGenerating ? Loading : MagicStick"
            @click="generatePlan"
            :loading="isGenerating"
            class="generate-button"
          >
            <template v-if="isGenerating">正在为你定制计划…</template>
            <template v-else>生成我的专属健身计划</template>
          </el-button>
          <el-button size="large" :icon="Refresh" @click="resetForm" :disabled="isGenerating">
            重置
          </el-button>
        </div>
      </el-form>
    </el-card>

    <div v-if="isGenerating" class="generating-status">
      <div class="generating-content">
        <div class="generating-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <span class="generating-text">💪 正在为你定制专属健身方案</span>
        <span class="generating-hint">AI 正在分析你的身体数据和训练目标…</span>
      </div>
    </div>

    <div v-if="fitnessPlan && !isGenerating" class="result-area" :class="{ 'result-appear': resultAppearTrigger }">
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#165DFF">
              <User />
            </el-icon>
            <span>身体数据分析</span>
          </div>
        </template>
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-label">BMI 指数</div>
              <div class="stat-value" :class="getBmiClass(fitnessPlan.userProfile.bmi)">
                {{ fitnessPlan.userProfile.bmi }}
              </div>
              <el-tag size="small" :type="getBmiTagType(fitnessPlan.userProfile.bmi)">
                {{ fitnessPlan.userProfile.bmiCategory }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-label">基础代谢 (BMR)</div>
              <div class="stat-value primary">{{ fitnessPlan.userProfile.bmr }}</div>
              <el-tag size="small" type="info">大卡 / 天</el-tag>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-label">训练目标</div>
              <div class="stat-value primary">{{ fitnessPlan.userProfile.goalLabel }}</div>
              <el-tag size="small" type="success">已设定</el-tag>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-label">基本信息</div>
              <div class="stat-value primary">
                {{ fitnessPlan.userProfile.age }}岁 ·
                {{ fitnessPlan.userProfile.gender === Gender.MALE ? '男' : '女' }}
              </div>
              <el-tag size="small" type="warning">
                {{ fitnessPlan.userProfile.height }}cm · {{ fitnessPlan.userProfile.weight }}kg
              </el-tag>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="overview-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#e6a23c">
              <DataBoard />
            </el-icon>
            <span>训练概览</span>
          </div>
        </template>
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="overview-item">
              <el-icon :size="32" color="#67c23a"><Calendar /></el-icon>
              <div class="overview-info">
                <div class="overview-value">{{ fitnessPlan.trainingOverview.weeklyDays }} 天/周</div>
                <div class="overview-label">{{ fitnessPlan.trainingOverview.frequency }}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="overview-item">
              <el-icon :size="32" color="#409eff"><Timer /></el-icon>
              <div class="overview-info">
                <div class="overview-value">{{ fitnessPlan.trainingOverview.minutesPerSession }} 分钟/次</div>
                <div class="overview-label">单次训练时长</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="overview-item">
              <el-icon :size="32" color="#f56c6c"><TrendCharts /></el-icon>
              <div class="overview-info">
                <div class="overview-value">{{ fitnessPlan.trainingOverview.totalWeeklyMinutes }} 分钟</div>
                <div class="overview-label">每周累计训练时长</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="overview-item">
              <el-icon :size="32" color="#909399"><Lightning /></el-icon>
              <div class="overview-info">
                <div class="overview-value">{{ fitnessPlan.trainingOverview.sceneLabel }}</div>
                <div class="overview-label">{{ fitnessPlan.trainingOverview.intensityLevel }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="weekly-plan-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#409eff">
              <Calendar />
            </el-icon>
            <span>每周训练计划</span>
            <el-tag size="small" type="primary">核心方案</el-tag>
          </div>
        </template>

        <div v-if="fitnessPlan.weeklyPlan.restDays.length > 0" class="rest-days">
          <el-icon color="#909399"><Moon /></el-icon>
          <span class="rest-label">休息日：</span>
          <el-tag v-for="day in fitnessPlan.weeklyPlan.restDays" :key="day" size="small" type="info" effect="plain">
            {{ day }}
          </el-tag>
        </div>

        <div class="day-plans">
          <div v-for="(dayPlan, index) in fitnessPlan.weeklyPlan.days" :key="dayPlan.day" class="day-plan-item">
            <div class="day-header">
              <div class="day-title">
                <el-icon color="#165DFF"><Sunny /></el-icon>
                <span class="day-name">{{ dayPlan.day }}</span>
                <el-tag size="small" type="success" effect="dark">{{ dayPlan.focus }}</el-tag>
              </div>
              <div class="day-duration">
                <el-icon><Timer /></el-icon>
                <span>约 {{ dayPlan.estimatedDuration }} 分钟</span>
              </div>
            </div>

            <div class="warm-cool-section">
              <div class="section-row">
                <el-icon color="#e6a23c"><Fire /></el-icon>
                <span class="section-label">热身：</span>
                <span class="section-content">{{ dayPlan.warmUp }}</span>
              </div>
              <div class="section-row">
                <el-icon color="#409eff"><Watermelon /></el-icon>
                <span class="section-label">放松：</span>
                <span class="section-content">{{ dayPlan.coolDown }}</span>
              </div>
            </div>

            <div class="exercises-list">
              <div
                v-for="(exercise, exIndex) in dayPlan.exercises"
                :key="exercise.name"
                class="exercise-item"
              >
                <div class="exercise-index">{{ exIndex + 1 }}</div>
                <div class="exercise-info">
                  <div class="exercise-name">
                    {{ exercise.name }}
                    <el-tag v-if="exercise.targetMuscle" size="small" type="warning" effect="plain">
                      {{ exercise.targetMuscle }}
                    </el-tag>
                  </div>
                  <div class="exercise-desc">{{ exercise.description }}</div>
                </div>
                <div class="exercise-volume">
                  <template v-if="exercise.duration">
                    <el-tag type="danger" effect="dark">{{ exercise.duration }}</el-tag>
                  </template>
                  <template v-else>
                    <el-tag type="danger" effect="dark">
                      {{ exercise.sets }} 组 × {{ exercise.reps }}
                    </el-tag>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="cycle-plan-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#909399">
              <Trophy />
            </el-icon>
            <span>周期规划</span>
            <el-tag size="small" type="info">总时长：{{ fitnessPlan.cyclePlan.totalDuration }}</el-tag>
          </div>
        </template>

        <el-steps :active="fitnessPlan.cyclePlan.phases.length" finish-status="success" direction="vertical">
          <el-step
            v-for="(phase, index) in fitnessPlan.cyclePlan.phases"
            :key="phase.name"
            :title="phase.name"
            :description="phase.duration"
          >
            <template #icon>
              <div class="phase-icon">{{ index + 1 }}</div>
            </template>
            <div class="phase-detail">
              <p class="phase-desc">{{ phase.description }}</p>
              <div class="phase-focus">
                <strong>重点：</strong>{{ phase.focus }}
              </div>
              <div class="phase-intensity">
                <strong>强度：</strong>{{ phase.intensity }}
              </div>
              <ul class="phase-tips">
                <li v-for="tip in phase.tips" :key="tip">{{ tip }}</li>
              </ul>
            </div>
          </el-step>
        </el-steps>
      </el-card>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-card class="nutrition-card">
            <template #header>
              <div class="card-header">
                <el-icon :size="20" color="#e6a23c">
                  <Dish />
                </el-icon>
                <span>营养建议</span>
              </div>
            </template>
            <ul class="advice-list">
              <li v-for="(tip, index) in fitnessPlan.nutritionAdvice" :key="index">
                <el-icon color="#e6a23c" :size="14"><Star /></el-icon>
                <span>{{ tip }}</span>
              </li>
            </ul>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="safety-card">
            <template #header>
              <div class="card-header">
                <el-icon :size="20" color="#f56c6c">
                  <Warning />
                </el-icon>
                <span>安全提示</span>
              </div>
            </template>
            <ul class="advice-list">
              <li v-for="(tip, index) in fitnessPlan.safetyTips" :key="index">
                <el-icon color="#f56c6c" :size="14"><WarningFilled /></el-icon>
                <span>{{ tip }}</span>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>

      <el-card class="beginner-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#67c23a">
              <Reading />
            </el-icon>
            <span>新手必读</span>
          </div>
        </template>
        <el-row :gutter="16">
          <el-col
            v-for="(tip, index) in fitnessPlan.beginnerTips"
            :key="index"
            :span="8"
          >
            <div class="beginner-item">
              <div class="beginner-number">{{ index + 1 }}</div>
              <div class="beginner-tip">{{ tip }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import {
  InfoFilled,
  DataBoard,
  Male,
  Female,
  Dish,
  Promotion,
  MagicStick,
  Trophy,
  HomeFilled,
  OfficeBuilding,
  Connection,
  Refresh,
  Loading,
  User,
  Calendar,
  Timer,
  TrendCharts,
  Lightning,
  Sunny,
  Moon,
  Fire,
  Watermelon,
  Star,
  Warning,
  WarningFilled,
  Reading
} from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  fitnessApi,
  FitnessGoal,
  Gender,
  TrainingScene,
  type FitnessPlan as FitnessPlanType,
  type CreateFitnessPlanDto
} from '@/api/fitness'

const formRef = ref<FormInstance>()
const isGenerating = ref(false)
const fitnessPlan = ref<FitnessPlanType | null>(null)
const resultAppearTrigger = ref(false)

const formData = reactive<CreateFitnessPlanDto>({
  age: 25,
  gender: Gender.MALE,
  weight: 70,
  height: 175,
  goal: FitnessGoal.FITNESS_IMPROVEMENT,
  availableDaysPerWeek: 3,
  availableMinutesPerSession: 60,
  trainingScene: TrainingScene.BOTH
})

const formRules: FormRules = {
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  weight: [{ required: true, message: '请输入体重', trigger: 'blur' }],
  height: [{ required: true, message: '请输入身高', trigger: 'blur' }],
  goal: [{ required: true, message: '请选择健身目标', trigger: 'change' }],
  availableDaysPerWeek: [{ required: true, message: '请设置每周训练天数', trigger: 'change' }],
  availableMinutesPerSession: [{ required: true, message: '请设置每次训练时长', trigger: 'change' }],
  trainingScene: [{ required: true, message: '请选择训练场景', trigger: 'change' }]
}

const durationMarks = {
  15: '15分',
  30: '30分',
  45: '45分',
  60: '1小时',
  90: '1.5小时',
  120: '2小时',
  180: '3小时'
}

const currentStep = computed(() => {
  if (fitnessPlan.value && !isGenerating.value) return 3
  if (isGenerating.value) return 3
  let step = 0
  if (formData.age && formData.gender && formData.height && formData.weight) step = 1
  if (formData.goal) step = 2
  if (formData.availableDaysPerWeek && formData.availableMinutesPerSession && formData.trainingScene) step = 2
  return step
})

const getBmiClass = (bmi: number): string => {
  if (bmi < 18.5) return 'warning'
  if (bmi < 24) return 'success'
  if (bmi < 28) return 'warning'
  return 'danger'
}

const getBmiTagType = (bmi: number): 'success' | 'warning' | 'danger' | 'info' => {
  if (bmi < 18.5) return 'warning'
  if (bmi < 24) return 'success'
  if (bmi < 28) return 'warning'
  return 'danger'
}

const resetForm = () => {
  formRef.value?.resetFields()
  formData.age = 25
  formData.gender = Gender.MALE
  formData.weight = 70
  formData.height = 175
  formData.goal = FitnessGoal.FITNESS_IMPROVEMENT
  formData.availableDaysPerWeek = 3
  formData.availableMinutesPerSession = 60
  formData.trainingScene = TrainingScene.BOTH
  fitnessPlan.value = null
  resultAppearTrigger.value = false
  ElMessage.success('表单已重置')
}

const generatePlan = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (e) {
    ElMessage.warning('请完整填写所有必填项')
    return
  }

  isGenerating.value = true
  fitnessPlan.value = null
  resultAppearTrigger.value = false

  try {
    const { data } = await fitnessApi.generatePlan({ ...formData })
    fitnessPlan.value = data
    nextTick(() => {
      resultAppearTrigger.value = true
    })
    ElMessage.success({
      message: '💪 专属健身计划已生成！',
      type: 'success',
      duration: 2500,
      showClose: true
    })
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '计划生成失败，请稍后重试')
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.fitness-plan-generator {
  max-width: 1100px;
  margin: 0 auto;
}

.intro-card,
.form-card {
  margin-bottom: 24px;
}

.intro-steps {
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

.unit {
  margin-left: 8px;
  color: #909399;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.generate-button {
  width: 320px;
  height: 56px;
  font-size: 18px;
  transition: all 0.3s ease;
}

.generating-status {
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  border-radius: 12px;
  color: #fff;
  box-shadow: 0 4px 16px rgba(103, 194, 58, 0.4);
  animation: status-pulse 1.5s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(103, 194, 58, 0.4); }
  50% { box-shadow: 0 4px 24px rgba(103, 194, 58, 0.6); }
}

.generating-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.generating-dots {
  display: flex;
  gap: 6px;
}

.generating-dots .dot {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  animation: dot-bounce 1.2s ease-in-out infinite;
}

.generating-dots .dot:nth-child(2) { animation-delay: 0.2s; }
.generating-dots .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

.generating-text {
  font-size: 16px;
  font-weight: 600;
}

.generating-hint {
  font-size: 13px;
  opacity: 0.85;
  margin-left: auto;
}

.result-area {
  transform-origin: center top;
}

.result-area.result-appear {
  animation: result-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes result-enter {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  60% {
    opacity: 1;
    transform: translateY(-8px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.profile-card,
.overview-card,
.weekly-plan-card,
.cycle-plan-card,
.beginner-card {
  margin-bottom: 24px;
}

.nutrition-card,
.safety-card {
  margin-bottom: 24px;
  height: 100%;
}

.stat-item {
  text-align: center;
  padding: 16px 8px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 12px;
}

.stat-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-value.success { color: #67c23a; }
.stat-value.warning { color: #e6a23c; }
.stat-value.danger { color: #f56c6c; }
.stat-value.primary { color: #165DFF; }

.overview-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border-radius: 12px;
}

.overview-info {
  flex: 1;
  min-width: 0;
}

.overview-value {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.overview-label {
  font-size: 13px;
  color: #909399;
}

.rest-days {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f4f4f5 0%, #e9e9eb 100%);
  border-radius: 8px;
  margin-bottom: 20px;
}

.rest-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.day-plans {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.day-plan-item {
  border: 1px solid #ebeef5;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.day-plan-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
}

.day-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.day-name {
  font-size: 17px;
  font-weight: bold;
  color: #303133;
}

.day-duration {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #606266;
}

.warm-cool-section {
  padding: 12px 20px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
}

.section-label {
  font-weight: 600;
  color: #606266;
  flex-shrink: 0;
}

.section-content {
  color: #606266;
  flex: 1;
}

.exercises-list {
  padding: 8px 0;
}

.exercise-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s ease;
}

.exercise-item:last-child {
  border-bottom: none;
}

.exercise-item:hover {
  background: #fafafa;
}

.exercise-index {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  flex-shrink: 0;
}

.exercise-info {
  flex: 1;
  min-width: 0;
}

.exercise-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.exercise-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.exercise-volume {
  flex-shrink: 0;
}

.phase-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.phase-detail {
  padding: 12px 0 24px 8px;
}

.phase-desc {
  font-size: 14px;
  color: #606266;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.phase-focus,
.phase-intensity {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.phase-tips {
  margin: 12px 0 0 0;
  padding-left: 18px;
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

.advice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.advice-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  border-bottom: 1px dashed #ebeef5;
}

.advice-list li:last-child {
  border-bottom: none;
}

.beginner-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-radius: 8px;
  margin-bottom: 12px;
}

.beginner-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #67c23a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  flex-shrink: 0;
}

.beginner-tip {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .generating-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .generating-hint {
    margin-left: 0;
  }

  .day-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .exercise-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .exercise-volume {
    align-self: flex-start;
  }

  .generate-button {
    width: 100%;
  }
}
</style>
