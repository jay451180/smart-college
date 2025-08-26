# 🚀 智能升学助手 - GitHub Actions 工作流指南

## 📋 概述

本项目配置了完整的 CI/CD 工作流，用于自动化构建、测试、部署和监控智能升学助手项目。

**项目信息:**
- **项目ID**: `SMART_COLLEGE_114514`
- **用户Token**: `USER_WITH_TOKEN`
- **工作流版本**: `v1.0.0`

## 🔧 工作流文件

### 1. 主要 CI/CD 工作流
**文件**: `.github/workflows/smart-college-ci-cd.yml`

**功能**:
- ✅ 代码质量检查 (Python Black, Flake8, ESLint)
- 🔒 安全扫描 (CodeQL, 依赖安全检查)
- 🧪 功能测试 (多浏览器端到端测试)
- ⚡ 性能测试 (Lighthouse 分析)
- 📦 构建和部署
- 📢 通知和清理

**触发条件**:
- Push 到 `main` 或 `develop` 分支
- Pull Request 到 `main` 分支
- 每天 UTC 02:00 定时健康检查
- 手动触发

### 2. 手动部署工作流
**文件**: `.github/workflows/manual-deploy.yml`

**功能**:
- 🎯 选择部署环境 (development/staging/production)
- 🔧 自定义部署选项
- 🚀 一键部署到指定环境
- 📊 部署状态监控

**使用方法**:
1. 进入 GitHub Actions 页面
2. 选择 "手动部署" 工作流
3. 点击 "Run workflow"
4. 选择部署参数并确认

### 3. 项目监控工作流
**文件**: `.github/workflows/project-monitor.yml`

**功能**:
- 🏥 健康检查 (文件完整性、配置验证)
- 🔍 代码质量监控
- 🔒 安全状态检查
- ⚡ 性能监控
- 📋 自动生成监控报告

**触发条件**:
- 每小时执行快速检查
- 每天 UTC 02:00 执行完整检查
- 手动触发特定类型检查

### 4. 部署配置文件
**文件**: `.github/workflows/deploy-config.yml`

**功能**:
- ⚙️ 环境配置模板
- 📊 监控参数设置
- 🔄 回滚策略配置

## 🎯 使用指南

### 开发工作流

1. **功能开发**
   ```bash
   git checkout -b feature/new-feature
   # 开发新功能...
   git push origin feature/new-feature
   ```

2. **创建 Pull Request**
   - PR 会触发自动测试
   - 代码质量检查
   - 安全扫描

3. **合并到主分支**
   - 合并后自动触发完整 CI/CD 流程
   - 自动部署到开发环境

### 部署流程

#### 自动部署
- `develop` 分支 → 开发环境
- `main` 分支 → 预发布环境

#### 手动部署
1. 进入 Actions 页面
2. 选择 "手动部署"
3. 配置参数:
   - **环境**: development/staging/production
   - **版本**: 自动生成或手动指定
   - **选项**: 跳过测试、强制部署等

#### 生产部署
```yaml
环境: production
版本: 1.0.x
跳过测试: false
强制部署: false
发送通知: true
```

### 监控管理

#### 查看监控报告
1. Actions → "项目监控" → 最新运行
2. 下载 "monitoring-report" 工件
3. 查看详细监控数据

#### 手动触发监控
```yaml
检查类型选项:
- quick: 快速健康检查
- full: 完整系统检查  
- security: 安全专项检查
- performance: 性能专项检查
```

## 🔧 配置说明

### 环境变量

```yaml
# 项目基本信息
PROJECT_ID: SMART_COLLEGE_114514
USER_TOKEN: USER_WITH_TOKEN

# 技术栈版本
NODE_VERSION: '18.x'
PYTHON_VERSION: '3.9'
```

### 部署环境

| 环境 | URL | 分支 | 自动部署 |
|------|-----|------|----------|
| Development | https://dev.smart-college.com | develop | ✅ |
| Staging | https://staging.smart-college.com | main | ❌ |
| Production | https://smart-college.com | main | ❌ |

### 质量门禁

#### 代码质量
- ✅ Python: Black 格式化 + Flake8 检查
- ✅ JavaScript: ESLint 语法检查
- ✅ HTML: 基础验证

#### 安全检查
- ✅ CodeQL 静态分析
- ✅ 依赖安全扫描
- ✅ 敏感信息检查

#### 性能要求
- 📄 页面加载时间 < 3s
- 🎨 首次内容绘制 < 1.5s
- 📦 单文件大小 < 500KB

## 🚨 故障处理

### 构建失败
1. **检查日志**: Actions 页面查看详细错误
2. **常见问题**:
   - 依赖安装失败 → 检查 package.json/requirements.txt
   - 代码质量检查失败 → 修复代码风格问题
   - 测试失败 → 修复功能问题

### 部署失败
1. **健康检查失败**: 检查服务启动状态
2. **配置错误**: 验证环境变量设置
3. **权限问题**: 检查部署权限

### 监控告警
1. **文件缺失**: 恢复关键文件
2. **性能下降**: 优化资源大小
3. **安全问题**: 修复敏感信息泄露

## 📊 工作流状态徽章

在 README.md 中添加状态徽章:

```markdown
![CI/CD](https://github.com/your-username/your-repo/workflows/Smart%20College%20Advisor%20CI%2FCD/badge.svg)
![监控](https://github.com/your-username/your-repo/workflows/项目监控/badge.svg)
```

## 🔄 工作流优化建议

### 性能优化
- ✅ 使用缓存加速构建
- ✅ 并行执行测试任务
- ✅ 增量部署策略

### 安全加强
- ✅ 使用 GitHub Secrets 存储敏感信息
- ✅ 定期更新依赖项
- ✅ 启用分支保护规则

### 监控完善
- ✅ 集成外部监控服务
- ✅ 自定义告警规则
- ✅ 性能基准跟踪

## 📞 技术支持

如果您在使用工作流过程中遇到问题:

1. **查看文档**: 阅读本指南和工作流注释
2. **检查日志**: GitHub Actions 提供详细的执行日志
3. **社区支持**: 在 GitHub Issues 中提问
4. **联系团队**: 通过项目维护者联系方式获取帮助

---

**项目**: 智能升学助手 (SMART_COLLEGE_114514)  
**文档版本**: v1.0.0  
**最后更新**: $(date -u +"%Y-%m-%d")
