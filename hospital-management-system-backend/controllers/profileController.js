// controllers/profileController.js
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Manager = require('../models/managerModel');
const fs = require('fs');
const path = require('path');

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

// @desc    Update User Profile (Photo, Name, Phone, Email)
// @route   PUT /api/profile/update/:id
const updateProfile = async (req, res) => {
  const rawId = req.params.id?.trim();
  if (!rawId || rawId === 'undefined' || rawId === 'null') {
    return res.status(400).json({ success: false, message: 'Valid User ID is required. Please log in again.' });
  }

  const { name, phone, email } = req.body;
  const prefix = rawId.substring(0, 2).toUpperCase();
  const idRegex = new RegExp(`^${rawId}$`, 'i');

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

    // Case-insensitive lookup for PT / DR / HM IDs
    const user = await userModel.findOne({ [queryField]: idRegex });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User profile not found for ID ${rawId.toUpperCase()}`
      });
    }

    // Update text fields
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();

    if (email) {
      if (!GMAIL_REGEX.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid @gmail.com email address.'
        });
      }
      user.email = email.trim().toLowerCase();
    }

    // =======================================================
    // PERSISTENT BASE64 PHOTO STORAGE (Survives Render Restarts)
    // =======================================================
    let incomingFile = null;

    if (req.files && req.files['photo'] && req.files['photo'][0]) {
      incomingFile = req.files['photo'][0];
    } else if (req.file) {
      incomingFile = req.file;
    }

    if (incomingFile) {
      // Clean up any legacy disk file if user.photo was previously a filename
      if (user.photo && !user.photo.startsWith('data:')) {
        const oldPath = path.join(__dirname, '..', 'uploads', user.photo);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (fsErr) {
            console.log('Old file cleanup skipped:', fsErr.message);
          }
        }
      }

      // Read uploaded file and store permanently as a Data URL in MongoDB
      const filePath = incomingFile.path || path.join(__dirname, '..', 'uploads', incomingFile.filename);
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = incomingFile.mimetype || 'image/jpeg';
        user.photo = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

        // Delete temp file from Render's ephemeral disk
        try {
          fs.unlinkSync(filePath);
        } catch (_) {}
      }
    }

    await user.save();

    const canonicalId = user.application_id || user.doctor_id || user.manager_id || rawId.toUpperCase();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        id: canonicalId,
        name: user.name,
        phone: user.phone,
        email: user.email,
        photo: user.photo,
        application_id: user.application_id || canonicalId,
        doctor_id: user.doctor_id || canonicalId,
        manager_id: user.manager_id || canonicalId,
        department: user.department || ''
      }
    });
  } catch (error) {
    console.error('Profile Update Server Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updateProfile };