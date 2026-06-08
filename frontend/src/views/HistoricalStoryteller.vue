<template>
  <div class="historical-storyteller">
    <el-card class="intro-card">
      <div class="intro-header">
        <div class="intro-left">
          <div class="intro-icon">📜</div>
          <div class="intro-text">
            <h2 class="intro-title">历史故事化叙述</h2>
            <p class="intro-subtitle">
              输入历史事件、历史人物或时间段，AI 以通俗易懂、情节生动的故事化方式讲述，让枯燥的历史变得引人入胜
            </p>
          </div>
        </div>
        <div class="intro-badges">
          <el-tag type="primary" effect="dark" size="large">🎭 {{ narrativeStyles.length }} 种叙事风格</el-tag>
          <el-tag type="success" effect="dark" size="large">📖 沉浸式故事体验</el-tag>
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
              <span class="at-emoji">📚</span>
              <span class="at-name">历史爱好者</span>
              <span class="at-desc">深度了解历史背后的故事</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">🎓</span>
              <span class="at-name">学生群体</span>
              <span class="at-desc">趣味学习历史知识</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">👨‍🏫</span>
              <span class="at-name">教师</span>
              <span class="at-desc">备课教学素材</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">✍️</span>
              <span class="at-name">内容创作者</span>
              <span class="at-desc">历史科普文章与视频</span>
            </div>
            <div class="audience-tag">
              <span class="at-emoji">🎬</span>
              <span class="at-name">短视频创作者</span>
              <span class="at-desc">历史题材内容脚本</span>
            </div>
          </div>
        </div>
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><Grid /></el-icon>
            典型应用场景
          </h4>
          <div class="scene-tags">
            <el-tag size="large" effect="plain">历史学习辅助</el-tag>
            <el-tag size="large" effect="plain">历史科普创作</el-tag>
            <el-tag size="large" effect="plain">课堂教学素材</el-tag>
            <el-tag size="large" effect="plain">短视频脚本</el-tag>
            <el-tag size="large" effect="plain">公众号历史文章</el-tag>
            <el-tag size="large" effect="plain">亲子历史阅读</el-tag>
            <el-tag size="large" effect="plain">考试复习记忆</el-tag>
            <el-tag size="large" effect="plain">读书会分享</el-tag>
          </div>
        </div>
        <div class="intro-section">
          <h4 class="section-label">
            <el-icon><Collection /></el-icon>
            三种输入类型一览
          </h4>
          <div class="type-overview-grid">
            <div
              v-for="it in inputTypes"
              :key="it.value"
              class="type-overview-card"
            >
              <div class="toc-header">
                <span class="toc-emoji">{{ it.emoji }}</span>
                <span class="toc-label">{{ it.label }}</span>
              </div>
              <div class="toc-desc">{{ it.desc }}</div>
              <div class="toc-list">
                <div
                  v-for="ex in it.examples"
                  :key="ex"
                  class="toc-item"
                >
                  <span class="toc-item-emoji">💡</span>
                  <span class="toc-item-name">{{ ex }}</span>
                </div>
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
        <el-step title="选择输入类型" description="历史事件 / 人物 / 时间段" />
        <el-step title="输入历史主题" description="主体名称 + 关注点（可选）" />
        <el-step title="设定叙事风格" description="戏剧化 × 教育性 × 篇幅长度" />
        <el-step title="阅读与使用" description="故事内容 + 知识点 + 延伸阅读" />
      </el-steps>
      <el-divider />
      <div class="expectation-section">
        <h4 class="expectation-title">📊 你将获得什么？</h4>
        <div class="expectation-grid">
          <div class="expectation-item">
            <el-icon :size="24" color="#165DFF"><Document /></el-icon>
            <div class="exp-text">
              <div class="exp-num">完整故事叙述</div>
              <div class="exp-label">有开端、发展、高潮、结局的故事结构</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#67c23a"><MagicStick /></el-icon>
            <div class="exp-text">
              <div class="exp-num">{{ narrativeStyles.length }} 种叙事风格</div>
              <div class="exp-label">戏剧化、教育性、人物传记等多维覆盖</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#e6a23c"><Star /></el-icon>
            <div class="exp-text">
              <div class="exp-num">核心知识点</div>
              <div class="exp-label">关键历史信息提炼与标注</div>
            </div>
          </div>
          <div class="expectation-item">
            <el-icon :size="24" color="#f56c6c"><Promotion /></el-icon>
            <div class="exp-text">
              <div class="exp-num">延伸阅读建议</div>
              <div class="exp-label">相关人物、事件、书籍推荐</div>
            </div>
          </div>
        </div>
      </div>

      <el-divider />
      <div class="depth-section">
        <h4 class="expectation-title">📏 三档篇幅与深度详细对比</h4>
        <p class="depth-subtitle">
          根据你的使用场景选择合适的详略程度，每一档都有明确的内容深度和输出预期
        </p>
        <el-table :data="depthComparisonData" :border="false" class="depth-table" stripe>
          <el-table-column label="对比维度" width="130" align="center">
            <template #default="{ row }">
              <div class="dim-cell">
                <span class="dim-icon">{{ row.icon }}</span>
                <span class="dim-label">{{ row.dim }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="📝 精要短篇" align="center">
            <template #default="{ row }">
              <div class="depth-cell short-cell">
                <span class="cell-badge short-badge">入门级</span>
                <span class="cell-value">{{ row.short }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="📖 标准中篇" align="center">
            <template #default="{ row }">
              <div class="depth-cell medium-cell">
                <span class="cell-badge medium-badge">推荐 ⭐</span>
                <span class="cell-value">{{ row.medium }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="📚 详尽长篇" align="center">
            <template #default="{ row }">
              <div class="depth-cell long-cell">
                <span class="cell-badge long-badge">深度级</span>
                <span class="cell-value">{{ row.long }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="depth-use-cases">
          <h5 class="use-cases-title">🎯 各档适用场景推荐</h5>
          <div class="use-case-grid">
            <div class="use-case-item short-use">
              <div class="uc-header">
                <span class="uc-icon">📝</span>
                <span class="uc-name">精要短篇</span>
              </div>
              <ul class="uc-list">
                <li>快速了解历史事件梗概</li>
                <li>短视频口播文案（1-2分钟）</li>
                <li>考试复习速记版</li>
                <li>社交媒体历史科普短文</li>
              </ul>
            </div>
            <div class="use-case-item medium-use">
              <div class="uc-header">
                <span class="uc-icon">📖</span>
                <span class="uc-name">标准中篇 ⭐</span>
              </div>
              <ul class="uc-list">
                <li>日常历史学习与兴趣阅读</li>
                <li>课堂教学辅助材料</li>
                <li>公众号历史文章基础版</li>
                <li>中学生历史作业参考</li>
              </ul>
            </div>
            <div class="use-case-item long-use">
              <div class="uc-header">
                <span class="uc-icon">📚</span>
                <span class="uc-name">详尽长篇</span>
              </div>
              <ul class="uc-list">
                <li>深度历史爱好者系统学习</li>
                <li>历史科普长文/视频脚本</li>
                <li>教师备课详细教案</li>
                <li>历史研究入门资料整理</li>
              </ul>
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
          <span>AI 历史故事创作</span>
          <el-tag size="small" type="warning">故事化 · 知识化 · 趣味化</el-tag>
        </div>
      </template>

      <div class="type-section">
        <div class="section-title">
          <el-icon><Collection /></el-icon>
          <span>选择输入类型</span>
          <span class="required-tag">*</span>
          <el-tag size="small" type="info" class="hint-tag">
            不同类型的叙事角度和故事结构会自动适配
          </el-tag>
        </div>
        <div class="type-options">
          <div
            v-for="it in inputTypes"
            :key="it.value"
            class="type-card"
            :class="{ active: selectedInputType === it.value, disabled: isGenerating }"
            @click="!isGenerating && (selectedInputType = it.value)"
          >
            <div class="type-emoji">{{ it.emoji }}</div>
            <div class="type-name">{{ it.label }}</div>
            <div class="type-desc">{{ it.desc }}</div>
          </div>
        </div>
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          <span>{{ currentInputTypeConfig.subjectLabel }}</span>
          <span class="required-tag">*</span>
        </div>
        <el-input
          v-model="subject"
          type="textarea"
          :rows="2"
          :placeholder="currentInputTypeConfig.placeholder"
          maxlength="100"
          show-word-limit
          :disabled="isGenerating"
          resize="none"
        />
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Star /></el-icon>
          <span>关注要点 / 感兴趣的角度（可选，每行一个）</span>
          <el-tag size="small" type="info" class="hint-tag">
            例如：战争过程、人物性格、政治影响、文化意义等
          </el-tag>
        </div>
        <el-input
          v-model="focusPointsText"
          type="textarea"
          :rows="3"
          placeholder="例如：&#10;赤壁之战的火攻战术&#10;诸葛亮与周瑜的智谋较量&#10;这场战役对三国格局的影响"
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
          placeholder="例如：适合小学生阅读理解、突出爱国主义教育、字数控制在800字以内、适合做短视频旁白..."
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
            <span>叙事风格（可选）</span>
          </div>
          <div class="style-options">
            <div
              v-for="style in narrativeStyles"
              :key="style.value"
              class="style-chip"
              :class="{ active: selectedStyle === style.value, disabled: isGenerating }"
              @click="!isGenerating && (selectedStyle = style.value)"
            >
              <span class="style-emoji">{{ style.emoji }}</span>
              <span class="style-label">{{ style.label }}</span>
            </div>
          </div>
          <div class="style-tip" v-if="!selectedStyle">
            <el-tag size="small" type="info">不选则根据输入类型智能匹配最佳风格</el-tag>
          </div>
        </div>

        <div class="input-section flex-1">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            <span>故事篇幅 & 叙述深度</span>
            <el-tag size="small" type="info" class="hint-tag">
              当前选择：{{ currentLengthConfig.label }}（{{ currentLengthConfig.wordCount }}）
            </el-tag>
          </div>
          <div class="length-options length-options-enhanced">
            <div
              v-for="opt in lengthOptions"
              :key="opt.value"
              class="length-card length-card-enhanced"
              :class="[`length-${opt.value}`, { active: selectedLength === opt.value, disabled: isGenerating }]"
              @click="!isGenerating && (selectedLength = opt.value)"
            >
              <div class="lc-top">
                <div class="lc-emoji">{{ opt.emoji }}</div>
                <div class="lc-title-wrap">
                  <div class="lc-title-row">
                    <span class="lc-label">{{ opt.label }}</span>
                    <el-tag size="small" :type="opt.value === 'medium' ? 'warning' : 'info'" effect="light">
                      {{ opt.badge }}
                    </el-tag>
                  </div>
                  <div class="lc-desc">{{ opt.desc }}</div>
                </div>
              </div>
              <div class="lc-stats">
                <div class="lc-stat">
                  <span class="lc-stat-label">字数</span>
                  <span class="lc-stat-value">{{ opt.wordCount }}</span>
                </div>
                <div class="lc-stat">
                  <span class="lc-stat-label">阅读</span>
                  <span class="lc-stat-value">{{ opt.readingTime }}</span>
                </div>
              </div>
              <div class="lc-detail">
                <div class="lc-detail-row">
                  <span class="lc-detail-label">📑</span>
                  <span class="lc-detail-text">{{ opt.chapters }}</span>
                </div>
                <div class="lc-detail-row">
                  <span class="lc-detail-label">🔍</span>
                  <span class="lc-detail-text">{{ opt.detailLevel }}</span>
                </div>
                <div class="lc-detail-row">
                  <span class="lc-detail-label">⭐</span>
                  <span class="lc-detail-text">{{ opt.keyPointsCount }}</span>
                </div>
              </div>
              <div class="lc-features">
                <span v-for="(f, i) in opt.features" :key="i" class="lc-feature-tag">
                  ✓ {{ f }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-section">
        <div class="section-title">
          <el-icon><Files /></el-icon>
          <span>生成版本数</span>
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
          @click="generateStory"
          class="generate-btn"
        >
          <template #loading>
            <span class="btn-loading-text">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 正在翻阅史料，构思「{{ subject }}」的精彩故事…
            </span>
          </template>
          生成历史故事
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
        <div class="generating-text-wrap">
          <span class="generating-text">
            📚 正在梳理「{{ subject }}」的历史脉络
            <span v-if="focusPointsList.length > 0">，围绕 {{ focusPointsList.length }} 个关注要点</span>
            ，以「{{ currentStyleLabel }}」风格编织生动故事…
          </span>
          <div class="generating-meta">
            <el-tag size="small" type="info">📖 {{ currentLengthConfig.label }}</el-tag>
            <el-tag size="small" type="warning">✍️ {{ currentLengthConfig.wordCount }}</el-tag>
            <el-tag size="small" type="success">⏱️ {{ currentLengthConfig.readingTime }}</el-tag>
            <el-tag size="small">📑 {{ currentLengthConfig.chapters }}</el-tag>
          </div>
        </div>
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
            {{ currentInputTypeConfig.label }}：{{ subject }}
          </el-tag>
          <el-tag size="small" type="warning" effect="light">
            风格：{{ currentStyleLabel }}
          </el-tag>
          <el-tag size="small" type="info">共 {{ generatedResults.length }} 个版本</el-tag>
          <div class="header-actions">
            <el-button size="small" type="primary" link :icon="CopyDocument" @click="copyAllResults">
              复制全部版本
            </el-button>
          </div>
        </div>
      </template>

      <div class="result-depth-banner">
        <div class="rdb-header">
          <span class="rdb-title">📋 本次输出规格</span>
          <span class="rdb-badge">{{ currentLengthConfig.badge }}</span>
        </div>
        <div class="rdb-items">
          <div class="rdb-item">
            <span class="rdb-icon">📖</span>
            <div class="rdb-text">
              <div class="rdb-label">篇幅等级</div>
              <div class="rdb-value">{{ currentLengthConfig.label }}</div>
            </div>
          </div>
          <div class="rdb-item">
            <span class="rdb-icon">✍️</span>
            <div class="rdb-text">
              <div class="rdb-label">预计字数</div>
              <div class="rdb-value">{{ currentLengthConfig.wordCount }}</div>
            </div>
          </div>
          <div class="rdb-item">
            <span class="rdb-icon">⏱️</span>
            <div class="rdb-text">
              <div class="rdb-label">阅读时长</div>
              <div class="rdb-value">{{ currentLengthConfig.readingTime }}</div>
            </div>
          </div>
          <div class="rdb-item">
            <span class="rdb-icon">📑</span>
            <div class="rdb-text">
              <div class="rdb-label">章节结构</div>
              <div class="rdb-value">{{ currentLengthConfig.chapters }}</div>
            </div>
          </div>
          <div class="rdb-item">
            <span class="rdb-icon">🔍</span>
            <div class="rdb-text">
              <div class="rdb-label">细节深度</div>
              <div class="rdb-value">{{ currentLengthConfig.detailLevel }}</div>
            </div>
          </div>
          <div class="rdb-item">
            <span class="rdb-icon">⭐</span>
            <div class="rdb-text">
              <div class="rdb-label">知识点</div>
              <div class="rdb-value">{{ currentLengthConfig.keyPointsCount }}</div>
            </div>
          </div>
        </div>
      </div>

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
            <el-icon color="#165DFF"><Collection /></el-icon>
            <span>📖 故事标题</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.title)">复制</el-button>
          </div>
          <div class="result-title-text">{{ currentResult.title }}</div>
        </div>

        <div class="result-section">
          <div class="section-title-sm">
            <el-icon color="#e6a23c"><EditPen /></el-icon>
            <span>📜 故事正文</span>
            <el-button size="small" text :icon="CopyDocument" @click="copyText(currentResult.content)">复制</el-button>
          </div>
          <div class="story-content-text">
            <div v-for="(para, pIdx) in currentResult.paragraphs" :key="pIdx" class="story-paragraph">
              <span v-if="para.chapter" class="chapter-label">{{ para.chapter }}</span>
              <p>{{ para.text }}</p>
            </div>
          </div>
        </div>

        <div v-if="currentResult.keyPoints && currentResult.keyPoints.length > 0" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#67c23a"><Star /></el-icon>
            <span>⭐ 核心知识点</span>
          </div>
          <div class="keypoints-list">
            <div v-for="(kp, kIdx) in currentResult.keyPoints" :key="kIdx" class="keypoint-item">
              <span class="keypoint-num">{{ kIdx + 1 }}</span>
              <span class="keypoint-text">{{ kp }}</span>
            </div>
          </div>
        </div>

        <div v-if="currentResult.extendedReading && currentResult.extendedReading.length > 0" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#909399"><Promotion /></el-icon>
            <span>📚 延伸阅读建议</span>
          </div>
          <div class="extended-list">
            <div v-for="(er, eIdx) in currentResult.extendedReading" :key="eIdx" class="extended-item">
              <span class="extended-icon">📖</span>
              <span class="extended-text">{{ er }}</span>
            </div>
          </div>
        </div>

        <div v-if="currentResult.teachingTip" class="result-section">
          <div class="section-title-sm">
            <el-icon color="#f56c6c"><Bulb /></el-icon>
            <span>💡 教学/创作小贴士</span>
          </div>
          <div class="teaching-tip-text">{{ currentResult.teachingTip }}</div>
        </div>

        <div class="result-footer">
          <el-button type="primary" :icon="Download" @click="copyCurrentFull">
            复制完整内容（版本 {{ activeVersion + 1 }}）
          </el-button>
          <el-button :icon="RefreshRight" @click="regenerateVersion">
            换一个叙述角度
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
            <el-tag size="small" type="info">{{ getInputTypeLabel(item.inputType) }}</el-tag>
            <span class="history-text">{{ truncateText(item.subject, 40) }}</span>
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
  Files
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface StoryParagraph {
  chapter?: string
  text: string
}

interface StoryResult {
  title: string
  content: string
  paragraphs: StoryParagraph[]
  keyPoints: string[]
  extendedReading: string[]
  teachingTip?: string
  style: string
  styleLabel: string
}

interface HistoryItem {
  inputType: string
  subject: string
  focusPointsText: string
  additionalNotes: string
  style: string
  length: string
  results: StoryResult[]
  time: string
}

interface QuickSample {
  label: string
  inputType: string
  subject: string
  focusPoints: string[]
  additionalNotes: string
  hintStyle: string
}

const STORAGE_KEY = 'historical_storyteller_history'

interface InputTypeConfig {
  value: string
  label: string
  emoji: string
  desc: string
  subjectLabel: string
  placeholder: string
  defaultStyle: string
  examples: string[]
}

const inputTypes: InputTypeConfig[] = [
  {
    value: 'event',
    label: '历史事件',
    emoji: '⚔️',
    desc: '讲述某次具体历史事件的来龙去脉',
    subjectLabel: '历史事件名称',
    placeholder: '例如：赤壁之战、辛亥革命、工业革命、诺曼底登陆、安史之乱…',
    defaultStyle: 'dramatic',
    examples: ['赤壁之战', '辛亥革命', '诺曼底登陆']
  },
  {
    value: 'figure',
    label: '历史人物',
    emoji: '👑',
    desc: '讲述某位历史人物的生平与传奇',
    subjectLabel: '历史人物姓名',
    placeholder: '例如：诸葛亮、拿破仑、武则天、爱因斯坦、岳飞…',
    defaultStyle: 'biography',
    examples: ['诸葛亮', '武则天', '爱因斯坦']
  },
  {
    value: 'period',
    label: '历史时期',
    emoji: '🏛️',
    desc: '讲述某个历史时期的风貌与变迁',
    subjectLabel: '历史时期 / 朝代',
    placeholder: '例如：盛唐气象、三国鼎立、文艺复兴、民国时期、魏晋风度…',
    defaultStyle: 'educational',
    examples: ['盛唐气象', '三国鼎立', '文艺复兴']
  }
]

interface NarrativeStyle {
  value: string
  label: string
  emoji: string
}

const narrativeStyles: NarrativeStyle[] = [
  { value: 'dramatic', label: '戏剧小说式', emoji: '🎭' },
  { value: 'biography', label: '人物传记式', emoji: '👤' },
  { value: 'educational', label: '知识科普式', emoji: '📚' },
  { value: 'cinematic', label: '影视剧本式', emoji: '🎬' },
  { value: 'humorous', label: '幽默讲史式', emoji: '😄' },
  { value: 'epic', label: '史诗叙事式', emoji: '🏰' }
]

interface LengthOption {
  value: string
  label: string
  emoji: string
  badge: string
  desc: string
  wordCount: string
  readingTime: string
  chapters: string
  detailLevel: string
  keyPointsCount: string
  extendedCount: string
  features: string[]
}

const lengthOptions: LengthOption[] = [
  {
    value: 'short',
    label: '精要短篇',
    emoji: '📝',
    badge: '入门级',
    desc: '快速掌握核心脉络',
    wordCount: '约 400-600 字',
    readingTime: '⏱️ 约 2 分钟',
    chapters: '2 个章节',
    detailLevel: '🔹 梗概级：主线清晰',
    keyPointsCount: '3 个核心知识点',
    extendedCount: '2 条延伸建议',
    features: ['事件框架完整', '关键人物出场', '核心转折明确']
  },
  {
    value: 'medium',
    label: '标准中篇',
    emoji: '📖',
    badge: '推荐 ⭐',
    desc: '平衡深度与可读性',
    wordCount: '约 800-1200 字',
    readingTime: '⏱️ 约 4-5 分钟',
    chapters: '3 个章节',
    detailLevel: '🔹🔹🔹 细节级：情节丰富',
    keyPointsCount: '4-5 个核心知识点',
    extendedCount: '3 条延伸建议',
    features: ['情节细节展开', '人物对话与心理', '时代背景铺垫']
  },
  {
    value: 'long',
    label: '详尽长篇',
    emoji: '📚',
    badge: '深度级',
    desc: '沉浸式深度解读',
    wordCount: '约 1500-2000 字',
    readingTime: '⏱️ 约 8-10 分钟',
    chapters: '4-5 个章节',
    detailLevel: '🔹🔹🔹🔹🔹 全景级：多维度展开',
    keyPointsCount: '6+ 个核心知识点',
    extendedCount: '3 条延伸建议',
    features: ['多视角叙事', '前因后果深度分析', '同时代对比与历史反思']
  }
]

interface DepthComparisonRow {
  icon: string
  dim: string
  short: string
  medium: string
  long: string
}

const depthComparisonData: DepthComparisonRow[] = [
  {
    icon: '✍️',
    dim: '字数范围',
    short: '400 ~ 600 字',
    medium: '800 ~ 1200 字',
    long: '1500 ~ 2000 字'
  },
  {
    icon: '⏱️',
    dim: '阅读时长',
    short: '约 2 分钟',
    medium: '约 4-5 分钟',
    long: '约 8-10 分钟'
  },
  {
    icon: '📑',
    dim: '章节数量',
    short: '2 个章节（开端+结局）',
    medium: '3 个章节（开端+发展+结局）',
    long: '4-5 章（序章+开端+高潮+终章+尾声）'
  },
  {
    icon: '🔍',
    dim: '细节深度',
    short: '梗概级：讲清来龙去脉',
    medium: '细节级：含场景描写与人物互动',
    long: '全景级：多视角、背景、影响全覆盖'
  },
  {
    icon: '⭐',
    dim: '知识点数',
    short: '3 个核心要点',
    medium: '4-5 个关键信息',
    long: '6+ 个深度知识点'
  },
  {
    icon: '🎯',
    dim: '适合用途',
    short: '速览、短视频、考试速记',
    medium: '日常学习、课堂教学、科普短文',
    long: '深度阅读、备课资料、长文创作'
  }
]

const versionOptions = [
  { value: 1, label: '1个', desc: '精选版' },
  { value: 2, label: '2个', desc: '对比优选' },
  { value: 3, label: '3个', desc: '多角度探索' }
]

interface SampleBank {
  [key: string]: QuickSample[]
}

const sampleBank: SampleBank = {
  event: [
    {
      label: '赤壁之战',
      inputType: 'event',
      subject: '赤壁之战',
      focusPoints: ['火攻战术的精妙部署', '诸葛亮与周瑜的智谋较量', '这场战役对三国鼎立格局的影响'],
      additionalNotes: '要有紧张的战争氛围，突出以少胜多的戏剧性',
      hintStyle: 'dramatic'
    },
    {
      label: '辛亥革命',
      inputType: 'event',
      subject: '辛亥革命',
      focusPoints: ['武昌起义的导火索', '孙中山的革命理想', '结束两千多年帝制的历史意义'],
      additionalNotes: '适合中学生历史学习，知识点要清晰',
      hintStyle: 'educational'
    }
  ],
  figure: [
    {
      label: '诸葛亮',
      inputType: 'figure',
      subject: '诸葛亮',
      focusPoints: ['躬耕南阳的隐居岁月', '隆中对的远见卓识', '鞠躬尽瘁的北伐生涯', '千古贤相的历史评价'],
      additionalNotes: '突出人物的智慧与忠诚，有感染力',
      hintStyle: 'biography'
    },
    {
      label: '武则天',
      inputType: 'figure',
      subject: '武则天',
      focusPoints: ['从才人到女皇的崛起之路', '治国理政的功过是非', '无字碑背后的历史谜团'],
      additionalNotes: '客观评价历史人物，不要脸谱化',
      hintStyle: 'epic'
    }
  ],
  period: [
    {
      label: '盛唐气象',
      inputType: 'period',
      subject: '盛唐气象',
      focusPoints: ['贞观之治到开元盛世', '诗歌艺术的黄金时代', '丝绸之路的中外交流', '长安城的繁华景象'],
      additionalNotes: '要有画面感，让人仿佛穿越回唐朝',
      hintStyle: 'cinematic'
    },
    {
      label: '文艺复兴',
      inputType: 'period',
      subject: '文艺复兴',
      focusPoints: ['从黑暗中世纪到人文觉醒', '达芬奇、米开朗琪罗的艺术成就', '科学与艺术的交相辉映'],
      additionalNotes: '适合做短视频脚本，节奏要明快',
      hintStyle: 'humorous'
    }
  ]
}

const selectedInputType = ref('event')
const subject = ref('')
const focusPointsText = ref('')
const additionalNotes = ref('')
const selectedStyle = ref('')
const selectedLength = ref('medium')
const versionCount = ref(2)
const isGenerating = ref(false)
const generatedResults = ref<StoryResult[]>([])
const activeVersion = ref(0)
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const currentInputTypeConfig = computed(() => {
  return inputTypes.find(t => t.value === selectedInputType.value) || inputTypes[0]
})

const currentLengthConfig = computed(() => {
  return lengthOptions.find(l => l.value === selectedLength.value) || lengthOptions[1]
})

const focusPointsList = computed(() =>
  focusPointsText.value.split('\n').map(k => k.trim()).filter(k => k.length > 0)
)

const currentTypeSamples = computed(() => sampleBank[selectedInputType.value] || [])

const effectiveStyle = computed(() => {
  if (selectedStyle.value) return selectedStyle.value
  return currentInputTypeConfig.value.defaultStyle
})

const currentStyleLabel = computed(() => {
  return narrativeStyles.find(s => s.value === effectiveStyle.value)?.label || '自动匹配'
})

const currentStep = computed(() => {
  if (generatedResults.value.length > 0 && !isGenerating.value) return 3
  if (isGenerating.value) return 2
  if (subject.value || focusPointsText.value) return 1
  return 0
})

const canGenerate = computed(() => subject.value.trim().length > 0)

const currentResult = computed(() => generatedResults.value[activeVersion.value] || null)

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  return showAllHistory.value ? reversed : reversed.slice(0, 10)
})

const getInputTypeLabel = (v: string) => inputTypes.find(t => t.value === v)?.label || v
const getStyleLabel = (v: string) => narrativeStyles.find(s => s.value === v)?.label || v

const getVersionTagType = (idx: number): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const types: Array<'' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = ['primary', 'success', 'warning', 'danger', 'info']
  return types[idx % types.length]
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
  selectedInputType.value = sample.inputType
  subject.value = sample.subject
  focusPointsText.value = sample.focusPoints.join('\n')
  additionalNotes.value = sample.additionalNotes
  selectedStyle.value = sample.hintStyle
  ElMessage.success('已载入示例数据')
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const pickMany = <T,>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, arr.length))
}

