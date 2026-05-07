// controllers/managerController.js
const Manager = require('../models/managerModel');

// @desc    Register a new Hospital Manager
// @route   POST /api/manager/register
// @access  Public (Usually requires Super Admin, but open for initial setup)
const registerManager = async (req, res) => {
  try {
    const { name, phone, email, aadhar_number, password } = req.body;

    const manager = await Manager.create({
      name, phone, email, aadhar_number, password,
      photo: req.files && req.files.photo ? req.files.photo[0].filename : null,
    });

    res.status(201).json({
      success: true,
      data: {
        id: manager._id,
        manager_id: manager.manager_id, // Returns HMXXXX
        name: manager.name,
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

module.exports = { registerManager };