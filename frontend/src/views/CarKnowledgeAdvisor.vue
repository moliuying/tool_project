<template>
  <div class="car-knowledge-advisor">
    <el-card class="intro-card">
      <div class="intro-header">
        <div class="intro-left">
          <div class="intro-icon">🚗</div>
          <div class="intro-text">
            <h2 class="intro-title">汽车知识专业咨询</h2>
            <p class="intro-subtitle">
              无论是发动机原理、变速箱差异、底盘技术还是新能源系统，让汽车领域资深专家为你系统解答。帮助汽车爱好者、车主、准购车者和从业者在遇到技术疑问时快速获得专业级别的回答
            </p>
          </div>
        </div>
        <div class="intro-badges">
          <el-tag type="primary" effect="dark" size="large">🔧 {{ expertFields.length }} 大专业领域</el-tag>
          <el-tag type="success" effect="dark" size="large">🏆 专家级解答</el-tag>
        </div>
      </div>
      <el-divider />
      <div class="intro-sections">
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><Grid /></el-icon>
            咨询领域分类
          </h4>
          <div class="category-tags">
            <div
              v-for="cat in questionCategories"
              :key="cat.value"
              class="category-tag"
            >
              <span class="ct-emoji">{{ cat.emoji }}</span>
              <span class="ct-name">{{ cat.label }}</span>
              <span class="ct-desc">{{ cat.desc }}</span>
            </div>
          </div>
        </div>
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><Collection /></el-icon>
            专家团队一览（擅长领域说明）
          </h4>
          <el-alert
            type="info"
            :closable="false"
            show-icon
            title="不同专家擅长领域各有侧重，系统将根据你的问题自动匹配最合适的专家视角"
            description="也可手动指定专家，获得更具针对性的解答"
            class="expert-alert"
          />
          <div class="expert-grid">
            <div
              v-for="expert in expertFields"
              :key="expert.value"
              class="expert-card expert-card-detailed"
              :style="{ borderColor: expert.color }"
            >
              <div class="expert-header" :style="{ backgroundColor: expert.color }">
                <span class="expert-emoji">{{ expert.emoji }}</span>
                <span class="expert-name">{{ expert.label }}</span>
                <span class="expert-title-inline">· {{ expert.title }}</span>
              </div>
              <div class="expert-quote">"{{ expert.quote }}"</div>
              <div class="expert-background">
                <span class="bg-label">专业背景：</span>
                <span class="bg-text">{{ expert.background }}</span>
              </div>
              <el-divider class="expert-divider" />
              <div class="expert-boundaries">
                <div class="boundary-col boundary-suitable">
                  <div class="boundary-col-title">
                    <el-icon color="#67c23a"><CircleCheck /></el-icon>
                    <span>擅长解答</span>
                  </div>
                  <ul>
                    <li v-for="(s, i) in expert.suitable" :key="i">{{ s }}</li>
                  </ul>
                </div>
                <div class="boundary-col boundary-unsuitable">
                  <div class="boundary-col-title">
                    <el-icon color="#f56c6c"><CircleClose /></el-icon>
                    <span>非擅长领域</span>
                  </div>
                  <ul>
                    <li v-for="(u, i) in expert.unsuitable" :key="i">{{ u }}</li>
                  </ul>
                </div>
              </div>
            </div>
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
        <el-step title="选择问题领域" description="发动机 / 变速箱 / 底盘 / 新能源 / 购车 等" />
        <el-step title="描述你的问题" description="详细说明车型、症状、场景等信息" />
        <el-step title="选择专家视角" description="动力专家 / 底盘工程师 / 新能源专家 等" />
        <el-step title="获得专业解答" description="原理详解 + 技术对比 + 实用建议 + 注意事项" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Document /></el-icon>
            <div class="exp-text">
              <div class="exp-num">专业原理解析</div>
              <div class="exp-label">深入浅出讲解技术原理</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><DataLine /></el-icon>
            <div class="exp-text">
              <div class="exp-num">技术方案对比</div>
              <div class="exp-label">不同技术路线的优劣分析</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">实用操作建议</div>
              <div class="exp-label">可落地的购车/用车/养车建议</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Warning /></el-icon>
            <div class="exp-text">
              <div class="exp-num">风险警示提醒</div>
              <div class="exp-label">常见误区与安全注意事项</div>
            </div>
          </div>
        </div>
      </div>
      <el-divider />
      <div class="boundary-section">
        <h4 class="expectation-title">
          <el-icon color="#f56c6c"><WarningFilled /></el-icon>
          ⚠️ 适用边界与重要提示
        </h4>
        <el-alert
          type="warning"
          :closable="false"
          show-icon
          title="汽车技术涉及行车安全，AI解答仅供参考学习，不可替代专业技师诊断"
          description="以下边界说明，请务必认真阅读"
          class="boundary-alert"
        />
        <div class="boundary-grid">
          <div class="boundary-item boundary-do">
            <div class="boundary-icon">✅</div>
            <div class="boundary-content">
              <div class="boundary-title">适合咨询的场景</div>
              <ul class="boundary-list">
                <li>汽车技术原理学习、行业知识了解</li>
                <li>购车前的技术对比、配置分析、选型参考</li>
                <li>日常用车保养的知识咨询、经验分享</li>
                <li>常见小故障的初步分析与排查方向建议</li>
                <li>新能源车型技术特点、使用注意事项了解</li>
              </ul>
            </div>
          </div>
          <div class="boundary-item boundary-dont">
            <div class="boundary-icon">❌</div>
            <div class="boundary-content">
              <div class="boundary-title">不建议直接依赖的场景</div>
              <ul class="boundary-list">
                <li>车辆出现严重故障、异响、报警灯亮等需立即检修的情况</li>
                <li>涉及行车安全的制动、转向、底盘等系统问题</li>
                <li>交通事故后的车辆定损、保险理赔等专业事项</li>
                <li>需要拆解发动机、变速箱等核心部件的维修决策</li>
                <li>车辆召回、三包维权等需官方/法律渠道解决的问题</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="boundary-tips">
          <el-icon color="#e6a23c"><InfoFilled /></el-icon>
          <span>
            <strong>核心原则：</strong>
            AI专家提供的是技术知识与参考建议，绝非维修诊断方案。汽车是高速行驶的交通工具，任何涉及安全的问题都应由持证专业技师现场处理。
            如遇故障灯亮、制动异常、转向异响、行驶抖动等安全相关问题，请立即前往正规4S店或维修厂检修，切勿仅凭AI建议自行操作。
          </span>
        </div>
      </div>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <Edit />
          </el-icon>
          <span>汽车知识咨询</span>
          <el-tag size="small" type="warning">专家在线解答</el-tag>
        </div>
      </template>

      <div class="question-category-section">
        <div class="section-title">
          <el-icon><Grid /></el-icon>
          <span>选择问题领域</span>
          <el-tag size="small" type="info" class="hint-tag">
            选择最贴近你问题的类别，专家解答将更有针对性
          </el-tag>
        </div>
        <div class="category-options">
          <div
            v-for="cat in questionCategories"
            :key="cat.value"
            class="category-card"
            :class="{ active: selectedCategory === cat.value, disabled: isGenerating }"
            @click="!isGenerating && (selectedCategory = cat.value)"
          >
            <div class="category-emoji">{{ cat.emoji }}</div>
            <div class="category-name">{{ cat.label }}</div>
            <div class="category-desc">{{ cat.desc }}</div>
          </div>
        </div>
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          <span>描述你的问题</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="questionDescription"
          type="textarea"
          :rows="6"
          placeholder="请详细描述你的汽车相关问题，包括：&#10;例如：「2023款丰田凯美瑞2.5L混动版，高速行驶时发动机介入瞬间有明显顿挫感，请问这正常吗？THS混动系统的工作原理是什么？」&#10;例如：「想买一台20万左右的家用SUV，关注油耗和安全性，纠结比亚迪宋PLUS DM-i和本田CR-V混动，能从技术角度分析一下各自的优缺点吗？」&#10;例如：「涡轮增压发动机在市区行驶是不是比较费油？保养费用是不是比自然吸气贵很多？」"
          maxlength="1000"
          show-word-limit
          :disabled="isGenerating"
          resize="vertical"
        />
        <div class="quick-samples">
          <span class="sample-label">💡 快速体验：</span>
          <el-tag
            v-for="(sample, i) in quickSamples"
            :key="i"
            class="sample-tag"
            effect="plain"
            @click="applySample(sample)"
          >
            {{ sample.label }}
          </el-tag>
        </div>
      </div>

      <div class="expert-section">
        <div class="section-title">
          <el-icon><Star /></el-icon>
          <span>选择专家视角（可选，不选则智能匹配）</span>
          <el-tag size="small" type="info" class="hint-tag">
            不同专家会从各自专业领域给出解答
          </el-tag>
        </div>
        <div class="expert-options">
          <div
            v-for="expert in expertFields"
            :key="expert.value"
            class="expert-chip"
            :class="{ active: selectedExpert === expert.value, disabled: isGenerating }"
            :style="selectedExpert === expert.value ? { backgroundColor: expert.color, borderColor: expert.color, color: '#fff' } : { borderColor: expert.color, color: expert.color }"
            @click="!isGenerating && toggleExpert(expert.value)"
          >
            <span class="chip-emoji">{{ expert.emoji }}</span>
            <span class="chip-label">{{ expert.label }}</span>
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
          @click="generateAnswer"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              汽车专家正在查阅技术资料…
            </span>
          </template>
          获取专业解答
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
          🔧 正在调取发动机/变速箱/底盘技术文档，分析匹配最佳方案…
        </span>
      </div>
    </el-card>

    <el-card v-if="generatedResult" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>专家解答</span>
          <el-tag
            size="small"
            effect="dark"
            :style="{ backgroundColor: getExpertColor(selectedExpert || generatedResult.expert), color: '#fff' }"
          >
            {{ getExpertLabel(selectedExpert || generatedResult.expert) }}
          </el-tag>
          <el-tag size="small" type="success">{{ getCategoryLabel(generatedResult.category) }}</el-tag>
          <div class="header-actions">
            <el-button size="small" type="primary" link :icon="CopyDocument" @click="copyResult">
              复制全部内容
            </el-button>
          </div>
        </div>
      </template>

      <div class="result-content">
        <div class="result-section answer-main">
          <div class="section-icon">💡</div>
          <h3 class="result-section-title">专业解答</h3>
          <div class="answer-text">{{ generatedResult.answer }}</div>
        </div>

        <div class="result-section principle-section">
          <div class="section-icon">⚙️</div>
          <h3 class="result-section-title">原理解析</h3>
          <div class="principle-content">
            <div class="principle-title">{{ generatedResult.principle.title }}</div>
            <div class="principle-detail">{{ generatedResult.principle.detail }}</div>
          </div>
        </div>

        <div v-if="generatedResult.comparison && generatedResult.comparison.items && generatedResult.comparison.items.length > 0" class="result-section comparison-section">
          <div class="section-icon">📊</div>
          <h3 class="result-section-title">{{ generatedResult.comparison.title }}</h3>
          <div
            v-for="(item, idx) in generatedResult.comparison.items"
            :key="idx"
            class="compare-card"
          >
            <div class="compare-row">
              <div class="compare-label compare-label-a">
                <el-icon><ArrowUp /></el-icon>
                <span>{{ item.optionA }}</span>
              </div>
              <div class="compare-content">{{ item.advantageA }}</div>
            </div>
            <div class="compare-row">
              <div class="compare-label compare-label-b">
                <el-icon><ArrowDown /></el-icon>
                <span>{{ item.optionB }}</span>
              </div>
              <div class="compare-content">{{ item.advantageB }}</div>
            </div>
            <div class="compare-row compare-suggestion">
              <div class="compare-label">
                <el-icon color="#165DFF"><MagicStick /></el-icon>
                <span>选择建议</span>
              </div>
              <div class="compare-content">{{ item.suggestion }}</div>
            </div>
          </div>
        </div>

        <div class="result-section suggestions-section">
          <div class="section-icon">🎯</div>
          <h3 class="result-section-title">实用建议</h3>
          <div class="suggestion-list">
            <div
              v-for="(suggestion, index) in generatedResult.suggestions"
              :key="index"
              class="suggestion-item"
            >
              <div class="suggestion-num">{{ index + 1 }}</div>
              <div class="suggestion-content">{{ suggestion }}</div>
            </div>
          </div>
        </div>

        <div v-if="generatedResult.warnings && generatedResult.warnings.length > 0" class="result-section warning-section">
          <div class="section-icon">⚠️</div>
          <h3 class="result-section-title">注意事项与常见误区</h3>
          <div class="warning-list">
            <div
              v-for="(warning, index) in generatedResult.warnings"
              :key="index"
              class="warning-item"
            >
              <el-icon color="#f56c6c"><WarningFilled /></el-icon>
              <span>{{ warning }}</span>
            </div>
          </div>
        </div>

        <div v-if="generatedResult.maintenanceTips && generatedResult.maintenanceTips.length > 0" class="result-section maintenance-section">
          <div class="section-icon">🔧</div>
          <h3 class="result-section-title">保养维护小贴士</h3>
          <div class="maintenance-list">
            <div
              v-for="(tip, index) in generatedResult.maintenanceTips"
              :key="index"
              class="maintenance-item"
            >
              <el-icon color="#67c23a"><CircleCheck /></el-icon>
              <span>{{ tip }}</span>
            </div>
          </div>
        </div>

        <el-alert
          type="warning"
          :closable="false"
          show-icon
          class="result-disclaimer"
        >
          <template #title>
            <span class="disclaimer-title">⚠️ 重要免责声明</span>
          </template>
          <div class="disclaimer-content">
            <p>
              <strong>本功能提供的所有技术解答、原理分析、选购建议均基于公开汽车技术资料的整理与解读，仅供学习参考之用，不构成任何维修、诊断、购车决策建议。</strong>
            </p>
            <ul class="disclaimer-list">
              <li>汽车是高速交通工具，任何涉及行车安全的问题（制动、转向、底盘、发动机故障等）请立即前往正规4S店或持证维修厂检修</li>
              <li>购车决策请结合实际试驾、官方参数、专业评测综合判断，本解答仅为技术知识参考</li>
              <li>车辆维修保养请遵循原厂说明书和专业技师指导，切勿仅凭AI建议自行拆解或改装核心部件</li>
              <li>涉及交通事故、保险理赔、三包维权等事项，请通过官方渠道和法律途径解决</li>
              <li>如您的车辆存在安全隐患或故障报警，请立即安全停车并联系专业救援，切勿继续行驶</li>
            </ul>
          </div>
        </el-alert>
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
          <div class="history-question">
            <el-tag size="small" type="info">{{ getCategoryLabel(item.category) }}</el-tag>
            <span class="history-text">{{ truncateText(item.description, 40) }}</span>
          </div>
          <div class="history-meta">
            <el-tag size="small" effect="dark" :style="{ backgroundColor: getExpertColor(item.expert), color: '#fff' }">
              {{ getExpertLabel(item.expert) }}
            </el-tag>
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
  MagicStick,
  Refresh,
  Loading,
  Finished,
  CopyDocument,
  Clock,
  InfoFilled,
  Document,
  Star,
  EditPen,
  Grid,
  Collection,
  WarningFilled,
  CircleCheck,
  CircleClose,
  Warning,
  DataLine,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface AnswerResult {
  category: string
  expert: string
  answer: string
  principle: {
    title: string
    detail: string
  }
  comparison?: {
    title: string
    items: {
      optionA: string
      advantageA: string
      optionB: string
      advantageB: string
      suggestion: string
    }[]
  }
  suggestions: string[]
  warnings?: string[]
  maintenanceTips?: string[]
}

