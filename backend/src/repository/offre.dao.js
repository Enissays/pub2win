const mongoose = require('mongoose');
const Offre = require('./../models/offre.model');
const Commercant = require('../models/commercant.model');
const commercantService = require('../services/commercant.service');
const { ObjectId } = mongoose.Types;

const OffreDAO = {

  
  //GET /admin/Dashboard/nbrAnnoncePublier/years
  async getAvailableOffreYears() {
    try {
      // Agréger pour obtenir toutes les années uniques des dates de début d'offres
      const allOffre=await Offre.find();
      console.log("AllOffre: ",allOffre);

      const yearsResult = await Offre.aggregate([
        {
            // Filtrer pour ne garder que les offres actives
            $match: {
                is_active: true
            }
        },
        {
            // Projeter uniquement l'année de la date de début d'offre
            $project: {
                year: { $year: "$date_debut" }
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

      if (yearsResult.length === 0) {
        return [null];
      }

      return yearsResult;
    } catch (error) {
      console.error("Erreur lors de la récupération des années disponibles pour les offres:", error);
      // En cas d'erreur, retourner au moins l'année courante
      return [null];
    }
  },

    //GET /admin/Dashboard/nbrAnnoncePublier
    async getActiveOffresByMonth(year) {
      try {
        const requestedYear = parseInt(year);
        
        // Récupérer le nombre d'offres actives par mois pour l'année demandée
        const offresByMonth = await Offre.aggregate([
          {
            $match: {
              is_active: true,
              date_debut: {
                $gte: new Date(`${requestedYear}-01-01T00:00:00.000Z`),
                $lt: new Date(`${requestedYear+1}-01-01T00:00:00.000Z`)
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
        
        return offresByMonth;
      } catch (error) {
        console.error(`Erreur DAO lors du comptage des offres actives par mois pour l'année ${year}:`, error);
        throw error;
      }
    },


    //GET /admin/Dashboard/nbrAnnonceAcceptees
    async countNonCompletedClientOffresByMonth(year) {
      try {
        // Vérifier que year est un nombre valide
        const requestedYear = parseInt(year);
        
        // Récupérer le nombre d'offres avec clients non complétés par mois pour l'année demandée
        const offresByMonth = await Offre.aggregate([
          {
            // Filtrer pour ne garder que les offres actives
            $match: {
                is_active: true
            }
        },
          // Dé-normaliser l'array clients
          {
            $unwind: "$clients"
          },
          // Ajouter le champ is_completed et date_utilisation qui sont dans le sous-document
          {
            $addFields: {
              "is_completed": "$clients.is_completed",
              "date_utilisation": "$clients.date_utilisation"
            }
          },
          // Filtrer uniquement les offres non complétées et pour l'année demandée
          {
            $match: {
              is_completed: false,
              date_utilisation: {
                $gte: new Date(`${requestedYear}-01-01T00:00:00.000Z`),
                $lt: new Date(`${requestedYear+1}-01-01T00:00:00.000Z`)
              }
            }
          },
          // Extraire le mois de la date d'utilisation
          {
            $addFields: {
              month: { $month: "$date_utilisation" }
            }
          },
          // Grouper par mois et compter
          {
            $group: {
              _id: "$month",
              count: { $sum: 1 }
            }
          },
          // Trier par mois
          {
            $sort: { _id: 1 }
          }
        ]);
        
        return offresByMonth;
      } catch (error) {
        console.error(`Erreur lors du comptage des offres non complétées par mois pour l'année ${year}:`, error);
        return [];
      }
        const newOffre = new Offre(offreData);
        return await newOffre.save().catch((e) => {
            console.error('Error creating offre:', e);
            return null;

        });
    },
    
    async getAvailableClientOffreYears() {
      try {
        // Agréger pour obtenir toutes les années uniques des dates d'utilisation d'offres
        const allOffre= await Offre.find();
        console.log(allOffre);
        const yearsResult = await Offre.aggregate([
          // Vérifier d'abord que l'offre a des clients
          {
            $match: {
              $and: [
                  { clients: { $exists: true, $ne: null, $not: { $size: 0 } } },
                  { is_active: true }
              ]
          }
          },
          // Dé-normaliser l'array clients
          {
            $unwind: "$clients"
          },
          // Ne sélectionner que les clients selon les critères
          {
            $match: {
              $and: [
                { "clients.is_completed": false },
                { "clients.date_utilisation": { $exists: true, $ne: null } }
              ]
            }
          },
          // Ajouter le champ year pour extraire l'année de la date d'utilisation
          {
            $addFields: {
              year: { $year: "$clients.date_utilisation" }
            }
          },
          // Ensuite filtrer sur l'année
          {
            $match: {
              "year": { $ne: null }
            }
          },
          // Regrouper par année pour obtenir des valeurs uniques
          {
            $group: {
              _id: "$year",
              count: { $sum: 1 }
            }
          },
          // Trier les années par ordre décroissant
          {
            $sort: { _id: -1 }
          }
        ]);

        console.log("yearsResult: ", yearsResult);

        // Si aucun résultat, retourner l'année courante
        if (yearsResult.length === 0 || yearsResult === null) {
          return null;
        }

        console.log("yearsResult: ",yearsResult);

        return yearsResult;
      } catch (error) {
        console.error("Erreur lors de la récupération des années disponibles pour les utilisations d'offres:", error);
        return [];
      }
    },

    async getallInfluenceurperCommercantYears(username) {
      try {
        /*const allOffre = await Offre.find();
        console.log(JSON.stringify(allOffre, null, 2)); */
        const commercants = await Commercant.find({},username);
        console.log("commercants: ",commercants);
        const commercant_id=commercants.map(commercant => commercant._id);
        console.log("commercant_id: ",commercant_id);

        const commercantObjectId = commercant_id[0];


      const resultats = await Offre.aggregate([
          // Filtrer pour le commerçant spécifique
          { 
              $match: { 
                  commercant_id: commercantObjectId,
                  is_active: true
              } 
          },
           // 2. Déplier les clients
          { $unwind: "$clients" },
          {
            $match :{ 
              "clients.is_completed":  false 
            } 
          },
          // 3. Extraire l'année de la date d'utilisation
          {
            $addFields: {
                annee: { $year: "$clients.date_utilisation" }
            }
        },

        // 4. Grouper et obtenir des années uniques
        {
            $group: {
                _id: "$annee"
            }
        },

        // 5. Trier par année décroissante
        {
            $sort: { _id: -1 }
        },

        // 6. Projection finale pour retourner uniquement l'année
        {
            $project: {
                _id: 0,
                annee: "$_id"
            }
        }
          
      ]);
      return resultats;

    } catch (error) {
      console.error("Erreur lors de la récupération des années disponibles pour les utilisations d'offres:", error);
      return [];
    }
  },

  async getNombreInfluenceurParMois(username, requestedYear) {
    const commercants = await Commercant.find({},username);
    console.log("commercants: ",commercants);
    const commercant_id=commercants.map(commercant => commercant._id);
    console.log("commercant_id: ",commercant_id);

    const commercantObjectId = commercant_id[0];
    try {
      const influenceurParMois = await Offre.aggregate([
          // 1. Filtrer par commerçant et offres actives
          { 
              $match: { 
                  commercant_id: commercantObjectId,
                  is_active: true
              } 
          },

          // 2. Déplier les clients
          { $unwind: "$clients" },
          {
            $match :{ 
              "clients.is_completed":  false 
            } 
          },
          // 3. Filtrer par année
          {
              $match: {
                  "clients.date_utilisation": {
                      $gte: new Date(`${requestedYear}-01-01T00:00:00.000Z`),
                      $lt: new Date(`${requestedYear + 1}-01-01T00:00:00.000Z`)
                  }
              }
          },

          // 4. Extraire le mois de la date d'utilisation
          {
              $addFields: {
                  mois: { $month: "$clients.date_utilisation" }
              }
          },

          // 5. Grouper par mois et compter TOUS les clients
          {
              $group: {
                  _id: "$mois",
                  nombre_clients: { $push: "$clients._id" }
              }
          },

          // 6. Transformer pour obtenir le compte
          {
              $project: {
                  mois: "$_id",
                  nbrInfluenceur: { $size: "$nombre_clients" },
                  _id: 0
              }
          },
          
          // 7. Trier par mois
          {
              $sort: { mois: 1 }
          }
      ]);
      console.log("influenceurParMois: ",influenceurParMois);
      return influenceurParMois;
  } catch (error) {
      console.error('Erreur lors de la récupération des clients par mois:', error);
      throw error;
  }
    
  },

  async getCountActiveOffres() {
    try {
      const count = await Offre.countDocuments({
        is_active: true,
        date_debut: { $exists: true }
      });
      
      return count;
    } catch (error) {
      throw new Error(`Erreur lors du comptage des offres actives: ${error.message}`);
    }
  },

  async getCountInfluenceursWithPendingOffers() {
    try {
      // Trouver les offres correspondant aux critères
      const offres = await Offre.find({
        clients: { $exists: true, $ne: null, $not: { $size: 0 } },
        is_active: true,
      });
      
      // Compter le nombre total de clients qui satisfont les critères
      let totalClients = 0;
      
      offres.forEach(offre => {
        offre.clients.forEach(clientObj => {
          if (!clientObj.is_completed && clientObj.date_utilisation) {
            totalClients++;
          }
        });
      });
      
      // Retourner le nombre total de clients
      return totalClients;
    } catch (error) {
      throw new Error(`Erreur lors du comptage des clients avec offres en attente: ${error.message}`);
    }
  }
}

module.exports = OffreDAO;