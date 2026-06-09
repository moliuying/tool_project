<template>
  <div class="programming-qna">
    <el-card class="intro-card">
      <div class="intro-header">
        <div class="intro-left">
          <div class="intro-icon">👨‍💻</div>
          <div class="intro-text">
            <h2 class="intro-title">编程问题解答专家</h2>
            <p class="intro-subtitle">
              输入编程语言语法、框架使用、算法实现、调试技巧、API调用等各类编程问题，
              AI以经验丰富的工程师视角给出准确解答并附带可运行的代码示例
            </p>
          </div>
        </div>
        <div class="intro-badges">
          <el-tag type="primary" effect="dark" size="large">🎯 语法解惑</el-tag>
          <el-tag type="success" effect="dark" size="large">🧩 框架实战</el-tag>
          <el-tag type="warning" effect="dark" size="large">⚡ 算法代码</el-tag>
          <el-tag type="danger" effect="dark" size="large">🐞 调试排错</el-tag>
        </div>
      </div>
      <el-divider />
      <div class="intro-sections">
        <div class="intro-section full-width">
          <h4 class="section-label">
            <el-icon color="#165DFF"><User /></el-icon>
            适用人群
          </h4>
          <div class="audience-tags">
            <div class="audience-tag">
              <span class="at-emoji">👨‍💼</span>
              <span class="at-name">在职开发者</span>
              <span class="at-desc">日常开发技术难题</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">🎓</span>
              <span class="at-name">编程学习者</span>
              <span class="at-desc">语法学习入门指导</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">📚</span>
              <span class="at-name">面试准备者</span>
              <span class="at-desc">算法与系统设计</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">🔄</span>
              <span class="at-name">技术转行者</span>
              <span class="at-desc">快速入门新技术</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">❤️</span>
              <span class="at-name">技术爱好者</span>
              <span class="at-desc">探索新技术方案</span>
            </div>
          </div>
        </div>

        <div class="intro-section full-width">
          <h4 class="section-label">
            <el-icon color="#00b42a"><Guide /></el-icon>
            擅长的技术领域
          </h4>
          <div class="expertise-grid">
            <div
              v-for="area in expertiseAreas"
              :key="area.name"
              class="expertise-card"
              :style="{ '--expertise-color': area.color }"
            >
              <div class="ec-icon">{{ area.icon }}</div>
              <div class="ec-content">
                <div class="ec-name">{{ area.name }}</div>
                <div class="ec-desc">{{ area.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="intro-section full-width">
          <h4 class="section-label">
            <el-icon color="#f53f3f"><EditPen /></el-icon>
            精通 / 熟练的编程语言
            <el-tag size="small" type="info" effect="plain" class="section-hint">按掌握程度排序</el-tag>
          </h4>
          <div class="language-grid">
            <div
              v-for="lang in supportedLanguages"
              :key="lang.name"
              class="lang-card"
              :style="{ '--lang-color': lang.color }"
            >
              <div class="lang-icon">{{ lang.icon }}</div>
              <div class="lang-info">
                <div class="lang-name">{{ lang.name }}</div>
                <div class="lang-desc">{{ lang.description }}</div>
              </div>
              <el-tag
                size="small"
                :type="lang.level === '精通' ? 'danger' : lang.level === '熟练' ? 'warning' : 'info'"
                effect="dark"
                round
                class="lang-level"
              >
                {{ lang.level }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="intro-section full-width">
          <h4 class="section-label">
            <el-icon color="#722ed1"><Grid /></el-icon>
            熟悉的技术框架与工具
            <el-tag size="small" type="info" effect="plain" class="section-hint">按类别分组</el-tag>
          </h4>
          <div class="framework-groups">
            <div v-for="group in ['前端', '后端', '嵌入式', '移动端', '数据库', '运维']" :key="group" class="framework-group">
              <div class="fg-title">
                <el-icon><Collection /></el-icon>
                {{ group }}
              </div>
              <div class="fg-list">
                <div
                  v-for="fw in supportedFrameworks.filter(f => f.category === group)"
                  :key="fw.name"
                  class="fw-tag"
                  :style="{ '--fw-color': fw.color }"
                  :title="fw.description"
                >
                  <span class="fw-icon">{{ fw.icon }}</span>
                  <span class="fw-name">{{ fw.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="intro-section full-width">
          <h4 class="section-label">
            <el-icon color="#722ed1"><Promotion /></el-icon>
            能力边界说明
            <el-tag size="small" type="info" effect="plain" class="section-hint">透明告知，避免误导</el-tag>
          </h4>
          <div class="boundary-groups">
            <div
              v-for="boundary in capabilityBoundaries"
              :key="boundary.type"
              class="boundary-card"
              :style="{ '--boundary-color': boundary.color }"
            >
              <div class="bc-header">
                <span class="bc-icon">{{ boundary.icon }}</span>
                <span class="bc-title">{{ boundary.title }}</span>
              </div>
              <ul class="bc-list">
                <li v-for="(item, i) in boundary.items" :key="i">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="intro-section full-width">
          <h4 class="section-label">
            <el-icon color="#14c9c9"><WarningFilled /></el-icon>
            支持的问题类型
          </h4>
          <div class="scene-tags">
            <el-tag v-for="cat in categoryOptions" :key="cat.value" size="large" effect="plain" class="scene-tag">
              {{ cat.icon }} {{ cat.label }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <ChatDotRound />
          </el-icon>
          <span>提问区</span>
          <el-tag size="small" type="primary" effect="dark">多语言 · 多框架 · 可运行代码</el-tag>
        </div>
      </template>

      <div class="question-section">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          <span>您的问题</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="question"
          type="textarea"
          :rows="4"
          placeholder="请详细描述您的编程问题。例如：
- Vue 3 中 ref 和 reactive 有什么区别？
- JavaScript 的 async/await 怎么处理异常？
- 快速排序算法的原理和 TypeScript 实现？
- 前端 axios 如何统一处理请求错误？"
          maxlength="2000"
          show-word-limit
          :disabled="isGenerating"
          resize="vertical"
          class="question-input"
        />

        <div class="quick-questions">
          <span class="sample-label">⚡ 快速提问：</span>
          <el-tag
            v-for="(item, i) in quickQuestions"
            :key="i"
            class="sample-tag"
            effect="plain"
            @click="applyQuickQuestion(item)"
          >
            {{ item.label }}
          </el-tag>
        </div>
      </div>

      <el-row :gutter="24" class="options-row">
        <el-col :span="8">
          <div class="section-title">
            <el-icon><Grid /></el-icon>
            <span>问题分类</span>
            <el-tag size="small" type="info" class="hint-tag">帮助更精准回答</el-tag>
          </div>
          <el-select
            v-model="selectedCategory"
            placeholder="选择分类（可选）"
            :disabled="isGenerating"
            class="full-width"
            clearable
          >
            <el-option
              v-for="cat in categoryOptions"
              :key="cat.value"
              :label="`${cat.icon} ${cat.label}`"
              :value="cat.value"
            />
          </el-select>
        </el-col>
        <el-col :span="8">
          <div class="section-title">
            <el-icon><Reading /></el-icon>
            <span>编程语言</span>
          </div>
          <el-select
            v-model="selectedLanguage"
            placeholder="选择语言（可选）"
            :disabled="isGenerating"
            class="full-width"
            clearable
            filterable
          >
            <el-option
              v-for="lang in languageOptions"
              :key="lang"
              :label="lang"
              :value="lang"
            />
          </el-select>
        </el-col>
        <el-col :span="8">
          <div class="section-title">
            <el-icon><Trophy /></el-icon>
            <span>难度级别</span>
          </div>
          <el-radio-group v-model="selectedDifficulty" :disabled="isGenerating">
            <el-radio-button
              v-for="diff in difficultyOptions"
              :key="diff.value"
              :value="diff.value"
            >
              {{ diff.label }}
            </el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>

      <div class="optional-section">
        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="📎 附加信息（代码上下文 / 报错信息）" name="extra">
            <el-row :gutter="24">
              <el-col :span="12">
                <div class="section-title">
                  <el-icon><Document /></el-icon>
                  <span>相关代码片段</span>
                </div>
                <el-input
                  v-model="codeContext"
                  type="textarea"
                  :rows="5"
                  placeholder="粘贴您遇到问题的代码片段（可选）"
                  :disabled="isGenerating"
                  resize="vertical"
                />
              </el-col>
              <el-col :span="12">
                <div class="section-title">
                  <el-icon><Warning /></el-icon>
                  <span>报错信息</span>
                </div>
                <el-input
                  v-model="errorMessage"
                  type="textarea"
                  :rows="5"
                  placeholder="粘贴完整的报错或异常信息（可选）"
                  :disabled="isGenerating"
                  resize="vertical"
                />
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="action-section">
        <el-button
          type="primary"
          size="large"
          :icon="MagicStick"
          :loading="isGenerating"
          :disabled="!canGenerate"
          @click="askQuestion"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 工程师正在分析您的问题并生成解答与代码示例…
            </span>
          </template>
          获取解答
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
          🔍 正在分析问题 → 查阅知识库 → 整理解答思路 → 编写示例代码 → 优化输出结果…
        </span>
      </div>
    </el-card>

    <el-card v-if="answer" class="answer-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>解答结果</span>
          <el-tag size="small" type="primary" effect="dark">
            {{ answer.categoryLabel }}
          </el-tag>
          <el-tag
            size="small"
            :type="getDifficultyTagType(answer.difficulty) as any"
          >
            {{ answer.difficultyLabel }}
          </el-tag>
          <div class="header-actions">
            <el-button size="small" :icon="RefreshRight" @click="askQuestion">
              重新解答
            </el-button>
            <el-button size="small" type="primary" :icon="CopyDocument" @click="copyAnswer">
              复制全部内容
            </el-button>
          </div>
        </div>
      </template>

      <div class="answer-summary">
        <el-alert :title="answer.summary" type="success" :closable="false" show-icon />
      </div>

      <div v-if="answer.capabilityNote" class="capability-note">
        <el-alert type="warning" :closable="false" show-icon>
          <template #title>
            <div class="capability-note-title">
              <el-icon><Promotion /></el-icon>
              <span>能力边界提示</span>
            </div>
          </template>
          <div class="capability-note-content">
            <p v-for="(line, idx) in answer.capabilityNote.split('\\n')" :key="idx">{{ line }}</p>
          </div>
        </el-alert>
      </div>

      <el-tabs v-model="activeTab" class="answer-tabs">
        <el-tab-pane label="📖 详细解答" name="detail">
          <div class="detail-section">
            <h4 class="subsection-title">
              <el-icon color="#165DFF"><InfoFilled /></el-icon>
              问题详解
            </h4>
            <div class="detail-content">
              {{ answer.detailedExplanation }}
            </div>
          </div>

          <div class="detail-section">
            <h4 class="subsection-title">
              <el-icon color="#67c23a"><CircleCheckFilled /></el-icon>
              核心要点
            </h4>
            <div class="keypoints-list">
              <div v-for="(point, idx) in answer.keyPoints" :key="idx" class="keypoint-item">
                <div class="keypoint-num">{{ idx + 1 }}</div>
                <span>{{ point }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="`💻 代码示例 (${answer.codeExamples.length})`" name="code">
          <div v-if="answer.codeExamples.length === 0" class="empty-tip">
            暂无代码示例
          </div>
          <div
            v-for="(example, idx) in answer.codeExamples"
            :key="idx"
            class="code-example-card"
          >
            <div class="code-example-header">
              <span class="code-example-title">📝 {{ example.title }}</span>
              <div class="code-example-actions">
                <el-tag size="small" type="info">{{ example.language }}</el-tag>
                <el-button
                  size="small"
                  text
                  :icon="CopyDocument"
                  @click="copyCode(example.code)"
                >
                  复制代码
                </el-button>
              </div>
            </div>
            <pre class="code-block"><code>{{ example.code }}</code></pre>
            <div class="code-explanation">
              <el-icon color="#e6a23c"><Bulb /></el-icon>
              <strong>说明：</strong>{{ example.explanation }}
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="⚠️ 常见陷阱 & ✅ 最佳实践" name="tips">
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="tips-section danger-tips">
                <h4 class="subsection-title">
                  <el-icon color="#f56c6c"><CircleCloseFilled /></el-icon>
                  常见陷阱 / 易错点
                </h4>
                <ul v-if="answer.commonPitfalls.length" class="tips-list">
                  <li v-for="(pitfall, idx) in answer.commonPitfalls" :key="idx">
                    {{ pitfall }}
                  </li>
                </ul>
                <div v-else class="empty-tip">暂无</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="tips-section success-tips">
                <h4 class="subsection-title">
                  <el-icon color="#67c23a"><CircleCheckFilled /></el-icon>
                  最佳实践 / 建议
                </h4>
                <ul v-if="answer.bestPractices.length" class="tips-list">
                  <li v-for="(practice, idx) in answer.bestPractices" :key="idx">
                    {{ practice }}
                  </li>
                </ul>
                <div v-else class="empty-tip">暂无</div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="🔗 相关主题 & 📚 参考资料" name="related">
          <div class="detail-section">
            <h4 class="subsection-title">
              <el-icon color="#165DFF"><Link /></el-icon>
              相关学习主题
            </h4>
            <div v-if="answer.relatedTopics.length" class="related-topics">
              <div
                v-for="(topic, idx) in answer.relatedTopics"
                :key="idx"
                class="related-topic-card"
              >
                <div class="rt-topic">{{ topic.topic }}</div>
                <div class="rt-desc">{{ topic.description }}</div>
              </div>
            </div>
            <div v-else class="empty-tip">暂无</div>
          </div>
          <div class="detail-section">
            <h4 class="subsection-title">
              <el-icon color="#e6a23c"><Reading /></el-icon>
              参考资料与延伸阅读
            </h4>
            <ul v-if="answer.references.length" class="refs-list">
              <li v-for="(ref, idx) in answer.references" :key="idx">
                📖 {{ ref }}
              </li>
            </ul>
            <div v-else class="empty-tip">暂无</div>
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
          <div class="history-question">
            <el-tag size="small" type="primary">{{ item.categoryLabel }}</el-tag>
            <el-tag size="small" :type="getDifficultyTagType(item.difficulty) as any">
              {{ item.difficultyLabel }}
            </el-tag>
            <span class="history-text">{{ truncateText(item.question, 80) }}</span>
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
  ChatDotRound,
  EditPen,
  MagicStick,
  Refresh,
  Loading,
  Finished,
  CopyDocument,
  RefreshRight,
  Bulb,
  Clock,
  InfoFilled,
  User,
  WarningFilled,
  Grid,
  Reading,
  Trophy,
  Document,
  Warning,
  CircleCheckFilled,
  CircleCloseFilled,
  Link,
  Guide,
  Collection,
  Promotion,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  programmingQnaApi,
  categoryOptions,
  difficultyOptions,
  languageOptions,
  quickQuestions,
  supportedLanguages,
  supportedFrameworks,
  expertiseAreas,
  capabilityBoundaries,
  type ProgrammingAnswer,
  type ProgrammingCategory,
  type DifficultyLevel,
} from '@/api/programmingQna'

interface HistoryItem {
  question: string
  category: ProgrammingCategory
  categoryLabel: string
  difficulty: DifficultyLevel
  difficultyLabel: string
  language?: string
  answer: ProgrammingAnswer
  time: string
}

const STORAGE_KEY = 'programming_qna_history'

const question = ref('')
const selectedCategory = ref<ProgrammingCategory | undefined>(undefined)
const selectedLanguage = ref<string>('')
const selectedDifficulty = ref<DifficultyLevel>(DifficultyLevel.INTERMEDIATE)
const codeContext = ref('')
const errorMessage = ref('')
const isGenerating = ref(false)
const answer = ref<ProgrammingAnswer | null>(null)
const activeTab = ref('detail')
const activeCollapse = ref<string[]>([])
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const canGenerate = computed(() => question.value.trim().length > 0)

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const getDifficultyTagType = (diff: DifficultyLevel): string => {
  const map = {
    [DifficultyLevel.BEGINNER]: 'success',
    [DifficultyLevel.INTERMEDIATE]: 'warning',
    [DifficultyLevel.ADVANCED]: 'danger',
  }
  return map[diff] || 'info'
}

const applyQuickQuestion = (item: { label: string; question: string; category: ProgrammingCategory }) => {
  question.value = item.question
  selectedCategory.value = item.category
}

const askQuestion = async () => {
  if (!canGenerate.value) return
  isGenerating.value = true
  answer.value = null

  try {
    const { data } = await programmingQnaApi.askQuestion({
      question: question.value.trim(),
      category: selectedCategory.value,
      difficulty: selectedDifficulty.value,
      language: selectedLanguage.value || undefined,
      codeContext: codeContext.value || undefined,
      errorMessage: errorMessage.value || undefined,
    })

    answer.value = data

    const historyItem: HistoryItem = {
      question: question.value.trim(),
      category: data.category,
      categoryLabel: data.categoryLabel,
      difficulty: data.difficulty,
      difficultyLabel: data.difficultyLabel,
      language: selectedLanguage.value || undefined,
      answer: data,
      time: new Date().toISOString(),
    }
    history.value.push(historyItem)
    saveHistory()

    ElMessage.success('解答生成完成')
  } catch (error: any) {
    ElMessage.error(error?.message || '生成解答失败，请稍后重试')
  } finally {
    isGenerating.value = false
  }
}

const resetAll = () => {
  question.value = ''
  selectedCategory.value = undefined
  selectedLanguage.value = ''
  selectedDifficulty.value = DifficultyLevel.INTERMEDIATE
  codeContext.value = ''
  errorMessage.value = ''
  answer.value = null
  activeCollapse.value = []
}

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code)
  ElMessage.success('代码已复制到剪贴板')
}

const copyAnswer = () => {
  if (!answer.value) return
  const a = answer.value
  let text = `【问题分类】${a.categoryLabel}  【难度】${a.difficultyLabel}\n\n`
  text += `【核心摘要】\n${a.summary}\n\n`
  text += `【详细说明】\n${a.detailedExplanation}\n\n`
  text += `【核心要点】\n${a.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n`
  if (a.codeExamples.length) {
    text += `【代码示例】\n`
    a.codeExamples.forEach((ex) => {
      text += `\n--- ${ex.title} ---\n`
      text += `\`\`\`${ex.language}\n${ex.code}\n\`\`\`\n`
      text += `说明：${ex.explanation}\n`
    })
    text += '\n'
  }
  if (a.commonPitfalls.length) {
    text += `【常见陷阱】\n${a.commonPitfalls.map((p) => `⚠️ ${p}`).join('\n')}\n\n`
  }
  if (a.bestPractices.length) {
    text += `【最佳实践】\n${a.bestPractices.map((p) => `✅ ${p}`).join('\n')}\n\n`
  }
  if (a.references.length) {
    text += `【参考资料】\n${a.references.map((r) => `📖 ${r}`).join('\n')}\n`
  }
  if (a.capabilityNote) {
    text += `\n【能力边界提示】\n${a.capabilityNote}\n`
  }

  navigator.clipboard.writeText(text)
  ElMessage.success('完整解答已复制到剪贴板')
}

const formatTime = (iso: string) => {
  const d = new Date(iso)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const truncateText = (text: string, max: number) => {
  if (text.length <= max) return text
  return text.substring(0, max) + '...'
}

const loadFromHistory = (item: HistoryItem) => {
  question.value = item.question
  selectedCategory.value = item.category
  selectedDifficulty.value = item.difficulty
  if (item.language) selectedLanguage.value = item.language
  answer.value = item.answer
  activeTab.value = 'detail'
  ElMessage.info('已载入历史记录')
}

const saveHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value.slice(-50)))
  } catch (e) {
    console.error('Failed to save history', e)
  }
}

const loadHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) history.value = JSON.parse(data)
  } catch (e) {
    console.error('Failed to load history', e)
  }
}

