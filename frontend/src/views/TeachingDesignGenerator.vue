<template>
  <div class="teaching-design-generator">
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
        <el-step title="输入基本信息" description="课程主题、学科、年级" />
        <el-step title="填写教学目标" description="知识与技能、过程与方法、情感态度" />
        <el-step title="生成设计方案" description="AI 一键生成完整教案" />
        <el-step title="查看与优化" description="导出、复制、自定义调整" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Collection /></el-icon>
            <div class="exp-text">
              <div class="exp-num">5-7 个教学环节</div>
              <div class="exp-label">完整的课堂流程设计</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">40-45 分钟</div>
              <div class="exp-label">标准课时时间分配</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Grid /></el-icon>
            <div class="exp-text">
              <div class="exp-num">多维教学活动</div>
              <div class="exp-label">师生互动、小组合作、探究学习</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Bulb /></el-icon>
            <div class="exp-text">
              <div class="exp-num">完整预期效果</div>
              <div class="exp-label">可量化的教学成果评估</div>
            </div>
          </div>
        </div>
        <el-divider />
        <h4 class="expectation-title">🎯 适用场景</h4>
        <div class="scenario-tags">
          <el-tag type="primary" size="large" effect="plain">👩‍🏫 新教师备课</el-tag>
          <el-tag type="success" size="large" effect="plain">🎤 公开课准备</el-tag>
          <el-tag type="warning" size="large" effect="plain">🏆 教学竞赛</el-tag>
          <el-tag type="danger" size="large" effect="plain">📈 日常教学优化</el-tag>
          <el-tag type="info" size="large" effect="plain">📋 教研活动</el-tag>
        </div>
      </div>
    </el-card>

    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Edit />
          </el-icon>
          <span>AI 教学设计方案生成</span>
          <el-tag size="small" type="primary">智能备课 · 一键生成教案</el-tag>
        </div>
      </template>

      <div class="form-section">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          <span>基本信息</span>
        </div>
        <el-form :model="formData" label-width="100px" class="basic-form">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="课程主题" required>
                <el-input
                  v-model="formData.topic"
                  placeholder="例如：二次函数的图像与性质"
                  :disabled="isGenerating"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学科" required>
                <el-select v-model="formData.subject" placeholder="请选择学科" :disabled="isGenerating" style="width: 100%">
                  <el-option v-for="sub in subjects" :key="sub.value" :label="sub.label" :value="sub.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="年级" required>
                <el-select v-model="formData.grade" placeholder="请选择年级" :disabled="isGenerating" style="width: 100%">
                  <el-option-group v-for="group in gradeGroups" :key="group.label" :label="group.label">
                    <el-option v-for="g in group.options" :key="g.value" :label="g.label" :value="g.value" />
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="课时时长">
                <el-select v-model="formData.duration" placeholder="请选择课时时长" :disabled="isGenerating" style="width: 100%">
                  <el-option v-for="d in durations" :key="d.value" :label="d.label" :value="d.value" />
                </el-select>
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
            {{ sample.topic }}
          </el-tag>
        </div>
      </div>

      <el-divider />

      <div class="form-section">
        <div class="section-title">
          <el-icon><Aim /></el-icon>
          <span>教学目标</span>
          <el-tag size="small" type="info">三维目标 · 可选填，不填则 AI 自动生成</el-tag>
        </div>
        <el-form label-width="120px">
          <el-form-item label="知识与技能">
            <el-input
              v-model="formData.knowledgeGoal"
              type="textarea"
              :rows="2"
              placeholder="例如：理解二次函数的概念，掌握其图像的绘制方法"
              :disabled="isGenerating"
            />
          </el-form-item>
          <el-form-item label="过程与方法">
            <el-input
              v-model="formData.processGoal"
              type="textarea"
              :rows="2"
              placeholder="例如：通过探究活动，培养学生观察、分析、归纳的能力"
              :disabled="isGenerating"
            />
          </el-form-item>
          <el-form-item label="情感态度与价值观">
            <el-input
              v-model="formData.emotionGoal"
              type="textarea"
              :rows="2"
              placeholder="例如：激发学生学习数学的兴趣，培养合作探究精神"
              :disabled="isGenerating"
            />
          </el-form-item>
        </el-form>
      </div>

      <el-divider />

      <div class="form-section">
        <div class="section-title">
          <el-icon><Setting /></el-icon>
          <span>教学设计偏好</span>
        </div>
        <div class="preference-options">
          <div class="preference-group">
            <span class="preference-label">教学模式：</span>
            <el-radio-group v-model="formData.teachingMode" :disabled="isGenerating">
              <el-radio-button v-for="mode in teachingModes" :key="mode.value" :value="mode.value">
                {{ mode.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="preference-group">
            <span class="preference-label">难度等级：</span>
            <el-radio-group v-model="formData.difficulty" :disabled="isGenerating">
              <el-radio-button v-for="level in difficultyLevels" :key="level.value" :value="level.value">
                {{ level.label }}
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
          @click="generateDesign"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 正在为您生成教学设计方案…
            </span>
          </template>
          生成教学设计方案
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
          🎓 AI 正在基于「{{ getSubjectLabel(formData.subject) }}」学科的「{{ formData.topic }}」主题
          为 {{ getGradeLabel(formData.grade) }} 学生生成符合{{ getDifficultyLabel(formData.difficulty) }}难度的教学设计方案…
        </span>
      </div>
    </el-card>

    <el-card v-if="generatedDesign" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#67c23a">
            <Finished />
          </el-icon>
          <span>教学设计方案</span>
          <el-tag size="small" type="success">
            {{ generatedDesign.basicInfo.subject }} · {{ generatedDesign.basicInfo.grade }} · {{ generatedDesign.basicInfo.duration }}分钟
          </el-tag>
          <div class="header-actions">
            <el-button size="small" type="primary" link :icon="CopyDocument" @click="copyAllDesign">
              复制全部
            </el-button>
            <el-button size="small" type="success" link :icon="Download" @click="exportDesign">
              导出文本
            </el-button>
          </div>
        </div>
      </template>

      <div class="design-content">
        <div class="design-section basic-info-section">
          <div class="section-header">
            <el-icon color="#165DFF"><Document /></el-icon>
            <h3>一、课程基本信息</h3>
          </div>
          <el-descriptions :column="2" border size="default">
            <el-descriptions-item label="课程主题">{{ generatedDesign.basicInfo.topic }}</el-descriptions-item>
            <el-descriptions-item label="授课学科">{{ generatedDesign.basicInfo.subject }}</el-descriptions-item>
            <el-descriptions-item label="授课年级">{{ generatedDesign.basicInfo.grade }}</el-descriptions-item>
            <el-descriptions-item label="课时时长">{{ generatedDesign.basicInfo.duration }} 分钟</el-descriptions-item>
            <el-descriptions-item label="教学模式">{{ generatedDesign.basicInfo.teachingMode }}</el-descriptions-item>
            <el-descriptions-item label="难度等级">{{ generatedDesign.basicInfo.difficulty }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="design-section">
          <div class="section-header">
            <el-icon color="#67c23a"><Aim /></el-icon>
            <h3>二、教学目标</h3>
          </div>
          <div class="goals-list">
            <div class="goal-item">
              <el-tag type="primary" effect="dark" size="small">知识与技能</el-tag>
              <p>{{ generatedDesign.goals.knowledge }}</p>
            </div>
            <div class="goal-item">
              <el-tag type="success" effect="dark" size="small">过程与方法</el-tag>
              <p>{{ generatedDesign.goals.process }}</p>
            </div>
            <div class="goal-item">
              <el-tag type="warning" effect="dark" size="small">情感态度与价值观</el-tag>
              <p>{{ generatedDesign.goals.emotion }}</p>
            </div>
          </div>
        </div>

        <div class="design-section">
          <div class="section-header">
            <el-icon color="#e6a23c"><Collection /></el-icon>
            <h3>三、教学重难点</h3>
          </div>
          <div class="keypoints-container">
            <div class="keypoint-card key-point">
              <div class="keypoint-title">
                <el-icon color="#f56c6c"><Warning /></el-icon>
                <span>教学重点</span>
              </div>
              <ul>
                <li v-for="(point, i) in generatedDesign.keyPoints" :key="i">{{ point }}</li>
              </ul>
            </div>
            <div class="keypoint-card difficult-point">
              <div class="keypoint-title">
                <el-icon color="#e6a23c"><WarningFilled /></el-icon>
                <span>教学难点</span>
              </div>
              <ul>
                <li v-for="(point, i) in generatedDesign.difficultPoints" :key="i">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="design-section">
          <div class="section-header">
            <el-icon color="#722ed1"><Tools /></el-icon>
            <h3>四、教学准备</h3>
          </div>
          <div class="preparation-list">
            <div class="prep-item" v-for="(prep, i) in generatedDesign.preparations" :key="i">
              <el-icon color="#165DFF"><CircleCheck /></el-icon>
              <span>{{ prep }}</span>
            </div>
          </div>
        </div>

        <div class="design-section">
          <div class="section-header">
            <el-icon color="#165DFF"><Grid /></el-icon>
            <h3>五、教学过程</h3>
          </div>
          <el-table :data="generatedDesign.teachingProcess" border stripe class="process-table">
            <el-table-column prop="stage" label="教学环节" width="130">
              <template #default="{ row, $index }">
                <el-tag :type="getStageTagType($index)" effect="dark">{{ row.stage }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间分配" width="100" align="center">
              <template #default="{ row }">
                <el-tag type="info" size="small">{{ row.time }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="teacherActivity" label="教师活动" min-width="200">
              <template #default="{ row }">
                <div class="activity-content teacher-activity">
                  <div class="activity-label">👨‍🏫 教师</div>
                  <p>{{ row.teacherActivity }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="studentActivity" label="学生活动" min-width="200">
              <template #default="{ row }">
                <div class="activity-content student-activity">
                  <div class="activity-label">👩‍🎓 学生</div>
                  <p>{{ row.studentActivity }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="designIntent" label="设计意图" min-width="180">
              <template #default="{ row }">
                <div class="intent-content">
                  <el-icon color="#67c23a" size="12"><Bulb /></el-icon>
                  <span>{{ row.designIntent }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="design-section">
          <div class="section-header">
            <el-icon color="#67c23a"><DataLine /></el-icon>
            <h3>六、板书设计</h3>
          </div>
          <div class="blackboard-design">
            <div class="blackboard">
              <div class="bb-title">{{ generatedDesign.basicInfo.topic }}</div>
              <div class="bb-content">
                <div class="bb-left">
                  <h5>知识要点</h5>
                  <ul>
                    <li v-for="(item, i) in generatedDesign.blackboardDesign.left" :key="i">{{ item }}</li>
                  </ul>
                </div>
                <div class="bb-center">
                  <h5>核心内容</h5>
                  <div class="bb-main-point">{{ generatedDesign.blackboardDesign.center }}</div>
                </div>
                <div class="bb-right">
                  <h5>例题/练习</h5>
                  <ul>
                    <li v-for="(item, i) in generatedDesign.blackboardDesign.right" :key="i">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="design-section">
          <div class="section-header">
            <el-icon color="#f56c6c"><Finished /></el-icon>
            <h3>七、教学评价与预期效果</h3>
          </div>
          <div class="evaluation-container">
            <div class="eval-card">
              <div class="eval-header">
                <el-icon color="#165DFF"><DataLine /></el-icon>
                <span>课堂评价方式</span>
              </div>
              <ul>
                <li v-for="(eval, i) in generatedDesign.evaluation.methods" :key="i">{{ eval }}</li>
              </ul>
            </div>
            <div class="eval-card">
              <div class="eval-header">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                <span>预期效果</span>
              </div>
              <ul>
                <li v-for="(effect, i) in generatedDesign.evaluation.expectedEffects" :key="i">{{ effect }}</li>
              </ul>
            </div>
            <div class="eval-card">
              <div class="eval-header">
                <el-icon color="#e6a23c"><Tools /></el-icon>
                <span>作业布置</span>
              </div>
              <ul>
                <li v-for="(hw, i) in generatedDesign.evaluation.homework" :key="i">{{ hw }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="design-section" v-if="generatedDesign.teachingReflection">
          <div class="section-header">
            <el-icon color="#722ed1"><ChatLineRound /></el-icon>
            <h3>八、教学反思建议</h3>
          </div>
          <div class="reflection-content">
            <el-alert
              v-for="(tip, i) in generatedDesign.teachingReflection"
              :key="i"
              :title="tip"
              type="info"
              :closable="false"
              show-icon
              class="reflection-tip"
            />
          </div>
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
            <el-tag size="small" type="primary">{{ item.subject }}</el-tag>
            <el-tag size="small" type="success">{{ item.grade }}</el-tag>
            <span class="history-text">{{ item.topic }}</span>
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
  Aim,
  Setting,
  MagicStick,
  Refresh,
  Loading,
  Finished,
  CopyDocument,
  Download,
  Document,
  Collection,
  Warning,
  WarningFilled,
  Tools,
  Grid,
  Bulb,
  DataLine,
  ChatLineRound,
  Clock,
  InfoFilled,
  CircleCheck
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface FormData {
  topic: string
  subject: string
  grade: string
  duration: number
  knowledgeGoal: string
  processGoal: string
  emotionGoal: string
  teachingMode: string
  difficulty: string
}

interface TeachingStage {
  stage: string
  time: string
  teacherActivity: string
  studentActivity: string
  designIntent: string
}

interface TeachingDesign {
  basicInfo: {
    topic: string
    subject: string
    grade: string
    duration: number
    teachingMode: string
    difficulty: string
  }
  goals: {
    knowledge: string
    process: string
    emotion: string
  }
  keyPoints: string[]
  difficultPoints: string[]
  preparations: string[]
  teachingProcess: TeachingStage[]
  blackboardDesign: {
    left: string[]
    center: string
    right: string[]
  }
  evaluation: {
    methods: string[]
    expectedEffects: string[]
    homework: string[]
  }
  teachingReflection: string[]
}

interface HistoryItem {
  topic: string
  subject: string
  grade: string
  design: TeachingDesign
  time: string
}

const STORAGE_KEY = 'teaching_design_history'

const subjects = [
  { label: '语文', value: 'chinese' },
  { label: '数学', value: 'math' },
  { label: '英语', value: 'english' },
  { label: '物理', value: 'physics' },
  { label: '化学', value: 'chemistry' },
  { label: '生物', value: 'biology' },
  { label: '历史', value: 'history' },
  { label: '地理', value: 'geography' },
  { label: '政治', value: 'politics' },
  { label: '科学', value: 'science' },
  { label: '信息技术', value: 'it' },
  { label: '音乐', value: 'music' },
  { label: '美术', value: 'art' },
  { label: '体育', value: 'pe' },
  { label: '道德与法治', value: 'ethics' }
]

const gradeGroups = [
  {
    label: '小学',
    options: [
      { label: '一年级', value: 'g1' },
      { label: '二年级', value: 'g2' },
      { label: '三年级', value: 'g3' },
      { label: '四年级', value: 'g4' },
      { label: '五年级', value: 'g5' },
      { label: '六年级', value: 'g6' }
    ]
  },
  {
    label: '初中',
    options: [
      { label: '初一', value: 'g7' },
      { label: '初二', value: 'g8' },
      { label: '初三', value: 'g9' }
    ]
  },
  {
    label: '高中',
    options: [
      { label: '高一', value: 'g10' },
      { label: '高二', value: 'g11' },
      { label: '高三', value: 'g12' }
    ]
  }
]

const durations = [
  { label: '35 分钟', value: 35 },
  { label: '40 分钟', value: 40 },
  { label: '45 分钟', value: 45 },
  { label: '50 分钟', value: 50 }
]

const teachingModes = [
  { label: '讲授式', value: 'lecture' },
  { label: '启发式', value: 'heuristic' },
  { label: '探究式', value: 'inquiry' },
  { label: '合作式', value: 'cooperative' },
  { label: '混合式', value: 'blended' }
]

const difficultyLevels = [
  { label: '基础', value: 'basic' },
  { label: '中等', value: 'medium' },
  { label: '进阶', value: 'advanced' }
]

const quickSamples = [
  { topic: '二次函数的图像与性质', subject: 'math', grade: 'g9' },
  { topic: '荷塘月色', subject: 'chinese', grade: 'g10' },
  { topic: '光合作用', subject: 'biology', grade: 'g7' },
  { topic: '一般过去时', subject: 'english', grade: 'g7' },
  { topic: '牛顿第一定律', subject: 'physics', grade: 'g8' }
]

const teachingStageTemplates: Record<string, string[]> = {
  lecture: ['导入新课', '讲授新知', '例题讲解', '课堂练习', '归纳小结', '作业布置'],
  heuristic: ['情境导入', '启发提问', '引导探究', '互动讨论', '总结归纳', '巩固拓展'],
  inquiry: ['问题引入', '提出假设', '实验探究', '数据分析', '得出结论', '反思评价'],
  cooperative: ['任务导入', '分组讨论', '合作探究', '成果展示', '互评交流', '总结提升'],
  blended: ['课前回顾', '新知导学', '线上线下结合', '协作学习', '检测反馈', '拓展延伸']
}

const formData = ref<FormData>({
  topic: '',
  subject: '',
  grade: '',
  duration: 45,
  knowledgeGoal: '',
  processGoal: '',
  emotionGoal: '',
  teachingMode: 'heuristic',
  difficulty: 'medium'
})

const isGenerating = ref(false)
const generatedDesign = ref<TeachingDesign | null>(null)
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const canGenerate = computed(() => {
  return formData.value.topic.trim().length > 0 && formData.value.subject && formData.value.grade
})

const currentStep = computed(() => {
  if (generatedDesign.value && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (formData.value.topic || formData.value.subject) return 1
  return 0
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  if (showAllHistory.value) return reversed
  return reversed.slice(0, 10)
})

const getSubjectLabel = (value: string) => {
  const found = subjects.find(s => s.value === value)
  return found?.label || value
}

const getGradeLabel = (value: string) => {
  for (const group of gradeGroups) {
    const found = group.options.find(g => g.value === value)
    if (found) return found.label
  }
  return value
}

const getDifficultyLabel = (value: string) => {
  const found = difficultyLevels.find(d => d.value === value)
  return found?.label || value
}

const getStageTagType = (index: number): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const types: Array<'' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = ['primary', 'success', 'warning', 'info', '', 'danger']
  return types[index % types.length]
}

const applySample = (sample: typeof quickSamples[0]) => {
  formData.value.topic = sample.topic
  formData.value.subject = sample.subject
  formData.value.grade = sample.grade
}

const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const getSubjectSpecificContent = (subject: string, topic: string) => {
  const isMath = subject === 'math'
  const isChinese = subject === 'chinese'
  const isScience = ['physics', 'chemistry', 'biology', 'science'].includes(subject)

  return {
    keyPoints: [
      `${topic}的核心概念与定义`,
      `${topic}的基本原理/规律`,
      `${topic}的典型应用方法`,
      isMath ? `${topic}相关公式的推导与运用` : isChinese ? `${topic}的写作手法与语言特色` : `${topic}的实际应用`
    ],
    difficultPoints: [
      `${topic}的抽象概念理解`,
      `${topic}在复杂情境中的灵活运用`,
      isScience ? `${topic}相关实验的设计与分析` : `${topic}的综合应用与拓展`,
      `${topic}与已有知识的融会贯通`
    ],
    preparations: [
      `多媒体课件：包含${topic}相关图片、动画、视频等`,
      `教学器材：${isScience ? '实验仪器、标本、模型' : isMath ? '直尺、三角板、计算器' : '投影仪、音响设备'}`,
      `学案/导学案：预习题、探究题、课堂练习题`,
      `分组安排：根据学生情况进行异质分组`,
      `板书设计：提前规划板书布局`
    ],
    knowledgeDefault: `理解${topic}的基本概念，掌握${topic}的核心内容，能够运用所学知识解决相关问题。`,
    processDefault: `通过自主探究、合作学习等方式，培养学生分析问题、解决问题的能力，提升思维品质和创新意识。`,
    emotionDefault: `激发学生对${getSubjectLabel(subject)}学科的学习兴趣，培养严谨的科学态度和合作精神，增强自信心和成就感。`
  }
}

const generateTeachingProcess = (mode: string, duration: number, subject: string, topic: string, grade: string): TeachingStage[] => {
  const stages = teachingStageTemplates[mode] || teachingStageTemplates.heuristic
  const timeDistributions: Record<number, string[]> = {
    35: ['3分钟', '10分钟', '8分钟', '8分钟', '4分钟', '2分钟'],
    40: ['5分钟', '12分钟', '8分钟', '8分钟', '5分钟', '2分钟'],
    45: ['5分钟', '15分钟', '10分钟', '8分钟', '5分钟', '2分钟'],
    50: ['5分钟', '15分钟', '10分钟', '12分钟', '6分钟', '2分钟']
  }
  const times = timeDistributions[duration] || timeDistributions[45]
  const gradeNum = parseInt(grade.replace('g', ''))
  const isElementary = gradeNum <= 6
  const isMiddle = gradeNum >= 7 && gradeNum <= 9

  const activityTemplates: Record<string, string[]> = {
    '导入新课': [
      `通过生活实例或趣味问题引入${topic}，激发学生学习兴趣。展示相关图片或播放短视频，创设问题情境，引发学生思考。`,
      `复习旧知，温故知新。回顾上节课内容，自然过渡到本节课的${topic}主题，建立知识之间的联系。`,
      `利用实物演示或实验现象引入${topic}，让学生直观感受，产生探究欲望。`
    ],
    '情境导入': [
      `创设与${topic}相关的真实生活情境，提出驱动性问题，激发学生的好奇心和探究欲。`,
      `展示${topic}在实际生活中的应用案例，引发学生思考"为什么"和"怎么办"。`
    ],
    '问题引入': [
      `提出核心探究问题，明确本节课的研究方向和目标，引导学生思考如何解决${topic}相关问题。`,
      `呈现矛盾现象或认知冲突，激发学生对${topic}的探究兴趣。`
    ],
    '任务导入': [
      `布置本节课的合作学习任务，明确小组分工和完成标准，围绕${topic}展开探究。`
    ],
    '课前回顾': [
      `检查学生课前自主学习情况，针对${topic}的预习疑问进行集中解答。`
    ],
    '讲授新知': [
      `系统讲解${topic}的概念、原理和方法，结合具体例子进行深入浅出的分析。适时提问，引导学生思考。`,
      `采用启发式教学，通过层层设问，引导学生自主发现${topic}的规律和特点，教师适时点拨总结。`
    ],
    '启发提问': [
      `围绕${topic}设计阶梯式问题链，从浅入深引导学生思考，鼓励学生大胆表达自己的观点。`,
      `通过追问、反问等方式，激发学生深度思考${topic}的本质和内涵。`
    ],
    '提出假设': [
      `引导学生根据已有知识和经验，对${topic}的规律做出合理推测和假设，培养科学思维。`,
      `组织学生讨论各自的猜想，比较不同假设的合理性，激发思维碰撞。`
    ],
    '分组讨论': [
      `各小组围绕${topic}的核心问题展开讨论，教师巡视指导，鼓励每位同学积极发言，分享观点。`
    ],
    '新知导学': [
      `利用线上学习资源，引导学生自主学习${topic}的基础内容，标记疑问点，为课堂深入学习做准备。`
    ],
    '例题讲解': [
      `精选典型例题，详细分析解题思路和方法步骤，强调关键步骤和易错点。引导学生总结解题规律。`,
      `采用一题多解的方式，拓展学生思维，对比不同解法的优劣，加深对${topic}的理解。`
    ],
    '引导探究': [
      `提供探究材料和工具，指导学生通过实验、观察、推理等方式，自主发现${topic}的规律。`,
      `组织学生开展探究活动，教师作为引导者和参与者，适时提供支持和指导。`
    ],
    '实验探究': [
      `指导学生分组进行实验，观察记录实验现象，分析数据，验证关于${topic}的假设。强调实验操作规范和安全注意事项。`,
      `引导学生设计实验方案，控制变量，收集证据，培养科学探究能力。`
    ],
    '合作探究': [
      `各小组围绕${topic}的探究任务开展协作学习，分工合作，共同解决问题，教师巡视指导。`
    ],
    '线上线下结合': [
      `结合线上学习平台的数据反馈，针对学生在${topic}学习中的共性问题进行重点讲解。`
    ],
    '课堂练习': [
      `设计分层练习题，基础题巩固新知，提高题拓展思维。学生独立完成后，进行集体订正和答疑。`,
      isElementary ? `采用游戏化练习方式，增加趣味性，在轻松愉快的氛围中巩固${topic}相关知识。` : `组织学生板演练习，及时发现并纠正共性问题，注重解题过程的规范性。`
    ],
    '互动讨论': [
      `组织小组讨论和全班交流，鼓励学生展示不同思路和方法，相互学习，共同进步。`,
      `开展课堂辩论或观点分享活动，深化对${topic}的理解，培养学生的表达能力和思辨能力。`
    ],
    '数据分析': [
      `引导学生对实验数据进行整理、分析和处理，运用图表等方式呈现结果，推导结论。`,
      `组织学生交流各自的实验结果和数据分析过程，培养证据意识和科学表达能力。`
    ],
    '成果展示': [
      `各小组派代表展示合作学习成果，其他小组进行点评和提问，在交流中深化对${topic}的理解。`
    ],
    '协作学习': [
      `组织小组协作完成${topic}相关的学习任务，通过同伴互助共同攻克难点，培养团队合作能力。`
    ],
    '归纳小结': [
      `引导学生自主梳理本节课所学内容，构建知识体系。教师总结提升，强调${topic}的重点和关键。`,
      `采用思维导图等方式，帮助学生系统化整理知识，建立${topic}与相关知识的联系。`
    ],
    '总结归纳': [
      `师生共同总结本节课的收获，梳理${topic}的知识要点，强调学习方法和思维方式。`,
      `引导学生反思学习过程，总结经验，提出进一步探究的问题。`
    ],
    '得出结论': [
      `在数据分析的基础上，引导学生归纳总结，得出关于${topic}的科学结论，并与最初的假设进行对比。`,
      `组织学生汇报探究成果，共同提炼${topic}的核心规律和结论。`
    ],
    '互评交流': [
      `组织小组间的互评活动，采用多元评价方式，既要评价学习成果，也要评价合作过程。`
    ],
    '检测反馈': [
      `进行课堂小检测，及时了解学生对${topic}的掌握情况，根据反馈进行针对性的巩固和辅导。`
    ],
    '作业布置': [
      `布置分层作业：基础题巩固课堂所学，拓展题供学有余力的同学选做。强调作业规范要求。`,
      `设计开放性作业或实践任务，鼓励学生将${topic}的知识应用到实际生活中，实现知识迁移。`
    ],
    '巩固拓展': [
      `通过变式练习巩固新知，适当拓展延伸，为后续学习做铺垫。`,
      `联系生活实际，展示${topic}知识在现实世界中的广泛应用，激发学生进一步学习的兴趣。`
    ],
    '反思评价': [
      `引导学生对整个探究过程进行反思，评价探究方案的合理性，总结成功经验和改进方向。`,
      `开展多元评价，包括自评、互评和教师评价，关注学生在探究过程中的表现和成长。`
    ],
    '总结提升': [
      `对各小组的学习成果和表现进行总结点评，肯定优点，指出不足，提出改进建议。`
    ],
    '拓展延伸': [
      `推荐${topic}相关的拓展学习资源，鼓励学生课后进一步探究，培养自主学习能力。`
    ]
  }

  const studentActivityTemplates: Record<string, string[]> = {
    '导入新课': [
      `认真观察，积极思考，踊跃回答老师提出的问题，对${topic}产生学习兴趣。`,
      `跟随老师回顾旧知，尝试建立与新知识${topic}的联系。`
    ],
    '情境导入': [
      `融入情境，思考老师提出的问题，大胆猜想，踊跃表达自己的想法和疑问。`
    ],
    '问题引入': [
      `明确探究问题，思考解决${topic}问题的可能方法，激发探究兴趣。`
    ],
    '任务导入': [
      `明确小组任务和个人分工，了解学习目标和评价标准。`
    ],
    '课前回顾': [
      `分享课前预习的收获和疑问，积极参与答疑互动。`
    ],
    '讲授新知': [
      `认真听讲，做好笔记，积极思考老师提出的问题，主动参与课堂互动。`,
      `跟随老师的引导，主动思考，尝试自己推导和总结${topic}的规律。`
    ],
    '启发提问': [
      `积极思考，大胆回答问题，敢于质疑和提出不同见解，主动参与课堂讨论。`
    ],
    '提出假设': [
      `基于已有知识，对${topic}的规律做出猜想，与同学交流讨论各自的假设。`
    ],
    '分组讨论': [
      `积极参与小组讨论，主动发表自己的见解，认真倾听他人观点，相互启发，共同进步。`
    ],
    '新知导学': [
      `认真观看线上学习资源，完成预习任务，标记不懂的问题，做好学习笔记。`
    ],
    '例题讲解': [
      `仔细审题，尝试独立思考解题思路，对比老师的讲解分析，总结解题方法和技巧。`,
      `积极思考一题多解的可能性，勇于展示不同的解法，学习借鉴他人的优点。`
    ],
    '引导探究': [
      `积极动手操作，认真观察记录，主动思考分析，勇于表达自己的发现和见解。`
    ],
    '实验探究': [
      `按照实验规范认真操作，仔细观察实验现象，如实记录实验数据，积极思考分析。`,
      `与小组同学分工合作，共同完成实验，讨论分析实验结果。`
    ],
    '合作探究': [
      `积极参与小组合作探究，主动承担任务，与组员密切配合，共同解决${topic}相关问题。`
    ],
    '线上线下结合': [
      `结合线上学习的收获，深入思考${topic}的难点问题，积极参与课堂讨论。`
    ],
    '课堂练习': [
      `独立认真完成课堂练习，注意解题规范，做完后主动检查，发现问题及时请教。`,
      `积极参与练习订正，认真分析错误原因，及时纠正，巩固所学知识。`
    ],
    '互动讨论': [
      `积极参与讨论，善于表达自己的观点，同时学会倾听、尊重他人的不同意见。`
    ],
    '数据分析': [
      `认真整理实验数据，尝试用图表等方式呈现，分析数据背后的规律，得出结论。`
    ],
    '成果展示': [
      `认真准备展示内容，清晰表达小组的学习成果，虚心接受其他小组的建议和点评。`
    ],
    '协作学习': [
      `在小组中发挥自己的作用，帮助学习有困难的同伴，共同完成${topic}的学习任务。`
    ],
    '归纳小结': [
      `积极参与知识梳理，尝试用自己的语言总结本节课的要点，构建知识网络。`,
      isMiddle ? `绘制思维导图，系统化整理${topic}的知识结构，建立知识间的联系。` : `跟着老师一起回顾总结，大声说出本节课的收获。`
    ],
    '总结归纳': [
      `认真总结本节课的学习收获，反思自己的学习过程，提出还想进一步探究的问题。`
    ],
    '得出结论': [
      `基于证据得出科学结论，与同学分享交流，反思自己探究过程中的成功与不足。`
    ],
    '互评交流': [
      `客观公正地评价其他小组的成果，善于发现他人的优点，同时反思自己的不足。`
    ],
    '检测反馈': [
      `认真完成课堂检测，诚实反映自己的学习情况，针对暴露的问题及时查漏补缺。`
    ],
    '作业布置': [
      `记录作业要求，明确完成标准，按时独立完成作业，遇到困难主动请教。`,
      `根据自己的学习情况选择适合的作业层次，学有余力的同学尝试挑战拓展题。`
    ],
    '巩固拓展': [
      `认真完成变式练习，积极思考拓展问题，尝试将知识应用于新情境。`
    ],
    '反思评价': [
      `认真反思自己的探究过程和方法，总结经验教训，提出改进方案。`
    ],
    '总结提升': [
      `认真倾听老师和同学的评价，明确自己的优点和不足，确定后续努力方向。`
    ],
    '拓展延伸': [
      `根据老师推荐的拓展资源，自主开展课后探究，培养持续学习的兴趣和能力。`
    ]
  }

  const designIntentTemplates: Record<string, string> = {
    '导入新课': `创设情境，激发兴趣，自然引入${topic}，为新知学习做好铺垫。`,
    '情境导入': `基于真实情境提出问题，让学生感受到学习${topic}的现实意义，激发内在学习动机。`,
    '问题引入': `以问题驱动学习，明确探究方向，培养学生的问题意识。`,
    '任务导入': `以任务为导向，激发学生的合作意识和挑战精神，明确学习目标。`,
    '课前回顾': `衔接课前预习与课堂学习，提高课堂教学的针对性和有效性。`,
    '讲授新知': `系统传授${topic}的核心知识，确保学生建立正确的概念认知。`,
    '启发提问': `通过问题链引导学生深度思考，培养思维的逻辑性和深刻性。`,
    '提出假设': `培养学生的猜想能力和科学思维，为后续探究活动明确方向。`,
    '分组讨论': `通过同伴互动促进思维碰撞，培养合作交流能力和团队精神。`,
    '新知导学': `培养学生的自主学习能力，实现课堂的翻转和高效。`,
    '例题讲解': `示范解题思路和方法，帮助学生掌握${topic}的应用技巧，规范答题习惯。`,
    '引导探究': `让学生经历知识的形成过程，培养探究能力和科学素养。`,
    '实验探究': `培养学生的动手能力、观察能力和数据分析能力，体验科学探究的过程。`,
    '合作探究': `在合作中学习，在探究中成长，培养学生的合作意识和探究能力。`,
    '线上线下结合': `融合线上线下学习优势，实现个性化学习和深度学习。`,
    '课堂练习': `及时巩固所学知识，检测学习效果，发现并解决学习中的问题。`,
    '互动讨论': `在交流中深化理解，在碰撞中产生智慧，培养学生的表达能力和批判性思维。`,
    '数据分析': `培养数据意识和证据推理能力，提高科学探究的严谨性。`,
    '成果展示': `提供展示交流的平台，增强学生的自信心和成就感，在互评中共同进步。`,
    '协作学习': `通过同伴互助实现共同进步，培养学生的团队协作精神和沟通能力。`,
    '归纳小结': `帮助学生系统化梳理知识，构建完整的${topic}知识体系，提升学习能力。`,
    '总结归纳': `及时总结提升，帮助学生巩固所学，培养归纳总结能力和反思习惯。`,
    '得出结论': `培养学生基于证据得出结论的科学态度，体验探究成功的喜悦。`,
    '互评交流': `培养学生的评价能力和反思意识，学会欣赏他人、完善自我。`,
    '检测反馈': `及时获取学习反馈，为后续教学调整提供依据，实现教学评一体化。`,
    '作业布置': `分层作业设计，兼顾基础与拓展，实现因材施教，促进每个学生的发展。`,
    '巩固拓展': `巩固所学知识，适当拓展延伸，为后续学习奠定基础，激发持续学习的兴趣。`,
    '反思评价': `培养学生的元认知能力，在反思中不断成长和进步。`,
    '总结提升': `多元评价促进学生全面发展，明确后续努力方向。`,
    '拓展延伸': `将课堂学习延伸到课外，培养学生的自主学习能力和探究精神。`
  }

  return stages.map((stage) => ({
    stage,
    time: times[stages.indexOf(stage)] || '5分钟',
    teacherActivity: randomPick(activityTemplates[stage as keyof typeof activityTemplates] || activityTemplates['讲授新知']),
    studentActivity: randomPick(studentActivityTemplates[stage as keyof typeof studentActivityTemplates] || studentActivityTemplates['讲授新知']),
    designIntent: designIntentTemplates[stage as keyof typeof designIntentTemplates] || designIntentTemplates['讲授新知']
  }))
}

const generateDesign = async () => {
  if (!canGenerate.value) {
    ElMessage.warning('请填写完整的课程主题、学科和年级信息')
    return
  }

  isGenerating.value = true
  generatedDesign.value = null

  await new Promise(resolve => setTimeout(resolve, 1500))

  const subjectContent = getSubjectSpecificContent(
    formData.value.subject,
    formData.value.topic
  )

  const gradeNum = parseInt(formData.value.grade.replace('g', ''))
  const isElementary = gradeNum <= 6

  const blackboardLeft = [
    `${formData.value.topic}的定义`,
    `${formData.value.topic}的主要特征`,
    `核心公式/原理`
  ]

  const blackboardRight = isElementary
    ? ['基础练习1道', '巩固练习1道', '思考题1道']
    : ['典型例题分析', '变式训练', '拓展提高']

  const design: TeachingDesign = {
    basicInfo: {
      topic: formData.value.topic,
      subject: getSubjectLabel(formData.value.subject),
      grade: getGradeLabel(formData.value.grade),
      duration: formData.value.duration,
      teachingMode: teachingModes.find(m => m.value === formData.value.teachingMode)?.label || '启发式',
      difficulty: getDifficultyLabel(formData.value.difficulty)
    },
    goals: {
      knowledge: formData.value.knowledgeGoal.trim() || subjectContent.knowledgeDefault,
      process: formData.value.processGoal.trim() || subjectContent.processDefault,
      emotion: formData.value.emotionGoal.trim() || subjectContent.emotionDefault
    },
    keyPoints: subjectContent.keyPoints,
    difficultPoints: subjectContent.difficultPoints,
    preparations: subjectContent.preparations,
    teachingProcess: generateTeachingProcess(
      formData.value.teachingMode,
      formData.value.duration,
      formData.value.subject,
      formData.value.topic,
      formData.value.grade
    ),
    blackboardDesign: {
      left: blackboardLeft,
      center: `${formData.value.topic}\n核心：${randomPick(['掌握方法', '理解概念', '灵活运用', '形成能力'])}`,
      right: blackboardRight
    },
    evaluation: {
      methods: [
        '课堂观察：通过提问、巡视、观察学生参与度和表现',
        '练习检测：通过课堂练习和作业检测知识掌握程度',
        '学生自评：引导学生反思学习过程和收获',
        '小组互评：在合作学习中评价同伴的表现和贡献'
      ],
      expectedEffects: [
        `90%以上的学生能够准确表述${formData.value.topic}的核心概念`,
        `80%以上的学生能够独立完成基础练习题，正确率达到80%以上`,
        `学生能够积极参与课堂活动，发言率达到70%以上`,
        `培养学生的${randomPick(['合作意识', '探究精神', '创新思维', '实践能力'])}，增强学习自信心`
      ],
      homework: [
        '基础作业：完成教材配套练习，巩固本节课所学知识',
        `拓展作业：思考${formData.value.topic}在生活中的应用实例，下节课分享交流`,
        '预习作业：预习下节课内容，标记预习中的疑问点'
      ]
    },
    teachingReflection: [
      '关注不同层次学生的学习情况，对学困生给予更多的个别辅导和鼓励',
      '根据课堂生成及时调整教学节奏和策略，灵活应对学生的突发问题',
      '课后收集学生反馈，评估教学目标的达成度，为后续教学改进提供依据'
    ]
  }

  generatedDesign.value = design
  isGenerating.value = false

  history.value.push({
    topic: formData.value.topic,
    subject: getSubjectLabel(formData.value.subject),
    grade: getGradeLabel(formData.value.grade),
    design: JSON.parse(JSON.stringify(design)),
    time: new Date().toISOString()
  })
  saveHistory()

  ElMessage.success({
    message: `🎓 已成功生成「${design.basicInfo.subject}·${design.basicInfo.topic}」的教学设计方案`,
    type: 'success',
    duration: 3000,
    showClose: true
  })
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('已复制到剪贴板')
  }
}

const copyAllDesign = async () => {
  if (!generatedDesign.value) return
  const d = generatedDesign.value
  let text = `《${d.basicInfo.topic}》教学设计方案\n\n`
  text += `一、课程基本信息\n`
  text += `课程主题：${d.basicInfo.topic}\n`
  text += `授课学科：${d.basicInfo.subject}\n`
  text += `授课年级：${d.basicInfo.grade}\n`
  text += `课时时长：${d.basicInfo.duration}分钟\n`
  text += `教学模式：${d.basicInfo.teachingMode}\n`
  text += `难度等级：${d.basicInfo.difficulty}\n\n`
  text += `二、教学目标\n`
  text += `【知识与技能】${d.goals.knowledge}\n`
  text += `【过程与方法】${d.goals.process}\n`
  text += `【情感态度与价值观】${d.goals.emotion}\n\n`
  text += `三、教学重难点\n`
  text += `教学重点：\n${d.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n`
  text += `教学难点：\n${d.difficultPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n`
  text += `四、教学准备\n`
  text += d.preparations.map((p, i) => `${i + 1}. ${p}`).join('\n') + '\n\n'
  text += `五、教学过程\n`
  d.teachingProcess.forEach((stage, i) => {
    text += `${i + 1}. ${stage.stage}（${stage.time}）\n`
    text += `   教师活动：${stage.teacherActivity}\n`
    text += `   学生活动：${stage.studentActivity}\n`
    text += `   设计意图：${stage.designIntent}\n\n`
  })
  text += `六、板书设计\n`
  text += `左侧（知识要点）：${d.blackboardDesign.left.join('、')}\n`
  text += `中间（核心内容）：${d.blackboardDesign.center}\n`
  text += `右侧（例题/练习）：${d.blackboardDesign.right.join('、')}\n\n`
  text += `七、教学评价与预期效果\n`
  text += `评价方式：${d.evaluation.methods.join('；')}\n`
  text += `预期效果：${d.evaluation.expectedEffects.join('；')}\n`
  text += `作业布置：${d.evaluation.homework.join('；')}\n\n`
  if (d.teachingReflection) {
    text += `八、教学反思建议\n`
    text += d.teachingReflection.map((p, i) => `${i + 1}. ${p}`).join('\n')
  }
  await copyText(text)
}

const exportDesign = () => {
  if (!generatedDesign.value) return
  const d = generatedDesign.value
  let text = `《${d.basicInfo.topic}》教学设计方案\n`
  text += '='.repeat(50) + '\n\n'
  text += `一、课程基本信息\n`
  text += `-`.repeat(30) + '\n'
  text += `课程主题：${d.basicInfo.topic}\n`
  text += `授课学科：${d.basicInfo.subject}\n`
  text += `授课年级：${d.basicInfo.grade}\n`
  text += `课时时长：${d.basicInfo.duration}分钟\n`
  text += `教学模式：${d.basicInfo.teachingMode}\n`
  text += `难度等级：${d.basicInfo.difficulty}\n\n`
  text += `二、教学目标\n`
  text += `-`.repeat(30) + '\n'
  text += `【知识与技能】\n${d.goals.knowledge}\n\n`
  text += `【过程与方法】\n${d.goals.process}\n\n`
  text += `【情感态度与价值观】\n${d.goals.emotion}\n\n`
  text += `三、教学重难点\n`
  text += `-`.repeat(30) + '\n'
  text += `▶ 教学重点：\n${d.keyPoints.map((p, i) => `   ${i + 1}. ${p}`).join('\n')}\n\n`
  text += `▶ 教学难点：\n${d.difficultPoints.map((p, i) => `   ${i + 1}. ${p}`).join('\n')}\n\n`
  text += `四、教学准备\n`
  text += `-`.repeat(30) + '\n'
  text += d.preparations.map((p, i) => `${i + 1}. ${p}`).join('\n') + '\n\n'
  text += `五、教学过程\n`
  text += `-`.repeat(30) + '\n'
  d.teachingProcess.forEach((stage, i) => {
    text += `\n【${i + 1}. ${stage.stage}】—— ${stage.time}\n`
    text += `  ▸ 教师活动：${stage.teacherActivity}\n`
    text += `  ▸ 学生活动：${stage.studentActivity}\n`
    text += `  ▸ 设计意图：${stage.designIntent}\n`
  })
  text += `\n\n六、板书设计\n`
  text += `-`.repeat(30) + '\n'
  text += `\t左侧（知识要点）\t\t中间（核心内容）\t\t右侧（例题练习）\n`
  text += `\t${d.blackboardDesign.left.join('\n\t')}\t\t${d.blackboardDesign.center}\t\t${d.blackboardDesign.right.join('\n\t\t\t')}\n\n`
  text += `七、教学评价与预期效果\n`
  text += `-`.repeat(30) + '\n'
  text += `\n▶ 课堂评价方式：\n${d.evaluation.methods.map((p, i) => `   ${i + 1}. ${p}`).join('\n')}\n`
  text += `\n▶ 预期效果：\n${d.evaluation.expectedEffects.map((p, i) => `   ${i + 1}. ${p}`).join('\n')}\n`
  text += `\n▶ 作业布置：\n${d.evaluation.homework.map((p, i) => `   ${i + 1}. ${p}`).join('\n')}\n\n`
  if (d.teachingReflection && d.teachingReflection.length > 0) {
    text += `八、教学反思建议\n`
    text += `-`.repeat(30) + '\n'
    text += d.teachingReflection.map((p, i) => `${i + 1}. ${p}`).join('\n')
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `教学设计_${d.basicInfo.topic}_${new Date().toISOString().split('T')[0]}.txt`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('教学设计方案已导出')
}

const resetAll = () => {
  formData.value = {
    topic: '',
    subject: '',
    grade: '',
    duration: 45,
    knowledgeGoal: '',
    processGoal: '',
    emotionGoal: '',
    teachingMode: 'heuristic',
    difficulty: 'medium'
  }
  generatedDesign.value = null
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
  generatedDesign.value = item.design
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
.teaching-design-generator {
  max-width: 1200px;
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
  padding: 8px 16px;
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

.header-actions {
  display: flex;
  gap: 8px;
}

.form-section {
  margin-bottom: 8px;
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

.section-title .el-tag {
  margin-left: 12px;
  font-weight: normal;
}

.basic-form {
  margin-bottom: 16px;
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
  font-weight: 500;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.sample-tag:hover {
  background: #ecf5ff;
  border-color: #165DFF;
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
}

.preference-label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.action-section {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  margin-top: 24px;
}

.generate-btn {
  min-width: 240px;
}

.btn-loading-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.generating-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  margin-top: 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 12px;
}

.generating-dots {
  display: flex;
  gap: 4px;
}

.generating-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #165DFF;
  animation: bounce 1.4s infinite ease-in-out both;
}

.generating-dots .dot:nth-child(1) { animation-delay: -0.32s; }
.generating-dots .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.generating-text {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.result-card {
  margin-bottom: 24px;
}

.design-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.section-header .el-icon {
  font-size: 20px;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.goal-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #fafafa;
  border-radius: 10px;
  border-left: 3px solid #165DFF;
}

.goal-item:nth-child(2) { border-left-color: #67c23a; }
.goal-item:nth-child(3) { border-left-color: #e6a23c; }

.goal-item p {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.7;
}

.keypoints-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.keypoint-card {
  padding: 16px;
  border-radius: 10px;
  background: #fafafa;
}

.keypoint-card.key-point {
  border: 1px solid #fde2e2;
}

.keypoint-card.difficult-point {
  border: 1px solid #faecd8;
}

.keypoint-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.keypoint-card ul {
  margin: 0;
  padding-left: 20px;
}

.keypoint-card li {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
}

.preparation-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.prep-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 14px;
  color: #606266;
}

.process-table {
  margin-top: 8px;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.activity-label {
  font-size: 12px;
  font-weight: 600;
  color: #165DFF;
}

.student-activity .activity-label {
  color: #67c23a;
}

.activity-content p {
  margin: 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.intent-content {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.blackboard-design {
  padding: 8px;
}

.blackboard {
  background: linear-gradient(135deg, #2d5016 0%, #1a3d0c 100%);
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.bb-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  padding-bottom: 16px;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.3);
  margin-bottom: 20px;
}

.bb-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 16px;
  min-height: 180px;
}

.bb-content h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #ffd666;
  text-align: center;
}

.bb-left,
.bb-center,
.bb-right {
  padding: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
}

.bb-content ul {
  margin: 0;
  padding-left: 18px;
}

.bb-content li {
  font-size: 13px;
  color: #e6e6e6;
  line-height: 1.8;
}

.bb-main-point {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  line-height: 1.8;
  white-space: pre-line;
}

.evaluation-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.eval-card {
  padding: 16px;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #ebeef5;
}

.eval-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.eval-card ul {
  margin: 0;
  padding-left: 18px;
}

.eval-card li {
  font-size: 13px;
  color: #606266;
  line-height: 1.7;
  margin-bottom: 6px;
}

.reflection-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reflection-tip {
  margin: 0;
}

.history-card {
  margin-bottom: 24px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  background: #f0f7ff;
  transform: translateX(4px);
}

.history-time {
  font-size: 12px;
  color: #909399;
  min-width: 100px;
}

.history-topic {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.history-text {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.history-footer {
  text-align: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

@media (max-width: 900px) {
  .expectation-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .keypoints-container {
    grid-template-columns: 1fr;
  }

  .preparation-list {
    grid-template-columns: 1fr;
  }

  .evaluation-container {
    grid-template-columns: 1fr;
  }

  .bb-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .expectation-grid {
    grid-template-columns: 1fr;
  }

  .scenario-tags {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .header-actions {
    width: 100%;
    margin-top: 8px;
  }
}
</style>
