// controllers/adminController.js
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Manager Only)
const getDashboardStats = async (req, res) => {
  try {
    // Make sure only Managers can access this
    if (req.user.role !== 'Manager') {
      return res.status(403).json({ success: false, message: 'Access denied. Managers only.' });
    }

    // Count documents in parallel for speed
    const [totalPatients, totalDoctors, totalAppointments] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        patients: totalPatients,
        doctors: totalDoctors,
        appointments: totalAppointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getDashboardStats };