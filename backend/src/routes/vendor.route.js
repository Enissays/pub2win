const express = require('express');
const router = express.Router();
const VendorController = require('../controllers/admin/vendorController');


router.get('/years', VendorController.getAvailableAboComYears);

router.get('/active/:year', VendorController.getActiveSubscriptionsByMonth);

router.get('/usernames', VendorController.getAllUsernames);

router.get('/countTotal',VendorController.getCountCommercantWithActiveSubscription);
module.exports = router;