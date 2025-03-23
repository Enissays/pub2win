const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/question.controller');

// Route pour créer une nouvelle question
router.post('/quest', QuestionController.createQuestion);

// Route pour récupérer une question par son ID
router.get('/questionUser/:id', QuestionController.getQuestionById);

module.exports = router;