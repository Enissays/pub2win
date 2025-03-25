const Groupe = require('../models/groupe.model');
const GroupeDAO = require('../dao/groupe.dao');
const GroupeUserDAO = require('../dao/groupeUser.dao');
const User = require('../models/user.model'); // Assuming you have a User model

// Create a new groupe
const createGroupe = async (req, res) => {
    const { name, description, creator_id, clientOffreId } = req.body;

    if (!name || !creator_id) {
        return res.status(400).json({ message: "Nom et créateur sont requis." });
    }

    try {
        // Vérifier si l'utilisateur existe
        const creator = await User.findById(creator_id);
        if (!creator) {
            return res.status(404).json({ message: "Créateur non trouvé" });
        }

        // Créer le groupe
        const groupeData = {
            name,
            description: description || '',
            creator_id,
            clientOffreId: clientOffreId || null
        };

        const newGroupe = await GroupeDAO.createGroupe(groupeData);

        if (!newGroupe) {
            return res.status(500).json({ message: "Erreur lors de la création du groupe" });
        }

        // Ajouter le créateur comme membre du groupe
        await GroupeUserDAO.createGroupeUser({
            groupe_id: newGroupe._id,
            user_id: creator_id,
            role: 'admin' // Le créateur est automatiquement administrateur
        });

        res.status(201).json(newGroupe);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du groupe", error: error.message });
    }
};

// Supprimer un groupe
const deleteGroupe = async (req, res) => {
    const { groupeId } = req.params;
    const { user_id } = req.body; // ID de l'utilisateur qui tente de supprimer le groupe

    if (!groupeId || !user_id) {
        return res.status(400).json({ message: "ID du groupe et ID de l'utilisateur sont requis." });
    }

    try {
        // Vérifier si le groupe existe
        const groupe = await GroupeDAO.getGroupeById(groupeId);
        if (!groupe) {
            return res.status(404).json({ message: "Groupe non trouvé" });
        }

        // Vérifier si l'utilisateur est le créateur du groupe
        if (groupe.creator_id.toString() !== user_id) {
            return res.status(403).json({ message: "Vous n'avez pas l'autorisation de supprimer ce groupe" });
        }

        // Supprimer tous les membres du groupe
        await GroupeUserDAO.deleteMany({ groupe_id: groupeId });

        // Supprimer tous les messages du groupe
        await Message.deleteMany({ group_id: groupeId });

        // Supprimer le groupe
        const deletedGroupe = await GroupeDAO.deleteGroupe(groupeId);

        if (!deletedGroupe) {
            return res.status(500).json({ message: "Erreur lors de la suppression du groupe" });
        }

        res.status(200).json({ message: "Groupe supprimé avec succès", deletedGroupe });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du groupe", error: error.message });
    }
};

// Ajouter un utilisateur à un groupe
const addUserToGroupe = async (req, res) => {
    const { groupeId } = req.params;
    const { user_id, added_by_id, role = 'member' } = req.body;

    if (!groupeId || !user_id || !added_by_id) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
        // Vérifier si le groupe existe
        const groupe = await GroupeDAO.getGroupeById(groupeId);
        if (!groupe) {
            return res.status(404).json({ message: "Groupe non trouvé" });
        }

        // Vérifier si l'utilisateur à ajouter existe
        const userToAdd = await User.findById(user_id);
        if (!userToAdd) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier si l'utilisateur qui ajoute a les droits (admin ou créateur)
        const addedByUser = await GroupeUserDAO.findOne({ 
            groupe_id: groupeId, 
            user_id: added_by_id, 
            $or: [{ role: 'admin' }, { user_id: groupe.creator_id }] 
        });

        if (!addedByUser) {
            return res.status(403).json({ message: "Vous n'avez pas l'autorisation d'ajouter des utilisateurs à ce groupe" });
        }

        // Vérifier si l'utilisateur est déjà dans le groupe
        const existingMembership = await GroupeUserDAO.findOne({ 
            groupe_id: groupeId, 
            user_id: user_id 
        });

        if (existingMembership) {
            return res.status(400).json({ message: "L'utilisateur est déjà membre du groupe" });
        }

        // Ajouter l'utilisateur au groupe
        const newGroupeUser = await GroupeUserDAO.createGroupeUser({
            groupe_id: groupeId,
            user_id: user_id,
            role: role
        });

        res.status(201).json(newGroupeUser);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de l'utilisateur au groupe", error: error.message });
    }
};

// Supprimer un utilisateur d'un groupe
const removeUserFromGroupe = async (req, res) => {
    const { groupeId } = req.params;
    const { user_id, removed_by_id } = req.body;

    if (!groupeId || !user_id || !removed_by_id) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
        // Vérifier si le groupe existe
        const groupe = await GroupeDAO.getGroupeById(groupeId);
        if (!groupe) {
            return res.status(404).json({ message: "Groupe non trouvé" });
        }

        // Vérifier les permissions de suppression
        const removedByUser = await GroupeUserDAO.findOne({ 
            groupe_id: groupeId, 
            user_id: removed_by_id, 
            $or: [
                { role: 'admin' }, 
                { user_id: groupe.creator_id },
                // Si l'utilisateur à supprimer est lui-même
                { user_id: user_id }
            ]
        });

        if (!removedByUser) {
            return res.status(403).json({ message: "Vous n'avez pas l'autorisation de supprimer cet utilisateur du groupe" });
        }

        // Supprimer l'utilisateur du groupe
        const deletedGroupeUser = await GroupeUserDAO.deleteOne({ 
            groupe_id: groupeId, 
            user_id: user_id 
        });

        if (deletedGroupeUser.deletedCount === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé dans le groupe" });
        }

        res.status(200).json({ message: "Utilisateur supprimé du groupe avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur du groupe", error: error.message });
    }
};

module.exports = {
    createGroupe,
    deleteGroupe,
    addUserToGroupe,
    removeUserFromGroupe
};