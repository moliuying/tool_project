<template>
  <div class="fab-marketing-generator">
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
        <el-step title="选择产品品类" description="9大品类深度适配专属话术" />
        <el-step title="输入产品信息" description="产品名称、核心特性、目标用户" />
        <el-step title="设定输出偏好" description="场景 × 风格 × 版本数" />
        <el-step title="查看与复制" description="多版本FAB可对比可选" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Goods /></el-icon>
            <div class="exp-text">
              <div class="exp-num">9 大品类适配</div>
              <div class="exp-label">话术风格贴合品类特性</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">5 种文案风格</div>
              <div class="exp-label">数据型/情感型/对比型/场景型/权威型</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Grid /></el-icon>
            <div class="exp-text">
              <div class="exp-num">F→A→B 强关联</div>
              <div class="exp-label">三层语义连贯不脱节</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Collection /></el-icon>
            <div class="exp-text">
              <div class="exp-num">多版本并行</div>
              <div class="exp-label">1~3个版本对比择优</div>
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
          <span>FAB 营销文案生成</span>
          <el-tag size="small" type="warning">品类适配 · 多风格 · 多版本</el-tag>
        </div>
      </template>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Menu /></el-icon>
          <span>产品品类</span>
          <span class="required-tag">*</span>
          <el-tag size="small" type="info" class="hint-tag">
            不同品类的FAB表达逻辑完全不同
          </el-tag>
        </div>
        <div class="category-options">
          <div
            v-for="cat in categories"
            :key="cat.value"
            class="category-card"
            :class="{ active: selectedCategory === cat.value, disabled: isGenerating }"
            @click="!isGenerating && (selectedCategory = cat.value)"
          >
            <div class="cat-emoji">{{ cat.emoji }}</div>
            <div class="cat-name">{{ cat.label }}</div>
          </div>
        </div>
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Goods /></el-icon>
          <span>产品名称</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="productName"
          placeholder="例如：静享 Pro 主动降噪蓝牙耳机"
          maxlength="50"
          show-word-limit
          :disabled="isGenerating"
          clearable
        />
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Star /></el-icon>
          <span>核心特性（每行一个，建议 2~5 个）</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="featuresText"
          type="textarea"
          :rows="5"
          :placeholder="getFeaturePlaceholder()"
          :disabled="isGenerating"
          resize="vertical"
        />
        <div class="quick-samples">
          <span class="sample-label">📝 快速体验：</span>
          <el-tag
            v-for="(sample, i) in currentCategorySamples"
            :key="i"
            class="sample-tag"
            effect="plain"
            @click="applyProductSample(sample)"
          >
            {{ sample.name }}
          </el-tag>
        </div>
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><User /></el-icon>
          <span>目标用户画像</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="targetUser"
          type="textarea"
          :rows="2"
          placeholder="描述用户的年龄、身份、痛点、需求，例如：25-35岁城市通勤白领，每天地铁通勤1小时以上，注重音质和佩戴舒适度"
          maxlength="200"
          show-word-limit
          :disabled="isGenerating"
          resize="none"
        />
      </div>

      <div class="two-col-section">
        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><Grid /></el-icon>
            <span>使用场景</span>
          </div>
          <div class="scene-options-small">
            <div
              v-for="scene in scenes"
              :key="scene.value"
              class="scene-chip"
              :class="{ active: selectedScene === scene.value, disabled: isGenerating }"
              @click="!isGenerating && (selectedScene = scene.value)"
            >
              <span>{{ scene.emoji }}</span>
              <span>{{ scene.label }}</span>
            </div>
          </div>
        </div>

        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><MagicStick /></el-icon>
            <span>文案风格</span>
          </div>
          <div class="style-options">
            <div
              v-for="style in styles"
              :key="style.value"
              class="style-chip"
              :class="{ active: selectedStyle === style.value, disabled: isGenerating }"
              @click="!isGenerating && (selectedStyle = style.value)"
            >
              <span class="style-emoji">{{ style.emoji }}</span>
              <span class="style-label">{{ style.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="input-section">
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
              AI 正在基于「{{ getCategoryLabel(selectedCategory) }}」品类知识库生成 {{ versionCount }} 个版本…
            </span>
          </template>
          生成 FAB 营销文案
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
          ✨ 正在分析 {{ featuresList.length }} 个产品特性，通过 F→A→B 链式推导构建差异化说服逻辑…
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
            {{ getCategoryLabel(selectedCategory) }} · {{ getSceneLabel(selectedScene) }}
          </el-tag>
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
          <el-tag v-if="versionCount > 1" size="small" :type="getVersionTagType(idx)">
            {{ generatedResults[idx].styleTag }}
          </el-tag>
        </div>
      </div>

      <div v-if="currentResult" class="result-content">
        <div v-if="currentResult.opening" class="opening-section">
          <div class="section-title-sm">
            <el-icon color="#909399"><ChatDotRound /></el-icon>
            <span>开场白</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.opening)">复制</el-button>
          </div>
          <div class="opening-text">{{ currentResult.opening }}</div>
        </div>

        <div class="fab-list">
          <div
            v-for="(fab, index) in currentResult.fabList"
            :key="index"
            class="fab-item"
          >
            <div class="fab-header">
              <div class="fab-index">#{{ index + 1 }}</div>
              <div class="fab-feature-title">{{ fab.feature }}</div>
              <el-button size="small" text :icon="CopyDocument" @click="copyFab(fab)">复制本组</el-button>
            </div>

            <div class="fab-chain">
              <div class="fab-node fab-f">
                <div class="node-header">
                  <div class="node-tag tag-f">F</div>
                  <div class="node-title">Feature · 产品特征</div>
                </div>
                <div class="node-content">{{ fab.feature }}</div>
              </div>

              <div class="chain-link">
                <el-icon><Bottom /></el-icon>
                <span>{{ fab.linkAB }}</span>
              </div>

              <div class="fab-node fab-a">
                <div class="node-header">
                  <div class="node-tag tag-a">A</div>
                  <div class="node-title">Advantage · 功能优势</div>
                </div>
                <div class="node-content">{{ fab.advantage }}</div>
              </div>

              <div class="chain-link">
                <el-icon><Bottom /></el-icon>
                <span>{{ fab.linkBC }}</span>
              </div>

              <div class="fab-node fab-b">
                <div class="node-header">
                  <div class="node-tag tag-b">B</div>
                  <div class="node-title">Benefit · 用户利益</div>
                </div>
                <div class="node-content">{{ fab.benefit }}</div>
              </div>
            </div>

            <div v-if="fab.transition" class="fab-transition">
              <el-icon color="#e6a23c"><Promotion /></el-icon>
              <span>{{ fab.transition }}</span>
            </div>
          </div>
        </div>

        <div v-if="currentResult.closing" class="closing-section">
          <div class="section-title-sm">
            <el-icon color="#909399"><Flag /></el-icon>
            <span>结语 / Call to Action</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.closing)">复制</el-button>
          </div>
          <div class="closing-text">{{ currentResult.closing }}</div>
        </div>

        <div class="result-footer">
          <el-button type="primary" :icon="Download" @click="copyCurrentFull">
            复制完整话术（版本 {{ activeVersion + 1 }}）
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
          <div class="history-product">
            <el-tag size="small" type="info">{{ getCategoryLabel(item.category) }}</el-tag>
            <span class="history-text">{{ item.productName }}</span>
          </div>
          <div class="history-meta">
            <el-tag size="small">{{ getSceneLabel(item.scene) }}</el-tag>
            <el-tag size="small" type="success">{{ item.fabCount }}组FAB</el-tag>
            <el-tag size="small" type="warning">{{ item.versionCount }}个版本</el-tag>
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
  Goods,
  Star,
  User,
  Grid,
  MagicStick,
  Refresh,
  Loading,
  Finished,
  CopyDocument,
  Download,
  Clock,
  InfoFilled,
  Collection,
  ChatDotRound,
  Flag,
  Promotion,
  Menu,
  Document,
  Bottom,
  RefreshRight
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface FabItemV2 {
  feature: string
  advantage: string
  benefit: string
  linkAB: string
  linkBC: string
  transition?: string
}

