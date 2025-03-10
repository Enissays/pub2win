const AbonnementCommercantDAO = require('../repository/AbonnementCommercant.dao');

const AbonnementCommercantService = {
    async getAvailableAboComYears() {
        try {
          // Obtenir les résultats bruts depuis la couche DAO
          const yearsResult = await AbonnementCommercantDAO.getAvailableSubscriptionYears();
          
          // Transformer le résultat en tableau simple d'années
          const years = yearsResult.map(item => item._id);
          
          // Si aucun résultat n'est trouvé, retourner au moins l'année courante
          if (years.length === 0) {
            return [new Date().getFullYear()];
          }
          
          return years;
        } catch (error) {
          console.error("Erreur service lors de la récupération des années disponibles pour les utilisations d'offres:", error);
          // En cas d'erreur, retourner au moins l'année courante
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