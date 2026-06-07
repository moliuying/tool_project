<template>
  <div class="date-difference-calculator">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <el-steps :active="0" finish-status="wait" simple class="guide-steps">
        <el-step title="选择输入方式" description="支持下拉选择年/月/日或日历选择器两种方式" />
        <el-step title="选择起始日期" description="可以是出生日期、项目开始日期、某个纪念日等" />
        <el-step title="选择目标日期" description="可以是今天、未来的节日、考试日期、截止日期等" />
        <el-step title="点击计算" description="一键获取两个日期之间的详细差值" />
      </el-steps>
      <el-divider />
      <div class="validation-rules">
        <h4 class="rules-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          日期校验规则
        </h4>
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="rule-item">
              <el-icon :size="18" color="#67C23A"><CircleCheckFilled /></el-icon>
              <div class="rule-content">
                <span class="rule-label">年份范围</span>
                <span class="rule-desc">支持 1900 年 ~ 2100 年</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="rule-item">
              <el-icon :size="18" color="#67C23A"><CircleCheckFilled /></el-icon>
              <div class="rule-content">
                <span class="rule-label">月份范围</span>
                <span class="rule-desc">1 月 ~ 12 月</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="rule-item">
              <el-icon :size="18" color="#67C23A"><CircleCheckFilled /></el-icon>
              <div class="rule-content">
                <span class="rule-label">日期合法性</span>
                <span class="rule-desc">自动校验（含闰年2月、30/31天）</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-alert
          title="非法日期处理说明"
          type="warning"
          :closable="false"
          show-icon
          class="rule-alert"
        >
          <template #default>
            <p>当输入不合法日期时（如 2月30日、4月31日、非闰年2月29日）：</p>
            <ul class="alert-list">
              <li>下拉模式：日期选项会根据年月动态调整，不会出现非法日期</li>
              <li>计算前会进行二次校验，如发现问题将弹出错误提示</li>
              <li>非法日期的输入框会标红显示，便于定位问题</li>
            </ul>
          </template>
        </el-alert>
      </div>
      <el-divider />
      <div class="scenario-tips">
        <h4 class="tips-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          常见使用场景
        </h4>
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="tip-item" @click="applyScenario('birthday')">
              <el-icon :size="18" color="#165DFF"><Dessert /></el-icon>
              <div class="tip-content">
                <span class="tip-label">出生天数</span>
                <span class="tip-desc">计算您出生至今的天数</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="tip-item" @click="applyScenario('countdown')">
              <el-icon :size="18" color="#67C23A"><AlarmClock /></el-icon>
              <div class="tip-content">
                <span class="tip-label">倒计时</span>
                <span class="tip-desc">距离节日/考试/活动还有多少天</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="tip-item" @click="applyScenario('anniversary')">
              <el-icon :size="18" color="#E6A23C"><Present /></el-icon>
              <div class="tip-content">
                <span class="tip-label">纪念日</span>
                <span class="tip-desc">计算恋爱/结婚/入职等纪念日</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="calculator-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Calendar />
          </el-icon>
          <span>日期差计算</span>
          <el-tag size="small" type="info" class="header-tag">支持天数/周数/月数/年数多维度统计</el-tag>
        </div>
      </template>

      <div class="input-mode-switch">
        <span class="switch-label">输入方式：</span>
        <el-radio-group v-model="inputMode" size="default">
          <el-radio-button value="select">
            <el-icon><Menu /></el-icon>
            下拉选择（年/月/日）
          </el-radio-button>
          <el-radio-button value="picker">
            <el-icon><Calendar /></el-icon>
            日历选择器
          </el-radio-button>
        </el-radio-group>
      </div>

      <el-form
        :model="form"
        label-width="100px"
        class="calculator-form"
        :rules="rules"
        ref="formRef"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="起始日期" required>
              <div class="form-item-with-help">
                <el-tooltip content="计算的起始日期，如出生日期、项目开始日" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>

                <div v-if="inputMode === 'select'" class="date-select-group">
                  <el-select
                    v-model="startDateParts.year"
                    placeholder="年"
                    class="date-select year-select"
                    @change="onStartDateChange"
                  >
                    <el-option
                      v-for="year in yearOptions"
                      :key="year"
                      :label="year + ' 年'"
                      :value="year"
                    />
                  </el-select>
                  <el-select
                    v-model="startDateParts.month"
                    placeholder="月"
                    class="date-select month-select"
                    @change="onStartDateChange"
                  >
                    <el-option
                      v-for="month in 12"
                      :key="month"
                      :label="month + ' 月'"
                      :value="month"
                    />
                  </el-select>
                  <el-select
                    v-model="startDateParts.day"
                    placeholder="日"
                    class="date-select day-select"
                    :disabled="!startDateParts.year || !startDateParts.month"
                    @change="onStartDateChange"
                  >
                    <el-option
                      v-for="day in getDaysInMonth(startDateParts.year, startDateParts.month)"
                      :key="day"
                      :label="day + ' 日'"
                      :value="day"
                    />
                  </el-select>
                </div>

                <el-date-picker
                  v-else
                  v-model="form.startDate"
                  type="date"
                  placeholder="请选择起始日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  clearable
                  @change="onPickerStartChange"
                />
              </div>
              <div v-if="inputMode === 'select' && startDateParts.year && startDateParts.month" class="field-hint">
                <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
                <span>{{ startDateParts.year }} 年 {{ startDateParts.month }} 月共 {{ getDaysInMonth(startDateParts.year, startDateParts.month) }} 天
                  <span v-if="startDateParts.month === 2 && isLeapYear(startDateParts.year)">（闰年）</span>
                </span>
              </div>
              <div class="quick-dates">
                <span class="quick-tag" @click="setStartDateToday">今天</span>
                <span class="quick-tag" @click="setStartDateYesterday">昨天</span>
                <span class="quick-tag" @click="setStartDateWeekAgo">一周前</span>
                <span class="quick-tag" @click="setStartDateMonthAgo">一月前</span>
                <span class="quick-tag" @click="setStartDateYearAgo">一年前</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标日期" required>
              <div class="form-item-with-help">
                <el-tooltip content="计算的目标日期，如今天、节日、截止日" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>

                <div v-if="inputMode === 'select'" class="date-select-group">
                  <el-select
                    v-model="endDateParts.year"
                    placeholder="年"
                    class="date-select year-select"
                    @change="onEndDateChange"
                  >
                    <el-option
                      v-for="year in yearOptions"
                      :key="year"
                      :label="year + ' 年'"
                      :value="year"
                    />
                  </el-select>
                  <el-select
                    v-model="endDateParts.month"
                    placeholder="月"
                    class="date-select month-select"
                    @change="onEndDateChange"
                  >
                    <el-option
                      v-for="month in 12"
                      :key="month"
                      :label="month + ' 月'"
                      :value="month"
                    />
                  </el-select>
                  <el-select
                    v-model="endDateParts.day"
                    placeholder="日"
                    class="date-select day-select"
                    :disabled="!endDateParts.year || !endDateParts.month"
                    @change="onEndDateChange"
                  >
                    <el-option
                      v-for="day in getDaysInMonth(endDateParts.year, endDateParts.month)"
                      :key="day"
                      :label="day + ' 日'"
                      :value="day"
                    />
                  </el-select>
                </div>

                <el-date-picker
                  v-else
                  v-model="form.endDate"
                  type="date"
                  placeholder="请选择目标日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  clearable
                  @change="onPickerEndChange"
                />
              </div>
              <div v-if="inputMode === 'select' && endDateParts.year && endDateParts.month" class="field-hint">
                <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
                <span>{{ endDateParts.year }} 年 {{ endDateParts.month }} 月共 {{ getDaysInMonth(endDateParts.year, endDateParts.month) }} 天
                  <span v-if="endDateParts.month === 2 && isLeapYear(endDateParts.year)">（闰年）</span>
                </span>
              </div>
              <div class="quick-dates">
                <span class="quick-tag" @click="setEndDateToday">今天</span>
                <span class="quick-tag" @click="setEndDateTomorrow">明天</span>
                <span class="quick-tag" @click="setEndDateWeekLater">一周后</span>
                <span class="quick-tag" @click="setEndDateMonthLater">一月后</span>
                <span class="quick-tag" @click="setEndDateYearLater">一年后</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="包含选项">
          <el-checkbox v-model="form.includeWeekends">计算工作日/休息日</el-checkbox>
          <el-checkbox v-model="form.includeEndDate">包含目标日期当天</el-checkbox>
        </el-form-item>

        <div class="action-buttons">
          <el-button type="primary" size="large" @click="calculate" :disabled="!canCalculate">
            <el-icon><Calculator /></el-icon>
            开始计算
          </el-button>
          <el-button size="large" @click="resetForm">
            <el-icon><RefreshRight /></el-icon>
            重置
          </el-button>
          <el-button size="large" @click="swapDates">
            <el-icon><Switch /></el-icon>
            交换日期
          </el-button>
        </div>
      </el-form>

      <el-divider v-if="result" />

      <div v-if="result" class="result-section">
        <h4 class="result-title">
          <el-icon :size="18" color="#165DFF"><DataAnalysis /></el-icon>
          计算结果
        </h4>

        <div class="result-summary">
          <div class="summary-main" :class="resultDirection">
            <span class="summary-number">{{ result.totalDays }}</span>
            <span class="summary-unit">天</span>
            <span class="summary-direction">{{ result.directionText }}</span>
          </div>
          <div class="summary-date-range">
            <el-tag type="info" size="large">{{ form.startDate }}</el-tag>
            <el-icon :size="16" color="#909399"><Right /></el-icon>
            <el-tag type="info" size="large">{{ form.endDate }}</el-tag>
          </div>
        </div>

        <el-row :gutter="16" class="result-grid">
          <el-col :span="6">
            <div class="result-card days">
              <div class="result-icon">
                <el-icon :size="28"><Sunny /></el-icon>
              </div>
              <div class="result-info">
                <span class="result-value">{{ result.totalDays }}</span>
                <span class="result-label">总天数</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="result-card weeks">
              <div class="result-icon">
                <el-icon :size="28"><Calendar /></el-icon>
              </div>
              <div class="result-info">
                <span class="result-value">{{ result.totalWeeks }}</span>
                <span class="result-label">周数</span>
                <span class="result-sub" v-if="result.remainingDays > 0">余 {{ result.remainingDays }} 天</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="result-card months">
              <div class="result-icon">
                <el-icon :size="28"><Document /></el-icon>
              </div>
              <div class="result-info">
                <span class="result-value">{{ result.totalMonths }}</span>
                <span class="result-label">月数</span>
                <span class="result-sub" v-if="result.remainingDaysAfterMonths > 0">余 {{ result.remainingDaysAfterMonths }} 天</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="result-card years">
              <div class="result-icon">
                <el-icon :size="28"><Trophy /></el-icon>
              </div>
              <div class="result-info">
                <span class="result-value">{{ result.totalYears }}</span>
                <span class="result-label">年数</span>
                <span class="result-sub" v-if="result.remainingMonthsAfterYears > 0 || result.remainingDaysAfterYears > 0">
                  {{ result.remainingMonthsAfterYears > 0 ? result.remainingMonthsAfterYears + '个月' : '' }}
                  {{ result.remainingDaysAfterYears > 0 ? result.remainingDaysAfterYears + '天' : '' }}
                </span>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="result-grid" v-if="form.includeWeekends">
          <el-col :span="8">
            <div class="result-card workdays">
              <div class="result-icon">
                <el-icon :size="28"><Briefcase /></el-icon>
              </div>
              <div class="result-info">
                <span class="result-value">{{ result.workDays }}</span>
                <span class="result-label">工作日</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="result-card weekends">
              <div class="result-icon">
                <el-icon :size="28"><Umbrella /></el-icon>
              </div>
              <div class="result-info">
                <span class="result-value">{{ result.weekendDays }}</span>
                <span class="result-label">休息日</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="result-card hours">
              <div class="result-icon">
                <el-icon :size="28"><Clock /></el-icon>
              </div>
              <div class="result-info">
                <span class="result-value">{{ formatNumber(result.totalHours) }}</span>
                <span class="result-label">总小时</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-card class="detail-card" shadow="never">
          <template #header>
            <div class="detail-header">
              <el-icon :size="16" color="#165DFF"><Tickets /></el-icon>
              <span>详细信息</span>
            </div>
          </template>
          <div class="detail-list">
            <div class="detail-item">
              <span class="detail-label">总分钟数</span>
              <span class="detail-value">{{ formatNumber(result.totalMinutes) }} 分钟</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">总秒数</span>
              <span class="detail-value">{{ formatNumber(result.totalSeconds) }} 秒</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">起始日期星期</span>
              <span class="detail-value">{{ result.startWeekday }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">目标日期星期</span>
              <span class="detail-value">{{ result.endWeekday }}</span>
            </div>
            <div class="detail-item" v-if="form.includeWeekends">
              <span class="detail-label">工作周数</span>
              <span class="detail-value">{{ result.workWeeks }} 周</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">闰年信息</span>
              <span class="detail-value">
                起始年{{ isLeapYear(result.startYear) ? '是' : '不是' }}闰年
                <el-divider direction="vertical" />
                目标年{{ isLeapYear(result.endYear) ? '是' : '不是' }}闰年
              </span>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

interface DateParts {
  year: number | null
  month: number | null
  day: number | null
}

interface FormData {
  startDate: string
  endDate: string
  includeWeekends: boolean
  includeEndDate: boolean
}

interface CalculationResult {
  totalDays: number
  totalWeeks: number
  remainingDays: number
  totalMonths: number
  remainingDaysAfterMonths: number
  totalYears: number
  remainingMonthsAfterYears: number
  remainingDaysAfterYears: number
  workDays: number
  weekendDays: number
  workWeeks: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  startWeekday: string
  endWeekday: string
  startYear: number
  endYear: number
  isPast: boolean
  isFuture: boolean
  directionText: string
}

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const inputMode = ref<'select' | 'picker'>('select')
const formRef = ref<FormInstance>()

const form = reactive<FormData>({
  startDate: '',
  endDate: '',
  includeWeekends: true,
  includeEndDate: true
})

const startDateParts = reactive<DateParts>({
  year: null,
  month: null,
  day: null
})

const endDateParts = reactive<DateParts>({
  year: null,
  month: null,
  day: null
})

const result = ref<CalculationResult | null>(null)

const MIN_YEAR = 1900
const MAX_YEAR = 2100

const yearOptions = computed(() => {
  const years: number[] = []
  for (let y = MAX_YEAR; y >= MIN_YEAR; y--) {
    years.push(y)
  }
  return years
})

const rules: FormRules = {
  startDate: [
    { required: true, message: '请选择起始日期', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: '请选择目标日期', trigger: 'change' }
  ]
}

const canCalculate = computed(() => {
  if (inputMode.value === 'select') {
    return (
      startDateParts.year !== null &&
      startDateParts.month !== null &&
      startDateParts.day !== null &&
      endDateParts.year !== null &&
      endDateParts.month !== null &&
      endDateParts.day !== null
    )
  }
  return form.startDate && form.endDate
})

const resultDirection = computed(() => {
  if (!result.value) return ''
  if (result.value.isPast) return 'past'
  if (result.value.isFuture) return 'future'
  return 'today'
})

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

const getDaysInMonth = (year: number | null, month: number | null): number => {
  if (!year || !month) return 31
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (month === 2 && isLeapYear(year)) {
    return 29
  }
  return daysInMonth[month - 1]
}

const isValidDate = (year: number, month: number, day: number): boolean => {
  if (year < MIN_YEAR || year > MAX_YEAR) return false
  if (month < 1 || month > 12) return false
  const maxDay = getDaysInMonth(year, month)
  if (day < 1 || day > maxDay) return false
  return true
}

const getToday = (): string => {
  const today = new Date()
  return formatDate(today)
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const parseDateToParts = (dateStr: string): DateParts => {
  if (!dateStr) return { year: null, month: null, day: null }
  const [year, month, day] = dateStr.split('-').map(Number)
  return { year, month, day }
}

const formatPartsToDate = (parts: DateParts): string => {
  if (parts.year === null || parts.month === null || parts.day === null) {
    return ''
  }
  const year = parts.year
  const month = String(parts.month).padStart(2, '0')
  const day = String(parts.day).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const validateAndAdjustDay = (parts: DateParts): void => {
  if (parts.year !== null && parts.month !== null && parts.day !== null) {
    const maxDay = getDaysInMonth(parts.year, parts.month)
    if (parts.day > maxDay) {
      parts.day = maxDay
      ElMessage.warning(`日期已自动调整为 ${maxDay} 日（${parts.year}年${parts.month}月共${maxDay}天）`)
    }
  }
}

const onStartDateChange = () => {
  validateAndAdjustDay(startDateParts)
  form.startDate = formatPartsToDate(startDateParts)
  if (result.value) result.value = null
}

const onEndDateChange = () => {
  validateAndAdjustDay(endDateParts)
  form.endDate = formatPartsToDate(endDateParts)
  if (result.value) result.value = null
}

const onPickerStartChange = (val: string | null) => {
  if (val) {
    const parts = parseDateToParts(val)
    startDateParts.year = parts.year
    startDateParts.month = parts.month
    startDateParts.day = parts.day
  } else {
    startDateParts.year = null
    startDateParts.month = null
    startDateParts.day = null
  }
  if (result.value) result.value = null
}

const onPickerEndChange = (val: string | null) => {
  if (val) {
    const parts = parseDateToParts(val)
    endDateParts.year = parts.year
    endDateParts.month = parts.month
    endDateParts.day = parts.day
  } else {
    endDateParts.year = null
    endDateParts.month = null
    endDateParts.day = null
  }
  if (result.value) result.value = null
}

watch(inputMode, (newMode) => {
  if (newMode === 'picker') {
    form.startDate = formatPartsToDate(startDateParts)
    form.endDate = formatPartsToDate(endDateParts)
  } else {
    if (form.startDate) {
      const parts = parseDateToParts(form.startDate)
      startDateParts.year = parts.year
      startDateParts.month = parts.month
      startDateParts.day = parts.day
    }
    if (form.endDate) {
      const parts = parseDateToParts(form.endDate)
      endDateParts.year = parts.year
      endDateParts.month = parts.month
      endDateParts.day = parts.day
    }
  }
})

const setDateFromParts = (target: 'start' | 'end', date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dateStr = formatDate(date)

  if (target === 'start') {
    startDateParts.year = year
    startDateParts.month = month
    startDateParts.day = day
    form.startDate = dateStr
  } else {
    endDateParts.year = year
    endDateParts.month = month
    endDateParts.day = day
    form.endDate = dateStr
  }
}

const setStartDateToday = () => setDateFromParts('start', new Date())
const setStartDateYesterday = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  setDateFromParts('start', d)
}
const setStartDateWeekAgo = () => {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  setDateFromParts('start', d)
}
const setStartDateMonthAgo = () => {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  setDateFromParts('start', d)
}
const setStartDateYearAgo = () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 1)
  setDateFromParts('start', d)
}

