const HistoriqueFacturation = require('../models/historiqueFacturation.model'); 
const HistoriqueFacturationDAO = {
    async createHistoriqueFacturation(historiqueFacturationData) {
        if (!historiqueFacturationData || typeof historiqueFacturationData !== 'object') {
            return null;
        }
        
        const newHistoriqueFacturation = new HistoriqueFacturation(historiqueFacturationData);
        return await newHistoriqueFacturation.save().catch(() => null);
    },
    
    async getHistoriqueFacturationById(historiqueFacturationId) {
        if (!historiqueFacturationId) {
            return null;
        }
        
        return await HistoriqueFacturation.findById(historiqueFacturationId).catch(() => null);
    },
    
    async getHistoriqueFacturationByClientOffreId(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await HistoriqueFacturation.findOne({ clientOffreId }).catch(() => null);
    },
    
    async updateHistoriqueFacturation(historiqueFacturationId, updateData) {
        if (!historiqueFacturationId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await HistoriqueFacturation.findByIdAndUpdate(historiqueFacturationId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteHistoriqueFacturation(historiqueFacturationId) {
        if (!historiqueFacturationId) {
            return null;
        }
        
        return await HistoriqueFacturation.findByIdAndDelete(historiqueFacturationId).catch(() => null);
    },
    
    async getAllHistoriqueFacturations() {
        return await HistoriqueFacturation.find().catch(() => []);
    }
    };
model.exports = HistoriqueFacturationDAO;