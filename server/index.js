require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const scoresRoutes = require('./routes/scores');
require('./config/cloudinary');

const app = express();

// 1. CORS first
app.use(cors({
  origin: 'https://react-decipher-app-backend.onrender.com/',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
}));

// 2. Cookie parser and JSON
app.use(cookieParser());
app.use(express.json());

// 3. Then define your routes AFTER middlewares
app.use('/auth', authRoutes);
app.use('/scores', scoresRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
