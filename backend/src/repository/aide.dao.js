const Aide = require('../models/aide.model');

const AideDAO = {

    async getAide() {
        try {
            // Récupère l'aide existante ou en crée une si aucune n'existe
            let aide = await Aide.findOne();
            
            if (!aide) {
                // Créer une entrée d'aide par défaut si aucune n'existe
                aide = await Aide.create({
                    email: 'contact@pub2win.com',
                    telephone: '+33123456789',
                    facebook_url: 'https://facebook.com/pub2win',
                    instagram_url: 'https://instagram.com/pub2win',
                    twitter_url: 'https://twitter.com/pub2win',
                    linkedin_url: 'https://linkedin.com/company/pub2win'
                });
            }
            
            return aide;
        } catch (error) {
            throw error;
        }
    },


    async updateAide(aideData) {
        try {
            // Récupère l'aide existante ou en crée une si aucune n'existe
            let aide = await Aide.findOne();
            
            if (!aide) {
                aide = new Aide(aideData);
            } else {
                // Mettre à jour chaque champ fourni
                if (aideData.email) aide.email = aideData.email;
                if (aideData.telephone) aide.telephone = aideData.telephone;
                if (aideData.facebook_url !== undefined) aide.facebook_url = aideData.facebook_url;
                if (aideData.instagram_url !== undefined) aide.instagram_url = aideData.instagram_url;
                if (aideData.twitter_url !== undefined) aide.twitter_url = aideData.twitter_url;
                if (aideData.linkedin_url !== undefined) aide.linkedin_url = aideData.linkedin_url;
            }
            
            // Mise à jour de la date
            aide.date_mise_a_jour = Date.now();
            
            // Sauvegarde et retourne l'aide mise à jour
            await aide.save();
            return aide;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = AideDAO;