interface StoryTemplateConfig {
  titles: string[]
  chapters: string[]
  openings: string[]
  middles: string[]
  endings: string[]
  keyPointsPool: string[]
  extendedPool: string[]
  teachingTips: string[]
}

const storyTemplates: Record<string, StoryTemplateConfig> = {
  event: {
    titles: [
      '{subject}：改变历史的那一刻',
      '{subject}——风云际会的传奇篇章',
      '回望{subject}：那些被时间铭记的故事',
      '{subject}背后：你不知道的历史细节',
      '{subject}：一场改写命运的惊天变局'
    ],
    chapters: ['第一章 · 山雨欲来', '第二章 · 烽火骤起', '第三章 · 惊心动魄', '第四章 · 尘埃落定'],
    openings: [
      '公元{year}年，历史的指针指向了一个非同寻常的时刻。{subject}——这个后来被无数人反复提及的名字，即将在时代的舞台上缓缓拉开帷幕。',
      '在漫长的历史长河中，总有一些时刻如繁星般耀眼。{subject}，就是其中最璀璨的一颗。让我们穿越时空，回到那个风起云涌的年代。',
      '历史的转折往往藏在看似不经意的瞬间。关于{subject}，史书上只有寥寥数语，但背后的惊心动魄，远超你我的想象。'
    ],
    middles: [
      '就在这千钧一发之际，一个大胆的计划正在暗中酝酿。',
      '然而，命运的齿轮已经开始转动，没有人能够阻止这场即将到来的风暴。',
      '各方势力在此刻汇聚，矛盾与冲突如暗流涌动，一场大戏即将上演。',
      '时间一分一秒地流逝，空气中弥漫着紧张的气息，每个人都在等待着那个决定性的瞬间。'
    ],
    endings: [
      '如今，{subject}的硝烟早已散尽，但它留给后世的启示，却如黄钟大吕，振聋发聩。历史不是冰冷的数字，而是一个个鲜活的人、一次次勇敢的选择。',
      '当我们回望{subject}，看到的不只是过去，更是映照当下的一面镜子。以史为鉴，可以知兴替——这正是我们不断回望历史的原因。',
      '{subject}已经成为历史，但它所承载的精神与智慧，穿越千年时光，依然在今天闪耀着光芒。'
    ],
    keyPointsPool: [
      '事件发生的具体时间与时代背景',
      '事件爆发的深层原因与导火索',
      '关键人物在事件中的决策与作用',
      '事件发展的主要阶段与转折点',
      '事件对当时政治格局的直接影响',
      '事件在经济、文化层面的深远意义',
      '后世对这一事件的评价与反思',
      '与同类历史事件的对比与借鉴'
    ],
    extendedPool: [
      '相关人物的传记故事',
      '同时期的其他重大历史事件',
      '记载此事件的经典史书推荐',
      '关于此事件的影视作品推荐',
      '遗址/纪念馆参观指南',
      '学界对这一事件的最新研究动态'
    ],
    teachingTips: [
      '可以引导学生思考：如果你身处那个时代，会做出怎样的选择？',
      '建议配合历史地图和文物图片，让学生有更直观的感受',
      '可以组织学生分组讨论事件的不同解读角度，培养历史思辨能力',
      '鼓励学生将这个故事改编成短剧，加深对历史人物的理解'
    ]
  },
  figure: {
    titles: [
      '{subject}：千古风流人物',
      '{subject}——在历史深处闪耀的名字',
      '读懂{subject}：一个传奇人物的一生',
      '{subject}不为人知的另一面',
      '{subject}：命运沉浮中的坚守与抉择'
    ],
    chapters: ['序章 · 少年意气', '第一章 · 崭露头角', '第二章 · 风云际会', '第三章 · 峥嵘岁月', '终章 · 青史留名'],
    openings: [
      '在华夏五千年的历史星空中，有这样一个名字——{subject}。他/她的一生，如同一部波澜壮阔的史诗，写满了传奇与荣耀，也藏着不为人知的挣扎与坚守。',
      '有人说，时势造英雄；也有人说，英雄造时势。{subject}的一生，正是对这句话最好的诠释。让我们翻开泛黄的史册，走进这位传奇人物的内心世界。',
      '千年之后，当我们说起{subject}，心中浮现的不只是一个名字，更是一种精神、一份情怀。但真正的他/她，远比你想象的更加复杂，也更加动人。'
    ],
    middles: [
      '然而，命运并没有给他/她太多喘息的机会。更大的考验，还在前方等待着。',
      '就在人生的十字路口，{subject}做出了一个让所有人都意想不到的决定。',
      '才华与抱负在胸中激荡，但现实的枷锁却如此沉重。该何去何从？',
      '多年的蛰伏与积累，终于在这一刻迎来了绽放的机会。'
    ],
    endings: [
      '如今，{subject}的故事已经成为历史，但他/她留下的精神遗产，却从未远去。每一个心怀理想的人，都能从他/她的故事中汲取前行的力量。',
      '盖棺定论，{subject}的功过是非，也许永远没有标准答案。但正是这种复杂性，让历史如此迷人，也让我们如此着迷。',
      '伟人之所以伟大，不在于从不跌倒，而在于每次跌倒后都能重新站起来。{subject}的一生，正是对这句话最好的注脚。'
    ],
    keyPointsPool: [
      '人物所处的时代背景与社会环境',
      '早年经历对性格与志向的塑造',
      '人生中的重要转折点与关键抉择',
      '主要成就与历史贡献',
      '性格特点与处事风格',
      '与同时代重要人物的关系',
      '历史上对其人的不同评价',
      '从其人生经历中可获得的启示'
    ],
    extendedPool: [
      '该人物的传记或评传推荐',
      '相关影视剧与纪录片',
      '其同时代的其他重要人物',
      '出土文物与考古新发现',
      '纪念地与名胜古迹游览',
      '以该人物为主题的文学作品'
    ],
    teachingTips: [
      '可以引导学生讨论：历史人物的成功是偶然还是必然？',
      '建议让学生换位思考：如果你是他/她，会怎么做？',
      '鼓励学生搜集不同史料中对该人物的评价，培养批判性思维',
      '可以让学生以第一人称写一篇"人物自述"，加深理解'
    ]
  },
  period: {
    titles: [
      '{subject}：一个时代的风华与梦想',
      '{subject}——穿越千年的时光之旅',
      '梦回{subject}：那些不曾褪色的记忆',
      '{subject}：中华文明的黄金时代',
      '{subject}：当历史遇见传奇'
    ],
    chapters: ['开篇 · 时代序幕', '上篇 · 气象万千', '中篇 · 风华绝代', '下篇 · 源远流长', '尾声 · 千年回响'],
    openings: [
      '如果可以穿越回古代，你最想去哪个朝代？很多人的答案会是——{subject}。那是一个怎样的时代？让我们推开厚重的历史之门，一探究竟。',
      '每个时代都有自己独特的气质。{subject}的气质，是诗歌里的豪情万丈，是壁画上的流光溢彩，是流传千年仍让人怦然心动的绝代风华。',
      '在历史的长河中，{subject}时期无疑是最璀璨的篇章之一。那是一个大师辈出、群星闪耀的年代，每一个角落都在演绎着精彩的故事。'
    ],
    middles: [
      '在这样的时代背景下，文化艺术迎来了空前的繁荣。',
      '社会的开放与包容，催生了无数令人惊叹的创造。',
      '经济的繁荣为文化的发展奠定了坚实的基础。',
      '正是在这样的土壤中，一颗颗明星相继升起，照亮了整个时代。'
    ],
    endings: [
      '如今，{subject}的繁华已成过往，但那种文化的基因、精神的气度，早已融入我们民族的血脉，成为每一个中国人心中最深沉的骄傲。',
      '回望{subject}，我们看到的不只是一个远去的时代，更是中华民族精神长河中一段最动人的旋律。它从未消失，只是在静静等待，等待与你的相遇。',
      '每一个伟大的时代，都为后世留下了珍贵的遗产。{subject}留下的，不仅是精美的文物和不朽的诗篇，更是一种自信开放、兼容并包的精神。'
    ],
    keyPointsPool: [
      '该时期的起止时间与整体脉络',
      '政治制度与社会结构特点',
      '经济发展水平与特色产业',
      '文化艺术的主要成就与代表人物',
      '科技发明与对外交流',
      '社会风尚与日常生活',
      '该时期的历史地位与影响',
      '重要制度/文化对后世的传承'
    ],
    extendedPool: [
      '反映该时代风貌的经典影视作品',
      '博物馆中的代表性文物推荐',
      '关于该时期的学术著作与通俗读物',
      '该时期的重要遗址和旅游景点',
      '同时期世界其他文明的发展情况',
      '相关主题的纪录片推荐'
    ],
    teachingTips: [
      '可以引导学生对比同时期中西方文明的异同',
      '建议让学生设计一张"穿越指南"，发挥想象力',
      '鼓励学生选择一个感兴趣的方面做深入研究',
      '可以组织"历史情景剧"活动，让学生扮演不同角色'
    ]
  }
}

