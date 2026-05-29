import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Menu } from './menu/menu.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const dataSource = app.get(DataSource);
  const menuRepository = dataSource.getRepository(Menu);

  const allMenus = await menuRepository.find();
  console.log('Current menus:', allMenus.map(m => ({ id: m.id, name: m.name, path: m.path, parentId: m.parentId, component: m.component })));

  const jsBeautifyMenu = await menuRepository.findOne({ where: { path: '/js-tool/beautify' } });
  if (jsBeautifyMenu) {
    await menuRepository.remove(jsBeautifyMenu);
    console.log('Removed JS Beautify submenu');
  }

  const jsToolMenu = await menuRepository.findOne({ where: { path: '/js-tool' } });
  if (jsToolMenu) {
    jsToolMenu.component = 'views/JsTool.vue';
    jsToolMenu.parentId = null;
    await menuRepository.save(jsToolMenu);
    console.log('Updated JavaScript Tool menu to be clickable with component: views/JsTool.vue');
  } else {
    console.log('JavaScript Tool menu not found, creating...');
    const jsTool = menuRepository.create({
      name: 'JavaScript 工具',
      path: '/js-tool',
      icon: 'Files',
      parentId: null,
      sort: 2,
      component: 'views/JsTool.vue'
    });
    await menuRepository.save(jsTool);
    console.log('Created JavaScript Tool menu');
  }

  const finalMenus = await menuRepository.find();
  console.log('\nFinal menus:', finalMenus.map(m => ({ id: m.id, name: m.name, path: m.path, parentId: m.parentId, component: m.component })));

  await app.close();
  process.exit(0);
}

bootstrap();
