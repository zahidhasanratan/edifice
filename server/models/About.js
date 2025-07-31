const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: String,
  shortDescription: String,
  description: String,
  featurePhoto: String,
  coverPhoto: String,
  tag1: String,
  tag2: String,
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
