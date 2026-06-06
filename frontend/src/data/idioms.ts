export interface IdiomExample {
  sentence: string
  source?: string
}

export interface Idiom {
  name: string
  pinyin: string
  pinyinInitials: string
  explanation: string
  source?: string
  examples: IdiomExample[]
  synonyms?: string[]
  antonyms?: string[]
  category: string
  structure?: string
  emotion?: string
}

export const idioms: Idiom[] = [
  {
    name: '画龙点睛',
    pinyin: 'huà lóng diǎn jīng',
    pinyinInitials: 'hldj',
    explanation: '原形容梁代画家张僧繇作画的神妙。后多比喻写文章或讲话时，在关键处用几句话点明实质，使内容更加生动有力。',
    source: '唐·张彦远《历代名画记·张僧繇》：「金陵安乐寺四白龙不点眼睛，每云：「点睛即飞去。」人以为妄诞，固请点之。须臾，雷电破壁，两龙乘云腾去上天，二龙未点眼者见在。」',
    examples: [
      { sentence: '这篇散文的结尾真是画龙点睛，令人回味无穷。' },
      { sentence: '他在演讲的最后加了一句幽默的话，起到了画龙点睛的作用。', source: '《人民日报》' }
    ],
    synonyms: ['锦上添花', '点石成金', '妙笔生花'],
    antonyms: ['画蛇添足', '弄巧成拙', '狗尾续貂'],
    category: '艺术文学',
    structure: '连动式',
    emotion: '褒义'
  },
  {
    name: '守株待兔',
    pinyin: 'shǒu zhū dài tù',
    pinyinInitials: 'szdt',
    explanation: '原比喻希图不经过努力而得到成功的侥幸心理。现也比喻死守狭隘经验，不知变通。',
    source: '《韩非子·五蠹》：「宋人有耕者，田中有株，兔走触株，折颈而死，因释其耒而守株，冀复得兔，兔不可复得，而身为宋国笑。」',
    examples: [
      { sentence: '美好的生活要靠自己去创造，守株待兔是不现实的。' },
      { sentence: '我们要主动出击，不能守株待兔，否则会让敌人跑掉。', source: '《林海雪原》' }
    ],
    synonyms: ['刻舟求剑', '墨守成规', '坐享其成'],
    antonyms: ['随机应变', '见机行事', '通权达变'],
    category: '寓言典故',
    structure: '连动式',
    emotion: '贬义'
  },
  {
    name: '亡羊补牢',
    pinyin: 'wáng yáng bǔ láo',
    pinyinInitials: 'wybl',
    explanation: '羊丢失了再去修补羊圈，还不算晚。比喻出了问题以后想办法补救，可以防止继续受损失。',
    source: '《战国策·楚策四》：「见兔而顾犬，未为晚也；亡羊而补牢，未为迟也。」',
    examples: [
      { sentence: '虽然你犯了错误，但只要亡羊补牢，为时未晚。' },
      { sentence: '这次考试没考好，要认真总结教训，亡羊补牢。' }
    ],
    synonyms: ['知错就改', '悬崖勒马', '回头是岸'],
    antonyms: ['执迷不悟', '一错再错', '知错不改'],
    category: '寓言典故',
    structure: '连动式',
    emotion: '褒义'
  },
  {
    name: '掩耳盗铃',
    pinyin: 'yǎn ěr dào líng',
    pinyinInitials: 'yedl',
    explanation: '偷铃铛怕别人听见而捂住自己的耳朵。比喻自己欺骗自己，明明掩盖不住的事情偏要想法子掩盖。',
    source: '《吕氏春秋·自知》：「百姓有得钟者，欲负而走，则钟大不可负。以椎毁之，钟况然有音。恐人闻之而夺己也，遽掩其耳。恶人闻之，可也；恶己自闻之，悖矣。」',
    examples: [
      { sentence: '这种掩耳盗铃的做法，只会让问题越来越严重。' },
      { sentence: '不反省自己的错误，反而遮遮掩掩，无异于掩耳盗铃。' }
    ],
    synonyms: ['自欺欺人', '弄巧成拙', '自作聪明'],
    antonyms: ['开诚布公', '光明磊落', '实事求是'],
    category: '寓言典故',
    structure: '偏正式',
    emotion: '贬义'
  },
  {
    name: '刻舟求剑',
    pinyin: 'kè zhōu qiú jiàn',
    pinyinInitials: 'kzqj',
    explanation: '比喻不懂事物已发展变化而仍静止地看问题。',
    source: '《吕氏春秋·察今》：「楚人有涉江者，其剑自舟中坠于水，遽契其舟曰：「是吾剑之所从坠。」舟止，从其所契者入水求之。舟已行矣，而剑不行，求剑若此，不亦惑乎？」',
    examples: [
      { sentence: '时代在发展，社会在进步，如果还用老眼光看待新事物，无异于刻舟求剑。' },
      { sentence: '处理事情要灵活应变，不能刻舟求剑。' }
    ],
    synonyms: ['守株待兔', '墨守成规', '一成不变'],
    antonyms: ['随机应变', '见机行事', '因地制宜'],
    category: '寓言典故',
    structure: '偏正式',
    emotion: '贬义'
  },
  {
    name: '画蛇添足',
    pinyin: 'huà shé tiān zú',
    pinyinInitials: 'hstz',
    explanation: '画蛇时给蛇添上脚。比喻做了多余的事，非但无益，反而不合适。',
    source: '《战国策·齐策二》：「楚有祠者，赐其舍人卮酒。舍人相谓曰：「数人饮之不足，一人饮之有余。请画地为蛇，先成者饮酒。」一人蛇先成，引酒且饮之，乃左手持卮，右手画蛇曰：「吾能为之足。」未成，一人之蛇成，夺其卮曰：「蛇固无足，子安能为之足？」遂饮其酒。为蛇足者，终亡其酒。」',
    examples: [
      { sentence: '这篇文章已经很完整了，再加这段就画蛇添足了。' },
      { sentence: '他本来想锦上添花，结果反而画蛇添足。' }
    ],
    synonyms: ['弄巧成拙', '多此一举', '狗尾续貂'],
    antonyms: ['画龙点睛', '恰到好处', '恰如其分'],
    category: '寓言典故',
    structure: '连动式',
    emotion: '贬义'
  },
  {
    name: '叶公好龙',
    pinyin: 'yè gōng hào lóng',
    pinyinInitials: 'yghl',
    explanation: '比喻口头上说爱好某事物，实际上并不真爱好。',
    source: '汉·刘向《新序·杂事》：「叶公子高好龙，钩以写龙，凿以写龙，屋室雕文以写龙。于是天龙闻而下之，窥头于牖，施尾于堂。叶公见之，弃而还走，失其魂魄，五色无主。是叶公非好龙也，好夫似龙而非龙者也。」',
    examples: [
      { sentence: '他嘴上说喜欢读书，其实是叶公好龙，根本不看。' },
      { sentence: '这种叶公好龙的态度是不可取的。' }
    ],
    synonyms: ['言不由衷', '口是心非', '两面三刀'],
    antonyms: ['名副其实', '表里如一', '言行一致'],
    category: '寓言典故',
    structure: '主谓式',
    emotion: '贬义'
  },
  {
    name: '愚公移山',
    pinyin: 'yú gōng yí shān',
    pinyinInitials: 'ygys',
    explanation: '比喻坚持不懈地改造自然和坚定不移地进行斗争。',
    source: '《列子·汤问》记载：愚公家门前有两大座山挡着路，他决心把山平掉，另一个老人智叟笑他太傻，认为不能能。愚公说：我死了有儿子，儿子死了还有孙子，子子孙孙是没有穷尽的，两座山终究会凿平。',
    examples: [
      { sentence: '只要有愚公移山的精神，就没有克服不了的困难。' },
      { sentence: '我们要以愚公移山的毅力推进这项伟大事业。' }
    ],
    synonyms: ['锲而不舍', '持之以恒', '坚持不懈'],
    antonyms: ['虎头蛇尾', '半途而废', '浅尝辄止'],
    category: '寓言典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '卧薪尝胆',
    pinyin: 'wò xīn cháng dǎn',
    pinyinInitials: 'wxcd',
    explanation: '睡觉睡在柴草上，吃饭睡觉都尝一尝苦胆。形容人刻苦自励，发奋图强。',
    source: '《史记·越王勾践世家》：「越王勾践反国，乃苦身焦思，置胆于坐，坐卧即仰胆，饮食亦尝胆也。」',
    examples: [
      { sentence: '只有卧薪尝胆，发奋图强，才能实现中华民族的伟大复兴。' },
      { sentence: '他卧薪尝胆数十载，终于成就了一番事业。' }
    ],
    synonyms: ['奋发图强', '励精图治', '发愤图强'],
    antonyms: ['乐不思蜀', '自暴自弃', '自甘堕落'],
    category: '历史典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '完璧归赵',
    pinyin: 'wán bì guī zhào',
    pinyinInitials: 'wbgz',
    explanation: '本指蔺相如将和氏璧完好地自秦送回赵国。后比喻把原物完好地归还本人。',
    source: '《史记·廉颇蔺相如列传》：「城入赵而璧留秦；城不入，臣请完璧归赵。」',
    examples: [
      { sentence: '这本书我看完后一定完璧归赵，请你放心。' },
      { sentence: '放心，你的东西我会完璧归赵的。' }
    ],
    synonyms: ['物归原主', '完好无损', '失而复得'],
    antonyms: ['支离破碎', '久假不归', '据为己有'],
    category: '历史典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '负荆请罪',
    pinyin: 'fù jīng qǐng zuì',
    pinyinInitials: 'fjqz',
    explanation: '背着荆条向对方请罪。表示向人认错赔罪。',
    source: '《史记·廉颇蔺相如列传》：「廉颇闻之，肉袒负荆，因宾客至蔺相如门谢罪。」',
    examples: [
      { sentence: '他知道错怪了朋友，特地登门负荆请罪。' },
      { sentence: '大丈夫要能屈能伸，错了就应该负荆请罪。' }
    ],
    synonyms: ['引咎自责', '登门谢罪', '肉袒负荆'],
    antonyms: ['兴师问罪', '知错不改', '倒打一耙'],
    category: '历史典故',
    structure: '连动式',
    emotion: '褒义'
  },
  {
    name: '纸上谈兵',
    pinyin: 'zhǐ shàng tán bīng',
    pinyinInitials: 'zstb',
    explanation: '在纸面上谈论打仗。比喻空谈理论，不能解决实际问题。也比喻空谈不能成为现实。',
    source: '《史记·廉颇蔺相如列传》记载：战国时赵国名将赵奢之子赵括，年轻时学兵法，谈起兵事来父亲也难不倒他。后来他接替廉颇为赵将，在长平之战中。只知道根据兵书办，不知道变通，结果被秦军大败。',
    examples: [
      { sentence: '做事情要脚踏实地，不能纸上谈兵。' },
      { sentence: '这些方案都只是纸上谈兵，没有实际操作性。' }
    ],
    synonyms: ['坐而论道', '华而不实', '空谈理论'],
    antonyms: ['埋头苦干', '脚踏实地', '身体力行'],
    category: '历史典故',
    structure: '偏正式',
    emotion: '贬义'
  },
  {
    name: '指鹿为马',
    pinyin: 'zhǐ lù wéi mǎ',
    pinyinInitials: 'zlwm',
    explanation: '指着鹿，说是马。比喻故意颠倒黑白，混淆是非。',
    source: '《史记·秦始皇本纪》：「赵高欲为乱，恐群臣不听，乃先设验，持鹿献于二世，曰：「马也。」二世笑曰：「丞相误邪？谓鹿为马。」问左右，左右或默，或言马以阿顺赵高。」',
    examples: [
      { sentence: '他竟然在公开场合指鹿为马，真是太过分了。' },
      { sentence: '我们要尊重事实，不能指鹿为马。' }
    ],
    synonyms: ['颠倒黑白', '混淆是非', '颠倒是非'],
    antonyms: ['实事求是', '是非分明', '循名责实'],
    category: '历史典故',
    structure: '兼语式',
    emotion: '贬义'
  },
  {
    name: '破釜沉舟',
    pinyin: 'pò fǔ chén zhōu',
    pinyinInitials: 'pfcz',
    explanation: '比喻下决心不顾一切地干到底。',
    source: '《史记·项羽本纪》：「项羽乃悉引兵渡河，皆沉船，破釜甑，烧庐舍，持三日粮，以示士卒必死，无一还心。」',
    examples: [
      { sentence: '为了这次比赛，他破釜沉舟，做了充分准备。' },
      { sentence: '我们要破釜沉舟，不达目的誓不罢休。' }
    ],
    synonyms: ['背水一战', '义无反顾', '孤注一掷'],
    antonyms: ['瞻前顾后', '优柔寡断', '畏首畏尾'],
    category: '历史典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '四面楚歌',
    pinyin: 'sì miàn chǔ gē',
    pinyinInitials: 'smcg',
    explanation: '比喻陷入四面受敌、孤立无援的境地。',
    source: '《史记·项羽本纪》：「项王军壁垓下，兵少食尽，汉军及诸侯兵围之数重。夜闻汉军四面皆楚歌，项王乃大惊，曰：「汉皆已得楚乎？是何楚人之多也。」」',
    examples: [
      { sentence: '他在公司里四面楚歌，处境十分艰难。' },
      { sentence: '在这四面楚歌的情况下，他仍然坚持自己的理想。' }
    ],
    synonyms: ['腹背受敌', '孤立无援', '进退维谷'],
    antonyms: ['左右逢源', '旗开得胜', '安然无恙'],
    category: '历史典故',
    structure: '主谓式',
    emotion: '贬义'
  },
  {
    name: '胸有成竹',
    pinyin: 'xiōng yǒu chéng zhú',
    pinyinInitials: 'xycz',
    explanation: '原指画竹子要在心里有一幅竹子的形象。后比喻在做事之前已经拿定主意。',
    source: '宋·苏轼《文与可画筼筜谷偃竹记》：「故画竹，必先得成竹于胸中。」',
    examples: [
      { sentence: '对于这次考试，他胸有成竹。' },
      { sentence: '做事要胸有成竹，不能手忙脚乱。' }
    ],
    synonyms: ['成竹在胸', '心中有数', '稳操胜券'],
    antonyms: ['心中无数', '不知所措', '束手无策'],
    category: '艺术文学',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '对牛弹琴',
    pinyin: 'duì niú tán qín',
    pinyinInitials: 'dntq',
    explanation: '讥笑听话的人不懂对方说得是什么。用以讥笑说话的人不看对象。',
    source: '汉·牟融《理惑论》：「公明仪为牛弹清角之操，伏食如枚。非牛不闻，不合其耳矣。」',
    examples: [
      { sentence: '跟他讲这些道理，简直是对牛弹琴。' },
      { sentence: '跟一个完全不懂音乐的人谈贝多芬，无异于对牛弹琴。' }
    ],
    synonyms: ['白费口舌', '对牛鼓簧', '鸡同鸭讲'],
    antonyms: ['对症下药', '有的放矢', '因材施教'],
    category: '寓言典故',
    structure: '偏正式',
    emotion: '贬义'
  },
  {
    name: '杯弓蛇影',
    pinyin: 'bēi gōng shé yǐng',
    pinyinInitials: 'bgsy',
    explanation: '将映在酒杯里的弓影误认为蛇。比喻因疑神疑鬼而引起恐惧。',
    source: '汉·应劭《风俗通义·怪神》记载：杜宣饮酒时见杯中有蛇影，酒后胸腹作痛，多方医治不愈。后来才知道是墙上挂的弓照在酒杯里，像蛇一样，病也就好了。',
    examples: [
      { sentence: '不要杯弓蛇影，自己吓唬自己。' },
      { sentence: '你不要杯弓蛇影，事情没有你想象的那么严重。' }
    ],
    synonyms: ['草木皆兵', '疑神疑鬼', '风声鹤唳'],
    antonyms: ['处之泰然', '安之若素', '谈笑自若'],
    category: '寓言典故',
    structure: '复句式',
    emotion: '贬义'
  },
  {
    name: '塞翁失马',
    pinyin: 'sài wēng shī mǎ',
    pinyinInitials: 'swsm',
    explanation: '塞：边界险要之处；翁：老头。比喻一时虽然受到损失，也许反而因此能得到好处。也指坏事在一定条件下可变为好事。',
    source: '《淮南子·人间训》记载：边塞老翁丢了马，别人来安慰他，他说：「怎么知道这不是福呢？」后来这匹马竟带着一匹好马回来了。',
    examples: [
      { sentence: '塞翁失马，焉知非福，你别太难过了。' },
      { sentence: '这次失败虽然可惜，但塞翁失马，说不定是好事。' }
    ],
    synonyms: ['因祸得福', '否极泰来', '北叟失马'],
    antonyms: ['乐极生悲', '因福得祸', '雪上加霜'],
    category: '寓言典故',
    structure: '主谓式',
    emotion: '中性'
  },
  {
    name: '班门弄斧',
    pinyin: 'bān mén nòng fǔ',
    pinyinInitials: 'bmnf',
    explanation: '在鲁班门前舞弄斧子。比喻在行家面前卖弄本领，不自量力。',
    source: '唐·柳宗元《王氏伯仲唱和诗序》：「操斧于班、郢之门，斯强颜耳。」',
    examples: [
      { sentence: '在专家面前发表意见，我岂敢班门弄斧？' },
      { sentence: '他在著名作家面前谈写作，真是班门弄斧。' }
    ],
    synonyms: ['布鼓雷门', '贻笑大方', '不自量力'],
    antonyms: ['虚怀若谷', '自知之明', '谦虚谨慎'],
    category: '历史典故',
    structure: '偏正式',
    emotion: '贬义'
  },
  {
    name: '杯水车薪',
    pinyin: 'bēi shuǐ chē xīn',
    pinyinInitials: 'bscx',
    explanation: '用一杯水去救一车着了火的柴草。比喻力量太小，解决不了问题。',
    source: '《孟子·告子上》：「今之为人者，犹以一杯水救一车薪之火也。」',
    examples: [
      { sentence: '这点钱对这个大项目来说，简直是杯水车薪。' },
      { sentence: '只靠一个人的努力，实在是杯水车薪。' }
    ],
    synonyms: ['无济于事', '于事无补', '人浮于事'],
    antonyms: ['力挽狂澜', '立竿见影', '行之有效'],
    category: '成语典故',
    structure: '复句式',
    emotion: '贬义'
  },
  {
    name: '半途而废',
    pinyin: 'bàn tú ér fèi',
    pinyinInitials: 'btef',
    explanation: '指做事不能坚持到底，中途停顿，有始无终。',
    source: '《礼记·中庸》：「君子遵道而行，半途而废，吾弗能已矣。」',
    examples: [
      { sentence: '做任何事情都要有始有终，不能半途而废。' },
      { sentence: '这项试验一定要搞到底，不能半途而废。' }
    ],
    synonyms: ['虎头蛇尾', '有始无终', '浅尝辄止'],
    antonyms: ['锲而不舍', '持之以恒', '有始有终'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '贬义'
  },
  {
    name: '百发百中',
    pinyin: 'bǎi fā bǎi zhòng',
    pinyinInitials: 'bfbz',
    explanation: '形容射箭或打枪准确，每次都命中目标。也比喻做事有充分把握。',
    source: '《战国策·西周策》：「楚有养由基者，善射，去柳叶百步而射之，百发百中。」',
    examples: [
      { sentence: '他的枪法很准，几乎百发百中。' },
      { sentence: '在这场比赛中，他投篮百发百中。' }
    ],
    synonyms: ['弹无虚发', '百步穿杨', '箭不虚发'],
    antonyms: ['无的放矢', '百不一存', '无一命中'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '不耻下问',
    pinyin: 'bù chǐ xià wèn',
    pinyinInitials: 'bcxw',
    explanation: '乐于向学问或地位比自己低的人学习，而不觉得不好意思。',
    source: '《论语·公冶长》：「敏而好学，不耻下问。」',
    examples: [
      { sentence: '他谦虚好学，不耻下问，进步很快。' },
      { sentence: '在学习上，我们要有不耻下问的精神。' }
    ],
    synonyms: ['谦虚谨慎', '不矜不伐', '移樽就教'],
    antonyms: ['好为人师', '骄傲自满', '居功自傲'],
    category: '成语典故',
    structure: '动宾式',
    emotion: '褒义'
  },
  {
    name: '乘风破浪',
    pinyin: 'chéng fēng pò làng',
    pinyinInitials: 'cfpl',
    explanation: '船只乘着风势破浪前进。比喻排除困难，奋勇前进。',
    source: '《宋书·宗悫传》：「悫年少时，炳问其志，悫曰：「愿乘长风破万里浪。」」',
    examples: [
      { sentence: '我们要在改革开放的道路上乘风破浪，勇往直前。' },
      { sentence: '这艘船乘风破浪，向远方驶去。' }
    ],
    synonyms: ['披荆斩棘', '高歌猛进', '勇往直前'],
    antonyms: ['裹足不前', '垂头丧气', '畏缩不前'],
    category: '成语典故',
    structure: '连动式',
    emotion: '褒义'
  },
  {
    name: '出类拔萃',
    pinyin: 'chū lèi bá cuì',
    pinyinInitials: 'clbc',
    explanation: '超出同类之上。多指人的品德才能。',
    source: '《孟子·公孙丑上》：「出于其类，拔乎其萃，自生民以来，未有盛于孔子也。」',
    examples: [
      { sentence: '他的才华出类拔萃，是公司的骨干。' },
      { sentence: '在众多的参赛者中，她出类拔萃，脱颖而出。' }
    ],
    synonyms: ['卓尔不群', '鹤立鸡群', '超群绝伦'],
    antonyms: ['碌碌无能', '庸庸碌碌', '相形见绌'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '大公无私',
    pinyin: 'dà gōng wú sī',
    pinyinInitials: 'dgws',
    explanation: '指办事公正，没有私心。现多指从集体利益出发，毫无个人打算。',
    source: '汉·马融《忠经·天地神明》：「忠者中也，至公无私。」',
    examples: [
      { sentence: '他大公无私，全心全意为人民服务。' },
      { sentence: '作为领导干部，应该大公无私。' }
    ],
    synonyms: ['舍己为公', '铁面无私', '公而忘私'],
    antonyms: ['假公济私', '自私自利', '损公肥私'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '德高望重',
    pinyin: 'dé gāo wàng zhòng',
    pinyinInitials: 'dgwz',
    explanation: '道德高尚，名望很大。',
    source: '《晋书·简文三子传》：「元显因讽礼官下仪，称已德隆望重，既录百揆，内外群僚皆应尽敬。」',
    examples: [
      { sentence: '这位老先生德高望重，大家都很尊敬他。' },
      { sentence: '村里有一位德高望重的老人。' }
    ],
    synonyms: ['众望所归', '年高德劭', '资深望重'],
    antonyms: ['德薄能鲜', '声名狼藉', '卑鄙无耻'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '对答如流',
    pinyin: 'duì dá rú liú',
    pinyinInitials: 'ddrl',
    explanation: '回答问话像流水一样快。形容口才好，反应快。',
    source: '《北史·李孝伯传》：「风容闲雅，应答如流。」',
    examples: [
      { sentence: '面对考官的提问，他对答如流。' },
      { sentence: '她反应敏捷，对答如流。' }
    ],
    synonyms: ['应答如流', '口若悬河', '滔滔不绝'],
    antonyms: ['笨口拙舌', '张口结舌', '支支吾吾'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '奋不顾身',
    pinyin: 'fèn bù gù shēn',
    pinyinInitials: 'fbgs',
    explanation: '奋勇向前，不考虑个人安危。',
    source: '汉·司马迁《报任少卿书》：「常思奋不顾身以殉国家之急。」',
    examples: [
      { sentence: '消防队员奋不顾身地冲进火海救人。' },
      { sentence: '在危急时刻，他奋不顾身地冲了上去。' }
    ],
    synonyms: ['舍生忘死', '出生入死', '万死不辞'],
    antonyms: ['畏缩不前', '贪生怕死', '畏首畏尾'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '褒义'
  },
  {
    name: '风和日丽',
    pinyin: 'fēng hé rì lì',
    pinyinInitials: 'fhrl',
    explanation: '和风习习，阳光灿烂。形容晴朗暖和的天气。',
    source: '元·李爱山《集贤宾·春日伤别》：「那时节和风丽日满东园，花共柳红娇绿软。」',
    examples: [
      { sentence: '今天风和日丽，正是出游的好天气。' },
      { sentence: '在一个风和日丽的早晨，我们出发了。' }
    ],
    synonyms: ['风柔日暖', '春和景明', '阳光明媚'],
    antonyms: ['风雨交加', '乌云密布', '凄风苦雨'],
    category: '自然景色',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '改邪归正',
    pinyin: 'gǎi xié guī zhèng',
    pinyinInitials: 'gxgz',
    explanation: '从邪路上回到正路上来，不再做坏事。',
    source: '明·施耐庵《水浒全传》第九十一回：「将军弃邪归正，与宋某等同替国家出力，朝廷自当重用。」',
    examples: [
      { sentence: '只要你改邪归正，大家会原谅你的。' },
      { sentence: '他决心改邪归正，重新做人。' }
    ],
    synonyms: ['痛改前非', '弃暗投明', '悔过自新'],
    antonyms: ['执迷不悟', '怙恶不悛', '死不改悔'],
    category: '成语典故',
    structure: '连动式',
    emotion: '褒义'
  },
  {
    name: '光明磊落',
    pinyin: 'guāng míng lěi luò',
    pinyinInitials: 'gmll',
    explanation: '胸怀坦白，正大光明。',
    source: '《晋书·右勒载记下》：「大丈夫行事，当礌礌落落，如日月皎然。」',
    examples: [
      { sentence: '他为人光明磊落，从不做亏心事。' },
      { sentence: '我们要做光明磊落的人。' }
    ],
    synonyms: ['光明正大', '胸无城府', '襟怀坦白'],
    antonyms: ['居心叵测', '鬼鬼祟祟', '心怀鬼胎'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '过目不忘',
    pinyin: 'guò mù bù wàng',
    pinyinInitials: 'gmbw',
    explanation: '看过就不忘记。形容记忆力非常强。',
    source: '《晋书·苻融载记》：「耳闻则诵，过目不忘，时人拟之王粲。」',
    examples: [
      { sentence: '他天资聪颖，过目不忘。' },
      { sentence: '她有过目不忘的本领。' }
    ],
    synonyms: ['过目成诵', '耳闻则诵', '一目十行'],
    antonyms: ['视而不见', '健忘之人', '记不住事'],
    category: '成语典故',
    structure: '连动式',
    emotion: '褒义'
  },
  {
    name: '画饼充饥',
    pinyin: 'huà bǐng chōng jī',
    pinyinInitials: 'hbcj',
    explanation: '画个饼来解除饥饿。比喻用空想来安慰自己。',
    source: '《三国志·魏志·卢毓传》：「选举莫取有名，名如画地作饼，不可啖也。」',
    examples: [
      { sentence: '不要画饼充饥，要脚踏实地去干。' },
      { sentence: '这种做法无异于画饼充饥。' }
    ],
    synonyms: ['望梅止渴', '纸上谈兵', '空中楼阁'],
    antonyms: ['实事求是', '脚踏实地', '身体力行'],
    category: '成语典故',
    structure: '连动式',
    emotion: '贬义'
  },
  {
    name: '诲人不倦',
    pinyin: 'huì rén bù juàn',
    pinyinInitials: 'hrbj',
    explanation: '教导人特别耐心，从不厌倦。',
    source: '《论语·述而》：「学而不厌，诲人不倦，何有于我哉？」',
    examples: [
      { sentence: '张老师诲人不倦，深受学生爱戴。' },
      { sentence: '他诲人不倦的精神令人敬佩。' }
    ],
    synonyms: ['谆谆教导', '循循善诱', '不厌其烦'],
    antonyms: ['误人子弟', '敷衍了事', '不闻不问'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '家喻户晓',
    pinyin: 'jiā yù hù xiǎo',
    pinyinInitials: 'jyhx',
    explanation: '家家户户都知道。形容人所共知。',
    source: '《汉书·刘辅传》：「天下不可户晓。」',
    examples: [
      { sentence: '雷锋的事迹家喻户晓。' },
      { sentence: '这个品牌已经家喻户晓。' }
    ],
    synonyms: ['妇孺皆知', '尽人皆知', '众所周知'],
    antonyms: ['默默无闻', '鲜为人知', '闻所未闻'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '见贤思齐',
    pinyin: 'jiàn xián sī qí',
    pinyinInitials: 'jxsq',
    explanation: '见到德才兼备的人就想赶上他。',
    source: '《论语·里仁》：「见贤思齐焉，见不贤而内自省也。」',
    examples: [
      { sentence: '在学习上，我们要有见贤思齐的精神。' },
      { sentence: '他见贤思齐，不断进步。' }
    ],
    synonyms: ['力争上游', '取法乎上', '从善如流'],
    antonyms: ['见利忘义', '嫉妒他人', '自甘堕落'],
    category: '成语典故',
    structure: '连动式',
    emotion: '褒义'
  },
  {
    name: '见义勇为',
    pinyin: 'jiàn yì yǒng wéi',
    pinyinInitials: 'jyyw',
    explanation: '看到正义的事，就勇敢地去做。',
    source: '《论语·为政》：「见义不为，无勇也。」',
    examples: [
      { sentence: '他见义勇为的精神值得我们学习。' },
      { sentence: '这位青年见义勇为，勇斗歹徒。' }
    ],
    synonyms: ['挺身而出', '临危不惧', '无所畏惧'],
    antonyms: ['见义不为', '袖手旁观', '明哲保身'],
    category: '成语典故',
    structure: '连动式',
    emotion: '褒义'
  },
  {
    name: '精益求精',
    pinyin: 'jīng yì qiú jīng',
    pinyinInitials: 'jyqj',
    explanation: '好了还求更好。',
    source: '《论语·学而》：「诗云：「如切如磋，如琢如磨。」其斯之谓与？」',
    examples: [
      { sentence: '他对工作一丝不苟，精益求精。' },
      { sentence: '学习要精益求精，不能满足于现状。' }
    ],
    synonyms: ['锦上添花', '精雕细琢', '千锤百炼'],
    antonyms: ['粗制滥造', '敷衍了事', '得过且过'],
    category: '成语典故',
    structure: '紧缩式',
    emotion: '褒义'
  },
  {
    name: '举一反三',
    pinyin: 'jǔ yī fǎn sān',
    pinyinInitials: 'jyfs',
    explanation: '比喻从一件事情类推而知道其他许多事情。',
    source: '《论语·述而》：「举一隅不以三隅反，则不复也。」',
    examples: [
      { sentence: '学习要能够举一反三，触类旁通。' },
      { sentence: '他很聪明，能举一反三。' }
    ],
    synonyms: ['触类旁通', '融会贯通', '闻一知十'],
    antonyms: ['一窍不通', '囫囵吞枣', '不求甚解'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '开卷有益',
    pinyin: 'kāi juàn yǒu yì',
    pinyinInitials: 'kjyy',
    explanation: '读书总有好处。',
    source: '宋·王辟之《渑水燕谈录》：「太宗日阅《太平御览》第三卷，因事有阙，暇日追补之，尝曰：「开卷有益，朕不以为劳也。」」',
    examples: [
      { sentence: '开卷有益，多读点书总有好处。' },
      { sentence: '老师常说开卷有益，鼓励我们多读书。' }
    ],
    synonyms: ['读书有用', '好学不倦', '手不释卷'],
    antonyms: ['读书无用', '无心向学', '不学无术'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '脍炙人口',
    pinyin: 'kuài zhì rén kǒu',
    pinyinInitials: 'kzrk',
    explanation: '脍和炙都是人们爱吃的食物。指美味人人爱吃。比喻好的诗文受到人们和称赞和传讼。',
    source: '五代·王定保《唐摭言·海叙不遇》：「如「水声常在耳，山色不离门」，又「扫地树留影，拂床琴有声」……皆脍炙人口。」',
    examples: [
      { sentence: '这是一首脍炙人口的古诗。' },
      { sentence: '他的文章脍炙人口，广为流传。' }
    ],
    synonyms: ['喜闻乐见', '口碑载道', '人人皆知'],
    antonyms: ['平淡无味', '鲜为人知', '无人问津'],
    category: '成语典故',
    structure: '复杂式',
    emotion: '褒义'
  },
  {
    name: '老当益壮',
    pinyin: 'lǎo dāng yì zhuàng',
    pinyinInitials: 'ldyz',
    explanation: '年纪虽老而志气更旺盛，干劲更足。',
    source: '《后汉书·马援传》：「丈夫为志，穷当益坚，老当益壮。」',
    examples: [
      { sentence: '他虽然年近古稀，但老当益壮，精神矍铄。' },
      { sentence: '老当益壮，宁移白首之心。' }
    ],
    synonyms: ['返老还童', '宝刀不老', '老骥伏枥'],
    antonyms: ['未老先衰', '老气横秋', '奄奄一息'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '乐此不疲',
    pinyin: 'lè cǐ bù pí',
    pinyinInitials: 'lcbp',
    explanation: '因酷爱干某事而不感觉厌烦。形容对某事特别爱好而沉浸其中。',
    source: '《后汉书·光武帝纪》：「我自乐此，不为疲也。」',
    examples: [
      { sentence: '他对研究工作乐此不疲。' },
      { sentence: '她每天练习钢琴，乐此不疲。' }
    ],
    synonyms: ['乐而忘返', '专心致志', '沉迷其中'],
    antonyms: ['心猿意马', '三心二意', '浅尝辄止'],
    category: '成语典故',
    structure: '紧缩式',
    emotion: '褒义'
  },
  {
    name: '两全其美',
    pinyin: 'liǎng quán qí měi',
    pinyinInitials: 'lqqm',
    explanation: '指做一件事顾全到双方，使两方面都得到好处。',
    source: '元·无名氏《连环计》第三折：「司徒，你若肯与了我呵，堪可两全其美也。」',
    examples: [
      { sentence: '这个办法真是两全其美。' },
      { sentence: '我们要想一个两全其美的办法。' }
    ],
    synonyms: ['一举两得', '面面俱到', '各得其所'],
    antonyms: ['两败俱伤', '玉石俱焚', '顾此失彼'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '马到成功',
    pinyin: 'mǎ dào chéng gōng',
    pinyinInitials: 'mdcg',
    explanation: '形容工作刚开始就取得成功。',
    source: '元·无名氏《小尉迟》第二折：「那老尉迟这一去，马到成功。」',
    examples: [
      { sentence: '祝你这次考试马到成功。' },
      { sentence: '只要不轻敌，相信你们一定会马到成功。' }
    ],
    synonyms: ['旗开得胜', '水到渠成', '顺理成章'],
    antonyms: ['屡战屡败', '出师不利', '一败涂地'],
    category: '成语典故',
    structure: '紧缩式',
    emotion: '褒义'
  },
  {
    name: '名列前茅',
    pinyin: 'míng liè qián máo',
    pinyinInitials: 'mlqm',
    explanation: '比喻名次列在前面。',
    source: '《左传·宣公十二年》：「𫇭敖为宰，择楚国之令典，军行，右辕，左追蓐，前茅虑无，中权，后劲。」',
    examples: [
      { sentence: '他在班上学习成绩名列前茅。' },
      { sentence: '这次比赛，她名列前茅。' }
    ],
    synonyms: ['首屈一指', '出类拔萃', '独占鳌头'],
    antonyms: ['名落孙山', '榜上无名', '倒数第一'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '名落孙山',
    pinyin: 'míng luò sūn shān',
    pinyinInitials: 'mlss',
    explanation: '名字落在榜末孙山的后面。指考试或选拔没有录取。',
    source: '宋·范公偁《过庭录》：「吴人孙山，滑稽才子也。赴举他郡，乡人托以子偕往。乡人子失意，山缀榜末，先归。乡人问其子得失，山曰：「解名尽处是孙山，贤郎更在孙山外。」」',
    examples: [
      { sentence: '这次考试他名落孙山，很沮丧。' },
      { sentence: '高考成绩公布后，他名落孙山。' }
    ],
    synonyms: ['榜上无名', '榜上无名', '屡试不第'],
    antonyms: ['名列前茅', '金榜题名', '独占鳌头'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '贬义'
  },
  {
    name: '目不暇接',
    pinyin: 'mù bù xiá jiē',
    pinyinInitials: 'mbxj',
    explanation: '指东西多，眼睛都看不过来。',
    source: '南朝宋·刘义庆《世说新语·言语》：「从山阴道上行，山川自相映发，使人应接不暇。」',
    examples: [
      { sentence: '展览会上的展品琳琅满目，让人目不暇接。' },
      { sentence: '一进商场，各种商品让人目不暇接。' }
    ],
    synonyms: ['应接不暇', '眼花缭乱', '琳琅满目'],
    antonyms: ['一目了然', '一览无余', '尽收眼底'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '中性'
  },
  {
    name: '能屈能伸',
    pinyin: 'néng qū néng shēn',
    pinyinInitials: 'nqns',
    explanation: '能弯曲也能伸直。指人在失意时能忍耐，在得志时能大干一番。',
    source: '《易·系辞下》：「尺蠖之屈，以求信也；龙蛇之蛰，以存身也。」',
    examples: [
      { sentence: '大丈夫要能屈能伸。' },
      { sentence: '他是一个能屈能伸的人。' }
    ],
    synonyms: ['随遇而安', '能伸能屈', '灵活应变'],
    antonyms: ['宁折不弯', '不知变通', '刚愎自用'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '鸟语花香',
    pinyin: 'niǎo yǔ huā xiāng',
    pinyinInitials: 'nyhx',
    explanation: '鸟叫得好听，花开得喷香。形容春天的美好景象。',
    source: '宋·吕本中《紫薇·庵居》：「鸟语花香变夕阴，稍闲复恐病相寻。」',
    examples: [
      { sentence: '春天到了，公园里鸟语花香。' },
      { sentence: '这里山清水秀，鸟语花香。' }
    ],
    synonyms: ['花红柳绿', '莺歌燕舞', '春意盎然'],
    antonyms: ['百花凋零', '万物凋零', '残花败柳'],
    category: '自然景色',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '平易近人',
    pinyin: 'píng yì jìn rén',
    pinyinInitials: 'pyjr',
    explanation: '对人和蔼可亲，没有架子，使人容易接近。也指文字浅显，容易了解。',
    source: '《史记·鲁周公世家》：「平易近民，民必归之。」',
    examples: [
      { sentence: '这位领导平易近人，深受群众爱戴。' },
      { sentence: '他的文章写得平易近人。' }
    ],
    synonyms: ['和蔼可亲', '和颜悦色', '虚怀若谷'],
    antonyms: ['盛气凌人', '目中无人', '飞扬跋扈'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '破镜重圆',
    pinyin: 'pò jìng chóng yuán',
    pinyinInitials: 'pjcy',
    explanation: '比喻夫妻失散或离婚后重新团聚。',
    source: '唐·孟棨《本事诗·情感》记载：南朝陈将亡时，驸马徐德言与妻乐昌公主估计不能相保，因破铜镜各执其半，约于正月十五日卖镜于市，以相寻访。陈亡后，乐昌公主为杨素所得。德言依约至京，见有苍头卖半镜，因出其半相合，得相见。杨素知之，遂召德言还其妻。',
    examples: [
      { sentence: '经过多方调解，他们夫妻俩终于破镜重圆。' },
      { sentence: '希望你们能破镜重圆，重修旧好。' }
    ],
    synonyms: ['和好如初', '言归于好', '破镜重合'],
    antonyms: ['覆水难收', '一去不返', '夫妻反目'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '七嘴八舌',
    pinyin: 'qī zuǐ bā shé',
    pinyinInitials: 'qzbs',
    explanation: '形容人多口杂。',
    source: '清·袁枚《牍外余言》：「故晋大夫七嘴八舌，冷讥热嘲，皆由于心之大公也。」',
    examples: [
      { sentence: '大家七嘴八舌地讨论起来。' },
      { sentence: '同学们七嘴八舌地议论着。' }
    ],
    synonyms: ['人多口杂', '议论纷纷', '众说纷纭'],
    antonyms: ['异口同声', '众口一词', '鸦雀无声'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '取长补短',
    pinyin: 'qǔ cháng bǔ duǎn',
    pinyinInitials: 'qcbd',
    explanation: '吸取别人的长处，来弥补自己的不足之处。也泛指在同类事物中吸取这个的长处来弥补那个的短处。',
    source: '《孟子·滕文公上》：「今滕绝长补短，将五十里也，犹可以为善国。」',
    examples: [
      { sentence: '同学们要互相帮助，取长补短。' },
      { sentence: '各部门应该取长补短，互相配合。' }
    ],
    synonyms: ['扬长避短', '截长补短', '择善而从'],
    antonyms: ['故步自封', '抱残守缺', '师心自用'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '人山人海',
    pinyin: 'rén shān rén hǎi',
    pinyinInitials: 'rsrh',
    explanation: '人群如山似海。形容人聚集得非常多。',
    source: '明·施耐庵《水浒全传》第五十一回：「每日有那一般打散，或是戏舞，或是吹弹，或是歌唱，赚得那人山人海价看。」',
    examples: [
      { sentence: '节日的广场上人山人海。' },
      { sentence: '演唱会现场人山人海。' }
    ],
    synonyms: ['川流不息', '人头攒动', '摩肩接踵'],
    antonyms: ['杳无人烟', '人迹罕至', '寥寥无几'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '如鱼得水',
    pinyin: 'rú yú dé shuǐ',
    pinyinInitials: 'ryds',
    explanation: '好象鱼得到水一样。比喻有所凭借。也比喻得到跟自己十分投合的人或对自己很合适的环境。',
    source: '《三国志·蜀书·诸葛亮传》：「孤之有孔明，犹鱼之有水也。」',
    examples: [
      { sentence: '他来到这个新的工作环境，如鱼得水。' },
      { sentence: '有了这个工具，他干起活来如鱼得水。' }
    ],
    synonyms: ['如虎添翼', '情投意合', '志同道合'],
    antonyms: ['寸步难行', '举步维艰', '格格不入'],
    category: '成语典故',
    structure: '动宾式',
    emotion: '褒义'
  },
  {
    name: '入木三分',
    pinyin: 'rù mù sān fēn',
    pinyinInitials: 'rmsf',
    explanation: '相传王羲之在木板上写字，木工刻时，发现字迹透入木板三分深。形容书法极有笔力。现多比喻分析问题很深刻。',
    source: '唐·张怀瓘《书断·王羲之》：「王羲之书祝版，工人削之，笔入木三分。」',
    examples: [
      { sentence: '这部小说对人物的刻画入木三分。' },
      { sentence: '他的分析入木三分。' }
    ],
    synonyms: ['力透纸背', '鞭辟入里', '深刻有力'],
    antonyms: ['略见一斑', '浮光掠影', '蜻蜓点水'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '褒义'
  },
  {
    name: '三顾茅庐',
    pinyin: 'sān gù máo lú',
    pinyinInitials: 'sgml',
    explanation: '原为汉末刘备访聘诸葛亮的故事。比喻真心诚意，一再邀请。',
    source: '三国蜀·诸葛亮《出师表》：「先帝不以臣卑鄙，猥自枉屈，三顾臣于草庐之中。」',
    examples: [
      { sentence: '为了请到这位专家，他三顾茅庐，诚意感人。' },
      { sentence: '我们三顾茅庐，终于请到了这位名师。' }
    ],
    synonyms: ['礼贤下士', '求贤若渴', '诚心诚意'],
    antonyms: ['拒人千里', '妄自尊大', '目中无人'],
    category: '历史典故',
    structure: '动宾式',
    emotion: '褒义'
  },
  {
    name: '盛气凌人',
    pinyin: 'shèng qì líng rén',
    pinyinInitials: 'sqlr',
    explanation: '以骄横的气势压人。形容傲慢自大，气势逼人。',
    source: '清·曾国藩《求阙斋语》：「今日我以盛气凌人，预想他日人亦盛气凌我。」',
    examples: [
      { sentence: '他总是盛气凌人，令人反感。' },
      { sentence: '不要盛气凌人，要谦虚待人。' }
    ],
    synonyms: ['目中无人', '自高自大', '咄咄逼人'],
    antonyms: ['平易近人', '和蔼可亲', '虚怀若谷'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '贬义'
  },
  {
    name: '水滴石穿',
    pinyin: 'shuǐ dī shí chuān',
    pinyinInitials: 'sdsc',
    explanation: '水不停地滴，石头也能被滴穿。比喻只要有恒心，不断努力，事情就一定能成功。',
    source: '《汉书·枚乘传》：「泰山之霤穿石，单极之绠断干。水非石之钻，索非木之锯，渐靡使之然也。」',
    examples: [
      { sentence: '只要坚持不懈，就一定能水滴石穿。' },
      { sentence: '学习要有水滴石穿的精神。' }
    ],
    synonyms: ['磨杵成针', '绳锯木断', '锲而不舍'],
    antonyms: ['虎头蛇尾', '半途而废', '浅尝辄止'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '水落石出',
    pinyin: 'shuǐ luò shí chū',
    pinyinInitials: 'slsc',
    explanation: '水落下去，水底的石头就露出来。比喻事情的真相完全显露出来。',
    source: '宋·欧阳修《醉翁亭记》：「野芳发而幽香，佳木秀而繁阴，风霜高洁，水落而石出者，山间之四时也。」',
    examples: [
      { sentence: '真相终于水落石出。' },
      { sentence: '经过调查，这件事已经水落石出了。' }
    ],
    synonyms: ['真相大白', '原形毕露', '昭然若揭'],
    antonyms: ['匿影藏形', '扑朔迷离', '若明若暗'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '四面楚歌',
    pinyin: 'sì miàn chǔ gē',
    pinyinInitials: 'smcg',
    explanation: '比喻陷入四面受敌、孤立无援的境地。',
    source: '《史记·项羽本纪》：「项王军壁垓下，兵少食尽，汉军及诸侯兵围之数重。夜闻汉军四面皆楚歌，项王乃大惊，曰：「汉皆已得楚乎？是何楚人之多也。」」',
    examples: [
      { sentence: '他在公司里四面楚歌，处境十分艰难。' },
      { sentence: '在这四面楚歌的情况下，他仍然坚持自己的理想。' }
    ],
    synonyms: ['腹背受敌', '孤立无援', '进退维谷'],
    antonyms: ['左右逢源', '旗开得胜', '安然无恙'],
    category: '历史典故',
    structure: '主谓式',
    emotion: '贬义'
  },
  {
    name: '天长地久',
    pinyin: 'tiān cháng dì jiǔ',
    pinyinInitials: 'tcdj',
    explanation: '跟天和地存在的时间那样长。形容时间悠久。也形容永远不变（多指爱情）。',
    source: '《老子》第七章：「天长地久，天地所以能长且久者，以其不自生，故能长生。」',
    examples: [
      { sentence: '祝愿你们的友谊天长地久。' },
      { sentence: '他们之间的感情天长地久。' }
    ],
    synonyms: ['日久天长', '天长日久', '地老天荒'],
    antonyms: ['稍纵即逝', '昙花一现', '弹指之间'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '同心协力',
    pinyin: 'tóng xīn xié lì',
    pinyinInitials: 'txxl',
    explanation: '团结一致，共同努力。',
    source: '汉·贾谊《过秦论》：「且天下尝同心并力攻秦矣，然困于险阻而不能进者，岂勇力智慧不足哉？」',
    examples: [
      { sentence: '只要我们同心协力，就一定能克服困难。' },
      { sentence: '大家同心协力，完成了这项艰巨的任务。' }
    ],
    synonyms: ['齐心协力', '众志成城', '同舟共济'],
    antonyms: ['离心离德', '分道扬镳', '各行其是'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '亡羊补牢',
    pinyin: 'wáng yáng bǔ láo',
    pinyinInitials: 'wybl',
    explanation: '羊丢失了再去修补羊圈，还不算晚。比喻出了问题以后想办法补救，可以防止继续受损失。',
    source: '《战国策·楚策四》：「见兔而顾犬，未为晚也；亡羊而补牢，未为迟也。」',
    examples: [
      { sentence: '虽然你犯了错误，但只要亡羊补牢，为时未晚。' },
      { sentence: '这次考试没考好，要认真总结教训，亡羊补牢。' }
    ],
    synonyms: ['知错就改', '悬崖勒马', '回头是岸'],
    antonyms: ['执迷不悟', '一错再错', '知错不改'],
    category: '寓言典故',
    structure: '连动式',
    emotion: '褒义'
  },
  {
    name: '望梅止渴',
    pinyin: 'wàng méi zhǐ kě',
    pinyinInitials: 'wmzk',
    explanation: '原意是梅子酸，人想吃梅子就会流涎，因而止渴。后比喻愿望无法实现，用空想安慰自己。',
    source: '南朝宋·刘义庆《世说新语·假谲》：「魏武行役失汲道，军皆渴，乃令曰：「前有大梅林，饶子，甘酸可以解渴。」士卒闻之，口皆出水，乘此得及前源。」',
    examples: [
      { sentence: '光是望梅止渴是不行的，要付诸行动。' },
      { sentence: '你这样做只是望梅止渴，解决不了实际问题。' }
    ],
    synonyms: ['画饼充饥', '自欺欺人', '聊以自慰'],
    antonyms: ['实事求是', '脚踏实地', '身体力行'],
    category: '成语典故',
    structure: '连动式',
    emotion: '贬义'
  },
  {
    name: '闻鸡起舞',
    pinyin: 'wén jī qǐ wǔ',
    pinyinInitials: 'wjqw',
    explanation: '听到鸡叫就起来舞剑。后比喻有志报国的人及时奋起。',
    source: '《晋书·祖逖传》：「中夜闻荒鸡鸣，蹴琨觉，曰：「此非恶声也。」因起舞。」',
    examples: [
      { sentence: '他每天闻鸡起舞，勤学苦练。' },
      { sentence: '我们要有闻鸡起舞的精神。' }
    ],
    synonyms: ['发奋图强', '自强不息', '废寝忘食'],
    antonyms: ['苟且偷安', '自暴自弃', '游手好闲'],
    category: '历史典故',
    structure: '连动式',
    emotion: '褒义'
  },
  {
    name: '无价之宝',
    pinyin: 'wú jià zhī bǎo',
    pinyinInitials: 'wjzb',
    explanation: '无法估价的宝物。指极珍贵的东西。',
    source: '唐·鱼玄机《赠邻女》诗：「易求无价宝，难得有心郎。」',
    examples: [
      { sentence: '真诚的友谊是无价之宝。' },
      { sentence: '这是一件无价之宝。' }
    ],
    synonyms: ['价值连城', '稀世之宝', '价值千金'],
    antonyms: ['一文不值', '粪土不如', '贱如粪土'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '褒义'
  },
  {
    name: '卧薪尝胆',
    pinyin: 'wò xīn cháng dǎn',
    pinyinInitials: 'wxcd',
    explanation: '睡觉睡在柴草上，吃饭睡觉都尝一尝苦胆。形容人刻苦自励，发奋图强。',
    source: '《史记·越王勾践世家》：「越王勾践反国，乃苦身焦思，置胆于坐，坐卧即仰胆，饮食亦尝胆也。」',
    examples: [
      { sentence: '只有卧薪尝胆，发奋图强，才能实现中华民族的伟大复兴。' },
      { sentence: '他卧薪尝胆数十载，终于成就了一番事业。' }
    ],
    synonyms: ['奋发图强', '励精图治', '发愤图强'],
    antonyms: ['乐不思蜀', '自暴自弃', '自甘堕落'],
    category: '历史典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '无可奈何',
    pinyin: 'wú kě nài hé',
    pinyinInitials: 'wknh',
    explanation: '指感到没有办法，只有这样了。',
    source: '《战国策·燕策三》：「太子闻之，弛往，伏尸而哭极哀。既已无可奈何，乃遂收盛樊於期之首，函封之。」',
    examples: [
      { sentence: '面对这种情况，他无可奈何地摇了摇头。' },
      { sentence: '看到孩子任性，父母有时也无可奈何。' }
    ],
    synonyms: ['百般无奈', '迫不得已', '束手无策'],
    antonyms: ['得心应手', '游刃有余', '想方设法'],
    category: '成语典故',
    structure: '动宾式',
    emotion: '中性'
  },
  {
    name: '小心翼翼',
    pinyin: 'xiǎo xīn yì yì',
    pinyinInitials: 'xxyy',
    explanation: '形容言行举动十分谨慎，丝毫不敢疏忽大意。',
    source: '《诗经·大雅·大明》：「维此文王，小心翼翼。」',
    examples: [
      { sentence: '他小心翼翼地捧着这个珍贵的花瓶。' },
      { sentence: '工作人员小心翼翼地操作着精密仪器。' }
    ],
    synonyms: ['谨小慎微', '如履薄冰', '一丝不苟'],
    antonyms: ['粗心大意', '毛手毛脚', '掉以轻心'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '中性'
  },
  {
    name: '胸有成竹',
    pinyin: 'xiōng yǒu chéng zhú',
    pinyinInitials: 'xycz',
    explanation: '原指画竹子要在心里有一幅竹子的形象。后比喻在做事之前已经拿定主意。',
    source: '宋·苏轼《文与可画筼筜谷偃竹记》：「故画竹，必先得成竹于胸中。」',
    examples: [
      { sentence: '对于这次考试，他胸有成竹。' },
      { sentence: '做事要胸有成竹，不能手忙脚乱。' }
    ],
    synonyms: ['成竹在胸', '心中有数', '稳操胜券'],
    antonyms: ['心中无数', '不知所措', '束手无策'],
    category: '艺术文学',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '栩栩如生',
    pinyin: 'xǔ xǔ rú shēng',
    pinyinInitials: 'xxrs',
    explanation: '指艺术形象非常逼真，如同活的一样。',
    source: '《庄子·齐物论》：「昔者庄周梦为胡蝶，栩栩然胡蝶也，自喻适志与！不知周也。俄然觉，则蘧蘧然周也。」',
    examples: [
      { sentence: '这幅画中的人物栩栩如生。' },
      { sentence: '他塑造的角色栩栩如生，令人难忘。' }
    ],
    synonyms: ['活灵活现', '惟妙惟肖', '跃然纸上'],
    antonyms: ['死气沉沉', '呆若木鸡', '泥塑木雕'],
    category: '艺术文学',
    structure: '偏正式',
    emotion: '褒义'
  },
  {
    name: '一帆风顺',
    pinyin: 'yī fān fēng shùn',
    pinyinInitials: 'yffs',
    explanation: '船挂着满帆顺风行驶。比喻非常顺利，没有任何阻碍。',
    source: '唐·孟郊《送崔爽之湖南》：「定知一日帆，使得千里风。」',
    examples: [
      { sentence: '祝你旅途一帆风顺。' },
      { sentence: '人生的道路不可能一帆风顺。' }
    ],
    synonyms: ['一路顺风', '万事如意', '左右逢源'],
    antonyms: ['一波三折', '荆棘载途', '历尽艰辛'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '一举两得',
    pinyin: 'yī jǔ liǎng dé',
    pinyinInitials: 'yjld',
    explanation: '做一件事得到两方面的好处。',
    source: '《战国策·秦策》：「取其地，足以广国也；得其财，足以富民；缮兵不伤众，而彼已服矣。故拔一国，而天下不以为暴；利尽西海，诸侯不以为贪。是我一举而名实两附，而又有禁暴止乱之名。」',
    examples: [
      { sentence: '这个办法真是一举两得。' },
      { sentence: '运动既能锻炼身体又能减肥，真是一举两得。' }
    ],
    synonyms: ['一箭双雕', '事半功倍', '两全其美'],
    antonyms: ['事倍功半', '得不偿失', '鸡飞蛋打'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '一丝不苟',
    pinyin: 'yī sī bù gǒu',
    pinyinInitials: 'ysbg',
    explanation: '指做事认真细致，一点儿不马虎。',
    source: '清·吴敬梓《儒林外史》第四回：「上司访知，见世叔一丝不苟，升迁就在指日。」',
    examples: [
      { sentence: '他对工作一丝不苟，深受领导信任。' },
      { sentence: '学习要一丝不苟，不能敷衍了事。' }
    ],
    synonyms: ['小心谨慎', '小心翼翼', '精益求精'],
    antonyms: ['粗枝大叶', '马马虎虎', '敷衍了事'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '一心一意',
    pinyin: 'yī xīn yī yì',
    pinyinInitials: 'yxyy',
    explanation: '只有一个心眼儿，没有别的考虑。',
    source: '《三国志·魏志·杜恕传》：「免为庶人，徙章武郡，是岁嘉平元年。」裴松之注引《杜氏新书》：「故推一心，任一意，直而行之耳。」',
    examples: [
      { sentence: '他一心一意地投入到科研工作中。' },
      { sentence: '做事要一心一意，不能三心二意。' }
    ],
    synonyms: ['全心全意', '专心致志', '聚精会神'],
    antonyms: ['三心二意', '心猿意马', '见异思迁'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '以身作则',
    pinyin: 'yǐ shēn zuò zé',
    pinyinInitials: 'yszz',
    explanation: '以自己的行动做出榜样。',
    source: '《论语·子路》：「其身正，不令而行；其身不正，虽令不从。」',
    examples: [
      { sentence: '领导干部要以身作则，严于律己。' },
      { sentence: '作为班长，他处处以身作则。' }
    ],
    synonyms: ['言传身教', '身先士卒', '身体力行'],
    antonyms: ['以身试法', '监守自盗', '知法犯法'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '褒义'
  },
  {
    name: '义不容辞',
    pinyin: 'yì bù róng cí',
    pinyinInitials: 'ybrc',
    explanation: '道义上不允许推辞。',
    source: '明·罗贯中《三国演义》第五十八回：「且玄德既为东吴之婿，亦义不容辞。」',
    examples: [
      { sentence: '支持灾区建设，我们义不容辞。' },
      { sentence: '作为公民，维护社会公德是义不容辞的责任。' }
    ],
    synonyms: ['责无旁贷', '当仁不让', '理所当然'],
    antonyms: ['推三阻四', '临阵脱逃', '袖手旁观'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '异口同声',
    pinyin: 'yì kǒu tóng shēng',
    pinyinInitials: 'ykts',
    explanation: '不同的嘴说出相同的话。指大家说得都一样。',
    source: '《宋书·庾炳之传》：「伏复深思，只有愚滞，今之事迹，异口同音，便是彰著，政未测得物之数耳。」',
    examples: [
      { sentence: '同学们异口同声地回答老师的问题。' },
      { sentence: '大家异口同声地赞成这个建议。' }
    ],
    synonyms: ['众口一词', '不约而同', '如出一辙'],
    antonyms: ['众说纷纭', '莫衷一是', '各执己见'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '中性'
  },
  {
    name: '因材施教',
    pinyin: 'yīn cái shī jiào',
    pinyinInitials: 'ycsj',
    explanation: '指针对学习的人的志趣、能力等具体情况进行不同的教育。',
    source: '《论语·雍也》：「中人以上，可以语上也；中人以下，不可以语上也。」',
    examples: [
      { sentence: '教师应该因材施教，发挥每个学生的特长。' },
      { sentence: '因材施教是教育的重要原则。' }
    ],
    synonyms: ['对症下药', '因地制宜', '有的放矢'],
    antonyms: ['一刀切', '一概而论', '千人一面'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '褒义'
  },
  {
    name: '迎刃而解',
    pinyin: 'yíng rèn ér jiě',
    pinyinInitials: 'yrej',
    explanation: '原意是说，劈竹子时，头上几节一破开，下面的顺着刀口自己就裂开了。比喻处理事情、解决问题很顺利。',
    source: '《晋书·杜预传》：「今兵威已振，譬如破竹，数节之后，皆迎刃而解。」',
    examples: [
      { sentence: '只要抓住关键，问题就会迎刃而解。' },
      { sentence: '经过专家指导，难题迎刃而解。' }
    ],
    synonyms: ['水到渠成', '瓜熟蒂落', '顺理成章'],
    antonyms: ['百思不解', '束手无策', '进退维谷'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '褒义'
  },
  {
    name: '有备无患',
    pinyin: 'yǒu bèi wú huàn',
    pinyinInitials: 'ybwh',
    explanation: '事先有准备，就可以避免祸患。',
    source: '《左传·襄公十一年》：「居安思危，思则有备，有备无患。」',
    examples: [
      { sentence: '出行前做好充分准备，才能有备无患。' },
      { sentence: '防汛工作要早做安排，做到有备无患。' }
    ],
    synonyms: ['未雨绸缪', '防患未然', '居安思危'],
    antonyms: ['临渴掘井', '临阵磨枪', '措手不及'],
    category: '成语典故',
    structure: '紧缩式',
    emotion: '褒义'
  },
  {
    name: '鱼目混珠',
    pinyin: 'yú mù hùn zhū',
    pinyinInitials: 'ymhz',
    explanation: '拿鱼眼睛冒充珍珠。比喻用假的冒充真的。',
    source: '汉·魏伯阳《参同契》卷上：「鱼目岂为珠？蓬蒿不成槚。」',
    examples: [
      { sentence: '市场上的商品鱼目混珠，要仔细辨别。' },
      { sentence: '这些假货鱼目混珠，消费者很难分辨。' }
    ],
    synonyms: ['以假乱真', '冒名顶替', '滥竽充数'],
    antonyms: ['黑白分明', '泾渭分明', '货真价实'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '贬义'
  },
  {
    name: '与人为善',
    pinyin: 'yǔ rén wéi shàn',
    pinyinInitials: 'yrws',
    explanation: '指赞成人学好。现指善意帮助人。',
    source: '《孟子·公孙丑上》：「取诸人以为善，是与人为善者也。故君子莫大乎与人为善。」',
    examples: [
      { sentence: '他一向与人为善，乐于助人。' },
      { sentence: '与人为善是一种美德。' }
    ],
    synonyms: ['行善积德', '助人为乐', '好善乐施'],
    antonyms: ['与人为恶', '落井下石', '幸灾乐祸'],
    category: '成语典故',
    structure: '动宾式',
    emotion: '褒义'
  },
  {
    name: '欲速不达',
    pinyin: 'yù sù bù dá',
    pinyinInitials: 'ysbd',
    explanation: '想求快速，反而不能达到目的。',
    source: '《论语·子路》：「无欲速，无见小利。欲速则不达，见小利则大事不成。」',
    examples: [
      { sentence: '做事不能急于求成，否则欲速不达。' },
      { sentence: '学习要循序渐进，欲速不达。' }
    ],
    synonyms: ['过犹不及', '适得其反', '揠苗助长'],
    antonyms: ['一蹴而就', '水到渠成', '顺理成章'],
    category: '成语典故',
    structure: '连动式',
    emotion: '中性'
  },
  {
    name: '再接再厉',
    pinyin: 'zài jiē zài lì',
    pinyinInitials: 'zjzl',
    explanation: '指公鸡相斗，每次交锋以前先磨一下嘴。比喻继续努力，再加一把劲。',
    source: '唐·韩愈《斗鸡联句》：「一喷一醒然，再接再厉乃。」',
    examples: [
      { sentence: '希望你再接再厉，取得更大的成绩。' },
      { sentence: '我们要再接再厉，争取更大的胜利。' }
    ],
    synonyms: ['百尺竿头', '更进一步', '马不停蹄'],
    antonyms: ['得过且过', '知难而退', '半途而废'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '知己知彼',
    pinyin: 'zhī jǐ zhī bǐ',
    pinyinInitials: 'zjzb',
    explanation: '原意是如果对敌我双方的情况都能了解透彻，打起仗来就可以立于不败之地。泛指对双方情况都很了解。',
    source: '《孙子·谋攻》：「知己知彼，百战不殆。」',
    examples: [
      { sentence: '在谈判中要知己知彼，才能掌握主动权。' },
      { sentence: '只有知己知彼，才能做出正确的决策。' }
    ],
    synonyms: ['了如指掌', '明察秋毫', '洞若观火'],
    antonyms: ['心中无数', '不得要领', '雾里看花'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '指鹿为马',
    pinyin: 'zhǐ lù wéi mǎ',
    pinyinInitials: 'zlwm',
    explanation: '指着鹿，说是马。比喻故意颠倒黑白，混淆是非。',
    source: '《史记·秦始皇本纪》：「赵高欲为乱，恐群臣不听，乃先设验，持鹿献于二世，曰：「马也。」二世笑曰：「丞相误邪？谓鹿为马。」问左右，左右或默，或言马以阿顺赵高。」',
    examples: [
      { sentence: '他竟然在公开场合指鹿为马，真是太过分了。' },
      { sentence: '我们要尊重事实，不能指鹿为马。' }
    ],
    synonyms: ['颠倒黑白', '混淆是非', '颠倒是非'],
    antonyms: ['实事求是', '是非分明', '循名责实'],
    category: '历史典故',
    structure: '兼语式',
    emotion: '贬义'
  },
  {
    name: '志同道合',
    pinyin: 'zhì tóng dào hé',
    pinyinInitials: 'ztdh',
    explanation: '志向相同，道路一致。形容彼此理想、志趣相合。',
    source: '《三国志·魏志·陈思王植传》：「昔伊尹之为媵臣，至贱也，吕尚之处屠钓，至陋也，乃其见举于汤武、周文，诚道合志同，玄漠神通，岂复假近习之荐，因左右之介哉。」',
    examples: [
      { sentence: '他们两人志同道合，成为了最好的朋友。' },
      { sentence: '我们要找志同道合的人一起创业。' }
    ],
    synonyms: ['情投意合', '同心同德', '意气相投'],
    antonyms: ['分道扬镳', '貌合神离', '同床异梦'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '专心致志',
    pinyin: 'zhuān xīn zhì zhì',
    pinyinInitials: 'zxzz',
    explanation: '把心思全放在上面。形容一心一意，聚精会神。',
    source: '《孟子·告子上》：「今夫弈之为数，小数也；不专心致志，则不得也。」',
    examples: [
      { sentence: '他正在专心致志地看书。' },
      { sentence: '学习要专心致志，不能三心二意。' }
    ],
    synonyms: ['聚精会神', '全神贯注', '一心一意'],
    antonyms: ['心不在焉', '三心二意', '漫不经心'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '自强不息',
    pinyin: 'zì qiáng bù xī',
    pinyinInitials: 'zqbx',
    explanation: '自觉地努力向上，永不松懈。',
    source: '《周易·乾》：「天行健，君子以自强不息。」',
    examples: [
      { sentence: '中华民族具有自强不息的精神。' },
      { sentence: '他身残志坚，自强不息。' }
    ],
    synonyms: ['发愤图强', '励精图治', '卧薪尝胆'],
    antonyms: ['自暴自弃', '自甘堕落', '得过且过'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '褒义'
  },
  {
    name: '左顾右盼',
    pinyin: 'zuǒ gù yòu pàn',
    pinyinInitials: 'zgyp',
    explanation: '向左右两边看。形容人骄傲得意的神情。',
    source: '晋·左思《咏史》诗：「左眄澄江湘，右盼定羌胡。」',
    examples: [
      { sentence: '他在人群中左顾右盼，寻找着朋友。' },
      { sentence: '过马路时不要左顾右盼，要注意安全。' }
    ],
    synonyms: ['东张西望', '瞻前顾后', '交头接耳'],
    antonyms: ['目不转睛', '全神贯注', '聚精会神'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '做贼心虚',
    pinyin: 'zuò zéi xīn xū',
    pinyinInitials: 'zzxx',
    explanation: '做贼的人心里虚。比喻做了坏事的人总怕被人发觉而心里不安。',
    source: '宋·释悟明《联灯会要·重显禅师》：「却顾侍者云：「适来有人看方丈么？」侍者云：「有。」师云：「作贼人心虚。」」',
    examples: [
      { sentence: '他做贼心虚，说话吞吞吐吐。' },
      { sentence: '做贼心虚的人，一有风吹草动就惊慌失措。' }
    ],
    synonyms: ['心中有鬼', '心怀鬼胎', '忐忑不安'],
    antonyms: ['问心无愧', '心安理得', '光明磊落'],
    category: '成语典故',
    structure: '连动式',
    emotion: '贬义'
  },
  {
    name: '阿鼻地狱',
    pinyin: 'ā bí dì yù',
    pinyinInitials: 'abdy',
    explanation: '阿鼻：梵语的译音，意译为「无间」，即痛苦无有间断之意。佛教指最苦的地狱，为八大地狱之一。常用以比喻黑暗的社会和残酷的刑罚。',
    source: '《法华经·法师功德品》：「下至阿鼻地狱。」《俱舍论》卷十一：「阿鼻，译言无间。」',
    examples: [
      { sentence: '在黑暗的旧社会，劳动人民生活在阿鼻地狱之中。' },
      { sentence: '人们常说作恶多端的人死后会堕入阿鼻地狱。' }
    ],
    synonyms: ['十八层地狱', '无间地狱', '水深火热'],
    antonyms: ['极乐世界', '天堂福地', '世外桃源'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '贬义'
  },
  {
    name: '爱莫能助',
    pinyin: 'ài mò néng zhù',
    pinyinInitials: 'amnz',
    explanation: '虽然心中关切同情，却没有力量帮助。爱：爱惜；莫：不。',
    source: '《诗经·大雅·烝民》：「维仲山甫举之，爱莫助之。」',
    examples: [
      { sentence: '这件事情我实在爱莫能助，请你另想办法。' },
      { sentence: '他需要的资金数额太大，我也爱莫能助。' }
    ],
    synonyms: ['无能为力', '力不从心', '束手无策'],
    antonyms: ['鼎力相助', '有求必应', '拔刀相助'],
    category: '成语典故',
    structure: '紧缩式',
    emotion: '中性'
  },
  {
    name: '安居乐业',
    pinyin: 'ān jū lè yè',
    pinyinInitials: 'ajly',
    explanation: '安：安定；乐：喜爱，愉快；业：职业。指安定愉快地生活和劳动。',
    source: '《后汉书·仲长统传》：「安居乐业，长养子孙，天下晏然。」',
    examples: [
      { sentence: '改革开放后，人民安居乐业，生活蒸蒸日上。' },
      { sentence: '只有国家稳定，百姓才能安居乐业。' }
    ],
    synonyms: ['国泰民安', '丰衣足食', '安身立命'],
    antonyms: ['民不聊生', '流离失所', '兵荒马乱'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '安然无恙',
    pinyin: 'ān rán wú yàng',
    pinyinInitials: 'arwy',
    explanation: '恙：病。原指人平安没有疾病。现泛指事物平安未遭损害。',
    source: '明·冯梦龙《醒世恒言》第29卷：「按院照旧供职，陆公安然无恙。」',
    examples: [
      { sentence: '经过那场暴风雨，房屋依然安然无恙。' },
      { sentence: '他从地震中安然无恙地逃了出来。' }
    ],
    synonyms: ['平安无事', '安然无事', '完好无损'],
    antonyms: ['危在旦夕', '九死一生', '遍体鳞伤'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '褒义'
  },
  {
    name: '跋山涉水',
    pinyin: 'bá shān shè shuǐ',
    pinyinInitials: 'bsss',
    explanation: '跋山：翻过山岭；涉水：用脚趟着水渡过大河。翻山越岭，趟水过河。形容走远路的艰苦。',
    source: '《诗经·墉风·载驰》：「大夫跋涉，我心则忧。」',
    examples: [
      { sentence: '地质队员跋山涉水，为祖国寻找矿藏。' },
      { sentence: '他跋山涉水，终于找到了失散多年的亲人。' }
    ],
    synonyms: ['翻山越岭', '风尘仆仆', '长途跋涉'],
    antonyms: ['朝发夕至', '一路顺风', '近在咫尺'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '百发百中',
    pinyin: 'bǎi fā bǎi zhòng',
    pinyinInitials: 'bfbz',
    explanation: '形容射箭或打枪准确，每次都命中目标。也比喻做事有充分把握。',
    source: '《战国策·西周策》：「楚有养由基者，善射，去柳叶百步而射之，百发百中。」',
    examples: [
      { sentence: '他是一位神枪手，射击百发百中。' },
      { sentence: '他的罚球技术很高，几乎百发百中。' }
    ],
    synonyms: ['弹无虚发', '百步穿杨', '百无一失'],
    antonyms: ['无的放矢', '百不一存', '射不穿札'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '百废待兴',
    pinyin: 'bǎi fèi dài xīng',
    pinyinInitials: 'bfdx',
    explanation: '废：被废置的事情；待：等待；兴：兴办。许多被搁置的事情等着要兴办。',
    source: '王颖《海外赤子》：「百废待兴，一下子怎么能抓得过来？」',
    examples: [
      { sentence: '新中国成立初期，百废待兴，困难重重。' },
      { sentence: '地震过后，灾区百废待兴，需要大家共同努力。' }
    ],
    synonyms: ['百端待举', '千头万绪', '百废待举'],
    antonyms: ['百废俱兴', '蒸蒸日上', '欣欣向荣'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '中性'
  },
  {
    name: '百年大计',
    pinyin: 'bǎi nián dà jì',
    pinyinInitials: 'bndj',
    explanation: '大计：长远的重要的计划。指关系到长远利益的计划或措施。',
    source: '清·梁启超《论民族竞争之大势》：「数月之间，而其权力已巩固，而百年大计于是乎定。」',
    examples: [
      { sentence: '教育是百年大计，必须高度重视。' },
      { sentence: '兴修水利是造福子孙后代的百年大计。' }
    ],
    synonyms: ['长计远虑', '从长计议', '千秋大业'],
    antonyms: ['权宜之计', '缓兵之计', '临时抱佛脚'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '褒义'
  },
  {
    name: '百战百胜',
    pinyin: 'bǎi zhàn bǎi shèng',
    pinyinInitials: 'bzbs',
    explanation: '每战必胜。形容所向无敌。',
    source: '《孙子·谋攻》：「百战百胜，非善之善者也；不战而屈人之兵，善之善者也。」',
    examples: [
      { sentence: '他在商场上百战百胜，被誉为「常胜将军」。' },
      { sentence: '人民军队百战百胜，所向披靡。' }
    ],
    synonyms: ['战无不胜', '所向无敌', '无往不利'],
    antonyms: ['屡战屡败', '一败涂地', '溃不成军'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '半途而废',
    pinyin: 'bàn tú ér fèi',
    pinyinInitials: 'btep',
    explanation: '废：停止。指做事不能坚持到底，中途停顿，有始无终。',
    source: '《礼记·中庸》：「君子遵道而行，半途而废，吾弗能已矣。」',
    examples: [
      { sentence: '做任何事情都要坚持到底，不能半途而废。' },
      { sentence: '这项试验一定要搞到底，不能半途而废。' }
    ],
    synonyms: ['功亏一篑', '有始无终', '浅尝辄止'],
    antonyms: ['坚持不懈', '持之以恒', '锲而不舍'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '贬义'
  },
  {
    name: '包罗万象',
    pinyin: 'bāo luó wàn xiàng',
    pinyinInitials: 'blwx',
    explanation: '包罗：包括；万象：宇宙间的一切景象，指各种事物。形容内容丰富，应有尽有。',
    source: '《黄帝宅经》卷上：「所以包罗万象，举一千从。」',
    examples: [
      { sentence: '百科全书的内容包罗万象，应有尽有。' },
      { sentence: '这个博物馆的展品包罗万象，令人目不暇接。' }
    ],
    synonyms: ['应有尽有', '无所不包', '一应俱全'],
    antonyms: ['空空如也', '一无所有', '挂一漏万'],
    category: '成语典故',
    structure: '动宾式',
    emotion: '中性'
  },
  {
    name: '饱经风霜',
    pinyin: 'bǎo jīng fēng shuāng',
    pinyinInitials: 'bjfs',
    explanation: '饱：充分；经：经历；风霜：比喻艰难困苦。形容经历过长期的艰难困苦的生活和斗争。',
    source: '清·孔尚任《桃花扇》第二十一出：「鸡皮瘦损，看饱经雪霜，丝鬓如银。」',
    examples: [
      { sentence: '他那张饱经风霜的脸上刻满了岁月的痕迹。' },
      { sentence: '老爷爷饱经风霜的脸上露出了笑容。' }
    ],
    synonyms: ['饱经沧桑', '历尽艰辛', '千锤百炼'],
    antonyms: ['养尊处优', '不谙世事', '一帆风顺'],
    category: '成语典故',
    structure: '动宾式',
    emotion: '中性'
  },
  {
    name: '杯水车薪',
    pinyin: 'bēi shuǐ chē xīn',
    pinyinInitials: 'bscx',
    explanation: '用一杯水去救一车着了火的柴草。比喻力量太小，解决不了问题。',
    source: '《孟子·告子上》：「今之为人者，犹以一杯水救一车薪之火也。」',
    examples: [
      { sentence: '这点钱对这个大工程来说，简直是杯水车薪。' },
      { sentence: '他的帮助虽然杯水车薪，但心意可嘉。' }
    ],
    synonyms: ['无济于事', '于事无补', '人浮于事'],
    antonyms: ['绰绰有余', '立竿见影', '行之有效'],
    category: '成语典故',
    structure: '复句式',
    emotion: '贬义'
  },
  {
    name: '悲欢离合',
    pinyin: 'bēi huān lí hé',
    pinyinInitials: 'bhlh',
    explanation: '悲伤、欢乐、离散、聚会。泛指生活中经历的各种境遇和由此产生的各种心情。',
    source: '宋·苏轼《水调歌头》词：「人有悲欢离合，月有阴睛阳缺，此事古难全。」',
    examples: [
      { sentence: '人生难免有悲欢离合，我们要学会坦然面对。' },
      { sentence: '这部小说讲述了一家人几十年的悲欢离合。' }
    ],
    synonyms: ['酸甜苦辣', '喜怒哀乐', '离合悲欢'],
    antonyms: ['平淡无奇', '风平浪静', '一帆风顺'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '背道而驰',
    pinyin: 'bèi dào ér chí',
    pinyinInitials: 'bdec',
    explanation: '背：背向；道：道路；驰：奔跑。朝相反的方向跑去。比喻彼此的方向和目的完全相反。',
    source: '唐·柳宗元《〈杨评事文集〉后序》：「其余各探一隅，相与背驰于道者，其去弥远。」',
    examples: [
      { sentence: '他的所作所为与当初的誓言背道而驰。' },
      { sentence: '这种做法与教育的初衷背道而驰。' }
    ],
    synonyms: ['南辕北辙', '适得其反', '分道扬镳'],
    antonyms: ['殊途同归', '如出一辙', '志同道合'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '贬义'
  },
  {
    name: '本末倒置',
    pinyin: 'běn mò dào zhì',
    pinyinInitials: 'bmdz',
    explanation: '本：树根；末：树梢；置：放。比喻把主次、轻重的位置弄颠倒了。',
    source: '金·无名氏《绥德州新学记》：「然非知治之审，则未尝不本末倒置。」',
    examples: [
      { sentence: '我们做任何事情都不能本末倒置，分清主次。' },
      { sentence: '只追求形式而忽略内容，是本末倒置的做法。' }
    ],
    synonyms: ['轻重倒置', '舍本逐末', '喧宾夺主'],
    antonyms: ['本末相顺', '顺理成章', '提纲挈领'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '贬义'
  },
  {
    name: '闭关锁国',
    pinyin: 'bì guān suǒ guó',
    pinyinInitials: 'bgsg',
    explanation: '闭关：封闭关口；锁：封锁。闭关自守，不与外国往来。',
    source: '《周易·复》：「先王以至日闭关，商旅不行，后不省方。」',
    examples: [
      { sentence: '闭关锁国只会导致国家落后，对外开放才能发展。' },
      { sentence: '清政府的闭关锁国政策，使中国落后于世界。' }
    ],
    synonyms: ['闭关自守', '故步自封', '闭门不纳'],
    antonyms: ['对外开放', '门户开放', '互通有无'],
    category: '成语典故',
    structure: '联合式',
    emotion: '贬义'
  },
  {
    name: '闭门思过',
    pinyin: 'bì mén sī guò',
    pinyinInitials: 'bmsg',
    explanation: '过：过失。关起门来反省自己的过错。',
    source: '《汉书·韩延寿传》：「因入卧传舍，闭阁思过。」',
    examples: [
      { sentence: '他知道自己错了，正在家中闭门思过。' },
      { sentence: '与其怨天尤人，不如闭门思过。' }
    ],
    synonyms: ['反躬自省', '闭门思愆', '清夜扪心'],
    antonyms: ['不思悔改', '文过饰非', '执迷不悟'],
    category: '成语典故',
    structure: '连动式',
    emotion: '中性'
  },
  {
    name: '变化多端',
    pinyin: 'biàn huà duō duān',
    pinyinInitials: 'bhdd',
    explanation: '端：头绪。形容变化极多。也指变化很大。',
    source: '明·冯梦龙《古今小说·陈从善梅岭失浑家》：「这齐天大圣神通广大，变化多端。」',
    examples: [
      { sentence: '天上的云变化多端，形态各异。' },
      { sentence: '市场行情变化多端，要谨慎投资。' }
    ],
    synonyms: ['变化莫测', '变化无常', '瞬息万变'],
    antonyms: ['一成不变', '千篇一律', '原封不动'],
    category: '成语典故',
    structure: '补充式',
    emotion: '中性'
  },
  {
    name: '标新立异',
    pinyin: 'biāo xīn lì yì',
    pinyinInitials: 'bxly',
    explanation: '标：提出，写明；异：不同的，特别的。提出新奇的主张，表示与众不同。',
    source: '南朝宋·刘义庆《世说新语·文学》：「支道林在白马寺中，将冯太常共语，因及《逍遥》，支卓然标新理于二家之表，立异义于众贤之外。」',
    examples: [
      { sentence: '他在设计中大胆标新立异，获得了好评。' },
      { sentence: '做学问不要一味标新立异，要实事求是。' }
    ],
    synonyms: ['独树一帜', '另起炉灶', '别出心裁'],
    antonyms: ['因循守旧', '墨守成规', '人云亦云'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '别出心裁',
    pinyin: 'bié chū xīn cái',
    pinyinInitials: 'bcxc',
    explanation: '别：另外；心裁：心中的设计、筹划。另有一种构思或设计。指想出的办法与众不同。',
    source: '明·李贽《水浒全书发凡》：「今别出心裁，不依旧样，或特标于目外，或叠采于回中。」',
    examples: [
      { sentence: '这个方案别出心裁，令人眼前一亮。' },
      { sentence: '他的设计别出心裁，获得了大奖。' }
    ],
    synonyms: ['别具一格', '独出心裁', '与众不同'],
    antonyms: ['千篇一律', '鹦鹉学舌', '步人后尘'],
    category: '成语典故',
    structure: '动宾式',
    emotion: '褒义'
  },
  {
    name: '冰天雪地',
    pinyin: 'bīng tiān xuě dì',
    pinyinInitials: 'btxd',
    explanation: '形容冰雪漫天盖地。',
    source: '清·蒋士铨《鸡毛房》：「冰天雪地风如虎，裸而泣者无栖所。」',
    examples: [
      { sentence: '冬天，北方到处是冰天雪地。' },
      { sentence: '战士们在冰天雪地里坚持训练。' }
    ],
    synonyms: ['天寒地冻', '千里冰封', '滴水成冰'],
    antonyms: ['骄阳似火', '烈日炎炎', '春暖花开'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '兵荒马乱',
    pinyin: 'bīng huāng mǎ luàn',
    pinyinInitials: 'bhml',
    explanation: '荒、乱：指社会秩序不安定。形容战争期间社会混乱不安的景象。',
    source: '元·无名氏《梧桐叶》第四折：「那兵荒马乱，定然遭驱被掳。」',
    examples: [
      { sentence: '在那兵荒马乱的年代，百姓过着流离失所的生活。' },
      { sentence: '兵荒马乱中，一家人失散了。' }
    ],
    synonyms: ['颠沛流离', '内忧外患', '鸡犬不宁'],
    antonyms: ['国泰民安', '安居乐业', '太平盛世'],
    category: '成语典故',
    structure: '联合式',
    emotion: '贬义'
  },
  {
    name: '波澜壮阔',
    pinyin: 'bō lán zhuàng kuò',
    pinyinInitials: 'blzk',
    explanation: '原形容水面辽阔。现比喻声势雄壮或规模巨大。',
    source: '南朝宋·鲍照《登大雷岸与妹书》：「旅客贫辛，波路壮阔。」',
    examples: [
      { sentence: '我被大海波澜壮阔的景象深深吸引了。' },
      { sentence: '改革开放以来，中国发生了波澜壮阔的变化。' }
    ],
    synonyms: ['浩浩荡荡', '气势磅礴', '汹涌澎湃'],
    antonyms: ['风平浪静', '一潭死水', '水波不兴'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '博大精深',
    pinyin: 'bó dà jīng shēn',
    pinyinInitials: 'bdjs',
    explanation: '博：广，多。形容思想和学识广博高深。',
    source: '明·姜世昌《逸周书》：「迄今读之，若揭日月而行千载，其博大精深之旨，非晚世学者所及。」',
    examples: [
      { sentence: '中华文化博大精深，源远流长。' },
      { sentence: '他的学问博大精深，令人钦佩。' }
    ],
    synonyms: ['博学多才', '经天纬地', '学富五车'],
    antonyms: ['才疏学浅', '孤陋寡闻', '井底之蛙'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '不耻下问',
    pinyin: 'bù chǐ xià wèn',
    pinyinInitials: 'bcxw',
    explanation: '乐于向学问或地位比自己低的人学习，而不觉得不好意思。',
    source: '《论语·公冶长》：「敏而好学，不耻下问。」',
    examples: [
      { sentence: '学习要有不耻下问的精神。' },
      { sentence: '他虽然是位大学问家，但仍然不耻下问。' }
    ],
    synonyms: ['谦虚谨慎', '虚怀若谷', '功成不居'],
    antonyms: ['好为人师', '骄傲自满', '夜郎自大'],
    category: '成语典故',
    structure: '动宾式',
    emotion: '褒义'
  },
  {
    name: '不拘一格',
    pinyin: 'bù jū yī gé',
    pinyinInitials: 'bjyg',
    explanation: '拘：限制；格：规格，方式。不局限于一种规格或一个格局。',
    source: '清·龚自珍《己亥杂诗》：「我劝天公重抖擞，不拘一格降人才。」',
    examples: [
      { sentence: '他的设计风格不拘一格，大胆创新。' },
      { sentence: '选拔人才要不拘一格，任人唯贤。' }
    ],
    synonyms: ['形形色色', '五花八门', '丰富多彩'],
    antonyms: ['如出一辙', '千篇一律', '循规蹈矩'],
    category: '成语典故',
    structure: '动宾式',
    emotion: '褒义'
  },
  {
    name: '不可思议',
    pinyin: 'bù kě sī yì',
    pinyinInitials: 'bksy',
    explanation: '原有神秘奥妙的意思。现多指无法想象，难以理解。',
    source: '《维摩诘所说经·不思议品》：「诸佛菩萨有解脱名不可思议。」',
    examples: [
      { sentence: '他竟然能完成这个不可能的任务，真是不可思议。' },
      { sentence: '宇宙的浩瀚令人感到不可思议。' }
    ],
    synonyms: ['不可捉摸', '神乎其神', '匪夷所思'],
    antonyms: ['可想而知', '一目了然', '通俗易懂'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '中性'
  },
  {
    name: '不劳而获',
    pinyin: 'bù láo ér huò',
    pinyinInitials: 'bleh',
    explanation: '自己不劳动却占有别人的劳动成果。获：获取，得到。',
    source: '《孔子家语·入官》：「所求于迩，故不劳而得也。」',
    examples: [
      { sentence: '他想不劳而获，结果一事无成。' },
      { sentence: '天下没有不劳而获的好事。' }
    ],
    synonyms: ['坐享其成', '不劳而得', '好吃懒做'],
    antonyms: ['自食其力', '自力更生', '勤劳致富'],
    category: '成语典故',
    structure: '紧缩式',
    emotion: '贬义'
  },
  {
    name: '不谋而合',
    pinyin: 'bù móu ér hé',
    pinyinInitials: 'bmeh',
    explanation: '谋：商量；合：相符。事先没有商量过，意见或行动却完全一致。',
    source: '晋·干宝《搜神记》卷二：「二人之言，不谋而合。」',
    examples: [
      { sentence: '我们的想法不谋而合，真是英雄所见略同。' },
      { sentence: '两人不谋而合，都选择了同样的路线。' }
    ],
    synonyms: ['不约而同', '异口同声', '殊途同归'],
    antonyms: ['众说纷纭', '言人人殊', '见仁见智'],
    category: '成语典故',
    structure: '紧缩式',
    emotion: '中性'
  },
  {
    name: '不求甚解',
    pinyin: 'bù qiú shèn jiě',
    pinyinInitials: 'bqsj',
    explanation: '甚：很，极。只求知道个大概，不求彻底了解。常指学习或研究不认真、不深入。',
    source: '晋·陶潜《五柳先生传》：「好读书，不求甚解。每有会意，便欣然忘食。」',
    examples: [
      { sentence: '学习知识不能不求甚解，要深入钻研。' },
      { sentence: '他读书总是不求甚解，所以成绩不好。' }
    ],
    synonyms: ['生吞活剥', '一知半解', '囫囵吞枣'],
    antonyms: ['寻根究底', '融会贯通', '精益求精'],
    category: '成语典故',
    structure: '动宾式',
    emotion: '贬义'
  },
  {
    name: '不屈不挠',
    pinyin: 'bù qū bù náo',
    pinyinInitials: 'bqbn',
    explanation: '屈：屈服；挠：弯曲。比喻在压力和困难面前不屈服，表现十分顽强。',
    source: '《汉书·叙传下》：「乐昌笃实，不桡不诎。」',
    examples: [
      { sentence: '他不屈不挠的精神令人钦佩。' },
      { sentence: '面对困难，我们要不屈不挠，勇往直前。' }
    ],
    synonyms: ['百折不挠', '坚韧不拔', '锲而不舍'],
    antonyms: ['卑躬屈膝', '奴颜婢膝', '半途而废'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '不速之客',
    pinyin: 'bù sù zhī kè',
    pinyinInitials: 'bszk',
    explanation: '速：邀请。指没有邀请突然而来的客人。',
    source: '《周易·需》：「有不速之客三人来，敬之终吉。」',
    examples: [
      { sentence: '我们正在吃饭，来了位不速之客。' },
      { sentence: '暴风雨是麦田的不速之客。' }
    ],
    synonyms: ['不请自来', '招之不来'],
    antonyms: ['特约嘉宾', '不辞而别'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '中性'
  },
  {
    name: '不相上下',
    pinyin: 'bù xiāng shàng xià',
    pinyinInitials: 'bxss',
    explanation: '分不出高低好坏。形容水平相当。',
    source: '唐·陆龟蒙《蠹化》：「翳叶仰啮，如饥蚕之速，不相上下。」',
    examples: [
      { sentence: '这两名选手的实力不相上下。' },
      { sentence: '他们俩的成绩不相上下，都很优秀。' }
    ],
    synonyms: ['势均力敌', '平起平坐', '旗鼓相当'],
    antonyms: ['天差地别', '悬殊很大', '判若云泥'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '中性'
  },
  {
    name: '不言而喻',
    pinyin: 'bù yán ér yù',
    pinyinInitials: 'byey',
    explanation: '喻：了解，明白。不用说话就能明白。形容道理很明显。',
    source: '《孟子·尽心上》：「仁义礼智根于心，其生色也，睟然见于面，盎于背，施于四体，四体不言而喻。」',
    examples: [
      { sentence: '他的用意不言而喻，大家都心照不宣。' },
      { sentence: '这个道理不言而喻，无需多加解释。' }
    ],
    synonyms: ['显而易见', '一目了然', '无庸赘述'],
    antonyms: ['扑朔迷离', '模棱两可', '不可思议'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '中性'
  },
  {
    name: '不约而同',
    pinyin: 'bù yuē ér tóng',
    pinyinInitials: 'byet',
    explanation: '约：相约。事先没有约定而相互一致。',
    source: '《史记·平津侯主父列传》：「应对而皆动，不谋而俱起，不约而同会。」',
    examples: [
      { sentence: '他们不约而同地站了起来。' },
      { sentence: '大家不约而同地选择了这个方案。' }
    ],
    synonyms: ['不谋而合', '殊途同归', '异口同声'],
    antonyms: ['众说纷纭', '言人人殊', '见仁见智'],
    category: '成语典故',
    structure: '紧缩式',
    emotion: '中性'
  },
  {
    name: '不折不扣',
    pinyin: 'bù zhé bù kòu',
    pinyinInitials: 'bzbk',
    explanation: '折、扣：出售商品时，按定价减去的成数。没有折扣，表示完全、十足的意思。',
    source: '《文明小史》第四十回：「人人都要做官，人人都说差使，自然而然的把钱糟蹋了，这不折不扣的是官魔作祟。」',
    examples: [
      { sentence: '他是个不折不扣的好人。' },
      { sentence: '这项工作要不折不扣地完成。' }
    ],
    synonyms: ['彻头彻尾', '实实在在', '原原本本'],
    antonyms: ['七折八扣', '添枝加叶', '画蛇添足'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '才高八斗',
    pinyin: 'cái gāo bā dǒu',
    pinyinInitials: 'cgbd',
    explanation: '才：文才，才华。比喻人极有才华。',
    source: '《南史·谢灵运传》：「天下才共一石，曹子建独得八斗，我得一斗，自古及今共分一斗。」',
    examples: [
      { sentence: '他才高八斗，学富五车。' },
      { sentence: '李白才高八斗，写下了许多脍炙人口的诗篇。' }
    ],
    synonyms: ['八斗之才', '才华横溢', '满腹经纶'],
    antonyms: ['才疏学浅', '胸无点墨', '碌碌无能'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '褒义'
  },
  {
    name: '沧海桑田',
    pinyin: 'cāng hǎi sāng tián',
    pinyinInitials: 'chst',
    explanation: '桑田：农田。大海变成桑田，桑田变成大海。比喻世事变化很大。',
    source: '晋·葛洪《神仙传·麻姑》：「麻姑自说云，接待以来，已见东海三为桑田。」',
    examples: [
      { sentence: '改革开放以来，家乡发生了沧海桑田的变化。' },
      { sentence: '历经沧海桑田，他终于回到了故乡。' }
    ],
    synonyms: ['日新月异', '翻天覆地', '白云苍狗'],
    antonyms: ['一成不变', '原封不动', '亘古不变'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '操之过急',
    pinyin: 'cāo zhī guò jí',
    pinyinInitials: 'czgj',
    explanation: '操：做，从事。处理事情，解决问题过于急躁。',
    source: '《汉书·五行志中之下》：「遂要不任道，将以一朝系决之，操之过急。」',
    examples: [
      { sentence: '做事不能操之过急，要稳扎稳打。' },
      { sentence: '教育孩子不能操之过急，要有耐心。' }
    ],
    synonyms: ['急于求成', '急功近利', '操切从事'],
    antonyms: ['稳扎稳打', '从容不迫', '循序渐进'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '贬义'
  },
  {
    name: '层峦叠嶂',
    pinyin: 'céng luán dié zhàng',
    pinyinInitials: 'cldz',
    explanation: '层峦：山连着山；叠嶂：许多高险的像屏障一样的山。形容山峰多而险峻。',
    source: '宋·陆九渊《与王谦仲书》：「方丈檐间，层峦叠嶂，奔腾飞动，近者数十里，远者数百里，争奇竞秀。」',
    examples: [
      { sentence: '这里层峦叠嶂，风景秀丽。' },
      { sentence: '走进山区，只见层峦叠嶂，云雾缭绕。' }
    ],
    synonyms: ['崇山峻岭', '千山万壑', '悬崖峭壁'],
    antonyms: ['一马平川', '一望无际', '坦荡如砥'],
    category: '自然景色',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '姹紫嫣红',
    pinyin: 'chà zǐ yān hóng',
    pinyinInitials: 'czyh',
    explanation: '姹、嫣：娇艳。形容各种花朵娇艳美丽。',
    source: '明·汤显祖《牡丹亭·惊梦》：「原来姹紫嫣红开遍，似这般都付与断井颓垣。」',
    examples: [
      { sentence: '春天来了，公园里姹紫嫣红。' },
      { sentence: '花园里姹紫嫣红，美不胜收。' }
    ],
    synonyms: ['百花齐放', '万紫千红', '花团锦簇'],
    antonyms: ['残花败柳', '破败不堪', '萧条冷落'],
    category: '自然景色',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '长驱直入',
    pinyin: 'cháng qū zhí rù',
    pinyinInitials: 'cqzr',
    explanation: '长驱：不停顿地策马快跑；直入：一直往前。指长距离不停顿的快速行进。形容进军迅猛，不可阻挡。',
    source: '《战国策·燕策二》：「轻卒锐兵，长驱至国。」汉·曹操《劳徐晃令》：「吾用兵三十余年，及所闻古之善用兵者，未有长驱径入敌围者也。」',
    examples: [
      { sentence: '我军长驱直入，势如破竹。' },
      { sentence: '汽车在高速公路上长驱直入。' }
    ],
    synonyms: ['势如破竹', '直捣黄龙', '所向披靡'],
    antonyms: ['裹足不前', '步步为营', '停滞不前'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '朝三暮四',
    pinyin: 'zhāo sān mù sì',
    pinyinInitials: 'zsms',
    explanation: '原指玩弄手法欺骗人。后用来比喻常常变卦，反复无常。',
    source: '《庄子·齐物论》：「狙公赋芧，曰：「朝三而暮四。」众狙皆怒。曰：「然则朝四而暮三。」众狙皆悦。」',
    examples: [
      { sentence: '他做事总是朝三暮四，没有恒心。' },
      { sentence: '做人不能朝三暮四，要讲信用。' }
    ],
    synonyms: ['朝秦暮楚', '反复无常', '三心二意'],
    antonyms: ['始终不渝', '墨守成规', '始终如一'],
    category: '成语典故',
    structure: '联合式',
    emotion: '贬义'
  },
  {
    name: '车水马龙',
    pinyin: 'chē shuǐ mǎ lóng',
    pinyinInitials: 'csml',
    explanation: '车像流水，马像游龙。形容来往车马很多，连续不断的热闹情景。',
    source: '《后汉书·明德马皇后纪》：「前过濯龙门上，见外家问起居者，车如流水，马如游龙。」',
    examples: [
      { sentence: '周末的商业街上，车水马龙，非常热闹。' },
      { sentence: '春节期间，大街小巷车水马龙。' }
    ],
    synonyms: ['川流不息', '络绎不绝', '门庭若市'],
    antonyms: ['门可罗雀', '冷冷清清', '人烟稀少'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '称心如意',
    pinyin: 'chèn xīn rú yì',
    pinyinInitials: 'cxry',
    explanation: '形容心满意足，事情的发展完全符合心意。',
    source: '宋·朱敦儒《感皇恩》词：「称心如意，剩活人间几岁？」',
    examples: [
      { sentence: '他终于找到了一份称心如意的工作。' },
      { sentence: '这件事处理得大家都称心如意。' }
    ],
    synonyms: ['心满意足', '如愿以偿', '尽如人意'],
    antonyms: ['大失所望', '事与愿违', '不如意'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '成群结队',
    pinyin: 'chéng qún jié duì',
    pinyinInitials: 'cqjd',
    explanation: '成：成为，变成。一群群人集合在一起。',
    source: '《新编五代史平话·周史上》：「无奈那雀儿成群结队来偷吃谷粟，才赶得东边的云，又向西边来吃。」',
    examples: [
      { sentence: '人们成群结队地去赶集。' },
      { sentence: '放学了，孩子们成群结队地走出校门。' }
    ],
    synonyms: ['三五成群', '络绎不绝', '人山人海'],
    antonyms: ['形单影只', '孑然一身', '孤苦伶仃'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  },
  {
    name: '诚实守信',
    pinyin: 'chéng shí shǒu xìn',
    pinyinInitials: 'cssx',
    explanation: '诚实：忠诚正直，不虚假；守信：保持信用，不失信。指为人真诚老实，讲信用。',
    source: '《论语·为政》：「人而无信，不知其可也。」',
    examples: [
      { sentence: '诚实守信是中华民族的传统美德。' },
      { sentence: '他是一个诚实守信的人。' }
    ],
    synonyms: ['一言九鼎', '一诺千金', '言而有信'],
    antonyms: ['言而无信', '背信弃义', '出尔反尔'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '持之以恒',
    pinyin: 'chí zhī yǐ héng',
    pinyinInitials: 'czyh',
    explanation: '持：坚持；恒：恒心。长久坚持下去。',
    source: '清·曾国藩《家训喻纪泽》：「尔之短处，在言语欠钝讷，举止欠端重，看书不能深入，而作文不能峥嵘。若能从此三事上下一番苦功，进之以猛，持之以恒，不过一二年，自尔精进而不觉。」',
    examples: [
      { sentence: '学习要持之以恒，不能三天打鱼两天晒网。' },
      { sentence: '他持之以恒地锻炼身体，身体越来越健康。' }
    ],
    synonyms: ['锲而不舍', '坚持不懈', '坚定不移'],
    antonyms: ['半途而废', '一暴十寒', '浅尝辄止'],
    category: '成语典故',
    structure: '偏正式',
    emotion: '褒义'
  },
  {
    name: '出类拔萃',
    pinyin: 'chū lèi bá cuì',
    pinyinInitials: 'clbc',
    explanation: '拔：超出；类：同类；萃：原为草丛生的样子，引伸为聚集。超出同类之上。多指人的品德才能。',
    source: '《孟子·公孙丑上》：「出于其类，拔乎其萃，自生民以来，未有盛于孔子也。」',
    examples: [
      { sentence: '他在众多应聘者中出类拔萃，脱颖而出。' },
      { sentence: '他是一位出类拔萃的科学家。' }
    ],
    synonyms: ['鹤立鸡群', '超群绝伦', '卓尔不群'],
    antonyms: ['碌碌无为', '滥竽充数', '平淡无奇'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '出生入死',
    pinyin: 'chū shēng rù sǐ',
    pinyinInitials: 'csrs',
    explanation: '原意是从出生到死去。后形容冒着生命危险，不顾个人安危。',
    source: '《老子》第五十章：「出生入死，生之徒十有三，死之徒十有三。」',
    examples: [
      { sentence: '战士们出生入死，保卫祖国。' },
      { sentence: '他为了革命事业出生入死。' }
    ],
    synonyms: ['赴汤蹈火', '舍生忘死', '奋不顾身'],
    antonyms: ['贪生怕死', '苟且偷生', '畏首畏尾'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '川流不息',
    pinyin: 'chuān liú bù xī',
    pinyinInitials: 'clbx',
    explanation: '川：河流。形容行人、车马等像水流一样连续不断。',
    source: '南朝梁·周兴嗣《千字文》：「川流不息，渊澄取映。」',
    examples: [
      { sentence: '马路上的车辆川流不息。' },
      { sentence: '每天来参观的人川流不息。' }
    ],
    synonyms: ['络绎不绝', '车水马龙', '连绵不断'],
    antonyms: ['荒无人烟', '人迹罕至', '水泄不通'],
    category: '成语典故',
    structure: '主谓式',
    emotion: '中性'
  },
  {
    name: '从容不迫',
    pinyin: 'cóng róng bù pò',
    pinyinInitials: 'crbp',
    explanation: '从容：不慌不忙，很镇静；不迫：不急促。不慌不忙，沉着镇定。',
    source: '《旧唐书·刘世龙传》「而思礼以为得计，从容自若，尝与相忤者，必引令枉诛。」',
    examples: [
      { sentence: '面对突发情况，他从容不迫，沉着应对。' },
      { sentence: '她在台上演讲，从容不迫，落落大方。' }
    ],
    synonyms: ['处之泰然', '镇定自若', '不慌不忙'],
    antonyms: ['惊慌失措', '手足无措', '张皇失措'],
    category: '成语典故',
    structure: '联合式',
    emotion: '褒义'
  },
  {
    name: '错综复杂',
    pinyin: 'cuò zōng fù zá',
    pinyinInitials: 'czfz',
    explanation: '错：交错，交叉；综：合在一起。形容头绪多，情况复杂。',
    source: '《周易·系辞上》：「参伍以变，错综其数。」',
    examples: [
      { sentence: '这个案件错综复杂，需要深入调查。' },
      { sentence: '国际形势错综复杂，变化莫测。' }
    ],
    synonyms: ['扑朔迷离', '盘根错节', '千头万绪'],
    antonyms: ['一目了然', '井然有序', '井井有条'],
    category: '成语典故',
    structure: '联合式',
    emotion: '中性'
  }
]
