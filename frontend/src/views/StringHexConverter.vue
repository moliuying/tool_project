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
        <el-step title="选择编辑区" description="在左侧输入字符串，或在右侧输入十六进制" />
        <el-step title="点击转换按钮" description="Str → Hex 或 Hex → Str，结果写入对面区域" />
        <el-step title="查看结果" description="转换结果不会覆盖原始输入区" />
        <el-step title="可撤销操作" description="每次转换都可撤销，恢复之前的内容" />
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
          <el-tag size="small" type="info" class="header-tag">支持 UTF-8 编码 · 可撤销</el-tag>
        </div>
      </template>

      <div class="converter-body">
        <div class="converter-options">
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

        <div class="dual-pane-container">
          <div class="pane string-pane">
            <div class="pane-header">
              <div class="pane-title-wrap">
                <el-tag type="primary" size="large" effect="dark" class="pane-tag">Str</el-tag>
                <span class="pane-title">字符串</span>
              </div>
              <div class="pane-actions">
                <el-tooltip content="撤销" placement="top">
                  <el-button size="small" text @click="undo('string')" :disabled="!canUndo('string')">
                    <el-icon><RefreshLeft /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="粘贴" placement="top">
                  <el-button size="small" text @click="pasteToPane('string')">
                    <el-icon><DocumentCopy /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="复制" placement="top">
                  <el-button size="small" text @click="copyPane('string')" :disabled="!stringValue">
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="清空" placement="top">
                  <el-button size="small" text @click="clearPane('string')" :disabled="!stringValue">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <el-input
              v-model="stringValue"
              type="textarea"
              placeholder="在此输入普通字符串，如：Hello World，你好世界..."
              :rows="10"
              resize="vertical"
              class="pane-textarea string-textarea"
            />
            <div class="pane-footer">
              <span class="char-count">字符数: {{ stringValue.length }}</span>
              <el-tag v-if="stringDirty" size="small" type="warning" effect="light">已编辑</el-tag>
            </div>
          </div>

          <div class="action-column">
            <el-tooltip content="字符串 → 十六进制" placement="top">
              <el-button
                type="primary"
                size="large"
                class="convert-btn"
                @click="convertStringToHex"
                :loading="converting"
              >
                <el-icon><Right /></el-icon>
                <span>Str → Hex</span>
              </el-button>
            </el-tooltip>

            <el-tooltip content="交换两个区域的内容" placement="top">
              <el-button circle size="large" class="swap-btn" @click="swapPanes">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip content="十六进制 → 字符串" placement="top">
              <el-button
                type="success"
                size="large"
                class="convert-btn"
                @click="convertHexToString"
                :loading="converting"
              >
                <span>Hex → Str</span>
                <el-icon><Left /></el-icon>
              </el-button>
            </el-tooltip>
          </div>

          <div class="pane hex-pane">
            <div class="pane-header">
              <div class="pane-title-wrap">
                <el-tag type="success" size="large" effect="dark" class="pane-tag">Hex</el-tag>
                <span class="pane-title">十六进制</span>
              </div>
              <div class="pane-actions">
                <el-tooltip content="撤销" placement="top">
                  <el-button size="small" text @click="undo('hex')" :disabled="!canUndo('hex')">
                    <el-icon><RefreshLeft /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="粘贴" placement="top">
                  <el-button size="small" text @click="pasteToPane('hex')">
                    <el-icon><DocumentCopy /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="复制" placement="top">
                  <el-button size="small" text @click="copyPane('hex')" :disabled="!hexValue">
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="清空" placement="top">
                  <el-button size="small" text @click="clearPane('hex')" :disabled="!hexValue">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <el-input
              v-model="hexValue"
              type="textarea"
              placeholder="在此输入十六进制，如：48656C6C6F 或 48 65 6C 6C 6F..."
              :rows="10"
              resize="vertical"
              class="pane-textarea hex-textarea"
            />
            <div class="pane-footer">
              <span class="char-count">字节数: {{ hexValue.trim() ? cleanHex(hexValue).length / 2 : 0 }}</span>
              <el-tag v-if="hexDirty" size="small" type="warning" effect="light">已编辑</el-tag>
              <span v-if="hexError" class="error-text">
                <el-icon color="#f56c6c"><Warning /></el-icon>
                {{ hexError }}
              </span>
            </div>
          </div>
        </div>

        <div class="action-bar">
          <el-button size="large" @click="undoAll" :disabled="!canUndoAll">
            <el-icon><RefreshLeft /></el-icon>
            全部撤销
          </el-button>
          <el-button size="large" @click="clearAll">
            <el-icon><Delete /></el-icon>
            全部清空
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
  Left,
  Refresh,
  RefreshLeft,
  Delete,
  DocumentCopy,
  CopyDocument
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

