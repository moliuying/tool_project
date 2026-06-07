<template>
  <div class="gif-resizer">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <el-steps :active="processing ? 3 : sourceGif ? 2 : 0" finish-status="success" simple class="guide-steps">
        <el-step title="上传GIF" description="选择需要缩放的GIF动图" />
        <el-step title="设置尺寸" description="自定义目标尺寸或选择预设" />
        <el-step title="下载使用" description="处理完成后下载缩放后的GIF" />
      </el-steps>
    </el-card>

    <el-row :gutter="24">
      <el-col :span="14">
        <el-card class="preview-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <View />
              </el-icon>
              <span>预览效果</span>
              <el-tag size="small" type="success" class="header-tag">
                本地处理 · 安全可靠
              </el-tag>
            </div>
          </template>

          <div class="preview-container">
            <div v-if="!sourceGif" class="preview-placeholder">
              <el-icon><Picture /></el-icon>
              <span>请先上传GIF动图</span>
            </div>
            <div v-else class="gif-preview-wrap">
              <div class="preview-section">
                <div class="preview-label">
                  <el-tag size="small" type="info">原图</el-tag>
                  <span class="preview-size">{{ originalWidth }} × {{ originalHeight }}</span>
                </div>
                <div class="preview-box">
                  <img :src="sourceGif" class="gif-preview" />
                </div>
              </div>
              <div class="preview-divider">
                <el-icon :size="24" color="#165DFF"><Right /></el-icon>
              </div>
              <div class="preview-section">
                <div class="preview-label">
                  <el-tag size="small" type="success">缩放后</el-tag>
                  <span class="preview-size">{{ targetWidth }} × {{ targetHeight }}</span>
                </div>
                <div class="preview-box">
                  <img v-if="outputGif" :src="outputGif" class="gif-preview" />
                  <el-skeleton v-else :rows="5" animated />
                </div>
              </div>
            </div>
          </div>

          <div class="preview-info" v-if="sourceGif">
            <el-tag size="small">帧数: {{ frameCount }}</el-tag>
            <el-tag size="small" type="info">原文件: {{ formatFileSize(originalFileSize) }}</el-tag>
            <el-tag size="small" type="warning" v-if="outputFileSize > 0">输出文件: {{ formatFileSize(outputFileSize) }}</el-tag>
            <el-tag size="small" type="success" v-if="outputGif">处理完成</el-tag>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card class="upload-card" v-if="!sourceGif">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Upload />
              </el-icon>
              <span>上传GIF</span>
              <el-tag size="small" type="info" class="header-tag">仅支持 GIF 格式</el-tag>
            </div>
          </template>
          <div class="upload-area">
            <el-upload
              ref="uploadRef"
              drag
              :auto-upload="false"
              :limit="1"
              accept=".gif,image/gif"
              :on-change="handleFileChange"
              :on-exceed="handleExceed"
              class="image-uploader"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                将GIF拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 GIF 动图格式，文件大小建议不超过 20MB
                </div>
              </template>
            </el-upload>
          </div>

          <el-divider />

          <div class="scene-section">
            <div class="scene-title">
              <el-icon :size="16" color="#165DFF"><MagicStick /></el-icon>
              <span>适用场景</span>
            </div>
            <el-row :gutter="12">
              <el-col :span="12" v-for="scene in scenes" :key="scene.name">
                <div class="scene-card">
                  <el-icon :size="24" :color="scene.color">{{ scene.icon }}</el-icon>
                  <span>{{ scene.name }}</span>
                </div>
              </el-col>
            </el-row>
          </div>

          <el-divider />

          <div class="privacy-note">
            <el-icon><Lock /></el-icon>
            <span>所有操作均在浏览器本地完成，GIF不会上传到服务器，保障您的隐私安全</span>
          </div>
        </el-card>

        <template v-if="sourceGif">
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon :size="20" color="#165DFF">
                  <Setting />
                </el-icon>
                <span>缩放设置</span>
                <div class="header-actions">
                  <el-button size="small" text @click="resetSettings">
                    重置设置
                  </el-button>
                  <el-button size="small" @click="handleReupload">
                    <el-icon><Upload /></el-icon>
                    重新上传
                  </el-button>
                </div>
              </div>
            </template>

            <div class="settings-form">
              <el-form label-position="top">
                <el-form-item label="缩放模式">
                  <el-radio-group v-model="resizeMode" size="small">
                    <el-radio-button value="preset">常用预设</el-radio-button>
                    <el-radio-button value="percent">百分比缩放</el-radio-button>
                    <el-radio-button value="custom">自定义尺寸</el-radio-button>
                  </el-radio-group>
                </el-form-item>

                <template v-if="resizeMode === 'preset'">
                  <el-form-item label="选择预设尺寸">
                    <div class="preset-grid">
                      <div
                        v-for="preset in presets"
                        :key="preset.name"
                        class="preset-item"
                        :class="{ active: selectedPreset === preset.name }"
                        @click="applyPreset(preset)"
                      >
                        <span class="preset-name">{{ preset.name }}</span>
                        <span class="preset-size">{{ preset.width }}×{{ preset.height }}</span>
                      </div>
                    </div>
                  </el-form-item>
                </template>

                <template v-if="resizeMode === 'percent'">
                  <el-form-item label="缩放比例">
                    <el-slider
                      v-model="scalePercent"
                      :min="10"
                      :max="200"
                      show-input
                      :format-tooltip="val => val + '%'"
                      :marks="percentMarks"
                    />
                  </el-form-item>
                </template>

                <template v-if="resizeMode === 'custom'">
                  <el-form-item label="目标尺寸">
                    <div class="custom-size-header">
                      <div class="ratio-compare-bar">
                        <span class="ratio-info ratio-original">
                          <el-icon :size="14" color="#165DFF"><InfoFilled /></el-icon>
                          原图：<strong>{{ originalRatioText }}</strong>
                          <span class="ratio-pixel">({{ originalWidth }} × {{ originalHeight }})</span>
                        </span>
                        <el-icon :size="16" :class="['ratio-arrow', { 'ratio-warning': isRatioMismatch }]">
                          <component :is="isRatioMismatch ? 'Warning' : 'Right'" />
                        </el-icon>
                        <span class="ratio-info" :class="{ 'ratio-mismatch': isRatioMismatch, 'ratio-match': !isRatioMismatch && targetWidth > 0 }">
                          <el-icon :size="14" :color="isRatioMismatch ? '#f56c6c' : '#67c23a'">
                            <component :is="isRatioMismatch ? 'Warning' : 'CircleCheckFilled'" />
                          </el-icon>
                          目标：<strong>{{ targetRatioText }}</strong>
                          <span class="ratio-pixel">({{ targetWidth }} × {{ targetHeight }})</span>
                        </span>
                      </div>
                    </div>
                    <div class="size-input-group">
                      <div class="size-input-wrapper">
                        <span class="size-input-label">宽</span>
                        <el-input-number
                          v-model="targetWidth"
                          :min="1"
                          :max="4096"
                          :step="10"
                          controls-position="right"
                          size="large"
                          @change="onWidthChange"
                        />
                        <span class="size-input-unit">px</span>
                      </div>
                      <button
                        type="button"
                        class="ratio-toggle-btn"
                        :class="{ locked: keepRatio, unlocked: !keepRatio }"
                        @click="keepRatio = !keepRatio"
                        :title="keepRatio ? '已锁定宽高比，修改任意一侧将自动等比缩放' : '未锁定宽高比，可自由设置宽高'"
                      >
                        <el-icon v-if="keepRatio" :size="20" color="#165DFF"><Link /></el-icon>
                        <el-icon v-else :size="20" color="#909399"><Connection /></el-icon>
                      </button>
                      <div class="size-input-wrapper">
                        <span class="size-input-label">高</span>
                        <el-input-number
                          v-model="targetHeight"
                          :min="1"
                          :max="4096"
                          :step="10"
                          controls-position="right"
                          size="large"
                          @change="onHeightChange"
                        />
                        <span class="size-input-unit">px</span>
                      </div>
                    </div>
                    <div class="ratio-status-tip" :class="keepRatio ? 'tip-locked' : isRatioMismatch ? 'tip-danger' : 'tip-unlocked'">
                      <el-icon :size="12">
                        <CircleCheckFilled v-if="keepRatio" />
                        <Warning v-else-if="isRatioMismatch" />
                        <InfoFilled v-else />
                      </el-icon>
                      <span v-if="keepRatio">
                        <strong>已锁定</strong> 宽高比，修改<strong>宽度</strong>或<strong>高度</strong>后，另一侧将自动等比计算
                      </span>
                      <span v-else-if="isRatioMismatch">
                        <strong>⚠️ 比例不匹配！</strong> 原图 <strong>{{ originalRatioText }}</strong>，目标 <strong>{{ targetRatioText }}</strong>，相差约 <strong>{{ distortionAmount }}%</strong>，GIF画面<strong>将被拉伸变形</strong>
                      </span>
                      <span v-else>
                        <strong>未锁定</strong> 宽高比，宽高可各自独立设置
                      </span>
                    </div>

                    <div v-if="isRatioMismatch" class="ratio-fix-panel">
                      <div class="fix-panel-title">
                        <el-icon :size="14" color="#f56c6c"><Warning /></el-icon>
                        <span>防止变形，一键修正为等比尺寸：</span>
                      </div>
                      <div class="fix-btn-group">
                        <el-button size="small" type="primary" plain @click="fixByWidth">
                          <el-icon><Aim /></el-icon>
                          以宽度 {{ targetWidth }}px 为准
                          <span class="fix-sub">→ 高 {{ Math.max(1, Math.round(targetWidth / (originalWidth / originalHeight))) }}px</span>
                        </el-button>
                        <el-button size="small" type="success" plain @click="fixByHeight">
                          <el-icon><Aim /></el-icon>
                          以高度 {{ targetHeight }}px 为准
                          <span class="fix-sub">→ 宽 {{ Math.max(1, Math.round(targetHeight * (originalWidth / originalHeight))) }}px</span>
                        </el-button>
                        <el-button size="small" type="warning" plain @click="fixToOriginal">
                          <el-icon><RefreshLeft /></el-icon>
                          恢复原始尺寸
                          <span class="fix-sub">{{ originalWidth }} × {{ originalHeight }}</span>
                        </el-button>
                      </div>
                    </div>
                  </el-form-item>
                </template>

                <el-divider />

                <el-form-item label="输出质量">
                  <el-slider v-model="quality" :min="1" :max="20" show-input :format-tooltip="val => 21 - val + ' (越小越好)'" />
                  <div class="quality-tip">
                    <el-icon :size="12" color="#909399"><InfoFilled /></el-icon>
                    <span>数值越小画质越好，但文件体积越大。建议 10 左右平衡画质与体积</span>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </el-card>

          <el-card class="action-card">
            <el-alert
              v-if="isRatioMismatch"
              type="error"
              :closable="false"
              class="distortion-warning"
              show-icon
            >
              <template #title>
                <div class="distortion-warning-content">
                  <span>
                    ⚠️ <strong>尺寸比例不匹配</strong>（原图 {{ originalRatioText }} → 目标 {{ targetRatioText }}，相差 {{ distortionAmount }}%），输出GIF将会被<strong>拉伸变形</strong>
                  </span>
                  <div class="distortion-warning-actions">
                    <el-button size="small" type="primary" plain @click="fixByWidth">按宽度修正</el-button>
                    <el-button size="small" type="success" plain @click="fixByHeight">按高度修正</el-button>
                  </div>
                </div>
              </template>
            </el-alert>
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="processGif" :loading="processing" :disabled="!canProcess">
                <el-icon v-if="!processing"><RefreshRight /></el-icon>
                {{ processing ? `处理中 ${processProgress}%` : (isRatioMismatch ? '仍要处理（可能变形）' : '开始处理并下载') }}
              </el-button>
            </div>
            <el-progress v-if="processing" :percentage="processProgress" :stroke-width="6" />
            <el-alert type="info" :closable="false" class="download-tip" v-if="!processing">
              <template #title>
                <span>处理说明：GIF缩放在浏览器本地完成，帧越多处理时间越长，请耐心等待。建议单张GIF不超过500帧。</span>
              </template>
            </el-alert>
          </el-card>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {
  InfoFilled,
  View,
  Upload,
  UploadFilled,
  MagicStick,
  Lock,
  Setting,
  Download,
  Picture,
  Right,
  RefreshRight,
  Link,
  Connection,
  CircleCheckFilled,
  Warning,
  Aim,
  RefreshLeft
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { parseGIF, decompressFrames } from 'gifuct-js'
import GIF from 'gif.js'

const uploadRef = ref()

const sourceGif = ref<string>('')
const originalFile = ref<File | null>(null)
const originalWidth = ref(0)
const originalHeight = ref(0)
const originalFileSize = ref(0)
const frameCount = ref(0)

const resizeMode = ref<'preset' | 'percent' | 'custom'>('preset')
const selectedPreset = ref('')
const targetWidth = ref(0)
const targetHeight = ref(0)
const scalePercent = ref(100)
const keepRatio = ref(true)
const quality = ref(10)

const processing = ref(false)
const processProgress = ref(0)
const outputGif = ref<string>('')
const outputFileSize = ref(0)

interface Preset {
  name: string
  width: number
  height: number
}

const presets: Preset[] = [
  { name: '微信表情包', width: 240, height: 240 },
  { name: 'QQ表情包', width: 200, height: 200 },
  { name: '小红书动图', width: 480, height: 480 },
  { name: '微博动图', width: 440, height: 440 },
  { name: '网页小图标', width: 64, height: 64 },
  { name: '网页大图标', width: 128, height: 128 },
  { name: 'Banner动图', width: 720, height: 300 },
  { name: '社交配图', width: 600, height: 600 }
]

const percentMarks = {
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
  150: '150%',
  200: '200%'
}

const scenes = [
  { name: '表情包制作', icon: 'MagicStick', color: '#f56c6c' },
  { name: '网页优化', icon: 'Cpu', color: '#409eff' },
  { name: '平台适配', icon: 'Platform', color: '#67c23a' },
  { name: '社交媒体', icon: 'Share', color: '#e6a23c' }
]

const canProcess = computed(() => {
  return sourceGif.value && targetWidth.value > 0 && targetHeight.value > 0
})

const originalRatioText = computed(() => {
  if (!originalWidth.value || !originalHeight.value) return '--:--'
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const g = gcd(originalWidth.value, originalHeight.value)
  return `${originalWidth.value / g}:${originalHeight.value / g}`
})

const targetRatioText = computed(() => {
  if (!targetWidth.value || !targetHeight.value) return '--:--'
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const g = gcd(targetWidth.value, targetHeight.value)
  return `${targetWidth.value / g}:${targetHeight.value / g}`
})

const isRatioMismatch = computed(() => {
  if (!originalWidth.value || !originalHeight.value || !targetWidth.value || !targetHeight.value) return false
  if (keepRatio.value) return false
  const originalRatio = originalWidth.value / originalHeight.value
  const targetRatio = targetWidth.value / targetHeight.value
  return Math.abs(originalRatio - targetRatio) > 0.01
})

const distortionAmount = computed(() => {
  if (!isRatioMismatch.value) return 0
  const originalRatio = originalWidth.value / originalHeight.value
  const targetRatio = targetWidth.value / targetHeight.value
  const diff = Math.abs(originalRatio - targetRatio) / originalRatio
  return Math.round(diff * 100)
})

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const handleFileChange = async (file: UploadFile) => {
  if (!file.raw) return
  if (file.raw.type !== 'image/gif' && !file.name.toLowerCase().endsWith('.gif')) {
    ElMessage.error('请选择GIF格式的图片')
    return
  }
  if (file.raw.size > 20 * 1024 * 1024) {
    ElMessage.error('GIF文件大小不能超过 20MB')
    return
  }

  originalFile.value = file.raw
  originalFileSize.value = file.raw.size

  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      sourceGif.value = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        originalWidth.value = img.width
        originalHeight.value = img.height
        targetWidth.value = img.width
        targetHeight.value = img.height
        analyzeGif(file.raw!)
      }
      img.src = sourceGif.value
    }
    reader.readAsDataURL(file.raw)
  } catch (e) {
    console.error('Failed to load GIF:', e)
    ElMessage.error('GIF加载失败，请检查文件是否损坏')
  }
}

