const Answer = require('../models/reponse.model');

class AnswerDao {
  async create(answerData) {
    const answer = new Answer(answerData);
    return await answer.save();
  }

  async findByQuestionId(questionId) {
    return await Answer.find({ questionId }).populate('adminId', 'username').sort({ _id: 1 });
  }
}

module.exports = new AnswerDao();