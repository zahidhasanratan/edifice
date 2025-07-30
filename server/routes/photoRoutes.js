const express = require('express');
const router = express.Router();
const {
  createPhoto,
  getAllPhotos,
  getPhotoById,
  updatePhoto,
  deletePhoto,
} = require('../controllers/photoController');

router.post('/', createPhoto);
router.get('/', getAllPhotos);
router.get('/:id', getPhotoById);
router.put('/:id', updatePhoto);
router.delete('/:id', deletePhoto);

module.exports = router;
