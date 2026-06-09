import { IsString, IsNotEmpty, IsNumber, Min, Max, IsEnum, IsOptional, IsArray } from 'class-validator';

export enum FitnessGoal {
  MUSCLE_GAIN = 'muscle_gain',
  FAT_LOSS = 'fat_loss',
  BODY_SHAPING = 'body_shaping',
  FITNESS_IMPROVEMENT = 'fitness_improvement'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum TrainingScene {
  HOME = 'home',
  GYM = 'gym',
  BOTH = 'both'
}

export enum HealthCondition {
  KNEE_INJURY = 'knee_injury',
  WAIST_INJURY = 'waist_injury',
  SHOULDER_INJURY = 'shoulder_injury',
  HYPERTENSION = 'hypertension',
  HEART_DISEASE = 'heart_disease',
  DIABETES = 'diabetes',
  PREGNANCY = 'pregnancy',
  POSTPARTUM = 'postpartum',
  OBESITY = 'obesity',
  ARTHRITIS = 'arthritis',
  OSTEOPOROSIS = 'osteoporosis',
  ASTHMA = 'asthma',
  NONE = 'none'
}

export class CreateFitnessPlanDto {
  @IsNumber()
  @Min(10)
  @Max(100)
  @IsNotEmpty()
  age: number;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsNumber()
  @Min(20)
  @Max(300)
  @IsNotEmpty()
  weight: number;

  @IsNumber()
  @Min(100)
  @Max(250)
  @IsNotEmpty()
  height: number;

  @IsEnum(FitnessGoal)
  @IsNotEmpty()
  goal: FitnessGoal;

  @IsNumber()
  @Min(1)
  @Max(7)
  @IsNotEmpty()
  availableDaysPerWeek: number;

  @IsNumber()
  @Min(15)
  @Max(180)
  @IsNotEmpty()
  availableMinutesPerSession: number;

  @IsEnum(TrainingScene)
  @IsOptional()
  trainingScene?: TrainingScene;

  @IsArray()
  @IsEnum(HealthCondition, { each: true })
  @IsOptional()
  healthConditions?: HealthCondition[];
}
