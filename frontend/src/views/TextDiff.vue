<template>
  <div class="text-diff">
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
        <el-step title="输入文本" description="在左右两个编辑区分别粘贴或输入需要对比的文本" />
        <el-step title="开始比对" description="点击「开始比对」按钮或自动进行实时比对" />
        <el-step title="查看差异" description="高亮显示新增、删除、修改的内容，快速定位差异" />
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
        <el-tag type="primary" effect="plain">代码审查 - 对比版本差异</el-tag>
        <el-tag type="success" effect="plain">合同修订 - 追踪条款变更</el-tag>
        <el-tag type="warning" effect="plain">配置对比 - 检查配置文件差异</el-tag>
        <el-tag type="info" effect="plain">文档审核 - 快速定位内容修改</el-tag>
        <el-tag type="danger" effect="plain">合规检查 - 验证内容一致性</el-tag>
      </div>
    </el-card>

    <el-card class="limit-card" v-if="showLimitWarning">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <Warning />
          </el-icon>
          <span>性能提示</span>
        </div>
      </template>
      <el-alert :type="limitAlertType" :closable="false" show-icon>
        <template #title>
          <span>{{ limitAlertTitle }}</span>
        </template>
        <template #default>
          <span>{{ limitAlertMessage }}</span>
        </template>
      </el-alert>
    </el-card>

    <el-card class="diff-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DocumentCopy />
          </el-icon>
          <span>文本差异比对</span>
          <el-tag size="small" type="success" class="header-tag">实时比对</el-tag>
        </div>
      </template>

      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-label">快捷操作：</span>
          <el-button size="small" @click="clearBoth">
            <el-icon><Delete /></el-icon>
            清空全部
          </el-button>
          <el-button size="small" @click="swapTexts">
            <el-icon><Swap /></el-icon>
            交换文本
          </el-button>
          <el-button size="small" @click="loadExample">
            <el-icon><MagicStick /></el-icon>
            加载示例
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-switch
            v-model="autoCompare"
            active-text="自动比对"
            inactive-text="手动比对"
            size="small"
          />
          <el-button
            v-if="!autoCompare"
            type="primary"
            size="small"
            @click="compare"
          >
            <el-icon><Search /></el-icon>
            开始比对
          </el-button>
        </div>
      </div>

      <div class="editor-container">
        <div class="editor-panel">
          <div class="editor-header">
            <span class="editor-title">
              <el-icon color="#f56c6c"><Minus /></el-icon>
              原始文本
            </span>
            <div class="editor-actions">
              <el-button size="small" text @click="pasteLeft">
                <el-icon><Document /></el-icon>
                粘贴
              </el-button>
              <el-tag size="small" type="danger">{{ leftLineCount }} 行</el-tag>
              <el-tag 
                size="small" 
                :type="leftCharCount > MAX_CHARS ? 'danger' : leftCharCount > WARNING_CHARS ? 'warning' : 'info'"
              >
                {{ formatCharCount(leftCharCount) }} / {{ formatCharCount(MAX_CHARS) }}
              </el-tag>
            </div>
          </div>
          <el-input
            v-model="leftText"
            type="textarea"
            :rows="15"
            :placeholder="leftPlaceholder"
            resize="vertical"
            class="text-editor"
            :class="{ 'editor-over-limit': leftCharCount > MAX_CHARS, 'editor-near-limit': leftCharCount > WARNING_CHARS && leftCharCount <= MAX_CHARS }"
            @input="handleLeftInput"
            maxlength="1000000"
          />
          <div class="char-progress">
            <el-progress 
              :percentage="Math.min(100, (leftCharCount / MAX_CHARS) * 100)" 
              :stroke-width="4"
              :color="leftCharCount > MAX_CHARS ? '#f56c6c' : leftCharCount > WARNING_CHARS ? '#e6a23c' : '#67c23a'"
              show-text="false"
            />
          </div>
        </div>

        <div class="editor-divider">
          <el-icon :size="24" color="#909399"><ArrowRight /></el-icon>
        </div>

        <div class="editor-panel">
          <div class="editor-header">
            <span class="editor-title">
              <el-icon color="#67c23a"><Plus /></el-icon>
              新文本
            </span>
            <div class="editor-actions">
              <el-button size="small" text @click="pasteRight">
                <el-icon><Document /></el-icon>
                粘贴
              </el-button>
              <el-tag size="small" type="success">{{ rightLineCount }} 行</el-tag>
              <el-tag 
                size="small" 
                :type="rightCharCount > MAX_CHARS ? 'danger' : rightCharCount > WARNING_CHARS ? 'warning' : 'info'"
              >
                {{ formatCharCount(rightCharCount) }} / {{ formatCharCount(MAX_CHARS) }}
              </el-tag>
            </div>
          </div>
          <el-input
            v-model="rightText"
            type="textarea"
            :rows="15"
            :placeholder="rightPlaceholder"
            resize="vertical"
            class="text-editor"
            :class="{ 'editor-over-limit': rightCharCount > MAX_CHARS, 'editor-near-limit': rightCharCount > WARNING_CHARS && rightCharCount <= MAX_CHARS }"
            @input="handleRightInput"
            maxlength="1000000"
          />
          <div class="char-progress">
            <el-progress 
              :percentage="Math.min(100, (rightCharCount / MAX_CHARS) * 100)" 
              :stroke-width="4"
              :color="rightCharCount > MAX_CHARS ? '#f56c6c' : rightCharCount > WARNING_CHARS ? '#e6a23c' : '#67c23a'"
              show-text="false"
            />
          </div>
        </div>
      </div>

      <el-divider v-if="hasDiff" />

      <div v-if="hasDiff" class="stats-section">
        <div class="stats-header">
          <el-icon :size="18" color="#165DFF"><DataLine /></el-icon>
          <span>比对统计</span>
          <el-tag size="small" type="success">共 {{ diffStats.total }} 处差异</el-tag>
        </div>

        <el-row :gutter="16" class="stats-grid">
          <el-col :span="6">
            <div class="stat-card added">
              <div class="stat-icon">
                <el-icon><Plus /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ diffStats.added }}</div>
                <div class="stat-label">新增内容</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card removed">
              <div class="stat-icon">
                <el-icon><Minus /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ diffStats.removed }}</div>
                <div class="stat-label">删除内容</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card modified">
              <div class="stat-icon">
                <el-icon><Edit /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ diffStats.modified }}</div>
                <div class="stat-label">修改内容</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card unchanged">
              <div class="stat-icon">
                <el-icon><Select /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ diffStats.unchanged }}</div>
                <div class="stat-label">相同内容</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-divider v-if="hasDiff" />

      <div v-if="hasDiff" class="result-section">
        <div class="result-header">
          <el-icon :size="18" color="#165DFF"><View /></el-icon>
          <span>差异详情</span>
          <div class="result-actions">
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button value="split">分栏视图</el-radio-button>
              <el-radio-button value="unified">合并视图</el-radio-button>
            </el-radio-group>
            <el-button size="small" @click="copyDiffResult">
              <el-icon><CopyDocument /></el-icon>
              复制结果
            </el-button>
          </div>
        </div>

        <div v-if="viewMode === 'split'" class="split-view">
          <div class="diff-panel left">
            <div class="diff-panel-header">
              <el-tag size="small" type="danger">原始文本</el-tag>
            </div>
            <div class="diff-content">
              <div
                v-for="(line, index) in leftDiffLines"
                :key="'left-' + index"
                :class="['diff-line', line.type]"
              >
                <span class="line-number">{{ line.lineNum }}</span>
                <span class="line-content" v-html="line.content"></span>
              </div>
            </div>
          </div>
          <div class="diff-panel right">
            <div class="diff-panel-header">
              <el-tag size="small" type="success">新文本</el-tag>
            </div>
            <div class="diff-content">
              <div
                v-for="(line, index) in rightDiffLines"
                :key="'right-' + index"
                :class="['diff-line', line.type]"
              >
                <span class="line-number">{{ line.lineNum }}</span>
                <span class="line-content" v-html="line.content"></span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="unified-view">
          <div class="diff-content">
            <div
              v-for="(line, index) in unifiedDiffLines"
              :key="'unified-' + index"
              :class="['diff-line', line.type]"
            >
              <span class="line-type-icon">
                <el-icon v-if="line.type === 'added'" color="#67c23a"><Plus /></el-icon>
                <el-icon v-else-if="line.type === 'removed'" color="#f56c6c"><Minus /></el-icon>
                <el-icon v-else color="#909399"><Select /></el-icon>
              </span>
              <span class="line-number">{{ line.leftNum || '-' }}</span>
              <span class="line-number">{{ line.rightNum || '-' }}</span>
              <span class="line-content" v-html="line.content"></span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  InfoFilled,
  Suitcase,
  DocumentCopy,
  Delete,
  Swap,
  MagicStick,
  Search,
  Minus,
  Plus,
  Document,
  ArrowRight,
  DataLine,
  Edit,
  Select,
  View,
  CopyDocument,
  Warning
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const MAX_CHARS = 500000
const WARNING_CHARS = 400000
const PERFORMANCE_THRESHOLD = 50000

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'empty'
  lineNum: number | string
  leftNum?: number
  rightNum?: number
  content: string
}

