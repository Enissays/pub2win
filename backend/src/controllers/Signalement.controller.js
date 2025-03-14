const SignalementService = require('../services/signalement.service');

const SignalementController = {

  async getSignalementYears(req, res) {
    try {
      const years = await SignalementService.getSignalementYears();
      
      return res.status(200).json({
        success: true,
        data: years
      });
    } catch (error) {
      console.error('Erreur contrôleur lors de la récupération des années disponibles:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des années disponibles',
        error: error.message
      });
    }
  },

  async getSignalementByMonth(req, res) {
    try {
      const { year } = req.params;
      
      if (!year) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir une année valide'
        });
      }

      const SigCounts = await SignalementService.getSignalementByMonth(year);
      
      return res.status(200).json({
        success: true,
        data: SigCounts,
        year: parseInt(year)
      });
    } catch (error) {
      console.error(`Erreur contrôleur lors du comptage des utilisateurs pour l'année ${req.params.year}:`, error);
      
      return res.status(500).json({
        success: false,
        message: `Erreur lors du comptage des utilisateurs pour l'année ${req.params.year}`,
        error: error.message
      });
    }
  },
  async getALLSignalements(req, res) {
    try {
      const signalements = await SignalementService.getAllSignalements();
      
      return res.status(200).json({
        success: true,
        data: signalements
      });
    } catch (error) {
      console.error('Erreur contrôleur lors de la récupération des signalements:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des signalements',
        error: error.message
      }); 
    }
  }
};

module.exports = SignalementController;