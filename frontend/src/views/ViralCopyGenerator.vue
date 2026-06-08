<template>
  <div class="viral-copy-generator">
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
        <el-step title="输入产品/主题信息" description="产品名称、核心卖点、目标用户" />
        <el-step title="选择发布场景" description="小红书/抖音/朋友圈/电商详情页" />
        <el-step title="设定文案偏好" description="风格 × 版本数量" />
        <el-step title="查看与复制" description="多版本文案对比择优，一键复制" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Collection /></el-icon>
            <div class="exp-text">
              <div class="exp-num">4 大场景适配</div>
              <div class="exp-label">小红书/抖音/朋友圈/电商</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">6 种爆款风格</div>
              <div class="exp-label">悬念/痛点/利益/对比/情感/数字</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Grid /></el-icon>
            <div class="exp-text">
              <div class="exp-num">5 层文案结构</div>
              <div class="exp-label">标题 + Hook + 正文 + CTA + 话题</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Bulb /></el-icon>
            <div class="exp-text">
              <div class="exp-num">多版本并行</div>
              <div class="exp-label">3~8 个版本对比择优</div>
            </div>
          </div>
        </div>
        <el-divider />
        <h4 class="expectation-title">🎯 各场景文案差异说明</h4>
        <div class="channel-diff-table">
          <div class="diff-row diff-header">
            <div class="diff-col">差异维度</div>
            <div class="diff-col">📕 小红书</div>
            <div class="diff-col">🎬 抖音</div>
            <div class="diff-col">💬 朋友圈</div>
            <div class="diff-col">🛒 电商详情页</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">标题字数</div>
            <div class="diff-col">15 ~ 25 字</div>
            <div class="diff-col">8 ~ 18 字</div>
            <div class="diff-col">10 ~ 30 字</div>
            <div class="diff-col">20 ~ 40 字</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">emoji 密度</div>
            <div class="diff-col">丰富多样</div>
            <div class="diff-col">1~3 个 / 标题</div>
            <div class="diff-col">适当点缀</div>
            <div class="diff-col">促销 emoji</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">核心关键词</div>
            <div class="diff-col">种草、宝藏、绝绝子</div>
            <div class="diff-col">绝了、必看、惊了</div>
            <div class="diff-col">推荐、分享、亲测</div>
            <div class="diff-col">热销、爆款、限量</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">语气风格</div>
            <div class="diff-col">闺蜜分享、亲切种草</div>
            <div class="diff-col">夸张口语、快节奏</div>
            <div class="diff-col">真实走心、生活化</div>
            <div class="diff-col">促销紧迫感、利益前置</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">正文长度</div>
            <div class="diff-col">300 ~ 800 字</div>
            <div class="diff-col">100 ~ 200 字</div>
            <div class="diff-col">150 ~ 300 字</div>
            <div class="diff-col">200 ~ 500 字</div>
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
          <span>AI 爆款文案生成</span>
          <el-tag size="small" type="warning">多场景 · 多风格 · 多版本</el-tag>
        </div>
      </template>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Goods /></el-icon>
          <span>产品名称 / 内容主题</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="productName"
          placeholder="例如：小气泡清洁面膜 / 夏日显瘦穿搭攻略 / 高效学习方法分享"
          maxlength="50"
          show-word-limit
          :disabled="isGenerating"
          clearable
        />
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Star /></el-icon>
          <span>核心卖点 / 内容亮点（每行一个，建议 2~5 个）</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="sellingPointsText"
          type="textarea"
          :rows="5"
          :placeholder="currentPlaceholder"
          :disabled="isGenerating"
          resize="vertical"
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
            {{ sample.name }}
          </el-tag>
        </div>
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><User /></el-icon>
          <span>目标用户 / 受众画像</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="targetUser"
          type="textarea"
          :rows="2"
          placeholder="描述用户的年龄、身份、痛点、需求，例如：25-35岁爱美女性，经常熬夜肤色暗沉，追求高性价比护肤"
          maxlength="200"
          show-word-limit
          :disabled="isGenerating"
          resize="none"
        />
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Grid /></el-icon>
          <span>发布场景</span>
          <el-tag size="small" type="info" class="hint-tag">
            不同场景的字数、emoji、语气、结构均会自动适配
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

      <div class="two-col-section">
        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><MagicStick /></el-icon>
            <span>文案风格</span>
          </div>
          <div class="style-options">
            <div
              v-for="style in styles"
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
            <el-tag size="small" type="info">不选则自动随机搭配风格</el-tag>
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
              :class="{ active: versionCount === opt.value, disabled: isGenerating }"
              @click="!isGenerating && (versionCount = opt.value)"
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
          @click="generateCopy"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 正在基于「{{ getSceneLabel(selectedScene) }}」场景生成 {{ versionCount }} 个爆款文案…
            </span>
          </template>
          生成爆款文案
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
          ✨ 正在分析 {{ sellingPointsList.length }} 个核心卖点，运用爆款文案创作逻辑为你打造高传播性内容…
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
            {{ getSceneLabel(selectedScene) }} · 共 {{ generatedResults.length }} 个版本
          </el-tag>
          <div class="header-actions">
            <el-button size="small" type="primary" link :icon="CopyDocument" @click="copyAllResults">
              复制全部版本
            </el-button>
          </div>
        </div>
      </template>

      <div class="version-tabs">
        <div
          v-for="(_, idx) in generatedResults"
          :key="idx"
          class="version-tab"
          :class="{ active: activeVersion === idx }"
          @click="activeVersion = idx"
        >
          版本 {{ idx + 1 }}
          <el-tag size="small" :type="getVersionTagType(idx)">
            {{ generatedResults[idx].styleLabel }}
          </el-tag>
        </div>
      </div>

      <div v-if="currentResult" class="result-content">
        <div class="result-section">
          <div class="section-title-sm">
            <el-icon color="#e6a23c"><ChatDotRound /></el-icon>
            <span>🔥 爆款标题</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.title)">复制</el-button>
          </div>
          <div class="result-title-text">{{ currentResult.title }}</div>
        </div>

        <div class="result-section">
          <div class="section-title-sm">
            <el-icon color="#f56c6c"><Promotion /></el-icon>
            <span>⚡ Hook 开头（前3秒/前2行抓住眼球）</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.hook)">复制</el-button>
          </div>
          <div class="result-hook-text">{{ currentResult.hook }}</div>
        </div>

        <div class="result-section">
          <div class="section-title-sm">
            <el-icon color="#165DFF"><EditPen /></el-icon>
            <span>📝 正文内容</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.body)">复制</el-button>
          </div>
          <div class="result-body-text">{{ currentResult.body }}</div>
        </div>

        <div v-if="currentResult.cta" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#67c23a"><Flag /></el-icon>
            <span>🎯 CTA 行动号召</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.cta)">复制</el-button>
          </div>
          <div class="result-cta-text">{{ currentResult.cta }}</div>
        </div>

        <div v-if="currentResult.hashtags" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#909399"><Collection /></el-icon>
            <span>#️⃣ 话题标签 / 关键词</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.hashtags)">复制</el-button>
          </div>
          <div class="result-hashtags-text">{{ currentResult.hashtags }}</div>
        </div>

        <div class="result-footer">
          <el-button type="primary" :icon="Download" @click="copyCurrentFull">
            复制完整文案（版本 {{ activeVersion + 1 }}）
          </el-button>
          <el-button :icon="RefreshRight" @click="regenerateVersion">
            换一个风格
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
          @click="loadFromHistory(item)"
        >
          <div class="history-time">{{ formatTime(item.time) }}</div>
          <div class="history-product">
            <el-tag size="small" type="info">{{ getSceneLabel(item.scene) }}</el-tag>
            <span class="history-text">{{ item.productName }}</span>
          </div>
          <div class="history-meta">
            <el-tag size="small" type="success">{{ item.results.length }}个版本</el-tag>
            <el-tag size="small" type="warning">{{ item.sellingPoints.length }}个卖点</el-tag>
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
  Goods,
  Star,
  User,
  Grid,
  MagicStick,
  Refresh,
  Loading,
  Finished,
  CopyDocument,
  Download,
  Clock,
  InfoFilled,
  Collection,
  ChatDotRound,
  Flag,
  Promotion,
  Document,
  RefreshRight,
  Bulb,
  EditPen
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface ViralCopyResult {
  title: string
  hook: string
  body: string
  cta: string
  hashtags: string
  style: string
  styleLabel: string
}

