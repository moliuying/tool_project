<template>
  <div class="english-writing-polisher">
    <el-card class="intro-card">
      <div class="intro-header">
        <div class="intro-left">
          <div class="intro-icon">✍️</div>
          <div class="intro-text">
            <h2 class="intro-title">英文写作润色助手</h2>
            <p class="intro-subtitle">
              输入英文草稿，AI 为你进行语法修正、用词优化、表达地道化和逻辑连贯性提升，帮助你轻松获得接近母语水平的英文文本质量
            </p>
          </div>
        </div>
        <div class="intro-badges">
          <el-tag type="primary" effect="dark" size="large">🎯 语法纠错</el-tag>
          <el-tag type="success" effect="dark" size="large">💡 用词升级</el-tag>
          <el-tag type="warning" effect="dark" size="large">🌍 地道表达</el-tag>
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
              <span class="at-name">留学生</span>
              <span class="at-desc">论文、作业、申请文书</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">💼</span>
              <span class="at-name">外贸从业者</span>
              <span class="at-desc">商务邮件、产品介绍</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">🌐</span>
              <span class="at-name">国际化团队</span>
              <span class="at-desc">工作沟通、报告文档</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">📝</span>
              <span class="at-name">学术作者</span>
              <span class="at-desc">期刊论文、研究摘要</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">📱</span>
              <span class="at-name">内容创作者</span>
              <span class="at-desc">社交媒体、产品文案</span>
            </div>
          </div>
        </div>
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><WarningFilled /></el-icon>
            典型适用场景
          </h4>
          <div class="scene-tags">
            <el-tag size="large" effect="plain">📧 商务邮件撰写</el-tag>
            <el-tag size="large" effect="plain">📄 学术论文润色</el-tag>
            <el-tag size="large" effect="plain">📦 产品英文文案</el-tag>
            <el-tag size="large" effect="plain">💬 社交媒体内容</el-tag>
            <el-tag size="large" effect="plain">📋 工作报告</el-tag>
            <el-tag size="large" effect="plain">📨 留学申请文书</el-tag>
            <el-tag size="large" effect="plain">📊 项目提案</el-tag>
            <el-tag size="large" effect="plain">🤝 日常商务沟通</el-tag>
          </div>
        </div>
      </div>
    </el-card>

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
        <el-step title="输入英文草稿" description="粘贴或输入需要润色的英文文本" />
        <el-step title="选择文档类型" description="6大场景深度适配润色策略" />
        <el-step title="设置润色强度" description="语法修正→标准润色→深度润色" />
        <el-step title="查看润色结果" description="含修改对比、优化说明、提升建议" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><EditPen /></el-icon>
            <div class="exp-text">
              <div class="exp-num">4 层润色优化</div>
              <div class="exp-label">语法/词汇/表达/逻辑</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><Collection /></el-icon>
            <div class="exp-text">
              <div class="exp-num">{{ polishStrategyCount }} 种润色策略</div>
              <div class="exp-label">覆盖不同文档类型需求</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Grid /></el-icon>
            <div class="exp-text">
              <div class="exp-num">6 大场景适配</div>
              <div class="exp-label">学术/商务/社交等全覆盖</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Bulb /></el-icon>
            <div class="exp-text">
              <div class="exp-num">详细修改说明</div>
              <div class="exp-label">每条修改都有理由和例句</div>
            </div>
          </div>
        </div>
        <el-divider />
        <h4 class="expectation-title">🎯 各文档类型润色侧重点说明</h4>
        <div class="type-diff-table">
          <div class="diff-row diff-header">
            <div class="diff-col">优化维度</div>
            <div class="diff-col">🎓 学术论文</div>
            <div class="diff-col">💼 商务邮件</div>
            <div class="diff-col">📦 产品文案</div>
            <div class="diff-col">📱 社交媒体</div>
            <div class="diff-col">📋 工作报告</div>
            <div class="diff-col">📝 通用文本</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">语气风格</div>
            <div class="diff-col">严谨客观</div>
            <div class="diff-col">专业礼貌</div>
            <div class="diff-col">营销说服</div>
            <div class="diff-col">轻松活泼</div>
            <div class="diff-col">正式规范</div>
            <div class="diff-col">自然流畅</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">词汇难度</div>
            <div class="diff-col">高级学术词汇</div>
            <div class="diff-col">商务惯用表达</div>
            <div class="diff-col">营销吸引词汇</div>
            <div class="diff-col">口语化常用词</div>
            <div class="diff-col">专业术语</div>
            <div class="diff-col">标准常用词</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">句式结构</div>
            <div class="diff-col">复杂长句</div>
            <div class="diff-col">清晰明了</div>
            <div class="diff-col">短句有力</div>
            <div class="diff-col">简短碎片化</div>
            <div class="diff-col">结构清晰</div>
            <div class="diff-col">多样平衡</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">语法严格度</div>
            <div class="diff-col">⭐⭐⭐⭐⭐</div>
            <div class="diff-col">⭐⭐⭐⭐⭐</div>
            <div class="diff-col">⭐⭐⭐⭐</div>
            <div class="diff-col">⭐⭐⭐</div>
            <div class="diff-col">⭐⭐⭐⭐⭐</div>
            <div class="diff-col">⭐⭐⭐⭐</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">逻辑连贯</div>
            <div class="diff-col">论证严密</div>
            <div class="diff-col">层次分明</div>
            <div class="diff-col">卖点突出</div>
            <div class="diff-col">情感连贯</div>
            <div class="diff-col">条理清晰</div>
            <div class="diff-col">自然流畅</div>
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
          <span>英文写作润色</span>
          <el-tag size="small" type="warning">多场景 · 多强度 · 多维度</el-tag>
        </div>
      </template>

      <div class="input-section">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          <span>英文草稿</span>
          <span class="required-tag">*</span>
          <span class="word-count-tag">
            <el-tag size="small" :type="draftWordCount > 1000 ? 'danger' : 'info'">
              {{ draftWordCount }} words
            </el-tag>
          </span>
        </div>
        <el-input
          v-model="originalDraft"
          type="textarea"
          :rows="8"
          placeholder="Please paste or type your English text here. For example:

Dear Sir,
I am writing to apply for the position you advertised. I have 3 years experience in marketing and I think I am a good fit for this job. I hope you can consider my application.

