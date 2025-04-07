const NotificationSignalementDao = require('../repository/notificationSignalement.dao');


class NotificationSignalementService {
    
  async createNotification(userId, dataContent) {
    try {
      // Validation des données
      if (!userId || !dataContent) {
        throw new Error('Données insuffisantes pour créer une notification');
      }

      // Appel du DAO pour créer la notification et mettre à jour l'utilisateur
      const notification = await NotificationSignalementDao.IsbannedUser(userId, dataContent);
      
      return {
        success: true,
        data: notification
      };
    } catch (error) {
      console.error('Erreur dans createNotification:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

module.exports = new NotificationSignalementService();