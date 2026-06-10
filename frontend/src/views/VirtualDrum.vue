<template>
  <div class="virtual-drum">
    <el-card class="intro-card">
      <div class="intro-header">
        <el-icon :size="32" color="#f56c6c"><Drum /></el-icon>
        <div class="intro-text">
          <h2>虚拟架子鼓</h2>
          <p>通过键盘按键或触屏点击演奏，随时随地练习节奏，释放音乐激情</p>
        </div>
      </div>
      <el-row :gutter="16" class="feature-row">
        <el-col :span="6" v-for="f in features" :key="f.title">
          <div class="feature-item">
            <el-icon :size="20" :color="f.color"><component :is="f.icon" /></el-icon>
            <span>{{ f.title }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="drum-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#f56c6c"><Drum /></el-icon>
          <span>演奏区</span>
          <div class="header-right">
            <el-tag v-if="recording" type="danger" class="recording-tag">
              <span class="rec-dot"></span>
              录音中 {{ formatTime(recordDuration) }}
            </el-tag>
            <el-switch v-model="metronomeEnabled" active-text="节拍器" @change="toggleMetronome" />
          </div>
        </div>
      </template>

      <div v-if="metronomeEnabled" class="metronome-bar">
        <div class="metro-info">
          <el-icon :size="16"><Timer /></el-icon>
          <span>BPM</span>
        </div>
        <el-slider v-model="bpm" :min="40" :max="220" style="flex: 1; max-width: 300px" @input="updateBpm" />
        <span class="bpm-value">{{ bpm }}</span>
        <el-select v-model="timeSignature" style="width: 100px" @change="updateTimeSig">
          <el-option label="4/4" :value="4" />
          <el-option label="3/4" :value="3" />
          <el-option label="2/4" :value="2" />
          <el-option label="6/8" :value="6" />
        </el-select>
        <div class="metro-beats">
          <span
            v-for="i in (timeSignature === 6 ? 6 : timeSignature)"
            :key="i"
            class="beat-dot"
            :class="{ active: currentBeat === i - 1, accent: currentBeat === 0 && i === 1 }"
          ></span>
        </div>
      </div>

      <div class="drum-kit" ref="drumKitRef">
        <div class="cymbals-row">
          <div
            v-for="pad in cymbals"
            :key="pad.id"
            class="drum-pad cymbal-pad"
            :class="{ active: activePads.has(pad.id), [pad.size]: true }"
            :style="{ background: pad.gradient }"
            @mousedown="playDrum(pad.id)"
            @touchstart.prevent="playDrum(pad.id)"
          >
            <div class="pad-inner">
              <span class="pad-name">{{ pad.name }}</span>
              <span class="pad-key">{{ pad.key }}</span>
            </div>
          </div>
        </div>

        <div class="toms-row">
          <div
            v-for="pad in toms"
            :key="pad.id"
            class="drum-pad tom-pad"
            :class="{ active: activePads.has(pad.id) }"
            :style="{ background: pad.gradient }"
            @mousedown="playDrum(pad.id)"
            @touchstart.prevent="playDrum(pad.id)"
          >
            <div class="pad-inner">
              <span class="pad-name">{{ pad.name }}</span>
              <span class="pad-key">{{ pad.key }}</span>
            </div>
          </div>
        </div>

        <div class="snare-row">
          <div class="drum-pad snare-pad"
            :class="{ active: activePads.has('snare') }"
            :style="{ background: drumPads.snare.gradient }"
            @mousedown="playDrum('snare')"
            @touchstart.prevent="playDrum('snare')"
          >
            <div class="pad-inner">
              <span class="pad-name">军鼓</span>
              <span class="pad-key">{{ drumPads.snare.key }}</span>
            </div>
          </div>
          <div class="drum-pad kick-pad"
            :class="{ active: activePads.has('kick') }"
            :style="{ background: drumPads.kick.gradient }"
            @mousedown="playDrum('kick')"
            @touchstart.prevent="playDrum('kick')"
          >
            <div class="pad-inner">
              <span class="pad-name">底鼓</span>
              <span class="pad-key">{{ drumPads.kick.key }}</span>
            </div>
          </div>
          <div class="drum-pad hihat-stand"
            :class="{ active: activePads.has('hihat') || activePads.has('hihat-open') }"
            :style="{ background: drumPads.hihat.gradient }"
            @mousedown="playDrum('hihat')"
            @touchstart.prevent="playDrum('hihat')"
          >
            <div class="pad-inner">
              <span class="pad-name">踩镲</span>
              <span class="pad-key">{{ drumPads.hihat.key }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="controls-row">
        <div class="volume-group">
          <el-icon :size="18"><Headset /></el-icon>
          <el-slider
            v-model="masterVolume"
            :min="0"
            :max="100"
            style="width: 140px"
            :show-tooltip="false"
            @input="updateMasterVolume"
          />
          <span class="volume-label">{{ masterVolume }}%</span>
        </div>

        <div class="volume-group">
          <span class="reverb-label">混响</span>
          <el-slider
            v-model="reverbMix"
            :min="0"
            :max="50"
            style="width: 100px"
            :show-tooltip="false"
            @input="updateReverb"
          />
          <span class="volume-label">{{ reverbMix }}%</span>
        </div>

        <div class="action-group">
          <el-button
            :type="recording ? 'danger' : 'primary'"
            :icon="recording ? VideoPause : VideoCamera"
            @click="toggleRecording"
          >
            {{ recording ? '停止录音' : '开始录音' }}
          </el-button>
          <el-button
            type="success"
            :icon="VideoPlay"
            :disabled="recordedNotes.length === 0 || isPlaying"
            @click="playRecording"
          >
            回放
          </el-button>
          <el-button
            :icon="Refresh"
            :disabled="recordedNotes.length === 0"
            @click="clearRecording"
          >
            清除
          </el-button>
          <el-button
            type="warning"
            :icon="MagicStick"
            @click="playDemo"
          >
            示范节奏
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="sound-info-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="18" color="#e74c3c"><Microphone /></el-icon>
          <span>关于音色 · 音质说明</span>
          <el-tag size="small" type="warning" class="sound-tag">高精度 Web Audio 合成</el-tag>
        </div>
      </template>

      <el-alert type="info" :closable="false" show-icon class="sound-alert">
        <template #title>
          <strong>当前音色类型：高精度 Web Audio 合成音效（非真实鼓组采样录制）</strong>
        </template>
        <div class="sound-alert-content">
          <p>本虚拟架子鼓通过浏览器内置的 <strong>Web Audio API</strong>，采用多层振荡器叠加、粉红/白噪声混合塑形、动态包络曲线、软饱和模拟、带通共振滤波等专业信号处理技术，<strong>实时计算生成</strong>接近真实鼓组音色的声音。同时内置了动态压缩器和房间混响效果，让整体听感更加饱满自然。</p>
        </div>
      </el-alert>

      <el-row :gutter="24" class="sound-compare-row">
        <el-col :span="12">
          <div class="compare-card compare-synth">
            <div class="compare-header">
              <el-icon :size="20"><Cpu /></el-icon>
              <span>合成音效特点</span>
            </div>
            <ul class="compare-list">
              <li><el-icon color="#67c23a"><CircleCheck /></el-icon><span>零加载时间，打开即用</span></li>
              <li><el-icon color="#67c23a"><CircleCheck /></el-icon><span>多层叠加合成，音色层次丰富</span></li>
              <li><el-icon color="#67c23a"><CircleCheck /></el-icon><span>内置动态压缩 + 房间混响</span></li>
              <li><el-icon color="#67c23a"><CircleCheck /></el-icon><span>可无限次叠加演奏不爆音</span></li>
              <li><el-icon color="#e6a23c"><Warning /></el-icon><span>底鼓低频下潜深度不及真实采样</span></li>
              <li><el-icon color="#e6a23c"><Warning /></el-icon><span>军鼓响线质感略有电子感</span></li>
            </ul>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="compare-card compare-sample">
            <div class="compare-header">
              <el-icon :size="20"><Headset /></el-icon>
              <span>适用场景说明</span>
            </div>
            <ul class="compare-list">
              <li><el-icon color="#165DFF"><CircleCheck /></el-icon><span>✅ 节奏练习与节奏感培养</span></li>
              <li><el-icon color="#165DFF"><CircleCheck /></el-icon><span>✅ 鼓点编排与创意灵感记录</span></li>
              <li><el-icon color="#165DFF"><CircleCheck /></el-icon><span>✅ 初学者熟悉鼓组布局</span></li>
              <li><el-icon color="#165DFF"><CircleCheck /></el-icon><span>✅ 日常娱乐放松演奏</span></li>
              <li><el-icon color="#165DFF"><CircleCheck /></el-icon><span>✅ 简易 Demo/草稿节奏录制</span></li>
              <li><el-icon color="#909399"><InfoFilled /></el-icon><span>ℹ️ 如需录音棚级音色请使用专业 DAW 软件</span></li>
            </ul>
          </div>
        </el-col>
      </el-row>

      <div class="quality-tips">
        <div class="quality-tips-title">
          <el-icon :size="16" color="#e6a23c"><MagicStick /></el-icon>
          <span>提升听感体验的建议</span>
        </div>
        <el-row :gutter="16">
          <el-col :span="8" v-for="tip in qualityTips" :key="tip.title">
            <div class="quality-tip-item">
              <div class="qt-icon" :style="{ background: tip.color }">
                <el-icon :size="18" color="#fff"><component :is="tip.icon" /></el-icon>
              </div>
              <div class="qt-content">
                <strong>{{ tip.title }}</strong>
                <p>{{ tip.desc }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="18" color="#165DFF"><Keyboard /></el-icon>
          <span>键盘映射指南</span>
        </div>
      </template>
      <div class="keymap-grid">
        <div v-for="pad in allPads" :key="pad.id" class="keymap-item">
          <div class="keymap-key">{{ pad.key }}</div>
          <div class="keymap-info">
            <strong>{{ pad.name }}</strong>
            <span>{{ pad.desc }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="tips-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="18" color="#e6a23c"><Bulb /></el-icon>
          <span>使用小贴士</span>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="12" v-for="(tip, idx) in tips" :key="idx">
          <div class="tip-item">
            <el-tag size="small" type="primary">{{ idx + 1 }}</el-tag>
            <span>{{ tip }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import {
  Drum,
  Timer,
  Headset,
  VideoPlay,
  VideoPause,
  VideoCamera,
  Refresh,
  MagicStick,
  Keyboard,
  Bulb,
  Microphone,
  CircleCheck,
  Warning,
  InfoFilled,
  Cpu
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface DrumPad {
  id: string
  name: string
  key: string
  desc: string
  gradient: string
  size?: string
}

interface RecordedNote {
  padId: string
  timestamp: number
}

const drumPads: Record<string, DrumPad> = {
  kick: { id: 'kick', name: '底鼓', key: 'Space', desc: 'Kick - 低音大鼓，节奏根基', gradient: 'linear-gradient(145deg, #2c3e50 0%, #1a252f 100%)' },
  snare: { id: 'snare', name: '军鼓', key: 'S / D', desc: 'Snare - 清脆响亮的军鼓', gradient: 'linear-gradient(145deg, #ecf0f1 0%, #bdc3c7 100%)' },
  'tom-hi': { id: 'tom-hi', name: '高音嗵鼓', key: 'Y', desc: 'High Tom - 高音桶鼓', gradient: 'linear-gradient(145deg, #e74c3c 0%, #c0392b 100%)' },
  'tom-mid': { id: 'tom-mid', name: '中音嗵鼓', key: 'U', desc: 'Mid Tom - 中音桶鼓', gradient: 'linear-gradient(145deg, #e67e22 0%, #d35400 100%)' },
  'tom-lo': { id: 'tom-lo', name: '低音嗵鼓', key: 'I', desc: 'Floor Tom - 落地桶鼓', gradient: 'linear-gradient(145deg, #8e44ad 0%, #6c3483 100%)' },
  hihat: { id: 'hihat', name: '踩镲闭', key: 'H / J', desc: 'Hi-Hat Closed - 闭合踩镲', gradient: 'linear-gradient(145deg, #95a5a6 0%, #7f8c8d 100%)', size: 'small' },
  'hihat-open': { id: 'hihat-open', name: '踩镲开', key: 'K', desc: 'Hi-Hat Open - 开启踩镲', gradient: 'linear-gradient(145deg, #bdc3c7 0%, #95a5a6 100%)', size: 'small' },
  crash: { id: 'crash', name: '碎音镲', key: 'Q', desc: 'Crash - 强音镲片', gradient: 'linear-gradient(145deg, #f1c40f 0%, #f39c12 100%)', size: 'large' },
  ride: { id: 'ride', name: '节奏镲', key: 'W', desc: 'Ride - 叮叮镲', gradient: 'linear-gradient(145deg, #f39c12 0%, #e67e22 100%)', size: 'large' },
  splash: { id: 'splash', name: '水镲', key: 'E', desc: 'Splash - 小水镲', gradient: 'linear-gradient(145deg, #2ecc71 0%, #27ae60 100%)', size: 'small' },
  china: { id: 'china', name: '中国镲', key: 'R', desc: 'China - 中国镲', gradient: 'linear-gradient(145deg, #1abc9c 0%, #16a085 100%)', size: 'medium' }
}

const toms = [drumPads['tom-hi'], drumPads['tom-mid'], drumPads['tom-lo']]
const cymbals = [drumPads.crash, drumPads.ride, drumPads.splash, drumPads.china, drumPads['hihat-open']]

const allPads = computed(() => Object.values(drumPads))

const features = [
  { icon: 'Keyboard', title: '键盘演奏', color: '#165DFF' },
  { icon: 'VideoCamera', title: '录音回放', color: '#f56c6c' },
  { icon: 'Timer', title: '节拍器', color: '#67c23a' },
  { icon: 'MagicStick', title: '示范节奏', color: '#e6a23c' }
]

const tips = [
  '首次使用请先点击鼓面激活音频，浏览器需要用户交互才能播放声音',
  '建议佩戴耳机或连接音箱，以获得更好的低音效果',
  '双手放在键盘上，左手控制底鼓和军鼓，右手控制镲片，模拟真实演奏姿势',
  '打开节拍器跟随练习，从慢速开始逐步提高速度',
  '录音功能可以记录你的演奏，回放检查节奏是否准确',
  '尝试点击「示范节奏」学习基础的摇滚和放克鼓点'
]

const qualityTips = [
  {
    icon: 'Headset',
    title: '使用耳机/音箱',
    desc: '底鼓低频需要良好的低音响应，普通笔记本扬声器无法完全呈现',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    icon: 'Warning',
    title: '适中音量播放',
    desc: '过高音量会出现削波失真，建议保持 60-80% 主音量，已内置压缩器保护',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    icon: 'MagicStick',
    title: '调节混响量',
    desc: '调低混响可获更干练音色，调高混响可获更空间感，适合不同曲风',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
]

const masterVolume = ref(80)
const reverbMix = ref(15)
const activePads = reactive(new Set<string>())
const drumKitRef = ref<HTMLElement | null>(null)

const recording = ref(false)
const recordedNotes = ref<RecordedNote[]>([])
let recordStartTime = 0
const recordDuration = ref(0)
let recordTimer: number | null = null

const isPlaying = ref(false)
const metronomeEnabled = ref(false)
const bpm = ref(120)
const timeSignature = ref(4)
const currentBeat = ref(-1)
let metronomeInterval: number | null = null
let beatCount = 0

let audioContext: AudioContext | null = null
let masterGainNode: GainNode | null = null
let compressorNode: DynamicsCompressorNode | null = null
let reverbNode: ConvolverNode | null = null
let reverbGainNode: GainNode | null = null
let dryGainNode: GainNode | null = null

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    compressorNode = audioContext.createDynamicsCompressor()
    compressorNode.threshold.value = -12
    compressorNode.knee.value = 10
    compressorNode.ratio.value = 4
    compressorNode.attack.value = 0.003
    compressorNode.release.value = 0.15

    masterGainNode = audioContext.createGain()
    masterGainNode.gain.value = masterVolume.value / 100

    dryGainNode = audioContext.createGain()
    dryGainNode.gain.value = 0.85

    reverbGainNode = audioContext.createGain()
    reverbGainNode.gain.value = 0.15

    reverbNode = audioContext.createConvolver()
    reverbNode.buffer = createReverbIR(audioContext, 1.2, 2.0)

    masterGainNode.connect(compressorNode)
    compressorNode.connect(dryGainNode)
    compressorNode.connect(reverbNode)
    dryGainNode.connect(audioContext.destination)
    reverbNode.connect(reverbGainNode)
    reverbGainNode.connect(audioContext.destination)
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return audioContext
}

const createReverbIR = (ctx: AudioContext, duration: number, decay: number): AudioBuffer => {
  const length = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    }
  }
  return buffer
}

const updateMasterVolume = () => {
  if (masterGainNode) {
    masterGainNode.gain.value = masterVolume.value / 100
  }
}

const updateReverb = () => {
  if (dryGainNode && reverbGainNode) {
    const wet = reverbMix.value / 100
    dryGainNode.gain.value = 1 - wet * 0.5
    reverbGainNode.gain.value = wet
  }
}

const createNoiseBuffer = (ctx: AudioContext, duration: number): AudioBuffer => {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

const createPinkNoiseBuffer = (ctx: AudioContext, duration: number): AudioBuffer => {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
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
  return buffer
}

const makeSoftSaturateCurve = (samples: number = 8192): Float32Array => {
  const curve = new Float32Array(samples)
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1
    curve[i] = (Math.PI + 2.5) * x / (Math.PI + 2.5 * Math.abs(x))
  }
  return curve
}

const playKick = (ctx: AudioContext) => {
  const now = ctx.currentTime

  const clickOsc = ctx.createOscillator()
  const clickGain = ctx.createGain()
  clickOsc.type = 'sine'
  clickOsc.frequency.setValueAtTime(4000, now)
  clickOsc.frequency.exponentialRampToValueAtTime(800, now + 0.005)
  clickGain.gain.setValueAtTime(0.35, now)
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015)
  clickOsc.connect(clickGain)
  clickGain.connect(masterGainNode!)
  clickOsc.start(now)
  clickOsc.stop(now + 0.02)

  const subOsc = ctx.createOscillator()
  const subGain = ctx.createGain()
  subOsc.type = 'sine'
  subOsc.frequency.setValueAtTime(55, now)
  subOsc.frequency.setValueAtTime(55, now + 0.01)
  subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.4)
  subGain.gain.setValueAtTime(0.001, now)
  subGain.gain.linearRampToValueAtTime(0.9, now + 0.008)
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55)
  subOsc.connect(subGain)
  subGain.connect(masterGainNode!)
  subOsc.start(now)
  subOsc.stop(now + 0.6)

  const bodyOsc = ctx.createOscillator()
  const bodyGain = ctx.createGain()
  bodyOsc.type = 'triangle'
  bodyOsc.frequency.setValueAtTime(160, now)
  bodyOsc.frequency.exponentialRampToValueAtTime(50, now + 0.08)
  bodyOsc.frequency.exponentialRampToValueAtTime(40, now + 0.4)
  bodyGain.gain.setValueAtTime(0.001, now)
  bodyGain.gain.linearRampToValueAtTime(0.7, now + 0.005)
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
  bodyOsc.connect(bodyGain)
  bodyGain.connect(masterGainNode!)
  bodyOsc.start(now)
  bodyOsc.stop(now + 0.4)

  const noiseBuffer = createNoiseBuffer(ctx, 0.06)
  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = noiseBuffer
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = 500
  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.25, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
  noiseSrc.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(masterGainNode!)
  noiseSrc.start(now)
  noiseSrc.stop(now + 0.06)
}

const playSnare = (ctx: AudioContext) => {
  const now = ctx.currentTime

  const bodyOsc = ctx.createOscillator()
  const bodyGain = ctx.createGain()
  bodyOsc.type = 'triangle'
  bodyOsc.frequency.setValueAtTime(220, now)
  bodyOsc.frequency.exponentialRampToValueAtTime(120, now + 0.05)
  bodyOsc.frequency.exponentialRampToValueAtTime(80, now + 0.15)
  bodyGain.gain.setValueAtTime(0.55, now)
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
  bodyOsc.connect(bodyGain)
  bodyGain.connect(masterGainNode!)
  bodyOsc.start(now)
  bodyOsc.stop(now + 0.15)

  const noiseBuffer = createNoiseBuffer(ctx, 0.25)
  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = noiseBuffer

  const hpFilter = ctx.createBiquadFilter()
  hpFilter.type = 'highpass'
  hpFilter.frequency.value = 2000

  const peakFilter = ctx.createBiquadFilter()
  peakFilter.type = 'peaking'
  peakFilter.frequency.value = 5000
  peakFilter.gain.value = 6
  peakFilter.Q.value = 1.5

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.7, now)
  noiseGain.gain.setValueAtTime(0.7, now + 0.01)
  noiseGain.gain.exponentialRampToValueAtTime(0.15, now + 0.06)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

  noiseSrc.connect(hpFilter)
  hpFilter.connect(peakFilter)
  peakFilter.connect(noiseGain)
  noiseGain.connect(masterGainNode!)
  noiseSrc.start(now)
  noiseSrc.stop(now + 0.25)

  const snareNoiseBuffer = createNoiseBuffer(ctx, 0.15)
  const snareNoise = ctx.createBufferSource()
  snareNoise.buffer = snareNoiseBuffer
  const snareBp = ctx.createBiquadFilter()
  snareBp.type = 'bandpass'
  snareBp.frequency.value = 3500
  snareBp.Q.value = 3
  const snareGain = ctx.createGain()
  snareGain.gain.setValueAtTime(0.3, now)
  snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
  snareNoise.connect(snareBp)
  snareBp.connect(snareGain)
  snareGain.connect(masterGainNode!)
  snareNoise.start(now)
  snareNoise.stop(now + 0.15)
}

