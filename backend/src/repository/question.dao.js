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

    async findByUserId(user_id) {
        try {

            const questions = await Question.find({ user_id: user_id });


            if (questions.length === 0) {
                throw new Error('Aucune question trouvée pour cet utilisateur');  
            }
            
            // Stocker la première question pour la retourner
            const questionToReturn = questions[0];

            // Si la question a une réponse, on la supprime
            if (questionToReturn.reponse) {
                await Question.deleteOne({ _id: questionToReturn._id });
            }
            
            // Retourner la question (avant qu'elle ne soit supprimée)
            console.log("questionToReturn: ",questionToReturn);
            return questionToReturn;
        } catch (error) {
            throw new Error(`Erreur lors de la recherche des questions de l'utilisateur: ${error.message}`);
        }
    }
}

module.exports = new QuestionRepository();