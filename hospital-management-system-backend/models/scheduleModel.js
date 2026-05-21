const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  doctor_id: { 
    type: String, 
    required: true,
    trim: true 
  },
  doctor_name: { 
    type: String, 
    required: true,
    trim: true 
  },
  department: { 
    type: String, 
    required: true,
    trim: true 
  },
  day_of_week: { 
    type: String, 
    required: true, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
  },
  shift_start: { 
    type: String, 
    required: true, 
    default: '09:00' 
  }, 
  shift_end: { 
    type: String, 
    required: true, 
    default: '17:00' 
  },
  max_patients: { 
    type: Number, 
    required: true,
    default: 20 
  } 
}, { timestamps: true });

// Primary Compound Key Restriction preventing duplicate schedules for the same doctor on the same day
scheduleSchema.index({ doctor_id: 1, day_of_week: 1 }, { unique: true });

module.exports = mongoose.model('Schedule', scheduleSchema);