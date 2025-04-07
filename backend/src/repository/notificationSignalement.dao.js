const notificationSignalement = require('../models/notificationSignalement.model');
const UserDAO=require('../models/user.model');
class notificationSignalementDao {


  async IsbannedUser(userId, dataContent) {
    const user = await UserDAO.findById(userId);

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const { content, type, temporaryBlockDays = 7 } = dataContent;

    let updateFields = {};

    switch(type) {
      case 'temporaryBlock':
        updateFields = { 
          isTimeouted: true,
          finBan: new Date(Date.now() + (temporaryBlockDays) * 24 * 60 * 60 * 1000)
        };
        break;

      case 'permanentBlock':
        updateFields = { 
          isBanned: true,
          isTimeouted: false,
          finBan: null
        };
        break;
    }

    // Mise à jour de l'utilisateur
    await UserDAO.findByIdAndUpdate(userId, updateFields);

    // Création de la notification
    const notification = new notificationSignalement({
      content: content,
      userId: userId,
      type: type
    });

    return await notification.save();
  }
}

module.exports = new notificationSignalementDao();