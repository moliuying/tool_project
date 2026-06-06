<template>
  <div class="string-hex-converter">
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
        <el-step title="选择转换方向" description="在顶部选择 Str→Hex 或 Hex→Str" />
        <el-step title="在输入区填写内容" description="输入区始终可编辑，内容不会被覆盖" />
        <el-step title="点击转换按钮" description="转换结果显示在下方只读的输出区" />
        <el-step title="可交换反向转换" description="点击「反向转换」可用输出作为新输入" />
      </el-steps>
      <el-divider />
      <div class="format-rules">
        <h4 class="rules-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          格式说明
        </h4>
        <el-row :gutter="16">
          <el-col :span="12">
            <div class="format-item">
              <div class="format-label">字符串 (Str)</div>
              <div class="format-examples">
                <span class="format-desc">支持任意普通文本，UTF-8 编码</span>
                <code class="format-code">Hello World</code>
                <code class="format-code">你好世界</code>
                <code class="format-code">Hello 你好 123</code>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="format-item">
              <div class="format-label">十六进制 (Hex)</div>
              <div class="format-examples">
                <span class="format-desc">自动识别并去除空格、逗号、0x 等分隔符</span>
                <code class="format-code">48656C6C6F</code>
                <code class="format-code">48 65 6C 6C 6F</code>
                <code class="format-code">0x48, 0x65, 0x6C, 0x6C, 0x6F</code>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="converter-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Switch />
          </el-icon>
          <span>字符串与十六进制互转</span>
          <el-tag size="small" type="info" class="header-tag">输入区永不被覆盖</el-tag>
        </div>
      </template>

      <div class="converter-body">
        <el-tabs v-model="convertDirection" class="direction-tabs" type="card" size="large">
          <el-tab-pane label="字符串 → 十六进制" name="string-to-hex">
            <template #label>
              <span class="tab-label">
                <el-tag type="primary" size="small" effect="dark" class="tab-tag">Str</el-tag>
                <el-icon><Right /></el-icon>
                <el-tag type="success" size="small" effect="dark" class="tab-tag">Hex</el-tag>
              </span>
            </template>
          </el-tab-pane>
          <el-tab-pane label="十六进制 → 字符串" name="hex-to-string">
            <template #label>
              <span class="tab-label">
                <el-tag type="success" size="small" effect="dark" class="tab-tag">Hex</el-tag>
                <el-icon><Right /></el-icon>
                <el-tag type="primary" size="small" effect="dark" class="tab-tag">Str</el-tag>
              </span>
            </template>
          </el-tab-pane>
        </el-tabs>

        <div v-if="convertDirection === 'string-to-hex'" class="converter-options">
          <div class="option-group">
            <span class="option-label">分隔符：</span>
            <el-radio-group v-model="separator" size="small">
              <el-radio-button value="">无</el-radio-button>
              <el-radio-button value=" ">空格</el-radio-button>
              <el-radio-button value=",">逗号</el-radio-button>
              <el-radio-button value="\n">换行</el-radio-button>
            </el-radio-group>
          </div>
          <div class="option-group">
            <span class="option-label">大小写：</span>
            <el-radio-group v-model="hexCase" size="small">
              <el-radio-button value="lower">小写</el-radio-button>
              <el-radio-button value="upper">大写</el-radio-button>
            </el-radio-group>
          </div>
          <div class="option-group">
            <el-checkbox v-model="add0xPrefix">0x 前缀</el-checkbox>
          </div>
        </div>

        <div class="io-stack">
          <div class="io-pane input-pane">
            <div class="io-header">
              <div class="io-title-wrap">
                <el-tag :type="convertDirection === 'string-to-hex' ? 'primary' : 'success'" size="large" effect="dark" class="io-tag">
                  {{ convertDirection === 'string-to-hex' ? 'Str' : 'Hex' }}
                </el-tag>
                <span class="io-title">
                  {{ convertDirection === 'string-to-hex' ? '字符串输入' : '十六进制输入' }}
                </span>
                <el-tag size="small" type="warning" effect="light" class="mode-tag">可编辑</el-tag>
              </div>
              <div class="io-actions">
                <el-tooltip content="撤销" placement="top">
                  <el-button size="small" text @click="undoInput" :disabled="!canUndoInput">
                    <el-icon><RefreshLeft /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="粘贴" placement="top">
                  <el-button size="small" text @click="pasteToInput">
                    <el-icon><DocumentCopy /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="清空" placement="top">
                  <el-button size="small" text @click="clearInput" :disabled="!inputValue">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <el-input
              v-model="inputValue"
              type="textarea"
              :placeholder="inputPlaceholder"
              :rows="8"
              resize="vertical"
              class="io-textarea input-textarea"
              @input="handleInputChange"
            />
            <div class="io-footer">
              <span class="char-count">{{ inputStats }}</span>
              <el-tag v-if="inputDirty" size="small" type="warning" effect="plain">已编辑未转换</el-tag>
            </div>
          </div>

          <div class="action-row">
            <el-button type="primary" size="large" @click="doConvert" :loading="converting" :disabled="!inputValue.trim()">
              <el-icon><Bottom /></el-icon>
              开始转换
            </el-button>
            <el-tooltip content="用输出区内容作为新输入，反向转换" placement="top">
              <el-button size="large" @click="swapAndConvert" :disabled="!outputValue">
                <el-icon><Refresh /></el-icon>
                反向转换
              </el-button>
            </el-tooltip>
          </div>

          <div class="io-pane output-pane">
            <div class="io-header">
              <div class="io-title-wrap">
                <el-tag :type="convertDirection === 'string-to-hex' ? 'success' : 'primary'" size="large" effect="dark" class="io-tag">
                  {{ convertDirection === 'string-to-hex' ? 'Hex' : 'Str' }}
                </el-tag>
                <span class="io-title">
                  {{ convertDirection === 'string-to-hex' ? '十六进制结果' : '字符串结果' }}
                </span>
                <el-tag size="small" type="info" effect="light" class="mode-tag">只读</el-tag>
              </div>
              <div class="io-actions">
                <el-tooltip content="复制结果" placement="top">
                  <el-button size="small" text @click="copyOutput" :disabled="!outputValue">
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="将结果作为新输入" placement="top">
                  <el-button size="small" text @click="outputToInput" :disabled="!outputValue">
                    <el-icon><Top /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="清空输出" placement="top">
                  <el-button size="small" text @click="clearOutput" :disabled="!outputValue">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <el-input
              v-model="outputValue"
              type="textarea"
              :placeholder="outputPlaceholder"
              :rows="8"
              resize="vertical"
              readonly
              class="io-textarea output-textarea"
            />
            <div class="io-footer">
              <span class="char-count">{{ outputStats }}</span>
              <span v-if="convertError" class="error-text">
                <el-icon color="#f56c6c"><Warning /></el-icon>
                {{ convertError }}
              </span>
            </div>
          </div>
        </div>

        <div class="action-bar">
          <el-button size="large" @click="undoAll" :disabled="!canUndoAll">
            <el-icon><RefreshLeft /></el-icon>
            撤销全部
          </el-button>
          <el-button size="large" @click="clearAll">
            <el-icon><Delete /></el-icon>
            清空全部
          </el-button>
        </div>

        <div class="quick-examples">
          <span class="examples-label">快速示例：</span>
          <el-tag
            v-for="example in quickExamples"
            :key="example.label"
            size="small"
            class="example-tag"
            @click="applyExample(example)"
          >
            {{ example.label }}
          </el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  InfoFilled,
  Warning,
  Switch,
  Right,
  Bottom,
  Top,
  Refresh,
  RefreshLeft,
  Delete,
  DocumentCopy,
  CopyDocument
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

