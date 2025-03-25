const express = require('express');
const router = express.Router();
const AideController = require('../controllers/admin/Aide.controller');

router.get('/help', AideController.getAide);

router.put('/help/update', AideController.updateAide);

module.exports = router;