const mongoose = require('mongoose');
const { getNextSequenceValue } = require('./counterModel'); 

const appointmentSchema = new mongoose.Schema({
  appointment_id: { type: String, unique: true },
  patient_id: { type: String, required: true },
  doctor_id: { type: String, required: true },
  patient_name: { type: String, required: true },
  date: { type: String, required: true },
  time_slot: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Waiting', 'Completed', 'Absent'], 
    default: 'Waiting' 
  },
  serial_number: { type: Number }
}, { timestamps: true });

// ✅ MODERN FIX: Remove 'next' argument. 
// When using async/await, Mongoose knows when you are done without calling next()
appointmentSchema.pre('save', async function () {
  try {
    if (this.isNew) {
      // Fetch the next sequence number (e.g., 5)
      const seq = await getNextSequenceValue('appointment_id');
      
      // Format it as AP0005
      this.appointment_id = `AP${seq.toString().padStart(4, '0')}`;
    }
  } catch (error) {
    // Re-throw the error so the controller can catch it
    throw error;
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);