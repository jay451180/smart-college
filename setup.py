#!/usr/bin/env python3
"""
智能升学助手 - 项目安装脚本
用于安装项目依赖和初始化开发环境

@author 智能升学助手开发团队
@version 1.0.0
@date 2024-08-07
"""

import os
import sys
import subprocess
import logging
from pathlib import Path

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('setup.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

def run_command(command, description):
    """执行命令并记录日志"""
    logger.info(f"执行: {description}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        logger.info(f"成功: {description}")
        if result.stdout:
            logger.debug(f"输出: {result.stdout}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"失败: {description}")
        logger.error(f"错误: {e.stderr}")
        return False

def check_python_version():
    """检查Python版本"""
    logger.info("检查Python版本...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        logger.error("需要Python 3.8或更高版本")
        return False
    logger.info(f"Python版本: {version.major}.{version.minor}.{version.micro}")
    return True

def install_dependencies():
    """安装项目依赖"""
    logger.info("安装项目依赖...")
    
    # 尝试不同的pip命令
    pip_commands = ["pip", "pip3", "python -m pip", "python3 -m pip"]
    pip_available = False
    
    for cmd in pip_commands:
        if run_command(f"{cmd} --version", f"检查{cmd}版本"):
            pip_available = True
            pip_cmd = cmd
            break
    
    if not pip_available:
        logger.warning("pip不可用，跳过依赖安装")
        return True  # 不阻止项目继续
    
    # 升级pip
    run_command(f"{pip_cmd} install --upgrade pip", "升级pip")
    
    # 安装依赖
    if os.path.exists("requirements.txt"):
        if not run_command(f"{pip_cmd} install -r requirements.txt", "安装requirements.txt中的依赖"):
            logger.warning("依赖安装失败，但项目仍可继续")
            return True  # 不阻止项目继续
    else:
        logger.warning("requirements.txt不存在，跳过依赖安装")
    
    return True

def create_directories():
    """创建必要的目录"""
    logger.info("创建项目目录...")
    
    directories = [
        "assets/css",
        "assets/js", 
        "assets/images",
        "docs",
        "logs",
        "tests"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        logger.info(f"创建目录: {directory}")

def create_config_files():
    """创建配置文件"""
    logger.info("创建配置文件...")
    
    # 创建.env文件模板
    env_content = """# 智能升学助手 - 环境配置
# 复制此文件为.env并填入实际配置

# API配置
GEMINI_API_KEY=your_api_key_here

# 应用配置
DEBUG=true
LOG_LEVEL=info

# 服务器配置
PORT=8000
HOST=localhost
"""
    
    with open(".env.example", "w", encoding="utf-8") as f:
        f.write(env_content)
    
    logger.info("创建.env.example文件")

def setup_git():
    """初始化Git仓库"""
    logger.info("初始化Git仓库...")
    
    if not os.path.exists(".git"):
        if run_command("git init", "初始化Git仓库"):
            run_command("git add .", "添加文件到Git")
            run_command('git commit -m "Initial commit: 智能升学助手项目初始化"', "初始提交")
            logger.info("Git仓库初始化完成")
        else:
            logger.warning("Git初始化失败，跳过")
    else:
        logger.info("Git仓库已存在")

def run_tests():
    """运行测试"""
    logger.info("运行测试...")
    
    if os.path.exists("tests"):
        if run_command("python -m pytest tests/ -v", "运行测试"):
            logger.info("测试通过")
        else:
            logger.warning("测试失败")
    else:
        logger.info("没有测试文件，跳过测试")

def main():
    """主函数"""
    logger.info("开始安装智能升学助手项目...")
    
    # 检查Python版本
    if not check_python_version():
        sys.exit(1)
    
    # 创建目录
    create_directories()
    
    # 安装依赖
    if not install_dependencies():
        logger.error("依赖安装失败，请检查错误信息")
        sys.exit(1)
    
    # 创建配置文件
    create_config_files()
    
    # 初始化Git
    setup_git()
    
    # 运行测试
    run_tests()
    
    logger.info("项目安装完成！")
    logger.info("启动服务器: python -m http.server 8000")
    logger.info("访问地址: http://localhost:8000")

if __name__ == "__main__":
    main() 