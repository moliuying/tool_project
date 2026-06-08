<template>
  <div class="high-eq-reply-generator">
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
        <el-step title="描述聊天场景" description="当前对话背景和氛围" />
        <el-step title="输入对方消息" description="对方说的话或问题" />
        <el-step title="选择对象与风格" description="关系类型 + 回复调性" />
        <el-step title="查看与复制" description="多版高情商回复择优" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><ChatDotRound /></el-icon>
            <div class="exp-text">
              <div class="exp-num">3 ~ 6 个版本</div>
              <div class="exp-label">每次生成可自选数量</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">{{ totalStyleCount }} 种回复策略</div>
              <div class="exp-label">委婉/幽默/温暖/专业等多维覆盖</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><User /></el-icon>
            <div class="exp-text">
              <div class="exp-num">5 类关系深度适配</div>
              <div class="exp-label">朋友/同事/客户/长辈/恋人</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Bulb /></el-icon>
            <div class="exp-text">
              <div class="exp-num">3 层回复信息</div>
              <div class="exp-label">回复内容 + 情商技巧 + 适用时机</div>
            </div>
          </div>
        </div>
        <el-divider />
        <h4 class="expectation-title">🎯 各关系类型回复差异说明</h4>
        <div class="relation-diff-table">
          <div class="diff-row diff-header">
            <div class="diff-col">差异维度</div>
            <div class="diff-col">👥 朋友</div>
            <div class="diff-col">💼 同事</div>
            <div class="diff-col">🤝 客户</div>
            <div class="diff-col">👴 长辈</div>
            <div class="diff-col">💕 恋人</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">语气特点</div>
            <div class="diff-col">轻松随意、带点梗</div>
            <div class="diff-col">专业得体、进退有度</div>
            <div class="diff-col">礼貌周到、服务意识</div>
            <div class="diff-col">恭敬谦卑、表达关心</div>
            <div class="diff-col">温柔甜蜜、情感流动</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">距离感</div>
            <div class="diff-col">亲近无拘</div>
            <div class="diff-col">保持边界</div>
            <div class="diff-col">尊重客气</div>
            <div class="diff-col">晚辈姿态</div>
            <div class="diff-col">亲密无间</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">核心原则</div>
            <div class="diff-col">真诚+有趣</div>
            <div class="diff-col">专业+分寸</div>
            <div class="diff-col">负责+贴心</div>
            <div class="diff-col">孝顺+懂事</div>
            <div class="diff-col">共情+偏爱</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">表情包使用</div>
            <div class="diff-col">自由使用</div>
            <div class="diff-col">适度点缀</div>
            <div class="diff-col">礼貌表情</div>
            <div class="diff-col">简洁明了</div>
            <div class="diff-col">甜蜜表情</div>
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
          <span>高情商回复生成</span>
          <el-tag size="small" type="warning">多关系 · 多风格 · 多版本</el-tag>
        </div>
      </template>

      <div class="input-section">
        <div class="section-title">
          <el-icon><House /></el-icon>
          <span>聊天场景描述（可选，让回复更精准）</span>
        </div>
        <el-input
          v-model="chatScene"
          type="textarea"
          :rows="3"
          placeholder="例如：在微信上和对方聊天 / 工作群里被领导点名 / 刚认识的相亲对象发来消息 / 饭桌上被长辈催婚..."
          maxlength="200"
          show-word-limit
          :disabled="isGenerating"
          resize="vertical"
        />
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><ChatDotRound /></el-icon>
          <span>对方发送的内容</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="opponentMessage"
          type="textarea"
          :rows="4"
          placeholder="粘贴或输入对方说的话，例如：&#10;「你怎么还没结婚？」&#10;「这个方案写得不行啊」&#10;「改天请你吃饭」"
          maxlength="500"
          show-word-limit
          :disabled="isGenerating"
          resize="vertical"
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
            {{ sample.label }}
          </el-tag>
        </div>
      </div>

      <div class="relation-section">
        <div class="section-title">
          <el-icon><User /></el-icon>
          <span>对话对象关系</span>
          <el-tag size="small" type="info" class="hint-tag">
            不同关系的语气、分寸、表达方式均会自动适配
          </el-tag>
        </div>
        <div class="relation-options">
          <div
            v-for="relation in relations"
            :key="relation.value"
            class="relation-card"
            :class="{ active: selectedRelation === relation.value, disabled: isGenerating }"
            @click="!isGenerating && (selectedRelation = relation.value)"
          >
            <div class="relation-emoji">{{ relation.emoji }}</div>
            <div class="relation-name">{{ relation.label }}</div>
            <div class="relation-desc">{{ relation.desc }}</div>
            <div class="relation-tip">{{ relation.tip }}</div>
          </div>
        </div>
      </div>

      <div class="two-col-section">
        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><MagicStick /></el-icon>
            <span>回复风格（可选，不选则自动适配）</span>
          </div>
          <div class="style-options">
            <div
              v-for="style in availableStyles"
              :key="style.value"
              class="style-chip"
              :class="{ active: selectedStyles.includes(style.value), disabled: isGenerating }"
              @click="!isGenerating && toggleStyle(style.value)"
            >
              <span class="style-emoji">{{ style.emoji }}</span>
              <span class="style-label">{{ style.label }}</span>
            </div>
          </div>
          <div class="style-tip" v-if="selectedStyles.length === 0">
            <el-tag size="small" type="info">不选则自动根据关系和内容智能匹配</el-tag>
          </div>
        </div>

        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            <span>输出版本数</span>
          </div>
          <div class="version-options">
            <div
              v-for="opt in versionOptions"
              :key="opt.value"
              class="version-card"
              :class="{ active: replyCount === opt.value, disabled: isGenerating }"
              @click="!isGenerating && (replyCount = opt.value)"
            >
              <div class="version-num">{{ opt.value }}</div>
              <div class="version-label">个版本</div>
              <div class="version-desc">{{ opt.desc }}</div>
            </div>
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
          @click="generateReplies"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 正在为「{{ getRelationLabel(selectedRelation) }}」场景生成 {{ replyCount }} 个高情商回复方案…
            </span>
          </template>
          生成高情商回复
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
          💡 正在分析对方话语意图，结合「{{ getRelationLabel(selectedRelation) }}」关系语境
          <span v-if="selectedStyles.length > 0">+ {{ selectedStyles.length }} 种风格偏好</span>
          ，打造得体又有温度的回复…
        </span>
      </div>
    </el-card>

    <el-card v-if="generatedResults.length > 0" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>生成结果</span>
          <el-tag size="small" type="success">
            {{ getRelationLabel(selectedRelation) }}
          </el-tag>
          <el-tag v-if="selectedStyles.length > 0" size="small" type="warning" effect="light">
            风格：{{ selectedStyles.map(s => getStyleLabel(s)).join('+') }}
          </el-tag>
          <el-tag size="small" type="info">共 {{ generatedResults.length }} 个版本</el-tag>
          <div class="header-actions">
            <el-button size="small" type="primary" link :icon="CopyDocument" @click="copyAllResults">
              复制全部回复
            </el-button>
          </div>
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
              <el-tag :type="getStyleTagType(result.style)" size="small" effect="dark">
                {{ result.styleLabel }}
              </el-tag>
              <el-tag size="small" effect="plain" class="relation-tag">
                {{ getRelationLabel(result.relation) }}
              </el-tag>
            </div>
            <div class="result-score">
              <el-rate v-model="result.rating" disabled size="small" />
              <span class="score-label">情商指数</span>
            </div>
          </div>
          <div class="result-reply" @click="copyText(result.reply)">
            <span class="reply-text">{{ result.reply }}</span>
            <el-icon class="copy-icon"><CopyDocument /></el-icon>
          </div>
          <div class="result-details">
            <div class="detail-item">
              <el-icon color="#165DFF"><Bulb /></el-icon>
              <div class="detail-content">
                <span class="detail-label">情商技巧：</span>
                <span class="detail-text">{{ result.tip }}</span>
              </div>
            </div>
            <div class="detail-item">
              <el-icon color="#e6a23c"><Place /></el-icon>
              <div class="detail-content">
                <span class="detail-label">适用时机：</span>
                <span class="detail-text">{{ result.scenario }}</span>
              </div>
            </div>
            <div class="detail-item">
              <el-icon color="#67c23a"><DataLine /></el-icon>
              <div class="detail-content">
                <span class="detail-label">语气分析：</span>
                <span class="detail-text">{{ result.toneAnalysis }}</span>
              </div>
            </div>
          </div>
          <div class="result-actions">
            <el-button size="small" type="primary" :icon="CopyDocument" @click="copyText(result.reply)">
              复制回复
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
          <div class="history-message">
            <el-tag size="small" type="info">{{ getRelationLabel(item.relation) }}</el-tag>
            <span class="history-text">{{ truncateText(item.opponentMessage, 30) }}</span>
          </div>
          <div class="history-meta">
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
  ChatDotRound,
  User,
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
  DataLine,
  Document,
  RefreshRight,
  House
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface ReplyResult {
  reply: string
  style: string
  styleLabel: string
  tip: string
  scenario: string
  toneAnalysis: string
  relation: string
  rating: number
}

