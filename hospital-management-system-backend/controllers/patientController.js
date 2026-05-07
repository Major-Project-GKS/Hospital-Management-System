// controllers/patientController.js
const Patient = require('../models/patientModel');
const { validationResult } = require('express-validator');

const registerPatient = async (req, res) => {
  // 1. Catch any express-validator errors (if you are using them in your routes)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }

  try {
    const { name, phone, email, aadhar_number, password } = req.body;

    // 2. Safely extract JUST the filenames, not the raw file data
    const photoFilename = req.files && req.files['photo'] ? req.files['photo'][0].filename : null;
    const aadharFilename = req.files && req.files['aadhar_card'] ? req.files['aadhar_card'][0].filename : null;

    // 3. Save to MongoDB
    const patient = await Patient.create({
      name,
      phone,
      email,
      aadhar_number,
      password,
      photo: photoFilename,
      aadhar_card: aadharFilename
    });

    // 4. Send success response back to React
    res.status(201).json({
      success: true,
      data: {
        id: patient._id,
        application_id: patient.application_id, // Returns the PTXXXX ID
        name: patient.name
      }
    });
    
  } catch (error) {
    // 5. Handle duplicate emails/phones cleanly without crashing
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ success: false, error: `This ${field} is already registered.` });
    }
    
    console.error("Database Error:", error.message);
    res.status(500).json({ success: false, error: "Server Error while saving to database" });
  }
};

module.exports = { registerPatient };
// Add this below registerPatient...

const getPatientDashboard = async (req, res) => {
  try {
    // 1. Get the patient ID from the URL (e.g., PT0003)
    const { id } = req.params;

    // 2. Find the patient in the database
    const patient = await Patient.findOne({ application_id: id });
    
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // 3. Find their appointments (We will connect the Appointment model here soon!)
    // const appointments = await Appointment.find({ patient_id: id });

    // 4. Send all the data back to the React frontend
    res.status(200).json({
      success: true,
      data: {
        // Inside getPatientDashboard...
        profile: {
          name: patient.name,
          application_id: patient.application_id,
          phone: patient.phone,
          email: patient.email,
          aadhar_number: patient.aadhar_number, // <-- ADD THIS
          photo: patient.photo,
          aadhar_card: patient.aadhar_card      // <-- ADD THIS
        },
        appointments: [] // We will fill this with real appointments next!
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to load dashboard data" });
  }
};

// Don't forget to export the new function!
module.exports = { registerPatient, getPatientDashboard };