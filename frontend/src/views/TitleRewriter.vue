<template>
  <div class="title-rewriter">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>功能说明 & 结果预期</span>
        </div>
      </template>
      <el-steps :active="currentStep" finish-status="success" simple class="guide-steps">
        <el-step title="输入原始标题" description="输入你想要改写的文章/内容标题" />
        <el-step title="选择发布场景" description="适配公众号、短视频、电商等不同场景" />
        <el-step title="设置输出数量" description="可选 4 / 6 / 8 个版本，覆盖不同策略" />
        <el-step title="查看与复制" description="查看改写逻辑和适用场景，一键复制使用" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Collection /></el-icon>
            <div class="exp-text">
              <div class="exp-num">4 ~ 8 个版本</div>
              <div class="exp-label">每次生成可自选数量</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">8 种改写策略</div>
              <div class="exp-label">悬念 / 数字 / 情感 / 对比等</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Grid /></el-icon>
            <div class="exp-text">
              <div class="exp-num">4 大渠道深度适配</div>
              <div class="exp-label">字数 / emoji / 语气 / 关键词</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Bulb /></el-icon>
            <div class="exp-text">
              <div class="exp-num">3 层改写信息</div>
              <div class="exp-label">标题 + 改写逻辑 + 适用场景</div>
            </div>
          </div>
        </div>
        <el-divider />
        <h4 class="expectation-title">🎯 各渠道差异维度说明</h4>
        <div class="channel-diff-table">
          <div class="diff-row diff-header">
            <div class="diff-col">差异维度</div>
            <div class="diff-col">📱 公众号</div>
            <div class="diff-col">🎬 短视频</div>
            <div class="diff-col">🛒 电商</div>
            <div class="diff-col">💬 社交</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">推荐字数</div>
            <div class="diff-col">15 ~ 30 字</div>
            <div class="diff-col">8 ~ 18 字</div>
            <div class="diff-col">20 ~ 40 字</div>
            <div class="diff-col">10 ~ 25 字</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">emoji 密度</div>
            <div class="diff-col">偶尔点缀</div>
            <div class="diff-col">1~3个 / 标题</div>
            <div class="diff-col">促销 emoji</div>
            <div class="diff-col">丰富多样</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">关键词偏好</div>
            <div class="diff-col">干货、深度、揭秘</div>
            <div class="diff-col">绝了、必看、惊了</div>
            <div class="diff-col">热销、爆款、限量</div>
            <div class="diff-col">#话题、种草、分享</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">语气风格</div>
            <div class="diff-col">专业、权威</div>
            <div class="diff-col">夸张、口语化</div>
            <div class="diff-col">促销、紧迫感</div>
            <div class="diff-col">亲切、分享感</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">结构特征</div>
            <div class="diff-col">主标题 + 副标题感</div>
            <div class="diff-col">短句、断句多</div>
            <div class="div-col">卖点堆叠、利益前置</div>
            <div class="diff-col">问句 / 感叹 / 话题</div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <Edit />
          </el-icon>
          <span>AI 标题改写</span>
          <el-tag size="small" type="warning">多策略 · 多渠道 · 多版本</el-tag>
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
          <el-tag size="small" type="info" class="scene-hint-tag">
            不同场景的字数、emoji、关键词、语气均会自动适配
          </el-tag>
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
            <div class="scene-spec">
              <span>{{ scene.spec }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="count-section">
        <div class="section-title">
          <el-icon><Select /></el-icon>
          <span>输出版本数量</span>
          <el-tag size="small" type="success">默认 6 个版本，覆盖主要策略</el-tag>
        </div>
        <div class="count-options">
          <div
            v-for="opt in countOptions"
            :key="opt.value"
            class="count-card"
            :class="{ active: outputCount === opt.value, disabled: isGenerating }"
            @click="!isGenerating && (outputCount = opt.value)"
          >
            <div class="count-num">{{ opt.value }}</div>
            <div class="count-label">个版本</div>
            <div class="count-desc">{{ opt.desc }}</div>
          </div>
        </div>
      </div>

      <div class="style-section">
        <div class="section-title">
          <el-icon><MagicStick /></el-icon>
          <span>改写策略（可选，不选则全量覆盖）</span>
        </div>
        <div class="style-options">
          <div
            v-for="style in allStyles"
            :key="style.value"
            class="style-chip"
            :class="{ active: selectedStyles.includes(style.value), disabled: isGenerating }"
            @click="!isGenerating && toggleStyle(style.value)"
          >
            <span class="style-chip-emoji">{{ style.emoji }}</span>
            <span class="style-chip-label">{{ style.label }}</span>
          </div>
        </div>
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
              AI 正在生成 {{ outputCount }} 个 {{ getSceneLabel(selectedScene) }} 版本
            </span>
          </template>
          生成 {{ outputCount }} 个标题版本
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
        <span class="generating-text">
          ✨ AI 正在基于 {{ selectedStyles.length > 0 ? selectedStyles.length : 8 }} 种策略
          为 {{ getSceneLabel(selectedScene) }} 场景生成 {{ outputCount }} 个差异化标题…
        </span>
      </div>
    </el-card>

    <el-card v-if="generatedResults.length > 0" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>改写结果</span>
          <el-tag size="small" type="success">
            共 {{ generatedResults.length }} 个版本 · {{ getSceneLabel(selectedScene) }} 场景
          </el-tag>
          <el-button size="small" type="primary" link :icon="CopyDocument" @click="copyAllTitles">
            复制全部标题
          </el-button>
        </div>
      </template>

      <div class="result-list">
        <div
          v-for="(result, index) in generatedResults"
          :key="index"
          class="result-item"
          :class="{ 'result-appear': true }"
          :style="{ animationDelay: index * 0.08 + 's' }"
        >
          <div class="result-header">
            <div class="result-header-left">
              <div class="result-index">#{{ index + 1 }}</div>
              <el-tag :type="getStrategyType(result.strategy)" size="small" effect="dark">
                {{ result.strategyLabel }}
              </el-tag>
              <el-tag size="small" effect="plain" class="channel-tag">
                {{ getSceneLabel(result.scene) }} · {{ result.title.length }}字
              </el-tag>
            </div>
            <div class="result-score">
              <el-rate v-model="result.rating" disabled size="small" />
              <span class="score-label">吸引力</span>
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
            <div class="detail-item">
              <el-icon color="#67c23a"><DataLine /></el-icon>
              <div class="detail-content">
                <span class="detail-label">渠道特征：</span>
                <span class="detail-text">{{ result.channelFeature }}</span>
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
            <el-button size="small" :icon="RefreshRight" @click="regenerateOne(index)">
              换一个
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
          <div class="history-meta">
            <el-tag size="small">{{ getSceneLabel(item.scene) }}</el-tag>
            <el-tag size="small" type="success">{{ item.results.length }}个版本</el-tag>
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
  InfoFilled,
  Collection,
  DataLine,
  Select,
  RefreshRight
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface TitleResult {
  title: string
  strategy: string
  strategyLabel: string
  logic: string
  scenario: string
  channelFeature: string
  scene: string
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

const countOptions = [
  { value: 4, label: '4个', desc: '精选核心策略' },
  { value: 6, label: '6个', desc: '覆盖主流需求' },
  { value: 8, label: '8个', desc: '全策略探索' }
]

const scenes = [
  {
    value: 'wechat',
    label: '公众号推文',
    emoji: '📱',
    desc: '深度长文、知识分享',
    spec: '15~30字 · 专业权威',
    config: {
      minLen: 15,
      maxLen: 30,
      emojiChance: 0.15,
      tone: 'professional',
      keywords: ['深度', '揭秘', '重磅', '干货', '必读', '收藏', '万字长文', '最全整理'],
      channelEmojis: ['📌', '💡', '🔍', '📖', '✨']
    }
  },
  {
    value: 'video',
    label: '短视频',
    emoji: '🎬',
    desc: '抖音、快手、视频号',
    spec: '8~18字 · 夸张吸睛',
    config: {
      minLen: 8,
      maxLen: 18,
      emojiChance: 0.85,
      tone: 'dramatic',
      keywords: ['绝了', '必看', '惊了', '看完', '太绝了', '谁敢信', '离谱', '破防了'],
      channelEmojis: ['🔥', '😱', '💥', '👀', '⚠️', '✨', '💯', '🚀']
    }
  },
  {
    value: 'ecommerce',
    label: '电商详情页',
    emoji: '🛒',
    desc: '淘宝、京东、拼多多',
    spec: '20~40字 · 促销紧迫感',
    config: {
      minLen: 20,
      maxLen: 40,
      emojiChance: 0.5,
      tone: 'promotional',
      keywords: ['热销', '爆款', '限量', '限时', '特惠', '直降', '包邮', '官方正品', '买一送一'],
      channelEmojis: ['🔥', '💰', '🎁', '⚡', '🏆', '💎', '✅', '🚚']
    }
  },
  {
    value: 'social',
    label: '社交媒体',
    emoji: '💬',
    desc: '微博、小红书、朋友圈',
    spec: '10~25字 · 亲切分享',
    config: {
      minLen: 10,
      maxLen: 25,
      emojiChance: 0.7,
      tone: 'friendly',
      keywords: ['种草', '分享', '安利', '宝藏', '绝绝子', 'yyds', '亲测', '姐妹们'],
      channelEmojis: ['💕', '🌸', '🌿', '✨', '💖', '🎀', '🍀', '☀️']
    }
  }
]

const allStyles = [
  { value: 'suspense', label: '悬念好奇型', emoji: '🔮' },
  { value: 'number', label: '数字清单型', emoji: '🔢' },
  { value: 'emotion', label: '情感共鸣型', emoji: '💭' },
  { value: 'contrast', label: '对比反差型', emoji: '⚖️' },
  { value: 'benefit', label: '利益驱动型', emoji: '🎯' },
  { value: 'story', label: '故事叙述型', emoji: '📖' },
  { value: 'question', label: '疑问引导型', emoji: '❓' },
  { value: 'hotspot', label: '热点蹭流型', emoji: '🔥' }
]

const originalTitle = ref('')
const selectedScene = ref('wechat')
const outputCount = ref(6)
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

const getSceneConfig = (scene: string) => {
  const found = scenes.find(s => s.value === scene)
  return found?.config || scenes[0].config
}

const extractCore = (title: string): string => {
  let core = title
    .replace(/^如何|怎样|怎么|为什么|什么是|什么叫|如何做到|如何学好|如何提高|如何学习|如何开始|新手如何|到底如何|关于/g, '')
    .replace(/的方法|的技巧|的秘诀|的秘密|的核心|的本质|的真相|是什么|为什么|怎么做|怎么办|推荐|分享|攻略|指南|教程/g, '')
    .trim()
  if (core.length > 8) {
    core = core.substring(0, 8)
  }
  if (core.length === 0) {
    core = title.substring(0, Math.min(6, title.length))
  }
  return core
}

const applySample = (sample: string) => {
  originalTitle.value = sample
}

const toggleStyle = (value: string) => {
  const idx = selectedStyles.value.indexOf(value)
  if (idx > -1) {
    selectedStyles.value.splice(idx, 1)
  } else {
    selectedStyles.value.push(value)
  }
}

const getStrategyType = (strategy: string): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
    suspense: 'warning',
    number: 'primary',
    emotion: 'danger',
    contrast: 'success',
    benefit: 'warning',
    question: 'info',
    story: '',
    hotspot: 'danger'
  }
  return map[strategy] || 'info'
}

