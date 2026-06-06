<template>
  <div class="text-expression-calculator">
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
        <el-step title="输入文本" description="在左侧输入自然语言和数学表达式，如 60 * 60" />
        <el-step title="自动识别" description="系统自动识别并计算其中的数学表达式" />
        <el-step title="查看结果" description="右侧同步展示每行计算结果，滚动和高亮联动" />
      </el-steps>
    </el-card>

    <el-card class="example-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon :size="16" color="#165DFF">
            <MagicStick />
          </el-icon>
          <span>快捷示例</span>
          <span class="header-subtitle">点击载入示例文本</span>
        </div>
      </template>
      <div class="example-list">
        <div
          v-for="(example, index) in examples"
          :key="index"
          class="example-item"
          @click="loadExample(example)"
        >
          <div class="example-icon" :style="{ background: example.color + '15', color: example.color }">
            <component :is="getExampleIcon(example.icon)" />
          </div>
          <div class="example-info">
            <div class="example-name">{{ example.name }}</div>
            <div class="example-desc">{{ example.desc }}</div>
          </div>
          <el-icon class="example-arrow"><ArrowRight /></el-icon>
        </div>
      </div>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Calculator />
          </el-icon>
          <span>文本表达式计算器</span>
          <el-tag size="small" type="success">边记录边计算</el-tag>
          <div class="header-actions">
            <el-button size="small" @click="clearText">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
            <el-button size="small" @click="pasteFromClipboard">
              <el-icon><Document /></el-icon>
              粘贴
            </el-button>
            <el-button size="small" type="primary" @click="copyResults" :disabled="!hasExpressions">
              <el-icon><CopyDocument /></el-icon>
              复制结果
            </el-button>
          </div>
        </div>
      </template>

      <div class="calculator-container">
        <div class="input-panel">
          <div class="panel-header">
            <el-icon color="#165DFF"><Edit /></el-icon>
            <span class="panel-title">输入文本</span>
            <el-tag size="small" type="info">自然语言 + 表达式混合</el-tag>
          </div>

          <div class="editor-wrapper">
            <div class="line-numbers" ref="leftLineNumbersRef">
              <div
                v-for="(line, index) in parsedLines"
                :key="index"
                class="line-num"
                :class="{ 
                  'hovered': hoveredLineIndex === index,
                  'has-expr': line.hasExpression && !line.error,
                  'has-error': line.error
                }"
                @mouseenter="setHoveredLine(index)"
                @mouseleave="clearHoveredLine"
              >
                {{ index + 1 }}
              </div>
            </div>
            <div class="textarea-container" ref="textareaContainerRef">
              <textarea
                ref="textareaRef"
                v-model="inputText"
                class="editor-textarea"
                :rows="Math.max(20, parsedLines.length)"
                placeholder="在此输入文本，支持数学表达式自动计算&#10;&#10;示例：&#10;项目预算：5000 * 12 = ?&#10;日工资：8000 / 22 = ?&#10;税后收入：10000 - 10000 * 0.1 = ?&#10;总价：(100 + 50) * 3 = ?&#10;百分比：500 * 20% = ?"
                @scroll="syncScrollFromLeft"
                @mouseenter="onLeftAreaEnter"
                @mouseleave="onLeftAreaLeave"
              />
            </div>
          </div>

          <div class="input-footer">
            <el-tag size="small" type="info">共 {{ lineCount }} 行</el-tag>
            <el-tag size="small" type="success">识别到 {{ expressionCount }} 个表达式</el-tag>
            <el-tag size="small" type="warning">滚动和高亮两侧联动</el-tag>
          </div>
        </div>

        <div class="divider-line">
          <div class="divider-content">
            <el-icon :size="16"><Right /></el-icon>
          </div>
          <div class="divider-hint">左右联动</div>
        </div>

        <div class="result-panel">
          <div class="panel-header">
            <el-icon color="#67c23a"><DataLine /></el-icon>
            <span class="panel-title">计算结果</span>
            <el-tag v-if="hasExpressions" size="small" type="success">实时计算</el-tag>
            <el-tag v-else size="small" type="info">等待输入</el-tag>
            <div class="result-filter">
              <el-radio-group v-model="filterMode" size="small" @change="onFilterChange">
                <el-radio-button value="all">全部行</el-radio-button>
                <el-radio-button value="expr">仅结果行</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <div 
            class="result-list" 
            ref="resultListRef"
            @scroll="syncScrollFromRight"
            @mouseenter="onRightAreaEnter"
            @mouseleave="onRightAreaLeave"
            v-if="displayLines.length > 0"
          >
            <div
              v-for="(item, index) in displayLines"
              :key="item.originalIndex"
              class="result-line"
              :class="{ 
                'has-error': item.line.error, 
                'has-expression': item.line.hasExpression,
                'no-expression': !item.line.hasExpression,
                'hovered': hoveredLineIndex === item.originalIndex,
                'is-empty': item.line.original === ''
              }"
              @mouseenter="setHoveredLine(item.originalIndex)"
              @mouseleave="clearHoveredLine"
            >
              <div class="line-number" :class="{ 
                'hovered': hoveredLineIndex === item.originalIndex,
                'has-expr': item.line.hasExpression && !item.line.error,
                'has-error': item.line.error,
                'no-expr': !item.line.hasExpression
              }">
                {{ item.originalIndex + 1 }}
              </div>
              <div class="line-content">
                <div class="line-original" :class="{ 'text-muted': !item.line.hasExpression }">
                  <template v-for="(segment, segIndex) in item.line.segments" :key="segIndex">
                    <span v-if="segment.type === 'text'" class="seg-text">{{ segment.value || ' ' }}</span>
                    <span v-else class="seg-expression" :class="{ error: segment.error }">
                      {{ segment.value }}
                    </span>
                  </template>
                  <span v-if="item.line.original === ''" class="empty-line-placeholder">（空行）</span>
                  <span v-if="!item.line.hasExpression && item.line.original !== ''" class="no-expr-tag">
                    <el-icon :size="10"><InfoFilled /></el-icon>
                    纯文本
                  </span>
                </div>
                <div v-if="item.line.hasExpression" class="line-result">
                  <template v-if="!item.line.error">
                    <span class="result-label">=</span>
                    <span class="result-value">{{ item.line.result }}</span>
                    <span v-if="item.line.resultReadable" class="result-readable">（{{ item.line.resultReadable }}）</span>
                    <el-icon class="copy-inline-btn" title="复制该结果" @click.stop="copySingleResult(item.line)">
                      <CopyDocument />
                    </el-icon>
                  </template>
                  <template v-else>
                    <span class="error-label">⚠️</span>
                    <span class="error-message">{{ item.line.error }}</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-result">
            <el-icon :size="64" color="#c0c4cc"><Document /></el-icon>
            <p>{{ filterMode === 'expr' ? '当前内容中未检测到可计算的表达式' : '请在左侧输入包含数学表达式的文本' }}</p>
            <p class="empty-hint">支持 +  -  *  /  %  () 等运算</p>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="syntax-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon :size="16" color="#165DFF">
            <Collection />
          </el-icon>
          <span>支持的语法</span>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="syntax-item">
            <div class="syntax-title">基础运算</div>
            <div class="syntax-list">
              <el-tag size="small" type="info">加法: a + b</el-tag>
              <el-tag size="small" type="info">减法: a - b</el-tag>
              <el-tag size="small" type="info">乘法: a * b</el-tag>
              <el-tag size="small" type="info">除法: a / b</el-tag>
              <el-tag size="small" type="info">取模: a % b</el-tag>
              <el-tag size="small" type="info">乘方: a ^ b</el-tag>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="syntax-item">
            <div class="syntax-title">高级用法</div>
            <div class="syntax-list">
              <el-tag size="small" type="success">括号: (a + b) * c</el-tag>
              <el-tag size="small" type="success">百分比: a * 20%</el-tag>
              <el-tag size="small" type="success">小数: 3.14 * 2</el-tag>
              <el-tag size="small" type="success">负数: -50 + 100</el-tag>
              <el-tag size="small" type="success">逗号分隔: 1,000 + 500</el-tag>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="syntax-item">
            <div class="syntax-title">常用数学函数</div>
            <div class="syntax-list">
              <el-tag size="small" type="warning">abs(x) 绝对值</el-tag>
              <el-tag size="small" type="warning">round(x) 四舍五入</el-tag>
              <el-tag size="small" type="warning">ceil(x) 向上取整</el-tag>
              <el-tag size="small" type="warning">floor(x) 向下取整</el-tag>
              <el-tag size="small" type="warning">sqrt(x) 平方根</el-tag>
              <el-tag size="small" type="warning">max/min 最大/小值</el-tag>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import {
  Calculator,
  InfoFilled,
  Delete,
  Document,
  CopyDocument,
  DataLine,
  Edit,
  Right,
  ArrowRight,
  MagicStick,
  Collection,
  Money,
  Notebook,
  ShoppingCart,
  Study
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Segment {
  type: 'text' | 'expression'
  value: string
  result?: number
  error?: string
}

interface ParsedLine {
  original: string
  segments: Segment[]
  hasExpression: boolean
  expression?: string
  result?: string
  resultReadable?: string
  error?: string
}

interface Example {
  name: string
  desc: string
  icon: string
  color: string
  text: string
}

const examples: Example[] = [
  {
    name: '财务分析',
    desc: '预算、成本、利润计算',
    icon: 'Money',
    color: '#67c23a',
    text: `月度预算分析
基本工资：15000
社保扣除：15000 * 0.105 = ?
公积金：15000 * 0.12 = ?
个税：(15000 - 5000 - 15000*0.225) * 0.03 = ?
实际到手：15000 - 15000*0.105 - 15000*0.12 - 232.5 = ?

年度收入
月工资：15000 * 12 = ?
年终奖：15000 * 3 = ?
合计：180000 + 45000 = ?`
  },
  {
    name: '学习笔记',
    desc: '数学计算、单位换算',
    icon: 'Study',
    color: '#409eff',
    text: `数学计算练习
圆的周长（r=5）：2 * 3.14159 * 5 = ?
圆的面积（r=5）：3.14159 * 5 ^ 2 = ?
直角三角形斜边（3,4）：sqrt(3^2 + 4^2) = ?

单位换算
1小时= 60 * 60 = ? 秒
1天= 24 * 60 * 60 = ? 秒
1公里= 1000 * 100 = ? 厘米

统计计算
平均值：(85 + 90 + 78 + 92 + 88) / 5 = ?
总分：85 + 90 + 78 + 92 + 88 = ?`
  },
  {
    name: '购物清单',
    desc: '折扣、优惠、总价',
    icon: 'ShoppingCart',
    color: '#e6a23c',
    text: `618 购物清单
商品A 原价 299，打8折：299 * 0.8 = ?
商品B 原价 599，满500减100：599 - 100 = ?
商品C 原价 129，两件75折：129 * 2 * 0.75 = ?

优惠计算
原价合计：299 + 599 + 129*2 = ?
实际支付：239.2 + 499 + 193.5 = ?
节省金额：1156 - 931.7 = ?

运费计算
商品重量：1.5 + 2.3 + 0.8 = ? kg
运费（首重8元/kg，续重3元/kg）：8 + (4.6-1) * 3 = ?`
  },
  {
    name: '日常记录',
    desc: '时间、距离、速度',
    icon: 'Notebook',
    color: '#722ed1',
    text: `健身打卡
跑步距离：5.5 公里
配速 6分30秒/公里，总耗时：5.5 * 6.5 = ? 分钟
消耗卡路里（约60卡/公里）：5.5 * 60 = ? 千卡

时间管理
每天学习 2.5 小时
一周学习时长：2.5 * 7 = ? 小时
一个月（30天）：2.5 * 30 = ? 小时
一年（365天）：2.5 * 365 = ? 小时

旅行规划
距离：280 公里
平均时速 80km/h，需要：280 / 80 = ? 小时
油费（每百公里7.5升，8元/升）：280 / 100 * 7.5 * 8 = ? 元
过路费约 0.5元/公里：280 * 0.5 = ? 元`
  }
]

const iconMap: Record<string, any> = {
  Money,
  Notebook,
  ShoppingCart,
  Study
}

const getExampleIcon = (iconName: string) => {
  return iconMap[iconName] || Notebook
}

const inputText = ref('')
const hoveredLineIndex = ref(-1)
const filterMode = ref<'all' | 'expr'>('all')

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const textareaContainerRef = ref<HTMLDivElement | null>(null)
const leftLineNumbersRef = ref<HTMLDivElement | null>(null)
const resultListRef = ref<HTMLDivElement | null>(null)

let isSyncingScroll = false
let leftMouseIn = false
let rightMouseIn = false

const setHoveredLine = (index: number) => {
  hoveredLineIndex.value = index
}

const clearHoveredLine = () => {
  if (!leftMouseIn && !rightMouseIn) {
    hoveredLineIndex.value = -1
  }
}

const onLeftAreaEnter = () => { leftMouseIn = true }
const onLeftAreaLeave = () => { leftMouseIn = false; hoveredLineIndex.value = -1 }
const onRightAreaEnter = () => { rightMouseIn = true }
const onRightAreaLeave = () => { rightMouseIn = false; hoveredLineIndex.value = -1 }

const syncScrollFromLeft = () => {
  if (isSyncingScroll) return
  isSyncingScroll = true
  requestAnimationFrame(() => {
    if (textareaRef.value && resultListRef.value && leftLineNumbersRef.value) {
      const scrollTop = textareaRef.value.scrollTop
      resultListRef.value.scrollTop = scrollTop
      leftLineNumbersRef.value.scrollTop = scrollTop
    }
    isSyncingScroll = false
  })
}

const syncScrollFromRight = () => {
  if (isSyncingScroll) return
  isSyncingScroll = true
  requestAnimationFrame(() => {
    if (textareaRef.value && resultListRef.value && leftLineNumbersRef.value) {
      const scrollTop = resultListRef.value.scrollTop
      textareaRef.value.scrollTop = scrollTop
      leftLineNumbersRef.value.scrollTop = scrollTop
    }
    isSyncingScroll = false
  })
}

watch(parsedLines, async () => {
  await nextTick()
  syncScrollFromLeft()
}, { flush: 'post' })

const loadExample = (example: Example) => {
  inputText.value = example.text
  ElMessage.success(`已载入「${example.name}」示例`)
}

const clearText = () => {
  inputText.value = ''
  ElMessage.success('已清空内容')
}

const pasteFromClipboard = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText()
    if (clipboardText) {
      inputText.value += clipboardText
      ElMessage.success('已从剪贴板粘贴')
    } else {
      ElMessage.warning('剪贴板为空')
    }
  } catch (e) {
    ElMessage.error('无法访问剪贴板，请手动粘贴')
  }
}