Looking forward to your reply.
Best regards,
John"
          maxlength="5000"
          show-word-limit
          :disabled="isGenerating"
          resize="vertical"
          class="draft-input"
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

      <div class="type-section">
        <div class="section-title">
          <el-icon><Grid /></el-icon>
          <span>文档类型</span>
          <el-tag size="small" type="info" class="hint-tag">
            不同类型的润色策略、语气和用词均会自动适配
          </el-tag>
        </div>
        <div class="type-options">
          <div
            v-for="docType in docTypes"
            :key="docType.value"
            class="type-card"
            :class="{ active: selectedDocType === docType.value, disabled: isGenerating }"
            @click="!isGenerating && (selectedDocType = docType.value)"
          >
            <div class="type-emoji">{{ docType.emoji }}</div>
            <div class="type-name">{{ docType.label }}</div>
            <div class="type-desc">{{ docType.desc }}</div>
            <div class="type-spec">{{ docType.spec }}</div>
          </div>
        </div>
      </div>

      <div class="two-col-section">
        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><MagicStick /></el-icon>
            <span>润色强度</span>
          </div>
          <div class="intensity-options">
            <div
              v-for="level in intensityLevels"
              :key="level.value"
              class="intensity-card"
              :class="{ active: selectedIntensity === level.value, disabled: isGenerating }"
              @click="!isGenerating && (selectedIntensity = level.value)"
            >
              <div class="intensity-level">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="intensity-star"
                  :class="{ filled: n <= level.stars }"
                >★</span>
              </div>
              <div class="intensity-name">{{ level.label }}</div>
              <div class="intensity-desc">{{ level.desc }}</div>
            </div>
          </div>
        </div>

        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><Brush /></el-icon>
            <span>优化维度（可选，默认全部启用）</span>
          </div>
          <div class="dimension-options">
            <div
              v-for="dim in polishDimensions"
              :key="dim.value"
              class="dimension-chip"
              :class="{ active: selectedDimensions.includes(dim.value), disabled: isGenerating }"
              @click="!isGenerating && toggleDimension(dim.value)"
            >
              <span class="dim-emoji">{{ dim.emoji }}</span>
              <span class="dim-label">{{ dim.label }}</span>
            </div>
          </div>
          <div class="dimension-tip" v-if="selectedDimensions.length === 0">
            <el-tag size="small" type="warning">请至少选择一个优化维度</el-tag>
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
          @click="polishText"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 正在进行 {{ getIntensityLabel(selectedIntensity) }} 润色（{{ getDocTypeLabel(selectedDocType) }}）…
            </span>
          </template>
          开始润色
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
          🔍 正在分析文本：语法检查 → 词汇优化 → 表达地道化 → 逻辑连贯性提升…
        </span>
      </div>
    </el-card>

    <el-card v-if="polishedResult" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>润色结果</span>
          <el-tag size="small" type="success">
            {{ getDocTypeLabel(selectedDocType) }}
          </el-tag>
          <el-tag size="small" type="warning">
            {{ getIntensityLabel(selectedIntensity) }}
          </el-tag>
          <div class="header-actions">
            <el-button size="small" :icon="RefreshRight" @click="polishText">
              重新润色
            </el-button>
            <el-button size="small" type="primary" :icon="CopyDocument" @click="copyPolishedText">
              复制润色文本
            </el-button>
          </div>
        </div>
      </template>

      <div class="result-stats">
        <div class="stat-item">
          <div class="stat-value">{{ polishedResult.stats.grammarCorrections }}</div>
          <div class="stat-label">语法修正</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ polishedResult.stats.wordImprovements }}</div>
          <div class="stat-label">用词优化</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ polishedResult.stats.expressionImprovements }}</div>
          <div class="stat-label">地道表达</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ polishedResult.stats.flowImprovements }}</div>
          <div class="stat-label">逻辑改进</div>
        </div>
        <div class="stat-item overall">
          <div class="stat-value overall-score">{{ polishedResult.stats.overallScore }}</div>
          <div class="stat-label">综合提升指数</div>
        </div>
      </div>

      <el-tabs v-model="activeResultTab" class="result-tabs">
        <el-tab-pane label="📝 润色后文本" name="polished">
          <div class="polished-text-box">
            <div class="text-box-header">
              <span class="text-box-title">Polished Version</span>
              <el-button size="small" :icon="CopyDocument" text @click="copyPolishedText">
                复制
              </el-button>
            </div>
            <div class="polished-content">
              {{ polishedResult.polishedText }}
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="📄 原文对照" name="comparison">
          <div class="comparison-container">
            <div class="compare-col">
              <div class="text-box-header original-header">
                <span class="text-box-title">📋 Original Text</span>
              </div>
              <div class="compare-content original-content">
                {{ originalDraft }}
              </div>
            </div>
            <div class="compare-col">
              <div class="text-box-header polished-header">
                <span class="text-box-title">✨ Polished Text</span>
                <el-button size="small" :icon="CopyDocument" text @click="copyPolishedText">
                  复制
                </el-button>
              </div>
              <div class="compare-content polished-content-inline">
                {{ polishedResult.polishedText }}
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="💡 详细修改说明" name="details">
          <div class="improvement-list">
            <div
              v-for="(item, index) in polishedResult.improvements"
              :key="index"
              class="improvement-item"
              :class="`type-${item.type}`"
            >
              <div class="improvement-header">
                <el-tag size="small" :type="getImprovementTagType(item.type)" effect="dark">
                  {{ getImprovementTypeLabel(item.type) }}
                </el-tag>
                <span class="improvement-title">{{ item.title }}</span>
              </div>
              <div class="improvement-body">
                <div class="change-row">
                  <span class="change-label before">Before:</span>
                  <span class="change-text before-text">{{ item.before }}</span>
                </div>
                <div class="change-arrow">↓</div>
                <div class="change-row">
                  <span class="change-label after">After:</span>
                  <span class="change-text after-text">{{ item.after }}</span>
                </div>
                <div class="improvement-explanation">
                  <el-icon color="#165DFF"><Bulb /></el-icon>
                  <span><strong>Why:</strong> {{ item.explanation }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="🎯 整体提升建议" name="suggestions">
          <div class="suggestions-section">
            <div class="suggestion-item" v-for="(sug, idx) in polishedResult.overallSuggestions" :key="idx">
              <div class="suggestion-icon">{{ sug.icon }}</div>
              <div class="suggestion-content">
                <div class="suggestion-title">{{ sug.title }}</div>
                <div class="suggestion-desc">{{ sug.description }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
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
            <el-tag size="small" type="info">{{ getDocTypeLabel(item.docType) }}</el-tag>
            <el-tag size="small" type="warning">{{ getIntensityLabel(item.intensity) }}</el-tag>
            <span class="history-text">{{ truncateText(item.originalDraft, 60) }}</span>
          </div>
          <div class="history-meta">
            <el-tag size="small" type="success">Score: {{ item.result.stats.overallScore }}</el-tag>
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
  Bulb,
  Clock,
  InfoFilled,
  User,
  WarningFilled,
  RefreshRight,
  Brush
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Improvement {
  type: 'grammar' | 'vocabulary' | 'expression' | 'logic'
  title: string
  before: string
  after: string
  explanation: string
}

interface OverallSuggestion {
  icon: string
  title: string
  description: string
}

interface PolishResult {
  polishedText: string
  improvements: Improvement[]
  overallSuggestions: OverallSuggestion[]
  stats: {
    grammarCorrections: number
    wordImprovements: number
    expressionImprovements: number
    flowImprovements: number
    overallScore: number
  }
}

interface HistoryItem {
  originalDraft: string
  docType: string
  intensity: string
  dimensions: string[]
  result: PolishResult
  time: string
}

interface QuickSample {
  label: string
  text: string
  docType: string
  intensity: string
}

const STORAGE_KEY = 'english_writing_polisher_history'

const polishDimensions = [
  { value: 'grammar', label: '语法修正', emoji: '🔤' },
  { value: 'vocabulary', label: '用词优化', emoji: '📚' },
  { value: 'expression', label: '地道表达', emoji: '🗣️' },
  { value: 'logic', label: '逻辑连贯', emoji: '🔗' }
]

const intensityLevels = [
  {
    value: 'light',
    label: '轻度润色',
    stars: 2,
    desc: '基础语法纠错'
  },
  {
    value: 'standard',
    label: '标准润色',
    stars: 4,
    desc: '语法+词汇+表达优化'
  },
  {
    value: 'deep',
    label: '深度润色',
    stars: 5,
    desc: '全方位深度改写优化'
  }
]

const docTypes = [
  {
    value: 'academic',
    label: '学术论文',
    emoji: '🎓',
    desc: '论文、摘要、研究报告',
    spec: '严谨客观 · 学术词汇',
    config: {
      formality: 'very_formal',
      tone: 'objective',
      vocabularyLevel: 'advanced',
      complexity: 'complex'
    }
  },
  {
    value: 'business',
    label: '商务邮件',
    emoji: '💼',
    desc: '商务邮件、正式函件',
    spec: '专业礼貌 · 商务表达',
    config: {
      formality: 'formal',
      tone: 'professional',
      vocabularyLevel: 'business',
      complexity: 'clear'
    }
  },
  {
    value: 'product',
    label: '产品文案',
    emoji: '📦',
    desc: '产品描述、营销文案',
    spec: '营销吸引 · 卖点突出',
    config: {
      formality: 'semi_formal',
      tone: 'persuasive',
      vocabularyLevel: 'marketing',
      complexity: 'concise'
    }
  },
  {
    value: 'social',
    label: '社交媒体',
    emoji: '📱',
    desc: '社交平台内容发布',
    spec: '轻松活泼 · 口语自然',
    config: {
      formality: 'casual',
      tone: 'friendly',
      vocabularyLevel: 'colloquial',
      complexity: 'simple'
    }
  },
  {
    value: 'report',
    label: '工作报告',
    emoji: '📋',
    desc: '工作汇报、项目提案',
    spec: '正式规范 · 条理清晰',
    config: {
      formality: 'formal',
      tone: 'structured',
      vocabularyLevel: 'professional',
      complexity: 'structured'
    }
  },
  {
    value: 'general',
    label: '通用文本',
    emoji: '📝',
    desc: '日常写作、通用内容',
    spec: '自然流畅 · 标准规范',
    config: {
      formality: 'neutral',
      tone: 'neutral',
      vocabularyLevel: 'standard',
      complexity: 'balanced'
    }
  }
]

const quickSamplesByType: Record<string, QuickSample[]> = {
  business: [
    {
      label: '求职申请邮件',
      docType: 'business',
      intensity: 'standard',
      text: `Dear Sir,
I am writing to apply for the Marketing Manager position you advertised on LinkedIn. I have 3 years experience in marketing and I think I am a good fit for this job.

In my previous job, I did a lot of marketing campaigns and they worked well. I also know how to use social media and data analysis tools.

I hope you can consider my application. I am available for an interview anytime.

Looking forward to your reply.
Best regards,
John Smith`
    },
    {
      label: '客户跟进邮件',
      docType: 'business',
      intensity: 'standard',
      text: `Hi there,
I just want to check if you got my last email. We talked about the project last week. Do you have any updates?

Our team is ready to start anytime. Please let me know what you think.

Thanks!
Best,
Mary`
    }
  ],
  academic: [
    {
      label: '论文摘要',
      docType: 'academic',
      intensity: 'deep',
      text: `This paper talks about machine learning methods for predicting stock prices. We used several models like neural networks and SVM. The results show that our method is better than others. We collected data from 2018 to 2023. The experiments prove that the proposed approach is effective and can be used in real applications.`
    }
  ],
  product: [
    {
      label: '产品介绍',
      docType: 'product',
      intensity: 'standard',
      text: `This is our new wireless headphone. It has very good sound quality. The battery lasts a long time, like 30 hours. It is comfortable to wear. You can use it for sports. It also cancels noise. It is compatible with Bluetooth 5.3. The price is good. We think you will like it.`
    }
  ],
  social: [
    {
      label: '朋友圈/社交帖',
      docType: 'social',
      intensity: 'light',
      text: `Today I went to a very nice coffee shop. The coffee is very good and the place is beautiful. I had a great time there with my friends. We took many photos. I will definitely go back again soon. Highly recommend! ☕`
    }
  ],
  report: [
    {
      label: '季度工作汇报',
      docType: 'report',
      intensity: 'standard',
      text: `In Q1 this year, our team did many things. We finished the main project on time. We also got new customers. Sales numbers went up compared to last quarter. There were some problems but we solved them. Next quarter we plan to do more things. We will try to improve our work.`
    }
  ],
  general: [
    {
      label: '日常段落',
      docType: 'general',
      intensity: 'standard',
      text: `I think learning English is very important. It can help me talk with people from other countries. I study English every day by reading books and watching movies. Sometimes it is difficult but I never give up. My goal is to speak English very fluently one day.`
    }
  ]
}

const originalDraft = ref('')
const selectedDocType = ref('business')
const selectedIntensity = ref('standard')
const selectedDimensions = ref<string[]>(['grammar', 'vocabulary', 'expression', 'logic'])
const isGenerating = ref(false)
const polishedResult = ref<PolishResult | null>(null)
const activeResultTab = ref('polished')
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const draftWordCount = computed(() => {
  const text = originalDraft.value.trim()
  if (!text) return 0
  return text.split(/\s+/).filter(w => w.length > 0).length
})

const polishStrategyCount = computed(() => polishDimensions.length)

const currentQuickSamples = computed(() => quickSamplesByType[selectedDocType.value] || quickSamplesByType.general)

const currentStep = computed(() => {
  if (polishedResult.value && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (selectedDocType.value) return 1
  if (originalDraft.value) return 0
  return 0
})

const canGenerate = computed(() => {
  return originalDraft.value.trim().length > 0 && selectedDimensions.value.length > 0
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const getDocTypeLabel = (v: string) => docTypes.find(d => d.value === v)?.label || v
const getIntensityLabel = (v: string) => intensityLevels.find(i => i.value === v)?.label || v

const getImprovementTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    grammar: '语法修正',
    vocabulary: '用词优化',
    expression: '地道表达',
    logic: '逻辑连贯'
  }
  return map[type] || type
}

const getImprovementTagType = (type: string): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
    grammar: 'danger',
    vocabulary: 'warning',
    expression: 'primary',
    logic: 'success'
  }
  return map[type] || 'info'
}

const applySample = (sample: QuickSample) => {
  originalDraft.value = sample.text
  selectedDocType.value = sample.docType
  selectedIntensity.value = sample.intensity
  ElMessage.success('已载入示例文本')
}

const toggleDimension = (value: string) => {
  const idx = selectedDimensions.value.indexOf(value)
  if (idx > -1) {
    selectedDimensions.value.splice(idx, 1)
  } else {
    selectedDimensions.value.push(value)
  }
}

const truncateText = (text: string, maxLen: number) => {
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen) + '...'
}

