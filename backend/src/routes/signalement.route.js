const express = require('express');
const router = express.Router();
const SignalementController = require('../controllers/admin/Signalement.controller');


// Route pour récupérer les années disponibles
router.get('/Sig/years', SignalementController.getSignalementYears);

// Route pour récupérer le nombre d'utilisateurs par mois pour une année spécifique
router.get('/Sig/count/:year', SignalementController.getSignalementByMonth);

router.get('/Sig/all', SignalementController.getALLSignalements);


//total of signalement
router.get('/count',SignalementController.getCountSignalements);

module.exports = router;