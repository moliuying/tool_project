import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    private dataSource: DataSource,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(menu);
  }

  async findAll(): Promise<Menu[]> {
    return this.menuRepository.find({
      order: { sort: 'ASC', id: 'ASC' },
    });
  }

  async findTree(): Promise<Menu[]> {
    const menus = await this.menuRepository.find({
      order: { sort: 'ASC', id: 'ASC' },
    });
    return this.buildTree(menus);
  }

  private buildTree(menus: Menu[], parentId: number | null = null): Menu[] {
    return menus
      .filter((menu) => menu.parentId === parentId)
      .map((menu) => ({
        ...menu,
        children: this.buildTree(menus, menu.id),
      }));
  }

  async findOne(id: number): Promise<Menu | undefined> {
    return this.menuRepository.findOne({ where: { id } });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    await this.menuRepository.update(id, updateMenuDto);
    return this.menuRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.menuRepository.delete(id);
  }

  async batchImport(menus: CreateMenuDto[]): Promise<Menu[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdMenus: Menu[] = [];
      const nameToIdMap = new Map<string, number>();

      const createMenuWithChildren = async (
        menuDto: CreateMenuDto,
        parentId: number | null = null,
      ): Promise<Menu> => {
        const menuData = { ...menuDto, parentId };
        const menu = queryRunner.manager.create(Menu, menuData);
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
