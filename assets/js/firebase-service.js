/**
 * Firebase Service
 * Handles Firebase authentication, database, and storage operations
 */

class FirebaseService {
    constructor() {
        this.app = null;
        this.auth = null;
        this.db = null;
        this.storage = null;
        this.analytics = null;
        this.isInitialized = false;
        this.config = window.CONFIG?.firebase;
        
        this.init();
    }

    /**
     * Initialize Firebase services
     */
    async init() {
        try {
            if (!this.config?.enabled) {
                console.log('Firebase is not enabled in configuration');
                return;
            }

            // Wait for Firebase to be loaded
            await this.waitForFirebase();

            // Initialize Firebase app
            this.app = firebase.initializeApp(this.config.config);
            console.log('✅ Firebase app initialized');

            // Initialize enabled services
            if (this.config.services.auth) {
                this.auth = firebase.auth();
                this.setupAuthStateListener();
                console.log('✅ Firebase Auth initialized');
            }

            if (this.config.services.firestore) {
                this.db = firebase.firestore();
                console.log('✅ Firestore initialized');
            }

            if (this.config.services.storage) {
                this.storage = firebase.storage();
                console.log('✅ Firebase Storage initialized');
            }

            if (this.config.services.analytics) {
                this.analytics = firebase.analytics();
                console.log('✅ Firebase Analytics initialized');
            }

            this.isInitialized = true;
            console.log('🔥 Firebase service fully initialized');

        } catch (error) {
            console.error('❌ Failed to initialize Firebase:', error);
            this.isInitialized = false;
        }
    }