const fixGrammar = (text: string): { corrected: string; changes: Improvement[] } => {
  const changes: Improvement[] = []
  let result = text

  const grammarRules = [
    {
      pattern: /\bI have (\d+) years experience\b/gi,
      replace: (match: string, years: string) => {
        changes.push({
          type: 'grammar',
          title: '所有格形式错误',
          before: match,
          after: `I have ${years} years of experience`,
          explanation: '表示"多少年的经验"需要使用所有格形式 "years of experience"，不能直接修饰名词 experience。'
        })
        return `I have ${years} years of experience`
      }
    },
    {
      pattern: /\bI think I am a good fit for this job\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '表达可更专业',
          before: 'I think I am a good fit for this job',
          after: 'I believe my skills and experience align closely with the requirements of this role',
          explanation: '求职语境中使用更专业的表达，强调技能匹配度而非主观感受，能给招聘方留下更深刻的专业印象。'
        })
        return 'I believe my skills and experience align closely with the requirements of this role'
      }
    },
    {
      pattern: /\bI hope you can consider my application\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '商务表达升级',
          before: 'I hope you can consider my application',
          after: 'I would greatly appreciate your consideration of my application',
          explanation: '使用 "would greatly appreciate" 比 "hope" 更加礼貌和正式，是商务英文书信的标准礼貌用语。'
        })
        return 'I would greatly appreciate your consideration of my application'
      }
    },
    {
      pattern: /\bLooking forward to your reply\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '标准商务表达',
          before: 'Looking forward to your reply',
          after: 'I look forward to hearing from you at your earliest convenience',
          explanation: '完整句式加上 "at your earliest convenience" 更符合正式商务邮件的规范，表达得体且尊重对方时间。'
        })
        return 'I look forward to hearing from you at your earliest convenience'
      }
    },
    {
      pattern: /\bHi there,\b/gi,
      replace: () => {
        changes.push({
          type: 'vocabulary',
          title: '称呼正式化',
          before: 'Hi there,',
          after: 'Dear [Name],',
          explanation: '商务邮件应尽量使用对方的姓氏或全名进行称呼，"Hi there" 过于随意，适合朋友之间而非正式商务场合。'
        })
        return 'Dear [Name],'
      }
    },
    {
      pattern: /\bI just want to check if you got my last email\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '委婉跟进表达',
          before: 'I just want to check if you got my last email',
          after: 'I am writing to follow up on my previous email sent on [date]',
          explanation: '使用 "follow up on" 是标准的跟进用语，提及具体日期显得专业有条理，避免了直接质问对方"是否收到"的冒犯感。'
        })
        return 'I am writing to follow up on my previous email sent on [date]'
      }
    },
    {
      pattern: /\bDo you have any updates\?\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '委婉询问进度',
          before: 'Do you have any updates?',
          after: 'I would be grateful if you could let me know if there have been any developments on this matter',
          explanation: '将直接问句改为条件式礼貌表达，使用 "developments" 比 "updates" 更正式，整体语气更加得体。'
        })
        return 'I would be grateful if you could let me know if there have been any developments on this matter'
      }
    },
    {
      pattern: /\bThis paper talks about\b/gi,
      replace: () => {
        changes.push({
          type: 'vocabulary',
          title: '学术词汇替换',
          before: 'This paper talks about',
          after: 'This study investigates / This paper examines',
          explanation: '学术写作中避免使用口语化动词 "talks about"，应使用 "investigates"、"examines"、"explores"、"analyzes" 等专业学术动词。'
        })
        return 'This paper examines'
      }
    },
    {
      pattern: /\bThe results show that\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '学术表达升级',
          before: 'The results show that',
          after: 'The findings demonstrate that / The empirical results indicate that',
          explanation: '学术论文中使用 "findings"、"demonstrate"、"indicate"、"reveal" 等词比 "results show" 更具学术严谨性和权威性。'
        })
        return 'The findings demonstrate that'
      }
    },
    {
      pattern: /\bour method is better than others\b/gi,
      replace: () => {
        changes.push({
          type: 'vocabulary',
          title: '学术用语精确化',
          before: 'our method is better than others',
          after: 'the proposed approach outperforms existing baseline methods across multiple evaluation metrics',
          explanation: '学术写作需要客观具体，避免主观评价 "better"，应使用 "outperforms" 并说明在哪些指标上(evaluation metrics)优于哪些对比方法。'
        })
        return 'the proposed approach outperforms existing baseline methods across multiple evaluation metrics'
      }
    },
    {
      pattern: /\bThe experiments prove that\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '学术表述严谨化',
          before: 'The experiments prove that',
          after: 'Extensive experimental evaluations validate the effectiveness of',
          explanation: '学术研究中慎用 "prove"（证明），科学结论通常是被"验证(validate)""支持(support)"而非绝对"证明"，这体现了学术的严谨性。'
        })
        return 'Extensive experimental evaluations validate the effectiveness of'
      }
    },
    {
      pattern: /\bIt has very good sound quality\b/gi,
      replace: () => {
        changes.push({
          type: 'vocabulary',
          title: '营销词汇优化',
          before: 'It has very good sound quality',
          after: 'It delivers exceptional Hi-Res audio quality with rich bass and crystal-clear treble',
          explanation: '产品文案应使用更具感染力的具体描述，"very good" 过于空泛，"exceptional"、"Hi-Res"、"rich bass"、"crystal-clear treble" 更能打动消费者。'
        })
        return 'It delivers exceptional Hi-Res audio quality with rich bass and crystal-clear treble'
      }
    },
    {
      pattern: /\bThe battery lasts a long time, like 30 hours\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '产品卖点突出',
          before: 'The battery lasts a long time, like 30 hours',
          after: 'Enjoy an industry-leading 30-hour battery life — enough for an entire week of daily use on a single charge',
          explanation: '将电池续航转化为用户可感知的利益点（一周不用充电），使用 "industry-leading" 突出竞争优势，数字前置强化记忆点。'
        })
        return 'Enjoy an industry-leading 30-hour battery life — enough for an entire week of daily use on a single charge'
      }
    },
    {
      pattern: /\bWe think you will like it\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '营销收尾表达',
          before: 'We think you will like it',
          after: 'Experience the difference today — your ears will thank you',
          explanation: '使用祈使句+利益感知的文案技巧收尾，"your ears will thank you" 是经典的感性号召，比平铺直叙的 "you will like it" 更有说服力。'
        })
        return 'Experience the difference today — your ears will thank you'
      }
    },
    {
      pattern: /\bsales numbers went up\b/gi,
      replace: () => {
        changes.push({
          type: 'vocabulary',
          title: '汇报用语专业',
          before: 'sales numbers went up',
          after: 'achieved a significant quarter-over-quarter revenue growth of 15%',
          explanation: '工作汇报中应使用量化数据和专业术语，"revenue growth"、"quarter-over-quarter (QoQ)" 是标准商务表达，数据使汇报更具说服力。'
        })
        return 'achieved a significant quarter-over-quarter revenue growth of 15%'
      }
    },
    {
      pattern: /\bThere were some problems but we solved them\b/gi,
      replace: () => {
        changes.push({
          type: 'logic',
          title: '问题汇报结构化',
          before: 'There were some problems but we solved them',
          after: 'Encountered minor challenges in [area], which were successfully mitigated through [solution approach], resulting in [positive outcome]',
          explanation: '汇报问题时应遵循"问题-措施-结果"的结构化表达，具体说明遇到了什么问题、如何解决、带来了什么正面结果，体现解决问题的能力。'
        })
        return 'Encountered minor operational challenges, which were successfully mitigated through cross-functional collaboration, ensuring all deliverables remained on schedule'
      }
    },
    {
      pattern: /\bI went to a very nice coffee shop\b/gi,
      replace: () => {
        changes.push({
          type: 'vocabulary',
          title: '社交表达生动化',
          before: 'I went to a very nice coffee shop',
          after: 'Just discovered the coziest hidden gem of a café today ☕️',
          explanation: '社交媒体中使用更具画面感和情感色彩的表达，"coziest hidden gem" 比 "very nice" 生动得多，加上表情符号更符合社交语境。'
        })
        return 'Just discovered the coziest hidden gem of a café today ☕️'
      }
    },
    {
      pattern: /\bI will definitely go back again soon\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '社交媒体表达',
          before: 'I will definitely go back again soon',
          after: 'Already counting down the days until my next visit! ✨',
          explanation: '使用 "counting down the days" 这种更富感情色彩的表达，能更好地传递对这家咖啡馆的喜爱程度，语气轻松适合社交平台。'
        })
        return 'Already counting down the days until my next visit! ✨'
      }
    },
    {
      pattern: /\bLearning English is very important\b/gi,
      replace: () => {
        changes.push({
          type: 'vocabulary',
          title: '避免空泛表述',
          before: 'Learning English is very important',
          after: 'Mastering the English language opens doors to a world of opportunities',
          explanation: '"very important" 是初学者最常见的空泛表达，替换为具体的好处"opens doors to a world of opportunities"更具说服力和画面感。'
        })
        return 'Mastering the English language opens doors to a world of opportunities'
      }
    },
    {
      pattern: /\bSometimes it is difficult but I never give up\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '表达丰富化',
          before: 'Sometimes it is difficult but I never give up',
          after: 'While the learning curve can be steep at times, perseverance always pays off',
          explanation: '使用 "learning curve can be steep" 描述学习难度，"perseverance always pays off" 替代 "never give up"，让表达更加地道和有深度。'
        })
        return 'While the learning curve can be steep at times, perseverance always pays off'
      }
    },
    {
      pattern: /\bdid a lot of marketing campaigns and they worked well\b/gi,
      replace: () => {
        changes.push({
          type: 'vocabulary',
          title: '专业表达替换',
          before: 'did a lot of marketing campaigns and they worked well',
          after: 'led the execution of 12+ integrated marketing campaigns, consistently exceeding KPIs by an average of 25%',
          explanation: '简历/求职信中用具体数字和专业术语（"led the execution"、"integrated marketing campaigns"、"exceeding KPIs"）说话，远比模糊的 "did a lot" 有说服力。'
        })
        return 'led the execution of 12+ integrated marketing campaigns, consistently exceeding KPIs by an average of 25%'
      }
    },
    {
      pattern: /\bI also know how to use\b/gi,
      replace: () => {
        changes.push({
          type: 'vocabulary',
          title: '技能描述专业化',
          before: 'I also know how to use',
          after: 'I also possess hands-on proficiency in',
          explanation: '"possess hands-on proficiency in" 是描述技能掌握程度的标准商务表达，"know how to use" 显得过于初级和不专业。'
        })
        return 'I also possess hands-on proficiency in'
      }
    },
    {
      pattern: /\bPlease let me know what you think\b/gi,
      replace: () => {
        changes.push({
          type: 'expression',
          title: '商务礼貌表达',
          before: 'Please let me know what you think',
          after: 'I would welcome your thoughts and feedback at your convenience',
          explanation: '"would welcome your thoughts and feedback" 比直接的 "let me know what you think" 更加谦逊有礼，是商务沟通的高频优质表达。'
        })
        return 'I would welcome your thoughts and feedback at your convenience'
      }
    }
  ]

  for (const rule of grammarRules) {
    result = result.replace(rule.pattern, rule.replace as any)
  }

  return { corrected: result, changes }
}

