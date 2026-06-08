<template>
  <div class="viral-copy-generator">
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
        <el-step title="输入产品信息" description="产品名称、核心卖点" />
        <el-step title="构建受众画像" description="7维度用户心理精准刻画" />
        <el-step title="选择传播策略" description="场景 × 情绪 × 热点" />
        <el-step title="设定文案偏好" description="风格 × 版本数量" />
        <el-step title="查看与复制" description="多版本文案对比择优" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Avatar /></el-icon>
            <div class="exp-text">
              <div class="exp-num">7 维受众画像</div>
              <div class="exp-label">年龄/性别/职业/消费/兴趣/痛点/决策</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Promotion /></el-icon>
            <div class="exp-text">
              <div class="exp-num">6 种情绪基调</div>
              <div class="exp-label">焦虑/治愈/向往/共鸣/好奇/愤怒</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><HotWater /></el-icon>
            <div class="exp-text">
              <div class="exp-num">热点话题接入</div>
              <div class="exp-label">时令/热梗/趋势/怀旧/社会议题</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">全链路爆款</div>
              <div class="exp-label">标题+Hook+正文+CTA+话题标签</div>
            </div>
          </div>
        </div>
        <el-divider />
        <h4 class="expectation-title">🎯 各场景文案差异说明</h4>
        <div class="channel-diff-table">
          <div class="diff-row diff-header">
            <div class="diff-col">差异维度</div>
            <div class="diff-col">📕 小红书</div>
            <div class="diff-col">🎬 抖音</div>
            <div class="diff-col">💬 朋友圈</div>
            <div class="diff-col">🛒 电商详情页</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">标题字数</div>
            <div class="diff-col">15 ~ 25 字</div>
            <div class="diff-col">8 ~ 18 字</div>
            <div class="diff-col">10 ~ 30 字</div>
            <div class="diff-col">20 ~ 40 字</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">emoji 密度</div>
            <div class="diff-col">丰富多样</div>
            <div class="diff-col">1~3 个 / 标题</div>
            <div class="diff-col">适当点缀</div>
            <div class="diff-col">促销 emoji</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">核心关键词</div>
            <div class="diff-col">种草、宝藏、绝绝子</div>
            <div class="diff-col">绝了、必看、惊了</div>
            <div class="diff-col">推荐、分享、亲测</div>
            <div class="diff-col">热销、爆款、限量</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">语气风格</div>
            <div class="diff-col">闺蜜分享、亲切种草</div>
            <div class="diff-col">夸张口语、快节奏</div>
            <div class="diff-col">真实走心、生活化</div>
            <div class="diff-col">促销紧迫感、利益前置</div>
          </div>
          <div class="diff-row">
            <div class="diff-col diff-label">正文长度</div>
            <div class="diff-col">300 ~ 800 字</div>
            <div class="diff-col">100 ~ 200 字</div>
            <div class="diff-col">150 ~ 300 字</div>
            <div class="diff-col">200 ~ 500 字</div>
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
          <span>AI 爆款文案生成</span>
          <el-tag size="small" type="warning">多场景 · 多风格 · 多版本</el-tag>
        </div>
      </template>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Goods /></el-icon>
          <span>产品名称 / 内容主题</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="productName"
          placeholder="例如：小气泡清洁面膜 / 夏日显瘦穿搭攻略 / 高效学习方法分享"
          maxlength="50"
          show-word-limit
          :disabled="isGenerating"
          clearable
        />
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Star /></el-icon>
          <span>核心卖点 / 内容亮点（每行一个，建议 2~5 个）</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="sellingPointsText"
          type="textarea"
          :rows="5"
          :placeholder="currentPlaceholder"
          :disabled="isGenerating"
          resize="vertical"
        />
        <div class="quick-samples">
          <span class="sample-label">📝 快速体验：</span>
          <el-tag
            v-for="(sample, i) in quickSamples"
            :key="i"
            class="sample-tag"
            effect="plain"
            @click="applySample(sample)"
          >
            {{ sample.name }}
          </el-tag>
        </div>
      </div>

      <el-card class="audience-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon :size="18" color="#165DFF"><Avatar /></el-icon>
            <span>7维度受众画像</span>
            <el-tag size="small" type="primary" effect="light">精准刻画用户心理，文案才能戳中要害</el-tag>
          </div>
        </template>

        <div class="audience-row">
          <div class="audience-item">
            <div class="audience-label">👥 年龄段</div>
            <div class="chip-group">
              <div
                v-for="opt in ageOptions"
                :key="opt.value"
                class="chip-item"
                :class="{ active: audience.age === opt.value, disabled: isGenerating }"
                @click="!isGenerating && (audience.age = opt.value)"
              >
                {{ opt.label }}
              </div>
            </div>
          </div>
          <div class="audience-item">
            <div class="audience-label">⚧ 性别倾向</div>
            <div class="chip-group">
              <div
                v-for="opt in genderOptions"
                :key="opt.value"
                class="chip-item"
                :class="{ active: audience.gender === opt.value, disabled: isGenerating }"
                @click="!isGenerating && (audience.gender = opt.value)"
              >
                {{ opt.label }}
              </div>
            </div>
          </div>
        </div>

        <div class="audience-row">
          <div class="audience-item flex-2">
            <div class="audience-label">💼 职业 / 身份（可多选）</div>
            <div class="chip-group wrap">
              <div
                v-for="opt in professionOptions"
                :key="opt.value"
                class="chip-item"
                :class="{ active: audience.professions.includes(opt.value), disabled: isGenerating }"
                @click="!isGenerating && toggleArrayItem(audience.professions, opt.value)"
              >
                {{ opt.label }}
              </div>
            </div>
          </div>
        </div>

        <div class="audience-row">
          <div class="audience-item">
            <div class="audience-label">💰 消费能力</div>
            <div class="chip-group">
              <div
                v-for="opt in budgetOptions"
                :key="opt.value"
                class="chip-item"
                :class="{ active: audience.budget === opt.value, disabled: isGenerating }"
                @click="!isGenerating && (audience.budget = opt.value)"
              >
                {{ opt.label }}
              </div>
            </div>
          </div>
          <div class="audience-item">
            <div class="audience-label">🧠 决策偏好</div>
            <div class="chip-group">
              <div
                v-for="opt in decisionOptions"
                :key="opt.value"
                class="chip-item"
                :class="{ active: audience.decision === opt.value, disabled: isGenerating }"
                @click="!isGenerating && (audience.decision = opt.value)"
              >
                {{ opt.label }}
              </div>
            </div>
          </div>
        </div>

        <div class="audience-row">
          <div class="audience-item flex-2">
            <div class="audience-label">❤️ 兴趣标签（可多选，建议选 2~5 个）</div>
            <div class="chip-group wrap">
              <div
                v-for="opt in interestOptions"
                :key="opt.value"
                class="chip-item"
                :class="{ active: audience.interests.includes(opt.value), disabled: isGenerating }"
                @click="!isGenerating && toggleArrayItem(audience.interests, opt.value)"
              >
                {{ opt.label }}
              </div>
            </div>
          </div>
        </div>

        <div class="audience-row">
          <div class="audience-item flex-2">
            <div class="audience-label">💔 核心痛点（可多选，建议选 1~3 个最强烈的）</div>
            <div class="chip-group wrap">
              <div
                v-for="opt in audiencePainOptions"
                :key="opt.value"
                class="chip-item pain"
                :class="{ active: audience.pains.includes(opt.value), disabled: isGenerating }"
                @click="!isGenerating && toggleArrayItem(audience.pains, opt.value)"
              >
                {{ opt.label }}
              </div>
            </div>
          </div>
        </div>

        <div class="audience-row">
          <div class="audience-item flex-2">
            <div class="audience-label">📝 补充描述（可选，让画像更精准）</div>
            <el-input
              v-model="audience.note"
              type="textarea"
              :rows="2"
              placeholder="例如：三线城市、已婚有娃、租房住、每天刷抖音2小时、最近有容貌焦虑..."
              maxlength="150"
              show-word-limit
              :disabled="isGenerating"
              resize="none"
            />
          </div>
        </div>
      </el-card>

      <el-card class="emotion-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon :size="18" color="#e6a23c"><Heart /></el-icon>
            <span>情绪基调 & 传播策略</span>
            <el-tag size="small" type="warning" effect="light">情绪是传播的燃料，选对基调事半功倍</el-tag>
          </div>
        </template>

        <div class="audience-row">
          <div class="audience-item flex-2">
            <div class="audience-label">🎭 主打情绪基调（可多选）</div>
            <div class="emotion-group">
              <div
                v-for="opt in emotionOptions"
                :key="opt.value"
                class="emotion-card-item"
                :class="{ active: audience.emotions.includes(opt.value), disabled: isGenerating }"
                @click="!isGenerating && toggleArrayItem(audience.emotions, opt.value)"
              >
                <div class="emotion-emoji">{{ opt.emoji }}</div>
                <div class="emotion-name">{{ opt.label }}</div>
                <div class="emotion-desc">{{ opt.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="audience-row">
          <div class="audience-item flex-2">
            <div class="audience-label">
              🔥 情绪强度
              <el-tag size="small" type="info">
                当前：{{ emotionIntensityLabels[emotionIntensity] }}
              </el-tag>
            </div>
            <el-slider
              v-model="emotionIntensity"
              :min="1"
              :max="5"
              :step="1"
              :marks="emotionMarks"
              :disabled="isGenerating"
              show-stops
            />
          </div>
        </div>
      </el-card>

      <el-card class="hotspot-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon :size="18" color="#f56c6c"><HotWater /></el-icon>
            <span>热点话题接入</span>
            <el-tag size="small" type="danger" effect="light">蹭热点可以让传播力提升 3~10 倍</el-tag>
            <el-tag size="small" type="warning" effect="plain">⚠️ 网络热梗时效性极强，建议自定义最新词汇</el-tag>
          </div>
        </template>

        <el-alert
          title="时效性提示"
          type="warning"
          :closable="false"
          show-icon
          class="freshness-warning"
        >
          <template #default>
            系统内置的"网络热梗"词汇库可能滞后于实际流行趋势。
            <strong>强烈建议</strong>通过下方"自定义热点关键词"手动输入当下最火的词汇，以确保文案新鲜感。
            热点词汇生命周期通常仅 1~3 个月，过时梗反而会降低传播力。
          </template>
        </el-alert>

        <div class="audience-row">
          <div class="audience-item flex-2">
            <div class="audience-label">📈 热点类型（可多选，不选则纯文案输出）</div>
            <div class="hotspot-group">
              <div
                v-for="opt in hotspotOptions"
                :key="opt.value"
                class="hotspot-card-item"
                :class="{ active: audience.hotspots.includes(opt.value), disabled: isGenerating, outdated: opt.outdated }"
                @click="!isGenerating && toggleArrayItem(audience.hotspots, opt.value)"
              >
                <div class="hotspot-emoji">{{ opt.emoji }}</div>
                <div class="hotspot-name">
                  {{ opt.label }}
                  <el-tag v-if="opt.outdated" size="small" type="danger" effect="plain" class="outdated-tag">
                    内置词可能过时
                  </el-tag>
                </div>
                <div class="hotspot-desc">{{ opt.desc }}</div>
                <div class="hotspot-example">{{ opt.example }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="audience-row" v-if="audience.hotspots.length > 0">
          <div class="audience-item flex-2">
            <div class="audience-label">✍️ 自定义热点 / 最新流行语（推荐填写，每行一个）</div>
            <el-input
              v-model="customHotspots"
              type="textarea"
              :rows="3"
              placeholder="填入当下最火的词汇，保证文案新鲜感。例如：&#10;AI原生工作流&#10;松弛感穿搭&#10;情绪价值拉满&#10;反向旅游"
              :disabled="isGenerating"
              resize="vertical"
            />
            <div class="custom-tip">
              <el-icon color="#e6a23c"><Warning /></el-icon>
              <span>自定义词汇优先级高于系统内置，且不会过时。花 30 秒输入当下热词，传播效果提升明显。</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="freshness-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon :size="18" color="#67c23a"><Refresh /></el-icon>
            <span>网络用语新鲜度控制</span>
            <el-tag size="small" type="success" effect="light">决定文案能"保鲜"多久</el-tag>
          </div>
        </template>

        <div class="audience-row">
          <div class="audience-item flex-2">
            <div class="audience-label">🎚 选择新鲜度档位</div>
            <div class="freshness-options">
              <div
                v-for="opt in freshnessOptions"
                :key="opt.value"
                class="freshness-card-item"
                :class="{ active: freshnessLevel === opt.value, disabled: isGenerating }"
                @click="!isGenerating && (freshnessLevel = opt.value)"
              >
                <div class="freshness-emoji">{{ opt.emoji }}</div>
                <div class="freshness-name">{{ opt.label }}</div>
                <div class="freshness-shelf">保鲜期：{{ opt.shelfLife }}</div>
                <div class="freshness-desc">{{ opt.desc }}</div>
                <div class="freshness-example">示例：{{ opt.example }}</div>
              </div>
            </div>
          </div>
        </div>

        <el-alert
          :title="freshnessAlert.title"
          :type="freshnessAlert.type"
          :closable="false"
          show-icon
          class="freshness-alert"
        >
          <template #default>{{ freshnessAlert.detail }}</template>
        </el-alert>
      </el-card>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Grid /></el-icon>
          <span>发布场景</span>
          <el-tag size="small" type="info" class="hint-tag">
            不同场景的字数、emoji、语气、结构均会自动适配
          </el-tag>
        </div>
        <div class="scene-options">
          <div
            v-for="scene in scenes"
            :key="scene.value"
            class="scene-card"
            :class="{ active: selectedScene === scene.value, disabled: isGenerating }"
            @click="!isGenerating && (selectedScene = scene.value)"
          >
            <div class="scene-emoji">{{ scene.emoji }}</div>
            <div class="scene-name">{{ scene.label }}</div>
            <div class="scene-desc">{{ scene.desc }}</div>
            <div class="scene-spec">
              <span>{{ scene.spec }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="two-col-section">
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
              :class="{ active: selectedStyles.includes(style.value), disabled: isGenerating }"
              @click="!isGenerating && toggleStyle(style.value)"
            >
              <span class="style-emoji">{{ style.emoji }}</span>
              <span class="style-label">{{ style.label }}</span>
            </div>
          </div>
          <div class="style-tip" v-if="selectedStyles.length === 0">
            <el-tag size="small" type="info">不选则自动随机搭配风格</el-tag>
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
              AI 正在基于「{{ getSceneLabel(selectedScene) }}」场景生成 {{ versionCount }} 个爆款文案…
            </span>
          </template>
          生成爆款文案
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
          ✨ 正在构建受众心理模型，融合 {{ audience.emotions.length }} 种情绪基调
          <span v-if="audience.hotspots.length > 0">+ {{ audience.hotspots.length }} 类热点话题</span>
          ，打造高传播性爆款文案…
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
            {{ getSceneLabel(selectedScene) }}
          </el-tag>
          <el-tag v-if="audience.emotions.length > 0" size="small" type="warning" effect="light">
            情绪：{{ audience.emotions.map(e => getEmotionLabel(e)).join('+') }}
          </el-tag>
          <el-tag v-if="audience.hotspots.length > 0" size="small" type="danger" effect="light">
            热点：{{ audience.hotspots.length }}类
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
            <el-icon color="#e6a23c"><ChatDotRound /></el-icon>
            <span>🔥 爆款标题</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.title)">复制</el-button>
          </div>
          <div class="result-title-text">{{ currentResult.title }}</div>
        </div>

        <div class="result-section">
          <div class="section-title-sm">
            <el-icon color="#f56c6c"><Promotion /></el-icon>
            <span>⚡ Hook 开头（前3秒/前2行抓住眼球）</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.hook)">复制</el-button>
          </div>
          <div class="result-hook-text">{{ currentResult.hook }}</div>
        </div>

        <div class="result-section">
          <div class="section-title-sm">
            <el-icon color="#165DFF"><EditPen /></el-icon>
            <span>📝 正文内容</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.body)">复制</el-button>
          </div>
          <div class="result-body-text">{{ currentResult.body }}</div>
        </div>

        <div v-if="currentResult.cta" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#67c23a"><Flag /></el-icon>
            <span>🎯 CTA 行动号召</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.cta)">复制</el-button>
          </div>
          <div class="result-cta-text">{{ currentResult.cta }}</div>
        </div>

        <div v-if="currentResult.hashtags" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#909399"><Collection /></el-icon>
            <span>#️⃣ 话题标签 / 关键词</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.hashtags)">复制</el-button>
          </div>
          <div class="result-hashtags-text">{{ currentResult.hashtags }}</div>
        </div>

        <div class="result-footer">
          <el-button type="primary" :icon="Download" @click="copyCurrentFull">
            复制完整文案（版本 {{ activeVersion + 1 }}）
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
            <el-tag size="small" type="info">{{ getSceneLabel(item.scene) }}</el-tag>
            <span class="history-text">{{ item.productName }}</span>
          </div>
          <div class="history-meta">
            <el-tag size="small" type="success">{{ item.results.length }}个版本</el-tag>
            <el-tag size="small" type="warning">{{ item.sellingPoints.length }}个卖点</el-tag>
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
import { ref, reactive, computed, onMounted } from 'vue'
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
  Document,
  RefreshRight,
  Bulb,
  EditPen,
  Avatar,
  Heart,
  HotWater,
  Warning
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface AudienceProfile {
  age: string
  gender: string
  professions: string[]
  budget: string
  decision: string
  interests: string[]
  pains: string[]
  emotions: string[]
  hotspots: string[]
  note: string
}