interface HistoryItem {
  productName: string
  sellingPointsText: string
  sellingPoints: string[]
  targetUser: string
  scene: string
  results: ViralCopyResult[]
  time: string
}

interface QuickSample {
  name: string
  scene: string
  productName: string
  sellingPoints: string[]
  targetUser: string
}

const STORAGE_KEY = 'viral_copy_history'

const scenes = [
  {
    value: 'xiaohongshu',
    label: '小红书种草',
    emoji: '📕',
    desc: '小红书笔记、种草分享',
    spec: '图文长文 · 亲切种草',
    config: {
      titleMin: 15,
      titleMax: 25,
      bodyMin: 300,
      bodyMax: 800,
      emojiChance: 0.9,
      tone: 'friendly',
      keywords: ['种草', '宝藏', '绝绝子', 'yyds', '姐妹们', '亲测', '安利', '闭眼入', '平价好物', '学生党'],
      channelEmojis: ['💕', '🌸', '✨', '💖', '🌿', '🎀', '🍀', '☀️', '💫', '🌟'],
      ctaTypes: ['评论互动', '收藏关注', '私信咨询', '链接购买']
    }
  },
  {
    value: 'douyin',
    label: '抖音短视频',
    emoji: '🎬',
    desc: '抖音、快手、视频号',
    spec: '短视频文案 · 夸张吸睛',
    config: {
      titleMin: 8,
      titleMax: 18,
      bodyMin: 100,
      bodyMax: 200,
      emojiChance: 0.85,
      tone: 'dramatic',
      keywords: ['绝了', '必看', '惊了', '看完', '太绝了', '谁敢信', '离谱', '破防了', '不看后悔', '最后一个'],
      channelEmojis: ['🔥', '😱', '💥', '👀', '⚠️', '✨', '💯', '🚀', '💪', '👇'],
      ctaTypes: ['点赞关注', '评论留言', '转发分享', '点击购物车']
    }
  },
  {
    value: 'moments',
    label: '朋友圈广告',
    emoji: '💬',
    desc: '朋友圈、社群分享',
    spec: '真实走心 · 生活化',
    config: {
      titleMin: 10,
      titleMax: 30,
      bodyMin: 150,
      bodyMax: 300,
      emojiChance: 0.6,
      tone: 'heartfelt',
      keywords: ['推荐', '分享', '亲测', '真心', '自用', '身边人都在用', '不吹不黑', '说实话'],
      channelEmojis: ['😊', '👍', '❤️', '🎉', '✨', '💯', '🙌', '☕️'],
      ctaTypes: ['私聊咨询', '点赞互动', '转发给好友', '扫码了解']
    }
  },
  {
    value: 'ecommerce',
    label: '电商详情页',
    emoji: '🛒',
    desc: '淘宝、京东、拼多多',
    spec: '促销紧迫 · 利益前置',
    config: {
      titleMin: 20,
      titleMax: 40,
      bodyMin: 200,
      bodyMax: 500,
      emojiChance: 0.5,
      tone: 'promotional',
      keywords: ['热销', '爆款', '限量', '限时', '特惠', '直降', '包邮', '官方正品', '买一送一', '今日特价'],
      channelEmojis: ['🔥', '💰', '🎁', '⚡', '🏆', '💎', '✅', '🚚', '💝', '🎊'],
      ctaTypes: ['立即下单', '加入购物车', '领券购买', '限时抢购']
    }
  }
]

