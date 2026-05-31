<template>
  <div class="random-picker">
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
        <el-step title="输入选项" description="填写两个备选选项，或使用默认的正反面" />
        <el-step title="点击开始" description="点击按钮开始随机抽取" />
        <el-step title="查看结果" description="等待动画结束后查看最终结果和统计数据" />
      </el-steps>
    </el-card>

    <el-card class="picker-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Coin />
          </el-icon>
          <span>随机抉择</span>
          <el-tag size="small" type="info" class="header-tag">帮你快速做决定</el-tag>
        </div>
      </template>

      <div class="quick-preset">
        <span class="preset-label">快捷选项：</span>
        <el-button-group>
          <el-button size="small" @click="applyPreset('coin')">
            <el-icon><Coin /></el-icon>
            抛硬币
          </el-button>
          <el-button size="small" @click="applyPreset('yesno')">
            <el-icon><CircleCheck /></el-icon>
            是否选择
          </el-button>
          <el-button size="small" @click="applyPreset('eat')">
            <el-icon><KnifeFork /></el-icon>
            吃什么
          </el-button>
          <el-button size="small" @click="applyPreset('do')">
            <el-icon><Timer /></el-icon>
            做不做
          </el-button>
        </el-button-group>
      </div>

      <el-form label-width="80px" class="picker-form">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="选项A">
              <el-input v-model="optionA" placeholder="请输入第一个选项" maxlength="20" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选项B">
              <el-input v-model="optionB" placeholder="请输入第二个选项" maxlength="20" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="coin-container">
        <div class="coin-wrapper" :class="{ flipping: isFlipping }">
          <div class="coin" :style="{ transform: `rotateY(${rotation}deg)` }">
            <div class="coin-face coin-front">
              <span>{{ displayOption }}</span>
            </div>
            <div class="coin-face coin-back">
              <span>{{ displayOptionBack }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="result-container" v-if="result && !isFlipping">
        <el-alert
          :title="`结果：${result}`"
          type="success"
          :closable="false"
          show-icon
          class="result-alert"
        >
          <template #default>
            <div class="result-details">
              <p class="result-message">命运的选择已经做出，勇敢接受吧！</p>
              <div class="fairness-badge">
                <el-icon><Lock /></el-icon>
                <span>公平随机 · 50%/50% 概率</span>
              </div>
              <div class="random-info">
                <div class="info-item">
                  <span class="info-label">算法</span>
                  <span class="info-value">Crypto-secure RNG</span>
                </div>
                <div class="info-item">
                  <span class="info-label">种子</span>
                  <span class="info-value">#{{ randomSeed }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">时间戳</span>
                  <span class="info-value">{{ resultTimestamp }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-alert>

        <el-card class="quick-stats-card" shadow="never" v-if="currentGroupHistory.length > 0">
          <div class="quick-stats-header">
            <el-icon :size="16" color="#165DFF"><DataLine /></el-icon>
            <span>本次抉择后统计</span>
          </div>
          <div class="quick-stats-content">
            <div class="quick-stat-item">
              <div class="quick-stat-label">总次数</div>
              <div class="quick-stat-value highlight">{{ currentGroupHistory.length }}</div>
            </div>
            <div class="quick-stat-item">
              <div class="quick-stat-label">{{ optionA }}</div>
              <div class="quick-stat-value success">{{ currentOptionACount }} 次</div>
              <div class="quick-stat-percent success">{{ currentOptionAPercent }}%</div>
            </div>
            <div class="quick-stat-item">
              <div class="quick-stat-label">{{ optionB }}</div>
              <div class="quick-stat-value primary">{{ currentOptionBCount }} 次</div>
              <div class="quick-stat-percent primary">{{ currentOptionBPercent }}%</div>
            </div>
            <div class="quick-stat-item">
              <div class="quick-stat-label">当前连胜</div>
              <div class="quick-stat-value streak">{{ currentStreak }} 次</div>
              <div class="quick-stat-percent streak">{{ lastResultName }}</div>
            </div>
          </div>
          <div class="quick-stats-footer" v-if="currentGroupHistory.length >= 5">
            <el-tag size="small" :type="randomnessLevel.type">{{ randomnessLevel.label }}</el-tag>
            <span class="quick-stats-hint">{{ quickStatsHint }}</span>
          </div>
        </el-card>
      </div>

      <div class="action-buttons">
        <el-button
          type="primary"
          size="large"
          :icon="MagicStick"
          @click="startPick"
          :disabled="isFlipping"
          :loading="isFlipping"
          class="pick-button"
        >
          {{ isFlipping ? '抉择中...' : '开始抉择' }}
        </el-button>
        <el-button
          size="large"
          :icon="Refresh"
          @click="reset"
          :disabled="isFlipping"
        >
          重置
        </el-button>
      </div>
    </el-card>

    <el-tabs v-model="activeTab" class="stats-tabs">
      <el-tab-pane name="current" label="当前选项统计">
        <el-card class="distribution-card" shadow="never" v-if="currentGroupHistory.length > 0">
          <div class="stats-header">
            <el-icon :size="18" color="#165DFF"><DataLine /></el-icon>
            <span>{{ optionA }} vs {{ optionB }} · 分布统计</span>
            <el-tag size="small" type="info" class="stats-tag">基于 {{ currentGroupHistory.length }} 次记录</el-tag>
          </div>
          <div class="distribution-content">
            <div class="pie-chart-container">
              <div class="pie-chart" :style="pieChartStyle">
                <div class="pie-chart-inner">
                  <div class="pie-chart-center">
                    <div class="pie-chart-total">{{ currentGroupHistory.length }}</div>
                    <div class="pie-chart-label">总次数</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="distribution-details">
              <div class="distribution-item">
                <div class="distribution-color" style="background: #67c23a"></div>
                <div class="distribution-info">
                  <div class="distribution-name">{{ optionA }}</div>
                  <div class="distribution-stats">
                    <span class="distribution-count">{{ currentOptionACount }} 次</span>
                    <span class="distribution-percent">{{ currentOptionAPercent }}%</span>
                  </div>
                </div>
                <div class="distribution-bar">
                  <div class="distribution-bar-inner" :style="{ width: currentOptionAPercent + '%', background: '#67c23a' }"></div>
                </div>
              </div>
              <div class="distribution-item">
                <div class="distribution-color" style="background: #409eff"></div>
                <div class="distribution-info">
                  <div class="distribution-name">{{ optionB }}</div>
                  <div class="distribution-stats">
                    <span class="distribution-count">{{ currentOptionBCount }} 次</span>
                    <span class="distribution-percent">{{ currentOptionBPercent }}%</span>
                  </div>
                </div>
                <div class="distribution-bar">
                  <div class="distribution-bar-inner" :style="{ width: currentOptionBPercent + '%', background: '#409eff' }"></div>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="empty-stats-card" shadow="never" v-else>
          <div class="empty-stats-content">
            <el-icon :size="48" color="#c0c4cc"><DataLine /></el-icon>
            <p class="empty-stats-text">暂无统计数据</p>
            <p class="empty-stats-hint">开始抉择后，这里将显示详细的统计分析</p>
          </div>
        </el-card>

        <el-row :gutter="16" class="advanced-stats" v-if="currentGroupHistory.length > 0">
          <el-col :span="8">
            <el-card class="metric-card" shadow="never">
              <div class="metric-icon win">
                <el-icon><Trophy /></el-icon>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ currentStreak }}</div>
                <div class="metric-label">当前连胜</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="metric-card" shadow="never">
              <div class="metric-icon streak">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ maxStreak }}</div>
                <div class="metric-label">最长连胜</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="metric-card" shadow="never">
              <div class="metric-icon deviate">
                <el-icon><PieChart /></el-icon>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ probabilityDeviation }}%</div>
                <div class="metric-label">概率偏差</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-card class="insights-card" shadow="never" v-if="currentGroupHistory.length >= 5">
          <div class="stats-header">
            <el-icon :size="18" color="#165DFF"><DataAnalysis /></el-icon>
            <span>数据洞察</span>
            <el-tag size="small" :type="randomnessLevel.type" class="stats-tag">{{ randomnessLevel.label }}</el-tag>
          </div>
          <div class="insights-content">
            <div class="insight-item">
              <div class="insight-icon" :class="fairnessClass">
                <el-icon><Star /></el-icon>
              </div>
              <div class="insight-info">
                <div class="insight-title">公平性评估</div>
                <div class="insight-desc">{{ fairnessAnalysis }}</div>
              </div>
            </div>
            <div class="insight-item">
              <div class="insight-icon" :class="trendClass">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="insight-info">
                <div class="insight-title">趋势分析</div>
                <div class="insight-desc">{{ trendAnalysis }}</div>
              </div>
            </div>
            <div class="insight-item">
              <div class="insight-icon" :class="patternClass">
                <el-icon><MagicStick /></el-icon>
              </div>
              <div class="insight-info">
                <div class="insight-title">模式识别</div>
                <div class="insight-desc">{{ patternAnalysis }}</div>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="trend-card" shadow="never" v-if="currentGroupHistory.length >= 5">
          <div class="stats-header">
            <el-icon :size="18" color="#165DFF"><Histogram /></el-icon>
            <span>最近 10 次趋势</span>
          </div>
          <div class="trend-content">
            <div class="trend-item" v-for="(item, index) in recentTrend" :key="index">
              <div class="trend-bar-wrapper">
                <div 
                  class="trend-bar" 
                  :class="{ 'trend-a': item.result === optionA, 'trend-b': item.result === optionB }"
                  :style="{ height: '100%' }"
                ></div>
              </div>
              <div class="trend-label">{{ index + 1 }}</div>
              <div class="trend-result" :class="{ 'result-a': item.result === optionA, 'result-b': item.result === optionB }">
                {{ item.result === optionA ? 'A' : 'B' }}
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane name="all" label="全部统计">
        <el-card class="all-stats-card" shadow="never">
          <div class="stats-header">
            <el-icon :size="18" color="#165DFF"><DataAnalysis /></el-icon>
            <span>全局统计概览</span>
            <el-tag size="small" type="success">数据已持久化</el-tag>
          </div>
          <el-row :gutter="16" class="global-metrics">
            <el-col :span="6">
              <div class="global-metric">
                <div class="global-metric-value">{{ totalCount }}</div>
                <div class="global-metric-label">总抉择次数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="global-metric">
                <div class="global-metric-value">{{ groupCount }}</div>
                <div class="global-metric-label">选项组数量</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="global-metric">
                <div class="global-metric-value">{{ mostUsedGroup }}</div>
                <div class="global-metric-label">最常用选项</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="global-metric">
                <div class="global-metric-value">{{ todayCount }}</div>
                <div class="global-metric-label">今日抉择</div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <el-card class="group-stats-card" shadow="never" v-if="groupStats.length > 0">
          <div class="stats-header">
            <el-icon :size="18" color="#165DFF"><Files /></el-icon>
            <span>各选项组统计</span>
          </div>
          <div class="group-list">
            <div 
              class="group-item" 
              v-for="(group, index) in groupStats" 
              :key="index"
              @click="switchToGroup(group)"
            >
              <div class="group-info">
                <div class="group-name">{{ group.optionA }} vs {{ group.optionB }}</div>
                <div class="group-meta">
                  <el-tag size="small" type="info">{{ group.count }} 次</el-tag>
                  <span class="group-percent">{{ group.optionA }}: {{ group.percentA }}% | {{ group.optionB }}: {{ group.percentB }}%</span>
                </div>
              </div>
              <div class="group-bar">
                <div class="group-bar-a" :style="{ width: group.percentA + '%' }"></div>
                <div class="group-bar-b" :style="{ width: group.percentB + '%' }"></div>
              </div>
              <el-icon class="group-arrow"><Right /></el-icon>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-card class="history-card" v-if="history.length > 0">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Clock />
          </el-icon>
          <span>历史记录</span>
          <el-button size="small" text type="danger" @click="clearHistory">
            清空记录
          </el-button>
        </div>
      </template>

      <div class="history-summary" v-if="currentGroupHistory.length > 0">
        <div class="summary-title">当前选项统计摘要</div>
        <div class="summary-content">
          <div class="summary-item">
            <span class="summary-label">{{ optionA }}</span>
            <span class="summary-value success">{{ currentOptionACount }} 次 ({{ currentOptionAPercent }}%)</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <span class="summary-label">{{ optionB }}</span>
            <span class="summary-value primary">{{ currentOptionBCount }} 次 ({{ currentOptionBPercent }}%)</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <span class="summary-label">总计</span>
            <span class="summary-value highlight">{{ currentGroupHistory.length }} 次</span>
          </div>
        </div>
      </div>

      <div class="history-list">
        <div class="history-item" v-for="(item, index) in displayHistory" :key="index">
          <span class="history-time">{{ formatTime(item.time) }}</span>
          <span class="history-options">{{ item.optionA }} vs {{ item.optionB }}</span>
          <span class="history-result" :class="{ 'result-a': item.result === item.optionA, 'result-b': item.result === item.optionB }">{{ item.result }}</span>
        </div>
      </div>
      <div class="history-footer" v-if="history.length > 20">
        <el-button text size="small" @click="showAllHistory = !showAllHistory">
          {{ showAllHistory ? '收起' : `查看全部 ${history.length} 条记录` }}
        </el-button>
      </div>
    </el-card>

    <div class="floating-stats" v-if="currentGroupHistory.length >= 3">
      <div class="floating-stats-content">
        <div class="floating-stat-item">
          <span class="floating-stat-label">总次数</span>
          <span class="floating-stat-value highlight">{{ currentGroupHistory.length }}</span>
        </div>
        <div class="floating-stat-divider"></div>
        <div class="floating-stat-item">
          <span class="floating-stat-label">{{ optionA }}</span>
          <span class="floating-stat-value success">{{ currentOptionACount }} ({{ currentOptionAPercent }}%)</span>
        </div>
        <div class="floating-stat-divider"></div>
        <div class="floating-stat-item">
          <span class="floating-stat-label">{{ optionB }}</span>
          <span class="floating-stat-value primary">{{ currentOptionBCount }} ({{ currentOptionBPercent }}%)</span>
        </div>
        <div class="floating-stat-divider"></div>
        <div class="floating-stat-item">
          <span class="floating-stat-label">连胜</span>
          <span class="floating-stat-value streak">{{ currentStreak }} 次</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  Coin,
  InfoFilled,
  CircleCheck,
  KnifeFork,
  Timer,
  MagicStick,
  Refresh,
  Clock,
  Lock,
  DataLine,
  Trophy,
  TrendCharts,
  PieChart,
  Histogram,
  DataAnalysis,
  Files,
  Right,
  Star
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface HistoryItem {
  optionA: string
  optionB: string
  result: string
  time: string
  seed: number
}

