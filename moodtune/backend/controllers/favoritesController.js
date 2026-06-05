// controllers/favoritesController.js - Manage user favorite songs
const FavoriteSong = require("../models/FavoriteSong");

// @desc    Add song to favorites
// @route   POST /api/favorites/add
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const { songId, title, artist, album, image, preview, mood } = req.body;

    if (!songId || !title || !artist) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Song ID, title, and artist are required.",
        });
    }

    // Check if already favorited
    const existing = await FavoriteSong.findOne({
      userId: req.user._id,
      songId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Song already in favorites." });
    }

    const favorite = await FavoriteSong.create({
      userId: req.user._id,
      songId,
      title,
      artist,
      album: album || "",
      image: image || "",
      preview: preview || null,
      mood: mood || null,
    });

    res
      .status(201)
      .json({ success: true, message: "Added to favorites!", favorite });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Song already in favorites." });
    }
    console.error("Add favorite error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add favorite." });
  }
};

// @desc    Remove song from favorites
// @route   DELETE /api/favorites/remove/:id
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    // Try by MongoDB _id or by songId
    const favorite = await FavoriteSong.findOneAndDelete({
      songId: id,
      userId: req.user._id,
    });

    if (!favorite) {
      return res
        .status(404)
        .json({ success: false, message: "Favorite not found." });
    }

    res.json({ success: true, message: "Removed from favorites." });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove favorite." });
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const favorites = await FavoriteSong.find({ userId: req.user._id }).sort({
      addedAt: -1,
    });

    res.json({ success: true, favorites, count: favorites.length });
  } catch (error) {
    console.error("Get favorites error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch favorites." });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
