# 🚀 自动部署配置指南

本项目支持通过GitHub Actions自动部署到Netlify。

## 📋 前置要求

### 1. Netlify账户设置
- 在 [Netlify](https://netlify.com) 创建账户
- 创建新站点或连接现有站点
- 获取站点ID（Site ID）

### 2. Netlify访问令牌
- 登录Netlify控制台
- 进入 **User Settings** → **Applications** → **Personal access tokens**
- 点击 **New access token**
- 输入描述（如：GitHub Actions Deploy）
- 复制生成的令牌

## 🔑 GitHub Secrets配置

在您的GitHub仓库中配置以下Secrets：

### 步骤：
1. 进入GitHub仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**

### 需要配置的Secrets：

| Secret名称 | 描述 | 获取方式 |
|------------|------|----------|
| `NETLIFY_TOKEN` | Netlify访问令牌 | 从Netlify用户设置中生成 |
| `NETLIFY_PROJECT_ID` | Netlify站点ID | 从站点设置中获取 |

### 🔍 如何获取Netlify站点ID：

1. 登录Netlify控制台
2. 选择您的站点
3. 进入 **Site settings** → **General**
4. 在 **Site details** 部分找到 **Site ID**
5. 复制完整的站点ID（格式类似：`abcd1234-5678-90ef-ghij-klmnopqrstuv`）

## 📄 工作流文件说明

项目包含三个GitHub Actions工作流文件：

### 1. `netlify-simple.yml` （推荐）
```yaml
# 最简单的部署配置，适合纯静态网站
- 检出代码
- 直接部署到Netlify
```

### 2. `netlify-deploy.yml` （标准）
```yaml
# 标准部署配置，包含构建步骤
- 检出代码
- 设置Node.js环境
- 安装依赖
- 构建项目（如果需要）
- 部署到Netlify
- 状态通知
```

### 3. `netlify-advanced.yml` （高级）
```yaml
# 高级部署配置，包含代码检查和测试
- 代码质量检查
- 运行测试
- 构建项目
- 部署到Netlify
- PR评论
- 失败通知
```

## 🛠️ 使用方式

### 自动部署
1. 配置好GitHub Secrets
2. 将代码推送到`main`分支
3. GitHub Actions自动触发部署
4. 部署完成后在Netlify查看结果

### 手动部署
1. 进入GitHub仓库的 **Actions** 标签
2. 选择工作流
3. 点击 **Run workflow**
4. 选择分支并运行

## 📊 部署状态检查

### GitHub Actions页面
- 查看部署状态和日志
- 下载构建产物
- 查看错误信息

### Netlify控制台
- 查看部署历史
- 监控网站状态
- 管理域名和设置

## 🔧 自定义配置

### 修改部署目录
如果您的构建输出在特定目录（如`dist/`或`build/`），请修改工作流文件中的`--dir`参数：

```yaml
args: deploy --prod --dir=dist --message="Deploy from GitHub Actions"
```

### 添加环境变量
如果需要在构建时使用环境变量，可以在工作流中添加：

```yaml
env:
  NODE_ENV: production
  REACT_APP_API_URL: ${{ secrets.API_URL }}
```

### 自定义构建命令
如果有特殊的构建需求，可以修改构建步骤：

```yaml
- name: 🔨 Custom build
  run: |
    npm run build:prod
    npm run optimize
```

## 🚨 常见问题

### 1. 部署失败
- 检查Secrets是否正确配置
- 确认Netlify令牌权限
- 查看GitHub Actions日志

### 2. 站点ID错误
- 确认复制的是正确的Site ID
- 检查是否包含特殊字符或空格

### 3. 权限问题
- 确认Netlify令牌有足够权限
- 检查GitHub仓库权限设置

## 📞 支持

如果遇到问题：
1. 查看GitHub Actions运行日志
2. 检查Netlify部署日志
3. 参考官方文档：
   - [GitHub Actions文档](https://docs.github.com/en/actions)
   - [Netlify部署文档](https://docs.netlify.com/site-deploys/create-deploys/)

---

🎉 配置完成后，每次推送代码到main分支都会自动部署到Netlify！
