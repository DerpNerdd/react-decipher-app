const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  levelsFinished: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  totalRuns: { type: Number, default: 0 },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);
