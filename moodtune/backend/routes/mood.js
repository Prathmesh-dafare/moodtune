// routes/mood.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { analyzeMood, saveMood, getMoodHistory } = require('../controllers/moodController');

router.post('/analyze', protect, analyzeMood);
router.post('/save', protect, saveMood);
router.get('/history', protect, getMoodHistory);

module.exports = router;
