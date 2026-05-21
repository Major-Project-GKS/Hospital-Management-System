const express = require('express');
const router = express.Router();

// ✅ FIXED: Destructure all 3 methods correctly from the controller export block
const { bookAppointment, saveSchedule, getAllSchedules } = require('../controllers/appointmentController');

// Patient Bookings Routing -> POST /api/appointment/book
router.post('/book', bookAppointment);

// Manager Roster Saving Routing -> POST /api/appointment/schedule/save
router.post('/schedule/save', saveSchedule);

// Universal Schedule Listing Routing -> GET /api/appointment/schedule/all
router.get('/schedule/all', getAllSchedules);

module.exports = router;