const styleAdjustments: Record<string, (text: string) => string> = {
  dramatic: (t) => t + '\n\n（剧情如有虚构，历史以正史为准）',
  humorous: (t) => t.replace(/。/g, '～').replace(/！/g, '！😏'),
  cinematic: (t) => '【镜头缓缓拉开...】\n\n' + t + '\n\n【画面淡出，字幕滚动...】',
  epic: (t) => t,
  educational: (t) => t,
  biography: (t) => t,
  default: (t) => t
}

const generateSingleStory = (forceStyle?: string): StoryResult => {
  const typeConfig = currentInputTypeConfig.value
  const templates = storyTemplates[selectedInputType.value] || storyTemplates.event
  const style = forceStyle || effectiveStyle.value
  const styleLabel = getStyleLabel(style)
  const subjectText = subject.value
  const focusPoints = focusPointsList.value
  const notes = additionalNotes.value
  const lengthConfig = lengthOptions.find(l => l.value === selectedLength.value) || lengthOptions[1]

  const yearMatch = subjectText.match(/(\d{3,4})/)
  const yearText = yearMatch ? yearMatch[1] : 'XXXX'

  const title = pick(templates.titles).replace(/\{subject\}/g, subjectText)

  const chapters = selectedLength.value === 'short'
    ? templates.chapters.slice(0, 2)
    : selectedLength.value === 'long'
      ? templates.chapters
      : templates.chapters.slice(0, 3)

  const paragraphs: StoryParagraph[] = []
  paragraphs.push({
    chapter: chapters[0],
    text: pick(templates.openings).replace(/\{subject\}/g, subjectText).replace(/\{year\}/g, yearText)
  })

  const middleCount = selectedLength.value === 'short' ? 1 : selectedLength.value === 'long' ? 3 : 2
  for (let i = 0; i < middleCount; i++) {
    let middleText = pick(templates.middles)
    if (focusPoints.length > 0) {
      const fp = focusPoints[i % focusPoints.length]
      middleText = `说到「${fp}」，${middleText}`
    }
    if (i + 1 < chapters.length) {
      paragraphs.push({
        chapter: chapters[i + 1],
        text: middleText + generateDetailParagraph(selectedInputType.value, subjectText, fp, style, i)
      })
    } else {
      paragraphs.push({
        text: middleText + generateDetailParagraph(selectedInputType.value, subjectText, fp, style, i)
      })
    }
  }

  let endingText = pick(templates.endings).replace(/\{subject\}/g, subjectText)
  if (notes.trim()) {
    endingText += `\n\n补充说明：${notes}`
  }
  paragraphs.push({
    chapter: chapters[chapters.length - 1] || '尾声',
    text: endingText
  })

  const adjustFn = styleAdjustments[style] || styleAdjustments.default
  const allText = paragraphs.map(p => (p.chapter ? `【${p.chapter}】\n` : '') + p.text).join('\n\n')
  const adjustedText = adjustFn(allText)

  const keyPointsCount = selectedLength.value === 'short' ? 3 : selectedLength.value === 'long' ? 6 : 4
  const keyPoints = pickMany(templates.keyPointsPool, keyPointsCount)
  if (focusPoints.length > 0) {
    keyPoints.unshift(...focusPoints.slice(0, 2).map(fp => `关注要点：${fp}`))
  }

  const extendedCount = selectedLength.value === 'short' ? 2 : 3
  const extendedReading = pickMany(templates.extendedPool, extendedCount)

  const teachingTip = pick(templates.teachingTips)

  return {
    title,
    content: adjustedText,
    paragraphs,
    keyPoints,
    extendedReading,
    teachingTip,
    style,
    styleLabel
  }
}

