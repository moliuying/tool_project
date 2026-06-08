<template>
  <div class="word-guess-game">
    <el-card class="intro-card">
      <div class="intro-header">
        <div class="intro-left">
          <div class="intro-icon">🎯</div>
          <div class="intro-text">
            <h2 class="intro-title">英语词汇猜词游戏</h2>
            <p class="intro-subtitle">
              AI 随机选取一个物品并用中文描述其外观、用途和特征，由你用英语猜出对应的单词。
              通过"先理解场景再调取单词"的方式强化主动词汇记忆，在游戏化互动中提升英语词汇量。
            </p>
          </div>
        </div>
        <div class="intro-badges">
          <el-tag type="primary" effect="dark" size="large">🧠 主动记忆</el-tag>
          <el-tag type="success" effect="dark" size="large">🎮 游戏化学习</el-tag>
          <el-tag type="warning" effect="dark" size="large">📚 词汇强化</el-tag>
        </div>
      </div>
      <el-divider />
      <div class="intro-sections">
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><User /></el-icon>
            适用人群
          </h4>
          <div class="audience-tags">
            <div class="audience-tag">
              <span class="at-emoji">🎓</span>
              <span class="at-name">考生</span>
              <span class="at-desc">四六级/考研/雅思词汇备考</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">💼</span>
              <span class="at-name">职场人士</span>
              <span class="at-desc">日常英语词汇练习</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">👨‍👩‍👧</span>
              <span class="at-name">亲子互动</span>
              <span class="at-desc">家庭英语学习游戏</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">🏫</span>
              <span class="at-name">英语课堂</span>
              <span class="at-desc">词汇热身互动教学</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="stats-card" v-if="totalGames > 0">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataLine />
          </el-icon>
          <span>学习统计</span>
          <el-tag size="small" type="success">累计 {{ totalGames }} 题</el-tag>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="stat-block">
            <div class="stat-emoji">✅</div>
            <div class="stat-content">
              <div class="stat-label">答对</div>
              <div class="stat-value">{{ correctCount }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-block">
            <div class="stat-emoji">❌</div>
            <div class="stat-content">
              <div class="stat-label">答错</div>
              <div class="stat-value">{{ wrongCount }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-block">
            <div class="stat-emoji">📊</div>
            <div class="stat-content">
              <div class="stat-label">正确率</div>
              <div class="stat-value">{{ accuracyRate }}%</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-block">
            <div class="stat-emoji">🔥</div>
            <div class="stat-content">
              <div class="stat-label">最高连击</div>
              <div class="stat-value">{{ maxStreak }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="mastery-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#9b59b6">
            <Trophy />
          </el-icon>
          <span>词汇掌握度</span>
          <el-tag size="small" type="info">词汇库 {{ masteryStats.total }} 词</el-tag>
        </div>
      </template>
      <div class="mastery-progress-list">
        <div v-for="(level, idx) in MASTERY_LEVELS.slice().reverse()" :key="level.level" class="mastery-progress-row">
          <div class="mp-label">
            <span class="mp-dot" :style="{ backgroundColor: level.color }"></span>
            <span class="mp-name">{{ level.label }}</span>
          </div>
          <el-progress
            :percentage="Math.round((masteryStats['level' + level.level] / masteryStats.total) * 100)"
            :color="level.color"
            :stroke-width="14"
            :show-text="true"
          />
          <span class="mp-count">{{ masteryStats['level' + level.level] }} 词</span>
        </div>
      </div>
    </el-card>

    <el-card class="game-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <Game />
          </el-icon>
          <span>猜词游戏</span>
          <el-tag size="small" type="warning" effect="dark">当前连击: {{ currentStreak }}🔥</el-tag>
          <el-tag size="small" type="primary" effect="dark">得分: {{ score }}</el-tag>
        </div>
      </template>

      <div class="config-section" :class="{ disabled: isPlaying }">
        <div class="config-row">
          <div class="config-item">
            <span class="config-label">难度选择：</span>
            <el-radio-group v-model="selectedDifficulty" size="default" :disabled="isPlaying">
              <el-radio-button value="easy">
                <el-icon><Star /></el-icon>
                初级
              </el-radio-button>
              <el-radio-button value="medium">
                <el-icon><Star /><Star /></el-icon>
                中级
              </el-radio-button>
              <el-radio-button value="hard">
                <el-icon><Star /><Star /><Star /></el-icon>
                高级
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="config-item">
            <span class="config-label">词汇类别：</span>
            <el-select v-model="selectedCategory" size="default" :disabled="isPlaying" placeholder="选择类别" style="width: 180px">
              <el-option v-for="cat in categories" :key="cat.value" :label="cat.label" :value="cat.value" />
            </el-select>
          </div>
        </div>
      </div>

      <div v-if="!currentWord && !isGenerating" class="idle-section">
        <div class="idle-content">
          <div class="idle-icon">
            <el-icon :size="64" color="#e6a23c"><QuestionFilled /></el-icon>
          </div>
          <h3 class="idle-title">准备好挑战了吗？</h3>
          <p class="idle-desc">点击下方按钮，AI 将为你随机挑选一个物品，并用中文描述它的特征，你来猜对应的英文单词！</p>
          <el-button
            type="primary"
            size="large"
            :icon="MagicStick"
            @click="startNewRound"
            class="start-btn"
          >
            开始猜词
          </el-button>
        </div>
      </div>

      <div v-if="isGenerating" class="generating-section">
        <div class="generating-animation">
          <div class="generating-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
        <p class="generating-text">🤖 AI 正在精心挑选物品并撰写描述…</p>
      </div>

      <div v-if="currentWord && !isGenerating" class="game-area">
        <div class="description-section">
          <div class="desc-header">
            <el-tag size="large" :type="getDifficultyTagType(currentWord.difficulty)" effect="dark">
              {{ getDifficultyLabel(currentWord.difficulty) }}
            </el-tag>
            <el-tag size="large" type="info" effect="plain">
              {{ getCategoryLabel(currentWord.category) }}
            </el-tag>
            <el-tag size="large" type="warning" effect="plain">
              {{ currentWord.word.length }} 个字母
            </el-tag>
          </div>

          <div class="description-card">
            <div class="desc-title">
              <el-icon :size="18" color="#165DFF"><ChatDotRound /></el-icon>
              <span>AI 描述</span>
            </div>
            <div class="desc-content">
              <p v-for="(hint, idx) in currentHints" :key="idx" class="hint-item">
                <span class="hint-bullet">{{ idx + 1 }}.</span>
                {{ hint }}
              </p>
            </div>
          </div>

          <div v-if="showExtraHint" class="extra-hint">
            <el-alert
              :title="`💡 首字母提示: ${currentWord.word[0].toUpperCase()}`"
              type="info"
              show-icon
              :closable="false"
            />
          </div>
        </div>

        <div class="answer-section">
          <div class="input-label">
            <el-icon><Edit /></el-icon>
            <span>请输入对应的英文单词：</span>
          </div>
          <div class="answer-input-row">
            <el-input
              v-model="userAnswer"
              size="large"
              placeholder="Type the English word here..."
              :disabled="isAnswered"
              @keyup.enter="checkAnswer"
              class="answer-input"
            >
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
            </el-input>
            <el-button
              v-if="!isAnswered"
              type="primary"
              size="large"
              @click="checkAnswer"
              :disabled="!userAnswer.trim()"
            >
              提交答案
            </el-button>
            <el-button
              v-if="!isAnswered"
              size="large"
              @click="giveUp"
            >
              跳过
            </el-button>
            <el-button
              v-if="!isAnswered && !showExtraHint"
              size="large"
              type="warning"
              @click="revealHint"
            >
              提示 (-5分)
            </el-button>
          </div>

          <div v-if="isAnswered" class="result-section" :class="{ correct: lastResult === 'correct', wrong: lastResult === 'wrong' || lastResult === 'skipped' }">
            <div class="result-content">
              <div class="result-icon">
                {{ lastResult === 'correct' ? '🎉' : lastResult === 'skipped' ? '⏭️' : '😅' }}
              </div>
              <div class="result-info">
                <h3 class="result-title">
                  {{ lastResult === 'correct' ? '回答正确！' : lastResult === 'skipped' ? '已跳过' : '回答错误' }}
                </h3>
                <div class="correct-word-row">
                  <span class="cw-label">正确答案：</span>
                  <span class="cw-word">{{ currentWord.word }}</span>
                  <el-button size="small" type="primary" text :icon="CopyDocument" @click="copyWord(currentWord.word)">
                    复制
                  </el-button>
                </div>
                <div class="word-meaning">
                  <span class="wm-label">中文释义：</span>
                  <span class="wm-text">{{ currentWord.meaning }}</span>
                </div>
                <div class="word-mastery">
                  <span class="wm-label">掌握程度：</span>
                  <el-tag
                    :color="getMasteryColor(currentWord.word)"
                    effect="dark"
                    size="small"
                    style="border: none;"
                  >
                    {{ getMasteryLabel(currentWord.word) }}
                  </el-tag>
                  <span class="mastery-detail">
                    (答对 {{ getMastery(currentWord.word).correctCount }} 次 / 答错 {{ getMastery(currentWord.word).wrongCount }} 次)
                  </span>
                </div>
                <div v-if="currentWord.example" class="word-example">
                  <span class="we-label">例句：</span>
                  <span class="we-text">{{ currentWord.example }}</span>
                </div>
                <div v-if="lastResult === 'correct'" class="score-gain">
                  <el-tag type="success" effect="dark" size="large">+{{ lastScoreGained }} 分</el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-row" v-if="isAnswered">
          <el-button
            type="primary"
            size="large"
            :icon="RefreshRight"
            @click="startNewRound"
            class="next-btn"
          >
            下一题
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card v-if="history.length > 0" class="history-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Clock />
          </el-icon>
          <span>历史记录</span>
          <el-button size="small" text type="danger" @click="clearHistory">
            清空记录
          </el-button>
        </div>
      </template>

      <div class="history-list">
        <div
          v-for="(item, index) in displayHistory"
          :key="index"
          class="history-item"
          :class="{ correct: item.result === 'correct', wrong: item.result !== 'correct' }"
        >
          <span class="history-time">{{ formatTime(item.time) }}</span>
          <span class="history-result">
            {{ item.result === 'correct' ? '✅' : item.result === 'skipped' ? '⏭️' : '❌' }}
          </span>
          <span class="history-word">{{ item.word }}</span>
          <span class="history-meaning">{{ item.meaning }}</span>
          <el-tag v-if="item.score > 0" size="small" type="success">+{{ item.score }}</el-tag>
          <el-tag v-else size="small" type="info">{{ item.score }}</el-tag>
        </div>
      </div>
      <div v-if="history.length > 10" class="history-footer">
        <el-button text size="small" @click="showAllHistory = !showAllHistory">
          {{ showAllHistory ? '收起' : `查看全部 ${history.length} 条记录` }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  MagicStick,
  QuestionFilled,
  RefreshRight,
  Clock,
  DataLine,
  Star,
  Game,
  Edit,
  Key,
  ChatDotRound,
  CopyDocument,
  User,
  InfoFilled,
  Trophy
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface WordItem {
  word: string
  meaning: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  hints: string[]
  example?: string
  alternateHints?: string[][]
}

interface WordMastery {
  word: string
  correctCount: number
  wrongCount: number
  consecutiveCorrect: number
  masteryLevel: number
  lastAnsweredAt: number
  nextScheduledRound: number
}

interface HintUsageRecord {
  word: string
  hintSetIndex: number
  lastUsedRound: number
  useCount: number
}

interface HistoryRecord {
  word: string
  meaning: string
  result: 'correct' | 'wrong' | 'skipped'
  score: number
  time: string
}

const STORAGE_KEY = 'word_guess_game_data'

const categories = [
  { label: '全部类别', value: 'all' },
  { label: '🏠 日常生活', value: 'daily' },
  { label: '🍎 食物饮料', value: 'food' },
  { label: '🐾 动物植物', value: 'nature' },
  { label: '🚗 交通出行', value: 'transport' },
  { label: '💼 职业工具', value: 'tool' },
  { label: '🎨 艺术娱乐', value: 'entertainment' },
  { label: '⚽ 体育运动', value: 'sports' },
  { label: '👤 人体衣着', value: 'body' },
  { label: '🏫 学习办公', value: 'study' },
  { label: '🌤️ 天气地理', value: 'weather' },
  { label: '👨‍👩‍👧 情感人际', value: 'social' }
]

const wordDatabase: WordItem[] = [
  {
    word: 'umbrella',
    meaning: '雨伞',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是一个日常生活中常用的物品，通常在下雨天使用。',
      '它的形状像一个可以撑开的大蘑菇，有金属骨架和防水布料。',
      '不用的时候可以折叠起来放进包里，使用时撑开可以遮挡雨水或阳光。'
    ],
    alternateHints: [
      [
        '出门看天气预报说有雨的话，一定要记得带上它。',
        '它的手柄通常是弯钩形的，方便手拎着，有些是直柄的可以立在地上。',
        '除了挡雨，晴朗的夏天女生也常用它来遮阳防晒。'
      ],
      [
        'Mary Poppins 阿姨就是乘着它飞起来的，不过现实中它不能当降落伞用。',
        '如果风太大的话它会被吹翻成"开花"的样子，需要重新收拢再撑开。',
        '高档的它有自动开关按钮，一按就能自动撑开非常方便。'
      ]
    ],
    example: 'It is raining outside, you should take an umbrella with you.'
  },
  {
    word: 'telephone',
    meaning: '电话',
    category: 'tool',
    difficulty: 'easy',
    hints: [
      '这是一种通讯工具，让人们可以远距离交谈。',
      '它有听筒和按键，现代的版本通常是智能的，可以拍照上网。',
      '贝尔是它的发明者，它改变了人类的通讯方式。'
    ],
    example: 'Please answer the telephone, it might be important.'
  },
  {
    word: 'elephant',
    meaning: '大象',
    category: 'nature',
    difficulty: 'easy',
    hints: [
      '这是一种体型庞大的哺乳动物，生活在非洲和亚洲。',
      '它有长长的鼻子、大大的耳朵和两根白色的象牙。',
      '它是陆地上最大的动物，智商很高，有很好的记忆力。'
    ],
    example: 'The elephant is the largest land animal on Earth.'
  },
  {
    word: 'book',
    meaning: '书',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是一种由纸张和文字组成的物品，用来阅读和学习。',
      '它通常有封面、目录、章节和页码，内容可以是故事、知识或图片。',
      '图书馆里有很多它，人们通过阅读它来获取知识和乐趣。'
    ],
    alternateHints: [
      [
        'Kindle 和 iPad 可以阅读它的电子版，但很多人还是喜欢翻阅纸质的它。',
        '它是知识的载体，古人说"读万卷它，行万里路"。',
        '读完后可以把它借给朋友，或者捐赠给需要的人继续传递价值。'
      ],
      [
        '精装版的它封面硬壳、纸张好，适合收藏；平装版轻便便宜，适合日常阅读。',
        '书店里陈列着成千上万本它，按小说、历史、科技等分类摆放。',
        '"不要以封面判断它"是一句英文谚语，意思是不要以貌取人。'
      ]
    ],
    example: 'Reading a good book is a wonderful way to spend the evening.'
  },
  {
    word: 'computer',
    meaning: '电脑',
    category: 'tool',
    difficulty: 'easy',
    hints: [
      '这是一种电子设备，可以处理数据、运行程序和连接互联网。',
      '它通常有显示器、键盘、鼠标和主机，现代的有笔记本和平板等多种形态。',
      '它改变了人们的工作和生活方式，是信息时代的标志性工具。'
    ],
    alternateHints: [
      [
        '程序员每天的工作离不开它，用它来写代码、调试程序和测试软件。',
        '它的核心是CPU，相当于人的大脑负责运算，还有内存和硬盘存储数据。',
        '病毒和木马是专门破坏它的恶意程序，所以需要安装杀毒软件防护。'
      ],
      [
        'Apple 的 Mac 和普通 PC 是它的两大阵营，各自有不同的操作系统和用户群体。',
        '游戏玩家会为它配置高性能显卡和大内存，以流畅运行3A游戏大作。',
        '长时间使用它需要注意用眼健康，每隔一小时应该休息一下看看远方。'
      ]
    ],
    example: 'I use my computer to work and browse the internet every day.'
  },
  {
    word: 'bicycle',
    meaning: '自行车',
    category: 'transport',
    difficulty: 'easy',
    hints: [
      '这是一种两轮交通工具，靠人力驱动，环保又健身。',
      '它有车架、车轮、脚踏板、链条和刹车，骑行时需要保持平衡。',
      '它是很多学生上学的代步工具，也是一种流行的运动器材。'
    ],
    alternateHints: [
      [
        '中国曾被称为"它的王国"，上世纪八九十年代大街小巷到处都是它的身影。',
        '共享单车让它重新流行起来，扫码解锁、随停随放非常方便。',
        '专业的公路赛车它重量很轻，速度可以达到每小时四五十公里。'
      ],
      [
        '骑行它时一定要佩戴头盔保护头部，夜晚最好装警示灯提高可见性。',
        '环法是世界上最著名的它的赛事，选手需要连续骑行三周翻越山脉。',
        '小孩子学习骑它时通常先装辅助轮，熟练后再拆掉学会保持平衡。'
      ]
    ],
    example: 'He rides his bicycle to school every day to save money and stay fit.'
  },
  {
    word: 'orange',
    meaning: '橙子',
    category: 'food',
    difficulty: 'easy',
    hints: [
      '这是一种水果，名字和它的颜色是同一个英文单词。',
      '它的外皮是橙色的，内部是多汁的瓣状果肉，富含维生素C。',
      '它常被用来榨汁，是一种很受欢迎的健康水果。'
    ],
    alternateHints: [
      [
        '剥开它的果皮时会散发出清新的香气，它的皮晒干后也可以用来泡茶。',
        '它和橘子、柚子、柠檬是亲戚，都属于柑橘类水果。',
        '佛罗里达和加利福尼亚是美国最著名的它的产地。'
      ]
    ],
    example: 'I drink a glass of orange juice every morning for breakfast.'
  },
  {
    word: 'piano',
    meaning: '钢琴',
    category: 'entertainment',
    difficulty: 'easy',
    hints: [
      '这是一种键盘乐器，被称为乐器之王。',
      '它有黑白相间的琴键，通过敲击琴弦发声，音域非常宽广。',
      '贝多芬、肖邦、莫扎特等音乐大师都为它创作了无数经典作品。'
    ],
    alternateHints: [
      [
        '它的名字在意大利语中是"强弱"的意思，因为它可以演奏出从极弱到极强的音量变化。',
        '它有88个琴键，其中52个白键和36个黑键，按十二平均律排列。',
        '立式它占用空间小适合家庭，三角它声音更好常用于音乐厅演奏。'
      ]
    ],
    example: 'She has been playing the piano since she was five years old.'
  },
  {
    word: 'hospital',
    meaning: '医院',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是一个公共场所，人们生病或受伤时会去那里看病。',
      '里面有医生、护士、病床和各种医疗设备，通常有白色的标志和十字符号。',
      '它是保障人们健康的重要基础设施，急诊部门24小时营业。'
    ],
    alternateHints: [
      [
        '去它那里看病通常先挂号，然后去对应科室门诊就诊，严重的需要住院治疗。',
        '它的消毒水味道很有辨识度，很多人小时候都害怕去那里打针。',
        '它里住院的病人需要家属陪护，探视时间通常有严格规定。'
      ]
    ],
    example: 'If you feel very sick, you should go to the hospital immediately.'
  },
  {
    word: 'airplane',
    meaning: '飞机',
    category: 'transport',
    difficulty: 'easy',
    hints: [
      '这是一种能够在空中飞行的交通工具，速度非常快。',
      '它有机翼、引擎、机身和尾翼，可以搭载大量乘客和货物。',
      '莱特兄弟是它的发明者，它让长途旅行变得快捷方便。'
    ],
    alternateHints: [
      [
        '乘坐它出行需要提前去机场值机、过安检、候机，然后登机。',
        '起飞和降落时耳朵会感到不适，咀嚼口香糖可以缓解这种气压变化带来的耳鸣。',
        '黑匣子是它上最重要的记录设备，事故后可以通过它分析原因。'
      ]
    ],
    example: 'We are going to take an airplane to visit our grandparents next week.'
  },
  {
    word: 'chocolate',
    meaning: '巧克力',
    category: 'food',
    difficulty: 'easy',
    hints: [
      '这是一种甜食，通常是棕色的，由可可豆制成。',
      '它有很多形态：块状、液态、粉状，可以做成糖果、蛋糕、饮料等。',
      '情人节时它是很受欢迎的礼物，据说吃了它会让人心情变好。'
    ],
    alternateHints: [
      [
        '它按可可含量分为黑它、牛奶它、白它，可可含量越高越苦也越健康。',
        '瑞士和比利时是世界上最有名的它的生产国，它的工艺精湛品质顶级。',
        '热它是冬天很受欢迎的饮品，加热牛奶冲调后喝下去全身都暖暖的。'
      ]
    ],
    example: 'My favorite dessert is chocolate cake with vanilla ice cream.'
  },
  {
    word: 'dictionary',
    meaning: '词典',
    category: 'tool',
    difficulty: 'medium',
    hints: [
      '这是一本工具书，用来查找单词的含义、拼写和用法。',
      '里面的单词按字母顺序排列，每个单词都有详细的解释和例句。',
      '学习语言时它是非常重要的助手，现在也有电子和在线版本。'
    ],
    example: 'If you encounter a new word, look it up in the dictionary.'
  },
  {
    word: 'butterfly',
    meaning: '蝴蝶',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是一种美丽的昆虫，有色彩斑斓的翅膀。',
      '它的一生要经历卵、幼虫、蛹和成虫四个阶段，这个过程叫做完全变态发育。',
      '它喜欢在花丛中飞舞，帮助花朵传播花粉，是大自然的精灵。'
    ],
    example: 'The colorful butterfly fluttered from flower to flower in the garden.'
  },
  {
    word: 'volcano',
    meaning: '火山',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是一种地质地貌，是地球内部岩浆喷出地表形成的山体。',
      '它喷发时会喷出熔岩、火山灰和有毒气体，非常壮观但也很危险。',
      '日本的富士山和意大利的维苏威山都是著名的这种地貌。'
    ],
    example: 'The volcano erupted and covered the entire city in ash.'
  },
  {
    word: 'sunglasses',
    meaning: '太阳镜',
    category: 'daily',
    difficulty: 'medium',
    hints: [
      '这是一种戴在眼睛上的物品，通常在晴天户外使用。',
      '它的镜片是深色的，可以阻挡强烈的阳光和紫外线，保护眼睛。',
      '它也是一种时尚配饰，很多明星和潮人喜欢佩戴它。'
    ],
    example: 'Don\'t forget to wear your sunglasses, the sun is very bright today.'
  },
  {
    word: 'refrigerator',
    meaning: '冰箱',
    category: 'daily',
    difficulty: 'medium',
    hints: [
      '这是一种家用电器，用来保存食物，防止它们变质。',
      '它的内部温度很低，可以抑制细菌生长，通常有冷藏室和冷冻室两个部分。',
      '它几乎是每个家庭厨房必备的电器，可以延长食物的保鲜时间。'
    ],
    example: 'Please put the milk in the refrigerator so it doesn\'t go bad.'
  },
  {
    word: 'photograph',
    meaning: '照片',
    category: 'entertainment',
    difficulty: 'medium',
    hints: [
      '这是用相机拍摄下来的图像，可以记录美好瞬间。',
      '它可以是打印出来的实体，也可以是存在手机或电脑里的数字文件。',
      '人们用它来记录旅行、生日、婚礼等重要时刻，保存珍贵的回忆。'
    ],
    example: 'This photograph was taken during our trip to Paris last summer.'
  },
  {
    word: 'basketball',
    meaning: '篮球',
    category: 'sports',
    difficulty: 'easy',
    hints: [
      '这是一项流行的球类运动，也是这种运动使用的球的名称。',
      '比赛时两队各五人，目标是把球投入对方的篮筐中得分。',
      'NBA是世界上最高水平的这种运动职业联赛，乔丹、科比、詹姆斯都是这项运动的传奇球星。'
    ],
    example: 'Playing basketball is my favorite way to exercise after school.'
  },
  {
    word: 'scissors',
    meaning: '剪刀',
    category: 'tool',
    difficulty: 'medium',
    hints: [
      '这是一种工具，有两个交叉的刀刃和两个环形把手，用来剪切东西。',
      '它可以剪纸、布料、头发、绳子等，理发师、裁缝和学生都会用到它。',
      '使用它时要注意安全，儿童使用需要在大人的监护下进行。'
    ],
    example: 'Could you pass me the scissors? I need to cut this piece of paper.'
  },
  {
    word: 'mountain',
    meaning: '山',
    category: 'nature',
    difficulty: 'easy',
    hints: [
      '这是一种自然地貌，是地面上高耸凸起的巨大地形。',
      '它通常由岩石和土壤组成，海拔很高，顶部可能会有积雪。',
      '珠穆朗玛峰是世界上最高的这种地貌，登山是一种挑战极限的运动。'
    ],
    example: 'We plan to climb the mountain this weekend if the weather is nice.'
  },
  {
    word: 'sandwich',
    meaning: '三明治',
    category: 'food',
    difficulty: 'easy',
    hints: [
      '这是一种便捷的食物，通常由两片面包夹着馅料制成。',
      '馅料可以是火腿、奶酪、蔬菜、鸡蛋、金枪鱼等，搭配非常灵活。',
      '它是西方人常吃的午餐食物，方便携带，适合野餐和工作餐。'
    ],
    example: 'I made a ham and cheese sandwich for lunch today.'
  },
  {
    word: 'newspaper',
    meaning: '报纸',
    category: 'daily',
    difficulty: 'medium',
    hints: [
      '这是一种印刷出版物，通常每日或每周发行，刊载新闻和信息。',
      '它上面有国内外新闻、财经、体育、娱乐等多个板块，还有广告。',
      '虽然现在网络发达，但仍有很多人喜欢阅读它来了解时事。'
    ],
    example: 'My grandfather reads the newspaper every morning over breakfast.'
  },
  {
    word: 'guitar',
    meaning: '吉他',
    category: 'entertainment',
    difficulty: 'medium',
    hints: [
      '这是一种弦乐器，有六根弦，用手指拨弹发声。',
      '它有木制的共鸣箱和长长的琴颈，流行音乐、民谣、摇滚中都经常使用它。',
      '它是很多年轻人喜欢学习的乐器，自弹自唱非常浪漫。'
    ],
    example: 'He plays the guitar in a band and performs at local bars on weekends.'
  },
  {
    word: 'submarine',
    meaning: '潜水艇',
    category: 'transport',
    difficulty: 'hard',
    hints: [
      '这是一种能够在水下航行的船只，是海军的重要装备。',
      '它可以潜入深海中执行任务，有潜望镜可以观察水面情况，使用声呐探测目标。',
      '核动力的这种船只可以在水下航行数月而不需要浮出水面。'
    ],
    example: 'The submarine can dive to a depth of hundreds of meters below the sea surface.'
  },
  {
    word: 'telescope',
    meaning: '望远镜',
    category: 'tool',
    difficulty: 'hard',
    hints: [
      '这是一种光学仪器，用来观察远处的物体，尤其是天体。',
      '它通过透镜或反射镜聚集光线，使人能看清肉眼看不到的远处景象。',
      '伽利略用它首次观测到了木星的卫星，哈勃是著名的太空这种仪器。'
    ],
    example: 'We used a telescope to observe the planets and stars in the night sky.'
  },
  {
    word: 'crocodile',
    meaning: '鳄鱼',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是一种大型爬行动物，生活在热带地区的河流和沼泽中。',
      '它有坚硬的鳞片、锋利的牙齿和强有力的尾巴，是凶猛的肉食性动物。',
      '它是恐龙时代就存在的古老物种，在水中伏击猎物非常擅长。'
    ],
    example: 'The crocodile silently approached the unsuspecting deer at the waterhole.'
  },
  {
    word: 'microphone',
    meaning: '麦克风',
    category: 'tool',
    difficulty: 'medium',
    hints: [
      '这是一种电子设备，用来把声音转换成电信号，放大或记录声音。',
      '歌手演唱、演讲者演讲、主播直播时都会使用它，让声音传得更远更清晰。',
      '它的英文缩写是mic，录音棚里会使用专业的电容式这种设备。'
    ],
    example: 'Could you speak closer to the microphone so everyone can hear you?'
  },
  {
    word: 'penguin',
    meaning: '企鹅',
    category: 'nature',
    difficulty: 'easy',
    hints: [
      '这是一种不会飞的鸟类，主要生活在南极等寒冷地区。',
      '它的身体是黑白两色的，像穿着燕尾服，走起路来摇摇摆摆很可爱。',
      '虽然不会飞，但它是游泳高手，可以在海中快速游动捕鱼。'
    ],
    example: 'The penguins waddled across the ice to reach the cold ocean water.'
  },
  {
    word: 'tornado',
    meaning: '龙卷风',
    category: 'nature',
    difficulty: 'hard',
    hints: [
      '这是一种强烈的气象灾害，是高速旋转的空气柱。',
      '它通常形成于强烈的雷暴云中，形状像一个漏斗，中心气压极低，风力极大。',
      '美国中部平原是它的高发地区，被称为"它的走廊"。'
    ],
    example: 'The tornado destroyed several houses and caused widespread damage.'
  },
  {
    word: 'waterfall',
    meaning: '瀑布',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是一种自然景观，是河流从悬崖或高处垂直倾泻而下形成的水流。',
      '它通常非常壮观，声音轰鸣，水雾弥漫，是很受欢迎的旅游景点。',
      '尼亚加拉大瀑布和黄果树都是世界著名的这种景观。'
    ],
    example: 'We stood in awe at the base of the magnificent waterfall.'
  },
  {
    word: 'thermometer',
    meaning: '温度计',
    category: 'tool',
    difficulty: 'hard',
    hints: [
      '这是一种测量温度的仪器。',
      '传统的里面装有水银或酒精，温度变化时液柱会升降，对应刻度显示温度。',
      '现代有电子的、红外的等多种类型，发烧时会用它测量体温。'
    ],
    example: 'The nurse used a thermometer to check if the child had a fever.'
  },
  {
    word: 'hamburger',
    meaning: '汉堡包',
    category: 'food',
    difficulty: 'easy',
    hints: [
      '这是一种西式快餐食品，名字来源于德国的一个城市。',
      '它通常由圆面包夹着牛肉饼、生菜、番茄、奶酪和各种酱料制成。',
      '麦当劳和肯德基是卖这种食物的著名连锁餐厅。'
    ],
    example: 'I ordered a hamburger, fries, and a cola for lunch at the fast food restaurant.'
  },
  {
    word: 'helicopter',
    meaning: '直升机',
    category: 'transport',
    difficulty: 'hard',
    hints: [
      '这是一种能够垂直起降的飞行器，顶部有巨大的旋转旋翼。',
      '它不需要跑道，可以在空中悬停、前后左右飞行，非常灵活。',
      '它常用于救援、巡逻、观光和运输，在城市高楼间也能起降。'
    ],
    example: 'The helicopter flew over the city, providing an aerial view of the skyline.'
  },
  {
    word: 'strawberry',
    meaning: '草莓',
    category: 'food',
    difficulty: 'medium',
    hints: [
      '这是一种红色的小水果，表面有很多小籽。',
      '它味道酸甜可口，通常生长在低矮的植株上，春天是它的成熟季节。',
      '它常被用来做蛋糕、冰淇淋、果酱和奶昔，是很受欢迎的水果。'
    ],
    example: 'She made a delicious strawberry pie with fresh berries from the garden.'
  },
  {
    word: 'dolphin',
    meaning: '海豚',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是一种聪明的海洋哺乳动物，不是鱼类。',
      '它用肺呼吸，胎生，有流线型的身体和背鳍，在水中游泳速度很快。',
      '它的智商很高，能进行复杂的交流，喜欢在船只前方的浪花中跳跃。'
    ],
    example: 'We were lucky to see a pod of dolphins swimming alongside our boat.'
  },
  {
    word: 'badminton',
    meaning: '羽毛球',
    category: 'sports',
    difficulty: 'medium',
    hints: [
      '这是一项隔网对打的球类运动，球是由羽毛和软木塞制成的。',
      '比赛在长方形场地上进行，双方用球拍将球击过网，落在对方场地得分。',
      '中国在这项运动上非常有优势，林丹是这项运动的传奇运动员。'
    ],
    example: 'My friends and I play badminton at the sports center every Sunday.'
  },
  {
    word: 'cucumber',
    meaning: '黄瓜',
    category: 'food',
    difficulty: 'medium',
    hints: [
      '这是一种常见的蔬菜，通常是长条形的，外皮绿色，内部浅绿色多汁。',
      '它口感脆嫩，可以生吃、凉拌、炒菜，也常用于美容敷脸。',
      '它含水量很高，热量低，是减肥餐的好选择。'
    ],
    example: 'I like to add sliced cucumber to my salad for extra crunch.'
  },
  {
    word: 'backpack',
    meaning: '背包',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是一种背在背上的袋子，有两条肩带，方便携带物品。',
      '学生上学用它装书本，旅行者用它装行李，登山者用专业的它装装备。',
      '它解放了双手，是出行和上学的必备用品。'
    ],
    example: 'Don\'t forget to pack your textbooks in your backpack before school.'
  },
  {
    word: 'keyboard',
    meaning: '键盘',
    category: 'tool',
    difficulty: 'easy',
    hints: [
      '这是电脑的输入设备，上面有很多按键，包括字母、数字和功能键。',
      '人们通过敲击它的按键来输入文字、执行命令和玩游戏。',
      '标准的这种设备叫QWERTY布局，钢琴也有类似布局的黑白键。'
    ],
    example: 'I practice typing on the keyboard every day to improve my speed.'
  },
  {
    word: 'rainbow',
    meaning: '彩虹',
    category: 'nature',
    difficulty: 'easy',
    hints: [
      '这是雨后天空中出现的一种光学现象，由七种颜色组成弧形。',
      '它的颜色顺序是红橙黄绿蓝靛紫，是阳光经过水滴折射和反射形成的。',
      '在神话和童话中，它的尽头藏着宝藏，是希望和美好的象征。'
    ],
    example: 'After the storm, a beautiful rainbow appeared across the sky.'
  },
  {
    word: 'violin',
    meaning: '小提琴',
    category: 'entertainment',
    difficulty: 'medium',
    hints: [
      '这是一种弓弦乐器，有四根弦，用琴弓拉奏发声。',
      '它是管弦乐队中的重要乐器，音域宽广，表现力丰富，被称为乐器之后。',
      '帕格尼尼是演奏它的传奇大师，学习它通常需要从儿童时期开始。'
    ],
    example: 'She practices the violin for two hours every day to prepare for the concert.'
  },
  {
    word: 'calendar',
    meaning: '日历',
    category: 'tool',
    difficulty: 'medium',
    hints: [
      '这是一种用来记录和查看日期的工具或系统。',
      '它上面显示年月日、星期、节气和节假日，可以帮人们安排日程。',
      '现在有纸质的、电脑和手机上的电子版本，方便人们查看日期和规划时间。'
    ],
    example: 'I checked the calendar to see what day of the week Christmas falls on this year.'
  },
  {
    word: 'candle',
    meaning: '蜡烛',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是一种古老的照明物品，由蜡和烛芯制成。',
      '点燃烛芯后它会燃烧发光，停电时、生日许愿时、浪漫晚餐时都会用到它。',
      '它有各种颜色和香味，生日蛋糕上会插它来代表年龄。'
    ],
    example: 'We lit candles on the birthday cake and made a wish before blowing them out.'
  },
  {
    word: 'camel',
    meaning: '骆驼',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是一种生活在沙漠地区的哺乳动物，背上有一个或两个驼峰。',
      '它可以在没有水的情况下存活很多天，被称为沙漠之舟。',
      '它的驼峰储存脂肪而不是水，宽大的脚掌适合在沙漠中行走。'
    ],
    example: 'The camel carried our supplies across the hot desert for several days.'
  },
  {
    word: 'magazine',
    meaning: '杂志',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是一种定期出版的印刷读物，内容比报纸更丰富深入。',
      '它通常是周刊或月刊，有特定的主题，如时尚、科技、财经、体育等。',
      '它的印刷和纸张质量通常比报纸好，有精美的图片和深度报道。'
    ],
    example: 'I subscribe to a fashion magazine to keep up with the latest trends.'
  },
  {
    word: 'telescope',
    meaning: '望远镜',
    category: 'tool',
    difficulty: 'hard',
    hints: [
      '这是一种光学仪器，用来观察远处的物体，尤其是天体。',
      '它通过透镜或反射镜聚集光线，使人能看清肉眼看不到的远处景象。',
      '伽利略用它首次观测到了木星的卫星，哈勃是著名的太空这种仪器。'
    ],
    example: 'We used a telescope to observe the planets and stars in the night sky.'
  },
  {
    word: 'sunflower',
    meaning: '向日葵',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是一种高大的植物，花盘很大，颜色是金黄色的。',
      '它的名字来源于它的花会随着太阳转动，始终朝向阳光的方向。',
      '它的种子可以食用，也可以用来榨油，是一种很有价值的农作物。'
    ],
    example: 'The field of sunflowers looked beautiful under the bright summer sun.'
  },
  {
    word: 'television',
    meaning: '电视',
    category: 'entertainment',
    difficulty: 'easy',
    hints: [
      '这是一种家用电器，可以接收信号并显示图像和声音。',
      '人们可以用它看新闻、电视剧、电影、体育比赛等各种节目。',
      '它从黑白发展到彩色，从显像管发展到液晶和智能，几乎每家每户都有它。'
    ],
    example: 'The whole family gathered in the living room to watch television together.'
  },
  {
    word: 'luggage',
    meaning: '行李',
    category: 'daily',
    difficulty: 'medium',
    hints: [
      '这是旅行时装衣物和随身物品的容器的总称。',
      '它包括行李箱、旅行包、拉杆箱等，有硬壳和软壳两种主要类型。',
      '坐飞机时它需要托运或随身携带，航空公司对它的重量和尺寸有限制。'
    ],
    example: 'Please make sure all your luggage has your name and address on it.'
  },
  {
    word: 'octopus',
    meaning: '章鱼',
    category: 'nature',
    difficulty: 'hard',
    hints: [
      '这是一种生活在海洋中的软体动物，有八条长长的触手。',
      '它的触手上有很多吸盘，可以帮助它捕捉猎物和移动，还能喷出墨汁迷惑敌人。',
      '它是无脊椎动物中最聪明的之一，能够打开罐子、解决简单的问题。'
    ],
    example: 'The octopus quickly changed color to camouflage itself among the coral reef.'
  },
  {
    word: 'battery',
    meaning: '电池',
    category: 'tool',
    difficulty: 'easy',
    hints: [
      '这是一种将化学能转化为电能的装置，给各种电器供电。',
      '它有不同的型号，如AA、AAA、9V等，遥控器、手电筒、玩具都需要它。',
      '用完的它属于有害垃圾，需要专门回收处理，不能随便丢弃。'
    ],
    example: 'The remote control isn\'t working, I think the batteries need to be replaced.'
  },
  {
    word: 'volleyball',
    meaning: '排球',
    category: 'sports',
    difficulty: 'easy',
    hints: [
      '这是一项球类运动，也是这种运动用的球的名称。',
      '比赛时两队各六人隔网对打，目标是用手把球击入对方场地，球不能落地。',
      '中国女排在这项运动中取得过辉煌的成绩，多次获得世界冠军。'
    ],
    example: 'Our school volleyball team won the championship at the regional competition.'
  },
  {
    word: 'pineapple',
    meaning: '菠萝',
    category: 'food',
    difficulty: 'medium',
    hints: [
      '这是一种热带水果，外皮粗糙，有尖刺，顶部有一簇叶子像皇冠。',
      '它的果肉是黄色的，酸甜多汁，含有特殊的酶可以分解蛋白质。',
      '它原产于南美洲，是夏威夷的代表性水果之一。'
    ],
    example: 'I like to put fresh pineapple on my pizza, it adds a sweet and tangy flavor.'
  },
  {
    word: 'trophy',
    meaning: '奖杯',
    category: 'entertainment',
    difficulty: 'medium',
    hints: [
      '这是一种奖品，通常授予比赛或竞赛的获胜者。',
      '它通常由金属制成，有杯状或人物雕像等形状，底座上刻有获奖信息。',
      '获得它是对个人或团队成就的认可，是荣誉的象征。'
    ],
    example: 'The team proudly lifted the championship trophy after winning the final game.'
  },
  {
    word: 'ambulance',
    meaning: '救护车',
    category: 'transport',
    difficulty: 'medium',
    hints: [
      '这是一种特殊的车辆，用于运送病人或伤员去医院。',
      '它的车身通常是白色的，带有红色十字标志和闪烁的灯光，行驶时会发出特殊的警报声。',
      '其他车辆在路上遇到它时应该主动避让，让它优先通行以拯救生命。'
    ],
    example: 'When someone has a serious medical emergency, you should call an ambulance immediately.'
  },
  {
    word: 'laundry',
    meaning: '洗衣',
    category: 'daily',
    difficulty: 'medium',
    hints: [
      '这个词既指需要洗的脏衣服，也指洗衣服这件事或洗衣店。',
      '家用洗衣机可以做这件事，也可以送到专门的店铺去做。',
      '需要把不同颜色的衣物分开洗，避免染色，是日常家务之一。'
    ],
    example: 'It\'s my turn to do the laundry this weekend, I have a lot of dirty clothes.'
  },
  {
    word: 'dinosaur',
    meaning: '恐龙',
    category: 'nature',
    difficulty: 'easy',
    hints: [
      '这是一种已经灭绝的古代爬行动物，生活在数百万年前的中生代。',
      '它们的种类很多，有草食的也有肉食的，体型差异巨大，从鸡大小到几十米长都有。',
      '霸王龙、三角龙、梁龙都是著名的这种动物，它们的化石在世界各地都有发现。'
    ],
    example: 'Children are fascinated by dinosaurs and love to visit museums to see their fossils.'
  },
  {
    word: 'shoulder',
    meaning: '肩膀',
    category: 'body',
    difficulty: 'easy',
    hints: [
      '这是人体的一部分，位于脖子和手臂之间，连接躯干和上肢。',
      '它是人体最灵活的关节之一，可以做大幅度旋转运动，背书包时书包带会放在上面。',
      '人们难过时会拍拍这个部位给予安慰，扛重物也常用到它。'
    ],
    example: 'He put his arm around her shoulder to comfort her.'
  },
  {
    word: 'finger',
    meaning: '手指',
    category: 'body',
    difficulty: 'easy',
    hints: [
      '这是人体手部的五个细长部分，每只手有五个。',
      '它们可以灵活弯曲，用来抓握东西、打字、弹钢琴等，指甲长在它们的末端。',
      '大拇指是其中最特别的一个，可以和其他四个对握。'
    ],
    example: 'She cut her finger while chopping vegetables in the kitchen.'
  },
  {
    word: 'eyebrow',
    meaning: '眉毛',
    category: 'body',
    difficulty: 'medium',
    hints: [
      '这是长在眼睛上方的一道弧形毛发。',
      '它可以阻挡汗水和灰尘流入眼睛，也是面部表情的重要组成部分。',
      '人们会修它、画它，惊讶时会抬高它，疑惑时会皱起它。'
    ],
    example: 'She raised an eyebrow when she heard the surprising news.'
  },
  {
    word: 'tongue',
    meaning: '舌头',
    category: 'body',
    difficulty: 'medium',
    hints: [
      '这是口腔内的肌肉器官，对说话和品尝味道非常重要。',
      '它可以感受甜、酸、苦、辣、咸五种味道，也能帮助搅拌食物和发音。',
      '医生看病时常让你伸出它来看看，它也是人体最强壮的肌肉之一。'
    ],
    example: 'The doctor asked the patient to stick out his tongue.'
  },
  {
    word: 'wrist',
    meaning: '手腕',
    category: 'body',
    difficulty: 'medium',
    hints: [
      '这是连接手掌和前臂的关节部位。',
      '手表通常戴在这个部位，手链和手镯也戴在这里。',
      '扭伤它会影响手的活动，长时间打字可能导致这个部位酸痛。'
    ],
    example: 'He wears an expensive watch on his left wrist.'
  },
  {
    word: 'jacket',
    meaning: '夹克',
    category: 'body',
    difficulty: 'easy',
    hints: [
      '这是一种穿在上身的外套，通常有长袖和前开扣。',
      '它比外套轻薄，适合春秋季节穿着，有牛仔、皮、运动等多种款式。',
      '上学、上班、休闲场合都可以穿，是衣橱必备单品。'
    ],
    example: 'It\'s getting cold, you should put on a jacket before going out.'
  },
  {
    word: 'necklace',
    meaning: '项链',
    category: 'body',
    difficulty: 'medium',
    hints: [
      '这是一种戴在脖子上的首饰。',
      '它通常由链条和吊坠组成，材质可以是金、银、珍珠、宝石等。',
      '赠送它是表达爱意的常见方式，婚纱搭配钻石它非常华丽。'
    ],
    example: 'He gave her a diamond necklace for their wedding anniversary.'
  },
  {
    word: 'sneakers',
    meaning: '运动鞋',
    category: 'body',
    difficulty: 'easy',
    hints: [
      '这是一种专为运动设计的鞋子，也常日常穿着。',
      '它的鞋底柔软有弹性，能缓冲跑步时对膝盖的冲击，鞋面通常透气舒适。',
      '年轻人很喜欢收集限量版的它，Nike、Adidas是知名品牌。'
    ],
    example: 'I need to buy a new pair of sneakers for my morning runs.'
  },
  {
    word: 'pocket',
    meaning: '口袋',
    category: 'body',
    difficulty: 'easy',
    hints: [
      '这是衣服上缝制的小袋子，可以用来装东西。',
      '裤子、外套、衬衫上都可能有它，手机、钱包、钥匙常放在里面。',
      '伸手掏它找东西是很常见的动作，小偷也会偷别人它里的东西。'
    ],
    example: 'He reached into his pocket and pulled out a coin.'
  },
  {
    word: 'gloves',
    meaning: '手套',
    category: 'body',
    difficulty: 'easy',
    hints: [
      '这是戴在手上的物品，用来保暖、保护或装饰。',
      '冬天出门会戴它保暖，医生做手术会戴无菌它，拳击手也戴特制的它。',
      '它有五个指头分开的款式，也有只有拇指分开的连指款式。'
    ],
    example: 'You should wear gloves when it\'s snowing outside.'
  },
  {
    word: 'textbook',
    meaning: '教科书',
    category: 'study',
    difficulty: 'easy',
    hints: [
      '这是学生上课使用的正式书籍，按教学大纲编写。',
      '每门课程通常对应一本，上面有知识点、例题和练习题。',
      '开学时学校会发放或要求购买，毕业时很多它被二手卖掉或捐赠。'
    ],
    example: 'Please open your textbooks to page 45 for today\'s lesson.'
  },
  {
    word: 'notebook',
    meaning: '笔记本',
    category: 'study',
    difficulty: 'easy',
    hints: [
      '这是由多张纸装订在一起组成的本子，用来写字记录。',
      '学生上课用它记笔记，上班族开会用它写纪要，作家也用它记录灵感。',
      '它有不同的尺寸和封面设计，横线、空白、网格内页可供选择。'
    ],
    example: 'She always carries a small notebook to jot down ideas.'
  },
  {
    word: 'eraser',
    meaning: '橡皮',
    category: 'study',
    difficulty: 'easy',
    hints: [
      '这是用来擦除铅笔字迹的文具。',
      '它通常是长方形的小块，由橡胶制成，有各种颜色和香味。',
      '学生考试时必备它，绘图时也需要它来修正错误。'
    ],
    example: 'I need an eraser to correct this mistake on my drawing.'
  },
  {
    word: 'chalk',
    meaning: '粉笔',
    category: 'study',
    difficulty: 'easy',
    hints: [
      '这是老师在黑板上写字用的工具。',
      '它通常是白色长条形，也有彩色的，由石灰石或石膏制成。',
      '书写时会产生灰尘，现在很多教室改用白板和马克笔代替它和黑板。'
    ],
    example: 'The teacher picked up a piece of chalk and wrote on the blackboard.'
  },
  {
    word: 'stapler',
    meaning: '订书机',
    category: 'study',
    difficulty: 'medium',
    hints: [
      '这是一种办公文具，用来把多张纸固定在一起。',
      '它使用U形的订书钉，按压即可穿透并弯折钉住纸张，是文件整理的好帮手。',
      '办公室里它是必备品，学生装订作业报告也会用到。'
    ],
    example: 'Could you pass me the stapler? I need to fasten these documents together.'
  },
  {
    word: 'calculator',
    meaning: '计算器',
    category: 'study',
    difficulty: 'medium',
    hints: [
      '这是一种进行数学运算的电子设备。',
      '它可以做加减乘除、开方、百分比等运算，学生考试时允许使用科学型的它。',
      '现在手机里都内置了它的功能，但独立设备在课堂和财务工作中仍常用。'
    ],
    example: 'Use a calculator to solve these complex math problems.'
  },
  {
    word: 'diploma',
    meaning: '毕业证书',
    category: 'study',
    difficulty: 'hard',
    hints: [
      '这是学生完成学业后学校颁发的正式证明文件。',
      '上面印有学校名称、学生姓名、专业和毕业时间，通常有校长签名和公章。',
      '找工作时常需要出示它的复印件，它是学历的官方凭证。'
    ],
    example: 'She proudly displayed her university diploma on the wall.'
  },
  {
    word: 'scholarship',
    meaning: '奖学金',
    category: 'study',
    difficulty: 'hard',
    hints: [
      '这是学校或机构为优秀学生提供的经济资助。',
      '它通常基于学业成绩、特长或经济需要发放，可以覆盖部分或全部学费。',
      '获得它是一种荣誉，很多学生努力学习来争取它。'
    ],
    example: 'He was awarded a full scholarship to study at Harvard University.'
  },
  {
    word: 'printer',
    meaning: '打印机',
    category: 'study',
    difficulty: 'medium',
    hints: [
      '这是一种把电脑中的文字和图像输出到纸张上的设备。',
      '它有喷墨和激光两种常见类型，可以打印黑白或彩色文件。',
      '办公室和学生宿舍常见它，打印作业、合同、照片都需要它。'
    ],
    example: 'The printer is out of paper, could you refill it please?'
  },
  {
    word: 'semester',
    meaning: '学期',
    category: 'study',
    difficulty: 'medium',
    hints: [
      '这是学校划分的教学时间段。',
      '一学年通常分为两个，每个大约15-20周，结束时有期末考试。',
      '秋季和春季各有一个，有些学校还有夏季短的它。'
    ],
    example: 'This semester I\'m taking five courses, including English and math.'
  },
  {
    word: 'lightning',
    meaning: '闪电',
    category: 'weather',
    difficulty: 'medium',
    hints: [
      '这是雷雨天出现的强烈放电现象，会发出耀眼的光。',
      '它的温度比太阳表面还高，出现后很快会听到雷声，因为光比声音传播快。',
      '看到它时应该待在室内，避免在树下或空旷处停留，很危险。'
    ],
    example: 'A flash of lightning lit up the dark sky during the storm.'
  },
  {
    word: 'thunder',
    meaning: '雷声',
    category: 'weather',
    difficulty: 'easy',
    hints: [
      '这是闪电过后听到的巨大轰鸣声。',
      '它由闪电加热空气迅速膨胀产生，距离越远听起来越沉闷。',
      '小孩子常害怕它的声音，会捂住耳朵躲进被窝。'
    ],
    example: 'The loud thunder scared the little dog and it hid under the bed.'
  },
  {
    word: 'blizzard',
    meaning: '暴风雪',
    category: 'weather',
    difficulty: 'hard',
    hints: [
      '这是一种极端恶劣的冬季天气，伴有强风、大雪和低温。',
      '它发生时能见度极低，交通会瘫痪，政府通常会发布预警让人们待在家中。',
      '北美和俄罗斯的冬天偶尔会遭受它的袭击。'
    ],
    example: 'The blizzard closed all highways and left thousands without electricity.'
  },
  {
    word: 'drought',
    meaning: '干旱',
    category: 'weather',
    difficulty: 'hard',
    hints: [
      '这是长期缺乏降雨导致的自然灾害。',
      '它会使土地干裂、农作物枯死、水源枯竭，严重影响农业和生活用水。',
      '非洲之角地区经常遭受它的影响，导致饥荒和移民。'
    ],
    example: 'The severe drought has caused widespread crop failures in the region.'
  },
  {
    word: 'rainbow',
    meaning: '彩虹',
    category: 'weather',
    difficulty: 'easy',
    hints: [
      '这是雨后天空中出现的一种光学现象，由七种颜色组成弧形。',
      '它的颜色顺序是红橙黄绿蓝靛紫，是阳光经过水滴折射和反射形成的。',
      '在神话和童话中，它的尽头藏着宝藏，是希望和美好的象征。'
    ],
    example: 'After the storm, a beautiful rainbow appeared across the sky.'
  },
  {
    word: 'latitude',
    meaning: '纬度',
    category: 'weather',
    difficulty: 'hard',
    hints: [
      '这是地球表面某点距离赤道南北的度数，与经度对应。',
      '赤道是0度，南北极是90度，它决定了一个地区的气候带。',
      '高它的地区更寒冷，低它的地区更炎热，地图上的横线就是它。'
    ],
    example: 'Beijing is located at approximately 40 degrees north latitude.'
  },
  {
    word: 'equator',
    meaning: '赤道',
    category: 'weather',
    difficulty: 'medium',
    hints: [
      '这是地球表面最长的纬线，把地球分为南北两个半球。',
      '它的纬度是0度，穿过非洲、南美洲和东南亚，这里全年高温多雨。',
      '在它线上的国家没有四季变化，只有旱季和雨季之分。'
    ],
    example: 'Countries near the equator have tropical climates with warm weather year-round.'
  },
  {
    word: 'tsunami',
    meaning: '海啸',
    category: 'weather',
    difficulty: 'hard',
    hints: [
      '这是海底地震或火山喷发引发的巨大海浪。',
      '它在深海时速度极快但不明显，到达浅水区时浪高可达数十米，极具破坏力。',
      '2004年印度洋的它造成了数十万人死亡，是近代最严重的自然灾害之一。'
    ],
    example: 'The earthquake triggered a massive tsunami that devastated coastal towns.'
  },
  {
    word: 'friendship',
    meaning: '友谊',
    category: 'social',
    difficulty: 'easy',
    hints: [
      '这是朋友之间真诚的情感和关系。',
      '它建立在信任、尊重和互相帮助的基础上，真正的它能经受时间和距离的考验。',
      '人生中拥有它是一件幸福的事，朋友会在你困难时伸出援手。'
    ],
    example: 'Their friendship has lasted for over twenty years since childhood.'
  },
  {
    word: 'apology',
    meaning: '道歉',
    category: 'social',
    difficulty: 'medium',
    hints: [
      '这是承认自己的错误并请求对方原谅的行为或话语。',
      '真诚的它应该包含承认错误、表达悔意和承诺不再犯，有助于修复关系。',
      '吵架后需要有人先主动说它，关系才能和好。'
    ],
    example: 'He offered a sincere apology for being late to the important meeting.'
  },
  {
    word: 'gratitude',
    meaning: '感激',
    category: 'social',
    difficulty: 'hard',
    hints: [
      '这是对他人帮助或恩惠的真诚感谢之情。',
      '表达它可以说谢谢、写感谢信或回报对方，心理学研究显示经常感受它的人更幸福。',
      '收到礼物时应该向赠送者表达你的它。'
    ],
    example: 'She expressed her deep gratitude to everyone who helped her during the crisis.'
  },
  {
    word: 'courage',
    meaning: '勇气',
    category: 'social',
    difficulty: 'medium',
    hints: [
      '这是面对困难、危险或恐惧时仍然敢于行动的品质。',
      '它不是不害怕，而是虽然害怕仍然坚持做正确的事，消防员救人就需要它。',
      '说出真相、承认错误也都需要它。'
    ],
    example: 'It takes great courage to stand up for what you believe in.'
  },
  {
    word: 'compassion',
    meaning: '同情',
    category: 'social',
    difficulty: 'hard',
    hints: [
      '这是对他人痛苦的深切关怀，并希望帮助减轻的情感。',
      '它是许多慈善事业的出发点，志愿者帮助弱势群体就源于这种情感。',
      '医生和护士对病人需要有它，才能更好地照顾患者。'
    ],
    example: 'She showed great compassion for the homeless people living on the streets.'
  },
  {
    word: 'honesty',
    meaning: '诚实',
    category: 'social',
    difficulty: 'easy',
    hints: [
      '这是不说谎、不欺骗、真诚待人的品质。',
      '它是信任的基础，说谎被发现后会破坏别人对你的信任。',
      '收银员多找了你钱还回去就是它的表现。'
    ],
    example: 'Honesty is one of the most important qualities in a person.'
  },
  {
    word: 'jealousy',
    meaning: '嫉妒',
    category: 'social',
    difficulty: 'hard',
    hints: [
      '这是因为别人拥有自己想要的东西而产生的不快情绪。',
      '它可能出现在爱情、友情、事业等方面，过度的它会伤害自己和他人的关系。',
      '它是"七宗罪"之一，需要通过自我调节来克服。'
    ],
    example: 'His jealousy over his colleague\'s promotion affected their working relationship.'
  },
  {
    word: 'invitation',
    meaning: '邀请',
    category: 'social',
    difficulty: 'medium',
    hints: [
      '这是请别人参加活动、聚会或访问的行为或文件。',
      '婚礼、生日派对会发放正式的它，上面写有时间地点和着装要求。',
      '收到它后通常需要回复是否参加，叫做RSVP。'
    ],
    example: 'We received an invitation to their wedding ceremony next month.'
  },
  {
    word: 'celebration',
    meaning: '庆祝',
    category: 'social',
    difficulty: 'medium',
    hints: [
      '这是为了纪念特殊日子或成就而举办的欢乐活动。',
      '生日、毕业、结婚、节日都值得它，通常会有美食、音乐和亲朋好友相聚。',
      '新年倒计时是全球共同的它活动。'
    ],
    example: 'The whole city joined in the celebration after their team won the championship.'
  },
  {
    word: 'neighbor',
    meaning: '邻居',
    category: 'social',
    difficulty: 'easy',
    hints: [
      '这是住在你家附近的人。',
      '中国有句古话"远亲不如近邻"，说的就是好的它比远方的亲戚更有用。',
      '平时互相打招呼，过年互相送点好吃的，都是和它相处的好方式。'
    ],
    example: 'Our neighbors helped us water the plants while we were on vacation.'
  },
  {
    word: 'acquaintance',
    meaning: '熟人',
    category: 'social',
    difficulty: 'hard',
    hints: [
      '这是你认识但关系不深的人，介于陌生人和朋友之间。',
      '同事、同学的朋友、常见面的邻居都可能属于这个范畴。',
      '在社交场合你可能和他们聊天气、工作，但不会分享内心秘密。'
    ],
    example: 'He\'s not really a friend, just a business acquaintance I met at conferences.'
  },
  {
    word: 'mosquito',
    meaning: '蚊子',
    category: 'nature',
    difficulty: 'easy',
    hints: [
      '这是一种会飞的小型昆虫，雌性会吸血。',
      '它叮咬后皮肤会起包发痒，夏天夜晚最常见，还可能传播疾病。',
      '人们用蚊香、蚊帐、花露水来防止它的叮咬。'
    ],
    example: 'I got bitten by a mosquito last night and my arm is very itchy.'
  },
  {
    word: 'squirrel',
    meaning: '松鼠',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是一种生活在树上的小型哺乳动物，有一条毛茸茸的大尾巴。',
      '它喜欢吃坚果，冬天前会把食物藏在多个地方，有时会忘记藏在哪里。',
      '在公园的树上经常能看到它跑来跑去，它的尾巴可以保持平衡和保暖。'
    ],
    example: 'The squirrel was busy collecting acorns for the coming winter.'
  },
  {
    word: 'owl',
    meaning: '猫头鹰',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是一种夜间活动的鸟类，头可以旋转270度。',
      '它有一双大眼睛，视力和听力极佳，能在黑暗中捕捉老鼠。',
      '在西方文化中它象征智慧，希腊神话中雅典娜女神的圣鸟就是它。'
    ],
    example: 'An owl hooted in the forest as we walked through it at night.'
  },
  {
    word: 'bamboo',
    meaning: '竹子',
    category: 'nature',
    difficulty: 'easy',
    hints: [
      '这是一种高大的草本植物，茎干中空有节，生长迅速。',
      '大熊猫最喜欢吃它，在中国传统文化中它象征气节和坚韧。',
      '它可以用来做建筑材料、纸张、筷子、家具，用途非常广泛。'
    ],
    example: 'Giant pandas feed almost exclusively on bamboo shoots and leaves.'
  },
  {
    word: 'mushroom',
    meaning: '蘑菇',
    category: 'nature',
    difficulty: 'easy',
    hints: [
      '这是一种菌类，有像小伞一样的形状。',
      '它的种类很多，有的可以食用味道鲜美，有的却有毒不能吃，野外的它不要随便采。',
      '它喜欢生长在潮湿阴暗的地方，雨后树林里最容易找到。'
    ],
    example: 'We picked some fresh mushrooms from the forest for dinner.'
  },
  {
    word: 'cactus',
    meaning: '仙人掌',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是一种生长在沙漠等干旱地区的植物，全身长满尖刺。',
      '它的刺是由叶子演变而来，可以减少水分蒸发，也防止被动物吃掉。',
      '它很耐旱，是很受欢迎的室内盆栽，不用经常浇水也能活。'
    ],
    example: 'The cactus can survive in extremely dry desert conditions.'
  },
  {
    word: 'whale',
    meaning: '鲸鱼',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是生活在海洋中的巨型哺乳动物，不是鱼类。',
      '蓝鲸是有史以来最大的它，也是地球上存在过的最大动物，它用肺呼吸需要浮出水面换气。',
      '它会发出独特的歌声在水中交流，座头鲸的歌声尤其著名。'
    ],
    example: 'We went on a boat trip and saw a huge whale breaching the surface.'
  },
  {
    word: 'eagle',
    meaning: '鹰',
    category: 'nature',
    difficulty: 'medium',
    hints: [
      '这是一种大型猛禽，视力极佳可以从高空发现猎物。',
      '它是力量和自由的象征，美国的国徽上就有它的图案。',
      '它建巢在悬崖或高树上，以小动物为食，在食物链顶端。'
    ],
    example: 'The eagle soared high above the mountains searching for prey.'
  },
  {
    word: 'subway',
    meaning: '地铁',
    category: 'transport',
    difficulty: 'easy',
    hints: [
      '这是一种在地下隧道运行的城市公共交通系统。',
      '它速度快、运量大、不堵车，是大城市上班族最常用的通勤方式。',
      '北京、上海、东京、伦敦的它系统非常发达，线路众多覆盖全城。'
    ],
    example: 'I take the subway to work every day to avoid traffic jams.'
  },
  {
    word: 'yacht',
    meaning: '游艇',
    category: 'transport',
    difficulty: 'hard',
    hints: [
      '这是一种用于休闲娱乐的豪华船只。',
      '它通常配备卧室、厨房、客厅，可以出海度假、钓鱼或举办派对，是财富的象征。',
      '富人喜欢在摩纳哥、地中海等地驾驶它度假。'
    ],
    example: 'They spent their summer vacation sailing around the Greek islands on a private yacht.'
  },
  {
    word: 'tram',
    meaning: '有轨电车',
    category: 'transport',
    difficulty: 'hard',
    hints: [
      '这是一种在城市街道轨道上运行的公共交通工具。',
      '它靠电力驱动，车顶有电线连接，欧洲很多古老城市保留了它作为城市特色。',
      '它比公共汽车更平稳环保，和无轨电车的区别是它有轨道。'
    ],
    example: 'The city\'s historic tram system is a popular tourist attraction.'
  },
  {
    word: 'trolley',
    meaning: '手推车',
    category: 'transport',
    difficulty: 'medium',
    hints: [
      '这是一种带轮子的小推车，用来搬运物品。',
      '超市购物时推的购物车就是一种它，机场搬运行李也用它。',
      '它有很多尺寸和款式，家里也可以用它来收纳和移动东西。'
    ],
    example: 'She pushed a shopping trolley through the supermarket aisles.'
  },
  {
    word: 'motorcycle',
    meaning: '摩托车',
    category: 'transport',
    difficulty: 'medium',
    hints: [
      '这是一种两轮机动车，比汽车更灵活省油。',
      '骑它需要戴头盔，天气冷或下雨时不太舒适，但堵车时可以穿行很方便。',
      '哈雷戴维森是著名的它品牌，很多爱好者喜欢改装和长途骑行。'
    ],
    example: 'He rode his motorcycle across the country during his summer vacation.'
  },
  {
    word: 'lemon',
    meaning: '柠檬',
    category: 'food',
    difficulty: 'easy',
    hints: [
      '这是一种黄色的椭圆形柑橘类水果，味道非常酸。',
      '它的汁水常用于调味和制作饮料，蜂蜜泡它水是很受欢迎的饮品。',
      '它也富含维生素C，切片还可以放在水里除味或装饰菜肴。'
    ],
    example: 'Could you please add a slice of lemon to my glass of water?'
  },
  {
    word: 'mushroom',
    meaning: '蘑菇',
    category: 'food',
    difficulty: 'easy',
    hints: [
      '这是一种菌类食材，有像小伞一样的形状。',
      '它可以炒、煮、烤、做汤，西餐中常用奶油它做酱汁，中餐里小鸡炖它很出名。',
      '注意野生的它有些有毒，一定要从正规渠道购买食用。'
    ],
    example: 'I ordered a cream of mushroom soup as my starter.'
  },
  {
    word: 'yogurt',
    meaning: '酸奶',
    category: 'food',
    difficulty: 'easy',
    hints: [
      '这是牛奶经乳酸菌发酵制成的乳制品。',
      '它口感酸甜，含有益生菌对肠道健康有益，可以加水果、谷物、蜂蜜一起吃。',
      '希腊它更浓稠蛋白质更高，是健康早餐和零食的好选择。'
    ],
    example: 'I have a bowl of yogurt with fresh berries for breakfast every morning.'
  },
  {
    word: 'sausage',
    meaning: '香肠',
    category: 'food',
    difficulty: 'easy',
    hints: [
      '这是将肉馅灌入肠衣制成的食品，种类繁多。',
      '它可以煎、烤、煮，德国的它最出名，早餐常吃的培根也是它的近亲。',
      '中国的腊肠也是它的一种，带有甜味和酒香，蒸着吃最美味。'
    ],
    example: 'We grilled some sausages and burgers at the backyard barbecue.'
  },
  {
    word: 'cucumber',
    meaning: '黄瓜',
    category: 'food',
    difficulty: 'medium',
    hints: [
      '这是一种常见的蔬菜，通常是长条形的，外皮绿色，内部浅绿色多汁。',
      '它口感脆嫩，可以生吃、凉拌、炒菜，也常用于美容敷脸。',
      '它含水量很高，热量低，是减肥餐的好选择。'
    ],
    example: 'I like to add sliced cucumber to my salad for extra crunch.'
  },
  {
    word: 'cheese',
    meaning: '奶酪',
    category: 'food',
    difficulty: 'easy',
    hints: [
      '这是一种用牛奶发酵制成的食品，种类多达数百种。',
      '法式的它配红酒是经典组合，披萨上的马苏里拉它可以拉出长长的丝。',
      '它富含蛋白质和钙，但也比较高脂肪，适量食用才健康。'
    ],
    example: 'Would you like some cheese and crackers as an appetizer?'
  },
  {
    word: 'dumpling',
    meaning: '饺子',
    category: 'food',
    difficulty: 'easy',
    hints: [
      '这是一种传统中国食物，用面皮包裹馅料制成。',
      '春节时北方家庭必吃它，可以水煮、蒸、煎，馅料有猪肉白菜、韭菜鸡蛋等。',
      '它的形状像元宝，象征财富和好运。'
    ],
    example: 'My whole family makes dumplings together on Chinese New Year\'s Eve.'
  },
  {
    word: 'vinegar',
    meaning: '醋',
    category: 'food',
    difficulty: 'medium',
    hints: [
      '这是一种酸味的液态调味品，由粮食或水果发酵制成。',
      '吃饺子、凉菜、酸辣粉都离不开它，山西人尤其喜爱它的味道。',
      '它除了调味还可以清洁水垢、腌制食物，妙用很多。'
    ],
    example: 'This dish tastes much better with a little vinegar added to it.'
  },
  {
    word: 'shampoo',
    meaning: '洗发水',
    category: 'daily',
    difficulty: 'medium',
    hints: [
      '这是专门用来清洗头发的清洁产品。',
      '它通常是粘稠液体，有各种香味和功能，去屑、柔顺、防脱发等。',
      '洗澡时第一步通常就是用它洗头发，然后再用护发素。'
    ],
    example: 'This new shampoo makes my hair feel so soft and shiny.'
  },
  {
    word: 'toothpaste',
    meaning: '牙膏',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是配合牙刷清洁牙齿用的膏状物品。',
      '它一般含氟化物可以防蛀牙，有薄荷等清新口味，早晚刷牙都要挤在牙刷上。',
      '儿童版的它有水果味，且不建议吞食。'
    ],
    example: 'You should apply a pea-sized amount of toothpaste to your toothbrush.'
  },
  {
    word: 'curtain',
    meaning: '窗帘',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是挂在窗户上的布艺物品。',
      '它可以遮挡阳光、保护隐私、装饰房间，早上拉开它晚上拉上它是日常动作。',
      '它有遮光和半透明等不同材质，颜色图案要和房间装修搭配。'
    ],
    example: 'Please draw the curtains, the sunlight is too bright in here.'
  },
  {
    word: 'broom',
    meaning: '扫帚',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是扫地用的清洁工具，有长手柄和前端的刷毛。',
      '用它把垃圾扫到一起，再用簸箕收走，是传统的地面清洁方式。',
      '哈利波特里巫师骑着它飞行，但现实中它只能用来扫地。'
    ],
    example: 'She grabbed a broom and swept the fallen leaves off the porch.'
  },
  {
    word: 'mop',
    meaning: '拖把',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是用来拖洗地板的清洁工具。',
      '它有长杆和吸水的布头，先沾水再拖地，可以去除地面的污渍。',
      '现代的它有免手洗旋转款，比传统布条它方便很多。'
    ],
    example: 'I need to use the mop to clean the spilled juice off the kitchen floor.'
  },
  {
    word: 'towel',
    meaning: '毛巾',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是用布料制成的吸水用品。',
      '洗完手、脸、澡后用它擦干身体，有浴巾、面巾、方巾等不同尺寸。',
      '它应该定期清洗更换，建议每人使用自己的它更卫生。'
    ],
    example: 'After swimming, she wrapped herself in a big warm towel.'
  },
  {
    word: 'envelope',
    meaning: '信封',
    category: 'daily',
    difficulty: 'easy',
    hints: [
      '这是用来装信件的纸质封套。',
      '它通常是长方形的，上面要写收件人地址、姓名和贴邮票，封口后通过邮局寄出。',
      '过年装压岁钱的红包也算它的一种特殊形式。'
    ],
    example: 'She sealed the letter in an envelope and wrote the address on the front.'
  },
  {
    word: 'screw',
    meaning: '螺丝',
    category: 'tool',
    difficulty: 'medium',
    hints: [
      '这是一种带螺纹的金属紧固件。',
      '它和螺母配合使用，可以把东西牢固地固定在一起，用螺丝刀拧它。',
      '组装家具、维修电器都需要用到它，它比钉子更容易拆卸。'
    ],
    example: 'You\'ll need a screwdriver to tighten these screws properly.'
  },
  {
    word: 'ladder',
    meaning: '梯子',
    category: 'tool',
    difficulty: 'easy',
    hints: [
      '这是两根长杆中间有多个横杠的攀爬工具。',
      '换灯泡、取高处物品、粉刷墙壁都需要用到它，使用时要注意安全防止滑倒。',
      '成功路上也常被比喻为它，需要一步一步往上爬。'
    ],
    example: 'Could you hold the ladder steady while I climb up to fix the light?'
  },
  {
    word: 'hammer',
    meaning: '锤子',
    category: 'tool',
    difficulty: 'easy',
    hints: [
      '这是一种敲打用的工具，有手柄和金属头。',
      '它可以把钉子敲进木头，也可以拆除东西，木匠和装修工人都离不开它。',
      '使用它时要注意瞄准，别砸到手指了。'
    ],
    example: 'He used a hammer to drive the nail into the wooden board.'
  },
  {
    word: 'compass',
    meaning: '指南针',
    category: 'tool',
    difficulty: 'medium',
    hints: [
      '这是一种利用地磁指示方向的导航工具。',
      '它的红色指针永远指向北方，登山、探险、野外求生都需要它。',
      '画图时也有一种画圆的工具叫同样的名字，但用途不同。'
    ],
    example: 'Hikers always carry a compass so they don\'t get lost in the wilderness.'
  },
  {
    word: 'soccer',
    meaning: '足球',
    category: 'sports',
    difficulty: 'easy',
    hints: [
      '这是世界上最受欢迎的团队球类运动，也是这项运动用球的名字。',
      '每队11人在场上比赛，只能用脚、头和身体触球（守门员除外），把球踢进对方球门得分。',
      '世界杯是这项运动最高级别的国际赛事，每四年举办一次。'
    ],
    example: 'Playing soccer is my favorite weekend activity with my friends.'
  },
  {
    word: 'tennis',
    meaning: '网球',
    category: 'sports',
    difficulty: 'medium',
    hints: [
      '这是一项隔着网用球拍击球的运动，也是球的名字。',
      '可以单打或双打，在草地、红土、硬地等不同场地进行，四大满贯是最重要的赛事。',
      '费德勒、纳达尔、德约科维奇是这项运动的传奇巨星。'
    ],
    example: 'She plays tennis at the local club every Saturday morning.'
  },
  {
    word: 'helmet',
    meaning: '头盔',
    category: 'sports',
    difficulty: 'easy',
    hints: [
      '这是保护头部的安全装备。',
      '骑自行车、摩托车、滑雪、攀岩、打橄榄球等运动都必须佩戴它。',
      '它由坚固的外壳和缓冲内层组成，能在摔倒时减轻对头部的伤害。'
    ],
    example: 'Always wear a helmet when riding your bicycle, it could save your life.'
  },
  {
    word: 'marathon',
    meaning: '马拉松',
    category: 'sports',
    difficulty: 'medium',
    hints: [
      '这是一项长距离跑步比赛，全程42.195公里。',
      '它的名字来源于古希腊战争故事，为了纪念跑回雅典报捷后牺牲的士兵。',
      '完成它需要几个月的训练，很多城市每年举办它的比赛吸引众多跑者。'
    ],
    example: 'She trained for six months before running her first full marathon.'
  },
  {
    word: 'trophy',
    meaning: '奖杯',
    category: 'entertainment',
    difficulty: 'medium',
    hints: [
      '这是一种奖品，通常授予比赛或竞赛的获胜者。',
      '它通常由金属制成，有杯状或人物雕像等形状，底座上刻有获奖信息。',
      '获得它是对个人或团队成就的认可，是荣誉的象征。'
    ],
    example: 'The team proudly lifted the championship trophy after winning the final game.'
  },
  {
    word: 'novel',
    meaning: '小说',
    category: 'entertainment',
    difficulty: 'easy',
    hints: [
      '这是一种虚构的散文体长篇文学作品。',
      '它有完整的故事情节和人物塑造，分为言情、科幻、推理、历史等各种题材。',
      '很多畅销的它被改编成电影和电视剧，阅读它是很受欢迎的休闲方式。'
    ],
    example: 'I\'m reading a fascinating novel by a Japanese author right now.'
  },
  {
    word: 'puppet',
    meaning: '木偶',
    category: 'entertainment',
    difficulty: 'medium',
    hints: [
      '这是一种用木头或布料做的人形玩具，可以被人操纵表演。',
      '它有手偶、提线等不同类型，儿童剧场常有它的演出。',
      'Sesame Street里的角色大部分都是它，深受孩子们喜爱。'
    ],
    example: 'The kids were delighted by the puppet show at the birthday party.'
  },
  {
    word: 'jigsaw',
    meaning: '拼图',
    category: 'entertainment',
    difficulty: 'medium',
    hints: [
      '这是一种把很多小块碎片拼合成完整图画的益智玩具。',
      '它有从几十块到几千块的不同难度，完成后很有成就感，是很好的家庭活动。',
      '也用来比喻错综复杂的问题，解决它需要找到各个部分的联系。'
    ],
    example: 'We spent the whole weekend putting together a 1000-piece jigsaw puzzle.'
  },
  {
    word: 'karaoke',
    meaning: '卡拉OK',
    category: 'entertainment',
    difficulty: 'medium',
    hints: [
      '这是一种跟着伴奏和字幕唱歌的娱乐活动。',
      '它起源于日本，在亚洲特别流行，朋友聚会常去专门的它包间唱歌。',
      '它的日文原意是"空的管弦乐队"，指没有真人乐队只有伴奏。'
    ],
    example: 'Let\'s go out for karaoke after dinner to celebrate your birthday!'
  }
]