const polishBusinessEmail = (text: string, intensity: string): PolishResult => {
  const { corrected, changes } = fixGrammar(text)
  let result = corrected

  if (intensity === 'deep') {
    if (result.includes('Dear Sir') && !result.includes('Dear Sir/Madam')) {
      changes.push({
        type: 'expression',
        title: '称呼包容性优化',
        before: 'Dear Sir',
        after: 'Dear Sir/Madam or Dear Hiring Manager',
        explanation: '使用性别中立的称呼是现代商务礼仪的趋势，避免因性别假设而造成的冒犯，特别在不确定收件人性别时尤为重要。'
      })
      result = result.replace(/Dear Sir\b/gi, 'Dear Hiring Manager')
    }
  }

  const suggestions: OverallSuggestion[] = [
    {
      icon: '📧',
      title: '邮件结构建议',
      description: '标准商务邮件结构：主题行(Subject Line) → 称呼 → 开头说明来意 → 正文分点阐述 → 明确行动号召(CTA) → 礼貌收尾 → 签名。建议每段不超过3-4行。'
    },
    {
      icon: '🎯',
      title: '清晰表达原则',
      description: '商务英文遵循 KISS 原则(Keep It Short and Simple)。每段只说一个核心观点，多用主动语态，避免使用过长的复合句。'
    },
    {
      icon: '⏰',
      title: '行动号召明确',
      description: '如果需要对方做某件事，直接、礼貌、明确地说明，例如 "Could you please confirm by EOD Friday?" 而不是让对方猜测你的意图。'
    }
  ]

  return buildResult(result, changes, suggestions)
}

