const Slider = require("../models/Slider");

// ✅ GET all sliders
exports.getAllSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.find();
    res.status(200).json(sliders);
  } catch (err) {
    next(err); // Pass to global error handler
  }
};

// ✅ GET single slider by ID
exports.getSliderById = async (req, res, next) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }
    res.status(200).json(slider);
  } catch (err) {
    next(err);
  }
};

// ✅ CREATE new slider
exports.createSlider = async (req, res, next) => {
  try {
    const newSlider = new Slider(req.body);
    const saved = await newSlider.save();
    res.status(201).json({ insertedId: saved._id });
  } catch (err) {
    next(err);
  }
};

// ✅ UPDATE slider by ID
exports.updateSlider = async (req, res, next) => {
  try {
    const updated = await Slider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Slider not found" });
    }
    res.status(200).json({ updatedId: updated._id });
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE slider
exports.deleteSlider = async (req, res, next) => {
  try {
    const deleted = await Slider.findByIdAndDelete(req.params.id);
    res.status(200).json({ deletedCount: deleted ? 1 : 0 });
  } catch (err) {
    next(err);
  }
};
