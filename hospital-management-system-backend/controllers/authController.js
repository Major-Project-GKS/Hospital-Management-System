// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Manager = require('../models/managerModel');

// Helper function to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// @desc    Unified Login for Patient, Doctor, and Manager
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { login_id, password } = req.body;

  if (!login_id || !password) {
    return res.status(400).json({ success: false, message: 'Please provide ID and password' });
  }

  try {
    let user = null;
    let role = '';

    // Smart Routing: Check prefix to determine role
    const prefix = login_id.substring(0, 2).toUpperCase();

    if (prefix === 'PT') {
      user = await Patient.findOne({ application_id: login_id }).select('+password');
      role = 'Patient';
    } else if (prefix === 'DR') {
      user = await Doctor.findOne({ doctor_id: login_id }).select('+password');
      role = 'Doctor';
    } else if (prefix === 'HM') {
      user = await Manager.findOne({ manager_id: login_id }).select('+password');
      role = 'Manager';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Send response with token
    res.status(200).json({
      success: true,
      token: generateToken(user._id, role),
      data: {
        id: user._id,
        login_id: login_id,
        name: user.name,
        role: role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login };