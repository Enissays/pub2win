const express = require('express');
const router = express.Router();
const reponseController = require('../controllers/admin/reponse.controller');


router.post('/reponse/:adminId', reponseController.createAnswer);

module.exports = router;