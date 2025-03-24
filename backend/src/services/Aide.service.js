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