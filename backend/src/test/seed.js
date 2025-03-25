require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Groupe = require('../models/groupe.model');
const GroupeUser = require('../models/groupeUser.model');
const User = require('../models/user.model');
const { RoleEnum } = require('../models/enums');  // Importer les enums

const MONGO_URI = process.env.MONGODB_URI;

async function seedDatabase() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connecté à MongoDB Atlas");

        // 🔹 Supprimer les anciennes données
        await Groupe.deleteMany({});
        await GroupeUser.deleteMany({});
        await User.deleteMany({});
        console.log("✅ Anciennes données supprimées");

        // 🔹 Hachage des mots de passe
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = (password) => bcrypt.hashSync(password, salt);

        // 🔹 Insérer des Users de test avec des mots de passe hachés et les champs requis
        const user1 = new User({
            nom: "Aymane",
            prenom: "Aymane",  // Ajouter le prénom
            email: "aymane@example.com",
            username: "aymane",
            password_hash: passwordHash("test123"),
            role: RoleEnum.ADMIN,  // Utiliser RoleEnum pour le role
            date_inscription: new Date(),
        });

        const user2 = new User({
            nom: "Ali",
            prenom: "Ali",  // Ajouter le prénom
            email: "ali@example.com",
            username: "ali",
            password_hash: passwordHash("test123"),
            role: RoleEnum.CLIENT,  // Utiliser RoleEnum pour le role
            date_inscription: new Date(),
        });

        const user3 = new User({
            nom: "Sara",
            prenom: "Sara",  // Ajouter le prénom
            email: "sara@example.com",
            username: "sara",
            password_hash: passwordHash("test123"),
            role: RoleEnum.COMMERCANT,  // Utiliser RoleEnum pour le role
            date_inscription: new Date(),
        });

        await user1.save();
        await user2.save();
        await user3.save();
        console.log("✅ Utilisateurs ajoutés");

        // 🔹 Créer un Groupe de test
        const groupe1 = new Groupe({
            nom: "Groupe Test",
            description: "Un groupe de discussion test",
            createur_id: user1._id
        });
        await groupe1.save();
        console.log("✅ Groupe ajouté");

        // 🔹 Ajouter les Users au Groupe
        const groupeUser1 = new GroupeUser({ groupe_id: groupe1._id, user_id: user1._id, role: "ADMIN" });
        const groupeUser2 = new GroupeUser({ groupe_id: groupe1._id, user_id: user2._id, role: "MEMBRE" });
        const groupeUser3 = new GroupeUser({ groupe_id: groupe1._id, user_id: user3._id, role: "MEMBRE" });

        await groupeUser1.save();
        await groupeUser2.save();
        await groupeUser3.save();
        console.log("✅ Utilisateurs ajoutés au groupe");

        // 🔹 Fermer la connexion à la base de données
        mongoose.connection.close();
        console.log("✅ Base de données remplie et connexion fermée");

    } catch (error) {
        console.error("❌ Erreur lors du seed:", error);
        mongoose.connection.close();
    }
}

seedDatabase();
