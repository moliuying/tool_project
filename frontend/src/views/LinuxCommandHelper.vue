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
          <div class="alert-content">
            <p><strong>查询能力说明：</strong>支持模糊搜索，可通过命令名、中文描述、选项名、示例内容快速定位</p>
            <p class="example-tips">💡 试试搜索：「文件复制」「递归」「网络连接」「压缩解压」或直接输入命令名</p>
          </div>
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
            placeholder="命令名 / 中文名 / 功能描述 / 选项 / 示例关键词，如: ls、列出目录、文件复制、ssh..."
            size="large"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <div class="search-tips">
            <el-tag v-for="tip in searchTips" :key="tip.label" size="small" type="info" effect="plain" class="tip-tag" @click="quickSearch(tip.keyword)">
              <el-icon><component :is="tip.icon" /></el-icon>
              {{ tip.label }}
            </el-tag>
          </div>
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
          <el-tag v-if="searchKeyword.trim()" size="small" type="warning" effect="plain">
            关键词：「{{ searchKeyword }}」
          </el-tag>
        </div>

        <el-empty
          v-if="filteredCommands.length === 0"
          description="未找到匹配的命令"
          :image-size="100"
        >
          <template #description>
            <div class="empty-wrapper">
              <p>未找到与「<strong>{{ searchKeyword }}</strong>」匹配的命令</p>
              <el-alert v-if="getSuggestions(searchKeyword).length > 0" type="warning" :closable="false" class="suggest-alert">
                <template #title>
                  <div class="suggest-box">
                    <span>💡 你可能想搜索：</span>
                    <el-tag
                      v-for="sug in getSuggestions(searchKeyword)"
                      :key="sug"
                      size="small"
                      type="warning"
                      effect="dark"
                      class="suggest-tag"
                      @click="quickSearch(sug)"
                    >
                      {{ sug }}
                    </el-tag>
                  </div>
                </template>
              </el-alert>
              <el-alert type="info" :closable="false" class="search-capability-alert">
                <template #title>
                  <div class="capability-tips">
                    <p>📌 支持的搜索方式：</p>
                    <ul>
                      <li><strong>命令名</strong>：如 ls、grep、ssh</li>
                      <li><strong>中文功能描述</strong>：如「文件复制」「网络连接」</li>
                      <li><strong>俗称/别名</strong>：如「解压」「列文件」「杀进程」</li>
                      <li><strong>选项参数</strong>：如 -R、-z、-v</li>
                      <li><strong>场景关键词</strong>：如「查看日志」「端口占用」</li>
                    </ul>
                  </div>
                </template>
              </el-alert>
            </div>
          </template>
        </el-empty>

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
            <div class="command-desc" v-html="highlightKeyword(cmd.description, searchKeyword)"></div>
            <div v-if="getMatchReason(cmd, searchKeyword)" class="match-reason">
              <el-tag size="small" type="success" effect="plain">
                <el-icon><Right /></el-icon>
                {{ getMatchReason(cmd, searchKeyword) }}
              </el-tag>
            </div>
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
        <div v-if="getAliasesForCmd(selectedCommand.name).length > 0" class="aliases-box">
          <el-tag size="small" type="success" effect="plain">
            <el-icon><Link /></el-icon>
            别名/俗称
          </el-tag>
          <div class="aliases-list">
            <el-tag
              v-for="alias in getAliasesForCmd(selectedCommand.name)"
              :key="alias"
              size="small"
              type="success"
              effect="dark"
              class="alias-tag"
              @click="quickSearch(alias)"
            >
              {{ alias }}
            </el-tag>
          </div>
        </div>
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
  DataLine,
  Files,
  Connection,
  Folder,
  Lock,
  VideoPlay,
  Grid
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { linuxCommands, type LinuxCommand } from '@/data/linuxCommands'

const searchKeyword = ref('')
const activeCategory = ref('')
const selectedCommand = ref<LinuxCommand | null>(null)

