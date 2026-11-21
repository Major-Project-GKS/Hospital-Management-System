// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Manager = require('../models/managerModel');

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

const login = async (req, res) => {
  const { login_id, password } = req.body;

  if (!login_id || !password) {
    return res.status(400).json({ success: false, message: 'Please provide ID and password' });
  }

  try {
    const cleanId = login_id.trim();
    const idRegex = new RegExp(`^${cleanId}$`, 'i'); // Matches DR0001 or dr0001
    const prefix = cleanId.substring(0, 2).toUpperCase();

    let user = null;
    let role = '';
    let canonicalId = cleanId.toUpperCase();

    if (prefix === 'HM') {
      user = await Manager.findOne({ manager_id: idRegex }).select('+password');
      role = 'Manager';
      if (user) canonicalId = user.manager_id;
    } else if (prefix === 'DR') {
      user = await Doctor.findOne({ doctor_id: idRegex }).select('+password');
      role = 'Doctor';
      if (user) canonicalId = user.doctor_id;
    } else if (prefix === 'PT') {
      user = await Patient.findOne({ application_id: idRegex }).select('+password');
      role = 'Patient';
      if (user) canonicalId = user.application_id;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid ID format (Use PT, DR, or HM)' });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No ${role} account found with ID ${cleanId.toUpperCase()}`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Use Forgot Password to reset it.'
      });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: canonicalId,
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

const resetPassword = async (req, res) => {
  const { email, aadhar_number, newPassword } = req.body;

  if (!email || !GMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid @gmail.com email address.'
    });
  }

  try {
    const emailRegex = new RegExp(`^${email.trim()}$`, 'i');
    const cleanAadhar = aadhar_number?.trim();
    let user = null;
    const models = [Patient, Doctor, Manager];

    for (let M of models) {
      user = await M.findOne({ email: emailRegex, aadhar_number: cleanAadhar });
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