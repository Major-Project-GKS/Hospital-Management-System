// models/managerModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getNextSequenceValue } = require('./counterModel');

const managerSchema = new mongoose.Schema({
  manager_id: {
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
  photo: String,
}, { timestamps: true });

// 1. Pre-save hook to generate HMXXXX ID automatically (Modern async way)
managerSchema.pre('save', async function () {
  if (!this.isNew) {
    return; // Exit if not a new document
  }
  const seq_value = await getNextSequenceValue('manager_id');
  const padded_value = seq_value.toString().padStart(4, '0');
  this.manager_id = `HM${padded_value}`;
});

// 2. Pre-save hook to scramble (hash) the password for security
managerSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; // Exit if password hasn't changed
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Manager', managerSchema);