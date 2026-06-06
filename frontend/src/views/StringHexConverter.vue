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
        <el-step title="选择转换方向" description="字符串转十六进制 或 十六进制转字符串" />
        <el-step title="输入内容" description="在对应输入框中输入需要转换的文本" />
        <el-step title="点击转换" description="点击按钮即可完成转换" />
        <el-step title="复制结果" description="一键复制转换后的结果" />
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
              <div class="format-label">字符串输入</div>
              <div class="format-examples">
                <span class="format-desc">支持任意普通文本，包括中文、英文、数字、符号等</span>
                <code class="format-code">Hello World</code>
                <code class="format-code">你好世界</code>
                <code class="format-code">Hello 你好 123</code>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="format-item">
              <div class="format-label">十六进制输入</div>
              <div class="format-examples">
                <span class="format-desc">支持多种格式，自动去除空格和分隔符</span>
                <code class="format-code">48656C6C6F</code>
                <code class="format-code">48 65 6C 6C 6F</code>
                <code class="format-code">0x48,0x65,0x6C,0x6C,0x6F</code>
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
          <el-tag size="small" type="info" class="header-tag">支持 UTF-8 编码</el-tag>
        </div>
      </template>

      <div class="converter-body">
        <div class="converter-direction">
          <el-radio-group v-model="convertDirection" size="large" @change="handleDirectionChange">
            <el-radio-button value="string-to-hex">
              <el-icon><Right /></el-icon>
              字符串 → 十六进制
            </el-radio-button>
            <el-radio-button value="hex-to-string">
              <el-icon><Left /></el-icon>
              十六进制 → 字符串
            </el-radio-button>
          </el-radio-group>
          <el-button :icon="Refresh" circle @click="swapDirection" title="交换方向" />
        </div>

        <div class="converter-options">
          <div class="option-group">
            <span class="option-label">分隔符：</span>
            <el-radio-group v-model="separator" size="small" :disabled="convertDirection === 'hex-to-string'">
              <el-radio-button value="">无</el-radio-button>
              <el-radio-button value=" ">空格</el-radio-button>
              <el-radio-button value=",">逗号</el-radio-button>
              <el-radio-button value="\n">换行</el-radio-button>
            </el-radio-group>
          </div>
          <div class="option-group">
            <span class="option-label">大小写：</span>
            <el-radio-group v-model="hexCase" size="small" :disabled="convertDirection === 'hex-to-string'">
              <el-radio-button value="lower">小写</el-radio-button>
              <el-radio-button value="upper">大写</el-radio-button>
            </el-radio-group>
          </div>
          <div class="option-group">
            <el-checkbox v-model="add0xPrefix" :disabled="convertDirection === 'hex-to-string'">
              0x 前缀
            </el-checkbox>
          </div>
        </div>

        <div class="input-output-container">
          <div class="io-section input-section">
            <div class="io-header">
              <span class="io-title">{{ convertDirection === 'string-to-hex' ? '字符串输入' : '十六进制输入' }}</span>
              <div class="io-actions">
                <el-button size="small" text @click="pasteFromClipboard">
                  <el-icon><DocumentCopy /></el-icon>
                  粘贴
                </el-button>
                <el-button size="small" text @click="clearInput">
                  <el-icon><Delete /></el-icon>
                  清空
                </el-button>
              </div>
            </div>
            <el-input
              v-model="inputValue"
              type="textarea"
              :placeholder="convertDirection === 'string-to-hex' ? '请输入要转换的字符串，如：Hello World' : '请输入十六进制，如：48656C6C6F'"
              :rows="8"
              resize="vertical"
              @input="handleAutoConvert"
            />
            <div class="io-footer">
              <span class="char-count">
                {{ convertDirection === 'string-to-hex' ? `字符数: ${inputValue.length}` : `字节数: ${inputValue.trim() ? cleanHex(inputValue).length / 2 : 0}` }}
              </span>
            </div>
          </div>

          <div class="converter-arrow">
            <el-button type="primary" size="large" circle @click="doConvert" :loading="converting">
              <el-icon><Bottom v-if="convertDirection === 'string-to-hex'" /><Top v-else /></el-icon>
            </el-button>
            <span class="arrow-text">转换</span>
          </div>

          <div class="io-section output-section">
            <div class="io-header">
              <span class="io-title">{{ convertDirection === 'string-to-hex' ? '十六进制结果' : '字符串结果' }}</span>
              <div class="io-actions">
                <el-button size="small" text @click="copyResult" :disabled="!outputValue">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
                <el-button size="small" text @click="clearOutput" :disabled="!outputValue">
                  <el-icon><Delete /></el-icon>
                  清空
                </el-button>
              </div>
            </div>
            <el-input
              v-model="outputValue"
              type="textarea"
              :placeholder="convertDirection === 'string-to-hex' ? '转换后的十六进制将显示在这里' : '转换后的字符串将显示在这里'"
              :rows="8"
              resize="vertical"
              readonly
            />
            <div class="io-footer">
              <span class="char-count">
                {{ convertDirection === 'string-to-hex' ? `字节数: ${outputValue.trim() ? cleanHex(outputValue).length / 2 : 0}` : `字符数: ${outputValue.length}` }}
              </span>
              <span v-if="convertError" class="error-text">
                <el-icon color="#f56c6c"><Warning /></el-icon>
                {{ convertError }}
              </span>
            </div>
          </div>
        </div>

        <div class="action-bar">
          <el-button type="primary" size="large" @click="doConvert" :loading="converting">
            <el-icon><Refresh /></el-icon>
            转换
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
import { ref, watch } from 'vue'
import {
  InfoFilled,
  Warning,
  Switch,
  Right,
  Left,
  Refresh,
  Delete,
  DocumentCopy,
  CopyDocument,
  Bottom,
  Top
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const convertDirection = ref<'string-to-hex' | 'hex-to-string'>('string-to-hex')
const separator = ref(' ')
const hexCase = ref<'lower' | 'upper'>('upper')
const add0xPrefix = ref(false)
const inputValue = ref('')
const outputValue = ref('')
const converting = ref(false)
const convertError = ref('')

const quickExamples = [
  { label: 'Hello', value: 'Hello', direction: 'string-to-hex' as const },
  { label: '你好世界', value: '你好世界', direction: 'string-to-hex' as const },
  { label: 'Hello 你好 123', value: 'Hello 你好 123', direction: 'string-to-hex' as const },
  { label: '48656C6C6F', value: '48656C6C6F', direction: 'hex-to-string' as const },
  { label: '48 65 6C 6C 6F', value: '48 65 6C 6C 6F', direction: 'hex-to-string' as const },
  { label: 'E4BDA0E5A5BD', value: 'E4BDA0E5A5BD', direction: 'hex-to-string' as const }
]

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

const doConvert = () => {
  convertError.value = ''
  if (!inputValue.value.trim()) {
    outputValue.value = ''
    return
  }
  converting.value = true
  try {
    if (convertDirection.value === 'string-to-hex') {
      outputValue.value = stringToHex(inputValue.value)
    } else {
      outputValue.value = hexToString(inputValue.value)
    }
  } catch (error: any) {
    convertError.value = error.message || '转换失败'
    outputValue.value = ''
    ElMessage.error(convertError.value)
  } finally {
    converting.value = false
  }
}

const handleAutoConvert = () => {
  if (inputValue.value.trim()) {
    doConvert()
  } else {
    outputValue.value = ''
    convertError.value = ''
  }
}

const handleDirectionChange = () => {
  const temp = inputValue.value
  inputValue.value = outputValue.value
  outputValue.value = temp
  convertError.value = ''
  if (inputValue.value.trim()) {
    doConvert()
  }
}

const swapDirection = () => {
  convertDirection.value = convertDirection.value === 'string-to-hex' ? 'hex-to-string' : 'string-to-hex'
}

const clearInput = () => {
  inputValue.value = ''
  outputValue.value = ''
  convertError.value = ''
}

const clearOutput = () => {
  outputValue.value = ''
  convertError.value = ''
}

const clearAll = () => {
  inputValue.value = ''
  outputValue.value = ''
  convertError.value = ''
}

const copyResult = async () => {
  if (!outputValue.value) return
  try {
    await navigator.clipboard.writeText(outputValue.value)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputValue.value = text
    doConvert()
  } catch {
    ElMessage.error('粘贴失败')
  }
}

const applyExample = (example: { value: string; direction: 'string-to-hex' | 'hex-to-string' }) => {
  convertDirection.value = example.direction
  inputValue.value = example.value
  doConvert()
}

watch([separator, hexCase, add0xPrefix], () => {
  if (inputValue.value.trim() && convertDirection.value === 'string-to-hex') {
    doConvert()
  }
})
</script>

<style scoped>
.string-hex-converter {
  max-width: 1200px;
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

.converter-direction {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
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

.input-output-container {
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  gap: 16px;
  align-items: start;
}

.io-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.io-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.io-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.io-actions {
  display: flex;
  gap: 8px;
}

.io-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 20px;
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
}

.converter-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-top: 40px;
}

.arrow-text {
  font-size: 12px;
  color: #909399;
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
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.examples-label {
  font-size: 13px;
  color: #165DFF;
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
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

:deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
}

@media (max-width: 768px) {
  .input-output-container {
    grid-template-columns: 1fr;
  }

  .converter-arrow {
    padding-top: 0;
    transform: rotate(0deg);
  }

  .converter-options {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
