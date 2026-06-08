<template>
  <div class="fab-marketing-generator">
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
        <el-step title="输入产品信息" description="产品名称、核心特性、目标用户" />
        <el-step title="选择使用场景" description="电商/朋友圈/发布会/销售PPT" />
        <el-step title="生成FAB文案" description="Feature-Advantage-Benefit结构化输出" />
        <el-step title="查看与复制" description="可单条复制或整体导出" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Collection /></el-icon>
            <div class="exp-text">
              <div class="exp-num">3 层结构化</div>
              <div class="exp-label">Feature → Advantage → Benefit</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">多特性并行</div>
              <div class="exp-label">每个核心特性独立生成FAB</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Grid /></el-icon>
            <div class="exp-text">
              <div class="exp-num">4 大场景适配</div>
              <div class="exp-label">语气、措辞、格式自动匹配</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Bulb /></el-icon>
            <div class="exp-text">
              <div class="exp-num">完整话术链</div>
              <div class="exp-label">含开场白、过渡句、结语</div>
            </div>
          </div>
        </div>
        <el-divider />
        <h4 class="expectation-title">🎯 FAB 框架说明</h4>
        <div class="fab-explain-table">
          <div class="explain-row explain-header">
            <div class="explain-col">层级</div>
            <div class="explain-col">含义</div>
            <div class="explain-col">核心问题</div>
            <div class="explain-col">示例表达</div>
          </div>
          <div class="explain-row">
            <div class="explain-col fab-label-f">F · Feature</div>
            <div class="explain-col">产品本身的属性/特征</div>
            <div class="explain-col">它是什么？</div>
            <div class="explain-col">"采用航空级铝合金材质"</div>
          </div>
          <div class="explain-row">
            <div class="explain-col fab-label-a">A · Advantage</div>
            <div class="explain-col">特征带来的功能/优势</div>
            <div class="explain-col">它能做什么？</div>
            <div class="explain-col">"重量减轻40%，强度提升3倍"</div>
          </div>
          <div class="explain-row">
            <div class="explain-col fab-label-b">B · Benefit</div>
            <div class="explain-col">用户获得的实际利益</div>
            <div class="explain-col">对我有什么好处？</div>
            <div class="explain-col">"随身携带不累，用十年也不会坏"</div>
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
          <span>FAB 营销文案生成</span>
          <el-tag size="small" type="warning">Feature-Advantage-Benefit</el-tag>
        </div>
      </template>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Goods /></el-icon>
          <span>产品名称</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="productName"
          placeholder="例如：智能降噪蓝牙耳机 Pro"
          maxlength="50"
          show-word-limit
          :disabled="isGenerating"
          clearable
        />
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Star /></el-icon>
          <span>核心特性（每行一个，建议 2~5 个）</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="featuresText"
          type="textarea"
          :rows="5"
          placeholder="每行输入一个核心特性，例如：&#10;主动降噪技术&#10;40小时超长续航&#10;蓝牙5.3稳定连接"
          :disabled="isGenerating"
          resize="vertical"
        />
        <div class="quick-samples">
          <span class="sample-label">📝 快速体验：</span>
          <el-tag
            v-for="(sample, i) in productSamples"
            :key="i"
            class="sample-tag"
            effect="plain"
            @click="applyProductSample(sample)"
          >
            {{ sample.name }}
          </el-tag>
        </div>
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><User /></el-icon>
          <span>目标用户画像</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="targetUser"
          type="textarea"
          :rows="2"
          placeholder="例如：25-35岁城市白领，通勤时间长，注重音质和佩戴舒适度，预算中等"
          maxlength="200"
          show-word-limit
          :disabled="isGenerating"
          resize="none"
        />
      </div>

      <div class="scene-section">
        <div class="section-title">
          <el-icon><Grid /></el-icon>
          <span>使用场景</span>
          <el-tag size="small" type="info" class="scene-hint-tag">
            不同场景的语气、措辞、长度将自动适配
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
              AI 正在为 {{ getSceneLabel(selectedScene) }} 场景生成 FAB 文案…
            </span>
          </template>
          生成 FAB 营销文案
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
          ✨ AI 正在深度分析产品特性，构建 {{ featuresList.length }} 组 FAB 说服链条…
        </span>
      </div>
    </el-card>

    <el-card v-if="generatedResult" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>生成结果</span>
          <el-tag size="small" type="success">
            {{ getSceneLabel(selectedScene) }} · {{ featuresList.length }} 组 FAB
          </el-tag>
          <div class="header-actions">
            <el-button size="small" type="primary" link :icon="CopyDocument" @click="copyAll">
              复制全部
            </el-button>
            <el-button size="small" link :icon="Download" @click="copyFullScript">
              复制完整话术
            </el-button>
          </div>
        </div>
      </template>

      <div v-if="generatedResult.opening" class="opening-section">
        <div class="section-title-sm">
          <el-icon color="#909399"><ChatDotRound /></el-icon>
          <span>开场白</span>
          <el-button size="small" text :icon="CopyDocument" @click="copyText(generatedResult.opening)">复制</el-button>
        </div>
        <div class="opening-text">{{ generatedResult.opening }}</div>
      </div>

      <div class="fab-list">
        <div
          v-for="(fab, index) in generatedResult.fabList"
          :key="index"
          class="fab-item"
          :style="{ animationDelay: index * 0.1 + 's' }"
        >
          <div class="fab-header">
            <div class="fab-index">#{{ index + 1 }}</div>
            <div class="fab-feature-title">{{ fab.feature }}</div>
            <el-button size="small" text :icon="CopyDocument" @click="copyFab(fab)">复制本组</el-button>
          </div>

          <div class="fab-row fab-f">
            <div class="fab-tag tag-f">F</div>
            <div class="fab-content">
              <div class="fab-label">Feature · 产品特征</div>
              <div class="fab-text">{{ fab.feature }}</div>
            </div>
          </div>

          <div class="fab-arrow">
            <el-icon :size="16" color="#c0c4cc"><ArrowDown /></el-icon>
            <span class="arrow-text">这意味着…</span>
          </div>

          <div class="fab-row fab-a">
            <div class="fab-tag tag-a">A</div>
            <div class="fab-content">
              <div class="fab-label">Advantage · 功能优势</div>
              <div class="fab-text">{{ fab.advantage }}</div>
            </div>
          </div>

          <div class="fab-arrow">
            <el-icon :size="16" color="#c0c4cc"><ArrowDown /></el-icon>
            <span class="arrow-text">对你来说…</span>
          </div>

          <div class="fab-row fab-b">
            <div class="fab-tag tag-b">B</div>
            <div class="fab-content">
              <div class="fab-label">Benefit · 用户利益</div>
              <div class="fab-text">{{ fab.benefit }}</div>
            </div>
          </div>

          <div v-if="fab.transition" class="fab-transition">
            <el-icon color="#e6a23c"><Promotion /></el-icon>
            <span>{{ fab.transition }}</span>
          </div>
        </div>
      </div>

      <div v-if="generatedResult.closing" class="closing-section">
        <div class="section-title-sm">
          <el-icon color="#909399"><Flag /></el-icon>
          <span>结语 / Call to Action</span>
          <el-button size="small" text :icon="CopyDocument" @click="copyText(generatedResult.closing)">复制</el-button>
        </div>
        <div class="closing-text">{{ generatedResult.closing }}</div>
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
            <el-tag size="small" type="info">产品</el-tag>
            <span class="history-text">{{ item.productName }}</span>
          </div>
          <div class="history-meta">
            <el-tag size="small">{{ getSceneLabel(item.scene) }}</el-tag>
            <el-tag size="small" type="success">{{ item.fabCount }}组FAB</el-tag>
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
  Bulb,
  ArrowDown,
  ChatDotRound,
  Flag,
  Promotion
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface FabItem {
  feature: string
  advantage: string
  benefit: string
  transition?: string
}

