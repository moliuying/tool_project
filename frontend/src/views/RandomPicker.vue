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
        <el-card class="stats-card" shadow="never">
          <div class="stats-header">
            <el-icon :size="18" color="#165DFF"><DataLine /></el-icon>
            <span>{{ optionA }} vs {{ optionB }} · 分布统计</span>
            <el-tag size="small" type="info" class="stats-tag">基于 {{ currentGroupHistory.length }} 次记录</el-tag>
          </div>
          <div class="stats-content">
            <div class="stat-item">
              <div class="stat-label">{{ optionA }}</div>
              <div class="stat-bar">
                <div class="stat-bar-inner" :style="{ width: currentOptionAPercent + '%', background: '#67c23a' }"></div>
              </div>
              <div class="stat-value">{{ currentOptionACount }} 次 ({{ currentOptionAPercent }}%)</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ optionB }}</div>
              <div class="stat-bar">
                <div class="stat-bar-inner" :style="{ width: currentOptionBPercent + '%', background: '#409eff' }"></div>
              </div>
              <div class="stat-value">{{ currentOptionBCount }} 次 ({{ currentOptionBPercent }}%)</div>
            </div>
          </div>
          <div class="stats-footer">
            <span class="stats-hint" v-if="currentGroupHistory.length >= 10">数据越多，分布越接近 50%/50%</span>
            <span class="stats-hint" v-else>至少需要 10 次记录才能显示统计趋势</span>
          </div>
        </el-card>

        <el-row :gutter="16" class="advanced-stats">
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
  Right
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
</style>