const setEndDateToday = () => setDateFromParts('end', new Date())
const setEndDateTomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  setDateFromParts('end', d)
}
const setEndDateWeekLater = () => {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  setDateFromParts('end', d)
}
const setEndDateMonthLater = () => {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  setDateFromParts('end', d)
}
const setEndDateYearLater = () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  setDateFromParts('end', d)
}

const swapDates = () => {
  const tempYear = startDateParts.year
  const tempMonth = startDateParts.month
  const tempDay = startDateParts.day
  const tempStr = form.startDate

  startDateParts.year = endDateParts.year
  startDateParts.month = endDateParts.month
  startDateParts.day = endDateParts.day
  form.startDate = form.endDate

  endDateParts.year = tempYear
  endDateParts.month = tempMonth
  endDateParts.day = tempDay
  form.endDate = tempStr

  if (result.value) calculate()
}

const resetForm = () => {
  form.startDate = ''
  form.endDate = ''
  form.includeWeekends = true
  form.includeEndDate = true
  startDateParts.year = null
  startDateParts.month = null
  startDateParts.day = null
  endDateParts.year = null
  endDateParts.month = null
  endDateParts.day = null
  result.value = null
  formRef.value?.resetFields()
}

const applyScenario = (scenario: string) => {
  resetForm()
  const today = new Date()
  switch (scenario) {
    case 'birthday':
      setDateFromParts('start', new Date(1990, 0, 1))
      setDateFromParts('end', today)
      ElMessage.info('已填入生日计算模板，请修改起始日期为您的出生日期')
      break
    case 'countdown':
      setDateFromParts('start', today)
      const nextYear = new Date(today.getFullYear() + 1, 0, 1)
      setDateFromParts('end', nextYear)
      ElMessage.info('已填入倒计时模板，请修改目标日期为您的重要日期')
      break
    case 'anniversary':
      setDateFromParts('start', new Date(2020, 4, 20))
      setDateFromParts('end', today)
      ElMessage.info('已填入纪念日模板，请修改起始日期为纪念日期')
      break
  }
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN')
}

