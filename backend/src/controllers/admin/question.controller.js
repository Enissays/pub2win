const QuestionService = require('../../services/question.service');

class QuestionController {
    async createQuestion(req, res) {
        try {
            const { user_id, content } = req.body;
            
            // Vérification des données requises
            if (!user_id || !content) {
                return res.status(400).json({ 
                    message: 'user_id et contenu sont obligatoires' 
                });
            }

            const question = await QuestionService.createQuestion({ user_id, content });
            
            res.status(201).json({
                message: 'Question créée avec succès',
                question
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Erreur lors de la création de la question',
                error: error.message 
            });
        }
    }

    async getQuestionById(req, res) {
        try {
            const question = await QuestionService.getQuestionById(req.params.id);
            
            res.status(200).json({
                message: 'Question récupérée avec succès',
                question
            });
        } catch (error) {
            res.status(404).json({ 
                message: 'Question non trouvée',
                error: error.message 
            });
        }
    }
}

module.exports = new QuestionController();