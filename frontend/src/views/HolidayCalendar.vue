<template>
  <div class="holiday-calendar">
    <el-card class="summary-card">
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
          <el-button-group>
            <el-button 
              v-for="year in yearOptions" 
              :key="year" 
              :type="currentYear === year ? 'primary' : 'default'"
              @click="currentYear = year"
            >
              {{ year }}年
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
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="holiday in filteredHolidays" :key="holiday.id" :id="holiday.id">
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
import { ref, computed, watch } from 'vue'
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
  Bottom
} from '@element-plus/icons-vue'

interface Holiday {
  id: string
  name: string
  dateRange: string
  holidayPeriod: string
  days: number
  workDays: string[]
  type: 'tradition' | 'modern' | 'international'
  typeText: string
  tagType: 'success' | 'primary' | 'warning'
  icon: string
  tips: string
  startDate: Date
  endDate: Date
  countdown: number | null
  month: number
  startDay: number
}

const currentYear = ref(2026)
const yearOptions = [2025, 2026, 2027]
const searchKeyword = ref('')
const activeType = ref('')
const showOverview = ref(true)

const typeFilters = [
  { label: '全部', value: '' },
  { label: '传统节日', value: 'tradition' },
  { label: '法定假日', value: 'modern' },
  { label: '国际假日', value: 'international' },
  { label: '长假（7天）', value: 'long' },
  { label: '即将到来', value: 'upcoming' }
]

