import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

export interface Ingredient {
  name: string
  probability: number
}

export interface CookingMethod {
  name: string
  description: string
}

export interface RegionalVersion {
  region: string
  regionIcon: string
  cuisine: string
  mainIngredients: Ingredient[]
  cookingMethods: CookingMethod[]
  flavor: string
  description: string
  difficulty: string
  cookingTime: string
  calories: string
  nutritionalInfo: string
  cookingTips: string[]
  isDefault?: boolean
}

export interface FoodRecognitionResult {
  dishName: string
  englishName: string
  cuisine: string
  mainIngredients: Ingredient[]
  cookingMethods: CookingMethod[]
  flavor: string
  description: string
  confidence: number
  difficulty: string
  cookingTime: string
  calories: string
  nutritionalInfo: string
  similarDishes: string[]
  cookingTips: string[]
  dietaryTags: string[]
  regionalVersions?: RegionalVersion[]
}

export const foodRecognitionApi = {
  recognizeFood: (image: string) => api.post<FoodRecognitionResult>('/food-recognition/recognize', { image }),
  getAllDishes: () => api.get('/food-recognition/dishes')
}
