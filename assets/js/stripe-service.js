/**
 * Stripe Payment Service
 * Handles donation payments and Stripe integration
 */

class StripeService {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.cardElement = null;
        this.isInitialized = false;
        this.config = window.CONFIG?.stripe;
        
        this.init();
    }

    /**
     * Initialize Stripe service
     */
    async init() {
        try {
            if (!this.config?.enabled) {
                console.log('Stripe is not enabled in configuration');
                return;
            }

            // Check if Stripe is already loaded
            if (typeof Stripe !== 'undefined') {
                this.stripe = Stripe(this.config.publicKey);
                this.isInitialized = true;
                console.log('Stripe service initialized successfully');
                return;
            }

            // Wait for Stripe to be loaded (max 3 seconds)
            let attempts = 0;
            while (typeof Stripe === 'undefined' && attempts < 30) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (typeof Stripe === 'undefined') {
                throw new Error('Stripe failed to load within timeout');
            }

            this.stripe = Stripe(this.config.publicKey);
            this.isInitialized = true;
            console.log('Stripe service initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Stripe service:', error);
            this.isInitialized = false;
        }
    }

    /**
     * Show donation modal
     */
    showDonationModal() {
        if (!this.isInitialized) {
            alert('支付服务正在初始化，请稍后重试');
            return;
        }

        // Create modal HTML
        const modalHTML = `
            <div id="donationModal" class="donation-modal-overlay">
                <div class="donation-modal">
                    <div class="donation-modal-header">
                        <h3>💝 Support Us</h3>
                        <button class="close-btn" onclick="this.closeDonationModal()">&times;</button>
                    </div>
                    <div class="donation-modal-content">
                        <p>感谢您支持智能升学顾问项目！</p>
                        <div class="amount-selection">
                            ${this.config.donationAmounts.map(amount => 
                                `<button class="amount-btn" data-amount="${amount}">$${amount}</button>`
                            ).join('')}
                        </div>
                        <div class="demo-notice">
                            ⚠️ 演示模式：不会产生实际扣费
                        </div>
                        <button class="donate-btn" onclick="this.processDemoPayment()">立即支持</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        this.setupModalEventListeners();
    }

    /**
     * Setup modal event listeners
     */
    setupModalEventListeners() {
        const modal = document.getElementById('donationModal');
        const amountBtns = modal.querySelectorAll('.amount-btn');
        
        amountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                amountBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeDonationModal();
            }
        });
    }

    /**
     * Process demo payment
     */
    async processDemoPayment() {
        const selectedAmount = document.querySelector('.amount-btn.selected');
        const amount = selectedAmount ? selectedAmount.dataset.amount : this.config.defaultAmount;
        
        // Simulate payment processing
        const donateBtn = document.querySelector('.donate-btn');
        donateBtn.textContent = '处理中...';
        donateBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success message
        this.showSuccessMessage(amount);
    }

    /**
     * Show success message
     */
    showSuccessMessage(amount) {
        const modal = document.getElementById('donationModal');
        modal.innerHTML = `
            <div class="donation-modal">
                <div class="success-message">
                    <div class="success-icon">✅</div>
                    <h3>感谢您的支持！</h3>
                    <p>您的 $${amount} 捐赠已成功处理</p>
                    <p class="demo-note">（演示模式，未产生实际扣费）</p>
                    <button onclick="window.stripeService.closeDonationModal()">完成</button>
                </div>
            </div>
        `;
    }

    /**
     * Close donation modal
     */
    closeDonationModal() {
        const modal = document.getElementById('donationModal');
        if (modal) {
            modal.remove();
        }
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.StripeService = StripeService;
}

// Add CSS styles
const styles = `
<style>
.donation-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.donation-modal {
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.donation-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.amount-selection {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 20px 0;
}

.amount-btn {
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.amount-btn:hover, .amount-btn.selected {
    border-color: #f59e0b;
    background: #f59e0b;
    color: white;
}

.demo-notice {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    padding: 12px;
    margin: 16px 0;
    text-align: center;
    font-size: 14px;
}

.donate-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.donate-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
}

.success-message {
    text-align: center;
    padding: 20px;
}

.success-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.demo-note {
    color: #666;
    font-size: 14px;
    margin: 16px 0;
}
</style>
`;

// Inject styles
if (typeof document !== 'undefined') {
    document.head.insertAdjacentHTML('beforeend', styles);
}
