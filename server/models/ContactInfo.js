const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  address: { type: String, default: '' },
  telephone: { type: String, default: '' },
  home: { type: String, default: '' },
  hotline: { type: String, default: '' },
  email: { type: String, default: '' },
  mapIframe: { type: String, default: '' },
}, { timestamps: true });

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

module.exports = ContactInfo;
