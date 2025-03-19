const CommercantDAO= require('..//repository/commercant.dao');
const Commercant = require('..//models/commercant.model');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const commercantService = {
    async getAvailableAboComYears() {
        try {
            // Obtenir directement les années depuis la DAO
            const years = await CommercantDAO.getUniqueInscriptionYears();

            return years;
        } catch (error) {
            console.error("Erreur service lors de la récupération des années disponibles pour les abonnements commercants:", error);
            return [null];
        }
    },

      async getActiveSubscriptionsByMonth(year) {
        try {
          // Vérifier que year est un nombre valide
          const requestedYear = parseInt(year);
          if (isNaN(requestedYear)) {
            throw new Error("L'année fournie n'est pas valide");
          }
          
          // Obtenir les données brutes du DAO
          const subscriptionsByMonth = await CommercantDAO.getActiveSubscriptionsByMonth(year);
          
          // Initialiser le résultat avec tous les mois de l'année à zéro
          const result = {};
              
          // Déterminer le nombre de mois à inclure pour l'année demandée
          const currentDate = new Date();
          const monthsToInclude = (requestedYear === currentDate.getFullYear())
            ? currentDate.getMonth() + 1 : 12;
          
          // Initialiser tous les mois avec zéro
          for (let month = 1; month <= monthsToInclude; month++) {
            result[month] = { AboonementCommercant: 0 };
          }
          
          // Ajouter les comptes réels d'offres
          subscriptionsByMonth.forEach(item => {
            const month = item._id;
            if (result[month]) {
              result[month].AboonementCommercant = item.count;
            }
          });
          
          return result;
        } catch (error) {
          console.error(`Erreur service lors du comptage des abonnements actifs par mois pour l'année ${year}:`, error);
          
          // En cas d'erreur, retourner un objet vide ou un objet avec l'année courante
          return {
            success: false,
            data: {},
            year: new Date().getFullYear()
          };
        }
      },

      async getAllUsernames() {
        try {
          let comme= await CommercantDAO.getAllUsernames();
          return comme;
        } catch (error) {
          throw new Error(`Erreur de service : ${error.message}`);
        }
      } 
};
module.exports = commercantService;