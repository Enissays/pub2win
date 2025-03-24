const OffreDAO = require('./../repository/offre.dao');

const Offreservice = {
    async getAvailableOffreYears() {
        try {
          // Obtenir les résultats bruts depuis la couche DAO
          const yearsResult = await OffreDAO.getAvailableOffreYears();
          
          // Transformer le résultat en tableau simple d'années
          const years = yearsResult.map(item => item._id);
          
          // Si aucun résultat n'est trouvé, retourner au moins l'année courante
          if (years.length === 0) {
            return [null];
          }
          
          return years;
        } catch (error) {
          console.error("Erreur service lors de la récupération des années disponibles pour les offres:", error);
          // En cas d'erreur, retourner au moins l'année courante
          return [new Date().getFullYear()];
        }
      },
      async getActiveOffresByMonth(year) {
        try {
          // Vérifier que year est un nombre valide
          const requestedYear = parseInt(year);
          if (isNaN(requestedYear)) {
            throw new Error("L'année fournie n'est pas valide");
          }
          
          // Obtenir les données brutes du DAO
          const offresByMonth = await OffreDAO.getActiveOffresByMonth(year);
          
          // Initialiser le résultat avec tous les mois de l'année à zéro
          const result = {};
          
          // Déterminer le nombre de mois à inclure pour l'année demandée
          const currentDate = new Date();
          const monthsToInclude = (requestedYear === currentDate.getFullYear())
            ? currentDate.getMonth() + 1 : 12;
          
          // Initialiser tous les mois avec zéro
          for (let month = 1; month <= monthsToInclude; month++) {
            result[month] = { offres: 0 };
          }
          
          // Ajouter les comptes réels d'offres
          offresByMonth.forEach(item => {
            const month = item._id;
            if (result[month]) {
              result[month].offres = item.count;
            }
          });
          
          return result;
        } catch (error) {
          console.error(`Erreur service lors du comptage des offres actives par mois pour l'année ${year}:`, error);
          return {};
        }
      },





      async countNonCompletedClientOffresByMonth(year) {
        try {
          // Vérifier que year est un nombre valide
          const requestedYear = parseInt(year);
          if (isNaN(requestedYear)) {
            throw new Error("L'année fournie n'est pas valide");
          }
          
          // Obtenir les données brutes du DAO
          const offresByMonth = await OffreDAO.countNonCompletedClientOffresByMonth(year);
          
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
          offresByMonth.forEach(item => {
            result[item._id] = item.count;
          });
          
          return result;
        } catch (error) {
          console.error(`Erreur service lors du comptage des offres non complétées par mois pour l'année ${year}:`, error);
          return {};
        }
      },
      async getAvailableClientOffreYears() {
        try {
          // Obtenir les résultats bruts depuis la couche DAO
          const yearsResult = await OffreDAO.getAvailableClientOffreYears();
          
          if(yearsResult === null){
            return null;
          }
          // Transformer le résultat en tableau simple d'années
          const years = yearsResult.map(item => item._id);
          
          // Si aucun résultat n'est trouvé, retourner au moins l'année courante
          if (years.length === 0) {
            return null;
          }
          
          return years;
        } catch (error) {
          console.error("Erreur service lors de la récupération des années disponibles pour les utilisations d'offres:", error);
          // En cas d'erreur, retourner au moins l'année courante
          return null;
        }
      },

      async getallInfluenceurperCommercantYears(username){
        const results= await OffreDAO.getallInfluenceurperCommercantYears(username)

        if (results === null){
          return null
        }

        return results;
      },

      async getNombreInfluenceurParMois(username,year) {
        try {
          // Vérifier que year est un nombre valide
          const requestedYear = parseInt(year);
          if (isNaN(requestedYear)) {
            throw new Error("L'année fournie n'est pas valide");
          }
          
          // Obtenir les données brutes du DAO
          const InfByMonth = await OffreDAO.getNombreInfluenceurParMois(username,year);
          
          // Initialiser le résultat avec tous les mois de l'année à zéro
          const result = {};
              
          // Déterminer le nombre de mois à inclure pour l'année demandée
          const currentDate = new Date();
          const monthsToInclude = (requestedYear === currentDate.getFullYear())
            ? currentDate.getMonth() + 1 : 12;
          
          // Initialiser tous les mois avec zéro
          for (let month = 1; month <= monthsToInclude; month++) {
            result[month] = { Influenceurs: 0 };
          }
          
          // Ajouter les comptes réels d'offres
          InfByMonth.forEach(item => {
            const month = item.mois;
            if (result[month]) {
              result[month].Influenceurs = item.nbrInfluenceur;
            }
          });
          
          return result;
        } catch (error) {
          console.error(`Erreur lors du comptage total des utilisateurs pour l'année ${year}:`, error);
          return null;
        }
      },

      async getCountActiveOffres() {
        try {
          return await OffreDAO.getCountActiveOffres();
        } catch (error) {
          throw new Error(`Service - Erreur lors du comptage des offres actives: ${error.message}`);
        }
      },
      async getCountInfluenceursWithPendingOffers() {
        try {
          return await OffreDAO.getCountInfluenceursWithPendingOffers();
        } catch (error) {
          throw new Error(`Service - Erreur lors du comptage des influenceurs avec offres en attente: ${error.message}`);
        }
      }
};

module.exports = Offreservice;