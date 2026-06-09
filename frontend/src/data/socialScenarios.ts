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

export interface SocialScenario {
  id: string
  category: 'workplace' | 'family' | 'friend' | 'romance' | 'stranger'
  title: string
  description: string
  background: string
  dialog: DialogLine[]
  questions: ScenarioQuestion[]
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  learningPoints: string[]
}

export interface DialogLine {
  speaker: string
  role: string
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
    background: '你负责的项目已经进行了两个月，今天领导在部门例会后单独留你下来，说要和你"聊聊"。',
    dialog: [
      { speaker: '领导', role: '部门总监', text: '小王啊，这个项目进展得还不错，你辛苦了。', tone: '面带微笑，语气平和' },
      { speaker: '你', role: '项目负责人', text: '谢谢领导，都是团队的功劳。', tone: '礼貌回应' },
      { speaker: '领导', role: '部门总监', text: '嗯，不过呢，我最近和客户那边聊了一下，他们反馈说沟通起来还是稍微有点"不顺畅"。', tone: '语气略微加重了"不顺畅"三个字' },
      { speaker: '你', role: '项目负责人', text: '啊？可能是我最近太忙，沟通不够及时，我马上改进。', tone: '有些紧张' },
      { speaker: '领导', role: '部门总监', text: '哎呀你也别太紧张，我不是在批评你。我个人建议啊，下次客户沟通的时候，让老李也一起参加吧，他经验丰富一些。', tone: '摆手，语气变得很轻松' }
    ],
    questions: [
      {
        id: 'q1',
        text: '领导说"让老李也一起参加吧，他经验丰富一些"，最想表达的真实意思是？',
        options: [
          { id: 'a', text: '领导真心觉得你一个人忙不过来，想给你找个帮手', isCorrect: false, explanation: '如果真想帮你，领导会直接说派老李协助你，而不是用"我个人建议"这种委婉说法。' },
          { id: 'b', text: '领导对你目前的客户沟通不太满意，想让老李逐渐接管客户对接', isCorrect: true, explanation: '领导前面铺垫了客户反馈"沟通不顺畅"，然后用"建议"的方式提出让老李参与，实际上是在表达对你的不满，并且已经在考虑让更有经验的人接手。' },
          { id: 'c', text: '领导想让老李多学习一下你的项目经验', isCorrect: false, explanation: '领导说的是老李"经验丰富一些"，而不是让老李来学习，所以这个选项与对话内容矛盾。' },
          { id: 'd', text: '领导想测试你是否有团队合作精神', isCorrect: false, explanation: '这个场景是项目出现问题后的沟通，领导没有必要用这种方式测试团队精神。' }
        ]
      },
      {
        id: 'q2',
        text: '领导说"我不是在批评你"，这句话的潜台词最可能是？',
        options: [
          { id: 'a', text: '真的不是批评，只是随口说说', isCorrect: false, explanation: '如果真的不是批评，领导不会特别强调这句话。' },
          { id: 'b', text: '接下来要说的话比批评更严重', isCorrect: false, explanation: '虽然是在表达不满，但未必更严重，更多是为了让你更容易接受。' },
          { id: 'c', text: '其实就是在批评你，但用更委婉的方式说出来', isCorrect: true, explanation: '"我不是在批评你"是典型的"铺垫语"，后面跟着的通常就是批评或不满，只是为了降低你的防御心理。' },
          { id: 'd', text: '领导担心你会生气，所以先安抚一下', isCorrect: false, explanation: '安抚只是表面效果，核心目的还是让你接受接下来的批评。' }
        ]
      }
    ],
    difficulty: 'medium',
    tags: ['向上管理', '客户沟通', '读懂领导'],
    learningPoints: [
      '当领导用"我个人建议"开头时，通常不是建议而是决定',
      '"我不是在批评你" = 接下来我要批评你了，请做好心理准备',
      '客户反馈"沟通不顺畅"往往是客户对你不满意的委婉说法',
      '出现这种信号时，应该主动反思并提出改进方案，而不是被动等待'
    ]
  },
  {
    id: 'workplace-002',
    category: 'workplace',
    title: '同事的"小请求"',
    description: '同事总是在下班前找你帮忙，这次他又来"麻烦你一下"',
    background: '周五下午5点45分，你正在收拾东西准备下班，和你关系还不错的同事小张走了过来。',
    dialog: [
      { speaker: '小张', role: '同事', text: '嘿，还没走吧？', tone: '笑着走过来，拍了拍你的肩膀' },
      { speaker: '你', role: '员工', text: '正准备走呢，怎么了？', tone: '有些警觉' },
      { speaker: '小张', role: '同事', text: '哎呀，真不好意思又麻烦你。你看这个报表，我怎么都弄不对，明天早上领导就要用了，你能不能帮我看看？就"几分钟"的事。', tone: '双手合十，做出拜托的手势，特别强调了"几分钟"' },
      { speaker: '你', role: '员工', text: '嗯……我今晚还有点事。', tone: '犹豫' },
      { speaker: '小张', role: '同事', text: '没事没事，不方便就算了！我再想想办法，实在不行我就加会儿班。你快回去吧，别耽误你的事。', tone: '立刻摆手，表情有些失落，但语气很"理解人"' }
    ],
    questions: [
      {
        id: 'q1',
        text: '小张最后说"没事没事，不方便就算了……你快回去吧"，他的真实心理状态是？',
        options: [
          { id: 'a', text: '真的理解你，决定自己解决', isCorrect: false, explanation: '如果真理解，就不会在你下班前跑来求助，还特别强调"几分钟"。' },
          { id: 'b', text: '使用"欲擒故纵"的策略，通过表现得很懂事来让你感到愧疚，从而改变主意帮他', isCorrect: true, explanation: '这是典型的"以退为进"策略——先表现得很大度、很理解你，让你产生"他都这么说了我不帮好像不太好"的愧疚感，从而主动提出帮忙。' },
          { id: 'c', text: '他真的打算自己加班搞定', isCorrect: false, explanation: '如果打算自己搞定，就不会一开始就来找你了。' },
          { id: 'd', text: '他在威胁你，暗示你不帮忙他就会记恨你', isCorrect: false, explanation: '小张的策略更温和，是利用人情和愧疚感，而不是威胁。' }
        ]
      },
      {
        id: 'q2',
        text: '小张特别强调"就几分钟的事"，这个说法的主要目的是什么？',
        options: [
          { id: 'a', text: '如实说明工作量，让你有个预期', isCorrect: false, explanation: '这个报表明显不是几分钟能搞定的，他自己都"怎么都弄不对"。' },
          { id: 'b', text: '降低你的心理门槛，让你更容易答应帮忙', isCorrect: true, explanation: '"就几分钟"是典型的"门槛技巧"，先把工作量说得很小，让你觉得"反正就几分钟帮一下吧"，等你答应了再告诉你其实比想象中复杂。' },
          { id: 'c', text: '他自己也不清楚具体需要多久', isCorrect: false, explanation: '他的主要目的是说服你帮忙，而不是陈述事实。' },
          { id: 'd', text: '想让你觉得这个任务很简单，体现他能力差', isCorrect: false, explanation: '没有人会主动在同事面前体现自己能力差。' }
        ]
      }
    ],
    difficulty: 'easy',
    tags: ['职场人际', '拒绝的艺术', '边界感'],
    learningPoints: [
      '"就几分钟的事"几乎永远不止几分钟，这是降低拒绝意愿的话术',
      '欲擒故纵：先表现大度理解，让对方产生愧疚感，是常见的操控策略',
      '学会温柔而坚定地拒绝，是职场必备技能',
      '反复在下班前找你帮忙的人，本质上是在把自己的工作转嫁给你'
    ]
  },
  {
    id: 'family-001',
    category: 'family',
    title: '妈妈的"关心"',
    description: '周末回家吃饭，妈妈又开始了她的"日常关心"',
    background: '你已经30岁了，单身，在外地工作。好不容易周末回家，妈妈做了一大桌你爱吃的菜。',
    dialog: [
      { speaker: '妈妈', role: '母亲', text: '来，多吃点，你看你瘦的。', tone: '不停往你碗里夹菜' },
      { speaker: '你', role: '女儿/儿子', text: '妈我不瘦，我现在过得挺好的。', tone: '有些无奈' },
      { speaker: '妈妈', role: '母亲', text: '好什么呀，一个人在外面，连个做饭的人都没有。', tone: '叹了口气' },
      { speaker: '你', role: '女儿/儿子', text: '我自己会做饭……', tone: '试图辩解' },
      { speaker: '妈妈', role: '母亲', text: '哎呀不说这个了。对了，楼下王阿姨她侄子，和你同岁，在银行上班，人特别稳重，你要不要……认识一下？', tone: '装作随口一提的样子，但眼神一直在观察你的反应' }
    ],
    questions: [
      {
        id: 'q1',
        text: '妈妈说"哎呀不说这个了"然后马上介绍相亲对象，她最可能的真实想法是？',
        options: [
          { id: 'a', text: '她真的不想说了，只是突然想到了王阿姨的侄子', isCorrect: false, explanation: '这是典型的"转折铺垫"，前面的"不说这个"只是为了引出后面真正想说的。' },
          { id: 'b', text: '先用关心铺垫，再用"不说了"降低你的防备心，然后自然地提出相亲', isCorrect: true, explanation: '这是父母催婚的经典话术流程：先关心你的生活 → 让你放松 → 假装转移话题 → 顺势提出相亲要求，这样你不容易直接拒绝。' },
          { id: 'c', text: '她自己也觉得催婚不好，有点不好意思', isCorrect: false, explanation: '虽然可能有点不好意思，但"不说这个了"主要是策略，而不是真心觉得不好。' },
          { id: 'd', text: '她忘了自己刚才在说什么', isCorrect: false, explanation: '显然是有备而来的。' }
        ]
      },
      {
        id: 'q2',
        text: '妈妈在说"人特别稳重，你要不要……认识一下？"时观察你的反应，她最想通过你的表情判断什么？',
        options: [
          { id: 'a', text: '你是不是饿了', isCorrect: false, explanation: '与吃饭无关。' },
          { id: 'b', text: '你对这个相亲对象是否感兴趣，以及你对催婚这件事的抵触程度', isCorrect: true, explanation: '父母在提出敏感话题（如催婚、催育）时，会观察你的微表情，判断你是否在可沟通范围内，如果你的反应很强烈，他们可能会暂时退缩；如果你只是犹豫，他们就会继续施压。' },
          { id: 'c', text: '你是不是在公司受了委屈', isCorrect: false, explanation: '与当前话题无关。' },
          { id: 'd', text: '你是不是缺钱花', isCorrect: false, explanation: '与当前话题无关。' }
        ]
      }
    ],
    difficulty: 'easy',
    tags: ['亲子沟通', '催婚应对', '情绪识别'],
    learningPoints: [
      '"不说这个了" ≠ 真的不说了，通常是要"说更重要的那个"的铺垫',
      '父母催婚的本质往往不是真的急着让你结婚，而是担心你一个人过得不好',
      '观察说话人的微表情和肢体语言，比听表面内容更重要',
      '面对催婚，可以先共情"我知道妈妈是为我好"再表达自己的想法，沟通效果会更好'
    ]
  },
  {
    id: 'romance-001',
    category: 'romance',
    title: '"没事，你忙吧"',
    description: '约会前你因为工作要爽约，对方的回复让人捉摸不透',
    background: '你和女朋友恋爱一年多，今天本来约好一起吃她期待了很久的一家网红餐厅。下午五点，老板突然通知你要临时加班赶方案。',
    dialog: [
      { speaker: '你', role: '男朋友', text: '亲爱的，对不起……老板突然让我加班，今晚的约会可能要取消了。', tone: '愧疚' },
      { speaker: '女朋友', role: '女朋友', text: '哦。', tone: '语气很平淡，停顿了两秒' },
      { speaker: '你', role: '男朋友', text: '明天，明天我一定陪你去，好吗？', tone: '急切' },
      { speaker: '女朋友', role: '女朋友', text: '没事，你忙吧。工作重要。', tone: '声音很轻，没有情绪起伏' },
      { speaker: '你', role: '男朋友', text: '你……是不是生气了？', tone: '小心翼翼' },
      { speaker: '女朋友', role: '女朋友', text: '我生什么气啊，都说了没事。你专心加班吧，我挂了。', tone: '语速略快，说完就挂断了电话' }
    ],
    questions: [
      {
        id: 'q1',
        text: '女朋友说"没事，你忙吧"，她最真实的情绪状态是？',
        options: [
          { id: 'a', text: '真的没事，她很理解你的工作', isCorrect: false, explanation: '如果真的没事，她不会用"哦"开场，也不会语速略快地挂电话。' },
          { id: 'b', text: '她确实没生气，但有点小失望', isCorrect: false, explanation: '不只是小失望，"没事+挂电话"的组合是典型的生气信号。' },
          { id: 'c', text: '她非常生气，说的是反话，"没事"="有事，而且很严重"', isCorrect: true, explanation: '在亲密关系中，"没事"几乎等于"有事，而且我已经不想和你说话了"。配合"哦"的冷淡开场、语速加快、主动挂电话等信号，说明她已经非常不满了。' },
          { id: 'd', text: '她在担心你加班太辛苦', isCorrect: false, explanation: '如果是担心，她会多问几句工作的事，而不是急着挂电话。' }
        ]
      },
      {
        id: 'q2',
        text: '面对这种情况，你最不应该做的是？',
        options: [
          { id: 'a', text: '加班结束后立刻给她打电话道歉', isCorrect: false, explanation: '这是正确的做法。' },
          { id: 'b', text: '既然她说没事，那就真的专心加班，等她自己消气', isCorrect: true, explanation: '这是最危险的做法！她说"没事"不代表真的没事，如果你真的不理她，等她自己消气，往往只会让事情变得更严重。女生说反话时，你越当真，后果越严重。' },
          { id: 'c', text: '加班间隙给她发消息，表达你也很遗憾，并且承诺补偿', isCorrect: false, explanation: '这是很好的做法，让她感受到你在乎她的感受。' },
          { id: 'd', text: '如果可能，和老板商量换个时间加班，或者把工作带回家做一部分', isCorrect: false, explanation: '如果能做到，这是最能体现重视对方的方式。' }
        ]
      }
    ],
    difficulty: 'easy',
    tags: ['亲密关系', '反话识别', '情绪管理'],
    learningPoints: [
      '亲密关系中的"没事" = "有事，而且很严重，你最好马上想办法哄我"',
      '冷淡的"哦"字是强烈不满的信号，不要当作正常的回应',
      '对方主动挂电话 = 情绪已经到了临界点，需要立即处理',
      '处理伴侣情绪的正确顺序：先安抚情绪 → 再解释原因 → 最后给出补偿方案'
    ]
  },
  {
    id: 'friend-001',
    category: 'friend',
    title: '"我真羡慕你"',
    description: '朋友聚会时，有人看似夸赞你，但听起来总觉得哪里不对',
    background: '大学同学聚会，你刚升职加薪，还交了个各方面条件都不错的女朋友。大家聊着各自的近况，你的事情被一个朋友提到了。',
    dialog: [
      { speaker: '同学A', role: '老同学', text: '哎，你们知道吗？老王现在可厉害了，刚刚升了部门经理！', tone: '兴奋地说' },
      { speaker: '你', role: '老王', text: '哈哈运气好运气好。', tone: '谦虚地笑了笑' },
      { speaker: '小李', role: '大学室友', text: '运气？别谦虚了。我真羡慕你啊，什么好事都让你赶上了。不像我，还是在那个破公司混日子，连个正经女朋友都没有。', tone: '举起酒杯，但嘴角没有笑意，说完仰头一口干了' },
      { speaker: '你', role: '老王', text: '你也挺好的啊，别这么说。', tone: '有些尴尬' },
      { speaker: '小李', role: '大学室友', text: '好什么呀，人跟人不能比嘛。来，喝酒喝酒，别耽误人家"成功人士"聊天。', tone: '笑着说，但"成功人士"四个字咬字格外重' }
    ],
    questions: [
      {
        id: 'q1',
        text: '小李说"我真羡慕你啊"，他最真实的情感是？',
        options: [
          { id: 'a', text: '真心为你感到高兴和羡慕', isCorrect: false, explanation: '如果真心羡慕，后面不会跟着"不像我""人跟人不能比"这种话，也不会强调"成功人士"。' },
          { id: 'b', text: '表面羡慕，实则嫉妒，言语中带着酸意和不甘', isCorrect: true, explanation: '这是典型的"酸葡萄心理"——嘴上说羡慕，实际上用贬低自己来反衬你的"好运"，暗指你的成功不是靠能力而是靠运气，最后用"成功人士"这个词进行嘲讽。' },
          { id: 'c', text: '他真的很自卑，觉得自己一无是处', isCorrect: false, explanation: '他的主要情绪指向你，而不是对自己的反思。' },
          { id: 'd', text: '他喝多了，随便说说的', isCorrect: false, explanation: '每一句话都很有"针对性"，不像是喝多了随便说的。' }
        ]
      },
      {
        id: 'q2',
        text: '小李说"别耽误人家成功人士聊天"，这句话的潜台词是？',
        options: [
          { id: 'a', text: '他觉得自己和你不是一个层次了，主动退出', isCorrect: false, explanation: '如果真的想退出，不会说得这么阴阳怪气。' },
          { id: 'b', text: '"成功人士"是反话，他在讽刺你变得飘了、和大家疏远了', isCorrect: true, explanation: '用"成功人士"称呼你，加引号效果，实际上是在表达"你不就是升了个职吗，有什么了不起的"的不满，同时也在暗示其他同学"看他多能装"。' },
          { id: 'c', text: '他想让大家都来关注你的成功', isCorrect: false, explanation: '他的目的是制造尴尬气氛，而不是帮你宣传。' },
          { id: 'd', text: '他想结束这个话题，聊点别的', isCorrect: false, explanation: '如果想换话题，会直接转移话题，而不是用这种方式收尾。' }
        ]
      }
    ],
    difficulty: 'medium',
    tags: ['朋友相处', '嫉妒识别', '社交情商'],
    learningPoints: [
      '朋友的夸赞如果后面跟着"不像我""人跟人不能比"等对比，往往是嫉妒的伪装',
      '"某某人士"这种带引号的称呼，通常都是反话，带有讽刺意味',
      '面对朋友的酸言酸语，最好的回应不是解释也不是反击，而是低调化解，给对方留面子',
      '真正的朋友在你成功时会为你开心，而不是通过贬低自己来反衬你的"幸运"'
    ]
  },
  {
    id: 'workplace-003',
    category: 'workplace',
    title: '"这个想法挺有意思的"',
    description: '你在会议上提出一个方案，领导的评价让你捉摸不透',
    background: '部门头脑风暴会议，你准备了很久，提出了一个你觉得很有创意的方案。',
    dialog: [
      { speaker: '你', role: '员工', text: '……所以我觉得这个方案如果能落地，应该能带来不错的效果。', tone: '自信满满地结束了汇报' },
      { speaker: '领导', role: '部门经理', text: '嗯……', tone: '沉吟了几秒，手指敲了敲桌面' },
      { speaker: '你', role: '员工', text: '领导您觉得怎么样？', tone: '期待' },
      { speaker: '领导', role: '部门经理', text: '这个想法挺有意思的，思路比较新颖。不过……我们是不是可以再考虑一下可行性？', tone: '语气平和，没有明显的情绪波动' },
      { speaker: '你', role: '员工', text: '您是说哪方面的可行性？我可以补充说明。', tone: '准备继续解释' },
      { speaker: '领导', role: '部门经理', text: '不用急，先放一放，我们再看看其他方案，大家都可以多想一想。', tone: '摆摆手，开始让下一个人发言' }
    ],
    questions: [
      {
        id: 'q1',
        text: '领导说"这个想法挺有意思的"，他最可能的真实评价是？',
        options: [
          { id: 'a', text: '真的觉得很有创意，值得深入探讨', isCorrect: false, explanation: '如果真的觉得好，领导会继续追问细节，或者让你直接做执行方案，而不是"先放一放"。' },
          { id: 'b', text: '想法太天马行空，不切实际，领导根本不认可这个方案', isCorrect: true, explanation: '"挺有意思的"在工作场合中往往是"不切实际、无法落地"的委婉说法。后面的"再考虑一下可行性""先放一放"更是直接印证了领导觉得这个方案不可行。' },
          { id: 'c', text: '领导需要时间消化一下这个方案', isCorrect: false, explanation: '"先放一放"的潜台词是"不想再讨论了"，而不是需要时间消化。' },
          { id: 'd', text: '领导觉得这个方案不错，但不想当众表扬你，怕你骄傲', isCorrect: false, explanation: '没有必要用这种方式防止员工骄傲。' }
        ]
      },
      {
        id: 'q2',
        text: '如果会后你想继续推进这个方案，最好的做法是？',
        options: [
          { id: 'a', text: '直接找领导问清楚他到底哪里不满意', isCorrect: false, explanation: '太直接了，领导已经委婉拒绝过，直接问会让领导尴尬。' },
          { id: 'b', text: '根据领导提到的"可行性"，重新补充更多数据和落地细节，然后找一个非正式的场合再次汇报', isCorrect: true, explanation: '领导已经暗示了"可行性"是问题所在，正确的做法是针对这个点进行完善，然后在领导比较放松的时候（比如茶水间、午餐后）非正式地再次提出来，给领导台阶也给自己机会。' },
          { id: 'c', text: '在下次会议上再次提出这个方案', isCorrect: false, explanation: '领导已经让"先放一放"，再在会议上提出会让领导下不来台，效果只会更差。' },
          { id: 'd', text: '找其他同事一起联名支持这个方案', isCorrect: false, explanation: '这会让领导觉得你在拉帮结派给他施压，更加反感。' }
        ]
      }
    ],
    difficulty: 'hard',
    tags: ['会议沟通', '读懂领导', '方案汇报'],
    learningPoints: [
      '工作场合中，"挺有意思的" ≠ 夸奖，通常意味着"不切实际、无法落地"',
      '"再考虑一下可行性" = 我觉得这个方案行不通',
      '"先放一放" = 我不想再讨论这个话题了，请你识趣一点',
      '面对领导的委婉拒绝，不要当面追问或反驳，而是找到问题点，完善后非正式地再次争取'
    ]
  },
  {
    id: 'romance-002',
    category: 'romance',
    title: '"你觉得她好看吗"',
    description: '和女朋友逛街时遇到了她的朋友，一场"送命题"正在悄然上演',
    background: '你和女朋友正在商场逛街，迎面走来一个打扮时髦的女生，是你女朋友的大学同学。',
    dialog: [
      { speaker: '女朋友', role: '女朋友', text: '咦？那不是小美吗？小美！', tone: '兴奋地挥手打招呼' },
      { speaker: '小美', role: '女朋友的朋友', text: '哇，真的是你！好久不见！这位是……你男朋友？好帅啊！', tone: '热情地打量你' },
      { speaker: '你', role: '男朋友', text: '你好你好，我是她男朋友。', tone: '礼貌微笑' },
      { speaker: '小美', role: '女朋友的朋友', text: '哎呀，你真有福气，男朋友这么帅！你们聊，我还有事先走了，回头约啊！', tone: '笑着挥手离开' },
      { speaker: '你', role: '男朋友', text: '嗯，你朋友挺热情的。', tone: '随口说' },
      { speaker: '女朋友', role: '女朋友', text: '是啊……对了，你觉得她好看吗？', tone: '状似随意地问，但脚步放慢了，用余光瞟着你' }
    ],
    questions: [
      {
        id: 'q1',
        text: '女朋友问"你觉得她好看吗"，这个问题的本质是在测试什么？',
        options: [
          { id: 'a', text: '她真的想知道你对她朋友外貌的评价', isCorrect: false, explanation: '没有女生真的想知道男朋友觉得别的女生好不好看。' },
          { id: 'b', text: '测试你是否会在她面前夸赞其他女生，以及你对她的专一程度', isCorrect: true, explanation: '这是典型的"送命题"——表面问的是小美好不好看，实际上是在测试你会不会当着她的面说别的女生漂亮，以及你是否足够在意她的感受。' },
          { id: 'c', text: '她想给小美介绍男朋友，问你意见', isCorrect: false, explanation: '完全不合逻辑。' },
          { id: 'd', text: '她想知道你的审美标准是什么样的', isCorrect: false, explanation: '你的审美标准她早就知道了，不需要这种时候测试。' }
        ]
      },
      {
        id: 'q2',
        text: '以下哪个回复最稳妥？',
        options: [
          { id: 'a', text: '"还行吧，普通长相"', isCorrect: false, explanation: '说她朋友"普通"可能会让她觉得你虚伪，而且也没正面回应"你在我心里最美"这个潜台词。' },
          { id: 'b', text: '"挺好看的啊，你朋友长得都挺不错的"', isCorrect: false, explanation: '你死定了。说别的女生好看等于自杀。' },
          { id: 'c', text: '"没注意看，我眼里只看得到你"', isCorrect: true, explanation: '满分回答！既回避了评价其他女生的问题，又表达了"你是我唯一关注的人"，让她的安全感得到满足。这道题的核心不是评价别人，而是表达对她的重视。' },
          { id: 'd', text: '"怎么突然问这个？你是不是吃醋了？"', isCorrect: false, explanation: '直接点破她在测试你，会让她觉得被看穿，反而可能恼羞成怒。' }
        ]
      }
    ],
    difficulty: 'easy',
    tags: ['亲密关系', '送命题', '安全感'],
    learningPoints: [
      '女朋友问你"某某女生好看吗"永远不是真的想听你评价别人',
      '这类问题的核心是测试你的注意力在谁身上，以及你能给她多少安全感',
      '回答这类问题的公式：回避评价他人 + 明确表达对方是唯一 + 甜言蜜语',
      '不要点破她在"测试"你，配合对方的剧本才是正确做法'
    ]
  },
  {
    id: 'stranger-001',
    category: 'stranger',
    title: '"留个联系方式吧"',
    description: '商务饭局上认识了一个同行，对方的热情让你有些尴尬',
    background: '公司安排你参加一个行业交流会，饭局上坐在你旁边的是另一家公司的销售经理。',
    dialog: [
      { speaker: '销售经理', role: '同行', text: '兄弟，刚才听你讲你们公司那个项目，做得真漂亮！', tone: '热情地给你倒酒' },
      { speaker: '你', role: '员工', text: '哪里哪里，大家一起做的。', tone: '客气回应' },
      { speaker: '销售经理', role: '同行', text: '太谦虚了！我就喜欢和你们这种做事专业的人交朋友。来，我敬你一杯！以后咱们资源共享，互相帮助嘛！', tone: '一饮而尽，非常豪爽' },
      { speaker: '你', role: '员工', text: '好的好的，互相学习。', tone: '也喝了' },
      { speaker: '销售经理', role: '同行', text: '对了兄弟，留个联系方式吧？微信还是电话？', tone: '掏出手机，已经打开了添加好友界面' },
      { speaker: '你', role: '员工', text: '嗯……', tone: '有些犹豫，因为你不太喜欢加陌生人微信' },
      { speaker: '销售经理', role: '同行', text: '哎呀，是不是不方便？没事没事，不强求不强求！', tone: '把手机收了回去，表情有些微妙的变化' }
    ],
    questions: [
      {
        id: 'q1',
        text: '销售经理说"不强求不强求"，他的真实心态是？',
        options: [
          { id: 'a', text: '真的觉得加不加无所谓，完全不介意', isCorrect: false, explanation: '如果真的无所谓，他不会把手机都掏出来，而且"表情有些微妙的变化"说明他介意了。' },
          { id: 'b', text: '嘴上说不强求，心里已经觉得你"不给面子"，可能会对你产生负面印象', isCorrect: true, explanation: '在商务社交场合，主动要联系方式被拒绝是很没面子的事。他说"不强求"只是给自己台阶下，但心里已经给你贴上了"不好打交道""摆架子"的标签。' },
          { id: 'c', text: '他很欣赏你有原则', isCorrect: false, explanation: '刚认识的人不会因为这种事欣赏你的原则。' },
          { id: 'd', text: '他本来就是随便说说，没当真', isCorrect: false, explanation: '主动掏手机的动作说明他是认真的。' }
        ]
      },
      {
        id: 'q2',
        text: '如果你确实不想加，但又不想得罪对方，当时最好的应对方式是？',
        options: [
          { id: 'a', text: '直接说"不好意思，我平时很少用微信，就算加了也联系不上"', isCorrect: false, explanation: '这个理由太假，谁都听得出来是借口，反而更得罪人。' },
          { id: 'b', text: '先加上，之后再设置"仅聊天"或者不通过', isCorrect: false, explanation: '不通过比当面拒绝还没礼貌。' },
          { id: 'c', text: '笑着说"当然可以！我扫你还是你扫我？"，先加上保持礼貌，之后不主动联系就行', isCorrect: true, explanation: '商务社交的核心是"给足对方面子"。加个联系方式并不会损失什么，但当面拒绝却可能给自己树敌。加了之后不主动联系、保持点头之交就可以了。' },
          { id: 'd', text: '说"不好意思，公司有规定不能随便留联系方式"', isCorrect: false, explanation: '这个理由太生硬，而且没有哪家公司会有这种规定。' }
        ]
      }
    ],
    difficulty: 'medium',
    tags: ['商务社交', '人际礼仪', '面子文化'],
    learningPoints: [
      '商务场合中"不强求" = "我已经很没面子了，你看着办"',
      '当面拒绝加联系方式 = 不给对方面子，很容易被记恨',
      '社交场合的原则：能不得罪人就不得罪人，加个联系方式成本很低',
      '不想深交的人，加了之后不主动联系、保持距离即可，没必要在明面上撕破脸'
    ]
  },
  {
    id: 'family-002',
    category: 'family',
    title: '"随便你吧"',
    description: '和爸爸因为一件事意见不合，他的最后一句话让你心里不安',
    background: '你想辞掉现在稳定的工作，去一家创业公司。你把这个决定告诉了父亲。',
    dialog: [
      { speaker: '你', role: '女儿/儿子', text: '爸，我想好了，我想去那家创业公司。', tone: '坚定' },
      { speaker: '父亲', role: '父亲', text: '我说了多少遍了，现在的工作这么稳定，多少人想进都进不去，你为什么非要折腾？', tone: '已经提高了音量' },
      { speaker: '你', role: '女儿/儿子', text: '爸，现在时代不一样了，稳定不代表好。我还年轻，想闯一闯。', tone: '试图说服' },
      { speaker: '父亲', role: '父亲', text: '闯？闯失败了怎么办？你想过没有？', tone: '拍了一下桌子' },
      { speaker: '你', role: '女儿/儿子', text: '爸，你能不能别老是打击我？我已经长大了，我自己的事情我自己负责。', tone: '也有些不耐烦了' },
      { speaker: '父亲', role: '父亲', text: '……', tone: '沉默了几秒，深深地看了你一眼' },
      { speaker: '父亲', role: '父亲', text: '行，随便你吧。', tone: '声音很轻，说完就转身走进了自己房间，关上了门' }
    ],
    questions: [
      {
        id: 'q1',
        text: '父亲说"随便你吧"并转身回房，他最真实的情绪是？',
        options: [
          { id: 'a', text: '他想通了，同意你的决定了', isCorrect: false, explanation: '如果真的同意了，他会和你正常沟通，而不是沉默后转身回房。' },
          { id: 'b', text: '他非常失望和伤心，觉得"孩子长大了不听自己的了"，有一种无力感', isCorrect: true, explanation: '"随便你吧"在亲子关系中，尤其是在父母对子女说时，通常带着深深的无力感和失望。父亲拍桌子、沉默、转身回房，说明他从愤怒转为难过，觉得自己已经无法影响你的决定了。' },
          { id: 'c', text: '他累了，不想再争论了', isCorrect: false, explanation: '不只是累了，更多的是情感上的失望。' },
          { id: 'd', text: '他在和你赌气', isCorrect: false, explanation: "父亲对孩子不是赌气那么简单，更多的是"心凉了"的感觉。" }
        ]
      },
      {
        id: 'q2',
        text: '面对这种情况，你最应该做的是什么？',
        options: [
          { id: 'a', text: '既然他说随便我，那就按我自己的想法来，等做出成绩了他自然会理解', isCorrect: false, explanation: '如果让父亲带着失望关门，关系会出现裂痕，成绩可能有了，但亲情的伤害很难弥补。' },
          { id: 'b', text: '立刻追进房间，先不要讨论工作的事，而是抱着他说"爸，对不起我刚才说话有点冲，我知道你是为我好"，先安抚他的情绪', isCorrect: true, explanation: '正确的做法是先处理情绪，再处理事情。父亲不是反对你"闯"，而是怕你"受伤"。先让他感受到你理解他的爱，再慢慢沟通，他才有可能听得进去你的想法。' },
          { id: 'c', text: '先让他冷静几天，等他气消了再说', isCorrect: false, explanation: '有些情绪不及时处理，会在心里发酵，变成心结。' },
          { id: 'd', text: '找妈妈去做他的思想工作', isCorrect: false, explanation: '你自己造成的情绪伤害，应该你自己去修复，找第三方介入反而显得你没有诚意。' }
        ]
      }
    ],
    difficulty: 'hard',
    tags: ['亲子关系', '情绪处理', '代际沟通'],
    learningPoints: [
      '父母说"随便你吧"时，往往不是同意，而是带着失望和无力感的妥协',
      '父母反对你做某件事，本质上不是控制，而是担心你受伤害',
      '和父母意见不合时，正确顺序是：先安抚情绪（表达理解和爱）→ 再沟通事情',
      '"等我做出成绩他们就理解了"是最常见的误区，成绩可以证明你对了，但情感的裂痕不会自己愈合'
    ]
  },
  {
    id: 'friend-002',
    category: 'friend',
    title: '"改天请你吃饭"',
    description: '朋友找你帮了个大忙，最后说的话让你不知该如何回应',
    background: '你的好朋友最近在找工作，你通过关系帮他内推到了一家很不错的公司，他顺利通过了面试。今天他专门来找你表示感谢。',
    dialog: [
      { speaker: '朋友', role: '好朋友', text: '兄弟，真的太感谢你了！这次要不是你帮忙，我根本进不了这家公司！', tone: '非常激动，用力拍了拍你的肩膀' },
      { speaker: '你', role: '你', text: '嗨，小事儿，主要是你自己能力够，我只是搭个桥。', tone: '谦虚地笑' },
      { speaker: '朋友', role: '好朋友', text: '那怎么能一样！你这忙帮得太大了！这样，改天我请你吃饭！就那家新开的日料店，你不是一直想去吗？', tone: '说得非常诚恳' },
      { speaker: '你', role: '你', text: '不用不用，咱们之间客气什么。', tone: '习惯性推辞' },
      { speaker: '朋友', role: '好朋友', text: '不行不行，必须得请！就这么定了，改天约！', tone: '态度很坚决' }
    ],
    questions: [
      {
        id: 'q1',
        text: '朋友说"改天请你吃饭"，关于这句话，以下哪种理解最准确？',
        options: [
          { id: 'a', text: '他只是在说客套话，不会真的请', isCorrect: false, explanation: '朋友态度"非常诚恳""态度坚决"，而且你们关系很好，不只是客套。' },
          { id: 'b', text: '他当下是真心想请你吃饭，但"改天"是个模糊的时间，大概率不会主动落实，需要你在合适的时候提一下或者他过一阵真的来约', isCorrect: true, explanation: '这是最真实的情况——当下的感激是真的，想请客也是真的，但"改天"没有具体日期，很容易被忙碌遗忘。如果双方都不提，这件事大概率就不了了之了。' },
          { id: 'c', text: '他一定会在近期主动约你吃饭', isCorrect: false, explanation: '"改天"的不确定性很高，不要抱过高预期。' },
          { id: 'd', text: '他是在考验你是否把他当朋友', isCorrect: false, explanation: '没有必要用这种方式考验。' }
        ]
      },
      {
        id: 'q2',
        text: '如果你也很想和朋友聚一下，但不想显得自己"图这顿饭"，最好的回应方式是？',
        options: [
          { id: 'a', text: '"好啊，那就这周六吧，我正好有空"，直接把时间定下来', isCorrect: false, explanation: '太直接了，会显得你真的很在意这顿饭，朋友虽然嘴上不说，心里可能会有点不舒服。' },
          { id: 'b', text: '"吃饭是必须的！但不用改天，就这周末吧，我请客，庆祝你入职！"，主动把时间定下来，并且说自己请', isCorrect: true, explanation: '最佳应对方式！既让请客这件事落地了，又主动表示"我请"，既不让对方觉得你在等他请客，又表达了你也想聚一聚的意愿。最后谁掏钱其实不重要，重要的是大家都开心。' },
          { id: 'c', text: '"行，那等你忙完这阵再说"，不主动提，等他约', isCorrect: false, explanation: '这样大概率就没有下文了。' },
          { id: 'd', text: '"真不用，咱们之间不用来这套"，坚决拒绝', isCorrect: false, explanation: '太坚决地拒绝会让对方觉得欠你人情，反而不舒服。朋友之间互相请客是正常的人情往来。' }
        ]
      }
    ],
    difficulty: 'medium',
    tags: ['朋友相处', '人情往来', '社交边界'],
    learningPoints: [
      '"改天请你吃饭" = 当下真心想请，但这个"改天"很可能遥遥无期',
      '好朋友之间，接受对方的感谢和请客，反而会让对方更舒服（人情还清了）',
      '想聚但不想显"功利"的方法：主动提议时间 + 主动说自己请（最后谁掏钱不重要）',
      '"改天""下次""有空"在社交中都是模糊承诺，不要太当真'
    ]
  }
]
