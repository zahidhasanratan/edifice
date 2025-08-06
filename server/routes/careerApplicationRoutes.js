// routes/careerApplicationRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  submitApplication,
  getApplicationById,
  getApplicationsByJobId,
} = require("../controllers/careerApplicationController");

// Use in-memory storage for Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST: Submit a new application with resume upload
router.post("/", upload.single("resume"), submitApplication);

// GET: Get a single application by its _id
router.get("/:id", getApplicationById);

// ✅ GET: Get all applications by jobId (used in admin to view applicants for a job)
router.get("/job/:jobId", getApplicationsByJobId);

module.exports = router;
