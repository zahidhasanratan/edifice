const express = require('express');
const router = express.Router();
const {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
  deletePage,
} = require('../controllers/pageController');

// Create a new page
router.post('/', createPage);

// Get all pages
router.get('/', getAllPages);

// Get single page by ID
router.get('/:id', getPageById);

// Update page by ID
router.put('/:id', updatePage);

// Delete page by ID
router.delete('/:id', deletePage);

module.exports = router;