interface GroupStat {
  optionA: string
  optionB: string
  count: number
  countA: number
  countB: number
  percentA: number
  percentB: number
}

const STORAGE_KEY = 'random_picker_history'

const optionA = ref('正面')
const optionB = ref('反面')
const isFlipping = ref(false)
const result = ref('')
const rotation = ref(0)
const history = ref<HistoryItem[]>([])
const randomSeed = ref(0)
const resultTimestamp = ref('')
const activeTab = ref('current')
const showAllHistory = ref(false)

const loadHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      history.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
}

const saveHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

onMounted(() => {
  loadHistory()
})

watch(history, () => {
  saveHistory()
}, { deep: true })

const getOptionGroupKey = (a: string, b: string) => {
  const sorted = [a, b].sort()
  return `${sorted[0]}|${sorted[1]}`
}

const isSameGroup = (item: HistoryItem, a: string, b: string) => {
  return getOptionGroupKey(item.optionA, item.optionB) === getOptionGroupKey(a, b)
}

const currentGroupHistory = computed(() => {
  return history.value.filter(h => isSameGroup(h, optionA.value, optionB.value))
})

const currentOptionACount = computed(() => {
  return currentGroupHistory.value.filter(h => h.result === optionA.value).length
})

const currentOptionBCount = computed(() => {
  return currentGroupHistory.value.filter(h => h.result === optionB.value).length
})

