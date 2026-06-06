<template>
  <div class="linux-command-helper">
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
        <el-step title="搜索命令" description="输入命令名称或关键词快速搜索" />
        <el-step title="分类浏览" description="按类别筛选查看同类命令" />
        <el-step title="查看详情" description="获取命令语法、参数选项和示例" />
        <el-step title="复制使用" description="一键复制命令或示例到剪贴板" />
      </el-steps>
      <el-divider />
      <el-alert type="info" :closable="false">
        <template #title>
          <span>支持运维工程师、系统管理员、开发者和 Linux 学习者快速查询命令使用方法，无需切换终端或查阅外部文档</span>
        </template>
      </el-alert>
    </el-card>

    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Search />
          </el-icon>
          <span>Linux 命令查询</span>
          <el-tag size="small" type="success">收录 {{ totalCommands }} 个常用命令</el-tag>
        </div>
      </template>

      <div class="search-section">
        <div class="search-input-wrapper">
          <el-input
            v-model="searchKeyword"
            placeholder="输入命令名称或关键词搜索，如: ls、grep、chmod、ssh..."
            size="large"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="category-filter">
          <span class="filter-label">命令分类：</span>
          <el-tag
            :type="activeCategory === '' ? 'primary' : 'info'"
            :effect="activeCategory === '' ? 'dark' : 'plain'"
            class="category-tag"
            @click="selectCategory('')"
          >
            全部
          </el-tag>
          <el-tag
            v-for="cat in categories"
            :key="cat"
            :type="activeCategory === cat ? 'primary' : 'info'"
            :effect="activeCategory === cat ? 'dark' : 'plain'"
            class="category-tag"
            @click="selectCategory(cat)"
          >
            {{ cat }}
            <span class="cat-count">{{ getCategoryCount(cat) }}</span>
          </el-tag>
        </div>

        <div v-if="hotCommands.length > 0" class="hot-commands">
          <span class="hot-label">热门查询：</span>
          <el-tag
            v-for="cmd in hotCommands"
            :key="cmd"
            size="small"
            type="danger"
            effect="plain"
            class="hot-tag"
            @click="quickSearch(cmd)"
          >
            <el-icon><DataLine /></el-icon>
            {{ cmd }}
          </el-tag>
        </div>
      </div>

      <el-divider v-if="!selectedCommand" />

      <div v-if="!selectedCommand" class="command-list">
        <div class="list-header">
          <el-icon :size="16" color="#165DFF"><List /></el-icon>
          <span>查询结果</span>
          <el-tag size="small" type="info">共 {{ filteredCommands.length }} 个命令</el-tag>
        </div>

        <el-empty
          v-if="filteredCommands.length === 0"
          description="未找到匹配的命令，试试其他关键词"
          :image-size="100"
        />

        <div v-else class="command-grid">
          <div
            v-for="cmd in filteredCommands"
            :key="cmd.name"
            class="command-card"
            @click="selectCommand(cmd)"
          >
            <div class="command-card-header">
              <code class="command-name">{{ cmd.name }}</code>
              <el-tag size="small" type="primary" effect="plain">{{ cmd.category }}</el-tag>
            </div>
            <div class="command-desc">{{ cmd.description }}</div>
            <div class="command-card-footer">
              <span class="option-count">
                <el-icon><Setting /></el-icon>
                {{ cmd.options.length }} 个选项
              </span>
              <span class="example-count">
                <el-icon><Promotion /></el-icon>
                {{ cmd.examples.length }} 个示例
              </span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="selectedCommand" class="detail-card">
      <template #header>
        <div class="card-header">
          <el-button size="small" text @click="backToList" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </el-button>
          <code class="detail-command-name">{{ selectedCommand.name }}</code>
          <el-tag size="small" type="primary" effect="dark">{{ selectedCommand.category }}</el-tag>
          <el-button
            size="small"
            type="primary"
            link
            class="copy-btn"
            @click="copyToClipboard(selectedCommand.name, '命令名称')"
          >
            <el-icon><CopyDocument /></el-icon>
            复制命令
          </el-button>
        </div>
      </template>

      <div class="detail-section">
        <div class="section-header">
          <el-icon :size="16" color="#165DFF"><Document /></el-icon>
          <span class="section-title">功能描述</span>
        </div>
        <div class="section-content desc-content">{{ selectedCommand.description }}</div>
      </div>

      <el-divider />

      <div class="detail-section">
        <div class="section-header">
          <el-icon :size="16" color="#67c23a"><Edit /></el-icon>
          <span class="section-title">语法格式</span>
        </div>
        <div class="section-content syntax-content">
          <code>{{ selectedCommand.syntax }}</code>
          <el-button
            size="small"
            type="success"
            link
            @click="copyToClipboard(selectedCommand.syntax, '语法格式')"
          >
            <el-icon><CopyDocument /></el-icon>
            复制
          </el-button>
        </div>
      </div>

      <el-divider />

      <div class="detail-section">
        <div class="section-header">
          <el-icon :size="16" color="#e6a23c"><Setting /></el-icon>
          <span class="section-title">参数选项</span>
          <el-tag size="small" type="warning">共 {{ selectedCommand.options.length }} 个选项</el-tag>
        </div>
        <el-table :data="selectedCommand.options" stripe size="small" class="options-table">
          <el-table-column label="选项" width="220">
            <template #default="{ row }">
              <code class="option-name">{{ row.name }}</code>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="说明" />
          <el-table-column label="操作" width="80" align="center">
            <template #default="{ row }">
              <el-button
                size="small"
                type="primary"
                link
                @click="copyToClipboard(row.name.split(',')[0], '选项')"
              >
                复制
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-divider />

      <div class="detail-section">
        <div class="section-header">
          <el-icon :size="16" color="#f56c6c"><Promotion /></el-icon>
          <span class="section-title">使用示例</span>
          <el-tag size="small" type="danger">共 {{ selectedCommand.examples.length }} 个示例</el-tag>
        </div>
        <div class="examples-list">
          <div v-for="(example, index) in selectedCommand.examples" :key="index" class="example-item">
            <div class="example-header">
              <el-tag size="small" type="danger" effect="dark">示例 {{ index + 1 }}</el-tag>
              <span class="example-desc">{{ example.description }}</span>
            </div>
            <div class="example-command-wrapper">
              <code class="example-command">{{ example.command }}</code>
              <el-button
                size="small"
                type="primary"
                link
                @click="copyToClipboard(example.command, '示例命令')"
              >
                <el-icon><CopyDocument /></el-icon>
                复制命令
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <el-divider v-if="selectedCommand.seeAlso && selectedCommand.seeAlso.length > 0" />

      <div
        v-if="selectedCommand.seeAlso && selectedCommand.seeAlso.length > 0"
        class="detail-section"
      >
        <div class="section-header">
          <el-icon :size="16" color="#909399"><Link /></el-icon>
          <span class="section-title">相关命令</span>
        </div>
        <div class="see-also-list">
          <el-tag
            v-for="relatedCmd in selectedCommand.seeAlso"
            :key="relatedCmd"
            type="info"
            effect="plain"
            class="related-tag"
            @click="jumpToCommand(relatedCmd)"
          >
            <el-icon><Right /></el-icon>
            {{ relatedCmd }}
          </el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Search,
  InfoFilled,
  Document,
  Edit,
  Setting,
  Promotion,
  CopyDocument,
  ArrowLeft,
  Link,
  Right,
  List,
  DataLine
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { linuxCommands, type LinuxCommand } from '@/data/linuxCommands'

