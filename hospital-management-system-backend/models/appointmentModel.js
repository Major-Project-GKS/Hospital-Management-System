const mongoose = require('mongoose');
const { getNextSequenceValue } = require('./counterModel'); 

const appointmentSchema = new mongoose.Schema({
  appointment_id: { type: String, unique: true },
  patient_id: { type: String, required: true },
  patient_name: { type: String, required: true },
  doctor_id: { type: String, required: true },
  doctor_name: { type: String, required: true }, // Mapped consistently to prevent document validation failures
  date: { type: String, required: true },
  time_slot: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Waiting', 'Completed', 'Absent'], 
    default: 'Waiting' 
  },
  serial_number: { type: Number }
}, { timestamps: true });

// Pre-save autoincrement ID hook configuration
appointmentSchema.pre('save', async function () {
  try {
    if (this.isNew) {
      const seq = await getNextSequenceValue('appointment_id');
      this.appointment_id = `AP${seq.toString().padStart(4, '0')}`;
    }
  } catch (error) {
    throw error;
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);