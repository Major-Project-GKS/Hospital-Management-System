// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const { registerDoctor, getDoctors, getDoctorDashboard } = require('../controllers/doctorController');
const upload = require('../middleware/upload');

// ✅ This handles: GET http://localhost:5000/api/doctor/
router.get('/', getDoctors);

// This handles: GET http://localhost:5000/api/doctor/dashboard/:id
router.get('/dashboard/:id', getDoctorDashboard);

// This handles: POST http://localhost:5000/api/doctor/register
router.post(
  '/register',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'certified_proof', maxCount: 1 },
  ]),
  registerDoctor
);

module.exports = router;