const analyzeGif = async (file: File) => {
  try {
    const buffer = await file.arrayBuffer()
    const gif = parseGIF(buffer)
    frameCount.value = gif.frames.length
  } catch (e) {
    console.error('Failed to analyze GIF:', e)
  }
}

const handleExceed = () => {
  ElMessage.warning('请先删除已上传的GIF再重新上传')
}

const handleReupload = () => {
  sourceGif.value = ''
  originalFile.value = null
  originalWidth.value = 0
  originalHeight.value = 0
  originalFileSize.value = 0
  frameCount.value = 0
  targetWidth.value = 0
  targetHeight.value = 0
  outputGif.value = ''
  outputFileSize.value = 0
  processProgress.value = 0
  resizeMode.value = 'preset'
  selectedPreset.value = ''
  scalePercent.value = 100
  quality.value = 10
}

const resetSettings = () => {
  resizeMode.value = 'preset'
  selectedPreset.value = ''
  scalePercent.value = 100
  targetWidth.value = originalWidth.value
  targetHeight.value = originalHeight.value
  keepRatio.value = true
  quality.value = 10
  outputGif.value = ''
  outputFileSize.value = 0
}

const applyPreset = (preset: Preset) => {
  selectedPreset.value = preset.name
  targetWidth.value = preset.width
  targetHeight.value = preset.height
}

