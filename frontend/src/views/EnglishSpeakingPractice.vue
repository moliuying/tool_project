<template>
  <div class="english-speaking-practice">
    <el-card class="intro-card">
      <div class="intro-header">
        <div class="intro-left">
          <div class="intro-icon">🗣️</div>
          <div class="intro-text">
            <h2 class="intro-title">英语口语对话陪练</h2>
            <p class="intro-subtitle">
              随时随地与 AI 外教进行英语自由对话练习，支持文字和语音两种交流方式，AI 以母语者的表达习惯和专业教学经验为你纠错、拓展、反馈，告别哑巴英语
            </p>
          </div>
        </div>
        <div class="intro-badges">
          <el-tag type="primary" effect="dark" size="large">💬 文字对话</el-tag>
          <el-tag type="success" effect="dark" size="large">🎙️ 语音对话</el-tag>
          <el-tag type="warning" effect="dark" size="large">📝 智能纠错</el-tag>
          <el-tag type="danger" effect="dark" size="large">🎯 多场景</el-tag>
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
              <span class="at-name">雅思/托福考生</span>
              <span class="at-desc">口语话题卡练习与模考</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">💼</span>
              <span class="at-name">职场人士</span>
              <span class="at-desc">商务英语与面试演练</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">🌐</span>
              <span class="at-name">留学生</span>
              <span class="at-desc">海外生活英语实战</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">📖</span>
              <span class="at-name">英语学习者</span>
              <span class="at-desc">日常口语能力提升</span>
            </div>
          </div>
        </div>
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><WarningFilled /></el-icon>
            典型适用场景
          </h4>
          <div class="scene-tags">
            <el-tag size="large" effect="plain">☕ 日常聊天</el-tag>
            <el-tag size="large" effect="plain">🎤 雅思口语 Part 1/2/3</el-tag>
            <el-tag size="large" effect="plain">📋 托福独立/综合口语</el-tag>
            <el-tag size="large" effect="plain">💼 商务会议</el-tag>
            <el-tag size="large" effect="plain">🤝 商务谈判</el-tag>
            <el-tag size="large" effect="plain">📧 英文邮件讨论</el-tag>
            <el-tag size="large" effect="plain">👔 求职面试</el-tag>
            <el-tag size="large" effect="plain">🏫 升学面试</el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="!chatStarted" class="setup-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Setting />
          </el-icon>
          <span>对话设置</span>
        </div>
      </template>

      <div class="setup-section">
        <div class="section-title">
          <el-icon><Collection /></el-icon>
          <span>练习场景</span>
          <el-tag size="small" type="info" class="hint-tag">
            不同场景 AI 将采用不同的对话风格和词汇难度
          </el-tag>
        </div>
        <div class="scene-options">
          <div
            v-for="scene in practiceScenes"
            :key="scene.value"
            class="scene-card"
            :class="{ active: selectedScene === scene.value }"
            @click="selectedScene = scene.value"
          >
            <div class="scene-emoji">{{ scene.emoji }}</div>
            <div class="scene-name">{{ scene.label }}</div>
            <div class="scene-desc">{{ scene.desc }}</div>
          </div>
        </div>
      </div>

      <div class="setup-section">
        <div class="section-title">
          <el-icon><Brush /></el-icon>
          <span>AI 外教人设</span>
          <el-tag size="small" type="info" class="hint-tag">
            点击卡片查看外教的教学风格和纠错方式详情
          </el-tag>
        </div>
        <div class="teacher-options">
          <div
            v-for="teacher in teacherPersonas"
            :key="teacher.value"
            class="teacher-card"
            :class="{ active: selectedTeacher === teacher.value }"
            @click="selectedTeacher = teacher.value"
          >
            <div class="teacher-avatar">{{ teacher.avatar }}</div>
            <div class="teacher-info">
              <div class="teacher-row">
                <div class="teacher-name">{{ teacher.name }}</div>
                <el-tag size="small" type="primary" effect="light">{{ teacher.title }}</el-tag>
              </div>
              <div class="teacher-style">{{ teacher.style }}</div>
            </div>
            <el-icon class="teacher-expand-icon"><ArrowDown /></el-icon>
            <div v-if="selectedTeacher === teacher.value" class="teacher-detail">
              <el-divider />
              <div class="detail-grid">
                <div class="detail-item">
                  <div class="detail-label">🎓 教学风格</div>
                  <div class="detail-content">{{ teacher.teachingStyle }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">✏️ 纠错方式</div>
                  <div class="detail-content">{{ teacher.correctionMethod }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">👥 适合人群</div>
                  <div class="detail-content">{{ teacher.suitableFor }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="two-col-section">
        <div class="setup-section flex-1">
          <div class="section-title">
            <el-icon><TrendCharts /></el-icon>
            <span>英语水平</span>
          </div>
          <div class="level-options">
            <div
              v-for="level in proficiencyLevels"
              :key="level.value"
              class="level-card"
              :class="{ active: selectedLevel === level.value }"
              @click="selectedLevel = level.value"
            >
              <div class="level-stars">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="level-star"
                  :class="{ filled: n <= level.stars }"
                >★</span>
              </div>
              <div class="level-name">{{ level.label }}</div>
              <div class="level-desc">{{ level.desc }}</div>
              <div class="level-cefr">{{ level.cefr }}</div>
            </div>
          </div>
        </div>

        <div class="setup-section flex-1">
          <div class="section-title">
            <el-icon><Clock /></el-icon>
            <span>纠错时机</span>
            <el-tag size="small" type="warning" class="hint-tag">
              选择你希望的错误反馈方式
            </el-tag>
          </div>
          <div class="timing-options">
            <div
              v-for="opt in correctionTimingOptions"
              :key="opt.value"
              class="timing-card"
              :class="{ active: correctionTiming === opt.value }"
              @click="correctionTiming = opt.value"
            >
              <div class="timing-header">
                <span class="timing-emoji">{{ opt.emoji }}</span>
                <span class="timing-name">{{ opt.label }}</span>
              </div>
              <div class="timing-desc">{{ opt.desc }}</div>
              <div class="timing-pros-cons">
                <div class="pros-row">
                  <el-icon color="#67c23a"><CircleCheckFilled /></el-icon>
                  <span>{{ opt.advantage }}</span>
                </div>
                <div class="cons-row">
                  <el-icon color="#e6a23c"><WarningFilled /></el-icon>
                  <span>{{ opt.disadvantage }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="setup-section">
        <div class="section-title">
          <el-icon><Tools /></el-icon>
          <span>辅助功能</span>
        </div>
        <div class="feature-options">
          <div
            v-for="feat in assistantFeatures"
            :key="feat.value"
            class="feature-chip"
            :class="{ active: enabledFeatures.includes(feat.value) }"
            @click="toggleFeature(feat.value)"
          >
            <span class="feat-emoji">{{ feat.emoji }}</span>
            <span class="feat-label">{{ feat.label }}</span>
          </div>
        </div>
      </div>

      <div class="action-section">
        <el-button
          type="primary"
          size="large"
          :icon="ChatDotRound"
          @click="startChat"
          class="start-btn"
        >
          开始对话练习
        </el-button>
      </div>
    </el-card>

    <el-card v-if="chatStarted" class="chat-card">
      <template #header>
        <div class="chat-header">
          <div class="chat-header-left">
            <el-avatar :size="40" class="teacher-avatar-icon">
              {{ currentTeacherInfo.avatar }}
            </el-avatar>
            <div class="chat-title-info">
              <div class="chat-title">
                {{ currentTeacherInfo.name }}
                <el-tag size="small" type="primary" effect="light">{{ currentTeacherInfo.title }}</el-tag>
              </div>
              <div class="chat-subtitle">
                <el-tag size="small" type="success" effect="plain">{{ currentSceneInfo.label }}</el-tag>
                <el-tag size="small" type="warning" effect="plain">{{ currentLevelInfo.label }}</el-tag>
              </div>
            </div>
          </div>
          <div class="chat-header-right">
            <el-tooltip content="语音自动朗读AI回复">
              <el-button
                :type="autoSpeak ? 'primary' : 'default'"
                :icon="autoSpeak ? VideoPlay : VideoPause"
                circle
                size="small"
                @click="autoSpeak = !autoSpeak"
              />
            </el-tooltip>
            <el-tooltip content="显示中文翻译">
              <el-button
                :type="showTranslation ? 'primary' : 'default'"
                :icon="Document"
                circle
                size="small"
                @click="showTranslation = !showTranslation"
              />
            </el-tooltip>
            <el-tooltip content="结束对话">
              <el-button
                type="danger"
                :icon="Close"
                circle
                size="small"
                @click="showEndConfirm = true"
              />
            </el-tooltip>
          </div>
        </div>
      </template>

      <div ref="messagesContainer" class="messages-container">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="message-item"
          :class="msg.role"
        >
          <div v-if="msg.role === 'assistant'" class="message-avatar">
            {{ currentTeacherInfo.avatar }}
          </div>
          <div class="message-content-wrapper">
            <div class="message-content">
              <div class="message-text">{{ msg.content }}</div>
              <div v-if="msg.translation && showTranslation" class="message-translation">
                📝 {{ msg.translation }}
              </div>
              <div v-if="msg.corrections && msg.corrections.length > 0 && enabledFeatures.includes('correction')" class="message-corrections">
                <el-divider content-position="left">💡 纠错反馈</el-divider>
                <div
                  v-for="(corr, cIdx) in msg.corrections"
                  :key="cIdx"
                  class="correction-item"
                >
                  <div class="correction-row">
                    <span class="corr-label before">❌ Before:</span>
                    <span class="corr-text before-text">{{ corr.before }}</span>
                  </div>
                  <div class="correction-row">
                    <span class="corr-label after">✅ After:</span>
                    <span class="corr-text after-text">{{ corr.after }}</span>
                  </div>
                  <div class="correction-explain">
                    <el-icon color="#165DFF"><Bulb /></el-icon>
                    <span>{{ corr.explanation }}</span>
                  </div>
                </div>
              </div>
              <div v-if="msg.vocabulary && msg.vocabulary.length > 0 && enabledFeatures.includes('vocabulary')" class="message-vocabulary">
                <el-divider content-position="left">📚 词汇拓展</el-divider>
                <div
                  v-for="(voc, vIdx) in msg.vocabulary"
                  :key="vIdx"
                  class="vocabulary-item"
                >
                  <span class="voc-word">{{ voc.word }}</span>
                  <span class="voc-pos">{{ voc.pos }}</span>
                  <span class="voc-meaning">{{ voc.meaning }}</span>
                  <span class="voc-example">e.g. {{ voc.example }}</span>
                </div>
              </div>
              <div v-if="msg.tips && msg.tips.length > 0 && enabledFeatures.includes('tips')" class="message-tips">
                <el-divider content-position="left">🎯 地道表达</el-divider>
                <div
                  v-for="(tip, tIdx) in msg.tips"
                  :key="tIdx"
                  class="tip-item"
                >
                  <el-icon color="#e6a23c"><Star /></el-icon>
                  <span><strong>{{ tip.expression }}</strong> — {{ tip.explanation }}</span>
                </div>
              </div>
            </div>
            <div class="message-actions">
              <el-button
                v-if="msg.role === 'assistant'"
                size="small"
                text
                :icon="VideoPlay"
                @click="speakText(msg.content)"
              >
                朗读
              </el-button>
              <el-button
                size="small"
                text
                :icon="CopyDocument"
                @click="copyText(msg.content)"
              >
                复制
              </el-button>
              <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
            </div>
          </div>
          <div v-if="msg.role === 'user'" class="message-avatar user">
            👤
          </div>
        </div>

        <div v-if="isTyping" class="message-item assistant">
          <div class="message-avatar">{{ currentTeacherInfo.avatar }}</div>
          <div class="message-content-wrapper">
            <div class="message-content typing-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-area">
        <div v-if="isListening" class="listening-status">
          <el-icon class="is-loading" color="#f56c6c"><Microphone /></el-icon>
          <span>正在聆听，请说英语...</span>
          <span class="recognized-text">{{ interimTranscript }}</span>
        </div>

        <div class="input-row">
          <el-button
            :type="isListening ? 'danger' : 'default'"
            :icon="Microphone"
            size="large"
            circle
            :class="{ recording: isListening }"
            @click="toggleVoiceInput"
          />
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="2"
            placeholder="Type your message in English... 用英语输入你的消息"
            :disabled="isGenerating || isListening"
            resize="none"
            class="message-input"
            @keydown.enter.ctrl="sendMessage"
          />
          <el-button
            type="primary"
            size="large"
            :icon="Promotion"
            :loading="isGenerating"
            :disabled="!inputText.trim() || isListening"
            @click="sendMessage"
            class="send-btn"
          >
            发送
          </el-button>
        </div>
        <div class="input-hints">
          <el-tag
            v-for="(quick, idx) in quickSuggestions"
            :key="idx"
            size="small"
            class="quick-tag"
            effect="plain"
            @click="!isGenerating && (inputText = quick)"
          >
            {{ quick }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="showEndConfirm" :title="correctionTiming === 'summary' && collectedCorrections.length > 0 ? '对话总结报告' : '结束对话'" :width="correctionTiming === 'summary' && collectedCorrections.length > 0 ? '640px' : '420px'">
      <div class="end-dialog-content">
        <p v-if="correctionTiming !== 'summary' || collectedCorrections.length === 0">确定要结束本次对话练习吗？</p>
        <div class="end-stats">
          <div class="stat-row">
            <span>对话轮次：</span>
            <el-tag type="primary">{{ Math.floor(messages.length / 2) }} 轮</el-tag>
          </div>
          <div v-if="correctionTiming === 'summary'" class="stat-row">
            <span>纠错模式：</span>
            <el-tag type="warning">{{ correctionTiming === 'summary' ? '对话结束后总结' : '即时纠错' }}</el-tag>
          </div>
          <div v-if="correctionTiming === 'summary' && collectedCorrections.length > 0" class="stat-row">
            <span>发现问题：</span>
            <el-tag type="danger">{{ collectedCorrections.length }} 处需要改进</el-tag>
          </div>
        </div>

        <div v-if="correctionTiming === 'summary' && collectedCorrections.length > 0" class="correction-summary">
          <el-divider content-position="left">
            <span class="summary-title">📝 本次对话纠错汇总</span>
          </el-divider>
          <div
            v-for="(group, gIdx) in collectedCorrections"
            :key="gIdx"
            class="summary-group"
          >
            <div class="group-header">
              <el-icon color="#165DFF"><ChatDotRound /></el-icon>
              <span class="group-user-msg">「{{ group.message }}」</span>
              <span class="group-time">{{ formatTime(group.timestamp) }}</span>
            </div>
            <div
              v-for="(corr, cIdx) in group.corrections"
              :key="cIdx"
              class="summary-correction-item"
            >
              <div class="corr-pair">
                <span class="corr-before">❌ {{ corr.before }}</span>
                <el-icon color="#909399"><Right /></el-icon>
                <span class="corr-after">✅ {{ corr.after }}</span>
                <el-tag size="small" :type="getCorrectionTagType(corr.type)">{{ getCorrectionTypeLabel(corr.type) }}</el-tag>
              </div>
              <div class="corr-explain">
                <el-icon color="#e6a23c"><Bulb /></el-icon>
                <span>{{ corr.explanation }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="correctionTiming === 'summary' && collectedCorrections.length === 0" class="no-correction-note">
          <el-alert
            title="🎉 太棒了！本次对话没有发现明显错误"
            type="success"
            :closable="false"
            show-icon
          >
            <template #default>
              继续保持！你可以尝试更复杂的话题和表达方式来进一步挑战自己。
            </template>
          </el-alert>
        </div>
      </div>
      <template #footer>
        <el-button @click="showEndConfirm = false">取消</el-button>
        <el-button type="primary" @click="endChat">
          {{ correctionTiming === 'summary' && collectedCorrections.length > 0 ? '保存总结并结束' : '结束并保存' }}
        </el-button>
      </template>
    </el-dialog>

    <el-card v-if="!chatStarted && history.length > 0" class="history-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Clock />
          </el-icon>
          <span>历史对话</span>
          <el-button size="small" text type="danger" @click="clearHistory">
            清空记录
          </el-button>
        </div>
      </template>

      <div class="history-list">
        <div
          v-for="(item, index) in history"
          :key="index"
          class="history-item"
          @click="loadHistory(item)"
        >
          <div class="history-time">{{ formatTime(item.startTime) }}</div>
          <div class="history-info">
            <el-tag size="small" type="success">{{ getSceneLabel(item.scene) }}</el-tag>
            <el-tag size="small" type="warning">{{ getLevelLabel(item.level) }}</el-tag>
            <el-tag size="small" type="info">{{ item.messages.length }} 条消息</el-tag>
          </div>
          <div class="history-preview">{{ getHistoryPreview(item) }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import {
  Setting,
  User,
  WarningFilled,
  Collection,
  Brush,
  TrendCharts,
  Tools,
  ChatDotRound,
  VideoPlay,
  VideoPause,
  Document,
  Close,
  Bulb,
  Star,
  CopyDocument,
  Microphone,
  Promotion,
  Clock,
  ArrowDown,
  CircleCheckFilled,
  Right
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Correction {
  before: string
  after: string
  explanation: string
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'style'
}

interface VocabularyItem {
  word: string
  pos: string
  meaning: string
  example: string
}

interface ExpressionTip {
  expression: string
  explanation: string
  context: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  translation?: string
  corrections?: Correction[]
  vocabulary?: VocabularyItem[]
  tips?: ExpressionTip[]
  timestamp: number
}

interface HistorySession {
  id: string
  startTime: number
  scene: string
  teacher: string
  level: string
  messages: ChatMessage[]
}

interface AIResponseData {
  reply: string
  translation: string
  corrections: Correction[]
  vocabulary: VocabularyItem[]
  tips: ExpressionTip[]
  quickSuggestions: string[]
}

const STORAGE_KEY = 'english_speaking_history'

const practiceScenes = [
  {
    value: 'daily',
    label: '日常对话',
    emoji: '☕',
    desc: '生活、旅游、社交等日常话题',
    topics: ['Hobbies & Interests', 'Travel Experiences', 'Food & Restaurants', 'Movies & TV Shows', 'Weather & Seasons']
  },
  {
    value: 'ielts',
    label: '雅思口语',
    emoji: '🎤',
    desc: '雅思口语 Part 1/2/3 模拟练习',
    topics: ['Part 1: Introduction & Interview', 'Part 2: Individual Long Turn', 'Part 3: Two-way Discussion']
  },
  {
    value: 'toefl',
    label: '托福口语',
    emoji: '📋',
    desc: '托福独立口语与综合口语任务',
    topics: ['Task 1: Independent Choice', 'Task 2: Campus Situation', 'Task 3: Academic Course', 'Task 4: Academic Lecture']
  },
  {
    value: 'business',
    label: '商务英语',
    emoji: '💼',
    desc: '会议、谈判、邮件、汇报等场景',
    topics: ['Business Meetings', 'Negotiations', 'Presentations', 'Email & Communication', 'Client Relationships']
  },
  {
    value: 'interview',
    label: '求职面试',
    emoji: '👔',
    desc: '英文面试问答模拟演练',
    topics: ['Self Introduction', 'Behavioral Questions', 'Technical Questions', 'Company & Role Questions', 'Salary & Benefits']
  }
]

const teacherPersonas = [
  {
    value: 'owen',
    name: 'Owen',
    avatar: '🧑‍🏫',
    title: '热情开放的英语外教',
    style: '热情开放 · 鼓励式教学',
    personality: 'Passionate and open-minded English foreign teacher from London. Believes in creating a relaxed, pressure-free learning environment where students feel confident to express themselves. Encourages students to speak freely without fear of making mistakes.',
    teachingStyle: '鼓励式教学，注重培养学生的开口自信心。善于发现学生的闪光点，每次对话都会先给予积极肯定，再温和地提出改进建议。课堂氛围轻松愉快，话题涉猎广泛，从流行文化到深度话题都能聊。',
    correctionMethod: '温和渐进式纠错。对话过程中不会频繁打断，而是记录下典型错误，在每轮对话回复的末尾以友好的方式指出1-2个最值得改进的地方，并用"Great job!"、"Almost perfect!"等鼓励性语言开头。对于不影响理解的小错误会选择性忽略，优先保证流利度。',
    suitableFor: '适合害羞不敢开口的学习者、想要建立口语自信心的初学者、喜欢轻松学习氛围的用户'
  },
  {
    value: 'emma',
    name: 'Emma',
    avatar: '👩‍🏫',
    title: '剑桥认证考官',
    style: '严谨专业 · 学术导向',
    personality: 'Experienced IELTS examiner from Cambridge with over 10 years of teaching and examining experience. Has a sharp eye for grammatical accuracy, vocabulary sophistication, and pronunciation nuances.',
    teachingStyle: '学院派严谨风格，注重细节和规范性。会按照雅思口语评分标准（流利度、词汇、语法、发音）四个维度进行系统性教学和反馈。讲解清晰有条理，善于帮助学生发现自己的盲区。',
    correctionMethod: '即时精准纠错。对话过程中会在每轮回复后立即指出语法、用词、发音等方面的所有问题，并按照雅思评分标准给出具体改进建议。每条错误都会提供修改前后对比和详细的语法规则解释，帮助学生从根源上理解问题。',
    suitableFor: '雅思考生、备考托福的学生、想要系统提升语法准确性的学习者'
  },
  {
    value: 'james',
    name: 'James',
    avatar: '👨‍💼',
    title: '商务英语专家',
    style: '职场干练 · 实用导向',
    personality: 'Former Fortune 500 executive with 15 years of international business experience across the US, UK, and Singapore. Has led cross-cultural teams and negotiated multi-million dollar deals.',
    teachingStyle: '实战派、结果导向。教学内容全部来自真实商务场景，注重沟通效率和专业度。会教授商务邮件写作、会议主持、谈判技巧、汇报演示等实用技能，并分享外企文化和职场潜规则。',
    correctionMethod: '场景化纠错。重点纠正商务场景中的表达不地道、用词不够专业、语气不恰当等问题。对于日常语法小错误会选择性忽略，重点提升"职场沟通效果"。会给出不同场景下的多种表达方案，并解释分别适用的场合。',
    suitableFor: '外贸从业者、外企员工、需要进行国际商务沟通的职场人士'
  },
  {
    value: 'lily',
    name: 'Lily',
    avatar: '👩‍🎓',
    title: '口语陪练达人',
    style: '轻松活泼 · 话题广泛',
    personality: 'Friendly and energetic tutor from New York, currently living in Shanghai. Passionate about cultural exchange and helping Chinese students overcome the "silent English" problem.',
    teachingStyle: '朋友式聊天教学。话题超级广泛：美剧、综艺、美食、旅游、星座、情感、职场八卦……她就像一个外国闺蜜，和你聊各种有趣的话题。擅长用简单的语言解释地道俚语和文化梗。',
    correctionMethod: '自然融入式纠错。不会生硬地指出错误，而是在对话中自然地重复正确的表达方式，比如你说"I go to the park yesterday"，她会回应"Oh really? You WENT to the park yesterday? That sounds fun!"通过重音和语气暗示正确形式，让你在潜移默化中习得正确表达。',
    suitableFor: '想要练习日常对话的学习者、美剧爱好者、对西方文化感兴趣的年轻人'
  },
  {
    value: 'michael',
    name: 'Michael',
    avatar: '👨‍💻',
    title: '模拟面试官',
    style: '严肃正式 · 压力面试',
    personality: 'Senior HR director at a global tech company (FAANG level). Has interviewed over 2000 candidates across entry-level to executive positions. Knows exactly what hiring managers look for.',
    teachingStyle: '高压模拟面试风格。会完全按照真实英文面试的流程和节奏进行，包括自我介绍、行为面试（STAR法则）、技术问答、案例分析、反问环节等。会刻意制造压力情境，训练你的临场反应能力。',
    correctionMethod: '面试维度纠错。从三个层面进行反馈：1) 语言层面（语法、用词、发音）；2) 内容层面（回答是否有逻辑、是否具体、是否展示了能力）；3) 表现层面（语速、语气、自信心、眼神交流等）。会逐字逐句分析你的回答，并提供"满分回答"参考版本。',
    suitableFor: '正在准备英文求职面试的求职者、需要参加海外院校面试的申请者'
  }
]

const proficiencyLevels = [
  {
    value: 'beginner',
    label: '入门级',
    stars: 1,
    cefr: 'A1 - A2',
    desc: '基础词汇与简单句型，慢速清晰'
  },
  {
    value: 'intermediate',
    label: '中级',
    stars: 3,
    cefr: 'B1 - B2',
    desc: '日常交流无障碍，话题可深入'
  },
  {
    value: 'advanced',
    label: '高级',
    stars: 5,
    cefr: 'C1 - C2',
    desc: '流利复杂表达，接近母语水平'
  }
]

const assistantFeatures = [
  { value: 'correction', label: '语法纠错', emoji: '🔤' },
  { value: 'vocabulary', label: '词汇拓展', emoji: '📚' },
  { value: 'tips', label: '地道表达', emoji: '💡' },
  { value: 'translation', label: '中文翻译', emoji: '🌐' }
]

const correctionTimingOptions = [
  {
    value: 'instant',
    label: '即时纠错',
    emoji: '⚡',
    desc: '对话过程中每轮回复后立即指出问题，适合想要快速提升准确性的学习者',
    advantage: '及时发现问题，印象更深刻',
    disadvantage: '可能会打断对话流畅感'
  },
  {
    value: 'summary',
    label: '对话结束后总结',
    emoji: '📋',
    desc: '先专注于交流，对话结束后统一展示所有错误和改进建议，适合想要先练习流利度的学习者',
    advantage: '不打断思路，保持对话自然流畅',
    disadvantage: '错误发现可能不够及时'
  }
]

const sceneOpenings: Record<string, string[]> = {
  daily: [
    "Hi there! I'm so glad to chat with you today. How's your day going so far?",
    "Hey! Great to see you. What would you like to talk about today—hobbies, travel, or something else?",
    "Hello! Ready for a casual chat? Let's start with something easy: tell me what you did last weekend."
  ],
  ielts: [
    "Good morning/afternoon. My name is Emma, and I'll be your examiner today. Can I have your full name, please? Now let's start with Part 1. Let's talk about your hometown. What do you like most about it?",
    "Welcome to the IELTS speaking test. First, I'd like to ask you some questions about yourself. Let's talk about your daily routine. What do you usually do on weekdays?",
    "Hi there! Let's do some IELTS practice. Part 1 warm-up: Do you enjoy reading? What kind of books do you like to read?"
  ],
  toefl: [
    "Let's practice TOEFL Speaking Task 1. Here's your question: Some people prefer to live in a small town, while others prefer to live in a big city. Which do you prefer and why? Please include specific examples and details in your response.",
    "Ready for TOEFL practice? Let's start with an independent speaking task. Question: Do you agree or disagree with the following statement? 'It is better to study in groups than to study alone.' Use specific reasons and examples to support your opinion."
  ],
  business: [
    "Good day! Let's practice some business English. Let's imagine we're in a team meeting. Could you update me on the progress of your current project?",
    "Welcome to business English practice. Let's role-play: I'm a potential client, and you're introducing your company's flagship product. Go ahead whenever you're ready.",
    "Hi! Let's work on business communication. Suppose you need to write an email to your manager requesting a meeting. How would you start the conversation?"
  ],
  interview: [
    "Thank you for coming in today. Let's start with a classic question: Could you please tell me a little about yourself and your background?",
    "Welcome to the interview. I'm Michael, the hiring manager. Let's begin: Why are you interested in this position and our company?",
    "Great to meet you. Let's start the interview. Walk me through your resume and highlight the experiences that make you a strong fit for this role."
  ]
}

const grammarCorrections: Record<string, Correction[]> = {
  'i am': [{ before: 'i am', after: 'I am', explanation: 'The pronoun "I" should always be capitalized in English.', type: 'grammar' }],
  'don\'t have': [{ before: 'don\'t have', after: 'don\'t have', explanation: 'Actually this is correct! Well done.', type: 'grammar' }],
  'very good': [{ before: 'very good', after: 'excellent / outstanding', explanation: 'Instead of repeating "very good", try using more advanced adjectives like "excellent", "outstanding", "superb", or "impressive".', type: 'vocabulary' }],
  'i think': [{ before: 'I think', after: 'From my perspective / In my opinion / I believe', explanation: 'To sound more sophisticated in formal contexts, replace "I think" with "From my perspective", "In my opinion", or "I believe".', type: 'style' }],
  'because': [{ before: 'because', after: 'due to the fact that / as / since', explanation: 'In formal writing and speech, consider "as", "since", or "due to the fact that" as alternatives to "because".', type: 'style' }]
}

const vocabularyDatabase: VocabularyItem[] = [
  { word: 'fascinating', pos: 'adj.', meaning: '极有吸引力的', example: 'The documentary about wildlife was absolutely fascinating.' },
  { word: 'crucial', pos: 'adj.', meaning: '至关重要的', example: 'Effective communication is crucial in any business relationship.' },
  { word: 'enhance', pos: 'v.', meaning: '增强，提升', example: 'We need to enhance our customer service to stay competitive.' },
  { word: 'nonetheless', pos: 'adv.', meaning: '尽管如此，然而', example: 'The task was challenging; nonetheless, we completed it on time.' },
  { word: 'substantial', pos: 'adj.', meaning: '大量的，实质的', example: 'There has been a substantial increase in sales this quarter.' },
  { word: 'acquire', pos: 'v.', meaning: '获得，习得', example: 'She acquired fluency in French after living in Paris for two years.' },
  { word: 'comprehensive', pos: 'adj.', meaning: '全面的，综合的', example: 'We need a comprehensive plan to address this issue.' },
  { word: 'furthermore', pos: 'adv.', meaning: '此外，而且', example: 'The product is affordable. Furthermore, it offers excellent quality.' },
  { word: 'inevitable', pos: 'adj.', meaning: '不可避免的', example: 'Change is inevitable in any growing organization.' },
  { word: 'emphasize', pos: 'v.', meaning: '强调', example: 'I want to emphasize the importance of teamwork.' },
  { word: 'genuinely', pos: 'adv.', meaning: '真诚地，真正地', example: 'She was genuinely interested in learning about different cultures.' },
  { word: 'fluctuate', pos: 'v.', meaning: '波动，起伏', example: 'Stock prices tend to fluctuate based on market sentiment.' }
]

const expressionTips: ExpressionTip[] = [
  { expression: 'Hit the nail on the head', explanation: '说话中肯，一针见血', context: 'You hit the nail on the head when you said we need to improve communication.' },
  { expression: 'Think outside the box', explanation: '跳出思维定式，创造性思考', context: 'To solve this problem, we really need to think outside the box.' },
  { expression: 'Keep someone in the loop', explanation: '让某人保持知情', context: 'Please keep me in the loop regarding any developments on the project.' },
  { expression: 'On the same page', explanation: '达成共识，意见一致', context: "Let's make sure we're all on the same page before we proceed." },
  { expression: 'The ball is in your court', explanation: '轮到你行动了', context: "I've made my offer. Now the ball is in your court." },
  { expression: 'Break the ice', explanation: '打破僵局，活跃气氛', context: 'He told a joke to break the ice at the beginning of the meeting.' },
  { expression: 'Get the ball rolling', explanation: '开始行动，启动', context: "Let's get the ball rolling on this project before the deadline approaches." },
  { expression: 'Bite the bullet', explanation: '咬紧牙关，勇敢面对困难', context: 'I know it\'s difficult, but you just have to bite the bullet and do it.' },
  { expression: 'A piece of cake', explanation: '小菜一碟，非常容易', context: 'Don\'t worry about the exam—it\'ll be a piece of cake for you.' },
  { expression: 'Burn the midnight oil', explanation: '熬夜工作或学习', context: 'I had to burn the midnight oil to finish the report before the deadline.' }
]

const chatStarted = ref(false)
const selectedScene = ref('daily')
const selectedTeacher = ref('owen')
const selectedLevel = ref('intermediate')
const correctionTiming = ref('instant')
const enabledFeatures = ref<string[]>(['correction', 'vocabulary', 'tips', 'translation'])
const showTranslation = ref(false)
const autoSpeak = ref(true)

const messages = ref<ChatMessage[]>([])
const inputText = ref('')
const isGenerating = ref(false)
const isTyping = ref(false)
const quickSuggestions = ref<string[]>([])
const collectedCorrections = ref<{ message: string; corrections: Correction[]; timestamp: number }[]>([])

const isListening = ref(false)
const interimTranscript = ref('')
const recognition = ref<any>(null)

const history = ref<HistorySession[]>([])
const showEndConfirm = ref(false)

const messagesContainer = ref<HTMLElement | null>(null)

const currentSceneInfo = computed(() => practiceScenes.find(s => s.value === selectedScene.value) || practiceScenes[0])
const currentTeacherInfo = computed(() => teacherPersonas.find(t => t.value === selectedTeacher.value) || teacherPersonas[2])
const currentLevelInfo = computed(() => proficiencyLevels.find(l => l.value === selectedLevel.value) || proficiencyLevels[1])

onMounted(() => {
  loadHistoryFromStorage()
  initSpeechRecognition()
})

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

const toggleFeature = (value: string) => {
  const idx = enabledFeatures.value.indexOf(value)
  if (idx > -1) {
    enabledFeatures.value.splice(idx, 1)
  } else {
    enabledFeatures.value.push(value)
  }
  if (value === 'translation') {
    showTranslation.value = enabledFeatures.value.includes('translation')
  }
}

const startChat = () => {
  chatStarted.value = true
  messages.value = []
  collectedCorrections.value = []
  generateOpening()
}

const generateOpening = async () => {
  isTyping.value = true
  await simulateDelay(800 + Math.random() * 700)
  
  const openings = sceneOpenings[selectedScene.value] || sceneOpenings.daily
  const openingText = openings[Math.floor(Math.random() * openings.length)]
  
  const openingTranslation = getTranslation(openingText)
  
  const assistantMsg: ChatMessage = {
    role: 'assistant',
    content: openingText,
    translation: openingTranslation,
    corrections: [],
    vocabulary: pickRandom(vocabularyDatabase, 2),
    tips: [],
    timestamp: Date.now()
  }
  
  messages.value.push(assistantMsg)
  isTyping.value = false
  quickSuggestions.value = generateQuickSuggestions(openingText)
  
  if (autoSpeak.value) {
    speakText(openingText)
  }
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text) return
  
  const userMsg: ChatMessage = {
    role: 'user',
    content: text,
    timestamp: Date.now()
  }
  messages.value.push(userMsg)
  inputText.value = ''
  isGenerating.value = true
  isTyping.value = true
  
  await simulateDelay(1000 + Math.random() * 1500)
  
  const aiResponse = generateAIResponse(text)
  
  if (correctionTiming.value === 'summary' && aiResponse.corrections.length > 0) {
    collectedCorrections.value.push({
      message: text,
      corrections: aiResponse.corrections,
      timestamp: Date.now()
    })
  }
  
  const displayCorrections = correctionTiming.value === 'instant' ? aiResponse.corrections : []
  
  const assistantMsg: ChatMessage = {
    role: 'assistant',
    content: aiResponse.reply,
    translation: aiResponse.translation,
    corrections: displayCorrections,
    vocabulary: aiResponse.vocabulary,
    tips: aiResponse.tips,
    timestamp: Date.now()
  }
  
  messages.value.push(assistantMsg)
  isTyping.value = false
  isGenerating.value = false
  quickSuggestions.value = aiResponse.quickSuggestions
  
  if (autoSpeak.value) {
    speakText(aiResponse.reply)
  }
}

const generateAIResponse = (userText: string): AIResponseData => {
  const scene = selectedScene.value
  const level = selectedLevel.value
  const teacher = currentTeacherInfo.value.personality
  
  const corrections = detectCorrections(userText)
  
  const reply = generateContextualReply(userText, scene, level, teacher)
  const translation = getTranslation(reply)
  
  const vocab = pickRandom(vocabularyDatabase, 2)
  const tips = pickRandom(expressionTips, 1)
  
  const quickSug = generateQuickSuggestions(reply)
  
  return {
    reply,
    translation,
    corrections,
    vocabulary: vocab,
    tips,
    quickSuggestions: quickSug
  }
}

const detectCorrections = (text: string): Correction[] => {
  const corrections: Correction[] = []
  const lowerText = text.toLowerCase()
  
  for (const [pattern, corrs] of Object.entries(grammarCorrections)) {
    if (lowerText.includes(pattern)) {
      corrections.push(...corrs)
    }
  }
  
  if (/^[a-z]/.test(text)) {
    corrections.push({
      before: text.charAt(0),
      after: text.charAt(0).toUpperCase(),
      explanation: 'Sentences in English should always begin with a capital letter.',
      type: 'grammar'
    })
  }
  
  if (!/[.!?]$/.test(text.trim()) && text.split(' ').length > 3) {
    corrections.push({
      before: text,
      after: text + '.',
      explanation: 'Complete sentences should end with punctuation (period, question mark, or exclamation mark).',
      type: 'grammar'
    })
  }
  
  return corrections
}

const generateContextualReply = (userText: string, scene: string, level: string, teacher: string): string => {
  const responsesByScene: Record<string, string[]> = {
    daily: [
      `That's really interesting! ${userText.includes('?') ? "To answer your question, " : ''}I'd love to hear more about that. Could you elaborate a bit more on what you mean?`,
      `Great point! Speaking of that, I remember when I had a similar experience. Have you always felt that way about it?`,
      `I see what you mean. Personally, I find that fascinating. What made you think about that recently?`,
      `That's a wonderful thing to talk about! Tell me more—what do you enjoy most about it?`,
      `Hmm, that's a thought-provoking topic. Do you have any specific examples you could share?`
    ],
    ielts: [
      `Thank you for your answer. Let's explore this further. ${userText.includes('?') ? 'Good question! ' : ''}Can you think of any other reasons why this might be the case?`,
      `That's a comprehensive response. Now, moving to Part 3—how do you think this issue affects younger generations compared to older ones?`,
      `Excellent. You've provided some good examples. Could you give me a personal example from your own experience?`,
      `Good attempt. To extend your answer further, try to include a contrast or a counter-argument. What would you say to someone who disagrees?`,
      `That's a solid answer. Let me challenge you a bit more—in what ways do you think this might change in the next 20 years?`
    ],
    toefl: [
      `That's a well-organized response! You've provided a clear thesis and supporting examples. ${userText.includes('?') ? 'Let me add some perspective. ' : ''}One suggestion: try to use more transition words to connect your ideas.`,
      `Good delivery! Your pronunciation is clear and your pace is appropriate. To improve further, consider adding a concluding sentence that summarizes your main points.`,
      `Excellent use of specific examples! That really strengthens your argument. Have you considered addressing the opposite side of the argument briefly?`,
      `You've made some excellent points. A couple of suggestions: try to vary your vocabulary more and use more complex sentence structures to demonstrate range.`,
      `This is a strong response overall. You might want to work on developing each supporting point with more specific details and personal anecdotes.`
    ],
    business: [
      `Thank you for the update. I appreciate your thorough analysis. Moving forward, ${userText.includes('?') ? "to address your question—" : ''}what are the key action items we should prioritize?`,
      `That's an interesting perspective. Let me push back slightly—have we considered the potential risks associated with that approach?`,
      `I think you're absolutely right. From a stakeholder perspective, how do you propose we communicate this to the client?`,
      `Great point. To add to that, I think we should also consider the long-term strategic implications. What's your take on the ROI here?`,
      `I see where you're coming from. Before we make a decision, could you walk us through the alternatives you've considered?`
    ],
    interview: [
      `Thank you for sharing that. That demonstrates strong leadership skills. Could you give me another example of when you had to make a difficult decision under pressure?`,
      `Impressive experience. Now, let me ask—what would you say is your biggest weakness, and what steps are you taking to improve in that area?`,
      `Excellent answer. I'm curious—where do you see yourself professionally in five years, and how does this role align with those goals?`,
      `That's a great response. Can you tell me about a time when you had a conflict with a colleague or manager, and how you resolved it?`,
      `Very thorough. Based on what you know about our company, what changes or improvements would you suggest in your first 90 days?`
    ]
  }
  
  const sceneResponses = responsesByScene[scene] || responsesByScene.daily
  let reply = sceneResponses[Math.floor(Math.random() * sceneResponses.length)]
  
  if (level === 'beginner') {
    reply = simplifyLanguage(reply)
  } else if (level === 'advanced') {
    reply = enrichLanguage(reply)
  }
  
  return reply
}

const simplifyLanguage = (text: string): string => {
  return text
    .replace(/elaborate/g, 'tell me more')
    .replace(/perspective/g, 'point of view')
    .replace(/comprehensive/g, 'complete')
    .replace(/demonstrate/g, 'show')
    .replace(/furthermore/g, 'also')
    .replace(/consequently/g, 'so')
    .replace(/nevertheless/g, 'but')
    .replace(/significant/g, 'big')
    .replace(/acquire/g, 'get')
    .replace(/utilize/g, 'use')
}

const enrichLanguage = (text: string): string => {
  const additions = [
    ' From a pedagogical standpoint,',
    ' Fundamentally speaking,',
    ' It is worth noting that',
    ' One could argue that',
    ' In essence,'
  ]
  if (Math.random() > 0.5) {
    const addition = additions[Math.floor(Math.random() * additions.length)]
    return text + addition + ' this illustrates the nuanced nature of the topic at hand.'
  }
  return text
}

const getTranslation = (text: string): string => {
  const translations: Record<string, string> = {
    "Hi there! I'm so glad to chat with you today. How's your day going so far?": "你好呀！很高兴今天能和你聊天。你今天过得怎么样？",
    "Hey! Great to see you. What would you like to talk about today—hobbies, travel, or something else?": "嘿！很高兴见到你。今天你想聊什么——爱好、旅行，还是别的？",
    "Hello! Ready for a casual chat? Let's start with something easy: tell me what you did last weekend.": "你好！准备好来一场轻松的聊天了吗？我们从简单的话题开始：说说你上周末做了什么吧。"
  }
  if (translations[text]) return translations[text]
  return ''
}

const generateQuickSuggestions = (lastMessage: string): string[] => {
  const suggestions: Record<string, string[]> = {
    daily: [
      "That sounds amazing! Tell me more about it.",
      "I totally agree with what you said.",
      "Actually, I have a different opinion...",
      "Could you give me an example?",
      "How did you get into that?"
    ],
    ielts: [
      "Well, there are several reasons for this. First of all...",
      "From my perspective, I believe that...",
      "I'd like to share a personal experience about this.",
      "On the one hand... On the other hand...",
      "To be honest, I haven't really thought about it before, but..."
    ],
    toefl: [
      "I definitely agree with this statement because...",
      "Based on my experience, I would say that...",
      "There are two main reasons why I think so. First...",
      "The reading passage states that..., and the professor...",
      "In contrast to the reading, the lecturer argues that..."
    ],
    business: [
      "Thank you for your input. I'd like to add that...",
      "Let's look at this from another angle.",
      "I'm afraid I have to disagree with that approach.",
      "Could we schedule a follow-up meeting to discuss this?",
      "I'll prepare a detailed proposal and share it with the team."
    ],
    interview: [
      "Thank you for that question. In my previous role, I...",
      "That's a great question. Let me think about this for a moment...",
      "One of my greatest strengths is my ability to...",
      "I learned a valuable lesson from that experience...",
      "I'm particularly interested in this role because..."
    ]
  }
  
  const sceneSuggestions = suggestions[selectedScene.value] || suggestions.daily
  const shuffled = sceneSuggestions.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 4)
}

const pickRandom = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.continuous = false
    recognition.value.interimResults = true
    recognition.value.lang = 'en-US'
    
    recognition.value.onresult = (event: any) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }
      interimTranscript.value = interim
      if (final) {
        inputText.value = final
        isListening.value = false
        interimTranscript.value = ''
      }
    }
    
    recognition.value.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      isListening.value = false
      interimTranscript.value = ''
      if (event.error !== 'no-speech') {
        ElMessage.error('语音识别出错，请重试')
      }
    }
    
    recognition.value.onend = () => {
      isListening.value = false
      interimTranscript.value = ''
    }
  }
}

const toggleVoiceInput = () => {
  if (!recognition.value) {
    ElMessage.warning('当前浏览器不支持语音识别，请使用 Chrome 浏览器')
    return
  }
  
  if (isListening.value) {
    recognition.value.stop()
    isListening.value = false
    interimTranscript.value = ''
  } else {
    recognition.value.start()
    isListening.value = true
  }
}

const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) {
    ElMessage.warning('当前浏览器不支持语音朗读')
    return
  }
  
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = selectedLevel.value === 'beginner' ? 0.8 : selectedLevel.value === 'intermediate' ? 0.95 : 1.1
  utterance.pitch = 1
  utterance.volume = 1
  window.speechSynthesis.speak(utterance)
}

