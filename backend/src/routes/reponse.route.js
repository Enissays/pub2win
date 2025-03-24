const express = require('express');
const router = express.Router();
const reponseController = require('../controllers/admin/reponse.controller');


// Récupérer une réponse par ID
router.get('/res/:user_id', reponseController.getReponseByUserId);

router.post('/res/', reponseController.createReponse);

module.exports = router;