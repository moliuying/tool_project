import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Menu } from './menu/menu.entity';
import { Holiday } from './holiday/holiday.entity';
import { holidayData } from './holiday/holiday.data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const dataSource = app.get(DataSource);
  const menuRepository = dataSource.getRepository(Menu);
  const menuCount = await menuRepository.count();

  if (menuCount === 0) {
    const menus = [
      { name: '首页', path: '/', icon: 'Home', parentId: null, sort: 1, component: 'views/Home.vue' },
      { name: '贷款试算', path: '/loan-calculator', icon: 'Money', parentId: null, sort: 2, component: 'views/LoanCalculator.vue' },
      { name: '心理自测', path: '/psychology-test', icon: 'Reading', parentId: null, sort: 3, component: 'views/PsychologyTest.vue' },
      { name: '字体编码转换', path: '/font-encoder', icon: 'EditPen', parentId: null, sort: 4, component: 'views/FontEncoder.vue' },
      { name: '节假日查询', path: '/holiday-calendar', icon: 'Calendar', parentId: null, sort: 5, component: 'views/HolidayCalendar.vue' },
      { name: '字数统计', path: '/word-counter', icon: 'Document', parentId: null, sort: 6, component: 'views/WordCounter.vue' },
      { name: '随机选择器', path: '/random-picker', icon: 'Rank', parentId: null, sort: 7, component: 'views/RandomPicker.vue' },
      { name: '随机饮食推荐', path: '/food-recommender', icon: 'KnifeFork', parentId: null, sort: 8, component: 'views/FoodRecommender.vue' },
      { name: '菜品图片识别', path: '/food-recognition', icon: 'Picture', parentId: null, sort: 9, component: 'views/FoodImageRecognition.vue' },
      { name: '单位换算', path: '/unit-converter', icon: 'Histogram', parentId: null, sort: 10, component: 'views/UnitConverter.vue' },
      { name: '种子转磁力', path: '/torrent-to-magnet', icon: 'Link', parentId: null, sort: 11, component: 'views/TorrentToMagnet.vue' },
      { name: '节拍练习器', path: '/metronome', icon: 'VideoPlay', parentId: null, sort: 12, component: 'views/Metronome.vue' },
      { name: 'PDF页面调整', path: '/pdf-adjuster', icon: 'Document', parentId: null, sort: 13, component: 'views/PdfAdjuster.vue' },
      { name: '节日头像制作', path: '/holiday-avatar', icon: 'Picture', parentId: null, sort: 14, component: 'views/HolidayAvatarMaker.vue' },
      { name: '颜色空间转换', path: '/color-converter', icon: 'Brush', parentId: null, sort: 15, component: 'views/ColorConverter.vue' },
      { name: '图片水印', path: '/image-watermark', icon: 'Stamp', parentId: null, sort: 16, component: 'views/ImageWatermark.vue' },
      { name: '字幕拼图生成', path: '/subtitle-puzzle', icon: 'Grid', parentId: null, sort: 17, component: 'views/SubtitlePuzzleMaker.vue' },
      { name: 'Linux命令查询', path: '/linux-command', icon: 'Terminal', parentId: null, sort: 18, component: 'views/LinuxCommandHelper.vue' },
      { name: '成语查询', path: '/idiom-query', icon: 'Reading', parentId: null, sort: 19, component: 'views/IdiomQuery.vue' },
      { name: '九宫格切图', path: '/nine-grid-cutter', icon: 'Grid', parentId: null, sort: 20, component: 'views/NineGridCutter.vue' },
      { name: '数字转中文大写', path: '/number-to-chinese', icon: 'Money', parentId: null, sort: 21, component: 'views/NumberToChinese.vue' },
      { name: '文本表达式计算器', path: '/text-expression-calculator', icon: 'Calculator', parentId: null, sort: 22, component: 'views/TextExpressionCalculator.vue' },
      { name: '分区计算器', path: '/partition-calculator', icon: 'Grid', parentId: null, sort: 23, component: 'views/PartitionCalculator.vue' },
      { name: '汉字拆分', path: '/character-splitter', icon: 'EditPen', parentId: null, sort: 24, component: 'views/ChineseCharacterSplitter.vue' },
      { name: '域名WHOIS查询', path: '/domain-whois', icon: 'Search', parentId: null, sort: 25, component: 'views/DomainWhois.vue' },
      { name: 'HTTP头查询', path: '/http-headers', icon: 'Connection', parentId: null, sort: 26, component: 'views/HttpHeadersChecker.vue' },
      { name: '徽章生成器', path: '/shield-badge', icon: 'Medal', parentId: null, sort: 27, component: 'views/ShieldBadgeGenerator.vue' },
      { name: '文本对比', path: '/text-diff', icon: 'DocumentCopy', parentId: null, sort: 28, component: 'views/TextDiff.vue' },
      { name: 'CIDR网段计算', path: '/cidr-calculator', icon: 'Connection', parentId: null, sort: 29, component: 'views/CidrCalculator.vue' },
      { name: '随机字符串生成', path: '/random-string', icon: 'Key', parentId: null, sort: 30, component: 'views/RandomStringGenerator.vue' },
      { name: '文件哈希计算', path: '/file-hash', icon: 'Key', parentId: null, sort: 31, component: 'views/FileHashCalculator.vue' },
      { name: '条形码生成器', path: '/barcode-generator', icon: 'Grid', parentId: null, sort: 32, component: 'views/BarcodeGenerator.vue' },
      { name: 'GIF动图缩放', path: '/gif-resizer', icon: 'Picture', parentId: null, sort: 33, component: 'views/GifResizer.vue' },
      { name: '邮政编码查询', path: '/postal-code-query', icon: 'Location', parentId: null, sort: 34, component: 'views/PostalCodeQuery.vue' },
      { name: '字符串十六进制互转', path: '/string-hex-converter', icon: 'Switch', parentId: null, sort: 35, component: 'views/StringHexConverter.vue' },
      { name: '占位图生成器', path: '/placeholder-image', icon: 'Picture', parentId: null, sort: 36, component: 'views/PlaceholderImageGenerator.vue' },
      { name: 'JS代码美化', path: '/js-beautifier', icon: 'EditPen', parentId: null, sort: 37, component: 'views/JsCodeBeautifier.vue' },
      { name: '证件照打印排版', path: '/id-photo-print', icon: 'Picture', parentId: null, sort: 38, component: 'views/IDPhotoPrint.vue' },
      { name: '日期差计算', path: '/date-difference', icon: 'Calendar', parentId: null, sort: 39, component: 'views/DateDifferenceCalculator.vue' },
      { name: '教学设计生成', path: '/teaching-design', icon: 'Reading', parentId: null, sort: 40, component: 'views/TeachingDesignGenerator.vue' },
      { name: 'FAB营销文案', path: '/fab-marketing', icon: 'Promotion', parentId: null, sort: 41, component: 'views/FabMarketingGenerator.vue' },
      { name: '爆款文案生成', path: '/viral-copy', icon: 'MagicStick', parentId: null, sort: 42, component: 'views/ViralCopyGenerator.vue' },
      { name: '多类型文案创作', path: '/copywriting-creator', icon: 'EditPen', parentId: null, sort: 43, component: 'views/CopywritingCreator.vue' },
      { name: '社交情境模拟', path: '/social-scenario', icon: 'ChatDotRound', parentId: null, sort: 44, component: 'views/SocialScenarioSimulator.vue' },
      { name: '古人处世智慧', path: '/ancient-wisdom', icon: 'Reading', parentId: null, sort: 45, component: 'views/AncientWisdomAdvisor.vue' },
      { name: '汽车知识咨询', path: '/car-knowledge', icon: 'Van', parentId: null, sort: 46, component: 'views/CarKnowledgeAdvisor.vue' },
      { name: '系统管理', path: '/system', icon: 'Setting', parentId: null, sort: 100, component: null },
      { name: '菜单管理', path: '/system/menu', icon: 'Menu', parentId: 47, sort: 1, component: 'views/Menu.vue' },
    ];

    for (const menu of menus) {
      const entity = menuRepository.create(menu);
      await menuRepository.save(entity);
    }

    console.log('Initial menu data has been inserted.');
  } else {
    console.log('Menu data already exists, skipping initialization.');
  }

  const holidayRepository = dataSource.getRepository(Holiday);
  const holidayCount = await holidayRepository.count();

  if (holidayCount === 0) {
    await holidayRepository.save(holidayData);
    console.log(`Inserted ${holidayData.length} holiday records for years 2020-2030.`);
  } else {
    console.log('Holiday data already exists, skipping initialization.');
  }

  await app.close();
  process.exit(0);
}

bootstrap();
