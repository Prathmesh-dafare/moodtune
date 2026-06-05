// server.js - Main Express server for MoodTune
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// ========================
// MIDDLEWARE
// ========================

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: { success: false, message: 'Too many requests. Please try again later.' }
});
app.use('/api/', limiter);

// More strict limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts. Please wait 15 minutes.' }
});

// ========================
// ROUTES
// ========================

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/music', require('./routes/music'));
app.use('/api/favorites', require('./routes/favorites'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MoodTune API is running 🎵',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ========================
// ERROR HANDLING
// ========================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error.'
  });
});

// ========================
// START SERVER
// ========================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🎵 ================================
  🎵  MoodTune API Server Running
  🎵  Port: ${PORT}
  🎵  Mode: ${process.env.NODE_ENV || 'development'}
  🎵 ================================
  `);
});

module.exports = app;