const styles = [
  { value: 'suspense', label: '悬念好奇', emoji: '🔮' },
  { value: 'painpoint', label: '痛点共鸣', emoji: '💔' },
  { value: 'benefit', label: '利益诱惑', emoji: '🎯' },
  { value: 'contrast', label: '对比反差', emoji: '⚖️' },
  { value: 'emotion', label: '情感走心', emoji: '💗' },
  { value: 'number', label: '数字清单', emoji: '🔢' }
]

const versionOptions = [
  { value: 3, label: '3个', desc: '核心优选版' },
  { value: 5, label: '5个', desc: '覆盖主流风格' },
  { value: 8, label: '8个', desc: '全风格探索' }
]

const quickSamples: QuickSample[] = [
  {
    name: '护肤产品',
    scene: 'xiaohongshu',
    productName: '小气泡清洁面膜',
    sellingPoints: ['深层清洁毛孔', '温和不刺激', '15分钟黑头浮出', '敏感肌可用', '性价比超高'],
    targetUser: '25-35岁爱美女性，经常熬夜肤色暗沉，毛孔粗大黑头多，追求高性价比护肤'
  },
  {
    name: '穿搭内容',
    scene: 'douyin',
    productName: '夏日微胖显瘦穿搭',
    sellingPoints: ['视觉显瘦10斤', '遮肉不显胯', '150cm也能穿', '一衣多穿', '平价不廉价'],
    targetUser: '20-35岁微胖女生，身高150-165cm，腰腹有肉胯宽，想穿得显瘦又时尚'
  },
  {
    name: '知识付费',
    scene: 'moments',
    productName: '高效学习方法论',
    sellingPoints: ['30分钟专注法', '记忆效率提升3倍', '告别拖延症', '亲测有效', '附赠学习模板'],
    targetUser: '20-40岁学生和职场人，学习效率低容易分心，想在有限时间内获得最大成长'
  },
  {
    name: '家居好物',
    scene: 'ecommerce',
    productName: '全自动洗脱一体扫地机器人',
    sellingPoints: ['激光导航精准建图', '自动洗拖布', '5000Pa大吸力', 'APP远程控制', '30天免清理尘盒'],
    targetUser: '25-45岁都市白领和宝妈，工作忙没时间做家务，想解放双手提升生活品质'
  }
]

const productName = ref('')
const sellingPointsText = ref('')
const targetUser = ref('')
const selectedScene = ref('xiaohongshu')
const selectedStyles = ref<string[]>([])
const versionCount = ref(5)
const isGenerating = ref(false)
const generatedResults = ref<ViralCopyResult[]>([])
const activeVersion = ref(0)
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const sellingPointsList = computed(() =>
  sellingPointsText.value.split('\n').map(s => s.trim()).filter(s => s.length > 0)
)

const currentPlaceholder = computed(() => {
  const placeholders: Record<string, string> = {
    xiaohongshu: '例如：\n深层清洁毛孔\n温和不刺激\n15分钟黑头浮出\n敏感肌可用',
    douyin: '例如：\n视觉显瘦10斤\n遮肉不显胯\n150cm也能穿\n一衣多穿',
    moments: '例如：\n30分钟专注法\n记忆效率提升3倍\n告别拖延症\n亲测有效',
    ecommerce: '例如：\n激光导航精准建图\n自动洗拖布\n5000Pa大吸力\n30天免清理尘盒'
  }
  return placeholders[selectedScene.value] || placeholders.xiaohongshu
})

