const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const Appointment = require('../models/appointmentModel');

// @desc    Get Overall Hospital Statistics
// @route   GET /api/admin/stats
const getHospitalStats = async (req, res) => {
  try {
    // Fetch all counts in parallel for speed
    const [totalDoctors, totalPatients, totalAppointments] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments()
    ]);
    
    // Get the 5 most recently booked appointments
    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        recentAppointments
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getHospitalStats };