watch(scalePercent, (val) => {
  if (resizeMode.value === 'percent' && originalWidth.value > 0 && originalHeight.value > 0) {
    targetWidth.value = Math.round(originalWidth.value * val / 100)
    targetHeight.value = Math.round(originalHeight.value * val / 100)
  }
})

const onWidthChange = (newWidth: number | undefined) => {
  if (!newWidth || !keepRatio.value || !originalWidth.value || !originalHeight.value) return
  const ratio = originalWidth.value / originalHeight.value
  targetHeight.value = Math.max(1, Math.round(newWidth / ratio))
}

const onHeightChange = (newHeight: number | undefined) => {
  if (!newHeight || !keepRatio.value || !originalWidth.value || !originalHeight.value) return
  const ratio = originalWidth.value / originalHeight.value
  targetWidth.value = Math.max(1, Math.round(newHeight * ratio))
}

watch(keepRatio, (val) => {
  if (val && originalWidth.value > 0 && originalHeight.value > 0) {
    onWidthChange(targetWidth.value)
  }
})

const fixByWidth = () => {
  if (!originalWidth.value || !originalHeight.value || !targetWidth.value) return
  const ratio = originalWidth.value / originalHeight.value
  targetHeight.value = Math.max(1, Math.round(targetWidth.value / ratio))
  keepRatio.value = true
  ElMessage.success('已按宽度修正为等比尺寸')
}

