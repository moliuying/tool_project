<template>
  <div class="image-watermark">
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
        <el-step title="上传图片" description="选择需要添加水印的图片" />
        <el-step title="设置水印" description="自定义水印文字、样式和位置" />
        <el-step title="预览下载" description="实时预览效果并下载图片" />
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
            <canvas
              ref="canvas"
              class="preview-canvas"
              @mousedown="startDrag"
              @mousemove="onDrag"
              @mouseup="endDrag"
              @mouseleave="endDrag"
            />
            <div v-if="!sourceImage" class="preview-placeholder">
              <el-icon><Picture /></el-icon>
              <span>请先上传图片</span>
            </div>
          </div>

          <div class="preview-info" v-if="sourceImage">
            <el-tag size="small">原图尺寸: {{ imageWidth }} x {{ imageHeight }}</el-tag>
            <el-tag size="small" type="info">输出格式: PNG</el-tag>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card class="upload-card" v-if="!sourceImage">
          <template #header>
            <div class="card-header">
              <el-icon :size="20" color="#165DFF">
                <Upload />
              </el-icon>
              <span>上传图片</span>
              <el-tag size="small" type="info" class="header-tag">支持 JPG、PNG、WEBP</el-tag>
            </div>
          </template>
          <div class="upload-area">
            <el-upload
              ref="uploadRef"
              drag
              :auto-upload="false"
              :limit="1"
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
                  支持 JPG、PNG、WEBP 格式，文件大小建议不超过 10MB
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
            <span>所有操作均在浏览器本地完成，图片不会上传到服务器，保障您的隐私安全</span>
          </div>
        </el-card>

        <template v-if="sourceImage">
          <el-card class="settings-card">
            <template #header>
              <div class="card-header">
                <el-icon :size="20" color="#165DFF">
                  <Setting />
                </el-icon>
                <span>水印设置</span>
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
                <el-form-item label="水印文字">
                  <el-input
                    v-model="watermarkText"
                    placeholder="请输入水印文字，如：仅用于XX业务办理"
                    type="textarea"
                    :rows="2"
                    maxlength="100"
                    show-word-limit
                  />
                  <div class="watermark-tips">
                    <el-alert type="info" :closable="false" show-icon>
                      <template #title>
                        <div class="tips-content">
                          <div class="tips-title">
                            <el-icon :size="16"><Warning /></el-icon>
                            <span>如何写好防盗用水印？</span>
                          </div>
                          <div class="tips-section">
                            <div class="tips-subtitle">✅ 推荐写法（包含三要素）：</div>
                            <div class="tips-examples good">
                              <span class="example-tag good">仅用于支付宝实名认证 他用无效</span>
                              <span class="example-tag good">仅限2024年入职XX公司使用</span>
                              <span class="example-tag good">办理XX银行贷款专用 再次复印无效</span>
                            </div>
                          </div>
                          <div class="tips-section">
                            <div class="tips-subtitle">❌ 避免这样写（信息不完整）：</div>
                            <div class="tips-examples bad">
                              <span class="example-tag bad">仅供使用</span>
                              <span class="example-tag bad">复印件无效</span>
                            </div>
                          </div>
                          <div class="tips-principles">
                            <div class="principle-item">
                              <span class="principle-number">1</span>
                              <span class="principle-text"><strong>明确用途</strong> - 说明具体用于什么业务</span>
                            </div>
                            <div class="principle-item">
                              <span class="principle-number">2</span>
                              <span class="principle-text"><strong>限定范围</strong> - 注明使用单位或平台</span>
                            </div>
                            <div class="principle-item">
                              <span class="principle-number">3</span>
                              <span class="principle-text"><strong>声明无效</strong> - 添加"他用无效"等声明</span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-alert>
                  </div>
                </el-form-item>

                <el-form-item label="场景模板">
                  <el-tabs v-model="activeTemplateTab" size="small" class="template-tabs">
                    <el-tab-pane label="🏢 平台认证" name="platform">
                      <div class="template-grid">
                        <div
                          v-for="tpl in platformTemplates"
                          :key="tpl.text"
                          class="template-card"
                          @click="applyTemplate(tpl.text)"
                        >
                          <div class="template-text">{{ tpl.text }}</div>
                          <div class="template-desc">{{ tpl.desc }}</div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="📅 日期限定" name="date">
                      <div class="template-grid">
                        <div
                          v-for="tpl in dateTemplates"
                          :key="tpl.text"
                          class="template-card"
                          @click="applyTemplate(tpl.text)"
                        >
                          <div class="template-text">{{ tpl.text }}</div>
                          <div class="template-desc">{{ tpl.desc }}</div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="🎯 专用声明" name="special">
                      <div class="template-grid">
                        <div
                          v-for="tpl in specialTemplates"
                          :key="tpl.text"
                          class="template-card"
                          @click="applyTemplate(tpl.text)"
                        >
                          <div class="template-text">{{ tpl.text }}</div>
                          <div class="template-desc">{{ tpl.desc }}</div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="💾 我的收藏" name="custom">
                      <div class="custom-template-header">
                        <span class="custom-tip">点击模板可直接应用</span>
                        <el-button size="small" text @click="saveTemplate">
                          <el-icon><Plus /></el-icon>保存当前文字
                        </el-button>
                      </div>
                      <div class="template-list" v-if="customTemplates.length > 0">
                        <el-tag
                          v-for="tpl in customTemplates"
                          :key="tpl"
                          class="template-tag"
                          @click="applyTemplate(tpl)"
                          closable
                          @close="deleteTemplate(tpl)"
                        >
                          {{ tpl }}
                        </el-tag>
                      </div>
                      <el-empty v-else description="暂无收藏模板" :image-size="80" />
                    </el-tab-pane>
                  </el-tabs>
                </el-form-item>

                <el-divider />

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="字体大小">
                      <el-slider v-model="fontSize" :min="12" :max="120" show-input />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="透明度">
                      <el-slider v-model="opacity" :min="10" :max="100" show-input :format-tooltip="val => val + '%'" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="字体颜色">
                      <el-color-picker v-model="fontColor" show-alpha />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="旋转角度">
                      <el-slider v-model="rotation" :min="-90" :max="90" show-input :format-tooltip="val => val + '°'" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="水印模式">
                  <el-radio-group v-model="watermarkMode" size="small">
                    <el-radio-button value="single">单个水印</el-radio-button>
                    <el-radio-button value="tile">平铺水印</el-radio-button>
                    <el-radio-button value="diagonal">对角线</el-radio-button>
                  </el-radio-group>
                </el-form-item>

                <template v-if="watermarkMode === 'single'">
                  <el-form-item label="水印位置">
                    <div class="position-grid">
                      <div
                        v-for="pos in positions"
                        :key="pos.value"
                        class="position-item"
                        :class="{ active: position === pos.value }"
                        @click="position = pos.value"
                      >
                        <el-icon :size="16">{{ pos.icon }}</el-icon>
                        <span>{{ pos.label }}</span>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="边距">
                    <el-slider v-model="margin" :min="10" :max="100" show-input />
                  </el-form-item>
                </template>

                <template v-if="watermarkMode === 'tile'">
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="水平间距">
                        <el-slider v-model="tileGapX" :min="50" :max="300" show-input />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="垂直间距">
                        <el-slider v-model="tileGapY" :min="50" :max="300" show-input />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </el-form>
            </div>
          </el-card>

          <el-card class="action-card">
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="downloadImage" :loading="downloading">
                <el-icon><Download /></el-icon>
                下载带水印图片
              </el-button>
            </div>
            <el-alert type="info" :closable="false" class="download-tip">
              <template #title>
                <span>下载说明：图片将以 PNG 格式保存，保留透明通道。所有处理均在本地完成，不会上传任何数据。</span>
              </template>
            </el-alert>
          </el-card>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import {
  InfoFilled,
  View,
  Upload,
  UploadFilled,
  MagicStick,
  Lock,
  Setting,
  Plus,
  Download,
  Picture,
  Document,
  Tickets,
  Postcard,
  Stamp,
  TopLeft,
  Top,
  TopRight,
  Left,
  Cpu,
  Right,
  BottomLeft,
  Bottom,
  BottomRight,
  Warning
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'

const uploadRef = ref()
const canvas = ref<HTMLCanvasElement | null>(null)
const previewContainer = ref<HTMLDivElement | null>(null)

const sourceImage = ref<string>('')
const imageWidth = ref(0)
const imageHeight = ref(0)
const downloading = ref(false)

const watermarkText = ref('仅用于业务办理 他用无效')
const fontSize = ref(32)
const opacity = ref(30)
const fontColor = ref('#ff0000')
const rotation = ref(-30)
const watermarkMode = ref<'single' | 'tile' | 'diagonal'>('diagonal')
const position = ref('center')
const margin = ref(30)
const tileGapX = ref(150)
const tileGapY = ref(150)

const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

const activeTemplateTab = ref('platform')

interface TemplateItem {
  text: string
  desc: string
}

const platformTemplates: TemplateItem[] = [
  { text: '仅用于支付宝实名认证 他用无效', desc: '格式：平台 + 用途 + 声明' },
  { text: '微信绑定账号专用 再次复印无效', desc: '格式：平台 + 专用 + 声明' },
  { text: 'QQ账号申诉使用 其他用途无效', desc: '格式：平台 + 用途 + 声明' },
  { text: '淘宝开店认证使用 他用无效', desc: '格式：平台 + 用途 + 声明' },
  { text: '抖音账号实名认证 专用', desc: '格式：平台 + 用途 + 专用' },
  { text: '京东金融开户使用 再次复印无效', desc: '格式：平台 + 用途 + 声明' }
]

const dateTemplates: TemplateItem[] = [
  { text: '仅限2024年6月办理入职使用', desc: '格式：日期 + 用途' },
  { text: '2024.06.05 办理居住证专用', desc: '格式：日期 + 用途 + 专用' },
  { text: '有效期至2024.12.31 逾期无效', desc: '格式：有效期 + 声明' },
  { text: '2024年第二季度 社保开户使用', desc: '格式：时间段 + 用途' },
  { text: '仅用于2024年6月贷款审批', desc: '格式：日期 + 具体用途' },
  { text: '2024年6月5日 仅限本次使用', desc: '格式：日期 + 仅限本次' }
]

const specialTemplates: TemplateItem[] = [
  { text: 'XX公司入职专用 再次复印无效', desc: '格式：公司 + 专用 + 声明' },
  { text: '办理XX银行信用卡 他用无效', desc: '格式：机构 + 业务 + 声明' },
  { text: '房屋租赁备案使用 其他用途无效', desc: '格式：具体业务 + 声明' },
  { text: '车辆过户专用 仅供本次使用', desc: '格式：业务 + 专用 + 限定' },
  { text: '公积金提取专用 再次复印无效', desc: '格式：业务 + 专用 + 声明' },
  { text: '专利申请代理使用 他用无效', desc: '格式：业务 + 用途 + 声明' }
]

const customTemplates = ref<string[]>([
  '仅用于XX业务办理 他用无效',
  '再次复印无效'
])

const scenes = [
  { name: '身份证', icon: 'Document', color: '#409eff' },
  { name: '驾驶证', icon: 'Tickets', color: '#67c23a' },
  { name: '护照', icon: 'Postcard', color: '#e6a23c' },
  { name: '营业执照', icon: 'Stamp', color: '#f56c6c' }
]

const positions = [
  { value: 'top-left', label: '左上', icon: 'TopLeft' },
  { value: 'top-center', label: '顶部', icon: 'Top' },
  { value: 'top-right', label: '右上', icon: 'TopRight' },
  { value: 'center-left', label: '左中', icon: 'Left' },
  { value: 'center', label: '居中', icon: 'Cpu' },
  { value: 'center-right', label: '右中', icon: 'Right' },
  { value: 'bottom-left', label: '左下', icon: 'BottomLeft' },
  { value: 'bottom-center', label: '底部', icon: 'Bottom' },
  { value: 'bottom-right', label: '右下', icon: 'BottomRight' }
]

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
      sourceImage.value = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        imageWidth.value = img.width
        imageHeight.value = img.height
        nextTick(() => drawWatermark())
      }
      img.src = sourceImage.value
    }
    reader.readAsDataURL(file.raw)
  } catch (e) {
    console.error('Failed to load image:', e)
    ElMessage.error('图片加载失败，请检查文件是否损坏')
  }
}

