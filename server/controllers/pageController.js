const Page = require('../models/Page');

// ✅ Create a new page
const createPage = async (req, res) => {
  try {
    const { title, subTitle, menuSlug, description, coverPhoto } = req.body;

    if (!title || !menuSlug) {
      return res.status(400).json({ message: 'Title and menuSlug are required' });
    }

    const newPage = new Page({
      title,
      subTitle,
      menuSlug,
      description,
      coverPhoto,
    });

    const saved = await newPage.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ message: 'Server error creating page' });
  }
};

// ✅ Get all pages
const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pages' });
  }
};

// ✅ Get single page by ID
const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    console.error('Error fetching page:', err);
    res.status(500).json({ message: 'Error fetching page' });
  }
};

// ✅ Update page by ID
const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Page.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Page not found' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating page:', err);
    res.status(500).json({ message: 'Error updating page' });
  }
};

// ✅ Delete page by ID
const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Page.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Page not found' });
    res.json({ message: 'Page deleted successfully' });
  } catch (err) {
    console.error('Error deleting page:', err);
    res.status(500).json({ message: 'Error deleting page' });
  }
};

module.exports = {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
  deletePage,
};