interface HistoryItem {
  category: string
  expert: string
  description: string
  result: AnswerResult
  time: string
}

interface QuickSample {
  label: string
  category: string
  description: string
  expert?: string
}

const STORAGE_KEY = 'car_knowledge_history'

const questionCategories = [
  {
    value: 'engine',
    label: '发动机系统',
    emoji: '🔥',
    desc: '自然吸气/涡轮增压、三缸/四缸、米勒/阿特金森循环、混动系统'
  },
  {
    value: 'transmission',
    label: '变速箱系统',
    emoji: '⚙️',
    desc: 'MT/AT/CVT/DCT、双离合可靠性、变速箱档位逻辑'
  },
  {
    value: 'chassis',
    label: '底盘技术',
    emoji: '🛞',
    desc: '悬挂类型、转向系统、制动技术、车身结构、行驶质感'
  },
  {
    value: 'nev',
    label: '新能源系统',
    emoji: '🔋',
    desc: '纯电/混动/插混、电池技术、电机类型、充电技术、续航'
  },
  {
    value: 'purchase',
    label: '购车决策',
    emoji: '💰',
    desc: '车型对比、配置分析、性价比评估、购车避坑指南'
  },
  {
    value: 'maintenance',
    label: '保养维护',
    emoji: '🔧',
    desc: '保养周期、机油选择、常见小故障判断、用车技巧'
  },
  {
    value: 'safety',
    label: '安全技术',
    emoji: '🛡️',
    desc: '主动安全、被动安全、车身结构、碰撞测试解读'
  },
  {
    value: 'industry',
    label: '行业知识',
    emoji: '🏭',
    desc: '汽车发展史、技术趋势、品牌技术特点、行业政策'
  }
]