const currentStep = computed(() => {
  if (generatedResults.value.length > 0 && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (productName.value || sellingPointsText.value) return 1
  return 0
})

const canGenerate = computed(() => {
  return productName.value.trim().length > 0
    && sellingPointsList.value.length > 0
    && targetUser.value.trim().length > 0
})

const currentResult = computed(() => generatedResults.value[activeVersion.value] || null)

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const getSceneLabel = (v: string) => scenes.find(s => s.value === v)?.label || v
const getStyleLabel = (v: string) => styles.find(s => s.value === v)?.label || v
const getVersionTagType = (idx: number): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const types: Array<'' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = ['primary', 'success', 'warning', 'danger', 'info', '']
  return types[idx % types.length]
}

const applySample = (sample: QuickSample) => {
  selectedScene.value = sample.scene
  productName.value = sample.productName
  sellingPointsText.value = sample.sellingPoints.join('\n')
  targetUser.value = sample.targetUser
}

const toggleStyle = (value: string) => {
  const idx = selectedStyles.value.indexOf(value)
  if (idx > -1) {
    selectedStyles.value.splice(idx, 1)
  } else {
    selectedStyles.value.push(value)
  }
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const pickMany = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, arr.length))
}

const addEmojis = (text: string, scene: string, count: number = 2): string => {
  const config = scenes.find(s => s.value === scene)?.config
  if (!config || Math.random() > config.emojiChance) return text
  const emojis = pickMany(config.channelEmojis, count)
  const pos = Math.random()
  if (pos < 0.33) return `${emojis.join('')} ${text}`
  if (pos < 0.66) return `${text} ${emojis.join('')}`
  return `${emojis[0]} ${text} ${emojis.slice(1).join('')}`
}

const extractUserPain = (targetUserStr: string): string[] => {
  const painKeywords = ['暗沉', '毛孔', '黑头', '胖', '矮', '胯宽', '腰粗', '拖延', '分心', '效率低', '没时间', '累', '贵', '敏感', '过敏', '干燥', '出油', '皱纹', '松弛', '显老', '没精神', '失眠', '焦虑', '压力', '迷茫', '穷']
  return painKeywords.filter(p => targetUserStr.includes(p))
}

const generateTitle = (style: string, scene: string, product: string, points: string[], user: string): string => {
  const config = scenes.find(s => s.value === scene)?.config!
  const pains = extractUserPain(user)
  const mainPoint = points[0] || product
  const kw = pickMany(config.keywords, 2)

  const templates: Record<string, string[]> = {
    suspense: [
      `为什么${product}能让${kw[0]}？真相来了`,
      `${product}的${kw[0]}秘密，90%的人不知道`,
      `用了${product}才发现，以前都白用了`,
      `关于${product}，你一定要知道的${kw[0]}真相`
    ],
    painpoint: pains.length > 0 ? [
      `${pains[0]}？${product}帮你解决${kw[0]}问题`,
      `还在为${pains[0]}发愁？${product}${kw[1]}安排`,
      `被${pains[0]}困扰多年？${product}${kw[0]}解决`,
      `${pains[0]}救星！${product}真的${kw[1]}`
    ] : [
      `踩过无数坑后，终于找到${product}${kw[0]}`,
      `${kw[0]}避坑指南：${product}才是${kw[1]}`,
      `试过N种方法，还是${product}${kw[0]}`
    ],
    benefit: [
      `${product}：${mainPoint}，${kw[0]}真的${kw[1]}`,
      `${kw[0]}！${product}让你${mainPoint}`,
      `${mainPoint}？${product}${kw[0]}体验太${kw[1]}`,
      `${product}${kw[0]}，${mainPoint}不是梦`
    ],
    contrast: [
      `用之前VS用之后：${product}太${kw[0]}了`,
      `告别传统方式，${product}${kw[1]}革命`,
      `同样是${product}，为什么这款${kw[0]}？`,
      `以前VS现在：${product}改变了我${kw[1]}`
    ],
    emotion: [
      `${kw[0]}！${product}让我重新认识了${kw[1]}`,
      `${product}，用过的人都说${kw[1]}`,
      `真心${kw[0]}：${product}真的不一样`,
      `${product}——${kw[1]}的${kw[0]}选择`
    ],
    number: [
      `${pick([3, 4, 5, 6, 8])}个理由告诉你，${product}为什么${kw[0]}`,
      `${product}的${pick([3, 5, 7])}大${kw[0]}亮点，${kw[1]}必看`,
      `${pick([5, 6, 8])}分钟了解${product}的${kw[0]}优势`,
      `${pick([3, 4, 5])}招教你用${product}实现${kw[1]}`
    ]
  }

  let title = pick(templates[style] || templates.benefit)
  if (scene === 'douyin') {
    title = title.replace(/，/g, '！').replace(/。/g, '')
    if (!/[！？]$/.test(title)) title += '！'
  }
  title = addEmojis(title, scene, scene === 'xiaohongshu' ? 3 : 2)
  return title
}

