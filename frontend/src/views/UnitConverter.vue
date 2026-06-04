<template>
  <div class="unit-converter">
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
        <el-step title="选择单位类别" description="支持长度、重量、面积、体积等多种单位类型" />
        <el-step title="输入数值" description="在输入框中填写需要换算的数值" />
        <el-step title="选择源单位" description="选择当前数值的单位" />
        <el-step title="查看换算结果" description="即时显示所有目标单位的换算结果" />
      </el-steps>
      <el-divider />
      <div class="precision-rules">
        <h4 class="rules-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          换算精度与结果规则
        </h4>
        <el-row :gutter="16">
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">显示精度</div>
              <div class="rule-desc">可自定义小数位数（0-12位）；极大或极小值自动切换为科学计数法</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">舍入方式</div>
              <div class="rule-desc">采用四舍五入截断至有效位数；支持复制显示值或完整精度值</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">精度等级</div>
              <div class="rule-desc">
                <el-tag size="small" type="success">精确</el-tag> 国际单位制换算；
                <el-tag size="small" type="warning">约算</el-tag> 市制/英制换算系数为有限位近似值
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">校验功能</div>
              <div class="rule-desc">点击结果卡片可查看换算公式，支持反向校验以验证结果正确性</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="converter-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Rank />
          </el-icon>
          <span>单位换算</span>
          <el-tag size="small" type="info" class="header-tag">支持8大类单位换算</el-tag>
        </div>
      </template>

      <div class="category-tabs">
        <el-radio-group v-model="selectedCategory" size="large" fill="#165DFF">
          <el-radio-button v-for="cat in categories" :key="cat.key" :value="cat.key">
            <el-icon><component :is="cat.icon" /></el-icon>
            {{ cat.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <el-form label-width="100px" class="converter-form">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="输入数值">
              <div class="form-item-with-help">
                <el-tooltip content="输入需要换算的数值，支持小数" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-input-number
                  v-model="inputValue"
                  :min="0"
                  :max="999999999999"
                  :step="1"
                  :precision="12"
                  :controls="false"
                  style="width: 100%"
                  placeholder="请输入数值"
                  @change="convert"
                />
              </div>
              <div class="quick-values">
                <span v-for="val in quickValues" :key="val" class="quick-tag" @click="setQuickValue(val)">
                  {{ val }}
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="源单位">
              <div class="form-item-with-help">
                <el-tooltip content="选择输入数值的单位" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-select v-model="fromUnit" style="width: 100%" @change="convert">
                  <el-option
                    v-for="unit in currentUnits"
                    :key="unit.key"
                    :label="`${unit.name} (${unit.symbol})`"
                    :value="unit.key"
                  />
                </el-select>
              </div>
              <div class="field-hint">
                <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
                <span>当前类别：{{ currentCategoryLabel }}</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="小数位数">
              <div class="form-item-with-help">
                <el-tooltip content="设置结果显示的小数位数，0-12位" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-slider
                  v-model="decimalPlaces"
                  :min="0"
                  :max="12"
                  :step="1"
                  show-input
                  :input-size="50"
                  style="width: 100%"
                  @change="convert"
                />
              </div>
              <div class="field-hint">
                <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
                <span>当前：{{ decimalPlaces }} 位小数</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="common-conversions">
        <span class="conversion-label">常用换算：</span>
        <el-tag
          v-for="conv in currentCategoryConversions"
          :key="conv.label"
          size="small"
          class="conversion-tag"
          @click="applyConversion(conv)"
        >
          {{ conv.label }}
        </el-tag>
      </div>
    </el-card>

    <el-card v-if="conversionResults.length > 0" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataLine />
          </el-icon>
          <span>换算结果</span>
          <el-tag size="small" type="success">实时计算</el-tag>
          <div class="precision-summary">
            <el-tag v-if="approximateCount > 0" size="small" type="warning" class="precision-summary-tag">
              <el-icon><Warning /></el-icon>
              含 {{ approximateCount }} 个约算单位
            </el-tag>
            <el-tag v-else size="small" type="success" class="precision-summary-tag">
              全部精确换算
            </el-tag>
          </div>
        </div>
      </template>

      <el-alert
        v-if="approximateCount > 0"
        type="warning"
        :closable="false"
        show-icon
        class="precision-alert"
      >
        <template #title>
          <span>精度提示：当前类别包含约算单位，结果保留{{ decimalPlaces }}位小数。约算单位因换算系数为有限位近似值（如1里=500m），换算结果可能存在末位微小误差。</span>
        </template>
      </el-alert>

      <div class="result-input-show">
        <span class="input-value">{{ formatNumber(inputValue) }}</span>
        <span class="input-unit">{{ fromUnitInfo?.name }} ({{ fromUnitInfo?.symbol }})</span>
        <el-icon class="equal-icon"><ArrowRight /></el-icon>
        <span class="result-hint">= 以下单位换算结果</span>
        <el-button type="primary" link size="small" @click="showFormulaDialog = true" class="formula-btn">
          <el-icon><Document /></el-icon>
          查看换算公式
        </el-button>
      </div>

      <el-row :gutter="16" class="result-grid">
        <el-col :xs="12" :sm="8" :md="6" v-for="result in conversionResults" :key="result.unit.key">
          <div
            class="result-item"
            :class="{
              'is-from': result.unit.key === fromUnit,
              'is-approximate': result.unit.precision === 'approximate'
            }"
            @click="showResultDetail(result)"
          >
            <div class="result-precision">
              <el-tag v-if="result.unit.precision === 'approximate'" size="small" type="warning" effect="dark">约算</el-tag>
              <el-tag v-else size="small" type="success" effect="dark">精确</el-tag>
            </div>
            <div class="result-value">{{ formatResult(result.value) }}</div>
            <div class="result-unit">{{ result.unit.name }}</div>
            <div class="result-symbol">{{ result.unit.symbol }}</div>
            <el-dropdown trigger="click" @command="(cmd) => handleCopyCommand(cmd, result)" class="copy-dropdown">
              <span class="copy-trigger">
                <el-tooltip content="复制选项" placement="top">
                  <el-icon class="copy-icon"><CopyDocument /></el-icon>
                </el-tooltip>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="display">复制显示值</el-dropdown-item>
                  <el-dropdown-item command="full">复制完整精度值</el-dropdown-item>
                  <el-dropdown-item command="verify">反向校验</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <div class="result-table-wrapper">
        <h4>详细换算表</h4>
        <el-table :data="conversionResults" border stripe>
          <el-table-column label="序号" type="index" width="60" align="center" />
          <el-table-column prop="unit.name" label="单位名称" width="140" />
          <el-table-column prop="unit.symbol" label="符号" width="100" align="center" />
          <el-table-column label="精度" width="80" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.unit.precision === 'approximate'" size="small" type="warning">约算</el-tag>
              <el-tag v-else size="small" type="success">精确</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="换算系数" width="180" align="right">
            <template #default="{ row }">
              <span class="factor-value" :title="`1 ${fromUnitInfo?.symbol} = ${getConversionFactor(row.unit)} ${row.unit.symbol}`">
                {{ getConversionFactor(row.unit) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="换算值" align="right">
            <template #default="{ row }">
              <span class="table-value">{{ formatResult(row.value) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="完整值" align="right">
            <template #default="{ row }">
              <el-tooltip :content="formatFullPrecision(row.value)">
                <span class="full-value">{{ formatFullPrecisionShort(row.value) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <el-button size="small" type="primary" link @click="copyDisplayValue(row)">复制</el-button>
              <el-button size="small" type="success" link @click="copyFullValue(row)">完整值</el-button>
              <el-button size="small" type="warning" link @click="verifyResult(row)">校验</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog v-model="detailDialogVisible" title="换算详情" width="500px">
      <div v-if="currentDetail" class="detail-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="输入值">
            <span class="detail-highlight">{{ formatNumber(inputValue) }} {{ fromUnitInfo?.symbol }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="目标单位">
            {{ currentDetail.unit.name }} ({{ currentDetail.unit.symbol }})
          </el-descriptions-item>
          <el-descriptions-item label="精度等级">
            <el-tag :type="currentDetail.unit.precision === 'approximate' ? 'warning' : 'success'" size="small">
              {{ currentDetail.unit.precision === 'approximate' ? '约算' : '精确' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="换算公式">
            <code class="formula-code">{{ getFormulaText(currentDetail.unit) }}</code>
          </el-descriptions-item>
          <el-descriptions-item label="计算过程">
            <div class="calculation-steps">
              <p>{{ formatNumber(inputValue) }} × {{ fromUnitInfo?.factor }} = {{ formatFullPrecision(inputValue * (fromUnitInfo?.factor || 1)) }} (基准值)</p>
              <p>{{ formatFullPrecision(inputValue * (fromUnitInfo?.factor || 1)) }} ÷ {{ currentDetail.unit.factor }} = {{ formatFullPrecision(currentDetail.value) }}</p>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="显示结果">
            <span class="detail-result">{{ formatResult(currentDetail.value) }} {{ currentDetail.unit.symbol }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="完整精度值">
            <span class="full-precision-text">{{ formatFullPrecision(currentDetail.value) }} {{ currentDetail.unit.symbol }}</span>
          </el-descriptions-item>
        </el-descriptions>
        <div class="detail-actions">
          <el-button type="primary" @click="copyFullValue(currentDetail)">
            <el-icon><CopyDocument /></el-icon>
            复制完整值
          </el-button>
          <el-button type="success" @click="verifyResult(currentDetail)">
            <el-icon><Refresh /></el-icon>
            反向校验
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="verifyDialogVisible" title="反向校验结果" width="500px">
      <div v-if="verifyData" class="verify-content">
        <el-alert
          :type="verifyData.passed ? 'success' : 'warning'"
          :closable="false"
          show-icon
          class="verify-alert"
        >
          <template #title>
            <span v-if="verifyData.passed">✅ 校验通过：计算结果正确</span>
            <span v-else>⚠️ 校验提示：存在舍入误差（在精度范围内）</span>
          </template>
        </el-alert>
        <el-descriptions :column="1" border class="verify-desc">
          <el-descriptions-item label="正向计算">
            {{ formatNumber(inputValue) }} {{ fromUnitInfo?.symbol }} → {{ formatResult(verifyData.forwardValue) }} {{ verifyData.unit.symbol }}
          </el-descriptions-item>
          <el-descriptions-item label="反向计算">
            {{ formatFullPrecision(verifyData.forwardValue) }} {{ verifyData.unit.symbol }} → {{ formatFullPrecision(verifyData.reverseValue) }} {{ fromUnitInfo?.symbol }}
          </el-descriptions-item>
          <el-descriptions-item label="原始输入">
            {{ formatFullPrecision(inputValue) }} {{ fromUnitInfo?.symbol }}
          </el-descriptions-item>
          <el-descriptions-item label="误差值">
            <span :class="verifyData.error < 1e-10 ? 'error-small' : 'error-large'">
              {{ formatFullPrecision(verifyData.error) }} {{ fromUnitInfo?.symbol }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="相对误差">
            <span :class="verifyData.relativeError < 1e-10 ? 'error-small' : 'error-large'">
              {{ (verifyData.relativeError * 100).toExponential(4) }}%
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <el-dialog v-model="showFormulaDialog" title="全部换算公式" width="700px">
      <div class="all-formulas">
        <p class="formula-intro">
          <strong>换算原理：</strong>以基准单位（{{ currentCategory?.baseUnit }}）为中间量，所有单位先换算为基准单位，再从基准单位换算为目标单位。
        </p>
        <el-table :data="currentUnits" border stripe size="small">
          <el-table-column prop="name" label="单位名称" width="120" />
          <el-table-column prop="symbol" label="符号" width="80" align="center" />
          <el-table-column label="换算公式" min-width="300">
            <template #default="{ row }">
              <code class="formula-inline">1 {{ row.symbol }} = {{ formatFullPrecision(row.factor) }} {{ currentCategory?.baseUnit }}</code>
            </template>
          </el-table-column>
          <el-table-column label="精度" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.precision === 'approximate' ? 'warning' : 'success'" size="small">
                {{ row.precision === 'approximate' ? '约算' : '精确' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Rank,
  DataLine,
  QuestionFilled,
  InfoFilled,
  ArrowRight,
  CopyDocument,
  RefreshRight,
  Scale,
  Grid,
  Box,
  Sunny,
  Timer,
  Odometer,
  Files,
  Warning,
  Document,
  Refresh
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Unit {
  key: string
  name: string
  symbol: string
  factor: number
  precision?: 'exact' | 'approximate'
}

interface Category {
  key: string
  label: string
  icon: string
  units: Unit[]
  baseUnit: string
  commonConversions: { label: string; from: string; to: string }[]
}

interface VerifyData {
  unit: Unit
  forwardValue: number
  reverseValue: number
  error: number
  relativeError: number
  passed: boolean
}

const categories: Category[] = [
  {
    key: 'length',
    label: '长度',
    icon: 'RefreshRight',
    baseUnit: '米 (m)',
    commonConversions: [
      { label: '米 → 千米', from: 'meter', to: 'kilometer' },
      { label: '英尺 → 米', from: 'foot', to: 'meter' },
      { label: '英寸 → 厘米', from: 'inch', to: 'centimeter' },
      { label: '英里 → 千米', from: 'mile', to: 'kilometer' }
    ],
    units: [
      { key: 'kilometer', name: '千米', symbol: 'km', factor: 1000, precision: 'exact' },
      { key: 'hectometer', name: '百米', symbol: 'hm', factor: 100, precision: 'exact' },
      { key: 'decameter', name: '十米', symbol: 'dam', factor: 10, precision: 'exact' },
      { key: 'meter', name: '米', symbol: 'm', factor: 1, precision: 'exact' },
      { key: 'decimeter', name: '分米', symbol: 'dm', factor: 0.1, precision: 'exact' },
      { key: 'centimeter', name: '厘米', symbol: 'cm', factor: 0.01, precision: 'exact' },
      { key: 'millimeter', name: '毫米', symbol: 'mm', factor: 0.001, precision: 'exact' },
      { key: 'micrometer', name: '微米', symbol: 'μm', factor: 0.000001, precision: 'exact' },
      { key: 'nanometer', name: '纳米', symbol: 'nm', factor: 1e-9, precision: 'exact' },
      { key: 'mile', name: '英里', symbol: 'mi', factor: 1609.344, precision: 'exact' },
      { key: 'yard', name: '码', symbol: 'yd', factor: 0.9144, precision: 'exact' },
      { key: 'foot', name: '英尺', symbol: 'ft', factor: 0.3048, precision: 'exact' },
      { key: 'inch', name: '英寸', symbol: 'in', factor: 0.0254, precision: 'exact' },
      { key: 'nautical-mile', name: '海里', symbol: 'nmi', factor: 1852, precision: 'exact' },
      { key: 'li', name: '里', symbol: '里', factor: 500, precision: 'approximate' },
      { key: 'zhang', name: '丈', symbol: '丈', factor: 3.33333, precision: 'approximate' },
      { key: 'chi', name: '尺', symbol: '尺', factor: 0.33333, precision: 'approximate' },
      { key: 'cun', name: '寸', symbol: '寸', factor: 0.03333, precision: 'approximate' }
    ]
  },
  {
    key: 'weight',
    label: '重量',
    icon: 'Scale',
    baseUnit: '千克 (kg)',
    commonConversions: [
      { label: '千克 → 斤', from: 'kilogram', to: 'jin' },
      { label: '磅 → 千克', from: 'pound', to: 'kilogram' },
      { label: '盎司 → 克', from: 'ounce', to: 'gram' },
      { label: '吨 → 千克', from: 'tonne', to: 'kilogram' }
    ],
    units: [
      { key: 'tonne', name: '吨', symbol: 't', factor: 1000, precision: 'exact' },
      { key: 'kilogram', name: '千克', symbol: 'kg', factor: 1, precision: 'exact' },
      { key: 'hectogram', name: '百克', symbol: 'hg', factor: 0.1, precision: 'exact' },
      { key: 'decagram', name: '十克', symbol: 'dag', factor: 0.01, precision: 'exact' },
      { key: 'gram', name: '克', symbol: 'g', factor: 0.001, precision: 'exact' },
      { key: 'milligram', name: '毫克', symbol: 'mg', factor: 0.000001, precision: 'exact' },
      { key: 'microgram', name: '微克', symbol: 'μg', factor: 1e-9, precision: 'exact' },
      { key: 'pound', name: '磅', symbol: 'lb', factor: 0.453592, precision: 'approximate' },
      { key: 'ounce', name: '盎司', symbol: 'oz', factor: 0.0283495, precision: 'approximate' },
      { key: 'jin', name: '斤', symbol: '斤', factor: 0.5, precision: 'approximate' },
      { key: 'liang', name: '两', symbol: '两', factor: 0.05, precision: 'approximate' },
      { key: 'qian', name: '钱', symbol: '钱', factor: 0.005, precision: 'approximate' },
      { key: 'carat', name: '克拉', symbol: 'ct', factor: 0.0002, precision: 'exact' }
    ]
  },
  {
    key: 'area',
    label: '面积',
    icon: 'Grid',
    baseUnit: '平方米 (m²)',
    commonConversions: [
      { label: '平方米 → 亩', from: 'square-meter', to: 'mu' },
      { label: '公顷 → 平方米', from: 'hectare', to: 'square-meter' },
      { label: '平方英尺 → 平方米', from: 'square-foot', to: 'square-meter' },
      { label: '平方公里 → 公顷', from: 'square-kilometer', to: 'hectare' }
    ],
    units: [
      { key: 'square-kilometer', name: '平方千米', symbol: 'km²', factor: 1000000, precision: 'exact' },
      { key: 'hectare', name: '公顷', symbol: 'ha', factor: 10000, precision: 'exact' },
      { key: 'are', name: '公亩', symbol: 'a', factor: 100, precision: 'exact' },
      { key: 'square-meter', name: '平方米', symbol: 'm²', factor: 1, precision: 'exact' },
      { key: 'square-decimeter', name: '平方分米', symbol: 'dm²', factor: 0.01, precision: 'exact' },
      { key: 'square-centimeter', name: '平方厘米', symbol: 'cm²', factor: 0.0001, precision: 'exact' },
      { key: 'square-millimeter', name: '平方毫米', symbol: 'mm²', factor: 1e-6, precision: 'exact' },
      { key: 'square-mile', name: '平方英里', symbol: 'mi²', factor: 2589988.11, precision: 'approximate' },
      { key: 'acre', name: '英亩', symbol: 'ac', factor: 4046.85642, precision: 'approximate' },
      { key: 'square-foot', name: '平方英尺', symbol: 'ft²', factor: 0.092903, precision: 'approximate' },
      { key: 'square-inch', name: '平方英寸', symbol: 'in²', factor: 0.00064516, precision: 'approximate' },
      { key: 'mu', name: '亩', symbol: '亩', factor: 666.66667, precision: 'approximate' },
      { key: 'fen', name: '分', symbol: '分', factor: 66.66667, precision: 'approximate' },
      { key: 'square-zhang', name: '平方丈', symbol: '平方丈', factor: 11.11111, precision: 'approximate' }
    ]
  },
  {
    key: 'volume',
    label: '体积',
    icon: 'Box',
    baseUnit: '立方米 (m³)',
    commonConversions: [
      { label: '升 → 毫升', from: 'liter', to: 'milliliter' },
      { label: '立方米 → 升', from: 'cubic-meter', to: 'liter' },
      { label: '加仑 → 升', from: 'gallon-us', to: 'liter' },
      { label: '立方英尺 → 立方米', from: 'cubic-foot', to: 'cubic-meter' }
    ],
    units: [
      { key: 'cubic-meter', name: '立方米', symbol: 'm³', factor: 1, precision: 'exact' },
      { key: 'cubic-decimeter', name: '立方分米', symbol: 'dm³', factor: 0.001, precision: 'exact' },
      { key: 'cubic-centimeter', name: '立方厘米', symbol: 'cm³', factor: 1e-6, precision: 'exact' },
      { key: 'cubic-millimeter', name: '立方毫米', symbol: 'mm³', factor: 1e-9, precision: 'exact' },
      { key: 'liter', name: '升', symbol: 'L', factor: 0.001, precision: 'exact' },
      { key: 'deciliter', name: '分升', symbol: 'dL', factor: 0.0001, precision: 'exact' },
      { key: 'centiliter', name: '厘升', symbol: 'cL', factor: 0.00001, precision: 'exact' },
      { key: 'milliliter', name: '毫升', symbol: 'mL', factor: 1e-6, precision: 'exact' },
      { key: 'cubic-foot', name: '立方英尺', symbol: 'ft³', factor: 0.0283168, precision: 'approximate' },
      { key: 'cubic-inch', name: '立方英寸', symbol: 'in³', factor: 1.63871e-5, precision: 'approximate' },
      { key: 'gallon-us', name: '美制加仑', symbol: 'gal(US)', factor: 0.00378541, precision: 'approximate' },
      { key: 'gallon-uk', name: '英制加仑', symbol: 'gal(UK)', factor: 0.00454609, precision: 'approximate' },
      { key: 'quart-us', name: '美制夸脱', symbol: 'qt(US)', factor: 0.000946353, precision: 'approximate' },
      { key: 'pint-us', name: '美制品脱', symbol: 'pt(US)', factor: 0.000473176, precision: 'approximate' },
      { key: 'fluid-ounce-us', name: '美制液盎司', symbol: 'fl oz(US)', factor: 2.95735e-5, precision: 'approximate' },
      { key: 'cubic-yard', name: '立方码', symbol: 'yd³', factor: 0.764555, precision: 'approximate' }
    ]
  },
  {
    key: 'temperature',
    label: '温度',
    icon: 'Sunny',
    baseUnit: '摄氏度 (°C)',
    commonConversions: [
      { label: '摄氏度 → 华氏度', from: 'celsius', to: 'fahrenheit' },
      { label: '华氏度 → 摄氏度', from: 'fahrenheit', to: 'celsius' },
      { label: '摄氏度 → 开尔文', from: 'celsius', to: 'kelvin' }
    ],
    units: [
      { key: 'celsius', name: '摄氏度', symbol: '°C', factor: 1, precision: 'exact' },
      { key: 'fahrenheit', name: '华氏度', symbol: '°F', factor: 1, precision: 'exact' },
      { key: 'kelvin', name: '开尔文', symbol: 'K', factor: 1, precision: 'exact' }
    ]
  },
  {
    key: 'time',
    label: '时间',
    icon: 'Timer',
    baseUnit: '秒 (s)',
    commonConversions: [
      { label: '小时 → 分钟', from: 'hour', to: 'minute' },
      { label: '天 → 小时', from: 'day', to: 'hour' },
      { label: '周 → 天', from: 'week', to: 'day' },
      { label: '毫秒 → 秒', from: 'millisecond', to: 'second' }
    ],
    units: [
      { key: 'millennium', name: '千年', symbol: 'kyr', factor: 31536000000, precision: 'approximate' },
      { key: 'century', name: '世纪', symbol: 'c', factor: 3153600000, precision: 'approximate' },
      { key: 'decade', name: '十年', symbol: 'dec', factor: 315360000, precision: 'approximate' },
      { key: 'year', name: '年', symbol: 'yr', factor: 31536000, precision: 'approximate' },
      { key: 'month', name: '月(30天)', symbol: 'mo', factor: 2592000, precision: 'approximate' },
      { key: 'week', name: '周', symbol: 'wk', factor: 604800, precision: 'exact' },
      { key: 'day', name: '天', symbol: 'd', factor: 86400, precision: 'exact' },
      { key: 'hour', name: '小时', symbol: 'h', factor: 3600, precision: 'exact' },
      { key: 'minute', name: '分钟', symbol: 'min', factor: 60, precision: 'exact' },
      { key: 'second', name: '秒', symbol: 's', factor: 1, precision: 'exact' },
      { key: 'millisecond', name: '毫秒', symbol: 'ms', factor: 0.001, precision: 'exact' },
      { key: 'microsecond', name: '微秒', symbol: 'μs', factor: 1e-6, precision: 'exact' },
      { key: 'nanosecond', name: '纳秒', symbol: 'ns', factor: 1e-9, precision: 'exact' }
    ]
  },
  {
    key: 'speed',
    label: '速度',
    icon: 'Odometer',
    baseUnit: '米/秒 (m/s)',
    commonConversions: [
      { label: 'km/h → m/s', from: 'kilometer-per-hour', to: 'meter-per-second' },
      { label: 'mph → km/h', from: 'mile-per-hour', to: 'kilometer-per-hour' },
      { label: '节 → km/h', from: 'knot', to: 'kilometer-per-hour' },
      { label: '马赫 → km/h', from: 'mach', to: 'kilometer-per-hour' }
    ],
    units: [
      { key: 'meter-per-second', name: '米/秒', symbol: 'm/s', factor: 1, precision: 'exact' },
      { key: 'kilometer-per-hour', name: '千米/时', symbol: 'km/h', factor: 0.277778, precision: 'approximate' },
      { key: 'kilometer-per-second', name: '千米/秒', symbol: 'km/s', factor: 1000, precision: 'exact' },
      { key: 'mile-per-hour', name: '英里/时', symbol: 'mph', factor: 0.44704, precision: 'approximate' },
      { key: 'foot-per-second', name: '英尺/秒', symbol: 'ft/s', factor: 0.3048, precision: 'approximate' },
      { key: 'knot', name: '节', symbol: 'kn', factor: 0.514444, precision: 'approximate' },
      { key: 'mach', name: '马赫', symbol: 'Ma', factor: 340.29, precision: 'approximate' },
      { key: 'speed-of-light', name: '光速', symbol: 'c', factor: 299792458, precision: 'exact' }
    ]
  },
  {
    key: 'data',
    label: '数据',
    icon: 'Files',
    baseUnit: '字节 (B)',
    commonConversions: [
      { label: 'GB → MB', from: 'gigabyte', to: 'megabyte' },
      { label: 'TB → GB', from: 'terabyte', to: 'gigabyte' },
      { label: 'MB → KB', from: 'megabyte', to: 'kilobyte' },
      { label: 'KB → B', from: 'kilobyte', to: 'byte' }
    ],
    units: [
      { key: 'bit', name: '比特', symbol: 'b', factor: 0.125, precision: 'exact' },
      { key: 'kilobit', name: '千比特', symbol: 'Kb', factor: 128, precision: 'exact' },
      { key: 'megabit', name: '兆比特', symbol: 'Mb', factor: 131072, precision: 'exact' },
      { key: 'gigabit', name: '吉比特', symbol: 'Gb', factor: 134217728, precision: 'exact' },
      { key: 'terabit', name: '太比特', symbol: 'Tb', factor: 137438953472, precision: 'exact' },
      { key: 'byte', name: '字节', symbol: 'B', factor: 1, precision: 'exact' },
      { key: 'kilobyte', name: '千字节', symbol: 'KB', factor: 1024, precision: 'exact' },
      { key: 'megabyte', name: '兆字节', symbol: 'MB', factor: 1048576, precision: 'exact' },
      { key: 'gigabyte', name: '吉字节', symbol: 'GB', factor: 1073741824, precision: 'exact' },
      { key: 'terabyte', name: '太字节', symbol: 'TB', factor: 1099511627776, precision: 'exact' },
      { key: 'petabyte', name: '拍字节', symbol: 'PB', factor: 1125899906842624, precision: 'exact' }
    ]
  }
]

const inputValue = ref<number>(1)
const selectedCategory = ref<string>('length')
const fromUnit = ref<string>('meter')
const decimalPlaces = ref<number>(6)
const conversionResults = ref<{ unit: Unit; value: number }[]>([])
const detailDialogVisible = ref(false)
const verifyDialogVisible = ref(false)
const showFormulaDialog = ref(false)
const currentDetail = ref<{ unit: Unit; value: number } | null>(null)
const verifyData = ref<VerifyData | null>(null)

const quickValues = [1, 10, 100, 1000, 10000]

const currentCategory = computed(() => {
  return categories.find(c => c.key === selectedCategory.value)
})

const currentCategoryLabel = computed(() => {
  return currentCategory.value?.label || ''
})

const currentUnits = computed(() => {
  return currentCategory.value?.units || []
})

const fromUnitInfo = computed(() => {
  return currentUnits.value.find(u => u.key === fromUnit.value)
})

const currentCategoryConversions = computed(() => {
  return currentCategory.value?.commonConversions || []
})

const approximateCount = computed(() => {
  return currentUnits.value.filter(u => u.precision === 'approximate').length
})

const convertTemperature = (value: number, from: string, to: string): number => {
  let celsius: number

  switch (from) {
    case 'celsius':
      celsius = value
      break
    case 'fahrenheit':
      celsius = (value - 32) * 5 / 9
      break
    case 'kelvin':
      celsius = value - 273.15
      break
    default:
      celsius = value
  }

  switch (to) {
    case 'celsius':
      return celsius
    case 'fahrenheit':
      return celsius * 9 / 5 + 32
    case 'kelvin':
      return celsius + 273.15
    default:
      return celsius
  }
}

const convert = () => {
  if (!inputValue.value || !currentCategory.value) {
    conversionResults.value = []
    return
  }

  const results: { unit: Unit; value: number }[] = []

  if (selectedCategory.value === 'temperature') {
    for (const unit of currentUnits.value) {
      const convertedValue = convertTemperature(inputValue.value, fromUnit.value, unit.key)
      results.push({ unit, value: convertedValue })
    }
  } else {
    const fromUnitData = currentUnits.value.find(u => u.key === fromUnit.value)
    if (!fromUnitData) return

    const baseValue = inputValue.value * fromUnitData.factor

    for (const unit of currentUnits.value) {
      const convertedValue = baseValue / unit.factor
      results.push({ unit, value: convertedValue })
    }
  }

  conversionResults.value = results
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', { maximumFractionDigits: decimalPlaces.value })
}

const formatResult = (num: number): string => {
  if (Math.abs(num) < 0.000001 && num !== 0) {
    return num.toExponential(4)
  }
  if (Math.abs(num) >= 1000000) {
    return num.toExponential(4)
  }
  return num.toLocaleString('zh-CN', { maximumFractionDigits: decimalPlaces.value })
}

const formatFullPrecision = (num: number): string => {
  return num.toString()
}

const formatFullPrecisionShort = (num: number): string => {
  const str = num.toString()
  if (str.length > 15) {
    return str.substring(0, 15) + '...'
  }
  return str
}

const getConversionFactor = (targetUnit: Unit): string => {
  if (selectedCategory.value === 'temperature') {
    return '公式换算'
  }
  const fromFactor = fromUnitInfo.value?.factor || 1
  const factor = fromFactor / targetUnit.factor
  return formatFullPrecision(factor)
}

const getFormulaText = (targetUnit: Unit): string => {
  if (selectedCategory.value === 'temperature') {
    if (fromUnit.value === 'celsius' && targetUnit.key === 'fahrenheit') {
      return '°F = °C × 9/5 + 32'
    } else if (fromUnit.value === 'fahrenheit' && targetUnit.key === 'celsius') {
      return '°C = (°F - 32) × 5/9'
    } else if (fromUnit.value === 'celsius' && targetUnit.key === 'kelvin') {
      return 'K = °C + 273.15'
    } else if (fromUnit.value === 'kelvin' && targetUnit.key === 'celsius') {
      return '°C = K - 273.15'
    }
    return '温度公式换算'
  }
  const fromFactor = fromUnitInfo.value?.factor || 1
  const factor = fromFactor / targetUnit.factor
  return `1 ${fromUnitInfo.value?.symbol} = ${formatFullPrecision(factor)} ${targetUnit.symbol}`
}

const setQuickValue = (val: number) => {
  inputValue.value = val
  convert()
}

const applyConversion = (conv: { label: string; from: string; to: string }) => {
  fromUnit.value = conv.from
  convert()
  ElMessage.success(`已切换到 ${conv.label}`)
}

const copyDisplayValue = (result: { unit: Unit; value: number }) => {
  const text = formatResult(result.value)
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(`已复制显示值: ${text} ${result.unit.symbol}`)
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const copyFullValue = (result: { unit: Unit; value: number }) => {
  const text = formatFullPrecision(result.value)
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(`已复制完整值: ${text} ${result.unit.symbol}`)
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const handleCopyCommand = (command: string, result: { unit: Unit; value: number }) => {
  if (command === 'display') {
    copyDisplayValue(result)
  } else if (command === 'full') {
    copyFullValue(result)
  } else if (command === 'verify') {
    verifyResult(result)
  }
}

const showResultDetail = (result: { unit: Unit; value: number }) => {
  currentDetail.value = result
  detailDialogVisible.value = true
}

const verifyResult = (result: { unit: Unit; value: number }) => {
  const forwardValue = result.value
  let reverseValue: number

  if (selectedCategory.value === 'temperature') {
    reverseValue = convertTemperature(forwardValue, result.unit.key, fromUnit.value)
  } else {
    const baseValue = forwardValue * result.unit.factor
    reverseValue = baseValue / (fromUnitInfo.value?.factor || 1)
  }

  const error = Math.abs(reverseValue - inputValue.value)
  const relativeError = inputValue.value !== 0 ? error / Math.abs(inputValue.value) : 0
  const passed = error < 1e-10

  verifyData.value = {
    unit: result.unit,
    forwardValue,
    reverseValue,
    error,
    relativeError,
    passed
  }

  verifyDialogVisible.value = true
  detailDialogVisible.value = false
}

onMounted(() => {
  convert()
})
</script>

<style scoped>
.unit-converter {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.converter-card {
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

.category-tabs {
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
  overflow-x: auto;
}

.category-tabs :deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tabs :deep(.el-radio-button__inner) {
  display: flex;
  align-items: center;
  gap: 4px;
}

.converter-form {
  margin-top: 20px;
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

.quick-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.quick-tag {
  padding: 4px 12px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-tag:hover {
  background: #165DFF;
  border-color: #165DFF;
  color: #fff;
}

.field-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.common-conversions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.conversion-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.conversion-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.conversion-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.result-card {
  margin-bottom: 24px;
}

.result-input-show {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
  margin-bottom: 24px;
}

.input-value {
  font-size: 32px;
  font-weight: bold;
  color: #165DFF;
}

.input-unit {
  font-size: 16px;
  color: #606266;
}

.equal-icon {
  font-size: 24px;
  color: #909399;
}

.result-hint {
  font-size: 14px;
  color: #909399;
}

.formula-btn {
  margin-left: auto;
}

.result-grid {
  margin-bottom: 20px;
}

.result-item {
  position: relative;
  padding: 20px 16px;
  background: #fff;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 16px;
}

.result-item:hover {
  border-color: #165DFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.result-item.is-from {
  border-color: #165DFF;
  background: #f0f7ff;
}

.result-precision {
  position: absolute;
  top: 8px;
  left: 8px;
}

.result-item.is-approximate {
  border-color: #E6A23C;
  background: #fdf6ec;
}

.result-item.is-approximate:hover {
  border-color: #E6A23C;
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.15);
}

.result-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
  word-break: break-all;
}

.result-unit {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.result-symbol {
  font-size: 12px;
  color: #909399;
}

.copy-dropdown {
  position: absolute;
  top: 8px;
  right: 8px;
}

.copy-trigger {
  opacity: 0;
  transition: all 0.3s;
}

.result-item:hover .copy-trigger {
  opacity: 1;
}

.copy-icon {
  font-size: 14px;
  color: #165DFF;
  cursor: pointer;
}

.result-table-wrapper h4 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #303133;
}

.table-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 500;
  color: #165DFF;
}

.factor-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #606266;
  cursor: help;
}

.full-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #909399;
  cursor: help;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}

.precision-rules {
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

.rule-item {
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
  height: 100%;
}

.rule-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.rule-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.6;
}

.precision-summary {
  margin-left: auto;
}

.precision-summary-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.precision-alert {
  margin-bottom: 16px;
}

.precision-alert :deep(.el-alert__title) {
  font-size: 13px;
  line-height: 1.6;
}

.detail-content {
  padding: 10px 0;
}

.detail-highlight {
  font-size: 18px;
  font-weight: bold;
  color: #165DFF;
}

.detail-result {
  font-size: 20px;
  font-weight: bold;
  color: #165DFF;
}

.full-precision-text {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  color: #606266;
  word-break: break-all;
}

.formula-code {
  display: block;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  color: #303133;
}

.calculation-steps {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  line-height: 1.8;
  color: #606266;
}

.calculation-steps p {
  margin: 4px 0;
}

.detail-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: center;
}

.verify-content {
  padding: 10px 0;
}

.verify-alert {
  margin-bottom: 16px;
}

.verify-desc {
  margin-top: 16px;
}

.error-small {
  color: #67c23a;
  font-family: 'Monaco', 'Menlo', monospace;
}

.error-large {
  color: #e6a23c;
  font-family: 'Monaco', 'Menlo', monospace;
}

.all-formulas {
  padding: 10px 0;
}

.formula-intro {
  margin: 0 0 16px;
  padding: 12px 16px;
  background: #ecf5ff;
  border-radius: 6px;
  font-size: 14px;
  color: #409eff;
  line-height: 1.6;
}

.formula-inline {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #303133;
}
</style>
