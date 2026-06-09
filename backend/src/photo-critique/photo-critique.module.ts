import { Module } from '@nestjs/common';
import { PhotoCritiqueService } from './photo-critique.service';
import { PhotoCritiqueController } from './photo-critique.controller';

@Module({
  controllers: [PhotoCritiqueController],
  providers: [PhotoCritiqueService],
})
export class PhotoCritiqueModule {}
