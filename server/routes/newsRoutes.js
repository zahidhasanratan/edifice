// routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');

// ✅ GET single news article by ID
router.get('/:id', getNewsById);

// ✅ GET all news with search and pagination
router.get('/', getAllNews);

// ✅ Create news
router.post('/', createNews);

// ✅ Update news
router.put('/:id', updateNews);

// ✅ Delete news
router.delete('/:id', deleteNews);

module.exports = router;