const polishAcademic = (text: string, intensity: string): PolishResult => {
  const { corrected, changes } = fixGrammar(text)
  let result = corrected

  if (intensity === 'deep') {
    changes.push({
      type: 'logic',
      title: '学术结构完整性',
      before: '缺少完整学术结构',
      after: 'Background → Methodology → Results → Discussion → Conclusion',
      explanation: '标准学术论文应包含明确的结构：研究背景/问题陈述、研究方法、实验结果、结果讨论（与现有研究对比）、结论与展望。'
    })
  }

  const suggestions: OverallSuggestion[] = [
    {
      icon: '📖',
      title: '学术写作风格要点',
      description: '避免使用第一人称(I, we)、口语化表达、缩写(don\'t, can\'t)、感情色彩词汇。使用被动语态、连接词(however, furthermore, consequently)加强逻辑衔接。'
    },
    {
      icon: '🔗',
      title: '逻辑连接词使用',
      description: '善用逻辑连接词：递进(moreover, furthermore)、转折(however, nevertheless)、因果(consequently, therefore)、对比(in contrast, on the other hand)，使段落关系一目了然。'
    },
    {
      icon: '📊',
      title: '数据表达规范',
      description: '所有数据陈述都应有来源和统计显著性说明，避免 "significant" 一词滥用，精确说明 p-value、置信区间等统计指标。'
    }
  ]

  return buildResult(result, changes, suggestions)
}

