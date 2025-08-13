// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    address: { type: String, default: '' },
    exactLocation: { type: String, default: '' },
    overview: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    googleMapLocation: { type: String, default: '' },
    projectType: {
      type: String,
      enum: ['Ongoing', 'Completed', 'Upcoming'],
      default: 'Ongoing',
    },
    specs: [{ title: String, value: String }],
    featureImage: { type: String, default: '' },
    innerBannerImage: { type: String, default: '' },
    mainImage: { type: String, default: '' },
    multiplePhotos: [String],

    // ✅ New field to control if a project appears on the homepage
    showHome: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
