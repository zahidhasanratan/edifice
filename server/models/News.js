const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    publishDate: {
      type: Date,
      required: true,
    },
    shortDetails: {
      type: String,
      required: true,
    },
    featuredPhoto: {
      type: String,
      required: true,
    },
    coverPhoto: {
      type: String,
      required: true, // ✅ added coverPhoto as required
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
