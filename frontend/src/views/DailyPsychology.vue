<template>
  <div class="daily-psychology">
    <el-card class="hero-card">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <el-icon :size="28" color="#fff"><Reading /></el-icon>
            每日心理学
          </h1>
          <p class="hero-subtitle">
            每天一个心理学知识点，碎片时间积累，让你更懂自己、更懂他人
          </p>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-value">{{ psychologyKnowledgeList.length }}</div>
            <div class="stat-label">精选知识点</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ streakDays }}</div>
            <div class="stat-label">连续打卡</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ learnedCount }}</div>
            <div class="stat-label">已学知识</div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="mode-switch-card">
      <div class="mode-tabs">
        <div
          class="mode-tab"
          :class="{ active: activeMode === 'today' }"
          @click="activeMode = 'today'"
        >
          <el-icon><Sunny /></el-icon>
          <span>今日知识</span>
        </div>
        <div
          class="mode-tab"
          :class="{ active: activeMode === 'list' }"
          @click="activeMode = 'list'"
        >
          <el-icon><List /></el-icon>
          <span>全部知识</span>
        </div>
        <div
          class="mode-tab"
          :class="{ active: activeMode === 'category' }"
          @click="activeMode = 'category'"
        >
          <el-icon><Grid /></el-icon>
          <span>分类浏览</span>
        </div>
      </div>
    </el-card>

    <div v-if="activeMode === 'today'" class="today-mode">
      <el-card class="knowledge-card" :class="{ 'card-appear': cardAppear }">
        <div class="card-header-bar">
          <div class="header-left">
            <el-tag
              size="large"
              effect="dark"
              :style="{ backgroundColor: currentKnowledge.color, borderColor: currentKnowledge.color }"
            >
              <el-icon><component :is="currentKnowledge.icon" /></el-icon>
              <span style="margin-left: 4px">{{ categoryInfo[currentKnowledge.category].name }}</span>
            </el-tag>
            <el-tag
              size="large"
              effect="plain"
              :style="{ color: difficultyInfo[currentKnowledge.difficulty].color, borderColor: difficultyInfo[currentKnowledge.difficulty].color }"
            >
              {{ difficultyInfo[currentKnowledge.difficulty].name }}
            </el-tag>
          </div>
          <div class="header-right">
            <div class="date-badge">
              <el-icon><Calendar /></el-icon>
              <span>{{ formatDate(today) }}</span>
            </div>
            <el-tooltip content="换一个知识点">
              <el-button circle :icon="Refresh" @click="refreshKnowledge" />
            </el-tooltip>
          </div>
        </div>

        <div class="knowledge-title">
          <h2>{{ currentKnowledge.title }}</h2>
        </div>

        <el-divider />

        <div class="knowledge-section">
          <div class="section-label">
            <el-icon color="#165DFF"><Bulb /></el-icon>
            <span>核心概念</span>
          </div>
          <p class="core-concept">{{ currentKnowledge.coreConcept }}</p>
        </div>

        <div class="knowledge-section">
          <div class="section-label">
            <el-icon color="#67C23A"><Reading /></el-icon>
            <span>详细解读</span>
          </div>
          <div class="detailed-explanation">
            <p v-for="(para, idx) in explanationParagraphs" :key="idx">
              {{ para }}
            </p>
          </div>
        </div>

        <div class="knowledge-section">
          <div class="section-label">
            <el-icon color="#E6A23C"><MagicStick /></el-icon>
            <span>实际应用</span>
          </div>
          <div class="applications-list">
            <div
              v-for="(app, idx) in currentKnowledge.practicalApplications"
              :key="idx"
              class="application-item"
            >
              <span class="app-number">{{ idx + 1 }}</span>
              <span class="app-text">{{ app }}</span>
            </div>
          </div>
        </div>

        <div class="knowledge-section">
          <div class="section-label">
            <el-icon color="#F56C6C"><ChatDotRound /></el-icon>
            <span>生活例子</span>
          </div>
          <div class="examples-list">
            <div
              v-for="(example, idx) in currentKnowledge.examples"
              :key="idx"
              class="example-item"
            >
              <el-icon color="#F56C6C"><StarFilled /></el-icon>
              <span>{{ example }}</span>
            </div>
          </div>
        </div>

        <div class="knowledge-section" v-if="currentKnowledge.relatedConcepts.length > 0">
          <div class="section-label">
            <el-icon color="#9B59B6"><Connection /></el-icon>
            <span>相关概念</span>
          </div>
          <div class="related-tags">
            <el-tag
              v-for="(concept, idx) in currentKnowledge.relatedConcepts"
              :key="idx"
              effect="plain"
              class="related-tag"
            >
              {{ concept }}
            </el-tag>
          </div>
        </div>

        <el-divider />

        <div class="card-footer">
          <el-button
            size="large"
            type="primary"
            :icon="isChecked ? CircleCheck : Check"
            :disabled="isChecked"
            @click="checkIn"
            class="checkin-btn"
          >
            {{ isChecked ? '今日已打卡 ✓' : '我学会了，打卡' }}
          </el-button>
          <div class="progress-hint">
            已学 {{ learnedCount }} / {{ psychologyKnowledgeList.length }}
            <el-progress
              :percentage="Math.round(learnedCount / psychologyKnowledgeList.length * 100)"
              :stroke-width="6"
              :show-text="false"
              class="mini-progress"
            />
          </div>
        </div>
      </el-card>
    </div>

    <div v-if="activeMode === 'list'" class="list-mode">
      <el-card class="list-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#165DFF"><Collection /></el-icon>
            <span>全部心理学知识</span>
            <el-tag size="small" type="info">共 {{ psychologyKnowledgeList.length }} 个</el-tag>
            <div class="header-search">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索知识点..."
                :prefix-icon="Search"
                clearable
                size="default"
                style="width: 240px"
              />
            </div>
          </div>
        </template>

        <div class="knowledge-grid">
          <el-card
            v-for="k in filteredList"
            :key="k.id"
            class="mini-card"
            shadow="hover"
            @click="viewKnowledge(k)"
          >
            <div
              class="mini-icon"
              :style="{ backgroundColor: k.color + '20', color: k.color }"
            >
              <el-icon :size="28"><component :is="k.icon" /></el-icon>
            </div>
            <h4 class="mini-title">{{ k.title }}</h4>
            <p class="mini-desc">{{ k.coreConcept }}</p>
            <div class="mini-footer">
              <el-tag
                size="small"
                effect="light"
                :style="{ color: categoryInfo[k.category].color, backgroundColor: categoryInfo[k.category].color + '15', borderColor: categoryInfo[k.category].color + '40' }"
              >
                {{ categoryInfo[k.category].name }}
              </el-tag>
              <el-tag
                v-if="isLearned(k.id)"
                size="small"
                type="success"
                effect="light"
              >
                <el-icon><Check /></el-icon>
                已学
              </el-tag>
            </div>
          </el-card>
        </div>
      </el-card>
    </div>

    <div v-if="activeMode === 'category'" class="category-mode">
      <el-card class="category-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#165DFF"><Grid /></el-icon>
            <span>按分类浏览</span>
          </div>
        </template>

        <div class="category-grid">
          <div
            v-for="(info, key) in categoryInfo"
            :key="key"
            class="category-item"
            :style="{ '--cat-color': info.color }"
            @click="selectCategory(key as string)"
          >
            <div class="cat-icon" :style="{ backgroundColor: info.color + '20', color: info.color }">
              <el-icon :size="36"><component :is="info.icon" /></el-icon>
            </div>
            <h3 class="cat-name">{{ info.name }}</h3>
            <p class="cat-count">{{ getKnowledgeByCategory(key as string).length }} 个知识点</p>
          </div>
        </div>
      </el-card>

      <el-card v-if="selectedCategory" class="category-detail-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" :color="categoryInfo[selectedCategory].color">
              <component :is="categoryInfo[selectedCategory].icon" />
            </el-icon>
            <span>{{ categoryInfo[selectedCategory].name }}</span>
            <el-tag size="small" type="info">
              {{ getKnowledgeByCategory(selectedCategory).length }} 个知识点
            </el-tag>
            <el-button text size="small" @click="selectedCategory = null">
              <el-icon><Back /></el-icon>
              返回分类
            </el-button>
          </div>
        </template>

        <div class="knowledge-grid">
          <el-card
            v-for="k in getKnowledgeByCategory(selectedCategory)"
            :key="k.id"
            class="mini-card"
            shadow="hover"
            @click="viewKnowledge(k)"
          >
            <div
              class="mini-icon"
              :style="{ backgroundColor: k.color + '20', color: k.color }"
            >
              <el-icon :size="28"><component :is="k.icon" /></el-icon>
            </div>
            <h4 class="mini-title">{{ k.title }}</h4>
            <p class="mini-desc">{{ k.coreConcept }}</p>
            <div class="mini-footer">
              <el-tag
                size="small"
                effect="light"
                :style="{ color: difficultyInfo[k.difficulty].color, backgroundColor: difficultyInfo[k.difficulty].color + '15', borderColor: difficultyInfo[k.difficulty].color + '40' }"
              >
                {{ difficultyInfo[k.difficulty].name }}
              </el-tag>
              <el-tag
                v-if="isLearned(k.id)"
                size="small"
                type="success"
                effect="light"
              >
                <el-icon><Check /></el-icon>
                已学
              </el-tag>
            </div>
          </el-card>
        </div>
      </el-card>
    </div>

    <el-dialog
      v-model="detailVisible"
      :title="selectedKnowledge?.title"
      width="800px"
      class="detail-dialog"
    >
      <div v-if="selectedKnowledge" class="detail-content">
        <div class="detail-header-tags">
          <el-tag
            effect="dark"
            :style="{ backgroundColor: selectedKnowledge.color, borderColor: selectedKnowledge.color }"
          >
            {{ categoryInfo[selectedKnowledge.category].name }}
          </el-tag>
          <el-tag effect="plain">
            {{ difficultyInfo[selectedKnowledge.difficulty].name }}
          </el-tag>
        </div>

        <div class="detail-section">
          <h4><el-icon color="#165DFF"><Bulb /></el-icon> 核心概念</h4>
          <p class="core-concept">{{ selectedKnowledge.coreConcept }}</p>
        </div>

        <div class="detail-section">
          <h4><el-icon color="#67C23A"><Reading /></el-icon> 详细解读</h4>
          <div class="detailed-explanation">
            <p v-for="(para, idx) in selectedExplanationParagraphs" :key="idx">{{ para }}</p>
          </div>
        </div>

        <div class="detail-section">
          <h4><el-icon color="#E6A23C"><MagicStick /></el-icon> 实际应用</h4>
          <div class="applications-list">
            <div
              v-for="(app, idx) in selectedKnowledge.practicalApplications"
              :key="idx"
              class="application-item"
            >
              <span class="app-number">{{ idx + 1 }}</span>
              <span class="app-text">{{ app }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4><el-icon color="#F56C6C"><ChatDotRound /></el-icon> 生活例子</h4>
          <div class="examples-list">
            <div
              v-for="(example, idx) in selectedKnowledge.examples"
              :key="idx"
              class="example-item"
            >
              <el-icon color="#F56C6C"><StarFilled /></el-icon>
              <span>{{ example }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section" v-if="selectedKnowledge.relatedConcepts.length > 0">
          <h4><el-icon color="#9B59B6"><Connection /></el-icon> 相关概念</h4>
          <div class="related-tags">
            <el-tag
              v-for="(concept, idx) in selectedKnowledge.relatedConcepts"
              :key="idx"
              effect="plain"
              class="related-tag"
            >
              {{ concept }}
            </el-tag>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button
          v-if="selectedKnowledge && !isLearned(selectedKnowledge.id)"
          type="primary"
          :icon="Check"
          @click="checkInSpecific(selectedKnowledge.id)"
        >
          标记为已学
        </el-button>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Reading,
  Sunny,
  List,
  Grid,
  Calendar,
  Refresh,
  Bulb,
  MagicStick,
  ChatDotRound,
  Connection,
  CircleCheck,
  Check,
  Collection,
  Search,
  Back,
  StarFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  psychologyKnowledgeList,
  categoryInfo,
  difficultyInfo,
  getKnowledgeByDate,
  getKnowledgeByCategory,
  type PsychologyKnowledge
} from '@/data/psychologyKnowledge'

const STORAGE_KEY = 'daily_psychology_data'
const today = new Date().toISOString().split('T')[0]

interface StorageData {
  learnedIds: number[]
  lastCheckDate: string | null
  streakDays: number
  currentKnowledgeId: number | null
}

const loadStorage = (): StorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error('Failed to load storage', e)
  }
  return { learnedIds: [], lastCheckDate: null, streakDays: 0, currentKnowledgeId: null }
}

