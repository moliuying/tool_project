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

export const healthConditionOptions: { value: HealthCondition; label: string; risk: 'high' | 'medium' | 'low' }[] = [
  { value: HealthCondition.KNEE_INJURY, label: '膝盖损伤', risk: 'medium' },
  { value: HealthCondition.WAIST_INJURY, label: '腰部损伤', risk: 'medium' },
  { value: HealthCondition.SHOULDER_INJURY, label: '肩部损伤', risk: 'medium' },
  { value: HealthCondition.HYPERTENSION, label: '高血压', risk: 'high' },
  { value: HealthCondition.HEART_DISEASE, label: '心脏病', risk: 'high' },
  { value: HealthCondition.DIABETES, label: '糖尿病', risk: 'high' },
  { value: HealthCondition.PREGNANCY, label: '孕期', risk: 'high' },
  { value: HealthCondition.POSTPARTUM, label: '产后恢复（6个月内）', risk: 'medium' },
  { value: HealthCondition.OBESITY, label: '重度肥胖（BMI≥32）', risk: 'medium' },
  { value: HealthCondition.ARTHRITIS, label: '关节炎', risk: 'medium' },
  { value: HealthCondition.OSTEOPOROSIS, label: '骨质疏松', risk: 'medium' },
  { value: HealthCondition.ASTHMA, label: '哮喘', risk: 'medium' }
]

export interface CreateFitnessPlanDto {
  age: number
  gender: Gender
  weight: number
  height: number
  goal: FitnessGoal
  availableDaysPerWeek: number
  availableMinutesPerSession: number
  trainingScene?: TrainingScene
  healthConditions?: HealthCondition[]
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

export interface HealthWarning {
  condition: string
  severity: 'high' | 'medium'
  warning: string
  suggestions: string[]
}

export interface ApplicableScope {
  applicablePeople: string[]
  notApplicablePeople: string[]
  boundaries: string[]
}

export interface FitnessPlan {
  planBasis: string[]
  applicableScope: ApplicableScope
  disclaimer: string
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
    healthConditions: string[]
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
  healthWarnings: HealthWarning[]
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