const generateHook = (style: string, scene: string, product: string, points: string[], user: string): string => {
  const pains = extractUserPain(user)
  const config = scenes.find(s => s.value === scene)?.config!

  const hooks: Record<string, string[]> = {
    suspense: [
      `你是不是也好奇，${product}到底有什么魔力，能让这么多人${pick(config.keywords)}？今天给你们扒一扒真实体验～`,
      `说实话，一开始我也不信${product}能有多${pick(config.keywords)}，直到我亲自用了${pick([3, 7, 15, 30])}天...`,
      `如果不是亲测，我真的不敢相信${product}居然这么${pick(config.keywords)}！看完你就懂了👇`
    ],
    painpoint: pains.length > 0 ? [
      `有没有人和我一样，被${pains[0]}折磨了很久？${pains.length > 1 ? `还有${pains.slice(1).join('、')}这些问题，` : ''}真的太崩溃了😫`,
      `姐妹们！${pains[0]}的痛谁懂啊！！试了各种方法都没用，直到我遇到了${product}...`,
      `如果你也有${pains.slice(0, Math.min(3, pains.length)).join('、')}这些困扰，那这篇你一定要看完！`
    ] : [
      `有没有人跟我一样，踩过${pick(['无数', '好多', 'N多'])}坑之后才发现，选对${product.slice(0, 4)}真的太重要了！`,
      `说实话，在遇到这款${product}之前，我对这类产品已经不抱希望了...`
    ],
    benefit: [
      `今天给大家${pick(config.keywords)}一个好东西！${product}——${points[0]}，用过的都说${pick(config.keywords)}～`,
      `家人们谁懂啊！${product}真的太${pick(config.keywords)}了！${points[0]}这点我真的爱了❤️`,
      `${pick(config.keywords)}！${product}可以说是我今年${pick(['最满意', '最值', '最惊喜'])}的入手了！`
    ],
    contrast: [
      `以前我总觉得${product}都差不多，直到用了这款才发现：原来差距这么大！`,
      `没有对比就没有伤害！用了这款${product}之后，家里原来的直接被我闲置了...`,
      `从${pick(['怀疑', '拒绝', '嫌弃'])}到${pick(['回购', '安利', '离不开'])}，${product}到底做对了什么？`
    ],
    emotion: [
      `写这篇的时候我真的很感慨，${product}不仅仅是${pick(['一个产品', '一件物品', '一个工具'])}，更像是...`,
      `真的很想把这款${product}分享给每一个懂的人，那种${pick(['被理解', '被治愈', '被拯救'])}的感觉，希望你们也能体会到～`,
      `犹豫了很久还是决定发出来，关于${product}，有些话我真的不吐不快...`
    ],
    number: [
      `今天给大家盘点${product}的${pick([3, 4, 5, 6])}个${pick(['神仙', '宝藏', '惊喜'])}亮点，最后一个真的绝了！`,
      `${pick([3, 5, 7])}个角度深度解析${product}，看完你就知道为什么这么多人${pick(config.keywords)}`,
      `关于${product}，这${pick([3, 4, 5])}点你一定要知道！特别是第${pick([2, 3])}点！`
    ]
  }

  return addEmojis(pick(hooks[style] || hooks.benefit), scene, 1)
}

const generateBody = (style: string, scene: string, product: string, points: string[], user: string): string => {
  const config = scenes.find(s => s.value === scene)?.config!
  const pains = extractUserPain(user)
  const lines: string[] = []

  if (scene === 'xiaohongshu') {
    lines.push(`📍先说说我的情况：${user}`)
    lines.push('')
    lines.push('💡我的真实体验：')
    points.forEach((p, i) => {
      const pointEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']
      const adjectives = ['真的绝了', '太惊喜了', '超爱这个', '必须夸一夸', '这个最打动我', '强烈推荐']
      lines.push(`${pointEmojis[i] || '✨'} ${p}——${pick(adjectives)}！${generateDetailForPoint(p, user, scene)}`)
    })
    lines.push('')
    if (pains.length > 0) {
      lines.push(`😭以前的困扰：${pains.join('、')}，用了很多方法都没有改善...`)
      lines.push(`但用了${product}之后，${pick(['真的改善了好多', '肉眼可见的变化', '感觉人生都亮了'])}${pick(['✨', '🥹', '💯', '❤️'])}`)
      lines.push('')
    }
    lines.push(`📌总结一下：${product}${pick(['真的值得入手', '闭眼入不踩雷', '用过就回不去了', '性价比超高'])}！`)
    lines.push(pick(['姐妹们冲就对了！', '不买真的会后悔！', '推荐给每一个需要的人！', '我的年度爱用好物！']))
  } else if (scene === 'douyin') {
    lines.push(`${pick(config.keywords)}！${product}真的太${pick(config.keywords)}了！！`)
    lines.push(`${points[0]}这点，谁用谁知道！`)
    if (points.length > 1) {
      lines.push(`还有${points.slice(1, 3).join('、')}，每一个点都戳中我！`)
    }
    if (pains.length > 0) {
      lines.push(`以前${pains[0]}真的太痛苦了...现在终于解脱了！`)
    }
    lines.push(pick(['不接受反驳！', '不信你试试！', '用过的都懂！', '真的绝绝子！']))
  } else if (scene === 'moments') {
    lines.push(`说实话，最初朋友给我推荐${product}的时候我还挺犹豫的...`)
    lines.push(`毕竟${user}，之前也踩过不少坑。`)
    lines.push('')
    lines.push(`但用了${pick([2, 3, 4])}周之后，真心觉得：${pick(['太值了', '相见恨晚', '应该早买的'])}`)
    points.forEach(p => {
      lines.push(`✅ ${p}——这点真的${pick(['很用心', '很实在', '超出预期'])}`)
    })
    lines.push('')
    lines.push(pick([
      '好的东西值得分享给大家～感兴趣的朋友可以私我了解更多～',
      '不是广告，纯自用分享，真心觉得不错才推荐～',
      '生活已经这么累了，对自己好一点不过分吧～',
      '把这份美好分享给身边的每一个人❤️'
    ]))
  } else {
    lines.push(`🔥 ${pick(config.keywords)}！${product} 震撼上市！`)
    lines.push('')
    lines.push(`🎯 为什么选择${product}？`)
    points.forEach((p, i) => {
      const tags = ['核心优势', '独家亮点', '品质保障', '用户首选', '行业领先']
      lines.push(`【${tags[i] || '品质之选'}】${p}`)
      lines.push(generateDetailForPoint(p, user, scene))
      lines.push('')
    })
    if (pains.length > 0) {
      lines.push(`💡 直击痛点：告别${pains.join('、')}等困扰`)
      lines.push('')
    }
    lines.push(pick([
      '🏆 品质保证，售后无忧！现在下单尊享专属优惠！',
      '⚡ 限时特惠，库存有限！手慢无！',
      '🎁 今日下单赠送超值礼包，错过再等一年！',
      '💎 万千用户的共同选择，你值得拥有！'
    ]))
  }

  return lines.join('\n')
}

