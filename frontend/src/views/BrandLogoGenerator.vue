<template>
  <div class="brand-logo-generator">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>品牌LOGO智能设计系统 · 心理学驱动</span>
          <el-tag size="small" type="primary" effect="dark">荣格原型 × 色彩心理学 × AI</el-tag>
        </div>
      </template>
      <el-steps :active="currentStep" finish-status="success" simple class="guide-steps">
        <el-step title="品牌基础信息" description="名称、行业、定位" />
        <el-step title="受众画像" description="年龄、消费心理、性别倾向" />
        <el-step title="人格与风格" description="12种原型、设计风格、色调" />
        <el-step title="AI分析报告" description="雷达图、策略建议、配色分析" />
        <el-step title="生成LOGO方案" description="契合度评分、设计原理解析" />
      </el-steps>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#722ed1">
            <Brush />
          </el-icon>
          <span>品牌LOGO智能设计系统</span>
          <el-tag size="small" type="success">心理学×设计学×AI</el-tag>
        </div>
      </template>

      <el-tabs v-model="activeTab" class="main-tabs" type="card">
        <el-tab-pane label="品牌基础信息" name="basic">
          <template #label>
            <span class="tab-label">
              <el-icon><Document /></el-icon>
              品牌基础信息
            </span>
          </template>
          <el-form :model="brandForm" label-width="120px" label-position="left" :disabled="isGenerating">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="品牌名称" required>
                  <el-input
                    v-model="brandForm.brandName"
                    placeholder="如：星辰科技、甜心烘焙"
                    maxlength="20"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="英文名称">
                  <el-input
                    v-model="brandForm.englishName"
                    placeholder="如：Stellar Tech（可选）"
                    maxlength="30"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="品牌标语">
              <el-input
                v-model="brandForm.slogan"
                placeholder="如：让创意点亮生活（可选）"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="所属行业" required>
                  <el-select v-model="brandForm.industry" placeholder="请选择行业" style="width: 100%;" @change="onIndustryChange">
                    <el-option v-for="ind in industries" :key="ind.value" :label="ind.label" :value="ind.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="品牌定位" required>
                  <el-radio-group v-model="brandForm.positioning">
                    <el-radio-button v-for="p in positionings" :key="p.value" :value="p.value">
                      {{ p.label }}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="价格定位">
              <div class="price-slider-wrap">
                <el-slider
                  v-model="brandForm.priceLevel"
                  :min="1"
                  :max="5"
                  :step="1"
                  show-stops
                  :marks="priceMarks"
                />
              </div>
            </el-form-item>
            <el-alert
              v-if="industryInsight"
              :title="industryInsight.title"
              :type="industryInsight.type"
              :description="industryInsight.desc"
              show-icon
              :closable="false"
              class="industry-insight"
            />
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="目标受众画像" name="audience">
          <template #label>
            <span class="tab-label">
              <el-icon><User /></el-icon>
              目标受众画像
            </span>
          </template>
          <el-form label-width="120px" label-position="left" :disabled="isGenerating">
            <el-form-item label="目标受众">
              <el-checkbox-group v-model="brandForm.audiences">
                <el-checkbox v-for="a in audienceOptions" :key="a.value" :label="a.value" border>
                  {{ a.icon }} {{ a.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="年龄段范围">
              <div class="age-slider-wrap">
                <el-slider
                  v-model="brandForm.ageRange"
                  range
                  :min="5"
                  :max="75"
                  :step="5"
                  show-stops
                />
                <div class="age-range-display">
                  <el-tag type="primary" effect="plain">{{ brandForm.ageRange[0] }}岁</el-tag>
                  <span class="range-arrow">→</span>
                  <el-tag type="warning" effect="plain">{{ brandForm.ageRange[1] }}岁</el-tag>
                  <span class="range-hint">核心年龄段：{{ getAgeGroupLabel(brandForm.ageRange) }}</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="消费心理">
              <div class="psychology-grid">
                <div
                  v-for="p in psychologyOptions"
                  :key="p.value"
                  class="psychology-card"
                  :class="{ active: brandForm.psychologies.includes(p.value) }"
                  @click="togglePsychology(p.value)"
                >
                  <div class="psy-icon">{{ p.icon }}</div>
                  <div class="psy-name">{{ p.label }}</div>
                  <div class="psy-desc">{{ p.desc }}</div>
                  <div v-if="brandForm.psychologies.includes(p.value)" class="psy-check">
                    <el-icon color="#fff"><CircleCheckFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="性别倾向">
              <el-radio-group v-model="brandForm.genderBias">
                <el-radio-button value="neutral">
                  <el-icon><Coin /></el-icon> 中性均衡
                </el-radio-button>
                <el-radio-button value="female">
                  <el-icon><Female /></el-icon> 偏向女性
                </el-radio-button>
                <el-radio-button value="male">
                  <el-icon><Male /></el-icon> 偏向男性
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="品牌人格与风格" name="personality">
          <template #label>
            <span class="tab-label">
              <el-icon><MagicStick /></el-icon>
              品牌人格与风格
            </span>
          </template>
          <el-form label-width="120px" label-position="left" :disabled="isGenerating">
            <el-form-item label="品牌人格原型">
              <div class="prototype-hint">
                <el-icon color="#722ed1"><InfoFilled /></el-icon>
                <span>荣格品牌原型理论，可选1-3个（已选 {{ brandForm.archetypes.length }}/3）</span>
              </div>
              <div class="archetype-grid">
                <div
                  v-for="a in archetypes"
                  :key="a.value"
                  class="archetype-card"
                  :class="{
                    active: brandForm.archetypes.includes(a.value),
                    disabled: !brandForm.archetypes.includes(a.value) && brandForm.archetypes.length >= 3
                  }"
                  @click="toggleArchetype(a.value)"
                >
                  <div class="arc-emoji">{{ a.emoji }}</div>
                  <div class="arc-name">{{ a.label }}</div>
                  <div class="arc-trait">{{ a.coreTrait }}</div>
                  <div v-if="brandForm.archetypes.includes(a.value)" class="arc-check">
                    <el-icon color="#fff"><CircleCheckFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="设计风格" required>
              <div class="style-grid">
                <div
                  v-for="style in styles"
                  :key="style.value"
                  class="style-option"
                  :class="{ active: brandForm.style === style.value }"
                  @click="brandForm.style = style.value"
                >
                  <div class="style-icon">{{ style.icon }}</div>
                  <div class="style-name">{{ style.label }}</div>
                  <div class="style-desc">{{ style.desc }}</div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="色调偏好">
              <el-radio-group v-model="brandForm.colorScheme">
                <el-radio-button v-for="scheme in colorSchemes" :key="scheme.value" :value="scheme.value">
                  {{ scheme.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="价值关键词">
              <el-select
                v-model="brandForm.valueKeywords"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="选择或输入关键词，如：专业、温暖、创新..."
                style="width: 100%;"
              >
                <el-option v-for="k in defaultKeywords" :key="k" :label="k" :value="k" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="AI品牌分析报告" name="analysis">
          <template #label>
            <span class="tab-label">
              <el-icon><DataAnalysis /></el-icon>
              AI品牌分析报告
              <el-tag v-if="hasEnoughData" size="small" type="success" effect="dark">已就绪</el-tag>
              <el-tag v-else size="small" type="info">请先填写信息</el-tag>
            </span>
          </template>
          <div v-if="hasEnoughData" class="analysis-content">
            <el-row :gutter="24">
              <el-col :span="10">
                <div class="radar-section">
                  <div class="section-title">
                    <el-icon color="#722ed1"><Aim /></el-icon>
                    <span>品牌定位雷达图</span>
                  </div>
                  <div class="radar-container">
                    <svg viewBox="0 0 400 400" class="radar-svg">
                      <defs>
                        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#722ed1;stop-opacity:0.5" />
                          <stop offset="100%" style="stop-color:#165DFF;stop-opacity:0.3" />
                        </linearGradient>
                      </defs>
                      <g v-for="i in 5" :key="'ring-'+i">
                        <polygon
                          :points="getRadarPolygonPoints(i * 20)"
                          fill="none"
                          stroke="#e4e7ed"
                          stroke-width="1"
                          stroke-dasharray="4,4"
                        />
                      </g>
                      <g v-for="(dim, idx) in radarDimensions" :key="'axis-'+dim.key">
                        <line
                          x1="200" y1="200"
                          :x2="getRadarPoint(idx, 100).x"
                          :y2="getRadarPoint(idx, 100).y"
                          stroke="#dcdfe6"
                          stroke-width="1"
                        />
                      </g>
                      <polygon
                        :points="radarDataPoints"
                        fill="url(#radarGradient)"
                        stroke="#722ed1"
                        stroke-width="2"
                        class="radar-polygon"
                      />
                      <g v-for="(dim, idx) in radarDimensions" :key="'point-'+dim.key">
                        <circle
                          :cx="getRadarPoint(idx, radarScores[dim.key]).x"
                          :cy="getRadarPoint(idx, radarScores[dim.key]).y"
                          r="5"
                          fill="#722ed1"
                          stroke="#fff"
                          stroke-width="2"
                        />
                      </g>
                      <g v-for="(dim, idx) in radarDimensions" :key="'label-'+dim.key">
                        <text
                          :x="getRadarLabelPoint(idx).x"
                          :y="getRadarLabelPoint(idx).y"
                          text-anchor="middle"
                          dominant-baseline="middle"
                          class="radar-label"
                        >
                          {{ dim.label }}
                        </text>
                        <text
                          :x="getRadarLabelPoint(idx).x"
                          :y="getRadarLabelPoint(idx).y + 16"
                          text-anchor="middle"
                          class="radar-score"
                        >
                          {{ radarScores[dim.key] }}分
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>
              </el-col>
              <el-col :span="14">
                <div class="strategy-section">
                  <div class="section-title">
                    <el-icon color="#165DFF"><LightBulb /></el-icon>
                    <span>AI设计策略建议</span>
                  </div>
                  <div class="strategy-list">
                    <div v-for="(s, i) in designStrategies" :key="i" class="strategy-item">
                      <div class="strategy-index">{{ i + 1 }}</div>
                      <div class="strategy-content">
                        <div class="strategy-title">{{ s.title }}</div>
                        <div class="strategy-desc">{{ s.desc }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="color-analysis-section" style="margin-top: 24px;">
              <div class="section-title">
                <el-icon color="#f56c6c"><Brush /></el-icon>
                <span>配色心理学分析</span>
                <span class="section-subtitle">基于品牌人格、受众、行业的智能配色推荐</span>
              </div>
              <div class="color-palette-list">
                <div v-for="(c, i) in recommendedColors" :key="i" class="color-card">
                  <div class="color-preview" :style="{ background: c.color }">
                    <span v-if="c.isLight" class="color-hex dark">{{ c.color }}</span>
                    <span v-else class="color-hex">{{ c.color }}</span>
                  </div>
                  <div class="color-info">
                    <div class="color-name">{{ c.name }} · 匹配度 {{ c.score }}%</div>
                    <div class="color-meaning">{{ c.meaning }}</div>
                    <div class="color-tags">
                      <el-tag v-for="t in c.tags" :key="t" size="small" effect="plain">{{ t }}</el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="请先填写品牌基础信息、受众画像和品牌人格，系统将自动生成专业分析报告" />
        </el-tab-pane>
      </el-tabs>

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
          {{ isGenerating ? 'AI智能设计中...' : '基于心理学生成LOGO方案' }}
        </el-button>
        <el-button size="large" :icon="Refresh" @click="resetForm" :disabled="isGenerating">
          重置所有
        </el-button>
        <div class="completeness-indicator" v-if="!canGenerate">
          <el-icon color="#e6a23c"><WarningFilled /></el-icon>
          <span>请完善必填项：品牌名称、行业、品牌定位、设计风格</span>
        </div>
      </div>
    </el-card>

    <el-card v-if="generatedLogos.length > 0" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <PictureFilled />
          </el-icon>
          <span>LOGO设计方案</span>
          <el-tag size="small" type="success">共 {{ generatedLogos.length }} 款方案</el-tag>
          <el-tag size="small" type="info">加权匹配引擎</el-tag>
        </div>
      </template>

      <div class="logo-grid">
        <div
          v-for="(logo, index) in generatedLogos"
          :key="index"
          class="logo-card"
          :class="{ selected: selectedLogoIndex === index }"
          @click="selectedLogoIndex = index"
        >
          <div class="logo-header">
            <span class="logo-index-badge">方案 {{ index + 1 }}</span>
            <div class="fitness-badge" :style="{ background: getFitnessColor(logo.fitnessScore) }">
              <el-icon color="#fff"><Star /></el-icon>
              {{ logo.fitnessScore }}% 契合度
            </div>
          </div>
          <div class="logo-preview" :style="{ background: logo.bgColor }">
            <div class="logo-canvas" :style="logo.canvasStyle">
              <LogoLayoutRenderer :logo="logo" :brandName="displayBrandName" :englishName="displayEnglishName" :slogan="displaySlogan" :lightMode="false" />
            </div>
          </div>
          <div class="logo-personality-tags">
            <el-tag
              v-for="p in logo.matchedPersonalities"
              :key="p"
              size="small"
              type="warning"
              effect="light"
              class="personality-tag"
            >
              {{ getArchetypeLabel(p) }}
            </el-tag>
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
          <div class="design-principles">
            <div class="dp-title">
              <el-icon color="#722ed1"><Reading /></el-icon>
              设计原理说明
            </div>
            <ul class="dp-list">
              <li v-for="(p, pi) in logo.designPrinciples" :key="pi">
                <span class="dp-icon">{{ p.icon }}</span>
                <span class="dp-label">{{ p.label }}：</span>
                <span class="dp-text">{{ p.text }}</span>
              </li>
            </ul>
          </div>
          <div class="logo-actions" v-if="selectedLogoIndex === index">
            <el-button size="small" type="primary" :icon="Download" @click.stop="downloadLogo(index, 'svg')">
              下载SVG
            </el-button>
            <el-button size="small" :icon="Download" @click.stop="downloadLogo(index, 'png')">
              下载PNG
            </el-button>
            <el-button size="small" type="success" :icon="RefreshRight" @click.stop="regenerateLogo(index)">
              重新生成
            </el-button>
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
          <span>方案详情 · 多背景展示</span>
          <el-tag size="small" type="primary">方案 {{ selectedLogoIndex + 1 }}</el-tag>
          <el-tag size="small" :color="getFitnessColor(selectedLogo.fitnessScore)" effect="dark" style="color: #fff;">
            契合度 {{ selectedLogo.fitnessScore }}%
          </el-tag>
        </div>
      </template>

      <div class="detail-container">
        <div class="detail-preview-section">
          <div class="bg-variants">
            <div class="bg-variant-item">
              <div class="bg-label">浅色背景</div>
              <div class="bg-preview light-bg">
                <div class="logo-canvas" :style="selectedLogo.canvasStyle">
                  <LogoLayoutRenderer :logo="selectedLogo" :brandName="displayBrandName" :englishName="displayEnglishName" :slogan="displaySlogan" :lightMode="false" />
                </div>
              </div>
            </div>
            <div class="bg-variant-item">
              <div class="bg-label">深色背景</div>
              <div class="bg-preview dark-bg">
                <div class="logo-canvas" :style="{ ...selectedLogo.canvasStyle, color: '#fff' }">
                  <LogoLayoutRenderer :logo="selectedLogo" :brandName="displayBrandName" :englishName="displayEnglishName" :slogan="displaySlogan" :lightMode="true" />
                </div>
              </div>
            </div>
            <div class="bg-variant-item">
              <div class="bg-label">透明背景</div>
              <div class="bg-preview transparent-bg">
                <div class="logo-canvas" :style="selectedLogo.canvasStyle">
                  <LogoLayoutRenderer :logo="selectedLogo" :brandName="displayBrandName" :englishName="displayEnglishName" :slogan="displaySlogan" :lightMode="false" />
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
            <el-descriptions-item label="品牌契合度">
              <el-progress
                :percentage="selectedLogo.fitnessScore"
                :color="getFitnessColor(selectedLogo.fitnessScore)"
                :stroke-width="10"
              />
            </el-descriptions-item>
            <el-descriptions-item label="匹配人格">
              <div class="inline-tags">
                <el-tag v-for="p in selectedLogo.matchedPersonalities" :key="p" size="small" type="warning" effect="light">
                  {{ getArchetypeLabel(p) }}
                </el-tag>
              </div>
            </el-descriptions-item>
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

          <div class="detail-title" style="margin-top: 20px;">设计原理解析</div>
          <div class="detail-principles">
            <div v-for="(p, pi) in selectedLogo.designPrinciples" :key="pi" class="dp-detail-item">
              <div class="dp-detail-icon">{{ p.icon }}</div>
              <div class="dp-detail-content">
                <div class="dp-detail-label">{{ p.label }}</div>
                <div class="dp-detail-text">{{ p.text }}</div>
              </div>
            </div>
          </div>

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
          <div class="scenario-desc">创业者、小微企业基于心理学快速建立品牌视觉识别系统</div>
        </div>
        <div class="scenario-item">
          <div class="scenario-icon">📱</div>
          <div class="scenario-title">社交媒体</div>
          <div class="scenario-desc">公众号、小红书、抖音等平台账号头像与视觉元素</div>
        </div>
        <div class="scenario-item">
          <div class="scenario-icon">🛒</div>
          <div class="scenario-title">电商店铺</div>
          <div class="scenario-desc">淘宝、京东、拼多多等店铺店标和品牌装修</div>
        </div>
        <div class="scenario-item">
          <div class="scenario-icon">✍️</div>
          <div class="scenario-title">内容创作者</div>
          <div class="scenario-desc">UP主、博主、自媒体打造个人IP品牌视觉标识</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue'
import {
  Brush,
  View,
  MagicStick,
  Refresh,
  RefreshRight,
  Download,
  InfoFilled,
  Guide,
  PictureFilled,
  CircleCheck,
  CircleCheckFilled,
  ZoomIn,
  Document,
  User,
  DataAnalysis,
  Aim,
  LightBulb,
  Reading,
  Star,
  WarningFilled,
  Coin,
  Female,
  Male
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface BrandForm {
  brandName: string
  englishName: string
  slogan: string
  industry: string
  positioning: string
  priceLevel: number
  audiences: string[]
  ageRange: [number, number]
  psychologies: string[]
  genderBias: string
  archetypes: string[]
  style: string
  colorScheme: string
  valueKeywords: string[]
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
  fitnessScore: number
  matchedPersonalities: string[]
  designPrinciples: DesignPrinciple[]
}

interface DesignPrinciple {
  icon: string
  label: string
  text: string
}

interface ColorAnalysis {
  color: string
  name: string
  meaning: string
  tags: string[]
  isLight: boolean
  score: number
}

interface DesignStrategy {
  title: string
  desc: string
}

interface IndustryInsight {
  title: string
  type: 'info' | 'success' | 'warning'
  desc: string
}

const LogoLayoutRenderer = defineComponent({
  name: 'LogoLayoutRenderer',
  props: {
    logo: { type: Object as () => LogoDesign, required: true },
    brandName: { type: String, required: true },
    englishName: { type: String, default: '' },
    slogan: { type: String, default: '' },
    lightMode: { type: Boolean, default: false }
  },
  setup(props) {
    return () => {
      const logo = props.logo
      const textColor = props.lightMode ? '#fff' : logo.primaryColor
      const iconColor = props.lightMode ? logo.lightColor : logo.primaryColor
      const secondaryColor = props.lightMode ? logo.lightColor : logo.secondaryColor

      const renderTextGroup = () => {
        const children: any[] = [
          h('div', { class: 'logo-brand-name', style: { ...logo.nameStyle, color: textColor } }, props.brandName)
        ]
        if (props.englishName) {
          children.push(
            h('div', { class: 'logo-english-name', style: { ...logo.englishStyle, color: secondaryColor } }, props.englishName)
          )
        }
        if (props.slogan) {
          children.push(
            h('div', { class: 'logo-slogan', style: { ...logo.sloganStyle, color: props.lightMode ? logo.lightColor : logo.lightColor } }, props.slogan)
          )
        }
        return children
      }

      if (logo.iconPosition === 'top') {
        return h('div', { class: 'logo-layout logo-layout-top' }, [
          h('div', { class: 'logo-icon', style: { color: iconColor, fontSize: logo.iconSize + 'px' } }, logo.icon),
          ...renderTextGroup()
        ])
      }
      if (logo.iconPosition === 'left') {
        return h('div', { class: 'logo-layout logo-layout-left' }, [
          h('div', { class: 'logo-icon', style: { color: iconColor, fontSize: logo.iconSize + 'px' } }, logo.icon),
          h('div', { class: 'logo-text-group' }, renderTextGroup())
        ])
      }
      return h('div', { class: 'logo-layout logo-layout-circle' }, [
        h('div', { class: 'logo-circle-icon', style: { background: iconColor, color: props.lightMode ? '#1a1a1a' : '#fff' } }, [
          h('span', { style: { fontSize: (logo.iconSize * 0.7) + 'px' } }, logo.icon)
        ]),
        ...renderTextGroup()
      ])
    }
  }
})

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

const positionings = [
  { label: '亲民大众', value: 'mass' },
  { label: '品质优选', value: 'quality' },
  { label: '高端奢华', value: 'luxury' },
  { label: '小众个性', value: 'niche' }
]

const priceMarks: Record<number, string> = {
  1: '💰 平价',
  2: '💰💰 中低',
  3: '💰💰💰 中等',
  4: '💰💰💰💰 中高',
  5: '💰💰💰💰💰 高端'
}

const audienceOptions = [
  { label: 'Z世代', value: 'genz', icon: '🎮' },
  { label: '千禧一代', value: 'millennial', icon: '💻' },
  { label: '商务人士', value: 'business', icon: '💼' },
  { label: '家庭用户', value: 'family', icon: '👨‍👩‍👧' },
  { label: '学生群体', value: 'student', icon: '📚' },
  { label: '宝妈群体', value: 'mom', icon: '🍼' },
  { label: '银发族', value: 'senior', icon: '🏡' },
  { label: '高净值人群', value: 'premium', icon: '💎' }
]

const psychologyOptions = [
  { value: 'cost', label: '性价比', icon: '💰', desc: '追求物超所值' },
  { value: 'quality', label: '品质', icon: '⭐', desc: '注重品质与工艺' },
  { value: 'trend', label: '潮流', icon: '🔥', desc: '追逐最新趋势' },
  { value: 'emotion', label: '情感', icon: '❤️', desc: '情感共鸣与连接' },
  { value: 'individuality', label: '个性', icon: '🎨', desc: '表达独特自我' },
  { value: 'social', label: '社交', icon: '👥', desc: '社交货币属性' },
  { value: 'eco', label: '环保', icon: '🌿', desc: '可持续与环保' },
  { value: 'efficiency', label: '效率', icon: '⚡', desc: '高效便捷体验' }
]

const archetypes = [
  { value: 'innocent', label: '纯真', emoji: '🌈', coreTrait: '乐观·纯粹·快乐' },
  { value: 'sage', label: '智者', emoji: '📖', coreTrait: '智慧·求真·洞察' },
  { value: 'explorer', label: '探索者', emoji: '🧭', coreTrait: '自由·冒险·发现' },
  { value: 'outlaw', label: '颠覆者', emoji: '🔥', coreTrait: '革命·打破·创新' },
  { value: 'magician', label: '魔法师', emoji: '✨', coreTrait: '愿景·转变·魔力' },
  { value: 'hero', label: '英雄', emoji: '⚔️', coreTrait: '勇气·成就·超越' },
  { value: 'lover', label: '情人', emoji: '🌹', coreTrait: '热情·美好·连接' },
  { value: 'jester', label: '弄臣', emoji: '🎭', coreTrait: '快乐·幽默·活力' },
  { value: 'everyman', label: '凡人', emoji: '🤝', coreTrait: '务实·平等·归属' },
  { value: 'caregiver', label: '照顾者', emoji: '🌻', coreTrait: '关怀·保护·奉献' },
  { value: 'ruler', label: '统治者', emoji: '👑', coreTrait: '权威·秩序·领导' },
  { value: 'creator', label: '创造者', emoji: '🎨', coreTrait: '创新·想象·表达' }
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
  { label: 'AI智能推荐', value: 'auto' },
  { label: '蓝色系', value: 'blue' },
  { label: '红色系', value: 'red' },
  { label: '绿色系', value: 'green' },
  { label: '紫色系', value: 'purple' },
  { label: '橙黄色系', value: 'orange' },
  { label: '粉紫色系', value: 'pink' },
  { label: '黑白灰', value: 'mono' }
]

const defaultKeywords = [
  '专业', '可靠', '创新', '温暖', '年轻', '高端', '时尚', '活力',
  '稳重', '亲切', '科技', '自然', '优雅', '有趣', '品质', '独特'
]

const radarDimensions = [
  { key: 'professional', label: '专业感', angle: -90 },
  { key: 'friendly', label: '亲和力', angle: -30 },
  { key: 'innovative', label: '创新性', angle: 30 },
  { key: 'reliable', label: '可靠度', angle: 90 },
  { key: 'energetic', label: '活力值', angle: 150 },
  { key: 'quality', label: '品质感', angle: 210 }
] as const

type RadarKey = typeof radarDimensions[number]['key']

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

const archetypeColorPreferences: Record<string, string[]> = {
  innocent: ['#FF7D00', '#F7BA1E', '#EC4899', '#0FC88D'],
  sage: ['#165DFF', '#1D2129', '#0FC6C2', '#52C41A'],
  explorer: ['#FF7D00', '#0FC88D', '#F53F3F', '#0E42D2'],
  outlaw: ['#F53F3F', '#722ED1', '#1D2129', '#FF7D00'],
  magician: ['#722ED1', '#9254DE', '#165DFF', '#F5319D'],
  hero: ['#165DFF', '#F53F3F', '#1D2129', '#FF7D00'],
  lover: ['#F5319D', '#EC4899', '#F53F3F', '#722ED1'],
  jester: ['#F7BA1E', '#FF7D00', '#F5319D', '#0FC88D'],
  everyman: ['#52C41A', '#0FC6C2', '#86909C', '#FF7D00'],
  caregiver: ['#0FC88D', '#F5319D', '#FF7D00', '#52C41A'],
  ruler: ['#1D2129', '#F7BA1E', '#722ED1', '#165DFF'],
  creator: ['#F5319D', '#722ED1', '#F7BA1E', '#165DFF']
}

const audienceColorPreferences: Record<string, string[]> = {
  genz: ['#722ED1', '#F5319D', '#F7BA1E', '#0FC88D'],
  millennial: ['#165DFF', '#0FC6C2', '#722ED1', '#F53F3F'],
  business: ['#165DFF', '#1D2129', '#0FC6C2', '#722ED1'],
  family: ['#52C41A', '#FF7D00', '#0FC88D', '#F7BA1E'],
  student: ['#FF7D00', '#F7BA1E', '#722ED1', '#0FC88D'],
  mom: ['#F5319D', '#0FC88D', '#F7BA1E', '#EC4899'],
  senior: ['#165DFF', '#52C41A', '#86909C', '#0FC6C2'],
  premium: ['#1D2129', '#F7BA1E', '#722ED1', '#86909C']
}

const genderColorPreferences: Record<string, string[]> = {
  neutral: ['#165DFF', '#722ED1', '#0FC6C2', '#1D2129'],
  female: ['#F5319D', '#EC4899', '#722ED1', '#F7BA1E'],
  male: ['#165DFF', '#1D2129', '#0FC6C2', '#F53F3F']
}

const ageColorPreferences = (ageMin: number, ageMax: number): string[] => {
  const avgAge = (ageMin + ageMax) / 2
  if (avgAge < 18) return ['#F7BA1E', '#F5319D', '#FF7D00', '#0FC88D']
  if (avgAge < 30) return ['#722ED1', '#165DFF', '#F5319D', '#0FC6C2']
  if (avgAge < 45) return ['#165DFF', '#0FC6C2', '#722ED1', '#F7BA1E']
  if (avgAge < 60) return ['#1D2129', '#165DFF', '#52C41A', '#86909C']
  return ['#165DFF', '#52C41A', '#86909C', '#0FC6C2']
}

const colorPalettes: Record<string, { primary: string; secondary: string; light: string; bg: string }[]> = {
  blue: [
    { primary: '#165DFF', secondary: '#4080FF', light: '#6BA3FF', bg: '#F0F7FF' },
    { primary: '#0E42D2', secondary: '#1D5BF0', light: '#5E8BFF', bg: '#E8F0FF' },
    { primary: '#0FC6C2', secondary: '#36CFC9', light: '#5CDBD3', bg: '#E6FFFB' },
    { primary: '#4080FF', secondary: '#6BA3FF', light: '#9CC5FF', bg: '#F0F7FF' }
  ],
  red: [
    { primary: '#F53F3F', secondary: '#FF6B6B', light: '#FF9C9C', bg: '#FFECE8' },
    { primary: '#CB2634', secondary: '#E34D59', light: '#F08080', bg: '#FFF0F0' },
    { primary: '#FF7D00', secondary: '#FF9A2E', light: '#FFB85C', bg: '#FFF7E8' },
    { primary: '#FF6B6B', secondary: '#FF9C9C', light: '#FFC9C9', bg: '#FFECE8' }
  ],
  green: [
    { primary: '#00B42A', secondary: '#23C343', light: '#4CD263', bg: '#E8FFEA' },
    { primary: '#0FC88D', secondary: '#34D399', light: '#6EE7B7', bg: '#ECFDF5' },
    { primary: '#52C41A', secondary: '#73D13D', light: '#95DE64', bg: '#F6FFED' },
    { primary: '#23C343', secondary: '#4CD263', light: '#7BE08C', bg: '#E8FFEA' }
  ],
  purple: [
    { primary: '#722ED1', secondary: '#8E55E3', light: '#AB7FF0', bg: '#F9F0FF' },
    { primary: '#6750A4', secondary: '#8569C8', light: '#A490E0', bg: '#F3EEFF' },
    { primary: '#9254DE', secondary: '#AD68EA', light: '#C792F0', bg: '#FAF0FF' },
    { primary: '#D946EF', secondary: '#E074F0', light: '#E8A2F2', bg: '#FAF0FF' }
  ],
  orange: [
    { primary: '#FF7D00', secondary: '#FF9A2E', light: '#FFB85C', bg: '#FFF7E8' },
    { primary: '#F7BA1E', secondary: '#FFCC33', light: '#FFD966', bg: '#FFFBE6' },
    { primary: '#FB8C00', secondary: '#FFA726', light: '#FFB74D', bg: '#FFF8E1' },
    { primary: '#FF9A2E', secondary: '#FFB85C', light: '#FFD18A', bg: '#FFF7E8' }
  ],
  pink: [
    { primary: '#F5319D', secondary: '#F765B0', light: '#F999C3', bg: '#FFEAF4' },
    { primary: '#D946EF', secondary: '#E074F0', light: '#E8A2F2', bg: '#FAF0FF' },
    { primary: '#EC4899', secondary: '#F472B6', light: '#F9A8D4', bg: '#FDF2F8' },
    { primary: '#FF6B6B', secondary: '#F765B0', light: '#F999C3', bg: '#FFEAF4' }
  ],
  mono: [
    { primary: '#1D2129', secondary: '#4E5969', light: '#86909C', bg: '#F2F3F5' },
    { primary: '#2A2A2A', secondary: '#5A5A5A', light: '#8A8A8A', bg: '#F5F5F5' },
    { primary: '#333333', secondary: '#666666', light: '#999999', bg: '#FAFAFA' },
    { primary: '#4E5969', secondary: '#86909C', light: '#C9CDD4', bg: '#F2F3F5' }
  ],
  auto: []
}

const colorPsychology: Record<string, { name: string; meaning: string; tags: string[]; isLight: boolean }> = {
  '#165DFF': { name: '科技蓝', meaning: '传达专业、信任与科技感，激发用户对可靠性的认知，适合科技、金融品牌', tags: ['专业', '信任', '科技'], isLight: false },
  '#722ED1': { name: '创意紫', meaning: '象征创造力、奢华与神秘感，吸引追求独特的受众，适合文创、美妆品牌', tags: ['创意', '奢华', '独特'], isLight: false },
  '#00B42A': { name: '生命绿', meaning: '代表健康、自然与成长，传达环保和有机理念，适合健康、农业品牌', tags: ['健康', '自然', '环保'], isLight: false },
  '#F53F3F': { name: '活力红', meaning: '激发热情、紧迫感与行动力，适合促销和年轻化品牌，能快速吸引注意力', tags: ['热情', '活力', '年轻'], isLight: false },
  '#FF7D00': { name: '温暖橙', meaning: '传达友好、乐观与创意，营造亲切感，适合餐饮、教育、零售品牌', tags: ['温暖', '乐观', '友好'], isLight: false },
  '#F5319D': { name: '魅力粉', meaning: '传达柔美、浪漫与关怀，女性向品牌的理想选择，适合美妆、母婴', tags: ['柔美', '浪漫', '关怀'], isLight: false },
  '#0FC6C2': { name: '清新青', meaning: '平衡现代感与亲和力，传达创新与专业的结合，适合科技、健康品牌', tags: ['清新', '现代', '创新'], isLight: false },
  '#1D2129': { name: '经典黑', meaning: '极简高端、永恒优雅，适合奢华和极简品牌，传递品质与权威感', tags: ['高端', '经典', '优雅'], isLight: false },
  '#52C41A': { name: '田园绿', meaning: '自然有机、清新朴素，适合农业和健康品牌，增强天然与信任感', tags: ['有机', '清新', '健康'], isLight: false },
  '#F7BA1E': { name: '活力黄', meaning: '乐观积极、年轻活力，吸引注意力，适合创意、教育、零售品牌', tags: ['乐观', '年轻', '吸引'], isLight: true },
  '#9254DE': { name: '梦幻紫', meaning: '神秘优雅、艺术气息，适合文创和美妆，传递想象力与独特品味', tags: ['神秘', '艺术', '优雅'], isLight: false },
  '#0FC88D': { name: '薄荷绿', meaning: '清爽健康、现代感，适合健康和科技结合的品牌，传递宁静与治愈', tags: ['清爽', '健康', '现代'], isLight: false },
  '#4080FF': { name: '天空蓝', meaning: '开放、自由与广阔，适合旅游、教育品牌，传递希望与可能性', tags: ['自由', '希望', '广阔'], isLight: false },
  '#86909C': { name: '高级灰', meaning: '理性、平衡、专业，适合金融、科技品牌，传递稳健与中立', tags: ['理性', '专业', '平衡'], isLight: false },
  '#23C343': { name: '生机绿', meaning: '成长、希望、生命力，适合教育、健康品牌，传递积极向上的能量', tags: ['成长', '希望', '活力'], isLight: false },
  '#FF6B6B': { name: '玫瑰红', meaning: '温柔、浪漫、关怀，适合母婴、美妆品牌，传递温暖与爱', tags: ['温柔', '浪漫', '关怀'], isLight: false },
  '#D946EF': { name: '神秘紫', meaning: '幻想、魔法、独特，适合文创、年轻品牌，传递想象力', tags: ['幻想', '独特', '创意'], isLight: false },
  '#EC4899': { name: '玫瑰粉', meaning: '甜美、浪漫、女性化，适合美妆、母婴品牌，传递温柔优雅', tags: ['甜美', '浪漫', '优雅'], isLight: false }
}

const fontsByStyle: Record<string, { nameStyle: Record<string, string>; englishStyle: Record<string, string>; sloganStyle: Record<string, string>; fontStyle: string; traits: string[] }[]> = {
  minimal: [
    {
      fontStyle: '细体无衬线',
      traits: ['专业', '简约', '现代'],
      nameStyle: { fontFamily: '"PingFang SC", "Helvetica Neue", Arial, sans-serif', fontWeight: '300', letterSpacing: '4px' },
      englishStyle: { fontFamily: '"Helvetica Neue", Arial, sans-serif', fontWeight: '200', letterSpacing: '2px', fontSize: '12px' },
      sloganStyle: { fontFamily: '"PingFang SC", sans-serif', fontWeight: '300', letterSpacing: '1px', fontSize: '10px' }
    },
    {
      fontStyle: '几何无衬线',
      traits: ['现代', '科技', '创新'],
      nameStyle: { fontFamily: '"Helvetica Neue", Arial, sans-serif', fontWeight: '500', letterSpacing: '2px' },
      englishStyle: { fontFamily: 'Arial, sans-serif', fontWeight: '400', letterSpacing: '1px', fontSize: '12px' },
      sloganStyle: { fontFamily: 'Arial, sans-serif', fontWeight: '300', fontSize: '10px' }
    }
  ],
  tech: [
    {
      fontStyle: '现代黑体',
      traits: ['专业', '可靠', '科技'],
      nameStyle: { fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif', fontWeight: '700', letterSpacing: '1px' },
      englishStyle: { fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '600', letterSpacing: '3px', fontSize: '11px' },
      sloganStyle: { fontFamily: 'sans-serif', fontWeight: '400', letterSpacing: '2px', fontSize: '10px' }
    },
    {
      fontStyle: '未来感字体',
      traits: ['创新', '科技', '独特'],
      nameStyle: { fontFamily: 'Arial, sans-serif', fontWeight: '900', letterSpacing: '-1px' },
      englishStyle: { fontFamily: 'Arial, sans-serif', fontWeight: '700', letterSpacing: '4px', fontSize: '11px' },
      sloganStyle: { fontFamily: 'sans-serif', fontWeight: '300', fontSize: '10px' }
    }
  ],
  retro: [
    {
      fontStyle: '衬线体',
      traits: ['品质', '经典', '可靠'],
      nameStyle: { fontFamily: '"Songti SC", "SimSun", Georgia, serif', fontWeight: '600', letterSpacing: '3px' },
      englishStyle: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: '500', fontSize: '12px', letterSpacing: '1px' },
      sloganStyle: { fontFamily: 'Georgia, serif', fontWeight: '400', fontSize: '10px', letterSpacing: '2px' }
    },
    {
      fontStyle: '手写衬线',
      traits: ['温暖', '文化', '优雅'],
      nameStyle: { fontFamily: '"Kaiti SC", "KaiTi", Georgia, serif', fontWeight: '700', letterSpacing: '4px' },
      englishStyle: { fontFamily: 'Georgia, serif', fontWeight: '600', fontSize: '12px', fontStyle: 'italic' },
      sloganStyle: { fontFamily: '"Kaiti SC", serif', fontWeight: '500', fontSize: '10px' }
    }
  ],
  cute: [
    {
      fontStyle: '圆润卡通',
      traits: ['活力', '年轻', '友好'],
      nameStyle: { fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif', fontWeight: '700', letterSpacing: '1px' },
      englishStyle: { fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif', fontWeight: '700', fontSize: '12px' },
      sloganStyle: { fontFamily: 'sans-serif', fontWeight: '500', fontSize: '10px' }
    },
    {
      fontStyle: '柔软手写',
      traits: ['温暖', '亲切', '个性'],
      nameStyle: { fontFamily: '"PingFang SC", sans-serif', fontWeight: '600', letterSpacing: '2px' },
      englishStyle: { fontFamily: '"Comic Sans MS", Arial, sans-serif', fontWeight: '600', fontSize: '12px' },
      sloganStyle: { fontFamily: 'sans-serif', fontWeight: '400', fontSize: '10px' }
    }
  ],
  luxury: [
    {
      fontStyle: '高端衬线',
      traits: ['高端', '品质', '优雅'],
      nameStyle: { fontFamily: '"Songti SC", Georgia, "Times New Roman", serif', fontWeight: '500', letterSpacing: '6px' },
      englishStyle: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: '400', letterSpacing: '4px', fontSize: '11px' },
      sloganStyle: { fontFamily: 'Georgia, serif', fontWeight: '300', letterSpacing: '3px', fontSize: '10px' }
    },
    {
      fontStyle: '经典罗马体',
      traits: ['高端', '经典', '权威'],
      nameStyle: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: '600', letterSpacing: '5px' },
      englishStyle: { fontFamily: '"Times New Roman", serif', fontWeight: '500', letterSpacing: '3px', fontSize: '12px' },
      sloganStyle: { fontFamily: '"Times New Roman", serif', fontWeight: '400', fontSize: '10px' }
    }
  ],
  natural: [
    {
      fontStyle: '手写自然体',
      traits: ['自然', '温暖', '健康'],
      nameStyle: { fontFamily: '"Kaiti SC", "PingFang SC", sans-serif', fontWeight: '500', letterSpacing: '3px' },
      englishStyle: { fontFamily: 'Georgia, serif', fontWeight: '400', fontSize: '12px' },
      sloganStyle: { fontFamily: '"Kaiti SC", serif', fontWeight: '400', fontSize: '10px' }
    },
    {
      fontStyle: '清新圆体',
      traits: ['友好', '自然', '年轻'],
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

const industryInsights: Record<string, IndustryInsight> = {
  tech: { title: '科技行业设计洞察', type: 'info', desc: '建议使用蓝色/青色调传达科技感，几何图形和极简风格能更好体现专业性和创新精神。字体选择现代感强的无衬线体，字间距可适当加大。' },
  food: { title: '餐饮行业设计洞察', type: 'success', desc: '暖色调（红、橙、黄）能刺激食欲，可爱或温馨风格适合大众餐饮，精致高端路线可考虑黑金配色。圆润字体传递亲切感。' },
  education: { title: '教育行业设计洞察', type: 'info', desc: '蓝色和绿色传达知识与成长感，搭配书卷、灯泡等符号，平衡专业与亲和力。衬线体可增加文化底蕴。' },
  health: { title: '医疗健康行业设计洞察', type: 'success', desc: '绿色系代表健康与生命，蓝色传达专业与信任，建议简约干净的设计避免过度装饰。圆润字体增加温暖感。' },
  finance: { title: '金融行业设计洞察', type: 'warning', desc: '深蓝、金色、黑色传递稳健与高端感，稳重的字体和对称布局是关键，避免过于花哨的设计。大间距增强专业感。' },
  retail: { title: '零售电商设计洞察', type: 'success', desc: '鲜艳明快的配色吸引注意力，价格亲民品牌用活泼风格，高端品牌走极简优雅路线。根据定位调整字体粗细。' },
  media: { title: '文娱传媒设计洞察', type: 'info', desc: '大胆撞色、个性化字体、有记忆点的符号是关键，体现创意与活力。可尝试非常规字距。' },
  beauty: { title: '美妆时尚设计洞察', type: 'info', desc: '粉、紫、金色系传达柔美与奢华，纤细优雅的字体和精致的线条更受青睐。字母间距加大增强高端感。' },
  travel: { title: '旅游出行设计洞察', type: 'success', desc: '蓝、绿、橙等自然明亮色系，搭配地理、探索类符号，传递自由与探索精神。手写体增加人文温度。' },
  realestate: { title: '建筑地产设计洞察', type: 'warning', desc: '深色配金色或白色体现高端品质感，几何线条和对称构图传递稳重与信赖。衬线体传递品质与经典。' },
  agriculture: { title: '农业食品行业设计洞察', type: 'success', desc: '绿色系和自然色调传递有机健康感，手写体和质朴风格能增加信任感。圆润字体传递亲和力。' },
  other: { title: '通用设计建议', type: 'info', desc: '根据品牌定位和目标受众选择风格，简洁易识别的LOGO在任何场景都更具传播力。字体选择应与品牌调性一致。' }
}

const brandForm = ref<BrandForm>({
  brandName: '',
  englishName: '',
  slogan: '',
  industry: '',
  positioning: '',
  priceLevel: 3,
  audiences: [],
  ageRange: [18, 45],
  psychologies: [],
  genderBias: 'neutral',
  archetypes: [],
  style: '',
  colorScheme: 'auto',
  valueKeywords: []
})

const activeTab = ref('basic')
const isGenerating = ref(false)
const generatedLogos = ref<LogoDesign[]>([])
const selectedLogoIndex = ref(-1)

const currentStep = computed(() => {
  if (generatedLogos.value.length > 0) return 4
  if (brandForm.value.style && brandForm.value.archetypes.length > 0) return 3
  if (brandForm.value.audiences.length > 0 || brandForm.value.psychologies.length > 0) return 2
  if (brandForm.value.brandName || brandForm.value.industry) return 1
  return 0
})

const canGenerate = computed(() => {
  return brandForm.value.brandName.trim() !== '' &&
    brandForm.value.industry !== '' &&
    brandForm.value.positioning !== '' &&
    brandForm.value.style !== ''
})

const hasEnoughData = computed(() => {
  return brandForm.value.industry !== '' &&
    brandForm.value.positioning !== '' &&
    brandForm.value.archetypes.length > 0
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

const industryInsight = computed(() => {
  if (!brandForm.value.industry) return null
  return industryInsights[brandForm.value.industry] || industryInsights.other
})

const radarScores = computed<Record<RadarKey, number>>(() => {
  const scores: Record<RadarKey, number> = {
    professional: 50,
    friendly: 50,
    innovative: 50,
    reliable: 50,
    energetic: 50,
    quality: 50
  }

  const industryWeights: Record<string, Partial<Record<RadarKey, number>>> = {
    tech: { professional: 15, innovative: 20, reliable: 10 },
    food: { friendly: 15, energetic: 10, quality: 10 },
    education: { professional: 15, reliable: 15, friendly: 5 },
    health: { professional: 15, reliable: 20, friendly: 5 },
    finance: { professional: 20, reliable: 20, quality: 10 },
    retail: { friendly: 15, energetic: 10, quality: 5 },
    media: { innovative: 20, energetic: 15, friendly: 5 },
    beauty: { quality: 15, innovative: 10, friendly: 10 },
    travel: { energetic: 20, innovative: 10, friendly: 10 },
    realestate: { reliable: 20, professional: 15, quality: 15 },
    agriculture: { reliable: 15, friendly: 10, quality: 10 }
  }

  const positioningWeights: Record<string, Partial<Record<RadarKey, number>>> = {
    mass: { friendly: 15, energetic: 10 },
    quality: { quality: 20, reliable: 10 },
    luxury: { quality: 25, professional: 10 },
    niche: { innovative: 20, professional: 5 }
  }

  const archetypeWeights: Record<string, Partial<Record<RadarKey, number>>> = {
    innocent: { friendly: 15, energetic: 10 },
    sage: { professional: 15, reliable: 10 },
    explorer: { innovative: 15, energetic: 15 },
    outlaw: { innovative: 25, energetic: 10 },
    magician: { innovative: 20, quality: 10 },
    hero: { professional: 15, reliable: 15 },
    lover: { friendly: 20, quality: 10 },
    jester: { energetic: 25, friendly: 10 },
    everyman: { friendly: 20, reliable: 5 },
    caregiver: { friendly: 20, reliable: 10 },
    ruler: { professional: 20, reliable: 15, quality: 10 },
    creator: { innovative: 20, quality: 15 }
  }

  const styleWeights: Record<string, Partial<Record<RadarKey, number>>> = {
    minimal: { professional: 10, quality: 10 },
    tech: { professional: 15, innovative: 15 },
    retro: { quality: 15, reliable: 5 },
    cute: { friendly: 15, energetic: 15 },
    luxury: { quality: 20, professional: 10 },
    natural: { friendly: 15, innovative: 5 }
  }

  const audienceWeights: Record<string, Partial<Record<RadarKey, number>>> = {
    genz: { innovative: 15, energetic: 15 },
    millennial: { professional: 5, innovative: 10, quality: 5 },
    business: { professional: 15, reliable: 10, quality: 10 },
    family: { friendly: 15, reliable: 10 },
    student: { energetic: 10, innovative: 10, friendly: 5 },
    mom: { friendly: 15, reliable: 10 },
    senior: { reliable: 15, friendly: 10 },
    premium: { quality: 20, professional: 10 }
  }

  const psychologyWeights: Record<string, Partial<Record<RadarKey, number>>> = {
    cost: { friendly: 10 },
    quality: { quality: 15, reliable: 5 },
    trend: { innovative: 15, energetic: 5 },
    emotion: { friendly: 15, energetic: 5 },
    individuality: { innovative: 15, quality: 5 },
    social: { friendly: 10, energetic: 10 },
    eco: { friendly: 10, quality: 10 },
    efficiency: { professional: 10, innovative: 5 }
  }

  if (industryWeights[brandForm.value.industry]) {
    for (const [k, w] of Object.entries(industryWeights[brandForm.value.industry]!)) {
      scores[k as RadarKey] += w as number
    }
  }

  if (positioningWeights[brandForm.value.positioning]) {
    for (const [k, w] of Object.entries(positioningWeights[brandForm.value.positioning]!)) {
      scores[k as RadarKey] += w as number
    }
  }

  for (const arc of brandForm.value.archetypes) {
    if (archetypeWeights[arc]) {
      for (const [k, w] of Object.entries(archetypeWeights[arc]!)) {
        scores[k as RadarKey] += (w as number) / Math.max(1, brandForm.value.archetypes.length)
      }
    }
  }

  if (styleWeights[brandForm.value.style]) {
    for (const [k, w] of Object.entries(styleWeights[brandForm.value.style]!)) {
      scores[k as RadarKey] += w as number
    }
  }

  for (const aud of brandForm.value.audiences) {
    if (audienceWeights[aud]) {
      for (const [k, w] of Object.entries(audienceWeights[aud]!)) {
        scores[k as RadarKey] += (w as number) / Math.max(1, brandForm.value.audiences.length)
      }
    }
  }

  for (const psy of brandForm.value.psychologies) {
    if (psychologyWeights[psy]) {
      for (const [k, w] of Object.entries(psychologyWeights[psy]!)) {
        scores[k as RadarKey] += w as number
      }
    }
  }

  scores.quality += (brandForm.value.priceLevel - 3) * 4

  for (const key of Object.keys(scores) as RadarKey[]) {
    scores[key] = Math.min(100, Math.max(0, Math.round(scores[key])))
  }

  return scores
})

const getRadarPoint = (index: number, value: number) => {
  const angle = (radarDimensions[index].angle * Math.PI) / 180
  const radius = (value / 100) * 140
  return {
    x: 200 + radius * Math.cos(angle),
    y: 200 + radius * Math.sin(angle)
  }
}

const getRadarPolygonPoints = (value: number) => {
  return radarDimensions.map((_, i) => {
    const p = getRadarPoint(i, value)
    return `${p.x},${p.y}`
  }).join(' ')
}

const getRadarLabelPoint = (index: number) => {
  const angle = (radarDimensions[index].angle * Math.PI) / 180
  const radius = 170
  return {
    x: 200 + radius * Math.cos(angle),
    y: 200 + radius * Math.sin(angle)
  }
}

const radarDataPoints = computed(() => getRadarPolygonPoints(100))

const recommendedColors = computed<ColorAnalysis[]>(() => {
  const colorScores: Map<string, number> = new Map()

  for (const arc of brandForm.value.archetypes) {
    const prefs = archetypeColorPreferences[arc] || []
    for (const color of prefs) {
      const weight = 30 / Math.max(1, brandForm.value.archetypes.length)
      colorScores.set(color, (colorScores.get(color) || 0) + weight)
    }
  }

  for (const aud of brandForm.value.audiences) {
    const prefs = audienceColorPreferences[aud] || []
    for (const color of prefs) {
      const weight = 20 / Math.max(1, brandForm.value.audiences.length)
      colorScores.set(color, (colorScores.get(color) || 0) + weight)
    }
  }

  const agePrefs = ageColorPreferences(brandForm.value.ageRange[0], brandForm.value.ageRange[1])
  for (const color of agePrefs) {
    colorScores.set(color, (colorScores.get(color) || 0) + 15)
  }

  const genderPrefs = genderColorPreferences[brandForm.value.genderBias] || []
  for (const color of genderPrefs) {
    colorScores.set(color, (colorScores.get(color) || 0) + 10)
  }

  if (brandForm.value.industry && styleIcons[brandForm.value.industry]) {
    const industryColors: Record<string, string[]> = {
      tech: ['#165DFF', '#0FC6C2', '#722ED1', '#1D2129'],
      food: ['#FF7D00', '#F53F3F', '#F7BA1E', '#52C41A'],
      education: ['#165DFF', '#52C41A', '#F7BA1E', '#0FC88D'],
      health: ['#52C41A', '#0FC88D', '#165DFF', '#0FC6C2'],
      finance: ['#165DFF', '#1D2129', '#86909C', '#F7BA1E'],
      retail: ['#F53F3F', '#FF7D00', '#F5319D', '#F7BA1E'],
      media: ['#722ED1', '#F5319D', '#F7BA1E', '#0FC6C2'],
      beauty: ['#F5319D', '#722ED1', '#EC4899', '#F7BA1E'],
      travel: ['#165DFF', '#0FC88D', '#FF7D00', '#23C343'],
      realestate: ['#1D2129', '#165DFF', '#F7BA1E', '#86909C'],
      agriculture: ['#52C41A', '#23C343', '#FF7D00', '#0FC88D']
    }
    const prefs = industryColors[brandForm.value.industry] || []
    for (const color of prefs) {
      colorScores.set(color, (colorScores.get(color) || 0) + 25)
    }
  }

  if (brandForm.value.colorScheme !== 'auto') {
    const schemeColors = colorPalettes[brandForm.value.colorScheme] || []
    for (const palette of schemeColors) {
      colorScores.set(palette.primary, (colorScores.get(palette.primary) || 0) + 40)
    }
  }

  const sortedColors = Array.from(colorScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  return sortedColors.map(([color, score]) => {
    const info = colorPsychology[color] || { name: '自定义色', meaning: '该颜色与您的品牌定位高度匹配', tags: ['匹配'], isLight: false }
    return {
      color,
      name: info.name,
      meaning: info.meaning,
      tags: info.tags,
      isLight: info.isLight,
      score: Math.min(99, Math.round(score + 30))
    }
  })
})

const designStrategies = computed<DesignStrategy[]>(() => {
  const strategies: DesignStrategy[] = []
  const rs = radarScores.value

  if (rs.professional >= 70) {
    strategies.push({ title: '强化专业感表达', desc: '建议使用无衬线字体，加大字间距，选择深蓝或深灰等稳重色调，布局采用对称结构传递权威感。' })
  }
  if (rs.friendly >= 70) {
    strategies.push({ title: '增强亲和力传递', desc: '可选择圆润字体和暖色调，图标使用曲线元素，避免过于锐利的边角，营造温暖可信的感觉。' })
  }
  if (rs.innovative >= 70) {
    strategies.push({ title: '突出创新独特性', desc: '尝试非常规字距和撞色搭配，使用几何抽象图形作为图标，打破对称布局体现差异化。' })
  }
  if (rs.reliable >= 70) {
    strategies.push({ title: '建立可靠信任感', desc: '选择经典字体和稳重配色，图标设计简洁对称，避免过度装饰，传递恒久品质。' })
  }
  if (rs.energetic >= 70) {
    strategies.push({ title: '注入活力动感', desc: '使用高饱和度暖色系，字体可适当倾斜或使用粗体，图标选择有动感的元素。' })
  }
  if (rs.quality >= 70) {
    strategies.push({ title: '彰显品质高端感', desc: '衬线体或细体字配合大间距，低饱和度高级灰或金色系，极简留白设计传递品质。' })
  }

  if (brandForm.value.audiences.includes('genz') || brandForm.value.audiences.includes('student')) {
    strategies.push({ title: '适配年轻群体审美', desc: 'Z世代和学生群体对撞色、潮酷元素接受度高，可适当增加潮流元素和大胆配色。' })
  }
  if (brandForm.value.audiences.includes('premium') || brandForm.value.positioning === 'luxury') {
    strategies.push({ title: '高端人群视觉策略', desc: '高净值人群偏好极简、精致设计，建议使用高品质衬线字体，低饱和度高级色系。' })
  }
  if (brandForm.value.genderBias === 'female') {
    strategies.push({ title: '女性向设计考量', desc: '柔和曲线、粉紫色系、优雅字体更易引发女性受众情感共鸣，但避免过度甜美以保证品质感。' })
  }
  if (brandForm.value.archetypes.length > 0) {
    const arcLabels = brandForm.value.archetypes.map(a => getArchetypeLabel(a)).join('、')
    strategies.push({ title: `融入「${arcLabels}」人格特质`, desc: `设计元素应体现${arcLabels}原型的核心特征，让品牌人格通过视觉符号触达用户内心。` })
  }

  if (strategies.length === 0) {
    strategies.push({ title: '平衡型设计策略', desc: '在专业感与亲和力之间取得平衡，采用中等饱和度配色，字体清晰易读，图标简洁有辨识度。' })
  }

  return strategies.slice(0, 5)
})

const getArchetypeLabel = (value: string) => {
  const arc = archetypes.find(a => a.value === value)
  return arc ? arc.label : value
}

const getAgeGroupLabel = (range: [number, number]) => {
  const avg = (range[0] + range[1]) / 2
  if (avg < 18) return '青少年'
  if (avg < 30) return '年轻群体'
  if (avg < 45) return '中青年'
  if (avg < 60) return '中年群体'
  return '银发群体'
}

const getFitnessColor = (score: number) => {
  if (score >= 85) return '#67c23a'
  if (score >= 70) return '#165DFF'
  if (score >= 55) return '#e6a23c'
  return '#909399'
}

const togglePsychology = (value: string) => {
  const idx = brandForm.value.psychologies.indexOf(value)
  if (idx > -1) {
    brandForm.value.psychologies.splice(idx, 1)
  } else {
    brandForm.value.psychologies.push(value)
  }
}

const toggleArchetype = (value: string) => {
  const idx = brandForm.value.archetypes.indexOf(value)
  if (idx > -1) {
    brandForm.value.archetypes.splice(idx, 1)
  } else if (brandForm.value.archetypes.length < 3) {
    brandForm.value.archetypes.push(value)
  }
}

const onIndustryChange = () => {
}

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

const getWeightedPalette = () => {
  if (brandForm.value.colorScheme !== 'auto' && colorPalettes[brandForm.value.colorScheme]) {
    return getRandomItem(colorPalettes[brandForm.value.colorScheme])
  }

  const colorScores: Map<{ primary: string; secondary: string; light: string; bg: string }, number> = new Map()
  const allPalettes = Object.values(colorPalettes).flat().filter(p => p.primary !== '#F0F7FF')

  for (const palette of allPalettes) {
    let score = 0
    for (const arc of brandForm.value.archetypes) {
      if ((archetypeColorPreferences[arc] || []).includes(palette.primary)) {
        score += 25
      }
    }
    for (const aud of brandForm.value.audiences) {
      if ((audienceColorPreferences[aud] || []).includes(palette.primary)) {
        score += 20
      }
    }
    if (ageColorPreferences(brandForm.value.ageRange[0], brandForm.value.ageRange[1]).includes(palette.primary)) {
      score += 15
    }
    if ((genderColorPreferences[brandForm.value.genderBias] || []).includes(palette.primary)) {
      score += 10
    }
    if (score === 0) score = 1
    colorScores.set(palette, score)
  }

  const sorted = Array.from(colorScores.entries()).sort((a, b) => b[1] - a[1])
  const topCount = Math.max(3, Math.floor(sorted.length / 3))
  return getRandomItem(sorted.slice(0, topCount).map(s => s[0]))
}

const getWeightedFontConfig = () => {
  const fonts = fontsByStyle[brandForm.value.style] || fontsByStyle.minimal
  const fontScores: Map<typeof fonts[0], number> = new Map()

  for (const font of fonts) {
    let score = 50
    for (const keyword of brandForm.value.valueKeywords) {
      if (font.traits.includes(keyword)) score += 20
    }
    for (const arc of brandForm.value.archetypes) {
      const arcTraitMap: Record<string, string[]> = {
        ruler: ['高端', '权威', '经典'],
        sage: ['专业', '可靠'],
        hero: ['专业', '品质', '可靠'],
        creator: ['创新', '独特', '现代'],
        magician: ['创意', '独特', '优雅'],
        lover: ['温暖', '优雅', '友好'],
        jester: ['活力', '年轻', '友好'],
        innocent: ['温暖', '友好', '年轻'],
        explorer: ['自然', '现代', '独特'],
        outlaw: ['独特', '创新'],
        caregiver: ['温暖', '自然', '友好'],
        everyman: ['友好', '自然']
      }
      const traits = arcTraitMap[arc] || []
      for (const t of traits) {
        if (font.traits.includes(t)) score += 15
      }
    }
    fontScores.set(font, score)
  }

  const sorted = Array.from(fontScores.entries()).sort((a, b) => b[1] - a[1])
  return sorted[0]?.[0] || fonts[0]
}

const calculateFitnessScore = (palette: { primary: string }, font: { traits: string[] }, icon: string) => {
  let score = 50

  for (const arc of brandForm.value.archetypes) {
    if ((archetypeColorPreferences[arc] || []).includes(palette.primary)) score += 10
  }
  for (const aud of brandForm.value.audiences) {
    if ((audienceColorPreferences[aud] || []).includes(palette.primary)) score += 8
  }
  for (const keyword of brandForm.value.valueKeywords) {
    if (font.traits.includes(keyword)) score += 8
  }
  if (ageColorPreferences(brandForm.value.ageRange[0], brandForm.value.ageRange[1]).includes(palette.primary)) {
    score += 6
  }
  if ((genderColorPreferences[brandForm.value.genderBias] || []).includes(palette.primary)) {
    score += 5
  }

  const icons = getIconsForStyle(brandForm.value.style, brandForm.value.industry)
  if (icons.includes(icon)) score += 10

  return Math.min(98, Math.max(55, score))
}

const generateDesignPrinciples = (
  palette: { primary: string },
  font: { fontStyle: string; traits: string[] },
  layout: { name: string; value: string },
  icon: string
): DesignPrinciple[] => {
  const principles: DesignPrinciple[] = []
  const colorInfo = colorPsychology[palette.primary]

  if (colorInfo) {
    principles.push({
      icon: '🎨',
      label: '配色策略',
      text: `采用${colorInfo.name}（${palette.primary}）作为主色调，${colorInfo.meaning}`
    })
  }

  principles.push({
    icon: '🔤',
    label: '字体策略',
    text: `选用${font.fontStyle}，其特质为「${font.traits.join('·')}」，${brandForm.value.style === 'luxury' ? '大字间距增强高端感' : brandForm.value.style === 'tech' ? '现代感字体传递科技属性' : '符合品牌整体调性'}`
  })

  const layoutDesc: Record<string, string> = {
    top: '图标在上文字在下的垂直布局，符合阅读习惯，适合图标表现力强的符号',
    left: '图标在左文字在右的横向布局，信息密度高，适合中英文组合展示',
    circle: '圆形图标包裹设计，具有强辨识度和记忆点，适合APP头像和社交场景'
  }
  principles.push({
    icon: '📐',
    label: '布局策略',
    text: `采用${layout.name}（${layout.value}），${layoutDesc[layout.value]}`
  })

  const iconMeaning = icon.length <= 2 ? `符号「${icon}」具有直观的视觉辨识度` : `图标元素「${icon}」与行业属性高度契合`
  principles.push({
    icon: '✨',
    label: '图标策略',
    text: iconMeaning
  })

  if (brandForm.value.archetypes.length > 0) {
    const arcLabels = brandForm.value.archetypes.map(a => getArchetypeLabel(a)).join('、')
    principles.push({
      icon: '🧠',
      label: '心理学依据',
      text: `整体设计呼应「${arcLabels}」品牌人格原型，从视觉层面触达目标受众的深层心理需求`
    })
  }

  return principles
}

const generateOneLogo = (): LogoDesign => {
  const icons = getIconsForStyle(brandForm.value.style, brandForm.value.industry)
  const layout = layoutOptions[Math.floor(Math.random() * layoutOptions.length)]
  const palette = getWeightedPalette()
  const fontConfig = getWeightedFontConfig()
  const icon = getRandomItem(icons)
  const nameSize = layout.value === 'circle' ? 20 : (layout.value === 'top' ? 24 : 22)
  const iconSize = layout.value === 'circle' ? 36 : (layout.value === 'top' ? 48 : 40)

  const matchedPersonalities = brandForm.value.archetypes.length > 0
    ? brandForm.value.archetypes
    : ['creator']

  const fitnessScore = calculateFitnessScore(palette, fontConfig, icon)
  const designPrinciples = generateDesignPrinciples(palette, fontConfig, layout, icon)

  return {
    styleName: styles.find(s => s.value === brandForm.value.style)?.label || '极简风',
    layoutName: layout.name,
    iconPosition: layout.value,
    icon,
    iconSize,
    primaryColor: palette.primary,
    secondaryColor: palette.secondary,
    lightColor: palette.light,
    bgColor: palette.bg,
    colorPalette: [palette.primary, palette.secondary, palette.light],
    nameStyle: {
      ...fontConfig.nameStyle,
      color: palette.primary,
      fontSize: nameSize + 'px'
    },
    englishStyle: {
      ...fontConfig.englishStyle,
      color: palette.secondary
    },
    sloganStyle: {
      ...fontConfig.sloganStyle,
      color: palette.light
    },
    canvasStyle: {
      fontFamily: fontConfig.nameStyle.fontFamily
    },
    fontStyle: fontConfig.fontStyle,
    fitnessScore,
    matchedPersonalities,
    designPrinciples
  }
}

const generateLogos = async () => {
  if (!canGenerate.value) {
    ElMessage.warning('请填写品牌名称、行业、品牌定位和设计风格')
    return
  }

  isGenerating.value = true
  selectedLogoIndex.value = -1

  await new Promise(resolve => setTimeout(resolve, 1800))

  const logos: LogoDesign[] = []
  const usedIcons = new Set<string>()

  for (let i = 0; i < 6; i++) {
    let logo = generateOneLogo()
    let attempts = 0
    while (usedIcons.has(logo.icon) && attempts < 15) {
      logo = generateOneLogo()
      attempts++
    }
    usedIcons.add(logo.icon)
    logos.push(logo)
  }

  logos.sort((a, b) => b.fitnessScore - a.fitnessScore)

  generatedLogos.value = logos
  selectedLogoIndex.value = 0
  isGenerating.value = false
  ElMessage.success(`已生成 ${logos.length} 款方案，契合度最高 ${logos[0].fitnessScore}%`)
}

const regenerateLogo = (index: number) => {
  if (index < 0 || index >= generatedLogos.value.length) return
  generatedLogos.value[index] = generateOneLogo()
  generatedLogos.value.sort((a, b) => b.fitnessScore - a.fitnessScore)
  ElMessage.success(`方案已重新生成`)
}

const resetForm = () => {
  brandForm.value = {
    brandName: '',
    englishName: '',
    slogan: '',
    industry: '',
    positioning: '',
    priceLevel: 3,
    audiences: [],
    ageRange: [18, 45],
    psychologies: [],
    genderBias: 'neutral',
    archetypes: [],
    style: '',
    colorScheme: 'auto',
    valueKeywords: []
  }
  generatedLogos.value = []
  selectedLogoIndex.value = -1
  activeTab.value = 'basic'
  ElMessage.info('已重置所有选项')
}

const generateSvgContent = (logo: LogoDesign): string => {
  const width = 400
  const height = 300
  const centerX = width / 2
  const centerY = height / 2

  let content = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
  content += `<rect width="100%" height="100%" fill="${logo.bgColor}"/>`

  const safeBrandName = displayBrandName.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const safeEnglish = (displayEnglishName.value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  if (logo.iconPosition === 'top') {
    content += `<text x="${centerX}" y="${centerY - 30}" text-anchor="middle" fill="${logo.primaryColor}" font-size="${logo.iconSize}">${logo.icon}</text>`
    content += `<text x="${centerX}" y="${centerY + 20}" text-anchor="middle" fill="${logo.primaryColor}" font-size="${logo.nameStyle.fontSize}" font-weight="${logo.nameStyle.fontWeight}" letter-spacing="${logo.nameStyle.letterSpacing}">${safeBrandName}</text>`
    if (safeEnglish) {
      content += `<text x="${centerX}" y="${centerY + 50}" text-anchor="middle" fill="${logo.secondaryColor}" font-size="14" font-weight="${logo.englishStyle.fontWeight}">${safeEnglish}</text>`
    }
  } else if (logo.iconPosition === 'left') {
    const iconX = centerX - 100
    content += `<text x="${iconX}" y="${centerY + 15}" text-anchor="middle" fill="${logo.primaryColor}" font-size="${logo.iconSize}">${logo.icon}</text>`
    content += `<text x="${centerX + 20}" y="${centerY + 5}" text-anchor="start" fill="${logo.primaryColor}" font-size="${logo.nameStyle.fontSize}" font-weight="${logo.nameStyle.fontWeight}" letter-spacing="${logo.nameStyle.letterSpacing}">${safeBrandName}</text>`
    if (safeEnglish) {
      content += `<text x="${centerX + 20}" y="${centerY + 35}" text-anchor="start" fill="${logo.secondaryColor}" font-size="12">${safeEnglish}</text>`
    }
  } else {
    const circleR = 45
    content += `<circle cx="${centerX}" cy="${centerY - 40}" r="${circleR}" fill="${logo.primaryColor}"/>`
    content += `<text x="${centerX}" y="${centerY - 30}" text-anchor="middle" fill="#fff" font-size="${logo.iconSize * 0.7}">${logo.icon}</text>`
    content += `<text x="${centerX}" y="${centerY + 40}" text-anchor="middle" fill="${logo.primaryColor}" font-size="${logo.nameStyle.fontSize}" font-weight="${logo.nameStyle.fontWeight}" letter-spacing="${logo.nameStyle.letterSpacing}">${safeBrandName}</text>`
    if (safeEnglish) {
      content += `<text x="${centerX}" y="${centerY + 65}" text-anchor="middle" fill="${logo.secondaryColor}" font-size="12">${safeEnglish}</text>`
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
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 0 40px;
}

.guide-card {
  margin-bottom: 20px;
}

.guide-steps {
  padding: 8px 0;
}

.main-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: bold;
}

.main-tabs {
  margin-top: 4px;
}

.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.price-slider-wrap,
.age-slider-wrap {
  padding: 8px 16px 0;
}

.age-range-display {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  font-size: 13px;
  color: #606266;
}

.range-arrow {
  color: #909399;
}

.range-hint {
  margin-left: 10px;
  color: #722ed1;
  font-weight: 500;
}

.industry-insight {
  margin-top: 16px;
}

.psychology-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.psychology-card {
  position: relative;
  padding: 14px 10px;
  border: 2px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;
  background: #fafafa;
}

.psychology-card:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  transform: translateY(-2px);
}

.psychology-card.active {
  border-color: #722ed1;
  background: linear-gradient(135deg, #f9f0ff 0%, #f3e8ff 100%);
  box-shadow: 0 4px 12px rgba(114, 46, 209, 0.15);
}

.psy-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.psy-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.psy-desc {
  font-size: 11px;
  color: #909399;
}

.psy-check {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #722ed1;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prototype-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  margin-bottom: 12px;
}

.archetype-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.archetype-card {
  position: relative;
  padding: 16px 8px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;
  background: #fafafa;
}

.archetype-card:hover:not(.disabled) {
  border-color: #722ed1;
  background: #f9f0ff;
  transform: translateY(-2px);
}

.archetype-card.active {
  border-color: #722ed1;
  background: linear-gradient(135deg, #f3e8ff 0%, #ede0ff 100%);
  box-shadow: 0 6px 16px rgba(114, 46, 209, 0.2);
}

.archetype-card.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.arc-emoji {
  font-size: 28px;
  margin-bottom: 6px;
}

.arc-name {
  font-size: 14px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 3px;
}

.arc-trait {
  font-size: 10px;
  color: #909399;
  line-height: 1.3;
}

.arc-check {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #722ed1;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  margin-top: 8px;
  border-top: 1px solid #ebeef5;
}

.generate-btn {
  min-width: 280px;
  height: 48px;
  font-size: 16px;
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
  border: none;
}

.generate-btn:hover {
  background: linear-gradient(135deg, #6221c2 0%, #8240d8 100%);
}

.completeness-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #e6a23c;
}

.analysis-content {
  padding: 8px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.section-subtitle {
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
  font-weight: 400;
}

.radar-section {
  background: linear-gradient(135deg, #fafbff 0%, #f5f0ff 100%);
  border-radius: 12px;
  padding: 16px;
}

.radar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.radar-svg {
  width: 100%;
  max-width: 380px;
  height: auto;
}

.radar-polygon {
  opacity: 0.6;
}

.radar-label {
  font-size: 12px;
  fill: #303133;
  font-weight: 600;
}

.radar-score {
  font-size: 10px;
  fill: #722ed1;
  font-weight: 600;
}

.strategy-section {
  background: linear-gradient(135deg, #f0f7ff 0%, #eef2ff 100%);
  border-radius: 12px;
  padding: 16px;
}

.strategy-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.strategy-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #fff;
  padding: 12px 14px;
  border-radius: 10px;
  border-left: 3px solid #165DFF;
}

.strategy-index {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #165DFF 0%, #4080FF 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.strategy-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 3px;
}

.strategy-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.6;
}

.color-palette-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.color-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.25s;
}

.color-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.color-preview {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-hex {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 10px;
  border-radius: 6px;
}

.color-hex.dark {
  color: #303133;
  background: rgba(255, 255, 255, 0.6);
}

.color-info {
  padding: 12px;
}

.color-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.color-meaning {
  font-size: 11px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 8px;
}

.color-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.result-card {
  margin-bottom: 20px;
}

.logo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.logo-card {
  border: 2px solid #ebeef5;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  background: #fff;
}

.logo-card:hover {
  border-color: #722ed1;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(114, 46, 209, 0.1);
}

.logo-card.selected {
  border-color: #722ed1;
  box-shadow: 0 0 0 3px rgba(114, 46, 209, 0.15);
}

.logo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.logo-index-badge {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.fitness-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.logo-preview {
  padding: 36px 20px;
  min-height: 160px;
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
  gap: 10px;
}

.logo-layout-left {
  gap: 18px;
  text-align: left;
}

.logo-layout-circle {
  flex-direction: column;
  gap: 14px;
}

.logo-icon {
  line-height: 1;
}

.logo-circle-icon {
  width: 80px;
  height: 80px;
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

.logo-personality-tags {
  padding: 10px 14px 4px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.personality-tag {
  border: none;
}

.logo-meta {
  padding: 10px 14px;
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
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.color-inline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.design-principles {
  padding: 12px 14px;
  border-top: 1px solid #ebeef5;
}

.dp-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
}

.dp-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dp-list li {
  font-size: 11px;
  color: #606266;
  line-height: 1.5;
}

.dp-icon {
  margin-right: 2px;
}

.dp-label {
  font-weight: 600;
  color: #303133;
  margin-right: 2px;
}

.logo-actions {
  padding: 12px 14px;
  display: flex;
  gap: 8px;
  border-top: 1px solid #ebeef5;
  background: linear-gradient(135deg, #f9f0ff 0%, #f3e8ff 100%);
}

.logo-actions .el-button {
  flex: 1;
}

.detail-card {
  margin-bottom: 20px;
}

.detail-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 28px;
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
  font-size: 13px;
  color: #606266;
  font-weight: 600;
}

.bg-preview {
  padding: 36px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  border: 1px solid #ebeef5;
}

.light-bg {
  background: #fff;
}

.dark-bg {
  background: #1a1a1a;
}

.transparent-bg {
  background-image:
    linear-gradient(45deg, #ddd 25%, transparent 25%),
    linear-gradient(-45deg, #ddd 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ddd 75%),
    linear-gradient(-45deg, transparent 75%, #ddd 75%);
  background-size: 18px 18px;
  background-position: 0 0, 0 9px, 9px -9px, -9px 0px;
  background-color: #fff;
}

.detail-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 14px;
}

.inline-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.detail-principles {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(135deg, #fafbff 0%, #f5f0ff 100%);
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.dp-detail-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.dp-detail-icon {
  flex-shrink: 0;
  font-size: 20px;
  width: 36px;
  height: 36px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dp-detail-label {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 3px;
}

.dp-detail-text {
  font-size: 12px;
  color: #606266;
  line-height: 1.6;
}

.detail-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-actions .el-button {
  width: 100%;
  height: 44px;
}

.scenario-card {
  margin-bottom: 20px;
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
  .psychology-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .archetype-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .style-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .color-palette-list {
    grid-template-columns: repeat(2, 1fr);
  }
  .logo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .detail-container {
    grid-template-columns: 1fr;
  }
  .scenario-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .psychology-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .archetype-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .style-grid {
    grid-template-columns: 1fr;
  }
  .color-palette-list {
    grid-template-columns: repeat(2, 1fr);
  }
  .logo-grid {
    grid-template-columns: 1fr;
  }
  .scenario-grid {
    grid-template-columns: 1fr;
  }
  .action-area {
    flex-direction: column;
    align-items: stretch;
  }
  .generate-btn {
    min-width: 100%;
  }
}
</style>