const getSceneLabel = (scene: string) => {
  const found = scenes.find(s => s.value === scene)
  return found?.label || scene
}

const addChannelEmoji = (text: string, scene: string): string => {
  const config = getSceneConfig(scene)
  if (Math.random() > config.emojiChance) return text
  const emoji = config.channelEmojis[Math.floor(Math.random() * config.channelEmojis.length)]
  const positions = ['before', 'after', 'both']
  const pos = positions[Math.floor(Math.random() * positions.length)]
  if (pos === 'before') return `${emoji} ${text}`
  if (pos === 'after') return `${text} ${emoji}`
  return `${emoji} ${text} ${emoji}`
}

const addChannelKeywords = (text: string, scene: string): string => {
  const config = getSceneConfig(scene)
  if (Math.random() > 0.4) return text
  const kw = config.keywords[Math.floor(Math.random() * config.keywords.length)]
  if (scene === 'ecommerce') return `${kw}！${text}`
  if (scene === 'social') return `${text} | ${kw}`
  if (scene === 'video') return `${kw}！${text}`
  return `【${kw}】${text}`
}

const adjustForScene = (text: string, scene: string): string => {
  const config = getSceneConfig(scene)
  let result = text

  if (scene === 'video') {
    result = result.replace(/，/g, '！').replace(/。/g, '')
    if (result.length > config.maxLen) {
      result = result.substring(0, config.maxLen)
    }
    if (!/[！？]$/.test(result)) {
      result = result + '！'
    }
  } else if (scene === 'ecommerce') {
    if (!result.includes('【') && !result.includes('限时') && !result.includes('爆款')) {
      result = addChannelKeywords(result, scene)
    }
  } else if (scene === 'social') {
    if (Math.random() > 0.5 && !result.includes('#')) {
      const core = extractCore(originalTitle.value || result)
      result = `${result} #${core}#`
    }
  }

  result = addChannelEmoji(result, scene)

  if (result.length > config.maxLen + 5) {
    result = result.substring(0, config.maxLen + 5)
  }

  return result
}

