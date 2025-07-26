const express = require("express");
const router = express.Router();
const {
  getAllSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
} = require("../controllers/sliderController");

router.get("/", getAllSliders);
router.get("/:id", getSliderById);
router.post("/", createSlider);
router.put("/:id", updateSlider);
router.delete("/:id", deleteSlider);

module.exports = router;
