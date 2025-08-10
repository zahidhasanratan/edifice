const mongoose = require('mongoose');

const ConsentSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, unique: true },
    consent: { type: Boolean, required: true },  // true = accepted, false = declined
    bannerVersion: { type: String, default: 'v1' }, // optional for tracking banner versions
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }  // auto add createdAt, updatedAt
);

module.exports = mongoose.model('Consent', ConsentSchema);
