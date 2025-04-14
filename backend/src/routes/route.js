const express = require('express');
const router = express.Router();
const { requireAuth, syncUser, isVendor, isInfluencer } = require('../middlewares/clerkauth');
const { isAdmin } = require('../middlewares/auth'); // Keep your admin middleware
const userController = require('../controllers/userController');
const influencerController = require('../controllers/influencerController');
const vendorController = require('../controllers/vendorController');
const apisController = require('../apis/insta_test');
//const offerController = require('../controllers/offerController');

// Public routes (no auth required)
router.get('/', (req, res) => {
  res.send('Welcome to Pub2Win API');
});

// Authentication routes
router.post('/user/register', requireAuth, syncUser, userController.registerUser);
router.post('/user/login', requireAuth, syncUser, userController.loginUser);
router.post('/user/oauth-login', requireAuth, syncUser, userController.oauthLogin);

// User Profile Routes - protected with Clerk
router.patch('/user/profile', requireAuth, syncUser, userController.updateProfile);
router.delete('/user/profile', requireAuth, syncUser, userController.deleteProfile);
router.get('/user/wallet', userController.getWallet);
router.post('/user/wallet/withdraw', requireAuth, syncUser, userController.withdrawFunds); 
router.get('/user/:username', requireAuth, syncUser, userController.getProfile);

// Influencer Routes
router.get('/influencer/:id', influencerController.getProfile);
router.post('/influencer/rate/:id', requireAuth, syncUser, influencerController.rateInfluencer);
router.post('/influencer/comment/:id', requireAuth, syncUser, influencerController.commentInfluencer);
router.post('/influencer/accept/:id', requireAuth, syncUser, isInfluencer, influencerController.acceptOffer);
router.post('/influencer/:id/validate', requireAuth, syncUser, isAdmin, influencerController.validate);
router.delete('/influencer/:id/delete', requireAuth, syncUser, isAdmin, influencerController.delete);

// Vendor Routes
router.post('/vendor/subscribe', requireAuth, syncUser, isVendor, vendorController.subscribe);
router.post('/vendor/announce', requireAuth, syncUser, isVendor, vendorController.announce);
router.post('/vendor/banking', requireAuth, syncUser, isVendor, vendorController.setupBanking);
router.post('/vendor/:id/validate', requireAuth, syncUser, isAdmin, vendorController.validate);

// Replace authenticateToken with requireAuth and syncUser
router.post('/endroit/:id_endroit/conditions', requireAuth, syncUser, isVendor, vendorController.setConditions);
router.get('/endroit/:id_endroit', vendorController.getEndroit);
router.delete('/endroit/:id_endroit/delete', requireAuth, syncUser, isAdmin, vendorController.deleteEndroit);
router.patch('/endroit/:id/update', requireAuth, syncUser, isVendor, vendorController.updateEndroit);
router.post('/endroit/create', requireAuth, syncUser, isVendor, vendorController.createEndroit);
router.get('/endroits', vendorController.getEndroits);

// User Profile Routes
router.patch('/user/profile', requireAuth, syncUser, userController.updateProfile);
router.delete('/user/profile',  requireAuth, syncUser, userController.deleteProfile);
router.get('/user/wallet',  requireAuth, syncUser, userController.getWallet);
router.post('/user/wallet/withdraw',  requireAuth, syncUser, userController.withdrawFunds); 
router.get('/user/:username',  requireAuth, syncUser, userController.getProfile);


// Influencer Routes
router.get('/influencer/:id',  requireAuth, syncUser, influencerController.getProfile);
router.post('/influencer/rate/:id',  requireAuth, syncUser, influencerController.rateInfluencer);
router.post('/influencer/comment/:id',  requireAuth, syncUser, influencerController.commentInfluencer);
router.post('/influencer/accept/:id',  requireAuth, syncUser, isInfluencer, influencerController.acceptOffer);
router.post('/influencer/:id/validate',  requireAuth, syncUser, isAdmin, influencerController.validate);
router.delete('/influencer/:id/delete',  requireAuth, syncUser, isAdmin, influencerController.delete);

// Webhook routes
router.get('/instagram', apisController.getWebhook);
router.post('/instagram', apisController.postWebhook);
router.get('/instagram/test', apisController.testGetAllReceivedUpdates);
router.get('/instagram/callback', apisController.callBackInstagram);

/*

// Offer Routes
router.get('/offer/details/:id', authenticateToken, offerController.getDetails);
router.patch('/offer/:id_offer', authenticateToken, isVendor, offerController.updateOffer);
router.delete('/offer/:id_offer', authenticateToken, isVendor, offerController.deleteOffer);
router.post('/offer/:id_offer', authenticateToken, offerController.createOffer);
*/
/*
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