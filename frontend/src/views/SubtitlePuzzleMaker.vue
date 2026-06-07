<template>
  <div class="subtitle-puzzle-maker">
    <el-card class="intro-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>功能介绍</span>
        </div>
      </template>
      <div class="intro-content">
        <div class="intro-title">
          <el-icon :size="24" color="#165DFF"><Grid /></el-icon>
          <span>台词拼图生成器</span>
        </div>
        <div class="intro-desc">
          <p>将多条影视台词截图或文字金句拼接为一张长图，快速生成可用于社交媒体分享的内容作品。</p>
        </div>
        <div class="mode-tabs">
          <div
            class="mode-tab"
            :class="{ active: currentMode === 'text' }"
            @click="currentMode = 'text'"
          >
            <div class="mode-badge" v-if="currentMode === 'text'">推荐</div>
            <el-icon :size="18"><Edit /></el-icon>
            <div class="mode-info">
              <span class="mode-name">文字生成模式</span>
              <span class="mode-desc">直接输入台词，快速生成拼图</span>
            </div>
          </div>
          <div
            class="mode-tab"
            :class="{ active: currentMode === 'image' }"
            @click="currentMode = 'image'"
          >
            <el-icon :size="18"><Picture /></el-icon>
            <div class="mode-info">
              <span class="mode-name">截图拼接模式</span>
              <span class="mode-desc">上传已有台词截图进行拼接</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="guide-card" v-if="currentMode === 'image'">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <List />
          </el-icon>
          <span>截图拼接 · 使用步骤</span>
        </div>
      </template>
      <el-steps :active="0" finish-status="wait" simple class="guide-steps">
        <el-step title="上传截图" description="批量上传多条台词/字幕截图" />
        <el-step title="调整顺序" description="拖拽调整图片拼接顺序" />
        <el-step title="美化样式" description="自定义间距、背景、边框等" />
        <el-step title="导出长图" description="一键生成并下载拼图长图" />
      </el-steps>
    </el-card>

    <el-card class="guide-card" v-else>
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <List />
          </el-icon>
          <span>文字生成 · 使用步骤</span>
        </div>
      </template>
      <el-steps :active="0" finish-status="wait" simple class="guide-steps">
        <el-step title="输入台词" description="逐行输入台词内容" />
        <el-step title="设置样式" description="自定义字幕样式、背景等" />
        <el-step title="预览调整" description="实时预览生成效果" />
        <el-step title="导出长图" description="一键生成并下载拼图长图" />
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

          <div class="preview-container" ref="previewContainer">
            <div v-if="!hasContent" class="preview-placeholder">
              <el-icon><Picture /></el-icon>
              <span>{{ currentMode === 'image' ? '请先上传台词截图' : '请先添加台词文字' }}</span>
            </div>
            <div v-else class="puzzle-preview-wrapper">
              <canvas ref="canvas" class="preview-canvas" />
            </div>
          </div>

          <div class="preview-info" v-if="hasContent">
            <el-tag size="small">{{ currentMode === 'image' ? `图片数量: ${imageList.length}` : `台词数量: ${textList.length}` }}</el-tag>
            <el-tag size="small" type="info">拼图尺寸: {{ finalWidth }} x {{ finalHeight }}</el-tag>
            <el-tag size="small" type="success">输出格式: PNG</el-tag>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card class="upload-card" v-if="currentMode === 'image'">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Upload />
              </el-icon>
              <span>上传截图</span>
              <el-tag size="small" type="info" class="header-tag">支持批量上传</el-tag>
            </div>
          </template>
          <div class="upload-area">
            <el-upload
              ref="uploadRef"
              drag
              multiple
              :auto-upload="false"
              :limit="50"
              accept="image/*"
              :on-change="handleFileChange"
              :on-exceed="handleExceed"
              class="image-uploader"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                将图片拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 JPG、PNG、WEBP 格式，单张不超过 10MB
                </div>
              </template>
            </el-upload>
          </div>

          <div class="image-list" v-if="imageList.length > 0">
            <div class="list-header">
              <span>已上传 {{ imageList.length }} 张图片</span>
              <el-button size="small" type="danger" text @click="clearAllImages">
                <el-icon><Delete /></el-icon>
                清空全部
              </el-button>
            </div>
            <draggable
              v-model="imageList"
              item-key="id"
              class="image-drag-list"
              ghost-class="ghost-item"
              animation="200"
              @end="onDragEnd"
            >
              <template #item="{ element, index }">
                <div class="image-item">
                  <div class="item-index">{{ index + 1 }}</div>
                  <img :src="element.src" class="item-thumb" />
                  <div class="item-info">
                    <div class="item-name">{{ element.name }}</div>
                    <div class="item-size">{{ element.width }} x {{ element.height }}</div>
                  </div>
                  <div class="item-actions">
                    <el-button size="small" text @click="moveImageUp(index)" :disabled="index === 0">
                      <el-icon><Top /></el-icon>
                    </el-button>
                    <el-button size="small" text @click="moveImageDown(index)" :disabled="index === imageList.length - 1">
                      <el-icon><Bottom /></el-icon>
                    </el-button>
                    <el-button size="small" type="danger" text @click="removeImage(index)">
                      <el-icon><Close /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </el-card>

        <el-card class="text-card" v-else>
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <EditPen />
              </el-icon>
              <span>输入台词</span>
              <el-tag size="small" type="info" class="header-tag">支持多条台词</el-tag>
            </div>
          </template>
          <div class="text-input-area">
            <div class="input-tip">
              <el-icon :size="14" color="#67c23a"><InfoFilled /></el-icon>
              <span>直接输入台词内容，支持每行一条，按 <kbd>Ctrl</kbd> + <kbd>Enter</kbd> 快速添加</span>
            </div>
            <el-input
              v-model="newText"
              type="textarea"
              :rows="3"
              placeholder="例如：