const playTom = (ctx: AudioContext, baseFreq: number, decay: number) => {
  const now = ctx.currentTime

  const headOsc = ctx.createOscillator()
  const headGain = ctx.createGain()
  headOsc.type = 'sine'
  headOsc.frequency.setValueAtTime(baseFreq * 1.5, now)
  headOsc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.03)
  headOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + decay)
  headGain.gain.setValueAtTime(0.001, now)
  headGain.gain.linearRampToValueAtTime(0.75, now + 0.003)
  headGain.gain.exponentialRampToValueAtTime(0.001, now + decay)
  headOsc.connect(headGain)
  headGain.connect(masterGainNode!)
  headOsc.start(now)
  headOsc.stop(now + decay + 0.05)

  const bodyOsc = ctx.createOscillator()
  const bodyGain = ctx.createGain()
  bodyOsc.type = 'triangle'
  bodyOsc.frequency.setValueAtTime(baseFreq * 2, now)
  bodyOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, now + 0.05)
  bodyOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + decay * 0.7)
  bodyGain.gain.setValueAtTime(0.3, now)
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + decay * 0.5)
  bodyOsc.connect(bodyGain)
  bodyGain.connect(masterGainNode!)
  bodyOsc.start(now)
  bodyOsc.stop(now + decay * 0.7 + 0.05)

  const noiseBuffer = createNoiseBuffer(ctx, 0.05)
  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = noiseBuffer
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.value = baseFreq * 4
  noiseFilter.Q.value = 1
  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.2, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
  noiseSrc.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(masterGainNode!)
  noiseSrc.start(now)
  noiseSrc.stop(now + 0.05)
}

