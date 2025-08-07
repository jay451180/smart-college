/**
 * 智能升学助手 - 日志记录模块
 * 提供统一的日志记录功能，支持不同级别的日志输出
 * 
 * @author 智能升学助手开发团队
 * @version 1.0.0
 * @date 2024-08-07
 */

class Logger {
    constructor() {
        this.logLevel = this.getLogLevel();
        this.logContainer = null;
        this.initLogContainer();
    }

    /**
     * 获取日志级别
     * @returns {string} 日志级别
     */
    getLogLevel() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('log') || 'info';
    }

    /**
     * 初始化日志容器
     */
    initLogContainer() {
        // 创建日志容器
        this.logContainer = document.createElement('div');
        this.logContainer.id = 'log-container';
        this.logContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            max-height: 200px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-family: monospace;
            font-size: 12px;
            padding: 10px;
            border-radius: 8px;
            overflow-y: auto;
            z-index: 10000;
            display: none;
        `;
        
        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => this.hideLogs();
        
        this.logContainer.appendChild(closeBtn);
        document.body.appendChild(this.logContainer);

        // 添加显示日志的快捷键 (Ctrl+Shift+L)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.toggleLogs();
            }
        });
    }

    /**
     * 记录调试信息
     * @param {string} message 日志消息
     * @param {any} data 附加数据
     */
    debug(message, data = null) {
        this.log('debug', message, data);
    }

    /**
     * 记录一般信息
     * @param {string} message 日志消息
     * @param {any} data 附加数据
     */
    info(message, data = null) {
        this.log('info', message, data);
    }

    /**
     * 记录警告信息
     * @param {string} message 日志消息
     * @param {any} data 附加数据
     */
    warn(message, data = null) {
        this.log('warn', message, data);
    }

    /**
     * 记录错误信息
     * @param {string} message 日志消息
     * @param {any} data 附加数据
     */
    error(message, data = null) {
        this.log('error', message, data);
    }

    /**
     * 记录API调用
     * @param {string} endpoint API端点
     * @param {object} request 请求数据
     * @param {object} response 响应数据
     * @param {number} duration 调用时长
     */
    api(endpoint, request, response, duration) {
        const message = `API调用: ${endpoint} (${duration}ms)`;
        const data = { endpoint, request, response, duration };
        this.log('api', message, data);
    }

    /**
     * 记录用户行为
     * @param {string} action 用户行为
     * @param {object} data 相关数据
     */
    user(action, data = null) {
        const message = `用户行为: ${action}`;
        this.log('user', message, data);
    }

    /**
     * 核心日志记录方法
     * @param {string} level 日志级别
     * @param {string} message 日志消息
     * @param {any} data 附加数据
     */
    log(level, message, data = null) {
        const levels = {
            'debug': 0,
            'info': 1,
            'warn': 2,
            'error': 3,
            'api': 1,
            'user': 1
        };

        // 检查日志级别
        if (levels[level] < levels[this.logLevel]) {
            return;
        }

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            level,
            message,
            data
        };

        // 控制台输出
        this.consoleLog(level, message, data);

        // 添加到日志容器
        this.addToContainer(logEntry);

        // 保存到本地存储
        this.saveToStorage(logEntry);
    }

    /**
     * 控制台日志输出
     * @param {string} level 日志级别
     * @param {string} message 日志消息
     * @param {any} data 附加数据
     */
    consoleLog(level, message, data) {
        const prefix = `[${level.toUpperCase()}]`;
        
        switch (level) {
            case 'debug':
                console.debug(prefix, message, data);
                break;
            case 'info':
                console.info(prefix, message, data);
                break;
            case 'warn':
                console.warn(prefix, message, data);
                break;
            case 'error':
                console.error(prefix, message, data);
                break;
            case 'api':
                console.log(prefix, message, data);
                break;
            case 'user':
                console.log(prefix, message, data);
                break;
            default:
                console.log(prefix, message, data);
        }
    }

    /**
     * 添加日志到容器
     * @param {object} logEntry 日志条目
     */
    addToContainer(logEntry) {
        if (!this.logContainer) return;

        const logElement = document.createElement('div');
        logElement.style.cssText = `
            margin-bottom: 5px;
            padding: 2px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const levelColors = {
            'debug': '#888',
            'info': '#4CAF50',
            'warn': '#FF9800',
            'error': '#F44336',
            'api': '#2196F3',
            'user': '#9C27B0'
        };

        logElement.innerHTML = `
            <span style="color: ${levelColors[logEntry.level] || '#fff'}">[${logEntry.level.toUpperCase()}]</span>
            <span style="color: #ccc">${logEntry.timestamp}</span>
            <span style="color: #fff">${logEntry.message}</span>
        `;

        this.logContainer.appendChild(logElement);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;

        // 限制日志条目数量
        while (this.logContainer.children.length > 50) {
            this.logContainer.removeChild(this.logContainer.children[1]);
        }
    }

    /**
     * 保存日志到本地存储
     * @param {object} logEntry 日志条目
     */
    saveToStorage(logEntry) {
        try {
            const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
            logs.push(logEntry);
            
            // 只保留最近1000条日志
            if (logs.length > 1000) {
                logs.splice(0, logs.length - 1000);
            }
            
            localStorage.setItem('app_logs', JSON.stringify(logs));
        } catch (error) {
            console.error('保存日志失败:', error);
        }
    }

    /**
     * 显示日志容器
     */
    showLogs() {
        if (this.logContainer) {
            this.logContainer.style.display = 'block';
        }
    }

    /**
     * 隐藏日志容器
     */
    hideLogs() {
        if (this.logContainer) {
            this.logContainer.style.display = 'none';
        }
    }

    /**
     * 切换日志显示状态
     */
    toggleLogs() {
        if (this.logContainer.style.display === 'block') {
            this.hideLogs();
        } else {
            this.showLogs();
        }
    }

    /**
     * 清空日志
     */
    clearLogs() {
        if (this.logContainer) {
            this.logContainer.innerHTML = '';
        }
        localStorage.removeItem('app_logs');
    }

    /**
     * 导出日志
     */
    exportLogs() {
        try {
            const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
            const dataStr = JSON.stringify(logs, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `logs_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
            link.click();
        } catch (error) {
            console.error('导出日志失败:', error);
        }
    }

    /**
     * 获取日志统计信息
     * @returns {object} 统计信息
     */
    getStats() {
        try {
            const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
            const stats = {
                total: logs.length,
                byLevel: {},
                byHour: {},
                errors: logs.filter(log => log.level === 'error').length,
                apiCalls: logs.filter(log => log.level === 'api').length
            };

            logs.forEach(log => {
                // 按级别统计
                stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
                
                // 按小时统计
                const hour = new Date(log.timestamp).getHours();
                stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
            });

            return stats;
        } catch (error) {
            console.error('获取日志统计失败:', error);
            return {};
        }
    }
}

// 创建全局日志实例
window.logger = new Logger();

// 导出Logger类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
} 