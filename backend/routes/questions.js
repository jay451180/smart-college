/**
 * Questions API Routes
 * 题库API路由
 */

const express = require('express');
const router = express.Router();

// Mock data for questions
const mockQuestions = [
    {
        id: 1,
        subject: 'math',
        difficulty: 'easy',
        type: 'multiple',
        question: 'What is the derivative of x²?',
        options: ['2x', 'x²', '2x²', 'x'],
        correctAnswer: '2x',
        explanation: 'The derivative of x² is 2x using the power rule.',
        tags: ['calculus', 'derivatives']
    },
    {
        id: 2,
        subject: 'english',
        difficulty: 'medium',
        type: 'essay',
        question: 'Analyze the themes in Shakespeare\'s Hamlet and discuss how they relate to modern society.',
        explanation: 'Key themes include revenge, mortality, madness, and corruption.',
        tags: ['literature', 'shakespeare', 'analysis']
    },
    {
        id: 3,
        subject: 'science',
        difficulty: 'hard',
        type: 'calculation',
        question: 'Calculate the pH of a 0.1M solution of acetic acid (Ka = 1.8 × 10⁻⁵).',
        correctAnswer: '2.87',
        explanation: 'Use the weak acid equilibrium equation to solve for [H+].',
        tags: ['chemistry', 'acids', 'ph']
    }
];

// Get all questions with filtering
router.get('/', (req, res) => {
    try {
        const { subject, difficulty, type, search } = req.query;
        let filteredQuestions = [...mockQuestions];

        // Apply filters
        if (subject) {
            filteredQuestions = filteredQuestions.filter(q => q.subject === subject);
        }
        if (difficulty) {
            filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
        }
        if (type) {
            filteredQuestions = filteredQuestions.filter(q => q.type === type);
        }
        if (search) {
            filteredQuestions = filteredQuestions.filter(q => 
                q.question.toLowerCase().includes(search.toLowerCase()) ||
                q.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
            );
        }

        res.json({
            success: true,
            data: filteredQuestions,
            total: filteredQuestions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get question by ID
router.get('/:id', (req, res) => {
    try {
        const question = mockQuestions.find(q => q.id === parseInt(req.params.id));
        if (!question) {
            return res.status(404).json({
                success: false,
                error: 'Question not found'
            });
        }
        res.json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get random questions for quiz
router.get('/quiz/random', (req, res) => {
    try {
        const { count = 10, subject, difficulty } = req.query;
        let availableQuestions = [...mockQuestions];

        // Apply filters
        if (subject) {
            availableQuestions = availableQuestions.filter(q => q.subject === subject);
        }
        if (difficulty) {
            availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
        }

        // Shuffle and select random questions
        const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, parseInt(count));

        res.json({
            success: true,
            data: selected,
            total: selected.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Submit answer
router.post('/:id/answer', (req, res) => {
    try {
        const { answer, timeSpent } = req.body;
        const question = mockQuestions.find(q => q.id === parseInt(req.params.id));
        
        if (!question) {
            return res.status(404).json({
                success: false,
                error: 'Question not found'
            });
        }

        const isCorrect = question.correctAnswer === answer;
        
        res.json({
            success: true,
            data: {
                correct: isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                timeSpent: timeSpent
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get statistics
router.get('/stats/overview', (req, res) => {
    try {
        const stats = {
            totalQuestions: mockQuestions.length,
            subjectBreakdown: {
                math: mockQuestions.filter(q => q.subject === 'math').length,
                english: mockQuestions.filter(q => q.subject === 'english').length,
                science: mockQuestions.filter(q => q.subject === 'science').length
            },
            difficultyBreakdown: {
                easy: mockQuestions.filter(q => q.difficulty === 'easy').length,
                medium: mockQuestions.filter(q => q.difficulty === 'medium').length,
                hard: mockQuestions.filter(q => q.difficulty === 'hard').length
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
