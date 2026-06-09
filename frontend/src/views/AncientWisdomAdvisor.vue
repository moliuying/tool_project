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
  CircleClose
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
        mindset: '万般带不去，唯有业随身。你种下的每一份认真，终会在某处开花结果。'
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
  const text = `【${getSchoolLabel(r.school)}智慧解答】\n\n📜 智者开示：\n${r.wisdom}\n\n💬 经典格言：\n"${r.quote.text}" —— ${r.quote.source}\n释义：${r.quote.meaning}\n\n📖 相关典故：${r.allusion.title}\n${r.allusion.story}\n启示：${r.allusion.lesson}\n\n🔮 现代解读：\n${r.modernInterpretation}\n\n🎯 行动建议：\n${r.actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n🌿 心境寄语：\n${r.mindset}`
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

@media (max-width: 768px) {
  .boundary-grid {
    grid-template-columns: 1fr;
  }

  .school-boundaries {
    flex-direction: column;
  }
}
</style>
