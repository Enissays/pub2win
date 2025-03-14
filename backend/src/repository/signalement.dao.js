const Signalement = require("../models/signalement.model");

const signalementDao = {
    async getSignalementYears() {
        try {
  
  
          // Agréger pour obtenir toutes les années uniques des dates de conversion
          const yearsResult = await Signalement.aggregate([
            {
              // Projeter uniquement l'année de la date de conversion
              $project: {
                year: { $year: "$date_signalement" }
              }
            },
            {
              // Regrouper par année pour obtenir des valeurs uniques
              $group: {
                _id: "$year",
              }
            },
            {
              $sort: { _id: -1 }
            }
          ]);
          
          // Si aucun résultat, retourner l'année courante
          if (yearsResult.length === 0) {
            return null;
          }
          
          // Retourner le résultat brut de l'agrégation
          return yearsResult;
        } catch (error) {
          console.error("Erreur lors de la récupération des années de conversion:", error);
          throw error;
        }
      },

      async getSignalementByMonth(year) {
            try {
            const requestedYear = parseInt(year);

            const signalementsByMonth = await Signalement.aggregate([
                {
                  $match: {
                    date_signalement: {
                      $gte: new Date(`${requestedYear}-01-01T00:00:00.000Z`),
                      $lt: new Date(`${requestedYear+1}-01-01T00:00:00.000Z`)
                    }
                  }
                },
                {
                  $addFields: {
                    month: { $month: "$date_signalement" } // Correction: utiliser date_signalement au lieu de date
                  }
                },
                {
                  $group: {
                    _id: "$month",
                    count: { $sum: 1 }
                  }
                },
                {
                  $sort: { _id: 1 }
                },
                {
                  $project: {
                    _id: 0,
                    month: "$_id",
                    count: 1
                  }
                }
              ]);
               return signalementsByMonth;
                  } catch (error) {
                    console.error(`Erreur lors du calcul des commissions par mois pour l'année ${year}:`, error);
                    return Array.from({ length: 12 }, (_, index) => ({ 
                      month: index + 1, 
                      totalCommission: 0 
                    }));
                  }
                },
                async getALLSignalements() {
                try {
                  return await Signalement.find();
                } catch (error) {
                  console.error(`Erreur lors de la récupération des signalements: ${error.message}`);
                  throw error;
                }
              }         
};

module.exports = signalementDao;