/**
 * UI Interactions JavaScript
 * 用户界面交互功能
 */

// Tab functionality
function showStrategyTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('#strategyFeature .tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('#strategyFeature .tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function showCommunityTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('#communityFeature .tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('#communityFeature .tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Question Bank Functions
function filterQuestions() {
    const subject = document.getElementById('subjectFilter')?.value || '';
    const difficulty = document.getElementById('difficultyFilter')?.value || '';
    const type = document.getElementById('typeFilter')?.value || '';
    
    console.log('Filtering questions:', { subject, difficulty, type });
    // Here you would implement actual filtering logic
    showNotification('Filters applied successfully!', 'success');
}

function searchQuestions() {
    const searchTerm = document.getElementById('questionSearch')?.value || '';
    console.log('Searching questions:', searchTerm);
    showNotification('Search completed!', 'info');
}

function startSubjectQuiz(subject) {
    console.log('Starting quiz for subject:', subject);
    showNotification(`Starting ${subject} quiz...`, 'info');
}

function practiceQuestion(questionId) {
    console.log('Practicing question:', questionId);
    showNotification('Loading question...', 'info');
}

function viewSolution(questionId) {
    console.log('Viewing solution for question:', questionId);
    showNotification('Loading solution...', 'info');
}

function bookmarkQuestion(questionId) {
    console.log('Bookmarking question:', questionId);
    showNotification('Question bookmarked!', 'success');
}

// Strategy Functions
function generatePersonalizedStrategy() {
    console.log('Generating personalized strategy...');
    showNotification('Generating your personalized application strategy...', 'info');
}

function exportStrategy() {
    console.log('Exporting strategy...');
    showNotification('Strategy exported successfully!', 'success');
}

function saveStrategy() {
    console.log('Saving strategy...');
    showNotification('Strategy saved!', 'success');
}

function editEssay(essayType) {
    console.log('Editing essay:', essayType);
    showNotification('Opening essay editor...', 'info');
}

function getEssayFeedback(essayType) {
    console.log('Getting feedback for essay:', essayType);
    showNotification('AI feedback coming soon...', 'info');
}

function startEssay(essayType) {
    console.log('Starting essay:', essayType);
    showNotification('Essay editor opened!', 'info');
}

function getEssayTips(essayType) {
    console.log('Getting tips for essay:', essayType);
    showNotification('Loading essay tips...', 'info');
}

// Resource Functions
function filterResources() {
    const category = document.getElementById('categoryFilter')?.value || '';
    const subject = document.getElementById('subjectResourceFilter')?.value || '';
    const format = document.getElementById('formatFilter')?.value || '';
    
    console.log('Filtering resources:', { category, subject, format });
    showNotification('Resource filters applied!', 'success');
}

function searchResources() {
    const searchTerm = document.getElementById('resourceSearch')?.value || '';
    console.log('Searching resources:', searchTerm);
    showNotification('Resource search completed!', 'info');
}

function showResourceCategory(category) {
    console.log('Showing resource category:', category);
    showNotification(`Loading ${category} resources...`, 'info');
}

function downloadResource(resourceId) {
    console.log('Downloading resource:', resourceId);
    showNotification('Download started!', 'success');
}

function previewResource(resourceId) {
    console.log('Previewing resource:', resourceId);
    showNotification('Opening preview...', 'info');
}

function bookmarkResource(resourceId) {
    console.log('Bookmarking resource:', resourceId);
    showNotification('Resource bookmarked!', 'success');
}

function watchResource(resourceId) {
    console.log('Watching resource:', resourceId);
    showNotification('Opening video player...', 'info');
}

function launchResource(resourceId) {
    console.log('Launching interactive resource:', resourceId);
    showNotification('Launching interactive content...', 'info');
}

function shareResource(resourceId) {
    console.log('Sharing resource:', resourceId);
    showNotification('Share link copied to clipboard!', 'success');
}

function showMyResources() {
    console.log('Showing my resources...');
    showNotification('Loading your resources...', 'info');
}

function uploadResource() {
    console.log('Upload resource...');
    showNotification('Upload feature coming soon!', 'info');
}

function downloadSelected() {
    console.log('Downloading selected resources...');
    showNotification('Downloading selected resources...', 'info');
}

// Community Functions
function createNewPost() {
    console.log('Creating new post...');
    showNotification('Post editor opened!', 'info');
}

function joinStudyGroup(groupId) {
    console.log('Joining study group:', groupId);
    showNotification('Joined study group!', 'success');
}

function registerForEvent(eventId) {
    console.log('Registering for event:', eventId);
    showNotification('Event registration successful!', 'success');
}

function requestMentor() {
    console.log('Requesting mentor...');
    showNotification('Mentor request submitted!', 'success');
}

// Announcement Functions
function filterAnnouncements() {
    const school = document.getElementById('schoolFilter')?.value || '';
    const type = document.getElementById('typeFilter')?.value || '';
    
    console.log('Filtering announcements:', { school, type });
    showNotification('Announcement filters applied!', 'success');
}

function viewAnnouncementDetails(announcementId) {
    console.log('Viewing announcement details:', announcementId);
    showNotification('Loading announcement details...', 'info');
}

// Quiz Mode Functions
function showQuizMode() {
    console.log('Showing quiz mode...');
    showNotification('Quiz mode activated!', 'info');
}

function showProgress() {
    console.log('Showing progress...');
    showNotification('Loading your progress...', 'info');
}

function startRandomQuiz() {
    console.log('Starting random quiz...');
    showNotification('Starting random quiz...', 'info');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`;
document.head.appendChild(style);

console.log('✅ UI Interactions loaded successfully');
