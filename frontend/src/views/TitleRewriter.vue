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
        <el-step title="选择发布场景" description="5大场景深度适配，含企业公务B端" />
        <el-step title="设置输出数量" description="可选 4 / 6 / 8 个版本" />
        <el-step title="查看与复制" description="含改写逻辑、适用场景、渠道特征" />
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
              <div class="exp-num">{{ totalStrategyCount }} 种改写策略</div>
              <div class="exp-label">含正式公文型，适配企业场景</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Grid /></el-icon>
            <div class="exp-text">
              <div class="exp-num">5 大渠道深度适配</div>
              <div class="exp-label">新增企业/公务/B端场景</div>
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
            <div class="diff-col">🏢 企业公务</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">推荐字数</div>
            <div class="diff-col">15 ~ 30 字</div>
            <div class="diff-col">8 ~ 18 字</div>
            <div class="diff-col">20 ~ 40 字</div>
            <div class="diff-col">10 ~ 25 字</div>
            <div class="diff-col official">20 ~ 40 字</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">emoji 密度</div>
            <div class="diff-col">偶尔点缀</div>
            <div class="diff-col">1~3个 / 标题</div>
            <div class="diff-col">促销 emoji</div>
            <div class="diff-col">丰富多样</div>
            <div class="diff-col official">❌ 禁用 emoji</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">关键词偏好</div>
            <div class="diff-col">干货、深度、揭秘</div>
            <div class="diff-col">绝了、必看、惊了</div>
            <div class="diff-col">热销、爆款、限量</div>
            <div class="diff-col">#话题、种草、分享</div>
            <div class="diff-col official">关于、通知、公告、决定、印发</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">语气风格</div>
            <div class="diff-col">专业、权威</div>
            <div class="diff-col">夸张、口语化</div>
            <div class="diff-col">促销、紧迫感</div>
            <div class="diff-col">亲切、分享感</div>
            <div class="diff-col official">严谨、正式、客观、中立</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">结构特征</div>
            <div class="diff-col">主标题 + 副标题感</div>
            <div class="diff-col">短句、断句多</div>
            <div class="diff-col">卖点堆叠、利益前置</div>
            <div class="diff-col">问句 / 感叹 / 话题</div>
            <div class="diff-col official">发文机关 + 事由 + 文种</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">娱乐化策略</div>
            <div class="diff-col">部分可用</div>
            <div class="diff-col">鼓励使用</div>
            <div class="diff-col">部分可用</div>
            <div class="diff-col">鼓励使用</div>
            <div class="diff-col official">❌ 自动过滤</div>
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
          :placeholder="currentPlaceholder"
          maxlength="100"
          show-word-limit
          resize="none"
          :disabled="isGenerating"
        />
        <div class="quick-samples">
          <span class="sample-label">📝 快速体验：</span>
          <el-tag
            v-for="(sample, i) in currentQuickSamples"
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
        <div class="scene-options scene-options-5">
          <div
            v-for="scene in scenes"
            :key="scene.value"
            class="scene-card"
            :class="{ active: selectedScene === scene.value, disabled: isGenerating, official: scene.value === 'official' }"
            @click="!isGenerating && handleSceneChange(scene.value)"
          >
            <div class="scene-emoji">{{ scene.emoji }}</div>
            <div class="scene-name">{{ scene.label }}</div>
            <div class="scene-desc">{{ scene.desc }}</div>
            <div class="scene-spec" :class="{ official: scene.value === 'official' }">
              <span>{{ scene.spec }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="count-section">
        <div class="section-title">
          <el-icon><Select /></el-icon>
          <span>输出版本数量</span>
          <el-tag size="small" type="success">默认 6 个版本</el-tag>
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
          <span>改写策略（可选，不选则自动适配场景）</span>
          <el-tag v-if="selectedScene === 'official'" size="small" type="danger" effect="dark">
            ⚠️ 企业公务场景已自动过滤娱乐化策略
          </el-tag>
        </div>
        <div class="style-options">
          <div
            v-for="style in availableStyles"
            :key="style.value"
            class="style-chip"
            :class="{
              active: selectedStyles.includes(style.value),
              disabled: isGenerating,
              official: selectedScene === 'official' && style.officialOnly,
              unavailable: selectedScene === 'official' && style.informal
            }"
            @click="!isGenerating && !style.unavailable && toggleStyle(style.value)"
          >
            <span class="style-chip-emoji">{{ style.emoji }}</span>
            <span class="style-chip-label">{{ style.label }}</span>
            <el-tag v-if="style.officialOnly" size="small" type="success" effect="plain">推荐</el-tag>
            <el-tag v-if="selectedScene === 'official' && style.informal" size="small" type="info" effect="plain">不适用</el-tag>
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

      <div v-if="isGenerating" class="generating-status" :class="{ official: selectedScene === 'official' }">
        <div class="generating-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <span class="generating-text">
          {{ selectedScene === 'official' ? '📋' : '✨' }}
          AI 正在基于 {{ activeStrategyCount }} 种{{ selectedScene === 'official' ? '正式化' : '' }}策略
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
          :class="{ 'result-appear': true, 'result-official': result.scene === 'official' }"
          :style="{ animationDelay: index * 0.08 + 's' }"
        >
          <div class="result-header">
            <div class="result-header-left">
              <div class="result-index" :class="{ official: result.scene === 'official' }">#{{ index + 1 }}</div>
              <el-tag :type="getStrategyType(result.strategy)" size="small" effect="dark">
                {{ result.strategyLabel }}
              </el-tag>
              <el-tag size="small" effect="plain" class="channel-tag">
                {{ getSceneLabel(result.scene) }} · {{ result.title.length }}字
              </el-tag>
            </div>
            <div class="result-score">
              <el-rate v-model="result.rating" disabled size="small" />
              <span class="score-label">{{ selectedScene === 'official' ? '规范度' : '吸引力' }}</span>
            </div>
          </div>
          <div class="result-title" :class="{ official: result.scene === 'official' }" @click="copyText(result.title)">
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
import { ref, computed, onMounted, watch } from 'vue'
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