const handleExceed = () => {
  ElMessage.warning('请先删除已上传的图片再重新上传')
}

const handleReupload = () => {
  sourceImage.value = ''
  imageWidth.value = 0
  imageHeight.value = 0
}

const resetSettings = () => {
  watermarkText.value = '仅用于业务办理 他用无效'
  fontSize.value = 32
  opacity.value = 30
  fontColor.value = '#ff0000'
  rotation.value = -30
  watermarkMode.value = 'diagonal'
  position.value = 'center'
  margin.value = 30
  tileGapX.value = 150
  tileGapY.value = 150
}

const applyTemplate = (tpl: string) => {
  watermarkText.value = tpl
}

const saveTemplate = () => {
  if (!watermarkText.value.trim()) {
    ElMessage.warning('请先输入水印文字')
    return
  }
  if (customTemplates.value.includes(watermarkText.value)) {
    ElMessage.warning('该模板已存在')
    return
  }
  customTemplates.value.push(watermarkText.value)
  activeTemplateTab.value = 'custom'
  ElMessage.success('模板已保存到"我的收藏"')
}

const deleteTemplate = (tpl: string) => {
  const index = customTemplates.value.indexOf(tpl)
  if (index > -1) {
    customTemplates.value.splice(index, 1)
  }
}

const startDrag = (e: MouseEvent) => {
  if (watermarkMode.value !== 'single') return
  isDragging.value = true
  dragOffset.value = { x: e.offsetX, y: e.offsetY }
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  // Handle drag to move watermark position
}

