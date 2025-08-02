const Menu = require('../models/Menu');
const slugify = require('slugify');

exports.createMenu = async (req, res) => {
  try {
    const {
      menu_name, root_id, sroot_id, troot_id,
      page_type, external_link, sequence,
      target, display, footer1, footer2
    } = req.body;

    const slug = slugify(menu_name, { lower: true });

    const newMenu = new Menu({
      menu_name,
      slug,
      root_id,
      sroot_id,
      troot_id,
      page_type,
      external_link,
      sequence: sequence || 0,
      target,
      display: display || false,
      footer1: footer1 || false,
      footer2: footer2 || false
    });

    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ message: 'Menu creation failed', error: error.message });
  }
};
