# Smart College Advisor - Development Guide
# 智能升学助手 - 开发指南

## 🎯 项目概述

Smart College Advisor 是一个基于AI技术的智能升学助手网站，提供全方位的大学申请指导服务。

### 主要功能模块

1. **🤖 AI Assistant** - AI智能助手
2. **📚 Smart Question Bank** - 智能题库
3. **📊 Application Strategy** - 申请策略
4. **📖 Learning Resources** - 学习资源
5. **👥 Learning Community** - 学习社区
6. **📢 School Announcements** - 学校公告
7. **ℹ️ About This Site** - 关于本站

## 🏗️ 技术架构

### 前端技术栈
- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **JavaScript (ES6+)** - 交互逻辑
- **Firebase** - 用户认证和数据存储
- **Stripe** - 支付处理
- **Marked.js** - Markdown解析
- **Prism.js** - 代码高亮

### 后端技术栈
- **Node.js** - 服务器运行环境
- **Express.js** - Web框架
- **CORS** - 跨域资源共享
- **Express Validator** - 数据验证
- **Morgan** - 日志记录
- **Helmet** - 安全中间件

## 📁 项目结构

```
考大学网站/
├── index.html              # 主页面
├── config.js               # 配置文件
├── start-backend.sh        # 后端启动脚本
├── assets/                 # 静态资源
│   ├── css/               # 样式文件
│   ├── js/                # JavaScript文件
│   │   ├── ai-service.js  # AI服务
│   │   ├── features.js    # 功能模块
│   │   ├── firebase-service.js # Firebase服务
│   │   ├── main.js        # 主应用逻辑
│   │   └── stripe-service.js # 支付服务
│   └── images/            # 图片资源
│       └── logo copy.png  # 网站Logo
├── backend/               # 后端代码
│   ├── server.js          # 主服务器文件
│   ├── package.json       # 依赖管理
│   └── routes/            # API路由
│       ├── questions.js   # 题库API
│       └── announcements.js # 公告API
├── logs/                  # 日志文件
├── docs/                  # 文档目录
└── tests/                 # 测试文件
```

## 🚀 快速开始

### 1. 环境准备

确保您的系统已安装：
- Node.js (v16.0.0+)
- npm (v8.0.0+)
- 现代浏览器 (Chrome, Firefox, Safari, Edge)

### 2. 启动前端服务器

```bash
# 在项目根目录下
python3 -m http.server 8000
```

前端将在 http://localhost:8000 运行

### 3. 启动后端服务器

```bash
# 使用启动脚本
./start-backend.sh

# 或手动启动
cd backend
npm install
npm start
```

后端将在 http://localhost:3000 运行

### 4. 访问应用

打开浏览器访问 http://localhost:8000

## 🔧 API 端点

### 题库 API
- `GET /api/questions` - 获取题目列表
- `GET /api/questions/:id` - 获取特定题目
- `GET /api/questions/quiz/random` - 获取随机题目
- `POST /api/questions/:id/answer` - 提交答案
- `GET /api/questions/stats/overview` - 获取统计信息

### 公告 API
- `GET /api/announcements` - 获取公告列表
- `GET /api/announcements/:id` - 获取特定公告
- `GET /api/announcements/recent/:count` - 获取最新公告
- `GET /api/announcements/school/:school` - 获取学校公告
- `GET /api/announcements/stats/overview` - 获取统计信息

### 健康检查
- `GET /api/health` - 服务器健康状态

## 🎨 功能特色

### AI Assistant
- 智能对话系统
- 多语言支持
- 个性化建议
- 历史对话记录

### Smart Question Bank
- 题目分类筛选
- 难度等级划分
- 实时练习反馈
- 进度追踪统计

### Application Strategy
- 个性化申请时间线
- 要求清单管理
- 文书写作指导
- 学校匹配推荐

### Learning Resources
- 资源分类浏览
- 搜索功能
- 下载管理
- 收藏功能

### Learning Community
- 讨论论坛
- 学习小组
- 活动日历
- 导师匹配

### School Announcements
- 实时公告推送
- 学校筛选
- 类型分类
- 重要性标记

## 🔒 安全特性

- HTTPS 强制加密
- CORS 跨域保护
- 输入数据验证
- 用户身份认证
- 会话管理
- API 限流保护

## 🌍 国际化支持

- 中文简体 (zh-CN)
- English (en-US)
- 动态语言切换
- 本地化日期格式

## 📊 性能优化

- 图片懒加载
- 代码分割
- CDN 加速
- 缓存策略
- 压缩传输

## 🧪 测试

```bash
# 运行测试
cd backend
npm test

# 前端测试
cd tests
python test_basic.py
```

## 📝 开发规范

### 代码风格
- 使用 ES6+ 语法
- 采用驼峰命名法
- 添加详细注释
- 保持代码整洁

### Git 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式
- refactor: 代码重构
- test: 测试相关

## 🚢 部署

### 生产环境部署
1. 构建前端资源
2. 配置环境变量
3. 启动后端服务
4. 配置反向代理
5. 设置 HTTPS
6. 监控和日志

### 环境变量
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📞 支持与反馈

- 📧 Email: support@smartcollegeadvisor.com
- 🌐 Website: https://smartcollegeadvisor.com
- 📱 Support: 24/7 在线支持

## 📄 许可证

MIT License - 详见 LICENSE 文件

---

**Happy Coding! 🎉**
