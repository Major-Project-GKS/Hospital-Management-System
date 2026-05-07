const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 

// Import BOTH functions now
const { registerPatient, getPatientDashboard } = require('../controllers/patientController');

// Patient Registration (POST)
router.post(
  '/register',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'aadhar_card', maxCount: 1 },
  ]),
  registerPatient
);

// NEW: Patient Dashboard Data (GET)
// Notice the /:id at the end. This allows React to ask for /dashboard/PT0003
router.get('/dashboard/:id', getPatientDashboard);

module.exports = router;