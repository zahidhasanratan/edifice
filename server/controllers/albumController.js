const Album = require('../models/Album');

// Create Album
exports.createAlbum = async (req, res) => {
  try {
    const { title, coverPhoto } = req.body;

    if (!title || !coverPhoto) {
      return res.status(400).json({ message: 'Title and cover photo are required.' });
    }

    const newAlbum = new Album({ title, coverPhoto });
    await newAlbum.save();

    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Albums
exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch albums', error: error.message });
  }
};

// Get Single Album
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get album', error: error.message });
  }
};

// ✅ Update Album
exports.updateAlbum = async (req, res) => {
  try {
    const { title, coverPhoto } = req.body;

    if (!title || !coverPhoto) {
      return res.status(400).json({ message: 'Title and cover photo are required.' });
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      { title, coverPhoto },
      { new: true }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update album', error: error.message });
  }
};

// Delete Album
exports.deleteAlbum = async (req, res) => {
  try {
    const result = await Album.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Album not found' });
    res.json({ message: 'Album deleted successfully', deletedId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete album', error: error.message });
  }
};
