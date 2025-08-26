/**
 * Announcements API Routes
 * 学校公告API路由
 */

const express = require('express');
const router = express.Router();

// Mock data for announcements
const mockAnnouncements = [
    {
        id: 1,
        title: 'Harvard University Early Action Deadline Extended',
        school: 'harvard',
        type: 'deadlines',
        content: 'Harvard University has extended their Early Action application deadline to December 1st, 2024.',
        date: '2024-10-15',
        priority: 'high',
        tags: ['deadline', 'early-action', 'harvard']
    },
    {
        id: 2,
        title: 'MIT Virtual Information Session',
        school: 'mit',
        type: 'events',
        content: 'Join MIT for a virtual information session on November 20th at 7 PM EST.',
        date: '2024-10-20',
        priority: 'medium',
        tags: ['info-session', 'virtual', 'mit']
    },
    {
        id: 3,
        title: 'Stanford Merit Scholarship Applications Open',
        school: 'stanford',
        type: 'scholarships',
        content: 'Stanford University merit scholarship applications are now open for the 2025-2026 academic year.',
        date: '2024-10-25',
        priority: 'high',
        tags: ['scholarships', 'merit', 'stanford']
    },
    {
        id: 4,
        title: 'UC Berkeley Engineering Program Updates',
        school: 'berkeley',
        type: 'admissions',
        content: 'UC Berkeley has updated their engineering program requirements for Fall 2025 admissions.',
        date: '2024-10-30',
        priority: 'medium',
        tags: ['engineering', 'requirements', 'uc-berkeley']
    }
];

// Get all announcements with filtering
router.get('/', (req, res) => {
    try {
        const { school, type, priority, search } = req.query;
        let filteredAnnouncements = [...mockAnnouncements];

        // Apply filters
        if (school) {
            filteredAnnouncements = filteredAnnouncements.filter(a => a.school === school);
        }
        if (type) {
            filteredAnnouncements = filteredAnnouncements.filter(a => a.type === type);
        }
        if (priority) {
            filteredAnnouncements = filteredAnnouncements.filter(a => a.priority === priority);
        }
        if (search) {
            filteredAnnouncements = filteredAnnouncements.filter(a => 
                a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.content.toLowerCase().includes(search.toLowerCase()) ||
                a.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
            );
        }

        // Sort by date (newest first)
        filteredAnnouncements.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            success: true,
            data: filteredAnnouncements,
            total: filteredAnnouncements.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get announcement by ID
router.get('/:id', (req, res) => {
    try {
        const announcement = mockAnnouncements.find(a => a.id === parseInt(req.params.id));
        if (!announcement) {
            return res.status(404).json({
                success: false,
                error: 'Announcement not found'
            });
        }
        res.json({
            success: true,
            data: announcement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get recent announcements
router.get('/recent/:count', (req, res) => {
    try {
        const count = parseInt(req.params.count) || 5;
        const recentAnnouncements = mockAnnouncements
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, count);

        res.json({
            success: true,
            data: recentAnnouncements,
            total: recentAnnouncements.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get announcements by school
router.get('/school/:school', (req, res) => {
    try {
        const school = req.params.school;
        const schoolAnnouncements = mockAnnouncements
            .filter(a => a.school === school)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            success: true,
            data: schoolAnnouncements,
            total: schoolAnnouncements.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get announcements statistics
router.get('/stats/overview', (req, res) => {
    try {
        const stats = {
            totalAnnouncements: mockAnnouncements.length,
            bySchool: {
                harvard: mockAnnouncements.filter(a => a.school === 'harvard').length,
                mit: mockAnnouncements.filter(a => a.school === 'mit').length,
                stanford: mockAnnouncements.filter(a => a.school === 'stanford').length,
                berkeley: mockAnnouncements.filter(a => a.school === 'berkeley').length
            },
            byType: {
                admissions: mockAnnouncements.filter(a => a.type === 'admissions').length,
                deadlines: mockAnnouncements.filter(a => a.type === 'deadlines').length,
                events: mockAnnouncements.filter(a => a.type === 'events').length,
                scholarships: mockAnnouncements.filter(a => a.type === 'scholarships').length
            },
            byPriority: {
                high: mockAnnouncements.filter(a => a.priority === 'high').length,
                medium: mockAnnouncements.filter(a => a.priority === 'medium').length,
                low: mockAnnouncements.filter(a => a.priority === 'low').length
            }
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
