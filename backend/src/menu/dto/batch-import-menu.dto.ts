import { IsArray, IsNotEmpty, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMenuDto } from './create-menu.dto';

export class BatchImportMenuDto {
  @IsArray()
  @ArrayNotEmpty({ message: '菜单列表不能为空' })
  @ValidateNested({ each: true })
  @Type(() => CreateMenuDto)
  menus: CreateMenuDto[];
}
