import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

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

export interface CreateFitnessPlanDto {
  age: number
  gender: Gender
  weight: number
  height: number
  goal: FitnessGoal
  availableDaysPerWeek: number
  availableMinutesPerSession: number
  trainingScene?: TrainingScene
}

export interface Exercise {
  name: string
  sets?: number
  reps?: string
  duration?: string
  description: string
  targetMuscle?: string
}

export interface DayPlan {
  day: string
  focus: string
  exercises: Exercise[]
  warmUp: string
  coolDown: string
  estimatedDuration: number
}

export interface WeeklyPlan {
  days: DayPlan[]
  restDays: string[]
}

export interface CyclePhase {
  name: string
  duration: string
  description: string
  focus: string
  intensity: string
  tips: string[]
}

export interface FitnessPlan {
  userProfile: {
    age: number
    gender: Gender
    weight: number
    height: number
    bmi: number
    bmiCategory: string
    bmr: number
    goal: FitnessGoal
    goalLabel: string
  }
  trainingOverview: {
    frequency: string
    weeklyDays: number
    minutesPerSession: number
    totalWeeklyMinutes: number
    intensityLevel: string
    trainingScene: TrainingScene
    sceneLabel: string
  }
  weeklyPlan: WeeklyPlan
  cyclePlan: {
    phases: CyclePhase[]
    totalDuration: string
  }
  nutritionAdvice: string[]
  safetyTips: string[]
  beginnerTips: string[]
}

export const fitnessApi = {
  generatePlan: (data: CreateFitnessPlanDto) =>
    api.post<FitnessPlan>('/fitness/generate-plan', data)
}