const quickSamplesByScene: Record<string, string[]> = {
  wechat: ['如何提高工作效率', '年轻人为什么不想结婚', '深度解读：人工智能未来发展趋势', '新手如何开始学习编程'],
  video: ['夏天穿什么衣服显瘦', '月薪5000如何理财', '3分钟学会做红烧肉', '这道菜太好吃了'],
  ecommerce: ['夏季新款连衣裙', '无线蓝牙耳机推荐', '家用空气净化器选购指南', '儿童绘本推荐'],
  social: ['今天天气真好', '周末去哪玩', '分享我的护肤心得', '最近在读的一本书'],
  official: ['关于开展年度绩效考核工作的通知', '公司2024年度工作总结报告', '关于调整组织架构的决定', '关于举办员工培训会议的公告']
}

const placeholderByScene: Record<string, string> = {
  wechat: '请输入原始标题，例如：如何提高工作效率',
  video: '请输入原始标题，例如：这道菜的做法太简单了',
  ecommerce: '请输入原始标题，例如：新款蓝牙耳机推荐',
  social: '请输入原始标题，例如：分享我的旅行经历',
  official: '请输入公文/公告标题，例如：关于召开年度工作会议的通知'
}

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
      channelEmojis: ['📌', '💡', '🔍', '📖', '✨'],
      banWords: []
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
      channelEmojis: ['🔥', '😱', '💥', '👀', '⚠️', '✨', '💯', '🚀'],
      banWords: []
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
      channelEmojis: ['🔥', '💰', '🎁', '⚡', '🏆', '💎', '✅', '🚚'],
      banWords: []
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
      channelEmojis: ['💕', '🌸', '🌿', '✨', '💖', '🎀', '🍀', '☀️'],
      banWords: []
    }
  },
  {
    value: 'official',
    label: '企业公务',
    emoji: '🏢',
    desc: '公告、通知、公文、B端',
    spec: '20~40字 · 严谨正式',
    config: {
      minLen: 20,
      maxLen: 40,
      emojiChance: 0,
      tone: 'official',
      keywords: ['关于', '通知', '公告', '决定', '决议', '印发', '通报', '意见', '方案', '规定'],
      channelEmojis: [],
      banWords: ['绝了', '惊了', '哭了', '破防', 'yyds', '绝绝子', '爆款', '太绝了', '谁敢信', '离谱', '秘辛', '内幕', '震惊']
    }
  }
]

