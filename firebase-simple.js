// 简化的Firebase初始化脚本
// 解决CSP和认证问题

// Firebase配置
const firebaseConfig = {
    apiKey: "AIzaSyAPjCKi9CWvivVVxANhugEz6AY3lpRBVec",
    authDomain: "smart-college-cf2b1.firebaseapp.com",
    projectId: "smart-college-cf2b1",
    storageBucket: "smart-college-cf2b1.firebasestorage.app",
    messagingSenderId: "445324851190",
    appId: "1:445324851190:web:35ab87f493ec126265f9d7",
    measurementId: "G-B5E2CB2L66"
};

// 等待Firebase SDK加载完成
function waitForFirebase() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 100; // 20秒超时
        
        const checkFirebase = () => {
            attempts++;
            
            if (typeof firebase !== 'undefined' && firebase.apps) {
                console.log('✅ Firebase SDK loaded successfully');
                resolve();
            } else if (attempts >= maxAttempts) {
                console.error('❌ Firebase SDK loading timeout');
                reject(new Error('Firebase SDK loading timeout'));
            } else {
                setTimeout(checkFirebase, 200);
            }
        };
        
        checkFirebase();
    });
}

// 初始化Firebase应用
async function initializeFirebaseApp() {
    try {
        await waitForFirebase();
        
        // 检查是否已经初始化
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
            console.log('🔥 Firebase app initialized');
        } else {
            console.log('🔥 Firebase app already initialized');
        }
        
        // 验证服务是否可用
        if (!firebase.auth) {
            throw new Error('Firebase Auth service not available');
        }
        
        if (!firebase.firestore) {
            throw new Error('Firebase Firestore service not available');
        }
        
        console.log('✅ All Firebase services available');
        return true;
        
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        return false;
    }
}

// 改进的Google登录函数
async function improvedGoogleSignIn() {
    try {
        console.log('🔐 Starting improved Google sign-in...');
        
        // 确保Firebase已初始化
        const isInitialized = await initializeFirebaseApp();
        if (!isInitialized) {
            throw new Error('Firebase initialization failed');
        }
        
        // 创建Google Auth Provider
        const provider = new firebase.auth.GoogleAuthProvider();
        
        // 配置提供商参数
        provider.setCustomParameters({
            prompt: 'select_account',
            hd: undefined // 允许任何域名
        });
        
        // 添加所需的权限范围
        provider.addScope('email');
        provider.addScope('profile');
        
        console.log('🔐 Opening Google sign-in popup...');
        
        // 使用signInWithPopup进行登录
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        const credential = firebase.auth.GoogleAuthProvider.credentialFromResult(result);
        
        console.log('✅ Google sign-in successful:', {
            email: user.email,
            displayName: user.displayName,
            uid: user.uid,
            emailVerified: user.emailVerified
        });
        
        // 保存用户信息到Firestore
        await saveUserToFirestore(user, true, { method: 'google' });
        
        // 更新UI
        updateUserAvatar(user);
        showNotificationMessage(`欢迎，${user.displayName || user.email}！`, 'success');
        
        // 跳转到下一个界面
        showCareer();
        
        return user;
        
    } catch (error) {
        console.error('❌ Google sign-in failed:', error);
        
        let errorMessage = '谷歌登录失败，请重试';
        
        // 根据错误类型提供具体的解决建议
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = '登录窗口被用户关闭，请重新尝试';
                break;
            case 'auth/popup-blocked':
                errorMessage = '浏览器阻止了登录弹窗，请允许弹窗后重试';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = '登录请求被取消，请重新尝试';
                break;
            case 'auth/network-request-failed':
                errorMessage = '网络请求失败，请检查网络连接';
                break;
            case 'auth/internal-error':
                errorMessage = 'Firebase服务内部错误，请刷新页面后重试';
                break;
            case 'auth/unauthorized-domain':
                errorMessage = '当前域名未授权，请联系管理员配置';
                break;
            default:
                if (error.message.includes('CSP')) {
                    errorMessage = '安全策略限制，正在尝试修复...';
                } else if (error.message.includes('script')) {
                    errorMessage = 'Google API加载失败，请刷新页面重试';
                }
        }
        
        showNotificationMessage(errorMessage, 'error');
        
        // 如果是CSP错误，提供修复建议
        if (error.message.includes('CSP') || error.message.includes('script')) {
            setTimeout(() => {
                showNotificationMessage('建议：刷新页面或使用邮箱密码登录', 'info');
            }, 2000);
        }
        
        throw error;
    }
}

// 将改进的函数绑定到全局
window.improvedGoogleSignIn = improvedGoogleSignIn;

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📋 Initializing Firebase services...');
    
    try {
        const isInitialized = await initializeFirebaseApp();
        
        if (isInitialized) {
            console.log('🎉 Firebase services ready for use');
            
            // 监听认证状态变化
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    console.log('👤 User signed in:', user.email);
                    // 等待主应用加载完成后再更新UI
                    setTimeout(() => {
                        if (window.updateUserAvatar) {
                            window.updateUserAvatar(user);
                        }
                    }, 1000);
                } else {
                    console.log('👤 User signed out');
                    setTimeout(() => {
                        if (window.updateUserAvatar) {
                            window.updateUserAvatar(null);
                        }
                    }, 1000);
                }
            });
            
        } else {
            console.warn('⚠️ Firebase initialization failed, some features may not work');
            // 等待主应用加载完成后显示消息
            setTimeout(() => {
                if (window.showNotificationMessage) {
                    window.showNotificationMessage('Firebase服务初始化失败，部分功能可能无法使用', 'warning');
                }
            }, 2000);
        }
        
    } catch (error) {
        console.error('Firebase initialization error:', error);
        setTimeout(() => {
            if (window.showNotificationMessage) {
                window.showNotificationMessage('Firebase服务不可用，将使用基础功能', 'error');
            }
        }, 2000);
    }
});

console.log('📄 Firebase Simple module loaded');
