const Question = require('../models/question.model');

class QuestionDao {
    async create(questionData) {
      const question = new Question(questionData);
      return await question.save();
    }
  
    async findAll() {
      return await Question.find().populate('userId', 'username email').sort({ _id: -1 });
    }
  
    async findById(id) {
      return await Question.findById(id).populate('userId', 'username email');
    }
  }
  
module.exports = new QuestionDao();