    /**
     * Wait for Firebase to be loaded
     */
    async waitForFirebase() {
        let attempts = 0;
        while (typeof firebase === 'undefined' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (typeof firebase === 'undefined') {
            throw new Error('Firebase failed to load within timeout');
        }
    }

    /**
     * Setup authentication state listener
     */
    setupAuthStateListener() {
        if (!this.auth) return;

        this.auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('👤 User signed in:', user.email);
                this.handleUserSignIn(user);
            } else {
                console.log('👤 User signed out');
                this.handleUserSignOut();
            }
        });
    }

    /**
     * Handle user sign in
     */
    handleUserSignIn(user) {
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            isAnonymous: user.isAnonymous,
            lastSignIn: new Date().toISOString()
        };

        // Update global app state
        if (window.mainApp) {
            window.mainApp.currentUser = userData;
            window.mainApp.saveUserSession();
        }

        // Save to localStorage
        localStorage.setItem('firebaseUser', JSON.stringify(userData));

        // Show success notification
        window.showNotificationMessage?.(`欢迎回来，${user.displayName || user.email}！`, 'success');

        // Hide login interface and show main interface
        this.showMainInterface();
    }

    /**
     * Handle user sign out
     */
    handleUserSignOut() {
        // Clear global app state
        if (window.mainApp) {
            window.mainApp.currentUser = null;
            window.mainApp.saveUserSession();
        }

        // Clear localStorage
        localStorage.removeItem('firebaseUser');

        // Show login interface
        this.showLoginInterface();
    }

    /**
     * Sign in with Google
     */
    async signInWithGoogle() {
        if (!this.auth) {
            throw new Error('Firebase Auth not initialized');
        }

        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');

            const result = await this.auth.signInWithPopup(provider);
            console.log('✅ Google sign-in successful');
            return result.user;

        } catch (error) {
            console.error('❌ Google sign-in failed:', error);
            throw error;
        }
    }

    /**
     * Sign in with email and password
     */
    async signInWithEmail(email, password) {
        if (!this.auth) {
            throw new Error('Firebase Auth not initialized');
        }

        try {
            const result = await this.auth.signInWithEmailAndPassword(email, password);
            console.log('✅ Email sign-in successful');
            return result.user;

        } catch (error) {
            console.error('❌ Email sign-in failed:', error);
            throw error;
        }
    }

    /**
     * Sign up with email and password
     */
    async signUpWithEmail(email, password, displayName) {
        if (!this.auth) {
            throw new Error('Firebase Auth not initialized');
        }

        try {
            const result = await this.auth.createUserWithEmailAndPassword(email, password);
            
            // Update profile with display name
            if (displayName) {
                await result.user.updateProfile({ displayName });
            }

            console.log('✅ Email sign-up successful');
            return result.user;

        } catch (error) {
            console.error('❌ Email sign-up failed:', error);
            throw error;
        }
    }

    /**
     * Sign in anonymously
     */
    async signInAnonymously() {
        if (!this.auth) {
            throw new Error('Firebase Auth not initialized');
        }

        try {
            const result = await this.auth.signInAnonymously();
            console.log('✅ Anonymous sign-in successful');
            return result.user;

        } catch (error) {
            console.error('❌ Anonymous sign-in failed:', error);
            throw error;
        }
    }

    /**
     * Sign out
     */
    async signOut() {
        if (!this.auth) {
            throw new Error('Firebase Auth not initialized');
        }

        try {
            await this.auth.signOut();
            console.log('✅ Sign-out successful');

        } catch (error) {
            console.error('❌ Sign-out failed:', error);
            throw error;
        }
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.auth?.currentUser || null;
    }

    /**
     * Save user data to Firestore
     */
    async saveUserData(userData) {
        if (!this.db) {
            throw new Error('Firestore not initialized');
        }

        try {
            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('No authenticated user');
            }

            await this.db.collection('users').doc(user.uid).set({
                ...userData,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log('✅ User data saved to Firestore');

        } catch (error) {
            console.error('❌ Failed to save user data:', error);
            throw error;
        }
    }

    /**
     * Get user data from Firestore
     */
    async getUserData() {
        if (!this.db) {
            throw new Error('Firestore not initialized');
        }

        try {
            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('No authenticated user');
            }

            const doc = await this.db.collection('users').doc(user.uid).get();
            
            if (doc.exists) {
                console.log('✅ User data retrieved from Firestore');
                return doc.data();
            } else {
                console.log('ℹ️ No user data found in Firestore');
                return null;
            }

        } catch (error) {
            console.error('❌ Failed to get user data:', error);
            throw error;
        }
    }

    /**
     * Show main interface
     */
    showMainInterface() {
        const loginInterface = document.getElementById('loginInterface');
        const mainInterface = document.getElementById('mainInterface');
        
        if (loginInterface) loginInterface.style.display = 'none';
        if (mainInterface) mainInterface.style.display = 'block';
    }

    /**
     * Show login interface
     */
    showLoginInterface() {
        const loginInterface = document.getElementById('loginInterface');
        const mainInterface = document.getElementById('mainInterface');
        
        if (mainInterface) mainInterface.style.display = 'none';
        if (loginInterface) loginInterface.style.display = 'block';
    }

    /**
     * Log analytics event
     */
    logEvent(eventName, parameters = {}) {
        if (this.analytics) {
            this.analytics.logEvent(eventName, parameters);
            console.log(`📊 Analytics event logged: ${eventName}`);
        }
    }
}

// Global utility functions for Firebase
window.firebaseSignInWithGoogle = async function() {
    try {
        if (!window.firebaseService) {
            throw new Error('Firebase service not initialized');
        }
        
        window.showNotificationMessage?.('正在连接Google账户...', 'info');
        await window.firebaseService.signInWithGoogle();
        
    } catch (error) {
        console.error('Google登录失败:', error);
        window.showNotificationMessage?.('Google登录失败，请重试', 'error');
    }
};

window.firebaseSignOut = async function() {
    try {
        if (!window.firebaseService) {
            throw new Error('Firebase service not initialized');
        }
        
        await window.firebaseService.signOut();
        window.showNotificationMessage?.('已成功退出登录', 'success');
        
    } catch (error) {
        console.error('退出登录失败:', error);
        window.showNotificationMessage?.('退出登录失败，请重试', 'error');
    }
};

window.firebaseSignInAnonymously = async function() {
    try {
        if (!window.firebaseService) {
            throw new Error('Firebase service not initialized');
        }
        
        window.showNotificationMessage?.('正在以访客身份登录...', 'info');
        await window.firebaseService.signInAnonymously();
        
    } catch (error) {
        console.error('访客登录失败:', error);
        window.showNotificationMessage?.('访客登录失败，请重试', 'error');
    }
};

// Initialize global instance
if (typeof window !== 'undefined') {
    window.FirebaseService = FirebaseService;
}

console.log('🔥 Firebase service script loaded');
