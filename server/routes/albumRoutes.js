const express = require('express');
const router = express.Router();
const {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,         // ✅ NEW
  deleteAlbum,
} = require('../controllers/albumController');

// POST /api/albums
router.post('/', createAlbum);

// GET /api/albums
router.get('/', getAllAlbums);

// GET /api/albums/:id
router.get('/:id', getAlbumById);

// ✅ PUT /api/albums/:id
router.put('/:id', updateAlbum);

// DELETE /api/albums/:id
router.delete('/:id', deleteAlbum);

module.exports = router;
