// controllers/projectController.js
const Project = require('../models/Project');

// Create Project
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      address,
      exactLocation,
      overview,
      youtubeUrl,
      googleMapLocation,
      projectType,
      specs,
      featureImage,
      innerBannerImage,
      mainImage,
      multiplePhotos,
      showHome, // ✅ accept from body (optional)
    } = req.body;

    const newProject = new Project({
      title,
      subtitle,
      address,
      exactLocation,
      overview,
      youtubeUrl,
      googleMapLocation,
      projectType,
      specs, // array of { title, value }
      featureImage,
      innerBannerImage,
      mainImage,
      multiplePhotos,
      showHome,
    });

    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create Project Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Get All Projects (optional filter: ?home=true to return only showHome projects)
exports.getAllProjects = async (req, res) => {
  try {
    const { home } = req.query;
    const filter = home === 'true' ? { showHome: true } : {};
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
};

// Get Single Project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project', error: err.message });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating project', error: err.message });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
};

// ✅ Toggle "Show on Home" (PATCH /projects/:id/show-home)
exports.toggleShowHome = async (req, res) => {
  try {
    const { id } = req.params;
    const { showHome } = req.body;
    if (typeof showHome !== 'boolean') {
      return res.status(400).json({ message: 'showHome must be boolean' });
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      { showHome },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating showHome', error: err.message });
  }
};
