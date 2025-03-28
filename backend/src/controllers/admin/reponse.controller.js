const answerService = require('../../services/Reponse.service');

class AnswerController {
  async createAnswer(req, res) {
    try {
      const { questionId, content } = req.body;
      const adminId = req.params.adminId; 
      
      console.log("adminId: ",adminId);
      console.log("questionId: ",questionId);
      console.log("content: ",content);
      
      if (!questionId || !content) {
        return res.status(400).json({
          success: false,
          message: 'L\'ID de la question et le contenu sont requis'
        });
      }
      
      const answer = await answerService.createAnswer(adminId, questionId, content);
      
      return res.status(201).json({
        success: true,
        message: 'Réponse créée avec succès',
        data: answer
      });
    } catch (error) {
      console.error('Erreur lors de la création de la réponse:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
}

module.exports = new AnswerController();