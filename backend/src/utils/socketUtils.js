const { Server } = require("socket.io");

let io;
const userSockets = new Map(); 

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`Nouvelle connexion : ${socket.id}`);

        // Associer un utilisateur à son socketId
        socket.on("user_connected", (userId) => {
            userSockets.set(userId, socket.id);
            console.log(`Utilisateur ${userId} connecté avec le socket ${socket.id}`);
        });

        // Gérer la déconnexion
        socket.on("disconnect", () => {
            userSockets.forEach((value, key) => {
                if (value === socket.id) {
                    userSockets.delete(key);
                    console.log(`Utilisateur ${key} déconnecté.`);
                }
            });
        });
    });
};

// Envoyer un message privé en temps réel
const sendMessageToUser = (receiverId, message) => {
    const socketId = userSockets.get(receiverId);
    if (socketId) {
        io.to(socketId).emit("private_message", message);
    }
};

// Envoyer un message à un groupe en temps réel
const sendMessageToGroup = (groupeId, message) => {
    io.to(groupeId).emit("group_message", message);
};

module.exports = { initializeSocket, sendMessageToUser, sendMessageToGroup };
