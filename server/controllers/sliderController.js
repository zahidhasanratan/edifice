const Slider = require("../models/Slider");

const addSlider = async (req, res) => {
  try {
    const { title, subtitle, image, status } = req.body;

    if (!title || !image) {
      return res.status(400).json({ message: "Title and Image are required" });
    }

    const newSlider = new Slider({ title, subtitle, image, status });
    const savedSlider = await newSlider.save();

    res.status(201).json({ insertedId: savedSlider._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 });
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addSlider, getSliders };