const searchKeyword = ref('')
const activeCategory = ref('')
const selectedCommand = ref<LinuxCommand | null>(null)

const totalCommands = computed(() => linuxCommands.length)

const categories = computed(() => {
  const cats = new Set(linuxCommands.map(cmd => cmd.category))
  return Array.from(cats)
})

const getCategoryCount = (category: string): number => {
  return linuxCommands.filter(cmd => cmd.category === category).length
}

const hotCommands = [
  'ls', 'grep', 'find', 'tar', 'ssh', 'chmod', 'ps', 'top', 'sed', 'awk'
]

const filteredCommands = computed(() => {
  let result = linuxCommands

  if (activeCategory.value) {
    result = result.filter(cmd => cmd.category === activeCategory.value)
  }

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(cmd =>
      cmd.name.toLowerCase().includes(keyword) ||
      cmd.description.toLowerCase().includes(keyword) ||
      cmd.syntax.toLowerCase().includes(keyword) ||
      cmd.options.some(opt =>
        opt.name.toLowerCase().includes(keyword) ||
        opt.description.toLowerCase().includes(keyword)
      ) ||
      cmd.examples.some(ex =>
        ex.command.toLowerCase().includes(keyword) ||
        ex.description.toLowerCase().includes(keyword)
      )
    )
  }

  return result
})

