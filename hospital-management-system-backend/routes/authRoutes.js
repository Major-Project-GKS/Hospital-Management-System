const express = require('express');
const router = express.Router();

// 1. IMPORT BOTH FUNCTIONS HERE ✅
const { login, resetPassword } = require('../controllers/authController');

// 2. DEFINE YOUR ROUTES
router.post('/login', login);
router.post('/reset-password', resetPassword); // This will work perfectly now!

module.exports = router;