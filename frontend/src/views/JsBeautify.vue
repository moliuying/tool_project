<template>
  <div class="js-beautify-page">
    <div class="editor-container">
      <div class="editor-panel">
        <div class="panel-header">
          <span>输入 JS 代码</span>
        </div>
        <el-input
          v-model="inputCode"
          type="textarea"
          :rows="16"
          placeholder="请输入需要美化的 JavaScript 代码..."
          class="code-textarea"
          resize="none"
        />
        <div class="toolbar">
          <div class="toolbar-left">
            <el-select v-model="formatOptions.indent_size" placeholder="缩进大小" size="default">
              <el-option :value="2" label="2 空格" />
              <el-option :value="4" label="4 空格" />
              <el-option :value="8" label="8 空格" />
            </el-select>
            <el-select v-model="formatOptions.indent_with_tabs" placeholder="缩进方式" size="default">
              <el-option :value="false" label="空格" />
              <el-option :value="true" label="Tab" />
            </el-select>
          </div>
          <div class="toolbar-right">
            <el-button type="primary" @click="handleFormat">
              <el-icon><MagicStick /></el-icon>
              美化代码
            </el-button>
            <el-button @click="handleClear">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
          </div>
        </div>
      </div>

      <div class="editor-divider">
        <el-icon class="arrow-icon"><Right /></el-icon>
      </div>

      <div class="editor-panel">
        <div class="panel-header">
          <span>美化结果</span>
        </div>
        <el-input
          v-model="outputCode"
          type="textarea"
          :rows="16"
          placeholder="美化后的代码将显示在这里..."
          class="code-textarea"
          resize="none"
          readonly
        />
        <div class="toolbar">
          <div class="toolbar-left">
            <span class="result-stats">{{ outputCode ? `共 ${outputCode.length} 字符` : '' }}</span>
          </div>
          <div class="toolbar-right">
            <el-button @click="handleCopy">
              <el-icon><DocumentCopy /></el-icon>
              复制结果
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { js } from 'js-beautify'

const inputCode = ref('')
const outputCode = ref('')

const formatOptions = reactive({
  indent_size: 2,
  indent_with_tabs: false,
  brace_style: 'collapse',
  preserve_newlines: true,
  space_after_anon_function: true,
  space_after_named_function: true,
  space_in_paren: false,
  wrap_line_length: 120
})

const handleFormat = () => {
  if (!inputCode.value.trim()) {
    ElMessage.warning('请输入需要美化的代码')
    return
  }

  try {
    const options = {
      indent_size: formatOptions.indent_size,
      indent_with_tabs: formatOptions.indent_with_tabs,
      brace_style: formatOptions.brace_style,
      preserve_newlines: formatOptions.preserve_newlines,
      space_after_anon_function: formatOptions.space_after_anon_function,
      space_after_named_function: formatOptions.space_after_named_function,
      space_in_paren: formatOptions.space_in_paren,
      wrap_line_length: formatOptions.wrap_line_length
    }

    outputCode.value = js(inputCode.value, options)
    ElMessage.success('代码美化成功')
  } catch (error: any) {
    ElMessage.error('代码美化失败：' + error.message)
  }
}

const handleCopy = async () => {
  if (!outputCode.value.trim()) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  try {
    await navigator.clipboard.writeText(outputCode.value)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const handleClear = () => {
  inputCode.value = ''
  outputCode.value = ''
}
</script>

<style scoped>
.js-beautify-page {
  height: 100%;
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

.panel-header {
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
}

.editor-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
}

.arrow-icon {
  font-size: 24px;
  color: #409eff;
}

.code-textarea {
  flex: 1;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.code-textarea :deep(textarea) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-stats {
  font-size: 13px;
  color: #909399;
}
</style>
