<template>
  <div class="food-recommender">
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
        <el-step title="选择场景" description="选择午餐、晚餐或周末大餐等场景" />
        <el-step title="设置偏好（可选）" description="按菜系、辣度、价格等条件筛选" />
        <el-step title="点击开始" description="点击按钮，让命运决定今天吃什么" />
        <el-step title="查看结果" description="等待抽奖动画结束，查看推荐详情" />
      </el-steps>
    </el-card>

    <el-card class="recommend-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#e6a23c">
            <KnifeFork />
          </el-icon>
          <span>今天吃什么</span>
          <el-tag size="small" type="warning" class="header-tag">告别选择困难症</el-tag>
        </div>
      </template>

      <div class="scene-selector">
        <span class="selector-label">用餐场景：</span>
        <el-radio-group v-model="selectedScene" size="default">
          <el-radio-button v-for="scene in scenes" :key="scene.value" :value="scene.value">
            <el-icon><component :is="scene.icon" /></el-icon>
            {{ scene.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <el-collapse class="filter-collapse">
        <el-collapse-item title="高级筛选（可选）" name="filter">
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="filter-item">
                <span class="filter-label">菜系偏好</span>
                <el-checkbox-group v-model="selectedCuisines">
                  <el-checkbox v-for="c in cuisineOptions" :key="c" :label="c" />
                </el-checkbox-group>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="filter-item">
                <span class="filter-label">辣度选择</span>
                <el-radio-group v-model="selectedSpicy">
                  <el-radio-button value="all">全部</el-radio-button>
                  <el-radio-button value="none">不辣</el-radio-button>
                  <el-radio-button value="mild">微辣</el-radio-button>
                  <el-radio-button value="spicy">辣</el-radio-button>
                  <el-radio-button value="very">变态辣</el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24" style="margin-top: 16px">
            <el-col :span="12">
              <div class="filter-item">
                <span class="filter-label">价格区间</span>
                <el-slider
                  v-model="priceRange"
                  range
                  :min="0"
                  :max="200"
                  :step="5"
                  show-stops
                />
                <div class="price-range-text">
                  <el-tag size="small">¥{{ priceRange[0] }}</el-tag>
                  <span style="margin: 0 8px">~</span>
                  <el-tag size="small" type="warning">¥{{ priceRange[1] }}</el-tag>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="filter-item">
                <span class="filter-label">用餐方式</span>
                <el-checkbox-group v-model="selectedTypes">
                  <el-checkbox label="堂食" />
                  <el-checkbox label="外卖" />
                  <el-checkbox label="自己做" />
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
          <div class="filter-actions">
            <el-button size="small" @click="resetFilters">重置筛选</el-button>
            <el-tag size="small" type="info">共 {{ filteredMeals.length }} 道菜可选</el-tag>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div class="slot-machine" :class="{ spinning: isSpinning }">
        <div class="slot-item emoji-slot">
          <div class="slot-inner" ref="emojiSlotRef">
            <div v-for="(meal, idx) in slotDisplay" :key="'e' + idx" class="slot-cell">
              <span class="meal-emoji">{{ meal.emoji }}</span>
            </div>
          </div>
        </div>
        <div class="slot-item name-slot">
          <div class="slot-inner" ref="nameSlotRef">
            <div v-for="(meal, idx) in slotDisplay" :key="'n' + idx" class="slot-cell">
              <span class="meal-name">{{ meal.name }}</span>
            </div>
          </div>
        </div>
        <div class="slot-item cuisine-slot">
          <div class="slot-inner" ref="cuisineSlotRef">
            <div v-for="(meal, idx) in slotDisplay" :key="'c' + idx" class="slot-cell">
              <el-tag size="small" :type="getCuisineTagType(meal.cuisine)">{{ meal.cuisine }}</el-tag>
            </div>
          </div>
        </div>
        <div class="slot-pointer"></div>
      </div>

      <div class="result-container" v-if="recommendedMeal && !isSpinning">
        <el-card class="result-card" shadow="never">
          <div class="result-badge">
            <el-icon :size="16"><Star /></el-icon>
            <span>今日推荐</span>
          </div>
          <div class="result-body">
            <div class="result-emoji">{{ recommendedMeal.emoji }}</div>
            <div class="result-info">
              <h3 class="result-name">{{ recommendedMeal.name }}</h3>
              <div class="result-meta">
                <el-tag :type="getCuisineTagType(recommendedMeal.cuisine)" size="small">
                  {{ recommendedMeal.cuisine }}
                </el-tag>
                <el-tag type="success" size="small">
                  {{ getSpicyLabel(recommendedMeal.spicy) }}
                </el-tag>
                <el-tag type="warning" size="small">
                  约 ¥{{ recommendedMeal.price }}
                </el-tag>
              </div>
              <p class="result-desc">{{ recommendedMeal.description }}</p>
              <div class="result-tags">
                <el-tag v-for="tag in recommendedMeal.tags" :key="tag" size="small" effect="plain">
                  {{ tag }}
                </el-tag>
              </div>
              <div class="result-ways">
                <span class="ways-label">推荐方式：</span>
                <el-tag
                  v-for="way in recommendedMeal.ways"
                  :key="way"
                  size="small"
                  type="info"
                  effect="dark"
                >
                  {{ way }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="action-buttons">
        <el-button
          type="warning"
          size="large"
          :icon="MagicStick"
          @click="startRecommend"
          :disabled="isSpinning || filteredMeals.length === 0"
          :loading="isSpinning"
          class="recommend-button"
        >
          {{ isSpinning ? '为你挑选中...' : '开始推荐' }}
        </el-button>
        <el-button
          size="large"
          :icon="Refresh"
          @click="resetAll"
          :disabled="isSpinning"
        >
          重置
        </el-button>
      </div>

      <div v-if="filteredMeals.length === 0 && !isSpinning" class="empty-warning">
        <el-alert
          title="筛选条件过于严格，没有匹配的菜品"
          type="warning"
          show-icon
          :closable="false"
        >
          <template #default>
            <el-button type="warning" text size="small" @click="resetFilters">
              重置筛选条件
            </el-button>
          </template>
        </el-alert>
      </div>
    </el-card>

    <el-card class="history-card" v-if="recommendHistory.length > 0">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Clock />
          </el-icon>
          <span>历史推荐</span>
          <el-button size="small" text type="danger" @click="clearHistory">
            清空记录
          </el-button>
        </div>
      </template>

      <div class="history-list">
        <div
          class="history-item"
          v-for="(item, index) in displayHistory"
          :key="index"
        >
          <span class="history-time">{{ formatTime(item.time) }}</span>
          <span class="history-emoji">{{ item.emoji }}</span>
          <span class="history-name">{{ item.name }}</span>
          <el-tag size="small" :type="getCuisineTagType(item.cuisine)">
            {{ item.cuisine }}
          </el-tag>
          <span class="history-scene">{{ getSceneLabel(item.scene) }}</span>
        </div>
      </div>
      <div class="history-footer" v-if="recommendHistory.length > 10">
        <el-button text size="small" @click="showAllHistory = !showAllHistory">
          {{ showAllHistory ? '收起' : `查看全部 ${recommendHistory.length} 条记录` }}
        </el-button>
      </div>
    </el-card>

    <el-card class="stats-card" v-if="recommendHistory.length >= 3">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <DataLine />
          </el-icon>
          <span>美食偏好统计</span>
          <el-tag size="small" type="success">基于 {{ recommendHistory.length }} 次推荐</el-tag>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="stat-block">
            <div class="stat-emoji">🏆</div>
            <div class="stat-content">
              <div class="stat-label">最常推荐菜系</div>
              <div class="stat-value">{{ topCuisine }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-block">
            <div class="stat-emoji">🔥</div>
            <div class="stat-content">
              <div class="stat-label">平均辣度</div>
              <div class="stat-value">{{ avgSpicy }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-block">
            <div class="stat-emoji">💰</div>
            <div class="stat-content">
              <div class="stat-label">平均消费</div>
              <div class="stat-value">¥{{ avgPrice }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  KnifeFork,
  InfoFilled,
  MagicStick,
  Refresh,
  Clock,
  Star,
  DataLine,
  Sunny,
  Moon,
  Calendar,
  Food
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Meal {
  id: string
  name: string
  emoji: string
  cuisine: string
  spicy: 'none' | 'mild' | 'spicy' | 'very'
  price: number
  description: string
  tags: string[]
  ways: string[]
  scenes: string[]
}

interface HistoryItem {
  name: string
  emoji: string
  cuisine: string
  scene: string
  time: string
}

const STORAGE_KEY = 'food_recommender_history'

const scenes = [
  { label: '午餐', value: 'lunch', icon: Sunny },
  { label: '晚餐', value: 'dinner', icon: Moon },
  { label: '周末大餐', value: 'weekend', icon: Calendar },
  { label: '随便', value: 'any', icon: Food }
]

const cuisineOptions = [
  '川菜', '粤菜', '湘菜', '鲁菜', '江浙菜', '东北菜',
  '日料', '韩餐', '西餐', '东南亚', '快餐', '面食'
]

const meals: Meal[] = [
  { id: '1', name: '麻辣香锅', emoji: '🍲', cuisine: '川菜', spicy: 'spicy', price: 45,
    description: '荤素搭配，麻辣鲜香，一锅搞定所有味蕾。',
    tags: ['下饭神器', '聚餐首选', '过瘾'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner', 'weekend'] },
  { id: '2', name: '宫保鸡丁', emoji: '🍗', cuisine: '川菜', spicy: 'mild', price: 32,
    description: '经典川菜，鸡肉嫩滑，花生酥脆，酸甜微辣。',
    tags: ['经典', '下饭', '国民菜'], ways: ['堂食', '外卖', '自己做'], scenes: ['lunch', 'dinner'] },
  { id: '3', name: '水煮鱼', emoji: '🐟', cuisine: '川菜', spicy: 'spicy', price: 68,
    description: '鱼肉鲜嫩，麻辣鲜香，汤汁浓郁令人欲罢不能。',
    tags: ['招牌', '过瘾', '硬菜'], ways: ['堂食'], scenes: ['dinner', 'weekend'] },
  { id: '4', name: '麻婆豆腐', emoji: '🥘', cuisine: '川菜', spicy: 'spicy', price: 22,
    description: '麻辣鲜香烫，豆腐嫩滑肉末香，川菜灵魂之作。',
    tags: ['经典', '便宜', '下饭'], ways: ['堂食', '外卖', '自己做'], scenes: ['lunch', 'dinner'] },
  { id: '5', name: '口水鸡', emoji: '🍗', cuisine: '川菜', spicy: 'very', price: 38,
    description: '皮爽肉滑，麻辣鲜香，凉菜中的王者。',
    tags: ['凉菜', '开胃', '麻辣'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner', 'weekend'] },
  { id: '6', name: '白切鸡', emoji: '🐔', cuisine: '粤菜', spicy: 'none', price: 58,
    description: '皮脆肉嫩，原汁原味，搭配姜葱酱绝配。',
    tags: ['经典', '清淡', '粤菜代表'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner', 'weekend'] },
  { id: '7', name: '叉烧饭', emoji: '🍚', cuisine: '粤菜', spicy: 'none', price: 35,
    description: '蜜汁叉烧香甜可口，米饭吸满肉汁。',
    tags: ['快餐', '经典', '管饱'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner'] },
  { id: '8', name: '虾饺皇', emoji: '🥟', cuisine: '粤菜', spicy: 'none', price: 28,
    description: '皮薄馅大，虾肉饱满弹牙，粤式早茶必点。',
    tags: ['早茶', '精致', '点心'], ways: ['堂食'], scenes: ['weekend'] },
  { id: '9', name: '煲仔饭', emoji: '🍲', cuisine: '粤菜', spicy: 'none', price: 42,
    description: '米饭焦香，腊味浓郁，锅巴酥脆回味无穷。',
    tags: ['经典', '管饱', '暖胃'], ways: ['堂食', '外卖', '自己做'], scenes: ['lunch', 'dinner'] },
  { id: '10', name: '剁椒鱼头', emoji: '🐟', cuisine: '湘菜', spicy: 'spicy', price: 78,
    description: '鱼头鲜嫩，剁椒香辣，汤汁拌面更是一绝。',
    tags: ['硬菜', '招牌', '过瘾'], ways: ['堂食'], scenes: ['dinner', 'weekend'] },
  { id: '11', name: '小炒肉', emoji: '🥩', cuisine: '湘菜', spicy: 'spicy', price: 38,
    description: '青椒与五花肉的完美组合，香辣下饭第一名。',
    tags: ['下饭', '经典', '湘菜代表'], ways: ['堂食', '外卖', '自己做'], scenes: ['lunch', 'dinner'] },
  { id: '12', name: '口味虾', emoji: '🦐', cuisine: '湘菜', spicy: 'very', price: 88,
    description: '小龙虾香辣入味，嗦虾的快乐无与伦比。',
    tags: ['夜宵', '聚餐', '过瘾'], ways: ['堂食'], scenes: ['dinner', 'weekend'] },
  { id: '13', name: '糖醋里脊', emoji: '🍖', cuisine: '鲁菜', spicy: 'none', price: 42,
    description: '外酥里嫩，酸甜可口，老少咸宜的经典。',
    tags: ['经典', '酸甜', '老少皆宜'], ways: ['堂食', '外卖', '自己做'], scenes: ['lunch', 'dinner', 'weekend'] },
  { id: '14', name: '葱烧海参', emoji: '🦑', cuisine: '鲁菜', spicy: 'none', price: 128,
    description: '海参软糯，葱香浓郁，鲁菜中的高端名菜。',
    tags: ['高端', '宴席', '滋补'], ways: ['堂食'], scenes: ['weekend'] },
  { id: '15', name: '东坡肉', emoji: '🥩', cuisine: '江浙菜', spicy: 'none', price: 58,
    description: '肥瘦相间，入口即化，肥而不腻的传奇。',
    tags: ['经典', '硬菜', '名菜'], ways: ['堂食', '外卖'], scenes: ['dinner', 'weekend'] },
  { id: '16', name: '西湖醋鱼', emoji: '🐟', cuisine: '江浙菜', spicy: 'none', price: 68,
    description: '鱼肉鲜嫩，酸甜爽口，江浙菜的代表之作。',
    tags: ['经典', '特色', '清淡'], ways: ['堂食'], scenes: ['dinner', 'weekend'] },
  { id: '17', name: '小笼包', emoji: '🥟', cuisine: '江浙菜', spicy: 'none', price: 25,
    description: '皮薄汤多，一口下去汤汁四溢。',
    tags: ['早点', '经典', '小吃'], ways: ['堂食', '外卖'], scenes: ['lunch'] },
  { id: '18', name: '锅包肉', emoji: '🍖', cuisine: '东北菜', spicy: 'none', price: 48,
    description: '外酥里嫩，酸甜可口，东北菜的骄傲。',
    tags: ['经典', '量大', '过瘾'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner', 'weekend'] },
  { id: '19', name: '地三鲜', emoji: '🍆', cuisine: '东北菜', spicy: 'mild', price: 28,
    description: '茄子土豆青椒，素菜中的下饭之王。',
    tags: ['素菜', '下饭', '经典'], ways: ['堂食', '外卖', '自己做'], scenes: ['lunch', 'dinner'] },
  { id: '20', name: '猪肉炖粉条', emoji: '🍲', cuisine: '东北菜', spicy: 'none', price: 45,
    description: '粉条吸满汤汁，猪肉软烂，东北人家常味。',
    tags: ['家常', '管饱', '暖胃'], ways: ['堂食', '外卖', '自己做'], scenes: ['lunch', 'dinner'] },
  { id: '21', name: '寿司拼盘', emoji: '🍣', cuisine: '日料', spicy: 'none', price: 88,
    description: '多种寿司一次满足，新鲜食材带来极致享受。',
    tags: ['精致', '生冷', '聚餐'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner', 'weekend'] },
  { id: '22', name: '拉面', emoji: '🍜', cuisine: '日料', spicy: 'none', price: 38,
    description: '汤头浓郁，面条劲道，日式经典美味。',
    tags: ['面食', '暖胃', '快餐'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner'] },
  { id: '23', name: '天妇罗', emoji: '🍤', cuisine: '日料', spicy: 'none', price: 58,
    description: '外酥里嫩，蘸上酱汁，日式炸物料理代表。',
    tags: ['精致', '油炸', '特色'], ways: ['堂食'], scenes: ['dinner', 'weekend'] },
  { id: '24', name: '烤肉', emoji: '🥩', cuisine: '韩餐', spicy: 'mild', price: 98,
    description: '自己动手烤，肉香四溢，配生菜吃绝了。',
    tags: ['聚餐', '互动', '过瘾'], ways: ['堂食'], scenes: ['dinner', 'weekend'] },
  { id: '25', name: '石锅拌饭', emoji: '🍚', cuisine: '韩餐', spicy: 'mild', price: 35,
    description: '蔬菜米饭辣酱拌匀，锅巴香脆回味无穷。',
    tags: ['快餐', '管饱', '经典'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner'] },
  { id: '26', name: '部队锅', emoji: '🍲', cuisine: '韩餐', spicy: 'mild', price: 68,
    description: '香肠午餐肉泡菜煮一锅，配方便面是灵魂。',
    tags: ['聚餐', '暖锅', '特色'], ways: ['堂食'], scenes: ['dinner', 'weekend'] },
  { id: '27', name: '牛排', emoji: '🥩', cuisine: '西餐', spicy: 'none', price: 128,
    description: '熟度自选，搭配黑椒汁或蘑菇酱，仪式感满满。',
    tags: ['高端', '仪式感', '约会'], ways: ['堂食'], scenes: ['dinner', 'weekend'] },
  { id: '28', name: '意大利面', emoji: '🍝', cuisine: '西餐', spicy: 'none', price: 48,
    description: '番茄肉酱或奶油培根，总有一款适合你。',
    tags: ['经典', '西餐入门', '管饱'], ways: ['堂食', '外卖', '自己做'], scenes: ['lunch', 'dinner'] },
  { id: '29', name: '披萨', emoji: '🍕', cuisine: '西餐', spicy: 'none', price: 68,
    description: '芝士拉丝，料多味足，分享的快乐。',
    tags: ['分享', '快餐', '聚会'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner', 'weekend'] },
  { id: '30', name: '冬阴功汤', emoji: '🍲', cuisine: '东南亚', spicy: 'spicy', price: 48,
    description: '酸辣鲜香，椰奶浓郁，泰式风味代表。',
    tags: ['酸辣', '开胃', '异域风情'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner', 'weekend'] },
  { id: '31', name: '咖喱饭', emoji: '🍛', cuisine: '东南亚', spicy: 'mild', price: 38,
    description: '咖喱浓郁，搭配米饭，简单又美味。',
    tags: ['快餐', '管饱', '异域'], ways: ['堂食', '外卖', '自己做'], scenes: ['lunch', 'dinner'] },
  { id: '32', name: '汉堡套餐', emoji: '🍔', cuisine: '快餐', spicy: 'none', price: 35,
    description: '肉饼厚实，薯条酥脆，经典美式快餐。',
    tags: ['快餐', '管饱', '便捷'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner'] },
  { id: '33', name: '炸鸡', emoji: '🍗', cuisine: '快餐', spicy: 'none', price: 45,
    description: '外酥里嫩，配冰可乐，快乐就是这么简单。',
    tags: ['快乐餐', '夜宵', '外卖首选'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner', 'weekend'] },
  { id: '34', name: '兰州拉面', emoji: '🍜', cuisine: '面食', spicy: 'none', price: 25,
    description: '一清二白三红四绿，面条劲道汤头鲜。',
    tags: ['面食', '经典', '实惠'], ways: ['堂食'], scenes: ['lunch', 'dinner'] },
  { id: '35', name: '重庆小面', emoji: '🍜', cuisine: '面食', spicy: 'spicy', price: 20,
    description: '麻辣鲜香，一碗下去额头冒汗，爽！',
    tags: ['面食', '麻辣', '实惠'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner'] },
  { id: '36', name: '炸酱面', emoji: '🍜', cuisine: '面食', spicy: 'none', price: 22,
    description: '老北京风味，酱香浓郁，配面码吃。',
    tags: ['面食', '经典', '管饱'], ways: ['堂食', '自己做'], scenes: ['lunch', 'dinner'] },
  { id: '37', name: '螺蛳粉', emoji: '🍜', cuisine: '面食', spicy: 'spicy', price: 28,
    description: '闻着臭吃着香，酸笋腐竹是灵魂。',
    tags: ['网红', '重口味', '上瘾'], ways: ['堂食', '外卖', '自己做'], scenes: ['lunch', 'dinner'] },
  { id: '38', name: '麻辣火锅', emoji: '🍲', cuisine: '川菜', spicy: 'very', price: 120,
    description: '牛油锅底煮万物，毛肚鸭肠黄喉涮起来！',
    tags: ['聚餐', '过瘾', '火锅'], ways: ['堂食'], scenes: ['dinner', 'weekend'] },
  { id: '39', name: '潮汕牛肉火锅', emoji: '🥩', cuisine: '粤菜', spicy: 'none', price: 100,
    description: '新鲜牛肉现切，涮8秒蘸沙茶，鲜到眉毛掉。',
    tags: ['火锅', '新鲜', '聚餐'], ways: ['堂食'], scenes: ['dinner', 'weekend'] },
  { id: '40', name: '黄焖鸡米饭', emoji: '🍗', cuisine: '鲁菜', spicy: 'mild', price: 28,
    description: '鸡肉嫩滑，香菇入味，汤汁拌饭一绝。',
    tags: ['快餐', '管饱', '经典'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner'] },
  { id: '41', name: '麻辣拌', emoji: '🥗', cuisine: '川菜', spicy: 'spicy', price: 25,
    description: '选好食材拌一拌，麻辣干香更入味。',
    tags: ['快餐', '性价比高', '自定义'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner'] },
  { id: '42', name: '煎饼果子', emoji: '🥞', cuisine: '面食', spicy: 'none', price: 12,
    description: '薄脆鸡蛋酱料葱花，早餐界的顶流。',
    tags: ['早点', '便宜', '便捷'], ways: ['外卖', '自己做'], scenes: ['lunch'] },
  { id: '43', name: '麻辣烫', emoji: '🍢', cuisine: '川菜', spicy: 'spicy', price: 30,
    description: '自选食材煮一锅，麻辣汤头喝着爽。',
    tags: ['快餐', '性价比高', '自定义'], ways: ['堂食', '外卖'], scenes: ['lunch', 'dinner'] },
  { id: '44', name: '三明治', emoji: '🥪', cuisine: '西餐', spicy: 'none', price: 25,
    description: '简单快捷，面包夹一切，健康又方便。',
    tags: ['快餐', '健康', '便捷'], ways: ['外卖', '自己做'], scenes: ['lunch'] },
  { id: '45', name: '沙拉', emoji: '🥗', cuisine: '西餐', spicy: 'none', price: 32,
    description: '蔬菜鸡胸牛油果，健康减脂餐首选。',
    tags: ['健康', '减脂', '轻食'], ways: ['堂食', '外卖', '自己做'], scenes: ['lunch', 'dinner'] }
]

const selectedScene = ref('lunch')
const selectedCuisines = ref<string[]>([])
const selectedSpicy = ref('all')
const selectedTypes = ref<string[]>([])
const priceRange = ref<[number, number]>([0, 200])
const isSpinning = ref(false)
const recommendedMeal = ref<Meal | null>(null)
const slotDisplay = ref<Meal[]>([])
const recommendHistory = ref<HistoryItem[]>([])
const showAllHistory = ref(false)

const emojiSlotRef = ref<HTMLElement | null>(null)
const nameSlotRef = ref<HTMLElement | null>(null)
const cuisineSlotRef = ref<HTMLElement | null>(null)

const filteredMeals = computed(() => {
  return meals.filter(meal => {
    if (selectedScene.value !== 'any' && !meal.scenes.includes(selectedScene.value)) {
      return false
    }
    if (selectedCuisines.value.length > 0 && !selectedCuisines.value.includes(meal.cuisine)) {
      return false
    }
    if (selectedSpicy.value !== 'all' && meal.spicy !== selectedSpicy.value) {
      return false
    }
    if (selectedTypes.value.length > 0) {
      const hasMatchingWay = meal.ways.some(w => selectedTypes.value.includes(w))
      if (!hasMatchingWay) return false
    }
    if (meal.price < priceRange.value[0] || meal.price > priceRange.value[1]) {
      return false
    }
    return true
  })
})

const displayHistory = computed(() => {
  const reversed = recommendHistory.value.slice().reverse()
  if (showAllHistory.value) return reversed
  return reversed.slice(0, 10)
})

const topCuisine = computed(() => {
  const counts: Record<string, number> = {}
  recommendHistory.value.forEach(h => {
    counts[h.cuisine] = (counts[h.cuisine] || 0) + 1
  })
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return entries[0]?.[0] || '-'
})

const avgSpicy = computed(() => {
  if (recommendHistory.value.length === 0) return '-'
  const spicyMap: Record<string, string> = {
    '川菜': '偏辣', '湘菜': '很辣', '粤菜': '清淡', '鲁菜': '适中',
    '江浙菜': '清淡', '东北菜': '适中', '日料': '清淡', '韩餐': '微辣',
    '西餐': '清淡', '东南亚': '酸辣', '快餐': '适中', '面食': '各异'
  }
  const counts: Record<string, number> = {}
  recommendHistory.value.forEach(h => {
    const level = spicyMap[h.cuisine] || '适中'
    counts[level] = (counts[level] || 0) + 1
  })
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return entries[0]?.[0] || '-'
})

const avgPrice = computed(() => {
  if (recommendHistory.value.length === 0) return '-'
  const total = recommendHistory.value.length
  const priceMap: Record<string, number> = {
    '川菜': 45, '湘菜': 55, '粤菜': 50, '鲁菜': 60,
    '江浙菜': 55, '东北菜': 40, '日料': 70, '韩餐': 65,
    '西餐': 80, '东南亚': 50, '快餐': 35, '面食': 25
  }
  let sum = 0
  recommendHistory.value.forEach(h => {
    sum += priceMap[h.cuisine] || 40
  })
  return Math.round(sum / total)
})

const getSceneLabel = (scene: string) => {
  const found = scenes.find(s => s.value === scene)
  return found?.label || scene
}

const getSpicyLabel = (spicy: string) => {
  const map: Record<string, string> = {
    none: '不辣', mild: '微辣', spicy: '辣', very: '变态辣'
  }
  return map[spicy] || spicy
}

const getCuisineTagType = (cuisine: string): '' | 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
    '川菜': 'danger', '湘菜': 'danger', '粤菜': 'success', '鲁菜': 'warning',
    '江浙菜': 'primary', '东北菜': 'warning', '日料': 'info', '韩餐': 'info',
    '西餐': 'primary', '东南亚': 'warning', '快餐': 'success', '面食': ''
  }
  return map[cuisine] || 'info'
}

const getSecureRandom = () => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] / 0xffffffff
  }
  return Math.random()
}

const loadHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      recommendHistory.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
}

const saveHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recommendHistory.value))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

watch(recommendHistory, () => {
  saveHistory()
}, { deep: true })

onMounted(() => {
  loadHistory()
  initSlotDisplay()
})

const initSlotDisplay = () => {
  slotDisplay.value = []
  for (let i = 0; i < 20; i++) {
    slotDisplay.value.push(meals[Math.floor(getSecureRandom() * meals.length)])
  }
}

const resetFilters = () => {
  selectedCuisines.value = []
  selectedSpicy.value = 'all'
  selectedTypes.value = []
  priceRange.value = [0, 200]
  ElMessage.success('筛选条件已重置')
}

const resetAll = () => {
  recommendedMeal.value = null
  selectedScene.value = 'lunch'
  resetFilters()
  initSlotDisplay()
}

const startRecommend = () => {
  if (filteredMeals.value.length === 0) {
    ElMessage.warning('没有匹配的菜品，请调整筛选条件')
    return
  }

  isSpinning.value = true
  recommendedMeal.value = null

  const pool = filteredMeals.value
  const resultIndex = Math.floor(getSecureRandom() * pool.length)
  const result = pool[resultIndex]

  const spinDuration = 2500
  const startTime = Date.now()
  const slotCount = 20

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / spinDuration, 1)
    const easeProgress = 1 - Math.pow(1 - progress, 3)

    const currentDisplay: Meal[] = []
    for (let i = 0; i < slotCount; i++) {
      if (progress < 1) {
        currentDisplay.push(pool[Math.floor(getSecureRandom() * pool.length)])
      } else {
        const offset = Math.floor(slotCount / 2)
        const idx = (i + resultIndex - offset + pool.length) % pool.length
        currentDisplay.push(pool[idx])
      }
    }
    slotDisplay.value = currentDisplay

    if (emojiSlotRef.value && nameSlotRef.value && cuisineSlotRef.value) {
      const cellHeight = 80
      const totalScroll = cellHeight * slotCount * easeProgress
      emojiSlotRef.value.style.transform = `translateY(${-totalScroll % (cellHeight * slotCount)}px)`
      nameSlotRef.value.style.transform = `translateY(${-totalScroll % (cellHeight * slotCount)}px)`
      cuisineSlotRef.value.style.transform = `translateY(${-totalScroll % (cellHeight * slotCount)}px)`
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      isSpinning.value = false
      recommendedMeal.value = result
      recommendHistory.value.push({
        name: result.name,
        emoji: result.emoji,
        cuisine: result.cuisine,
        scene: selectedScene.value,
        time: new Date().toISOString()
      })
      ElMessage.success('今日美食已为你选定！')
    }
  }

  animate()
}

const clearHistory = () => {
  recommendHistory.value = []
  ElMessage.success('历史记录已清空')
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
</script>

<style scoped>
.food-recommender {
  max-width: 900px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.recommend-card {
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

.scene-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-radius: 8px;
}

.selector-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.filter-collapse {
  margin-bottom: 24px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: #606266;
}

.price-range-text {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 13px;
  color: #606266;
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.slot-machine {
  position: relative;
  display: flex;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(180deg, #1f1f1f 0%, #2d2d2d 100%);
  border-radius: 16px;
  margin-bottom: 24px;
  border: 4px solid #e6a23c;
  box-shadow: 0 8px 32px rgba(230, 162, 60, 0.3);
  overflow: hidden;
}

.slot-item {
  flex: 1;
  height: 80px;
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  position: relative;
}

.slot-item.emoji-slot {
  flex: 0 0 100px;
}

.slot-item.cuisine-slot {
  flex: 0 0 120px;
}

.slot-inner {
  display: flex;
  flex-direction: column;
  transition: transform 0.05s linear;
}

.slot-cell {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.meal-emoji {
  font-size: 48px;
}

.meal-name {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.slot-pointer {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e6a23c, #e6a23c, transparent);
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 0 10px rgba(230, 162, 60, 0.8);
}

.slot-machine::before,
.slot-machine::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 30px;
  pointer-events: none;
  z-index: 5;
}

.slot-machine::before {
  top: 20px;
  background: linear-gradient(180deg, rgba(31, 31, 31, 0.9) 0%, transparent 100%);
}

.slot-machine::after {
  bottom: 20px;
  background: linear-gradient(0deg, rgba(31, 31, 31, 0.9) 0%, transparent 100%);
}

.slot-machine.spinning .slot-inner {
  transition: none;
}

.result-container {
  margin-bottom: 24px;
}

.result-card {
  background: linear-gradient(135deg, #fffbe6 0%, #faecd8 100%);
  border: 2px solid #e6a23c;
}

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: #e6a23c;
  color: #fff;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
}

.result-body {
  display: flex;
  gap: 24px;
  align-items: center;
}

.result-emoji {
  font-size: 80px;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 12px 0;
}

.result-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.result-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.result-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.result-ways {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ways-label {
  font-size: 13px;
  color: #909399;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.recommend-button {
  width: 220px;
  height: 56px;
  font-size: 18px;
}

.empty-warning {
  margin-top: 16px;
}

.history-card {
  margin-bottom: 24px;
}

.history-card .card-header {
  justify-content: space-between;
}

.history-list {
  max-height: 320px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  gap: 16px;
}

.history-item:last-child {
  border-bottom: none;
}

.history-time {
  font-size: 12px;
  color: #909399;
  min-width: 80px;
}

.history-emoji {
  font-size: 28px;
}

.history-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.history-scene {
  font-size: 12px;
  color: #909399;
}

.history-footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.stats-card {
  margin-bottom: 24px;
}

.stats-card .card-header {
  justify-content: space-between;
}

.stat-block {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 12px;
}

.stat-emoji {
  font-size: 40px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #165DFF;
}

@media (max-width: 768px) {
  .slot-machine {
    flex-direction: column;
    gap: 8px;
  }

  .slot-item.emoji-slot,
  .slot-item.cuisine-slot {
    flex: none;
    width: 100%;
  }

  .result-body {
    flex-direction: column;
    text-align: center;
  }

  .result-meta,
  .result-tags,
  .result-ways {
    justify-content: center;
  }

  .scene-selector {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
