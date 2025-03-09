const GroupeUSer = require('../models/groupeUser.model');
const GroupeUserDAO = {
    async createGroupeUser(groupeUserData) {
        if (!groupeUserData || typeof groupeUserData !== 'object') {
            return null;
        }
        
        const newGroupeUser = new GroupeUSer(groupeUserData);
        return await newGroupeUser.save().catch(() => null);
    },
    
    async getGroupeUserById(groupeUserId) {
        if (!groupeUserId) {
            return null;
        }
        
        return await GroupeUSer.findById(groupeUserId).catch(() => null);
    },
    
    async getGroupeUserByClientOffreId(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await GroupeUSer.findOne({ clientOffreId }).catch(() => null);
    },
    
    async updateGroupeUser(groupeUserId, updateData) {
        if (!groupeUserId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await GroupeUSer.findByIdAndUpdate(groupeUserId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteGroupeUser(groupeUserId) {
        if (!groupeUserId) {
            return null;
        }
        
        return await GroupeUSer.findByIdAndDelete(groupeUserId).catch(() => null);
    },
    
    async getAllGroupeUsers() {
        return await GroupeUSer.find().catch(() => []);
    }
    };
module.exports = GroupeUserDAO;