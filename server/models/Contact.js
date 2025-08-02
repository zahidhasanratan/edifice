// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  address: String,
  telephone: String,
  home: String,
  hotline: String,
  email: String,
  mapIframe: String, // ✅ Add this if missing
});

module.exports = mongoose.model('Contact', contactSchema);