const holidayData: Record<number, Omit<Holiday, 'countdown'>[]> = {
  2025: [
    {
      id: 'newyear-2025',
      name: '元旦',
      dateRange: '1月1日 - 1月1日',
      holidayPeriod: '1月1日（星期三）',
      days: 1,
      workDays: [],
      type: 'modern',
      typeText: '法定假日',
      tagType: 'primary',
      icon: 'Calendar',
      tips: '新的一年开始了！',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-01')
    },
    {
      id: 'spring-2025',
      name: '春节',
      dateRange: '1月29日 - 2月4日',
      holidayPeriod: '1月29日至2月4日（共7天）',
      days: 7,
      workDays: ['1月26日（周日）', '2月8日（周六）'],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Present',
      tips: '除夕在1月28日，记得吃年夜饭！',
      startDate: new Date('2025-01-29'),
      endDate: new Date('2025-02-04')
    },
    {
      id: 'qingming-2025',
      name: '清明节',
      dateRange: '4月4日 - 4月6日',
      holidayPeriod: '4月4日至4月6日（共3天）',
      days: 3,
      workDays: [],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Calendar',
      tips: '踏青祭扫，缅怀先人',
      startDate: new Date('2025-04-04'),
      endDate: new Date('2025-04-06')
    },
    {
      id: 'labour-2025',
      name: '劳动节',
      dateRange: '5月1日 - 5月5日',
      holidayPeriod: '5月1日至5月5日（共5天）',
      days: 5,
      workDays: ['4月27日（周日）', '5月10日（周六）'],
      type: 'international',
      typeText: '国际假日',
      tagType: 'warning',
      icon: 'Tickets',
      tips: '可拼9天长假（4.27-4.30请假4天）',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-05')
    },
    {
      id: 'dragon-2025',
      name: '端午节',
      dateRange: '5月31日 - 6月2日',
      holidayPeriod: '5月31日至6月2日（共3天）',
      days: 3,
      workDays: [],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Calendar',
      tips: '吃粽子、赛龙舟',
      startDate: new Date('2025-05-31'),
      endDate: new Date('2025-06-02')
    },
    {
      id: 'midautumn-2025',
      name: '中秋节',
      dateRange: '10月6日 - 10月8日',
      holidayPeriod: '10月6日至10月8日（共3天）',
      days: 3,
      workDays: [],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Calendar',
      tips: '与国庆节连休，共11天超长假期',
      startDate: new Date('2025-10-06'),
      endDate: new Date('2025-10-08')
    },
    {
      id: 'national-2025',
      name: '国庆节',
      dateRange: '10月1日 - 10月7日',
      holidayPeriod: '10月1日至10月7日（共7天）',
      days: 7,
      workDays: ['9月28日（周日）', '10月11日（周六）'],
      type: 'modern',
      typeText: '法定假日',
      tagType: 'primary',
      icon: 'Present',
      tips: '与中秋节连休，可安排长途旅行',
      startDate: new Date('2025-10-01'),
      endDate: new Date('2025-10-07')
    }
  ],
  2026: [
    {
      id: 'newyear-2026',
      name: '元旦',
      dateRange: '1月1日 - 1月3日',
      holidayPeriod: '1月1日至1月3日（共3天）',
      days: 3,
      workDays: [],
      type: 'modern',
      typeText: '法定假日',
      tagType: 'primary',
      icon: 'Calendar',
      tips: '与周末连休，无需调休',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-03')
    },
    {
      id: 'spring-2026',
      name: '春节',
      dateRange: '2月17日 - 2月23日',
      holidayPeriod: '2月17日至2月23日（共7天）',
      days: 7,
      workDays: ['2月15日（周六）', '2月28日（周六）'],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Present',
      tips: '除夕在2月16日，一年中最重要的节日',
      startDate: new Date('2026-02-17'),
      endDate: new Date('2026-02-23')
    },
    {
      id: 'qingming-2026',
      name: '清明节',
      dateRange: '4月4日 - 4月6日',
      holidayPeriod: '4月4日至4月6日（共3天）',
      days: 3,
      workDays: [],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Calendar',
      tips: '清明时节雨纷纷，踏青祭祖正当时',
      startDate: new Date('2026-04-04'),
      endDate: new Date('2026-04-06')
    },
    {
      id: 'labour-2026',
      name: '劳动节',
      dateRange: '5月1日 - 5月5日',
      holidayPeriod: '5月1日至5月5日（共5天）',
      days: 5,
      workDays: ['4月26日（周日）', '5月9日（周六）'],
      type: 'international',
      typeText: '国际假日',
      tagType: 'warning',
      icon: 'Tickets',
      tips: '请4天（5.6-5.9）休10天',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-05')
    },
    {
      id: 'dragon-2026',
      name: '端午节',
      dateRange: '6月19日 - 6月21日',
      holidayPeriod: '6月19日至6月21日（共3天）',
      days: 3,
      workDays: [],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Calendar',
      tips: '纪念屈原，品尝粽子',
      startDate: new Date('2026-06-19'),
      endDate: new Date('2026-06-21')
    },
    {
      id: 'midautumn-2026',
      name: '中秋节',
      dateRange: '9月25日 - 9月27日',
      holidayPeriod: '9月25日至9月27日（共3天）',
      days: 3,
      workDays: [],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Calendar',
      tips: '花好月圆，阖家团圆',
      startDate: new Date('2026-09-25'),
      endDate: new Date('2026-09-27')
    },
    {
      id: 'national-2026',
      name: '国庆节',
      dateRange: '10月1日 - 10月7日',
      holidayPeriod: '10月1日至10月7日（共7天）',
      days: 7,
      workDays: ['9月27日（周日）', '10月10日（周六）'],
      type: 'modern',
      typeText: '法定假日',
      tagType: 'primary',
      icon: 'Present',
      tips: '请3天（9.28-9.30）休11天',
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-10-07')
    }
  ],
  2027: [
    {
      id: 'newyear-2027',
      name: '元旦',
      dateRange: '1月1日 - 1月3日',
      holidayPeriod: '1月1日至1月3日（共3天）',
      days: 3,
      workDays: [],
      type: 'modern',
      typeText: '法定假日',
      tagType: 'primary',
      icon: 'Calendar',
      tips: '与周末连休，无需调休',
      startDate: new Date('2027-01-01'),
      endDate: new Date('2027-01-03')
    },
    {
      id: 'spring-2027',
      name: '春节',
      dateRange: '2月6日 - 2月12日',
      holidayPeriod: '2月6日至2月12日（共7天）',
      days: 7,
      workDays: ['2月4日（周四）', '2月20日（周六）'],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Present',
      tips: '除夕在2月5日，阖家团圆',
      startDate: new Date('2027-02-06'),
      endDate: new Date('2027-02-12')
    },
    {
      id: 'qingming-2027',
      name: '清明节',
      dateRange: '4月3日 - 4月5日',
      holidayPeriod: '4月3日至4月5日（共3天）',
      days: 3,
      workDays: [],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Calendar',
      tips: '清明踏青，缅怀先人',
      startDate: new Date('2027-04-03'),
      endDate: new Date('2027-04-05')
    },
    {
      id: 'labour-2027',
      name: '劳动节',
      dateRange: '5月1日 - 5月5日',
      holidayPeriod: '5月1日至5月5日（共5天）',
      days: 5,
      workDays: ['4月25日（周日）', '5月8日（周六）'],
      type: 'international',
      typeText: '国际假日',
      tagType: 'warning',
      icon: 'Tickets',
      tips: '请4天休9天长假',
      startDate: new Date('2027-05-01'),
      endDate: new Date('2027-05-05')
    },
    {
      id: 'dragon-2027',
      name: '端午节',
      dateRange: '6月8日 - 6月10日',
      holidayPeriod: '6月8日至6月10日（共3天）',
      days: 3,
      workDays: [],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Calendar',
      tips: '端午安康',
      startDate: new Date('2027-06-08'),
      endDate: new Date('2027-06-10')
    },
    {
      id: 'midautumn-2027',
      name: '中秋节',
      dateRange: '9月15日 - 9月17日',
      holidayPeriod: '9月15日至9月17日（共3天）',
      days: 3,
      workDays: [],
      type: 'tradition',
      typeText: '传统节日',
      tagType: 'success',
      icon: 'Calendar',
      tips: '中秋赏月，阖家团圆',
      startDate: new Date('2027-09-15'),
      endDate: new Date('2027-09-17')
    },
    {
      id: 'national-2027',
      name: '国庆节',
      dateRange: '10月1日 - 10月7日',
      holidayPeriod: '10月1日至10月7日（共7天）',
      days: 7,
      workDays: ['9月26日（周日）', '10月9日（周六）'],
      type: 'modern',
      typeText: '法定假日',
      tagType: 'primary',
      icon: 'Present',
      tips: '请3天休11天超长假期',
      startDate: new Date('2027-10-01'),
      endDate: new Date('2027-10-07')
    }
  ]
}

const calculateCountdown = (startDate: Date, endDate: Date): number | null => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)
  
  if (today < start) {
    return Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  } else if (today >= start && today <= end) {
    return 0
  } else {
    return -1
  }
}

const holidays = computed<Holiday[]>(() => {
  const data = holidayData[currentYear.value] || holidayData[2026]
  return data.map(h => ({
    ...h,
    countdown: calculateCountdown(h.startDate, h.endDate),
    month: h.startDate.getMonth() + 1,
    startDay: h.startDate.getDate()
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

const scrollToHoliday = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

watch(currentYear, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
