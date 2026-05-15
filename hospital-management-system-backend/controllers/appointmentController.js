const Appointment = require('../models/appointmentModel');

// @desc    Book a new appointment
// @route   POST /api/appointment/book
const bookAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, patient_name, date, time_slot } = req.body;

    // 1. Check if data arrived
    if (!patient_id || !doctor_id || !date) {
      return res.status(400).json({ success: false, error: "Missing ID, Doctor, or Date" });
    }

    // 2. Database calculation for Serial Number
    const count = await Appointment.countDocuments({ doctor_id, date });
    const serial_number = count + 1;

    // 3. Attempt to save to MongoDB
    const newAppointment = await Appointment.create({
      patient_id,
      doctor_id,
      patient_name,
      date,
      time_slot,
      serial_number
    });

    // 4. Final Success Response
    return res.status(201).json({ 
      success: true, 
      data: newAppointment 
    });
    
  } catch (err) {
    // This part was crashing before because of the word 'next'
    // We strictly use console.log and res.status now.
    console.error("PERMANENT FIX LOG - Error found:", err.message);
    
    return res.status(500).json({ 
      success: false, 
      error: "Database or Server Error: " + err.message 
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { appointment_id: id }, 
      { status }, 
      { new: true }
    );
    return res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = { bookAppointment, updateStatus };