const generateDetailParagraph = (
  type: string,
  subject: string,
  focusPoint: string,
  style: string,
  seed: number
): string => {
  const eventDetails = [
    `关于${subject}，最扣人心弦的莫过于那一连串出人意料的转折。史书上短短几行字，背后却是无数人的命运交织。`,
    `想象一下那个场景：旌旗猎猎，战马嘶鸣，空气中弥漫着紧张的气息。每一个决定，都可能改写整个战局。`,
    `就在所有人都以为大局已定的时候，一个意想不到的变数出现了——这正是历史最迷人的地方。`
  ]
  const figureDetails = [
    `${subject}曾经说过："志当存高远。"这句话不仅是他/她的人生座右铭，更是激励了后世无数仁人志士。`,
    `许多人只看到了${subject}表面的风光，却不知道他/她背后付出了怎样的艰辛与努力。`,
    `在那个等级森严的时代，${subject}能够脱颖而出，靠的不仅是才华，更是远超常人的毅力与胆识。`
  ]
  const periodDetails = [
    `${subject}时期的人们，过着怎样的生活？清晨的集市上，小贩的叫卖声此起彼伏；酒肆茶楼里，文人墨客吟诗作对——那是一幅鲜活生动的历史画卷。`,
    `在那个时代，诗歌是最流行的社交方式。朋友聚会要写诗，迎来送往要写诗，甚至连金榜题名时，也要在大雁塔上题诗留念。`,
    `经济的繁荣带来了文化的昌盛。据史料记载，当时的长安城是世界上最大的城市，人口超过百万，来自世界各地的商人、学者、僧侣汇聚于此。`
  ]

  const details = type === 'event' ? eventDetails : type === 'figure' ? figureDetails : periodDetails
  let detail = details[seed % details.length]

  if (focusPoint) {
    detail = detail.replace(/关于.*，/, `关于「${focusPoint}」，`)
  }

  const styleFlair: Record<string, string[]> = {
    dramatic: ['这一切，都在那个命运攸关的夜晚达到了高潮。', '历史的舞台，从来不缺精彩的戏码。'],
    humorous: ['（是不是听起来就很刺激？😏）', '（要是拍电影，这段得是名场面。）'],
    cinematic: ['【特写镜头：人物眼中闪过一丝坚毅】', '【背景音乐渐强，画面推进...】'],
    epic: ['这，就是一个时代的缩影。', '千载之下，依然令人心潮澎湃。'],
    educational: ['这一点在考试中经常出现，请同学们注意掌握。', '我们可以从以下几个方面来理解这个问题。'],
    biography: ['多年以后，回忆起这段岁月，他/她依然感慨万千。', '这正是他/她人格魅力的最好体现。'],
    default: ['', '']
  }
  const flair = (styleFlair[style] || styleFlair.default)[seed % 2]

  return detail + (flair ? '\n\n' + flair : '')
}

