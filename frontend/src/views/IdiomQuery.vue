<template>
  <div class="idiom-query">
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
        <el-step title="输入查询" description="输入成语、关键字或拼音" />
        <el-step title="筛选分类" description="按类别或情感色彩筛选成语" />
        <el-step title="浏览结果" description="查看释义、出处、用法例句" />
        <el-step title="查看详情" description="获取近反义词、全部例句等更多信息" />
      </el-steps>
      <el-divider />
      <el-alert type="info" :closable="false">
        <template #title>
          <div class="alert-content">
            <p><strong>查询能力说明：</strong>支持通过成语名称、关键字、拼音、拼音首字母快速搜索，列表直接展示释义、出处和用法例句</p>
            <p class="example-tips">💡 试试搜索：「画龙点睛」「hlbj」「坚持」「学习」或直接输入成语</p>
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
          <span>成语查询</span>
          <el-tag size="small" type="success">收录 {{ totalIdioms }} 个常用成语</el-tag>
        </div>
      </template>

      <div class="search-section">
        <div class="search-input-wrapper">
          <el-input
            v-model="searchKeyword"
            placeholder="成语 / 关键字 / 拼音 / 拼音首字母，如：画龙点睛、hlbj、学习、坚持..."
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

        <div class="filter-row">
          <div class="category-filter">
            <span class="filter-label">成语分类：</span>
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
        </div>

        <div class="filter-row">
          <div class="category-filter">
            <span class="filter-label">情感色彩：</span>
            <el-tag
              :type="activeEmotion === '' ? 'primary' : 'info'"
              :effect="activeEmotion === '' ? 'dark' : 'plain'"
              class="category-tag"
              @click="selectEmotion('')"
            >
              全部
            </el-tag>
            <el-tag
              v-for="emo in emotions"
              :key="emo"
              :type="activeEmotion === emo ? getEmotionType(emo) : 'info'"
              :effect="activeEmotion === emo ? 'dark' : 'plain'"
              class="category-tag"
              @click="selectEmotion(emo)"
            >
              {{ emo }}
            </el-tag>
          </div>
        </div>

        <div v-if="hotIdioms.length > 0" class="hot-idioms">
          <span class="hot-label">热门成语：</span>
          <el-tag
            v-for="idiom in hotIdioms"
            :key="idiom"
            size="small"
            type="danger"
            effect="plain"
            class="hot-tag"
            @click="quickSearch(idiom)"
          >
            <el-icon><DataLine /></el-icon>
            {{ idiom }}
          </el-tag>
        </div>
      </div>

      <el-divider v-if="!selectedIdiom" />

      <div v-if="!selectedIdiom" class="idiom-list">
        <div class="list-header">
          <el-icon :size="16" color="#165DFF"><List /></el-icon>
          <span>查询结果</span>
          <el-tag size="small" type="info">共 {{ filteredIdioms.length }} 个成语</el-tag>
          <el-tag v-if="searchKeyword.trim()" size="small" type="warning" effect="plain">
            关键词：「{{ searchKeyword }}」
          </el-tag>
        </div>

        <el-empty
          v-if="filteredIdioms.length === 0"
          description="未找到匹配的成语"
          :image-size="100"
        >
          <template #description>
            <div class="empty-wrapper">
              <p>未找到与「<strong>{{ searchKeyword }}</strong>」匹配的成语</p>
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
                      <li><strong>成语名称</strong>：如 画龙点睛、守株待兔</li>
                      <li><strong>关键字</strong>：如 学习、坚持、动物</li>
                      <li><strong>完整拼音</strong>：如 hualongdianjing</li>
                      <li><strong>拼音首字母</strong>：如 hldj、szdt</li>
                      <li><strong>释义关键词</strong>：如 坚持不懈、比喻做事</li>
                    </ul>
                  </div>
                </template>
              </el-alert>
            </div>
          </template>
        </el-empty>

        <div v-else class="idiom-grid">
          <div
            v-for="idiom in filteredIdioms"
            :key="idiom.name"
            class="idiom-card"
            @click="selectIdiom(idiom)"
          >
            <div class="idiom-card-header">
              <span class="idiom-name">{{ idiom.name }}</span>
              <el-tag :type="getEmotionType(idiom.emotion)" size="small" effect="plain">{{ idiom.emotion }}</el-tag>
            </div>
            <div class="idiom-pinyin-row">
              <span class="idiom-pinyin">{{ idiom.pinyin }}</span>
              <span class="pinyin-initials">首字母：{{ idiom.pinyinInitials.toUpperCase() }}</span>
            </div>
            <div class="idiom-section">
              <div class="section-label">
                <el-icon :size="12" color="#165DFF"><Edit /></el-icon>
                释义
              </div>
              <div class="idiom-desc" v-html="highlightKeyword(idiom.explanation, searchKeyword)"></div>
            </div>
            <div v-if="idiom.source" class="idiom-section">
              <div class="section-label">
                <el-icon :size="12" color="#e6a23c"><Collection /></el-icon>
                出处
              </div>
              <div class="idiom-source" v-html="highlightKeyword(idiom.source, searchKeyword)"></div>
            </div>
            <div v-if="idiom.examples && idiom.examples.length > 0" class="idiom-section">
              <div class="section-label">
                <el-icon :size="12" color="#f56c6c"><Promotion /></el-icon>
                用法例句
              </div>
              <div class="idiom-example">
                <span class="example-bullet">●</span>
                <span>{{ idiom.examples[0].sentence }}</span>
              </div>
            </div>
            <div v-if="getMatchReason(idiom, searchKeyword)" class="match-reason">
              <el-tag size="small" type="success" effect="plain">
                <el-icon><Right /></el-icon>
                {{ getMatchReason(idiom, searchKeyword) }}
              </el-tag>
            </div>
            <div class="idiom-card-footer">
              <el-tag size="small" type="primary" effect="plain">{{ idiom.category }}</el-tag>
              <span v-if="idiom.structure" class="structure-tag">
                <el-icon><Grid /></el-icon>
                {{ idiom.structure }}
              </span>
              <span class="view-detail">
                查看详情 →
              </span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="selectedIdiom" class="detail-card">
      <template #header>
        <div class="card-header">
          <el-button size="small" text @click="backToList" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </el-button>
          <span class="detail-idiom-name">{{ selectedIdiom.name }}</span>
          <el-tag :type="getEmotionType(selectedIdiom.emotion)" effect="dark">{{ selectedIdiom.emotion }}</el-tag>
          <el-tag type="primary" effect="dark">{{ selectedIdiom.category }}</el-tag>
          <el-button
            size="small"
            type="primary"
            link
            class="copy-btn"
            @click="copyToClipboard(selectedIdiom.name, '成语')"
          >
            <el-icon><CopyDocument /></el-icon>
            复制成语
          </el-button>
        </div>
      </template>

      <div class="detail-section">
        <div class="section-header">
          <el-icon :size="16" color="#165DFF"><Document /></el-icon>
          <span class="section-title">拼音</span>
        </div>
        <div class="section-content pinyin-content">
          <span class="pinyin-text">{{ selectedIdiom.pinyin }}</span>
          <el-tag size="small" type="info" effect="plain">首字母：{{ selectedIdiom.pinyinInitials.toUpperCase() }}</el-tag>
        </div>
      </div>

      <el-divider />

      <div class="detail-section">
        <div class="section-header">
          <el-icon :size="16" color="#67c23a"><Edit /></el-icon>
          <span class="section-title">释义</span>
        </div>
        <div class="section-content desc-content">{{ selectedIdiom.explanation }}</div>
      </div>

      <el-divider v-if="selectedIdiom.source" />

      <div v-if="selectedIdiom.source" class="detail-section">
        <div class="section-header">
          <el-icon :size="16" color="#e6a23c"><Collection /></el-icon>
          <span class="section-title">出处</span>
        </div>
        <div class="section-content source-content">{{ selectedIdiom.source }}</div>
      </div>

      <el-divider />

      <div class="detail-section">
        <div class="section-header">
          <el-icon :size="16" color="#f56c6c"><Promotion /></el-icon>
          <span class="section-title">例句</span>
          <el-tag size="small" type="danger">共 {{ selectedIdiom.examples.length }} 条例句</el-tag>
        </div>
        <div class="examples-list">
          <div v-for="(example, index) in selectedIdiom.examples" :key="index" class="example-item">
            <div class="example-header">
              <el-tag size="small" type="danger" effect="dark">例句 {{ index + 1 }}</el-tag>
              <span v-if="example.source" class="example-source">{{ example.source }}</span>
            </div>
            <div class="example-sentence-wrapper">
              <span class="example-sentence">{{ highlightIdiomInSentence(example.sentence, selectedIdiom.name) }}</span>
              <el-button
                size="small"
                type="primary"
                link
                @click="copyToClipboard(example.sentence, '例句')"
              >
                <el-icon><CopyDocument /></el-icon>
                复制例句
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <el-divider v-if="(selectedIdiom.synonyms && selectedIdiom.synonyms.length > 0) || (selectedIdiom.antonyms && selectedIdiom.antonyms.length > 0)" />

      <div
        v-if="(selectedIdiom.synonyms && selectedIdiom.synonyms.length > 0) || (selectedIdiom.antonyms && selectedIdiom.antonyms.length > 0)"
        class="detail-section"
      >
        <div class="synonyms-antonyms-row">
          <div v-if="selectedIdiom.synonyms && selectedIdiom.synonyms.length > 0" class="synonyms-box">
            <div class="section-header">
              <el-icon :size="16" color="#67c23a"><CircleCheck /></el-icon>
              <span class="section-title">近义词</span>
            </div>
            <div class="synonyms-list">
              <el-tag
                v-for="syn in selectedIdiom.synonyms"
                :key="syn"
                size="small"
                type="success"
                effect="dark"
                class="related-tag"
                @click="jumpToIdiom(syn)"
              >
                {{ syn }}
              </el-tag>
            </div>
          </div>
          <div v-if="selectedIdiom.antonyms && selectedIdiom.antonyms.length > 0" class="antonyms-box">
            <div class="section-header">
              <el-icon :size="16" color="#f56c6c"><CircleClose /></el-icon>
              <span class="section-title">反义词</span>
            </div>
            <div class="antonyms-list">
              <el-tag
                v-for="ant in selectedIdiom.antonyms"
                :key="ant"
                size="small"
                type="danger"
                effect="dark"
                class="related-tag"
                @click="jumpToIdiom(ant)"
              >
                {{ ant }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <el-divider v-if="selectedIdiom.structure" />

      <div v-if="selectedIdiom.structure" class="detail-section">
        <div class="section-header">
          <el-icon :size="16" color="#909399"><Grid /></el-icon>
          <span class="section-title">语法结构</span>
        </div>
        <div class="section-content">
          <el-tag type="info" effect="plain">{{ selectedIdiom.structure }}</el-tag>
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
  Collection,
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
  Grid,
  CircleCheck,
  CircleClose
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { idioms, type Idiom } from '@/data/idioms'

const searchKeyword = ref('')
const activeCategory = ref('')
const activeEmotion = ref('')
const selectedIdiom = ref<Idiom | null>(null)

const totalIdioms = computed(() => idioms.length)

const searchTips = [
  { label: '模糊搜索', icon: Search, keyword: '' },
  { label: '成语名称', icon: Document, keyword: '画龙点睛' },
  { label: '拼音首字母', icon: Files, keyword: 'hldj' },
  { label: '关键字', icon: Folder, keyword: '学习' },
  { label: '释义关键词', icon: Connection, keyword: '坚持不懈' }
]

const hotIdioms = [
  '画龙点睛', '守株待兔', '亡羊补牢', '卧薪尝胆', '愚公移山',
  '破釜沉舟', '三顾茅庐', '精益求精', '举一反三', '水滴石穿'
]

const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const normalizeKeyword = (kw: string): string => {
  return kw.toLowerCase().trim().replace(/\s+/g, '')
}

const removeTones = (pinyin: string): string => {
  const toneMap: Record<string, string> = {
    'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
    'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
    'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
    'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
    'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
    'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v', 'ü': 'v'
  }
  let result = pinyin
  for (const [tone, plain] of Object.entries(toneMap)) {
    result = result.replace(new RegExp(tone, 'g'), plain)
  }
  return result
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

const highlightIdiomInSentence = (sentence: string, idiomName: string): string => {
  const escaped = escapeHtml(sentence)
  const regex = new RegExp(`(${idiomName})`, 'g')
  return escaped.replace(regex, '<span class="idiom-highlight">$1</span>')
}

const getMatchReason = (idiom: Idiom, keyword: string): string | null => {
  if (!keyword.trim()) return null
  const kw = normalizeKeyword(keyword)
  const originalKw = keyword.trim()

  if (idiom.name.includes(originalKw)) {
    return `匹配成语名：${idiom.name}`
  }

  if (idiom.pinyinInitials.toLowerCase().includes(kw) || kw.includes(idiom.pinyinInitials.toLowerCase())) {
    return `匹配拼音首字母：${idiom.pinyinInitials.toUpperCase()}`
  }

  const plainPinyin = removeTones(idiom.pinyin).replace(/\s+/g, '')
  if (plainPinyin.includes(kw) || kw.includes(plainPinyin)) {
    return `匹配拼音：${idiom.pinyin}`
  }

  if (idiom.explanation.includes(originalKw) || idiom.explanation.toLowerCase().includes(kw)) {
    return '匹配释义内容'
  }

  if (idiom.source && (idiom.source.includes(originalKw) || idiom.source.toLowerCase().includes(kw))) {
    return '匹配出处内容'
  }

  const matchedExample = idiom.examples.find(ex =>
    ex.sentence.includes(originalKw) || ex.sentence.toLowerCase().includes(kw)
  )
  if (matchedExample) {
    return '匹配例句内容'
  }

  const matchedSynonym = idiom.synonyms?.find(syn =>
    syn.includes(originalKw) || originalKw.includes(syn)
  )
  if (matchedSynonym) {
    return `匹配近义词：${matchedSynonym}`
  }

  const matchedAntonym = idiom.antonyms?.find(ant =>
    ant.includes(originalKw) || originalKw.includes(ant)
  )
  if (matchedAntonym) {
    return `匹配反义词：${matchedAntonym}`
  }

  return null
}

const commonSuggestions: Record<string, string[]> = {
  '学习': ['举一反三', '精益求精', '不耻下问', '学而不厌', '开卷有益'],
  '坚持': ['水滴石穿', '愚公移山', '锲而不舍', '持之以恒', '坚持不懈'],
  '做事': ['画龙点睛', '锦上添花', '事半功倍', '一丝不苟', '脚踏实地'],
  '动物': ['守株待兔', '对牛弹琴', '亡羊补牢', '叶公好龙', '杯弓蛇影'],
  '历史': ['卧薪尝胆', '完璧归赵', '负荆请罪', '纸上谈兵', '三顾茅庐'],
  '寓言': ['守株待兔', '亡羊补牢', '掩耳盗铃', '刻舟求剑', '画蛇添足'],
  '努力': ['闻鸡起舞', '孜孜不倦', '废寝忘食', '悬梁刺股', '凿壁偷光'],
  '聪明': ['举一反三', '触类旁通', '融会贯通', '过目不忘', '天资聪颖'],
  '品德': ['大公无私', '光明磊落', '德高望重', '平易近人', '见义勇为'],
  '自然': ['风和日丽', '鸟语花香', '山清水秀', '春暖花开', '万里无云']
}

const getSuggestions = (keyword: string): string[] => {
  if (!keyword.trim()) return []
  const kw = keyword.trim()
  const suggestions: string[] = []

  for (const [key, idiomList] of Object.entries(commonSuggestions)) {
    if (key.includes(kw) || kw.includes(key)) {
      suggestions.push(...idiomList)
    }
  }

  for (const idiom of idioms) {
    if (idiom.name.includes(kw)) {
      suggestions.push(idiom.name)
    }
    if (idiom.pinyinInitials.toLowerCase().includes(normalizeKeyword(kw))) {
      suggestions.push(idiom.name)
    }
  }

  return [...new Set(suggestions)].slice(0, 6)
}

const categories = computed(() => {
  const cats = new Set(idioms.map(idiom => idiom.category))
  return Array.from(cats)
})

const emotions = computed(() => {
  const emos = new Set(idioms.map(idiom => idiom.emotion).filter(Boolean) as string[])
  return Array.from(emos)
})

const getCategoryCount = (category: string): number => {
  return idioms.filter(idiom => idiom.category === category).length
}

const getEmotionType = (emotion?: string): 'success' | 'danger' | 'info' | 'warning' => {
  switch (emotion) {
    case '褒义': return 'success'
    case '贬义': return 'danger'
    case '中性': return 'info'
    default: return 'info'
  }
}

const filteredIdioms = computed(() => {
  let result = idioms

  if (activeCategory.value) {
    result = result.filter(idiom => idiom.category === activeCategory.value)
  }

  if (activeEmotion.value) {
    result = result.filter(idiom => idiom.emotion === activeEmotion.value)
  }

  if (searchKeyword.value.trim()) {
    const keyword = normalizeKeyword(searchKeyword.value)
    const originalKw = searchKeyword.value.trim()
    result = result.filter(idiom => {
      const nameMatch = idiom.name.includes(originalKw)
      const pinyinInitialsMatch = idiom.pinyinInitials.toLowerCase().includes(keyword)
      const plainPinyin = removeTones(idiom.pinyin).replace(/\s+/g, '')
      const pinyinMatch = plainPinyin.includes(keyword)
      const descMatch = idiom.explanation.includes(originalKw) || idiom.explanation.toLowerCase().includes(keyword)
      const sourceMatch = idiom.source ? (idiom.source.includes(originalKw) || idiom.source.toLowerCase().includes(keyword)) : false
      const exampleMatch = idiom.examples.some(ex =>
        ex.sentence.includes(originalKw) || ex.sentence.toLowerCase().includes(keyword)
      )
      const synonymMatch = idiom.synonyms?.some(syn => syn.includes(originalKw) || originalKw.includes(syn))
      const antonymMatch = idiom.antonyms?.some(ant => ant.includes(originalKw) || originalKw.includes(ant))
      return nameMatch || pinyinInitialsMatch || pinyinMatch || descMatch || sourceMatch || exampleMatch || synonymMatch || antonymMatch
    })
  }

  return result
})

const handleSearch = () => {
  selectedIdiom.value = null
}

const selectCategory = (cat: string) => {
  activeCategory.value = cat
  selectedIdiom.value = null
}

const selectEmotion = (emo: string) => {
  activeEmotion.value = emo
  selectedIdiom.value = null
}

const quickSearch = (keyword: string) => {
  searchKeyword.value = keyword
  handleSearch()
}

const selectIdiom = (idiom: Idiom) => {
  selectedIdiom.value = idiom
}

const backToList = () => {
  selectedIdiom.value = null
}

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(`${label}已复制：${text}`)
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

const jumpToIdiom = (idiomName: string) => {
  const found = idioms.find(idiom => idiom.name === idiomName)
  if (found) {
    selectedIdiom.value = found
  } else {
    searchKeyword.value = idiomName
    selectedIdiom.value = null
    ElMessage.info(`正在搜索成语：${idiomName}`)
  }
}

onMounted(() => {
  if (filteredIdioms.value.length === 0) {
    searchKeyword.value = ''
  }
})
</script>

<style scoped>
.idiom-query {
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

.cat-count {
  margin-left: 4px;
  font-size: 11px;
  opacity: 0.8;
}

.hot-idioms {
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

.idiom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.idiom-card {
  padding: 16px;
  background: #fafafa;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.idiom-card:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.idiom-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.idiom-name {
  font-size: 22px;
  font-weight: 700;
  color: #165DFF;
  letter-spacing: 2px;
}

.idiom-pinyin-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 6px;
}

.idiom-pinyin {
  font-family: 'Georgia', serif;
  font-size: 14px;
  color: #67c23a;
}

.pinyin-initials {
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
}

.idiom-section {
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

.idiom-desc {
  font-size: 13px;
  color: #303133;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  background: #f5f7fa;
  padding: 6px 10px;
  border-radius: 4px;
  border-left: 3px solid #165DFF;
}

.idiom-source {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  background: #fdf6ec;
  padding: 5px 10px;
  border-radius: 4px;
  border-left: 3px solid #e6a23c;
  font-style: italic;
}

.idiom-example {
  font-size: 12px;
  color: #303133;
  line-height: 1.5;
  background: #fef0f0;
  padding: 5px 10px;
  border-radius: 4px;
  border-left: 3px solid #f56c6c;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.example-bullet {
  color: #f56c6c;
  margin-right: 4px;
  font-size: 10px;
}

.idiom-card-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #909399;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #e4e7ed;
  flex-wrap: wrap;
}

.structure-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.view-detail {
  margin-left: auto;
  font-size: 12px;
  color: #165DFF;
  font-weight: 500;
}

.match-reason {
  margin-bottom: 8px;
}

.match-reason .el-tag {
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

.detail-idiom-name {
  font-size: 28px;
  font-weight: 700;
  color: #165DFF;
  letter-spacing: 4px;
  padding: 4px 14px;
  background: #ecf5ff;
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

.pinyin-content {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f9eb;
  padding: 12px 16px;
  border-radius: 6px;
  border-left: 4px solid #67c23a;
}

.pinyin-text {
  font-family: 'Georgia', serif;
  font-size: 20px;
  color: #67c23a;
  font-weight: 500;
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

.source-content {
  font-size: 13px;
  line-height: 1.8;
  color: #606266;
  background: #fdf6ec;
  padding: 12px 16px;
  border-radius: 6px;
  border-left: 4px solid #e6a23c;
  font-style: italic;
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

.example-source {
  font-size: 12px;
  color: #909399;
  font-style: italic;
}

.example-sentence-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px 14px;
  border-radius: 6px;
}

.example-sentence {
  flex: 1;
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}

.synonyms-antonyms-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.synonyms-box,
.antonyms-box {
  flex: 1;
  min-width: 280px;
  padding: 12px;
  border-radius: 8px;
}

.synonyms-box {
  background: #f0f9eb;
}

.antonyms-box {
  background: #fef0f0;
}

.synonyms-list,
.antonyms-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.related-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.related-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .idiom-grid {
    grid-template-columns: 1fr;
  }

  .detail-idiom-name {
    font-size: 22px;
  }

  .example-sentence-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-tips {
    flex-wrap: wrap;
  }

  .synonyms-antonyms-row {
    flex-direction: column;
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

.highlight {
  background-color: #fff7e6;
  color: #e6a23c;
  padding: 0 3px;
  border-radius: 3px;
  font-weight: 600;
}

.idiom-highlight {
  background-color: #ecf5ff;
  color: #165DFF;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: 600;
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