interface FabResult {
  opening: string
  fabList: FabItem[]
  closing: string
}

interface HistoryItem {
  productName: string
  featuresText: string
  targetUser: string
  scene: string
  result: FabResult
  fabCount: number
  time: string
}

interface ProductSample {
  name: string
  productName: string
  features: string[]
  targetUser: string
}

const STORAGE_KEY = 'fab_marketing_history'

const productSamples: ProductSample[] = [
  {
    name: '蓝牙耳机',
    productName: '静享 Pro 主动降噪蓝牙耳机',
    features: [
      '40dB 深度主动降噪',
      '45小时超长续航',
      '蓝牙5.3芯片稳定连接',
      '人体工学半入耳设计'
    ],
    targetUser: '25-35岁城市通勤白领，每天地铁通勤1小时以上，注重音质和佩戴舒适度，预算500元左右'
  },
  {
    name: '保温杯',
    productName: '极地保温壶 316不锈钢保温杯',
    features: [
      '316医用级不锈钢内胆',
      '24小时长效保温保冷',
      '500ml轻便容量',
      '一键弹盖单手操作'
    ],
    targetUser: '办公室上班族和户外爱好者，注重饮水健康和便携性，对产品品质有较高要求'
  },
  {
    name: '空气净化器',
    productName: '森呼吸智能空气净化器 X5',
    features: [
      'H13级HEPA滤网',
      'CADR值600m³/h大空间净化',
      '实时空气质量监测显示',
      '睡眠模式低至25分贝'
    ],
    targetUser: '有老人小孩或养宠物的家庭，关注室内空气质量，尤其是雾霾天和花粉季，预算中等偏上'
  },
  {
    name: '电动牙刷',
    productName: '声波焕白电动牙刷 T200',
    features: [
      '42000次/分钟高频声波震动',
      '5种清洁模式智能切换',
      'IPX7全机身防水',
      '充一次用90天超长续航'
    ],
    targetUser: '注重口腔健康的年轻人，有牙结石/牙龈出血问题，希望通过科技产品提升清洁效果'
  }
]

