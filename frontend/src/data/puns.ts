export type PunType = '谐音梗' | '双关语' | '网络流行梗' | '成语谐音' | '品牌梗' | '歇后语'

export type PunForm = '两字词' | '三字词' | '四字成语' | '多字短语' | '完整句子' | '歇后语'

export interface PunItem {
  content: string
  explanation?: string
  example?: string
  type: PunType
  hot?: boolean
}

export const punForms: PunForm[] = ['两字词', '三字词', '四字成语', '多字短语', '完整句子', '歇后语']

export const detectPunForm = (pun: PunItem): PunForm => {
  if (pun.type === '歇后语') return '歇后语'
  const cleanContent = pun.content.replace(/[（(][^）)]*[）)]/g, '').replace(/[，。！？、]/g, '')
  if (cleanContent.length === 2) return '两字词'
  if (cleanContent.length === 3) return '三字词'
  if (cleanContent.length === 4) return '四字成语'
  if (/[，。！？!?]/.test(pun.content) || pun.content.length >= 8) return '完整句子'
  return '多字短语'
}

export interface PunCharacter {
  character: string
  pinyin: string
  pinyinPlain: string
  homophoneChars: string[]
  puns: PunItem[]
}

export const punDatabase: PunCharacter[] = [
  {
    character: '鱼',
    pinyin: 'yú',
    pinyinPlain: 'yu',
    homophoneChars: ['余', '愉', '娱', '渔', '于', '予', '虞'],
    puns: [
      { content: '年年有鱼（余）', explanation: '利用「鱼」和「余」的谐音，祝福每年都有富余', example: '祝你新年年年有鱼！', type: '成语谐音', hot: true },
      { content: '鱼（愚）人节快乐', explanation: '「鱼」和「愚」谐音，愚人节的趣味说法', example: '今天是鱼人节，小心被整哦！', type: '网络流行梗', hot: true },
      { content: '摸鱼达人', explanation: '网络用语，形容在工作或学习中偷懒、不务正业的高手', example: '他可是办公室摸鱼达人，老板来了都发现不了。', type: '网络流行梗', hot: true },
      { content: '鱼（与）你相遇，好幸运', explanation: '「鱼」和「与」谐音，常用于浪漫表白', example: '鱼你相遇，是我这辈子最大的幸运。', type: '谐音梗' },
      { content: '鱼乐（娱乐）圈', explanation: '「鱼」和「娱」谐音，调侃娱乐圈', example: '鱼乐圈真的太乱了，我还是做条咸鱼吧。', type: '谐音梗' },
      { content: '咸鱼翻身', explanation: '比喻本来处于低谷的人突然时来运转', example: '没想到他这次咸鱼翻身，成了公司的红人。', type: '网络流行梗', hot: true },
      { content: '鱼生（余生）请多指教', explanation: '「鱼生」和「余生」谐音，常用于告白', example: '未来的鱼生，请多指教。', type: '谐音梗' },
      { content: '授人以鱼不如授人以渔', explanation: '原句是成语，利用「鱼」和「渔」的不同含义', example: '教他方法比直接给他钱强，授人以鱼不如授人以渔。', type: '成语谐音' }
    ]
  },
  {
    character: '马',
    pinyin: 'mǎ',
    pinyinPlain: 'ma',
    homophoneChars: ['蚂', '码', '玛', '骂', '嘛', '吗'],
    puns: [
      { content: '马（码）上有钱', explanation: '「马」和「码」谐音，打工人的美好愿望', example: '新的一年，希望马（码）上有钱！', type: '网络流行梗', hot: true },
      { content: '马上到', explanation: '双关语，既指骑马来也指马上就到', example: '别急，我马上到！', type: '双关语' },
      { content: '马（码）农', explanation: '「马」和「码」谐音，程序员的自嘲说法', example: '作为一个资深马农，我每天都在和bug战斗。', type: '网络流行梗', hot: true },
      { content: '马马虎虎', explanation: '形容做事不认真、凑合', example: '这件事他做得马马虎虎，需要返工。', type: '歇后语' },
      { content: '马到成功', explanation: '战马一到阵前就获得胜利，形容事情顺利', example: '祝你这次面试马到成功！', type: '成语谐音', hot: true },
      { content: '一马当先', explanation: '作战时策马冲锋在前，形容领先', example: '他在工作中总是一马当先，积极主动。', type: '成语谐音' },
      { content: '马（嘛）呢？', explanation: '「马」和「嘛」谐音，网络搞笑说法', example: '你马呢？怎么还不来！', type: '网络流行梗' },
      { content: '神马都是浮云', explanation: '「什么」谐音「神马」，网络流行语', example: '这点小事，神马都是浮云。', type: '网络流行梗', hot: true }
    ]
  },
  {
    character: '鸡',
    pinyin: 'jī',
    pinyinPlain: 'ji',
    homophoneChars: ['机', '激', '积', '基', '级', '极', '集', '吉', '即', '记'],
    puns: [
      { content: '鸡（机）会来了', explanation: '「鸡」和「机」谐音', example: '兄弟们，鸡会来了，冲啊！', type: '网络流行梗', hot: true },
      { content: '鸡（激）情四射', explanation: '「鸡」和「激」谐音', example: '这个节目真是鸡情四射！', type: '谐音梗' },
      { content: '鸡（积）极向上', explanation: '「鸡」和「积」谐音', example: '每天都要鸡极向上呀！', type: '谐音梗' },
      { content: '鸡你太美', explanation: '网络流行梗，因发音相似而来', example: '这首歌一出来，满屏都是鸡你太美。', type: '网络流行梗', hot: true },
      { content: '闻鸡起舞', explanation: '听到鸡叫就起床练剑，比喻有志之士及时奋发', example: '他每天闻鸡起舞，坚持锻炼身体。', type: '成语谐音' },
      { content: '金鸡独立', explanation: '一条腿站立的姿势', example: '他表演了一个金鸡独立，逗得大家哈哈大笑。', type: '成语谐音' },
      { content: '鸡（吉）祥如意', explanation: '「鸡」和「吉」谐音，新年祝福', example: '祝你鸡年大吉，鸡祥如意！', type: '成语谐音' },
      { content: '鸡（记）住了吗', explanation: '「鸡」和「记」谐音', example: '知识点都鸡住了吗？', type: '谐音梗' }
    ]
  },
  {
    character: '牛',
    pinyin: 'niú',
    pinyinPlain: 'niu',
    homophoneChars: ['扭', '纽', '妞', '钮'],
    puns: [
      { content: '牛（扭）转乾坤', explanation: '「牛」和「扭」谐音，比喻从根本上改变整个局面', example: '他上任后，公司业绩牛转乾坤。', type: '成语谐音', hot: true },
      { content: '真牛', explanation: '双关语，既指真的牛，也指真厉害', example: '你连这个都会，真牛！', type: '双关语', hot: true },
      { content: '牛气冲天', explanation: '形容气势旺盛或事业兴旺', example: '祝你新年牛气冲天！', type: '网络流行梗', hot: true },
      { content: '对牛弹琴', explanation: '比喻对不懂道理的人讲道理', example: '跟他说这些简直是对牛弹琴。', type: '成语谐音' },
      { content: '庖丁解牛', explanation: '比喻经过反复实践，掌握了事物的客观规律，做事得心应手', example: '他做这行十几年了，早已是庖丁解牛，游刃有余。', type: '成语谐音' },
      { content: '牛头不对马嘴', explanation: '比喻答非所问或两下不相合', example: '你说的牛头不对马嘴，完全不是一回事。', type: '歇后语' },
      { content: '牛（纽）约时报', explanation: '「牛」和「纽」谐音，搞笑说法', example: '这条新闻都上牛约时报了！', type: '谐音梗' }
    ]
  },
  {
    character: '羊',
    pinyin: 'yáng',
    pinyinPlain: 'yang',
    homophoneChars: ['阳', '洋', '杨', '扬', '样', '漾', '央'],
    puns: [
      { content: '羊（扬）眉吐气', explanation: '「羊」和「扬」谐音，形容摆脱受压后高兴的样子', example: '这次考试拿了第一，终于可以羊眉吐气了！', type: '成语谐音', hot: true },
      { content: '羊（阳）光灿烂', explanation: '「羊」和「阳」谐音', example: '今天天气真好，羊光灿烂！', type: '谐音梗' },
      { content: '羊（洋）气', explanation: '「羊」和「洋」谐音，形容时髦', example: '你这身打扮可真羊气！', type: '双关语' },
      { content: '三羊（阳）开泰', explanation: '「羊」和「阳」谐音，新年祝福语', example: '祝你三羊开泰，万事如意！', type: '成语谐音', hot: true },
      { content: '亡羊补牢', explanation: '羊丢了再补羊圈，比喻出了问题后及时补救', example: '现在改还来得及，亡羊补牢，为时未晚。', type: '成语谐音' },
      { content: '顺手牵羊', explanation: '比喻顺便拿走别人的东西', example: '他顺手牵羊拿走了桌上的笔。', type: '成语谐音' },
      { content: '羊（样）子不错', explanation: '「羊」和「样」谐音', example: '你这羊子不错嘛，挺帅的！', type: '谐音梗' }
    ]
  },
  {
    character: '猴',
    pinyin: 'hóu',
    pinyinPlain: 'hou',
    homophoneChars: ['侯', '喉', '猴', '厚', '后', '候'],
    puns: [
      { content: '猴（侯）门似海', explanation: '「猴」和「侯」谐音', example: '一入猴门深似海，从此萧郎是路人。', type: '成语谐音' },
      { content: '猴赛雷', explanation: '广东话「好厉害」的谐音', example: '你连这个都知道，猴赛雷啊！', type: '网络流行梗', hot: true },
      { content: '猴急', explanation: '双关语，既指像猴子一样急，也指着急', example: '别猴急，等我说完。', type: '双关语' },
      { content: '杀鸡儆猴', explanation: '比喻惩罚一个人来警戒其他人', example: '老板开除了他，就是为了杀鸡儆猴。', type: '成语谐音' },
      { content: '猴（后）会有期', explanation: '「猴」和「后」谐音', example: '朋友们，猴会有期！', type: '谐音梗' },
      { content: '猴（厚）积薄发', explanation: '「猴」和「厚」谐音', example: '多年积累，今日猴积薄发！', type: '谐音梗' }
    ]
  },
  {
    character: '狗',
    pinyin: 'gǒu',
    pinyinPlain: 'gou',
    homophoneChars: ['够', '苟', '沟', '购', '钩', '构'],
    puns: [
      { content: '狗（够）了', explanation: '「狗」和「够」谐音，表示无法忍受', example: '你真是太狗了，我受狗了！', type: '网络流行梗', hot: true },
      { content: '狗（苟）住', explanation: '「狗」和「苟」谐音，游戏用语，表示保命、坚守', example: '别出去浪，先狗住！', type: '网络流行梗', hot: true },
      { content: '狗（苟）且偷生', explanation: '「狗」和「苟」谐音', example: '在这个困难时期，只能狗且偷生了。', type: '谐音梗' },
      { content: '单身狗', explanation: '网络流行语，指单身的人', example: '情人节又到了，作为一只单身狗，我选择在家追剧。', type: '网络流行梗', hot: true },
      { content: '狗带', explanation: '英文「go die」的谐音，意为去死', example: '这道题太难了，我选择狗带。', type: '网络流行梗', hot: true },
      { content: '狗粮', explanation: '双关语，既指狗吃的粮，也指情侣秀恩爱', example: '又在朋友圈撒狗粮，考虑过单身狗的感受吗？', type: '双关语', hot: true },
      { content: '狼心狗肺', explanation: '形容心肠像狼和狗一样凶恶狠毒', example: '他这种狼心狗肺的人，不会有好下场的。', type: '成语谐音' },
      { content: '狗（购）物狂欢', explanation: '「狗」和「购」谐音', example: '双十一又到了，狗物狂欢节！', type: '谐音梗' }
    ]
  },
  {
    character: '猪',
    pinyin: 'zhū',
    pinyinPlain: 'zhu',
    homophoneChars: ['珠', '朱', '诸', '株', '蛛', '竹', '烛', '逐', '筑'],
    puns: [
      { content: '猪（珠）光宝气', explanation: '「猪」和「珠」谐音', example: '新年到了，祝你猪光宝气！', type: '成语谐音', hot: true },
      { content: '猪（诸）事顺利', explanation: '「猪」和「诸」谐音，新年祝福', example: '祝你猪年大吉，猪事顺利！', type: '成语谐音', hot: true },
      { content: '猪（逐）梦前行', explanation: '「猪」和「逐」谐音', example: '新的一年，让我们猪梦前行！', type: '谐音梗' },
      { content: '小猪佩奇身上纹，掌声送给社会人', explanation: '网络流行梗', example: '小猪佩奇身上纹，掌声送给社会人！', type: '网络流行梗', hot: true },
      { content: '猪队友', explanation: '网络流行语，指像猪一样笨的队友', example: '又遇到猪队友了，这把游戏要输。', type: '网络流行梗', hot: true },
      { content: '好吃懒做像头猪', explanation: '歇后语式的调侃', example: '整天好吃懒做像头猪！', type: '歇后语' },
      { content: '猪（竹）报平安', explanation: '「猪」和「竹」谐音', example: '猪报平安，岁岁吉祥！', type: '谐音梗' }
    ]
  },
  {
    character: '钱',
    pinyin: 'qián',
    pinyinPlain: 'qian',
    homophoneChars: ['前', '潜', '乾', '签', '千', '迁', '牵', '浅', '遣'],
    puns: [
      { content: '钱（前）途无量', explanation: '「钱」和「前」谐音', example: '好好干，钱途无量！', type: '成语谐音', hot: true },
      { content: '钱（乾）坤未定，你我皆是黑马', explanation: '「钱」和「乾」谐音', example: '钱坤未定，你我皆是黑马，冲鸭！', type: '网络流行梗', hot: true },
      { content: '有錢能使鬼推磨', explanation: '形容金钱万能', example: '俗话说，有錢能使鬼推磨，这话不假。', type: '歇后语' },
      { content: '钱（潜）力股', explanation: '「钱」和「潜」谐音，比喻有赚钱潜力的人或物', example: '这个项目绝对是钱力股！', type: '谐音梗' },
      { content: '谈钱伤感情', explanation: '俗语', example: '咱们兄弟，谈钱伤感情！', type: '歇后语' },
      { content: '钱（千）军万马', explanation: '「钱」和「千」谐音', example: '为了赚钱，哪怕是钱军万马我也冲了！', type: '谐音梗' },
      { content: '见钱眼开', explanation: '看到钱财眼睛就睁大了，形容贪财', example: '他这个人见钱眼开，什么事都做得出来。', type: '成语谐音' }
    ]
  },
  {
    character: '饭',
    pinyin: 'fàn',
    pinyinPlain: 'fan',
    homophoneChars: ['犯', '泛', '范', '烦', '繁', '反', '返'],
    puns: [
      { content: '饭（犯）罪嫌疑人', explanation: '「饭」和「犯」谐音，调侃爱吃的人', example: '因干饭太多，我被列为饭罪嫌疑人。', type: '网络流行梗', hot: true },
      { content: '干饭人', explanation: '网络流行语，指热衷于吃饭的人', example: '干饭人，干饭魂，干饭都是人上人！', type: '网络流行梗', hot: true },
      { content: '饭（烦）死了', explanation: '「饭」和「烦」谐音，调侃因为吃饭烦恼', example: '今天吃什么？真是饭死了！', type: '谐音梗' },
      { content: '饭圈', explanation: '粉丝圈子的简称', example: '现在的饭圈文化太疯狂了。', type: '网络流行梗', hot: true },
      { content: '饭（范）本', explanation: '「饭」和「范」谐音', example: '这干饭速度，堪称饭本！', type: '谐音梗' },
      { content: '吃着碗里的，看着锅里的', explanation: '歇后语，形容贪心', example: '他这个人总是吃着碗里的，看着锅里的。', type: '歇后语' },
      { content: '饭来张口，衣来伸手', explanation: '形容人好吃懒做', example: '你不能总是饭来张口，衣来伸手，要学会独立。', type: '歇后语' }
    ]
  },
  {
    character: '雨',
    pinyin: 'yǔ',
    pinyinPlain: 'yu',
    homophoneChars: ['与', '语', '羽', '宇', '玉', '域', '愈', '欲', '御'],
    puns: [
      { content: '雨（语）你无瓜', explanation: '「雨」和「语」谐音，「与你无关」的趣味说法', example: '我穿什么雨女无瓜！', type: '网络流行梗', hot: true },
      { content: '雨（与）你相遇', explanation: '「雨」和「与」谐音，浪漫表达', example: '下雨天，雨你相遇，好幸运。', type: '谐音梗' },
      { content: '风雨无阻', explanation: '不受刮风下雨的阻碍', example: '他每天坚持跑步，风雨无阻。', type: '成语谐音' },
      { content: '雨（欲）罢不能', explanation: '「雨」和「欲」谐音', example: '这部剧太好看了，让人雨罢不能。', type: '谐音梗' },
      { content: '雨（玉）树临风', explanation: '「雨」和「玉」谐音', example: '小哥哥长得真是雨树临风！', type: '谐音梗' },
      { content: '雨后春笋', explanation: '比喻新生事物迅速大量地涌现出来', example: '疫情后，新企业如雨后春笋般出现。', type: '成语谐音' },
      { content: '听君一席话，胜读十年书', explanation: '歇后语', example: '听君一席话，胜读十年书，受教了！', type: '歇后语' }
    ]
  },
  {
    character: '风',
    pinyin: 'fēng',
    pinyinPlain: 'feng',
    homophoneChars: ['丰', '封', '疯', '峰', '锋', '蜂', '枫', '烽'],
    puns: [
      { content: '风（丰）衣足食', explanation: '「风」和「丰」谐音', example: '祝你新年风衣足食！', type: '成语谐音' },
      { content: '风（疯）了', explanation: '「风」和「疯」谐音', example: '作业太多了，我要风了！', type: '网络流行梗', hot: true },
      { content: '风（封）杀', explanation: '「风」和「封」谐音', example: '这个账号被风杀了。', type: '谐音梗' },
      { content: '风（峰）回路转', explanation: '「风」和「峰」谐音', example: '事情终于风回路转了！', type: '成语谐音' },
      { content: '一帆风顺', explanation: '船挂着满帆顺风行驶，比喻非常顺利', example: '祝你事业一帆风顺！', type: '成语谐音', hot: true },
      { content: '风（锋）芒毕露', explanation: '「风」和「锋」谐音', example: '他在比赛中风芒毕露。', type: '谐音梗' },
      { content: '乘风破浪', explanation: '船只乘着风势破浪前进，比喻志向远大', example: '新时代青年要乘风破浪，勇往直前！', type: '成语谐音' },
      { content: '跟风', explanation: '双关语，既指随风，也指追随潮流', example: '不要盲目跟风买东西。', type: '双关语' }
    ]
  },
  {
    character: '花',
    pinyin: 'huā',
    pinyinPlain: 'hua',
    homophoneChars: ['华', '哗', '滑', '划', '化', '话'],
    puns: [
      { content: '花（华）丽转身', explanation: '「花」和「华」谐音', example: '这次她花丽转身，惊艳全场。', type: '谐音梗' },
      { content: '花（划）算', explanation: '「花」和「划」谐音，双关', example: '花钱买这个，太不花算了！', type: '双关语' },
      { content: '花（话）里有话', explanation: '「花」和「话」谐音', example: '你这是花里有话啊。', type: '谐音梗' },
      { content: '花（滑）天下之大稽', explanation: '「花」和「滑」谐音', example: '这简直是花天下之大稽！', type: '成语谐音' },
      { content: '花好月圆', explanation: '花儿正盛开，月亮正圆满，比喻美好圆满', example: '祝你们花好月圆，白头偕老！', type: '成语谐音', hot: true },
      { content: '锦上添花', explanation: '在锦上再绣花，比喻好上加好', example: '有了这个装饰，真是锦上添花！', type: '成语谐音' },
      { content: '花花世界', explanation: '指繁华的地方或寻欢作乐的场所', example: '外面的花花世界太精彩了。', type: '网络流行梗' }
    ]
  },
  {
    character: '菜',
    pinyin: 'cài',
    pinyinPlain: 'cai',
    homophoneChars: ['才', '财', '采', '彩', '猜', '材', '蔡'],
    puns: [
      { content: '菜（才）华横溢', explanation: '「菜」和「才」谐音，调侃游戏玩得差', example: '你这操作，真是菜华横溢！', type: '网络流行梗', hot: true },
      { content: '菜（财）源广进', explanation: '「菜」和「财」谐音', example: '祝你新年菜源广进！', type: '成语谐音' },
      { content: '菜鸟', explanation: '网络流行语，指新手、水平差的人', example: '我只是个菜鸟，别骂我。', type: '网络流行梗', hot: true },
      { content: '菜（彩）虹屁', explanation: '「菜」和「彩」谐音', example: '少给我放菜虹屁！', type: '谐音梗' },
      { content: '菜（猜）不透', explanation: '「菜」和「猜」谐音', example: '女人的心思，真是菜不透。', type: '谐音梗' },
      { content: '挑菜（财）', explanation: '「菜」和「财」谐音', example: '祝你新年多挑菜！', type: '谐音梗' },
      { content: '小菜一碟', explanation: '比喻事情很容易做', example: '这点事对我来说就是小菜一碟。', type: '歇后语', hot: true }
    ]
  },
  {
    character: '水',
    pinyin: 'shuǐ',
    pinyinPlain: 'shui',
    homophoneChars: ['睡', '税', '谁', '随', '岁'],
    puns: [
      { content: '水（睡）不着', explanation: '「水」和「睡」谐音', example: '今天喝太多水了，水不着。', type: '网络流行梗', hot: true },
      { content: '水（随）遇而安', explanation: '「水」和「随」谐音', example: '做人要学会水遇而安。', type: '成语谐音' },
      { content: '水（岁）月静好', explanation: '「水」和「岁」谐音', example: '不求大富大贵，只求水月静好。', type: '谐音梗' },
      { content: '水（税）后工资', explanation: '「水」和「税」谐音', example: '看看我的水后工资，心疼。', type: '谐音梗' },
      { content: '水群', explanation: '网络用语，在群里发大量无意义消息', example: '又在水群，小心被踢。', type: '网络流行梗' },
      { content: '水到渠成', explanation: '水流到的地方自然形成一条水道，比喻条件成熟事情自然成功', example: '只要努力，成功自然水到渠成。', type: '成语谐音', hot: true },
      { content: '山清水秀', explanation: '形容风景优美', example: '我的家乡山清水秀，风景如画。', type: '成语谐音' }
    ]
  },
  {
    character: '火',
    pinyin: 'huǒ',
    pinyinPlain: 'huo',
    homophoneChars: ['伙', '或', '货', '获', '祸', '惑'],
    puns: [
      { content: '火（伙）伴', explanation: '「火」和「伙」谐音', example: '好火伴，一起走！', type: '谐音梗' },
      { content: '火（获）得成功', explanation: '「火」和「获」谐音', example: '祝你早日火得成功！', type: '谐音梗' },
      { content: '火（货）真价实', explanation: '「火」和「货」谐音', example: '我这手艺，火真价实！', type: '成语谐音' },
      { content: '火火火', explanation: '网络流行语，形容非常火爆', example: '这首歌最近火火火！', type: '网络流行梗', hot: true },
      { content: '火前留名', explanation: '网络用语，在帖子火之前先留下名字', example: '火前留名，万一火了呢！', type: '网络流行梗', hot: true },
      { content: '红红火火', explanation: '形容旺盛或经济优裕的生活', example: '祝你日子过得红红火火！', type: '成语谐音', hot: true },
      { content: '火眼金睛', explanation: '原指孙悟空能识别妖魔鬼怪的眼睛，后形容眼光十分敏锐', example: '老板火眼金睛，一眼就看出了问题。', type: '成语谐音' }
    ]
  },
  {
    character: '乐',
    pinyin: 'lè',
    pinyinPlain: 'le',
    homophoneChars: ['了', '勒', '雷', '泪', '类', '累'],
    puns: [
      { content: '乐（了）不起', explanation: '「乐」和「了」谐音', example: '这有什么可乐不起的？', type: '谐音梗' },
      { content: '乐（勒）紧裤腰带', explanation: '「乐」和「勒」谐音', example: '双十一后，只能乐紧裤腰带过日子了。', type: '网络流行梗', hot: true },
      { content: '乐（泪）流满面', explanation: '「乐」和「泪」谐音', example: '看到成绩的我，乐流满面。', type: '谐音梗' },
      { content: '乐在其中', explanation: '喜欢做某事，并在其中获得乐趣', example: '虽然工作辛苦，但他乐在其中。', type: '成语谐音' },
      { content: '乐不思蜀', explanation: '比喻在新环境中得到乐趣，不再想回到原来环境中去', example: '他出国后乐不思蜀，不想回来了。', type: '成语谐音' },
      { content: '助人为乐', explanation: '把帮助别人当作快乐', example: '他是个助人为乐的好孩子。', type: '成语谐音', hot: true },
      { content: '快乐星球', explanation: '网络流行语，指快乐的地方', example: '什么是快乐星球？让我带你研究！', type: '网络流行梗', hot: true }
    ]
  },
  {
    character: '香',
    pinyin: 'xiāng',
    pinyinPlain: 'xiang',
    homophoneChars: ['想', '乡', '相', '箱', '镶', '详', '祥', '翔', '享'],
    puns: [
      { content: '香（想）你了', explanation: '「香」和「想」谐音', example: '宝贝，我香你了！', type: '谐音梗', hot: true },
      { content: '真香', explanation: '网络流行语，指前后打脸的情况', example: '当初说不玩的，现在真香！', type: '网络流行梗', hot: true },
      { content: '香（享）受生活', explanation: '「香」和「享」谐音', example: '努力赚钱，香受生活！', type: '谐音梗' },
      { content: '香（祥）瑞御猫', explanation: '「香」和「祥」谐音，网络搞笑说法', example: '这可是香瑞御猫！', type: '网络流行梗' },
      { content: '香（相）信自己', explanation: '「香」和「相」谐音', example: '你可以的，香信自己！', type: '谐音梗' },
      { content: '国色天香', explanation: '原形容颜色和香气不同于一般花卉的牡丹花，后也形容女子的美丽', example: '她长得国色天香，倾国倾城。', type: '成语谐音' },
      { content: '香（乡）愁', explanation: '「香」和「乡」谐音', example: '离家久了，免不了有一香愁。', type: '谐音梗' }
    ]
  },
  {
    character: '甜',
    pinyin: 'tián',
    pinyinPlain: 'tian',
    homophoneChars: ['田', '填', '恬', '天'],
    puns: [
      { content: '甜（填）满', explanation: '「甜」和「填」谐音', example: '帮我甜满这杯奶茶！', type: '谐音梗' },
      { content: '甜（天）天向上', explanation: '「甜」和「天」谐音', example: '祝你学习甜天向上！', type: '成语谐音', hot: true },
      { content: '甜（恬）静', explanation: '「甜」和「恬」谐音', example: '她长得好甜静。', type: '谐音梗' },
      { content: '甜甜圈', explanation: '双关语，既指甜点，也指甜蜜', example: '心情不好就吃个甜甜圈。', type: '双关语' },
      { content: '小甜心', explanation: '对心爱的人的昵称', example: '你是我的小甜心。', type: '网络流行梗', hot: true },
      { content: '甜（田）园风光', explanation: '「甜」和「田」谐音', example: '这里的甜园风光真美！', type: '谐音梗' }
    ]
  },
  {
    character: '高',
    pinyin: 'gāo',
    pinyinPlain: 'gao',
    homophoneChars: ['糕', '搞', '告', '稿', '膏', '睾', '篙', '羔'],
    puns: [
      { content: '高（糕）兴', explanation: '「高」和「糕」谐音', example: '今天吃了蛋糕，真好高！', type: '谐音梗' },
      { content: '高（搞）事情', explanation: '「高」和「搞」谐音', example: '他又在高事情了。', type: '网络流行梗', hot: true },
      { content: '高（告）白', explanation: '「高」和「告」谐音', example: '准备向喜欢的人高白。', type: '谐音梗' },
      { content: '高（稿）子', explanation: '「高」和「稿」谐音', example: '这个月的高子还没写完。', type: '谐音梗' },
      { content: '高手', explanation: '双关语，既指手高，也指技能厉害的人', example: '这是个高手中的高手！', type: '双关语', hot: true },
      { content: '高富帅', explanation: '网络流行语，形容男人身高高、富有、帅气', example: '谁不想找个高富帅男朋友呢？', type: '网络流行梗', hot: true },
      { content: '高高兴兴', explanation: '形容心情愉快', example: '每天都要高高兴兴的！', type: '歇后语' },
      { content: '高瞻远瞩', explanation: '站得高，看得远，比喻眼光远大', example: '他是个高瞻远瞩的领导者。', type: '成语谐音' }
    ]
  },
  {
    character: '低',
    pinyin: 'dī',
    pinyinPlain: 'di',
    homophoneChars: ['滴', '的', '底', '抵', '弟', '递', '第', '堤'],
    puns: [
      { content: '低（滴）答', explanation: '「低」和「滴」谐音', example: '雨低答低答地下着。', type: '谐音梗' },
      { content: '低（底）价', explanation: '「低」和「底」谐音', example: '跳楼低价，走过路过不要错过！', type: '双关语' },
      { content: '低（弟）子', explanation: '「低」和「弟」谐音', example: '我是他的低大弟子。', type: '谐音梗' },
      { content: '低头思故乡', explanation: '古诗，也可双关', example: '举头望明月，低头思故乡...的美食。', type: '网络流行梗' },
      { content: '低（递）纸', explanation: '「低」和「递」谐音', example: '快给我低纸，我要哭了。', type: '谐音梗' },
      { content: '低（第）一名', explanation: '「低」和「第」谐音，反讽', example: '这次考试又是我低一名（倒数）。', type: '谐音梗' }
    ]
  },
  {
    character: '明',
    pinyin: 'míng',
    pinyinPlain: 'ming',
    homophoneChars: ['名', '鸣', '铭', '冥', '茗', '溟'],
    puns: [
      { content: '明（名）场面', explanation: '「明」和「名」谐音，网络流行语', example: '这段表演堪称明场面！', type: '网络流行梗', hot: true },
      { content: '明（名）正言顺', explanation: '「明」和「名」谐音', example: '他明正言顺地坐上了这个位置。', type: '成语谐音' },
      { content: '明（鸣）惊人', explanation: '「明」和「鸣」谐音', example: '他的表演一明惊人！', type: '成语谐音', hot: true },
      { content: '明（铭）记于心', explanation: '「明」和「铭」谐音', example: '您的教诲我明记于心。', type: '谐音梗' },
      { content: '明天', explanation: '双关语，既指明天，也指「明天」这个概念', example: '明天的事情明天再说。', type: '双关语' },
      { content: '明明白白', explanation: '形容清清楚楚', example: '明人不说暗话，我明明白白告诉你。', type: '歇后语' },
      { content: '柳暗花明', explanation: '比喻在困难中遇到转机', example: '本以为没希望了，没想到柳暗花明又一村。', type: '成语谐音' }
    ]
  },
  {
    character: '星',
    pinyin: 'xīng',
    pinyinPlain: 'xing',
    homophoneChars: ['心', '新', '欣', '辛', '薪', '馨', '兴', '腥', '刑', '型'],
    puns: [
      { content: '星（心）想事成', explanation: '「星」和「心」谐音', example: '祝你新年星想事成！', type: '成语谐音', hot: true },
      { content: '星（新）年快乐', explanation: '「星」和「新」谐音', example: '星年快乐！', type: '谐音梗' },
      { content: '星（薪）水', explanation: '「星」和「薪」谐音', example: '每月就这点星水，太难了。', type: '谐音梗' },
      { content: '星（辛）苦了', explanation: '「星」和「辛」谐音', example: '打工人，星苦了！', type: '网络流行梗', hot: true },
      { content: '星（兴）高采烈', explanation: '「星」和「兴」谐音', example: '他今天星高采烈的。', type: '成语谐音' },
      { content: '星星之火，可以燎原', explanation: '比喻新生力量开始虽然弱小，但有远大的发展前途', example: '星星之火，可以燎原，不要小看年轻人。', type: '歇后语' },
      { content: '追星', explanation: '双关语，既指追星星，也指追明星', example: '我追星追了十年了。', type: '网络流行梗', hot: true }
    ]
  },
  {
    character: '月',
    pinyin: 'yuè',
    pinyinPlain: 'yue',
    homophoneChars: ['越', '约', '乐', '悦', '阅', '跃', '岳', '粤'],
    puns: [
      { content: '月（越）来越好', explanation: '「月」和「越」谐音', example: '祝你日子月来越好！', type: '谐音梗', hot: true },
      { content: '月（约）吗', explanation: '「月」和「约」谐音', example: '周末一起吃饭，月吗？', type: '网络流行梗' },
      { content: '月（悦）读', explanation: '「月」和「悦」谐音', example: '月读使人快乐。', type: '谐音梗' },
      { content: '月（跃）跃欲试', explanation: '「月」和「跃」谐音', example: '大家都月月欲试。', type: '成语谐音' },
      { content: '月饼节', explanation: '中秋节的戏称', example: '月饼节快乐！', type: '网络流行梗', hot: true },
      { content: '花好月圆', explanation: '比喻美好圆满', example: '中秋佳节，花好月圆。', type: '成语谐音' },
      { content: '月（阅）读量', explanation: '「月」和「阅」谐音', example: '这篇文章的月读量真高。', type: '谐音梗' }
    ]
  },
  {
    character: '光',
    pinyin: 'guāng',
    pinyinPlain: 'guang',
    homophoneChars: ['广', '逛', '胱', '咣'],
    puns: [
      { content: '光（广）告', explanation: '「光」和「广」谐音', example: '这个光告打得好！', type: '谐音梗' },
      { content: '光（逛）街', explanation: '「光」和「逛」谐音', example: '周末一起光街吧！', type: '谐音梗' },
      { content: '光棍节', explanation: '11月11日，单身狗的节日', example: '光棍节快乐！', type: '网络流行梗', hot: true },
      { content: '打光（逛）', explanation: '「光」和「逛」谐音', example: '今天准备去哪儿打光？', type: '网络流行梗' },
      { content: '光明正大', explanation: '心怀坦白，言行正派', example: '做事要光明正大，不要偷偷摸摸。', type: '成语谐音' },
      { content: '一扫而光', explanation: '一下子就扫除干净', example: '这桌菜被他一扫而光。', type: '歇后语' },
      { content: '光说不练', explanation: '只说不做', example: '别光说不练，来点实际的。', type: '歇后语' }
    ]
  },
  {
    character: '云',
    pinyin: 'yún',
    pinyinPlain: 'yun',
    homophoneChars: ['运', '允', '韵', '孕', '匀', '芸', '耘'],
    puns: [
      { content: '云（运）气', explanation: '「云」和「运」谐音', example: '今天云气真好！', type: '双关语' },
      { content: '云（允）许', explanation: '「云」和「允」谐音', example: '云许我做个自我介绍。', type: '谐音梗' },
      { content: '云（孕）育', explanation: '「云」和「孕」谐音', example: '大自然云育了万物。', type: '谐音梗' },
      { content: '云（匀）称', explanation: '「云」和「匀」谐音', example: '她的身材很云称。', type: '谐音梗' },
      { content: '云玩家', explanation: '网络流行语，指没实际玩过却在评论游戏的人', example: '又是一个云玩家在乱说。', type: '网络流行梗', hot: true },
      { content: '风轻云淡', explanation: '形容天气晴好，也比喻轻松', example: '他看起来总是风轻云淡的。', type: '成语谐音' }
    ]
  },
  {
    character: '龙',
    pinyin: 'lóng',
    pinyinPlain: 'long',
    homophoneChars: ['笼', '聋', '隆', '拢', '珑', '胧'],
    puns: [
      { content: '龙（隆）重', explanation: '「龙」和「隆」谐音', example: '今天的会议龙重召开。', type: '谐音梗' },
      { content: '龙（聋）了', explanation: '「龙」和「聋」谐音', example: '你说什么？我龙了。', type: '网络流行梗' },
      { content: '龙的传人', explanation: '指中国人', example: '我们都是龙的传人。', type: '网络流行梗', hot: true },
      { content: '画龙点睛', explanation: '比喻在关键处用几句话点明实质', example: '这句话画龙点睛，说得真好。', type: '成语谐音' },
      { content: '龙马精神', explanation: '比喻人精神旺盛', example: '祝您龙马精神，身体健康！', type: '成语谐音', hot: true },
      { content: '望子成龙', explanation: '希望子女出人头地', example: '每个父母都望子成龙。', type: '成语谐音' },
      { content: '叶公好龙', explanation: '比喻口头上说爱好某事物，实际上并不真爱好', example: '他说喜欢猫，但猫来了他又怕，真是叶公好龙。', type: '成语谐音' }
    ]
  },
  {
    character: '虎',
    pinyin: 'hǔ',
    pinyinPlain: 'hu',
    homophoneChars: ['护', '户', '互', '糊', '呼', '胡', '狐', '蝴', '壶'],
    puns: [
      { content: '虎（护）士', explanation: '「虎」和「护」谐音', example: '白衣天使虎士小姐姐。', type: '谐音梗' },
      { content: '虎（互）联网', explanation: '「虎」和「互」谐音', example: '在虎联网时代...', type: '谐音梗' },
      { content: '虎（糊）涂', explanation: '「虎」和「糊」谐音', example: '你怎么这么虎涂！', type: '双关语' },
      { content: '虎（呼）吁', explanation: '「虎」和「呼」谐音', example: '让我们一起虎吁...', type: '谐音梗' },
      { content: '虎头虎脑', explanation: '形容壮健憨厚的样子', example: '这孩子长得虎头虎脑的。', type: '歇后语' },
      { content: '虎虎生威', explanation: '形容气势威武', example: '新年祝你虎虎生威！', type: '成语谐音', hot: true },
      { content: '狐假虎威', explanation: '比喻依仗别人的势力欺压人', example: '他不过是狐假虎威罢了。', type: '成语谐音' },
      { content: '虎（胡）说八道', explanation: '「虎」和「胡」谐音', example: '你在这虎说八道什么！', type: '谐音梗' }
    ]
  },
  {
    character: '蛇',
    pinyin: 'shé',
    pinyinPlain: 'she',
    homophoneChars: ['舌', '折', '社', '射', '舍', '设', '涉', '摄'],
    puns: [
      { content: '蛇（舌）头', explanation: '「蛇」和「舌」谐音', example: '咬到蛇头了。', type: '双关语' },
      { content: '蛇（社）会', explanation: '「蛇」和「社」谐音', example: '蛇会社会社会，惹不起惹不起。', type: '网络流行梗' },
      { content: '蛇（设）计', explanation: '「蛇」和「设」谐音', example: '这个蛇计不错。', type: '谐音梗' },
      { content: '蛇（摄）影', explanation: '「蛇」和「摄」谐音', example: '他是个蛇影师。', type: '谐音梗' },
      { content: '画蛇添足', explanation: '比喻做了多余的事', example: '这段话画蛇添足了，删掉吧。', type: '成语谐音' },
      { content: '虎头蛇尾', explanation: '比喻开始时声势很大，后来劲头很小', example: '做事不能虎头蛇尾。', type: '成语谐音' },
      { content: '打草惊蛇', explanation: '比喻做法不谨慎，使对方有所戒备', example: '别打草惊蛇，我们先暗中观察。', type: '成语谐音' }
    ]
  },
  {
    character: '兔',
    pinyin: 'tù',
    pinyinPlain: 'tu',
    homophoneChars: ['吐', '土', '途', '图', '涂', '秃', '突'],
    puns: [
      { content: '兔（吐）了', explanation: '「兔」和「吐」谐音', example: '看到这个我都兔了。', type: '网络流行梗', hot: true },
      { content: '兔（土）豪', explanation: '「兔」和「土」谐音', example: '你这个兔豪！', type: '谐音梗' },
      { content: '兔（途）', explanation: '「兔」和「途」谐音', example: '前兔似锦！', type: '成语谐音' },
      { content: '兔（图）案', explanation: '「兔」和「图」谐音', example: '这个兔案好可爱。', type: '谐音梗' },
      { content: '守株待兔', explanation: '比喻不主动努力，而存侥幸心理', example: '不要守株待兔，主动出击。', type: '成语谐音' },
      { content: '兔（突）然', explanation: '「兔」和「突」谐音', example: '兔然好想你。', type: '谐音梗' },
      { content: '兔（秃）头', explanation: '「兔」和「秃」谐音', example: '程序员容易兔头。', type: '网络流行梗', hot: true }
    ]
  },
  {
    character: '爱',
    pinyin: 'ài',
    pinyinPlain: 'ai',
    homophoneChars: ['哎', '唉', '矮', '挨', '癌', '艾', '碍'],
    puns: [
      { content: '爱（哎）呀', explanation: '「爱」和「哎」谐音', example: '爱呀妈呀！', type: '谐音梗' },
      { content: '爱（矮）穷矬', explanation: '「爱」和「矮」谐音', example: '我就是爱穷矬，你能怎样？', type: '网络流行梗' },
      { content: '爱（癌）症晚期', explanation: '「爱」和「癌」谐音，调侃深爱', example: '我得了爱你病，已经爱症晚期。', type: '网络流行梗' },
      { content: '爱（碍）事', explanation: '「爱」和「碍」谐音', example: '别在这爱手爱脚的。', type: '谐音梗' },
      { content: '爱不释手', explanation: '喜爱得舍不得放手', example: '这本书太好看了，我爱不释手。', type: '成语谐音' },
      { content: '爱屋及乌', explanation: '比喻爱一个人而连带关心到与他有关的人或物', example: '爱屋及乌，我也喜欢你的猫。', type: '成语谐音' },
      { content: '可爱', explanation: '双关语，既指可以爱，也指令人喜爱的', example: '你好可爱！', type: '双关语', hot: true }
    ]
  },
  {
    character: '小',
    pinyin: 'xiǎo',
    pinyinPlain: 'xiao',
    homophoneChars: ['晓', '笑', '效', '校', '孝', '啸', '肖'],
    puns: [
      { content: '小（晓）得', explanation: '「小」和「晓」谐音，四川话「知道」', example: '我不晓得。', type: '网络流行梗' },
      { content: '小（笑）死我了', explanation: '「小」和「笑」谐音', example: '哈哈哈，小我了！', type: '网络流行梗', hot: true },
      { content: '小（效）率', explanation: '「小」和「效」谐音', example: '你这也太小率了。', type: '谐音梗' },
      { content: '小（孝）顺', explanation: '「小」和「孝」谐音', example: '你可真小顺。', type: '谐音梗' },
      { content: '小心眼', explanation: '形容气量狭小', example: '他这个人就是小心眼。', type: '歇后语' },
      { content: '小家碧玉', explanation: '指小户人家的美貌女子', example: '她长得小家碧玉的。', type: '成语谐音' },
      { content: '小鲜肉', explanation: '网络流行语，指年轻帅气的男生', example: '娱乐圈现在流行小鲜肉。', type: '网络流行梗', hot: true }
    ]
  },
  {
    character: '大',
    pinyin: 'dà',
    pinyinPlain: 'da',
    homophoneChars: ['打', '答', '搭', '达', '哒', '耷'],
    puns: [
      { content: '大（打）卡', explanation: '「大」和「打」谐音', example: '今天来这家网红店大卡。', type: '网络流行梗' },
      { content: '大（答）案', explanation: '「大」和「答」谐音', example: '告诉我大案是什么！', type: '谐音梗' },
      { content: '大（搭）档', explanation: '「大」和「搭」谐音', example: '他们是最佳大档。', type: '谐音梗' },
      { content: '大（达）成', explanation: '「大」和「达」谐音', example: '祝你们项目大成！', type: '谐音梗' },
      { content: '大吉大利', explanation: '非常吉祥、顺利', example: '大吉大利，今晚吃鸡！', type: '网络流行梗', hot: true },
      { content: '大材小用', explanation: '比喻人才使用不当', example: '让他做这个，真是大材小用。', type: '成语谐音' },
      { content: '大显身手', explanation: '充分显示出本领和才能', example: '这次比赛让他大显身手了。', type: '成语谐音' }
    ]
  },
  {
    character: '多',
    pinyin: 'duō',
    pinyinPlain: 'duo',
    homophoneChars: ['哆', '躲', '夺', '朵', '舵', '堕'],
    puns: [
      { content: '多（哆）啦A梦', explanation: '「多」和「哆」谐音', example: '我想要一个多啦A梦。', type: '品牌梗', hot: true },
      { content: '多（躲）猫猫', explanation: '「多」和「躲」谐音', example: '小时候最喜欢玩多猫猫。', type: '谐音梗' },
      { content: '多（夺）冠', explanation: '「多」和「夺」谐音', example: '今年一定要多冠！', type: '谐音梗' },
      { content: '多多益善', explanation: '越多越好', example: '钱嘛，多多益善。', type: '成语谐音' },
      { content: '多愁善感', explanation: '形容人感情脆弱，容易发愁或感伤', example: '她是个多愁善感的人。', type: '成语谐音' },
      { content: '多读点书', explanation: '双关语，既指多读书，也是网络调侃', example: '多读点书，不然被人骗了都不知道。', type: '网络流行梗' }
    ]
  },
  {
    character: '少',
    pinyin: 'shǎo',
    pinyinPlain: 'shao',
    homophoneChars: ['烧', '稍', '绍', '梢', '捎', '勺'],
    puns: [
      { content: '少（烧）饼', explanation: '「少」和「烧」谐音', example: '来两个少饼！', type: '谐音梗' },
      { content: '少（稍）等', explanation: '「少」和「稍」谐音', example: '少等，我马上就好。', type: '谐音梗' },
      { content: '少（绍）兴', explanation: '「少」和「绍」谐音', example: '少兴黄酒很有名。', type: '谐音梗' },
      { content: '少壮不努力，老大徒伤悲', explanation: '年轻力壮时不奋发图强，到了老年悲伤也没用', example: '少壮不努力，老大徒伤悲，好好学习吧。', type: '歇后语' },
      { content: '少年老成', explanation: '年纪虽轻，却很老练', example: '他少年老成，办事很稳。', type: '成语谐音' }
    ]
  },
  {
    character: '上',
    pinyin: 'shàng',
    pinyinPlain: 'shang',
    homophoneChars: ['尚', '上', '裳', '伤'],
    puns: [
      { content: '上（尚）可', explanation: '「上」和「尚」谐音', example: '味道上可。', type: '谐音梗' },
      { content: '上（尚）方宝剑', explanation: '「上」和「尚」谐音', example: '拿着上方宝剑来了。', type: '网络流行梗' },
      { content: '上（伤）心', explanation: '「上」和「伤」谐音', example: '太让人上心了。', type: '双关语' },
      { content: '上班如上坟', explanation: '网络流行语，形容不想上班', example: '周一上班如上坟。', type: '网络流行梗', hot: true },
      { content: '上有政策，下有对策', explanation: '歇后语', example: '上有政策，下有对策，总有办法的。', type: '歇后语' },
      { content: '蒸蒸日上', explanation: '形容事业一天天向上发展', example: '公司业绩蒸蒸日上。', type: '成语谐音' }
    ]
  },
  {
    character: '下',
    pinyin: 'xià',
    pinyinPlain: 'xia',
    homophoneChars: ['夏', '吓', '虾', '瞎', '峡', '暇', '瑕'],
    puns: [
      { content: '下（吓）人', explanation: '「下」和「吓」谐音', example: '你真下人一跳！', type: '双关语' },
      { content: '下（虾）仁', explanation: '「下」和「虾」谐音，「吓人」', example: '你这个下仁！', type: '网络流行梗', hot: true },
      { content: '下（瞎）说', explanation: '「下」和「瞎」谐音', example: '你在下说什么！', type: '谐音梗' },
      { content: '下（夏）天', explanation: '「下」和「夏」谐音', example: '下天来了。', type: '谐音梗' },
      { content: '下班', explanation: '双关语，也是打工人的期盼', example: '下班不积极，思想有问题！', type: '网络流行梗', hot: true },
      { content: '下不为例', explanation: '下次不能再这样', example: '这次就算了，下不为例。', type: '成语谐音' },
      { content: '每况愈下', explanation: '形容情况越来越坏', example: '他的身体每况愈下。', type: '成语谐音' }
    ]
  },
  {
    character: '左',
    pinyin: 'zuǒ',
    pinyinPlain: 'zuo',
    homophoneChars: ['做', '坐', '作', '昨', '佐', '撮'],
    puns: [
      { content: '左（做）饭', explanation: '「左」和「做」谐音', example: '今天你左饭。', type: '谐音梗' },
      { content: '左（坐）标', explanation: '「左」和「坐」谐音', example: '给我发个左标。', type: '谐音梗' },
      { content: '左（作）业', explanation: '「左」和「作」谐音', example: '今天的左业太多了。', type: '谐音梗' },
      { content: '左（昨）天', explanation: '「左」和「昨」谐音', example: '左天的事你忘了？', type: '谐音梗' },
      { content: '左思右想', explanation: '多方面想了又想', example: '我左思右想，还是不去了。', type: '成语谐音' },
      { content: '左右为难', explanation: '形容无论怎样做都有难处', example: '这件事让我左右为难。', type: '成语谐音' }
    ]
  },
  {
    character: '右',
    pinyin: 'yòu',
    pinyinPlain: 'you',
    homophoneChars: ['又', '有', '幼', '诱', '佑', '釉', '鼬'],
    puns: [
      { content: '右（又）来', explanation: '「右」和「又」谐音', example: '你右来了！', type: '谐音梗' },
      { content: '右（有）钱', explanation: '「右」和「有」谐音', example: '你可真右钱！', type: '谐音梗' },
      { content: '右（幼）儿园', explanation: '「右」和「幼」谐音', example: '我右儿园还没毕业呢。', type: '网络流行梗', hot: true },
      { content: '右（诱）惑', explanation: '「右」和「诱」谐音', example: '你在右惑我。', type: '谐音梗' },
      { content: '左右逢源', explanation: '比喻做事得心应手，非常顺利', example: '他在商场左右逢源。', type: '成语谐音' }
    ]
  }
]

export const quickSearchTips = [
  { keyword: '鱼', label: '摸鱼梗' },
  { keyword: '狗', label: '单身狗' },
  { keyword: '鸡', label: '鸡你太美' },
  { keyword: '牛', label: '真牛' },
  { keyword: '猪', label: '干饭梗' },
  { keyword: '钱', label: '搞钱梗' },
  { keyword: '马', label: '码农' },
  { keyword: '香', label: '真香' },
  { keyword: '乐', label: '快乐星球' },
  { keyword: '饭', label: '干饭人' }
]

export const punTypes: PunType[] = ['谐音梗', '双关语', '网络流行梗', '成语谐音', '品牌梗', '歇后语']
