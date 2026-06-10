<template>
  <div class="nature-sound-player">
    <el-card class="value-card">
      <div class="value-header">
        <el-icon :size="28" color="#165DFF">
          <MagicStick />
        </el-icon>
        <div>
          <h3>自然之声，让身心回归宁静</h3>
          <p class="value-subtitle">精选雨声、海浪、鸟鸣等自然环境音，助你专注、放松、入眠</p>
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

    <el-alert
      type="success"
      :closable="false"
      show-icon
      class="background-play-alert"
    >
      <template #title>
        <div class="alert-title">
          <el-icon :size="18"><Monitor /></el-icon>
          <span>支持后台播放</span>
        </div>
      </template>
      <div class="alert-content">
        <p>✅ <strong>桌面浏览器：</strong>切换标签页、最小化窗口或切换其他应用时，声音可持续正常播放。</p>
        <p>📱 <strong>移动浏览器：</strong>需将本页添加到主屏幕或使用桌面版网站，锁屏和后台播放效果更佳。iOS Safari 在锁屏后可能会暂停播放，建议保持页面活跃。</p>
        <p>💡 <strong>小贴士：</strong>如果声音意外暂停，切回本页面即可自动恢复播放。长时间使用推荐配合定时关闭功能。</p>
      </div>
    </el-alert>

    <el-card class="player-card" :class="{ playing: isAnyPlaying }">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Headset />
          </el-icon>
          <span>自然声音播放器</span>
          <el-tag v-if="isAnyPlaying" size="small" type="success" class="header-tag">
            <span class="pulse-dot"></span>
            正在播放 {{ playingCount }} 种声音
          </el-tag>
          <el-tag v-else size="small" type="info" class="header-tag">待启动</el-tag>
        </div>
      </template>

      <div class="player-main">
        <div v-if="selectedScene" class="scene-indicator">
          <el-icon :size="18"><component :is="currentSceneIcon" /></el-icon>
          <span>{{ selectedScene }}模式已激活</span>
        </div>

        <div class="visualizer-area" v-if="isAnyPlaying">
          <div class="visualizer">
            <div
              v-for="i in 32"
              :key="i"
              class="visualizer-bar"
              :style="{ animationDelay: `${(i * 0.05).toFixed(2)}s`, height: `${getBarHeight(i)}px` }"
            ></div>
          </div>
        </div>
        <div v-else class="idle-hint">
          <el-icon :size="32" color="#909399"><VideoPlay /></el-icon>
          <p>选择下方声音卡片开始聆听自然</p>
        </div>

        <div class="scene-presets">
          <div class="presets-title">
            <el-icon size="16"><MagicStick /></el-icon>
            <span>场景模式 · 一键配置</span>
          </div>
          <div class="scene-buttons">
            <el-button
              v-for="scene in scenes"
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

        <div class="sounds-grid">
          <div
            v-for="sound in sounds"
            :key="sound.id"
            class="sound-card"
            :class="{ active: sound.active, playing: sound.active }"
            @click="toggleSound(sound.id)"
          >
            <div class="sound-icon" :style="{ background: sound.color }">
              <el-icon :size="28" color="#fff"><component :is="sound.icon" /></el-icon>
            </div>
            <div class="sound-info">
              <div class="sound-name">{{ sound.name }}</div>
              <div class="sound-desc">{{ sound.desc }}</div>
            </div>
            <div class="sound-toggle">
              <el-switch v-model="sound.active" @change="() => toggleSound(sound.id)" size="small" />
            </div>
            <div class="sound-volume" v-if="sound.active">
              <el-slider
                v-model="sound.volume"
                :min="0"
                :max="100"
                size="small"
                :show-tooltip="false"
                @input="(val: number) => updateVolume(sound.id, val)"
              />
              <span class="volume-value">{{ sound.volume }}%</span>
            </div>
          </div>
        </div>

        <div class="master-controls">
          <div class="master-volume">
            <el-icon size="18"><Headset /></el-icon>
            <el-slider
              v-model="masterVolume"
              :min="0"
              :max="100"
              style="width: 180px"
              :show-tooltip="false"
              @input="updateMasterVolume"
            />
            <span class="volume-value">{{ masterVolume }}%</span>
          </div>

          <div class="timer-control">
            <el-icon size="18"><Timer /></el-icon>
            <el-select v-model="timerMinutes" style="width: 140px" placeholder="定时关闭">
              <el-option label="不设置" :value="0" />
              <el-option label="15 分钟" :value="15" />
              <el-option label="30 分钟" :value="30" />
              <el-option label="45 分钟" :value="45" />
              <el-option label="60 分钟" :value="60" />
              <el-option label="90 分钟" :value="90" />
            </el-select>
            <div v-if="timerMinutes > 0 && timerRemaining > 0" class="timer-display">
              {{ formatTimer(timerRemaining) }}
            </div>
          </div>

          <div class="action-buttons">
            <el-button
              :type="isAnyPlaying ? 'danger' : 'primary'"
              size="large"
              :icon="isAnyPlaying ? VideoPause : VideoPlay"
              @click="toggleAll"
              class="main-play-button"
            >
              {{ isAnyPlaying ? '全部停止' : '开始播放' }}
            </el-button>
            <el-button size="large" :icon="Refresh" @click="resetAll">
              重置
            </el-button>
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
                <TrendCharts />
              </el-icon>
              <span>使用小贴士</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(tip, index) in usageTips"
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
                <Trophy />
              </el-icon>
              <span>适用场景推荐</span>
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
                  <el-tag size="small" type="info" v-for="t in guide.tags" :key="t">{{ t }}</el-tag>
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
          <span>声音介绍</span>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="8" v-for="s in soundIntroductions" :key="s.name">
          <div class="sound-intro">
            <div class="intro-icon" :style="{ background: s.color }">
              <el-icon :size="22" color="#fff"><component :is="s.icon" /></el-icon>
            </div>
            <div class="intro-content">
              <strong>{{ s.name }}</strong>
              <p>{{ s.intro }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted, onMounted } from 'vue'
