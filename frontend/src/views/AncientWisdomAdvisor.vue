<template>
  <div class="ancient-wisdom-advisor">
    <el-card class="intro-card">
      <div class="intro-header">
        <div class="intro-left">
          <div class="intro-icon">🏮</div>
          <div class="intro-text">
            <h2 class="intro-title">古人处世智慧解答</h2>
            <p class="intro-subtitle">
              身处现代快节奏生活中感到迷茫？让先贤智者为你指点迷津。以孔孟老庄、诸子百家的千年智慧，化解你当下的人际、职场、家庭与人生抉择困惑
            </p>
          </div>
        </div>
        <div class="intro-badges">
          <el-tag type="primary" effect="dark" size="large">📜 {{ wisdomSchools.length }} 家智慧流派</el-tag>
          <el-tag type="success" effect="dark" size="large">🧘 千年智慧沉淀</el-tag>
        </div>
      </div>
      <el-divider />
      <div class="intro-sections">
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><User /></el-icon>
            适用困境类型
          </h4>
          <div class="dilemma-tags">
            <div
              v-for="cat in dilemmaCategories"
              :key="cat.value"
              class="dilemma-tag"
            >
              <span class="dt-emoji">{{ cat.emoji }}</span>
              <span class="dt-name">{{ cat.label }}</span>
              <span class="dt-desc">{{ cat.desc }}</span>
            </div>
          </div>
        </div>
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><Collection /></el-icon>
            智慧流派一览（含适用边界）
          </h4>
          <el-alert
            type="info"
            :closable="false"
            show-icon
            title="各家智慧产生于特定历史语境，各有侧重与局限"
            description="请根据具体情境灵活参考，切勿生搬硬套"
            class="school-alert"
          />
          <div class="school-grid">
            <div
              v-for="school in wisdomSchools"
              :key="school.value"
              class="school-card school-card-detailed"
              :style="{ borderColor: school.color }"
            >
              <div class="school-header" :style="{ backgroundColor: school.color }">
                <span class="school-emoji">{{ school.emoji }}</span>
                <span class="school-name">{{ school.label }}</span>
                <span class="school-sage-inline">· {{ school.sage }}</span>
              </div>
              <div class="school-quote">"{{ school.quote }}"</div>
              <div class="school-background">
                <span class="bg-label">历史背景：</span>
                <span class="bg-text">{{ school.background }}</span>
              </div>
              <el-divider class="school-divider" />
              <div class="school-boundaries">
                <div class="boundary-col boundary-suitable">
                  <div class="boundary-col-title">
                    <el-icon color="#67c23a"><CircleCheck /></el-icon>
                    <span>适合参考</span>
                  </div>
                  <ul>
                    <li v-for="(s, i) in school.suitable" :key="i">{{ s }}</li>
                  </ul>
                </div>
                <div class="boundary-col boundary-unsuitable">
                  <div class="boundary-col-title">
                    <el-icon color="#f56c6c"><CircleClose /></el-icon>
                    <span>不宜直接套用</span>
                  </div>
                  <ul>
                    <li v-for="(u, i) in school.unsuitable" :key="i">{{ u }}</li>
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
        <el-step title="选择困境类型" description="人际关系 / 职场处境 / 家庭矛盾 / 人生抉择" />
        <el-step title="描述你的困惑" description="将困扰你的事情详细描述" />
        <el-step title="选择智慧视角" description="儒家 / 道家 / 法家 / 佛家 / 兵家" />
        <el-step title="获得智慧解答" description="典故 + 格言 + 现代解读 + 行动建议" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Document /></el-icon>
            <div class="exp-text">
              <div class="exp-num">先贤智慧解答</div>
              <div class="exp-label">从古人视角重新审视你的困境</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">相关典故引用</div>
              <div class="exp-label">历史故事中的相似案例</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Star /></el-icon>
            <div class="exp-text">
              <div class="exp-num">经典格言金句</div>
              <div class="exp-label">诸子百家名言智慧结晶</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Promotion /></el-icon>
            <div class="exp-text">
              <div class="exp-num">现代落地建议</div>
              <div class="exp-label">可操作的行动方案</div>
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
          title="古人智慧源自特定历史语境，绝非万能药方"
          description="以下边界说明，请务必认真阅读"
          class="boundary-alert"
        />
        <div class="boundary-grid">
          <div class="boundary-item boundary-do">
            <div class="boundary-icon">✅</div>
            <div class="boundary-content">
              <div class="boundary-title">适合参考的场景</div>
              <ul class="boundary-list">
                <li>需要换个视角审视问题时，打破思维定式</li>
                <li>心态调整、情绪平复、人生方向的哲学思考</li>
                <li>人际关系中「道」的层面：原则、格局、胸怀</li>
                <li>重大决策前的冷静思考与自我反省</li>
                <li>作为多种参考意见之一，结合实际情况综合判断</li>
              </ul>
            </div>
          </div>
          <div class="boundary-item boundary-dont">
            <div class="boundary-icon">❌</div>
            <div class="boundary-content">
              <div class="boundary-title">不建议直接套用的场景</div>
              <ul class="boundary-list">
                <li>涉及法律纠纷、劳动仲裁等需专业法律意见的问题</li>
                <li>严重心理疾病、抑郁倾向等需专业医疗干预的情况</li>
                <li>现代企业管理中的具体制度、合同、财务决策</li>
                <li>紧急突发事件（如安全事故、危机公关）需要立即响应时</li>
                <li>涉及医疗诊断、投资理财等高风险专业领域</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="boundary-tips">
          <el-icon color="#e6a23c"><InfoFilled /></el-icon>
          <span>
            <strong>核心原则：</strong>
            古人智慧提供的是「心法」与「思路」，而非「操作手册」。
            古代社会结构（宗法制度、等级秩序、农耕经济）与现代社会（法治、平等、市场经济）存在根本差异。
            请将先贤教诲作为启发思考的参照，结合你的具体处境、法律规范、专业意见，做出最适合自己的判断与选择。
            如遇重大决策或心理困扰，强烈建议寻求专业人士帮助。
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
          <span>智慧咨询</span>
          <el-tag size="small" type="warning">聆听先贤教诲</el-tag>
        </div>
      </template>

      <div class="dilemma-category-section">
        <div class="section-title">
          <el-icon><Grid /></el-icon>
          <span>选择困境类型</span>
          <el-tag size="small" type="info" class="hint-tag">
            选择最贴近你处境的类别，智慧解答将更有针对性
          </el-tag>
        </div>
        <div class="category-options">
          <div
            v-for="cat in dilemmaCategories"
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
          <span>描述你的困惑</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="dilemmaDescription"
          type="textarea"
          :rows="6"
          placeholder="请详细描述你当前面临的困境，包括：&#10;例如：「在公司工作三年，一直勤恳但不被领导重视，新来的同事却晋升比我快，我感到不公平，又不知道该怎么办」&#10;例如：「和婆婆生活习惯差异大，经常因为小事吵架，不知道该怎么处理婆媳关系」&#10;例如：「在两个工作机会之间纠结，一个稳定但发展有限，一个有挑战但风险高，不知如何抉择」"
          maxlength="1000"
          show-word-limit
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
            {{ sample.label }}
          </el-tag>
        </div>
      </div>

      <div class="school-section">
        <div class="section-title">
          <el-icon><Star /></el-icon>
          <span>选择智慧流派（可选，不选则综合推荐）</span>
          <el-tag size="small" type="info" class="hint-tag">
            不同流派会从不同视角解读你的困境
          </el-tag>
        </div>
        <div class="school-options">
          <div
            v-for="school in wisdomSchools"
            :key="school.value"
            class="school-chip"
            :class="{ active: selectedSchool === school.value, disabled: isGenerating }"
            :style="selectedSchool === school.value ? { backgroundColor: school.color, borderColor: school.color, color: '#fff' } : { borderColor: school.color, color: school.color }"
            @click="!isGenerating && toggleSchool(school.value)"
          >
            <span class="chip-emoji">{{ school.emoji }}</span>
            <span class="chip-label">{{ school.label }}</span>
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
          @click="generateAdvice"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              先贤智者正在为你参悟玄机…
            </span>
          </template>
          请智者开示
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
          💡 正在翻阅古籍经典，寻觅相似历史典故，参悟其中智慧…
        </span>
      </div>
    </el-card>

    <el-card v-if="generatedResult" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>智慧开示</span>
          <el-tag
            size="small"
            effect="dark"
            :style="{ backgroundColor: getSchoolColor(selectedSchool || generatedResult.school), color: '#fff' }"
          >
            {{ getSchoolLabel(selectedSchool || generatedResult.school) }}视角
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
        <div class="result-section wisdom-main">
          <div class="section-icon">📜</div>
          <h3 class="result-section-title">智者开示</h3>
          <div class="wisdom-text">{{ generatedResult.wisdom }}</div>
        </div>

        <div class="result-section quote-section">
          <div class="section-icon">💬</div>
          <h3 class="result-section-title">经典格言</h3>
          <div class="quote-block">
            <div class="quote-content">"{{ generatedResult.quote.text }}"</div>
            <div class="quote-source">—— {{ generatedResult.quote.source }}</div>
          </div>
          <div class="quote-explanation">
            <span class="exp-label">释义：</span>
            <span class="exp-text">{{ generatedResult.quote.meaning }}</span>
          </div>
        </div>

        <div class="result-section allusion-section">
          <div class="section-icon">📖</div>
          <h3 class="result-section-title">相关典故</h3>
          <div class="allusion-title">
            <div class="allusion-name">{{ generatedResult.allusion.title }}</div>
            <div class="allusion-story">{{ generatedResult.allusion.story }}</div>
            <div class="allusion-lesson">
              <span class="lesson-label">启示：</span>
              <span class="lesson-text">{{ generatedResult.allusion.lesson }}</span>
            </div>
          </div>
        </div>

        <div class="result-section modern-section">
          <div class="section-icon">🔮</div>
          <h3 class="result-section-title">现代解读</h3>
          <div class="modern-text">{{ generatedResult.modernInterpretation }}</div>
        </div>

        <div v-if="generatedResult.historicalContext" class="result-section history-context-section">
          <div class="section-icon">🏛️</div>
          <h3 class="result-section-title">历史背景说明</h3>
          <el-alert
            type="info"
            :closable="false"
            show-icon
            class="history-context-alert"
          >
            <template #title>
              <span class="context-title">重要：此智慧产生于以下历史语境</span>
            </template>
            <span class="context-text">{{ generatedResult.historicalContext }}</span>
          </el-alert>
        </div>

        <div v-if="generatedResult.modernValuesComparison && generatedResult.modernValuesComparison.length > 0" class="result-section values-compare-section">
          <div class="section-icon">⚖️</div>
          <h3 class="result-section-title">古今价值观对照（请特别注意）</h3>
          <div class="compare-header-tip">
            <el-icon color="#e6a23c"><WarningFilled /></el-icon>
            <span>古人智慧植根于特定历史社会结构，与现代价值观可能存在差异，以下对照帮你辨析</span>
          </div>
          <div
            v-for="(comp, idx) in generatedResult.modernValuesComparison"
            :key="idx"
            class="compare-card"
          >
            <div class="compare-row compare-ancient">
              <div class="compare-label">
                <el-icon><Document /></el-icon>
                <span>古人视角</span>
              </div>
              <div class="compare-content">{{ comp.ancientView }}</div>
            </div>
            <div class="compare-arrow">↓ 对照 ↓</div>
            <div class="compare-row compare-modern">
              <div class="compare-label">
                <el-icon><TrendCharts /></el-icon>
                <span>现代视角</span>
              </div>
              <div class="compare-content">{{ comp.modernView }}</div>
            </div>
            <div class="compare-row compare-suggestion">
              <div class="compare-label">
                <el-icon color="#165DFF"><MagicStick /></el-icon>
                <span>融合建议</span>
              </div>
              <div class="compare-content">{{ comp.suggestion }}</div>
            </div>
          </div>
        </div>

        <div class="result-section action-section-result">
          <div class="section-icon">🎯</div>
          <h3 class="result-section-title">行动建议</h3>
          <div class="action-list">
            <div
              v-for="(action, index) in generatedResult.actions"
              :key="index"
              class="action-item"
            >
              <div class="action-num">{{ index + 1 }}</div>
              <div class="action-content">{{ action }}</div>
            </div>
          </div>
          </div>

        <div class="result-section mindset-section">
          <div class="section-icon">🌿</div>
          <h3 class="result-section-title">心境寄语</h3>
          <div class="mindset-text">{{ generatedResult.mindset }}</div>
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
              <strong>本功能提供的所有智慧解答、格言典故、行动建议均基于古人历史智慧的整理与解读，仅供参考与启发思考之用，不构成任何专业意见。</strong>
            </p>
            <ul class="disclaimer-list">
              <li>涉及法律、财务、医疗、心理等专业领域的问题，请务必咨询持证专业人士</li>
              <li>古代智慧产生于宗法等级社会，与现代法治平等社会存在本质差异，不可生搬硬套</li>
              <li>所有建议请结合自身实际情况、法律法规、公序良俗综合判断，自行承担决策后果</li>
              <li>如您正在经历严重情绪困扰、心理危机或人身安全威胁，请立即拨打当地心理援助热线或报警求助</li>
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
          <div class="history-dilemma">
            <el-tag size="small" type="info">{{ getCategoryLabel(item.category) }}</el-tag>
            <span class="history-text">{{ truncateText(item.description, 40) }}</span>
          </div>
          <div class="history-meta">
            <el-tag size="small" effect="dark" :style="{ backgroundColor: getSchoolColor(item.school), color: '#fff' }">
              {{ getSchoolLabel(item.school) }}
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
  User,
  MagicStick,
  Refresh,
  Loading,
  Finished,
  CopyDocument,
  Clock,
  InfoFilled,
  Document,
  Star,
  Promotion,
  EditPen,
  Grid,
  Collection,
  WarningFilled,
  CircleCheck,
  CircleClose,
  TrendCharts
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface AdviceResult {
  category: string
  school: string
  wisdom: string
  quote: {
    text: string
    source: string
    meaning: string
  }
  allusion: {
    title: string
    story: string
    lesson: string
  }
  modernInterpretation: string
  actions: string[]
  mindset: string
  historicalContext?: string
  modernValuesComparison?: {
    ancientView: string
    modernView: string
    suggestion: string
  }[]
}

