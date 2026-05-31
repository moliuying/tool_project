<template>
  <div class="holiday-calendar">
    <el-card class="summary-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Calendar />
          </el-icon>
          <span>{{ currentYear }}年节假日安排</span>
          <el-tag size="small" type="success" class="header-tag">共{{ totalHolidays }}天假期</el-tag>
          <transition name="fade">
            <el-tag 
              v-if="yearComparison" 
              size="small" 
              :type="yearComparison.totalDaysDiff > 0 ? 'success' : yearComparison.totalDaysDiff < 0 ? 'danger' : 'info'"
              class="header-tag compare-tag"
            >
              较{{ prevYear }}年{{ yearComparison.totalDaysDiff > 0 ? '+' : '' }}{{ yearComparison.totalDaysDiff }}天
            </el-tag>
          </transition>
        </div>
      </template>
      
      <div class="filter-bar">
        <div class="year-selector">
          <span class="selector-label">选择年份：</span>
          <el-select 
            v-model="currentYear" 
            placeholder="请选择年份" 
            size="default"
            style="width: 140px"
            @change="onYearChange"
          >
            <el-option 
              v-for="year in yearOptions" 
              :key="year" 
              :label="year + '年'" 
              :value="year"
            />
          </el-select>
          <el-button-group class="year-quick-btns">
            <el-button 
              size="small"
              :type="currentYear === thisYear ? 'primary' : 'default'"
              @click="currentYear = thisYear"
            >
              今年
            </el-button>
            <el-button 
              size="small"
              :disabled="currentYear <= Math.min(...yearOptions)"
              @click="currentYear--"
            >
              <el-icon><ArrowLeft /></el-icon>
            </el-button>
            <el-button 
              size="small"
              :disabled="currentYear >= Math.max(...yearOptions)"
              @click="currentYear++"
            >
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </el-button-group>
        </div>
        
        <div class="search-box">
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索节日名称..." 
            clearable
            style="width: 240px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <div class="year-comparison" v-if="yearComparison">
        <div class="comparison-header">
          <el-icon :size="16" color="#e6a23c"><TrendCharts /></el-icon>
          <span class="comparison-title">与{{ prevYear }}年对比</span>
        </div>
        <div class="comparison-stats">
          <div class="comparison-item">
            <span class="comparison-label">假期天数</span>
            <div class="comparison-value-wrap">
              <span class="comparison-value">{{ totalHolidays }}天</span>
              <el-tag 
                size="small" 
                :type="yearComparison.totalDaysDiff > 0 ? 'success' : yearComparison.totalDaysDiff < 0 ? 'danger' : 'info'"
                class="diff-tag"
              >
                {{ yearComparison.totalDaysDiff > 0 ? '+' : '' }}{{ yearComparison.totalDaysDiff }}
              </el-tag>
            </div>
          </div>
          <div class="comparison-item">
            <span class="comparison-label">调休天数</span>
            <div class="comparison-value-wrap">
              <span class="comparison-value">{{ workDaysCount }}天</span>
              <el-tag 
                size="small" 
                :type="yearComparison.workDaysDiff > 0 ? 'danger' : yearComparison.workDaysDiff < 0 ? 'success' : 'info'"
                class="diff-tag"
              >
                {{ yearComparison.workDaysDiff > 0 ? '+' : '' }}{{ yearComparison.workDaysDiff }}
              </el-tag>
            </div>
          </div>
          <div class="comparison-item">
            <span class="comparison-label">长假（≥7天）</span>
            <div class="comparison-value-wrap">
              <span class="comparison-value">{{ yearComparison.longHolidays }}个</span>
              <el-tag 
                size="small" 
                :type="yearComparison.longHolidaysDiff > 0 ? 'success' : yearComparison.longHolidaysDiff < 0 ? 'danger' : 'info'"
                class="diff-tag"
              >
                {{ yearComparison.longHolidaysDiff > 0 ? '+' : '' }}{{ yearComparison.longHolidaysDiff }}
              </el-tag>
            </div>
          </div>
          <div class="comparison-item">
            <span class="comparison-label">假期分布</span>
            <div class="comparison-value-wrap">
              <span class="comparison-value">分布{{ yearComparison.distributionChange ? '变化' : '相似' }}</span>
              <el-tag 
                size="small" 
                :type="yearComparison.distributionChange ? 'warning' : 'info'"
                class="diff-tag"
              >
                {{ yearComparison.distributionChange ? yearComparison.distributionChange + '个变动' : '无变化' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <div class="timeline-section">
        <div class="timeline-header">
          <el-icon :size="16" color="#165DFF"><Clock /></el-icon>
          <span class="timeline-title">{{ currentYear }}年假期分布时间轴</span>
        </div>
        <div class="timeline-container">
          <div class="timeline-months">
            <div 
              v-for="month in 12" 
              :key="month" 
              class="timeline-month"
              :class="{ 'has-holiday': getHolidaysByMonth(month).length > 0 }"
            >
              <span class="month-label">{{ month }}月</span>
              <div class="month-holidays">
                <div 
                  v-for="holiday in getHolidaysByMonth(month)" 
                  :key="holiday.id"
                  class="month-holiday-dot"
                  :class="`type-${holiday.type}`"
                  :title="holiday.name + ' ' + holiday.dateRange"
                  @click="scrollToHoliday(holiday.id)"
                >
                  <span class="dot-day">{{ holiday.startDay }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="timeline-legend">
            <span class="legend-item"><span class="legend-dot type-tradition"></span>传统节日</span>
            <span class="legend-item"><span class="legend-dot type-modern"></span>法定假日</span>
            <span class="legend-item"><span class="legend-dot type-international"></span>国际假日</span>
          </div>
        </div>
      </div>

      <div class="changes-summary" v-if="changedHolidays.length > 0">
        <div class="changes-header">
          <el-icon :size="16" color="#f56c6c"><Warning /></el-icon>
          <span class="changes-title">较{{ prevYear }}年有 {{ changedHolidays.length }} 个节日安排变动</span>
          <el-button 
            size="small" 
            :type="activeType === 'changed' ? 'danger' : 'default'" 
            text
            @click="activeType = activeType === 'changed' ? '' : 'changed'"
          >
            {{ activeType === 'changed' ? '显示全部' : '只看变动' }}
          </el-button>
        </div>
        <div class="changes-list">
          <div 
            v-for="holiday in changedHolidays" 
            :key="holiday.id"
            class="change-item"
            @click="scrollToHoliday(holiday.id)"
          >
            <span class="change-name">{{ holiday.name }}</span>
            <el-tag 
              size="small" 
              :type="getHolidayDiff(holiday).diffType"
              class="change-tag"
            >
              {{ getHolidayDiff(holiday).diffText }}
            </el-tag>
            <span class="change-date">{{ holiday.dateRange }}</span>
          </div>
        </div>
      </div>

      <div class="quick-filter">
        <span class="filter-label">类型筛选：</span>
        <el-tag 
          v-for="filter in typeFilters" 
          :key="filter.value"
          :type="activeType === filter.value ? 'primary' : (filter.highlight && activeType !== filter.value ? 'danger' : 'info')"
          :effect="filter.highlight && activeType !== filter.value ? 'dark' : 'light'"
          size="large"
          class="filter-tag"
          :class="{ 'filter-tag-highlight': filter.highlight && changedHolidays.length > 0 && activeType !== filter.value }"
          @click="activeType = activeType === filter.value ? '' : filter.value"
        >
          {{ filter.label }}
          <el-badge 
            v-if="filter.highlight && changedHolidays.length > 0 && activeType !== filter.value"
            :value="changedHolidays.length"
            :hidden="activeType === filter.value"
            class="filter-badge"
          />
        </el-tag>
      </div>

      <div class="quick-nav">
        <span class="nav-label">快速跳转：</span>
        <div class="nav-buttons">
          <el-button 
            v-for="holiday in filteredHolidays" 
            :key="holiday.id"
            size="small"
            text
            @click="scrollToHoliday(holiday.id)"
          >
            {{ holiday.name }}
            <el-tag 
              v-if="getHolidayDiff(holiday).hasChange" 
              size="small" 
              :type="getHolidayDiff(holiday).diffType"
              class="nav-diff-tag"
            >
              {{ getHolidayDiff(holiday).diffText }}
            </el-tag>
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="overview-card" v-if="showOverview">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataLine />
          </el-icon>
          <span>假期总览表</span>
          <el-button size="small" text @click="showOverview = false">
            <el-icon><Top /></el-icon>
            收起
          </el-button>
        </div>
      </template>
      
      <el-table :data="filteredHolidays" stripe style="width: 100%">
        <el-table-column prop="name" label="节日" width="100">
          <template #default="{ row }">
            <div class="overview-name">
              <el-tag :type="row.tagType" size="small">{{ row.name }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="月份" width="80" align="center">
          <template #default="{ row }">
            <span class="overview-month">{{ row.month }}月</span>
          </template>
        </el-table-column>
        <el-table-column prop="dateRange" label="放假区间" min-width="180" />
        <el-table-column label="假期" width="80" align="center">
          <template #default="{ row }">
            <el-tag type="success" size="large">{{ row.days }}天</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="调休上班" min-width="200">
          <template #default="{ row }">
            <span v-if="row.workDays.length > 0" class="overview-workdays">
              <el-icon size="12" color="#f56c6c"><Warning /></el-icon>
              {{ row.workDays.join('、') }}
            </span>
            <span v-else class="overview-none">无调休</span>
          </template>
        </el-table-column>
        <el-table-column label="倒计时" width="120" align="center">
          <template #default="{ row }">
            <template v-if="row.countdown !== null">
              <span v-if="row.countdown > 0" class="overview-countdown">
                <el-icon size="14" color="#67c23a"><Clock /></el-icon>
                {{ row.countdown }}天
              </span>
              <span v-else-if="row.countdown === 0" class="overview-today">
                <el-icon size="14" color="#165DFF"><Present /></el-icon>
                放假中
              </span>
              <span v-else class="overview-passed">
                <el-icon size="14" color="#909399"><SuccessFilled /></el-icon>
                已结束
              </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="scrollToHoliday(row.id)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="list-header" v-if="!showOverview">
      <span class="list-title">假期详情卡片</span>
      <el-button size="small" text @click="showOverview = true">
        <el-icon><Bottom /></el-icon>
        展开总览表
      </el-button>
    </div>

    <el-row :gutter="20" class="holiday-list" :class="{ 'is-transitioning': isTransitioning }">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="holiday in filteredHolidays" :key="holiday.id" :id="String(holiday.id)">
        <el-card class="holiday-card" :class="[`type-${holiday.type}`, { 'card-has-change': getHolidayDiff(holiday).hasChange }]" shadow="hover">
          <div class="holiday-top">
            <div class="holiday-month-day">
              <span class="month">{{ holiday.month }}月</span>
              <span class="day">{{ holiday.startDay }}</span>
            </div>
            <div class="holiday-days-badge">
              <span class="days-number">{{ holiday.days }}</span>
              <span class="days-label">天</span>
              <transition name="fade">
                <el-tag 
                  v-if="getHolidayDiff(holiday).daysDiff !== 0"
                  size="small"
                  :type="getHolidayDiff(holiday).daysDiff > 0 ? 'success' : 'danger'"
                  class="days-diff-tag"
                >
                  {{ getHolidayDiff(holiday).daysDiff > 0 ? '+' : '' }}{{ getHolidayDiff(holiday).daysDiff }}
                </el-tag>
              </transition>
            </div>
          </div>
          
          <div class="holiday-main">
            <h3 class="holiday-name">
              {{ holiday.name }}
              <transition name="fade">
                <el-tag 
                  v-if="getHolidayDiff(holiday).hasChange"
                  size="small"
                  :type="getHolidayDiff(holiday).diffType"
                  class="holiday-diff-tag"
                >
                  {{ getHolidayDiff(holiday).diffText }}
                </el-tag>
              </transition>
            </h3>
            <p class="holiday-date-range">
              <el-icon size="16"><Tickets /></el-icon>
              {{ holiday.dateRange }}
            </p>
            <transition name="fade">
              <div v-if="getHolidayDiff(holiday).dateDiff" class="date-diff-info">
                <el-icon size="12" :color="getHolidayDiff(holiday).dateDiffType === 'later' ? '#e6a23c' : '#67c23a'">
                  {{ getHolidayDiff(holiday).dateDiffType === 'later' ? 'Top' : 'Bottom' }}
                </el-icon>
                <span>较{{ prevYear }}年{{ getHolidayDiff(holiday).dateDiff }}</span>
              </div>
            </transition>
          </div>
          
          <div class="holiday-info">
            <div class="info-row primary">
              <span class="info-label">放假安排</span>
              <span class="info-value">{{ holiday.holidayPeriod }}</span>
            </div>
            
            <div class="info-row warning" v-if="holiday.workDays.length > 0">
              <span class="info-label">
                <el-icon size="14" color="#f56c6c"><Warning /></el-icon>
                调休上班
              </span>
              <span class="info-value work-days">{{ holiday.workDays.join('、') }}</span>
              <transition name="fade">
                <span v-if="getHolidayDiff(holiday).workDaysDiff !== 0" class="workdays-diff">
                  （较{{ prevYear }}年{{ getHolidayDiff(holiday).workDaysDiff > 0 ? '多' : '少' }}{{ Math.abs(getHolidayDiff(holiday).workDaysDiff) }}天）
                </span>
              </transition>
            </div>
          </div>
          
          <div class="holiday-footer">
            <div class="holiday-tips" v-if="holiday.tips">
              <el-icon size="12" color="#e6a23c"><InfoFilled /></el-icon>
              <span>{{ holiday.tips }}</span>
            </div>
            
            <div class="countdown" v-if="holiday.countdown !== null">
              <template v-if="holiday.countdown > 0">
                <el-icon size="14" color="#67c23a"><Clock /></el-icon>
                <span>还有 <b>{{ holiday.countdown }}</b> 天</span>
              </template>
              <template v-else-if="holiday.countdown === 0">
                <el-icon size="14" color="#165DFF"><Present /></el-icon>
                <span class="today-text">今天放假！</span>
              </template>
              <template v-else>
                <el-icon size="14" color="#909399"><SuccessFilled /></el-icon>
                <span class="passed-text">假期已过</span>
              </template>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="stats-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataLine />
          </el-icon>
          <span>假期统计</span>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ holidays.length }}</div>
            <div class="stat-label">节日数量</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ totalHolidays }}</div>
            <div class="stat-label">放假总天数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ workDaysCount }}</div>
            <div class="stat-label">调休天数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ nextHoliday?.name || '无' }}</div>
            <div class="stat-label">下一个假期</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import {
  Calendar,
  Clock,
  InfoFilled,
  Warning,
  DataLine,
  Present,
  SuccessFilled,
  Tickets,
  Search,
  Top,
  Bottom,
  ArrowLeft,
  ArrowRight,
  TrendCharts
} from '@element-plus/icons-vue'
import { holidayApi, Holiday } from '../api/holiday'
import { ElMessage } from 'element-plus'