const playHihat = (ctx: AudioContext, open: boolean) => {
  const now = ctx.currentTime
  const duration = open ? 0.6 : 0.08

  const noiseBuffer = createNoiseBuffer(ctx, duration + 0.1)
  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = noiseBuffer

  const hpFilter = ctx.createBiquadFilter()
  hpFilter.type = 'highpass'
  hpFilter.frequency.value = 6000

  const bp1 = ctx.createBiquadFilter()
  bp1.type = 'bandpass'
  bp1.frequency.value = 10000
  bp1.Q.value = 1.5

  const bp2 = ctx.createBiquadFilter()
  bp2.type = 'bandpass'
  bp2.frequency.value = 14000
  bp2.Q.value = 2

  const sat = ctx.createWaveShaper()
  sat.curve = makeSoftSaturateCurve()
  sat.oversample = '4x'

  const mainGain = ctx.createGain()
  const peakVol = 0.4
  mainGain.gain.setValueAtTime(peakVol, now)
  mainGain.gain.setValueAtTime(peakVol, now + 0.003)
  mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

  noiseSrc.connect(hpFilter)
  hpFilter.connect(bp1)
  bp1.connect(sat)
  sat.connect(mainGain)
  mainGain.connect(masterGainNode!)

  const metalOsc = ctx.createOscillator()
  metalOsc.type = 'square'
  metalOsc.frequency.value = 8500
  const metalGain = ctx.createGain()
  metalGain.gain.setValueAtTime(0.06, now)
  metalGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6)
  metalOsc.connect(bp2)
  bp2.connect(metalGain)
  metalGain.connect(masterGainNode!)
  metalOsc.start(now)
  metalOsc.stop(now + duration)

  noiseSrc.start(now)
  noiseSrc.stop(now + duration + 0.1)
}

