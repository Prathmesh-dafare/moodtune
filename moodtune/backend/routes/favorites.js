// routes/favorites.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoritesController');

router.post('/add', protect, addFavorite);
router.delete('/remove/:id', protect, removeFavorite);
router.get('/', protect, getFavorites);

module.exports = router;
