import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

export interface PlantCharacteristic {
  name: string
  description: string
}

export interface PlantUsage {
  category: string
  description: string
}

export interface SimilarPlant {
  name: string
  chineseName: string
  difference: string
}

export interface PlantRecognitionResult {
  chineseName: string
  scientificName: string
  englishName: string
  family: string
  genus: string
  confidence: number
  description: string
  plantType: string
  nativeHabitat: string
  growthHabits: string
  characteristics: PlantCharacteristic[]
  uses: PlantUsage[]
  growingTips: string[]
  similarPlants: SimilarPlant[]
  tags: string[]
  seasonalInfo: string
  toxicity: string
}

export const plantRecognitionApi = {
  recognizePlant: (image: string) => api.post<PlantRecognitionResult>('/plant-recognition/recognize', { image }),
  getAllPlants: () => api.get('/plant-recognition/plants')
}
