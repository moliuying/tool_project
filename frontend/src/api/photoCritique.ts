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
  style: string
  styleName: string
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
  styleNote: string
}

export interface PhotoStyleOption {
  key: string
  name: string
  description: string
  icon: string
  color: string
}

export const photoStyles: PhotoStyleOption[] = [
  {
    key: 'standard',
    name: '通用标准',
    description: '均衡的综合评价标准，适用于大多数摄影作品',
    icon: 'Aim',
    color: '#165DFF'
  },
  {
    key: 'street',
    name: '街头纪实',
    description: '强调决定性瞬间、真实情感和故事叙事，对技术完美度包容度高',
    icon: 'Camera',
    color: '#303133'
  },
  {
    key: 'landscape',
    name: '风光摄影',
    description: '侧重构图的精致、光影的魅力、色彩的和谐和画质的极致',
    icon: 'Mountain',
    color: '#67c23a'
  },
  {
    key: 'portrait',
    name: '人像摄影',
    description: '侧重人物神态、眼神光、肤色表现和情绪传递',
    icon: 'User',
    color: '#e6a23c'
  },
  {
    key: 'bw',
    name: '黑白摄影',
    description: '以影调层次、光影对比、质感纹理为核心评价维度',
    icon: 'Sunny',
    color: '#606266'
  },
  {
    key: 'minimalist',
    name: '极简主义',
    description: '以少胜多，重视负空间、简洁构图和纯粹的视觉表达',
    icon: 'Picture',
    color: '#909399'
  },
  {
    key: 'commercial',
    name: '商业产品',
    description: '以产品展示为核心，极致的技术控制和专业的布光是评价重点',
    icon: 'Goods',
    color: '#f56c6c'
  },
  {
    key: 'artistic',
    name: '艺术创意',
    description: '以创意表达和艺术观念为核心，鼓励突破常规',
    icon: 'MagicStick',
    color: '#9b59b6'
  }
]

export const photoCritiqueApi = {
  critiquePhotos: (images: string[], style: string = 'standard') =>
    api.post<PhotoCritique>('/photo-critique/critique', { images, style })
}