const thisYear = new Date().getFullYear()
const currentYear = ref(thisYear)
const yearOptions = ref<number[]>([])
const rawHolidays = ref<Holiday[]>([])
const prevYearHolidays = ref<Holiday[]>([])
const searchKeyword = ref('')
const activeType = ref('')
const showOverview = ref(true)
const loading = ref(false)
const isTransitioning = ref(false)

const typeFilters = [
  { label: '全部', value: '' },
  { label: '有变化', value: 'changed', highlight: true },
  { label: '传统节日', value: 'tradition' },
  { label: '法定假日', value: 'modern' },
  { label: '国际假日', value: 'international' },
  { label: '长假（7天）', value: 'long' },
  { label: '即将到来', value: 'upcoming' }
]

interface HolidayDiff {
  hasChange: boolean
  daysDiff: number
  dateDiff: string | null
  dateDiffType: 'earlier' | 'later' | null
  workDaysDiff: number
  diffType: 'success' | 'warning' | 'danger' | 'info'
  diffText: string
}

const calculateCountdown = (startDateStr: string, endDateStr: string): number | null => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const start = new Date(startDateStr)
  start.setHours(0, 0, 0, 0)
  
  const end = new Date(endDateStr)
  end.setHours(23, 59, 59, 999)
  
  if (today < start) {
    return Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  } else if (today >= start && today <= end) {
    return 0
  } else {
    return -1
  }
}

