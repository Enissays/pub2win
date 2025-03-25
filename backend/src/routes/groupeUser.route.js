const express = require('express');
const router = express.Router();
const groupeUserController = require('../controllers/groupeUser.controller');

router.get('/groupes/:groupeId/users', groupeUserController.getUsersInGroupe);
router.put('/groupes/:groupeId/users/:userId/role', groupeUserController.updateUserRoleInGroupe);
router.get('/users/:userId/groupes', groupeUserController.getUserGroupes);

module.exports = router;