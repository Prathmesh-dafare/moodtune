// models/FavoriteSong.js - User's favorite songs
const mongoose = require('mongoose');

const favoriteSongSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  songId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  preview: {
    type: String,
    default: null // 30-second preview URL
  },
  mood: {
    type: String,
    default: null // Which mood this was saved from
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate favorites for same user
favoriteSongSchema.index({ userId: 1, songId: 1 }, { unique: true });

module.exports = mongoose.model('FavoriteSong', favoriteSongSchema);
