// routes/music.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getRecommendations, searchMusic } = require('../controllers/musicController');

router.get('/recommendations/:mood', protect, getRecommendations);
router.get('/search', protect, searchMusic);

module.exports = router;
