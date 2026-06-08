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
          <div class="hero-mode-badge">
            <el-tag
              effect="dark"
              class="mode-tag"
              @click="settingsVisible = true"
            >
              <el-icon><component :is="recommendModeInfo[recommendMode].icon" /></el-icon>
              <span>{{ recommendModeInfo[recommendMode].name }}</span>
              <el-icon><Setting /></el-icon>
            </el-tag>
          </div>
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
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value" :style="{ color: difficultyInfo[currentAdaptive.mainLevel].color }">
              {{ difficultyInfo[currentAdaptive.mainLevel].name }}
            </div>
            <div class="stat-label">当前等级</div>
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
      <el-card class="adaptive-tip-card" v-if="showAdaptiveTip">
        <div class="adaptive-tip">
          <el-icon :size="20" color="#E6A23C"><TrendCharts /></el-icon>
          <div class="tip-content">
            <span class="tip-text">
              <strong>自适应学习：</strong>根据你的学习进度，当前推荐
              <el-tag
                effect="light"
                :style="{ color: difficultyInfo[currentAdaptive.mainLevel].color, borderColor: difficultyInfo[currentAdaptive.mainLevel].color, backgroundColor: difficultyInfo[currentAdaptive.mainLevel].color + '15' }"
              >
                {{ difficultyInfo[currentAdaptive.mainLevel].name }}
              </el-tag>
              难度为主
            </span>
            <el-button text size="small" @click="dismissAdaptiveTip">知道了</el-button>
          </div>
        </div>
      </el-card>

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
              effect="dark"
              class="difficulty-tag-large"
              :style="{ backgroundColor: difficultyInfo[currentKnowledge.difficulty].color }"
            >
              <el-icon><component :is="difficultyInfo[currentKnowledge.difficulty].icon" /></el-icon>
              <span style="margin-left: 4px">{{ difficultyInfo[currentKnowledge.difficulty].name }}</span>
            </el-tag>
          </div>
          <div class="header-right">
            <div class="date-badge">
              <el-icon><Calendar /></el-icon>
              <span>{{ formatDate(today) }}</span>
            </div>
            <el-dropdown trigger="click" @command="handleQuickSwitch">
              <el-tooltip content="切换难度">
                <el-button circle :icon="Sort" />
              </el-tooltip>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="beginner">
                    <el-icon color="#67C23A"><Sprout /></el-icon>
                    <span>入门难度</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="intermediate">
                    <el-icon color="#E6A23A"><Sunny /></el-icon>
                    <span>进阶难度</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="advanced">
                    <el-icon color="#F56C6C"><Medal /></el-icon>
                    <span>深入难度</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="adaptive" divided>
                    <el-icon><TrendCharts /></el-icon>
                    <span>智能推荐</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
              </el-dropdown>
            <el-tooltip content="换一个知识点">
              <el-button circle :icon="Refresh" @click="refreshKnowledge" />
            </el-tooltip>
          </div>
        </div>

        <div class="knowledge-title">
          <h2>{{ currentKnowledge.title }}</h2>
        </div>

        <div class="difficulty-desc">
          <el-icon><component :is="difficultyInfo[currentKnowledge.difficulty].icon" /></el-icon>
          <span>{{ difficultyInfo[currentKnowledge.difficulty].description }}</span>
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
            <div class="progress-text">
              <span>已学 {{ learnedCount }} / {{ psychologyKnowledgeList.length }}</span>
              <el-progress
                :percentage="Math.round(learnedCount / psychologyKnowledgeList.length * 100)"
                :stroke-width="6"
                :show-text="false"
                class="mini-progress"
              />
            </div>
            <div class="difficulty-progress">
              <el-tooltip
                v-for="diff in ['beginner', 'intermediate', 'advanced'] as const"
                :key="diff"
                :content="`${difficultyInfo[diff].name}: ${getLearnedByDifficulty(diff)} / ${getDifficultyCounts()[diff]}`"
              >
                <span
                  class="diff-dot"
                  :style="{ backgroundColor: difficultyInfo[diff].color, opacity: getLearnedByDifficulty(diff) / getDifficultyCounts()[diff] * 0.5 + 0.5 }"
                />
              </el-tooltip>
            </div>
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
            <div class="header-filters">
              <el-radio-group v-model="listDifficultyFilter" size="default" class="difficulty-filter">
                <el-radio-button value="all">全部难度</el-radio-button>
                <el-radio-button value="beginner">
                  <el-icon color="#67C23A"><Sprout /></el-icon>
                  入门
                </el-radio-button>
                <el-radio-button value="intermediate">
                  <el-icon color="#E6A23A"><Sunny /></el-icon>
                  进阶
                </el-radio-button>
                <el-radio-button value="advanced">
                  <el-icon color="#F56C6C"><Medal /></el-icon>
                  深入
                </el-radio-button>
              </el-radio-group>
              <el-input
                v-model="searchKeyword"
                placeholder="搜索知识点..."
                :prefix-icon="Search"
                clearable
                size="default"
                style="width: 200px"
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
            <div
              class="mini-difficulty"
              :style="{ backgroundColor: difficultyInfo[k.difficulty].color }"
            >
              <el-icon :size="14"><component :is="difficultyInfo[k.difficulty].icon" /></el-icon>
              <span>{{ difficultyInfo[k.difficulty].name }}</span>
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

        <el-empty v-if="filteredList.length === 0" description="没有找到匹配的知识点" />
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
            <div class="cat-difficulty-preview">
              <template v-for="diff in ['beginner', 'intermediate', 'advanced']" :key="diff">
                <span
                  v-if="getKnowledgeByCategory(key as string).some(k => k.difficulty === diff)"
                  class="cat-diff-dot"
                  :style="{ backgroundColor: difficultyInfo[diff].color }"
                />
              </template>
            </div>
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
            <el-radio-group v-model="categoryDifficultyFilter" size="small">
              <el-radio-button value="all">全部</el-radio-button>
              <el-radio-button value="beginner">入门</el-radio-button>
              <el-radio-button value="intermediate">进阶</el-radio-button>
              <el-radio-button value="advanced">深入</el-radio-button>
            </el-radio-group>
            <el-button text size="small" @click="selectedCategory = null">
              <el-icon><Back /></el-icon>
              返回分类
            </el-button>
          </div>
        </template>

        <div class="knowledge-grid">
          <el-card
            v-for="k in filteredCategoryList"
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
            <div
              class="mini-difficulty"
              :style="{ backgroundColor: difficultyInfo[k.difficulty].color }"
            >
              <el-icon :size="14"><component :is="difficultyInfo[k.difficulty].icon" /></el-icon>
              <span>{{ difficultyInfo[k.difficulty].name }}</span>
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
          <el-tag
            effect="dark"
            :style="{ backgroundColor: difficultyInfo[selectedKnowledge.difficulty].color }"
          >
            <el-icon><component :is="difficultyInfo[selectedKnowledge.difficulty].icon" /></el-icon>
            <span style="margin-left: 4px">{{ difficultyInfo[selectedKnowledge.difficulty].name }}</span>
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

    <el-dialog
      v-model="settingsVisible"
      title="学习设置"
      width="560px"
      class="settings-dialog"
    >
      <div class="settings-content">
        <div class="settings-section">
          <h3 class="settings-title">
            <el-icon color="#165DFF"><TrendCharts /></el-icon>
            推荐模式
          </h3>
          <div class="mode-options">
            <div
              v-for="(info, key) in recommendModeInfo"
              :key="key"
              class="mode-option"
              :class="{ active: recommendMode === key }"
              @click="recommendMode = key as RecommendMode"
            >
              <div class="mode-option-icon" :class="key">
              <el-icon :size="24"><component :is="info.icon" /></el-icon>
            </div>
            <div class="mode-option-info">
              <h4>{{ info.name }}</h4>
              <p>{{ info.description }}</p>
            </div>
            <el-radio :model-value="recommendMode" :label="key as RecommendMode" :value="key" class="mode-option-radio" />
          </div>
        </div>

        <div class="settings-section" v-if="recommendMode === 'fixed'">
          <h3 class="settings-title">
            <el-icon color="#E6A23C"><Level /></el-icon>
            选择难度
          </h3>
          <div class="difficulty-options">
            <div
              v-for="(info, key) in difficultyInfo"
              :key="key"
              class="difficulty-option"
              :class="{ active: fixedDifficulty === key }"
              @click="fixedDifficulty = key as DifficultyLevel"
              :style="{ '--diff-color': info.color }"
            >
              <div class="diff-option-icon">
                <el-icon :size="20"><component :is="info.icon" /></el-icon>
              </div>
              <div class="diff-option-info">
                <h4>{{ info.name }}</h4>
                <p>{{ info.description }}</p>
                <span class="diff-count">{{ getDifficultyCounts()[key] }} 个知识点</span>
              </div>
              <el-radio :model-value="fixedDifficulty" :label="key as DifficultyLevel" :value="key" class="diff-option-radio" />
            </div>
          </div>
        </div>

        <div class="settings-section" v-if="recommendMode === 'mixed'">
          <h3 class="settings-title">
            <el-icon color="#67C23A"><Aim /></el-icon>
            目标水平
          </h3>
          <p class="settings-desc">选择你当前的心理学基础水平，系统将以该难度为主，并适度推荐更高难度的内容进行挑战</p>
          <el-radio-group v-model="mixedTargetLevel" size="large">
            <el-radio-button value="beginner">
              <el-icon color="#67C23A"><Sprout /></el-icon>
              入门
            </el-radio-button>
            <el-radio-button value="intermediate">
              <el-icon color="#E6A23A"><Sunny /></el-icon>
              进阶
            </el-radio-button>
            <el-radio-button value="advanced">
              <el-icon color="#F56C6C"><Medal /></el-icon>
              深入
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <template #footer>
        <el-button @click="settingsVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
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
  StarFilled,
  Setting,
  Sort,
  Sprout,
  Medal,
  TrendCharts,
  Level,
  Aim
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  psychologyKnowledgeList,
  categoryInfo,
  difficultyInfo,
  recommendModeInfo,
  getKnowledgeByCategory,
  getKnowledgeByDifficulty,
  getKnowledgeByDateAndDifficulty,
  getRandomKnowledge,
  calculateAdaptiveDifficulty,
  getDifficultyCounts,
  type PsychologyKnowledge,
  type DifficultyLevel,
  type RecommendMode
} from '@/data/psychologyKnowledge'

