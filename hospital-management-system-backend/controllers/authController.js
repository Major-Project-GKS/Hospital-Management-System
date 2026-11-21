// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Manager = require('../models/managerModel');

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

// Standard Login Logic
const login = async (req, res) => {
  const { login_id, password } = req.body;

  if (!login_id || !password) {
    return res.status(400).json({ success: false, message: 'Please provide ID and password' });
  }

  try {
    const normalizedId = login_id.trim().toUpperCase();
    let user = null;
    let role = '';
    const prefix = normalizedId.substring(0, 2);

    if (prefix === 'HM') {
      user = await Manager.findOne({ manager_id: normalizedId }).select('+password');
      role = 'Manager';
    } else if (prefix === 'DR') {
      user = await Doctor.findOne({ doctor_id: normalizedId }).select('+password');
      role = 'Doctor';
    } else if (prefix === 'PT') {
      user = await Patient.findOne({ application_id: normalizedId }).select('+password');
      role = 'Patient';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: normalizedId,
        name: user.name,
        role,
        email: user.email,
        phone: user.phone,
        photo: user.photo || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Password Logic
const resetPassword = async (req, res) => {
  const { email, aadhar_number, newPassword } = req.body;

  if (!email || !GMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid @gmail.com email address.'
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    let user = null;
    const models = [Patient, Doctor, Manager];

    for (let M of models) {
      user = await M.findOne({ email: normalizedEmail, aadhar_number: aadhar_number?.trim() });
      if (user) break;
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Verification failed. Incorrect Email or identification number.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login, resetPassword };