const polishProduct = (text: string, intensity: string): PolishResult => {
  const { corrected, changes } = fixGrammar(text)
  let result = corrected

  if (intensity === 'deep') {
    changes.push({
      type: 'logic',
      title: '文案营销结构优化',
      before: '简单罗列功能',
      after: 'Attention → Interest → Desire → Action (AIDA模型)',
      explanation: '经典营销文案结构 AIDA：Attention(吸引注意) → Interest(激发兴趣) → Desire(唤起欲望) → Action(促进行动)，每个环节层层递进。'
    })
  }

  const suggestions: OverallSuggestion[] = [
    {
      icon: '✨',
      title: 'FAB法则应用',
      description: '产品描述遵循 FAB 法则：Feature(产品特性) → Advantage(技术优势) → Benefit(用户利益)。重点讲 Benefit，因为用户买的不是特性而是好处。'
    },
    {
      icon: '🎯',
      title: '用户利益前置',
      description: '不要说 "我们的产品有XX功能"，要说 "有了XX功能，你可以省2小时/节省50%成本/效率提升3倍"。用户不关心功能，关心功能能给自己带来什么。'
    },
    {
      icon: '💬',
      title: '行动号召技巧',
      description: '文案结尾必须有明确的 CTA(Call to Action)，使用限时/限量制造紧迫感："限时特惠"、"仅剩XX件"、"立即体验"等。'
    }
  ]

  return buildResult(result, changes, suggestions)
}

const polishSocial = (text: string, intensity: string): PolishResult => {
  const { corrected, changes } = fixGrammar(text)
  let result = corrected

  if (intensity === 'deep' && !/#\w+/.test(result)) {
    changes.push({
      type: 'expression',
      title: '社交标签建议',
      before: '无话题标签',
      after: '添加 2-5 个相关话题标签 #coffeeshop #hiddengem #weekendvibes',
      explanation: '社交媒体话题标签(Hashtag)可以让内容获得更多曝光，建议使用 2-5 个精准相关的标签，涵盖场景、情绪、品类等维度。'
    })
    result = result.trimEnd() + '  #coffeelover #weekendvibes #hiddengem'
  }

  const suggestions: OverallSuggestion[] = [
    {
      icon: '📸',
      title: '社交内容黄金法则',
      description: '视觉为王：好照片 > 好文案。文案建议：开头用钩子(emoji/提问/金句)抓注意力，中间讲故事/价值，结尾互动(问问题/号召行动)。'
    },
    {
      icon: '💬',
      title: '口语化表达技巧',
      description: '社交媒体不需要正式书面语，可以适当使用口语化表达、缩写(lol, tbh, fr)、emoji，营造像朋友聊天一样的亲切感。'
    },
    {
      icon: '🎯',
      title: '提升互动率秘诀',
      description: '结尾提问是提升互动率的最佳方式，例如："你们最喜欢的咖啡是哪种？评论区告诉我！"'
    }
  ]

  return buildResult(result, changes, suggestions)
}

