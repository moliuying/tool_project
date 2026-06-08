<template>
  <div class="copywriting-creator">
    <el-card class="intro-card">
      <div class="intro-header">
        <div class="intro-left">
          <div class="intro-icon">✍️</div>
          <div class="intro-text">
            <h2 class="intro-title">多类型文案创作</h2>
            <p class="intro-subtitle">
              选择或描述你需要的文案类型，AI 快速生成对应场景的文案内容，助你高效完成各类写作任务
            </p>
          </div>
        </div>
        <div class="intro-badges">
          <el-tag type="primary" effect="dark" size="large">📝 {{ copyTypes.length }} 种文案类型</el-tag>
          <el-tag type="success" effect="dark" size="large">🎯 场景深度适配</el-tag>
        </div>
      </div>
      <el-divider />
      <div class="intro-sections">
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><User /></el-icon>
            适用人群
          </h4>
          <div class="audience-tags">
            <div class="audience-tag">
              <span class="at-emoji">📱</span>
              <span class="at-name">自媒体运营</span>
              <span class="at-desc">小红书、抖音、公众号</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">🎨</span>
              <span class="at-name">内容创作者</span>
              <span class="at-desc">博主、写手、编辑</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">🛒</span>
              <span class="at-name">电商卖家</span>
              <span class="at-desc">产品描述、活动策划</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">💼</span>
              <span class="at-name">职场人士</span>
              <span class="at-desc">汇报、邮件、总结</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">📚</span>
              <span class="at-name">学生群体</span>
              <span class="at-desc">作文、笔记、自我介绍</span>
            </div>
          </div>
        </div>
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><Grid /></el-icon>
            典型应用场景
          </h4>
          <div class="scene-tags">
            <el-tag size="large" effect="plain">小红书种草笔记</el-tag>
            <el-tag size="large" effect="plain">朋友圈推广文案</el-tag>
            <el-tag size="large" effect="plain">电商产品描述</el-tag>
            <el-tag size="large" effect="plain">活动通知公告</el-tag>
            <el-tag size="large" effect="plain">读书学习笔记</el-tag>
            <el-tag size="large" effect="plain">个人自我介绍</el-tag>
            <el-tag size="large" effect="plain">工作汇报总结</el-tag>
            <el-tag size="large" effect="plain">日常社交沟通</el-tag>
          </div>
        </div>
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><Collection /></el-icon>
            支持的 {{ copyTypes.length }} 种文案类型一览
          </h4>
          <div class="type-overview-grid">
            <div
              v-for="cat in typeCategories"
              :key="cat.key"
              class="type-overview-card"
            >
              <div class="toc-header">
                <span class="toc-emoji">{{ cat.emoji }}</span>
                <span class="toc-label">{{ cat.label }}</span>
                <el-tag size="small" type="info" effect="plain">{{ cat.types.length }} 种</el-tag>
              </div>
              <div class="toc-desc">{{ cat.desc }}</div>
              <div class="toc-list">
                <div
                  v-for="tval in cat.types"
                  :key="tval"
                  class="toc-item"
                >
                  <span class="toc-item-emoji">{{ getTypeEmoji(tval) }}</span>
                  <span class="toc-item-name">{{ getTypeLabel(tval) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="intro-section custom-hint-section">
          <div class="custom-hint-box">
            <div class="ch-left">
              <div class="ch-icon">💡</div>
              <div class="ch-texts">
                <div class="ch-title">不确定选哪个类型？没找到想要的？</div>
                <div class="ch-desc">
                  <strong>① 交叉场景（如产品发布会、公司年会等）：</strong>点击右侧「查看常见场景指南」对照推荐<br />
                  <strong>② 非常规需求：</strong>选择最接近的类型，然后在「补充要求」中详细描述具体场景（如婚礼祝酒词、道歉信等），AI 会灵活调整。
                </div>
                <el-button
                  size="small"
                  type="warning"
                  plain
                  class="ch-help-btn"
                  @click="showTypeHelpDialog = true"
                >
                  <el-icon><QuestionFilled /></el-icon>
                  查看常见场景选择指南
                </el-button>
              </div>
            </div>
            <div class="ch-right">
              <div class="ch-examples">
                <span class="ch-example-label">常见交叉场景：</span>
                <el-tag size="small" effect="plain" @click="showTypeHelpDialog = true">🚀 产品发布会</el-tag>
                <el-tag size="small" effect="plain" @click="showTypeHelpDialog = true">🎊 公司年会</el-tag>
                <el-tag size="small" effect="plain" @click="showTypeHelpDialog = true">👋 自我介绍</el-tag>
                <el-tag size="small" effect="plain" @click="showTypeHelpDialog = true">🛍️ 产品推广</el-tag>
                <el-tag size="small" effect="plain" @click="showTypeHelpDialog = true">🎁 节日祝福</el-tag>
                <el-tag size="small" effect="plain" @click="showTypeHelpDialog = true">📖 读书分享</el-tag>
              </div>
              <div class="ch-examples" style="margin-top: 10px">
                <span class="ch-example-label">非常规场景同样可处理：</span>
                <el-tag size="small" effect="plain">婚礼祝酒词</el-tag>
                <el-tag size="small" effect="plain">道歉信</el-tag>
                <el-tag size="small" effect="plain">感谢信</el-tag>
                <el-tag size="small" effect="plain">辞职信</el-tag>
                <el-tag size="small" effect="plain">颁奖词</el-tag>
                <el-tag size="small" effect="plain">家长寄语</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>功能说明 & 结果预期</span>
        </div>
      </template>
      <el-steps :active="currentStep" finish-status="success" simple class="guide-steps">
        <el-step title="选择文案类型" description="15+ 场景深度适配模板" />
        <el-step title="输入核心信息" description="主题、关键词、补充要求" />
        <el-step title="设定风格偏好" description="语气 × 字数 × 版本数" />
        <el-step title="查看与复制" description="多版本对比择优使用" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Collection /></el-icon>
            <div class="exp-text">
              <div class="exp-num">{{ copyTypes.length }} 种类型</div>
              <div class="exp-label">覆盖工作/生活/学习全场景</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">{{ totalStyleCount }} 种风格</div>
              <div class="exp-label">专业/活泼/正式/文艺等多维覆盖</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Document /></el-icon>
            <div class="exp-text">
              <div class="exp-num">1 ~ 5 个版本</div>
              <div class="exp-label">每次生成可自选数量对比</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><EditPen /></el-icon>
            <div class="exp-text">
              <div class="exp-num">结构化输出</div>
              <div class="exp-label">文案内容 + 写作要点 + 适用建议</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <Edit />
          </el-icon>
          <span>AI 文案创作</span>
          <el-tag size="small" type="warning">多类型 · 多风格 · 多版本</el-tag>
        </div>
      </template>

      <div class="type-section">
        <div class="section-title">
          <el-icon><Collection /></el-icon>
          <span>选择文案类型</span>
          <span class="required-tag">*</span>
          <el-tag size="small" type="info" class="hint-tag">
            不同类型的结构、语气、字数都会自动适配
          </el-tag>
          <el-button
            link
            type="primary"
            size="small"
            class="help-btn"
            @click="showTypeHelpDialog = true"
          >
            <el-icon><QuestionFilled /></el-icon>
            不确定选哪个？
          </el-button>
        </div>
        <div class="type-filter-bar">
          <div
            class="filter-chip"
            :class="{ active: activeCategory === 'all' }"
            @click="activeCategory = 'all'"
          >
            <span>🎯</span>
            <span>全部类型</span>
            <el-tag size="small" type="info" effect="plain">{{ copyTypes.length }}</el-tag>
          </div>
          <div
            v-for="cat in typeCategories"
            :key="cat.key"
            class="filter-chip"
            :class="{ active: activeCategory === cat.key }"
            @click="activeCategory = cat.key"
          >
            <span>{{ cat.emoji }}</span>
            <span>{{ cat.label }}</span>
            <el-tag size="small" type="info" effect="plain">{{ cat.types.length }}</el-tag>
          </div>
        </div>
        <div class="type-options">
          <el-tooltip
            v-for="type in filteredTypes"
            :key="type.value"
            placement="top"
            :show-after="300"
          >
            <template #content>
              <div class="type-tooltip">
                <div class="tt-title">
                  <span>{{ type.emoji }}</span>
                  <span>{{ type.label }}</span>
                </div>
                <div class="tt-section">
                  <div class="tt-label">💡 适用说明：</div>
                  <div class="tt-text">{{ type.detailGuide }}</div>
                </div>
                <div class="tt-section">
                  <div class="tt-label">🏷️ 典型场景：</div>
                  <div class="tt-scenes">
                    <el-tag
                      v-for="s in type.typicalScenes"
                      :key="s"
                      size="small"
                      type="info"
                      effect="plain"
                    >{{ s }}</el-tag>
                  </div>
                </div>
              </div>
            </template>
            <div
              class="type-card"
              :class="{ active: selectedType === type.value, disabled: isGenerating }"
              @click="!isGenerating && (selectedType = type.value)"
            >
              <div class="type-emoji">{{ type.emoji }}</div>
              <div class="type-name">{{ type.label }}</div>
              <div class="type-desc">{{ type.desc }}</div>
              <div class="type-scenes">
                <el-tag
                  v-for="s in type.typicalScenes.slice(0, 2)"
                  :key="s"
                  size="small"
                  effect="plain"
                  type="info"
                >{{ s }}</el-tag>
              </div>
            </div>
          </el-tooltip>
        </div>
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          <span>文案主题 / 核心内容</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="topic"
          type="textarea"
          :rows="3"
          :placeholder="currentTypeConfig.placeholder"
          maxlength="300"
          show-word-limit
          :disabled="isGenerating"
          resize="vertical"
        />
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Star /></el-icon>
          <span>关键词 / 核心要点（可选，每行一个）</span>
        </div>
        <el-input
          v-model="keywordsText"
          type="textarea"
          :rows="3"
          placeholder="例如：&#10;性价比高&#10;适合学生党&#10;限时优惠"
          :disabled="isGenerating"
          resize="vertical"
        />
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><ChatDotRound /></el-icon>
          <span>补充要求 / 特殊说明（可选）</span>
        </div>
        <el-input
          v-model="additionalNotes"
          type="textarea"
          :rows="2"
          placeholder="例如：需要突出产品的环保特性、语气要俏皮可爱、字数控制在200字以内..."
          maxlength="200"
          show-word-limit
          :disabled="isGenerating"
          resize="none"
        />
      </div>

      <div class="quick-samples">
        <span class="sample-label">💡 快速体验：</span>
        <el-tag
          v-for="(sample, i) in currentTypeSamples"
          :key="i"
          class="sample-tag"
          effect="plain"
          @click="applySample(sample)"
        >
          {{ sample.label }}
        </el-tag>
      </div>

      <div class="two-col-section">
        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><MagicStick /></el-icon>
            <span>文案风格（可选）</span>
          </div>
          <div class="style-options">
            <div
              v-for="style in availableStyles"
              :key="style.value"
              class="style-chip"
              :class="{ active: selectedStyles.includes(style.value), disabled: isGenerating }"
              @click="!isGenerating && toggleStyle(style.value)"
            >
              <span class="style-emoji">{{ style.emoji }}</span>
              <span class="style-label">{{ style.label }}</span>
            </div>
          </div>
          <div class="style-tip" v-if="selectedStyles.length === 0">
            <el-tag size="small" type="info">不选则根据文案类型智能匹配最佳风格</el-tag>
          </div>
        </div>

        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            <span>输出版本数</span>
          </div>
          <div class="version-options">
            <div
              v-for="opt in versionOptions"
              :key="opt.value"
              class="version-card"
              :class="{ active: versionCount === opt.value, disabled: isGenerating }"
              @click="!isGenerating && (versionCount = opt.value)"
            >
              <div class="version-num">{{ opt.value }}</div>
              <div class="version-label">个版本</div>
              <div class="version-desc">{{ opt.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-section">
        <el-button
          type="primary"
          size="large"
          :icon="MagicStick"
          :loading="isGenerating"
          :disabled="!canGenerate"
          @click="generateCopy"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 正在为「{{ currentTypeConfig.label }}」场景生成 {{ versionCount }} 个文案版本…
            </span>
          </template>
          生成文案
        </el-button>
        <el-button
          size="large"
          :icon="Refresh"
          :disabled="isGenerating"
          @click="resetAll"
        >
          重置
        </el-button>
      </div>

      <div v-if="isGenerating" class="generating-status">
        <div class="generating-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <span class="generating-text">
          ✨ 正在分析「{{ currentTypeConfig.label }}」写作模板，融合 {{ keywordsList.length }} 个关键词
          <span v-if="selectedStyles.length > 0"> + {{ selectedStyles.length }} 种风格偏好</span>
          ，打磨优质文案…
        </span>
      </div>
    </el-card>

    <el-card v-if="generatedResults.length > 0" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>生成结果</span>
          <el-tag size="small" type="success">
            {{ currentTypeConfig.label }}
          </el-tag>
          <el-tag v-if="selectedStyles.length > 0" size="small" type="warning" effect="light">
            风格：{{ selectedStyles.map(s => getStyleLabel(s)).join('+') }}
          </el-tag>
          <el-tag size="small" type="info">共 {{ generatedResults.length }} 个版本</el-tag>
          <div class="header-actions">
            <el-button size="small" type="primary" link :icon="CopyDocument" @click="copyAllResults">
              复制全部版本
            </el-button>
          </div>
        </div>
      </template>

      <div class="version-tabs">
        <div
          v-for="(_, idx) in generatedResults"
          :key="idx"
          class="version-tab"
          :class="{ active: activeVersion === idx }"
          @click="activeVersion = idx"
        >
          版本 {{ idx + 1 }}
          <el-tag size="small" :type="getVersionTagType(idx)">
            {{ generatedResults[idx].styleLabel }}
          </el-tag>
        </div>
      </div>

      <div v-if="currentResult" class="result-content">
        <div class="result-section">
          <div class="section-title-sm">
            <el-icon color="#e6a23c"><EditPen /></el-icon>
            <span>📝 文案内容</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.content)">复制</el-button>
          </div>
          <div class="result-content-text">{{ currentResult.content }}</div>
        </div>

        <div v-if="currentResult.title" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#165DFF"><ChatDotRound /></el-icon>
            <span>🎯 推荐标题</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.title)">复制</el-button>
          </div>
          <div class="result-title-text">{{ currentResult.title }}</div>
        </div>

        <div v-if="currentResult.tips" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#67c23a"><Bulb /></el-icon>
            <span>💡 写作要点</span>
          </div>
          <div class="result-tips-text">{{ currentResult.tips }}</div>
        </div>

        <div v-if="currentResult.suggestion" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#909399"><Promotion /></el-icon>
            <span>🎯 适用建议</span>
          </div>
          <div class="result-suggestion-text">{{ currentResult.suggestion }}</div>
        </div>

        <div class="result-footer">
          <el-button type="primary" :icon="Download" @click="copyCurrentFull">
            复制完整内容（版本 {{ activeVersion + 1 }}）
          </el-button>
          <el-button :icon="RefreshRight" @click="regenerateVersion">
            换一个风格
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card v-if="history.length > 0" class="history-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Clock />
          </el-icon>
          <span>历史记录</span>
          <el-button size="small" text type="danger" @click="clearHistory">
            清空记录
          </el-button>
        </div>
      </template>

      <div class="history-list">
        <div
          v-for="(item, index) in displayHistory"
          :key="index"
          class="history-item"
          @click="loadFromHistory(item)"
        >
          <div class="history-time">{{ formatTime(item.time) }}</div>
          <div class="history-topic">
            <el-tag size="small" type="info">{{ getTypeLabel(item.type) }}</el-tag>
            <span class="history-text">{{ truncateText(item.topic, 40) }}</span>
          </div>
          <div class="history-meta">
            <el-tag size="small" type="success">{{ item.results.length }}个版本</el-tag>
          </div>
        </div>
      </div>
      <div v-if="history.length > 10" class="history-footer">
        <el-button text size="small" @click="showAllHistory = !showAllHistory">
          {{ showAllHistory ? '收起' : `查看全部 ${history.length} 条记录` }}
        </el-button>
      </div>
    </el-card>

    <el-dialog
      v-model="showTypeHelpDialog"
      title="🤔 常见场景 · 文案类型选择指南"
      width="780px"
      :close-on-click-modal="true"
    >
      <div class="help-dialog-content">
        <div class="help-tip">
          <el-icon color="#e6a23c"><InfoFilled /></el-icon>
          <span>点击下方推荐类型可直接选中并关闭对话框</span>
        </div>
        <div class="help-scene-list">
          <div
            v-for="scene in ambiguousScenesHelp"
            :key="scene.scene"
            class="help-scene-item"
          >
            <div class="hs-header">
              <span class="hs-emoji">{{ scene.emoji }}</span>
              <span class="hs-name">{{ scene.scene }}</span>
              <el-tag
                type="success"
                effect="light"
                size="small"
                class="hs-recommend"
                @click="selectTypeFromHelp(scene.recommend)"
              >
                ✅ 推荐选：{{ scene.recommendLabel }}
              </el-tag>
            </div>
            <div class="hs-alternatives">
              <div
                v-for="alt in scene.alternatives"
                :key="alt.type"
                class="hs-alt-item"
                @click="selectTypeFromHelp(alt.type)"
              >
                <el-tag type="info" effect="plain" size="small">{{ alt.label }}</el-tag>
                <span class="hs-alt-reason">{{ alt.reason }}</span>
              </div>
            </div>
          </div>
        </div>
        <el-divider />
        <div class="help-footer-note">
          <strong>💡 终极法则：</strong>
          仍不确定时，选择最接近的类型，然后在「补充要求」中详细描述你的具体场景和需求，AI 会灵活调整输出内容。
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Edit,
  Collection,
  EditPen,
  Star,
  ChatDotRound,
  MagicStick,
  Refresh,
  Loading,
  Finished,
  CopyDocument,
  Download,
  Clock,
  InfoFilled,
  Document,
  RefreshRight,
  Bulb,
  Promotion,
  User,
  Grid,
  QuestionFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface CopywritingResult {
  title?: string
  content: string
  tips?: string
  suggestion?: string
  style: string
  styleLabel: string
}

interface HistoryItem {
  type: string
  topic: string
  keywordsText: string
  additionalNotes: string
  styles: string[]
  results: CopywritingResult[]
  time: string
}

interface QuickSample {
  label: string
  type: string
  topic: string
  keywords: string[]
  additionalNotes: string
  hintStyles: string[]
}

const STORAGE_KEY = 'copywriting_creator_history'

interface CopyTypeConfig {
  value: string
  label: string
  emoji: string
  desc: string
  placeholder: string
  defaultStyles: string[]
  contentLength: { min: number; max: number }
  typicalScenes: string[]
  detailGuide: string
}

const copyTypes: CopyTypeConfig[] = [
  {
    value: 'xiaohongshu',
    label: '小红书种草',
    emoji: '📕',
    desc: '小红书笔记、好物分享',
    placeholder: '例如：最近发现一款超好用的洗面奶，用完皮肤滑滑的不紧绷，学生党也能轻松入手',
    defaultStyles: ['warm', 'playful'],
    contentLength: { min: 200, max: 600 },
    typicalScenes: ['好物测评', '开箱分享', '使用心得', '避坑指南', '穿搭教程'],
    detailGuide: '适用于小红书、大众点评等种草平台风格的笔记内容，以个人真实体验口吻撰写，使用大量 emoji 和口语化表达，适合发布在社交平台上吸引点赞收藏。'
  },
  {
    value: 'moments',
    label: '朋友圈推广',
    emoji: '💬',
    desc: '朋友圈、社群推广文案',
    placeholder: '例如：新开业的咖啡店，环境超好，饮品颜值高还不贵，周末约朋友打卡的好去处',
    defaultStyles: ['warm', 'concise'],
    contentLength: { min: 80, max: 250 },
    typicalScenes: ['新店开业', '产品安利', '活动宣传', '个人动态', '社群通知'],
    detailGuide: '适用于微信朋友圈、微信群、QQ空间等短平快社交场景，文字精炼、语气自然，像朋友聊天口吻，可搭配图片或短视频配文。'
  },
  {
    value: 'product',
    label: '产品描述',
    emoji: '🛍️',
    desc: '电商详情页、产品介绍',
    placeholder: '例如：一款多功能无线蓝牙耳机，主打降噪和长续航，适合通勤和运动使用',
    defaultStyles: ['professional', 'persuasive'],
    contentLength: { min: 150, max: 400 },
    typicalScenes: ['淘宝详情', '商品介绍', '功能卖点', '参数说明', '新品上市'],
    detailGuide: '以产品为核心，突出卖点、功能、参数、使用场景，偏向消费者视角撰写，适合电商详情页、商品介绍文案等正式销售场景。如果需要在活动/促销信息请选「活动通知」，如需要发布会演讲请选「演讲稿件」。'
  },
  {
    value: 'activity',
    label: '活动通知',
    emoji: '📢',
    desc: '活动公告、促销通知',
    placeholder: '例如：618年中大促活动，全场商品五折起，满300减50，还有精美赠品',
    defaultStyles: ['enthusiastic', 'concise'],
    contentLength: { min: 100, max: 300 },
    typicalScenes: ['促销活动', '限时优惠', '周年庆', '新品发售', '节日特惠'],
    detailGuide: '以活动信息为核心：时间、地点、优惠规则、参与方式等关键信息清晰，适合活动宣传海报、公众号推文、社群公告等。'
  },
  {
    value: 'reading',
    label: '读书笔记',
    emoji: '📚',
    desc: '读书心得、学习笔记',
    placeholder: '例如：《原子习惯》这本书讲的是如何通过微小改变培养好习惯，核心观点是习惯的复利效应',
    defaultStyles: ['literary', 'thoughtful'],
    contentLength: { min: 200, max: 500 },
    typicalScenes: ['读后感', '好书推荐', '知识梳理', '观点摘录', '学习总结'],
    detailGuide: '适合读完一本书后的个人感悟、要点梳理、内容摘要、书评推荐，偏知识学习和个人成长向。'
  },
  {
    value: 'selfintro',
    label: '自我介绍',
    emoji: '👋',
    desc: '面试、社交、入职介绍',
    placeholder: '例如：我叫张三，毕业于北京大学计算机专业，有3年前端开发经验，擅长Vue和React技术栈',
    defaultStyles: ['professional', 'confident'],
    contentLength: { min: 100, max: 300 },
    typicalScenes: ['求职面试', '新员工入职', '社群破冰', '演讲开场', '相亲交友'],
    detailGuide: '聚焦个人经历、能力特长、性格特点，根据不同场合调整正式程度。如果是求职简历的自我评价，请选「求职简历」。'
  },
  {
    value: 'report',
    label: '工作汇报',
    emoji: '📊',
    desc: '周报、月报、项目总结',
    placeholder: '例如：本月完成了用户系统的重构，性能提升50%，同时上线了3个新功能',
    defaultStyles: ['professional', 'concise'],
    contentLength: { min: 200, max: 500 },
    typicalScenes: ['周报月报', '项目复盘', '季度总结', '述职报告', '工作规划'],
    detailGuide: '结构化呈现：已完成工作、数据成果、问题与反思、下一步计划，强调数据和结果，适合职场正式汇报场景。'
  },
  {
    value: 'email',
    label: '商务邮件',
    emoji: '📧',
    desc: '工作邮件、商务沟通',
    placeholder: '例如：需要给合作方发邮件确认下周的会议时间和议程',
    defaultStyles: ['professional', 'polite'],
    contentLength: { min: 100, max: 300 },
    typicalScenes: ['工作沟通', '会议邀请', '合作洽谈', '请假申请', '邮件回复'],
    detailGuide: '包含标准邮件结构：称呼、正文、落款，语气礼貌得体、条理清晰，适用于职场正式书面沟通。'
  },
  {
    value: 'social',
    label: '社交文案',
    emoji: '🎉',
    desc: '生日祝福、节日问候',
    placeholder: '例如：给好朋友写一段生日祝福，我们认识十年了，想表达感谢和祝福',
    defaultStyles: ['warm', 'literary'],
    contentLength: { min: 80, max: 200 },
    typicalScenes: ['生日祝福', '纪念日', '感谢卡', '毕业寄语', '乔迁祝福'],
    detailGuide: '聚焦情感表达，温暖走心，适合给朋友、家人、同事的祝贺、感谢、问候等私人社交场景。如需更正式的节日问候发给客户等，请选「节日问候」。'
  },
  {
    value: 'slogan',
    label: '品牌标语',
    emoji: '🏷️',
    desc: '品牌Slogan、广告口号',
    placeholder: '例如：一家主打健康轻食的餐饮品牌，目标客户是注重健康的年轻白领',
    defaultStyles: ['creative', 'concise'],
    contentLength: { min: 10, max: 50 },
    typicalScenes: ['品牌Slogan', '广告口号', '产品Tagline', '店铺招牌', '活动主题'],
    detailGuide: '短平快、有记忆点的一句话标语，通常10字以内，突出品牌/产品的核心理念。'
  },
  {
    value: 'speech',
    label: '演讲稿件',
    emoji: '🎤',
    desc: '发言、致辞、分享稿',
    placeholder: '例如：公司年会上作为优秀员工代表发言，需要表达感谢和未来展望',
    defaultStyles: ['inspiring', 'sincere'],
    contentLength: { min: 300, max: 800 },
    typicalScenes: ['产品发布会', '年会致辞', '获奖感言', '开工讲话', '毕业演讲', '培训分享'],
    detailGuide: '适合需要当众口头表达的场合：如产品发布会演讲、领导致辞、年会发言、培训分享等，有开场-正文-结尾结构，口语化、有感染力、注重现场氛围。如果是纯活动信息通知请选「活动通知」，如果是写正式邀请他人参加发布会请选「邀请函件」。'
  },
  {
    value: 'composition',
    label: '作文素材',
    emoji: '✍️',
    desc: '中小学作文、议论文',
    placeholder: '例如：以"坚持"为主题写一篇议论文，需要有论点论据和例子',
    defaultStyles: ['literary', 'thoughtful'],
    contentLength: { min: 400, max: 800 },
    typicalScenes: ['议论文', '记叙文', '考场作文', '话题作文', '读后感素材'],
    detailGuide: '学生作文/议论文：有明确论点、论据、论证结构，语言规范，适合学校写作练习或考试。'
  },
  {
    value: 'invitation',
    label: '邀请函件',
    emoji: '💌',
    desc: '婚礼、会议、活动邀请',
    placeholder: '例如：公司新品发布会的邀请函，邀请重要客户和媒体参加',
    defaultStyles: ['polite', 'formal'],
    contentLength: { min: 100, max: 250 },
    typicalScenes: ['发布会邀请', '婚礼请柬', '会议邀请', '开业典礼', '晚宴邀请'],
    detailGuide: '用于正式邀请他人参与活动：时间、地点、活动内容、RSVP 信息清晰，措辞礼貌得体。如果需要写发布会上的演讲内容请选「演讲稿件」，如果是发布活动信息告知大家请选「活动通知」。'
  },
  {
    value: 'greeting',
    label: '节日问候',
    emoji: '🎊',
    desc: '春节、中秋、新年祝福',
    placeholder: '例如：给客户发送新年祝福，既要正式又要表达诚意和感谢',
    defaultStyles: ['warm', 'polite'],
    contentLength: { min: 50, max: 150 },
    typicalScenes: ['春节祝福', '新年问候', '中秋祝福', '端午安康', '圣诞快乐'],
    detailGuide: '节日专属的祝福语，简短真诚，适合发给客户、领导、同事、朋友。如果是生日等私人祝福请选「社交文案」。'
  },
  {
    value: 'job',
    label: '求职简历',
    emoji: '📋',
    desc: '自我评价、求职意向',
    placeholder: '例如：应聘产品经理岗位，需要突出自己的项目经验和核心能力',
    defaultStyles: ['professional', 'confident'],
    contentLength: { min: 150, max: 350 },
    typicalScenes: ['自我评价', '求职意向', '个人简介', '简历Summary', '面试准备'],
    detailGuide: '求职场景专属：突出个人能力、项目经验、核心优势，语言正式精炼，适合简历和求职场景。如果是面试时的自我介绍请选「自我介绍」。'
  }
]

interface TypeCategory {
  key: string
  label: string
  emoji: string
  desc: string
  types: string[]
}

const typeCategories: TypeCategory[] = [
  {
    key: 'social_media',
    label: '社交媒体营销',
    emoji: '📱',
    desc: '小红书、朋友圈、品牌推广',
    types: ['xiaohongshu', 'moments', 'product', 'activity', 'slogan']
  },
  {
    key: 'business',
    label: '商务职场办公',
    emoji: '💼',
    desc: '汇报、邮件、演讲、求职',
    types: ['report', 'email', 'speech', 'selfintro', 'job']
  },
  {
    key: 'learning',
    label: '学习成长写作',
    emoji: '📚',
    desc: '读书笔记、作文素材',
    types: ['reading', 'composition']
  },
  {
    key: 'life',
    label: '生活社交日常',
    emoji: '🎉',
    desc: '节日问候、邀请函、社交文案',
    types: ['greeting', 'invitation', 'social']
  }
]

const activeCategory = ref<string>('all')
const showTypeHelpDialog = ref(false)

interface AmbiguousScene {
  scene: string
  emoji: string
  recommend: string
  recommendLabel: string
  alternatives: { type: string; label: string; reason: string }[]
}

const ambiguousScenesHelp: AmbiguousScene[] = [
  {
    scene: '产品发布会',
    emoji: '🚀',
    recommend: 'speech',
    recommendLabel: '演讲稿件',
    alternatives: [
      { type: 'invitation', label: '邀请函件', reason: '如果是写邀请客户/媒体参加发布会的请柬' },
      { type: 'activity', label: '活动通知', reason: '如果是发布活动信息、优惠规则给用户看' },
      { type: 'product', label: '产品描述', reason: '如果是写产品本身的功能、卖点、参数介绍' }
    ]
  },
  {
    scene: '公司年会',
    emoji: '🎊',
    recommend: 'speech',
    recommendLabel: '演讲稿件',
    alternatives: [
      { type: 'social', label: '社交文案', reason: '如果是给同事发朋友圈祝福或感谢语' },
      { type: 'report', label: '工作汇报', reason: '如果是年终总结、年度工作回顾' }
    ]
  },
  {
    scene: '自我介绍',
    emoji: '👋',
    recommend: 'selfintro',
    recommendLabel: '自我介绍',
    alternatives: [
      { type: 'job', label: '求职简历', reason: '如果是写简历上的自我评价、求职意向' },
      { type: 'speech', label: '演讲稿件', reason: '如果是较长的当众发言、入职演讲' }
    ]
  },
  {
    scene: '产品推广',
    emoji: '🛍️',
    recommend: 'xiaohongshu',
    recommendLabel: '小红书种草',
    alternatives: [
      { type: 'moments', label: '朋友圈推广', reason: '如果是发微信朋友圈/社群短文案' },
      { type: 'product', label: '产品描述', reason: '如果是写淘宝/电商详情页产品介绍' },
      { type: 'slogan', label: '品牌标语', reason: '如果是想提炼一句广告口号、品牌 Slogan' }
    ]
  },
  {
    scene: '节日祝福',
    emoji: '🎁',
    recommend: 'greeting',
    recommendLabel: '节日问候',
    alternatives: [
      { type: 'social', label: '社交文案', reason: '如果是生日、纪念日等私人情感祝福' },
      { type: 'speech', label: '演讲稿件', reason: '如果是节日晚会致辞、领导讲话' }
    ]
  },
  {
    scene: '读书分享',
    emoji: '📖',
    recommend: 'reading',
    recommendLabel: '读书笔记',
    alternatives: [
      { type: 'composition', label: '作文素材', reason: '如果是学校作业、议论文写作' },
      { type: 'xiaohongshu', label: '小红书种草', reason: '如果是在社交平台推荐好书' }
    ]
  }
]

const selectTypeFromHelp = (typeValue: string) => {
  activeCategory.value = 'all'
  selectedType.value = typeValue
  showTypeHelpDialog.value = false
}

const filteredTypes = computed(() => {
  if (activeCategory.value === 'all') return copyTypes
  const cat = typeCategories.find(c => c.key === activeCategory.value)
  if (!cat) return copyTypes
  return copyTypes.filter(t => cat.types.includes(t.value))
})

const allStyles = [
  { value: 'professional', label: '专业正式', emoji: '💼' },
  { value: 'warm', label: '温暖走心', emoji: '☀️' },
  { value: 'playful', label: '活泼俏皮', emoji: '😄' },
  { value: 'concise', label: '简洁精炼', emoji: '⚡' },
  { value: 'literary', label: '文艺优雅', emoji: '📖' },
  { value: 'persuasive', label: '说服力强', emoji: '🎯' },
  { value: 'enthusiastic', label: '热情激昂', emoji: '🔥' },
  { value: 'humorous', label: '幽默风趣', emoji: '😂' },
  { value: 'inspiring', label: '励志激励', emoji: '💪' },
  { value: 'polite', label: '礼貌得体', emoji: '🙏' },
  { value: 'sincere', label: '真诚恳切', emoji: '💗' },
  { value: 'confident', label: '自信大气', emoji: '🌟' },
  { value: 'thoughtful', label: '深思熟虑', emoji: '🤔' },
  { value: 'creative', label: '创意新颖', emoji: '💡' },
  { value: 'formal', label: '正式庄重', emoji: '🎩' }
]

const versionOptions = [
  { value: 2, label: '2个', desc: '核心优选版' },
  { value: 3, label: '3个', desc: '覆盖主流风格' },
  { value: 5, label: '5个', desc: '全风格探索' }
]

interface SampleBank {
  [key: string]: QuickSample[]
}

const sampleBank: SampleBank = {
  xiaohongshu: [
    {
      label: '护肤好物',
      type: 'xiaohongshu',
      topic: '最近入手的这款精华液真的太绝了，用了两周肤色明显提亮，毛孔也细腻了',
      keywords: ['提亮肤色', '收缩毛孔', '温和不刺激', '性价比高', '学生党友好'],
      additionalNotes: '要有真实使用感，多加点emoji，语气像闺蜜分享',
      hintStyles: ['warm', 'playful']
    },
    {
      label: '穿搭分享',
      type: 'xiaohongshu',
      topic: '微胖女生夏日穿搭，显瘦10斤不是梦，遮肉又时髦',
      keywords: ['微胖穿搭', '显瘦', '夏日', '遮肉', '平价'],
      additionalNotes: '要亲切有代入感，突出真实测评感',
      hintStyles: ['warm', 'sincere']
    }
  ],
  moments: [
    {
      label: '新店开业',
      type: 'moments',
      topic: '我的好朋友开了一家超有格调的咖啡馆，环境棒、咖啡好喝、拍照超出片',
      keywords: ['新店开业', '环境好', '拍照出片', '限时优惠'],
      additionalNotes: '要自然不刻意，像朋友真心推荐',
      hintStyles: ['warm', 'concise']
    }
  ],
  product: [
    {
      label: '蓝牙耳机',
      type: 'product',
      topic: '一款主打主动降噪和超长续航的真无线蓝牙耳机',
      keywords: ['40dB降噪', '40小时续航', '蓝牙5.3', '佩戴舒适', 'IPX5防水'],
      additionalNotes: '要突出产品卖点，有说服力',
      hintStyles: ['professional', 'persuasive']
    }
  ],
  activity: [
    {
      label: '618促销',
      type: 'activity',
      topic: '618年终大促活动，全场商品特惠',
      keywords: ['5折起', '满300减50', '前1小时额外8折', '限量赠品', '包邮'],
      additionalNotes: '要有紧迫感，突出限时限量',
      hintStyles: ['enthusiastic', 'concise']
    }
  ],
  reading: [
    {
      label: '《原子习惯》',
      type: 'reading',
      topic: '《原子习惯》——如何通过微小改变培养好习惯',
      keywords: ['习惯复利', '1%法则', '环境设计', '身份认同', '四大法则'],
      additionalNotes: '要有个人感悟，不要只是摘抄',
      hintStyles: ['literary', 'thoughtful']
    }
  ],
  selfintro: [
    {
      label: '面试介绍',
      type: 'selfintro',
      topic: '应聘产品经理岗位的自我介绍',
      keywords: ['3年产品经验', '用户增长', '数据驱动', '跨部门协作', '千万级DAU产品'],
      additionalNotes: '要突出核心优势，结构清晰，1分钟左右',
      hintStyles: ['professional', 'confident']
    }
  ],
  report: [
    {
      label: '月度汇报',
      type: 'report',
      topic: '产品部5月份工作汇报',
      keywords: ['新功能上线3个', '用户增长15%', '转化率提升8%', 'BUG率下降40%'],
      additionalNotes: '要数据化呈现，条理清晰，STAR法则',
      hintStyles: ['professional', 'concise']
    }
  ],
  email: [
    {
      label: '会议确认',
      type: 'email',
      topic: '确认下周产品评审会议的时间和议程',
      keywords: ['下周三下午2点', '3号楼会议室A', 'Q3产品规划评审', '请提前准备材料'],
      additionalNotes: '商务邮件格式，清晰明了',
      hintStyles: ['professional', 'polite']
    }
  ],
  social: [
    {
      label: '生日祝福',
      type: 'social',
      topic: '给认识10年的闺蜜写生日祝福',
      keywords: ['10年友谊', '一起成长', '感谢陪伴', '未来可期'],
      additionalNotes: '要走心有温度，体现多年友情',
      hintStyles: ['warm', 'sincere']
    }
  ],
  slogan: [
    {
      label: '咖啡品牌',
      type: 'slogan',
      topic: '为一家主打精品手冲的年轻化咖啡品牌创作Slogan',
      keywords: ['精品', '手冲', '年轻', '品质', '生活方式'],
      additionalNotes: '简洁有力，朗朗上口，有记忆点',
      hintStyles: ['creative', 'concise']
    }
  ],
  speech: [
    {
      label: '年会发言',
      type: 'speech',
      topic: '公司年会上优秀员工代表的发言稿',
      keywords: ['感谢公司', '团队协作', '个人成长', '未来展望'],
      additionalNotes: '真诚感人，有感染力，3-5分钟',
      hintStyles: ['sincere', 'inspiring']
    }
  ],
  composition: [
    {
      label: '坚持主题',
      type: 'composition',
      topic: '以"坚持的力量"为题写一篇议论文',
      keywords: ['滴水穿石', '持之以恒', '量变到质变', '爱迪生', '奥运冠军'],
      additionalNotes: '初中水平，结构清晰，论点明确，有例子',
      hintStyles: ['literary', 'thoughtful']
    }
  ],
  invitation: [
    {
      label: '新品发布',
      type: 'invitation',
      topic: '公司2024夏季新品发布会邀请函',
      keywords: ['6月18日', '北京国际会议中心', '夏季新品', '神秘嘉宾', '精美伴手礼'],
      additionalNotes: '正式邀请函格式，诚恳有吸引力',
      hintStyles: ['polite', 'formal']
    }
  ],
  greeting: [
    {
      label: '新年祝福',
      type: 'greeting',
      topic: '给重要客户的新年祝福短信',
      keywords: ['感谢合作', '新年祝福', '展望未来', '继续携手'],
      additionalNotes: '正式得体，表达诚意，不要太长',
      hintStyles: ['warm', 'polite']
    }
  ],
  job: [
    {
      label: '产品经理',
      type: 'job',
      topic: '产品经理岗位的自我评价',
      keywords: ['用户思维', '数据分析', '项目管理', '沟通协调', '结果导向'],
      additionalNotes: '要具体，用数据说话，突出匹配度',
      hintStyles: ['professional', 'confident']
    }
  ]
}

const selectedType = ref('xiaohongshu')
const topic = ref('')
const keywordsText = ref('')
const additionalNotes = ref('')
const selectedStyles = ref<string[]>([])
const versionCount = ref(3)
const isGenerating = ref(false)
const generatedResults = ref<CopywritingResult[]>([])
const activeVersion = ref(0)
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const currentTypeConfig = computed(() => {
  return copyTypes.find(t => t.value === selectedType.value) || copyTypes[0]
})

const keywordsList = computed(() =>
  keywordsText.value.split('\n').map(k => k.trim()).filter(k => k.length > 0)
)

const currentTypeSamples = computed(() => sampleBank[selectedType.value] || [])

const totalStyleCount = computed(() => allStyles.length)

const availableStyles = computed(() => allStyles)

const currentStep = computed(() => {
  if (generatedResults.value.length > 0 && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (topic.value || keywordsText.value) return 1
  if (selectedType.value) return 0
  return 0
})

const canGenerate = computed(() => topic.value.trim().length > 0)

const currentResult = computed(() => generatedResults.value[activeVersion.value] || null)

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const getTypeLabel = (v: string) => copyTypes.find(t => t.value === v)?.label || v
const getTypeEmoji = (v: string) => copyTypes.find(t => t.value === v)?.emoji || '📝'
const getStyleLabel = (v: string) => allStyles.find(s => s.value === v)?.label || v

const getVersionTagType = (idx: number): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const types: Array<'' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = ['primary', 'success', 'warning', 'danger', 'info']
  return types[idx % types.length]
}

const toggleStyle = (value: string) => {
  const idx = selectedStyles.value.indexOf(value)
  if (idx > -1) {
    selectedStyles.value.splice(idx, 1)
  } else {
    selectedStyles.value.push(value)
  }
}

const truncateText = (text: string, maxLen: number) => {
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen) + '...'
}

const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  if (sameDay) return `今天 ${time}`
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return `昨天 ${time}`
  return `${date.getMonth() + 1}/${date.getDate()} ${time}`
}

