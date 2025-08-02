// models/Stats.js
const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  visitors: Number,
  growth: Number,
}, { timestamps: true });

module.exports = mongoose.model('Stats', statsSchema);
