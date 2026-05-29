import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateMenuDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsNumber()
  @IsOptional()
  parentId?: number | null;

  @IsNumber()
  @IsOptional()
  sort?: number;

  @IsString()
  @IsOptional()
  component?: string;
}
