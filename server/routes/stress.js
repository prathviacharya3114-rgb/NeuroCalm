const express = require('express');
const router = express.Router();
const stressController = require('../controllers/stressController');

router.post('/analyze', stressController.analyzeStress);

module.exports = router;