const playCymbal = (ctx: AudioContext, type: 'crash' | 'ride' | 'splash' | 'china') => {
  const now = ctx.currentTime
  const config = {
    crash:  { duration: 2.0,  hpFreq: 4000, bpFreqs: [6000, 8500, 12000], peak: 0.55, satAmount: 0.7 },
    ride:   { duration: 1.8,  hpFreq: 5000, bpFreqs: [7000, 10000, 13000], peak: 0.35, satAmount: 0.5 },
    splash: { duration: 0.5,  hpFreq: 5000, bpFreqs: [8000, 11000, 14000], peak: 0.45, satAmount: 0.6 },
    china:  { duration: 1.5,  hpFreq: 2500, bpFreqs: [3500, 6000, 9000],  peak: 0.50, satAmount: 0.8 }
  }[type]

  const pinkBuffer = createPinkNoiseBuffer(ctx, config.duration + 0.2)
  const pinkSrc = ctx.createBufferSource()
  pinkSrc.buffer = pinkBuffer

  const whiteBuffer = createNoiseBuffer(ctx, config.duration + 0.2)
  const whiteSrc = ctx.createBufferSource()
  whiteSrc.buffer = whiteBuffer

  const hpFilter = ctx.createBiquadFilter()
  hpFilter.type = 'highpass'
  hpFilter.frequency.value = config.hpFreq

  const sat = ctx.createWaveShaper()
  sat.curve = makeSoftSaturateCurve()
  sat.oversample = '4x'

  const mainGain = ctx.createGain()
  mainGain.gain.setValueAtTime(0.001, now)
  mainGain.gain.linearRampToValueAtTime(config.peak, now + 0.005)
  mainGain.gain.setValueAtTime(config.peak, now + 0.01)
  mainGain.gain.exponentialRampToValueAtTime(0.001, now + config.duration)

  pinkSrc.connect(hpFilter)
  hpFilter.connect(sat)
  sat.connect(mainGain)
  mainGain.connect(masterGainNode!)
  pinkSrc.start(now)
  pinkSrc.stop(now + config.duration + 0.2)

  const whiteGain = ctx.createGain()
  whiteGain.gain.setValueAtTime(0.15, now)
  whiteGain.gain.exponentialRampToValueAtTime(0.001, now + config.duration * 0.3)

  const whiteBp = ctx.createBiquadFilter()
  whiteBp.type = 'highpass'
  whiteBp.frequency.value = config.bpFreqs[2]

  whiteSrc.connect(whiteBp)
  whiteBp.connect(whiteGain)
  whiteGain.connect(masterGainNode!)
  whiteSrc.start(now)
  whiteSrc.stop(now + config.duration * 0.3 + 0.1)

  config.bpFreqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.value = freq * (0.998 + Math.random() * 0.004)
    const oscGain = ctx.createGain()
    const vol = 0.02 / (idx + 1)
    oscGain.gain.setValueAtTime(vol, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + config.duration * (0.4 + idx * 0.15))
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = freq
    bp.Q.value = 8
    osc.connect(bp)
    bp.connect(oscGain)
    oscGain.connect(masterGainNode!)
    osc.start(now)
    osc.stop(now + config.duration + 0.1)
  })

  if (type === 'china') {
    const chinaOsc = ctx.createOscillator()
    chinaOsc.type = 'sawtooth'
    chinaOsc.frequency.value = 420
    const chinaGain = ctx.createGain()
    chinaGain.gain.setValueAtTime(0.08, now)
    chinaGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    const chinaBp = ctx.createBiquadFilter()
    chinaBp.type = 'bandpass'
    chinaBp.frequency.value = 800
    chinaBp.Q.value = 2
    chinaOsc.connect(chinaBp)
    chinaBp.connect(chinaGain)
    chinaGain.connect(masterGainNode!)
    chinaOsc.start(now)
    chinaOsc.stop(now + 0.2)
  }

  if (type === 'ride') {
    const bellOsc = ctx.createOscillator()
    bellOsc.type = 'sine'
    bellOsc.frequency.value = 3200
    const bellGain = ctx.createGain()
    bellGain.gain.setValueAtTime(0.1, now)
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    const bellBp = ctx.createBiquadFilter()
    bellBp.type = 'bandpass'
    bellBp.frequency.value = 3200
    bellBp.Q.value = 12
    bellOsc.connect(bellBp)
    bellBp.connect(bellGain)
    bellGain.connect(masterGainNode!)
    bellOsc.start(now)
    bellOsc.stop(now + 0.25)
  }
}