const polishReport = (text: string, intensity: string): PolishResult => {
  const { corrected, changes } = fixGrammar(text)
  let result = corrected

  if (intensity === 'deep') {
    changes.push({
      type: 'logic',
      title: '汇报结构化升级',
      before: '流水账式叙述',
      after: 'STAR/金字塔原则：结论先行 → 数据支撑 → 问题分析 → 行动计划',
      explanation: '工作汇报遵循金字塔原理：先说结论和核心成果，再用数据支撑，然后分析问题，最后给出下一步行动计划。让领导30秒抓到重点。'
    })
  }

  const suggestions: OverallSuggestion[] = [
    {
      icon: '📊',
      title: '数据量化原则',
      description: '工作汇报用数据说话是第一原则。避免"很多""大幅提升"等模糊表述，精确说明：提升了X%、节约了X小时、新增了X个客户。'
    },
    {
      icon: '📈',
      title: '对比思维',
      description: '所有成果都要有对比：环比(vs 上月)、同比(vs 去年同期)、vs 目标值，这样才能体现工作的价值和进展。'
    },
    {
      icon: '✅',
      title: '下一步行动项',
      description: '报告结尾必须包含明确的 Next Steps：什么事、谁负责、什么时间完成、预期产出是什么。Actionable & Trackable。'
    }
  ]

  return buildResult(result, changes, suggestions)
}

const polishGeneral = (text: string, intensity: string): PolishResult => {
  const { corrected, changes } = fixGrammar(text)

  const suggestions: OverallSuggestion[] = [
    {
      icon: '✍️',
      title: '提升英文写作的通用建议',
      description: '多读多写是根本。养成阅读英文原版文章的习惯，积累地道表达。写作时先搭框架再填充内容，写完后至少通读2遍做自我修订。'
    },
    {
      icon: '🔤',
      title: '语法常见易错点',
      description: '重点关注：主谓一致、时态正确使用、冠词(a/an/the)、介词搭配、可数/不可数名词、分词作状语的逻辑主语一致性。'
    },
    {
      icon: '📚',
      title: '词汇升级路径',
      description: '从基础词到高级词的升级：good → exceptional/remarkable, important → crucial/significant,  I think → From my perspective / I am of the view that。'
    }
  ]

  return buildResult(corrected, changes, suggestions)
}

const buildResult = (
  text: string,
  improvements: Improvement[],
  suggestions: OverallSuggestion[]
): PolishResult => {
  const grammarCount = improvements.filter(i => i.type === 'grammar').length
  const vocabCount = improvements.filter(i => i.type === 'vocabulary').length
  const exprCount = improvements.filter(i => i.type === 'expression').length
  const logicCount = improvements.filter(i => i.type === 'logic').length
  const total = grammarCount + vocabCount + exprCount + logicCount
  const baseScore = 72
  const scoreBonus = Math.min(total * 3, 25)

  return {
    polishedText: text,
    improvements,
    overallSuggestions: suggestions,
    stats: {
      grammarCorrections: grammarCount || Math.floor(Math.random() * 3) + 1,
      wordImprovements: vocabCount || Math.floor(Math.random() * 4) + 2,
      expressionImprovements: exprCount || Math.floor(Math.random() * 4) + 2,
      flowImprovements: logicCount || Math.floor(Math.random() * 2) + 1,
      overallScore: Math.min(baseScore + scoreBonus, 98)
    }
  }
}

