<template>
  <div class="pun-generator">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <ChatDotRound />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <el-steps :active="0" finish-status="wait" simple class="guide-steps">
        <el-step title="输入汉字或拼音" description="输入单个汉字或对应的拼音" />
        <el-step title="筛选类型" description="按谐音梗、双关语等类型筛选" />
        <el-step title="浏览结果" description="查看内容、释义和例句" />
        <el-step title="复制使用" description="一键复制喜欢的梗" />
      </el-steps>
      <el-divider />
      <el-alert type="info" :closable="false">
        <template #title>
          <div class="alert-content">
            <p><strong>功能说明：</strong>输入单个汉字或该汉字拼音，快速生成基于该字音的谐音梗、双关语、网络流行梗等，帮助内容创作者、社交媒体运营快速获得创作灵感</p>
            <p class="example-tips">💡 试试输入：「鱼」「yu」「狗」「gou」「钱」「qian」或直接点击下方热门标签</p>
          </div>
        </template>
      </el-alert>
    </el-card>

    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <MagicStick />
          </el-icon>
          <span>谐音梗生成器</span>
          <el-tag size="small" type="success">收录 {{ totalPuns }} 个谐音梗</el-tag>
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
              {{ tip.label }}
            </el-tag>
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
              全部
            </el-tag>
            <el-tag
              v-for="type in punTypes"
              :key="type"
              :type="activeType === type ? getTypeTagType(type) : 'info'"
              :effect="activeType === type ? 'dark' : 'plain'"
              class="category-tag"
              @click="selectType(type)"
            >
              {{ type }}
            </el-tag>
          </div>
        </div>

        <div class="character-picker">
          <div class="picker-label">汉字选择：</div>
          <div class="character-grid">
            <el-tag
              v-for="char in allCharacters"
              :key="char.character"
              size="small"
              :type="selectedChar === char.character ? 'primary' : 'info'"
              :effect="selectedChar === char.character ? 'dark' : 'plain'"
              class="char-tag"
              @click="selectCharacter(char)"
            >
              <span class="char-main">{{ char.character }}</span>
              <span class="char-pinyin">{{ char.pinyin }}</span>
            </el-tag>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="pun-results">
        <div class="list-header">
          <el-icon :size="16" color="#165DFF"><List /></el-icon>
          <span>生成结果</span>
          <el-tag v-if="selectedCharacter" size="small" type="primary">
            汉字：「{{ selectedCharacter.character }}」拼音：{{ selectedCharacter.pinyin }}
          </el-tag>
          <el-tag v-if="activeType" size="small" type="warning">
            类型：{{ activeType }}
          </el-tag>
          <el-tag size="small" type="info">共 {{ filteredResults.length }} 个梗</el-tag>
        </div>

        <el-empty
          v-if="filteredResults.length === 0"
          description="暂无匹配的谐音梗"
          :image-size="100"
        >
          <template #description>
            <div class="empty-wrapper">
              <p v-if="searchKeyword.trim()">未找到与「<strong>{{ searchKeyword }}</strong>」相关的谐音梗</p>
              <p v-else>请输入汉字或拼音开始生成谐音梗</p>
              <el-alert type="info" :closable="false" class="search-capability-alert">
                <template #title>
                  <div class="capability-tips">
                    <p>📌 使用提示：</p>
                    <ul>
                      <li><strong>单个汉字</strong>：如 鱼、马、鸡、狗、猪、钱、饭...</li>
                      <li><strong>汉字拼音</strong>：如 yu、ma、ji、gou、zhu、qian...</li>
                      <li><strong>支持的梗类型</strong>：谐音梗、双关语、网络流行梗、成语谐音、品牌梗、歇后语</li>
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
              <el-tag :type="getTypeTagType(pun.type)" size="small" effect="plain" class="type-tag">
                {{ pun.type }}
              </el-tag>
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
              <el-button size="small" type="primary" link @click="copyToClipboard(pun.content, '谐音梗')">
                <el-icon><CopyDocument /></el-icon>
                复制
              </el-button>
              <el-button size="small" type="success" link @click="copyToClipboard(generateShareText(pun), '完整内容')">
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
        <p>💡 基于「{{ selectedCharacter.character }}」的同音字，可以结合这些字创造更多谐音梗：</p>
        <div class="homophone-chars">
          <el-tag
            v-for="char in selectedCharacter.homophoneChars"
            :key="char"
            size="small"
            type="success"
            effect="plain"
            class="homophone-tag"
            @click="quickSearch(char)"
          >
            {{ char }}
          </el-tag>
        </div>
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
  Star
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { punDatabase, quickSearchTips, punTypes, type PunCharacter, type PunItem, type PunType } from '@/data/puns'

const searchKeyword = ref<string>('')
const activeType = ref<PunType | ''>('')
const selectedChar = ref<string>('')

const allCharacters = computed(() => punDatabase)

const totalPuns = computed(() => {
  return punDatabase.reduce((sum, char) => sum + char.puns.length, 0)
})

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

  return results
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

const generateShareText = (pun: PunItem): string => {
  let text = `【谐音梗】${pun.content}`
  if (pun.explanation) {
    text += `\n释义：${pun.explanation}`
  }
  if (pun.example) {
    text += `\n例句：${pun.example}`
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

.character-picker {
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.picker-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  margin-bottom: 10px;
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
  padding: 6px 12px;
  transition: all 0.3s;
}

.char-tag:hover {
  transform: translateY(-1px);
}

.char-main {
  font-size: 16px;
  font-weight: 600;
}

.char-pinyin {
  font-size: 11px;
  opacity: 0.8;
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
  margin-bottom: 16px;
  flex-wrap: wrap;
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

.type-tag {
  flex-shrink: 0;
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
  margin: 4px 0;
  font-size: 13px;
  line-height: 1.6;
  color: #606266;
}

.capability-tips li strong {
  color: #165DFF;
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

@media (max-width: 768px) {
  .pun-grid {
    grid-template-columns: 1fr;
  }

  .search-tips {
    flex-wrap: wrap;
  }
}
</style>