interface HistoryItem {
  chatScene: string
  opponentMessage: string
  relation: string
  styles: string[]
  results: ReplyResult[]
  time: string
}

interface QuickSample {
  label: string
  scene: string
  message: string
  relation: string
  hintStyles: string[]
}

const STORAGE_KEY = 'high_eq_reply_history'

const relations = [
  {
    value: 'friend',
    label: '朋友',
    emoji: '👥',
    desc: '闺蜜、兄弟、好友',
    tip: '轻松随意，可以带梗开玩笑',
    config: {
      formality: 'casual',
      distance: 'close',
      emojiChance: 0.7,
      tones: ['humorous', 'warm', 'playful', 'sincere']
    }
  },
  {
    value: 'colleague',
    label: '同事',
    emoji: '💼',
    desc: '同事、领导、工作伙伴',
    tip: '专业得体，保持职场分寸',
    config: {
      formality: 'semi-formal',
      distance: 'polite',
      emojiChance: 0.3,
      tones: ['professional', 'tactful', 'positive', 'neutral']
    }
  },
  {
    value: 'client',
    label: '客户',
    emoji: '🤝',
    desc: '客户、合作方、商务伙伴',
    tip: '礼貌周到，体现服务意识',
    config: {
      formality: 'formal',
      distance: 'respectful',
      emojiChance: 0.2,
      tones: ['professional', 'reassuring', 'helpful', 'polite']
    }
  },
  {
    value: 'elder',
    label: '长辈',
    emoji: '👴',
    desc: '父母、亲戚、老师、上级长辈',
    tip: '恭敬谦卑，表达关心和懂事',
    config: {
      formality: 'respectful',
      distance: 'hierarchical',
      emojiChance: 0.15,
      tones: ['respectful', 'warm', 'obedient', 'grateful']
    }
  },
  {
    value: 'lover',
    label: '恋人',
    emoji: '💕',
    desc: '对象、伴侣、暧昧对象',
    tip: '温柔甜蜜，情感流动',
    config: {
      formality: 'intimate',
      distance: 'intimate',
      emojiChance: 0.8,
      tones: ['affectionate', 'sweet', 'supportive', 'playful']
    }
  }
]

const allStyles = [
  { value: 'tactful', label: '委婉含蓄', emoji: '🌙' },
  { value: 'humorous', label: '幽默化解', emoji: '😄' },
  { value: 'warm', label: '温暖真诚', emoji: '☀️' },
  { value: 'professional', label: '专业得体', emoji: '💼' },
  { value: 'playful', label: '俏皮轻松', emoji: '😜' },
  { value: 'reassuring', label: '安抚定心', emoji: '🤗' },
  { value: 'grateful', label: '感恩感谢', emoji: '🙏' },
  { value: 'assertive', label: '温和坚定', emoji: '💪' },
  { value: 'curious', label: '好奇引导', emoji: '🤔' },
  { value: 'complimentary', label: '赞美夸赞', emoji: '🌟' }
]

const versionOptions = [
  { value: 3, label: '3个', desc: '核心优选版' },
  { value: 4, label: '4个', desc: '覆盖主流风格' },
  { value: 6, label: '6个', desc: '全风格探索' }
]