const currentOptionAPercent = computed(() => {
  if (currentGroupHistory.value.length === 0) return 50
  return Math.round((currentOptionACount.value / currentGroupHistory.value.length) * 100)
})

const currentOptionBPercent = computed(() => {
  if (currentGroupHistory.value.length === 0) return 50
  return Math.round((currentOptionBCount.value / currentGroupHistory.value.length) * 100)
})

const currentStreak = computed(() => {
  if (currentGroupHistory.value.length === 0) return 0
  let streak = 0
  const lastResult = currentGroupHistory.value[currentGroupHistory.value.length - 1].result
  for (let i = currentGroupHistory.value.length - 1; i >= 0; i--) {
    if (currentGroupHistory.value[i].result === lastResult) {
      streak++
    } else {
      break
    }
  }
  return streak
})

const maxStreak = computed(() => {
  if (currentGroupHistory.value.length === 0) return 0
  let maxStreak = 1
  let currentStreak = 1
  for (let i = 1; i < currentGroupHistory.value.length; i++) {
    if (currentGroupHistory.value[i].result === currentGroupHistory.value[i - 1].result) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }
  return maxStreak
})

const probabilityDeviation = computed(() => {
  if (currentGroupHistory.value.length === 0) return '0.0'
  const deviation = Math.abs(currentOptionAPercent.value - 50)
  return deviation.toFixed(1)
})