const allStyles = [
  { value: 'suspense', label: '悬念好奇型', emoji: '🔮', informal: false, officialOnly: false },
  { value: 'number', label: '数字清单型', emoji: '🔢', informal: false, officialOnly: false },
  { value: 'emotion', label: '情感共鸣型', emoji: '💭', informal: true, officialOnly: false },
  { value: 'contrast', label: '对比反差型', emoji: '⚖️', informal: true, officialOnly: false },
  { value: 'benefit', label: '利益驱动型', emoji: '🎯', informal: false, officialOnly: false },
  { value: 'story', label: '故事叙述型', emoji: '📖', informal: true, officialOnly: false },
  { value: 'question', label: '疑问引导型', emoji: '❓', informal: false, officialOnly: false },
  { value: 'hotspot', label: '热点蹭流型', emoji: '🔥', informal: true, officialOnly: false },
  { value: 'formal_doc', label: '正式公文型', emoji: '📋', informal: false, officialOnly: true },
  { value: 'formal_announce', label: '公告通知型', emoji: '📢', informal: false, officialOnly: true },
  { value: 'formal_summary', label: '总结报告型', emoji: '📊', informal: false, officialOnly: true },
  { value: 'formal_decision', label: '决议决定型', emoji: '📜', informal: false, officialOnly: true }
]

const originalTitle = ref('')
const selectedScene = ref('wechat')
const outputCount = ref(6)
const selectedStyles = ref<string[]>([])
const isGenerating = ref(false)
const generatedResults = ref<TitleResult[]>([])
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const currentQuickSamples = computed(() => quickSamplesByScene[selectedScene.value] || quickSamplesByScene.wechat)
const currentPlaceholder = computed(() => placeholderByScene[selectedScene.value] || placeholderByScene.wechat)

const availableStyles = computed(() => {
  if (selectedScene.value !== 'official') return allStyles
  return allStyles
})

const totalStrategyCount = computed(() => allStyles.length)

const activeStrategyCount = computed(() => {
  if (selectedStyles.value.length > 0) return selectedStyles.value.length
  if (selectedScene.value === 'official') {
    return allStyles.filter(s => !s.informal).length
  }
  return allStyles.filter(s => !s.officialOnly).length
})

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

const handleSceneChange = (scene: string) => {
  selectedScene.value = scene
  if (scene === 'official') {
    selectedStyles.value = selectedStyles.value.filter(s => {
      const style = allStyles.find(st => st.value === s)
      return style && !style.informal
    })
  }
}

watch(selectedScene, () => {
  generatedResults.value = []
})

const getSceneConfig = (scene: string) => {
  const found = scenes.find(s => s.value === scene)
  return found?.config || scenes[0].config
}

const extractCore = (title: string): string => {
  let core = title
    .replace(/^关于|就|对|为了|根据|按照|依照|遵照|现|特此|现予|兹/g, '')
    .replace(/的通知|的公告|的决定|的决议|的通报|的意见|的方案|的规定|的报告|的总结|的计划$/g, '')
    .replace(/^如何|怎样|怎么|为什么|什么是|什么叫|如何做到|如何学好|如何提高|如何学习|如何开始|新手如何|到底如何|关于/g, '')
    .replace(/的方法|的技巧|的秘诀|的秘密|的核心|的本质|的真相|是什么|为什么|怎么做|怎么办|推荐|分享|攻略|指南|教程/g, '')
    .trim()
  if (core.length > 12) {
    core = core.substring(0, 12)
  }
  if (core.length === 0) {
    core = title.substring(0, Math.min(8, title.length))
  }
  return core
}

const extractSubject = (title: string): string => {
  const core = extractCore(title)
  return core
}

const applySample = (sample: string) => {
  originalTitle.value = sample
}

const toggleStyle = (value: string) => {
  if (selectedScene.value === 'official') {
    const style = allStyles.find(s => s.value === value)
    if (style?.informal) return
  }
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
    hotspot: 'danger',
    formal_doc: 'primary',
    formal_announce: 'success',
    formal_summary: 'info',
    formal_decision: 'warning'
  }
  return map[strategy] || 'info'
}

const getSceneLabel = (scene: string) => {
  const found = scenes.find(s => s.value === scene)
  return found?.label || scene
}

