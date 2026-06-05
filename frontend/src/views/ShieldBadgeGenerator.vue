<template>
  <div class="shield-badge-generator">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Ticket />
          </el-icon>
          <span>Shield 徽章生成器</span>
          <el-tag size="small" type="success">快速生成项目徽章</el-tag>
        </div>
      </template>

      <div class="generator-container">
        <div class="input-section">
          <div class="section-title">
            <el-icon><Edit /></el-icon>
            <span>徽章配置</span>
          </div>

          <el-form label-width="100px" label-position="left">
            <el-form-item label="左侧标签">
              <el-input v-model="badgeConfig.label" placeholder="如: build, version, license" maxlength="20" show-word-limit />
            </el-form-item>

            <el-form-item label="右侧状态">
              <el-input v-model="badgeConfig.message" placeholder="如: passing, v1.0.0, MIT" maxlength="30" show-word-limit />
            </el-form-item>

            <el-form-item label="标签颜色">
              <el-color-picker v-model="badgeConfig.labelColor" show-alpha />
              <el-select v-model="badgeConfig.labelColor" size="small" style="margin-left: 12px; width: 140px;">
                <el-option v-for="color in presetColors" :key="color.value" :label="color.name" :value="color.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="状态颜色">
              <el-color-picker v-model="badgeConfig.messageColor" show-alpha />
              <el-select v-model="badgeConfig.messageColor" size="small" style="margin-left: 12px; width: 140px;">
                <el-option v-for="color in presetColors" :key="color.value" :label="color.name" :value="color.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="徽章样式">
              <el-radio-group v-model="badgeConfig.style">
                <el-radio-button v-for="style in badgeStyles" :key="style.value" :value="style.value">
                  {{ style.name }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="Logo">
              <el-select v-model="badgeConfig.logo" placeholder="选择图标（可选）" clearable filterable style="width: 100%;">
                <el-option v-for="logo in popularLogos" :key="logo.value" :label="logo.name" :value="logo.value">
                  <span style="display: flex; align-items: center; gap: 8px;">
                    <img :src="`https://cdn.simpleicons.org/${logo.value}/white`" style="width: 16px; height: 16px; background: #333; padding: 2px; border-radius: 2px;" />
                    {{ logo.name }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <el-card class="preset-card" shadow="never">
            <template #header>
              <div class="preset-header">
                <el-icon :size="14" color="#165DFF"><MagicStick /></el-icon>
                <span>快速模板</span>
              </div>
            </template>
            <div class="preset-list">
              <div v-for="preset in presets" :key="preset.name" class="preset-item" @click="applyPreset(preset)">
                <img :src="preset.preview" class="preset-preview" />
                <span class="preset-name">{{ preset.name }}</span>
              </div>
            </div>
          </el-card>
        </div>

        <div class="preview-section">
          <div class="section-title">
            <el-icon><View /></el-icon>
            <span>预览效果</span>
          </div>

          <div class="preview-container">
            <div class="badge-preview-large">
              <img :src="badgeUrl" alt="Badge Preview" @error="handleImageError" />
            </div>
            <div class="preview-bg-toggle">
              <span class="bg-label">背景:</span>
              <el-radio-group v-model="previewBg" size="small">
                <el-radio-button value="light">浅色</el-radio-button>
                <el-radio-button value="dark">深色</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <div class="output-section">
            <div class="section-title">
              <el-icon><Link /></el-icon>
              <span>生成代码</span>
            </div>

            <div class="output-item">
              <div class="output-label">徽章 URL</div>
              <div class="output-content">
                <el-input v-model="badgeUrl" readonly />
                <el-button type="primary" @click="copyToClipboard(badgeUrl, 'URL')">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
              </div>
            </div>

            <div class="output-item">
              <div class="output-label">Markdown</div>
              <div class="output-content">
                <el-input v-model="markdownCode" readonly type="textarea" :rows="2" />
                <el-button type="primary" @click="copyToClipboard(markdownCode, 'Markdown')">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
              </div>
            </div>

            <div class="output-item">
              <div class="output-label">HTML</div>
              <div class="output-content">
                <el-input v-model="htmlCode" readonly type="textarea" :rows="2" />
                <el-button type="primary" @click="copyToClipboard(htmlCode, 'HTML')">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
              </div>
            </div>

            <div class="output-actions">
              <el-button type="primary" size="large" @click="downloadBadge">
                <el-icon><Download /></el-icon>
                下载徽章
              </el-button>
              <el-button size="large" @click="resetConfig">
                <el-icon><Refresh /></el-icon>
                重置
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="tips-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="16" color="#e6a23c">
            <InfoFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <div class="tips-content">
        <div class="tip-item">
          <el-icon color="#67c23a"><SuccessFilled /></el-icon>
          <span>输入左侧标签和右侧状态文字，自动生成符合 shields.io 规范的徽章</span>
        </div>
        <div class="tip-item">
          <el-icon color="#67c23a"><SuccessFilled /></el-icon>
          <span>支持多种样式风格：塑料风、扁平风、圆角方形等</span>
        </div>
        <div class="tip-item">
          <el-icon color="#67c23a"><SuccessFilled /></el-icon>
          <span>可直接复制 Markdown 或 HTML 代码用于 GitHub README 或项目文档</span>
        </div>
        <div class="tip-item">
          <el-icon color="#67c23a"><SuccessFilled /></el-icon>
          <span>支持添加 Simple Icons 库中的图标作为 Logo</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Ticket,
  Edit,
  View,
  Link,
  Download,
  Refresh,
  InfoFilled,
  SuccessFilled,
  MagicStick,
  CopyDocument
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface BadgeConfig {
  label: string
  message: string
  labelColor: string
  messageColor: string
  style: string
  logo: string
}

const badgeConfig = ref<BadgeConfig>({
  label: 'build',
  message: 'passing',
  labelColor: '#555555',
  messageColor: '#4c1',
  style: 'flat',
  logo: ''
})

const previewBg = ref('light')

const presetColors = [
  { name: '成功绿', value: '#4c1' },
  { name: '警告黄', value: '#fa0' },
  { name: '错误红', value: '#e05d44' },
  { name: '信息蓝', value: '#007ec6' },
  { name: '深灰色', value: '#555555' },
  { name: '浅灰色', value: '#9f9f9f' },
  { name: '紫色', value: '#9333ea' },
  { name: '粉色', value: '#ec4899' }
]

const badgeStyles = [
  { name: '扁平', value: 'flat' },
  { name: '塑料', value: 'plastic' },
  { name: '方角', value: 'flat-square' },
  { name: '大徽章', value: 'for-the-badge' },
  { name: '社交', value: 'social' }
]

const popularLogos = [
  { name: 'GitHub', value: 'github' },
  { name: 'npm', value: 'npm' },
  { name: 'React', value: 'react' },
  { name: 'Vue.js', value: 'vuedotjs' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'JavaScript', value: 'javascript' },
  { name: 'Node.js', value: 'nodedotjs' },
  { name: 'Python', value: 'python' },
  { name: 'Docker', value: 'docker' },
  { name: 'Git', value: 'git' },
  { name: 'Visual Studio Code', value: 'visualstudiocode' },
  { name: 'MySQL', value: 'mysql' },
  { name: 'PostgreSQL', value: 'postgresql' },
  { name: 'MongoDB', value: 'mongodb' },
  { name: 'Redis', value: 'redis' },
  { name: 'Linux', value: 'linux' },
  { name: 'Apple', value: 'apple' },
  { name: 'Windows', value: 'windows' },
  { name: 'Chrome', value: 'googlechrome' },
  { name: 'Firefox', value: 'firefox' }
]

const presets = [
  {
    name: '构建通过',
    label: 'build',
    message: 'passing',
    labelColor: '#555555',
    messageColor: '#4c1',
    preview: 'https://img.shields.io/badge/build-passing-4c1?style=flat'
  },
  {
    name: '版本号',
    label: 'version',
    message: 'v1.0.0',
    labelColor: '#555555',
    messageColor: '#007ec6',
    preview: 'https://img.shields.io/badge/version-v1.0.0-007ec6?style=flat'
  },
  {
    name: 'MIT许可证',
    label: 'license',
    message: 'MIT',
    labelColor: '#555555',
    messageColor: '#9333ea',
    preview: 'https://img.shields.io/badge/license-MIT-9333ea?style=flat'
  },
  {
    name: '代码覆盖率',
    label: 'coverage',
    message: '95%',
    labelColor: '#555555',
    messageColor: '#4c1',
    preview: 'https://img.shields.io/badge/coverage-95%25-4c1?style=flat'
  },
  {
    name: '下载量',
    label: 'downloads',
    message: '10k/month',
    labelColor: '#555555',
    messageColor: '#007ec6',
    preview: 'https://img.shields.io/badge/downloads-10k%2Fmonth-007ec6?style=flat'
  },
  {
    name: '星标数',
    label: 'stars',
    message: '1.2k',
    labelColor: '#555555',
    messageColor: '#fa0',
    preview: 'https://img.shields.io/badge/stars-1.2k-fa0?style=flat'
  }
]

const encodeBadgeText = (text: string): string => {
  return text.replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '_')
}

const badgeUrl = computed(() => {
  const label = encodeBadgeText(badgeConfig.value.label)
  const message = encodeBadgeText(badgeConfig.value.message)
  const color = badgeConfig.value.messageColor.replace('#', '')
  const labelColor = badgeConfig.value.labelColor.replace('#', '')
  
  let url = `https://img.shields.io/badge/${label}-${message}-${color}?style=${badgeConfig.value.style}&labelColor=${labelColor}`
  
  if (badgeConfig.value.logo) {
    url += `&logo=${badgeConfig.value.logo}`
  }
  
  return url
})

const markdownCode = computed(() => {
  return `![${badgeConfig.value.label}: ${badgeConfig.value.message}](${badgeUrl.value})`
})

const htmlCode = computed(() => {
  return `<img src="${badgeUrl.value}" alt="${badgeConfig.value.label}: ${badgeConfig.value.message}" />`
})

const applyPreset = (preset: any) => {
  badgeConfig.value.label = preset.label
  badgeConfig.value.message = preset.message
  badgeConfig.value.labelColor = preset.labelColor
  badgeConfig.value.messageColor = preset.messageColor
}

const copyToClipboard = async (text: string, type: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`${type} 已复制到剪贴板！`)
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const downloadBadge = () => {
  const link = document.createElement('a')
  link.href = badgeUrl.value
  link.download = `badge_${badgeConfig.value.label}_${badgeConfig.value.message}.svg`
  link.target = '_blank'
  link.click()
  ElMessage.success('徽章下载已开始！')
}

const resetConfig = () => {
  badgeConfig.value = {
    label: 'build',
    message: 'passing',
    labelColor: '#555555',
    messageColor: '#4c1',
    style: 'flat',
    logo: ''
  }
}

const handleImageError = () => {
  console.warn('Badge image failed to load, but shields.io is usually reliable')
}
</script>

<style scoped>
.shield-badge-generator {
  max-width: 1200px;
  margin: 0 auto;
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

.generator-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preset-card {
  border: 1px solid #ebeef5;
}

.preset-card :deep(.el-card__header) {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-bottom: none;
}

.preset-card :deep(.el-card__body) {
  padding: 16px;
}

.preset-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.preset-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ebeef5;
  background: #fafafa;
}

.preset-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #165DFF;
}

.preset-preview {
  height: 20px;
}

.preset-name {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preview-container {
  padding: 32px;
  border-radius: 12px;
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  transition: background 0.3s;
}

.preview-container:has(.preview-bg-toggle [value="light"]) {
  background: #fafafa;
}

.preview-container:has(.preview-bg-toggle [value="dark"]) {
  background: #1e1e1e;
}

.badge-preview-large {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-preview-large img {
  transform: scale(2);
  image-rendering: auto;
}

.preview-bg-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bg-label {
  font-size: 13px;
  color: #606266;
}

.output-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.output-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.output-label {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.output-content {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.output-content .el-input {
  flex: 1;
}

.output-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.tips-card {
  margin-bottom: 24px;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

@media (max-width: 900px) {
  .generator-container {
    grid-template-columns: 1fr;
  }
  
  .preset-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
