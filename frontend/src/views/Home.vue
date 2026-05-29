<template>
  <div class="home-page">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>欢迎使用菜单管理系统</span>
        </div>
      </template>
      <div class="welcome-content">
        <el-icon :size="80" color="#165DFF">
          <HomeFilled />
        </el-icon>
        <h2>系统首页</h2>
        <p>这是一个基于 Vue3 + NestJS + SQLite 的全栈管理系统</p>
        <el-divider />
        <div class="features">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card shadow="hover">
                <el-icon :size="40" color="#165DFF">
                  <Menu />
                </el-icon>
                <h3>菜单管理</h3>
                <p>动态菜单配置</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <el-icon :size="40" color="#165DFF">
                  <Setting />
                </el-icon>
                <h3>系统配置</h3>
                <p>灵活的系统设置</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <el-icon :size="40" color="#165DFF">
                  <DataLine />
                </el-icon>
                <h3>数据统计</h3>
                <p>实时数据分析</p>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-page {
  height: 100%;
}

.welcome-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.welcome-content {
  text-align: center;
  padding: 40px 20px;
}

.welcome-content h2 {
  margin: 20px 0 10px;
  color: #2c3e50;
}

.welcome-content p {
  color: #606266;
  margin-bottom: 30px;
}

.features {
  margin-top: 30px;
}

.features .el-card {
  text-align: center;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.features .el-card:hover {
  transform: translateY(-5px);
}

.features h3 {
  margin: 15px 0 10px;
  color: #2c3e50;
  font-size: 16px;
}

.features p {
  color: #909399;
  font-size: 14px;
  margin: 0;
}
</style>
