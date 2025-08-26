/**
 * Firebase 初始化修复脚本
 * 解决Firebase初始化失败的问题
 */

(function() {
    'use strict';
    
    console.log('🔥 Firebase初始化修复脚本开始执行...');
    
    // 检查Firebase配置
    function validateFirebaseConfig() {
        console.log('📋 验证Firebase配置...');
        
        if (!window.CONFIG) {
            throw new Error('CONFIG对象未找到，请检查config.js是否正确加载');
        }
        
        if (!window.CONFIG.firebase) {
            throw new Error('Firebase配置未找到');
        }
        
        if (!window.CONFIG.firebase.enabled) {
            throw new Error('Firebase在配置中被禁用');
        }
        
        const config = window.CONFIG.firebase.config;
        const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
        const missingKeys = requiredKeys.filter(key => !config[key]);
        
        if (missingKeys.length > 0) {
            throw new Error(`Firebase配置缺少必需的键: ${missingKeys.join(', ')}`);
        }
        
        console.log('✅ Firebase配置验证通过');
        return config;
    }
    
    // 等待Firebase SDK加载
    function waitForFirebaseSDK() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 100;
            
            console.log('⏳ 等待Firebase SDK加载...');
            
            function checkFirebase() {
                attempts++;
                
                if (typeof firebase !== 'undefined') {
                    console.log(`✅ Firebase SDK已加载 (尝试 ${attempts})`);
                    resolve();
                    return;
                }
                
                if (attempts >= maxAttempts) {
                    // 检查脚本标签
                    const scripts = document.querySelectorAll('script[src*="firebase"]');
                    console.error(`❌ Firebase SDK加载失败 (${maxAttempts}次尝试)`);
                    console.error(`发现${scripts.length}个Firebase脚本标签:`);
                    scripts.forEach((script, i) => {
                        console.error(`  ${i+1}. ${script.src} (状态: ${script.readyState || '未知'})`);
                    });
                    reject(new Error('Firebase SDK加载超时'));
                    return;
                }
                
                if (attempts % 10 === 0) {
                    console.log(`⏳ 仍在等待Firebase SDK... (尝试 ${attempts}/${maxAttempts})`);
                }
                
                setTimeout(checkFirebase, 100);
            }
            
            checkFirebase();
        });
    }
    
    // 检查Firebase服务可用性
    function checkFirebaseServices() {
        console.log('🔧 检查Firebase服务可用性...');
        
        const requiredServices = ['auth', 'firestore', 'storage', 'analytics'];
        const availableServices = [];
        const missingServices = [];
        
        requiredServices.forEach(service => {
            if (firebase[service]) {
                availableServices.push(service);
            } else {
                missingServices.push(service);
            }
        });
        
        console.log('✅ 可用的Firebase服务:', availableServices);
        if (missingServices.length > 0) {
            console.warn('⚠️ 缺失的Firebase服务:', missingServices);
        }
        
        if (availableServices.length === 0) {
            throw new Error('没有可用的Firebase服务');
        }
        
        return { availableServices, missingServices };
    }
    
    // 修复后的Firebase初始化
    async function initializeFirebaseFixed() {
        try {
            console.log('🚀 开始修复后的Firebase初始化...');
            
            // 1. 验证配置
            const config = validateFirebaseConfig();
            
            // 2. 等待SDK加载
            await waitForFirebaseSDK();
            
            // 3. 检查服务
            const services = checkFirebaseServices();
            
            // 4. 初始化Firebase应用
            let app;
            if (firebase.apps.length > 0) {
                console.log('📱 使用现有Firebase应用');
                app = firebase.app();
            } else {
                console.log('📱 创建新Firebase应用');
                app = firebase.initializeApp(config);
            }
            
            // 5. 初始化认证服务
            const auth = firebase.auth();
            console.log('🔐 Firebase Auth初始化成功');
            
            // 6. 测试认证连接
            console.log('🔗 测试Firebase连接...');
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Firebase连接测试超时'));
                }, 10000);
                
                const unsubscribe = auth.onAuthStateChanged(
                    (user) => {
                        clearTimeout(timeout);
                        console.log('✅ Firebase连接测试成功');
                        unsubscribe();
                        resolve();
                    },
                    (error) => {
                        clearTimeout(timeout);
                        console.error('❌ Firebase连接测试失败:', error);
                        unsubscribe();
                        reject(error);
                    }
                );
            });
            
            // 7. 创建Firebase服务实例
            if (!window.firebaseService) {
                console.log('🏗️ 创建Firebase服务实例...');
                window.firebaseService = new window.FirebaseService();
                
                // 手动设置为已初始化状态
                window.firebaseService.isInitialized = true;
                window.firebaseService.app = app;
                window.firebaseService.auth = auth;
                
                if (services.availableServices.includes('firestore')) {
                    window.firebaseService.db = firebase.firestore();
                }
                if (services.availableServices.includes('storage')) {
                    window.firebaseService.storage = firebase.storage();
                }
                if (services.availableServices.includes('analytics')) {
                    try {
                        window.firebaseService.analytics = firebase.analytics();
                    } catch (e) {
                        console.warn('⚠️ Analytics初始化失败，可能在localhost环境:', e.message);
                    }
                }
            }
            
            // 8. 触发成功事件
            console.log('🎉 Firebase修复初始化完成！');
            window.dispatchEvent(new CustomEvent('firebaseInitialized', {
                detail: { service: window.firebaseService }
            }));
            
            // 9. 显示成功消息
            if (window.showNotificationMessage) {
                window.showNotificationMessage('Firebase服务初始化成功！', 'success');
            }
            
            return window.firebaseService;
            
        } catch (error) {
            console.error('❌ Firebase修复初始化失败:', error);
            
            // 触发错误事件
            window.dispatchEvent(new CustomEvent('firebaseInitializationError', {
                detail: { error: error.message }
            }));
            
            // 显示错误消息
            if (window.showNotificationMessage) {
                window.showNotificationMessage(`Firebase初始化失败: ${error.message}`, 'error');
            }
            
            throw error;
        }
    }
    
    // 自动修复Firebase初始化
    function autoFixFirebase() {
        console.log('🔧 开始自动修复Firebase初始化...');
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initializeFirebaseFixed, 1000);
            });
        } else {
            setTimeout(initializeFirebaseFixed, 1000);
        }
    }
    
    // 导出修复函数供手动调用
    window.fixFirebaseInitialization = initializeFirebaseFixed;
    window.validateFirebaseConfig = validateFirebaseConfig;
    window.waitForFirebaseSDK = waitForFirebaseSDK;
    
    // 自动开始修复
    autoFixFirebase();
    
    console.log('✅ Firebase修复脚本加载完成');
    
})();
