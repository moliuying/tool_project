export interface QuestionOption {
  text: string
  score: number
}

export interface Question {
  id: number
  text: string
  options: QuestionOption[]
  reverse?: boolean
}

export interface ResultInterpretation {
  minScore: number
  maxScore: number
  level: string
  description: string
  suggestion: string
  recommendedScale?: string
}

export interface EmotionScreeningResult {
  depressionScore: number
  anxietyScore: number
  primaryTendency: 'depression' | 'anxiety' | 'both' | 'none'
  recommendedScale: string
  description: string
}

export interface ScreeningQuestion extends Question {
  dimension: 'depression' | 'anxiety'
}

export interface PsychologyScale {
  id: string
  name: string
  category: 'emotion' | 'intelligence' | 'personality' | 'stress'
  description: string
  fullDescription: string
  suitablePopulation: string
  testDuration: string
  questionCount: number
  icon: string
  color: string
  questions: Question[]
  resultInterpretations: ResultInterpretation[]
  scoringInstructions: string
}

export const psychologyScales: PsychologyScale[] = [
  {
    id: 'emotion-screening',
    name: '情绪快速筛查',
    category: 'emotion',
    description: '3分钟快速判断，帮您选择更适合的测评量表',
    fullDescription: '当您不确定自己是焦虑还是抑郁时，可以先进行这个快速筛查。通过6道简单问题，帮助您快速了解当前情绪状态的主要倾向，从而选择更适合的详细测评量表。',
    suitablePopulation: '情绪不稳定，不确定该测哪个量表的人群',
    testDuration: '约2-3分钟',
    questionCount: 6,
    icon: 'Search',
    color: '#9b59b6',
    questions: [
      { id: 1, text: '最近一周，我经常感到情绪低落、闷闷不乐', dimension: 'depression', options: [{ text: '完全没有', score: 0 }, { text: '偶尔', score: 1 }, { text: '经常', score: 2 }, { text: '几乎每天', score: 3 }] },
      { id: 2, text: '最近一周，我对很多事情都失去了兴趣', dimension: 'depression', options: [{ text: '完全没有', score: 0 }, { text: '偶尔', score: 1 }, { text: '经常', score: 2 }, { text: '几乎每天', score: 3 }] },
      { id: 3, text: '最近一周，我感到精力不足，容易疲劳', dimension: 'depression', options: [{ text: '完全没有', score: 0 }, { text: '偶尔', score: 1 }, { text: '经常', score: 2 }, { text: '几乎每天', score: 3 }] },
      { id: 4, text: '最近一周，我经常感到紧张、担心或焦虑', dimension: 'anxiety', options: [{ text: '完全没有', score: 0 }, { text: '偶尔', score: 1 }, { text: '经常', score: 2 }, { text: '几乎每天', score: 3 }] },
      { id: 5, text: '最近一周，我容易心烦意乱或感到恐慌', dimension: 'anxiety', options: [{ text: '完全没有', score: 0 }, { text: '偶尔', score: 1 }, { text: '经常', score: 2 }, { text: '几乎每天', score: 3 }] },
      { id: 6, text: '最近一周，我有睡眠困难（入睡困难、易醒或早醒）', dimension: 'anxiety', options: [{ text: '完全没有', score: 0 }, { text: '偶尔', score: 1 }, { text: '经常', score: 2 }, { text: '几乎每天', score: 3 }] }
    ],
    resultInterpretations: [
      { minScore: 0, maxScore: 2, level: '情绪状态良好', description: '您的情绪状态整体良好，没有明显的抑郁或焦虑症状。', suggestion: '继续保持健康的生活方式，关注自己的心理健康。如有需要，可进行完整的详细测评。', recommendedScale: null },
      { minScore: 3, maxScore: 10, level: '轻度情绪困扰', description: '您可能存在一些轻度的情绪困扰，需要适当关注。', suggestion: '建议您进行更详细的测评，以便更好地了解自己的状态。', recommendedScale: null },
      { minScore: 11, maxScore: 18, level: '明显情绪困扰', description: '您的情绪症状较为明显，建议进行详细测评了解具体情况。', suggestion: '强烈建议您完成对应的详细量表，如症状持续，请及时寻求专业帮助。', recommendedScale: null }
    ],
    scoringInstructions: '本筛查包含抑郁和焦虑两个维度各3题。每题0-3分，分别计算两个维度的得分，帮助您判断情绪倾向。'
  },
  {
    id: 'sds',
    name: 'SDS 抑郁自评量表',
    category: 'emotion',
    description: '情绪低落、兴趣减退？测测是否有抑郁倾向',
    fullDescription: '抑郁自评量表（Self-Rating Depression Scale，简称SDS）由Zung于1965年编制，是目前广泛使用的抑郁筛查工具。如果您最近感到情绪低落、对事物失去兴趣、精力不足、睡眠不好，这个量表可以帮助您了解自己的抑郁程度。',
    suitablePopulation: '情绪低落、兴趣减退、持续两周以上的人群',
    testDuration: '约5-10分钟',
    questionCount: 20,
    icon: 'Reading',
    color: '#409EFF',
    questions: [
      { id: 1, text: '我感到情绪沮丧、郁闷', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 2, text: '我感到早晨心情最好', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 3, text: '我要哭或想哭', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 4, text: '我夜间睡眠不好', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 5, text: '我吃饭像平时一样多', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 6, text: '我的性功能正常', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 7, text: '我感到体重减轻', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 8, text: '我为便秘烦恼', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 9, text: '我的心跳比平时快', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 10, text: '我无故感到疲劳', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 11, text: '我的头脑像往常一样清楚', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 12, text: '我做事情像平时一样不感到困难', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 13, text: '我坐卧不安，难以保持平静', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 14, text: '我对未来感到有希望', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 15, text: '我比平时更容易激怒', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 16, text: '我觉得决定什么事很容易', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 17, text: '我感到自己是有用的和不可缺少的人', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 18, text: '我的生活很有意义', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 19, text: '我感到如果我死了别人会过得更好', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 20, text: '我仍旧喜爱自己平时喜爱的东西', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true }
    ],
    resultInterpretations: [
      { minScore: 0, maxScore: 52, level: '正常范围', description: '您的测评结果显示没有明显抑郁症状，情绪状态整体良好。', suggestion: '继续保持积极乐观的生活态度，规律作息，适度运动。' },
      { minScore: 53, maxScore: 62, level: '轻度抑郁', description: '您可能存在轻度的抑郁情绪，建议关注自身情绪变化。', suggestion: '尝试自我调节，如规律运动、与亲友倾诉、培养兴趣爱好。如情绪持续不佳，可考虑寻求心理咨询。' },
      { minScore: 63, maxScore: 72, level: '中度抑郁', description: '您的抑郁症状较为明显，已经对日常生活产生一定影响。', suggestion: '强烈建议您寻求专业心理咨询师的帮助，同时告诉家人朋友您的状态，获得社会支持。' },
      { minScore: 73, maxScore: 100, level: '重度抑郁', description: '您的抑郁症状较为严重，可能已经影响到正常的生活和工作。', suggestion: '请尽快寻求专业精神科医生的帮助，同时告知家人您的状态，确保您的安全。抑郁是可以治疗的，请不要放弃希望。' }
    ],
    scoringInstructions: 'SDS采用1-4级评分，其中10道题为反向计分。将所有题目得分相加得到粗分，粗分乘以1.25取整数部分即为标准分（满分100分）。标准分≥53分提示可能存在抑郁症状。'
  },
  {
    id: 'sas',
    name: 'SAS 焦虑自评量表',
    category: 'emotion',
    description: '紧张担心、心慌烦躁？测测是否有焦虑倾向',
    fullDescription: '焦虑自评量表（Self-Rating Anxiety Scale，简称SAS）由Zung于1971年编制，用于评估焦虑症状的严重程度。如果您最近经常感到紧张担心、心慌、烦躁、坐立不安、睡眠困难，这个量表可以帮助您了解自己的焦虑程度。',
    suitablePopulation: '经常紧张担心、烦躁、坐立不安的人群',
    testDuration: '约5-10分钟',
    questionCount: 20,
    icon: 'Lightning',
    color: '#E6A23C',
    questions: [
      { id: 1, text: '我感到比往常更加神经过敏和焦虑', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 2, text: '我无缘无故感到担心', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 3, text: '我容易心烦意乱或感到恐慌', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 4, text: '我感到我的身体好像被分成几块，支离破碎', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 5, text: '我感到一切都很好，不会发生什么不幸', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 6, text: '我手脚发抖打颤', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 7, text: '我因头痛、颈痛和背痛而烦恼', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 8, text: '我感到无力且容易疲劳', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 9, text: '我能安静地坐下来并轻松地放松自己', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 10, text: '我感到我的心跳很快', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 11, text: '我因一阵阵的头晕而苦恼', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 12, text: '我有晕倒发作或觉得要晕倒似的', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 13, text: '我吸气呼气都感到很容易', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 14, text: '我手脚麻木和刺痛', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 15, text: '我因胃痛和消化不良而苦恼', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 16, text: '我常常要小便', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 17, text: '我的手脚常常是干燥温暖的', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 18, text: '我脸红发热', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 19, text: '我容易入睡并且一夜睡得很好', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }], reverse: true },
      { id: 20, text: '我做恶梦', options: [{ text: '从无', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] }
    ],
    resultInterpretations: [
      { minScore: 0, maxScore: 49, level: '正常范围', description: '您的测评结果显示没有明显焦虑症状，情绪状态整体平稳。', suggestion: '继续保持良好的生活习惯，学会适当放松，保持积极心态。' },
      { minScore: 50, maxScore: 59, level: '轻度焦虑', description: '您可能存在轻度的焦虑情绪，需要适当关注自己的心理状态。', suggestion: '尝试学习放松技巧，如深呼吸、冥想、渐进式肌肉放松等。规律作息，避免过度劳累。' },
      { minScore: 60, maxScore: 69, level: '中度焦虑', description: '您的焦虑症状较为明显，可能已经对日常生活产生一定影响。', suggestion: '建议您寻求专业心理咨询师的帮助，学习情绪管理技巧，同时告知家人朋友您的状态。' },
      { minScore: 70, maxScore: 100, level: '重度焦虑', description: '您的焦虑症状较为严重，可能已经严重影响到正常的生活和工作。', suggestion: '请尽快寻求专业精神科医生的帮助，焦虑是可以通过药物和心理治疗有效控制的，请及时就医。' }
    ],
    scoringInstructions: 'SAS采用1-4级评分，其中5道题为反向计分。将所有题目得分相加得到粗分，粗分乘以1.25取整数部分即为标准分（满分100分）。标准分≥50分提示可能存在焦虑症状。'
  },
  {
    id: 'raven',
    name: '瑞文智力测试简版',
    category: 'intelligence',
    description: '通过图形推理评估逻辑思维能力，了解智力水平',
    fullDescription: '瑞文标准推理测验（Raven\'s Standard Progressive Matrices，简称SPM）由英国心理学家瑞文于1938年创制，用于测验一个人的观察力及清晰思维能力。本版本为简版，包含15道图形推理题，适合快速评估逻辑推理能力。',
    suitablePopulation: '16岁以上，希望了解自身逻辑推理能力的人群',
    testDuration: '约10-15分钟',
    questionCount: 15,
    icon: 'Cpu',
    color: '#67C23A',
    questions: [
      { id: 1, text: '1, 4, 9, 16, 25, ?', options: [{ text: '30', score: 0 }, { text: '36', score: 1 }, { text: '35', score: 0 }, { text: '49', score: 0 }] },
      { id: 2, text: '2, 4, 8, 16, 32, ?', options: [{ text: '48', score: 0 }, { text: '64', score: 1 }, { text: '56', score: 0 }, { text: '40', score: 0 }] },
      { id: 3, text: '1, 1, 2, 3, 5, 8, ?', options: [{ text: '11', score: 0 }, { text: '12', score: 0 }, { text: '13', score: 1 }, { text: '14', score: 0 }] },
      { id: 4, text: '如果所有的A都是B，所有的B都是C，那么：', options: [{ text: '所有的C都是A', score: 0 }, { text: '所有的A都是C', score: 1 }, { text: '有些C不是A', score: 0 }, { text: '有些A不是C', score: 0 }] },
      { id: 5, text: '3, 6, 11, 18, 27, ?', options: [{ text: '36', score: 0 }, { text: '38', score: 1 }, { text: '35', score: 0 }, { text: '34', score: 0 }] },
      { id: 6, text: '15, 12, 9, 6, 3, ?', options: [{ text: '0', score: 1 }, { text: '1', score: 0 }, { text: '2', score: 0 }, { text: '-1', score: 0 }] },
      { id: 7, text: '甲比乙高，乙比丙矮，丙比甲高，丁最高。请问谁最矮？', options: [{ text: '甲', score: 0 }, { text: '乙', score: 1 }, { text: '丙', score: 0 }, { text: '丁', score: 0 }] },
      { id: 8, text: '1, 3, 6, 10, 15, ?', options: [{ text: '20', score: 0 }, { text: '21', score: 1 }, { text: '22', score: 0 }, { text: '19', score: 0 }] },
      { id: 9, text: '如果"所有的猫都会捉老鼠"是真的，那么以下哪项一定是真的？', options: [{ text: '不会捉老鼠的不是猫', score: 1 }, { text: '会捉老鼠的都是猫', score: 0 }, { text: '不是猫的都不会捉老鼠', score: 0 }, { text: '有些猫不会捉老鼠', score: 0 }] },
      { id: 10, text: '2, 5, 10, 17, 26, ?', options: [{ text: '35', score: 0 }, { text: '37', score: 1 }, { text: '36', score: 0 }, { text: '38', score: 0 }] },
      { id: 11, text: '100, 81, 64, 49, 36, ?', options: [{ text: '30', score: 0 }, { text: '25', score: 1 }, { text: '20', score: 0 }, { text: '16', score: 0 }] },
      { id: 12, text: '小明在超市排队，前面有3个人，后面有5个人，请问队伍一共有多少人？', options: [{ text: '8人', score: 0 }, { text: '9人', score: 1 }, { text: '7人', score: 0 }, { text: '10人', score: 0 }] },
      { id: 13, text: '1, 2, 4, 7, 11, ?', options: [{ text: '14', score: 0 }, { text: '15', score: 0 }, { text: '16', score: 1 }, { text: '17', score: 0 }] },
      { id: 14, text: '有20名运动员参加单打淘汰赛，要决出冠军需要多少场比赛？', options: [{ text: '10场', score: 0 }, { text: '19场', score: 1 }, { text: '20场', score: 0 }, { text: '15场', score: 0 }] },
      { id: 15, text: '如果今天是星期五，那么100天后是星期几？', options: [{ text: '星期日', score: 1 }, { text: '星期一', score: 0 }, { text: '星期二', score: 0 }, { text: '星期三', score: 0 }] }
    ],
    resultInterpretations: [
      { minScore: 0, maxScore: 5, level: '逻辑思维能力待提高', description: '您的逻辑推理能力有较大提升空间，建议加强训练。', suggestion: '多玩益智游戏（如数独、谜题），阅读逻辑学相关书籍，练习分析问题的能力。' },
      { minScore: 6, maxScore: 9, level: '中等水平', description: '您的逻辑推理能力处于中等水平，有一定的思维基础。', suggestion: '继续保持对问题的思考习惯，可以尝试更复杂的逻辑题目来提升能力。' },
      { minScore: 10, maxScore: 12, level: '良好水平', description: '您的逻辑推理能力良好，能够较好地分析和解决问题。', suggestion: '您具备良好的思维能力，可以尝试更具挑战性的智力题，保持大脑活跃。' },
      { minScore: 13, maxScore: 15, level: '优秀水平', description: '您的逻辑推理能力非常出色，具备很强的分析和解决问题的能力。', suggestion: '您具备优秀的逻辑思维能力，可以在需要高度分析能力的领域发挥优势。' }
    ],
    scoringInstructions: '本测试共15道题，每答对一题得1分，答错不得分。总分范围0-15分。分数越高表示逻辑推理能力越强。请注意，此简版测试仅供娱乐和初步参考，如需专业智力评估请咨询专业机构。'
  },
  {
    id: 'pss',
    name: '压力知觉量表 PSS',
    category: 'stress',
    description: '了解您近期感受到的压力水平，评估压力影响',
    fullDescription: '压力知觉量表（Perceived Stress Scale，简称PSS）由Cohen等人于1983年编制，是目前广泛使用的压力测评工具。该量表测量个体对生活情境的压力感知程度，帮助您了解自己近期感受到的压力水平。本版本为10题简版。',
    suitablePopulation: '16岁以上，希望了解自身压力水平的人群',
    testDuration: '约3-5分钟',
    questionCount: 10,
    icon: 'Warning',
    color: '#F56C6C',
    questions: [
      { id: 1, text: '近一个月来，你是否经常感到无法控制生活中重要的事情？', options: [{ text: '从不', score: 0 }, { text: '几乎不', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 2, text: '近一个月来，你是否经常感到紧张或有压力？', options: [{ text: '从不', score: 0 }, { text: '几乎不', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 3, text: '近一个月来，你是否经常感到事情的发展超出你的预期？', options: [{ text: '从不', score: 0 }, { text: '几乎不', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 4, text: '近一个月来，你是否经常感到对处理个人问题的能力没有信心？', options: [{ text: '从不', score: 0 }, { text: '几乎不', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 5, text: '近一个月来，你是否经常感到事情的发展不顺心？', options: [{ text: '从不', score: 0 }, { text: '几乎不', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] },
      { id: 6, text: '近一个月来，你是否经常感到能够有效地应对生活中重要的变化？', options: [{ text: '从不', score: 4 }, { text: '几乎不', score: 3 }, { text: '有时', score: 2 }, { text: '经常', score: 1 }, { text: '总是', score: 0 }], reverse: true },
      { id: 7, text: '近一个月来，你是否经常感到能够控制自己的烦躁情绪？', options: [{ text: '从不', score: 4 }, { text: '几乎不', score: 3 }, { text: '有时', score: 2 }, { text: '经常', score: 1 }, { text: '总是', score: 0 }], reverse: true },
      { id: 8, text: '近一个月来，你是否经常感到对事情的进展感到满意？', options: [{ text: '从不', score: 4 }, { text: '几乎不', score: 3 }, { text: '有时', score: 2 }, { text: '经常', score: 1 }, { text: '总是', score: 0 }], reverse: true },
      { id: 9, text: '近一个月来，你是否经常感到能够应对发生的困难？', options: [{ text: '从不', score: 4 }, { text: '几乎不', score: 3 }, { text: '有时', score: 2 }, { text: '经常', score: 1 }, { text: '总是', score: 0 }], reverse: true },
      { id: 10, text: '近一个月来，你是否经常感到事情太多，难以招架？', options: [{ text: '从不', score: 0 }, { text: '几乎不', score: 1 }, { text: '有时', score: 2 }, { text: '经常', score: 3 }, { text: '总是', score: 4 }] }
    ],
    resultInterpretations: [
      { minScore: 0, maxScore: 13, level: '压力较低', description: '您目前的压力水平较低，生活状态相对轻松。', suggestion: '继续保持良好的生活节奏，适度挑战自己，保持生活的充实感。' },
      { minScore: 14, maxScore: 26, level: '中度压力', description: '您感受到一定程度的压力，但在可承受范围内。', suggestion: '注意劳逸结合，合理安排工作和休息时间，培养健康的减压方式。' },
      { minScore: 27, maxScore: 40, level: '压力较高', description: '您目前感受到较高的压力，需要关注自己的身心健康。', suggestion: '建议您找出压力来源，尝试调整生活节奏，学会说"不"。如感到难以应对，可寻求他人的支持和帮助。' }
    ],
    scoringInstructions: 'PSS-10采用0-4级评分，其中4道题为反向计分。将所有题目得分相加即为总分，范围0-40分。分数越高表示感受到的压力越大。'
  }
]

export const categoryInfo = {
  emotion: { name: '情绪情感', icon: 'Heart' },
  intelligence: { name: '智力认知', icon: 'Cpu' },
  personality: { name: '人格特质', icon: 'User' },
  stress: { name: '压力应对', icon: 'Warning' }
}

export function calculateScore(scale: PsychologyScale, answers: Map<number, number>): number {
  let totalScore = 0
  scale.questions.forEach((question) => {
    const answerScore = answers.get(question.id) || 0
    if (question.reverse) {
      const maxScore = question.options.length
      totalScore += (maxScore + 1 - answerScore)
    } else {
      totalScore += answerScore
    }
  })
  return totalScore
}

export function calculateStandardScore(rawScore: number, scaleId: string): number {
  if (scaleId === 'sds' || scaleId === 'sas') {
    return Math.round(rawScore * 1.25)
  }
  return rawScore
}

export function getResultInterpretation(scale: PsychologyScale, totalScore: number): ResultInterpretation {
  const score = calculateStandardScore(totalScore, scale.id)
  for (const interpretation of scale.resultInterpretations) {
    if (score >= interpretation.minScore && score <= interpretation.maxScore) {
      return interpretation
    }
  }
  return scale.resultInterpretations[scale.resultInterpretations.length - 1]
}

export function calculateEmotionScreeningResult(answers: Map<number, number>): EmotionScreeningResult {
  const screeningScale = psychologyScales.find(s => s.id === 'emotion-screening')
  if (!screeningScale) {
    return {
      depressionScore: 0,
      anxietyScore: 0,
      primaryTendency: 'none',
      recommendedScale: 'sds',
      description: '无法计算筛查结果'
    }
  }

  let depressionScore = 0
  let anxietyScore = 0

  screeningScale.questions.forEach((question) => {
    const answerScore = answers.get(question.id) || 0
    const q = question as ScreeningQuestion
    if (q.dimension === 'depression') {
      depressionScore += answerScore
    } else if (q.dimension === 'anxiety') {
      anxietyScore += answerScore
    }
  })

  let primaryTendency: 'depression' | 'anxiety' | 'both' | 'none' = 'none'
  let recommendedScale = 'sds'
  let description = ''

  const totalScore = depressionScore + anxietyScore

  if (totalScore <= 2) {
    primaryTendency = 'none'
    recommendedScale = 'sds'
    description = '您的情绪状态整体良好，没有明显的抑郁或焦虑症状倾向。'
  } else {
    const diff = Math.abs(depressionScore - anxietyScore)
    if (depressionScore >= 3 && anxietyScore >= 3) {
      if (diff <= 1) {
        primaryTendency = 'both'
        recommendedScale = 'sds'
        description = `您的抑郁倾向（${depressionScore}/9）和焦虑倾向（${anxietyScore}/9）都较为明显，建议先进行抑郁测评，后续可补充焦虑测评。`
      } else if (depressionScore > anxietyScore) {
        primaryTendency = 'depression'
        recommendedScale = 'sds'
        description = `您的抑郁倾向（${depressionScore}/9）比焦虑倾向（${anxietyScore}/9）更为明显，建议先进行抑郁自评量表（SDS）。`
      } else {
        primaryTendency = 'anxiety'
        recommendedScale = 'sas'
        description = `您的焦虑倾向（${anxietyScore}/9）比抑郁倾向（${depressionScore}/9）更为明显，建议先进行焦虑自评量表（SAS）。`
      }
    } else if (depressionScore >= 3) {
      primaryTendency = 'depression'
      recommendedScale = 'sds'
      description = `您表现出较明显的抑郁倾向（${depressionScore}/9），建议进行抑郁自评量表（SDS）。`
    } else if (anxietyScore >= 3) {
      primaryTendency = 'anxiety'
      recommendedScale = 'sas'
      description = `您表现出较明显的焦虑倾向（${anxietyScore}/9），建议进行焦虑自评量表（SAS）。`
    } else {
      primaryTendency = 'none'
      recommendedScale = 'sds'
      description = '您有一些轻度情绪困扰，可根据自身感受选择任一量表进行详细测评。'
    }
  }

  return {
    depressionScore,
    anxietyScore,
    primaryTendency,
    recommendedScale,
    description
  }
}
