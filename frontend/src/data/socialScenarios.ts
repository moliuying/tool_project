export interface ScenarioQuestion {
  id: string
  text: string
  options: ScenarioOption[]
}

export interface ScenarioOption {
  id: string
  text: string
  isCorrect: boolean
  explanation: string
}

export type RelationshipLevel = 'stranger' | 'acquaintance' | 'colleague' | 'friend' | 'close_friend' | 'family' | 'lover'

export const relationshipLevelInfo: Record<RelationshipLevel, { label: string; color: string; bgColor: string; description: string }> = {
  stranger: { label: '陌生人', color: '#909399', bgColor: '#f4f4f5', description: '初次见面，没有任何交情，说话最客气也最有距离感' },
  acquaintance: { label: '点头之交', color: '#606266', bgColor: '#ecf5ff', description: '见过几次面但不熟，说话比较客套' },
  colleague: { label: '同事关系', color: '#409EFF', bgColor: '#ecf5ff', description: '工作关系，存在上下级或平级的权力差异，说话讲究分寸和场合' },
  friend: { label: '普通朋友', color: '#E6A23C', bgColor: '#fdf6ec', description: '认识有一段时间但没有深交，说话会顾及情面' },
  close_friend: { label: '亲密好友', color: '#E6A23C', bgColor: '#faecd8', description: '关系很铁的朋友，说话比较直接，甚至会互相挖苦' },
  family: { label: '家人亲属', color: '#67C23A', bgColor: '#f0f9eb', description: '有血缘或姻亲关系，说话夹杂着关心、控制和日常摩擦' },
  lover: { label: '伴侣/恋人', color: '#F56C6C', bgColor: '#fef0f0', description: '最亲密的关系，包含爱情、依赖、试探、安全感需求等复杂情感' }
}

export interface CharacterProfile {
  name: string
  role: string
  relationshipWithYou: string
  relationshipLevel: RelationshipLevel
  relationshipTag: string
  personality: string
  background: string
}

export interface ContextDetail {
  time: string
  location: string
  recentHistory: string
  atmosphere: string
}

export interface RelationshipNote {
  title: string
  description: string
  impact: string
}

export interface SocialScenario {
  id: string
  category: 'workplace' | 'family' | 'friend' | 'romance' | 'stranger'
  title: string
  description: string
  background: string
  context: ContextDetail
  relationshipNotes: RelationshipNote[]
  characters: CharacterProfile[]
  dialog: DialogLine[]
  questions: ScenarioQuestion[]
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  learningPoints: string[]
}

export interface DialogLine {
  speaker: string
  role: string
  relationshipLevel?: RelationshipLevel
  relationshipTag?: string
  text: string
  tone?: string
  hint?: string
}

export const categoryInfo = {
  workplace: {
    name: '职场对话',
    icon: 'Briefcase',
    color: '#409EFF',
    description: '同事、领导、客户之间的微妙互动'
  },
  family: {
    name: '家庭互动',
    icon: 'HomeFilled',
    color: '#67C23A',
    description: '父母、伴侣、子女间的情感表达'
  },
  friend: {
    name: '朋友聚会',
    icon: 'UserFilled',
    color: '#E6A23C',
    description: '闺蜜、兄弟、朋友间的默契'
  },
  romance: {
    name: '恋爱关系',
    icon: 'Cpu',
    color: '#F56C6C',
    description: '情侣、暧昧期的情感博弈'
  },
  stranger: {
    name: '社交陌生',
    icon: 'Connection',
    color: '#909399',
    description: '初次见面、商务社交的礼仪'
  }
}

export const difficultyInfo = {
  easy: {
    name: '入门级',
    color: '#67C23A',
    description: '线索明显，大多数人都能察觉到'
  },
  medium: {
    name: '进阶级',
    color: '#E6A23C',
    description: '需要一定的社会经验和细心观察'
  },
  hard: {
    name: '高阶级',
    color: '#F56C6C',
    description: '非常微妙，需要丰富的阅历才能准确把握'
  }
}

