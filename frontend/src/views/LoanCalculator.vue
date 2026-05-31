<template>
  <div class="loan-calculator">
    <el-card class="calculator-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Money />
          </el-icon>
          <span>贷款试算</span>
        </div>
      </template>

      <el-form :model="form" label-width="100px" class="calculator-form">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="贷款金额">
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
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="贷款期限">
              <el-select v-model="form.months" style="width: 100%" placeholder="请选择贷款期限">
                <el-option v-for="year in yearOptions" :key="year" :label="`${year}年 (${year * 12}期)`" :value="year * 12" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="年利率">
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
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="还款方式">
              <el-radio-group v-model="form.type" style="width: 100%">
                <el-radio-button value="equal-principal-interest">等额本息</el-radio-button>
                <el-radio-button value="equal-principal">等额本金</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" :icon="Calculator" @click="calculate" style="width: 100%; height: 44px">
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
        </div>
      </template>

      <el-row :gutter="24" class="result-summary">
        <el-col :span="8">
          <div class="result-item">
            <div class="result-label">{{ form.type === 'equal-principal-interest' ? '每月还款' : '首月还款' }}</div>
            <div class="result-value">¥{{ formatNumber(result.monthlyPayment) }}</div>
            <div v-if="form.type === 'equal-principal'" class="result-sub">每月递减 ¥{{ formatNumber(result.monthlyDecrease) }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="result-item">
            <div class="result-label">支付利息</div>
            <div class="result-value interest">¥{{ formatNumber(result.totalInterest) }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="result-item">
            <div class="result-label">还款总额</div>
            <div class="result-value">¥{{ formatNumber(result.totalPayment) }}</div>
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
import { Calculator, Money, DataLine } from '@element-plus/icons-vue'
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

const form = ref<LoanForm>({
  amount: 100,
  months: 360,
  rate: 3.85,
  type: 'equal-principal-interest'
})

const result = ref<LoanResult | null>(null)
const scheduleView = ref<'all' | 'first12' | 'last12'>('all')

const yearOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30]

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

.calculator-form {
  margin-top: 20px;
}

.unit {
  margin-left: 8px;
  color: #606266;
  font-size: 14px;
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
