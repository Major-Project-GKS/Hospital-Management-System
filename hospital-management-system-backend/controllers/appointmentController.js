const Appointment = require('../models/appointmentModel');
const Schedule = require('../models/scheduleModel');
const Doctor = require('../models/doctorModel');

// =========================================================================
// 1. PATIENT BOOKING CONTROLLER (With strict sync parameters)
// =========================================================================
const bookAppointment = async (req, res) => {
  try {
    // 1. Destructure all incoming keys from the frontend payload safely
    const { 
      patient_id, 
      patient_name, 
      doctor_id, 
      doctor_name, 
      date, 
      time_slot 
    } = req.body;

    // 2. Clear backend log tracking to verify incoming traffic structure
    console.log("📥 Backend received appointment payload:", req.body);

    // 3. Strict validation fallback block to prevent incomplete document saves
    if (!patient_id || !patient_name || !doctor_id || !doctor_name || !date || !time_slot) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Incomplete appointment details received."
      });
    }

    // 4. Calculate context-aware queue slot serial sequence count for that specific doctor on that specific day
    const existingSlotsCount = await Appointment.countDocuments({
      doctor_id: doctor_id,
      date: date
    });
    
    const calculatedSerialNumber = existingSlotsCount + 1;

    // 5. Instantiate a clean instance map matching your Mongoose schema parameters
    const newAppointment = new Appointment({
      patient_id,
      patient_name,
      doctor_id,
      doctor_name,
      date,
      time_slot,
      serial_number: calculatedSerialNumber,
      status: 'Waiting'
    });

    // 6. Save document execution block (Triggers pre('save') autoincrement ID hook safely)
    const savedRecord = await newAppointment.save();
    console.log("💾 Appointment successfully registered in database:", savedRecord);

    // 7. Return signature standardized success response structure back to your frontend wizard
    return res.status(201).json({
      success: true,
      message: "Appointment saved cleanly into system logs.",
      data: savedRecord
    });

  } catch (error) {
    console.error("💥 Critical Failure in appointment booking controller:", error);
    return res.status(500).json({
      success: false,
      error: "Server Error: Internal storage commit validation breakdown.",
      details: error.message
    });
  }
};

// =========================================================================
// 2. MANAGER ROSTER SAVING CONTROLLER
// =========================================================================
const saveSchedule = async (req, res) => {
  const { doctor_id, doctor_name, day_of_week, department, shift_start, shift_end, max_patients } = req.body;

  try {
    if (!doctor_id || !day_of_week || !department || !shift_start || !shift_end || !max_patients) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation Error: Incomplete schedule details received.' 
      });
    }

    let verifiedDocName = doctor_name;
    if (!verifiedDocName) {
      const profile = await Doctor.findOne({ doctor_id: doctor_id });
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Medical Practitioner ID not found in registry.' });
      }
      verifiedDocName = profile.name;
    }

    console.log(`📥 Committing Roster: Dr. ${verifiedDocName} (${doctor_id}) on ${day_of_week}`);

    const schedule = await Schedule.findOneAndUpdate(
      { doctor_id: doctor_id.trim(), day_of_week: day_of_week.trim() },
      { 
        doctor_name: verifiedDocName.trim(),
        department: department.trim(), 
        shift_start: shift_start.trim(), 
        shift_end: shift_end.trim(), 
        max_patients: Number(max_patients)
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({ 
      success: true, 
      message: 'Roster configuration committed successfully!', 
      data: schedule 
    });

  } catch (error) {
    console.error("💥 Roster save transaction failure:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Roster processing failure: Schema verification mismatch.', 
      details: error.message 
    });
  }
};

// =========================================================================
// 3. MASTER ROSTER LISTING FETCHING CONTROLLER
// =========================================================================
const getAllSchedules = async (req, res) => {
  try {
    const rosters = await Schedule.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: rosters });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// MODULE EXPORTS OBJECT (Aligns perfectly with routes/appointmentRoutes.js)
// =========================================================================
module.exports = {
  bookAppointment,
  saveSchedule,
  getAllSchedules
};