// routes/managerRoutes.js
const express = require('express');
const router = express.Router();
const { registerManager } = require('../controllers/managerController');
const upload = require('../middleware/upload');

// Manager Registration (handles photo upload)
router.post(
  '/register',
  upload.fields([{ name: 'photo', maxCount: 1 }]),
  registerManager
);

module.exports = router;