const Reponse = require('../models/reponse.model');
const Question = require('../models/question.model');
const QuestionDao= require('./question.dao');

class ReponseDao {
  async createReponse(reponseData) {
    try {
        // Trouver les questions par user_id
        const questions = await QuestionDao.findByUserId(reponseData.user_id);
        
        if (!questions || !questions._id) {
            throw new Error('Aucune question trouvée pour cet utilisateur');
        }
        
        // Récupérer l'ID de la question
        const questionId = questions._id;
        
        // Créer l'objet de réponse
        const reponseObject = {
            content: reponseData.content,
            date_creation: new Date()
        };
        
        // Utiliser findByIdAndUpdate pour mettre à jour la question
        const questionMiseAJour = await Question.findByIdAndUpdate(
            questionId,
            { $set: { reponse: reponseObject } },
            { new: true, runValidators: true }
        );
        
        if (!questionMiseAJour) {
            throw new Error('Impossible de mettre à jour la question');
        }
        //chatgpt
        return questionMiseAJour;
        } catch (error) {
            console.error("Erreur dans createReponse:", error);
            throw error;
        }
    }
  async getReponseByUserId(user_id) {
    try {
        return await Reponse.find({ user_id: user_id });
    } catch (error) {
        throw new Error(`Erreur lors de la recherche des reponses de l'utilisateur: ${error.message}`);
    }
  }
}

module.exports = new ReponseDao();