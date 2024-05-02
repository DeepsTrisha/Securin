const express = require('express');
const router = express.Router();
const cveController = require('../controllers/cveController');

router.get('/', cveController.getCVEs);
router.get('/:id', cveController.getCVEById);

module.exports = router;