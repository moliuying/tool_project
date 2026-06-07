<template>
  <div class="js-code-beautifier">
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
        <el-step title="粘贴代码" description="在左侧编辑区粘贴或输入需要处理的 JavaScript 代码" />
        <el-step title="选择模式" description="根据需求选择美化、净化或压缩模式，并可自定义缩进等选项" />
        <el-step title="一键转换" description="点击对应的转换按钮，系统将自动处理代码并在右侧显示结果" />
        <el-step title="复制导出" description="复制处理后的代码或下载为 .js 文件" />
      </el-steps>
    </el-card>

    <el-card class="scene-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Suitcase />
          </el-icon>
          <span>适用场景</span>
        </div>
      </template>
      <div class="scene-tags">
        <el-tag type="primary" effect="plain">开发调试 - 阅读第三方压缩源码</el-tag>
        <el-tag type="success" effect="plain">代码审查 - 规范化提交前的代码格式</el-tag>
        <el-tag type="warning" effect="plain">生产部署 - 压缩代码减小传输体积</el-tag>
        <el-tag type="info" effect="plain">学习研究 - 分析混淆/压缩后的代码逻辑</el-tag>
        <el-tag type="danger" effect="plain">代码清理 - 去除冗余注释和空白字符</el-tag>
      </div>
    </el-card>

    <el-card class="mode-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Operation />
          </el-icon>
          <span>三种处理模式对比</span>
          <el-tag size="small" type="info" effect="plain">不知道选哪个？先看这里</el-tag>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="mode-item mode-beautify" @click="loadExample; setTimeout(() => doBeautify(), 100)">
            <div class="mode-icon">
              <el-icon :size="32" color="#409eff"><MagicStick /></el-icon>
            </div>
            <div class="mode-name">美化 (Beautify)</div>
            <div class="mode-brief">让代码变得好看易读</div>
            <el-divider />
            <div class="mode-features">
              <div class="feature-item">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                <span>保留所有注释</span>
              </div>
              <div class="feature-item">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                <span>正确缩进与换行</span>
              </div>
              <div class="feature-item">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                <span>运算符之间加空格</span>
              </div>
              <div class="feature-item">
                <el-icon color="#e6a23c"><WarningFilled /></el-icon>
                <span>代码体积会增大</span>
              </div>
            </div>
            <el-divider />
            <div class="mode-scenarios">
              <div class="scenario-title">适用场景：</div>
              <div class="scenario-tag-group">
                <el-tag size="small" type="primary" effect="light">阅读压缩源码</el-tag>
                <el-tag size="small" type="primary" effect="light">调试第三方库</el-tag>
                <el-tag size="small" type="primary" effect="light">学习分析代码</el-tag>
              </div>
            </div>
            <el-button type="primary" size="small" class="mode-btn" @click.stop="doBeautify">
              <el-icon><MagicStick /></el-icon>
              使用美化
            </el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="mode-item mode-purify" @click="loadExample; setTimeout(() => doPurify(), 100)">
            <div class="mode-icon">
              <el-icon :size="32" color="#e6a23c"><Brush /></el-icon>
            </div>
            <div class="mode-name">净化 (Purify)</div>
            <div class="mode-brief">去除注释，保留整洁格式</div>
            <el-divider />
            <div class="mode-features">
              <div class="feature-item">
                <el-icon color="#f56c6c"><CircleClose /></el-icon>
                <span>删除所有注释（行/块）</span>
              </div>
              <div class="feature-item">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                <span>保留正确缩进与换行</span>
              </div>
              <div class="feature-item">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                <span>去除多余空白字符</span>
              </div>
              <div class="feature-item">
                <el-icon color="#e6a23c"><WarningFilled /></el-icon>
                <span>丢失注释信息</span>
              </div>
            </div>
            <el-divider />
            <div class="mode-scenarios">
              <div class="scenario-title">适用场景：</div>
              <div class="scenario-tag-group">
                <el-tag size="small" type="warning" effect="light">代码提交前清理</el-tag>
                <el-tag size="small" type="warning" effect="light">去除敏感注释</el-tag>
                <el-tag size="small" type="warning" effect="light">规范代码格式</el-tag>
              </div>
            </div>
            <el-button type="warning" size="small" class="mode-btn" @click.stop="doPurify">
              <el-icon><Brush /></el-icon>
              使用净化
            </el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="mode-item mode-minify" @click="loadExample; setTimeout(() => doMinify(), 100)">
            <div class="mode-icon">
              <el-icon :size="32" color="#f56c6c"><Compress /></el-icon>
            </div>
            <div class="mode-name">压缩 (Minify)</div>
            <div class="mode-brief">极致压缩，最小化体积</div>
            <el-divider />
            <div class="mode-features">
              <div class="feature-item">
                <el-icon color="#f56c6c"><CircleClose /></el-icon>
                <span>删除所有注释</span>
              </div>
              <div class="feature-item">
                <el-icon color="#f56c6c"><CircleClose /></el-icon>
                <span>删除所有换行和缩进</span>
              </div>
              <div class="feature-item">
                <el-icon color="#f56c6c"><CircleClose /></el-icon>
                <span>删除非必要空格</span>
              </div>
              <div class="feature-item">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                <span>代码体积最小化</span>
              </div>
            </div>
            <el-divider />
            <div class="mode-scenarios">
              <div class="scenario-title">适用场景：</div>
              <div class="scenario-tag-group">
                <el-tag size="small" type="danger" effect="light">生产环境部署</el-tag>
                <el-tag size="small" type="danger" effect="light">减小传输体积</el-tag>
                <el-tag size="small" type="danger" effect="light">提升加载速度</el-tag>
              </div>
            </div>
            <el-button type="danger" size="small" class="mode-btn" @click.stop="doMinify">
              <el-icon><Compress /></el-icon>
              使用压缩
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <EditPen />
          </el-icon>
          <span>JavaScript 代码美化与压缩</span>
          <el-tag size="small" type="success" class="header-tag">美化 · 净化 · 压缩 三合一</el-tag>
        </div>
      </template>

      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-label">缩进方式：</span>
          <el-radio-group v-model="indentType" size="default">
            <el-radio-button value="space">空格</el-radio-button>
            <el-radio-button value="tab">Tab</el-radio-button>
          </el-radio-group>
          <el-select
            v-if="indentType === 'space'"
            v-model="indentSize"
            size="default"
            style="width: 100px; margin-left: 8px;"
          >
            <el-option label="2 空格" :value="2" />
            <el-option label="4 空格" :value="4" />
            <el-option label="8 空格" :value="8" />
          </el-select>
          <span class="toolbar-label" style="margin-left: 16px;">换行符：</span>
          <el-select
            v-model="newlineType"
            size="default"
            style="width: 120px"
          >
            <el-option label="LF (Unix)" value="\n" />
            <el-option label="CRLF (Windows)" value="\r\n" />
          </el-select>
        </div>
        <div class="toolbar-right">
          <el-switch
            v-model="preserveStrings"
            active-text="保留字符串"
            inactive-text="标准处理"
            size="small"
          />
          <el-switch
            v-model="autoProcess"
            active-text="实时处理"
            inactive-text="手动处理"
            size="small"
            style="margin-left: 12px;"
          />
        </div>
      </div>

      <div class="toolbar-actions">
        <el-button size="default" @click="loadExample">
          <el-icon><MagicStick /></el-icon>
          加载示例
        </el-button>
        <el-button size="default" @click="clearCode">
          <el-icon><Delete /></el-icon>
          清空代码
        </el-button>
        <el-button size="default" @click="pasteFromClipboard">
          <el-icon><Document /></el-icon>
          从剪贴板粘贴
        </el-button>
        <el-tooltip content="格式化代码：保留注释、添加正确缩进和换行，让压缩代码变得清晰可读" placement="top">
          <el-button type="primary" size="default" @click="doBeautify" :loading="isProcessing">
            <el-icon><MagicStick /></el-icon>
            美化 (Beautify)
          </el-button>
        </el-tooltip>
        <el-tooltip content="净化代码：删除所有注释（行/块），保留整洁的缩进和格式，使代码干净规范" placement="top">
          <el-button type="warning" size="default" @click="doPurify" :loading="isProcessing">
            <el-icon><Brush /></el-icon>
            净化 (Purify)
          </el-button>
        </el-tooltip>
        <el-tooltip content="压缩代码：删除所有注释、换行和多余空格，最大程度减小代码体积，用于生产部署" placement="top">
          <el-button type="danger" size="default" @click="doMinify" :loading="isProcessing">
            <el-icon><Compress /></el-icon>
            压缩 (Minify)
          </el-button>
        </el-tooltip>
      </div>

      <div class="editor-container">
        <div class="editor-panel">
          <div class="editor-header">
            <span class="editor-title">
              <el-icon color="#909399"><Edit /></el-icon>
              原始代码
              <el-tag v-if="autoProcess" size="small" type="success" effect="plain" style="margin-left: 8px;">
                <el-icon><Lightning /></el-icon>
                实时处理
              </el-tag>
            </span>
            <div class="editor-actions">
              <el-tag size="small" type="info">{{ sourceLineCount }} 行</el-tag>
              <el-tag size="small" :type="sourceCharCount > MAX_CHARS ? 'danger' : sourceCharCount > WARNING_CHARS ? 'warning' : 'success'">
                {{ formatCharCount(sourceCharCount) }} 字符
              </el-tag>
              <el-tag size="small" type="primary" style="margin-left: 4px;">
                {{ formatSize(sourceCharCount) }}
              </el-tag>
            </div>
          </div>
          <el-input
            v-model="sourceCode"
            type="textarea"
            :rows="22"
            placeholder="请在此粘贴或输入 JavaScript 代码..."
            resize="vertical"
            class="code-editor"
            @input="autoProcessIfEnabled"
          />
        </div>

        <div class="editor-panel">
          <div class="editor-header">
            <span class="editor-title">
              <el-icon color="#67c23a"><View /></el-icon>
              处理结果
              <el-tag v-if="currentMode" size="small" type="primary" effect="plain" style="margin-left: 8px;">
                {{ modeText }}
              </el-tag>
            </span>
            <div class="editor-actions">
              <el-tag size="small" type="info">{{ resultLineCount }} 行</el-tag>
              <el-tag size="small" :type="resultCharCount > MAX_CHARS ? 'danger' : resultCharCount > WARNING_CHARS ? 'warning' : 'success'">
                {{ formatCharCount(resultCharCount) }} 字符
              </el-tag>
              <el-tag size="small" type="primary" style="margin-left: 4px;">
                {{ formatSize(resultCharCount) }}
              </el-tag>
              <el-tag v-if="compressionRatio !== null" size="small" :type="compressionRatio > 0 ? 'danger' : 'success'" style="margin-left: 4px;">
                {{ compressionRatio > 0 ? '+' : '' }}{{ compressionRatio.toFixed(1) }}%
              </el-tag>
            </div>
          </div>
          <div class="result-wrapper">
            <el-input
              v-model="resultCode"
              type="textarea"
              :rows="22"
              readonly
              placeholder="点击上方按钮处理代码后，结果将显示在此处..."
              resize="vertical"
              class="code-editor result-editor"
            />
            <div v-if="!resultCode" class="result-placeholder">
              <el-icon :size="48" color="#c0c4cc"><Document /></el-icon>
              <p>点击上方的「美化」「净化」或「压缩」按钮</p>
              <p class="hint">处理结果将显示在这里</p>
            </div>
          </div>
          <div class="result-actions">
            <el-button size="small" @click="copyResult">
              <el-icon><CopyDocument /></el-icon>
              复制代码
            </el-button>
            <el-button size="small" @click="swapResult">
              <el-icon><Switch /></el-icon>
              结果→输入
            </el-button>
            <el-button size="small" @click="downloadResult" :disabled="!resultCode">
              <el-icon><Download /></el-icon>
              下载 .js 文件
            </el-button>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="stats-section">
        <div class="section-title">
          <el-icon :size="16" color="#165DFF"><DataLine /></el-icon>
          <span>处理统计</span>
        </div>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-card shadow="never" class="stat-card">
              <div class="stat-label">原始大小</div>
              <div class="stat-value">{{ formatSize(sourceCharCount) }}</div>
              <div class="stat-sub">{{ sourceLineCount }} 行 / {{ sourceCharCount }} 字符</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="never" class="stat-card">
              <div class="stat-label">结果大小</div>
              <div class="stat-value">{{ formatSize(resultCharCount) }}</div>
              <div class="stat-sub">{{ resultLineCount }} 行 / {{ resultCharCount }} 字符</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="never" class="stat-card" :class="{ 'stat-positive': savedBytes > 0, 'stat-negative': savedBytes < 0 }">
              <div class="stat-label">{{ savedBytes >= 0 ? '节省字节' : '增加字节' }}</div>
              <div class="stat-value">{{ formatSize(Math.abs(savedBytes)) }}</div>
              <div class="stat-sub">{{ savedBytes >= 0 ? '减少了' : '增加了' }} {{ Math.abs(compressionRatio || 0).toFixed(2) }}%</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="never" class="stat-card">
              <div class="stat-label">处理模式</div>
              <div class="stat-value">{{ modeText }}</div>
              <div class="stat-sub">{{ lastProcessTime ? '最近处理：' + lastProcessTime : '尚未处理' }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  InfoFilled,
  Suitcase,
  Operation,
  EditPen,
  Edit,
  View,
  MagicStick,
  Delete,
  Document,
  Brush,
  Compress,
  CopyDocument,
  Switch,
  Download,
  DataLine,
  Lightning,
  QuestionFilled,
  CircleCheck,
  CircleClose,
  WarningFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const MAX_CHARS = 500000
const WARNING_CHARS = 300000

type ProcessMode = 'beautify' | 'purify' | 'minify' | null

const sourceCode = ref('')
const resultCode = ref('')
const indentType = ref<'space' | 'tab'>('space')
const indentSize = ref(2)
const newlineType = ref('\\n')
const preserveStrings = ref(true)
const autoProcess = ref(false)
const isProcessing = ref(false)
const currentMode = ref<ProcessMode>(null)
const lastProcessTime = ref('')

const newlineChar = computed(() => newlineType.value === '\\r\\n' ? '\r\n' : '\n')
const indentChar = computed(() => indentType.value === 'tab' ? '\t' : ' '.repeat(indentSize.value))

const sourceCharCount = computed(() => sourceCode.value.length)
const sourceLineCount = computed(() => sourceCode.value ? sourceCode.value.split('\n').length : 0)
const resultCharCount = computed(() => resultCode.value.length)
const resultLineCount = computed(() => resultCode.value ? resultCode.value.split('\n').length : 0)

const savedBytes = computed(() => sourceCharCount.value - resultCharCount.value)
const compressionRatio = computed(() => {
  if (sourceCharCount.value === 0 || resultCharCount.value === 0) return null
  return ((resultCharCount.value - sourceCharCount.value) / sourceCharCount.value) * 100
})

const modeText = computed(() => {
  const map: Record<string, string> = {
    beautify: '美化 (Beautify)',
    purify: '净化 (Purify)',
    minify: '压缩 (Minify)'
  }
  return currentMode.value ? map[currentMode.value] : '等待处理'
})

const formatCharCount = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toString()
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

const tokenize = (code: string) => {
  const tokens: Array<{ type: string; value: string }> = []
  let i = 0
  const len = code.length

  while (i < len) {
    const ch = code[i]

    if (ch === '/' && (code[i + 1] === '/' || code[i + 1] === '*')) {
      if (code[i + 1] === '/') {
        let comment = ''
        while (i < len && code[i] !== '\n') {
          comment += code[i]
          i++
        }
        tokens.push({ type: 'line-comment', value: comment })
      } else {
        let comment = '/*'
        i += 2
        while (i < len && !(code[i] === '*' && code[i + 1] === '/')) {
          comment += code[i]
          i++
        }
        comment += '*/'
        i += 2
        tokens.push({ type: 'block-comment', value: comment })
      }
      continue
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      let str = ch
      i++
      while (i < len) {
        if (code[i] === '\\' && i + 1 < len) {
          str += code[i] + code[i + 1]
          i += 2
          continue
        }
        str += code[i]
        if (code[i] === quote) {
          i++
          break
        }
        i++
      }
      tokens.push({ type: 'string', value: str })
      continue
    }

    if (ch === '/' && code[i + 1] !== '*' && code[i + 1] !== '/') {
      let isRegex = true
      for (let j = tokens.length - 1; j >= 0; j--) {
        const t = tokens[j]
        if (t.type === 'whitespace' || t.type === 'line-comment' || t.type === 'block-comment') continue
        if (t.type === 'identifier' || t.type === 'number' || t.type === 'punctuator') {
          if (t.value === ')' || t.value === ']' || t.value === '}') {
            isRegex = false
          }
          break
        }
        break
      }
      if (isRegex) {
        let regex = '/'
        i++
        let inCharClass = false
        while (i < len) {
          if (code[i] === '\\' && i + 1 < len) {
            regex += code[i] + code[i + 1]
            i += 2
            continue
          }
          if (code[i] === '[') inCharClass = true
          if (code[i] === ']') inCharClass = false
          regex += code[i]
          if (code[i] === '/' && !inCharClass) {
            i++
            break
          }
          i++
        }
        while (i < len && /[gimsuy]/.test(code[i])) {
          regex += code[i]
          i++
        }
        tokens.push({ type: 'regex', value: regex })
        continue
      }
    }

    if (/\d/.test(ch) || (ch === '.' && i + 1 < len && /\d/.test(code[i + 1]))) {
      let num = ''
      while (i < len && /[0-9.eE+\-xXoObB_a-fA-F]/.test(code[i])) {
        num += code[i]
        i++
      }
      tokens.push({ type: 'number', value: num })
      continue
    }

    if (/[a-zA-Z_$]/.test(ch)) {
      let ident = ''
      while (i < len && /[a-zA-Z0-9_$]/.test(code[i])) {
        ident += code[i]
        i++
      }
      tokens.push({ type: 'identifier', value: ident })
      continue
    }

    if (/\s/.test(ch)) {
      let ws = ''
      while (i < len && /\s/.test(code[i])) {
        ws += code[i]
        i++
      }
      tokens.push({ type: 'whitespace', value: ws })
      continue
    }

    const threeChar = code.substring(i, i + 3)
    const twoChar = code.substring(i, i + 2)
    const threeOps = ['===', '!==', '>>>=', '<<<=', '**=']
    const twoOps = ['==', '!=', '<=', '>=', '&&', '||', '??', '=>', '+=', '-=', '*=', '/=', '%=', '^=', '&=', '|=', '<<', '>>', '>>>', '**', '++', '--', '?.']

    if (threeOps.includes(threeChar)) {
      tokens.push({ type: 'punctuator', value: threeChar })
      i += 3
    } else if (twoOps.includes(twoChar)) {
      tokens.push({ type: 'punctuator', value: twoChar })
      i += 2
    } else {
      tokens.push({ type: 'punctuator', value: ch })
      i++
    }
  }

  return tokens
}

const doBeautify = () => {
  if (!sourceCode.value.trim()) {
    ElMessage.warning('请先输入或粘贴代码')
    return
  }

  isProcessing.value = true
  currentMode.value = 'beautify'

  try {
    const tokens = tokenize(sourceCode.value)
    const NL = newlineChar.value
    const INDENT = indentChar.value

    let output = ''
    let depth = 0
    let inForParen = false
    let forParenDepth = 0
    let prevToken: { type: string; value: string } | null = null

    const needsNewlineBefore = (token: { type: string; value: string }, prev: { type: string; value: string } | null): boolean => {
      if (!prev) return false
      if (prev.type === 'line-comment' || prev.type === 'block-comment') return true
      if (token.value === '}') return true
      if (prev.value === ';') {
        if (inForParen) return false
        return true
      }
      if (prev.value === '{' && token.type !== 'whitespace') return true
      if (prev.value === '}') {
        if (token.value === ';' || token.value === ',' || token.value === '.') return false
        return true
      }
      return false
    }

    const needsSpaceBetween = (prev: { type: string; value: string } | null, curr: { type: string; value: string }): boolean => {
      if (!prev) return false
      if (prev.type === 'whitespace' || curr.type === 'whitespace') return false
      if (prev.type === 'line-comment' || prev.type === 'block-comment') return true
      if (curr.type === 'line-comment' || curr.type === 'block-comment') return true
      if (prev.type === 'string' && curr.type === 'string') return true
      if (prev.type === 'identifier' && curr.type === 'identifier') return true
      if (prev.type === 'identifier' && curr.type === 'number') return true
      if (prev.type === 'number' && curr.type === 'identifier') return true
      if (prev.type === 'identifier' && curr.value === '(') {
        const keywords = ['if', 'for', 'while', 'switch', 'catch', 'typeof', 'instanceof', 'new', 'return', 'void', 'delete', 'throw', 'yield', 'await']
        return keywords.includes(prev.value)
      }
      if (prev.value === ')' && curr.type === 'identifier') return true
      if (prev.value === ')' && curr.value === '{') return true
      if (prev.value === ';' && curr.type !== 'whitespace') return true
      if (prev.value === ',' || curr.value === ',') return true
      if (prev.value === ':' && !inForParen) return true
      if (prev.type === 'punctuator' && curr.type === 'punctuator') {
        const noSpace = ['++', '--', '.', '(', ')', '[', ']', '{', '}', ';', ',', ':', '?.']
        if (noSpace.includes(prev.value) || noSpace.includes(curr.value)) return false
        return true
      }
      if (prev.type === 'identifier' && curr.type === 'punctuator' && curr.value === '{' && prev.value !== 'return') return true
      if (curr.type === 'identifier' && prev.type === 'punctuator') {
        const noSpaceBefore = ['(', ')', '[', ']', '.', '++', '--', '?.']
        if (noSpaceBefore.includes(prev.value)) return false
        return true
      }
      if (prev.type === 'number' && curr.type === 'punctuator') {
        if (curr.value === '.' || curr.value === ';' || curr.value === ',' || curr.value === ')' || curr.value === ']') return false
        return true
      }
      return false
    }

    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx]

      if (token.type === 'whitespace') continue

      if (token.value === '(' && prevToken && prevToken.value === 'for') {
        inForParen = true
        forParenDepth = 1
      } else if (inForParen && token.value === '(') {
        forParenDepth++
      } else if (inForParen && token.value === ')') {
        forParenDepth--
        if (forParenDepth === 0) inForParen = false
      }

      if (needsNewlineBefore(token, prevToken)) {
        output = output.trimEnd()
        output += NL
        for (let d = 0; d < depth; d++) output += INDENT
      }

      if (token.value === '}') {
        depth = Math.max(0, depth - 1)
        if (output.endsWith(INDENT)) {
          output = output.slice(0, -INDENT.length)
        }
        if (prevToken && prevToken.value === ';') {
          output = output.trimEnd()
          output += NL
          for (let d = 0; d < depth; d++) output += INDENT
        }
      }

      if (needsSpaceBetween(prevToken, token) && output.length > 0 && !output.endsWith(' ') && !output.endsWith(NL) && !output.endsWith(INDENT)) {
        output += ' '
      }

      output += token.value

      if (token.value === '{' || token.value === '[' || (token.value === '(' && !inForParen)) {
        depth++
      }

      if (token.type === 'line-comment') {
        output += NL
        for (let d = 0; d < depth; d++) output += INDENT
      }
      if (token.type === 'block-comment') {
        if (idx + 1 < tokens.length) {
          const next = tokens.slice(idx + 1).find(t => t.type !== 'whitespace')
          if (next && next.value !== '}') {
            output += NL
            for (let d = 0; d < depth; d++) output += INDENT
          }
        }
      }

      prevToken = token
    }

    output = output.replace(/[ \t]+$/gm, '')
    output = output.replace(/\n{3,}/g, NL + NL)
    output = output.trim() + NL

    resultCode.value = output
    lastProcessTime.value = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    ElMessage.success('代码美化完成')
  } catch (error) {
    console.error('Beautify error:', error)
    ElMessage.error('代码美化失败')
  } finally {
    isProcessing.value = false
  }
}

