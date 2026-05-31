import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export interface Holiday {
  id: number
  year: number
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
  startDate: string
  endDate: string
  month: number
  startDay: number
  countdown?: number | null
}

export const holidayApi = {
  getAvailableYears: () => api.get<number[]>('/holiday/years'),
  getHolidaysByYear: (year: number) => api.get<Holiday[]>(`/holiday/year/${year}`),
  getAllHolidays: () => api.get<Holiday[]>('/holiday')
}
