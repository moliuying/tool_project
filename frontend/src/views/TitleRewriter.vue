<template>
  <div class="title-rewriter">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <el-steps :active="currentStep" finish-status="success" simple class="guide-steps">
        <el-step title="输入原始标题" description="输入你想要改写的文章/内容标题" />
        <el-step title="选择发布场景" description="适配公众号、短视频、电商等不同场景" />
        <el-step title="AI智能改写" description="多种策略生成多个风格各异的标题方案" />
        <el-step title="查看与复制" description="查看改写逻辑和适用场景，一键复制使用" />
      </el-steps>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <Edit />
          </el-icon>
          <span>AI 标题改写</span>
          <el-tag size="small" type="warning">让你的标题更吸睛</el-tag>
        </div>
      </template>

      <div class="input-section">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          <span>原始标题</span>
        </div>
        <el-input
          v-model="originalTitle"
          type="textarea"
          :rows="2"
          placeholder="请输入原始标题，例如：如何提高工作效率"
          maxlength="100"
          show-word-limit
          resize="none"
          :disabled="isGenerating"
        />
        <div class="quick-samples">
          <span class="sample-label">📝 快速体验：</span>
          <el-tag
            v-for="(sample, i) in quickSamples"
            :key="i"
            class="sample-tag"
            effect="plain"
            @click="applySample(sample)"
          >
            {{ sample }}
          </el-tag>
        </div>
      </div>

      <div class="scene-section">
        <div class="section-title">
          <el-icon><Grid /></el-icon>
          <span>发布场景</span>
        </div>
        <div class="scene-options">
          <div
            v-for="scene in scenes"
            :key="scene.value"
            class="scene-card"
            :class="{ active: selectedScene === scene.value, disabled: isGenerating }"
            @click="!isGenerating && (selectedScene = scene.value)"
          >
            <div class="scene-emoji">{{ scene.emoji }}</div>
            <div class="scene-name">{{ scene.label }}</div>
            <div class="scene-desc">{{ scene.desc }}</div>
          </div>
        </div>
      </div>

      <div class="style-section">
        <div class="section-title">
          <el-icon><MagicStick /></el-icon>
          <span>改写风格（可选）</span>
        </div>
        <el-checkbox-group v-model="selectedStyles" :disabled="isGenerating">
          <el-checkbox v-for="style in allStyles" :key="style.value" :label="style.value">
            {{ style.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="action-section">
        <el-button
          type="primary"
          size="large"
          :icon="MagicStick"
          :loading="isGenerating"
          :disabled="!canGenerate"
          @click="generateTitles"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 正在改写中
            </span>
          </template>
          智能改写标题
        </el-button>
        <el-button
          size="large"
          :icon="Refresh"
          :disabled="isGenerating"
          @click="resetAll"
        >
          重置
        </el-button>
      </div>

      <div v-if="isGenerating" class="generating-status">
        <div class="generating-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <span class="generating-text">✨ AI 正在运用多种策略为你生成吸睛标题…</span>
      </div>
    </el-card>

    <el-card v-if="generatedResults.length > 0" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>改写结果</span>
          <el-tag size="small" type="success">共生成 {{ generatedResults.length }} 个标题方案</el-tag>
        </div>
      </template>

      <div class="result-list">
        <div
          v-for="(result, index) in generatedResults"
          :key="index"
          class="result-item"
          :class="{ 'result-appear': true }"
        >
          <div class="result-header">
            <el-tag :type="getStrategyType(result.strategy)" size="small" effect="dark">
              {{ result.strategyLabel }}
            </el-tag>
            <div class="result-score">
              <el-rate v-model="result.rating" disabled size="small" />
              <span class="score-label">吸引力指数</span>
            </div>
          </div>
          <div class="result-title" @click="copyText(result.title)">
            <span class="title-text">{{ result.title }}</span>
            <el-icon class="copy-icon"><CopyDocument /></el-icon>
          </div>
          <div class="result-details">
            <div class="detail-item">
              <el-icon color="#165DFF"><Bulb /></el-icon>
              <div class="detail-content">
                <span class="detail-label">改写逻辑：</span>
                <span class="detail-text">{{ result.logic }}</span>
              </div>
            </div>
            <div class="detail-item">
              <el-icon color="#e6a23c"><Place /></el-icon>
              <div class="detail-content">
                <span class="detail-label">适用场景：</span>
                <span class="detail-text">{{ result.scenario }}</span>
              </div>
            </div>
          </div>
          <div class="result-actions">
            <el-button size="small" type="primary" :icon="CopyDocument" @click="copyText(result.title)">
              复制标题
            </el-button>
            <el-button size="small" :icon="Share" @click="copyWithExplanation(result)">
              复制带说明
            </el-button>
          </div>
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
          @click="loadFromHistory(item)"
        >
          <div class="history-time">{{ formatTime(item.time) }}</div>
          <div class="history-original">
            <el-tag size="small" type="info">原标题</el-tag>
            <span class="history-text">{{ item.originalTitle }}</span>
          </div>
          <div class="history-scene">
            <el-tag size="small">{{ getSceneLabel(item.scene) }}</el-tag>
          </div>
          <div class="history-count">
            <el-tag size="small" type="success">{{ item.results.length }}个方案</el-tag>
          </div>
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
  Edit,
  EditPen,
  Grid,
  MagicStick,
  Refresh,
  Loading,
  Finished,
  CopyDocument,
  Share,
  Bulb,
  Place,
  Clock,
  InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface TitleResult {
  title: string
  strategy: string
  strategyLabel: string
  logic: string
  scenario: string
  rating: number
}

interface HistoryItem {
  originalTitle: string
  scene: string
  results: TitleResult[]
  time: string
}

const STORAGE_KEY = 'title_rewriter_history'

const quickSamples = [
  '如何提高工作效率',
  '年轻人为什么不想结婚',
  '新手如何开始学习编程',
  '夏天穿什么衣服显瘦',
  '月薪5000如何理财'
]

const scenes = [
  {
    value: 'wechat',
    label: '公众号推文',
    emoji: '📱',
    desc: '深度长文、知识分享'
  },
  {
    value: 'video',
    label: '短视频',
    emoji: '🎬',
    desc: '抖音、快手、视频号'
  },
  {
    value: 'ecommerce',
    label: '电商详情页',
    emoji: '🛒',
    desc: '淘宝、京东、拼多多'
  },
  {
    value: 'social',
    label: '社交媒体',
    emoji: '💬',
    desc: '微博、小红书、朋友圈'
  }
]

const allStyles = [
  { value: 'suspense', label: '悬念好奇型' },
  { value: 'number', label: '数字清单型' },
  { value: 'emotion', label: '情感共鸣型' },
  { value: 'contrast', label: '对比反差型' },
  { value: 'benefit', label: '利益驱动型' },
  { value: 'story', label: '故事叙述型' },
  { value: 'question', label: '疑问引导型' },
  { value: 'hotspot', label: '热点蹭流型' }
]

const strategies = [
  {
    value: 'suspense',
    label: '悬念好奇型',
    type: 'warning' as const,
    generate: (title: string, scene: string): TitleResult => {
      const templates = [
        () => `99%的人都不知道的${extractCore(title)}秘密，看完我沉默了`,
        () => `为什么${title}？真相让人意想不到`,
        () => `${extractCore(title)}的背后，竟然藏着这样的玄机`,
        () => `千万别轻易尝试${extractCore(title)}，除非你知道这些`,
        () => `关于${extractCore(title)}，你可能一直都理解错了`
      ]
      const pick = templates[Math.floor(Math.random() * templates.length)]
      return {
        title: pick(),
        strategy: 'suspense',
        strategyLabel: '悬念好奇型',
        logic: '利用信息差和未知感制造悬念，通过"秘密""真相""竟然"等词汇激发读者的好奇心和探索欲，让用户产生"我必须点进去看看"的冲动。',
        scenario: scene === 'video' ? '短视频封面标题，3秒内抓住用户注意力，提升完播率和点赞率' :
                  scene === 'wechat' ? '公众号文章首条标题，提升打开率和转发率' :
                  scene === 'social' ? '微博/小红书话题标题，引导用户点击讨论' :
                  '商品详情页卖点标题，激发消费者深入了解的欲望',
        rating: 4 + Math.round(Math.random())
      }
    }
  },
  {
    value: 'number',
    label: '数字清单型',
    type: 'primary' as const,
    generate: (title: string, scene: string): TitleResult => {
      const numbers = [3, 5, 7, 8, 10]
      const num = numbers[Math.floor(Math.random() * numbers.length)]
      const templates = [
        () => `${title}？这${num}个方法让你事半功倍`,
        () => `掌握这${num}个${extractCore(title)}技巧，想不优秀都难`,
        () => `${num}个超实用的${extractCore(title)}方法，第${Math.ceil(num / 2)}个绝了`,
        () => `${title}的${num}个核心要点，学会一个就赚了`,
        () => `干货 | ${num}分钟带你搞懂${extractCore(title)}`
      ]
      const pick = templates[Math.floor(Math.random() * templates.length)]
      return {
        title: pick(),
        strategy: 'number',
        strategyLabel: '数字清单型',
        logic: `用具体数字（${num}个）增强标题的具象感和权威性，让读者对内容量有明确预期，同时"干货""绝了""赚了"等词汇暗示高价值，降低决策成本。`,
        scenario: scene === 'wechat' ? '公众号干货文章、知识分享类推文，提升收藏和转发' :
                  scene === 'video' ? '教程类、知识类短视频标题，吸引精准用户' :
                  scene === 'ecommerce' ? '产品卖点罗列，突出产品功能的丰富性' :
                  '小红书种草笔记、知乎回答等深度内容平台',
        rating: 4 + Math.round(Math.random())
      }
    }
  },
  {
    value: 'emotion',
    label: '情感共鸣型',
    type: 'danger' as const,
    generate: (title: string, scene: string): TitleResult => {
      const templates = [
        () => `看完${title}，我偷偷哭了半小时`,
        () => `${title}，是每个成年人都逃不过的宿命`,
        () => `致正在${extractCore(title)}的你：请一定好好爱自己`,
        () => `${title}的那一刻，我终于释怀了`,
        () => `如果早知道${extractCore(title)}是这样，我绝不会…`
      ]
      const pick = templates[Math.floor(Math.random() * templates.length)]
      return {
        title: pick(),
        strategy: 'emotion',
        strategyLabel: '情感共鸣型',
        logic: '通过代入感强的情感表达（"哭了""释怀了""请一定好好爱自己"），唤起读者的情绪共鸣和身份认同，让标题产生"说的就是我"的代入效果。',
        scenario: scene === 'social' ? '朋友圈文案、微博情感话题，引发点赞和评论互动' :
                  scene === 'video' ? '情感类、生活记录类短视频，提升评论和分享率' :
                  scene === 'wechat' ? '情感类公众号文章，引发读者共鸣和转发' :
                  '品牌故事、用户故事类电商详情页，提升品牌好感度',
        rating: 4 + Math.round(Math.random())
      }
    }
  },
  {
    value: 'contrast',
    label: '对比反差型',
    type: 'success' as const,
    generate: (title: string, scene: string): TitleResult => {
      const templates = [
        () => `同样是${extractCore(title)}，为什么有的人年薪百万，有的人月薪3千？`,
        () => `${title}前我以为很难，${title.replace('如何', '')}后才发现这么简单`,
        () => `穷人${extractCore(title)}靠蛮力，富人${extractCore(title)}靠这招`,
        () => `月薪3千和月薪3万的人，${extractCore(title)}的差别竟然这么大`,
        () => `普通人${extractCore(title)}vs高手${extractCore(title)}，差距到底在哪里？`
      ]
      const pick = templates[Math.floor(Math.random() * templates.length)]
      return {
        title: pick(),
        strategy: 'contrast',
        strategyLabel: '对比反差型',
        logic: '通过强烈的对比（穷vs富、普通vs高手、难vs简单）制造认知冲突和心理落差，激发读者的攀比心理和求知欲，想知道"别人是怎么做的""差距在哪"。',
        scenario: scene === 'wechat' ? '职场成长、个人提升类公众号文章，打开率极高' :
                  scene === 'video' ? '对比测评类短视频，引发用户站队和讨论' :
                  scene === 'ecommerce' ? '产品对比类详情页，突出自家产品优势' :
                  '知乎问答、小红书测评等内容平台，增加互动量',
        rating: 4 + Math.round(Math.random())
      }
    }
  },
  {
    value: 'benefit',
    label: '利益驱动型',
    type: 'warning' as const,
    generate: (title: string, scene: string): TitleResult => {
      const templates = [
        () => `${title}，学会后工资翻倍`,
        () => `学会${extractCore(title)}，一年省下好几万`,
        () => `${title}最有效的方法，学会一个受用终身`,
        () => `傻瓜式${extractCore(title)}教程，0基础也能快速上手`,
        () => `${extractCore(title)}的正确姿势，帮你少走3年弯路`
      ]
      const pick = templates[Math.floor(Math.random() * templates.length)]
      return {
        title: pick(),
        strategy: 'benefit',
        strategyLabel: '利益驱动型',
        logic: '直接点明读者能获得的实际利益（工资翻倍、省钱、少走弯路、受用终身），用功利性价值驱动点击，让用户明确知道"看了对我有什么好处"。',
        scenario: scene === 'ecommerce' ? '电商产品标题，直击痛点促进下单转化' :
                  scene === 'wechat' ? '技能教程、知识付费类推文，提升转化率' :
                  scene === 'video' ? '教学类短视频，吸引想快速上手的用户' :
                  '小红书种草笔记、知乎好物推荐，提升种草转化率',
        rating: 4 + Math.round(Math.random())
      }
    }
  },
  {
    value: 'question',
    label: '疑问引导型',
    type: 'info' as const,
    generate: (title: string, scene: string): TitleResult => {
      const templates = [
        () => `${title}？看完这篇你就懂了`,
        () => `为什么聪明人都在用这个方法${extractCore(title)}？`,
        () => `${extractCore(title)}到底有多重要？90%的人都低估了`,
        () => `还在发愁${title}？这篇文章给你答案`,
        () => `${extractCore(title)}的终极答案，终于找到了`
      ]
      const pick = templates[Math.floor(Math.random() * templates.length)]
      return {
        title: pick(),
        strategy: 'question',
        strategyLabel: '疑问引导型',
        logic: '用提问的方式直接命中读者心中的疑问，暗示文章中有答案和解决方案，形成"提出问题-解决问题"的心理期待，吸引带着问题搜索的精准用户。',
        scenario: scene === 'wechat' ? '问题解答类、知识科普类公众号文章，匹配搜索关键词' :
                  scene === 'video' ? '问答类短视频，适配搜索流量' :
                  scene === 'ecommerce' ? '常见问题类详情页模块，打消购买顾虑' :
                  '知乎问答、百度知道等问答平台，获取精准搜索流量',
        rating: 4 + Math.round(Math.random())
      }
    }
  },
  {
    value: 'story',
    label: '故事叙述型',
    type: '' as const,
    generate: (title: string, scene: string): TitleResult => {
      const templates = [
        () => `我用了3年时间才明白，${title}的真谛其实是…`,
        () => `从0到月入5万，我靠的就是${extractCore(title)}这几招`,
        () => `朋友小李${extractCore(title)}失败了100次，第101次终于成功了`,
        () => `北漂5年，${extractCore(title)}让我在这座城市站稳了脚跟`,
        () => `一个95后姑娘的自白：${title}改变了我的人生`
      ]
      const pick = templates[Math.floor(Math.random() * templates.length)]
      return {
        title: pick(),
        strategy: 'story',
        strategyLabel: '故事叙述型',
        logic: '以第一人称或第三人称的故事切入，用具体的时间（3年、5年、100次）、人物（小李、95后姑娘）和经历制造真实感和代入感，让读者想知道"后来怎么样了"。',
        scenario: scene === 'social' ? '小红书个人经历分享、微博长文，引发评论和共鸣' :
                  scene === 'video' ? '个人vlog、励志类短视频，提升粉丝粘性' :
                  scene === 'wechat' ? '人物故事、励志成长类公众号文章，打开率和完读率双高' :
                  '品牌故事类电商详情页，用真实故事增强信任感',
        rating: 4 + Math.round(Math.random())
      }
    }
  },
  {
    value: 'hotspot',
    label: '热点蹭流型',
    type: 'danger' as const,
    generate: (title: string, scene: string): TitleResult => {
      const hotwords = ['火爆全网', '全网都在学', '朋友圈刷屏', '2024最新', '内卷', '躺平', '破圈', '逆袭']
      const hw = hotwords[Math.floor(Math.random() * hotwords.length)]
      const templates = [
        () => `${hw}！${title}为什么突然火了？`,
        () => `${title}｜${hw}的方法论到底是什么？`,
        () => `被${hw}的${extractCore(title)}，究竟有什么魔力？`,
        () => `${hw}的人，都在用这个${extractCore(title)}方法`,
        () => `还不知道${extractCore(title)}？你已经out了`
      ]
      const pick = templates[Math.floor(Math.random() * templates.length)]
      return {
        title: pick(),
        strategy: 'hotspot',
        strategyLabel: '热点蹭流型',
        logic: `借用热点词汇"${hw}"营造流行感和紧迫感，让读者产生"再不看就跟不上了"的焦虑心理，借助热点的搜索热度和话题流量获取更多曝光。`,
        scenario: scene === 'video' ? '紧跟热点的短视频，蹭平台话题流量' :
                  scene === 'social' ? '微博话题、小红书热点笔记，获取平台推荐' :
                  scene === 'wechat' ? '热点解读、趋势分析类公众号文章，提升传播' :
                  '电商活动期间的产品标题，借势节日热点流量',
        rating: 3 + Math.round(Math.random() * 2)
      }
    }
  }
]

const originalTitle = ref('')
const selectedScene = ref('wechat')
const selectedStyles = ref<string[]>([])
const isGenerating = ref(false)
const generatedResults = ref<TitleResult[]>([])
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const currentStep = computed(() => {
  if (generatedResults.value.length > 0 && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (selectedScene.value) return 1
  return 0
})

const canGenerate = computed(() => {
  return originalTitle.value.trim().length > 0
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  if (showAllHistory.value) return reversed
  return reversed.slice(0, 10)
})

const extractCore = (title: string): string => {
  let core = title
    .replace(/^如何|怎样|怎么|为什么|什么是|什么叫|如何做到|如何学好|如何提高|如何学习|如何开始|新手如何|到底如何/g, '')
    .replace(/的方法|的技巧|的秘诀|的秘密|的核心|的本质|的真相|是什么|为什么|怎么做|怎么办/g, '')
    .trim()
  if (core.length > 8) {
    core = core.substring(0, 8)
  }
  if (core.length === 0) {
    core = title.substring(0, 6)
  }
  return core
}

const applySample = (sample: string) => {
  originalTitle.value = sample
}

const getStrategyType = (strategy: string): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const found = strategies.find(s => s.value === strategy)
  return found?.type || 'info'
}

const getSceneLabel = (scene: string) => {
  const found = scenes.find(s => s.value === scene)
  return found?.label || scene
}

const generateTitles = async () => {
  if (!originalTitle.value.trim()) {
    ElMessage.warning('请输入原始标题')
    return
  }

  isGenerating.value = true
  generatedResults.value = []

  await new Promise(resolve => setTimeout(resolve, 800))

  let activeStrategies = strategies
  if (selectedStyles.value.length > 0) {
    activeStrategies = strategies.filter(s => selectedStyles.value.includes(s.value))
  }

  const shuffled = [...activeStrategies].sort(() => Math.random() - 0.5)
  const count = Math.min(6, shuffled.length)
  const selected = shuffled.slice(0, count)

  for (let i = 0; i < selected.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const result = selected[i].generate(originalTitle.value.trim(), selectedScene.value)
    generatedResults.value.push(result)
  }

  isGenerating.value = false

  history.value.push({
    originalTitle: originalTitle.value.trim(),
    scene: selectedScene.value,
    results: [...generatedResults.value],
    time: new Date().toISOString()
  })
  saveHistory()

  ElMessage.success({
    message: `✨ 已生成 ${generatedResults.value.length} 个标题方案`,
    type: 'success',
    duration: 2500,
    showClose: true
  })
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('已复制到剪贴板')
  }
}

const copyWithExplanation = async (result: TitleResult) => {
  const text = `【标题】${result.title}\n\n【改写策略】${result.strategyLabel}\n\n【改写逻辑】${result.logic}\n\n【适用场景】${result.scenario}`
  await copyText(text)
}

const resetAll = () => {
  originalTitle.value = ''
  selectedStyles.value = []
  selectedScene.value = 'wechat'
  generatedResults.value = []
}

const loadHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      history.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
}

