const Offre = require('../models/offre.model');
const OffreDAO = {
    async createOffre(offreData) {
        if (!offreData || typeof offreData !== 'object') {
            return null;
        }
        
        const newOffre = new Offre(offreData);
        return await newOffre.save().catch(() => null);
    },
    
    async getOffreById(offreId) {
        if (!offreId) {
            return null;
        }
        
        return await Offre.findById(offreId).catch(() => null);
    },

    async getOffreByClientId(clientId) {
        if (!clientId) {
            return null;
        }
        
        return await Offre.findOne({ clientId }).catch(() => null);
    }
};
module.exports = OffreDAO;