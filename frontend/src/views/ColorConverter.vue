<template>
  <div class="color-converter">
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
        <el-step title="输入颜色值" description="支持 HEX、RGB、HSL、HSV、CMYK 等多种格式" />
        <el-step title="自动解析" description="系统自动识别输入格式并转换" />
        <el-step title="查看结果" description="即时显示所有颜色空间的转换结果" />
        <el-step title="复制使用" description="一键复制任意格式的颜色值" />
      </el-steps>
      <el-divider />
      <div class="format-rules">
        <h4 class="rules-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          支持的输入格式示例
        </h4>
        <el-row :gutter="16">
          <el-col :span="8" v-for="format in inputFormats" :key="format.name">
            <div class="format-item">
              <div class="format-label">{{ format.name }}</div>
              <div class="format-examples">
                <code v-for="(ex, i) in format.examples" :key="i" class="format-code">{{ ex }}</code>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="converter-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Brush />
          </el-icon>
          <span>颜色空间转换器</span>
          <el-tag size="small" type="info" class="header-tag">支持 10+ 颜色空间</el-tag>
        </div>
      </template>

      <div class="input-section">
        <el-form label-width="100px">
          <el-row :gutter="24">
            <el-col :span="16">
              <el-form-item label="输入颜色">
                <div class="form-item-with-help">
                  <el-tooltip content="输入任意格式的颜色值，系统将自动识别" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                  <el-input
                    v-model="colorInput"
                    placeholder="输入颜色值，如: #FF5733、rgb(255,87,51)、hsl(14,100%,60%)"
                    size="large"
                    clearable
                    @input="handleInput"
                    @keyup.enter="convertColor"
                  >
                    <template #append>
                      <el-button @click="convertColor">
                        <el-icon><Refresh /></el-icon>
                      </el-button>
                    </template>
                  </el-input>
                </div>
                <div class="format-hints">
                  <span class="hints-label">快速输入：</span>
                  <el-tag
                    v-for="fmt in formatExamples"
                    :key="fmt.label"
                    size="small"
                    class="format-tag"
                    @click="applyFormatExample(fmt.value)"
                  >
                    {{ fmt.label }}
                  </el-tag>
                </div>
                <div class="quick-colors">
                  <span class="quick-label">常用颜色：</span>
                  <span
                    v-for="color in quickColors"
                    :key="color.hex"
                    class="color-dot"
                    :style="{ backgroundColor: color.hex }"
                    :title="color.name"
                    @click="selectQuickColor(color.hex)"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="取色器">
                <el-color-picker
                  v-model="pickerColor"
                  size="large"
                  show-alpha
                  @change="handlePickerChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div v-if="parseError" class="error-message">
        <el-alert :title="parseError" type="error" :closable="false" show-icon />
      </div>
    </el-card>

    <el-card v-if="hasResult" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataLine />
          </el-icon>
          <span>转换结果</span>
          <el-tag size="small" type="success">实时转换</el-tag>
        </div>
      </template>

      <div class="color-preview-section">
        <div class="color-preview-large" :style="{ backgroundColor: colorResults.rgba }">
          <div class="preview-info">
            <span class="preview-label">颜色预览</span>
            <span class="preview-hex">{{ colorResults.hex }}</span>
            <el-tag v-if="hasAlpha" size="small" type="info" class="alpha-tag">
              透明度 {{ alphaPercent }}%
            </el-tag>
          </div>
        </div>
        <div class="color-info">
          <div class="info-item">
            <span class="info-label">亮度</span>
            <div class="info-bar">
              <div class="info-bar-fill" :style="{ width: brightness + '%' }"></div>
            </div>
            <span class="info-value">{{ brightness.toFixed(1) }}%</span>
          </div>
          <div class="info-item">
            <span class="info-label">透明度</span>
            <div class="info-bar">
              <div class="info-bar-fill alpha-fill" :style="{ width: alphaPercent + '%' }"></div>
            </div>
            <span class="info-value">{{ alphaPercent }}%</span>
          </div>
          <div class="info-item">
            <span class="info-label">类型</span>
            <el-tag :type="isDark ? 'info' : 'warning'" size="small">
              {{ isDark ? '深色' : '浅色' }}
            </el-tag>
          </div>
          <div class="info-item">
            <span class="info-label">对比度</span>
            <el-tag :type="contrastRatio >= 4.5 ? 'success' : 'warning'" size="small">
              {{ contrastRatio.toFixed(2) }}:1
            </el-tag>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="color-spaces-grid">
        <div
          v-for="(space, key) in colorSpaces"
          :key="key"
          class="color-space-card"
          @click="copyValue(key)"
        >
          <div class="space-header">
            <span class="space-name">{{ space.name }}</span>
            <el-tooltip content="点击复制" placement="top">
              <el-icon class="copy-icon"><CopyDocument /></el-icon>
            </el-tooltip>
          </div>
          <div class="space-value">{{ colorResults[key] || '-' }}</div>
          <div class="space-desc">{{ space.desc }}</div>
        </div>
      </div>

      <el-divider />

      <div class="detail-table-section">
        <h4>详细参数表</h4>
        <el-table :data="colorDetailList" border stripe size="small">
          <el-table-column prop="space" label="颜色空间" width="120" />
          <el-table-column prop="name" label="参数名称" width="100" />
          <el-table-column prop="value" label="数值" width="120" align="right" />
          <el-table-column prop="range" label="取值范围" width="120" align="center" />
          <el-table-column prop="description" label="说明" />
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button size="small" type="primary" link @click="copySingleValue(row.fullValue)">
                复制
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-card class="harmony-card" v-if="hasResult">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <MagicStick />
          </el-icon>
          <span>配色方案</span>
        </div>
      </template>

      <div class="harmony-section">
        <div v-for="scheme in colorSchemes" :key="scheme.name" class="harmony-group">
          <h5 class="harmony-title">{{ scheme.name }}</h5>
          <div class="harmony-colors">
            <div
              v-for="(color, idx) in scheme.colors"
              :key="idx"
              class="harmony-color"
              :style="{ backgroundColor: color }"
              @click="selectQuickColor(color)"
            >
              <span class="harmony-hex">{{ color }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Brush,
  DataLine,
  InfoFilled,
  QuestionFilled,
  Warning,
  CopyDocument,
  Refresh,
  MagicStick
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface RGB {
  r: number
  g: number
  b: number
  a?: number
}

interface HSL {
  h: number
  s: number
  l: number
  a?: number
}

interface HSV {
  h: number
  s: number
  v: number
  a?: number
}

interface CMYK {
  c: number
  m: number
  y: number
  k: number
}

interface ColorResults {
  hex: string
  hexAlpha: string
  rgb: string
  rgba: string
  hsl: string
  hsla: string
  hsv: string
  hsva: string
  cmyk: string
  hwb: string
  lab: string
  lch: string
}

const colorInput = ref('')
const pickerColor = ref('#165DFF')
const parseError = ref('')
const rgbValue = ref<RGB | null>(null)

const inputFormats = [
  { name: 'HEX', examples: ['#FF5733', 'FF5733', '#F53'] },
  { name: 'RGB/A', examples: ['rgb(255,87,51)', 'rgba(255,87,51,0.8)'] },
  { name: 'HSL/A', examples: ['hsl(14,100%,60%)', 'hsla(14,100%,60%,0.8)'] },
  { name: 'HSV', examples: ['hsv(14,80%,100%)', 'hsv 14 80 100'] },
  { name: 'CMYK', examples: ['cmyk(0,66,80,0)', 'cmyk 0 66 80 0'] },
  { name: '名称', examples: ['red', 'blue', 'tomato'] }
]

const quickColors = [
  { name: '红色', hex: '#FF5733' },
  { name: '橙色', hex: '#FF9800' },
  { name: '黄色', hex: '#FFC107' },
  { name: '绿色', hex: '#4CAF50' },
  { name: '青色', hex: '#00BCD4' },
  { name: '蓝色', hex: '#165DFF' },
  { name: '紫色', hex: '#9C27B0' },
  { name: '粉色', hex: '#E91E63' },
  { name: '黑色', hex: '#000000' },
  { name: '白色', hex: '#FFFFFF' },
  { name: '灰色', hex: '#9E9E9E' }
]

const formatExamples = [
  { label: '#FF5733', value: '#FF5733' },
  { label: 'rgb(255,87,51)', value: 'rgb(255,87,51)' },
  { label: 'rgba(255,87,51,0.8)', value: 'rgba(255,87,51,0.8)' },
  { label: 'hsl(14,100%,60%)', value: 'hsl(14,100%,60%)' },
  { label: 'hsv(14,80%,100%)', value: 'hsv(14,80%,100%)' },
  { label: 'cmyk(0,66,80,0)', value: 'cmyk(0,66,80,0)' },
  { label: 'red', value: 'red' }
]

const colorSpaces: Record<string, { name: string; desc: string }> = {
  hex: { name: 'HEX', desc: '十六进制颜色码' },
  hexAlpha: { name: 'HEXα', desc: '带透明度的十六进制' },
  rgb: { name: 'RGB', desc: '红绿蓝色彩模式' },
  rgba: { name: 'RGBA', desc: '带透明度的RGB' },
  hsl: { name: 'HSL', desc: '色相-饱和度-亮度' },
  hsla: { name: 'HSLA', desc: '带透明度的HSL' },
  hsv: { name: 'HSV', desc: '色相-饱和度-明度' },
  hsva: { name: 'HSVA', desc: '带透明度的HSV' },
  cmyk: { name: 'CMYK', desc: '印刷四分色模式' },
  hwb: { name: 'HWB', desc: '色相-白度-黑度' },
  lab: { name: 'LAB', desc: 'CIELAB 色彩空间' },
  lch: { name: 'LCH', desc: '亮度-色度-色相' }
}

const colorResults = ref<ColorResults>({
  hex: '',
  hexAlpha: '',
  rgb: '',
  rgba: '',
  hsl: '',
  hsla: '',
  hsv: '',
  hsva: '',
  cmyk: '',
  hwb: '',
  lab: '',
  lch: ''
})

const hasResult = computed(() => !!rgbValue.value)

const brightness = computed(() => {
  if (!rgbValue.value) return 0
  const { r, g, b } = rgbValue.value
  return (r * 299 + g * 587 + b * 114) / 2550
})

const isDark = computed(() => brightness.value < 50)

const contrastRatio = computed(() => {
  if (!rgbValue.value) return 0
  const { r, g, b } = rgbValue.value
  const l1 = (r / 255 * 0.2126 + g / 255 * 0.7152 + b / 255 * 0.0722)
  const l2 = 1.0
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
})

const hasAlpha = computed(() => {
  return rgbValue.value?.a !== undefined && rgbValue.value.a < 1
})

const alphaPercent = computed(() => {
  if (!rgbValue.value?.a) return 100
  return Math.round(rgbValue.value.a * 100)
})

const colorDetailList = computed(() => {
  if (!rgbValue.value) return []
  const rgb = rgbValue.value
  const hsl = rgbToHsl(rgb)
  const hsv = rgbToHsv(rgb)
  const cmyk = rgbToCmyk(rgb)
  const hwb = rgbToHwb(rgb)
  const lab = rgbToLab(rgb)
  const lch = rgbToLch(rgb)

  return [
    { space: 'RGB', name: 'R (红)', value: rgb.r, range: '0-255', description: '红色通道值', fullValue: rgb.r.toString() },
    { space: 'RGB', name: 'G (绿)', value: rgb.g, range: '0-255', description: '绿色通道值', fullValue: rgb.g.toString() },
    { space: 'RGB', name: 'B (蓝)', value: rgb.b, range: '0-255', description: '蓝色通道值', fullValue: rgb.b.toString() },
    { space: 'HSL', name: 'H (色相)', value: hsl.h + '°', range: '0-360°', description: '颜色的基本属性', fullValue: hsl.h.toString() },
    { space: 'HSL', name: 'S (饱和度)', value: hsl.s + '%', range: '0-100%', description: '颜色的鲜艳程度', fullValue: hsl.s.toString() },
    { space: 'HSL', name: 'L (亮度)', value: hsl.l + '%', range: '0-100%', description: '颜色的明亮程度', fullValue: hsl.l.toString() },
    { space: 'HSV', name: 'H (色相)', value: hsv.h + '°', range: '0-360°', description: '颜色的基本属性', fullValue: hsv.h.toString() },
    { space: 'HSV', name: 'S (饱和度)', value: hsv.s + '%', range: '0-100%', description: '颜色的纯度', fullValue: hsv.s.toString() },
    { space: 'HSV', name: 'V (明度)', value: hsv.v + '%', range: '0-100%', description: '颜色的明亮程度', fullValue: hsv.v.toString() },
    { space: 'CMYK', name: 'C (青)', value: cmyk.c + '%', range: '0-100%', description: '青色墨水比例', fullValue: cmyk.c.toString() },
    { space: 'CMYK', name: 'M (品红)', value: cmyk.m + '%', range: '0-100%', description: '品红墨水比例', fullValue: cmyk.m.toString() },
    { space: 'CMYK', name: 'Y (黄)', value: cmyk.y + '%', range: '0-100%', description: '黄色墨水比例', fullValue: cmyk.y.toString() },
    { space: 'CMYK', name: 'K (黑)', value: cmyk.k + '%', range: '0-100%', description: '黑色墨水比例', fullValue: cmyk.k.toString() },
    { space: 'HWB', name: 'H (色相)', value: hwb.h + '°', range: '0-360°', description: '颜色的基本属性', fullValue: hwb.h.toString() },
    { space: 'HWB', name: 'W (白度)', value: hwb.w + '%', range: '0-100%', description: '白色混合程度', fullValue: hwb.w.toString() },
    { space: 'HWB', name: 'B (黑度)', value: hwb.b + '%', range: '0-100%', description: '黑色混合程度', fullValue: hwb.b.toString() }
  ]
})

const colorSchemes = computed(() => {
  if (!rgbValue.value) return []
  const hsl = rgbToHsl(rgbValue.value)
  
  const schemes = [
    {
      name: '互补色 (Complementary)',
      colors: [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
      ]
    },
    {
      name: '类似色 (Analogous)',
      colors: [
        hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
      ]
    },
    {
      name: '三元色 (Triadic)',
      colors: [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
      ]
    },
    {
      name: '分裂互补 (Split Complementary)',
      colors: [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
      ]
    },
    {
      name: '四元色 (Tetradic)',
      colors: [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
      ]
    },
    {
      name: '单色渐变 (Monochromatic)',
      colors: [
        hslToHex(hsl.h, hsl.s, 20),
        hslToHex(hsl.h, hsl.s, 40),
        hslToHex(hsl.h, hsl.s, 60),
        hslToHex(hsl.h, hsl.s, 80)
      ]
    }
  ]
  
  return schemes
})

const parseColor = (input: string): RGB | null => {
  input = input.trim().toLowerCase()
  
  const namedColors: Record<string, string> = {
    'red': '#ff0000', 'blue': '#0000ff', 'green': '#008000', 'yellow': '#ffff00',
    'orange': '#ffa500', 'purple': '#800080', 'pink': '#ffc0cb', 'brown': '#a52a2a',
    'black': '#000000', 'white': '#ffffff', 'gray': '#808080', 'grey': '#808080',
    'cyan': '#00ffff', 'magenta': '#ff00ff', 'lime': '#00ff00', 'maroon': '#800000',
    'navy': '#000080', 'olive': '#808000', 'silver': '#c0c0c0', 'teal': '#008080',
    'gold': '#ffd700', 'tomato': '#ff6347', 'coral': '#ff7f50', 'salmon': '#fa8072',
    'aqua': '#00ffff', 'fuchsia': '#ff00ff', 'violet': '#ee82ee', 'indigo': '#4b0082'
  }
  
  if (namedColors[input]) {
    input = namedColors[input]
  }
  
  const hexMatch = input.match(/^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/)
  if (hexMatch) {
    let hex = hexMatch[1]
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('')
    }
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
    }
  }
  
  const rgbMatch = input.match(/rgba?\s*\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)\s*([,/]?\s*([0-9.]+)\s*)?\)/)
  if (rgbMatch) {
    return {
      r: Math.min(255, parseInt(rgbMatch[1])),
      g: Math.min(255, parseInt(rgbMatch[2])),
      b: Math.min(255, parseInt(rgbMatch[3])),
      a: rgbMatch[5] ? parseFloat(rgbMatch[5]) : 1
    }
  }
  
  const hslMatch = input.match(/hsla?\s*\(\s*(\d+)\s*[, ]\s*(\d+)%?\s*[, ]\s*(\d+)%?\s*([,/]?\s*([0-9.]+)\s*)?\)/)
  if (hslMatch) {
    const hsl = {
      h: parseInt(hslMatch[1]),
      s: parseInt(hslMatch[2]),
      l: parseInt(hslMatch[3]),
      a: hslMatch[5] ? parseFloat(hslMatch[5]) : 1
    }
    return hslToRgbObj(hsl.h, hsl.s, hsl.l, hsl.a)
  }
  
  const hsvMatch = input.match(/hsva?\s*\(\s*(\d+)\s*[, ]\s*(\d+)%?\s*[, ]\s*(\d+)%?\s*([,/]?\s*([0-9.]+)\s*)?\)/)
  if (hsvMatch) {
    const hsv = {
      h: parseInt(hsvMatch[1]),
      s: parseInt(hsvMatch[2]),
      v: parseInt(hsvMatch[3]),
      a: hsvMatch[5] ? parseFloat(hsvMatch[5]) : 1
    }
    return hsvToRgbObj(hsv.h, hsv.s, hsv.v, hsv.a)
  }
  
  const cmykMatch = input.match(/cmyk\s*\(\s*(\d+)%?\s*[, ]\s*(\d+)%?\s*[, ]\s*(\d+)%?\s*[, ]\s*(\d+)%?\s*\)/)
  if (cmykMatch) {
    const cmyk = {
      c: parseInt(cmykMatch[1]) / 100,
      m: parseInt(cmykMatch[2]) / 100,
      y: parseInt(cmykMatch[3]) / 100,
      k: parseInt(cmykMatch[4]) / 100
    }
    return cmykToRgbObj(cmyk.c, cmyk.m, cmyk.y, cmyk.k)
  }
  
  return null
}