import {
  VideoPlay,
  VideoPause,
  InfoFilled,
  Refresh,
  Timer,
  Headset,
  MagicStick,
  TrendCharts,
  Trophy,
  Reading,
  Moon,
  Sunny,
  DataLine,
  Warning,
  Monitor
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface SoundConfig {
  id: string
  name: string
  icon: string
  desc: string
  color: string
  active: boolean
  volume: number
  type: 'rain' | 'ocean' | 'birds' | 'forest' | 'stream' | 'wind' | 'fire' | 'thunder'
}

interface AudioNodeGroup {
  source?: AudioBufferSourceNode | OscillatorNode
  gainNode: GainNode
  filterNode?: BiquadFilterNode
  nodes: AudioNode[]
}

const valuePoints = [
  { icon: 'Reading', title: '办公专注', desc: '雨声白噪音隔绝干扰', color: '#165DFF' },
  { icon: 'Moon', title: '睡前放松', desc: '海浪溪流助你好眠', color: '#67c23a' },
  { icon: 'Sunny', title: '冥想辅助', desc: '鸟鸣森林回归宁静', color: '#e6a23c' },
  { icon: 'DataLine', title: '情绪调节', desc: '自然之声舒缓压力', color: '#f56c6c' }
]

const scenes = [
  { name: '专注工作', icon: 'Reading', sounds: { rain: 70, forest: 30 } },
  { name: '深度睡眠', icon: 'Moon', sounds: { ocean: 60, rain: 40, stream: 30 } },
  { name: '冥想放松', icon: 'Sunny', sounds: { birds: 50, forest: 60, stream: 40 } },
  { name: '舒缓情绪', icon: 'Sunny', sounds: { forest: 50, birds: 40, wind: 30 } },
  { name: '阅读时光', icon: 'Reading', sounds: { rain: 50, stream: 40 } },
  { name: '温暖氛围', icon: 'Warning', sounds: { wind: 60, rain: 30 } }
]

const usageTips = [
  { step: '第 1 步', title: '选择场景模式', content: '点击上方场景按钮，系统会自动配置最适合该场景的声音组合和音量。' },
  { step: '第 2 步', title: '自由组合声音', content: '也可以点击下方声音卡片，自由组合多种自然声音，打造专属你的环境音。' },
  { step: '第 3 步', title: '调节音量和定时', content: '拖动滑块调节每种声音的音量，设置定时关闭功能，安心入眠不担心。' },
  { step: '第 4 步', title: '佩戴耳机效果更佳', content: '建议使用立体声耳机聆听，沉浸式体验自然环境，效果更加明显。' },
  { step: '第 5 步', title: '支持后台播放', content: '桌面端切换标签页或应用不影响播放；移动端建议将页面添加到主屏幕，锁屏播放更稳定。声音意外暂停时切回本页即可自动恢复。' }
]

const sceneGuides = [
  { title: '办公专注', icon: 'Reading', tags: ['雨声', '森林'], desc: '在嘈杂的办公室中，雨声和森林声能有效隔绝人声干扰，提升专注力 30% 以上。', color: '#165DFF' },
  { title: '睡前放松', icon: 'Moon', tags: ['海浪', '溪流'], desc: '平缓的海浪声和潺潺流水能让大脑进入α波状态，帮助快速入眠，提高睡眠质量。', color: '#67c23a' },
  { title: '冥想辅助', icon: 'Sunny', tags: ['鸟鸣', '森林'], desc: '鸟鸣和森林声营造出宁静的自然氛围，让冥想更加深入，释放身心压力。', color: '#e6a23c' },
  { title: '情绪调节', icon: 'Sunny', tags: ['风声', '雨声'], desc: '当感到焦虑或情绪低落时，自然的风声和雨声能快速平复心情。', color: '#f56c6c' }
]

const soundIntroductions = [
  { name: '雨声', icon: 'DataLine', color: '#409eff', intro: '经典白噪音，能有效掩盖环境杂音，提升专注力和睡眠质量。' },
  { name: '海浪', icon: 'Moon', color: '#13c2c2', intro: '规律的潮起潮落声，让大脑产生安全感，是失眠人群的理想选择。' },
  { name: '鸟鸣', icon: 'Sunny', color: '#52c41a', intro: '清晨的鸟语花香，带来生机与活力，适合晨间冥想和轻度放松。' },
  { name: '森林', icon: 'Reading', color: '#722ed1', intro: '深邃的森林环境音，包含风声、树叶沙沙声，营造沉浸式自然体验。' },
  { name: '溪流', icon: 'InfoFilled', color: '#1890ff', intro: '潺潺流水声清澈悦耳，适合阅读、学习时作为背景音。' },
  { name: '风声', icon: 'Warning', color: '#fa8c16', intro: '轻柔的风吹过树梢，带来平静安宁的感觉，适合冥想和瑜伽。' }
]

const sounds = reactive<SoundConfig[]>([
  { id: 'rain', name: '雨声', icon: 'DataLine', desc: '淅淅沥沥的雨滴声', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', active: false, volume: 70, type: 'rain' },
  { id: 'ocean', name: '海浪', icon: 'Moon', desc: '潮起潮落的海浪声', color: 'linear-gradient(135deg, #13c2c2 0%, #1890ff 100%)', active: false, volume: 60, type: 'ocean' },
  { id: 'birds', name: '鸟鸣', icon: 'Sunny', desc: '清晨林间的鸟鸣', color: 'linear-gradient(135deg, #52c41a 0%, #a0d911 100%)', active: false, volume: 50, type: 'birds' },
  { id: 'forest', name: '森林', icon: 'Reading', desc: '风吹树叶的沙沙声', color: 'linear-gradient(135deg, #52c41a 0%, #13c2c2 100%)', active: false, volume: 55, type: 'forest' },
  { id: 'stream', name: '溪流', icon: 'InfoFilled', desc: '潺潺流水声', color: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)', active: false, volume: 60, type: 'stream' },
  { id: 'wind', name: '风声', icon: 'Warning', desc: '轻柔的风吹过', color: 'linear-gradient(135deg, #fa8c16 0%, #ffc53d 100%)', active: false, volume: 45, type: 'wind' }
])

const masterVolume = ref(80)
const activeScene = ref('')
const selectedScene = ref('')
const timerMinutes = ref(0)
const timerRemaining = ref(0)
let timerInterval: number | null = null

const audioContext = ref<AudioContext | null>(null)
const audioNodes = reactive<Record<string, AudioNodeGroup>>({})
const masterGainNode = ref<GainNode | null>(null)
let keepAliveOscillator: OscillatorNode | null = null
let keepAliveGain: GainNode | null = null
let audioContextCheckTimer: number | null = null
let wakeLockSentinal: any = null

const isAnyPlaying = computed(() => sounds.some(s => s.active))
const playingCount = computed(() => sounds.filter(s => s.active).length)

const currentSceneIcon = computed(() => {
  const scene = scenes.find(s => s.name === activeScene.value)
  return scene?.icon || 'MagicStick'
})

const startKeepAlive = (ctx: AudioContext) => {
  if (keepAliveOscillator && keepAliveGain) return
  keepAliveOscillator = ctx.createOscillator()
  keepAliveGain = ctx.createGain()
  keepAliveGain.gain.value = 0.0001
  keepAliveOscillator.type = 'sine'
  keepAliveOscillator.frequency.value = 22050
  keepAliveOscillator.connect(keepAliveGain)
  keepAliveGain.connect(ctx.destination)
  try {
    keepAliveOscillator.start()
  } catch (e) {}
}

const stopKeepAlive = () => {
  try {
    if (keepAliveOscillator) {
      keepAliveOscillator.stop()
      keepAliveOscillator.disconnect()
    }
    if (keepAliveGain) {
      keepAliveGain.disconnect()
    }
  } catch (e) {}
  keepAliveOscillator = null
  keepAliveGain = null
}

const resumeAudioContext = () => {
  if (!audioContext.value) return
  if (audioContext.value.state === 'suspended') {
    audioContext.value.resume().catch(() => {})
  }
}

const startAudioContextCheck = () => {
  stopAudioContextCheck()
  const tick = () => {
    if (isAnyPlaying.value) {
      resumeAudioContext()
    }
    audioContextCheckTimer = window.setTimeout(tick, 1000)
  }
  tick()
}

const stopAudioContextCheck = () => {
  if (audioContextCheckTimer) {
    clearTimeout(audioContextCheckTimer)
    audioContextCheckTimer = null
  }
}

const requestWakeLock = async () => {
  try {
    if ('wakeLock' in navigator) {
      wakeLockSentinal = await (navigator as any).wakeLock.request('screen')
      wakeLockSentinal.addEventListener('release', () => {})
    }
  } catch (e) {}
}

const releaseWakeLock = async () => {
  try {
    if (wakeLockSentinal) {
      await wakeLockSentinal.release()
      wakeLockSentinal = null
    }
  } catch (e) {}
}

const initAudioContext = () => {
  if (!audioContext.value) {
    audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
    masterGainNode.value = audioContext.value.createGain()
    masterGainNode.value.gain.value = masterVolume.value / 100
    masterGainNode.value.connect(audioContext.value.destination)
    startKeepAlive(audioContext.value)
    startAudioContextCheck()
    requestWakeLock()
  }
  if (audioContext.value.state === 'suspended') {
    audioContext.value.resume().catch(() => {})
  }
  return audioContext.value
}

const createNoiseBuffer = (ctx: AudioContext, duration: number = 2): AudioBuffer => {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
  }
  return buffer
}

const createPinkNoiseBuffer = (ctx: AudioContext, duration: number = 2): AudioBuffer => {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    }
  }
  return buffer
}

