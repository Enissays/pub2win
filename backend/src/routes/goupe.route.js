const express = require('express');
const router = express.Router();
const groupeController = require('../controllers/groupe.controller');

router.post('/groupes', groupeController.createGroupe);
router.delete('/groupes/:groupeId', groupeController.deleteGroupe);
router.post('/groupes/:groupeId/users', groupeController.addUserToGroupe);
router.delete('/groupes/:groupeId/users', groupeController.removeUserFromGroupe);

module.exports = router;