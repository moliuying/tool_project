<template>
  <div class="crx-downloader">
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
        <el-step title="输入扩展信息" description="粘贴Chrome Web Store链接或扩展ID" />
        <el-step title="解析扩展" description="系统自动提取并验证扩展ID" />
        <el-step title="下载CRX" description="从服务器获取CRX扩展安装包" />
        <el-step title="离线安装" description="将CRX文件导入Chrome进行安装" />
      </el-steps>
      <el-divider />
      <div class="tips-section">
        <h4 class="tips-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          功能说明
        </h4>
        <ul class="tips-list">
          <li>支持输入Chrome Web Store扩展链接或32位扩展ID</li>
          <li>直接从Google服务器下载CRX扩展安装包</li>
          <li>适用于开发者、测试工程师、无法访问应用商店的用户</li>
          <li>可用于离线安装、版本管理、扩展分析和内网部署</li>
          <li>支持CRX2和CRX3格式的扩展</li>
        </ul>
      </div>
    </el-card>

    <el-card class="download-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Download />
          </el-icon>
          <span>CRX 扩展下载器</span>
          <el-tag size="small" type="success">Chrome扩展离线下载工具</el-tag>
        </div>
      </template>

      <div class="input-section">
        <el-form label-width="120px">
          <el-form-item label="扩展链接/ID">
            <div class="input-group">
              <el-input
                v-model="extensionInput"
                placeholder="例如: https://chrome.google.com/webstore/detail/xxx/aapbdbdomjkkjkaonfhkkikfgjllcleb 或 aapbdbdomjkkjkaonfhkkikfgjllcleb"
                size="large"
                clearable
                @keyup.enter="handleDownload"
              >
                <template #prefix>
                  <el-icon><Link /></el-icon>
                </template>
                <template #append>
                  <el-button type="primary" @click="handleDownload" :loading="isDownloading">
                    <el-icon v-if="!isDownloading"><Download /></el-icon>
                    <span>{{ isDownloading ? '下载中...' : '下载CRX' }}</span>
                  </el-button>
                </template>
              </el-input>
            </div>

            <div class="format-guide">
              <div class="format-title">
                <el-icon :size="16" color="#165DFF"><InfoFilled /></el-icon>
                <span>支持以下两种输入格式，点击卡片可自动填入示例：</span>
              </div>

              <div class="format-cards">
                <div class="format-card format-card-link" @click="selectExampleByType('link')">
                  <div class="format-card-header">
                    <el-icon :size="20" color="#409EFF"><Link /></el-icon>
                    <span class="format-name">格式一：Chrome Web Store 链接</span>
                    <el-tag size="small" type="info" effect="plain">复制粘贴即用</el-tag>
                  </div>
                  <div class="format-card-body">
                    <div class="format-desc">从 Chrome 网上应用店地址栏复制的完整 URL</div>

                    <div class="url-breakdown">
                      <div class="url-segments">
                        <div class="url-segment segment-host">
                          <span class="segment-text">https://chrome.google.com/webstore/detail/</span>
                          <span class="segment-label">固定前缀</span>
                        </div>
                        <div class="url-segment segment-slug">
                          <span class="segment-text">google-translate/</span>
                          <span class="segment-label">扩展名称（可省略）</span>
                        </div>
                        <div class="url-segment segment-id">
                          <span class="segment-text">aapbdbdomjkkjkaonfhkkikfgjllcleb</span>
                          <span class="segment-label">
                            <el-icon><Aim /></el-icon>
                            这就是扩展 ID！
                          </span>
                        </div>
                      </div>
                      <div class="url-arrow-hint">
                        <div class="arrow-line">
                          <span class="arrow-dot"></span>
                          <span class="arrow-connector"></span>
                          <el-icon class="arrow-icon" :size="20"><BottomRight /></el-icon>
                        </div>
                        <div class="arrow-text">
                          <el-tag type="warning" effect="dark">
                            <el-icon><WarningFilled /></el-icon>
                            detail/ 后面的最后一段就是扩展 ID（32位字母）
                          </el-tag>
                        </div>
                      </div>
                    </div>

                    <div class="format-tips">
                      <div class="tip-item">
                        <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
                        <span>在应用商店找到扩展后，直接复制浏览器地址栏的链接即可</span>
                      </div>
                      <div class="tip-item">
                        <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
                        <span>名称部分缺失也没关系，系统会自动识别末尾的 ID</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="format-card format-card-id" @click="selectExampleByType('id')">
                  <div class="format-card-header">
                    <el-icon :size="20" color="#67C23A"><Box /></el-icon>
                    <span class="format-name">格式二：扩展 ID（推荐）</span>
                    <el-tag size="small" type="success" effect="plain">输入更简洁</el-tag>
                  </div>
                  <div class="format-card-body">
                    <div class="format-desc">32 位小写字母（仅 a-p）组成的扩展唯一标识</div>

                    <div class="id-display">
                      <div class="id-char-row">
                        <span
                          v-for="(char, idx) in sampleIdChars"
                          :key="idx"
                          class="id-char"
                          :class="{ 'char-highlight': idx >= 28 }"
                        >{{ char }}</span>
                      </div>
                      <div class="id-legend">
                        <div class="legend-item">
                          <span class="legend-box"></span>
                          <span>共 32 个字符</span>
                        </div>
                        <div class="legend-item">
                          <span class="legend-box highlight"></span>
                          <span>仅使用字母 a 到 p</span>
                        </div>
                      </div>
                    </div>

                    <div class="format-tips">
                      <div class="tip-item">
                        <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
                        <span>地址栏输入 chrome://extensions/ 开启「开发者模式」即可查看</span>
                      </div>
                      <div class="tip-item">
                        <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
                        <span>也可在扩展详情页的 URL 末尾找到（如格式一所示）</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="example-section">
              <span class="example-label">热门扩展一键下载：</span>
              <el-tag
                v-for="example in exampleExtensions"
                :key="example.id"
                size="small"
                class="example-tag"
                @click="selectExample(example)"
              >
                <el-icon><Box /></el-icon>
                {{ example.name }}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="当前扩展ID">
            <div class="extension-id-display">
              <el-input
                v-if="parsedExtensionId"
                :model-value="parsedExtensionId"
                readonly
                size="small"
                class="id-input"
              >
                <template #append>
                  <el-button size="small" @click="copyExtensionId">
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </template>
              </el-input>
              <span v-else class="id-placeholder">尚未解析扩展ID</span>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="errorMessage" class="error-message">
        <el-alert :title="errorMessage" type="error" :closable="false" show-icon />
      </div>
    </el-card>

    <el-card v-if="downloadHistory.length > 0" class="history-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Clock />
          </el-icon>
          <span>下载记录</span>
          <el-tag size="small" type="info">最近下载</el-tag>
          <el-button
            type="primary"
            link
            size="small"
            class="clear-btn"
            @click="clearHistory"
          >
            <el-icon><Delete /></el-icon>
            清空记录
          </el-button>
        </div>
      </template>

      <div class="history-list">
        <div
          v-for="(item, index) in downloadHistory"
          :key="index"
          class="history-item"
        >
          <div class="history-icon">
            <el-icon :size="24" color="#409EFF"><Box /></el-icon>
          </div>
          <div class="history-info">
            <div class="history-id">{{ item.extensionId }}</div>
            <div class="history-meta">
              <el-tag size="small" type="success">{{ item.size }}</el-tag>
              <span class="history-time">{{ item.time }}</span>
            </div>
          </div>
          <div class="history-actions">
            <el-button size="small" type="primary" link @click="copyExtensionId(item.extensionId)">
              <el-icon><CopyDocument /></el-icon>
              复制ID
            </el-button>
            <el-button size="small" type="primary" link @click="redownload(item.extensionId)">
              <el-icon><Refresh /></el-icon>
              重新下载
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="help-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#909399">
            <QuestionFilled />
          </el-icon>
          <span>如何获取扩展ID？</span>
        </div>
      </template>

      <el-tabs v-model="activeHelpTab">
        <el-tab-pane label="从Chrome Web Store获取" name="webstore">
          <div class="help-content">
            <div class="help-step">
              <el-tag size="small" type="primary" round>1</el-tag>
              <span>打开 Chrome 网上应用店 (chrome.google.com/webstore)</span>
            </div>
            <div class="help-step">
              <el-tag size="small" type="primary" round>2</el-tag>
              <span>找到你需要的扩展并进入详情页</span>
            </div>
            <div class="help-step">
              <el-tag size="small" type="primary" round>3</el-tag>
              <span>查看浏览器地址栏，URL末尾的32位字符串就是扩展ID</span>
            </div>
            <div class="help-example">
              <div class="example-title">示例URL：</div>
              <div class="example-url">
                https://chrome.google.com/webstore/detail/extension-name/<span class="highlight-id">aapbdbdomjkkjkaonfhkkikfgjllcleb</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="从已安装扩展获取" name="installed">
          <div class="help-content">
            <div class="help-step">
              <el-tag size="small" type="primary" round>1</el-tag>
              <span>在Chrome地址栏输入 chrome://extensions/ 回车</span>
            </div>
            <div class="help-step">
              <el-tag size="small" type="primary" round>2</el-tag>
              <span>开启右上角的「开发者模式」开关</span>
            </div>
            <div class="help-step">
              <el-tag size="small" type="primary" round>3</el-tag>
              <span>每个扩展卡片下方会显示ID，格式为32位小写字母（a-p）</span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="CRX离线安装方法" name="install">
          <div class="help-content">
            <el-alert
              title="注意：Chrome已限制直接安装CRX文件，推荐使用以下方法"
              type="warning"
              :closable="false"
              show-icon
              class="install-alert"
            />
            <div class="install-methods">
              <div class="install-method">
                <div class="method-title">
                  <el-icon><Setting /></el-icon>
                  <span>方法一：开发者模式加载（推荐）</span>
                </div>
                <ol class="method-steps">
                  <li>将 CRX 文件后缀改为 .zip，然后解压到一个文件夹</li>
                  <li>打开 chrome://extensions/，开启「开发者模式」</li>
                  <li>点击「加载已解压的扩展程序」，选择解压后的文件夹</li>
                </ol>
              </div>
              <div class="install-method">
                <div class="method-title">
                  <el-icon><FolderOpened /></el-icon>
                  <span>方法二：拖拽安装（部分Chrome版本支持）</span>
                </div>
                <ol class="method-steps">
                  <li>打开 chrome://extensions/ 页面</li>
                  <li>开启「开发者模式」</li>
                  <li>将 CRX 文件直接拖拽到扩展管理页面</li>
                </ol>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Download,
  InfoFilled,
  Warning,
  Link,
  CopyDocument,
  Clock,
  Delete,
  Refresh,
  Box,
  QuestionFilled,
  Setting,
  FolderOpened,
  Aim,
  BottomRight,
  WarningFilled,
  CircleCheckFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { crxApi, type ExtensionInfo } from '@/api/crx'

