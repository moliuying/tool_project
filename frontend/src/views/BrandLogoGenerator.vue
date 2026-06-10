<template>
  <div class="brand-logo-generator">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>功能介绍</span>
        </div>
      </template>
      <el-steps :active="currentStep" finish-status="success" simple class="guide-steps">
        <el-step title="填写品牌信息" description="输入品牌名称、行业、受众等信息" />
        <el-step title="选择设计风格" description="选择极简、科技、复古、可爱等风格偏好" />
        <el-step title="生成LOGO方案" description="AI自动生成多款配色、字体和图标组合" />
        <el-step title="下载使用" description="选择喜欢的方案，下载SVG/PNG格式" />
      </el-steps>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#722ed1">
            <Brush />
          </el-icon>
          <span>品牌LOGO智能生成器</span>
          <el-tag size="small" type="success">AI驱动</el-tag>
        </div>
      </template>

      <div class="generator-container">
        <div class="input-section">
          <div class="section-title">
            <el-icon><EditPen /></el-icon>
            <span>品牌信息</span>
          </div>

          <el-form label-width="100px" label-position="left">
            <el-form-item label="品牌名称" required>
              <el-input
                v-model="brandForm.brandName"
                placeholder="如：星辰科技、甜心烘焙"
                maxlength="20"
                show-word-limit
                :disabled="isGenerating"
              />
            </el-form-item>

            <el-form-item label="英文名称">
              <el-input
                v-model="brandForm.englishName"
                placeholder="如：Stellar Tech（可选）"
                maxlength="30"
                show-word-limit
                :disabled="isGenerating"
              />
            </el-form-item>

            <el-form-item label="品牌标语">
              <el-input
                v-model="brandForm.slogan"
                placeholder="如：让创意点亮生活（可选）"
                maxlength="30"
                show-word-limit
                :disabled="isGenerating"
              />
            </el-form-item>

            <el-form-item label="所属行业" required>
              <el-select v-model="brandForm.industry" placeholder="请选择行业" style="width: 100%;" :disabled="isGenerating">
                <el-option v-for="ind in industries" :key="ind.value" :label="ind.label" :value="ind.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="目标受众">
              <el-checkbox-group v-model="brandForm.audience" :disabled="isGenerating">
                <el-checkbox v-for="aud in audiences" :key="aud.value" :label="aud.value">
                  {{ aud.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="风格偏好" required>
              <div class="style-grid">
                <div
                  v-for="style in styles"
                  :key="style.value"
                  class="style-option"
                  :class="{ active: brandForm.style === style.value, disabled: isGenerating }"
                  @click="!isGenerating && (brandForm.style = style.value)"
                >
                  <div class="style-icon">{{ style.icon }}</div>
                  <div class="style-name">{{ style.label }}</div>
                  <div class="style-desc">{{ style.desc }}</div>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="色调偏好">
              <el-radio-group v-model="brandForm.colorScheme" :disabled="isGenerating">
                <el-radio-button v-for="scheme in colorSchemes" :key="scheme.value" :value="scheme.value">
                  {{ scheme.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <div class="action-area">
            <el-button
              type="primary"
              size="large"
              :icon="MagicStick"
              @click="generateLogos"
              :loading="isGenerating"
              :disabled="!canGenerate"
              class="generate-btn"
            >
              {{ isGenerating ? '正在生成中...' : '智能生成LOGO方案' }}
            </el-button>
            <el-button size="large" :icon="Refresh" @click="resetForm" :disabled="isGenerating">
              重置
            </el-button>
          </div>
        </div>

        <div class="preview-section">
          <div class="section-title">
            <el-icon><View /></el-icon>
            <span>LOGO方案预览</span>
            <el-tag v-if="generatedLogos.length > 0" size="small" type="success">
              共 {{ generatedLogos.length }} 款方案
            </el-tag>
          </div>

          <div v-if="generatedLogos.length === 0" class="empty-preview">
            <div class="empty-icon">
              <el-icon :size="64" color="#c0c4cc"><PictureFilled /></el-icon>
            </div>
            <div class="empty-title">等待生成</div>
            <div class="empty-desc">填写左侧品牌信息并点击「智能生成LOGO方案」，AI将为你生成多款设计方案</div>
            <div class="empty-tips">
              <div class="tip-item">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                <span>支持6种设计风格</span>
              </div>
              <div class="tip-item">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                <span>多套配色方案自动匹配</span>
              </div>
              <div class="tip-item">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                <span>可导出SVG/PNG格式</span>
              </div>
            </div>
          </div>

          <div v-else class="logo-grid">
            <div
              v-for="(logo, index) in generatedLogos"
              :key="index"
              class="logo-card"
              :class="{ selected: selectedLogoIndex === index }"
              @click="selectedLogoIndex = index"
            >
              <div class="logo-index">方案 {{ index + 1 }}</div>
              <div class="logo-preview" :style="{ background: logo.bgColor }">
                <div class="logo-canvas" :style="logo.canvasStyle">
                  <div v-if="logo.iconPosition === 'top'" class="logo-layout logo-layout-top">
                    <div class="logo-icon" :style="{ color: logo.primaryColor, fontSize: logo.iconSize + 'px' }">
                      {{ logo.icon }}
                    </div>
                    <div class="logo-brand-name" :style="logo.nameStyle">
                      {{ displayBrandName }}
                    </div>
                    <div v-if="displayEnglishName" class="logo-english-name" :style="logo.englishStyle">
                      {{ displayEnglishName }}
                    </div>
                    <div v-if="displaySlogan" class="logo-slogan" :style="logo.sloganStyle">
                      {{ displaySlogan }}
                    </div>
                  </div>
                  <div v-else-if="logo.iconPosition === 'left'" class="logo-layout logo-layout-left">
                    <div class="logo-icon" :style="{ color: logo.primaryColor, fontSize: logo.iconSize + 'px' }">
                      {{ logo.icon }}
                    </div>
                    <div class="logo-text-group">
                      <div class="logo-brand-name" :style="logo.nameStyle">
                        {{ displayBrandName }}
                      </div>
                      <div v-if="displayEnglishName" class="logo-english-name" :style="logo.englishStyle">
                        {{ displayEnglishName }}
                      </div>
                      <div v-if="displaySlogan" class="logo-slogan" :style="logo.sloganStyle">
                        {{ displaySlogan }}
                      </div>
                    </div>
                  </div>
                  <div v-else class="logo-layout logo-layout-circle">
                    <div class="logo-circle-icon" :style="{ background: logo.primaryColor, color: logo.bgColor }">
                      <span :style="{ fontSize: (logo.iconSize * 0.7) + 'px' }">{{ logo.icon }}</span>
                    </div>
                    <div class="logo-brand-name" :style="logo.nameStyle">
                      {{ displayBrandName }}
                    </div>
                    <div v-if="displayEnglishName" class="logo-english-name" :style="logo.englishStyle">
                      {{ displayEnglishName }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="logo-meta">
                <div class="logo-tags">
                  <el-tag size="small" :color="logo.primaryColor" effect="dark" style="color: #fff;">
                    {{ logo.styleName }}
                  </el-tag>
                  <el-tag size="small" type="info">{{ logo.layoutName }}</el-tag>
                </div>
                <div class="logo-colors">
                  <span class="color-label">配色：</span>
                  <span
                    v-for="(color, ci) in logo.colorPalette"
                    :key="ci"
                    class="color-dot"
                    :style="{ background: color }"
                    :title="color"
                  ></span>
                </div>
              </div>
              <div class="logo-actions" v-if="selectedLogoIndex === index">
                <el-button size="small" type="primary" :icon="Download" @click.stop="downloadLogo(index, 'svg')">
                  下载SVG
                </el-button>
                <el-button size="small" :icon="Download" @click.stop="downloadLogo(index, 'png')">
                  下载PNG
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="selectedLogo" class="detail-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <ZoomIn />
          </el-icon>
          <span>方案详情</span>
          <el-tag size="small" type="primary">方案 {{ selectedLogoIndex + 1 }}</el-tag>
        </div>
      </template>

      <div class="detail-container">
        <div class="detail-preview-section">
          <div class="detail-title">不同背景展示</div>
          <div class="bg-variants">
            <div class="bg-variant-item">
              <div class="bg-label">浅色背景</div>
              <div class="bg-preview light-bg">
                <div class="logo-canvas" :style="selectedLogo.canvasStyle">
                  <div v-if="selectedLogo.iconPosition === 'top'" class="logo-layout logo-layout-top">
                    <div class="logo-icon" :style="{ color: selectedLogo.primaryColor, fontSize: selectedLogo.iconSize + 'px' }">
                      {{ selectedLogo.icon }}
                    </div>
                    <div class="logo-brand-name" :style="selectedLogo.nameStyle">{{ displayBrandName }}</div>
                  </div>
                  <div v-else-if="selectedLogo.iconPosition === 'left'" class="logo-layout logo-layout-left">
                    <div class="logo-icon" :style="{ color: selectedLogo.primaryColor, fontSize: selectedLogo.iconSize + 'px' }">
                      {{ selectedLogo.icon }}
                    </div>
                    <div class="logo-text-group">
                      <div class="logo-brand-name" :style="selectedLogo.nameStyle">{{ displayBrandName }}</div>
                    </div>
                  </div>
                  <div v-else class="logo-layout logo-layout-circle">
                    <div class="logo-circle-icon" :style="{ background: selectedLogo.primaryColor, color: '#fff' }">
                      <span :style="{ fontSize: (selectedLogo.iconSize * 0.7) + 'px' }">{{ selectedLogo.icon }}</span>
                    </div>
                    <div class="logo-brand-name" :style="selectedLogo.nameStyle">{{ displayBrandName }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-variant-item">
              <div class="bg-label">深色背景</div>
              <div class="bg-preview dark-bg">
                <div class="logo-canvas" :style="{ ...selectedLogo.canvasStyle, color: '#fff' }">
                  <div v-if="selectedLogo.iconPosition === 'top'" class="logo-layout logo-layout-top">
                    <div class="logo-icon" :style="{ color: selectedLogo.lightColor, fontSize: selectedLogo.iconSize + 'px' }">
                      {{ selectedLogo.icon }}
                    </div>
                    <div class="logo-brand-name" :style="{ ...selectedLogo.nameStyle, color: '#fff' }">{{ displayBrandName }}</div>
                  </div>
                  <div v-else-if="selectedLogo.iconPosition === 'left'" class="logo-layout logo-layout-left">
                    <div class="logo-icon" :style="{ color: selectedLogo.lightColor, fontSize: selectedLogo.iconSize + 'px' }">
                      {{ selectedLogo.icon }}
                    </div>
                    <div class="logo-text-group">
                      <div class="logo-brand-name" :style="{ ...selectedLogo.nameStyle, color: '#fff' }">{{ displayBrandName }}</div>
                    </div>
                  </div>
                  <div v-else class="logo-layout logo-layout-circle">
                    <div class="logo-circle-icon" :style="{ background: selectedLogo.lightColor, color: '#1a1a1a' }">
                      <span :style="{ fontSize: (selectedLogo.iconSize * 0.7) + 'px' }">{{ selectedLogo.icon }}</span>
                    </div>
                    <div class="logo-brand-name" :style="{ ...selectedLogo.nameStyle, color: '#fff' }">{{ displayBrandName }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-variant-item">
              <div class="bg-label">透明背景</div>
              <div class="bg-preview transparent-bg">
                <div class="logo-canvas" :style="selectedLogo.canvasStyle">
                  <div v-if="selectedLogo.iconPosition === 'top'" class="logo-layout logo-layout-top">
                    <div class="logo-icon" :style="{ color: selectedLogo.primaryColor, fontSize: selectedLogo.iconSize + 'px' }">
                      {{ selectedLogo.icon }}
                    </div>
                    <div class="logo-brand-name" :style="selectedLogo.nameStyle">{{ displayBrandName }}</div>
                  </div>
                  <div v-else-if="selectedLogo.iconPosition === 'left'" class="logo-layout logo-layout-left">
                    <div class="logo-icon" :style="{ color: selectedLogo.primaryColor, fontSize: selectedLogo.iconSize + 'px' }">
                      {{ selectedLogo.icon }}
                    </div>
                    <div class="logo-text-group">
                      <div class="logo-brand-name" :style="selectedLogo.nameStyle">{{ displayBrandName }}</div>
                    </div>
                  </div>
                  <div v-else class="logo-layout logo-layout-circle">
                    <div class="logo-circle-icon" :style="{ background: selectedLogo.primaryColor, color: '#fff' }">
                      <span :style="{ fontSize: (selectedLogo.iconSize * 0.7) + 'px' }">{{ selectedLogo.icon }}</span>
                    </div>
                    <div class="logo-brand-name" :style="selectedLogo.nameStyle">{{ displayBrandName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-info-section">
          <div class="detail-title">设计参数</div>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="设计风格">{{ selectedLogo.styleName }}</el-descriptions-item>
            <el-descriptions-item label="布局方式">{{ selectedLogo.layoutName }}</el-descriptions-item>
            <el-descriptions-item label="图标符号">{{ selectedLogo.icon }}</el-descriptions-item>
            <el-descriptions-item label="字体风格">{{ selectedLogo.fontStyle }}</el-descriptions-item>
            <el-descriptions-item label="主色调">
              <span class="color-inline">
                <span class="color-dot" :style="{ background: selectedLogo.primaryColor }"></span>
                {{ selectedLogo.primaryColor }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="辅助色">
              <span class="color-inline">
                <span class="color-dot" :style="{ background: selectedLogo.secondaryColor }"></span>
                {{ selectedLogo.secondaryColor }}
              </span>
            </el-descriptions-item>
          </el-descriptions>

          <div class="detail-actions">
            <el-button type="primary" size="large" :icon="Download" @click="downloadLogo(selectedLogoIndex, 'svg')">
              下载 SVG
            </el-button>
            <el-button size="large" :icon="Download" @click="downloadLogo(selectedLogoIndex, 'png')">
              下载 PNG
            </el-button>
            <el-button size="large" type="success" :icon="MagicStick" @click="regenerateLogo(selectedLogoIndex)">
              重新生成此方案
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="scenario-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="16" color="#165DFF">
            <Guide />
          </el-icon>
          <span>适用场景</span>
        </div>
      </template>
      <div class="scenario-grid">
        <div class="scenario-item">
          <div class="scenario-icon">🚀</div>
          <div class="scenario-title">新品牌启动</div>
          <div class="scenario-desc">创业者、小微企业快速建立品牌视觉识别系统</div>
        </div>
        <div class="scenario-item">
          <div class="scenario-icon">📱</div>
          <div class="scenario-title">社交媒体</div>
          <div class="scenario-desc">公众号、小红书、抖音等平台账号头像与封面</div>
        </div>
        <div class="scenario-item">
          <div class="scenario-icon">🛒</div>
          <div class="scenario-title">电商店铺</div>
          <div class="scenario-desc">淘宝、京东、拼多多等店铺店标和装修元素</div>
        </div>
        <div class="scenario-item">
          <div class="scenario-icon">✍️</div>
          <div class="scenario-title">内容创作者</div>
          <div class="scenario-desc">UP主、博主、自媒体打造个人IP视觉标识</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Brush,
  EditPen,
  View,
  MagicStick,
  Refresh,
  Download,
  InfoFilled,
  Guide,
  PictureFilled,
  CircleCheck,
  ZoomIn
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface BrandForm {
  brandName: string
  englishName: string
  slogan: string
  industry: string
  audience: string[]
  style: string
  colorScheme: string
}

interface LogoDesign {
  styleName: string
  layoutName: string
  iconPosition: 'top' | 'left' | 'circle'
  icon: string
  iconSize: number
  primaryColor: string
  secondaryColor: string
  lightColor: string
  bgColor: string
  colorPalette: string[]
  nameStyle: Record<string, string>
  englishStyle: Record<string, string>
  sloganStyle: Record<string, string>
  canvasStyle: Record<string, string>
  fontStyle: string
}

const industries = [
  { label: '科技/互联网', value: 'tech' },
  { label: '餐饮/食品', value: 'food' },
  { label: '教育/培训', value: 'education' },
  { label: '医疗/健康', value: 'health' },
  { label: '金融/投资', value: 'finance' },
  { label: '零售/电商', value: 'retail' },
  { label: '文娱/传媒', value: 'media' },
  { label: '美妆/时尚', value: 'beauty' },
  { label: '旅游/出行', value: 'travel' },
  { label: '建筑/地产', value: 'realestate' },
  { label: '农业/食品', value: 'agriculture' },
  { label: '其他行业', value: 'other' }
]

const audiences = [
  { label: '年轻人(18-30)', value: 'young' },
  { label: '商务人士', value: 'business' },
  { label: '家庭用户', value: 'family' },
  { label: '学生群体', value: 'student' },
  { label: '女性用户', value: 'female' },
  { label: '男性用户', value: 'male' },
  { label: '儿童/亲子', value: 'kids' },
  { label: '高端用户', value: 'premium' }
]

const styles = [
  { value: 'minimal', label: '极简风', icon: '◻️', desc: '简约线条，留白美学' },
  { value: 'tech', label: '科技感', icon: '⚡', desc: '未来感、几何元素' },
  { value: 'retro', label: '复古风', icon: '📻', desc: '怀旧、经典韵味' },
  { value: 'cute', label: '可爱风', icon: '🎀', desc: '圆润、萌系元素' },
  { value: 'luxury', label: '高端奢华', icon: '👑', desc: '精致、品质感' },
  { value: 'natural', label: '自然生态', icon: '🌿', desc: '清新、有机元素' }
]

const colorSchemes = [
  { label: '自动推荐', value: 'auto' },
  { label: '蓝色系', value: 'blue' },
  { label: '红色系', value: 'red' },
  { label: '绿色系', value: 'green' },
  { label: '紫色系', value: 'purple' },
  { label: '橙黄色系', value: 'orange' },
  { label: '粉紫色系', value: 'pink' },
  { label: '黑白灰', value: 'mono' }
]

const styleIcons: Record<string, string[]> = {
  tech: ['⚡', '💎', '🔷', '◆', '⬡', '◈', '✦', '⟡'],
  food: ['🍽️', '☕', '🍰', '🥐', '🍜', '🌮', '🍣', '🥗'],
  education: ['📚', '🎓', '✏️', '📖', '💡', '🌟', '🎯', '🔬'],
  health: ['❤️', '🌿', '💊', '🏥', '🧘', '💪', '✨', '🌸'],
  finance: ['💰', '📈', '💎', '🏦', '⚖️', '💼', '📊', '🔒'],
  retail: ['🛒', '🎁', '🏷️', '🛍️', '⭐', '💝', '✨', '🎀'],
  media: ['🎬', '📷', '🎵', '🎨', '📺', '🎭', '✒️', '🎤'],
  beauty: ['💄', '🌸', '✨', '💅', '🌹', '💎', '🎀', '🦋'],
  travel: ['✈️', '🗺️', '🏔️', '🌊', '🏖️', '🚗', '🧭', '🌍'],
  realestate: ['🏠', '🏢', '🏛️', '🔑', '📐', '📍', '🏗️', '🌆'],
  agriculture: ['🌾', '🌱', '🍃', '🌻', '🐄', '🌿', '☀️', '🚜'],
  other: ['⭐', '✦', '◆', '●', '▲', '■', '✿', '❖']
}

const minimalIcons = ['◻️', '▭', '○', '△', '□', '◇', '▽', '◎']
const techIcons = ['⚡', '◆', '⬡', '◈', '✦', '⟡', '◇', '▣']
const retroIcons = ['✦', '❋', '✺', '❂', '☀', '❁', '✾', '❃']
const cuteIcons = ['♥', '★', '✿', '❀', '☀', '☁', '♪', '✧']
const luxuryIcons = ['♛', '♕', '✦', '◆', '❖', '◈', '⟡', '✧']
const naturalIcons = ['🌿', '🍃', '🌱', '🌾', '🌸', '🌻', '🌺', '🦋']

const colorPalettes: Record<string, { primary: string; secondary: string; light: string; bg: string }[]> = {
  blue: [
    { primary: '#165DFF', secondary: '#4080FF', light: '#6BA3FF', bg: '#F0F7FF' },
    { primary: '#0E42D2', secondary: '#1D5BF0', light: '#5E8BFF', bg: '#E8F0FF' },
    { primary: '#0FC6C2', secondary: '#36CFC9', light: '#5CDBD3', bg: '#E6FFFB' }
  ],
  red: [
    { primary: '#F53F3F', secondary: '#FF6B6B', light: '#FF9C9C', bg: '#FFECE8' },
    { primary: '#CB2634', secondary: '#E34D59', light: '#F08080', bg: '#FFF0F0' },
    { primary: '#FF7D00', secondary: '#FF9A2E', light: '#FFB85C', bg: '#FFF7E8' }
  ],
  green: [
    { primary: '#00B42A', secondary: '#23C343', light: '#4CD263', bg: '#E8FFEA' },
    { primary: '#0FC88D', secondary: '#34D399', light: '#6EE7B7', bg: '#ECFDF5' },
    { primary: '#52C41A', secondary: '#73D13D', light: '#95DE64', bg: '#F6FFED' }
  ],
  purple: [
    { primary: '#722ED1', secondary: '#8E55E3', light: '#AB7FF0', bg: '#F9F0FF' },
    { primary: '#6750A4', secondary: '#8569C8', light: '#A490E0', bg: '#F3EEFF' },
    { primary: '#9254DE', secondary: '#AD68EA', light: '#C792F0', bg: '#FAF0FF' }
  ],
  orange: [
    { primary: '#FF7D00', secondary: '#FF9A2E', light: '#FFB85C', bg: '#FFF7E8' },
    { primary: '#F7BA1E', secondary: '#FFCC33', light: '#FFD966', bg: '#FFFBE6' },
    { primary: '#FB8C00', secondary: '#FFA726', light: '#FFB74D', bg: '#FFF8E1' }
  ],
  pink: [
    { primary: '#F5319D', secondary: '#F765B0', light: '#F999C3', bg: '#FFEAF4' },
    { primary: '#D946EF', secondary: '#E074F0', light: '#E8A2F2', bg: '#FAF0FF' },
    { primary: '#EC4899', secondary: '#F472B6', light: '#F9A8D4', bg: '#FDF2F8' }
  ],
  mono: [
    { primary: '#1D2129', secondary: '#4E5969', light: '#86909C', bg: '#F2F3F5' },
    { primary: '#2A2A2A', secondary: '#5A5A5A', light: '#8A8A8A', bg: '#F5F5F5' },
    { primary: '#333333', secondary: '#666666', light: '#999999', bg: '#FAFAFA' }
  ],
  auto: []
}

const fontsByStyle: Record<string, { nameStyle: Record<string, string>; englishStyle: Record<string, string>; sloganStyle: Record<string, string>; fontStyle: string }[]> = {
  minimal: [
    {
      fontStyle: '细体无衬线',
      nameStyle: { fontFamily: '"PingFang SC", "Helvetica Neue", Arial, sans-serif', fontWeight: '300', letterSpacing: '4px' },
      englishStyle: { fontFamily: '"Helvetica Neue", Arial, sans-serif', fontWeight: '200', letterSpacing: '2px', fontSize: '12px' },
      sloganStyle: { fontFamily: '"PingFang SC", sans-serif', fontWeight: '300', letterSpacing: '1px', fontSize: '10px' }
    },
    {
      fontStyle: '几何无衬线',
      nameStyle: { fontFamily: '"Helvetica Neue", Arial, sans-serif', fontWeight: '500', letterSpacing: '2px' },
      englishStyle: { fontFamily: 'Arial, sans-serif', fontWeight: '400', letterSpacing: '1px', fontSize: '12px' },
      sloganStyle: { fontFamily: 'Arial, sans-serif', fontWeight: '300', fontSize: '10px' }
    }
  ],
  tech: [
    {
      fontStyle: '现代黑体',
      nameStyle: { fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif', fontWeight: '700', letterSpacing: '1px' },
      englishStyle: { fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '600', letterSpacing: '3px', fontSize: '11px' },
      sloganStyle: { fontFamily: 'sans-serif', fontWeight: '400', letterSpacing: '2px', fontSize: '10px' }
    },
    {
      fontStyle: '未来感字体',
      nameStyle: { fontFamily: 'Arial, sans-serif', fontWeight: '900', letterSpacing: '-1px' },
      englishStyle: { fontFamily: 'Arial, sans-serif', fontWeight: '700', letterSpacing: '4px', fontSize: '11px' },
      sloganStyle: { fontFamily: 'sans-serif', fontWeight: '300', fontSize: '10px' }
    }
  ],
  retro: [
    {
      fontStyle: '衬线体',
      nameStyle: { fontFamily: '"Songti SC", "SimSun", Georgia, serif', fontWeight: '600', letterSpacing: '3px' },
      englishStyle: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: '500', fontSize: '12px', letterSpacing: '1px' },
      sloganStyle: { fontFamily: 'Georgia, serif', fontWeight: '400', fontSize: '10px', letterSpacing: '2px' }
    },
    {
      fontStyle: '手写衬线',
      nameStyle: { fontFamily: '"Kaiti SC", "KaiTi", Georgia, serif', fontWeight: '700', letterSpacing: '4px' },
      englishStyle: { fontFamily: 'Georgia, serif', fontWeight: '600', fontSize: '12px', fontStyle: 'italic' },
      sloganStyle: { fontFamily: '"Kaiti SC", serif', fontWeight: '500', fontSize: '10px' }
    }
  ],
  cute: [
    {
      fontStyle: '圆润卡通',
      nameStyle: { fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif', fontWeight: '700', letterSpacing: '1px' },
      englishStyle: { fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif', fontWeight: '700', fontSize: '12px' },
      sloganStyle: { fontFamily: 'sans-serif', fontWeight: '500', fontSize: '10px' }
    },
    {
      fontStyle: '柔软手写',
      nameStyle: { fontFamily: '"PingFang SC", sans-serif', fontWeight: '600', letterSpacing: '2px' },
      englishStyle: { fontFamily: '"Comic Sans MS", Arial, sans-serif', fontWeight: '600', fontSize: '12px' },
      sloganStyle: { fontFamily: 'sans-serif', fontWeight: '400', fontSize: '10px' }
    }
  ],
  luxury: [
    {
      fontStyle: '高端衬线',
      nameStyle: { fontFamily: '"Songti SC", Georgia, "Times New Roman", serif', fontWeight: '500', letterSpacing: '6px' },
      englishStyle: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: '400', letterSpacing: '4px', fontSize: '11px' },
      sloganStyle: { fontFamily: 'Georgia, serif', fontWeight: '300', letterSpacing: '3px', fontSize: '10px' }
    },
    {
      fontStyle: '经典罗马体',
      nameStyle: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: '600', letterSpacing: '5px' },
      englishStyle: { fontFamily: '"Times New Roman", serif', fontWeight: '500', letterSpacing: '3px', fontSize: '12px' },
      sloganStyle: { fontFamily: '"Times New Roman", serif', fontWeight: '400', fontSize: '10px' }
    }
  ],
  natural: [
    {
      fontStyle: '手写自然体',
      nameStyle: { fontFamily: '"Kaiti SC", "PingFang SC", sans-serif', fontWeight: '500', letterSpacing: '3px' },
      englishStyle: { fontFamily: 'Georgia, serif', fontWeight: '400', fontSize: '12px' },
      sloganStyle: { fontFamily: '"Kaiti SC", serif', fontWeight: '400', fontSize: '10px' }
    },
    {
      fontStyle: '清新圆体',
      nameStyle: { fontFamily: '"PingFang SC", sans-serif', fontWeight: '500', letterSpacing: '2px' },
      englishStyle: { fontFamily: 'Arial, sans-serif', fontWeight: '400', fontSize: '12px', letterSpacing: '1px' },
      sloganStyle: { fontFamily: 'sans-serif', fontWeight: '400', fontSize: '10px' }
    }
  ]
}

const layoutOptions = [
  { name: '图标在上', value: 'top' as const },
  { name: '图标在左', value: 'left' as const },
  { name: '圆形图标', value: 'circle' as const }
]

const STORAGE_KEY = 'brand_logo_history'

const brandForm = ref<BrandForm>({
  brandName: '',
  englishName: '',
  slogan: '',
  industry: '',
  audience: [],
  style: '',
  colorScheme: 'auto'
})

const isGenerating = ref(false)
const generatedLogos = ref<LogoDesign[]>([])
const selectedLogoIndex = ref(-1)

const currentStep = computed(() => {
  if (generatedLogos.value.length > 0) return 3
  if (brandForm.value.style) return 2
  if (brandForm.value.brandName || brandForm.value.industry) return 1
  return 0
})

const canGenerate = computed(() => {
  return brandForm.value.brandName.trim() !== '' &&
    brandForm.value.industry !== '' &&
    brandForm.value.style !== ''
})

const displayBrandName = computed(() => brandForm.value.brandName || '品牌名称')
const displayEnglishName = computed(() => brandForm.value.englishName)
const displaySlogan = computed(() => brandForm.value.slogan)

const selectedLogo = computed(() => {
  if (selectedLogoIndex.value >= 0 && selectedLogoIndex.value < generatedLogos.value.length) {
    return generatedLogos.value[selectedLogoIndex.value]
  }
  return null
})

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const getIconsForStyle = (style: string, industry: string): string[] => {
  if (style === 'minimal') return minimalIcons
  if (style === 'tech') return techIcons
  if (style === 'retro') return retroIcons
  if (style === 'cute') return cuteIcons
  if (style === 'luxury') return luxuryIcons
  if (style === 'natural') return naturalIcons
  return styleIcons[industry] || styleIcons.other
}

const getColorPalette = (scheme: string, style: string): { primary: string; secondary: string; light: string; bg: string } => {
  if (scheme === 'auto') {
    const autoPalettes = [...colorPalettes.blue, ...colorPalettes.green, ...colorPalettes.purple, ...colorPalettes.orange, ...colorPalettes.mono]
    if (style === 'tech') return getRandomItem([...colorPalettes.blue, colorPalettes.purple[0]])
    if (style === 'cute') return getRandomItem([...colorPalettes.pink, ...colorPalettes.orange])
    if (style === 'natural') return getRandomItem([...colorPalettes.green, colorPalettes.orange[1]])
    if (style === 'luxury') return getRandomItem([...colorPalettes.mono, colorPalettes.purple[0]])
    if (style === 'retro') return getRandomItem([...colorPalettes.orange, ...colorPalettes.red])
    return getRandomItem(autoPalettes)
  }
  return getRandomItem(colorPalettes[scheme] || colorPalettes.blue)
}

const generateLogos = async () => {
  if (!canGenerate.value) {
    ElMessage.warning('请填写品牌名称、行业和风格偏好')
    return
  }

  isGenerating.value = true
  selectedLogoIndex.value = -1

  await new Promise(resolve => setTimeout(resolve, 1500))

  const logos: LogoDesign[] = []
  const icons = getIconsForStyle(brandForm.value.style, brandForm.value.industry)
  const usedIcons = new Set<string>()

  for (let i = 0; i < 6; i++) {
    let icon = getRandomItem(icons)
    let attempts = 0
    while (usedIcons.has(icon) && attempts < 10) {
      icon = getRandomItem(icons)
      attempts++
    }
    usedIcons.add(icon)

    const layout = layoutOptions[i % 3]
    const colorPalette = getColorPalette(brandForm.value.colorScheme, brandForm.value.style)
    const fontConfig = getRandomItem(fontsByStyle[brandForm.value.style] || fontsByStyle.minimal)
    const nameSize = layout.value === 'circle' ? 20 : (layout.value === 'top' ? 24 : 22)
    const iconSize = layout.value === 'circle' ? 36 : (layout.value === 'top' ? 48 : 40)

    logos.push({
      styleName: styles.find(s => s.value === brandForm.value.style)?.label || '极简风',
      layoutName: layout.name,
      iconPosition: layout.value,
      icon,
      iconSize,
      primaryColor: colorPalette.primary,
      secondaryColor: colorPalette.secondary,
      lightColor: colorPalette.light,
      bgColor: colorPalette.bg,
      colorPalette: [colorPalette.primary, colorPalette.secondary, colorPalette.light],
      nameStyle: {
        ...fontConfig.nameStyle,
        color: colorPalette.primary,
        fontSize: nameSize + 'px'
      },
      englishStyle: {
        ...fontConfig.englishStyle,
        color: colorPalette.secondary
      },
      sloganStyle: {
        ...fontConfig.sloganStyle,
        color: colorPalette.light
      },
      canvasStyle: {
        fontFamily: fontConfig.nameStyle.fontFamily
      },
      fontStyle: fontConfig.fontStyle
    })
  }

  generatedLogos.value = logos
  selectedLogoIndex.value = 0
  isGenerating.value = false
  ElMessage.success('LOGO方案生成成功！')
}

const regenerateLogo = (index: number) => {
  if (index < 0 || index >= generatedLogos.value.length) return

  const icons = getIconsForStyle(brandForm.value.style, brandForm.value.industry)
  const layout = getRandomItem(layoutOptions)
  const colorPalette = getColorPalette(brandForm.value.colorScheme, brandForm.value.style)
  const fontConfig = getRandomItem(fontsByStyle[brandForm.value.style] || fontsByStyle.minimal)
  const nameSize = layout.value === 'circle' ? 20 : (layout.value === 'top' ? 24 : 22)
  const iconSize = layout.value === 'circle' ? 36 : (layout.value === 'top' ? 48 : 40)

  generatedLogos.value[index] = {
    styleName: styles.find(s => s.value === brandForm.value.style)?.label || '极简风',
    layoutName: layout.name,
    iconPosition: layout.value,
    icon: getRandomItem(icons),
    iconSize,
    primaryColor: colorPalette.primary,
    secondaryColor: colorPalette.secondary,
    lightColor: colorPalette.light,
    bgColor: colorPalette.bg,
    colorPalette: [colorPalette.primary, colorPalette.secondary, colorPalette.light],
    nameStyle: {
      ...fontConfig.nameStyle,
      color: colorPalette.primary,
      fontSize: nameSize + 'px'
    },
    englishStyle: {
      ...fontConfig.englishStyle,
      color: colorPalette.secondary
    },
    sloganStyle: {
      ...fontConfig.sloganStyle,
      color: colorPalette.light
    },
    canvasStyle: {
      fontFamily: fontConfig.nameStyle.fontFamily
    },
    fontStyle: fontConfig.fontStyle
  }

  ElMessage.success(`方案 ${index + 1} 已重新生成`)
}

const resetForm = () => {
  brandForm.value = {
    brandName: '',
    englishName: '',
    slogan: '',
    industry: '',
    audience: [],
    style: '',
    colorScheme: 'auto'
  }
  generatedLogos.value = []
  selectedLogoIndex.value = -1
  ElMessage.info('已重置所有选项')
}

const generateSvgContent = (logo: LogoDesign): string => {
  const width = 400
  const height = 300
  const centerX = width / 2
  const centerY = height / 2

  let content = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
  content += `<rect width="100%" height="100%" fill="${logo.bgColor}"/>`

  if (logo.iconPosition === 'top') {
    content += `<text x="${centerX}" y="${centerY - 30}" text-anchor="middle" fill="${logo.primaryColor}" font-size="${logo.iconSize}">${logo.icon}</text>`
    content += `<text x="${centerX}" y="${centerY + 20}" text-anchor="middle" fill="${logo.primaryColor}" font-size="${logo.nameStyle.fontSize}" font-weight="${logo.nameStyle.fontWeight}" letter-spacing="${logo.nameStyle.letterSpacing}">${displayBrandName.value}</text>`
    if (displayEnglishName.value) {
      content += `<text x="${centerX}" y="${centerY + 50}" text-anchor="middle" fill="${logo.secondaryColor}" font-size="14" font-weight="${logo.englishStyle.fontWeight}">${displayEnglishName.value}</text>`
    }
  } else if (logo.iconPosition === 'left') {
    const iconX = centerX - 100
    content += `<text x="${iconX}" y="${centerY + 15}" text-anchor="middle" fill="${logo.primaryColor}" font-size="${logo.iconSize}">${logo.icon}</text>`
    content += `<text x="${centerX + 20}" y="${centerY + 5}" text-anchor="start" fill="${logo.primaryColor}" font-size="${logo.nameStyle.fontSize}" font-weight="${logo.nameStyle.fontWeight}" letter-spacing="${logo.nameStyle.letterSpacing}">${displayBrandName.value}</text>`
    if (displayEnglishName.value) {
      content += `<text x="${centerX + 20}" y="${centerY + 35}" text-anchor="start" fill="${logo.secondaryColor}" font-size="12">${displayEnglishName.value}</text>`
    }
  } else {
    const circleR = 45
    content += `<circle cx="${centerX}" cy="${centerY - 40}" r="${circleR}" fill="${logo.primaryColor}"/>`
    content += `<text x="${centerX}" y="${centerY - 30}" text-anchor="middle" fill="#fff" font-size="${logo.iconSize * 0.7}">${logo.icon}</text>`
    content += `<text x="${centerX}" y="${centerY + 40}" text-anchor="middle" fill="${logo.primaryColor}" font-size="${logo.nameStyle.fontSize}" font-weight="${logo.nameStyle.fontWeight}" letter-spacing="${logo.nameStyle.letterSpacing}">${displayBrandName.value}</text>`
    if (displayEnglishName.value) {
      content += `<text x="${centerX}" y="${centerY + 65}" text-anchor="middle" fill="${logo.secondaryColor}" font-size="12">${displayEnglishName.value}</text>`
    }
  }

  content += '</svg>'
  return content
}

const downloadLogo = (index: number, format: 'svg' | 'png') => {
  const logo = generatedLogos.value[index]
  if (!logo) return

  const brand = displayBrandName.value || 'logo'

  if (format === 'svg') {
    const svgContent = generateSvgContent(logo)
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${brand}_方案${index + 1}.svg`
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success('SVG 下载成功')
  } else {
    const svgContent = generateSvgContent(logo)
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = logo.bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = pngUrl
            link.download = `${brand}_方案${index + 1}.png`
            link.click()
            URL.revokeObjectURL(pngUrl)
            ElMessage.success('PNG 下载成功')
          }
        }, 'image/png')
      }
      URL.revokeObjectURL(url)
    }
    img.src = url
  }
}
</script>

<style scoped>
.brand-logo-generator {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
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
  gap: 20px;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.style-option {
  padding: 16px 12px;
  border: 2px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;
  background: #fafafa;
}

.style-option:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  transform: translateY(-2px);
}

.style-option.active {
  border-color: #722ed1;
  background: linear-gradient(135deg, #f9f0ff 0%, #f3e8ff 100%);
  box-shadow: 0 4px 12px rgba(114, 46, 209, 0.15);
}

.style-option.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.style-icon {
  font-size: 28px;
  margin-bottom: 6px;
}

.style-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.style-desc {
  font-size: 11px;
  color: #909399;
}

.action-area {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.generate-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
  border: none;
}

.generate-btn:hover {
  background: linear-gradient(135deg, #6221c2 0%, #8240d8 100%);
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-preview {
  padding: 60px 24px;
  text-align: center;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border: 2px dashed #dcdfe6;
  border-radius: 12px;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 24px;
  line-height: 1.6;
}

.empty-tips {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  max-width: 240px;
  margin: 0 auto;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
}

.logo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.logo-card {
  border: 2px solid #ebeef5;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  background: #fff;
}

.logo-card:hover {
  border-color: #722ed1;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(114, 46, 209, 0.1);
}

.logo-card.selected {
  border-color: #722ed1;
  box-shadow: 0 0 0 3px rgba(114, 46, 209, 0.15);
}

.logo-index {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.logo-preview {
  padding: 32px 16px;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-canvas {
  text-align: center;
}

.logo-layout {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-layout-top {
  flex-direction: column;
  gap: 8px;
}

.logo-layout-left {
  gap: 16px;
  text-align: left;
}

.logo-layout-circle {
  flex-direction: column;
  gap: 12px;
}

.logo-icon {
  line-height: 1;
}

.logo-circle-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo-brand-name {
  font-weight: 700;
  line-height: 1.2;
}

.logo-english-name {
  opacity: 0.9;
}

.logo-slogan {
  opacity: 0.8;
}

.logo-meta {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fafafa;
}

.logo-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.logo-colors {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-label {
  font-size: 12px;
  color: #909399;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.color-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.logo-actions {
  padding: 10px 12px;
  display: flex;
  gap: 8px;
  border-top: 1px solid #ebeef5;
}

.logo-actions .el-button {
  flex: 1;
}

.detail-card {
  margin-bottom: 24px;
}

.detail-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.detail-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.bg-variants {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bg-variant-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bg-label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.bg-preview {
  padding: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.light-bg {
  background: #fff;
  border: 1px solid #ebeef5;
}

.dark-bg {
  background: #1a1a1a;
}

.transparent-bg {
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  background-color: #fff;
}

.detail-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-actions .el-button {
  width: 100%;
}

.scenario-card {
  margin-bottom: 24px;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.scenario-item {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  transition: all 0.3s;
}

.scenario-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #722ed1;
}

.scenario-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.scenario-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.scenario-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .generator-container {
    grid-template-columns: 1fr;
  }

  .detail-container {
    grid-template-columns: 1fr;
  }

  .scenario-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .style-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .logo-grid {
    grid-template-columns: 1fr;
  }

  .scenario-grid {
    grid-template-columns: 1fr;
  }
}
</style>