const fixByHeight = () => {
  if (!originalWidth.value || !originalHeight.value || !targetHeight.value) return
  const ratio = originalWidth.value / originalHeight.value
  targetWidth.value = Math.max(1, Math.round(targetHeight.value * ratio))
  keepRatio.value = true
  ElMessage.success('已按高度修正为等比尺寸')
}

const fixToOriginal = () => {
  targetWidth.value = originalWidth.value
  targetHeight.value = originalHeight.value
  keepRatio.value = true
  ElMessage.success('已恢复为原始尺寸')
}

const processGif = async () => {
  if (!originalFile.value || !canProcess.value) return

  processing.value = true
  processProgress.value = 0
  outputGif.value = ''
  outputFileSize.value = 0

  try {
    const buffer = await originalFile.value.arrayBuffer()
    const gif = parseGIF(buffer)
    const frames = decompressFrames(gif)

    const tW = targetWidth.value
    const tH = targetHeight.value

    const gifEncoder = new GIF({
      workers: 2,
      quality: quality.value,
      width: tW,
      height: tH,
      workerScript: '/gif.worker.js',
      repeat: 0
    })

    let previousImageData: ImageData | null = null

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i]

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = gif.width
      tempCanvas.height = gif.height
      const tempCtx = tempCanvas.getContext('2d')!

      if (frame.disposalMethod === 2 || !previousImageData) {
        tempCtx.clearRect(0, 0, gif.width, gif.height)
      } else if (previousImageData) {
        tempCtx.putImageData(previousImageData, 0, 0)
      }

      const frameCanvas = document.createElement('canvas')
      frameCanvas.width = frame.dims.width
      frameCanvas.height = frame.dims.height
      const frameCtx = frameCanvas.getContext('2d')!
      const frameData = frameCtx.createImageData(frame.dims.width, frame.dims.height)
      frameData.data.set(frame.pixels)
      frameCtx.putImageData(frameData, 0, 0)

      tempCtx.drawImage(
        frameCanvas,
        frame.dims.left,
        frame.dims.top,
        frame.dims.width,
        frame.dims.height
      )

      const fullImageData = tempCtx.getImageData(0, 0, gif.width, gif.height)
      previousImageData = fullImageData

      const outputCanvas = document.createElement('canvas')
      outputCanvas.width = tW
      outputCanvas.height = tH
      const outputCtx = outputCanvas.getContext('2d')!
      outputCtx.imageSmoothingEnabled = true
      outputCtx.imageSmoothingQuality = 'high'

      const drawCanvas = document.createElement('canvas')
      drawCanvas.width = gif.width
      drawCanvas.height = gif.height
      drawCanvas.getContext('2d')!.putImageData(fullImageData, 0, 0)
      outputCtx.drawImage(drawCanvas, 0, 0, gif.width, gif.height, 0, 0, tW, tH)

      gifEncoder.addFrame(outputCtx, {
        delay: frame.delay,
        copy: true
      })

      processProgress.value = Math.round(((i + 1) / frames.length) * 50)
    }

    gifEncoder.on('progress', (p: number) => {
      processProgress.value = 50 + Math.round(p * 50)
    })

    gifEncoder.on('finished', (blob: Blob) => {
      const url = URL.createObjectURL(blob)
      outputGif.value = url
      outputFileSize.value = blob.size

      const link = document.createElement('a')
      link.download = `缩放GIF_${tW}x${tH}_${Date.now()}.gif`
      link.href = url
      link.click()

      processing.value = false
      processProgress.value = 100
      ElMessage.success('GIF处理完成，已开始下载！')
    })

    gifEncoder.render()
  } catch (e) {
    console.error('Failed to process GIF:', e)
    processing.value = false
    ElMessage.error('GIF处理失败，请重试或尝试其他尺寸')
  }
}
</script>

