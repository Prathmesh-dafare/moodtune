// controllers/userController.js - User profile and stats
const User = require('../models/User');
const MoodHistory = require('../models/MoodHistory');
const FavoriteSong = require('../models/FavoriteSong');

// @desc    Get user profile with stats
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Parallel queries for efficiency
    const [user, favoritesCount, moodHistory, recentMoods] = await Promise.all([
      User.findById(userId),
      FavoriteSong.countDocuments({ userId }),
      MoodHistory.find({ userId }).sort({ timestamp: -1 }).limit(10),
      MoodHistory.aggregate([
        { $match: { userId } },
        { $group: { _id: '$mood', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    // Build mood stats object
    const moodStats = {};
    recentMoods.forEach(item => {
      moodStats[item._id] = item.count;
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      stats: {
        favoritesCount,
        totalMoodChecks: moodHistory.length,
        moodStats
      },
      recentMoodHistory: moodHistory.slice(0, 5)
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile.'
    });
  }
};

// @desc    Update user name
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

module.exports = { getProfile, updateProfile };
