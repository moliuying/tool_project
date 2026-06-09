import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000
})

export interface DimensionScore {
  name: string
  score: number
  maxScore: number
  description: string
  highlights: string[]
  improvements: string[]
}

export interface PhotoCritique {
  overallScore: number
  maxScore: number
  overallGrade: string
  overallComment: string
  dimensions: DimensionScore[]
  compositionInsights: string[]
  technicalSuggestions: string[]
  creativeAdvice: string[]
  strengths: string[]
  weaknesses: string[]
  postProcessingTips: string[]
  learningPath: string[]
  suitableScenarios: string[]
}

export const photoCritiqueApi = {
  critiquePhotos: (images: string[]) =>
    api.post<PhotoCritique>('/photo-critique/critique', { images })
}