interface DiffStats {
  added: number
  removed: number
  modified: number
  unchanged: number
  total: number
}

const leftText = ref('')
const rightText = ref('')
const autoCompare = ref(true)
const viewMode = ref<'split' | 'unified'>('split')
const diffResult = ref<DiffLine[]>([])
const wasAutoCompare = ref(true)

const leftCharCount = computed(() => leftText.value.length)
const rightCharCount = computed(() => rightText.value.length)
const totalCharCount = computed(() => leftCharCount.value + rightCharCount.value)

const leftLineCount = computed(() => {
  return leftText.value ? leftText.value.split('\n').length : 0
})

const rightLineCount = computed(() => {
  return rightText.value ? rightText.value.split('\n').length : 0
})

const leftPlaceholder = computed(() => {
  if (leftCharCount.value >= MAX_CHARS) {
    return `已达到最大字符限制 ${formatCharCount(MAX_CHARS)}，请精简内容后再输入`
  }
  return '请输入或粘贴原始文本...'
})

const rightPlaceholder = computed(() => {
  if (rightCharCount.value >= MAX_CHARS) {
    return `已达到最大字符限制 ${formatCharCount(MAX_CHARS)}，请精简内容后再输入`
  }
  return '请输入或粘贴新文本...'
})

const showLimitWarning = computed(() => {
  return totalCharCount.value > PERFORMANCE_THRESHOLD
})

