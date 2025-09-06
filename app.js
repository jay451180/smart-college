// Firebase 配置
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendEmailVerification
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    increment, 
    serverTimestamp,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Firebase 配置信息
const firebaseConfig = {
    apiKey: "AIzaSyAPjCKi9CWvivVVxANhugEz6AY3lpRBVec",
    authDomain: "smart-college-cf2b1.firebaseapp.com",
    projectId: "smart-college-cf2b1",
    storageBucket: "smart-college-cf2b1.firebasestorage.app",
    messagingSenderId: "445324851190",
    appId: "1:445324851190:web:35ab87f493ec126265f9d7",
    measurementId: "G-B5E2CB2L66"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// DOM 元素引用
const authPage = document.getElementById('auth-page');
const dashboard = document.getElementById('dashboard');
const googleLoginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// 认证表单元素
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const emailAuthForm = document.getElementById('email-auth-form');
const emailAuthBtn = document.getElementById('email-auth-btn');
const registerFields = document.getElementById('register-fields');
const confirmPasswordField = document.getElementById('confirm-password-field');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');

// 表单输入元素
const displayNameInput = document.getElementById('display-name');
const emailInput = document.getElementById('email-address');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// 仪表板元素
const dashboardName = document.getElementById('dashboard-name');
const dashboardEmail = document.getElementById('dashboard-email');
const dashboardUid = document.getElementById('dashboard-uid');
const dashboardCreated = document.getElementById('dashboard-created');
const dashboardLastLogin = document.getElementById('dashboard-last-login');
const dashboardLoginCount = document.getElementById('dashboard-login-count');
const recentActivities = document.getElementById('recent-activities');

// 全局状态
let isRegisterMode = false;

// 工具函数
function showLoading() {
    loading.classList.remove('hidden');
    googleLoginBtn.disabled = true;
    emailAuthBtn.disabled = true;
}

function hideLoading() {
    loading.classList.add('hidden');
    googleLoginBtn.disabled = false;
    emailAuthBtn.disabled = false;
}

function showError(message) {
    hideSuccess();
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

function showSuccess(message) {
    hideError();
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function hideSuccess() {
    successMessage.classList.add('hidden');
}

// 表单验证函数
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateForm() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const displayName = displayNameInput.value.trim();
    const confirmPassword = confirmPasswordInput.value;

    // 清除之前的错误
    hideError();

    // 邮箱验证
    if (!email) {
        showError('请输入邮箱地址');
        return false;
    }
    if (!validateEmail(email)) {
        showError('请输入有效的邮箱地址');
        return false;
    }

    // 密码验证
    if (!password) {
        showError('请输入密码');
        return false;
    }
    if (!validatePassword(password)) {
        showError('密码至少需要6个字符');
        return false;
    }

    // 注册模式的额外验证
    if (isRegisterMode) {
        if (!displayName) {
            showError('请输入您的姓名');
            return false;
        }
        if (!confirmPassword) {
            showError('请确认密码');
            return false;
        }
        if (password !== confirmPassword) {
            showError('两次输入的密码不一致');
            return false;
        }
    }

    return true;
}

// 切换登录/注册模式
function switchToLogin() {
    isRegisterMode = false;
    
    // 更新标签样式
    loginTab.classList.add('text-blue-600', 'bg-white', 'shadow-sm');
    loginTab.classList.remove('text-gray-600');
    registerTab.classList.add('text-gray-600');
    registerTab.classList.remove('text-blue-600', 'bg-white', 'shadow-sm');
    
    // 隐藏注册特有字段
    registerFields.classList.add('hidden');
    confirmPasswordField.classList.add('hidden');
    
    // 更新按钮文本
    emailAuthBtn.textContent = '登录';
    
    // 更新标题
    authTitle.textContent = '欢迎回来';
    authSubtitle.textContent = '登录您的账户';
    
    // 清空表单
    clearForm();
}

function switchToRegister() {
    isRegisterMode = true;
    
    // 更新标签样式
    registerTab.classList.add('text-blue-600', 'bg-white', 'shadow-sm');
    registerTab.classList.remove('text-gray-600');
    loginTab.classList.add('text-gray-600');
    loginTab.classList.remove('text-blue-600', 'bg-white', 'shadow-sm');
    
    // 显示注册特有字段
    registerFields.classList.remove('hidden');
    confirmPasswordField.classList.remove('hidden');
    
    // 更新按钮文本
    emailAuthBtn.textContent = '注册';
    
    // 更新标题
    authTitle.textContent = '创建新账户';
    authSubtitle.textContent = '注册以开始使用我们的服务';
    
    // 清空表单
    clearForm();
}

function clearForm() {
    emailInput.value = '';
    passwordInput.value = '';
    displayNameInput.value = '';
    confirmPasswordInput.value = '';
    hideError();
    hideSuccess();
}

function formatDate(timestamp) {
    if (!timestamp) return '未知';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 保存用户数据到 Firestore
async function saveUserToFirestore(user, isNewUser = false, registrationData = null) {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        const userData = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        if (userDoc.exists() && !isNewUser) {
            // 用户已存在，更新登录信息
            await updateDoc(userRef, {
                ...userData,
                loginCount: increment(1)
            });
        } else {
            // 新用户，创建记录
            const newUserData = {
                ...userData,
                createdAt: serverTimestamp(),
                loginCount: 1,
                emailVerified: user.emailVerified,
                registrationMethod: registrationData?.method || 'google'
            };

            // 如果是邮箱注册，添加额外信息
            if (registrationData && registrationData.method === 'email') {
                newUserData.registrationIP = 'unknown'; // 在生产环境中可以获取真实IP
                newUserData.customDisplayName = registrationData.displayName;
            }

            await setDoc(userRef, newUserData);
        }

        // 记录活动
        const activityType = isNewUser ? 'register' : 'login';
        await addDoc(collection(db, 'users', user.uid, 'activities'), {
            type: activityType,
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            ip: 'unknown',
            method: registrationData?.method || 'google'
        });

        console.log(`用户${activityType}数据已保存到 Firestore`);
    } catch (error) {
        console.error('保存用户数据失败:', error);
    }
}

// 邮箱密码注册功能
async function registerWithEmail(email, password, displayName) {
    try {
        showLoading();
        
        // 创建用户
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // 更新用户显示名称
        if (displayName) {
            await updateProfile(user, {
                displayName: displayName
            });
        }
        
        // 发送邮箱验证
        await sendEmailVerification(user);
        
        // 保存用户数据到 Firestore
        await saveUserToFirestore(user, true, {
            method: 'email',
            displayName: displayName
        });
        
        showSuccess('注册成功！请检查您的邮箱并验证邮箱地址。');
        
        console.log('邮箱注册成功:', user);
        
        // 更新 UI
        updateNavUserInfo(user);
        await showDashboard(user);
        
    } catch (error) {
        console.error('邮箱注册失败:', error);
        
        let errorMsg = '注册失败，请重试';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMsg = '该邮箱已被注册，请使用其他邮箱或尝试登录';
                break;
            case 'auth/weak-password':
                errorMsg = '密码强度太弱，请使用至少6个字符的密码';
                break;
            case 'auth/invalid-email':
                errorMsg = '邮箱格式不正确';
                break;
            case 'auth/network-request-failed':
                errorMsg = '网络连接失败，请检查网络连接';
                break;
            case 'auth/too-many-requests':
                errorMsg = '请求过于频繁，请稍后再试';
                break;
        }
        
        showError(errorMsg);
    } finally {
        hideLoading();
    }
}

// 邮箱密码登录功能
async function signInWithEmail(email, password) {
    try {
        showLoading();
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('邮箱登录成功:', user);
        
        // 保存用户数据到 Firestore
        await saveUserToFirestore(user, false, { method: 'email' });
        
        // 检查邮箱验证状态
        if (!user.emailVerified) {
            showSuccess('登录成功！建议您验证邮箱地址以获得更好的安全性。');
        } else {
            showSuccess('登录成功！');
        }
        
        // 更新 UI
        updateNavUserInfo(user);
        await showDashboard(user);
        
    } catch (error) {
        console.error('邮箱登录失败:', error);
        
        let errorMsg = '登录失败，请重试';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMsg = '用户不存在，请检查邮箱地址或注册新账户';
                break;
            case 'auth/wrong-password':
                errorMsg = '密码错误，请重新输入';
                break;
            case 'auth/invalid-email':
                errorMsg = '邮箱格式不正确';
                break;
            case 'auth/user-disabled':
                errorMsg = '该账户已被禁用，请联系管理员';
                break;
            case 'auth/network-request-failed':
                errorMsg = '网络连接失败，请检查网络连接';
                break;
            case 'auth/too-many-requests':
                errorMsg = '登录尝试次数过多，请稍后再试';
                break;
        }
        
        showError(errorMsg);
    } finally {
        hideLoading();
    }
}

