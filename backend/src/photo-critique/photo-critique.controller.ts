import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PhotoCritiqueService, PhotoCritique } from './photo-critique.service';
import { CritiquePhotoDto } from './dto/critique-photo.dto';

@Controller('photo-critique')
export class PhotoCritiqueController {
  constructor(private readonly photoCritiqueService: PhotoCritiqueService) {}

  @Post('critique')
  async critique(@Body() dto: CritiquePhotoDto): Promise<PhotoCritique> {
    try {
      if (!dto.images || dto.images.length === 0) {
        throw new HttpException('请上传至少一张摄影作品', HttpStatus.BAD_REQUEST);
      }
      if (dto.images.length > 9) {
        throw new HttpException('单次最多上传9张作品', HttpStatus.BAD_REQUEST);
      }
      return this.photoCritiqueService.critiquePhoto(dto.images, dto.style || 'standard');
    } catch (error: any) {
      throw new HttpException(
        error.message || '摄影作品点评失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
