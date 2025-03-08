const FormuleAbonnement = require('../models/formuleAbonnement.model');
const FormuleAbonnementDAO = {
    async createFormuleAbonnement(formuleAbonnementData) {
        if (!formuleAbonnementData || typeof formuleAbonnementData !== 'object') {
            return null;
        }
        
        const newFormuleAbonnement = new FormuleAbonnement(formuleAbonnementData);
        return await newFormuleAbonnement.save().catch(() => null);
    },
    
    async getFormuleAbonnementById(formuleAbonnementId) {
        if (!formuleAbonnementId) {
            return null;
        }
        
        return await FormuleAbonnement.findById(formuleAbonnementId).catch(() => null);
    },
    
    async getFormuleAbonnementByClientOffreId(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await FormuleAbonnement.findOne({ clientOffreId }).catch(() => null);
    },
    
    async updateFormuleAbonnement(formuleAbonnementId, updateData) {
        if (!formuleAbonnementId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await FormuleAbonnement.findByIdAndUpdate(formuleAbonnementId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteFormuleAbonnement(formuleAbonnementId) {
        if (!formuleAbonnementId) {
            return null;
        }
        
        return await FormuleAbonnement.findByIdAndDelete(formuleAbonnementId).catch(() => null);
    },
    
    async getAllFormuleAbonnements() {
        return await FormuleAbonnement.find().catch(() => []);
    }
    };
module.exports = FormuleAbonnementDAO;