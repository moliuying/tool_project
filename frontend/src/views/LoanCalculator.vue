<template>
  <div class="loan-calculator">
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
        <el-step title="输入贷款金额" description="如购房总价100万，首付30万，贷款70万" />
        <el-step title="选择贷款期限" description="房贷一般选20-30年，消费贷可选1-5年" />
        <el-step title="填写年利率" description="当前首套房贷利率约3.5%-4.5%" />
        <el-step title="选择还款方式" description="等额本息月供固定，等额本金总利息少" />
        <el-step title="查看计算结果" description="点击计算，获取详细还款计划表" />
      </el-steps>
    </el-card>

    <el-card class="calculator-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Money />
          </el-icon>
          <span>贷款试算</span>
          <el-tag size="small" type="info" class="header-tag">支持房贷/车贷/消费贷</el-tag>
        </div>
      </template>

      <div class="quick-preset">
        <span class="preset-label">常用场景：</span>
        <el-button-group>
          <el-button size="small" @click="applyPreset('house')">
            <el-icon><HomeFilled /></el-icon>
            首套房贷
          </el-button>
          <el-button size="small" @click="applyPreset('car')">
            <el-icon><Van /></el-icon>
            车贷
          </el-button>
          <el-button size="small" @click="applyPreset('consumer')">
            <el-icon><ShoppingCart /></el-icon>
            消费贷
          </el-button>
          <el-button size="small" @click="applyPreset('business')">
            <el-icon><Briefcase /></el-icon>
            经营贷
          </el-button>
        </el-button-group>
      </div>

      <el-form :model="form" label-width="100px" class="calculator-form">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="贷款金额">
              <div class="form-item-with-help">
                <el-tooltip content="您需要从银行借入的本金总额，不包含首付" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-input-number
                  v-model="form.amount"
                  :min="1"
                  :max="100000000"
                  :step="10000"
                  :controls="false"
                  style="width: 100%"
                  placeholder="请输入贷款金额"
                />
                <span class="unit">万元</span>
              </div>
              <div class="quick-amount">
                <span v-for="item in quickAmounts" :key="item" class="quick-tag" @click="form.amount = item">
                  {{ item }}万
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="贷款期限">
              <div class="form-item-with-help">
                <el-tooltip content="贷款的还款时间，时间越长月供越低但总利息越多" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-select v-model="form.months" style="width: 100%" placeholder="请选择贷款期限">
                  <el-option v-for="year in yearOptions" :key="year" :label="`${year}年 (${year * 12}期)`" :value="year * 12" />
                </el-select>
              </div>
              <div class="field-hint">
                <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
                <span>房贷推荐20-30年，其他贷款建议3-5年</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="年利率">
              <div class="form-item-with-help">
                <el-tooltip content="银行贷款的年化利率，可咨询您的贷款经理" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-input-number
                  v-model="form.rate"
                  :min="0.01"
                  :max="30"
                  :step="0.01"
                  :precision="2"
                  :controls="false"
                  style="width: 100%"
                  placeholder="请输入年利率"
                />
                <span class="unit">%</span>
              </div>
              <div class="quick-rate">
                <span v-for="item in quickRates" :key="item.value" class="quick-tag" @click="form.rate = item.value">
                  {{ item.label }}
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="还款方式">
              <div class="form-item-with-help">
                <el-tooltip content="两种还款方式各有优劣，请根据您的收入情况选择" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-radio-group v-model="form.type" style="width: 100%">
                  <el-radio-button value="equal-principal-interest">等额本息</el-radio-button>
                  <el-radio-button value="equal-principal">等额本金</el-radio-button>
                </el-radio-group>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-card class="method-compare" shadow="never">
          <el-row :gutter="24">
            <el-col :span="12" :class="{ active: form.type === 'equal-principal-interest' }">
              <div class="compare-item" @click="form.type = 'equal-principal-interest'">
                <div class="compare-title">
                  <el-icon :size="16" color="#165DFF"><TrendCharts /></el-icon>
                  <span>等额本息</span>
                  <el-tag v-if="form.type === 'equal-principal-interest'" size="small" type="primary">已选</el-tag>
                </div>
                <p class="compare-desc">每月还款金额固定，适合收入稳定者</p>
                <div class="compare-pros">
                  <span class="pro-tag">✓ 月供固定，便于规划</span>
                  <span class="pro-tag">✓ 前期还款压力小</span>
                </div>
                <div class="compare-cons">
                  <span class="con-tag">✗ 总利息相对较多</span>
                </div>
              </div>
            </el-col>
            <el-col :span="12" :class="{ active: form.type === 'equal-principal' }">
              <div class="compare-item" @click="form.type = 'equal-principal'">
                <div class="compare-title">
                  <el-icon :size="16" color="#67c23a"><ArrowDown /></el-icon>
                  <span>等额本金</span>
                  <el-tag v-if="form.type === 'equal-principal'" size="small" type="success">已选</el-tag>
                </div>
                <p class="compare-desc">每月本金固定，月供逐月递减，总利息少</p>
                <div class="compare-pros">
                  <span class="pro-tag">✓ 总利息更少</span>
                  <span class="pro-tag">✓ 适合提前还款</span>
                </div>
                <div class="compare-cons">
                  <span class="con-tag">✗ 前期还款压力大</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="calculate" style="width: 100%; height: 48px; font-size: 16px">
            开始计算
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="result" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataLine />
          </el-icon>
          <span>计算结果</span>
          <el-tag size="small" type="success">已完成</el-tag>
        </div>
      </template>

      <el-row :gutter="24" class="result-summary">
        <el-col :span="8">
          <div class="result-item">
            <div class="result-label">{{ form.type === 'equal-principal-interest' ? '每月还款' : '首月还款' }}</div>
            <div class="result-value">¥{{ formatNumber(result.monthlyPayment) }}</div>
            <div v-if="form.type === 'equal-principal'" class="result-sub">每月递减 ¥{{ formatNumber(result.monthlyDecrease) }}</div>
            <div class="result-hint">
              <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
              <span>{{ form.type === 'equal-principal-interest' ? '每月还款金额固定不变' : '最后一期约 ¥' + formatNumber(result.schedule[result.schedule.length - 1].payment) }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="result-item">
            <div class="result-label">支付利息</div>
            <div class="result-value interest">¥{{ formatNumber(result.totalInterest) }}</div>
            <div class="result-hint">
              <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
              <span>占贷款本金的 {{ ((result.totalInterest / (form.amount! * 10000)) * 100).toFixed(1) }}%</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="result-item">
            <div class="result-label">还款总额</div>
            <div class="result-value">¥{{ formatNumber(result.totalPayment) }}</div>
            <div class="result-hint">
              <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
              <span>本金 + 利息合计</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <div class="schedule-header">
        <h4>还款计划表</h4>
        <el-radio-group v-model="scheduleView" size="small">
          <el-radio-button value="all">全部</el-radio-button>
          <el-radio-button value="first12">前12期</el-radio-button>
          <el-radio-button value="last12">后12期</el-radio-button>
        </el-radio-group>
      </div>

      <el-table :data="displaySchedule" border stripe style="width: 100%" max-height="400px">
        <el-table-column prop="month" label="期数" width="80" align="center" />
        <el-table-column prop="payment" label="月供(元)" width="140" align="right">
          <template #default="{ row }">
            {{ formatNumber(row.payment) }}
          </template>
        </el-table-column>
        <el-table-column prop="principal" label="本金(元)" width="140" align="right">
          <template #default="{ row }">
            {{ formatNumber(row.principal) }}
          </template>
        </el-table-column>
        <el-table-column prop="interest" label="利息(元)" width="140" align="right">
          <template #default="{ row }">
            {{ formatNumber(row.interest) }}
          </template>
        </el-table-column>
        <el-table-column prop="remaining" label="剩余本金(元)" align="right">
          <template #default="{ row }">
            {{ formatNumber(row.remaining) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  Money,
  DataLine,
  QuestionFilled,
  InfoFilled,
  HomeFilled,
  Van,
  ShoppingCart,
  Briefcase,
  TrendCharts,
  ArrowDown
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface LoanForm {
  amount: number | null
  months: number | null
  rate: number | null
  type: 'equal-principal-interest' | 'equal-principal'
}

interface ScheduleItem {
  month: number
  payment: number
  principal: number
  interest: number
  remaining: number
}

interface LoanResult {
  monthlyPayment: number
  totalInterest: number
  totalPayment: number
  monthlyDecrease?: number
  schedule: ScheduleItem[]
}

interface Preset {
  amount: number
  months: number
  rate: number
  type: 'equal-principal-interest' | 'equal-principal'
}

const form = ref<LoanForm>({
  amount: null,
  months: null,
  rate: null,
  type: 'equal-principal-interest'
})

const result = ref<LoanResult | null>(null)
const scheduleView = ref<'all' | 'first12' | 'last12'>('all')

const yearOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30]
const quickAmounts = [50, 100, 150, 200, 300, 500]
const quickRates = [
  { label: '公积金3.1%', value: 3.1 },
  { label: '商贷3.85%', value: 3.85 },
  { label: '消费贷4.5%', value: 4.5 },
  { label: '经营贷3.2%', value: 3.2 }
]

const presets: Record<string, Preset> = {
  house: { amount: 100, months: 360, rate: 3.85, type: 'equal-principal-interest' },
  car: { amount: 15, months: 36, rate: 4.5, type: 'equal-principal-interest' },
  consumer: { amount: 20, months: 24, rate: 4.5, type: 'equal-principal-interest' },
  business: { amount: 50, months: 60, rate: 3.2, type: 'equal-principal-interest' }
}

const displaySchedule = computed(() => {
  if (!result.value) return []
  const schedule = result.value.schedule
  if (scheduleView.value === 'first12') {
    return schedule.slice(0, 12)
  } else if (scheduleView.value === 'last12') {
    return schedule.slice(-12)
  }
  return schedule
})

const applyPreset = (type: string) => {
  const preset = presets[type]
  if (preset) {
    form.value = { ...preset }
    ElMessage.success(`已加载${type === 'house' ? '首套房贷' : type === 'car' ? '车贷' : type === 'consumer' ? '消费贷' : '经营贷'}默认参数`)
  }
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const calculate = () => {
  if (!form.value.amount || !form.value.months || !form.value.rate) {
    ElMessage.warning('请填写完整的贷款信息')
    return
  }

  const principal = form.value.amount * 10000
  const monthlyRate = form.value.rate / 100 / 12
  const months = form.value.months

  if (form.value.type === 'equal-principal-interest') {
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    const totalPayment = monthlyPayment * months
    const totalInterest = totalPayment - principal

    const schedule: ScheduleItem[] = []
    let remaining = principal

    for (let i = 1; i <= months; i++) {
      const interest = remaining * monthlyRate
      const principalPart = monthlyPayment - interest
      remaining -= principalPart

      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPart,
        interest,
        remaining: Math.max(0, remaining)
      })
    }

    result.value = {
      monthlyPayment,
      totalInterest,
      totalPayment,
      schedule
    }
  } else {
    const monthlyPrincipal = principal / months
    const totalInterest = (months + 1) * principal * monthlyRate / 2
    const totalPayment = principal + totalInterest
    const firstMonthPayment = monthlyPrincipal + principal * monthlyRate
    const monthlyDecrease = monthlyPrincipal * monthlyRate

    const schedule: ScheduleItem[] = []
    let remaining = principal

    for (let i = 1; i <= months; i++) {
      const interest = remaining * monthlyRate
      const payment = monthlyPrincipal + interest
      remaining -= monthlyPrincipal

      schedule.push({
        month: i,
        payment,
        principal: monthlyPrincipal,
        interest,
        remaining: Math.max(0, remaining)
      })
    }

    result.value = {
      monthlyPayment: firstMonthPayment,
      totalInterest,
      totalPayment,
      monthlyDecrease,
      schedule
    }
  }

  ElMessage.success('计算完成')
}
</script>

<style scoped>
.loan-calculator {
  max-width: 1000px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.calculator-card {
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

.quick-preset {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.preset-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.calculator-form {
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

.unit {
  margin-left: 8px;
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}

.quick-amount,
.quick-rate {
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

.method-compare {
  margin: 20px 0;
  background: #fafafa;
  border-radius: 8px;
}

.method-compare :deep(.el-card__body) {
  padding: 20px;
}

.compare-item {
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  background: #fff;
}

.compare-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.active .compare-item {
  border-color: #165DFF;
  background: #f0f7ff;
}

.compare-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.compare-title .el-tag {
  margin-left: auto;
}

.compare-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 12px;
}

.compare-pros,
.compare-cons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pro-tag {
  padding: 2px 8px;
  background: #f0f9eb;
  color: #67c23a;
  border-radius: 4px;
  font-size: 12px;
}

.con-tag {
  padding: 2px 8px;
  background: #fef0f0;
  color: #f56c6c;
  border-radius: 4px;
  font-size: 12px;
}

.result-summary {
  margin: 20px 0;
}

.result-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 8px;
}

.result-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.result-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.result-value.interest {
  color: #f56c6c;
}

.result-sub {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.result-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.schedule-header h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}
</style>