const copyText = (text: string) => {
  navigator.clipboard.writeText(text)
  ElMessage.success('已复制到剪贴板')
}

const endChat = () => {
  showEndConfirm.value = false
  
  if (messages.value.length > 0) {
    const session: HistorySession = {
      id: Date.now().toString(),
      startTime: messages.value[0].timestamp,
      scene: selectedScene.value,
      teacher: selectedTeacher.value,
      level: selectedLevel.value,
      messages: [...messages.value]
    }
    history.value.unshift(session)
    saveHistoryToStorage()
    ElMessage.success('对话已保存到历史记录')
  }
  
  chatStarted.value = false
  messages.value = []
}

const loadHistory = (item: HistorySession) => {
  selectedScene.value = item.scene
  selectedTeacher.value = item.teacher
  selectedLevel.value = item.level
  messages.value = item.messages
  chatStarted.value = true
}

const clearHistory = () => {
  history.value = []
  localStorage.removeItem(STORAGE_KEY)
  ElMessage.success('历史记录已清空')
}

const saveHistoryToStorage = () => {
  try {
    const toSave = history.value.slice(0, 20)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

const loadHistoryFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      history.value = JSON.parse(data)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
}

const getSceneLabel = (v: string) => practiceScenes.find(s => s.value === v)?.label || v
const getLevelLabel = (v: string) => proficiencyLevels.find(l => l.value === v)?.label || v

const getCorrectionTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    grammar: '语法',
    vocabulary: '词汇',
    pronunciation: '发音',
    style: '表达风格'
  }
  return map[type] || type
}

