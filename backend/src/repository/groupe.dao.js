const Groupe = require('../models/groupe.model');
const GroupeDAO = {
    async createGroupe(groupeData) {
        if (!groupeData || typeof groupeData !== 'object') {
            return null;
        }
        
        const newGroupe = new Groupe(groupeData);
        return await newGroupe.save().catch(() => null);
    },
    
    async getGroupeById(groupeId) {
        if (!groupeId) {
            return null;
        }
        
        return await Groupe.findById(groupeId).catch(() => null);
    },
    
    async getGroupeByClientOffreId(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await Groupe.findOne({ clientOffreId }).catch(() => null);
    },
    
    async updateGroupe(groupeId, updateData) {
        if (!groupeId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await Groupe.findByIdAndUpdate(groupeId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteGroupe(groupeId) {
        if (!groupeId) {
            return null;
        }
        
        return await Groupe.findByIdAndDelete(groupeId).catch(() => null);
    },
    
    async getAllGroupes() {
        return await Groupe.find().catch(() => []);
    }
    };
module.exports = GroupeDAO;