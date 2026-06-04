<template>
  <div class="php-beautifier">
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
        <el-step title="粘贴代码" description="将杂乱的PHP代码粘贴到左侧输入框" />
        <el-step title="选择风格" description="根据喜好选择缩进风格和换行方式" />
        <el-step title="一键美化" description="点击美化按钮，自动完成代码格式化" />
        <el-step title="复制使用" description="一键复制美化后的代码到项目中使用" />
      </el-steps>
    </el-card>

    <el-card class="options-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Setting />
          </el-icon>
          <span>格式化选项</span>
        </div>
      </template>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="缩进风格">
            <el-select v-model="options.indentStyle" size="small" style="width: 100%">
              <el-option label="空格 (4)" value="space4" />
              <el-option label="空格 (2)" value="space2" />
              <el-option label="Tab" value="tab" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="换行风格">
            <el-select v-model="options.newlineStyle" size="small" style="width: 100%">
              <el-option label="LF (Unix)" value="lf" />
              <el-option label="CRLF (Windows)" value="crlf" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="大括号风格">
            <el-select v-model="options.braceStyle" size="small" style="width: 100%">
              <el-option label="K&amp;R 风格" value="k&r" />
              <el-option label="Allman 风格" value="allman" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="代码主题">
            <el-select v-model="options.theme" size="small" style="width: 100%">
              <el-option label="浅色主题" value="light" />
              <el-option label="深色主题" value="dark" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="等宽字体">
            <el-switch v-model="options.useMonospace" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="显示行号">
            <el-switch v-model="options.showLineNumbers" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="去除空行">
            <el-switch v-model="options.removeExtraNewlines" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="自动对齐">
            <el-switch v-model="options.alignEquals" size="small" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="editor-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DocumentCopy />
          </el-icon>
          <span>PHP代码编辑器</span>
          <el-tag size="small" type="info" class="header-tag">支持 PHP 4-8 语法</el-tag>
        </div>
      </template>

      <div class="quick-preset">
        <span class="preset-label">快捷操作：</span>
        <el-button-group>
          <el-button size="small" @click="clearAll">
            <el-icon><Delete /></el-icon>
            清空全部
          </el-button>
          <el-button size="small" @click="pasteFromClipboard">
            <el-icon><Document /></el-icon>
            粘贴代码
          </el-button>
          <el-button size="small" @click="loadSample">
            <el-icon><DataLine /></el-icon>
            加载示例
          </el-button>
          <el-button size="small" type="primary" @click="beautify" :disabled="!hasInput">
            <el-icon><MagicStick /></el-icon>
            一键美化
          </el-button>
        </el-button-group>
      </div>

      <el-row :gutter="16">
        <el-col :span="12">
          <div class="code-panel">
            <div class="panel-header">
              <span class="panel-title">原始代码</span>
              <div class="panel-stats">
                <el-tag size="small" type="info">{{ inputLineCount }} 行</el-tag>
                <el-tag size="small" type="success">{{ inputSize }}</el-tag>
              </div>
            </div>
            <el-input
              v-model="inputCode"
              type="textarea"
              :rows="20"
              placeholder="请在此粘贴或输入 PHP 代码...&#10;&#10;支持带 &lt;?php 标签或纯代码"
              resize="vertical"
              class="code-input"
              :class="{ 'monospace': options.useMonospace }"
              @input="onInput"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="code-panel">
            <div class="panel-header">
              <span class="panel-title">美化结果</span>
              <div class="panel-actions">
                <el-button size="small" text @click="copyOutput" :disabled="!hasOutput">
                  <el-icon><CopyDocument /></el-icon>
                  复制代码
                </el-button>
                <el-button size="small" text @click="downloadCode" :disabled="!hasOutput">
                  <el-icon><Download /></el-icon>
                  下载文件
                </el-button>
                <el-tag size="small" type="info">{{ outputLineCount }} 行</el-tag>
                <el-tag size="small" type="success">{{ outputSize }}</el-tag>
              </div>
            </div>
            <div 
              class="code-output" 
              :class="[
                options.theme === 'dark' ? 'theme-dark' : 'theme-light',
                { 'monospace': options.useMonospace }
              ]"
            >
              <div v-if="options.showLineNumbers" class="line-numbers">
                <div v-for="n in outputLineCount" :key="n" class="line-number">{{ n }}</div>
              </div>
              <pre class="code-content"><code v-html="highlightedCode"></code></pre>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card v-if="hasErrors" class="error-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#f56c6c">
            <Warning />
          </el-icon>
          <span>语法检测提示</span>
        </div>
      </template>
      <el-alert
        v-for="(error, index) in errors"
        :key="index"
        :title="error.message"
        :type="error.type"
        :description="error.description"
        :closable="false"
        show-icon
        class="error-alert"
      />
    </el-card>

    <el-card v-if="hasOutput" class="stats-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataAnalysis />
          </el-icon>
          <span>代码分析</span>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="4">
          <div class="stat-item">
            <div class="stat-icon primary">
              <el-icon><Edit /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ codeStats.lines }}</div>
              <div class="stat-label">代码行数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="stat-item">
            <div class="stat-icon success">
              <el-icon><Tickets /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ codeStats.functions }}</div>
              <div class="stat-label">函数数量</div>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="stat-item">
            <div class="stat-icon warning">
              <el-icon><FolderOpened /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ codeStats.classes }}</div>
              <div class="stat-label">类数量</div>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="stat-item">
            <div class="stat-icon danger">
              <el-icon><ChatLineRound /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ codeStats.comments }}</div>
              <div class="stat-label">注释行数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="stat-item">
            <div class="stat-icon info">
              <el-icon><Sort /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ codeStats.nestingLevel }}</div>
              <div class="stat-label">最大嵌套</div>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="stat-item">
            <div class="stat-icon primary">
              <el-icon><Coin /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ codeStats.variables }}</div>
              <div class="stat-label">变量定义</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DocumentCopy,
  InfoFilled,
  Setting,
  Delete,
  Document,
  DataLine,
  MagicStick,
  CopyDocument,
  Download,
  Warning,
  DataAnalysis,
  Edit,
  Tickets,
  FolderOpened,
  ChatLineRound,
  Sort,
  Coin
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface FormatOptions {
  indentStyle: 'space4' | 'space2' | 'tab'
  newlineStyle: 'lf' | 'crlf'
  braceStyle: 'k&r' | 'allman'
  theme: 'light' | 'dark'
  useMonospace: boolean
  showLineNumbers: boolean
  removeExtraNewlines: boolean
  alignEquals: boolean
}