const createBrownNoiseBuffer = (ctx: AudioContext, duration: number = 2): AudioBuffer => {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = data[i]
      data[i] *= 3.5
    }
  }
  return buffer
}

const startRainSound = (ctx: AudioContext, gainNode: GainNode) => {
  const noiseBuffer = createPinkNoiseBuffer(ctx, 4)
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer
  source.loop = true

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 800
  filter.Q.value = 0.5

  source.connect(filter)
  filter.connect(gainNode)
  source.start()

  return { source, filter, nodes: [source, filter] }
}

const startOceanSound = (ctx: AudioContext, gainNode: GainNode) => {
  const noiseBuffer = createPinkNoiseBuffer(ctx, 6)
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer
  source.loop = true

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 500

  const waveGain = ctx.createGain()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.1
  lfoGain.gain.value = 0.4
  waveGain.gain.value = 0.6

  lfo.connect(lfoGain)
  lfoGain.connect(waveGain.gain)

  source.connect(filter)
  filter.connect(waveGain)
  waveGain.connect(gainNode)
  source.start()
  lfo.start()

  return { source, filter, nodes: [source, filter, waveGain, lfo, lfoGain] }
}

const startBirdsSound = (ctx: AudioContext, gainNode: GainNode) => {
  const nodes: AudioNode[] = []
  const birdGain = ctx.createGain()
  birdGain.gain.value = 0.3
  birdGain.connect(gainNode)
  nodes.push(birdGain)

  const createBirdChirp = () => {
    if (!audioContext.value) return
    const now = audioContext.value.currentTime
    const osc = audioContext.value.createOscillator()
    const oscGain = audioContext.value.createGain()
    const filter = audioContext.value.createBiquadFilter()

    osc.type = 'sine'
    const baseFreq = 2000 + Math.random() * 2000
    osc.frequency.setValueAtTime(baseFreq, now)
    osc.frequency.linearRampToValueAtTime(baseFreq * (0.8 + Math.random() * 0.4), now + 0.05)
    osc.frequency.linearRampToValueAtTime(baseFreq * 0.7, now + 0.15)

    oscGain.gain.setValueAtTime(0, now)
    oscGain.gain.linearRampToValueAtTime(0.8, now + 0.02)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    filter.type = 'bandpass'
    filter.frequency.value = baseFreq
    filter.Q.value = 2

    osc.connect(filter)
    filter.connect(oscGain)
    oscGain.connect(birdGain)

    osc.start(now)
    osc.stop(now + 0.25)

    setTimeout(() => {
      if (Math.random() > 0.3 && audioNodes['birds']) {
        createBirdChirp()
      }
    }, 500 + Math.random() * 2000)
  }

  const startBirds = () => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (audioNodes['birds']) {
          createBirdChirp()
        }
      }, i * 400 + Math.random() * 500)
    }
  }

  startBirds()
  const interval = window.setInterval(() => {
    if (audioNodes['birds']) {
      createBirdChirp()
    } else {
      clearInterval(interval)
    }
  }, 3000 + Math.random() * 4000)

  return { nodes, birdInterval: interval } as any
}