const clearHistory = () => {
  history.value = []
  localStorage.removeItem(STORAGE_KEY)
  ElMessage.success('历史记录已清空')
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.programming-qna {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-card {
  border-radius: 12px;
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
  gap: 16px;
  align-items: center;
}

.intro-icon {
  font-size: 48px;
}

.intro-title {
  margin: 0 0 6px 0;
  font-size: 24px;
  color: #1d2129;
}

.intro-subtitle {
  margin: 0;
  color: #4e5969;
  line-height: 1.6;
  max-width: 680px;
}

.intro-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.intro-sections {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.intro-section {
  flex: 1;
  min-width: 300px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: #1d2129;
  margin: 0 0 12px 0;
}

.audience-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.audience-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: #f7f8fa;
  border-radius: 8px;
  min-width: 110px;
}

.at-emoji {
  font-size: 24px;
}

.at-name {
  font-weight: 600;
  color: #1d2129;
  font-size: 13px;
}

.at-desc {
  font-size: 12px;
  color: #86909c;
}

.scene-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.scene-tag {
  font-size: 14px !important;
  padding: 6px 14px !important;
}

.section-hint {
  margin-left: 10px;
  font-weight: normal;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 10px;
}

.expertise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.expertise-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #f7f8fa;
  border-radius: 10px;
  border-left: 3px solid var(--expertise-color, #165DFF);
  transition: all 0.25s;
  cursor: default;
}

.expertise-card:hover {
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.ec-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.ec-content {
  flex: 1;
  min-width: 0;
}

.ec-name {
  font-weight: 600;
  color: #1d2129;
  font-size: 14px;
  margin-bottom: 4px;
}

.ec-desc {
  font-size: 12px;
  color: #86909c;
  line-height: 1.5;
}

.language-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.lang-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #f7f8fa;
  border-radius: 10px;
  transition: all 0.25s;
  border-top: 3px solid var(--lang-color, #165DFF);
}

.lang-card:hover {
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.lang-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.lang-info {
  flex: 1;
  min-width: 0;
}

.lang-name {
  font-weight: 600;
  color: #1d2129;
  font-size: 14px;
  margin-bottom: 3px;
}

.lang-desc {
  font-size: 12px;
  color: #86909c;
  line-height: 1.4;
}

.lang-level {
  flex-shrink: 0;
  font-size: 11px !important;
}

.framework-groups {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.framework-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fg-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #4e5969;
  padding-left: 2px;
}

.fg-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.fw-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #fff;
  border: 1px solid var(--fw-color, #165DFF);
  border-radius: 20px;
  font-size: 13px;
  color: var(--fw-color, #165DFF);
  font-weight: 500;
  transition: all 0.2s;
  cursor: default;
}

.fw-tag:hover {
  background: var(--fw-color, #165DFF);
  color: #fff;
  transform: scale(1.05);
}

.fw-icon {
  font-size: 16px;
}

.fw-name {
  white-space: nowrap;
}

.boundary-groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 14px;
}

.boundary-card {
  padding: 16px 18px;
  background: #f7f8fa;
  border-radius: 10px;
  border-left: 4px solid var(--boundary-color, #165DFF);
  transition: all 0.25s;
}

.boundary-card:hover {
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.bc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.bc-icon {
  font-size: 22px;
}

.bc-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--boundary-color, #1d2129);
}

.bc-list {
  margin: 0;
  padding-left: 20px;
  line-height: 1.9;
  font-size: 13px;
  color: #4e5969;
}

.bc-list li::marker {
  color: var(--boundary-color, #86909c);
}

.capability-note {
  margin-bottom: 16px;
}

.capability-note-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 14px;
  color: #b88230;
}

.capability-note-content {
  margin-top: 8px;
  line-height: 1.8;
}

.capability-note-content p {
  margin: 4px 0;
  color: #865825;
  font-size: 13px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.required-tag {
  color: #f53f3f;
}

.hint-tag {
  margin-left: 8px;
  font-weight: normal;
}

.question-input {
  margin-bottom: 12px;
}

.quick-questions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.sample-label {
  font-size: 13px;
  color: #4e5969;
  font-weight: 500;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.sample-tag:hover {
  background-color: #e8f3ff;
  border-color: #165DFF;
  color: #165DFF;
}

.options-row {
  margin-bottom: 20px;
}

.full-width {
  width: 100%;
}

.optional-section {
  margin-bottom: 20px;
}

.action-section {
  display: flex;
  gap: 12px;
}

.generate-btn {
  min-width: 200px;
}

.btn-loading-text {
  margin-left: 6px;
}

.generating-status {
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #e8f3ff 0%, #f0f7ff 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.generating-dots {
  display: flex;
  gap: 4px;
}

.generating-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #165DFF;
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
  color: #165DFF;
  font-weight: 500;
}

.answer-summary {
  margin-bottom: 16px;
}

.subsection-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #1d2129;
  margin: 0 0 12px 0;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-content {
  padding: 16px;
  background: #f7f8fa;
  border-radius: 8px;
  line-height: 1.8;
  color: #4e5969;
  white-space: pre-wrap;
}

.keypoints-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keypoint-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #e8f3ff 0%, #f0f7ff 100%);
  border-radius: 8px;
  line-height: 1.6;
}

.keypoint-num {
  width: 26px;
  height: 26px;
  background: #165DFF;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.code-example-card {
  border: 1px solid #e5e6eb;
  border-radius: 10px;
  margin-bottom: 16px;
  overflow: hidden;
}

.code-example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f7f8fa;
  border-bottom: 1px solid #e5e6eb;
}

.code-example-title {
  font-weight: 600;
  color: #1d2129;
}

.code-example-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.code-block {
  margin: 0;
  padding: 16px;
  background: #1d2129;
  color: #c9d1d9;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre;
}

.code-block code {
  font-family: inherit;
}

.code-explanation {
  padding: 12px 16px;
  background: #fffbe6;
  color: #86909c;
  line-height: 1.6;
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.tips-section {
  padding: 16px;
  border-radius: 8px;
}

.danger-tips {
  background: #fff2f0;
}

.success-tips {
  background: #f2fff4;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  line-height: 2;
  color: #4e5969;
}

.empty-tip {
  color: #c9cdd4;
  text-align: center;
  padding: 20px;
  font-style: italic;
}

.related-topics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.related-topic-card {
  padding: 14px;
  background: #f7f8fa;
  border-radius: 8px;
  border-left: 3px solid #165DFF;
}

.rt-topic {
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 4px;
}

.rt-desc {
  font-size: 13px;
  color: #86909c;
  line-height: 1.5;
}

.refs-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
  line-height: 2.2;
  color: #4e5969;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  padding: 12px 16px;
  background: #f7f8fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  background: #e8f3ff;
}

.history-time {
  font-size: 12px;
  color: #86909c;
  margin-bottom: 6px;
}

.history-question {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.history-text {
  color: #1d2129;
  font-size: 14px;
}

.history-footer {
  text-align: center;
  margin-top: 12px;
}
</style>
