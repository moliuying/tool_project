<template>
  <div class="official-document-writer">
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
        <el-step title="选择公文类型" description="8大公文类型一键选择" />
        <el-step title="填写核心信息" description="主题、单位、内容要点" />
        <el-step title="AI智能生成" description="规范格式一键输出" />
        <el-step title="复制导出使用" description="直接复制或下载使用" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📜 遵循标准规范</h4>
        <el-alert
          type="success"
          :closable="false"
          show-icon
          class="standard-alert"
        >
          <template #title>
            <span class="alert-title">输出严格遵循：<b>GB/T 9704-2012《党政机关公文格式》</b> 国家标准，及《党政机关公文处理工作条例》（中办发〔2012〕14号）相关规定</span>
          </template>
          <div class="standard-content">
            <div class="standard-item">
              <el-icon color="#67c23a"><CircleCheck /></el-icon>
              <span>标题格式：发文机关 + 事由 + 文种</span>
            </div>
            <div class="standard-item">
              <el-icon color="#67c23a"><CircleCheck /></el-icon>
              <span>正文结构：导语 + 分条列项 + 结语套语</span>
            </div>
            <div class="standard-item">
              <el-icon color="#67c23a"><CircleCheck /></el-icon>
              <span>落款规范：发文机关署名 + 成文日期</span>
            </div>
            <div class="standard-item">
              <el-icon color="#67c23a"><CircleCheck /></el-icon>
              <span>语言风格：庄重、准确、朴实、精炼、严谨、规范</span>
            </div>
          </div>
        </el-alert>

        <el-divider />

        <h4 class="expectation-title">📋 支持的公文类型（共 8 种）</h4>
        <div class="doctype-table">
          <div class="doctype-row doctype-header">
            <div class="doctype-col">类型</div>
            <div class="doctype-col">适用场景</div>
            <div class="doctype-col">典型用例</div>
          </div>
          <div class="doctype-row">
            <div class="doctype-col doctype-name">📢 通知</div>
            <div class="doctype-col">发布事项、传达要求、任免人员</div>
            <div class="doctype-col">会议通知、放假通知、工作部署</div>
          </div>
          <div class="doctype-row">
            <div class="doctype-col doctype-name">📊 报告</div>
            <div class="doctype-col">向上级汇报工作、反映情况</div>
            <div class="doctype-col">工作报告、调研报告、情况报告</div>
          </div>
          <div class="doctype-row">
            <div class="doctype-col doctype-name">🙏 请示</div>
            <div class="doctype-col">向上级请求指示、批准事项</div>
            <div class="doctype-col">经费申请、项目立项、人事请示</div>
          </div>
          <div class="doctype-row">
            <div class="doctype-col doctype-name">✉️ 函</div>
            <div class="doctype-col">不相隶属单位间商洽、询问、答复</div>
            <div class="doctype-col">商务公函、合作邀请、事项咨询</div>
          </div>
          <div class="doctype-row">
            <div class="doctype-col doctype-name">📜 决定</div>
            <div class="doctype-col">重要决策、奖惩、重大事项变更</div>
            <div class="doctype-col">表彰决定、处分决定、机构调整</div>
          </div>
          <div class="doctype-row">
            <div class="doctype-col doctype-name">💡 意见</div>
            <div class="doctype-col">对工作提出见解、处理办法</div>
            <div class="doctype-col">实施意见、指导意见、工作建议</div>
          </div>
          <div class="doctype-row">
            <div class="doctype-col doctype-name">📋 工作总结</div>
            <div class="doctype-col">回顾总结、分析经验、计划安排</div>
            <div class="doctype-col">年度总结、季度总结、专项总结</div>
          </div>
          <div class="doctype-row">
            <div class="doctype-col doctype-name">📣 公告</div>
            <div class="doctype-col">向社会公布重要或法定事项</div>
            <div class="doctype-col">活动公告、公示、通告</div>
          </div>
        </div>

        <el-divider />

        <h4 class="expectation-title">🎯 适用对象与范围</h4>
        <div class="scope-grid">
          <div class="scope-card">
            <el-icon :size="28" color="#165DFF"><OfficeBuilding /></el-icon>
            <div class="scope-title">党政机关</div>
            <div class="scope-desc">各级党委、政府及其组成部门</div>
          </div>
          <div class="scope-card">
            <el-icon :size="28" color="#67c23a"><School /></el-icon>
            <div class="scope-title">事业单位</div>
            <div class="scope-desc">学校、医院、科研院所等</div>
          </div>
          <div class="scope-card">
            <el-icon :size="28" color="#e6a23c"><Briefcase /></el-icon>
            <div class="scope-title">国有企业</div>
            <div class="scope-desc">央企、国企及所属单位</div>
          </div>
          <div class="scope-card">
            <el-icon :size="28" color="#722ed1"><User /></el-icon>
            <div class="scope-title">社会团体</div>
            <div class="scope-desc">人民团体、社会组织、行业协会</div>
          </div>
        </div>
        <el-alert
          type="info"
          :closable="false"
          show-icon
          class="scope-hint"
        >
          <span>本工具输出格式参照中国大陆党政机关公文标准，适用于中国境内正式公文起草参考。如为企业内部非正式行文，可直接使用生成内容作为基础后按需调整。</span>
        </el-alert>

        <el-divider />

        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Document /></el-icon>
            <div class="exp-text">
              <div class="exp-num">8 大公文类型</div>
              <div class="exp-label">通知/报告/请示/函等全覆盖</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">规范化格式</div>
              <div class="exp-label">严格遵循党政机关公文标准</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Collection /></el-icon>
            <div class="exp-text">
              <div class="exp-num">完整要素</div>
              <div class="exp-label">标题/主送/正文/落款齐全</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Grid /></el-icon>
            <div class="exp-text">
              <div class="exp-num">3 种详略程度</div>
              <div class="exp-label">简洁版/标准版/详细版可选</div>
            </div>
          </div>
        </div>
        <el-divider />
        <h4 class="expectation-title">🎯 典型使用场景</h4>
        <div class="scenario-tags">
          <el-tag type="primary" size="large" effect="plain">🏢 机关单位发文</el-tag>
          <el-tag type="success" size="large" effect="plain">📋 行政办公起草</el-tag>
          <el-tag type="warning" size="large" effect="plain">🏛️ 政务工作材料</el-tag>
          <el-tag type="danger" size="large" effect="plain">📊 工作报告撰写</el-tag>
          <el-tag type="info" size="large" effect="plain">💼 企业商务公函</el-tag>
        </div>
      </div>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Edit />
          </el-icon>
          <span>AI 公文写作生成</span>
          <el-tag size="small" type="primary">规范格式 · 一键生成</el-tag>
        </div>
      </template>

      <div class="form-section">
        <div class="section-title">
          <el-icon><Menu /></el-icon>
          <span>公文类型</span>
          <span class="required-tag">*</span>
          <el-tag size="small" type="info" class="hint-tag">
            不同类型的公文格式、语气、结构均不同
          </el-tag>
        </div>
        <div class="type-options">
          <div
            v-for="type in docTypes"
            :key="type.value"
            class="type-card"
            :class="{ active: formData.docType === type.value, disabled: isGenerating }"
            @click="!isGenerating && (formData.docType = type.value)"
          >
            <div class="type-emoji">{{ type.emoji }}</div>
            <div class="type-name">{{ type.label }}</div>
            <div class="type-desc">{{ type.desc }}</div>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="form-section">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          <span>基本信息</span>
        </div>
        <el-form :model="formData" label-width="100px" class="basic-form">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="公文主题" required>
                <el-input
                  v-model="formData.topic"
                  :placeholder="getTopicPlaceholder()"
                  :disabled="isGenerating"
                  maxlength="80"
                  show-word-limit
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发文单位" required>
                <el-input
                  v-model="formData.issuingUnit"
                  placeholder="例如：XX市人民政府办公厅、XX公司行政部"
                  :disabled="isGenerating"
                  maxlength="60"
                  show-word-limit
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="主送单位">
                <el-input
                  v-model="formData.recipientUnit"
                  :placeholder="getRecipientPlaceholder()"
                  :disabled="isGenerating"
                  maxlength="100"
                  show-word-limit
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="抄送单位">
                <el-input
                  v-model="formData.ccUnit"
                  placeholder="可选，多个单位用顿号分隔"
                  :disabled="isGenerating"
                  maxlength="100"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="成文日期">
                <el-date-picker
                  v-model="formData.issueDate"
                  type="date"
                  placeholder="选择日期，默认今天"
                  :disabled="isGenerating"
                  style="width: 100%"
                  format="YYYY年M月D日"
                  value-format="YYYY年M月D日"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发文字号">
                <el-input
                  v-model="formData.docNumber"
                  placeholder="可选，例如：X政发〔2024〕1号"
                  :disabled="isGenerating"
                  maxlength="40"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="quick-samples">
          <span class="sample-label">📝 快速体验：</span>
          <el-tag
            v-for="(sample, i) in quickSamples"
            :key="i"
            class="sample-tag"
            effect="plain"
            @click="applySample(sample)"
          >
            {{ sample.label }}
          </el-tag>
        </div>
      </div>

      <el-divider />

      <div class="form-section">
        <div class="section-title">
          <el-icon><Collection /></el-icon>
          <span>核心内容要点</span>
          <span class="required-tag">*</span>
          <el-tag size="small" type="info">
            每行一个要点，建议 3-8 条
          </el-tag>
        </div>
        <el-input
          v-model="formData.keyPoints"
          type="textarea"
          :rows="6"
          :placeholder="getKeyPointsPlaceholder()"
          :disabled="isGenerating"
          resize="vertical"
        />
      </div>

      <el-divider />

      <div class="form-section">
        <div class="section-title">
          <el-icon><Setting /></el-icon>
          <span>生成偏好</span>
        </div>
        <div class="preference-options">
          <div class="preference-group">
            <span class="preference-label">详略程度：</span>
            <el-radio-group v-model="formData.detailLevel" :disabled="isGenerating">
              <el-radio-button v-for="level in detailLevels" :key="level.value" :value="level.value">
                {{ level.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="preference-group">
            <span class="preference-label">语气风格：</span>
            <el-radio-group v-model="formData.toneStyle" :disabled="isGenerating">
              <el-radio-button v-for="tone in toneStyles" :key="tone.value" :value="tone.value">
                {{ tone.label }}
              </el-radio-button>
            </el-radio-group>
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
          @click="generateDocument"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 正在根据《党政机关公文格式》标准为您生成{{ getDocTypeLabel(formData.docType) }}…
            </span>
          </template>
          生成公文
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
          📋 正在按照 GB/T 9704-2012《党政机关公文格式》国家标准生成{{ getDocTypeLabel(formData.docType) }}文稿…
        </span>
      </div>
    </el-card>

    <el-card v-if="generatedDoc" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>公文生成结果</span>
          <el-tag size="small" type="success">
            {{ getDocTypeLabel(generatedDoc.meta.docType) }}
          </el-tag>
          <el-tag size="small" :type="getDetailLevelTagType(generatedDoc.meta.detailLevel)">
            {{ getDetailLevelLabel(generatedDoc.meta.detailLevel) }}
          </el-tag>
          <div class="header-actions">
            <el-button size="small" type="primary" link :icon="CopyDocument" @click="copyAllDocument">
              复制全文
            </el-button>
            <el-button size="small" type="success" link :icon="Download" @click="downloadDocument">
              下载为 TXT
            </el-button>
          </div>
        </div>
      </template>

      <div class="document-preview">
        <div class="doc-paper">
          <div v-if="generatedDoc.content.docNumber" class="doc-number">
            {{ generatedDoc.content.docNumber }}
          </div>

          <div class="doc-title">
            {{ generatedDoc.content.title }}
          </div>

          <div v-if="generatedDoc.content.recipientUnit" class="doc-recipient">
            {{ generatedDoc.content.recipientUnit }}：
          </div>

          <div class="doc-body">
            <p v-for="(para, idx) in generatedDoc.content.body" :key="idx" class="doc-paragraph">
              {{ para }}
            </p>
          </div>

          <div v-if="generatedDoc.content.attachment" class="doc-attachment">
            附件：{{ generatedDoc.content.attachment }}
          </div>

          <div class="doc-sign-area">
            <div class="doc-signing-unit">
              {{ generatedDoc.content.issuingUnit }}
            </div>
            <div class="doc-signing-date">
              {{ generatedDoc.content.issueDate }}
            </div>
          </div>

          <div v-if="generatedDoc.content.ccUnit" class="doc-cc">
            抄送：{{ generatedDoc.content.ccUnit }}
          </div>
        </div>
      </div>

      <el-divider />

      <div class="result-meta">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="公文类型">
            {{ getDocTypeLabel(generatedDoc.meta.docType) }}
          </el-descriptions-item>
          <el-descriptions-item label="详略程度">
            {{ getDetailLevelLabel(generatedDoc.meta.detailLevel) }}
          </el-descriptions-item>
          <el-descriptions-item label="语气风格">
            {{ getToneStyleLabel(generatedDoc.meta.toneStyle) }}
          </el-descriptions-item>
          <el-descriptions-item label="发文单位">{{ generatedDoc.meta.issuingUnit }}</el-descriptions-item>
          <el-descriptions-item label="字数">
            {{ getTotalChars() }} 字
          </el-descriptions-item>
          <el-descriptions-item label="生成时间">
            {{ formatTime(generatedDoc.meta.generatedAt) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="result-footer-actions">
        <el-button type="primary" :icon="MagicStick" @click="regenerate">
          重新生成
        </el-button>
        <el-button :icon="CopyDocument" @click="copyAllDocument">
          复制全文
        </el-button>
        <el-button type="success" :icon="Download" @click="downloadDocument">
          下载文件
        </el-button>
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
          <div class="history-time">{{ formatTime(item.meta.generatedAt) }}</div>
          <div class="history-topic">
            <el-tag size="small" type="primary">{{ getDocTypeLabel(item.meta.docType) }}</el-tag>
            <span class="history-text">{{ item.meta.topic }}</span>
          </div>
        </div>
      </div>
      <div v-if="history.length > 10" class="history-footer">
        <el-button text size="small" @click="showAllHistory = !showAllHistory">
          {{ showAllHistory ? '收起' : `查看全部 ${history.length} 条记录` }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Edit,
  EditPen,
  Menu,
  Collection,
  Setting,
  MagicStick,
  Refresh,
  Loading,
  Finished,
  CopyDocument,
  Download,
  Clock,
  InfoFilled,
  Document,
  Grid,
  CircleCheck,
  OfficeBuilding,
  School,
  User,
  Briefcase
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface FormData {
  docType: string
  topic: string
  issuingUnit: string
  recipientUnit: string
  ccUnit: string
  issueDate: string
  docNumber: string
  keyPoints: string
  detailLevel: string
  toneStyle: string
}

interface DocContent {
  docNumber: string
  title: string
  recipientUnit: string
  body: string[]
  attachment: string
  issuingUnit: string
  issueDate: string
  ccUnit: string
}

interface GeneratedDoc {
  content: DocContent
  meta: {
    docType: string
    topic: string
    issuingUnit: string
    detailLevel: string
    toneStyle: string
    generatedAt: string
  }
}

interface HistoryItem {
  content: DocContent
  meta: GeneratedDoc['meta']
  formData: FormData
}

interface QuickSample {
  label: string
  docType: string
  topic: string
  issuingUnit: string
  recipientUnit: string
  keyPoints: string[]
}

const STORAGE_KEY = 'official_document_history'

const docTypes = [
  { value: 'notice', label: '通知', emoji: '📢', desc: '发布事项、传达要求' },
  { value: 'report', label: '报告', emoji: '📊', desc: '汇报工作、反映情况' },
  { value: 'request', label: '请示', emoji: '🙏', desc: '请求指示、批准事项' },
  { value: 'letter', label: '函', emoji: '✉️', desc: '商洽工作、询问答复' },
  { value: 'decision', label: '决定', emoji: '📜', desc: '重要决策、奖惩任免' },
  { value: 'opinion', label: '意见', emoji: '💡', desc: '提出见解、处理办法' },
  { value: 'summary', label: '工作总结', emoji: '📋', desc: '回顾总结、计划安排' },
  { value: 'announcement', label: '公告', emoji: '📣', desc: '重要事项、法定事项' }
]

const detailLevels = [
  { value: 'brief', label: '简洁版' },
  { value: 'standard', label: '标准版' },
  { value: 'detailed', label: '详细版' }
]

const toneStyles = [
  { value: 'formal', label: '正式规范' },
  { value: 'serious', label: '严肃庄重' },
  { value: 'concise', label: '简明扼要' },
  { value: 'flexible', label: '平和务实' }
]

const quickSamples: QuickSample[] = [
  {
    label: '年度工作会议通知',
    docType: 'notice',
    topic: '关于召开2024年度工作总结会议的通知',
    issuingUnit: 'XX公司综合办公室',
    recipientUnit: '各部门、各分公司',
    keyPoints: [
      '会议时间：2024年12月25日上午9:00-12:00',
      '会议地点：公司总部三楼大会议室',
      '参会人员：部门负责人以上管理人员',
      '会议内容：总结2024年工作，部署2025年任务',
      '请各部门准备年度工作总结材料，于12月20日前报送综合办公室'
    ]
  },
  {
    label: '经费请示',
    docType: 'request',
    topic: '关于申请专项工作经费的请示',
    issuingUnit: 'XX市文化和旅游局',
    recipientUnit: 'XX市财政局',
    keyPoints: [
      '为举办"XX市第四届文化艺术节"活动，特申请专项经费',
      '活动将于2024年10月至12月期间举办，预计参与群众5万人次',
      '申请经费总额：人民币80万元',
      '经费主要用于：场地租赁、舞台搭建、宣传推广、嘉宾接待',
      '我局将严格按照相关规定管理使用经费，专款专用'
    ]
  },
  {
    label: '季度工作报告',
    docType: 'report',
    topic: '关于2024年第三季度工作情况的报告',
    issuingUnit: 'XX区发展和改革委员会',
    recipientUnit: 'XX区人民政府',
    keyPoints: [
      '第三季度经济运行总体平稳，GDP同比增长6.2%',
      '重点项目建设进展顺利，15个市级重点项目全部开工',
      '招商引资成效显著，新签约项目23个，投资额128亿元',
      '存在问题：部分企业经营压力较大，消费市场恢复较慢',
      '下一步工作：加强企业服务，扩大有效投资，促进消费回升'
    ]
  },
  {
    label: '商务合作公函',
    docType: 'letter',
    topic: '关于商洽战略合作事宜的函',
    issuingUnit: 'XX科技有限公司',
    recipientUnit: 'XX大学计算机学院',
    keyPoints: [
      '贵院在人工智能领域具有深厚的研究基础和人才优势',
      '我司希望与贵院建立产学研合作关系',
      '合作内容包括：人才培养、技术研发、成果转化',
      '拟共建"AI联合实验室"，开展前沿技术研究',
      '如蒙同意，我司将安排专人与贵院进一步磋商'
    ]
  }
]

const formData = ref<FormData>({
  docType: 'notice',
  topic: '',
  issuingUnit: '',
  recipientUnit: '',
  ccUnit: '',
  issueDate: '',
  docNumber: '',
  keyPoints: '',
  detailLevel: 'standard',
  toneStyle: 'formal'
})

const isGenerating = ref(false)
const generatedDoc = ref<GeneratedDoc | null>(null)
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const currentStep = computed(() => {
  if (generatedDoc.value && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (formData.value.topic || formData.value.issuingUnit) return 1
  return 0
})

const canGenerate = computed(() => {
  return (
    formData.value.topic.trim().length > 0 &&
    formData.value.issuingUnit.trim().length > 0 &&
    formData.value.keyPoints.trim().length > 0
  )
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  if (showAllHistory.value) return reversed
  return reversed.slice(0, 10)
})

const getDocTypeLabel = (value: string) => {
  const found = docTypes.find(d => d.value === value)
  return found?.label || value
}

const getDetailLevelLabel = (value: string) => {
  const found = detailLevels.find(d => d.value === value)
  return found?.label || value
}

const getToneStyleLabel = (value: string) => {
  const found = toneStyles.find(t => t.value === value)
  return found?.label || value
}

const getDetailLevelTagType = (value: string): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  if (value === 'brief') return 'info'
  if (value === 'standard') return 'primary'
  if (value === 'detailed') return 'success'
  return ''
}

const getTopicPlaceholder = () => {
  const placeholders: Record<string, string> = {
    notice: '例如：关于开展年度安全生产检查的通知',
    report: '例如：关于2024年上半年工作情况的报告',
    request: '例如：关于申请项目建设经费的请示',
    letter: '例如：关于商洽业务合作事宜的函',
    decision: '例如：关于表彰先进集体和先进个人的决定',
    opinion: '例如：关于加强人才队伍建设的实施意见',
    summary: '例如：2024年度工作总结及2025年工作计划',
    announcement: '例如：关于举办XX活动的公告'
  }
  return placeholders[formData.value.docType] || '请输入公文主题'
}

const getRecipientPlaceholder = () => {
  const placeholders: Record<string, string> = {
    notice: '例如：各部门、各下属单位',
    report: '例如：XX市政府、XX省主管部门',
    request: '例如：XX市财政局、XX省发展改革委',
    letter: '例如：XX公司、XX大学教务处',
    decision: '例如：全体员工、各单位',
    opinion: '例如：各相关部门、各区县分局',
    summary: '例如：公司领导、董事会',
    announcement: '例如：社会各界、广大市民'
  }
  return placeholders[formData.value.docType] || '请输入主送单位，多个用顿号分隔'
}

const getKeyPointsPlaceholder = () => {
  const placeholders: Record<string, string> = {
    notice: '请列出通知事项要点，每行一条。例如：\n检查时间：2024年X月X日-X月X日\n检查范围：公司各部门及下属单位\n检查内容：安全生产责任制落实情况\n请各单位做好自查自纠，于X月X日前完成整改',
    report: '请列出报告要点，每行一条。例如：\n工作完成情况概述\n主要做法和成效\n存在的问题和不足\n下一步工作计划和建议',
    request: '请列出请示事项要点，每行一条。例如：\n申请事项的背景和原因\n具体申请内容（经费/项目/人员等）\n实施方案和预期效果\n请领导批示',
    letter: '请列出函件要点，每行一条。例如：\n致函事由说明\n合作/商洽的具体事项\n希望对方予以协助的内容\n期待回复，保持联系',
    decision: '请列出决定要点，每行一条。例如：\n决定事项的背景\n决定的具体内容\n相关要求和安排\n执行时间和责任部门',
    opinion: '请列出意见要点，每行一条。例如：\n工作的重要性和必要性\n总体要求和基本原则\n重点任务和具体措施\n组织保障和工作要求',
    summary: '请列出总结要点，每行一条。例如：\n主要工作成绩\n工作中的亮点和创新\n存在的问题和不足\n下一年度工作计划',
    announcement: '请列出公告要点，每行一条。例如：\n发布公告的背景和依据\n公告事项的具体内容\n公众需要注意的事项\n联系方式和咨询渠道'
  }
  return placeholders[formData.value.docType] || '请输入核心内容要点，每行一条'
}

const applySample = (sample: QuickSample) => {
  formData.value.docType = sample.docType
  formData.value.topic = sample.topic
  formData.value.issuingUnit = sample.issuingUnit
  formData.value.recipientUnit = sample.recipientUnit
  formData.value.keyPoints = sample.keyPoints.join('\n')
  const d = new Date()
  formData.value.issueDate = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const getKeyPointsArray = (): string[] => {
  return formData.value.keyPoints
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0)
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const generateTitle = (docType: string, topic: string, issuingUnit: string): string => {
  const label = getDocTypeLabel(docType)

  if (docType === 'summary') {
    if (issuingUnit && !topic.startsWith(issuingUnit)) {
      return `${issuingUnit}${topic}`
    }
    return topic
  }

  if (topic.startsWith('关于') && topic.endsWith('的' + label)) {
    if (issuingUnit && !topic.startsWith(issuingUnit)) {
      return `${issuingUnit}${topic}`
    }
    return topic
  }

  let result = topic
  if (!result.includes('关于')) {
    result = `关于${result}`
  }
  if (!result.endsWith('的' + label)) {
    result = `${result}的${label}`
  }
  if (issuingUnit && !result.startsWith(issuingUnit)) {
    result = `${issuingUnit}${result}`
  }
  return result
}

const generateBodyParagraphs = (
  docType: string,
  topic: string,
  keyPoints: string[],
  detailLevel: string,
  toneStyle: string
): string[] => {
  const paragraphs: string[] = []
  const label = getDocTypeLabel(docType)
  const isBrief = detailLevel === 'brief'
  const isDetailed = detailLevel === 'detailed'

  const toneOpeners: Record<string, string[]> = {
    notice: [
      '为认真贯彻落实上级有关文件精神，进一步做好相关工作，现就有关事项通知如下：',
      '根据工作安排，经研究决定，现就有关事宜通知如下：',
      '为推进各项工作有序开展，确保完成年度目标任务，现将有关事项通知如下：'
    ],
    report: [
      '现将有关情况报告如下：',
      '按照工作要求，现将有关情况报告如下：',
      '根据部署安排，现将工作情况报告如下：'
    ],
    request: [
      '现就有关事项请示如下：',
      '特向贵局（单位）请示如下：',
      '现将有关事项请示如下：'
    ],
    letter: [
      '现就有关事宜函复如下（或特致此函）：',
      '兹就有关事宜函告如下：',
      '贵单位来函收悉，现就有关事项回复如下：'
    ],
    decision: [
      '经研究决定如下：',
      '经会议讨论通过，现作出如下决定：',
      '为表彰先进、树立典型，经研究决定：'
    ],
    opinion: [
      '现就加强该项工作提出如下意见：',
      '为进一步做好相关工作，现提出如下意见：',
      '结合实际情况，现提出以下实施意见：'
    ],
    summary: [
      '现将有关工作总结如下：',
      '在上级领导的正确指导下，各项工作稳步推进，现将情况总结如下：',
      '按照工作部署，我们认真组织开展了各项工作，取得了积极成效，现总结如下：'
    ],
    announcement: [
      '现公告如下：',
      '为保障公众知情权，现将有关事项公告如下：',
      '根据有关规定，现就相关事项公告如下：'
    ]
  }

  const toneClosers: Record<string, string[]> = {
    notice: [
      '以上通知，请认真贯彻执行。',
      '特此通知。',
      '请各单位结合实际，认真抓好落实。'
    ],
    report: [
      '以上报告，请审阅。',
      '特此报告。',
      '以上报告，如有不妥，请指正。'
    ],
    request: [
      '以上请示，请予批复。',
      '妥否，请批示。',
      '以上请示如无不妥，请批准。'
    ],
    letter: [
      '特此函告。',
      '专此函复，敬请知悉。',
      '如蒙同意，请函复为盼。'
    ],
    decision: [
      '本决定自发布之日起施行。',
      '特此决定。',
      '望各单位认真遵照执行。'
    ],
    opinion: [
      '以上意见，请结合实际认真贯彻落实。',
      '请各单位参照执行。',
      '特此印发，请遵照执行。'
    ],
    summary: [
      '下一步，我们将继续努力，扎实推进各项工作。',
      '以上总结，敬请审阅。',
      '我们将认真总结经验，再接再厉，争取更大成绩。'
    ],
    announcement: [
      '特此公告。',
      '请广大群众知悉并相互转告。',
      '本公告自发布之日起生效。'
    ]
  }

  let introText = ''
  if (docType === 'notice' || docType === 'decision' || docType === 'opinion') {
    if (!isBrief) {
      const reasonPhrases = [
        '为深入贯彻落实党中央、国务院决策部署，根据上级有关文件精神，结合工作实际，',
        '为进一步规范管理、提高效率、促进发展，经多方调研论证，',
        '为切实解决当前工作中存在的突出问题，推动各项事业高质量发展，'
      ]
      introText = pick(reasonPhrases)
    }
    introText += pick(toneOpeners[docType])
  } else if (docType === 'report' || docType === 'summary') {
    if (isDetailed) {
      introText = `今年以来，在上级部门的坚强领导和正确指导下，我们坚持以习近平新时代中国特色社会主义思想为指导，全面贯彻落实各项决策部署，围绕中心、服务大局，攻坚克难、扎实工作，各项工作取得了新进展新成效。${pick(toneOpeners[docType])}`
    } else {
      introText = pick(toneOpeners[docType])
    }
  } else if (docType === 'request') {
    if (!isBrief) {
      const reasonPhrases = [
        '根据工作需要，为顺利推进相关工作开展，',
        '鉴于当前实际情况，为保障项目如期实施，',
        '按照相关规定和程序，'
      ]
      introText = pick(reasonPhrases)
    }
    introText += pick(toneOpeners[docType])
  } else if (docType === 'letter') {
    if (!isBrief) {
      const greetPhrases = [
        '贵单位一直以来给予我们的大力支持和帮助，我们深表感谢。',
        '贵单位在相关领域的专业成就令人钦佩，我们非常期待与贵方开展合作。',
        ''
      ]
      introText = pick(greetPhrases) + pick(toneOpeners[docType])
    } else {
      introText = pick(toneOpeners[docType])
    }
  } else {
    introText = pick(toneOpeners[docType])
  }

  paragraphs.push(introText)

  keyPoints.forEach((point, index) => {
    let formattedPoint = point
    if (!/^[一二三四五六七八九十]+[、.]/.test(point) && !/^\d+[、.)]/.test(point) && !/^[（(][一二三四五六七八九十\d]+[）)]/.test(point)) {
      const numerals = ['一、', '二、', '三、', '四、', '五、', '六、', '七、', '八、', '九、', '十、', '十一、', '十二、', '十三、', '十四、', '十五、']
      formattedPoint = `${numerals[index] || (index + 1) + '、'}${point}`
    }

    if (isDetailed) {
      const expansions: Record<string, string[]> = {
        notice: [
          `${formattedPoint}各单位要高度重视，明确专人负责，确保各项要求落到实处。`,
          `${formattedPoint}相关部门要加强协调配合，形成工作合力，共同推动工作开展。`,
          `${formattedPoint}工作过程中如遇重大问题，请及时向主管部门报告。`
        ],
        report: [
          `${formattedPoint}该项工作整体进展顺利，取得了阶段性成果，但仍存在一些困难和问题需要研究解决。`,
          `${formattedPoint}具体数据和详细情况已在相关附表中列明，供领导参阅。`,
          `${formattedPoint}我们将继续加大工作力度，确保完成既定目标任务。`
        ],
        request: [
          `${formattedPoint}相关方案和预算明细已作为附件一并报送，请予以审核批准。`,
          `${formattedPoint}我们将严格按照相关规定和程序办理，确保资金使用规范、高效。`,
          `${formattedPoint}如能得到批准，我们将立即组织实施，确保按期完成任务。`
        ],
        letter: [
          `${formattedPoint}详细方案可在双方进一步沟通后共同商定。`,
          `${formattedPoint}我们相信，通过双方的真诚合作，一定能够实现互利共赢。`,
          `${formattedPoint}期待贵方的回复，如有任何疑问，请随时与我们联系。`
        ],
        default: [
          `${formattedPoint}`,
          `${formattedPoint}相关工作正在有序推进中。`,
          `${formattedPoint}各相关方要认真落实，确保取得实效。`
        ]
      }
      const docKey = docType in expansions ? docType : 'default'
      paragraphs.push(pick(expansions[docKey]))
    } else if (!isBrief) {
      paragraphs.push(formattedPoint)
    } else {
      paragraphs.push(formattedPoint)
    }
  })

  if (!isBrief && keyPoints.length > 0) {
    paragraphs.push('')
  }

  if (isDetailed && (docType === 'notice' || docType === 'opinion' || docType === 'decision')) {
    paragraphs.push('各单位在执行过程中，要加强组织领导，落实工作责任，强化督促检查，确保各项部署要求落到实处、取得实效。对执行过程中出现的新情况、新问题，要及时研究解决并向上级报告。')
  }

  if (isDetailed && (docType === 'report' || docType === 'summary')) {
    paragraphs.push('回顾过去的工作，虽然取得了一定成绩，但我们也清醒地认识到，与上级要求和群众期待相比，还存在一定差距。下一步，我们将以更加坚定的信心、更加务实的作风、更加有力的举措，认真落实各项工作部署，不断开创工作新局面。')
  }

  paragraphs.push(pick(toneClosers[docType]))

  return paragraphs.filter(p => p.length > 0)
}

const generateDocument = async () => {
  if (!canGenerate.value) {
    ElMessage.warning('请填写完整的公文信息')
    return
  }

  isGenerating.value = true
  generatedDoc.value = null

  await new Promise(resolve => setTimeout(resolve, 800))

  const keyPointsArr = getKeyPointsArray()
  const d = new Date()
  const today = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`

  const issueDate = formData.value.issueDate || today

  const content: DocContent = {
    docNumber: formData.value.docNumber,
    title: generateTitle(formData.value.docType, formData.value.topic, formData.value.issuingUnit),
    recipientUnit: formData.value.recipientUnit,
    body: generateBodyParagraphs(
      formData.value.docType,
      formData.value.topic,
      keyPointsArr,
      formData.value.detailLevel,
      formData.value.toneStyle
    ),
    attachment: '',
    issuingUnit: formData.value.issuingUnit,
    issueDate: issueDate,
    ccUnit: formData.value.ccUnit
  }

  generatedDoc.value = {
    content,
    meta: {
      docType: formData.value.docType,
      topic: formData.value.topic,
      issuingUnit: formData.value.issuingUnit,
      detailLevel: formData.value.detailLevel,
      toneStyle: formData.value.toneStyle,
      generatedAt: new Date().toISOString()
    }
  }

  history.value.push({
    ...generatedDoc.value,
    formData: { ...formData.value }
  })
  saveHistory()

  isGenerating.value = false

  ElMessage.success({
    message: `📋 已成功生成【${getDocTypeLabel(formData.value.docType)}】文稿，共 ${getTotalCharsFromContent(content)} 字`,
    type: 'success',
    duration: 3000,
    showClose: true
  })
}

const regenerate = () => {
  generateDocument()
}

const getTotalCharsFromContent = (content: DocContent): number => {
  let total = content.title.length
  total += content.body.join('').length
  total += content.issuingUnit.length
  total += content.issueDate.length
  if (content.recipientUnit) total += content.recipientUnit.length
  if (content.attachment) total += content.attachment.length
  if (content.ccUnit) total += content.ccUnit.length
  return total
}

const getTotalChars = (): number => {
  if (!generatedDoc.value) return 0
  return getTotalCharsFromContent(generatedDoc.value.content)
}

const documentToText = (): string => {
  if (!generatedDoc.value) return ''
  const c = generatedDoc.value.content
  const lines: string[] = []

  if (c.docNumber) lines.push(c.docNumber + '\n')
  lines.push(c.title + '\n')
  if (c.recipientUnit) lines.push(c.recipientUnit + '：\n')
  c.body.forEach(p => lines.push('　　' + p + '\n'))
  if (c.attachment) lines.push('\n附件：' + c.attachment + '\n')
  lines.push('\n')
  lines.push('　　　　' + c.issuingUnit + '\n')
  lines.push('　　　　' + c.issueDate + '\n')
  if (c.ccUnit) lines.push('\n抄送：' + c.ccUnit + '\n')

  return lines.join('\n')
}

const copyAllDocument = async () => {
  const text = documentToText()
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制全文到剪贴板')
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('已复制全文到剪贴板')
  }
}

const downloadDocument = () => {
  const text = documentToText()
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${generatedDoc.value?.content.title || '公文'}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  ElMessage.success('公文已下载')
}

const resetAll = () => {
  formData.value = {
    docType: 'notice',
    topic: '',
    issuingUnit: '',
    recipientUnit: '',
    ccUnit: '',
    issueDate: '',
    docNumber: '',
    keyPoints: '',
    detailLevel: 'standard',
    toneStyle: 'formal'
  }
  generatedDoc.value = null
}

const loadHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      history.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
}

const saveHistory = () => {
  try {
    if (history.value.length > 50) {
      history.value = history.value.slice(-50)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

const clearHistory = () => {
  history.value = []
  localStorage.removeItem(STORAGE_KEY)
  ElMessage.success('历史记录已清空')
}

const loadFromHistory = (item: HistoryItem) => {
  formData.value = { ...item.formData }
  generatedDoc.value = {
    content: item.content,
    meta: item.meta
  }
  ElMessage.info('已载入历史记录')
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.official-document-writer {
  max-width: 1080px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.expectation-section {
  padding: 4px 0;
}

.standard-alert {
  margin-bottom: 16px;
}

.standard-alert :deep(.el-alert__title) {
  font-size: 14px;
  font-weight: 500;
}

.alert-title {
  font-size: 14px;
  line-height: 1.6;
}

.standard-content {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
}

.standard-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #303133;
}

.doctype-table {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 4px;
}

.doctype-row {
  display: grid;
  grid-template-columns: 110px 1fr 1fr;
}

.doctype-header {
  background: #f0f7ff;
  font-weight: 600;
  color: #165DFF;
  font-size: 13px;
}

.doctype-col {
  padding: 10px 12px;
  font-size: 13px;
  color: #303133;
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  line-height: 1.5;
}

.doctype-col:last-child {
  border-right: none;
}

.doctype-row:last-child .doctype-col {
  border-bottom: none;
}

.doctype-name {
  font-weight: 600;
  color: #165DFF;
  background: #fafcff;
}

.scope-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.scope-card {
  background: linear-gradient(135deg, #fff 0%, #f5f7fa 100%);
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 16px 12px;
  text-align: center;
  transition: all 0.2s;
}

.scope-card:hover {
  border-color: #c6e2ff;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f3ff 100%);
  transform: translateY(-2px);
}

.scope-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 8px 0 4px 0;
}

.scope-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.scope-hint {
  margin-bottom: 8px;
}

.scope-hint :deep(.el-alert__description) {
  font-size: 13px;
  line-height: 1.7;
}

.expectation-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.expectation-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 8px;
}

.expectation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef1f6 100%);
  border-radius: 10px;
}

.exp-text {
  flex: 1;
}

.exp-num {
  font-size: 15px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 2px;
}

.exp-label {
  font-size: 12px;
  color: #909399;
}

.scenario-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.scenario-tags :deep(.el-tag) {
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
  height: auto;
}

.main-card {
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

.card-header .el-tag {
  margin-left: 12px;
  font-weight: normal;
}

.card-header > :last-child {
  margin-left: auto;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.required-tag {
  color: #f56c6c;
  font-weight: normal;
  font-size: 14px;
}

.hint-tag {
  margin-left: 8px;
  font-weight: normal;
}

.type-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.type-card {
  border: 2px solid #ebeef5;
  border-radius: 10px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  background: #fff;
}

.type-card:hover {
  border-color: #c6e2ff;
  background: #f0f7ff;
}

.type-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #e8f3ff 0%, #f0f7ff 100%);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.12);
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
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.type-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.form-section {
  margin-bottom: 8px;
}

.basic-form {
  margin-bottom: 12px;
}

.quick-samples {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
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

.preference-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preference-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.preference-label {
  font-size: 14px;
  color: #606266;
  min-width: 80px;
  font-weight: 500;
}

.action-section {
  margin-top: 28px;
  display: flex;
  gap: 12px;
}

.generate-btn {
  min-width: 200px;
}

.btn-loading-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.generating-status {
  margin-top: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f3ff 100%);
  border-radius: 10px;
  border: 1px solid #c6e2ff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.generating-dots {
  display: inline-flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #165DFF;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.generating-text {
  color: #165DFF;
  font-weight: 500;
  font-size: 14px;
}

.result-card {
  margin-bottom: 24px;
}

.document-preview {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 10px;
}

.doc-paper {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 74px 66px 70px 56px;
  min-height: 594px;
  font-family: 'FangSong', '仿宋', 'SimSun', '宋体', 'FangSong_GB2312', serif;
  font-size: 16px;
  line-height: 1.875;
  color: #000;
  text-align: justify;
}

.doc-number {
  text-align: center;
  font-size: 16px;
  margin-bottom: 52px;
  color: #000;
}

.doc-title {
  text-align: center;
  font-family: 'STZhongsong', 'SimHei', '华文中宋', 'SimSun', '宋体', serif;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 40px;
  line-height: 1.5;
  letter-spacing: 1px;
}

.doc-recipient {
  font-size: 16px;
  margin-bottom: 12px;
  text-indent: 0;
  text-align: left;
}

.doc-body {
  text-align: justify;
}

.doc-paragraph {
  font-size: 16px;
  text-indent: 2em;
  margin: 0 0 10px 0;
  line-height: 1.875;
}

.doc-attachment {
  font-size: 16px;
  margin-top: 10px;
  text-indent: 2em;
}

.doc-sign-area {
  margin-top: 80px;
  text-align: right;
  padding-right: 4em;
}

.doc-signing-unit {
  font-size: 16px;
  margin-bottom: 10px;
  line-height: 1.875;
}

.doc-signing-date {
  font-size: 16px;
  line-height: 1.875;
}

.doc-cc {
  font-size: 16px;
  margin-top: 40px;
  padding-top: 12px;
  border-top: 1px solid #000;
  text-indent: 0;
}

.result-meta {
  margin-bottom: 20px;
}

.result-footer-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.history-card {
  margin-bottom: 24px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  background: #e8f3ff;
}

.history-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.history-topic {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-text {
  font-size: 14px;
  color: #303133;
}

.history-footer {
  margin-top: 12px;
  text-align: center;
}

@media (max-width: 768px) {
  .expectation-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .type-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .doc-paper {
    padding: 37px 28px 35px 28px;
    min-height: auto;
  }

  .standard-content {
    grid-template-columns: 1fr;
  }

  .doctype-row {
    grid-template-columns: 90px 1fr;
  }

  .doctype-row .doctype-col:nth-child(3) {
    grid-column: 2;
    border-top: none;
    padding-top: 0;
  }

  .doctype-header .doctype-col:nth-child(3) {
    display: none;
  }

  .scope-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