const generateStory = async () => {
  if (!canGenerate.value) return

  isGenerating.value = true
  generatedResults.value = []
  activeVersion.value = 0

  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500))

  const results: StoryResult[] = []
  const stylePool = selectedStyle.value
    ? [selectedStyle.value]
    : narrativeStyles.map(s => s.value).filter(v => v !== currentInputTypeConfig.value.defaultStyle)

  for (let i = 0; i < versionCount.value; i++) {
    const forceStyle = selectedStyle.value
      ? selectedStyle.value
      : i === 0
        ? currentInputTypeConfig.value.defaultStyle
        : stylePool[(i - 1) % stylePool.length]
    results.push(generateSingleStory(forceStyle))
  }

  generatedResults.value = results
  isGenerating.value = false

  history.value.push({
    inputType: selectedInputType.value,
    subject: subject.value,
    focusPointsText: focusPointsText.value,
    additionalNotes: additionalNotes.value,
    style: selectedStyle.value,
    length: selectedLength.value,
    results,
    time: new Date().toISOString()
  })

  if (history.value.length > 50) {
    history.value = history.value.slice(-50)
  }

  saveHistory()
  ElMessage.success(`已生成 ${results.length} 个历史故事版本`)
}

const regenerateVersion = () => {
  if (generatedResults.value.length === 0) return
  const newVersion = generateSingleStory()
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
  parts.push(`【标题】\n${currentResult.value.title}`)
  parts.push(`【叙事风格】${currentResult.value.styleLabel}`)
  parts.push(`\n【故事正文】\n${currentResult.value.content}`)
  if (currentResult.value.keyPoints.length > 0) {
    parts.push(`\n【核心知识点】`)
    currentResult.value.keyPoints.forEach((kp, i) => parts.push(`${i + 1}. ${kp}`))
  }
  if (currentResult.value.extendedReading.length > 0) {
    parts.push(`\n【延伸阅读建议】`)
    currentResult.value.extendedReading.forEach((er, i) => parts.push(`${i + 1}. ${er}`))
  }
  if (currentResult.value.teachingTip) {
    parts.push(`\n【教学/创作小贴士】\n${currentResult.value.teachingTip}`)
  }
  copyText(parts.join('\n'))
}

