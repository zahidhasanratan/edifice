const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  menu_name: { type: String, required: true },
  slug: { type: String },
  root_id: { type: String, default: null },
  sroot_id: { type: String, default: null },
  troot_id: { type: String, default: null },
  page_type: { type: String },
  external_link: { type: String },
  sequence: { type: Number, default: 0 },
  target: { type: String },
  display: { type: Boolean, default: false },
  footer1: { type: Boolean, default: false },
  footer2: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
