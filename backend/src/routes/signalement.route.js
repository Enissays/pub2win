const express = require('express');
const router = express.Router();
const SignalementController = require('../controllers/admin/Signalement.controller');
const NotificationSignalementController = require('../controllers/admin/notificationSignalement.controller');


// Route pour récupérer les années disponibles
router.get('/Sig/years', SignalementController.getSignalementYears);

// Route pour récupérer le nombre d'utilisateurs par mois pour une année spécifique
router.get('/Sig/count/:year', SignalementController.getSignalementByMonth);

router.get('/Sig/all', SignalementController.getALLSignalements);


//total of signalement
router.get('/count',SignalementController.getCountSignalements);


router.post('/NotificationSignalement/create', NotificationSignalementController.createNotification);
module.exports = router;