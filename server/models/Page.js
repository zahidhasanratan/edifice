const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String },
  menuSlug: { type: String, required: true },
  description: { type: String },
  coverPhoto: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
