// controllers/statusController.js
const Status = require("../models/Status");

/**
 * GET /api/status
 * List all statuses sorted by sequence ASC (then createdAt ASC)
 */
exports.getAll = async (_req, res) => {
  try {
    const items = await Status.find().sort({ sequence: 1, createdAt: 1 }).lean();
    return res.json(items);
  } catch (err) {
    console.error("Error fetching statuses:", err);
    return res.status(500).json({ message: "Error fetching statuses" });
  }
};

/**
 * GET /api/status/:id
 * Get single status by ID
 */
exports.getById = async (req, res) => {
  try {
    const item = await Status.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Status not found" });
    return res.json(item);
  } catch (err) {
    console.error("Error fetching status:", err);
    return res.status(500).json({ message: "Error fetching status" });
  }
};

/**
 * POST /api/status
 * Create a new status
 * Body: { title, description, featuredPhoto, coverPhoto?, sequence }
 */
exports.create = async (req, res) => {
  try {
    const { title, description, featuredPhoto, coverPhoto, sequence } = req.body;

    const missing = [];
    if (!title || !String(title).trim()) missing.push("title");
    if (!description || !String(description).trim()) missing.push("description");
    if (!featuredPhoto || !String(featuredPhoto).trim()) missing.push("featuredPhoto");
    if (sequence === undefined || sequence === null || isNaN(Number(sequence))) missing.push("sequence");

    if (missing.length) {
      return res.status(400).json({ message: `Missing/invalid: ${missing.join(", ")}` });
    }

    const newItem = new Status({
      title: String(title).trim(),
      description,
      featuredPhoto,
      coverPhoto: coverPhoto || "",               // optional
      sequence: Number(sequence),
    });

    const saved = await newItem.save();

    // Return insertedId to match frontend check
    return res.status(201).json({ insertedId: saved._id });
  } catch (err) {
    console.error("Error creating status:", err);
    return res.status(500).json({ message: "Error creating status" });
  }
};

/**
 * PUT/PATCH /api/status/:id
 * Update status by ID
 * Body can include any of: { title, description, featuredPhoto, coverPhoto, sequence }
 */
exports.update = async (req, res) => {
  try {
    const { title, description, featuredPhoto, coverPhoto, sequence } = req.body;

    const update = {};
    if (title !== undefined) update.title = String(title).trim();
    if (description !== undefined) update.description = description;
    if (featuredPhoto !== undefined) update.featuredPhoto = featuredPhoto;
    if (coverPhoto !== undefined) update.coverPhoto = coverPhoto;
    if (sequence !== undefined) {
      if (isNaN(Number(sequence))) {
        return res.status(400).json({ message: "sequence must be a number" });
      }
      update.sequence = Number(sequence);
    }

    const updated = await Status.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Status not found" });
    return res.json(updated);
  } catch (err) {
    console.error("Error updating status:", err);
    return res.status(500).json({ message: "Error updating status" });
  }
};

/**
 * DELETE /api/status/:id
 * Delete status by ID
 */
exports.remove = async (req, res) => {
  try {
    const deleted = await Status.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Status not found" });
    return res.json({ success: true, message: "Status deleted" });
  } catch (err) {
    console.error("Error deleting status:", err);
    return res.status(500).json({ message: "Error deleting status" });
  }
};
