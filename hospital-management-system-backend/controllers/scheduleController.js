const Schedule = require('../models/scheduleModel');
const Doctor = require('../models/doctorModel');

// @desc    Create or update day-wise doctor schedule assignment
// @route   POST /api/appointment/schedule/save
const saveSchedule = async (req, res) => {
  const { doctor_id, day_of_week, department, shift_start, shift_end, max_patients } = req.body;

  try {
    // Look up doctor name automatically to keep the dataset structured safely
    const doctor = await Doctor.findOne({ doctor_id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Medical Practitioner ID not found.' });
    }

    // Upsert logic: find existing record for that doctor on that day, or make a new one
    const schedule = await Schedule.findOneAndUpdate(
      { doctor_id, day_of_week },
      { 
        doctor_name: doctor.name,
        department, 
        shift_start, 
        shift_end, 
        max_patients 
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: ' Roster configuration committed successfully!', data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active duty schedules
// @route   GET /api/appointment/schedule/all
const getAllSchedules = async (req, res) => {
  try {
    const rosters = await Schedule.find().sort({ day_of_week: 1 });
    res.status(200).json({ success: true, data: rosters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { saveSchedule, getAllSchedules };