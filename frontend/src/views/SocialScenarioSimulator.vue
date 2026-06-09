<template>
  <div class="social-scenario-simulator">
    <el-card class="hero-card">
      <div class="hero-content">
        <div class="hero-left">
          <div class="hero-icon">🎭</div>
          <div class="hero-text">
            <h1 class="hero-title">社交情境模拟器</h1>
            <p class="hero-subtitle">
              还原真实社交场景，帮你读懂潜台词、识破话外音，在安全的练习环境中提升社交敏感度
            </p>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-value">{{ socialScenarios.length }}</div>
            <div class="stat-label">真实情境</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ totalQuestions }}</div>
            <div class="stat-label">互动题目</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ Object.keys(categoryInfo).length }}</div>
            <div class="stat-label">场景分类</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ correctRate }}%</div>
            <div class="stat-label">正确率</div>
          </div>
        </div>
      </div>
    </el-card>

    <div v-if="!currentScenario" class="browse-mode">
      <el-card class="filter-card">
        <div class="filter-section">
          <div class="filter-label">选择场景分类：</div>
          <div class="category-tabs">
            <div
              class="category-tab"
              :class="{ active: selectedCategory === 'all' }"
              @click="selectedCategory = 'all'"
            >
              <el-icon><Grid /></el-icon>
              <span>全部场景</span>
            </div>
            <div
              v-for="(info, key) in categoryInfo"
              :key="key"
              class="category-tab"
              :class="{ active: selectedCategory === key }"
              :style="selectedCategory === key ? { backgroundColor: info.color, borderColor: info.color } : {}"
              @click="selectedCategory = key"
            >
              <el-icon><component :is="info.icon" /></el-icon>
              <span>{{ info.name }}</span>
            </div>
          </div>
        </div>
        <el-divider />
        <div class="filter-section">
          <div class="filter-label">选择难度等级：</div>
          <div class="difficulty-tabs">
            <div
              class="difficulty-tab"
              :class="{ active: selectedDifficulty === 'all' }"
              @click="selectedDifficulty = 'all'"
            >
              全部难度
            </div>
            <div
              v-for="(info, key) in difficultyInfo"
              :key="key"
              class="difficulty-tab"
              :class="{ active: selectedDifficulty === key }"
              :style="selectedDifficulty === key ? { backgroundColor: info.color, borderColor: info.color, color: '#fff' } : { color: info.color, borderColor: info.color }"
              @click="selectedDifficulty = key"
            >
              {{ info.name }}
            </div>
          </div>
        </div>
      </el-card>

      <div class="scenario-grid">
        <div
          v-for="scenario in filteredScenarios"
          :key="scenario.id"
          class="scenario-card"
          @click="startScenario(scenario)"
        >
          <div class="scenario-header">
            <el-tag
              size="large"
              effect="dark"
              :style="{ backgroundColor: categoryInfo[scenario.category].color }"
            >
              <el-icon><component :is="categoryInfo[scenario.category].icon" /></el-icon>
              <span style="margin-left: 4px">{{ categoryInfo[scenario.category].name }}</span>
            </el-tag>
            <el-tag
              size="large"
              effect="dark"
              :style="{ backgroundColor: difficultyInfo[scenario.difficulty].color }"
            >
              {{ difficultyInfo[scenario.difficulty].name }}
            </el-tag>
          </div>
          <h3 class="scenario-title">{{ scenario.title }}</h3>
          <p class="scenario-desc">{{ scenario.description }}</p>
          <div class="scenario-footer">
            <div class="scenario-tags">
              <el-tag
                v-for="tag in scenario.tags"
                :key="tag"
                size="small"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="start-btn">
              <el-icon><VideoPlay /></el-icon>
              <span>开始练习</span>
            </div>
          </div>
        </div>
      </div>

      <el-empty v-if="filteredScenarios.length === 0" description="暂无符合条件的场景" />
    </div>

    <div v-else class="practice-mode">
      <el-card class="progress-card">
        <div class="progress-header">
          <el-button text @click="exitScenario">
            <el-icon><ArrowLeft /></el-icon>
            <span>返回列表</span>
          </el-button>
          <div class="scenario-info">
            <el-tag
              effect="dark"
              :style="{ backgroundColor: categoryInfo[currentScenario.category].color }"
            >
              {{ categoryInfo[currentScenario.category].name }}
            </el-tag>
            <el-tag
              effect="dark"
              :style="{ backgroundColor: difficultyInfo[currentScenario.difficulty].color }"
            >
              {{ difficultyInfo[currentScenario.difficulty].name }}
            </el-tag>
            <span class="scenario-name">{{ currentScenario.title }}</span>
          </div>
          <div class="progress-text">
            题目 {{ currentQuestionIndex + 1 }} / {{ currentScenario.questions.length }}
          </div>
        </div>
        <el-progress
          :percentage="Math.round(((currentQuestionIndex + (answeredCurrent ? 1 : 0)) / currentScenario.questions.length) * 100)"
          :stroke-width="8"
          :show-text="false"
        />
      </el-card>

      <el-card class="context-card">
        <div class="section-label">
          <el-icon color="#165DFF"><InfoFilled /></el-icon>
          <span>情境解读</span>
          <el-tag size="small" type="info" effect="plain" class="context-tip">
            <el-icon><CaretRight /></el-icon>
            <span>仔细阅读以下信息，它们是读懂对话的关键</span>
          </el-tag>
        </div>

        <div class="context-overview">
          <div class="context-overview-icon">📋</div>
          <p class="context-overview-text">{{ currentScenario.background }}</p>
        </div>

        <div class="context-grid">
          <div class="context-item">
            <div class="context-item-header">
              <el-icon color="#409EFF"><Clock /></el-icon>
              <span class="context-item-title">时间</span>
            </div>
            <p class="context-item-text">{{ currentScenario.context.time }}</p>
          </div>
          <div class="context-item">
            <div class="context-item-header">
              <el-icon color="#67C23A"><Location /></el-icon>
              <span class="context-item-title">地点</span>
            </div>
            <p class="context-item-text">{{ currentScenario.context.location }}</p>
          </div>
        </div>

        <div class="context-section">
          <div class="context-section-header">
            <el-icon color="#E6A23C"><Histogram /></el-icon>
            <span class="context-section-title">前情提要</span>
          </div>
          <p class="context-section-text">{{ currentScenario.context.recentHistory }}</p>
        </div>

        <div class="context-section">
          <div class="context-section-header">
            <el-icon color="#F56C6C"><Odometer /></el-icon>
            <span class="context-section-title">当下氛围</span>
          </div>
          <p class="context-section-text atmosphere-text">{{ currentScenario.context.atmosphere }}</p>
        </div>

        <div class="context-section">
          <div class="context-section-header">
            <el-icon color="#909399"><User /></el-icon>
            <span class="context-section-title">关键人物</span>
          </div>
          <div class="character-list">
            <div
              v-for="(char, idx) in currentScenario.characters"
              :key="idx"
              class="character-card"
            >
              <div class="character-header">
                <div class="character-avatar">
                  <span>{{ char.name.slice(0, 1) }}</span>
                </div>
                <div class="character-basic">
                  <div class="character-name">{{ char.name }}</div>
                  <div class="character-role">{{ char.role }}</div>
                </div>
              </div>
              <div class="character-detail">
                <div class="character-detail-row">
                  <span class="character-detail-label">关系：</span>
                  <span class="character-detail-value">{{ char.relationshipWithYou }}</span>
                </div>
                <div class="character-detail-row">
                  <span class="character-detail-label">性格：</span>
                  <span class="character-detail-value">{{ char.personality }}</span>
                </div>
                <div class="character-detail-row">
                  <span class="character-detail-label">背景：</span>
                  <span class="character-detail-value">{{ char.background }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="dialog-card">
        <div class="section-label">
          <el-icon color="#67C23A"><ChatDotRound /></el-icon>
          <span>对话还原</span>
        </div>
        <div class="dialog-list">
          <div
            v-for="(line, idx) in currentScenario.dialog"
            :key="idx"
            class="dialog-line"
            :class="{ 'is-self': line.role.includes('你') || line.role.includes('男朋友') || line.role.includes('女儿') || line.role.includes('儿子') || line.role.includes('员工') && line.speaker === '你' }"
          >
            <div class="dialog-avatar">
              <span class="avatar-text">{{ line.speaker.slice(0, 1) }}</span>
            </div>
            <div class="dialog-content">
              <div class="dialog-meta">
                <span class="speaker-name">{{ line.speaker }}</span>
                <span class="speaker-role">{{ line.role }}</span>
              </div>
              <div class="dialog-text">{{ line.text }}</div>
              <div v-if="line.tone" class="dialog-tone">
                <el-icon :size="12"><MagicStick /></el-icon>
                <span>语气/动作：{{ line.tone }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="question-card" v-if="!showResult">
        <div class="section-label">
          <el-icon color="#E6A23C"><QuestionFilled /></el-icon>
          <span>请仔细分析后作答</span>
        </div>
        <h3 class="question-text">{{ currentQuestion.text }}</h3>
        <div class="options-list">
          <div
            v-for="option in currentQuestion.options"
            :key="option.id"
            class="option-item"
            :class="{
              selected: selectedOptionId === option.id,
              correct: answeredCurrent && option.isCorrect,
              wrong: answeredCurrent && selectedOptionId === option.id && !option.isCorrect,
              disabled: answeredCurrent
            }"
            @click="selectOption(option.id)"
          >
            <div class="option-label">{{ String.fromCharCode(65 + currentQuestion.options.indexOf(option)) }}</div>
            <div class="option-text">{{ option.text }}</div>
            <el-icon v-if="answeredCurrent && option.isCorrect" class="option-icon correct-icon">
              <CircleCheckFilled />
            </el-icon>
            <el-icon v-else-if="answeredCurrent && selectedOptionId === option.id && !option.isCorrect" class="option-icon wrong-icon">
              <CircleCloseFilled />
            </el-icon>
          </div>
        </div>

        <div v-if="answeredCurrent" class="explanation-section">
          <el-divider />
          <div class="section-label">
            <el-icon color="#909399"><Reading /></el-icon>
            <span>答案解析</span>
          </div>
          <div class="explanation-content" v-if="selectedOption">
            <el-alert
              :title="selectedOption.isCorrect ? '回答正确！' : '回答错误'"
              :type="selectedOption.isCorrect ? 'success' : 'error'"
              :closable="false"
              show-icon
              class="result-alert"
            />
            <p class="explanation-text">{{ selectedOption.explanation }}</p>
          </div>
        </div>

        <div class="question-actions">
          <el-button
            v-if="!answeredCurrent"
            type="primary"
            :disabled="!selectedOptionId"
            @click="submitAnswer"
          >
            提交答案
          </el-button>
          <el-button
            v-else-if="currentQuestionIndex < currentScenario.questions.length - 1"
            type="primary"
            @click="nextQuestion"
          >
            下一题
            <el-icon><ArrowRight /></el-icon>
          </el-button>
          <el-button
            v-else
            type="success"
            @click="finishScenario"
          >
            查看学习总结
            <el-icon><Trophy /></el-icon>
          </el-button>
        </div>
      </el-card>

      <el-card class="result-card" v-else>
        <div class="result-header">
          <div class="result-trophy">🏆</div>
          <h2 class="result-title">练习完成！</h2>
          <p class="result-subtitle">{{ currentScenario.title }}</p>
        </div>
        <div class="result-stats">
          <div class="result-stat-item">
            <div class="result-stat-value" style="color: #409EFF">
              {{ currentScenario.questions.length }}
            </div>
            <div class="result-stat-label">总题数</div>
          </div>
          <div class="result-stat-item">
            <div class="result-stat-value" style="color: #67C23A">
              {{ correctCount }}
            </div>
            <div class="result-stat-label">答对</div>
          </div>
          <div class="result-stat-item">
            <div class="result-stat-value" style="color: #F56C6C">
              {{ currentScenario.questions.length - correctCount }}
            </div>
            <div class="result-stat-label">答错</div>
          </div>
          <div class="result-stat-item">
            <div class="result-stat-value" style="color: #E6A23C">
              {{ Math.round((correctCount / currentScenario.questions.length) * 100) }}%
            </div>
            <div class="result-stat-label">正确率</div>
          </div>
        </div>

        <el-divider />

        <div class="learning-section">
          <div class="section-label">
            <el-icon color="#165DFF"><Bulb /></el-icon>
            <span>核心学习要点</span>
          </div>
          <div class="learning-list">
            <div
              v-for="(point, idx) in currentScenario.learningPoints"
              :key="idx"
              class="learning-item"
            >
              <span class="learning-number">{{ idx + 1 }}</span>
              <span class="learning-text">{{ point }}</span>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <el-button @click="exitScenario">
            <el-icon><Back /></el-icon>
            <span>返回场景列表</span>
          </el-button>
          <el-button type="primary" @click="restartScenario">
            <el-icon><Refresh /></el-icon>
            <span>再练一次</span>
          </el-button>
          <el-button type="success" @click="nextScenario" v-if="hasNextScenario">
            <span>下一个场景</span>
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue';
import { socialScenarios, categoryInfo, difficultyInfo, type SocialScenario, type ScenarioQuestion } from '@/data/socialScenarios';
import { Grid, ArrowLeft, ArrowRight, VideoPlay, InfoFilled, ChatDotRound, MagicStick, QuestionFilled, CircleCheckFilled, CircleCloseFilled, Reading, Trophy, Bulb, Back, Refresh, Clock, Location, Histogram, Odometer, User, CaretRight } from '@element-plus/icons-vue';
const selectedCategory = ref<string>('all');
const selectedDifficulty = ref<string>('all');
const currentScenario = ref<SocialScenario | null>(null);
const currentQuestionIndex = ref(0);
const selectedOptionId = ref<string | null>(null);
const answeredCurrent = ref(false);
const correctCount = ref(0);
const showResult = ref(false);
const userHistory = ref<{
 scenarioId: string;
 questionId: string;
 selectedOptionId: string;
 isCorrect: boolean;
}[]>([]);
const totalQuestions = computed(() => {
 return socialScenarios.reduce((sum, s) => sum + s.questions.length, 0);
});
const correctRate = computed(() => {
 if (userHistory.value.length === 0)
 return 0;
 const correct = userHistory.value.filter(h => h.isCorrect).length;
 return Math.round((correct / userHistory.value.length) * 100);
});
const filteredScenarios = computed(() => {
 return socialScenarios.filter(s => {
 const categoryMatch = selectedCategory.value === 'all' || s.category === selectedCategory.value;
 const difficultyMatch = selectedDifficulty.value === 'all' || s.difficulty === selectedDifficulty.value;
 return categoryMatch && difficultyMatch;
 });
});
const currentQuestion = computed((): ScenarioQuestion => {
 return currentScenario.value!.questions[currentQuestionIndex.value];
});
const selectedOption = computed(() => {
 if (!selectedOptionId.value)
 return null;
 return currentQuestion.value.options.find(o => o.id === selectedOptionId.value) || null;
});
const hasNextScenario = computed(() => {
 if (!currentScenario.value)
 return false;
 const currentIndex = filteredScenarios.value.findIndex(s => s.id === currentScenario.value!.id);
 return currentIndex < filteredScenarios.value.length - 1;
});
function startScenario(scenario: SocialScenario) {
 currentScenario.value = scenario;
 currentQuestionIndex.value = 0;
 selectedOptionId.value = null;
 answeredCurrent.value = false;
 correctCount.value = 0;
 showResult.value = false;
}
function exitScenario() {
 currentScenario.value = null;
 currentQuestionIndex.value = 0;
 selectedOptionId.value = null;
 answeredCurrent.value = false;
 correctCount.value = 0;
 showResult.value = false;
}
function selectOption(optionId: string) {
 if (answeredCurrent.value)
 return;
 selectedOptionId.value = optionId;
}
function submitAnswer() {
 if (!selectedOptionId.value || !selectedOption.value)
 return;
 answeredCurrent.value = true;
 if (selectedOption.value.isCorrect) {
 correctCount.value++;
 }
 userHistory.value.push({
 scenarioId: currentScenario.value!.id,
 questionId: currentQuestion.value.id,
 selectedOptionId: selectedOptionId.value,
 isCorrect: selectedOption.value.isCorrect
 });
}
function nextQuestion() {
 currentQuestionIndex.value++;
 selectedOptionId.value = null;
 answeredCurrent.value = false;
}
function finishScenario() {
 showResult.value = true;
}
function restartScenario() {
 if (currentScenario.value) {
 startScenario(currentScenario.value);
 }
}
function nextScenario() {
 if (!currentScenario.value || !hasNextScenario.value)
 return;
 const currentIndex = filteredScenarios.value.findIndex(s => s.id === currentScenario.value!.id);
 startScenario(filteredScenarios.value[currentIndex + 1]);
}
</script>

<style scoped>
.social-scenario-simulator {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
}

.hero-card :deep(.el-card__body) {
  padding: 28px 32px;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.hero-icon {
  font-size: 56px;
  line-height: 1;
}

.hero-title {
  font-size: 28px;
  margin: 0 0 8px 0;
  color: #fff;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 15px;
  margin: 0;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px 20px;
}

.stat-item {
  text-align: center;
  padding: 0 16px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.25);
}

.filter-card {
  margin-bottom: 8px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-label {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
  min-width: 100px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  color: #606266;
}

.category-tab:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.category-tab.active {
  color: #fff;
}

.difficulty-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.difficulty-tab {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  color: #606266;
}

.difficulty-tab:hover {
  opacity: 0.8;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.scenario-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #ebeef5;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scenario-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #409EFF;
}

.scenario-header {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.scenario-title {
  font-size: 18px;
  margin: 0;
  color: #303133;
  font-weight: 600;
}

.scenario-desc {
  font-size: 13px;
  color: #909399;
  margin: 0;
  line-height: 1.6;
  flex: 1;
}

.scenario-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.scenario-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.start-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409EFF;
  font-size: 14px;
  font-weight: 500;
}

.progress-card {
  margin-bottom: 4px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.scenario-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.scenario-name {
  font-weight: 600;
  color: #303133;
  font-size: 15px;
}

.progress-text {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #303133;
  font-size: 15px;
  margin-bottom: 12px;
}

.context-card,
.dialog-card,
.question-card,
.result-card {
  margin-bottom: 4px;
}

.context-tip {
  margin-left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.context-overview {
  display: flex;
  gap: 12px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  border-left: 3px solid #409EFF;
}

.context-overview-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.context-overview-text {
  flex: 1;
  font-size: 14px;
  color: #303133;
  line-height: 1.8;
  margin: 0;
  font-weight: 500;
}

.context-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.context-item {
  background: #fafafa;
  border-radius: 8px;
  padding: 12px 14px;
}

.context-item-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.context-item-title {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.context-item-text {
  font-size: 13px;
  color: #303133;
  line-height: 1.6;
  margin: 0;
}

.context-section {
  margin-bottom: 16px;
}

.context-section:last-child {
  margin-bottom: 0;
}

.context-section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.context-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.context-section-text {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
  margin: 0;
  background: #fafafa;
  padding: 12px 14px;
  border-radius: 8px;
}

.atmosphere-text {
  background: linear-gradient(135deg, #fef0f0 0%, #fdf2ec 100%);
  color: #c0392b;
  font-style: italic;
}

.character-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.character-card {
  background: #fafafa;
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #ebeef5;
}

.character-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e4e7ed;
}

.character-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.character-basic {
  flex: 1;
}

.character-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.character-role {
  font-size: 12px;
  color: #909399;
}

.character-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.character-detail-row {
  display: flex;
  gap: 8px;
  font-size: 13px;
  line-height: 1.7;
}

.character-detail-label {
  font-weight: 600;
  color: #606266;
  flex-shrink: 0;
  min-width: 42px;
}

.character-detail-value {
  color: #303133;
  flex: 1;
}

.dialog-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-line {
  display: flex;
  gap: 12px;
}

.dialog-line.is-self {
  flex-direction: row-reverse;
}

.dialog-line.is-self .dialog-content {
  align-items: flex-end;
}

.dialog-line.is-self .dialog-text {
  background: #ecf5ff;
  color: #409EFF;
}

.dialog-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

.dialog-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  max-width: 80%;
}

.dialog-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.speaker-name {
  font-weight: 600;
  color: #303133;
}

.speaker-role {
  color: #909399;
}

.dialog-text {
  background: #f5f7fa;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}

.dialog-tone {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  background: #fdf6ec;
  padding: 4px 10px;
  border-radius: 6px;
}

.question-text {
  font-size: 17px;
  color: #303133;
  line-height: 1.7;
  margin: 0 0 20px 0;
  font-weight: 500;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #e4e7ed;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.option-item:hover:not(.disabled) {
  border-color: #409EFF;
  background: #f5f9ff;
}

.option-item.selected {
  border-color: #409EFF;
  background: #ecf5ff;
}

.option-item.correct {
  border-color: #67C23A;
  background: #f0f9eb;
}

.option-item.wrong {
  border-color: #F56C6C;
  background: #fef0f0;
}

.option-item.disabled {
  cursor: default;
}

.option-label {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #606266;
  font-size: 14px;
  flex-shrink: 0;
}

.option-item.selected .option-label {
  background: #409EFF;
  color: #fff;
}

.option-item.correct .option-label {
  background: #67C23A;
  color: #fff;
}

.option-item.wrong .option-label {
  background: #F56C6C;
  color: #fff;
}

.option-text {
  flex: 1;
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}

.option-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.correct-icon {
  color: #67C23A;
}

.wrong-icon {
  color: #F56C6C;
}

.explanation-section {
  margin-top: 16px;
}

.result-alert {
  margin-bottom: 12px;
}

.explanation-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin: 0;
  background: #f5f7fa;
  padding: 12px 16px;
  border-radius: 8px;
}

.question-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 12px;
}

.result-header {
  text-align: center;
  padding: 12px 0;
}

.result-trophy {
  font-size: 64px;
  line-height: 1;
  margin-bottom: 8px;
}

.result-title {
  font-size: 24px;
  margin: 0 0 4px 0;
  color: #303133;
  font-weight: 700;
}

.result-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-top: 20px;
  flex-wrap: wrap;
}

.result-stat-item {
  text-align: center;
  padding: 12px 28px;
}

.result-stat-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.result-stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.learning-section {
  margin-top: 8px;
}

.learning-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.learning-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #f5f9ff;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 3px solid #409EFF;
}

.learning-number {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #409EFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 1px;
}

.learning-text {
  flex: 1;
  font-size: 14px;
  color: #303133;
  line-height: 1.7;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .hero-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .stat-item {
    padding: 0 8px;
  }
  
  .scenario-grid {
    grid-template-columns: 1fr;
  }
  
  .dialog-content {
    max-width: 85%;
  }
  
  .context-grid {
    grid-template-columns: 1fr;
  }
  
  .context-tip {
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
  }
  
  .section-label {
    flex-wrap: wrap;
  }
  
  .character-detail-row {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
