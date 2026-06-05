<template>
  <div class="word-counter">
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
        <el-step title="输入文本" description="直接输入或粘贴需要统计的文本内容" />
        <el-step title="查看统计" description="实时获取字数、字符数、行数等详细数据" />
        <el-step title="复制结果" description="可一键复制统计结果，方便使用" />
      </el-steps>
    </el-card>

    <el-card class="spec-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataAnalysis />
          </el-icon>
          <span>统计口径说明</span>
          <el-tag size="small" type="warning">重要提示</el-tag>
        </div>
      </template>
      <div class="spec-content">
        <el-alert type="info" :closable="false" class="spec-alert">
          <template #title>
            <span>不同平台对「字数」的定义可能不同，请根据您的使用场景选择合适的统计指标</span>
          </template>
        </el-alert>
        <el-row :gutter="16" class="spec-grid">
          <el-col :span="8">
            <div class="spec-item">
              <div class="spec-title">
                <el-icon color="#409eff"><Edit /></el-icon>
                <span>总字符数</span>
                <el-tag size="small" type="success">含空格</el-tag>
                <el-tag size="small" type="success">含标点</el-tag>
              </div>
              <p class="spec-desc">统计文本中所有字符的数量，包括中文、英文、数字、空格、标点符号、换行符等所有可见和不可见字符。</p>
              <p class="spec-scene"><strong>适用场景：</strong>编程开发、数据传输、文本编码</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="spec-item">
              <div class="spec-title">
                <el-icon color="#67c23a"><Tickets /></el-icon>
                <span>中文字符</span>
                <el-tag size="small" type="info">纯汉字</el-tag>
              </div>
              <p class="spec-desc">仅统计 Unicode 中文汉字范围（\u4e00-\u9fa5）内的字符，包括简体和繁体中文。<strong>不含标点、数字、英文</strong></p>
              <p class="spec-scene"><strong>适用场景：</strong>中文写作、稿件审核、论文查重</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="spec-item">
              <div class="spec-title">
                <el-icon color="#e6a23c"><Goods /></el-icon>
                <span>英文字符</span>
                <el-tag size="small" type="warning">按字母</el-tag>
              </div>
              <p class="spec-desc">统计大小写英文字母 a-z, A-Z 的数量，每个字母单独计数。例如 "Hello" 计为 5 个字符。</p>
              <p class="spec-scene"><strong>适用场景：</strong>英文写作、外语学习、翻译统计</p>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="spec-grid">
          <el-col :span="8">
            <div class="spec-item">
              <div class="spec-title">
                <el-icon color="#f56c6c"><Histogram /></el-icon>
                <span>数字字符</span>
                <el-tag size="small" type="danger">按数字</el-tag>
              </div>
              <p class="spec-desc">统计 0-9 阿拉伯数字的数量，每个数字单独计数。例如 "123" 计为 3 个字符。</p>
              <p class="spec-scene"><strong>适用场景：</strong>数据统计、财务报表、编号统计</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="spec-item">
              <div class="spec-title">
                <el-icon color="#909399"><ChatLineRound /></el-icon>
                <span>总字数</span>
                <el-tag size="small" type="warning">中文按字</el-tag>
                <el-tag size="small" type="warning">英文按词</el-tag>
              </div>
              <p class="spec-desc">中文按「字」计算，英文按「单词」计算（空格分隔），总字数 = 中文字符数 + 英文单词数。<strong>不含标点和空格</strong></p>
              <p class="spec-scene"><strong>适用场景：</strong>稿费计算、作文评分、内容审核</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="spec-item">
              <div class="spec-title">
                <el-icon color="#909399"><Document /></el-icon>
                <span>不含空格</span>
                <el-tag size="small" type="danger">无空格</el-tag>
                <el-tag size="small" type="success">含标点</el-tag>
              </div>
              <p class="spec-desc">统计去除所有空格、制表符、换行符后的字符总数。<strong>仍包含标点符号</strong></p>
              <p class="spec-scene"><strong>适用场景：</strong>严格字数限制、投稿要求、表单验证</p>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="spec-grid">
          <el-col :span="12">
            <div class="spec-item">
              <div class="spec-title">
                <el-icon color="#409eff"><Files /></el-icon>
                <span>UTF-8 字节</span>
                <el-tag size="small" type="primary">Unicode</el-tag>
              </div>
              <p class="spec-desc">按 UTF-8 编码计算字节数：<strong>中文占 3 字节</strong>，英文/数字/半角标点占 1 字节，全角标点占 3 字节。</p>
              <p class="spec-scene"><strong>适用场景：</strong>Web 开发、API 接口、数据库存储、国际化系统</p>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="spec-item">
              <div class="spec-title">
                <el-icon color="#67c23a"><Folder /></el-icon>
                <span>GBK 字节</span>
                <el-tag size="small" type="success">中文编码</el-tag>
              </div>
              <p class="spec-desc">按 GBK/GB2312 编码计算字节数：<strong>中文占 2 字节</strong>，英文/数字/半角标点占 1 字节，全角标点占 2 字节。</p>
              <p class="spec-scene"><strong>适用场景：</strong>中文系统、Legacy 系统、Windows 编码、中文数据库</p>
            </div>
          </el-col>
        </el-row>
        <el-divider>常见场景参考</el-divider>
        <div class="scene-reference">
          <el-tag type="primary" effect="plain">微信公众号：正文最多支持 20000 字（含标点）</el-tag>
          <el-tag type="success" effect="plain">微博：单条最多 140 字（中文按字，英文按字符）</el-tag>
          <el-tag type="warning" effect="plain">学术论文：通常按「字符数（不计空格）」统计</el-tag>
          <el-tag type="danger" effect="plain">稿费计算：多数平台按「实际字数」= 中文 + 英文单词</el-tag>
          <el-tag type="info" effect="plain">高考作文：不少于 800 字（按汉字计算）</el-tag>
        </div>
      </div>
    </el-card>

    <el-card class="counter-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Document />
          </el-icon>
          <span>文本字数统计</span>
          <el-tag size="small" type="info" class="header-tag">支持中英文混合统计</el-tag>
        </div>
      </template>

      <div class="quick-preset">
        <span class="preset-label">快捷操作：</span>
        <el-button-group>
          <el-button size="small" @click="clearText">
            <el-icon><Delete /></el-icon>
            清空内容
          </el-button>
          <el-button size="small" @click="pasteFromClipboard">
            <el-icon><Document /></el-icon>
            粘贴剪贴板
          </el-button>
          <el-button size="small" @click="copyStats" :disabled="!hasContent">
            <el-icon><CopyDocument /></el-icon>
            复制统计
          </el-button>
        </el-button-group>
      </div>

      <div class="input-section">
        <div class="input-header">
          <span class="input-label">文本内容</span>
          <div class="input-actions">
            <el-tag size="small" type="info">
              {{ text.length }} 字符
            </el-tag>
            <el-tooltip content="支持 Ctrl+V 粘贴" placement="top">
              <el-icon class="help-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </div>
        <el-input
          v-model="text"
          type="textarea"
          :rows="12"
          placeholder="请输入或粘贴需要统计的文本内容..."
          resize="vertical"
          class="text-input"
          @input="handleInput"
        />
      </div>

      <el-divider />

      <div class="stats-section">
        <div class="stats-header">
          <el-icon :size="18" color="#165DFF"><DataLine /></el-icon>
          <span>统计结果</span>
          <el-tag v-if="!hasContent" size="small" type="info">请输入文本</el-tag>
          <el-tag v-else size="small" type="success">已统计</el-tag>
        </div>

        <el-row :gutter="16" class="stats-grid">
          <el-col :span="6">
            <el-tooltip placement="top" :show-after="300">
              <template #content>
                <div class="tooltip-content">
                  <strong>统计规则：</strong>所有字符（含空格、标点、换行）
                  <br /><strong>适用：</strong>编程、数据传输
                </div>
              </template>
              <div class="stat-card primary">
                <div class="stat-icon">
                  <el-icon><Edit /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.totalChars }}</div>
                  <div class="stat-label">
                    总字符数
                    <el-icon class="label-help"><QuestionFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :span="6">
            <el-tooltip placement="top" :show-after="300">
              <template #content>
                <div class="tooltip-content">
                  <strong>统计规则：</strong>仅 Unicode 汉字（\u4e00-\u9fa5）
                  <br /><strong>适用：</strong>中文写作、稿件审核
                </div>
              </template>
              <div class="stat-card success">
                <div class="stat-icon">
                  <el-icon><Tickets /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.chineseChars }}</div>
                  <div class="stat-label">
                    中文字符
                    <el-icon class="label-help"><QuestionFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :span="6">
            <el-tooltip placement="top" :show-after="300">
              <template #content>
                <div class="tooltip-content">
                  <strong>统计规则：</strong>a-z, A-Z 英文字母
                  <br /><strong>适用：</strong>英文写作、翻译统计
                </div>
              </template>
              <div class="stat-card warning">
                <div class="stat-icon">
                  <el-icon><Goods /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.englishChars }}</div>
                  <div class="stat-label">
                    英文字符
                    <el-icon class="label-help"><QuestionFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :span="6">
            <el-tooltip placement="top" :show-after="300">
              <template #content>
                <div class="tooltip-content">
                  <strong>统计规则：</strong>0-9 阿拉伯数字
                  <br /><strong>适用：</strong>数据统计、财务报表
                </div>
              </template>
              <div class="stat-card danger">
                <div class="stat-icon">
                  <el-icon><Histogram /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.digitChars }}</div>
                  <div class="stat-label">
                    数字字符
                    <el-icon class="label-help"><QuestionFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-tooltip>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="stats-grid">
          <el-col :span="6">
            <el-tooltip placement="top" :show-after="300">
              <template #content>
                <div class="tooltip-content">
                  <strong>统计规则：</strong>中文字数 + 英文单词数
                  <br /><strong>适用：</strong>稿费计算、作文评分
                </div>
              </template>
              <div class="stat-card info">
                <div class="stat-icon">
                  <el-icon><ChatLineRound /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.totalWords }}</div>
                  <div class="stat-label">
                    总字数
                    <el-icon class="label-help"><QuestionFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :span="6">
            <el-tooltip placement="top" :show-after="300">
              <template #content>
                <div class="tooltip-content">
                  <strong>统计规则：</strong>去除所有空白字符
                  <br /><strong>适用：</strong>严格字数限制、投稿要求
                </div>
              </template>
              <div class="stat-card info">
                <div class="stat-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.charsNoSpace }}</div>
                  <div class="stat-label">
                    不含空格
                    <el-icon class="label-help"><QuestionFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :span="6">
            <el-tooltip placement="top" :show-after="300">
              <template #content>
                <div class="tooltip-content">
                  <strong>统计规则：</strong>按换行符 \n 分割计数
                  <br /><strong>适用：</strong>文档排版、代码统计
                </div>
              </template>
              <div class="stat-card info">
                <div class="stat-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.lines }}</div>
                  <div class="stat-label">
                    行数
                    <el-icon class="label-help"><QuestionFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :span="6">
            <el-tooltip placement="top" :show-after="300">
              <template #content>
                <div class="tooltip-content">
                  <strong>统计规则：</strong>按空行分割，非空内容为一段
                  <br /><strong>适用：</strong>文章结构分析
                </div>
              </template>
              <div class="stat-card info">
                <div class="stat-icon">
                  <el-icon><Tickets /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.paragraphs }}</div>
                  <div class="stat-label">
                    段落数
                    <el-icon class="label-help"><QuestionFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-tooltip>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="stats-grid">
          <el-col :span="12">
            <el-tooltip placement="top" :show-after="300">
              <template #content>
                <div class="tooltip-content">
                  <strong>统计规则：</strong>UTF-8 编码字节数
                  <br /><strong>说明：</strong>中文占 3 字节，英文/数字占 1 字节
                  <br /><strong>适用：</strong>Web 开发、API 接口、数据库存储
                </div>
              </template>
              <div class="stat-card primary">
                <div class="stat-icon">
                  <el-icon><Files /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.utf8Bytes }}</div>
                  <div class="stat-label">
                    UTF-8 字节
                    <el-icon class="label-help"><QuestionFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :span="12">
            <el-tooltip placement="top" :show-after="300">
              <template #content>
                <div class="tooltip-content">
                  <strong>统计规则：</strong>GBK/GB2312 编码字节数
                  <br /><strong>说明：</strong>中文占 2 字节，英文/数字占 1 字节
                  <br /><strong>适用：</strong>中文系统、Legacy 系统、Windows 编码
                </div>
              </template>
              <div class="stat-card success">
                <div class="stat-icon">
                  <el-icon><Folder /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.gbkBytes }}</div>
                  <div class="stat-label">
                    GBK 字节
                    <el-icon class="label-help"><QuestionFilled /></el-icon>
                  </div>
                </div>
              </div>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>

      <el-card v-if="hasContent" class="detail-stats-card" shadow="never">
        <div class="detail-stats-header">
          <el-icon :size="16" color="#165DFF"><DataAnalysis /></el-icon>
          <span>详细分析</span>
        </div>
        <div class="detail-stats-content">
          <el-tooltip placement="top" :show-after="300">
            <template #content>
              <div class="tooltip-content">
                <strong>统计规则：</strong>空格、制表符、换行符等空白字符
              </div>
            </template>
            <div class="detail-item">
              <span class="detail-label">空格数</span>
              <span class="detail-value">{{ stats.spaceChars }}</span>
            </div>
          </el-tooltip>
          <el-tooltip placement="top" :show-after="300">
            <template #content>
              <div class="tooltip-content">
                <strong>统计规则：</strong>中英文标点符号，包含。，！？、；：""''（）等
              </div>
            </template>
            <div class="detail-item">
              <span class="detail-label">标点符号</span>
              <span class="detail-value">{{ stats.punctuationChars }}</span>
            </div>
          </el-tooltip>
          <el-tooltip placement="top" :show-after="300">
            <template #content>
              <div class="tooltip-content">
                <strong>统计规则：</strong>按空格分隔的连续英文字母序列
                <br /><strong>示例：</strong>"Hello World" 计为 2 个单词
              </div>
            </template>
            <div class="detail-item">
              <span class="detail-label">英文单词</span>
              <span class="detail-value">{{ stats.englishWords }}</span>
            </div>
          </el-tooltip>
          <el-tooltip placement="top" :show-after="300">
            <template #content>
              <div class="tooltip-content">
                <strong>统计规则：</strong>总字符数（不含空格）÷ 句子数
                <br /><strong>句子分隔符：</strong>。！？.!?
              </div>
            </template>
            <div class="detail-item">
              <span class="detail-label">平均句长</span>
              <span class="detail-value">{{ stats.avgSentenceLength }} 字符</span>
            </div>
          </el-tooltip>
          <el-tooltip placement="top" :show-after="300">
            <template #content>
              <div class="tooltip-content">
                <strong>统计规则：</strong>总字数 ÷ 300字/分钟（成年人平均阅读速度）
              </div>
            </template>
            <div class="detail-item">
              <span class="detail-label">阅读时间</span>
              <span class="detail-value">{{ stats.readTime }} 分钟</span>
            </div>
          </el-tooltip>
          <el-tooltip placement="top" :show-after="300">
            <template #content>
              <div class="tooltip-content">
                <strong>统计规则：</strong>UTF-8 编码字节数
                <br /><strong>说明：</strong>中文占 3 字节，英文/数字占 1 字节
              </div>
            </template>
            <div class="detail-item">
              <span class="detail-label">字节大小</span>
              <span class="detail-value">{{ stats.byteSize }}</span>
            </div>
          </el-tooltip>
        </div>
        <div class="encoding-compare">
          <div class="encoding-header">
            <el-icon :size="16" color="#165DFF"><TrendCharts /></el-icon>
            <span>编码字节对比</span>
          </div>
          <div class="encoding-list">
            <div class="encoding-item">
              <div class="encoding-name">
                <span class="encoding-dot utf8"></span>
                UTF-8
              </div>
              <div class="encoding-bar">
                <div class="encoding-fill utf8" :style="{ width: getEncodingPercent('utf8') + '%' }"></div>
              </div>
              <div class="encoding-value">
                {{ stats.utf8Bytes }} 字节
                <span class="encoding-note">（中文占3字节）</span>
              </div>
            </div>
            <div class="encoding-item">
              <div class="encoding-name">
                <span class="encoding-dot gbk"></span>
                GBK
              </div>
              <div class="encoding-bar">
                <div class="encoding-fill gbk" :style="{ width: getEncodingPercent('gbk') + '%' }"></div>
              </div>
              <div class="encoding-value">
                {{ stats.gbkBytes }} 字节
                <span class="encoding-note">（中文占2字节）</span>
              </div>
            </div>
          </div>
          <div class="encoding-desc">
            <el-tag size="small" type="info">节省 {{ stats.utf8Bytes - stats.gbkBytes }} 字节</el-tag>
            <span>GBK 编码比 UTF-8 少占用约 {{ getEncodingSavingPercent() }}% 空间</span>
          </div>
        </div>
      </el-card>

      <el-card v-if="hasContent" class="density-card" shadow="never">
        <div class="density-header">
          <el-icon :size="16" color="#165DFF"><PieChart /></el-icon>
          <span>字符分布</span>
        </div>
        <div class="density-content">
          <div class="density-bar">
            <div 
              class="density-segment chinese" 
              :style="{ width: stats.chinesePercent + '%' }"
              :title="`中文 ${stats.chinesePercent}%`"
            ></div>
            <div 
              class="density-segment english" 
              :style="{ width: stats.englishPercent + '%' }"
              :title="`英文 ${stats.englishPercent}%`"
            ></div>
            <div 
              class="density-segment digit" 
              :style="{ width: stats.digitPercent + '%' }"
              :title="`数字 ${stats.digitPercent}%`"
            ></div>
            <div 
              class="density-segment other" 
              :style="{ width: stats.otherPercent + '%' }"
              :title="`其他 ${stats.otherPercent}%`"
            ></div>
          </div>
          <div class="density-legend">
            <span class="legend-item">
              <span class="legend-color chinese"></span>
              中文 {{ stats.chinesePercent }}%
            </span>
            <span class="legend-item">
              <span class="legend-color english"></span>
              英文 {{ stats.englishPercent }}%
            </span>
            <span class="legend-item">
              <span class="legend-color digit"></span>
              数字 {{ stats.digitPercent }}%
            </span>
            <span class="legend-item">
              <span class="legend-color other"></span>
              其他 {{ stats.otherPercent }}%
            </span>
          </div>
        </div>
      </el-card>

      <el-card v-if="hasContent" class="scene-card" shadow="never">
        <div class="scene-header">
          <el-icon :size="16" color="#165DFF"><MagicStick /></el-icon>
          <span>场景化字数统计</span>
          <el-tag size="small" type="success">直接使用，无需二次计算</el-tag>
        </div>
        <div class="scene-content">
          <div 
            class="scene-item" 
            v-for="scene in stats.sceneStats" 
            :key="scene.name"
          >
            <div class="scene-left">
              <div class="scene-icon" :style="{ background: scene.color + '20', color: scene.color }">
                <component :is="getSceneIcon(scene.icon)" />
              </div>
              <div class="scene-info">
                <div class="scene-name">{{ scene.name }}</div>
                <div class="scene-desc">{{ scene.description }}</div>
              </div>
            </div>
            <div class="scene-right">
              <div class="scene-count" :style="{ color: scene.color }">
                {{ scene.count }}
                <span class="scene-unit">{{ scene.unit }}</span>
              </div>
              <el-progress 
                v-if="scene.limit > 0"
                :percentage="Math.min(100, Math.round((scene.count / scene.limit) * 100))"
                :stroke-width="6"
                :color="scene.count > scene.limit ? '#f56c6c' : scene.color"
                class="scene-progress"
              />
              <div v-if="scene.limit > 0" class="scene-limit">
                限制 {{ scene.limit }}{{ scene.unit }}
                <span 
                  class="scene-status"
                  :class="scene.count > scene.limit ? 'over' : 'ok'"
                >
                  {{ scene.count > scene.limit ? '已超出' : '未超出' }}
                </span>
              </div>
              <div v-else class="scene-includes">
                <el-tag size="small" type="info">{{ scene.includes }}</el-tag>
              </div>
            </div>
          </div>
        </div>
        <el-alert type="info" :closable="false" class="scene-alert">
          <template #title>
            <span><strong>统计说明：</strong>不同平台的字数统计规则可能有细微差异，以上数据仅供参考，请以平台实际统计为准</span>
          </template>
        </el-alert>
      </el-card>
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
        <div class="history-item" v-for="(item, index) in displayHistory" :key="index">
          <div class="history-preview">{{ item.preview }}</div>
          <div class="history-meta">
            <el-tag size="small" type="info">{{ item.stats.totalChars }} 字符</el-tag>
            <span class="history-time">{{ formatTime(item.time) }}</span>
          </div>
          <div class="history-actions">
            <el-button size="small" text @click="loadHistoryItem(item)">
              <el-icon><Refresh /></el-icon>
              载入
            </el-button>
          </div>
        </div>
      </div>
      <div class="history-footer" v-if="history.length > 10">
        <el-button text size="small" @click="showAllHistory = !showAllHistory">
          {{ showAllHistory ? '收起' : `查看全部 ${history.length} 条记录` }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  Document,
  InfoFilled,
  Delete,
  CopyDocument,
  DataLine,
  DataAnalysis,
  Edit,
  Tickets,
  ChatLineRound,
  Goods,
  Histogram,
  QuestionFilled,
  PieChart,
  Clock,
  Refresh,
  MagicStick,
  ChatDotRound,
  Files,
  Folder,
  TrendCharts
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface SceneStats {
  name: string
  icon: string
  count: number
  limit: number
  unit: string
  description: string
  includes: string
  color: string
}

interface Stats {
  totalChars: number
  chineseChars: number
  englishChars: number
  digitChars: number
  spaceChars: number
  punctuationChars: number
  totalWords: number
  charsNoSpace: number
  lines: number
  paragraphs: number
  englishWords: number
  avgSentenceLength: string
  readTime: string
  byteSize: string
  utf8Bytes: number
  gbkBytes: number
  chinesePercent: string
  englishPercent: string
  digitPercent: string
  otherPercent: string
  wechatOfficial: number
  academicPaper: number
  manuscript: number
  collegeEssay: number
  weiboPost: number
  sceneStats: SceneStats[]
}

interface HistoryItem {
  text: string
  preview: string
  stats: Stats
  time: string
}

const STORAGE_KEY = 'word_counter_history'

const gbkBytesMap: Record<string, number> = {}
for (let i = 0; i < 128; i++) {
  gbkBytesMap[String.fromCharCode(i)] = 1
}

const calculateGBKBytes = (str: string): number => {
  let bytes = 0
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)
    if (charCode < 128) {
      bytes += 1
    } else if (charCode >= 0x4E00 && charCode <= 0x9FA5) {
      bytes += 2
    } else if (charCode >= 0x3000 && charCode <= 0x303F) {
      bytes += 2
    } else if (charCode >= 0xFF00 && charCode <= 0xFFEF) {
      bytes += 2
    } else if (charCode >= 0x2000 && charCode <= 0x206F) {
      bytes += 2
    } else {
      bytes += 2
    }
  }
  return bytes
}