interface FabResultV2 {
  opening: string
  fabList: FabItemV2[]
  closing: string
  styleTag: string
}

interface HistoryItem {
  productName: string
  featuresText: string
  targetUser: string
  category: string
  scene: string
  style: string
  results: FabResultV2[]
  fabCount: number
  versionCount: number
  time: string
}

interface ProductSample {
  name: string
  category: string
  productName: string
  features: string[]
  targetUser: string
}

const STORAGE_KEY = 'fab_marketing_history_v2'

const categories = [
  { value: 'digital', label: '数码电子', emoji: '📱' },
  { value: 'home', label: '家居日用', emoji: '🏠' },
  { value: 'beauty', label: '美妆个护', emoji: '💄' },
  { value: 'food', label: '食品饮料', emoji: '🍎' },
  { value: 'fashion', label: '服饰鞋包', emoji: '👕' },
  { value: 'baby', label: '母婴儿童', emoji: '👶' },
  { value: 'gift', label: '礼品文创', emoji: '🎁' },
  { value: 'edu', label: '教育培训', emoji: '📚' },
  { value: 'service', label: '服务咨询', emoji: '💼' }
]

const scenes = [
  { value: 'ecommerce', label: '电商详情页', emoji: '🛒' },
  { value: 'social', label: '朋友圈种草', emoji: '💬' },
  { value: 'launch', label: '产品发布稿', emoji: '📢' },
  { value: 'sales', label: '销售演示', emoji: '💼' }
]

const styles = [
  { value: 'data', label: '数据实证', emoji: '📊' },
  { value: 'emotion', label: '情感共鸣', emoji: '💗' },
  { value: 'contrast', label: '对比反差', emoji: '⚖️' },
  { value: 'scenario', label: '场景沉浸', emoji: '🎬' },
  { value: 'authority', label: '专业权威', emoji: '🏆' }
]

const versionOptions = [
  { value: 1, label: '1个', desc: '核心优选版' },
  { value: 2, label: '2个', desc: '两种风格对比' },
  { value: 3, label: '3个', desc: '多维度探索' }
]

const productSamples: ProductSample[] = [
  { name: '降噪耳机', category: 'digital', productName: '静享 Pro 主动降噪蓝牙耳机',
    features: ['40dB 深度主动降噪', '45小时超长续航', '蓝牙5.3芯片稳定连接', '人体工学半入耳设计'],
    targetUser: '25-35岁城市通勤白领，每天地铁通勤1小时以上，注重音质和佩戴舒适度' },
  { name: '保温杯', category: 'home', productName: '极地保温壶 316不锈钢保温杯',
    features: ['316医用级不锈钢内胆', '24小时长效保温保冷', '500ml轻便容量', '一键弹盖单手操作'],
    targetUser: '办公室上班族和户外爱好者，注重饮水健康和便携性' },
  { name: '精华液', category: 'beauty', productName: '焕颜修护精华液 30ml',
    features: ['99%高纯度烟酰胺', '三重玻尿酸分子', '0添加酒精香精', '临床验证28天提亮'],
    targetUser: '25-40岁女性，肤色暗黄有痘印，追求温和有效护肤' },
  { name: '坚果礼盒', category: 'food', productName: '每日坚果混合礼盒 750g',
    features: ['6种进口坚果果干', '低温烘焙非油炸', '无添加盐糖', '独立小包装30袋'],
    targetUser: '注重健康的上班族和宝妈，日常代餐或下午茶零食' },
  { name: '职业西装', category: 'fashion', productName: '精英系列男士修身西装套装',
    features: ['澳洲进口羊毛面料', '意式手工剪裁', '防皱免烫工艺', '3D立体收腰版型'],
    targetUser: '28-45岁职场商务人士，经常参加会议和商务场合' },
  { name: '婴儿面霜', category: 'baby', productName: '婴儿多效修护面霜 50g',
    features: ['食品级原料配方', '通过皮肤科敏感测试', '0激素0防腐剂', '仿生胎脂修护技术'],
    targetUser: '0-3岁宝宝的妈妈，宝宝肌肤娇嫩易过敏，追求安全温和' },
  { name: '手工香薰蜡烛', category: 'gift', productName: '手作香薰蜡烛礼盒 · 栀子花香',
    features: ['纯手工灌蜡制作', '天然大豆蜡原料', '专属烫金贺卡定制', '复古丝绒礼盒包装'],
    targetUser: '20-35岁女性，送礼给闺蜜/爱人/妈妈，追求仪式感和专属心意' },
  { name: '定制手账本', category: 'gift', productName: '真皮定制手账本 · 可刻字',
    features: ['头层牛皮手工缝制', '封面可刻名字/纪念日', '内页180°平摊设计', '附赠复古黄铜笔'],
    targetUser: '25-40岁文艺爱好者和职场人，送给重要的人作为纪念礼物' },
  { name: '英语课程', category: 'edu', productName: '商务英语实战训练营',
    features: ['北美外教1对1授课', '真实商务场景模拟', '个性化学习路径', '30天不满意全额退'],
    targetUser: '25-35岁职场人，有英语基础但不敢开口，需提升商务沟通能力' },
  { name: '品牌咨询', category: 'service', productName: '企业品牌战略咨询服务',
    features: ['10年以上资深顾问团队', '服务过500+知名企业', '定制化全案方案', '90天陪跑落地'],
    targetUser: '成长型企业创始人，品牌遇到增长瓶颈，需要系统性升级' }
]

type KnowledgeData = { actions: string[]; pains: string[]; benefits: { life: string; feeling: string } }
type CategoryKnowledge = {
  featureFocus: string[]; advantageVerbs: string[]; benefitAngles: string[]
  linkABPhrases: string[]; linkBCPhrases: string[]
  painPoints: string[]; scenarioPairs: Array<{ s1: string; s2: string }>
  valuePropositions: string[]; keywordMap: Record<string, KnowledgeData>
}