const stripEmoji = (text: string): string => {
  return text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{FE0F}]/gu, '')
}

const stripInformalPunctuation = (text: string): string => {
  return text
    .replace(/！+/g, '。')
    .replace(/\?+/g, '？')
    .replace(/…{2,}/g, '……')
    .replace(/[「」『』【】\[\]〈〉《》]/g, (m) => {
      const map: Record<string, string> = { '「': '"', '」': '"', '『': '"', '』': '"', '【': '', '】': '', '[': '', ']': '', '〈': '"', '〉': '"', '《': '"', '》': '"' }
      return map[m] || m
    })
}

const addChannelEmoji = (text: string, scene: string): string => {
  const config = getSceneConfig(scene)
  if (config.emojiChance === 0 || Math.random() > config.emojiChance) return text
  if (config.channelEmojis.length === 0) return text
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
  if (config.keywords.length === 0) return text
  const kw = config.keywords[Math.floor(Math.random() * config.keywords.length)]
  if (scene === 'ecommerce') return `${kw}！${text}`
  if (scene === 'social') return `${text} | ${kw}`
  if (scene === 'video') return `${kw}！${text}`
  if (scene === 'official') return `关于${text}`
  return `【${kw}】${text}`
}

const sanitizeForOfficial = (text: string): string => {
  const config = getSceneConfig('official')
  let result = stripEmoji(text)
  result = stripInformalPunctuation(result)
  for (const word of config.banWords) {
    if (result.includes(word)) {
      result = result.replace(new RegExp(word, 'g'), '')
    }
  }
  result = result.replace(/(99%|所有人|震惊|惊呆|不敢相信)/g, '')
  result = result.replace(/[！!]{2,}/g, '。')
  result = result.replace(/[？?]{2,}/g, '？')
  result = result.trim()
  if (!/[。；]$/.test(result) && result.length > 8) {
    result = result
  }
  return result
}

const adjustForScene = (text: string, scene: string, strategy: string): string => {
  const config = getSceneConfig(scene)
  let result = text

  if (scene === 'official') {
    result = sanitizeForOfficial(result)

    if (strategy === 'formal_doc' || strategy === 'formal_announce' || strategy === 'formal_decision' || strategy === 'formal_summary') {
    } else {
      const docType = ['通知', '公告', '通报', '意见', '方案'][Math.floor(Math.random() * 5)]
      if (!result.includes('关于') && !result.startsWith('关于')) {
        const subject = extractSubject(result)
        if (subject) {
          result = `关于${subject}的${docType}`
        }
      }
    }
  } else if (scene === 'video') {
    result = result.replace(/，/g, '！').replace(/。/g, '')
    if (result.length > config.maxLen) {
      result = result.substring(0, config.maxLen)
    }
    if (!/[！？]$/.test(result)) {
      result = result + '！'
    }
    result = addChannelEmoji(result, scene)
  } else if (scene === 'ecommerce') {
    if (!result.includes('【') && !result.includes('限时') && !result.includes('爆款')) {
      result = addChannelKeywords(result, scene)
    }
    result = addChannelEmoji(result, scene)
  } else if (scene === 'social') {
    if (Math.random() > 0.5 && !result.includes('#')) {
      const core = extractCore(originalTitle.value || result)
      result = `${result} #${core}#`
    }
    result = addChannelEmoji(result, scene)
  } else if (scene === 'wechat') {
    result = addChannelEmoji(result, scene)
  }

  if (result.length > config.maxLen + 8) {
    result = result.substring(0, config.maxLen + 8)
  }

  return result
}

const getChannelFeature = (scene: string): string => {
  const config = getSceneConfig(scene)
  const toneMap: Record<string, string> = {
    professional: '专业权威语气，适合知识分享型内容，emoji点缀克制，突出内容价值感',
    dramatic: '夸张口语化风格，短句多感叹号，emoji密度高，3秒内必须抓住眼球',
    promotional: '促销紧迫感语气，利益点前置，突出销量/优惠/正品背书，刺激下单',
    friendly: '亲切分享语气，像朋友种草推荐，emoji丰富活泼，带话题标签增加曝光',
    official: '严谨正式语气，严格遵循公文写作规范，禁用emoji和网络用语，结构为"发文机关+事由+文种"，客观中立不掺杂个人情感'
  }
  return `字数控制在 ${config.minLen}-${config.maxLen} 字 · ${toneMap[config.tone]}`
}

