const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  location: { type: String, default: "SeminarA" },
  temperature: Number,
  humidity: Number,
  description: String,
  ts: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Reading', ReadingSchema);