const expertFields = [
  {
    value: 'powertrain',
    label: '动力系统专家',
    emoji: '🔥',
    color: '#e74c3c',
    title: '高级动力总成工程师',
    quote: '发动机和变速箱是汽车的心脏与神经，理解它们才能真正懂车',
    background: '15年动力总成研发经验，曾任职于多家知名车企发动机研发中心，精通传统内燃机与混动系统',
    suitable: [
      '发动机工作原理、技术特点分析',
      '涡轮增压/自然吸气/混动对比',
      '变速箱类型差异、可靠性分析',
      '动力系统匹配、驾驶质感解读'
    ],
    unsuitable: [
      '底盘悬挂调校、操控性分析',
      '电池电机技术、充电问题',
      '车身结构、碰撞安全',
      '具体车型配置价格对比'
    ]
  },
  {
    value: 'chassis',
    label: '底盘工程师',
    emoji: '🛞',
    color: '#2980b9',
    title: '底盘调校高级工程师',
    quote: '底盘是汽车的灵魂，好的底盘让驾驶者感受到人马一体',
    background: '12年整车底盘开发经验，参与过多款畅销车型的底盘调校与验证工作',
    suitable: [
      '悬挂类型原理与优缺点分析',
      '转向系统、制动系统技术解读',
      '不同级别车型底盘质感差异',
      '行驶舒适性、操控性对比分析'
    ],
    unsuitable: [
      '发动机变速箱技术细节',
      '新能源三电系统问题',
      '汽车电子、车机系统',
      '金融方案、保险计算'
    ]
  },
  {
    value: 'nev',
    label: '新能源专家',
    emoji: '🔋',
    color: '#27ae60',
    title: '新能源技术资深顾问',
    quote: '电动化是不可逆转的趋势，但选择适合自己的才是最好的',
    background: '10年新能源汽车研发经验，深度参与纯电/插混/增程多款车型开发',
    suitable: [
      '纯电/混动/插混/增程技术对比',
      '电池类型、续航、充电技术解读',
      '新能源车型选购建议',
      '电池保养、低温使用、安全注意事项'
    ],
    unsuitable: [
      '传统燃油车发动机变速箱问题',
      '底盘调校、驾驶质感分析',
      '经典老爷车、收藏车问题',
      '改装配件选择、动力改装'
    ]
  },
  {
    value: 'review',
    label: '资深车评人',
    emoji: '📹',
    color: '#8e44ad',
    title: '汽车媒体资深评测编辑',
    quote: '评测过300+款车型，好车坏车一上手就知道',
    background: '10年汽车媒体从业经验，试驾评测超过300款各类车型，擅长用消费者视角分析产品',
    suitable: [
      '同级别车型横向对比评测',
      '购车决策建议、配置选择分析',
      '不同品牌产品力特点解读',
      '家用车/性能车/SUV选购指导'
    ],
    unsuitable: [
      '过于深入的工程技术细节',
      '具体维修方案、故障诊断',
      '汽车改装、性能调校',
      '法律维权、保险理赔'
    ]
  },
  {
    value: 'maintenance',
    label: '维修技师',
    emoji: '🔧',
    color: '#f39c12',
    title: '4S店金牌维修技师',
    quote: '车是七分养三分修，正确的用车养车习惯比什么都重要',
    background: '18年汽车维修经验，持有国家一级汽修技师证书，擅长各类车型故障诊断与保养指导',
    suitable: [
      '日常保养项目、周期、费用指导',
      '机油/变速箱油/轮胎等耗材选择',
      '常见小故障初步判断与建议',
      '用车习惯、养车误区提醒'
    ],
    unsuitable: [
      '新车选购、技术原理解析（非维修相关）',
      '需要现场检测的复杂故障诊断',
      '车辆改装、动力升级',
      '涉及保修索赔的具体纠纷处理'
    ]
  },
  {
    value: 'safety',
    label: '安全工程师',
    emoji: '🛡️',
    color: '#16a085',
    title: '汽车安全技术专家',
    quote: '安全是汽车最基本也是最重要的品质，没有之一',
    background: '10年汽车安全研发经验，参与过多款车型被动安全开发与碰撞验证',
    suitable: [
      '主动安全/被动安全技术解读',
      '碰撞测试标准与结果分析',
      '车身结构安全、材料技术',
      '不同级别/类型车型安全性对比'
    ],
    unsuitable: [
      '动力系统、底盘调校问题',
      '车载娱乐、车机系统',
      '车辆保值率、金融方案',
      '改装配件、外观套件'
    ]
  }
]

const quickSamples: QuickSample[] = [
  {
    label: '涡轮和自吸怎么选',
    category: 'engine',
    description: '想买一台家用轿车，预算15万左右，现在大部分都是1.5T涡轮增压，但老一辈都说自然吸气更省心耐用。请问从技术角度分析，涡轮增压和自然吸气到底各有什么优缺点？家用应该怎么选？',
    expert: 'powertrain'
  },
  {
    label: 'CVT和双离合哪个好',
    category: 'transmission',
    description: '最近在看SUV，同一款车有的配置用CVT变速箱，有的用7速湿式双离合。听说CVT打滑、双离合顿挫，想知道这两种变速箱在技术原理、可靠性、平顺性、保养成本方面各有什么特点？',
    expert: 'powertrain'
  },
  {
    label: '比亚迪DM-i和丰田混动对比',
    category: 'nev',
    description: '预算20万想买混动SUV，在比亚迪宋PLUS DM-i和本田CR-V e:HEV之间纠结。请问这两套混动系统在技术路线、工作原理、可靠性、油耗表现方面有什么差异？各有什么优缺点？',
    expert: 'nev'
  },
  {
    label: '纯电还是插混',
    category: 'nev',
    description: '家里有车位可以装充电桩，通勤单程30公里，偶尔跑长途（每年3-4次，单程500公里左右）。一直在纯电动车和插电混动之间犹豫，能不能从技术和使用场景角度给点建议？',
    expert: 'nev'
  },
  {
    label: '保养必须去4S店吗',
    category: 'maintenance',
    description: '车出了保修期，4S店保养比外面修理厂贵不少。但又担心外面用的机油配件不靠谱。请问脱保后到底应该继续在4S店保养还是去靠谱的维修厂？有什么需要注意的？',
    expert: 'maintenance'
  },
  {
    label: '麦弗逊和双叉臂区别',
    category: 'chassis',
    description: '看车的时候经常看到前悬挂是麦弗逊式独立悬挂，高配上是双叉臂或者多连杆。请问麦弗逊、双叉臂、多连杆这些悬挂类型在结构和实际驾驶感受上有什么区别？真的越复杂越好吗？',
    expert: 'chassis'
  }
]

