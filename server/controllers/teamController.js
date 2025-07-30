const Team = require('../models/Team');

// Create Team Member
exports.createTeamMember = async (req, res) => {
  try {
    const { name, designation, sequence, photo } = req.body;

    const newMember = new Team({ name, designation, sequence, photo });
    const saved = await newMember.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error('Create Team Member Error:', err);
    res.status(500).json({ message: 'Failed to create team member', error: err.message });
  }
};

// Get All Team Members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const members = await Team.find().sort({ sequence: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team members', error: err.message });
  }
};

// Get Single Team Member
exports.getTeamMemberById = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team member', error: err.message });
  }
};

// Update Team Member
exports.updateTeamMember = async (req, res) => {
  try {
    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update team member', error: err.message });
  }
};

// Delete Team Member
exports.deleteTeamMember = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete team member', error: err.message });
  }
};