const quickSamplesByRelation: Record<string, QuickSample[]> = {
  friend: [
    {
      label: '朋友借钱',
      scene: '微信私聊，认识5年的好朋友',
      message: '兄弟，最近手头有点紧，能借我5000块周转一下吗？下月发工资就还你。',
      relation: 'friend',
      hintStyles: ['tactful', 'warm', 'humorous']
    },
    {
      label: '朋友吐槽',
      scene: '闺蜜群聊，朋友抱怨工作',
      message: '我真的要疯了，这个破公司天天加班，工资还那么低！',
      relation: 'friend',
      hintStyles: ['warm', 'humorous', 'playful']
    }
  ],
  colleague: [
    {
      label: '被甩锅',
      scene: '工作群，项目出了问题同事暗示是你的责任',
      message: '这个方案之前好像是小X在跟进的吧？怎么会出这种问题呢？',
      relation: 'colleague',
      hintStyles: ['tactful', 'professional', 'assertive']
    },
    {
      label: '同事请帮忙',
      scene: '工位上，邻座同事请你帮他做他的分内事',
      message: '你Excel用得好，帮我做个表格呗，我今晚有约会急着走。',
      relation: 'colleague',
      hintStyles: ['tactful', 'professional', 'warm']
    }
  ],
  client: [
    {
      label: '客户催进度',
      scene: '客户微信追问项目进展，比预期略有延迟',
      message: '这个项目怎么还没好？上周不是说这周交付吗？你们效率也太低了吧。',
      relation: 'client',
      hintStyles: ['professional', 'reassuring', 'tactful']
    },
    {
      label: '客户砍价',
      scene: '商务沟通，客户嫌报价太高',
      message: '你们这个价格太贵了，别家比你们便宜30%，能不能再优惠点？',
      relation: 'client',
      hintStyles: ['professional', 'tactful', 'complimentary']
    }
  ],
  elder: [
    {
      label: '被催婚',
      scene: '家庭聚餐，亲戚长辈集体催婚',
      message: '你也不小了，什么时候带个对象回家啊？隔壁小李孩子都上幼儿园了！',
      relation: 'elder',
      hintStyles: ['tactful', 'warm', 'humorous']
    },
    {
      label: '长辈安排',
      scene: '妈妈打电话让你考公务员，你不想去',
      message: '我托你王阿姨给你找了个国企的工作，稳定，你下周去面试一下。',
      relation: 'elder',
      hintStyles: ['tactful', 'grateful', 'warm']
    }
  ],
  lover: [
    {
      label: '对方生气',
      scene: '对象因为你忘记纪念日不高兴',
      message: '算了，你根本就不在乎我，连这么重要的日子都能忘。',
      relation: 'lover',
      hintStyles: ['warm', 'reassuring', 'affectionate']
    },
    {
      label: '送命题',
      scene: '对象问你经典送命题',
      message: '我和你妈同时掉水里你先救谁？',
      relation: 'lover',
      hintStyles: ['humorous', 'playful', 'warm']
    }
  ]
}

const chatScene = ref('')
const opponentMessage = ref('')
const selectedRelation = ref('friend')
const selectedStyles = ref<string[]>([])
const replyCount = ref(3)
const isGenerating = ref(false)
const generatedResults = ref<ReplyResult[]>([])
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const currentQuickSamples = computed(() => quickSamplesByRelation[selectedRelation.value] || quickSamplesByRelation.friend)

const totalStyleCount = computed(() => allStyles.length)

const availableStyles = computed(() => allStyles)

const currentStep = computed(() => {
  if (generatedResults.value.length > 0 && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (selectedRelation.value) return 1
  if (opponentMessage.value || chatScene.value) return 0
  return 0
})

const canGenerate = computed(() => {
  return opponentMessage.value.trim().length > 0
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const getRelationLabel = (v: string) => relations.find(r => r.value === v)?.label || v
const getRelationConfig = (v: string) => relations.find(r => r.value === v)?.config || relations[0].config
const getStyleLabel = (v: string) => allStyles.find(s => s.value === v)?.label || v

const getStyleTagType = (style: string): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
    tactful: 'warning',
    humorous: '',
    warm: 'success',
    professional: 'primary',
    playful: 'danger',
    reassuring: 'success',
    grateful: 'success',
    assertive: 'warning',
    curious: 'info',
    complimentary: 'warning'
  }
  return map[style] || 'info'
}

const applySample = (sample: QuickSample) => {
  chatScene.value = sample.scene
  opponentMessage.value = sample.message
  selectedRelation.value = sample.relation
  selectedStyles.value = [...sample.hintStyles]
  ElMessage.success('已载入示例场景')
}

const toggleStyle = (value: string) => {
  const idx = selectedStyles.value.indexOf(value)
  if (idx > -1) {
    selectedStyles.value.splice(idx, 1)
  } else {
    selectedStyles.value.push(value)
  }
}

const truncateText = (text: string, maxLen: number) => {
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen) + '...'
}

const extractMessageIntent = (msg: string): string => {
  const trimmed = msg.trim()
  if (/钱|借|还|付款|价格|优惠|便宜|贵/.test(trimmed)) return 'money'
  if (/催|什么时候|进度|什么时候好|还没好|等了/.test(trimmed)) return 'urging'
  if (/结婚|对象|相亲|催婚|找对象|单身/.test(trimmed)) return 'marriage_pressure'
  if (/忘|不在乎|生气|不理|算了|分手|不开心/.test(trimmed)) return 'emotional_upset'
  if (/帮|帮忙|做一下|替|能不能帮/.test(trimmed)) return 'favor_request'
  if (/面试|工作|稳定|公务员|国企|换工作/.test(trimmed)) return 'career_advice'
  if (/加班|累|疯了|崩溃|烦死|压力|不想干/.test(trimmed)) return 'complaint'
  if (/谁|同时|掉水里|我和你妈/.test(trimmed)) return 'trap_question'
  if (/方案|不行|问题|怎么|错误|锅|责任/.test(trimmed)) return 'blame_or_criticism'
  return 'general'
}

interface ReplyTemplate {
  reply: string
  tip: string
  scenario: string
  toneAnalysis: string
}