const playMetronomeClick = (ctx: AudioContext, accent: boolean) => {
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(masterGainNode!)

  osc.frequency.value = accent ? 1200 : 800
  osc.type = 'sine'

  gain.gain.setValueAtTime(accent ? 0.4 : 0.25, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

  osc.start(now)
  osc.stop(now + 0.05)
}

const playDrumSound = (padId: string) => {
  const ctx = initAudioContext()
  switch (padId) {
    case 'kick':
      playKick(ctx)
      break
    case 'snare':
      playSnare(ctx)
      break
    case 'tom-hi':
      playTom(ctx, 200, 0.4)
      break
    case 'tom-mid':
      playTom(ctx, 150, 0.5)
      break
    case 'tom-lo':
      playTom(ctx, 100, 0.6)
      break
    case 'hihat':
      playHihat(ctx, false)
      break
    case 'hihat-open':
      playHihat(ctx, true)
      break
    case 'crash':
      playCymbal(ctx, 'crash')
      break
    case 'ride':
      playCymbal(ctx, 'ride')
      break
    case 'splash':
      playCymbal(ctx, 'splash')
      break
    case 'china':
      playCymbal(ctx, 'china')
      break
  }
}

const playDrum = (padId: string) => {
  playDrumSound(padId)
  activePads.add(padId)
  setTimeout(() => activePads.delete(padId), 150)

  if (recording.value) {
    recordedNotes.value.push({
      padId,
      timestamp: Date.now() - recordStartTime
    })
  }
}

const keyMap: Record<string, string> = {
  ' ': 'kick',
  's': 'snare',
  'd': 'snare',
  'y': 'tom-hi',
  'u': 'tom-mid',
  'i': 'tom-lo',
  'h': 'hihat',
  'j': 'hihat',
  'k': 'hihat-open',
  'q': 'crash',
  'w': 'ride',
  'e': 'splash',
  'r': 'china'
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.repeat) return
  const key = e.key.toLowerCase()
  const padId = keyMap[key] || keyMap[e.key]
  if (padId) {
    e.preventDefault()
    playDrum(padId)
  }
}

