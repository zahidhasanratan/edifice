const express = require('express');
const { incrementVisitor, getVisitorCount } = require('../controllers/visitorController');
const router = express.Router();

router.post('/increment', incrementVisitor);
router.get('/count', getVisitorCount);

module.exports = router;
