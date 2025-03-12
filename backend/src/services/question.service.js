const QuestionRepository = require('../repository/question.dao');
const { QuestionStatusEnum } = require('../models/enums');

class QuestionService {
    async createQuestion(questionData) {
        // Validation des données avant création
        if (!questionData.user_id || !questionData.contenu) {
            throw new Error('Les champs user_id et contenu sont obligatoires');
        }

        // Données par défaut
        const questionToCreate = {
            user_id: questionData.user_id,
            contenu: questionData.contenu,
            statut: QuestionStatusEnum.EN_ATTENTE
        };

        return await QuestionRepository.create(questionToCreate);
    }

    async getQuestionById(id) {
        const question = await QuestionRepository.findById(id);
        if (!question) {
            throw new Error('Question non trouvée');
        }
        return question;
    }
}

module.exports = new QuestionService();