const Endroit = require('../models/endroit.model');
const EndroitDAO = {
    async createEndroit(endroitData) {
        if (!endroitData || typeof endroitData !== 'object') {
            return null;
        }
        
        const newEndroit = new Endroit(endroitData);
        return await newEndroit.save().catch(() => null);
    },
    
    async getEndroitById(endroitId) {
        if (!endroitId) {
            return null;
        }
        
        return await Endroit.findById(endroitId).catch(() => null);
    },
    
    async getEndroitByClientOffreId(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await Endroit.findOne({ clientOffreId }).catch(() => null);
    },
    
    async updateEndroit(endroitId, updateData) {
        if (!endroitId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await Endroit.findByIdAndUpdate(endroitId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteEndroit(endroitId) {
        if (!endroitId) {
            return null;
        }
        
        return await Endroit.findByIdAndDelete(endroitId).catch(() => null);
    },
    
    async getAllEndroits() {
        return await Endroit.find().catch(() => []);
    }
    };
module.exports = EndroitDAO;