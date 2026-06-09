<template>
  <div class="fitness-plan-generator">
    <el-card class="intro-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>功能说明 · 科学依据 · 适用人群</span>
        </div>
      </template>

      <el-alert type="info" :closable="false" show-icon class="intro-alert">
        <template #title>
          <strong>热情耐心的健身指导者，提供专业计划与营养建议</strong>
        </template>
        基于 ACSM（美国运动医学会）运动指南与《中国居民膳食指南》，为您量身定制科学、安全、高效的健身方案。
      </el-alert>

      <el-collapse v-model="activeCollapse" class="intro-collapse">
        <el-collapse-item title="📚 计划制定依据" name="basis">
          <ul class="basis-list">
            <li v-for="(item, i) in staticPlanBasis" :key="i">
              <el-tag size="small" type="primary" effect="plain">{{ i + 1 }}</el-tag>
              <span>{{ item }}</span>
            </li>
          </ul>
        </el-collapse-item>

        <el-collapse-item title="✅ 适用人群与边界" name="scope">
          <div class="scope-section">
            <h4 class="scope-title">
              <el-icon color="#67c23a"><CircleCheckFilled /></el-icon>
              适用人群
            </h4>
            <div class="scope-tags">
              <el-tag v-for="p in staticApplicablePeople" :key="p" type="success" effect="plain">{{ p }}</el-tag>
            </div>
          </div>
          <div class="scope-section">
            <h4 class="scope-title not-applicable">
              <el-icon color="#f56c6c"><CircleCloseFilled /></el-icon>
              不适用人群 / 需医生指导
            </h4>
            <div class="scope-tags">
              <el-tag v-for="p in staticNotApplicablePeople" :key="p" type="danger" effect="plain">{{ p }}</el-tag>
            </div>
          </div>
          <div class="scope-section">
            <h4 class="scope-title">
              <el-icon color="#e6a23c"><WarningFilled /></el-icon>
              使用边界说明
            </h4>
            <ul class="boundary-list">
              <li v-for="(b, i) in staticBoundaries" :key="i">{{ b }}</li>
            </ul>
          </div>
        </el-collapse-item>

        <el-collapse-item title="⚠️ 免责声明" name="disclaimer">
          <el-alert type="warning" :closable="false" show-icon>
            <template #title>
              {{ staticDisclaimer }}
            </template>
          </el-alert>
        </el-collapse-item>
      </el-collapse>

      <el-steps :active="currentStep" finish-status="success" simple class="intro-steps">
        <el-step title="填写个人信息" description="含特殊健康状况" />
        <el-step title="选择健身目标" description="增肌、减脂、塑形等" />
        <el-step title="设置训练条件" description="天数、时长、场景" />
        <el-step title="获取专属计划" description="含安全警示与调整" />
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
        label-width="140px"
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

        <el-form-item label="特殊健康状况" prop="healthConditions">
          <el-checkbox-group v-model="formData.healthConditions">
            <el-checkbox
              v-for="opt in healthConditionOptions"
              :key="opt.value"
              :value="opt.value"
              :border="true"
              :size="'default'"
              :class="{ 'pregnancy-checkbox': opt.value === HealthCondition.PREGNANCY }"
            >
              <span v-if="opt.value === HealthCondition.PREGNANCY" style="font-weight: 700">🤰 {{ opt.label }}</span>
              <span v-else>{{ opt.label }}</span>
              <el-tag
                v-if="opt.risk === 'high'"
                size="small"
                type="danger"
                effect="dark"
                style="margin-left: 4px"
              >高风险</el-tag>
              <el-tag
                v-else
                size="small"
                type="warning"
                effect="plain"
                style="margin-left: 4px"
              >需注意</el-tag>
            </el-checkbox>
          </el-checkbox-group>

          <el-alert
            v-if="isPregnancySelected"
            type="error"
            :closable="false"
            show-icon
            class="pregnancy-warning"
          >
            <template #title>
              <strong>🤰 孕期运动安全提示</strong>
            </template>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 13px; line-height: 1.8">
              <li>孕期运动前<strong>必须获得产科医生书面许可</strong>，前置胎盘、先兆流产、妊娠高血压等并发症者<strong>禁止运动</strong></li>
              <li>本工具将自动为你生成孕期专属安全方案（慢走、凯格尔、呼吸练习等），但仅供参考</li>
              <li>禁止仰卧位（孕中晚期）、跳跃、冲击性动作、憋气发力、高温环境运动</li>
              <li>如出现阴道出血、规律宫缩、腹痛、头晕等情况，<strong>立即停止并就医</strong></li>
            </ul>
          </el-alert>

          <div class="form-hint">
            <el-icon :size="14" color="#e6a23c"><WarningFilled /></el-icon>
            如有特殊健康状况，系统会自动调整训练强度和动作，并生成专项警示建议。高风险状况（高血压、心脏病、孕期、糖尿病）建议先咨询医生。
          </div>
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
        <span class="generating-hint">AI 正在分析你的身体数据、训练目标及健康状况…</span>
      </div>
    </div>

    <div v-if="fitnessPlan && !isGenerating" class="result-area" :class="{ 'result-appear': resultAppearTrigger }">
      <el-alert
        v-if="fitnessPlan.disclaimer"
        :type="hasHighRiskWarning ? 'error' : 'warning'"
        :closable="false"
        show-icon
        class="disclaimer-alert"
      >
        <template #title>
          <strong>{{ hasHighRiskWarning ? '⚠️ 重要安全提醒' : '📌 免责声明' }}</strong>
        </template>
        {{ fitnessPlan.disclaimer }}
      </el-alert>

      <el-card v-if="fitnessPlan.healthWarnings && fitnessPlan.healthWarnings.length > 0" class="health-warnings-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#f56c6c">
              <WarningFilled />
            </el-icon>
            <span>特殊健康状况专项警示</span>
            <el-tag size="small" type="danger">请仔细阅读</el-tag>
          </div>
        </template>

        <div class="health-warnings">
          <div
            v-for="(warn, index) in fitnessPlan.healthWarnings"
            :key="index"
            class="health-warning-item"
            :class="warn.severity"
          >
            <div class="warning-header">
              <el-icon :size="18" :color="warn.severity === 'high' ? '#f56c6c' : '#e6a23c'">
                <CircleCheckFilled v-if="warn.severity !== 'high'" />
                <WarningFilled v-else />
              </el-icon>
              <span class="warning-condition">{{ warn.condition }}</span>
              <el-tag :type="warn.severity === 'high' ? 'danger' : 'warning'" effect="dark" size="small">
                {{ warn.severity === 'high' ? '高风险' : '中风险' }}
              </el-tag>
            </div>
            <div class="warning-text">
              <el-icon :size="14" :color="warn.severity === 'high' ? '#f56c6c' : '#e6a23c'"><Warning /></el-icon>
              {{ warn.warning }}
            </div>
            <ul class="warning-suggestions">
              <li v-for="(s, i) in warn.suggestions" :key="i">
                <el-icon :size="12" color="#67c23a"><Select /></el-icon>
                {{ s }}
              </li>
            </ul>
          </div>
        </div>
      </el-card>

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
        <div v-if="fitnessPlan.userProfile.healthConditions && fitnessPlan.userProfile.healthConditions.length > 0" class="user-conditions">
          <el-icon color="#e6a23c" :size="14"><WarningFilled /></el-icon>
          <span class="conditions-label">已标记健康状况：</span>
          <el-tag v-for="c in fitnessPlan.userProfile.healthConditions" :key="c" size="small" type="warning" effect="plain">
            {{ c }}
          </el-tag>
        </div>
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
                <el-icon :color="tip.startsWith('⚠️') ? '#f56c6c' : '#e6a23c'" :size="14">
                  <WarningFilled v-if="tip.startsWith('⚠️')" />
                  <Star v-else />
                </el-icon>
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

      <el-card v-if="fitnessPlan.planBasis && fitnessPlan.planBasis.length > 0" class="basis-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#165DFF">
              <Reading />
            </el-icon>
            <span>本计划制定依据</span>
          </div>
        </template>
        <ul class="basis-list compact">
          <li v-for="(item, i) in fitnessPlan.planBasis" :key="i">
            <el-tag size="small" type="primary" effect="plain">{{ i + 1 }}</el-tag>
            <span>{{ item }}</span>
          </li>
        </ul>
      </el-card>

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
  Reading,
  CircleCheckFilled,
  CircleCloseFilled,
  Select
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  fitnessApi,
  FitnessGoal,
  Gender,
  TrainingScene,
  HealthCondition,
  healthConditionOptions,
  type FitnessPlan as FitnessPlanType,
  type CreateFitnessPlanDto
} from '@/api/fitness'

