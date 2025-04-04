const answerDao = require('../repository/reponse.dao');
const questionService = require('../repository/question.dao');

class AnswerService {
  async createAnswer(adminId, questionId, content) {
    // Vérifier si la question existe
    const question = await questionService.findById(questionId);
    if (!question) {
      throw new Error('Question non trouvée');
    }
    
    return await answerDao.create({ adminId, questionId, content });
  }

  async getAnswersByQuestionId(questionId) {
    return await answerDao.findByQuestionId(questionId);
  }
}

module.exports = new AnswerService();