const copyAllResults = () => {
  if (generatedResults.value.length === 0) return
  const allText = generatedResults.value.map((r, i) => {
    const parts: string[] = [`===== 版本 ${i + 1}（${r.styleLabel}）=====`]
    parts.push(`标题：${r.title}`)
    parts.push(`\n${r.content}`)
    return parts.join('\n')
  }).join('\n\n')
  copyText(allText)
}

const resetAll = () => {
  subject.value = ''
  focusPointsText.value = ''
  additionalNotes.value = ''
  selectedStyle.value = ''
  selectedLength.value = 'medium'
  versionCount.value = 2
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
  selectedInputType.value = item.inputType
  subject.value = item.subject
  focusPointsText.value = item.focusPointsText
  additionalNotes.value = item.additionalNotes
  selectedStyle.value = item.style
  selectedLength.value = item.length
  generatedResults.value = item.results
  activeVersion.value = 0
  ElMessage.success('已载入历史记录')
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.historical-storyteller {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-card {
  background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);
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
  min-width: 160px;
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
  grid-template-columns: repeat(3, 1fr);
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
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.type-card {
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.25s;
  background: #fff;
  text-align: center;
  user-select: none;
}

.type-card:hover:not(.disabled) {
  border-color: #8E2DE2;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(142, 45, 226, 0.15);
}

.type-card.active {
  border-color: #8E2DE2;
  background: linear-gradient(135deg, rgba(142, 45, 226, 0.08) 0%, rgba(74, 0, 224, 0.08) 100%);
}

.type-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.type-emoji {
  font-size: 36px;
  margin-bottom: 8px;
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
  line-height: 1.5;
}

.two-col-section {
  display: flex;
  gap: 20px;
}

.flex-1 {
  flex: 1;
}

.style-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.style-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  background: #fff;
  border: 1.5px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  color: #606266;
  user-select: none;
}

.style-chip:hover:not(.disabled) {
  border-color: #8E2DE2;
  color: #8E2DE2;
}

.style-chip.active {
  background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);
  border-color: #8E2DE2;
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
  margin-top: 10px;
}

