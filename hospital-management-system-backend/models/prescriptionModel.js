const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointment_id: { type: String, required: true },
  patient_id: { type: String, required: true },
  doctor_id: { type: String, required: true },
  doctor_name: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true }, // e.g., 1-0-1
    duration: { type: String, required: true } // e.g., 5 days
  }],
  advice: { type: String },
  date: { type: String, default: () => new Date().toLocaleDateString('en-CA') }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);