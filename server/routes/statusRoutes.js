// routes/statusRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/statusController");

// List all (sequence ASC)
router.get("/", ctrl.getAll);

// Get single
router.get("/:id", ctrl.getById);

// Create
router.post("/", ctrl.create);

// Update
router.put("/:id", ctrl.update);
router.patch("/:id", ctrl.update); // optional convenience

// Delete
router.delete("/:id", ctrl.remove);

module.exports = router;
