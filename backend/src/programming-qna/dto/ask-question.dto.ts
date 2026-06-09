import { IsString, IsNotEmpty, MaxLength, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum ProgrammingCategory {
  SYNTAX = 'syntax',
  FRAMEWORK = 'framework',
  ALGORITHM = 'algorithm',
  DEBUGGING = 'debugging',
  API = 'api',
  DATABASE = 'database',
  PERFORMANCE = 'performance',
  DESIGN_PATTERN = 'design_pattern',
  DEPLOYMENT = 'deployment',
  GENERAL = 'general',
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export class AskQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  question: string;

  @IsEnum(ProgrammingCategory)
  @IsOptional()
  category?: ProgrammingCategory;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  language?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  framework?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  codeContext?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  errorMessage?: string;
}