人生就像一盒巧克力，你永远不知道下一颗是什么味道。
希望是个好东西，也许是最好的东西。"
              @keydown.enter.ctrl="addTextItem"
              class="text-input"
            />
            <div class="input-actions">
              <el-button type="primary" size="small" @click="addTextItem" :disabled="!newText.trim()">
                <el-icon><Plus /></el-icon>
                添加台词
              </el-button>
              <el-button size="small" text @click="loadExample">
                <el-icon><MagicStick /></el-icon>
                加载示例
              </el-button>
            </div>
          </div>

          <div class="text-list" v-if="textList.length > 0">
            <div class="list-header">
              <span>已添加 {{ textList.length }} 条台词</span>
              <div class="header-buttons">
                <el-button size="small" text @click="clearAllTexts">
                  <el-icon><Delete /></el-icon>
                  清空全部
                </el-button>
              </div>
            </div>
            <draggable
              v-model="textList"
              item-key="id"
              class="text-drag-list"
              ghost-class="ghost-item"
              animation="200"
              @end="onDragEnd"
            >
              <template #item="{ element, index }">
                <div class="text-item">
                  <div class="item-index">{{ index + 1 }}</div>
                  <div class="item-info">
                    <div class="item-text">{{ element.content }}</div>
                  </div>
                  <div class="item-actions">
                    <el-button size="small" text @click="moveTextUp(index)" :disabled="index === 0">
                      <el-icon><Top /></el-icon>
                    </el-button>
                    <el-button size="small" text @click="moveTextDown(index)" :disabled="index === textList.length - 1">
                      <el-icon><Bottom /></el-icon>
                    </el-button>
                    <el-button size="small" type="danger" text @click="removeText(index)">
                      <el-icon><Close /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </el-card>

        <el-divider />

        <div class="scene-section">
          <div class="scene-title">
            <el-icon :size="16" color="#165DFF"><MagicStick /></el-icon>
            <span>适用场景</span>
          </div>
          <el-row :gutter="12">
            <el-col :span="12" v-for="scene in scenes" :key="scene.name">
              <div class="scene-card">
                <el-icon :size="24" :color="scene.color"><component :is="scene.icon" /></el-icon>
                <span>{{ scene.name }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-divider />

        <div class="privacy-note">
          <el-icon><Lock /></el-icon>
          <span>所有操作均在浏览器本地完成，不会上传任何数据，保障您的隐私安全</span>
        </div>

        <template v-if="hasContent">
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon :size="20" color="#165DFF">
                  <Setting />
                </el-icon>
                <span>样式设置</span>
                <div class="header-actions">
                  <el-button size="small" text @click="resetSettings">
                    重置设置
                  </el-button>
                </div>
              </div>
            </template>

            <div class="settings-form">
              <el-form label-position="top">
                <el-form-item label="拼图宽度">
                  <el-radio-group v-model="widthMode" size="small">
                    <el-radio-button value="max">自适应</el-radio-button>
                    <el-radio-button value="custom">自定义</el-radio-button>
                  </el-radio-group>
                  <el-slider
                    v-if="widthMode === 'custom'"
                    v-model="customWidth"
                    :min="300"
                    :max="1200"
                    :step="10"
                    show-input
                    class="mt-2"
                  />
                </el-form-item>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="条目间距">
                      <el-slider v-model="gap" :min="0" :max="50" show-input />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="内边距">
                      <el-slider v-model="padding" :min="0" :max="60" show-input />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="圆角大小">
                      <el-slider v-model="borderRadius" :min="0" :max="30" show-input />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="阴影效果">
                      <el-slider v-model="shadowSize" :min="0" :max="30" show-input />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="背景颜色">
                  <el-color-picker v-model="bgColor" show-alpha />
                  <span class="color-presets">
                    <span
                      v-for="color in bgPresets"
                      :key="color"
                      class="color-preset"
                      :style="{ background: color }"
                      @click="bgColor = color"
                    />
                  </span>
                </el-form-item>

                <el-form-item label="序号标记">
                  <el-switch v-model="showNumber" />
                  <div v-if="showNumber" class="number-settings">
                    <el-row :gutter="16">
                      <el-col :span="8">
                        <el-form-item label="位置">
                          <el-select v-model="numberPosition" size="small">
                            <el-option label="左上" value="top-left" />
                            <el-option label="右上" value="top-right" />
                            <el-option label="左下" value="bottom-left" />
                            <el-option label="右下" value="bottom-right" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="字体大小">
                          <el-slider v-model="numberSize" :min="12" :max="48" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="颜色">
                          <el-color-picker v-model="numberColor" show-alpha size="small" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>

                <template v-if="currentMode === 'text'">
                  <el-divider />
                  <div class="text-style-title">
                    <el-icon :size="16"><EditPen /></el-icon>
                    <span>字幕样式</span>
                  </div>
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="字体大小">
                        <el-slider v-model="textFontSize" :min="14" :max="48" show-input />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="文字颜色">
                        <el-color-picker v-model="textColor" show-alpha size="small" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="字幕背景">
                        <el-color-picker v-model="textBgColor" show-alpha size="small" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="行高比例">
                        <el-slider v-model="textLineHeight" :min="1.2" :max="2.5" :step="0.1" show-input />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="文字对齐">
                    <el-radio-group v-model="textAlign" size="small">
                      <el-radio-button value="left">左对齐</el-radio-button>
                      <el-radio-button value="center">居中</el-radio-button>
                      <el-radio-button value="right">右对齐</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </template>

                <el-form-item label="外框装饰" v-if="currentMode === 'image'">
                  <el-switch v-model="showBorder" />
                  <div v-if="showBorder" class="border-settings">
                    <el-row :gutter="16">
                      <el-col :span="8">
                        <el-form-item label="边框宽度">
                          <el-slider v-model="borderWidth" :min="1" :max="10" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="边框颜色">
                          <el-color-picker v-model="borderColor" show-alpha size="small" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </el-card>

          <el-card class="action-card">
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="downloadImage" :loading="downloading" :disabled="!hasContent">
                <el-icon><Download /></el-icon>
                下载拼团长图
              </el-button>
            </div>
            <el-alert type="info" :closable="false" class="download-tip">
              <template #title>
                <span>下载说明：图片将以 PNG 格式保存，支持透明背景。所有处理均在本地完成，不会上传任何数据。</span>
              </template>
            </el-alert>
          </el-card>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import {
  InfoFilled,
  View,
  Upload,
  UploadFilled,
  MagicStick,
  Lock,
  Setting,
  Delete,
  Download,
  Picture,
  Top,
  Bottom,
  Close,
  Plus,
  Edit,
  EditPen,
  Grid,
  List
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import draggable from 'vuedraggable'

interface ImageItem {
  id: string
  src: string
  name: string
  width: number
  height: number
  img: HTMLImageElement | null
}

interface TextItem {
  id: string
  content: string
}

const uploadRef = ref()
const canvas = ref<HTMLCanvasElement | null>(null)
const previewContainer = ref<HTMLDivElement | null>(null)

const currentMode = ref<'image' | 'text'>('text')

const imageList = ref<ImageItem[]>([])
const textList = ref<TextItem[]>([])
const newText = ref('')

const exampleTexts = [
  '人生就像一盒巧克力，你永远不知道下一颗是什么味道。',
  '希望是个好东西，也许是最好的东西，好东西永远不会消逝。',
  '坚强的人只能救赎自己，伟大的人才能拯救他人。',
  '不要恨你的敌人，这会影响你的判断力。',
  '千万不要恨你的对手，那会让你失去理智。'
]

const loadExample = () => {
  if (textList.value.length > 0) {
    ElMessage.warning('请先清空现有台词')
    return
  }
  exampleTexts.forEach((text, index) => {
    setTimeout(() => {
      textList.value.push({
        id: `demo-${Date.now()}-${index}`,
        content: text
      })
    }, index * 50)
  })
  ElMessage.success('示例台词已加载')
}
const downloading = ref(false)

const widthMode = ref<'max' | 'custom'>('max')
const customWidth = ref(800)
const gap = ref(16)
const padding = ref(24)
const borderRadius = ref(12)
const shadowSize = ref(8)
const bgColor = ref('#ffffff')

const showNumber = ref(false)
const numberPosition = ref('top-left')
const numberSize = ref(24)
const numberColor = ref('#165DFF')

const showBorder = ref(false)
const borderWidth = ref(2)
const borderColor = ref('#e5e7eb')

const textFontSize = ref(20)
const textColor = ref('#ffffff')
const textBgColor = ref('rgba(0, 0, 0, 0.75)')
const textLineHeight = ref(1.6)
const textAlign = ref<'left' | 'center' | 'right'>('left')

const bgPresets = [
  '#ffffff',
  '#f3f4f6',
  '#18181b',
  '#0f172a',
  '#fef3c7',
  '#dbeafe',
  '#fce7f3',
  '#dcfce7'
]

const scenes = [
  { name: '影视台词', icon: 'VideoPlay', color: '#409eff' },
  { name: '金句汇总', icon: 'ChatDotRound', color: '#67c23a' },
  { name: '对话摘录', icon: 'ChatLineSquare', color: '#e6a23c' },
  { name: '课程笔记', icon: 'Notebook', color: '#f56c6c' }
]

const hasContent = computed(() => {
  return currentMode.value === 'image' ? imageList.value.length > 0 : textList.value.length > 0
})

const contentWidth = computed(() => {
  if (widthMode.value === 'custom') return customWidth.value
  if (currentMode.value === 'image' && imageList.value.length > 0) {
    return Math.max(...imageList.value.map(img => img.width))
  }
  if (currentMode.value === 'text') {
    return 700
  }
  return 800
})

const finalWidth = computed(() => {
  return contentWidth.value + padding.value * 2
})

const finalHeight = computed(() => {
  if (!hasContent.value) return 0
  
  if (currentMode.value === 'image') {
    const totalImageHeight = imageList.value.reduce((sum, img) => {
      const scale = contentWidth.value / img.width
      return sum + img.height * scale
    }, 0)
    const totalGap = gap.value * (imageList.value.length - 1)
    return totalImageHeight + totalGap + padding.value * 2
  } else {
    const lineHeight = textFontSize.value * textLineHeight.value
    const totalTextHeight = textList.value.reduce((sum, item) => {
      const charsPerLine = Math.floor((contentWidth.value - 40) / (textFontSize.value * 0.6))
      const lines = Math.ceil(item.content.length / charsPerLine)
      return sum + Math.max(lineHeight * lines + 32, 60)
    }, 0)
    const totalGap = gap.value * (textList.value.length - 1)
    return totalTextHeight + totalGap + padding.value * 2
  }
})

const handleFileChange = async (file: UploadFile) => {
  if (!file.raw) return
  if (!file.raw.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  if (file.raw.size > 10 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 10MB')
    return
  }

  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        imageList.value.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          src,
          name: file.name || `图片${imageList.value.length + 1}`,
          width: img.width,
          height: img.height,
          img
        })
        nextTick(() => drawPuzzle())
      }
      img.src = src
    }
    reader.readAsDataURL(file.raw)
  } catch (e) {
    console.error('Failed to load image:', e)
    ElMessage.error('图片加载失败，请检查文件是否损坏')
  }
}

