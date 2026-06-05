<template>
  <div class="character-splitter">
    <el-card class="intro-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Reading />
          </el-icon>
          <span>中文拆字查询</span>
          <el-tag size="small" type="success">汉字结构分析工具</el-tag>
        </div>
      </template>
      <el-steps :active="0" finish-status="wait" simple class="guide-steps">
        <el-step title="输入汉字" description="在搜索框输入要查询的汉字" />
        <el-step title="查看拆分" description="了解汉字的结构和部件组成" />
        <el-step title="深入学习" description="掌握汉字构成逻辑和造字原理" />
      </el-steps>
    </el-card>

    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Search />
          </el-icon>
          <span>汉字查询</span>
        </div>
      </template>

      <div class="search-section">
        <el-input
          v-model="searchChar"
          placeholder="请输入要查询的汉字（如：好、明、林）"
          size="large"
          maxlength="1"
          class="search-input"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <div class="quick-char-list">
          <span class="quick-label">
            <el-icon size="14" color="#165DFF"><Tips /></el-icon>
            点击下方汉字，查看不同的拆字结果：
          </span>
          <div class="char-buttons">
            <el-button
              v-for="char in quickChars"
              :key="char"
              size="small"
              @click="selectChar(char)"
              :type="searchChar === char ? 'primary' : 'default'"
            >
              {{ char }}
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="result" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Document />
          </el-icon>
          <span>「{{ result.char }}」字解析</span>
        </div>
      </template>

      <div class="char-display-section">
        <div class="char-big">
          {{ result.char }}
        </div>
        <div class="char-basic-info">
          <div class="info-row">
            <span class="info-label">拼音：</span>
            <el-tag
              v-for="py in result.pinyin"
              :key="py"
              size="small"
              type="primary"
              effect="plain"
            >
              {{ py }}
            </el-tag>
          </div>
          <div class="info-row">
            <span class="info-label">释义：</span>
            <span class="info-value">{{ result.meaning }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">笔画：</span>
            <el-tag size="small" type="success">{{ result.strokeCount }} 画</el-tag>
          </div>
          <div class="info-row">
            <span class="info-label">部首：</span>
            <el-tag size="small" type="warning">{{ result.radical }}（{{ result.radicalStrokeCount }}画）</el-tag>
          </div>
          <div class="info-row">
            <span class="info-label">结构：</span>
            <el-tag size="small" type="info">{{ result.structure }}</el-tag>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="decomposition-section">
        <div class="section-title">
          <el-icon :size="18" color="#165DFF"><Share /></el-icon>
          <span>拆分结构</span>
        </div>

        <div class="decomposition-tree">
          <div
            v-for="level in result.decompositionTree"
            :key="level.level"
            class="tree-level"
          >
            <div class="level-label">第{{ level.level }}层</div>
            <div class="level-parts">
              <span
                v-for="(part, idx) in level.parts"
                :key="idx"
                class="part-box"
                :class="{ 'is-radical': isRadical(part) }"
              >
                {{ part }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="components-section">
        <div class="section-title">
          <el-icon :size="18" color="#165DFF"><Grid /></el-icon>
          <span>部件详解</span>
        </div>

        <el-row :gutter="16">
          <el-col
            v-for="(comp, idx) in result.components"
            :key="idx"
            :xs="24"
            :sm="12"
            :md="result.components.length > 2 ? 8 : 12"
          >
            <div class="component-card">
              <div class="component-char">
                {{ comp.name }}
              </div>
              <div class="component-info">
                <el-tag v-if="comp.radical" size="small" type="warning">部首</el-tag>
                <el-tag v-if="comp.strokeCount" size="small" type="info">
                  {{ comp.strokeCount }}画
                </el-tag>
              </div>
              <div class="component-meaning" v-if="comp.meaning">
                {{ comp.meaning }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-divider />

      <div class="order-section">
        <div class="section-title">
          <el-icon :size="18" color="#165DFF"><Sort /></el-icon>
          <span>书写顺序（部件）</span>
        </div>
        <div class="order-flow">
          <div
            v-for="(part, idx) in result.order"
            :key="idx"
            class="order-item"
          >
            <span class="order-number">{{ idx + 1 }}</span>
            <span class="order-char">{{ part }}</span>
            <el-icon v-if="idx < result.order.length - 1" class="order-arrow">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>

      <el-divider v-if="result.words && result.words.length > 0" />

      <div v-if="result.words && result.words.length > 0" class="words-section">
        <div class="section-title">
          <el-icon :size="18" color="#165DFF"><Collection /></el-icon>
          <span>相关词语</span>
        </div>
        <div class="words-list">
          <el-tag
            v-for="word in result.words"
            :key="word"
            size="large"
            type="primary"
            effect="plain"
            class="word-tag"
          >
            {{ word }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <el-card v-else-if="searchChar && !result" class="no-result-card">
      <el-empty description="暂无该汉字的拆分数据">
        <template #image>
          <el-icon :size="80" color="#c0c4cc">
            <QuestionFilled />
          </el-icon>
        </template>
        <p>暂未收录「{{ searchChar }}」字的拆分信息</p>
        <p class="hint">请尝试其他常用汉字，或点击下方常用字进行查询</p>
      </el-empty>
    </el-card>

    <el-card class="knowledge-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Notebook />
          </el-icon>
          <span>汉字结构知识</span>
        </div>
      </template>

      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :md="8" v-for="type in structureTypes" :key="type.name">
          <div class="structure-type-card">
            <div class="type-icon" :style="{ background: type.color }">
              <el-icon :size="24">{{ type.icon }}</el-icon>
            </div>
            <div class="type-name">{{ type.name }}</div>
            <div class="type-desc">{{ type.description }}</div>
            <div class="type-examples">
              <span class="example-label">例字：</span>
              <span class="example-chars">{{ type.examples }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="database-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataBase />
          </el-icon>
          <span>字库浏览（{{ totalChars }}字）</span>
        </div>
      </template>

      <div class="browse-section">
        <div class="filter-bar">
          <span class="filter-label">按部首筛选：</span>
          <el-select v-model="selectedRadical" placeholder="全部部首" size="small" clearable>
            <el-option
              v-for="rad in radicalList"
              :key="rad"
              :label="rad"
              :value="rad"
            />
          </el-select>
        </div>
        <div class="char-grid">
          <div
            v-for="char in filteredChars"
            :key="char.char"
            class="char-item"
            @click="selectChar(char.char)"
          >
            <span class="char-text">{{ char.char }}</span>
            <span class="char-pinyin">{{ char.pinyin[0] }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Reading,
  Search,
  Document,
  Share,
  Grid,
  Sort,
  Collection,
  Notebook,
  DataBase,
  ArrowRight,
  QuestionFilled,
  Picture,
  CircleCheck,
  SetUp,
  Monitor,
  MagicStick,
  TrendCharts,
  Tips
} from '@element-plus/icons-vue'
import { characterDatabase, type CharacterDecomposition } from '@/data/characterDecomposition'

const searchChar = ref('好')
const selectedRadical = ref('')

const quickChars = ['好', '明', '林', '森', '休', '想', '国', '家', '安', '学', '请', '清', '情', '晴', '晶', '品']

const structureTypes = [
  {
    name: '左右结构',
    icon: 'Picture',
    color: 'linear-gradient(135deg, #409eff, #165DFF)',
    description: '由左右两部分组成的汉字',
    examples: '好、明、林、休、打'
  },
  {
    name: '上下结构',
    icon: 'CircleCheck',
    color: 'linear-gradient(135deg, #67c23a, #529e2e)',
    description: '由上下两部分组成的汉字',
    examples: '字、家、安、学、花'
  },
  {
    name: '品字结构',
    icon: 'SetUp',
    color: 'linear-gradient(135deg, #e6a23c, #cf9236)',
    description: '三个相同部件呈三角形排列',
    examples: '品、晶、森、鑫、磊'
  },
  {
    name: '全包围结构',
    icon: 'Monitor',
    color: 'linear-gradient(135deg, #f56c6c, #e53e3e)',
    description: '外部有围框，内部有部件',
    examples: '国、围、园、图、圈'
  },
  {
    name: '半包围结构',
    icon: 'MagicStick',
    color: 'linear-gradient(135deg, #909399, #73767a)',
    description: '部分包围内部部件',
    examples: '间、问、闻、闪、闷'
  },
  {
    name: '独体结构',
    icon: 'TrendCharts',
    color: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    description: '由基本笔画组成，不可拆分',
    examples: '人、口、日、月、山'
  }
]

const result = computed<CharacterDecomposition | null>(() => {
  if (!searchChar.value) return null
  return characterDatabase[searchChar.value] || null
})

const totalChars = computed(() => Object.keys(characterDatabase).length)

const radicalList = computed(() => {
  const radicals = new Set<string>()
  Object.values(characterDatabase).forEach(char => {
    radicals.add(char.radical)
  })
  return Array.from(radicals).sort()
})

const filteredChars = computed(() => {
  let chars = Object.values(characterDatabase)
  if (selectedRadical.value) {
    chars = chars.filter(c => c.radical === selectedRadical.value)
  }
  return chars
})

const handleSearch = () => {
  const char = searchChar.value.trim()
  if (!char) return
  const chinesePattern = /[\u4e00-\u9fff]/
  if (!chinesePattern.test(char)) {
    searchChar.value = ''
  }
}

const selectChar = (char: string) => {
  searchChar.value = char
}

const isRadical = (part: string): boolean => {
  const radicalChars = ['氵', '亻', '扌', '艹', '宀', '讠', '忄', '纟', '囗', '门', '女', '子', '日', '月', '木', '火', '土', '金', '水', '山', '石', '田', '目', '口', '耳', '手', '足', '心', '禾', '王', '马', '牛', '羊', '虫']
  return radicalChars.includes(part)
}
</script>

<style scoped>
.character-splitter {
  max-width: 1000px;
  margin: 0 auto;
}

.intro-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.search-card {
  margin-bottom: 24px;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-input {
  max-width: 500px;
  margin: 0 auto;
}

.quick-char-list {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.quick-label {
  font-size: 14px;
  color: #165DFF;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #c6e2ff;
}

.char-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.result-card {
  margin-bottom: 24px;
}

.char-display-section {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.char-big {
  font-size: 120px;
  font-weight: bold;
  color: #165DFF;
  line-height: 1;
  font-family: 'STKaiti', 'KaiTi', 'SimSun', serif;
  text-shadow: 2px 2px 8px rgba(22, 93, 255, 0.1);
  min-width: 160px;
  text-align: center;
}

.char-basic-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.info-label {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  min-width: 60px;
}

.info-value {
  font-size: 14px;
  color: #303133;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.decomposition-section {
  margin-bottom: 10px;
}

.decomposition-tree {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tree-level {
  display: flex;
  align-items: center;
  gap: 20px;
}

.level-label {
  font-size: 13px;
  color: #909399;
  min-width: 60px;
  font-weight: 500;
}

.level-parts {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.part-box {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border: 2px solid #93c5fd;
  border-radius: 12px;
  color: #165DFF;
  font-family: 'STKaiti', 'KaiTi', serif;
  transition: all 0.3s;
}

.part-box:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.2);
}

.part-box.is-radical {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
  color: #d97706;
}

.components-section {
  margin-bottom: 10px;
}

.component-card {
  padding: 20px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.component-card:hover {
  border-color: #165DFF;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
  transform: translateY(-2px);
}

.component-char {
  font-size: 48px;
  font-weight: bold;
  color: #165DFF;
  font-family: 'STKaiti', 'KaiTi', serif;
  margin-bottom: 8px;
}

.component-info {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}

.component-meaning {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.order-section {
  margin-bottom: 10px;
}

.order-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #165DFF;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
}

.order-char {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
  font-family: 'STKaiti', 'KaiTi', serif;
  min-width: 50px;
  text-align: center;
}

.order-arrow {
  color: #165DFF;
  font-size: 20px;
}

.words-section {
  margin-bottom: 10px;
}

.words-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.word-tag {
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
}

.no-result-card {
  margin-bottom: 24px;
  text-align: center;
}

.no-result-card p {
  margin: 10px 0;
  color: #606266;
}

.no-result-card .hint {
  color: #909399;
  font-size: 13px;
}

.knowledge-card {
  margin-bottom: 24px;
}

.structure-type-card {
  padding: 20px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  margin-bottom: 16px;
  text-align: center;
  transition: all 0.3s;
}

.structure-type-card:hover {
  border-color: #165DFF;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
  transform: translateY(-2px);
}

.type-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
}

.type-name {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.type-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
  line-height: 1.5;
}

.type-examples {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 8px;
}

.example-label {
  font-size: 12px;
  color: #909399;
}

.example-chars {
  font-size: 16px;
  font-weight: 600;
  color: #165DFF;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.database-card {
  margin-bottom: 24px;
}

.browse-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.char-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.char-item {
  padding: 12px 8px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.char-item:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.1);
  transform: translateY(-2px);
}

.char-text {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  font-family: 'STKaiti', 'KaiTi', serif;
  margin-bottom: 4px;
}

.char-pinyin {
  font-size: 11px;
  color: #909399;
}

@media (max-width: 768px) {
  .char-display-section {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .char-big {
    font-size: 80px;
  }

  .tree-level {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .order-flow {
    padding: 12px;
  }

  .order-char {
    font-size: 28px;
    min-width: 40px;
  }
}
</style>
