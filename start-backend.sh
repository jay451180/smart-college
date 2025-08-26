#!/bin/bash

# Smart College Advisor Backend Startup Script
# 智能升学助手后端启动脚本

echo "🚀 Starting Smart College Advisor Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if we're in the correct directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Backend package.json not found. Please run this script from the project root."
    exit 1
fi

# Navigate to backend directory
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies."
        exit 1
    fi
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p ../logs ../data ../uploads

# Start the backend server
echo "🌐 Starting backend server on port 3000..."
echo "📊 Health check will be available at: http://localhost:3000/api/health"
echo "🔧 API endpoints will be available at: http://localhost:3000/api/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start
