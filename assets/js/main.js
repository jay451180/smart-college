/**
 * Main Application Controller
 * 主应用控制器
 */

class MainApp {
    constructor() {
        this.currentUser = null;
        this.currentEducationSystem = null;
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing Smart College Advisor...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
                return;
            }

            // Initialize services
            await this.initializeServices();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load user session
            this.loadUserSession();
            
            this.isInitialized = true;
            console.log('✅ Smart College Advisor initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
        }
    }

    /**
     * Initialize all services
     */
    async initializeServices() {
        // Initialize AI service if available
        if (typeof AIService !== 'undefined') {
            try {
                window.aiService = new AIService();
                console.log('✅ AI service initialized');
            } catch (error) {
                console.error('❌ Failed to initialize AI service:', error);
            }
        }

        // Initialize Firebase service if available
        if (typeof FirebaseService !== 'undefined' && window.CONFIG?.firebase?.enabled) {
            try {
                console.log('🔥 Initializing Firebase service...');
                window.firebaseService = new FirebaseService();
                
                // Wait for Firebase to be properly initialized
                let attempts = 0;
                while (!window.firebaseService.isInitialized && attempts < 30) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    attempts++;
                }
                
                if (window.firebaseService.isInitialized) {
                    console.log('✅ Firebase service initialized successfully');
                } else {
                    console.warn('⚠️ Firebase service initialization is taking longer than expected');
                }
            } catch (error) {
                console.error('❌ Failed to initialize Firebase service:', error);
            }
        } else {
            console.log('⚠️ Firebase service not available or disabled');
            if (typeof FirebaseService === 'undefined') {
                console.log('  - FirebaseService class not loaded');
            }
            if (!window.CONFIG?.firebase?.enabled) {
                console.log('  - Firebase config not enabled');
            }
        }

        // Initialize Stripe service if available
        if (typeof StripeService !== 'undefined' && window.CONFIG?.stripe?.enabled) {
            try {
                window.stripeService = new StripeService();
                console.log('✅ Stripe service initialized');
            } catch (error) {
                console.error('❌ Failed to initialize Stripe service:', error);
            }
        }

        console.log('✅ All services initialized');
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Handle education system selection
        document.addEventListener('click', (e) => {
            if (e.target.matches('.education-option')) {
                this.selectEducationSystem(e.target.dataset.system);
            }
        });

        // Handle feature navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-feature]')) {
                this.showFeature(e.target.dataset.feature);
            }
        });

        console.log('✅ Event listeners setup complete');
    }

    /**
     * Select education system
     */
    selectEducationSystem(system) {
        // Remove previous selections
        document.querySelectorAll('.education-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked option
        const selectedOption = document.querySelector(`[data-system="${system}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
            this.currentEducationSystem = system;
            
            // Enable continue button
            const continueBtn = document.querySelector('.confirm-btn, .continue-btn');
            if (continueBtn) {
                continueBtn.classList.add('enabled');
                continueBtn.disabled = false;
            }

            console.log(`📚 Selected education system: ${system}`);
        }
    }

    /**
     * Show feature module
     */
    showFeature(feature) {
        // Hide all feature modules
        document.querySelectorAll('.feature-content').forEach(f => {
            f.classList.remove('active');
        });

        // Show selected feature
        const targetFeature = document.getElementById(feature + 'Feature');
        if (targetFeature) {
            targetFeature.classList.add('active');
            console.log(`📱 Showing feature: ${feature}`);
        }
    }

    /**
     * Load user session from storage
     */
    loadUserSession() {
        try {
            const savedSession = localStorage.getItem('smartCollegeSession');
            if (savedSession) {
                const session = JSON.parse(savedSession);
                this.currentUser = session.user;
                this.currentEducationSystem = session.educationSystem;
                console.log('✅ User session loaded');
            }
        } catch (error) {
            console.error('❌ Failed to load user session:', error);
        }
    }

    /**
     * Save user session to storage
     */
    saveUserSession() {
        try {
            const session = {
                user: this.currentUser,
                educationSystem: this.currentEducationSystem,
                timestamp: Date.now()
            };
            localStorage.setItem('smartCollegeSession', JSON.stringify(session));
            console.log('✅ User session saved');
        } catch (error) {
            console.error('❌ Failed to save user session:', error);
        }
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10001',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            info: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global utility functions
window.showNotificationMessage = function(message, type = 'info') {
    if (window.mainApp) {
        window.mainApp.showNotification(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};

// Initialize app when script loads
if (typeof window !== 'undefined') {
    window.mainApp = new MainApp();
}

console.log('✅ Main application script loaded');
