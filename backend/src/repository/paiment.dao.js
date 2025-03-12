const Paiment = require('../models/paiment.model');
const PaimentDAO = {
    async createPaiment(paimentData) {
        if (!paimentData || typeof paimentData !== 'object') {
            return null;
        }
        
        const newPaiment = new Paiment(paimentData);
        return await newPaiment.save().catch(() => null);
    },
    
    async getPaimentById(paimentId) {
        if (!paimentId) {
            return null;
        }
        
        return await Paiment.findById(paimentId).catch(() => null);
    },

    async getPaimentByClientId(clientId) {
        if (!clientId) {
            return null;
        }
        
        return await Paiment.findOne({ clientId }).catch(() => null);
    }
};
module.exports = PaimentDAO;