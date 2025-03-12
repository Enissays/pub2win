const reponseService = require('../services/Reponse.service');

class ReponseController {
  async createReponse(req, res) {
    try {
      const reponseData = {
        user_id: req.body.user_id,
        content: req.body.content,
      };
      
      const nouvelleReponse = await reponseService.createReponse(reponseData);
      return res.status(201).json({
        success: true,
        message: 'Réponse créée avec succès',
        data: nouvelleReponse
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Échec de la création de la réponse',
        error: error
      });
    }
  }

  async getReponseByUserId(req, res) {
    try {
      const user_id = req.params.user_id;
      const reponse = await reponseService.getReponseByUserId(user_id);
      
      return res.status(200).json({
        success: true,
        data: reponse
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Réponse non trouvée',
        error: error
      });
    }
  }
}

module.exports = new ReponseController();