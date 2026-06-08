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

interface LengthTextSet {
  short: string[]
  medium: string[]
  long: string[]
}

interface StoryTemplateConfig {
  titles: string[]
  chapters: string[]
  openings: LengthTextSet
  middles: LengthTextSet
  endings: LengthTextSet
  detailParagraphs: LengthTextSet
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
    openings: {
      short: [
        '{subject}，是历史上一场影响深远的重要事件。',
        '说起{subject}，这是一段不能不了解的历史。',
        '{subject}——短短三个字，背后是一个时代的转折。'
      ],
      medium: [
        '公元{year}年，历史的指针指向了一个非同寻常的时刻。{subject}——这个后来被无数人反复提及的名字，即将在时代的舞台上缓缓拉开帷幕。',
        '在漫长的历史长河中，总有一些时刻如繁星般耀眼。{subject}，就是其中最璀璨的一颗。让我们穿越时空，回到那个风起云涌的年代。',
        '历史的转折往往藏在看似不经意的瞬间。关于{subject}，史书上只有寥寥数语，但背后的惊心动魄，远超你我的想象。'
      ],
      long: [
        '公元{year}年，那是一个注定要被载入史册的年份。{subject}——这个后来被无数历史学家反复研究、被文人墨客反复吟咏的名字，即将在时代的舞台上缓缓拉开帷幕。当时的人们或许并未意识到，他们正站在历史的转折点上。',
        '在中华五千年漫长的历史长河中，总有一些特殊的时刻如同夜空中最璀璨的繁星，照亮了整个时代的走向。{subject}，就是其中最耀眼、最不容错过的一颗。今天，就让我们拂去历史的尘埃，穿越千年时空，重新回到那个风起云涌、英雄辈出的峥嵘岁月。',
        '历史的转折往往藏在看似不经意的一个个瞬间里。翻开厚重的史书，关于{subject}的记载或许只有寥寥数语，一行或两行。但当你真正深入那些散落在各处的史料笔记、方志族谱，你会发现，这寥寥数字背后，是何等的惊心动魄、波诡云谲，其复杂程度，远超你我的想象。'
      ]
    },
    middles: {
      short: [
        '这场事件的核心，就在于关键时刻的关键抉择。',
        '局势瞬息万变，主动权在几方之间来回易手。',
        '正是这个转折，决定了最终的走向。'
      ],
      medium: [
        '就在这千钧一发之际，一个大胆的计划正在暗中酝酿。',
        '然而，命运的齿轮已经开始转动，没有人能够阻止这场即将到来的风暴。',
        '各方势力在此刻汇聚，矛盾与冲突如暗流涌动，一场大戏即将上演。',
        '时间一分一秒地流逝，空气中弥漫着紧张的气息，每个人都在等待着那个决定性的瞬间。'
      ],
      long: [
        '就在这千钧一发之际，一个足以改变整个战局的大胆计划，正在极少数核心人物的密谈中悄然酝酿。这个计划如果成功，将彻底扭转局势；但一旦失败，后果将不堪设想。',
        '然而，历史的齿轮一旦开始转动，就再也没有人能够让它停下。这场即将到来的风暴，早已注定要席卷每一个身处其中的人，无论你是主动参与还是被动卷入，没有人能够置身事外。',
        '几乎就在同一时间，各方势力的核心人物都做出了各自的判断与选择。这些看似独立的决定，如同命运之线在看不见的地方交织缠绕，共同编织出了一场波澜壮阔、跌宕起伏的历史大戏，每一个细节都耐人寻味。',
        '时间就在这种令人窒息的紧张氛围中一分一秒地流逝。空气中仿佛弥漫着硝烟的味道，每个人的脸上都写满了凝重与期待。所有人都在屏息凝神，等待着那个即将决定无数人命运的历史性瞬间。'
      ]
    },
    endings: {
      short: [
        '这就是{subject}的故事，它永远改变了历史的走向。',
        '{subject}虽已远去，但它留下的启示至今仍值得我们深思。',
        '回望{subject}，以史为鉴，可以知兴替。'
      ],
      medium: [
        '如今，{subject}的硝烟早已散尽，但它留给后世的启示，却如黄钟大吕，振聋发聩。历史不是冰冷的数字，而是一个个鲜活的人、一次次勇敢的选择。',
        '当我们回望{subject}，看到的不只是过去，更是映照当下的一面镜子。以史为鉴，可以知兴替——这正是我们不断回望历史的原因。',
        '{subject}已经成为历史，但它所承载的精神与智慧，穿越千年时光，依然在今天闪耀着光芒。'
      ],
      long: [
        '斗转星移，岁月如梭。如今，{subject}的硝烟早已散尽，当年的鼓角争鸣也已消逝在历史的长河中。但这场事件留给后世的启示与思考，却如黄钟大吕，穿越千年时光依然振聋发聩。因为历史从来不是冰冷的年份和数字，它是一个个鲜活的生命、一次次艰难的抉择、一场场令人扼腕或振奋的悲喜剧。',
        '当我们今天站在岁月的这一端，深情回望千百年前的{subject}，我们看到的不只是已经远去的过往，更是一面能够映照当下的明亮镜子。以史为鉴，可以知兴替——这，正是我们一代又一代人不断回望历史、讲述历史、铭记历史的最深层原因。',
        '{subject}的故事已经写进了历史，成为了民族记忆中不可分割的一部分。但它所承载的那种精神、那种智慧、那种在关键时刻挺身而出的勇气，却从未真正远去。它们如同血液中的基因，静静流淌在每一个后来者的身体里，等待着被唤醒、被传承、被发扬光大。'
      ]
    },
    detailParagraphs: {
      short: [
        '这正是历史的关键转折之处。',
        '这个决定，直接影响了事件的结局。',
        '事实证明，这一步走对了。'
      ],
      medium: [
        '关于{subject}，最扣人心弦的莫过于那一连串出人意料的转折。史书上短短几行字，背后却是无数人的命运交织。',
        '想象一下那个场景：旌旗猎猎，战马嘶鸣，空气中弥漫着紧张的气息。每一个决定，都可能改写整个战局。',
        '就在所有人都以为大局已定的时候，一个意想不到的变数出现了——这正是历史最迷人的地方。'
      ],
      long: [
        '关于{subject}，最扣人心弦、也最让后世历史学家们反复琢磨的，莫过于那一连串出人意料、却又在情理之中的戏剧性转折。你翻开官方的正史，看到的可能只是短短几行字的平铺直叙；但你如果去翻那些时人留下的笔记、书信、方志，就会发现，这寥寥数字的背后，是无数人的命运在大时代的浪潮中沉浮交织、相互碰撞。',
        '让我们试着闭上眼睛，想象一下千百年前那个惊心动魄的场景：旌旗猎猎迎风招展，战马嘶鸣响彻云霄，空气中除了尘土的味道，还弥漫着一种令人窒息的紧张气息。在这样的氛围里，每一个微小的决定，都可能像蝴蝶扇动翅膀一样，在遥远的未来引发一场翻天覆地的飓风，改写整个战局乃至整个时代的走向。',
        '就在所有人——无论是当时的亲历者还是后世的研究者——都以为大局已定、尘埃即将落定的时候，一个谁也没有预料到的变数，如同石破天惊一般出现在了历史的舞台上。而这，恰恰是历史最迷人也最让人欲罢不能的地方：它从不按剧本走，永远在你以为猜到结局的时候，给你一个意料之外、却又情理之中的答案。'
      ]
    },
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
    openings: {
      short: [
        '{subject}，是中国历史上一位举足轻重的人物。',
        '说起{subject}，这是一个家喻户晓的名字。',
        '{subject}——这个名字，代表着一段传奇。'
      ],
      medium: [
        '在华夏五千年的历史星空中，有这样一个名字——{subject}。他/她的一生，如同一部波澜壮阔的史诗，写满了传奇与荣耀，也藏着不为人知的挣扎与坚守。',
        '有人说，时势造英雄；也有人说，英雄造时势。{subject}的一生，正是对这句话最好的诠释。让我们翻开泛黄的史册，走进这位传奇人物的内心世界。',
        '千年之后，当我们说起{subject}，心中浮现的不只是一个名字，更是一种精神、一份情怀。但真正的他/她，远比你想象的更加复杂，也更加动人。'
      ],
      long: [
        '在华夏五千年波澜壮阔的历史星空中，总有一些名字如同恒星一般永恒闪耀，无论时光如何流转，都无法磨灭他们的光辉。而{subject}，无疑就是其中最璀璨、最独特、最让人扼腕叹息也最让人肃然起敬的那一颗。他/她的一生，如同一部情节跌宕、波澜壮阔的长篇史诗，写满了常人难以企及的传奇与荣耀，也藏着无数不为人知的挣扎、坚守与痛苦。',
        '古往今来，关于{subject}的传说与故事数不胜数。有人说，时势造英雄；也有人说，英雄造时势。而{subject}的一生，恰恰是对这两句话最好、最深刻的诠释。今天，就让我们拂去岁月的尘埃，翻开那一卷卷泛黄的史册，带着敬畏与好奇，真正走进这位传奇人物的内心世界，去感受他/她的喜怒哀乐、悲欢离合。',
        '千年岁月弹指一挥间。当今天的我们说起{subject}这个名字，大多数人心中浮现的或许只是课本上一个干巴巴的名词、或者影视剧里一个被演绎过的形象。但真正的他/她，远非三言两语可以概括。那是一个立体的、复杂的、有血有肉的、充满了矛盾却又无比真实的人，远比你想象的更加丰满、更加深刻，也更加令人动容。'
      ]
    },
    middles: {
      short: [
        '人生的关键，在于几个重要的选择。',
        '机遇总是垂青有准备的人。',
        '正是这一步，成就了后来的传奇。'
      ],
      medium: [
        '然而，命运并没有给他/她太多喘息的机会。更大的考验，还在前方等待着。',
        '就在人生的十字路口，{subject}做出了一个让所有人都意想不到的决定。',
        '才华与抱负在胸中激荡，但现实的枷锁却如此沉重。该何去何从？',
        '多年的蛰伏与积累，终于在这一刻迎来了绽放的机会。'
      ],
      long: [
        '然而，造化弄人，命运似乎从来不会让伟大的灵魂过得太轻松。它并没有给{subject}太多喘息的机会和休整的时间，一个又一个更大、更严峻、更考验智慧与意志的考验，如同排山倒海一般接踵而至，在前方静静地等待着他/她。',
        '就在这样一个人生最重要的十字路口，所有人都在屏息凝神地观望——认识的、不认识的、支持的、反对的——{subject}却在经过了无数个辗转难眠的深夜和痛苦的内心挣扎之后，最终做出了一个让当时几乎所有人都意想不到、却让后世无数人拍案叫绝的重大决定。',
        '才华与理想如同熊熊烈火一般在胸中激荡燃烧，想要挣脱一切束缚去实现自己的人生抱负；但现实的枷锁却又如此沉重而冰冷，如同千斤巨石压在肩头。在这样激烈的内心矛盾与冲突中，{subject}到底该何去何从？这个问题，没有人能够替他/她回答。',
        '古人云：十年磨一剑，未曾试锋芒。{subject}用了整整多年的时间，在寂寞中蛰伏、在困苦中积累、在孤独中思考，所有的努力、所有的汗水、所有的忍耐，终于在这一刻，迎来了一个厚积薄发、一鸣惊人的机会。'
      ]
    },
    endings: {
      short: [
        '这就是{subject}的一生，一个流传千古的传奇。',
        '{subject}的故事虽已远去，但其精神至今仍激励着后人。',
        '金无足赤，人无完人，但{subject}的一生值得我们铭记。'
      ],
      medium: [
        '如今，{subject}的故事已经成为历史，但他/她留下的精神遗产，却从未远去。每一个心怀理想的人，都能从他/她的故事中汲取前行的力量。',
        '盖棺定论，{subject}的功过是非，也许永远没有标准答案。但正是这种复杂性，让历史如此迷人，也让我们如此着迷。',
        '伟人之所以伟大，不在于从不跌倒，而在于每次跌倒后都能重新站起来。{subject}的一生，正是对这句话最好的注脚。'
      ],
      long: [
        '岁月悠悠，时光如白驹过隙。千百年后的今天，{subject}的故事早已经写进了历史、写进了教科书、写进了一代代人的集体记忆之中。但他/她用一生去坚守和践行的那种精神、那种气节、那种理想主义光芒，却从未真正远去。直到今天，每一个心怀理想、不甘平庸的普通人，依然能够从他/她的人生故事中，汲取到源源不断的、温暖而坚定的前行力量。',
        '古人说：盖棺定论。意思是一个人的功过是非，只有到生命终结那一刻才能真正做出评判。但对于{subject}这样一位深刻影响了历史走向的传奇人物而言，这个定论也许永远不会有真正统一的答案。有人推崇备至，有人颇有微词，有人为他/她扼腕叹息。而恰恰是这种众说纷纭、莫衷一是的复杂性，才让历史变得如此迷人、如此深邃，也让我们如此着迷。',
        '什么是真正的伟人？有人认为是从不犯错、高高在上的完人；但也有人认为，伟人之所以伟大，从来不在于他们从不跌倒——而在于，每一次跌倒之后，他们都能够凭借着超乎常人的意志和信念，重新站立起来，并且站得比以前更高、更稳、更坚定。而{subject}跌宕起伏、百折不挠的一生，正是对这句话最深刻、最动人、也最有说服力的诠释。'
      ]
    },
    detailParagraphs: {
      short: [
        '这份品质，成就了他/她的一生。',
        '关键时刻，方能看出一个人的本色。',
        '这正是他/她与常人的不同之处。'
      ],
      medium: [
        `{subject}曾经说过："志当存高远。"这句话不仅是他/她的人生座右铭，更是激励了后世无数仁人志士。`,
        '许多人只看到了{subject}表面的风光，却不知道他/她背后付出了怎样的艰辛与努力。',
        '在那个等级森严的时代，{subject}能够脱颖而出，靠的不仅是才华，更是远超常人的毅力与胆识。'
      ],
      long: [
        '{subject}曾经在一篇流传千古的文章中这样写道："志当存高远。"这句话虽然简短，却字字千钧，不仅是他/她自己一生矢志不渝的人生座右铭，更是穿越了千年时光，成为激励后世无数仁人志士奋勇前行的精神灯塔。',
        '芸芸众生，大多数人只看到了{subject}表面的无限风光——人前的鲜花着锦、烈火烹油，史书上的浓墨重彩、赫赫声名，却很少有人真正愿意去了解，在这些光鲜亮丽的背后，他/她到底付出了怎样常人难以想象的艰辛、忍耐与努力。',
        '在那个等级制度森严、出身决定一切的时代，{subject}能够冲破重重阻碍，从无数人之中脱颖而出，最终成就一番载入史册的大业，靠的从来不只是虚无缥缈的运气，更不仅仅是令人艳羡的才华——真正支撑他/她走下去的，是那种远超常人的坚定意志、过人胆识与百折不挠的精神。'
      ]
    },
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
    openings: {
      short: [
        '{subject}，是中国历史上一个辉煌的时代。',
        '说起{subject}，总能让人联想到无数美好的词汇。',
        '{subject}时期，是中华文明的一个高峰。'
      ],
      medium: [
        '如果可以穿越回古代，你最想去哪个朝代？很多人的答案会是——{subject}。那是一个怎样的时代？让我们推开厚重的历史之门，一探究竟。',
        '每个时代都有自己独特的气质。{subject}的气质，是诗歌里的豪情万丈，是壁画上的流光溢彩，是流传千年仍让人怦然心动的绝代风华。',
        '在历史的长河中，{subject}时期无疑是最璀璨的篇章之一。那是一个大师辈出、群星闪耀的年代，每一个角落都在演绎着精彩的故事。'
      ],
      long: [
        '如果上天能够给每一个中国人一次穿越时光的机会，让他回到古代去亲身感受一下，我相信，{subject}一定是被选择最多的答案之一。那到底是一个怎样迷人的时代？为什么千百年来，它让无数人心向往之、魂牵梦萦？今天，就让我们一起推开那扇厚重的历史之门，真正走进去，一探究竟。',
        '如果说每一个时代都如同一个人，有着自己独特的性格、气质与精神面貌的话，那么{subject}的气质，一定是诗歌里那种"仰天大笑出门去"的豪情万丈，是壁画上那种衣袂飘飘、流光溢彩的绝代风华，是流传了千年时光，直到今天被人提起时，仍然会让人心头一热、怦然心动的独特魅力。',
        '在中华五千年延绵不绝的历史长河中，{subject}时期毫无疑问是其中最璀璨、最耀眼、最值得我们骄傲和回望的篇章之一。那是一个真正意义上大师辈出、群星闪耀的时代，是一个思想空前解放、创造力无比旺盛的时代，无论是庙堂之高还是江湖之远，每一个角落似乎都在演绎着精彩绝伦、流传千古的故事。'
      ]
    },
    middles: {
      short: [
        '经济的繁荣，孕育了文化的昌盛。',
        '开放包容的风气，造就了这个时代的独特魅力。',
        '正是这种自信，成就了一个伟大的时代。'
      ],
      medium: [
        '在这样的时代背景下，文化艺术迎来了空前的繁荣。',
        '社会的开放与包容，催生了无数令人惊叹的创造。',
        '经济的繁荣为文化的发展奠定了坚实的基础。',
        '正是在这样的土壤中，一颗颗明星相继升起，照亮了整个时代。'
      ],
      long: [
        '就在这样一个千载难逢的时代背景之下，在这样一片肥沃而自由的文化土壤之中，文学、艺术、音乐、舞蹈、宗教、科技……几乎所有你能够想到的领域，都迎来了一次空前的、井喷式的大发展、大繁荣，其成就之辉煌，足以让后世的每一个时代都为之赞叹。',
        '如果要用一个词来形容{subject}时期最核心的社会特质，那一定是——"开放"。整个社会从上到下，从皇帝到平民，从达官贵人到文人墨客，都弥漫着一种前所未有的自信、包容与大度的风气。正是这种海纳百川的胸怀，催生了无数让后人惊叹不已的伟大创造。',
        '文化的繁荣从来不是空中楼阁，它必然建立在坚实的物质基础之上。{subject}时期之所以能够在文化艺术上取得如此登峰造极的成就，最根本的原因就在于，那个时代拥有高度发达的农业、手工业和商业经济，整个社会的物质财富积累达到了一个前所未有的历史高度，为精神文明的腾飞奠定了无比坚实的基础。',
        '正所谓"时势造英雄"，反过来，英雄也成就了时势。正是在{subject}这样一片自由、肥沃、充满活力的文化土壤之中，一位位名垂青史的文学巨匠、艺术大师、科学泰斗相继如新星般升起，用他们无与伦比的才华和创造力，共同照亮了整个时代的文化天空。'
      ]
    },
    endings: {
      short: [
        '这就是{subject}，一个让人魂牵梦萦的时代。',
        '{subject}虽已远去，但它的精神依然活在我们的文化里。',
        '回望{subject}，让我们更加珍惜和自信。'
      ],
      medium: [
        '如今，{subject}的繁华已成过往，但那种文化的基因、精神的气度，早已融入我们民族的血脉，成为每一个中国人心中最深沉的骄傲。',
        '回望{subject}，我们看到的不只是一个远去的时代，更是中华民族精神长河中一段最动人的旋律。它从未消失，只是在静静等待，等待与你的相遇。',
        '每一个伟大的时代，都为后世留下了珍贵的遗产。{subject}留下的，不仅是精美的文物和不朽的诗篇，更是一种自信开放、兼容并包的精神。'
      ],
      long: [
        '繁华事散逐香尘，流水无情草自春。千百年后的今天，{subject}当年的那些楼台殿阁、歌舞升平，那些街头巷尾的喧闹繁华、觥筹交错，早已经随时光的流逝而烟消云散，成为了过眼云烟。但是，那个时代所孕育出来的文化基因、所彰显出来的精神气度、所达到的文明高度，早已经深深地融入了我们整个民族的血脉之中，成为了每一个中国人心中最深沉、最温暖、最值得骄傲的文化记忆。',
        '今天，当我们满怀着敬意和憧憬去深情回望千百年前的{subject}，我们看到的绝对不只是一个在时间上已经远去的、和我们无关的古老时代。我们看到的，是中华民族几千年精神长河中，最激昂澎湃、最悦耳动听、最风华绝代的一段动人旋律。它从来就没有真正消失过，它只是静静地流淌在我们每一个人的文化基因里，等待着一个合适的契机，等待着与你的一次相遇和共鸣。',
        '有人说，历史是一种无用的学问，因为它不能当饭吃、不能当衣穿。但是，每一个真正伟大的时代，都会为后世留下一笔无比珍贵的、永远也花不完的精神遗产。{subject}留给我们这些后人的，绝不仅仅是博物馆里那些精美的文物、或者语文课本上那些不朽的诗篇——它留给我们最宝贵的东西，是一种深入骨髓的民族自信，一种海纳百川的开放胸怀，一种敢为天下先的创新精神。'
      ]
    },
    detailParagraphs: {
      short: [
        '这就是那个时代最迷人的特征。',
        '正是这种氛围，催生了无数传世之作。',
        '生活在那个时代的人，是幸福的。'
      ],
      medium: [
        '{subject}时期的人们，过着怎样的生活？清晨的集市上，小贩的叫卖声此起彼伏；酒肆茶楼里，文人墨客吟诗作对——那是一幅鲜活生动的历史画卷。',
        '在那个时代，诗歌是最流行的社交方式。朋友聚会要写诗，迎来送往要写诗，甚至连金榜题名时，也要在大雁塔上题诗留念。',
        '经济的繁荣带来了文化的昌盛。据史料记载，当时的长安城是世界上最大的城市，人口超过百万，来自世界各地的商人、学者、僧侣汇聚于此。'
      ],
      long: [
        '如果可以真正穿越回去，你觉得{subject}时期的普通老百姓，每天过的是一种怎样的生活？让我们试着想象一下：天蒙蒙亮，东市西市的早市就已经开张了，挑着担子的小贩们此起彼伏地高声叫卖着各种时令小吃和新鲜果蔬；而城中最有名的那几家酒肆茶楼，文人雅士们已经早早地占据了靠窗的好位置，一边品着新茶一边吟诗作对——这，就是一幅多么鲜活生动、令人神往的历史生活画卷啊。',
        '你能想象吗？在{subject}时期，写诗绝对不是文人墨客的专利，而是一种整个社会都趋之若鹜的、最时髦、最高雅的全民社交方式。朋友相聚要写诗助兴，送别亲友要写诗赠别，金榜题名时要写诗庆祝，甚至就连遇到不开心的事，也要写一首诗来抒发情怀。诗歌，就是那个时代的"朋友圈"。',
        '文化的繁荣从来都建立在经济的繁荣之上，这一点在{subject}时期体现得淋漓尽致。根据可靠的史料记载，当时这个王朝的首都——长安城，毫无疑问是整个世界上规模最大、最繁华、最国际化的超级大都市。全城人口超过百万，来自世界各地的商人、学者、僧侣、留学生、艺术家，如同潮水一般汇聚于此，各种语言、各种宗教、各种文化在这里碰撞交融，共同谱写了一曲人类文明交流史上最动人的乐章。'
      ]
    },
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

const styleAdjustments: Record<string, (text: string, length: string) => string> = {
  dramatic: (t, len) => len === 'short' ? t : t + '\n\n（剧情如有虚构，历史以正史为准）',
  humorous: (t, len) => len === 'short' ? t : t.replace(/。/g, '～').replace(/！/g, '！😏'),
  cinematic: (t, len) => {
    if (len === 'short') return t
    if (len === 'medium') return '【开场...】\n\n' + t + '\n\n【落幕】'
    return '【镜头缓缓拉开...】\n\n' + t + '\n\n【画面淡出，字幕滚动...】'
  },
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
  const length = selectedLength.value

  const yearMatch = subjectText.match(/(\d{3,4})/)
  const yearText = yearMatch ? yearMatch[1] : 'XXXX'

  const title = pick(templates.titles).replace(/\{subject\}/g, subjectText)

  const useChapters = length !== 'short'
  const chapterCount = length === 'short' ? 0 : length === 'long' ? templates.chapters.length : 3
  const middleCount = length === 'short' ? 0 : length === 'long' ? 3 : 2

  const paragraphs: StoryParagraph[] = []

  const openingText = pick(templates.openings[length])
    .replace(/\{subject\}/g, subjectText)
    .replace(/\{year\}/g, yearText)
  paragraphs.push({
    chapter: useChapters ? templates.chapters[0] : undefined,
    text: openingText
  })

  for (let i = 0; i < middleCount; i++) {
    let middleText = pick(templates.middles[length])
    const fp = focusPoints[i % (focusPoints.length || 1)]
    if (focusPoints.length > 0 && length !== 'short') {
      middleText = `说到「${fp}」，${middleText}`
    }
    const detail = generateDetailParagraph(selectedInputType.value, subjectText, fp, style, length, i)
    const chapterIndex = i + 1
    paragraphs.push({
      chapter: useChapters && chapterIndex < chapterCount ? templates.chapters[chapterIndex] : undefined,
      text: middleText + detail
    })
  }

  let endingText = pick(templates.endings[length]).replace(/\{subject\}/g, subjectText)
  if (notes.trim() && length !== 'short') {
    endingText += `\n\n补充说明：${notes}`
  }
  paragraphs.push({
    chapter: useChapters ? (templates.chapters[Math.min(chapterCount - 1, templates.chapters.length - 1)] || '尾声') : undefined,
    text: endingText
  })

  const adjustFn = styleAdjustments[style] || styleAdjustments.default
  const allText = paragraphs
    .map(p => (p.chapter ? `【${p.chapter}】\n` : '') + p.text)
    .join('\n\n')
  const adjustedText = adjustFn(allText, length)

  const keyPointsCount = length === 'short' ? 2 : length === 'long' ? 6 : 4
  const keyPoints = pickMany(templates.keyPointsPool, keyPointsCount)
  if (focusPoints.length > 0 && length !== 'short') {
    keyPoints.unshift(...focusPoints.slice(0, 2).map(fp => `关注要点：${fp}`))
  }

  const extendedCount = length === 'short' ? 1 : 3
  const extendedReading = pickMany(templates.extendedPool, extendedCount)

  const teachingTip = length === 'short' ? undefined : pick(templates.teachingTips)

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
  length: string,
  seed: number
): string => {
  const templates = storyTemplates[type] || storyTemplates.event
  const pool = templates.detailParagraphs[length]
  let detail = pool[seed % pool.length].replace(/\{subject\}/g, subject)

  if (focusPoint && length !== 'short') {
    detail = detail.replace(/关于.*，/, `关于「${focusPoint}」，`)
  }

  if (length === 'short') {
    return detail
  }

  const styleFlair: Record<string, { medium: string[]; long: string[] }> = {
    dramatic: {
      medium: ['这一切，在那一刻达到了高潮。'],
      long: ['这一切，都在那个命运攸关的夜晚达到了高潮。', '历史的舞台，从来不缺精彩的戏码。']
    },
    humorous: {
      medium: ['（是不是听起来就很有意思？😏）'],
      long: ['（是不是听起来就很刺激？😏）', '（要是拍电影，这段得是名场面。）']
    },
    cinematic: {
      medium: ['【镜头推进...】'],
      long: ['【特写镜头：人物眼中闪过一丝坚毅】', '【背景音乐渐强，画面推进...】']
    },
    epic: {
      medium: ['这，就是一个时代的剪影。'],
      long: ['这，就是一个时代的缩影。', '千载之下，依然令人心潮澎湃。']
    },
    educational: {
      medium: ['这一点请同学们注意理解。'],
      long: ['这一点在考试中经常出现，请同学们注意掌握。', '我们可以从以下几个方面来理解这个问题。']
    },
    biography: {
      medium: ['这正是他人格魅力的体现。'],
      long: ['多年以后，回忆起这段岁月，他/她依然感慨万千。', '这正是他/她人格魅力的最好体现。']
    },
    default: { medium: [''], long: [''] }
  }

  const flairConfig = styleFlair[style] || styleFlair.default
  const flairPool = length === 'long' ? flairConfig.long : flairConfig.medium
  const flair = flairPool[seed % flairPool.length]

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