const buildKnowledge = (): Record<string, CategoryKnowledge> => ({
  digital: {
    featureFocus: ['技术参数', '芯片方案', '认证标准', '制造工艺'],
    advantageVerbs: ['提升', '加速', '优化', '降低', '增强', '实现', '支持', '保障'],
    benefitAngles: ['效率提升', '体验升级', '时间节省', '生产力', '省心安心'],
    linkABPhrases: ['这意味着…', '从而能够…', '直接带来的效果是…', '换算成实际体验就是…'],
    linkBCPhrases: ['对你来说…', '最终让你…', '落到日常使用就是…', '核心价值在于…'],
    painPoints: ['传统产品性能不足', '操作繁琐不智能', '续航/稳定性差', '兼容性问题'],
    scenarioPairs: [{ s1: '高强度工作中', s2: '休闲娱乐时' }, { s1: '外出差旅途中', s2: '日常办公场景' }],
    valuePropositions: ['科技赋能生活', '效率革命', '旗舰级体验'],
    keywordMap: {
      '降噪': { actions: ['实时侦测并抵消环境噪音', '打造独立静谧声场', '让噪音降低至几乎不可察觉'],
        pains: ['通勤路上地铁轰鸣无法安静', '办公室背景杂音让人无法专心'],
        benefits: { life: '随时随地拥有安静的私人空间', feeling: '专注沉浸、心无旁骛' } },
      '续航': { actions: ['一次充电满足多日重度使用', '彻底告别电量焦虑', '短途出差不用带充电器'],
        pains: ['出门必带充电宝', '关键时候没电关机'],
        benefits: { life: '随时想用就用，不用惦记充电这件事', feeling: '安心从容、无拘无束' } },
      '蓝牙': { actions: ['毫秒级连接响应', '音画完全同步无延迟', '穿墙也能稳定连接'],
        pains: ['频繁断连卡顿', '看视频声音画面不同步'],
        benefits: { life: '连接稳定得像有线一样可靠', feeling: '顺畅自如、毫无干扰' } },
      '防水': { actions: ['日常泼溅雨淋完全不用担心', '可直接用水冲洗清洁', '运动大汗也不怕损坏'],
        pains: ['碰水就容易坏', '清洁保养麻烦'],
        benefits: { life: '各种环境下都能放心使用', feeling: '省心无畏、随性使用' } },
      '智能': { actions: ['自动识别场景并调节到最佳状态', '越用越懂你的习惯', '省去繁琐设置步骤'],
        pains: ['功能多但不会用', '每次都要手动调节'],
        benefits: { life: '像有个贴心管家在默默服务', feeling: '科技感、便捷感' } }
    }
  },
  home: {
    featureFocus: ['材质等级', '安全认证', '工艺细节', '耐用性'],
    advantageVerbs: ['呵护', '守护', '陪伴', '简化', '提升', '保障', '点缀'],
    benefitAngles: ['家庭安心', '生活品质', '日常便捷', '长期耐用', '健康安全'],
    linkABPhrases: ['也就是说…', '日常体现为…', '直接给你带来…', '在家就能感受到…'],
    linkBCPhrases: ['对一家人来说…', '长远看就是…', '真正改善的是…', '每天都能体会到…'],
    painPoints: ['材质不安全有隐患', '用不久就坏浪费钱', '设计不合理用着累', '清洁维护麻烦'],
    scenarioPairs: [{ s1: '忙碌的工作日早晨', s2: '悠闲的周末午后' }, { s1: '家人团聚用餐时', s2: '一个人放松的时刻' }],
    valuePropositions: ['品质生活从家开始', '安心之选', '耐用才是真省钱'],
    keywordMap: {
      '不锈钢': { actions: ['抗腐蚀不生锈，长期使用依然如新', '无重金属析出，安全接触食物', '坚固耐摔不易变形'],
        pains: ['廉价材质有异味', '用几个月就生锈漏水'],
        benefits: { life: '每天入口的东西安全放心，一个能用好多年', feeling: '踏实、安心' } },
      '保温': { actions: ['24小时温度都恰到好处', '冰的不化、热的不凉', '春夏秋冬四季适用'],
        pains: ['想喝热水时已经凉了', '冷饮很快就变常温'],
        benefits: { life: '随时能喝到温度刚好的水/饮品', feeling: '温暖贴心、小确幸' } },
      '一键': { actions: ['单手就能轻松操作', '老人小孩也能一学就会', '不用费力拧开拧紧'],
        pains: ['盖子太紧要两只手拧', '开车时想喝水太危险'],
        benefits: { life: '用起来顺手省力，完全不需要学习成本', feeling: '方便、贴心' } },
      '食品级': { actions: ['达到接触食品的最高安全标准', '无异味无有害析出', '婴儿用品级别的安全'],
        pains: ['便宜的材质一加热就有味道', '担心长期使用不健康'],
        benefits: { life: '家人每天使用完全不用担心安全问题', feeling: '放心、踏实' } }
    }
  },
  beauty: {
    featureFocus: ['成分纯度', '配方技术', '临床验证', '肤感体验'],
    advantageVerbs: ['修护', '焕亮', '滋养', '改善', '强韧', '匀净', '紧致', '舒缓'],
    benefitAngles: ['肌肤改善', '自信提升', '素颜也美', '温和安心', '效果可见'],
    linkABPhrases: ['上脸之后…', '坚持使用你会发现…', '肌肤真正感受到的是…', '带来的改变是…'],
    linkBCPhrases: ['照镜子时你会…', '出门时的状态是…', '最重要的是…', '自信来源于…'],
    painPoints: ['用了没效果浪费钱', '刺激过敏烂脸', '成分不安全有依赖', '肤感差搓泥闷痘'],
    scenarioPairs: [{ s1: '清晨护肤上妆前', s2: '夜间修护黄金期' }, { s1: '重要约会/面试前', s2: '日常素颜通勤时' }],
    valuePropositions: ['看得见的改变', '科学护肤不盲目', '温和且有效'],
    keywordMap: {
      '烟酰胺': { actions: ['均匀提亮肤色，改善暗沉黄气', '强化肌肤屏障，减少水分流失', '细腻毛孔，肌肤更平滑'],
        pains: ['熬夜后脸色蜡黄没气色', '肤色不均上妆斑驳'],
        benefits: { life: '素颜也透亮有光泽，不用厚厚粉底也敢出门', feeling: '自信、好气色' } },
      '玻尿酸': { actions: ['层层渗透补水，从表皮到肌底都水润', '锁住水分不流失，整天都饱满', '干纹细纹被撑起来，肌肤更澎润'],
        pains: ['冬天脱皮卡粉', '外油内干越补越油'],
        benefits: { life: '肌肤喝饱水的澎润感，化妆再也不卡粉起皮', feeling: '水润、澎弹、年轻感' } },
      '0添加': { actions: ['不含酒精香精防腐剂，不给肌肤添负担', '敏感肌也能安心使用', '温和不刺激，烂脸期也能用'],
        pains: ['一用护肤品就泛红刺痛', '孕期/敏感期不敢随便用'],
        benefits: { life: '护肤变成享受而不是冒险，怎么用都安心', feeling: '安心、无负担' } },
      '临床': { actions: ['经过大量真人测试验证有效', '数据说话不是概念营销', '效果可量化可感知'],
        pains: ['网红产品吹上天但没效果', '花了钱却看不到改变'],
        benefits: { life: '每一分钱都花在看得见的效果上', feeling: '踏实、值得' } }
    }
  },
  food: {
    featureFocus: ['原料产地', '工艺方式', '营养成分', '新鲜程度'],
    advantageVerbs: ['保留', '锁住', '还原', '带来', '提供', '满足', '呵护'],
    benefitAngles: ['味觉享受', '健康益处', '放心安心', '方便快捷', '营养补充'],
    linkABPhrases: ['吃到嘴里就是…', '口感上体现为…', '每一口都是…', '带来的风味是…'],
    linkBCPhrases: ['从内到外让你…', '长期食用能…', '享受美食的同时…', '满足的不仅是嘴馋更是…'],
    painPoints: ['不健康吃了有负罪感', '添加剂太多不敢给家人吃', '口感差不好吃', '不新鲜变味'],
    scenarioPairs: [{ s1: '忙碌时的快速代餐', s2: '闲暇时的味蕾享受' }, { s1: '给孩子的营养补充', s2: '自己的解馋小食' }],
    valuePropositions: ['好吃又健康', '真材实料', '安心美味'],
    keywordMap: {
      '烘焙': { actions: ['低温慢烤非油炸，更少油脂更健康', '保留食材本身的香气和营养', '酥脆不油腻，多吃也不腻'],
        pains: ['油炸的太油有负罪感', '吃多了上火长痘'],
        benefits: { life: '嘴馋时放开吃也没有心理负担，酥脆好吃又健康', feeling: '满足、无负罪感' } },
      '无添加': { actions: ['没有防腐剂香精色素，配料表干净', '原原本本的食材本味', '老人小孩孕妇都能放心吃'],
        pains: ['一看配料表全是化学名词', '不敢给孩子随便吃零食'],
        benefits: { life: '给家人吃什么都放心，享受纯粹的食材美味', feeling: '安心、踏实' } },
      '独立包装': { actions: ['一次一袋刚刚好，不会受潮变味', '揣包里带出门超方便', '控制分量不会一次吃太多'],
        pains: ['打开一大包吃不完就软了', '出门带零食太麻烦'],
        benefits: { life: '上班/出游/健身随手带，想吃就吃刚刚好', feeling: '方便、省心' } },
      '进口': { actions: ['精选全球优质产地原料', '品种更优风味更浓郁', '严格品控品质有保障'],
        pains: ['普通货口感一般', '想吃好的又买不到'],
        benefits: { life: '不用出国也能尝到世界各地的优质美味', feeling: '品质感、小确幸' } }
    }
  },
  fashion: {
    featureFocus: ['面料材质', '剪裁工艺', '设计细节', '版型适配'],
    advantageVerbs: ['修饰', '衬托', '彰显', '提升', '赋予', '打造', '凸显'],
    benefitAngles: ['形象加分', '场合自信', '舒适自在', '品质感', '百搭实穿'],
    linkABPhrases: ['穿上身后…', '体现在细节上就是…', '呈现出的效果是…', '气质上的提升在于…'],
    linkBCPhrases: ['照镜子时你会发现…', '出席场合时带给你的是…', '真正的价值在于…', '别人眼中的你是…'],
    painPoints: ['版型差显胖显矮', '面料廉价感不上档次', '洗几次就变形起球', '只能穿一季不百搭'],
    scenarioPairs: [{ s1: '重要商务会议', s2: '日常通勤上班' }, { s1: '周末约会聚餐', s2: '正式活动场合' }],
    valuePropositions: ['穿出你的气场', '经典不过时', '品质感穿搭'],
    keywordMap: {
      '羊毛': { actions: ['高级面料自带垂坠质感', '保暖性好但不臃肿', '透气亲肤不闷汗'],
        pains: ['廉价料一看就不上档次', '冬天穿得厚像熊'],
        benefits: { life: '冬天也能轻薄有型，面料质感就是你的隐形名片', feeling: '高级感、体面' } },
      '剪裁': { actions: ['修饰身形扬长避短', '该收的收该放的放', '穿上就像量身定做'],
        pains: ['衣服版型差显胖显矮', '买回来穿几次就不想穿了'],
        benefits: { life: '身材优点被放大、小缺点被悄悄修饰，怎么穿都好看', feeling: '自信、得体' } },
      '防皱': { actions: ['久坐办公室也不皱巴巴', '出差折叠放行李箱拿出来就平整', '免熨烫省心省力'],
        pains: ['早上起来还要熨衣服', '坐久了满身褶子太尴尬'],
        benefits: { life: '任何时刻都保持平整有型，省去打理的麻烦', feeling: '从容、省心' } },
      '立体': { actions: ['3D立体剪裁贴合身形', '活动自如不紧绷', '穿上显瘦5斤的视觉效果'],
        pains: ['西装太板正活动不开', '腰身松垮没型显邋遢'],
        benefits: { life: '好看又好穿，正式场合有型、日常通勤也不累', feeling: '舒适又体面' } }
    }
  },
  baby: {
    featureFocus: ['安全等级', '温和低敏', '适龄设计', '权威认证'],
    advantageVerbs: ['呵护', '守护', '温柔', '安心', '陪伴', '保护', '滋养'],
    benefitAngles: ['宝宝健康', '妈妈放心', '温和不刺激', '省心省力', '发育友好'],
    linkABPhrases: ['对宝宝娇嫩肌肤来说…', '妈妈能感受到的是…', '实际体现为…', '带来的安心感是…'],
    linkBCPhrases: ['最让妈妈欣慰的是…', '宝宝舒服了妈妈才…', '这份安心就是…', '长期来看守护的是…'],
    painPoints: ['不安全有激素', '刺激过敏红屁股/湿疹', '设计不合理使用麻烦', '味道太大刺鼻'],
    scenarioPairs: [{ s1: '宝宝日常护理', s2: '换季敏感期呵护' }, { s1: '外出便携使用', s2: '居家深度护理' }],
    valuePropositions: ['妈妈的安心之选', '温和守护成长', '安全第一'],
    keywordMap: {
      '食品级': { actions: ['吃进嘴里也完全安全的级别', '无任何有害添加', '真正达到可入口标准'],
        pains: ['宝宝抓到什么都往嘴里塞太担心', '成分表看不懂不敢买'],
        benefits: { life: '就算宝宝不小心吃到也不用慌，真正放心给宝宝用', feeling: '安心、踏实' } },
      '敏感': { actions: ['通过皮肤科/儿科低敏测试', '专为敏感肌宝宝研发', '不含已知致敏成分'],
        pains: ['一用就泛红起疹子', '宝宝肌肤太娇嫩不知道选什么'],
        benefits: { life: '宝宝舒服不哭闹，妈妈不用再为过敏问题焦虑', feeling: '放心、安心' } },
      '0激素': { actions: ['无激素无抗生素无药物成分', '温和不依赖，长期使用也安全', '只做呵护不做干预'],
        pains: ['见效快的怕有激素', '不敢长期用怕有副作用'],
        benefits: { life: '每天用都不用担心副作用，宝宝健康成长最重要', feeling: '放心、无顾虑' } },
      '仿生': { actions: ['模拟母体胎脂/羊水环境', '给宝宝最熟悉的温柔触感', '减少新世界带来的刺激'],
        pains: ['宝宝出生后不适应总哭闹', '普通产品太刺激'],
        benefits: { life: '像妈妈的呵护一样温柔，帮助宝宝平滑过渡到新世界', feeling: '温柔、安心' } }
    }
  },
  edu: {
    featureFocus: ['师资背景', '教学体系', '学习方法', '效果保障'],
    advantageVerbs: ['掌握', '突破', '构建', '提升', '实现', '加速', '夯实'],
    benefitAngles: ['能力提升', '职业发展', '时间节省', '系统掌握', '结果可预期'],
    linkABPhrases: ['落实到学习中就是…', '对你的实际帮助是…', '真正学完能做到的是…', '区别于普通课程的是…'],
    linkBCPhrases: ['最终带给你的改变是…', '在职场上的体现是…', '长期价值在于…', '投资自己的回报是…'],
    painPoints: ['学了很多但用不上', '课程零散不成体系', '没人监督坚持不下来', '花钱学不到真东西'],
    scenarioPairs: [{ s1: '日常通勤碎片化学习', s2: '周末集中深度学习' }, { s1: '应对重要面试/考核', s2: '长期能力系统提升' }],
    valuePropositions: ['投资自己是最好的投资', '系统学习不走弯路', '学到就是赚到'],
    keywordMap: {
      '1对1': { actions: ['量身定制学习计划不浪费时间', '学习问题当场解决不堆积', '老师全程关注你的进度'],
        pains: ['大班课跟不上也不敢问', '学完一堆疑问没人解答'],
        benefits: { life: '学习效率翻倍，花的每一分钟都有明确收获', feeling: '高效、被关注' } },
      '实战': { actions: ['不是纸上谈兵，直接模拟真实场景', '学完就能用在工作/生活中', '案例全部来自真实业务'],
        pains: ['学了一堆理论但不会用', '遇到真实场景还是懵'],
        benefits: { life: '学完立刻能上手解决实际问题，学费很快就能赚回来', feeling: '实用、有底气' } },
      '个性化': { actions: ['根据你的基础和目标定制路径', '不浪费时间在已经会的内容上', '薄弱环节重点突破'],
        pains: ['所有人学一样的太慢', '花了钱学不到自己真正需要的'],
        benefits: { life: '只为你需要的内容付费，花最少的时间获得最大提升', feeling: '高效、精准' } },
      '不满意': { actions: ['敢承诺退款说明对效果有信心', '实在学不会也没有损失', '没有后顾之忧放心投入学习'],
        pains: ['报了课发现不合适钱打水漂', '担心被割韭菜'],
        benefits: { life: '零风险试错，不满意就退，大不了损失一点时间', feeling: '安心、无风险' } }
    }
  },
  service: {
    featureFocus: ['团队资历', '成功案例', '方法论', '服务流程'],
    advantageVerbs: ['解决', '驱动', '赋能', '实现', '落地', '保障', '加速'],
    benefitAngles: ['问题解决', '业务增长', '效率提升', '风险降低', '长期价值'],
    linkABPhrases: ['落地到您的业务中就是…', '为您带来的实际价值是…', '区别于同行的核心优势是…', '体现在合作中的是…'],
    linkBCPhrases: ['最终体现在您的财报上是…', '长期来看为您建立的是…', '更重要的战略意义在于…', '核心价值在于…'],
    painPoints: ['方案不落地没法执行', '顾问团队资历不够', '只给报告不陪跑', '费用不透明效果难衡量'],
    scenarioPairs: [{ s1: '业务增长瓶颈期', s2: '战略升级转型期' }, { s1: '新项目启动阶段', s2: '成熟业务优化阶段' }],
    valuePropositions: ['用结果说话', '落地才是硬道理', '资深团队保驾护航'],
    keywordMap: {
      '资深': { actions: ['平均10年+行业经验，踩过的坑比你走过的路多', '服务过同行业大量客户，知道什么真正有效'],
        pains: ['找的顾问还没自己懂行', '方案太理想化脱离实际'],
        benefits: { life: '站在大量前人经验的肩膀上，避开90%的坑', feeling: '踏实、有底气' } },
      '定制': { actions: ['不套模板，每个方案从零开始为您量身打造', '深入调研您的业务而不是行业通用模板'],
        pains: ['花大价钱买回来一套通用PPT', '方案看着好但没法用'],
        benefits: { life: '每一分咨询费都花在解决您的具体问题上', feeling: '专属感、被重视' } },
      '陪跑': { actions: ['不是交完报告就走人，全程跟进落地执行', '遇到问题随时调整方向'],
        pains: ['咨询公司做完就消失', '内部团队推不动落不了地'],
        benefits: { life: '从方案到落地全程有人带，不会做着做着就走偏', feeling: '省心、有保障' } },
      '500+': { actions: ['被众多客户反复验证的方法论', '不同行业的最佳实践都能借鉴'],
        pains: ['没人做过的事担心踩雷', '小规模团队没见过大场面'],
        benefits: { life: '大量成功案例背书，方法论经过充分验证，放心合作', feeling: '可靠、有保障' } }
    }
  },
  gift: {
    featureFocus: ['手作温度', '专属定制', '仪式感', '情感寄托'],
    advantageVerbs: ['承载', '传递', '诉说', '见证', '陪伴', '珍藏', '诠释'],
    benefitAngles: ['心意被看见', '情感被珍藏', '专属仪式感', '回忆的载体', '独一无二的感动'],
    linkABPhrases: ['这里面藏着的是…', '每一处细节都在诉说…', '不只是一件物品，更是…', '当TA收到时会感受到…'],
    linkBCPhrases: ['对TA来说…', '这份心意会变成…', '多年以后回望，你会发现…', '最珍贵的不是物品而是…'],
    painPoints: ['送的礼物千篇一律没心意', '对方收到转头就忘了', '花了钱却没感受到重视', '重要的日子缺了仪式感'],
    scenarioPairs: [{ s1: '生日纪念日的惊喜时刻', s2: '平平无奇的日常小确幸' }, { s1: '即将分别的临别赠礼', s2: '久别重逢的见面礼' }],
    valuePropositions: ['心意才是最好的礼物', '让每个重要时刻都被记住', '独一无二的心意之选'],
    keywordMap: {
      '手工': { actions: ['每一件都是手作人倾注时间的作品，带着机器无法复制的温度', '每一处细微的不完美，正是手作独有的印记和诚意', '从选材到成品，经过手作人反复打磨的用心'],
        pains: ['量产货冰冷没有灵魂', '送出去的礼物和别人撞款'],
        benefits: { life: 'TA拿到手就能感受到你花的心思，这是多少钱都买不来的诚意', feeling: '被重视、独一无二' } },
      '定制': { actions: ['刻着TA的名字/你们的纪念日，这是全世界独一份的专属', '把说不出口的话，悄悄藏进礼物里', '为你们之间的故事，留下专属的印记'],
        pains: ['送的礼物看不出是专门为TA准备的', '心意无法精准传达'],
        benefits: { life: '每当TA看到这件礼物，就会想起你和那个重要的时刻', feeling: '被放在心上、专属感' } },
      '礼盒': { actions: ['层层拆开的不只是包装，更是你精心铺垫的心意与惊喜', '拆开的那一刻，仪式感就已经拉满了', '从视觉到触感，每一个细节都在诉说"你值得"'],
        pains: ['礼物裸着送太随意', '缺少拆礼物的期待感'],
        benefits: { life: '拆礼物的瞬间变成值得记住的美好时刻，连拍照片都特别好看', feeling: '仪式感、被珍视' } },
      '天然': { actions: ['甄选天然原料，对肌肤和环境都温柔友好', '自然的香气/触感，不刺激不廉价', '带着大自然本身的质朴与美好'],
        pains: ['廉价材质闻着刺鼻', '担心对身体不好'],
        benefits: { life: '用起来安心舒服，就像你的关心一样不刻意但贴心', feeling: '安心、温暖' } },
      '刻字': { actions: ['把想说的话、重要的日子、专属的昵称永久留存', '文字让礼物有了记忆和故事', '每次看到都能想起你写这句话时的心意'],
        pains: ['礼物用旧了就被遗忘', '心意无法长久留存'],
        benefits: { life: '时光会流逝，但刻下的字和藏在里面的心意不会褪色', feeling: '永恒、被记住' } },
      '手缝': { actions: ['每一针每一线都缝进了你的牵挂和祝福', '机器做不来的慢工细活，是心意最好的证明', '带着手作人的温度，不是千篇一律的流水线产物'],
        pains: ['流水线产品没有灵魂', '花了钱也看不出用心'],
        benefits: { life: 'TA用的时候会想起，这世界上有人愿意花时间，一针一线为TA准备礼物', feeling: '被爱、被用心对待' } }
    }
  }
})

