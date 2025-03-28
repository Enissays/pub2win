const QuestionRepository = require('../repository/question.dao');
const { QuestionStatusEnum } = require('../models/enums');

class QuestionService {
    async createQuestion(user_id, content) {

        // Validation des données avant création
        if (!user_id || !content) {
            throw new Error('Les champs user_id et contenu sont obligatoires');
        }

        // Données par défaut
        const questionToCreate = {
            user_id: user_id,
            content: content,
        };

        return await QuestionRepository.create(questionToCreate);
    }
    
    async getQuestionById(user_id) {
        const question = await QuestionRepository.findByUserId(user_id);
        console.log("question: ",question);
        if (!question) {
            throw new Error('Question non trouvée');
        }
        
        return question;
    }

    async deleteByQUestionId(id){
        return await QuestionRepository.deleteById(id);
    }
}

module.exports = new QuestionService();