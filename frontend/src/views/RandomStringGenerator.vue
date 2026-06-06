<template>
  <div class="random-string-generator">
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
        <el-step title="设置参数" description="配置字符串长度范围、字符集和生成数量" />
        <el-step title="点击生成" description="点击按钮生成符合要求的随机字符串" />
        <el-step title="复制使用" description="一键复制单个或全部生成结果" />
      </el-steps>
    </el-card>

    <el-card class="generator-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Key />
          </el-icon>
          <span>随机字符串生成器</span>
          <el-tag size="small" type="info" class="header-tag">生成密码、Token、API密钥</el-tag>
        </div>
      </template>

      <div class="quick-preset">
        <span class="preset-label">快捷预设：</span>
        <el-button-group>
          <el-button size="small" @click="applyPreset('password')">
            <el-icon><Lock /></el-icon>
            强密码
          </el-button>
          <el-button size="small" @click="applyPreset('token')">
            <el-icon><Coin /></el-icon>
            API Token
          </el-button>
          <el-button size="small" @click="applyPreset('otp')">
            <el-icon><Key /></el-icon>
            OTP验证码
          </el-button>
          <el-button size="small" @click="applyPreset('hex')">
            <el-icon><Brush /></el-icon>
            HEX密钥
          </el-button>
        </el-button-group>
      </div>

      <el-form label-width="100px" class="generator-form">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="最小长度">
              <el-input-number v-model="minLength" :min="1" :max="256" @change="validateLength" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大长度">
              <el-input-number v-model="maxLength" :min="1" :max="512" @change="validateLength" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="生成数量">
              <el-input-number v-model="count" :min="1" :max="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字符集">
              <div class="charset-options">
                <el-checkbox v-model="options.uppercase">大写字母 (A-Z)</el-checkbox>
                <el-checkbox v-model="options.lowercase">小写字母 (a-z)</el-checkbox>
                <el-checkbox v-model="options.numbers">数字 (0-9)</el-checkbox>
                <el-checkbox v-model="options.symbols">特殊符号 (!@#$...)</el-checkbox>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="高级选项">
              <div class="advanced-options">
                <el-checkbox v-model="options.excludeSimilar">排除相似字符 (0/O/1/l/I)</el-checkbox>
                <el-checkbox v-model="options.excludeAmbiguous">排除歧义符号 ({ } [ ] ( ) / \ ' " ` ~ , ; : . < >)</el-checkbox>
                <el-checkbox v-model="options.customCharsetEnabled">使用自定义字符集</el-checkbox>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24" v-if="options.customCharsetEnabled">
          <el-col :span="24">
            <el-form-item label="自定义字符">
              <el-input
                v-model="customCharset"
                placeholder="请输入自定义字符，例如：ABCDEF123456"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="charset-preview" v-if="activeCharset.length > 0">
        <div class="preview-label">
          <el-icon :size="14"><DataLine /></el-icon>
          <span>当前字符集（共 {{ activeCharset.length }} 个字符）：</span>
        </div>
        <div class="preview-chars">{{ activeCharsetPreview }}</div>
      </div>

      <div class="action-buttons">
        <el-button
          type="primary"
          size="large"
          :icon="MagicStick"
          @click="generate"
          :disabled="!canGenerate"
          class="generate-button"
        >
          生成随机字符串
        </el-button>
        <el-button
          size="large"
          :icon="Refresh"
          @click="reset"
        >
          重置
        </el-button>
      </div>
    </el-card>

    <el-card class="results-card" v-if="results.length > 0">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Document />
          </el-icon>
          <span>生成结果</span>
          <el-tag size="small" type="success">共 {{ results.length }} 条</el-tag>
          <div class="header-actions">
            <el-button size="small" :icon="CopyDocument" @click="copyAll">复制全部</el-button>
            <el-button size="small" type="danger" text :icon="Delete" @click="clearResults">清空</el-button>
          </div>
        </div>
      </template>

      <div class="results-list">
        <div
          v-for="(result, index) in results"
          :key="index"
          class="result-item"
        >
          <div class="result-index">{{ index + 1 }}</div>
          <div class="result-content">
            <code class="result-code">{{ result }}</code>
            <div class="result-meta">
              <el-tag size="small" type="info">长度: {{ result.length }}</el-tag>
              <span class="strength-badge" :class="getStrengthClass(result)">
                {{ getStrengthLabel(result) }}
              </span>
            </div>
          </div>
          <div class="result-actions">
            <el-button
              size="small"
              text
              type="primary"
              :icon="CopyDocument"
              @click="copyResult(result)"
            >
              复制
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="history-card" v-if="history.length > 0">
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
        >
          <span class="history-time">{{ formatTime(item.time) }}</span>
          <div class="history-config">
            <el-tag size="small">{{ item.config }}</el-tag>
          </div>
          <code class="history-content">{{ item.result }}</code>
          <el-button
            size="small"
            text
            type="primary"
            :icon="CopyDocument"
            @click="copyResult(item.result)"
          >
            复制
          </el-button>
        </div>
      </div>
      <div class="history-footer" v-if="history.length > 20">
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
  Key,
  InfoFilled,
  Lock,
  Coin,
  Brush,
  MagicStick,
  Refresh,
  Document,
  CopyDocument,
  Delete,
  Clock,
  DataLine
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface HistoryItem {
  result: string
  config: string
  time: string
}

const STORAGE_KEY = 'random_string_history'

const minLength = ref(16)
const maxLength = ref(20)
const count = ref(5)
const customCharset = ref('')
const results = ref<string[]>([])
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const options = ref({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
  excludeSimilar: false,
  excludeAmbiguous: false,
  customCharsetEnabled: false
})

const CHARSET = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: '0O1lI',
  ambiguous: '{}[]()/\\\'"`~,;:.<>'
}

const presets: Record<string, any> = {
  password: {
    minLength: 16,
    maxLength: 20,
    count: 5,
    options: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
      excludeAmbiguous: true,
      customCharsetEnabled: false
    }
  },
  token: {
    minLength: 32,
    maxLength: 64,
    count: 3,
    options: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      excludeSimilar: false,
      excludeAmbiguous: false,
      customCharsetEnabled: false
    }
  },
  otp: {
    minLength: 6,
    maxLength: 6,
    count: 10,
    options: {
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
      excludeSimilar: false,
      excludeAmbiguous: false,
      customCharsetEnabled: false
    }
  },
  hex: {
    minLength: 16,
    maxLength: 32,
    count: 5,
    options: {
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
      excludeSimilar: false,
      excludeAmbiguous: false,
      customCharsetEnabled: true
    },
    customCharset: '0123456789abcdef'
  }
}