const categoryKnowledgeBase = buildKnowledge()

const styleKnowledge = {
  data: { tag: '数据实证', starters: ['数据显示，', '实测结果表明，', '对比发现，', '量化来看，'] },
  emotion: { tag: '情感共鸣', starters: ['你有没有过这种时刻…', '想象一下，', '每个人都渴望，', '最打动人心的是，'] },
  contrast: { tag: '对比反差', starters: ['用之前 vs 用之后：', '告别过去那种，', '从此不再，', '不同于传统，'] },
  scenario: { tag: '场景沉浸', starters: ['想象这个画面：', '当你，', '就在那一刻，', '无论是还是，'] },
  authority: { tag: '专业权威', starters: ['业内公认，', '专业角度看，', '根据长期验证，', '核心原理是，'] }
}

const productName = ref('')
const featuresText = ref('')
const targetUser = ref('')
const selectedCategory = ref('digital')
const selectedScene = ref('ecommerce')
const selectedStyle = ref('data')
const versionCount = ref(2)
const isGenerating = ref(false)
const generatedResults = ref<FabResultV2[]>([])
const activeVersion = ref(0)
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const featuresList = computed(() => featuresText.value.split('\n').map(f => f.trim()).filter(f => f.length > 0))
const currentCategorySamples = computed(() => productSamples.filter(s => s.category === selectedCategory.value))
const currentStep = computed(() => {
  if (generatedResults.value.length > 0 && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (productName.value || featuresText.value) return 1
  return 0
})
const canGenerate = computed(() => productName.value.trim().length > 0 && featuresList.value.length > 0 && targetUser.value.trim().length > 0)
const currentResult = computed(() => generatedResults.value[activeVersion.value] || null)
const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const getCategoryLabel = (v: string) => categories.find(c => c.value === v)?.label || v
const getSceneLabel = (v: string) => scenes.find(s => s.value === v)?.label || v
const getVersionTagType = (idx: number): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const types: Array<'' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = ['primary', 'success', 'warning']
  return types[idx % types.length]
}

