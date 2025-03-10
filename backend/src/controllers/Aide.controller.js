const AideService = require('../services/Aide.service');

const AideController = {

    async getAide(req, res) {
        try {
            const aideInfo = await AideService.getAideInfo();
            res.status(200).json({
                success: true,
                data: aideInfo
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    async updateAide(req, res) {
        try {
            const AideUpdateData = req.body;
            const updatedAide = await AideService.updateAideInfo(AideUpdateData);
            res.status(200).json({
                success: true,
                message: "Informations d'aide mises à jour avec succès",
                data: updatedAide
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = AideController;