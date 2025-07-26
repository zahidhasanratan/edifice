const Slider = require("../models/Slider");

// GET all sliders
exports.getAllSliders = async (req, res) => {
  const sliders = await Slider.find();
  res.json(sliders);
};

// GET single slider by ID
exports.getSliderById = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: "Slider not found" });
    res.json(slider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE new slider
exports.createSlider = async (req, res) => {
  const newSlider = new Slider(req.body);
  const saved = await newSlider.save();
  res.json({ insertedId: saved._id });
};

// UPDATE slider by ID
exports.updateSlider = async (req, res) => {
  try {
    const updated = await Slider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ updatedId: updated._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE slider
exports.deleteSlider = async (req, res) => {
  const deleted = await Slider.findByIdAndDelete(req.params.id);
  res.json({ deletedCount: deleted ? 1 : 0 });
};
