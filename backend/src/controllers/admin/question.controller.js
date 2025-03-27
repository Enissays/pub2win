const questionService = require('../../services/question.service');
const questionReposneService = require('../../services/questionReponse');

class QuestionController {
  async createQuestion(req, res) {
    try {
      const { content } = req.body;
      const {userId} = req.params;
      
      if (!content) {
        return res.status(400).json({
          success: false,
          message: 'Le contenu de la question est requis'
        });
      }
      
      const question = await questionService.createQuestion(userId, content);
      
      return res.status(201).json({
        success: true,
        message: 'Question créée avec succès',
        data: question
      });
    } catch (error) {
      console.error('Erreur lors de la création de la question:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  async getAllQuestionsWithAnswers(req, res) {
    try {
      const data = await questionReposneService.getAllQuestionsWithAnswers();
      
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des questions et réponses:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
}

module.exports = new QuestionController();