const replyTemplateBank: Record<string, Record<string, ReplyTemplate[]>> = {
  friend: {
    money: [
      {
        reply: '哎呀兄弟，我最近也紧巴巴的，刚交完房租还吃着土呢😂 不然我帮你问问我另一个朋友？',
        tip: '用自嘲式幽默表达自己也有难处，既不伤感情又给了台阶，同时主动提出帮想其他办法，体现朋友义气。',
        scenario: '确实手头紧张、不愿意借或者对方借钱频率较高时',
        toneAnalysis: '轻松幽默 + 真诚共情，用自嘲拉近距离，不让对方感到被拒绝'
      },
      {
        reply: '五千是吧？你卡号发我，我下午给你转过去。咱们兄弟之间别说借，有困难互相帮是应该的！',
        tip: '如果对方是靠谱的好朋友且金额可承受，干脆利落答应，强调兄弟情分，让这份帮助有温度而不是冷冰冰的借贷。',
        scenario: '关系非常铁、对方信用好、自己有能力帮时',
        toneAnalysis: '豪爽真诚 + 重情重义，让对方感到被重视和支持'
      },
      {
        reply: '兄弟我懂，谁没个困难的时候呢。我这边能凑个两千给你先用着，不用急着还，剩下的你再想想别的办法？',
        tip: '不全答应也不全拒绝，量力而行给一部分，既帮了忙也保护了自己，还留有余地。',
        scenario: '想帮忙但能力有限，或者对对方还款能力有些担忧时',
        toneAnalysis: '真诚务实 + 有分寸，既表达了支持又保护了自己的边界'
      },
      {
        reply: '行啊兄弟，不过咱先说好了，你得请我吃顿好的当利息！😂 卡号发我，我这就给你转。',
        tip: '用开玩笑的方式"条件化"借款，既避免了尴尬，也让还钱变成一件轻松的事，而不是心理负担。',
        scenario: '关系很好、金额不大、想活跃气氛时',
        toneAnalysis: '幽默轻松 + 朋友义气，用玩笑化解借钱的尴尬感'
      }
    ],
    complaint: [
      {
        reply: '抱抱！这破班不上也罢！走，晚上出来撸串，我陪你吐槽到天亮🍢',
        tip: '先共情安抚情绪，不要急着给建议，约出来见面/吃饭用实际行动支持，行动比语言更有力量。',
        scenario: '朋友情绪激动、需要宣泄时',
        toneAnalysis: '温暖共情 + 实际支持，让对方感到被理解和陪伴'
      },
      {
        reply: '我懂我懂，我上个月也经历过这种地狱模式，真的是要疯了。你现在想骂就骂，我听着呢！',
        tip: '用"我也经历过"建立共情连接，先接住对方情绪再谈其他，让对方知道自己不是一个人。',
        scenario: '对方需要的是情绪共鸣而不是解决方案时',
        toneAnalysis: '共情共鸣 + 真诚倾听，让对方感到被理解而不是被评判'
      },
      {
        reply: '兄弟我先帮你骂：这公司真不是东西！对了，你上次不是说想去面试那家新公司吗？要不我帮你改改简历？',
        tip: '先陪骂释放情绪，然后悄悄引导到解决方向，让对方从受害者心态转向行动者心态。',
        scenario: '对方发泄得差不多、可以接受建议时',
        toneAnalysis: '先共情后引导，情绪价值和实际帮助两手抓'
      }
    ],
    marriage_pressure: [
      {
        reply: '哈哈哈阿姨们又开始催了？别管他们，咱们先约个饭，单身的日子多潇洒啊！',
        tip: '和朋友站在同一战线，用轻松幽默化解压力，陪伴比说教更重要。',
        scenario: '朋友被催婚、情绪烦躁时',
        toneAnalysis: '轻松幽默 + 同盟感，和对方站在一起'
      }
    ],
    general: [
      {
        reply: '哈哈你这话太有意思了，我也这么觉得！',
        tip: '简单直接的认同，拉近距离又不尴尬。',
        scenario: '日常聊天、对方分享观点或趣事时',
        toneAnalysis: '轻松认同型，真诚自然'
      },
      {
        reply: '可以啊兄弟，有想法！下次带我一起？',
        tip: '用积极回应 + 发出邀请，推动关系更近一步。',
        scenario: '对方分享计划或新鲜事时',
        toneAnalysis: '积极热情 + 主动邀请，展现对对方的兴趣'
      }
    ]
  },
  colleague: {
    blame_or_criticism: [
      {
        reply: '张哥说得对，这个问题确实需要我们重视。我这边的部分我再仔细核对一遍，也请大家一起看看各自的模块，我们一起把问题定位清楚，确保下次不会再出现。',
        tip: '不直接接锅也不甩锅，把问题从"谁的错"转化为"我们一起解决"，主动承担自己那部分，同时邀请大家一起参与，既专业又团结。',
        scenario: '工作群或开会时被暗示或明示要背锅时',
        toneAnalysis: '专业稳重 + 团队合作姿态，化被动为主动，展现责任心和协作精神'
      },
      {
        reply: '这个方案的每一步推进我们都是同步过的，不过既然出现了问题，我们先一起定位根因、尽快修复。我整理一下整个过程的记录发出来，大家一起复盘。',
        tip: '温和但坚定地表明过程是透明的，同时把焦点拉回解决问题，用"整理记录发出来"暗示自己有依据，不卑不亢。',
        scenario: '被不公平甩锅、且自己有充分过程记录时',
        toneAnalysis: '温和坚定 + 事实导向，用专业方式保护自己也推动问题解决'
      },
      {
        reply: '谢谢提醒，这个情况我来跟进。现在当务之急是先把问题处理好，我下午前给大家一个修复方案，同时也会梳理下问题原因，避免后续再发生。',
        tip: '先承接再行动，展现主人翁意识和解决问题的能力，用"我来跟进"把焦点从追责转到担当上。',
        scenario: '问题确实可能和自己有关，或者需要有人站出来牵头解决时',
        toneAnalysis: '积极担当 + 行动导向，展现靠谱和解决问题的能力'
      }
    ],
    favor_request: [
      {
        reply: '真不凑巧，我手上这个报告今天必须要交，老板盯着呢。不然我教你怎么操作？其实很简单，下次你就自己能搞定了，效率还更高！',
        tip: '先用客观理由（老板催着）拒绝，然后给出替代方案（教他方法），授人以鱼不如授人以渔，既不帮做他的分内事又展现了合作态度。',
        scenario: '同事经常习惯性找你帮忙做他自己该做的事时',
        toneAnalysis: '温和拒绝 + 提供替代方案，设立边界同时保持友好'
      },
      {
        reply: '好啊没问题！我这会儿在忙X项目，大概4点能腾出空来。如果急的话你先用这个模板（发模板），我忙完再帮你检查一下？',
        tip: '不说不帮，但把"立刻帮"变成"延后帮"，同时给资源让他自己先动，既不得罪人又保护了自己的工作节奏。',
        scenario: '对方确实有困难、但自己手头也忙时',
        toneAnalysis: '乐于助人 + 有时间边界，照顾他人也保护自己'
      },
      {
        reply: '行，约会要紧！我帮你看看，不过明天你得请我喝咖啡啊～ 下次这种基础操作我教你个小技巧，5分钟就搞定了。',
        tip: '偶尔帮一次可以，但要"标价"（一杯咖啡）让对方知道这不是理所当然，同时暗示下次要自己学会。',
        scenario: '第一次被请帮忙、且对方确实有合理理由时',
        toneAnalysis: '乐于助人 + 设立预期，人情往来让帮助有来有回'
      }
    ],
    general: [
      {
        reply: '收到，我这边马上跟进，有进展及时同步。',
        tip: '简洁专业，表达了执行力和沟通意识，是最稳妥的职场回复模板。',
        scenario: '日常工作对接、接收任务或信息时',
        toneAnalysis: '专业高效 + 及时反馈，展现靠谱执行力'
      },
      {
        reply: '好的，我理解了。我的想法是XXX，你觉得这样可行吗？',
        tip: '先确认理解，再给出方案并寻求反馈，体现了尊重和协作精神。',
        scenario: '需要表达观点或方案时',
        toneAnalysis: '尊重协作 + 主动思考，展现专业和合作态度'
      }
    ]
  },
  client: {
    urging: [
      {
        reply: '王总非常抱歉让您久等了！项目目前已完成85%，我们团队正在加班加点推进最后收尾，确保后天下午前交付到您手上。详细进度我5分钟内发您一份简报，过程中的每一步都可追溯，请您放心！',
        tip: '先道歉共情，立刻给出明确的交付时间（不是"尽快"这种模糊词），补充说明进度百分比让客户有掌控感，主动提出发简报强化透明度，用"可追溯"表达对质量的信心。',
        scenario: '项目确实有延迟、客户催进度且情绪不满时',
        toneAnalysis: '诚恳道歉 + 明确承诺 + 透明可控，安抚客户焦虑同时重建信任'
      },
      {
        reply: '李总您说得对，这个交付时间确实是我们这边需要优化的地方。我这边现在就拉一个专项沟通群，项目负责人每两天同步一次进度，确保您随时掌握情况。这次我们一定把好关，交付让您满意的结果。',
        tip: '先承认问题不找借口，然后给出系统性解决方案（专项群+定期同步）而不是一次性的承诺，让客户感受到你们在流程层面做出了改进。',
        scenario: '客户对效率长期不满、需要建立长期信任时',
        toneAnalysis: '正视问题 + 系统化改进 + 持续承诺，从单次修复升级为长期保障'
      },
      {
        reply: '感谢您的提醒张总！为了确保最终质量，我们在XX环节多花了一些时间做测试优化，因为我们不想把有问题的东西交到您手上。目前一切顺利，预计XX时间可以交付，我把测试报告先发您过目一下。',
        tip: '将"慢"重新定义为"为了质量更严谨"，用"不想交有问题的东西"把延迟转化为负责任的表现，用测试报告等实质材料支撑说法。',
        scenario: '延迟是因为质量把控、且有实质成果可以展示时',
        toneAnalysis: '价值重构 + 质量背书，把客户对"慢"的焦虑转化为对"好"的认同'
      }
    ],
    price_negotiation: [
      {
        reply: '王总，感谢您的坦诚！说实话这个价格确实很有吸引力，不过我这边也想和您算一笔账：我们的方案包含了XX、XX、XX等增值服务，后续还提供一年的免费技术支持。算下来综合性价比其实更高，您的体验也更省心。当然我们也重视和您的合作，我帮您申请一个首单优惠，您看如何？',
        tip: '不直接比价，先拆解价值，让客户明白"贵在哪里"，把价格问题转化为价值问题，然后主动给出小优惠让对方有赢的感觉。',
        scenario: '客户拿竞品比价、但你的方案确实更有价值时',
        toneAnalysis: '价值教育 + 灵活让步，在不破坏价格体系的前提下促成成交'
      },
      {
        reply: '理解理解李总，采购都要控制预算。您看这样行不行：价格我们确实降不了，但我帮您申请把服务期从半年延长到一年，或者额外赠送一个XX模块，总价值算下来比优惠还多，您的使用体验也更好。',
        tip: '守住价格底线，但用增值服务替代直接降价，既保护了利润又让客户得到额外价值，双赢。',
        scenario: '有严格价格体系不能降价、但有增值资源可以灵活调配时',
        toneAnalysis: '坚守原则 + 价值补偿，让客户感觉得到了优惠而不损伤品牌定价'
      },
      {
        reply: '张总您放心，我们从来不靠低价抢单，靠的是交付质量和后续服务。您之前选我们不也是看中了这一点吗？我向您承诺，交付物您不满意我们免费改到满意为止，后续服务随叫随到，这些才是真正帮您省钱的地方。',
        tip: '唤起客户当初选择你的理由（质量/服务），把焦点从价格拉回价值，用具体的服务承诺替代空洞的品质保证。',
        scenario: '客户已经选择了你、但付款前最后砍价时',
        toneAnalysis: '价值回归 + 承诺强化，坚定客户的选择信心'
      }
    ],
    general: [
      {
        reply: '收到您的需求，我这边整理一下详细方案，明天上午10点前发您邮箱，然后我们再约时间沟通细节，您看方便吗？',
        tip: '确认收到 + 明确交付时间 + 提议下一步，给客户充分的确定感和掌控感。',
        scenario: '收到客户新需求或咨询时',
        toneAnalysis: '专业高效 + 尊重客户时间，展现靠谱和周到'
      },
      {
        reply: '感谢您的反馈，您提的这几点非常专业，我们马上优化调整，下周二前给您一个更新版本。',
        tip: '先表达感谢和认可，让客户感到被尊重，然后给出明确的改进承诺。',
        scenario: '客户提出修改意见或反馈时',
        toneAnalysis: '谦逊专业 + 行动力，把反馈转化为改进动力'
      }
    ]
  },
  elder: {
    marriage_pressure: [
      {
        reply: '谢谢大姨关心！我也一直在认真找呢，就是缘分这事儿急不来嘛。您放心，有合适的我一定第一时间带回来给您过目！对了，我最近工作还挺顺利的，领导刚给我涨了工资～',
        tip: '先感恩长辈的关心，表达自己也在积极行动，用"缘分急不来"给台阶，然后巧妙转移话题聊自己的积极进展（工作/学习），让长辈看到你过得好，自然就不那么焦虑了。',
        scenario: '家庭聚餐被集体催婚、场面尴尬时',
        toneAnalysis: '感恩乖巧 + 转移焦点，用积极信息化解催婚压力，不让长辈感到被顶撞'
      },
      {
        reply: '哈哈阿姨您说得对，我也着急呢！要不您帮我留意着点？您认识的人多，有靠谱的帮我介绍介绍，我一定好好见！',
        tip: '顺着长辈的话说，把"催婚"变成"请帮忙"，既给足了长辈面子和参与感，又化解了被催的压力，还真的可能获得有用的资源。',
        scenario: '长辈热情过度、真心实意想帮忙时',
        toneAnalysis: '顺从乖巧 + 邀请参与，把压力转化为合作，让长辈有价值感'
      },
      {
        reply: '妈我知道您是为我好，怕我一个人孤单。但您看我现在每天工作充实，周末和朋友出去玩，过得挺开心的。婚姻是一辈子的事，我想慎重一点，找个真正合适的，不想让您以后为我操心。您说对吗？',
        tip: '先共情母亲的出发点（为我好），让她知道你理解她的爱，然后描述自己目前的幸福状态让她放心，最后用"不想让您操心"站在她的角度说话，把她拉到和你同一战线。',
        scenario: '和父母一对一沟通、需要深度交流时',
        toneAnalysis: '共情感恩 + 自我表达 + 站在对方角度，让父母从焦虑变为理解和支持'
      }
    ],
    career_advice: [
      {
        reply: '妈谢谢您托王阿姨费心！其实我最近也在认真规划职业发展，我现在这个行业前景挺好的，我再干两年积累点经验，到时候有更好的选择也不是不行。您让我先自己闯闯，真需要稳定的时候我再考虑您说的，好吗？',
        tip: '先感恩长辈的付出，不要否定她的安排，而是肯定"我也在规划"，讲清楚自己目前的优势和计划，用"先闯闯再说"给双方都留台阶，不直接对抗。',
        scenario: '父母不理解你的职业选择、想帮你安排稳定工作时',
        toneAnalysis: '感恩尊重 + 展示思考 + 灵活缓冲，不顶撞但坚持自己的节奏'
      },
      {
        reply: '妈我知道您是担心我不稳定、怕我以后吃苦。但您看我现在每个月也能存下钱，也在给自己交社保公积金，生活和保障都没问题。您辛苦了一辈子把我培养大，我想靠自己的能力闯出一片天，不辜负您的期望。再给我两年时间，好吗？',
        tip: '先读懂父母的深层担忧（不稳定、怕你吃苦），用实际数据（存钱、交社保）打消顾虑，然后用"不辜负您的期望"这种父母最能共情的话语，让她明白你是认真的而不是在玩。',
        scenario: '需要从情感层面说服父母、让他们真正放心时',
        toneAnalysis: '深度共情 + 事实支撑 + 情感承诺，让父母从担忧变为骄傲和期待'
      }
    ],
    general: [
      {
        reply: '好的妈/爸，我知道了，您放心。您和爸也要注意身体，别太操劳。',
        tip: '先听话照做让长辈安心，再反过来关心他们的身体，表达孝心。',
        scenario: '长辈日常叮嘱或交代事情时',
        toneAnalysis: '听话孝顺 + 反向关心，让长辈感到被重视和被爱'
      },
      {
        reply: '谢谢阿姨/叔叔关心，您最近身体怎么样？上次听您说腰不太好，有去看医生吗？',
        tip: '被问到时礼貌回应，然后立刻把话题转到关心长辈上，既得体又暖心。',
        scenario: '和亲戚长辈寒暄、被问候近况时',
        toneAnalysis: '礼貌得体 + 主动关心，展现晚辈的懂事和孝心'
      }
    ]
  },
  lover: {
    emotional_upset: [
      {
        reply: '宝贝对不起，真的是我太粗心了，这么重要的日子我居然忘了，你该生气。我现在就订你最爱的那家餐厅，然后去给你挑礼物，今晚我们好好过，弥补我的过错，好不好？🥺',
        tip: '不要解释不要找借口，先完完全全认错+共情对方的情绪（你该生气），然后立刻拿出实际行动方案（订餐厅+礼物+今晚），让对方看到你是真心在弥补而不是嘴上说说。',
        scenario: '确实是自己做错了、对方很伤心或生气时',
        toneAnalysis: '诚恳道歉 + 共情情绪 + 立刻行动，用诚意和行动挽回，而不是空洞的"我错了"'
      },
      {
        reply: '宝宝你说这话我好心疼，怎么会不在乎你呢，你是我最重要的人啊。是我做得不好，让你有这种感觉，这是我的问题。你告诉我，我怎么做才能让你感受到我有多在乎你，我一定改。',
        tip: '先接住对方的情绪（你说这话我好心疼），不要急着反驳"我不是不在乎你"，而是承认"让你有这种感觉是我的问题"，然后主动询问具体的改进方式，把对方从情绪里拉到解决问题的轨道上。',
        scenario: '对方觉得被忽视、需要情感确认时',
        toneAnalysis: '心疼共情 + 自我反省 + 主动求改进，让对方感到被重视和深爱'
      },
      {
        reply: '宝宝抱抱，先不生气好不好，让我抱着你。我知道你等这一天等了很久，我确实太过分了。不管我怎么解释都不对，你给我一个机会，让我用行动证明你对我有多重要，好不好？',
        tip: '先用肢体语言（抱抱）安抚情绪，动作有时比语言更有力量。承认自己错了但不做多余辩解，用请求给彼此台阶，然后用后续行动兑现承诺。',
        scenario: '对方正在气头上、听不进去太多话时',
        toneAnalysis: '肢体安抚 + 诚恳认错 + 温柔请求，用柔情化解怒气'
      }
    ],
    trap_question: [
      {
        reply: '当然先救你啊宝贝！我妈有我爸救呢，而且她游泳比我还好😂 你可是我要守护一辈子的人，当然第一个救你！',
        tip: '给出明确的她想要的答案，然后用幽默的方式化解问题本身的荒谬性，既满足了对方的情感需求，又不让这个问题真的变成一个道德困境。',
        scenario: '经典送命题，对方主要是想确认被偏爱时',
        toneAnalysis: '坚定选择 + 幽默化解，先给情绪价值再用玩笑打破问题的沉重感'
      },
      {
        reply: '傻瓜，我不会让你们两个人同时出现在那么危险的地方的，有我在就不会让你们任何一个人出事。😤',
        tip: '不正面回答问题本身，而是跳出来用"有我在就不会发生"来展现保护欲和担当，把假设性问题转化为你对她的保护承诺。',
        scenario: '对方需要安全感和被保护的感觉时',
        toneAnalysis: '霸气保护 + 回避陷阱，展现担当和责任感'
      },
      {
        reply: '我先教你们两个游泳！这样以后去哪里玩水都不怕了～ 不过真要选的话...当然是先救你这个小笨蛋啊，还用问吗😘',
        tip: '先用脑洞答案制造趣味和轻松感，然后再认真给出她想听的答案，有张有弛，不让对话变得沉重。',
        scenario: '半开玩笑半认真的情境，氛围比较轻松时',
        toneAnalysis: '幽默轻松 + 认真答案，先活跃气氛再表达心意'
      }
    ],
    general: [
      {
        reply: '宝贝今天过得怎么样呀？有没有想我？反正我一直在想你～🥰',
        tip: '日常的情感表达，主动关心+表达思念，让恋爱保持温度。',
        scenario: '日常聊天、想对方了时',
        toneAnalysis: '甜蜜温暖 + 主动表达，保持恋爱的新鲜感和亲密感'
      },
      {
        reply: '你说的都对，我听你的。不过我有个小小的想法，要不要听听看？😜',
        tip: '先认同对方拉近距离，再温和提出自己的想法，不让讨论变成争吵。',
        scenario: '有不同意见、需要商量时',
        toneAnalysis: '先顺从后表达，温柔地坚持自己，尊重对方也不委屈自己'
      }
    ]
  }
}