interface ViralCopyResult {
  title: string
  hook: string
  body: string
  cta: string
  hashtags: string
  style: string
  styleLabel: string
}

interface HistoryItem {
  productName: string
  sellingPointsText: string
  sellingPoints: string[]
  targetUser: string
  audience: AudienceProfile
  customHotspots: string
  emotionIntensity: number
  freshnessLevel: string
  scene: string
  results: ViralCopyResult[]
  time: string
}

interface QuickSample {
  name: string
  scene: string
  productName: string
  sellingPoints: string[]
  audience: Partial<AudienceProfile>
}

const STORAGE_KEY = 'viral_copy_history'

const tieredVocabulary = {
  classic: {
    xiaohongshu: ['推荐', '分享', '亲测', '好用', '平价', '宝藏', '姐妹们', '学生党', '安利', '闭眼入'],
    douyin: ['必看', '分享', '强烈推荐', '看完你就懂', '亲测有效', '不看后悔', '经验总结', '避坑指南'],
    moments: ['推荐', '分享', '亲测', '真心', '自用', '身边人都在用', '不吹不黑', '说实话'],
    ecommerce: ['热销', '爆款', '限量', '限时', '特惠', '直降', '包邮', '官方正品', '买一送一', '今日特价']
  },
  persistent: {
    xiaohongshu: ['种草', '好物', '天花板', '仪式感', '氛围感', '沉浸式', '真的爱了', '闭眼冲', '懒人福音', '精致生活'],
    douyin: ['绝了', '惊呆了', '硬核分享', '干货满满', '封神级别', '亲测有效', '高能预警', '建议收藏'],
    moments: ['真心推荐', '宝藏分享', '用过才知道', '良心推荐', '真的好用', '亲测有效', '好物分享'],
    ecommerce: ['热销爆品', '明星同款', '口碑之选', '断货王', '销量冠军', '好评如潮', '性价比之王']
  },
  meme: {
    xiaohongshu: ['绝绝子', 'yyds', '谁懂啊', '一整个爱住', '家人们谁懂啊', '狠狠拿捏', '纯纯无语住了'],
    douyin: ['太绝了', '谁敢信', '离谱', '破防了', '最后一个绝了', '直接封神', '我不允许还有人不知道'],
    moments: ['真的绝了', '谁用谁知道', '我不允许', '狠狠推荐', '一整个惊艳住'],
    ecommerce: ['全网都在抢', '手慢无', '闭眼冲就对了', '错过拍大腿']
  }
}

const freshnessOptions = [
  {
    value: 'classic',
    label: '经典通用',
    emoji: '📚',
    shelfLife: '≥ 2 年',
    desc: '不用任何网络流行语，使用自然、持久、不易过时的表达。适合品牌型、长期使用的内容。',
    example: '"真心推荐这款护肤品，温和又有效，用了两周皮肤状态明显变好"'
  },
  {
    value: 'persistent',
    label: '轻度网感',
    emoji: '🌿',
    shelfLife: '6 ~ 12 个月',
    desc: '使用经过时间验证、生命力较长的表达（如：种草、天花板、沉浸式），有网感但不过火。',
    example: '"真的被这款洁面种草了，清洁力拉满又不拔干，敏感肌天菜"'
  },
  {
    value: 'meme',
    label: '适度玩梗',
    emoji: '🔥',
    shelfLife: '1 ~ 3 个月',
    desc: '适量融入近半年内的流行词与热梗，新鲜感强但可能较快过时。适合追热点、涨粉内容。',
    example: '"家人们谁懂啊，这面膜真的一整个爱住，效果绝绝子！"'
  },
  {
    value: 'heavy',
    label: '高强度玩梗',
    emoji: '🚀',
    shelfLife: '≤ 1 个月',
    desc: '大量使用最新流行语和热梗，传播爆发力强但极快过时。仅适合短期追热点活动。',
    example: '"我不允许还有人不知道这个！直接封神！用完狠狠拿捏！谁懂啊真的yyds！"'
  }
]