const generateDetailForPoint = (point: string, user: string, scene: string): string => {
  const techPatterns = [/[\d.]+(ml|g|小时|天|nm|Pa|万|次|%)/i, /自动|智能|精准|激光|纳米|高纯度|深层|360°/i]
  const isTech = techPatterns.some(p => p.test(point))

  if (scene === 'xiaohongshu') {
    if (isTech) {
      return pick([
        '这个价位能做到这个配置，真的性价比拉满！',
        '做了很多功课才发现，这个参数这个价格真的太香了！',
        '对比了好多款，这款在这方面的表现真的很突出！'
      ])
    }
    return pick([
      '用了之后就知道什么叫"一分钱一分货"，体验感完全不一样！',
      '细节见真章，这点真的能感受到用心！',
      '这才是真正为用户考虑的设计，太懂我了！'
    ])
  } else if (scene === 'ecommerce') {
    if (isTech) {
      return pick([
        '行业领先配置，性能远超同价位产品！',
        '通过多项权威认证，品质值得信赖！',
        '采用最新技术，效果显著提升！'
      ])
    }
    return pick([
      '精选优质原料，匠心打造每一个细节！',
      '经过严格品控，确保每件出品都达到最高标准！',
      '万千用户的口碑之选，好评如潮！'
    ])
  }
  return pick([
    '这点真的太戳我了！',
    '谁懂啊！这个真的超好用！',
    '体验过就知道有多香！'
  ])
}

const generateCTA = (scene: string): string => {
  const config = scenes.find(s => s.value === scene)?.config!
  const cta = pick(config.ctaTypes)

  const ctaMap: Record<string, Record<string, string[]>> = {
    xiaohongshu: {
      '评论互动': ['觉得有用的姐妹记得点赞收藏哦～有问题评论区见💬', '你们还有什么想了解的？评论区告诉我👇', '喜欢的话记得点赞收藏，下期分享更多好物～'],
      '收藏关注': ['喜欢的姐妹记得点赞+收藏+关注哦，后续分享更多好物✨', '关注我不迷路，更多宝藏好物持续更新中～', '收藏起来慢慢看，关注我get更多实用干货💗'],
      '私信咨询': ['想了解更多的姐妹可以私信我哦～看到都会回的💌', '有任何疑问都可以私信问我，一一为你解答～', '想要链接的姐妹直接私信我哈～'],
      '链接购买': ['链接放评论区啦，喜欢的姐妹可以冲！🛒', '同款在主页店铺哦，姐妹们冲！', '点击左下角链接即可购买，限时优惠中～']
    },
    douyin: {
      '点赞关注': ['点赞关注不迷路！下期更精彩！🔥', '觉得有用的话点个小红心❤️，关注我了解更多！', '双击屏幕点亮爱心，关注我每天分享好物～'],
      '评论留言': ['你们觉得怎么样？评论区告诉我👇', '有没有同款姐妹？评论区举个手🙋', '你们最想看什么？评论区告诉我！'],
      '转发分享': ['觉得有用就转发给身边的朋友吧～', '快@你那个需要的朋友来看！', '转发给你的闺蜜，一起变美/变优秀✨'],
      '点击购物车': ['喜欢的点击下方购物车直接下单！🛒', '同款就在小黄车，手慢无！', '点我头像进主页店铺，更多好物等你～']
    },
    moments: {
      '私聊咨询': ['感兴趣的朋友可以私信我聊～', '有任何问题随时找我，乐意解答😊', '想了解更多详情的话欢迎私聊～'],
      '点赞互动': ['觉得有用的话点个赞让更多人看到～', '看完记得点个赞哦👍', '朋友圈的朋友们，有没有同款爱好者🙋'],
      '转发给好友': ['觉得有用欢迎转发给身边有需要的朋友～', '好东西值得分享，转发给TA吧！', '快转给需要的朋友～不用谢😊'],
      '扫码了解': ['扫描下方二维码了解更多详情～', '识别图中二维码即可购买/咨询', '长按识别二维码，获取更多信息～']
    },
    ecommerce: {
      '立即下单': ['立即下单，享受专属优惠！🛒', '现在下单立减，错过再等一年！', '点击立即购买，开启品质生活～'],
      '加入购物车': ['喜欢的话先加入购物车吧～', '加购收藏不迷路，随时下单享优惠！', '加入购物车，凑单更划算！'],
      '领券购买': ['点击领取专属优惠券，下单更省钱！💰', '先领券再购物，省到就是赚到！', '限时优惠券领取中，立即使用！'],
      '限时抢购': ['⚡ 限时特惠，库存告急，欲购从速！', '🔥 今日特价，最后${pick([3, 5, 100])}件！', '倒计时${pick([1, 2, 24])}${pick(['小时', '天'])}，手慢无！']
    }
  }

  return pick(ctaMap[scene]?.[cta] || ctaMap.xiaohongshu['收藏关注'])
}

