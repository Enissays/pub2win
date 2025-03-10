const ConversionCoinsService = require('../services/ConversionCoins.service');

const ConversionCoinsController = {

  async getAvailableOffreYears(req, res) {
    try {
      const years = await ConversionCoinsService.getAvailableOffreYears();
      
      return res.status(200).json({
        success: true,
        data: years
      });
    } catch (error) {
      console.error('Erreur contrôleur lors de la récupération des années disponibles pour les offres:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des années disponibles pour les offres',
        error: error.message
      });
    }
  },

  async getConversionCoinsByMonth(req, res) {
    try {
      const { year } = req.params;
      
      if (!year) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir une année valide'
        });
      }

      const offreCounts = await ConversionCoinsService.getActiveOffresByMonth(year);
      
      return res.status(200).json({
        success: true,
        data: offreCounts,
        year: parseInt(year)
      });
    } catch (error) {
      console.error(`Erreur contrôleur lors du comptage des offres actives pour l'année ${req.params.year}:`, error);
      
      return res.status(500).json({
        success: false,
        message: `Erreur lors du comptage des offres actives pour l'année ${req.params.year}`,
        error: error.message
      });
    }
  },
};

module.exports = ConversionCoinsController;