type PaneType = 'string' | 'hex'

const stringValue = ref('')
const hexValue = ref('')
const separator = ref(' ')
const hexCase = ref<'lower' | 'upper'>('upper')
const add0xPrefix = ref(false)
const converting = ref(false)
const hexError = ref('')
const stringDirty = ref(false)
const hexDirty = ref(false)

interface HistoryState {
  string: string
  hex: string
}
const historyStack = ref<HistoryState[]>([])
const MAX_HISTORY = 50

const quickExamples = [
  { label: 'Hello → Hex', stringValue: 'Hello', hexValue: '' },
  { label: '你好世界 → Hex', stringValue: '你好世界', hexValue: '' },
  { label: 'Hello 你好 123 → Hex', stringValue: 'Hello 你好 123', hexValue: '' },
  { label: '48656C6C6F → Str', stringValue: '', hexValue: '48656C6C6F' },
  { label: '48 65 6C 6C 6F → Str', stringValue: '', hexValue: '48 65 6C 6C 6F' },
  { label: 'E4BDA0E5A5BD → Str', stringValue: '', hexValue: 'E4BDA0E5A5BD' }
]

const pushHistory = () => {
  historyStack.value.push({
    string: stringValue.value,
    hex: hexValue.value
  })
  if (historyStack.value.length > MAX_HISTORY) {
    historyStack.value.shift()
  }
}

const canUndo = (pane: PaneType): boolean => {
  if (historyStack.value.length === 0) return false
  const last = historyStack.value[historyStack.value.length - 1]
  if (pane === 'string') return last.string !== stringValue.value
  return last.hex !== hexValue.value
}

const canUndoAll = computed(() => historyStack.value.length > 0)

const undo = (pane: PaneType) => {
  if (historyStack.value.length === 0) return
  const last = historyStack.value.pop()!
  if (pane === 'string') {
    stringValue.value = last.string
    stringDirty.value = false
  } else {
    hexValue.value = last.hex
    hexDirty.value = false
    hexError.value = ''
  }
  ElMessage.info('已撤销')
}

const undoAll = () => {
  if (historyStack.value.length === 0) return
  const last = historyStack.value.pop()!
  stringValue.value = last.string
  hexValue.value = last.hex
  stringDirty.value = false
  hexDirty.value = false
  hexError.value = ''
  ElMessage.info('已全部撤销')
}

watch(stringValue, () => {
  stringDirty.value = true
})

watch(hexValue, () => {
  hexDirty.value = true
  hexError.value = ''
})

const cleanHex = (hex: string): string => {
  return hex.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '')
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

const convertStringToHex = () => {
  if (!stringValue.value.trim()) {
    ElMessage.warning('请先在左侧输入字符串')
    return
  }
  pushHistory()
  converting.value = true
  try {
    hexValue.value = stringToHex(stringValue.value)
    hexDirty.value = false
    hexError.value = ''
    ElMessage.success('已转换为十六进制')
  } catch (error: any) {
    ElMessage.error(error.message || '转换失败')
  } finally {
    converting.value = false
  }
}

