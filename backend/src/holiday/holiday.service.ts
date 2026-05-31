import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from './holiday.entity';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private holidayRepository: Repository<Holiday>,
  ) {}

  async findByYear(year: number): Promise<Holiday[]> {
    return this.holidayRepository.find({
      where: { year },
      order: { startDate: 'ASC' },
    });
  }

  async findAll(): Promise<Holiday[]> {
    return this.holidayRepository.find({
      order: { year: 'ASC', startDate: 'ASC' },
    });
  }

  async getAvailableYears(): Promise<number[]> {
    const holidays = await this.holidayRepository
      .createQueryBuilder('holiday')
      .select('DISTINCT holiday.year', 'year')
      .orderBy('holiday.year', 'ASC')
      .getRawMany();
    return holidays.map(h => h.year);
  }

  async create(holidayData: Partial<Holiday>): Promise<Holiday> {
    const holiday = this.holidayRepository.create(holidayData);
    return this.holidayRepository.save(holiday);
  }

  async batchCreate(holidaysData: Partial<Holiday>[]): Promise<Holiday[]> {
    const holidays = this.holidayRepository.create(holidaysData);
    return this.holidayRepository.save(holidays);
  }

  async clearAll(): Promise<void> {
    await this.holidayRepository.clear();
  }
}
