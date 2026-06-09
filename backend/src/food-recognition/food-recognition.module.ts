import { Module } from '@nestjs/common';
import { FoodRecognitionService } from './food-recognition.service';
import { FoodRecognitionController } from './food-recognition.controller';

@Module({
  controllers: [FoodRecognitionController],
  providers: [FoodRecognitionService],
})
export class FoodRecognitionModule {}
