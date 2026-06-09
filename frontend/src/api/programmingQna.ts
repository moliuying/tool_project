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

export interface LanguageInfo {
  name: string
  icon: string
  color: string
  level: '精通' | '熟练' | '熟悉'
  description: string
}

export const supportedLanguages: LanguageInfo[] = [
  { name: 'TypeScript', icon: '🟦', color: '#3178c6', level: '精通', description: '前端全栈、类型系统、工程化' },
  { name: 'JavaScript', icon: '🟨', color: '#f7df1e', level: '精通', description: '浏览器API、Node.js、ES新特性' },
  { name: 'Python', icon: '🐍', color: '#3776ab', level: '精通', description: '数据处理、Web开发、自动化脚本' },
  { name: 'Go', icon: '🐹', color: '#00add8', level: '熟练', description: '微服务、高并发、CLI工具' },
  { name: 'Java', icon: '☕', color: '#007396', level: '熟练', description: 'Spring生态、后端服务、Android' },
  { name: 'Rust', icon: '🦀', color: '#ce422b', level: '熟悉', description: '系统编程、WebAssembly、高性能' },
  { name: 'C/C++', icon: '⚙️', color: '#00599c', level: '熟悉', description: '底层开发、算法优化、嵌入式' },
  { name: 'SQL', icon: '🗃️', color: '#00758f', level: '精通', description: 'MySQL、PostgreSQL、查询优化' },
  { name: 'Shell/Bash', icon: '💻', color: '#4eaa25', level: '熟练', description: 'Linux运维、自动化部署、脚本编写' },
  { name: 'C#', icon: '💜', color: '#68217a', level: '熟悉', description: '.NET生态、Unity游戏开发' },
  { name: 'PHP', icon: '🐘', color: '#777bb4', level: '熟悉', description: 'Laravel、WordPress、Web后端' },
  { name: 'Swift', icon: '🍎', color: '#fa7343', level: '熟悉', description: 'iOS/macOS应用开发' },
  { name: 'Kotlin', icon: '🟣', color: '#7f52ff', level: '熟悉', description: 'Android开发、后端服务' },
]

export interface FrameworkInfo {
  name: string
  icon: string
  color: string
  category: '前端' | '后端' | '全栈' | '移动端' | '运维' | '数据库'
  description: string
}

export const supportedFrameworks: FrameworkInfo[] = [
  { name: 'Vue.js', icon: '💚', color: '#42b883', category: '前端', description: '组合式API、Pinia、Vue Router、Nuxt' },
  { name: 'React', icon: '⚛️', color: '#61dafb', category: '前端', description: 'Hooks、Redux/Zustand、Next.js' },
  { name: 'Angular', icon: '🅰️', color: '#dd0031', category: '前端', description: '企业级前端框架、RxJS' },
  { name: 'Node.js', icon: '🟢', color: '#339933', category: '后端', description: 'Express、Koa、NestJS、SSR' },
  { name: 'NestJS', icon: '🐱', color: '#e0234e', category: '后端', description: '企业级Node框架、TypeScript' },
  { name: 'Django', icon: '🎸', color: '#092e20', category: '后端', description: 'Python Web框架、ORM、Admin' },
  { name: 'Spring Boot', icon: '🌱', color: '#6db33f', category: '后端', description: 'Java微服务、Spring Cloud' },
  { name: 'Gin', icon: '🍸', color: '#00add8', category: '后端', description: 'Go高性能Web框架' },
  { name: 'Flutter', icon: '🦋', color: '#0175c2', category: '移动端', description: '跨平台移动应用、Dart' },
  { name: 'React Native', icon: '📱', color: '#61dafb', category: '移动端', description: '跨平台移动应用' },
  { name: 'Docker', icon: '🐳', color: '#2496ed', category: '运维', description: '容器化部署、镜像构建' },
  { name: 'Kubernetes', icon: '☸️', color: '#326ce5', category: '运维', description: '容器编排、微服务治理' },
  { name: 'MySQL', icon: '🐬', color: '#4479a1', category: '数据库', description: '关系型数据库、性能优化' },
  { name: 'PostgreSQL', icon: '🐘', color: '#336791', category: '数据库', description: '高级关系型数据库、扩展' },
  { name: 'Redis', icon: '🔴', color: '#dc382d', category: '数据库', description: '缓存、消息队列、数据结构' },
  { name: 'MongoDB', icon: '🍃', color: '#47a248', category: '数据库', description: '文档数据库、灵活Schema' },
  { name: 'Vite', icon: '⚡', color: '#646cff', category: '前端', description: '前端构建工具、开发服务器' },
  { name: 'Webpack', icon: '📦', color: '#8dd6f9', category: '前端', description: '前端打包构建、插件生态' },
]

export interface DomainArea {
  name: string
  icon: string
  color: string
  description: string
}

export const expertiseAreas: DomainArea[] = [
  { name: 'Web前端开发', icon: '🎨', color: '#165DFF', description: 'Vue/React/Angular全栈开发、工程化、性能优化' },
  { name: '后端服务开发', icon: '🛠️', color: '#00b42a', description: 'API设计、微服务架构、数据库设计' },
  { name: '算法与数据结构', icon: '🧮', color: '#f53f3f', description: 'LeetCode题解、系统设计、复杂度分析' },
  { name: '调试与问题排查', icon: '🐞', color: '#722ed1', description: '错误分析、性能调优、内存泄漏排查' },
  { name: 'DevOps与部署', icon: '🚀', color: '#ff7d00', description: 'CI/CD、容器化、服务器运维、自动化' },
  { name: '数据库与存储', icon: '🗄️', color: '#14c9c9', description: 'SQL优化、索引设计、缓存策略、分库分表' },
  { name: '系统架构设计', icon: '🏗️', color: '#86909c', description: '高并发、高可用、分布式系统设计模式' },
  { name: '代码质量与重构', icon: '✨', color: '#eb2f96', description: '设计模式、最佳实践、Code Review指导' },
  { name: '面试与求职', icon: '💼', color: '#ffc53d', description: '技术面试题、简历优化、职业规划' },
  { name: '跨端与移动端', icon: '📱', color: '#0fc6c2', description: '小程序、H5、Flutter、React Native' },
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
