const Media = require('../models/Media');

exports.uploadMedia = async (req, res) => {
  try {
    console.log('Uploaded File:', req.file); // ✅ log for debugging

    const { originalname } = req.file;
    const fileUrl = req.file.path;
    const title = req.body.title || originalname;
    const fileType = req.file.mimetype.split('/')[0];

    const media = new Media({
      title,
      fileUrl,
      fileType: ['application', 'text'].includes(fileType) ? 'doc' : fileType,
    });

    await media.save();
    res.status(201).json(media);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

exports.getAllMedia = async (req, res) => {
  try {
    const all = await Media.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching media' });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};