const limitAlertType = computed(() => {
  if (leftCharCount.value > MAX_CHARS || rightCharCount.value > MAX_CHARS) {
    return 'error'
  }
  if (totalCharCount.value > 200000) {
    return 'warning'
  }
  return 'info'
})

const limitAlertTitle = computed(() => {
  if (leftCharCount.value > MAX_CHARS || rightCharCount.value > MAX_CHARS) {
    return '已超出最大字符限制'
  }
  if (!autoCompare.value && totalCharCount.value > PERFORMANCE_THRESHOLD) {
    return '大文本处理模式'
  }
  return '性能优化提示'
})

const limitAlertMessage = computed(() => {
  if (leftCharCount.value > MAX_CHARS || rightCharCount.value > MAX_CHARS) {
    return `单篇文本最大支持 ${formatCharCount(MAX_CHARS)} 字符，超出部分可能无法正常比对。建议精简内容后再使用。`
  }
  if (totalCharCount.value > 200000) {
    return `当前文本量较大（共 ${formatCharCount(totalCharCount.value)} 字符），比对可能需要较长时间。已自动切换为手动比对模式，编辑完成后请点击「开始比对」按钮。`
  }
  if (totalCharCount.value > PERFORMANCE_THRESHOLD) {
    return `当前文本量为 ${formatCharCount(totalCharCount.value)} 字符，比对性能可能受影响。如需提升响应速度，建议精简内容。`
  }
  return `当前文本量为 ${formatCharCount(totalCharCount.value)} 字符，比对性能良好。`
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

const hasDiff = computed(() => {
  return diffResult.value.length > 0 && (leftText.value || rightText.value)
})

const diffStats = computed<DiffStats>(() => {
  let added = 0
  let removed = 0
  let unchanged = 0

  diffResult.value.forEach(line => {
    if (line.type === 'added') added++
    else if (line.type === 'removed') removed++
    else if (line.type === 'unchanged') unchanged++
  })

  const modified = Math.min(added, removed)
  const total = added + removed

  return { added, removed, modified, unchanged, total }
})

const leftDiffLines = computed<DiffLine[]>(() => {
  const lines: DiffLine[] = []
  let leftNum = 1

  diffResult.value.forEach(line => {
    if (line.type === 'added') {
      lines.push({
        type: 'empty',
        lineNum: '',
        content: ''
      })
    } else {
      lines.push({
        type: line.type,
        lineNum: leftNum++,
        content: line.content
      })
    }
  })

  return lines
})

const rightDiffLines = computed<DiffLine[]>(() => {
  const lines: DiffLine[] = []
  let rightNum = 1

  diffResult.value.forEach(line => {
    if (line.type === 'removed') {
      lines.push({
        type: 'empty',
        lineNum: '',
        content: ''
      })
    } else {
      lines.push({
        type: line.type,
        lineNum: rightNum++,
        content: line.content
      })
    }
  })

  return lines
})

const unifiedDiffLines = computed<DiffLine[]>(() => {
  const lines: DiffLine[] = []
  let leftNum = 1
  let rightNum = 1

  diffResult.value.forEach(line => {
    const newLine: DiffLine = {
      type: line.type,
      lineNum: '',
      content: line.content
    }

    if (line.type === 'removed') {
      newLine.leftNum = leftNum++
      newLine.rightNum = undefined
    } else if (line.type === 'added') {
      newLine.leftNum = undefined
      newLine.rightNum = rightNum++
    } else {
      newLine.leftNum = leftNum++
      newLine.rightNum = rightNum++
    }

    lines.push(newLine)
  })

  return lines
})

const lcs = (arr1: string[], arr2: string[]): number[][] => {
  const m = arr1.length
  const n = arr2.length
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  return dp
}

const backtrack = (dp: number[][], arr1: string[], arr2: string[], i: number, j: number): DiffLine[] => {
  if (i === 0 && j === 0) {
    return []
  }

  if (i === 0) {
    const result = backtrack(dp, arr1, arr2, i, j - 1)
    result.push({
      type: 'added',
      lineNum: j,
      content: escapeHtml(arr2[j - 1])
    })
    return result
  }

  if (j === 0) {
    const result = backtrack(dp, arr1, arr2, i - 1, j)
    result.push({
      type: 'removed',
      lineNum: i,
      content: escapeHtml(arr1[i - 1])
    })
    return result
  }

  if (arr1[i - 1] === arr2[j - 1]) {
    const result = backtrack(dp, arr1, arr2, i - 1, j - 1)
    result.push({
      type: 'unchanged',
      lineNum: i,
      content: escapeHtml(arr1[i - 1])
    })
    return result
  }

  if (dp[i - 1][j] > dp[i][j - 1]) {
    const result = backtrack(dp, arr1, arr2, i - 1, j)
    result.push({
      type: 'removed',
      lineNum: i,
      content: escapeHtml(arr1[i - 1])
    })
    return result
  } else {
    const result = backtrack(dp, arr1, arr2, i, j - 1)
    result.push({
      type: 'added',
      lineNum: j,
      content: escapeHtml(arr2[j - 1])
    })
    return result
  }
}

const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const compare = () => {
  const leftLines = leftText.value.split('\n')
  const rightLines = rightText.value.split('\n')

  if (!leftText.value && !rightText.value) {
    diffResult.value = []
    return
  }

  const totalLines = leftLines.length + rightLines.length
  if (totalLines > 10000) {
    ElMessageBox.confirm(
      `当前文本共 ${totalLines.toLocaleString()} 行，比对可能需要较长时间（预计 ${Math.ceil(totalLines / 1000)} 秒），是否继续？`,
      '大文本比对提示',
      {
        confirmButtonText: '继续比对',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      const dp = lcs(leftLines, rightLines)
      diffResult.value = backtrack(dp, leftLines, rightLines, leftLines.length, rightLines.length)
    }).catch(() => {
    })
  } else {
    const dp = lcs(leftLines, rightLines)
    diffResult.value = backtrack(dp, leftLines, rightLines, leftLines.length, rightLines.length)
  }
}

const handleLeftInput = (value: string) => {
  if (value.length > MAX_CHARS) {
    leftText.value = value.substring(0, MAX_CHARS)
    ElMessage.warning(`已达到最大字符限制 ${formatCharCount(MAX_CHARS)}，超出部分已被截断`)
  }
  checkPerformanceMode()
  if (autoCompare.value) {
    compare()
  }
}

const handleRightInput = (value: string) => {
  if (value.length > MAX_CHARS) {
    rightText.value = value.substring(0, MAX_CHARS)
    ElMessage.warning(`已达到最大字符限制 ${formatCharCount(MAX_CHARS)}，超出部分已被截断`)
  }
  checkPerformanceMode()
  if (autoCompare.value) {
    compare()
  }
}

const checkPerformanceMode = () => {
  if (totalCharCount.value > 200000 && autoCompare.value) {
    wasAutoCompare.value = true
    autoCompare.value = false
  } else if (totalCharCount.value <= 200000 && wasAutoCompare.value && !autoCompare.value) {
    autoCompare.value = true
    wasAutoCompare.value = false
  }
}

const clearBoth = () => {
  leftText.value = ''
  rightText.value = ''
  diffResult.value = []
  ElMessage.success('已清空全部内容')
}

const swapTexts = () => {
  const temp = leftText.value
  leftText.value = rightText.value
  rightText.value = temp
  if (autoCompare.value) {
    compare()
  }
  ElMessage.success('已交换文本')
}

const loadExample = () => {
  leftText.value = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

// 计算两数之和
function sum(a, b) {
  return a + b;
}

const version = "1.0.0";`

  rightText.value = `function greet(name, age) {
  console.log("Hello, " + name);
  console.log("Age: " + age);
  return true;
}

// 计算多数字之和
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

function multiply(a, b) {
  return a * b;
}

const version = "1.1.0";`

  compare()
  ElMessage.success('已加载示例文本')
}

const pasteLeft = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      const newText = leftText.value + text
      if (newText.length > MAX_CHARS) {
        const truncated = newText.substring(0, MAX_CHARS)
        leftText.value = truncated
        ElMessage.warning(`粘贴内容较大，已截断至 ${formatCharCount(MAX_CHARS)} 字符`)
      } else {
        leftText.value = newText
        ElMessage.success('已粘贴到左侧')
      }
      handleLeftInput(leftText.value)
    } else {
      ElMessage.warning('剪贴板为空')
    }
  } catch (e) {
    ElMessage.error('无法访问剪贴板，请手动粘贴')
  }
}

const pasteRight = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      const newText = rightText.value + text
      if (newText.length > MAX_CHARS) {
        const truncated = newText.substring(0, MAX_CHARS)
        rightText.value = truncated
        ElMessage.warning(`粘贴内容较大，已截断至 ${formatCharCount(MAX_CHARS)} 字符`)
      } else {
        rightText.value = newText
        ElMessage.success('已粘贴到右侧')
      }
      handleRightInput(rightText.value)
    } else {
      ElMessage.warning('剪贴板为空')
    }
  } catch (e) {
    ElMessage.error('无法访问剪贴板，请手动粘贴')
  }
}

const copyDiffResult = () => {
  const result = diffResult.value.map(line => {
    const prefix = line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '
    return prefix + line.content.replace(/<[^>]*>/g, '')
  }).join('\n')

  navigator.clipboard.writeText(result).then(() => {
    ElMessage.success('比对结果已复制')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

watch(totalCharCount, (newCount) => {
  if (newCount > PERFORMANCE_THRESHOLD) {
    checkPerformanceMode()
  }
})
</script>

<style scoped>
.text-diff {
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

.diff-card {
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
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.editor-container {
  display: flex;
  gap: 16px;
  align-items: stretch;
}

.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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
}

.editor-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

.text-editor :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
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

.stat-card.added {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-color: #c2e7b0;
}

.stat-card.removed {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border-color: #fbc4c4;
}

.stat-card.modified {
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-color: #f5dab1;
}

.stat-card.unchanged {
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

.stat-card.added .stat-icon {
  background: linear-gradient(135deg, #67c23a, #529e2e);
}

.stat-card.removed .stat-icon {
  background: linear-gradient(135deg, #f56c6c, #dd6161);
}

.stat-card.modified .stat-icon {
  background: linear-gradient(135deg, #e6a23c, #cf9236);
}

.stat-card.unchanged .stat-icon {
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

.result-section {
  margin-top: 24px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.result-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.split-view {
  display: flex;
  gap: 16px;
}

.diff-panel {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}

.diff-panel-header {
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.diff-content {
  max-height: 600px;
  overflow-y: auto;
  background: #fafafa;
}

.unified-view .diff-content {
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.diff-line {
  display: flex;
  align-items: flex-start;
  padding: 4px 12px;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.diff-line.added {
  background: #e6ffed;
}

.diff-line.removed {
  background: #ffeef0;
}

.diff-line.unchanged {
  background: #fff;
}

.diff-line.empty {
  background: #f0f0f0;
  color: transparent;
}

.line-type-icon {
  width: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.line-number {
  width: 50px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 12px;
  color: #909399;
  user-select: none;
  border-right: 1px solid #ebeef5;
  margin-right: 12px;
}

.unified-view .line-number {
  width: 40px;
}

.line-content {
  flex: 1;
  min-width: 0;
}

.diff-line.added .line-content {
  color: #22863a;
}

.diff-line.removed .line-content {
  color: #b31d28;
}

.diff-line.unchanged .line-content {
  color: #303133;
}

.limit-card {
  margin-bottom: 24px;
}

.limit-card :deep(.el-alert) {
  border: none;
}

.char-progress {
  margin-top: 8px;
  padding: 0 2px;
}

.text-editor :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.text-editor.editor-near-limit :deep(.el-textarea__inner) {
  border-color: #e6a23c;
  box-shadow: 0 0 0 2px rgba(230, 162, 60, 0.1);
}

.text-editor.editor-over-limit :deep(.el-textarea__inner) {
  border-color: #f56c6c;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.1);
  background: #fef0f0;
}

.editor-actions .el-tag {
  transition: all 0.3s ease;
}
</style>