const endDrag = () => {
  isDragging.value = false
}

const drawWatermark = () => {
  if (!canvas.value || !sourceImage.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const w = img.width
    const h = img.height

    const maxWidth = previewContainer.value?.clientWidth || 600
    const scale = Math.min(1, maxWidth / w)
    canvas.value!.width = w * scale
    canvas.value!.height = h * scale

    ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
    ctx.scale(scale, scale)

    ctx.drawImage(img, 0, 0, w, h)

    ctx.save()
    const alpha = opacity.value / 100
    ctx.globalAlpha = alpha
    ctx.font = `bold ${fontSize.value}px Arial, "Microsoft YaHei", sans-serif`
    ctx.fillStyle = fontColor.value
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const text = watermarkText.value || '水印文字'
    const textMetrics = ctx.measureText(text)
    const textWidth = textMetrics.width
    const textHeight = fontSize.value

    if (watermarkMode.value === 'diagonal') {
      const diagonal = Math.sqrt(w * w + h * h)
      const numX = Math.ceil(diagonal / (textWidth + tileGapX.value)) + 2
      const numY = Math.ceil(diagonal / (textHeight + tileGapY.value)) + 2

      ctx.translate(w / 2, h / 2)
      ctx.rotate((rotation.value * Math.PI) / 180)

      for (let i = -numX; i <= numX; i++) {
        for (let j = -numY; j <= numY; j++) {
          ctx.fillText(
            text,
            i * (textWidth + tileGapX.value),
            j * (textHeight + tileGapY.value)
          )
        }
      }
    } else if (watermarkMode.value === 'tile') {
      const numX = Math.ceil(w / (textWidth + tileGapX.value)) + 1
      const numY = Math.ceil(h / (textHeight + tileGapY.value)) + 1

      ctx.translate(w / 2, h / 2)
      ctx.rotate((rotation.value * Math.PI) / 180)

      for (let i = -numX; i <= numX; i++) {
        for (let j = -numY; j <= numY; j++) {
          ctx.fillText(
            text,
            i * (textWidth + tileGapX.value),
            j * (textHeight + tileGapY.value)
          )
        }
      }
    } else {
      let x = w / 2
      let y = h / 2
      const m = margin.value

      switch (position.value) {
        case 'top-left':
          x = textWidth / 2 + m
          y = textHeight / 2 + m
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
          break
        case 'top-center':
          x = w / 2
          y = textHeight / 2 + m
          ctx.textBaseline = 'top'
          break
        case 'top-right':
          x = w - textWidth / 2 - m
          y = textHeight / 2 + m
          ctx.textAlign = 'right'
          ctx.textBaseline = 'top'
          break
        case 'center-left':
          x = textWidth / 2 + m
          y = h / 2
          ctx.textAlign = 'left'
          break
        case 'center':
          x = w / 2
          y = h / 2
          break
        case 'center-right':
          x = w - textWidth / 2 - m
          y = h / 2
          ctx.textAlign = 'right'
          break
        case 'bottom-left':
          x = textWidth / 2 + m
          y = h - textHeight / 2 - m
          ctx.textAlign = 'left'
          ctx.textBaseline = 'bottom'
          break
        case 'bottom-center':
          x = w / 2
          y = h - textHeight / 2 - m
          ctx.textBaseline = 'bottom'
          break
        case 'bottom-right':
          x = w - textWidth / 2 - m
          y = h - textHeight / 2 - m
          ctx.textAlign = 'right'
          ctx.textBaseline = 'bottom'
          break
      }

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotation.value * Math.PI) / 180)
      ctx.fillText(text, 0, 0)
      ctx.restore()
    }

    ctx.restore()
  }
  img.src = sourceImage.value
}

