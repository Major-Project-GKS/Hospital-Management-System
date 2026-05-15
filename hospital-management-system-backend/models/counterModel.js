// models/counterModel.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true } // Updated 'new' to 'returnDocument'
  );
  return sequenceDocument.seq;
};

module.exports = { Counter, getNextSequenceValue };