interface DownloadRecord {
  extensionId: string
  size: string
  time: string
}

interface ExampleExtension {
  name: string
  id: string
  input: string
}

const extensionInput = ref('')
const parsedExtensionId = ref('')
const isDownloading = ref(false)
const errorMessage = ref('')
const downloadHistory = ref<DownloadRecord[]>([])
const activeHelpTab = ref('webstore')

const sampleIdChars = 'aapbdbdomjkkjkaonfhkkikfgjllcleb'.split('')

const exampleExtensions: ExampleExtension[] = [
  { name: 'Google翻译', id: 'aapbdbdomjkkjkaonfhkkikfgjllcleb', input: 'aapbdbdomjkkjkaonfhkkikfgjllcleb' },
  { name: 'AdBlock', id: 'gighmmpiobklfepjocnamgkkbiglidom', input: 'gighmmpiobklfepjocnamgkkbiglidom' },
  { name: 'Tampermonkey', id: 'dhdgffkkebhmkfjojejmpbldmpobfkfo', input: 'dhdgffkkebhmkfjojejmpbldmpobfkfo' }
]

onMounted(() => {
  loadHistory()
})

const loadHistory = () => {
  try {
    const saved = localStorage.getItem('crx-download-history')
    if (saved) {
      downloadHistory.value = JSON.parse(saved)
    }
  } catch {
    downloadHistory.value = []
  }
}