const downloadImage = () => {
  if (!canvas.value || !sourceImage.value) return

  downloading.value = true

  setTimeout(() => {
    try {
      const originalCanvas = document.createElement('canvas')
      const img = new Image()
      img.onload = () => {
        originalCanvas.width = img.width
        originalCanvas.height = img.height
        const oCtx = originalCanvas.getContext('2d')
        if (!oCtx) return

        oCtx.drawImage(img, 0, 0)

        oCtx.save()
        const alpha = opacity.value / 100
        oCtx.globalAlpha = alpha
        oCtx.font = `bold ${fontSize.value}px Arial, "Microsoft YaHei", sans-serif`
        oCtx.fillStyle = fontColor.value
        oCtx.textAlign = 'center'
        oCtx.textBaseline = 'middle'

        const text = watermarkText.value || '水印文字'
        const textMetrics = oCtx.measureText(text)
        const textWidth = textMetrics.width
        const textHeight = fontSize.value
        const w = img.width
        const h = img.height

        if (watermarkMode.value === 'diagonal') {
          const diagonal = Math.sqrt(w * w + h * h)
          const numX = Math.ceil(diagonal / (textWidth + tileGapX.value)) + 2
          const numY = Math.ceil(diagonal / (textHeight + tileGapY.value)) + 2

          oCtx.translate(w / 2, h / 2)
          oCtx.rotate((rotation.value * Math.PI) / 180)

          for (let i = -numX; i <= numX; i++) {
            for (let j = -numY; j <= numY; j++) {
              oCtx.fillText(
                text,
                i * (textWidth + tileGapX.value),
                j * (textHeight + tileGapY.value)
              )
            }
          }
        } else if (watermarkMode.value === 'tile') {
          const numX = Math.ceil(w / (textWidth + tileGapX.value)) + 1
          const numY = Math.ceil(h / (textHeight + tileGapY.value)) + 1

          oCtx.translate(w / 2, h / 2)
          oCtx.rotate((rotation.value * Math.PI) / 180)

          for (let i = -numX; i <= numX; i++) {
            for (let j = -numY; j <= numY; j++) {
              oCtx.fillText(
                text,
                i * (textWidth + tileGapX.value),
                j * (textHeight + tileGapY.value)
              )
            }
          }
        } else {
          let x = w / 2
          let y = h / 2
          const m = margin.value

          switch (position.value) {
            case 'top-left':
              x = textWidth / 2 + m
              y = textHeight / 2 + m
              oCtx.textAlign = 'left'
              oCtx.textBaseline = 'top'
              break
            case 'top-center':
              x = w / 2
              y = textHeight / 2 + m
              oCtx.textBaseline = 'top'
              break
            case 'top-right':
              x = w - textWidth / 2 - m
              y = textHeight / 2 + m
              oCtx.textAlign = 'right'
              oCtx.textBaseline = 'top'
              break
            case 'center-left':
              x = textWidth / 2 + m
              y = h / 2
              oCtx.textAlign = 'left'
              break
            case 'center':
              x = w / 2
              y = h / 2
              break
            case 'center-right':
              x = w - textWidth / 2 - m
              y = h / 2
              oCtx.textAlign = 'right'
              break
            case 'bottom-left':
              x = textWidth / 2 + m
              y = h - textHeight / 2 - m
              oCtx.textAlign = 'left'
              oCtx.textBaseline = 'bottom'
              break
            case 'bottom-center':
              x = w / 2
              y = h - textHeight / 2 - m
              oCtx.textBaseline = 'bottom'
              break
            case 'bottom-right':
              x = w - textWidth / 2 - m
              y = h - textHeight / 2 - m
              oCtx.textAlign = 'right'
              oCtx.textBaseline = 'bottom'
              break
          }

          oCtx.save()
          oCtx.translate(x, y)
          oCtx.rotate((rotation.value * Math.PI) / 180)
          oCtx.fillText(text, 0, 0)
          oCtx.restore()
        }

        oCtx.restore()

        const link = document.createElement('a')
        link.download = `水印图片_${Date.now()}.png`
        link.href = originalCanvas.toDataURL('image/png')
        link.click()

        downloading.value = false
        ElMessage.success('图片下载成功！')
      }
      img.src = sourceImage.value
    } catch (e) {
      console.error('Download failed:', e)
      downloading.value = false
      ElMessage.error('图片下载失败，请重试')
    }
  }, 100)
}