const handleExceed = () => {
  ElMessage.warning('最多上传 50 张图片')
}

const clearAllImages = () => {
  imageList.value = []
}

const removeImage = (index: number) => {
  imageList.value.splice(index, 1)
}

const moveImageUp = (index: number) => {
  if (index > 0) {
    const temp = imageList.value[index]
    imageList.value[index] = imageList.value[index - 1]
    imageList.value[index - 1] = temp
  }
}

const moveImageDown = (index: number) => {
  if (index < imageList.value.length - 1) {
    const temp = imageList.value[index]
    imageList.value[index] = imageList.value[index + 1]
    imageList.value[index + 1] = temp
  }
}

const addTextItem = () => {
  if (!newText.value.trim()) {
    ElMessage.warning('请输入台词内容')
    return
  }
  
  const lines = newText.value.trim().split('\n').filter(line => line.trim())
  lines.forEach(line => {
    textList.value.push({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: line.trim()
    })
  })
  
  newText.value = ''
  nextTick(() => drawPuzzle())
}

const clearAllTexts = () => {
  textList.value = []
}

const removeText = (index: number) => {
  textList.value.splice(index, 1)
}

const moveTextUp = (index: number) => {
  if (index > 0) {
    const temp = textList.value[index]
    textList.value[index] = textList.value[index - 1]
    textList.value[index - 1] = temp
  }
}

