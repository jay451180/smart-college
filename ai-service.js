// AI服务 - 外部LLM API调用
class AIService {
    constructor() {
        // 2Brain API配置
        this.apiUrl = 'https://portal.2brain.ai/api/bot/chat/v1/chat/completions';
        this.apiKey = '2B-Gkl2EqlkO1xHAwnRkRIjEmd129zAKUKXLhlj5nO516jtl5xhmx';
        
        // DeepSeek API配置
        this.deepseekApiUrl = 'https://api.deepseek.com/v1/chat/completions';
        this.deepseekApiKey = 'sk-f5b3cdb79e3d4df8b48a9fc27fdeaf4d';
        
        this.isAvailable = false;
        this.deepseekAvailable = false;
        this.conversationHistory = [];
        this.currentLanguage = 'zh-CN';
        this.streamMode = true;
        this.detailedMode = true;
        this.contextMode = true;
        
        this.init();
    }
    
    async init() {
        console.log('🤖 Initializing AI Service...');
        console.log('🔗 API URL:', this.apiUrl);
        console.log('🔑 API Key:', this.apiKey.substring(0, 15) + '...');
        
        // 禁用自动API测试，改为手动检查模式
        console.log('⚠️ 自动API测试已禁用，请手动点击"检查状态"按钮进行测试');
        this.isAvailable = false;
        this.updateAPIStatus('offline', '未测试');
        console.log('✅ AI Service initialized in manual mode');
    }
    
    // 检查API状态 - 2Brain优先，DeepSeek备用
    async checkAPIStatus() {
        console.log('⚠️ 注意：即将进行API测试请求');
        console.log('🔍 正在检查API状态...');
        this.updateAPIStatus('checking', '检查中...');
        
        // 同时检查两个API
        const [twoBrainAvailable, deepseekAvailable] = await Promise.all([
            this.checkTwoBrainAPI(),
            this.checkDeepSeekAPI()
        ]);
        
        // 更新总体状态
        if (twoBrainAvailable) {
            this.isAvailable = true;
            this.updateAPIStatus('online', '2Brain可用');
            console.log('✅ 主要API: 2Brain');
            if (deepseekAvailable) {
                console.log('✅ 备用API: DeepSeek');
            } else {
                console.log('❌ 备用API: DeepSeek不可用');
            }
        } else if (deepseekAvailable) {
            this.isAvailable = true;
            this.updateAPIStatus('online', 'DeepSeek可用');
            console.log('✅ 主要API: DeepSeek (2Brain不可用)');
        } else {
            this.isAvailable = false;
            this.updateAPIStatus('offline', 'API不可用');
            console.log('❌ 所有API都不可用');
        }
        
        return this.isAvailable;
    }
    
    // 检查2Brain API
    async checkTwoBrainAPI() {
        try {
            console.log('🔍 检查2Brain API...');
            const testPayload = {
                messages: [{ role: "user", content: "Hello" }],
                stream: false
            };
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(testPayload)
            });
            
