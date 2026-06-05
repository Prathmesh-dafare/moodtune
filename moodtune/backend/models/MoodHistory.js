// models/MoodHistory.js - Track user mood history
const mongoose = require('mongoose');

const moodHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'relaxed', 'energetic', 'romantic', 'angry', 'motivated', 'party']
  },
  inputText: {
    type: String,
    default: null // The text the user entered (if using AI detection)
  },
  detectionMethod: {
    type: String,
    enum: ['ai', 'keyword', 'manual'],
    default: 'manual'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
moodHistorySchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('MoodHistory', moodHistorySchema);