type Direction = 'string-to-hex' | 'hex-to-string'

const convertDirection = ref<Direction>('string-to-hex')
const inputValue = ref('')
const outputValue = ref('')
const separator = ref(' ')
const hexCase = ref<'lower' | 'upper'>('upper')
const add0xPrefix = ref(false)
const converting = ref(false)
const convertError = ref('')
const inputDirty = ref(false)

interface HistoryState {
  direction: Direction
  input: string
  output: string
}
const historyStack = ref<HistoryState[]>([])
const MAX_HISTORY = 50

const quickExamples = [
  { label: 'Hello → Hex', direction: 'string-to-hex' as Direction, input: 'Hello' },
  { label: '你好世界 → Hex', direction: 'string-to-hex' as Direction, input: '你好世界' },
  { label: 'Hello 你好 123 → Hex', direction: 'string-to-hex' as Direction, input: 'Hello 你好 123' },
  { label: '48656C6C6F → Str', direction: 'hex-to-string' as Direction, input: '48656C6C6F' },
  { label: '48 65 6C 6C 6F → Str', direction: 'hex-to-string' as Direction, input: '48 65 6C 6C 6F' },
  { label: 'E4BDA0E5A5BD → Str', direction: 'hex-to-string' as Direction, input: 'E4BDA0E5A5BD' }
]

