const express = require('express');
const router = express.Router();
const { registerManager } = require('../controllers/managerController'); // Adjust path as needed
const upload = require('../middleware/upload');

router.post(
  '/register',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'aadhar_card', maxCount: 1 },
  ]),
  registerManager
);

module.exports = router;