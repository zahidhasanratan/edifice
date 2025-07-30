const express = require("express");
const router = express.Router();
const {
  createTestimonial,
  getTestimonials,
  getSingleTestimonial, // ✅ import it
  deleteTestimonial,
  updateTestimonial,
} = require("../controllers/testimonialController");

router.post("/", createTestimonial);
router.get("/", getTestimonials);
router.get("/:id", getSingleTestimonial); // ✅ this is the missing route
router.delete("/:id", deleteTestimonial);
router.put("/:id", updateTestimonial);

module.exports = router;
