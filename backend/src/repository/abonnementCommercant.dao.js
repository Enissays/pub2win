const AbonnementCommercant = require('../models/abonnementCommercant.model');
const { AbonnementStatusEnum } = require('../models/enums');


const AbonnementCommercantDAO = {
    async createAbonnementCommercant(abonnementCommercantData) {
        if (!abonnementCommercantData || typeof abonnementCommercantData !== 'object') {
        return null;
        }
        
        const newAbonnementCommercant = new AbonnementCommercant(abonnementCommercantData);
        return await newAbonnementCommercant.save().catch(() => null);
    },
    
    async getAbonnementCommercantById(abonnementCommercantId) {
        if (!abonnementCommercantId) {
        return null;
        }
        
        return await AbonnementCommercant.findById(abonnementCommercantId).catch(() => null);
    },
    
    //GET /admin/Dashboard/nbrAbonnement/years
    async getUniqueInscriptionYears() {
      try {
        // Utiliser $toDate pour s'assurer que la date est bien convertie
        const yearsResult = await AbonnementCommercant.aggregate([
          {
            $project: {
              year: { 
                $year: { 
                  $toDate: "$date_debut" 
                } 
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
    
        // Mapper directement les années et filtrer les null
        const years = yearsResult
          .map(item => item._id)
          .filter(year => year !== null && year !== undefined);
    
        // Retourner les années ou l'année courante si aucun résultat
        return years.length > 0 ? years : [new Date().getFullYear()];
    
      } catch (error) {
        console.error("Erreur lors de la récupération des années d'abonnement:", error);
        return [new Date().getFullYear()];
      }
    },


    //GET /admin/Dashboard/nbrAbonnement
    async getActiveSubscriptionsByMonth(year) {
      try {
        // Vérifier que year est un nombre valide
        const requestedYear = parseInt(year);
        if (isNaN(requestedYear)) {
          throw new Error("L'année fournie n'est pas valide");
        }
        
        // Récupérer le nombre d'abonnements actifs par mois pour l'année demandée
        const subscriptionsByMonth = await AbonnementCommercant.aggregate([
          {
            $match: {
              status: AbonnementStatusEnum.ACTIF,
              date_debut: {
                $gte: new Date(`${requestedYear}-01-01`),
                $lt: new Date(`${requestedYear+1}-01-01`)
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
        
        return subscriptionsByMonth;
      } catch (error) {
        console.error(`Erreur lors du comptage des abonnements actifs par mois pour l'année ${year}:`, error);
        return {};
      }
    },

    async getAbonnementCommercantByEmail(email) {
        if (!email) {
        return null;
        }
        
        return await AbonnementCommercant.findOne({ email }).catch(() => null);
    },
    
    async getAbonnementCommercantByUsername(username) {
        if (!username) {
        return null;
        }
        
        return await AbonnementCommercant.findOne({ username }).catch(() => null);
    },
    
    async updateAbonnementCommercant(abonnementCommercantId, updateData) {
        if (!abonnementCommercantId || !updateData || typeof updateData !== 'object') {
        return null;
        }
        
        return await AbonnementCommercant.findByIdAndUpdate(abonnementCommercantId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteAbonnementCommercant(abonnementCommercantId) {
        if (!abonnementCommercantId) {
        return null;
        }
        
        return await AbonnementCommercant.findByIdAndDelete(abonnementCommercantId).catch(() => null);
    },
    
    async getAllAbonnementCommercants() {
        return await AbonnementCommercant.find().catch(() => []);
    },
    };

module.exports = AbonnementCommercantDAO;