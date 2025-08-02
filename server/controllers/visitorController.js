const Visitor = require('../models/Visitor');

exports.incrementVisitor = async (req, res) => {
  try {
    let stat = await Visitor.findOne();
    if (!stat) stat = new Visitor();
    stat.count += 1;
    await stat.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error incrementing visitors' });
  }
};

exports.getVisitorCount = async (req, res) => {
  try {
    const stat = await Visitor.findOne();
    res.json({ count: stat?.count || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching visitor count' });
  }
};