const scenes = [
  {
    value: 'xiaohongshu',
    label: '小红书种草',
    emoji: '📕',
    desc: '小红书笔记、种草分享',
    spec: '图文长文 · 亲切种草',
    config: {
      titleMin: 15,
      titleMax: 25,
      bodyMin: 300,
      bodyMax: 800,
      emojiChance: 0.9,
      tone: 'friendly',
      channelEmojis: ['💕', '🌸', '✨', '💖', '🌿', '🎀', '🍀', '☀️', '💫', '🌟'],
      ctaTypes: ['评论互动', '收藏关注', '私信咨询', '链接购买']
    }
  },
  {
    value: 'douyin',
    label: '抖音短视频',
    emoji: '🎬',
    desc: '抖音、快手、视频号',
    spec: '短视频文案 · 夸张吸睛',
    config: {
      titleMin: 8,
      titleMax: 18,
      bodyMin: 100,
      bodyMax: 200,
      emojiChance: 0.85,
      tone: 'dramatic',
      channelEmojis: ['🔥', '😱', '💥', '👀', '⚠️', '✨', '💯', '🚀', '💪', '👇'],
      ctaTypes: ['点赞关注', '评论留言', '转发分享', '点击购物车']
    }
  },
  {
    value: 'moments',
    label: '朋友圈广告',
    emoji: '💬',
    desc: '朋友圈、社群分享',
    spec: '真实走心 · 生活化',
    config: {
      titleMin: 10,
      titleMax: 30,
      bodyMin: 150,
      bodyMax: 300,
      emojiChance: 0.6,
      tone: 'heartfelt',
      channelEmojis: ['😊', '👍', '❤️', '🎉', '✨', '💯', '🙌', '☕️'],
      ctaTypes: ['私聊咨询', '点赞互动', '转发给好友', '扫码了解']
    }
  },
  {
    value: 'ecommerce',
    label: '电商详情页',
    emoji: '🛒',
    desc: '淘宝、京东、拼多多',
    spec: '促销紧迫 · 利益前置',
    config: {
      titleMin: 20,
      titleMax: 40,
      bodyMin: 200,
      bodyMax: 500,
      emojiChance: 0.5,
      tone: 'promotional',
      channelEmojis: ['🔥', '💰', '🎁', '⚡', '🏆', '💎', '✅', '🚚', '💝', '🎊'],
      ctaTypes: ['立即下单', '加入购物车', '领券购买', '限时抢购']
    }
  }
]

const styles = [
  { value: 'suspense', label: '悬念好奇', emoji: '🔮' },
  { value: 'painpoint', label: '痛点共鸣', emoji: '💔' },
  { value: 'benefit', label: '利益诱惑', emoji: '🎯' },
  { value: 'contrast', label: '对比反差', emoji: '⚖️' },
  { value: 'emotion', label: '情感走心', emoji: '💗' },
  { value: 'number', label: '数字清单', emoji: '🔢' }
]

const versionOptions = [
  { value: 3, label: '3个', desc: '核心优选版' },
  { value: 5, label: '5个', desc: '覆盖主流风格' },
  { value: 8, label: '8个', desc: '全风格探索' }
]

const ageOptions = [
  { value: 'genz', label: 'Z世代 18-24岁' },
  { value: 'millennial', label: '千禧一代 25-35岁' },
  { value: 'genx', label: 'X世代 36-50岁' },
  { value: 'boomer', label: '银发族 50岁+' }
]

const genderOptions = [
  { value: 'female', label: '女性为主' },
  { value: 'male', label: '男性为主' },
  { value: 'neutral', label: '男女通吃' }
]

const professionOptions = [
  { value: 'student', label: '学生党' },
  { value: 'office', label: '职场白领' },
  { value: 'mom', label: '宝妈/奶爸' },
  { value: 'freelance', label: '自由职业' },
  { value: 'entrepreneur', label: '创业者' },
  { value: 'teacher', label: '教师/教育' },
  { value: 'tech', label: '程序员/技术' },
  { value: 'medical', label: '医护/健康' }
]

const budgetOptions = [
  { value: 'student', label: '💸 学生党预算' },
  { value: 'cost', label: '💰 性价比优先' },
  { value: 'quality', label: '💎 品质至上' },
  { value: 'luxury', label: '👑 不差钱' }
]

const decisionOptions = [
  { value: 'emotion', label: '感性冲动' },
  { value: 'logic', label: '理性分析' },
  { value: 'herd', label: '从众跟风' },
  { value: 'trial', label: '尝鲜探索' }
]

const interestOptions = [
  { value: 'beauty', label: '美妆护肤' },
  { value: 'fashion', label: '穿搭时尚' },
  { value: 'fitness', label: '健身减肥' },
  { value: 'food', label: '美食探店' },
  { value: 'travel', label: '旅行出游' },
  { value: 'home', label: '居家生活' },
  { value: 'pet', label: '萌宠日常' },
  { value: 'tech', label: '数码科技' },
  { value: 'study', label: '学习成长' },
  { value: 'emotion', label: '情感心理' },
  { value: 'parent', label: '亲子育儿' },
  { value: 'finance', label: '理财搞钱' }
]

const audiencePainOptions = [
  { value: 'anxiety', label: '容貌焦虑' },
  { value: 'aging', label: '初老恐慌' },
  { value: 'poor', label: '缺钱焦虑' },
  { value: 'busy', label: '时间不够用' },
  { value: 'fat', label: '身材焦虑' },
  { value: 'tired', label: '精神疲惫' },
  { value: 'alone', label: '孤独感' },
  { value: 'inferior', label: '自卑不自信' },
  { value: 'delay', label: '拖延症' },
  { value: 'lost', label: '迷茫没方向' },
  { value: 'conflict', label: '人际关系' },
  { value: 'sleep', label: '失眠睡不好' }
]

const emotionOptions = [
  { value: 'anxiety', label: '焦虑制造', emoji: '😰', desc: '先放大痛点，再给出解药' },
  { value: 'healing', label: '治愈温暖', emoji: '🥰', desc: '柔软走心，让人感到被理解' },
  { value: 'aspiration', label: '向往激励', emoji: '✨', desc: '描绘美好未来，给人希望' },
  { value: 'empathy', label: '共鸣共情', emoji: '💗', desc: '说出用户心里话，引发认同' },
  { value: 'curiosity', label: '好奇探索', emoji: '🤔', desc: '制造悬念，引导深入了解' },
  { value: 'anger', label: '同仇敌忾', emoji: '😤', desc: '一起吐槽，情绪宣泄' }
]

const emotionIntensityLabels: Record<number, string> = {
  1: '温和克制 · 润物细无声',
  2: '轻度触达 · 舒适感拉满',
  3: '适中平衡 · 大部分人受用',
  4: '较强冲击 · 情绪调动明显',
  5: '极致拉满 · 强传播强转化'
}

const emotionMarks: Record<number, { label: string; style?: Record<string, string> }> = {
  1: { label: '温和' },
  2: { label: '轻度' },
  3: { label: '适中' },
  4: { label: '较强' },
  5: { label: '极致' }
}

const hotspotOptions = [
  { value: 'seasonal', label: '时令节点', emoji: '🌸', desc: '结合当季/当月时间点', example: '例：618/双11/开学季/换季', outdated: false },
  { value: 'meme', label: '网络热梗', emoji: '🔥', desc: '融入近期流行语/梗（内置词汇可能已过时，强烈建议自定义）', example: '例：多巴胺/显眼包/搭子/整顿职场', outdated: true },
  { value: 'trend', label: '行业趋势', emoji: '📈', desc: '绑定赛道风口概念', example: '例：AI/新能源/消费升级/懒人经济', outdated: false },
  { value: 'nostalgia', label: '怀旧风潮', emoji: '📼', desc: '唤醒集体记忆情感', example: '例：90后回忆/童年/复古回潮', outdated: false },
  { value: 'social', label: '社会议题', emoji: '💬', desc: '绑定大众关心的话题', example: '例：反内卷/躺平/女性力量/打工人', outdated: false },
  { value: 'festival', label: '节日氛围', emoji: '🎊', desc: '利用节日情绪和场景', example: '例：情人节/母亲节/春节/毕业季', outdated: false }
]

const quickSamples: QuickSample[] = [
  {
    name: '护肤产品',
    scene: 'xiaohongshu',
    productName: '小气泡清洁面膜',
    sellingPoints: ['深层清洁毛孔', '温和不刺激', '15分钟黑头浮出', '敏感肌可用', '性价比超高'],
    audience: {
      age: 'millennial',
      gender: 'female',
      professions: ['office', 'student'],
      budget: 'cost',
      decision: 'herd',
      interests: ['beauty', 'fashion'],
      pains: ['anxiety', 'aging', 'tired'],
      emotions: ['empathy', 'aspiration'],
      hotspots: ['seasonal'],
      note: '经常熬夜追剧，肤色暗沉毛孔大，小红书重度用户'
    }
  },
  {
    name: '穿搭内容',
    scene: 'douyin',
    productName: '夏日微胖显瘦穿搭',
    sellingPoints: ['视觉显瘦10斤', '遮肉不显胯', '150cm也能穿', '一衣多穿', '平价不廉价'],
    audience: {
      age: 'genz',
      gender: 'female',
      professions: ['student', 'office'],
      budget: 'student',
      decision: 'emotion',
      interests: ['fashion', 'fitness'],
      pains: ['fat', 'inferior', 'anxiety'],
      emotions: ['empathy', 'aspiration'],
      hotspots: ['meme', 'social'],
      note: '身高155体重120，自卑不敢穿好看的衣服，想变美'
    }
  },
  {
    name: '知识付费',
    scene: 'moments',
    productName: '高效学习方法论',
    sellingPoints: ['30分钟专注法', '记忆效率提升3倍', '告别拖延症', '亲测有效', '附赠学习模板'],
    audience: {
      age: 'millennial',
      gender: 'neutral',
      professions: ['student', 'office', 'freelance'],
      budget: 'cost',
      decision: 'logic',
      interests: ['study', 'finance'],
      pains: ['delay', 'anxiety', 'lost'],
      emotions: ['anxiety', 'aspiration'],
      hotspots: ['social', 'trend'],
      note: '想提升但总是三分钟热度，焦虑未来发展'
    }
  },
  {
    name: '家居好物',
    scene: 'ecommerce',
    productName: '全自动洗脱一体扫地机器人',
    sellingPoints: ['激光导航精准建图', '自动洗拖布', '5000Pa大吸力', 'APP远程控制', '30天免清理尘盒'],
    audience: {
      age: 'millennial',
      gender: 'neutral',
      professions: ['office', 'mom', 'entrepreneur'],
      budget: 'quality',
      decision: 'logic',
      interests: ['home', 'tech'],
      pains: ['busy', 'tired', 'conflict'],
      emotions: ['healing', 'aspiration'],
      hotspots: ['trend', 'seasonal'],
      note: '工作忙回家还要做家务，和对象因为谁拖地吵架'
    }
  }
]

const productName = ref('')
const sellingPointsText = ref('')
const selectedScene = ref('xiaohongshu')
const selectedStyles = ref<string[]>([])
const versionCount = ref(5)
const emotionIntensity = ref(3)
const customHotspots = ref('')
const freshnessLevel = ref('persistent')
const isGenerating = ref(false)

