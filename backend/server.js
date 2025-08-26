/**
 * Smart College Advisor Backend Server
 * 智能升学助手后端服务器
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import route modules
const questionRoutes = require('./routes/questions');
const strategyRoutes = require('./routes/strategy');
const resourceRoutes = require('./routes/resources');
const communityRoutes = require('./routes/community');
const announcementRoutes = require('./routes/announcements');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../assets')));

// API Routes
app.use('/api/questions', questionRoutes);
app.use('/api/strategy', strategyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested resource was not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Smart College Advisor Backend Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Create necessary directories
    const dirs = ['../logs', '../data', '../uploads'];
    dirs.forEach(dir => {
        const fullPath = path.join(__dirname, dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`📁 Created directory: ${fullPath}`);
        }
    });
});

module.exports = app;
