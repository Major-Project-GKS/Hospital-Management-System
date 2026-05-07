// models/doctorModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getNextSequenceValue } = require('./counterModel');

const doctorSchema = new mongoose.Schema({
  doctor_id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
  },
  aadhar_number: {
    type: String,
    required: [true, 'Please add an Aadhar number'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  department: {
    type: String,
    required: [true, 'Please add a department'],
  },
  experience: {
    type: Number,
    required: [true, 'Please add experience in years'],
  },
  state: {
    type: String,
    required: [true, 'Please add state'],
  },
  region_city: {
    type: String,
    required: [true, 'Please add region/city'],
  },
  comfortable_language: {
    type: String,
    required: [true, 'Please add comfortable languages'],
  },
  photo: String,
  certified_proof: String, // PDF or Image
  schedule: [
    {
      day: String, // e.g., 'Tuesday', 'Wednesday'
      time_slot: String, // e.g., '09:00 AM - 01:00 PM'
    }
  ]
}, { timestamps: true });

// 1. Pre-save hook to generate DRXXXX ID automatically (Modern async way)
doctorSchema.pre('save', async function () {
  if (!this.isNew) {
    return; // Exit if not a new document
  }
  const seq_value = await getNextSequenceValue('doctor_id');
  const padded_value = seq_value.toString().padStart(4, '0');
  this.doctor_id = `DR${padded_value}`;
});

// 2. Pre-save hook to scramble (hash) the password for security
doctorSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; // Exit if password hasn't changed
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// THE CRITICAL EXPORT LINE
module.exports = mongoose.model('Doctor', doctorSchema);