            if (response.status === 200) {
                const data = await response.json();
                if (data.choices && data.choices[0]) {
                    console.log('✅ 2Brain API连接成功!');
                    return true;
                }
            }
            console.log('❌ 2Brain API连接失败:', response.status);
            return false;
        } catch (error) {
            console.error('❌ 2Brain API测试异常:', error);
            return false;
        }
    }
    
    // 检查DeepSeek API
    async checkDeepSeekAPI() {
        try {
            console.log('🔍 检查DeepSeek API...');
            const testPayload = {
                model: "deepseek-chat",
                messages: [{ role: "user", content: "Hello" }],
                stream: false
            };
            
            const response = await fetch(this.deepseekApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.deepseekApiKey}`
                },
                body: JSON.stringify(testPayload)
            });
            
            if (response.status === 200) {
                const data = await response.json();
                if (data.choices && data.choices[0]) {
                    console.log('✅ DeepSeek API连接成功!');
                    this.deepseekAvailable = true;
                    return true;
                }
            }
            console.log('❌ DeepSeek API连接失败:', response.status);
            this.deepseekAvailable = false;
            return false;
        } catch (error) {
            console.error('❌ DeepSeek API测试异常:', error);
            this.deepseekAvailable = false;
            return false;
        }
    }
    
    // 更新API状态显示
    updateAPIStatus(status, text) {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        const apiStatus = document.getElementById('apiStatus');
        
        if (statusDot && statusText) {
            statusDot.classList.remove('online', 'offline', 'checking');
            statusDot.classList.add(status);
            statusText.textContent = text;
        }
        
        if (apiStatus) {
            // 显示更详细的状态信息
            let detailedText = `API: ${text}`;
            if (this.deepseekAvailable) {
                detailedText += ' + DeepSeek备用';
            }
            apiStatus.textContent = detailedText;
        }
    }
    
    // 发送消息（支持流式输出）- 2Brain优先，DeepSeek备用
    async sendMessage(message, context = '', onChunk = null) {
        console.log('🚀 开始发送消息...');
        console.log('📝 用户消息:', message);
        
        if (!this.isAvailable) {
            console.log('⚠️ API标记为不可用，自动检查已禁用');
            throw new Error('AI服务不可用，请先手动点击"检查状态"按钮测试API连接');
        }
        
        // 构建消息历史
        const messages = this.buildMessageHistory(message, context);
        
        // 先尝试2Brain API
        try {
            console.log('🔍 尝试2Brain API...');
            return await this.sendToTwoBrain(messages, onChunk, message);
        } catch (error) {
            console.log('❌ 2Brain API失败，尝试DeepSeek API...', error.message);
            
            // 如果2Brain失败，尝试DeepSeek
            try {
                console.log('🔍 尝试DeepSeek API...');
                return await this.sendToDeepSeek(messages, onChunk, message);
            } catch (deepseekError) {
                console.error('❌ 所有API都失败了:', deepseekError);
                throw new Error('所有AI服务都不可用，请稍后重试');
            }
        }
    }
    
    // 发送到2Brain API
    async sendToTwoBrain(messages, onChunk, message) {
        const requestBody = {
            messages: messages,
            stream: this.streamMode
        };
        
        console.log('📤 发送请求到2Brain API:', {
            url: this.apiUrl,
            messageCount: messages.length,
            streamMode: this.streamMode
        });
        
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('📡 2Brain API响应状态:', response.status, response.statusText);
        
        if (response.status === 200) {
            if (this.streamMode) {
                console.log('⚡ 开始处理2Brain流式响应...');
                return await this.handleStreamResponse(response, onChunk, message);
            } else {
                console.log('📄 处理2Brain普通响应...');
                return await this.handleNormalResponse(response, message);
            }
        } else {
            const errorData = await response.json().catch(() => response.text());
            console.error('❌ 2Brain API错误:', response.status, errorData);
            throw new Error(`2Brain API错误 (${response.status}): ${JSON.stringify(errorData)}`);
        }
    }
    
    // 发送到DeepSeek API
    async sendToDeepSeek(messages, onChunk, message) {
        const requestBody = {
            model: "deepseek-chat",
            messages: messages,
            stream: this.streamMode
        };
        
        console.log('📤 发送请求到DeepSeek API:', {
            url: this.deepseekApiUrl,
            messageCount: messages.length,
            streamMode: this.streamMode
        });
        
        const response = await fetch(this.deepseekApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.deepseekApiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('📡 DeepSeek API响应状态:', response.status, response.statusText);
        
        if (response.status === 200) {
            if (this.streamMode) {
                console.log('⚡ 开始处理DeepSeek流式响应...');
                return await this.handleStreamResponse(response, onChunk, message);
            } else {
                console.log('📄 处理DeepSeek普通响应...');
                return await this.handleNormalResponse(response, message);
            }
        } else {
            const errorData = await response.json().catch(() => response.text());
            console.error('❌ DeepSeek API错误:', response.status, errorData);
            throw new Error(`DeepSeek API错误 (${response.status}): ${JSON.stringify(errorData)}`);
        }
    }
    
    // 处理流式响应 - 完全按照Python示例实现
    async handleStreamResponse(response, onChunk, message) {
        console.log('⚡ 开始处理2brain API流式响应 (对应Python iter_lines)...');
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');  // 对应Python的response.encoding = 'utf-8'
        let fullContent = '';
        let chunkCount = 0;
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    console.log(`✅ 2brain流式响应完成，共处理 ${chunkCount} 个数据块，总长度: ${fullContent.length}`);
                    break;
                }
                
                // 对应Python的chunk in response.iter_lines(decode_unicode=True)
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    // 对应Python的if chunk:
                    if (line.trim() === '') continue;
                    
                    console.log('📡 收到2brain数据行:', line.substring(0, 100) + (line.length > 100 ? '...' : ''));
                    
                    try {
                        // 直接解析JSON，对应Python的chunk.json()
                        const parsed = JSON.parse(line);
                        
                        // 对应Python的.get("choices")[0].get("delta").get("content")
                        const content = parsed.choices?.[0]?.delta?.content;
                        
                        if (content) {
                            fullContent += content;
                            chunkCount++;
                            
                            console.log(`📝 提取内容片段: "${content}" (总长度: ${fullContent.length})`);
                            
                            // 调用回调函数更新UI
                            if (onChunk) {
                                onChunk(content, fullContent);
                            }
                        } else {
                            console.log('⚪ 数据块无内容:', parsed);
                        }
                        
                    } catch (parseError) {
                        // 可能是data:前缀的SSE格式，尝试处理
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6).trim();
                            
                            if (data === '[DONE]') {
                                console.log('📡 收到2brain API结束标志');
                                break;
                            }
                            
                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices?.[0]?.delta?.content;
                                
                                if (content) {
                                    fullContent += content;
                                    chunkCount++;
                                    
                                    console.log(`📝 SSE格式提取内容: "${content}"`);
                                    
                                    if (onChunk) {
                                        onChunk(content, fullContent);
                                    }
                                }
                            } catch (sseParseError) {
                                console.warn('⚠️ SSE格式解析失败:', data.substring(0, 100));
                            }
                        } else {
                            console.warn('⚠️ 无法解析的数据行格式:', line.substring(0, 100));
                        }
                    }
                }
            }
            
            // 保存到对话历史
            this.addToHistory('user', message);
            this.addToHistory('assistant', fullContent);
            
            console.log('✅ 2brain API流式响应处理完成，最终回复:', fullContent.substring(0, 200) + '...');
            return fullContent;
            
        } catch (error) {
            console.error('❌ 2brain API流式响应处理失败:', error);
            throw new Error(`流式响应处理失败: ${error.message}`);
        } finally {
            reader.releaseLock();
        }
    }
    
    // 处理普通响应
    async handleNormalResponse(response, message) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        // 保存到对话历史
        this.addToHistory('user', message);
        this.addToHistory('assistant', content);
        
        return content;
    }
    
    // 构建消息历史
    buildMessageHistory(message, context) {
        const systemPrompt = this.buildSystemPrompt();
        const messages = [{ role: "system", content: systemPrompt }];
        
        // 添加对话历史（如果启用上下文模式）
        if (this.contextMode && this.conversationHistory.length > 0) {
            // 只保留最近的10轮对话以控制token数量
            const recentHistory = this.conversationHistory.slice(-10);
            messages.push(...recentHistory);
        }
        
        // 添加当前消息
        messages.push({ role: "user", content: message });
        
        return messages;
    }
    
    // 构建系统提示词
    buildSystemPrompt() {
        const language = this.currentLanguage === 'zh-CN' ? '中文' : 'English';
        const detail = this.detailedMode ? '详细' : '简洁';
        
        return `你是一个专业的AI升学顾问助手，专门帮助学生进行升学规划和大学申请指导。

角色设定：
- 你是经验丰富的升学规划专家
- 熟悉全球各大高校的申请要求和专业设置
- 能够提供个性化的学习建议和职业规划
- 回答要专业、准确、有建设性

回答要求：
- 使用${language}回答
- 回答风格：${detail}
- 使用Markdown格式，包含适当的标题、列表、强调等
- 对重要信息使用**粗体**强调
- 对关键建议使用> 引用格式
- 适当使用表情符号增加亲和力

专业领域：
- 大学专业选择和职业规划
- 申请材料准备和文书写作
- 标准化考试备考策略
- 奖学金申请指导
- 海外留学规划
- 学习方法和时间管理`;
    }
    
    // 添加到对话历史
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content });
        
        // 限制历史记录长度
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
    }
    
    // 清空对话历史
    clearHistory() {
        this.conversationHistory = [];
        console.log('🗑️ Conversation history cleared');
    }
    
    // 设置语言
    setLanguage(language) {
        this.currentLanguage = language;
        console.log('🌐 Language set to:', language);
    }
    
    // 设置模式
    setMode(detailed = true, context = true, stream = true) {
        this.detailedMode = detailed;
        this.contextMode = context;
        this.streamMode = stream;
        console.log('⚙️ AI mode updated:', { detailed, context, stream });
    }
    
    // 获取当前状态
    getStatus() {
        return {
            isAvailable: this.isAvailable,
            language: this.currentLanguage,
            detailedMode: this.detailedMode,
            contextMode: this.contextMode,
            streamMode: this.streamMode,
            historyLength: this.conversationHistory.length
        };
    }
}

// Markdown渲染工具
class MarkdownRenderer {
    constructor() {
        this.initializeMarked();
    }
    
    initializeMarked() {
        if (typeof marked !== 'undefined') {
            // 配置marked选项
            marked.setOptions({
                highlight: function(code, lang) {
                    if (typeof Prism !== 'undefined' && lang && Prism.languages[lang]) {
                        return Prism.highlight(code, Prism.languages[lang], lang);
                    }
                    return code;
                },
                breaks: true,
                gfm: true,
                sanitize: false
            });
            console.log('📝 Markdown renderer initialized');
        } else {
            console.warn('⚠️ Marked library not loaded');
        }
    }
    
    // 渲染Markdown内容
    render(content) {
        if (typeof marked === 'undefined') {
            console.warn('Marked library not available, returning formatted text');
            return this.formatPlainText(content);
        }
        
        try {
            // 预处理特殊标记
            content = this.preprocessContent(content);
            
            // 使用marked解析
            let html = marked.parse(content);
            
            // 后处理特殊样式
            html = this.postprocessContent(html);
            
            return html;
        } catch (error) {
            console.error('❌ Markdown rendering error:', error);
            return this.formatPlainText(content);
        }
    }
    
    // 预处理内容
    preprocessContent(content) {
        // 处理特殊标记
        content = content.replace(/==(.*?)==/g, '<mark>$1</mark>');
        content = content.replace(/::(.*?)::/g, '<span class="success">✅ $1</span>');
        content = content.replace(/!!(.*?)!!/g, '<span class="warning">⚠️ $1</span>');
        content = content.replace(/\?\?(.*?)\?\?/g, '<span class="error">❌ $1</span>');
        content = content.replace(/@@(.*?)@@/g, '<span class="info">ℹ️ $1</span>');
        
        return content;
    }
    
    // 后处理内容
    postprocessContent(html) {
        // 为表格添加响应式包装
        html = html.replace(/<table>/g, '<div class="table-wrapper"><table class="markdown-table">');
        html = html.replace(/<\/table>/g, '</table></div>');
        
        // 为代码块添加复制按钮
        html = html.replace(/<pre><code(.*?)>([\s\S]*?)<\/code><\/pre>/g, (match, attrs, code) => {
            const copyId = 'copy-' + Math.random().toString(36).substr(2, 9);
            return `<div class="code-block-wrapper">
                <div class="code-block-header">
                    <button class="copy-code-btn" onclick="copyCode('${copyId}')" title="复制代码">
                        📋 复制
                    </button>
                </div>
                <pre><code${attrs} id="${copyId}">${code}</code></pre>
            </div>`;
        });
        
        return html;
    }
    
    // 格式化纯文本
    formatPlainText(content) {
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }
    
    // 检测是否包含Markdown
    containsMarkdown(content) {
        const patterns = [
            /#{1,6}\s/,           // 标题
            /\*\*.*?\*\*/,        // 粗体
            /\*.*?\*/,            // 斜体
            /`.*?`/,              // 行内代码
            /```[\s\S]*?```/,     // 代码块
            /^\s*[-\*\+]\s/m,     // 无序列表
            /^\s*\d+\.\s/m,       // 有序列表
            /^\s*>/m,             // 引用
            /\[.*?\]\(.*?\)/,     // 链接
            /\|.*?\|/             // 表格
        ];
        
        return patterns.some(pattern => pattern.test(content));
    }
}

// 复制代码功能
function copyCode(elementId) {
    const codeElement = document.getElementById(elementId);
    if (codeElement) {
        const text = codeElement.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // 临时显示复制成功提示
            const btn = codeElement.parentElement.parentElement.querySelector('.copy-code-btn');
            const originalText = btn.textContent;
            btn.textContent = '✅ 已复制';
            btn.style.background = '#059669';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('复制失败:', err);
            if (window.showNotificationMessage) {
                window.showNotificationMessage('复制失败，请手动复制', 'error');
            }
        });
    }
}

// 流式消息处理器
class StreamMessageHandler {
    constructor(messageElement) {
        this.messageElement = messageElement;
        this.contentElement = messageElement.querySelector('.message-text');
        this.fullContent = '';
        this.markdownRenderer = new MarkdownRenderer();
    }
    
    // 添加内容块
    addChunk(chunk) {
        this.fullContent += chunk;
        this.updateDisplay();
    }
    
    // 更新显示
    updateDisplay() {
        if (this.contentElement) {
            // 检查是否包含Markdown
            if (this.markdownRenderer.containsMarkdown(this.fullContent)) {
                this.contentElement.innerHTML = this.markdownRenderer.render(this.fullContent) + '<span class="streaming-cursor">|</span>';
            } else {
                this.contentElement.innerHTML = this.fullContent.replace(/\n/g, '<br>') + '<span class="streaming-cursor">|</span>';
            }
            
            // 启用代码高亮
            if (typeof Prism !== 'undefined') {
                Prism.highlightAllUnder(this.contentElement);
            }
            
            // 滚动到底部
            this.scrollToBottom();
        }
    }
    
    // 完成流式输出
    finish() {
        if (this.contentElement) {
            // 移除光标
            const cursor = this.contentElement.querySelector('.streaming-cursor');
            if (cursor) {
                cursor.remove();
            }
            
            // 最终渲染
            if (this.markdownRenderer.containsMarkdown(this.fullContent)) {
                this.contentElement.innerHTML = this.markdownRenderer.render(this.fullContent);
            } else {
                this.contentElement.innerHTML = this.fullContent.replace(/\n/g, '<br>');
            }
            
            // 启用代码高亮
            if (typeof Prism !== 'undefined') {
                Prism.highlightAllUnder(this.contentElement);
            }
        }
        
        console.log('✅ Stream message completed');
    }
    
    // 滚动到底部
    scrollToBottom() {
        const chatContainer = document.getElementById('chatMessages');
        if (chatContainer) {
            setTimeout(() => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 50);
        }
    }
}

// 将类暴露到全局
window.AIService = AIService;
window.MarkdownRenderer = MarkdownRenderer;
window.StreamMessageHandler = StreamMessageHandler;
window.copyCode = copyCode;

console.log('🤖 AI Service module loaded successfully');
