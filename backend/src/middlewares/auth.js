const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User no longer exists' 
      });
    }
    
    // Add user and role to request
    req.user = user;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

/**
 * Middleware to ensure user has vendor role
 */
exports.isVendor = (req, res, next) => {
  if (req.userRole !== 'COMMERCANT') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: Vendor role required' 
    });
  }
  next();
};

/**
 * Middleware to ensure user has influencer role
 */
exports.isInfluencer = (req, res, next) => {
  if (req.userRole !== 'INFLUENCER') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: Influencer role required' 
    });
  }
  next();
};

/**
 * Middleware to ensure user has admin role
 */
exports.isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: Admin role required' 
    });
  }
  next();
};