const doPurify = () => {
  if (!sourceCode.value.trim()) {
    ElMessage.warning('请先输入或粘贴代码')
    return
  }

  isProcessing.value = true
  currentMode.value = 'purify'

  try {
    const tokens = tokenize(sourceCode.value)
    const NL = newlineChar.value
    const INDENT = indentChar.value

    let output = ''
    let depth = 0
    let prevToken: { type: string; value: string } | null = null
    let inForParen = false
    let forParenDepth = 0

    const needsNewlineBefore = (token: { type: string; value: string }, prev: { type: string; value: string } | null): boolean => {
      if (!prev) return false
      if (token.value === '}') return true
      if (prev.value === ';') {
        if (inForParen) return false
        return true
      }
      if (prev.value === '{') return true
      if (prev.value === '}') {
        if (token.value === ';' || token.value === ',' || token.value === '.') return false
        return true
      }
      return false
    }

    const needsSpaceBetween = (prev: { type: string; value: string } | null, curr: { type: string; value: string }): boolean => {
      if (!prev) return false
      if (prev.type === 'string' && curr.type === 'string') return true
      if (prev.type === 'identifier' && curr.type === 'identifier') return true
      if (prev.type === 'identifier' && curr.type === 'number') return true
      if (prev.type === 'number' && curr.type === 'identifier') return true
      if (prev.type === 'identifier' && curr.value === '(') {
        const keywords = ['if', 'for', 'while', 'switch', 'catch', 'typeof', 'instanceof', 'new', 'return', 'void', 'delete', 'throw', 'yield', 'await']
        return keywords.includes(prev.value)
      }
      if (prev.value === ')' && curr.type === 'identifier') return true
      if (prev.value === ')' && curr.value === '{') return true
      if (prev.value === ';') return true
      if (prev.value === ',' || curr.value === ',') return true
      if (prev.value === ':' && !inForParen) return true
      if (prev.type === 'punctuator' && curr.type === 'punctuator') {
        const noSpace = ['++', '--', '.', '(', ')', '[', ']', '{', '}', ';', ',', ':', '?.']
        if (noSpace.includes(prev.value) || noSpace.includes(curr.value)) return false
        return true
      }
      if (prev.type === 'identifier' && curr.type === 'punctuator' && curr.value === '{') return true
      if (curr.type === 'identifier' && prev.type === 'punctuator') {
        const noSpaceBefore = ['(', ')', '[', ']', '.', '++', '--', '?.']
        if (noSpaceBefore.includes(prev.value)) return false
        return true
      }
      if (prev.type === 'number' && curr.type === 'punctuator') {
        if (curr.value === '.' || curr.value === ';' || curr.value === ',' || curr.value === ')' || curr.value === ']') return false
        return true
      }
      return false
    }

    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx]

      if (token.type === 'whitespace') continue
      if (token.type === 'line-comment' || token.type === 'block-comment') continue

      if (token.value === '(' && prevToken && prevToken.value === 'for') {
        inForParen = true
        forParenDepth = 1
      } else if (inForParen && token.value === '(') {
        forParenDepth++
      } else if (inForParen && token.value === ')') {
        forParenDepth--
        if (forParenDepth === 0) inForParen = false
      }

      if (needsNewlineBefore(token, prevToken)) {
        output = output.trimEnd()
        output += NL
        for (let d = 0; d < depth; d++) output += INDENT
      }

      if (token.value === '}') {
        depth = Math.max(0, depth - 1)
        if (output.endsWith(INDENT)) {
          output = output.slice(0, -INDENT.length)
        }
        if (prevToken && prevToken.value === ';') {
          output = output.trimEnd()
          output += NL
          for (let d = 0; d < depth; d++) output += INDENT
        }
      }

      if (needsSpaceBetween(prevToken, token) && output.length > 0 && !output.endsWith(' ') && !output.endsWith(NL) && !output.endsWith(INDENT)) {
        output += ' '
      }

      output += token.value

      if (token.value === '{' || token.value === '[' || (token.value === '(' && !inForParen)) {
        depth++
      }

      prevToken = token
    }

    output = output.replace(/[ \t]+$/gm, '')
    output = output.replace(/\n{3,}/g, NL + NL)
    output = output.trim() + NL

    resultCode.value = output
    lastProcessTime.value = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    ElMessage.success('代码净化完成，已移除所有注释和多余空白')
  } catch (error) {
    console.error('Purify error:', error)
    ElMessage.error('代码净化失败')
  } finally {
    isProcessing.value = false
  }
}

