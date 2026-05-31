import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('holidays')
export class Holiday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  year: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 200 })
  dateRange: string;

  @Column({ length: 200 })
  holidayPeriod: string;

  @Column()
  days: number;

  @Column('simple-array')
  workDays: string[];

  @Column({ length: 50 })
  type: 'tradition' | 'modern' | 'international';

  @Column({ length: 50 })
  typeText: string;

  @Column({ length: 50 })
  tagType: 'success' | 'primary' | 'warning';

  @Column({ length: 50 })
  icon: string;

  @Column({ length: 500, nullable: true })
  tips: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column()
  month: number;

  @Column()
  startDay: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