const toggleRecording = () => {
  if (!recording.value) {
    recordedNotes.value = []
    recordStartTime = Date.now()
    recordDuration.value = 0
    recording.value = true
    recordTimer = window.setInterval(() => {
      recordDuration.value = Math.floor((Date.now() - recordStartTime) / 1000)
    }, 1000)
    ElMessage.success('开始录音，尽情演奏吧！')
  } else {
    recording.value = false
    if (recordTimer) {
      clearInterval(recordTimer)
      recordTimer = null
    }
    ElMessage.success(`录音完成，共记录 ${recordedNotes.value.length} 个音符`)
  }
}

const playRecording = async () => {
  if (recordedNotes.value.length === 0 || isPlaying.value) return
  isPlaying.value = true
  const startTime = Date.now()
  const notes = [...recordedNotes.value]

  for (const note of notes) {
    while (Date.now() - startTime < note.timestamp) {
      await new Promise(r => setTimeout(r, 5))
    }
    playDrum(note.padId)
  }
  isPlaying.value = false
  ElMessage.success('回放完成')
}

const clearRecording = () => {
  recordedNotes.value = []
  recordDuration.value = 0
  ElMessage.success('已清除录音')
}

const playDemo = async () => {
  initAudioContext()
  isPlaying.value = true
  ElMessage.info('开始播放示范节奏 - 基础摇滚鼓点')

  const beatInterval = 60000 / 110
  const beats = [
    ['kick', 'hihat'],
    ['hihat'],
    ['snare', 'hihat'],
    ['hihat'],
    ['kick', 'hihat'],
    ['hihat'],
    ['snare', 'hihat'],
    ['hihat']
  ]

  for (let bar = 0; bar < 4; bar++) {
    for (let i = 0; i < beats.length; i++) {
      if (i === 0 && bar === 0) {
        playDrumSound('crash')
      }
      beats[i].forEach(id => playDrum(id))
      await new Promise(r => setTimeout(r, beatInterval / 2))
    }
  }

  isPlaying.value = false
}

