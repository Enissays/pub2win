const express = require('express');
const router = express.Router();
const OffreController = require('../controllers/Offre.controller');


// Route pour récupérer les années disponibles pour les offres
router.get('/offre/years', OffreController.getAvailableOffreYears);
router.get('/offre/count/:year', OffreController.getActiveOffresByMonth);

//nbrAnnonceAcceptees
router.get('/offreClient/years', OffreController.getAvailableClientOffreYears);
router.get('/offreClient/count/:year', OffreController.countNonCompletedClientOffresByMonth);


module.exports = router;