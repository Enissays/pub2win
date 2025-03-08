const Message = require('../models/message.model');
const MessageDAO = {
    async createMessage(messageData) {
        if (!messageData || typeof messageData !== 'object') {
            return null;
        }
        
        const newMessage = new Message(messageData);
        return await newMessage.save().catch(() => null);
    },
    
    async getMessageById(messageId) {
        if (!messageId) {
            return null;
        }
        
        return await Message.findById(messageId).catch(() => null);
    },

    async getMessageByClientId(clientId) {
        if (!clientId) {
            return null;
        }
        
        return await Message.findOne({ clientId }).catch(() => null);
    }
};
model.exports = MessageDAO;