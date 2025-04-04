const UserService = require('../../services/user.service');

const UserController = {

  async getAvailableYears(req, res) {
    try {
      const years = await UserService.getAvailableYears();
      
      return res.status(200).json({
        success: true,
        data: years
      });
    } catch (error) {
      console.error('Erreur contrôleur lors de la récupération des années disponibles:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des années disponibles',
        error: error.message
      });
    }
  },

  async getTotalUserCountByMonth(req, res) {
    try {
      const { year } = req.params;
      
      if (!year) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir une année valide'
        });
      }

      const userCounts = await UserService.getTotalUserCountByMonth(year);
      
      return res.status(200).json({
        success: true,
        data: userCounts,
        year: parseInt(year)
      });
    } catch (error) {
      console.error(`Erreur contrôleur lors du comptage des utilisateurs pour l'année ${req.params.year}:`, error);
      
      return res.status(500).json({
        success: false,
        message: `Erreur lors du comptage des utilisateurs pour l'année ${req.params.year}`,
        error: error.message
      });
    }
  },

  async getCountUsers(req, res) {
    try {
      const count = await UserService.getCountUsers();
      return res.status(200).json({
        success: true,
        count,
        message: 'Nombre total d\'utilisateurs'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Erreur lors de la récupération du nombre d'utilisateurs: ${error.message}`
      });
    }
  },

  async getAllUsers(req, res) {
    try {
      const allusers = await UserService.getAllUsers();
      return res.status(200).json({
        success: true,
        allusers,
        message: 'tout les users'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Erreur lors de la récupération de tout les users: ${error.message}`
      });
    }
  },
  async getByuserName(req, res) {
    try {
      const { usernane } = req.body;
      const user = await UserService.getByuserName(usernane);

      return res.status(200).json({
        success: true,
        user,
        message: 'user trouvé'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Erreur lors de la récupération de user: ${error.message}`
      });
    }
  },
  //
  async deleteByUsername(req, res) {
    try {
      const { username } = req.params;
      const delteuser = await UserService.deleteByUsername(username);

      return res.status(200).json({
        success: true,
        delteuser,
        message: 'user supprimé'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Erreur lors de la suppresion d'un user: ${error.message}`
      });
    }
  },

  async updateProfile(req, res){
    try {
      const { username, ...updateData } = req.body;

      // Appeler le service pour mettre à jour le profil
      const updatedUser = await UserService.updateUserProfile(username, updateData);
      
      // Renvoyer une réponse de succès
      res.status(200).json({
        success: true,
        message: 'Profil mis à jour avec succès',
        user: updatedUser
      });
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      
      // Déterminer le code d'état HTTP approprié
      let statusCode = 500;
      if (error.message === 'Utilisateur non trouvé') {
        statusCode = 404;
      } else if (error.message === 'Aucun champ valide à mettre à jour') {
        statusCode = 400;
      }
      
      // Renvoyer une réponse d'erreur
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Erreur serveur lors de la mise à jour du profil'
      });
    }
  },

  async getUserByRole(req, res) {
    try {
      

      const admin = await UserService.getUserByRole();
      
      return res.status(200).json({
        success: true,
        data: admin,
      });
    } catch (error) {
      console.error(`Erreur contrôleur lors de la recup de .... ${req.params.year}:`, error);
      
      return res.status(500).json({
        success: false,
        message: `Erreur lors de la recup de .... ${req.params.year}`,
        error: error.message
      });
    }
  },
};

module.exports = UserController;