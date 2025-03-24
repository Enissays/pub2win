const Message = require('../models/message.model');
const Groupe = require('../models/groupe.model');
const GroupeUserDAO = require('../dao/groupeUser.dao');
const GroupeDAO = require('../dao/groupe.dao');
const { sendMessageToGroup } = require('../utils/socketUtils'); // Utilitaire pour gérer l'envoi de message en temps réel via Socket.io

// Créer un message privé entre deux utilisateurs
const createMessage = async (req, res) => {
    const { sender_id, receiver_id, content } = req.body;
    
    if (!sender_id || !receiver_id || !content) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
        const message = new Message({ sender_id, receiver_id, content });
        await message.save();
        
        // Émettre un événement Socket.io pour le message en temps réel
        sendMessageToGroup(receiver_id, message); // Vous pouvez aussi adapter pour envoyer à un groupe
        
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

// Créer un groupe
const createGroupe = async (req, res) => {
    const { name, clientOffreId } = req.body;
    
    if (!name || !clientOffreId) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
        const groupeData = { name, clientOffreId };
        const groupe = await GroupeDAO.createGroupe(groupeData);
        res.status(201).json(groupe);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du groupe", error });
    }
};

// Supprimer un groupe
const deleteGroupe = async (req, res) => {
    const { groupeId } = req.params;

    try {
        const groupe = await GroupeDAO.deleteGroupe(groupeId);
        if (!groupe) {
            return res.status(404).json({ message: "Groupe non trouvé" });
        }
        res.status(200).json({ message: "Groupe supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du groupe", error });
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
            group_id: groupeId // Ajouter le groupe comme référence
        });

        await message.save();

        // Émettre un événement Socket.io pour le message du groupe
        sendMessageToGroup(groupeId, message);

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'envoi du message au groupe", error });
    }
};

module.exports = {
    createMessage,
    getPrivateMessages,
    createGroupe,
    deleteGroupe,
    sendMessageToGroupe
};
