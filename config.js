/**
 * Smart College Advisor Configuration
 * 智能升学顾问配置文件
 */

window.CONFIG = {
    // 应用基本信息
    app: {
        name: 'Smart College Advisor',
        version: '1.1.0',
        description: 'AI-Powered University Application Platform',
        author: 'Smart College Team',
        website: 'https://smart-college-advisor.com'
    },

    // API配置
    api: {
        // 2brain AI API配置
        aiService: {
            baseUrl: 'https://api.2brain.ai/v1',
            model: 'gpt-4',
            maxTokens: 2000,
            temperature: 0.7,
            timeout: 30000
        },
        
        // 其他API配置
        endpoints: {
            chat: '/chat/completions',
            embeddings: '/embeddings',
            models: '/models'
        }
    },

    // Firebase配置
    firebase: {
        enabled: true,
        config: {
            apiKey: "AIzaSyAPjCKi9CWvivVVxANhugEz6AY3lpRBVec",
            authDomain: "smart-college-cf2b1.firebaseapp.com",
            projectId: "smart-college-cf2b1",
            storageBucket: "smart-college-cf2b1.firebasestorage.app",
            messagingSenderId: "445324851190",
            appId: "1:445324851190:web:35ab87f493ec126265f9d7",
            measurementId: "G-B5E2CB2L66"
        },
        services: {
            auth: true,
            firestore: true,
            storage: true,
            analytics: true
        }
    },

    // 用户界面配置
    ui: {
        theme: 'modern',
        animations: true,
        language: 'zh-CN',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '24h'
    },

    // 功能开关
    features: {
        aiConsultation: true,
        questionBank: true,
        userAuth: true,
        googleLogin: true,
        guestMode: true,
        donations: true,
        analytics: false,
        notifications: true
    },

    // 教育体系配置
    educationSystems: {
        gaokao: {
            name: '中国高考',
            description: '中国普通高等学校招生全国统一考试',
            subjects: ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理'],
            enabled: true
        },
        ib: {
            name: 'IB国际文凭',
            description: 'International Baccalaureate',
            subjects: ['Mathematics', 'Sciences', 'Languages', 'Arts', 'Social Studies'],
            enabled: true
        },
        alevel: {
            name: 'A-Level',
            description: 'Advanced Level Qualifications',
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics'],
            enabled: true
        },
        ap: {
            name: 'AP课程',
            description: 'Advanced Placement',
            subjects: ['Calculus', 'Physics', 'Chemistry', 'Biology', 'History'],
            enabled: true
        },
        sat: {
            name: 'SAT考试',
            description: 'Scholastic Assessment Test',
            subjects: ['Math', 'Reading', 'Writing'],
            enabled: true
        }
    },

    // Stripe支付配置
    stripe: {
        enabled: true,
        publicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_YOUR_STRIPE_PUBLIC_KEY_HERE',
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY_HERE',
        currency: 'usd',
        donationAmounts: [5, 10, 25, 50, 100],
        defaultAmount: 25,
        // 产品信息
        productName: 'Smart College Advisor 捐赠',
        productDescription: '支持智能升学顾问项目的发展'
    },

    // 日志配置
    logging: {
        enabled: true,
        level: 'info', // debug, info, warn, error
        maxEntries: 1000,
        storage: 'localStorage'
    },

    // 缓存配置
    cache: {
        enabled: true,
        ttl: 3600000, // 1 hour in milliseconds
        maxSize: 100 // maximum number of cached items
    },

    // 安全配置
    security: {
        sessionTimeout: 7200000, // 2 hours in milliseconds
        maxLoginAttempts: 5,
        lockoutDuration: 900000, // 15 minutes in milliseconds
        csrfProtection: true
    },

    // 性能配置
    performance: {
        lazyLoading: true,
        imageOptimization: true,
        caching: true,
        compression: true
    },

    // 开发配置
    development: {
        debug: false,
        mockData: false,
        apiDelay: 0,
        showPerformanceMetrics: false
    }
};

// 环境特定配置
if (typeof window !== 'undefined') {
    // 浏览器环境
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // 开发环境
        window.CONFIG.development.debug = true;
        window.CONFIG.logging.level = 'debug';
        window.CONFIG.stripe.enabled = true; // 演示模式
    }
}

// 导出配置（用于Node.js环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.CONFIG;
}

console.log('✅ Smart College Advisor configuration loaded successfully');