<style scoped>
.gif-resizer {
  max-width: 1400px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
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

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.preview-card {
  margin-bottom: 24px;
  min-height: 500px;
}

.preview-container {
  width: 100%;
  min-height: 400px;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 20px;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #909399;
}

.preview-placeholder .el-icon {
  font-size: 64px;
}

.gif-preview-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: center;
}

.preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 45%;
}

.preview-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-size {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.preview-box {
  width: 100%;
  min-height: 200px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  overflow: hidden;
}

.gif-preview {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  display: block;
}

.preview-divider {
  flex-shrink: 0;
  padding: 0 4px;
}

.preview-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.upload-card {
  margin-bottom: 24px;
}

.upload-area {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.image-uploader :deep(.el-upload-dragger) {
  width: 100%;
  padding: 40px 20px;
}

.image-uploader :deep(.el-upload) {
  width: 100%;
}

.scene-section {
  padding: 0 8px;
}

.scene-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.scene-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border-radius: 8px;
  border: 1px solid #ebeef5;
  margin-bottom: 12px;
  font-size: 13px;
  color: #606266;
  transition: all 0.2s;
}

.scene-card:hover {
  border-color: #165DFF;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
  transform: translateY(-2px);
}

.privacy-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 8px;
  font-size: 13px;
  color: #166534;
}

