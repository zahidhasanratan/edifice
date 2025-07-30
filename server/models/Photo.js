const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Photo', photoSchema);