const freshnessAlert = computed(() => {
  const map: Record<string, { title: string; type: any; detail: string }> = {
    classic: {
      title: '✅ 经典通用模式',
      type: 'success',
      detail: '输出文案不使用任何网络流行语，表达自然、专业、持久。适合品牌官网、长期挂的详情页、对调性有要求的品牌。'
    },
    persistent: {
      title: '🌿 轻度网感模式（推荐）',
      type: 'success',
      detail: '平衡新鲜度与持久度，使用"种草、天花板、沉浸式、氛围感"等生命力较长的词汇，既有网感又不易很快过时。适合大多数日常内容。'
    },
    meme: {
      title: '⚠️ 适度玩梗模式',
      type: 'warning',
      detail: '会融入部分流行词和热梗。注意：内置热梗可能滞后，强烈建议在"热点话题接入"中通过"自定义关键词"填入当下最新流行语，以保证新鲜感。'
    },
    heavy: {
      title: '🚨 高强度玩梗模式（慎用）',
      type: 'error',
      detail: '大量使用流行语和热梗，传播爆发力强但过时极快（通常1个月内失效）。仅适合短期追热点活动、快速涨粉内容。请务必在自定义关键词中填入最新词汇。'
    }
  }
  return map[freshnessLevel.value] || map.persistent
})
const generatedResults = ref<ViralCopyResult[]>([])
const activeVersion = ref(0)
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const defaultAudience = (): AudienceProfile => ({
  age: 'millennial',
  gender: 'female',
  professions: [],
  budget: 'cost',
  decision: 'emotion',
  interests: [],
  pains: [],
  emotions: [],
  hotspots: [],
  note: ''
})

const audience = reactive<AudienceProfile>(defaultAudience())

const sellingPointsList = computed(() =>
  sellingPointsText.value.split('\n').map(s => s.trim()).filter(s => s.length > 0)
)

const customHotspotList = computed(() =>
  customHotspots.value.split('\n').map(s => s.trim()).filter(s => s.length > 0)
)

const currentPlaceholder = computed(() => {
  const placeholders: Record<string, string> = {
    xiaohongshu: '例如：\n深层清洁毛孔\n温和不刺激\n15分钟黑头浮出\n敏感肌可用',
    douyin: '例如：\n视觉显瘦10斤\n遮肉不显胯\n150cm也能穿\n一衣多穿',
    moments: '例如：\n30分钟专注法\n记忆效率提升3倍\n告别拖延症\n亲测有效',
    ecommerce: '例如：\n激光导航精准建图\n自动洗拖布\n5000Pa大吸力\n30天免清理尘盒'
  }
  return placeholders[selectedScene.value] || placeholders.xiaohongshu
})

const currentStep = computed(() => {
  if (generatedResults.value.length > 0 && !isGenerating.value) return 4
  if (isGenerating.value) return 3
  if (audience.pains.length > 0 || audience.emotions.length > 0) return 2
  if (audience.age && audience.gender) return 1
  if (productName.value || sellingPointsText.value) return 0
  return 0
})

const canGenerate = computed(() => {
  return productName.value.trim().length > 0
    && sellingPointsList.value.length > 0
    && audience.pains.length > 0
})

const getOptionLabel = (options: Array<{ value: string; label: string }>, v: string) =>
  options.find(o => o.value === v)?.label || v

const getAgeLabel = (v: string) => getOptionLabel(ageOptions, v)
const getGenderLabel = (v: string) => getOptionLabel(genderOptions, v)
const getProfessionLabel = (v: string) => getOptionLabel(professionOptions, v)
const getBudgetLabel = (v: string) => getOptionLabel(budgetOptions, v)
const getDecisionLabel = (v: string) => getOptionLabel(decisionOptions, v)
const getInterestLabel = (v: string) => getOptionLabel(interestOptions, v)
const getPainLabel = (v: string) => getOptionLabel(audiencePainOptions, v)
const getEmotionLabel = (v: string) => getOptionLabel(emotionOptions, v)
const getHotspotLabel = (v: string) => getOptionLabel(hotspotOptions, v)

const toggleArrayItem = (arr: string[], value: string) => {
  const idx = arr.indexOf(value)
  if (idx > -1) {
    arr.splice(idx, 1)
  } else {
    arr.push(value)
  }
}

const buildAudienceDescription = (): string => {
  const parts: string[] = []
  parts.push(getAgeLabel(audience.age))
  parts.push(getGenderLabel(audience.gender))
  if (audience.professions.length > 0) {
    parts.push(audience.professions.map(getProfessionLabel).join('/'))
  }
  parts.push(getBudgetLabel(audience.budget))
  if (audience.interests.length > 0) {
    parts.push('关注' + audience.interests.map(getInterestLabel).join('、'))
  }
  if (audience.pains.length > 0) {
    parts.push('困扰于' + audience.pains.map(getPainLabel).join('、'))
  }
  if (audience.note) parts.push(audience.note)
  return parts.join('，')
}

const getActiveKeywords = (sceneValue: string): string[] => {
  const scene = sceneValue as keyof typeof tieredVocabulary.classic
  const classic = tieredVocabulary.classic[scene] || []
  const persistent = tieredVocabulary.persistent[scene] || []
  const meme = tieredVocabulary.meme[scene] || []

  switch (freshnessLevel.value) {
    case 'classic':
      return [...classic]
    case 'persistent':
      return [...classic, ...persistent]
    case 'meme':
      return [...classic, ...persistent, ...meme]
    case 'heavy':
      return [...persistent, ...meme, ...meme]
    default:
      return [...classic, ...persistent]
  }
}

const buildHotspotKeywords = (): string[] => {
  const keywords: string[] = []
  const month = new Date().getMonth() + 1
  const dateMap: Record<number, string[]> = {
    1: ['新年', '年货', '年终奖', '春节', '情人节预热'],
    2: ['情人节', '开学季', '春节', '正月', '立春'],
    3: ['三八节', '女神节', '春季', '换季', '春游'],
    4: ['清明', '春游', '踏青', '劳动节预热', '换季护肤'],
    5: ['五一', '劳动节', '母亲节', '520', '立夏'],
    6: ['儿童节', '618', '毕业季', '高考', '端午'],
    7: ['暑假', '七夕预热', '夏日', '防晒', '冰镇'],
    8: ['七夕', '开学季', '立秋', '夏日', '暑假收尾'],
    9: ['开学季', '教师节', '中秋', '国庆预热', '换季'],
    10: ['国庆', '双十一预热', '重阳节', '秋季', '万圣节'],
    11: ['双十一', '黑五', '感恩节', '双十二预热', '立冬'],
    12: ['双十二', '圣诞', '跨年', '年终总结', '年货节预热']
  }

  if (audience.hotspots.includes('seasonal')) {
    keywords.push(...pickMany(dateMap[month] || [], 2))
  }
  if (audience.hotspots.includes('meme')) {
    if (freshnessLevel.value === 'classic') {
      keywords.push(...pickMany(['新鲜事', '热门话题', '近期讨论度高'], 1))
    } else if (freshnessLevel.value === 'persistent') {
      keywords.push(...pickMany(['热议话题', '大家都在聊', '最近流行的'], 1))
    } else {
      const builtIn = ['显眼包', '搭子', '多巴胺', '整顿职场', '精神状态', '情绪价值', '松弛感', '反向消费', '特种兵式旅游', 'Citywalk']
      keywords.push(...pickMany(builtIn, 2))
    }
  }
  if (audience.hotspots.includes('trend')) {
    keywords.push(...pickMany(['AI赋能', '消费升级', '懒人经济', '悦己消费', '健康生活', '可持续', '智能化', '轻量化'], 2))
  }
  if (audience.hotspots.includes('nostalgia')) {
    keywords.push(...pickMany(['童年回忆', '90后', '复古回潮', '千禧风', '港风', '年代感', '怀旧经典'], 2))
  }
  if (audience.hotspots.includes('social')) {
    const socialWords = freshnessLevel.value === 'classic'
      ? ['社会关注', '大众讨论', '生活方式', '自我成长']
      : ['反内卷', '躺平', '女性力量', '打工人', '特种兵', '精神内耗', '职场PUA', '容貌焦虑', '身材自由', '搞钱']
    keywords.push(...pickMany(socialWords, 2))
  }
  if (audience.hotspots.includes('festival')) {
    keywords.push(...pickMany(['节日礼物', '节日氛围', '仪式感', '氛围感', '送礼攻略', '节日限定'], 2))
  }
  keywords.push(...customHotspotList.value)
  return keywords
}

const currentResult = computed(() => generatedResults.value[activeVersion.value] || null)

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const getSceneLabel = (v: string) => scenes.find(s => s.value === v)?.label || v
const getStyleLabel = (v: string) => styles.find(s => s.value === v)?.label || v
const getVersionTagType = (idx: number): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const types: Array<'' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = ['primary', 'success', 'warning', 'danger', 'info', '']
  return types[idx % types.length]
}

const applySample = (sample: QuickSample) => {
  selectedScene.value = sample.scene
  productName.value = sample.productName
  sellingPointsText.value = sample.sellingPoints.join('\n')
  if (sample.audience) {
    Object.assign(audience, defaultAudience(), sample.audience)
  }
  ElMessage.success('已载入示例数据')
}

const toggleStyle = (value: string) => {
  const idx = selectedStyles.value.indexOf(value)
  if (idx > -1) {
    selectedStyles.value.splice(idx, 1)
  } else {
    selectedStyles.value.push(value)
  }
}

const getEmotionIntensityModifier = (): {
  exclaim: string
  strongAdj: string[]
  prefixList: string[]
} => {
  const level = emotionIntensity.value
  const map: Record<number, { exclaim: string; strongAdj: string[]; prefixList: string[] }> = {
    1: {
      exclaim: '。',
      strongAdj: ['不错的', '挺好的', '舒适的'],
      prefixList: ['悄悄说一句', '个人觉得', '分享一下']
    },
    2: {
      exclaim: '～',
      strongAdj: ['很棒的', '超赞的', '真心推荐'],
      prefixList: ['真心推荐', '亲测体验', '分享给大家']
    },
    3: {
      exclaim: '！',
      strongAdj: ['绝了', '太赞了', '超好用'],
      prefixList: ['姐妹们', '家人们', '朋友们']
    },
    4: {
      exclaim: '！！',
      strongAdj: ['炸裂', '封神', '天花板级别', '绝绝子'],
      prefixList: ['天啊', '我真的', '不允许有人不知道']
    },
    5: {
      exclaim: '！！！',
      strongAdj: ['封神', '天花板', '史无前例', '宇宙无敌', '这辈子用过最好的'],
      prefixList: ['救命', '疯了', '破大防', '不看后悔一辈子']
    }
  }
  return map[level] || map[3]
}