const saveHistory = () => {
  try {
    if (history.value.length > 50) {
      history.value = history.value.slice(-50)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

const clearHistory = () => {
  history.value = []
  localStorage.removeItem(STORAGE_KEY)
  ElMessage.success('历史记录已清空')
}

const loadFromHistory = (item: HistoryItem) => {
  originalTitle.value = item.originalTitle
  selectedScene.value = item.scene
  generatedResults.value = item.results
  ElMessage.info('已载入历史记录')
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

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.title-rewriter {
  max-width: 960px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.main-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.card-header .el-tag {
  margin-left: 12px;
  font-weight: normal;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.input-section {
  margin-bottom: 24px;
}

.quick-samples {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.sample-label {
  font-size: 13px;
  color: #606266;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.sample-tag:hover {
  background-color: #ecf5ff;
  border-color: #165DFF;
  color: #165DFF;
}

.scene-section {
  margin-bottom: 24px;
}

.scene-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.scene-card {
  padding: 16px 12px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.scene-card:hover:not(.disabled) {
  border-color: #165DFF;
  background: #ecf5ff;
  transform: translateY(-2px);
}

.scene-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  box-shadow: 0 4px 16px rgba(22, 93, 255, 0.2);
}

.scene-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.scene-emoji {
  font-size: 32px;
  margin-bottom: 8px;
}

.scene-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.scene-desc {
  font-size: 12px;
  color: #909399;
}

.style-section {
  margin-bottom: 24px;
}

.action-section {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.generate-btn {
  width: 240px;
  height: 52px;
  font-size: 16px;
}

.generate-btn:deep(.el-icon.is-loading) {
  width: 18px;
  height: 18px;
  margin-right: 4px;
}

.btn-loading-text {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.generating-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  border-radius: 12px;
  color: #fff;
  animation: status-pulse 1.5s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

.generating-dots {
  display: flex;
  gap: 6px;
}

.generating-dots .dot {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  animation: dot-bounce 1.2s ease-in-out infinite;
}

.generating-dots .dot:nth-child(2) { animation-delay: 0.2s; }
.generating-dots .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

.generating-text {
  font-size: 15px;
  font-weight: 600;
}

.result-card {
  margin-bottom: 24px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff 0%, #fafbfc 100%);
  transition: all 0.3s ease;
}

.result-item:hover {
  border-color: #165DFF;
  box-shadow: 0 4px 16px rgba(22, 93, 255, 0.1);
}

.result-item.result-appear {
  animation: result-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes result-enter {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-score {
  display: flex;
  align-items: center;
  gap: 6px;
}

.score-label {
  font-size: 12px;
  color: #909399;
}

.result-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.result-title:hover {
  background: linear-gradient(135deg, #e6f4ff 0%, #d9ecff 100%);
}

.title-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  line-height: 1.6;
  flex: 1;
}

.copy-icon {
  color: #165DFF;
  font-size: 18px;
  flex-shrink: 0;
}

.result-details {
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-content {
  flex: 1;
  line-height: 1.7;
}

.detail-label {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.detail-text {
  font-size: 13px;
  color: #606266;
}

.result-actions {
  display: flex;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px dashed #ebeef5;
}

.history-card {
  margin-bottom: 24px;
}

.history-card .card-header {
  justify-content: space-between;
}

.history-list {
  max-height: 360px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #ebeef5;
  gap: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: #f5f7fa;
}

.history-item:last-child {
  border-bottom: none;
}

.history-time {
  font-size: 12px;
  color: #909399;
  min-width: 90px;
}

.history-original {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.history-text {
  font-size: 14px;
  color: #303133;
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
  .scene-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-section {
    flex-direction: column;
  }

  .generate-btn {
    width: 100%;
  }

  .result-body {
    flex-direction: column;
    text-align: center;
  }

  .result-meta,
  .result-tags,
  .result-ways {
    justify-content: center;
  }

  .history-item {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