const saveStorage = (data: StorageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const storageData = ref<StorageData>(loadStorage())
const activeMode = ref<'today' | 'list' | 'category'>('today')
const searchKeyword = ref('')
const selectedCategory = ref<string | null>(null)
const selectedKnowledge = ref<PsychologyKnowledge | null>(null)
const detailVisible = ref(false)
const cardAppear = ref(false)

const todayKnowledge = computed(() => {
  if (storageData.value.currentKnowledgeId !== null) {
    const k = psychologyKnowledgeList.find(item => item.id === storageData.value.currentKnowledgeId)
    if (k) return k
  }
  const k = getKnowledgeByDate(today)
  storageData.value.currentKnowledgeId = k.id
  saveStorage(storageData.value)
  return k
})

const currentKnowledge = ref<PsychologyKnowledge>(todayKnowledge.value)

const explanationParagraphs = computed(() =>
  currentKnowledge.value.detailedExplanation.split('\n').filter(p => p.trim().length > 0)
)

const selectedExplanationParagraphs = computed(() => {
  if (!selectedKnowledge.value) return []
  return selectedKnowledge.value.detailedExplanation.split('\n').filter(p => p.trim().length > 0)
})

const streakDays = computed(() => {
  if (!storageData.value.lastCheckDate) return 0
  const lastDate = new Date(storageData.value.lastCheckDate)
  const now = new Date(today)
  const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 1) {
    return storageData.value.streakDays
  }
  return 0
})

