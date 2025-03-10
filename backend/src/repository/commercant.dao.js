const Commercant = require('../models/commercant.model');
const CommercantDAO = {
    async createCommercant(commercantData) {
        if (!commercantData || typeof commercantData !== 'object') {
            return null;
        }
        
        const newCommercant = new Commercant(commercantData);
        return await newCommercant.save().catch(() => null);
    },
    
    async getCommercantById(commercantId) {
        if (!commercantId) {
            return null;
        }
        
        return await Commercant.findById(commercantId).catch(() => null);
    },
    
    async getCommercantByEmail(email) {
        if (!email) {
            return null;
        }
        
        return await Commercant.findOne({ email }).catch(() => null);
    },
    
    async getCommercantByUsername(username) {
        if (!username) {
            return null;
        }
        
        return await Commercant.findOne({ username }).catch(() => null);
    },
    
    async updateCommercant(commercantId, updateData) {
        if (!commercantId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await Commercant.findByIdAndUpdate(commercantId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteCommercant(commercantId) {
        if (!commercantId) {
            return null;
        }
        
        return await Commercant.findByIdAndDelete(commercantId).catch(() => null);
    },
    
    async getAllCommercants() {
        return await Commercant.find().catch(() => []);
    }
    };
module.exports = CommercantDAO;