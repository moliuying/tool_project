<template>
  <div class="domain-whois">
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
        <el-step title="输入域名" description="输入需要查询的域名，支持不带前缀的格式" />
        <el-step title="查询信息" description="系统自动获取域名的 WHOIS 注册信息" />
        <el-step title="查看结果" description="显示注册商、注册时间、DNS服务器等关键数据" />
        <el-step title="复制使用" description="一键复制所需的域名信息" />
      </el-steps>
      <el-divider />
      <div class="tips-section">
        <h4 class="tips-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          功能说明
        </h4>
        <ul class="tips-list">
          <li>支持查询全球主流域名后缀的 WHOIS 信息</li>
          <li>查询结果包含注册商、注册时间、到期时间、DNS服务器等信息</li>
          <li>部分域名注册商可能隐藏持有者联系方式以保护隐私</li>
          <li>适用于域名投资者、网站运营者、安全研究人员和法务人员</li>
        </ul>
      </div>
    </el-card>

    <el-card class="query-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Search />
          </el-icon>
          <span>域名 WHOIS 查询</span>
          <el-tag size="small" type="success">快速获取域名注册信息</el-tag>
        </div>
      </template>

      <div class="input-section">
        <el-form label-width="100px">
          <el-form-item label="域名">
            <div class="domain-input-group">
              <el-input
                v-model="domainInput"
                placeholder="请输入域名，如: example.com"
                size="large"
                clearable
                @keyup.enter="queryWhois"
              >
                <template #append>
                  <el-button type="primary" @click="queryWhois" :loading="isLoading">
                    <el-icon v-if="!isLoading"><Search /></el-icon>
                    <span>{{ isLoading ? '查询中...' : '查询' }}</span>
                  </el-button>
                </template>
              </el-input>
            </div>
            <div class="example-domains">
              <span class="example-label">示例域名：</span>
              <el-tag
                v-for="domain in exampleDomains"
                :key="domain"
                size="small"
                class="example-tag"
                @click="selectDomain(domain)"
              >
                {{ domain }}
              </el-tag>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="errorMessage" class="error-message">
        <el-alert :title="errorMessage" type="error" :closable="false" show-icon />
      </div>
    </el-card>

    <el-card v-if="hasResult" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Document />
          </el-icon>
          <span>查询结果</span>
          <el-tag size="small" type="success">查询成功</el-tag>
          <el-button
            type="primary"
            link
            size="small"
            class="copy-all-btn"
            @click="copyAllResult"
          >
            <el-icon><CopyDocument /></el-icon>
            复制全部
          </el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <div class="info-grid">
            <div class="info-item" @click="copyValue(whoisResult.domainName, '域名')">
              <div class="info-label">
                <el-icon><Link /></el-icon>
                <span>域名</span>
              </div>
              <div class="info-value">{{ whoisResult.domainName || '-' }}</div>
            </div>
            <div class="info-item" @click="copyValue(whoisResult.registrar, '注册商')">
              <div class="info-label">
                <el-icon><OfficeBuilding /></el-icon>
                <span>注册商</span>
              </div>
              <div class="info-value">{{ whoisResult.registrar || '-' }}</div>
            </div>
            <div class="info-item" @click="copyValue(whoisResult.registrationDate, '注册时间')">
              <div class="info-label">
                <el-icon><Calendar /></el-icon>
                <span>注册时间</span>
              </div>
              <div class="info-value">{{ formatDate(whoisResult.registrationDate) }}</div>
            </div>
            <div class="info-item" @click="copyValue(whoisResult.expirationDate, '到期时间')">
              <div class="info-label">
                <el-icon><Clock /></el-icon>
                <span>到期时间</span>
              </div>
              <div class="info-value">
                <el-tag :type="getExpiryTagType()" size="small">
                  {{ formatDate(whoisResult.expirationDate) }}
                </el-tag>
              </div>
            </div>
            <div class="info-item" @click="copyValue(whoisResult.updatedDate, '更新时间')">
              <div class="info-label">
                <el-icon><Refresh /></el-icon>
                <span>更新时间</span>
              </div>
              <div class="info-value">{{ formatDate(whoisResult.updatedDate) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">
                <el-icon><Medal /></el-icon>
                <span>域名状态</span>
              </div>
              <div class="info-value status-tags">
                <el-tag
                  v-for="(status, idx) in whoisResult.status || []"
                  :key="idx"
                  size="small"
                  type="info"
                  class="status-tag"
                >
                  {{ status }}
                </el-tag>
                <span v-if="!whoisResult.status?.length">-</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="DNS 服务器" name="dns">
          <div class="dns-section">
            <div v-if="whoisResult.nameServers?.length" class="dns-list">
              <div
                v-for="(ns, idx) in whoisResult.nameServers"
                :key="idx"
                class="dns-item"
                @click="copyValue(ns, 'DNS服务器')"
              >
                <el-icon><Connection /></el-icon>
                <span class="dns-name">{{ ns }}</span>
                <el-icon class="copy-icon"><CopyDocument /></el-icon>
              </div>
            </div>
            <el-empty v-else description="暂无 DNS 服务器信息" />
          </div>
        </el-tab-pane>

        <el-tab-pane label="注册人信息" name="registrant">
          <div class="info-grid">
            <div class="info-item" @click="copyValue(whoisResult.registrantName, '注册人姓名')">
              <div class="info-label">
                <el-icon><User /></el-icon>
                <span>注册人姓名</span>
              </div>
              <div class="info-value">{{ whoisResult.registrantName || '-' }}</div>
            </div>
            <div class="info-item" @click="copyValue(whoisResult.registrantOrganization, '注册组织')">
              <div class="info-label">
                <el-icon><OfficeBuilding /></el-icon>
                <span>注册组织</span>
              </div>
              <div class="info-value">{{ whoisResult.registrantOrganization || '-' }}</div>
            </div>
            <div class="info-item" @click="copyValue(whoisResult.registrantEmail, '注册邮箱')">
              <div class="info-label">
                <el-icon><Message /></el-icon>
                <span>注册邮箱</span>
              </div>
              <div class="info-value">{{ whoisResult.registrantEmail || '-' }}</div>
            </div>
            <div class="info-item" @click="copyValue(whoisResult.registrantPhone, '注册电话')">
              <div class="info-label">
                <el-icon><Phone /></el-icon>
                <span>注册电话</span>
              </div>
              <div class="info-value">{{ whoisResult.registrantPhone || '-' }}</div>
            </div>
            <div class="info-item" @click="copyValue(whoisResult.registrantCountry, '注册国家')">
              <div class="info-label">
                <el-icon><Location /></el-icon>
                <span>注册国家</span>
              </div>
              <div class="info-value">{{ whoisResult.registrantCountry || '-' }}</div>
            </div>
          </div>
          <el-divider />
          <div class="info-section">
            <h4 class="section-title">管理员信息</h4>
            <div class="info-grid">
              <div class="info-item" @click="copyValue(whoisResult.adminName, '管理员姓名')">
                <div class="info-label">管理员姓名</div>
                <div class="info-value">{{ whoisResult.adminName || '-' }}</div>
              </div>
              <div class="info-item" @click="copyValue(whoisResult.adminOrganization, '管理员组织')">
                <div class="info-label">管理员组织</div>
                <div class="info-value">{{ whoisResult.adminOrganization || '-' }}</div>
              </div>
              <div class="info-item" @click="copyValue(whoisResult.adminEmail, '管理员邮箱')">
                <div class="info-label">管理员邮箱</div>
                <div class="info-value">{{ whoisResult.adminEmail || '-' }}</div>
              </div>
            </div>
          </div>
          <el-divider />
          <div class="info-section">
            <h4 class="section-title">技术联系人信息</h4>
            <div class="info-grid">
              <div class="info-item" @click="copyValue(whoisResult.techName, '技术联系人姓名')">
                <div class="info-label">技术联系人</div>
                <div class="info-value">{{ whoisResult.techName || '-' }}</div>
              </div>
              <div class="info-item" @click="copyValue(whoisResult.techOrganization, '技术联系组织')">
                <div class="info-label">技术联系组织</div>
                <div class="info-value">{{ whoisResult.techOrganization || '-' }}</div>
              </div>
              <div class="info-item" @click="copyValue(whoisResult.techEmail, '技术联系邮箱')">
                <div class="info-label">技术联系邮箱</div>
                <div class="info-value">{{ whoisResult.techEmail || '-' }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="原始数据" name="raw">
          <div class="raw-data-section">
            <el-input
              type="textarea"
              :model-value="whoisResult.rawData"
              :rows="20"
              readonly
              class="raw-textarea"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  InfoFilled,
  Warning,
  Document,
  CopyDocument,
  Link,
  OfficeBuilding,
  Calendar,
  Clock,
  Refresh,
  Medal,
  Connection,
  User,
  Message,
  Phone,
  Location
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { whoisApi, type WhoisResult } from '@/api/whois'

const domainInput = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const whoisResult = ref<WhoisResult>({})
const activeTab = ref('basic')

const exampleDomains = [
  'google.com',
  'github.com',
  'baidu.com',
  'qq.com',
  'taobao.com'
]

const hasResult = computed(() => {
  return Object.keys(whoisResult.value).length > 0 && whoisResult.value.domainName
})

const selectDomain = (domain: string) => {
  domainInput.value = domain
  queryWhois()
}

const queryWhois = async () => {
  if (!domainInput.value.trim()) {
    ElMessage.warning('请输入域名')
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  whoisResult.value = {}

  try {
    const response = await whoisApi.lookup(domainInput.value.trim())
    whoisResult.value = response.data
    ElMessage.success('查询成功')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || error.message || '查询失败，请稍后重试'
    ElMessage.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const getExpiryTagType = () => {
  if (!whoisResult.value.expirationDate) return 'info'
  try {
    const expiryDate = new Date(whoisResult.value.expirationDate)
    const now = new Date()
    const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'danger'
    if (diffDays < 30) return 'warning'
    return 'success'
  } catch {
    return 'info'
  }
}

const copyValue = (value?: string, label?: string) => {
  if (!value) {
    ElMessage.warning('没有可复制的内容')
    return
  }
  navigator.clipboard.writeText(value).then(() => {
    ElMessage.success(`已复制${label || ''}: ${value}`)
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const copyAllResult = () => {
  const result = whoisResult.value
  const text = `域名 WHOIS 查询结果
====================
域名: ${result.domainName || '-'}
注册商: ${result.registrar || '-'}
注册时间: ${formatDate(result.registrationDate)}
到期时间: ${formatDate(result.expirationDate)}
更新时间: ${formatDate(result.updatedDate)}
域名状态: ${(result.status || []).join(', ') || '-'}
DNS服务器:
${(result.nameServers || []).map(ns => '  - ' + ns).join('\n') || '  -'}
注册人姓名: ${result.registrantName || '-'}
注册组织: ${result.registrantOrganization || '-'}
注册邮箱: ${result.registrantEmail || '-'}
注册电话: ${result.registrantPhone || '-'}
注册国家: ${result.registrantCountry || '-'}
`
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制全部查询结果')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}
</script>

<style scoped>
.domain-whois {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card,
.query-card,
.result-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.copy-all-btn {
  margin-left: auto;
}

.guide-steps {
  padding: 10px 0;
}

.tips-section {
  padding: 0 4px;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: #303133;
  margin: 0 0 16px;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  color: #606266;
  line-height: 2;
}

.input-section {
  padding: 16px 0;
}

.domain-input-group {
  max-width: 600px;
}

.example-domains {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.example-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.example-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.example-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.error-message {
  margin-top: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.info-item {
  padding: 16px;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.info-item:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.info-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.info-value {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  word-break: break-all;
}

.status-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.status-tag {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dns-section {
  padding: 16px 0;
}

.dns-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dns-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #b3d8ff;
}

.dns-item:hover {
  background: linear-gradient(135deg, #e6f4ff 0%, #d9ecff 100%);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.2);
}

.dns-name {
  flex: 1;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 15px;
  font-weight: 500;
  color: #165DFF;
}

.copy-icon {
  color: #165DFF;
  opacity: 0;
  transition: opacity 0.3s;
}

.dns-item:hover .copy-icon {
  opacity: 1;
}

.info-section {
  margin-top: 16px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.raw-data-section {
  padding: 16px 0;
}

.raw-textarea {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
}

:deep(.el-tabs__content) {
  padding-top: 16px;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
