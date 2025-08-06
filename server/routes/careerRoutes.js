const express = require('express');
const router = express.Router();
const Career = require('../models/Career');

// POST /api/careers - Create a new career entry
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      job_summary,
      location,
      jobFunction,
      jobType,
      link,
      image,
    } = req.body;

    const newCareer = new Career({
      title,
      description,
      job_summary,
      location,
      jobFunction,
      jobType,
      link,
      image,
    });

    const savedCareer = await newCareer.save();
    res.status(201).json(savedCareer);
  } catch (error) {
    console.error('Error adding career:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/careers - Get all careers
router.get('/', async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.status(200).json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/careers/:id - Get a single career by ID
router.get('/:id', async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Career not found' });
    res.status(200).json(career);
  } catch (error) {
    console.error('Error fetching career:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/careers/:id - Update a career
router.put('/:id', async (req, res) => {
  try {
    const updatedCareer = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCareer) {
      return res.status(404).json({ message: 'Career not found' });
    }

    res.status(200).json(updatedCareer);
  } catch (error) {
    console.error('Error updating career:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/careers/:id - Delete a career
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Career.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Career not found' });
    res.status(200).json({ message: 'Career deleted successfully' });
  } catch (error) {
    console.error('Error deleting career:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