const getChannelFeature = (scene: string): string => {
  const config = getSceneConfig(scene)
  const toneMap: Record<string, string> = {
    professional: '专业权威语气，适合知识分享型内容，emoji点缀克制，突出内容价值感',
    dramatic: '夸张口语化风格，短句多感叹号，emoji密度高，3秒内必须抓住眼球',
    promotional: '促销紧迫感语气，利益点前置，突出销量/优惠/正品背书，刺激下单',
    friendly: '亲切分享语气，像朋友种草推荐，emoji丰富活泼，带话题标签增加曝光'
  }
  return `字数控制在 ${config.minLen}-${config.maxLen} 字 · ${toneMap[config.tone]}`
}

const strategyTemplates = {
  suspense: {
    label: '悬念好奇型',
    type: 'warning' as const,
    templates: [
      (core: string, full: string) => `99%的人都不知道的${core}秘密，看完我沉默了`,
      (core: string, full: string) => `为什么${full}？真相让人意想不到`,
      (core: string, full: string) => `${core}的背后，竟然藏着这样的玄机`,
      (core: string, full: string) => `千万别轻易尝试${core}，除非你知道这些`,
      (core: string, full: string) => `关于${core}，你可能一直都理解错了`
    ],
    logic: '利用信息差和未知感制造悬念，通过"秘密""真相""竟然"等词汇激发读者的好奇心和探索欲，让用户产生"我必须点进去看看"的冲动。',
    scenario: '',
    channelFeature: ''
  },
  number: {
    label: '数字清单型',
    type: 'primary' as const,
    templates: [
      (core: string, full: string, num: number) => `${full}？这${num}个方法让你事半功倍`,
      (core: string, full: string, num: number) => `掌握这${num}个${core}技巧，想不优秀都难`,
      (core: string, full: string, num: number) => `${num}个超实用的${core}方法，第${Math.ceil(num / 2)}个绝了`,
      (core: string, full: string, num: number) => `${full}的${num}个核心要点，学会一个就赚了`,
      (core: string, full: string, num: number) => `干货 | ${num}分钟带你搞懂${core}`
    ],
    logic: '用具体数字增强标题的具象感和权威性，让读者对内容量有明确预期，同时"干货""绝了""赚了"等词汇暗示高价值，降低决策成本。',
    scenario: '',
    channelFeature: ''
  },
  emotion: {
    label: '情感共鸣型',
    type: 'danger' as const,
    templates: [
      (core: string, full: string) => `看完${full}，我偷偷哭了半小时`,
      (core: string, full: string) => `${full}，是每个成年人都逃不过的宿命`,
      (core: string, full: string) => `致正在${core}的你：请一定好好爱自己`,
      (core: string, full: string) => `${full}的那一刻，我终于释怀了`,
      (core: string, full: string) => `如果早知道${core}是这样，我绝不会…`
    ],
    logic: '通过代入感强的情感表达（"哭了""释怀了""请一定好好爱自己"），唤起读者的情绪共鸣和身份认同，让标题产生"说的就是我"的代入效果。',
    scenario: '',
    channelFeature: ''
  },
  contrast: {
    label: '对比反差型',
    type: 'success' as const,
    templates: [
      (core: string, full: string) => `同样是${core}，为什么有的人年薪百万，有的人月薪3千？`,
      (core: string, full: string) => `${full}前我以为很难，${core}后才发现这么简单`,
      (core: string, full: string) => `穷人${core}靠蛮力，富人${core}靠这招`,
      (core: string, full: string) => `月薪3千和月薪3万的人，${core}的差别竟然这么大`,
      (core: string, full: string) => `普通人${core}vs高手${core}，差距到底在哪里？`
    ],
    logic: '通过强烈的对比（穷vs富、普通vs高手、难vs简单）制造认知冲突和心理落差，激发读者的攀比心理和求知欲，想知道"别人是怎么做的""差距在哪"。',
    scenario: '',
    channelFeature: ''
  },
  benefit: {
    label: '利益驱动型',
    type: 'warning' as const,
    templates: [
      (core: string, full: string) => `${full}，学会后工资翻倍`,
      (core: string, full: string) => `学会${core}，一年省下好几万`,
      (core: string, full: string) => `${full}最有效的方法，学会一个受用终身`,
      (core: string, full: string) => `傻瓜式${core}教程，0基础也能快速上手`,
      (core: string, full: string) => `${core}的正确姿势，帮你少走3年弯路`
    ],
    logic: '直接点明读者能获得的实际利益（工资翻倍、省钱、少走弯路、受用终身），用功利性价值驱动点击，让用户明确知道"看了对我有什么好处"。',
    scenario: '',
    channelFeature: ''
  },
  question: {
    label: '疑问引导型',
    type: 'info' as const,
    templates: [
      (core: string, full: string) => `${full}？看完这篇你就懂了`,
      (core: string, full: string) => `为什么聪明人都在用这个方法${core}？`,
      (core: string, full: string) => `${core}到底有多重要？90%的人都低估了`,
      (core: string, full: string) => `还在发愁${full}？这篇文章给你答案`,
      (core: string, full: string) => `${core}的终极答案，终于找到了`
    ],
    logic: '用提问的方式直接命中读者心中的疑问，暗示文章中有答案和解决方案，形成"提出问题-解决问题"的心理期待，吸引带着问题搜索的精准用户。',
    scenario: '',
    channelFeature: ''
  },
  story: {
    label: '故事叙述型',
    type: '' as const,
    templates: [
      (core: string, full: string) => `我用了3年时间才明白，${full}的真谛其实是…`,
      (core: string, full: string) => `从0到月入5万，我靠的就是${core}这几招`,
      (core: string, full: string) => `朋友小李${core}失败了100次，第101次终于成功了`,
      (core: string, full: string) => `北漂5年，${core}让我在这座城市站稳了脚跟`,
      (core: string, full: string) => `一个95后姑娘的自白：${full}改变了我的人生`
    ],
    logic: '以第一人称或第三人称的故事切入，用具体的时间（3年、5年、100次）、人物（小李、95后姑娘）和经历制造真实感和代入感，让读者想知道"后来怎么样了"。',
    scenario: '',
    channelFeature: ''
  },
  hotspot: {
    label: '热点蹭流型',
    type: 'danger' as const,
    templates: [
      (core: string, full: string) => `火爆全网！${full}为什么突然火了？`,
      (core: string, full: string) => `${full}｜全网都在学的方法论到底是什么？`,
      (core: string, full: string) => `被朋友圈刷屏的${core}，究竟有什么魔力？`,
      (core: string, full: string) => `2024最新趋势，都在用这个${core}方法`,
      (core: string, full: string) => `还不知道${core}？你已经out了`
    ],
    logic: '借用热点词汇（火爆全网、朋友圈刷屏、2024最新）营造流行感和紧迫感，让读者产生"再不看就跟不上了"的焦虑心理，借助热点的搜索热度和话题流量获取更多曝光。',
    scenario: '',
    channelFeature: ''
  }
}

