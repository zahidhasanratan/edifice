// controllers/statsController.js
const Stats = require('../models/Stats');

const getStats = async (req, res) => {
  try {
    const stats = await Stats.findOne(); // assuming single document
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

module.exports = { getStats };
