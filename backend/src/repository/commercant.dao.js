const Commercant = require('../models/commercant.model');
const { AbonnementStatusEnum } = require('../models/enums');
const CommercantDAO = {
    async createCommercant(commercantData) {
        if (!commercantData || typeof commercantData !== 'object') {
            return null;
        }
        
        const newCommercant = new Commercant(commercantData);
        return await newCommercant.save().catch(() => null);
    },
    
    async getCommercantById(commercantId) {
        if (!commercantId) {
            return null;
        }
        
        return await Commercant.findById(commercantId).catch(() => null);
    },
    
    async getCommercantByEmail(email) {
        if (!email) {
            return null;
        }
        
        return await Commercant.findOne({ email }).catch(() => null);
    },
    
    async getCommercantByUsername(username) {
        if (!username) {
            return null;
        }
        
        return await Commercant.findOne({ username }).catch(() => null);
    },
    
    async updateCommercant(commercantId, updateData) {
        if (!commercantId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await Commercant.findByIdAndUpdate(commercantId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteCommercant(commercantId) {
        if (!commercantId) {
            return null;
        }
        
        return await Commercant.findByIdAndDelete(commercantId).catch(() => null);
    },
    
    async getAllCommercants() {
        return await Commercant.find().catch(() => []);
    },

    async getUniqueInscriptionYears() {
      try {
          // Trouver un document Commercant et l'examiner en détail
          const sampleDoc = await Commercant.find();
          console.log("Document Commercant trouvé :", sampleDoc);
  
  
          // Aggregation avec diagnostic complet
          const yearsResult = await Commercant.aggregate([
              {
                  $match: { 
                      abonnement: { $exists: true, $ne: null } 
                  }
              },
              {
                  $unwind: {
                      path: "$abonnement",
                      preserveNullAndEmptyArrays: false
                  }
              },
              {
                $project: {
                  year: { 
                      $year: "$date_inscription"
                  }
              }
              },
              {
                  $group: {
                      _id: "$year",
                      count: { $sum: 1 }
                  }
              },
              {
                  $sort: { _id: -1 }
              }
          ]);
      
          console.log("yearsResult: ",yearsResult);
          
          // Mapper directement les années
          const years = yearsResult
              .map(item => item._id)
              .filter(year => year !== null && year !== undefined);
  
          console.log("Années trouvées :", years);
  
          // Retourner les années ou l'année courante si aucun résultat
          return years.length > 0 ? years : [null];
      
      } catch (error) {
          console.error("Erreur lors de la récupération des années d'abonnement:", error);
          console.error("Détails de l'erreur:", error);
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
          
          // Récupérer le nombre d'abonnements actifs par mois pour l'année demandée
          const subscriptionsByMonth = await Commercant.aggregate([
            // 1. Filtrer les commerçants avec abonnement actif ET qui ont une date de début
            {
              $match: {
                'abonnement.status': AbonnementStatusEnum.ACTIF,
                'abonnement.date_debut': { 
                  $exists: true, 
                  $ne: null 
                }
              }
            },
            // 2. Filtre additionnel pour l'année demandée (seulement pour les documents avec date_debut)
            {
              $match: {
                'abonnement.date_debut': {
                  $gte: new Date(`${requestedYear}-01-01`),
                  $lt: new Date(`${parseInt(requestedYear) + 1}-01-01`)
                }
              }
            },
            // 3. Ajouter un champ pour le mois
            {
              $addFields: {
                month: { $month: "$abonnement.date_debut" }
              }
            },
            // 4. Grouper par mois et compter
            {
              $group: {
                _id: "$month",
                count: { $sum: 1 }
              }
            },
            // 5. Trier par mois
            {
              $sort: { _id: 1 }
            }
          ]);
          console.log(subscriptionsByMonth);
          return subscriptionsByMonth;
        } catch (error) {
          console.error(`Erreur lors du comptage des abonnements actifs par mois pour l'année ${year}:`, error);
          return {};
        }
      },

      async getAllUsernames() {
        try {
          const commercants = await Commercant.find({}, 'username');
          return commercants.map(commercant => commercant.username);
        } catch (error) {
          throw new Error(`Erreur lors de la récupération des usernames : ${error.message}`);
      }
    },

    async getCountCommercantWithActiveSubscription() {
      try {
        const count = await Commercant.countDocuments({
          'abonnement.status': AbonnementStatusEnum.ACTIF,
          'abonnement.date_debut': { 
            $exists: true, 
            $ne: null 
          }
        });
        
        return count;
      } catch (error) {
        throw new Error(`Erreur lors du comptage des commerçants avec abonnement actif: ${error.message}`);
      }
    }
  };
  
module.exports = CommercantDAO;