const startForestSound = (ctx: AudioContext, gainNode: GainNode) => {
  const noiseBuffer = createBrownNoiseBuffer(ctx, 4)
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer
  source.loop = true

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 400
  filter.Q.value = 0.3

  const windLfo = ctx.createOscillator()
  const windLfoGain = ctx.createGain()
  windLfo.frequency.value = 0.15
  windLfoGain.gain.value = 100
  windLfo.connect(windLfoGain)
  windLfoGain.connect(filter.frequency)

  source.connect(filter)
  filter.connect(gainNode)
  source.start()
  windLfo.start()

  return { source, filter, nodes: [source, filter, windLfo, windLfoGain] }
}

const startStreamSound = (ctx: AudioContext, gainNode: GainNode) => {
  const noiseBuffer = createWhiteNoiseBuffer(ctx, 3)
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer
  source.loop = true

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 2000
  filter.Q.value = 0.7

  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.5
  lfoGain.gain.value = 500
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)

  source.connect(filter)
  filter.connect(gainNode)
  source.start()
  lfo.start()

  return { source, filter, nodes: [source, filter, lfo, lfoGain] }
}

const createWhiteNoiseBuffer = (ctx: AudioContext, duration: number = 2): AudioBuffer => {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3
    }
  }
  return buffer
}

