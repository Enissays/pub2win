const userDAO = require('../repository/user.dao');

const UserService = {
    async getAvailableYears() {
      try {
        // Obtenir les résultats bruts depuis la couche DAO
        const yearsResult = await userDAO.getUniqueInscriptionYears();
        
        // Transformer le résultat en tableau simple d'années (cette partie est déplacée ici)
        const years = yearsResult.map(item => item._id);
        
        // Si aucun résultat n'est trouvé, retourner au moins l'année courante
        
        
        return years;
      } catch (error) {
        console.error("Erreur service lors de la récupération des années disponibles:", error);
        // En cas d'erreur, retourner au moins l'année courante
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
          const { commercantsByMonth, influenceursByMonth } = await userDAO.getTotalUserCountByMonth(year);
          
          // Initialiser le résultat avec tous les mois de l'année à zéro
          const result = {};
          
          // Déterminer le nombre de mois à inclure pour l'année demandée
          const currentDate = new Date();
          const monthsToInclude = (requestedYear === currentDate.getFullYear()) 
            ? currentDate.getMonth() + 1: 12;
          
          // Initialiser tous les mois avec zéro
          for (let month = 1; month <= monthsToInclude; month++) {
            result[month] = { users: 0 };
          }
          
          // Ajouter les comptes réels de commerçants
          commercantsByMonth.forEach(item => {
            const month = item._id;
            if (result[month]) {
              result[month].users += item.count;
            }
          });
          
          // Ajouter les comptes réels d'influenceurs
          influenceursByMonth.forEach(item => {
            const month = item._id;
            if (result[month]) {
              result[month].users += item.count;
            }
          });
          
          return result;
        } catch (error) {
          console.error(`Erreur service lors du comptage total des utilisateurs pour l'année ${year}:`, error);
          return {};
        }
      }
}
  
module.exports = UserService;