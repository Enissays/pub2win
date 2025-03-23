const TransactionDAO = require('../repository/transaction.dao');

const TransactioService = {
  async getTransactionYears() {
    try {
      // Obtenir directement les années depuis la DAO
      const yearsResult = await TransactionDAO.getTransactionYears();

      if (yearsResult === null) {
        console.log("yearsResult is null", yearsResult);
        return null;
      }

      // Mapper uniquement les éléments valides
      const years = yearsResult.map(item => item._id);
    
      // Retourner les années ou l'année courante si aucun résultat
      return years.length > 0 ? years : [null];
        
    } catch (error) {
      console.error("Erreur service lors de la récupération des années disponibles:", error);
      return [null];
    }
  },

  async getGainsTransactionByMonth(year) {
    try {
      // Vérifier que year est un nombre valide
      const requestedYear = parseInt(year);
      if (isNaN(requestedYear)) {
        throw new Error("L'année fournie n'est pas valide");
      }
      
      // Obtenir les données brutes du DAO
      const usersByMonth = await TransactionDAO.getGainsTransactionByMonth(year);
      console.log("usersByMonth", usersByMonth);
      
      // Initialiser le résultat avec tous les mois de l'année à zéro
      const result = {};
          
      // Déterminer le nombre de mois à inclure pour l'année demandée
      const currentDate = new Date();
      //operateur ternaire
      const monthsToInclude = (requestedYear === currentDate.getFullYear())
        ? currentDate.getMonth() + 1 : 12;
      
      // Initialiser tous les mois avec zéro
      for (let mon = 1; mon <= monthsToInclude; mon++) {
        result[mon] = { totalCommissions: 0 };
      }
      
      // Ajouter les comptes réels d'offres
      usersByMonth.forEach(item => {
        const month = item.month;
        if (result[month]) {
          result[month].totalCommissions = item.totalCommission;
        }
      });
      
      return result;
    } catch (error) {
      console.error(`Erreur lors du comptage total des utilisateurs pour l'année ${year}:`, error);
      return null;
    }
  },

  async getTotalCommissionApp() {
    try {
      return await TransactionDAO.getTotalCommissionApp();
    } catch (error) {
      throw new Error(`Service - Erreur lors du calcul de la somme des commissions: ${error.message}`);
    }
  }
};
  
module.exports = TransactioService;