const getCorrectionTagType = (type: string): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
    grammar: 'danger',
    vocabulary: 'warning',
    pronunciation: 'primary',
    style: 'info'
  }
  return map[type] || 'info'
}

const getHistoryPreview = (item: HistorySession) => {
  const userMessages = item.messages.filter(m => m.role === 'user')
  if (userMessages.length === 0) return '（暂无用户消息）'
  const last = userMessages[userMessages.length - 1].content
  return last.length > 50 ? last.substring(0, 50) + '...' : last
}
</script>

<style scoped>
.english-speaking-practice {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-card {
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.intro-card :deep(.el-card__body) {
  padding: 28px;
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
  gap: 20px;
  align-items: center;
}

.intro-icon {
  font-size: 56px;
  line-height: 1;
}

.intro-title {
  color: white;
  font-size: 28px;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.intro-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  margin: 0;
  line-height: 1.6;
  max-width: 600px;
}

.intro-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.intro-badges :deep(.el-tag) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.intro-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 16px;
  margin: 0 0 16px 0;
}

.audience-tags,
.scene-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.audience-tag {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 16px;
  border-radius: 10px;
  min-width: 140px;
}

.at-emoji {
  font-size: 24px;
}

.at-name {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.at-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.scene-tags :deep(.el-tag) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  --el-tag-border-color: rgba(255, 255, 255, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.setup-section {
  margin-bottom: 28px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #303133;
}

.hint-tag {
  margin-left: 8px;
}

.scene-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

.scene-card {
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;
}

.scene-card:hover {
  border-color: #c0c4cc;
  transform: translateY(-2px);
}

.scene-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #e8f0ff 0%, #f0f5ff 100%);
}

.scene-emoji {
  font-size: 36px;
  margin-bottom: 8px;
}

.scene-name {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
  color: #303133;
}

.scene-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.two-col-section {
  display: flex;
  gap: 24px;
}

.flex-1 {
  flex: 1;
}

.teacher-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.teacher-card {
  display: flex;
  gap: 14px;
  align-items: center;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.teacher-card:hover {
  border-color: #c0c4cc;
}

.teacher-card.active {
  border-color: #165DFF;
  background: #f0f5ff;
}

.teacher-avatar {
  font-size: 40px;
  line-height: 1;
}

.teacher-info {
  flex: 1;
}

.teacher-name {
  font-weight: 600;
  font-size: 15px;
  color: #303133;
}

.teacher-title {
  font-size: 13px;
  color: #165DFF;
  margin-top: 2px;
}

.teacher-style {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.level-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.level-card:hover {
  border-color: #c0c4cc;
}

.level-card.active {
  border-color: #165DFF;
  background: #f0f5ff;
}

.level-stars {
  display: flex;
  gap: 2px;
}

.level-star {
  color: #e4e7ed;
  font-size: 18px;
}

.level-star.filled {
  color: #f5a623;
}

.level-name {
  font-weight: 600;
  font-size: 15px;
  color: #303133;
  min-width: 70px;
}

.level-desc {
  flex: 1;
  font-size: 13px;
  color: #606266;
}

.level-cefr {
  font-size: 12px;
  color: #909399;
  background: #f4f4f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.feature-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.feature-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid #e4e7ed;
  border-radius: 24px;
  padding: 10px 18px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.feature-chip:hover {
  border-color: #c0c4cc;
}

.feature-chip.active {
  border-color: #165DFF;
  background: #e8f0ff;
  color: #165DFF;
}

.feat-emoji {
  font-size: 18px;
}

.feat-label {
  font-weight: 500;
  font-size: 14px;
}

.action-section {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.start-btn {
  padding: 0 60px;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 25px;
}

.chat-card {
  height: 80vh;
  display: flex;
  flex-direction: column;
  border: none;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.chat-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.teacher-avatar-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 24px;
}

.chat-title-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-subtitle {
  display: flex;
  gap: 8px;
}

.chat-header-right {
  display: flex;
  gap: 10px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fafbfc;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.message-avatar.user {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.message-content-wrapper {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.message-item.user .message-content-wrapper {
  align-items: flex-end;
}

.message-content {
  background: white;
  border-radius: 12px;
  padding: 14px 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  line-height: 1.7;
}

.message-item.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-text {
  font-size: 15px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-translation {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #ebeef5;
  font-size: 13px;
  color: #606266;
}

.message-item.user .message-translation {
  border-top-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.85);
}

.correction-item,
.vocabulary-item,
.tip-item {
  margin-top: 12px;
  padding: 10px 12px;
  background: #fafbfc;
  border-radius: 8px;
  font-size: 13px;
}

.message-item.user .correction-item,
.message-item.user .vocabulary-item,
.message-item.user .tip-item {
  background: rgba(255, 255, 255, 0.15);
}

.correction-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.corr-label {
  font-weight: 600;
  font-size: 12px;
  min-width: 70px;
}

.corr-label.before {
  color: #f56c6c;
}

.corr-label.after {
  color: #67c23a;
}

.corr-text.before-text {
  text-decoration: line-through;
  color: #f56c6c;
}

.corr-text.after-text {
  color: #67c23a;
  font-weight: 500;
}

.correction-explain {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 8px;
  color: #606266;
  font-size: 12px;
}

.vocabulary-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.voc-word {
  font-weight: 700;
  color: #165DFF;
  font-size: 14px;
}

.message-item.user .voc-word {
  color: #bae7ff;
}

.voc-pos {
  font-size: 11px;
  color: #909399;
  background: #f4f4f5;
  padding: 1px 6px;
  border-radius: 3px;
}

.voc-meaning {
  color: #303133;
  font-weight: 500;
}

.message-item.user .voc-meaning {
  color: white;
}

.voc-example {
  font-size: 12px;
  color: #606266;
  width: 100%;
  margin-top: 4px;
  font-style: italic;
}

.message-item.user .voc-example {
  color: rgba(255, 255, 255, 0.85);
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #606266;
}

.message-item.user .tip-item {
  color: rgba(255, 255, 255, 0.9);
}

.message-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #909399;
}

.message-time {
  color: #c0c4cc;
}

.typing-content {
  padding: 16px 18px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #c0c4cc;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.input-area {
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
  background: white;
}

.listening-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
  background: #fef0f0;
  border-radius: 8px;
  color: #f56c6c;
  font-size: 13px;
}

.recognized-text {
  margin-left: 12px;
  color: #606266;
  font-style: italic;
}

.input-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
}

.message-input :deep(.el-textarea__inner) {
  font-size: 15px;
  line-height: 1.6;
}

.send-btn {
  height: 72px;
  padding: 0 24px;
}

.recording {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(245, 108, 108, 0);
  }
}

.input-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.quick-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-tag:hover {
  transform: translateY(-1px);
  --el-tag-border-color: #165DFF;
  --el-tag-text-color: #165DFF;
}

.end-dialog-content {
  padding: 12px 0;
}

.end-dialog-content p {
  margin: 0 0 16px 0;
  color: #303133;
}

.end-stats {
  background: #f5f7fa;
  padding: 12px 16px;
  border-radius: 8px;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #606266;
  font-size: 14px;
}

.history-card {
  border: none;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  padding: 14px 16px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.history-item:hover {
  border-color: #165DFF;
  background: #f8faff;
  transform: translateX(4px);
}

.history-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.history-info {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.history-preview {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.teacher-card {
  position: relative;
  flex-wrap: wrap;
}

.teacher-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.teacher-expand-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #c0c4cc;
  transition: transform 0.3s ease;
}

.teacher-card.active .teacher-expand-icon {
  transform: translateY(-50%) rotate(180deg);
  color: #165DFF;
}

.teacher-detail {
  width: 100%;
  margin-top: 4px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-weight: 600;
  font-size: 13px;
  color: #303133;
}

.detail-content {
  font-size: 13px;
  color: #606266;
  line-height: 1.7;
}

.timing-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timing-card {
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.timing-card:hover {
  border-color: #c0c4cc;
}

.timing-card.active {
  border-color: #165DFF;
  background: #f0f5ff;
}

.timing-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.timing-emoji {
  font-size: 20px;
}

.timing-name {
  font-weight: 600;
  font-size: 15px;
  color: #303133;
}

.timing-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 10px;
}

.timing-pros-cons {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pros-row,
.cons-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
}

.correction-summary {
  margin-top: 16px;
}

.summary-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.summary-group {
  background: #fafbfc;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 12px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.group-user-msg {
  color: #303133;
  font-weight: 500;
  font-style: italic;
}

.group-time {
  margin-left: auto;
  font-size: 12px;
  color: #909399;
}

.summary-correction-item {
  background: white;
  border-radius: 8px;
  padding: 10px 12px;
  margin-top: 8px;
  border: 1px solid #ebeef5;
}

.corr-pair {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 14px;
  margin-bottom: 6px;
}

.corr-before {
  color: #f56c6c;
  text-decoration: line-through;
}

.corr-after {
  color: #67c23a;
  font-weight: 600;
}

.corr-explain {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #606266;
  line-height: 1.6;
  padding-top: 6px;
  border-top: 1px dashed #ebeef5;
}

.no-correction-note {
  margin-top: 16px;
}

.end-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .intro-sections {
    grid-template-columns: 1fr;
  }

  .two-col-section {
    flex-direction: column;
  }

  .message-content-wrapper {
    max-width: 85%;
  }

  .chat-card {
    height: calc(100vh - 140px);
  }
}
</style>