const presetNames: Record<string, string> = {
  password: '强密码',
  token: 'API Token',
  otp: 'OTP验证码',
  hex: 'HEX密钥'
}

const activeCharset = computed(() => {
  if (options.value.customCharsetEnabled) {
    return [...new Set(customCharset.value.split(''))].join('')
  }

  let charset = ''
  if (options.value.uppercase) charset += CHARSET.uppercase
  if (options.value.lowercase) charset += CHARSET.lowercase
  if (options.value.numbers) charset += CHARSET.numbers
  if (options.value.symbols) charset += CHARSET.symbols

  if (options.value.excludeSimilar) {
    charset = charset.split('').filter(c => !CHARSET.similar.includes(c)).join('')
  }
  if (options.value.excludeAmbiguous) {
    charset = charset.split('').filter(c => !CHARSET.ambiguous.includes(c)).join('')
  }

  return [...new Set(charset.split(''))].join('')
})

const activeCharsetPreview = computed(() => {
  const chars = activeCharset.value
  if (chars.length <= 50) return chars
  return chars.slice(0, 50) + '...'
})

const canGenerate = computed(() => {
  return activeCharset.value.length > 0 && minLength.value > 0 && maxLength.value >= minLength.value
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  if (showAllHistory.value) {
    return reversed
  }
  return reversed.slice(0, 20)
})

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

onMounted(() => {
  loadHistory()
})

const validateLength = () => {
  if (minLength.value > maxLength.value) {
    maxLength.value = minLength.value
  }
}

const applyPreset = (type: string) => {
  const preset = presets[type]
  if (preset) {
    minLength.value = preset.minLength
    maxLength.value = preset.maxLength
    count.value = preset.count
    options.value = { ...preset.options }
    customCharset.value = preset.customCharset || ''
    ElMessage.success(`已加载${presetNames[type]}预设`)
  }
}

const getSecureRandomInt = (max: number) => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] % max
  }
  return Math.floor(Math.random() * max)
}

const generateSingle = () => {
  const charset = activeCharset.value
  const len = minLength.value === maxLength.value
    ? minLength.value
    : minLength.value + getSecureRandomInt(maxLength.value - minLength.value + 1)

  let result = ''
  for (let i = 0; i < len; i++) {
    result += charset[getSecureRandomInt(charset.length)]
  }
  return result
}

