import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/menu',
        name: 'Menu',
        component: () => import('@/views/Menu.vue')
      },
      {
        path: '/system/menu',
        name: 'SystemMenu',
        component: () => import('@/views/Menu.vue')
      },
      {
        path: '/loan-calculator',
        name: 'LoanCalculator',
        component: () => import('@/views/LoanCalculator.vue')
      },
      {
        path: '/random-picker',
        name: 'RandomPicker',
        component: () => import('@/views/RandomPicker.vue')
      },
      {
        path: '/holiday-calendar',
        name: 'HolidayCalendar',
        component: () => import('@/views/HolidayCalendar.vue')
      },
      {
        path: '/word-counter',
        name: 'WordCounter',
        component: () => import('@/views/WordCounter.vue')
      },
      {
        path: '/font-encoder',
        name: 'FontEncoder',
        component: () => import('@/views/FontEncoder.vue')
      },
      {
        path: '/psychology-test',
        name: 'PsychologyTest',
        component: () => import('@/views/PsychologyTest.vue')
      },
      {
        path: '/psychology-test/:id',
        name: 'PsychologyTestTake',
        component: () => import('@/views/PsychologyTestTake.vue')
      },
      {
        path: '/psychology-test/:id/result',
        name: 'PsychologyTestResult',
        component: () => import('@/views/PsychologyTestResult.vue')
      },
      {
        path: '/unit-converter',
        name: 'UnitConverter',
        component: () => import('@/views/UnitConverter.vue')
      },
      {
        path: '/torrent-to-magnet',
        name: 'TorrentToMagnet',
        component: () => import('@/views/TorrentToMagnet.vue')
      },
      {
        path: '/metronome',
        name: 'Metronome',
        component: () => import('@/views/Metronome.vue')
      },
      {
        path: '/pdf-adjuster',
        name: 'PdfAdjuster',
        component: () => import('@/views/PdfAdjuster.vue')
      },
      {
        path: '/holiday-avatar',
        name: 'HolidayAvatarMaker',
        component: () => import('@/views/HolidayAvatarMaker.vue')
      },
      {
        path: '/color-converter',
        name: 'ColorConverter',
        component: () => import('@/views/ColorConverter.vue')
      },
      {
        path: '/image-watermark',
        name: 'ImageWatermark',
        component: () => import('@/views/ImageWatermark.vue')
      },
      {
        path: '/subtitle-puzzle',
        name: 'SubtitlePuzzleMaker',
        component: () => import('@/views/SubtitlePuzzleMaker.vue')
      },
      {
        path: '/partition-calculator',
        name: 'PartitionCalculator',
        component: () => import('@/views/PartitionCalculator.vue')
      },
      {
        path: '/character-splitter',
        name: 'CharacterSplitter',
        component: () => import('@/views/ChineseCharacterSplitter.vue')
      },
      {
        path: '/domain-whois',
        name: 'DomainWhois',
        component: () => import('@/views/DomainWhois.vue')
      },
      {
        path: '/shield-badge',
        name: 'ShieldBadgeGenerator',
        component: () => import('@/views/ShieldBadgeGenerator.vue')
      },
      {
        path: '/text-diff',
        name: 'TextDiff',
        component: () => import('@/views/TextDiff.vue')
      },
      {
        path: '/linux-command',
        name: 'LinuxCommand',
        component: () => import('@/views/LinuxCommandHelper.vue')
      },
      {
        path: '/idiom-query',
        name: 'IdiomQuery',
        component: () => import('@/views/IdiomQuery.vue')
      },
      {
        path: '/nine-grid-cutter',
        name: 'NineGridCutter',
        component: () => import('@/views/NineGridCutter.vue')
      },
      {
        path: '/number-to-chinese',
        name: 'NumberToChinese',
        component: () => import('@/views/NumberToChinese.vue')
      },
      {
        path: '/text-expression-calculator',
        name: 'TextExpressionCalculator',
        component: () => import('@/views/TextExpressionCalculator.vue')
      },
      {
        path: '/http-headers',
        name: 'HttpHeadersChecker',
        component: () => import('@/views/HttpHeadersChecker.vue')
      },
      {
        path: '/cidr-calculator',
        name: 'CidrCalculator',
        component: () => import('@/views/CidrCalculator.vue')
      },
      {
        path: '/random-string',
        name: 'RandomStringGenerator',
        component: () => import('@/views/RandomStringGenerator.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
