<template>
  <div class="code-highlighter">
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
        <el-step title="选择语言" description="从下拉列表中选择代码对应的编程语言，支持自动检测" />
        <el-step title="粘贴代码" description="在左侧编辑区粘贴或输入需要高亮的代码片段" />
        <el-step title="应用高亮" description="点击「应用高亮」按钮，一键生成语法高亮代码" />
        <el-step title="导出使用" description="复制高亮代码、HTML 或下载渲染结果图片" />
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
        <el-tag type="primary" effect="plain">技术博客 - 插入高亮代码片段</el-tag>
        <el-tag type="success" effect="plain">文档编写 - 美化 API 示例代码</el-tag>
        <el-tag type="warning" effect="plain">教学演示 - 制作清晰的代码课件</el-tag>
        <el-tag type="info" effect="plain">代码分享 - 生成美观的代码截图</el-tag>
        <el-tag type="danger" effect="plain">幻灯片 - 嵌入可读性强的代码</el-tag>
      </div>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <EditPen />
          </el-icon>
          <span>代码语法高亮</span>
          <el-tag size="small" type="success" class="header-tag">支持 200+ 编程语言</el-tag>
        </div>
      </template>

      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-label">编程语言：</span>
          <el-select
            v-model="selectedLanguage"
            placeholder="选择语言"
            size="default"
            style="width: 200px"
          >
            <el-option
              v-for="lang in languageOptions"
              :key="lang.value"
              :label="lang.label"
              :value="lang.value"
            />
          </el-select>
          <span class="toolbar-label" style="margin-left: 16px;">主题：</span>
          <el-select
            v-model="selectedTheme"
            placeholder="选择主题"
            size="default"
            style="width: 160px"
          >
            <el-option
              v-for="theme in themeOptions"
              :key="theme.value"
              :label="theme.label"
              :value="theme.value"
            />
          </el-select>
        </div>
        <div class="toolbar-right">
          <el-switch
            v-model="showLineNumbers"
            active-text="显示行号"
            inactive-text="隐藏行号"
            size="small"
          />
          <el-switch
            v-model="showLanguageBadge"
            active-text="语言标签"
            inactive-text="无标签"
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
        <el-button type="primary" size="default" @click="applyHighlight" :loading="isHighlighting">
          <el-icon><Brush /></el-icon>
          应用高亮
        </el-button>
      </div>

      <div class="editor-container">
        <div class="editor-panel">
          <div class="editor-header">
            <span class="editor-title">
              <el-icon color="#909399"><Edit /></el-icon>
              原始代码
            </span>
            <div class="editor-actions">
              <el-tag size="small" type="info">{{ lineCount }} 行</el-tag>
              <el-tag size="small" :type="charCount > MAX_CHARS ? 'danger' : charCount > WARNING_CHARS ? 'warning' : 'success'">
                {{ formatCharCount(charCount) }} 字符
              </el-tag>
            </div>
          </div>
          <el-input
            v-model="sourceCode"
            type="textarea"
            :rows="20"
            placeholder="请在此粘贴或输入代码..."
            resize="vertical"
            class="code-editor"
            @input="autoHighlightIfEnabled"
          />
        </div>

        <div class="result-panel">
          <div class="editor-header">
            <span class="editor-title">
              <el-icon color="#67c23a"><View /></el-icon>
              高亮预览
              <el-tag v-if="detectedLanguage && selectedLanguage === 'auto'" size="small" type="primary" style="margin-left: 8px;">
                自动检测：{{ detectedLanguage }}
              </el-tag>
            </span>
            <div class="editor-actions">
              <el-button size="small" text @click="copyHighlightedHtml">
                <el-icon><CopyDocument /></el-icon>
                复制 HTML
              </el-button>
              <el-button size="small" text @click="copyHighlightedCode">
                <el-icon><DocumentCopy /></el-icon>
                复制代码
              </el-button>
              <el-button size="small" text @click="downloadAsHtml">
                <el-icon><Download /></el-icon>
                导出 HTML
              </el-button>
            </div>
          </div>
          <div
            class="highlight-preview"
            :class="[themeClass, { 'show-line-numbers': showLineNumbers }]"
          >
            <div v-if="showLanguageBadge && highlightedCode" class="language-badge">
              {{ displayLanguage }}
            </div>
            <pre v-if="highlightedCode" class="code-block"><code v-html="highlightedCode" /></pre>
            <pre v-else class="code-block placeholder"><code>点击「应用高亮」按钮预览渲染效果...</code></pre>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="output-section">
        <div class="section-title">
          <el-icon :size="16" color="#165DFF"><DataLine /></el-icon>
          <span>输出选项</span>
        </div>
        <el-tabs v-model="activeTab" class="output-tabs">
          <el-tab-pane label="带样式的 HTML" name="html">
            <div class="tab-toolbar">
              <el-button size="small" @click="copyFullHtml">
                <el-icon><CopyDocument /></el-icon>
                复制完整 HTML
              </el-button>
              <el-button size="small" @click="downloadFullHtml">
                <el-icon><Download /></el-icon>
                下载 HTML 文件
              </el-button>
            </div>
            <el-input
              v-model="fullHtmlOutput"
              type="textarea"
              :rows="10"
              readonly
              placeholder="应用高亮后，此处将生成带样式的完整 HTML..."
              resize="vertical"
              class="output-textarea"
            />
          </el-tab-pane>
          <el-tab-pane label="纯 HTML 片段" name="fragment">
            <div class="tab-toolbar">
              <el-button size="small" @click="copyHtmlFragment">
                <el-icon><CopyDocument /></el-icon>
                复制 HTML 片段
              </el-button>
            </div>
            <el-input
              v-model="htmlFragmentOutput"
              type="textarea"
              :rows="10"
              readonly
              placeholder="应用高亮后，此处将生成纯 HTML 片段（不含样式）..."
              resize="vertical"
              class="output-textarea"
            />
          </el-tab-pane>
          <el-tab-pane label="Markdown" name="markdown">
            <div class="tab-toolbar">
              <el-button size="small" @click="copyMarkdown">
                <el-icon><CopyDocument /></el-icon>
                复制 Markdown
              </el-button>
            </div>
            <el-input
              v-model="markdownOutput"
              type="textarea"
              :rows="10"
              readonly
              placeholder="应用高亮后，此处将生成 Markdown 格式代码块..."
              resize="vertical"
              class="output-textarea"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  InfoFilled,
  Suitcase,
  EditPen,
  Edit,
  View,
  MagicStick,
  Delete,
  Document,
  Brush,
  CopyDocument,
  DocumentCopy,
  Download,
  DataLine
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import hljs from 'highlight.js'