const recentTrend = computed(() => {
  return currentGroupHistory.value.slice(-10).reverse()
})

const pieChartStyle = computed(() => {
  if (currentGroupHistory.value.length === 0) {
    return { background: 'conic-gradient(#e4e7ed 0deg 360deg)' }
  }
  const angleA = (currentOptionAPercent.value / 100) * 360
  return {
    background: `conic-gradient(#67c23a 0deg ${angleA}deg, #409eff ${angleA}deg 360deg)`
  }
})

const randomnessLevel = computed(() => {
  if (currentGroupHistory.value.length < 10) {
    return { type: 'info', label: '数据不足' }
  }
  const deviation = parseFloat(probabilityDeviation.value)
  if (deviation <= 5) {
    return { type: 'success', label: '高度随机' }
  } else if (deviation <= 15) {
    return { type: 'warning', label: '基本随机' }
  } else {
    return { type: 'danger', label: '偏差较大' }
  }
})

const fairnessAnalysis = computed(() => {
  if (currentGroupHistory.value.length < 5) {
    return '数据较少，继续抉择以获得更准确的评估'
  }
  const deviation = parseFloat(probabilityDeviation.value)
  if (deviation <= 5) {
    return `分布非常均衡（偏差${deviation}%），算法表现良好`
  } else if (deviation <= 15) {
    return `分布基本均衡（偏差${deviation}%），属于正常波动范围`
  } else {
    return `分布偏差较大（${deviation}%），可能是小概率事件`
  }
})

