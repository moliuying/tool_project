<template>
  <div class="http-headers-checker">
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
        <el-step title="输入网址" description="输入需要查询的目标网址，支持 http/https 协议" />
        <el-step title="选择方法" description="选择合适的 HTTP 请求方法（GET/HEAD/POST 等）" />
        <el-step title="查询头信息" description="系统自动发送请求并获取服务器响应头" />
        <el-step title="分析结果" description="查看 Content-Type、Server、Cache-Control 等关键信息" />
      </el-steps>
      <el-divider />
      <div class="tips-section">
        <h4 class="tips-title">
          <el-icon :size="16" color="#E6A23C"><Warning /></el-icon>
          功能说明
        </h4>
        <ul class="tips-list">
          <li>支持 GET、HEAD、POST、PUT、DELETE、OPTIONS、PATCH 等常用 HTTP 方法</li>
          <li>显示完整的 HTTP 响应头信息，包括 Content-Type、Server、Cache-Control 等</li>
          <li>自动跟踪重定向并显示响应时间和状态码</li>
          <li>适用于前端开发者、运维工程师、SEO 优化人员和安全研究人员</li>
        </ul>
      </div>
    </el-card>

    <el-card class="query-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Connection />
          </el-icon>
          <span>HTTP 头信息查询</span>
          <el-tag size="small" type="success">快速获取服务器响应头</el-tag>
        </div>
      </template>

      <div class="input-section">
        <el-form label-width="100px">
          <el-form-item label="目标网址">
            <div class="url-input-group">
              <el-input
                v-model="urlInput"
                placeholder="请输入网址，如: https://example.com"
                size="large"
                clearable
                @keyup.enter="queryHeaders"
              >
                <template #prepend>
                  <el-select v-model="urlProtocol" size="large" style="width: 100px">
                    <el-option label="https://" value="https://" />
                    <el-option label="http://" value="http://" />
                  </el-select>
                </template>
                <template #append>
                  <el-button type="primary" @click="queryHeaders" :loading="isLoading">
                    <el-icon v-if="!isLoading"><Search /></el-icon>
                    <span>{{ isLoading ? '查询中...' : '查询' }}</span>
                  </el-button>
                </template>
              </el-input>
            </div>
            <div class="example-urls">
              <span class="example-label">示例网址：</span>
              <el-tag
                v-for="url in exampleUrls"
                :key="url"
                size="small"
                class="example-tag"
                @click="selectUrl(url)"
              >
                {{ url }}
              </el-tag>
            </div>
          </el-form-item>
          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="请求方法">
                <el-select v-model="selectedMethod" size="large" style="width: 100%">
                  <el-option
                    v-for="method in httpMethods"
                    :key="method.value"
                    :label="method.label"
                    :value="method.value"
                  >
                    <span style="float: left">{{ method.label }}</span>
                    <span :class="['method-tag', method.color]">{{ method.desc }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="超时时间">
                <el-select v-model="timeoutValue" size="large" style="width: 100%">
                  <el-option label="5 秒" :value="5000" />
                  <el-option label="10 秒" :value="10000" />
                  <el-option label="15 秒" :value="15000" />
                  <el-option label="30 秒" :value="30000" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8">
              <el-form-item label="跟踪重定向">
                <el-switch
                  v-model="followRedirects"
                  size="large"
                  active-text="开启"
                  inactive-text="关闭"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div v-if="errorMessage" class="error-message">
        <el-alert :title="errorMessage" type="error" :closable="false" show-icon />
      </div>
    </el-card>

    <el-card v-if="!hasResult && !isLoading" class="preview-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#909399">
            <View />
          </el-icon>
          <span>结果预览</span>
          <el-tag size="small" type="info">示例数据</el-tag>
          <el-button
            type="primary"
            link
            size="small"
            class="view-demo-btn"
            @click="loadDemoData"
          >
            <el-icon><MagicStick /></el-icon>
            查看完整示例
          </el-button>
        </div>
      </template>

      <div class="preview-content">
        <div class="preview-intro">
          <p>查询后将显示以下 HTTP 响应头信息：</p>
        </div>
        <div class="preview-tabs">
          <div class="preview-tab active">
            <span class="tab-icon"><DataLine /></span>
            <span class="tab-label">概览</span>
            <span class="tab-desc">状态码、响应时间、请求方法等基础信息</span>
          </div>
          <div class="preview-tab">
            <span class="tab-icon"><Setting /></span>
            <span class="tab-label">响应头</span>
            <span class="tab-desc">完整的 HTTP 响应头键值对</span>
          </div>
          <div class="preview-tab">
            <span class="tab-icon"><Guide /></span>
            <span class="tab-label">安全分析</span>
            <span class="tab-desc">安全相关头信息检测与建议</span>
          </div>
          <div class="preview-tab">
            <span class="tab-icon"><Document /></span>
            <span class="tab-label">原始数据</span>
            <span class="tab-desc">原始响应头文本</span>
          </div>
        </div>
        <div class="preview-status">
          <el-tag type="success" size="large" effect="dark">200 OK</el-tag>
          <span class="preview-status-text">请求成功，响应时间 128ms</span>
        </div>
        <div class="preview-grid">
          <div class="preview-item">
            <div class="preview-item-label">Content-Type</div>
            <div class="preview-item-value">text/html; charset=utf-8</div>
          </div>
          <div class="preview-item">
            <div class="preview-item-label">Server</div>
            <div class="preview-item-value">nginx/1.24.0</div>
          </div>
          <div class="preview-item">
            <div class="preview-item-label">Cache-Control</div>
            <div class="preview-item-value">public, max-age=3600</div>
          </div>
          <div class="preview-item">
            <div class="preview-item-label">Date</div>
            <div class="preview-item-value">Mon, 06 Jan 2025 12:00:00 GMT</div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="hasResult" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Document />
          </el-icon>
          <span>查询结果</span>
          <el-tag :type="getStatusTagType()" size="small" effect="dark">
            {{ headersResult.status }} {{ headersResult.statusText }}
          </el-tag>
          <el-tag size="small" type="info">{{ headersResult.responseTime }}ms</el-tag>
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
        <el-tab-pane label="概览" name="overview">
          <div class="overview-section">
            <div class="status-bar" :class="getStatusClass()">
              <div class="status-info">
                <div class="status-code">
                  <el-tag :type="getStatusTagType()" size="large" effect="dark">
                    {{ headersResult.status }}
                  </el-tag>
                  <span class="status-text">{{ headersResult.statusText }}</span>
                </div>
                <div class="status-meta">
                  <span class="meta-item">
                    <el-icon><Timer /></el-icon>
                    响应时间：<strong>{{ headersResult.responseTime }}ms</strong>
                  </span>
                  <span class="meta-item">
                    <el-icon><Promotion /></el-icon>
                    请求方法：<strong>{{ headersResult.method }}</strong>
                  </span>
                </div>
              </div>
              <div class="url-info">
                <div class="url-row">
                  <span class="url-label">请求地址：</span>
                  <span class="url-value">{{ headersResult.url }}</span>
                </div>
                <div v-if="headersResult.finalUrl && headersResult.finalUrl !== headersResult.url" class="url-row">
                  <span class="url-label">最终地址：</span>
                  <span class="url-value final">{{ headersResult.finalUrl }}</span>
                </div>
              </div>
            </div>

            <el-divider />

            <div class="quick-info">
              <h4 class="section-title">
                <el-icon :size="16" color="#165DFF"><Star /></el-icon>
                关键信息
              </h4>
              <div class="info-grid">
                <div class="info-item" @click="copyHeaderValue('content-type', 'Content-Type')">
                  <div class="info-label">
                    <el-icon><DocumentCopy /></el-icon>
                    <span>Content-Type</span>
                  </div>
                  <div class="info-value">{{ getHeader('content-type') || '-' }}</div>
                </div>
                <div class="info-item" @click="copyHeaderValue('server', 'Server')">
                  <div class="info-label">
                    <el-icon><Monitor /></el-icon>
                    <span>Server</span>
                  </div>
                  <div class="info-value">{{ getHeader('server') || '-' }}</div>
                </div>
                <div class="info-item" @click="copyHeaderValue('cache-control', 'Cache-Control')">
                  <div class="info-label">
                    <el-icon><Coin /></el-icon>
                    <span>Cache-Control</span>
                  </div>
                  <div class="info-value">{{ getHeader('cache-control') || '-' }}</div>
                </div>
                <div class="info-item" @click="copyHeaderValue('date', 'Date')">
                  <div class="info-label">
                    <el-icon><Clock /></el-icon>
                    <span>Date</span>
                  </div>
                  <div class="info-value">{{ getHeader('date') || '-' }}</div>
                </div>
                <div class="info-item" @click="copyHeaderValue('content-length', 'Content-Length')">
                  <div class="info-label">
                    <el-icon><Files /></el-icon>
                    <span>Content-Length</span>
                  </div>
                  <div class="info-value">{{ getHeader('content-length') || '-' }}</div>
                </div>
                <div class="info-item" @click="copyHeaderValue('content-encoding', 'Content-Encoding')">
                  <div class="info-label">
                    <el-icon><Files /></el-icon>
                    <span>Content-Encoding</span>
                  </div>
                  <div class="info-value">{{ getHeader('content-encoding') || '-' }}</div>
                </div>
              </div>
            </div>

            <el-divider v-if="headersResult.redirects?.length" />

            <div v-if="headersResult.redirects?.length" class="redirects-section">
              <h4 class="section-title">
                <el-icon :size="16" color="#E6A23C"><Right /></el-icon>
                重定向路径
              </h4>
              <div class="redirect-timeline">
                <div
                  v-for="(redirect, idx) in headersResult.redirects"
                  :key="idx"
                  class="redirect-item"
                >
                  <div class="redirect-dot"></div>
                  <div class="redirect-content">
                    <span class="redirect-index">{{ idx + 1 }}</span>
                    <span class="redirect-url">{{ redirect }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="响应头" name="headers">
          <div class="headers-section">
            <div class="headers-toolbar">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索响应头..."
                size="small"
                clearable
                style="width: 240px"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-radio-group v-model="filterCategory" size="small">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="security">安全相关</el-radio-button>
                <el-radio-button label="cache">缓存相关</el-radio-button>
                <el-radio-button label="cors">CORS</el-radio-button>
              </el-radio-group>
            </div>
            <div class="headers-list">
              <div
                v-for="(value, key) in filteredHeaders"
                :key="key"
                class="header-item"
                @click="copyHeaderValue(key, key)"
              >
                <div class="header-key">
                  <el-tag size="small" :type="getHeaderCategoryTag(key)">
                    {{ getHeaderCategory(key) }}
                  </el-tag>
                  <span class="header-name">{{ key }}</span>
                </div>
                <div class="header-value">{{ value }}</div>
                <el-icon class="copy-icon"><CopyDocument /></el-icon>
              </div>
              <el-empty v-if="Object.keys(filteredHeaders).length === 0" description="没有匹配的响应头" />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="安全分析" name="security">
          <div class="security-section">
            <h4 class="section-title">
              <el-icon :size="16" color="#F56C6C"><Lock /></el-icon>
              安全响应头检测
            </h4>
            <div class="security-checks">
              <div
                v-for="check in securityChecks"
                :key="check.name"
                class="security-check-item"
                :class="check.status"
              >
                <div class="check-icon">
                  <el-icon v-if="check.status === 'pass'"><CircleCheckFilled /></el-icon>
                  <el-icon v-else-if="check.status === 'warn'"><WarningFilled /></el-icon>
                  <el-icon v-else><CircleCloseFilled /></el-icon>
                </div>
                <div class="check-content">
                  <div class="check-header">
                    <span class="check-name">{{ check.name }}</span>
                    <el-tag :type="check.status === 'pass' ? 'success' : check.status === 'warn' ? 'warning' : 'danger'" size="small">
                      {{ check.status === 'pass' ? '已配置' : check.status === 'warn' ? '建议配置' : '未配置' }}
                    </el-tag>
                  </div>
                  <div class="check-value" v-if="check.value">
                    当前值：<code>{{ check.value }}</code>
                  </div>
                  <div class="check-desc">{{ check.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="原始数据" name="raw">
          <div class="raw-data-section">
            <div class="raw-toolbar">
              <el-button size="small" @click="copyRawData">
                <el-icon><CopyDocument /></el-icon>
                复制原始数据
              </el-button>
            </div>
            <div class="raw-content-wrapper">
              <pre class="raw-content">{{ rawHeadersText }}</pre>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Connection,
  InfoFilled,
  Warning,
  Search,
  View,
  MagicStick,
  DataLine,
  Setting,
  Guide,
  Document,
  CopyDocument,
  Timer,
  Promotion,
  Star,
  DocumentCopy,
  Monitor,
  Coin,
  Clock,
  Files,
  Right,
  Lock,
  CircleCheckFilled,
  WarningFilled,
  CircleCloseFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { httpHeadersApi, type HttpHeadersResult } from '@/api/httpHeaders'

const urlInput = ref('')
const urlProtocol = ref('https://')
const selectedMethod = ref('GET')
const timeoutValue = ref(15000)
const followRedirects = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')
const headersResult = ref<HttpHeadersResult>({} as HttpHeadersResult)
const activeTab = ref('overview')
const searchKeyword = ref('')
const filterCategory = ref('all')

const httpMethods = [
  { label: 'GET', value: 'GET', desc: '获取资源', color: 'tag-green' },
  { label: 'HEAD', value: 'HEAD', desc: '仅获取头', color: 'tag-blue' },
  { label: 'POST', value: 'POST', desc: '提交数据', color: 'tag-orange' },
  { label: 'PUT', value: 'PUT', desc: '更新资源', color: 'tag-purple' },
  { label: 'DELETE', value: 'DELETE', desc: '删除资源', color: 'tag-red' },
  { label: 'OPTIONS', value: 'OPTIONS', desc: '跨域预检', color: 'tag-cyan' },
  { label: 'PATCH', value: 'PATCH', desc: '部分更新', color: 'tag-pink' }
]

const exampleUrls = [
  'https://www.baidu.com',
  'https://www.github.com',
  'https://www.taobao.com',
  'https://www.bing.com'
]

const demoData: HttpHeadersResult = {
  url: 'https://example.com',
  method: 'GET',
  status: 200,
  statusText: 'OK',
  responseTime: 128,
  finalUrl: 'https://example.com',
  headers: {
    'content-encoding': 'gzip',
    'content-type': 'text/html; charset=UTF-8',
    'date': 'Mon, 06 Jan 2025 12:00:00 GMT',
    'server': 'nginx/1.24.0',
    'cache-control': 'public, max-age=3600',
    'x-frame-options': 'SAMEORIGIN',
    'x-content-type-options': 'nosniff',
    'x-xss-protection': '1; mode=block',
    'strict-transport-security': 'max-age=31536000; includeSubDomains',
    'content-security-policy': "default-src 'self'",
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'geolocation=(), microphone=(), camera=()',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'Content-Type',
    'set-cookie': 'session=abc123; Path=/; HttpOnly; Secure',
    'last-modified': 'Mon, 06 Jan 2025 10:00:00 GMT',
    'etag': '"abc123def456"',
    'vary': 'Accept-Encoding',
    'content-length': '1256',
    'connection': 'keep-alive',
    'keep-alive': 'timeout=5, max=100'
  }
}

const loadDemoData = () => {
  headersResult.value = { ...demoData, headers: { ...demoData.headers } }
  ElMessage.info('已加载示例数据，实际查询结果可能有所不同')
}

const hasResult = computed(() => {
  return headersResult.value && headersResult.value.status && Object.keys(headersResult.value).length > 0
})

const selectUrl = (url: string) => {
  if (url.startsWith('https://')) {
    urlProtocol.value = 'https://'
    urlInput.value = url.slice(8)
  } else if (url.startsWith('http://')) {
    urlProtocol.value = 'http://'
    urlInput.value = url.slice(7)
  } else {
    urlInput.value = url
  }
  queryHeaders()
}

const queryHeaders = async () => {
  const fullUrl = urlInput.value.trim() ? urlProtocol.value + urlInput.value.trim() : ''
  if (!fullUrl || !urlInput.value.trim()) {
    ElMessage.warning('请输入目标网址')
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  headersResult.value = {} as HttpHeadersResult

  try {
    const response = await httpHeadersApi.check({
      url: fullUrl,
      method: selectedMethod.value,
      timeout: timeoutValue.value,
      followRedirects: followRedirects.value
    })
    headersResult.value = response.data
    ElMessage.success('查询成功')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || error.message || '查询失败，请稍后重试'
    ElMessage.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

const getHeader = (name: string): string => {
  const headers = headersResult.value?.headers || {}
  return headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()] || ''
}

const getStatusTagType = () => {
  const status = headersResult.value.status
  if (!status) return 'info'
  if (status >= 200 && status < 300) return 'success'
  if (status >= 300 && status < 400) return 'warning'
  if (status >= 400) return 'danger'
  return 'info'
}

const getStatusClass = () => {
  const status = headersResult.value.status
  if (!status) return 'status-info'
  if (status >= 200 && status < 300) return 'status-success'
  if (status >= 300 && status < 400) return 'status-redirect'
  if (status >= 400 && status < 500) return 'status-client-error'
  if (status >= 500) return 'status-server-error'
  return 'status-info'
}

const filteredHeaders = computed(() => {
  const headers = headersResult.value?.headers || {}
  let result: Record<string, string> = {}

  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase()
    let include = true

    if (filterCategory.value !== 'all') {
      include = false
      if (filterCategory.value === 'security' && isSecurityHeader(lowerKey)) include = true
      if (filterCategory.value === 'cache' && isCacheHeader(lowerKey)) include = true
      if (filterCategory.value === 'cors' && isCorsHeader(lowerKey)) include = true
    }

    if (include && searchKeyword.value.trim()) {
      const keyword = searchKeyword.value.toLowerCase()
      include = lowerKey.includes(keyword) || String(value).toLowerCase().includes(keyword)
    }

    if (include) {
      result[key] = value
    }
  }

  return result
})

const isSecurityHeader = (key: string): boolean => {
  const securityHeaders = [
    'strict-transport-security',
    'x-frame-options',
    'x-content-type-options',
    'x-xss-protection',
    'content-security-policy',
    'referrer-policy',
    'permissions-policy',
    'x-permitted-cross-domain-policies',
    'expect-ct',
    'set-cookie'
  ]
  return securityHeaders.some(h => key.includes(h))
}

const isCacheHeader = (key: string): boolean => {
  const cacheHeaders = [
    'cache-control',
    'expires',
    'last-modified',
    'etag',
    'age',
    'vary',
    'pragma',
    'if-modified-since',
    'if-none-match'
  ]
  return cacheHeaders.some(h => key.includes(h))
}

const isCorsHeader = (key: string): boolean => {
  return key.startsWith('access-control-')
}

const getHeaderCategory = (key: string): string => {
  const lowerKey = key.toLowerCase()
  if (isSecurityHeader(lowerKey)) return '安全'
  if (isCacheHeader(lowerKey)) return '缓存'
  if (isCorsHeader(lowerKey)) return 'CORS'
  if (lowerKey.startsWith('content-')) return '内容'
  if (lowerKey.includes('server') || lowerKey.includes('x-powered')) return '服务器'
  return '通用'
}

const getHeaderCategoryTag = (key: string): string => {
  const category = getHeaderCategory(key)
  switch (category) {
    case '安全': return 'danger'
    case '缓存': return 'success'
    case 'CORS': return 'warning'
    case '内容': return 'primary'
    case '服务器': return 'info'
    default: return 'info'
  }
}

const securityChecks = computed(() => {
  const headers = headersResult.value?.headers || {}
  const getHeaderValue = (name: string) => {
    return headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()] || ''
  }

  return [
    {
      name: 'Strict-Transport-Security (HSTS)',
      value: getHeaderValue('strict-transport-security'),
      status: getHeaderValue('strict-transport-security') ? 'pass' : 'fail',
      description: '强制浏览器使用 HTTPS 连接，防止中间人攻击'
    },
    {
      name: 'X-Frame-Options',
      value: getHeaderValue('x-frame-options'),
      status: getHeaderValue('x-frame-options') ? 'pass' : 'fail',
      description: '防止页面被嵌入 iframe，避免点击劫持攻击'
    },
    {
      name: 'X-Content-Type-Options',
      value: getHeaderValue('x-content-type-options'),
      status: getHeaderValue('x-content-type-options')?.toLowerCase() === 'nosniff' ? 'pass' : 'fail',
      description: '禁止浏览器猜测 MIME 类型，防止 MIME 嗅探攻击'
    },
    {
      name: 'X-XSS-Protection',
      value: getHeaderValue('x-xss-protection'),
      status: getHeaderValue('x-xss-protection') ? 'pass' : 'warn',
      description: '启用浏览器内置的 XSS 过滤器（现代浏览器已逐步弃用）'
    },
    {
      name: 'Content-Security-Policy (CSP)',
      value: getHeaderValue('content-security-policy'),
      status: getHeaderValue('content-security-policy') ? 'pass' : 'fail',
      description: '控制资源加载来源，有效防止 XSS 和数据注入攻击'
    },
    {
      name: 'Referrer-Policy',
      value: getHeaderValue('referrer-policy'),
      status: getHeaderValue('referrer-policy') ? 'pass' : 'warn',
      description: '控制浏览器发送 Referer 信息的策略，保护用户隐私'
    },
    {
      name: 'Permissions-Policy',
      value: getHeaderValue('permissions-policy'),
      status: getHeaderValue('permissions-policy') ? 'pass' : 'warn',
      description: '控制浏览器功能（如摄像头、麦克风、定位等）的使用权限'
    },
    {
      name: 'Set-Cookie (Secure & HttpOnly)',
      value: getHeaderValue('set-cookie'),
      status: checkCookieSecurity(getHeaderValue('set-cookie')),
      description: 'Cookie 应设置 Secure 和 HttpOnly 属性，防止会话劫持'
    }
  ]
})

const checkCookieSecurity = (cookieHeader: string): 'pass' | 'warn' | 'fail' => {
  if (!cookieHeader) return 'warn'
  const lower = cookieHeader.toLowerCase()
  const hasSecure = lower.includes('secure')
  const hasHttpOnly = lower.includes('httponly')
  if (hasSecure && hasHttpOnly) return 'pass'
  if (hasSecure || hasHttpOnly) return 'warn'
  return 'fail'
}

const rawHeadersText = computed(() => {
  if (!headersResult.value?.headers) return ''
  const lines: string[] = []
  lines.push(`HTTP/1.1 ${headersResult.value.status} ${headersResult.value.statusText}`)
  for (const [key, value] of Object.entries(headersResult.value.headers)) {
    lines.push(`${key}: ${value}`)
  }
  return lines.join('\n')
})

const copyHeaderValue = (key: string, displayKey: string) => {
  const value = getHeader(key)
  if (!value) {
    ElMessage.warning('没有可复制的内容')
    return
  }
  navigator.clipboard.writeText(value).then(() => {
    ElMessage.success(`已复制 ${displayKey}: ${value}`)
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const copyAllResult = () => {
  const result = headersResult.value
  const text = `HTTP 头信息查询结果
====================
请求地址: ${result.url}
请求方法: ${result.method}
状态码: ${result.status} ${result.statusText}
响应时间: ${result.responseTime}ms
${result.finalUrl && result.finalUrl !== result.url ? `最终地址: ${result.finalUrl}` : ''}

响应头:
${Object.entries(result.headers || {}).map(([k, v]) => `  ${k}: ${v}`).join('\n')}
`
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制全部查询结果')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const copyRawData = () => {
  navigator.clipboard.writeText(rawHeadersText.value).then(() => {
    ElMessage.success('已复制原始数据')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}
</script>

<style scoped>
.http-headers-checker {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card,
.query-card,
.result-card,
.preview-card {
  margin-bottom: 24px;
}

.preview-card {
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
}

.preview-card :deep(.el-card__body) {
  padding: 20px;
}

.view-demo-btn {
  margin-left: auto;
  font-weight: 500;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-intro {
  padding: 12px 16px;
  background: #ecf5ff;
  border-radius: 8px;
  border-left: 4px solid #165DFF;
}

.preview-intro p {
  margin: 0;
  color: #409eff;
  font-size: 14px;
}

.preview-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.preview-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  background: white;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.preview-tab.active {
  border-color: #165DFF;
  background: #f0f7ff;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.15);
}

.tab-icon {
  font-size: 24px;
  color: #165DFF;
}

.tab-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.tab-desc {
  font-size: 12px;
  color: #909399;
  text-align: center;
  line-height: 1.4;
}

.preview-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.preview-status-text {
  font-size: 14px;
  color: #606266;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.preview-item {
  padding: 14px 16px;
  background: white;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  opacity: 0.9;
}

.preview-item-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
  font-weight: 500;
}

.preview-item-value {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  font-family: 'Monaco', 'Menlo', monospace;
  word-break: break-all;
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

.url-input-group {
  max-width: 700px;
}

.url-input-group :deep(.el-input-group__prepend) {
  padding: 0;
}

.url-input-group :deep(.el-select) {
  width: 100px;
}

.url-input-group :deep(.el-select .el-input__wrapper) {
  box-shadow: none;
  background: transparent;
  padding: 0 12px;
}

.example-urls {
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

.method-tag {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 8px;
  float: right;
}

.tag-green { background: #f0f9eb; color: #67c23a; }
.tag-blue { background: #ecf5ff; color: #409eff; }
.tag-orange { background: #fdf6ec; color: #e6a23c; }
.tag-purple { background: #f9f0ff; color: #9254de; }
.tag-red { background: #fef0f0; color: #f56c6c; }
.tag-cyan { background: #e1f3f8; color: #13c2c2; }
.tag-pink { background: #fff0f6; color: #eb2f96; }

.error-message {
  margin-top: 16px;
}

.overview-section {
  padding: 8px 0;
}

.status-bar {
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 8px;
}

.status-success {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border: 1px solid #67c23a;
}

.status-redirect {
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border: 1px solid #e6a23c;
}

.status-client-error {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border: 1px solid #f56c6c;
}

.status-server-error {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border: 1px solid #f56c6c;
}

.status-info {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border: 1px solid #409eff;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-code {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.status-meta {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}

.meta-item strong {
  color: #303133;
  font-size: 14px;
}

.url-info {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.url-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.url-row:last-child {
  margin-bottom: 0;
}

.url-label {
  font-size: 13px;
  color: #909399;
  flex-shrink: 0;
}

.url-value {
  font-size: 13px;
  color: #303133;
  font-family: 'Monaco', 'Menlo', monospace;
  word-break: break-all;
}

.url-value.final {
  color: #165DFF;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px;
}

.quick-info {
  padding: 8px 0;
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
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  word-break: break-all;
  font-family: 'Monaco', 'Menlo', monospace;
}

.redirects-section {
  padding: 8px 0;
}

.redirect-timeline {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 12px;
}

.redirect-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #fdf6ec;
  border-radius: 8px;
  position: relative;
}

.redirect-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e6a23c;
  margin-top: 6px;
  flex-shrink: 0;
}

.redirect-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.redirect-index {
  width: 24px;
  height: 24px;
  background: #e6a23c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.redirect-url {
  font-size: 13px;
  color: #303133;
  font-family: 'Monaco', 'Menlo', monospace;
  word-break: break-all;
}

.headers-section {
  padding: 8px 0;
}

.headers-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.headers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.header-item:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.header-key {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 260px;
  flex-shrink: 0;
}

.header-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  font-family: 'Monaco', 'Menlo', monospace;
}

.header-value {
  flex: 1;
  font-size: 13px;
  color: #606266;
  font-family: 'Monaco', 'Menlo', monospace;
  word-break: break-all;
}

.copy-icon {
  color: #165DFF;
  opacity: 0;
  transition: opacity 0.3s;
  flex-shrink: 0;
}

.header-item:hover .copy-icon {
  opacity: 1;
}

.security-section {
  padding: 8px 0;
}

.security-checks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.security-check-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  background: #fafafa;
  transition: all 0.3s;
}

.security-check-item.pass {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-color: #67c23a;
}

.security-check-item.warn {
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-color: #e6a23c;
}

.security-check-item.fail {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border-color: #f56c6c;
}

.security-check-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.check-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.security-check-item.pass .check-icon {
  color: #67c23a;
}

.security-check-item.warn .check-icon {
  color: #e6a23c;
}

.security-check-item.fail .check-icon {
  color: #f56c6c;
}

.check-content {
  flex: 1;
}

.check-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.check-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.check-value {
  font-size: 13px;
  color: #606266;
  margin-bottom: 6px;
}

.check-value code {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
}

.check-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.raw-data-section {
  padding: 8px 0;
}

.raw-toolbar {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
}

.raw-content-wrapper {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e1e;
}

.raw-content {
  max-height: 600px;
  overflow-y: auto;
  padding: 20px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #d4d4d4;
  white-space: pre-wrap;
  word-break: break-all;
}

.raw-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.raw-content::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

.raw-content::-webkit-scrollbar-track {
  background: #2d2d2d;
}

:deep(.el-tabs__content) {
  padding-top: 16px;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .header-key {
    min-width: auto;
    flex-direction: column;
    align-items: flex-start;
  }

  .header-item {
    flex-direction: column;
  }

  .status-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
