"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const menu_entity_1 = require("./menu/menu.entity");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.init();
    const dataSource = app.get(typeorm_1.DataSource);
    const menuRepository = dataSource.getRepository(menu_entity_1.Menu);
    const count = await menuRepository.count();
    if (count === 0) {
        const menus = [
            { name: '首页', path: '/', icon: 'Home', parentId: null, sort: 1, component: 'views/Home.vue' },
            { name: '系统管理', path: '/system', icon: 'Setting', parentId: null, sort: 2, component: null },
            { name: '菜单管理', path: '/system/menu', icon: 'Menu', parentId: 2, sort: 1, component: 'views/Menu.vue' },
        ];
        for (const menu of menus) {
            const entity = menuRepository.create(menu);
            await menuRepository.save(entity);
        }
        console.log('Initial menu data has been inserted.');
    }
    else {
        console.log('Menu data already exists, skipping initialization.');
    }
    await app.close();
    process.exit(0);
}
bootstrap();
//# sourceMappingURL=init-db.js.map