const STORAGE_KEY = 'daily_psychology_data'
const today = new Date().toISOString().split('T')[0]

interface StorageData {
  learnedIds: number[]
  lastCheckDate: string | null
  streakDays: number
  currentKnowledgeId: number | null
  recommendMode: RecommendMode
  fixedDifficulty: DifficultyLevel
  mixedTargetLevel: DifficultyLevel
  showAdaptiveTip: boolean
}

const loadStorage = (): StorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        learnedIds: [],
        lastCheckDate: null,
        streakDays: 0,
        currentKnowledgeId: null,
        recommendMode: 'progressive',
        fixedDifficulty: 'beginner',
        mixedTargetLevel: 'beginner',
        showAdaptiveTip: true,
        ...parsed
      }
    }
  } catch (e) {
    console.error('Failed to load storage', e)
  }
  return {
    learnedIds: [],
    lastCheckDate: null,
    streakDays: 0,
    currentKnowledgeId: null,
    recommendMode: 'progressive',
    fixedDifficulty: 'beginner',
    mixedTargetLevel: 'beginner',
    showAdaptiveTip: true
  }
}

const saveStorage = (data: StorageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const storageData = ref<StorageData>(loadStorage())
const activeMode = ref<'today' | 'list' | 'category'>('today')
const searchKeyword = ref('')
const listDifficultyFilter = ref<string>('all')
const categoryDifficultyFilter = ref<string>('all')
const selectedCategory = ref<string | null>(null)
const selectedKnowledge = ref<PsychologyKnowledge | null>(null)
const detailVisible = ref(false)
const settingsVisible = ref(false)
const cardAppear = ref(false)

const recommendMode = ref<RecommendMode>(storageData.value.recommendMode)
const fixedDifficulty = ref<DifficultyLevel>(storageData.value.fixedDifficulty)
const mixedTargetLevel = ref<DifficultyLevel>(storageData.value.mixedTargetLevel)
const showAdaptiveTip = computed(() => storageData.value.showAdaptiveTip && recommendMode.value === 'progressive')

const learnedBeginner = computed(() =>
  storageData.value.learnedIds.filter(id => {
    const k = psychologyKnowledgeList.find(item => item.id === id)
    return k?.difficulty === 'beginner'
  }).length
)

const learnedIntermediate = computed(() =>
  storageData.value.learnedIds.filter(id => {
    const k = psychologyKnowledgeList.find(item => item.id === id)
    return k?.difficulty === 'intermediate'
  }).length
)

const currentAdaptive = computed(() =>
  calculateAdaptiveDifficulty(learnedBeginner.value, learnedIntermediate.value)
)

const getRecommendedDifficulties = computed((): DifficultyLevel[] => {
  if (recommendMode.value === 'fixed') {
    return [fixedDifficulty.value]
  } else if (recommendMode.value === 'mixed') {
    const levels: DifficultyLevel[] = [mixedTargetLevel.value]
    const order: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced']
    const idx = order.indexOf(mixedTargetLevel.value)
    if (idx < 2) levels.push(order[idx + 1])
    if (idx > 0) levels.push(order[idx - 1])
    return levels
  } else {
    return currentAdaptive.value.recommendedLevels
  }
})

const todayKnowledge = computed(() => {
  if (storageData.value.currentKnowledgeId !== null) {
    const k = psychologyKnowledgeList.find(item => item.id === storageData.value.currentKnowledgeId)
    if (k) return k
  }
  const k = getKnowledgeByDateAndDifficulty(today, getRecommendedDifficulties.value)
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
  let list = psychologyKnowledgeList
  if (listDifficultyFilter.value !== 'all') {
    list = list.filter(k => k.difficulty === listDifficultyFilter.value)
  }
  if (listDifficultyFilter.value === 'all' && searchKeyword.value.trim() === '') return list
  const kw = searchKeyword.value.toLowerCase()
  return list.filter(k =>
    k.title.toLowerCase().includes(kw) ||
    k.coreConcept.toLowerCase().includes(kw) ||
    k.practicalApplications.some(a => a.toLowerCase().includes(kw)) ||
    k.relatedConcepts.some(r => r.toLowerCase().includes(kw))
  )
})

const filteredCategoryList = computed(() => {
  if (!selectedCategory.value) return []
  let list = getKnowledgeByCategory(selectedCategory.value)
  if (categoryDifficultyFilter.value !== 'all') {
    list = list.filter(k => k.difficulty === categoryDifficultyFilter.value)
  }
  return list
})

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const isLearned = (id: number) => storageData.value.learnedIds.includes(id)

const getLearnedByDifficulty = (diff: DifficultyLevel) => {
  return storageData.value.learnedIds.filter(id => {
    const k = psychologyKnowledgeList.find(item => item.id === id)
    return k?.difficulty === diff
  }).length
}

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
  const random = getRandomKnowledge(currentKnowledge.value.id, getRecommendedDifficulties.value)
  currentKnowledge.value = random
  storageData.value.currentKnowledgeId = random.id
  saveStorage(storageData.value)
  cardAppear.value = false
  setTimeout(() => (cardAppear.value = true), 50)
}