const inputPlaceholder = computed(() =>
  convertDirection.value === 'string-to-hex'
    ? '在此输入普通字符串，如：Hello World，你好世界...'
    : '在此输入十六进制，如：48656C6C6F 或 48 65 6C 6C 6F...'
)

const outputPlaceholder = computed(() =>
  convertDirection.value === 'string-to-hex'
    ? '转换后的十六进制结果将显示在这里（只读）'
    : '转换后的字符串结果将显示在这里（只读）'
)

const cleanHex = (hex: string): string => {
  return hex.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '')
}

const inputStats = computed(() => {
  if (convertDirection.value === 'string-to-hex') {
    return `字符数: ${inputValue.value.length}`
  }
  const bytes = inputValue.value.trim() ? cleanHex(inputValue.value).length / 2 : 0
  return `字节数: ${bytes}`
})

const outputStats = computed(() => {
  if (convertDirection.value === 'string-to-hex') {
    const bytes = outputValue.value.trim() ? cleanHex(outputValue.value).length / 2 : 0
    return `字节数: ${bytes}`
  }
  return `字符数: ${outputValue.value.length}`
})

const canUndoInput = computed(() => {
  if (historyStack.value.length === 0) return false
  const last = historyStack.value[historyStack.value.length - 1]
  return last.direction === convertDirection.value && last.input !== inputValue.value
})

const canUndoAll = computed(() => historyStack.value.length > 0)

const pushHistory = () => {
  historyStack.value.push({
    direction: convertDirection.value,
    input: inputValue.value,
    output: outputValue.value
  })
  if (historyStack.value.length > MAX_HISTORY) {
    historyStack.value.shift()
  }
}

const handleInputChange = () => {
  inputDirty.value = true
  convertError.value = ''
}

const stringToHex = (str: string): string => {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    let byteStr = bytes[i].toString(16)
    if (byteStr.length === 1) byteStr = '0' + byteStr
    if (hexCase.value === 'upper') byteStr = byteStr.toUpperCase()
    if (add0xPrefix.value) byteStr = '0x' + byteStr
    if (i > 0) hex += separator.value.replace('\\n', '\n')
    hex += byteStr
  }
  return hex
}

const hexToString = (hex: string): string => {
  const clean = cleanHex(hex)
  if (clean.length === 0) return ''
  if (clean.length % 2 !== 0) {
    throw new Error('十六进制长度必须是偶数')
  }
  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    const byteStr = clean.substr(i * 2, 2)
    const byte = parseInt(byteStr, 16)
    if (isNaN(byte)) {
      throw new Error(`无效的十六进制字符: ${byteStr}`)
    }
    bytes[i] = byte
  }
  const decoder = new TextDecoder('utf-8', { fatal: false })
  return decoder.decode(bytes)
}

const doConvert = () => {
  if (!inputValue.value.trim()) {
    ElMessage.warning('请先在输入区填写内容')
    return
  }
  pushHistory()
  converting.value = true
  try {
    if (convertDirection.value === 'string-to-hex') {
      outputValue.value = stringToHex(inputValue.value)
    } else {
      outputValue.value = hexToString(inputValue.value)
    }
    inputDirty.value = false
    convertError.value = ''
    ElMessage.success('转换完成')
  } catch (error: any) {
    convertError.value = error.message || '转换失败'
    outputValue.value = ''
    ElMessage.error(convertError.value)
  } finally {
    converting.value = false
  }
}

const swapAndConvert = () => {
  if (!outputValue.value) return
  pushHistory()
  const oppositeDir: Direction = convertDirection.value === 'string-to-hex' ? 'hex-to-string' : 'string-to-hex'
  convertDirection.value = oppositeDir
  inputValue.value = outputValue.value
  outputValue.value = ''
  inputDirty.value = true
  convertError.value = ''
  setTimeout(() => doConvert(), 50)
}

