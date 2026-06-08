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
              <p v-for="(hint, idx) in currentWord.hints" :key="idx" class="hint-item">
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
import { ref, computed, onMounted } from 'vue'
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
  InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface WordItem {
  word: string
  meaning: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  hints: string[]
  example?: string
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
  { label: '⚽ 体育运动', value: 'sports' }
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
  }
]

const selectedDifficulty = ref('all')
const selectedCategory = ref('all')
const isPlaying = ref(false)
const isGenerating = ref(false)
const currentWord = ref<WordItem | null>(null)
const userAnswer = ref('')
const isAnswered = ref(false)
const lastResult = ref<'correct' | 'wrong' | 'skipped' | ''>('')
const lastScoreGained = ref(0)
const showExtraHint = ref(false)
const usedWordIndexes = ref<number[]>([])

const score = ref(0)
const currentStreak = ref(0)
const maxStreak = ref(0)
const correctCount = ref(0)
const wrongCount = ref(0)
const totalGames = ref(0)
const history = ref<HistoryRecord[]>([])
const showAllHistory = ref(false)

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
      history: history.value
    }))
  } catch (e) {
    console.error('Failed to save game data:', e)
  }
}

onMounted(() => {
  loadData()
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
    let randomIndex
    if (usedWordIndexes.value.length >= availableWords.length) {
      usedWordIndexes.value = []
    }

    let attempts = 0
    do {
      const idx = Math.floor(getSecureRandom() * availableWords.length)
      randomIndex = idx
      attempts++
    } while (usedWordIndexes.value.includes(randomIndex) && attempts < 50)

    usedWordIndexes.value.push(randomIndex)
    currentWord.value = availableWords[randomIndex]
    isGenerating.value = false
  }, 800 + Math.floor(getSecureRandom() * 600))
}

const checkAnswer = () => {
  if (!currentWord.value || isAnswered.value) return

  const answer = userAnswer.value.trim().toLowerCase()
  const correct = currentWord.value.word.toLowerCase()

  isAnswered.value = true
  totalGames.value++

  if (answer === correct) {
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
  usedWordIndexes.value = []
  currentWord.value = null
  isAnswered.value = false
  lastResult.value = ''
  userAnswer.value = ''
  showExtraHint.value = false
  isPlaying.value = false
  saveData()
  ElMessage.success('记录已清空')
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