const knowledgeBank: Record<string, Record<string, AnswerResult[]>> = {
  engine: {
    powertrain: [
      {
        category: 'engine',
        expert: 'powertrain',
        answer: '作为动力总成工程师，我来系统解答一下涡轮增压与自然吸气的技术差异问题。这两种进气形式各有其技术特点与适用场景，并非简单的"谁好谁坏"，而是"谁更适合你的使用场景"。\n\n简单来说：自然吸气发动机结构简单、可靠性高、动力输出线性平顺，适合追求稳定省心、城市温柔驾驶的用户；涡轮增压发动机动力更强、扭矩平台更宽、燃油经济性更好，适合追求动力性能、经常高速或满载行驶的用户。\n\n你提到的"老一辈说自然吸气更省心"确实有一定道理，但那是基于早期涡轮增压技术不成熟的印象。现代涡轮增压技术已经非常成熟，可靠性与自然吸气的差距已经很小。',
        principle: {
          title: '涡轮增压与自然吸气的工作原理差异',
          detail: '自然吸气（NA）：依靠活塞下行产生的真空负压，将空气吸入气缸。空气进入量由节气门开度控制，进气效率取决于发动机转速和活塞抽气能力。特点是"有多少转速就有多少进气"，动力输出非常线性。\n\n涡轮增压（Turbo）：利用发动机排气能量驱动涡轮，涡轮同轴连接压气机，将空气压缩后送入气缸。同等排量下可以压入更多空气，配合更多燃油，实现"小排量大动力"。特点是中低转速就能输出大扭矩，动力响应有一定迟滞（涡轮迟滞）。'
        },
        comparison: {
          title: '涡轮增压 vs 自然吸气 技术对比',
          items: [
            {
              optionA: '涡轮增压',
              advantageA: '动力更强、扭矩平台更宽（1.5T≈2.5NA动力）；燃油经济性更好（同等动力下油耗低15%-25%）；小排量税费更低；高速巡航动力储备充足',
              optionB: '自然吸气',
              advantageB: '结构简单故障率低；动力输出线性平顺易操控；保养成本更低（不需要全合成机油）；高温高负荷下可靠性更好；对油品要求更低',
              suggestion: '家用为主、城市通勤占比高、追求动力储备和燃油经济性→选涡轮增压；追求省心稳定、对动力要求不高、经常极端工况行驶→选自然吸气。以当前15万级家用车来说，优秀的小排量涡轮增压是主流选择，兼顾了动力和油耗。'
            }
          ]
        },
        suggestions: [
          '如果选择涡轮增压车型，建议优先选择有市场口碑的成熟机型（如大众EA211 1.4T、本田L15BN 1.5T、丰田M20C混动等），避免选择刚上市的全新机型',
          '涡轮增压车型尽量使用厂家推荐标号的全合成机油，并严格按照保养周期更换，这对涡轮寿命至关重要',
          '涡轮增压车型在长时间高速行驶后，不要立即熄火，建议怠速30秒-1分钟让涡轮充分冷却（大部分新车有电子水泵延时冷却功能，但养成习惯更好）',
          '试驾时重点感受低转速区间的动力响应和涡轮介入的平顺性，好的调校应该感觉不到明显的涡轮迟滞',
          '从长期使用成本看，涡轮增压车型虽然单次保养贵一些，但油耗节省的费用通常可以抵消甚至超过保养差价'
        ],
        warnings: [
          '不要盲目相信"涡轮容易坏"的老旧观念，现代家用车涡轮增压设计寿命通常与发动机相当（20万公里以上），正常保养完全可以放心使用',
          '也不要被参数表上的最大马力/扭矩迷惑，实际驾驶感受更重要，关注最大扭矩输出的转速区间（越宽越好），而不仅仅是峰值',
          '三缸涡轮增压发动机的NVH（噪音振动）表现通常不如同排量四缸，建议务必实际试驾感受是否能接受',
          '如果所在地区油品质量较差，涡轮增压车型建议定期使用燃油添加剂清除积碳'
        ],
        maintenanceTips: [
          '涡轮增压车型：建议使用SN级以上全合成机油，5W-30或0W-30粘度（以厂家推荐为准），更换周期不超过1万公里/6个月',
          '自然吸气车型：半合成或矿物油也可使用（以厂家推荐为准），更换周期通常为5000-7500公里/6个月',
          '无论哪种发动机，定期更换空气滤芯和火花塞对保持良好工况至关重要',
          '冷启动后避免立即大油门行驶，预热30秒-1分钟后再温柔行驶，等水温上来后再正常驾驶'
        ]
      }
    ],
    nev: [
      {
        category: 'engine',
        expert: 'nev',
        answer: '从新能源技术角度看，传统燃油发动机和混动系统中的发动机工作模式有很大不同。混动车型的发动机往往采用阿特金森循环或米勒循环，热效率更高，但输出特性与传统奥托循环发动机差异明显。如果你主要关注的是家用场景的经济性，混动系统是比纯涡轮增压更好的选择。',
        principle: {
          title: '阿特金森/米勒循环与传统奥托循环的区别',
          detail: '传统奥托循环：压缩比=膨胀比，四个冲程等容工作，动力性好但热效率上限约35%。\n阿特金森循环：膨胀比>压缩比，通过延迟进气门关闭，让膨胀行程更长，热效率可达40%以上，但低扭较差，不适合单独驱动车辆。\n米勒循环：原理类似阿特金森，配合涡轮增压解决低扭问题，是现代混动和高效燃油机的主流技术路线。'
        },
        suggestions: [
          '如果你年行驶里程高（2万公里以上）且拥堵路况多，强烈建议考虑混动车型，油耗优势会非常明显',
          '如果只是偶尔用车、年里程低于1万公里，纯燃油车的购置成本优势更划算',
          '混动车型的发动机因为经常启停，对机油品质要求更高，务必使用原厂推荐规格',
          '电池质保是选购混动的重要考量，优先选择电池终身质保或质保期长的品牌'
        ],
        warnings: [
          '混动车型的维修保养除了发动机部分，还涉及电机、电池、电控系统，出保后的维修成本可能高于纯燃油车',
          '不建议自行改装混动系统的任何部件，高压电系统存在严重安全风险'
        ]
      }
    ],
    review: [
      {
        category: 'engine',
        expert: 'review',
        answer: '从汽车评测的角度，我试驾过大量涡轮增压和自然吸气车型。实际体验来说，同价位优秀的小排量涡轮增压车型在日常驾驶中动力感受普遍优于同价位自然吸气，尤其是在城市通勤需要的中低速区间。但平顺性和可靠性方面，自然吸气确实有天然优势。建议你实际去4S店试驾几款候选车型，自己的感受比参数更重要。',
        principle: {
          title: '消费者试驾时如何判断发动机好坏',
          detail: '1. 怠速NVH：启动后观察方向盘、座椅、档把的振动大小，听发动机噪音是否明显传入车内。\n2. 起步响应：轻踩油门起步是否跟脚，有没有"踩了不走"或"窜车"的现象。\n3. 中段加速：40-80km/h再加速是否有力，变速箱降挡是否积极平顺。\n4. 高转表现：深踩油门拉到高转速，看噪音是否发散、动力是否衰减。\n5. 滑行体验：松开油门后车辆滑行是否顺畅，有没有明显的拖拽感。'
        },
        suggestions: [
          '15万预算家用，推荐试驾：大众速腾1.4T、丰田亚洲狮2.0L、本田型格1.5T、马自达昂克赛拉2.0L，这几款分别代表了不同技术路线的优秀水准',
          '试驾时找一段有坡道的路，感受满载爬坡时的动力储备，这比平地加速更能体现真实水平',
          '试乘时坐在后排感受NVH表现，家用车后排的乘坐舒适性同样重要',
          '多看看车主论坛的真实反馈，重点关注是否有普遍性的发动机故障投诉'
        ],
        warnings: [
          '不要被销售话术忽悠，什么"赛道级调校""赛车级发动机"听听就好，家用车的核心是平顺、省油、可靠',
          '参数表上的马力是"净功率"还是"额定功率"要注意区分，有些厂家喜欢用额定功率标高分，实际净功率可能差不少'
        ]
      }
    ]
  },
  transmission: {
    powertrain: [
      {
        category: 'transmission',
        expert: 'powertrain',
        answer: '作为动力总成工程师，我来系统解读一下CVT和双离合变速箱这两种当今主流的自动变速箱技术。首先纠正一个常见误区：不是"CVT就一定打滑、双离合就一定顿挫"，关键在于具体厂家的调校水平和技术成熟度。同样是双离合，保时捷PDK和某些品牌的干式双离合完全是两个物种；同样是CVT，丰田Direct Shift CVT和早期低端CVT也有天壤之别。',
        principle: {
          title: 'CVT与双离合变速箱的结构原理',
          detail: 'CVT（无级变速箱）：通过两组可变直径的锥轮和钢带/钢链传递动力，理论上有无数个传动比，可以实现无缝连续变速。特点是平顺性极佳、燃油经济性好，但能承受的最大扭矩有限，激烈驾驶容易过热保护。\n\nDCT（双离合变速箱）：本质是两套手动变速箱交替工作，一套负责奇数档，一套负责偶数档，换挡时两套离合器交替切换。特点是换挡速度快、传动效率高，但低速时容易出现顿挫（尤其是干式双离合）。\n\n湿式双离合：离合器片浸泡在变速箱油中，散热好、能承受大扭矩、可靠性高，但结构复杂成本高。\n干式双离合：离合器片裸露，靠空气散热，成本低传动效率高，但散热差、拥堵路况容易过热。'
        },
        comparison: {
          title: 'CVT vs 湿式双离合 技术对比',
          items: [
            {
              optionA: 'CVT无级变速',
              advantageA: '平顺性最好，几乎感觉不到换挡；燃油经济性优秀（传动效率接近手动）；结构相对简单、成本较低；低速蠕行平顺性好，适合拥堵路况',
              optionB: '湿式双离合DCT',
              advantageB: '换挡速度快、动力响应直接；传动效率高、动力损失小；能承受大扭矩，适合大马力车型；驾驶乐趣高、运动感强',
              suggestion: '追求极致平顺、家用代步、经常拥堵城市通勤→选CVT（优先丰田、本田、日产等有多年CVT技术积累的品牌）；追求驾驶乐趣、动力响应、经常跑高速/国道→选湿式双离合（优先大众DQ381/DQ500系列、格特拉克、保时捷PDK等成熟方案）。干式双离合不推荐，除非你所在地区基本不堵车。'
            }
          ]
        },
        suggestions: [
          '选购CVT车型：优先选择有"起步齿轮"或"起步离合器"的新一代CVT（如丰田Direct Shift CVT），解决了传统CVT起步打滑和低效率问题',
          '选购双离合车型：一定问清楚是湿式还是干式，坚决避开干式双离合（除非你能保证90%以上路况是顺畅高速）',
          '试驾双离合车型：重点感受1-2-3挡低速跟车时的平顺性，找一段拥堵路段反复蠕行，看是否有明显顿挫、异响',
          '无论哪种变速箱，都要定期更换变速箱油，CVT油和双离合油不能混用，必须使用原厂指定规格',
          'CVT车型尽量避免长时间激烈驾驶（如连续山路爬坡、赛道驾驶），容易触发过热保护'
        ],
        warnings: [
          '网传"CVT不能空挡滑行"基本属实，因为CVT空挡时油泵压力不足，锥轮钢带可能因润滑不够而磨损，D挡滑行更安全',
          '双离合车型在拥堵路况建议切换到手动模式或S挡，让变速箱保持在较低档位减少频繁换挡，可以有效降低顿挫和离合器磨损',
          'CVT变速箱不能暴力拖车，被拖时必须将驱动轮抬起或使用平板拖车，否则会严重损坏内部结构',
          '双离合变速箱的"顿挫"很多是调校问题而非故障，如果只是轻微偶发是正常现象，不必过度焦虑'
        ],
        maintenanceTips: [
          'CVT变速箱油：更换周期通常为4万-8万公里（以厂家手册为准），必须使用原厂指定CVT专用油，普通ATF绝对不能用',
          '湿式双离合变速箱油：更换周期通常为6万-10万公里，同样需要专用变速箱油',
          '更换变速箱油强烈建议使用循环机换油方式，换油更彻底（虽然用油量是重力换油的2-3倍）',
          '每次保养检查变速箱油底壳是否有渗漏，闻一下变速箱油是否有焦糊味（有焦糊味说明离合器片已烧蚀）'
        ]
      }
    ],
    maintenance: [
      {
        category: 'transmission',
        expert: 'maintenance',
        answer: '从维修技师的角度，我见过太多变速箱因为保养不当出问题。无论是CVT还是双离合，定期更换变速箱油都是延长寿命的关键。很多车主看了厂家"终身免维护"的宣传就真的一辈子不换油，结果十几万公里变速箱就废了，这个亏吃得特别多。我的建议是：不管厂家怎么说，8万公里以内一定要换变速箱油。',
        principle: {
          title: '变速箱油的作用和变质原因',
          detail: '变速箱油有三个核心作用：1. 润滑：减少齿轮、轴承、离合器片的磨损；2. 传动：CVT靠油压控制锥轮夹紧力，双离合靠油压推动换挡执行机构；3. 散热：带走变速箱工作产生的热量。\n变速箱油长期使用后会氧化变质、粘度下降、添加剂耗尽，同时会混入金属磨屑，导致润滑和传动性能下降，最终造成变速箱内部磨损。'
        },
        suggestions: [
          'CVT变速箱油：建议4-6万公里更换一次，尤其是经常跑高速或满载的车辆',
          '湿式双离合变速箱油：建议6-8万公里更换一次',
          'AT变速箱油：可以6-8万公里更换',
          '手动变速箱油：可以8-10万公里更换',
          '换变速箱油一定要去正规门店，用对油品型号比什么都重要'
        ],
        warnings: [
          '"终身免维护"≠"终身不用换油"，这个"终身"通常指的是设计寿命而非实际使用寿命，厂家的宣传话术要谨慎理解',
          '变速箱出问题的前兆：换挡顿挫明显加重、D挡踩刹车抖动变大、变速箱异响、漏油、仪表盘变速箱故障灯亮，出现这些请立即检查',
          '不要相信网上所谓的"变速箱修复剂""抗磨剂"，如果变速箱已经磨损，这些东西修不好，只会耽误维修时机',
          '变速箱维修费用很高（动辄上万），定期保养花小钱省大钱，千万不要因小失大'
        ],
        maintenanceTips: [
          '自动挡车型等红灯时，短时间（30秒内）可以D挡踩刹车，长时间建议挂N挡拉手刹，减少变速箱内部滑磨',
          '不要在车辆未停稳时从D挡挂入R挡或P挡，会严重冲击变速箱齿轮',
          '上陡坡或下长坡时，自动挡车型可以切换到手动模式锁定低档位，利用发动机制动，减少刹车磨损和变速箱频繁换挡',
          '拖车时注意：前驱车型抬前轮、后驱车型抬后轮、四驱车型必须用平板车，切勿直接拖行'
        ]
      }
    ]
  },
  nev: {
    nev: [
      {
        category: 'nev',
        expert: 'nev',
        answer: '作为新能源技术专家，我来系统对比一下比亚迪DM-i超级混动和本田i-MMD混动系统。这两套可以说是目前世界上最优秀的混动技术路线，理念相似但实现路径各有特色。简单总结：DM-i在纯电续航、动力性能、智能化方面更有优势，性价比更高；i-MMD在系统成熟度、可靠性口碑、发动机NVH方面更有积淀，保值率可能更好。',
        principle: {
          title: 'DM-i与i-MMD的技术原理对比',
          detail: '比亚迪DM-i超级混动：以电为主的混动架构。核心是一台大功率驱动电机（160-145kW）+ 一台小功率发电机 + 一台1.5L/1.5T阿特金森循环骁云发动机。电池容量较大（8.3kWh起步），纯电续航51-252km。日常通勤完全可以纯电行驶，亏电时发动机主要作为发电机供电给驱动电机，高速工况下发动机才会通过离合器直驱车轮。\n\n本田i-MMD（e:HEV）：同样是以电为主的混动架构。驱动电机功率（135-184kW），2.0L阿特金森循环发动机，电池容量较小（约1.1-1.3kWh）。不能纯电长距离行驶，发动机频繁启停发电。中低速以电机驱动为主，高速发动机直驱。\n\n二者最大区别：DM-i有大容量电池支持纯电行驶（可插混可当油混用），i-MMD是不插电的强混（蓝牌），完全靠发动机发电和回收动能。'
        },
        comparison: {
          title: '比亚迪DM-i vs 本田i-MMD 深度对比',
          items: [
            {
              optionA: '比亚迪DM-i（插混）',
              advantageA: '可纯电行驶51-252km，日常通勤0油耗；绿牌免购置税（部分城市不限行）；动力更强（0-100km/h普遍在7-8秒级）；智能化配置更丰富（DiLink系统、辅助驾驶）；价格更亲民，性价比极高',
              optionB: '本田i-MMD（不插电混动）',
              advantageB: '系统经过全球千万台级市场验证，成熟度和可靠性口碑极好；发动机NVH控制出色，启动和运转静谧性好；不需要充电条件，加油就用；本田品牌保值率较高；油耗表现非常稳定，4.5-5.5L/100km',
              suggestion: '有充电条件、想要绿牌、看重智能化和动力性能、日常通勤里程30km以上→选DM-i；没有充电条件、只想要一台省心省油的油混、看重品牌保值率和长期可靠性→选i-MMD。如果没有充电条件却买DM-i，长期亏电行驶油耗反而不如i-MMD，这是很多车主踩过的坑。'
            }
          ]
        },
        suggestions: [
          'DM-i车主建议：尽量安装家用充电桩，日常通勤纯电行驶，使用成本极低（每公里5-8分钱），长期亏电行驶会增加发动机磨损和油耗',
          'i-MMD车主建议：虽然不需要充电，但也尽量避免短途极端行驶（每次启动行驶不足5公里），否则发动机频繁启停机油乳化风险增加',
          '无论是哪种混动，电池都是核心部件，选购时优先选择提供电池终身质保的品牌和配置',
          '严寒地区（冬季-20℃以下）需注意：所有混动车型冬季纯电续航都会明显下降（30%-50%），发动机启动更频繁，油耗也会上升，这是正常现象',
          '长期停放（超过1个月）：建议将电池电量保持在50%-70%，断开小电瓶负极，避免电池过放损坏'
        ],
        warnings: [
          '不要用"快充"频繁给插混车型的小电池充电，会影响电池寿命，尽量使用慢充（家用桩或便携充）',
          'DM-i等插混车型在亏电状态下NVH表现会明显下降（发动机频繁启动），试驾时一定要试驾亏电状态下的表现',
          '高压电系统严禁自行触碰或拆解，维修保养务必去授权服务中心，非正规操作有触电危险',
          '涉水行驶注意：电动车/混动车虽然电池防水等级较高（通常IP67），但也不要盲目涉水，尤其是水位超过底盘高度的深水，高压线束接头和电机控制器仍有进水风险'
        ],
        maintenanceTips: [
          '三电系统（电池、电机、电控）基本免维护，按厂家要求定期检查即可',
          '混动车型的发动机因为经常启停，建议使用全合成机油，更换周期参考厂家手册（通常是1年或1万公里）',
          '每3个月检查一次轮胎胎压，电动车/混动车因为车重更大，胎压对续航和轮胎磨损影响更大',
          '空调滤芯、空气滤芯与燃油车相同周期更换',
          '长期不开也要定期启动行驶10-20公里，给动力电池和12V小电瓶补电'
        ]
      }
    ],
    review: [
      {
        category: 'nev',
        expert: 'review',
        answer: '从评测的角度，我对比试驾过宋PLUS DM-i和CR-V混动。最直观的感受是：纯电行驶质感DM-i完胜，完全是电动车的静谧平顺体验；亏电状态下CR-V混动的NVH控制更好，发动机启动的存在感更低。空间方面宋PLUS更宽敞、配置更丰富，CR-V的底盘质感和整车做工细节更扎实。建议你两款都去试驾一下，尤其是找机会试驾亏电状态下的DM-i，那个状态才是很多车主长期使用的真实状态。',
        principle: {
          title: '选购新能源车型的试驾要点',
          detail: '1. 纯电模式：感受NVH（静谧性）、动力响应、能量回收力度（是否可调）、刹车脚感（是否有CRBS制动回收的不线性）。\n2. 亏电/混动模式：感受发动机启动的震动和噪音是否明显、动力切换是否平顺、亏电油耗实际多少。\n3. 充电体验：看车机充电设置是否好用（预约充电、电量保持等）、充电速度是否符合标称。\n4. 辅助驾驶：高速和城市拥堵路况各试一段，看ACC、车道居中是否好用。\n5. 空间实用性：后排地台是否纯平、后备箱是否被电池侵占、充电口位置是否方便。'
        },
        suggestions: [
          '20万级混动SUV推荐试驾：比亚迪宋PLUS DM-i 110km旗舰型、吉利星越L Hi·P、长城魏牌拿铁DHT-PHEV、广汽传祺影酷混动，这几款代表了目前自主品牌混动的最高水平',
          '如果考虑合资混动：本田CR-V e:HEV、丰田RAV4荣放双擎、东风日产奇骏e-POWER，各有特色',
          '购买前算一笔账：纯电每年行驶里程×电价 vs 混动行驶里程×油价，看看多久能省回购车差价，里程越短越不划算',
          '家里能装充电桩→闭眼上插混/纯电；不能装充电桩→直接买不插电的油混，不要勉强买插混当油车开'
        ],
        warnings: [
          '不要只看厂家标称的纯电续航，那是CLTC工况，实际城市通勤打7-8折、高速打5-6折、冬季再打7折，都要考虑进去',
          '首任车主权益要问清楚：电池终身质保是否绑定首任车主、是否有每年行驶里程限制、过户后是否失效',
          '新能源车保险费用比同价位燃油车高（尤其是车损险），购车预算要把这个考虑进去'
        ]
      }
    ],
    nev2: [
      {
        category: 'nev',
        expert: 'nev',
        answer: '关于"纯电还是插混"这个终极问题，作为新能源技术专家，我的建议是：看你的使用场景。纯电动车适合有充电桩、长途出行少、主要城市通勤的用户，使用成本极低、驾驶体验极佳；插混适合有充电条件、偶尔跑长途、想兼顾纯电通勤和长途无忧的用户，是目前最全能的选择，但纯电续航版本要选够。如果你完全没有充电条件，就不要买任何插混或纯电，老老实实买不插电混动或燃油车。',
        principle: {
          title: '纯电BEV、插混PHEV、油混HEV、增程EREV技术路线对比',
          detail: '纯电（BEV）：只有电池+电机，完全靠充电行驶。优点：使用成本极低、驾驶体验最佳、零排放。缺点：续航焦虑、充电时间长、长途不便。\n\n插混（PHEV）：大容量电池+发动机+电机。纯电可行驶50-250km，没电了可以烧油。优点：可油可电、日常通勤0油耗、长途无忧。缺点：亏电油耗较高、系统复杂。\n\n增程（EREV）：类似PHEV，但发动机只发电不直驱车轮。优点：纯电体验更一致、NVH更好。缺点：高速油耗偏高、动力天花板低。\n\n油混（HEV）：小容量电池+发动机+电机，不能充电。优点：加油就用、比燃油省油30%-40%、无里程焦虑。缺点：不能纯电、不免税不绿牌。'
        },
        comparison: {
          title: '纯电BEV vs 插混PHEV 怎么选',
          items: [
            {
              optionA: '纯电动车（BEV）',
              advantageA: '使用成本最低（每公里5-10分电费）；驾驶体验最好（零震动、瞬时扭矩、无比换挡）；保养最便宜（基本不用保养）；智能化程度普遍更高；绿牌免购置税',
              optionB: '插电混动（PHEV）',
              advantageB: '无续航焦虑（可油可电，长途随便跑）；日常通勤纯电也很省钱；高速服务区不用排队等充电；大部分地区绿牌免购置税；车价比同级别纯电略低',
              suggestion: '充电方便、90%以上用车是城市通勤、每年长途少于5次→选纯电（建议续航500km+版本）；经常跑长途或充电条件一般、想一台车兼顾所有场景→选插混（建议纯电续航100km+版本）。如果你一台车要应对所有场景，插混是当前最稳妥的选择。'
            }
          ]
        },
        suggestions: [
          '纯电选购建议：优先选择续航500km以上的版本（CLTC），实际冬季城市通勤约300-350km，足够一周通勤；优先选择800V高压平台车型，充电速度快很多',
          '插混选购建议：纯电续航至少100km以上版本，50km版实际纯电只有30多公里，很快就没电了，意义不大',
          '如果家里只有一台车，强烈建议插混，长途出行的安心感是纯电无法比拟的',
          '如果家里有多台车，第二台买纯电通勤体验最好',
          '无论纯电还是插混，都建议买带快充接口的版本，应急时很有用'
        ],
        warnings: [
          '纯电长途出行前一定要规划好充电路线，节假日高速服务区充电桩排队是常态，预留充足时间',
          '纯电车型冬季续航打折严重，北方严寒地区如果没有私人充电桩，纯电使用体验会大打折扣',
          '插混车型如果长期亏电行驶，不仅油耗高，还会加速发动机磨损和积碳，尽量保证有一定电量行驶',
          '电池更换费用极高（通常5-15万），选购时务必确认电池质保政策，优先选择终身质保的车型'
        ],
        maintenanceTips: [
          '纯电车：每1-2万公里检查一次电池健康状态，平时尽量慢充为主，快充为辅；每月做一次满充满放校准电量',
          '混动车：和燃油车一样定期保养发动机部分（机油、机滤、空滤），三电系统按厂家要求检查即可',
          '所有新能源车：12V小电瓶亏电是通病，长期停放务必断开小电瓶负极或定期启动补电',
          '轮胎磨损比燃油车快（车重更大、扭矩更大），每2万公里检查轮胎花纹和四轮定位'
        ]
      }
    ]
  },
  chassis: {
    chassis: [
      {
        category: 'chassis',
        expert: 'chassis',
        answer: '作为底盘工程师，我来科普一下麦弗逊、双叉臂、多连杆这几种主流悬挂形式的区别。首先要说明：悬挂形式只是基础，真正决定驾驶质感的是厂家的调校功力。同样是麦弗逊，保时捷911的麦弗逊和10万元家用车的麦弗逊，实际表现天差地别。但形式决定了上限，双叉臂和多连杆的物理上限确实比麦弗逊更高。',
        principle: {
          title: '主流悬挂类型结构原理与特点',
          detail: '麦弗逊（McPherson）：由一个A型下摆臂+减振器支柱组成。结构最简单、占用空间最小、成本最低、响应速度快。缺点是侧向支撑不足、抗制动点头能力一般。多用于前悬挂，是家用车的主流选择。\n\n双叉臂（Double Wishbone）：由上下两个叉形摆臂组成。侧向支撑好、定位精准、轮胎贴地性好、抗侧倾能力强。缺点是结构复杂、成本高、占用空间大。多用于性能车、豪华车、硬派越野的前悬挂。\n\n多连杆（Multi-Link）：通常由3-5根控制臂组成。可以独立调节定位参数，兼顾舒适性和操控性，调校自由度最高。缺点是结构复杂、成本高、占用空间大。多用于后悬挂，豪华车和运动车型的标配。\n\n扭力梁（Torsion Beam）：非独立悬挂的一种，左右车轮通过一根扭转梁连接。结构简单、成本低、占用空间小（后排空间大）。缺点是舒适性差、操控极限低。多用于小型车、紧凑级车的后悬挂。'
        },
        comparison: {
          title: '麦弗逊 vs 双叉臂 vs 多连杆 对比分析',
          items: [
            {
              optionA: '前麦弗逊 + 后多连杆',
              advantageA: '目前最主流的家用车悬挂组合，兼顾成本、空间、舒适性和操控性；麦弗逊前悬节省发动机舱空间（适合横置前驱平台）；多连杆后悬舒适性和操控性都能兼顾',
              optionB: '前双叉臂 + 后多连杆',
              advantageB: '豪华车和性能车的标配组合，操控极限最高；双叉臂前悬侧向支撑好，过弯侧倾小、轮胎接地面积大；制动点头、加速抬头抑制好；高速稳定性出色',
              suggestion: '普通家用代步、追求性价比和空间→前麦弗逊+后多连杆完全够用，甚至后扭力梁如果调校得好（如标致雪铁龙）也不错；追求驾驶乐趣、经常激烈驾驶、购买豪华品牌或性能车→优先选择双叉臂/多连杆组合。但还是那句话，调校比形式重要，一定要试驾。'
            }
          ]
        },
        suggestions: [
          '试驾判断悬挂好坏：过减速带看是否有多余弹跳（好的悬挂应该是"咚"一下就过去，没有上下余震）；过井盖和坑洼看冲击是否生硬生硬；快速过弯看侧倾大小和回正是否线性；高速120km/h看方向是否发飘',
          '家用车选择：不用过度纠结悬挂形式，实际试驾感受比参数重要，很多调校优秀的麦弗逊+扭力梁组合，驾驶质感反而比调校差的多连杆更好',
          '购买二手车注意检查：过坑洼底盘是否有异响（球头、衬套老化）、过弯侧倾是否明显变大（减振器失效）、方向盘是否跑偏（四轮定位失准）',
          '改装误区：不要盲目降低车身、换硬避震、加大轮毂，家用车原厂调校是综合考虑了舒适性、耐用性、安全性的平衡，盲目改装往往得不偿失'
        ],
        warnings: [
          '"双叉臂一定比麦弗逊好"是误区，形式只是基础，材质、几何参数、调校功力才是关键，保时捷911用麦弗逊照样比很多双叉臂车型操控好',
          '硬派越野车的悬挂需求完全不同，需要大行程和可靠性，整体桥+钢板弹簧虽然简单，但越野性能远超独立悬挂',
          '悬挂有异响或跑偏一定要及时检查，小问题拖成大问题（如吃胎导致轮胎报废、球头脱落导致事故）维修代价很高',
          '不要用家用车去玩极限驾驶、漂移等，原厂底盘设计没有考虑这些工况，容易出安全事故'
        ],
        maintenanceTips: [
          '每2万公里或每年做一次四轮定位，尤其是经过颠簸路段多、经常上马路牙子的车辆',
          '每次保养检查平衡杆球头、下摆臂球头、转向拉杆球头是否有旷量，防尘套是否破损',
          '减振器检查：用力按压车头/车尾，松手后如果弹跳超过2次就说明减振器失效了，需要更换',
          '底盘衬套老化会导致底盘松散、异响，8-10万公里的车建议全面检查，老化了就换掉，底盘质感会恢复新车状态'
        ]
      }
    ]
  },
  maintenance: {
    maintenance: [
      {
        category: 'maintenance',
        expert: 'maintenance',
        answer: '作为从业18年的维修技师，我明确告诉你：出保后不一定要在4S店保养，但一定要选择靠谱的维修厂，并且使用符合厂家规格要求的配件和油品。《机动车维修管理规定》和《汽车三包规定》都明确了，车主有权选择在哪里保养，厂家和4S店不能以"不在本店保养"为由拒绝三包索赔。但前提是你要能证明保养是按照厂家要求规范进行的。',
        principle: {
          title: '4S店保养与正规修理厂保养的区别',
          detail: '4S店优点：配件原厂保真、流程规范、技师只修一个品牌经验丰富、维修记录联网可查、保修索赔方便。缺点：价格贵（通常是外面的1.5-2倍）、部分4S店喜欢推荐不必要的项目。\n\n正规修理厂优点：价格便宜、可以自己选配件、沟通方便效率高。缺点：配件质量参差不齐、技师水平差异大、维修记录不规范、如果需要三包索赔可能需要举证。\n\n关键提醒：国家法律规定"修车自由"，不在4S店保养不会脱保，但你需要保留好保养凭证（发票、配件清单、维修记录等）。'
        },
        suggestions: [
          '脱保后可以选择当地口碑好的连锁维修店（如途虎养车、京车会等），价格比4S店便宜，流程和配件也相对规范',
          '如果选择独立修理厂，一定要盯着换件，确认配件是正品，避免被换上副厂件或假冒伪劣配件',
          '无论在哪里保养，都严格按照厂家手册规定的项目和周期进行，不要提前过度保养，也不要延期',
          '机油选择：看厂家推荐的粘度等级和规格（如5W-30 SN级），同等级的大品牌全合成机油都可以，不必迷信原厂机油',
          '每次保养后索要并保留好：维修清单、配件合格证、付款发票，这些是你维权的重要凭证'
        ],
        warnings: [
          '警惕路边店的"超低价保养"，低价的背后往往是假冒伪劣机油和配件，反而伤车',
          '不要被4S店忽悠做不必要的项目：如发动机清洗、油路清洗、节气门清洗（2万公里内无需做）、空调杀菌等，这些大多是创收项目',
          '"终身免费保养"要仔细看合同：通常只含基础的机油机滤工时，其他项目还是要收费的，而且限制很多',
          '变速箱油、刹车油、防冻液、火花塞这些有明确更换周期的项目，到了里程就换，不要省这点钱，否则出问题维修代价更大'
        ],
        maintenanceTips: [
          '基础保养（机油+机滤）：5000-10000公里或6-12个月（以先到为准，看使用的机油等级）',
          '空气滤芯+空调滤芯：每1-2万公里更换，雾霾严重地区建议缩短周期',
          '汽油滤芯：外置式每3-4万公里，内置式每6-8万公里',
          '变速箱油：手动6-8万，自动4-8万（看厂家手册）',
          '刹车油：每2年或4万公里，制动液吸水性强，时间长了会影响制动效果',
          '防冻液：每2年或4万公里，长效防冻液可以5-6年',
          '火花塞：镍合金3万，铂金6万，铱金8-10万',
          '刹车片：3-6万公里，看驾驶习惯，每次保养检查厚度，低于3mm必须更换',
          '轮胎：3-5年或4-6万公里，看磨损和老化情况'
        ]
      }
    ]
  }
}

