const Offre = require('./../models/offre.model');

const OffreDAO = {

  
  //GET /admin/Dashboard/nbrAnnoncePublier/years
  async getAvailableOffreYears() {
    try {
      // Agréger pour obtenir toutes les années uniques des dates de début d'offres
      const yearsResult = await Offre.aggregate([
        {
          // Projeter uniquement l'année de la date de début d'offre
          $project: {
            year: { $year: "$date_debut" }
          }
        },
        {
          // Regrouper par année pour obtenir des valeurs uniques
          $group: {
            _id: "$year"
          }
        },
        {
          // Trier les années par ordre décroissant (plus récent au plus ancien)
          $sort: { _id: -1 }
        }
      ]);

      if (yearsResult.length === 0) {
        return [null];
      }

      return yearsResult;
    } catch (error) {
      console.error("Erreur lors de la récupération des années disponibles pour les offres:", error);
      // En cas d'erreur, retourner au moins l'année courante
      return [null];
    }
  },

    //GET /admin/Dashboard/nbrAnnoncePublier
    async getActiveOffresByMonth(year) {
      try {
        const requestedYear = parseInt(year);
        
        // Récupérer le nombre d'offres actives par mois pour l'année demandée
        const offresByMonth = await Offre.aggregate([
          {
            $match: {
              is_active: true,
              date_debut: {
                $gte: new Date(`${requestedYear}-01-01T00:00:00.000Z`),
                $lt: new Date(`${requestedYear+1}-01-01T00:00:00.000Z`)
              }
            }
          },
          {
            $addFields: {
              month: { $month: "$date_debut" }
            }
          },
          {
            $group: {
              _id: "$month",
              count: { $sum: 1 }
            }
          }
        ]);
        
        return offresByMonth;
      } catch (error) {
        console.error(`Erreur DAO lors du comptage des offres actives par mois pour l'année ${year}:`, error);
        throw error;
      }
    },


    //GET /admin/Dashboard/nbrAnnonceAcceptees
    async countNonCompletedClientOffresByMonth(year) {
      try {
        // Vérifier que year est un nombre valide
        const requestedYear = parseInt(year);
        
        // Récupérer le nombre d'offres avec clients non complétés par mois pour l'année demandée
        const offresByMonth = await Offre.aggregate([
          // Dé-normaliser l'array clients
          {
            $unwind: "$clients"
          },
          // Ajouter le champ is_completed et date_utilisation qui sont dans le sous-document
          {
            $addFields: {
              "is_completed": "$clients.is_completed",
              "date_utilisation": "$clients.date_utilisation"
            }
          },
          // Filtrer uniquement les offres non complétées et pour l'année demandée
          {
            $match: {
              is_completed: false,
              date_utilisation: {
                $gte: new Date(`${requestedYear}-01-01T00:00:00.000Z`),
                $lt: new Date(`${requestedYear+1}-01-01T00:00:00.000Z`)
              }
            }
          },
          // Extraire le mois de la date d'utilisation
          {
            $addFields: {
              month: { $month: "$date_utilisation" }
            }
          },
          // Grouper par mois et compter
          {
            $group: {
              _id: "$month",
              count: { $sum: 1 }
            }
          },
          // Trier par mois
          {
            $sort: { _id: 1 }
          }
        ]);
        
        return offresByMonth;
      } catch (error) {
        console.error(`Erreur lors du comptage des offres non complétées par mois pour l'année ${year}:`, error);
        return [];
      }
    },
    
    async getAvailableClientOffreYears() {
      try {
        // Agréger pour obtenir toutes les années uniques des dates d'utilisation d'offres
        const yearsResult = await Offre.aggregate([
          // Dé-normaliser l'array clients
          {
            $unwind: "$clients"
          },
          // Sélectionner uniquement les entrées avec date_utilisation
          {
            $match: {
              "clients.date_utilisation": { $exists: true }
            }
          },
          // Projeter uniquement l'année de la date d'utilisation
          {
            $project: {
              year: { $year: "$clients.date_utilisation" }
            }
          },
          // Regrouper par année pour obtenir des valeurs uniques
          {
            $group: {
              _id: "$year"
            }
          },
          // Trier les années par ordre décroissant (plus récent au plus ancien)
          {
            $sort: { _id: -1 }
          }
        ]);

        return yearsResult;
      } catch (error) {
        console.error("Erreur lors de la récupération des années disponibles pour les utilisations d'offres:", error);
        return [];
      }
    }
}

module.exports = OffreDAO;