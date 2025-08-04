// models/menu.js
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  menu_name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null },
  page_type: { type: String },
  external_link: { type: String },
  target: { type: String },
  display: { type: Boolean, default: false },
  footer1: { type: Boolean, default: false },
  footer2: { type: Boolean, default: false },
  sequence: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model('Menu', menuSchema);
