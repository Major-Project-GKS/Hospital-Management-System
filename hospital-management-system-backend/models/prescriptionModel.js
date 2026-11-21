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
  weight: {
    type: String,
    required: false,
    default: ""
  },
  bp: {
    type: String,
    required: false,
    default: ""
  },
  lab_tests: {
    type: String,
    required: false,
    default: ""
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
      required: true 
    }, 
    duration: { 
      type: String, 
      required: false,
      default: "As directed"
    } 
  }],
  advice: { 
    type: String,
    default: ""
  },
  date: { 
    type: String, 
    default: () => new Date().toLocaleDateString('en-CA') 
  }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);