const applySample = (sample: QuickSample) => {
  selectedType.value = sample.type
  topic.value = sample.topic
  keywordsText.value = sample.keywords.join('\n')
  additionalNotes.value = sample.additionalNotes
  selectedStyles.value = [...sample.hintStyles]
  ElMessage.success('已载入示例数据')
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const pickMany = <T,>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, arr.length))
}

interface GenerationConfig {
  titles: string[]
  openings: string[]
  transitions: string[]
  endings: string[]
  tips: string[]
  suggestions: string[]
}

const generationTemplates: Record<string, GenerationConfig> = {
  xiaohongshu: {
    titles: [
      '姐妹们！这个{topic}真的绝绝子！',
      '谁懂啊！被这个{topic}狠狠种草了！',
      '宝藏{topic}分享！用了真的回不去！',
      '后悔没早点发现！这个{topic}太香了！',
      '闭眼冲！这个{topic}我要安利给所有人！'
    ],
    openings: [
      '最近入手了{topic}，用了一段时间真心觉得不错，来给姐妹们分享一下～',
      '被闺蜜种草了{topic}，本来抱着试试看的心态，结果直接惊艳到我了！',
      '在小红书上刷到好多人推荐{topic}，终于忍不住入手了，真香警告！'
    ],
    transitions: [
      '最让我惊喜的是，',
      '重点来了！',
      '再说说使用感受，',
      '而且还有一个隐藏buff：'
    ],
    endings: [
      '总的来说，这个价格能有这个效果真的很良心了，学生党也可以放心冲！💕',
      '真心推荐给和我有一样需求的姐妹们，入股不亏！✨',
      '已经回购第二次了，希望我的分享对你们有帮助～有问题评论区见哦！💖'
    ],
    tips: [
      '小红书笔记三要素：吸睛标题emoji+真实使用感受+明确互动引导',
      '开头30字内必须抓住眼球，正文分段清晰，每段不要太长',
      '适当使用emoji增加活泼感，但不要过度，重点话题标签3-5个为宜'
    ],
    suggestions: [
      '建议配上3-6张真实实拍图，首图要有冲击力',
      '发布时间选在晚上8-10点流量高峰，互动率更高',
      '可以在评论区主动回复前10条评论，提升笔记权重'
    ]
  },
  moments: {
    titles: [
      '重磅推荐！{topic}',
      '忍不住要分享的{topic}',
      '发现宝藏！{topic}'
    ],
    openings: [
      '今天必须给大家安利一下{topic}，真心觉得不错～',
      '被朋友种草了{topic}，体验之后觉得必须发个朋友圈推荐！',
      '最近发现一个好东西——{topic}，分享给大家！'
    ],
    transitions: [
      '最打动我的是，',
      '特别想说的是，',
      '还有一点很赞：'
    ],
    endings: [
      '好东西就是要分享，感兴趣的朋友可以了解一下～👍',
      '真心推荐，用过的都说好！😊',
      '有需要的朋友可以私信我，或者自己去了解哦～✨'
    ],
    tips: [
      '朋友圈文案要"软"，不要像硬广，要像朋友分享',
      '配合真实图片或小视频，可信度更高',
      '适当留个钩子，引导评论或私信互动'
    ],
    suggestions: [
      '发布时间建议工作日中午12点或晚上8-10点',
      '可以适当设置"部分可见"精准触达目标人群',
      '有朋友评论要及时回复，增加曝光'
    ]
  },
  product: {
    titles: [
      '{topic} — 重新定义品质体验',
      '为什么选择{topic}？这几个理由告诉你',
      '{topic}：为追求品质的你而生'
    ],
    openings: [
      '在当今市场上，{topic}凭借卓越的品质和出色的用户体验，正在成为越来越多消费者的首选。',
      '今天为大家详细介绍{topic}——一款真正从用户需求出发打造的优质产品。',
      '面对琳琅满目的选择，{topic}是如何脱颖而出的？让我们一探究竟。'
    ],
    transitions: [
      '首先，从核心性能来看，',
      '其次，在用户体验方面，',
      '更值得一提的是，',
      '除此之外，'
    ],
    endings: [
      '综上所述，{topic}无论是在性能、品质还是性价比上都表现出色，是您不容错过的明智之选。',
      '选择{topic}，就是选择品质、选择放心。立即体验，开启全新品质生活。',
      '现在购买还有更多优惠，品质生活从选择{topic}开始。'
    ],
    tips: [
      '产品描述要遵循FAB法则：Feature特性→Advantage优势→Benefit利益',
      '用数据说话，避免空洞的形容词',
      '从用户痛点切入，给出解决方案'
    ],
    suggestions: [
      '配合高清产品图和使用场景图，图文结合更有说服力',
      '可以加入用户真实评价，增强信任感',
      '针对不同渠道（淘宝/京东/拼多多）调整文案风格和长度'
    ]
  },
  activity: {
    titles: [
      '🎉 重磅来袭！{topic}',
      '🔥 {topic}，错过等一年！',
      '⚡ {topic}，限时特惠即刻开启！'
    ],
    openings: [
      '万众期待的{topic}终于来了！这次我们准备了超多惊喜，就等你来！',
      '好消息！{topic}正式启动，全年力度最大的优惠活动，千万别错过！',
      '注意了！{topic}今日开启，多重好礼等你来拿！'
    ],
    transitions: [
      '🔥 第一重惊喜：',
      '💰 第二重福利：',
      '🎁 第三重好礼：',
      '⏰ 特别提醒：'
    ],
    endings: [
      '优惠不等人，好货不等人！赶快行动起来吧👉',
      '数量有限，先到先得！错过这次，再等一年！',
      '活动时间有限，优惠力度空前，赶紧抢购吧！'
    ],
    tips: [
      '活动文案核心三要素：紧迫感+稀缺性+明确利益点',
      '使用感叹号和emoji增加情绪感染力，但不要滥用',
      '优惠信息要醒目，时间和数量限制要清晰'
    ],
    suggestions: [
      '通过倒计时、剩余数量显示等方式强化紧迫感',
      '多渠道同步推送（公众号+社群+朋友圈+短信）',
      '设置前N名额外优惠，刺激即时下单'
    ]
  },
  reading: {
    titles: [
      '《{topic}》读书笔记：改变我的几个核心观点',
      '读完《{topic}》，我想分享这几点感悟',
      '《{topic}》：一本让人受益匪浅的好书'
    ],
    openings: [
      '最近读完了《{topic}》，感触颇深，整理了一些读书笔记和个人感悟，与大家分享。',
      '《{topic}》是一本让我相见恨晚的书，书中的很多观点都刷新了我的认知。',
      '有人说，一本好书可以改变一个人。《{topic}》对我而言，就是这样一本书。'
    ],
    transitions: [
      '书中最打动我的一个观点是：',
      '让我印象深刻的还有：',
      '作者在书中提到的这个方法论特别实用：',
      '读完后我最大的启发是：'
    ],
    endings: [
      '好书值得反复阅读，每读一遍都会有新的收获。强烈推荐给大家！📚',
      '以上就是我读《{topic}》的一些粗浅感悟，欢迎读过的朋友一起交流讨论。',
      '如果你也正在寻找一些启发，不妨翻开这本书，相信你也会有所收获。'
    ],
    tips: [
      '读书笔记≠摘抄，要有自己的思考和感悟',
      '可以采用"原文引用+个人解读+行动清单"的结构',
      '重点不是记多少，而是能用上多少'
    ],
    suggestions: [
      '可以用思维导图梳理书中的核心观点',
      '读完后试着用自己的话复述一遍，检验理解程度',
      '最重要的是：选一个书中的方法，立刻用到实际生活中'
    ]
  },
  selfintro: {
    titles: [
      '你好，我是{topic}',
      '一分钟认识我',
      '关于我'
    ],
    openings: [
      '大家好，我是{topic}。很高兴有这个机会向大家做个自我介绍。',
      '您好！我叫{topic}，非常感谢您抽出时间来了解我。',
      '各位好，{topic}是我的名字，下面简单介绍一下我自己。'
    ],
    transitions: [
      '在专业能力方面，',
      '关于我的工作经历，',
      '除了专业能力，',
      '我认为自己最大的特点是：'
    ],
    endings: [
      '以上就是我的自我介绍，期待能有机会与您进一步交流。谢谢！',
      '我始终相信，合适的人在一起能创造更大的价值。期待与您的合作！',
      '感谢您的聆听，如果您想了解更多，欢迎随时交流。'
    ],
    tips: [
      '自我介绍黄金法则：1分钟版本讲核心优势，3分钟版本讲故事和案例',
      '结构建议：我是谁+我做过什么+我能带来什么价值',
      '用数据和具体案例说话，避免空洞的形容词'
    ],
    suggestions: [
      '面试前准备好1分钟、3分钟、5分钟三个版本',
      '对着镜子练习，注意语速和眼神交流',
      '根据不同场合（面试/社交/入职）调整内容侧重点'
    ]
  },
  report: {
    titles: [
      '{topic}工作汇报',
      '工作汇报 | {topic}',
      '{topic}总结与规划'
    ],
    openings: [
      '现将{topic}情况汇报如下：',
      '各位领导好，下面我将{topic}向大家做简要汇报。',
      '针对{topic}，现将相关情况总结汇报如下。'
    ],
    transitions: [
      '一、核心成果：',
      '二、重点工作完成情况：',
      '三、存在的问题与反思：',
      '四、下一步工作计划：'
    ],
    endings: [
      '以上是本次汇报的全部内容，感谢聆听，请各位领导指正。',
      '下一阶段我们将继续努力，确保各项工作顺利推进。谢谢！',
      '汇报完毕，恳请各位领导提出宝贵意见。'
    ],
    tips: [
      '工作汇报要"结论先行"，先说结果再讲过程',
      '用数据说话，能量化的尽量量化',
      '问题和困难要带着解决方案一起提'
    ],
    suggestions: [
      '周报控制在300字以内，月报500-800字，重点突出',
      '可以使用"重点工作+数据成果+问题反思+下周计划"的模板',
      '重要汇报建议配合PPT，图文并茂'
    ]
  },
  email: {
    titles: [
      '关于{topic}的确认函',
      '{topic}会议安排',
      '回复：{topic}'
    ],
    openings: [
      '您好！',
      '尊敬的XX先生/女士：',
      'Hi，见信好！'
    ],
    transitions: [
      '关于您提到的{topic}，现将相关情况说明如下：',
      '针对本次{topic}，我们计划如下：',
      '为了更好地推进{topic}，现确认以下事项：'
    ],
    endings: [
      '如有任何疑问，请随时与我联系。感谢您的支持与配合！\n\n此致\n敬礼',
      '期待您的回复。如有问题随时沟通。\n\n祝好',
      '以上请知悉，谢谢！\n\nBest regards'
    ],
    tips: [
      '商务邮件"一事一议"，主题明确，正文简洁',
      '重要事项用序号列出，清晰易读',
      '落款要包含姓名、职位、联系方式'
    ],
    suggestions: [
      '重要邮件发送前检查三遍：收件人、附件、内容',
      '紧急事项在标题标注【紧急】，但不要滥用',
      '收到邮件24小时内回复，即使暂时无法解决也要告知已收到'
    ]
  },
  social: {
    titles: [
      '致最好的我们',
      '生日快乐！',
      '写在这个特别的日子'
    ],
    openings: [
      '时间过得真快，一转眼{topic}。',
      '在这个特别的日子里，有些话想对你说。',
      '回想我们相识的这些年，一幕幕画面浮现在眼前。'
    ],
    transitions: [
      '还记得，',
      '最让我感动的是，',
      '谢谢你，'
    ],
    endings: [
      '未来的日子，愿我们继续携手前行，一起变成更好的自己。❤️',
      '愿你被世界温柔以待，愿你的每一天都充满阳光。生日快乐！🎂',
      '千言万语汇成一句话：有你真好。💕'
    ],
    tips: [
      '真情实感最动人，不需要华丽的辞藻',
      '可以加入共同的回忆，更有共鸣',
      '篇幅不用太长，真诚最重要'
    ],
    suggestions: [
      '配上你们的合照，效果翻倍',
      '可以设置对方可见时间，制造惊喜感',
      '重要的日子记得提前准备，不要等到零点临时抱佛脚'
    ]
  },
  slogan: {
    titles: [],
    openings: [],
    transitions: [],
    endings: [],
    tips: [
      '好Slogan三要素：简短好记+突出卖点+情感共鸣',
      '字数控制在4-12个字为宜，太长记不住',
      '可以从功能、情感、身份认同三个角度切入'
    ],
    suggestions: [
      '至少准备10个版本，从中筛选最优',
      '可以做小范围测试，看哪个记忆度最高',
      '注意检查商标注册情况，避免侵权'
    ]
  },
  speech: {
    titles: [
      '在{topic}上的发言',
      '感恩与前行',
      '与大家分享一些心里话'
    ],
    openings: [
      '尊敬的各位领导、各位同事：大家好！',
      '各位来宾、各位朋友：大家下午好！',
      '非常荣幸能有这个机会站在这里，和大家分享一些我的想法。'
    ],
    transitions: [
      '首先，我想表达感谢，',
      '回顾这一路走来，',
      '关于未来，我想说，'
    ],
    endings: [
      '最后，再次感谢大家！让我们一起迎接更美好的明天！谢谢！',
      '我的发言完毕，感谢各位的聆听！',
      '新的征程已经开启，让我们携手并进，共创辉煌！谢谢大家！'
    ],
    tips: [
      '演讲稿"黄金圈"结构：开场抓注意力→主体讲3个要点→结尾升华',
      '开场30秒决定成败，可以用提问、故事、数据切入',
      '多用"我们"而不是"我"，拉近距离'
    ],
    suggestions: [
      '3分钟约600字，5分钟约1000字，控制好时长',
      '提前试讲至少3遍，计时并调整',
      '不要照着稿子念，用关键词提示卡即可'
    ]
  },
  composition: {
    titles: [
      '{topic}——通往成功的必经之路',
      '论{topic}',
      '由{topic}想到的'
    ],
    openings: [
      '古人云："不积跬步，无以至千里；不积小流，无以成江海。"这句话道出了{topic}的真谛。',
      '翻开历史长卷，凡成就大事者，无不具备{topic}的品质。',
      '在我们的生活中，{topic}是一个常说常新的话题。它看似平凡，却蕴含着深刻的人生哲理。'
    ],
    transitions: [
      '首先，{topic}是个人成长的基石。',
      '其次，{topic}是事业成功的阶梯。',
      '然而，真正做到{topic}并不容易。',
      '那么，如何培养{topic}的品质呢？'
    ],
    endings: [
      '朋友，让我们以{topic}为伴，在人生的道路上脚踏实地、持之以恒，相信成功一定在不远处等着我们！',
      '{topic}，不仅仅是两个字，更是一种态度、一种信念、一种人生的智慧。愿我们都能领悟并践行它。',
      '路漫漫其修远兮，吾将上下而求索。让我们带着{topic}的力量，勇敢前行！'
    ],
    tips: [
      '议论文"三段论"结构：提出论点→论证论点（论据+例子）→总结升华',
      '论据要充分：名人名言+历史典故+现实例子',
      '语言要流畅，适当运用排比、比喻等修辞手法'
    ],
    suggestions: [
      '平时多积累素材：名人名言、历史故事、时事热点',
      '写完后多读几遍，修改不通顺的地方',
      '注意卷面整洁，字数符合要求'
    ]
  },
  invitation: {
    titles: [
      '邀请函',
      '诚邀您参加{topic}',
      '诚挚邀请'
    ],
    openings: [
      '尊敬的XX先生/女士：',
      '您好！',
      '致尊敬的XX：'
    ],
    transitions: [
      '我们诚挚地邀请您出席{topic}。',
      '本次活动详情如下：',
      '活动日程安排：'
    ],
    endings: [
      '期待您的莅临！如有任何疑问，请随时与我们联系。\n\n联系人：XXX  电话：XXX',
      '拨冗莅临，不胜荣幸。请于X月X日前回复确认出席情况。\n\n此致\n敬礼',
      '期待与您相见！\n\n顺祝商祺'
    ],
    tips: [
      '邀请函"5W1H"要素要齐全：Who谁举办/What活动/When时间/Where地点/Why主题/How流程',
      '语言正式得体，格式规范',
      '重要活动建议纸质版+电子版同时发送'
    ],
    suggestions: [
      '提前1-2周发送邀请，大型活动提前1个月',
      '发出后3天内确认对方是否收到',
      '活动前1天再次温馨提醒时间地点'
    ]
  },
  greeting: {
    titles: [
      '新年快乐！',
      '节日祝福',
      '致XX的问候'
    ],
    openings: [
      'XX总/先生/女士，新年好！',
      '值此佳节来临之际，',
      '您好！在这辞旧迎新的美好时刻，'
    ],
    transitions: [
      '首先，衷心感谢您过去一年对我们的支持与信任，',
      '回顾过去一年，',
      '展望新的一年，'
    ],
    endings: [
      '祝您及家人新年快乐、身体健康、万事如意！🎉',
      '恭祝节日快乐，阖家幸福！',
      '再次感谢您的支持，期待新的一年继续携手前行！'
    ],
    tips: [
      '节日祝福要"走心"，不要只发模板短信',
      '重要客户建议加上个性化内容，体现用心',
      '发送时间要恰当：不要太早也不要太晚，节日当天上午最佳'
    ],
    suggestions: [
      '客户按重要程度分层发送，A类客户可手写卡片+电话',
      '不要群发短信后再问"收到了吗"，很尴尬',
      '可以配合小红包或小礼品，更显诚意'
    ]
  },
  job: {
    titles: [
      '自我评价',
      '个人优势',
      '关于我'
    ],
    openings: [
      '本人{topic}，具备扎实的专业基础和丰富的实践经验。',
      '作为一名{topic}，我始终保持对行业的热情和对专业的追求。',
      '我是一名{topic}，拥有X年相关工作经验。'
    ],
    transitions: [
      '在专业能力方面，',
      '过往工作中，我主要负责，',
      '我的核心优势在于：'
    ],
    endings: [
      '期待能有机会加入贵公司，为团队创造价值的同时实现个人成长。',
      '我相信，凭借扎实的专业能力和积极的工作态度，我能够快速融入团队并贡献价值。',
      '感谢您阅读我的简历，期待与您进一步交流。'
    ],
    tips: [
      '自我评价不是"自嗨"，要匹配岗位JD（职位描述）',
      '用"动词+数据+结果"的方式描述，例如"主导XX项目，提升效率30%"',
      '控制在200字以内，精炼有力'
    ],
    suggestions: [
      '投递不同公司不同岗位，要针对性修改自我评价',
      '简历一页纸为佳，重点突出与岗位相关的经历',
      '不要写假大空的话，比如"性格开朗、学习能力强"这种谁都会写的'
    ]
  }
}

