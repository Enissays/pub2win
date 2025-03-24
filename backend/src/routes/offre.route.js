const express = require('express');
const router = express.Router();
const OffreController = require('../controllers/admin/Offre.controller');


// Route pour récupérer les années disponibles pour les offres
router.get('/offre/years', OffreController.getAvailableOffreYears);
router.get('/offre/count/:year', OffreController.getActiveOffresByMonth);

//nbrAnnonceAcceptees
router.get('/offreClient/years', OffreController.getAvailableClientOffreYears);
router.get('/offreClient/count/:year', OffreController.countNonCompletedClientOffresByMonth);



//le nbr d'influenceur par un commercant
router.get('/nbrInfPerCommercantYears/:commercant_id', OffreController.getallInfluenceurperCommercantYears);
router.post('/nbrInfPerCommercant/count/', OffreController.getNombreInfluenceurParMois);



//le nbr total des offres
router.get('/count-active', OffreController.getCountActiveOffres);

router.get('/count-infOffres',OffreController.getCountInfluenceursWithPendingOffers);
module.exports = router;