const formRef = ref<FormInstance>()
const isGenerating = ref(false)
const fitnessPlan = ref<FitnessPlanType | null>(null)
const resultAppearTrigger = ref(false)
const activeCollapse = ref<string[]>([])

const formData = reactive<CreateFitnessPlanDto>({
  age: 25,
  gender: Gender.MALE,
  weight: 70,
  height: 175,
  goal: FitnessGoal.FITNESS_IMPROVEMENT,
  availableDaysPerWeek: 3,
  availableMinutesPerSession: 60,
  trainingScene: TrainingScene.BOTH,
  healthConditions: []
})

const staticPlanBasis = [
  'ACSM（美国运动医学会）运动测试与处方指南',
  '《中国居民膳食指南（2022）》营养建议标准',
  'BMI（身体质量指数）与 BMR（基础代谢率）科学计算',
  '渐进超负荷原则与周期化训练理论',
  '针对不同目标（增肌/减脂/塑形/体能）的训练分化方法',
  '家庭与健身房双场景的动作适配与替代方案',
  '特殊健康状况的运动禁忌与安全调整指南'
]

const staticApplicablePeople = [
  '健身新手（无训练经验）',
  '想要减脂塑形的人群',
  '希望增肌增重的人群',
  '忙碌的职场人士',
  '产后恢复人群（6个月后，无特殊并发症）',
  '中老年健身爱好者',
  '轻度肥胖人群（BMI 28-32）',
  '希望提升体能和运动表现的爱好者'
]