const hslToRgbObj = (h: number, s: number, l: number, a = 1): RGB => {
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  
  if (h >= 0 && h < 60) { r = c; g = x; b = 0 }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0 }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a
  }
}

const hsvToRgbObj = (h: number, s: number, v: number, a = 1): RGB => {
  s /= 100
  v /= 100
  const c = v * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = v - c
  let r = 0, g = 0, b = 0
  
  if (h >= 0 && h < 60) { r = c; g = x; b = 0 }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0 }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a
  }
}

const cmykToRgbObj = (c: number, m: number, y: number, k: number): RGB => {
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k))
  }
}

const rgbToHsl = (rgb: RGB): HSL => {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: rgb.a
  }
}

const rgbToHsv = (rgb: RGB): HSV => {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max
  
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
    a: rgb.a
  }
}

const rgbToCmyk = (rgb: RGB): CMYK => {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  const k = 1 - Math.max(r, g, b)
  
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 }
  }
  
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100)
  }
}

const rgbToHwb = (rgb: RGB) => {
  const hsl = rgbToHsl(rgb)
  const w = Math.min(rgb.r, rgb.g, rgb.b) / 255 * 100
  const b = 100 - Math.max(rgb.r, rgb.g, rgb.b) / 255 * 100
  return { h: hsl.h, w: Math.round(w), b: Math.round(b) }
}

