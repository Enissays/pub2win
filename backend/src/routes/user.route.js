const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User.controller');


// Route pour récupérer les années disponibles
router.get('/years', UserController.getAvailableYears);

// Route pour récupérer le nombre d'utilisateurs par mois pour une année spécifique
router.get('/count/:year', UserController.getTotalUserCountByMonth);


router.get('/count',UserController.getCountUsers);

module.exports = router;