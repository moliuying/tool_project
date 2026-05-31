import { Controller, Get, Param, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { Holiday } from './holiday.entity';

@Controller('holiday')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get('years')
  getAvailableYears(): Promise<number[]> {
    return this.holidayService.getAvailableYears();
  }

  @Get('year/:year')
  findByYear(@Param('year') year: string): Promise<Holiday[]> {
    return this.holidayService.findByYear(+year);
  }

  @Get()
  findAll(): Promise<Holiday[]> {
    return this.holidayService.findAll();
  }

  @Post()
  create(@Body() holidayData: Partial<Holiday>): Promise<Holiday> {
    return this.holidayService.create(holidayData);
  }

  @Post('batch')
  @HttpCode(HttpStatus.OK)
  batchCreate(@Body() holidaysData: Partial<Holiday>[]): Promise<Holiday[]> {
    return this.holidayService.batchCreate(holidaysData);
  }
}
