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
      { name: '单位换算', path: '/unit-converter', icon: 'Histogram', parentId: null, sort: 8, component: 'views/UnitConverter.vue' },
      { name: '种子转磁力', path: '/torrent-to-magnet', icon: 'Link', parentId: null, sort: 9, component: 'views/TorrentToMagnet.vue' },
      { name: '节拍练习器', path: '/metronome', icon: 'VideoPlay', parentId: null, sort: 10, component: 'views/Metronome.vue' },
      { name: 'PDF页面调整', path: '/pdf-adjuster', icon: 'Document', parentId: null, sort: 11, component: 'views/PdfAdjuster.vue' },
      { name: '节日头像制作', path: '/holiday-avatar', icon: 'Picture', parentId: null, sort: 12, component: 'views/HolidayAvatarMaker.vue' },
      { name: '颜色空间转换', path: '/color-converter', icon: 'Brush', parentId: null, sort: 13, component: 'views/ColorConverter.vue' },
      { name: '图片水印', path: '/image-watermark', icon: 'Stamp', parentId: null, sort: 14, component: 'views/ImageWatermark.vue' },
      { name: '字幕拼图生成', path: '/subtitle-puzzle', icon: 'Grid', parentId: null, sort: 15, component: 'views/SubtitlePuzzleMaker.vue' },
      { name: '系统管理', path: '/system', icon: 'Setting', parentId: null, sort: 16, component: null },
      { name: '菜单管理', path: '/system/menu', icon: 'Menu', parentId: 16, sort: 1, component: 'views/Menu.vue' },
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
