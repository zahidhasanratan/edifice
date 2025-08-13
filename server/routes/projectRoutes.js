// routes/projectRoutes.js
const express = require('express');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleShowHome,       // ✅ import toggle controller
} = require('../controllers/projectController');

const router = express.Router();

// Create
router.post('/', createProject);

// Read
router.get('/', getAllProjects);          // supports ?home=true
router.get('/:id', getProjectById);

// Update
router.put('/:id', updateProject);

// Toggle "Show on Home"
router.patch('/:id/show-home', toggleShowHome);  // ✅ PATCH /api/projects/:id/show-home

// Delete
router.delete('/:id', deleteProject);

module.exports = router;