const doMinify = () => {
  if (!sourceCode.value.trim()) {
    ElMessage.warning('请先输入或粘贴代码')
    return
  }

  isProcessing.value = true
  currentMode.value = 'minify'

  try {
    const tokens = tokenize(sourceCode.value)

    let output = ''
    let prevToken: { type: string; value: string } | null = null

    const needsSpaceBetween = (prev: { type: string; value: string } | null, curr: { type: string; value: string }): boolean => {
      if (!prev) return false

      if ((prev.type === 'identifier' || prev.type === 'number') && (curr.type === 'identifier' || curr.type === 'number')) {
        return true
      }
      if (prev.type === 'identifier' && curr.type === 'string') return false
      if (prev.type === 'string' && curr.type === 'identifier') return false

      if (prev.type === 'identifier') {
        const keywordsStartRegex = ['return', 'throw', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'yield', 'await', 'case']
        if (keywordsStartRegex.includes(prev.value) && curr.value === '/') return true
      }

      if (prev.type === 'punctuator' && curr.type === 'punctuator') {
        if (prev.value === '+' && curr.value === '+') return false
        if (prev.value === '-' && curr.value === '-') return false
        if (prev.value === '>' && curr.value === '>') return false
        if (prev.value === '<' && curr.value === '<') return false
        if (prev.value === '!' && curr.value === '=') return false
        if (prev.value === '=' && curr.value === '=') return false
        if (prev.value === '&' && curr.value === '&') return false
        if (prev.value === '|' && curr.value === '|') return false
        if (prev.value === '?' && curr.value === '?') return false
        if (prev.value === '?' && curr.value === '.') return false
        if (prev.value === '*' && curr.value === '*') return false
        if (prev.value === '/' && curr.value === '=') return false
        if (prev.value === '*' && curr.value === '=') return false
        if (prev.value === '-' && curr.value === '=') return false
        if (prev.value === '+' && curr.value === '=') return false
        if (prev.value === '%' && curr.value === '=') return false
        if (prev.value === '^' && curr.value === '=') return false
        if (prev.value === '&' && curr.value === '=') return false
        if (prev.value === '|' && curr.value === '=') return false
        return false
      }

      if (curr.value === '-' || curr.value === '+') {
        if (prev && prev.type === 'punctuator') {
          const needSpace = [')', ']', '}']
          if (needSpace.includes(prev.value)) return true
        }
        if (prev && (prev.type === 'identifier' || prev.type === 'number' || prev.type === 'string' || prev.type === 'regex')) {
          return true
        }
      }

      return false
    }

    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx]

      if (token.type === 'whitespace') continue
      if (token.type === 'line-comment' || token.type === 'block-comment') continue

      if (needsSpaceBetween(prevToken, token)) {
        output += ' '
      }

      output += token.value
      prevToken = token
    }

    output = output.trim()

    resultCode.value = output
    lastProcessTime.value = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    ElMessage.success('代码压缩完成')
  } catch (error) {
    console.error('Minify error:', error)
    ElMessage.error('代码压缩失败')
  } finally {
    isProcessing.value = false
  }
}

