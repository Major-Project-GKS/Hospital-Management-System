// controllers/doctorController.js
const Doctor = require('../models/doctorModel');

// @desc    Register a new doctor (Usually done by Manager, but keeping it general for now)
// @route   POST /api/doctor/register
// @access  Private (Should be Manager only later)
const registerDoctor = async (req, res) => {
  try {
    const { 
      name, phone, email, aadhar_number, password, 
      department, experience, state, region_city, comfortable_language 
    } = req.body;

    const doctor = await Doctor.create({
      name, phone, email, aadhar_number, password,
      department, experience, state, region_city, comfortable_language,
      photo: req.files && req.files.photo ? req.files.photo[0].filename : null,
      certified_proof: req.files && req.files.certified_proof ? req.files.certified_proof[0].filename : null,
    });

    res.status(201).json({
      success: true,
      data: {
        id: doctor._id,
        doctor_id: doctor.doctor_id, // Returns DRXXXX
        name: doctor.name,
        department: doctor.department
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ success: false, error: `${field} already exists` });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all doctors (For booking or manager view)
// @route   GET /api/doctor
// @access  Public
const getDoctors = async (req, res) => {
  try {
    // You can add query parameters here to filter by department
    const query = req.query.department ? { department: req.query.department } : {};
    const doctors = await Doctor.find(query).select('-password'); // Don't send passwords
    
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}

module.exports = { registerDoctor, getDoctors };