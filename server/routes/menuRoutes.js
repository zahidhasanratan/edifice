const express = require('express');
const router = express.Router();
const {
  getAllMenus,
  createMenu,
  reorderMenus,
  deleteMenu,
  getMenuById,
  updateMenu
} = require('../controllers/menuController');

router.get('/all', getAllMenus); // ✅ this line must exist
router.post('/', createMenu);
router.put('/reorder', reorderMenus);
router.get('/:id', getMenuById);
router.put('/:id', updateMenu);
router.delete('/:id', deleteMenu);

module.exports = router;
