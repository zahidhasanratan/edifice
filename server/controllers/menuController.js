const Menu = require('../models/Menu');
const slugify = require('slugify');

// ✅ Get all menus (flat list for dropdowns or tree building)
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find().sort({ order: 1 }).lean(); // Fetch all menus regardless of parent
    res.json(menus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching menus' });
  }
};

// ✅ Create a menu
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
      footer2
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
    console.error(err);
    res.status(500).json({ message: 'Error creating menu' });
  }
};

// ✅ Reorder menus
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

    res.json({ message: 'Order updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error reordering menus' });
  }
};

// ✅ Update menu
const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await Menu.findByIdAndUpdate(id, updateData);
    res.json({ message: 'Menu updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating menu' });
  }
};

// ✅ Get a single menu by ID
const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching menu' });
  }
};

// ✅ Delete menu
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);
    res.json({ message: 'Menu deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting menu' });
  }
};

module.exports = {
  getAllMenus,
  createMenu,
  reorderMenus,
  updateMenu,
  getMenuById,
  deleteMenu
};
