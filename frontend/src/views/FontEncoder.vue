<template>
  <div class="font-encoder">
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
        <el-step title="选择输入方式" description="单个字体、多个候选字体或完整字体栈" />
        <el-step title="输入字体名称" description="输入中/英文名称，支持多种分隔方式" />
        <el-step title="获取标准格式" description="一键复制 CSS / Unicode 格式结果" />
      </el-steps>

      <el-row :gutter="16" class="input-modes">
        <el-col :span="8">
          <div class="mode-card">
            <div class="mode-icon primary">
              <el-icon><Edit /></el-icon>
            </div>
            <div class="mode-title">单个字体</div>
            <div class="mode-desc">输入一个字体名，快速获取标准格式</div>
            <div class="mode-example">
              <code>微软雅黑</code>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="mode-card">
            <div class="mode-icon success">
              <el-icon><List /></el-icon>
            </div>
            <div class="mode-title">多个候选</div>
            <div class="mode-desc">按优先级输入多个，自动组成字体栈</div>
            <div class="mode-example">
              <code>微软雅黑, Arial, sans-serif</code>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="mode-card">
            <div class="mode-icon warning">
              <el-icon><MagicStick /></el-icon>
            </div>
            <div class="mode-title">完整字体栈</div>
            <div class="mode-desc">粘贴已有字体栈，重新标准化格式</div>
            <div class="mode-example">
              <code>"PingFang SC", "Microsoft YaHei", sans-serif</code>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="rules-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="18" color="#165DFF">
            <Reading />
          </el-icon>
          <span>输入规则</span>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="12">
          <div class="rule-item">
            <div class="rule-title">分隔方式</div>
            <div class="rule-content">
              <el-tag size="small" type="info">逗号 ,</el-tag>
              <el-tag size="small" type="info">分号 ;</el-tag>
              <el-tag size="small" type="info">换行</el-tag>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="rule-item">
            <div class="rule-title">自动处理</div>
            <div class="rule-content">
              <el-tag size="small" type="success">去除引号</el-tag>
              <el-tag size="small" type="success">去除空格</el-tag>
              <el-tag size="small" type="success">空行过滤</el-tag>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="encoder-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <EditPen />
          </el-icon>
          <span>字体编码转换</span>
          <el-tag size="small" type="info" class="header-tag">支持中英文字体名</el-tag>
        </div>
      </template>

      <div class="quick-preset">
        <span class="preset-label">常用字体：</span>
        <el-button-group>
          <el-button size="small" @click="addPresetFont('chinese')">中文字体</el-button>
          <el-button size="small" @click="addPresetFont('english')">英文字体</el-button>
          <el-button size="small" @click="addPresetFont('stack')">字体栈模板</el-button>
        </el-button-group>
        <el-button size="small" text type="danger" @click="clearInput" style="margin-left: auto;">
          <el-icon><Delete /></el-icon>
          清空
        </el-button>
      </div>

      <div class="input-section">
        <div class="input-header">
          <span class="input-label">输入字体名称</span>
          <div class="input-hint-group">
            <div class="input-hint">
              <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
              <span>每行一个，或用逗号/分号分隔</span>
            </div>
            <div class="input-hint success">
              <el-icon size="12" color="#67c23a"><CircleCheck /></el-icon>
              <span>中文字体自动匹配英文名，无需手动输入</span>
            </div>
          </div>
        </div>
        <el-alert type="success" :closable="false" class="smart-match-alert">
          <template #title>
            <span><strong>智能匹配：</strong>输入「微软雅黑」将自动识别英文名「Microsoft YaHei」，两种格式结果同时生成</span>
          </template>
        </el-alert>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="5"
          placeholder="例如：微软雅黑, 宋体, Arial, Helvetica&#10;或每行输入一个字体名"
          resize="vertical"
          class="font-input"
          @input="handleInput"
        />
      </div>

      <div v-if="parsedFonts.length > 0" class="font-tags-section">
        <div class="section-label-row">
          <div class="section-label">
            <el-icon :size="16" color="#165DFF"><Collection /></el-icon>
            <span>识别到的字体（{{ parsedFonts.length }}个）</span>
          </div>
          <div class="section-actions">
            <el-switch
              v-model="autoAddEnglish"
              active-text="自动追加英文名"
              inactive-text="仅使用中文名"
              size="small"
            />
          </div>
        </div>
        <div class="font-tags">
          <div
            v-for="(font, index) in parsedFonts"
            :key="index"
            class="font-tag-wrapper"
          >
            <el-tag
              closable
              :type="font.hasChinese ? 'primary' : 'success'"
              @close="removeFont(index)"
              class="main-tag"
            >
              {{ font.original }}
              <el-tag v-if="font.englishName" size="small" type="info" effect="plain" class="sub-tag">
                {{ font.englishName }}
              </el-tag>
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="parsedFonts.length > 0" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Document />
          </el-icon>
          <span>转换结果</span>
          <el-tag size="small" type="success">{{ parsedFonts.length }}个字体</el-tag>
        </div>
      </template>

      <div class="result-sections">
        <el-alert v-if="autoAddEnglish" type="success" :closable="false" class="match-hint-alert">
          <template #title>
            <span>
              <el-icon><MagicStick /></el-icon>
              <strong>智能补全已开启：</strong>中文字体已自动追加英文名，兼容性更佳
            </span>
          </template>
        </el-alert>
        <div class="result-section">
          <div class="result-label-row">
            <div class="result-label">
              <el-icon color="#165DFF"><Monitor /></el-icon>
              <span>CSS font-family 标准格式</span>
            </div>
            <el-tag size="small" type="primary">推荐使用</el-tag>
          </div>
          <div class="code-block">
            <code>{{ cssFontFamily }}</code>
            <el-button size="small" text @click="copyToClipboard(cssFontFamily, 'CSS font-family')">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
          <div class="result-hint">
            <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
            <span>多词字体名自动加引号，可直接用于 CSS/SCSS/LESS</span>
          </div>
        </div>

        <div class="result-section">
          <div class="result-label-row">
            <div class="result-label">
              <el-icon color="#67c23a"><Cpu /></el-icon>
              <span>Unicode 转义格式</span>
            </div>
            <el-tag size="small" type="success">兼容旧浏览器</el-tag>
          </div>
          <div class="code-block">
            <code>{{ unicodeFontFamily }}</code>
            <el-button size="small" text @click="copyToClipboard(unicodeFontFamily, 'Unicode转义格式')">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
          <div class="result-hint">
            <el-icon size="12" color="#909399"><InfoFilled /></el-icon>
            <span>中文字体名转为Unicode编码，避免编码问题，兼容性更佳</span>
          </div>
        </div>

        <div class="result-section">
          <div class="result-label-row">
            <div class="result-label">
              <el-icon color="#e6a23c"><SetUp /></el-icon>
              <span>完整 CSS 声明</span>
            </div>
            <el-tag size="small" type="warning">直接使用</el-tag>
          </div>
          <div class="code-block multiline">
            <code><span class="code-key">font-family</span>: {{ cssFontFamily }};</code>
            <el-button size="small" text @click="copyToClipboard(`font-family: ${cssFontFamily};`, 'CSS声明')">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
        </div>

        <div v-if="unicodeFontFamily !== cssFontFamily" class="result-section">
          <div class="result-label-row">
            <div class="result-label">
              <el-icon color="#f56c6c"><Key /></el-icon>
              <span>Unicode 完整 CSS 声明</span>
            </div>
            <el-tag size="small" type="danger">兼容方案</el-tag>
          </div>
          <div class="code-block multiline">
            <code><span class="code-key">font-family</span>: {{ unicodeFontFamily }};</code>
            <el-button size="small" text @click="copyToClipboard(`font-family: ${unicodeFontFamily};`, 'Unicode CSS声明')">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <el-divider>详细编码信息</el-divider>

      <el-table :data="parsedFonts" border stripe style="width: 100%">
        <el-table-column prop="original" label="原始字体名" width="180" />
        <el-table-column label="英文名/别名" width="200">
          <template #default="{ row }">
            <span>{{ row.englishName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="CSS格式" min-width="220">
          <template #default="{ row }">
            <code class="table-code">{{ row.cssName }}</code>
          </template>
        </el-table-column>
        <el-table-column label="Unicode转义" min-width="220">
          <template #default="{ row }">
            <code class="table-code">{{ row.unicodeName || '-' }}</code>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.hasChinese ? 'primary' : 'success'">
              {{ row.hasChinese ? '中文' : '英文' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <el-divider>属性结果展示</el-divider>

      <el-alert type="info" :closable="false" class="attr-hint-alert">
        <template #title>
          <span>
            <el-icon><MagicStick /></el-icon>
            <strong>多格式输出：</strong>属性名与属性值分行展示，点击即可复制，无需手动拆分
          </span>
        </template>
      </el-alert>

      <el-tabs v-model="activeAttrTab" class="attr-tabs">
        <el-tab-pane label="CSS 相关" name="css">
          <div class="attr-grid">
            <div class="attr-item" v-for="format in getFormatsByCategory('css')" :key="format.key">
              <div class="attr-header">
                <div class="attr-title">
                  <el-icon :size="16" :color="getIconColor(format.tagType)"><component :is="format.icon" /></el-icon>
                  <span>{{ format.label }}</span>
                </div>
                <el-tag size="small" :type="format.tagType">{{ format.tag }}</el-tag>
              </div>
              <div class="attr-desc">{{ format.description }}</div>
              <div class="attr-kv">
                <div class="attr-kv-row" @click="copyToClipboard(format.propName, '属性名')">
                  <span class="kv-label">属性名</span>
                  <code class="kv-name">{{ format.propName }}</code>
                  <el-icon class="kv-copy" :size="14"><CopyDocument /></el-icon>
                </div>
                <div class="attr-kv-row" @click="copyToClipboard(format.propValue, '属性值')">
                  <span class="kv-label">属性值</span>
                  <code class="kv-value">{{ format.propValue }}</code>
                  <el-icon class="kv-copy" :size="14"><CopyDocument /></el-icon>
                </div>
              </div>
              <div class="attr-full-row" @click="copyToClipboard(format.fullValue, format.label)">
                <el-icon :size="14"><CopyDocument /></el-icon>
                <span>复制完整声明</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="预处理器" name="preprocessor">
          <div class="attr-grid">
            <div class="attr-item" v-for="format in getFormatsByCategory('preprocessor')" :key="format.key">
              <div class="attr-header">
                <div class="attr-title">
                  <el-icon :size="16" :color="getIconColor(format.tagType)"><component :is="format.icon" /></el-icon>
                  <span>{{ format.label }}</span>
                </div>
                <el-tag size="small" :type="format.tagType">{{ format.tag }}</el-tag>
              </div>
              <div class="attr-desc">{{ format.description }}</div>
              <div class="attr-kv">
                <div class="attr-kv-row" @click="copyToClipboard(format.propName, '属性名')">
                  <span class="kv-label">属性名</span>
                  <code class="kv-name">{{ format.propName }}</code>
                  <el-icon class="kv-copy" :size="14"><CopyDocument /></el-icon>
                </div>
                <div class="attr-kv-row" @click="copyToClipboard(format.propValue, '属性值')">
                  <span class="kv-label">属性值</span>
                  <code class="kv-value">{{ format.propValue }}</code>
                  <el-icon class="kv-copy" :size="14"><CopyDocument /></el-icon>
                </div>
              </div>
              <div class="attr-full-row" @click="copyToClipboard(format.fullValue, format.label)">
                <el-icon :size="14"><CopyDocument /></el-icon>
                <span>复制完整声明</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="JS/框架" name="javascript">
          <div class="attr-grid">
            <div class="attr-item" v-for="format in getFormatsByCategory('javascript')" :key="format.key">
              <div class="attr-header">
                <div class="attr-title">
                  <el-icon :size="16" :color="getIconColor(format.tagType)"><component :is="format.icon" /></el-icon>
                  <span>{{ format.label }}</span>
                </div>
                <el-tag size="small" :type="format.tagType">{{ format.tag }}</el-tag>
              </div>
              <div class="attr-desc">{{ format.description }}</div>
              <div class="attr-kv">
                <div class="attr-kv-row" @click="copyToClipboard(format.propName, '属性名')">
                  <span class="kv-label">属性名</span>
                  <code class="kv-name">{{ format.propName }}</code>
                  <el-icon class="kv-copy" :size="14"><CopyDocument /></el-icon>
                </div>
                <div class="attr-kv-row" @click="copyToClipboard(format.propValue, '属性值')">
                  <span class="kv-label">属性值</span>
                  <code class="kv-value">{{ format.propValue }}</code>
                  <el-icon class="kv-copy" :size="14"><CopyDocument /></el-icon>
                </div>
              </div>
              <div class="attr-full-row" @click="copyToClipboard(format.fullValue, format.label)">
                <el-icon :size="14"><CopyDocument /></el-icon>
                <span>复制完整声明</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="配置文件" name="config">
          <div class="attr-grid">
            <div class="attr-item" v-for="format in getFormatsByCategory('config')" :key="format.key">
              <div class="attr-header">
                <div class="attr-title">
                  <el-icon :size="16" :color="getIconColor(format.tagType)"><component :is="format.icon" /></el-icon>
                  <span>{{ format.label }}</span>
                </div>
                <el-tag size="small" :type="format.tagType">{{ format.tag }}</el-tag>
              </div>
              <div class="attr-desc">{{ format.description }}</div>
              <div class="attr-kv">
                <div class="attr-kv-row" @click="copyToClipboard(format.propName, '属性名')">
                  <span class="kv-label">属性名</span>
                  <code class="kv-name">{{ format.propName }}</code>
                  <el-icon class="kv-copy" :size="14"><CopyDocument /></el-icon>
                </div>
                <div class="attr-kv-row" @click="copyToClipboard(format.propValue, '属性值')">
                  <span class="kv-label">属性值</span>
                  <code class="kv-value">{{ format.propValue }}</code>
                  <el-icon class="kv-copy" :size="14"><CopyDocument /></el-icon>
                </div>
              </div>
              <div class="attr-full-row" @click="copyToClipboard(format.fullValue, format.label)">
                <el-icon :size="14"><CopyDocument /></el-icon>
                <span>复制完整声明</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="全部格式" name="all">
          <div class="attr-grid">
            <div class="attr-item" v-for="format in attributeFormats" :key="format.key">
              <div class="attr-header">
                <div class="attr-title">
                  <el-icon :size="16" :color="getIconColor(format.tagType)"><component :is="format.icon" /></el-icon>
                  <span>{{ format.label }}</span>
                </div>
                <el-tag size="small" :type="format.tagType">{{ format.tag }}</el-tag>
              </div>
              <div class="attr-desc">{{ format.description }}</div>
              <div class="attr-kv">
                <div class="attr-kv-row" @click="copyToClipboard(format.propName, '属性名')">
                  <span class="kv-label">属性名</span>
                  <code class="kv-name">{{ format.propName }}</code>
                  <el-icon class="kv-copy" :size="14"><CopyDocument /></el-icon>
                </div>
                <div class="attr-kv-row" @click="copyToClipboard(format.propValue, '属性值')">
                  <span class="kv-label">属性值</span>
                  <code class="kv-value">{{ format.propValue }}</code>
                  <el-icon class="kv-copy" :size="14"><CopyDocument /></el-icon>
                </div>
              </div>
              <div class="attr-full-row" @click="copyToClipboard(format.fullValue, format.label)">
                <el-icon :size="14"><CopyDocument /></el-icon>
                <span>复制完整声明</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card class="presets-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Collection />
          </el-icon>
          <span>常用字体栈模板</span>
          <el-tag size="small" type="info" class="header-tag">点击即可使用</el-tag>
        </div>
      </template>

      <el-row :gutter="16">
        <el-col :span="12" v-for="stack in fontStacks" :key="stack.name">
          <div class="stack-item" @click="applyStack(stack)">
            <div class="stack-header">
              <div class="stack-title">
                <el-icon :size="18" :color="stack.color"><component :is="stack.icon" /></el-icon>
                <span>{{ stack.name }}</span>
              </div>
              <el-tag size="small" :type="stack.tagType">{{ stack.tag }}</el-tag>
            </div>
            <p class="stack-desc">{{ stack.description }}</p>
            <div class="stack-preview">
              <code>{{ stack.fonts }}</code>
            </div>
            <div class="stack-actions">
              <el-button size="small" text type="primary" @click.stop="copyToClipboard(`font-family: ${stack.fonts};`, stack.name)">
                <el-icon><CopyDocument /></el-icon>
                复制声明
              </el-button>
              <el-button size="small" text type="success" @click.stop="applyStack(stack)">
                <el-icon><Plus /></el-icon>
                应用到输入
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="reference-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Notebook />
          </el-icon>
          <span>字体速查表</span>
          <el-tag size="small" type="warning" class="header-tag">点击字体名添加</el-tag>
        </div>
      </template>

      <el-tabs v-model="activeRefTab">
        <el-tab-pane label="中文字体" name="chinese">
          <div class="ref-grid">
            <div
              v-for="font in chineseFontRef"
              :key="font.name"
              class="ref-item"
              @click="addFont(font.name)"
            >
              <div class="ref-name">{{ font.name }}</div>
              <div class="ref-alias">{{ font.english }}</div>
              <div class="ref-unicode">{{ font.unicode }}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="英文字体" name="english">
          <div class="ref-grid">
            <div
              v-for="font in englishFontRef"
              :key="font.name"
              class="ref-item"
              @click="addFont(font.name)"
            >
              <div class="ref-name">{{ font.name }}</div>
              <div class="ref-alias">{{ font.category }}</div>
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
  InfoFilled,
  EditPen,
  Delete,
  Collection,
  Document,
  CopyDocument,
  Monitor,
  Cpu,
  SetUp,
  Key,
  Plus,
  Notebook,
  Edit,
  List,
  MagicStick,
  Reading,
  CircleCheck,
  ChatDotRound,
  TrendCharts,
  Grid,
  Stamp,
  DataLine,
  Memo,
  Files
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface ParsedFont {
  original: string
  cssName: string
  unicodeName: string
  englishName: string
  hasChinese: boolean
}

const inputText = ref('')
const activeRefTab = ref('chinese')
const autoAddEnglish = ref(true)

const chineseFontMap: Record<string, { english: string; unicode: string }> = {
  '宋体': { english: 'SimSun', unicode: '\\5B8B\\4F53' },
  '新宋体': { english: 'NSimSun', unicode: '\\65B0\\5B8B\\4F53' },
  '黑体': { english: 'SimHei', unicode: '\\9ED1\\4F53' },
  '微软雅黑': { english: 'Microsoft YaHei', unicode: '\\5FAE\\8F6F\\96C5\\9ED1' },
  '微软雅黑轻': { english: 'Microsoft YaHei Light', unicode: '\\5FAE\\8F6F\\96C5\\9ED1 Light' },
  '楷体': { english: 'KaiTi', unicode: '\\6977\\4F53' },
  '仿宋': { english: 'FangSong', unicode: '\\4EFF\\5B8B' },
  '华文黑体': { english: 'STHeiti', unicode: '\\534E\\6587\\9ED1\\4F53' },
  '华文楷体': { english: 'STKaiti', unicode: '\\534E\\6587\\6977\\4F53' },
  '华文宋体': { english: 'STSong', unicode: '\\534E\\6587\\5B8B\\4F53' },
  '华文仿宋': { english: 'STFangsong', unicode: '\\534E\\6587\\4EFF\\5B8B' },
  '华文中宋': { english: 'STZhongsong', unicode: '\\534E\\6587\\4E2D\\5B8B' },
  '华文彩云': { english: 'STCaiyun', unicode: '\\534E\\6587\\5F69\\4E91' },
  '华文琥珀': { english: 'STHupo', unicode: '\\534E\\6587\\7425\\7280' },
  '华文隶书': { english: 'STLiti', unicode: '\\534E\\6587\\96B6\\4E66' },
  '华文新魏': { english: 'STXinwei', unicode: '\\534E\\6587\\65B0\\9B4F' },
  '苹方': { english: 'PingFang SC', unicode: '\\82F9\\65B9 SC' },
  '苹方-简': { english: 'PingFang SC', unicode: '\\82F9\\65B9-\\7B80' },
  '苹方-繁': { english: 'PingFang TC', unicode: '\\82F9\\65B9-\\7E41' },
  '冬青黑体': { english: 'Hiragino Sans GB', unicode: '\\51AC\\9752\\9ED1\\4F53' },
  '兰亭黑': { english: 'FZLanTingHei', unicode: '\\5170\\4EAD\\9ED1' },
  '思源黑体': { english: 'Noto Sans SC', unicode: '\\601D\\6E90\\9ED1\\4F53' },
  '思源宋体': { english: 'Noto Serif SC', unicode: '\\601D\\6E90\\5B8B\\4F53' },
  '等线': { english: 'DengXian', unicode: '\\7B49\\7EBF' },
  '方正舒体': { english: 'FZShuTi', unicode: '\\65B9\\6B63\\8212\\4F53' },
  '方正姚体': { english: 'FZYaoTi', unicode: '\\65B9\\6B63\\59DA\\4F53' }
}

const englishToChineseMap: Record<string, string> = {}
for (const [cn, info] of Object.entries(chineseFontMap)) {
  englishToChineseMap[info.english.toLowerCase()] = cn
}

const chineseFontRef = Object.entries(chineseFontMap).map(([name, info]) => ({
  name,
  english: info.english,
  unicode: info.unicode
}))

const englishFontRef = [
  { name: 'Arial', category: '无衬线' },
  { name: 'Helvetica', category: '无衬线' },
  { name: 'Helvetica Neue', category: '无衬线' },
  { name: 'Times New Roman', category: '衬线' },
  { name: 'Georgia', category: '衬线' },
  { name: 'Verdana', category: '无衬线' },
  { name: 'Courier New', category: '等宽' },
  { name: 'Consolas', category: '等宽' },
  { name: 'Monaco', category: '等宽' },
  { name: 'Trebuchet MS', category: '无衬线' },
  { name: 'Tahoma', category: '无衬线' },
  { name: 'Impact', category: '无衬线' },
  { name: 'Segoe UI', category: '无衬线' },
  { name: 'Roboto', category: '无衬线' },
  { name: 'Open Sans', category: '无衬线' },
  { name: 'Lato', category: '无衬线' },
  { name: 'Fira Code', category: '等宽' },
  { name: 'Source Code Pro', category: '等宽' },
  { name: 'SF Mono', category: '等宽' },
  { name: 'Menlo', category: '等宽' }
]

const fontStacks = [
  {
    name: '现代中文网页',
    icon: 'Monitor',
    color: '#165DFF',
    tagType: 'primary' as const,
    tag: '推荐',
    description: '适配 Mac/Win/Linux，优先使用苹方和雅黑',
    fonts: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif'
  },
  {
    name: '经典中文衬线',
    icon: 'Stamp',
    color: '#67c23a',
    tagType: 'success' as const,
    tag: '衬线',
    description: '适合正文阅读，优先宋体和苹方宋体',
    fonts: '"Songti SC", "SimSun", "Noto Serif SC", serif'
  },
  {
    name: '系统UI字体',
    icon: 'ChatDotRound',
    color: '#e6a23c',
    tagType: 'warning' as const,
    tag: '系统',
    description: '使用系统原生UI字体，最佳渲染效果',
    fonts: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  {
    name: '等宽代码字体',
    icon: 'Grid',
    color: '#f56c6c',
    tagType: 'danger' as const,
    tag: '等宽',
    description: '代码编辑器专用，等宽对齐',
    fonts: '"SF Mono", "Fira Code", "Source Code Pro", Consolas, Monaco, Menlo, monospace'
  },
  {
    name: '移动端中文',
    icon: 'TrendCharts',
    color: '#909399',
    tagType: 'info' as const,
    tag: '移动',
    description: '适配 iOS/Android 移动设备',
    fonts: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
  },
  {
    name: '最大兼容中文',
    icon: 'Cpu',
    color: '#165DFF',
    tagType: 'primary' as const,
    tag: '兼容',
    description: '覆盖所有主流中文系统，旧浏览器推荐 Unicode 版本',
    fonts: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", "Hiragino Sans GB", "SimHei", sans-serif'
  }
]

const toUnicodeEscape = (str: string): string => {
  return str.replace(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g, (char) => {
    const code = char.charCodeAt(0)
    return '\\' + code.toString(16).toUpperCase().padStart(4, '0')
  })
}

const needsQuotes = (fontName: string): boolean => {
  return /\s/.test(fontName) || /[\u4e00-\u9fff]/.test(fontName)
}

const parseInput = (input: string): string[] => {
  return input
    .split(/[,;，；\n]+/)
    .map(s => s.trim().replace(/^["']|["']$/g, ''))
    .filter(s => s.length > 0)
}

const parsedFonts = computed<ParsedFont[]>(() => {
  const fonts = parseInput(inputText.value)
  return fonts.map(font => {
    const hasChinese = /[\u4e00-\u9fff]/.test(font)
    let englishName = ''
    let unicodeName = ''

    if (hasChinese) {
      const info = chineseFontMap[font]
      if (info) {
        englishName = info.english
        unicodeName = info.unicode
      } else {
        unicodeName = toUnicodeEscape(font)
      }
    } else {
      const cnName = englishToChineseMap[font.toLowerCase()]
      if (cnName) {
        englishName = font
        unicodeName = chineseFontMap[cnName].unicode
      }
    }

    const cssName = needsQuotes(font) ? `"${font}"` : font

    return {
      original: font,
      cssName,
      unicodeName,
      englishName,
      hasChinese
    }
  })
})

const cssFontFamily = computed(() => {
  const result: string[] = []
  parsedFonts.value.forEach(f => {
    result.push(f.cssName)
    if (autoAddEnglish.value && f.hasChinese && f.englishName && f.englishName !== f.original) {
      result.push(needsQuotes(f.englishName) ? `"${f.englishName}"` : f.englishName)
    }
  })
  return result.join(', ')
})

const unicodeFontFamily = computed(() => {
  const result: string[] = []
  parsedFonts.value.forEach(f => {
    if (f.hasChinese && f.unicodeName) {
      result.push(`"${f.unicodeName}"`)
    } else {
      result.push(f.cssName)
    }
    if (autoAddEnglish.value && f.hasChinese && f.englishName && f.englishName !== f.original) {
      result.push(needsQuotes(f.englishName) ? `"${f.englishName}"` : f.englishName)
    }
  })
  return result.join(', ')
})

const cssDeclaration = computed(() => `font-family: ${cssFontFamily.value};`)

const unicodeCssDeclaration = computed(() => `font-family: ${unicodeFontFamily.value};`)

const cssVariable = computed(() => `--font-family: ${cssFontFamily.value};`)

const unicodeCssVariable = computed(() => `--font-family: ${unicodeFontFamily.value};`)

const scssVariable = computed(() => `$font-family: ${cssFontFamily.value};`)

const unicodeScssVariable = computed(() => `$font-family: ${unicodeFontFamily.value};`)

const lessVariable = computed(() => `@font-family: ${cssFontFamily.value};`)

const unicodeLessVariable = computed(() => `@font-family: ${unicodeFontFamily.value};`)

const jsObject = computed(() => {
  const fonts = parsedFonts.value.flatMap(f => {
    const result = [f.original]
    if (autoAddEnglish.value && f.hasChinese && f.englishName && f.englishName !== f.original) {
      result.push(f.englishName)
    }
    return result
  })
  return `const fontFamily = ${JSON.stringify(fonts, null, 2)};`
})

const reactInlineStyle = computed(() => {
  return `const style = {
  fontFamily: '${cssFontFamily.value.replace(/"/g, "'")}'
};`
})

const tailwindConfig = computed(() => {
  const fonts = parsedFonts.value.flatMap(f => {
    const result = [f.original]
    if (autoAddEnglish.value && f.hasChinese && f.englishName && f.englishName !== f.original) {
      result.push(f.englishName)
    }
    return result
  })
  const fontArray = fonts.map(f => needsQuotes(f) ? `'${f}'` : f).join(', ')
  return `module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: [${fontArray}, 'sans-serif'],
        custom: [${fontArray}]
      }
    }
  }
}`
})

const cssClassBlock = computed(() => `.font-custom {
  font-family: ${cssFontFamily.value};
  font-size: 16px;
  line-height: 1.6;
}`)

const unicodeCssClassBlock = computed(() => `.font-custom {
  font-family: ${unicodeFontFamily.value};
  font-size: 16px;
  line-height: 1.6;
}`)

const cssAtFontFace = computed(() => {
  const firstFont = parsedFonts.value[0]
  const fontName = firstFont?.englishName || firstFont?.original || 'CustomFont'
  return `@font-face {
  font-family: '${fontName}';
  src: url('./fonts/${fontName.replace(/\s+/g, '-').toLowerCase()}.woff2') format('woff2'),
       url('./fonts/${fontName.replace(/\s+/g, '-').toLowerCase()}.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`
})

const jsonConfig = computed(() => {
  const fonts = parsedFonts.value.flatMap(f => {
    const result = [f.original]
    if (autoAddEnglish.value && f.hasChinese && f.englishName && f.englishName !== f.original) {
      result.push(f.englishName)
    }
    return result
  })
  return JSON.stringify({
    fontFamily: fonts,
    cssFontFamily: cssFontFamily.value,
    unicodeFontFamily: unicodeFontFamily.value
  }, null, 2)
})

interface AttributeFormat {
  key: string
  label: string
  propName: string
  propValue: string
  fullValue: string
  description: string
  icon: string
  tag: string
  tagType: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  category: 'css' | 'preprocessor' | 'javascript' | 'config'
}

const activeAttrTab = ref('css')

const attributeFormats = computed<AttributeFormat[]>(() => [
  {
    key: 'css-declaration',
    label: 'CSS 属性',
    propName: 'font-family',
    propValue: cssFontFamily.value,
    fullValue: cssDeclaration.value,
    description: '直接用于 CSS 样式表',
    icon: 'Monitor',
    tag: 'CSS',
    tagType: 'primary',
    category: 'css'
  },
  {
    key: 'unicode-css-declaration',
    label: 'Unicode CSS 属性',
    propName: 'font-family',
    propValue: unicodeFontFamily.value,
    fullValue: unicodeCssDeclaration.value,
    description: '中文转 Unicode 编码，兼容性最佳',
    icon: 'Cpu',
    tag: '兼容',
    tagType: 'success',
    category: 'css'
  },
  {
    key: 'css-variable',
    label: 'CSS 变量',
    propName: '--font-family',
    propValue: cssFontFamily.value,
    fullValue: cssVariable.value,
    description: 'CSS 自定义属性，可全局复用',
    icon: 'SetUp',
    tag: 'CSS3',
    tagType: 'primary',
    category: 'css'
  },
  {
    key: 'unicode-css-variable',
    label: 'Unicode CSS 变量',
    propName: '--font-family',
    propValue: unicodeFontFamily.value,
    fullValue: unicodeCssVariable.value,
    description: 'Unicode 编码的 CSS 自定义属性',
    icon: 'Cpu',
    tag: '兼容',
    tagType: 'success',
    category: 'css'
  },
  {
    key: 'css-class',
    label: 'CSS 类定义',
    propName: '.font-custom',
    propValue: cssClassBlock.value,
    fullValue: cssClassBlock.value,
    description: '完整 CSS 类声明，含字号行高',
    icon: 'Document',
    tag: 'CSS',
    tagType: 'primary',
    category: 'css'
  },
  {
    key: 'unicode-css-class',
    label: 'Unicode CSS 类',
    propName: '.font-custom',
    propValue: unicodeCssClassBlock.value,
    fullValue: unicodeCssClassBlock.value,
    description: 'Unicode 编码的 CSS 类声明',
    icon: 'Cpu',
    tag: '兼容',
    tagType: 'success',
    category: 'css'
  },
  {
    key: 'font-face',
    label: '@font-face',
    propName: '@font-face',
    propValue: cssAtFontFace.value,
    fullValue: cssAtFontFace.value,
    description: '自定义字体引入规则模板',
    icon: 'Key',
    tag: '自定义',
    tagType: 'danger',
    category: 'css'
  },
  {
    key: 'scss-variable',
    label: 'SCSS 变量',
    propName: '$font-family',
    propValue: cssFontFamily.value,
    fullValue: scssVariable.value,
    description: 'Sass/SCSS 变量定义',
    icon: 'Memo',
    tag: 'SCSS',
    tagType: 'warning',
    category: 'preprocessor'
  },
  {
    key: 'unicode-scss-variable',
    label: 'Unicode SCSS 变量',
    propName: '$font-family',
    propValue: unicodeFontFamily.value,
    fullValue: unicodeScssVariable.value,
    description: 'Unicode 编码的 SCSS 变量',
    icon: 'Cpu',
    tag: '兼容',
    tagType: 'success',
    category: 'preprocessor'
  },
  {
    key: 'less-variable',
    label: 'Less 变量',
    propName: '@font-family',
    propValue: cssFontFamily.value,
    fullValue: lessVariable.value,
    description: 'Less 变量定义',
    icon: 'Memo',
    tag: 'Less',
    tagType: 'warning',
    category: 'preprocessor'
  },
  {
    key: 'unicode-less-variable',
    label: 'Unicode Less 变量',
    propName: '@font-family',
    propValue: unicodeFontFamily.value,
    fullValue: unicodeLessVariable.value,
    description: 'Unicode 编码的 Less 变量',
    icon: 'Cpu',
    tag: '兼容',
    tagType: 'success',
    category: 'preprocessor'
  },
  {
    key: 'js-object',
    label: 'JavaScript 数组',
    propName: 'const fontFamily',
    propValue: jsObject.value.replace('const fontFamily = ', ''),
    fullValue: jsObject.value,
    description: 'JS/TS 字体栈数组',
    icon: 'DataLine',
    tag: 'JS/TS',
    tagType: 'info',
    category: 'javascript'
  },
  {
    key: 'react-style',
    label: 'React 内联样式',
    propName: 'style.fontFamily',
    propValue: cssFontFamily.value.replace(/"/g, "'"),
    fullValue: reactInlineStyle.value,
    description: 'React 组件 style 对象',
    icon: 'DataLine',
    tag: 'React',
    tagType: 'info',
    category: 'javascript'
  },
  {
    key: 'tailwind-config',
    label: 'Tailwind 配置',
    propName: 'fontFamily.custom',
    propValue: tailwindConfig.value,
    fullValue: tailwindConfig.value,
    description: 'tailwind.config.js 字体配置',
    icon: 'Files',
    tag: 'Tailwind',
    tagType: 'primary',
    category: 'config'
  },
  {
    key: 'json-config',
    label: 'JSON 配置',
    propName: 'fontFamily',
    propValue: jsonConfig.value,
    fullValue: jsonConfig.value,
    description: 'JSON 格式配置文件',
    icon: 'Files',
    tag: 'JSON',
    tagType: 'info',
    category: 'config'
  }
])

const getFormatsByCategory = (category: string) => {
  if (category === 'all') return attributeFormats.value
  return attributeFormats.value.filter(f => f.category === category)
}

const getIconColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    primary: '#165DFF',
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#f56c6c',
    info: '#909399'
  }
  return colorMap[type] || '#165DFF'
}

const handleInput = () => {}

const addFont = (fontName: string) => {
  const current = inputText.value.trim()
  if (current) {
    inputText.value = current + ', ' + fontName
  } else {
    inputText.value = fontName
  }
  ElMessage.success(`已添加字体: ${fontName}`)
}

const removeFont = (index: number) => {
  const fonts = parseInput(inputText.value)
  fonts.splice(index, 1)
  inputText.value = fonts.join(', ')
}

const clearInput = () => {
  inputText.value = ''
  ElMessage.success('已清空输入')
}

const addPresetFont = (type: string) => {
  if (type === 'chinese') {
    inputText.value = '微软雅黑, 宋体, 黑体, 楷体, 仿宋'
  } else if (type === 'english') {
    inputText.value = 'Arial, Helvetica, Georgia, Verdana, Times New Roman'
  } else if (type === 'stack') {
    inputText.value = 'PingFang SC, Microsoft YaHei, Noto Sans SC, sans-serif'
  }
  ElMessage.success('已加载预设字体')
}

const applyStack = (stack: typeof fontStacks[0]) => {
  const fontNames = stack.fonts
    .split(',')
    .map(f => f.trim().replace(/^["']|["']$/g, ''))
    .filter(f => !f.startsWith('-') && !['sans-serif', 'serif', 'monospace'].includes(f))
  inputText.value = fontNames.join(', ')
  ElMessage.success(`已应用「${stack.name}」字体栈`)
}

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(`${label}已复制到剪贴板`)
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}
</script>

<style scoped>
.font-encoder {
  max-width: 1000px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.input-modes {
  margin-top: 20px;
}

.mode-card {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  text-align: center;
  transition: all 0.3s;
  height: 100%;
}

.mode-card:hover {
  border-color: #165DFF;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
  transform: translateY(-2px);
}

.mode-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 28px;
  color: #fff;
}

.mode-icon.primary {
  background: linear-gradient(135deg, #409eff, #165DFF);
}

.mode-icon.success {
  background: linear-gradient(135deg, #67c23a, #529e2e);
}

.mode-icon.warning {
  background: linear-gradient(135deg, #e6a23c, #cf9236);
}

.mode-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.mode-desc {
  font-size: 13px;
  color: #909399;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.mode-example {
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.mode-example code {
  font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  font-size: 12px;
  color: #165DFF;
  word-break: break-all;
}

.rules-card {
  margin-bottom: 24px;
}

.rule-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.rule-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.rule-content {
  display: flex;
  gap: 8px;
}

.input-hint-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.input-hint.success {
  color: #67c23a;
}

.smart-match-alert {
  margin-bottom: 16px;
}

.smart-match-alert :deep(.el-alert__title) {
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.font-tag-wrapper {
  display: inline-flex;
  margin-right: 8px;
  margin-bottom: 8px;
}

.main-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  line-height: 28px;
  height: 30px;
}

.sub-tag {
  margin-left: 4px;
  font-weight: normal;
  line-height: 18px;
  height: 20px;
}

.match-hint-alert {
  margin-bottom: 16px;
}

.match-hint-alert :deep(.el-alert__title) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.encoder-card {
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

.input-section {
  margin-bottom: 20px;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.input-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.font-input :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.8;
  font-family: 'PingFang SC', 'Microsoft YaHei', monospace;
}

.font-tags-section {
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.font-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.result-card {
  margin-bottom: 24px;
}

.result-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-section {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.result-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.result-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.code-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #1e1e1e;
  border-radius: 6px;
  overflow: hidden;
}

.code-block code {
  color: #d4d4d4;
  font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-all;
  flex: 1;
  min-width: 0;
}

.code-block .el-button {
  color: #909399;
  flex-shrink: 0;
}

.code-block .el-button:hover {
  color: #fff;
}

.code-key {
  color: #9cdcfe;
}

.result-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.table-code {
  font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  font-size: 12px;
  color: #165DFF;
  background: #f0f7ff;
  padding: 2px 6px;
  border-radius: 3px;
}

.presets-card {
  margin-bottom: 24px;
}

.stack-item {
  padding: 20px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.stack-item:hover {
  border-color: #165DFF;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
}

.stack-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stack-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.stack-desc {
  font-size: 13px;
  color: #909399;
  margin: 0 0 12px 0;
}

.stack-preview {
  padding: 10px 12px;
  background: #1e1e1e;
  border-radius: 6px;
  margin-bottom: 12px;
}

.stack-preview code {
  color: #d4d4d4;
  font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  font-size: 12px;
  word-break: break-all;
}

.stack-actions {
  display: flex;
  gap: 12px;
}

.reference-card {
  margin-bottom: 24px;
}

.ref-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.ref-item {
  padding: 12px 16px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.ref-item:hover {
  border-color: #165DFF;
  background: #f0f7ff;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.1);
}

.ref-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.ref-alias {
  font-size: 12px;
  color: #909399;
}

.ref-unicode {
  font-size: 11px;
  color: #165DFF;
  font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  margin-top: 2px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}

.attr-hint-alert {
  margin-bottom: 20px;
}

.attr-hint-alert :deep(.el-alert__title) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.attr-tabs {
  margin-top: 8px;
}

.attr-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}

.attr-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.attr-item {
  padding: 16px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.attr-item:hover {
  border-color: #165DFF;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
}

.attr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.attr-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.attr-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 12px;
  line-height: 1.4;
}

.attr-kv {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.attr-kv-row {
  display: flex;
  align-items: stretch;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.attr-kv-row:hover {
  border-color: #165DFF;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.1);
}

.attr-kv-row:hover .kv-copy {
  background: #165DFF;
  color: #fff;
}

.attr-kv-row:hover .kv-label {
  background: #165DFF;
  color: #fff;
}

.kv-label {
  flex-shrink: 0;
  width: 86px;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  background: #f0f2f5;
  color: #606266;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  border-right: 1px solid #e4e7ed;
}

.kv-name {
  flex: 1;
  padding: 10px 12px;
  font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  font-size: 13px;
  color: #165DFF;
  display: flex;
  align-items: center;
  word-break: break-all;
  line-height: 1.5;
  font-weight: 500;
}

.kv-value {
  flex: 1;
  padding: 10px 12px;
  font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  font-size: 12px;
  color: #303133;
  word-break: break-all;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
}

.kv-copy {
  flex-shrink: 0;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #909399;
  transition: all 0.2s;
  border-left: 1px solid #e4e7ed;
}

.attr-full-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  color: #606266;
  cursor: pointer;
  background: #f5f7fa;
  border-radius: 6px;
  transition: all 0.2s;
}

.attr-full-row:hover {
  background: #e8f0fe;
  color: #165DFF;
}

@media (max-width: 768px) {
  .attr-grid {
    grid-template-columns: 1fr;
  }

  .attr-item {
    padding: 14px;
  }

  .attr-title {
    font-size: 13px;
  }

  .kv-value {
    font-size: 11px;
  }
}
</style>
