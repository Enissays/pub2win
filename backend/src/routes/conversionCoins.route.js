const express = require('express');
const router = express.Router();
const ConversionCoinsController = require('../controllers/ConversionCoins.controller');


router.get('/conversionCoins/years', ConversionCoinsController.getAvailableOffreYears);
router.get('/conversionCoins/count/:year', ConversionCoinsController.getConversionCoinsByMonth);

module.exports = router;