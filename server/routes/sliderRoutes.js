const express = require("express");
const router = express.Router();
const { addSlider, getSliders } = require("../controllers/sliderController");

router.post("/", addSlider);
router.get("/", getSliders);

module.exports = router;
