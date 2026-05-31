import { Holiday } from './holiday.entity';

export const holidayData: Omit<Holiday, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    year: 2020, name: '元旦', dateRange: '1月1日 - 1月1日', holidayPeriod: '1月1日（星期三）',
    days: 1, workDays: [], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Calendar', tips: '新的一年开始了！', startDate: '2020-01-01', endDate: '2020-01-01',
    month: 1, startDay: 1
  },
  {
    year: 2020, name: '春节', dateRange: '1月24日 - 1月30日', holidayPeriod: '1月24日至1月30日（共7天）',
    days: 7, workDays: ['1月19日（周日）', '2月1日（周六）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Present', tips: '除夕在1月24日，记得吃年夜饭！', startDate: '2020-01-24', endDate: '2020-01-30',
    month: 1, startDay: 24
  },
  {
    year: 2020, name: '清明节', dateRange: '4月4日 - 4月6日', holidayPeriod: '4月4日至4月6日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '踏青祭扫，缅怀先人', startDate: '2020-04-04', endDate: '2020-04-06',
    month: 4, startDay: 4
  },
  {
    year: 2020, name: '劳动节', dateRange: '5月1日 - 5月5日', holidayPeriod: '5月1日至5月5日（共5天）',
    days: 5, workDays: ['4月26日（周日）', '5月9日（周六）'], type: 'international', typeText: '国际假日', tagType: 'warning',
    icon: 'Tickets', tips: '可拼9天长假', startDate: '2020-05-01', endDate: '2020-05-05',
    month: 5, startDay: 1
  },
  {
    year: 2020, name: '端午节', dateRange: '6月25日 - 6月27日', holidayPeriod: '6月25日至6月27日（共3天）',
    days: 3, workDays: ['6月28日（周日）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '吃粽子、赛龙舟', startDate: '2020-06-25', endDate: '2020-06-27',
    month: 6, startDay: 25
  },
  {
    year: 2020, name: '国庆节', dateRange: '10月1日 - 10月8日', holidayPeriod: '10月1日至10月8日（共8天）',
    days: 8, workDays: ['9月27日（周日）', '10月10日（周六）'], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Present', tips: '国庆中秋连休8天', startDate: '2020-10-01', endDate: '2020-10-08',
    month: 10, startDay: 1
  },
  {
    year: 2021, name: '元旦', dateRange: '1月1日 - 1月3日', holidayPeriod: '1月1日至1月3日（共3天）',
    days: 3, workDays: [], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Calendar', tips: '与周末连休，无需调休', startDate: '2021-01-01', endDate: '2021-01-03',
    month: 1, startDay: 1
  },
  {
    year: 2021, name: '春节', dateRange: '2月11日 - 2月17日', holidayPeriod: '2月11日至2月17日（共7天）',
    days: 7, workDays: ['2月7日（周日）', '2月20日（周六）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Present', tips: '除夕在2月11日，阖家团圆', startDate: '2021-02-11', endDate: '2021-02-17',
    month: 2, startDay: 11
  },
  {
    year: 2021, name: '清明节', dateRange: '4月3日 - 4月5日', holidayPeriod: '4月3日至4月5日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '清明踏青，缅怀先人', startDate: '2021-04-03', endDate: '2021-04-05',
    month: 4, startDay: 3
  },
  {
    year: 2021, name: '劳动节', dateRange: '5月1日 - 5月5日', holidayPeriod: '5月1日至5月5日（共5天）',
    days: 5, workDays: ['4月25日（周日）', '5月8日（周六）'], type: 'international', typeText: '国际假日', tagType: 'warning',
    icon: 'Tickets', tips: '请4天休9天长假', startDate: '2021-05-01', endDate: '2021-05-05',
    month: 5, startDay: 1
  },
  {
    year: 2021, name: '端午节', dateRange: '6月12日 - 6月14日', holidayPeriod: '6月12日至6月14日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '端午安康', startDate: '2021-06-12', endDate: '2021-06-14',
    month: 6, startDay: 12
  },
  {
    year: 2021, name: '中秋节', dateRange: '9月19日 - 9月21日', holidayPeriod: '9月19日至9月21日（共3天）',
    days: 3, workDays: ['9月18日（周六）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '花好月圆，阖家团圆', startDate: '2021-09-19', endDate: '2021-09-21',
    month: 9, startDay: 19
  },
  {
    year: 2021, name: '国庆节', dateRange: '10月1日 - 10月7日', holidayPeriod: '10月1日至10月7日（共7天）',
    days: 7, workDays: ['9月26日（周日）', '10月9日（周六）'], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Present', tips: '请3天休11天超长假期', startDate: '2021-10-01', endDate: '2021-10-07',
    month: 10, startDay: 1
  },
  {
    year: 2022, name: '元旦', dateRange: '1月1日 - 1月3日', holidayPeriod: '1月1日至1月3日（共3天）',
    days: 3, workDays: [], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Calendar', tips: '与周末连休，无需调休', startDate: '2022-01-01', endDate: '2022-01-03',
    month: 1, startDay: 1
  },
  {
    year: 2022, name: '春节', dateRange: '1月31日 - 2月6日', holidayPeriod: '1月31日至2月6日（共7天）',
    days: 7, workDays: ['1月29日（周六）', '1月30日（周日）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Present', tips: '除夕在1月31日', startDate: '2022-01-31', endDate: '2022-02-06',
    month: 1, startDay: 31
  },
  {
    year: 2022, name: '清明节', dateRange: '4月3日 - 4月5日', holidayPeriod: '4月3日至4月5日（共3天）',
    days: 3, workDays: ['4月2日（周六）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '清明踏青，缅怀先人', startDate: '2022-04-03', endDate: '2022-04-05',
    month: 4, startDay: 3
  },
  {
    year: 2022, name: '劳动节', dateRange: '4月30日 - 5月4日', holidayPeriod: '4月30日至5月4日（共5天）',
    days: 5, workDays: ['4月24日（周日）', '5月7日（周六）'], type: 'international', typeText: '国际假日', tagType: 'warning',
    icon: 'Tickets', tips: '请4天休9天长假', startDate: '2022-04-30', endDate: '2022-05-04',
    month: 4, startDay: 30
  },
  {
    year: 2022, name: '端午节', dateRange: '6月3日 - 6月5日', holidayPeriod: '6月3日至6月5日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '端午安康', startDate: '2022-06-03', endDate: '2022-06-05',
    month: 6, startDay: 3
  },
  {
    year: 2022, name: '中秋节', dateRange: '9月10日 - 9月12日', holidayPeriod: '9月10日至9月12日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '花好月圆，阖家团圆', startDate: '2022-09-10', endDate: '2022-09-12',
    month: 9, startDay: 10
  },
  {
    year: 2022, name: '国庆节', dateRange: '10月1日 - 10月7日', holidayPeriod: '10月1日至10月7日（共7天）',
    days: 7, workDays: ['10月8日（周六）', '10月9日（周日）'], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Present', tips: '请3天休11天超长假期', startDate: '2022-10-01', endDate: '2022-10-07',
    month: 10, startDay: 1
  },
  {
    year: 2023, name: '元旦', dateRange: '12月31日 - 1月2日', holidayPeriod: '2022年12月31日至2023年1月2日（共3天）',
    days: 3, workDays: [], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Calendar', tips: '跨年连休', startDate: '2022-12-31', endDate: '2023-01-02',
    month: 1, startDay: 1
  },
  {
    year: 2023, name: '春节', dateRange: '1月21日 - 1月27日', holidayPeriod: '1月21日至1月27日（共7天）',
    days: 7, workDays: ['1月28日（周六）', '1月29日（周日）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Present', tips: '除夕在1月21日，阖家团圆', startDate: '2023-01-21', endDate: '2023-01-27',
    month: 1, startDay: 21
  },
  {
    year: 2023, name: '清明节', dateRange: '4月5日 - 4月5日', holidayPeriod: '4月5日（星期三）',
    days: 1, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '清明踏青，缅怀先人', startDate: '2023-04-05', endDate: '2023-04-05',
    month: 4, startDay: 5
  },
  {
    year: 2023, name: '劳动节', dateRange: '4月29日 - 5月3日', holidayPeriod: '4月29日至5月3日（共5天）',
    days: 5, workDays: ['4月23日（周日）', '5月6日（周六）'], type: 'international', typeText: '国际假日', tagType: 'warning',
    icon: 'Tickets', tips: '请4天休9天长假', startDate: '2023-04-29', endDate: '2023-05-03',
    month: 4, startDay: 29
  },
  {
    year: 2023, name: '端午节', dateRange: '6月22日 - 6月24日', holidayPeriod: '6月22日至6月24日（共3天）',
    days: 3, workDays: ['6月25日（周日）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '端午安康', startDate: '2023-06-22', endDate: '2023-06-24',
    month: 6, startDay: 22
  },
  {
    year: 2023, name: '中秋节', dateRange: '9月29日 - 10月6日', holidayPeriod: '9月29日至10月6日（共8天）',
    days: 8, workDays: ['10月7日（周六）', '10月8日（周日）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '中秋国庆连休8天', startDate: '2023-09-29', endDate: '2023-10-06',
    month: 9, startDay: 29
  },
  {
    year: 2023, name: '国庆节', dateRange: '10月1日 - 10月7日', holidayPeriod: '10月1日至10月7日（共7天）',
    days: 7, workDays: ['10月7日（周六）', '10月8日（周日）'], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Present', tips: '与中秋节连休', startDate: '2023-10-01', endDate: '2023-10-07',
    month: 10, startDay: 1
  },
  {
    year: 2024, name: '元旦', dateRange: '1月1日 - 1月1日', holidayPeriod: '1月1日（星期一）',
    days: 1, workDays: [], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Calendar', tips: '新的一年开始了！', startDate: '2024-01-01', endDate: '2024-01-01',
    month: 1, startDay: 1
  },
  {
    year: 2024, name: '春节', dateRange: '2月10日 - 2月17日', holidayPeriod: '2月10日至2月17日（共8天）',
    days: 8, workDays: ['2月4日（周日）', '2月18日（周日）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Present', tips: '除夕在2月9日，共8天假期', startDate: '2024-02-10', endDate: '2024-02-17',
    month: 2, startDay: 10
  },
  {
    year: 2024, name: '清明节', dateRange: '4月4日 - 4月6日', holidayPeriod: '4月4日至4月6日（共3天）',
    days: 3, workDays: ['4月7日（周日）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '清明踏青，缅怀先人', startDate: '2024-04-04', endDate: '2024-04-06',
    month: 4, startDay: 4
  },
  {
    year: 2024, name: '劳动节', dateRange: '5月1日 - 5月5日', holidayPeriod: '5月1日至5月5日（共5天）',
    days: 5, workDays: ['4月28日（周日）', '5月11日（周六）'], type: 'international', typeText: '国际假日', tagType: 'warning',
    icon: 'Tickets', tips: '请4天休9天长假', startDate: '2024-05-01', endDate: '2024-05-05',
    month: 5, startDay: 1
  },
  {
    year: 2024, name: '端午节', dateRange: '6月10日 - 6月10日', holidayPeriod: '6月10日（星期一）',
    days: 1, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '端午安康', startDate: '2024-06-10', endDate: '2024-06-10',
    month: 6, startDay: 10
  },
  {
    year: 2024, name: '中秋节', dateRange: '9月15日 - 9月17日', holidayPeriod: '9月15日至9月17日（共3天）',
    days: 3, workDays: ['9月14日（周六）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '花好月圆，阖家团圆', startDate: '2024-09-15', endDate: '2024-09-17',
    month: 9, startDay: 15
  },
  {
    year: 2024, name: '国庆节', dateRange: '10月1日 - 10月7日', holidayPeriod: '10月1日至10月7日（共7天）',
    days: 7, workDays: ['9月29日（周日）', '10月12日（周六）'], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Present', tips: '请3天休11天超长假期', startDate: '2024-10-01', endDate: '2024-10-07',
    month: 10, startDay: 1
  },
  {
    year: 2025, name: '元旦', dateRange: '1月1日 - 1月1日', holidayPeriod: '1月1日（星期三）',
    days: 1, workDays: [], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Calendar', tips: '新的一年开始了！', startDate: '2025-01-01', endDate: '2025-01-01',
    month: 1, startDay: 1
  },
  {
    year: 2025, name: '春节', dateRange: '1月29日 - 2月4日', holidayPeriod: '1月29日至2月4日（共7天）',
    days: 7, workDays: ['1月26日（周日）', '2月8日（周六）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Present', tips: '除夕在1月28日，记得吃年夜饭！', startDate: '2025-01-29', endDate: '2025-02-04',
    month: 1, startDay: 29
  },
  {
    year: 2025, name: '清明节', dateRange: '4月4日 - 4月6日', holidayPeriod: '4月4日至4月6日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '踏青祭扫，缅怀先人', startDate: '2025-04-04', endDate: '2025-04-06',
    month: 4, startDay: 4
  },
  {
    year: 2025, name: '劳动节', dateRange: '5月1日 - 5月5日', holidayPeriod: '5月1日至5月5日（共5天）',
    days: 5, workDays: ['4月27日（周日）', '5月10日（周六）'], type: 'international', typeText: '国际假日', tagType: 'warning',
    icon: 'Tickets', tips: '可拼9天长假（4.27-4.30请假4天）', startDate: '2025-05-01', endDate: '2025-05-05',
    month: 5, startDay: 1
  },
  {
    year: 2025, name: '端午节', dateRange: '5月31日 - 6月2日', holidayPeriod: '5月31日至6月2日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '吃粽子、赛龙舟', startDate: '2025-05-31', endDate: '2025-06-02',
    month: 5, startDay: 31
  },
  {
    year: 2025, name: '中秋节', dateRange: '10月6日 - 10月8日', holidayPeriod: '10月6日至10月8日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '与国庆节连休，共11天超长假期', startDate: '2025-10-06', endDate: '2025-10-08',
    month: 10, startDay: 6
  },
  {
    year: 2025, name: '国庆节', dateRange: '10月1日 - 10月7日', holidayPeriod: '10月1日至10月7日（共7天）',
    days: 7, workDays: ['9月28日（周日）', '10月11日（周六）'], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Present', tips: '与中秋节连休，可安排长途旅行', startDate: '2025-10-01', endDate: '2025-10-07',
    month: 10, startDay: 1
  },
  {
    year: 2026, name: '元旦', dateRange: '1月1日 - 1月3日', holidayPeriod: '1月1日至1月3日（共3天）',
    days: 3, workDays: [], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Calendar', tips: '与周末连休，无需调休', startDate: '2026-01-01', endDate: '2026-01-03',
    month: 1, startDay: 1
  },
  {
    year: 2026, name: '春节', dateRange: '2月17日 - 2月23日', holidayPeriod: '2月17日至2月23日（共7天）',
    days: 7, workDays: ['2月15日（周六）', '2月28日（周六）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Present', tips: '除夕在2月16日，一年中最重要的节日', startDate: '2026-02-17', endDate: '2026-02-23',
    month: 2, startDay: 17
  },
  {
    year: 2026, name: '清明节', dateRange: '4月4日 - 4月6日', holidayPeriod: '4月4日至4月6日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '清明时节雨纷纷，踏青祭祖正当时', startDate: '2026-04-04', endDate: '2026-04-06',
    month: 4, startDay: 4
  },
  {
    year: 2026, name: '劳动节', dateRange: '5月1日 - 5月5日', holidayPeriod: '5月1日至5月5日（共5天）',
    days: 5, workDays: ['4月26日（周日）', '5月9日（周六）'], type: 'international', typeText: '国际假日', tagType: 'warning',
    icon: 'Tickets', tips: '请4天（5.6-5.9）休10天', startDate: '2026-05-01', endDate: '2026-05-05',
    month: 5, startDay: 1
  },
  {
    year: 2026, name: '端午节', dateRange: '6月19日 - 6月21日', holidayPeriod: '6月19日至6月21日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '纪念屈原，品尝粽子', startDate: '2026-06-19', endDate: '2026-06-21',
    month: 6, startDay: 19
  },
  {
    year: 2026, name: '中秋节', dateRange: '9月25日 - 9月27日', holidayPeriod: '9月25日至9月27日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '花好月圆，阖家团圆', startDate: '2026-09-25', endDate: '2026-09-27',
    month: 9, startDay: 25
  },
  {
    year: 2026, name: '国庆节', dateRange: '10月1日 - 10月7日', holidayPeriod: '10月1日至10月7日（共7天）',
    days: 7, workDays: ['9月27日（周日）', '10月10日（周六）'], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Present', tips: '请3天（9.28-9.30）休11天', startDate: '2026-10-01', endDate: '2026-10-07',
    month: 10, startDay: 1
  },
  {
    year: 2027, name: '元旦', dateRange: '1月1日 - 1月3日', holidayPeriod: '1月1日至1月3日（共3天）',
    days: 3, workDays: [], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Calendar', tips: '与周末连休，无需调休', startDate: '2027-01-01', endDate: '2027-01-03',
    month: 1, startDay: 1
  },
  {
    year: 2027, name: '春节', dateRange: '2月6日 - 2月12日', holidayPeriod: '2月6日至2月12日（共7天）',
    days: 7, workDays: ['2月4日（周四）', '2月20日（周六）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Present', tips: '除夕在2月5日，阖家团圆', startDate: '2027-02-06', endDate: '2027-02-12',
    month: 2, startDay: 6
  },
  {
    year: 2027, name: '清明节', dateRange: '4月3日 - 4月5日', holidayPeriod: '4月3日至4月5日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '清明踏青，缅怀先人', startDate: '2027-04-03', endDate: '2027-04-05',
    month: 4, startDay: 3
  },
  {
    year: 2027, name: '劳动节', dateRange: '5月1日 - 5月5日', holidayPeriod: '5月1日至5月5日（共5天）',
    days: 5, workDays: ['4月25日（周日）', '5月8日（周六）'], type: 'international', typeText: '国际假日', tagType: 'warning',
    icon: 'Tickets', tips: '请4天休9天长假', startDate: '2027-05-01', endDate: '2027-05-05',
    month: 5, startDay: 1
  },
  {
    year: 2027, name: '端午节', dateRange: '6月8日 - 6月10日', holidayPeriod: '6月8日至6月10日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '端午安康', startDate: '2027-06-08', endDate: '2027-06-10',
    month: 6, startDay: 8
  },
  {
    year: 2027, name: '中秋节', dateRange: '9月15日 - 9月17日', holidayPeriod: '9月15日至9月17日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '中秋赏月，阖家团圆', startDate: '2027-09-15', endDate: '2027-09-17',
    month: 9, startDay: 15
  },
  {
    year: 2027, name: '国庆节', dateRange: '10月1日 - 10月7日', holidayPeriod: '10月1日至10月7日（共7天）',
    days: 7, workDays: ['9月26日（周日）', '10月9日（周六）'], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Present', tips: '请3天休11天超长假期', startDate: '2027-10-01', endDate: '2027-10-07',
    month: 10, startDay: 1
  },
  {
    year: 2028, name: '元旦', dateRange: '1月1日 - 1月3日', holidayPeriod: '1月1日至1月3日（共3天）',
    days: 3, workDays: [], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Calendar', tips: '与周末连休，无需调休', startDate: '2028-01-01', endDate: '2028-01-03',
    month: 1, startDay: 1
  },
  {
    year: 2028, name: '春节', dateRange: '1月26日 - 2月2日', holidayPeriod: '1月26日至2月2日（共8天）',
    days: 8, workDays: ['1月23日（周六）', '2月6日（周六）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Present', tips: '除夕在1月25日，共8天假期', startDate: '2028-01-26', endDate: '2028-02-02',
    month: 1, startDay: 26
  },
  {
    year: 2028, name: '清明节', dateRange: '4月2日 - 4月4日', holidayPeriod: '4月2日至4月4日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '清明踏青，缅怀先人', startDate: '2028-04-02', endDate: '2028-04-04',
    month: 4, startDay: 2
  },
  {
    year: 2028, name: '劳动节', dateRange: '5月1日 - 5月5日', holidayPeriod: '5月1日至5月5日（共5天）',
    days: 5, workDays: ['4月30日（周日）', '5月13日（周六）'], type: 'international', typeText: '国际假日', tagType: 'warning',
    icon: 'Tickets', tips: '请4天休9天长假', startDate: '2028-05-01', endDate: '2028-05-05',
    month: 5, startDay: 1
  },
  {
    year: 2028, name: '端午节', dateRange: '5月28日 - 5月30日', holidayPeriod: '5月28日至5月30日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '端午安康', startDate: '2028-05-28', endDate: '2028-05-30',
    month: 5, startDay: 28
  },
  {
    year: 2028, name: '中秋节', dateRange: '10月3日 - 10月5日', holidayPeriod: '10月3日至10月5日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '与国庆节连休', startDate: '2028-10-03', endDate: '2028-10-05',
    month: 10, startDay: 3
  },
  {
    year: 2028, name: '国庆节', dateRange: '10月1日 - 10月7日', holidayPeriod: '10月1日至10月7日（共7天）',
    days: 7, workDays: ['9月30日（周六）', '10月8日（周日）'], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Present', tips: '与中秋节连休，共10天假期', startDate: '2028-10-01', endDate: '2028-10-07',
    month: 10, startDay: 1
  },
  {
    year: 2029, name: '元旦', dateRange: '1月1日 - 1月1日', holidayPeriod: '1月1日（星期一）',
    days: 1, workDays: [], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Calendar', tips: '新的一年开始了！', startDate: '2029-01-01', endDate: '2029-01-01',
    month: 1, startDay: 1
  },
  {
    year: 2029, name: '春节', dateRange: '2月13日 - 2月19日', holidayPeriod: '2月13日至2月19日（共7天）',
    days: 7, workDays: ['2月11日（周六）', '2月24日（周日）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Present', tips: '除夕在2月12日，阖家团圆', startDate: '2029-02-13', endDate: '2029-02-19',
    month: 2, startDay: 13
  },
  {
    year: 2029, name: '清明节', dateRange: '4月4日 - 4月6日', holidayPeriod: '4月4日至4月6日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '清明踏青，缅怀先人', startDate: '2029-04-04', endDate: '2029-04-06',
    month: 4, startDay: 4
  },
  {
    year: 2029, name: '劳动节', dateRange: '5月1日 - 5月5日', holidayPeriod: '5月1日至5月5日（共5天）',
    days: 5, workDays: ['4月29日（周日）', '5月12日（周六）'], type: 'international', typeText: '国际假日', tagType: 'warning',
    icon: 'Tickets', tips: '请4天休9天长假', startDate: '2029-05-01', endDate: '2029-05-05',
    month: 5, startDay: 1
  },
  {
    year: 2029, name: '端午节', dateRange: '6月16日 - 6月18日', holidayPeriod: '6月16日至6月18日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '端午安康', startDate: '2029-06-16', endDate: '2029-06-18',
    month: 6, startDay: 16
  },
  {
    year: 2029, name: '中秋节', dateRange: '9月22日 - 9月24日', holidayPeriod: '9月22日至9月24日（共3天）',
    days: 3, workDays: ['9月29日（周日）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '花好月圆，阖家团圆', startDate: '2029-09-22', endDate: '2029-09-24',
    month: 9, startDay: 22
  },
  {
    year: 2029, name: '国庆节', dateRange: '10月1日 - 10月7日', holidayPeriod: '10月1日至10月7日（共7天）',
    days: 7, workDays: ['9月29日（周日）', '10月12日（周六）'], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Present', tips: '请3天休11天超长假期', startDate: '2029-10-01', endDate: '2029-10-07',
    month: 10, startDay: 1
  },
  {
    year: 2030, name: '元旦', dateRange: '1月1日 - 1月3日', holidayPeriod: '1月1日至1月3日（共3天）',
    days: 3, workDays: [], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Calendar', tips: '与周末连休，无需调休', startDate: '2030-01-01', endDate: '2030-01-03',
    month: 1, startDay: 1
  },
  {
    year: 2030, name: '春节', dateRange: '2月3日 - 2月9日', holidayPeriod: '2月3日至2月9日（共7天）',
    days: 7, workDays: ['2月2日（周六）', '2月16日（周六）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Present', tips: '除夕在2月2日，阖家团圆', startDate: '2030-02-03', endDate: '2030-02-09',
    month: 2, startDay: 3
  },
  {
    year: 2030, name: '清明节', dateRange: '4月5日 - 4月7日', holidayPeriod: '4月5日至4月7日（共3天）',
    days: 3, workDays: ['4月1日（周二）'], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '清明踏青，缅怀先人', startDate: '2030-04-05', endDate: '2030-04-07',
    month: 4, startDay: 5
  },
  {
    year: 2030, name: '劳动节', dateRange: '5月1日 - 5月5日', holidayPeriod: '5月1日至5月5日（共5天）',
    days: 5, workDays: ['4月28日（周日）', '5月11日（周六）'], type: 'international', typeText: '国际假日', tagType: 'warning',
    icon: 'Tickets', tips: '请4天休9天长假', startDate: '2030-05-01', endDate: '2030-05-05',
    month: 5, startDay: 1
  },
  {
    year: 2030, name: '端午节', dateRange: '6月5日 - 6月7日', holidayPeriod: '6月5日至6月7日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '端午安康', startDate: '2030-06-05', endDate: '2030-06-07',
    month: 6, startDay: 5
  },
  {
    year: 2030, name: '中秋节', dateRange: '9月12日 - 9月14日', holidayPeriod: '9月12日至9月14日（共3天）',
    days: 3, workDays: [], type: 'tradition', typeText: '传统节日', tagType: 'success',
    icon: 'Calendar', tips: '花好月圆，阖家团圆', startDate: '2030-09-12', endDate: '2030-09-14',
    month: 9, startDay: 12
  },
  {
    year: 2030, name: '国庆节', dateRange: '10月1日 - 10月7日', holidayPeriod: '10月1日至10月7日（共7天）',
    days: 7, workDays: ['9月29日（周日）', '10月12日（周六）'], type: 'modern', typeText: '法定假日', tagType: 'primary',
    icon: 'Present', tips: '请3天休11天超长假期', startDate: '2030-10-01', endDate: '2030-10-07',
    month: 10, startDay: 1
  }
];
