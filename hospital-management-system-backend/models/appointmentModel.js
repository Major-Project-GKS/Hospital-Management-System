// models/appointmentModel.js
const mongoose = require('mongoose');
const { getNextSequenceValue } = require('./counterModel');

const appointmentSchema = new mongoose.Schema({
  appointment_id: { type: String, unique: true }, // e.g., AP1001
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  department: { type: String, required: true },
  appointment_date: { type: Date, required: true },
  time_slot: { type: String, required: true },
  queue_number: { type: Number },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Absent'],
    default: 'Scheduled'
  },
  prescription_text: { type: String }, // Doctor's notes
  prescription_file: { type: String }  // Uploaded prescription file
}, { timestamps: true });

// Generate unique APXXXX ID before saving
appointmentSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
  }
  const seq_value = await getNextSequenceValue('appointment_id');
  const padded_value = seq_value.toString().padStart(4, '0');
  this.appointment_id = `AP${padded_value}`;
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);