.length-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.length-card {
  border: 1.5px solid #e4e7ed;
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  background: #fff;
  user-select: none;
}

.length-card:hover:not(.disabled) {
  border-color: #8E2DE2;
}

.length-card.active {
  border-color: #8E2DE2;
  background: rgba(142, 45, 226, 0.08);
}

.length-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.length-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.length-desc {
  font-size: 11px;
  color: #909399;
  margin: 2px 0;
}

.length-word {
  font-size: 11px;
  color: #8E2DE2;
  font-weight: 500;
}

.version-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 480px;
}

.version-card {
  border: 1.5px solid #e4e7ed;
  border-radius: 10px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  background: #fff;
  user-select: none;
}

.version-card:hover:not(.disabled) {
  border-color: #8E2DE2;
}

.version-card.active {
  border-color: #8E2DE2;
  background: rgba(142, 45, 226, 0.08);
}

.version-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.version-num {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.version-label {
  font-size: 12px;
  color: #606266;
  margin: 2px 0;
}

.version-desc {
  font-size: 11px;
  color: #909399;
}

.quick-samples {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  padding: 12px 14px;
  background: #fafafa;
  border-radius: 10px;
}

.sample-label {
  font-size: 13px;
  color: #909399;
  font-weight: 500;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.sample-tag:hover {
  transform: translateY(-1px);
}

.action-section {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.generate-btn {
  flex: 1;
  max-width: 400px;
  background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);
  border: none;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.generate-btn:hover {
  background: linear-gradient(135deg, #7A24C7 0%, #3F00C0 100%);
}

.btn-loading-text {
  font-size: 14px;
}

.generating-status {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(142, 45, 226, 0.08) 0%, rgba(74, 0, 224, 0.08) 100%);
  border-radius: 10px;
  border: 1px solid rgba(142, 45, 226, 0.2);
}

.generating-dots {
  display: flex;
  gap: 6px;
  padding-top: 6px;
}

.generating-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8E2DE2;
  animation: bounce 1.4s infinite ease-in-out both;
}

.generating-dots .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.generating-dots .dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.generating-text-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.generating-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.generating-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.version-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 12px;
}

.version-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f5f7fa;
  font-size: 13px;
  color: #606266;
  user-select: none;
}

