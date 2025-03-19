const SignalementDao = require('../repository/signalement.dao');

const SignalementService = {
  async getSignalementYears() {
    try {
      // Obtenir directement les années depuis la DAO
      const yearsResult = await SignalementDao.getSignalementYears();

      if (yearsResult === null) {
        console.log("yearsResult is null", yearsResult);
        return null;
      }

      // Mapper uniquement les éléments valides
      const years = yearsResult.map(item => item._id);
    
      // Retourner les années ou l'année courante si aucun résultat
      return years.length > 0 ? years : [null];
        
    } catch (error) {
      console.error("Erreur service lors de la récupération des années disponibles:", error);
      return [null];
    }
  },

  async getSignalementByMonth(year) {
    try {
      // Vérifier que year est un nombre valide
      const requestedYear = parseInt(year);
      if (isNaN(requestedYear)) {
        throw new Error("L'année fournie n'est pas valide");
      }
      
      // Obtenir les données brutes du DAO
      const usersByMonth = await SignalementDao.getSignalementByMonth(year);
      console.log("usersByMonth", usersByMonth);
      
      // Initialiser le résultat avec tous les mois de l'année à zéro
      const result = {};
          
      // Déterminer le nombre de mois à inclure pour l'année demandée
      const currentDate = new Date();
      //operateur ternaire
      const monthsToInclude = (requestedYear === currentDate.getFullYear())
        ? currentDate.getMonth() + 1 : 12;
      
      // Initialiser tous les mois avec zéro
      for (let mon = 1; mon <= monthsToInclude; mon++) {
        result[mon] = { nbrSignalement: 0 };
      }
      
      // Ajouter les comptes réels d'offres
      usersByMonth.forEach(item => {
        const month = item.month;
        if (result[month]) {
          result[month].nbrSignalement = item.count;
        }
      });
      
      return result;
    } catch (error) {
      console.error(`Erreur lors du comptage total des utilisateurs pour l'année ${year}:`, error);
      return null;
    }
  },
  
  async getAllSignalements() {
    try {
      // Récupérer tous les signalements depuis le DAO
      const signalements = await SignalementDao.getALLSignalements();
      
      // Créer un objet pour regrouper par user_signale_id
      const signalementsByUser = {};
      
      // Regrouper les signalements par utilisateur
      signalements.forEach(signalement => {
        const userId = signalement.user_signale_id.toString();
        
        if (!signalementsByUser[userId]) {
          signalementsByUser[userId] = {
            user_signale_id: signalement.user_signale_id,
            user_username: signalement.user_username,
            signalements: []
          };
        }
        
        signalementsByUser[userId].signalements.push({
          raison: signalement.raison,
          date_signalement: signalement.date_signalement
        });
      });
      
      // Convertir l'objet en tableau
      return Object.values(signalementsByUser);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des signalements:", error);
      return null;
    }
  },

  async getCountSignalements() {
    try {
      return await SignalementDao.getCountSignalements();
    } catch (error) {
      throw new Error(`Service - Erreur lors du comptage des signalements: ${error.message}`);
    }
  }
};
  
module.exports = SignalementService;