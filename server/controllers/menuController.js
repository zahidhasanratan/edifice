// controllers/menuController.js

const Menu = require('../models/Menu');
const slugify = require('slugify');

// ✅ Get all menus (for dropdowns or nested menu structure)
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find().sort({ order: 1 }).lean();
    res.json(menus);
  } catch (err) {
    console.error('Error fetching menus:', err);
    res.status(500).json({ message: 'Error fetching menus' });
  }
};

// ✅ Create a new menu
const createMenu = async (req, res) => {
  try {
    const {
      menu_name,
      parent,
      page_type,
      external_link,
      target,
      display,
      sequence,
      footer1,
      footer2,
    } = req.body;

    const slug = slugify(menu_name, { lower: true });

    const newMenu = new Menu({
      menu_name,
      slug,
      parent: parent || null,
      page_type,
      external_link,
      target,
      display,
      sequence,
      footer1,
      footer2,
    });

    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    console.error('Error creating menu:', err);
    res.status(500).json({ message: 'Error creating menu', error: err.message });
  }
};

// ✅ Get a single menu by ID
const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    res.json(menu);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ message: 'Error fetching menu' });
  }
};

// ✅ Update an existing menu
const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      menu_name,
      parent,
      page_type,
      external_link,
      target,
      display,
      sequence,
      footer1,
      footer2,
    } = req.body;

    const slug = slugify(menu_name, { lower: true });

    const updated = await Menu.findByIdAndUpdate(
      id,
      {
        menu_name,
        slug,
        parent: parent || null,
        page_type,
        external_link,
        target,
        display,
        sequence,
        footer1,
        footer2,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating menu:', err);
    res.status(500).json({ message: 'Error updating menu', error: err.message });
  }
};

// ✅ Delete a menu
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Menu.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json({ message: 'Menu deleted' });
  } catch (err) {
    console.error('Error deleting menu:', err);
    res.status(500).json({ message: 'Error deleting menu' });
  }
};

// ✅ Reorder menus (for drag & drop sorting)
const reorderMenus = async (req, res) => {
  try {
    const { menus } = req.body;
    let orderIndex = 0;

    for (const menu of menus) {
      await Menu.findByIdAndUpdate(menu._id, { order: orderIndex, parent: null });

      if (menu.children && menu.children.length) {
        for (let i = 0; i < menu.children.length; i++) {
          await Menu.findByIdAndUpdate(menu.children[i]._id, {
            order: i,
            parent: menu._id,
          });
        }
      }

      orderIndex++;
    }

    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    console.error('Error reordering menus:', err);
    res.status(500).json({ message: 'Error reordering menus' });
  }
};

module.exports = {
  getAllMenus,
  createMenu,
  getMenuById,
  updateMenu,
  deleteMenu,
  reorderMenus,
};
