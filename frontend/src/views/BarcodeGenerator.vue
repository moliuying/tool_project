<template>
  <div class="barcode-generator">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Grid />
          </el-icon>
          <span>条形码生成器</span>
          <el-tag size="small" type="success">快速生成可用条形码</el-tag>
        </div>
      </template>

      <div class="generator-container">
        <div class="input-section">
          <div class="section-title">
            <el-icon><Edit /></el-icon>
            <span>条码配置</span>
          </div>

          <el-form label-width="100px" label-position="left">
            <el-form-item label="条码内容">
              <el-input
                v-model="barcodeConfig.value"
                placeholder="请输入条码号，如: 6901234567892"
                size="large"
                clearable
                maxlength="80"
                show-word-limit
              >
                <template #append>
                  <el-button type="primary" @click="generateBarcode" :disabled="!barcodeConfig.value">
                    <el-icon><MagicStick /></el-icon>
                    生成
                  </el-button>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="条码格式">
              <el-select v-model="barcodeConfig.format" size="large" style="width: 100%;">
                <el-option-group v-for="group in formatGroups" :key="group.label" :label="group.label">
                  <el-option
                    v-for="fmt in group.options"
                    :key="fmt.value"
                    :label="fmt.label"
                    :value="fmt.value"
                  >
                    <span style="display: flex; align-items: center; gap: 8px;">
                      <span>{{ fmt.label }}</span>
                      <el-tag size="small" type="info" v-if="fmt.hint">{{ fmt.hint }}</el-tag>
                    </span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>

            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="条码高度">
                  <el-slider
                    v-model="barcodeConfig.height"
                    :min="40"
                    :max="200"
                    :step="10"
                    show-input
                    show-input-controls
                    input-size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="线条宽度">
                  <el-slider
                    v-model="barcodeConfig.width"
                    :min="1"
                    :max="5"
                    :step="0.5"
                    show-input
                    show-input-controls
                    input-size="small"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="边距">
                  <el-slider
                    v-model="barcodeConfig.margin"
                    :min="0"
                    :max="40"
                    :step="2"
                    show-input
                    show-input-controls
                    input-size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="字体大小">
                  <el-slider
                    v-model="barcodeConfig.fontSize"
                    :min="10"
                    :max="36"
                    :step="2"
                    show-input
                    show-input-controls
                    input-size="small"
                    :disabled="!barcodeConfig.displayValue"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="显示文字">
              <el-switch v-model="barcodeConfig.displayValue" />
              <span class="form-hint" style="margin-left: 12px;">在条码下方显示内容文字</span>
            </el-form-item>

            <el-form-item label="背景透明">
              <el-switch v-model="barcodeConfig.backgroundTransparent" />
              <span class="form-hint" style="margin-left: 12px;">下载 PNG 时背景透明</span>
            </el-form-item>

            <el-row :gutter="16" v-if="!barcodeConfig.backgroundTransparent">
              <el-col :span="12">
                <el-form-item label="背景颜色">
                  <el-color-picker v-model="barcodeConfig.background" show-alpha />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="线条颜色">
                  <el-color-picker v-model="barcodeConfig.lineColor" show-alpha />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-card class="preset-card" shadow="never">
            <template #header>
              <div class="preset-header">
                <el-icon :size="14" color="#165DFF"><MagicStick /></el-icon>
                <span>快速模板</span>
              </div>
            </template>
            <div class="preset-list">
              <div v-for="preset in presets" :key="preset.name" class="preset-item" @click="applyPreset(preset)">
                <div class="preset-icon" :class="preset.type">
                  <el-icon><Grid /></el-icon>
                </div>
                <span class="preset-name">{{ preset.name }}</span>
              </div>
            </div>
          </el-card>
        </div>

        <div class="preview-section">
          <div class="section-title">
            <el-icon><View /></el-icon>
            <span>预览效果</span>
          </div>

          <div class="preview-container" :class="{ 'bg-transparent': barcodeConfig.backgroundTransparent }">
            <div class="barcode-wrapper">
              <svg ref="barcodeSvgRef" class="barcode-svg barcode-svg-hidden"></svg>
              <img
                v-if="barcodeImgUrl"
                :src="barcodeImgUrl"
                class="barcode-img"
                alt="条形码图片"
              />
            </div>
            <div v-if="!barcodeGenerated" class="preview-placeholder">
              <el-icon><Grid /></el-icon>
              <span>请输入条码号并点击生成</span>
            </div>
          </div>

          <div v-if="barcodeGenerated" class="preview-tip">
            <el-icon size="14" color="#e6a23c"><InfoFilled /></el-icon>
            <span>移动端长按图片可保存到相册，或点击下方按钮下载</span>
          </div>

          <div class="preview-info" v-if="barcodeGenerated">
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="格式">{{ formatLabel }}</el-descriptions-item>
              <el-descriptions-item label="内容">{{ barcodeConfig.value }}</el-descriptions-item>
              <el-descriptions-item label="尺寸">{{ svgWidth }} x {{ svgHeight }} px</el-descriptions-item>
              <el-descriptions-item label="校验">
                <el-tag :type="validBarcode ? 'success' : 'danger'" size="small">
                  {{ validBarcode ? '有效' : '无效' }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="output-actions">
            <el-button type="primary" size="large" @click="downloadPng" :disabled="!barcodeGenerated">
              <el-icon><Picture /></el-icon>
              下载 PNG
            </el-button>
            <el-button type="success" size="large" @click="downloadSvg" :disabled="!barcodeGenerated">
              <el-icon><Download /></el-icon>
              下载 SVG
            </el-button>
            <el-button size="large" @click="copyBase64" :disabled="!barcodeGenerated">
              <el-icon><CopyDocument /></el-icon>
              复制图片
            </el-button>
            <el-button size="large" @click="resetConfig">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="format-guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="16" color="#165DFF">
            <Guide />
          </el-icon>
          <span>条码格式说明</span>
        </div>
      </template>
      <div class="format-cards">
        <div class="format-card" v-for="info in formatInfoList" :key="info.name">
          <div class="format-card-header">
            <el-icon :size="16" :color="info.color"><Tickets /></el-icon>
            <span class="format-card-name">{{ info.name }}</span>
          </div>
          <div class="format-card-desc">{{ info.desc }}</div>
          <div class="format-card-meta">
            <div class="meta-item">
              <span class="meta-label">字符</span>
              <span class="meta-value">{{ info.chars }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">长度</span>
              <span class="meta-value">{{ info.length }}</span>
            </div>
          </div>
          <div class="format-card-example">
            <span class="example-label">示例:</span>
            <code>{{ info.example }}</code>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="usage-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="16" color="#e6a23c">
            <InfoFilled />
          </el-icon>
          <span>使用场景指南</span>
        </div>
      </template>
      <div class="usage-cards">
        <div class="usage-card-item">
          <div class="usage-icon ecommerce">
            <el-icon><Goods /></el-icon>
          </div>
          <div class="usage-title">电商运营</div>
          <div class="usage-desc">为商品生成标准商品条码，用于商品管理、上架销售、订单追踪</div>
          <div class="usage-code">推荐格式：EAN-13、UPC</div>
        </div>

        <div class="usage-card-item">
          <div class="usage-icon warehouse">
            <el-icon><Box /></el-icon>
          </div>
          <div class="usage-title">仓储管理</div>
          <div class="usage-desc">快速生成库位条码、物料条码，配合扫码枪进行出入库和盘点</div>
          <div class="usage-code">推荐格式：CODE128、CODE39</div>
        </div>

        <div class="usage-card-item">
          <div class="usage-icon logistics">
            <el-icon><Van /></el-icon>
          </div>
          <div class="usage-title">物流标识</div>
          <div class="usage-desc">制作运单条码、箱唛条码，实现包裹追踪和分拣识别</div>
          <div class="usage-code">推荐格式：CODE128、ITF-14</div>
        </div>

        <div class="usage-card-item">
          <div class="usage-icon testing">
            <el-icon><Cpu /></el-icon>
          </div>
          <div class="usage-title">开发测试</div>
          <div class="usage-desc">生成各种测试条码，验证条码扫描设备和系统识别功能</div>
          <div class="usage-code">推荐格式：全部格式</div>
        </div>
      </div>
    </el-card>

    <el-card class="tips-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="16" color="#67c23a">
            <SuccessFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <div class="tips-content">
        <div class="tip-item">
          <el-icon color="#67c23a"><SuccessFilled /></el-icon>
          <span>输入条码内容，选择对应格式后点击「生成」按钮即可生成条形码图片</span>
        </div>
        <div class="tip-item">
          <el-icon color="#67c23a"><SuccessFilled /></el-icon>
          <span>支持多种条码格式：EAN-13、EAN-8、UPC、CODE128、CODE39、ITF-14、MSI、Codabar、Pharmacode 等</span>
        </div>
        <div class="tip-item">
          <el-icon color="#67c23a"><SuccessFilled /></el-icon>
          <span>可自定义条码高度、线条宽度、边距、颜色等参数，满足不同打印和显示需求</span>
        </div>
        <div class="tip-item">
          <el-icon color="#67c23a"><SuccessFilled /></el-icon>
          <span>支持导出 PNG（位图）和 SVG（矢量图）两种格式，SVG 适合高清打印场景</span>
        </div>
        <div class="tip-item">
          <el-icon color="#e6a23c"><Warning /></el-icon>
          <span>注意：每种条码格式对字符类型和长度有特定要求，输入不符合规范将无法生成有效条码</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import {
  Grid,
  Edit,
  View,
  MagicStick,
  Download,
  Refresh,
  InfoFilled,
  SuccessFilled,
  Warning,
  CopyDocument,
  Guide,
  Tickets,
  Goods,
  Box,
  Van,
  Cpu,
  Picture
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import JsBarcode from 'jsbarcode'

interface BarcodeConfig {
  value: string
  format: string
  height: number
  width: number
  margin: number
  fontSize: number
  displayValue: boolean
  background: string
  lineColor: string
  backgroundTransparent: boolean
}

const barcodeConfig = ref<BarcodeConfig>({
  value: '',
  format: 'CODE128',
  height: 100,
  width: 2,
  margin: 10,
  fontSize: 20,
  displayValue: true,
  background: '#ffffff',
  lineColor: '#000000',
  backgroundTransparent: false
})

const barcodeSvgRef = ref<SVGSVGElement | null>(null)
const barcodeImgUrl = ref('')
const barcodeGenerated = ref(false)
const validBarcode = ref(false)
const svgWidth = ref(0)
const svgHeight = ref(0)

const formatGroups = [
  {
    label: '通用商品条码',
    options: [
      { label: 'EAN-13 (国际商品条码)', value: 'EAN13', hint: '13位数字' },
      { label: 'EAN-8 (缩短版商品条码)', value: 'EAN8', hint: '8位数字' },
      { label: 'UPC-A (北美商品条码)', value: 'UPC', hint: '12位数字' },
      { label: 'UPC-E (缩短版UPC)', value: 'UPCE', hint: '6-8位数字' }
    ]
  },
  {
    label: '工业/物流条码',
    options: [
      { label: 'CODE128 (高密度)', value: 'CODE128', hint: '任意ASCII字符' },
      { label: 'CODE39', value: 'CODE39', hint: '字母数字' },
      { label: 'ITF-14 (交叉25码)', value: 'ITF14', hint: '14位数字' },
      { label: 'MSI', value: 'MSI', hint: '数字' },
      { label: 'Codabar (库德巴码)', value: 'codabar', hint: '数字和特殊符号' },
      { label: 'Pharmacode (医药码)', value: 'pharmacode', hint: '数字' }
    ]
  }
]

const formatLabel = computed(() => {
  for (const group of formatGroups) {
    const found = group.options.find((o) => o.value === barcodeConfig.value.format)
    if (found) return found.label.split(' ')[0]
  }
  return barcodeConfig.value.format
})

const formatInfoList = [
  { name: 'EAN-13', color: '#165DFF', desc: '国际通用商品条码，用于全球商品标识', chars: '0-9', length: '13位', example: '6901234567892' },
  { name: 'EAN-8', color: '#00b42a', desc: 'EAN-13的缩短版，用于小型商品包装', chars: '0-9', length: '8位', example: '69012348' },
  { name: 'UPC-A', color: '#722ed1', desc: '北美地区通用商品条码', chars: '0-9', length: '12位', example: '012345678905' },
  { name: 'CODE128', color: '#f53f3f', desc: '高密度条码，支持全ASCII字符集', chars: 'ASCII', length: '可变', example: 'ABC-1234' },
  { name: 'CODE39', color: '#ff7d00', desc: '工业常用条码，支持字母和数字', chars: 'A-Z 0-9 -.$/+%', length: '可变', example: 'CODE-39-EX' },
  { name: 'ITF-14', color: '#13c2c2', desc: '交叉25码，多用于仓储物流包装箱标识', chars: '0-9', length: '14位', example: '12345678901231' },
  { name: 'MSI', color: '#eb2f96', desc: '主要用于仓储管理和库存控制', chars: '0-9', length: '可变', example: '1234567' },
  { name: 'Codabar', color: '#fa8c16', desc: '库德巴码，常用于血库、图书馆等', chars: '0-9 A-D $ - : / . +', length: '可变', example: 'A12345B' },
  { name: 'Pharmacode', color: '#2f54eb', desc: '医药行业专用条码，用于药品包装标识', chars: '0-9', length: '可变', example: '1234' }
]

const presets = [
  { name: '商品条码(EAN13)', value: '6901234567892', format: 'EAN13', type: 'ecommerce' },
  { name: '小型商品(EAN8)', value: '69012348', format: 'EAN8', type: 'ecommerce' },
  { name: '北美商品(UPC)', value: '012345678905', format: 'UPC', type: 'ecommerce' },
  { name: '物流条码(128)', value: 'LOG20240001', format: 'CODE128', type: 'logistics' },
  { name: '仓储条码(39)', value: 'WH-A01-001', format: 'CODE39', type: 'warehouse' },
  { name: '箱码(ITF14)', value: '12345678901231', format: 'ITF14', type: 'warehouse' }
]

const generateBarcode = async () => {
  if (!barcodeConfig.value.value || !barcodeSvgRef.value) {
    ElMessage.warning('请输入条码内容')
    return
  }

  try {
    await nextTick()
    const options: any = {
      format: barcodeConfig.value.format,
      height: barcodeConfig.value.height,
      width: barcodeConfig.value.width,
      margin: barcodeConfig.value.margin,
      fontSize: barcodeConfig.value.fontSize,
      displayValue: barcodeConfig.value.displayValue,
      background: barcodeConfig.value.backgroundTransparent ? 'transparent' : barcodeConfig.value.background,
      lineColor: barcodeConfig.value.lineColor
    }

    JsBarcode(barcodeSvgRef.value, barcodeConfig.value.value, options)
    barcodeGenerated.value = true
    validBarcode.value = true

    await nextTick()
    if (barcodeSvgRef.value) {
      const bbox = barcodeSvgRef.value.getBoundingClientRect()
      svgWidth.value = Math.round(bbox.width)
      svgHeight.value = Math.round(bbox.height)

      const svgData = new XMLSerializer().serializeToString(barcodeSvgRef.value)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      await new Promise<void>((resolve) => {
        img.onload = () => {
          canvas.width = img.width * 2
          canvas.height = img.height * 2
          if (ctx) {
            ctx.scale(2, 2)
            if (barcodeConfig.value.backgroundTransparent) {
              ctx.clearRect(0, 0, canvas.width, canvas.height)
            } else {
              ctx.fillStyle = barcodeConfig.value.background
              ctx.fillRect(0, 0, canvas.width, canvas.height)
            }
            ctx.drawImage(img, 0, 0)
          }
          barcodeImgUrl.value = canvas.toDataURL('image/png')
          URL.revokeObjectURL(url)
          resolve()
        }
        img.src = url
      })
    }

    ElMessage.success('条形码生成成功！')
  } catch (error: any) {
    console.error('Barcode generation error:', error)
    barcodeGenerated.value = false
    validBarcode.value = false
    barcodeImgUrl.value = ''
    ElMessage.error(`生成失败：${error.message || '条码内容不符合格式要求'}`)
  }
}

const downloadPng = () => {
  if (barcodeImgUrl.value) {
    const link = document.createElement('a')
    link.download = `barcode_${barcodeConfig.value.value}_${barcodeConfig.value.format}.png`
    link.href = barcodeImgUrl.value
    link.click()
    ElMessage.success('PNG 下载成功！')
    return
  }

  if (!barcodeSvgRef.value) return

  const svgData = new XMLSerializer().serializeToString(barcodeSvgRef.value)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()

  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  img.onload = () => {
    canvas.width = img.width * 2
    canvas.height = img.height * 2
    if (ctx) {
      ctx.scale(2, 2)
      if (barcodeConfig.value.backgroundTransparent) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.fillStyle = barcodeConfig.value.background
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0)
    }

    const pngUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `barcode_${barcodeConfig.value.value}_${barcodeConfig.value.format}.png`
    link.href = pngUrl
    link.click()

    URL.revokeObjectURL(url)
    ElMessage.success('PNG 下载成功！')
  }

  img.src = url
}

const downloadSvg = () => {
  if (!barcodeSvgRef.value) return

  const svgData = new XMLSerializer().serializeToString(barcodeSvgRef.value)
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  const link = document.createElement('a')
  link.download = `barcode_${barcodeConfig.value.value}_${barcodeConfig.value.format}.svg`
  link.href = url
  link.click()

  URL.revokeObjectURL(url)
  ElMessage.success('SVG 下载成功！')
}

const copyBase64 = async () => {
  if (barcodeImgUrl.value) {
    try {
      const blob = await (await fetch(barcodeImgUrl.value)).blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ])
      ElMessage.success('图片已复制到剪贴板！')
      return
    } catch {
      try {
        await navigator.clipboard.writeText(barcodeImgUrl.value)
        ElMessage.success('Base64 已复制到剪贴板！')
        return
      } catch {
        // continue to SVG fallback
      }
    }
  }

  if (!barcodeSvgRef.value) return

  const svgData = new XMLSerializer().serializeToString(barcodeSvgRef.value)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()

  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  img.onload = async () => {
    canvas.width = img.width * 2
    canvas.height = img.height * 2
    if (ctx) {
      ctx.scale(2, 2)
      if (barcodeConfig.value.backgroundTransparent) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.fillStyle = barcodeConfig.value.background
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0)
    }

    const pngUrl = canvas.toDataURL('image/png')
    URL.revokeObjectURL(url)

    try {
      const blob = await (await fetch(pngUrl)).blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ])
      ElMessage.success('图片已复制到剪贴板！')
    } catch {
      try {
        await navigator.clipboard.writeText(pngUrl)
        ElMessage.success('Base64 已复制到剪贴板！')
      } catch {
        ElMessage.error('复制失败，请尝试下载图片')
      }
    }
  }

  img.src = url
}

