const Consent = require('../models/Consent');

/** POST /api/consents  – create or update a consent */
exports.createConsent = async (req, res) => {
  const { visitorId, consent, bannerVersion } = req.body;

  try {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
      .split(',')[0]
      .trim();
    const userAgent = req.headers['user-agent'] || '';

    const consentDoc = await Consent.findOneAndUpdate(
      { visitorId },
      { consent, bannerVersion, ip, userAgent },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Consent recorded successfully',
      data: consentDoc,
    });
  } catch (err) {
    console.error('Error saving consent:', err);
    res.status(500).json({ success: false, message: 'Error saving consent' });
  }
};

/** GET /api/consents – list/paginate consents (desc by createdAt) */
exports.listConsents = async (req, res) => {
  const { page = 1, limit = 10, q = '' } = req.query;

  try {
    const query = {};
    if (q) {
      query.$or = [
        { visitorId: { $regex: q, $options: 'i' } },
        { ip:       { $regex: q, $options: 'i' } },
        { userAgent:{ $regex: q, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [consents, total] = await Promise.all([
      Consent.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Consent.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: consents,
      total,
      totalPages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (err) {
    console.error('Error fetching consents:', err);
    res.status(500).json({ success: false, message: 'Error fetching consents' });
  }
};

/** DELETE /api/consents/:visitorId – delete one by visitorId */
exports.deleteConsent = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const result = await Consent.deleteOne({ visitorId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Consent record not found' });
    }
    res.json({ success: true, message: 'Consent record deleted' });
  } catch (err) {
    console.error('Error deleting consent:', err);
    res.status(500).json({ success: false, message: 'Error deleting consent' });
  }
};

/** DELETE /api/consents  – delete all (requires { all: true } in body) */
exports.deleteAllConsents = async (req, res) => {
  try {
    if (!req.body?.all) {
      return res.status(400).json({ success: false, message: 'Set { all: true } to delete all consents.' });
    }
    const result = await Consent.deleteMany({});
    res.json({ success: true, message: `Deleted ${result.deletedCount} consent(s).` });
  } catch (err) {
    console.error('Error deleting all consents:', err);
    res.status(500).json({ success: false, message: 'Error deleting all consents' });
  }
};
