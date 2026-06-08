<template>
  <div class="essay-generator">
    <el-card class="intro-card">
      <div class="intro-header">
        <div class="intro-left">
          <div class="intro-icon">📝</div>
          <div class="intro-text">
            <h2 class="intro-title">小学生主题作文生成器</h2>
            <p class="intro-subtitle">
              输入作文题目、主题或关键词，AI 围绕主题生成符合小学生认知水平和语言风格的作文范文，帮助家长、学生和教师在作文备课、课后练习和作文参考时快速获得高质量的小学生作文示例
            </p>
          </div>
        </div>
        <div class="intro-badges">
          <el-tag type="primary" effect="dark" size="large">🎒 {{ gradeOptions.length }} 个年级覆盖</el-tag>
          <el-tag type="success" effect="dark" size="large">✍️ {{ essayTypes.length }} 种作文类型</el-tag>
          <el-tag type="warning" effect="dark" size="large">🌟 多场景适用</el-tag>
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
              <span class="at-emoji">👨‍👩‍👧</span>
              <span class="at-name">家长辅导</span>
              <span class="at-desc">辅导孩子写作文</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">👩‍🏫</span>
              <span class="at-name">语文老师</span>
              <span class="at-desc">备课、范文参考</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">🎒</span>
              <span class="at-name">小学生</span>
              <span class="at-desc">学习写作、课后练习</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">🏆</span>
              <span class="at-name">竞赛准备</span>
              <span class="at-desc">作文竞赛赛前练习</span>
            </div>
          </div>
        </div>
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><Grid /></el-icon>
            典型应用场景
          </h4>
          <div class="scene-tags">
            <el-tag size="large" effect="plain">📚 语文作业</el-tag>
            <el-tag size="large" effect="plain">🏆 作文竞赛</el-tag>
            <el-tag size="large" effect="plain">🎊 节日主题写作</el-tag>
            <el-tag size="large" effect="plain">🖼️ 看图写话</el-tag>
            <el-tag size="large" effect="plain">📖 课后练习</el-tag>
            <el-tag size="large" effect="plain">✏️ 日记周记</el-tag>
            <el-tag size="large" effect="plain">📝 备课参考</el-tag>
            <el-tag size="large" effect="plain">🌟 好词好句积累</el-tag>
          </div>
        </div>
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><Collection /></el-icon>
            支持的 {{ essayTypes.length }} 种作文类型
          </h4>
          <div class="type-overview-grid">
            <div
              v-for="type in essayTypes"
              :key="type.value"
              class="type-overview-card"
            >
              <div class="toc-header">
                <span class="toc-emoji">{{ type.emoji }}</span>
                <span class="toc-label">{{ type.label }}</span>
              </div>
              <div class="toc-desc">{{ type.desc }}</div>
              <div class="toc-list">
                <el-tag
                  v-for="scene in type.typicalScenes.slice(0, 3)"
                  :key="scene"
                  size="small"
                  effect="plain"
                  type="info"
                >{{ scene }}</el-tag>
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
        <el-step title="输入作文主题" description="题目、关键词或中心思想" />
        <el-step title="选择参数" description="年级、类型、字数、风格" />
        <el-step title="生成范文" description="AI 一键生成优质作文" />
        <el-step title="查看与优化" description="复制、导出、好词好句参考" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Document /></el-icon>
            <div class="exp-text">
              <div class="exp-num">1 ~ 3 篇范文</div>
              <div class="exp-label">每次生成可选数量对比</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">{{ wordCountOptions.length }} 档字数</div>
              <div class="exp-label">100~800字年级适配</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Star /></el-icon>
            <div class="exp-text">
              <div class="exp-num">好词好句推荐</div>
              <div class="exp-label">附带写作素材积累</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Bulb /></el-icon>
            <div class="exp-text">
              <div class="exp-num">名师点评</div>
              <div class="exp-label">写作亮点与改进建议</div>
            </div>
          </div>
        </div>
        <el-divider />
        <h4 class="expectation-title">📖 各年级字数与难度参考</h4>
        <el-table :data="gradeReferenceTable" border size="small" class="grade-table">
          <el-table-column prop="grade" label="年级" width="100" align="center">
            <template #default="{ row }">
              <el-tag type="primary" size="small">{{ row.grade }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="wordCount" label="建议字数" width="120" align="center" />
          <el-table-column prop="features" label="写作能力要求" />
          <el-table-column prop="typicalTypes" label="常见作文类型" width="200">
            <template #default="{ row }">
              <el-tag v-for="t in row.typicalTypes" :key="t" size="small" effect="plain" style="margin-right: 4px;">{{ t }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <Edit />
          </el-icon>
          <span>AI 小学生作文生成</span>
          <el-tag size="small" type="warning">多类型 · 多年级 · 多版本</el-tag>
        </div>
      </template>

      <div class="input-section">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          <span>作文题目 / 主题 / 关键词</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="formData.topic"
          type="textarea"
          :rows="3"
          placeholder="例如：&#10;• 题目：我的妈妈&#10;• 主题：春天来了&#10;• 关键词：坚强、努力、成功&#10;• 看图写话：描述图片内容（可输入图片大意）"
          maxlength="200"
          show-word-limit
          :disabled="isGenerating"
          resize="vertical"
        />
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Star /></el-icon>
          <span>要求包含的关键词（可选，每行一个）</span>
        </div>
        <el-input
          v-model="keywordsText"
          type="textarea"
          :rows="3"
          placeholder="例如：&#10;春暖花开&#10;鸟语花香&#10;生机勃勃"
          :disabled="isGenerating"
          resize="vertical"
        />
      </div>

      <div class="two-col-section">
        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><User /></el-icon>
            <span>适用年级</span>
            <span class="required-tag">*</span>
          </div>
          <el-select v-model="formData.grade" placeholder="请选择年级" :disabled="isGenerating" style="width: 100%">
            <el-option v-for="g in gradeOptions" :key="g.value" :label="g.label" :value="g.value">
              <span style="float: left;">{{ g.emoji }} {{ g.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;">{{ g.wordHint }}</span>
            </el-option>
          </el-select>
        </div>

        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><Collection /></el-icon>
            <span>作文类型</span>
            <span class="required-tag">*</span>
          </div>
          <el-select v-model="formData.essayType" placeholder="请选择作文类型" :disabled="isGenerating" style="width: 100%">
            <el-option v-for="t in essayTypes" :key="t.value" :label="t.label" :value="t.value">
              <span style="float: left;">{{ t.emoji }} {{ t.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;">{{ t.desc }}</span>
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="two-col-section">
        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            <span>字数要求</span>
          </div>
          <div class="wordcount-options">
            <div
              v-for="opt in wordCountOptions"
              :key="opt.value"
              class="wordcount-card"
              :class="{ active: formData.wordCount === opt.value, disabled: isGenerating }"
              @click="!isGenerating && (formData.wordCount = opt.value)"
            >
              <div class="wc-num">{{ opt.label }}</div>
              <div class="wc-desc">{{ opt.hint }}</div>
            </div>
          </div>
        </div>

        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><MagicStick /></el-icon>
            <span>写作风格（可选）</span>
          </div>
          <div class="style-options">
            <div
              v-for="style in writingStyles"
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
            <el-tag size="small" type="info">不选则根据年级和类型智能匹配</el-tag>
          </div>
        </div>
      </div>

      <div class="two-col-section">
        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><ChatDotRound /></el-icon>
            <span>补充要求（可选）</span>
          </div>
          <el-input
            v-model="formData.additionalNotes"
            type="textarea"
            :rows="2"
            placeholder="例如：需要使用比喻句、要有开头结尾、包含对话描写、采用总分总结构..."
            maxlength="200"
            show-word-limit
            :disabled="isGenerating"
            resize="none"
          />
        </div>

        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><Files /></el-icon>
            <span>生成篇数</span>
          </div>
          <div class="version-options">
            <div
              v-for="opt in versionOptions"
              :key="opt.value"
              class="version-card"
              :class="{ active: formData.versionCount === opt.value, disabled: isGenerating }"
              @click="!isGenerating && (formData.versionCount = opt.value)"
            >
              <div class="version-num">{{ opt.value }}</div>
              <div class="version-label">篇范文</div>
              <div class="version-desc">{{ opt.desc }}</div>
            </div>
          </div>
        </div>
      </div>

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

      <div class="action-section">
        <el-button
          type="primary"
          size="large"
          :icon="MagicStick"
          :loading="isGenerating"
          :disabled="!canGenerate"
          @click="generateEssay"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 正在为 {{ getGradeLabel(formData.grade) }} 学生生成「{{ getEssayTypeLabel(formData.essayType) }}」范文…
            </span>
          </template>
          生成作文范文
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
          ✍️ 正在围绕「{{ formData.topic }}」主题，融合 {{ keywordsList.length }} 个关键词
          <span v-if="selectedStyles.length > 0"> + {{ selectedStyles.length }} 种风格偏好</span>
          ，为 {{ getGradeLabel(formData.grade) }} 学生创作 {{ formData.versionCount }} 篇优质范文…
        </span>
      </div>
    </el-card>

    <el-card v-if="generatedEssays.length > 0" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>生成结果</span>
          <el-tag size="small" type="success">
            {{ getGradeLabel(formData.grade) }} · {{ getEssayTypeLabel(formData.essayType) }}
          </el-tag>
          <el-tag v-if="selectedStyles.length > 0" size="small" type="warning" effect="light">
            风格：{{ selectedStyles.map(s => getStyleLabel(s)).join('+') }}
          </el-tag>
          <el-tag size="small" type="info">共 {{ generatedEssays.length }} 篇范文</el-tag>
          <div class="header-actions">
            <el-button size="small" type="primary" link :icon="CopyDocument" @click="copyAllEssays">
              复制全部范文
            </el-button>
          </div>
        </div>
      </template>

      <div class="version-tabs">
        <div
          v-for="(_, idx) in generatedEssays"
          :key="idx"
          class="version-tab"
          :class="{ active: activeEssay === idx }"
          @click="activeEssay = idx"
        >
          范文 {{ idx + 1 }}
          <el-tag size="small" :type="getVersionTagType(idx)">
            {{ generatedEssays[idx].styleLabel }}
          </el-tag>
        </div>
      </div>

      <div v-if="currentEssay" class="result-content">
        <div class="result-section title-section">
          <div class="section-title-sm">
            <el-icon color="#e6a23c"><EditPen /></el-icon>
            <span>📌 作文题目</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentEssay.title)">复制</el-button>
          </div>
          <div class="result-title">{{ currentEssay.title }}</div>
        </div>

        <div class="result-section">
          <div class="section-title-sm">
            <el-icon color="#165DFF"><Document /></el-icon>
            <span>📝 作文正文</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentEssay.content)">复制</el-button>
          </div>
          <div class="essay-content">
            <p v-for="(para, pIdx) in currentEssay.paragraphs" :key="pIdx" class="essay-paragraph">
              {{ para }}
            </p>
          </div>
          <div class="essay-meta">
            <el-tag size="small" type="info">字数：约 {{ currentEssay.wordCount }} 字</el-tag>
            <el-tag size="small" type="success">段落：{{ currentEssay.paragraphs.length }} 段</el-tag>
          </div>
        </div>

        <div v-if="currentEssay.goodWords && currentEssay.goodWords.length > 0" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#e6a23c"><Star /></el-icon>
            <span>🌟 好词积累</span>
          </div>
          <div class="good-words">
            <el-tag
              v-for="(word, wi) in currentEssay.goodWords"
              :key="wi"
              class="good-word-tag"
              effect="plain"
              type="warning"
              size="large"
            >{{ word }}</el-tag>
          </div>
        </div>

        <div v-if="currentEssay.goodSentences && currentEssay.goodSentences.length > 0" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#67c23a"><ChatLineRound /></el-icon>
            <span>✨ 好句赏析</span>
          </div>
          <el-alert
            v-for="(sentence, si) in currentEssay.goodSentences"
            :key="si"
            :title="sentence"
            type="success"
            :closable="false"
            show-icon
            class="good-sentence"
          />
        </div>

        <div v-if="currentEssay.teacherComment" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#722ed1"><ChatDotRound /></el-icon>
            <span>👩‍🏫 名师点评</span>
          </div>
          <div class="teacher-comment">
            <div class="comment-box">
              <div class="comment-section">
                <div class="comment-label highlight">
                  <el-icon color="#67c23a"><CircleCheck /></el-icon>
                  写作亮点
                </div>
                <ul class="comment-list">
                  <li v-for="(h, hi) in currentEssay.teacherComment.highlights" :key="hi">{{ h }}</li>
                </ul>
              </div>
              <div class="comment-section">
                <div class="comment-label suggest">
                  <el-icon color="#e6a23c"><Bulb /></el-icon>
                  改进建议
                </div>
                <ul class="comment-list">
                  <li v-for="(s, si) in currentEssay.teacherComment.suggestions" :key="si">{{ s }}</li>
                </ul>
              </div>
              <div class="comment-section">
                <div class="comment-label score">
                  <el-icon color="#f56c6c"><Star /></el-icon>
                  综合评分：{{ currentEssay.teacherComment.score }} / 100
                </div>
                <p class="comment-overall">{{ currentEssay.teacherComment.overall }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="result-footer">
          <el-button type="primary" :icon="Download" @click="copyCurrentFull">
            复制完整内容（范文 {{ activeEssay + 1 }}）
          </el-button>
          <el-button :icon="RefreshRight" @click="regenerateEssay">
            换一篇
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
          <div class="history-topic">
            <el-tag size="small" type="primary">{{ getGradeLabel(item.formData.grade) }}</el-tag>
            <el-tag size="small" type="success">{{ getEssayTypeLabel(item.formData.essayType) }}</el-tag>
            <span class="history-text">{{ truncateText(item.formData.topic, 40) }}</span>
          </div>
          <div class="history-meta">
            <el-tag size="small" type="info">{{ item.essays.length }}篇范文</el-tag>
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
  Collection,
  EditPen,
  Star,
  ChatDotRound,
  MagicStick,
  Refresh,
  Loading,
  Finished,
  CopyDocument,
  Download,
  Clock,
  InfoFilled,
  Document,
  RefreshRight,
  Bulb,
  User,
  Grid,
  ChatLineRound,
  CircleCheck,
  Files
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface FormData {
  topic: string
  grade: string
  essayType: string
  wordCount: string
  additionalNotes: string
  versionCount: number
}

interface TeacherComment {
  highlights: string[]
  suggestions: string[]
  score: number
  overall: string
}

interface EssayResult {
  title: string
  content: string
  paragraphs: string[]
  wordCount: number
  goodWords: string[]
  goodSentences: string[]
  teacherComment: TeacherComment
  style: string
  styleLabel: string
}

interface HistoryItem {
  formData: FormData
  keywordsText: string
  styles: string[]
  essays: EssayResult[]
  time: string
}

interface QuickSample {
  label: string
  topic: string
  keywords: string[]
  grade: string
  essayType: string
  wordCount: string
  additionalNotes: string
  hintStyles: string[]
}

const STORAGE_KEY = 'essay_generator_history'

const gradeOptions = [
  { value: 'g1', label: '一年级', emoji: '🌱', wordHint: '100-200字' },
  { value: 'g2', label: '二年级', emoji: '🌿', wordHint: '150-250字' },
  { value: 'g3', label: '三年级', emoji: '🌳', wordHint: '300-400字' },
  { value: 'g4', label: '四年级', emoji: '🌲', wordHint: '400-500字' },
  { value: 'g5', label: '五年级', emoji: '🌴', wordHint: '500-600字' },
  { value: 'g6', label: '六年级', emoji: '🎋', wordHint: '600-800字' }
]

const essayTypes = [
  { value: 'narrative', label: '记叙文', emoji: '📖', desc: '写人记事', typicalScenes: ['我的妈妈', '难忘的一件事', '记一次活动'] },
  { value: 'descriptive', label: '状物写景', emoji: '🌺', desc: '描写景物事物', typicalScenes: ['春天来了', '我的小猫咪', '美丽的校园'] },
  { value: 'argumentative', label: '议论文', emoji: '💡', desc: '说明道理', typicalScenes: ['谈诚信', '论坚持', '我的观点'] },
  { value: 'imaginative', label: '想象作文', emoji: '🌈', desc: '童话科幻', typicalScenes: ['二十年后的我', '假如我是小鸟', '未来的学校'] },
  { value: 'picture', label: '看图写话', emoji: '🖼️', desc: '看图写作', typicalScenes: ['看图写一段话', '根据图片讲故事', '漫画作文'] },
  { value: 'diary', label: '日记周记', emoji: '📔', desc: '日常记录', typicalScenes: ['一则日记', '周末的一天', '我的周记'] },
  { value: 'letter', label: '书信应用', emoji: '✉️', desc: '书信便条', typicalScenes: ['给妈妈的一封信', '建议书', '感谢信'] },
  { value: 'festival', label: '节日主题', emoji: '🎊', desc: '节日作文', typicalScenes: ['快乐的春节', '中秋节赏月', '难忘的儿童节'] }
]

const wordCountOptions = [
  { value: 'short', label: '简短', hint: '约100-200字' },
  { value: 'medium', label: '标准', hint: '约300-450字' },
  { value: 'long', label: '详细', hint: '约500-800字' }
]

const writingStyles = [
  { value: 'simple', label: '朴实真诚', emoji: '😊' },
  { value: 'literary', label: '优美生动', emoji: '🎨' },
  { value: 'humorous', label: '活泼有趣', emoji: '😄' },
  { value: 'touching', label: '感人至深', emoji: '🥹' },
  { value: 'inspiring', label: '励志向上', emoji: '💪' },
  { value: 'creative', label: '新颖独特', emoji: '💡' }
]

const versionOptions = [
  { value: 1, desc: '精选一篇' },
  { value: 2, desc: '两种角度' },
  { value: 3, desc: '全面参考' }
]

const gradeReferenceTable = [
  { grade: '一二年级', wordCount: '100-250字', features: '能写一段完整的话，会用简单的修饰词，句子通顺', typicalTypes: ['看图写话', '日记'] },
  { grade: '三四年级', wordCount: '300-500字', features: '有开头结尾，会使用修辞手法，内容较具体', typicalTypes: ['记叙文', '写景'] },
  { grade: '五六年级', wordCount: '500-800字', features: '结构完整，中心明确，有真情实感，语言生动', typicalTypes: ['记叙文', '议论文', '想象'] }
]

const quickSamples: QuickSample[] = [
  {
    label: '我的妈妈',
    topic: '我的妈妈',
    keywords: ['温柔', '勤劳', '爱我'],
    grade: 'g3',
    essayType: 'narrative',
    wordCount: 'medium',
    additionalNotes: '要有具体事例，真情实感',
    hintStyles: ['touching', 'simple']
  },
  {
    label: '春天来了',
    topic: '春天来了',
    keywords: ['春暖花开', '鸟语花香', '万物复苏'],
    grade: 'g4',
    essayType: 'descriptive',
    wordCount: 'medium',
    additionalNotes: '运用比喻拟人修辞手法，按顺序描写',
    hintStyles: ['literary']
  },
  {
    label: '难忘的一件事',
    topic: '记一件难忘的事',
    keywords: ['第一次', '勇气', '成长'],
    grade: 'g5',
    essayType: 'narrative',
    wordCount: 'long',
    additionalNotes: '要有起因经过结果，写出心理变化',
    hintStyles: ['inspiring', 'touching']
  },
  {
    label: '看图写话',
    topic: '看图写话：公园里，小朋友们在植树，有的挖坑，有的扶树，有的浇水',
    keywords: ['植树节', '劳动', '绿化'],
    grade: 'g2',
    essayType: 'picture',
    wordCount: 'short',
    additionalNotes: '按顺序观察，写清楚谁在什么地方干什么',
    hintStyles: ['simple', 'humorous']
  },
  {
    label: '二十年后的我',
    topic: '二十年后的我',
    keywords: ['梦想', '未来', '科学家'],
    grade: 'g6',
    essayType: 'imaginative',
    wordCount: 'long',
    additionalNotes: '大胆想象，要有具体场景描写',
    hintStyles: ['creative', 'inspiring']
  },
  {
    label: '快乐的春节',
    topic: '快乐的春节',
    keywords: ['贴春联', '包饺子', '拜年', '压岁钱'],
    grade: 'g4',
    essayType: 'festival',
    wordCount: 'medium',
    additionalNotes: '突出节日氛围和快乐心情',
    hintStyles: ['humorous', 'literary']
  }
]

const formData = ref<FormData>({
  topic: '',
  grade: 'g3',
  essayType: 'narrative',
  wordCount: 'medium',
  additionalNotes: '',
  versionCount: 1
})

const keywordsText = ref('')
const selectedStyles = ref<string[]>([])
const isGenerating = ref(false)
const generatedEssays = ref<EssayResult[]>([])
const activeEssay = ref(0)
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const keywordsList = computed(() =>
  keywordsText.value.split('\n').map(k => k.trim()).filter(k => k.length > 0)
)

const canGenerate = computed(() => {
  return formData.value.topic.trim().length > 0 && formData.value.grade && formData.value.essayType
})

const currentStep = computed(() => {
  if (generatedEssays.value.length > 0 && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (formData.value.topic || formData.value.grade) return 1
  return 0
})

const currentEssay = computed(() => generatedEssays.value[activeEssay.value] || null)

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const getGradeLabel = (value: string) => {
  const found = gradeOptions.find(g => g.value === value)
  return found?.label || value
}

const getEssayTypeLabel = (value: string) => {
  const found = essayTypes.find(t => t.value === value)
  return found?.label || value
}

const getStyleLabel = (value: string) => {
  const found = writingStyles.find(s => s.value === value)
  return found?.label || value
}

const getVersionTagType = (idx: number): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const types: Array<'' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = ['primary', 'success', 'warning']
  return types[idx % types.length]
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

const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  if (sameDay) return `今天 ${time}`
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return `昨天 ${time}`
  return `${date.getMonth() + 1}/${date.getDate()} ${time}`
}

const applySample = (sample: QuickSample) => {
  formData.value.topic = sample.topic
  keywordsText.value = sample.keywords.join('\n')
  formData.value.grade = sample.grade
  formData.value.essayType = sample.essayType
  formData.value.wordCount = sample.wordCount
  formData.value.additionalNotes = sample.additionalNotes
  selectedStyles.value = [...sample.hintStyles]
  ElMessage.success('已载入示例数据')
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const pickMany = <T,>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, arr.length))
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const getWordCountConfig = (wordCount: string) => {
  const configs: Record<string, { min: number; max: number; paraCount: number }> = {
    short: { min: 120, max: 220, paraCount: 3 },
    medium: { min: 320, max: 480, paraCount: 4 },
    long: { min: 520, max: 780, paraCount: 5 }
  }
  return configs[wordCount] || configs.medium
}

const getGradeLevel = (grade: string) => {
  const gradeNum = parseInt(grade.replace('g', ''))
  if (gradeNum <= 2) return 'lower'
  if (gradeNum <= 4) return 'middle'
  return 'upper'
}

const generateTitle = (topic: string, essayType: string, keywords: string[]): string => {
  const cleanTopic = topic.replace(/[《》""''「」]/g, '').trim()
  const topicPatterns: Record<string, string[]> = {
    narrative: [
      `${cleanTopic}`,
      `记${cleanTopic}`,
      `我心中的${cleanTopic}`,
      `${cleanTopic}二三事`,
      `难忘的${cleanTopic}`
    ],
    descriptive: [
      `${cleanTopic}`,
      `美丽的${cleanTopic}`,
      `我爱${cleanTopic}`,
      `${cleanTopic}真美`,
      `走进${cleanTopic}`
    ],
    argumentative: [
      `谈${cleanTopic}`,
      `论${cleanTopic}`,
      `${cleanTopic}之我见`,
      `由${cleanTopic}想到的`,
      `${cleanTopic}的力量`
    ],
    imaginative: [
      `${cleanTopic}`,
      `假如我是${cleanTopic}`,
      `${cleanTopic}历险记`,
      `二十年后的${cleanTopic}`,
      `神奇的${cleanTopic}`
    ],
    picture: [
      `看图写话：${cleanTopic}`,
      `一幅有趣的画`,
      `看图写一段话`,
      `图中的故事`,
      `观图有感`
    ],
    diary: [
      `${cleanTopic}日记一则`,
      `记${cleanTopic}的一天`,
      `我的周末日记`,
      `一件小事`,
      `今天我真开心`
    ],
    letter: [
      `给${cleanTopic}的一封信`,
      `写给${cleanTopic}的信`,
      `一封感谢信`,
      `给${cleanTopic}的建议书`,
      `${cleanTopic}，我想对你说`
    ],
    festival: [
      `快乐的${cleanTopic}`,
      `难忘的${cleanTopic}`,
      `${cleanTopic}见闻`,
      `我爱${cleanTopic}`,
      `${cleanTopic}的味道`
    ]
  }
  const patterns = topicPatterns[essayType] || topicPatterns.narrative
  return pick(patterns)
}

const generateEssayContent = (
  topic: string,
  essayType: string,
  grade: string,
  keywords: string[],
  additionalNotes: string,
  styles: string[]
): { paragraphs: string[]; content: string; wordCount: number } => {
  const gradeLevel = getGradeLevel(grade)
  const wcConfig = getWordCountConfig(formData.value.wordCount)

  const openingTemplates: Record<string, string[]> = {
    narrative: [
      `在我的记忆中，有一件事让我久久不能忘怀，那就是关于${topic}的故事。`,
      `有人说，生活是一本丰富多彩的书，而${topic}就是这本书中最精彩的一页。`,
      `每当想起${topic}，我的心里就充满了温暖和感动。`,
      `时间像流水一样匆匆流逝，但${topic}这件事，却深深地刻在了我的心里。`
    ],
    descriptive: [
      `春天来了，万物复苏，到处都充满了生机。${topic}更是美得让人陶醉。`,
      `有人喜欢雄伟的高山，有人喜欢辽阔的大海，而我最喜欢的还是${topic}。`,
      `今天，我来到了${topic}，眼前的景象让我惊叹不已。`,
      `世界上有许许多多美丽的事物，而我觉得最美丽的就是${topic}。`
    ],
    argumentative: [
      `什么是${topic}？有人说它是一种品质，有人说它是一种力量，而我认为它是我们成长路上不可或缺的伙伴。`,
      `在生活中，我们经常会听到关于${topic}的讨论。那么，${topic}到底有多重要呢？`,
      `古人说："人无信不立。"其实不仅仅是诚信，${topic}同样是我们做人做事的根本。`
    ],
    imaginative: [
      `一天晚上，我做了一个奇怪的梦，梦见自己变成了${topic}。`,
      `假如我是${topic}，我一定会做许许多多有意义的事情。`,
      `二十年后，科技飞速发展，${topic}也发生了翻天覆地的变化。`,
      `在一个遥远的地方，有一个神奇的王国，那里住着${topic}。`
    ],
    picture: [
      `今天，我看到了一幅有趣的图画，画中描绘的是${topic}。让我们一起来看看吧！`,
      `这是一幅充满生活气息的图画，画里的故事可有意思了。`,
      `仔细观察这幅画，我仿佛听到了画中人物的欢声笑语。`
    ],
    diary: [
      `${new Date().toLocaleDateString('zh-CN')}  星期${['日','一','二','三','四','五','六'][new Date().getDay()]}  天气晴`,
      `今天是个特别的日子，因为${topic}，我度过了开心又充实的一天。`
    ],
    letter: [
      `亲爱的${topic}：`,
      `您好！`,
      `好久不见，您最近身体好吗？`
    ],
    festival: [
      `"爆竹声中一岁除，春风送暖入屠苏。"每当听到这句诗，我就想起了${topic}。`,
      `盼星星，盼月亮，终于盼来了一年一度的${topic}。`,
      `${topic}是我最喜欢的节日，每到这一天，家家户户都喜气洋洋的。`
    ]
  }

  const bodyTemplates: Record<string, string[][]> = {
    narrative: [
      [
        `记得那是一个阳光明媚的早晨，我早早地起了床，心里既紧张又兴奋。因为今天我要第一次尝试关于${topic}的事情。`,
        `一开始，我觉得这件事很简单，可是真正做起来才发现并没有那么容易。我遇到了很多困难，好几次都想放弃。`,
        `但是，想起妈妈平时对我说的话："做任何事情都要有耐心，不能半途而废。"我又鼓起勇气，继续坚持下去。`,
        `终于，在我的不懈努力下，我成功了！那一刻，我的心里比吃了蜜还要甜。`
      ],
      [
        `那天下午，我们全班同学一起去参加关于${topic}的活动。大家都兴高采烈，一路上有说有笑。`,
        `到了目的地，老师给我们分配了任务。我和几个好朋友分到了一组，我们决定团结合作，一起完成任务。`,
        `活动过程中发生了很多有趣的事情，大家互相帮助，互相鼓励，每个人都尽了自己最大的努力。`,
        `活动结束的时候，虽然大家都很累，但是每个人的脸上都洋溢着幸福的笑容。`
      ]
    ],
    descriptive: [
      [
        `你看，${topic}的样子多美啊！远远望去，就像一幅美丽的画卷。`,
        `走近一看，更是让人心旷神怡。各种各样的颜色交织在一起，红的像火，粉的像霞，白的像雪，美丽极了。`,
        `微风轻轻吹过，带来一阵阵清香，让人闻了神清气爽。偶尔还能听到几声清脆的鸟鸣，仿佛在唱着欢快的歌。`,
        `看到这么美丽的景色，我不禁陶醉其中，久久不愿离去。`
      ],
      [
        `${topic}一年四季都有不同的美景。春天，它生机勃勃，万物复苏；夏天，它郁郁葱葱，充满活力；秋天，它金黄一片，硕果累累；冬天，它银装素裹，静谧安详。`,
        `清晨，${topic}在薄雾中若隐若现，就像一位蒙着面纱的少女，神秘而美丽。`,
        `傍晚，夕阳的余晖洒在${topic}上，给它镀上了一层金色的光芒，显得格外迷人。`,
        `我爱这美丽的${topic}，它给我的生活带来了无限的欢乐。`
      ]
    ],
    argumentative: [
      [
        `首先，${topic}是我们成长路上的指明灯。有了它，我们才能在人生的道路上不迷失方向。`,
        `其次，${topic}能让我们变得更加优秀。古今中外，凡是取得伟大成就的人，无一不具备${topic}这种品质。`,
        `相反，如果一个人缺少${topic}，那么他在学习和生活中就会遇到很多困难，很难取得成功。`,
        `所以，我们要从小培养${topic}的品质，让它伴随我们成长。`
      ],
      [
        `在生活中，我就有过这样的亲身经历。以前我总是不明白${topic}的重要性，直到有一次...`,
        `那件事让我深刻地认识到，${topic}对一个人的成长是多么重要。从那以后，我就暗下决心，一定要做一个有${topic}的人。`,
        `同学们，让我们一起行动起来，从身边的小事做起，培养${topic}的好品质吧！`
      ]
    ],
    imaginative: [
      [
        `变成${topic}之后，我发现自己拥有了神奇的能力。我可以飞到天空中，和白云做伴，和小鸟一起唱歌。`,
        `我飞到了学校，看到同学们正在认真地学习。我悄悄地帮他们整理好书桌，又飞到老师身边，为老师扇风解热。`,
        `接着，我又飞到了公园里，看到一位老奶奶正在吃力地过马路，我赶紧飞过去，轻轻地扶着她安全地走过了马路。`,
        `做了这么多好事，我心里美滋滋的。正当我想继续帮助更多人的时候，闹钟响了，原来这是一场梦。虽然是梦，但我决定，以后一定要像梦中那样，做一个乐于助人的好孩子。`
      ],
      [
        `二十年后的${topic}可神奇了！让我来给你们介绍介绍吧。`,
        `未来的${topic}有许多先进的功能。它不仅会说话，还能思考，能帮助人们解决各种各样的问题。`,
        `最神奇的是，它还能带着人们去旅行，上到太空，下到海底，没有它去不了的地方。`,
        `我真希望这一天能早点到来！为了实现这个梦想，我一定要好好学习，将来成为一名科学家，发明出真正的${topic}。`
      ]
    ],
    picture: [
      [
        `画的左边是一片绿油油的草地，草地上开满了五颜六色的小花，蝴蝶在花丛中飞来飞去，美丽极了。`,
        `画的中间，有几个小朋友正在开心地玩耍。他们有的在跑步，有的在跳绳，还有的在放风筝，每个人的脸上都洋溢着灿烂的笑容。`,
        `画的右边是几棵高大的树，树上的叶子翠绿翠绿的，小鸟在枝头唱着动听的歌。`,
        `看着这幅画，我仿佛也走进了画中，和小朋友们一起玩耍，一起欢笑。`
      ]
    ],
    diary: [
      [
        `早上，我早早地起了床，吃完早饭就兴高采烈地出门了。今天的天气真好，蓝蓝的天上飘着几朵白云，小鸟在枝头唱歌。`,
        `上午，我和小伙伴们一起玩游戏，我们玩得可开心了！大家你追我赶，笑声回荡在整个院子里。`,
        `下午，我还帮妈妈做了一些家务。妈妈夸我长大了，懂事了，我的心里美滋滋的。`,
        `今天真是快乐的一天！我把这件事写在日记里，希望以后每天都能这么开心。`
      ]
    ],
    letter: [
      [
        `好久不见，十分想念您。最近学校里发生了很多有趣的事情，我迫不及待地想告诉您。`,
        `这学期，我的学习进步了很多，上次考试还取得了好成绩呢！老师表扬了我，我心里特别高兴。`,
        `除了学习，我还参加了学校的兴趣小组，学到了很多新本领。我一定会继续努力，不辜负您对我的期望。`,
        `祝您身体健康，工作顺利！期待您的回信。`
      ]
    ],
    festival: [
      [
        `${topic}这一天，大街小巷都张灯结彩，喜气洋洋。家家户户贴上了春联，挂起了灯笼，到处都是欢声笑语。`,
        `我们家也不例外。一大早，全家人就忙开了。爸爸妈妈准备丰盛的饭菜，我和弟弟帮忙贴春联、挂灯笼，忙得不亦乐乎。`,
        `晚上，全家人围坐在一起吃年夜饭，看着精彩的电视节目，大家有说有笑，热闹极了。我还收到了压岁钱，心里美滋滋的。`,
        `${topic}真是太快乐了！我真希望每天都是${topic}。`
      ]
    ]
  }

  const endingTemplates: Record<string, string[]> = {
    narrative: [
      `这件事虽然已经过去很久了，但我永远都不会忘记。它让我明白了一个道理：${pick(['坚持就是胜利', '团结力量大', '世上无难事，只怕有心人', '帮助别人，快乐自己'])}。`,
      `现在回想起来，我还觉得历历在目。${topic}这件事，将成为我童年最珍贵的回忆。`,
      `从那以后，我就牢牢记住了这件事。它时刻提醒着我，要做一个${pick(['勇敢', '诚实', '善良', '勤劳'])}的好孩子。`
    ],
    descriptive: [
      `${topic}真是太美了！我爱这美丽的${topic}，更爱这生机勃勃的大自然。`,
      `夕阳西下，我恋恋不舍地离开了。但${topic}的美丽景象，已经深深地印在了我的脑海里。`,
      `这就是我最喜欢的${topic}，它给我的童年带来了无数的欢乐和美好的回忆。`
    ],
    argumentative: [
      `总之，${topic}是我们每个人都应该具备的好品质。让我们一起努力，做一个有${topic}的人吧！`,
      `同学们，听了我的介绍，你们是不是也觉得${topic}很重要呢？那就让我们一起行动起来吧！`,
      `"不积跬步，无以至千里。"让我们从点滴小事做起，慢慢培养${topic}的好品质。`
    ],
    imaginative: [
      `"叮铃铃——"闹钟响了，我从梦中醒来。虽然只是一场梦，但我相信，只要努力，梦想终有一天会实现。`,
      `我的想象是不是很有趣？你们也来想一想，如果你们是${topic}，会做些什么呢？`,
      `虽然这只是我的想象，但是我相信，随着科技的发展，这一切在未来都有可能变成现实。`
    ],
    picture: [
      `这幅画真是太有意思了！它不仅让我看到了美丽的景色，还让我感受到了生活的美好。`,
      `看着这幅画，我想了很多很多。我以后也要像画中的小朋友一样，开开心心地过好每一天。`,
      `这真是一幅有意义的画！我喜欢这幅画，更喜欢画中描绘的美好生活。`
    ],
    diary: [
      `今天真是充实又快乐的一天！我要把这份美好的记忆永远珍藏在心里。`,
      `夜幕降临，我躺在床上，回想着今天发生的事情，嘴角不禁微微上扬。多么美好的一天啊！`,
      `写完这篇日记，我也该睡觉了。明天一定会是更美好的一天！`
    ],
    letter: [
      `纸短情长，就写到这里吧。期待您的回信！`,
      `祝您身体健康，万事如意！`,
      `此致\n敬礼！`
    ],
    festival: [
      `快乐的时光总是过得那么快，${topic}就这样过去了。但那份快乐和温暖，将永远留在我的心中。`,
      `我爱${topic}，爱这份团圆的幸福，更爱家人们在一起的温馨时光。`,
      `${topic}在欢声笑语中结束了，但那些美好的回忆，将伴随我走过整整一年。`
    ]
  }

  const goodWordsByType: Record<string, string[]> = {
    narrative: ['兴致勃勃', '迫不及待', '津津有味', '欢声笑语', '历历在目', '记忆犹新', '兴高采烈', '眉开眼笑', '手舞足蹈', '心花怒放', '坚持不懈', '勇往直前', '锲而不舍', '自强不息', '助人为乐'],
    descriptive: ['春暖花开', '鸟语花香', '万紫千红', '百花齐放', '生机勃勃', '郁郁葱葱', '层林尽染', '瓜果飘香', '白雪皑皑', '银装素裹', '山清水秀', '湖光山色', '美不胜收', '心旷神怡', '流连忘返'],
    argumentative: ['坚韧不拔', '持之以恒', '言而有信', '一诺千金', '一丝不苟', '兢兢业业', '勤勤恳恳', '脚踏实地', '志存高远', '胸怀大志', '百折不挠', '临危不惧', '大公无私', '舍己为人', '光明磊落'],
    imaginative: ['异想天开', '奇思妙想', '天马行空', '光怪陆离', '神秘莫测', '变幻莫测', '五彩缤纷', '神奇无比', '不可思议', '如梦如幻', '五彩斑斓', '奇幻无比', '奥秘无穷', '心想事成', '梦想成真'],
    picture: ['栩栩如生', '活灵活现', '惟妙惟肖', '跃然纸上', '生动形象', '情景交融', '引人入胜', '身临其境', '其乐融融', '和和美美', '热热闹闹', '开开心心', '快快乐乐', '高高兴兴', '幸福美满'],
    diary: ['开开心心', '高高兴兴', '快快乐乐', '平平安安', '顺顺利利', '忙忙碌碌', '兢兢业业', '认认真真', '仔仔细细', '踏踏实实', '收获满满', '幸福满满', '元气满满', '快乐多多', '趣事多多'],
    letter: ['敬爱的', '亲爱的', '尊敬的', '敬启者', '久未见面', '别来无恙', '见字如面', '纸短情长', '不尽欲言', '顺祝安好', '祝好', '盼复', '敬祝', '顺颂', '敬请'],
    festival: ['喜气洋洋', '张灯结彩', '欢声笑语', '其乐融融', '团团圆圆', '和和美美', '热热闹闹', '鞭炮齐鸣', '锣鼓喧天', '载歌载舞', '普天同庆', '举国欢腾', '吉祥如意', '幸福安康', '万事如意']
  }

  const goodSentenceTemplates: string[] = [
    `一阵微风吹过，${topic}就像${pick(['一位翩翩起舞的少女', '翻滚的波浪', '点头微笑的孩子', '跳动的音符'])}，美丽极了。`,
    `那一刻，我的心里${pick(['比吃了蜜还要甜', '像打翻了五味瓶', '像有一只小兔子在砰砰直跳', '涌起一股暖流'])}。`,
    `时间过得真快，转眼间${pick(['太阳已经落山了', '一天就过去了', '这件事已经过去很久了', '我们都长大了'])}。`,
    `这件事让我深深地明白了一个道理：${pick(['一分耕耘，一分收获', '团结就是力量', '帮助别人就是帮助自己', '世上无难事，只怕有心人'])}。`,
    `看着眼前的景象，我仿佛${pick(['走进了童话世界', '听到了大自然的歌声', '看到了最美的画卷', '感受到了春天的气息'])}。`
  ]

  const paragraphs: string[] = []
  const allKeywords = [...keywords, ...pickMany(goodWordsByType[essayType] || goodWordsByType.narrative, 3)]

  const openingTemplatesForType = openingTemplates[essayType] || openingTemplates.narrative
  const bodyTemplatesForType = bodyTemplates[essayType] || bodyTemplates.narrative
  const endingTemplatesForType = endingTemplates[essayType] || endingTemplates.narrative

  paragraphs.push(pick(openingTemplatesForType))

  const selectedBody = pick(bodyTemplatesForType)
  for (let i = 0; i < Math.min(selectedBody.length, wcConfig.paraCount - 2); i++) {
    let para = selectedBody[i]
    if (allKeywords.length > 0 && i === 1) {
      const kw = pickMany(allKeywords, 2)
      para += ` 我想用${kw.join('、')}这些词语来形容它。`
    }
    paragraphs.push(para)
  }

  paragraphs.push(pick(endingTemplatesForType))

  if (gradeLevel === 'lower') {
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].length > 100) {
        const sentences = paragraphs[i].split(/(?<=[。！？])/)
        if (sentences.length > 2) {
          paragraphs[i] = sentences.slice(0, 2).join('')
        }
      }
    }
  }

  const content = paragraphs.join('\n\n')
  const wordCount = content.replace(/\s/g, '').length

  return { paragraphs, content, wordCount }
}

const generateTeacherComment = (essayType: string, grade: string): TeacherComment => {
  const gradeLevel = getGradeLevel(grade)

  const highlightBanks: Record<string, string[]> = {
    lower: [
      '文章语句通顺，表达清楚，能看出你是个爱动脑筋的好孩子',
      '作文结构完整，有开头有结尾，条理很清晰',
      '观察很仔细，描写得很具体，老师仿佛也看到了那个画面',
      '能正确使用标点符号，段落分明，书写很认真',
      '用词很恰当，有些词语用得特别好，看得出你平时积累了不少好词好句'
    ],
    middle: [
      '文章中心明确，选材恰当，内容具体充实',
      '运用了比喻、拟人等修辞手法，语言生动形象，很有感染力',
      '叙事条理清晰，起因、经过、结果写得很完整',
      '情感真实自然，字里行间流露出真情实感',
      '开头结尾相互呼应，结构严谨，过渡自然'
    ],
    upper: [
      '立意新颖，构思巧妙，能从独特的角度切入主题',
      '语言优美流畅，善用修辞，文采斐然，有自己的写作风格',
      '内容充实，材料典型，能很好地为中心思想服务',
      '结构严谨，层次分明，详略得当，重点突出',
      '思想深刻，有自己独到的见解和思考，难能可贵'
    ]
  }

  const suggestionBanks: Record<string, string[]> = {
    lower: [
      '如果能多写一些自己的感受和想法，文章会更精彩',
      '可以多积累一些好词好句，让语言更加丰富',
      '试着把句子写得更具体一些，比如加上颜色、声音、味道等描写',
      '注意书写工整，标点符号的使用也需要再加强',
      '可以多观察生活中的小事，积累写作素材'
    ],
    middle: [
      '可以适当增加一些心理活动的描写，让人物形象更丰满',
      '注意段落之间的过渡，让文章衔接更自然',
      '有些句子可以更简洁一些，避免重复啰嗦',
      '可以尝试运用更多样化的句式，让文章节奏富于变化',
      '结尾可以再深化一下主题，让文章更有余味'
    ],
    upper: [
      '可以进一步挖掘主题的深度，让文章的立意更高远',
      '注意选材的新颖性，避免落入俗套，可以尝试从新的角度思考',
      '在语言表达上可以更精炼，追求"言有尽而意无穷"的效果',
      '可以尝试一些创新的写作手法，打破常规的写作模式',
      '注意文章的节奏感，张弛有度，让读者读起来更享受'
    ]
  }

  const overallBanks: string[] = [
    '这是一篇优秀的作文，写得很用心，继续保持，你会越来越棒的！',
    '你的写作水平很不错，老师为你点赞！期待看到你更多精彩的作品。',
    '从这篇作文可以看出你是一个热爱生活、善于观察的孩子，加油！',
    '文笔不错，有写作天赋，多读多写，你一定能成为小小作家！',
    '文章写得很好，老师看到了你的进步和努力，继续加油哦！'
  ]

  const highlights = pickMany(highlightBanks[gradeLevel], 3)
  const suggestions = pickMany(suggestionBanks[gradeLevel], 2)
  const baseScore = gradeLevel === 'lower' ? 85 : gradeLevel === 'middle' ? 88 : 90
  const score = baseScore + randomInt(0, 8)

  return {
    highlights,
    suggestions,
    score,
    overall: pick(overallBanks)
  }
}

const generateSingleEssay = (
  topic: string,
  essayType: string,
  grade: string,
  keywords: string[],
  additionalNotes: string,
  styles: string[]
): EssayResult => {
  const { paragraphs, content, wordCount } = generateEssayContent(topic, essayType, grade, keywords, additionalNotes, styles)
  const title = generateTitle(topic, essayType, keywords)

  const gradeLevel = getGradeLevel(grade)
  const goodWordsByType: Record<string, string[]> = {
    narrative: ['兴致勃勃', '迫不及待', '津津有味', '欢声笑语', '历历在目', '记忆犹新', '兴高采烈'],
    descriptive: ['春暖花开', '鸟语花香', '万紫千红', '百花齐放', '生机勃勃', '郁郁葱葱', '美不胜收'],
    argumentative: ['坚韧不拔', '持之以恒', '言而有信', '一诺千金', '一丝不苟', '脚踏实地', '志存高远'],
    imaginative: ['异想天开', '奇思妙想', '天马行空', '神秘莫测', '五彩缤纷', '神奇无比', '梦想成真'],
    picture: ['栩栩如生', '活灵活现', '惟妙惟肖', '跃然纸上', '生动形象', '引人入胜', '其乐融融'],
    diary: ['开开心心', '高高兴兴', '快快乐乐', '收获满满', '幸福满满', '元气满满', '快乐多多'],
    letter: ['见字如面', '纸短情长', '久未见面', '别来无恙', '不尽欲言', '顺祝安好', '盼复'],
    festival: ['喜气洋洋', '张灯结彩', '欢声笑语', '其乐融融', '团团圆圆', '和和美美', '吉祥如意']
  }

  const goodWords = pickMany(goodWordsByType[essayType] || goodWordsByType.narrative, gradeLevel === 'lower' ? 4 : gradeLevel === 'middle' ? 5 : 6)

  const goodSentenceCount = gradeLevel === 'lower' ? 1 : gradeLevel === 'middle' ? 2 : 3
  const goodSentenceTemplates = [
    `一阵微风吹过，${topic}就像一位翩翩起舞的少女，美丽极了。`,
    `那一刻，我的心里比吃了蜜还要甜。`,
    `这件事让我深深地明白了一个道理：一分耕耘，一分收获。`,
    `看着眼前的景象，我仿佛走进了童话世界。`,
    `时间过得真快，转眼间太阳已经落山了。`
  ]
  const goodSentences = pickMany(goodSentenceTemplates, goodSentenceCount)

  const teacherComment = generateTeacherComment(essayType, grade)

  const availableStyleLabels = styles.length > 0
    ? styles.map(s => getStyleLabel(s))
    : ['朴实真诚', '优美生动', '活泼有趣']
  const styleLabel = pick(availableStyleLabels)
  const style = styles.length > 0 ? pick(styles) : 'simple'

  return {
    title,
    content,
    paragraphs,
    wordCount,
    goodWords,
    goodSentences,
    teacherComment,
    style,
    styleLabel
  }
}

const generateEssay = async () => {
  if (!canGenerate.value) return

  isGenerating.value = true
  generatedEssays.value = []

  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

  const essays: EssayResult[] = []
  const stylesPool = selectedStyles.value.length > 0 ? selectedStyles.value : ['simple', 'literary', 'humorous', 'touching', 'inspiring']

  for (let i = 0; i < formData.value.versionCount; i++) {
    const styleForEssay = [stylesPool[i % stylesPool.length]]
    essays.push(generateSingleEssay(
      formData.value.topic,
      formData.value.essayType,
      formData.value.grade,
      keywordsList.value,
      formData.value.additionalNotes,
      styleForEssay
    ))
  }

  generatedEssays.value = essays
  activeEssay.value = 0
  isGenerating.value = false

  const historyItem: HistoryItem = {
    formData: { ...formData.value },
    keywordsText: keywordsText.value,
    styles: [...selectedStyles.value],
    essays,
    time: new Date().toISOString()
  }
  history.value.push(historyItem)
  saveHistory()

  ElMessage.success(`成功生成 ${essays.length} 篇作文范文`)
}

const regenerateEssay = async () => {
  formData.value.versionCount = 1
  await generateEssay()
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

const copyAllEssays = () => {
  const fullText = generatedEssays.value.map((essay, idx) => {
    return `【范文 ${idx + 1}】${essay.styleLabel}\n\n题目：${essay.title}\n\n${essay.content}\n\n--- 好词积累 ---\n${essay.goodWords.join('、')}\n\n--- 好句赏析 ---\n${essay.goodSentences.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n--- 名师点评 ---\n写作亮点：\n${essay.teacherComment.highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n改进建议：\n${essay.teacherComment.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n综合评分：${essay.teacherComment.score}分\n${essay.teacherComment.overall}\n\n${'='.repeat(40)}\n\n`
  }).join('\n')
  copyText(fullText)
}

const copyCurrentFull = () => {
  if (!currentEssay.value) return
  const essay = currentEssay.value
  const fullText = `题目：${essay.title}\n\n${essay.content}\n\n--- 好词积累 ---\n${essay.goodWords.join('、')}\n\n--- 好句赏析 ---\n${essay.goodSentences.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n--- 名师点评 ---\n写作亮点：\n${essay.teacherComment.highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n改进建议：\n${essay.teacherComment.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n综合评分：${essay.teacherComment.score}分\n${essay.teacherComment.overall}`
  copyText(fullText)
}

const resetAll = () => {
  formData.value = {
    topic: '',
    grade: 'g3',
    essayType: 'narrative',
    wordCount: 'medium',
    additionalNotes: '',
    versionCount: 1
  }
  keywordsText.value = ''
  selectedStyles.value = []
  generatedEssays.value = []
  activeEssay.value = 0
  ElMessage.info('已重置所有选项')
}

const saveHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch {
    console.error('Failed to save history')
  }
}

const loadHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      history.value = JSON.parse(saved)
    }
  } catch {
    console.error('Failed to load history')
  }
}