const moveTextDown = (index: number) => {
  if (index < textList.value.length - 1) {
    const temp = textList.value[index]
    textList.value[index] = textList.value[index + 1]
    textList.value[index + 1] = temp
  }
}

const onDragEnd = () => {
  drawPuzzle()
}

const resetSettings = () => {
  widthMode.value = 'max'
  customWidth.value = 800
  gap.value = 16
  padding.value = 24
  borderRadius.value = 12
  shadowSize.value = 8
  bgColor.value = '#ffffff'
  showNumber.value = false
  numberPosition.value = 'top-left'
  numberSize.value = 24
  numberColor.value = '#165DFF'
  showBorder.value = false
  borderWidth.value = 2
  borderColor.value = '#e5e7eb'
  textFontSize.value = 20
  textColor.value = '#ffffff'
  textBgColor.value = 'rgba(0, 0, 0, 0.75)'
  textLineHeight.value = 1.6
  textAlign.value = 'left'
}

const drawPuzzle = () => {
  if (!canvas.value || !hasContent.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const w = finalWidth.value
  const h = finalHeight.value

  const maxPreviewWidth = previewContainer.value?.clientWidth || 600
  const scale = Math.min(1, maxPreviewWidth / w)
  canvas.value.width = w * scale
  canvas.value.height = h * scale

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.scale(scale, scale)

  ctx.fillStyle = bgColor.value
  ctx.fillRect(0, 0, w, h)

  let currentY = padding.value

  if (currentMode.value === 'image') {
    imageList.value.forEach((item, index) => {
      const scaleRatio = contentWidth.value / item.width
      const drawWidth = contentWidth.value
      const drawHeight = item.height * scaleRatio
      const x = padding.value
      const y = currentY

      drawImageItem(ctx, item, x, y, drawWidth, drawHeight, index)

      currentY += drawHeight + gap.value
    })
  } else {
    textList.value.forEach((item, index) => {
      const x = padding.value
      const w2 = contentWidth.value
      
      const lineHeight = textFontSize.value * textLineHeight.value
      const charsPerLine = Math.floor((w2 - 40) / (textFontSize.value * 0.6))
      const lines = Math.ceil(item.content.length / charsPerLine)
      const drawHeight = Math.max(lineHeight * lines + 32, 60)
      const y = currentY

      drawTextItem(ctx, item, x, y, w2, drawHeight, index)

      currentY += drawHeight + gap.value
    })
  }
}

const drawImageItem = (
  ctx: CanvasRenderingContext2D,
  item: ImageItem,
  x: number,
  y: number,
  w: number,
  h: number,
  index: number
) => {
  if (shadowSize.value > 0) {
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
    ctx.shadowBlur = shadowSize.value
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = shadowSize.value / 2
  }

  if (borderRadius.value > 0) {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, borderRadius.value)
    ctx.clip()
  }

  if (item.img) {
    ctx.drawImage(item.img, x, y, w, h)
  }

  if (borderRadius.value > 0 || shadowSize.value > 0) {
    ctx.restore()
  }

  if (showNumber.value) {
    drawNumber(ctx, index + 1, x, y, w, h)
  }

  if (showBorder.value && borderWidth.value > 0) {
    ctx.save()
    ctx.strokeStyle = borderColor.value
    ctx.lineWidth = borderWidth.value
    if (borderRadius.value > 0) {
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, borderRadius.value)
      ctx.stroke()
    } else {
      ctx.strokeRect(x, y, w, h)
    }
    ctx.restore()
  }
}

