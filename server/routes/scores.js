const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate requests
function authMiddleware(req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// Save Score (Authenticated)
router.post('/save', authMiddleware, async (req, res) => {
    const { score } = req.body;
    if (typeof score !== 'number') {
        return res.status(400).json({ error: 'Invalid score' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const newScore = new Score({ username: user.username, score });
        await newScore.save();

        res.status(201).json({ message: 'Score saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Leaderboard
// Get top 10 scores
router.get('/leaderboard', async (req, res) => {
    try {
        const topScores = await Score.find().sort({ score: -1, date: 1 }).limit(10);
        res.json(topScores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