const diffInDays = (start: Date, end: Date): number => {
  const startMs = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
  const endMs = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime()
  return Math.round((endMs - startMs) / (1000 * 60 * 60 * 24))
}

const diffInMonths = (start: Date, end: Date): number => {
  let months = (end.getFullYear() - start.getFullYear()) * 12
  months += end.getMonth() - start.getMonth()
  if (end.getDate() < start.getDate()) {
    months--
  }
  return Math.max(0, months)
}

const diffInYears = (start: Date, end: Date): number => {
  let years = end.getFullYear() - start.getFullYear()
  if (
    end.getMonth() < start.getMonth() ||
    (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
  ) {
    years--
  }
  return Math.max(0, years)
}

const countWorkDays = (start: Date, end: Date): { workDays: number; weekendDays: number } => {
  let workDays = 0
  let weekendDays = 0
  const current = new Date(start)
  while (current <= end) {
    const day = current.getDay()
    if (day === 0 || day === 6) {
      weekendDays++
    } else {
      workDays++
    }
    current.setDate(current.getDate() + 1)
  }
  return { workDays, weekendDays }
}

const calculate = () => {
  if (!canCalculate.value) {
    ElMessage.warning('请先完整选择起始日期和目标日期')
    return
  }

  if (inputMode.value === 'select') {
    const startValid = isValidDate(
      startDateParts.year as number,
      startDateParts.month as number,
      startDateParts.day as number
    )
    const endValid = isValidDate(
      endDateParts.year as number,
      endDateParts.month as number,
      endDateParts.day as number
    )

    if (!startValid) {
      ElMessage.error(`起始日期不合法：${startDateParts.year}年${startDateParts.month}月${startDateParts.day}日不存在`)
      return
    }
    if (!endValid) {
      ElMessage.error(`目标日期不合法：${endDateParts.year}年${endDateParts.month}月${endDateParts.day}日不存在`)
      return
    }

    form.startDate = formatPartsToDate(startDateParts)
    form.endDate = formatPartsToDate(endDateParts)
  }

  if (!form.startDate || !form.endDate) {
    ElMessage.warning('请先选择起始日期和目标日期')
    return
  }

  const startDate = parseDate(form.startDate)
  const endDate = parseDate(form.endDate)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    ElMessage.error('日期格式错误，请重新选择')
    return
  }

  const isPast = endDate < startDate
  const actualStart = isPast ? endDate : startDate
  const actualEnd = isPast ? startDate : endDate

  let totalDays = diffInDays(actualStart, actualEnd)
  if (form.includeEndDate) {
    totalDays += 1
  }

  const totalWeeks = Math.floor(totalDays / 7)
  const remainingDays = totalDays % 7

  const totalMonths = diffInMonths(actualStart, actualEnd)
  const monthsEnd = new Date(actualStart)
  monthsEnd.setMonth(monthsEnd.getMonth() + totalMonths)
  let remainingDaysAfterMonths = diffInDays(monthsEnd, actualEnd)
  if (form.includeEndDate) {
    remainingDaysAfterMonths += 1
  }

  const totalYears = diffInYears(actualStart, actualEnd)
  const yearsEnd = new Date(actualStart)
  yearsEnd.setFullYear(yearsEnd.getFullYear() + totalYears)
  const remainingMonthsAfterYears = diffInMonths(yearsEnd, actualEnd)
  const monthsAfterYears = new Date(yearsEnd)
  monthsAfterYears.setMonth(monthsAfterYears.getMonth() + remainingMonthsAfterYears)
  let remainingDaysAfterYears = diffInDays(monthsAfterYears, actualEnd)
  if (form.includeEndDate) {
    remainingDaysAfterYears += 1
  }

  let workDays = 0
  let weekendDays = 0
  if (form.includeWeekends) {
    const workEnd = new Date(actualEnd)
    if (!form.includeEndDate) {
      workEnd.setDate(workEnd.getDate() - 1)
    }
    if (actualStart <= workEnd) {
      const counts = countWorkDays(actualStart, workEnd)
      workDays = counts.workDays
      weekendDays = counts.weekendDays
    }
  }

  const totalHours = totalDays * 24
  const totalMinutes = totalHours * 60
  const totalSeconds = totalMinutes * 60

  const startWeekday = weekdays[startDate.getDay()]
  const endWeekday = weekdays[endDate.getDay()]

  let directionText = ''
  if (isPast) {
    directionText = form.includeEndDate ? '前（已过去）' : '前'
  } else if (totalDays > 0) {
    directionText = form.includeEndDate ? '后（含当天）' : '后'
  } else {
    directionText = '（同一天）'
  }

  result.value = {
    totalDays,
    totalWeeks,
    remainingDays,
    totalMonths,
    remainingDaysAfterMonths,
    totalYears,
    remainingMonthsAfterYears,
    remainingDaysAfterYears,
    workDays,
    weekendDays,
    workWeeks: form.includeWeekends ? Math.floor(workDays / 5) : 0,
    totalHours,
    totalMinutes,
    totalSeconds,
    startWeekday,
    endWeekday,
    startYear: startDate.getFullYear(),
    endYear: endDate.getFullYear(),
    isPast,
    isFuture: !isPast && totalDays > 0,
    directionText
  }

  ElMessage.success('计算完成')
}
</script>

