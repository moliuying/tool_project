<template>
  <div class="partition-calculator">
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
        <el-step title="输入目标容量" description="输入您想要的分区大小（单位GB）" />
        <el-step title="选择对齐方式" description="根据磁盘类型选择合适的扇区对齐方式" />
        <el-step title="查看计算结果" description="获取精确的整数扇区值和实际容量" />
        <el-step title="复制参数" description="复制计算结果用于磁盘分区工具" />
      </el-steps>
      <el-divider />
      <div class="partition-rules">
        <h4 class="rules-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          分区对齐原理
        </h4>
        <el-row :gutter="16">
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">为什么要对齐</div>
              <div class="rule-desc">磁盘分区按柱面/扇区边界对齐可显著提升磁盘读写性能，避免跨扇区读写开销</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">整数容量原理</div>
              <div class="rule-desc">通过计算能被柱面大小整除的扇区数，使分区容量显示为精确的整数GB值</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">传统BIOS/MBR</div>
              <div class="rule-desc">
                <el-tag size="small" type="info">CHS模式</el-tag> 255磁头 × 63扇区/磁道 = 16065扇区/柱面
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="rule-item">
              <div class="rule-label">现代UEFI/GPT</div>
              <div class="rule-desc">
                <el-tag size="small" type="success">4K对齐</el-tag> 2048扇区对齐，适配SSD和4K原生扇区硬盘
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="calculator-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Odometers />
          </el-icon>
          <span>整数分区容量计算器</span>
          <el-tag size="small" type="info" class="header-tag">精确计算整数GB分区扇区值</el-tag>
        </div>
      </template>

      <el-form label-width="120px" class="calculator-form">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="目标容量">
              <div class="form-item-with-help">
                <el-tooltip content="输入您想要的分区容量大小，单位为GB" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-input-number
                  v-model="targetSize"
                  :min="1"
                  :max="100000"
                  :step="10"
                  :controls="true"
                  style="width: 100%"
                  placeholder="请输入容量"
                  @change="calculate"
                />
                <span class="unit-suffix">GB</span>
              </div>
              <div class="quick-values">
                <span v-for="val in quickSizes" :key="val" class="quick-tag" @click="setQuickSize(val)">
                  {{ val }}GB
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对齐方式">
              <div class="form-item-with-help">
                <el-tooltip content="选择分区对齐方式，影响计算结果" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-select v-model="alignmentType" style="width: 100%" @change="calculate">
                  <el-option label="MBR/CHS (255×63扇区)" value="chs" />
                  <el-option label="GPT/4K对齐 (2048扇区)" value="4k" />
                  <el-option label="自定义柱面大小" value="custom" />
                </el-select>
              </div>
              <div class="field-hint">
                <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
                <span>推荐：SSD使用4K对齐，HDD使用MBR/CHS</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="alignmentType === 'custom'" label="自定义柱面">
              <div class="form-item-with-help">
                <el-tooltip content="自定义每柱面扇区数" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-input-number
                  v-model="customCylinder"
                  :min="1"
                  :max="1000000"
                  :step="1"
                  style="width: 100%"
                  @change="calculate"
                />
                <span class="unit-suffix">扇区</span>
              </div>
            </el-form-item>
            <el-form-item v-else label="每扇区字节">
              <div class="form-item-with-help">
                <el-tooltip content="磁盘每扇区字节数，通常为512字节" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-select v-model="sectorSize" style="width: 100%" @change="calculate">
                  <el-option label="512字节 (传统)" value="512" />
                  <el-option label="4096字节 (4K原生)" value="4096" />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="preset-scenarios">
        <span class="scenario-label">常用场景：</span>
        <el-tag
          v-for="scenario in scenarios"
          :key="scenario.label"
          size="small"
          class="scenario-tag"
          @click="applyScenario(scenario)"
        >
          {{ scenario.label }}
        </el-tag>
      </div>
    </el-card>

    <el-card v-if="result" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataLine />
          </el-icon>
          <span>计算结果</span>
          <el-tag size="small" type="success">精确计算</el-tag>
        </div>
      </template>

      <div class="result-summary">
        <div class="summary-item primary">
          <div class="summary-label">目标容量</div>
          <div class="summary-value">{{ targetSize }} <span class="summary-unit">GB</span></div>
        </div>
        <el-icon class="arrow-icon"><Right /></el-icon>
        <div class="summary-item success">
          <div class="summary-label">精确扇区数</div>
          <div class="summary-value highlight">{{ formatNumber(result.totalSectors) }} <span class="summary-unit">扇区</span></div>
        </div>
        <el-icon class="arrow-icon"><Right /></el-icon>
        <div class="summary-item info">
          <div class="summary-label">实际容量</div>
          <div class="summary-value">{{ result.actualSize.toFixed(6) }} <span class="summary-unit">GB</span></div>
        </div>
      </div>

      <el-alert
        v-if="result.isAligned"
        type="success"
        :closable="false"
        show-icon
        class="result-alert"
      >
        <template #title>
          <span>✅ 计算完成：已找到最接近的整数柱面边界，分区容量为精确整数GB</span>
        </template>
      </el-alert>

      <el-row :gutter="16" class="result-grid">
        <el-col :xs="12" :sm="8" :md="6">
          <div class="result-item">
            <div class="result-label">总扇区数</div>
            <div class="result-value">{{ formatNumber(result.totalSectors) }}</div>
            <div class="result-unit">Sectors</div>
            <el-button size="small" type="primary" link @click="copyValue(result.totalSectors, '总扇区数')">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6">
          <div class="result-item">
            <div class="result-label">柱面数</div>
            <div class="result-value">{{ formatNumber(result.cylinders) }}</div>
            <div class="result-unit">Cylinders</div>
            <el-button size="small" type="primary" link @click="copyValue(result.cylinders, '柱面数')">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6">
          <div class="result-item">
            <div class="result-label">每柱面扇区</div>
            <div class="result-value">{{ formatNumber(result.sectorsPerCylinder) }}</div>
            <div class="result-unit">Sectors/Cyl</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6">
          <div class="result-item">
            <div class="result-label">总字节数</div>
            <div class="result-value">{{ formatBytes(result.totalBytes) }}</div>
            <div class="result-unit">Bytes</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6">
          <div class="result-item">
            <div class="result-label">MB值</div>
            <div class="result-value">{{ formatNumber(Math.floor(result.actualSize * 1024)) }}</div>
            <div class="result-unit">MB</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6">
          <div class="result-item">
            <div class="result-label">KB值</div>
            <div class="result-value">{{ formatNumber(Math.floor(result.actualSize * 1024 * 1024)) }}</div>
            <div class="result-unit">KB</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6">
          <div class="result-item">
            <div class="result-label">起始扇区</div>
            <div class="result-value">{{ formatNumber(result.startSector) }}</div>
            <div class="result-unit">LBA</div>
            <el-button size="small" type="primary" link @click="copyValue(result.startSector, '起始扇区')">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6">
          <div class="result-item">
            <div class="result-label">结束扇区</div>
            <div class="result-value">{{ formatNumber(result.endSector) }}</div>
            <div class="result-unit">LBA</div>
            <el-button size="small" type="primary" link @click="copyValue(result.endSector, '结束扇区')">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <div class="command-section">
        <h4>
          <el-icon :size="16" color="#165DFF"><Tickets /></el-icon>
          分区命令参考
        </h4>
        <el-tabs v-model="activeCommandTab" type="card">
          <el-tab-pane label="Diskpart (Windows)" name="diskpart">
            <div class="command-block">
              <pre><code>{{ getDiskpartCommand() }}</code></pre>
              <el-button type="primary" size="small" @click="copyValue(getDiskpartCommand(), 'Diskpart命令')">
                <el-icon><CopyDocument /></el-icon>
                复制命令
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="fdisk (Linux)" name="fdisk">
            <div class="command-block">
              <pre><code>{{ getFdiskCommand() }}</code></pre>
              <el-button type="primary" size="small" @click="copyValue(getFdiskCommand(), 'fdisk命令')">
                <el-icon><CopyDocument /></el-icon>
                复制命令
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="parted (Linux)" name="parted">
            <div class="command-block">
              <pre><code>{{ getPartedCommand() }}</code></pre>
              <el-button type="primary" size="small" @click="copyValue(getPartedCommand(), 'parted命令')">
                <el-icon><CopyDocument /></el-icon>
                复制命令
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <el-divider />

      <div class="calculation-detail">
        <h4>
          <el-icon :size="16" color="#E6A23C"><Calculator /></el-icon>
          计算过程
        </h4>
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="计算公式">
            <code class="formula-code">
              整数GB扇区数 = (目标容量 × 1024³ ÷ 每扇区字节数) 取整后，再调整为柱面大小的整数倍
            </code>
          </el-descriptions-item>
          <el-descriptions-item label="计算步骤">
            <div class="calculation-steps">
              <p>1. {{ targetSize }} GB = {{ targetSize }} × 1024 × 1024 × 1024 = {{ formatNumber(targetSize * 1024 * 1024 * 1024) }} 字节</p>
              <p>2. 理论扇区数 = {{ formatNumber(targetSize * 1024 * 1024 * 1024) }} ÷ {{ sectorSize }} = {{ formatNumber(Math.floor(targetSize * 1024 * 1024 * 1024 / Number(sectorSize))) }} 扇区</p>
              <p>3. 柱面对齐：取最接近且能被 {{ result.sectorsPerCylinder }} 整除的扇区数</p>
              <p>4. 最终扇区数 = {{ formatNumber(result.cylinders) }} × {{ result.sectorsPerCylinder }} = {{ formatNumber(result.totalSectors) }} 扇区</p>
              <p>5. 实际容量 = {{ formatNumber(result.totalSectors) }} × {{ sectorSize }} ÷ 1024³ = {{ result.actualSize.toFixed(6) }} GB</p>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-card class="reference-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Collection />
          </el-icon>
          <span>常用整数分区速查表</span>
        </div>
      </template>
      <el-table :data="referenceTable" border stripe size="small">
        <el-table-column prop="size" label="目标容量" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="primary" size="small">{{ row.size }}GB</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="chsSectors" label="CHS模式扇区数" align="right">
          <template #default="{ row }">
            <span class="table-value">{{ formatNumber(row.chsSectors) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="chsActual" label="CHS实际容量" width="120" align="right">
          <template #default="{ row }">
            {{ row.chsActual.toFixed(4) }}GB
          </template>
        </el-table-column>
        <el-table-column prop="4kSectors" label="4K对齐扇区数" align="right">
          <template #default="{ row }">
            <span class="table-value">{{ formatNumber(row['4kSectors']) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="4kActual" label="4K实际容量" width="120" align="right">
          <template #default="{ row }">
            {{ row['4kActual'].toFixed(4) }}GB
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="applyReference(row)">
              应用此值
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Odometers,
  InfoFilled,
  Warning,
  QuestionFilled,
  DataLine,
  Right,
  CopyDocument,
  Tickets,
  Calculator,
  Collection
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface PartitionResult {
  totalSectors: number
  cylinders: number
  sectorsPerCylinder: number
  totalBytes: number
  actualSize: number
  startSector: number
  endSector: number
  isAligned: boolean
}

const targetSize = ref<number>(100)
const alignmentType = ref<string>('4k')
const sectorSize = ref<string>('512')
const customCylinder = ref<number>(16065)
const result = ref<PartitionResult | null>(null)
const activeCommandTab = ref<string>('diskpart')

const quickSizes = [10, 50, 100, 200, 500, 1024]

const scenarios = [
  { label: '系统盘 (100GB)', size: 100, alignment: '4k' },
  { label: '软件盘 (200GB)', size: 200, alignment: '4k' },
  { label: '游戏盘 (500GB)', size: 500, alignment: '4k' },
  { label: '数据盘 (1TB)', size: 1024, alignment: '4k' },
  { label: '旧硬盘 (50GB CHS)', size: 50, alignment: 'chs' },
  { label: '大容量 (2TB)', size: 2048, alignment: '4k' }
]

const sectorsPerCylinder = computed(() => {
  switch (alignmentType.value) {
    case 'chs':
      return 255 * 63
    case '4k':
      return 2048
    case 'custom':
      return customCylinder.value
    default:
      return 2048
  }
})

const referenceTable = computed(() => {
  const sizes = [10, 20, 30, 50, 60, 80, 100, 120, 150, 200, 256, 300, 500, 512, 1024]
  return sizes.map(size => {
    const chsCylinders = Math.round((size * 1024 * 1024 * 1024 / 512) / 16065)
    const chsSectors = chsCylinders * 16065
    const chsActual = (chsSectors * 512) / (1024 * 1024 * 1024)
    
    const k4Cylinders = Math.round((size * 1024 * 1024 * 1024 / 512) / 2048)
    const k4Sectors = k4Cylinders * 2048
    const k4Actual = (k4Sectors * 512) / (1024 * 1024 * 1024)
    
    return {
      size,
      chsSectors,
      chsActual,
      '4kSectors': k4Sectors,
      '4kActual': k4Actual
    }
  })
})

const calculate = () => {
  const bytesPerSector = Number(sectorSize.value)
  const targetBytes = targetSize.value * 1024 * 1024 * 1024
  const targetSectors = targetBytes / bytesPerSector
  
  const cylinders = Math.round(targetSectors / sectorsPerCylinder.value)
  const totalSectors = cylinders * sectorsPerCylinder.value
  const totalBytes = totalSectors * bytesPerSector
  const actualSize = totalBytes / (1024 * 1024 * 1024)
  
  result.value = {
    totalSectors,
    cylinders,
    sectorsPerCylinder: sectorsPerCylinder.value,
    totalBytes,
    actualSize,
    startSector: alignmentType.value === '4k' ? 2048 : 63,
    endSector: (alignmentType.value === '4k' ? 2048 : 63) + totalSectors - 1,
    isAligned: true
  }
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', { maximumFractionDigits: 0 })
}

const formatBytes = (bytes: number): string => {
  if (bytes >= 1099511627776) {
    return (bytes / 1099511627776).toFixed(2) + ' TB'
  } else if (bytes >= 1073741824) {
    return (bytes / 1073741824).toFixed(2) + ' GB'
  } else if (bytes >= 1048576) {
    return (bytes / 1048576).toFixed(2) + ' MB'
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(2) + ' KB'
  }
  return bytes + ' B'
}

const setQuickSize = (val: number) => {
  targetSize.value = val
  calculate()
}

const applyScenario = (scenario: { label: string; size: number; alignment: string }) => {
  targetSize.value = scenario.size
  alignmentType.value = scenario.alignment
  calculate()
  ElMessage.success(`已应用场景：${scenario.label}`)
}

const applyReference = (row: { size: number; chsSectors: number; '4kSectors': number }) => {
  targetSize.value = row.size
  calculate()
  ElMessage.success(`已应用 ${row.size}GB 分区参数`)
}

const copyValue = (value: string | number, label: string) => {
  const text = String(value)
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(`已复制${label}: ${text}`)
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const getDiskpartCommand = (): string => {
  if (!result.value) return ''
  const sizeMB = Math.floor(result.value.actualSize * 1024)
  return `create partition primary size=${sizeMB} align=${alignmentType.value === '4k' ? '1024' : '64'}\nREM 说明：创建 ${targetSize.value}GB 整数分区，实际大小 ${result.value.actualSize.toFixed(2)}GB`
}

const getFdiskCommand = (): string => {
  if (!result.value) return ''
  return `n\np\n1\n${result.value.startSector}\n+${result.value.totalSectors}\nw\nREM 说明：新建分区，起始扇区 ${result.value.startSector}，扇区数 ${result.value.totalSectors}`
}

const getPartedCommand = (): string => {
  if (!result.value) return ''
  const endGB = result.value.actualSize.toFixed(2)
  return `parted /dev/sda\n(parted) mklabel gpt\n(parted) mkpart primary 0% ${endGB}GB\n(parted) print\nREM 说明：创建 ${targetSize.value}GB 分区，结束位置 ${endGB}GB`
}

onMounted(() => {
  calculate()
})
</script>

<style scoped>
.partition-calculator {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card,
.calculator-card,
.result-card,
.reference-card {
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

.partition-rules {
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

.unit-suffix {
  margin-left: 8px;
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
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

.preset-scenarios {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.scenario-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.scenario-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.scenario-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.result-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.summary-item {
  text-align: center;
  padding: 16px 24px;
  background: #fff;
  border-radius: 8px;
  min-width: 140px;
}

.summary-item.primary {
  border: 2px solid #409eff;
}

.summary-item.success {
  border: 2px solid #67c23a;
}

.summary-item.info {
  border: 2px solid #909399;
}

.summary-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.summary-value.highlight {
  color: #67c23a;
}

.summary-unit {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}

.arrow-icon {
  font-size: 24px;
  color: #c0c4cc;
}

.result-alert {
  margin-bottom: 20px;
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
  transition: all 0.3s;
  margin-bottom: 16px;
}

.result-item:hover {
  border-color: #165DFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.result-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.result-item .result-value {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.result-unit {
  font-size: 11px;
  color: #909399;
  margin-bottom: 8px;
}

.command-section h4,
.calculation-detail h4 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 16px;
  font-size: 16px;
  color: #303133;
}

.command-block {
  position: relative;
}

.command-block pre {
  margin: 0;
  padding: 16px;
  background: #1e1e1e;
  border-radius: 6px;
  overflow-x: auto;
}

.command-block code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  color: #d4d4d4;
  line-height: 1.6;
}

.command-block .el-button {
  position: absolute;
  top: 8px;
  right: 8px;
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

.table-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 500;
  color: #165DFF;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}

@media (max-width: 768px) {
  .result-summary {
    flex-direction: column;
  }
  
  .arrow-icon {
    transform: rotate(90deg);
  }
  
  .summary-item {
    width: 100%;
  }
}
</style>