const getFeaturePlaceholder = () => {
  const examples: Record<string, string> = {
    digital: '例如：\n40dB 深度主动降噪\n45小时超长续航\n蓝牙5.3芯片稳定连接',
    home: '例如：\n316医用级不锈钢内胆\n24小时长效保温保冷\n一键弹盖单手操作',
    beauty: '例如：\n99%高纯度烟酰胺\n三重玻尿酸分子\n0添加酒精香精',
    food: '例如：\n6种进口坚果果干\n低温烘焙非油炸\n独立小包装30袋',
    fashion: '例如：\n澳洲进口羊毛面料\n意式手工剪裁\n防皱免烫工艺',
    baby: '例如：\n食品级原料配方\n通过皮肤科敏感测试\n0激素0防腐剂',
    gift: '例如：\n纯手工灌蜡制作\n封面可刻名字/纪念日\n复古丝绒礼盒包装',
    edu: '例如：\n北美外教1对1授课\n真实商务场景模拟\n30天不满意全额退',
    service: '例如：\n10年以上资深顾问团队\n服务过500+知名企业\n90天陪跑落地'
  }
  return examples[selectedCategory.value] || examples.digital
}

const applyProductSample = (sample: ProductSample) => {
  selectedCategory.value = sample.category
  productName.value = sample.productName
  featuresText.value = sample.features.join('\n')
  targetUser.value = sample.targetUser
}

