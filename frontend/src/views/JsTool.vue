<template>
  <div class="js-tool-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="tool-tabs">
            <el-tab-pane
              v-for="tool in tools"
              :key="tool.path"
              :label="tool.name"
              :name="tool.path"
            >
              <template #label>
                <el-icon><component :is="tool.icon" /></el-icon>
                <span>{{ tool.name }}</span>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>

      <router-view />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tools = [
  {
    name: 'JS 代码美化',
    description: '格式化、美化 JavaScript 代码，支持自定义缩进和排版风格',
    icon: 'MagicStick',
    path: '/js-tool/beautify'
  }
]

const activeTab = ref(route.path)

const handleTabChange = (tabName: string) => {
  router.push(tabName)
}

onMounted(() => {
  if (route.path === '/js-tool') {
    router.replace('/js-tool/beautify')
  }
  activeTab.value = route.path
})
</script>

<style scoped>
.js-tool-page {
  height: 100%;
}

.card-header {
  padding: 0;
}

.tool-tabs {
  margin-bottom: 0;
}

.tool-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.tool-tabs :deep(.el-tabs__nav) {
  border: none;
}

.tool-tabs :deep(.el-tabs__item) {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 54px;
  line-height: 54px;
  font-size: 14px;
}
</style>
