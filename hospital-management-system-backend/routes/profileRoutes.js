const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Standard multer setup file
const { updateProfile } = require('../controllers/profileController');

router.put('/update/:id', upload.fields([{ name: 'photo', maxCount: 1 }]), updateProfile);

module.exports = router;