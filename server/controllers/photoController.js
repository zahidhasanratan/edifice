const Photo = require('../models/Photo');

// Add new photo
exports.createPhoto = async (req, res) => {
  try {
    const { title, album, imageUrl } = req.body;

    if (!album || !imageUrl || !title) {
      return res.status(400).json({ message: 'Album, title and image are required' });
    }

    const newPhoto = new Photo({ title, album, imageUrl });
    await newPhoto.save();

    res.status(201).json(newPhoto);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all photos
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().populate('album', 'title').sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photos', error: error.message });
  }
};

// Get single photo by ID
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photo', error: error.message });
  }
};

// Update photo
exports.updatePhoto = async (req, res) => {
  try {
    const { title, album, imageUrl } = req.body;
    const updated = await Photo.findByIdAndUpdate(
      req.params.id,
      { title, album, imageUrl },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Photo not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating photo', error: error.message });
  }
};

// Delete photo
exports.deletePhoto = async (req, res) => {
  try {
    const deleted = await Photo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Photo not found' });
    res.json({ message: 'Photo deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting photo', error: error.message });
  }
};