const getScenarioText = (strategy: string, scene: string): string => {
  const map: Record<string, Record<string, string>> = {
    suspense: {
      wechat: '公众号文章首条/次条标题，制造信息差悬念提升打开率，适合深度揭秘、知识科普类内容',
      video: '短视频封面标题，3秒内抓住用户好奇心，提升完播率和进主页转化率',
      ecommerce: '商品详情页卖点标题，激发消费者"原来还有这门道"的深入了解欲望',
      social: '微博/小红书话题标题，引导用户点击讨论，适合避雷、科普类话题'
    },
    number: {
      wechat: '公众号干货文章、知识分享类推文，"X个方法"结构天然适合收藏和转发',
      video: '教程类、知识类短视频标题，数字吸引精准学习型用户停留',
      ecommerce: '产品卖点罗列，突出产品功能的丰富性和"X大优势"的权威性',
      social: '小红书种草笔记、知乎回答等深度内容平台，清单体适合收藏和二次传播'
    },
    emotion: {
      wechat: '情感类、人生感悟类公众号文章，引发读者共鸣和转发，打开率和完读率双高',
      video: '情感类、生活记录类短视频，提升评论和分享率，容易引发用户跟风拍摄',
      ecommerce: '品牌故事、用户故事类电商详情页，用情感共鸣提升品牌好感度和信任感',
      social: '朋友圈文案、微博情感话题，引发点赞和评论互动，适合深夜emo、人生感悟类内容'
    },
    contrast: {
      wechat: '职场成长、个人提升类公众号文章，对比反差感极强，打开率远超平均水平',
      video: '对比测评类短视频，引发用户站队和评论讨论，互动率高',
      ecommerce: '产品对比类详情页、"vs"型测评内容，突出自家产品优势',
      social: '知乎问答、小红书测评等内容平台，增加互动量和讨论热度'
    },
    benefit: {
      wechat: '技能教程、知识付费类推文，直接点明学习收益，提升转化率',
      video: '教学类、教程类短视频，吸引想快速上手的用户，用户画像精准',
      ecommerce: '电商产品主标题，直击消费者痛点，促进下单转化',
      social: '小红书种草笔记、知乎好物推荐，利益点清晰，提升种草转化率'
    },
    question: {
      wechat: '问题解答类、知识科普类公众号文章，匹配用户搜索关键词，适合SEO流量',
      video: '问答类短视频，适配平台搜索流量，精准匹配用户查询意图',
      ecommerce: '常见问题类详情页模块，用反问打消购买顾虑，降低决策门槛',
      social: '知乎问答、百度知道等问答平台，获取精准搜索流量，长尾效应好'
    },
    story: {
      wechat: '人物故事、励志成长类公众号文章，故事感强，打开率和完读率双高',
      video: '个人vlog、励志类短视频，提升粉丝粘性和认同感',
      ecommerce: '品牌故事类电商详情页，用真实故事增强信任感和品牌温度',
      social: '小红书个人经历分享、微博长文，引发评论和共鸣，容易产生UGC'
    },
    hotspot: {
      wechat: '热点解读、趋势分析类公众号文章，借势热点流量快速起量',
      video: '紧跟热点话题的短视频，蹭平台话题流量池，容易被推荐',
      ecommerce: '电商活动期间的产品标题，借势节日热点和平台大促流量',
      social: '微博热门话题、小红书热点笔记，获取平台算法推荐，曝光量大'
    }
  }
  return map[strategy]?.[scene] || '适合大多数内容发布场景'
}