interface CodeError {
  type: 'warning' | 'error' | 'info'
  message: string
  description?: string
}

interface CodeStats {
  lines: number
  functions: number
  classes: number
  comments: number
  nestingLevel: number
  variables: number
}

const inputCode = ref('')
const outputCode = ref('')
const errors = ref<CodeError[]>([])

const options = ref<FormatOptions>({
  indentStyle: 'space4',
  newlineStyle: 'lf',
  braceStyle: 'k&r',
  theme: 'light',
  useMonospace: true,
  showLineNumbers: true,
  removeExtraNewlines: true,
  alignEquals: true
})

const hasInput = computed(() => inputCode.value.trim().length > 0)
const hasOutput = computed(() => outputCode.value.trim().length > 0)
const hasErrors = computed(() => errors.value.length > 0)

const inputLineCount = computed(() => {
  if (!inputCode.value) return 0
  return inputCode.value.split('\n').length
})

const outputLineCount = computed(() => {
  if (!outputCode.value) return 0
  return outputCode.value.split('\n').length
})

const inputSize = computed(() => {
  const bytes = new TextEncoder().encode(inputCode.value).length
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
})

const outputSize = computed(() => {
  const bytes = new TextEncoder().encode(outputCode.value).length
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
})

const codeStats = computed<CodeStats>(() => {
  const code = outputCode.value
  const lines = code.split('\n').length
  const functions = (code.match(/function\s+\w+/g) || []).length
  const classes = (code.match(/class\s+\w+/g) || []).length
  const comments = (code.match(/\/\/|\/\*|\*\/|#/g) || []).length
  const variables = (code.match(/\$\w+/g) || []).length
  
  let maxNesting = 0
  let currentNesting = 0
  for (const char of code) {
    if (char === '{') {
      currentNesting++
      maxNesting = Math.max(maxNesting, currentNesting)
    } else if (char === '}') {
      currentNesting--
    }
  }
  
  return {
    lines,
    functions,
    classes,
    comments,
    nestingLevel: maxNesting,
    variables
  }
})

const PHP_KEYWORDS = [
  'abstract', 'and', 'array', 'as', 'break', 'callable', 'case', 'catch',
  'class', 'clone', 'const', 'continue', 'declare', 'default', 'die', 'do',
  'echo', 'else', 'elseif', 'empty', 'enddeclare', 'endfor', 'endforeach',
  'endif', 'endswitch', 'endwhile', 'eval', 'exit', 'extends', 'final',
  'finally', 'for', 'foreach', 'function', 'global', 'goto', 'if', 'implements',
  'include', 'include_once', 'instanceof', 'insteadof', 'interface', 'isset',
  'list', 'namespace', 'new', 'or', 'print', 'private', 'protected', 'public',
  'require', 'require_once', 'return', 'static', 'switch', 'throw', 'trait',
  'try', 'unset', 'use', 'var', 'while', 'xor', 'yield',
  'true', 'false', 'null', 'TRUE', 'FALSE', 'NULL',
  'self', 'parent', 'static', 'this'
]

const PHP_BUILT_INS = [
  'echo', 'print', 'isset', 'empty', 'unset', 'define', 'defined',
  'strlen', 'strpos', 'str_replace', 'substr', 'trim', 'explode', 'implode',
  'count', 'sizeof', 'array_push', 'array_pop', 'array_shift', 'array_unshift',
  'file_get_contents', 'file_put_contents', 'fopen', 'fclose', 'fread', 'fwrite',
  'mysql_query', 'mysqli_query', 'pg_query', 'sqlite_query',
  'header', 'setcookie', 'session_start', 'json_encode', 'json_decode',
  'var_dump', 'print_r', 'gettype', 'is_array', 'is_string', 'is_int',
  'is_float', 'is_bool', 'is_null', 'is_object', 'method_exists',
  'class_exists', 'function_exists', 'extension_loaded'
]

const highlightedCode = computed(() => {
  if (!outputCode.value) return ''
  
  let code = outputCode.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  code = code.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
  code = code.replace(/(#.*$)/gm, '<span class="comment">$1</span>')
  code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
  
  code = code.replace(/('.*?')/g, '<span class="string">$1</span>')
  code = code.replace(/(".*?")/g, '<span class="string">$1</span>')
  
  code = code.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
  
  for (const keyword of PHP_KEYWORDS) {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
    code = code.replace(regex, '<span class="keyword">$1</span>')
  }
  
  code = code.replace(/(\$\w+)/g, '<span class="variable">$1</span>')
  
  code = code.replace(/(<\?(?:php)?|\?>)/g, '<span class="tag">$1</span>')
  
  code = code.replace(/(->)(\w+)/g, '$1<span class="method">$2</span>')
  
  code = code.replace(/(::)(\w+)/g, '$1<span class="method">$2</span>')
  
  for (const func of PHP_BUILT_INS) {
    const regex = new RegExp(`\\b(${func})(?=\\s*\\()`, 'g')
    code = code.replace(regex, '<span class="function">$1</span>')
  }
  
  return code
})

const getIndent = (level: number): string => {
  const indentChar = options.value.indentStyle === 'tab' ? '\t' : ' '
  const indentSize = options.value.indentStyle === 'space2' ? 2 : 4
  return indentChar.repeat(level * indentSize)
}

const getNewline = (): string => {
  return options.value.newlineStyle === 'crlf' ? '\r\n' : '\n'
}

const beautify = () => {
  if (!hasInput.value) {
    ElMessage.warning('请先输入PHP代码')
    return
  }

  errors.value = []
  
  try {
    let code = inputCode.value
    
    code = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    
    if (options.value.removeExtraNewlines) {
      code = code.replace(/\n{3,}/g, '\n\n')
    }
    
    let hasOpenTag = code.includes('<?php') || code.includes('<?')
    if (!hasOpenTag && code.trim().length > 0) {
      code = '<?php\n' + code
    }
    
    let result = ''
    let indentLevel = 0
    let inString = false
    let stringChar = ''
    let inComment = false
    let i = 0
    
    code = code.replace(/^\s+|\s+$/g, '')
    
    const lines = code.split('\n')
    const formattedLines: string[] = []
    
    let inMultiLineComment = false
    
    for (let line of lines) {
      line = line.trim()
      
      if (!line) {
        if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
          formattedLines.push('')
        }
        continue
      }
      
      if (inMultiLineComment) {
        formattedLines.push(getIndent(indentLevel) + line)
        if (line.includes('*/')) {
          inMultiLineComment = false
        }
        continue
      }
      
      if (line.startsWith('/*')) {
        inMultiLineComment = !line.includes('*/')
        formattedLines.push(getIndent(indentLevel) + line)
        continue
      }
      
      if (line.startsWith('//') || line.startsWith('#')) {
        formattedLines.push(getIndent(indentLevel) + line)
        continue
      }
      
      let tempLine = line
      tempLine = tempLine.replace(/\/\/.*$/, '')
      tempLine = tempLine.replace(/#.*$/, '')
      
      const openBraces = (tempLine.match(/\{/g) || []).length
      const closeBraces = (tempLine.match(/\}/g) || []).length
      
      let startsWithCloseBrace = false
      let endsWithOpenBrace = false
      
      if (tempLine.startsWith('}') || tempLine.startsWith('}') || tempLine.startsWith('},')) {
        startsWithCloseBrace = true
      }
      
      if (tempLine.endsWith('{') || tempLine.endsWith('{;')) {
        endsWithOpenBrace = true
      }
      
      if (options.value.braceStyle === 'allman' && endsWithOpenBrace && !tempLine.includes('}')) {
        const match = tempLine.match(/^(.*?)\s*\{\s*$/)
        if (match) {
          const beforeBrace = match[1].trim()
          if (startsWithCloseBrace) {
            indentLevel = Math.max(0, indentLevel - closeBraces)
          }
          formattedLines.push(getIndent(indentLevel) + beforeBrace)
          formattedLines.push(getIndent(indentLevel) + '{')
          indentLevel += openBraces
          continue
        }
      }
      
      if (startsWithCloseBrace) {
        indentLevel = Math.max(0, indentLevel - closeBraces)
      }
      
      formattedLines.push(getIndent(indentLevel) + line)
      
      if (!startsWithCloseBrace) {
        indentLevel += openBraces - closeBraces
      } else {
        indentLevel += openBraces
      }
      
      indentLevel = Math.max(0, indentLevel)
    }
    
    let formattedCode = formattedLines.join('\n')
    
    formattedCode = formattedCode.replace(/\n{3,}/g, '\n\n')
    formattedCode = formattedCode.replace(/^\n+|\n+$/g, '')
    
    if (options.value.newlineStyle === 'crlf') {
      formattedCode = formattedCode.replace(/\n/g, '\r\n')
    }
    
    outputCode.value = formattedCode
    
    detectSyntaxIssues(inputCode.value)
    
    ElMessage.success('代码美化完成！')
  } catch (error) {
    console.error('Beautify error:', error)
    ElMessage.error('美化过程中出现错误')
  }
}

const detectSyntaxIssues = (code: string) => {
  const issues: CodeError[] = []
  
  const openTags = (code.match(/<\?(?:php)?/g) || []).length
  const closeTags = (code.match(/\?>/g) || []).length
  
  if (openTags > closeTags) {
    issues.push({
      type: 'warning',
      message: '检测到未闭合的 PHP 标签',
      description: `代码中有 ${openTags} 个开始标签，但只有 ${closeTags} 个结束标签。请检查代码完整性。`
    })
  }
  
  const openBraces = (code.match(/\{/g) || []).length
  const closeBraces = (code.match(/\}/g) || []).length
  
  if (openBraces !== closeBraces) {
    issues.push({
      type: 'error',
      message: '大括号数量不匹配',
      description: `代码中有 ${openBraces} 个左大括号，但有 ${closeBraces} 个右大括号。这可能导致语法错误。`
    })
  }
  
  const openParens = (code.match(/\(/g) || []).length
  const closeParens = (code.match(/\)/g) || []).length
  
  if (openParens !== closeParens) {
    issues.push({
      type: 'error',
      message: '圆括号数量不匹配',
      description: `代码中有 ${openParens} 个左圆括号，但有 ${closeParens} 个右圆括号。`
    })
  }
  
  if (code.includes('mysql_') && !code.includes('mysqli_') && !code.includes('PDO')) {
    issues.push({
      type: 'warning',
      message: '检测到已废弃的 mysql_ 函数',
      description: 'mysql_ 扩展在 PHP 7.0 中已被移除，建议使用 mysqli_ 或 PDO 进行数据库操作。'
    })
  }
  
  if (code.includes('eval(')) {
    issues.push({
      type: 'warning',
      message: '检测到 eval() 函数',
      description: '使用 eval() 可能存在安全风险，建议尽量避免使用。'
    })
  }
  
  errors.value = issues
}

const onInput = () => {
}

const clearAll = () => {
  inputCode.value = ''
  outputCode.value = ''
  errors.value = []
  ElMessage.success('已清空全部内容')
}

const pasteFromClipboard = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText()
    if (clipboardText) {
      inputCode.value = clipboardText
      ElMessage.success('已从剪贴板粘贴')
    } else {
      ElMessage.warning('剪贴板为空')
    }
  } catch (e) {
    ElMessage.error('无法访问剪贴板，请手动粘贴')
  }
}

const sampleCode = `<?php
class User {
public $id;
public $name;
public function __construct($id, $name) {
$this->id = $id;
$this->name = $name;
}
public function getName() {
return $this->name;
}
}
function getUserById($id) {
if($id <= 0) {
return null;
}
$user = new User($id, "张三");
return $user;
}
$user = getUserById(1);
if($user) {
echo "用户名称: " . $user->getName();
}
?>`

const loadSample = () => {
  inputCode.value = sampleCode
  ElMessage.success('已加载示例代码')
}

const copyOutput = () => {
  if (!hasOutput.value) return
  
  navigator.clipboard.writeText(outputCode.value).then(() => {
    ElMessage.success('代码已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

const downloadCode = () => {
  if (!hasOutput.value) return
  
  const blob = new Blob([outputCode.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'beautified.php'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  ElMessage.success('文件已下载')
}
</script>

<style scoped>
.php-beautifier {
  max-width: 1400px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.options-card {
  margin-bottom: 24px;
}

.options-card :deep(.el-form-item) {
  margin-bottom: 0;
}

.options-card :deep(.el-form-item__label) {
  width: 80px !important;
}

.editor-card {
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

.code-panel {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.panel-stats,
.panel-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-actions .el-button {
  padding: 0 4px;
}

.code-input :deep(.el-textarea__inner) {
  border: none;
  border-radius: 0;
  font-size: 13px;
  line-height: 1.6;
  min-height: 400px;
}

.code-input.monospace :deep(.el-textarea__inner) {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Roboto Mono', monospace;
}

.code-output {
  display: flex;
  min-height: 400px;
  max-height: 600px;
  overflow: auto;
  background: #fff;
}

.code-output.monospace pre,
.code-output.monospace code {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Roboto Mono', monospace;
}

.code-output.theme-dark {
  background: #1e1e1e;
}

.code-output.theme-dark .line-number {
  color: #858585;
  border-right-color: #333;
}

.code-output.theme-dark .code-content {
  color: #d4d4d4;
}

.line-numbers {
  padding: 12px 8px;
  border-right: 1px solid #e4e7ed;
  background: #fafafa;
  text-align: right;
  user-select: none;
  min-width: 50px;
}

.code-output.theme-dark .line-numbers {
  background: #252526;
  border-right-color: #333;
}

.line-number {
  font-size: 12px;
  line-height: 1.6;
  color: #909399;
  padding: 0 8px;
}

.code-content {
  flex: 1;
  padding: 12px 16px;
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre;
  overflow-x: auto;
}

.code-content :deep(.keyword) {
  color: #c678dd;
  font-weight: 500;
}

.theme-light .code-content :deep(.keyword) {
  color: #a626a4;
}

.code-content :deep(.string) {
  color: #98c379;
}

.theme-light .code-content :deep(.string) {
  color: #50a14f;
}

.code-content :deep(.number) {
  color: #d19a66;
}

.theme-light .code-content :deep(.number) {
  color: #986801;
}

.code-content :deep(.comment) {
  color: #5c6370;
  font-style: italic;
}

.theme-light .code-content :deep(.comment) {
  color: #a0a1a7;
}

.code-content :deep(.variable) {
  color: #e06c75;
}

.theme-light .code-content :deep(.variable) {
  color: #e45649;
}

.code-content :deep(.function) {
  color: #61afef;
}

.theme-light .code-content :deep(.function) {
  color: #4078f2;
}

.code-content :deep(.tag) {
  color: #e5c07b;
  font-weight: 500;
}

.theme-light .code-content :deep(.tag) {
  color: #c18401;
}

.code-content :deep(.method) {
  color: #61afef;
}

.theme-light .code-content :deep(.method) {
  color: #4078f2;
}

.error-card {
  margin-bottom: 24px;
}

.error-alert {
  margin-bottom: 12px;
}

.error-alert:last-child {
  margin-bottom: 0;
}

.stats-card {
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  flex-shrink: 0;
}

.stat-icon.primary {
  background: linear-gradient(135deg, #409eff, #165DFF);
}

.stat-icon.success {
  background: linear-gradient(135deg, #67c23a, #529e2e);
}

.stat-icon.warning {
  background: linear-gradient(135deg, #e6a23c, #cf9236);
}

.stat-icon.danger {
  background: linear-gradient(135deg, #f56c6c, #dd6161);
}

.stat-icon.info {
  background: linear-gradient(135deg, #909399, #73767a);
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