const getEmotionToneModifier = (): {
  moodWords: string[]
  toneTemplates: Record<string, string[]>
} => {
  const emotions = audience.emotions.length > 0 ? audience.emotions : ['empathy']
  const moodWords: string[] = []
  const toneTemplates: Record<string, string[]> = {}

  emotions.forEach(emo => {
    switch (emo) {
      case 'anxiety':
        moodWords.push('焦虑', '担心', '慌张', '坐不住', '睡不着', '发愁')
        toneTemplates.anxiety = [
          '再不XX就真的来不及了',
          '别再因为XX而后悔了',
          '我真的不敢想，如果一直这样下去会怎样',
          '有多少人还在被XX折磨？'
        ]
        break
      case 'healing':
        moodWords.push('温暖', '治愈', '安心', '踏实', '柔软', '被理解')
        toneTemplates.healing = [
          '没关系，你不是一个人',
          '慢慢来，一切都会好的',
          '被这句话治愈到了',
          '希望你也能感受到这份温暖'
        ]
        break
      case 'aspiration':
        moodWords.push('向往', '期待', '美好', '闪闪发光', '更好的自己')
        toneTemplates.aspiration = [
          '你值得拥有更好的',
          '想象一下，XX之后的你会多棒',
          '为了更好的自己，这一切都值得',
          '你的人生，值得闪闪发光'
        ]
        break
      case 'empathy':
        moodWords.push('懂你', '同感', '同款', '太真实了', '世另我')
        toneTemplates.empathy = [
          '有没有人和我一样',
          '我太懂这种感受了',
          '这不就是说的我吗',
          '懂的都懂，不懂的也解释不了'
        ]
        break
      case 'curiosity':
        moodWords.push('好奇', '没想到', '居然', '竟然', '原来如此')
        toneTemplates.curiosity = [
          '你一定猜不到',
          '万万没想到',
          '99%的人都不知道',
          '真相竟然是这样'
        ]
        break
      case 'anger':
        moodWords.push('气死', '无语', '离谱', '忍不了', '受不了')
        toneTemplates.anger = [
          '真的忍不了了',
          '谁懂啊这也太离谱了',
          '我真的要被气炸了',
          '这种事居然还有人洗白？'
        ]
        break
    }
  })

  if (moodWords.length === 0) {
    moodWords.push('不错', '挺好', '推荐')
  }

  return { moodWords, toneTemplates }
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const pickMany = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, arr.length))
}

const addEmojis = (text: string, scene: string, count: number = 2): string => {
  const config = scenes.find(s => s.value === scene)?.config
  if (!config || Math.random() > config.emojiChance) return text
  const emojis = pickMany(config.channelEmojis, count)
  const pos = Math.random()
  if (pos < 0.33) return `${emojis.join('')} ${text}`
  if (pos < 0.66) return `${text} ${emojis.join('')}`
  return `${emojis[0]} ${text} ${emojis.slice(1).join('')}`
}

const injectHotspots = (text: string, hotspots: string[]): string => {
  if (hotspots.length === 0) return text
  if (Math.random() < 0.6) {
    const hs = pick(hotspots)
    const patterns = [
      `【${hs}】${text}`,
      `${text}｜${hs}必看`,
      `${hs} | ${text}`,
      `${text}（${hs}）`
    ]
    return pick(patterns)
  }
  return text
}

const getStructuredPains = (): string[] => {
  const painLabels = audience.pains.map(p => getPainLabel(p).replace(/[。！？]/g, ''))
  if (painLabels.length > 0) return painLabels
  return ['体验不佳', '不够满意', '有改进空间']
}

const getBudgetContext = (): string => {
  const map: Record<string, string[]> = {
    student: ['学生党也能冲', '白菜价', '平价中的战斗机', '零花钱就能入', '宿舍党必备'],
    cost: ['性价比天花板', '物超所值', '闭眼入不心疼', '大牌平替', '花小钱办大事'],
    quality: ['品质生活', '质感拉满', '值得投资的好物', '轻奢体验', '对自己好一点'],
    luxury: ['贵妇级体验', '高端享受', '顶配版', '不差钱系列', '一步到位']
  }
  return pick(map[audience.budget] || map.cost)
}

const getDecisionContext = (): string => {
  const map: Record<string, string[]> = {
    emotion: ['一眼心动', '一见钟情', '忍不住下手了', '太戳我了'],
    logic: ['做了功课才下手', '对比了N款选的', '数据党实测', '理性分析后推荐'],
    herd: ['全网都在推', '闺蜜都在用', '大家说好才是真的好', '跟着买就对了'],
    trial: ['大胆尝鲜', '盲入不踩雷', '新品首发体验', '第一个吃螃蟹的人']
  }
  return pick(map[audience.decision] || map.herd)
}

const getAgeContext = (): string => {
  const map: Record<string, string[]> = {
    genz: ['00后', 'Z世代', '年轻人', '学生党最爱', '当代大学生'],
    millennial: ['90后', '打工人', '职场人', '上班族', '精致的猪猪男孩/女孩'],
    genx: ['80后', '中年人', '成熟稳重', '品质一族', '上有老下有小'],
    boomer: ['长辈', '爸妈', '银发族', '注重品质', '讲究实在']
  }
  return pick(map[audience.age] || map.millennial)
}

const getGenderContext = (): string => {
  const map: Record<string, string[]> = {
    female: ['姐妹们', '女生们', '仙女们', '闺蜜们'],
    male: ['兄弟们', '男士们', '老铁们', '哥们'],
    neutral: ['朋友们', '家人们', '各位', '大家']
  }
  return pick(map[audience.gender] || map.neutral)
}

const generateTitle = (style: string, scene: string, product: string, points: string[]): string => {
  const config = scenes.find(s => s.value === scene)?.config!
  const activeKeywords = getActiveKeywords(scene)
  const pains = getStructuredPains()
  const mainPoint = points[0] || product
  const kw = pickMany(activeKeywords, 2)
  const hotspots = buildHotspotKeywords()
  const intensity = getEmotionIntensityModifier()
  const { moodWords } = getEmotionToneModifier()
  const ageCtx = getAgeContext()
  const genderCtx = getGenderContext()

  const templates: Record<string, string[]> = {
    suspense: [
      `${ageCtx}注意！${product}的${kw[0]}秘密，90%的人不知道`,
      `为什么${product}能${pick(moodWords)}？真相来了${intensity.exclaim}`,
      `用了${product}才发现，以前都白用了${intensity.exclaim}`,
      `${pick(intensity.prefixList)}，${product}的${kw[0]}真相一定要看`
    ],
    painpoint: [
      `${pains[0]}的${pick(moodWords)}？${product}帮你解决${kw[0]}问题${intensity.exclaim}`,
      `${genderCtx}还在为${pains[0]}发愁？${product}${kw[1]}安排${intensity.exclaim}`,
      `被${pains.slice(0, 2).join('、')}困扰？${product}${kw[0]}真的${intensity.strongAdj[0]}${intensity.exclaim}`,
      `${pains[0]}救星${intensity.exclaim}${ageCtx}的${product}真的${kw[1]}`
    ],
    benefit: [
      `${product}｜${mainPoint}｜${getBudgetContext()}${intensity.exclaim}`,
      `${pick(intensity.prefixList)}${intensity.exclaim}${product}让你${mainPoint}`,
      `${getDecisionContext()}，${product}${kw[0]}体验真的${intensity.strongAdj[0]}${intensity.exclaim}`,
      `${ageCtx}必看${intensity.exclaim}${product}${kw[0]}，${mainPoint}不是梦`
    ],
    contrast: [
      `用之前VS用之后：${product}太${intensity.strongAdj[0]}了${intensity.exclaim}`,
      `${genderCtx}告别传统方式，${product}${kw[1]}革命${intensity.exclaim}`,
      `同样是${product}，为什么这款${intensity.strongAdj[0]}？${getDecisionContext()}`,
      `以前花冤枉钱VS现在${getBudgetContext()}：${product}改变了我`
    ],
    emotion: [
      `${pick(moodWords)}${intensity.exclaim}${product}让我重新认识了${kw[1]}`,
      `${ageCtx}都在用的${product}，用过的人都说${intensity.strongAdj[0]}`,
      `${pick(intensity.prefixList)}真心${kw[0]}：${product}真的不一样${intensity.exclaim}`,
      `被${product}${pick(moodWords)}到了，${genderCtx}一定要试试${intensity.exclaim}`
    ],
    number: [
      `${pick([3, 4, 5, 6, 8])}个理由告诉你，${product}为什么${intensity.strongAdj[0]}${intensity.exclaim}`,
      `${product}的${pick([3, 5, 7])}大${kw[0]}亮点，${ageCtx}${kw[1]}必看`,
      `${pick([5, 6, 8])}分钟了解${product}的${kw[0]}优势，${getDecisionContext()}`,
      `${pick([3, 4, 5])}招教你用${product}实现${pick(moodWords)}自由${intensity.exclaim}`
    ]
  }

  let title = pick(templates[style] || templates.benefit)
  title = injectHotspots(title, hotspots)
  if (scene === 'douyin') {
    title = title.replace(/，/g, '！').replace(/。/g, '')
    if (!/[！？]$/.test(title)) title += intensity.exclaim
  }
  title = addEmojis(title, scene, scene === 'xiaohongshu' ? 3 : 2)
  return title
}

