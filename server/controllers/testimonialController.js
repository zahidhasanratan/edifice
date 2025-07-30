const Testimonial = require("../models/Testimonial");

const createTestimonial = async (req, res) => {
  try {
    const { title, shortDesc, clientName, designation, photo } = req.body;

    const newTestimonial = new Testimonial({
      title,
      shortDesc,
      clientName,
      designation,
      photo,
    });

    const savedTestimonial = await newTestimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (err) {
    res.status(400).json({ error: "Error creating testimonial", message: err.message });
  }
};

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (err) {
    res.status(400).json({ error: "Error fetching testimonials", message: err.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Testimonial.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.status(200).json({ message: "Testimonial deleted", deletedCount: result ? 1 : 0 });
  } catch (err) {
    res.status(400).json({ error: "Error deleting testimonial", message: err.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single testimonial by ID
const getSingleTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  createTestimonial,
  getTestimonials,
  getSingleTestimonial,
  deleteTestimonial,
  updateTestimonial
};