const strategyTemplates: Record<string, any> = {
  suspense: {
    label: '悬念好奇型',
    type: 'warning' as const,
    templates: [
      (core: string, full: string) => `${core}的几个关键问题，值得深入了解`,
      (core: string, full: string) => `为什么${full}？原因值得关注`,
      (core: string, full: string) => `${core}的背后，有这些重要因素`,
      (core: string, full: string) => `关于${core}，有几个方面需要了解`,
      (core: string, full: string) => `${full}的深层原因分析`
    ],
    logic: '通过提出值得关注的问题或因素，引导读者产生进一步了解的意愿，在保持专业客观的前提下制造信息期待。',
    scenario: ''
  },
  number: {
    label: '数字清单型',
    type: 'primary' as const,
    templates: [
      (core: string, full: string, num: number) => `${full}的${num}个核心要点`,
      (core: string, full: string, num: number) => `做好${core}工作的${num}项关键措施`,
      (core: string, full: string, num: number) => `${num}个方面解读${core}`,
      (core: string, full: string, num: number) => `${full}：${num}个重点内容梳理`,
      (core: string, full: string, num: number) => `${num}分钟快速了解${core}`
    ],
    logic: '用具体数字增强标题的结构化和条理性，让读者对内容的信息量有明确预期，便于快速定位重点。',
    scenario: ''
  },
  emotion: {
    label: '情感共鸣型',
    type: 'danger' as const,
    templates: [
      (core: string, full: string) => `${full}，引发广泛思考`,
      (core: string, full: string) => `${full}的现象值得重视`,
      (core: string, full: string) => `关注${core}，共同推动改善`,
      (core: string, full: string) => `${core}问题引发社会关注`,
      (core: string, full: string) => `关于${core}的几点思考`
    ],
    logic: '通过对社会现象或普遍问题的关注，唤起读者的认同感和责任意识，在正式语境下保持客观理性的共情。',
    scenario: ''
  },
  contrast: {
    label: '对比反差型',
    type: 'success' as const,
    templates: [
      (core: string, full: string) => `${core}的两种模式对比分析`,
      (core: string, full: string) => `${full}前后的变化研究`,
      (core: string, full: string) => `不同阶段${core}的差异对比`,
      (core: string, full: string) => `新旧${core}方式的优劣分析`,
      (core: string, full: string) => `${core}的横向与纵向对比`
    ],
    logic: '通过对比分析展示事物在不同维度的差异，用数据和事实说话，帮助读者做出更理性的判断和选择。',
    scenario: ''
  },
  benefit: {
    label: '利益驱动型',
    type: 'warning' as const,
    templates: [
      (core: string, full: string) => `${full}，助力效率提升`,
      (core: string, full: string) => `掌握${core}方法，优化工作流程`,
      (core: string, full: string) => `${full}的实践路径与价值`,
      (core: string, full: string) => `高效${core}指南：少走弯路`,
      (core: string, full: string) => `${core}的优化建议与实施要点`
    ],
    logic: '明确指出内容能带来的实际价值和工作改进，用正向收益驱动阅读，帮助读者理解学习的必要性。',
    scenario: ''
  },
  question: {
    label: '疑问引导型',
    type: 'info' as const,
    templates: [
      (core: string, full: string) => `${full}？本文为你解答`,
      (core: string, full: string) => `如何有效推进${core}工作？`,
      (core: string, full: string) => `${core}的关键问题是什么？`,
      (core: string, full: string) => `怎样做好${full}？`,
      (core: string, full: string) => `${core}的实施路径有哪些？`
    ],
    logic: '通过提出读者可能关心的实际问题，明示文章将提供解决方案，精准匹配搜索需求和工作疑问。',
    scenario: ''
  },
  story: {
    label: '故事叙述型',
    type: '' as const,
    templates: [
      (core: string, full: string) => `${full}的实践与探索`,
      (core: string, full: string) => `推进${core}工作的经验总结`,
      (core: string, full: string) => `${core}的案例分析与启示`,
      (core: string, full: string) => `${full}的历程回顾`,
      (core: string, full: string) => `从实践看${core}的成效`
    ],
    logic: '通过实践案例和经验总结的方式呈现内容，用真实的经历和数据增加可信度，便于读者参考借鉴。',
    scenario: ''
  },
  hotspot: {
    label: '热点蹭流型',
    type: 'danger' as const,
    templates: [
      (core: string, full: string) => `${full}：行业趋势解读`,
      (core: string, full: string) => `关注${core}的最新进展`,
      (core: string, full: string) => `${core}领域的发展动态`,
      (core: string, full: string) => `${full}的政策背景与影响`,
      (core: string, full: string) => `当前${core}的形势分析`
    ],
    logic: '结合行业趋势和最新动态，提供有价值的背景解读和形势分析，帮助读者把握宏观方向。',
    scenario: ''
  },
  formal_doc: {
    label: '正式公文型',
    type: 'primary' as const,
    templates: [
      (core: string, full: string) => `关于${core}的通知`,
      (core: string, full: string) => `关于做好${core}工作的通知`,
      (core: string, full: string) => `关于印发${core}方案的通知`,
      (core: string, full: string) => `关于推进${core}的实施意见`,
      (core: string, full: string) => `关于开展${core}的工作方案`
    ],
    logic: '严格遵循《党政机关公文处理工作条例》规范，采用"关于+事由+文种"的标准公文标题格式，体现权威性和规范性。',
    scenario: ''
  },
  formal_announce: {
    label: '公告通知型',
    type: 'success' as const,
    templates: [
      (core: string, full: string) => `关于${core}的公告`,
      (core: string, full: string) => `关于${core}有关事项的通知`,
      (core: string, full: string) => `${core}公告`,
      (core: string, full: string) => `关于召开${core}会议的通知`,
      (core: string, full: string) => `关于举办${core}活动的通知`
    ],
    logic: '以公告、通知的标准格式呈现，明确传达需要周知或执行的事项，要素完整、表述精准、便于快速理解。',
    scenario: ''
  },
  formal_summary: {
    label: '总结报告型',
    type: 'info' as const,
    templates: [
      (core: string, full: string) => `${core}工作总结报告`,
      (core: string, full: string) => `关于${core}的情况汇报`,
      (core: string, full: string) => `${full}年度总结`,
      (core: string, full: string) => `${core}阶段性工作小结`,
      (core: string, full: string) => `关于${core}的调研报告`
    ],
    logic: '采用工作总结/报告的标准标题结构，体现工作的完整性和条理性，便于归档、汇报和上级审阅。',
    scenario: ''
  },
  formal_decision: {
    label: '决议决定型',
    type: 'warning' as const,
    templates: [
      (core: string, full: string) => `关于${core}的决定`,
      (core: string, full: string) => `关于表彰${core}的决定`,
      (core: string, full: string) => `关于调整${core}的决定`,
      (core: string, full: string) => `${core}决议`,
      (core: string, full: string) => `关于任免${core}的决定`
    ],
    logic: '使用"决定""决议"等法定文种，体现决策的严肃性和权威性，格式规范、措辞严谨，符合正式发文要求。',
    scenario: ''
  }
}