const learnedCount = computed(() => storageData.value.learnedIds.length)

const isChecked = computed(() => {
  return storageData.value.lastCheckDate === today
})

const filteredList = computed(() => {
  if (!searchKeyword.value.trim()) return psychologyKnowledgeList
  const kw = searchKeyword.value.toLowerCase()
  return psychologyKnowledgeList.filter(k =>
    k.title.toLowerCase().includes(kw) ||
    k.coreConcept.toLowerCase().includes(kw) ||
    k.practicalApplications.some(a => a.toLowerCase().includes(kw)) ||
    k.relatedConcepts.some(r => r.toLowerCase().includes(kw))
  )
})

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const isLearned = (id: number) => storageData.value.learnedIds.includes(id)

const checkIn = () => {
  if (isChecked.value) return
  const todayDate = today
  const lastDate = storageData.value.lastCheckDate
  if (lastDate) {
    const last = new Date(lastDate)
    const now = new Date(todayDate)
    const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 1) {
      storageData.value.streakDays += 1
    } else if (diff > 1) {
      storageData.value.streakDays = 1
    }
  } else {
    storageData.value.streakDays = 1
  }
  storageData.value.lastCheckDate = todayDate
  if (!storageData.value.learnedIds.includes(currentKnowledge.value.id)) {
    storageData.value.learnedIds.push(currentKnowledge.value.id)
  }
  saveStorage(storageData.value)
  ElMessage.success(`🎉 打卡成功！已连续学习 ${storageData.value.streakDays} 天`)
}

