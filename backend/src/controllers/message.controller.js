const Message = require('../models/message.model');
const Groupe = require('../models/groupe.model');
const GroupeUserDAO = require('../dao/groupeUser.dao');
const GroupeDAO = require('../dao/groupe.dao');

let io; // Variable globale pour stocker l'instance de socket.io

// Fonction pour initialiser l'instance de socket.io
const initSocket = (socketIoInstance) => {
    io = socketIoInstance;
};

// Créer un message privé entre deux utilisateurs
const createMessage = async (req, res) => {
    const { sender_id, receiver_id, content } = req.body;
    
    if (!sender_id || !receiver_id || !content) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
        const message = new Message({ sender_id, receiver_id, content });
        await message.save();
        
        // Émettre un événement Socket.io en direct
        if (io) {
            io.to(receiver_id).emit('new_message', message); 
        }
        
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'envoi du message", error });
    }
};

// Récupérer les messages privés entre deux utilisateurs
const getPrivateMessages = async (req, res) => {
    const { sender_id, receiver_id } = req.params;
    
    try {
        const messages = await Message.find({
            $or: [
                { sender_id, receiver_id },
                { sender_id: receiver_id, receiver_id: sender_id }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des messages", error });
    }
};

// Envoyer un message à un groupe
const sendMessageToGroupe = async (req, res) => {
    const { groupeId, sender_id, content } = req.body;

    if (!groupeId || !sender_id || !content) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
        // Vérifier si le groupe existe
        const groupe = await GroupeDAO.getGroupeById(groupeId);
        if (!groupe) {
            return res.status(404).json({ message: "Groupe non trouvé" });
        }

        // Créer le message
        const message = new Message({
            sender_id,
            content,
            group_id: groupeId
        });

        await message.save();

        // Émettre un événement Socket.io au groupe
        if (io) {
            io.to(groupeId).emit('new_group_message', message);
        }

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'envoi du message au groupe", error });
    }
};

module.exports = {
    initSocket,
    createMessage,
    getPrivateMessages,
    sendMessageToGroupe
};