const text = ref('')
const history = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const hasContent = computed(() => text.value.length > 0)

const stats = computed<Stats>(() => {
  const str = text.value
  
  const totalChars = str.length
  const chineseChars = (str.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishChars = (str.match(/[a-zA-Z]/g) || []).length
  const digitChars = (str.match(/[0-9]/g) || []).length
  const spaceChars = (str.match(/\s/g) || []).length
  const punctuationChars = (str.match(/[，。！？、；：""''（）【】《》！￥……（）——\-,.!?;:\'\"()\[\]<>@#$%^&*_+=\|\\\/`~]/g) || []).length
  
  const chineseWords = chineseChars
  const englishWords = (str.match(/[a-zA-Z]+/g) || []).length
  const totalWords = chineseWords + englishWords
  
  const charsNoSpace = str.replace(/\s/g, '').length
  
  const lines = str === '' ? 0 : str.split('\n').length
  
  const paragraphs = str === '' ? 0 : str.split(/\n\s*\n/).filter(p => p.trim() !== '').length
  
  const sentences = str.split(/[。！？.!?]+/).filter(s => s.trim() !== '')
  const avgSentenceLength = sentences.length > 0 
    ? (charsNoSpace / sentences.length).toFixed(1) 
    : '0'
  
  const readTime = totalWords > 0 
    ? Math.max(1, Math.ceil(totalWords / 300)).toString() 
    : '0'
  
  const encoder = new TextEncoder()
  const utf8Bytes = encoder.encode(str).length
  const gbkBytes = calculateGBKBytes(str)
  let byteSize = ''
  if (utf8Bytes < 1024) {
    byteSize = `${utf8Bytes} B`
  } else if (utf8Bytes < 1024 * 1024) {
    byteSize = `${(utf8Bytes / 1024).toFixed(2)} KB`
  } else {
    byteSize = `${(utf8Bytes / (1024 * 1024)).toFixed(2)} MB`
  }
  
  const otherChars = totalChars - chineseChars - englishChars - digitChars
  const chinesePercent = totalChars > 0 ? ((chineseChars / totalChars) * 100).toFixed(1) : '0.0'
  const englishPercent = totalChars > 0 ? ((englishChars / totalChars) * 100).toFixed(1) : '0.0'
  const digitPercent = totalChars > 0 ? ((digitChars / totalChars) * 100).toFixed(1) : '0.0'
  const otherPercent = totalChars > 0 ? ((otherChars / totalChars) * 100).toFixed(1) : '0.0'
  
  const wechatOfficial = chineseChars + punctuationChars + englishChars + digitChars
  const academicPaper = charsNoSpace
  const manuscript = totalWords
  const collegeEssay = chineseChars
  const weiboPost = chineseChars + englishChars + digitChars + punctuationChars
  
  const sceneStats: SceneStats[] = [
    {
      name: '微信公众号',
      icon: 'ChatDotRound',
      count: wechatOfficial,
      limit: 20000,
      unit: '字',
      description: '公众号正文字数统计',
      includes: '中文 + 标点 + 英文 + 数字',
      color: '#07c160'
    },
    {
      name: '学术论文',
      icon: 'Document',
      count: academicPaper,
      limit: 0,
      unit: '字符',
      description: '期刊/学位论文统计',
      includes: '不计空格的所有字符',
      color: '#409eff'
    },
    {
      name: '投稿/稿费',
      icon: 'Tickets',
      count: manuscript,
      limit: 0,
      unit: '字',
      description: '一般媒体投稿统计',
      includes: '中文按字 + 英文按词',
      color: '#e6a23c'
    },
    {
      name: '高考作文',
      icon: 'Edit',
      count: collegeEssay,
      limit: 800,
      unit: '字',
      description: '语文作文字数统计',
      includes: '仅汉字（不含标点、数字、英文）',
      color: '#f56c6c'
    },
    {
      name: '微博发布',
      icon: 'ChatLineRound',
      count: weiboPost,
      limit: 140,
      unit: '字',
      description: '单条微博字数限制',
      includes: '中文按字 + 其他按字符',
      color: '#e6162d'
    }
  ]
  
  return {
    totalChars,
    chineseChars,
    englishChars,
    digitChars,
    spaceChars,
    punctuationChars,
    totalWords,
    charsNoSpace,
    lines,
    paragraphs,
    englishWords,
    avgSentenceLength,
    readTime,
    byteSize,
    utf8Bytes,
    gbkBytes,
    chinesePercent,
    englishPercent,
    digitPercent,
    otherPercent,
    wechatOfficial,
    academicPaper,
    manuscript,
    collegeEssay,
    weiboPost,
    sceneStats
  }
})

const displayHistory = computed(() => {
  const reversed = history.value.slice().reverse()
  if (showAllHistory.value) {
    return reversed
  }
  return reversed.slice(0, 10)
})

const loadHistoryFromStorage = () => {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

const addToHistory = () => {
  if (!hasContent.value) return
  
  const preview = text.value.substring(0, 50) + (text.value.length > 50 ? '...' : '')
  
  history.value.push({
    text: text.value,
    preview,
    stats: { ...stats.value },
    time: new Date().toISOString()
  })
  
  if (history.value.length > 100) {
    history.value = history.value.slice(-100)
  }
  
  saveHistory()
}

const clearText = () => {
  text.value = ''
  ElMessage.success('已清空内容')
}

const pasteFromClipboard = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText()
    if (clipboardText) {
      text.value += clipboardText
      ElMessage.success('已从剪贴板粘贴')
    } else {
      ElMessage.warning('剪贴板为空')
    }
  } catch (e) {
    ElMessage.error('无法访问剪贴板，请手动粘贴')
  }
}

const copyStats = () => {
  if (!hasContent.value) return
  
  const statsText = `【文本字数统计结果】
总字符数：${stats.value.totalChars}
中文字符：${stats.value.chineseChars}
英文字符：${stats.value.englishChars}
数字字符：${stats.value.digitChars}
总字数：${stats.value.totalWords}
不含空格：${stats.value.charsNoSpace}
行数：${stats.value.lines}
段落数：${stats.value.paragraphs}
UTF-8 字节：${stats.value.utf8Bytes}
GBK 字节：${stats.value.gbkBytes}
阅读时间：约 ${stats.value.readTime} 分钟`
  
  navigator.clipboard.writeText(statsText).then(() => {
    ElMessage.success('统计结果已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

const handleInput = () => {
}

let saveTimeout: number | null = null
watch(text, () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  saveTimeout = window.setTimeout(() => {
    if (hasContent.value) {
      addToHistory()
    }
  }, 3000)
})

const loadHistoryItem = (item: HistoryItem) => {
  text.value = item.text
  ElMessage.success('已载入历史记录')
}

const clearHistory = () => {
  history.value = []
  saveHistory()
  ElMessage.success('历史记录已清空')
}

const iconMap: Record<string, any> = {
  ChatDotRound,
  Document,
  Tickets,
  Edit,
  ChatLineRound
}

const getSceneIcon = (iconName: string) => {
  return iconMap[iconName] || Document
}

const getEncodingPercent = (type: 'utf8' | 'gbk') => {
  const maxBytes = Math.max(stats.value.utf8Bytes, stats.value.gbkBytes)
  if (maxBytes === 0) return 0
  const bytes = type === 'utf8' ? stats.value.utf8Bytes : stats.value.gbkBytes
  return Math.round((bytes / maxBytes) * 100)
}

const getEncodingSavingPercent = () => {
  if (stats.value.utf8Bytes === 0) return '0.0'
  const saving = ((stats.value.utf8Bytes - stats.value.gbkBytes) / stats.value.utf8Bytes) * 100
  return saving.toFixed(1)
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
  loadHistoryFromStorage()
})
</script>

<style scoped>
.word-counter {
  max-width: 900px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.counter-card {
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
  margin-bottom: 24px;
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

.input-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-icon {
  color: #909399;
  cursor: help;
  font-size: 16px;
}

.text-input :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.8;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.stats-section {
  margin-top: 24px;
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.stats-header .el-tag {
  margin-left: auto;
  font-weight: normal;
}

.stats-grid {
  margin-bottom: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #fff;
  border: 1px solid #ebeef5;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.primary {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border-color: #b3d8ff;
}

.stat-card.success {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-color: #c2e7b0;
}

.stat-card.warning {
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-color: #f5dab1;
}

.stat-card.danger {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border-color: #fbc4c4;
}

.stat-card.info {
  background: linear-gradient(135deg, #f4f4f5 0%, #e9e9eb 100%);
  border-color: #d3d4d6;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  flex-shrink: 0;
}

.stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #409eff, #165DFF);
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #67c23a, #529e2e);
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #e6a23c, #cf9236);
}

.stat-card.danger .stat-icon {
  background: linear-gradient(135deg, #f56c6c, #dd6161);
}

.stat-card.info .stat-icon {
  background: linear-gradient(135deg, #909399, #73767a);
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #606266;
  margin-top: 4px;
}

.detail-stats-card {
  margin-top: 16px;
  background: #fafafa;
}

.detail-stats-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.detail-stats-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.encoding-compare {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #e4e7ed;
}

.encoding-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.encoding-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.encoding-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.encoding-name {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 60px;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
}

.encoding-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.encoding-dot.utf8 {
  background: linear-gradient(135deg, #409eff, #165DFF);
}

.encoding-dot.gbk {
  background: linear-gradient(135deg, #67c23a, #529e2e);
}

.encoding-bar {
  flex: 1;
  height: 12px;
  background: #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
}

.encoding-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.encoding-fill.utf8 {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}

.encoding-fill.gbk {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.encoding-value {
  width: 180px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.encoding-note {
  font-size: 12px;
  font-weight: normal;
  color: #909399;
  margin-left: 4px;
}

.encoding-desc {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f0f9ff;
  border-radius: 6px;
  font-size: 13px;
  color: #606266;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 6px;
}

.detail-label {
  font-size: 13px;
  color: #606266;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #165DFF;
}

.density-card {
  margin-top: 16px;
  background: #fafafa;
}

.density-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.density-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.density-bar {
  display: flex;
  height: 16px;
  border-radius: 8px;
  overflow: hidden;
  background: #e4e7ed;
}

.density-segment {
  height: 100%;
  transition: width 0.5s ease;
}

.density-segment.chinese {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.density-segment.english {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}

.density-segment.digit {
  background: linear-gradient(135deg, #e6a23c, #ebb563);
}

.density-segment.other {
  background: linear-gradient(135deg, #909399, #a6a9ad);
}

.density-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-color.chinese {
  background: #67c23a;
}

.legend-color.english {
  background: #409eff;
}

.legend-color.digit {
  background: #e6a23c;
}

.legend-color.other {
  background: #909399;
}

.history-card {
  margin-bottom: 24px;
}

.history-card .card-header {
  justify-content: space-between;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  gap: 16px;
}

.history-item:last-child {
  border-bottom: none;
}

.history-preview {
  flex: 1;
  font-size: 14px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.history-time {
  font-size: 12px;
  color: #909399;
}

.history-actions {
  display: flex;
  gap: 8px;
}

.history-footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.spec-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #fffbe6 0%, #fff7cc 100%);
  border: 1px solid #ffe58f;
}

.spec-card :deep(.el-card__body) {
  padding: 20px;
}

.spec-alert {
  margin-bottom: 20px;
}

.spec-grid {
  margin-bottom: 16px;
}

.spec-item {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  height: 100%;
  transition: all 0.3s ease;
}

.spec-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #165DFF;
}

.spec-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.spec-title .el-tag {
  font-weight: normal;
}

.spec-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 8px 0;
}

.spec-scene {
  font-size: 12px;
  color: #909399;
  margin: 0;
  line-height: 1.5;
}

.scene-reference {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 16px 0 0 0;
}

.scene-reference .el-tag {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 16px;
}

.stat-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.label-help {
  font-size: 12px;
  color: #c0c4cc;
  cursor: help;
}

.tooltip-content {
  font-size: 13px;
  line-height: 1.6;
}

.tooltip-content strong {
  color: #165DFF;
}

.detail-item {
  cursor: help;
}

.scene-card {
  margin-top: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.scene-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.scene-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.scene-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.scene-item:hover {
  border-color: #165DFF;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.1);
}

.scene-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.scene-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.scene-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scene-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.scene-desc {
  font-size: 12px;
  color: #909399;
}

.scene-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  min-width: 180px;
}

.scene-count {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
}

.scene-unit {
  font-size: 13px;
  font-weight: normal;
  margin-left: 2px;
}

.scene-progress {
  width: 140px;
}

.scene-limit {
  font-size: 12px;
  color: #909399;
}

.scene-status {
  margin-left: 8px;
  font-weight: 500;
}

.scene-status.ok {
  color: #67c23a;
}

.scene-status.over {
  color: #f56c6c;
}

.scene-includes {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scene-alert {
  margin-bottom: 0;
}
</style>
