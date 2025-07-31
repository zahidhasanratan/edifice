const About = require('../models/About');

// GET: Fetch the About info (expecting single document)
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(200).json({}); // Return empty if not found
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching About data' });
  }
};

// PUT: Update or create the About info
exports.updateAbout = async (req, res) => {
  try {
    const existing = await About.findOne();
    let updated;

    if (existing) {
      updated = await About.findByIdAndUpdate(existing._id, req.body, { new: true });
    } else {
      updated = await About.create(req.body);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating About data' });
  }
};
