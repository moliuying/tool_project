"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_entity_1 = require("./menu.entity");
let MenuService = class MenuService {
    constructor(menuRepository, dataSource) {
        this.menuRepository = menuRepository;
        this.dataSource = dataSource;
    }
    async create(createMenuDto) {
        const menu = this.menuRepository.create(createMenuDto);
        return this.menuRepository.save(menu);
    }
    async findAll() {
        return this.menuRepository.find({
            order: { sort: 'ASC', id: 'ASC' },
        });
    }
    async findTree() {
        const menus = await this.menuRepository.find({
            order: { sort: 'ASC', id: 'ASC' },
        });
        return this.buildTree(menus);
    }
    buildTree(menus, parentId = null) {
        return menus
            .filter((menu) => menu.parentId === parentId)
            .map((menu) => (Object.assign(Object.assign({}, menu), { children: this.buildTree(menus, menu.id) })));
    }
    async findOne(id) {
        return this.menuRepository.findOne({ where: { id } });
    }
    async update(id, updateMenuDto) {
        await this.menuRepository.update(id, updateMenuDto);
        return this.menuRepository.findOne({ where: { id } });
    }
    async remove(id) {
        await this.menuRepository.delete(id);
    }
    async batchImport(menus) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const createdMenus = [];
            const nameToIdMap = new Map();
            const createMenuWithChildren = async (menuDto, parentId = null) => {
                const menuData = Object.assign(Object.assign({}, menuDto), { parentId });
                const menu = queryRunner.manager.create(menu_entity_1.Menu, menuData);
                const savedMenu = await queryRunner.manager.save(menu);
                createdMenus.push(savedMenu);
                nameToIdMap.set(savedMenu.name, savedMenu.id);
                return savedMenu;
            };
            for (const menuDto of menus) {
                await createMenuWithChildren(menuDto);
            }
            await queryRunner.commitTransaction();
            return createdMenus;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], MenuService);
exports.MenuService = MenuService;
//# sourceMappingURL=menu.service.js.map