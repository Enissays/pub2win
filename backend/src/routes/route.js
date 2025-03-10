const express = require('express');
const router = express.Router();
const { authenticateToken, isVendor, isInfluencer, isAdmin } = require('../middlewares/auth');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const influencerController = require('../controllers/influencerController');
const vendorController = require('../controllers/vendorController');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Vendor Routes
router.post('/vendor/subscribe', authenticateToken, isVendor, vendorController.subscribe);
router.post('/vendor/announce', authenticateToken, isVendor, vendorController.createAnnouncement);
router.post('/vendor/banking', authenticateToken, isVendor, vendorController.setupBanking);
router.post('/vendor/:id/validate', authenticateToken, isAdmin, vendorController.validate);
router.delete('/vendor/:id/delete', authenticateToken, isAdmin, vendorController.delete);

// User Profile Routes
router.patch('/user/profile', authenticateToken, userController.updateProfile);
router.delete('/user/profile', authenticateToken, userController.deleteProfile);
router.get('/user/wallet', authenticateToken, userController.getWallet);
router.post('/user/wallet/withdraw', authenticateToken, userController.withdrawFunds); 
router.get('/user/:username', authenticateToken, userController.getProfile);


// Influencer Routes
router.get('/influencer/:id', authenticateToken, influencerController.getProfile);
router.post('/influencer/rate/:id', authenticateToken, influencerController.rateInfluencer);
router.post('/influencer/comment/:id', authenticateToken, influencerController.commentInfluencer);
router.post('/influencer/accept/:id', authenticateToken, isInfluencer, influencerController.acceptOffer);
router.post('/influencer/:id/validate', authenticateToken, isAdmin, influencerController.validate);
router.delete('/influencer/:id/delete', authenticateToken, isAdmin, influencerController.delete);


/*
// Offer Routes
router.get('/offers/:categorie_name', authenticateToken, offerController.getByCategory);
router.get('/offer/details/:id', authenticateToken, offerController.getDetails);
router.patch('/offer/:id_offer', authenticateToken, isVendor, offerController.updateOffer);
router.delete('/offer/:id_offer', authenticateToken, isVendor, offerController.deleteOffer);
router.post('/offer/:id_offer', authenticateToken, offerController.createOffer);

// Admin Routes
router.get('/gains', authenticateToken, isAdmin, adminController.getGains);
router.get('/signalements', authenticateToken, isAdmin, adminController.getReports);

// Help Routes
router.get('/help', helpController.getHelp);
router.patch('/help', authenticateToken, isAdmin, helpController.updateHelp);

// Route parrainage 
id_utilisateur=?
*/

module.exports = router;