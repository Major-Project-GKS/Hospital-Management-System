// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth'); // Import security middleware

// Protect this route so only logged-in users with a token can access it
router.get('/stats', protect, getDashboardStats);

module.exports = router;