const staticNotApplicablePeople = [
  '严重心脏病患者（未经医生许可）',
  '孕期女性（尤其是孕早期与孕晚期，需产科医生许可）',
  '未控制的重度高血压患者（血压>160/100）',
  '严重骨质疏松且有骨折史者',
  '急性损伤期或术后恢复期患者',
  '严重糖尿病并发症患者',
  '严重关节疾病急性期患者',
  '哮喘急性发作期',
  '医生明确建议禁止运动者'
]

const staticBoundaries = [
  '本计划基于通用健身科学原理，不替代专业医疗诊断与建议',
  '特殊健康状况会自动降低强度并过滤禁忌动作，但仍建议在医生/康复师指导下进行',
  '训练中如出现剧烈疼痛、头晕、胸闷、气短等症状，请立即停止并就医',
  '本工具适合 BMI 16-35 范围人群，超出范围建议咨询专业人士',
  '健身效果因个体基因、作息、饮食执行度等因素存在差异，需长期坚持'
]

const staticDisclaimer = '本工具生成的健身计划基于通用运动科学原理，仅供参考，不构成医疗建议或诊断。如有慢性疾病、运动损伤史或特殊身体状况，请务必咨询医生或专业康复师后再开始训练。训练过程中请以身体感受为准，量力而行，如出现不适请立即停止并寻求专业帮助。'

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

const isPregnancySelected = computed(() =>
  formData.healthConditions?.includes(HealthCondition.PREGNANCY)
)

const currentStep = computed(() => {
  if (fitnessPlan.value && !isGenerating.value) return 3
  if (isGenerating.value) return 3
  let step = 0
  if (formData.age && formData.gender && formData.height && formData.weight) step = 1
  if (formData.goal) step = 2
  if (formData.availableDaysPerWeek && formData.availableMinutesPerSession && formData.trainingScene) step = 2
  return step
})