const generateSingleTitle = (strategyKey: string, scene: string): TitleResult | null => {
  const strategy = strategyTemplates[strategyKey as keyof typeof strategyTemplates]
  if (!strategy) return null

  const core = extractCore(originalTitle.value.trim())
  const full = originalTitle.value.trim()

  const templates = strategy.templates
  const templateFn = templates[Math.floor(Math.random() * templates.length)]

  let rawTitle: string
  if (strategyKey === 'number') {
    const numbers = [3, 5, 7, 8, 10]
    const num = numbers[Math.floor(Math.random() * numbers.length)]
    rawTitle = (templateFn as any)(core, full, num)
    strategy.logic = strategy.logic
  } else {
    rawTitle = (templateFn as any)(core, full)
  }

  const finalTitle = adjustForScene(rawTitle, scene)

  return {
    title: finalTitle,
    strategy: strategyKey,
    strategyLabel: strategy.label,
    logic: strategy.logic,
    scenario: getScenarioText(strategyKey, scene),
    channelFeature: getChannelFeature(scene),
    scene: scene,
    rating: 3 + Math.ceil(Math.random() * 2)
  }
}

const generateTitles = async () => {
  if (!originalTitle.value.trim()) {
    ElMessage.warning('请输入原始标题')
    return
  }

  isGenerating.value = true
  generatedResults.value = []

  await new Promise(resolve => setTimeout(resolve, 600))

  const allStrategyKeys = Object.keys(strategyTemplates)
  let activeStrategies = allStrategyKeys
  if (selectedStyles.value.length > 0) {
    activeStrategies = selectedStyles.value
  }

  const shuffled = [...activeStrategies].sort(() => Math.random() - 0.5)
  let count = Math.min(outputCount.value, shuffled.length)

  if (count < outputCount.value && shuffled.length > 0) {
    while (count < outputCount.value) {
      shuffled.push(shuffled[Math.floor(Math.random() * shuffled.length)])
      count++
    }
  }

  const selected = shuffled.slice(0, outputCount.value)

  for (let i = 0; i < selected.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const result = generateSingleTitle(selected[i], selectedScene.value)
    if (result) {
      generatedResults.value.push(result)
    }
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
    message: `✨ 已为「${getSceneLabel(selectedScene.value)}」场景生成 ${generatedResults.value.length} 个标题方案`,
    type: 'success',
    duration: 3000,
    showClose: true
  })
}