const generateSingleCopy = (type: string, forceStyle?: string): CopywritingResult => {
  const config = currentTypeConfig.value
  const templates = generationTemplates[type] || generationTemplates.xiaohongshu
  const stylesToUse = selectedStyles.value.length > 0
    ? selectedStyles.value
    : config.defaultStyles
  const style = forceStyle || pick(stylesToUse)
  const styleLabel = getStyleLabel(style)

  const keywords = keywordsList.value
  const topicText = topic.value
  const notes = additionalNotes.value

  let content = ''

  if (type === 'slogan') {
    const sloganTemplates = [
      '{topic}，品质生活之选。',
      '选择{topic}，选择更好的自己。',
      '{topic}——让每一天都更美好。',
      '不只是{topic}，更是一种生活态度。',
      '{topic}，为你而生。',
      '懂{topic}，更懂你。',
      '{topic}，超乎想象。',
      '美好生活，从{topic}开始。',
      '专注{topic}，只为给你最好。',
      '{topic}，值得信赖。'
    ]
    const variants = pickMany(sloganTemplates, 5).map(t =>
      t.replace('{topic}', topicText.length > 10 ? topicText.substring(0, 8) : topicText)
    )
    content = variants.join('\n')
    return {
      content,
      tips: pick(templates.tips),
      suggestion: pick(templates.suggestions),
      style,
      styleLabel
    }
  }

  const title = templates.titles.length > 0
    ? pick(templates.titles).replace('{topic}', topicText.length > 20 ? topicText.substring(0, 18) : topicText)
    : undefined

  const opening = pick(templates.openings).replace('{topic}', topicText)
  const transition = pick(templates.transitions)
  const ending = pick(templates.endings).replace('{topic}', topicText.substring(0, 15))

  let middleContent = ''
  if (keywords.length > 0) {
    const keywordSentences = keywords.map(kw => {
      const stylePhrases: Record<string, string[]> = {
        professional: [`值得关注的是${kw}，`, `${kw}是核心优势，`, `在${kw}方面表现突出，`],
        warm: [`特别喜欢的是它的${kw}，`, `${kw}这点真的很打动我，`, `说到${kw}，体验感超棒，`],
        playful: [`${kw}直接拉满！`, `${kw}这一点我给满分💯，`, `还有${kw}这个宝藏功能，`],
        persuasive: [`${kw}——这正是您所需要的，`, `凭借${kw}，您将获得明显优势，`, `不要小看${kw}，它能带来，`],
        enthusiastic: [`${kw}——太香了！🔥`, `${kw}直接给我冲！`, `${kw}真的绝了！`],
        literary: [`${kw}，如同一抹亮色，`, `在${kw}中品味生活的质感，`, `${kw}，诠释了什么是品质，`],
        concise: [`${kw}。`, `${kw}——直接。`, `核心：${kw}。`],
        default: [`${kw}，`, `特别是${kw}，`, `还有${kw}，`]
      }
      const phrases = stylePhrases[style] || stylePhrases.default
      return pick(phrases)
    })
    middleContent = keywordSentences.join('')
  } else {
    const fillPhrases = [
      '在实际使用中，整体体验超出预期。',
      '综合来看，各方面表现都很出色。',
      '从实际体验来说，完全满足期待。',
      '经过一段时间的使用，感受很深。'
    ]
    middleContent = pick(fillPhrases)
  }

  let notesContent = ''
  if (notes.trim().length > 0) {
    notesContent = `补充说明：${notes}。`
  }

  content = `${opening}\n\n${transition}${middleContent}${notesContent}\n\n${ending}`

  const styleAdjustments: Record<string, (text: string) => string> = {
    playful: (t) => {
      const emojis = ['✨', '💕', '😍', '🎉', '💯', '🔥', '⭐', '💖']
      return t.replace(/。/g, `。${pick(emojis)}`).substring(0, config.contentLength.max)
    },
    enthusiastic: (t) => t.replace(/。/g, '！'),
    concise: (t) => t.split('\n').filter(l => l.trim().length > 10).slice(0, 3).join('\n\n'),
    formal: (t) => t.replace(/[！!]/g, '。').replace(/✨|💕|😍|🎉|💯|🔥|⭐|💖/g, ''),
    default: (t) => t
  }
  const adjustFn = styleAdjustments[style] || styleAdjustments.default
  content = adjustFn(content)

  if (content.length > config.contentLength.max) {
    content = content.substring(0, config.contentLength.max - 3) + '...'
  }

  return {
    title,
    content,
    tips: pick(templates.tips),
    suggestion: pick(templates.suggestions),
    style,
    styleLabel
  }
}