const saveHistory = () => {
  try {
    localStorage.setItem('crx-download-history', JSON.stringify(downloadHistory.value.slice(0, 10)))
  } catch {
    // ignore
  }
}

const clearHistory = () => {
  downloadHistory.value = []
  localStorage.removeItem('crx-download-history')
  ElMessage.success('已清空下载记录')
}

const selectExample = (example: ExampleExtension) => {
  extensionInput.value = example.input
  parsedExtensionId.value = example.id
  errorMessage.value = ''
}

const selectExampleByType = (type: 'link' | 'id') => {
  const sampleId = 'aapbdbdomjkkjkaonfhkkikfgjllcleb'
  if (type === 'link') {
    extensionInput.value = `https://chrome.google.com/webstore/detail/google-translate/${sampleId}`
  } else {
    extensionInput.value = sampleId
  }
  parsedExtensionId.value = sampleId
  errorMessage.value = ''
  ElMessage.info('已填入示例，可点击下载按钮测试')
}

const parseExtension = async () => {
  if (!extensionInput.value.trim()) {
    ElMessage.warning('请输入Chrome Web Store链接或扩展ID')
    return false
  }

  try {
    const response = await crxApi.parse(extensionInput.value.trim())
    parsedExtensionId.value = response.data.id
    errorMessage.value = ''
    return true
  } catch (error: any) {
    parsedExtensionId.value = ''
    errorMessage.value = error.response?.data?.message || error.message || '解析失败'
    ElMessage.error(errorMessage.value)
    return false
  }
}

