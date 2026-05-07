// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const { registerDoctor, getDoctors } = require('../controllers/doctorController');
const upload = require('../middleware/upload');

// Route to get list of doctors (for the booking page)
router.get('/', getDoctors);

// Route to register a doctor (handles photo and certified proof uploads)
router.post(
  '/register',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'certified_proof', maxCount: 1 },
  ]),
  registerDoctor
);

module.exports = router;