const getScenarioText = (strategy: string, scene: string): string => {
  const map: Record<string, Record<string, string>> = {
    suspense: {
      wechat: '公众号深度解读类文章，引导读者进一步了解核心问题',
      video: '知识科普类短视频，用问题引导用户停留观看',
      ecommerce: '产品深度解析类详情页，激发进一步了解的兴趣',
      social: '知乎/微博深度话题，引导讨论和思考',
      official: '企业内部政策解读、问题分析类内部通知，引导员工关注重点问题'
    },
    number: {
      wechat: '公众号干货文章、知识清单类内容，便于读者收藏和查阅',
      video: '教程类短视频，用数字吸引精准用户',
      ecommerce: '产品功能点罗列，突出核心卖点',
      social: '小红书清单笔记、知乎回答，结构清晰易读',
      official: '企业规章制度、操作流程、工作要点类文件，条理性强，便于执行落实'
    },
    emotion: {
      wechat: '公众号人文关怀、企业文化类文章',
      video: '人文记录类短视频，引发认同感',
      ecommerce: '品牌故事详情页，增强品牌温度',
      social: '公益话题、社会关注类内容',
      official: '企业文化建设、员工关怀类通知，传递企业价值观，增强团队凝聚力'
    },
    contrast: {
      wechat: '公众号行业分析、对比研究类文章',
      video: '产品对比测评类短视频',
      ecommerce: '新旧产品对比、竞品分析详情页',
      social: '知乎深度对比分析回答',
      official: '企业决策论证、方案对比选择类报告，用数据支撑科学决策'
    },
    benefit: {
      wechat: '技能提升、效率工具类公众号文章',
      video: '实用技巧教学类短视频',
      ecommerce: '产品卖点详情页，突出使用价值',
      social: '效率工具推荐、经验分享笔记',
      official: '培训通知、技能提升类文件，突出学习价值和工作改进，提高员工参与度'
    },
    question: {
      wechat: '知识问答、FAQ类公众号文章，适配搜索',
      video: '答疑解惑类短视频',
      ecommerce: '常见问题解答模块，降低购买决策门槛',
      social: '知乎问答、百度知道精准匹配',
      official: '政策问答、办事指南类文件，精准匹配员工疑问，提高内部沟通效率'
    },
    story: {
      wechat: '企业人物、成长故事类公众号文章',
      video: '纪录片、人物专访类短视频',
      ecommerce: '品牌故事、用户案例详情页',
      social: '个人经验分享、行业故事长文',
      official: '企业发展历程、优秀员工事迹宣传材料，增强文化认同感'
    },
    hotspot: {
      wechat: '行业趋势、政策解读类公众号文章',
      video: '热点事件解读类短视频',
      ecommerce: '借势热点的产品营销文案',
      social: '微博热门话题、时事评论',
      official: '行业政策解读、市场趋势分析类内部参考材料，帮助管理层把握方向'
    },
    formal_doc: {
      wechat: '不适用，过于正式',
      video: '不适用',
      ecommerce: '不适用',
      social: '不适用',
      official: '企业内部规章制度、办法、方案等正式公文发文，完全符合《党政机关公文格式》标准，适用于对内对外正式行文'
    },
    formal_announce: {
      wechat: '不适用',
      video: '不适用',
      ecommerce: '不适用',
      social: '不适用',
      official: '会议通知、活动公告、人事任免、放假通知等需要全体周知的事项，信息要素完整，传达效率高'
    },
    formal_summary: {
      wechat: '不适用',
      video: '不适用',
      ecommerce: '不适用',
      social: '不适用',
      official: '年度工作总结、季度汇报、调研报告、述职报告等向上级或全体汇报的正式材料，结构规范、便于审阅'
    },
    formal_decision: {
      wechat: '不适用',
      video: '不适用',
      ecommerce: '不适用',
      social: '不适用',
      official: '重要人事任免、重大事项决策、表彰奖励、组织调整等具有约束力的正式发文，体现决策权威性'
    }
  }
  return map[strategy]?.[scene] || '适合大多数内容发布场景'
}