const regenerateOne = async (index: number) => {
  const current = generatedResults.value[index]
  const newResult = generateSingleTitle(current.strategy, selectedScene.value)
  if (newResult) {
    generatedResults.value.splice(index, 1, newResult)
    ElMessage.success('已重新生成该版本')
  }
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

const copyAllTitles = async () => {
  const text = generatedResults.value
    .map((r, i) => `${i + 1}. ${r.title}`)
    .join('\n')
  await copyText(text)
}

const copyWithExplanation = async (result: TitleResult) => {
  const text = `【标题】${result.title}\n\n【改写策略】${result.strategyLabel}\n\n【改写逻辑】${result.logic}\n\n【适用场景】${result.scenario}\n\n【渠道特征】${result.channelFeature}`
  await copyText(text)
}

const resetAll = () => {
  originalTitle.value = ''
  selectedStyles.value = []
  selectedScene.value = 'wechat'
  outputCount.value = 6
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
  max-width: 1000px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.expectation-section {
  padding: 4px 0;
}

.expectation-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.expectation-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 8px;
}

.expectation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef1f6 100%);
  border-radius: 10px;
}

.exp-text {
  flex: 1;
}

.exp-num {
  font-size: 15px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 2px;
}

.exp-label {
  font-size: 12px;
  color: #909399;
}

