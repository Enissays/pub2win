const ClientOffre = require('../models/clientOffre.model');
const ClientOffreDAO = {
    async createClientOffre(clientOffreData) {
        if (!clientOffreData || typeof clientOffreData !== 'object') {
            return null;
        }
        
        const newClientOffre = new ClientOffre(clientOffreData);
        return await newClientOffre.save().catch(() => null);
    },
    
    async getClientOffreById(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await ClientOffre.findById(clientOffreId).catch(() => null);
    },
    
    async getClientOffreByEmail(email) {
        if (!email) {
            return null;
        }
        
        return await ClientOffre.findOne({ email }).catch(() => null);
    },
    
    async getClientOffreByUsername(username) {
        if (!username) {
            return null;
        }
        
        return await ClientOffre.findOne({ username }).catch(() => null);
    },
    
    async updateClientOffre(clientOffreId, updateData) {
        if (!clientOffreId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await ClientOffre.findByIdAndUpdate(clientOffreId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteClientOffre(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await ClientOffre.findByIdAndDelete(clientOffreId).catch(() => null);
    },
    
    async getAllClientOffres() {
        return await ClientOffre.find().catch(() => []);
    }
    };

module.exports = ClientOffreDAO;