const generateHook = (style: string, scene: string, product: string, points: string[]): string => {
  const pains = getStructuredPains()
  const config = scenes.find(s => s.value === scene)?.config!
  const activeKeywords = getActiveKeywords(scene)
  const intensity = getEmotionIntensityModifier()
  const { moodWords, toneTemplates } = getEmotionToneModifier()
  const ageCtx = getAgeContext()
  const genderCtx = getGenderContext()
  const budgetCtx = getBudgetContext()
  const decisionCtx = getDecisionContext()
  const hotspots = buildHotspotKeywords()

  const hooks: Record<string, string[]> = {
    suspense: [
      `${pick(toneTemplates.curiosity || ['你一定猜不到'])}，${product}到底有什么魔力，能让${ageCtx}都${pick(moodWords)}${intensity.exclaim}今天给你们扒一扒真实体验～`,
      `${decisionCtx}，一开始我也不信${product}能有多${intensity.strongAdj[0]}，直到我亲自用了${pick([3, 7, 15, 30])}天...`,
      `${pick(intensity.prefixList)}如果不是${decisionCtx}，我真的不敢相信${product}居然这么${pick(moodWords)}${intensity.exclaim}看完你就懂了👇`
    ],
    painpoint: [
      `${pick(toneTemplates.empathy || ['有没有人和我一样'])}，被${pains[0]}折磨了很久${intensity.exclaim}${pains.length > 1 ? `还有${pains.slice(1).join('、')}这些问题，` : ''}真的${pick(moodWords)}😫`,
      `${genderCtx}${pains[0]}的痛谁懂啊${intensity.exclaim}试了各种方法都没用，直到我遇到了${product}...`,
      `${pick(toneTemplates.anxiety || ['如果你也有'])}${pains.slice(0, Math.min(3, pains.length)).join('、')}这些困扰，那这篇你一定要看完${intensity.exclaim}`
    ],
    benefit: [
      `${pick(intensity.prefixList)}今天给大家${pick(activeKeywords)}一个好东西${intensity.exclaim}${product}——${points[0]}，${budgetCtx}，用过的都说${intensity.strongAdj[0]}～`,
      `${genderCtx}谁懂啊${intensity.exclaim}${product}真的太${pick(moodWords)}了${intensity.exclaim}${points[0]}这点我真的爱了❤️`,
      `${pick(toneTemplates.aspiration || ['你值得拥有更好的'])}${intensity.exclaim}${product}可以说是我今年${pick(['最满意', '最值', '最惊喜'])}的入手了${intensity.exclaim}`
    ],
    contrast: [
      `${decisionCtx}以前我总觉得${product}都差不多，直到用了这款才发现：原来差距这么大${intensity.exclaim}`,
      `没有对比就没有伤害${intensity.exclaim}用了这款${product}之后，${budgetCtx}真的不一样...`,
      `从${pick(['怀疑', '拒绝', '嫌弃'])}到${pick(['回购', '安利', '离不开'])}，${product}到底做对了什么？${pick(moodWords)}了${intensity.exclaim}`
    ],
    emotion: [
      `${pick(toneTemplates.healing || ['没关系，你不是一个人'])}，写这篇的时候我真的很${pick(moodWords)}，${product}不仅仅是${pick(['一个产品', '一件物品', '一个工具'])}，更像是...`,
      `${pick(toneTemplates.empathy || ['我太懂这种感受了'])}，真的很想把这款${product}分享给每一个懂的人，那种${pick(['被理解', '被治愈', '被拯救'])}的感觉，希望你们也能体会到～`,
      `${pick(intensity.prefixList)}犹豫了很久还是决定发出来，关于${product}，有些话我真的不吐不快${intensity.exclaim}`
    ],
    number: [
      `${pick(intensity.prefixList)}今天给大家盘点${product}的${pick([3, 4, 5, 6])}个${pick(['神仙', '宝藏', '惊喜'])}亮点，最后一个真的${intensity.strongAdj[0]}${intensity.exclaim}`,
      `${pick([3, 5, 7])}个角度深度解析${product}，看完你就知道为什么${ageCtx}都${pick(activeKeywords)}`,
      `${pick(toneTemplates.curiosity || ['99%的人都不知道'])}关于${product}，这${pick([3, 4, 5])}点你一定要知道${intensity.exclaim}特别是第${pick([2, 3])}点${intensity.exclaim}`
    ]
  }

  let hook = pick(hooks[style] || hooks.benefit)
  if (hotspots.length > 0 && Math.random() < 0.4) {
    hook = `最近${pick(hotspots)}这个话题好火🔥${hook}`
  }
  return addEmojis(hook, scene, 1)
}

const generateBody = (style: string, scene: string, product: string, points: string[]): string => {
  const config = scenes.find(s => s.value === scene)?.config!
  const activeKeywords = getActiveKeywords(scene)
  const pains = getStructuredPains()
  const intensity = getEmotionIntensityModifier()
  const { moodWords, toneTemplates } = getEmotionToneModifier()
  const hotspots = buildHotspotKeywords()
  const audienceDesc = buildAudienceDescription()
  const lines: string[] = []
  const ageCtx = getAgeContext()
  const genderCtx = getGenderContext()
  const budgetCtx = getBudgetContext()
  const decisionCtx = getDecisionContext()

  if (scene === 'xiaohongshu') {
    lines.push(`📍先说说我的情况：${audienceDesc}`)
    lines.push('')
    if (hotspots.length > 0) {
      lines.push(`💭最近${pick(hotspots)}这个话题好火，今天就来聊聊相关的${product}～`)
      lines.push('')
    }
    lines.push(`💡${decisionCtx}，我的真实体验：`)
    points.forEach((p, i) => {
      const pointEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']
      lines.push(`${pointEmojis[i] || '✨'} ${p}——${pick(intensity.strongAdj)}${intensity.exclaim}${generateDetailForPoint(p, scene)}`)
    })
    lines.push('')
    if (pains.length > 0) {
      lines.push(`😭以前的困扰：${pains.join('、')}，真的太${pick(moodWords)}了${intensity.exclaim}`)
      lines.push(`${pick(toneTemplates.aspiration || ['你值得拥有更好的'])}，用了${product}之后，${pick(['真的改善了好多', '肉眼可见的变化', '感觉人生都亮了'])}${pick(['✨', '🥹', '💯', '❤️'])}`)
      lines.push('')
    }
    lines.push(`📌总结一下：${product}——${budgetCtx}，${pick(['真的值得入手', '闭眼入不踩雷', '用过就回不去了', '性价比超高'])}${intensity.exclaim}`)
    lines.push(`${genderCtx}${pick(['冲就对了', '不买真的会后悔', '推荐给每一个需要的人', '我的年度爱用好物'])}${intensity.exclaim}`)
  } else if (scene === 'douyin') {
    lines.push(`${pick(activeKeywords)}${intensity.exclaim}${ageCtx}的${product}真的太${intensity.strongAdj[0]}了${intensity.exclaim}`)
    if (hotspots.length > 0) {
      lines.push(`最近${pick(hotspots)}好火，这个${product}真的${pick(moodWords)}${intensity.exclaim}`)
    }
    lines.push(`${points[0]}这点，谁用谁知道${intensity.exclaim}`)
    if (points.length > 1) {
      lines.push(`还有${points.slice(1, 3).join('、')}，每一个点都戳中我${intensity.exclaim}`)
    }
    if (pains.length > 0) {
      lines.push(`${pick(toneTemplates.empathy || ['有没有人和我一样'])}，${pains[0]}真的太痛苦了...现在终于解脱了${intensity.exclaim}`)
    }
    lines.push(`${pick(toneTemplates.aspiration || ['你值得拥有更好的'])}，${decisionCtx}，${budgetCtx}${intensity.exclaim}`)
    lines.push(pick(['不接受反驳', '不信你试试', '用过的都懂', '真的绝绝子']) + intensity.exclaim)
  } else if (scene === 'moments') {
    lines.push(`${pick(toneTemplates.healing || ['慢慢来，一切都会好的'])}...`)
    lines.push(`${pick(intensity.prefixList)}，最初朋友给我推荐${product}的时候我还挺犹豫的...`)
    lines.push(`毕竟${audienceDesc}，之前也踩过不少坑。`)
    lines.push('')
    lines.push(`但用了${pick([2, 3, 4])}周之后，真心觉得：${pick(['太值了', '相见恨晚', '应该早买的'])}${intensity.exclaim}${pick(moodWords)}～`)
    points.forEach(p => {
      lines.push(`✅ ${p}——这点真的${pick(['很用心', '很实在', '超出预期'])}，${budgetCtx}`)
    })
    lines.push('')
    if (hotspots.length > 0) {
      lines.push(`刚好最近${pick(hotspots)}这个话题很火，分享给大家～`)
    }
    lines.push(pick([
      `${pick(toneTemplates.healing || ['好的东西值得分享给大家'])}～感兴趣的朋友可以私我了解更多～`,
      '不是广告，纯自用分享，真心觉得不错才推荐～',
      `${pick(toneTemplates.aspiration || ['生活已经这么累了'])}，对自己好一点不过分吧～`,
      '把这份美好分享给身边的每一个人❤️'
    ]))
  } else {
    lines.push(`🔥 ${pick(activeKeywords)}${intensity.exclaim}${hotspots.length > 0 ? `【${pick(hotspots)}】` : ''}${product} 震撼上市${intensity.exclaim}`)
    lines.push('')
    lines.push(`🎯 ${ageCtx}为什么选择${product}？${decisionCtx}，${budgetCtx}${intensity.exclaim}`)
    points.forEach((p, i) => {
      const tags = ['核心优势', '独家亮点', '品质保障', '用户首选', '行业领先']
      lines.push(`【${tags[i] || '品质之选'}】${p}`)
      lines.push(generateDetailForPoint(p, scene))
      lines.push('')
    })
    if (pains.length > 0) {
      lines.push(`💡 直击${ageCtx}痛点：告别${pains.join('、')}等困扰，${pick(toneTemplates.aspiration || ['你值得拥有更好的'])}${intensity.exclaim}`)
      lines.push('')
    }
    lines.push(pick([
      '🏆 品质保证，售后无忧！现在下单尊享专属优惠！',
      `⚡ ${pick(['限时特惠', '今日特价', '专属活动'])}，${pick(toneTemplates.anxiety || ['库存有限'])}！手慢无${intensity.exclaim}`,
      '🎁 今日下单赠送超值礼包，错过再等一年！',
      `💎 ${ageCtx}的共同选择，你值得拥有${intensity.exclaim}`
    ]))
  }

  return lines.join('\n')
}

const generateDetailForPoint = (point: string, scene: string): string => {
  const techPatterns = [/[\d.]+(ml|g|小时|天|nm|Pa|万|次|%)/i, /自动|智能|精准|激光|纳米|高纯度|深层|360°/i]
  const isTech = techPatterns.some(p => p.test(point))
  const intensity = getEmotionIntensityModifier()
  const budgetCtx = getBudgetContext()
  const decisionCtx = getDecisionContext()

  if (scene === 'xiaohongshu') {
    if (isTech) {
      return pick([
        `${budgetCtx}能做到这个配置，真的性价比拉满${intensity.exclaim}`,
        `${decisionCtx}做了很多功课才发现，这个参数这个价格真的太香了${intensity.exclaim}`,
        `对比了好多款，这款在这方面的表现真的${intensity.strongAdj[0]}${intensity.exclaim}`
      ])
    }
    return pick([
      `用了之后就知道什么叫"一分钱一分货"，体验感完全不一样${intensity.exclaim}`,
      '细节见真章，这点真的能感受到用心！',
      `这才是真正为${getAgeContext()}考虑的设计，太懂我了${intensity.exclaim}`
    ])
  } else if (scene === 'ecommerce') {
    if (isTech) {
      return pick([
        '行业领先配置，性能远超同价位产品！',
        '通过多项权威认证，品质值得信赖！',
        `采用最新技术，${intensity.strongAdj[0]}，效果显著提升${intensity.exclaim}`
      ])
    }
    return pick([
      '精选优质原料，匠心打造每一个细节！',
      '经过严格品控，确保每件出品都达到最高标准！',
      `${getAgeContext()}的口碑之选，好评如潮${intensity.exclaim}`
    ])
  }
  return pick([
    `这点真的太戳我了${intensity.exclaim}`,
    `${getGenderContext()}谁懂啊${intensity.exclaim}这个真的超好用${intensity.exclaim}`,
    `${decisionCtx}体验过就知道有多香${intensity.exclaim}`
  ])
}

