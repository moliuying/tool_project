<template>
  <div class="pun-generator">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <ChatDotRound />
          </el-icon>
          <span>使用说明 & 结果预期</span>
        </div>
      </template>
      <el-steps :active="0" finish-status="wait" simple class="guide-steps">
        <el-step title="输入汉字或拼音" description="支持单个汉字或拼音搜索" />
        <el-step title="查看结果预览" description="选择前即可看到梗数量和形式" />
        <el-step title="筛选类型和形式" description="按类型或输出形式精准过滤" />
        <el-step title="复制使用" description="一键复制梗或完整文案" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Collection /></el-icon>
            <div class="exp-text">
              <div class="exp-num">约 5~10 条</div>
              <div class="exp-label">每个汉字的谐音梗</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><Goods /></el-icon>
            <div class="exp-text">
              <div class="exp-num">6 种形式</div>
              <div class="exp-label">两字词 / 三字词 / 四字成语 / 多字短语 / 完整句子 / 歇后语</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><DocumentCopy /></el-icon>
            <div class="exp-text">
              <div class="exp-num">3 层信息</div>
              <div class="exp-label">梗内容 + 释义 + 用法例句</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Histogram /></el-icon>
            <div class="exp-text">
              <div class="exp-num">6 种类型</div>
              <div class="exp-label">谐音梗 / 双关语 / 网络流行梗 / 成语谐音 / 品牌梗 / 歇后语</div>
            </div>
          </div>
        </div>
        <el-divider />
        <h4 class="expectation-title">🎯 示例预览</h4>
        <div class="preview-samples">
          <div class="preview-item" v-for="(sample, i) in previewSamples" :key="i">
            <div class="preview-content">{{ sample.content }}</div>
            <div class="preview-meta">
              <el-tag size="small" :type="getTypeTagType(sample.type)" effect="plain">{{ sample.type }}</el-tag>
              <el-tag size="small" type="info" effect="plain">{{ detectPunForm(sample) }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <MagicStick />
          </el-icon>
          <span>谐音梗生成器</span>
          <el-tag size="small" type="success">收录 {{ totalPuns }} 个谐音梗 · {{ punDatabase.length }} 个汉字</el-tag>
        </div>
      </template>

      <div class="search-section">
        <div class="search-input-wrapper">
          <el-input
            v-model="searchKeyword"
            placeholder="输入单个汉字或汉字拼音，如：鱼、yu、钱、qian..."
            size="large"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <div class="search-tips">
            <span class="tip-label">🔥 热门搜索：</span>
            <el-tag
              v-for="tip in quickSearchTips"
              :key="tip.keyword"
              size="small"
              type="info"
              effect="plain"
              class="tip-tag"
              @click="quickSearch(tip.keyword)"
            >
              <el-icon><component :is="getTipIcon(tip.label)" /></el-icon>
              {{ tip.label }}（{{ getCharCount(tip.keyword) }}条）
            </el-tag>
          </div>
        </div>

        <div class="character-picker">
          <div class="picker-header">
            <div class="picker-label">📝 选择汉字（鼠标悬停查看详情）</div>
            <div class="picker-stats">共 {{ punDatabase.length }} 个汉字可选</div>
          </div>
          <div class="character-grid">
            <el-tooltip
              v-for="char in allCharacters"
              :key="char.character"
              placement="top"
              :show-after="200"
            >
              <template #content>
                <div class="char-tooltip">
                  <div class="tooltip-title">
                    <span class="tooltip-char">{{ char.character }}</span>
                    <span class="tooltip-pinyin">{{ char.pinyin }}</span>
                  </div>
                  <div class="tooltip-count">共收录 <strong>{{ char.puns.length }}</strong> 个谐音梗</div>
                  <div class="tooltip-forms">
                    <span class="form-label">包含形式：</span>
                    <el-tag
                      v-for="form in getUniqueFormsForChar(char)"
                      :key="form"
                      size="small"
                      type="success"
                      effect="plain"
                    >{{ form }}</el-tag>
                  </div>
                  <div class="tooltip-preview">
                    <div class="preview-label">示例：</div>
                    <div class="preview-list">
                      <div v-for="(p, i) in char.puns.slice(0, 3)" :key="i" class="tooltip-pun">
                        • {{ p.content }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <el-tag
                size="small"
                :type="selectedChar === char.character ? 'primary' : 'info'"
                :effect="selectedChar === char.character ? 'dark' : 'plain'"
                class="char-tag"
                @click="selectCharacter(char)"
              >
                <span class="char-main">{{ char.character }}</span>
                <span class="char-pinyin">{{ char.pinyin }}</span>
                <span class="char-count">{{ char.puns.length }}条</span>
              </el-tag>
            </el-tooltip>
          </div>
        </div>

        <div class="filter-row">
          <div class="category-filter">
            <span class="filter-label">梗类型：</span>
            <el-tag
              :type="activeType === '' ? 'primary' : 'info'"
              :effect="activeType === '' ? 'dark' : 'plain'"
              class="category-tag"
              @click="selectType('')"
            >
              全部（{{ totalPuns }}）
            </el-tag>
            <el-tag
              v-for="type in punTypes"
              :key="type"
              :type="activeType === type ? getTypeTagType(type) : 'info'"
              :effect="activeType === type ? 'dark' : 'plain'"
              class="category-tag"
              @click="selectType(type)"
            >
              {{ type }}（{{ getTypeCount(type) }}）
            </el-tag>
          </div>
        </div>

        <div class="filter-row">
          <div class="category-filter">
            <span class="filter-label">输出形式：</span>
            <el-tag
              :type="activeForm === '' ? 'warning' : 'info'"
              :effect="activeForm === '' ? 'dark' : 'plain'"
              class="category-tag"
              @click="selectForm('')"
            >
              全部形式
            </el-tag>
            <el-tag
              v-for="form in punForms"
              :key="form"
              :type="activeForm === form ? 'warning' : 'info'"
              :effect="activeForm === form ? 'dark' : 'plain'"
              class="category-tag"
              @click="selectForm(form)"
            >
              {{ form }}
            </el-tag>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="pun-results">
        <div class="list-header">
          <el-icon :size="16" color="#165DFF"><List /></el-icon>
          <span>生成结果</span>
          <template v-if="selectedCharacter">
            <el-tag size="small" type="primary">
              汉字：「{{ selectedCharacter.character }}」
            </el-tag>
            <el-tag size="small" type="primary" effect="plain">
              拼音：{{ selectedCharacter.pinyin }}
            </el-tag>
          </template>
          <el-tag v-if="activeType" size="small" type="success">
            类型：{{ activeType }}
          </el-tag>
          <el-tag v-if="activeForm" size="small" type="warning">
            形式：{{ activeForm }}
          </el-tag>
          <el-tag size="small" type="info" effect="dark">
            共 {{ filteredResults.length }} 个梗
          </el-tag>
        </div>

        <div v-if="filteredResults.length > 0" class="result-summary">
          <div class="summary-item">
            <span class="summary-label">形式分布：</span>
            <el-tag
              v-for="(count, form) in formDistribution"
              :key="form"
              size="small"
              type="warning"
              effect="plain"
            >
              {{ form }} {{ count }}条
            </el-tag>
          </div>
        </div>

        <el-empty
          v-if="filteredResults.length === 0"
          description="暂无匹配的谐音梗"
          :image-size="100"
        >
          <template #description>
            <div class="empty-wrapper">
              <p v-if="searchKeyword.trim()">未找到与「<strong>{{ searchKeyword }}</strong>」相关的谐音梗</p>
              <p v-else>请输入汉字或拼音，或点击上方汉字卡片开始生成谐音梗</p>
              <el-alert type="info" :closable="false" class="search-capability-alert">
                <template #title>
                  <div class="capability-tips">
                    <p>📌 使用提示 & 结果预期：</p>
                    <ul>
                      <li><strong>单个汉字</strong>：如 鱼（8条）、马（8条）、鸡（8条）、狗（8条）、猪（7条）、钱（7条）、饭（7条）...</li>
                      <li><strong>汉字拼音</strong>：如 yu、ma、ji、gou、zhu、qian、fan...</li>
                      <li><strong>梗的内容形式</strong>：
                        <el-tag size="small">两字词</el-tag>
                        <el-tag size="small">三字词</el-tag>
                        <el-tag size="small">四字成语</el-tag>
                        <el-tag size="small">多字短语</el-tag>
                        <el-tag size="small">完整句子</el-tag>
                        <el-tag size="small">歇后语</el-tag>
                      </li>
                      <li><strong>每条梗包含</strong>：内容 + 释义 + 用法例句</li>
                    </ul>
                  </div>
                </template>
              </el-alert>
            </div>
          </template>
        </el-empty>

        <div v-else class="pun-grid">
          <div
            v-for="(pun, index) in filteredResults"
            :key="pun.content + index"
            class="pun-card"
          >
            <div class="pun-card-header">
              <div class="pun-content-wrapper">
                <span class="pun-content">{{ pun.content }}</span>
                <el-tag v-if="pun.hot" size="small" type="danger" effect="dark" class="hot-tag">
                  <el-icon><HotWater /></el-icon>
                  热门
                </el-tag>
              </div>
              <div class="pun-tags">
                <el-tag :type="getTypeTagType(pun.type)" size="small" effect="plain" class="type-tag">
                  {{ pun.type }}
                </el-tag>
                <el-tag type="warning" size="small" effect="plain" class="form-tag">
                  {{ detectPunForm(pun) }}
                </el-tag>
              </div>
            </div>
            <div v-if="pun.explanation" class="pun-section">
              <div class="section-label">
                <el-icon :size="12" color="#165DFF"><Document /></el-icon>
                <span>释义</span>
              </div>
              <div class="pun-explanation">{{ pun.explanation }}</div>
            </div>
            <div v-if="pun.example" class="pun-section">
              <div class="section-label">
                <el-icon :size="12" color="#f56c6c"><Promotion /></el-icon>
                <span>用法例句</span>
              </div>
              <div class="pun-example">{{ pun.example }}</div>
            </div>
            <div class="pun-card-footer">
              <el-button size="small" type="primary" link @click="copyToClipboard(pun.content, '谐音梗内容')">
                <el-icon><CopyDocument /></el-icon>
                复制内容
              </el-button>
              <el-button size="small" type="success" link @click="copyToClipboard(generateShareText(pun), '完整文案')">
                <el-icon><Share /></el-icon>
                复制完整
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="selectedCharacter && selectedCharacter.homophoneChars.length > 0" class="homophone-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="16" color="#67c23a">
            <Connection />
          </el-icon>
          <span>同音字联想</span>
          <el-tag size="small" type="success">相关同音字：{{ selectedCharacter.homophoneChars.join('、') }}</el-tag>
        </div>
      </template>
      <div class="homophone-tips">
        <p>💡 基于「{{ selectedCharacter.character }}」（{{ selectedCharacter.pinyin }}）的同音字，你可以结合这些字创造更多谐音梗：</p>
        <div class="homophone-chars">
          <el-tag
            v-for="char in selectedCharacter.homophoneChars"
            :key="char"
            size="small"
            type="success"
            effect="plain"
            class="homophone-tag"
            @click="trySearchHomophone(char)"
          >
            {{ char }}
          </el-tag>
        </div>
        <p class="tip-note">* 点击同音字尝试搜索，若未收录可作为你自创梗的灵感</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  MagicStick,
  ChatDotRound,
  Document,
  Promotion,
  CopyDocument,
  List,
  Share,
  HotWater,
  Connection,
  DataLine,
  Files,
  Folder,
  Star,
  Collection,
  Goods,
  DocumentCopy,
  Histogram
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  punDatabase,
  quickSearchTips,
  punTypes,
  punForms,
  detectPunForm,
  type PunCharacter,
  type PunItem,
  type PunType,
  type PunForm
} from '@/data/puns'

const searchKeyword = ref<string>('')
const activeType = ref<PunType | ''>('')
const activeForm = ref<PunForm | ''>('')
const selectedChar = ref<string>('')

const allCharacters = computed(() => punDatabase)

const totalPuns = computed(() => {
  return punDatabase.reduce((sum, char) => sum + char.puns.length, 0)
})

const previewSamples = computed<PunItem[]>(() => {
  return [
    punDatabase[0].puns[0],
    punDatabase[6].puns[3],
    punDatabase[8].puns[0],
    punDatabase[2].puns[3]
  ]
})

const getCharCount = (keyword: string): number => {
  const found = punDatabase.find(c => c.character === keyword)
  return found ? found.puns.length : 0
}

const getTypeCount = (type: PunType): number => {
  let count = 0
  punDatabase.forEach(char => {
    char.puns.forEach(pun => {
      if (pun.type === type) count++
    })
  })
  return count
}

const getUniqueFormsForChar = (char: PunCharacter): PunForm[] => {
  const forms = new Set<PunForm>()
  char.puns.forEach(pun => forms.add(detectPunForm(pun)))
  return Array.from(forms)
}

const selectedCharacter = computed<PunCharacter | null>(() => {
  if (!searchKeyword.value.trim()) {
    if (selectedChar.value) {
      return punDatabase.find(char => char.character === selectedChar.value) || null
    }
    return null
  }

  const kw = searchKeyword.value.trim().toLowerCase()

  let found = punDatabase.find(char => char.character === kw)
  if (found) return found

  found = punDatabase.find(char =>
    char.pinyinPlain.toLowerCase() === kw ||
    char.pinyin.toLowerCase() === kw
  )
  if (found) return found

  found = punDatabase.find(char =>
    char.character.includes(kw) ||
    char.pinyinPlain.toLowerCase().includes(kw) ||
    char.homophoneChars.some(h => h.includes(kw))
  )

  return found || null
})

const filteredResults = computed<PunItem[]>(() => {
  if (!selectedCharacter.value) return []

  let results = [...selectedCharacter.value.puns]

  if (activeType.value) {
    results = results.filter(pun => pun.type === activeType.value)
  }

  if (activeForm.value) {
    results = results.filter(pun => detectPunForm(pun) === activeForm.value)
  }

  return results
})

const formDistribution = computed<Record<string, number>>(() => {
  const dist: Record<string, number> = {}
  filteredResults.value.forEach(pun => {
    const form = detectPunForm(pun)
    dist[form] = (dist[form] || 0) + 1
  })
  return dist
})

const getTipIcon = (label: string) => {
  const iconMap: Record<string, any> = {
    '摸鱼梗': DataLine,
    '单身狗': Star,
    '鸡你太美': Files,
    '真牛': Folder
  }
  return iconMap[label] || Star
}

const getTypeTagType = (type: PunType): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const typeMap: Record<PunType, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    '谐音梗': 'primary',
    '双关语': 'success',
    '网络流行梗': 'danger',
    '成语谐音': 'warning',
    '品牌梗': 'warning',
    '歇后语': 'info'
  }
  return typeMap[type] || 'info'
}

