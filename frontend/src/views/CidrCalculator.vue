<template>
  <div class="cidr-calculator">
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
        <el-step title="输入CIDR地址" description="输入标准CIDR格式，如 192.168.1.0/24" />
        <el-step title="自动计算" description="系统自动解析并计算网段信息" />
        <el-step title="查看结果" description="获取子网掩码、可用IP范围等信息" />
        <el-step title="复制使用" description="一键复制任意结果值" />
      </el-steps>
      <el-divider />
      <div class="format-rules">
        <h4 class="rules-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          输入格式说明
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

    <el-card class="calculator-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Connection />
          </el-icon>
          <span>CIDR 网段计算器</span>
          <el-tag size="small" type="success">网络规划必备工具</el-tag>
        </div>
      </template>

      <div class="input-section">
        <el-form label-width="100px">
          <el-form-item label="CIDR 地址">
            <div class="form-item-with-help">
              <el-tooltip content="输入IP地址和前缀长度，例如 192.168.1.0/24" placement="top">
                <el-icon class="help-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
              <el-input
                v-model="cidrInput"
                placeholder="请输入CIDR，如 192.168.1.0/24、10.0.0.1/8、172.16.0.0/12"
                size="large"
                clearable
                @input="handleInput"
                @keyup.enter="calculateCidr"
              >
                <template #append>
                  <el-button @click="calculateCidr">
                    <el-icon><Refresh /></el-icon>
                    计算
                  </el-button>
                </template>
              </el-input>
            </div>
            <div class="prefix-slider">
              <span class="slider-label">前缀长度：</span>
              <el-slider
                v-model="prefixLength"
                :min="0"
                :max="32"
                :step="1"
                :show-tooltip="true"
                class="control-slider"
                @change="handleSliderChange"
              />
              <span class="slider-value">/ {{ prefixLength }}</span>
            </div>
            <div class="quick-examples">
              <span class="quick-label">常用网段：</span>
              <el-tag
                v-for="ex in quickExamples"
                :key="ex.value"
                size="small"
                class="example-tag"
                @click="applyExample(ex.value)"
              >
                {{ ex.label }}
              </el-tag>
            </div>
          </el-form-item>
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
          <span>计算结果</span>
          <el-tag size="small" type="success">计算完成</el-tag>
        </div>
      </template>

      <div class="visualization-section">
        <div class="range-visualizer">
          <div class="range-bar" :style="{ background: rangeGradient }">
            <div class="range-marker network" :style="{ left: '0%' }">
              <div class="marker-label">网络地址</div>
              <div class="marker-value">{{ result?.networkAddress }}</div>
            </div>
            <div class="range-marker first" :style="{ left: firstPercent }">
              <div class="marker-label">首个可用</div>
              <div class="marker-value">{{ result?.firstUsable }}</div>
            </div>
            <div class="range-marker last" :style="{ left: lastPercent }">
              <div class="marker-label">最后可用</div>
              <div class="marker-value">{{ result?.lastUsable }}</div>
            </div>
            <div class="range-marker broadcast" :style="{ left: '100%' }">
              <div class="marker-label">广播地址</div>
              <div class="marker-value">{{ result?.broadcastAddress }}</div>
            </div>
          </div>
          <div class="range-scale">
            <span>0</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="result-grid">
        <div
          v-for="(item, key) in resultItems"
          :key="key"
          class="result-card-item"
          @click="copyValue(key, item.value)"
        >
          <div class="result-header">
            <span class="result-name">{{ item.label }}</span>
            <el-tooltip content="点击复制" placement="top">
              <el-icon class="copy-icon"><CopyDocument /></el-icon>
            </el-tooltip>
          </div>
          <div class="result-value" :class="{ monospace: item.monospace }">{{ item.value }}</div>
          <div class="result-desc">{{ item.desc }}</div>
        </div>
      </div>

      <el-divider />

      <div class="detail-section">
        <h4 class="detail-title">
          <el-icon :size="18" color="#165DFF"><DataBoard /></el-icon>
          详细信息表
        </h4>
        <el-table :data="detailList" border stripe size="small">
          <el-table-column prop="category" label="类别" width="120" />
          <el-table-column prop="name" label="项目" width="150" />
          <el-table-column prop="value" label="值" min-width="200">
            <template #default="{ row }">
              <span :class="{ monospace: row.monospace }">{{ row.value }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="说明" />
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button size="small" type="primary" link @click="copyValue(row.name, row.value)">
                复制
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-divider />

      <div class="binary-section">
        <h4 class="detail-title">
          <el-icon :size="18" color="#165DFF"><Cpu /></el-icon>
          二进制表示
        </h4>
        <div class="binary-grid">
          <div class="binary-item">
            <span class="binary-label">IP 地址</span>
            <span class="binary-value monospace">{{ result?.ipBinary }}</span>
          </div>
          <div class="binary-item">
            <span class="binary-label">子网掩码</span>
            <span class="binary-value monospace">{{ result?.maskBinary }}</span>
          </div>
          <div class="binary-item">
            <span class="binary-label">网络地址</span>
            <span class="binary-value monospace">{{ result?.networkBinary }}</span>
          </div>
          <div class="binary-item">
            <span class="binary-label">广播地址</span>
            <span class="binary-value monospace">{{ result?.broadcastBinary }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="hasResult" class="scenario-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <MagicStick />
          </el-icon>
          <span>应用场景建议</span>
        </div>
      </template>

      <el-row :gutter="16">
        <el-col :span="8" v-for="scenario in scenarios" :key="scenario.title">
          <div class="scenario-item">
            <div class="scenario-icon" :style="{ color: scenario.color }">
              <el-icon :size="24"><component :is="scenario.icon" /></el-icon>
            </div>
            <div class="scenario-content">
              <h5>{{ scenario.title }}</h5>
              <p>{{ scenario.desc }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Connection,
  DataLine,
  InfoFilled,
  QuestionFilled,
  Warning,
  CopyDocument,
  Refresh,
  MagicStick,
  DataBoard,
  Cpu,
  OfficeBuilding,
  Cloudy,
  Lock,
  Tools
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface CidrResult {
  ipAddress: string
  prefixLength: number
  subnetMask: string
  wildcardMask: string
  networkAddress: string
  broadcastAddress: string
  firstUsable: string
  lastUsable: string
  totalAddresses: number
  usableAddresses: number
  ipClass: string
  ipType: string
  isPrivate: boolean
  ipBinary: string
  maskBinary: string
  networkBinary: string
  broadcastBinary: string
  cidrNotation: string
  addressRange: string
}

const cidrInput = ref('192.168.1.0/24')
const prefixLength = ref(24)
const parseError = ref('')
const result = ref<CidrResult | null>(null)

const inputFormats = [
  { name: '标准CIDR', examples: ['192.168.1.0/24', '10.0.0.0/8'] },
  { name: '带主机位CIDR', examples: ['192.168.1.100/24', '172.16.5.20/12'] },
  { name: '特殊网段', examples: ['0.0.0.0/0', '255.255.255.255/32'] }
]

const quickExamples = [
  { label: '192.168.1.0/24 (家用)', value: '192.168.1.0/24' },
  { label: '10.0.0.0/8 (企业)', value: '10.0.0.0/8' },
  { label: '172.16.0.0/12 (内网)', value: '172.16.0.0/12' },
  { label: '192.168.0.0/16 (内网段)', value: '192.168.0.0/16' },
  { label: '10.0.0.0/24 (小子网)', value: '10.0.0.0/24' },
  { label: '0.0.0.0/0 (所有)', value: '0.0.0.0/0' }
]

const hasResult = computed(() => !!result.value)

const rangeGradient = computed(() => {
  return 'linear-gradient(90deg, #e6f4ff 0%, #165DFF 20%, #165DFF 80%, #e6f4ff 100%)'
})

const firstPercent = computed(() => {
  if (!result.value || result.value.totalAddresses <= 2) return '10%'
  const percent = (1 / result.value.totalAddresses) * 100
  return Math.min(Math.max(percent, 10), 40) + '%'
})

const lastPercent = computed(() => {
  if (!result.value || result.value.totalAddresses <= 2) return '90%'
  const percent = ((result.value.totalAddresses - 2) / result.value.totalAddresses) * 100
  return Math.min(Math.max(percent, 60), 90) + '%'
})

const resultItems = computed(() => {
  if (!result.value) return {}
  return {
    networkAddress: { label: '网络地址', value: result.value.networkAddress, desc: '网段的起始标识地址', monospace: true },
    broadcastAddress: { label: '广播地址', value: result.value.broadcastAddress, desc: '网段内广播消息地址', monospace: true },
    subnetMask: { label: '子网掩码', value: result.value.subnetMask, desc: '用于划分网络位和主机位', monospace: true },
    wildcardMask: { label: '反掩码', value: result.value.wildcardMask, desc: '子网掩码的取反，用于ACL配置', monospace: true },
    firstUsable: { label: '第一个可用IP', value: result.value.firstUsable, desc: '网段内可分配的第一个主机地址', monospace: true },
    lastUsable: { label: '最后一个可用IP', value: result.value.lastUsable, desc: '网段内可分配的最后一个主机地址', monospace: true },
    totalAddresses: { label: 'IP总数', value: result.value.totalAddresses.toLocaleString(), desc: '网段内包含的所有IP地址数量', monospace: false },
    usableAddresses: { label: '可用IP数', value: result.value.usableAddresses.toLocaleString(), desc: '可分配给主机使用的IP数量', monospace: false },
    ipClass: { label: 'IP类别', value: result.value.ipClass, desc: '根据IP地址分类', monospace: false },
    ipType: { label: 'IP类型', value: result.value.ipType, desc: result.value.isPrivate ? '私有IP地址，仅限内网使用' : '公网IP地址，可在互联网路由', monospace: false },
    cidrNotation: { label: 'CIDR表示', value: result.value.cidrNotation, desc: '无类域间路由标准表示法', monospace: true },
    addressRange: { label: '地址范围', value: result.value.addressRange, desc: '网段的完整IP地址范围', monospace: true }
  }
})

const detailList = computed(() => {
  if (!result.value) return []
  const r = result.value
  return [
    { category: '地址信息', name: '原始输入IP', value: r.ipAddress, description: '用户输入的IP地址', monospace: true },
    { category: '地址信息', name: '前缀长度', value: `/${r.prefixLength}`, description: 'CIDR前缀，表示网络位数量', monospace: true },
    { category: '地址信息', name: 'CIDR表示', value: r.cidrNotation, description: '完整的CIDR表示法', monospace: true },
    { category: '地址范围', name: '网络地址', value: r.networkAddress, description: '网络标识，不可分配给主机', monospace: true },
    { category: '地址范围', name: '广播地址', value: r.broadcastAddress, description: '向整个网段广播的地址', monospace: true },
    { category: '地址范围', name: '可分配范围', value: `${r.firstUsable} - ${r.lastUsable}`, description: '可以分配给主机使用的IP范围', monospace: true },
    { category: '掩码信息', name: '子网掩码', value: r.subnetMask, description: '32位网络掩码', monospace: true },
    { category: '掩码信息', name: '反掩码 (Wildcard)', value: r.wildcardMask, description: '用于OSPF、ACL等网络设备配置', monospace: true },
    { category: '数量统计', name: '总IP数', value: r.totalAddresses.toLocaleString(), description: '包含网络地址和广播地址', monospace: false },
    { category: '数量统计', name: '可用主机数', value: r.usableAddresses.toLocaleString(), description: '/31 和 /32 有特殊处理', monospace: false },
    { category: '网络属性', name: 'IP类别', value: r.ipClass, description: getClassDescription(r.ipClass), monospace: false },
    { category: '网络属性', name: '网络类型', value: r.ipType, description: r.isPrivate ? 'RFC 1918 私有地址空间' : '公网可路由地址', monospace: false }
  ]
})

const scenarios = computed(() => [
  {
    title: '企业内网规划',
    desc: '根据部门数量规划子网，合理分配IP资源，避免地址浪费',
    icon: OfficeBuilding,
    color: '#165DFF'
  },
  {
    title: '云VPC配置',
    desc: '设计云上虚拟私有网络，划分子网用于不同业务系统隔离',
    icon: Cloudy,
    color: '#67C23A'
  },
  {
    title: '防火墙规则',
    desc: '编写精确的访问控制列表(ACL)，限定源/目的网段范围',
    icon: Lock,
    color: '#E6A23C'
  },
  {
    title: '运维排障',
    desc: '快速确认两个IP是否在同一网段，定位网络连通性问题',
    icon: Tools,
    color: '#F56C6C'
  }
])

const getClassDescription = (cls: string): string => {
  const map: Record<string, string> = {
    'A': '0.0.0.0 - 127.255.255.255，默认掩码 /8',
    'B': '128.0.0.0 - 191.255.255.255，默认掩码 /16',
    'C': '192.0.0.0 - 223.255.255.255，默认掩码 /24',
    'D': '224.0.0.0 - 239.255.255.255，组播地址',
    'E': '240.0.0.0 - 255.255.255.255，保留地址'
  }
  return map[cls] || '未知'
}

const ipToInt = (ip: string): number => {
  const parts = ip.split('.').map(Number)
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
}

const intToIp = (int: number): string => {
  return [
    (int >>> 24) & 0xFF,
    (int >>> 16) & 0xFF,
    (int >>> 8) & 0xFF,
    int & 0xFF
  ].join('.')
}

const intToBinary = (int: number): string => {
  const parts: string[] = []
  for (let i = 3; i >= 0; i--) {
    const octet = (int >>> (i * 8)) & 0xFF
    parts.push(octet.toString(2).padStart(8, '0'))
  }
  return parts.join('.')
}

const isValidIp = (ip: string): boolean => {
  const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  const match = ip.match(regex)
  if (!match) return false
  return match.slice(1).every(part => {
    const num = parseInt(part)
    return num >= 0 && num <= 255
  })
}

const isPrivateIp = (ip: string): boolean => {
  const ipInt = ipToInt(ip)
  const tenStart = ipToInt('10.0.0.0')
  const tenEnd = ipToInt('10.255.255.255')
  const seventeenStart = ipToInt('172.16.0.0')
  const seventeenEnd = ipToInt('172.31.255.255')
  const nineteenStart = ipToInt('192.168.0.0')
  const nineteenEnd = ipToInt('192.168.255.255')
  const loopbackStart = ipToInt('127.0.0.0')
  const loopbackEnd = ipToInt('127.255.255.255')
  const linkLocalStart = ipToInt('169.254.0.0')
  const linkLocalEnd = ipToInt('169.254.255.255')

  return (ipInt >= tenStart && ipInt <= tenEnd) ||
    (ipInt >= seventeenStart && ipInt <= seventeenEnd) ||
    (ipInt >= nineteenStart && ipInt <= nineteenEnd) ||
    (ipInt >= loopbackStart && ipInt <= loopbackEnd) ||
    (ipInt >= linkLocalStart && ipInt <= linkLocalEnd)
}

const getIpClass = (ip: string): string => {
  const firstOctet = parseInt(ip.split('.')[0])
  if (firstOctet >= 0 && firstOctet <= 127) return 'A'
  if (firstOctet >= 128 && firstOctet <= 191) return 'B'
  if (firstOctet >= 192 && firstOctet <= 223) return 'C'
  if (firstOctet >= 224 && firstOctet <= 239) return 'D'
  return 'E'
}

const parseCidr = (input: string): { ip: string; prefix: number } | null => {
  const trimmed = input.trim()
  const parts = trimmed.split('/')
  
  if (parts.length !== 2) {
    return null
  }

  const ip = parts[0].trim()
  const prefix = parseInt(parts[1].trim())

  if (!isValidIp(ip)) {
    return null
  }

  if (isNaN(prefix) || prefix < 0 || prefix > 32) {
    return null
  }

  return { ip, prefix }
}

const calculateCidrResult = (ip: string, prefix: number): CidrResult => {
  const ipInt = ipToInt(ip)
  const maskInt = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0
  const wildcardInt = (~maskInt) >>> 0
  const networkInt = (ipInt & maskInt) >>> 0
  const broadcastInt = (networkInt | wildcardInt) >>> 0

  let firstUsableInt: number
  let lastUsableInt: number
  let usableAddresses: number

  if (prefix === 32) {
    firstUsableInt = networkInt
    lastUsableInt = networkInt
    usableAddresses = 1
  } else if (prefix === 31) {
    firstUsableInt = networkInt
    lastUsableInt = broadcastInt
    usableAddresses = 2
  } else {
    firstUsableInt = networkInt + 1
    lastUsableInt = broadcastInt - 1
    usableAddresses = Math.max(0, broadcastInt - networkInt - 1)
  }

  const totalAddresses = Math.pow(2, 32 - prefix)
  const isPrivate = isPrivateIp(ip)
  const ipClass = getIpClass(ip)

  return {
    ipAddress: ip,
    prefixLength: prefix,
    subnetMask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    firstUsable: intToIp(firstUsableInt),
    lastUsable: intToIp(lastUsableInt),
    totalAddresses,
    usableAddresses,
    ipClass,
    ipType: isPrivate ? '私有IP' : '公网IP',
    isPrivate,
    ipBinary: intToBinary(ipInt),
    maskBinary: intToBinary(maskInt),
    networkBinary: intToBinary(networkInt),
    broadcastBinary: intToBinary(broadcastInt),
    cidrNotation: `${intToIp(networkInt)}/${prefix}`,
    addressRange: `${intToIp(networkInt)} - ${intToIp(broadcastInt)}`
  }
}

const calculateCidr = () => {
  if (!cidrInput.value.trim()) {
    parseError.value = '请输入CIDR地址'
    result.value = null
    return
  }

  const parsed = parseCidr(cidrInput.value)
  if (!parsed) {
    parseError.value = 'CIDR格式错误，请检查输入，例如：192.168.1.0/24'
    result.value = null
    return
  }

  parseError.value = ''
  prefixLength.value = parsed.prefix
  result.value = calculateCidrResult(parsed.ip, parsed.prefix)
}

const handleInput = () => {
  const parsed = parseCidr(cidrInput.value)
  if (parsed) {
    prefixLength.value = parsed.prefix
    calculateCidr()
  }
}

const handleSliderChange = () => {
  const parsed = parseCidr(cidrInput.value)
  if (parsed) {
    cidrInput.value = `${parsed.ip}/${prefixLength.value}`
    calculateCidr()
  }
}

const applyExample = (value: string) => {
  cidrInput.value = value
  calculateCidr()
}

const copyValue = (name: string, value: string) => {
  navigator.clipboard.writeText(value).then(() => {
    ElMessage.success(`已复制 ${name}: ${value}`)
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

watch(prefixLength, (val) => {
  const parsed = parseCidr(cidrInput.value)
  if (parsed && parsed.prefix !== val) {
    cidrInput.value = `${parsed.ip}/${val}`
    calculateCidr()
  }
})

calculateCidr()
</script>

<style scoped>
.cidr-calculator {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card,
.calculator-card,
.result-card,
.scenario-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
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
  flex: 1;
}

.help-icon {
  color: #909399;
  cursor: help;
  flex-shrink: 0;
}

.prefix-slider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
}

.slider-label {
  font-size: 14px;
  color: #165DFF;
  font-weight: 500;
  min-width: 80px;
}

.control-slider {
  flex: 1;
}

.slider-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  font-weight: bold;
  color: #165DFF;
  min-width: 50px;
  text-align: right;
}

.quick-examples {
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

.example-tag {
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
}

.example-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.error-message {
  margin-top: 16px;
}

.visualization-section {
  margin-bottom: 16px;
  padding: 24px 16px;
}

.range-visualizer {
  position: relative;
  padding: 0 20px 40px;
}

.range-bar {
  height: 12px;
  border-radius: 6px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.range-marker {
  position: absolute;
  top: -8px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.range-marker::before {
  content: '';
  width: 4px;
  height: 28px;
  background: #303133;
  border-radius: 2px;
}

.marker-label {
  font-size: 11px;
  color: #909399;
  margin-top: 4px;
  white-space: nowrap;
}

.marker-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  font-weight: bold;
  color: #303133;
  background: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.range-scale {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding: 0 20px;
  font-size: 11px;
  color: #c0c4cc;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.result-card-item {
  padding: 16px;
  background: #fafafa;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.result-card-item:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.result-name {
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

.result-card-item:hover .copy-icon {
  opacity: 1;
}

.result-value {
  font-size: 16px;
  font-weight: 500;
  color: #165DFF;
  margin-bottom: 4px;
  word-break: break-all;
}

.result-value.monospace {
  font-family: 'Monaco', 'Menlo', monospace;
}

.result-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.detail-section,
.binary-section {
  margin-top: 8px;
}

.detail-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 16px;
  font-size: 16px;
  color: #303133;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}

:deep(.monospace) {
  font-family: 'Monaco', 'Menlo', monospace;
}

.binary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.binary-item {
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.binary-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.binary-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #165DFF;
  word-break: break-all;
  letter-spacing: 0.5px;
}

.scenario-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  transition: all 0.3s;
}

.scenario-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.scenario-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.scenario-content {
  flex: 1;
}

.scenario-content h5 {
  margin: 0 0 6px;
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

.scenario-content p {
  margin: 0;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .result-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .binary-grid {
    grid-template-columns: 1fr;
  }

  .range-visualizer {
    padding: 0 10px 80px;
  }

  .marker-value {
    font-size: 10px;
  }
}
</style>
