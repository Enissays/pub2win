const AbonnementCommercantDAO = require('../repository/AbonnementCommercant.dao');

const AbonnementCommercantService = {
  async getAvailableAboComYears() {
    try {
      // Obtenir directement les années depuis la DAO
      const years = await AbonnementCommercantDAO.getAvailableSubscriptionYears();
      
      // Si aucun résultat n'est trouvé, retourner l'année courante
      return years.length > 0 ? years : [new Date().getFullYear()];
    } catch (error) {
      console.error("Erreur service lors de la récupération des années disponibles pour les abonnements commercants:", error);
      return [new Date().getFullYear()];
      }
    },
      async getActiveSubscriptionsByMonth(year) {
        try {
          // Vérifier que year est un nombre valide
          const requestedYear = parseInt(year);
          if (isNaN(requestedYear)) {
            throw new Error("L'année fournie n'est pas valide");
          }
          
          // Obtenir les données brutes du DAO
          const subscriptionsByMonth = await AbonnementCommercantDAO.getActiveSubscriptionsByMonth(year);
          
          // Initialiser le résultat avec tous les mois de l'année à zéro
          const result = {};
          
          // Déterminer le nombre de mois à inclure pour l'année demandée
          const currentDate = new Date();
          const monthsToInclude = (requestedYear === currentDate.getFullYear())
            ? currentDate.getMonth() + 1 : 12;
          
          // Initialiser tous les mois avec zéro
          for (let month = 1; month <= monthsToInclude; month++) {
            result[month] = 0;
          }
          
          // Ajouter les comptes d'offres non complétées
          subscriptionsByMonth.forEach(item => {
            result[item._id] = item.count;
          });
          
          return result;
        } catch (error) {
          console.error(`Erreur service lors du comptage des offres non complétées par mois pour l'année ${year}:`, error);
          return {};
        }
      },
};
module.exports = AbonnementCommercantService;