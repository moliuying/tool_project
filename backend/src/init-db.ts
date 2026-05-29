import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Menu } from './menu/menu.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const dataSource = app.get(DataSource);
  const menuRepository = dataSource.getRepository(Menu);
  const count = await menuRepository.count();

  if (count === 0) {
    const menus = [
      { name: '首页', path: '/', icon: 'Home', parentId: null, sort: 1, component: 'views/Home.vue' },
      { name: 'JavaScript 工具', path: '/js-tool', icon: 'Files', parentId: null, sort: 2, component: 'views/JsTool.vue' },
      { name: '系统管理', path: '/system', icon: 'Setting', parentId: null, sort: 3, component: null },
      { name: '菜单管理', path: '/system/menu', icon: 'Menu', parentId: 3, sort: 1, component: 'views/Menu.vue' },
    ];

    for (const menu of menus) {
      const entity = menuRepository.create(menu);
      await menuRepository.save(entity);
    }

    console.log('Initial menu data has been inserted.');
  } else {
    console.log('Menu data already exists, skipping initialization.');
  }

  await app.close();
  process.exit(0);
}

bootstrap();
