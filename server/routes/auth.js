const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

// Helper function to check username for profanity
async function checkProfanity(username) {
    const url = `https://api.apilayer.com/bad_words?censor_character=*&text=${encodeURIComponent(username)}`;
    const response = await fetch(url, {
        headers: {
            'apikey': process.env.BAD_WORDS_API_KEY
        }
    });
    const data = await response.json();
    return data.bad_words_total > 0;
}

// Sign Up
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check for profanity
        const isProfane = await checkProfanity(username);
        if (isProfane) {
            return res.status(400).json({ error: 'Username contains inappropriate content.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Set token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set true in production with HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify (Profile) - protected route
router.get('/me', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        User.findById(decoded.userId)
            .then(user => {
                if (!user) return res.status(404).json({ error: 'User not found' });
                res.json({ username: user.username });
            });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
