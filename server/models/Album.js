const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    coverPhoto: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Album', albumSchema);