const toggleMetronome = () => {
  if (metronomeEnabled.value) {
    startMetronome()
  } else {
    stopMetronome()
  }
}

const startMetronome = () => {
  stopMetronome()
  beatCount = 0
  const interval = 60000 / bpm.value
  const beatsPerMeasure = timeSignature.value

  const tick = () => {
    const ctx = initAudioContext()
    const isAccent = beatCount % beatsPerMeasure === 0
    currentBeat.value = beatCount % beatsPerMeasure
    playMetronomeClick(ctx, isAccent)
    beatCount++
  }

  tick()
  metronomeInterval = window.setInterval(tick, interval)
}

const stopMetronome = () => {
  if (metronomeInterval) {
    clearInterval(metronomeInterval)
    metronomeInterval = null
  }
  currentBeat.value = -1
  beatCount = 0
}

const updateBpm = () => {
  if (metronomeEnabled.value) {
    startMetronome()
  }
}

const updateTimeSig = () => {
  if (metronomeEnabled.value) {
    startMetronome()
  }
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  stopMetronome()
  if (recordTimer) clearInterval(recordTimer)
  if (audioContext) {
    audioContext.close().catch(() => {})
  }
})
</script>

<style scoped>
.virtual-drum {
  max-width: 1100px;
  margin: 0 auto;
}

.intro-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #2c3e50 0%, #4a6572 100%);
  border: none;
  color: #fff;
}

.intro-card :deep(.el-card__body) {
  padding: 28px;
}

.intro-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.intro-text h2 {
  margin: 0 0 6px;
  font-size: 26px;
  color: #fff;
}

.intro-text p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.feature-row {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.feature-item span {
  font-size: 14px;
  font-weight: 500;
}

.drum-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.recording-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.rec-dot {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  animation: rec-pulse 1s infinite;
}

@keyframes rec-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.metronome-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.metro-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #165DFF;
}

.bpm-value {
  font-size: 20px;
  font-weight: bold;
  color: #165DFF;
  min-width: 40px;
  font-variant-numeric: tabular-nums;
}

.metro-beats {
  display: flex;
  gap: 8px;
}

