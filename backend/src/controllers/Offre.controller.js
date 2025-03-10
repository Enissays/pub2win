const OffreService = require('../services/offre.service');

const OffreController = {

  async getAvailableOffreYears(req, res) {
    try {
      const years = await OffreService.getAvailableOffreYears();
      
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

  async getActiveOffresByMonth(req, res) {
    try {
      const { year } = req.params;
      
      if (!year) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir une année valide'
        });
      }

      const offreCounts = await OffreService.getActiveOffresByMonth(year);
      
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


  async getAvailableClientOffreYears(req, res) {
    try {
      const years = await OffreService.getAvailableClientOffreYears();
      
      return res.status(200).json({
        success: true,
        data: years
      });
    } catch (error) {
      console.error('Erreur contrôleur lors de la récupération des années disponibles pour les utilisations d\'offres:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des années disponibles pour les utilisations d\'offres',
        error: error.message
      });
    }
  },


  async countNonCompletedClientOffresByMonth(req, res) {
    try {
      const { year } = req.params;
      
      if (!year) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir une année valide'
        });
      }

      const offresCount = await OffreService.countNonCompletedClientOffresByMonth(year);
      
      return res.status(200).json({
        success: true,
        data: offresCount,
        year: parseInt(year)
      });
    } catch (error) {
      console.error(`Erreur contrôleur lors du comptage des offres non complétées pour l'année ${req.params.year}:`, error);
      
      return res.status(500).json({
        success: false,
        message: `Erreur lors du comptage des offres non complétées pour l'année ${req.params.year}`,
        error: error.message
      });
    }
  }
};

module.exports = OffreController;