const selectedDifficulty = ref('all')
const selectedCategory = ref('all')
const isPlaying = ref(false)
const isGenerating = ref(false)
const currentWord = ref<WordItem | null>(null)
const currentHints = ref<string[]>([])
const currentHintSetIndex = ref(0)
const userAnswer = ref('')
const isAnswered = ref(false)
const lastResult = ref<'correct' | 'wrong' | 'skipped' | ''>('')
const lastScoreGained = ref(0)
const showExtraHint = ref(false)

const RECENT_WINDOW_SIZE = 20
const globalRoundCounter = ref(0)
const recentWords = ref<string[]>([])
const lastWordKey = ref<string>('')

const MASTERY_LEVELS = [
  { level: 0, label: '未学习', color: '#909399', interval: 0 },
  { level: 1, label: '初学', color: '#F56C6C', interval: 2 },
  { level: 2, label: '熟悉', color: '#E6A23C', interval: 5 },
  { level: 3, label: '掌握', color: '#67C23A', interval: 12 },
  { level: 4, label: '熟练', color: '#409EFF', interval: 25 },
  { level: 5, label: '精通', color: '#9b59b6', interval: 50 }
]

const masteryMap = ref<Record<string, WordMastery>>({})
const hintUsageMap = ref<Record<string, HintUsageRecord[]>>({})
const currentHintSet = ref(0)

