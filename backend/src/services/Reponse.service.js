const reponseDao = require('..//repository/reponse.dao');

class ReponseService {

  async createReponse(reponseData) {
    try {
      if (!reponseData.user_id) {
        throw new Error('L\'ID de la question est requis');
      }
      
      if (!reponseData.content || reponseData.content.trim() === '') {
        throw new Error('Le contenu de la réponse est requis');
      }
      
      return await reponseDao.createReponse(reponseData);
    } catch (error) {
      throw error;
    }
  }

  async getReponseByUserId(user_id) {
    try {
      const reponse = await reponseDao.getReponseByUserId(user_id);
      if (!reponse) {
        throw new Error('Réponse non trouvée');
      }
      return reponse;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ReponseService();