const User = require('./../models/user.model');
const Client = require('./../models/client.model');
const { RoleEnum } = require('./../models/enums');
const bcrypt = require('bcrypt');

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
        const yearsResult = await User.aggregate([
          {
            // Filtrer uniquement les documents avec date_inscription
            $match: {
              date_inscription: { $exists: true, $ne: null }
            }
          },
          {
            $project: {
              year: { $year: "$date_inscription" }
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
    
        return yearsResult;
    
      } catch (error) {
        console.error("Erreur DAO lors de la récupération des années d'inscription:", error);
        return [new Date().getFullYear()];
      }
    },
    

    //GET /admin/Dashboard/users(commercant et influenceur)
    async getTotalUserCountByMonth(year) {
      try {
        const requestedYear = parseInt(year);
        
        // Récupérer le nombre total d'utilisateurs par mois pour l'année demandée
        const usersByMonth = await User.aggregate([
          { 
            $match: { 
              date_inscription: {
                $gte: new Date(`${requestedYear}-01-01T00:00:00.000Z`),
                $lt: new Date(`${requestedYear+1}-01-01T00:00:00.000Z`)
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
        
        return usersByMonth;
    
      } catch (error) {
        console.error(`Erreur lors du comptage total des utilisateurs pour l'année ${year}:`, error);
        return [];
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
    
    async deleteByUsername(username) { 
      let user=await User.find({})
           
      console.log("user: ",user);
      return await User.findOneAndDelete({ username: username }).catch(() => null);
    },

    async getAllUsers() {
      return await User.find({ role: { $ne: RoleEnum.ADMIN } }).catch(() => []);
    },

    async getCountUsers() {
      try {
        const count = await User.countDocuments({ date_inscription: { $exists: true } });
        return count;
      } catch (error) {
        throw new Error(`Erreur lors du comptage des utilisateurs: ${error.message}`);
      }
    },
    async updateUserFields(username, updatedFields) {
      try {
        const user = await User.findOne({ username });
        
        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }
        console.log(1)
        console.log(updatedFields)
        // Traiter le mot de passe séparément s'il est fourni
        if (updatedFields.password_hash) {
          console.log(2)
          // Générer un hash à partir du mot de passe en clair
          const hashedPassword = await bcrypt.hash(updatedFields.password_hash, 10);
          console.log("hashedPassword: ",hashedPassword);
          // Définir le hash dans l'utilisateur
          user.password_hash = hashedPassword;
          
        }
        else{
          console.log(3)
            // Mettre à jour les autres champs
            Object.keys(updatedFields).forEach(key => {
              if (user[key] !== undefined) {
                user[key] = updatedFields[key];
              }
            });
        }
        console.log(4)
        
        return await user.save();
      } catch (error) {
        throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
      }
    },

    async getUserByRole() {
      
      return await User.findOne({ role:RoleEnum.ADMIN }).catch(() => null);
    },
};

module.exports = UserDAO;