const applyPreset = (preset: any) => {
  barcodeConfig.value.value = preset.value
  barcodeConfig.value.format = preset.format
  nextTick(() => generateBarcode())
}

const resetConfig = () => {
  barcodeConfig.value = {
    value: '',
    format: 'CODE128',
    height: 100,
    width: 2,
    margin: 10,
    fontSize: 20,
    displayValue: true,
    background: '#ffffff',
    lineColor: '#000000',
    backgroundTransparent: false
  }
  barcodeGenerated.value = false
  validBarcode.value = false
  barcodeImgUrl.value = ''
  if (barcodeSvgRef.value) {
    barcodeSvgRef.value.innerHTML = ''
  }
  ElMessage.success('已重置')
}

onMounted(() => {
  barcodeConfig.value.value = '6901234567892'
  barcodeConfig.value.format = 'EAN13'
  nextTick(() => generateBarcode())
})
</script>

<style scoped>
.barcode-generator {
  max-width: 1400px;
  margin: 0 auto;
}

.main-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.generator-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-hint {
  font-size: 13px;
  color: #909399;
}

.preset-card {
  border: 1px solid #ebeef5;
}

.preset-card :deep(.el-card__header) {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-bottom: none;
}

.preset-card :deep(.el-card__body) {
  padding: 16px;
}

