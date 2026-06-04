<template>
  <div class="metronome">
    <el-card class="value-card">
      <div class="value-header">
        <el-icon :size="28" color="#165DFF">
          <Trophy />
        </el-icon>
        <div>
          <h3>稳定节拍，让练习效率提升 3 倍</h3>
          <p class="value-subtitle">节拍器帮助你建立肌肉记忆，从跟拍不稳到节奏感精准</p>
        </div>
      </div>
      <el-row :gutter="16" class="value-points">
        <el-col :span="6" v-for="point in valuePoints" :key="point.title">
          <div class="value-item">
            <el-icon :size="22" :color="point.color"><component :is="point.icon" /></el-icon>
            <strong>{{ point.title }}</strong>
            <span>{{ point.desc }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="metronome-card" :class="{ playing: isPlaying }">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <VideoPlay />
          </el-icon>
          <span>节拍练习器</span>
          <el-tag v-if="isPlaying" size="small" type="success" class="header-tag">
            <span class="pulse-dot"></span>
            正在播放
          </el-tag>
          <el-tag v-else size="small" type="info" class="header-tag">待启动</el-tag>
        </div>
      </template>

      <div class="metronome-main">
        <div v-if="practiceGoal > 0" class="practice-progress" v-show="isPlaying || practiceRemaining < practiceGoal">
          <div class="progress-header">
            <span>🎯 今日练习目标：{{ practiceGoal }} 分钟</span>
            <span class="progress-text">{{ practiceRemaining }} / {{ practiceGoal }} 分钟</span>
          </div>
          <el-progress :percentage="practicePercentage" :stroke-width="8" :show-text="false" />
        </div>

        <div class="visualizer-area">
          <div class="visualizer">
            <div
              v-for="i in beatsPerMeasure"
              :key="i"
              class="beat-indicator"
              :class="{
                active: isPlaying && currentBeat === i,
                accent: isPlaying && currentBeat === i && i === 1
              }"
            >
              {{ i }}
            </div>
          </div>
          <div v-if="!isPlaying" class="idle-hint">
            点击下方「开始」按钮启动节拍器
          </div>
          <div class="visualizer-legend">
            <span class="legend-item"><span class="legend-dot accent-dot"></span>重拍（每小节第 1 拍，高音提示）</span>
            <span class="legend-item"><span class="legend-dot normal-dot"></span>弱拍（其余拍，标准音提示）</span>
          </div>
        </div>

        <div v-if="isPlaying" class="status-bar">
          <div class="status-item">
            <el-icon size="14"><Timer /></el-icon>
            <span>{{ formattedElapsedTime }}</span>
          </div>
          <div class="status-item">
            <el-icon size="14"><DataLine /></el-icon>
            <span>第 {{ measureCount }} 小节 · 第 {{ currentBeat }} 拍</span>
          </div>
          <div class="status-item">
            <el-icon size="14"><Headset /></el-icon>
            <span>{{ tempoName }}</span>
          </div>
        </div>

        <div class="bpm-display">
          <div class="bpm-value">{{ bpm }}</div>
          <div class="bpm-label">
            BPM
            <span class="tempo-name" v-if="tempoName">· {{ tempoName }}</span>
          </div>
        </div>

        <div class="bpm-slider">
          <el-slider
            v-model="bpm"
            :min="30"
            :max="240"
            :step="1"
            :show-tooltip="false"
            @input="handleSliderChange"
          />
          <div class="bpm-range">
            <span>30</span>
            <span>240</span>
          </div>
        </div>

        <div class="scene-presets">
          <div class="presets-title">
            <el-icon size="16"><MagicStick /></el-icon>
            <span>选择练习场景，一键配置</span>
          </div>
          <div class="scene-buttons">
            <el-button
              v-for="scene in practiceScenes"
              :key="scene.name"
              size="small"
              :type="activeScene === scene.name ? 'primary' : 'default'"
              @click="applyScene(scene)"
            >
              <el-icon><component :is="scene.icon" /></el-icon>
              {{ scene.name }}
            </el-button>
          </div>
        </div>

        <div class="quick-bpm">
          <span class="preset-label">常用速度：</span>
          <div class="bpm-buttons">
            <el-button
              v-for="preset in bpmPresets"
              :key="preset.value"
              size="small"
              @click="bpm = preset.value"
            >
              {{ preset.label }}
            </el-button>
          </div>
        </div>

        <div class="settings">
          <el-form-item label="拍号">
            <el-select v-model="beatsPerMeasure" style="width: 120px">
              <el-option :label="2 + '/4'" :value="2" />
              <el-option :label="3 + '/4'" :value="3" />
              <el-option :label="4 + '/4'" :value="4" />
              <el-option :label="6 + '/8'" :value="6" />
            </el-select>
          </el-form-item>

          <el-form-item label="音量">
            <el-slider
              v-model="volume"
              :min="0"
              :max="100"
              style="width: 150px"
            />
          </el-form-item>

          <el-form-item label="练习目标">
            <el-select v-model="practiceGoal" style="width: 120px">
              <el-option label="不设置" :value="0" />
              <el-option label="5 分钟" :value="5" />
              <el-option label="10 分钟" :value="10" />
              <el-option label="15 分钟" :value="15" />
              <el-option label="30 分钟" :value="30" />
            </el-select>
          </el-form-item>
        </div>

        <div class="controls">
          <el-button
            :type="isPlaying ? 'danger' : 'primary'"
            size="large"
            :icon="isPlaying ? VideoPause : VideoPlay"
            @click="togglePlay"
            class="play-button"
          >
            {{ isPlaying ? '停止' : '开始练习' }}
          </el-button>

          <el-button size="large" @click="decreaseBpm" title="BPM -5">
            <el-icon><DArrowLeft /></el-icon>
          </el-button>
          <el-button size="large" @click="increaseBpm" title="BPM +5">
            <el-icon><DArrowRight /></el-icon>
          </el-button>
        </div>

        <div class="tap-tempo">
          <el-button size="large" @click="tapTempo" class="tap-button">
            <el-icon><Cursor /></el-icon>
            点击测速
          </el-button>
          <div class="tap-hint" v-if="tapCount > 0">
            已点击 {{ tapCount }} 次，速度 {{ computedTapBpm }} BPM
          </div>
        </div>
      </div>
    </el-card>

    <el-row :gutter="24" class="info-row">
      <el-col :span="12">
        <el-card class="guide-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="18" color="#165DFF">
                <Lightbulb />
              </el-icon>
              <span>练习小贴士</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(tip, index) in practiceTips"
              :key="index"
              :timestamp="tip.step"
              placement="top"
            >
              <el-card shadow="never" class="tip-card">
                <h4>{{ tip.title }}</h4>
                <p>{{ tip.content }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="guide-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="18" color="#165DFF">
                <Collection />
              </el-icon>
              <span>常见练习场景</span>
            </div>
          </template>
          <div class="scene-guide">
            <div v-for="(guide, index) in sceneGuides" :key="index" class="scene-guide-item">
              <div class="scene-icon" :style="{ background: guide.color }">
                <el-icon :size="20"><component :is="guide.icon" /></el-icon>
              </div>
              <div class="scene-content">
                <h4>{{ guide.title }}</h4>
                <p class="scene-desc">{{ guide.desc }}</p>
                <div class="scene-tags">
                  <el-tag size="small" type="info">推荐 {{ guide.bpm }} BPM</el-tag>
                  <el-tag size="small">{{ guide.meter }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <el-steps :active="activeStep" finish-status="wait" simple class="guide-steps">
        <el-step title="选择场景" description="点击上方练习场景，自动配置速度和拍号" />
        <el-step title="微调参数" description="拖动滑块或点击预设，找到最适合的速度" />
        <el-step title="开始练习" description="点击开始按钮跟随节拍练习" />
      </el-steps>

      <el-divider />

      <div class="tempo-guide">
        <h4>速度参考</h4>
        <el-row :gutter="20">
          <el-col :span="8" v-for="tempo in tempoGuide" :key="tempo.name">
            <div class="tempo-item" :class="{ current: tempo.isCurrent }">
              <strong>{{ tempo.name }}</strong>
              <span>{{ tempo.bpm }} BPM</span>
              <p>{{ tempo.description }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import {
  VideoPlay,
  VideoPause,
  InfoFilled,
  DArrowLeft,
  DArrowRight,
  Cursor,
  Timer,
  DataLine,
  Headset,
  Trophy,
  TrendCharts,
  MagicStick,
  Lightbulb,
  Collection,
  Guitar,
  Microphone,
  Dance,
  FitnessCenter,
  Reading,
  Warning
} from '@element-plus/icons-vue'

const bpm = ref(120)
const volume = ref(80)
const beatsPerMeasure = ref(4)
const isPlaying = ref(false)
const currentBeat = ref(0)
const activeStep = ref(0)
const measureCount = ref(0)
const elapsedSeconds = ref(0)
const practiceGoal = ref(10)
const practiceRemaining = ref(0)
const activeScene = ref('')

const tapTimes = ref<number[]>([])
const tapCount = ref(0)

const audioContext = ref<AudioContext | null>(null)
let intervalId: number | null = null
let elapsedTimerId: number | null = null
let practiceTimerId: number | null = null

const valuePoints = [
  { icon: 'TrendCharts', title: '节奏精准', desc: '从跟拍不稳到稳定输出', color: '#165DFF' },
  { icon: 'Timer', title: '高效练习', desc: '建立肌肉记忆，练习更专注', color: '#67c23a' },
  { icon: 'DataLine', title: '可量化', desc: 'BPM 数字跟踪进步清晰可见', color: '#e6a23c' },
  { icon: 'Warning', title: '减少错误', desc: '避免越弹越快或拖拍问题', color: '#f56c6c' }
]

const practiceScenes = [
  { name: '吉他弹唱', icon: 'Guitar', bpm: 85, meter: 4, desc: '民谣、流行歌曲弹唱' },
  { name: '钢琴练习', icon: 'Reading', bpm: 100, meter: 4, desc: '哈农、音阶练习' },
  { name: '声乐练声', icon: 'Microphone', bpm: 70, meter: 4, desc: '气息、咬字练习' },
  { name: '舞蹈基础', icon: 'Dance', bpm: 120, meter: 4, desc: '节奏感、协调性训练' },
  { name: '架子鼓', icon: 'FitnessCenter', bpm: 100, meter: 4, desc: '单跳、双跳基础' },
  { name: '慢速练习', icon: 'Warning', bpm: 60, meter: 4, desc: '难点片段拆解' }
]

const practiceTips = [
  { step: '第 1 步', title: '从慢速开始', content: '不要追求快！先用 60-80 BPM 练习，确保每个音都准确，再逐步提高速度。' },
  { step: '第 2 步', title: '分段练习', content: '遇到困难段落，单独拿出来放慢速度练，每次只练 2-4 小节，熟练后再合起来。' },
  { step: '第 3 步', title: '用脚打拍', content: '跟随节拍器用脚轻轻打拍子，让身体感受节奏，培养内心的律动感。' },
  { step: '第 4 步', title: '循序渐进', content: '每次练习将 BPM 提高 5，直到达到目标速度。稳比快更重要！' }
]

const sceneGuides = [
  { title: '吉他弹唱', icon: 'Guitar', bpm: '70-100', meter: '4/4 拍', desc: '先弹熟和弦转换，再加入歌词。建议先跟节拍器弹伴奏，再唱。', color: '#e74c3c' },
  { title: '钢琴音阶', icon: 'Reading', bpm: '80-120', meter: '4/4 拍', desc: '保证每个音清晰均匀，大拇指穿指和其他手指跨指动作要提前准备。', color: '#3498db' },
  { title: '声乐开声', icon: 'Microphone', bpm: '60-80', meter: '4/4 拍', desc: '保持气息支撑，每个音发准，注意喉头放松不要上提。', color: '#9b59b6' },
  { title: '舞蹈基本功', icon: 'Dance', bpm: '100-130', meter: '4/4 拍', desc: '数着拍子做动作，注意发力点和停顿，让动作卡在拍子里。', color: '#f39c12' }
]

const bpmPresets = [
  { label: '慢板 60', value: 60 },
  { label: '行板 80', value: 80 },
  { label: '中板 100', value: 100 },
  { label: '进行曲 120', value: 120 },
  { label: '快板 140', value: 140 },
  { label: '急板 160', value: 160 }
]

const tempoRanges = [
  { name: '广板 Largo', min: 0, max: 60 },
  { name: '慢板 Adagio', min: 60, max: 80 },
  { name: '行板 Andante', min: 80, max: 100 },
  { name: '中板 Moderato', min: 100, max: 120 },
  { name: '小快板 Allegretto', min: 120, max: 140 },
  { name: '快板 Allegro', min: 140, max: 168 },
  { name: '急板 Presto', min: 168, max: 300 }
]

const tempoName = computed(() => {
  const range = tempoRanges.find(r => bpm.value >= r.min && bpm.value < r.max)
  return range ? range.name : ''
})

const tempoGuide = computed(() => {
  const guide = [
    { name: '广板 Largo', bpm: '40-60', description: '非常缓慢，庄严' },
    { name: '慢板 Adagio', bpm: '60-80', description: '缓慢，从容' },
    { name: '行板 Andante', bpm: '80-100', description: '步行速度' },
    { name: '中板 Moderato', bpm: '100-120', description: '中等速度' },
    { name: '小快板 Allegretto', bpm: '120-140', description: '稍快，活泼' },
    { name: '快板 Allegro', bpm: '140-168', description: '快速，明亮' }
  ]
  return guide.map(t => ({
    ...t,
    isCurrent: tempoName.value && t.name.startsWith(tempoName.value.split(' ')[0])
  }))
})

const formattedElapsedTime = computed(() => {
  const mins = Math.floor(elapsedSeconds.value / 60)
  const secs = elapsedSeconds.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const practicePercentage = computed(() => {
  if (practiceGoal.value === 0) return 0
  return Math.min(100, Math.round((practiceRemaining.value / practiceGoal.value) * 100))
})

const computedTapBpm = computed(() => {
  if (tapTimes.value.length < 2) return 0
  const intervals: number[] = []
  for (let i = 1; i < tapTimes.value.length; i++) {
    intervals.push(tapTimes.value[i] - tapTimes.value[i - 1])
  }
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
  return Math.round(60000 / avgInterval)
})

const initAudioContext = () => {
  if (!audioContext.value) {
    audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext.value
}

const playClick = (isAccent: boolean) => {
  const ctx = initAudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.frequency.value = isAccent ? 1000 : 800
  oscillator.type = 'sine'

  gainNode.gain.setValueAtTime(volume.value / 100 * 0.5, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.1)
}

const startMetronome = () => {
  if (isPlaying.value) return

  isPlaying.value = true
  currentBeat.value = 0
  measureCount.value = 0
  elapsedSeconds.value = 0
  activeStep.value = 2

  const interval = 60000 / bpm.value

  const tick = () => {
    const nextBeat = (currentBeat.value % beatsPerMeasure.value) + 1
    if (nextBeat === 1) {
      measureCount.value++
    }
    currentBeat.value = nextBeat
    playClick(nextBeat === 1)
  }

  tick()
  intervalId = window.setInterval(tick, interval)

  elapsedTimerId = window.setInterval(() => {
    elapsedSeconds.value++
  }, 1000)

  practiceTimerId = window.setInterval(() => {
    if (practiceGoal.value > 0 && practiceRemaining.value < practiceGoal.value) {
      practiceRemaining.value += 1
      if (practiceRemaining.value >= practiceGoal.value) {
        practiceGoalReached()
      }
    }
  }, 60000)
}

const stopMetronome = () => {
  isPlaying.value = false
  currentBeat.value = 0
  measureCount.value = 0
  elapsedSeconds.value = 0
  activeStep.value = 1

  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (elapsedTimerId !== null) {
    clearInterval(elapsedTimerId)
    elapsedTimerId = null
  }
  if (practiceTimerId !== null) {
    clearInterval(practiceTimerId)
    practiceTimerId = null
  }
}

const practiceGoalReached = () => {
  stopMetronome()
}

const togglePlay = () => {
  if (isPlaying.value) {
    stopMetronome()
  } else {
    startMetronome()
  }
}

const handleSliderChange = () => {
  if (isPlaying.value) {
    stopMetronome()
    setTimeout(startMetronome, 50)
  }
  activeStep.value = 1
  activeScene.value = ''
}

const increaseBpm = () => {
  if (bpm.value < 240) {
    bpm.value += 5
    handleSliderChange()
  }
}

const decreaseBpm = () => {
  if (bpm.value > 30) {
    bpm.value -= 5
    handleSliderChange()
  }
}

const applyScene = (scene: any) => {
  bpm.value = scene.bpm
  beatsPerMeasure.value = scene.meter
  activeScene.value = scene.name
  activeStep.value = 1
  if (isPlaying.value) {
    stopMetronome()
    setTimeout(startMetronome, 50)
  }
}

const tapTempo = () => {
  const now = Date.now()

  if (tapTimes.value.length > 0 && now - tapTimes.value[tapTimes.value.length - 1] > 2000) {
    tapTimes.value = []
    tapCount.value = 0
  }

  tapTimes.value.push(now)
  if (tapTimes.value.length > 8) {
    tapTimes.value.shift()
  }
  tapCount.value = tapTimes.value.length

  if (tapTimes.value.length >= 2) {
    bpm.value = computedTapBpm.value
    activeScene.value = ''
  }
}

watch(bpm, () => {
  if (isPlaying.value) {
    stopMetronome()
    setTimeout(startMetronome, 50)
  }
})

watch(beatsPerMeasure, () => {
  if (isPlaying.value) {
    currentBeat.value = 0
    measureCount.value = 0
  }
})

onUnmounted(() => {
  stopMetronome()
})
</script>

<style scoped>
.metronome {
  max-width: 1000px;
  margin: 0 auto;
}

.value-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
}

.value-card :deep(.el-card__body) {
  padding: 24px;
}

.value-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.value-header h3 {
  margin: 0 0 4px;
  font-size: 22px;
  color: #fff;
}

.value-subtitle {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

.value-card .el-icon {
  color: #fff;
}

.value-points {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
}

.value-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.value-item strong {
  font-size: 15px;
  color: #fff;
}

.value-item span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.metronome-card {
  margin-bottom: 24px;
  transition: box-shadow 0.3s;
}

.metronome-card.playing {
  box-shadow: 0 0 0 2px #67c23a, 0 4px 16px rgba(103, 194, 58, 0.2);
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

.pulse-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #67c23a;
  margin-right: 6px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
  100% { opacity: 1; transform: scale(1); }
}

.metronome-main {
  text-align: center;
  padding: 20px;
}

.practice-progress {
  max-width: 400px;
  margin: 0 auto 20px;
  text-align: left;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.progress-text {
  color: #165DFF;
}

.visualizer-area {
  margin-bottom: 32px;
}

.visualizer {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
}

.beat-indicator {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f0f2f5;
  border: 3px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #909399;
  transition: all 0.1s;
}

.beat-indicator.active {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
  transform: scale(1.15);
}

.beat-indicator.accent {
  background: #f56c6c;
  border-color: #f56c6c;
  box-shadow: 0 0 20px rgba(245, 108, 108, 0.5);
  transform: scale(1.2);
}

.idle-hint {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
  animation: fade-pulse 2s infinite;
}

@keyframes fade-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.visualizer-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  font-size: 12px;
  color: #909399;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.accent-dot {
  background: #f56c6c;
}

.normal-dot {
  background: #409eff;
}

.status-bar {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-radius: 8px;
  border: 1px solid #e1f3d8;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.status-item .el-icon {
  color: #67c23a;
}

.bpm-display {
  margin-bottom: 30px;
}

.bpm-value {
  font-size: 72px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.bpm-label {
  font-size: 16px;
  color: #909399;
  margin-top: 8px;
}

.tempo-name {
  color: #165DFF;
  font-weight: 600;
}

.bpm-slider {
  max-width: 400px;
  margin: 0 auto 24px;
}

.bpm-range {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.scene-presets {
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #fff7e6 0%, #ffecd9 100%);
  border-radius: 8px;
  border: 1px solid #ffd591;
}

.presets-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #ad6800;
  margin-bottom: 12px;
}

.scene-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.quick-bpm {
  margin-bottom: 30px;
}

.preset-label {
  font-size: 14px;
  color: #606266;
  margin-right: 12px;
}

.bpm-buttons {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.settings {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.settings :deep(.el-form-item) {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.settings :deep(.el-form-item__label) {
  margin-bottom: 0;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
}

.play-button {
  min-width: 150px;
  height: 50px;
  font-size: 18px;
}

.tap-tempo {
  margin-top: 20px;
}

.tap-button {
  width: 200px;
  height: 60px;
  font-size: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
}

.tap-button:hover {
  background: linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%);
}

.tap-hint {
  margin-top: 12px;
  font-size: 14px;
  color: #606266;
}

.info-row {
  margin-bottom: 24px;
}

.guide-card {
  margin-bottom: 24px;
  height: 100%;
}

.guide-steps {
  padding: 10px 0;
}

.tip-card {
  border: none;
  background: #f5f7fa;
  padding: 12px;
}

.tip-card h4 {
  margin: 0 0 6px;
  font-size: 14px;
  color: #303133;
}

.tip-card p {
  margin: 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.scene-guide {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scene-guide-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.scene-guide-item:hover {
  background: #ecf5ff;
  transform: translateX(4px);
}

.scene-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.scene-content h4 {
  margin: 0 0 4px;
  font-size: 15px;
  color: #303133;
}

.scene-desc {
  margin: 0 0 8px;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.scene-tags {
  display: flex;
  gap: 6px;
}

.tempo-guide h4 {
  margin: 0 0 20px;
  color: #303133;
  font-size: 16px;
}

.tempo-item {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s;
}

.tempo-item.current {
  background: #ecf5ff;
  border: 2px solid #409eff;
}

.tempo-item strong {
  display: block;
  font-size: 16px;
  color: #303133;
  margin-bottom: 4px;
}

.tempo-item span {
  font-size: 14px;
  color: #165DFF;
  font-weight: 600;
}

.tempo-item p {
  margin: 8px 0 0;
  font-size: 12px;
  color: #909399;
}

:deep(.el-timeline-item__timestamp.is-top) {
  margin-bottom: 4px;
  color: #165DFF;
  font-weight: 600;
  font-size: 12px;
}
</style>