const outputToInput = () => {
  if (!outputValue.value) return
  pushHistory()
  inputValue.value = outputValue.value
  inputDirty.value = true
  ElMessage.info('已将结果复制到输入区')
}

const undoInput = () => {
  if (historyStack.value.length === 0) return
  const last = historyStack.value.pop()!
  if (last.direction === convertDirection.value) {
    inputValue.value = last.input
    outputValue.value = last.output
  } else {
    inputValue.value = last.input
    outputValue.value = last.output
    convertDirection.value = last.direction
  }
  inputDirty.value = false
  convertError.value = ''
  ElMessage.info('已撤销')
}

const undoAll = () => {
  if (historyStack.value.length === 0) return
  const last = historyStack.value.pop()!
  convertDirection.value = last.direction
  inputValue.value = last.input
  outputValue.value = last.output
  inputDirty.value = false
  convertError.value = ''
  ElMessage.info('已撤销全部')
}

const clearInput = () => {
  if (!inputValue.value) return
  pushHistory()
  inputValue.value = ''
  inputDirty.value = false
  convertError.value = ''
}

const clearOutput = () => {
  if (!outputValue.value) return
  pushHistory()
  outputValue.value = ''
  convertError.value = ''
}

const clearAll = () => {
  if (!inputValue.value && !outputValue.value) return
  pushHistory()
  inputValue.value = ''
  outputValue.value = ''
  inputDirty.value = false
  convertError.value = ''
}

const pasteToInput = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputValue.value = text
    inputDirty.value = true
  } catch {
    ElMessage.error('粘贴失败')
  }
}

const copyOutput = async () => {
  if (!outputValue.value) return
  try {
    await navigator.clipboard.writeText(outputValue.value)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

const applyExample = (example: { direction: Direction; input: string; label: string }) => {
  pushHistory()
  convertDirection.value = example.direction
  inputValue.value = example.input
  outputValue.value = ''
  inputDirty.value = true
  convertError.value = ''
  setTimeout(() => doConvert(), 50)
}

watch([separator, hexCase, add0xPrefix], () => {
  if (convertDirection.value === 'string-to-hex' && inputValue.value.trim() && !inputDirty.value && outputValue.value) {
    outputValue.value = stringToHex(inputValue.value)
  }
})

watch(convertDirection, () => {
  inputDirty.value = false
  convertError.value = ''
})
</script>

<style scoped>
.string-hex-converter {
  max-width: 1000px;
  margin: 0 auto;
}

.guide-card,
.converter-card {
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

.guide-steps {
  padding: 10px 0;
}

.format-rules {
  padding: 0 4px;
}

.rules-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: #303133;
  margin: 0 0 16px;
}

.format-item {
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
  height: 100%;
}

.format-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.format-examples {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.format-desc {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.format-code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #165DFF;
  background: #ecf5ff;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.converter-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.direction-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 600;
  height: 48px;
  padding: 0 24px;
}

.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.tab-tag {
  font-family: 'Monaco', 'Menlo', monospace;
}

.converter-options {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.io-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.io-pane {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s;
}

.input-pane {
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
  border: 2px solid #ffd591;
}

.input-pane:focus-within {
  border-color: #fa8c16;
  box-shadow: 0 0 0 4px rgba(250, 140, 22, 0.1);
}

.output-pane {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  border: 2px solid #b7eb8f;
}

.io-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.io-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.io-tag {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: bold;
}

.io-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.mode-tag {
  font-size: 11px;
  padding: 0 6px;
  height: 20px;
  line-height: 18px;
}

.io-actions {
  display: flex;
  gap: 4px;
}

.io-textarea :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
}

.output-textarea :deep(.el-textarea__inner) {
  background: rgba(255, 255, 255, 0.7);
  cursor: default;
}

.io-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 22px;
}

.char-count {
  font-size: 12px;
  color: #909399;
}

.error-text {
  font-size: 12px;
  color: #f56c6c;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.action-row {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.action-row .el-button {
  font-weight: 600;
  min-width: 140px;
}

.action-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.quick-examples {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%);
  border-radius: 8px;
}

.examples-label {
  font-size: 13px;
  color: #722ed1;
  font-weight: 500;
}

.example-tag {
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
}

.example-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(114, 46, 209, 0.3);
}

@media (max-width: 768px) {
  .action-row {
    flex-direction: column;
  }

  .action-row .el-button {
    width: 100%;
  }
}
</style>