.channel-diff-table {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
}

.diff-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.2fr 1.2fr 1.2fr;
}

.diff-header {
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
}

.diff-header .diff-col {
  font-weight: 600;
  font-size: 13px;
  color: #fff;
}

.diff-col {
  padding: 12px 14px;
  font-size: 13px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}

.diff-row:last-child .diff-col {
  border-bottom: none;
}

.diff-col:last-child {
  border-right: none;
}

.diff-label {
  font-weight: 600;
  color: #303133;
  background: #f5f7fa;
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

.card-header > :last-child {
  margin-left: auto;
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

.scene-hint-tag {
  margin-left: 8px;
  font-weight: normal;
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
  margin-bottom: 8px;
}

.scene-spec {
  display: inline-block;
  padding: 2px 10px;
  background: rgba(22, 93, 255, 0.1);
  color: #165DFF;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.count-section {
  margin-bottom: 24px;
}

.count-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.count-card {
  padding: 18px 16px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.count-card:hover:not(.disabled) {
  border-color: #165DFF;
  background: #ecf5ff;
  transform: translateY(-2px);
}

.count-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  box-shadow: 0 4px 16px rgba(22, 93, 255, 0.2);
}

.count-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.count-num {
  font-size: 32px;
  font-weight: 700;
  color: #165DFF;
  line-height: 1;
  margin-bottom: 4px;
}

.count-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 6px;
}

.count-desc {
  font-size: 12px;
  color: #909399;
}

.style-section {
  margin-bottom: 24px;
}

.style-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.style-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1.5px solid #ebeef5;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  background: #fff;
  font-size: 13px;
}

.style-chip:hover:not(.disabled) {
  border-color: #165DFF;
  background: #ecf5ff;
}

.style-chip.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
}

.style-chip.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.style-chip-emoji {
  font-size: 15px;
}

.action-section {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.generate-btn {
  width: 300px;
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

.result-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.result-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.channel-tag {
  border-color: #e6a23c;
  color: #e6a23c;
  background: #fdf6ec;
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
  line-height: 1.7;
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
  margin-bottom: 10px;
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

.history-meta {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.history-footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

@media (max-width: 768px) {
  .expectation-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .channel-diff-table {
    overflow-x: auto;
  }

  .diff-row {
    min-width: 700px;
  }

  .scene-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .count-options {
    grid-template-columns: repeat(3, 1fr);
  }

  .action-section {
    flex-direction: column;
  }

  .generate-btn {
    width: 100%;
  }

  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .history-item {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