const generateSingleTitle = (strategyKey: string, scene: string): TitleResult | null => {
  const strategy = strategyTemplates[strategyKey]
  if (!strategy) return null

  const core = extractCore(originalTitle.value.trim())
  const full = originalTitle.value.trim()

  const templates = strategy.templates
  const templateFn = templates[Math.floor(Math.random() * templates.length)]

  let rawTitle: string
  if (strategyKey === 'number') {
    const numbers = [3, 4, 5, 6, 8]
    const num = numbers[Math.floor(Math.random() * numbers.length)]
    rawTitle = (templateFn as any)(core, full, num)
  } else {
    rawTitle = (templateFn as any)(core, full)
  }

  const finalTitle = adjustForScene(rawTitle, scene, strategyKey)

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

const getApplicableStrategies = (): string[] => {
  const allKeys = Object.keys(strategyTemplates)

  if (selectedStyles.value.length > 0) {
    return selectedStyles.value.filter(s => {
      if (selectedScene.value === 'official') {
        const style = allStyles.find(st => st.value === s)
        return style && !style.informal
      }
      return allKeys.includes(s)
    })
  }

  if (selectedScene.value === 'official') {
    const officialPreferred = ['formal_doc', 'formal_announce', 'formal_summary', 'formal_decision']
    const otherAcceptable = allKeys.filter(k => {
      const style = allStyles.find(s => s.value === k)
      return style && !style.informal && !style.officialOnly
    })
    return [...officialPreferred, ...otherAcceptable]
  }

  return allKeys.filter(k => {
    const style = allStyles.find(s => s.value === k)
    return style && !style.officialOnly
  })
}

const generateTitles = async () => {
  if (!originalTitle.value.trim()) {
    ElMessage.warning('请输入原始标题')
    return
  }

  isGenerating.value = true
  generatedResults.value = []

  await new Promise(resolve => setTimeout(resolve, 600))

  const applicableStrategies = getApplicableStrategies()
  if (applicableStrategies.length === 0) {
    ElMessage.warning('当前场景下没有可用的改写策略')
    isGenerating.value = false
    return
  }

  const shuffled = [...applicableStrategies].sort(() => Math.random() - 0.5)
  const picked: string[] = []
  for (let i = 0; i < outputCount.value; i++) {
    picked.push(shuffled[i % shuffled.length])
  }
  const finalPicked = picked.sort(() => Math.random() - 0.5)

  for (let i = 0; i < finalPicked.length; i++) {
    await new Promise(resolve => setTimeout(resolve, selectedScene.value === 'official' ? 250 : 300))
    const result = generateSingleTitle(finalPicked[i], selectedScene.value)
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
    message: selectedScene.value === 'official'
      ? `📋 已为「企业公务」场景生成 ${generatedResults.value.length} 个规范化标题方案`
      : `✨ 已为「${getSceneLabel(selectedScene.value)}」场景生成 ${generatedResults.value.length} 个标题方案`,
    type: 'success',
    duration: 3000,
    showClose: true
  })
}

