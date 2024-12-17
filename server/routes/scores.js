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

router.post('/startGame', authMiddleware, async (req, res) => {
try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.totalRuns += 1;
    await user.save();

    res.json({ message: 'Run started, totalRuns incremented' });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
}
});


router.post('/save', authMiddleware, async (req, res) => {
const { score, puzzlesCompleted } = req.body;
try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update user stats
    user.totalRuns += 1;
    if (score > user.highScore) user.highScore = score;
    user.levelsFinished += (puzzlesCompleted || 0);
    await user.save();

    // Also save this score to the Score collection for the leaderboard
    const newScore = new Score({
    username: user.username,
    score: score,
    date: new Date()
    });
    await newScore.save();

    res.json({ message: 'Score and stats updated successfully' });
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
