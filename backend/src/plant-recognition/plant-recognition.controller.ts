import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PlantRecognitionService, PlantRecognitionResult } from './plant-recognition.service';
import { RecognizePlantDto } from './dto/recognize-plant.dto';

@Controller('plant-recognition')
export class PlantRecognitionController {
  constructor(private readonly plantRecognitionService: PlantRecognitionService) {}

  @Post('recognize')
  async recognize(@Body() dto: RecognizePlantDto): Promise<PlantRecognitionResult> {
    try {
      if (!dto.image) {
        throw new HttpException('请上传植物图片', HttpStatus.BAD_REQUEST);
      }
      return this.plantRecognitionService.recognizePlant(dto.image);
    } catch (error: any) {
      throw new HttpException(
        error.message || '植物识别失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('plants')
  async getAllPlants() {
    return this.plantRecognitionService.getAllPlants();
  }
}
