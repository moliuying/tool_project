# 菜单管理系统

基于 Vue3 + NestJS + SQLite 的全栈管理系统，提供动态菜单管理功能。

## 技术栈

### 前端
- Vue 3.3.4
- TypeScript
- Vite 4.4.9
- Vue Router 4.2.4
- Pinia 2.1.6
- Element Plus 2.3.12
- Axios 1.5.0

### 后端
- NestJS 9.0.0
- TypeORM 0.3.17
- SQLite 5.1.6
- TypeScript 4.9.5

## 环境要求

- Node.js 16.x 或更高版本
- npm 8.x 或更高版本

## 快速开始

### 方式一：使用启动脚本（推荐）

```bash
# 在项目根目录执行
./start.sh
```

这个脚本会自动启动前后端服务：
- 后端服务：http://localhost:3000
- 前端服务：http://localhost:5173

### 方式二：手动启动

#### 1. 启动后端服务

```bash
cd backend
npm run start:dev
```

后端服务将运行在 `http://localhost:3000`

#### 2. 启动前端服务

在新的终端窗口中：

```bash
cd frontend
npm run dev
```

前端服务将运行在 `http://localhost:5173`

## 项目结构

```
tool_project/
├── backend/                 # 后端 NestJS 项目
│   ├── src/
│   │   ├── menu/           # 菜单模块
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── init-db.ts      # 数据库初始化脚本
│   ├── data/               # SQLite 数据库文件
│   └── package.json
├── frontend/               # 前端 Vue3 项目
│   ├── src/
│   │   ├── api/           # API 接口
│   │   ├── components/    # 公共组件
│   │   ├── layouts/       # 布局组件
│   │   ├── router/        # 路由配置
│   │   ├── stores/        # Pinia 状态管理
│   │   ├── views/         # 页面组件
│   │   └── main.ts
│   └── package.json
├── start.sh               # 启动脚本
└── README.md
```

## 功能特性

### 已实现功能

- ✅ 动态菜单渲染（支持多层级）
- ✅ 菜单管理（增删改查）
- ✅ 树形表格展示
- ✅ 菜单图标选择
- ✅ 父级菜单选择
- ✅ 菜单排序
- ✅ 响应式布局

### 核心页面

1. **首页** (`/`)
   - 系统欢迎页面
   - 功能模块展示

2. **菜单管理** (`/menu`)
   - 菜单列表展示（树形结构）
   - 新增菜单
   - 编辑菜单
   - 删除菜单

## API 接口

### 菜单相关接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/menu` | 获取菜单列表（树形结构） |
| GET | `/menu/:id` | 获取单个菜单详情 |
| POST | `/menu` | 创建菜单 |
| PATCH | `/menu/:id` | 更新菜单 |
| DELETE | `/menu/:id` | 删除菜单 |

## 开发说明

### 后端开发

```bash
cd backend

# 开发模式（热重载）
npm run start:dev

# 生产构建
npm run build

# 生产模式运行
npm run start:prod
```

### 前端开发

```bash
cd frontend

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

## 数据库

项目使用 SQLite 作为数据库，数据库文件位于 `backend/data/database.sqlite`。

初始化数据包含：
- 首页菜单
- 系统管理菜单（父级）
- 菜单管理菜单（子级）

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 常见问题

### 1. 端口被占用

如果 3000 或 5173 端口被占用，可以修改配置：

- 后端端口：修改 `backend/src/main.ts` 中的端口号
- 前端端口：修改 `frontend/vite.config.ts` 中的 `server.port`

### 2. 数据库初始化

如果需要重新初始化数据库：

```bash
cd backend
rm -rf data/database.sqlite
npm run build
node dist/init-db.js
```

## 后续扩展

可以基于此框架扩展以下功能：

- 用户认证与授权
- 角色权限管理
- 更多业务模块
- 数据统计与报表
- 系统日志
- 文件上传

## 许可证

ISC