.version-tab:hover {
  background: #ebeef5;
}

.version-tab.active {
  background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);
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

.result-title-text {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(142, 45, 226, 0.08) 0%, rgba(74, 0, 224, 0.08) 100%);
  border-radius: 10px;
  border-left: 4px solid #8E2DE2;
}

.story-content-text {
  background: #fafafa;
  border-radius: 10px;
  padding: 20px;
}

.story-paragraph {
  margin-bottom: 16px;
}

.story-paragraph:last-child {
  margin-bottom: 0;
}

.chapter-label {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: #8E2DE2;
  padding: 4px 12px;
  background: rgba(142, 45, 226, 0.1);
  border-radius: 6px;
  margin-bottom: 8px;
}

.story-paragraph p {
  font-size: 15px;
  line-height: 2;
  color: #303133;
  text-indent: 2em;
  margin: 0;
}

.keypoints-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keypoint-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  background: #f0f9eb;
  border-radius: 8px;
  border-left: 3px solid #67c23a;
}

.keypoint-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #67c23a;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.keypoint-text {
  font-size: 14px;
  color: #303133;
  line-height: 1.7;
}

.extended-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.extended-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f4f4f5;
  border-radius: 8px;
}

.extended-icon {
  font-size: 16px;
}

.extended-text {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.teaching-tip-text {
  font-size: 14px;
  line-height: 1.8;
  color: #92601a;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.1) 0%, rgba(250, 219, 139, 0.1) 100%);
  border-radius: 10px;
  border-left: 3px solid #e6a23c;
}

.result-footer {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
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
  padding: 12px 16px;
  border-radius: 10px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  background: #f0f0f0;
  transform: translateX(4px);
}

.history-time {
  font-size: 12px;
  color: #909399;
  min-width: 80px;
}

.history-topic {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-text {
  font-size: 14px;
  color: #303133;
}

.depth-subtitle {
  color: #909399;
  font-size: 13px;
  margin: -8px 0 16px;
  line-height: 1.6;
}

.depth-table {
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.depth-table :deep(.el-table__row) {
  height: 58px;
}

.depth-table :deep(.el-table__cell) {
  padding: 10px 12px;
}

.dim-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  color: #303133;
  font-size: 13px;
}

.dim-icon {
  font-size: 16px;
}

.depth-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.cell-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.short-badge {
  background: rgba(144, 147, 153, 0.15);
  color: #606266;
}

.medium-badge {
  background: rgba(230, 162, 60, 0.15);
  color: #b88230;
}

.long-badge {
  background: rgba(142, 45, 226, 0.15);
  color: #6b1db0;
}

.cell-value {
  font-size: 13px;
  color: #303133;
  line-height: 1.5;
}

.depth-use-cases {
  margin-top: 8px;
}

.use-cases-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.use-case-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.use-case-item {
  border-radius: 10px;
  padding: 14px 16px;
  border: 1.5px solid transparent;
}

.short-use {
  background: #fafafa;
  border-color: #e4e7ed;
}

.medium-use {
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.06) 0%, rgba(250, 219, 139, 0.06) 100%);
  border-color: rgba(230, 162, 60, 0.3);
}

.long-use {
  background: linear-gradient(135deg, rgba(142, 45, 226, 0.06) 0%, rgba(74, 0, 224, 0.06) 100%);
  border-color: rgba(142, 45, 226, 0.3);
}

.uc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.uc-icon {
  font-size: 20px;
}

.uc-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.uc-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.uc-list li {
  font-size: 12px;
  color: #606266;
  line-height: 1.6;
  padding-left: 16px;
  position: relative;
}

.uc-list li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #8E2DE2;
  font-weight: bold;
}

.length-options-enhanced {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.length-card-enhanced {
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.25s;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  user-select: none;
  text-align: left;
}

.length-card-enhanced:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.length-card-enhanced.active {
  background: linear-gradient(135deg, rgba(142, 45, 226, 0.06) 0%, rgba(74, 0, 224, 0.06) 100%);
  box-shadow: 0 4px 16px rgba(142, 45, 226, 0.18);
}

.length-card-enhanced.length-short.active {
  border-color: #909399;
}

.length-card-enhanced.length-medium.active {
  border-color: #e6a23c;
}

.length-card-enhanced.length-long.active {
  border-color: #8E2DE2;
}

.length-card-enhanced.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lc-top {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.lc-emoji {
  font-size: 28px;
  flex-shrink: 0;
}

.lc-title-wrap {
  flex: 1;
  min-width: 0;
}

.lc-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.lc-label {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.lc-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.lc-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 10px;
  background: #fafafa;
  border-radius: 8px;
}

.length-card-enhanced.length-medium.active .lc-stats {
  background: rgba(230, 162, 60, 0.08);
}

.length-card-enhanced.length-long.active .lc-stats {
  background: rgba(142, 45, 226, 0.08);
}

.lc-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lc-stat-label {
  font-size: 11px;
  color: #909399;
}

.lc-stat-value {
  font-size: 12px;
  font-weight: 600;
  color: #303133;
}

.lc-detail {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lc-detail-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
}

.lc-detail-label {
  font-size: 13px;
  flex-shrink: 0;
}

.lc-detail-text {
  flex: 1;
  line-height: 1.4;
}

.lc-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px dashed #ebeef5;
}

.lc-feature-tag {
  font-size: 11px;
  padding: 3px 8px;
  background: rgba(142, 45, 226, 0.08);
  color: #6b1db0;
  border-radius: 10px;
  line-height: 1.4;
}

.length-card-enhanced.length-short .lc-feature-tag {
  background: rgba(144, 147, 153, 0.12);
  color: #606266;
}

.length-card-enhanced.length-medium .lc-feature-tag {
  background: rgba(230, 162, 60, 0.12);
  color: #b88230;
}

.result-depth-banner {
  background: linear-gradient(135deg, #faf7ff 0%, #f3efff 100%);
  border: 1px solid #e0d0f5;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
}

.rdb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #d5c0ec;
}

.rdb-title {
  font-size: 14px;
  font-weight: 600;
  color: #5a2094;
}

.rdb-badge {
  font-size: 12px;
  padding: 3px 12px;
  background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);
  color: #fff;
  border-radius: 10px;
  font-weight: 500;
}

.rdb-items {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.rdb-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #efe5fa;
}

.rdb-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.rdb-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.rdb-label {
  font-size: 11px;
  color: #909399;
  line-height: 1.2;
}

.rdb-value {
  font-size: 12px;
  font-weight: 600;
  color: #5a2094;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-footer {
  margin-top: 12px;
  text-align: center;
}
</style>