const generalReplyBank: Record<string, ReplyTemplate[]> = {
  tactful: [
    {
      reply: '你说的这个挺有意思的，我理解你的意思。我这边可能需要再想想，回头和你聊好吗？',
      tip: '不直接拒绝或同意，用"需要再想想"争取时间和空间，给自己留出余地。',
      scenario: '不好立刻答复、需要时间考虑或委婉拒绝时',
      toneAnalysis: '委婉含蓄 + 保留余地，不把话说死，给自己和对方都留台阶'
    }
  ],
  humorous: [
    {
      reply: '哈哈哈你这话太有梗了，我得截图保存下来，以后当金句用！',
      tip: '用夸张赞美+玩笑化解，既表达了欣赏又活跃了气氛。',
      scenario: '对方说了有趣的话、想活跃氛围时',
      toneAnalysis: '轻松幽默 + 夸张赞美，让对话更有趣味'
    }
  ],
  warm: [
    {
      reply: '我能理解你的感受，有什么需要帮忙的随时说，我都在。',
      tip: '先共情理解，再表达支持，让对方感到温暖和被陪伴。',
      scenario: '对方遇到困难或情绪低落时',
      toneAnalysis: '温暖共情 + 实际支持，让对方感到被理解和不孤单'
    }
  ],
  professional: [
    {
      reply: '感谢你的反馈，我这边认真考虑一下，有进展及时和你沟通。',
      tip: '专业得体，感谢对方输入，表明自己的态度和后续动作。',
      scenario: '工作或正式场合接收反馈时',
      toneAnalysis: '专业稳重 + 明确后续，展现职业素养'
    }
  ],
  playful: [
    {
      reply: '哟，这话我可记下了啊，以后要考的！😏',
      tip: '带点调皮的回应，轻松又不尴尬，拉近距离。',
      scenario: '关系较近、想让对话更有趣时',
      toneAnalysis: '俏皮轻松 + 互动感，让对话更有乐趣'
    }
  ],
  reassuring: [
    {
      reply: '别担心，事情没有你想的那么糟，我们一步步来，会好起来的。',
      tip: '先安抚情绪，给出积极预期，然后引导到行动方向。',
      scenario: '对方焦虑、担心、需要定心丸时',
      toneAnalysis: '安抚定心 + 积极引导，给对方信心和力量'
    }
  ],
  grateful: [
    {
      reply: '真的太感谢你了，有你真好！这份心意我记下了，以后有用得着我的地方随时说。',
      tip: '充分表达感谢，强调对方的重要性，同时传递出"我也会回报"的心意。',
      scenario: '对方帮了忙或表达了善意时',
      toneAnalysis: '真诚感恩 + 双向承诺，让善意有来有回'
    }
  ],
  assertive: [
    {
      reply: '我理解你的想法，但我这边的情况确实不太一样。我的想法是XX，你看我们能不能找到一个双方都能接受的方案？',
      tip: '先肯定对方避免对立，再温和但清晰地表达自己的立场，最后提出合作式解决方案。',
      scenario: '有不同意见、需要温和但坚定地表达立场时',
      toneAnalysis: '尊重对方 + 坚定自我 + 合作导向，不卑不亢寻求共赢'
    }
  ],
  curious: [
    {
      reply: '这个角度挺有意思的，能说说你是怎么想到的吗？',
      tip: '用好奇提问引导对方多说，既表达了兴趣又能获得更多信息。',
      scenario: '对方提出观点、你想了解更多时',
      toneAnalysis: '好奇引导 + 真诚关注，让对话更深入'
    }
  ],
  complimentary: [
    {
      reply: '你这个想法太棒了！考虑得特别周到，我怎么没想到呢，还是你厉害！',
      tip: '具体的赞美比空泛的"你真棒"更真诚，指出具体优点，让赞美有分量。',
      scenario: '对方做得好、提出好想法时',
      toneAnalysis: '真诚赞美 + 具体认可，让夸奖有力度不敷衍'
    }
  ]
}

