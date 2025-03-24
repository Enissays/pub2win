const mongoose = require('mongoose');
const db = mongoose.connection.db;
const User = require('./models/user.model');
const Signalement = require('./models/signalement.model');
const Offre = require('./models/offre.model');
const { ObjectId } = mongoose.Types;
const transaction=require('./models/transaction.model');
const Commercant = require('./models/commercant.model');

async function getDbCollections() {
  const collections = await db.listCollections().toArray();
  return collections.map(c => c.name);
}


async function addUser() {
 
  const newUser = new User({
    email: "nouvelle2-boutique@exemple.com",
    nom: "Martin2",
    prenom: "Sophie2",
    username: "boutique_sm2",
    password_hash: "$2b$10$AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIj",
    isBanned: false,
    isTimeouted: false,
    role: "CLIENT",
    date_inscription: new Date("2025-02-11T15:04:56.637+00:00"),
    userType: "Commercant",
    coins: 250,
    status: "pending",
    createdAt: new Date("2025-02-11T15:04:56.664+00:00"),
    updatedAt: new Date("2025-02-11T15:04:56.664+00:00"),
    abonnement: {
      formule_id: "67cee3a3d3ae689459451e58",
      date_debut: new Date("2025-07-11T15:04:56.664+00:00"),
      date_fin: new Date("2025-09-11T15:04:56.664+00:00"),
      auto_renouvellement: true,
      status: "ACTIF",
      date_dernier_paiement: new Date("2025-06-11T15:04:56.664+00:00"),
      date_prochain_paiement: new Date("2025-06-11T15:04:56.664+00:00")
  }
  });
  await newUser.save();
    console.log("Utilisateur ajouté avec succès");
    return newUser; // Retourner l'utilisateur créé si besoin
}

async function addSignalemnt() {
   
  const newSignalement = new Signalement({
    user_signale_id: "67d0511820c7d8db66df6430",
    raison: "harcelement",
    user_username: "boutique_md",
    date_signalement: new Date("2024-07-11T15:04:56.637+00:00"),
  });

  await newSignalement.save();
    console.log("Signalement ajouté avec succès");
    return newSignalement; // Retourner l'utilisateur créé si besoin  

}

async function addOffre() {
  const newOffre = new Offre({
    commercant_id: new ObjectId("67e16cf4db896856822c7ced"), // ID du commerçant
    titre: "Annonce pour la bar",
    description: "Annonce la Bière",
    montant_coins: 50,
    date_debut: new Date("2025-03-10T15:01:17.154+00:00"),
    date_fin: new Date("2025-03-10T15:01:17.154+00:00"),
    is_active: true,
    clients: []
  });
  
  await newOffre.save();
  console.log("Offre ajoutée avec succès");
  return newOffre; // Retourner l'offre créée
}

async function addClientToOffre() {
  const offreId = "67d7103a7e6d487735eb7d40";

  const offre = await Offre.findById(offreId);
  if (!offre) {
    throw new Error("Offre introuvable");
  }
  offre.clients.push({
    client: new ObjectId("67e1ddcf013c043eec9f8c75"),
    is_completed: false,
    date_utilisation: new Date("2025-01-11T15:04:56.637+00:00")
  });
  await offre.save();
  console.log("Client to offre ajouté avec succès");
  return offre;
  
}

async function addTransaction() {
  try {
    const newTransaction = new transaction({
      client_id: new ObjectId("67cdbff0a6d36ab7bce9a5cb"),
      commercant_id: new ObjectId("67cee3a3d3ae689459451e58"),
      montant: 180.25,
      commission_app: 9.01,
      date: new Date("2025-02-11T15:04:56.637+00:00"),
      status: "VALIDEE",
      description: "Achat de produits électroniques"
    });
    
    await newTransaction.save();
    console.log("Transaction ajoutée avec succès");
    return newTransaction;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la transaction:", error);
    throw error;
  }
}

async function updateClientStatus (){
  try {
    // ID de l'offre
    const offreId = "67d617e029b4f4bec3081762";
    
    // ID du premier client dans le tableau (de l'offre)
    const clientId = "67d617e029b4f4bec3081763"; // ID du premier élément du tableau clients
    
    // Mise à jour avec l'opérateur $set pour changer is_completed à true pour ce client spécifique
    const result = await Offre.updateOne(
      { 
        "_id": offreId, 
        "clients._id": clientId 
      },
      { 
        "$set": { "clients.$.is_completed": true } 
      }
    );
    
    console.log("Résultat de la mise à jour:", result);
    
    // Vérifier que la mise à jour a fonctionné
    const updatedOffre = await Offre.findById(offreId);
    console.log("Premier client après mise à jour:", updatedOffre.clients[0]);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
  }
};

async function getAllUsernamesUtilis() {
  try {
    const commercantsFromUser = await User.find({ role: "COMMERCANT" });
    console.log("Nombre de commerçants dans la collection User:", commercantsFromUser.length);
    return docuemnts;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des usernames : ${error.message}`);
}
}




async function updateClientInf (){
  try {
    const clientId = "67e1ddcf013c043eec9f8c75"; // ID du premier élément du tableau clients
    
    // Mise à jour avec l'opérateur $set pour changer is_completed à true pour ce client spécifique
    const result = await User.updateOne(
      { 
        "_id": clientId, 
      },
      { 
        "$set": { "date_inscription": new Date("2024-10-11T15:04:56.637+00:00") } 
      }
    );
    
    console.log("Résultat de la mise à jour:", result);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
  }
};



module.exports = {
  getDbCollections,
  addUser,
  addSignalemnt,
  addOffre,
  addClientToOffre,
  addTransaction,
  updateClientStatus,
  getAllUsernamesUtilis,
  updateClientInf
};