const GroupeUser = require('../models/groupeUser.model');

const GroupeUserDAO = {
    async createGroupeUser(groupeUserData) {
        try {
            if (!groupeUserData || typeof groupeUserData !== 'object') return null;
            const newGroupeUser = new GroupeUser(groupeUserData);
            return await newGroupeUser.save();
        } catch (error) {
            console.error('Erreur lors de la création du GroupeUser:', error);
            return null;
        }
    },

    async getGroupeUserById(groupeUserId) {
        try {
            if (!groupeUserId) return null;
            return await GroupeUser.findById(groupeUserId);
        } catch (error) {
            console.error('Erreur lors de la récupération du GroupeUser par ID:', error);
            return null;
        }
    },

    async updateGroupeUser(groupeUserId, updateData) {
        try {
            if (!groupeUserId || !updateData || typeof updateData !== 'object') return null;
            return await GroupeUser.findByIdAndUpdate(groupeUserId, updateData, { new: true });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du GroupeUser:', error);
            return null;
        }
    },

    async deleteGroupeUser(groupeUserId) {
        try {
            if (!groupeUserId) return null;
            return await GroupeUser.findByIdAndDelete(groupeUserId);
        } catch (error) {
            console.error('Erreur lors de la suppression du GroupeUser:', error);
            return null;
        }
    },

    async getAllGroupeUsers() {
        try {
            return await GroupeUser.find();
        } catch (error) {
            console.error('Erreur lors de la récupération de tous les GroupeUsers:', error);
            return [];
        }
    }
};

module.exports = GroupeUserDAO;