export const socialScenarios: SocialScenario[] = [
  {
    id: 'workplace-001',
    category: 'workplace',
    title: '领导的"建议"',
    description: '领导在项目会议后单独找你谈话，看似给建议，实则另有深意',
    background: '你负责的"星辰计划"客户对接项目已经进行了两个月，今天领导在部门例会后单独留你下来，说要和你"聊聊"。',
    context: {
      time: '周三下午6点15分，部门例会刚刚结束，其他人已经陆续下班',
      location: '公司小会议室，门关着，只有你和领导两个人',
      recentHistory: '这个项目近两周来客户满意度有所下降，上周客户方的对接人李总在电话里对你的汇报方式提出过"委婉建议"，说"希望沟通能更高效一些"。老李（即对话中的老李）是公司的老员工，工作了8年，之前负责过这个客户，和客户方的几个关键人物关系很好。最近领导已经安排老李参与了两次项目评审会。',
      atmosphere: '表面上很平静，但你能感觉到一丝压抑。领导没有像往常一样开玩笑，表情比较严肃。'
    },
    relationshipNotes: [
      {
        title: '你 vs 领导',
        description: '上下级关系，直属上级对你有任免权和考核权',
        impact: '领导说话不会直接批评你，因为他需要维护自己"好领导"的形象，也需要你继续干活。但他的"建议"其实就是决定，听不出来就是你自己的问题。'
      },
      {
        title: '你 vs 老李',
        description: '同部门同事，老李资历更深，是你的"前辈"',
        impact: '领导提到老李"经验丰富"，潜台词是你的经验不够。老李之前负责过这个客户，他的出现意味着领导可能在考虑换人。'
      }
    ],
    characters: [
      {
        name: '领导（王总监）',
        role: '部门总监，你的直属上级',
        relationshipWithYou: '共事3年，平时对你不错，但他是典型的"话不说透"型领导，喜欢让下属自己悟。去年有个同事就是因为"听不懂话"被边缘化了。',
        relationshipLevel: 'colleague',
        relationshipTag: '直属上级',
        personality: '处事圆滑、善于权谋，从不直接批评人，但他的"建议"几乎就是决定。',
        background: '他最近在竞争副总职位，客户满意度是关键考核指标，他绝对不能在这个时候出问题。'
      },
      {
        name: '你（小王）',
        role: '项目负责人，入职3年',
        relationshipWithYou: '本人视角',
        relationshipLevel: 'colleague',
        relationshipTag: '本人',
        personality: '做事认真负责，但有时候对人际关系的敏感度不够。',
        background: '你是靠技术能力上来的项目负责人，客户对接经验相对较少，之前一直在做执行层面的工作。'
      },
      {
        name: '老李',
        role: '资深客户经理，入职8年',
        relationshipWithYou: '同事，没有直接竞争关系，但他的资历比你老很多。',
        relationshipLevel: 'colleague',
        relationshipTag: '资深前辈',
        personality: '老油条，善于搞人际关系，和客户称兄道弟。',
        background: '他之前就是这个客户的对接人，后来因为要带新人（也就是你）才转做幕后。客户那边的很多人都是他的老关系。'
      }
    ],
    dialog: [
      { speaker: '领导', role: '部门总监', relationshipLevel: 'colleague', relationshipTag: '直属上级', text: '小王啊，这个项目进展得还不错，你辛苦了。', tone: '面带微笑，语气平和，但没有像往常一样拍你的肩膀' },
      { speaker: '你', role: '项目负责人', relationshipLevel: 'colleague', relationshipTag: '本人', text: '谢谢领导，都是团队的功劳。', tone: '礼貌回应，但心里已经有些打鼓' },
      { speaker: '领导', role: '部门总监', relationshipLevel: 'colleague', relationshipTag: '直属上级', text: '嗯，不过呢，我最近和客户那边聊了一下，他们反馈说沟通起来还是稍微有点"不顺畅"。', tone: '语气略微加重了"不顺畅"三个字，用手指轻轻敲了一下桌面' },
      { speaker: '你', role: '项目负责人', relationshipLevel: 'colleague', relationshipTag: '本人', text: '啊？可能是我最近太忙，沟通不够及时，我马上改进。', tone: '有些紧张，身体微微前倾' },
      { speaker: '领导', role: '部门总监', relationshipLevel: 'colleague', relationshipTag: '直属上级', text: '哎呀你也别太紧张，我不是在批评你。我个人建议啊，下次客户沟通的时候，让老李也一起参加吧，他经验丰富一些。', tone: '摆手，语气变得很轻松，像在说一件无关紧要的小事' }
    ],
    questions: [
      {
        id: 'q1',
        text: '领导说"让老李也一起参加吧，他经验丰富一些"，最想表达的真实意思是？',
        options: [
          { id: 'a', text: '领导真心觉得你一个人忙不过来，想给你找个帮手', isCorrect: false, explanation: '如果真想帮你，领导会直接说派老李协助你，而不是用"我个人建议"这种委婉说法。而且结合之前已经安排老李参加评审会的背景，这明显是有计划的安排。' },
          { id: 'b', text: '领导对你目前的客户沟通不太满意，想让老李逐渐接管客户对接', isCorrect: true, explanation: '结合完整背景：客户满意度下降、客户方已经提过意见、老李之前就是这个客户的对接人、领导最近在竞争副总不能出问题、领导已经安排老李参与评审会——这一系列线索都指向：领导对你不满意，并且已经在布局让老李接手。用"我个人建议"只是给你台阶下。' },
          { id: 'c', text: '领导想让老李多学习一下你的项目经验', isCorrect: false, explanation: '领导说的是老李"经验丰富一些"，而不是让老李来学习，而且老李在这个客户上的经验比你丰富得多，这个选项与背景完全矛盾。' },
          { id: 'd', text: '领导想测试你是否有团队合作精神', isCorrect: false, explanation: '领导在竞争副总的关键时期，没有闲心做这种测试，他要的是结果。' }
        ]
      },
      {
        id: 'q2',
        text: '领导说"我不是在批评你"，这句话的潜台词最可能是？',
        options: [
          { id: 'a', text: '真的不是批评，只是随口说说', isCorrect: false, explanation: '如果真的不是批评，领导不会特别强调这句话。结合领导"话不说透"的性格，这句话更有深意。' },
          { id: 'b', text: '接下来要说的话比批评更严重', isCorrect: false, explanation: '虽然是在表达不满，但未必更严重，更多是为了让你更容易接受。领导的目的是让你"识趣"，而不是吓唬你。' },
          { id: 'c', text: '其实就是在批评你，但用更委婉的方式说出来', isCorrect: true, explanation: '"我不是在批评你"是典型的"铺垫语"，后面跟着的通常就是批评或不满，只是为了降低你的防御心理。结合这个领导"话不说透"的性格特点，这句话的真实含义就是"我在批评你，但我不想明说，你自己要明白"。' },
          { id: 'd', text: '领导担心你会生气，所以先安抚一下', isCorrect: false, explanation: '安抚只是表面效果，核心目的还是让你接受接下来的安排。以领导的身份，他不需要担心下属会不会生气。' }
        ]
      }
    ],
    difficulty: 'medium',
    tags: ['向上管理', '客户沟通', '读懂领导'],
    learningPoints: [
      '当领导用"我个人建议"开头时，通常不是建议而是决定',
      '"我不是在批评你" = 接下来我要批评你了，请做好心理准备',
      '客户反馈"沟通不顺畅"往往是客户对你不满意的委婉说法',
      '出现这种信号时，应该主动反思并提出改进方案，而不是被动等待',
      '读懂领导的关键：结合他的性格、当前处境、以及最近发生的相关事件综合判断'
    ]
  },
  {
    id: 'workplace-002',
    category: 'workplace',
    title: '同事的"小请求"',
    description: '同事总是在下班前找你帮忙，这次他又来"麻烦你一下"',
    background: '周五下午5点45分，你正在收拾东西准备下班，和你关系还不错的同事小张走了过来。今晚你约了很久没见的女朋友吃纪念日晚餐，餐厅已经订好了，迟到的话很麻烦。',
    context: {
      time: '周五下午5点45分，距离下班还有15分钟，办公室已经走了一半人',
      location: '你的工位旁，同事们都在收拾东西准备过周末',
      recentHistory: '这已经是小张这个月第四次在下班前找你帮忙了。上周一他让你帮他做PPT，你加班到9点，结果第二天他说"那个方案不用了"；上周三他让你帮他整理数据，你又晚走了一个半小时；更让你不舒服的是，你发现他每次找你帮忙时，自己的电脑上都开着游戏界面。小张这个人平时和你关系还行，中午经常一起吃饭，但你也知道他在部门里出了名的"会做人"，嘴甜但活儿不怎么干。',
      atmosphere: '周五的轻松氛围，但你心里隐隐有些不安——小张每次这个表情出现，你都要倒霉。'
    },
    relationshipNotes: [
      {
        title: '你 vs 小张',
        description: '同级同事，表面关系不错，经常一起吃午饭，但小张实际是领导的远房亲戚',
        impact: '小张利用你们"关系不错"的表面情谊反复找你帮忙，他吃准了你"老好人"不好意思拒绝的性格。同时他有领导这层靠山，你就算拒绝了也怕他在领导面前说你坏话。'
      },
      {
        title: '小张 vs 领导',
        description: '远房亲戚关系，部门里人尽皆知但没人明说',
        impact: '小张仗着这层关系干活敷衍、推活儿给别人，就算被发现领导也不会深究。你如果和小张闹僵，领导那边可能也会对你有看法。'
      },
      {
        title: '你 vs 女朋友',
        description: '恋爱关系，今晚是纪念日晚餐',
        impact: '小张的请求让你陷入两难——一边是关系到职场人际的同事请求，一边是已经爽约可能引发感情矛盾的约会。这种两难正是小张"欲擒故纵"策略能生效的原因。'
      }
    ],
    characters: [
      {
        name: '小张',
        role: '同事，和你同级别，入职比你晚半年',
        relationshipWithYou: '表面上关系不错，经常一起吃午饭、聊天，但你内心深处觉得他有点"油"。',
        relationshipLevel: 'colleague',
        relationshipTag: '表面交好的同事',
        personality: '嘴巴特别甜，擅长示弱和道德绑架，典型的"会哭的孩子有奶吃"型。遇到困难第一反应不是自己解决，而是找别人帮忙。',
        background: '他是部门领导的远房亲戚，虽然没人明说，但大家都知道。所以他就算活儿干得不好，领导也不太说他。他摸清了这个规律，越来越"放飞自我"。'
      },
      {
        name: '你',
        role: '员工，入职2年',
        relationshipWithYou: '本人视角',
        relationshipLevel: 'colleague',
        relationshipTag: '本人',
        personality: '典型的"老好人"，不太好意思拒绝别人，尤其是对方态度很好的时候。但最近你也在反思，觉得自己的边界感太差了。',
        background: '你平时工作认真，活儿干得又快又好，这也是小张总找你帮忙的原因——你帮他做的东西，质量比他自己做的高多了。'
      }
    ],
    dialog: [
      { speaker: '小张', role: '同事', relationshipLevel: 'colleague', relationshipTag: '表面交好的同事', text: '嘿，还没走吧？', tone: '笑着走过来，很自然地拍了拍你的肩膀，就像你们关系特别铁一样' },
      { speaker: '你', role: '员工', relationshipLevel: 'colleague', relationshipTag: '本人', text: '正准备走呢，怎么了？', tone: '有些警觉，手里收拾东西的动作放慢了' },
      { speaker: '小张', role: '同事', relationshipLevel: 'colleague', relationshipTag: '表面交好的同事', text: '哎呀，真不好意思又麻烦你。你看这个报表，我怎么都弄不对，明天早上领导就要用了，你能不能帮我看看？就"几分钟"的事。', tone: '双手合十，做出拜托的手势，特别强调了"几分钟"，表情看起来特别无辜和可怜' },
      { speaker: '你', role: '员工', relationshipLevel: 'colleague', relationshipTag: '本人', text: '嗯……我今晚还有点事。', tone: '犹豫，你看了看表，又想起了女朋友，不太想帮但又不知道怎么说' },
      { speaker: '小张', role: '同事', relationshipLevel: 'colleague', relationshipTag: '表面交好的同事', text: '没事没事，不方便就算了！我再想想办法，实在不行我就加会儿班。你快回去吧，别耽误你的事。', tone: '立刻摆手，表情有些失落，但语气特别"理解人"，说完就转身准备走，好像真的准备自己解决' }
    ],
    questions: [
      {
        id: 'q1',
        text: '小张最后说"没事没事，不方便就算了……你快回去吧"，他的真实心理状态是？',
        options: [
          { id: 'a', text: '真的理解你，决定自己解决', isCorrect: false, explanation: '结合之前的背景：小张这个月已经找你帮了三次忙，他每次都是这样的套路，而且他平时干活就喜欢推给别人。如果真理解，就不会在你下班前跑来求助，还特别强调"几分钟"。' },
          { id: 'b', text: '使用"欲擒故纵"的策略，通过表现得很懂事来让你感到愧疚，从而改变主意帮他', isCorrect: true, explanation: '这是典型的"以退为进"策略——先表现得很大度、很理解你，让你产生"他都这么说了我不帮好像不太好"的愧疚感，从而主动提出帮忙。小张这种人对人性拿捏得很准，他知道直接请求容易被拒绝，但"我不麻烦你了"反而会让对方过意不去。再加上你们平时关系还不错，你更难拒绝了。' },
          { id: 'c', text: '他真的打算自己加班搞定', isCorrect: false, explanation: '小张平时就是个喜欢推活儿的人，而且他是领导的远房亲戚，就算做不完也不会真的被怎么样，他没必要自己加班。如果打算自己搞定，就不会一开始就来找你了。' },
          { id: 'd', text: '他在威胁你，暗示你不帮忙他就会记恨你', isCorrect: false, explanation: '小张的策略更温和，是利用人情和愧疚感，而不是威胁。威胁太low了，他这种"会做人"的人不会用这么低级的手段。' }
        ]
      },
      {
        id: 'q2',
        text: '小张特别强调"就几分钟的事"，这个说法的主要目的是什么？',
        options: [
          { id: 'a', text: '如实说明工作量，让你有个预期', isCorrect: false, explanation: '这个报表小张自己都"怎么都弄不对"，说明肯定不是几分钟能搞定的。结合他之前让你帮忙做PPT做到9点的历史，他对工作量的描述完全不可信。' },
          { id: 'b', text: '降低你的心理门槛，让你更容易答应帮忙', isCorrect: true, explanation: '"就几分钟"是典型的"门槛技巧"，先把工作量说得很小，让你觉得"反正就几分钟帮一下吧"，等你答应了坐下来开始做，他才会告诉你这个报表有多少隐藏的工作，到时候你不好意思做到一半走，只能帮到底。小张已经用这个套路让你帮了三次忙了。' },
          { id: 'c', text: '他自己也不清楚具体需要多久', isCorrect: false, explanation: '他的主要目的是说服你帮忙，而不是陈述事实。他很清楚这个工作量，但他不会如实告诉你。' },
          { id: 'd', text: '想让你觉得这个任务很简单，体现他能力差', isCorrect: false, explanation: '没有人会主动在同事面前体现自己能力差。他只是想让你产生"这个事儿很简单，帮了也没什么大不了"的想法。' }
        ]
      }
    ],
    difficulty: 'easy',
    tags: ['职场人际', '拒绝的艺术', '边界感'],
    learningPoints: [
      '"就几分钟的事"几乎永远不止几分钟，这是降低拒绝意愿的话术',
      '欲擒故纵：先表现大度理解，让对方产生愧疚感，是常见的操控策略',
      '学会温柔而坚定地拒绝，是职场必备技能',
      '反复在下班前找你帮忙的人，本质上是在把自己的工作转嫁给你',
      '判断对方是否真诚，要看他一贯的行为模式，而不是当下说的话'
    ]
  },
  {
    id: 'family-001',
    category: 'family',
    title: '妈妈的"关心"',
    description: '周末回家吃饭，妈妈又开始了她的"日常关心"',
    background: '你已经30岁了，单身，在外地工作。好不容易周末回家，妈妈做了一大桌你爱吃的菜。你前两次回家都因为催婚的事和妈妈闹了点不愉快，这次你特意想开开心心的。',
    context: {
      time: '周六中午12点半，你刚到家，妈妈已经把菜做好了',
      location: '家里的餐桌旁，爸爸不在家，去楼下下棋了',
      recentHistory: '三个月前的春节，你妈给你安排了3场相亲，你一场都没去，你妈气哭了，说"白养你了"。之后你们冷战了两周。上个月你回家，你妈又提了一次，你没忍住和她吵了几句，摔门走了。你后来挺后悔的，所以这次回来特意买了她喜欢的护肤品。你妈这两周和楼下的王阿姨走得特别近，王阿姨的侄子据说条件不错，你妈在你面前提过两次"银行工作稳定"。',
      atmosphere: '餐桌上摆着你最爱吃的红烧肉、糖醋排骨、番茄炒蛋，妈妈看起来很开心，但你总觉得她在"酝酿"什么。'
    },
    relationshipNotes: [
      {
        title: '你 vs 妈妈',
        description: '亲生母女/子关系，妈妈非常爱你但表达方式令人窒息，前两次回家都因为催婚闹过不愉快',
        impact: '妈妈知道直接催婚会引起你的抵触，所以这次改变了策略——先用好吃的和关心铺垫，降低你的防备心，再"不经意"地提出相亲。你也因为前两次吵架有愧疚感，这次更难直接拒绝。'
      },
      {
        title: '妈妈 vs 王阿姨',
        description: '邻居闺蜜，王阿姨有个待介绍的侄子',
        impact: '王阿姨的存在给了妈妈"有人帮忙张罗"的底气，也让妈妈有了面子——"不是我女儿没人要，是别人主动找上门的"。妈妈和王阿姨的频繁来往，说明她一直在为你的婚事"布局"。'
      },
      {
        title: '妈妈 vs 小区其他老太太',
        description: '同龄人的攀比关系，其他人大多已经抱孙子了',
        impact: '妈妈催婚不完全是为了你，也有她自己的面子压力——小区里和她同龄的人都在晒孙子孙女，她觉得自己"抬不起头"。这种焦虑让她在催婚这件事上格外执着。'
      }
    ],
    characters: [
      {
        name: '妈妈',
        role: '母亲，58岁，退休教师',
        relationshipWithYou: '你的亲生母亲，很爱你，但表达方式有时让人窒息。',
        relationshipLevel: 'family',
        relationshipTag: '亲生母亲',
        personality: '典型的中国式母亲，把所有希望都寄托在孩子身上。好面子，小区里和她同龄的老太太们大多已经抱孙子了，她压力很大。嘴上不说，但很在意别人的眼光。',
        background: '她年轻的时候条件很好，下嫁给你爸爸，一辈子没享过什么福，所以她最大的心愿就是你能"过得好"——在她的定义里，"过得好"= 有稳定工作 + 结婚 + 生孩子。她觉得30岁不结婚是"不正常"的，会被别人笑话。'
      },
      {
        name: '你',
        role: '女儿/儿子，30岁',
        relationshipWithYou: '本人视角',
        relationshipLevel: 'family',
        relationshipTag: '本人',
        personality: '有自己的想法，不想为了结婚而结婚，但也不想让妈妈太伤心。',
        background: '你在一线城市工作，事业刚有起色，你觉得30岁正是打拼的时候。你不是不婚主义，只是还没遇到合适的人。你很孝顺，每次回家都会给爸妈买东西，但一涉及催婚话题就容易控制不住情绪。'
      },
      {
        name: '王阿姨',
        role: '楼下邻居，你妈的好朋友',
        relationshipWithYou: '长辈，关系普通',
        relationshipLevel: 'acquaintance',
        relationshipTag: '邻居阿姨',
        personality: '热心肠但爱八卦，特别喜欢给人介绍对象。',
        background: '她有个侄子，32岁，在银行当客户经理，据说有房有车，就是性格有点木讷，一直没找到合适的。王阿姨已经催你妈好几次了，说"这么好的条件别错过了"。'
      }
    ],
    dialog: [
      { speaker: '妈妈', role: '母亲', relationshipLevel: 'family', relationshipTag: '亲生母亲', text: '来，多吃点，你看你瘦的。', tone: '不停往你碗里夹菜，眼神里满是心疼' },
      { speaker: '你', role: '女儿/儿子', relationshipLevel: 'family', relationshipTag: '本人', text: '妈我不瘦，我现在过得挺好的。', tone: '有些无奈，但尽量让自己的语气平和' },
      { speaker: '妈妈', role: '母亲', relationshipLevel: 'family', relationshipTag: '亲生母亲', text: '好什么呀，一个人在外面，连个做饭的人都没有。', tone: '叹了口气，放下筷子，表情变得有些惆怅' },
      { speaker: '你', role: '女儿/儿子', relationshipLevel: 'family', relationshipTag: '本人', text: '我自己会做饭……', tone: '试图辩解，心里已经有点紧张了，怕她又开始催' },
      { speaker: '妈妈', role: '母亲', relationshipLevel: 'family', relationshipTag: '亲生母亲', text: '哎呀不说这个了。对了，楼下王阿姨她侄子，和你同岁，在银行上班，人特别稳重，你要不要……认识一下？', tone: '装作随口一提的样子，但眼神一直在观察你的反应，筷子都停了下来' }
    ],
    questions: [
      {
        id: 'q1',
        text: '妈妈说"哎呀不说这个了"然后马上介绍相亲对象，她最可能的真实想法是？',
        options: [
          { id: 'a', text: '她真的不想说了，只是突然想到了王阿姨的侄子', isCorrect: false, explanation: '结合背景：你妈这两周和王阿姨走得特别近，已经在你面前提过两次"银行工作稳定"，而且你前两次回家都因为催婚闹得不愉快——这显然是你妈精心设计的"话术流程"，不是突然想到的。' },
          { id: 'b', text: '先用关心铺垫，再用"不说了"降低你的防备心，然后自然地提出相亲', isCorrect: true, explanation: '这是父母催婚的经典话术流程：先关心你的生活（"你看你瘦的""连个做饭的都没有"）→ 让你放松（"哎呀不说这个了"）→ 假装转移话题 → 顺势提出相亲要求，这样你不容易直接拒绝。你妈上次直接催婚失败了，这次她"总结经验"，用了更委婉的方式。从她"眼神一直在观察你的反应"也能看出来，她是有备而来的。' },
          { id: 'c', text: '她自己也觉得催婚不好，有点不好意思', isCorrect: false, explanation: '虽然可能有点不好意思，但"不说这个了"主要是策略，而不是真心觉得不好。如果真觉得不好，她就不会马上接着提相亲了。' },
          { id: 'd', text: '她忘了自己刚才在说什么', isCorrect: false, explanation: '显然是有备而来的，从她提过两次"银行工作稳定"就能看出来，她已经铺垫很久了。' }
        ]
      },
      {
        id: 'q2',
        text: '妈妈在说"人特别稳重，你要不要……认识一下？"时观察你的反应，她最想通过你的表情判断什么？',
        options: [
          { id: 'a', text: '你是不是饿了', isCorrect: false, explanation: '与吃饭无关，她已经把话题从吃饭转到相亲了。' },
          { id: 'b', text: '你对这个相亲对象是否感兴趣，以及你对催婚这件事的抵触程度', isCorrect: true, explanation: '结合之前两次催婚都闹僵的背景，你妈这次学"聪明"了——她不再硬推，而是先"投石问路"，通过观察你的微表情来判断：如果你皱眉头、语气变冲，说明你现在情绪不好，她可能会暂时退缩；如果你只是犹豫、没有明显的抵触情绪，她就会继续加码，比如"人家条件真的很好""就当认识个朋友嘛"。父母在提出敏感话题时，都是很会"读空气"的。' },
          { id: 'c', text: '你是不是在公司受了委屈', isCorrect: false, explanation: '与当前话题无关。' },
          { id: 'd', text: '你是不是缺钱花', isCorrect: false, explanation: '与当前话题无关。' }
        ]
      }
    ],
    difficulty: 'easy',
    tags: ['亲子沟通', '催婚应对', '情绪识别'],
    learningPoints: [
      '"不说这个了" ≠ 真的不说了，通常是要"说更重要的那个"的铺垫',
      '父母催婚的本质往往不是真的急着让你结婚，而是担心你一个人过得不好，同时也有来自亲戚朋友的面子压力',
      '观察说话人的微表情和肢体语言，比听表面内容更重要',
      '面对催婚，可以先共情"我知道妈妈是为我好"再表达自己的想法，沟通效果会更好',
      '理解父母的动机（爱+面子压力），比单纯反驳他们的要求更重要'
    ]
  },
  {
    id: 'romance-001',
    category: 'romance',
    title: '"没事，你忙吧"',
    description: '约会前你因为工作要爽约，对方的回复让人捉摸不透',
    background: '你和女朋友恋爱一年多，今天本来约好一起吃她期待了很久的一家网红餐厅。下午五点，老板突然通知你要临时加班赶方案。这家餐厅是她两周前就订好位的，上周你们因为你加班爽约过一次，当时她就有点不高兴，但没说什么。',
    context: {
      time: '周五下午5点，距离约定的见面时间还有1个半小时',
      location: '你还在公司，女朋友已经在家化妆准备了',
      recentHistory: '上周你们本来约好去看她想看的电影，结果你临时加班又没去成，她当时沉默了很久，最后说"没事，工作重要"。但你后来发现她那天晚上在闺蜜群里说"好像我永远都排在最后一位"。你因为这件事愧疚了好几天，特意提前两周订了这家她种草很久的餐厅想补偿她。她今天下午还特意问你"今天不会又加班吧"，你当时很肯定地说"不会"。',
      atmosphere: '公司里只剩下你和几个同事，你拿着手机，心里很忐忑，不知道该怎么跟她说。'
    },
    relationshipNotes: [
      {
        title: '你 vs 女朋友（小雯）',
        description: '恋爱一年多的情侣，感情基础不错，但近期你频繁加班导致她有情绪积压',
        impact: '她是"回避型生气"性格，不会直接表达不满，而是用"没事"等反话和冷淡来回应。这已经是你连续两周爽约，她的情绪不是突然产生的，而是累积的结果。'
      },
      {
        title: '小雯 vs 她的童年',
        description: '她小时候父母经常吵架，导致她害怕冲突',
        impact: '她之所以不说"我生气了"而是说"没事"，不是因为她大度，而是因为她潜意识里害怕直接表达不满会引发争吵，重蹈父母的覆辙。她选择用冷淡和疏离来保护自己。'
      },
      {
        title: '你 vs 工作',
        description: '你是程序员，项目上线期间加班频繁',
        impact: '你对工作的投入客观上挤压了陪伴女朋友的时间，但你"直男思维"让你误以为她说"没事"就真的没事，没有及时感知到她的情绪变化，导致矛盾升级。'
      }
    ],
    characters: [
      {
        name: '女朋友（小雯）',
        role: '女朋友，26岁，设计师',
        relationshipWithYou: '恋爱一年多，感情一直不错，但最近因为你频繁加班，她有些情绪。',
        relationshipLevel: 'lover',
        relationshipTag: '女朋友',
        personality: '典型的"回避型"生气，不会直接说"我生气了"，而是用"没事""没关系"来表达不满。喜欢用"反话"，她越说没事，其实越有事。',
        background: '她小时候父母经常吵架，所以她特别害怕冲突，遇到不开心的事不会直接表达，而是压抑在心里，用冷淡的方式让对方"猜"。她之前有个前男友就是因为"永远猜不到她在想什么"分手的。'
      },
      {
        name: '你',
        role: '男朋友，28岁，程序员',
        relationshipWithYou: '本人视角',
        relationshipLevel: 'lover',
        relationshipTag: '本人',
        personality: '典型的"直男思维"，女朋友说"没事"你就真的以为没事，经常因此踩雷。但你很爱她，不是故意忽略她的感受。',
        background: '你最近项目上线，确实很忙，经常加班。你也想多陪陪她，但有时候身不由己。'
      }
    ],
    dialog: [
      { speaker: '你', role: '男朋友', relationshipLevel: 'lover', relationshipTag: '本人', text: '亲爱的，对不起……老板突然让我加班，今晚的约会可能要取消了。', tone: '愧疚，声音很小' },
      { speaker: '女朋友', role: '女朋友', relationshipLevel: 'lover', relationshipTag: '女朋友', text: '哦。', tone: '语气很平淡，停顿了两秒，没有任何情绪起伏' },
      { speaker: '你', role: '男朋友', relationshipLevel: 'lover', relationshipTag: '本人', text: '明天，明天我一定陪你去，好吗？', tone: '急切，想弥补' },
      { speaker: '女朋友', role: '女朋友', relationshipLevel: 'lover', relationshipTag: '女朋友', text: '没事，你忙吧。工作重要。', tone: '声音很轻，没有情绪起伏，甚至连语调都没有变' },
      { speaker: '你', role: '男朋友', relationshipLevel: 'lover', relationshipTag: '本人', text: '你……是不是生气了？', tone: '小心翼翼，你感觉有点不对，但又不确定' },
      { speaker: '女朋友', role: '女朋友', relationshipLevel: 'lover', relationshipTag: '女朋友', text: '我生什么气啊，都说了没事。你专心加班吧，我挂了。', tone: '语速略快，说完就挂断了电话，没有给你说话的机会' }
    ],
    questions: [
      {
        id: 'q1',
        text: '女朋友说"没事，你忙吧"，她最真实的情绪状态是？',
        options: [
          { id: 'a', text: '真的没事，她很理解你的工作', isCorrect: false, explanation: '结合背景：这已经是你连续两周爽约了，上周爽约她就已经有情绪（在闺蜜群说"好像我永远都排在最后一位"），而且今天她还特意确认过你会不会加班。如果真的没事，她不会用"哦"开场（这个"哦"是典型的冷淡回应），也不会语速略快地挂电话。' },
          { id: 'b', text: '她确实没生气，但有点小失望', isCorrect: false, explanation: '不只是小失望。"没事+挂电话"的组合是典型的生气信号，而且是"我不想和你说话了"的程度。结合她"回避型生气"的性格，她越说没事，越说明问题严重。' },
          { id: 'c', text: '她非常生气，说的是反话，"没事"="有事，而且很严重"', isCorrect: true, explanation: '在亲密关系中，尤其是对于"回避型生气"的人来说，"没事"几乎等于"有事，而且我已经不想和你说话了"。配合"哦"的冷淡开场（正常的回应应该是"啊？又加班？"或者"那怎么办啊"）、语速加快、主动挂电话等信号，说明她已经非常不满了。她不是不生气，而是不想和你吵架，选择用冷淡的方式表达抗议。' },
          { id: 'd', text: '她在担心你加班太辛苦', isCorrect: false, explanation: '如果是担心，她会多问几句工作的事，比如"要加到几点""吃饭了吗"，而不是急着挂电话。' }
        ]
      },
      {
        id: 'q2',
        text: '面对这种情况，你最不应该做的是？',
        options: [
          { id: 'a', text: '加班结束后立刻给她打电话道歉', isCorrect: false, explanation: '这是正确的做法，不管多晚都要打，哪怕她不接，也要让她知道你在乎她。' },
          { id: 'b', text: '既然她说没事，那就真的专心加班，等她自己消气', isCorrect: true, explanation: '这是最危险的做法！她说"没事"不代表真的没事，如果你真的不理她，等她自己消气，往往只会让事情变得更严重。对于"回避型生气"的人来说，你的"不回应"会被她解读为"你果然不在乎我"，她会在心里默默给你扣分，攒到一定程度就会爆发。正确的做法是：即使她不回消息，也要持续表达你的歉意和在乎，让她感受到你的诚意。' },
          { id: 'c', text: '加班间隙给她发消息，表达你也很遗憾，并且承诺补偿', isCorrect: false, explanation: '这是很好的做法，让她感受到你在乎她的感受，而不是把加班当借口。比如可以说"我现在满脑子都是对不起你，等我忙完一定好好补偿你"。' },
          { id: 'd', text: '如果可能，和老板商量换个时间加班，或者把工作带回家做一部分', isCorrect: false, explanation: '如果能做到，这是最能体现重视对方的方式。行动比语言更有说服力。' }
        ]
      }
    ],
    difficulty: 'easy',
    tags: ['亲密关系', '反话识别', '情绪管理'],
    learningPoints: [
      '亲密关系中的"没事" = "有事，而且很严重，你最好马上想办法哄我"',
      '冷淡的"哦"字是强烈不满的信号，不要当作正常的回应',
      '对方主动挂电话 = 情绪已经到了临界点，需要立即处理',
      '处理伴侣情绪的正确顺序：先安抚情绪 → 再解释原因 → 最后给出补偿方案',
      '"回避型生气"的人不会直接表达不满，需要你更加主动地去感知和回应'
    ]
  },
  {
    id: 'friend-001',
    category: 'friend',
    title: '"我真羡慕你"',
    description: '朋友聚会时，有人看似夸赞你，但听起来总觉得哪里不对',
    background: '大学毕业5周年同学聚会，你刚升职加薪当上部门经理，还交了个各方面条件都不错的女朋友。大家聊着各自的近况，你的事情被一个同学提到了。',
    context: {
      time: '周六晚上7点，聚会进行到一半，大家都喝了点酒',
      location: '市区一家还不错的酒店包间，一共来了20多个同学',
      recentHistory: '你和小李是大学室友，住了4年，关系曾经很好。但毕业后你们联系越来越少，主要是因为发展差距越来越大——你一路顺风顺水，进了大公司，升职加薪也很快；而小李毕业后换了好几份工作，现在在一家小公司做普通职员，收入只有你的三分之一。去年同学聚会，你好心说"需要帮忙随时找我"，结果他后来跟别人说"他那是在我面前显摆"。你听了之后有些伤心，之后就很少主动联系他了。今天他刚进来的时候，你主动打招呼，他只是"嗯"了一声，表情不太自然。',
      atmosphere: '整体很热闹，大家都在叙旧，但你能感觉到小李一直在偷偷观察你，眼神有些复杂。'
    },
    relationshipNotes: [
      {
        title: '你 vs 小李',
        description: '曾经的大学室友，四年同窗关系很好，但毕业后因为发展差距悬殊逐渐疏远，他对你心存嫉妒',
        impact: '小李表面上跟你叙旧，实际上一直在找机会酸你。你的任何成功在他看来都是对他的刺激，所以他会用自贬和反讽的方式来拉平你们之间的差距。'
      },
      {
        title: '小李 vs 他的自尊心',
        description: '他自尊心极强但能力和家境都一般，无法接受自己不如别人的现实',
        impact: '他的酸言酸语不是针对你个人，而是他内心失衡的投射。他需要通过贬低你的"好运"来维护自己脆弱的自尊，否则他会觉得自己的人生很失败。'
      },
      {
        title: '你 vs 其他同学',
        description: '多年未见的老同学，大家都在暗中比较各自的发展',
        impact: '同学聚会本身就是一个"社交竞技场"，小李的话也是说给其他人听的——他想让在场的人觉得你"飘了""装了"，从而在社交层面上削弱你的优势。'
      }
    ],
    characters: [
      {
        name: '小李',
        role: '大学室友，现在是普通朋友',
        relationshipWithYou: '曾经是很好的朋友，但毕业后因为发展差距产生了隔阂。',
        relationshipLevel: 'friend',
        relationshipTag: '大学室友（渐疏远）',
        personality: '自尊心很强，比较敏感，容易觉得别人"看不起他"。能力一般，但又不太能接受自己不如别人的现实。',
        background: '他大学时就是那种"嘴上说着无所谓，其实心里很在意"的人。当年你拿奖学金，他嘴上说"厉害厉害"，但转头就跟别人说"不就是死读书嘛"。他家境一般，父母都是工人，所以他对"成功"的渴望比其他人更强烈，但又不愿意承认自己的不足。'
      },
      {
        name: '你（老王）',
        role: '部门经理，28岁',
        relationshipWithYou: '本人视角',
        relationshipLevel: 'friend',
        relationshipTag: '本人',
        personality: '性格比较随和，不太喜欢张扬，但有时候会无意中"炫耀"而不自知。',
        background: '你家境还不错，父母都是老师，从小没缺过什么，所以对"物质差距"没那么敏感。你一直把小李当朋友，真心希望他也能过得好，但你也能感觉到他对你有些疏远。'
      },
      {
        name: '同学A',
        role: '大学同学，和你关系一般',
        relationshipWithYou: '普通同学',
        relationshipLevel: 'acquaintance',
        relationshipTag: '普通同学',
        personality: '性格外向，喜欢热闹，说话不过脑子。',
        background: '他就是那种典型的"哪壶不开提哪壶"的人，不是故意的，但说话经常让别人尴尬。'
      }
    ],
    dialog: [
      { speaker: '同学A', role: '老同学', relationshipLevel: 'acquaintance', relationshipTag: '普通同学', text: '哎，你们知道吗？老王现在可厉害了，刚刚升了部门经理！', tone: '兴奋地说，声音很大，整个桌子的人都听见了' },
      { speaker: '你', role: '老王', relationshipLevel: 'friend', relationshipTag: '本人', text: '哈哈运气好运气好。', tone: '谦虚地笑了笑，下意识地看了小李一眼' },
      { speaker: '小李', role: '大学室友', relationshipLevel: 'friend', relationshipTag: '大学室友（渐疏远）', text: '运气？别谦虚了。我真羡慕你啊，什么好事都让你赶上了。不像我，还是在那个破公司混日子，连个正经女朋友都没有。', tone: '举起酒杯，但嘴角没有笑意，说完仰头一口干了，酒洒出来一些都没在意' },
      { speaker: '你', role: '老王', relationshipLevel: 'friend', relationshipTag: '本人', text: '你也挺好的啊，别这么说。', tone: '有些尴尬，不知道该怎么接话' },
      { speaker: '小李', role: '大学室友', relationshipLevel: 'friend', relationshipTag: '大学室友（渐疏远）', text: '好什么呀，人跟人不能比嘛。来，喝酒喝酒，别耽误人家"成功人士"聊天。', tone: '笑着说，但"成功人士"四个字咬字格外重，说完扫了一圈桌上的人，好像在寻求认同' }
    ],
    questions: [
      {
        id: 'q1',
        text: '小李说"我真羡慕你啊"，他最真实的情感是？',
        options: [
          { id: 'a', text: '真心为你感到高兴和羡慕', isCorrect: false, explanation: '结合背景：你去年好心说帮忙，他却跟别人说你"显摆"；今天你打招呼他只是"嗯"了一声；他说这句话时"嘴角没有笑意"——这些都说明他不是真心的。如果真心羡慕，后面不会跟着"不像我""人跟人不能比"这种自贬的话，也不会强调"成功人士"。' },
          { id: 'b', text: '表面羡慕，实则嫉妒，言语中带着酸意和不甘', isCorrect: true, explanation: '这是典型的"酸葡萄心理"——嘴上说羡慕，实际上用贬低自己来反衬你的"好运"，潜台词是"你不就是运气好吗，有什么了不起的"。结合他一贯的性格（嘴上无所谓心里在意、见不得别人好）和最近的表现（疏远你、觉得你显摆），以及他喝酒的状态（"嘴角没有笑意""仰头一口干了"），可以判断他的真实情绪是嫉妒和不甘。最后用"成功人士"这个词，更是赤裸裸的讽刺。' },
          { id: 'c', text: '他真的很自卑，觉得自己一无是处', isCorrect: false, explanation: '他的主要情绪指向你，而不是对自己的反思。他说这些话的目的不是表达自卑，而是让你不舒服，让在场的人觉得你"飘了"。' },
          { id: 'd', text: '他喝多了，随便说说的', isCorrect: false, explanation: '每一句话都很有"针对性"——先抬高你再贬低自己 → 对比产生落差 → 用"成功人士"反讽，逻辑非常清晰，不像是喝多了随便说的。' }
        ]
      },
      {
        id: 'q2',
        text: '小李说"别耽误人家成功人士聊天"，这句话的潜台词是？',
        options: [
          { id: 'a', text: '他觉得自己和你不是一个层次了，主动退出', isCorrect: false, explanation: '如果真的想退出，不会说得这么阴阳怪气，更不会"扫了一圈桌上的人"。他扫一圈的动作，是在观察其他人的反应，希望有人附和他。' },
          { id: 'b', text: '"成功人士"是反话，他在讽刺你变得飘了、和大家疏远了', isCorrect: true, explanation: '用"成功人士"称呼你，加引号效果，实际上是在表达"你不就是升了个职吗，有什么了不起的"的不满，同时也在暗示其他同学"看他多能装，现在都不把我们放在眼里了"。他扫了一圈桌上的人，就是希望有人能附和他的说法，一起"吐槽"你。这是一种很典型的"拉踩"策略——通过贬低你来拉平你们之间的差距。' },
          { id: 'c', text: '他想让大家都来关注你的成功', isCorrect: false, explanation: '他的目的是制造尴尬气氛，而不是帮你宣传。如果真的想帮你宣传，会说正面的话，而不是反话。' },
          { id: 'd', text: '他想结束这个话题，聊点别的', isCorrect: false, explanation: '如果想换话题，会直接转移话题，比如"来来来喝酒，不说这些了"，而不是用这种方式收尾。他说这句话是想把话题引向"你现在不一样了"这个方向。' }
        ]
      }
    ],
    difficulty: 'medium',
    tags: ['朋友相处', '嫉妒识别', '社交情商'],
    learningPoints: [
      '朋友的夸赞如果后面跟着"不像我""人跟人不能比"等对比，往往是嫉妒的伪装',
      '"某某人士"这种带引号的称呼，通常都是反话，带有讽刺意味',
      '面对朋友的酸言酸语，最好的回应不是解释也不是反击，而是低调化解，给对方留面子',
      '真正的朋友在你成功时会为你开心，而不是通过贬低自己来反衬你的"幸运"',
      '当朋友之间的发展差距越来越大时，关系变淡是很正常的，不必强求'
    ]
  },
  {
    id: 'workplace-003',
    category: 'workplace',
    title: '"这个想法挺有意思的"',
    description: '你在会议上提出一个方案，领导的评价让你捉摸不透',
    background: '部门头脑风暴会议，讨论下季度的营销方案。你准备了两周，做了几十页PPT，提出了一个你觉得很有创意的"跨界联名"方案。',
    context: {
      time: '周二上午10点，部门周会，已经开了1个半小时',
      location: '公司大会议室，部门10多个人都在，包括总监和几个经理',
      recentHistory: '这个"跨界联名"方案你想了很久，是你今年最重要的一个想法，你甚至已经私下找对方公司的朋友聊过，对方表示"有兴趣"。但你之前也听说，领导一直倾向于做"保守型"方案，也就是在去年的基础上优化升级，不要冒太大风险。上个月有个同事提出了一个比较激进的方案，领导当场就否决了，说"我们是大公司，稳一点好"。但领导同时也经常在会上说"大家要多创新，不要墨守成规"，你不确定他到底是怎么想的。',
      atmosphere: '前面几个同事的方案都比较常规，领导只是"嗯""好的"地应付。你是最后一个汇报的，你想给大家一个惊喜。'
    },
    relationshipNotes: [
      {
        title: '你 vs 领导（刘经理）',
        description: '直属上下级关系，共事2年，领导是典型的"政治型"领导',
        impact: '领导不会直接否定你的方案，因为他要维持"鼓励创新"的形象，也不想打击你的积极性。但他也不会支持有风险的方案，因为他明年要升总监，"不出错"才是他的核心诉求。'
      },
      {
        title: '领导 vs 他的晋升目标',
        description: '他明年有机会升总监，当前最重要的目标是平稳过渡',
        impact: '他所有决策的出发点都是"不能出问题"。跨界联名方案涉及外部合作，不可控因素多，一旦出问题会直接影响他的晋升。所以他用"挺有意思的""再考虑可行性""先放一放"这套组合拳来委婉否决。'
      },
      {
        title: '你 vs 你的职业诉求',
        description: '你想通过创新方案证明自己有战略思维，不满足于只做执行',
        impact: '你对方案投入了两周时间，寄予厚望，所以对领导的委婉信号不够敏感——你只听到了"挺有意思的"正面评价，却没听出"先放一放"的真实含义。'
      }
    ],
    characters: [
      {
        name: '领导（刘经理）',
        role: '部门经理，40岁',
        relationshipWithYou: '你的直属上级，共事2年',
        relationshipLevel: 'colleague',
        relationshipTag: '直属上级',
        personality: '典型的"政治型"领导，说话永远留有余地，不会把话说死。他的核心诉求是"不出错"——做好了是他领导有方，做错了是下属自己的问题。',
        background: '他明年有机会升总监，所以这一年他最大的目标是"平稳过渡"，不能出任何大的纰漏。他鼓励创新，但前提是"安全的创新"，也就是不会出大问题的那种创新。真正有风险的事情，他是绝对不会碰的。'
      },
      {
        name: '你',
        role: '营销专员，入职2年',
        relationshipWithYou: '本人视角',
        relationshipLevel: 'colleague',
        relationshipTag: '本人',
        personality: '有想法，有冲劲，想做出点成绩证明自己。对职场政治不太敏感，有时候会把领导的"场面话"当真。',
        background: '你去年表现不错，但都是"执行层面"的成绩，你想通过这个方案证明自己有"战略思维"。'
      }
    ],
    dialog: [
      { speaker: '你', role: '员工', relationshipLevel: 'colleague', relationshipTag: '本人', text: '……所以我觉得，如果能和这个品牌跨界联名，应该能带来不错的话题度和转化效果。', tone: '自信满满地结束了汇报，期待着领导的表扬' },
      { speaker: '领导', role: '部门经理', relationshipLevel: 'colleague', relationshipTag: '直属上级', text: '嗯……', tone: '沉吟了几秒，手指敲了敲桌面，没有马上说话' },
      { speaker: '你', role: '员工', relationshipLevel: 'colleague', relationshipTag: '本人', text: '领导您觉得怎么样？', tone: '期待，身体微微前倾' },
      { speaker: '领导', role: '部门经理', relationshipLevel: 'colleague', relationshipTag: '直属上级', text: '这个想法挺有意思的，思路比较新颖。不过……我们是不是可以再考虑一下可行性？', tone: '语气平和，没有明显的情绪波动，甚至还微微笑了一下' },
      { speaker: '你', role: '员工', relationshipLevel: 'colleague', relationshipTag: '本人', text: '您是说哪方面的可行性？我可以补充说明。', tone: '准备继续解释，你觉得领导可能没听明白' },
      { speaker: '领导', role: '部门经理', relationshipLevel: 'colleague', relationshipTag: '直属上级', text: '不用急，先放一放，我们再看看其他方案，大家都可以多想一想。', tone: '摆摆手，开始让下一个人发言，明显不想继续讨论这个话题了' }
    ],
    questions: [
      {
        id: 'q1',
        text: '领导说"这个想法挺有意思的"，他最可能的真实评价是？',
        options: [
          { id: 'a', text: '真的觉得很有创意，值得深入探讨', isCorrect: false, explanation: '如果真的觉得好，领导会继续追问细节，比如"预算大概多少""对方公司谈得怎么样了"，或者让你直接做执行方案，而不是"先放一放"。结合领导明年要升总监、"不求有功但求无过"的心态，以及上个月否决激进方案的历史，他不可能支持这种有风险的方案。' },
          { id: 'b', text: '想法太天马行空，不切实际，领导根本不认可这个方案', isCorrect: true, explanation: '"挺有意思的"在工作场合中往往是"不切实际、无法落地"的委婉说法。结合完整背景：领导明年要升总监，核心诉求是"不出错"；上个月刚否决了激进方案；这个跨界联名方案明显有风险（涉及外部合作，不可控因素多）——领导用"挺有意思的"给你面子，然后用"再考虑一下可行性""先放一放"来否决。他微笑、平和的语气，都是为了让你"体面地退场"，不要在会上和他争辩。' },
          { id: 'c', text: '领导需要时间消化一下这个方案', isCorrect: false, explanation: '"先放一放"的潜台词是"不想再讨论了"，而不是需要时间消化。如果真的需要时间，他会说"这个方案我再看看，你把资料发我"，而不是直接让下一个人发言。' },
          { id: 'd', text: '领导觉得这个方案不错，但不想当众表扬你，怕你骄傲', isCorrect: false, explanation: '没有必要用这种方式防止员工骄傲。领导如果真的觉得好，反而会当众表扬，树立"鼓励创新"的形象。' }
        ]
      },
      {
        id: 'q2',
        text: '如果会后你想继续推进这个方案，最好的做法是？',
        options: [
          { id: 'a', text: '直接找领导问清楚他到底哪里不满意', isCorrect: false, explanation: '太直接了，领导已经用委婉的方式拒绝了，直接问会让领导尴尬——他不想明说"我觉得不行"，你逼他说出来，他会觉得你"不识趣"。' },
          { id: 'b', text: '根据领导提到的"可行性"，重新补充更多数据和落地细节，然后找一个非正式的场合再次汇报', isCorrect: true, explanation: '领导已经暗示了"可行性"是问题所在，正确的做法是针对这个点进行完善。但不要在正式场合再次提出，因为领导已经让"先放一放"了，你在会上再提等于让他下不来台。正确的做法是：找领导比较放松的时候（比如茶水间偶遇、午餐后闲聊），非正式地说"领导，上次那个跨界方案我回去又想了想，关于可行性我补充了一些数据，您要不要看看？"——这样既给了领导台阶，也给自己争取了机会。如果领导还是说"先放一放"，那就真的要放下了。' },
          { id: 'c', text: '在下次会议上再次提出这个方案', isCorrect: false, explanation: '领导已经让"先放一放"，再在会议上提出会让领导下不来台，效果只会更差，甚至会让领导觉得你"故意和他对着干"。' },
          { id: 'd', text: '找其他同事一起联名支持这个方案', isCorrect: false, explanation: '这会让领导觉得你在拉帮结派给他施压，更加反感。职场大忌：不要用"群众压力"来逼领导做决定。' }
        ]
      }
    ],
    difficulty: 'hard',
    tags: ['会议沟通', '读懂领导', '方案汇报'],
    learningPoints: [
      '工作场合中，"挺有意思的" ≠ 夸奖，通常意味着"不切实际、无法落地"',
      '"再考虑一下可行性" = 我觉得这个方案行不通',
      '"先放一放" = 我不想再讨论这个话题了，请你识趣一点',
      '面对领导的委婉拒绝，不要当面追问或反驳，而是找到问题点，完善后非正式地再次争取',
      '读懂领导的关键：看他的处境和核心诉求，而不是他嘴上说什么'
    ]
  },
  {
    id: 'romance-002',
    category: 'romance',
    title: '"你觉得她好看吗"',
    description: '和女朋友逛街时遇到了她的朋友，一场"送命题"正在悄然上演',
    background: '你和女朋友正在商场逛街，迎面走来一个打扮时髦的女生，是你女朋友的大学同学。你和女朋友恋爱半年，还在磨合期，你经常因为"不会说话"踩雷。',
    context: {
      time: '周日下午3点，你们逛了大概2个小时',
      location: '商场一楼大厅，人来人往',
      recentHistory: '小美（也就是对面走来的这个女生）是你女朋友的大学室友，但她们的关系一直有点"微妙"——大学时小美是系花，追她的人很多，而你女朋友当时比较普通，有点小自卑。毕业后小美嫁了个有钱人，经常在朋友圈晒奢侈品，你女朋友每次刷到都会沉默一会儿。你知道她们关系"表面很好，暗地里较劲"，所以你之前特意问过"小美长什么样啊"，你女朋友当时说"就那样吧，一般人"。还有，上周你在路上多看了一眼别的女生，你女朋友生了半天气，说"你是不是觉得别人比我好看"。',
      atmosphere: '你本来心情不错，但看到小美走过来，你下意识地紧张了——毕竟上周刚因为"看别的女生"翻过车。'
    },
    relationshipNotes: [
      {
        title: '你 vs 女朋友（琪琪）',
        description: '恋爱半年的情侣，还在磨合期，她缺乏安全感，喜欢用测试来确认你的爱',
        impact: '上周你刚因为"多看了别的女生一眼"惹她生气，她这次问"你觉得她好看吗"就是一次典型的安全感测试。她需要的不是客观评价，而是确认"在你眼里她才是最美的"。'
      },
      {
        title: '女朋友（琪琪）vs 小美',
        description: '大学室友，表面闺蜜，但暗地里一直在比较——比外貌、比老公、比男朋友',
        impact: '小美是琪琪心中的"假想敌"，大学时小美是系花，琪琪一直有点自卑。现在小美嫁了有钱人，琪琪在她面前更没有安全感。琪琪下意识整理头发、观察你的反应，都是这种比较心态的体现。'
      },
      {
        title: '小美 vs 你',
        description: '第一次见面，她是你女朋友的大学室友',
        impact: '小美"从头到脚"打量你、夸你帅时特意看你女朋友一眼、临走时回头看你——这些动作都说明她在故意"撩"你，也是在向琪琪示威："你男朋友我也能吸引到"。'
      }
    ],
    characters: [
      {
        name: '女朋友（琪琪）',
        role: '女朋友，25岁，策划',
        relationshipWithYou: '恋爱半年，还在磨合期',
        relationshipLevel: 'lover',
        relationshipTag: '女朋友',
        personality: '有点小自卑，缺乏安全感，喜欢用"测试"来确认你对她的爱。嘴巴上不说，但很在意你对她的看法，也很在意和别人的比较。',
        background: '她大学时比较普通，现在慢慢变好看了，但内心深处还是有点不自信，尤其是在小美这种"天生丽质"的朋友面前。'
      },
      {
        name: '小美',
        role: '女朋友的大学室友/朋友',
        relationshipWithYou: '第一次见面，之前只是听说过',
        relationshipLevel: 'acquaintance',
        relationshipTag: '女朋友的室友（情敌般的存在）',
        personality: '性格外向，喜欢展示自己，有点"绿茶"倾向——说话总是"看似无心实则有意"。',
        background: '大学时就是系花，毕业后嫁了个有钱的老公，现在全职太太，每天就是逛街美容。她和琪琪（你女朋友）表面是闺蜜，但暗地里一直在比较——比身材、比穿着、比老公、比男朋友。今天她特意打扮得很时髦，也是因为知道会遇到琪琪。'
      },
      {
        name: '你',
        role: '男朋友，27岁',
        relationshipWithYou: '本人视角',
        relationshipLevel: 'lover',
        relationshipTag: '本人',
        personality: '典型的"直男"，对女生的"小心思"不太敏感，经常踩雷。',
        background: '你很爱她，但确实不太会说话，经常因为"实话实说"让她不高兴。上周就是因为说了"那个女生腿挺长的"而生了半天气。'
      }
    ],
    dialog: [
      { speaker: '女朋友', role: '女朋友', relationshipLevel: 'lover', relationshipTag: '女朋友', text: '咦？那不是小美吗？小美！', tone: '兴奋地挥手打招呼，但你注意到她下意识地整理了一下头发' },
      { speaker: '小美', role: '女朋友的朋友', relationshipLevel: 'acquaintance', relationshipTag: '女朋友的室友（情敌般的存在）', text: '哇，真的是你！好久不见！这位是……你男朋友？好帅啊！', tone: '热情地打量你，而且是"从头到脚"的那种打量，夸你时还特意看了你女朋友一眼' },
      { speaker: '你', role: '男朋友', relationshipLevel: 'lover', relationshipTag: '本人', text: '你好你好，我是她男朋友。', tone: '礼貌微笑，不敢多看小美' },
      { speaker: '小美', role: '女朋友的朋友', relationshipLevel: 'acquaintance', relationshipTag: '女朋友的室友（情敌般的存在）', text: '哎呀，你真有福气，男朋友这么帅！你们聊，我还有事先走了，回头约啊！', tone: '笑着挥手离开，走的时候还回头看了你一眼' },
      { speaker: '你', role: '男朋友', relationshipLevel: 'lover', relationshipTag: '本人', text: '嗯，你朋友挺热情的。', tone: '随口说，完全没意识到危险正在逼近' },
      { speaker: '女朋友', role: '女朋友', relationshipLevel: 'lover', relationshipTag: '女朋友', text: '是啊……对了，你觉得她好看吗？', tone: '状似随意地问，但脚步放慢了，用余光瞟着你，观察你的每一个微表情' }
    ],
    questions: [
      {
        id: 'q1',
        text: '女朋友问"你觉得她好看吗"，这个问题的本质是在测试什么？',
        options: [
          { id: 'a', text: '她真的想知道你对她朋友外貌的评价', isCorrect: false, explanation: '结合背景：没有女生真的想知道男朋友觉得别的女生好不好看，尤其是这个"别的女生"还是她有点嫉妒的大学室友。上周你刚因为多看了别的女生一眼她就生气了，这次她不可能"突然好奇"你的审美。' },
          { id: 'b', text: '测试你是否会在她面前夸赞其他女生，以及你对她的专一程度', isCorrect: true, explanation: '这是典型的"送命题"——结合完整背景来看：小美是她有点嫉妒的朋友（大学时是系花、嫁了有钱人、她朋友圈都不爱看）；上周你刚因为"看别的女生"翻过车；她问这个问题时"脚步放慢""用余光瞟着你"——这些线索都指向：她在测试你！表面问的是小美好不好看，实际上是在测试你会不会当着她的面说别的女生漂亮，以及你是否足够在意她的感受。她想确认的是："在你眼里，我是不是最好看的？"。' },
          { id: 'c', text: '她想给小美介绍男朋友，问你意见', isCorrect: false, explanation: '完全不合逻辑，小美已经结婚了。' },
          { id: 'd', text: '她想知道你的审美标准是什么样的', isCorrect: false, explanation: '你的审美标准她早就知道了，不需要这种时候测试。而且她用的是小美这个"特定人选"，不是随便一个人，明显是有针对性的。' }
        ]
      },
      {
        id: 'q2',
        text: '以下哪个回复最稳妥？',
        options: [
          { id: 'a', text: '"还行吧，普通长相"', isCorrect: false, explanation: '说她朋友"普通"可能会让她觉得你虚伪（因为小美明显长得不错），而且也没正面回应"你在我心里最美"这个潜台词。她可能会继续追问"那就是没有我好看咯？"，让你陷入更深的陷阱。' },
          { id: 'b', text: '"挺好看的啊，你朋友长得都挺不错的"', isCorrect: false, explanation: '你死定了。说别的女生好看等于自杀，尤其是这个女生还是她嫉妒的对象。她接下来一定会说"那你去找她啊"或者"她这么好看你当初怎么不追她"。' },
          { id: 'c', text: '"没注意看，我眼里只看得到你"', isCorrect: true, explanation: '满分回答！结合背景：她缺乏安全感、喜欢测试你、上周刚因为你看别的女生生气——这个回答完美命中了她所有的核心需求：1. 回避了评价其他女生的陷阱；2. 表达了"你是我唯一关注的人"；3. 满足了她的安全感需求。这道题的核心不是评价别人，而是表达对她的重视和专一。说这句话时最好配上宠溺的眼神或者拉她的手，效果翻倍。' },
          { id: 'd', text: '"怎么突然问这个？你是不是吃醋了？"', isCorrect: false, explanation: '直接点破她在测试你，会让她觉得被看穿，反而可能恼羞成怒。她想看到的是你"自然流露"的在乎，而不是你"识破了她的伎俩"。正确的做法是：配合对方的剧本，假装你不知道这是测试，但给出她想要的答案。' }
        ]
      }
    ],
    difficulty: 'easy',
    tags: ['亲密关系', '送命题', '安全感'],
    learningPoints: [
      '女朋友问你"某某女生好看吗"永远不是真的想听你评价别人',
      '这类问题的核心是测试你的注意力在谁身上，以及你能给她多少安全感',
      '回答这类问题的公式：回避评价他人 + 明确表达对方是唯一 + 甜言蜜语',
      '不要点破她在"测试"你，配合对方的剧本才是正确做法',
      '缺乏安全感的伴侣需要反复确认"你在乎她"，不要嫌麻烦'
    ]
  },
  {
    id: 'stranger-001',
    category: 'stranger',
    title: '"留个联系方式吧"',
    description: '商务饭局上认识了一个同行，对方的热情让你有些尴尬',
    background: '公司安排你参加一个行业交流会，饭局上坐在你旁边的是另一家公司的销售经理。你不太擅长和陌生人打交道，尤其是这种"自来熟"的人。',
    context: {
      time: '周三晚上7点半，饭局已经进行了1个多小时',
      location: '酒店包间，一桌10个人，都是行业内的人',
      recentHistory: '你是做技术的，平时很少参加这种商务应酬，这次是领导让你来"多认识点人"。你不太喜欢加陌生人微信，你微信里只有100多个人，都是同事和朋友。你之前有过不好的经历：加了一个做销售的，之后对方天天给你发广告，烦不胜烦，最后只能拉黑。坐在你旁边的这个销售经理，从坐下开始就一直在给你倒酒、递烟、套近乎，问了你很多关于你们公司的问题，你都含糊过去了。你注意到他桌上放着一盒名片，刚才已经给桌上好几个人都发了。',
      atmosphere: '饭局气氛很热烈，大家都在互相敬酒、交换名片。你坐在角落，想低调一点，但旁边这个人一直围着你转。'
    },
    relationshipNotes: [
      {
        title: '你 vs 销售经理（老陈）',
        description: '初次见面的陌生人，他是销售，你是技术工程师，他想通过你搭上你们公司的项目关系',
        impact: '老陈的"自来熟"和热情都是销售的职业套路，他不是真的想和你交朋友，而是把你当成潜在的"资源"。他把手机直接递到你面前，就是用社交压力逼你就范。'
      },
      {
        title: '老陈 vs 他的职业身份',
        description: '十几年的老销售，人脉就是他的饭碗，口碑一般，认钱不认人',
        impact: '他说"不强求"只是给自己台阶下，内心已经因为你"不给面子"而产生了负面印象。对他这种靠人脉吃饭的人来说，拒绝加联系方式等于否定了他的社交价值。'
      },
      {
        title: '你 vs 商务社交场合',
        description: '你是技术出身，不太擅长也不喜欢这种商务应酬',
        impact: '你的内向性格和原则感让你在这种场合容易吃亏——你觉得"加不加微信是我的自由"，但在商务社交规则里，当面拒绝加联系方式是很不给面子的行为，可能会无端树敌。'
      }
    ],
    characters: [
      {
        name: '销售经理（老陈）',
        role: '某公司销售经理，大概40岁',
        relationshipWithYou: '第一次见面，陌生人',
        relationshipLevel: 'stranger',
        relationshipTag: '商务场合认识的销售',
        personality: '典型的"老销售"，自来熟，脸皮厚，擅长"见人说人话，见鬼说鬼话"。特别重视人脉，恨不得把所有人都变成他的"资源"。',
        background: '他在这个行业做了十几年，人脉很广，但口碑一般——很多人都说他"认钱不认人"，有用的时候跟你称兄道弟，没用的时候理都不理。他今天特意坐在你旁边，是因为听说你们公司最近有个大项目要招标，他想通过你搭上关系。'
      },
      {
        name: '你',
        role: '技术工程师，28岁',
        relationshipWithYou: '本人视角',
        relationshipLevel: 'stranger',
        relationshipTag: '本人',
        personality: '偏内向，不太喜欢社交，有原则，不喜欢欠人情也不喜欢别人麻烦自己。',
        background: '你是做技术的，在公司不负责采购和招标，其实帮不上他什么忙。但他不知道，或者说他不在乎——对他来说，多一个联系方式总比少一个好，说不定哪天就用上了。'
      }
    ],
    dialog: [
      { speaker: '销售经理', role: '同行', relationshipLevel: 'stranger', relationshipTag: '商务场合认识的销售', text: '兄弟，刚才听你讲你们公司那个项目，做得真漂亮！', tone: '热情地给你倒酒，身体往你这边凑了凑' },
      { speaker: '你', role: '员工', relationshipLevel: 'stranger', relationshipTag: '本人', text: '哪里哪里，大家一起做的。', tone: '客气回应，身体微微往后靠了靠' },
      { speaker: '销售经理', role: '同行', relationshipLevel: 'stranger', relationshipTag: '商务场合认识的销售', text: '太谦虚了！我就喜欢和你们这种做事专业的人交朋友。来，我敬你一杯！以后咱们资源共享，互相帮助嘛！', tone: '一饮而尽，非常豪爽，喝完还把酒杯倒过来给你看' },
      { speaker: '你', role: '员工', relationshipLevel: 'stranger', relationshipTag: '本人', text: '好的好的，互相学习。', tone: '也喝了，但只喝了一小口' },
      { speaker: '销售经理', role: '同行', relationshipLevel: 'stranger', relationshipTag: '商务场合认识的销售', text: '对了兄弟，留个联系方式吧？微信还是电话？', tone: '掏出手机，已经打开了添加好友界面，递到你面前，一副"你不会拒绝吧"的表情' },
      { speaker: '你', role: '员工', relationshipLevel: 'stranger', relationshipTag: '本人', text: '嗯……', tone: '有些犹豫，因为你不太喜欢加陌生人微信，不知道该怎么拒绝' },
      { speaker: '销售经理', role: '同行', relationshipLevel: 'stranger', relationshipTag: '商务场合认识的销售', text: '哎呀，是不是不方便？没事没事，不强求不强求！', tone: '把手机收了回去，表情有些微妙的变化——笑容还在，但眼睛里的热情消失了一些' }
    ],
    questions: [
      {
        id: 'q1',
        text: '销售经理说"不强求不强求"，他的真实心态是？',
        options: [
          { id: 'a', text: '真的觉得加不加无所谓，完全不介意', isCorrect: false, explanation: '结合背景：他是做销售的，人脉就是他的饭碗；他今天特意坐在你旁边就是为了搭上你们公司；他已经给桌上好几个人都发了名片——如果真的无所谓，他不会把手机都掏出来递到你面前。他"表情有些微妙的变化"说明他介意了。' },
          { id: 'b', text: '嘴上说不强求，心里已经觉得你"不给面子"，可能会对你产生负面印象', isCorrect: true, explanation: '在商务社交场合，尤其是在酒桌上，主动要联系方式被拒绝是很没面子的事。结合这个人"老销售"的性格和他对人脉的重视程度，他说"不强求"只是给自己台阶下，但心里已经给你贴上了"不好打交道""摆架子""不给面子"的标签。对他这种人来说，"不给面子"比"不帮忙"更严重。他不一定会记恨你，但以后如果有机会的话，他可能不会帮你。' },
          { id: 'c', text: '他很欣赏你有原则', isCorrect: false, explanation: '刚认识的人不会因为这种事欣赏你的原则，尤其是对销售来说，"原则"约等于"难搞"。' },
          { id: 'd', text: '他本来就是随便说说，没当真', isCorrect: false, explanation: '主动掏手机递到你面前的动作说明他是认真的，这是他的标准操作流程——遇到可能有用的人，一定要加上微信。' }
        ]
      },
      {
        id: 'q2',
        text: '如果你确实不想加，但又不想得罪对方，当时最好的应对方式是？',
        options: [
          { id: 'a', text: '直接说"不好意思，我平时很少用微信，就算加了也联系不上"', isCorrect: false, explanation: '这个理由太假，谁都听得出来是借口，反而更得罪人。他心里会想"不用微信你骗鬼呢"，觉得你在侮辱他的智商。' },
          { id: 'b', text: '先加上，之后再设置"仅聊天"或者不通过', isCorrect: false, explanation: '不通过比当面拒绝还没礼貌，而且万一哪天在某个场合遇到了，他问你"怎么还没通过好友啊"，你会更尴尬。设置"仅聊天"可以，但前提是先加上。' },
          { id: 'c', text: '笑着说"当然可以！我扫你还是你扫我？"，先加上保持礼貌，之后不主动联系就行', isCorrect: true, explanation: '结合背景：商务社交的核心是"给足对方面子"。加个联系方式并不会损失什么——你设置个"仅聊天""不看他朋友圈"就可以了，他发广告你就当没看见，实在烦了再拉黑也不迟。但当面拒绝却可能给自己树敌，尤其是对销售这种"人脉型"的人，他可能在你不知道的时候影响到你。商务场合的原则：能不得罪人就不得罪人，成本很低的事情（比如加个微信）就满足对方，没必要为了"坚持原则"给自己添麻烦。' },
          { id: 'd', text: '说"不好意思，公司有规定不能随便留联系方式"', isCorrect: false, explanation: '这个理由太生硬，而且没有哪家公司会有这种规定。他心里会想"你以为你是谁啊，还公司规定"，反而更反感。' }
        ]
      }
    ],
    difficulty: 'medium',
    tags: ['商务社交', '人际礼仪', '面子文化'],
    learningPoints: [
      '商务场合中"不强求" = "我已经很没面子了，你看着办"',
      '当面拒绝加联系方式 = 不给对方面子，很容易被记恨',
      '社交场合的原则：能不得罪人就不得罪人，加个联系方式成本很低',
      '不想深交的人，加了之后不主动联系、保持距离即可，没必要在明面上撕破脸',
      '判断对方的真实意图：看他之前做了什么，而不是他当下说了什么'
    ]
  },
  {
    id: 'family-002',
    category: 'family',
    title: '"随便你吧"',
    description: '和爸爸因为一件事意见不合，他的最后一句话让你心里不安',
    background: '你想辞掉现在稳定的国企工作，去一家创业公司。你把这个决定告诉了父亲，你们爆发了激烈的争吵。',
    context: {
      time: '周日晚上8点，一家人刚吃完晚饭',
      location: '家里客厅，妈妈在厨房洗碗，你和爸爸坐在沙发上',
      recentHistory: '这个话题你们已经讨论过三次了，每次都是不欢而散。你拿到了创业公司的offer，薪资是现在的1.5倍，还有期权，你觉得这是个千载难逢的机会。但你爸坚持认为"国企稳定，创业公司说倒就倒"。你爷爷当年就是"下海"失败，家里穷了好多年，这件事一直是你爸的心理阴影。你爸这辈子最看重的就是"稳定"——他在同一家工厂干了30年，从工人做到车间主任，从来没跳过槽。上周你姑姑家的表哥创业失败，欠了一屁股债，你爸还跟你说"你看看，这就是瞎折腾的下场"。',
      atmosphere: '客厅里弥漫着紧张的气息，电视开着但没人看。你爸手里攥着遥控器，指节都发白了。'
    },
    relationshipNotes: [
      {
        title: '你 vs 父亲',
        description: '亲生父子/女关系，父亲严厉但深爱你，你们因为职业选择产生了激烈冲突',
        impact: '父亲的反对不是控制欲，而是源于他自身的痛苦经历——他亲眼见过你爷爷创业失败后全家的惨状。你说"我自己的事情我自己负责"这句话，对他来说等于"我不需要你了"，这比任何话都伤人。'
      },
      {
        title: '父亲 vs 他的童年阴影',
        description: '你爷爷当年下海失败，家里穷得交不起学费，他作为老大早早进厂打工养家',
        impact: '父亲这辈子最深的恐惧就是"不稳定"，这不是保守，而是刻在骨子里的生存本能。他反对你去创业公司，本质上是不想让你重蹈他和你爷爷的覆辙，他怕你吃苦、怕你失败。'
      },
      {
        title: '你 vs 你的人生追求',
        description: '你不甘心在国企待一辈子，想趁年轻证明自己',
        impact: '你对"一眼望到头"的生活的恐惧，和父亲对"不稳定"的恐惧一样强烈。你们都在用自己的人生经验判断对方的选择，但谁也无法真正说服谁——因为你们的恐惧来源完全不同。'
      }
    ],
    characters: [
      {
        name: '父亲',
        role: '父亲，58岁，退休工厂车间主任',
        relationshipWithYou: '你的亲生父亲，严厉但很爱你',
        relationshipLevel: 'family',
        relationshipTag: '亲生父亲',
        personality: '性格固执，观念传统，认定的事情很难改变。不擅长表达情感，关心你但说出来的话总是像在批评你。',
        background: '他这辈子吃过"不稳定"的苦——你爷爷下海失败，家里穷得连学费都交不起，他作为老大早早就进厂打工养家。所以他最大的心愿就是你能"安安稳稳过一辈子"，不要经历他吃过的苦。他不理解现在的互联网行业，在他看来"不是国企的工作都不算正经工作"。'
      },
      {
        name: '你',
        role: '女儿/儿子，28岁',
        relationshipWithYou: '本人视角',
        relationshipLevel: 'family',
        relationshipTag: '本人',
        personality: '有闯劲，不甘心一辈子待在舒适区，想趁年轻拼一把。',
        background: '你在国企工作了5年，虽然稳定但一眼能看到退休的样子，你觉得再这样下去人生就废了。你很清楚父亲是为你好，但你也不想因为他的保守而放弃自己的梦想。'
      }
    ],
    dialog: [
      { speaker: '你', role: '女儿/儿子', relationshipLevel: 'family', relationshipTag: '本人', text: '爸，我想好了，我想去那家创业公司。', tone: '坚定，你不想再吵了，但态度很明确' },
      { speaker: '父亲', role: '父亲', relationshipLevel: 'family', relationshipTag: '亲生父亲', text: '我说了多少遍了，现在的工作这么稳定，多少人想进都进不去，你为什么非要折腾？', tone: '已经提高了音量，脸涨红了' },
      { speaker: '你', role: '女儿/儿子', relationshipLevel: 'family', relationshipTag: '本人', text: '爸，现在时代不一样了，稳定不代表好。我还年轻，想闯一闯。', tone: '试图说服，尽量让自己的语气平和' },
      { speaker: '父亲', role: '父亲', relationshipLevel: 'family', relationshipTag: '亲生父亲', text: '闯？闯失败了怎么办？你想过没有？', tone: '拍了一下桌子，茶杯都震了一下' },
      { speaker: '你', role: '女儿/儿子', relationshipLevel: 'family', relationshipTag: '本人', text: '爸，你能不能别老是打击我？我已经长大了，我自己的事情我自己负责。', tone: '也有些不耐烦了，声音也大了起来' },
      { speaker: '父亲', role: '父亲', relationshipLevel: 'family', relationshipTag: '亲生父亲', text: '……', tone: '沉默了几秒，深深地看了你一眼，眼神里有愤怒，但更多的是失望和无力' },
      { speaker: '父亲', role: '父亲', relationshipLevel: 'family', relationshipTag: '亲生父亲', text: '行，随便你吧。', tone: '声音很轻，甚至有些沙哑，说完就转身走进了自己房间，关上了门，关门的声音不大，但很沉' }
    ],
    questions: [
      {
        id: 'q1',
        text: '父亲说"随便你吧"并转身回房，他最真实的情绪是？',
        options: [
          { id: 'a', text: '他想通了，同意你的决定了', isCorrect: false, explanation: '结合背景：你们已经吵了三次，他一直坚决反对；他刚才还拍了桌子；他爷爷当年创业失败的阴影——他不可能这么快就想通。如果真的同意了，他会和你正常沟通，而不是沉默后转身回房。' },
          { id: 'b', text: '他非常失望和伤心，觉得"孩子长大了不听自己的了"，有一种无力感', isCorrect: true, explanation: '"随便你吧"在亲子关系中，尤其是在父母对子女说时，通常带着深深的无力感和失望。结合完整背景：他这辈子最怕的就是"不稳定"，因为他吃过这个苦；他把所有希望都寄托在你身上，希望你安稳；你说"我自己的事情我自己负责"这句话，对他来说等于"我不需要你了"——这比任何话都伤人。父亲拍桌子、沉默、深深地看一眼、声音沙哑、轻轻但沉重地关门，这一系列动作都说明他从愤怒转为难过，觉得自己已经无法影响你的决定了，有一种"我老了，管不了了"的无力感。' },
          { id: 'c', text: '他累了，不想再争论了', isCorrect: false, explanation: '不只是累了，更多的是情感上的失望和心碎。"累了"是身体层面的，但他的反应更多是情感层面的。' },
          { id: 'd', text: '他在和你赌气', isCorrect: false, explanation: '父亲对孩子不是赌气那么简单，更多的是"心凉了"的感觉。赌气是小孩子的行为，一个58岁的父亲，面对孩子的重大人生选择，他的情绪要复杂得多。' }
        ]
      },
      {
        id: 'q2',
        text: '面对这种情况，你最应该做的是什么？',
        options: [
          { id: 'a', text: '既然他说随便我，那就按我自己的想法来，等做出成绩了他自然会理解', isCorrect: false, explanation: '这是最常见的误区！结合背景：父亲反对不是因为他保守，而是因为他爱你、怕你吃苦。如果让父亲带着失望关门，关系会出现裂痕，成绩可能有了，但亲情的伤害很难弥补。而且父亲这辈人经历过太多苦，他们的"保守"不是没有道理的，你也需要反思一下自己是不是太冲动了。' },
          { id: 'b', text: '立刻追进房间，先不要讨论工作的事，而是抱着他说"爸，对不起我刚才说话有点冲，我知道你是为我好"，先安抚他的情绪', isCorrect: true, explanation: '正确的做法是先处理情绪，再处理事情。结合完整背景：父亲不是反对你"闯"，而是怕你"受伤"——他当年亲眼见过你爷爷创业失败后家里的惨状，他不想让你重蹈覆辙。他的出发点是爱，不是控制。所以你应该先让他感受到你理解他的爱（"我知道你是为我好"），然后再慢慢沟通，他才有可能听得进去你的想法。哪怕最后你还是要去，也不要让父亲带着伤心关门。' },
          { id: 'c', text: '先让他冷静几天，等他气消了再说', isCorrect: false, explanation: '有些情绪不及时处理，会在心里发酵，变成心结。"随便你吧"这句话，在父子关系中是很重的，它意味着"我放弃了"。如果不及时修复，这个疙瘩会一直在那里。' },
          { id: 'd', text: '找妈妈去做他的思想工作', isCorrect: false, explanation: '你自己造成的情绪伤害，应该你自己去修复，找第三方介入反而显得你没有诚意。而且妈妈夹在中间也很为难。' }
        ]
      }
    ],
    difficulty: 'hard',
    tags: ['亲子关系', '情绪处理', '代际沟通'],
    learningPoints: [
      '父母说"随便你吧"时，往往不是同意，而是带着失望和无力感的妥协',
      '父母反对你做某件事，本质上不是控制，而是担心你受伤害',
      '和父母意见不合时，正确顺序是：先安抚情绪（表达理解和爱）→ 再沟通事情',
      '"等我做出成绩他们就理解了"是最常见的误区，成绩可以证明你对了，但情感的裂痕不会自己愈合',
      '理解父母的恐惧来源（他们吃过的苦），比单纯反驳他们的要求更有效'
    ]
  },
  {
    id: 'friend-002',
    category: 'friend',
    title: '"改天请你吃饭"',
    description: '朋友找你帮了个大忙，最后说的话让你不知该如何回应',
    background: '你的好朋友最近在找工作，你通过关系帮他内推到了一家很不错的公司，他顺利通过了面试。今天他专门来你公司楼下找你表示感谢。',
    context: {
      time: '周三中午12点，午休时间',
      location: '你公司楼下的咖啡馆',
      recentHistory: '你和这位朋友是发小，从小学就认识，关系非常铁。他家境不太好，父母都是农民工，所以他特别珍惜这次工作机会。之前他找了三个月工作都没着落，房租都快交不起了，你看着也着急。你动用了你在这家公司当HR的大学同学的关系，而且你还专门花了两个晚上帮他改简历、模拟面试。可以说，没有你的帮助，他很难拿到这个offer。你们平时经常一起吃饭，都是你请得多，他经济条件不好你也理解，从来没在意过。但是有一次你手头紧，跟他借2000块钱，他支支吾吾半天最后说"我也没钱"，其实你后来知道他当时刚发了工资。这件事让你心里有点不舒服，但也没说什么。',
      atmosphere: '他看起来很开心，一直说着感谢的话，但你心里隐隐有些异样的感觉——你帮了这么大的忙，他好像除了"谢谢"也没什么实际表示。'
    },
    relationshipNotes: [
      {
        title: '你 vs 朋友（阿杰）',
        description: '认识20年的发小，关系很铁，但经济条件差距较大，你帮他内推拿到了很好的offer',
        impact: '你们之间的深厚情谊让你不好意思主动提"回报"，但他对钱的看重又让你心里有点不平衡。他说"改天请吃饭"时的感激是真的，但能不能落实是另一回事——因为"欠人情"对他来说是有压力的。'
      },
      {
        title: '阿杰 vs 他的经济状况',
        description: '他家境不好，从小节省，一块钱掰成两半花，之前你借钱他都支支吾吾',
        impact: '他说"改天请吃饭"更多是一种情绪表达而非实际承诺——人均300的日料对他来说确实是一笔不小的开支。他不是不想感恩，而是"用花钱的方式感恩"会让他有很大的心理压力。'
      },
      {
        title: '你 vs 你的期待',
        description: '你重情义、对朋友大方，但内心深处也希望帮了大忙能得到认可和回报',
        impact: '你嘴上说"不用不用"，心里其实在期待他坚持请客——这是人性的正常反应，不是功利，而是希望自己的付出被看见和重视。这种"口是心非"的社交默契，也是朋友相处中最微妙的地方。'
      }
    ],
    characters: [
      {
        name: '朋友（阿杰）',
        role: '发小、好朋友',
        relationshipWithYou: '认识20年的发小，关系很铁，但经济条件差距较大',
        relationshipLevel: 'close_friend',
        relationshipTag: '发小（20年交情）',
        personality: '性格比较内向，有些自卑，不太会表达感激。有时候会有点"小家子气"，对钱看得比较重，但人本质不坏。',
        background: '他家境确实不好，从小就很节省，一块钱恨不得掰成两半花。他不是不感恩，而是不知道该怎么表达，也确实没多少钱。他内心深处觉得"欠人情"是件很有压力的事，所以有时候会用"口头感谢"来逃避实际的回报。'
      },
      {
        name: '你',
        role: '28岁，公司职员',
        relationshipWithYou: '本人视角',
        relationshipLevel: 'close_friend',
        relationshipTag: '本人',
        personality: '重情义，对朋友大方，但有时候也会心里不平衡——尤其是在帮了大忙之后。',
        background: '你家境比他好一些，工作也稳定，所以平时朋友之间你多花点钱也不在意。但这次你帮的忙确实很大，而且你还特意花了时间精力，你内心深处是希望他能有所表示的，哪怕只是请你吃顿饭。'
      }
    ],
    dialog: [
      { speaker: '朋友', role: '好朋友', relationshipLevel: 'close_friend', relationshipTag: '发小（20年交情）', text: '兄弟，真的太感谢你了！这次要不是你帮忙，我根本进不了这家公司！', tone: '非常激动，用力拍了拍你的肩膀，眼眶都有点红了' },
      { speaker: '你', role: '你', relationshipLevel: 'close_friend', relationshipTag: '本人', text: '嗨，小事儿，主要是你自己能力够，我只是搭个桥。', tone: '谦虚地笑了笑，说"小事儿"的时候自己都觉得有点虚伪' },
      { speaker: '朋友', role: '好朋友', relationshipLevel: 'close_friend', relationshipTag: '发小（20年交情）', text: '那怎么能一样！你这忙帮得太大了！这样，改天我请你吃饭！就那家新开的日料店，你不是一直想去吗？', tone: '说得非常诚恳，甚至说了具体的餐厅名字' },
      { speaker: '你', role: '你', relationshipLevel: 'close_friend', relationshipTag: '本人', text: '不用不用，咱们之间客气什么。', tone: '习惯性推辞，但心里其实挺想他请的——那家日料店人均300多，你一直舍不得去' },
      { speaker: '朋友', role: '好朋友', relationshipLevel: 'close_friend', relationshipTag: '发小（20年交情）', text: '不行不行，必须得请！就这么定了，改天约！', tone: '态度很坚决，好像真的一定会请一样' }
    ],
    questions: [
      {
        id: 'q1',
        text: '朋友说"改天请你吃饭"，关于这句话，以下哪种理解最准确？',
        options: [
          { id: 'a', text: '他只是在说客套话，不会真的请', isCorrect: false, explanation: '结合背景：他态度"非常诚恳"，说了具体的餐厅名字，而且你们是20年的发小，不是普通朋友。他当下的感激是真的，不是客套话。但是，结合他之前"借钱"事件中对钱的态度，以及他的家境和性格，他会不会落实是另一回事。' },
          { id: 'b', text: '他当下是真心想请你吃饭，但"改天"是个模糊的时间，大概率不会主动落实，需要你在合适的时候提一下或者他过一阵真的来约', isCorrect: true, explanation: '这是最真实的情况——结合完整背景来看：他当下的感激是真的（"眼眶都有点红了""态度很坚决"），想请客也是真的（说了具体的餐厅名字，不是随便敷衍）。但"改天"是个模糊的时间，没有具体日期，再加上他本身对钱看得比较重、不太会主动表达，这件事大概率会被忙碌遗忘。他可能会一直记着"欠你一顿饭"，但就是不会主动约。如果双方都不提，这件事大概率就不了了之了。这不是虚伪，而是人性——感激之情会随着时间变淡。' },
          { id: 'c', text: '他一定会在近期主动约你吃饭', isCorrect: false, explanation: '"改天"的不确定性很高，再结合他对钱的态度（你借钱他都支支吾吾），不要抱过高预期。他大概率不会主动约，除非你提。' },
          { id: 'd', text: '他是在考验你是否把他当朋友', isCorrect: false, explanation: '没有必要用这种方式考验，而且你们是20年的发小，不需要这种考验。' }
        ]
      },
      {
        id: 'q2',
        text: '如果你也很想和朋友聚一下，但不想显得自己"图这顿饭"，最好的回应方式是？',
        options: [
          { id: 'a', text: '"好啊，那就这周六吧，我正好有空"，直接把时间定下来', isCorrect: false, explanation: '太直接了，会显得你真的很在意这顿饭，朋友虽然嘴上不说，心里可能会有点不舒服——"我就是客气一下，你还当真了"。结合他对钱比较敏感的性格，直接定时间会让他有压力。' },
          { id: 'b', text: '"吃饭是必须的！但不用改天，就这周末吧，我请客，庆祝你入职！"，主动把时间定下来，并且说自己请', isCorrect: true, explanation: '最佳应对方式！结合完整背景：你确实想聚，但又不想显得"图这顿饭"；朋友经济条件不好但又欠你人情——这个回答完美解决了所有问题：1. 主动把时间定下来，避免"改天"变成"无期"；2. 主动说自己请，既不让对方觉得你在等他请客，又表达了你也想聚一聚的意愿；3. 用"庆祝你入职"作为理由，让请客变得自然，不是"因为你欠我人情所以请我"。最后谁掏钱其实不重要，重要的是大家都开心——如果他坚持要请，你就让他请；如果他不说话，你就去结账。朋友之间，没必要算那么清楚。' },
          { id: 'c', text: '"行，那等你忙完这阵再说"，不主动提，等他约', isCorrect: false, explanation: '这样大概率就没有下文了。"改天""等你忙完这阵"都是社交中的模糊用语，意思就是"我不想主动"。如果你真想聚，就不要等。' },
          { id: 'd', text: '"真不用，咱们之间不用来这套"，坚决拒绝', isCorrect: false, explanation: '太坚决地拒绝会让对方觉得欠你人情，反而不舒服。朋友之间互相请客是正常的人情往来，你坚决拒绝等于在说"我不接受你的感谢"，会让他更有压力。' }
        ]
      }
    ],
    difficulty: 'medium',
    tags: ['朋友相处', '人情往来', '社交边界'],
    learningPoints: [
      '"改天请你吃饭" = 当下真心想请，但这个"改天"很可能遥遥无期',
      '好朋友之间，接受对方的感谢和请客，反而会让对方更舒服（人情还清了）',
      '想聚但不想显"功利"的方法：主动提议时间 + 主动说自己请（最后谁掏钱不重要）',
      '"改天""下次""有空"在社交中都是模糊承诺，不要太当真',
      '朋友之间的人情往来，重要的是心意而不是钱，但完全不计较也不现实，找到双方都舒服的平衡点最重要'
    ]
  }
]
