import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

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

export const categoryOptions: { value: ProgrammingCategory; label: string; icon: string }[] = [
  { value: ProgrammingCategory.GENERAL, label: '通用编程', icon: '💡' },
  { value: ProgrammingCategory.SYNTAX, label: '语言语法', icon: '🔤' },
  { value: ProgrammingCategory.FRAMEWORK, label: '框架使用', icon: '🛠️' },
  { value: ProgrammingCategory.ALGORITHM, label: '算法实现', icon: '🧮' },
  { value: ProgrammingCategory.DEBUGGING, label: '调试技巧', icon: '🐞' },
  { value: ProgrammingCategory.API, label: 'API调用', icon: '🔗' },
  { value: ProgrammingCategory.DATABASE, label: '数据库操作', icon: '🗄️' },
  { value: ProgrammingCategory.PERFORMANCE, label: '性能优化', icon: '⚡' },
  { value: ProgrammingCategory.DESIGN_PATTERN, label: '设计模式', icon: '🎨' },
  { value: ProgrammingCategory.DEPLOYMENT, label: '部署运维', icon: '🚀' },
]

export const difficultyOptions: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: DifficultyLevel.BEGINNER, label: '入门级', color: 'success' },
  { value: DifficultyLevel.INTERMEDIATE, label: '中等级', color: 'warning' },
  { value: DifficultyLevel.ADVANCED, label: '高级', color: 'danger' },
]

export const languageOptions: string[] = [
  'JavaScript/TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C/C++',
  'C#',
  'PHP',
  'SQL',
  'Shell/Bash',
  'Swift',
  'Kotlin',
]

export interface AskQuestionDto {
  question: string
  category?: ProgrammingCategory
  difficulty?: DifficultyLevel
  language?: string
  framework?: string
  tags?: string[]
  codeContext?: string
  errorMessage?: string
}

export interface CodeExample {
  title: string
  language: string
  code: string
  explanation: string
}

export interface RelatedTopic {
  topic: string
  description: string
}

export interface ProgrammingAnswer {
  category: ProgrammingCategory
  categoryLabel: string
  difficulty: DifficultyLevel
  difficultyLabel: string
  summary: string
  detailedExplanation: string
  keyPoints: string[]
  codeExamples: CodeExample[]
  commonPitfalls: string[]
  bestPractices: string[]
  relatedTopics: RelatedTopic[]
  references: string[]
}

export const programmingQnaApi = {
  askQuestion: (data: AskQuestionDto) =>
    api.post<ProgrammingAnswer>('/programming-qna/ask', data)
}

export const quickQuestions: { label: string; question: string; category: ProgrammingCategory }[] = [
  {
    label: 'Vue 组合式 API 怎么用？',
    question: 'Vue 3 组合式 API 的 ref、reactive、computed 怎么用？',
    category: ProgrammingCategory.FRAMEWORK,
  },
  {
    label: 'async/await 详解',
    question: 'JavaScript 中 async/await 和 Promise 的区别和用法',
    category: ProgrammingCategory.SYNTAX,
  },
  {
    label: '快速排序算法',
    question: '快速排序算法的原理和 TypeScript 实现',
    category: ProgrammingCategory.ALGORITHM,
  },
  {
    label: 'axios 封装最佳实践',
    question: '前端项目中如何封装 axios，包括拦截器、错误处理、请求取消',
    category: ProgrammingCategory.API,
  },
  {
    label: '防抖和节流',
    question: '什么是防抖和节流？如何实现？适用场景有哪些？',
    category: ProgrammingCategory.PERFORMANCE,
  },
  {
    label: 'SQL 查询优化',
    question: 'SQL 查询优化的常用方法和索引设计原则',
    category: ProgrammingCategory.DATABASE,
  },
  {
    label: '闭包原理',
    question: 'JavaScript 中的闭包是什么？原理和常见应用场景',
    category: ProgrammingCategory.SYNTAX,
  },
  {
    label: 'React Hooks 用法',
    question: 'React useEffect 依赖数组怎么正确使用？常见坑有哪些？',
    category: ProgrammingCategory.FRAMEWORK,
  },
]