const handleSearch = () => {
  if (selectedCharacter.value) {
    selectedChar.value = selectedCharacter.value.character
  }
}

const selectType = (type: PunType | '') => {
  activeType.value = type
}

const selectForm = (form: PunForm | '') => {
  activeForm.value = form
}

const selectCharacter = (char: PunCharacter) => {
  searchKeyword.value = char.character
  selectedChar.value = char.character
}

const quickSearch = (keyword: string) => {
  searchKeyword.value = keyword
  const found = punDatabase.find(char => char.character === keyword)
  if (found) {
    selectedChar.value = found.character
  }
}

const trySearchHomophone = (char: string) => {
  const found = punDatabase.find(c => c.character === char)
  if (found) {
    quickSearch(char)
  } else {
    ElMessage.info(`「${char}」暂未收录，可作为你自创谐音梗的灵感哦！`)
  }
}

const generateShareText = (pun: PunItem): string => {
  let text = `【谐音梗】${pun.content}（${pun.type} · ${detectPunForm(pun)}）`
  if (pun.explanation) {
    text += `\n📖 释义：${pun.explanation}`
  }
  if (pun.example) {
    text += `\n💬 例句：${pun.example}`
  }
  return text
}

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`${label}已复制到剪贴板！`)
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}
</script>

<style scoped>
.pun-generator {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card,
.search-card,
.homophone-card {
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

.expectation-section {
  padding: 0 8px;
}

.expectation-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.expectation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.expectation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
  border: 1px solid #d9ecff;
}

.exp-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.exp-num {
  font-size: 16px;
  font-weight: 700;
  color: #165DFF;
}

.exp-label {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.preview-samples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.preview-item {
  padding: 12px;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.3s;
}

.preview-item:hover {
  border-color: #165DFF;
  background: #f0f7ff;
}

.preview-content {
  font-size: 16px;
  font-weight: 600;
  color: #165DFF;
  margin-bottom: 6px;
}

.preview-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.search-section {
  padding: 8px 0;
}

.search-input-wrapper {
  margin-bottom: 16px;
}

.search-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.tip-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  flex-shrink: 0;
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

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 8px;
}

.picker-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.picker-stats {
  font-size: 12px;
  color: #909399;
}

.character-picker {
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.character-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.char-tag {
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
  transition: all 0.3s;
  min-width: 54px;
}

.char-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.2);
}