const handleQuickSwitch = (command: string) => {
  if (command === 'adaptive') {
    refreshKnowledge()
    ElMessage.info('已切换为智能推荐模式')
    return
  }
  const diff = command as DifficultyLevel
  const random = getRandomKnowledge(currentKnowledge.value.id, diff)
  currentKnowledge.value = random
  storageData.value.currentKnowledgeId = random.id
  saveStorage(storageData.value)
  cardAppear.value = false
  setTimeout(() => (cardAppear.value = true), 50)
  ElMessage.success(`已切换为你推荐${difficultyInfo[diff].name}难度的知识点`)
}

const viewKnowledge = (k: PsychologyKnowledge) => {
  selectedKnowledge.value = k
  detailVisible.value = true
}

const selectCategory = (cat: string) => {
  selectedCategory.value = cat
  categoryDifficultyFilter.value = 'all'
}

const dismissAdaptiveTip = () => {
  storageData.value.showAdaptiveTip = false
  saveStorage(storageData.value)
}

const saveSettings = () => {
  storageData.value.recommendMode = recommendMode.value
  storageData.value.fixedDifficulty = fixedDifficulty.value
  storageData.value.mixedTargetLevel = mixedTargetLevel.value
  saveStorage(storageData.value)
  settingsVisible.value = false
  const random = getRandomKnowledge(currentKnowledge.value.id, getRecommendedDifficulties.value)
  currentKnowledge.value = random
  storageData.value.currentKnowledgeId = random.id
  saveStorage(storageData.value)
  cardAppear.value = false
  setTimeout(() => (cardAppear.value = true), 50)
  ElMessage.success('设置已保存，已为你重新推荐知识点')
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

.hero-text {
  flex: 1;
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
  margin: 0 0 14px 0;
  opacity: 0.9;
}

.hero-mode-badge {
  display: inline-flex;
}

.mode-tag {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  font-size: 13px;
  transition: all 0.3s;
}

.mode-tag:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 28px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 26px;
  font-weight: bold;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
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

.adaptive-tip-card {
  margin-bottom: 16px;
  border: 1px solid #faecd8;
  background: #fdf6ec;
}

.adaptive-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.tip-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tip-text {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
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
  align-items: center;
}

.difficulty-tag-large {
  display: inline-flex;
  align-items: center;
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
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.difficulty-desc {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  color: #606266;
  margin-bottom: 16px;
}

.difficulty-desc :deep(.el-icon) {
  color: inherit;
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
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.progress-text {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #909399;
  font-size: 14px;
}

.mini-progress {
  width: 140px;
}

.difficulty-progress {
  display: flex;
  gap: 6px;
}

.diff-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: help;
  transition: transform 0.2s;
}

.diff-dot:hover {
  transform: scale(1.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  flex-wrap: wrap;
}

.header-filters {
  margin-left: auto;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.difficulty-filter {
  margin-right: 8px;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.mini-card {
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  position: relative;
  overflow: visible;
}

.mini-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.mini-card :deep(.el-card__body) {
  padding: 24px 20px 20px;
}

.mini-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  transition: all 0.3s;
}

.mini-card:hover .mini-icon {
  transform: scale(1.1);
}

.mini-difficulty {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.mini-title {
  font-size: 17px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 8px 0;
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
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.category-item {
  cursor: pointer;
  padding: 24px 16px;
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.cat-icon {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  transition: all 0.3s;
}

.category-item:hover .cat-icon {
  transform: scale(1.1) rotate(5deg);
}

.cat-name {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 4px 0;
}

.cat-count {
  font-size: 13px;
  color: #909399;
  margin: 0 0 10px;
}

.cat-difficulty-preview {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.cat-diff-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
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

.settings-content {
  padding: 8px 0;
}

.settings-section {
  margin-bottom: 28px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 16px 0;
}

.settings-desc {
  font-size: 14px;
  color: #909399;
  margin: 0 0 16px 0;
}

.mode-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafbfc;
}

.mode-option:hover {
  border-color: #dcdfe6;
  background: #fff;
}

.mode-option.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
}

.mode-option-icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  color: #606266;
}

.mode-option-icon.progressive {
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
}

.mode-option-icon.fixed {
  background: rgba(230, 162, 60, 0.15);
  color: #E6A23C;
}

.mode-option-icon.mixed {
  background: rgba(103, 194, 58, 0.15);
  color: #67C23A;
}

.mode-option-info {
  flex: 1;
}

.mode-option-info h4 {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 4px 0;
}

.mode-option-info p {
  font-size: 13px;
  color: #909399;
  margin: 0;
  line-height: 1.6;
}

.mode-option-radio {
  flex-shrink: 0;
}

.difficulty-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.difficulty-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafbfc;
}

.difficulty-option:hover {
  border-color: var(--diff-color);
  background: #fff;
}

.difficulty-option.active {
  border-color: var(--diff-color);
  background: color-mix(in srgb, var(--diff-color) 8%, #fff);
}

.diff-option-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--diff-color);
  color: #fff;
}

.diff-option-info {
  flex: 1;
}

.diff-option-info h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 4px 0;
}

.diff-option-info p {
  font-size: 13px;
  color: #909399;
  margin: 0 0 6px 0;
  line-height: 1.5;
}

.diff-count {
  font-size: 12px;
  color: var(--diff-color);
  font-weight: 500;
}

.diff-option-radio {
  flex-shrink: 0;
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
    flex-wrap: wrap;
    gap: 16px;
  }

  .stat-divider {
    display: none;
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
    align-items: center;
  }

  .header-filters {
    margin-left: 0;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .difficulty-filter {
    width: 100%;
    margin-right: 0;
  }

  .header-filters :deep(.el-input) {
    width: 100% !important;
  }

  .tip-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