const copySingleResult = (line: ParsedLine) => {
  if (!line.result) return
  navigator.clipboard.writeText(line.result).then(() => {
    ElMessage.success(`结果「${line.result}」已复制`)
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const lineCount = computed(() => {
  if (!inputText.value) return 0
  return inputText.value.split('\n').length
})

const tokenize = (expr: string): string[] => {
  const tokens: string[] = []
  let i = 0
  while (i < expr.length) {
    const ch = expr[i]
    if (/\s/.test(ch)) {
      i++
      continue
    }
    if (/[0-9.]/.test(ch)) {
      let num = ''
      while (i < expr.length && /[0-9.,]/.test(expr[i])) {
        if (expr[i] !== ',') num += expr[i]
        i++
      }
      tokens.push(num)
      continue
    }
    if (/[a-zA-Z]/.test(ch)) {
      let name = ''
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
        name += expr[i]
        i++
      }
      tokens.push(name)
      continue
    }
    if ('+-*/%^(),'.includes(ch)) {
      tokens.push(ch)
      i++
      continue
    }
    if (ch === '=') {
      i++
      continue
    }
    if (ch === '?') {
      i++
      continue
    }
    tokens.push(ch)
    i++
  }
  return tokens
}

class Parser {
  private tokens: string[]
  private pos: number

  constructor(tokens: string[]) {
    this.tokens = tokens
    this.pos = 0
  }

  private peek(): string {
    return this.tokens[this.pos]
  }

  private consume(): string {
    return this.tokens[this.pos++]
  }

  private parseExpression(): number {
    let left = this.parseTerm()
    while (this.peek() === '+' || this.peek() === '-') {
      const op = this.consume()
      const right = this.parseTerm()
      if (op === '+') left += right
      else left -= right
    }
    return left
  }

  private parseTerm(): number {
    let left = this.parseFactor()
    while (this.peek() === '*' || this.peek() === '/' || this.peek() === '%') {
      const op = this.consume()
      const right = this.parseFactor()
      if (op === '*') left *= right
      else if (op === '/') {
        if (right === 0) throw new Error('除数不能为零')
        left /= right
      } else left %= right
    }
    return left
  }

  private parseFactor(): number {
    if (this.peek() === '+') {
      this.consume()
      return this.parseFactor()
    }
    if (this.peek() === '-') {
      this.consume()
      return -this.parseFactor()
    }
    return this.parsePower()
  }

  private parsePower(): number {
    const base = this.parsePrimary()
    if (this.peek() === '^') {
      this.consume()
      const exp = this.parseFactor()
      return Math.pow(base, exp)
    }
    return base
  }

  private parsePrimary(): number {
    const token = this.peek()
    if (!token) throw new Error('表达式不完整')

    if (token === '(') {
      this.consume()
      const result = this.parseExpression()
      if (this.peek() !== ')') throw new Error('缺少右括号')
      this.consume()
      return result
    }

    if (/^[0-9.]+$/.test(token)) {
      this.consume()
      const num = parseFloat(token)
      if (isNaN(num)) throw new Error(`无效的数字: ${token}`)
      if (this.peek() === '%') {
        this.consume()
        return num / 100
      }
      return num
    }

    if (/^[a-zA-Z_]/.test(token)) {
      return this.parseFunction()
    }

    throw new Error(`无效的字符: ${token}`)
  }

  private parseFunction(): number {
    const name = this.consume().toLowerCase()
    const functions: Record<string, (...args: number[]) => number> = {
      abs: Math.abs,
      ceil: Math.ceil,
      floor: Math.floor,
      round: Math.round,
      sqrt: Math.sqrt,
      log: Math.log,
      log10: Math.log10,
      log2: Math.log2,
      exp: Math.exp,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      asin: Math.asin,
      acos: Math.acos,
      atan: Math.atan,
      pi: () => Math.PI,
      e: () => Math.E,
      max: (...args) => Math.max(...args),
      min: (...args) => Math.min(...args),
      pow: (a, b) => Math.pow(a, b)
    }

    if (name === 'pi' || name === 'e') {
      if (this.peek() === '(') {
        this.consume()
        if (this.peek() === ')') this.consume()
      }
      return functions[name]()
    }

    if (!(name in functions)) {
      throw new Error(`未知函数: ${name}`)
    }

    if (this.peek() !== '(') {
      throw new Error(`函数 ${name} 需要括号`)
    }
    this.consume()

    const args: number[] = []
    if (this.peek() !== ')') {
      args.push(this.parseExpression())
      while (this.peek() === ',') {
        this.consume()
        args.push(this.parseExpression())
      }
    }

    if (this.peek() !== ')') throw new Error('缺少右括号')
    this.consume()

    return functions[name](...args)
  }

  parse(): number {
    if (this.tokens.length === 0) throw new Error('空表达式')
    const result = this.parseExpression()
    if (this.pos < this.tokens.length) {
      throw new Error(`多余的字符: ${this.tokens.slice(this.pos).join(' ')}`)
    }
    return result
  }
}

const safeEvaluate = (expr: string): { value: number; error: string | null } => {
  try {
    const cleanExpr = expr.trim().replace(/^=+/, '').replace(/=+\s*\?*$/, '').replace(/\?+$/, '').trim()
    if (!cleanExpr) return { value: 0, error: '空表达式' }
    const tokens = tokenize(cleanExpr)
    const parser = new Parser(tokens)
    const result = parser.parse()
    if (!isFinite(result)) return { value: 0, error: '计算结果溢出' }
    return { value: result, error: null }
  } catch (e) {
    return { value: 0, error: e instanceof Error ? e.message : '计算错误' }
  }
}

const formatNumber = (num: number): string => {
  if (Number.isInteger(num)) {
    return num.toLocaleString('zh-CN')
  }
  const fixed = num.toFixed(10)
  const trimmed = fixed.replace(/\.?0+$/, '')
  return parseFloat(trimmed).toLocaleString('zh-CN', { maximumFractionDigits: 10 })
}

const numberToChineseReadable = (num: number): string => {
  if (Math.abs(num) >= 100000000) {
    return (num / 100000000).toFixed(2).replace(/\.?0+$/, '') + ' 亿'
  }
  if (Math.abs(num) >= 10000) {
    return (num / 10000).toFixed(2).replace(/\.?0+$/, '') + ' 万'
  }
  return ''
}

const findExpressionsInLine = (line: string): Segment[] => {
  const segments: Segment[] = []
  const exprRegex = /(-?[\d,]+\.?\d*\s*%?\s*(?:[+\-*/^]\s*-?[\d,]+\.?\d*\s*%?\s*|\(\s*[^()]*\)\s*)*|[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\))/g
  let lastIndex = 0
  let match

  while ((match = exprRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: line.slice(lastIndex, match.index) })
    }

    const exprCandidate = match[0]
    const evalResult = safeEvaluate(exprCandidate)

    if (!evalResult.error) {
      segments.push({
        type: 'expression',
        value: exprCandidate,
        result: evalResult.value,
        error: undefined
      })
    } else {
      const minusMatch = exprCandidate.match(/^-\s*\d/)
      if (minusMatch && match.index > 0 && /\d$/.test(line.slice(0, match.index))) {
        segments.push({ type: 'text', value: exprCandidate })
      } else {
        segments.push({
          type: 'expression',
          value: exprCandidate,
          result: undefined,
          error: evalResult.error
        })
      }
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < line.length) {
    segments.push({ type: 'text', value: line.slice(lastIndex) })
  }

  if (segments.length === 0) {
    segments.push({ type: 'text', value: line })
  }

  return segments
}

const parsedLines = computed<ParsedLine[]>(() => {
  const lines = inputText.value.split('\n')
  return lines.map(line => {
    const segments = findExpressionsInLine(line)
    const exprSegments = segments.filter(s => s.type === 'expression' && s.error === undefined)

    if (exprSegments.length === 0) {
      const hasError = segments.some(s => s.type === 'expression' && s.error)
      if (hasError) {
        const errorSegment = segments.find(s => s.type === 'expression' && s.error)
        return {
          original: line,
          segments,
          hasExpression: true,
          expression: errorSegment?.value,
          error: errorSegment?.error
        }
      }
      return {
        original: line,
        segments,
        hasExpression: false
      }
    }

    if (exprSegments.length === 1) {
      const seg = exprSegments[0]
      const formatted = formatNumber(seg.result!)
      return {
        original: line,
        segments,
        hasExpression: true,
        expression: seg.value,
        result: formatted,
        resultReadable: numberToChineseReadable(seg.result!)
      }
    }

    const results = exprSegments.map(s => formatNumber(s.result!))
    return {
      original: line,
      segments,
      hasExpression: true,
      expression: exprSegments.map(s => s.value).join(', '),
      result: results.join(', ')
    }
  })
})

interface DisplayLine {
  originalIndex: number
  line: ParsedLine
}

const displayLines = computed<DisplayLine[]>(() => {
  const all = parsedLines.value.map((line, idx) => ({ originalIndex: idx, line }))
  if (filterMode.value === 'all') return all
  return all.filter(item => item.line.hasExpression)
})

const onFilterChange = async (val: string) => {
  await nextTick()
  syncScrollFromLeft()
}

const expressionCount = computed(() => {
  return parsedLines.value.filter(l => l.hasExpression && !l.error).length
})

const hasExpressions = computed(() => expressionCount.value > 0)

const copyResults = () => {
  const lines = parsedLines.value
    .filter(l => l.hasExpression)
    .map(l => {
      if (l.error) {
        return `${l.original}  ⚠️ ${l.error}`
      }
      return `${l.original}  = ${l.result}${l.resultReadable ? ` （${l.resultReadable}）` : ''}`
    })

  const text = lines.join('\n')
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('计算结果已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

onMounted(() => {
  nextTick(() => {
    syncScrollFromLeft()
  })
})
</script>

<style scoped>
.text-expression-calculator {
  max-width: 1500px;
  margin: 0 auto;
}

.guide-card,
.example-card,
.main-card,
.syntax-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.header-subtitle {
  font-size: 13px;
  color: #909399;
  font-weight: normal;
  margin-left: 8px;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.guide-steps {
  padding: 8px 0;
}

.example-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.example-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  cursor: pointer;
  transition: all 0.25s;
  background: #fafafa;
}

.example-item:hover {
  transform: translateY(-2px);
  border-color: #165DFF;
  background: #f0f7ff;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
}

.example-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.example-info {
  flex: 1;
  min-width: 0;
}

.example-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.example-desc {
  font-size: 12px;
  color: #909399;
}

.example-arrow {
  color: #c0c4cc;
  flex-shrink: 0;
}

.calculator-container {
  display: grid;
  grid-template-columns: 1fr 48px 1fr;
  gap: 0;
  min-height: 520px;
}

.input-panel,
.result-panel {
  display: flex;
  flex-direction: column;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-panel {
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-panel:focus-within {
  border-color: #165DFF;
  box-shadow: -4px 0 16px rgba(22, 93, 255, 0.1);
  z-index: 2;
}

.result-panel {
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.result-panel:hover {
  border-color: #67c23a;
  box-shadow: 4px 0 16px rgba(103, 194, 58, 0.1);
  z-index: 2;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.input-panel .panel-header {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
}

.result-panel .panel-header {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
}

.panel-title {
  flex: 1;
}

.result-filter {
  margin-left: auto;
  margin-right: 0;
}

.result-filter :deep(.el-radio-button__inner) {
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
}

.result-filter :deep(.el-radio-button--small .el-radio-button__inner) {
  height: 28px;
  line-height: 1;
}

.editor-wrapper {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  background: #fff;
}

.line-numbers {
  width: 48px;
  flex-shrink: 0;
  background: #fafbfc;
  border-right: 1px solid #ebeef5;
  padding: 12px 0;
  overflow: hidden;
  user-select: none;
}

.line-num {
  height: 28px;
  line-height: 28px;
  text-align: right;
  padding-right: 12px;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  color: #a8abb2;
  transition: all 0.2s;
}

.line-num.hovered {
  color: #165DFF;
  font-weight: 700;
  background: rgba(22, 93, 255, 0.08);
}

.line-num.has-expr {
  color: #67c23a;
}

.line-num.has-error {
  color: #f56c6c;
}

.textarea-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  min-height: 480px;
  border: none;
  outline: none;
  resize: none;
  padding: 12px 16px;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 28px;
  color: #303133;
  background: transparent;
  overflow-y: auto;
  box-sizing: border-box;
}

.editor-textarea::placeholder {
  color: #c0c4cc;
}

.input-footer {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid #ebeef5;
  background: #fafafa;
}

.divider-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(180deg, #ecf5ff 0%, #f0f9eb 100%);
  gap: 6px;
}

.divider-line::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: linear-gradient(180deg, #165DFF 0%, #67c23a 100%);
  transform: translateX(-50%);
}

.divider-content {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #165DFF 0%, #67c23a 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.25);
}

.divider-hint {
  position: relative;
  z-index: 1;
  font-size: 10px;
  color: #606266;
  font-weight: 500;
  writing-mode: vertical-rl;
  letter-spacing: 2px;
  margin-top: 6px;
  padding: 6px 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.result-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
  background: #fcfcfd;
  scroll-behavior: smooth;
}

.result-line {
  display: flex;
  padding: 0;
  border-bottom: 1px solid transparent;
  transition: all 0.2s;
  cursor: default;
}

.result-line.is-empty .line-original {
  min-height: 28px;
}

.result-line:hover,
.result-line.hovered {
  background: #fffbeb;
}

.result-line.hovered {
  border-bottom-color: #e6a23c;
  border-top-color: #e6a23c;
  background: linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%);
}

.result-line.has-expression {
  background: linear-gradient(90deg, #f0f9eb 0%, #ffffff 60%);
}

.result-line.has-expression.hovered,
.result-line.has-expression:hover {
  background: linear-gradient(90deg, #e1f3d8 0%, #fffbeb 100%);
}

.result-line.has-error {
  background: linear-gradient(90deg, #fef0f0 0%, #ffffff 60%);
}

.result-line.has-error.hovered,
.result-line.has-error:hover {
  background: linear-gradient(90deg, #fde2e2 0%, #fffbeb 100%);
}

.result-line.no-expression {
  padding: 0;
  background: #fcfcfd;
  border-bottom: 1px dashed #f0f0f0;
}

.result-line.no-expression:hover,
.result-line.no-expression.hovered {
  background: #f5f7fa;
  border-bottom-color: #dcdfe6;
  border-top-color: transparent;
}

.result-line.no-expression.is-empty .line-original {
  min-height: 28px;
}

.result-line.no-expression:not(.is-empty) .line-content {
  padding: 4px 12px 4px 8px;
}

.line-number {
  width: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0 12px 0 0;
  margin: 4px 0;
  border-right: 2px solid transparent;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  line-height: 28px;
  color: #a8abb2;
  transition: all 0.2s;
}

.line-number.hovered {
  color: #165DFF;
  font-weight: 700;
  background: rgba(22, 93, 255, 0.08);
  border-right-color: #165DFF;
}

.line-number.has-expr {
  color: #67c23a;
  font-weight: 600;
  border-right-color: #67c23a;
}

.line-number.has-expr.hovered {
  color: #165DFF;
  border-right-color: #165DFF;
}

.line-number.has-error {
  color: #f56c6c;
  font-weight: 600;
  border-right-color: #f56c6c;
}

.line-number.no-expr {
  color: #d3d4d6;
  font-weight: 400;
  border-right-color: transparent;
  opacity: 0.7;
}

.line-content {
  flex: 1;
  min-width: 0;
  padding: 4px 12px 4px 8px;
}

.line-original {
  font-size: 14px;
  line-height: 28px;
  color: #303133;
  word-break: break-all;
}

.line-original.text-muted {
  font-size: 13px;
  color: #a8abb2;
  font-weight: 400;
}

.line-original.text-muted .seg-text {
  color: #b1b3b8;
}

.no-expr-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 8px;
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 500;
  color: #909399;
  background: #f4f4f5;
  border-radius: 4px;
  vertical-align: middle;
  line-height: 1.4;
}

.empty-line-placeholder {
  color: #dcdfe6;
  font-style: italic;
  font-size: 13px;
}

.seg-text {
  color: #606266;
}

.seg-expression {
  background: #ecf5ff;
  color: #165DFF;
  padding: 1px 8px;
  border-radius: 5px;
  font-weight: 600;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  margin: 0 2px;
}

.seg-expression.error {
  background: #fef0f0;
  color: #f56c6c;
}

.line-result {
  margin-top: 4px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #67c23a;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.result-label {
  color: #909399;
  font-weight: 600;
  font-size: 16px;
  font-family: 'SF Mono', monospace;
}

.result-value {
  color: #67c23a;
  font-weight: 700;
  font-size: 18px;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  letter-spacing: 0.3px;
}

.result-readable {
  color: #e6a23c;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  background: #fdf6ec;
  border-radius: 4px;
}

.copy-inline-btn {
  margin-left: auto;
  color: #c0c4cc;
  cursor: pointer;
  padding: 3px;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 14px;
}

.copy-inline-btn:hover {
  color: #165DFF;
  background: #ecf5ff;
}

.error-label {
  color: #f56c6c;
  font-size: 16px;
}

.error-message {
  color: #f56c6c;
  font-size: 13px;
  font-weight: 500;
}

.empty-result {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  gap: 8px;
}

.empty-result p {
  margin: 0;
  font-size: 14px;
}

.empty-hint {
  font-size: 12px !important;
  color: #dcdfe6;
}

.syntax-item {
  padding: 8px 0;
}

.syntax-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.syntax-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 900px) {
  .example-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .calculator-container {
    grid-template-columns: 1fr;
  }

  .input-panel {
    border-right: 2px solid #e4e7ed;
    border-radius: 12px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .result-panel {
    border-left: 2px solid #e4e7ed;
    border-radius: 12px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    min-height: 300px;
  }

  .divider-line {
    height: 52px;
    flex-direction: row;
    gap: 12px;
  }

  .divider-line::before {
    top: 50%;
    left: 0;
    right: 0;
    width: auto;
    height: 2px;
    transform: translateY(-50%);
  }

  .divider-hint {
    writing-mode: horizontal-tb;
    margin-top: 0;
  }
}

@media (max-width: 600px) {
  .example-list {
    grid-template-columns: 1fr;
  }
}
</style>