const generateHashtags = (scene: string, product: string, points: string[]): string => {
  const config = scenes.find(s => s.value === scene)?.config!
  const tags: string[] = []

  tags.push(`#${product.slice(0, 6)}`)

  if (scene === 'xiaohongshu') {
    tags.push('#好物分享')
    tags.push('#宝藏好物')
    tags.push(pick(['#种草日记', '#好物推荐', '#我的日常', '#生活好物', '#学生党必备', '#平价好物']))
    if (points.length > 0) {
      tags.push('#' + points[0].replace(/[。！？，、]/g, '').slice(0, 8))
    }
    tags.push(pick(['#自用分享', '#好物安利', '#亲测有效', '#闭眼入']))
  } else if (scene === 'douyin') {
    tags.push('#好物推荐')
    tags.push(pick(['#涨知识', '#生活小妙招', '#必看', '#干货分享', '#热门推荐']))
    tags.push(pick(['#护肤分享', '#穿搭分享', '#学习方法', '#居家好物', '#美食推荐']))
  } else if (scene === 'moments') {
    tags.push('#好物分享')
    tags.push(pick(['#生活日常', '#分享美好', '#真实感受', '#自用推荐']))
  } else {
    tags.push('#热销爆款')
    tags.push(pick(['#品质优选', '#限时特惠', '#正品保障', '#厂家直供', '#爆款推荐']))
    tags.push(pick(['#好物推荐', '#超值性价比', '#品质之选', '#居家必备']))
  }

  tags.push('#' + pick(config.keywords))

  return tags.join(' ')
}

const generateSingleCopy = (styleKey: string, scene: string): ViralCopyResult => {
  const styleInfo = styles.find(s => s.value === styleKey) || styles[0]
  const product = productName.value.trim()
  const points = sellingPointsList.value
  const user = targetUser.value.trim()

  return {
    title: generateTitle(styleKey, scene, product, points, user),
    hook: generateHook(styleKey, scene, product, points, user),
    body: generateBody(styleKey, scene, product, points, user),
    cta: generateCTA(scene),
    hashtags: generateHashtags(scene, product, points),
    style: styleKey,
    styleLabel: styleInfo.label
  }
}

const getApplicableStyles = (): string[] => {
  if (selectedStyles.value.length > 0) return selectedStyles.value
  return styles.map(s => s.value)
}

const generateCopy = async () => {
  if (!canGenerate.value) {
    ElMessage.warning('请填写完整信息：产品名称、核心卖点和目标用户')
    return
  }

  isGenerating.value = true
  generatedResults.value = []
  activeVersion.value = 0

  await new Promise(resolve => setTimeout(resolve, 600))

  const applicableStyles = getApplicableStyles()
  const shuffled = [...applicableStyles].sort(() => Math.random() - 0.5)
  const picked: string[] = []
  for (let i = 0; i < versionCount.value; i++) {
    picked.push(shuffled[i % shuffled.length])
  }

  for (let i = 0; i < picked.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 250 + Math.random() * 150))
    generatedResults.value.push(generateSingleCopy(picked[i], selectedScene.value))
  }

  isGenerating.value = false

  history.value.push({
    productName: productName.value.trim(),
    sellingPointsText: sellingPointsText.value,
    sellingPoints: [...sellingPointsList.value],
    targetUser: targetUser.value.trim(),
    scene: selectedScene.value,
    results: [...generatedResults.value],
    time: new Date().toISOString()
  })
  saveHistory()

  ElMessage.success({
    message: `✨ 已为「${getSceneLabel(selectedScene.value)}」场景生成 ${generatedResults.value.length} 个爆款文案方案`,
    type: 'success',
    duration: 3000,
    showClose: true
  })
}

const regenerateVersion = async () => {
  const current = generatedResults.value[activeVersion.value]
  const applicableStyles = getApplicableStyles()
  const pool = applicableStyles.filter(s => s !== current.style)
  const styleKey = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : current.style
  const newResult = generateSingleCopy(styleKey, selectedScene.value)
  generatedResults.value.splice(activeVersion.value, 1, newResult)
  ElMessage.success('已重新生成该版本')
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
    .map((r, i) => `【版本 ${i + 1} · ${r.styleLabel}】\n\n📌 标题：${r.title}\n\n⚡ Hook：${r.hook}\n\n📝 正文：\n${r.body}\n\n🎯 CTA：${r.cta}\n\n#️⃣ 标签：${r.hashtags}\n${'='.repeat(40)}`)
    .join('\n\n')
  await copyText(text)
}