const regenerateOne = async (index: number) => {
  const current = generatedResults.value[index]
  const applicableStrategies = getApplicableStrategies()
  const pool = applicableStrategies.filter(s => s !== current.strategy)
  const strategyKey = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : current.strategy
  const newResult = generateSingleTitle(strategyKey, selectedScene.value)
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
  max-width: 1080px;
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
  grid-template-columns: 1fr 1.1fr 1.1fr 1.1fr 1.1fr 1.2fr;
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
  line-height: 1.6;
}

.diff-col.official {
  color: #67c23a;
  font-weight: 500;
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
  flex-wrap: wrap;
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
  flex-wrap: wrap;
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

.scene-options-5 {
  grid-template-columns: repeat(5, 1fr);
}

.scene-options {
  display: grid;
  gap: 12px;
}

.scene-card {
  padding: 16px 12px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  text-align: center;
  ursor: pointer;
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

.scene-card.official.active {
  border-color: #67c23a;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  box-shadow: 0 4px 16px rgba(103, 194, 58, 0.2);
}

.scene-card.official:hover:not(.disabled) {
  border-color: #67c23a;
  background: #f0f9eb;
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

.scene-spec.official {
  background: rgba(103, 194, 58, 0.12);
  color: #67c23a;
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

.style-chip:hover:not(.disabled):not(.unavailable) {
  border-color: #165DFF;
  background: #ecf5ff;
}

.style-chip.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
}

.style-chip.official.active {
  border-color: #67c23a;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: #fff;
}

.style-chip.unavailable {
  opacity: 0.4;
  cursor: not-allowed;
  text-decoration: line-through;
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
  width: 340px;
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

.generating-status.official {
  background: linear-gradient(135deg, #389e0d 0%, #52c41a 100%);
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

.result-item.result-official {
  border-color: #b7eb8f;
  background: linear-gradient(135deg, #fff 0%, #f6ffed 100%);
}

.result-item.result-official:hover {
  border-color: #67c23a;
  box-shadow: 0 4px 16px rgba(103, 194, 58, 0.15);
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

.result-index.official {
  background: linear-gradient(135deg, #389e0d 0%, #52c41a 100%);
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

.result-title.official {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
}

.result-title:hover {
  background: linear-gradient(135deg, #e6f4ff 0%, #d9ecff 100%);
}

.result-title.official:hover {
  background: linear-gradient(135deg, #d9f7be 0%, #b7eb8f 100%);
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

@media (max-width: 900px) {
  .scene-options-5 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .expectation-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .channel-diff-table {
    overflow-x: auto;
  }

  .diff-row {
    min-width: 900px;
  }

  .scene-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .scene-options-5 {
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