const generateSingleReply = (styleKey: string, relation: string): ReplyResult | null => {
  const intent = extractMessageIntent(opponentMessage.value.trim())
  const relationConfig = getRelationConfig(relation)
  const relationBank = replyTemplateBank[relation] || {}
  const intentBank = relationBank[intent] || relationBank.general || []
  const styleBank = generalReplyBank[styleKey] || []

  let pool: ReplyTemplate[] = [...intentBank]

  if (selectedStyles.value.length > 0) {
    const filteredByStyle = intentBank.filter(() => selectedStyles.value.includes(styleKey))
    if (filteredByStyle.length > 0) {
      pool = [...filteredByStyle]
    }
  }

  if (pool.length === 0) {
    pool = [...styleBank]
  }
  if (pool.length === 0) {
    pool = [...intentBank]
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)] || {
    reply: '好的，我明白你的意思了，我们可以进一步聊聊这个。',
    tip: '用中性的承接回应，给后续对话留出空间。',
    scenario: '一般日常交流场景',
    toneAnalysis: '中性承接 + 留出空间，稳妥不犯错'
  }

  let finalReply = chosen.reply
  if (relationConfig.emojiChance > 0 && Math.random() < relationConfig.emojiChance) {
    const emojiMap: Record<string, string[]> = {
      friend: ['😂', '🤝', '👊', '🍻', '🎉', '😜', '👍'],
      colleague: ['👍', '💪', '😊', '🙏', '👌'],
      client: ['🙏', '😊', '👍', '💼'],
      elder: ['😊', '🙏', '👍'],
      lover: ['🥺', '💕', '😘', '🥰', '💖', '😜', '😊', '💪']
    }
    const emojis = emojiMap[relation] || emojiMap.friend
    if (emojis.length > 0 && !/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}]/u.test(finalReply)) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)]
      if (Math.random() > 0.5) {
        finalReply = finalReply + emoji
      } else {
        finalReply = emoji + ' ' + finalReply
      }
    }
  }

  return {
    reply: finalReply,
    style: styleKey,
    styleLabel: getStyleLabel(styleKey),
    tip: chosen.tip,
    scenario: chosen.scenario,
    toneAnalysis: chosen.toneAnalysis,
    relation: relation,
    rating: 3 + Math.ceil(Math.random() * 2)
  }
}