const totalCommands = computed(() => linuxCommands.length)

const searchTips = [
  { label: '模糊搜索', icon: Search, keyword: '' },
  { label: '命令名称', icon: Document, keyword: 'ls' },
  { label: '中文关键词', icon: Files, keyword: '文件复制' },
  { label: '选项参数', icon: Setting, keyword: '-R' },
  { label: '使用场景', icon: Folder, keyword: '网络连接' }
]

const aliasMap: Record<string, string[]> = {
  'ls': ['列出目录', '查看目录', '显示文件', '列文件', 'dir'],
  'cd': ['切换目录', '进入目录', '改变目录'],
  'pwd': ['当前路径', '当前目录', '显示当前路径'],
  'cat': ['查看文件', '显示文件内容', '连接文件', '猫'],
  'mkdir': ['创建目录', '新建目录', '建文件夹', 'md'],
  'cp': ['复制文件', '拷贝', '复制', 'copy'],
  'mv': ['移动文件', '重命名', '改名', '剪切', 'move'],
  'rm': ['删除文件', '删除目录', '移除', 'remove', '删'],
  'grep': ['搜索文本', '文本搜索', '查找内容', '正则搜索', '过滤'],
  'tail': ['查看尾部', '查看末尾', '实时查看', '跟踪日志'],
  'head': ['查看头部', '查看开头', '前几行'],
  'sed': ['文本替换', '流编辑器', '替换字符串', '批量替换'],
  'awk': ['文本处理', '数据提取', '格式化输出', 'awk脚本'],
  'wc': ['统计行数', '字数统计', '字符统计', '统计词数', 'word count'],
  'sort': ['排序', '文件排序'],
  'uniq': ['去重', '唯一', '去除重复'],
  'cut': ['截取', '分割', '提取列', '剪切'],
  'less': ['分页查看', '浏览文件', 'more'],
  'find': ['查找文件', '搜索文件', '文件搜索', '遍历目录'],
  'tar': ['打包', '压缩解压', '解压', '解包', '压缩', 'tar.gz', 'tgz', '归档', 'tar.bz2', 'tar.xz'],
  'gzip': ['压缩', '解压', 'gz压缩', 'gz解压', 'gnu压缩'],
  'gunzip': ['解压', 'gz解压', '解压缩gzip'],
  'zip': ['压缩', '打包', 'zip压缩', '创建压缩包'],
  'unzip': ['解压', '解压缩', 'zip解压', '提取zip', '解包'],
  'bzip2': ['压缩', '解压', 'bz2压缩', '高压缩率'],
  'chmod': ['修改权限', '权限', '改权限'],
  'chown': ['修改所有者', '改所属', '所有者'],
  'ps': ['查看进程', '进程列表', '进程状态'],
  'top': ['进程监控', '系统监控', '实时进程', 'cpu占用'],
  'kill': ['杀进程', '结束进程', '终止进程'],
  'du': ['磁盘使用', '目录大小', '文件大小', '占用空间'],
  'df': ['磁盘空间', '磁盘剩余', '分区信息', '硬盘空间'],
  'ssh': ['远程连接', '远程登录', 'secure shell'],
  'scp': ['远程复制', '跨机复制', 'ssh拷贝'],
  'rsync': ['同步文件', '文件同步', '远程同步', '增量备份'],
  'netstat': ['网络状态', '端口查看', '网络连接', '端口占用'],
  'ss': ['socket统计', '网络端口', '连接信息'],
  'curl': ['请求网址', '下载文件', 'http请求', 'api测试'],
  'wget': ['下载', '网页下载', '批量下载'],
  'ping': ['网络连通', '延迟测试', 'ping通', '网络测试'],
  'systemctl': ['服务管理', '系统服务', '启动服务', '停止服务', 'systemd'],
  'journalctl': ['查看日志', '系统日志', 'journal日志']
}