.beat-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #d1d5db;
  transition: all 0.1s;
}

.beat-dot.active {
  background: #165DFF;
  transform: scale(1.3);
  box-shadow: 0 0 8px rgba(22, 93, 255, 0.5);
}

.beat-dot.accent {
  background: #f56c6c;
  box-shadow: 0 0 8px rgba(245, 108, 108, 0.5);
}

.drum-kit {
  padding: 30px 20px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  margin-bottom: 24px;
  user-select: none;
}

.cymbals-row,
.toms-row,
.snare-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.toms-row {
  margin: 20px 0;
}

.drum-pad {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.08s ease;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.2);
}

.drum-pad:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5), inset 0 2px 6px rgba(255, 255, 255, 0.25);
}

.drum-pad.active {
  transform: scale(0.92) translateY(2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 4px 12px rgba(0, 0, 0, 0.3);
}

.drum-pad.large {
  width: 110px;
  height: 110px;
}

.drum-pad.medium {
  width: 90px;
  height: 90px;
}

.drum-pad.small {
  width: 75px;
  height: 75px;
}

.cymbal-pad {
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.tom-pad {
  width: 100px;
  height: 100px;
  border: 4px solid rgba(0, 0, 0, 0.3);
}

.snare-pad {
  width: 130px;
  height: 130px;
  border: 5px solid #95a5a6;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.5);
}

.kick-pad {
  width: 160px;
  height: 160px;
  border: 6px solid #1a1a2e;
  background: linear-gradient(145deg, #2c3e50 0%, #0f1e2d 100%) !important;
}

.hihat-stand {
  width: 100px;
  height: 100px;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.pad-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

.pad-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.snare-pad .pad-name {
  color: #2c3e50;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

.pad-key {
  font-size: 11px;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  color: #fff;
  font-family: 'Monaco', monospace;
}

.snare-pad .pad-key {
  background: rgba(0, 0, 0, 0.6);
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 12px;
  flex-wrap: wrap;
}

.volume-group,
.action-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.volume-label {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  min-width: 40px;
}

.reverb-label {
  font-size: 13px;
  font-weight: 600;
  color: #909399;
  white-space: nowrap;
}

.sound-info-card,
.guide-card,
.tips-card {
  margin-bottom: 24px;
}

.sound-tag {
  margin-left: 12px;
  font-weight: normal;
}

.sound-alert {
  margin-bottom: 20px;
  border-radius: 10px;
}

.sound-alert-content p {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: #606266;
}

.sound-alert-content strong {
  color: #165DFF;
}

.sound-compare-row {
  margin-bottom: 24px;
}

.compare-card {
  padding: 20px;
  border-radius: 12px;
  height: 100%;
}

.compare-synth {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  border: 1px solid #ffcdd2;
}

.compare-sample {
  background: linear-gradient(135deg, #f0f7ff 0%, #e0edff 100%);
  border: 1px solid #bbdefb;
}

.compare-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
}

.compare-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.compare-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.compare-list li .el-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.quality-tips {
  padding: 20px;
  background: linear-gradient(135deg, #fff8e6 0%, #ffefcc 100%);
  border-radius: 12px;
  border: 1px solid #ffe58f;
}

.quality-tips-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #ad6800;
  margin-bottom: 16px;
}

.quality-tip-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  transition: transform 0.2s;
}

.quality-tip-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.9);
}

.qt-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.qt-content strong {
  display: block;
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.qt-content p {
  margin: 0;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.keymap-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.keymap-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  transition: background 0.2s;
}

.keymap-item:hover {
  background: #ecf5ff;
}

.keymap-key {
  min-width: 80px;
  padding: 6px 10px;
  background: #fff;
  border: 2px solid #dcdfe6;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  color: #165DFF;
}

.keymap-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.keymap-info strong {
  font-size: 14px;
  color: #303133;
}

.keymap-info span {
  font-size: 12px;
  color: #909399;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  margin-bottom: 8px;
}

.tip-item span {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  flex: 1;
}

@media (max-width: 900px) {
  .sound-compare-row :deep(.el-col) {
    margin-bottom: 16px;
  }

  .quality-tips :deep(.el-col) {
    margin-bottom: 12px;
  }

  .keymap-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .drum-pad.large {
    width: 80px;
    height: 80px;
  }

  .drum-pad.medium {
    width: 70px;
    height: 70px;
  }

  .drum-pad.small {
    width: 55px;
    height: 55px;
  }

  .tom-pad {
    width: 75px;
    height: 75px;
  }

  .snare-pad {
    width: 95px;
    height: 95px;
  }

  .kick-pad {
    width: 120px;
    height: 120px;
  }

  .hihat-stand {
    width: 75px;
    height: 75px;
  }

  .cymbals-row,
  .toms-row,
  .snare-row {
    gap: 12px;
  }
}

@media (max-width: 600px) {
  .keymap-grid {
    grid-template-columns: 1fr;
  }

  .intro-header {
    flex-direction: column;
    text-align: center;
  }

  .cymbals-row,
  .toms-row,
  .snare-row {
    gap: 8px;
    flex-wrap: wrap;
  }

  .controls-row {
    flex-direction: column;
  }

  .volume-group,
  .action-group {
    justify-content: center;
  }
}
</style>