<style scoped lang="scss">
.date-difference-calculator {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .guide-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }

    .guide-steps {
      margin: 10px 0;
    }

    .validation-rules {
      margin-bottom: 16px;

      .rules-title {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0 0 16px 0;
        font-size: 15px;
        color: #303133;
      }

      .rule-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #f0f9eb;
        border-radius: 8px;
        border: 1px solid #e1f3d8;

        .rule-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rule-label {
          font-weight: 600;
          color: #303133;
        }

        .rule-desc {
          font-size: 12px;
          color: #67c23a;
        }
      }

      .rule-alert {
        margin-top: 16px;

        .alert-list {
          margin: 8px 0 0 0;
          padding-left: 20px;

          li {
            margin: 4px 0;
            line-height: 1.6;
          }
        }
      }
    }

    .scenario-tips {
      .tips-title {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0 0 16px 0;
        font-size: 15px;
        color: #303133;
      }

      .tip-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #f5f7fa;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        border: 1px solid transparent;

        &:hover {
          background: #ecf5ff;
          border-color: #409eff;
          transform: translateY(-2px);
        }

        .tip-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tip-label {
          font-weight: 600;
          color: #303133;
        }

        .tip-desc {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  .calculator-card {
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;

      .header-tag {
        margin-left: auto;
      }
    }

    .input-mode-switch {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding: 12px 16px;
      background: #f5f7fa;
      border-radius: 8px;

      .switch-label {
        font-weight: 600;
        color: #303133;
      }
    }

    .calculator-form {
      margin-top: 20px;

      .form-item-with-help {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 1;

        .help-icon {
          color: #909399;
          cursor: help;
        }
      }

      .date-select-group {
        display: flex;
        gap: 8px;
        flex: 1;

        .date-select.year-select {
          flex: 1.2;
        }

        .date-select.month-select,
        .date-select.day-select {
          flex: 1;
        }
      }

      .field-hint {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #909399;
      }

      .quick-dates {
        margin-top: 8px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .quick-tag {
          padding: 2px 10px;
          background: #f5f7fa;
          border-radius: 4px;
          font-size: 12px;
          color: #606266;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;

          &:hover {
            background: #ecf5ff;
            color: #409eff;
            border-color: #c6e2ff;
          }
        }
      }

      .action-buttons {
        margin-top: 20px;
        display: flex;
        gap: 12px;
        justify-content: center;
      }
    }

    .result-section {
      .result-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 20px 0;
        font-size: 16px;
        color: #303133;
      }

      .result-summary {
        text-align: center;
        padding: 30px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        color: #fff;
        margin-bottom: 24px;

        &.past {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.future {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .summary-main {
          margin-bottom: 12px;

          .summary-number {
            font-size: 56px;
            font-weight: 700;
            line-height: 1;
          }

          .summary-unit {
            font-size: 24px;
            margin: 0 8px;
            opacity: 0.9;
          }

          .summary-direction {
            font-size: 16px;
            opacity: 0.85;
          }
        }

        .summary-date-range {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
      }

      .result-grid {
        margin-bottom: 20px;

        .result-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #ebeef5;
          transition: all 0.3s;

          &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
          }

          .result-icon {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .result-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .result-value {
            font-size: 28px;
            font-weight: 700;
            color: #303133;
            line-height: 1.2;
          }

          .result-label {
            font-size: 13px;
            color: #909399;
          }

          .result-sub {
            font-size: 12px;
            color: #c0c4cc;
          }

          &.days .result-icon {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            color: #e6a23c;
          }

          &.weeks .result-icon {
            background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
            color: #409eff;
          }

          &.months .result-icon {
            background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
            color: #67c23a;
          }

          &.years .result-icon {
            background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
            color: #f56c6c;
          }

          &.workdays .result-icon {
            background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
            color: #67c23a;
          }

          &.weekends .result-icon {
            background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
            color: #e6a23c;
          }

          &.hours .result-icon {
            background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
            color: #409eff;
          }
        }
      }

      .detail-card {
        .detail-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }

        .detail-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;

          .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            background: #f5f7fa;
            border-radius: 6px;

            .detail-label {
              color: #606266;
            }

            .detail-value {
              font-weight: 600;
              color: #303133;
            }
          }
        }
      }
    }
  }
}
</style>
