#!/bin/bash

# Awesome AI Pedia 快速启动脚本

echo "🚀 Awesome AI Pedia 启动脚本"
echo "================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到Node.js，请先安装Node.js 18+"
    echo "   下载地址：https://nodejs.org/"
    exit 1
fi

# 检查Node.js版本
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ 错误：Node.js版本过低，需要18+，当前版本：$(node --version)"
    exit 1
fi

echo "✅ Node.js版本检查通过：$(node --version)"

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已安装"
fi

# 启动开发服务器
echo ""
echo "🌐 启动开发服务器..."
echo "   访问地址：http://localhost:5173"
echo "   按 Ctrl+C 停止服务器"
echo ""
npm run dev