const loadFromHistory = (item: HistoryItem) => {
  formData.value = { ...item.formData }
  keywordsText.value = item.keywordsText
  selectedStyles.value = [...item.styles]
  generatedEssays.value = item.essays
  activeEssay.value = 0
  ElMessage.success('已载入历史记录')
}

const clearHistory = () => {
  history.value = []
  saveHistory()
  ElMessage.success('历史记录已清空')
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.essay-generator {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.intro-card .intro-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.intro-card .intro-left {
  display: flex;
  gap: 16px;
  align-items: center;
}

.intro-card .intro-icon {
  font-size: 48px;
}

.intro-card .intro-title {
  margin: 0 0 6px 0;
  font-size: 24px;
  color: #303133;
}

.intro-card .intro-subtitle {
  margin: 0;
  color: #606266;
  font-size: 14px;
  max-width: 600px;
  line-height: 1.6;
}

.intro-card .intro-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.intro-card .intro-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-card .section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.audience-tags {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.audience-tag {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.audience-tag:hover {
  background: #ecf5ff;
  transform: translateY(-2px);
}

.audience-tag .at-emoji {
  font-size: 28px;
}

.audience-tag .at-name {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.audience-tag .at-desc {
  font-size: 12px;
  color: #909399;
}

.scene-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.scene-tags :deep(.el-tag) {
  padding: 6px 14px;
  font-size: 14px;
}

.type-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.type-overview-card {
  padding: 14px;
  background: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.type-overview-card:hover {
  background: #ecf5ff;
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.toc-emoji {
  font-size: 20px;
}

.toc-label {
  font-weight: 600;
  color: #303133;
}

.toc-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.toc-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.guide-steps {
  margin-bottom: 16px;
}

.expectation-section .expectation-title {
  margin: 0 0 16px 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.expectation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.expectation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f5f7fa;
  border-radius: 8px;
}

.expectation-item .exp-num {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
  margin-bottom: 2px;
}

.expectation-item .exp-label {
  color: #606266;
  font-size: 12px;
}

.grade-table {
  margin-top: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.section-title .required-tag {
  color: #f56c6c;
  font-size: 14px;
}

.section-title .hint-tag {
  margin-left: 8px;
}

.help-btn {
  margin-left: auto;
}

.input-section {
  margin-bottom: 20px;
}

.two-col-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 768px) {
  .two-col-section {
    grid-template-columns: 1fr;
  }
}

.wordcount-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.wordcount-card {
  padding: 12px 8px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.wordcount-card:hover:not(.disabled) {
  border-color: #165DFF;
  background: #ecf5ff;
}

.wordcount-card.active {
  border-color: #165DFF;
  background: #165DFF;
  color: #fff;
}

.wordcount-card.active .wc-desc {
  color: rgba(255, 255, 255, 0.85);
}

.wordcount-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.wc-num {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.wc-desc {
  font-size: 12px;
  color: #909399;
}

.style-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.style-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 2px solid #e4e7ed;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.style-chip:hover:not(.disabled) {
  border-color: #165DFF;
  background: #ecf5ff;
}

.style-chip.active {
  border-color: #165DFF;
  background: #165DFF;
  color: #fff;
}

.style-chip.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.style-tip {
  margin-top: 10px;
}

.version-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.version-card {
  padding: 12px 8px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.version-card:hover:not(.disabled) {
  border-color: #165DFF;
  background: #ecf5ff;
}

.version-card.active {
  border-color: #165DFF;
  background: #165DFF;
  color: #fff;
}

.version-card.active .version-desc {
  color: rgba(255, 255, 255, 0.85);
}

.version-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.version-num {
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 2px;
}

.version-label {
  font-size: 13px;
  margin-bottom: 4px;
}

.version-desc {
  font-size: 12px;
  color: #909399;
}

.quick-samples {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.sample-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.sample-tag:hover {
  transform: translateY(-1px);
}

.action-section {
  display: flex;
  gap: 12px;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
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
  padding: 16px;
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f9eb 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.generating-dots {
  display: flex;
  gap: 6px;
}

.generating-dots .dot {
  width: 10px;
  height: 10px;
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
  color: #303133;
  font-size: 14px;
  line-height: 1.6;
}

.version-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.version-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.version-tab:hover {
  border-color: #165DFF;
  background: #ecf5ff;
}

.version-tab.active {
  border-color: #165DFF;
  background: #165DFF;
  color: #fff;
}

.section-title-sm {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.section-title-sm .el-button {
  margin-left: auto;
}

.title-section .result-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  text-align: center;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin: 0;
}

.essay-content {
  background: #fafbfc;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.essay-paragraph {
  margin: 0 0 16px 0;
  line-height: 2;
  font-size: 15px;
  color: #303133;
  text-indent: 2em;
}

.essay-paragraph:last-child {
  margin-bottom: 0;
}

.essay-meta {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.result-section {
  margin-bottom: 24px;
}

.result-section:last-child {
  margin-bottom: 0;
}

.good-words {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.good-word-tag {
  padding: 6px 14px !important;
  font-size: 14px !important;
}

.good-sentence {
  margin-bottom: 10px;
}

.good-sentence:last-child {
  margin-bottom: 0;
}

.teacher-comment .comment-box {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
}

.comment-section {
  margin-bottom: 16px;
}

.comment-section:last-child {
  margin-bottom: 0;
}

.comment-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.comment-label.highlight {
  color: #67c23a;
}

.comment-label.suggest {
  color: #e6a23c;
}

.comment-label.score {
  color: #f56c6c;
  font-size: 16px;
}

.comment-list {
  margin: 0;
  padding-left: 24px;
  line-height: 1.8;
  color: #606266;
}

.comment-overall {
  margin: 8px 0 0 0;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.result-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  margin-top: 20px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.history-item:hover {
  background: #ecf5ff;
  transform: translateX(4px);
}

.history-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.history-topic {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.history-text {
  color: #303133;
  font-size: 14px;
}

.history-meta {
  margin-left: auto;
}

.history-footer {
  margin-top: 12px;
  text-align: center;
}
</style>