const MAX_CHARS = 200000
const WARNING_CHARS = 150000

const sourceCode = ref('')
const selectedLanguage = ref('auto')
const selectedTheme = ref('github')
const showLineNumbers = ref(true)
const showLanguageBadge = ref(true)
const highlightedCode = ref('')
const detectedLanguage = ref('')
const isHighlighting = ref(false)
const activeTab = ref('html')
const autoHighlight = ref(true)

const languageOptions = [
  { label: '自动检测', value: 'auto' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'scss' },
  { label: 'JSON', value: 'json' },
  { label: 'YAML', value: 'yaml' },
  { label: 'XML', value: 'xml' },
  { label: 'SQL', value: 'sql' },
  { label: 'Shell', value: 'bash' },
  { label: 'PowerShell', value: 'powershell' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Vue', value: 'vue' },
  { label: 'React (JSX)', value: 'jsx' },
  { label: 'TypeScript React (TSX)', value: 'tsx' },
  { label: 'Dockerfile', value: 'dockerfile' },
  { label: 'Nginx', value: 'nginx' },
  { label: 'Makefile', value: 'makefile' },
  { label: 'Plain Text', value: 'plaintext' }
]

const themeOptions = [
  { label: 'GitHub', value: 'github' },
  { label: 'GitHub Dark', value: 'github-dark' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'Dracula', value: 'dracula' },
  { label: 'Atom One Dark', value: 'atom-one-dark' },
  { label: 'Atom One Light', value: 'atom-one-light' },
  { label: 'VS Code', value: 'vs2015' },
  { label: 'Solarized Dark', value: 'solarized-dark' },
  { label: 'Solarized Light', value: 'solarized-light' },
  { label: 'Nord', value: 'nord' }
]

const themeClass = computed(() => `theme-${selectedTheme.value}`)

const displayLanguage = computed(() => {
  if (selectedLanguage.value === 'auto' && detectedLanguage.value) {
    const lang = languageOptions.find(l => l.value === detectedLanguage.value)
    return lang ? lang.label : detectedLanguage.value
  }
  const lang = languageOptions.find(l => l.value === selectedLanguage.value)
  return lang ? lang.label : selectedLanguage.value
})

const charCount = computed(() => sourceCode.value.length)
const lineCount = computed(() => {
  return sourceCode.value ? sourceCode.value.split('\n').length : 0
})

const formatCharCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const applyHighlight = () => {
  if (!sourceCode.value.trim()) {
    ElMessage.warning('请先输入或粘贴代码')
    return
  }

  isHighlighting.value = true

  try {
    let result: { value: string; language?: string }

    if (selectedLanguage.value === 'auto') {
      result = hljs.highlightAuto(sourceCode.value)
      detectedLanguage.value = result.language || ''
    } else {
      try {
        result = hljs.highlight(sourceCode.value, { language: selectedLanguage.value })
        detectedLanguage.value = selectedLanguage.value
      } catch {
        result = hljs.highlightAuto(sourceCode.value)
        detectedLanguage.value = result.language || ''
        ElMessage.warning(`不支持的语言 ${selectedLanguage.value}，已自动检测`)
      }
    }

    if (showLineNumbers.value) {
      const lines = result.value.split('\n')
      const maxLineNumWidth = lines.length.toString().length
      highlightedCode.value = lines
        .map((line, index) => {
          const lineNum = (index + 1).toString().padStart(maxLineNumWidth, ' ')
          return `<span class="line-number">${lineNum}</span><span class="line-content">${line || ' '}</span>`
        })
        .join('\n')
    } else {
      highlightedCode.value = result.value
    }

    ElMessage.success('代码高亮应用成功')
  } catch (error) {
    console.error('Highlight error:', error)
    ElMessage.error('代码高亮失败')
  } finally {
    isHighlighting.value = false
  }
}

const autoHighlightIfEnabled = () => {
  if (autoHighlight.value && sourceCode.value.trim()) {
    applyHighlight()
  }
}

const fullHtmlOutput = computed(() => {
  if (!highlightedCode.value) return ''
  const cssStyles = getThemeStyles(selectedTheme.value)
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Highlight</title>
  <style>
${cssStyles}
    body {
      margin: 0;
      padding: 20px;
      background: ${getThemeBg(selectedTheme.value)};
    }
    .code-container {
      max-width: 100%;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <div class="code-container">
    <pre class="hljs"><code>${highlightedCode.value}</code></pre>
  </div>
</body>
</html>`
})

const htmlFragmentOutput = computed(() => {
  if (!highlightedCode.value) return ''
  return `<pre><code class="language-${detectedLanguage.value || selectedLanguage.value}">${highlightedCode.value}</code></pre>`
})

const markdownOutput = computed(() => {
  if (!sourceCode.value) return ''
  const lang = detectedLanguage.value || (selectedLanguage.value !== 'auto' ? selectedLanguage.value : '')
  return `\`\`\`${lang}\n${sourceCode.value}\n\`\`\``
})

const getThemeBg = (theme: string): string => {
  const bgMap: Record<string, string> = {
    'github': '#ffffff',
    'github-dark': '#0d1117',
    'monokai': '#272822',
    'dracula': '#282a36',
    'atom-one-dark': '#282c34',
    'atom-one-light': '#fafafa',
    'vs2015': '#1e1e1e',
    'solarized-dark': '#002b36',
    'solarized-light': '#fdf6e3',
    'nord': '#2e3440'
  }
  return bgMap[theme] || '#ffffff'
}

const getThemeStyles = (theme: string): string => {
  const baseStyles = `
    .hljs {
      display: block;
      overflow-x: auto;
      padding: 1em;
      font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      border-radius: 6px;
    }
    .hljs .line-number {
      display: inline-block;
      width: 3em;
      padding-right: 1em;
      margin-right: 1em;
      text-align: right;
      color: #858585;
      border-right: 1px solid #ddd;
      user-select: none;
    }
    .hljs .line-content {
      display: inline;
    }
  `

  const themes: Record<string, string> = {
    'github': `
      .hljs { background: #ffffff; color: #24292e; }
      .hljs-comment, .hljs-quote { color: #6a737d; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #d73a49; }
      .hljs-function, .hljs-name, .hljs-params, .hljs-attr, .hljs-attribute { color: #6f42c1; }
      .hljs-string, .hljs-doctag, .hljs-regexp, .hljs-template-tag, .hljs-template-variable { color: #032f62; }
      .hljs-title, .hljs-built_in, .hljs-type, .hljs-class .hljs-title { color: #22863a; }
      .hljs-number, .hljs-symbol, .hljs-bullet, .hljs-meta, .hljs-selector-attr, .hljs-selector-pseudo { color: #005cc5; }
      .hljs-variable, .hljs-tag, .hljs-name, .hljs-attribute { color: #22863a; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: bold; }
    `,
    'github-dark': `
      .hljs { background: #0d1117; color: #c9d1d9; }
      .hljs-comment, .hljs-quote { color: #8b949e; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #ff7b72; }
      .hljs-function, .hljs-name, .hljs-params, .hljs-attr, .hljs-attribute { color: #d2a8ff; }
      .hljs-string, .hljs-doctag, .hljs-regexp, .hljs-template-tag, .hljs-template-variable { color: #a5d6ff; }
      .hljs-title, .hljs-built_in, .hljs-type, .hljs-class .hljs-title { color: #7ee787; }
      .hljs-number, .hljs-symbol, .hljs-bullet, .hljs-meta, .hljs-selector-attr, .hljs-selector-pseudo { color: #79c0ff; }
      .hljs-variable, .hljs-tag, .hljs-name, .hljs-attribute { color: #7ee787; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: bold; }
    `,
    'monokai': `
      .hljs { background: #272822; color: #f8f8f2; }
      .hljs-comment, .hljs-quote { color: #75715e; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #f92672; }
      .hljs-function, .hljs-name, .hljs-params { color: #a6e22e; }
      .hljs-string, .hljs-doctag, .hljs-regexp { color: #e6db74; }
      .hljs-title, .hljs-built_in, .hljs-type, .hljs-class .hljs-title { color: #a6e22e; }
      .hljs-number, .hljs-symbol, .hljs-bullet, .hljs-meta { color: #ae81ff; }
      .hljs-variable, .hljs-tag, .hljs-name, .hljs-attribute { color: #f8f8f2; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: bold; }
    `,
    'dracula': `
      .hljs { background: #282a36; color: #f8f8f2; }
      .hljs-comment, .hljs-quote { color: #6272a4; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #ff79c6; }
      .hljs-function, .hljs-name, .hljs-params { color: #50fa7b; }
      .hljs-string, .hljs-doctag, .hljs-regexp { color: #f1fa8c; }
      .hljs-title, .hljs-built_in, .hljs-type, .hljs-class .hljs-title { color: #50fa7b; }
      .hljs-number, .hljs-symbol, .hljs-bullet, .hljs-meta { color: #bd93f9; }
      .hljs-variable, .hljs-tag, .hljs-name, .hljs-attribute { color: #8be9fd; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: bold; }
    `,
    'atom-one-dark': `
      .hljs { background: #282c34; color: #abb2bf; }
      .hljs-comment, .hljs-quote { color: #5c6370; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #c678dd; }
      .hljs-function, .hljs-name, .hljs-params { color: #61afef; }
      .hljs-string, .hljs-doctag, .hljs-regexp { color: #98c379; }
      .hljs-title, .hljs-built_in, .hljs-type, .hljs-class .hljs-title { color: #e5c07b; }
      .hljs-number, .hljs-symbol, .hljs-bullet, .hljs-meta { color: #d19a66; }
      .hljs-variable, .hljs-tag, .hljs-name, .hljs-attribute { color: #e06c75; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: bold; }
    `,
    'atom-one-light': `
      .hljs { background: #fafafa; color: #383a42; }
      .hljs-comment, .hljs-quote { color: #a0a1a7; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #a626a4; }
      .hljs-function, .hljs-name, .hljs-params { color: #4078f2; }
      .hljs-string, .hljs-doctag, .hljs-regexp { color: #50a14f; }
      .hljs-title, .hljs-built_in, .hljs-type, .hljs-class .hljs-title { color: #c18401; }
      .hljs-number, .hljs-symbol, .hljs-bullet, .hljs-meta { color: #986801; }
      .hljs-variable, .hljs-tag, .hljs-name, .hljs-attribute { color: #e45649; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: bold; }
    `,
    'vs2015': `
      .hljs { background: #1e1e1e; color: #dcdcdc; }
      .hljs-comment, .hljs-quote { color: #57a64a; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #569cd6; }
      .hljs-function, .hljs-name, .hljs-params { color: #dcdcaa; }
      .hljs-string, .hljs-doctag, .hljs-regexp { color: #ce9178; }
      .hljs-title, .hljs-built_in, .hljs-type, .hljs-class .hljs-title { color: #4ec9b0; }
      .hljs-number, .hljs-symbol, .hljs-bullet, .hljs-meta { color: #b5cea8; }
      .hljs-variable, .hljs-tag, .hljs-name, .hljs-attribute { color: #9cdcfe; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: bold; }
    `,
    'solarized-dark': `
      .hljs { background: #002b36; color: #839496; }
      .hljs-comment, .hljs-quote { color: #586e75; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #859900; }
      .hljs-function, .hljs-name, .hljs-params { color: #268bd2; }
      .hljs-string, .hljs-doctag, .hljs-regexp { color: #2aa198; }
      .hljs-title, .hljs-built_in, .hljs-type, .hljs-class .hljs-title { color: #b58900; }
      .hljs-number, .hljs-symbol, .hljs-bullet, .hljs-meta { color: #d33682; }
      .hljs-variable, .hljs-tag, .hljs-name, .hljs-attribute { color: #cb4b16; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: bold; }
    `,
    'solarized-light': `
      .hljs { background: #fdf6e3; color: #657b83; }
      .hljs-comment, .hljs-quote { color: #93a1a1; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #859900; }
      .hljs-function, .hljs-name, .hljs-params { color: #268bd2; }
      .hljs-string, .hljs-doctag, .hljs-regexp { color: #2aa198; }
      .hljs-title, .hljs-built_in, .hljs-type, .hljs-class .hljs-title { color: #b58900; }
      .hljs-number, .hljs-symbol, .hljs-bullet, .hljs-meta { color: #d33682; }
      .hljs-variable, .hljs-tag, .hljs-name, .hljs-attribute { color: #cb4b16; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: bold; }
    `,
    'nord': `
      .hljs { background: #2e3440; color: #d8dee9; }
      .hljs-comment, .hljs-quote { color: #4c566a; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #5e81ac; }
      .hljs-function, .hljs-name, .hljs-params { color: #88c0d0; }
      .hljs-string, .hljs-doctag, .hljs-regexp { color: #a3be8c; }
      .hljs-title, .hljs-built_in, .hljs-type, .hljs-class .hljs-title { color: #8fbcbb; }
      .hljs-number, .hljs-symbol, .hljs-bullet, .hljs-meta { color: #b48ead; }
      .hljs-variable, .hljs-tag, .hljs-name, .hljs-attribute { color: #bf616a; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: bold; }
    `
  }

  return baseStyles + (themes[theme] || themes['github'])
}

const loadExample = () => {
  const examples: Record<string, string> = {
    javascript: `// JavaScript 示例：快速排序算法
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 使用示例
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log('排序前:', numbers);
console.log('排序后:', quickSort(numbers));`,
    python: `# Python 示例：斐波那契数列
def fibonacci(n):
    """生成斐波那契数列"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

# 打印前10个斐波那契数
print("前10个斐波那契数:", fibonacci(10))`,
    typescript: `// TypeScript 示例：用户管理类
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

class UserManager {
  private users: Map<number, User> = new Map();

  addUser(user: User): void {
    this.users.set(user.id, user);
    console.log(\`用户 \${user.name} 添加成功\`);
  }

  getUser(id: number): User | undefined {
    return this.users.get(id);
  }

  getUsersByRole(role: User['role']): User[] {
    return Array.from(this.users.values())
      .filter(u => u.role === role);
  }
}

const manager = new UserManager();
manager.addUser({ id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' });`
  }

  selectedLanguage.value = 'javascript'
  sourceCode.value = examples.javascript
  applyHighlight()
  ElMessage.success('已加载示例代码')
}

const clearCode = () => {
  sourceCode.value = ''
  highlightedCode.value = ''
  detectedLanguage.value = ''
  ElMessage.success('已清空代码')
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      sourceCode.value += text
      ElMessage.success('已从剪贴板粘贴')
      autoHighlightIfEnabled()
    } else {
      ElMessage.warning('剪贴板为空')
    }
  } catch (e) {
    ElMessage.error('无法访问剪贴板，请手动粘贴')
  }
}

