import { Module } from '@nestjs/common';
import { PlantRecognitionService } from './plant-recognition.service';
import { PlantRecognitionController } from './plant-recognition.controller';

@Module({
  controllers: [PlantRecognitionController],
  providers: [PlantRecognitionService],
})
export class PlantRecognitionModule {}
