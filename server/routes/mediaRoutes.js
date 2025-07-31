const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  uploadMedia,
  getAllMedia,
  deleteMedia,
} = require('../controllers/mediaController');

router.post('/', upload.single('file'), uploadMedia);
router.get('/', getAllMedia);
router.delete('/:id', deleteMedia);

module.exports = router;
