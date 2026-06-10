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
      },
      {
        path: '/crx-downloader',
        name: 'CrxDownloader',
        component: () => import('@/views/CrxDownloader.vue')
      },
      {
        path: '/pun-generator',
        name: 'PunGenerator',
        component: () => import('@/views/PunGenerator.vue')
      },
      {
        path: '/food-recommender',
        name: 'FoodRecommender',
        component: () => import('@/views/FoodRecommender.vue')
      },
      {
        path: '/food-recognition',
        name: 'FoodImageRecognition',
        component: () => import('@/views/FoodImageRecognition.vue')
      },
      {
        path: '/file-hash',
        name: 'FileHashCalculator',
        component: () => import('@/views/FileHashCalculator.vue')
      },
      {
        path: '/barcode-generator',
        name: 'BarcodeGenerator',
        component: () => import('@/views/BarcodeGenerator.vue')
      },
      {
        path: '/postal-code-query',
        name: 'PostalCodeQuery',
        component: () => import('@/views/PostalCodeQuery.vue')
      },
      {
        path: '/code-highlighter',
        name: 'CodeHighlighter',
        component: () => import('@/views/CodeHighlighter.vue')
      },
      {
        path: '/string-hex-converter',
        name: 'StringHexConverter',
        component: () => import('@/views/StringHexConverter.vue')
      },
      {
        path: '/placeholder-image',
        name: 'PlaceholderImageGenerator',
        component: () => import('@/views/PlaceholderImageGenerator.vue')
      },
      {
        path: '/js-beautifier',
        name: 'JsCodeBeautifier',
        component: () => import('@/views/JsCodeBeautifier.vue')
      },
      {
        path: '/id-photo-print',
        name: 'IDPhotoPrint',
        component: () => import('@/views/IDPhotoPrint.vue')
      },
      {
        path: '/gif-resizer',
        name: 'GifResizer',
        component: () => import('@/views/GifResizer.vue')
      },
      {
        path: '/date-difference',
        name: 'DateDifferenceCalculator',
        component: () => import('@/views/DateDifferenceCalculator.vue')
      },
      {
        path: '/title-rewriter',
        name: 'TitleRewriter',
        component: () => import('@/views/TitleRewriter.vue')
      },
      {
        path: '/teaching-design',
        name: 'TeachingDesignGenerator',
        component: () => import('@/views/TeachingDesignGenerator.vue')
      },
      {
        path: '/fab-marketing',
        name: 'FabMarketingGenerator',
        component: () => import('@/views/FabMarketingGenerator.vue')
      },
      {
        path: '/image-ocr',
        name: 'ImageOCR',
        component: () => import('@/views/ImageOCR.vue')
      },
      {
        path: '/official-document',
        name: 'OfficialDocumentWriter',
        component: () => import('@/views/OfficialDocumentWriter.vue')
      },
      {
        path: '/viral-copy',
        name: 'ViralCopyGenerator',
        component: () => import('@/views/ViralCopyGenerator.vue')
      },
      {
        path: '/high-eq-reply',
        name: 'HighEQReplyGenerator',
        component: () => import('@/views/HighEQReplyGenerator.vue')
      },
      {
        path: '/english-polisher',
        name: 'EnglishWritingPolisher',
        component: () => import('@/views/EnglishWritingPolisher.vue')
      },
      {
        path: '/copywriting-creator',
        name: 'CopywritingCreator',
        component: () => import('@/views/CopywritingCreator.vue')
      },
      {
        path: '/historical-storyteller',
        name: 'HistoricalStoryteller',
        component: () => import('@/views/HistoricalStoryteller.vue')
      },
      {
        path: '/word-guess-game',
        name: 'WordGuessGame',
        component: () => import('@/views/WordGuessGame.vue')
      },
      {
        path: '/english-speaking',
        name: 'EnglishSpeakingPractice',
        component: () => import('@/views/EnglishSpeakingPractice.vue')
      },
      {
        path: '/essay-generator',
        name: 'EssayGenerator',
        component: () => import('@/views/EssayGenerator.vue')
      },
      {
        path: '/daily-psychology',
        name: 'DailyPsychology',
        component: () => import('@/views/DailyPsychology.vue')
      },
      {
        path: '/fitness-plan',
        name: 'FitnessPlanGenerator',
        component: () => import('@/views/FitnessPlanGenerator.vue')
      },
      {
        path: '/social-scenario',
        name: 'SocialScenarioSimulator',
        component: () => import('@/views/SocialScenarioSimulator.vue')
      },
      {
        path: '/plant-identifier',
        name: 'PlantIdentifier',
        component: () => import('@/views/PlantIdentifier.vue')
      },
      {
        path: '/ancient-wisdom',
        name: 'AncientWisdomAdvisor',
        component: () => import('@/views/AncientWisdomAdvisor.vue')
      },
      {
        path: '/car-knowledge',
        name: 'CarKnowledgeAdvisor',
        component: () => import('@/views/CarKnowledgeAdvisor.vue')
      },
      {
        path: '/photo-critique',
        name: 'PhotoCritique',
        component: () => import('@/views/PhotoCritique.vue')
      },
      {
        path: '/programming-qna',
        name: 'ProgrammingQna',
        component: () => import('@/views/ProgrammingQna.vue')
      },
      {
        path: '/brand-logo',
        name: 'BrandLogoGenerator',
        component: () => import('@/views/BrandLogoGenerator.vue')
      },
      {
        path: '/nature-sound',
        name: 'NatureSoundPlayer',
        component: () => import('@/views/NatureSoundPlayer.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