const drawTextItem = (
  ctx: CanvasRenderingContext2D,
  item: TextItem,
  x: number,
  y: number,
  w: number,
  h: number,
  index: number
) => {
  if (shadowSize.value > 0) {
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
    ctx.shadowBlur = shadowSize.value
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = shadowSize.value / 2
  }

  if (borderRadius.value > 0) {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, borderRadius.value)
    ctx.clip()
  }

  ctx.fillStyle = textBgColor.value
  ctx.fillRect(x, y, w, h)

  if (borderRadius.value > 0 || shadowSize.value > 0) {
    ctx.restore()
  }

  ctx.save()
  ctx.font = `${textFontSize.value}px Arial, "Microsoft YaHei", "PingFang SC", sans-serif`
  ctx.fillStyle = textColor.value
  ctx.textBaseline = 'top'

  const lineHeight = textFontSize.value * textLineHeight.value
  const charsPerLine = Math.floor((w - 40) / (textFontSize.value * 0.6))
  const content = item.content
  const lines: string[] = []

  for (let i = 0; i < content.length; i += charsPerLine) {
    lines.push(content.slice(i, i + charsPerLine))
  }

  const totalTextHeight = lines.length * lineHeight
  const startY = y + (h - totalTextHeight) / 2
  const paddingX = 20

  lines.forEach((line, i) => {
    let drawX = x + paddingX
    const drawY = startY + i * lineHeight

    if (textAlign.value === 'center') {
      const metrics = ctx.measureText(line)
      drawX = x + w / 2 - metrics.width / 2
    } else if (textAlign.value === 'right') {
      const metrics = ctx.measureText(line)
      drawX = x + w - paddingX - metrics.width
    }

    ctx.fillText(line, drawX, drawY)
  })

  ctx.restore()

  if (showNumber.value) {
    drawNumber(ctx, index + 1, x, y, w, h)
  }
}

