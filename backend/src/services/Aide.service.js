const AideDAO = require('..//repository/aide.dao');

const AideService = {

    async getAideInfo() {
        try {
            return await AideDAO.getAide();
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des informations d'aide: ${error.message}`);
        }
    },


    async updateAideInfo(aideData) {
        try {
            // Vérification des données requises
            if (!aideData) {
                throw new Error("Aucune donnée fournie pour la mise à jour");
            }

            // Validation des données
            if (aideData.email && !/^\S+@\S+\.\S+$/.test(aideData.email)) {
                throw new Error("Format d'email invalide");
            }

            if (aideData.telephone && !/^[+]?[\d\s()-]{8,}$/.test(aideData.telephone)) {
                throw new Error("Format de numéro de téléphone invalide");
            }

            // Validation des URLs de réseaux sociaux
            const urlFields = ['facebook_url', 'instagram_url', 'twitter_url',];
            for (const field of urlFields) {
                if (aideData[field] && aideData[field] !== '' && !this.isValidUrl(aideData[field])) {
                    throw new Error(`URL ${field} invalide`);
                }
            }

            return await AideDAO.updateAide(aideData);
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour des informations d'aide: ${error.message}`);
        }
    },

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }
};

module.exports = AideService;