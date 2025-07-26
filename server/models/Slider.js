const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
  status: { type: Boolean, default: true },
}, {
  timestamps: true
});

module.exports = mongoose.model("Slider", sliderSchema);