.char-main {
  font-size: 18px;
  font-weight: 700;
}

.char-pinyin {
  font-size: 10px;
  opacity: 0.85;
}

.char-count {
  font-size: 10px;
  font-weight: 600;
  color: #165DFF;
  background: rgba(22, 93, 255, 0.1);
  padding: 0 6px;
  border-radius: 8px;
  margin-top: 2px;
}

.char-tooltip {
  min-width: 200px;
  max-width: 280px;
}

.tooltip-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e4e7ed;
}

.tooltip-char {
  font-size: 22px;
  font-weight: 700;
  color: #165DFF;
}

.tooltip-pinyin {
  font-size: 14px;
  color: #606266;
}

.tooltip-count {
  font-size: 13px;
  color: #303133;
  margin-bottom: 8px;
}

.tooltip-count strong {
  color: #f56c6c;
  font-size: 15px;
}

.tooltip-forms {
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.form-label {
  font-size: 12px;
  color: #606266;
  flex-shrink: 0;
}

.tooltip-preview {
  padding-top: 6px;
  border-top: 1px dashed #e4e7ed;
}

.preview-label {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.preview-list {
  font-size: 12px;
  color: #303133;
}

.tooltip-pun {
  line-height: 1.8;
  color: #165DFF;
}

.filter-row {
  margin-bottom: 12px;
}

.category-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  flex-shrink: 0;
}

.category-tag {
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.category-tag:hover {
  transform: translateY(-1px);
}

.list-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.result-summary {
  margin-bottom: 16px;
  padding: 10px 14px;
  background: #fdf6ec;
  border-radius: 6px;
  border-left: 3px solid #e6a23c;
}

.summary-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.summary-label {
  font-size: 13px;
  color: #e6a23c;
  font-weight: 600;
}

.pun-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.pun-card {
  padding: 16px;
  background: #fafafa;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.pun-card:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.pun-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
}

.pun-content-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.pun-content {
  font-size: 20px;
  font-weight: 700;
  color: #165DFF;
}

.hot-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.pun-tags {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
  align-items: flex-end;
}

.type-tag,
.form-tag {
  font-size: 11px;
}

.pun-section {
  margin-bottom: 10px;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 4px;
}

.pun-explanation {
  font-size: 13px;
  color: #303133;
  line-height: 1.6;
  background: #f5f7fa;
  padding: 6px 10px;
  border-radius: 4px;
  border-left: 3px solid #165DFF;
}

.pun-example {
  font-size: 12px;
  color: #303133;
  line-height: 1.5;
  background: #fef0f0;
  padding: 5px 10px;
  border-radius: 4px;
  border-left: 3px solid #f56c6c;
  font-style: italic;
}

.pun-card-footer {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px dashed #e4e7ed;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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
  margin: 6px 0;
  font-size: 13px;
  line-height: 1.8;
  color: #606266;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.capability-tips li strong {
  color: #165DFF;
}

.homophone-tips {
  padding: 8px 0;
}

.homophone-tips p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.homophone-chars {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.homophone-tag {
  cursor: pointer;
  font-size: 14px;
  padding: 4px 10px;
  transition: all 0.3s;
}

.homophone-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
}

.tip-note {
  font-size: 12px !important;
  color: #909399 !important;
  font-style: italic;
}

@media (max-width: 768px) {
  .pun-grid {
    grid-template-columns: 1fr;
  }

  .search-tips {
    flex-wrap: wrap;
  }

  .expectation-grid {
    grid-template-columns: 1fr;
  }
}
</style>