const generalAnswerBank: Record<string, AnswerResult[]> = {
  powertrain: [
    {
      category: 'general',
      expert: 'powertrain',
      answer: '作为动力系统专家，我来为你解答汽车动力相关的问题。现代汽车动力系统正处在燃油、混动、纯电多技术路线并存的变革时期，选择适合自己的动力形式需要结合使用场景、预算、个人偏好等多方面因素综合考虑。无论选择哪种，核心是理解其技术特点，合理使用和保养。',
      principle: {
        title: '汽车动力系统的基本构成与发展趋势',
        detail: '传统燃油车：发动机+变速箱，技术成熟、补能方便，但碳排放高。\n混动车：发动机+电机+电池，兼顾燃油车的便利和电动车的经济性，是当下很好的过渡方案。\n纯电车：电机+电池，零排放、使用成本低，但补能和续航仍是痛点。\n发展趋势：电动化是不可逆转的大趋势，但在未来10-20年内，多种动力形式仍将长期共存。'
      },
      suggestions: [
        '购车前先明确自己的核心需求：日常通勤还是长途为主？在意动力还是经济性？预算多少？',
        '动力参数不要只看峰值马力和扭矩，更要关注输出特性：最大扭矩转速区间、变速箱匹配、实际试驾感受',
        '无论哪种动力形式，定期保养、合理使用都是延长寿命的关键',
        '建议实际试驾多款候选车型，自己的驾驶感受比任何参数和评测都重要'
      ],
      warnings: [
        '不要盲目追求大马力，日常家用200匹以内完全够用，动力过剩只会增加油耗和用车成本',
        '三缸发动机的振动问题确实存在，但厂家都做了平衡措施，是否能接受建议亲自试驾感受',
        '新能源车型的续航标称值是实验室数据，实际使用要打7-8折，冬季再打7折'
      ]
    }
  ],
  review: [
    {
      category: 'general',
      expert: 'review',
      answer: '作为资深车评人，我的建议是：买车不要只看参数和营销话术，一定要亲自去试驾，多去几家4S店对比体验。适合别人的不一定适合你，每个人对空间、动力、舒适性、驾驶质感的感受和需求都不一样。',
      principle: {
        title: '消费者购车决策的正确思路',
        detail: '第一步：明确预算和核心需求（家用/代步/商务/玩车）。\n第二步：筛选3-5款候选车型，看口碑和长期质量反馈。\n第三步：逐一4S店试驾（一定要自己开，不要只坐副驾）。\n第四步：对比配置、价格、售后政策、优惠力度。\n第五步：理性决策，不要被销售的话术和短期优惠冲昏头脑。'
      },
      suggestions: [
        '买车前先去车主论坛、车友群看真实车主的长期使用反馈，尤其是质量问题和通病',
        '试驾尽量选择和自己日常用车环境相似的路段（城市拥堵、快速路、减速带等）',
        '不要买刚上市的全新车型，建议等半年到一年，优惠下来了，小问题也暴露得差不多了',
        '同一款车不同配置之间对比，选"次顶配"通常性价比最高'
      ],
      warnings: [
        '警惕"0首付""低月供"等金融陷阱，算清楚总利息和各种手续费',
        '购车合同要仔细看，所有口头承诺都要写在合同上，避免事后扯皮',
        '不要为了"面子"买超出自己预算的车，车贷+养车费用建议不超过家庭月收入的30%'
      ]
    }
  ],
  safety: [
    {
      category: 'general',
      expert: 'safety',
      answer: '作为汽车安全工程师，我始终认为：安全是汽车最基本也是最重要的品质，没有之一。购车时，安全配置应该是你最优先考虑的因素，而不是最后才考虑的"加分项"。很多安全配置你可能一辈子用不上，但一旦用上一次，就能挽救你的生命。',
      principle: {
        title: '汽车安全的基本概念和核心配置',
        detail: '被动安全：事故发生时保护乘员的配置——安全气囊（前排侧气帘非常重要）、高强度车身结构、安全带预紧、儿童座椅接口等。\n主动安全：预防事故发生的配置——ESP车身稳定系统（必选）、ABS防抱死、EBD制动力分配、TCS牵引力控制、AEB自动紧急制动、车道保持、盲区监测等。\n核心原则：主动安全优于被动安全——能避免事故的发生，才是最好的安全。'
      },
      suggestions: [
        '购车时安全配置的底线：ESP车身稳定+前排双气囊+侧气囊+侧气帘+胎压监测，这些建议必须有',
        '如果预算允许，尽量选择带主动安全配置的车型：AEB自动紧急制动、车道保持、盲区监测，这些配置在关键时刻真的能救命',
        '儿童安全座椅接口（ISOFIX）是标配，但很多家长不重视，12岁以下儿童乘车必须使用安全座椅，不要抱有侥幸心理',
        '定期检查车况：轮胎（花纹深度、胎压）、刹车（刹车片厚度、刹车油）、灯光，这些日常的小检查关乎行车安全'
      ],
      warnings: [
        '不要迷信"车重就安全""钢板厚就安全"，现代汽车安全靠的是车身结构设计和材料强度，而不是简单的重量和厚度',
        'SUV不等于更安全，SUV车身高重心高，操控极限反而比轿车低，更容易侧翻',
        '安全气囊不是越多越好，关键是气囊的点位是否合理、触发逻辑是否正确，但基本的前排双气囊+侧气囊+侧气帘一定要有',
        '所有安全配置都是辅助，最关键的安全配置是驾驶员自己——遵守交通规则、不酒驾、不超速、不疲劳驾驶，这才是真正的安全'
      ]
    }
  ]
}

