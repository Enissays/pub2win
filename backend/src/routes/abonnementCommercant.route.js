const express = require('express');
const router = express.Router();
const AbonnementCommercantController = require('../controllers/admin/AbonnementCommercant.controller');


router.get('/years', AbonnementCommercantController.getAvailableSubscriptionYears);

// Route pour récupérer le nombre d'abonnements actifs par mois pour une année spécifique
router.get('/active/:year', AbonnementCommercantController.getActiveSubscriptionsByMonth);




module.exports = router;