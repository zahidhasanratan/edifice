const express = require('express');
const router = express.Router();
const { getContactInfo, updateContactInfo } = require('../controllers/contactInfoController');

router.get('/', getContactInfo);
router.put('/', updateContactInfo);

module.exports = router;
