/**
 * Feature Modules JavaScript
 * 功能模块JavaScript代码
 */

class FeatureManager {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.currentFeature = null;
        this.init();
    }

    init() {
        console.log('🚀 Initializing Feature Manager...');
        this.bindEventListeners();
    }

    bindEventListeners() {
        // Add event listeners for all feature interactions
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeFeatures();
        });
    }

    initializeFeatures() {
        // Initialize all feature modules
        this.initQuestionBank();
        this.initAnnouncements();
    }

    // Question Bank Features
    async initQuestionBank() {
        try {
            // Load question statistics
            const stats = await this.fetchAPI('/questions/stats/overview');
            if (stats.success) {
                this.updateQuestionStats(stats.data);
            }

            // Load recent questions
            const questions = await this.fetchAPI('/questions?limit=5');
            if (questions.success) {
                this.displayRecentQuestions(questions.data);
            }
        } catch (error) {
            console.error('Error initializing question bank:', error);
        }
    }

    updateQuestionStats(stats) {
        // Update statistics display
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-number').textContent = stats.totalQuestions;
            // Add more stat updates here
        }
    }

    displayRecentQuestions(questions) {
        const questionList = document.getElementById('questionList');
        if (!questionList) return;

        questionList.innerHTML = questions.map(question => `
            <div class="question-item">
                <div class="question-header">
                    <span class="question-subject">${this.capitalizeFirst(question.subject)}</span>
                    <span class="question-difficulty ${question.difficulty}">${this.capitalizeFirst(question.difficulty)}</span>
                    <span class="question-type">${this.formatQuestionType(question.type)}</span>
                </div>
                <div class="question-text">${question.question}</div>
                <div class="question-actions">
                    <button class="btn-small" onclick="featureManager.practiceQuestion(${question.id})">Practice</button>
                    <button class="btn-small" onclick="featureManager.viewSolution(${question.id})">Solution</button>
                </div>
            </div>
        `).join('');
    }

    async practiceQuestion(questionId) {
        try {
            const response = await this.fetchAPI(`/questions/${questionId}`);
            if (response.success) {
                this.showQuestionModal(response.data);
            }
        } catch (error) {
            console.error('Error loading question:', error);
        }
    }

    showQuestionModal(question) {
        // Create and show question modal
        const modal = document.createElement('div');
        modal.className = 'question-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${question.subject.toUpperCase()} - ${question.difficulty.toUpperCase()}</h3>
                    <button class="close-btn" onclick="this.closest('.question-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="question-text">${question.question}</div>
                    ${question.options ? this.renderMultipleChoice(question) : this.renderOpenEnded(question)}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.question-modal').remove()">Cancel</button>
                    <button class="btn-primary" onclick="featureManager.submitAnswer(${question.id})">Submit Answer</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    renderMultipleChoice(question) {
        return `
            <div class="multiple-choice-options">
                ${question.options.map((option, index) => `
                    <label class="option-label">
                        <input type="radio" name="answer" value="${option}">
                        <span class="option-text">${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    renderOpenEnded(question) {
        return `
            <div class="open-ended-answer">
                <textarea id="answerInput" placeholder="Enter your answer here..." rows="4"></textarea>
            </div>
        `;
    }

    async submitAnswer(questionId) {
        const modal = document.querySelector('.question-modal');
        const selectedAnswer = modal.querySelector('input[name="answer"]:checked')?.value || 
                              modal.querySelector('#answerInput')?.value;

        if (!selectedAnswer) {
            alert('Please provide an answer before submitting.');
            return;
        }

        try {
            const response = await this.fetchAPI(`/questions/${questionId}/answer`, {
                method: 'POST',
                body: JSON.stringify({
                    answer: selectedAnswer,
                    timeSpent: Date.now() // Simple time tracking
                })
            });

            if (response.success) {
                this.showAnswerResult(response.data);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    }

    showAnswerResult(result) {
        const modal = document.querySelector('.question-modal');
        modal.querySelector('.modal-body').innerHTML = `
            <div class="answer-result">
                <div class="result-status ${result.correct ? 'correct' : 'incorrect'}">
                    ${result.correct ? '✅ Correct!' : '❌ Incorrect'}
                </div>
                <div class="correct-answer">
                    <strong>Correct Answer:</strong> ${result.correctAnswer}
                </div>
                <div class="explanation">
                    <strong>Explanation:</strong> ${result.explanation}
                </div>
            </div>
        `;
        modal.querySelector('.modal-footer').innerHTML = `
            <button class="btn-primary" onclick="this.closest('.question-modal').remove()">Continue</button>
        `;
    }

    // Announcements Features
    async initAnnouncements() {
        try {
            const announcements = await this.fetchAPI('/announcements?limit=10');
            if (announcements.success) {
                this.displayAnnouncements(announcements.data);
            }
        } catch (error) {
            console.error('Error initializing announcements:', error);
        }
    }

    displayAnnouncements(announcements) {
        const announcementsList = document.getElementById('announcementsList');
        if (!announcementsList) return;

        announcementsList.innerHTML = announcements.map(announcement => `
            <div class="announcement-item">
                <div class="announcement-header">
                    <div class="announcement-meta">
                        <span class="announcement-school">${this.getSchoolName(announcement.school)}</span>
                        <span class="announcement-type ${announcement.type}">${this.formatAnnouncementType(announcement.type)}</span>
                        <span class="announcement-priority ${announcement.priority}">${announcement.priority.toUpperCase()}</span>
                    </div>
                    <div class="announcement-date">${this.formatDate(announcement.date)}</div>
                </div>
                <h3 class="announcement-title">${announcement.title}</h3>
                <p class="announcement-content">${announcement.content}</p>
                <div class="announcement-tags">
                    ${announcement.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // Utility Functions
    async fetchAPI(endpoint, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const finalOptions = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(this.apiBase + endpoint, finalOptions);
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatQuestionType(type) {
        const types = {
            'multiple': 'Multiple Choice',
            'essay': 'Essay',
            'calculation': 'Calculation'
        };
        return types[type] || type;
    }

    formatAnnouncementType(type) {
        const types = {
            'admissions': 'Admissions',
            'deadlines': 'Deadlines',
            'events': 'Events',
            'scholarships': 'Scholarships'
        };
        return types[type] || type;
    }

    getSchoolName(school) {
        const schools = {
            'harvard': 'Harvard University',
            'mit': 'MIT',
            'stanford': 'Stanford University',
            'berkeley': 'UC Berkeley'
        };
        return schools[school] || school;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Filter Functions
    filterQuestions() {
        const subject = document.getElementById('subjectFilter').value;
        const difficulty = document.getElementById('difficultyFilter').value;
        const type = document.getElementById('typeFilter').value;

        this.loadFilteredQuestions({ subject, difficulty, type });
    }

    async loadFilteredQuestions(filters) {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            const response = await this.fetchAPI(`/questions?${params}`);
            if (response.success) {
                this.displayRecentQuestions(response.data);
            }
        } catch (error) {
            console.error('Error loading filtered questions:', error);
        }
    }

    searchQuestions() {
        const searchTerm = document.getElementById('questionSearch').value;
        if (searchTerm) {
            this.loadFilteredQuestions({ search: searchTerm });
        }
    }
}

// Initialize Feature Manager
const featureManager = new FeatureManager();

// Global functions for HTML onclick handlers
window.featureManager = featureManager;
window.filterQuestions = () => featureManager.filterQuestions();
window.searchQuestions = () => featureManager.searchQuestions();
window.practiceQuestion = (id) => featureManager.practiceQuestion(id);
window.viewSolution = (id) => featureManager.viewSolution(id);

console.log('✅ Features.js loaded successfully');