const startWindSound = (ctx: AudioContext, gainNode: GainNode) => {
  const noiseBuffer = createBrownNoiseBuffer(ctx, 5)
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer
  source.loop = true

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 300

  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.08
  lfoGain.gain.value = 150
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)

  const ampGain = ctx.createGain()
  const ampLfo = ctx.createOscillator()
  const ampLfoGain = ctx.createGain()
  ampLfo.frequency.value = 0.12
  ampLfoGain.gain.value = 0.3
  ampGain.gain.value = 0.7
  ampLfo.connect(ampLfoGain)
  ampLfoGain.connect(ampGain.gain)

  source.connect(filter)
  filter.connect(ampGain)
  ampGain.connect(gainNode)
  source.start()
  lfo.start()
  ampLfo.start()

  return { source, filter, nodes: [source, filter, lfo, lfoGain, ampGain, ampLfo, ampLfoGain] }
}

const startSound = (soundId: string) => {
  const ctx = initAudioContext()
  const sound = sounds.find(s => s.id === soundId)
  if (!sound || audioNodes[soundId]) return

  const gainNode = ctx.createGain()
  gainNode.gain.value = (sound.volume / 100) * (masterVolume.value / 100)
  gainNode.connect(masterGainNode.value!)

  let result: any
  switch (sound.type) {
    case 'rain':
      result = startRainSound(ctx, gainNode)
      break
    case 'ocean':
      result = startOceanSound(ctx, gainNode)
      break
    case 'birds':
      result = startBirdsSound(ctx, gainNode)
      break
    case 'forest':
      result = startForestSound(ctx, gainNode)
      break
    case 'stream':
      result = startStreamSound(ctx, gainNode)
      break
    case 'wind':
      result = startWindSound(ctx, gainNode)
      break
  }

  audioNodes[soundId] = {
    source: result?.source,
    gainNode,
    filterNode: result?.filter,
    nodes: result?.nodes || [gainNode]
  }
}

