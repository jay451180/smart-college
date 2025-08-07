#!/usr/bin/env python3
"""
智能升学助手 - 基础测试
测试项目的基本功能和配置

@author 智能升学助手开发团队
@version 1.0.0
@date 2024-08-07
"""

import unittest
import os
import sys
import json
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

class TestProjectStructure(unittest.TestCase):
    """测试项目结构"""
    
    def test_required_files_exist(self):
        """测试必需文件是否存在"""
        required_files = [
            'index.html',
            'README.md',
            'requirements.txt',
            '.gitignore',
            '.cursorrules'
        ]
        
        for file_path in required_files:
            with self.subTest(file=file_path):
                self.assertTrue(
                    os.path.exists(file_path),
                    f"必需文件 {file_path} 不存在"
                )
    
    def test_required_directories_exist(self):
        """测试必需目录是否存在"""
        required_dirs = [
            'assets',
            'assets/js',
            'tests'
        ]
        
        for dir_path in required_dirs:
            with self.subTest(directory=dir_path):
                self.assertTrue(
                    os.path.exists(dir_path),
                    f"必需目录 {dir_path} 不存在"
                )
    
    def test_logger_file_exists(self):
        """测试日志模块文件是否存在"""
        logger_path = 'assets/js/logger.js'
        self.assertTrue(
            os.path.exists(logger_path),
            f"日志模块文件 {logger_path} 不存在"
        )

class TestHTMLContent(unittest.TestCase):
    """测试HTML内容"""
    
    def setUp(self):
        """设置测试环境"""
        with open('index.html', 'r', encoding='utf-8') as f:
            self.html_content = f.read()
    
    def test_html_has_required_elements(self):
        """测试HTML是否包含必需元素"""
        required_elements = [
            '<title>',
            '<meta charset="UTF-8">',
            '<meta name="viewport"',
            '智能升学助手',
            'API Key',
            'chat-container'
        ]
        
        for element in required_elements:
            with self.subTest(element=element):
                self.assertIn(
                    element,
                    self.html_content,
                    f"HTML中缺少必需元素: {element}"
                )
    
    def test_script_references(self):
        """测试脚本引用"""
        self.assertIn(
            'assets/js/logger.js',
            self.html_content,
            "HTML中缺少日志模块引用"
        )

class TestConfiguration(unittest.TestCase):
    """测试配置文件"""
    
    def test_requirements_format(self):
        """测试requirements.txt格式"""
        with open('requirements.txt', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否包含注释
        self.assertIn('#', content, "requirements.txt应该包含注释")
        
        # 检查是否包含依赖
        lines = [line.strip() for line in content.split('\n') if line.strip() and not line.startswith('#')]
        self.assertGreater(len(lines), 0, "requirements.txt应该包含依赖项")
    
    def test_gitignore_content(self):
        """测试.gitignore内容"""
        with open('.gitignore', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否包含常见的忽略项
        common_ignores = [
            '.DS_Store',
            '__pycache__',
            '*.log',
            '.env'
        ]
        
        for ignore_item in common_ignores:
            with self.subTest(item=ignore_item):
                self.assertIn(
                    ignore_item,
                    content,
                    f".gitignore中缺少常见忽略项: {ignore_item}"
                )

class TestLoggerModule(unittest.TestCase):
    """测试日志模块"""
    
    def setUp(self):
        """设置测试环境"""
        with open('assets/js/logger.js', 'r', encoding='utf-8') as f:
            self.logger_content = f.read()
    
    def test_logger_has_required_methods(self):
        """测试日志模块是否包含必需方法"""
        required_methods = [
            'debug',
            'info',
            'warn',
            'error',
            'api',
            'user'
        ]
        
        for method in required_methods:
            with self.subTest(method=method):
                self.assertIn(
                    f'{method}(message, data = null)',
                    self.logger_content,
                    f"日志模块缺少方法: {method}"
                )
    
    def test_logger_has_class_definition(self):
        """测试日志模块是否包含类定义"""
        self.assertIn(
            'class Logger',
            self.logger_content,
            "日志模块缺少Logger类定义"
        )

class TestDocumentation(unittest.TestCase):
    """测试文档"""
    
    def test_readme_content(self):
        """测试README内容"""
        with open('README.md', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否包含必需章节
        required_sections = [
            '# 🌟 智能升学助手',
            '## 🚀 功能特色',
            '## 📋 使用指南',
            '## 🔧 本地部署'
        ]
        
        for section in required_sections:
            with self.subTest(section=section):
                self.assertIn(
                    section,
                    content,
                    f"README中缺少必需章节: {section}"
                )

def run_tests():
    """运行所有测试"""
    # 创建测试套件
    test_suite = unittest.TestSuite()
    
    # 添加测试类
    test_classes = [
        TestProjectStructure,
        TestHTMLContent,
        TestConfiguration,
        TestLoggerModule,
        TestDocumentation
    ]
    
    for test_class in test_classes:
        tests = unittest.TestLoader().loadTestsFromTestCase(test_class)
        test_suite.addTests(tests)
    
    # 运行测试
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)
    
    return result.wasSuccessful()

if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1) 