const fetchAvailableYears = async () => {
  try {
    const res = await holidayApi.getAvailableYears()
    yearOptions.value = res.data
  } catch (error) {
    console.error('Failed to fetch available years:', error)
    yearOptions.value = Array.from({ length: 11 }, (_, i) => 2020 + i)
  }
}

const fetchHolidays = async (year: number) => {
  loading.value = true
  isTransitioning.value = true
  try {
    const res = await holidayApi.getHolidaysByYear(year)
    rawHolidays.value = res.data
    
    const minYear = Math.min(...yearOptions.value)
    if (year > minYear) {
      const prevRes = await holidayApi.getHolidaysByYear(year - 1)
      prevYearHolidays.value = prevRes.data
    } else {
      prevYearHolidays.value = []
    }
    
    await nextTick()
  } catch (error) {
    console.error('Failed to fetch holidays:', error)
    rawHolidays.value = []
    prevYearHolidays.value = []
  } finally {
    loading.value = false
    setTimeout(() => {
      isTransitioning.value = false
    }, 300)
  }
}

const onYearChange = () => {
  fetchHolidays(currentYear.value)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const holidays = computed<Holiday[]>(() => {
  return rawHolidays.value.map(h => ({
    ...h,
    countdown: calculateCountdown(h.startDate, h.endDate)
  }))
})

const prevYear = computed(() => currentYear.value - 1)

const yearComparison = computed(() => {
  if (prevYearHolidays.value.length === 0) return null
  
  const currentTotalDays = holidays.value.reduce((sum, h) => sum + h.days, 0)
  const prevTotalDays = prevYearHolidays.value.reduce((sum, h) => sum + h.days, 0)
  
  const currentWorkDays = holidays.value.reduce((sum, h) => sum + h.workDays.length, 0)
  const prevWorkDays = prevYearHolidays.value.reduce((sum, h) => sum + h.workDays.length, 0)
  
  const currentLongHolidays = holidays.value.filter(h => h.days >= 7).length
  const prevLongHolidays = prevYearHolidays.value.filter(h => h.days >= 7).length
  
  let distributionChange = 0
  for (const h of holidays.value) {
    const prev = prevYearHolidays.value.find(p => p.name === h.name)
    if (prev && (prev.month !== h.month || prev.startDay !== h.startDay || prev.days !== h.days)) {
      distributionChange++
    }
  }
  
  return {
    totalDaysDiff: currentTotalDays - prevTotalDays,
    workDaysDiff: currentWorkDays - prevWorkDays,
    longHolidays: currentLongHolidays,
    longHolidaysDiff: currentLongHolidays - prevLongHolidays,
    distributionChange
  }
})

const getHolidayDiff = (holiday: Holiday): HolidayDiff => {
  if (prevYearHolidays.value.length === 0) {
    return {
      hasChange: false,
      daysDiff: 0,
      dateDiff: null,
      dateDiffType: null,
      workDaysDiff: 0,
      diffType: 'info',
      diffText: ''
    }
  }
  
  const prevHoliday = prevYearHolidays.value.find(h => h.name === holiday.name)
  if (!prevHoliday) {
    return {
      hasChange: true,
      daysDiff: holiday.days,
      dateDiff: '新增假期',
      dateDiffType: 'earlier',
      workDaysDiff: holiday.workDays.length,
      diffType: 'success',
      diffText: '新增'
    }
  }
  
  const daysDiff = holiday.days - prevHoliday.days
  const workDaysDiff = holiday.workDays.length - prevHoliday.workDays.length
  
  const currentDate = new Date(holiday.startDate)
  const prevDate = new Date(prevHoliday.startDate)
  const dayDiff = Math.ceil((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
  
  let dateDiff: string | null = null
  let dateDiffType: 'earlier' | 'later' | null = null
  if (dayDiff !== 0) {
    const absDays = Math.abs(dayDiff)
    const weeks = Math.floor(absDays / 7)
    const remainingDays = absDays % 7
    
    let dayStr = ''
    if (weeks > 0 && remainingDays > 0) {
      dayStr = `${weeks}周${remainingDays}天`
    } else if (weeks > 0) {
      dayStr = `${weeks}周`
    } else {
      dayStr = `${remainingDays}天`
    }
    
    if (dayDiff > 0) {
      dateDiff = `晚${dayStr}`
      dateDiffType = 'later'
    } else {
      dateDiff = `早${dayStr}`
      dateDiffType = 'earlier'
    }
  }
  
  const hasChange = daysDiff !== 0 || dayDiff !== 0 || workDaysDiff !== 0
  
  let diffType: 'success' | 'warning' | 'danger' | 'info' = 'info'
  let diffText = ''
  
  if (daysDiff > 0) {
    diffType = 'success'
    diffText = `+${daysDiff}天`
  } else if (daysDiff < 0) {
    diffType = 'danger'
    diffText = `${daysDiff}天`
  } else if (dayDiff !== 0) {
    diffType = 'warning'
    diffText = dateDiffType === 'later' ? '延后' : '提前'
  } else if (workDaysDiff > 0) {
    diffType = 'warning'
    diffText = `调休+${workDaysDiff}`
  } else if (workDaysDiff < 0) {
    diffType = 'success'
    diffText = `调休${workDaysDiff}`
  }
  
  return {
    hasChange,
    daysDiff,
    dateDiff,
    dateDiffType,
    workDaysDiff,
    diffType,
    diffText
  }
}

const getHolidaysByMonth = (month: number) => {
  return holidays.value.filter(h => h.month === month)
}

const changedHolidays = computed<Holiday[]>(() => {
  return holidays.value.filter(h => getHolidayDiff(h).hasChange)
})

const sortedHolidays = computed<Holiday[]>(() => {
  return [...holidays.value].sort((a, b) => {
    const aChanged = getHolidayDiff(a).hasChange ? 1 : 0
    const bChanged = getHolidayDiff(b).hasChange ? 1 : 0
    return bChanged - aChanged
  })
})

const filteredHolidays = computed<Holiday[]>(() => {
  let result = [...sortedHolidays.value]
  
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(h => 
      h.name.toLowerCase().includes(keyword) ||
      h.dateRange.toLowerCase().includes(keyword)
    )
  }
  
  if (activeType.value) {
    if (activeType.value === 'long') {
      result = result.filter(h => h.days >= 7)
    } else if (activeType.value === 'upcoming') {
      result = result.filter(h => h.countdown !== null && h.countdown >= 0)
    } else if (activeType.value === 'changed') {
      result = result.filter(h => getHolidayDiff(h).hasChange)
    } else {
      result = result.filter(h => h.type === activeType.value)
    }
  }
  
  return result
})

const totalHolidays = computed(() => {
  return holidays.value.reduce((sum, h) => sum + h.days, 0)
})

const workDaysCount = computed(() => {
  return holidays.value.reduce((sum, h) => sum + h.workDays.length, 0)
})

const nextHoliday = computed(() => {
  return holidays.value.find(h => h.countdown !== null && h.countdown >= 0)
})

const scrollToHoliday = (id: number | string) => {
  const element = document.getElementById(String(id))
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

watch(currentYear, () => {
  fetchHolidays(currentYear.value)
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

onMounted(() => {
  fetchAvailableYears()
  fetchHolidays(currentYear.value)
})
</script>

<style scoped>
.holiday-calendar {
  max-width: 1400px;
  margin: 0 auto;
}

.summary-card {
  margin-bottom: 24px;
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

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-bar .year-selector {
  margin-bottom: 0;
}

.search-box {
  display: flex;
  align-items: center;
}

.quick-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 8px;
}

.filter-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.filter-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tag:hover {
  transform: translateY(-1px);
}

.filter-tag-highlight {
  animation: pulse-tag 1.5s ease-in-out infinite;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
}

@keyframes pulse-tag {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.filter-badge {
  margin-left: 4px;
}

.changes-summary {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #fbc4c4;
}

.changes-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.changes-title {
  font-size: 14px;
  font-weight: 600;
  color: #f56c6c;
  flex: 1;
}

.changes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.change-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.change-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #f56c6c;
}

.change-name {
  font-weight: 600;
  color: #303133;
  font-size: 13px;
}

.change-tag {
  font-weight: 600;
}

.change-date {
  font-size: 12px;
  color: #909399;
}

.overview-card {
  margin-bottom: 24px;
}

.overview-card .card-header {
  justify-content: space-between;
}

.overview-name {
  display: flex;
  justify-content: center;
}

.overview-month {
  font-size: 16px;
  font-weight: 600;
  color: #165DFF;
}

.overview-workdays {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f56c6c;
  font-size: 13px;
  font-weight: 500;
}

.overview-none {
  color: #909399;
  font-size: 13px;
}

.overview-countdown {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #67c23a;
  font-weight: 600;
}

.overview-today {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #165DFF;
  font-weight: 600;
}

.overview-passed {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.year-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.selector-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.year-quick-btns {
  margin-left: 8px;
}

.quick-nav {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.nav-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
  padding-top: 4px;
}

.nav-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.holiday-list {
  margin-bottom: 24px;
}

.holiday-card {
  margin-bottom: 20px;
  border-radius: 16px;
  transition: all 0.3s;
  overflow: hidden;
  border: none;
}

.holiday-card :deep(.el-card__body) {
  padding: 0;
}

.holiday-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
}

.holiday-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  color: #fff;
  position: relative;
}

.type-tradition .holiday-top {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}

.type-modern .holiday-top {
  background: linear-gradient(135deg, #165DFF 0%, #4080ff 100%);
}

.type-international .holiday-top {
  background: linear-gradient(135deg, #e6a23c 0%, #f0c78a 100%);
}

.holiday-month-day {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.holiday-month-day .month {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.holiday-month-day .day {
  font-size: 48px;
  font-weight: 800;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.holiday-days-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 12px;
}

.holiday-days-badge .days-number {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
}

.holiday-days-badge .days-label {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 2px;
}

.holiday-main {
  padding: 16px 20px;
  background: #fff;
}

.holiday-name {
  margin: 0 0 10px 0;
  font-size: 22px;
  font-weight: 700;
  color: #303133;
}

.holiday-date-range {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: #606266;
  margin: 0;
  font-weight: 500;
}

.holiday-date-range .el-icon {
  color: #165DFF;
}

.holiday-info {
  padding: 0 20px 16px;
  background: #fff;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.info-row.primary {
  background: #ecf5ff;
}

.info-row.warning {
  background: #fef0f0;
}

.info-label {
  font-size: 13px;
  color: #909399;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.info-value {
  font-size: 13px;
  color: #303133;
  font-weight: 600;
  text-align: right;
  flex: 1;
  margin-left: 12px;
}

.info-value.work-days {
  color: #f56c6c;
}

.holiday-footer {
  padding: 0 20px 20px;
  background: #fff;
}

.holiday-tips {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #fdf6ec;
  border-radius: 8px;
  font-size: 13px;
  color: #e6a23c;
  margin-bottom: 12px;
}

.countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-radius: 10px;
  font-size: 14px;
  color: #67c23a;
  font-weight: 500;
}

.countdown b {
  font-size: 22px;
  color: #67c23a;
  margin: 0 4px;
  font-weight: 800;
}

.today-text {
  color: #165DFF;
  font-weight: 700;
  font-size: 15px;
}

.passed-text {
  color: #909399;
}

.stats-card {
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #165DFF;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.compare-tag {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.year-comparison {
  background: linear-gradient(135deg, #fef6e7 0%, #fdf0d5 100%);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #f5dab1;
}

.comparison-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #b88230;
  margin-bottom: 12px;
}

.comparison-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.comparison-item {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

.comparison-label {
  font-size: 12px;
  color: #909399;
  display: block;
  margin-bottom: 4px;
}

.comparison-value-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.comparison-value {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
}

.diff-tag {
  font-weight: 600;
}

.timeline-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.timeline-container {
  position: relative;
}

.timeline-months {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 4px;
  margin-bottom: 12px;
}

.timeline-month {
  text-align: center;
  padding: 8px 4px;
  border-radius: 6px;
  transition: all 0.2s;
  background: #fff;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-month.has-holiday {
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
}

.timeline-month:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.month-label {
  font-size: 11px;
  color: #909399;
  font-weight: 600;
  margin-bottom: 4px;
}

.month-holidays {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
}

.month-holiday-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
}

.month-holiday-dot.type-tradition {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}

.month-holiday-dot.type-modern {
  background: linear-gradient(135deg, #165DFF 0%, #4080ff 100%);
}

.month-holiday-dot.type-international {
  background: linear-gradient(135deg, #e6a23c 0%, #f0c78a 100%);
}

.month-holiday-dot:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dot-day {
  font-size: 9px;
}

.timeline-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 12px;
  color: #606266;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot.type-tradition {
  background: #67c23a;
}

.legend-dot.type-modern {
  background: #165DFF;
}

.legend-dot.type-international {
  background: #e6a23c;
}

.nav-diff-tag {
  margin-left: 4px;
}

.holiday-diff-tag {
  margin-left: 8px;
  vertical-align: middle;
  animation: fadeIn 0.3s ease-in;
}

.days-diff-tag {
  margin-top: 4px;
  animation: fadeIn 0.3s ease-in;
}

.date-diff-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #67c23a;
  margin-top: 8px;
  padding: 6px 10px;
  background: #f0f9eb;
  border-radius: 6px;
  animation: fadeIn 0.3s ease-in;
}

.workdays-diff {
  font-size: 11px;
  color: #909399;
  margin-left: 6px;
  animation: fadeIn 0.3s ease-in;
}

.card-has-change {
  position: relative;
  animation: highlight 0.6s ease-out;
  box-shadow: 0 4px 20px rgba(245, 108, 108, 0.15);
}

.card-has-change::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #67c23a 0%, #165DFF 50%, #e6a23c 100%);
  z-index: 1;
}

.card-has-change::after {
  content: '变';
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.4);
  animation: bounce 1s ease-in-out infinite;
}

@keyframes highlight {
  0% { box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.4), 0 4px 20px rgba(245, 108, 108, 0.15); }
  50% { box-shadow: 0 0 30px 8px rgba(245, 108, 108, 0.2), 0 4px 20px rgba(245, 108, 108, 0.15); }
  100% { box-shadow: 0 0 0 0 rgba(245, 108, 108, 0), 0 4px 20px rgba(245, 108, 108, 0.15); }
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.holiday-list {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.holiday-list.is-transitioning {
  opacity: 0.5;
}

@media (max-width: 768px) {
  .comparison-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .timeline-months {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
