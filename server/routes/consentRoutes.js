const express = require('express');
const router = express.Router();
const {
  createConsent,
  listConsents,
  deleteConsent,
  deleteAllConsents,
} = require('../controllers/consentController');

// Store/update consent
router.post('/', createConsent);

// List with pagination & search
router.get('/', listConsents);

// Delete one by visitorId
router.delete('/:visitorId', deleteConsent);

// Delete all (body: { all: true })
router.delete('/', deleteAllConsents);

module.exports = router;
