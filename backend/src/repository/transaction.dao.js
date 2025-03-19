const Transaction = require('../models/transaction.model');
const { TransactionStatusEnum } = require('../models/enums');
const mongoose = require('mongoose');
const TransactionDAO = {
    async createTransaction(transactionData) {
        if (!transactionData || typeof transactionData !== 'object') {
            return null;
        }
        
        const newTransaction = new Transaction(transactionData);
        return await newTransaction.save().catch(() => null);
    },
    
    async getTransactionById(transactionId) {
        if (!transactionId) {
            return null;
        }
        
        return await Transaction.findById(transactionId).catch(() => null);
    },

    async getTransactionByClientId(clientId) {
        if (!clientId) {
            return null;
        }
        
        return await Transaction.findOne({ clientId }).catch(() => null);
    },

    async getTransactionYears() {
      try {

        // Vérifier les documents dans la collection
        const sampleDoc = await Transaction.findOne();
        console.log("Sample document:", sampleDoc);

        // Agréger pour obtenir toutes les années uniques des dates de conversion
        const yearsResult = await Transaction.aggregate([
          {
            // Projeter uniquement l'année de la date de conversion
            $project: {
              year: { $year: "$date" },
              dateType: { $type: "$date" } // Vérifier le type du champ date
            }
          },
          {
            // Regrouper par année pour obtenir des valeurs uniques
            $group: {
              _id: "$year",
              dateTypes: { $addToSet: "$dateType" } // Collecter les types de dates
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
    
          async getGainsTransactionByMonth(year) {
            try {
              const requestedYear = parseInt(year);
              
              const gainsByMonth = await Transaction.aggregate([
                {
                  $match: {
                    date: {
                      $gte: new Date(`${requestedYear}-01-01T00:00:00.000Z`),
                      $lt: new Date(`${requestedYear+1}-01-01T00:00:00.000Z`)
                    },
                    status: TransactionStatusEnum.VALIDEE
                  }
                },
                {
                  $addFields: {
                    month: { $month: "$date" }
                  }
                },
                {
                  $group: {
                    _id: "$month",
                    totalCommission: { $sum: "$commission_app" } // Utilisation directe de commission_app
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

          async getTotalCommissionApp() {
            try {
              // Utilisation de l'agrégation MongoDB pour calculer la somme
              const result = await Transaction.aggregate([
                {
                  $match: {
                    status: TransactionStatusEnum.VALIDEE
                  }
                },
                {
                  $group: {
                    _id: null,
                    totalCommission: { $sum: "$commission_app" }
                  }
                }
              ]);
        
              // Si aucun résultat (pas de transactions validées), retourne 0
              if (!result.length) {
                return 0;
              }
              
              let tot = result[0].totalCommission;
              return tot;
            } catch (error) {
              throw new Error(`Erreur lors du calcul de la somme des commissions: ${error.message}`);
            }
        }
};
module.exports = TransactionDAO;