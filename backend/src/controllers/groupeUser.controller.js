const GroupeUserDAO = require('../dao/groupeUser.dao');
const GroupeDAO = require('../dao/groupe.dao');
const User = require('../models/user.model');

// Récupérer tous les utilisateurs d'un groupe
const getUsersInGroupe = async (req, res) => {
    const { groupeId } = req.params;

    if (!groupeId) {
        return res.status(400).json({ message: "ID du groupe requis" });
    }

    try {
        // Vérifier si le groupe existe
        const groupe = await GroupeDAO.getGroupeById(groupeId);
        if (!groupe) {
            return res.status(404).json({ message: "Groupe non trouvé" });
        }

        // Récupérer tous les membres du groupe avec leurs détails
        const groupeUsers = await GroupeUserDAO.find({ groupe_id: groupeId })
            .populate('user_id', 'username email profile_picture'); // Ajustez selon vos champs utilisateur

        res.status(200).json(groupeUsers);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs du groupe", error: error.message });
    }
};

// Mettre à jour le rôle d'un utilisateur dans un groupe
const updateUserRoleInGroupe = async (req, res) => {
    const { groupeId, userId } = req.params;
    const { new_role, updated_by_id } = req.body;

    if (!groupeId || !userId || !new_role || !updated_by_id) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        // Vérifier si le groupe existe
        const groupe = await GroupeDAO.getGroupeById(groupeId);
        if (!groupe) {
            return res.status(404).json({ message: "Groupe non trouvé" });
        }

        // Vérifier les permissions de mise à jour
        const updaterMembership = await GroupeUserDAO.findOne({ 
            groupe_id: groupeId, 
            user_id: updated_by_id, 
            $or: [
                { role: 'admin' }, 
                { user_id: groupe.creator_id }
            ]
        });

        if (!updaterMembership) {
            return res.status(403).json({ message: "Vous n'avez pas l'autorisation de modifier les rôles dans ce groupe" });
        }

        // Vérifier si l'utilisateur est membre du groupe
        const userMembership = await GroupeUserDAO.findOne({ 
            groupe_id: groupeId, 
            user_id: userId 
        });

        if (!userMembership) {
            return res.status(404).json({ message: "Utilisateur non trouvé dans le groupe" });
        }

        // Mettre à jour le rôle
        const updatedMembership = await GroupeUserDAO.updateOne(
            { groupe_id: groupeId, user_id: userId },
            { role: new_role }
        );

        res.status(200).json({ 
            message: "Rôle mis à jour avec succès", 
            updatedMembership 
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du rôle", error: error.message });
    }
};

// Récupérer les groupes d'un utilisateur
const getUserGroupes = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "ID utilisateur requis" });
    }

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Récupérer les appartenances aux groupes de l'utilisateur
        const userGroupes = await GroupeUserDAO.find({ user_id: userId })
            .populate({
                path: 'groupe_id',
                select: 'name description creator_id' // Ajustez selon vos champs de groupe
            });

        res.status(200).json(userGroupes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des groupes de l'utilisateur", error: error.message });
    }
};

module.exports = {
    getUsersInGroupe,
    updateUserRoleInGroupe,
    getUserGroupes
};