const trendAnalysis = computed(() => {
  if (currentGroupHistory.value.length < 5) {
    return '需要更多数据来分析趋势'
  }
  const streak = currentStreak.value
  const lastResult = currentGroupHistory.value[currentGroupHistory.value.length - 1]?.result
  if (streak >= 5) {
    return `${lastResult} 已连续出现 ${streak} 次，这是一个罕见的连胜！`
  } else if (streak >= 3) {
    return `${lastResult} 正在连胜（${streak}次），接下来可能会反转`
  } else {
    return '近期结果交替出现，趋势平稳'
  }
})

const patternAnalysis = computed(() => {
  if (currentGroupHistory.value.length < 8) {
    return '需要更多数据来识别模式'
  }
  const recent = currentGroupHistory.value.slice(-8)
  let alternations = 0
  for (let i = 1; i < recent.length; i++) {
    if (recent[i].result !== recent[i - 1].result) {
      alternations++
    }
  }
  if (alternations >= 6) {
    return '交替模式明显，结果呈现规律性交替'
  } else if (alternations <= 2) {
    return '聚集模式明显，相同结果连续出现'
  } else {
    return '模式混合，既有交替也有聚集，符合随机特性'
  }
})

const fairnessClass = computed(() => {
  const deviation = parseFloat(probabilityDeviation.value)
  if (currentGroupHistory.value.length < 5) return 'neutral'
  if (deviation <= 5) return 'good'
  if (deviation <= 15) return 'warning'
  return 'bad'
})

const trendClass = computed(() => {
  if (currentGroupHistory.value.length < 5) return 'neutral'
  const streak = currentStreak.value
  if (streak >= 5) return 'bad'
  if (streak >= 3) return 'warning'
  return 'good'
})

const patternClass = computed(() => {
  if (currentGroupHistory.value.length < 8) return 'neutral'
  const recent = currentGroupHistory.value.slice(-8)
  let alternations = 0
  for (let i = 1; i < recent.length; i++) {
    if (recent[i].result !== recent[i - 1].result) {
      alternations++
    }
  }
  if (alternations >= 6 || alternations <= 2) return 'warning'
  return 'good'
})

const totalCount = computed(() => history.value.length)

const groupCount = computed(() => {
  const groups = new Set<string>()
  history.value.forEach(h => {
    groups.add(getOptionGroupKey(h.optionA, h.optionB))
  })
  return groups.size
})

const groupStats = computed((): GroupStat[] => {
  const groups: Record<string, GroupStat> = {}
  
  history.value.forEach(item => {
    const key = getOptionGroupKey(item.optionA, item.optionB)
    if (!groups[key]) {
      groups[key] = {
        optionA: item.optionA,
        optionB: item.optionB,
        count: 0,
        countA: 0,
        countB: 0,
        percentA: 50,
        percentB: 50
      }
    }
    groups[key].count++
    if (item.result === item.optionA) {
      groups[key].countA++
    } else {
      groups[key].countB++
    }
  })

  return Object.values(groups).map(group => ({
    ...group,
    percentA: Math.round((group.countA / group.count) * 100),
    percentB: Math.round((group.countB / group.count) * 100)
  })).sort((a, b) => b.count - a.count)
})