const hasHighRiskWarning = computed(() => {
  if (!fitnessPlan.value?.healthWarnings) return false
  return fitnessPlan.value.healthWarnings.some(w => w.severity === 'high')
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
  formData.healthConditions = []
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

  if (isPregnancySelected.value) {
    try {
      await ElMessageBox.confirm(
        `
          <div style="font-size: 14px; line-height: 1.8;">
            <p style="margin: 0 0 10px 0; color: #f56c6c; font-weight: bold;">🤰 孕期运动安全确认</p>
            <p style="margin: 0 0 8px 0;">您已选择"孕期"，请确认以下事项：</p>
            <ul style="margin: 0; padding-left: 20px; color: #606266;">
              <li>我已获得<strong>产科医生的书面许可</strong>可以进行运动</li>
              <li>我没有前置胎盘、先兆流产、妊娠高血压等运动禁忌症</li>
              <li>我理解本方案仅供参考，运动中如有不适立即停止并就医</li>
              <li>我将避免仰卧位、跳跃、憋气、腹部受压等高风险动作</li>
            </ul>
          </div>
        `,
        '孕期安全确认',
        {
          confirmButtonText: '我已确认，生成孕期安全方案',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          closeOnPressEscape: false,
        }
      )
    } catch {
      ElMessage.info('已取消生成')
      return
    }
  }

  isGenerating.value = true
  fitnessPlan.value = null
  resultAppearTrigger.value = false

  try {
    const payload = { ...formData }
    if (!payload.healthConditions || payload.healthConditions.length === 0) {
      delete payload.healthConditions
    }
    const { data } = await fitnessApi.generatePlan(payload)
    fitnessPlan.value = data
    nextTick(() => {
      resultAppearTrigger.value = true
    })
    ElMessage.success({
      message: hasHighRiskMessage(data),
      type: hasHighRiskWarningData(data) ? 'warning' : 'success',
      duration: 3000,
      showClose: true
    })
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '计划生成失败，请稍后重试')
  } finally {
    isGenerating.value = false
  }
}

const hasHighRiskWarningData = (data: FitnessPlanType) => {
  return data.healthWarnings?.some(w => w.severity === 'high')
}

const hasHighRiskMessage = (data: FitnessPlanType) => {
  if (hasHighRiskWarningData(data)) {
    return '⚠️ 已根据你的健康状况调整计划，请务必阅读安全警示并咨询医生'
  }
  return '💪 专属健身计划已生成！请仔细阅读安全提示'
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

.intro-alert {
  margin-bottom: 20px;
}

.intro-collapse {
  margin-bottom: 20px;
}

.intro-collapse :deep(.el-collapse-item__header) {
  font-weight: 600;
  font-size: 15px;
}

.basis-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.basis-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.basis-list.compact li {
  padding: 5px 0;
  font-size: 13px;
}

.scope-section {
  margin-bottom: 20px;
}

.scope-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  margin: 0 0 10px 0;
  color: #303133;
}

.scope-title.not-applicable {
  color: #f56c6c;
}

.scope-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.boundary-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

.intro-steps {
  padding: 10px 0 0 0;
  border-top: 1px solid #ebeef5;
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

.form-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  line-height: 1.6;
}

.pregnancy-warning {
  margin: 12px 0 4px 0;
  border: 2px solid #f56c6c;
  background: linear-gradient(135deg, #fef0f0 0%, #fff 100%);
}

.pregnancy-warning :deep(.el-alert__title) {
  font-size: 15px !important;
  color: #f56c6c !important;
}

.pregnancy-checkbox :deep(.el-checkbox__inner) {
  border-color: #f56c6c !important;
}

.pregnancy-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #f56c6c !important;
  border-color: #f56c6c !important;
}

.pregnancy-checkbox :deep(.el-checkbox__label) {
  color: #f56c6c !important;
  font-weight: 600;
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

.disclaimer-alert {
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.7;
}

.health-warnings-card {
  margin-bottom: 24px;
  border: 1px solid #fde2e2;
  background: linear-gradient(135deg, #fef0f0 0%, #fff 100%);
}

.health-warnings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.health-warning-item {
  padding: 16px 20px;
  border-radius: 10px;
  border-left: 4px solid;
  background: #fff;
}

.health-warning-item.high {
  border-left-color: #f56c6c;
  background: linear-gradient(135deg, #fef0f0 0%, #fff 100%);
}

.health-warning-item.medium {
  border-left-color: #e6a23c;
  background: linear-gradient(135deg, #fdf6ec 0%, #fff 100%);
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.warning-condition {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.warning-text {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
  line-height: 1.6;
}

.warning-suggestions {
  list-style: none;
  padding: 0;
  margin: 0;
}

.warning-suggestions li {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  padding: 4px 0;
  line-height: 1.6;
}

.profile-card,
.overview-card,
.weekly-plan-card,
.cycle-plan-card,
.beginner-card,
.basis-card {
  margin-bottom: 24px;
}

.user-conditions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #ebeef5;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 13px;
}

.conditions-label {
  color: #606266;
  font-weight: 500;
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
