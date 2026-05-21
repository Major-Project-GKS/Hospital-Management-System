const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointment_id: { 
    type: String, 
    required: true 
  },
  patient_id: { 
    type: String, 
    required: true 
  },
  doctor_id: { 
    type: String, 
    required: true 
  },
  doctor_name: { 
    type: String, 
    required: true 
  },
  diagnosis: { 
    type: String, 
    required: true 
  },
  medicines: [{
    name: { 
      type: String, 
      required: true 
    },
    dosage: { 
      type: String, 
      required: true // e.g., "1-0-1" or "1 tablet"
    }, 
    duration: { 
      type: String, 
      required: false, // ✅ FIXED: Changed to false to prevent validation crashes
      default: "As directed" // ✅ FIXED: Fallback if doctor leaves it blank
    } 
  }],
  advice: { 
    type: String,
    default: ""
  },
  date: { 
    type: String, 
    // ✅ FIXED: Keeps it a function wrapped execution so it evaluates at document generation time, not server boot time
    default: () => new Date().toLocaleDateString('en-CA') 
  }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);