.privacy-note .el-icon {
  color: #22c55e;
}

.settings-card {
  margin-bottom: 24px;
}

.settings-form {
  padding: 8px 0;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.preset-item {
  padding: 12px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border: 2px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.preset-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
  transform: translateY(-2px);
}

.preset-item.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

.preset-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.preset-size {
  font-size: 11px;
  color: #909399;
}

.size-input-group {
  display: flex;
  align-items: stretch;
  gap: 8px;
  margin-bottom: 12px;
}

.size-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 6px 10px;
  transition: all 0.2s;
}

.size-input-wrapper:focus-within {
  border-color: #409eff;
  background: #ecf5ff;
}

.size-input-label {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
  white-space: nowrap;
}

.size-input-wrapper :deep(.el-input-number) {
  flex: 1;
}

.size-input-wrapper :deep(.el-input-number .el-input__wrapper) {
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.size-input-wrapper :deep(.el-input-number .el-input__inner) {
  text-align: right;
  font-weight: 600;
  font-size: 16px;
}

.size-input-unit {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.ratio-toggle-btn {
  flex-shrink: 0;
  width: 44px;
  min-width: 44px;
  border: none;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
  border: 2px solid transparent;
}

.ratio-toggle-btn:hover {
  transform: scale(1.05);
}

.ratio-toggle-btn.locked {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border-color: #165DFF;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.08);
}

.ratio-toggle-btn.locked:hover {
  box-shadow: 0 0 0 4px rgba(22, 93, 255, 0.15);
}

.ratio-toggle-btn.unlocked {
  background: #f5f7fa;
  border-color: #dcdfe6;
}

.ratio-toggle-btn.unlocked:hover {
  background: #ebeef5;
  border-color: #c0c4cc;
}

.custom-size-header {
  margin-bottom: 12px;
}

.ratio-info {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #606266;
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f9ff 100%);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #d9ecff;
}

.ratio-info strong {
  color: #165DFF;
  font-weight: 700;
  margin: 0 2px;
}

.ratio-status-tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.6;
  margin-top: 4px;
}

