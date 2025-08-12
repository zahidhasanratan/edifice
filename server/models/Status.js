// models/Status.js
const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true }, // CKEditor HTML
    featuredPhoto: { type: String, required: true }, // URL from imgbb
    sequence: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// Optional: helpful JSON cleanup
StatusSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Status", StatusSchema);