const copyExtensionId = (id?: string) => {
  const targetId = id || parsedExtensionId.value
  if (!targetId) {
    ElMessage.warning('没有可复制的扩展ID')
    return
  }
  navigator.clipboard.writeText(targetId).then(() => {
    ElMessage.success('已复制扩展ID')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const handleDownload = async () => {
  const parsed = await parseExtension()
  if (!parsed) return

  isDownloading.value = true
  errorMessage.value = ''

  try {
    const response = await crxApi.download(extensionInput.value.trim())
    const blob = new Blob([response.data], { type: 'application/x-chrome-extension' })
    
    const fileName = `${parsedExtensionId.value}.crx`
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    const contentLength = response.headers['x-file-size'] || formatSize(blob.size)
    
    addToHistory(parsedExtensionId.value, contentLength)
    
    ElMessage.success(`下载成功: ${fileName}`)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || error.message || '下载失败，请稍后重试'
    ElMessage.error(errorMessage.value)
  } finally {
    isDownloading.value = false
  }
}

const redownload = (extensionId: string) => {
  extensionInput.value = extensionId
  handleDownload()
}

const addToHistory = (extensionId: string, size: string) => {
  const record: DownloadRecord = {
    extensionId,
    size,
    time: new Date().toLocaleString('zh-CN')
  }
  downloadHistory.value.unshift(record)
  if (downloadHistory.value.length > 10) {
    downloadHistory.value = downloadHistory.value.slice(0, 10)
  }
  saveHistory()
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.crx-downloader {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card,
.download-card,
.history-card,
.help-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.guide-steps {
  padding: 10px 0;
}

.tips-section {
  padding: 0 4px;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: #303133;
  margin: 0 0 16px;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  color: #606266;
  line-height: 2;
}

.input-section {
  padding: 16px 0;
}

.input-group {
  max-width: 700px;
}

.example-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.example-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.example-tag {
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.example-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.format-guide {
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #ecf5ff 100%);
  border-radius: 12px;
  border: 1px solid #d9ecff;
}

.format-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.format-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 12px;
}

.format-card {
  padding: 18px;
  background: #fff;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.format-card-link:hover {
  border-color: #409EFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.18);
}

.format-card-id:hover {
  border-color: #67C23A;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(103, 194, 58, 0.18);
}

.format-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.format-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.format-card-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.format-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.url-breakdown {
  background: linear-gradient(135deg, #f8f9fb 0%, #f0f5ff 100%);
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #e1e8f0;
}

.url-segments {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.url-segment {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.segment-host {
  border-color: #ebeef5;
}

.segment-slug {
  border-color: #ebeef5;
  opacity: 0.75;
}

.segment-id {
  border: 2px solid #f59e0b;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  position: relative;
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.3); }
  50% { box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1); }
}

.segment-text {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #606266;
  word-break: break-all;
}

.segment-host .segment-text,
.segment-slug .segment-text {
  color: #909399;
}

.segment-id .segment-text {
  color: #d97706;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.segment-label {
  font-size: 11px;
  color: #909399;
  flex-shrink: 0;
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  background: #f4f4f5;
  border-radius: 10px;
}

.segment-id .segment-label {
  color: #b45309;
  background: #fde68a;
  font-weight: 600;
}

.url-arrow-hint {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px dashed #fbbf24;
}

.arrow-line {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
}

.arrow-dot {
  width: 8px;
  height: 8px;
  background: #f59e0b;
  border-radius: 50%;
  flex-shrink: 0;
}

.arrow-connector {
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.arrow-icon {
  color: #f59e0b;
  flex-shrink: 0;
}

.arrow-text :deep(.el-tag) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.format-tips {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f0f9eb;
  border-radius: 8px;
  border: 1px solid #e1f3d8;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #5a6e49;
  line-height: 1.6;
}

.tip-item .el-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.id-display {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #c2e7b0;
}

.id-char-row {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin-bottom: 12px;
  justify-content: center;
}

.id-char {
  width: 24px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #c2e7b0;
  border-radius: 5px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #529b2e;
  transition: all 0.2s;
}

.id-char.char-highlight {
  background: #67C23A;
  border-color: #529b2e;
  color: #fff;
}

.id-char:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(103, 194, 58, 0.3);
}

.id-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
}

.legend-box {
  width: 16px;
  height: 16px;
  background: #fff;
  border: 1px solid #c2e7b0;
  border-radius: 3px;
}

.legend-box.highlight {
  background: #67C23A;
  border-color: #529b2e;
}

.extension-id-display {
  display: flex;
  align-items: center;
}

.id-input {
  max-width: 500px;
}

.id-placeholder {
  color: #909399;
  font-size: 14px;
}

.error-message {
  margin-top: 16px;
}

.clear-btn {
  margin-left: auto;
  font-weight: 500;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.history-item:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.history-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecf5ff;
  border-radius: 8px;
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-id {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.history-time {
  font-size: 13px;
  color: #909399;
}

.history-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.help-content {
  padding: 8px 0;
}

.help-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  font-size: 14px;
  color: #606266;
}

.help-example {
  margin-top: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  border-left: 4px solid #165DFF;
}

.example-title {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
}

.example-url {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  color: #606266;
  word-break: break-all;
}

.highlight-id {
  color: #165DFF;
  font-weight: 600;
  background: #ecf5ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.install-alert {
  margin-bottom: 20px;
}

.install-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.install-method {
  padding: 20px;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.method-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.method-steps {
  margin: 0;
  padding-left: 20px;
  color: #606266;
  line-height: 2;
}

@media (max-width: 768px) {
  .history-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .install-methods {
    grid-template-columns: 1fr;
  }

  .format-cards {
    grid-template-columns: 1fr;
  }

  .url-segment {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .segment-label {
    margin-left: 0;
  }

  .id-char {
    width: 20px;
    height: 26px;
    font-size: 11px;
  }

  .id-legend {
    gap: 12px;
  }

  .url-arrow-hint {
    flex-direction: column;
  }
}
</style>