interface HistoryItem {
  category: string
  school: string
  description: string
  result: AdviceResult
  time: string
}

interface QuickSample {
  label: string
  category: string
  description: string
  school?: string
}

const STORAGE_KEY = 'ancient_wisdom_history'

const dilemmaCategories = [
  {
    value: 'workplace',
    label: '职场处境',
    emoji: '💼',
    desc: '职场人际、晋升竞争、同事关系、领导相处'
  },
  {
    value: 'relationship',
    label: '人际关系',
    emoji: '🤝',
    desc: '朋友相处、社交困境、人情世故、沟通障碍'
  },
  {
    value: 'family',
    label: '家庭矛盾',
    emoji: '🏠',
    desc: '婆媳关系、夫妻沟通、亲子教育、家庭纷争'
  },
  {
    value: 'choice',
    label: '人生抉择',
    emoji: '🧭',
    desc: '职业选择、人生方向、重大决策、进退取舍'
  },
  {
    value: 'emotion',
    label: '情绪疏导',
    emoji: '💆',
    desc: '焦虑压力、迷茫困惑、情绪调节、心态调整'
  }
]

const wisdomSchools = [
  {
    value: 'rujia',
    label: '儒家',
    emoji: '📜',
    color: '#8B4513',
    sage: '孔子',
    quote: '己所不欲，勿施于人',
    background: '源于周代礼乐制度，以伦理道德为核心，强调修身齐家治国平天下的入世哲学',
    suitable: [
      '人际关系中的品德修养、诚信待人',
      '职场中责任感、敬业精神的建立',
      '家庭伦理、孝悌之道的思考',
      '需要反求诸己、自我反省时'
    ],
    unsuitable: [
      '需要直接竞争、利益博弈的商业谈判',
      '面对恶意伤害需要强硬反击时',
      '现代法治社会中的权益维护（不能寄望于"以德报怨"）',
      '需要快速决策、效率优先的紧急事务'
    ]
  },
  {
    value: 'daojia',
    label: '道家',
    emoji: '☯️',
    color: '#2E8B57',
    sage: '老子',
    quote: '上善若水，水善利万物而不争',
    background: '崇尚自然无为，主张顺应规律、以柔克刚，追求精神自由与超越',
    suitable: [
      '心态调整、缓解焦虑、接受无法改变的现实',
      '需要韬光养晦、积蓄力量的蛰伏期',
      '处理需要"以退为进""以柔克刚"的复杂局面',
      '对人生意义、生命本质的哲学思考'
    ],
    unsuitable: [
      '需要主动出击、积极争取的机会窗口',
      '必须明确表态、承担责任的关键时刻',
      '现代职场中完全"不争"可能导致被边缘化',
      '涉及具体项目管理、目标达成的执行层面'
    ]
  },
  {
    value: 'fojia',
    label: '佛家',
    emoji: '🪷',
    color: '#DAA520',
    sage: '释迦牟尼',
    quote: '一切有为法，如梦幻泡影',
    background: '源于古印度，强调因果、空性、慈悲，追求解脱烦恼的心灵修行',
    suitable: [
      '面对失去、痛苦、无常时的心灵慰藉',
      '需要放下执念、减少欲望时的自我调节',
      '培养慈悲心、同理心、宽容品格',
      '对自我欲望、情绪根源的深度观照'
    ],
    unsuitable: [
      '需要采取实际行动解决现实问题时（不能仅靠"放下"）',
      '面对不公、伤害需要维护正当权益时',
      '现实目标的规划与执行层面',
      '抑郁症等严重心理疾病（佛学智慧不能替代专业治疗）'
    ]
  },
  {
    value: 'fajia',
    label: '法家',
    emoji: '⚖️',
    color: '#4682B4',
    sage: '韩非子',
    quote: '法不阿贵，绳不挠曲',
    background: '主张以法治国，强调法、术、势结合，注重制度建设与务实功利',
    suitable: [
      '团队管理中的制度建设、规则制定',
      '需要理性分析、不讲情面的问题处理',
      '组织流程优化、权责清晰化',
      '需要按规则办事、杜绝人情干扰时'
    ],
    unsuitable: [
      '处理家庭、亲密关系等情感主导的场合',
      '需要人情味、灵活性的日常人际交往',
      '教育子女时过度强调"奖惩"可能伤害感情',
      '朋友相处中过于功利算计会破坏关系'
    ]
  },
  {
    value: 'bingjia',
    label: '兵家',
    emoji: '⚔️',
    color: '#B22222',
    sage: '孙子',
    quote: '知己知彼，百战不殆',
    background: '源于春秋战国战争实践，研究战略战术、敌我形势，强调谋定后动',
    suitable: [
      '商业竞争、市场布局等战略层面的思考',
      '需要分析形势、权衡利弊的重大决策',
      '谈判策略、资源博弈中的战术运用',
      '项目风险管理、预案制定'
    ],
    unsuitable: [
      '与家人朋友相处时把对方当"对手"来算计',
      '恋爱婚姻等亲密关系中使用"兵法谋略"',
      '日常人际交往过于工于心计会失去真心',
      '合作共赢场景下零和博弈思维会适得其反'
    ]
  }
]

const quickSamples: QuickSample[] = [
  {
    label: '勤恳却不被重用',
    category: 'workplace',
    description: '我在公司工作三年，一直兢兢业业，但领导好像一直不重视我，新来的同事能力不如我却晋升更快，我感到很不公平，又不知道该怎么办，是继续隐忍还是主动争取？'
  },
  {
    label: '婆媳关系难处',
    category: 'family',
    description: '结婚后和婆婆住在一起，生活习惯差异很大，经常因为带孩子、做家务这些小事产生摩擦，老公夹在中间也很为难，不知道该怎么处理这种关系。'
  },
  {
    label: '稳定还是冒险',
    category: 'choice',
    description: '现在有两个工作机会摆在面前：一个是当前熟悉稳定，发展空间有限但压力小；另一个是新领域有挑战，风险高但潜力大，30岁了不知该如何抉择。'
  },
  {
    label: '朋友渐行渐远',
    category: 'relationship',
    description: '多年的好朋友最近好像和我渐行渐远，约他也不出来，聊天也很敷衍，我不知道是不是哪里得罪了他，还是友谊该继续维系还是顺其自然？'
  },
  {
    label: '焦虑迷茫',
    category: 'emotion',
    description: '最近总感觉很焦虑，工作没动力，生活没方向，每天忙忙碌碌却不知道在忙什么，对未来感到迷茫，不知道人活着到底是为了什么？'
  }
]

