import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { FitnessService, FitnessPlan } from './fitness.service';
import { CreateFitnessPlanDto } from './dto/create-fitness-plan.dto';

@Controller('fitness')
export class FitnessController {
  constructor(private readonly fitnessService: FitnessService) {}

  @Post('generate-plan')
  async generatePlan(@Body() dto: CreateFitnessPlanDto): Promise<FitnessPlan> {
    try {
      return this.fitnessService.generatePlan(dto);
    } catch (error: any) {
      throw new HttpException(
        error.message || '健身计划生成失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