const synonymMap: Record<string, string> = {
  '拷贝': '复制',
  '删除': '移除',
  '目录': '文件夹',
  '档案': '文件',
  '检视': '查看',
  '搜寻': '搜索',
  '网路': '网络',
  '磁碟': '磁盘',
  '权限': '许可',
  '行程': '进程',
  '连接埠': '端口',
  '解压缩': '解压',
  '解包': '解压',
  '打包': '压缩'
}

const normalizeKeyword = (kw: string): string => {
  let result = kw.toLowerCase().trim()
  for (const [syn, replacement] of Object.entries(synonymMap)) {
    result = result.replace(new RegExp(syn, 'g'), replacement)
  }
  return result
}

const getAliasesForCmd = (cmdName: string): string[] => {
  return aliasMap[cmdName] || []
}

const matchByAlias = (cmd: LinuxCommand, keyword: string): boolean => {
  const aliases = getAliasesForCmd(cmd.name)
  return aliases.some(alias => alias.toLowerCase().includes(keyword) || keyword.includes(alias.toLowerCase()))
}

const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const highlightKeyword = (text: string, keyword: string): string => {
  if (!keyword.trim()) return escapeHtml(text)
  const escapedHtml = escapeHtml(text)
  const patterns = [
    keyword.trim(),
    normalizeKeyword(keyword)
  ]
  const uniquePatterns = [...new Set(patterns.filter(p => p.length > 0))]
  let result = escapedHtml
  uniquePatterns.forEach(pat => {
    const regex = new RegExp(`(${pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    result = result.replace(regex, '<span class="highlight">$1</span>')
  })
  return result
}

const getMatchReason = (cmd: LinuxCommand, keyword: string): string | null => {
  if (!keyword.trim()) return null
  const kw = normalizeKeyword(keyword)
  const originalKw = keyword.trim()

  if (cmd.name.toLowerCase().includes(kw) || cmd.name.toLowerCase().includes(originalKw.toLowerCase())) {
    return `匹配命令名：${cmd.name}`
  }

  const aliases = getAliasesForCmd(cmd.name)
  const matchedAlias = aliases.find(alias =>
    alias.toLowerCase().includes(kw) || kw.includes(alias.toLowerCase()) ||
    alias.includes(originalKw) || originalKw.includes(alias)
  )
  if (matchedAlias) {
    return `匹配别名：${matchedAlias}`
  }

  if (cmd.description.toLowerCase().includes(kw) || cmd.description.includes(originalKw)) {
    return '匹配功能描述'
  }

  const matchedOption = cmd.options.find(opt =>
    opt.name.toLowerCase().includes(kw) ||
    opt.description.toLowerCase().includes(kw) ||
    opt.description.includes(originalKw)
  )
  if (matchedOption) {
    return `匹配选项：${matchedOption.name}`
  }

  const matchedExample = cmd.examples.find(ex =>
    ex.command.toLowerCase().includes(kw) ||
    ex.description.toLowerCase().includes(kw) ||
    ex.description.includes(originalKw)
  )
  if (matchedExample) {
    return '匹配使用示例'
  }

  if (cmd.syntax.toLowerCase().includes(kw)) {
    return '匹配语法格式'
  }

  return null
}

const commonSuggestions: Record<string, string[]> = {
  '解压': ['tar', 'unzip', 'gunzip'],
  '压缩': ['tar', 'zip', 'gzip', 'bzip2'],
  '打包': ['tar', 'zip'],
  '文件': ['ls', 'cp', 'mv', 'rm', 'find', 'cat'],
  '目录': ['ls', 'cd', 'pwd', 'mkdir', 'du'],
  '网络': ['ssh', 'ping', 'curl', 'netstat', 'ss', 'wget'],
  '进程': ['ps', 'top', 'kill'],
  '文本': ['grep', 'sed', 'awk', 'wc', 'sort', 'head', 'tail'],
  '权限': ['chmod', 'chown'],
  '日志': ['tail', 'journalctl', 'less'],
  '下载': ['wget', 'curl'],
  '远程': ['ssh', 'scp', 'rsync'],
  '端口': ['netstat', 'ss'],
  '搜索': ['find', 'grep']
}

const getSuggestions = (keyword: string): string[] => {
  if (!keyword.trim()) return []
  const kw = keyword.trim().toLowerCase()
  const suggestions: string[] = []

  for (const [key, cmds] of Object.entries(commonSuggestions)) {
    if (key.includes(kw) || kw.includes(key)) {
      suggestions.push(...cmds)
    }
  }

  for (const [cmdName, aliases] of Object.entries(aliasMap)) {
    if (aliases.some(alias =>
      alias.toLowerCase().includes(kw) || kw.includes(alias.toLowerCase())
    )) {
      suggestions.push(cmdName)
    }
  }

  const allCmds = linuxCommands.map(c => c.name)
  for (const cmd of allCmds) {
    if (cmd.includes(kw) && !suggestions.includes(cmd)) {
      suggestions.push(cmd)
    }
  }

  return [...new Set(suggestions)].slice(0, 6)
}

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
    const keyword = normalizeKeyword(searchKeyword.value)
    result = result.filter(cmd => {
      if (matchByAlias(cmd, keyword)) return true
      const nameMatch = cmd.name.toLowerCase().includes(keyword)
      const descMatch = cmd.description.toLowerCase().includes(keyword) || cmd.description.includes(searchKeyword.value.trim())
      const syntaxMatch = cmd.syntax.toLowerCase().includes(keyword)
      const optionMatch = cmd.options.some(opt =>
        opt.name.toLowerCase().includes(keyword) ||
        opt.description.toLowerCase().includes(keyword) ||
        opt.description.includes(searchKeyword.value.trim())
      )
      const exampleMatch = cmd.examples.some(ex =>
        ex.command.toLowerCase().includes(keyword) ||
        ex.description.toLowerCase().includes(keyword) ||
        ex.description.includes(searchKeyword.value.trim())
      )
      return nameMatch || descMatch || syntaxMatch || optionMatch || exampleMatch
    })
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

  .search-tips {
    flex-wrap: wrap;
  }

  .aliases-box {
    flex-direction: column;
    align-items: flex-start !important;
  }
}

.alert-content p {
  margin: 6px 0;
  font-size: 14px;
  line-height: 1.6;
}

.alert-content .example-tips {
  font-size: 13px;
  color: #606266;
  padding-left: 2px;
}

.search-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.tip-tag {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.tip-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(144, 147, 153, 0.3);
  background: #165DFF;
  border-color: #165DFF;
  color: #fff;
}

.aliases-box {
  margin-top: 12px;
  padding: 12px;
  background: #f0f9eb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.aliases-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
}

.alias-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.alias-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
}

.highlight {
  background-color: #fff7e6;
  color: #e6a23c;
  padding: 0 3px;
  border-radius: 3px;
  font-weight: 600;
}

.match-reason {
  margin-bottom: 8px;
}

.match-reason .el-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.empty-wrapper {
  text-align: left;
  padding: 0 20px;
}

.empty-wrapper p {
  color: #606266;
  margin: 10px 0;
  line-height: 1.6;
}

.empty-wrapper strong {
  color: #f56c6c;
}

.suggest-alert {
  margin: 12px 0;
}

.suggest-box {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.suggest-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.suggest-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(230, 162, 60, 0.3);
}

.search-capability-alert {
  margin-top: 12px;
}

.capability-tips p {
  margin: 0 0 8px 0;
  font-weight: 600;
}

.capability-tips ul {
  margin: 0;
  padding-left: 20px;
}

.capability-tips li {
  margin: 4px 0;
  font-size: 13px;
  line-height: 1.6;
  color: #606266;
}

.capability-tips li strong {
  color: #165DFF;
}
</style>