const getApplicableStyles = (): string[] => {
  if (selectedStyles.value.length > 0) {
    return selectedStyles.value
  }
  const allKeys = allStyles.map(s => s.value)
  const shuffled = [...allKeys].sort(() => Math.random() - 0.5)
  return shuffled
}

const generateReplies = async () => {
  if (!opponentMessage.value.trim()) {
    ElMessage.warning('请输入对方发送的内容')
    return
  }

  isGenerating.value = true
  generatedResults.value = []

  await new Promise(resolve => setTimeout(resolve, 700))

  const applicableStyles = getApplicableStyles()
  if (applicableStyles.length === 0) {
    ElMessage.warning('请选择至少一种回复风格，或取消选择让系统自动匹配')
    isGenerating.value = false
    return
  }

  const shuffled = [...applicableStyles].sort(() => Math.random() - 0.5)
  const picked: string[] = []
  for (let i = 0; i < replyCount.value; i++) {
    picked.push(shuffled[i % shuffled.length])
  }
  const finalPicked = picked.sort(() => Math.random() - 0.5)

  for (let i = 0; i < finalPicked.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 280))
    const result = generateSingleReply(finalPicked[i], selectedRelation.value)
    if (result) {
      generatedResults.value.push(result)
    }
  }

  isGenerating.value = false

  history.value.push({
    chatScene: chatScene.value.trim(),
    opponentMessage: opponentMessage.value.trim(),
    relation: selectedRelation.value,
    styles: [...selectedStyles.value],
    results: [...generatedResults.value],
    time: new Date().toISOString()
  })
  saveHistory()

  ElMessage.success({
    message: `💡 已为「${getRelationLabel(selectedRelation.value)}」场景生成 ${generatedResults.value.length} 个高情商回复方案`,
    type: 'success',
    duration: 3000,
    showClose: true
  })
}