const drawNumber = (
  ctx: CanvasRenderingContext2D,
  num: number,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  ctx.save()
  ctx.font = `bold ${numberSize.value}px Arial, "Microsoft YaHei", sans-serif`
  ctx.fillStyle = numberColor.value
  ctx.textBaseline = 'top'

  const text = num.toString()
  const metrics = ctx.measureText(text)
  const textW = metrics.width
  const textH = numberSize.value
  const margin = 12

  let drawX = x + margin
  let drawY = y + margin

  switch (numberPosition.value) {
    case 'top-right':
      drawX = x + w - textW - margin
      drawY = y + margin
      break
    case 'bottom-left':
      drawX = x + margin
      drawY = y + h - textH - margin
      break
    case 'bottom-right':
      drawX = x + w - textW - margin
      drawY = y + h - textH - margin
      break
  }

  const pad = 6
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.beginPath()
  ctx.roundRect(drawX - pad, drawY - pad, textW + pad * 2, textH + pad * 2, 6)
  ctx.fill()

  ctx.fillStyle = numberColor.value
  ctx.fillText(text, drawX, drawY)
  ctx.restore()
}

const downloadImage = () => {
  if (!hasContent.value) return

  downloading.value = true

  setTimeout(() => {
    try {
      const exportCanvas = document.createElement('canvas')
      const w = finalWidth.value
      const h = finalHeight.value
      exportCanvas.width = w
      exportCanvas.height = h
      const ctx = exportCanvas.getContext('2d')
      if (!ctx) return

      ctx.fillStyle = bgColor.value
      ctx.fillRect(0, 0, w, h)

      let currentY = padding.value

      if (currentMode.value === 'image') {
        imageList.value.forEach((item, index) => {
          const scaleRatio = contentWidth.value / item.width
          const drawWidth = contentWidth.value
          const drawHeight = item.height * scaleRatio
          const x = padding.value
          const y = currentY

          drawImageItem(ctx, item, x, y, drawWidth, drawHeight, index)

          currentY += drawHeight + gap.value
        })
      } else {
        textList.value.forEach((item, index) => {
          const x = padding.value
          const w2 = contentWidth.value
          
          const lineHeight = textFontSize.value * textLineHeight.value
          const charsPerLine = Math.floor((w2 - 40) / (textFontSize.value * 0.6))
          const lines = Math.ceil(item.content.length / charsPerLine)
          const drawHeight = Math.max(lineHeight * lines + 32, 60)
          const y = currentY

          drawTextItem(ctx, item, x, y, w2, drawHeight, index)

          currentY += drawHeight + gap.value
        })
      }

      const link = document.createElement('a')
      link.download = `台词拼图_${Date.now()}.png`
      link.href = exportCanvas.toDataURL('image/png')
      link.click()

      downloading.value = false
      ElMessage.success('拼图下载成功！')
    } catch (e) {
      console.error('Download failed:', e)
      downloading.value = false
      ElMessage.error('拼图下载失败，请重试')
    }
  }, 100)
}

