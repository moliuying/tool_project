export interface CharacterComponent {
  name: string
  meaning?: string
  strokeCount?: number
  radical?: boolean
}

export interface CharacterDecomposition {
  char: string
  pinyin: string[]
  meaning: string
  strokeCount: number
  radical: string
  radicalStrokeCount: number
  structure: string
  components: CharacterComponent[]
  decompositionTree: {
    level: number
    parts: string[]
  }[]
  order: string[]
  words?: string[]
}

export const characterDatabase: Record<string, CharacterDecomposition> = {
  '好': {
    char: '好',
    pinyin: ['hǎo', 'hào'],
    meaning: '美好、优良；喜爱',
    strokeCount: 6,
    radical: '女',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '女', meaning: '女性、女子', strokeCount: 3, radical: true },
      { name: '子', meaning: '孩子、儿子', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['好'] },
      { level: 2, parts: ['女', '子'] }
    ],
    order: ['女', '子'],
    words: ['好人', '美好', '爱好', '好事']
  },
  '明': {
    char: '明',
    pinyin: ['míng'],
    meaning: '明亮、明白、公开',
    strokeCount: 8,
    radical: '日',
    radicalStrokeCount: 4,
    structure: '左右结构',
    components: [
      { name: '日', meaning: '太阳、日子', strokeCount: 4, radical: true },
      { name: '月', meaning: '月亮、月份', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['明'] },
      { level: 2, parts: ['日', '月'] }
    ],
    order: ['日', '月'],
    words: ['明天', '聪明', '光明', '明白']
  },
  '林': {
    char: '林',
    pinyin: ['lín'],
    meaning: '树林、森林',
    strokeCount: 8,
    radical: '木',
    radicalStrokeCount: 4,
    structure: '左右结构',
    components: [
      { name: '木', meaning: '树木、木头', strokeCount: 4, radical: true },
      { name: '木', meaning: '树木、木头', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['林'] },
      { level: 2, parts: ['木', '木'] }
    ],
    order: ['木', '木'],
    words: ['森林', '树林', '林木', '林海']
  },
  '森': {
    char: '森',
    pinyin: ['sēn'],
    meaning: '树木众多、茂密',
    strokeCount: 12,
    radical: '木',
    radicalStrokeCount: 4,
    structure: '品字结构',
    components: [
      { name: '木', meaning: '树木', strokeCount: 4, radical: true },
      { name: '木', meaning: '树木', strokeCount: 4, radical: true },
      { name: '木', meaning: '树木', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['森'] },
      { level: 2, parts: ['木', '林'] },
      { level: 3, parts: ['木', '木', '木'] }
    ],
    order: ['木', '木', '木'],
    words: ['森林', '森严', '阴森', '森罗']
  },
  '休': {
    char: '休',
    pinyin: ['xiū'],
    meaning: '休息、停止',
    strokeCount: 6,
    radical: '亻',
    radicalStrokeCount: 2,
    structure: '左右结构',
    components: [
      { name: '亻', meaning: '人字旁，表示与人有关', strokeCount: 2, radical: true },
      { name: '木', meaning: '树木', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['休'] },
      { level: 2, parts: ['亻', '木'] }
    ],
    order: ['亻', '木'],
    words: ['休息', '休假', '退休', '休学']
  },
  '从': {
    char: '从',
    pinyin: ['cóng'],
    meaning: '跟随、顺从',
    strokeCount: 4,
    radical: '人',
    radicalStrokeCount: 2,
    structure: '左右结构',
    components: [
      { name: '人', meaning: '人', strokeCount: 2, radical: true },
      { name: '人', meaning: '人', strokeCount: 2, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['从'] },
      { level: 2, parts: ['人', '人'] }
    ],
    order: ['人', '人'],
    words: ['从前', '从来', '服从', '跟从']
  },
  '众': {
    char: '众',
    pinyin: ['zhòng'],
    meaning: '许多人、众人',
    strokeCount: 6,
    radical: '人',
    radicalStrokeCount: 2,
    structure: '品字结构',
    components: [
      { name: '人', meaning: '人', strokeCount: 2, radical: true },
      { name: '从', meaning: '跟随', strokeCount: 4, radical: false }
    ],
    decompositionTree: [
      { level: 1, parts: ['众'] },
      { level: 2, parts: ['人', '从'] },
      { level: 3, parts: ['人', '人', '人'] }
    ],
    order: ['人', '人', '人'],
    words: ['众人', '群众', '众多', '大众']
  },
  '炎': {
    char: '炎',
    pinyin: ['yán'],
    meaning: '炎热、火焰',
    strokeCount: 8,
    radical: '火',
    radicalStrokeCount: 4,
    structure: '上下结构',
    components: [
      { name: '火', meaning: '火焰', strokeCount: 4, radical: true },
      { name: '火', meaning: '火焰', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['炎'] },
      { level: 2, parts: ['火', '火'] }
    ],
    order: ['火', '火'],
    words: ['炎热', '发炎', '火焰', '烈日炎炎']
  },
  '鑫': {
    char: '鑫',
    pinyin: ['xīn'],
    meaning: '金多、兴盛',
    strokeCount: 24,
    radical: '金',
    radicalStrokeCount: 8,
    structure: '品字结构',
    components: [
      { name: '金', meaning: '黄金、金属', strokeCount: 8, radical: true },
      { name: '金', meaning: '黄金、金属', strokeCount: 8, radical: true },
      { name: '金', meaning: '黄金、金属', strokeCount: 8, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['鑫'] },
      { level: 2, parts: ['金', '金', '金'] }
    ],
    order: ['金', '金', '金'],
    words: ['鑫源', '鑫盛', '金鑫']
  },
  '磊': {
    char: '磊',
    pinyin: ['lěi'],
    meaning: '石头堆积、光明磊落',
    strokeCount: 15,
    radical: '石',
    radicalStrokeCount: 5,
    structure: '品字结构',
    components: [
      { name: '石', meaning: '石头', strokeCount: 5, radical: true },
      { name: '石', meaning: '石头', strokeCount: 5, radical: true },
      { name: '石', meaning: '石头', strokeCount: 5, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['磊'] },
      { level: 2, parts: ['石', '石', '石'] }
    ],
    order: ['石', '石', '石'],
    words: ['光明磊落', '磊落', '磊磊']
  },
  '品': {
    char: '品',
    pinyin: ['pǐn'],
    meaning: '物品、品质、等级',
    strokeCount: 9,
    radical: '口',
    radicalStrokeCount: 3,
    structure: '品字结构',
    components: [
      { name: '口', meaning: '嘴巴、入口', strokeCount: 3, radical: true },
      { name: '口', meaning: '嘴巴、入口', strokeCount: 3, radical: true },
      { name: '口', meaning: '嘴巴、入口', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['品'] },
      { level: 2, parts: ['口', '口', '口'] }
    ],
    order: ['口', '口', '口'],
    words: ['品质', '产品', '品味', '人品']
  },
  '晶': {
    char: '晶',
    pinyin: ['jīng'],
    meaning: '光亮、晶体',
    strokeCount: 12,
    radical: '日',
    radicalStrokeCount: 4,
    structure: '品字结构',
    components: [
      { name: '日', meaning: '太阳、日子', strokeCount: 4, radical: true },
      { name: '日', meaning: '太阳、日子', strokeCount: 4, radical: true },
      { name: '日', meaning: '太阳、日子', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['晶'] },
      { level: 2, parts: ['日', '日', '日'] }
    ],
    order: ['日', '日', '日'],
    words: ['水晶', '晶体', '晶莹', '亮晶晶']
  },
  '犇': {
    char: '犇',
    pinyin: ['bēn'],
    meaning: '奔跑、急走',
    strokeCount: 12,
    radical: '牛',
    radicalStrokeCount: 4,
    structure: '品字结构',
    components: [
      { name: '牛', meaning: '牛', strokeCount: 4, radical: true },
      { name: '牛', meaning: '牛', strokeCount: 4, radical: true },
      { name: '牛', meaning: '牛', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['犇'] },
      { level: 2, parts: ['牛', '牛', '牛'] }
    ],
    order: ['牛', '牛', '牛'],
    words: ['犇跑', '犇腾']
  },
  '骉': {
    char: '骉',
    pinyin: ['biāo'],
    meaning: '众马奔腾的样子',
    strokeCount: 9,
    radical: '马',
    radicalStrokeCount: 3,
    structure: '品字结构',
    components: [
      { name: '马', meaning: '马', strokeCount: 3, radical: true },
      { name: '马', meaning: '马', strokeCount: 3, radical: true },
      { name: '马', meaning: '马', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['骉'] },
      { level: 2, parts: ['马', '马', '马'] }
    ],
    order: ['马', '马', '马'],
    words: ['骉骉']
  },
  '羴': {
    char: '羴',
    pinyin: ['shān'],
    meaning: '羊肉的气味',
    strokeCount: 18,
    radical: '羊',
    radicalStrokeCount: 6,
    structure: '品字结构',
    components: [
      { name: '羊', meaning: '羊', strokeCount: 6, radical: true },
      { name: '羊', meaning: '羊', strokeCount: 6, radical: true },
      { name: '羊', meaning: '羊', strokeCount: 6, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['羴'] },
      { level: 2, parts: ['羊', '羊', '羊'] }
    ],
    order: ['羊', '羊', '羊'],
    words: ['膻气', '膻味']
  },
  '国': {
    char: '国',
    pinyin: ['guó'],
    meaning: '国家、国土',
    strokeCount: 8,
    radical: '囗',
    radicalStrokeCount: 3,
    structure: '全包围结构',
    components: [
      { name: '囗', meaning: '围框，表示包围', strokeCount: 3, radical: true },
      { name: '玉', meaning: '玉石、宝玉', strokeCount: 5, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['国'] },
      { level: 2, parts: ['囗', '玉'] }
    ],
    order: ['囗', '玉'],
    words: ['国家', '中国', '国土', '国王']
  },
  '想': {
    char: '想',
    pinyin: ['xiǎng'],
    meaning: '思考、想念',
    strokeCount: 13,
    radical: '心',
    radicalStrokeCount: 4,
    structure: '上下结构',
    components: [
      { name: '相', meaning: '互相、相貌', strokeCount: 9, radical: false },
      { name: '心', meaning: '心脏、思想', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['想'] },
      { level: 2, parts: ['相', '心'] },
      { level: 3, parts: ['木', '目', '心'] }
    ],
    order: ['木', '目', '心'],
    words: ['想念', '思想', '想象', '理想']
  },
  '相': {
    char: '相',
    pinyin: ['xiāng', 'xiàng'],
    meaning: '互相、相貌',
    strokeCount: 9,
    radical: '木',
    radicalStrokeCount: 4,
    structure: '左右结构',
    components: [
      { name: '木', meaning: '树木', strokeCount: 4, radical: true },
      { name: '目', meaning: '眼睛', strokeCount: 5, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['相'] },
      { level: 2, parts: ['木', '目'] }
    ],
    order: ['木', '目'],
    words: ['互相', '相信', '照相', '相貌']
  },
  '看': {
    char: '看',
    pinyin: ['kàn', 'kān'],
    meaning: '观看、看守',
    strokeCount: 9,
    radical: '目',
    radicalStrokeCount: 5,
    structure: '半包围结构',
    components: [
      { name: '龵', meaning: '手的变形', strokeCount: 4, radical: false },
      { name: '目', meaning: '眼睛', strokeCount: 5, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['看'] },
      { level: 2, parts: ['龵', '目'] }
    ],
    order: ['龵', '目'],
    words: ['看见', '看书', '看守', '查看']
  },
  '泪': {
    char: '泪',
    pinyin: ['lèi'],
    meaning: '眼泪、泪水',
    strokeCount: 8,
    radical: '氵',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '氵', meaning: '三点水，表示与水有关', strokeCount: 3, radical: true },
      { name: '目', meaning: '眼睛', strokeCount: 5, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['泪'] },
      { level: 2, parts: ['氵', '目'] }
    ],
    order: ['氵', '目'],
    words: ['眼泪', '泪水', '流泪', '泪光']
  },
  '河': {
    char: '河',
    pinyin: ['hé'],
    meaning: '河流',
    strokeCount: 8,
    radical: '氵',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '氵', meaning: '三点水，表示与水有关', strokeCount: 3, radical: true },
      { name: '可', meaning: '可以', strokeCount: 5, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['河'] },
      { level: 2, parts: ['氵', '可'] }
    ],
    order: ['氵', '可'],
    words: ['河流', '黄河', '江河', '河水']
  },
  '湖': {
    char: '湖',
    pinyin: ['hú'],
    meaning: '湖泊',
    strokeCount: 12,
    radical: '氵',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '氵', meaning: '三点水，表示与水有关', strokeCount: 3, radical: true },
      { name: '胡', meaning: '胡须、胡乱', strokeCount: 9, radical: false }
    ],
    decompositionTree: [
      { level: 1, parts: ['湖'] },
      { level: 2, parts: ['氵', '胡'] },
      { level: 3, parts: ['氵', '古', '月'] }
    ],
    order: ['氵', '古', '月'],
    words: ['湖泊', '西湖', '湖水', '江湖']
  },
  '胡': {
    char: '胡',
    pinyin: ['hú'],
    meaning: '胡须、少数民族、胡乱',
    strokeCount: 9,
    radical: '月',
    radicalStrokeCount: 4,
    structure: '左右结构',
    components: [
      { name: '古', meaning: '古老、古代', strokeCount: 5, radical: true },
      { name: '月', meaning: '月亮、月份', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['胡'] },
      { level: 2, parts: ['古', '月'] }
    ],
    order: ['古', '月'],
    words: ['胡须', '胡同', '胡人', '二胡']
  },
  '打': {
    char: '打',
    pinyin: ['dǎ', 'dá'],
    meaning: '击打、制作',
    strokeCount: 5,
    radical: '扌',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '扌', meaning: '提手旁，表示与手有关', strokeCount: 3, radical: true },
      { name: '丁', meaning: '钉子、成年男子', strokeCount: 2, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['打'] },
      { level: 2, parts: ['扌', '丁'] }
    ],
    order: ['扌', '丁'],
    words: ['打球', '打开', '打扫', '打扮']
  },
  '吃': {
    char: '吃',
    pinyin: ['chī'],
    meaning: '进食、吃饭',
    strokeCount: 6,
    radical: '口',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '口', meaning: '嘴巴、入口', strokeCount: 3, radical: true },
      { name: '乞', meaning: '乞求', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['吃'] },
      { level: 2, parts: ['口', '乞'] }
    ],
    order: ['口', '乞'],
    words: ['吃饭', '喝水', '吃喝', '口吃']
  },
  '妈': {
    char: '妈',
    pinyin: ['mā'],
    meaning: '母亲、妈妈',
    strokeCount: 6,
    radical: '女',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '女', meaning: '女性、女子', strokeCount: 3, radical: true },
      { name: '马', meaning: '马', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['妈'] },
      { level: 2, parts: ['女', '马'] }
    ],
    order: ['女', '马'],
    words: ['妈妈', '大妈', '姑妈', '姨妈']
  },
  '爸': {
    char: '爸',
    pinyin: ['bà'],
    meaning: '父亲、爸爸',
    strokeCount: 8,
    radical: '父',
    radicalStrokeCount: 4,
    structure: '上下结构',
    components: [
      { name: '父', meaning: '父亲', strokeCount: 4, radical: true },
      { name: '巴', meaning: '黏着、盼望', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['爸'] },
      { level: 2, parts: ['父', '巴'] }
    ],
    order: ['父', '巴'],
    words: ['爸爸', '老爸', '干爸', '阿爸']
  },
  '花': {
    char: '花',
    pinyin: ['huā'],
    meaning: '花朵、花费',
    strokeCount: 7,
    radical: '艹',
    radicalStrokeCount: 3,
    structure: '上下结构',
    components: [
      { name: '艹', meaning: '草字头，表示与植物有关', strokeCount: 3, radical: true },
      { name: '化', meaning: '变化、融化', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['花'] },
      { level: 2, parts: ['艹', '化'] },
      { level: 3, parts: ['艹', '亻', '匕'] }
    ],
    order: ['艹', '亻', '匕'],
    words: ['花朵', '鲜花', '花园', '花钱']
  },
  '草': {
    char: '草',
    pinyin: ['cǎo'],
    meaning: '草本植物',
    strokeCount: 9,
    radical: '艹',
    radicalStrokeCount: 3,
    structure: '上下结构',
    components: [
      { name: '艹', meaning: '草字头，表示与植物有关', strokeCount: 3, radical: true },
      { name: '早', meaning: '早晨、提早', strokeCount: 6, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['草'] },
      { level: 2, parts: ['艹', '早'] },
      { level: 3, parts: ['艹', '日', '十'] }
    ],
    order: ['艹', '日', '十'],
    words: ['小草', '草地', '青草', '花草']
  },
  '树': {
    char: '树',
    pinyin: ['shù'],
    meaning: '树木',
    strokeCount: 9,
    radical: '木',
    radicalStrokeCount: 4,
    structure: '左中右结构',
    components: [
      { name: '木', meaning: '树木', strokeCount: 4, radical: true },
      { name: '又', meaning: '又、再', strokeCount: 2, radical: true },
      { name: '寸', meaning: '寸、长度单位', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['树'] },
      { level: 2, parts: ['木', '尌'] },
      { level: 3, parts: ['木', '又', '寸'] }
    ],
    order: ['木', '又', '寸'],
    words: ['树木', '大树', '树叶', '树林']
  },
  '字': {
    char: '字',
    pinyin: ['zì'],
    meaning: '文字、汉字',
    strokeCount: 6,
    radical: '子',
    radicalStrokeCount: 3,
    structure: '上下结构',
    components: [
      { name: '宀', meaning: '宝盖头，表示房屋', strokeCount: 3, radical: true },
      { name: '子', meaning: '孩子', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['字'] },
      { level: 2, parts: ['宀', '子'] }
    ],
    order: ['宀', '子'],
    words: ['汉字', '文字', '写字', '字体']
  },
  '家': {
    char: '家',
    pinyin: ['jiā', 'jia'],
    meaning: '家庭、住所',
    strokeCount: 10,
    radical: '宀',
    radicalStrokeCount: 3,
    structure: '上下结构',
    components: [
      { name: '宀', meaning: '宝盖头，表示房屋', strokeCount: 3, radical: true },
      { name: '豕', meaning: '猪', strokeCount: 7, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['家'] },
      { level: 2, parts: ['宀', '豕'] }
    ],
    order: ['宀', '豕'],
    words: ['家庭', '国家', '大家', '家乡']
  },
  '安': {
    char: '安',
    pinyin: ['ān'],
    meaning: '安全、安定',
    strokeCount: 6,
    radical: '宀',
    radicalStrokeCount: 3,
    structure: '上下结构',
    components: [
      { name: '宀', meaning: '宝盖头，表示房屋', strokeCount: 3, radical: true },
      { name: '女', meaning: '女性', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['安'] },
      { level: 2, parts: ['宀', '女'] }
    ],
    order: ['宀', '女'],
    words: ['安全', '平安', '安静', '安心']
  },
  '学': {
    char: '学',
    pinyin: ['xué'],
    meaning: '学习、学问',
    strokeCount: 8,
    radical: '子',
    radicalStrokeCount: 3,
    structure: '上下结构',
    components: [
      { name: '⺍', meaning: '学字头', strokeCount: 3, radical: false },
      { name: '冖', meaning: '秃宝盖', strokeCount: 2, radical: false },
      { name: '子', meaning: '孩子', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['学'] },
      { level: 2, parts: ['⺍', '子'] },
      { level: 3, parts: ['⺍', '冖', '子'] }
    ],
    order: ['⺍', '冖', '子'],
    words: ['学习', '学生', '学校', '学问']
  },
  '校': {
    char: '校',
    pinyin: ['xiào', 'jiào'],
    meaning: '学校、校对',
    strokeCount: 10,
    radical: '木',
    radicalStrokeCount: 4,
    structure: '左右结构',
    components: [
      { name: '木', meaning: '树木', strokeCount: 4, radical: true },
      { name: '交', meaning: '交叉、交往', strokeCount: 6, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['校'] },
      { level: 2, parts: ['木', '交'] },
      { level: 3, parts: ['木', '亠', '父'] }
    ],
    order: ['木', '亠', '父'],
    words: ['学校', '校园', '校长', '校对']
  },
  '时': {
    char: '时',
    pinyin: ['shí'],
    meaning: '时间、时候',
    strokeCount: 7,
    radical: '日',
    radicalStrokeCount: 4,
    structure: '左右结构',
    components: [
      { name: '日', meaning: '太阳、日子', strokeCount: 4, radical: true },
      { name: '寸', meaning: '寸、长度单位', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['时'] },
      { level: 2, parts: ['日', '寸'] }
    ],
    order: ['日', '寸'],
    words: ['时间', '小时', '时候', '时光']
  },
  '间': {
    char: '间',
    pinyin: ['jiān', 'jiàn'],
    meaning: '中间、房间',
    strokeCount: 7,
    radical: '门',
    radicalStrokeCount: 3,
    structure: '半包围结构',
    components: [
      { name: '门', meaning: '门户', strokeCount: 3, radical: true },
      { name: '日', meaning: '太阳、日子', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['间'] },
      { level: 2, parts: ['门', '日'] }
    ],
    order: ['门', '日'],
    words: ['中间', '房间', '时间', '空间']
  },
  '问': {
    char: '问',
    pinyin: ['wèn'],
    meaning: '询问、问题',
    strokeCount: 6,
    radical: '门',
    radicalStrokeCount: 3,
    structure: '半包围结构',
    components: [
      { name: '门', meaning: '门户', strokeCount: 3, radical: true },
      { name: '口', meaning: '嘴巴', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['问'] },
      { level: 2, parts: ['门', '口'] }
    ],
    order: ['门', '口'],
    words: ['问题', '提问', '问答', '访问']
  },
  '闻': {
    char: '闻',
    pinyin: ['wén'],
    meaning: '听到、闻到',
    strokeCount: 9,
    radical: '门',
    radicalStrokeCount: 3,
    structure: '半包围结构',
    components: [
      { name: '门', meaning: '门户', strokeCount: 3, radical: true },
      { name: '耳', meaning: '耳朵', strokeCount: 6, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['闻'] },
      { level: 2, parts: ['门', '耳'] }
    ],
    order: ['门', '耳'],
    words: ['新闻', '闻名', '听闻', '闻到']
  },
  '闷': {
    char: '闷',
    pinyin: ['mēn', 'mèn'],
    meaning: '闷热、烦闷',
    strokeCount: 7,
    radical: '门',
    radicalStrokeCount: 3,
    structure: '半包围结构',
    components: [
      { name: '门', meaning: '门户', strokeCount: 3, radical: true },
      { name: '心', meaning: '心脏、心情', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['闷'] },
      { level: 2, parts: ['门', '心'] }
    ],
    order: ['门', '心'],
    words: ['闷热', '烦闷', '纳闷', '闷气']
  },
  '闪': {
    char: '闪',
    pinyin: ['shǎn'],
    meaning: '闪烁、闪避',
    strokeCount: 5,
    radical: '门',
    radicalStrokeCount: 3,
    structure: '半包围结构',
    components: [
      { name: '门', meaning: '门户', strokeCount: 3, radical: true },
      { name: '人', meaning: '人', strokeCount: 2, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['闪'] },
      { level: 2, parts: ['门', '人'] }
    ],
    order: ['门', '人'],
    words: ['闪电', '闪光', '闪烁', '躲闪']
  },
  '和': {
    char: '和',
    pinyin: ['hé', 'hè', 'huó', 'huò', 'hú'],
    meaning: '和平、和谐',
    strokeCount: 8,
    radical: '禾',
    radicalStrokeCount: 5,
    structure: '左右结构',
    components: [
      { name: '禾', meaning: '禾苗、谷物', strokeCount: 5, radical: true },
      { name: '口', meaning: '嘴巴', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['和'] },
      { level: 2, parts: ['禾', '口'] }
    ],
    order: ['禾', '口'],
    words: ['和平', '和谐', '温和', '总和']
  },
  '秋': {
    char: '秋',
    pinyin: ['qiū'],
    meaning: '秋天、秋季',
    strokeCount: 9,
    radical: '禾',
    radicalStrokeCount: 5,
    structure: '左右结构',
    components: [
      { name: '禾', meaning: '禾苗、谷物', strokeCount: 5, radical: true },
      { name: '火', meaning: '火焰', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['秋'] },
      { level: 2, parts: ['禾', '火'] }
    ],
    order: ['禾', '火'],
    words: ['秋天', '秋季', '秋风', '秋雨']
  },
  '种': {
    char: '种',
    pinyin: ['zhǒng', 'zhòng'],
    meaning: '种子、种植',
    strokeCount: 9,
    radical: '禾',
    radicalStrokeCount: 5,
    structure: '左右结构',
    components: [
      { name: '禾', meaning: '禾苗、谷物', strokeCount: 5, radical: true },
      { name: '中', meaning: '中间、中心', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['种'] },
      { level: 2, parts: ['禾', '中'] }
    ],
    order: ['禾', '中'],
    words: ['种子', '种植', '种类', '各种']
  },
  '香': {
    char: '香',
    pinyin: ['xiāng'],
    meaning: '香味、芳香',
    strokeCount: 9,
    radical: '香',
    radicalStrokeCount: 9,
    structure: '上下结构',
    components: [
      { name: '禾', meaning: '禾苗、谷物', strokeCount: 5, radical: true },
      { name: '日', meaning: '太阳', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['香'] },
      { level: 2, parts: ['禾', '日'] }
    ],
    order: ['禾', '日'],
    words: ['香味', '香水', '香气', '花香']
  },
  '红': {
    char: '红',
    pinyin: ['hóng', 'gōng'],
    meaning: '红色、喜庆',
    strokeCount: 6,
    radical: '纟',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '纟', meaning: '绞丝旁，表示与丝有关', strokeCount: 3, radical: true },
      { name: '工', meaning: '工作、工人', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['红'] },
      { level: 2, parts: ['纟', '工'] }
    ],
    order: ['纟', '工'],
    words: ['红色', '红花', '红旗', '红火']
  },
  '绿': {
    char: '绿',
    pinyin: ['lǜ', 'lù'],
    meaning: '绿色',
    strokeCount: 11,
    radical: '纟',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '纟', meaning: '绞丝旁，表示与丝有关', strokeCount: 3, radical: true },
      { name: '录', meaning: '记录、录用', strokeCount: 8, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['绿'] },
      { level: 2, parts: ['纟', '录'] },
      { level: 3, parts: ['纟', '彐', '水'] }
    ],
    order: ['纟', '彐', '水'],
    words: ['绿色', '绿叶', '绿化', '青山绿水']
  },
  '请': {
    char: '请',
    pinyin: ['qǐng'],
    meaning: '请求、邀请',
    strokeCount: 10,
    radical: '讠',
    radicalStrokeCount: 2,
    structure: '左右结构',
    components: [
      { name: '讠', meaning: '言字旁，表示与说话有关', strokeCount: 2, radical: true },
      { name: '青', meaning: '青色、青年', strokeCount: 8, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['请'] },
      { level: 2, parts: ['讠', '青'] }
    ],
    order: ['讠', '青'],
    words: ['请客', '请求', '申请', '邀请']
  },
  '清': {
    char: '清',
    pinyin: ['qīng'],
    meaning: '清澈、清楚',
    strokeCount: 11,
    radical: '氵',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '氵', meaning: '三点水，表示与水有关', strokeCount: 3, radical: true },
      { name: '青', meaning: '青色、青年', strokeCount: 8, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['清'] },
      { level: 2, parts: ['氵', '青'] }
    ],
    order: ['氵', '青'],
    words: ['清水', '清楚', '清洁', '清晨']
  },
  '情': {
    char: '情',
    pinyin: ['qíng'],
    meaning: '感情、心情',
    strokeCount: 11,
    radical: '忄',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '忄', meaning: '竖心旁，表示与心理活动有关', strokeCount: 3, radical: true },
      { name: '青', meaning: '青色、青年', strokeCount: 8, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['情'] },
      { level: 2, parts: ['忄', '青'] }
    ],
    order: ['忄', '青'],
    words: ['感情', '心情', '爱情', '情况']
  },
  '晴': {
    char: '晴',
    pinyin: ['qíng'],
    meaning: '晴朗',
    strokeCount: 12,
    radical: '日',
    radicalStrokeCount: 4,
    structure: '左右结构',
    components: [
      { name: '日', meaning: '太阳', strokeCount: 4, radical: true },
      { name: '青', meaning: '青色、青年', strokeCount: 8, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['晴'] },
      { level: 2, parts: ['日', '青'] }
    ],
    order: ['日', '青'],
    words: ['晴天', '晴朗', '放晴', '雨过天晴']
  },
  '睛': {
    char: '睛',
    pinyin: ['jīng'],
    meaning: '眼睛',
    strokeCount: 13,
    radical: '目',
    radicalStrokeCount: 5,
    structure: '左右结构',
    components: [
      { name: '目', meaning: '眼睛', strokeCount: 5, radical: true },
      { name: '青', meaning: '青色、青年', strokeCount: 8, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['睛'] },
      { level: 2, parts: ['目', '青'] }
    ],
    order: ['目', '青'],
    words: ['眼睛', '定睛', '目不转睛', '火眼金睛']
  },
  '蜻': {
    char: '蜻',
    pinyin: ['qīng'],
    meaning: '蜻蜓',
    strokeCount: 14,
    radical: '虫',
    radicalStrokeCount: 6,
    structure: '左右结构',
    components: [
      { name: '虫', meaning: '昆虫', strokeCount: 6, radical: true },
      { name: '青', meaning: '青色、青年', strokeCount: 8, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['蜻'] },
      { level: 2, parts: ['虫', '青'] }
    ],
    order: ['虫', '青'],
    words: ['蜻蜓']
  },
  '大': {
    char: '大',
    pinyin: ['dà', 'dài', 'tài'],
    meaning: '大小、巨大',
    strokeCount: 3,
    radical: '大',
    radicalStrokeCount: 3,
    structure: '独体结构',
    components: [
      { name: '大', meaning: '大（独体字）', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['大'] }
    ],
    order: ['大'],
    words: ['大小', '大家', '伟大', '巨大']
  },
  '小': {
    char: '小',
    pinyin: ['xiǎo'],
    meaning: '微小',
    strokeCount: 3,
    radical: '小',
    radicalStrokeCount: 3,
    structure: '独体结构',
    components: [
      { name: '小', meaning: '小（独体字）', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['小'] }
    ],
    order: ['小'],
    words: ['大小', '小孩', '小心', '微小']
  },
  '人': {
    char: '人',
    pinyin: ['rén'],
    meaning: '人类',
    strokeCount: 2,
    radical: '人',
    radicalStrokeCount: 2,
    structure: '独体结构',
    components: [
      { name: '人', meaning: '人（独体字）', strokeCount: 2, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['人'] }
    ],
    order: ['人'],
    words: ['人民', '人们', '大人', '好人']
  },
  '日': {
    char: '日',
    pinyin: ['rì'],
    meaning: '太阳、日子',
    strokeCount: 4,
    radical: '日',
    radicalStrokeCount: 4,
    structure: '独体结构',
    components: [
      { name: '日', meaning: '日（独体字）', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['日'] }
    ],
    order: ['日'],
    words: ['日子', '太阳', '今日', '明日']
  },
  '月': {
    char: '月',
    pinyin: ['yuè'],
    meaning: '月亮、月份',
    strokeCount: 4,
    radical: '月',
    radicalStrokeCount: 4,
    structure: '独体结构',
    components: [
      { name: '月', meaning: '月（独体字）', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['月'] }
    ],
    order: ['月'],
    words: ['月亮', '月份', '月光', '明月']
  },
  '山': {
    char: '山',
    pinyin: ['shān'],
    meaning: '山峰',
    strokeCount: 3,
    radical: '山',
    radicalStrokeCount: 3,
    structure: '独体结构',
    components: [
      { name: '山', meaning: '山（独体字）', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['山'] }
    ],
    order: ['山'],
    words: ['山峰', '山水', '高山', '山脉']
  },
  '水': {
    char: '水',
    pinyin: ['shuǐ'],
    meaning: '水流',
    strokeCount: 4,
    radical: '水',
    radicalStrokeCount: 4,
    structure: '独体结构',
    components: [
      { name: '水', meaning: '水（独体字）', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['水'] }
    ],
    order: ['水'],
    words: ['水果', '河水', '汗水', '山水']
  },
  '火': {
    char: '火',
    pinyin: ['huǒ'],
    meaning: '火焰',
    strokeCount: 4,
    radical: '火',
    radicalStrokeCount: 4,
    structure: '独体结构',
    components: [
      { name: '火', meaning: '火（独体字）', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['火'] }
    ],
    order: ['火'],
    words: ['火焰', '大火', '火山', '着火']
  },
  '土': {
    char: '土',
    pinyin: ['tǔ'],
    meaning: '土地',
    strokeCount: 3,
    radical: '土',
    radicalStrokeCount: 3,
    structure: '独体结构',
    components: [
      { name: '土', meaning: '土（独体字）', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['土'] }
    ],
    order: ['土'],
    words: ['土地', '泥土', '土壤', '土豆']
  },
  '木': {
    char: '木',
    pinyin: ['mù'],
    meaning: '树木',
    strokeCount: 4,
    radical: '木',
    radicalStrokeCount: 4,
    structure: '独体结构',
    components: [
      { name: '木', meaning: '木（独体字）', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['木'] }
    ],
    order: ['木'],
    words: ['树木', '木头', '木材', '草木']
  },
  '金': {
    char: '金',
    pinyin: ['jīn'],
    meaning: '金属、黄金',
    strokeCount: 8,
    radical: '金',
    radicalStrokeCount: 8,
    structure: '上下结构',
    components: [
      { name: '人', meaning: '人', strokeCount: 2, radical: true },
      { name: '王', meaning: '玉的变体', strokeCount: 4, radical: true },
      { name: '丷', meaning: '两点', strokeCount: 2, radical: false }
    ],
    decompositionTree: [
      { level: 1, parts: ['金'] },
      { level: 2, parts: ['金'] }
    ],
    order: ['金'],
    words: ['黄金', '金属', '金色', '金钱']
  },
  '王': {
    char: '王',
    pinyin: ['wáng', 'wàng'],
    meaning: '国王、大王',
    strokeCount: 4,
    radical: '王',
    radicalStrokeCount: 4,
    structure: '独体结构',
    components: [
      { name: '王', meaning: '王（独体字）', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['王'] }
    ],
    order: ['王'],
    words: ['国王', '王子', '大王', '女王']
  },
  '田': {
    char: '田',
    pinyin: ['tián'],
    meaning: '田地',
    strokeCount: 5,
    radical: '田',
    radicalStrokeCount: 5,
    structure: '独体结构',
    components: [
      { name: '田', meaning: '田（独体字）', strokeCount: 5, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['田'] }
    ],
    order: ['田'],
    words: ['田地', '稻田', '田野', '农田']
  },
  '目': {
    char: '目',
    pinyin: ['mù'],
    meaning: '眼睛',
    strokeCount: 5,
    radical: '目',
    radicalStrokeCount: 5,
    structure: '独体结构',
    components: [
      { name: '目', meaning: '目（独体字）', strokeCount: 5, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['目'] }
    ],
    order: ['目'],
    words: ['目光', '目标', '题目', '目的']
  },
  '口': {
    char: '口',
    pinyin: ['kǒu'],
    meaning: '嘴巴、入口',
    strokeCount: 3,
    radical: '口',
    radicalStrokeCount: 3,
    structure: '独体结构',
    components: [
      { name: '口', meaning: '口（独体字）', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['口'] }
    ],
    order: ['口'],
    words: ['口水', '入口', '出口', '开口']
  },
  '耳': {
    char: '耳',
    pinyin: ['ěr'],
    meaning: '耳朵',
    strokeCount: 6,
    radical: '耳',
    radicalStrokeCount: 6,
    structure: '独体结构',
    components: [
      { name: '耳', meaning: '耳（独体字）', strokeCount: 6, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['耳'] }
    ],
    order: ['耳'],
    words: ['耳朵', '耳机', '木耳', '听力']
  },
  '手': {
    char: '手',
    pinyin: ['shǒu'],
    meaning: '手掌',
    strokeCount: 4,
    radical: '手',
    radicalStrokeCount: 4,
    structure: '独体结构',
    components: [
      { name: '手', meaning: '手（独体字）', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['手'] }
    ],
    order: ['手'],
    words: ['手掌', '手机', '左手', '右手']
  },
  '足': {
    char: '足',
    pinyin: ['zú'],
    meaning: '脚、足够',
    strokeCount: 7,
    radical: '足',
    radicalStrokeCount: 7,
    structure: '上下结构',
    components: [
      { name: '口', meaning: '嘴巴', strokeCount: 3, radical: true },
      { name: '止', meaning: '停止', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['足'] },
      { level: 2, parts: ['口', '止'] }
    ],
    order: ['口', '止'],
    words: ['足球', '足够', '足迹', '满足']
  },
  '心': {
    char: '心',
    pinyin: ['xīn'],
    meaning: '心脏、心情',
    strokeCount: 4,
    radical: '心',
    radicalStrokeCount: 4,
    structure: '独体结构',
    components: [
      { name: '心', meaning: '心（独体字）', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['心'] }
    ],
    order: ['心'],
    words: ['心情', '心里', '爱心', '小心']
  },
  '中': {
    char: '中',
    pinyin: ['zhōng', 'zhòng'],
    meaning: '中间、中国',
    strokeCount: 4,
    radical: '丨',
    radicalStrokeCount: 1,
    structure: '独体结构',
    components: [
      { name: '中', meaning: '中（独体字）', strokeCount: 4, radical: false }
    ],
    decompositionTree: [
      { level: 1, parts: ['中'] }
    ],
    order: ['中'],
    words: ['中国', '中间', '中心', '中午']
  },
  '国': {
    char: '国',
    pinyin: ['guó'],
    meaning: '国家',
    strokeCount: 8,
    radical: '囗',
    radicalStrokeCount: 3,
    structure: '全包围结构',
    components: [
      { name: '囗', meaning: '围框', strokeCount: 3, radical: true },
      { name: '玉', meaning: '玉石', strokeCount: 5, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['国'] },
      { level: 2, parts: ['囗', '玉'] }
    ],
    order: ['囗', '玉'],
    words: ['国家', '中国', '国王', '国土']
  },
  '天': {
    char: '天',
    pinyin: ['tiān'],
    meaning: '天空、天气',
    strokeCount: 4,
    radical: '大',
    radicalStrokeCount: 3,
    structure: '独体结构',
    components: [
      { name: '一', meaning: '横', strokeCount: 1, radical: true },
      { name: '大', meaning: '大', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['天'] },
      { level: 2, parts: ['一', '大'] }
    ],
    order: ['一', '大'],
    words: ['天空', '今天', '明天', '天气']
  },
  '地': {
    char: '地',
    pinyin: ['dì', 'de'],
    meaning: '土地、地方',
    strokeCount: 6,
    radical: '土',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '土', meaning: '土', strokeCount: 3, radical: true },
      { name: '也', meaning: '也', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['地'] },
      { level: 2, parts: ['土', '也'] }
    ],
    order: ['土', '也'],
    words: ['土地', '地方', '地球', '天地']
  },
  '你': {
    char: '你',
    pinyin: ['nǐ'],
    meaning: '你（第二人称）',
    strokeCount: 7,
    radical: '亻',
    radicalStrokeCount: 2,
    structure: '左右结构',
    components: [
      { name: '亻', meaning: '人字旁', strokeCount: 2, radical: true },
      { name: '尔', meaning: '你', strokeCount: 5, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['你'] },
      { level: 2, parts: ['亻', '尔'] }
    ],
    order: ['亻', '尔'],
    words: ['你好', '你们', '你的', '迷你']
  },
  '我': {
    char: '我',
    pinyin: ['wǒ'],
    meaning: '我（第一人称）',
    strokeCount: 7,
    radical: '戈',
    radicalStrokeCount: 4,
    structure: '独体结构',
    components: [
      { name: '我', meaning: '我（独体字）', strokeCount: 7, radical: false }
    ],
    decompositionTree: [
      { level: 1, parts: ['我'] }
    ],
    order: ['我'],
    words: ['我们', '我的', '自我', '忘我']
  },
  '他': {
    char: '他',
    pinyin: ['tā'],
    meaning: '他（第三人称）',
    strokeCount: 5,
    radical: '亻',
    radicalStrokeCount: 2,
    structure: '左右结构',
    components: [
      { name: '亻', meaning: '人字旁', strokeCount: 2, radical: true },
      { name: '也', meaning: '也', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['他'] },
      { level: 2, parts: ['亻', '也'] }
    ],
    order: ['亻', '也'],
    words: ['他们', '其他', '他乡', '他山之石']
  },
  '她': {
    char: '她',
    pinyin: ['tā'],
    meaning: '她（女性第三人称）',
    strokeCount: 6,
    radical: '女',
    radicalStrokeCount: 3,
    structure: '左右结构',
    components: [
      { name: '女', meaning: '女性', strokeCount: 3, radical: true },
      { name: '也', meaning: '也', strokeCount: 3, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['她'] },
      { level: 2, parts: ['女', '也'] }
    ],
    order: ['女', '也'],
    words: ['她们', '她的']
  },
  '是': {
    char: '是',
    pinyin: ['shì'],
    meaning: '是、正确',
    strokeCount: 9,
    radical: '日',
    radicalStrokeCount: 4,
    structure: '上下结构',
    components: [
      { name: '日', meaning: '太阳', strokeCount: 4, radical: true },
      { name: '疋', meaning: '正的变体', strokeCount: 5, radical: false }
    ],
    decompositionTree: [
      { level: 1, parts: ['是'] },
      { level: 2, parts: ['日', '疋'] }
    ],
    order: ['日', '疋'],
    words: ['是的', '不是', '但是', '可是']
  },
  '有': {
    char: '有',
    pinyin: ['yǒu', 'yòu'],
    meaning: '拥有、存在',
    strokeCount: 6,
    radical: '月',
    radicalStrokeCount: 4,
    structure: '上下结构',
    components: [
      { name: '𠂇', meaning: '有字头', strokeCount: 2, radical: false },
      { name: '月', meaning: '肉的变体', strokeCount: 4, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['有'] },
      { level: 2, parts: ['𠂇', '月'] }
    ],
    order: ['𠂇', '月'],
    words: ['拥有', '没有', '有人', '有时']
  },
  '在': {
    char: '在',
    pinyin: ['zài'],
    meaning: '存在、在于',
    strokeCount: 6,
    radical: '土',
    radicalStrokeCount: 3,
    structure: '半包围结构',
    components: [
      { name: '𠂇', meaning: '在字头', strokeCount: 2, radical: false },
      { name: '土', meaning: '土', strokeCount: 3, radical: true },
      { name: '丨', meaning: '竖', strokeCount: 1, radical: true }
    ],
    decompositionTree: [
      { level: 1, parts: ['在'] }
    ],
    order: ['在'],
    words: ['现在', '存在', '在家', '在意']
  },
  '了': {
    char: '了',
    pinyin: ['le', 'liǎo'],
    meaning: '完成、了结',
    strokeCount: 2,
    radical: '乙