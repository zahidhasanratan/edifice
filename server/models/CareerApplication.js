const mongoose = require('mongoose');

const careerApplicationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  message: String,
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    required: true,
  },
  resumeUrl: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('CareerApplication', careerApplicationSchema);