const scenes = [
  {
    value: 'ecommerce',
    label: '电商详情页',
    emoji: '🛒',
    desc: '淘宝/京东/拼多多详情页',
    config: {
      tone: 'persuasive',
      detail: 'high',
      cta: 'strong'
    }
  },
  {
    value: 'social',
    label: '朋友圈广告',
    emoji: '💬',
    desc: '微信/小红书/微博种草',
    config: {
      tone: 'friendly',
      detail: 'medium',
      cta: 'soft'
    }
  },
  {
    value: 'launch',
    label: '产品发布稿',
    emoji: '📢',
    desc: '发布会/新闻稿/公众号',
    config: {
      tone: 'professional',
      detail: 'high',
      cta: 'medium'
    }
  },
  {
    value: 'sales',
    label: '销售演示PPT',
    emoji: '💼',
    desc: '销售话术/客户演示',
    config: {
      tone: 'consultative',
      detail: 'medium',
      cta: 'strong'
    }
  }
]

const productName = ref('')
const featuresText = ref('')
const targetUser = ref('')
const selectedScene = ref('ecommerce')
const isGenerating = ref(false)
const generatedResult = ref<FabResult | null>(null)
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const featuresList = computed(() => {
  return featuresText.value
    .split('\n')
    .map(f => f.trim())
    .filter(f => f.length > 0)
})

