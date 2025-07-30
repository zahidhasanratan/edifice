const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  address: String,
  exactLocation: String,
  overview: String,
  youtubeUrl: String,
  googleMapLocation: String,
  projectType: { type: String, enum: ['Ongoing', 'Completed', 'Upcoming'], default: 'Ongoing' },
  specs: [{ title: String, value: String }],
  featureImage: String,
  innerBannerImage: String,
  mainImage: String,
  multiplePhotos: [String]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