const mostUsedGroup = computed(() => {
  if (groupStats.value.length === 0) return '-'
  const top = groupStats.value[0]
  return `${top.optionA}/${top.optionB}`
})

const todayCount = computed(() => {
  const today = new Date().toDateString()
  return history.value.filter(h => new Date(h.time).toDateString() === today).length
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  if (showAllHistory.value) {
    return reversed
  }
  return reversed.slice(0, 20)
})

const displayOption = computed(() => {
  if (isFlipping.value) {
    return Math.random() > 0.5 ? optionA.value : optionB.value
  }
  return optionA.value
})

const displayOptionBack = computed(() => {
  return optionB.value
})

const lastResultName = computed(() => {
  if (currentGroupHistory.value.length === 0) return '-'
  const lastResult = currentGroupHistory.value[currentGroupHistory.value.length - 1]?.result
  return lastResult || '-'
})

const quickStatsHint = computed(() => {
  if (currentGroupHistory.value.length < 5) {
    return '继续抉择获得更准确统计'
  }
  const deviation = parseFloat(probabilityDeviation.value)
  if (deviation <= 5) {
    return '分布均衡，随机性良好'
  } else if (deviation <= 15) {
    return '略有偏差，属正常波动'
  } else {
    return '偏差较大，可能是小概率事件'
  }
})

const presets: Record<string, { optionA: string; optionB: string }> = {
  coin: { optionA: '正面', optionB: '反面' },
  yesno: { optionA: '是', optionB: '否' },
  eat: { optionA: '外卖', optionB: '食堂' },
  do: { optionA: '现在做', optionB: '稍后做' }
}

const applyPreset = (type: string) => {
  const preset = presets[type]
  if (preset) {
    optionA.value = preset.optionA
    optionB.value = preset.optionB
    result.value = ''
    const presetNames: Record<string, string> = {
      coin: '抛硬币',
      yesno: '是否选择',
      eat: '吃什么',
      do: '做不做'
    }
    ElMessage.success(`已加载${presetNames[type]}选项`)
  }
}

const getSecureRandom = () => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] / 0xffffffff
  }
  return Math.random()
}

const startPick = () => {
  if (!optionA.value || !optionB.value) {
    ElMessage.warning('请填写两个选项')
    return
  }

  isFlipping.value = true
  result.value = ''

  const seed = Math.floor(getSecureRandom() * 1000000)
  const flipDuration = 2000
  const startTime = Date.now()
  const startRotation = rotation.value
  const totalRotation = 1800 + getSecureRandom() * 360

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / flipDuration, 1)
    const easeProgress = 1 - Math.pow(1 - progress, 3)

    rotation.value = startRotation + totalRotation * easeProgress

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      isFlipping.value = false
      const finalResult = getSecureRandom() > 0.5 ? optionA.value : optionB.value
      result.value = finalResult
      randomSeed.value = seed
      resultTimestamp.value = new Date().toISOString()

      history.value.push({
        optionA: optionA.value,
        optionB: optionB.value,
        result: finalResult,
        time: new Date().toISOString(),
        seed: seed
      })

      ElMessage.success('抉择完成！')
    }
  }

  animate()
}

const reset = () => {
  optionA.value = '正面'
  optionB.value = '反面'
  result.value = ''
  rotation.value = 0
}

const clearHistory = () => {
  history.value = []
  ElMessage.success('历史记录已清空')
}

