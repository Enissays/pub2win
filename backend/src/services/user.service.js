const userDAO = require('../repository/user.dao');

const UserService = {
  async getAvailableYears() {
    try {
      // Obtenir directement les années depuis la DAO
      const years = await userDAO.getUniqueInscriptionYears();

      // Mapper directement les années
      years = yearsResult.map(item => item._id);
    
      // Retourner les années ou l'année courante si aucun résultat
      return years.length > 0 ? years : [new Date().getFullYear()];
        
    } catch (error) {
      console.error("Erreur service lors de la récupération des années disponibles:", error);
      return [new Date().getFullYear()];
    }
  },

  async getTotalUserCountByMonth(year) {
    try {
      // Vérifier que year est un nombre valide
      const requestedYear = parseInt(year);
      if (isNaN(requestedYear)) {
        throw new Error("L'année fournie n'est pas valide");
      }
      
      // Obtenir les données brutes du DAO
      const usersByMonth = await userDAO.getTotalUserCountByMonth(year);
      
      // Initialiser le résultat avec tous les mois de l'année à zéro
      const result = {};
          
      // Déterminer le nombre de mois à inclure pour l'année demandée
      const currentDate = new Date();
      const monthsToInclude = (requestedYear === currentDate.getFullYear())
        ? currentDate.getMonth() + 1 : 12;
      
      // Initialiser tous les mois avec zéro
      for (let month = 1; month <= monthsToInclude; month++) {
        result[month] = { users: 0 };
      }
      
      // Ajouter les comptes réels d'offres
      usersByMonth.forEach(item => {
        const month = item._id;
        if (result[month]) {
          result[month].users = item.count;
        }
      });
      
      return result;
    } catch (error) {
      console.error(`Erreur lors du comptage total des utilisateurs pour l'année ${year}:`, error);
      return null;
    }
  }
};
  
module.exports = UserService;