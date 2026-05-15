const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Manager = require('../models/managerModel');

// Standard Login Logic
const login = async (req, res) => {
  const { login_id, password } = req.body;

  if (!login_id || !password) {
    return res.status(400).json({ success: false, message: 'Please provide ID and password' });
  }

  try {
    let user = null;
    let role = '';
    const prefix = login_id.substring(0, 2).toUpperCase();

    if (prefix === 'HM') {
      user = await Manager.findOne({ manager_id: login_id }).select('+password');
      role = 'Manager';
    } else if (prefix === 'DR') {
      user = await Doctor.findOne({ doctor_id: login_id }).select('+password');
      role = 'Doctor';
    } else if (prefix === 'PT') {
      user = await Patient.findOne({ application_id: login_id }).select('+password');
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
      user: { id: login_id, name: user.name, role: role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// NEW: Reset Password Logic
const resetPassword = async (req, res) => {
  const { email, aadhar_number, newPassword } = req.body;

  try {
    let user = null;
    const models = [Patient, Doctor, Manager];

    for (let M of models) {
      user = await M.findOne({ email, aadhar_number });
      if (user) break;
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "Verification failed. Incorrect Email or Aadhar." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login, resetPassword };