const switchToGroup = (group: GroupStat) => {
  optionA.value = group.optionA
  optionB.value = group.optionB
  result.value = ''
  activeTab.value = 'current'
  ElMessage.success(`已切换到 ${group.optionA} vs ${group.optionB}`)
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>

<style scoped>
.random-picker {
  max-width: 800px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.picker-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.header-tag {
  margin-left: 12px;
  font-weight: normal;
}

.quick-preset {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.preset-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.picker-form {
  margin-bottom: 30px;
}

.coin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  perspective: 1000px;
}

.coin-wrapper {
  width: 200px;
  height: 200px;
  perspective: 1000px;
}

.coin {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.1s linear;
}

.coin-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  backface-visibility: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.coin-front {
  background: linear-gradient(145deg, #ffd700, #ffb800);
  color: #8b4513;
  border: 4px solid #daa520;
}

.coin-back {
  background: linear-gradient(145deg, #c0c0c0, #a0a0a0);
  color: #333;
  border: 4px solid #888;
  transform: rotateY(180deg);
}

.flipping .coin {
  animation: none;
}

.result-container {
  margin: 20px 0 30px 0;
}

.result-alert {
  text-align: center;
}

.result-alert :deep(.el-alert__title) {
  font-size: 24px;
  font-weight: bold;
}

.result-alert :deep(.el-alert__description) {
  margin-top: 16px;
}

.result-details {
  text-align: left;
}

.result-message {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
}

.fairness-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  border: 1px solid #91d5ff;
  border-radius: 20px;
  font-size: 13px;
  color: #1890ff;
  font-weight: 500;
  margin-bottom: 16px;
}

.fairness-badge .el-icon {
  font-size: 14px;
}

.random-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #909399;
}

.info-value {
  font-size: 13px;
  color: #303133;
  font-family: 'Monaco', 'Menlo', monospace;
  word-break: break-all;
}

.stats-card {
  margin-top: 16px;
  background: #fafafa;
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.stat-bar {
  width: 100%;
  height: 12px;
  background: #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
}

.stat-bar-inner {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.stat-value {
  font-size: 12px;
  color: #909399;
}

.stats-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.stats-hint {
  font-size: 12px;
  color: #909399;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.pick-button {
  width: 200px;
  height: 56px;
  font-size: 18px;
}

.history-card {
  margin-bottom: 24px;
}

.history-card .card-header {
  justify-content: space-between;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  gap: 16px;
}

.history-item:last-child {
  border-bottom: none;
}

.history-time {
  font-size: 12px;
  color: #909399;
  min-width: 70px;
}

.history-options {
  flex: 1;
  font-size: 14px;
  color: #606266;
}

.history-result {
  font-size: 16px;
  font-weight: bold;
  color: #67c23a;
  background: #f0f9eb;
  padding: 4px 12px;
  border-radius: 4px;
}

.history-result.result-a {
  color: #67c23a;
  background: #f0f9eb;
}

.history-result.result-b {
  color: #409eff;
  background: #ecf5ff;
}

.history-footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.stats-tabs {
  margin-bottom: 24px;
}

.stats-tag {
  margin-left: auto;
  font-weight: normal;
}

.advanced-stats {
  margin-top: 16px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fafafa;
}

.metric-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
}

.metric-icon.win {
  background: linear-gradient(135deg, #ffd700, #ffb800);
}

.metric-icon.streak {
  background: linear-gradient(135deg, #67c23a, #529e2e);
}

.metric-icon.deviate {
  background: linear-gradient(135deg, #409eff, #337ecc);
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.metric-label {
  font-size: 13px;
  color: #909399;
  margin-top: 6px;
}

.trend-card {
  margin-top: 16px;
  background: #fafafa;
}

.trend-content {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 120px;
  padding: 20px 0;
}

.trend-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.trend-bar-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.trend-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  transition: height 0.3s ease;
}

.trend-bar.trend-a {
  background: linear-gradient(to top, #67c23a, #85ce61);
}

.trend-bar.trend-b {
  background: linear-gradient(to top, #409eff, #66b1ff);
}

.trend-label {
  font-size: 11px;
  color: #909399;
}

.trend-result {
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 3px;
}

.trend-result.result-a {
  color: #67c23a;
  background: #f0f9eb;
}

.trend-result.result-b {
  color: #409eff;
  background: #ecf5ff;
}

.all-stats-card {
  background: #fafafa;
  margin-bottom: 16px;
}

.global-metrics {
  margin-top: 8px;
}

.global-metric {
  text-align: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.global-metric-value {
  font-size: 32px;
  font-weight: bold;
  color: #165DFF;
  line-height: 1;
}

.global-metric-label {
  font-size: 13px;
  color: #909399;
  margin-top: 8px;
}

.group-stats-card {
  background: #fafafa;
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.group-item:hover {
  background: #f5f7fa;
  transform: translateX(4px);
}

.group-info {
  flex: 1;
  min-width: 0;
}

.group-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.group-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-percent {
  font-size: 12px;
  color: #909399;
}

.group-bar {
  width: 120px;
  height: 8px;
  display: flex;
  border-radius: 4px;
  overflow: hidden;
}

.group-bar-a {
  background: #67c23a;
  height: 100%;
}

.group-bar-b {
  background: #409eff;
  height: 100%;
}

.group-arrow {
  color: #c0c4cc;
  font-size: 16px;
}

.distribution-card {
  background: #fafafa;
  margin-bottom: 16px;
}

.distribution-content {
  display: flex;
  align-items: center;
  gap: 32px;
}

.pie-chart-container {
  flex-shrink: 0;
}

.pie-chart {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  position: relative;
  transition: background 0.5s ease;
}

.pie-chart-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-chart-center {
  text-align: center;
}

.pie-chart-total {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.pie-chart-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.distribution-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.distribution-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.distribution-info {
  flex: 1;
  min-width: 0;
}

.distribution-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.distribution-stats {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #909399;
}

.distribution-count {
  font-weight: 500;
}

.distribution-percent {
  font-family: 'Monaco', 'Menlo', monospace;
  color: #606266;
}

.distribution-bar {
  width: 100%;
  height: 6px;
  background: #e4e7ed;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 6px;
}

.distribution-bar-inner {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.empty-stats-card {
  background: #fafafa;
  margin-bottom: 16px;
}

.empty-stats-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-stats-text {
  font-size: 16px;
  color: #909399;
  margin: 16px 0 8px 0;
}

.empty-stats-hint {
  font-size: 13px;
  color: #c0c4cc;
  margin: 0;
}

.insights-card {
  background: #fafafa;
  margin-top: 16px;
  margin-bottom: 16px;
}

.insights-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.insight-item:hover {
  transform: translateX(4px);
}

.insight-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.insight-icon.good {
  background: linear-gradient(135deg, #f0f9eb, #e1f3d8);
  color: #67c23a;
}

.insight-icon.warning {
  background: linear-gradient(135deg, #fdf6ec, #faecd8);
  color: #e6a23c;
}

.insight-icon.bad {
  background: linear-gradient(135deg, #fef0f0, #fde2e2);
  color: #f56c6c;
}

.insight-icon.neutral {
  background: linear-gradient(135deg, #f4f4f5, #e9e9eb);
  color: #909399;
}

.insight-info {
  flex: 1;
  min-width: 0;
}

.insight-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.insight-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  margin: 0;
}

.quick-stats-card {
  margin-top: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  border: 1px solid #bae7ff;
}

.quick-stats-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 12px;
}

.quick-stats-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 12px;
}

.quick-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px 8px;
  background: #fff;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.quick-stat-item:hover {
  transform: translateY(-2px);
}

.quick-stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.quick-stat-value {
  font-size: 20px;
  font-weight: bold;
  line-height: 1.2;
}

.quick-stat-value.highlight {
  color: #165DFF;
}

.quick-stat-value.success {
  color: #67c23a;
}

.quick-stat-value.primary {
  color: #409eff;
}

.quick-stat-value.streak {
  color: #e6a23c;
}

.quick-stat-percent {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

.quick-stat-percent.success {
  color: #67c23a;
}

.quick-stat-percent.primary {
  color: #409eff;
}

.quick-stat-percent.streak {
  color: #e6a23c;
  background: #fdf6ec;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.quick-stats-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px dashed #91d5ff;
}

.quick-stats-hint {
  font-size: 12px;
  color: #606266;
}

.history-summary {
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #ebeef5 100%);
  border-radius: 8px;
  margin-bottom: 16px;
}

.summary-title {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 12px;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  text-align: center;
}

.summary-label {
  font-size: 12px;
  color: #909399;
}

.summary-value {
  font-size: 16px;
  font-weight: bold;
}

.summary-value.success {
  color: #67c23a;
}

.summary-value.primary {
  color: #409eff;
}

.summary-value.highlight {
  color: #165DFF;
}

.summary-divider {
  width: 1px;
  height: 32px;
  background: #dcdfe6;
}

.floating-stats {
  position: fixed;
  bottom: 0;
  left: 240px;
  right: 0;
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  box-shadow: 0 -4px 20px rgba(22, 93, 255, 0.3);
  z-index: 1000;
  padding: 12px 24px;
  backdrop-filter: blur(10px);
}

.floating-stats-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.floating-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 80px;
}

.floating-stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
}

.floating-stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  line-height: 1.2;
}

.floating-stat-value.highlight {
  font-size: 22px;
}

.floating-stat-value.success {
  color: #95de64;
}

.floating-stat-value.primary {
  color: #91d5ff;
}

.floating-stat-value.streak {
  color: #ffd666;
}

.floating-stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
}

.random-picker {
  padding-bottom: 80px;
}
</style>