// 处理邮箱认证表单提交
async function handleEmailAuth(event) {
    event.preventDefault();
    
    // 验证表单
    if (!validateForm()) {
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const displayName = displayNameInput.value.trim();
    
    if (isRegisterMode) {
        await registerWithEmail(email, password, displayName);
    } else {
        await signInWithEmail(email, password);
    }
}

// 获取用户详细信息
async function getUserDetails(uid) {
    try {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('获取用户详细信息失败:', error);
        return null;
    }
}

// 获取用户最近活动
async function getRecentActivities(uid) {
    try {
        const activitiesRef = collection(db, 'users', uid, 'activities');
        const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        
        const activities = [];
        querySnapshot.forEach((doc) => {
            activities.push({ id: doc.id, ...doc.data() });
        });
        
        return activities;
    } catch (error) {
        console.error('获取用户活动失败:', error);
        return [];
    }
}

// 显示用户仪表板
async function showDashboard(user) {
    try {
        // 获取用户详细信息
        const userDetails = await getUserDetails(user.uid);
        
        // 更新仪表板信息
        dashboardName.textContent = user.displayName || '未设置';
        dashboardEmail.textContent = user.email || '未设置';
        dashboardUid.textContent = user.uid;
        
        if (userDetails) {
            dashboardCreated.textContent = formatDate(userDetails.createdAt);
            dashboardLastLogin.textContent = formatDate(userDetails.lastLogin);
            dashboardLoginCount.textContent = userDetails.loginCount || 1;
        } else {
            dashboardCreated.textContent = '未知';
            dashboardLastLogin.textContent = formatDate(new Date());
            dashboardLoginCount.textContent = '1';
        }

        // 获取并显示最近活动
        const activities = await getRecentActivities(user.uid);
        displayRecentActivities(activities);

        // 显示仪表板
        authPage.classList.add('hidden');
        dashboard.classList.remove('hidden');
        dashboard.classList.add('fade-in');
        
    } catch (error) {
        console.error('显示仪表板失败:', error);
        showError('加载用户信息失败');
    }
}

// 显示最近活动
function displayRecentActivities(activities) {
    recentActivities.innerHTML = '';
    
    if (activities.length === 0) {
        recentActivities.innerHTML = '<p class="text-gray-500 text-sm">暂无活动记录</p>';
        return;
    }

    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        
        let activityText = '';
        let activityIcon = '';
        
        switch (activity.type) {
            case 'login':
                if (activity.method === 'google') {
                    activityText = '谷歌账户登录';
                    activityIcon = '🔐';
                } else if (activity.method === 'email') {
                    activityText = '邮箱登录';
                    activityIcon = '📧';
                } else {
                    activityText = '用户登录';
                    activityIcon = '🔐';
                }
                break;
            case 'register':
                if (activity.method === 'google') {
                    activityText = '谷歌账户注册';
                    activityIcon = '🎉';
                } else if (activity.method === 'email') {
                    activityText = '邮箱注册';
                    activityIcon = '📝';
                } else {
                    activityText = '用户注册';
                    activityIcon = '🎉';
                }
                break;
            default:
                activityText = '未知活动';
                activityIcon = '❓';
        }
        
        activityElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span class="text-lg">${activityIcon}</span>
                    <span class="text-sm font-medium text-gray-900">${activityText}</span>
                </div>
                <span class="activity-time">${formatDate(activity.timestamp)}</span>
            </div>
        `;
        
        recentActivities.appendChild(activityElement);
    });
}

// 显示认证页面
function showAuthPage() {
    dashboard.classList.add('hidden');
    authPage.classList.remove('hidden');
    userInfo.classList.add('hidden');
}

// 更新导航栏用户信息
function updateNavUserInfo(user) {
    if (user) {
        userAvatar.src = user.photoURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTggM0M5LjEwNDU3IDMgMTAgMy44OTU0MyAxMCA1QzEwIDYuMTA0NTcgOS4xMDQ1NyA3IDggN0M2Ljg5NTQzIDcgNiA2LjEwNDU3IDYgNUM2IDMuODk1NDMgNi44OTU0MyAzIDggM1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik04IDlDNS43OTA4NiA5IDQgMTAuNzkwOSA0IDEzVjEzQzQgMTMuNTUyMyA0LjQ0NzcyIDE0IDUgMTRIMTFDMTEuNTUyMyAxNCAxMiAxMy41NTIzIDEyIDEzVjEzQzEyIDEwLjc5MDkgMTAuMjA5MSA5IDggOVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K';
        userName.textContent = user.displayName || user.email;
        userInfo.classList.remove('hidden');
        userInfo.classList.add('flex');
    } else {
        userInfo.classList.add('hidden');
        userInfo.classList.remove('flex');
    }
}

// 谷歌登录函数
async function signInWithGoogle() {
    try {
        showLoading();
        
        // 配置谷歌登录提供商
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        // 添加弹窗配置以减少COOP警告
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        console.log('谷歌登录成功:', user);
        
        // 检查是否为新用户（第一次谷歌登录）
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const isNewUser = !userDoc.exists();
        
        // 保存用户信息到 Firestore
        await saveUserToFirestore(user, isNewUser, { method: 'google' });
        
        // 更新 UI
        updateNavUserInfo(user);
        await showDashboard(user);
        
    } catch (error) {
        console.error('谷歌登录失败:', error);
        
        let errorMsg = '登录失败，请重试';
        
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMsg = '登录窗口被关闭，请重新尝试';
                break;
            case 'auth/popup-blocked':
                errorMsg = '登录弹窗被阻止，请允许弹窗并重试';
                break;
            case 'auth/network-request-failed':
                errorMsg = '网络连接失败，请检查网络连接';
                break;
            case 'auth/too-many-requests':
                errorMsg = '请求过于频繁，请稍后再试';
                break;
        }
        
        showError(errorMsg);
    } finally {
        hideLoading();
    }
}

// 登出函数
async function signOutUser() {
    try {
        await signOut(auth);
        console.log('用户已登出');
        
        // 更新 UI
        updateNavUserInfo(null);
        showAuthPage();
        
    } catch (error) {
        console.error('登出失败:', error);
        showError('登出失败，请重试');
    }
}

// 监听认证状态变化
onAuthStateChanged(auth, async (user) => {
    console.log('认证状态变化:', user);
    
    if (user) {
        // 用户已登录
        updateNavUserInfo(user);
        await showDashboard(user);
    } else {
        // 用户未登录
        updateNavUserInfo(null);
        showAuthPage();
    }
});

// 事件监听器
googleLoginBtn.addEventListener('click', signInWithGoogle);
logoutBtn.addEventListener('click', signOutUser);

// 标签切换事件
loginTab.addEventListener('click', switchToLogin);
registerTab.addEventListener('click', switchToRegister);

// 表单提交事件
emailAuthForm.addEventListener('submit', handleEmailAuth);

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('Firebase Web应用已初始化');
    
    // 检查浏览器是否支持必要的功能
    if (!window.fetch) {
        showError('您的浏览器版本过低，请升级浏览器');
        return;
    }
    
    // 隐藏加载状态
    hideLoading();
});

// 错误处理
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
    showError('应用出现错误，请刷新页面重试');
});

// 网络状态监听
window.addEventListener('online', () => {
    console.log('网络连接已恢复');
});

window.addEventListener('offline', () => {
    console.log('网络连接已断开');
    showError('网络连接已断开，部分功能可能无法使用');
});