const wisdomBank: Record<string, Record<string, AdviceResult[]>> = {
  workplace: {
    rujia: [
      {
        category: 'workplace',
        school: 'rujia',
        wisdom: '君子务本，本立而道生。在职场中，勤恳本身即是最大的智慧。你当下的困惑，源于将目光放在了他人的晋升与比较上，而忘却了自身修养的根本。孔子曰："不患人之不己知，患其不能也。"不必忧虑领导不赏识你，真正该忧虑的是自己能力是否足够。儒家讲"修身齐家治国平天下"，修身是第一步。将注意力放回自我提升上，花若盛开，蝴蝶自来。领导的眼睛或许暂时被浮云遮蔽，但金子的光芒终会被看见。即便此处不识君，自有识君处。',
        quote: {
          text: '不患无位，患所以立。不患莫己知，求为可知也。',
          source: '《论语·里仁》',
          meaning: '不要担心没有职位，应该担心自己有没有足以胜任职务的能力。不要担心没有人知道自己，应该去追求能够使自己值得被人知道的本领。'
        },
        allusion: {
          title: '诸葛亮躬耕陇亩',
          story: '诸葛亮隐居隆中，躬耕于南阳田野之间，虽有经天纬地之才，却不急于出仕。他博览群书，静观天下大势，等待明主。此时的他，没有因为怀才不遇的焦虑，而是日日修身养性，研究兵法谋略。刘备三顾茅庐之时，他已胸有成竹，隆中对纵论天下大势，为刘备谋划三分天下的宏图霸业。若不是十年寒窗苦读，修身养性，又何来三分天下的诸葛孔明？',
          lesson: '真正的人才，从不怕被埋没。你若盛开，清风自来。在沉寂时韬光养晦，在蛰伏时厚积薄发，机遇只留给有准备的人。'
        },
        modernInterpretation: '你当前的焦虑，是将个人价值的判断交给了领导的评价体系。现代职场确实存在不公，但儒家智慧告诉你，你无法控制他人的眼光，但你可以掌控自己的成长。将精力聚焦在专业能力、人际关系、品德修养这三件事上，这三样东西是谁也夺不走的财富。职场晋升不是比赛，而是水到渠成的结果。你今天每一分勤恳，都是在为未来蓄力。',
        actions: [
          '每日反思三件事：今天我在专业能力上有什么进步？今天我在人际关系上做了什么积累？今天我的品德修养是否有亏？',
          '主动与领导进行一次坦诚沟通，汇报工作成果与思考，让领导看到你的价值，而不是默默等待被发现。',
          '将目光放回自身成长，制定一个季度学习计划，每月读一本专业书籍，每季度掌握一项新技能。',
          '乐于助人，在团队中主动承担责任，建立自己的口碑与人脉。'
        ],
        historicalContext: '儒家"学而优则仕"的理念产生于古代科举制度与士族政治的社会结构。古代"职场"主要是官场，升迁取决于品德声望、考试成绩与人脉关系，与现代企业以绩效为核心的考核体系差异巨大。"修身齐家治国平天下"的序列，将个人道德修养视为职业发展的根本，这在古代重视德治的官僚体系中确实有效，但在现代商业环境中不能代替专业能力与业绩产出。',
        modernValuesComparison: [
          {
            ancientView: '古代职场（官场）重"德"轻"才"，强调"内圣外王"——只要品德修养足够，自然能得到重用；"不患人之不己知，患其不能也"，不需要主动展示，酒香不怕巷子深。',
            modernView: '现代职场既看重品德与职业素养，更看重实际的绩效产出与专业能力。现代社会节奏快、竞争激烈，适度的自我展示与沟通汇报是必要的，仅靠"默默耕耘"可能导致被忽视。',
            suggestion: '继承儒家"修身为本"的精神——专业能力、品德修养、职业操守永远是立身之本；但也要学会"外王"——主动汇报成果、积极争取机会、有效展示价值，这不是投机取巧，而是让你的能力被看见的正当方式。'
          }
        ],
        mindset: '路漫漫其修远兮，吾将上下而求索。职场之路，不在一朝一夕。脚踏实地，步步为营，终有拨开云雾见青天之时。'
      }
    ],
    daojia: [
      {
        category: 'workplace',
        school: 'daojia',
        wisdom: '上善若水，水善利万物而不争。道家智慧告诉你，职场最高明的处世之道，是像水一样柔软却能水滴石穿。你当下感到不公，是因为心中有"争"的执念。水从不与万物争高低，却最终汇聚成海。在职场中，不必急于证明自己，不必与他人比较晋升快慢。每个人都有自己的节奏与轨迹。你看到的是表面风光，未必是真正的顺遂。慢，是一种力量。蛰伏，是为了更好地迸发。',
        quote: {
          text: '夫唯不争，故天下莫能与之争。',
          source: '《道德经》第二十二章',
          meaning: '正因为不与人争，所以天下没有人能与他争。不争不是消极退让，而是以退为进，以柔克刚的至高智慧。'
        },
        allusion: {
          title: '张良桥下取履',
          story: '张良年少时，一日在桥上遇到一位老人，老人故意将鞋扔到桥下，让张良去捡。张良强忍怒火，恭敬地为老人穿鞋。老人又让他五日后再来相见，张良两次迟到被老人斥责，第三次张良半夜就在桥上等。老人见他心诚，传授他《太公兵法》。张良后来辅佐刘邦成就帝业，成为汉初三杰之一。功成之后，张良功成身退，不居功自傲，得以善终。',
          lesson: '忍常人所不能忍，方能成常人所不能成。不争一时之长短，才能成就千秋之大业。以柔克刚，以退为进。'
        },
        modernInterpretation: '你焦虑的根源，是将外部评价等同于自我价值。道家智慧告诉你，真正的力量在于柔软与不争。与其在竞争焦虑中消耗自己，不如像水一样顺应自然流动，该前进时前进，该等待时等待。他人的晋升自有其因缘，你的路也有其时序。不争不是躺平，而是不与人争锋相对，而是积蓄力量，等待时机。',
        actions: [
          '放下比较心，将他人的晋升作为观察学习的对象，而非比较焦虑的来源。',
          '观察公司真正重视的是什么？是结果还是表面功夫？调整自己的方向，顺流而为。',
          '默默积累自己的"不可替代性"，成为团队中那个离不开的人。',
          '如果此处确实不公，也不必急于一时，静待时机，如同水寻找出路，总会找到自己的方向。'
        ],
        historicalContext: '道家思想产生于春秋战国乱世，当时政权更迭频繁、政局动荡，许多士人选择"避世隐居""全身保命"，道家的"不争""无为"正是在这种险恶政治环境下发展出的生存智慧。其适用场景是乱世中的明哲保身、动荡中的隐忍待机，而非和平时期商业竞争中的职业发展。',
        modernValuesComparison: [
          {
            ancientView: '道家"不争故无尤""夫唯不争，故天下莫能与之争"，在乱世中这是避祸之道，但放在今天理解为"完全不争不抢"，可能导致错失发展机会。',
            modernView: '现代职场鼓励合理竞争与展示自我，公司的晋升、项目机会、资源分配通常需要主动争取。完全的"不争"可能被解读为缺乏进取心。',
            suggestion: '学习道家"不与人争闲气"的豁达——不因一次得失否定自己，不在非核心问题上内耗；但在关键发展机会、核心利益上，该争取的要合理争取。"不争"是心态上的不焦虑，不是行动上的不作为。'
          }
        ],
        mindset: '静水流深，韬光养晦。你的价值不需要他人证明。'
      }
    ],
    fajia: [
      {
        category: 'workplace',
        school: 'fajia',
        wisdom: '法家讲究法、术、势三者结合。你在职场中的困境，在于只懂"勤"而不懂"法、术、势"。勤恳是基础，但仅有勤恳是不够的。法者，规则与制度也。你要明白职场的游戏规则。术者，策略与方法也。你要懂得如何展示自己的价值与成果。势者，权势与地位也。你要懂得借势而为。三者缺一不可。',
        quote: {
          text: '法不阿贵，绳不挠曲。',
          source: '《韩非子·有度》',
          meaning: '法律不偏袒有权有势的人，就像墨线不迁就弯曲的木头。职场中你需要明白规则，同时也要懂得运用规则保护自己。'
        },
        allusion: {
          title: '商鞅变法立木取信',
          story: '商鞅在秦国推行变法之初，为取信于民，在国都南门立一根三丈高的木头，张贴告示说有人能搬到北门就赏十金。百姓不信，商鞅又将赏金提高到五十金。有人将木头搬到北门，商鞅如约赏给五十金，以此表明法令必行。从此秦国变法大治，国力大增，为后来秦统一六国奠定基础。',
          lesson: '做任何事情，先要让规则先行，建立自己的"信"与"名"。你的勤恳需要被看见，需要建立自己的成果与口碑。'
        },
        modernInterpretation: '法家告诉你，职场不是只靠默默耕耘就会有回报的理想国。你需要懂得游戏规则，需要策略方法，需要让你的成果被看见。勤恳是"内功"，但也需要"外功"来配合。你要做的是让领导清楚你的价值，你的贡献，你的不可替代性。',
        actions: [
          '定期主动汇报工作成果，用数据与事实说话，让领导清晰知道你在做什么，做成了什么。',
          '找准公司的核心规则与晋升标准，对标自己的工作方向。',
          '建立自己的"势"——在某个领域成为专家，建立不可替代的专业地位。',
          '如确实遇到不公，用事实与规则说话，而非情绪与抱怨。'
        ],
        historicalContext: '法家思想产生于战国乱世，是为君主服务的统治术。"法、术、势"的核心是君主如何通过制度、权谋、权威来控制臣下、驾驭百姓。其本质是自上而下的权力控制工具，与现代企业管理中强调的平等、尊重、赋能、团队协作等理念存在根本差异。',
        modernValuesComparison: [
          {
            ancientView: '法家"术"的层面包含大量权谋、御下之术，如"疑诏诡使""倒言反事"等，本质是君主用欺骗、试探等手段掌控臣下，完全是权力游戏。',
            modernView: '现代管理强调诚信、透明、尊重，公司治理靠制度而非权术，用权谋手段控制团队会严重破坏信任与团队文化，最终得不偿失。',
            suggestion: '借鉴法家"法"的层面——建立清晰的制度与规则、明确权责、流程规范，这是企业管理的正道；但摒弃"术"的权谋层面——不要用算计、试探、权术来对待同事和下属，真诚才是最有效的领导力。'
          }
        ],
        mindset: '世事如棋，步步为营。懂规则，善用势，方能运筹帷幄。'
      }
    ],
    bingjia: [
      {
        category: 'workplace',
        school: 'bingjia',
        wisdom: '知己知彼，百战不殆。你在职场中的困惑，源于你只知己（自己的勤恳），未知彼（领导的真实需求，公司的政治格局，他人的优势劣势）。兵家讲究先胜而后求战，而非先战而后求胜。你需要先搞清楚战况，再决定行动策略。',
        quote: {
          text: '知彼知己，百战不殆；不知彼而知己，一胜一负；不知彼不知己，每战必殆。',
          source: '《孙子兵法·谋攻篇》',
          meaning: '了解对方也了解自己，百战都不会有危险；不了解对方但了解自己，胜负的概率各半；既不了解对方也不了解自己，每次战斗都必然危险。'
        },
        modernInterpretation: '你需要先搞清楚：领导看重什么？公司晋升的真正标准是什么？那位晋升快的同事到底强在哪里？你的优势劣势是什么？搞清楚这些，才能制定你的"作战计划。',
        allusion: {
          title: '韩信明修栈道暗度陈仓',
          story: '韩信被刘邦拜为大将后，要出兵关中。他表面派士兵公开修栈道，装作要从栈道进军，吸引章邯的注意力。实际上，韩信亲率大军从陈仓小道秘密出兵，出其不意击败章邯，平定三秦。这是兵家"兵者，诡道也"的经典战例。',
          lesson: '做事要有策略，明面上做的事，与暗地里的真实意图，可以不同。'
        },
        actions: [
          '观察分析：领导最在意什么，最近在推动什么，优先做领导最在意的事。',
          '研究那位晋升快的同事，学习他的长处，看他做对了什么。',
          '展示你的工作成果时，选择合适的时机与方式，让领导清晰可见。',
          '如果决定争取，就准备好充分的理由与数据，一次成功的"战役"。'
        ],
        historicalContext: '兵家思想源于春秋战国的战争实践，其核心是研究如何在你死我活的军事对抗中取胜，将战争是暴力与征服。其"兵者诡道""兵不厌诈""出其不意、攻其不备"等策略，都建立在敌我对立、你死我活的基础之上。将兵法直接套用在现代职场中，容易把同事当成敌人，把协作当成战争，这与现代企业强调的团队协作完全相反。',
        modernValuesComparison: [
          {
            ancientView: '兵家将一切人际关系都视为零和博弈——我赢你输，我胜你败，"兵者诡道"，为达目的可以不择手段。',
            modernView: '现代职场更多是协作共赢，团队合作是主流，同事之间既有竞争也有合作，"双赢才是长久之道。',
            suggestion: '学习兵家"知己知彼"的分析能力、"谋定后动"的战略思维，用于了解需求、规划职业发展；但绝不可用兵法中的阴谋诡计。真诚待人、团队共赢才是职场长久之道。'
          }
        ],
        mindset: '胜兵先胜而后求战。谋定而后动。'
      }
    ],
    fojia: [
      {
        category: 'workplace',
        school: 'fujia',
        wisdom: '一切有为法，如梦幻泡影。你当下的焦虑与不平，都是你心中执念的投射。晋升、认可、公平，这些都是有为法，如露亦如电。佛家讲"应无所住而生其心"。不执着于结果，专注于当下的修行。你勤恳工作，是为了自己的成长，而非为了领导的认可。当你不再执着，心就自在。',
        quote: {
          text: '应无所住，而生其心。',
          source: '《金刚经》',
          meaning: '不执着于任何事物表象，才能生起清净无染的心。做事情不带功利目的，专注过程本身就是修行。'
        },
        modernInterpretation: '你把勤恳的目的是为了晋升认可，所以当结果不如预期时，就会痛苦。如果将勤恳视为自己的修行，过程本身就是回报，那么得失就不会影响你。',
        allusion: {
          title: '达摩面壁九年',
          story: '达摩祖师来到中国，在嵩山少林寺面壁九年，终日面壁而坐，终日默然。人问其故，他说："吾心安处是吾乡。"九年面壁，不是等待有人认可，而是修行自身。后来慧可断臂求法，达摩传法与他，禅宗在中国发扬光大。',
          lesson: '修行在于修心，心若安好，便是晴天。外界的评价，不过是过眼云烟。'
        },
        actions: [
          '每日静坐片刻，观照自己的起心动念，放下比较与嫉妒之心。',
          '将工作视为修行，每一件小事认真对待，但不执着于结果。',
          '如果此处确实与你缘分已尽，随缘而去，不必强求。',
          '培养内心的平静，无论外界如何评价，你知道自己是谁。'
        ],
        historicalContext: '佛教的终极目标是解脱轮回，世俗的工作与成就都属于"有为法"，本质上是虚幻的。原始佛教要求僧人出家修行，不事生产，完全脱离世俗生活。佛教"一切有为法如梦幻泡影"的核心思想，若简单理解为"世间一切都无意义"，容易导致消极避世的心态。',
        modernValuesComparison: [
          {
            ancientView: '佛家将世俗工作与事业成就视为"梦幻泡影"，是妨碍解脱的"俗务"，鼓励人放下对世俗成就的执着。',
            modernView: '现代社会中，工作不仅是谋生手段，也是实现自我价值、贡献社会的重要方式，适度的进取心与成就感是心理健康的标志。',
            suggestion: '学习佛教"放下对结果的过分执着"来缓解焦虑与压力，但不要走到"一切都无所谓"的另一端——认真工作、追求发展，这本身也是一种修行。"无所住而生其心"的正确理解是：做事时全力以赴，但不被结果绑架。'
          }
        ],
        mindset: '万般带不去，唯有业随身。你种下的每一份认真，终会在某处开花结果。'
      }
    ]
  },
  family: {
    rujia: [
      {
        category: 'family',
        school: 'rujia',
        wisdom: '《礼记》云："父子笃，兄弟睦，夫妇和，家之肥也。"儒家将家庭视为伦理的基础。你当下的家庭困境，源于家人之间的"礼"与"情"未能平衡。儒家讲"父慈子孝，兄友弟恭，夫义妇顺"，这是双向的伦理要求，而非单向的服从。面对家庭矛盾，首先反求诸己：我是否尽到了自己的本分？我是否以仁爱之心对待家人？行有不得，反求诸己。同时，家和万事兴，但"和"不是无原则的委曲求全，而是各守其分、各尽其责后的和谐。',
        quote: {
          text: '妻也者，亲之主也，敢不敬与？',
          source: '《礼记·哀公问》',
          meaning: '妻子是奉事父母、主持家庭的核心，怎么能不敬重呢？孔子此言强调夫妻之间应当相互敬重，而非单方面的服从。'
        },
        allusion: {
          title: '张公艺百忍家道兴',
          story: '唐代张公艺家族九代同居，和睦相处。唐高宗问他治家秘诀，他在纸上写了一百个"忍"字。高宗看后，潸然泪下，深有感触。张家以此"百忍"为家训，家道昌盛，成为千古治家典范。',
          lesson: '家庭相处，忍是必要的修养。但忍的前提是相互体谅，而非单方面压抑。真正的"百忍"，是用包容化解矛盾，而非用沉默积累怨恨。'
        },
        historicalContext: '儒家家庭伦理产生于西周宗法制度下的父权大家族结构。在古代农业社会，家庭是生产与生活的基本单位，强调"男耕女织""男主外女主内"的严格分工，妇女被限定在家庭内部，缺乏独立的社会与经济地位。"夫为妻纲"是汉代以后"三纲"说的强化，与原始儒家强调夫妻"相敬如宾"已有偏差。',
        modernValuesComparison: [
          {
            ancientView: '古代婚姻以家族利益、传宗接代为核心，强调"夫为妻纲"，女性地位依附于男性，家庭矛盾主要靠"忍"和"妇道"来维持表面和谐。',
            modernView: '现代婚姻以爱情为基础，强调夫妻平等、相互尊重、共同承担。《民法典》明确规定"婚姻家庭受国家保护，实行婚姻自由、一夫一妻、男女平等的婚姻制度"，双方享有平等的权利义务。',
            suggestion: '借鉴儒家"仁爱""反求诸己"的修养精神，但摒弃其中的等级观念与性别偏见。遇到矛盾时先反省自身是否有做得不当之处，然后以平等尊重的态度与伴侣沟通，而非单方面隐忍退让。涉及家暴、出轨等原则问题，不可套用"百忍"观念，应及时寻求法律与社会支持。'
          },
          {
            ancientView: '古代大家庭强调"孝"为百善之首，晚辈对长辈须绝对服从，"天下无不是的父母"，婆媳矛盾中往往要求晚辈委曲求全。',
            modernView: '现代社会强调人格独立，婆媳是平等的两个独立个体，相互尊重而非上下尊卑。"孝"的内涵从"无违"转变为关心、尊重、情感支持。',
            suggestion: '继承儒家重视亲情、尊老敬老的美德，但在具体相处中保持边界感。孝敬父母不等于事事顺从，婆婆也应尊重儿媳的独立人格与生活方式。建议核心家庭与原生家庭保持适当距离，夫妻共同承担沟通桥梁的角色。'
          }
        ],
        modernInterpretation: '你当前的家庭困境，儒家智慧能提供的是修身自省和人际相处的心法，而非具体的行为规范。"反求诸己"——先检查自己是否尽到了沟通、理解、尊重的责任，这在任何时代都适用。但古代的"夫为妻纲""三从四德"等等级观念，早已不符合现代平等婚姻价值观，万不可生搬硬套。真正的"家和"，需要夫妻双方共同努力，相互体谅，平等沟通。',
        actions: [
          '冷静反思自己在矛盾中的责任：是否有言语失当、态度急躁的地方？',
          '找一个双方情绪平和的时机，以"我感到..."而非"你总是..."的句式进行非暴力沟通。',
          '明确双方的责任边界，家务、育儿、财务等事项平等协商，共同承担。',
          '如涉及家暴、人身安全、重大原则问题，立即寻求家人、社区、法律的帮助，不可一味隐忍。',
          '尊重原生家庭边界，尽量让核心家庭（夫妻+子女）拥有独立的生活空间。'
        ],
        mindset: '家是讲爱的地方，也是讲理的地方。爱而不失尊重，忍而不丢底线。'
      }
    ],
    daojia: [
      {
        category: 'family',
        school: 'daojia',
        wisdom: '道法自然，家庭之道亦在于顺应自然。道家认为家庭关系如水，过度干预反而浑浊，给予空间反而清澈。你当下的家庭矛盾，往往源于对家人"有所期望""有所要求"的执念。老子曰："为无为，事无事，味无味。"家庭相处，最高的智慧是"无为而治"——不是什么都不做，而是不过度控制，不强行改变，给彼此成长的空间。当你放下"他应该怎样"的执念，关系反而会自然恢复和谐。',
        quote: {
          text: '飘风不终朝，骤雨不终日。',
          source: '《道德经》第二十三章',
          meaning: '狂风刮不到一早晨，暴雨下不了一整天。家庭中的激烈矛盾也是一样，来得快去得也快，不必在气头上做激烈反应，让时间化解。'
        },
        allusion: {
          title: '庄子鼓盆而歌',
          story: '庄子的妻子去世，好友惠子前来吊唁，却看到庄子蹲在地上，一边敲打瓦盆一边唱歌。惠子责备他不近人情，庄子说："人本来就没有生命，没有形体，没有气息。恍恍惚惚之间变成了气，气变成了形，形变成了生命，现在又回归于死亡，这就像春夏秋冬四季交替运行一样。她已经安然安息于天地之间，我若呜呜哭泣，岂不是不通达天命？"',
          lesson: '道家看待家庭关系，更看重本质的情感而非形式的执着。关系中的聚散、变化，都是自然规律，接受变化，顺势而为。'
        },
        historicalContext: '道家思想产生于春秋战国乱世，对人为建构的伦理秩序持保留态度。道家对家庭关系的态度较为超脱，强调个体精神自由高于世俗伦常。道家理想中的夫妻关系是"相濡以沫，不如相忘于江湖"——在困境中相互扶持当然可贵，但更理想的是各自自由、互不束缚。',
        modernValuesComparison: [
          {
            ancientView: '道家对婚姻家庭的态度偏向超然，认为世俗的家庭责任是对个体自由的束缚，追求"相忘于江湖"的超脱境界。',
            modernView: '现代社会既尊重个体独立，也强调家庭责任。婚姻是受法律保护的契约，双方对彼此、对子女负有明确的权利与义务，不可因"追求自由"而逃避责任。',
            suggestion: '学习道家"不控制、不强求"的智慧用于减少家庭冲突，但不可将"无为"作为逃避家庭责任的借口。给伴侣独立成长的空间，同时也履行好自己的家庭义务，找到自由与责任的平衡点。'
          },
          {
            ancientView: '道家"不争"的处世哲学，主张在矛盾中退让、隐忍，认为以退为进、以柔克刚才是上策。',
            modernView: '现代婚姻关系强调平等沟通，有问题需要明确表达、协商解决，一味退让可能导致问题积累，甚至助长伤害行为。',
            suggestion: '在非原则问题上学习道家"不争"的豁达，减少无谓争吵；但在原则问题（忠诚、尊重、安全）上要明确表达立场，不能用"顺其自然"来纵容伤害。感情中的矛盾该沟通的要沟通，该划的底线要清晰。'
          }
        ],
        modernInterpretation: '道家对家庭关系的最大启示是"放下执念"——放下对"完美婚姻""完美伴侣""完美家庭"的执念，接纳不完美的现实。"飘风不终朝"提醒我们，激烈的矛盾都是暂时的，不必在情绪上头时做决定。但注意：道家的"无为"不是不作为，而是不妄为；"顺其自然"不是放任自流，而是接受无法改变的，改变可以改变的。',
        actions: [
          '在情绪激动时默念"飘风不终朝"，给自己24小时冷静期，再做决定或沟通。',
          '列出你对伴侣/家人的所有"应该"，审视这些"应该"哪些是合理期待，哪些是你的执念。',
          '给关系留一些"留白"：不过度追问行踪，不强迫同步所有兴趣，允许对方有自己的空间。',
          '但要明确你的底线：哪些行为绝对不可接受（如暴力、出轨、欺骗），并清晰告知对方。',
          '培养自己的精神世界，不过度依赖伴侣获得幸福，这才是"相忘于江湖"的真正含义。'
        ],
        mindset: '如水般相处：遇山绕行，遇低积蓄，清澈透明，包容万物，但不失自己的方向。'
      }
    ],
    fajia: [
      {
        category: 'family',
        school: 'fajia',
        wisdom: '法家虽然以治国为核心，但其"定分止争"的智慧完全可以用于家庭治理。家庭矛盾的根源，往往是"名分不定"——也就是责任不清、边界不明。谁做主？谁承担？谁说了算？这些问题若没有清晰的规则，必然纠纷不断。法家强调"法不阿贵，绳不挠曲"，规则一旦确定，不论亲疏都应遵守。当然，家庭毕竟不是朝堂，"法"之外还需要"情"的润滑，但没有清晰的规则，情也容易变成纵容或压抑。',
        quote: {
          text: '一兔走，百人逐之，非以兔可分以为百也，由名分之未定也。',
          source: '《商君书·定分》',
          meaning: '一只兔子在跑，上百人追逐它，不是因为兔子可以分成一百份，而是因为这只兔子的归属还没有确定。家庭中的矛盾，很多也是因为责任和权利的"名分未定"。'
        },
        allusion: {
          title: '汉文帝刘恒以法治家',
          story: '汉文帝刘恒是历史上有名的贤君，也是孝子（二十四孝中"亲尝汤药"的主角）。他既以仁孝治天下，也以法度约束家人。他的舅舅薄昭犯法杀人，文帝虽然念及亲情，但最终还是依法令薄昭自尽，维护了法的尊严。正因他公私分明，才开创了"文景之治"的盛世。',
          lesson: '家庭治理中，情感与规则需要平衡。只讲情不讲规则，会助长特权；只讲规则不讲情，会冷漠生硬。关键是原则问题"法不阿亲"，日常相处"情大于法"。'
        },
        historicalContext: '法家思想形成于战国乱世，主张以严刑峻法维持社会秩序。法家对家庭的态度较为冷酷，如商鞅变法甚至强制拆散大家庭，鼓励小家庭分户独立，以削弱宗族势力、强化国家控制。"大义灭亲"是法家推崇的价值观。这些都与现代家庭温情脉脉的价值观差异极大。',
        modernValuesComparison: [
          {
            ancientView: '法家将家庭视为国家的延伸，强调用严格的规则甚至刑罚来维护秩序，主张"大义灭亲"，不避亲疏。',
            modernView: '现代家庭以情感为核心，法律只是底线保障。《民法典》对家庭关系的调整以保护弱势群体、维护平等和睦为原则，而非单纯的惩罚。',
            suggestion: '借鉴法家"定分止争"的智慧，用清晰的规则明确家庭中的责任、权利、边界，但将这些规则建立在平等协商、相互尊重的基础上，而非一方对另一方的强制。不要用"大义灭亲"的冷酷态度对待家人，规则的目的是保护关系而非惩罚。'
          },
          {
            ancientView: '法家"法不阿贵"的精神在家庭中体现为规则面前人人平等，但古代的"平等"是君主之下所有人都要守法，并不包含君主本人。',
            modernView: '现代家庭中的平等是真正的人格平等，夫妻之间、父母子女之间都有平等的人格尊严，规则对所有人平等适用，包括制定规则的人。',
            suggestion: '家庭规则应通过民主协商共同制定，一旦确定，所有人（包括长辈）都应遵守。比如约定"不翻旧账""不动手"，谁违反都要承担后果，不能因为是长辈就有特权。'
          }
        ],
        modernInterpretation: '法家给家庭的最大启发是：清晰的规则是和谐的基础。很多家庭矛盾反复上演，就是因为责任不清、边界不明——谁管钱、谁做家务、遇事谁说了算、和原生家庭的边界在哪里……这些问题如果提前"定分"，就能避免大部分"争"。但要注意：家庭规则应是双方共同约定的"契约"，而非一方制定的"家法"；其目的是保护每个人的权益，而非维护家长权威。',
        actions: [
          '在双方心平气和时，做一次"家庭规则会谈"，讨论并写下共同遵守的基本规则。',
          '明确家庭财务规则：收入如何管理、支出如何决定、大额消费谁来拍板。',
          '明确家务分工：谁做什么、什么时候做，做到的公平，而非绝对的均分。',
          '明确与原生家庭的边界：什么事需要伴侣同意，什么事可以自己决定。',
          '约定冲突处理规则：吵架时不说哪些话、冷战不超过多久、有矛盾怎么和解。'
        ],
        mindset: '规则是情感的护栏。有了清晰的边界，感情才能在安全的范围内自由流动。'
      }
    ],
    bingjia: [
      {
        category: 'family',
        school: 'bingjia',
        wisdom: '兵家以研究战争著称，但其"知己知彼""攻心为上"的智慧完全可以转化为家庭中的沟通策略。你与家人的矛盾，不是一场你死我活的战争，而是一场需要"不战而屈人之兵"的博弈。孙子曰："上兵伐谋，其次伐交，其次伐兵，其下攻城。"家庭矛盾中，最下策是吵架哭闹（攻城），上策是洞察对方真实需求、用智慧化解（伐谋）。不要把伴侣当敌人，要把问题当敌人，两人是同一阵营的战友。',
        quote: {
          text: '攻城为下，攻心为上。',
          source: '《三国志·马谡传》裴松之注引《襄阳记》',
          meaning: '攻打城池是下策，征服人心才是上策。家庭矛盾中，争赢了道理却输了感情，是典型的"攻城"；理解对方的真实需求、从心里化解芥蒂，才是真正的"攻心"。'
        },
        allusion: {
          title: '将相和——负荆请罪',
          story: '战国时赵国大将廉颇不服蔺相如仅凭口舌之功就位居自己之上，扬言要羞辱他。蔺相如知道后，处处避让，不与廉颇正面冲突。廉颇得知蔺相如避让是因为"先国家之急而后私仇也"，深感惭愧，于是光着上身背着荆条到蔺相如府上请罪。两人从此成为生死之交，共同辅佐赵国。',
          lesson: '家庭中的"将相和"也需要这样的智慧：有时主动退让不是软弱，而是为了大局的远见；而另一方懂得"负荆请罪"的反省，更是关系修复的关键。退一步海阔天空，争一时风平浪静。'
        },
        historicalContext: '兵家思想产生于春秋战国的战火之中，其核心是研究如何在你死我活的对抗中取胜。兵家将人际关系视为利益博弈，其"知己知彼""兵者诡道"的策略若直接套用到家庭中，会把亲密关系变成互相算计的战场，这与现代婚姻的本质是完全相悖的。',
        modernValuesComparison: [
          {
            ancientView: '兵家将一切关系视为利益博弈，强调"兵不厌诈"，为达到目的可以使用计谋、欺骗、离间等手段。',
            modernView: '现代亲密关系的基石是真诚、信任、相互扶持，任何计谋与欺骗都会严重伤害感情，甚至成为婚姻破裂的导火索。',
            suggestion: '借鉴兵家"知己知彼"——深入了解伴侣的真实需求和感受，这是"真诚"层面的理解；但万万不可将"兵不厌诈"的谋略用于家庭。对家人使用心计，赢了利益输了感情，得不偿失。'
          },
          {
            ancientView: '兵家重胜负，追求"百战不殆"，在冲突中以压倒对方、获取最大利益为目标。',
            modernView: '健康的亲密关系追求"双赢"，而非一方压倒另一方。家庭中的"胜利"不是你说服了他，而是你们共同找到了解决方案。',
            suggestion: '将兵法的"胜"重新定义：不是你赢了伴侣，而是你们一起赢得了更和谐的关系。学习兵家"谋定后动"——情绪激动时先冷静下来，想清楚你真正的目标是解决问题还是发泄情绪。'
          }
        ],
        modernInterpretation: '兵家给家庭关系的最大启示是"战略思维"——不要被眼前的情绪牵着走，想清楚你真正想要的是什么。是想争个输赢？还是想解决问题、让关系更好？"攻城为下，攻心为上"——家人之间，理解比说服重要，接纳比改变重要。但请切记：兵法是对敌作战的智慧，家庭是爱人相守的港湾，二者不可混淆。对家人使心眼、玩计谋，是兵家智慧的滥用，终将反噬关系本身。',
        actions: [
          '下次发生矛盾时，先问自己三个问题：我真正的目标是什么？对方真实的需求是什么？怎么做才能双赢？',
          '练习"非暴力沟通"：观察事实→表达感受→说出需要→提出请求，这是家庭中的"攻心"正道。',
          '学习"将相和"的智慧：如果是你的错，放下身段主动道歉（负荆请罪）；如果对方先低头，给台阶下，不要揪着不放。',
          '明确：家庭不是战场，永远不要用"赢了对方"来证明自己，共同找到解决方案才是真正的胜利。',
          '如关系中出现持续的算计、博弈、利用，这已不是健康的亲密关系，需及时止损或寻求专业帮助。'
        ],
        mindset: '百战百胜，非善之善者也；不战而屈人之兵，善之善者也。最好的家庭关系，是无需"战斗"就已和谐。'
      }
    ],
    fojia: [
      {
        category: 'family',
        school: 'fojia',
        wisdom: '佛家讲"因缘和合"，家人能聚在一起，是累世的缘分。你当下的家庭矛盾，从佛法的角度看，是"我执"太重——执着于"他应该这样对我""这个家应该那个样子"。苦的根源不是事情本身，而是你对事情的"执着"。《金刚经》云："一切有为法，如梦幻泡影。"家庭关系也是因缘聚散，强求不得。但这不是说可以消极逃避，而是说在尽心尽力之后，学会接纳不完美的现实。以慈悲心看待家人，他也是在自己的烦恼中流转，需要理解而非指责。',
        quote: {
          text: '今生的夫妻，是前缘注定。',
          source: '佛说缘经',
          meaning: '佛家认为人与人的相遇都是因缘所成，家人更是深厚缘分的体现。珍惜这份缘分，但不执着于形式。缘分尽时，也能坦然放下。'
        },
        allusion: {
          title: '目连救母——孝亲的慈悲',
          story: '释迦牟尼的弟子目连尊者以神通看到母亲因生前造恶堕入饿鬼道，受苦无量。目连悲痛万分，以钵盛饭喂食母亲，饭未入口即化为炭火。目连求救于佛，佛说："你母亲罪业深重，非你一人之力可救，须在七月十五日设盂兰盆会，供养十方僧众，仗众僧之力方可救度。"目连依教奉行，母亲终得解脱。这就是盂兰盆节的起源。',
          lesson: '佛家对家庭亲情的态度是慈悲与报恩的结合。对家人的关爱是修行的一部分，但也要明白"各人因果各人了"——我们可以尽心尽力帮助家人，但无法替他们承担选择的后果。'
        },
        historicalContext: '佛教源于古印度，是一种出世的宗教，对世俗家庭关系的态度较为超脱。原始佛教要求僧侣出家修行，舍弃家庭。传入中国后，为适应本土宗族文化，逐渐发展出"人间佛教"的思想，将孝亲纳入修行体系，形成与儒家并行的家庭伦理。但佛教的核心始终是"解脱"而非"齐家"，其家庭智慧更偏向心理调适而非关系建设。',
        modernValuesComparison: [
          {
            ancientView: '佛教对家庭关系持超脱态度，认为"爱别离苦"是人生八苦之一，执着于家庭情爱会妨碍解脱。极端情况下甚至要求出家人割亲断爱。',
            modernView: '现代社会将家庭视为人生幸福的重要源泉，重视家庭建设、亲密关系经营，认为健康的家庭关系是个人心理健康与社会稳定的基础。',
            suggestion: '学习佛教"放下执念"的智慧来减少家庭中的痛苦，但不要走到另一个极端——因为"一切是空"就消极逃避家庭责任。尽力而为，然后接纳结果，是佛教智慧在家庭中的正确打开方式。'
          },
          {
            ancientView: '佛教讲"忍辱波罗蜜"，将忍耐视为重要的修行，即使受到不公对待也应逆来顺受，视逆境为消业。',
            modernView: '现代社会强调人格尊严与人权保护，面对家庭暴力、恶意伤害，法律鼓励受害者勇敢反抗、维护自身权益，而非一味忍耐。',
            suggestion: '对非原则性的摩擦，可以学习佛教"忍辱"的修养——不因为一句话、一件小事就大动肝火；但对家暴、虐待等伤害行为，绝不可用"消业""忍辱"来合理化伤害，应立即报警求助。'
          }
        ],
        modernInterpretation: '佛法给家庭关系的最大帮助是心理层面的调适：当你因家人的行为痛苦不堪时，"一切有为法如梦幻泡影"能帮你从执念中抽离，减轻痛苦。"因缘和合"让你珍惜彼此相遇的缘分，减少无谓的计较。"慈悲心"让你能站在对方的角度，理解他也有他的烦恼与局限。但请记住：佛法修心，不是给伤害开脱的借口；随缘放下，也不是消极不作为。尽人事，听天命，才是积极的态度。',
        actions: [
          '当你因家庭矛盾感到痛苦时，试着做"转念"练习：这件事让我痛苦的，是事情本身还是我对它的"应该怎样"的执念？',
          '以慈悲心看待家人：他这样对我，是不是也有他的苦衷与烦恼？（注意：理解不等于认同，慈悲不等于纵容。）',
          '在非原则问题上，练习"忍辱"——不因为小事起嗔恨心，不在气头上说伤人的话。',
          '在原则问题上（家暴、出轨、伤害），立即行动保护自己，报警、求助、远离伤害源，不要用"忍辱""因果"为伤害开脱。',
          '培养自己的精神世界，不过度依赖家人提供全部的情感价值，你的安全感最终源于自己的内心。'
        ],
        mindset: '随缘不是放弃，尽力而后心安。慈悲不是软弱，理解之后有选择。'
      }
    ]
  }
}

