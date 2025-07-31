const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    title: String,
    fileUrl: String,
    fileType: String, // e.g., 'pdf', 'doc', 'mp4', 'png'
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);
