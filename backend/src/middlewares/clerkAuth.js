const { clerkClient, ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.CLERK_SECRET_KEY) {
  console.error('CLERK_SECRET_KEY is not defined in environment variables');
  process.exit(1); // Exit if the key is missing - critical for security
}

const requireAuth = ClerkExpressRequireAuth({
  onError: (err, req, res) => {
    console.error('Clerk authentication error:', err);
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Unauthorized access'
    });
  }
});

const User = require('../models/user.model');
const Client = require('../models/client.model');
const Commercant = require('../models/commercant.model');

exports.requireAuth = requireAuth;

exports.syncUser = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Missing user information'
      });
    }

    const clerkUserId = req.auth.userId;
    
    let user = await User.findOne({ clerkId: clerkUserId });
    
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const role = clerkUser.publicMetadata?.role || 'CLIENT';
      const isInfluencer = clerkUser.publicMetadata?.isInfluencer || false;
      
      if (role.toLowerCase() === 'commercant') {
        user = new Commercant({
          clerkId: clerkUserId,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          nom: clerkUser.lastName || '',
          prenom: clerkUser.firstName || '',
          username: clerkUser.username || `user_${Date.now()}`,
          role: 'COMMERCANT',
          date_inscription: new Date(),
          status: 'pending'
        });
      } else {
        user = new Client({
          clerkId: clerkUserId,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          nom: clerkUser.lastName || '',
          prenom: clerkUser.firstName || '',
          username: clerkUser.username || `user_${Date.now()}`,
          role: 'CLIENT',
          isInfluenceur: isInfluencer,
          date_inscription: new Date()
        });
      }
      
      await user.save();
    }
    
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user synchronization'
    });
  }
};

exports.isInfluencer = (req, res, next) => {
  if (!req.user || req.userRole !== 'CLIENT' || !req.user.isInfluenceur) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Influencer role required'
    });
  }
  next();
};

exports.isVendor = (req, res, next) => {
  if (!req.user || req.userRole !== 'COMMERCANT') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Vendor role required'
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.userRole !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin role required'
    });
  }
  next();
};