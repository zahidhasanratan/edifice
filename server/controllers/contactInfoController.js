// server/controllers/contactInfoController.js

const ContactInfo = require('../models/ContactInfo');

// GET contact info
const getContactInfo = async (req, res) => {
  try {
    const info = await ContactInfo.findOne(); // only one document expected
    if (!info) return res.status(404).json({ message: 'Contact info not found' });
    res.json(info);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE contact info
const updateContactInfo = async (req, res) => {
  try {
    let info = await ContactInfo.findOne();

    if (!info) {
      // If not found, create new
      info = new ContactInfo(req.body);
    } else {
      // If found, update existing
      Object.assign(info, req.body);
    }

    await info.save();
    res.json({ success: true, message: 'Contact info updated', info });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

module.exports = {
  getContactInfo,
  updateContactInfo,
};
