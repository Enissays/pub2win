const ConversationUser = require('../models/conversationUser.model');
const ConversationUserDAO = {
    async createConversationUser(conversationUserData) {
        if (!conversationUserData || typeof conversationUserData !== 'object') {
            return null;
        }
        
        const newConversationUser = new ConversationUser(conversationUserData);
        return await newConversationUser.save().catch(() => null);
    },
    
    async getConversationUserById(conversationUserId) {
        if (!conversationUserId) {
            return null;
        }
        
        return await ConversationUser.findById(conversationUserId).catch(() => null);
    },
    
    async getConversationUserByClientOffreId(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await ConversationUser.findOne({ clientOffreId }).catch(() => null);
    },
    
    async updateConversationUser(conversationUserId, updateData) {
        if (!conversationUserId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await ConversationUser.findByIdAndUpdate(conversationUserId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteConversationUser(conversationUserId) {
        if (!conversationUserId) {
            return null;
        }
        
        return await ConversationUser.findByIdAndDelete(conversationUserId).catch(() => null);
    },
    
    async getAllConversationUsers() {
        return await ConversationUser.find().catch(() => []);
    }
    };
module.exports = ConversationUserDAO;