const handleSearch = () => {
  selectedCommand.value = null
}

const selectCategory = (cat: string) => {
  activeCategory.value = cat
  selectedCommand.value = null
}

const quickSearch = (keyword: string) => {
  searchKeyword.value = keyword
  handleSearch()
}

const selectCommand = (cmd: LinuxCommand) => {
  selectedCommand.value = cmd
}

const backToList = () => {
  selectedCommand.value = null
}

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(`${label}已复制：${text}`)
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

const jumpToCommand = (cmdName: string) => {
  const found = linuxCommands.find(cmd => cmd.name === cmdName)
  if (found) {
    selectedCommand.value = found
    searchKeyword.value = ''
    activeCategory.value = ''
  } else {
    ElMessage.warning(`未收录命令：${cmdName}`)
  }
}

onMounted(() => {
  if (filteredCommands.value.length === 0) {
    searchKeyword.value = ''
  }
})
</script>

<style scoped>
.linux-command-helper {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card,
.search-card,
.detail-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  flex-wrap: wrap;
}

.guide-steps {
  padding: 10px 0;
}

.search-section {
  padding: 8px 0;
}

.search-input-wrapper {
  margin-bottom: 16px;
}

.category-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.filter-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.category-tag {
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.category-tag:hover {
  transform: translateY(-1px);
}

.cat-count {
  margin-left: 4px;
  font-size: 11px;
  opacity: 0.8;
}

.hot-commands {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #fff0f0 0%, #fff5f0 100%);
  border-radius: 8px;
}

.hot-label {
  font-size: 14px;
  color: #f56c6c;
  font-weight: 500;
}

.hot-tag {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.hot-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
}

.list-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.command-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.command-card {
  padding: 16px;
  background: #fafafa;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.command-card:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.command-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.command-name {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #165DFF;
  background: #ecf5ff;
  padding: 2px 10px;
  border-radius: 4px;
}

.command-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.command-card-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}

.option-count,
.example-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.back-btn {
  font-size: 14px;
}

.copy-btn {
  margin-left: auto;
}

.detail-command-name {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 22px;
  font-weight: 600;
  color: #165DFF;
  background: #ecf5ff;
  padding: 4px 14px;
  border-radius: 6px;
}

.detail-section {
  margin-bottom: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
}

.section-content {
  padding: 0 4px;
}

.desc-content {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
  background: #f5f7fa;
  padding: 12px 16px;
  border-radius: 6px;
  border-left: 4px solid #165DFF;
}

.syntax-content {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f9eb;
  padding: 12px 16px;
  border-radius: 6px;
  border-left: 4px solid #67c23a;
}

.syntax-content code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 15px;
  color: #67c23a;
  font-weight: 500;
}

.options-table {
  margin-top: 8px;
}

.option-name {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  color: #e6a23c;
  background: #fdf6ec;
  padding: 2px 8px;
  border-radius: 3px;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.example-item {
  background: #fef0f0;
  border-radius: 8px;
  padding: 12px 16px;
  border-left: 4px solid #f56c6c;
}

.example-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.example-desc {
  font-size: 13px;
  color: #303133;
}

.example-command-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px 14px;
  border-radius: 6px;
}

.example-command {
  flex: 1;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #f56c6c;
  font-weight: 500;
  word-break: break-all;
}

.see-also-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.related-tag {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.related-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(144, 147, 153, 0.3);
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}

@media (max-width: 768px) {
  .command-grid {
    grid-template-columns: 1fr;
  }

  .detail-command-name {
    font-size: 18px;
  }

  .example-command-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