watch(
  [
    watermarkText,
    fontSize,
    opacity,
    fontColor,
    rotation,
    watermarkMode,
    position,
    margin,
    tileGapX,
    tileGapY,
    sourceImage
  ],
  () => {
    if (sourceImage.value) {
      drawWatermark()
    }
  }
)

onMounted(() => {
  if (canvas.value && sourceImage.value) {
    drawWatermark()
  }
})
</script>

<style scoped>
.image-watermark {
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
}

.preview-canvas {
  max-width: 100%;
  max-height: 600px;
  cursor: move;
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

.preview-info {
  display: flex;
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

.template-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.template-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.template-tag:hover {
  transform: translateY(-1px);
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.position-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: #f5f7fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  color: #606266;
  border: 1px solid transparent;
}

.position-item:hover {
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.position-item.active {
  background: linear-gradient(135deg, #409eff 0%, #165DFF 100%);
  color: #fff;
  border-color: #165DFF;
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

.watermark-tips {
  margin-top: 12px;
}

.watermark-tips :deep(.el-alert__content) {
  width: 100%;
}

.tips-content {
  padding: 4px 0;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.tips-section {
  margin-bottom: 10px;
}

.tips-subtitle {
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.tips-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.example-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  line-height: 1.4;
}

.example-tag.good {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  color: #529e2e;
  border: 1px solid #b3e19d;
}

.example-tag.bad {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  color: #dd6161;
  border: 1px solid #fbc4c4;
}

.tips-principles {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px dashed #ebeef5;
}

.principle-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #606266;
}

.principle-number {
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #409eff 0%, #165DFF 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 1px;
}

.principle-text {
  line-height: 1.5;
}

.principle-text strong {
  color: #303133;
  font-weight: 600;
}

.template-tabs :deep(.el-tabs__header) {
  margin-bottom: 12px;
}

.template-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 4px;
}

.template-card {
  padding: 10px 12px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border-radius: 8px;
  border: 1px solid #ebeef5;
  cursor: pointer;
  transition: all 0.2s;
}

.template-card:hover {
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
  border-color: #409eff;
  transform: translateX(2px);
}

.template-text {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
  line-height: 1.4;
}

.template-desc {
  font-size: 11px;
  color: #909399;
}

.custom-template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.custom-tip {
  font-size: 12px;
  color: #909399;
}

.template-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.template-tag:hover {
  transform: translateY(-1px);
}

.template-tabs :deep(.el-empty) {
  padding: 20px 0;
}

@media (max-width: 992px) {
  .el-col {
    width: 100% !important;
  }
}
</style>
