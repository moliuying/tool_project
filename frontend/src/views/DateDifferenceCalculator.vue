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
        <el-step title="选择起始日期" description="可以是出生日期、项目开始日期、某个纪念日等" />
        <el-step title="选择目标日期" description="可以是今天、未来的节日、考试日期、截止日期等" />
        <el-step title="点击计算" description="一键获取两个日期之间的详细差值" />
        <el-step title="查看结果" description="显示总天数、周数、月数、年数以及工作日/休息日统计" />
      </el-steps>
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

      <el-form :model="form" label-width="100px" class="calculator-form">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="起始日期">
              <div class="form-item-with-help">
                <el-tooltip content="计算的起始日期，如出生日期、项目开始日" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-date-picker
                  v-model="form.startDate"
                  type="date"
                  placeholder="请选择起始日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  clearable
                />
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
            <el-form-item label="目标日期">
              <div class="form-item-with-help">
                <el-tooltip content="计算的目标日期，如今天、节日、截止日" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-date-picker
                  v-model="form.endDate"
                  type="date"
                  placeholder="请选择目标日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  clearable
                />
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
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

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
  isPast: boolean
  isFuture: boolean
  directionText: string
}

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const form = reactive<FormData>({
  startDate: '',
  endDate: '',
  includeWeekends: true,
  includeEndDate: true
})

const result = ref<CalculationResult | null>(null)

const canCalculate = computed(() => {
  return form.startDate && form.endDate
})

const resultDirection = computed(() => {
  if (!result.value) return ''
  if (result.value.isPast) return 'past'
  if (result.value.isFuture) return 'future'
  return 'today'
})

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

const setStartDateToday = () => {
  form.startDate = getToday()
}

const setStartDateYesterday = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  form.startDate = formatDate(date)
}

const setStartDateWeekAgo = () => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  form.startDate = formatDate(date)
}

const setStartDateMonthAgo = () => {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  form.startDate = formatDate(date)
}

const setStartDateYearAgo = () => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 1)
  form.startDate = formatDate(date)
}

const setEndDateToday = () => {
  form.endDate = getToday()
}

const setEndDateTomorrow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  form.endDate = formatDate(date)
}

const setEndDateWeekLater = () => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  form.endDate = formatDate(date)
}

const setEndDateMonthLater = () => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  form.endDate = formatDate(date)
}

const setEndDateYearLater = () => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  form.endDate = formatDate(date)
}

const swapDates = () => {
  const temp = form.startDate
  form.startDate = form.endDate
  form.endDate = temp
  if (result.value) {
    calculate()
  }
}

const resetForm = () => {
  form.startDate = ''
  form.endDate = ''
  form.includeWeekends = true
  form.includeEndDate = true
  result.value = null
}

const applyScenario = (scenario: string) => {
  resetForm()
  switch (scenario) {
    case 'birthday':
      form.startDate = '1990-01-01'
      form.endDate = getToday()
      ElMessage.info('已填入生日计算模板，请修改起始日期为您的出生日期')
      break
    case 'countdown':
      form.startDate = getToday()
      const nextYear = new Date()
      nextYear.setFullYear(nextYear.getFullYear() + 1, 0, 1)
      form.endDate = formatDate(nextYear)
      ElMessage.info('已填入倒计时模板，请修改目标日期为您的重要日期')
      break
    case 'anniversary':
      form.startDate = '2020-05-20'
      form.endDate = getToday()
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
