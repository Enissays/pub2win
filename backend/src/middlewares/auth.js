const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User no longer exists' 
      });
    }
    
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

exports.isVendor = (req, res, next) => {
  if (req.userRole !== 'COMMERCANT') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: Vendor role required' 
    });
  }
  next();
};

exports.isInfluencer = (req, res, next) => {
  if (req.userRole !== 'INFLUENCER') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: Influencer role required' 
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: Admin role required' 
    });
  }
  next();
};