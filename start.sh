#!/bin/bash

echo "正在启动菜单管理系统..."
echo ""

# 启动后端服务
echo "启动后端服务 (端口 3000)..."
cd backend
npm run start:dev &
BACKEND_PID=$!
echo "后端服务 PID: $BACKEND_PID"

# 等待后端启动
sleep 3

# 启动前端服务
echo ""
echo "启动前端服务 (端口 5173)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "前端服务 PID: $FRONTEND_PID"

echo ""
echo "=========================================="
echo "服务启动完成！"
echo "=========================================="
echo "后端地址: http://localhost:3000"
echo "前端地址: http://localhost:5173"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo "=========================================="

# 等待用户中断
wait