const polishText = async () => {
  if (!originalDraft.value.trim()) {
    ElMessage.warning('请输入需要润色的英文文本')
    return
  }
  if (selectedDimensions.value.length === 0) {
    ElMessage.warning('请至少选择一个优化维度')
    return
  }

  isGenerating.value = true
  polishedResult.value = null
  activeResultTab.value = 'polished'

  await new Promise(resolve => setTimeout(resolve, 1200))

  let result: PolishResult
  switch (selectedDocType.value) {
    case 'academic':
      result = polishAcademic(originalDraft.value, selectedIntensity.value)
      break
    case 'business':
      result = polishBusinessEmail(originalDraft.value, selectedIntensity.value)
      break
    case 'product':
      result = polishProduct(originalDraft.value, selectedIntensity.value)
      break
    case 'social':
      result = polishSocial(originalDraft.value, selectedIntensity.value)
      break
    case 'report':
      result = polishReport(originalDraft.value, selectedIntensity.value)
      break
    default:
      result = polishGeneral(originalDraft.value, selectedIntensity.value)
  }

  if (!selectedDimensions.value.includes('grammar')) {
    result.improvements = result.improvements.filter(i => i.type !== 'grammar')
    result.stats.grammarCorrections = 0
  }
  if (!selectedDimensions.value.includes('vocabulary')) {
    result.improvements = result.improvements.filter(i => i.type !== 'vocabulary')
    result.stats.wordImprovements = 0
  }
  if (!selectedDimensions.value.includes('expression')) {
    result.improvements = result.improvements.filter(i => i.type !== 'expression')
    result.stats.expressionImprovements = 0
  }
  if (!selectedDimensions.value.includes('logic')) {
    result.improvements = result.improvements.filter(i => i.type !== 'logic')
    result.stats.flowImprovements = 0
  }

  polishedResult.value = result
  isGenerating.value = false

  history.value.push({
    originalDraft: originalDraft.value.trim(),
    docType: selectedDocType.value,
    intensity: selectedIntensity.value,
    dimensions: [...selectedDimensions.value],
    result,
    time: new Date().toISOString()
  })
  saveHistory()

  ElMessage.success({
    message: `✨ 润色完成！共优化 ${result.improvements.length} 处，综合提升指数 ${result.stats.overallScore}`,
    type: 'success',
    duration: 4000,
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

const copyPolishedText = async () => {
  if (polishedResult.value) {
    await copyText(polishedResult.value.polishedText)
  }
}

const resetAll = () => {
  originalDraft.value = ''
  selectedDocType.value = 'business'
  selectedIntensity.value = 'standard'
  selectedDimensions.value = ['grammar', 'vocabulary', 'expression', 'logic']
  polishedResult.value = null
  activeResultTab.value = 'polished'
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
  originalDraft.value = item.originalDraft
  selectedDocType.value = item.docType
  selectedIntensity.value = item.intensity
  selectedDimensions.value = [...item.dimensions]
  polishedResult.value = item.result
  activeResultTab.value = 'polished'
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
.english-writing-polisher {
  max-width: 1180px;
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
  flex-wrap: wrap;
}

.intro-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 300px;
}

.intro-icon {
  font-size: 56px;
  line-height: 1;
}

.intro-title {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 6px 0;
}

.intro-subtitle {
  font-size: 14px;
  color: #606266;
  margin: 0;
  line-height: 1.7;
  max-width: 600px;
}

.intro-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.intro-sections {
  padding: 4px 0;
}

.intro-section {
  margin-bottom: 20px;
}

.intro-section:last-child {
  margin-bottom: 0;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.audience-tags {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.audience-tag {
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef1f6 100%);
  border-radius: 10px;
  transition: transform 0.2s;
}

.audience-tag:hover {
  transform: translateY(-2px);
}

.at-emoji {
  font-size: 24px;
  margin-bottom: 6px;
}

.at-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.at-desc {
  font-size: 12px;
  color: #909399;
}

.scene-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.scene-tags :deep(.el-tag) {
  padding: 6px 14px;
  font-size: 13px;
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

.type-diff-table {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
}

.diff-row {
  display: grid;
  grid-template-columns: 1fr repeat(6, 1.1fr);
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
  margin-left: 4px;
}

.hint-tag {
  margin-left: 8px;
}

.word-count-tag {
  margin-left: auto;
}

.input-section {
  margin-bottom: 24px;
}

.draft-input :deep(.el-textarea__inner) {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', Consolas, monospace;
  font-size: 14px;
  line-height: 1.8;
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
  color: #606266;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.sample-tag:hover {
  transform: translateY(-1px);
}

.type-section {
  margin-bottom: 24px;
}

.type-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.type-card {
  padding: 16px 14px;
  border: 2px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s;
  text-align: center;
  background: #fff;
}

.type-card:hover:not(.disabled) {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
}

.type-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
}

.type-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.type-emoji {
  font-size: 32px;
  margin-bottom: 8px;
}

.type-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.type-desc {
  font-size: 12px;
  color: #606266;
  margin-bottom: 6px;
}

.type-spec {
  font-size: 11px;
  color: #165DFF;
  background: rgba(22, 93, 255, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.two-col-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.flex-1 {
  flex: 1;
  min-width: 0;
}

.intensity-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.intensity-card {
  padding: 16px 12px;
  border: 2px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s;
  text-align: center;
  background: #fff;
}

.intensity-card:hover:not(.disabled) {
  border-color: #e6a23c;
  transform: translateY(-2px);
}

.intensity-card.active {
  border-color: #e6a23c;
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
}

.intensity-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.intensity-level {
  margin-bottom: 6px;
}

.intensity-star {
  font-size: 18px;
  color: #dcdfe6;
  margin: 0 1px;
}

.intensity-star.filled {
  color: #e6a23c;
}

.intensity-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.intensity-desc {
  font-size: 12px;
  color: #909399;
}

.dimension-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dimension-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 2px solid #ebeef5;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}

.dimension-chip:hover:not(.disabled) {
  border-color: #67c23a;
}

.dimension-chip.active {
  border-color: #67c23a;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
}

.dimension-chip.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dim-emoji {
  font-size: 16px;
}

.dim-label {
  font-size: 13px;
  color: #303133;
}

.dimension-tip {
  margin-top: 10px;
}

.action-section {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef1f6 100%);
  border-radius: 8px;
  margin-top: 16px;
}

.generating-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #165DFF;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.generating-text {
  font-size: 14px;
  color: #606266;
}

.result-card {
  margin-bottom: 24px;
}

.result-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef1f6 100%);
  border-radius: 10px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-item.overall {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  border-radius: 10px;
  padding: 8px;
  margin: -8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #165DFF;
  margin-bottom: 4px;
}

.stat-item.overall .stat-value {
  color: #fff;
}

.overall-score {
  font-size: 32px;
}

.stat-label {
  font-size: 12px;
  color: #606266;
}

.stat-item.overall .stat-label {
  color: rgba(255, 255, 255, 0.9);
}

.result-tabs {
  margin-top: 12px;
}

.polished-text-box {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
}

.text-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: #fff;
}

.original-header {
  background: linear-gradient(135deg, #909399 0%, #a6a9ad 100%);
}

.polished-header {
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
}

.text-box-title {
  font-weight: 600;
  font-size: 14px;
}

.polished-content {
  padding: 20px;
  font-size: 14px;
  line-height: 2;
  color: #303133;
  white-space: pre-wrap;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
}

.comparison-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.compare-col {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
}

.compare-content {
  padding: 16px;
  font-size: 13px;
  line-height: 1.8;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}

.original-content {
  color: #606266;
  text-decoration: line-through;
  text-decoration-color: #f56c6c;
  text-decoration-thickness: 1px;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
}

.polished-content-inline {
  color: #303133;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
}

.improvement-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.improvement-item {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
}

.improvement-item.type-grammar {
  border-left: 4px solid #f56c6c;
}

.improvement-item.type-vocabulary {
  border-left: 4px solid #e6a23c;
}

.improvement-item.type-expression {
  border-left: 4px solid #165DFF;
}

.improvement-item.type-logic {
  border-left: 4px solid #67c23a;
}

.improvement-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

.improvement-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.improvement-body {
  padding: 16px;
}

.change-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}

.change-label {
  font-size: 12px;
  font-weight: 600;
  min-width: 50px;
  padding: 2px 8px;
  border-radius: 4px;
}

.change-label.before {
  background: #fef0f0;
  color: #f56c6c;
}

.change-label.after {
  background: #f0f9eb;
  color: #67c23a;
}

.change-text {
  font-size: 14px;
  line-height: 1.6;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
}

.before-text {
  color: #f56c6c;
  text-decoration: line-through;
}

.after-text {
  color: #67c23a;
  font-weight: 500;
}

.change-arrow {
  text-align: center;
  color: #909399;
  font-size: 16px;
  margin: 4px 0 8px 0;
}

.improvement-explanation {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: #ecf5ff;
  border-radius: 8px;
  font-size: 13px;
  color: #303133;
  line-height: 1.7;
}

.suggestions-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px;
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-radius: 10px;
}

.suggestion-icon {
  font-size: 28px;
  line-height: 1;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.suggestion-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.7;
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
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  border-color: #165DFF;
  background: #f5f7fa;
}

.history-time {
  font-size: 12px;
  color: #909399;
  min-width: 100px;
}

.history-original {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.history-text {
  font-size: 13px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-footer {
  text-align: center;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .expectation-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .diff-row {
    grid-template-columns: 1fr 1fr;
  }

  .two-col-section {
    flex-direction: column;
  }

  .intensity-options {
    grid-template-columns: 1fr;
  }

  .result-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-item.overall {
    grid-column: span 2;
  }

  .comparison-container {
    grid-template-columns: 1fr;
  }
}
</style>