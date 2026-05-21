const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Manager = require('../models/managerModel');
const fs = require('fs');
const path = require('path');

// @desc    Update User Profile (Photo, Name, Phone, Email)
// @route   PUT /api/profile/update/:id
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email } = req.body;
  const prefix = id.substring(0, 2).toUpperCase();

  try {
    let userModel;
    let queryField = '';

    if (prefix === 'PT') {
      userModel = Patient;
      queryField = 'application_id';
    } else if (prefix === 'DR') {
      userModel = Doctor;
      queryField = 'doctor_id';
    } else if (prefix === 'HM') {
      userModel = Manager;
      queryField = 'manager_id';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid User ID type' });
    }

    // Find the existing user records
    const user = await userModel.findOne({ [queryField]: id });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    // Update text fields if they are sent in the request
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;

    // =======================================================
    // SAFE MULTI-METHOD FILE UPLOAD PROCESSING LAYER ✅
    // =======================================================
    let incomingFile = null;

    if (req.files && req.files['photo'] && req.files['photo'][0]) {
      incomingFile = req.files['photo'][0];
    } else if (req.file) {
      incomingFile = req.file;
    }

    if (incomingFile) {
      // Remove old photo from disk storage safely if it exists
      if (user.photo) {
        const oldPath = path.join(__dirname, '..', 'uploads', user.photo);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (fsErr) {
            console.log("Old file link could not be broken or did not exist on path:", fsErr.message);
          }
        }
      }
      // Save new photo filename reference string
      user.photo = incomingFile.filename;
    }

    await user.save();

    // Send complete metadata parameters back to prevent state crashes on dashboard sidebars
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        name: user.name,
        phone: user.phone,
        email: user.email,
        photo: user.photo,
        application_id: user.application_id || id,
        doctor_id: user.doctor_id || id,
        manager_id: user.manager_id || id,
        department: user.department || ''
      }
    });

  } catch (error) {
    console.error('Profile Update Server Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updateProfile };