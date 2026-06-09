import { IsArray, IsString, IsOptional, IsIn, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CritiquePhotoDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(9)
  images: string[];

  @IsOptional()
  @IsString()
  @IsIn(['standard', 'street', 'landscape', 'portrait', 'bw', 'minimalist', 'commercial', 'dark', 'artistic'])
  style?: string;
}
