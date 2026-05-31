import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { BatchImportMenuDto } from './dto/batch-import-menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    create(createMenuDto: CreateMenuDto): Promise<import("./menu.entity").Menu>;
    findAll(): Promise<import("./menu.entity").Menu[]>;
    findFlat(): Promise<import("./menu.entity").Menu[]>;
    findOne(id: string): Promise<import("./menu.entity").Menu>;
    update(id: string, updateMenuDto: UpdateMenuDto): Promise<import("./menu.entity").Menu>;
    remove(id: string): Promise<void>;
    batchImport(batchImportMenuDto: BatchImportMenuDto): Promise<import("./menu.entity").Menu[]>;
}