const convertHexToString = () => {
  if (!hexValue.value.trim()) {
    ElMessage.warning('请先在右侧输入十六进制')
    return
  }
  pushHistory()
  converting.value = true
  try {
    stringValue.value = hexToString(hexValue.value)
    stringDirty.value = false
    hexError.value = ''
    ElMessage.success('已转换为字符串')
  } catch (error: any) {
    hexError.value = error.message || '转换失败'
    ElMessage.error(hexError.value)
  } finally {
    converting.value = false
  }
}

const swapPanes = () => {
  pushHistory()
  const temp = stringValue.value
  stringValue.value = hexValue.value
  hexValue.value = temp
  hexError.value = ''
  ElMessage.info('已交换内容')
}

const clearPane = (pane: PaneType) => {
  pushHistory()
  if (pane === 'string') {
    stringValue.value = ''
    stringDirty.value = false
  } else {
    hexValue.value = ''
    hexDirty.value = false
    hexError.value = ''
  }
}

const clearAll = () => {
  pushHistory()
  stringValue.value = ''
  hexValue.value = ''
  stringDirty.value = false
  hexDirty.value = false
  hexError.value = ''
}

const copyPane = async (pane: PaneType) => {
  const text = pane === 'string' ? stringValue.value : hexValue.value
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

const pasteToPane = async (pane: PaneType) => {
  try {
    const text = await navigator.clipboard.readText()
    if (pane === 'string') {
      stringValue.value = text
    } else {
      hexValue.value = text
    }
  } catch {
    ElMessage.error('粘贴失败')
  }
}

const applyExample = (example: { stringValue: string; hexValue: string; label: string }) => {
  pushHistory()
  stringValue.value = example.stringValue
  hexValue.value = example.hexValue
  stringDirty.value = false
  hexDirty.value = false
  hexError.value = ''
}

watch([separator, hexCase, add0xPrefix], () => {
  if (stringValue.value.trim() && !stringDirty.value && hexValue.value) {
    hexValue.value = stringToHex(stringValue.value)
  }
})
</script>

<style scoped>
.string-hex-converter {
  max-width: 1400px;
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

.dual-pane-container {
  display: grid;
  grid-template-columns: 1fr 120px 1fr;
  gap: 16px;
  align-items: stretch;
}

.pane {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s;
}

.string-pane {
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border: 2px solid #c6e2ff;
}

.string-pane:focus-within {
  border-color: #165DFF;
  box-shadow: 0 0 0 4px rgba(22, 93, 255, 0.1);
}

.hex-pane {
  background: linear-gradient(135deg, #f0fff4 0%, #e6ffed 100%);
  border: 2px solid #b7eb8f;
}

.hex-pane:focus-within {
  border-color: #52c41a;
  box-shadow: 0 0 0 4px rgba(82, 196, 26, 0.1);
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pane-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pane-tag {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: bold;
}

.pane-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.pane-actions {
  display: flex;
  gap: 4px;
}

.pane-textarea :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
}

.string-textarea :deep(.el-textarea__inner):focus {
  background: #fff;
}

.hex-textarea :deep(.el-textarea__inner):focus {
  background: #fff;
}

.pane-footer {
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

.action-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.convert-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.swap-btn {
  background: #f5f7fa;
  border-color: #dcdfe6;
}

.swap-btn:hover {
  background: #e4e7ed;
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
  background: linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%);
  border-radius: 8px;
}

.examples-label {
  font-size: 13px;
  color: #d48806;
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
  box-shadow: 0 2px 8px rgba(212, 136, 6, 0.3);
}

@media (max-width: 992px) {
  .dual-pane-container {
    grid-template-columns: 1fr;
  }

  .action-column {
    flex-direction: row;
  }

  .convert-btn {
    flex: 1;
  }
}
</style>
