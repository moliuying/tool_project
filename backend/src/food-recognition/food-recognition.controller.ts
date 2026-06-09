import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { FoodRecognitionService, FoodRecognitionResult } from './food-recognition.service';
import { RecognizeFoodDto } from './dto/recognize-food.dto';

@Controller('food-recognition')
export class FoodRecognitionController {
  constructor(private readonly foodRecognitionService: FoodRecognitionService) {}

  @Post('recognize')
  async recognize(@Body() dto: RecognizeFoodDto): Promise<FoodRecognitionResult> {
    try {
      if (!dto.image) {
        throw new HttpException('请上传菜品图片', HttpStatus.BAD_REQUEST);
      }
      return this.foodRecognitionService.recognizeFood(dto.image);
    } catch (error: any) {
      throw new HttpException(
        error.message || '菜品识别失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('dishes')
  async getAllDishes() {
    return this.foodRecognitionService.getAllDishes();
  }
}
