require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const GroupeUserDAO = require('../repository/groupeUser.dao');

// Augmenter le délai d'attente pour Jest (10 secondes ici)
jest.setTimeout(10000);

let mongoServer;

beforeAll(async () => {
    console.log("Démarrage de MongoMemoryServer...");
    mongoServer = await MongoMemoryServer.create();
    const uri = process.env.MONGODB_URI || mongoServer.getUri(); 
    console.log(`URI MongoDB : ${uri}`);
    await mongoose.connect(uri);
    console.log("MongoDB connecté.");
});

afterAll(async () => {
    console.log("Déconnexion de MongoDB...");
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log("MongoDB déconnecté.");
});

test("Créer un GroupeUser", async () => {
    const groupeUser = await GroupeUserDAO.createGroupeUser({
        groupe_id: new mongoose.Types.ObjectId(),
        user_id: new mongoose.Types.ObjectId(),
        role: "ADMIN"
    });

    expect(groupeUser).toHaveProperty("_id");
    expect(groupeUser.role).toBe("ADMIN");
});