const generateCopy = async () => {
  if (!canGenerate.value) return

  isGenerating.value = true
  generatedResults.value = []
  activeVersion.value = 0

  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500))

  const stylesPool = selectedStyles.value.length > 0
    ? selectedStyles.value
    : currentTypeConfig.value.defaultStyles

  const results: CopywritingResult[] = []
  for (let i = 0; i < versionCount.value; i++) {
    const forceStyle = stylesPool[i % stylesPool.length]
    results.push(generateSingleCopy(selectedType.value, forceStyle))
  }

  generatedResults.value = results
  isGenerating.value = false

  history.value.push({
    type: selectedType.value,
    topic: topic.value,
    keywordsText: keywordsText.value,
    additionalNotes: additionalNotes.value,
    styles: [...selectedStyles.value],
    results,
    time: new Date().toISOString()
  })

  if (history.value.length > 50) {
    history.value = history.value.slice(-50)
  }

  saveHistory()
  ElMessage.success(`已生成 ${results.length} 个文案版本`)
}

const regenerateVersion = () => {
  if (generatedResults.value.length === 0) return
  const newVersion = generateSingleCopy(selectedType.value)
  generatedResults.value[activeVersion.value] = newVersion
  ElMessage.success('已重新生成当前版本')
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

const copyCurrentFull = () => {
  if (!currentResult.value) return
  const parts: string[] = []
  if (currentResult.value.title) parts.push(`【标题】\n${currentResult.value.title}`)
  parts.push(`【文案内容】\n${currentResult.value.content}`)
  if (currentResult.value.tips) parts.push(`【写作要点】\n${currentResult.value.tips}`)
  if (currentResult.value.suggestion) parts.push(`【适用建议】\n${currentResult.value.suggestion}`)
  copyText(parts.join('\n\n'))
}

const copyAllResults = () => {
  if (generatedResults.value.length === 0) return
  const allText = generatedResults.value.map((r, i) => {
    const parts: string[] = [`===== 版本 ${i + 1}（${r.styleLabel}）=====`]
    if (r.title) parts.push(`标题：${r.title}`)
    parts.push(r.content)
    return parts.join('\n')
  }).join('\n\n')
  copyText(allText)
}

const resetAll = () => {
  topic.value = ''
  keywordsText.value = ''
  additionalNotes.value = ''
  selectedStyles.value = []
  versionCount.value = 3
  generatedResults.value = []
  activeVersion.value = 0
  ElMessage.info('已重置所有输入')
}

const saveHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

const loadHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      history.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
}

