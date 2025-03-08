const AbonnementCommercant = require('../models/abonnementCommercant.model');
const AbonnementCommercantDAO = {
    async createAbonnementCommercant(abonnementCommercantData) {
        if (!abonnementCommercantData || typeof abonnementCommercantData !== 'object') {
        return null;
        }
        
        const newAbonnementCommercant = new AbonnementCommercant(abonnementCommercantData);
        return await newAbonnementCommercant.save().catch(() => null);
    },
    
    async getAbonnementCommercantById(abonnementCommercantId) {
        if (!abonnementCommercantId) {
        return null;
        }
        
        return await AbonnementCommercant.findById(abonnementCommercantId).catch(() => null);
    },
    
    async getAbonnementCommercantByEmail(email) {
        if (!email) {
        return null;
        }
        
        return await AbonnementCommercant.findOne({ email }).catch(() => null);
    },
    
    async getAbonnementCommercantByUsername(username) {
        if (!username) {
        return null;
        }
        
        return await AbonnementCommercant.findOne({ username }).catch(() => null);
    },
    
    async updateAbonnementCommercant(abonnementCommercantId, updateData) {
        if (!abonnementCommercantId || !updateData || typeof updateData !== 'object') {
        return null;
        }
        
        return await AbonnementCommercant.findByIdAndUpdate(abonnementCommercantId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteAbonnementCommercant(abonnementCommercantId) {
        if (!abonnementCommercantId) {
        return null;
        }
        
        return await AbonnementCommercant.findByIdAndDelete(abonnementCommercantId).catch(() => null);
    },
    
    async getAllAbonnementCommercants() {
        return await AbonnementCommercant.find().catch(() => []);
    }
    };

module.exports = AbonnementCommercantDAO;