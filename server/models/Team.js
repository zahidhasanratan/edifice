const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    sequence: { type: Number, default: 0 },
    photo: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