watch(
  [
    currentMode,
    imageList,
    textList,
    widthMode,
    customWidth,
    gap,
    padding,
    borderRadius,
    shadowSize,
    bgColor,
    showNumber,
    numberPosition,
    numberSize,
    numberColor,
    showBorder,
    borderWidth,
    borderColor,
    textFontSize,
    textColor,
    textBgColor,
    textLineHeight,
    textAlign
  ],
  () => {
    if (hasContent.value) {
      nextTick(() => drawPuzzle())
    }
  },
  { deep: true }
)

watch(currentMode, () => {
  nextTick(() => drawPuzzle())
})
</script>

<style scoped>
.subtitle-puzzle-maker {
  max-width: 1400px;
  margin: 0 auto;
}

.intro-card {
  margin-bottom: 24px;
}

.intro-content {
  padding: 8px 0;
}

.intro-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
}

.intro-desc {
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.intro-desc p {
  margin: 0;
}

.mode-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.mode-tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-badge {
  position: absolute;
  top: -8px;
  right: 12px;
  padding: 2px 8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(238, 90, 90, 0.3);
}

.mode-tab:hover {
  border-color: #93c5fd;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.mode-tab.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  box-shadow: 0 0 0 4px rgba(22, 93, 255, 0.1);
}

.mode-tab .el-icon {
  color: #606266;
}

.mode-tab.active .el-icon {
  color: #165DFF;
}

.mode-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mode-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.mode-desc {
  font-size: 12px;
  color: #909399;
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
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
  padding: 20px;
}

.puzzle-preview-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.preview-canvas {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #909399;
  padding: 80px 0;
}

.preview-placeholder .el-icon {
  font-size: 64px;
}

.preview-info {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  flex-wrap: wrap;
}

.upload-card,
.text-card {
  margin-bottom: 24px;
}

.upload-area,
.text-input-area {
  padding: 20px 0;
}

.input-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #166534;
}

.input-tip kbd {
  padding: 2px 6px;
  background: #fff;
  border: 1px solid #86efac;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  font-weight: 500;
  margin: 0 2px;
}

.text-input :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
}

.image-uploader :deep(.el-upload-dragger) {
  width: 100%;
  padding: 30px 20px;
}

.image-uploader :deep(.el-upload) {
  width: 100%;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.input-hint {
  font-size: 12px;
  color: #909399;
}

.image-list,
.text-list {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #606266;
}

.image-drag-list,
.text-drag-list {
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.image-item,
.text-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: move;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.image-item:hover,
.text-item:hover {
  background: #f0f5ff;
  border-color: #b3d8ff;
}

.ghost-item {
  opacity: 0.5;
  background: #e6f4ff !important;
  border-color: #409eff !important;
}

.item-index {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #409eff 0%, #165DFF 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.item-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name,
.item-text {
  font-size: 13px;
  color: #303133;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-text {
  line-height: 1.4;
}

.item-size {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

.item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
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
  margin-top: 24px;
  margin-bottom: 24px;
}

.settings-form {
  padding: 8px 0;
}

.text-style-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.color-presets {
  display: inline-flex;
  gap: 8px;
  margin-left: 12px;
  vertical-align: middle;
}

.color-preset {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
}

.color-preset:hover {
  transform: scale(1.1);
  border-color: #409eff;
}

.number-settings,
.border-settings {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #ebeef5;
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

.mt-2 {
  margin-top: 8px;
}

@media (max-width: 992px) {
  .el-col {
    width: 100% !important;
  }
  
  .mode-tabs {
    grid-template-columns: 1fr;
  }
}
</style>
