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

      <div class="quick-filter">
        <span class="filter-label">类型筛选：</span>
        <el-tag 
          v-for="filter in typeFilters" 
          :key="filter.value"
          :type="activeType === filter.value ? 'primary' : 'info'"
          size="large"
          class="filter-tag"
          @click="activeType = activeType === filter.value ? '' : filter.value"
        >
          {{ filter.label }}
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

    <el-row :gutter="20" class="holiday-list">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="holiday in filteredHolidays" :key="holiday.id" :id="String(holiday.id)">
        <el-card class="holiday-card" :class="`type-${holiday.type}`" shadow="hover">
          <div class="holiday-top">
            <div class="holiday-month-day">
              <span class="month">{{ holiday.month }}月</span>
              <span class="day">{{ holiday.startDay }}</span>
            </div>
            <div class="holiday-days-badge">
              <span class="days-number">{{ holiday.days }}</span>
              <span class="days-label">天</span>
            </div>
          </div>
          
          <div class="holiday-main">
            <h3 class="holiday-name">{{ holiday.name }}</h3>
            <p class="holiday-date-range">
              <el-icon size="16"><Tickets /></el-icon>
              {{ holiday.dateRange }}
            </p>
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
import { ref, computed, watch, onMounted } from 'vue'
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
  ArrowRight
} from '@element-plus/icons-vue'
import { holidayApi, Holiday } from '../api/holiday'

const thisYear = new Date().getFullYear()
const currentYear = ref(thisYear)
const yearOptions = ref<number[]>([])
const rawHolidays = ref<Holiday[]>([])
const searchKeyword = ref('')
const activeType = ref('')
const showOverview = ref(true)
const loading = ref(false)

const typeFilters = [
  { label: '全部', value: '' },
  { label: '传统节日', value: 'tradition' },
  { label: '法定假日', value: 'modern' },
  { label: '国际假日', value: 'international' },
  { label: '长假（7天）', value: 'long' },
  { label: '即将到来', value: 'upcoming' }
]

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
  try {
    const res = await holidayApi.getHolidaysByYear(year)
    rawHolidays.value = res.data
  } catch (error) {
    console.error('Failed to fetch holidays:', error)
    rawHolidays.value = []
  } finally {
    loading.value = false
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

const filteredHolidays = computed<Holiday[]>(() => {
  let result = [...holidays.value]
  
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
</style>