const matchKeywordInKnowledge = (feature: string, category: string) => {
  const kb = categoryKnowledgeBase[category]
  if (!kb) return null
  for (const [key, val] of Object.entries(kb.keywordMap)) {
    if (feature.includes(key)) return { key, data: val }
  }
  return null
}

const extractFeatureType = (feature: string, category?: string): 'tech' | 'material' | 'process' | 'design' | 'service' | 'emotion' | 'generic' => {
  if (category === 'gift' || /手工|手作|手缝|定制|刻字|礼盒|纪念|专属|仪式|心意|礼物|限量|独家/i.test(feature)) return 'emotion'
  if (/[\d.]+(dB|小时|mAh|ml|m³|万|次|天|级|nm|K|Hz|%)/i.test(feature) || /蓝牙[\d.]|IPX\d|HEPA/i.test(feature)) return 'tech'
  if (/不锈钢|棉|羊毛|面料|成分|原料|材质/i.test(feature)) return 'material'
  if (/烘焙|工艺|技术|配方|剪裁/i.test(feature)) return 'process'
  if (/设计|版型|人体工学|一键|独立包装/i.test(feature)) return 'design'
  if (/服务|团队|陪跑|咨询|授课/i.test(feature)) return 'service'
  return 'generic'
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const generateAdvantageFromFeature = (feature: string, category: string, style: string): string => {
  const kb = categoryKnowledgeBase[category]
  const matched = matchKeywordInKnowledge(feature, category)
  const styleInfo = styleKnowledge[style as keyof typeof styleKnowledge]
  const starter = pick(styleInfo.starters)

  if (matched) {
    const action = pick(matched.data.actions)
    if (style === 'contrast' || style === 'data') {
      const pain = pick(matched.data.pains)
      return `${starter}告别了「${pain}」的烦恼，${action}`
    }
    return `${starter}${action}`
  }

  const ftype = extractFeatureType(feature, category)
  const verb = pick(kb?.advantageVerbs || ['提升', '实现', '带来'])

  const templatesByType: Record<string, string[]> = {
    tech: [`基于${feature}，产品能够${verb}整体性能表现`, `搭载${feature}技术，在核心体验上实现质的飞跃`],
    material: [`甄选${feature}，从源头${verb}品质感和耐用性`, `${feature}的运用，让产品在质感和安全性上都更有保障`],
    process: [`经过${feature}，产品在细节处理上更${verb}用户期待`, `${feature}的工艺，让每一件出品都达到更高标准`],
    design: [`${feature}的人性化设计，真正从用户角度${verb}使用便捷性`, `精心打磨的${feature}，在实际使用中处处${verb}体验感`],
    service: [`${feature}的服务体系，全程${verb}客户获得预期结果`, `提供${feature}，为每一个环节${verb}可靠保障`],
    emotion: [
      `${feature}，藏着你说不出口的心意与牵挂`,
      `看似只是${feature}，实则是一份愿意花时间的用心`,
      `${feature}的背后，是你把TA放在心上的最好证明`
    ],
    generic: [`${feature}，有效${verb}整体使用体验`, `配置${feature}，为用户带来更${verb}的价值`]
  }
  return starter + pick(templatesByType[ftype])
}

const generateBenefitFromAdvantage = (feature: string, category: string, style: string): string => {
  const kb = categoryKnowledgeBase[category]
  const matched = matchKeywordInKnowledge(feature, category)
  const ftype = extractFeatureType(feature, category)

  if (matched && kb) {
    const { life, feeling } = matched.data.benefits
    const scenarios = pick(kb.scenarioPairs)
    if (style === 'scenario' || style === 'emotion') {
      return `${pick(styleKnowledge[style as keyof typeof styleKnowledge].starters)}${scenarios.s1}还是${scenarios.s2}，都能${life}，${feeling}的体验不言而喻`
    }
    if (style === 'contrast') {
      const pain = pick(matched.data.pains)
      return `从「${pain}」到「${life}」，体验上的提升显而易见，${feeling}就是最好的证明`
    }
    return `${life}，${feeling}——这就是${pick(kb.valuePropositions)}`
  }

  if (ftype === 'emotion') {
    const emotionBenefits = [
      'TA收到的那一刻，会真切感受到你花的每一分心思都是值得的',
      '这件礼物会变成你们之间专属的回忆，每次想起都暖暖的',
      '不是最贵的，但一定是最用心的——这才是礼物真正的意义',
      '多年以后TA再看到这件礼物，还会想起你送TA时的那份心动',
      '比起礼物本身，被人放在心上的感觉才是最珍贵的'
    ]
    if (style === 'emotion' || style === 'scenario') {
      const scenarios = kb?.scenarioPairs ? pick(kb.scenarioPairs) : { s1: '特别的日子', s2: '平凡的每一天' }
      return `${pick(styleKnowledge[style as keyof typeof styleKnowledge].starters)}${scenarios.s1}还是${scenarios.s2}，${pick(emotionBenefits)}`
    }
    return pick(emotionBenefits)
  }

  const angle = pick(kb?.benefitAngles || ['生活品质提升'])
  const scenarios = kb?.scenarioPairs ? pick(kb.scenarioPairs) : { s1: '日常使用中', s2: '关键时刻' }
  if (style === 'scenario') return `无论是${scenarios.s1}还是${scenarios.s2}，都能真切感受到${angle}带来的不同`
  if (style === 'contrast') return `从「${kb?.painPoints?.[0] || '不够好'}」到「${angle}」，体验上的提升显而易见`
  if (style === 'data') return `量化来看，${angle}，投资回报率清晰可见`
  if (style === 'authority') return `从专业角度评估，${angle}，这就是核心价值所在`
  return `${angle}，日常使用中处处都能感受到`
}

const generateLinks = (category: string): { linkAB: string; linkBC: string } => {
  const kb = categoryKnowledgeBase[category]
  return {
    linkAB: pick(kb?.linkABPhrases || ['这意味着…']),
    linkBC: pick(kb?.linkBCPhrases || ['对你来说…'])
  }
}

const generateOpening = (category: string, scene: string, style: string, product: string): string => {
  const kb = categoryKnowledgeBase[category]
  const pain = pick(kb?.painPoints || ['选不到真正合适的产品'])
  const value = pick(kb?.valuePropositions || ['品质之选'])

  const t: Record<string, Record<string, string[]>> = {
    ecommerce: {
      data: [`还在纠结怎么选？${product}——用数据说话，${value}！`],
      emotion: [`你有没有过「${pain}」的经历？${product}，懂你的不容易～`],
      contrast: [`别再忍受「${pain}」了！${product}，重新定义你的体验。`],
      scenario: [`想象一下：${product}在手，从此告别${pain}的困扰～`],
      authority: [`业内公认：想解决${pain}的问题，${product}是绕不开的选择。`]
    },
    social: {
      data: [`姐妹们！${product}的数据太能打了，${value}真的不是说说而已🔥`],
      emotion: [`谁懂啊！终于遇到能解决「${pain}」的${product}了，感动😭💗`],
      contrast: [`用了${product}之后才发现，之前的都白买了…这差距也太大了😱`],
      scenario: [`被种草的${product}终于到了，用了一周，${pain}的问题真的解决了✨`],
      authority: [`做了半个月功课入手的${product}，果然专业人士推荐的不会错👍`]
    },
    launch: {
      data: [`今日，${product}正式发布，用数据重新定义「${value}」。`],
      emotion: [`我们深知每个人都有「${pain}」的困扰，为此${product}应运而生。`],
      contrast: [`告别过去的${pain}，${product}带来了完全不同的解决方案。`],
      scenario: [`从今天起，${product}将陪伴你度过每一个重要时刻。`],
      authority: [`基于对行业的深刻理解，${product}在专业维度做到了全新高度。`]
    },
    sales: {
      data: [`数据显示，${pain}正在影响业务表现。${product}可量化解决这一问题。`],
      emotion: [`相信您的团队一定也感受过「${pain}」的无奈，${product}正是为此而生。`],
      contrast: [`相比传统方案在${pain}上的无力，${product}提供了根本性的解决思路。`],
      scenario: [`无论是业务增长期还是转型期，${product}都能提供有效支撑。`],
      authority: [`从专业角度看，解决${pain}的关键在于${value}，这正是${product}的核心优势。`]
    }
  }
  return pick(t[scene]?.[style] || t.ecommerce.data)
}

const generateClosing = (category: string, scene: string, style: string, product: string): string => {
  const kb = categoryKnowledgeBase[category]
  const value = pick(kb?.valuePropositions || ['品质之选'])
  const sc: Record<string, Record<string, string[]>> = {
    ecommerce: {
      data: [`${value}，数据已经说明一切，${product}值得你的选择。`],
      emotion: [`心动不如行动，${product}——让${value}从今天开始～`],
      contrast: [`别再忍受不好的体验了，${product}会告诉你什么叫${value}。`],
      scenario: [`现在入手${product}，明天就能感受${value}的体验～`],
      authority: [`专业之选，${value}。${product}，值得信赖。`]
    },
    social: {
      data: [`链接放评论区啦，${value}真的不是说说而已，冲！🔥`],
      emotion: [`真心推荐给每一个懂生活的你，${product}值得💕`],
      contrast: [`用过就回不去了，${product}真的重新定义了${value}✨`],
      scenario: [`趁现在有活动赶紧入手，早买早享受${value}～冲冲冲！`],
      authority: [`做了这么多功课的结论就是：${product}，专业人士的${value}之选✅`]
    },
    launch: {
      data: [`${product}现已正式开售，${value}的数据表现值得期待。`],
      emotion: [`希望${product}能陪伴每一个你，体验${value}的美好。`],
      contrast: [`让我们一起告别旧体验，${product}开启${value}新时代。`],
      scenario: [`即刻体验${product}，开启属于你的${value}之旅。`],
      authority: [`专业团队倾力打造，${value}，${product}邀您共鉴。`]
    },
    sales: {
      data: [`综合来看，${product}可量化实现${value}，建议尽快启动合作。`],
      emotion: [`期待与您携手，通过${product}共同实现${value}。`],
      contrast: [`与其继续在现有方案上纠结，不如让${product}帮您实现${value}。`],
      scenario: [`无论是现在还是未来，${product}都是${value}的最佳选择。`],
      authority: [`专业团队全流程保障，${value}，${product}值得信赖。`]
    }
  }
  return pick(sc[scene]?.[style] || sc.ecommerce.data)
}

const getTransitionPhrases = (scene: string): string[] => ({
  ecommerce: ['不仅如此，', '更值得一提的是，', '在此基础上，', '还有一个核心优势——'],
  social: ['而且！', '还有更绝的！', '重点来了！', '除此之外我还发现～'],
  launch: ['此外，', '值得一提的是，', '在这基础上，', '除此之外，'],
  sales: ['在此基础上，', '更为关键的是，', '除此之外，', '更进一步看，']
}[scene] || ['不仅如此，'])

const generateSingleFab = (feature: string, idx: number, category: string, scene: string, style: string): FabItemV2 => {
  const links = generateLinks(category)
  return {
    feature,
    advantage: generateAdvantageFromFeature(feature, category, style),
    benefit: generateBenefitFromAdvantage(feature, category, style),
    linkAB: links.linkAB,
    linkBC: links.linkBC,
    transition: idx > 0 ? pick(getTransitionPhrases(scene)) : undefined
  }
}

const getStyleForVersion = (versionIdx: number, baseStyle: string): string => {
  const allStyles = Object.keys(styleKnowledge)
  if (versionIdx === 0) return baseStyle
  const otherStyles = allStyles.filter(s => s !== baseStyle)
  return otherStyles[(versionIdx - 1) % otherStyles.length]
}

const generateOneVersion = (category: string, scene: string, style: string, product: string): FabResultV2 => {
  const features = featuresList.value
  return {
    opening: generateOpening(category, scene, style, product),
    fabList: features.map((f, i) => generateSingleFab(f, i, category, scene, style)),
    closing: generateClosing(category, scene, style, product),
    styleTag: styleKnowledge[style as keyof typeof styleKnowledge].tag
  }
}

const generateCopy = async () => {
  if (!canGenerate.value) {
    ElMessage.warning('请完整填写产品名称、核心特性和目标用户')
    return
  }
  isGenerating.value = true
  generatedResults.value = []
  activeVersion.value = 0

  await new Promise(r => setTimeout(r, 500))
  const results: FabResultV2[] = []
  for (let i = 0; i < versionCount.value; i++) {
    await new Promise(r => setTimeout(r, 350))
    const vStyle = getStyleForVersion(i, selectedStyle.value)
    results.push(generateOneVersion(selectedCategory.value, selectedScene.value, vStyle, productName.value))
  }
  generatedResults.value = results
  isGenerating.value = false

  history.value.push({
    productName: productName.value.trim(),
    featuresText: featuresText.value,
    targetUser: targetUser.value.trim(),
    category: selectedCategory.value,
    scene: selectedScene.value,
    style: selectedStyle.value,
    results: [...results],
    fabCount: featuresList.value.length,
    versionCount: versionCount.value,
    time: new Date().toISOString()
  })
  saveHistory()
  ElMessage.success({ message: `✨ 已生成 ${results.length} 个 FAB 文案版本`, type: 'success', duration: 3000, showClose: true })
}

const regenerateVersion = () => {
  if (generatedResults.value.length === 0) return
  const currentStyle = selectedStyle.value
  const allStyles = Object.keys(styleKnowledge).filter(s => !generatedResults.value.map(r => r.styleTag).includes(styleKnowledge[s as keyof typeof styleKnowledge].tag))
  const nextStyle = allStyles.length > 0 ? allStyles[0] : pick(Object.keys(styleKnowledge))
  generatedResults.value[activeVersion.value] = generateOneVersion(selectedCategory.value, selectedScene.value, nextStyle, productName.value)
  ElMessage.success('已重新生成该版本')
}

const copyText = async (text: string) => {
  try { await navigator.clipboard.writeText(text); ElMessage.success('已复制到剪贴板') }
  catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); ElMessage.success('已复制到剪贴板') }
}

