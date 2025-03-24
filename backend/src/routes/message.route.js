const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');

// Envoyer un message privé
router.post('/send', messageController.createMessage);

// Récupérer les messages privés entre deux utilisateurs
router.get('/private/:sender_id/:receiver_id', messageController.getPrivateMessages);

// Créer un groupe
router.post('/group', messageController.createGroupe);

// Supprimer un groupe
router.delete('/group/:groupeId', messageController.deleteGroupe);

// Envoyer un message à un groupe
router.post('/group/:groupeId/message', messageController.sendMessageToGroupe);

module.exports = router;
