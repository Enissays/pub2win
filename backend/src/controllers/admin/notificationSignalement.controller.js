const NotificationSignalementService = require('../../services/notificationSignalement.service');

class NotificationSignalementController {
  async createNotification(req, res) {
    try {
      const {userId, dataContent} = req.body;

      console.log("body: ",req.body);
      console.log("userId: ",userId);
      console.log("dataContent: ",dataContent);
      const result = await NotificationSignalementService.createNotification(userId, dataContent);

      if (result.success) {
        return res.status(201).json({
          message: 'Notification créée avec succès',
          data: result.data
        });
      } else {
        return res.status(400).json({
          message: result.message
        });
      }
    } catch (error) {
      console.error('Erreur dans createNotification:', error);
      res.status(500).json({
        message: 'Erreur serveur lors de la création de la notification'
      });
    }
  }
}

module.exports = new NotificationSignalementController();