const copyCurrentFull = async () => {
  const r = currentResult.value
  if (!r) return
  const text = `${r.title}\n\n${r.hook}\n\n${r.body}\n\n${r.cta}\n\n${r.hashtags}`
  await copyText(text)
}

const resetAll = () => {
  productName.value = ''
  sellingPointsText.value = ''
  targetUser.value = ''
  selectedStyles.value = []
  selectedScene.value = 'xiaohongshu'
  versionCount.value = 5
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
  productName.value = item.productName
  sellingPointsText.value = item.sellingPointsText
  targetUser.value = item.targetUser
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
.viral-copy-generator {
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
  flex-wrap: wrap;
}

.required-tag {
  color: #f56c6c;
  font-size: 14px;
  margin-left: 2px;
}

.hint-tag {
  margin-left: 12px;
  font-weight: normal;
}

.input-section {
  margin-bottom: 24px;
}

.quick-samples {
  margin-top: 10px;
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

.scene-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.scene-card {
  padding: 18px 14px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
  background: #fff;
}

.scene-card:hover:not(.disabled) {
  border-color: #c6e2ff;
  background: #f0f7ff;
  transform: translateY(-2px);
}

.scene-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #e8f0ff 0%, #f0f7ff 100%);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.scene-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.scene-emoji {
  font-size: 28px;
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
  font-size: 11px;
  color: #606266;
  padding: 3px 8px;
  background: #f5f7fa;
  border-radius: 10px;
  display: inline-block;
}

.two-col-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.flex-1 {
  flex: 1;
}

.style-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.style-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border: 1.5px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  font-size: 13px;
}

.style-chip:hover:not(.disabled) {
  border-color: #c6e2ff;
  background: #f0f7ff;
}

.style-chip.active {
  border-color: #165DFF;
  background: #e8f0ff;
  color: #165DFF;
  font-weight: 600;
}

.style-chip.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.style-emoji {
  font-size: 16px;
}

.style-tip {
  margin-top: 8px;
}

.version-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.version-card {
  padding: 14px 10px;
  border: 1.5px solid #ebeef5;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}

.version-card:hover:not(.disabled) {
  border-color: #c6e2ff;
  background: #f0f7ff;
}

.version-card.active {
  border-color: #67c23a;
  background: linear-gradient(135deg, #eafff0 0%, #f0fff4 100%);
}

.version-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.version-num {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 2px;
}

.version-card.active .version-num {
  color: #67c23a;
}

.version-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 2px;
}

.version-desc {
  font-size: 11px;
  color: #909399;
}

.action-section {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.generate-btn {
  flex: 1;
}

.btn-loading-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.generating-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  margin-top: 16px;
  background: linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%);
  border-radius: 10px;
  border: 1px dashed #e6a23c;
}

.generating-dots {
  display: flex;
  gap: 4px;
}

.generating-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e6a23c;
  animation: pulse 1.4s infinite;
}

.generating-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.generating-dots .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.generating-text {
  font-size: 14px;
  color: #b88230;
  font-weight: 500;
}

.result-card {
  margin-bottom: 24px;
}

.version-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.version-tab {
  padding: 10px 18px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.version-tab:hover {
  background: #e8ecf1;
}

.version-tab.active {
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
  font-weight: 600;
}

.section-title-sm {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.section-title-sm > :last-child {
  margin-left: auto;
}

.result-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #ebeef5;
}

.result-section:last-of-type {
  border-bottom: none;
}

.result-title-text {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  line-height: 1.6;
  padding: 14px 18px;
  background: linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%);
  border-radius: 10px;
  border-left: 4px solid #e6a23c;
}

.result-hook-text {
  font-size: 15px;
  color: #606266;
  line-height: 1.8;
  padding: 14px 18px;
  background: linear-gradient(135deg, #fef0f0 0%, #fff5f5 100%);
  border-radius: 10px;
  border-left: 4px solid #f56c6c;
}

.result-body-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.9;
  padding: 18px 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  white-space: pre-wrap;
}

.result-cta-text {
  font-size: 15px;
  color: #303133;
  line-height: 1.7;
  padding: 14px 18px;
  background: linear-gradient(135deg, #f0f9eb 0%, #f5fff0 100%);
  border-radius: 10px;
  border-left: 4px solid #67c23a;
  font-weight: 500;
}

.result-hashtags-text {
  font-size: 14px;
  color: #909399;
  line-height: 1.8;
  padding: 14px 18px;
  background: #f5f7fa;
  border-radius: 10px;
  letter-spacing: 0.3px;
}

.result-footer {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.history-card {
  margin-bottom: 24px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  border-color: #c6e2ff;
  background: #f0f7ff;
  transform: translateX(4px);
}

.history-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.history-product {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.history-text {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.history-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.history-footer {
  margin-top: 16px;
  text-align: center;
}
</style>