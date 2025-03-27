const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/admin/question.controller');


router.post('/question/:userId', QuestionController.createQuestion);

router.get('/getAllQuestionReponse', QuestionController.getAllQuestionsWithAnswers);

module.exports = router;