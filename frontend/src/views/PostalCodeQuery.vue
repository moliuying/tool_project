<template>
  <div class="postal-code-query">
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
        <el-step title="输入查询" description="输入省份、城市、区县名称或邮政编码" />
        <el-step title="筛选地区" description="按省份、城市逐级缩小搜索范围" />
        <el-step title="获取邮编" description="查看匹配的邮政编码信息" />
        <el-step title="一键复制" description="快速复制邮编用于填写地址" />
      </el-steps>
      <el-divider />
      <el-alert type="info" :closable="false">
        <template #title>
          <div class="alert-content">
            <p><strong>查询能力说明：</strong>支持通过省份、城市、区县名称以及已知邮政编码进行双向查询，快速定位目标地区邮编</p>
            <p class="example-tips">💡 试试搜索：「北京」「海淀区」「100080」「广东」「深圳」或直接输入邮编</p>
          </div>
        </template>
      </el-alert>
    </el-card>

    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Search />
          </el-icon>
          <span>邮政编码查询</span>
          <el-tag size="small" type="success">收录 {{ totalCodes }} 条邮编数据</el-tag>
        </div>
      </template>

      <div class="search-section">
        <div class="search-input-wrapper">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入：区县名（如朝阳区）、省市名（如深圳）、完整地址（如北京市海淀区）或邮政编码数字（如100080）"
            size="large"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <div class="input-format-guide">
            <div class="guide-title">
              <el-icon :size="14"><InfoFilled /></el-icon>
              <span>支持的输入格式：</span>
            </div>
            <div class="guide-examples">
              <div class="example-item" @click="quickSearch('朝阳区')">
                <el-tag size="small" type="primary" effect="dark">区县名称</el-tag>
                <span class="example-text">朝阳区</span>
                <el-icon class="example-arrow" :size="12"><Right /></el-icon>
              </div>
              <div class="example-item" @click="quickSearch('深圳市')">
                <el-tag size="small" type="warning" effect="dark">城市名称</el-tag>
                <span class="example-text">深圳市</span>
                <el-icon class="example-arrow" :size="12"><Right /></el-icon>
              </div>
              <div class="example-item" @click="quickSearch('北京市海淀区')">
                <el-tag size="small" type="success" effect="dark">完整地址</el-tag>
                <span class="example-text">北京市海淀区</span>
                <el-icon class="example-arrow" :size="12"><Right /></el-icon>
              </div>
              <div class="example-item" @click="quickSearch('100080')">
                <el-tag size="small" type="danger" effect="dark">邮政编码</el-tag>
                <span class="example-text">100080</span>
                <el-icon class="example-arrow" :size="12"><Right /></el-icon>
              </div>
              <div class="example-item" @click="quickSearch('广东')">
                <el-tag size="small" type="info" effect="dark">省份名称</el-tag>
                <span class="example-text">广东省</span>
                <el-icon class="example-arrow" :size="12"><Right /></el-icon>
              </div>
            </div>
            <div class="guide-hint">
              💡 点击上方示例可直接搜索，也可手动输入关键词
            </div>
          </div>

          <div class="search-tips">
            <el-tag
              v-for="tip in searchTips"
              :key="tip.label"
              size="small"
              type="info"
              effect="plain"
              class="tip-tag"
              @click="quickSearch(tip.keyword)"
            >
              <el-icon><component :is="tip.icon" /></el-icon>
              {{ tip.label }}
            </el-tag>
          </div>
        </div>

        <div class="filter-row">
          <div class="category-filter">
            <span class="filter-label">省份筛选：</span>
            <el-tag
              :type="activeProvince === '' ? 'primary' : 'info'"
              :effect="activeProvince === '' ? 'dark' : 'plain'"
              class="category-tag"
              @click="selectProvince('')"
            >
              全部
            </el-tag>
            <el-tag
              v-for="prov in provinces"
              :key="prov"
              :type="activeProvince === prov ? 'primary' : 'info'"
              :effect="activeProvince === prov ? 'dark' : 'plain'"
              class="category-tag"
              @click="selectProvince(prov)"
            >
              {{ prov }}
            </el-tag>
          </div>
        </div>

        <div v-if="activeProvince && citiesInProvince.length > 0" class="filter-row">
          <div class="category-filter">
            <span class="filter-label">城市筛选：</span>
            <el-tag
              :type="activeCity === '' ? 'primary' : 'info'"
              :effect="activeCity === '' ? 'dark' : 'plain'"
              class="category-tag"
              @click="selectCity('')"
            >
              全部
            </el-tag>
            <el-tag
              v-for="city in citiesInProvince"
              :key="city"
              :type="activeCity === city ? 'primary' : 'info'"
              :effect="activeCity === city ? 'dark' : 'plain'"
              class="category-tag"
              @click="selectCity(city)"
            >
              {{ city }}
            </el-tag>
          </div>
        </div>

        <div v-if="hotCities.length > 0" class="hot-cities">
          <span class="hot-label">热门城市：</span>
          <el-tag
            v-for="city in hotCities"
            :key="city"
            size="small"
            type="danger"
            effect="plain"
            class="hot-tag"
            @click="quickSearch(city)"
          >
            <el-icon><LocationFilled /></el-icon>
            {{ city }}
          </el-tag>
        </div>
      </div>

      <el-divider />

      <div class="code-list">
        <div class="list-header">
          <el-icon :size="16" color="#165DFF"><List /></el-icon>
          <span>查询结果</span>
          <el-tag size="small" type="info">共 {{ filteredCodes.length }} 条记录</el-tag>
          <el-tag v-if="searchKeyword.trim()" size="small" type="warning" effect="plain">
            关键词：「{{ searchKeyword }}」
          </el-tag>
          <el-tag v-if="activeProvince" size="small" type="success" effect="plain">
            省份：{{ activeProvince }}
          </el-tag>
          <el-tag v-if="activeCity" size="small" type="primary" effect="plain">
            城市：{{ activeCity }}
          </el-tag>
        </div>

        <el-empty
          v-if="filteredCodes.length === 0"
          description="未找到匹配的邮编信息"
          :image-size="100"
        >
          <template #description>
            <div class="empty-wrapper">
              <p>未找到与「<strong>{{ searchKeyword || activeProvince || activeCity }}</strong>」匹配的邮编信息</p>
              <el-alert type="info" :closable="false" class="search-capability-alert">
                <template #title>
                  <div class="capability-tips">
                    <p>📌 支持的搜索方式：</p>
                    <ul>
                      <li><strong>省份名称</strong>：如 北京市、广东省、浙江省</li>
                      <li><strong>城市名称</strong>：如 上海市、深圳市、杭州市</li>
                      <li><strong>区县名称</strong>：如 海淀区、朝阳区、天河区</li>
                      <li><strong>邮政编码</strong>：如 100080、518000、310000</li>
                      <li><strong>简称/缩写</strong>：如 京、沪、粤、浙</li>
                    </ul>
                  </div>
                </template>
              </el-alert>
            </div>
          </template>
        </el-empty>

        <div v-else class="code-grid">
          <div
            v-for="(item, index) in filteredCodes"
            :key="index"
            class="code-card"
          >
            <div class="code-card-header">
              <span class="postal-code">{{ item.code }}</span>
              <el-button
                size="small"
                type="primary"
                link
                @click="copyToClipboard(item.code, '邮政编码')"
              >
                <el-icon><CopyDocument /></el-icon>
                复制邮编
              </el-button>
            </div>
            <div class="location-info">
              <div class="location-row">
                <el-tag size="small" type="danger" effect="plain">
                  <el-icon><OfficeBuilding /></el-icon>
                  省份
                </el-tag>
                <span class="location-text">{{ item.province }}</span>
                <span v-if="item.provinceShort" class="location-short">({{ item.provinceShort }})</span>
              </div>
              <div class="location-row">
                <el-tag size="small" type="warning" effect="plain">
                  <el-icon><Location /></el-icon>
                  城市
                </el-tag>
                <span class="location-text">{{ item.city }}</span>
                <span v-if="item.cityShort && item.cityShort !== item.provinceShort" class="location-short">({{ item.cityShort }})</span>
              </div>
              <div class="location-row">
                <el-tag size="small" type="primary" effect="plain">
                  <el-icon><MapLocation /></el-icon>
                  区县
                </el-tag>
                <span class="location-text district-text" v-html="highlightKeyword(item.district, searchKeyword)"></span>
              </div>
            </div>
            <div v-if="getMatchReason(item, searchKeyword)" class="match-reason">
              <el-tag size="small" type="success" effect="plain">
                <el-icon><Right /></el-icon>
                {{ getMatchReason(item, searchKeyword) }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  InfoFilled,
  Document,
  Location,
  LocationFilled,
  MapLocation,
  OfficeBuilding,
  CopyDocument,
  Right,
  List,
  Grid
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { postalCodes, type PostalCode } from '@/data/postalCodes'

const searchKeyword = ref('')
const activeProvince = ref('')
const activeCity = ref('')

const totalCodes = computed(() => postalCodes.length)

const searchTips = [
  { label: '示例：朝阳区', icon: MapLocation, keyword: '朝阳区' },
  { label: '示例：深圳市', icon: Location, keyword: '深圳市' },
  { label: '示例：北京市海淀区', icon: LocationFilled, keyword: '北京市海淀区' },
  { label: '示例：100080', icon: Document, keyword: '100080' },
  { label: '示例：广东省', icon: OfficeBuilding, keyword: '广东省' },
  { label: '清空搜索', icon: Grid, keyword: '' }
]

const hotCities = [
  '北京', '上海', '广州', '深圳', '杭州',
  '成都', '重庆', '武汉', '南京', '西安'
]

const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const normalizeKeyword = (kw: string): string => {
  return kw.toLowerCase().trim().replace(/\s+/g, '')
}

const highlightKeyword = (text: string, keyword: string): string => {
  if (!keyword.trim()) return escapeHtml(text)
  const escapedHtml = escapeHtml(text)
  const patterns = [
    keyword.trim(),
    normalizeKeyword(keyword)
  ]
  const uniquePatterns = [...new Set(patterns.filter(p => p.length > 0))]
  let result = escapedHtml
  uniquePatterns.forEach(pat => {
    const regex = new RegExp(`(${pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    result = result.replace(regex, '<span class="highlight">$1</span>')
  })
  return result
}

const provinces = computed(() => {
  const provs = new Set(postalCodes.map(item => item.province))
  return Array.from(provs).sort()
})

const citiesInProvince = computed(() => {
  if (!activeProvince.value) return []
  const cities = new Set(
    postalCodes
      .filter(item => item.province === activeProvince.value)
      .map(item => item.city)
  )
  return Array.from(cities).sort()
})

const getMatchReason = (item: PostalCode, keyword: string): string | null => {
  if (!keyword.trim()) return null
  const kw = normalizeKeyword(keyword)
  const originalKw = keyword.trim()

  if (item.code.includes(originalKw) || originalKw.includes(item.code)) {
    return `匹配邮政编码：${item.code}`
  }

  if (item.district.includes(originalKw) || originalKw.includes(item.district.replace(/区$|县$|市$/, ''))) {
    return `匹配区县名称：${item.district}`
  }

  if (item.city.includes(originalKw) || originalKw.includes(item.city.replace(/市$/, ''))) {
    return `匹配城市名称：${item.city}`
  }

  if (item.province.includes(originalKw) || originalKw.includes(item.province.replace(/省$|市$|自治区$|特别行政区$/, ''))) {
    return `匹配省份名称：${item.province}`
  }

  if (item.provinceShort && (item.provinceShort.includes(kw) || kw.includes(item.provinceShort))) {
    return `匹配省份简称：${item.provinceShort}`
  }

  if (item.cityShort && (item.cityShort.includes(kw) || kw.includes(item.cityShort))) {
    return `匹配城市简称：${item.cityShort}`
  }

  if (item.province.toLowerCase().includes(kw)) {
    return '匹配省份拼音'
  }

  if (item.city.toLowerCase().includes(kw)) {
    return '匹配城市拼音'
  }

  if (item.district.toLowerCase().includes(kw)) {
    return '匹配区县拼音'
  }

  return null
}

const filteredCodes = computed(() => {
  let result = postalCodes

  if (activeProvince.value) {
    result = result.filter(item => item.province === activeProvince.value)
  }

  if (activeCity.value) {
    result = result.filter(item => item.city === activeCity.value)
  }

  if (searchKeyword.value.trim()) {
    const keyword = normalizeKeyword(searchKeyword.value)
    const originalKw = searchKeyword.value.trim()

    result = result.filter(item => {
      const codeMatch = item.code.includes(originalKw) || originalKw.includes(item.code)
      const provinceMatch = item.province.includes(originalKw) ||
        originalKw.includes(item.province.replace(/省$|市$|自治区$|特别行政区$/, '')) ||
        item.province.toLowerCase().includes(keyword)
      const cityMatch = item.city.includes(originalKw) ||
        originalKw.includes(item.city.replace(/市$/, '')) ||
        item.city.toLowerCase().includes(keyword)
      const districtMatch = item.district.includes(originalKw) ||
        originalKw.includes(item.district.replace(/区$|县$|市$/, '')) ||
        item.district.toLowerCase().includes(keyword)
      const provinceShortMatch = item.provinceShort ?
        (item.provinceShort.includes(keyword) || keyword.includes(item.provinceShort)) : false
      const cityShortMatch = item.cityShort ?
        (item.cityShort.includes(keyword) || keyword.includes(item.cityShort)) : false

      return codeMatch || provinceMatch || cityMatch || districtMatch || provinceShortMatch || cityShortMatch
    })
  }

  return result
})

const handleSearch = () => {
}

const selectProvince = (prov: string) => {
  activeProvince.value = prov
  activeCity.value = ''
}

const selectCity = (city: string) => {
  activeCity.value = city
}

const quickSearch = (keyword: string) => {
  searchKeyword.value = keyword
  activeProvince.value = ''
  activeCity.value = ''
}

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(`${label}已复制：${text}`)
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}
</script>

<style scoped>
.postal-code-query {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card,
.search-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  flex-wrap: wrap;
}

.guide-steps {
  padding: 10px 0;
}

.search-section {
  padding: 8px 0;
}

.search-input-wrapper {
  margin-bottom: 16px;
}

.filter-row {
  margin-bottom: 12px;
}

.category-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.category-tag {
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.category-tag:hover {
  transform: translateY(-1px);
}

.hot-cities {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #fff0f0 0%, #fff5f0 100%);
  border-radius: 8px;
}

.hot-label {
  font-size: 14px;
  color: #f56c6c;
  font-weight: 500;
}

.hot-tag {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.hot-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
}

.list-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.code-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.code-card {
  padding: 16px;
  background: #fafafa;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.code-card:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.code-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 2px dashed #e4e7ed;
}

.postal-code {
  font-size: 28px;
  font-weight: 700;
  color: #165DFF;
  letter-spacing: 3px;
  font-family: 'Courier New', monospace;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  padding: 4px 14px;
  border-radius: 6px;
  border-left: 4px solid #165DFF;
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.location-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.location-text {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.district-text {
  color: #165DFF;
  font-size: 15px;
}

.location-short {
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 1px 6px;
  border-radius: 3px;
}

.match-reason {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #e4e7ed;
}

.match-reason .el-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.alert-content p {
  margin: 6px 0;
  font-size: 14px;
  line-height: 1.6;
}

.alert-content .example-tips {
  font-size: 13px;
  color: #606266;
  padding-left: 2px;
}

.search-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.tip-tag {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.tip-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(144, 147, 153, 0.3);
  background: #165DFF;
  border-color: #165DFF;
  color: #fff;
}

.highlight {
  background-color: #fff7e6;
  color: #e6a23c;
  padding: 0 3px;
  border-radius: 3px;
  font-weight: 600;
}

.empty-wrapper {
  text-align: left;
  padding: 0 20px;
}

.empty-wrapper p {
  color: #606266;
  margin: 10px 0;
  line-height: 1.6;
}

.empty-wrapper strong {
  color: #f56c6c;
}

.search-capability-alert {
  margin-top: 12px;
}

.capability-tips p {
  margin: 0 0 8px 0;
  font-weight: 600;
}

.capability-tips ul {
  margin: 0;
  padding-left: 20px;
}

.capability-tips li {
  margin: 4px 0;
  font-size: 13px;
  line-height: 1.6;
  color: #606266;
}

.capability-tips li strong {
  color: #165DFF;
}

.input-format-guide {
  margin-top: 14px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #ecf5ff 100%);
  border: 1px solid #d9ecff;
  border-radius: 8px;
}

.guide-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #165DFF;
  margin-bottom: 10px;
}

.guide-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.example-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.example-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.2);
  border-color: #165DFF;
  background: #f5faff;
}

.example-text {
  font-size: 13px;
  color: #303133;
  font-weight: 500;
}

.example-arrow {
  color: #c0c4cc;
}

.example-item:hover .example-arrow {
  color: #165DFF;
}

.guide-hint {
  font-size: 12px;
  color: #909399;
  padding-top: 8px;
  border-top: 1px dashed #d9ecff;
}

@media (max-width: 768px) {
  .code-grid {
    grid-template-columns: 1fr;
  }

  .postal-code {
    font-size: 22px;
  }

  .guide-examples {
    gap: 8px;
  }

  .example-item {
    padding: 5px 8px;
  }

  .example-text {
    font-size: 12px;
  }
}
</style>