let debounceTimer: number | null = null
const DEBOUNCE_DELAY = 400

const autoProcessIfEnabled = () => {
  if (!autoProcess.value) return
  if (!sourceCode.value.trim()) {
    resultCode.value = ''
    return
  }

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    if (currentMode.value === 'beautify') doBeautify()
    else if (currentMode.value === 'purify') doPurify()
    else if (currentMode.value === 'minify') doMinify()
    else doBeautify()
  }, DEBOUNCE_DELAY)
}

const loadExample = () => {
  sourceCode.value = `// JavaScript 示例：用户管理系统
class UserManager {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  /* 添加用户 */
  addUser(name, email, role = 'user') {
    if (!name || !email) {
      throw new Error('姓名和邮箱不能为空');
    }
    const user = {
      id: this.nextId++,
      name,
      email,
      role,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  // 根据ID查询用户
  getUser(id) {
    return this.users.get(id) || null;
  }

  /**
   * 获取指定角色的所有用户
   * @param {string} role - 用户角色
   * @returns {Array} 用户列表
   */
  getUsersByRole(role) {
    return Array.from(this.users.values()).filter(u => u.role === role);
  }

  async fetchRemoteUsers(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.map(item => this.addUser(item.name, item.email, item.role));
    } catch (error) {
      console.error('获取远程用户失败:', error);
      return [];
    }
  }
}

const manager = new UserManager();
manager.addUser('张三', 'zhangsan@example.com', 'admin');
manager.addUser('李四', 'lisi@example.com');

const admins = manager.getUsersByRole('admin');
console.log('管理员数量:', admins.length);`

  setTimeout(() => doBeautify(), 100)
  ElMessage.success('已加载示例代码')
}

