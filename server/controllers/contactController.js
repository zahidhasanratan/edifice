const Contact = require('../models/Contact');

// Get contact (only one record expected)
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne(); // Single document only
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error });
  }
};

// Update contact (update first/only document)
exports.updateContact = async (req, res) => {
  try {
    const existing = await Contact.findOne();
    if (!existing) return res.status(404).json({ message: 'Contact not found' });

    existing.address = req.body.address || '';
    existing.telephone = req.body.telephone || '';
    existing.home = req.body.home || '';
    existing.hotline = req.body.hotline || '';
    existing.email = req.body.email || '';
    existing.mapIframe = req.body.mapIframe || ''; // ✅ Include this field

    await existing.save();
    res.json({ message: 'Contact updated successfully', data: existing });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error });
  }
};
