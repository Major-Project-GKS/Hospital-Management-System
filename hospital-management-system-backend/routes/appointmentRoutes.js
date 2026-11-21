const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointmentModel');

const { bookAppointment, saveSchedule, getAllSchedules } = require('../controllers/appointmentController');

// Patient Bookings Routing -> POST /api/appointment/book
router.post('/book', bookAppointment);

// Manager Roster Saving Routing -> POST /api/appointment/schedule/save
router.post('/schedule/save', saveSchedule);

// Universal Schedule Listing Routing -> GET /api/appointment/schedule/all
router.get('/schedule/all', getAllSchedules);

// Doctor Queue Status Update -> PUT /api/appointment/status/:apptId
router.put('/status/:apptId', async (req, res) => {
  try {
    const { apptId } = req.params;
    const { status } = req.body;

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appointment_id: apptId },
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Status Update Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;