const getConfigLabel = () => {
  const parts = []
  parts.push(`${minLength.value}-${maxLength.value}位`)
  if (options.value.customCharsetEnabled) {
    parts.push('自定义字符')
  } else {
    if (options.value.uppercase) parts.push('大写')
    if (options.value.lowercase) parts.push('小写')
    if (options.value.numbers) parts.push('数字')
    if (options.value.symbols) parts.push('符号')
  }
  return parts.join(' / ')
}

const generate = () => {
  if (!canGenerate.value) {
    ElMessage.warning('请选择至少一种字符类型，并确保长度设置正确')
    return
  }

  const newResults: string[] = []
  for (let i = 0; i < count.value; i++) {
    newResults.push(generateSingle())
  }

  results.value = newResults

  const config = getConfigLabel()
  newResults.forEach(result => {
    history.value.push({
      result,
      config,
      time: new Date().toISOString()
    })
  })

  if (history.value.length > 200) {
    history.value = history.value.slice(-200)
  }
  saveHistory()

  ElMessage.success(`成功生成 ${newResults.length} 条随机字符串`)
}

const reset = () => {
  minLength.value = 16
  maxLength.value = 20
  count.value = 5
  customCharset.value = ''
  options.value = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: false,
    excludeAmbiguous: false,
    customCharsetEnabled: false
  }
  results.value = []
}

const copyResult = async (str: string) => {
  try {
    await navigator.clipboard.writeText(str)
    ElMessage.success('已复制到剪贴板')
  } catch (e) {
    const textarea = document.createElement('textarea')
    textarea.value = str
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('已复制到剪贴板')
  }
}

const copyAll = async () => {
  const text = results.value.join('\n')
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`已复制 ${results.value.length} 条结果`)
  } catch (e) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success(`已复制 ${results.value.length} 条结果`)
  }
}

const clearResults = () => {
  results.value = []
  ElMessage.success('已清空结果')
}

const clearHistory = () => {
  history.value = []
  saveHistory()
  ElMessage.success('历史记录已清空')
}

const getStrengthClass = (str: string) => {
  const score = getStrengthScore(str)
  if (score >= 4) return 'strong'
  if (score >= 3) return 'medium'
  return 'weak'
}

const getStrengthLabel = (str: string) => {
  const score = getStrengthScore(str)
  if (score >= 4) return '强度: 强'
  if (score >= 3) return '强度: 中'
  return '强度: 弱'
}

const getStrengthScore = (str: string) => {
  let score = 0
  if (str.length >= 8) score++
  if (str.length >= 16) score++
  if (/[a-z]/.test(str)) score++
  if (/[A-Z]/.test(str)) score++
  if (/[0-9]/.test(str)) score++
  if (/[^a-zA-Z0-9]/.test(str)) score++
  return score
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>

<style scoped>
.random-string-generator {
  max-width: 900px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.generator-card {
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

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.quick-preset {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
  flex-wrap: wrap;
}

.preset-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.generator-form {
  margin-bottom: 20px;
}

.charset-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.advanced-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.charset-preview {
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.preview-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  margin-bottom: 8px;
}

.preview-chars {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  color: #303133;
  word-break: break-all;
  line-height: 1.6;
  padding: 8px 12px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.generate-button {
  width: 240px;
  height: 56px;
  font-size: 18px;
}

.results-card {
  margin-bottom: 24px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.result-item:hover {
  background: #f0f7ff;
}

.result-index {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-code {
  display: block;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #303133;
  word-break: break-all;
  line-height: 1.6;
  padding: 8px 12px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  margin-bottom: 8px;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.strength-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.strength-badge.strong {
  background: #f0f9eb;
  color: #67c23a;
}

.strength-badge.medium {
  background: #fdf6ec;
  color: #e6a23c;
}

.strength-badge.weak {
  background: #fef0f0;
  color: #f56c6c;
}

.result-actions {
  flex-shrink: 0;
}

.history-card {
  margin-bottom: 24px;
}

.history-card .card-header {
  justify-content: space-between;
}

.history-list {
  display: flex;
  flex-direction: column;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  gap: 12px;
}

.history-item:last-child {
  border-bottom: none;
}

.history-time {
  font-size: 12px;
  color: #909399;
  min-width: 110px;
}

.history-config {
  flex-shrink: 0;
}

.history-content {
  flex: 1;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  color: #606266;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
}

.history-footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

@media (max-width: 768px) {
  .advanced-options {
    flex-direction: column;
    gap: 8px;
  }

  .result-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-content {
    max-width: 100%;
    white-space: normal;
  }
}
</style>
