const express = require('express');
const router = express.Router();
const UserController = require('../controllers/admin/User.controller');


// Route pour récupérer les années disponibles
router.get('/years', UserController.getAvailableYears);

// Route pour récupérer le nombre d'utilisateurs par mois pour une année spécifique
router.get('/count/:year', UserController.getTotalUserCountByMonth);


router.get('/count',UserController.getCountUsers);


router.get('/allUsers',UserController.getAllUsers);

router.post('/SrchByUn',UserController.getByuserName);


router.delete('/delete/:username',UserController.deleteByUsername);

//changer le nom ou le prenom d'un user
router.put('/profileUpdate', UserController.updateProfile);

router.get('/profileAdmin', UserController.getUserByRole);



module.exports = router;