require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createMessage, getPrivateMessages } = require('./repository/message.dao'); 
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');
const io = require('socket.io-client');

let mongoServer;
let server;
let socketClient;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = process.env.MONGODB_URI || mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connecté à MongoDB en mémoire");

    const app = require('express')();
    const httpServer = require('http').Server(app);
    server = httpServer.listen(5000, () => {
        console.log('Server running on port 5000');
    });

    const socketIo = require('socket.io')(httpServer);
    socketIo.on('connection', (socket) => {
        console.log('Client connecté via WebSocket');
        socket.on('send_message', async (data) => {
            console.log('Message reçu via Socket:', data);
            // Sauvegarder le message dans la DB avant d'émettre une réponse
            const message = await createMessage(data);
            socket.emit('new_message', message);  // Réémettre le message à tous les clients
        });
    });

    socketClient = io('http://localhost:5000');
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    server.close();
    console.log("✅ Déconnexion de la base de données et du serveur");
});

test("Envoyer et recevoir un message en temps réel via Socket.io", async () => {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = (password) => bcrypt.hashSync(password, salt);

    const user1 = new User({
        nom: "Aymane",
        prenom: "Aymane",
        email: "aymane11341@example.com",
        username: "aymane1431",
        password_hash: passwordHash("test123"),
        role: "ADMIN",
        date_inscription: new Date(),
    });

    const user2 = new User({
        nom: "Ali",
        prenom: "Ali",
        email: "ali11341@example.com",
        username: "ali43    11",
        password_hash: passwordHash("test123"),
        role: "CLIENT",
        date_inscription: new Date(),
    });

    await user1.save();
    await user2.save();

    const messageData = {
        sender_id: user1._id,
        receiver_id: user2._id,
        content: "Bonjour Ali, comment ça va ?",
        timestamp: new Date(),
    };

    socketClient.emit('send_message', messageData);

    await new Promise(resolve => setTimeout(resolve, 500));  

    const messagesForUser2 = await getPrivateMessages(user1._id, user2._id);

    expect(messagesForUser2.length).toBeGreaterThan(0);
    expect(messagesForUser2[0].content).toBe("Bonjour Ali, comment ça va ?");
    expect(messagesForUser2[0].sender_id.toString()).toBe(user1._id.toString());
    expect(messagesForUser2[0].receiver_id.toString()).toBe(user2._id.toString());
});