const clearCode = () => {
  sourceCode.value = ''
  resultCode.value = ''
  currentMode.value = null
  ElMessage.info('已清空代码')
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    sourceCode.value = text
    ElMessage.success('已从剪贴板粘贴')
  } catch (error) {
    ElMessage.error('无法读取剪贴板，请手动粘贴')
  }
}

const copyResult = async () => {
  if (!resultCode.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }
  try {
    await navigator.clipboard.writeText(resultCode.value)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const swapResult = () => {
  if (!resultCode.value) {
    ElMessage.warning('没有可交换的结果')
    return
  }
  sourceCode.value = resultCode.value
  resultCode.value = ''
  currentMode.value = null
  ElMessage.success('已将结果代码移至输入区')
}

const downloadResult = () => {
  if (!resultCode.value) {
    ElMessage.warning('没有可下载的内容')
    return
  }
  const blob = new Blob([resultCode.value], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const modeSuffix = currentMode.value ? `_${currentMode.value}` : ''
  a.download = `code${modeSuffix}_${Date.now()}.js`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  ElMessage.success('文件下载已开始')
}

watch([indentType, indentSize, newlineType], () => {
  if (resultCode.value && currentMode.value) {
    if (currentMode.value === 'beautify') doBeautify()
    else if (currentMode.value === 'purify') doPurify()
  }
})
</script>

<style scoped>
.js-code-beautifier {
  max-width: 1400px;
  margin: 0 auto;
}

.guide-card,
.scene-card,
.mode-card {
  margin-bottom: 16px;
}

.scene-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.mode-item {
  border: 2px solid #ebeef5;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  position: relative;
}

.mode-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.mode-beautify {
  border-color: #ecf5ff;
}

.mode-beautify:hover {
  border-color: #409eff;
  background: linear-gradient(135deg, #ecf5ff 0%, #fff 100%);
}

.mode-purify {
  border-color: #fdf6ec;
}

.mode-purify:hover {
  border-color: #e6a23c;
  background: linear-gradient(135deg, #fdf6ec 0%, #fff 100%);
}

.mode-minify {
  border-color: #fef0f0;
}

.mode-minify:hover {
  border-color: #f56c6c;
  background: linear-gradient(135deg, #fef0f0 0%, #fff 100%);
}

.mode-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.mode-name {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
}

.mode-brief {
  text-align: center;
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.mode-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 4px 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
}

.feature-item span {
  flex: 1;
}

.mode-scenarios {
  margin-top: 4px;
}

.scenario-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
}

.scenario-tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mode-btn {
  margin-top: 16px;
  align-self: center;
  width: 120px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.header-tag {
  margin-left: auto;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.toolbar-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.editor-panel {
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
  gap: 8px;
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #303133;
  font-size: 14px;
  flex-wrap: wrap;
}

.editor-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.code-editor {
  border: none !important;
}

.code-editor :deep(.el-textarea__inner) {
  border: none;
  border-radius: 0;
  font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  padding: 14px;
  resize: vertical;
}

.result-wrapper {
  position: relative;
  flex: 1;
}

.result-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  pointer-events: none;
  gap: 4px;
}

.result-placeholder p {
  margin: 0;
  font-size: 14px;
}

.result-placeholder .hint {
  font-size: 12px;
  color: #dcdfe6;
}

.result-editor :deep(.el-textarea__inner) {
  background: #fafcff;
}

.result-actions {
  display: flex;
  gap: 8px;
  padding: 10px 14px;
  background: #fafafa;
  border-top: 1px solid #ebeef5;
}

.stats-section {
  margin-top: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
}

.stat-sub {
  font-size: 12px;
  color: #c0c4cc;
}

.stat-positive .stat-value {
  color: #67c23a;
}

.stat-negative .stat-value {
  color: #f56c6c;
}

@media (max-width: 900px) {
  .editor-container {
    grid-template-columns: 1fr;
  }

  .mode-card :deep(.el-col) {
    margin-bottom: 16px;
  }
}
</style>