const generalWisdomBank: Record<string, AdviceResult[]> = {
  rujia: [
    {
      category: 'general',
      school: 'rujia',
      wisdom: '吾日三省吾身：为人谋而不忠乎？与朋友交而不信乎？传不习乎？你当下的困惑，无论何种困境，儒家智慧的根本在于反求诸己。从自身出发，审视自己的起心动念、言行举止。君子坦荡荡，小人长戚戚。当你内心坦荡，处世无愧，外部困境自会消解。',
      quote: {
        text: '行有不得，反求诸己。',
        source: '《孟子·离娄上》',
        meaning: '凡是行为得不到预期的效果，都应该反过来检查自己。问题的根源往往在自己身上。'
      },
      allusion: {
        title: '颜回不迁怒不贰过',
        story: '颜回是孔子最得意的门生。他生活清贫，一箪食一瓢饮，在陋巷，人不堪其忧，回也不改其乐。孔子称赞他："不迁怒，不贰过。"遇到不顺心的事，不把怒气发泄到别人身上；同样的错误不犯第二次。这是儒家修身的典范。',
        lesson: '困境来时，先从自身找原因，不抱怨他人，不重复犯错，这才是真正的成长。'
      },
      modernInterpretation: '你当前的困境，无论表面原因多么复杂，根本解决之道在于提升自己的品德与能力。你无法改变他人，但可以改变自己。你无法控制环境，但可以掌控自己的选择与反应。',
      actions: [
        '每日三省吾身：今天我在这件事上，是否尽力了？是否无愧于心？',
        '遇到问题，先从自身找三个可以改进的地方。',
        '以"仁"待人，以"义"行事，以"礼"处世。',
        '坚守本心，不被外界的评价与得失所动摇。'
      ],
      historicalContext: '儒家"反求诸己"的思想产生于春秋时期礼崩乐坏的社会背景下，当时各诸侯国征战不休，孔子认为恢复秩序的根本在于人人修养自身道德。但需注意，"行有不得反求诸己"是修养心法，不是要求人在遭受不公时一味从自己身上找原因。',
      modernValuesComparison: [
        {
          ancientView: '古代儒家强调"反求诸己"，遇到问题先从自己身上找原因，这在等级秩序固定的社会中有利于社会和谐，但有时会导致个人压抑真实诉求。',
          modernView: '现代社会既鼓励自我反思，也强调维护个人的合法权益与边界。遇到不公时，既反思自身，也该积极争取合理权益。',
          suggestion: '"行有不得，反求诸己"用于自我修养是极好的智慧，但遇到原则问题、权益受侵害时，不能只归咎于自己。先反求诸己是修养，再据理力争是勇气，两者并不矛盾。'
        }
      ],
      mindset: '路虽远，行则将至；事虽难，做则必成。'
    }
  ],
  daojia: [
    {
      category: 'general',
      school: 'daojia',
      wisdom: '人法地，地法天，天法道，道法自然。道家智慧的核心是顺应自然。你当下的焦虑，在于你试图掌控无法掌控的事物，对抗无法对抗的规律。放下执念，顺势而为，如同水一样自然流淌，总会找到出路。',
      quote: {
        text: '为学日益，为道日损。损之又损，以至于无为。无为而无不为。',
        source: '《道德经》第四十八章',
        meaning: '追求学问要一天比一天增加，追求大道要一天比一天减少。减少又减少，一直到无为的境地。虽然无为，但没有什么事情是做不成的。'
      },
      modernInterpretation: '你焦虑在于你想得太多，担忧得太多，内心杂念太多。放下这些杂念，回归事物的本质，你会发现答案其实很简单。',
      allusion: {
        title: '庄子逍遥游',
        story: '庄子的妻子去世，惠子前去吊唁，却看到庄子蹲在地上，鼓盆而歌。惠子不解，庄子说："她本来就没有生命，没有形体，没有气息。在恍恍惚惚之间，变而有气，气变而有形，形变而有生，今又变而至死，是相与为春秋冬夏四时行也。人且偃然寝于巨室，而我噭噭然随而哭之，自以为不通乎命，故止也。"',
        lesson: '人生老病死都是自然规律，顺应自然，接受变化，才是真正的通达。'
      },
      actions: [
        '接受当下的处境，不抗拒，不逃避，静观其变。',
        '减少内心的欲望与执念，问自己：最坏的结果是什么？接受它。',
        '顺应自然规律，不做逆势而为。',
        '给事情一些时间，让事物自然发展。'
      ],
      historicalContext: '道家"道法自然"的思想产生于春秋战国乱世，当时人为的制度与伦理反而成为压迫百姓的枷锁，因此道家提出"无为而治"，主张减少人为干预。但需注意，"顺其自然"不是消极不作为的借口。',
      modernValuesComparison: [
        {
          ancientView: '道家"无为"思想在古代是对统治者过度干预的批判，但容易被误解为"什么都不做"。',
          modernView: '现代社会强调人的主观能动性，遇到问题需要积极解决，而不能完全"顺其自然"。',
          suggestion: '"顺其自然"的正确理解是：尽人事之后，对结果保持开放心态。能改变的积极努力，不能改变的坦然接受。区分"可以改变"和"无法改变"，是人生重要的智慧。'
        }
      ],
      mindset: '随缘不变，不变随缘。万物皆有其时。'
    }
  ],
  fajia: [
    {
      category: 'general',
      school: 'fajia',
      wisdom: '事在四方，要在中央。法家讲究实事求是，分析问题，制定策略，执行到位。你的困境，需要冷静分析，理性判断，而非情绪化应对。',
      quote: {
        text: '世异则事异，事异则备变。',
        source: '《韩非子·五蠹》',
        meaning: '世道不同了，事情也就随之变化，情况变化了，措施也要跟着变化。'
      },
      allusion: {
        title: '商鞅变法',
        story: '商鞅在秦国变法，废除旧贵族反对，商鞅说："治世不一道，便国不法古。故汤武不循古而王，夏殷不易礼而亡。"治理国家没有一成不变的办法，有利于国家就不必仿效旧法度。',
        lesson: '面对变化的时代，需要变化的策略。拘泥于旧有思维，无法解决新的问题。'
      },
      modernInterpretation: '你当下的困境，需要冷静分析问题根源，制定可行方案，立即行动。抱怨与焦虑无用，解决问题才是关键。',
      actions: [
        '将问题拆解成具体的、可分析的要素，找到问题的核心。',
        '制定3-3-3策略：三个立即可以做的事，三个中期可以做的事，三个长期可以做的事。',
        '立即行动，从最小的一步开始。',
        '根据实际情况灵活调整策略，不僵化不固执。'
      ],
      historicalContext: '法家思想产生于战国乱世，强调以严刑峻法和权术来维持统治，其"法不阿贵"精神有其进步意义，但"刑治"的冷酷和"权术"的算计，与现代社会尊重人性、倡导合作的价值观存在张力。',
      modernValuesComparison: [
        {
          ancientView: '法家偏向功利主义，重结果轻过程，重规则轻人情，甚至主张"人性本恶"，需要用强力约束。',
          modernView: '现代社会既讲规则也讲人情，既重结果也重过程中的公平与尊严，强调以人为本。',
          suggestion: '学习法家"实事求是、理性分析"的方法论来解决问题，但不要将人情、道德完全排除在外。制度与规则是底线，温暖与关怀是润滑剂，两者缺一不可。'
        }
      ],
      mindset: '冷静分析，果断行动。问题是用来解决的，不是用来焦虑的。'
    }
  ],
  bingjia: [
    {
      category: 'general',
      school: 'bingjia',
      wisdom: '兵者，国之大事，死生之地，存亡之道，不可不察也。人生如战场，你的困境是你人生的关键抉择，需要慎重对待，谋定而后动。',
      quote: {
        text: '善战者，求之于势，不责于人。',
        source: '《孙子兵法·兵势篇》',
        meaning: '善于用兵打仗的人，总是从自己创造的"势"中去寻求胜利，而不苛求部属。'
      },
      modernInterpretation: '你需要看清形势，顺势而为，创造有利的形势，而不是被动等待。',
      allusion: {
        title: '围魏救赵',
        story: '魏国围攻赵国都城邯郸，赵国向齐国求救。齐将田忌率军直接去救邯郸。军师孙膑说："不如引兵去围攻魏国都城大梁，魏军必然回师自救，我们在半路设伏，一举两得。"田忌听从建议，魏军果然回师，齐军在桂陵设伏大败魏军。',
        lesson: '解决问题，不一定正面硬刚，找到对方的软肋，迂回解决问题更有效。'
      },
      actions: [
        '分析你当前形势，你的优势是什么，劣势是什么，机会是什么，威胁是什么。',
        '找到解决问题的最佳路径，不一定是最直接的路径。',
        '做好最坏的打算，做最好的准备。',
        '行动之前，先胜而后求战。'
      ],
      historicalContext: '兵家是战争年代的产物，其一切智慧都围绕"如何在对抗中取胜"。但人生不是战争，人际关系更不是你死我活的博弈。将兵法智慧用于人生时需特别注意其适用边界。',
      modernValuesComparison: [
        {
          ancientView: '兵家默认一切关系都是对抗性的，追求"百战不殆""克敌制胜"。',
          modernView: '现代社会强调合作共赢，人际关系中大多数时候需要的是理解、信任、协作，而非战胜对方。',
          suggestion: '学习兵家"知己知彼"的分析能力和"谋定后动"的战略思维，用于分析形势、规划人生；但不要把兵法的"对抗思维"套用到人际关系中。对家人、朋友、同事，讲"和"比讲"胜"更重要。'
        }
      ],
      mindset: '谋定而后动，知止而有得。'
    }
  ],
  fojia: [
    {
      category: 'general',
      school: 'fojia',
      wisdom: '心生种种法生，心灭种种法灭。你当下的痛苦与焦虑，都源于你的心。境由心造，相由心生。改变你的心，你的世界就改变了。',
      quote: {
        text: '一切唯心造。',
        source: '《华严经》',
        meaning: '世间万物，皆是我们内心的投射与显现。你看到的世界，是你心中的世界。'
      },
      modernInterpretation: '你当下的困境，是你内心的投射。当你转变心念，困境就不再是困境，而是你修行的助缘。',
      allusion: {
        title: '慧可安心',
        story: '慧可大师初见达摩祖师，说："我心未宁，乞师与安。"达摩说："将心来，与汝安。"慧可良久说："觅心了不可得。"达摩说："我与汝安心竟。"',
        lesson: '心在哪里？寻找你的焦虑你的痛苦，你能找到吗？找不到，心就安了。'
      },
      actions: [
        '静坐观心，观察你的焦虑与痛苦从何而来，它们是什么。',
        '接受一切的不完美，接受自己的不完美。',
        '放下对结果的执念，专注当下。',
        '培养慈悲与感恩，善待自己善待他人。'
      ],
      historicalContext: '佛教"一切唯心造"是一种修行方法，帮助人从对外境中解脱。但佛教是出世的宗教，其终极目标是解脱轮回，与世俗生活不是其关注的核心。将佛法用于世间生活，需取其精华去其出世的部分。',
      modernValuesComparison: [
        {
          ancientView: '佛教"一切唯心造"若被误解，会导致"唯心生"——认为所有问题都是心的问题，忽视现实问题的解决。',
          modernView: '现代心理学告诉我们，心理调适很重要，但现实问题（如贫困、疾病、不公）也需要实际行动去解决。',
          suggestion: '"一切唯心造"是让你从调整心态入手，减少不必要的内心痛苦——改变你能改变的（心态、认知），同时积极行动解决现实问题。修心不等于逃避现实。内心调适和外部行动是两条腿走路，缺了哪一条都走不远。'
        }
      ],
      mindset: '本来无一物，何处惹尘埃。'
    }
  ]
}

