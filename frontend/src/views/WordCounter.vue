<template>
  <div class="word-counter">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <el-steps :active="0" finish-status="wait" simple class="guide-steps">
        <el-step title="输入文本" description="直接输入或粘贴需要统计的文本内容" />
        <el-step title="查看统计" description="实时获取字数、字符数、行数等详细数据" />
        <el-step title="复制结果" description="可一键复制统计结果，方便使用" />
      </el-steps>
    </el-card>

    <el-card class="counter-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Document />
          </el-icon>
          <span>文本字数统计</span>
          <el-tag size="small" type="info" class="header-tag">支持中英文混合统计</el-tag>
        </div>
      </template>

      <div class="quick-preset">
        <span class="preset-label">快捷操作：</span>
        <el-button-group>
          <el-button size="small" @click="clearText">
            <el-icon><Delete /></el-icon>
            清空内容
          </el-button>
          <el-button size="small" @click="pasteFromClipboard">
            <el-icon><Document /></el-icon>
            粘贴剪贴板
          </el-button>
          <el-button size="small" @click="copyStats" :disabled="!hasContent">
            <el-icon><CopyDocument /></el-icon>
            复制统计
          </el-button>
        </el-button-group>
      </div>

      <div class="input-section">
        <div class="input-header">
          <span class="input-label">文本内容</span>
          <div class="input-actions">
            <el-tag size="small" type="info">
              {{ text.length }} 字符
            </el-tag>
            <el-tooltip content="支持 Ctrl+V 粘贴" placement="top">
              <el-icon class="help-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </div>
        <el-input
          v-model="text"
          type="textarea"
          :rows="12"
          placeholder="请输入或粘贴需要统计的文本内容..."
          resize="vertical"
          class="text-input"
          @input="handleInput"
        />
      </div>

      <el-divider />

      <div class="stats-section">
        <div class="stats-header">
          <el-icon :size="18" color="#165DFF"><DataLine /></el-icon>
          <span>统计结果</span>
          <el-tag v-if="!hasContent" size="small" type="info">请输入文本</el-tag>
          <el-tag v-else size="small" type="success">已统计</el-tag>
        </div>

        <el-row :gutter="16" class="stats-grid">
          <el-col :span="6">
            <div class="stat-card primary">
              <div class="stat-icon">
                <el-icon><Edit /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.totalChars }}</div>
                <div class="stat-label">总字符数</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card success">
              <div class="stat-icon">
                <el-icon><Tickets /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.chineseChars }}</div>
                <div class="stat-label">中文字符</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card warning">
              <div class="stat-icon">
                <el-icon><Goods /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.englishChars }}</div>
                <div class="stat-label">英文字符</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card danger">
              <div class="stat-icon">
                <el-icon><Histogram /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.digitChars }}</div>
                <div class="stat-label">数字字符</div>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="stats-grid">
          <el-col :span="6">
            <div class="stat-card info">
              <div class="stat-icon">
                <el-icon><ChatLineRound /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.totalWords }}</div>
                <div class="stat-label">总字数</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card info">
              <div class="stat-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.charsNoSpace }}</div>
                <div class="stat-label">不含空格</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card info">
              <div class="stat-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.lines }}</div>
                <div class="stat-label">行数</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card info">
              <div class="stat-icon">
                <el-icon><Tickets /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.paragraphs }}</div>
                <div class="stat-label">段落数</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-card v-if="hasContent" class="detail-stats-card" shadow="never">
        <div class="detail-stats-header">
          <el-icon :size="16" color="#165DFF"><DataAnalysis /></el-icon>
          <span>详细分析</span>
        </div>
        <div class="detail-stats-content">
          <div class="detail-item">
            <span class="detail-label">空格数</span>
            <span class="detail-value">{{ stats.spaceChars }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">标点符号</span>
            <span class="detail-value">{{ stats.punctuationChars }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">英文单词</span>
            <span class="detail-value">{{ stats.englishWords }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">平均句长</span>
            <span class="detail-value">{{ stats.avgSentenceLength }} 字符</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">阅读时间</span>
            <span class="detail-value">{{ stats.readTime }} 分钟</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">字节大小</span>
            <span class="detail-value">{{ stats.byteSize }}</span>
          </div>
        </div>
      </el-card>

      <el-card v-if="hasContent" class="density-card" shadow="never">
        <div class="density-header">
          <el-icon :size="16" color="#165DFF"><PieChart /></el-icon>
          <span>字符分布</span>
        </div>
        <div class="density-content">
          <div class="density-bar">
            <div 
              class="density-segment chinese" 
              :style="{ width: stats.chinesePercent + '%' }"
              :title="`中文 ${stats.chinesePercent}%`"
            ></div>
            <div 
              class="density-segment english" 
              :style="{ width: stats.englishPercent + '%' }"
              :title="`英文 ${stats.englishPercent}%`"
            ></div>
            <div 
              class="density-segment digit" 
              :style="{ width: stats.digitPercent + '%' }"
              :title="`数字 ${stats.digitPercent}%`"
            ></div>
            <div 
              class="density-segment other" 
              :style="{ width: stats.otherPercent + '%' }"
              :title="`其他 ${stats.otherPercent}%`"
            ></div>
          </div>
          <div class="density-legend">
            <span class="legend-item">
              <span class="legend-color chinese"></span>
              中文 {{ stats.chinesePercent }}%
            </span>
            <span class="legend-item">
              <span class="legend-color english"></span>
              英文 {{ stats.englishPercent }}%
            </span>
            <span class="legend-item">
              <span class="legend-color digit"></span>
              数字 {{ stats.digitPercent }}%
            </span>
            <span class="legend-item">
              <span class="legend-color other"></span>
              其他 {{ stats.otherPercent }}%
            </span>
          </div>
        </div>
      </el-card>
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
        <div class="history-item" v-for="(item, index) in displayHistory" :key="index">
          <div class="history-preview">{{ item.preview }}</div>
          <div class="history-meta">
            <el-tag size="small" type="info">{{ item.stats.totalChars }} 字符</el-tag>
            <span class="history-time">{{ formatTime(item.time) }}</span>
          </div>
          <div class="history-actions">
            <el-button size="small" text @click="loadHistoryItem(item)">
              <el-icon><Refresh /></el-icon>
              载入
            </el-button>
          </div>
        </div>
      </div>
      <div class="history-footer" v-if="history.length > 10">
        <el-button text size="small" @click="showAllHistory = !showAllHistory">
          {{ showAllHistory ? '收起' : `查看全部 ${history.length} 条记录` }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  Document,
  InfoFilled,
  Delete,
  CopyDocument,
  DataLine,
  DataAnalysis,
  Edit,
  Tickets,
  ChatLineRound,
  Goods,
  Histogram,
  QuestionFilled,
  PieChart,
  Clock,
  Refresh
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Stats {
  totalChars: number
  chineseChars: number
  englishChars: number
  digitChars: number
  spaceChars: number
  punctuationChars: number
  totalWords: number
  charsNoSpace: number
  lines: number
  paragraphs: number
  englishWords: number
  avgSentenceLength: string
  readTime: string
  byteSize: string
  chinesePercent: string
  englishPercent: string
  digitPercent: string
  otherPercent: string
}

interface HistoryItem {
  text: string
  preview: string
  stats: Stats
  time: string
}

const STORAGE_KEY = 'word_counter_history'

const text = ref('')
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const hasContent = computed(() => text.value.length > 0)

const stats = computed<Stats>(() => {
  const str = text.value
  
  const totalChars = str.length
  const chineseChars = (str.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishChars = (str.match(/[a-zA-Z]/g) || []).length
  const digitChars = (str.match(/[0-9]/g) || []).length
  const spaceChars = (str.match(/\s/g) || []).length
  const punctuationChars = (str.match(/[，。！？、；：""''（）【】《》！￥……（）——\-,.!?;:\'\"()\[\]<>@#$%^&*_+=\|\\\/`~]/g) || []).length
  
  const chineseWords = chineseChars
  const englishWords = (str.match(/[a-zA-Z]+/g) || []).length
  const totalWords = chineseWords + englishWords
  
  const charsNoSpace = str.replace(/\s/g, '').length
  
  const lines = str === '' ? 0 : str.split('\n').length
  
  const paragraphs = str === '' ? 0 : str.split(/\n\s*\n/).filter(p => p.trim() !== '').length
  
  const sentences = str.split(/[。！？.!?]+/).filter(s => s.trim() !== '')
  const avgSentenceLength = sentences.length > 0 
    ? (charsNoSpace / sentences.length).toFixed(1) 
    : '0'
  
  const readTime = totalWords > 0 
    ? Math.max(1, Math.ceil(totalWords / 300)).toString() 
    : '0'
  
  const encoder = new TextEncoder()
  const byteCount = encoder.encode(str).length
  let byteSize = ''
  if (byteCount < 1024) {
    byteSize = `${byteCount} B`
  } else if (byteCount < 1024 * 1024) {
    byteSize = `${(byteCount / 1024).toFixed(2)} KB`
  } else {
    byteSize = `${(byteCount / (1024 * 1024)).toFixed(2)} MB`
  }
  
  const otherChars = totalChars - chineseChars - englishChars - digitChars
  const chinesePercent = totalChars > 0 ? ((chineseChars / totalChars) * 100).toFixed(1) : '0.0'
  const englishPercent = totalChars > 0 ? ((englishChars / totalChars) * 100).toFixed(1) : '0.0'
  const digitPercent = totalChars > 0 ? ((digitChars / totalChars) * 100).toFixed(1) : '0.0'
  const otherPercent = totalChars > 0 ? ((otherChars / totalChars) * 100).toFixed(1) : '0.0'
  
  return {
    totalChars,
    chineseChars,
    englishChars,
    digitChars,
    spaceChars,
    punctuationChars,
    totalWords,
    charsNoSpace,
    lines,
    paragraphs,
    englishWords,
    avgSentenceLength,
    readTime,
    byteSize,
    chinesePercent,
    englishPercent,
    digitPercent,
    otherPercent
  }
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  if (showAllHistory.value) {
    return reversed
  }
  return reversed.slice(0, 10)
})

const loadHistoryFromStorage = () => {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

const addToHistory = () => {
  if (!hasContent.value) return
  
  const preview = text.value.substring(0, 50) + (text.value.length > 50 ? '...' : '')
  
  history.value.push({
    text: text.value,
    preview,
    stats: { ...stats.value },
    time: new Date().toISOString()
  })
  
  if (history.value.length > 100) {
    history.value = history.value.slice(-100)
  }
  
  saveHistory()
}

const clearText = () => {
  text.value = ''
  ElMessage.success('已清空内容')
}

const pasteFromClipboard = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText()
    if (clipboardText) {
      text.value += clipboardText
      ElMessage.success('已从剪贴板粘贴')
    } else {
      ElMessage.warning('剪贴板为空')
    }
  } catch (e) {
    ElMessage.error('无法访问剪贴板，请手动粘贴')
  }
}

const copyStats = () => {
  if (!hasContent.value) return
  
  const statsText = `【文本字数统计结果】
总字符数：${stats.value.totalChars}
中文字符：${stats.value.chineseChars}
英文字符：${stats.value.englishChars}
数字字符：${stats.value.digitChars}
总字数：${stats.value.totalWords}
不含空格：${stats.value.charsNoSpace}
行数：${stats.value.lines}
段落数：${stats.value.paragraphs}
阅读时间：约 ${stats.value.readTime} 分钟`
  
  navigator.clipboard.writeText(statsText).then(() => {
    ElMessage.success('统计结果已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

const handleInput = () => {
}

let saveTimeout: number | null = null
watch(text, () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  saveTimeout = window.setTimeout(() => {
    if (hasContent.value) {
      addToHistory()
    }
  }, 3000)
})

const loadHistoryItem = (item: HistoryItem) => {
  text.value = item.text
  ElMessage.success('已载入历史记录')
}

const clearHistory = () => {
  history.value = []
  saveHistory()
  ElMessage.success('历史记录已清空')
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
  loadHistoryFromStorage()
})
</script>

<style scoped>
.word-counter {
  max-width: 900px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.counter-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.header-tag {
  margin-left: 12px;
  font-weight: normal;
}

.quick-preset {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.preset-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.input-section {
  margin-bottom: 24px;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-icon {
  color: #909399;
  cursor: help;
  font-size: 16px;
}

.text-input :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.8;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.stats-section {
  margin-top: 24px;
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.stats-header .el-tag {
  margin-left: auto;
  font-weight: normal;
}

.stats-grid {
  margin-bottom: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #fff;
  border: 1px solid #ebeef5;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.primary {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border-color: #b3d8ff;
}

.stat-card.success {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-color: #c2e7b0;
}

.stat-card.warning {
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-color: #f5dab1;
}

.stat-card.danger {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border-color: #fbc4c4;
}

.stat-card.info {
  background: linear-gradient(135deg, #f4f4f5 0%, #e9e9eb 100%);
  border-color: #d3d4d6;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  flex-shrink: 0;
}

.stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #409eff, #165DFF);
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #67c23a, #529e2e);
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #e6a23c, #cf9236);
}

.stat-card.danger .stat-icon {
  background: linear-gradient(135deg, #f56c6c, #dd6161);
}

.stat-card.info .stat-icon {
  background: linear-gradient(135deg, #909399, #73767a);
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #606266;
  margin-top: 4px;
}

.detail-stats-card {
  margin-top: 16px;
  background: #fafafa;
}

.detail-stats-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.detail-stats-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 6px;
}

.detail-label {
  font-size: 13px;
  color: #606266;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #165DFF;
}

.density-card {
  margin-top: 16px;
  background: #fafafa;
}

.density-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.density-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.density-bar {
  display: flex;
  height: 16px;
  border-radius: 8px;
  overflow: hidden;
  background: #e4e7ed;
}

.density-segment {
  height: 100%;
  transition: width 0.5s ease;
}

.density-segment.chinese {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.density-segment.english {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}

.density-segment.digit {
  background: linear-gradient(135deg, #e6a23c, #ebb563);
}

.density-segment.other {
  background: linear-gradient(135deg, #909399, #a6a9ad);
}

.density-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-color.chinese {
  background: #67c23a;
}

.legend-color.english {
  background: #409eff;
}

.legend-color.digit {
  background: #e6a23c;
}

.legend-color.other {
  background: #909399;
}

.history-card {
  margin-bottom: 24px;
}

.history-card .card-header {
  justify-content: space-between;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  gap: 16px;
}

.history-item:last-child {
  border-bottom: none;
}

.history-preview {
  flex: 1;
  font-size: 14px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.history-time {
  font-size: 12px;
  color: #909399;
}

.history-actions {
  display: flex;
  gap: 8px;
}

.history-footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}
</style>
