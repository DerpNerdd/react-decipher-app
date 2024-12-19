const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });


// Helper function to check username for profanity
async function checkProfanity(username) {
    const url = "https://api.apilayer.com/bad_words?censor_character=*";
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': process.env.BAD_WORDS_API_KEY
        },
        body: username
    });

    const data = await response.json();
    console.log("Bad Words API response:", data);
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
            secure: true, // Ensure this is set to true in production
            sameSite: 'None', // Required for cross-origin requests
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        

        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify (Profile)
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
                
                // Return all desired fields
                res.json({ 
                    username: user.username,
                    levelsFinished: user.levelsFinished,
                    highScore: user.highScore,
                    totalRuns: user.totalRuns,
                    profilePicture: user.profilePicture,
                    bio: user.bio
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Server error' });
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

router.patch('/updateProfileWithImage', upload.single('profilePicture'), (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { bio } = req.body;
        const file = req.file; 
        
        if (!file && !bio) {
          return res.status(400).json({ error: 'No updates provided' });
        }

        User.findById(decoded.userId)
            .then(async user => {
                if (!user) return res.status(404).json({ error: 'User not found' });

                // If bio is provided, update it
                if (typeof bio === 'string') {
                    user.bio = bio;
                }

                // If a file is uploaded, upload it to Cloudinary using upload_stream
                if (file) {
                    const buffer = file.buffer;
                    const cloudUpload = () => new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                          { folder: 'profile_pictures', transformation: [{ width: 200, height: 200, crop: 'fill' }] },
                          (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                          }
                        );
                        stream.end(buffer);
                    });

                    try {
                        const result = await cloudUpload();
                        user.profilePicture = result.secure_url;
                    } catch (err) {
                        console.error('Cloudinary upload error:', err);
                        return res.status(500).json({ error: 'Image upload failed' });
                    }
                }

                return user.save().then(updatedUser => {
                    res.json({ message: 'Profile updated successfully', profilePicture: updatedUser.profilePicture });
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Server error' });
            });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
});


module.exports = router;