.ratio-status-tip strong {
  font-weight: 700;
}

.ratio-status-tip.tip-locked {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #166534;
  border: 1px solid #bbf7d0;
}

.ratio-status-tip.tip-locked :deep(.el-icon) {
  color: #22c55e;
}

.ratio-status-tip.tip-unlocked {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  color: #92400e;
  border: 1px solid #fde68a;
}

.ratio-status-tip.tip-unlocked :deep(.el-icon) {
  color: #f59e0b;
}

.ratio-status-tip.tip-danger {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #991b1b;
  border: 1px solid #fecaca;
  animation: dangerPulse 2s ease-in-out infinite;
}

@keyframes dangerPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.2); }
  50% { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.05); }
}

.ratio-status-tip.tip-danger :deep(.el-icon) {
  color: #ef4444;
}

.ratio-compare-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.ratio-info.ratio-original {
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f9ff 100%);
  border-color: #d9ecff;
}

.ratio-info.ratio-match {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #bbf7d0;
}

.ratio-info.ratio-match strong {
  color: #16a34a;
}

.ratio-info.ratio-mismatch {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-color: #fecaca;
  animation: dangerPulse 2s ease-in-out infinite;
}

.ratio-info.ratio-mismatch strong {
  color: #dc2626;
}

.ratio-pixel {
  font-size: 11px;
  color: #909399;
  margin-left: 4px;
  opacity: 0.85;
}

.ratio-arrow {
  color: #909399;
  transition: all 0.2s;
}

.ratio-arrow.ratio-warning {
  color: #ef4444;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.ratio-fix-panel {
  margin-top: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 1px solid #fed7aa;
  border-radius: 8px;
}

.fix-panel-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #9a3412;
  margin-bottom: 10px;
}

.fix-btn-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.fix-btn-group .el-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.fix-sub {
  font-size: 11px;
  opacity: 0.75;
  margin-left: 4px;
  font-weight: normal;
}

.distortion-warning {
  margin-bottom: 16px;
}

.distortion-warning-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.distortion-warning-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .distortion-warning-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

.quality-tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.action-card {
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.download-tip {
  margin-bottom: 0;
}

@media (max-width: 992px) {
  .el-col {
    width: 100% !important;
  }

  .gif-preview-wrap {
    flex-direction: column;
  }

  .preview-section {
    max-width: 100%;
    width: 100%;
  }
}
</style>
