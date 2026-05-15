const express = require('express');
const router = express.Router();
const { getHospitalStats } = require('../controllers/adminController');

// Manager Dashboard Stat Route
router.get('/stats', getHospitalStats);

module.exports = router;