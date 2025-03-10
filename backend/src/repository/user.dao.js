const User = require('./../models/user.model');
const Client = require('./../models/client.model');
const { RoleEnum } = require('./../models/enums');

const UserDAO = {
    async createUser(userData) {
      if (!userData || typeof userData !== 'object') {
        return null;
      }
      
      const newUser = new User(userData);
      return await newUser.save().catch(() => null);
    },
    
    //GET /admin/Dashboard/users/years
    async getUniqueInscriptionYears() {
      try {
        // Agréger pour obtenir toutes les années uniques des dates d'inscription
        const yearsResult = await User.aggregate([
          {
            // Projeter uniquement l'année de la date d'inscription
            $project: {
              year: { $year: "$date_inscription" }
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
        
        // Retourner le résultat brut de l'agrégation

        if (yearsResult.length === 0) {
          return [new Date().getFullYear()];
        }

        return yearsResult;
      } catch (error) {
        console.error("Erreur DAO lors de la récupération des années d'inscription:", error);
        throw error;
      }
    },
    

    //GET /admin/Dashboard/users(commercant et influenceur)
    async getTotalUserCountByMonth(year) {
      try {
        const requestedYear = parseInt(year);
        // Récupérer le nombre de commerçants par mois pour l'année demandée
        const commercantsByMonth = await User.aggregate([
          { 
            $match: { 
              role: RoleEnum.COMMERCANT,
              date_inscription: {
                $gte: new Date(`${requestedYear}-01-01`),
                $lt: new Date(`${requestedYear+1}-01-01`)
              }
            }
          },
          {
            $addFields: {
              month: { $month: "$date_inscription" }
            }
          },
          {
            $group: {
              _id: "$month",
              count: { $sum: 1 }
            }
          }
        ]);
        
        // Récupérer le nombre d'influenceurs par mois pour l'année demandée
        const influenceursByMonth = await Client.aggregate([
          { 
            $match: { 
              isInfluenceur: true,
              date_inscription: {
                $gte: new Date(`${requestedYear}-01-01`),
                $lt: new Date(`${requestedYear+1}-01-01`)
              }
            }
          },
          {
            $addFields: {
              month: { $month: "$date_inscription" }
            }
          },
          {
            $group: {
              _id: "$month",
              count: { $sum: 1 }
            }
          }
        ]);
        
        return { commercantsByMonth, influenceursByMonth };

      } catch (error) {
        console.error(`Erreur lors du comptage total des utilisateurs pour l'année ${year}:`, error);
        return {};
      }
    },

    async getUserById(userId) {
      if (!userId) {
        return null;
      }
      
      return await User.findById(userId).catch(() => null);
    },
  
    async getUserByEmail(email) {
      if (!email) {
        return null;
      }
      
      return await User.findOne({ email }).catch(() => null);
    },
  
    async getUserByUsername(username) {
      if (!username) {
        return null;
      }
      
      return await User.findOne({ username }).catch(() => null);
    },
  
    async updateUser(userId, updateData) {
      if (!userId || !updateData || typeof updateData !== 'object') {
        return null;
      }
      
      return await User.findByIdAndUpdate(userId, updateData, { new: true }).catch(() => null);
    },
  
    async deleteUser(userId) {
      if (!userId) {
        return null;
      }
      
      return await User.findByIdAndDelete(userId).catch(() => null);
    },
  
    async getAllUsers() {
      return await User.find().catch(() => []);
    }
};

module.exports = UserDAO;