// routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const News = require('../models/News');

// GET all news with optional search and pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, search = '' } = req.query;
    const limit = 10;
    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const news = await News.find(query)
      .sort({ publishDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await News.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({ news, totalPages });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
