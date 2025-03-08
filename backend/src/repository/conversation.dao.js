const Conversation = require('../models/conversation.model');
const ConversationDAO = {
    async createConversation(conversationData) {
        if (!conversationData || typeof conversationData !== 'object') {
            return null;
        }
        
        const newConversation = new Conversation(conversationData);
        return await newConversation.save().catch(() => null);
    },
    
    async getConversationById(conversationId) {
        if (!conversationId) {
            return null;
        }
        
        return await Conversation.findById(conversationId).catch(() => null);
    },
    
    async getConversationByClientOffreId(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await Conversation.findOne({ clientOffreId }).catch(() => null);
    },
    
    async updateConversation(conversationId, updateData) {
        if (!conversationId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await Conversation.findByIdAndUpdate(conversationId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteConversation(conversationId) {
        if (!conversationId) {
            return null;
        }
        
        return await Conversation.findByIdAndDelete(conversationId).catch(() => null);
    },
    
    async getAllConversations() {
        return await Conversation.find().catch(() => []);
    }
    };

module.exports = ConversationDAO;