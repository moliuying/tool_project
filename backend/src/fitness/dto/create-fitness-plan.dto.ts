import { IsString, IsNotEmpty, IsNumber, Min, Max, IsEnum, IsOptional } from 'class-validator';

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
}