const regenerateOne = async (index: number) => {
  const current = generatedResults.value[index]
  const applicableStyles = getApplicableStyles()
  const pool = applicableStyles.filter(s => s !== current.style)
  const styleKey = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : current.style
  const newResult = generateSingleReply(styleKey, selectedRelation.value)
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

const copyAllResults = async () => {
  const text = generatedResults.value
    .map((r, i) => `${i + 1}. ${r.reply}\n   情商技巧：${r.tip}`)
    .join('\n\n')
  await copyText(text)
}

const copyWithExplanation = async (result: ReplyResult) => {
  const text = `【回复】${result.reply}\n\n【回复风格】${result.styleLabel}\n\n【情商技巧】${result.tip}\n\n【适用时机】${result.scenario}\n\n【语气分析】${result.toneAnalysis}`
  await copyText(text)
}

const resetAll = () => {
  chatScene.value = ''
  opponentMessage.value = ''
  selectedStyles.value = []
  selectedRelation.value = 'friend'
  replyCount.value = 3
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
  chatScene.value = item.chatScene
  opponentMessage.value = item.opponentMessage
  selectedRelation.value = item.relation
  selectedStyles.value = [...item.styles]
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
.high-eq-reply-generator {
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

.relation-diff-table {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
}

.diff-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
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
}

.section-title .hint-tag {
  margin-left: 8px;
  font-weight: normal;
}

.section-title .required-tag {
  color: #f56c6c;
  margin-left: 4px;
}

.input-section {
  margin-bottom: 20px;
}

.quick-samples {
  margin-top: 10px 0 0 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.sample-label {
  font-size: 13px;
  color: #909399;
  margin-right: 4px;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.sample-tag:hover {
  transform: translateY(-1px);
}

.relation-section {
  margin-bottom: 20px;
}

.relation-options {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.relation-card {
  padding: 16px 12px;
  border: 2px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s;
  text-align: center;
  background: #fff;
}

.relation-card:hover:not(.disabled) {
  border-color: #c6e2ff;
  background: #f0f7ff;
  transform: translateY(-2px);
}

.relation-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #e8f3ff 0%, #f0f7ff 100%);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.relation-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.relation-emoji {
  font-size: 32px;
  margin-bottom: 6px;
}

.relation-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.relation-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.relation-tip {
  font-size: 11px;
  color: #165DFF;
  background: rgba(22, 93, 255, 0.08);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.two-col-section {
  display: flex;
  gap: 24px;
  margin-bottom: 8px;
}

.flex-1 {
  flex: 1;
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
  padding: 8px 14px;
  border: 1.5px solid #ebeef5;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  font-size: 14px;
  color: #606266;
}

.style-chip:hover:not(.disabled) {
  border-color: #c6e2ff;
  background: #f0f7ff;
}

.style-chip.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
}

.style-chip.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.style-emoji {
  font-size: 16px;
}

.style-tip {
  margin-top: 10px;
}

.version-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.version-card {
  padding: 16px 12px;
  border: 2px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s;
  text-align: center;
  background: #fff;
}

.version-card:hover:not(.disabled) {
  border-color: #c6e2ff;
  background: #f0f7ff;
  transform: translateY(-2px);
}

.version-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #e8f3ff 0%, #f0f7ff 100%);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.version-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.version-num {
  font-size: 28px;
  font-weight: 700;
  color: #165DFF;
  line-height: 1;
  margin-bottom: 4px;
}

.version-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}

.version-desc {
  font-size: 12px;
  color: #909399;
}

.action-section {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.generate-btn {
  min-width: 200px;
}

.btn-loading-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.generating-status {
  margin-top: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 10px;
  border: 1px solid #bae6fd;
  display: flex;
  align-items: center;
  gap: 12px;
}

.generating-dots {
  display: inline-flex;
  gap: 4px;
}

.generating-dots .dot {
  width: 8px;
  height: 8px;
  background: #165DFF;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.generating-dots .dot:nth-child(1) { animation-delay: -0.32s; }
.generating-dots .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.generating-text {
  font-size: 14px;
  color: #0369a1;
  font-weight: 500;
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
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  transition: all 0.3s;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.4s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border-color: #d9ecff;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.result-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-index {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.relation-tag {
  background: #f0f7ff;
  color: #165DFF;
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

.result-reply {
  padding: 16px 18px;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef1f6 100%);
  border-radius: 10px;
  border-left: 4px solid #165DFF;
  font-size: 16px;
  line-height: 1.7;
  color: #303133;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  transition: all 0.2s;
}

.result-reply:hover {
  background: linear-gradient(135deg, #e8f3ff 0%, #f0f7ff 100%);
}

.reply-text {
  flex: 1;
  white-space: pre-wrap;
  word-break: break-word;
}

.copy-icon {
  color: #909399;
  flex-shrink: 0;
  margin-top: 2px;
  transition: color 0.2s;
}

.result-reply:hover .copy-icon {
  color: #165DFF;
}

.result-details {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px dashed #ebeef5;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.detail-content {
  flex: 1;
  font-size: 13px;
  line-height: 1.6;
}

.detail-label {
  font-weight: 600;
  color: #303133;
}

.detail-text {
  color: #606266;
}

.result-actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
}

.history-card {
  margin-bottom: 24px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  padding: 12px 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
}

.history-item:hover {
  background: #f5f7fa;
  border-color: #d9ecff;
}

.history-time {
  font-size: 12px;
  color: #909399;
  min-width: 90px;
}

.history-message {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
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
  gap: 6px;
}

.history-footer {
  margin-top: 12px;
  text-align: center;
}

@media (max-width: 768px) {
  .expectation-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .relation-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .two-col-section {
    flex-direction: column;
    gap: 0;
  }

  .diff-row {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>