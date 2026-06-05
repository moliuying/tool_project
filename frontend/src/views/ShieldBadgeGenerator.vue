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
              <div class="output-header">
                <div class="output-label">徽章 URL</div>
                <el-tag size="small" type="info">最常用</el-tag>
              </div>
              <div class="output-content">
                <el-input v-model="badgeUrl" readonly />
                <el-button type="primary" @click="copyToClipboard(badgeUrl, 'URL')">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
              </div>
              <div class="output-tip">
                <el-icon :size="12" color="#909399"><InfoFilled /></el-icon>
                <span>直接复制图片链接，可用于任何支持图片 URL 的地方，如论坛、博客、聊天工具等</span>
              </div>
            </div>

            <div class="output-item">
              <div class="output-header">
                <div class="output-label">Markdown</div>
                <el-tag size="small" type="success">GitHub README</el-tag>
              </div>
              <div class="output-content">
                <el-input v-model="markdownCode" readonly type="textarea" :rows="2" />
                <el-button type="primary" @click="copyToClipboard(markdownCode, 'Markdown')">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
              </div>
              <div class="output-tip">
                <el-icon :size="12" color="#909399"><InfoFilled /></el-icon>
                <span>推荐用于 GitHub README.md、Gitee、GitLab、掘金、简书等支持 Markdown 的平台</span>
              </div>
            </div>

            <div class="output-item">
              <div class="output-header">
                <div class="output-label">HTML</div>
                <el-tag size="small" type="warning">网页嵌入</el-tag>
              </div>
              <div class="output-content">
                <el-input v-model="htmlCode" readonly type="textarea" :rows="2" />
                <el-button type="primary" @click="copyToClipboard(htmlCode, 'HTML')">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
              </div>
              <div class="output-tip">
                <el-icon :size="12" color="#909399"><InfoFilled /></el-icon>
                <span>用于个人网站、项目文档页面、博客文章等 HTML 环境中嵌入徽章</span>
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

    <el-card class="usage-guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="16" color="#165DFF">
            <Guide />
          </el-icon>
          <span>使用场景指南</span>
        </div>
      </template>
      <div class="usage-cards">
        <div class="usage-card">
          <div class="usage-icon github">
            <el-icon><Odometer /></el-icon>
          </div>
          <div class="usage-title">GitHub README</div>
          <div class="usage-desc">在项目 README 顶部展示构建状态、版本号、许可证等信息</div>
          <div class="usage-code">复制 Markdown 代码 → 粘贴到 README.md</div>
          <div class="usage-badge">
            <img src="https://img.shields.io/badge/build-passing-4c1?style=flat" />
            <img src="https://img.shields.io/badge/version-v1.0.0-007ec6?style=flat" />
            <img src="https://img.shields.io/badge/license-MIT-9333ea?style=flat" />
          </div>
        </div>

        <div class="usage-card">
          <div class="usage-icon website">
            <el-icon><Monitor /></el-icon>
          </div>
          <div class="usage-title">个人网站/博客</div>
          <div class="usage-desc">在个人主页或文章中嵌入技术栈、项目状态徽章</div>
          <div class="usage-code">复制 HTML 代码 → 嵌入网页模板</div>
          <div class="usage-badge">
            <img src="https://img.shields.io/badge/Vue.js-3.x-4fc08d?style=flat&logo=vuedotjs" />
            <img src="https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat&logo=typescript" />
          </div>
        </div>

        <div class="usage-card">
          <div class="usage-icon forum">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <div class="usage-title">论坛/社区分享</div>
          <div class="usage-desc">在技术论坛、问答社区分享项目时附带状态徽章</div>
          <div class="usage-code">复制徽章 URL → 插入图片链接</div>
          <div class="usage-badge">
            <img src="https://img.shields.io/badge/PRs-welcome-4c1?style=flat" />
            <img src="https://img.shields.io/badge/chat-discord-7289da?style=flat" />
          </div>
        </div>

        <div class="usage-card">
          <div class="usage-icon offline">
            <el-icon><Picture /></el-icon>
          </div>
          <div class="usage-title">离线文档/PDF</div>
          <div class="usage-desc">下载 SVG 图片用于离线文档、PPT、PDF 等场景</div>
          <div class="usage-code">点击下载按钮 → 保存为本地图片</div>
          <div class="usage-badge">
            <img src="https://img.shields.io/badge/download-SVG-ff69b4?style=flat" />
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="tutorial-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="16" color="#165DFF">
            <Reading />
          </el-icon>
          <span>GitHub README 详细教程</span>
          <el-tag size="small" type="primary">新手必看</el-tag>
        </div>
      </template>
      
      <el-collapse v-model="activeTutorial" accordion>
        <el-collapse-item name="step1">
          <template #title>
            <span class="tutorial-step-title">
              <span class="step-number">1</span>
              生成并复制徽章代码
            </span>
          </template>
          <div class="tutorial-content">
            <div class="tutorial-step">
              <div class="step-desc">
                <p>① 在左侧配置区域输入徽章的<strong>左侧标签</strong>和<strong>右侧状态</strong></p>
                <p>② 选择喜欢的<strong>颜色</strong>和<strong>样式</strong>（可添加 Logo）</p>
                <p>③ 在「生成代码」区域点击 <el-button size="small" type="primary" disabled>复制</el-button> 按钮复制 Markdown 代码</p>
              </div>
              <div class="step-preview">
                <div class="mock-copy-area">
                  <div class="mock-input">![build: passing](https://img.shields.io/badge/build-passing-4c1)</div>
                  <el-button size="small" type="primary">复制</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item name="step2">
          <template #title>
            <span class="tutorial-step-title">
              <span class="step-number">2</span>
              打开 GitHub 项目
            </span>
          </template>
          <div class="tutorial-content">
            <div class="tutorial-step">
              <div class="step-desc">
                <p>① 打开 <el-link href="https://github.com" target="_blank" type="primary">GitHub</el-link> 并登录</p>
                <p>② 进入你的项目仓库</p>
                <p>③ 找到 <code>README.md</code> 文件，点击进入编辑模式</p>
              </div>
              <div class="step-screenshot">
                <div class="mock-github">
                  <div class="mock-file-path">your-project / README.md</div>
                  <div class="mock-edit-btn">
                    <el-button size="small" type="primary">
                      <el-icon><Edit /></el-icon>
                      编辑
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item name="step3">
          <template #title>
            <span class="tutorial-step-title">
              <span class="step-number">3</span>
              粘贴徽章代码
            </span>
          </template>
          <div class="tutorial-content">
            <div class="tutorial-step">
              <div class="step-desc">
                <p>① 在 README 文件的<strong>顶部标题下方</strong>粘贴代码</p>
                <p>② 多个徽章可以并排排列，用空格或换行分隔</p>
                <p>③ 建议位置：项目名称下方，描述文字上方</p>
              </div>
              <div class="step-code-block">
                <div class="code-header">README.md</div>
                <pre><code># 我的项目名称

![build: passing](https://img.shields.io/badge/build-passing-4c1) ![version: v1.0.0](https://img.shields.io/badge/version-v1.0.0-007ec6) ![license: MIT](https://img.shields.io/badge/license-MIT-9333ea)

这是一个很棒的项目描述...</code></pre>
              </div>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item name="step4">
          <template #title>
            <span class="tutorial-step-title">
              <span class="step-number">4</span>
              预览并保存
            </span>
          </template>
          <div class="tutorial-content">
            <div class="tutorial-step">
              <div class="step-desc">
                <p>① 点击「Preview changes」查看徽章效果</p>
                <p>② 确认显示正常后，滚动到页面底部</p>
                <p>③ 填写提交信息，点击「Commit changes」保存</p>
              </div>
              <div class="step-success">
                <el-icon color="#67c23a" :size="32"><CircleCheck /></el-icon>
                <div class="success-text">
                  <strong>完成！</strong>
                  <p>徽章已成功添加到你的 README 文件中</p>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item name="step5">
          <template #title>
            <span class="tutorial-step-title">
              <span class="step-number">5</span>
              进阶：添加可点击的徽章链接
            </span>
          </template>
          <div class="tutorial-content">
            <div class="tutorial-step">
              <div class="step-desc">
                <p>让徽章变成可点击的链接，跳转到对应的页面：</p>
              </div>
              <div class="step-code-block">
                <div class="code-header">带链接的 Markdown 语法</div>
                <pre><code>[![build: passing](https://img.shields.io/badge/build-passing-4c1)](https://github.com/your-name/your-project/actions)

[![stars](https://img.shields.io/github/stars/your-name/your-project)](https://github.com/your-name/your-project/stargazers)</code></pre>
              </div>
              <div class="step-tip">
                <el-icon color="#e6a23c"><Warning /></el-icon>
                <span>格式说明：<code>[![徽章描述](徽章图片地址)](跳转链接地址)</code></span>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
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
          <span>支持多种样式风格：塑料风、扁平风、圆角方形、大徽章、社交风格</span>
        </div>
        <div class="tip-item">
          <el-icon color="#67c23a"><SuccessFilled /></el-icon>
          <span>可直接复制 Markdown 或 HTML 代码用于 GitHub README 或项目文档</span>
        </div>
        <div class="tip-item">
          <el-icon color="#67c23a"><SuccessFilled /></el-icon>
          <span>支持添加 Simple Icons 库中的图标作为 Logo，让徽章更专业</span>
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
  CopyDocument,
  Guide,
  Odometer,
  Monitor,
  ChatDotRound,
  Picture,
  Reading,
  CircleCheck,
  Warning
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
const activeTutorial = ref('step1')

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

.output-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.output-tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.output-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.usage-guide-card {
  margin-bottom: 24px;
}

.usage-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.usage-card {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  transition: all 0.3s;
}

.usage-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #165DFF;
}

.usage-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  margin-bottom: 12px;
}

.usage-icon.github {
  background: linear-gradient(135deg, #333 0%, #24292e 100%);
}

.usage-icon.website {
  background: linear-gradient(135deg, #165DFF 0%, #4080ff 100%);
}

.usage-icon.forum {
  background: linear-gradient(135deg, #00b42a 0%, #4caf50 100%);
}

.usage-icon.offline {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.usage-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.usage-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 8px;
}

.usage-code {
  font-size: 12px;
  color: #165DFF;
  font-weight: 500;
  padding: 6px 10px;
  background: #f0f7ff;
  border-radius: 4px;
  margin-bottom: 12px;
}

.usage-badge {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.usage-badge img {
  height: 20px;
}

.tutorial-card {
  margin-bottom: 24px;
}

.tutorial-step-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #165DFF 0%, #4080ff 100%);
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.tutorial-content {
  padding: 16px 0;
}

.tutorial-step {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-desc {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-desc p {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.step-desc code {
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #e74c3c;
}

.step-preview,
.step-screenshot {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  border: 1px dashed #d9d9d9;
}

.mock-copy-area {
  display: flex;
  gap: 8px;
  align-items: center;
}

.mock-input {
  flex: 1;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', monospace;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mock-github {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #24292e;
  border-radius: 6px;
  color: #fff;
}

.mock-file-path {
  font-size: 14px;
  font-family: 'Monaco', 'Menlo', monospace;
}

.mock-edit-btn {
  opacity: 0.9;
}

.step-code-block {
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.code-header {
  padding: 8px 16px;
  background: #2d2d2d;
  color: #ccc;
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  border-bottom: 1px solid #404040;
}

.step-code-block pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
}

.step-code-block code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  color: #d4d4d4;
  line-height: 1.6;
}

.step-success {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f0f9eb;
  border-radius: 8px;
  border: 1px solid #e1f3d8;
}

.success-text strong {
  display: block;
  font-size: 16px;
  color: #67c23a;
  margin-bottom: 4px;
}

.success-text p {
  margin: 0;
  font-size: 13px;
  color: #606266;
}

.step-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  background: #fdf6ec;
  border-radius: 6px;
  font-size: 13px;
  color: #b88230;
}

.step-tip code {
  background: #fff3e0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #e6a23c;
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

@media (max-width: 1200px) {
  .usage-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .generator-container {
    grid-template-columns: 1fr;
  }
  
  .preset-list {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .usage-cards {
    grid-template-columns: 1fr;
  }
}
</style>