const copyFab = async (fab: FabItemV2) => {
  await copyText(`【F · Feature】${fab.feature}\n\n【A · Advantage】${fab.advantage}\n\n【B · Benefit】${fab.benefit}`)
}

const copyCurrentFull = async () => {
  if (!currentResult.value) return
  const parts: string[] = [`===== FAB营销文案 · 版本 ${activeVersion.value + 1} (${currentResult.value.styleTag}) =====`, '', currentResult.value.opening, '']
  currentResult.value.fabList.forEach((fab, i) => {
    if (fab.transition) parts.push(fab.transition)
    parts.push(`【${i + 1}】F: ${fab.feature}`)
    parts.push(`    A: ${fab.advantage}`)
    parts.push(`    B: ${fab.benefit}`)
    parts.push('')
  })
  parts.push(currentResult.value.closing)
  await copyText(parts.join('\n'))
}

const copyAllResults = async () => {
  const all: string[] = []
  generatedResults.value.forEach((r, idx) => {
    all.push(`\n========== 版本 ${idx + 1} · ${r.styleTag} ==========\n`)
    all.push(r.opening, '')
    r.fabList.forEach((fab, i) => { all.push(`${i + 1}. F:${fab.feature}  A:${fab.advantage}  B:${fab.benefit}`) })
    all.push('', r.closing)
  })
  await copyText(all.join('\n'))
}

const resetAll = () => {
  productName.value = ''; featuresText.value = ''; targetUser.value = ''
  selectedCategory.value = 'digital'; selectedScene.value = 'ecommerce'; selectedStyle.value = 'data'
  versionCount.value = 2; generatedResults.value = []
}

const loadHistory = () => { try { const s = localStorage.getItem(STORAGE_KEY); if (s) history.value = JSON.parse(s) } catch (e) { console.error(e) } }
const saveHistory = () => {
  try { if (history.value.length > 50) history.value = history.value.slice(-50); localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value)) }
  catch (e) { console.error(e) }
}
const clearHistory = () => { history.value = []; localStorage.removeItem(STORAGE_KEY); ElMessage.success('历史记录已清空') }
const loadFromHistory = (item: HistoryItem) => {
  productName.value = item.productName; featuresText.value = item.featuresText; targetUser.value = item.targetUser
  selectedCategory.value = item.category; selectedScene.value = item.scene; selectedStyle.value = item.style
  versionCount.value = item.versionCount; generatedResults.value = item.results
  ElMessage.info('已载入历史记录')
}
const formatTime = (d: string) => new Date(d).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