const generateCTA = (scene: string): string => {
  const config = scenes.find(s => s.value === scene)?.config!
  const cta = pick(config.ctaTypes)
  const intensity = getEmotionIntensityModifier()
  const { toneTemplates } = getEmotionToneModifier()
  const genderCtx = getGenderContext()
  const hotspots = buildHotspotKeywords()

  const ctaMap: Record<string, Record<string, string[]>> = {
    xiaohongshu: {
      '评论互动': [
        `${genderCtx}觉得有用的话记得点赞收藏哦～有问题评论区见💬`,
        `你们还有什么想了解的？评论区告诉我👇${pick(toneTemplates.curiosity || [])}`,
        `喜欢的话记得点赞收藏，下期${hotspots.length > 0 ? '继续聊' + pick(hotspots) + '相关' : ''}分享更多好物${intensity.exclaim}`
      ],
      '收藏关注': [
        `${genderCtx}记得点赞+收藏+关注哦，后续分享更多${pick(intensity.strongAdj)}好物✨`,
        `关注我不迷路，更多宝藏好物持续更新中${intensity.exclaim}${pick(toneTemplates.aspiration || [])}`,
        `收藏起来慢慢看，关注我get更多实用干货💗`
      ],
      '私信咨询': [
        `想了解更多的${genderCtx}可以私信我哦～看到都会回的💌`,
        `有任何疑问都可以私信问我，一一为你解答～${pick(toneTemplates.healing || [])}`,
        `想要链接的${genderCtx}直接私信我哈～`
      ],
      '链接购买': [
        `链接放评论区啦，喜欢的${genderCtx}可以冲${intensity.exclaim}🛒`,
        `同款在主页店铺哦，${genderCtx}冲${intensity.exclaim}${getBudgetContext()}`,
        `点击左下角链接即可购买，${hotspots.length > 0 ? pick(hotspots) + '限时优惠中' : '限时优惠中'}～`
      ]
    },
    douyin: {
      '点赞关注': [
        `点赞关注不迷路${intensity.exclaim}下期${pick(intensity.strongAdj)}${intensity.exclaim}🔥`,
        `觉得有用的话点个小红心❤️，关注我了解更多${intensity.exclaim}`,
        `双击屏幕点亮爱心，关注我每天分享${pick(intensity.strongAdj)}好物${intensity.exclaim}`
      ],
      '评论留言': [
        `${toneTemplates.empathy?.[0] || '你们觉得怎么样？'}评论区告诉我👇`,
        `有没有同款${genderCtx}？评论区举个手🙋`,
        `你们最想看什么？评论区告诉我${intensity.exclaim}`
      ],
      '转发分享': [
        `${toneTemplates.aspiration?.[0] || '觉得有用'}就转发给身边的朋友吧～`,
        `快@你那个需要的朋友来看${intensity.exclaim}`,
        `转发给你的闺蜜/兄弟，一起变美/变优秀✨`
      ],
      '点击购物车': [
        `喜欢的点击下方购物车直接下单${intensity.exclaim}🛒${getBudgetContext()}`,
        `同款就在小黄车，手慢无${intensity.exclaim}`,
        `点我头像进主页店铺，更多${pick(intensity.strongAdj)}好物等你${intensity.exclaim}`
      ]
    },
    moments: {
      '私聊咨询': [
        `感兴趣的朋友可以私信我聊～${pick(toneTemplates.healing || [])}`,
        `有任何问题随时找我，乐意解答😊`,
        `想了解更多详情的话欢迎私聊～`
      ],
      '点赞互动': [
        `${toneTemplates.aspiration?.[0] || '觉得有用'}的话点个赞让更多人看到～`,
        `看完记得点个赞哦👍`,
        `朋友圈的朋友们，有没有同款爱好者🙋`
      ],
      '转发给好友': [
        `${toneTemplates.healing?.[0] || '好东西值得分享'}，欢迎转发给身边有需要的朋友～`,
        `好东西值得分享，转发给TA吧${intensity.exclaim}`,
        `快转给需要的朋友～不用谢😊`
      ],
      '扫码了解': [
        `扫描下方二维码了解更多详情～${hotspots.length > 0 ? pick(hotspots) + '专属福利' : ''}`,
        `识别图中二维码即可购买/咨询${intensity.exclaim}`,
        `长按识别二维码，获取更多信息～`
      ]
    },
    ecommerce: {
      '立即下单': [
        `立即下单，享受${hotspots.length > 0 ? pick(hotspots) + '专属' : ''}优惠${intensity.exclaim}🛒`,
        `现在下单立减${intensity.exclaim}${pick(toneTemplates.anxiety || ['错过再等一年'])}${intensity.exclaim}`,
        `点击立即购买，${pick(toneTemplates.aspiration || ['开启品质生活'])}${intensity.exclaim}`
      ],
      '加入购物车': [
        `喜欢的话先加入购物车吧～${getBudgetContext()}`,
        `加购收藏不迷路，随时下单享优惠${intensity.exclaim}`,
        `加入购物车，凑单更划算${intensity.exclaim}`
      ],
      '领券购买': [
        `点击领取${hotspots.length > 0 ? pick(hotspots) + '专属' : ''}优惠券，下单更省钱${intensity.exclaim}💰`,
        `先领券再购物，${getBudgetContext()}，省到就是赚到${intensity.exclaim}`,
        `限时优惠券领取中，立即使用${intensity.exclaim}`
      ],
      '限时抢购': [
        `⚡ ${hotspots.length > 0 ? pick(hotspots) + '' : ''}限时特惠，${pick(toneTemplates.anxiety || ['库存告急'])}，欲购从速${intensity.exclaim}`,
        `🔥 今日特价，最后${pick([3, 5, 100])}件${intensity.exclaim}`,
        `倒计时${pick([1, 2, 24])}${pick(['小时', '天'])}，手慢无${intensity.exclaim}`
      ]
    }
  }

  return pick(ctaMap[scene]?.[cta] || ctaMap.xiaohongshu['收藏关注'])
}

const generateHashtags = (scene: string, product: string, points: string[]): string => {
  const config = scenes.find(s => s.value === scene)?.config!
  const activeKeywords = getActiveKeywords(scene)
  const tags: string[] = []
  const hotspots = buildHotspotKeywords()
  const interests = audience.interests.map(getInterestLabel).slice(0, 2)

  tags.push(`#${product.slice(0, 6)}`)

  if (hotspots.length > 0) {
    pickMany(hotspots, 2).forEach(h => tags.push('#' + h))
  }

  if (scene === 'xiaohongshu') {
    tags.push('#好物分享')
    tags.push('#宝藏好物')
    if (interests.length > 0) interests.forEach(i => tags.push('#' + i))
    tags.push(pick(['#种草日记', '#好物推荐', '#我的日常', '#生活好物', '#学生党必备', '#平价好物']))
    if (points.length > 0) {
      tags.push('#' + points[0].replace(/[。！？，、]/g, '').slice(0, 8))
    }
    tags.push(pick(['#自用分享', '#好物安利', '#亲测有效', '#闭眼入']))
  } else if (scene === 'douyin') {
    tags.push('#好物推荐')
    if (interests.length > 0) interests.forEach(i => tags.push('#' + i))
    tags.push(pick(['#涨知识', '#生活小妙招', '#必看', '#干货分享', '#热门推荐']))
    tags.push(pick(['#护肤分享', '#穿搭分享', '#学习方法', '#居家好物', '#美食推荐']))
  } else if (scene === 'moments') {
    tags.push('#好物分享')
    if (interests.length > 0) interests.forEach(i => tags.push('#' + i))
    tags.push(pick(['#生活日常', '#分享美好', '#真实感受', '#自用推荐']))
  } else {
    tags.push('#热销爆款')
    if (interests.length > 0) interests.forEach(i => tags.push('#' + i))
    tags.push(pick(['#品质优选', '#限时特惠', '#正品保障', '#厂家直供', '#爆款推荐']))
    tags.push(pick(['#好物推荐', '#超值性价比', '#品质之选', '#居家必备']))
  }

  tags.push('#' + pick(activeKeywords))

  return tags.join(' ')
}

const generateSingleCopy = (styleKey: string, scene: string): ViralCopyResult => {
  const styleInfo = styles.find(s => s.value === styleKey) || styles[0]
  const product = productName.value.trim()
  const points = sellingPointsList.value

  return {
    title: generateTitle(styleKey, scene, product, points),
    hook: generateHook(styleKey, scene, product, points),
    body: generateBody(styleKey, scene, product, points),
    cta: generateCTA(scene),
    hashtags: generateHashtags(scene, product, points),
    style: styleKey,
    styleLabel: styleInfo.label
  }
}

const getApplicableStyles = (): string[] => {
  if (selectedStyles.value.length > 0) return selectedStyles.value
  return styles.map(s => s.value)
}

const generateCopy = async () => {
  if (!canGenerate.value) {
    ElMessage.warning('请填写完整信息：产品名称、核心卖点和至少一个核心痛点')
    return
  }

  isGenerating.value = true
  generatedResults.value = []
  activeVersion.value = 0

  await new Promise(resolve => setTimeout(resolve, 600))

  const applicableStyles = getApplicableStyles()
  const shuffled = [...applicableStyles].sort(() => Math.random() - 0.5)
  const picked: string[] = []
  for (let i = 0; i < versionCount.value; i++) {
    picked.push(shuffled[i % shuffled.length])
  }

  for (let i = 0; i < picked.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 250 + Math.random() * 150))
    generatedResults.value.push(generateSingleCopy(picked[i], selectedScene.value))
  }

  isGenerating.value = false

  history.value.push({
    productName: productName.value.trim(),
    sellingPointsText: sellingPointsText.value,
    sellingPoints: [...sellingPointsList.value],
    targetUser: buildAudienceDescription(),
    audience: { ...audience },
    customHotspots: customHotspots.value,
    emotionIntensity: emotionIntensity.value,
    freshnessLevel: freshnessLevel.value,
    scene: selectedScene.value,
    results: [...generatedResults.value],
    time: new Date().toISOString()
  })
  saveHistory()

  const emotionText = audience.emotions.length > 0 ? ` · ${audience.emotions.length}种情绪` : ''
  const hotspotText = audience.hotspots.length > 0 ? ` · ${audience.hotspots.length}类热点` : ''
  ElMessage.success({
    message: `✨ 已基于${audience.pains.length}个核心痛点${emotionText}${hotspotText}，生成 ${generatedResults.value.length} 个爆款文案方案`,
    type: 'success',
    duration: 3500,
    showClose: true
  })
}

