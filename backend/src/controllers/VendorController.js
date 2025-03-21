const CommercantService = require('../services/commercant.service');

const VendorController = {
    async getAvailableAboComYears(req, res) {
        try {
            const years = await CommercantService.getAvailableAboComYears();
            
            return res.status(200).json({
                success: true,
                data: years
            });
        } catch (error) {
            console.error('Erreur contrôleur lors de la récupération des années d\'abonnement:', error);
            
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des années d\'abonnement',
                error: error.message
            });
        }
    },
      
    async getActiveSubscriptionsByMonth(req, res) {
        try {
          const { year } = req.params;
          const subscriptions = await CommercantService.getActiveSubscriptionsByMonth(year);
          res.status(200).json({ 
            success: true, 
            data: subscriptions, 
            year: parseInt(year) 
          });
        } catch (error) {
          console.error("Erreur lors de la récupération des abonnements actifs:", error);
          res.status(500).json({ 
            success: false, 
            message: "Erreur lors de la récupération des abonnements actifs", 
            data: {}, 
            year: new Date().getFullYear() 
          });
        }
      }, 
      
      async getAllUsernames(req, res) {
        try {
          const usernames = await CommercantService.getAllUsernames();
          res.status(200).json({
            success: true,
            count: usernames.length,
            data: usernames
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message
          });
        }
      },
      async getCountCommercantWithActiveSubscription(req, res) {
        try {
          const count = await CommercantService.getCountCommercantWithActiveSubscription();
          return res.status(200).json({
            success: true,
            count,
            message: 'Nombre de commerçants avec abonnement actif'
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: `Erreur lors de la récupération du nombre de commerçants avec abonnement actif: ${error.message}`
          });
        }
      }
};

module.exports = VendorController;  