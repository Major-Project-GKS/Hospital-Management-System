const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');

// @desc    Register a new doctor
// @route   POST /api/doctor/register
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
        doctor_id: doctor.doctor_id,
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

// @desc    Get Doctor Dashboard Data (Profile + COMPLETE Patient Queue for Counters)
// @route   GET /api/doctor/dashboard/:id
const getDoctorDashboard = async (req, res) => {
  try {
    const { id } = req.params; 

    // 1. Find the Doctor Profile
    const doctor = await Doctor.findOne({ doctor_id: id });

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // 2. FIXED: Fetch ALL appointments for this doctor (Waiting, Completed, Absent)
    // This allows your frontend dashboard counters to read the lengths of different statuses live!
    const queue = await Appointment.find({ doctor_id: id }).sort({ date: 1, serial_number: 1 });

    // 3. Return structured data cleanly to the Frontend layout
    res.status(200).json({
      success: true,
      data: {
        profile: {
          name: doctor.name,
          doctor_id: doctor.doctor_id,
          department: doctor.department,
          email: doctor.email,
          phone: doctor.phone,
          experience: doctor.experience,
          region_city: doctor.region_city, // Explicit mapping pass-through
          state: doctor.state,
          comfortable_language: doctor.comfortable_language,
          photo: doctor.photo,
          proof: doctor.certified_proof
        },
        queue: queue 
      }
    });
  } catch (err) {
    console.error("Doctor Dashboard Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all doctors (For booking or manager cascade dropdown list mapping)
// @route   GET /api/doctor
const getDoctors = async (req, res) => {
  try {
    const query = req.query.department ? { department: req.query.department } : {};
    
    // Explicitly select data properties ensuring no field dropouts break frontend map loops
    const doctors = await Doctor.find(query).select('-password').sort({ name: 1 });
    
    res.status(200).json({ 
      success: true, 
      count: doctors.length, 
      data: doctors 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error loading doctor list arrays.' });
  }
};

module.exports = { registerDoctor, getDoctors, getDoctorDashboard };