const clearHistory = () => {
  history.value = []
  saveHistory()
  ElMessage.success('已清空历史记录')
}

const loadFromHistory = (item: HistoryItem) => {
  selectedType.value = item.type
  topic.value = item.topic
  keywordsText.value = item.keywordsText
  additionalNotes.value = item.additionalNotes
  selectedStyles.value = [...item.styles]
  generatedResults.value = item.results
  activeVersion.value = 0
  ElMessage.success('已载入历史记录')
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.copywriting-creator {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.intro-card :deep(.el-card__body) {
  padding: 28px;
}

.intro-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  color: #fff;
}

.intro-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.intro-icon {
  font-size: 56px;
  line-height: 1;
}

.intro-title {
  color: #fff;
  margin: 0 0 8px;
  font-size: 26px;
}

.intro-subtitle {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
}

.intro-badges {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.intro-badges :deep(.el-tag) {
  font-size: 13px;
  padding: 6px 14px;
  height: auto;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.intro-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 8px;
}

.section-label {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-label :deep(.el-icon) {
  font-size: 18px;
}

.audience-tags {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.audience-tag {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 150px;
}

.at-emoji {
  font-size: 28px;
}

.at-name {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.at-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-top: 2px;
}

.scene-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.scene-tags :deep(.el-tag) {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  padding: 6px 14px;
  height: auto;
  font-size: 13px;
}

.type-overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.type-overview-card {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 14px;
  backdrop-filter: blur(10px);
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.toc-emoji {
  font-size: 20px;
}

.toc-label {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  flex: 1;
}

.toc-header :deep(.el-tag) {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
}

.toc-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-bottom: 10px;
  line-height: 1.5;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toc-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.95);
  font-size: 12px;
}

.toc-item-emoji {
  font-size: 14px;
  width: 18px;
  text-align: center;
}

.toc-item-name {
  flex: 1;
}

.custom-hint-section {
  margin-top: 4px;
}

.custom-hint-box {
  background: linear-gradient(135deg, rgba(255, 251, 230, 0.95) 0%, rgba(254, 240, 214, 0.95) 100%);
  border: 1px solid rgba(230, 162, 60, 0.3);
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.ch-left {
  display: flex;
  gap: 14px;
  flex: 1;
}

.ch-icon {
  font-size: 36px;
  line-height: 1;
  flex-shrink: 0;
}

.ch-texts {
  flex: 1;
}

.ch-title {
  font-size: 15px;
  font-weight: 600;
  color: #92601a;
  margin-bottom: 6px;
}

.ch-desc {
  font-size: 13px;
  color: #7a5418;
  line-height: 1.7;
}

.ch-desc strong {
  color: #e6a23c;
}

.ch-right {
  flex-shrink: 0;
  max-width: 340px;
}

.ch-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.ch-example-label {
  font-size: 12px;
  color: #92601a;
  font-weight: 500;
  width: 100%;
  margin-bottom: 4px;
}

.ch-examples :deep(.el-tag) {
  background: rgba(230, 162, 60, 0.15);
  border: 1px solid rgba(230, 162, 60, 0.3);
  color: #92601a;
}

.type-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
  padding: 12px 14px;
  background: #f5f7fa;
  border-radius: 10px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #fff;
  border: 1.5px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  color: #606266;
  user-select: none;
}

.filter-chip:hover {
  border-color: #409eff;
  color: #409eff;
}

.filter-chip.active {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border-color: #409eff;
  color: #fff;
}

.filter-chip.active :deep(.el-tag) {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
}

.filter-chip :deep(.el-tag) {
  font-size: 11px;
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
}

.guide-steps {
  margin-bottom: 8px;
}

.expectation-title {
  margin: 0 0 16px;
  color: #303133;
  font-size: 16px;
}

.expectation-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.expectation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 10px;
}

.exp-num {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.exp-label {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.type-section,
.input-section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.required-tag {
  color: #f56c6c;
  font-size: 14px;
}

.hint-tag {
  margin-left: 10px;
  font-weight: normal;
}

.type-options {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.type-card {
  border: 2px solid #e4e7ed;
  border-radius: 10px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
  background: #fff;
}

.type-card:hover:not(.disabled) {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.type-card.active {
  border-color: #409eff;
  background: linear-gradient(135deg, #ecf5ff 0%, #e1f3d8 100%);
}

.type-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.type-emoji {
  font-size: 28px;
  margin-bottom: 6px;
}

.type-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.type-desc {
  font-size: 11px;
  color: #909399;
  line-height: 1.4;
}

.type-scenes {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.type-scenes :deep(.el-tag) {
  font-size: 10px;
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
  background: rgba(64, 158, 255, 0.08);
  border: none;
  color: #409eff;
}

.help-btn {
  margin-left: auto;
  font-size: 13px;
}

.type-tooltip {
  max-width: 320px;
  padding: 4px 2px;
}

.tt-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.tt-section {
  margin-bottom: 8px;
}

.tt-label {
  font-size: 12px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 4px;
}

.tt-text {
  font-size: 12px;
  color: #606266;
  line-height: 1.7;
}

.tt-scenes {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tt-scenes :deep(.el-tag) {
  font-size: 11px;
}

.ch-help-btn {
  margin-top: 10px;
}

.help-dialog-content {
  padding: 4px 8px;
}

.help-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #fdf6ec;
  border-radius: 8px;
  margin-bottom: 18px;
  font-size: 13px;
  color: #92601a;
}

.help-scene-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.help-scene-item {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 14px 16px;
  transition: all 0.2s;
}

.help-scene-item:hover {
  border-color: #409eff;
  background: #f5faff;
}

.hs-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.hs-emoji {
  font-size: 22px;
}

.hs-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.hs-recommend {
  cursor: pointer;
  font-size: 12px;
  padding: 4px 10px;
  height: auto;
}

.hs-alternatives {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 4px;
}

.hs-alt-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.hs-alt-item:hover {
  background: #ecf5ff;
}

.hs-alt-reason {
  font-size: 12px;
  color: #909399;
}

.help-footer-note {
  font-size: 13px;
  color: #606266;
  line-height: 1.7;
}

.help-footer-note strong {
  color: #e6a23c;
}

.quick-samples {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.sample-label {
  font-size: 13px;
  color: #606266;
  margin-right: 4px;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.sample-tag:hover {
  transform: translateY(-1px);
}

.two-col-section {
  display: flex;
  gap: 24px;
}

.flex-1 {
  flex: 1;
}

.style-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.style-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1.5px solid #e4e7ed;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  font-size: 13px;
}

.style-chip:hover:not(.disabled) {
  border-color: #409eff;
  background: #ecf5ff;
}

.style-chip.active {
  border-color: #409eff;
  background: #409eff;
  color: #fff;
}

.style-chip.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.style-emoji {
  font-size: 15px;
}

.style-tip {
  margin-top: 8px;
}

.version-options {
  display: flex;
  gap: 12px;
}

.version-card {
  flex: 1;
  border: 2px solid #e4e7ed;
  border-radius: 10px;
  padding: 14px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
  background: #fff;
}

.version-card:hover:not(.disabled) {
  border-color: #409eff;
  transform: translateY(-2px);
}

.version-card.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.version-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.version-num {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
}

.version-label {
  font-size: 13px;
  color: #606266;
  margin: 6px 0 2px;
}

.version-desc {
  font-size: 11px;
  color: #909399;
}

.action-section {
  display: flex;
  gap: 16px;
  margin-top: 28px;
}

.generate-btn {
  min-width: 220px;
}

.btn-loading-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.generating-status {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(90deg, #ecf5ff 0%, #fdf6ec 100%);
  border-radius: 10px;
  font-size: 14px;
  color: #606266;
}

.generating-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #409eff;
  animation: pulse 1.4s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.version-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 12px;
}

.version-tab {
  padding: 8px 18px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
  background: #f5f7fa;
}

.version-tab:hover {
  background: #ecf5ff;
  color: #409eff;
}

.version-tab.active {
  background: #409eff;
  color: #fff;
}

.result-section {
  margin-bottom: 20px;
}

.section-title-sm {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.section-title-sm :deep(.el-button) {
  margin-left: auto;
}

.result-content-text,
.result-title-text {
  background: #f8f9fb;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px 18px;
  line-height: 1.8;
  font-size: 14px;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-word;
}

.result-tips-text,
.result-suggestion-text {
  background: #fdf6ec;
  border-left: 4px solid #e6a23c;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  line-height: 1.7;
}

.result-suggestion-text {
  background: #f4f4f5;
  border-left-color: #909399;
}

.result-footer {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px dashed #ebeef5;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  background: #ecf5ff;
  transform: translateX(4px);
}

.history-time {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
  min-width: 80px;
}

.history-topic {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.history-text {
  font-size: 13px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-meta {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.history-footer {
  text-align: center;
  margin-top: 12px;
}

@media (max-width: 900px) {
  .type-options {
    grid-template-columns: repeat(3, 1fr);
  }
  .expectation-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .two-col-section {
    flex-direction: column;
  }
  .audience-tags {
    flex-direction: column;
  }
  .type-overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .custom-hint-box {
    flex-direction: column;
    gap: 14px;
  }
  .ch-right {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .type-options {
    grid-template-columns: repeat(2, 1fr);
  }
  .expectation-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  .type-overview-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  .intro-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .intro-badges {
    flex-wrap: wrap;
  }
  .filter-chip {
    font-size: 12px;
    padding: 5px 10px;
  }
}
</style>