.preset-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.preset-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ebeef5;
  background: #fafafa;
}

.preset-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #165DFF;
}

.preset-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}

.preset-icon.ecommerce {
  background: linear-gradient(135deg, #165DFF 0%, #4080ff 100%);
}

.preset-icon.logistics {
  background: linear-gradient(135deg, #00b42a 0%, #4caf50 100%);
}

.preset-icon.warehouse {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.preset-name {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
  text-align: center;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preview-container {
  min-height: 280px;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: repeating-conic-gradient(#f0f0f0 0% 25%, #ffffff 0% 50%) 50% / 20px 20px;
  position: relative;
  overflow: auto;
}

.preview-container.bg-transparent {
  background: repeating-conic-gradient(#e0e0e0 0% 25%, #ffffff 0% 50%) 50% / 16px 16px;
}

.barcode-wrapper {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  max-width: 100%;
}

.barcode-svg {
  display: block;
  max-width: 100%;
}

.barcode-svg-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.barcode-img {
  display: block;
  max-width: 100%;
  -webkit-touch-callout: default;
  touch-action: manipulation;
}

.preview-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: #fdf6ec;
  border: 1px solid #faecd8;
  border-radius: 8px;
  font-size: 13px;
  color: #e6a23c;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #909399;
  font-size: 14px;
}

.preview-placeholder .el-icon {
  font-size: 48px;
  color: #c0c4cc;
}

.preview-info {
  margin-top: -8px;
}

.output-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.format-guide-card {
  margin-bottom: 24px;
}

.format-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.format-card {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  transition: all 0.3s;
}

.format-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: #165DFF;
}

.format-card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.format-card-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.format-card-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 12px;
}

.format-card-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 11px;
  color: #909399;
}

.meta-value {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  font-family: Monaco, Menlo, monospace;
}

.format-card-example {
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  font-size: 12px;
}

.example-label {
  color: #909399;
  margin-right: 6px;
}

.format-card-example code {
  font-family: Monaco, Menlo, monospace;
  color: #e74c3c;
  font-size: 12px;
}

.usage-card {
  margin-bottom: 24px;
}

.usage-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.usage-card-item {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  transition: all 0.3s;
}

.usage-card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #165DFF;
}

.usage-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  margin-bottom: 12px;
}

.usage-icon.ecommerce {
  background: linear-gradient(135deg, #165DFF 0%, #4080ff 100%);
}

.usage-icon.warehouse {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.usage-icon.logistics {
  background: linear-gradient(135deg, #00b42a 0%, #4caf50 100%);
}

.usage-icon.testing {
  background: linear-gradient(135deg, #eb2f96 0%, #f759ab 100%);
}

.usage-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.usage-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 8px;
}

.usage-code {
  font-size: 12px;
  color: #165DFF;
  font-weight: 500;
  padding: 6px 10px;
  background: #f0f7ff;
  border-radius: 4px;
}

.tips-card {
  margin-bottom: 24px;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

@media (max-width: 1200px) {
  .format-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .usage-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .generator-container {
    grid-template-columns: 1fr;
  }

  .preset-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .format-cards {
    grid-template-columns: 1fr;
  }

  .usage-cards {
    grid-template-columns: 1fr;
  }
}
</style>
