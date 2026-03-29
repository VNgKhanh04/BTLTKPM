const mongoose = require('mongoose');

const researcherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: String,
  position: String,
  specialization: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Researcher', researcherSchema);
