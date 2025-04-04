const questionDao = require('../repository/question.dao');
const answerDao = require('../repository/reponse.dao');

class QuestionService {
  async createQuestion(userId, content) {
    return await questionDao.create({ userId, content });
  }

  async getAllQuestions() {
    return await questionDao.findAll();
  }

  async getQuestionById(id) {
    return await questionDao.findById(id);
  }

  async getAllQuestionsWithAnswers() {
    const questions = await this.getAllQuestions();
    
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await answerDao.findByQuestionId(question._id);
        return {
          question,
          answers
        };
      })
    );
    
    return questionsWithAnswers;
  }
}

module.exports = new QuestionService();