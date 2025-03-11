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
            const sampleDoc = await Commercant.findOne();
            console.log("Document Commercant complet :", JSON.stringify(sampleDoc, null, 2));

            // Vérifier la structure exacte de l'objet
            console.log("Type de abonnement :", typeof sampleDoc.abonnement);
            console.log("Clés de abonnement :", Object.keys(sampleDoc.abonnement));
    
            // Aggregation avec diagnostic complet
            const yearsResult = await Commercant.aggregate([
                {
                    $match: { 
                        abonnement: { $exists: true, $ne: null } 
                    }
                },
                {
                    $unwind: "$abonnement"  // Déplier l'objet abonnement
                },
                {
                    $project: {
                        originalDate: "$abonnement.date_debut",
                        year: { 
                            $year: "$abonnement.date_debut"
                        }
                    }
                },
                {
                    $group: {
                        _id: "$year"
                    }
                },
                {
                    $sort: { _id: -1 }
                }
            ]);
        
            console.log("Résultat complet de l'agrégation :", JSON.stringify(yearsResult, null, 2));
            
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
            return [2025];
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
      }
    };
module.exports = CommercantDAO;