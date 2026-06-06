<template>
  <div class="number-to-chinese">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
        <el-tag size="small" type="warning" class="header-right-tag">
          <el-icon :size="12"><Warning /></el-icon>
          支持"元"和"圆"两种格式可选
        </el-tag>
      </template>
      <el-steps :active="0" finish-status="wait" simple class="guide-steps">
        <el-step title="选择格式" description="根据财务单据要求，选择使用"元整"或"圆整"" />
        <el-step title="输入数字" description="输入阿拉伯数字，支持小数、千分位格式（如 1,234,567.89）" />
        <el-step title="一键转换" description="点击转换按钮，系统自动生成规范的中文大写金额" />
      </el-steps>
      <el-divider />
      <div class="conversion-rules">
        <h4 class="rules-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          中文大写金额规范
        </h4>
        <el-row :gutter="16">
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">数字写法</div>
              <div class="rule-desc">零、壹、贰、叁、肆、伍、陆、柒、捌、玖</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">数位单位</div>
              <div class="rule-desc">拾、佰、仟、万、亿</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">金额单位</div>
              <div class="rule-desc">必含"元/圆字；无角分时加"整"字</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">适用场景</div>
              <div class="rule-desc">发票、支票、合同、财务报表、汇款单等</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="unit-selector-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <Setting />
          </el-icon>
          <span>货币单位格式选择</span>
          <el-tag size="small" type="warning" class="header-tag">不同银行/合同要求可能不同</el-tag>
        </div>
      </template>
      <div class="unit-options">
        <label
          class="unit-option"
          :class="{ active: currencyUnit === 'yuan' }"
          @click="currencyUnit = 'yuan'"
        >
          <div class="unit-option-radio">
          <span class="radio-dot" :class="{ checked: currencyUnit === 'yuan' }"></span>
        </div>
        <div class="unit-option-content">
          <div class="unit-option-title">
            <strong>元整格式</strong>
            <el-tag size="small" type="success" class="format-tag">推荐默认</el-tag>
          </div>
          <div class="unit-option-example">示例：壹仟元整</div>
          <div class="unit-option-scenarios">
            <el-tag size="small" effect="plain">发票</el-tag>
            <el-tag size="small" effect="plain">报销单</el-tag>
            <el-tag size="small" effect="plain">财务记账</el-tag>
            <el-tag size="small" effect="plain">日常票据</el-tag>
          </div>
          <div class="unit-option-desc">
            <el-icon :size="12" color="#909399"><InfoFilled /></el-icon>
            符合《会计基础工作规范》常用写法
          </div>
        </div>
        </label>

        <label
          class="unit-option"
          :class="{ active: currencyUnit === 'circle' }"
          @click="currencyUnit = 'circle'"
        >
          <div class="unit-option-radio">
          <span class="radio-dot" :class="{ checked: currencyUnit === 'circle' }"></span>
        </div>
        <div class="unit-option-content">
          <div class="unit-option-title">
            <strong>圆整格式</strong>
            <el-tag size="small" type="primary" class="format-tag">银行/合同专用</el-tag>
          </div>
          <div class="unit-option-example">示例：壹仟圆整</div>
          <div class="unit-option-scenarios">
            <el-tag size="small" effect="plain">银行支票</el-tag>
            <el-tag size="small" effect="plain">合同金额</el-tag>
            <el-tag size="small" effect="plain">汇票</el-tag>
            <el-tag size="small" effect="plain">本票</el-tag>
          </div>
          <div class="unit-option-desc">
            <el-icon :size="12" color="#909399"><InfoFilled /></el-icon>
            《票据法》正式法律文本规范写法
          </div>
        </div>
        </label>
      </div>
    </el-card>

    <el-card class="preview-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <View />
          </el-icon>
          <span>结果格式预览</span>
          <el-tag size="small" type="success" class="header-tag">
            当前：{{ currencyUnit === 'yuan' ? '元整格式' : '圆整格式' }}</el-tag>
        </div>
      </template>

      <div class="format-cases">
        <div class="case-item">
          <div class="case-header">
            <el-tag size="small" type="success">整数金额</el-tag>
            <span class="case-subtitle">无小数位 → 加"整"字</span>
          </div>
          <div class="case-example">
            <span class="case-input">输入：1,000.00</span>
            <el-icon class="case-arrow"><ArrowRight /></el-icon>
            <span class="case-output">{{ getPreviewExample(1000)</span>
          </div>
          <div class="case-note">
            <el-icon :size="12" color="#67c23a"><SuccessFilled /></el-icon>
            <span>无角分必须写"整"字，"{{ currencyUnitLabel }}"字不可省略</span>
          </div>
        </div>

        <div class="case-item">
          <div class="case-header">
            <el-tag size="small" type="primary">有角无分</el-tag>
            <span class="case-subtitle">仅角位有数 → 可以不加"整"</span>
          </div>
          <div class="case-example">
            <span class="case-input">输入：1,001.50</span>
            <el-icon class="case-arrow"><ArrowRight /></el-icon>
            <span class="case-output">{{ getPreviewExample(1001.5)</span>
          </div>
          <div class="case-note">
            <el-icon :size="12" color="#67c23a"><SuccessFilled /></el-icon>
            <span>"{{ currencyUnitLabel }}"后有角无分，末尾不写"整"字，中间连续零只写一个"零"</span>
          </div>
        </div>

        <div class="case-item">
          <div class="case-header">
            <el-tag size="small" type="warning">角分俱全</el-tag>
            <span class="case-subtitle">角分都有 → 不加"整"字</span>
          </div>
          <div class="case-example">
            <span class="case-input">输入：123.45</span>
            <el-icon class="case-arrow"><ArrowRight /></el-icon>
            <span class="case-output">{{ getPreviewExample(123.45)</span>
          </div>
          <div class="case-note">
            <el-icon :size="12" color="#67c23a"><SuccessFilled /></el-icon>
            <span>有角有分，末尾不写"整"字</span>
          </div>
        </div>

        <div class="case-item">
          <div class="case-header">
            <el-tag size="small" type="info">仅分有值</el-tag>
            <span class="case-subtitle">{{ currencyUnitLabel }}角为零 → "零{{ currencyUnitLabel }}X分"格式</span>
          </div>
          <div class="case-example">
            <span class="case-input">输入：0.05</span>
            <el-icon class="case-arrow"><ArrowRight /></el-icon>
            <span class="case-output">{{ getPreviewExample(0.05)</span>
          </div>
          <div class="case-note">
            <el-icon :size="12" color="#67c23a"><SuccessFilled /></el-icon>
            <span>金额小于1{{ currencyUnitLabel }}时，"零{{ currencyUnitLabel }}"必须保留</span>
          </div>
        </div>

        <div class="case-item">
          <div class="case-header">
            <el-tag size="small" type="danger">负数金额</el-tag>
            <span class="case-subtitle">小于零 → 前面加"负"字</span>
          </div>
          <div class="case-example">
            <span class="case-input">输入：-123.45</span>
            <el-icon class="case-arrow"><ArrowRight /></el-icon>
            <span class="case-output">{{ getPreviewExample(-123.45)</span>
          </div>
          <div class="case-note">
            <el-icon :size="12" color="#67c23a"><SuccessFilled /></el-icon>
            <span>负数金额在最前面加"负"字，后面格式不变</span>
          </div>
        </div>

        <div class="case-item">
          <div class="case-header">
            <el-tag size="small">大额金额</el-tag>
            <span class="case-subtitle">万/亿级 → 按4位分组</span>
          </div>
          <div class="case-example">
            <span class="case-input">输入：12,345.67</span>
            <el-icon class="case-arrow"><ArrowRight /></el-icon>
            <span class="case-output">{{ getPreviewExample(12345.67)</span>
          </div>
          <div class="case-note">
            <el-icon :size="12" color="#67c23a"><SuccessFilled /></el-icon>
            <span>支持最大亿亿级（16位整数），完全符合财务记账规范</span>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="converter-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Money />
          </el-icon>
          <span>数字转中文大写</span>
          <el-tag v-if="currencyUnit === 'yuan'" size="small" type="success" class="header-tag">元整格式</el-tag>
          <el-tag v-else size="small" type="primary" class="header-tag">圆整格式</el-tag>
        </div>
      </template>

      <el-form label-width="100px" class="converter-form">
        <el-form-item label="输入金额">
          <div class="form-item-with-help">
            <el-tooltip content="输入阿拉伯数字，支持千分位格式（如 1,234,567.89）" placement="top">
              <el-icon class="help-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
            <el-input
              v-model="inputValue"
              style="width: 100%"
              placeholder="请输入金额，如：1234567.89 或 1,234,567.89"
              @input="handleInput"
            />
          </div>
          <div class="quick-amounts">
            <span class="quick-label">常用金额：</span>
            <span v-for="amount in quickAmounts" :key="amount" class="quick-tag" @click="setQuickValue(amount)">
              {{ formatThousands(amount) }}
            </span>
          </div>
        </el-form-item>

        <el-form-item label="实时预览">
          <el-switch v-model="enableLivePreview" />
          <span class="form-hint">
            <el-icon :size="12" color="#909399"><InfoFilled /></el-icon>
            开启后输入数字即时显示转换结果
          </span>
        </el-form-item>

        <el-form-item label="显示千分位">
          <el-switch v-model="showThousands" @change="handleThousandsToggle" />
        </el-form-item>
      </el-form>

      <div v-if="enableLivePreview && livePreviewResult" class="live-preview-box">
        <div class="live-preview-label">
          <el-icon :size="14" color="#67c23a"><View /></el-icon>
          <span>实时预览结果（{{ currencyUnitLabel }}）：</span>
        </div>
        <div class="live-preview-content">
          <span class="live-preview-text">{{ livePreviewResult }}</span>
          <el-tag v-if="inputValue" size="small" type="success">实时</el-tag>
          <el-tag v-else size="small" type="info">等待输入</el-tag>
        </div>
      </div>

      <div class="action-bar">
        <el-button type="primary" size="large" :icon="Transfer" @click="convert" style="min-width: 160px">
          开始转换
        </el-button>
        <el-button size="large" :icon="Refresh" @click="resetAll">
          重置
        </el-button>
      </div>
    </el-card>

    <el-card v-if="convertResult.success || convertResult.message" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" :color="convertResult.success ? '#67c23a' : '#e6a23c'">
            <DataLine />
          </el-icon>
          <span>转换结果</span>
          <el-tag v-if="convertResult.success" size="small" type="success">
            转换成功 · {{ currencyUnitLabel }}格式
          </el-tag>
          <el-tag v-else size="small" type="warning">提示</el-tag>
        </div>
      </template>

      <el-alert
        v-if="!convertResult.success && convertResult.message"
        type="warning"
        :closable="false"
        show-icon
        class="error-alert"
      >
        <template #title>
          <span>{{ convertResult.message }}</span>
        </template>
      </el-alert>

      <div v-if="convertResult.success" class="result-content">
        <div class="result-raw">
          <span class="raw-label">原始金额：</span>
          <span class="raw-value">¥ {{ displayValue }}</span>
        </div>

        <el-divider />

        <div class="result-display">
          <div class="result-label">中文大写金额（{{ currencyUnitLabel }}格式）：</div>
          <div class="result-box">
            <span class="result-text">{{ convertResult.result }}</span>
            <el-button type="primary" link :icon="CopyDocument" @click="copyResult" class="copy-btn">
              复制结果
            </el-button>
          </div>
        </div>

        <el-divider />

        <div class="result-details">
          <h4 class="details-title">金额分解</h4>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="整数部分">
              <span class="detail-highlight">{{ integerPartDisplay }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="小数部分">
              <span class="detail-highlight">{{ decimalPartDisplay }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="大写数字">
              零、壹、贰、叁、肆、伍、陆、柒、捌、玖
            </el-descriptions-item>
            <el-descriptions-item label="数位单位">
              拾、佰、仟、万、亿
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <el-divider />

        <div class="example-section">
          <h4 class="example-title">
            <el-icon :size="16" color="#165DFF"><Files /></el-icon>
            常用示例（{{ currencyUnitLabel }}格式）
          </h4>
          <el-table :data="examples" border stripe size="small" @row-click="useExample">
            <el-table-column prop="input" label="输入数字" width="180" />
            <el-table-column label="中文大写（{{ currencyUnitLabel }}）">
              <template #default="{ row }">
                <span style="color: #67c23a; font-weight: 600;">{{ getExampleOutput(row) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click.stop="useExample(row)">
                  使用此示例
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Money,
  DataLine,
  QuestionFilled,
  InfoFilled,
  Warning,
  Transfer,
  Refresh,
  CopyDocument,
  Files,
  View,
  ArrowRight,
  SuccessFilled,
  Setting
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  numberToChinese,
  formatNumberWithThousands,
  removeThousandsSeparator,
  type ConvertResult,
  type CurrencyUnit
} from '@/utils/numberToChinese'

const inputValue = ref<string>('')
const showThousands = ref<boolean>(true)
const enableLivePreview = ref<boolean>(true)
const currencyUnit = ref<CurrencyUnit>('yuan')
const convertResult = ref<ConvertResult>({
  success: false,
  result: ''
})

const quickAmounts = [100, 1000, 10000, 50000, 100000, 1000000]

const examples = [
  { input: '123.45', outputYuan: '壹佰贰拾叁元肆角伍分', outputCircle: '壹佰贰拾叁圆肆角伍分' },
  { input: '1,000.00', outputYuan: '壹仟元整', outputCircle: '壹仟圆整' },
  { input: '1001.50', outputYuan: '壹仟零壹元伍角', outputCircle: '壹仟零壹圆伍角' },
  { input: '12345.67', outputYuan: '壹万贰仟叁佰肆拾伍元陆角柒分', outputCircle: '壹万贰仟叁佰肆拾伍圆陆角柒分' },
  { input: '100000', outputYuan: '壹拾万元整', outputCircle: '壹拾万圆整' },
  { input: '100000000.00', outputYuan: '壹亿元整', outputCircle: '壹亿圆整' },
  { input: '0.05', outputYuan: '零元伍分', outputCircle: '零圆伍分' },
  { input: '-123.45', outputYuan: '负壹佰贰拾叁元肆角伍分', outputCircle: '负壹佰贰拾叁圆肆角伍分' }
]

const currencyUnitLabel = computed(() => {
  return currencyUnit.value === 'yuan' ? '元' : '圆'
})

const getPreviewExample = (num: number): string => {
  const res = numberToChinese(num, { currencyUnit: currencyUnit.value })
  return res.success ? res.result : ''
}

const getExampleOutput = (row: { outputYuan: string; outputCircle: string }): string => {
  return currencyUnit.value === 'yuan' ? row.outputYuan : row.outputCircle
}

const livePreviewResult = computed(() => {
  if (!enableLivePreview.value) return ''
  if (!inputValue.value.trim()) return ''
  const res = numberToChinese(inputValue.value, { currencyUnit: currencyUnit.value })
  return res.success ? res.result : ''
})

const displayValue = computed(() => {
  const raw = removeThousandsSeparator(inputValue.value)
  if (!raw) return '0.00'
  if (showThousands.value) {
    return formatNumberWithThousands(raw)
  }
  return raw
})

const integerPartDisplay = computed(() => {
  const raw = removeThousandsSeparator(inputValue.value)
  if (!raw) return '0'
  const parts = raw.split('.')
  return showThousands.value ? formatNumberWithThousands(parts[0]) : parts[0]
})

const decimalPartDisplay = computed(() => {
  const raw = removeThousandsSeparator(inputValue.value)
  if (!raw) return '00'
  const parts = raw.split('.')
  if (parts.length > 1) {
    return parts[1].padEnd(2, '0').slice(0, 2)
  }
  return '00'
})

const handleInput = (value: string) => {
  if (showThousands.value) {
    const raw = removeThousandsSeparator(value)
    if (raw && /^-?\d*\.?\d*$/.test(raw)) {
      const parts = raw.split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      inputValue.value = parts.join('.')
    }
  }
}

const handleThousandsToggle = (val: boolean) => {
  if (val) {
    const raw = removeThousandsSeparator(inputValue.value)
    if (raw) {
      inputValue.value = formatNumberWithThousands(raw)
    }
  } else {
    inputValue.value = removeThousandsSeparator(inputValue.value)
  }
}

const setQuickValue = (amount: number) => {
  if (showThousands.value) {
    inputValue.value = formatNumberWithThousands(amount.toString())
  } else {
    inputValue.value = amount.toString()
  }
  ElMessage.success(`已填入金额 ${formatNumberWithThousands(amount.toString())}`)
}

const formatThousands = (num: number): string => {
  return formatNumberWithThousands(num.toString())
}

const convert = () => {
  if (!inputValue.value.trim()) {
    convertResult.value = {
      success: false,
      result: '',
      message: '请输入需要转换的金额数字'
    }
    return
  }
  convertResult.value = numberToChinese(inputValue.value, { currencyUnit: currencyUnit.value })
  if (convertResult.value.success) {
    ElMessage.success('转换成功')
  }
}

const copyResult = () => {
  if (!convertResult.value.result) {
    ElMessage.warning('没有可复制的内容')
    return
  }
  navigator.clipboard.writeText(convertResult.value.result).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动选择复制')
  })
}

const useExample = (row: { input: string }) => {
  if (showThousands.value && !row.input.includes(',')) {
    inputValue.value = formatNumberWithThousands(row.input)
  } else {
    inputValue.value = row.input
  }
  convert()
}

const resetAll = () => {
  inputValue.value = ''
  convertResult.value = {
    success: false,
    result: ''
  }
  ElMessage.info('已重置')
}
</script>

<style scoped>
.number-to-chinese {
  max-width: 1000px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.header-right-tag {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

.unit-selector-card {
  margin-bottom: 24px;
}

.unit-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.unit-option {
  display: flex;
  gap: 14px;
  padding: 20px;
  background: #fafafa;
  border: 2px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.unit-option:hover {
  background: #f0f7ff;
  border-color: #c6e2ff;
}

.unit-option.active {
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-color: #165DFF;
  box-shadow: 0 4px 16px rgba(22, 93, 255, 0.12);
}

.unit-option-radio {
  flex-shrink: 0;
  padding-top: 2px;
}

.radio-dot {
  display: block;
  width: 18px;
  height: 18px;
  border: 2px solid #dcdfe6;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s;
}

.radio-dot.checked {
  border-color: #165DFF;
}

.radio-dot.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: #165DFF;
  border-radius: 50%;
}

.unit-option-content {
  flex: 1;
  min-width: 0;
}

.unit-option-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 16px;
  color: #303133;
}

.format-tag {
  font-weight: normal;
}

.unit-option-example {
  font-size: 18px;
  font-weight: bold;
  color: #67c23a;
  letter-spacing: 1px;
  margin-bottom: 10px;
  padding: 8px 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e1f3d8;
}

.unit-option-scenarios {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.unit-option-desc {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.preview-card {
  margin-bottom: 24px;
}

.format-cases {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.case-item {
  padding: 16px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border: 1px solid #ebeef5;
  border-radius: 8px;
  transition: all 0.3s;
}

.case-item:hover {
  border-color: #165DFF;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
}

.case-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.case-subtitle {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.case-example {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 10px;
  border: 1px solid #ebeef5;
}

.case-input {
  font-size: 14px;
  color: #606266;
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 500;
}

.case-arrow {
  font-size: 14px;
  color: #165DFF;
  flex-shrink: 0;
}

.case-output {
  font-size: 16px;
  font-weight: bold;
  color: #67c23a;
  letter-spacing: 1px;
  word-break: break-all;
}

.case-note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
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

.converter-form {
  margin-top: 20px;
}

.form-item-with-help {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-hint {
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.help-icon {
  color: #909399;
  cursor: help;
  flex-shrink: 0;
}

.quick-amounts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.quick-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
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

.live-preview-box {
  margin: 16px 0;
  padding: 16px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border: 1px dashed #67c23a;
  border-radius: 8px;
}

.live-preview-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #67c23a;
  margin-bottom: 10px;
}

.live-preview-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.live-preview-text {
  font-size: 20px;
  font-weight: bold;
  color: #67c23a;
  letter-spacing: 2px;
  word-break: break-all;
  line-height: 1.5;
}

.action-bar {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.result-card {
  margin-bottom: 24px;
}

.error-alert {
  margin-bottom: 20px;
}

.result-content {
  padding: 0;
}

.result-raw {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.raw-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.raw-value {
  font-size: 28px;
  font-weight: bold;
  color: #165DFF;
  font-family: 'Monaco', 'Menlo', monospace;
}

.result-display {
  padding: 8px 0;
}

.result-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  margin-bottom: 12px;
}

.result-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border: 2px solid #67c23a;
  border-radius: 8px;
}

.result-text {
  font-size: 24px;
  font-weight: bold;
  color: #67c23a;
  letter-spacing: 2px;
  word-break: break-all;
  line-height: 1.5;
}

.copy-btn {
  flex-shrink: 0;
}

.result-details {
  padding: 8px 0;
}

.details-title {
  margin: 0 0 12px;
  font-size: 16px;
  color: #303133;
}

.detail-highlight {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 600;
  color: #165DFF;
}

.example-section {
  padding: 8px 0;
}

.example-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 12px;
  font-size: 16px;
  color: #303133;
}

:deep(.el-table tbody tr) {
  cursor: pointer;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}

.conversion-rules {
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

@media (max-width: 768px) {
  .unit-options {
    grid-template-columns: 1fr;
  }
  .format-cases {
    grid-template-columns: 1fr;
  }
}
</style>