const checkInSpecific = (id: number) => {
  if (!storageData.value.learnedIds.includes(id)) {
    storageData.value.learnedIds.push(id)
    saveStorage(storageData.value)
    ElMessage.success('已标记为已学 ✓')
  }
}

const refreshKnowledge = () => {
  const available = psychologyKnowledgeList.filter(k => k.id !== currentKnowledge.value.id)
  const random = available[Math.floor(Math.random() * available.length)]
  currentKnowledge.value = random
  storageData.value.currentKnowledgeId = random.id
  saveStorage(storageData.value)
  cardAppear.value = false
  setTimeout(() => (cardAppear.value = true), 50)
}

const viewKnowledge = (k: PsychologyKnowledge) => {
  selectedKnowledge.value = k
  detailVisible.value = true
}

const selectCategory = (cat: string) => {
  selectedCategory.value = cat
}

onMounted(() => {
  setTimeout(() => (cardAppear.value = true), 100)
})
</script>

<style scoped>
.daily-psychology {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.hero-card :deep(.el-card__body) {
  padding: 32px;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

.hero-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #fff;
}

.hero-subtitle {
  font-size: 15px;
  margin: 0;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  opacity: 0.8;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

.mode-switch-card {
  margin-bottom: 20px;
  padding: 4px;
}

.mode-switch-card :deep(.el-card__body) {
  padding: 0;
}

.mode-tabs {
  display: flex;
  gap: 8px;
}

.mode-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #606266;
  font-weight: 500;
}

.mode-tab:hover {
  background: #f5f7fa;
}

.mode-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.knowledge-card {
  margin-bottom: 20px;
}

.knowledge-card.card-appear {
  animation: cardSlideIn 0.5s ease-out;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #f5f7fa;
  border-radius: 20px;
  color: #606266;
  font-size: 14px;
}

.knowledge-title h2 {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.knowledge-section {
  margin-bottom: 28px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 14px;
}

.core-concept {
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
  padding: 16px 20px;
  background: linear-gradient(135deg, #ecf5ff 0%, #f0e8ff 100%);
  border-left: 4px solid #165DFF;
  border-radius: 0 8px 8px 0;
  margin: 0;
}

.detailed-explanation p {
  font-size: 15px;
  line-height: 1.9;
  color: #606266;
  margin: 0 0 14px 0;
  text-indent: 2em;
}

.detailed-explanation p:last-child {
  margin-bottom: 0;
}

.applications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.application-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  background: #fafafa;
  border-radius: 10px;
  transition: all 0.3s;
}

.application-item:hover {
  background: #f0f5ff;
  transform: translateX(4px);
}

.app-number {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #E6A23C 0%, #f39c12 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.app-text {
  font-size: 15px;
  color: #303133;
  line-height: 1.7;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.example-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: #fef0f0;
  border-radius: 8px;
}

.example-item span {
  font-size: 14px;
  color: #606266;
  line-height: 1.7;
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.related-tag {
  font-size: 14px;
  padding: 6px 14px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.checkin-btn {
  min-width: 200px;
  height: 48px;
  font-size: 16px;
  border-radius: 24px;
}

.progress-hint {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #909399;
  font-size: 14px;
}

.mini-progress {
  width: 120px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.header-search {
  margin-left: auto;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

.mini-card {
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.mini-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.mini-card :deep(.el-card__body) {
  padding: 24px 20px;
}

.mini-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  transition: all 0.3s;
}

.mini-card:hover .mini-icon {
  transform: scale(1.1);
}

.mini-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 10px 0;
}

.mini-desc {
  font-size: 13px;
  color: #909399;
  line-height: 1.6;
  margin: 0 0 14px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mini-footer {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.category-item {
  cursor: pointer;
  padding: 28px 20px;
  text-align: center;
  border-radius: 16px;
  background: #fafafa;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.category-item:hover {
  background: #fff;
  border-color: var(--cat-color);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.cat-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  transition: all 0.3s;
}

.category-item:hover .cat-icon {
  transform: scale(1.1) rotate(5deg);
}

.cat-name {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 6px 0;
}

.cat-count {
  font-size: 13px;
  color: #909399;
  margin: 0;
}

.category-detail-card {
  margin-top: 20px;
}

.detail-content {
  padding: 8px 0;
}

.detail-header-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.detail-section {
  margin-bottom: 28px;
}

.detail-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 14px 0;
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .hero-stats {
    width: 100%;
    justify-content: space-around;
  }

  .knowledge-title h2 {
    font-size: 24px;
  }

  .mode-tabs {
    flex-direction: column;
  }

  .card-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .checkin-btn {
    width: 100%;
  }

  .progress-hint {
    justify-content: center;
  }

  .header-search {
    margin-left: 0;
    margin-top: 12px;
    width: 100%;
  }

  .header-search :deep(.el-input) {
    width: 100% !important;
  }
}
</style>
