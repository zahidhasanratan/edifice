// controllers/careerApplicationController.js
const CareerApplication = require("../models/CareerApplication");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Submit a new job application with resume upload
const submitApplication = async (req, res) => {
  try {
    const { jobId, fullName, email, phone, coverLetter } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    // Upload resume to Cloudinary
    const bufferStream = streamifier.createReadStream(req.file.buffer);

    const cloudinaryUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "career_applications/resumes",
          resource_type: "raw", // for PDF/DOC/DOCX
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      bufferStream.pipe(stream);
    });

    const newApplication = new CareerApplication({
      jobId,
      fullName,
      email,
      phone,
      coverLetter,
      resumeUrl: cloudinaryUpload.secure_url,
    });

    await newApplication.save();

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("❌ Error submitting application:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single application by ID
const getApplicationById = async (req, res) => {
  try {
    const application = await CareerApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (error) {
    console.error("❌ Error fetching application:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all applications by Job ID (for admin panel)
const getApplicationsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await CareerApplication.find({ jobId }).sort({
      createdAt: -1,
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("❌ Error fetching applications by jobId:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  submitApplication,
  getApplicationById,
  getApplicationsByJobId,
};
