const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Researcher' }],
  journal: String,
  year: Number,
  doi: String,
  abstract: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Publication', publicationSchema);