const regenerateVersion = async () => {
  const current = generatedResults.value[activeVersion.value]
  const applicableStyles = getApplicableStyles()
  const pool = applicableStyles.filter(s => s !== current.style)
  const styleKey = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : current.style
  const newResult = generateSingleCopy(styleKey, selectedScene.value)
  generatedResults.value.splice(activeVersion.value, 1, newResult)
  ElMessage.success('已重新生成该版本')
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

const copyAllResults = async () => {
  const text = generatedResults.value
    .map((r, i) => `【版本 ${i + 1} · ${r.styleLabel}】\n\n📌 标题：${r.title}\n\n⚡ Hook：${r.hook}\n\n📝 正文：\n${r.body}\n\n🎯 CTA：${r.cta}\n\n#️⃣ 标签：${r.hashtags}\n${'='.repeat(40)}`)
    .join('\n\n')
  await copyText(text)
}

const copyCurrentFull = async () => {
  const r = currentResult.value
  if (!r) return
  const text = `${r.title}\n\n${r.hook}\n\n${r.body}\n\n${r.cta}\n\n${r.hashtags}`
  await copyText(text)
}

const resetAll = () => {
  productName.value = ''
  sellingPointsText.value = ''
  selectedStyles.value = []
  selectedScene.value = 'xiaohongshu'
  versionCount.value = 5
  emotionIntensity.value = 3
  customHotspots.value = ''
  freshnessLevel.value = 'persistent'
  Object.assign(audience, defaultAudience())
  generatedResults.value = []
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
  productName.value = item.productName
  sellingPointsText.value = item.sellingPointsText
  selectedScene.value = item.scene
  generatedResults.value = item.results
  if (item.audience) {
    Object.assign(audience, defaultAudience(), item.audience)
  }
  if (typeof item.emotionIntensity === 'number') {
    emotionIntensity.value = item.emotionIntensity
  }
  if (item.customHotspots !== undefined) {
    customHotspots.value = item.customHotspots
  }
  if (typeof item.freshnessLevel === 'string') {
    freshnessLevel.value = item.freshnessLevel
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
.viral-copy-generator {
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

.channel-diff-table {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
}

.diff-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.2fr 1.2fr 1.2fr;
}

.diff-header {
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
}

.diff-header .diff-col {
  font-weight: 600;
  font-size: 13px;
  color: #fff;
}

.diff-col {
  padding: 12px 14px;
  font-size: 13px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  line-height: 1.6;
}

.diff-row:last-child .diff-col {
  border-bottom: none;
}

.diff-col:last-child {
  border-right: none;
}

.diff-label {
  font-weight: 600;
  color: #303133;
  background: #f5f7fa;
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
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.required-tag {
  color: #f56c6c;
  font-size: 14px;
  margin-left: 2px;
}

.hint-tag {
  margin-left: 12px;
  font-weight: normal;
}

.input-section {
  margin-bottom: 24px;
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
  color: #909399;
  margin-right: 4px;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.sample-tag:hover {
  transform: translateY(-1px);
}

.scene-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.scene-card {
  padding: 18px 14px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
  background: #fff;
}

.scene-card:hover:not(.disabled) {
  border-color: #c6e2ff;
  background: #f0f7ff;
  transform: translateY(-2px);
}

.scene-card.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #e8f0ff 0%, #f0f7ff 100%);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

.scene-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.scene-emoji {
  font-size: 28px;
  margin-bottom: 8px;
}

.scene-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.scene-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.scene-spec {
  font-size: 11px;
  color: #606266;
  padding: 3px 8px;
  background: #f5f7fa;
  border-radius: 10px;
  display: inline-block;
}

.two-col-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.flex-1 {
  flex: 1;
}

.style-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.style-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border: 1.5px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  font-size: 13px;
}

.style-chip:hover:not(.disabled) {
  border-color: #c6e2ff;
  background: #f0f7ff;
}

.style-chip.active {
  border-color: #165DFF;
  background: #e8f0ff;
  color: #165DFF;
  font-weight: 600;
}

.style-chip.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.style-emoji {
  font-size: 16px;
}

.style-tip {
  margin-top: 8px;
}

.version-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.version-card {
  padding: 14px 10px;
  border: 1.5px solid #ebeef5;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}

.version-card:hover:not(.disabled) {
  border-color: #c6e2ff;
  background: #f0f7ff;
}

.version-card.active {
  border-color: #67c23a;
  background: linear-gradient(135deg, #eafff0 0%, #f0fff4 100%);
}

.version-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.version-num {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 2px;
}

.version-card.active .version-num {
  color: #67c23a;
}

.version-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 2px;
}

.version-desc {
  font-size: 11px;
  color: #909399;
}

.action-section {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.generate-btn {
  flex: 1;
}

.btn-loading-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.generating-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  margin-top: 16px;
  background: linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%);
  border-radius: 10px;
  border: 1px dashed #e6a23c;
}

.generating-dots {
  display: flex;
  gap: 4px;
}

.generating-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e6a23c;
  animation: pulse 1.4s infinite;
}

.generating-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.generating-dots .dot:nth-child(3) {
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

.generating-text {
  font-size: 14px;
  color: #b88230;
  font-weight: 500;
}

.result-card {
  margin-bottom: 24px;
}

.version-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.version-tab {
  padding: 10px 18px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.version-tab:hover {
  background: #e8ecf1;
}

.version-tab.active {
  background: linear-gradient(135deg, #165DFF 0%, #409eff 100%);
  color: #fff;
  font-weight: 600;
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

.section-title-sm > :last-child {
  margin-left: auto;
}

.result-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #ebeef5;
}

.result-section:last-of-type {
  border-bottom: none;
}

.result-title-text {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  line-height: 1.6;
  padding: 14px 18px;
  background: linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%);
  border-radius: 10px;
  border-left: 4px solid #e6a23c;
}

.result-hook-text {
  font-size: 15px;
  color: #606266;
  line-height: 1.8;
  padding: 14px 18px;
  background: linear-gradient(135deg, #fef0f0 0%, #fff5f5 100%);
  border-radius: 10px;
  border-left: 4px solid #f56c6c;
}

.result-body-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.9;
  padding: 18px 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  white-space: pre-wrap;
}

.result-cta-text {
  font-size: 15px;
  color: #303133;
  line-height: 1.7;
  padding: 14px 18px;
  background: linear-gradient(135deg, #f0f9eb 0%, #f5fff0 100%);
  border-radius: 10px;
  border-left: 4px solid #67c23a;
  font-weight: 500;
}

.result-hashtags-text {
  font-size: 14px;
  color: #909399;
  line-height: 1.8;
  padding: 14px 18px;
  background: #f5f7fa;
  border-radius: 10px;
  letter-spacing: 0.3px;
}

.result-footer {
  display: flex;
  gap: 12px;
  margin-top: 8px;
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
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  border-color: #c6e2ff;
  background: #f0f7ff;
  transform: translateX(4px);
}

.history-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.history-product {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.history-text {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.history-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.history-footer {
  margin-top: 16px;
  text-align: center;
}

.audience-card,
.emotion-card,
.hotspot-card {
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
}

.audience-card :deep(.el-card__header),
.emotion-card :deep(.el-card__header),
.hotspot-card :deep(.el-card__header) {
  padding: 12px 20px;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
  border-bottom: 1px solid #ebeef5;
}

.audience-card :deep(.el-card__body),
.emotion-card :deep(.el-card__body),
.hotspot-card :deep(.el-card__body) {
  padding: 20px;
}

.audience-row {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
}

.audience-row:last-child {
  margin-bottom: 0;
}

.audience-item {
  flex: 1;
  min-width: 0;
}

.flex-2 {
  flex: 2;
}

.audience-label {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chip-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chip-group.wrap {
  flex-wrap: wrap;
}

.chip-item {
  padding: 7px 14px;
  border: 1.5px solid #dcdfe6;
  border-radius: 20px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  user-select: none;
  white-space: nowrap;
}

.chip-item:hover:not(.disabled) {
  border-color: #909399;
  background: #f5f7fa;
  color: #303133;
}

.chip-item.active {
  border-color: #165DFF;
  background: linear-gradient(135deg, #e8f0ff 0%, #f0f7ff 100%);
  color: #165DFF;
  font-weight: 600;
}

.chip-item.pain.active {
  border-color: #f56c6c;
  background: linear-gradient(135deg, #fef0f0 0%, #fff5f5 100%);
  color: #f56c6c;
}

.chip-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.emotion-group {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.emotion-card-item {
  padding: 16px 10px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
  background: #fff;
}

.emotion-card-item:hover:not(.disabled) {
  border-color: #e6a23c;
  background: #fffdf5;
  transform: translateY(-2px);
}

.emotion-card-item.active {
  border-color: #e6a23c;
  background: linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.2);
}

.emotion-card-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.emotion-emoji {
  font-size: 28px;
  margin-bottom: 6px;
}

.emotion-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.emotion-desc {
  font-size: 11px;
  color: #909399;
  line-height: 1.4;
}

.hotspot-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.hotspot-card-item {
  padding: 16px 14px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s;
  background: #fff;
}

.hotspot-card-item:hover:not(.disabled) {
  border-color: #f56c6c;
  background: #fff5f5;
  transform: translateY(-2px);
}

.hotspot-card-item.active {
  border-color: #f56c6c;
  background: linear-gradient(135deg, #fff1f0 0%, #fff5f5 100%);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.15);
}

.hotspot-card-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.hotspot-emoji {
  font-size: 24px;
  margin-bottom: 6px;
}

.hotspot-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.hotspot-desc {
  font-size: 12px;
  color: #606266;
  margin-bottom: 6px;
  line-height: 1.5;
}

.hotspot-example {
  font-size: 11px;
  color: #909399;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 6px;
  display: inline-block;
}

.header-actions {
  margin-left: auto;
}

.freshness-warning {
  margin-bottom: 20px;
}

.freshness-warning :deep(.el-alert__description) {
  font-size: 13px;
  line-height: 1.7;
}

.outdated-tag {
  margin-left: 8px;
  font-size: 10px;
}

.hotspot-card-item.outdated {
  border: 1px dashed #e6a23c;
}

.hotspot-card-item.outdated .hotspot-name {
  color: #e6a23c;
}

.custom-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #fdf6ec;
  border-radius: 6px;
  font-size: 12px;
  color: #b88230;
  line-height: 1.6;
}

.freshness-card {
  background: linear-gradient(180deg, #f0f9eb 0%, #ffffff 100%);
  margin-bottom: 24px;
}

.freshness-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}

.freshness-card-item {
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
  position: relative;
}

.freshness-card-item:hover {
  border-color: #c2e7b0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.15);
}

.freshness-card-item.active {
  border-color: #67c23a;
  background: linear-gradient(135deg, #f0f9eb 0%, #ffffff 100%);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);
}

.freshness-card-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.freshness-emoji {
  font-size: 28px;
  margin-bottom: 8px;
}

.freshness-name {
  font-size: 15px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
}

.freshness-shelf {
  font-size: 12px;
  color: #67c23a;
  font-weight: 600;
  margin-bottom: 8px;
}

.freshness-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 8px;
}

.freshness-example {
  font-size: 11px;
  color: #909399;
  padding: 6px 10px;
  background: #f5f7fa;
  border-radius: 6px;
  line-height: 1.5;
}

.freshness-alert {
  margin-top: 8px;
}

.freshness-alert :deep(.el-alert__description) {
  font-size: 13px;
  line-height: 1.7;
}
</style>