const selectedCategory = ref('workplace')
const dilemmaDescription = ref('')
const selectedSchool = ref('')
const isGenerating = ref(false)
const generatedResult = ref<AdviceResult | null>(null)
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const currentStep = computed(() => {
  if (generatedResult.value && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (dilemmaDescription.value) return 1
  if (selectedCategory.value) return 0
  return 0
})

const canGenerate = computed(() => {
  return dilemmaDescription.value.trim().length > 10
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const getCategoryLabel = (v: string) => dilemmaCategories.find(c => c.value === v)?.label || v
const getSchoolLabel = (v: string) => wisdomSchools.find(s => s.value === v)?.label || '综合'
const getSchoolColor = (v: string) => wisdomSchools.find(s => s.value === v)?.color || '#165DFF'

const applySample = (sample: QuickSample) => {
  selectedCategory.value = sample.category
  dilemmaDescription.value = sample.description
  if (sample.school) selectedSchool.value = sample.school
  ElMessage.success('已载入示例情境')
}

const toggleSchool = (value: string) => {
  selectedSchool.value = selectedSchool.value === value ? '' : value
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

const generateAdvice = () => {
  if (!canGenerate.value) {
    ElMessage.warning('请先详细描述你的困惑（至少10个字以上）')
    return
  }

  isGenerating.value = true
  generatedResult.value = null

  setTimeout(() => {
    const category = selectedCategory.value
    let school = selectedSchool.value
    if (!school) {
      const schoolKeys = Object.keys(generalWisdomBank)
      school = schoolKeys[Math.floor(Math.random() * schoolKeys.length)]
    }

    let result: AdviceResult

    const categoryBank = wisdomBank[category]
    if (categoryBank && categoryBank[school] && categoryBank[school].length > 0) {
      result = categoryBank[school][Math.floor(Math.random() * categoryBank[school].length)]
    } else {
      const generalResults = generalWisdomBank[school] || generalWisdomBank.rujia
      result = generalResults[Math.floor(Math.random() * generalResults.length)]
    }

    const personalizedResult: AdviceResult = {
      ...result,
      category,
      school,
      wisdom: result.wisdom + `\n\n针对你描述的「${truncateText(dilemmaDescription.value, 30)}...」这一困境，以上智慧供你参悟。`,
      modernInterpretation: `你描述的情况是：「${dilemmaDescription.value.substring(0, 50)}${dilemmaDescription.value.length > 50 ? '...' : ''}」\n\n` + result.modernInterpretation
    }

    generatedResult.value = personalizedResult

    const historyItem: HistoryItem = {
      category,
      school,
      description: dilemmaDescription.value,
      result: personalizedResult,
      time: new Date().toISOString()
    }
    history.value.push(historyItem)
    saveHistory()

    isGenerating.value = false
    ElMessage.success('智者开示已至，请细细参悟')
  }, 2000)
}

const resetAll = () => {
  selectedCategory.value = 'workplace'
  dilemmaDescription.value = ''
  selectedSchool.value = ''
  generatedResult.value = null
  ElMessage.info('已重置')
}

const copyResult = () => {
  if (!generatedResult.value) return
  const r = generatedResult.value
  let text = `【${getSchoolLabel(r.school)}智慧解答】\n\n📜 智者开示：\n${r.wisdom}\n\n💬 经典格言：\n"${r.quote.text}" —— ${r.quote.source}\n释义：${r.quote.meaning}\n\n📖 相关典故：${r.allusion.title}\n${r.allusion.story}\n启示：${r.allusion.lesson}\n\n🔮 现代解读：\n${r.modernInterpretation}`
  if (r.historicalContext) {
    text += `\n\n🏛️ 历史背景说明：\n${r.historicalContext}`
  }
  if (r.modernValuesComparison && r.modernValuesComparison.length > 0) {
    text += `\n\n⚖️ 古今价值观对照：`
    r.modernValuesComparison.forEach((c, i) => {
      text += `\n\n对照${i + 1}：\n古人视角：${c.ancientView}\n现代视角：${c.modernView}\n融合建议：${c.suggestion}`
    })
  }
  text += `\n\n🎯 行动建议：\n${r.actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n🌿 心境寄语：\n${r.mindset}\n\n⚠️ 免责声明：以上内容仅供参考启发，不构成任何专业意见。`
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
  selectedSchool.value = item.school
  dilemmaDescription.value = item.description
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
.ancient-wisdom-advisor {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-card {
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
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

.dilemma-tags {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.dilemma-tag {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #ebeef5;
  transition: all 0.3s;
}

.dilemma-tag:hover {
  border-color: #165DFF;
  box-shadow: 0 2px 12px 0 rgba(22, 93, 255, 0.1);
}

.dt-emoji {
  font-size: 24px;
}

.dt-name {
  font-weight: 600;
  color: #303133;
}

.dt-desc {
  font-size: 12px;
  color: #909399;
}

.school-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.school-card {
  border-radius: 8px;
  background: #fff;
  border: 2px solid;
  overflow: hidden;
  transition: all 0.3s;
}

.school-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.school-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  color: #fff;
  font-weight: 600;
}

.school-emoji {
  font-size: 18px;
}

.school-quote {
  padding: 12px;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  font-style: italic;
}

.school-sage {
  padding: 0 12px 12px;
  font-size: 12px;
  color: #909399;
  text-align: right;
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

.dilemma-category-section {
  margin-bottom: 24px;
}

.category-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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

.school-section {
  margin-bottom: 24px;
}

.school-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.school-chip {
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

.school-chip:hover:not(.disabled) {
  transform: translateY(-1px);
}

.school-chip.active {
  color: #fff;
}

.school-chip.disabled {
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

.wisdom-text {
  font-size: 15px;
  line-height: 1.8;
  color: #303133;
  white-space: pre-wrap;
  padding: 16px;
  background: #fff9e6;
  border-left: 4px solid #e6a23c;
  border-radius: 0 8px 8px 0;
}

.quote-block {
  padding: 16px 20px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.quote-content {
  font-size: 18px;
  color: #303133;
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: 8px;
  font-style: italic;
}

.quote-source {
  text-align: right;
  color: #909399;
  font-size: 13px;
}

.quote-explanation {
  padding: 12px;
  background: #fff;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
}

.exp-label {
  font-weight: 600;
  color: #303133;
}

.allusion-title {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.allusion-name {
  font-size: 16px;
  font-weight: 600;
  color: #165DFF;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.allusion-story {
  font-size: 14px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 12px;
}

.allusion-lesson {
  padding: 12px;
  background: #f0f9eb;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
  color: #67c23a;
}

.lesson-label {
  font-weight: 600;
  color: #67c23a;
}

.modern-text {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
  white-space: pre-wrap;
  padding: 16px;
  background: #ecf5ff;
  border-radius: 8px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  border-left: 3px solid #165DFF;
}

.action-num {
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

.action-content {
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
}

.mindset-text {
  font-size: 15px;
  line-height: 1.8;
  color: #e6a23c;
  font-style: italic;
  padding: 16px 20px;
  background: #fdf6ec;
  border-radius: 8px;
  text-align: center;
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

.history-dilemma {
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

.school-alert {
  margin-bottom: 12px;
}

.school-card-detailed {
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.school-sage-inline {
  font-size: 12px;
  opacity: 0.85;
  font-weight: 400;
}

.school-background {
  padding: 0 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #909399;
}

.bg-label {
  font-weight: 600;
  color: #606266;
}

.school-divider {
  margin: 10px 12px;
}

.school-boundaries {
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

.history-context-section {
  background: linear-gradient(135deg, #ecf5ff 0%, #ffffff 100%) !important;
}

.history-context-alert {
  background: #fff;
  border: 1px solid #d9ecff;
  border-radius: 8px;
}

.context-title {
  font-size: 14px;
  font-weight: 600;
  color: #165DFF;
}

.context-text {
  font-size: 13px;
  line-height: 1.8;
  color: #606266;
  display: block;
  margin-top: 4px;
}

.values-compare-section {
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%) !important;
  border: 1px solid #faecd8 !important;
}

.compare-header-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #fdf6ec;
  border-radius: 6px;
  font-size: 13px;
  color: #e6a23c;
  margin-bottom: 16px;
  line-height: 1.6;
}

.compare-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  overflow: hidden;
  margin-bottom: 16px;
}

.compare-card:last-child {
  margin-bottom: 0;
}

.compare-row {
  display: flex;
  padding: 14px 16px;
  gap: 12px;
  border-bottom: 1px dashed #ebeef5;
}

.compare-row:last-child {
  border-bottom: none;
}

.compare-ancient {
  background: #f5f7fa;
}

.compare-modern {
  background: #f0f9eb;
}

.compare-suggestion {
  background: #ecf5ff;
}

.compare-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  min-width: 90px;
  flex-shrink: 0;
}

.compare-ancient .compare-label {
  color: #909399;
}

.compare-modern .compare-label {
  color: #67c23a;
}

.compare-suggestion .compare-label {
  color: #165DFF;
}

.compare-content {
  font-size: 13px;
  line-height: 1.7;
  color: #303133;
  flex: 1;
}

.compare-arrow {
  text-align: center;
  padding: 6px;
  font-size: 12px;
  color: #c0c4cc;
  background: #fff;
  font-weight: 500;
}

@media (max-width: 768px) {
  .boundary-grid {
    grid-template-columns: 1fr;
  }

  .school-boundaries {
    flex-direction: column;
  }

  .compare-row {
    flex-direction: column;
    gap: 6px;
  }

  .compare-label {
    min-width: auto;
  }
}
</style>
