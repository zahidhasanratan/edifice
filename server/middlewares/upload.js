const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split('.').pop();
    return {
      folder: 'media_gallery',
      resource_type: 'raw',     // ✅ Crucial for non-image files like PDFs, DOCX
      format: ext,
      access_mode: 'public',    // ✅ Ensures public accessibility
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