onMounted(() => loadHistory())
</script>

<style scoped>
.fab-marketing-generator { max-width: 1100px; margin: 0 auto; }
.guide-card, .main-card, .result-card, .history-card { margin-bottom: 24px; }
.guide-steps { padding: 10px 0; }
.expectation-title { font-size: 15px; font-weight: 600; color: #303133; margin: 0 0 16px 0; }
.expectation-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 8px; }
.expectation-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: linear-gradient(135deg, #f5f7fa 0%, #eef1f6 100%); border-radius: 10px; }
.exp-text { flex: 1; }
.exp-num { font-size: 15px; font-weight: 700; color: #303133; margin-bottom: 2px; }
.exp-label { font-size: 12px; color: #909399; }
.card-header { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: bold; flex-wrap: wrap; }
.card-header .el-tag { margin-left: 12px; font-weight: normal; }
.card-header > .header-actions { margin-left: auto; }
.section-title { display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 600; color: #303133; margin: 0 0 12px 0; }
.section-title-sm { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: #606266; margin: 0 0 10px 0; }
.section-title-sm .el-button { margin-left: auto; }
.required-tag { color: #f56c6c; font-size: 14px; }
.hint-tag { margin-left: 12px; font-weight: normal; }
.input-section { margin-bottom: 20px; }
.two-col-section { display: flex; gap: 20px; }
.flex-1 { flex: 1; }

.category-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.category-card { border: 2px solid #ebeef5; border-radius: 10px; padding: 14px 10px; text-align: center; cursor: pointer; transition: all 0.25s; background: #fff; }
.category-card:hover:not(.disabled) { border-color: #c6e2ff; background: #f5f9ff; }
.category-card.active { border-color: #165DFF; background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%); }
.category-card.disabled { opacity: 0.6; cursor: not-allowed; }
.cat-emoji { font-size: 26px; margin-bottom: 6px; }
.cat-name { font-size: 14px; font-weight: 600; color: #303133; }

.quick-samples { margin-top: 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.sample-label { font-size: 13px; color: #909399; }
.sample-tag { cursor: pointer; transition: all 0.2s; }
.sample-tag:hover { background: #ecf5ff; border-color: #409eff; color: #409eff; }

.scene-options-small { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.scene-chip { display: flex; align-items: center; gap: 6px; padding: 10px 12px; border: 2px solid #ebeef5; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
.scene-chip:hover:not(.disabled) { border-color: #c6e2ff; }
.scene-chip.active { border-color: #165DFF; background: #ecf5ff; color: #165DFF; font-weight: 500; }
.scene-chip.disabled { opacity: 0.6; cursor: not-allowed; }

.style-options { display: flex; flex-wrap: wrap; gap: 8px; }
.style-chip { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: 2px solid #ebeef5; border-radius: 20px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.style-chip:hover:not(.disabled) { border-color: #f3d19e; background: #fdf6ec; }
.style-chip.active { border-color: #e6a23c; background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%); color: #b88230; font-weight: 500; }
.style-chip.disabled { opacity: 0.6; cursor: not-allowed; }
.style-emoji { font-size: 16px; }

.version-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.version-card { border: 2px solid #ebeef5; border-radius: 10px; padding: 14px 10px; text-align: center; cursor: pointer; transition: all 0.25s; background: #fff; }
.version-card:hover:not(.disabled) { border-color: #c2e7b0; background: #f0f9eb; }
.version-card.active { border-color: #67c23a; background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%); }
.version-card.disabled { opacity: 0.6; cursor: not-allowed; }
.version-num { font-size: 24px; font-weight: 700; color: #67c23a; margin-bottom: 2px; }
.version-label { font-size: 13px; color: #606266; margin-bottom: 4px; }
.version-desc { font-size: 12px; color: #909399; }

.action-section { display: flex; gap: 12px; margin-top: 24px; }
.generate-btn { flex: 1; }
.btn-loading-text { display: inline-flex; align-items: center; gap: 6px; }

.generating-status { margin-top: 20px; padding: 16px; background: linear-gradient(135deg, #f5f9ff 0%, #ecf5ff 100%); border-radius: 8px; display: flex; align-items: center; gap: 12px; }
.generating-dots { display: flex; gap: 4px; }
.generating-dots .dot { width: 8px; height: 8px; border-radius: 50%; background: #409eff; animation: pulse 1.4s infinite ease-in-out both; }
.generating-dots .dot:nth-child(1) { animation-delay: -0.32s; }
.generating-dots .dot:nth-child(2) { animation-delay: -0.16s; }
@keyframes pulse { 0%, 80%, 100% { transform: scale(0); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }
.generating-text { color: #409eff; font-size: 14px; font-weight: 500; }

.version-tabs { display: flex; gap: 8px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #ebeef5; }
.version-tab { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; color: #606266; transition: all 0.2s; }
.version-tab:hover { background: #f5f7fa; }
.version-tab.active { background: #165DFF; color: #fff; font-weight: 500; }

.opening-section { padding: 16px 20px; background: linear-gradient(135deg, #fff7e6 0%, #fff1e0 100%); border-radius: 10px; margin-bottom: 20px; }
.opening-text { font-size: 15px; line-height: 1.8; color: #303133; }

.fab-list { display: flex; flex-direction: column; gap: 20px; }
.fab-item { border: 1px solid #ebeef5; border-radius: 12px; overflow: hidden; }
.fab-header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: #fafbfc; border-bottom: 1px solid #ebeef5; }
.fab-index { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #165DFF 0%, #409eff 100%); color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fab-feature-title { flex: 1; font-size: 15px; font-weight: 600; color: #303133; }
.fab-header .el-button { margin-left: auto; }

.fab-chain { padding: 0 20px; }
.fab-node { padding: 16px 0; display: flex; gap: 16px; }
.fab-f { border-bottom: none; }
.fab-a { border-bottom: none; background: linear-gradient(90deg, #fffaf0 0%, #ffffff 100%); margin: 0 -20px; padding-left: 20px; padding-right: 20px; }
.fab-b { background: linear-gradient(90deg, #f5fbf0 0%, #ffffff 100%); margin: 0 -20px; padding-left: 20px; padding-right: 20px; }

.node-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.node-tag { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; flex-shrink: 0; color: #fff; }
.tag-f { background: linear-gradient(135deg, #409eff 0%, #165DFF 100%); }
.tag-a { background: linear-gradient(135deg, #e6a23c 0%, #cf8a1b 100%); }
.tag-b { background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%); }
.node-title { font-size: 13px; color: #909399; font-weight: 500; }
.node-content { font-size: 15px; line-height: 1.7; color: #303133; margin-left: 50px; }

.chain-link { display: flex; align-items: center; gap: 8px; padding: 4px 0 4px 50px; background: #fafbfc; margin: 0 -20px; padding-left: calc(50px + 20px); }
.chain-link .el-icon { color: #c0c4cc; font-size: 14px; }
.chain-link span { font-size: 12px; color: #909399; font-style: italic; }

.fab-transition { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: #fff8e1; border-top: 1px dashed #e8e5d5; font-size: 13px; color: #b8860b; font-weight: 500; }

.closing-section { padding: 16px 20px; background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%); border-radius: 10px; margin-top: 20px; }
.closing-text { font-size: 15px; line-height: 1.8; color: #303133; }

.result-footer { display: flex; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #ebeef5; }

.history-list { display: flex; flex-direction: column; gap: 10px; }
.history-item { padding: 12px 16px; background: #fafbfc; border-radius: 8px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
.history-item:hover { background: #f5f9ff; border-color: #d9ecff; }
.history-time { font-size: 12px; color: #909399; margin-bottom: 6px; }
.history-product { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.history-text { font-size: 14px; color: #303133; font-weight: 500; }
.history-meta { display: flex; gap: 8px; }
.history-footer { text-align: center; margin-top: 12px; }
