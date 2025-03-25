const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const GroupeUserDAO = require('../repository/groupeUser.dao');


// Envoyer un message privé
router.post('/send', messageController.createMessage);

// Récupérer les messages privés entre deux utilisateurs
router.get('/private/:sender_id/:receiver_id', messageController.getPrivateMessages);

// Envoyer un message à un groupe
router.post('/group/:groupeId/message', messageController.sendMessageToGroupe);

module.exports = router;