const stopSound = (soundId: string) => {
  const nodeGroup = audioNodes[soundId]
  if (!nodeGroup) return

  try {
    if (nodeGroup.source) {
      nodeGroup.source.stop()
      nodeGroup.source.disconnect()
    }
    nodeGroup.nodes.forEach(node => {
      try { node.disconnect() } catch (e) {}
    })
    nodeGroup.gainNode.disconnect()
  } catch (e) {
    console.error('Error stopping sound:', e)
  }

  delete audioNodes[soundId]
}

const toggleSound = (soundId: string) => {
  const sound = sounds.find(s => s.id === soundId)
  if (!sound) return

  if (sound.active) {
    startSound(soundId)
  } else {
    stopSound(soundId)
  }
  activeScene.value = ''
  selectedScene.value = ''
}

const updateVolume = (soundId: string, volume: number) => {
  const nodeGroup = audioNodes[soundId]
  if (nodeGroup) {
    nodeGroup.gainNode.gain.value = (volume / 100) * (masterVolume.value / 100)
  }
}

const updateMasterVolume = () => {
  if (masterGainNode.value) {
    masterGainNode.value.gain.value = masterVolume.value / 100
  }
  sounds.forEach(sound => {
    if (sound.active) {
      updateVolume(sound.id, sound.volume)
    }
  })
}

const applyScene = (scene: any) => {
  stopAllSounds()
  activeScene.value = scene.name
  selectedScene.value = scene.name

  Object.entries(scene.sounds).forEach(([soundId, volume]) => {
    const sound = sounds.find(s => s.id === soundId)
    if (sound) {
      sound.volume = volume as number
      sound.active = true
      startSound(soundId)
    }
  })

  ElMessage.success(`已切换到「${scene.name}」模式`)
}

const stopAllSounds = () => {
  sounds.forEach(sound => {
    sound.active = false
    stopSound(sound.id)
  })
  releaseWakeLock()
  stopKeepAlive()
  stopAudioContextCheck()
  if (audioContext.value) {
    audioContext.value.close().then(() => {
      audioContext.value = null
      masterGainNode.value = null
    }).catch(() => {})
  }
}

const toggleAll = () => {
  if (isAnyPlaying.value) {
    stopAllSounds()
    stopTimer()
  } else {
    if (activeScene.value) {
      const scene = scenes.find(s => s.name === activeScene.value)
      if (scene) {
        applyScene(scene)
      }
    } else {
      sounds[0].active = true
      startSound('rain')
    }
    if (timerMinutes.value > 0) {
      startTimer()
    }
  }
}

const resetAll = () => {
  stopAllSounds()
  stopTimer()
  activeScene.value = ''
  selectedScene.value = ''
  sounds.forEach(s => {
    s.volume = 60
  })
  masterVolume.value = 80
  timerMinutes.value = 0
  ElMessage.success('已重置所有设置')
}