const score = ref(0)
const currentStreak = ref(0)
const maxStreak = ref(0)
const correctCount = ref(0)
const wrongCount = ref(0)
const totalGames = ref(0)
const history = ref<HistoryRecord[]>([])
const showAllHistory = ref(false)

const getMastery = (word: string): WordMastery => {
  if (!masteryMap.value[word]) {
    masteryMap.value[word] = {
      word,
      correctCount: 0,
      wrongCount: 0,
      consecutiveCorrect: 0,
      masteryLevel: 0,
      lastAnsweredAt: 0,
      nextScheduledRound: 0
    }
  }
  return masteryMap.value[word]
}

const masteryStats = computed(() => {
  const stats = { total: wordDatabase.length, level0: 0, level1: 0, level2: 0, level3: 0, level4: 0, level5: 0 }
  wordDatabase.forEach(w => {
    const m = masteryMap.value[w.word]
    const lvl = m ? m.masteryLevel : 0
    if (lvl === 0) stats.level0++
    else if (lvl === 1) stats.level1++
    else if (lvl === 2) stats.level2++
    else if (lvl === 3) stats.level3++
    else if (lvl === 4) stats.level4++
    else stats.level5++
  })
  return stats
})

const accuracyRate = computed(() => {
  if (totalGames.value === 0) return 0
  return Math.round((correctCount.value / totalGames.value) * 100)
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const loadData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      score.value = data.score || 0
      currentStreak.value = data.currentStreak || 0
      maxStreak.value = data.maxStreak || 0
      correctCount.value = data.correctCount || 0
      wrongCount.value = data.wrongCount || 0
      totalGames.value = data.totalGames || 0
      history.value = data.history || []
      recentWords.value = data.recentWords || []
      lastWordKey.value = data.lastWordKey || ''
      globalRoundCounter.value = data.globalRoundCounter || 0
      masteryMap.value = data.masteryMap || {}
      hintUsageMap.value = data.hintUsageMap || {}
    }
  } catch (e) {
    console.error('Failed to load game data:', e)
  }
}