const currentStep = computed(() => {
  if (generatedResult.value && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (productName.value || featuresText.value) return 1
  return 0
})

const canGenerate = computed(() => {
  return productName.value.trim().length > 0 &&
    featuresList.value.length > 0 &&
    targetUser.value.trim().length > 0
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  if (showAllHistory.value) return reversed
  return reversed.slice(0, 10)
})

const getSceneLabel = (scene: string) => {
  const found = scenes.find(s => s.value === scene)
  return found?.label || scene
}

const applyProductSample = (sample: ProductSample) => {
  productName.value = sample.productName
  featuresText.value = sample.features.join('\n')
  targetUser.value = sample.targetUser
}

const extractFeatureKeywords = (feature: string): string[] => {
  const keywords: string[] = []
  const techPatterns = [
    /[\d.]+dB/g, /[\d.]+小时/g, /[\d.]+mAh/g, /[\d.]+ml/g, /[\d.]+L/g,
    /[\d.]+m³\/h/g, /[\d.]+万/g, /[\d.]+次/g, /[\d.]+天/g, /[\d.]+级/g,
    /[\d.]+nm/g, /[\d.]+K/g, /[\d.]+Hz/g, /[\d.]+%/g,
    /蓝牙[\d.]+/g, /IPX\d/g, /HEPA/g, /316|304/g, /[A-Z]+\d*/g
  ]
  for (const pattern of techPatterns) {
    const matches = feature.match(pattern)
    if (matches) keywords.push(...matches)
  }
  return [...new Set(keywords)]
}

const getAdvantageTemplates = (scene: string): string[] => {
  const templates: Record<string, string[]> = {
    ecommerce: [
      '相比传统产品，{feature}带来{effect}的性能提升，让你{outcome}',
      '搭载{feature}，能够{action}，有效{result}',
      '这项{feature}设计，使产品在{aspect}方面表现卓越，实现{outcome}',
      '凭借{feature}，{action}的效率大幅提升，告别{pain_point}'
    ],
    social: [
      '有了{feature}之后，真的可以{action}，再也不用{pain_point}了！',
      '这个{feature}真的绝了，能{action}，用了才知道{result}',
      '我最喜欢的就是这个{feature}，{action}的时候超方便，{outcome}',
      '亲测{feature}真的好用，{action}完全没问题，{result}'
    ],
    launch: [
      '通过{feature}技术创新，产品实现了{action}，在{aspect}树立了全新标杆',
      '创新性地采用{feature}，使得{action}成为可能，带来{result}',
      '{feature}作为核心技术突破，能够{action}，为用户提供{outcome}',
      '搭载{feature}，在{aspect}实现质的飞跃，可{action}'
    ],
    sales: [
      '{feature}可以帮助您{action}，相比竞品{result}，直接{outcome}',
      '基于{feature}，您的团队能够{action}，有效降低{pain_point}带来的影响',
      '这项{feature}功能，让您在{aspect}方面获得{result}的优势',
      '通过{feature}，您可以{action}，最终实现{outcome}'
    ]
  }
  return templates[scene] || templates.ecommerce
}

const getBenefitTemplates = (scene: string): string[] => {
  const templates: Record<string, string[]> = {
    ecommerce: [
      '意味着你每天都能{life_benefit}，享受{feeling}的体验',
      '帮你省下{time_money}，把时间花在更重要的事情上',
      '无论是{scenario1}还是{scenario2}，都能让你{outcome}',
      '一次投入，长期享受{life_improvement}，这才是真正的{value}'
    ],
    social: [
      '谁懂啊！有了它真的{feeling}，生活幸福感直接拉满！',
      '用过之后真的回不去了，{life_benefit}太香了～',
      '终于不用再{pain_point}了，{feeling}谁用谁知道！',
      '真心推荐给所有{user_type}，{life_benefit}真的太绝了！'
    ],
    launch: [
      '为用户带来{life_improvement}的品质提升，重新定义{category}体验',
      '让每个人都能{life_benefit}，这就是产品的核心价值所在',
      '显著改善{scenario1}和{scenario2}的使用体验，{result}',
      '真正实现了{promise}，为{user_type}带来{value}'
    ],
    sales: [
      '为您的业务带来{business_benefit}，投资回报率清晰可见',
      '帮助您在{aspect}建立竞争优势，实现{business_outcome}',
      '降低{cost_risk}的同时，提升{efficiency}，直接{business_result}',
      '让您的团队从{pain_point}中解放出来，专注于{core_business}'
    ]
  }
  return templates[scene] || templates.ecommerce
}

const getOpeningTemplates = (scene: string): string[] => {
  const templates: Record<string, string[]> = {
    ecommerce: [
      '你是否还在为{pain_point}而烦恼？{product}全新上市，专为{user_type}打造！',
      '还在纠结怎么选{category}？{product}——懂你的理想之选！',
      '为什么越来越多{user_type}选择{product}？答案就在这三大核心优势：',
      '今天给大家带来一款{product}，解决你{scenario}的所有痛点！'
    ],
    social: [
      '姐妹们！！我终于找到{category}天花板了😭 {product}真的绝！',
      '被闺蜜按头安利的{product}，用了一周我真香了…',
      '作为资深{user_type}，这款{product}我真的要吹爆！',
      '分享一个提升{life_aspect}幸福感的宝藏好物——{product}！'
    ],
    launch: [
      '今日，{product}正式发布，以创新科技重新定义{category}体验。',
      '我们很高兴地宣布，{product}全新上市，为{user_type}带来{value}。',
      '历时{time}精心打磨，{product}终于与大家见面了。',
      '面对{market_pain}，{product}给出了全新的解决方案。'
    ],
    sales: [
      '尊敬的客户，相信您一定关注{business_pain}这个问题…',
      '在{industry}领域，{user_type}普遍面临{pain_point}的挑战…',
      '今天我想和您分享一个能帮助您{business_goal}的解决方案…',
      '很多和您类似的企业都在问：如何才能{business_question}？'
    ]
  }
  return templates[scene] || templates.ecommerce
}

const getClosingTemplates = (scene: string): string[] => {
  const templates: Record<string, string[]> = {
    ecommerce: [
      '现在下单还享{promotion}，{product}——让{promise}从今天开始！',
      '别再犹豫了，{promotion}限时优惠中，点击立即抢购{product}！',
      '{count}万用户的共同选择，{product}，你值得拥有！',
      '七天无理由退换，正品保障包邮到家，{product}放心购！'
    ],
    social: [
      '链接放评论区啦～心动的姐妹快冲！错过等一年✨',
      '真心推荐给每一个{user_type}，用过你会感谢我的💕',
      '趁现在有活动赶紧入手！早买早享受～冲冲冲！🔥',
      '如果你们也被种草了，记得点赞收藏哦，有问题评论区见～'
    ],
    launch: [
      '{product}现已正式开售，了解更多详情请访问{channel}。',
      '我们相信，{product}将成为{user_type}的理想之选。',
      '未来，我们将持续创新，为用户带来更多{value}的产品。',
      '即刻体验{product}，开启全新的{category}之旅。'
    ],
    sales: [
      '综合来看，{product}能帮助您实现{summary_benefit}，建议您{next_step}。',
      '如果您对{product}感兴趣，我可以为您安排{demo}，让您亲自体验。',
      '现在正是{best_timing}，早一步部署就能早一步收获{business_outcome}。',
      '相信{product}会成为您{aspect}的得力助手，期待与您进一步沟通。'
    ]
  }
  return templates[scene] || templates.ecommerce
}

const getTransitionTemplates = (scene: string): string[] => {
  const templates: Record<string, string[]> = {
    ecommerce: ['不仅如此，', '除此之外，', '更重要的是，', '还有一点——'],
    social: ['而且！', '还有更绝的！', '重点来了！', '除此之外我还发现～'],
    launch: ['此外，', '值得一提的是，', '在这基础上，', '除此之外，'],
    sales: ['在此基础上，', '更为关键的是，', '除此之外，', '更进一步看，']
  }
  return templates[scene] || templates.ecommerce
}

const generateAdvantage = (feature: string, scene: string, userDesc: string): string => {
  const templates = getAdvantageTemplates(scene)
  const template = templates[Math.floor(Math.random() * templates.length)]
  const keywords = extractFeatureKeywords(feature)

  const actionsMap: Record<string, string[]> = {
    '降噪': ['隔绝外界噪音', '打造静谧空间', '让噪音无处遁形'],
    '续航': ['告别电量焦虑', '长时间使用无需充电', '一次充电满足多日需求'],
    '蓝牙': ['连接更稳定更快速', '音画同步无延迟', '告别断连卡顿'],
    '防水': ['无惧水溅潮湿', '各种场景安心使用', '清洁维护更方便'],
    '不锈钢': ['耐腐蚀更卫生', '经久耐用不变形', '安全无异味'],
    '保温': ['持久锁温', '冷热皆宜四季可用', '温度恰到好处'],
    'HEPA': ['高效过滤颗粒物', '净化更彻底', '输出洁净空气'],
    'CADR': ['快速净化全屋空气', '大空间也能轻松应对', '几分钟焕然一新'],
    '声波': ['深度清洁牙菌斑', '清洁效率翻倍', '温和不损伤牙龈'],
    '智能': ['自动适配最佳状态', '操作更省心', '使用更便捷']
  }

  let action = '显著提升使用体验'
  let result = '效果出众'
  let outcome = '获得更佳体验'
  let pain_point = '传统产品的不便'
  let aspect = '核心性能'
  let effect = '显著'

  for (const [key, vals] of Object.entries(actionsMap)) {
    if (feature.includes(key)) {
      action = vals[Math.floor(Math.random() * vals.length)]
      if (key === '降噪') { pain_point = '环境噪音干扰'; result = '降噪效果明显'; outcome = '沉浸在自己的世界' }
      if (key === '续航') { pain_point = '频繁充电的麻烦'; result = '续航持久可靠'; outcome = '出行无忧' }
      if (key === '蓝牙') { pain_point = '断连和延迟'; result = '连接稳定可靠'; outcome = '享受流畅体验' }
      if (key === '不锈钢') { pain_point = '材质安全隐患'; result = '安全耐用'; outcome = '长期放心使用' }
      if (key === '保温') { pain_point = '水温不适'; result = '温度持久恒定'; outcome = '随时喝到适宜温度' }
      if (key === 'HEPA' || key === 'CADR') { pain_point = '空气污染困扰'; result = '净化效果显著'; outcome = '呼吸更清新的空气' }
      if (key === '声波') { pain_point = '手动刷牙清洁不彻底'; result = '清洁更深入'; outcome = '口腔更健康' }
      break
    }
  }

  return template
    .replace('{feature}', keywords[0] || feature)
    .replace('{action}', action)
    .replace('{result}', result)
    .replace('{outcome}', outcome)
    .replace('{pain_point}', pain_point)
    .replace('{aspect}', aspect)
    .replace('{effect}', effect)
}

const generateBenefit = (feature: string, scene: string, userDesc: string, product: string): string => {
  const templates = getBenefitTemplates(scene)
  const template = templates[Math.floor(Math.random() * templates.length)]

  const benefitsMap: Record<string, { life: string; feeling: string; scenario1: string; scenario2: string }> = {
    '降噪': { life: '安静地享受音乐和 podcasts', feeling: '身心放松宁静', scenario1: '通勤地铁上', scenario2: '办公室工作时' },
    '续航': { life: '不用天天惦记着充电', feeling: '安心从容', scenario1: '出差旅途中', scenario2: '户外运动时' },
    '蓝牙': { life: '连接无忧地享受影音', feeling: '顺畅自如', scenario1: '追剧看电影', scenario2: '运动健身时' },
    '防水': { life: '在各种环境下放心使用', feeling: '省心安心', scenario1: '浴室洗漱时', scenario2: '户外运动后' },
    '不锈钢': { life: '喝到安全健康的每一口水', feeling: '放心踏实', scenario1: '办公室日常', scenario2: '出游旅行时' },
    '保温': { life: '随时喝到温度适宜的水', feeling: '温暖贴心', scenario1: '冬天早晨的热咖啡', scenario2: '夏天下午的冰饮' },
    'HEPA': { life: '呼吸干净清新的空气', feeling: '健康安心', scenario1: '夜间睡眠时', scenario2: '雾霾天居家' },
    'CADR': { life: '整个房间空气都清清爽爽', feeling: '清新舒畅', scenario1: '客厅会客时', scenario2: '卧室睡眠时' },
    '声波': { life: '拥有更健康洁白的牙齿', feeling: '自信微笑', scenario1: '每天清晨起床', scenario2: '重要见面前' },
    '智能': { life: '更便捷高效的生活方式', feeling: '科技感满满', scenario1: '忙碌的工作日', scenario2: '放松的周末' }
  }

  let life_benefit = '享受更美好的生活'
  let feeling = '愉悦满足'
  let scenario1 = '日常生活中'
  let scenario2 = '特殊时刻里'
  let time_money = '大量时间和金钱'
  let life_improvement = '生活品质'
  let value = '物超所值'
  let user_type = '追求品质的用户'
  let category = '产品'
  let promise = '品质生活'

  for (const [key, val] of Object.entries(benefitsMap)) {
    if (feature.includes(key)) {
      life_benefit = val.life
      feeling = val.feeling
      scenario1 = val.scenario1
      scenario2 = val.scenario2
      break
    }
  }

  return template
    .replace('{life_benefit}', life_benefit)
    .replace('{feeling}', feeling)
    .replace('{scenario1}', scenario1)
    .replace('{scenario2}', scenario2)
    .replace('{time_money}', time_money)
    .replace('{life_improvement}', life_improvement)
    .replace('{value}', value)
    .replace('{user_type}', user_type)
    .replace('{category}', category)
    .replace('{promise}', promise)
}

const generateOpening = (scene: string, product: string, userDesc: string): string => {
  const templates = getOpeningTemplates(scene)
  const template = templates[Math.floor(Math.random() * templates.length)]

  const category = product.replace(/(Pro|Max|Plus|Mini|X\d*|T\d+|\d+代|新款|旗舰|智能|无线|电动)/gi, '').trim() || '好物'
  const pain_point = '选不到满意的产品'
  const user_type = '追求品质的用户'
  const scenario = '日常使用'
  const value = '全新的体验'
  const time = '两年'
  const market_pain = '行业内长期存在的痛点'
  const business_pain = '效率提升和成本控制'
  const business_goal = '提升业务效率'
  const business_question = '在竞争中脱颖而出'
  const life_aspect = category.includes('牙') ? '口腔护理' :
    category.includes('耳机') || category.includes('音') ? '影音享受' :
      category.includes('水') || category.includes('杯') ? '饮水健康' :
        category.includes('空气') || category.includes('净化') ? '呼吸健康' : '日常'

  return template
    .replace('{product}', product)
    .replace('{category}', category)
    .replace('{user_type}', user_type)
    .replace('{pain_point}', pain_point)
    .replace('{scenario}', scenario)
    .replace('{value}', value)
    .replace('{time}', time)
    .replace('{market_pain}', market_pain)
    .replace('{business_pain}', business_pain)
    .replace('{business_goal}', business_goal)
    .replace('{business_question}', business_question)
    .replace('{life_aspect}', life_aspect)
}

const generateClosing = (scene: string, product: string, count: number): string => {
  const templates = getClosingTemplates(scene)
  const template = templates[Math.floor(Math.random() * templates.length)]

  const promotion = '限时优惠立减100元'
  const promise = '美好生活'
  const user_count = (10 + Math.floor(Math.random() * 90)).toString()
  const channel = '品牌官方商城'
  const summary_benefit = '显著的效率提升和成本节约'
  const next_step = '尽快安排一次产品演示'
  const demo = '一对一的现场演示'
  const best_timing = '最佳的引入时机'
  const business_outcome = '可量化的业务收益'
  const aspect = '业务发展'

  return template
    .replace('{product}', product)
    .replace('{promotion}', promotion)
    .replace('{promise}', promise)
    .replace('{count}', user_count)
    .replace('{channel}', channel)
    .replace('{summary_benefit}', summary_benefit)
    .replace('{next_step}', next_step)
    .replace('{demo}', demo)
    .replace('{best_timing}', best_timing)
    .replace('{business_outcome}', business_outcome)
    .replace('{aspect}', aspect)
}

const generateSingleFab = (feature: string, index: number, scene: string, userDesc: string, product: string): FabItem => {
  const transitionTemplates = getTransitionTemplates(scene)
  return {
    feature: feature,
    advantage: generateAdvantage(feature, scene, userDesc),
    benefit: generateBenefit(feature, scene, userDesc, product),
    transition: index > 0 ? transitionTemplates[Math.floor(Math.random() * transitionTemplates.length)] : undefined
  }
}

const generateCopy = async () => {
  if (!canGenerate.value) {
    ElMessage.warning('请完整填写产品名称、核心特性和目标用户')
    return
  }

  isGenerating.value = true
  generatedResult.value = null

  await new Promise(resolve => setTimeout(resolve, 800))

  const features = featuresList.value
  const fabList: FabItem[] = []

  for (let i = 0; i < features.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 300))
    fabList.push(generateSingleFab(features[i], i, selectedScene.value, targetUser.value, productName.value))
  }

  const result: FabResult = {
    opening: generateOpening(selectedScene.value, productName.value, targetUser.value),
    fabList: fabList,
    closing: generateClosing(selectedScene.value, productName.value, features.length)
  }

  generatedResult.value = result
  isGenerating.value = false

  history.value.push({
    productName: productName.value.trim(),
    featuresText: featuresText.value,
    targetUser: targetUser.value.trim(),
    scene: selectedScene.value,
    result: result,
    fabCount: features.length,
    time: new Date().toISOString()
  })
  saveHistory()

  ElMessage.success({
    message: `✨ 已为「${getSceneLabel(selectedScene.value)}」场景生成 ${features.length} 组 FAB 营销文案`,
    type: 'success',
    duration: 3000,
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

const copyFab = async (fab: FabItem) => {
  const text = `【F · Feature】${fab.feature}\n\n【A · Advantage】${fab.advantage}\n\n【B · Benefit】${fab.benefit}`
  await copyText(text)
}

const copyAll = async () => {
  if (!generatedResult.value) return
  const parts: string[] = []
  parts.push(generatedResult.value.opening)
  parts.push('')
  generatedResult.value.fabList.forEach((fab, i) => {
    if (fab.transition) parts.push(fab.transition)
    parts.push(`【${i + 1}】F: ${fab.feature}`)
    parts.push(`    A: ${fab.advantage}`)
    parts.push(`    B: ${fab.benefit}`)
    parts.push('')
  })
  parts.push(generatedResult.value.closing)
  await copyText(parts.join('\n'))
}

const copyFullScript = async () => {
  if (!generatedResult.value) return
  const parts: string[] = []
  parts.push('==============================')
  parts.push(`📦 产品：${productName.value}`)
  parts.push(`🎯 场景：${getSceneLabel(selectedScene.value)}`)
  parts.push(`👥 用户：${targetUser.value}`)
  parts.push('==============================')
  parts.push('')
  parts.push(generatedResult.value.opening)
  parts.push('')
  generatedResult.value.fabList.forEach((fab, i) => {
    if (fab.transition) {
      parts.push(fab.transition)
    }
    parts.push(`─── 第 ${i + 1} 组 FAB ───`)
    parts.push(`F · 产品特征：${fab.feature}`)
    parts.push(`A · 功能优势：${fab.advantage}`)
    parts.push(`B · 用户利益：${fab.benefit}`)
    parts.push('')
  })
  parts.push(generatedResult.value.closing)
  await copyText(parts.join('\n'))
}

const resetAll = () => {
  productName.value = ''
  featuresText.value = ''
  targetUser.value = ''
  selectedScene.value = 'ecommerce'
  generatedResult.value = null
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
  featuresText.value = item.featuresText
  targetUser.value = item.targetUser
  selectedScene.value = item.scene
  generatedResult.value = item.result
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
.fab-marketing-generator {
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

.fab-explain-table {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
}

.explain-row {
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1.3fr 2fr;
}

.explain-header {
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
}

.explain-header .explain-col {
  font-weight: 600;
  font-size: 13px;
  color: #fff;
}

.explain-col {
  padding: 12px 14px;
  font-size: 13px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  line-height: 1.6;
}

.explain-row:last-child .explain-col {
  border-bottom: none;
}

.explain-col:last-child {
  border-right: none;
}

.fab-label-f {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  color: #409eff;
  font-weight: 700;
}

.fab-label-a {
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  color: #e6a23c;
  font-weight: 700;
}

.fab-label-b {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  color: #67c23a;
  font-weight: 700;
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

.card-header > .header-actions {
  margin-left: auto;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.section-title-sm {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  margin: 0 0 10px 0;
}

.section-title-sm .el-button {
  margin-left: auto;
}

.required-tag {
  color: #f56c6c;
  font-size: 14px;
}

.input-section {
  margin-bottom: 20px;
}

.quick-samples {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.sample-label {
  font-size: 13px;
  color: #909399;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.sample-tag:hover {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.scene-section {
  margin-bottom: 20px;
}

.scene-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.scene-card {
  border: 2px solid #ebeef5;
  border-radius: 10px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
  background: #fff;
}

.scene-card:hover:not(.disabled) {
  border-color: #c6e2ff;
  background: #f5f9ff;
}

.scene-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
}

.scene-card.disabled {
  opacity: 0.6;
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
  line-height: 1.4;
}

.action-section {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.generate-btn {
  flex: 1;
}

.btn-loading-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.generating-status {
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f9ff 0%, #ecf5ff 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.generating-dots {
  display: flex;
  gap: 4px;
}

.generating-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #409eff;
  animation: pulse 1.4s infinite ease-in-out both;
}

.generating-dots .dot:nth-child(1) { animation-delay: -0.32s; }
.generating-dots .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes pulse {
  0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.generating-text {
  color: #409eff;
  font-size: 14px;
  font-weight: 500;
}

.result-card {
  margin-bottom: 24px;
}

.opening-section {
  padding: 16px 20px;
  background: linear-gradient(135deg, #fff7e6 0%, #fff1e0 100%);
  border-radius: 10px;
  margin-bottom: 20px;
}

.opening-text {
  font-size: 15px;
  line-height: 1.8;
  color: #303133;
}

.closing-section {
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-radius: 10px;
  margin-top: 20px;
}

.closing-text {
  font-size: 15px;
  line-height: 1.8;
  color: #303133;
}

.fab-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fab-item {
  border: 1px solid #ebeef5;
  border-radius: 12px;
  overflow: hidden;
  animation: fabFadeIn 0.4s ease-out both;
}

@keyframes fabFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fab-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #fafbfc;
  border-bottom: 1px solid #ebeef5;
}

.fab-index {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fab-feature-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.fab-header .el-button {
  margin-left: auto;
}

.fab-row {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
}

.fab-f {
  background: linear-gradient(90deg, #f5f9ff 0%, #ffffff 100%);
}

.fab-a {
  background: linear-gradient(90deg, #fffaf0 0%, #ffffff 100%);
}

.fab-b {
  background: linear-gradient(90deg, #f5fbf0 0%, #ffffff 100%);
}

.fab-tag {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  flex-shrink: 0;
}

.tag-f {
  background: linear-gradient(135deg, #409eff 0%, #165DFF 100%);
  color: #fff;
}

.tag-a {
  background: linear-gradient(135deg, #e6a23c 0%, #cf8a1b 100%);
  color: #fff;
}

.tag-b {
  background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
  color: #fff;
}

.fab-content {
  flex: 1;
}

.fab-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
  font-weight: 500;
}

.fab-text {
  font-size: 15px;
  line-height: 1.7;
  color: #303133;
}

.fab-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 20px;
  background: #fafbfc;
}

.arrow-text {
  font-size: 12px;
  color: #909399;
  font-style: italic;
}

.fab-transition {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #fff8e1;
  border-top: 1px dashed #e8e5d5;
  font-size: 13px;
  color: #b8860b;
  font-weight: 500;
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
  padding: 12px 16px;
  background: #fafbfc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.history-item:hover {
  background: #f5f9ff;
  border-color: #d9ecff;
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
}

.history-text {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.history-meta {
  display: flex;
  gap: 8px;
}

.history-footer {
  text-align: center;
  margin-top: 12px;
}

.scene-hint-tag {
  margin-left: 12px;
  font-weight: normal;
}
</style>