const startTimer = () => {
  stopTimer()
  timerRemaining.value = timerMinutes.value * 60
  timerInterval = window.setInterval(() => {
    timerRemaining.value--
    if (timerRemaining.value <= 0) {
      stopAllSounds()
      stopTimer()
      ElMessage.info('定时结束，已自动停止播放')
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  timerRemaining.value = 0
}

const formatTimer = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getBarHeight = (index: number) => {
  if (!isAnyPlaying.value) return 4
  const base = 8 + Math.sin(Date.now() / 200 + index * 0.5) * 10
  return Math.max(4, base + Math.random() * 20)
}

let visualizerInterval: number | null = null
let wasPlayingBeforeHidden = false

const handleVisibilityChange = async () => {
  if (document.visibilityState === 'visible') {
    if (isAnyPlaying.value) {
      if (audioContext.value) {
        if (audioContext.value.state === 'suspended') {
          try {
            await audioContext.value.resume()
          } catch (e) {}
        }
        if (!keepAliveOscillator && audioContext.value) {
          startKeepAlive(audioContext.value)
        }
        startAudioContextCheck()
        requestWakeLock()
      }
    }
  } else {
    wasPlayingBeforeHidden = isAnyPlaying.value
    if (isAnyPlaying.value && audioContext.value) {
      if (audioContext.value.state === 'suspended') {
        audioContext.value.resume().catch(() => {})
      }
    }
  }
}

const handlePageShow = (e: PageTransitionEvent) => {
  if (e.persisted || (window.performance && window.performance.navigation.type === 2)) {
    setTimeout(() => {
      if (isAnyPlaying.value && audioContext.value) {
        if (audioContext.value.state === 'suspended') {
          audioContext.value.resume().catch(() => {})
        }
      }
    }, 100)
  }
}

onMounted(() => {
  visualizerInterval = window.setInterval(() => {}, 100)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('pageshow', handlePageShow)
})

onUnmounted(() => {
  stopAllSounds()
  stopTimer()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('pageshow', handlePageShow)
  stopKeepAlive()
  stopAudioContextCheck()
  releaseWakeLock()
  if (visualizerInterval) {
    clearInterval(visualizerInterval)
  }
  if (audioContext.value) {
    audioContext.value.close().catch(() => {})
  }
})
</script>

<style scoped>
.nature-sound-player {
  max-width: 1100px;
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

.background-play-alert {
  margin-bottom: 24px;
  border-radius: 12px;
}

.background-play-alert .alert-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
}

.background-play-alert .alert-content {
  margin-top: 8px;
  line-height: 1.8;
}

.background-play-alert .alert-content p {
  margin: 4px 0;
  font-size: 13px;
  color: #606266;
}

.background-play-alert :deep(.el-alert__content) {
  width: 100%;
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

.player-card {
  margin-bottom: 24px;
  transition: box-shadow 0.3s;
}

.player-card.playing {
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

.player-main {
  padding: 10px;
}

.scene-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border-radius: 20px;
  color: #165DFF;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 20px;
}

.visualizer-area {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 12px;
  padding: 10px;
}

.visualizer {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 60px;
}

.visualizer-bar {
  width: 6px;
  background: linear-gradient(180deg, #67c23a 0%, #165DFF 100%);
  border-radius: 3px;
  animation: bar-wave 0.8s ease-in-out infinite;
}

@keyframes bar-wave {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}

.idle-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 80px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 12px;
  color: #909399;
}

.idle-hint p {
  margin: 0;
  font-size: 14px;
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

.sounds-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.sound-card {
  position: relative;
  padding: 20px;
  background: #fff;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sound-card:hover {
  border-color: #c0c4cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sound-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #ecf5ff 0%, #f5f7fa 100%);
}

.sound-card.playing {
  animation: card-glow 2s ease-in-out infinite;
}

@keyframes card-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(22, 93, 255, 0.2); }
  50% { box-shadow: 0 0 0 6px rgba(22, 93, 255, 0); }
}

.sound-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.sound-info {
  margin-bottom: 12px;
}

.sound-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.sound-desc {
  font-size: 13px;
  color: #909399;
}

.sound-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
}

.sound-volume {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.sound-volume :deep(.el-slider) {
  flex: 1;
}

.volume-value {
  font-size: 12px;
  color: #909399;
  min-width: 36px;
  text-align: right;
}

.master-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 12px;
  flex-wrap: wrap;
}

.master-volume,
.timer-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.timer-display {
  padding: 4px 12px;
  background: #165DFF;
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.main-play-button {
  min-width: 140px;
  height: 48px;
  font-size: 16px;
}

.info-row {
  margin-bottom: 24px;
}

.guide-card {
  margin-bottom: 24px;
  height: 100%;
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

.sound-intro {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 10px;
  transition: all 0.3s;
}

.sound-intro:hover {
  background: #ecf5ff;
}

.intro-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.intro-content {
  flex: 1;
}

.intro-content strong {
  display: block;
  font-size: 15px;
  color: #303133;
  margin-bottom: 6px;
}

.intro-content p {
  margin: 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

:deep(.el-timeline-item__timestamp.is-top) {
  margin-bottom: 4px;
  color: #165DFF;
  font-weight: 600;
  font-size: 12px;
}

@media (max-width: 768px) {
  .sounds-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .master-controls {
    flex-direction: column;
    gap: 20px;
  }

  .value-points :deep(.el-col) {
    margin-bottom: 16px;
  }

  .sound-introductions :deep(.el-col) {
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .sounds-grid {
    grid-template-columns: 1fr;
  }
}
</style>
