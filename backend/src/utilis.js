const mongoose = require('mongoose');
const db = mongoose.connection.db;
const User = require('./models/user.model');
const Signalement = require('./models/signalement.model');

async function getDbCollections() {
  const collections = await db.listCollections().toArray();
  return collections.map(c => c.name);
}


async function addUser() {
 
  const newUser = new User({
    email: "nouvelle-boutique@exemple.com",
    nom: "Martin",
    prenom: "Sophie",
    username: "boutique_sm",
    password_hash: "$2b$10$AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIj",
    isBanned: false,
    isTimeouted: false,
    role: "COMMERCANT",
    date_inscription: new Date("2025-02-11T15:04:56.637+00:00"),
    userType: "Commercant",
    coins: 250,
    status: "pending",
    createdAt: new Date("2025-02-11T15:04:56.664+00:00"),
    updatedAt: new Date("2025-02-11T15:04:56.664+00:00"),
    __v: 0
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
module.exports = {
  getDbCollections,
  addUser,
  addSignalemnt
};