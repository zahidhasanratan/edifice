const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    job_summary: { type: String },
    location: { type: String },
    jobFunction: { type: String },
    jobType: { type: String },
    link: { type: String },
    image: { type: String }, // Imgbb URL
  },
  { timestamps: true }
);

module.exports = mongoose.model('Career', careerSchema);
