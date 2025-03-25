const TransactionService = require('../../services/Transaction.service');

const TransactionController = {

  async getTransactionYears(req, res) {
    try {
      const years = await TransactionService.getTransactionYears();
      
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

  async getGainsTransactionByMonth(req, res) {
    try {
      const { year } = req.params;
      
      if (!year) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir une année valide'
        });
      }

      const userCounts = await TransactionService.getGainsTransactionByMonth(year);
      
      return res.status(200).json({
        success: true,
        data: userCounts,
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

  async getTotalCommissionApp(req, res) {
    try {
      const totalCommission = await TransactionService.getTotalCommissionApp();
      
      return res.status(200).json({
        success: true,
        totalCommission,
        message: 'Somme totale des commissions'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Erreur lors du calcul de la somme des commissions: ${error.message}`
      });
    }
  }
};

module.exports = TransactionController;