const copyHighlightedHtml = async () => {
  if (!highlightedCode.value) {
    ElMessage.warning('请先应用高亮')
    return
  }
  try {
    await navigator.clipboard.writeText(fullHtmlOutput.value)
    ElMessage.success('已复制带样式的 HTML')
  } catch {
    ElMessage.error('复制失败')
  }
}

const copyHighlightedCode = async () => {
  if (!sourceCode.value) {
    ElMessage.warning('请先输入代码')
    return
  }
  try {
    await navigator.clipboard.writeText(sourceCode.value)
    ElMessage.success('已复制原始代码')
  } catch {
    ElMessage.error('复制失败')
  }
}

const downloadAsHtml = () => {
  if (!highlightedCode.value) {
    ElMessage.warning('请先应用高亮')
    return
  }
  const blob = new Blob([fullHtmlOutput.value], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `highlighted-code-${Date.now()}.html`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('HTML 文件已下载')
}

const copyFullHtml = async () => {
  if (!fullHtmlOutput.value) {
    ElMessage.warning('请先应用高亮')
    return
  }
  try {
    await navigator.clipboard.writeText(fullHtmlOutput.value)
    ElMessage.success('已复制完整 HTML')
  } catch {
    ElMessage.error('复制失败')
  }
}

const downloadFullHtml = () => {
  downloadAsHtml()
}

const copyHtmlFragment = async () => {
  if (!htmlFragmentOutput.value) {
    ElMessage.warning('请先应用高亮')
    return
  }
  try {
    await navigator.clipboard.writeText(htmlFragmentOutput.value)
    ElMessage.success('已复制 HTML 片段')
  } catch {
    ElMessage.error('复制失败')
  }
}

const copyMarkdown = async () => {
  if (!markdownOutput.value) {
    ElMessage.warning('请先输入代码')
    return
  }
  try {
    await navigator.clipboard.writeText(markdownOutput.value)
    ElMessage.success('已复制 Markdown')
  } catch {
    ElMessage.error('复制失败')
  }
}

watch([selectedTheme, showLineNumbers], () => {
  if (highlightedCode.value) {
    applyHighlight()
  }
})

onMounted(() => {
  loadExample()
})
</script>

<style scoped>
.code-highlighter {
  max-width: 1400px;
  margin: 0 auto;
}

.guide-card,
.scene-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.main-card {
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

.scene-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.scene-tags .el-tag {
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.toolbar-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.editor-container {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.editor-panel,
.result-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.editor-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.code-editor :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
  font-family: 'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace;
  background: #fafafa;
}

.highlight-preview {
  position: relative;
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
}

.language-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  background: rgba(22, 93, 255, 0.9);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  z-index: 10;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.code-block {
  margin: 0;
  padding: 20px;
  font-family: 'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow-x: auto;
}

.code-block.placeholder code {
  color: #909399;
  font-style: italic;
}

.theme-github .code-block {
  background: #ffffff;
  color: #24292e;
}

.theme-github-dark .code-block {
  background: #0d1117;
  color: #c9d1d9;
}

.theme-monokai .code-block {
  background: #272822;
  color: #f8f8f2;
}

.theme-dracula .code-block {
  background: #282a36;
  color: #f8f8f2;
}

.theme-atom-one-dark .code-block {
  background: #282c34;
  color: #abb2bf;
}

.theme-atom-one-light .code-block {
  background: #fafafa;
  color: #383a42;
}

.theme-vs2015 .code-block {
  background: #1e1e1e;
  color: #dcdcdc;
}

.theme-solarized-dark .code-block {
  background: #002b36;
  color: #839496;
}

.theme-solarized-light .code-block {
  background: #fdf6e3;
  color: #657b83;
}

.theme-nord .code-block {
  background: #2e3440;
  color: #d8dee9;
}

.highlight-preview :deep(.hljs) {
  background: transparent;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.highlight-preview :deep(.line-number) {
  display: inline-block;
  width: 3em;
  padding-right: 1em;
  margin-right: 1em;
  text-align: right;
  color: #858585;
  border-right: 1px solid #e0e0e0;
  user-select: none;
  opacity: 0.7;
}

.theme-github-dark :deep(.line-number),
.theme-monokai :deep(.line-number),
.theme-dracula :deep(.line-number),
.theme-atom-one-dark :deep(.line-number),
.theme-vs2015 :deep(.line-number),
.theme-solarized-dark :deep(.line-number),
.theme-nord :deep(.line-number) {
  border-right-color: #444;
  color: #666;
}

.highlight-preview :deep(.line-content) {
  display: inline;
}

.highlight-preview :deep(.hljs-comment),
.highlight-preview :deep(.hljs-quote) { color: #6a737d; font-style: italic; }
.highlight-preview :deep(.hljs-keyword),
.highlight-preview :deep(.hljs-selector-tag),
.highlight-preview :deep(.hljs-literal),
.highlight-preview :deep(.hljs-section),
.highlight-preview :deep(.hljs-link) { color: #d73a49; }
.highlight-preview :deep(.hljs-function),
.highlight-preview :deep(.hljs-name),
.highlight-preview :deep(.hljs-params) { color: #6f42c1; }
.highlight-preview :deep(.hljs-string),
.highlight-preview :deep(.hljs-doctag),
.highlight-preview :deep(.hljs-regexp),
.highlight-preview :deep(.hljs-template-tag),
.highlight-preview :deep(.hljs-template-variable) { color: #032f62; }
.highlight-preview :deep(.hljs-title),
.highlight-preview :deep(.hljs-built_in),
.highlight-preview :deep(.hljs-type),
.highlight-preview :deep(.hljs-class .hljs-title) { color: #22863a; }
.highlight-preview :deep(.hljs-number),
.highlight-preview :deep(.hljs-symbol),
.highlight-preview :deep(.hljs-bullet),
.highlight-preview :deep(.hljs-meta),
.highlight-preview :deep(.hljs-selector-attr),
.highlight-preview :deep(.hljs-selector-pseudo) { color: #005cc5; }
.highlight-preview :deep(.hljs-variable),
.highlight-preview :deep(.hljs-tag),
.highlight-preview :deep(.hljs-name),
.highlight-preview :deep(.hljs-attribute) { color: #22863a; }
.highlight-preview :deep(.hljs-emphasis) { font-style: italic; }
.highlight-preview :deep(.hljs-strong) { font-weight: bold; }

.theme-github-dark :deep(.hljs-comment),
.theme-github-dark :deep(.hljs-quote) { color: #8b949e; }
.theme-github-dark :deep(.hljs-keyword),
.theme-github-dark :deep(.hljs-selector-tag),
.theme-github-dark :deep(.hljs-literal),
.theme-github-dark :deep(.hljs-section),
.theme-github-dark :deep(.hljs-link) { color: #ff7b72; }
.theme-github-dark :deep(.hljs-function),
.theme-github-dark :deep(.hljs-name),
.theme-github-dark :deep(.hljs-params) { color: #d2a8ff; }
.theme-github-dark :deep(.hljs-string),
.theme-github-dark :deep(.hljs-doctag),
.theme-github-dark :deep(.hljs-regexp) { color: #a5d6ff; }
.theme-github-dark :deep(.hljs-title),
.theme-github-dark :deep(.hljs-built_in),
.theme-github-dark :deep(.hljs-type),
.theme-github-dark :deep(.hljs-class .hljs-title) { color: #7ee787; }
.theme-github-dark :deep(.hljs-number),
.theme-github-dark :deep(.hljs-symbol),
.theme-github-dark :deep(.hljs-bullet),
.theme-github-dark :deep(.hljs-meta) { color: #79c0ff; }
.theme-github-dark :deep(.hljs-variable),
.theme-github-dark :deep(.hljs-tag) { color: #7ee787; }

.theme-monokai :deep(.hljs-comment),
.theme-monokai :deep(.hljs-quote) { color: #75715e; }
.theme-monokai :deep(.hljs-keyword),
.theme-monokai :deep(.hljs-selector-tag),
.theme-monokai :deep(.hljs-literal),
.theme-monokai :deep(.hljs-section),
.theme-monokai :deep(.hljs-link) { color: #f92672; }
.theme-monokai :deep(.hljs-function),
.theme-monokai :deep(.hljs-name),
.theme-monokai :deep(.hljs-params) { color: #a6e22e; }
.theme-monokai :deep(.hljs-string),
.theme-monokai :deep(.hljs-doctag),
.theme-monokai :deep(.hljs-regexp) { color: #e6db74; }
.theme-monokai :deep(.hljs-title),
.theme-monokai :deep(.hljs-built_in),
.theme-monokai :deep(.hljs-type),
.theme-monokai :deep(.hljs-class .hljs-title) { color: #a6e22e; }
.theme-monokai :deep(.hljs-number),
.theme-monokai :deep(.hljs-symbol),
.theme-monokai :deep(.hljs-bullet),
.theme-monokai :deep(.hljs-meta) { color: #ae81ff; }

.theme-dracula :deep(.hljs-comment),
.theme-dracula :deep(.hljs-quote) { color: #6272a4; }
.theme-dracula :deep(.hljs-keyword),
.theme-dracula :deep(.hljs-selector-tag),
.theme-dracula :deep(.hljs-literal),
.theme-dracula :deep(.hljs-section),
.theme-dracula :deep(.hljs-link) { color: #ff79c6; }
.theme-dracula :deep(.hljs-function),
.theme-dracula :deep(.hljs-name),
.theme-dracula :deep(.hljs-params) { color: #50fa7b; }
.theme-dracula :deep(.hljs-string),
.theme-dracula :deep(.hljs-doctag),
.theme-dracula :deep(.hljs-regexp) { color: #f1fa8c; }
.theme-dracula :deep(.hljs-title),
.theme-dracula :deep(.hljs-built_in),
.theme-dracula :deep(.hljs-type),
.theme-dracula :deep(.hljs-class .hljs-title) { color: #50fa7b; }
.theme-dracula :deep(.hljs-number),
.theme-dracula :deep(.hljs-symbol),
.theme-dracula :deep(.hljs-bullet),
.theme-dracula :deep(.hljs-meta) { color: #bd93f9; }

.theme-atom-one-dark :deep(.hljs-comment),
.theme-atom-one-dark :deep(.hljs-quote) { color: #5c6370; }
.theme-atom-one-dark :deep(.hljs-keyword),
.theme-atom-one-dark :deep(.hljs-selector-tag),
.theme-atom-one-dark :deep(.hljs-literal),
.theme-atom-one-dark :deep(.hljs-section),
.theme-atom-one-dark :deep(.hljs-link) { color: #c678dd; }
.theme-atom-one-dark :deep(.hljs-function),
.theme-atom-one-dark :deep(.hljs-name),
.theme-atom-one-dark :deep(.hljs-params) { color: #61afef; }
.theme-atom-one-dark :deep(.hljs-string),
.theme-atom-one-dark :deep(.hljs-doctag),
.theme-atom-one-dark :deep(.hljs-regexp) { color: #98c379; }
.theme-atom-one-dark :deep(.hljs-title),
.theme-atom-one-dark :deep(.hljs-built_in),
.theme-atom-one-dark :deep(.hljs-type),
.theme-atom-one-dark :deep(.hljs-class .hljs-title) { color: #e5c07b; }
.theme-atom-one-dark :deep(.hljs-number),
.theme-atom-one-dark :deep(.hljs-symbol),
.theme-atom-one-dark :deep(.hljs-bullet),
.theme-atom-one-dark :deep(.hljs-meta) { color: #d19a66; }

.theme-atom-one-light :deep(.hljs-comment),
.theme-atom-one-light :deep(.hljs-quote) { color: #a0a1a7; }
.theme-atom-one-light :deep(.hljs-keyword),
.theme-atom-one-light :deep(.hljs-selector-tag),
.theme-atom-one-light :deep(.hljs-literal),
.theme-atom-one-light :deep(.hljs-section),
.theme-atom-one-light :deep(.hljs-link) { color: #a626a4; }
.theme-atom-one-light :deep(.hljs-function),
.theme-atom-one-light :deep(.hljs-name),
.theme-atom-one-light :deep(.hljs-params) { color: #4078f2; }
.theme-atom-one-light :deep(.hljs-string),
.theme-atom-one-light :deep(.hljs-doctag),
.theme-atom-one-light :deep(.hljs-regexp) { color: #50a14f; }
.theme-atom-one-light :deep(.hljs-title),
.theme-atom-one-light :deep(.hljs-built_in),
.theme-atom-one-light :deep(.hljs-type),
.theme-atom-one-light :deep(.hljs-class .hljs-title) { color: #c18401; }
.theme-atom-one-light :deep(.hljs-number),
.theme-atom-one-light :deep(.hljs-symbol),
.theme-atom-one-light :deep(.hljs-bullet),
.theme-atom-one-light :deep(.hljs-meta) { color: #986801; }

.theme-vs2015 :deep(.hljs-comment),
.theme-vs2015 :deep(.hljs-quote) { color: #57a64a; }
.theme-vs2015 :deep(.hljs-keyword),
.theme-vs2015 :deep(.hljs-selector-tag),
.theme-vs2015 :deep(.hljs-literal),
.theme-vs2015 :deep(.hljs-section),
.theme-vs2015 :deep(.hljs-link) { color: #569cd6; }
.theme-vs2015 :deep(.hljs-function),
.theme-vs2015 :deep(.hljs-name),
.theme-vs2015 :deep(.hljs-params) { color: #dcdcaa; }
.theme-vs2015 :deep(.hljs-string),
.theme-vs2015 :deep(.hljs-doctag),
.theme-vs2015 :deep(.hljs-regexp) { color: #ce9178; }
.theme-vs2015 :deep(.hljs-title),
.theme-vs2015 :deep(.hljs-built_in),
.theme-vs2015 :deep(.hljs-type),
.theme-vs2015 :deep(.hljs-class .hljs-title) { color: #4ec9b0; }
.theme-vs2015 :deep(.hljs-number),
.theme-vs2015 :deep(.hljs-symbol),
.theme-vs2015 :deep(.hljs-bullet),
.theme-vs2015 :deep(.hljs-meta) { color: #b5cea8; }

.theme-solarized-dark :deep(.hljs-comment),
.theme-solarized-dark :deep(.hljs-quote) { color: #586e75; }
.theme-solarized-dark :deep(.hljs-keyword),
.theme-solarized-dark :deep(.hljs-selector-tag),
.theme-solarized-dark :deep(.hljs-literal),
.theme-solarized-dark :deep(.hljs-section),
.theme-solarized-dark :deep(.hljs-link) { color: #859900; }
.theme-solarized-dark :deep(.hljs-function),
.theme-solarized-dark :deep(.hljs-name),
.theme-solarized-dark :deep(.hljs-params) { color: #268bd2; }
.theme-solarized-dark :deep(.hljs-string),
.theme-solarized-dark :deep(.hljs-doctag),
.theme-solarized-dark :deep(.hljs-regexp) { color: #2aa198; }
.theme-solarized-dark :deep(.hljs-title),
.theme-solarized-dark :deep(.hljs-built_in),
.theme-solarized-dark :deep(.hljs-type),
.theme-solarized-dark :deep(.hljs-class .hljs-title) { color: #b58900; }
.theme-solarized-dark :deep(.hljs-number),
.theme-solarized-dark :deep(.hljs-symbol),
.theme-solarized-dark :deep(.hljs-bullet),
.theme-solarized-dark :deep(.hljs-meta) { color: #d33682; }

.theme-solarized-light :deep(.hljs-comment),
.theme-solarized-light :deep(.hljs-quote) { color: #93a1a1; }
.theme-solarized-light :deep(.hljs-keyword),
.theme-solarized-light :deep(.hljs-selector-tag),
.theme-solarized-light :deep(.hljs-literal),
.theme-solarized-light :deep(.hljs-section),
.theme-solarized-light :deep(.hljs-link) { color: #859900; }
.theme-solarized-light :deep(.hljs-function),
.theme-solarized-light :deep(.hljs-name),
.theme-solarized-light :deep(.hljs-params) { color: #268bd2; }
.theme-solarized-light :deep(.hljs-string),
.theme-solarized-light :deep(.hljs-doctag),
.theme-solarized-light :deep(.hljs-regexp) { color: #2aa198; }
.theme-solarized-light :deep(.hljs-title),
.theme-solarized-light :deep(.hljs-built_in),
.theme-solarized-light :deep(.hljs-type),
.theme-solarized-light :deep(.hljs-class .hljs-title) { color: #b58900; }
.theme-solarized-light :deep(.hljs-number),
.theme-solarized-light :deep(.hljs-symbol),
.theme-solarized-light :deep(.hljs-bullet),
.theme-solarized-light :deep(.hljs-meta) { color: #d33682; }

.theme-nord :deep(.hljs-comment),
.theme-nord :deep(.hljs-quote) { color: #4c566a; }
.theme-nord :deep(.hljs-keyword),
.theme-nord :deep(.hljs-selector-tag),
.theme-nord :deep(.hljs-literal),
.theme-nord :deep(.hljs-section),
.theme-nord :deep(.hljs-link) { color: #5e81ac; }
.theme-nord :deep(.hljs-function),
.theme-nord :deep(.hljs-name),
.theme-nord :deep(.hljs-params) { color: #88c0d0; }
.theme-nord :deep(.hljs-string),
.theme-nord :deep(.hljs-doctag),
.theme-nord :deep(.hljs-regexp) { color: #a3be8c; }
.theme-nord :deep(.hljs-title),
.theme-nord :deep(.hljs-built_in),
.theme-nord :deep(.hljs-type),
.theme-nord :deep(.hljs-class .hljs-title) { color: #8fbcbb; }
.theme-nord :deep(.hljs-number),
.theme-nord :deep(.hljs-symbol),
.theme-nord :deep(.hljs-bullet),
.theme-nord :deep(.hljs-meta) { color: #b48ead; }

.output-section {
  margin-top: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.tab-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.output-textarea :deep(.el-textarea__inner) {
  font-family: 'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  background: #fafafa;
}

@media (max-width: 992px) {
  .editor-container {
    flex-direction: column;
  }
}
</style>