const saveData = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      score: score.value,
      currentStreak: currentStreak.value,
      maxStreak: maxStreak.value,
      correctCount: correctCount.value,
      wrongCount: wrongCount.value,
      totalGames: totalGames.value,
      history: history.value,
      recentWords: recentWords.value,
      lastWordKey: lastWordKey.value,
      globalRoundCounter: globalRoundCounter.value,
      masteryMap: masteryMap.value,
      hintUsageMap: hintUsageMap.value
    }))
  } catch (e) {
    console.error('Failed to save game data:', e)
  }
}

onMounted(() => {
  loadData()
})

watch([selectedDifficulty, selectedCategory], () => {
  recentWords.value = []
  lastWordKey.value = ''
  globalRoundCounter.value = 0
  saveData()
})

const getFilteredWords = () => {
  return wordDatabase.filter(word => {
    if (selectedDifficulty.value !== 'all' && word.difficulty !== selectedDifficulty.value) {
      return false
    }
    if (selectedCategory.value !== 'all' && word.category !== selectedCategory.value) {
      return false
    }
    return true
  })
}

const getSecureRandom = () => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] / 0xffffffff
  }
  return Math.random()
}

const shuffleArray = <T>(arr: T[]): T[] => {
  const result = arr.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(getSecureRandom() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const getHintUsageRecords = (word: string): HintUsageRecord[] => {
  if (!hintUsageMap.value[word]) {
    hintUsageMap.value[word] = []
  }
  return hintUsageMap.value[word]
}

const selectHintsForWord = (word: WordItem, currentRound: number): { hints: string[], setIndex: number } => {
  const allHints: string[][] = [word.hints]
  if (word.alternateHints && word.alternateHints.length > 0) {
    allHints.push(...word.alternateHints)
  }

  const records = getHintUsageRecords(word.word)
  while (records.length < allHints.length) {
    records.push({ word: word.word, hintSetIndex: records.length, lastUsedRound: -999, useCount: 0 })
  }

  const scored = records
    .filter(r => r.hintSetIndex < allHints.length)
    .map(r => ({
      record: r,
      score: (currentRound - r.lastUsedRound) * 10 - r.useCount * 3 + getSecureRandom() * 5
    }))
    .sort((a, b) => b.score - a.score)

  const chosen = scored[0]?.record || records[0]
  chosen.lastUsedRound = currentRound
  chosen.useCount++

  return {
    hints: shuffleArray(allHints[chosen.hintSetIndex]),
    setIndex: chosen.hintSetIndex
  }
}

const calculateMasteryPriority = (word: WordItem, currentRound: number): number => {
  const m = getMastery(word.word)
  const levelConfig = MASTERY_LEVELS[m.masteryLevel] || MASTERY_LEVELS[0]

  const readyForReview = m.nextScheduledRound <= currentRound
  const timeSinceLast = currentRound - (m.lastAnsweredAt || 0)

  let priority = 0

  if (m.masteryLevel === 0) {
    priority += 100
  } else if (m.masteryLevel === 1) {
    priority += 80
  } else if (m.masteryLevel === 2) {
    priority += 55
  } else if (m.masteryLevel === 3) {
    priority += 30
  } else if (m.masteryLevel === 4) {
    priority += 12
  } else {
    priority += 3
  }

  if (readyForReview && m.masteryLevel > 0) {
    priority += 40
  }

  if (m.wrongCount > m.correctCount && (m.wrongCount + m.correctCount) > 0) {
    priority += 25
  }

  priority += timeSinceLast * 0.5
  priority += getSecureRandom() * 20

  return priority
}

const pickNextWord = (): { word: WordItem, hints: string[], setIndex: number } | null => {
  const available = getFilteredWords()
  if (available.length === 0) return null

  globalRoundCounter.value++
  const currentRound = globalRoundCounter.value

  const applyHardFilters = (words: WordItem[], excludeRecent: boolean, excludeLast: boolean): WordItem[] => {
    return words.filter(w => {
      const key = w.word
      const m = getMastery(key)
      if (excludeLast && key === lastWordKey.value) return false
      if (excludeRecent && recentWords.value.includes(key)) return false
      if (m.nextScheduledRound > currentRound && m.masteryLevel >= 3) return false
      return true
    })
  }

  let candidates = applyHardFilters(available, true, true)

  if (candidates.length === 0) {
    candidates = applyHardFilters(available, false, true)
  }

  if (candidates.length === 0) {
    candidates = applyHardFilters(available, false, false)
  }

  if (candidates.length === 0) {
    candidates = available
  }

  const scored = candidates
    .map(w => ({ word: w, priority: calculateMasteryPriority(w, currentRound) }))
    .sort((a, b) => b.priority - a.priority)

  const topN = Math.min(Math.max(3, Math.floor(candidates.length * 0.4)), scored.length)
  const topPool = scored.slice(0, topN)
  const shuffledTop = shuffleArray(topPool)
  const chosen = shuffledTop[0]

  if (!chosen) return null

  const key = chosen.word.word
  lastWordKey.value = key
  recentWords.value.push(key)
  if (recentWords.value.length > RECENT_WINDOW_SIZE) {
    recentWords.value = recentWords.value.slice(-RECENT_WINDOW_SIZE)
  }

  const { hints, setIndex } = selectHintsForWord(chosen.word, currentRound)
  return { word: chosen.word, hints, setIndex }
}

const updateMasteryAfterAnswer = (word: string, isCorrect: boolean) => {
  const m = getMastery(word)
  const currentRound = globalRoundCounter.value

  m.lastAnsweredAt = currentRound
  if (isCorrect) {
    m.correctCount++
    m.consecutiveCorrect++
    if (m.consecutiveCorrect >= 2 && m.masteryLevel < 5) {
      m.masteryLevel++
      m.consecutiveCorrect = 0
    }
  } else {
    m.wrongCount++
    m.consecutiveCorrect = 0
    if (m.masteryLevel > 1) {
      m.masteryLevel = Math.max(1, m.masteryLevel - 1)
    }
  }

  const levelConfig = MASTERY_LEVELS[m.masteryLevel] || MASTERY_LEVELS[0]
  const baseInterval = levelConfig.interval
  const jitter = Math.floor(getSecureRandom() * Math.max(1, Math.floor(baseInterval * 0.3)))
  m.nextScheduledRound = currentRound + baseInterval + jitter
}

const startNewRound = () => {
  const availableWords = getFilteredWords()
  if (availableWords.length === 0) {
    ElMessage.warning('当前筛选条件下没有可用词汇，请调整设置')
    return
  }

  isGenerating.value = true
  isPlaying.value = true
  isAnswered.value = false
  lastResult.value = ''
  userAnswer.value = ''
  showExtraHint.value = false
  lastScoreGained.value = 0

  setTimeout(() => {
    const result = pickNextWord()
    if (result) {
      currentWord.value = result.word
      currentHints.value = result.hints
      currentHintSet.value = result.setIndex
    }
    isGenerating.value = false
  }, 800 + Math.floor(getSecureRandom() * 600))
}

const checkAnswer = () => {
  if (!currentWord.value || isAnswered.value) return

  const answer = userAnswer.value.trim().toLowerCase()
  const correct = currentWord.value.word.toLowerCase()

  isAnswered.value = true
  totalGames.value++
  const isCorrectAnswer = answer === correct

  if (isCorrectAnswer) {
    lastResult.value = 'correct'
    correctCount.value++
    currentStreak.value++
    if (currentStreak.value > maxStreak.value) {
      maxStreak.value = currentStreak.value
    }

    let points = 10
    if (currentWord.value.difficulty === 'medium') points = 15
    if (currentWord.value.difficulty === 'hard') points = 25
    if (showExtraHint.value) points = Math.max(points - 5, 1)

    if (currentStreak.value >= 3) {
      points += currentStreak.value
    }

    const m = getMastery(currentWord.value.word)
    if (m.masteryLevel >= 3) {
      points = Math.max(1, Math.floor(points * 0.6))
    }

    lastScoreGained.value = points
    score.value += points

    ElMessage.success({
      message: `🎉 回答正确！+${points} 分${currentStreak.value >= 3 ? ` (${currentStreak.value}连击！)` : ''}`,
      type: 'success',
      duration: 2500,
      showClose: true
    })
  } else {
    lastResult.value = 'wrong'
    wrongCount.value++
    currentStreak.value = 0
    score.value = Math.max(0, score.value - 2)

    ElMessage.error({
      message: '😅 回答错误，再接再厉！',
      type: 'error',
      duration: 2000,
      showClose: true
    })
  }

  updateMasteryAfterAnswer(currentWord.value.word, isCorrectAnswer)

  history.value.push({
    word: currentWord.value.word,
    meaning: currentWord.value.meaning,
    result: lastResult.value,
    score: lastScoreGained.value || -2,
    time: new Date().toISOString()
  })

  saveData()
}

const giveUp = () => {
  if (!currentWord.value || isAnswered.value) return

  isAnswered.value = true
  lastResult.value = 'skipped'
  totalGames.value++
  wrongCount.value++
  currentStreak.value = 0

  updateMasteryAfterAnswer(currentWord.value.word, false)

  history.value.push({
    word: currentWord.value.word,
    meaning: currentWord.value.meaning,
    result: 'skipped',
    score: 0,
    time: new Date().toISOString()
  })

  ElMessage.warning('已跳过本题，继续加油！')
  saveData()
}

const revealHint = () => {
  if (showExtraHint.value) return
  showExtraHint.value = true
  ElMessage.info('已显示首字母提示 (-5分)')
}

const copyWord = (word: string) => {
  navigator.clipboard.writeText(word)
    .then(() => ElMessage.success('单词已复制'))
    .catch(() => ElMessage.error('复制失败'))
}

const clearHistory = () => {
  history.value = []
  score.value = 0
  currentStreak.value = 0
  maxStreak.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  totalGames.value = 0
  recentWords.value = []
  lastWordKey.value = ''
  globalRoundCounter.value = 0
  masteryMap.value = {}
  hintUsageMap.value = {}
  currentWord.value = null
  currentHints.value = []
  currentHintSet.value = 0
  isAnswered.value = false
  lastResult.value = ''
  userAnswer.value = ''
  showExtraHint.value = false
  isPlaying.value = false
  saveData()
  ElMessage.success('记录已清空')
}

const getMasteryLabel = (word: string) => {
  const m = masteryMap.value[word]
  const lvl = m ? m.masteryLevel : 0
  return MASTERY_LEVELS[lvl]?.label || '未学习'
}

const getMasteryColor = (word: string) => {
  const m = masteryMap.value[word]
  const lvl = m ? m.masteryLevel : 0
  return MASTERY_LEVELS[lvl]?.color || '#909399'
}

const getDifficultyLabel = (difficulty: string) => {
  const map: Record<string, string> = {
    easy: '初级',
    medium: '中级',
    hard: '高级'
  }
  return map[difficulty] || difficulty
}

const getDifficultyTagType = (difficulty: string): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return map[difficulty] || 'info'
}

const getCategoryLabel = (category: string) => {
  const cat = categories.find(c => c.value === category)
  return cat?.label || category
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.word-guess-game {
  max-width: 900px;
  margin: 0 auto;
}

.intro-card {
  margin-bottom: 24px;
}

.intro-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.intro-left {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex: 1;
}

.intro-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.intro-text {
  flex: 1;
  min-width: 0;
}

.intro-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 8px 0;
}

.intro-subtitle {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.intro-badges {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.intro-sections {
  margin-top: 8px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.audience-tags {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.audience-tag {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 12px;
  border: 1px solid #d9ecff;
}

.at-emoji {
  font-size: 28px;
  flex-shrink: 0;
}

.at-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.at-desc {
  font-size: 12px;
  color: #909399;
  display: block;
}

.stats-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.stat-block {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 12px;
}

.stat-emoji {
  font-size: 36px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #165DFF;
}

.mastery-card {
  margin-bottom: 24px;
}

.mastery-progress-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mastery-progress-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mp-label {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 70px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.mp-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.mp-count {
  width: 70px;
  text-align: right;
  font-size: 13px;
  color: #909399;
  flex-shrink: 0;
}

.mastery-progress-row :deep(.el-progress) {
  flex: 1;
}

.word-mastery {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.mastery-detail {
  color: #909399;
  font-size: 13px;
}

.game-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.card-header :deep(.el-tag) {
  margin-left: auto;
}

.card-header :deep(.el-tag) + :deep(.el-tag) {
  margin-left: 8px;
}

.config-section {
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-radius: 8px;
  transition: opacity 0.3s ease, filter 0.3s ease;
}

.config-section.disabled {
  opacity: 0.5;
  filter: grayscale(0.3);
  pointer-events: none;
}

.config-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.config-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.idle-section {
  padding: 48px 24px;
  text-align: center;
}

.idle-content {
  max-width: 500px;
  margin: 0 auto;
}

.idle-icon {
  margin-bottom: 20px;
  animation: idle-bounce 2s ease-in-out infinite;
}

@keyframes idle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.idle-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 12px 0;
}

.idle-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.start-btn {
  width: 200px;
  height: 56px;
  font-size: 18px;
}

.generating-section {
  padding: 48px 24px;
  text-align: center;
}

.generating-animation {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.generating-dots {
  display: flex;
  gap: 10px;
}

.generating-dots .dot {
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, #e6a23c 0%, #f56c6c 100%);
  border-radius: 50%;
  animation: dot-bounce 1.2s ease-in-out infinite;
}

.generating-dots .dot:nth-child(2) { animation-delay: 0.2s; }
.generating-dots .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.3); opacity: 1; }
}

.generating-text {
  font-size: 16px;
  color: #606266;
  font-weight: 500;
}

.game-area {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.desc-header {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.description-card {
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #d9ecff;
  margin-bottom: 16px;
}

.desc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9ecff;
}

.desc-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hint-item {
  font-size: 15px;
  color: #303133;
  line-height: 1.7;
  margin: 0;
  padding: 10px 14px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  gap: 8px;
}

.hint-bullet {
  font-weight: bold;
  color: #165DFF;
  flex-shrink: 0;
}

.extra-hint {
  margin-bottom: 16px;
}

.answer-section {
  background: linear-gradient(135deg, #fff7e6 0%, #fffaeb 100%);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #ffe7ba;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.answer-input-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.answer-input {
  flex: 1;
}

.result-section {
  padding: 20px;
  border-radius: 12px;
  animation: result-appear 0.4s ease-out;
}

@keyframes result-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-section.correct {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border: 2px solid #b3e19d;
}

.result-section.wrong {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border: 2px solid #fbc4c4;
}

.result-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.result-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 12px 0;
}

.correct-word-row,
.word-meaning,
.word-example {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.cw-label,
.wm-label,
.we-label {
  font-size: 13px;
  color: #909399;
  font-weight: 500;
  flex-shrink: 0;
}

.cw-word {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  letter-spacing: 1px;
}

.wm-text {
  font-size: 14px;
  color: #606266;
}

.we-text {
  font-size: 13px;
  color: #606266;
  font-style: italic;
  background: rgba(255, 255, 255, 0.6);
  padding: 4px 10px;
  border-radius: 6px;
}

.score-gain {
  margin-top: 12px;
}

.action-row {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.next-btn {
  width: 200px;
  height: 56px;
  font-size: 18px;
}

.history-card {
  margin-bottom: 24px;
}

.history-card .card-header {
  justify-content: space-between;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  gap: 12px;
  transition: background 0.2s;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item:hover {
  background: #fafafa;
}

.history-item.correct {
  background: linear-gradient(90deg, rgba(103, 194, 58, 0.05) 0%, transparent 100%);
}

.history-item.wrong {
  background: linear-gradient(90deg, rgba(245, 108, 108, 0.05) 0%, transparent 100%);
}

.history-time {
  font-size: 12px;
  color: #909399;
  min-width: 90px;
}

.history-result {
  font-size: 18px;
  flex-shrink: 0;
}

.history-word {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  min-width: 120px;
}

.history-meaning {
  flex: 1;
  font-size: 13px;
  color: #606266;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

@media (max-width: 768px) {
  .intro-header {
    flex-direction: column;
    gap: 16px;
  }

  .intro-badges {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .config-row {
    flex-direction: column;
    gap: 16px;
  }

  .config-item {
    flex-wrap: wrap;
  }

  .answer-input-row {
    flex-wrap: wrap;
  }

  .answer-input {
    width: 100%;
  }

  .result-content {
    flex-direction: column;
    text-align: center;
  }

  .correct-word-row,
  .word-meaning,
  .word-example {
    justify-content: center;
  }

  .history-item {
    flex-wrap: wrap;
    gap: 8px;
  }

  .history-word {
    min-width: auto;
  }

  .history-time {
    min-width: auto;
  }

  .audience-tags {
    grid-template-columns: 1fr;
  }
}
</style>