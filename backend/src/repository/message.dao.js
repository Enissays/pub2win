// repository/message.dao.js
const Message = require('../models/message.model');

class MessageDAO {
  // Créer un message dans la base de données
  static async createMessage(data) {
    try {
      const message = await Message.create(data);
      return message;
    } catch (error) {
      console.error('Erreur lors de la création du message:', error);
      throw error;
    }
  }

  // Récupérer les messages privés entre deux utilisateurs
  static async getPrivateMessages(sender_id, receiver_id) {
    try {
      const messages = await Message.find({
        $or: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id }
        ]
      }).sort('timestamp');
      return messages;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages privés:', error);
      throw error;
    }
  }

  // Récupérer les messages d'un groupe
  static async getMessagesByGroup(groupe_id) {
    try {
      const messages = await Message.find({ groupe_id }).populate('sender_id', 'name');
      return messages;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages du groupe:', error);
      throw error;
    }
  }
}

module.exports = MessageDAO;
