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
      multiplePhotos
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
      multiplePhotos
    });

    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create Project Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
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
