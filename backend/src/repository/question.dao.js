const Question = require('../models/question.model');

class QuestionRepository {
    async create(questionData) {
        try {
            const question = new Question(questionData);
            return await question.save();
        } catch (error) {
            throw new Error(`Erreur lors de la création de la question: ${error.message}`);
        }
    }

    async findById(user_id) {
       try {
                return await Question.find({ user_id: user_id });
        } catch (error) {
                throw new Error(`Erreur lors de la recherche des questions de l'utilisateur: ${error.message}`);
        }
    }
}

module.exports = new QuestionRepository();