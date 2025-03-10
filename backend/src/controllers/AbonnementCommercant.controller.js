const AbonnementCommercantService = require('../services/AbonnementCommercant.service');

const AbonnementCommercantController = {

  async getAvailableSubscriptionYears(req, res) {
    try {
      const years = await AbonnementCommercantService.getAvailableAboComYears();
      
      return res.status(200).json({
        success: true,
        data: years
      });
    } catch (error) {
      console.error('Erreur contrôleur lors de la récupération des années disponibles pour les abonnements:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des années disponibles pour les abonnements',
        error: error.message
      });
    }
  },


  async getActiveSubscriptionsByMonth(req, res) {
    try {
      const { year } = req.params;
      
      if (!year) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir une année valide'
        });
      }

      const subscriptionsCount = await AbonnementCommercantService.getActiveSubscriptionsByMonth(year);
      
      return res.status(200).json({
        success: true,
        data: subscriptionsCount,
        year: parseInt(year)
      });
    } catch (error) {
      console.error(`Erreur contrôleur lors du comptage des abonnements actifs pour l'année ${req.params.year}:`, error);
      
      return res.status(500).json({
        success: false,
        message: `Erreur lors du comptage des abonnements actifs pour l'année ${req.params.year}`,
        error: error.message
      });
    }
  }
};

module.exports = AbonnementCommercantController;