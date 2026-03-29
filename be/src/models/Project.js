const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['planning', 'ongoing', 'completed', 'cancelled'], default: 'planning' },
  budget: Number,
  researchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Researcher' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
