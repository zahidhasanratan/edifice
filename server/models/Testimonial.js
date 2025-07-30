// server/models/Testimonial.js
const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  shortDesc: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Testimonial", testimonialSchema);
