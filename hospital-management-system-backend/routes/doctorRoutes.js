const express = require('express');
const router = express.Router();
const { registerDoctor, getDoctors, getDoctorDashboard } = require('../controllers/doctorController');
const upload = require('../middleware/upload');

router.get('/', getDoctors);
router.get('/dashboard/:id', getDoctorDashboard);

router.post(
  '/register',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'certified_proof', maxCount: 1 },
  ]),
  registerDoctor
);

module.exports = router;