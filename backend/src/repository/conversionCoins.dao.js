const ConversionCoins = require('../models/conversionCoins.model');
const ConversionCoinsDAO = {
    async createConversionCoins(conversionCoinsData) {
        if (!conversionCoinsData || typeof conversionCoinsData !== 'object') {
            return null;
        }
        
        const newConversionCoins = new ConversionCoins(conversionCoinsData);
        return await newConversionCoins.save().catch(() => null);
    },
    
    async getConversionCoinsById(conversionCoinsId) {
        if (!conversionCoinsId) {
            return null;
        }
        
        return await ConversionCoins.findById(conversionCoinsId).catch(() => null);
    },
    
    async getConversionCoinsByClientOffreId(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await ConversionCoins.findOne({ clientOffreId }).catch(() => null);
    },
    
    async updateConversionCoins(conversionCoinsId, updateData) {
        if (!conversionCoinsId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await ConversionCoins.findByIdAndUpdate(conversionCoinsId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteConversionCoins(conversionCoinsId) {
        if (!conversionCoinsId) {
            return null;
        }
        
        return await ConversionCoins.findByIdAndDelete(conversionCoinsId).catch(() => null);
    },
    
    async getUniqueConversionYears() {
        try {
          // Agréger pour obtenir toutes les années uniques des dates de conversion
          const yearsResult = await ConversionCoins.aggregate([
            {
              // Projeter uniquement l'année de la date de conversion
              $project: {
                year: { $year: "$date" }
              }
            },
            {
              // Regrouper par année pour obtenir des valeurs uniques
              $group: {
                _id: "$year"
              }
            },
            {
              $sort: { _id: -1 }
            }
          ]);
          
          // Si aucun résultat, retourner l'année courante
          if (yearsResult.length === 0) {
            return [new Date().getFullYear()];
          }
          // Retourner le résultat brut de l'agrégation
          return yearsResult;
        } catch (error) {
          console.error("Erreur lors de la récupération des années de conversion:", error);
          throw error;
        }
      },

    async getGainsByMonth(year) {
        try {
          const requestedYear = parseInt(year);
          
          const gainsByMonth = await ConversionCoins.aggregate([
            {
              $match: {
                date: {
                  $gte: new Date(`${requestedYear}-01-01`),
                  $lt: new Date(`${requestedYear+1}-01-01`)
                },
                status: "COMPLETED"
              }
            },
            {
              $addFields: {
                month: { $month: "$date" },
                commission: { $multiply: ["$montant_euros", 0.02] }
              }
            },
            {
              $group: {
                _id: "$month",
                totalCommission: { $sum: "$commission" }
              }
            },
            {
              $sort: { _id: 1 }
            },
            {
              $project: {
                _id: 0,
                month: "$_id",
                totalCommission: 1
              }
            }
          ]);
          
          return gainsByMonth;
        } catch (error) {
          console.error(`Erreur lors du calcul des commissions par mois pour l'année ${year}:`, error);
          return Array.from({ length: 12 }, (_, index) => ({ 
            month: index + 1, 
            totalCommission: 0
          }));
        }
    },

    async getAllConversionCoins() {
        return await ConversionCoins.find().catch(() => []);
    }
    };
module.exports = ConversionCoinsDAO;
