const express = require('express');
const {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');

const router = express.Router();

router.post('/', createTeamMember);
router.get('/', getAllTeamMembers);
router.get('/:id', getTeamMemberById);
router.put('/:id', updateTeamMember);
router.delete('/:id', deleteTeamMember);

module.exports = router;
