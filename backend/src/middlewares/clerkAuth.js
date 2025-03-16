// Update your clerkAuth.js file to properly load the secret key
const { clerkClient, ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const dotenv = require('dotenv');

// Make sure dotenv is configured at the top of the file
dotenv.config();

// Check if the secret key is available and log a helpful message if not
if (!process.env.CLERK_SECRET_KEY) {
  console.error('CLERK_SECRET_KEY is not defined in environment variables');
  // You might want to throw an error here in production
}

// Create the middleware with proper error handling
const requireAuth = ClerkExpressRequireAuth({
  // Optional: customize the error handling
  onError: (err, req, res) => {
    console.error('Clerk authentication error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

const User = require('../models/user.model');
const Client = require('../models/client.model');
const Commercant = require('../models/commercant.model');

// Middleware to verify Clerk token and attach user to request
exports.requireAuth = ClerkExpressRequireAuth({
  // Optional: Customize the error response
  onError: (err, req, res) => {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing authentication'
    });
  }
});

// Middleware to sync Clerk user with your database
exports.syncUser = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Missing user information'
      });
    }

    const clerkUserId = req.auth.userId;
    
    // Check if user exists in your database
    let user = await User.findOne({ clerkId: clerkUserId });
    
    if (!user) {
      // Get user data from Clerk
      const clerkUser = req.auth;
      
      // Determine user role based on metadata or other criteria
      const role = clerkUser.publicMetadata?.role || 'CLIENT';
      const isInfluencer = clerkUser.publicMetadata?.isInfluencer || false;
      
      // Create new user in your database
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
    
    // Attach user to request
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

// Middleware to check if user is an influencer
exports.isInfluencer = (req, res, next) => {
  if (!req.user || !req.user.isInfluenceur) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Influencer role required'
    });
  }
  next();
};

// Middleware to check if user is a vendor
exports.isVendor = (req, res, next) => {
  if (!req.user || req.user.role !== 'COMMERCANT') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Vendor role required'
    });
  }
  next();
};