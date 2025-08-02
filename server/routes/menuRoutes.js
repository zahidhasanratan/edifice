const express = require('express');
const router = express.Router();
const { createMenu } = require('../controllers/menuController');

router.post('/', createMenu);

module.exports = router;