const rgbToLab = (rgb: RGB) => {
  let r = rgb.r / 255
  let g = rgb.g / 255
  let b = rgb.b / 255
  
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92
  
  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
  
  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116
  
  return {
    l: Math.round((116 * y) - 16),
    a: Math.round(500 * (x - y)),
    b: Math.round(200 * (y - z))
  }
}

const rgbToLch = (rgb: RGB) => {
  const lab = rgbToLab(rgb)
  const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b)
  let h = Math.atan2(lab.b, lab.a) * 180 / Math.PI
  if (h < 0) h += 360
  return {
    l: lab.l,
    c: Math.round(c),
    h: Math.round(h)
  }
}

const hslToHex = (h: number, s: number, l: number): string => {
  const rgb = hslToRgbObj(h, s, l)
  return '#' + [rgb.r, rgb.g, rgb.b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
}

const convertColor = () => {
  if (!colorInput.value.trim()) {
    parseError.value = ''
    return
  }
  
  const parsed = parseColor(colorInput.value)
  if (!parsed) {
    parseError.value = '无法解析颜色值，请检查输入格式'
    rgbValue.value = null
    return
  }
  
  parseError.value = ''
  rgbValue.value = parsed
  updateResults(parsed)
  pickerColor.value = rgbToHex(parsed)
}

const rgbToHex = (rgb: RGB, alpha = false): string => {
  const hex = '#' + [rgb.r, rgb.g, rgb.b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
  if (alpha && rgb.a !== undefined && rgb.a < 1) {
    const alphaHex = Math.round(rgb.a * 255).toString(16).padStart(2, '0').toUpperCase()
    return hex + alphaHex
  }
  return hex
}

const updateResults = (rgb: RGB) => {
  const hsl = rgbToHsl(rgb)
  const hsv = rgbToHsv(rgb)
  const cmyk = rgbToCmyk(rgb)
  const hwb = rgbToHwb(rgb)
  const lab = rgbToLab(rgb)
  const lch = rgbToLch(rgb)
  
  colorResults.value = {
    hex: rgbToHex(rgb),
    hexAlpha: rgbToHex(rgb, true),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a || 1})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${rgb.a || 1})`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    hsva: `hsva(${hsv.h}, ${hsv.s}%, ${hsv.v}%, ${rgb.a || 1})`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    hwb: `hwb(${hwb.h}, ${hwb.w}%, ${hwb.b}%)`,
    lab: `lab(${lab.l}, ${lab.a}, ${lab.b})`,
    lch: `lch(${lch.l}, ${lch.c}, ${lch.h})`
  }
}

const handleInput = () => {
  if (colorInput.value.trim()) {
    convertColor()
  }
}

const handlePickerChange = (val: string) => {
  colorInput.value = val
  convertColor()
}

const selectQuickColor = (hex: string) => {
  colorInput.value = hex
  pickerColor.value = hex
  convertColor()
}

const copyValue = (key: string) => {
  const value = colorResults.value[key as keyof ColorResults]
  if (value) {
    navigator.clipboard.writeText(value).then(() => {
      ElMessage.success(`已复制: ${value}`)
    }).catch(() => {
      ElMessage.error('复制失败')
    })
  }
}

const copySingleValue = (value: string) => {
  navigator.clipboard.writeText(value).then(() => {
    ElMessage.success(`已复制: ${value}`)
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const applyFormatExample = (value: string) => {
  colorInput.value = value
  convertColor()
}

watch(pickerColor, (val) => {
  if (val) {
    colorInput.value = val
    convertColor()
  }
})

convertColor()
pickerColor.value = '#165DFF'
</script>

<style scoped>
.color-converter {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card,
.converter-card,
.result-card,
.harmony-card {
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

.guide-steps {
  padding: 10px 0;
}

.format-rules {
  padding: 0 4px;
}

.rules-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: #303133;
  margin: 0 0 16px;
}

.format-item {
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
  height: 100%;
}

.format-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.format-examples {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.format-code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #165DFF;
  background: #ecf5ff;
  padding: 2px 8px;
  border-radius: 4px;
}

.input-section {
  padding: 16px 0;
}

.form-item-with-help {
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-icon {
  color: #909399;
  cursor: help;
  flex-shrink: 0;
}

.format-hints {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.hints-label {
  font-size: 13px;
  color: #165DFF;
  font-weight: 500;
}

.format-tag {
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
}

.format-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.quick-colors {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.quick-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #e4e7ed;
  transition: all 0.3s;
}

.color-dot:hover {
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.error-message {
  margin-top: 16px;
}

.color-preview-section {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  margin-bottom: 16px;
}

.color-preview-large {
  height: 200px;
  border-radius: 12px;
  display: flex;
  align-items: flex-end;
  padding: 16px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  background-color: transparent;
  position: relative;
  overflow: hidden;
}

.color-preview-large::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: inherit;
  z-index: 0;
}

.preview-info {
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-label {
  font-size: 12px;
  color: #909399;
}

.preview-hex {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  font-family: 'Monaco', 'Menlo', monospace;
}

.alpha-tag {
  align-self: flex-start;
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-label {
  width: 80px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.info-bar {
  flex: 1;
  height: 8px;
  background: #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.info-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #165DFF, #409eff);
  border-radius: 4px;
  transition: width 0.3s;
}

.info-bar-fill.alpha-fill {
  background: linear-gradient(90deg, #909399, #606266);
}

.info-value {
  width: 60px;
  text-align: right;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #303133;
}

.color-spaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.color-space-card {
  padding: 16px;
  background: #fafafa;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.color-space-card:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.space-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.space-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.copy-icon {
  font-size: 14px;
  color: #165DFF;
  opacity: 0;
  transition: opacity 0.3s;
}

.color-space-card:hover .copy-icon {
  opacity: 1;
}

.space-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 15px;
  font-weight: 500;
  color: #165DFF;
  margin-bottom: 4px;
  word-break: break-all;
}

.space-desc {
  font-size: 12px;
  color: #909399;
}

.detail-table-section {
  margin-top: 8px;
}

.detail-table-section h4 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #303133;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}

.harmony-section {
  display: grid;
  gap: 24px;
}

.harmony-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.harmony-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.harmony-colors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.harmony-color {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
  transition: all 0.3s;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.harmony-color:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.harmony-hex {
  font-size: 10px;
  font-family: 'Monaco', 'Menlo', monospace;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  color: #303133;
}

@media (max-width: 768px) {
  .color-preview-section {
    grid-template-columns: 1fr;
  }
  
  .color-spaces-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