const selectedCategory = ref('engine')
const questionDescription = ref('')
const selectedExpert = ref('')
const isGenerating = ref(false)
const generatedResult = ref<AnswerResult | null>(null)
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const currentStep = computed(() => {
  if (generatedResult.value && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (questionDescription.value) return 1
  if (selectedCategory.value) return 0
  return 0
})

const canGenerate = computed(() => {
  return questionDescription.value.trim().length > 10
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const getCategoryLabel = (v: string) => questionCategories.find(c => c.value === v)?.label || v
const getExpertLabel = (v: string) => expertFields.find(s => s.value === v)?.label || '智能匹配'
const getExpertColor = (v: string) => expertFields.find(s => s.value === v)?.color || '#165DFF'

const applySample = (sample: QuickSample) => {
  selectedCategory.value = sample.category
  questionDescription.value = sample.description
  if (sample.expert) selectedExpert.value = sample.expert
  ElMessage.success('已载入示例问题')
}

const toggleExpert = (value: string) => {
  selectedExpert.value = selectedExpert.value === value ? '' : value
}

const truncateText = (text: string, maxLen: number) => {
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen) + '...'
}

const formatTime = (time: string) => {
  const d = new Date(time)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const generateAnswer = () => {
  if (!canGenerate.value) {
    ElMessage.warning('请先详细描述你的问题（至少10个字以上）')
    return
  }

  isGenerating.value = true
  generatedResult.value = null

  setTimeout(() => {
    const category = selectedCategory.value
    let expert = selectedExpert.value
    if (!expert) {
      const expertKeys = Object.keys(generalAnswerBank)
      expert = expertKeys[Math.floor(Math.random() * expertKeys.length)]
    }

    let result: AnswerResult

    const categoryBank = knowledgeBank[category]
    if (categoryBank && categoryBank[expert] && categoryBank[expert].length > 0) {
      result = categoryBank[expert][Math.floor(Math.random() * categoryBank[expert].length)]
    } else {
      const expert2 = expert
      const firstExpert = expertFields[0]?.value || 'powertrain'
      if (categoryBank && categoryBank[firstExpert] && categoryBank[firstExpert].length > 0) {
        result = categoryBank[firstExpert][Math.floor(Math.random() * categoryBank[firstExpert].length)]
      } else {
        const generalResults = generalAnswerBank[expert2] || generalAnswerBank.powertrain || generalAnswerBank.review
        result = generalResults ? generalResults[Math.floor(Math.random() * generalResults.length)] : {
          category: 'general',
          expert: expert2,
          answer: '感谢你的提问，这是一个很好的问题。由于该问题涉及的具体情况较为复杂，建议你提供更多细节信息，或咨询相关领域的专业人士以获得更准确的解答。',
          principle: { title: '汽车技术概述', detail: '汽车技术涉及多个专业领域，建议针对具体问题咨询对应领域的专家。' },
          suggestions: ['建议提供更详细的车型信息、使用场景和具体症状，以便获得更有针对性的解答。']
        }
      }
    }

    const personalizedResult: AnswerResult = {
      ...result,
      category,
      expert,
      answer: result.answer + `\n\n针对你提出的「${truncateText(questionDescription.value, 30)}...」这一问题，以上专业解答供你参考。`,
      principle: {
        ...result.principle,
        detail: `你描述的情况是：「${questionDescription.value.substring(0, 60)}${questionDescription.value.length > 60 ? '...' : ''}」\n\n` + result.principle.detail
      }
    }

    generatedResult.value = personalizedResult

    const historyItem: HistoryItem = {
      category,
      expert,
      description: questionDescription.value,
      result: personalizedResult,
      time: new Date().toISOString()
    }
    history.value.push(historyItem)
    saveHistory()

    isGenerating.value = false
    ElMessage.success('专家解答已生成，请查看')
  }, 2000)
}

const resetAll = () => {
  selectedCategory.value = 'engine'
  questionDescription.value = ''
  selectedExpert.value = ''
  generatedResult.value = null
  ElMessage.info('已重置')
}

const copyResult = () => {
  if (!generatedResult.value) return
  const r = generatedResult.value
  let text = `【${getExpertLabel(r.expert)}专业解答】\n\n💡 专业解答：\n${r.answer}\n\n⚙️ 原理解析：${r.principle.title}\n${r.principle.detail}`
  if (r.comparison && r.comparison.items && r.comparison.items.length > 0) {
    text += `\n\n📊 ${r.comparison.title}：`
    r.comparison.items.forEach((c, i) => {
      text += `\n\n对比${i + 1}：\n【${c.optionA}】${c.advantageA}\n【${c.optionB}】${c.advantageB}\n选择建议：${c.suggestion}`
    })
  }
  text += `\n\n🎯 实用建议：\n${r.suggestions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`
  if (r.warnings && r.warnings.length > 0) {
    text += `\n\n⚠️ 注意事项：\n${r.warnings.map((w, i) => `${i + 1}. ${w}`).join('\n')}`
  }
  if (r.maintenanceTips && r.maintenanceTips.length > 0) {
    text += `\n\n🔧 保养维护小贴士：\n${r.maintenanceTips.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
  }
  text += '\n\n⚠️ 免责声明：以上内容仅供学习参考，不构成任何维修、诊断、购车决策建议。涉及行车安全的问题请及时联系专业技师。'
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制全部内容')
  })
}

const clearHistory = () => {
  history.value = []
  saveHistory()
  ElMessage.success('历史记录已清空')
}

const loadFromHistory = (item: HistoryItem) => {
  selectedCategory.value = item.category
  selectedExpert.value = item.expert
  questionDescription.value = item.description
  generatedResult.value = item.result
  ElMessage.success('已载入历史记录')
}

const saveHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

const loadHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      history.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.car-knowledge-advisor {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-card {
  background: linear-gradient(135deg, #eef5ff 0%, #ffffff 100%);
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
}

.intro-icon {
  font-size: 48px;
  line-height: 1;
}

.intro-text h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #303133;
}

.intro-subtitle {
  margin: 0;
  color: #606266;
  line-height: 1.6;
  max-width: 600px;
}

.intro-badges {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.intro-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #303133;
  font-weight: 600;
  margin: 0;
}

.category-tags {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.category-tag {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #ebeef5;
  transition: all 0.3s;
}

.category-tag:hover {
  border-color: #165DFF;
  box-shadow: 0 2px 12px 0 rgba(22, 93, 255, 0.1);
}

.ct-emoji {
  font-size: 24px;
}

.ct-name {
  font-weight: 600;
  color: #303133;
}

.ct-desc {
  font-size: 12px;
  color: #909399;
}

.expert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.expert-card {
  border-radius: 8px;
  background: #fff;
  border: 2px solid;
  overflow: hidden;
  transition: all 0.3s;
}

.expert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.expert-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  color: #fff;
  font-weight: 600;
}

.expert-emoji {
  font-size: 18px;
}

.expert-quote {
  padding: 12px;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  font-style: italic;
}

.expert-background {
  padding: 0 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #909399;
}

.bg-label {
  font-weight: 600;
  color: #606266;
}

.expert-divider {
  margin: 10px 12px;
}

.expert-boundaries {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 12px 12px;
}

.boundary-col {
  font-size: 12px;
}

.boundary-col-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 6px;
}

.boundary-col ul {
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.boundary-col li {
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
}

.boundary-suitable .boundary-col-title {
  color: #67c23a;
}

.boundary-unsuitable .boundary-col-title {
  color: #f56c6c;
}

.guide-steps {
  margin-bottom: 16px;
}

.expectation-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.expectation-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.expectation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.expectation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f5f7fa;
}

.exp-text {
  display: flex;
  flex-direction: column;
}

.exp-num {
  font-weight: 600;
  color: #303133;
}

.exp-label {
  font-size: 12px;
  color: #909399;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.card-header .el-tag {
  margin-left: auto;
}

.header-actions {
  margin-left: auto;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.hint-tag {
  margin-left: 8px;
}

.required-tag {
  color: #f56c6c;
  margin-left: 4px;
}

.question-category-section {
  margin-bottom: 24px;
}

.category-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid #ebeef5;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.category-card:hover:not(.disabled) {
  border-color: #165DFF;
  background: #ecf5ff;
}

.category-card.active {
  border-color: #165DFF;
  background: #ecf5ff;
}

.category-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.category-emoji {
  font-size: 32px;
}

.category-name {
  font-weight: 600;
  color: #303133;
}

.category-desc {
  font-size: 12px;
  color: #909399;
}

.input-section {
  margin-bottom: 24px;
}

.quick-samples {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.sample-label {
  font-size: 13px;
  color: #606266;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.sample-tag:hover {
  background: #ecf5ff;
  border-color: #165DFF;
  color: #165DFF;
}

.expert-section {
  margin-bottom: 24px;
}

.expert-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.expert-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.expert-chip:hover:not(.disabled) {
  transform: translateY(-1px);
}

.expert-chip.active {
  color: #fff;
}

.expert-chip.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.chip-emoji {
  font-size: 16px;
}

.action-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.generate-btn {
  min-width: 200px;
}

.btn-loading-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.generating-status {
  margin-top: 20px;
  padding: 16px;
  background: #f0f9eb;
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
  background: #67c23a;
  animation: bounce 1.4s infinite ease-in-out both;
}

.generating-dots .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.generating-dots .dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.generating-text {
  color: #67c23a;
  font-size: 14px;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.result-section {
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
  border: 1px solid #ebeef5;
  position: relative;
}

.section-icon {
  position: absolute;
  top: -12px;
  left: 20px;
  font-size: 24px;
  background: #fff;
  padding: 0 8px;
}

.result-section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding-left: 36px;
}

.answer-text {
  font-size: 15px;
  line-height: 1.8;
  color: #303133;
  white-space: pre-wrap;
  padding: 16px;
  background: #eef5ff;
  border-left: 4px solid #165DFF;
  border-radius: 0 8px 8px 0;
}

.principle-content {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.principle-title {
  font-size: 16px;
  font-weight: 600;
  color: #165DFF;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.principle-detail {
  font-size: 14px;
  line-height: 1.8;
  color: #606266;
  white-space: pre-wrap;
}

.compare-card {
  padding: 16px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 12px;
}

.compare-card:last-child {
  margin-bottom: 0;
}

.compare-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.compare-row:last-child {
  margin-bottom: 0;
}

.compare-label {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 90px;
  font-weight: 600;
  font-size: 13px;
  color: #303133;
  flex-shrink: 0;
}

.compare-label-a {
  color: #e74c3c;
}

.compare-label-b {
  color: #2980b9;
}

.compare-content {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  flex: 1;
}

.compare-suggestion .compare-label {
  color: #165DFF;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  border-left: 3px solid #165DFF;
}

.suggestion-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #165DFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.suggestion-content {
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.warning-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  background: #fef0f0;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
}

.maintenance-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.maintenance-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  background: #f0f9eb;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
}

.result-disclaimer {
  margin-top: 8px;
}

.disclaimer-title {
  font-size: 15px;
  font-weight: 600;
  color: #e6a23c;
}

.disclaimer-content {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.7;
}

.disclaimer-content p {
  margin: 0 0 10px 0;
  color: #303133;
}

.disclaimer-content strong {
  color: #e6a23c;
}

.disclaimer-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.disclaimer-list li {
  color: #606266;
  font-size: 13px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #ebeef5;
}

.history-item:hover {
  background: #f5f7fa;
  border-color: #165DFF;
}

.history-time {
  font-size: 12px;
  color: #909399;
  min-width: 80px;
}

.history-question {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.history-text {
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-meta {
  flex-shrink: 0;
}

.history-footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.boundary-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.boundary-alert {
  margin-bottom: 8px;
}

.boundary-alert :deep(.el-alert__title) {
  font-weight: 600;
  font-size: 15px;
}

.boundary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.boundary-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.boundary-do {
  background: #f0f9eb;
  border-color: #e1f3d8;
}

.boundary-dont {
  background: #fef0f0;
  border-color: #fde2e2;
}

.boundary-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.boundary-content {
  flex: 1;
}

.boundary-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: #303133;
}

.boundary-list {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.boundary-list li {
  font-size: 13px;
  line-height: 1.5;
  color: #606266;
}

.boundary-tips {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fdf6ec;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  color: #606266;
}

.boundary-tips strong {
  color: #e6a23c;
}

.expert-alert {
  margin-bottom: 12px;
}

.expert-card-detailed {
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.expert-title-inline {
  font-size: 12px;
  opacity: 0.85;
  font-weight: 400;
}
</style>