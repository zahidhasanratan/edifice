const News = require("../models/News");

// @desc Create a news article
// @route POST /api/news
exports.createNews = async (req, res) => {
  try {
    const { title, publishDate, shortDetails, featuredPhoto, description } = req.body;

    if (!title || !publishDate || !shortDetails || !featuredPhoto || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newNews = new News({
      title,
      publishDate,
      shortDetails,
      featuredPhoto,
      description,
    });

    const savedNews = await newNews.save();
    res.status(201).json(savedNews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all news with optional pagination
// @route GET /api/news
exports.getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const total = await News.countDocuments();
    const news = await News.find()
      .sort({ publishDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total,
      page,
      limit,
      news,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single news article
// @route GET /api/news/:id
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update news article
// @route PUT /api/news/:id
exports.updateNews = async (req, res) => {
  try {
    const { title, publishDate, shortDetails, featuredPhoto, description } = req.body;

    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { title, publishDate, shortDetails, featuredPhoto, description },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "News not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete news article
// @route DELETE /api/news/:id
exports.deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
