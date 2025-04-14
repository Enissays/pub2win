const UserDAO = require('../repository/user.dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Client = require('../models/client.model');
const User = require('../models/user.model');
const Commercant = require('../models/commercant.model');

exports.register = async (req, res) => {
  try {
    const { clerkUserId, firstName, lastName, email, username, phoneNumber, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: clerkUserId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already registered'
      });
    }
    
    // Create new user based on role
    let user;
    if (role === 'INFLUENCER') {
      user = new Client({
        clerkId: clerkUserId,
        email,
        nom: lastName,
        prenom: firstName,
        username,
        phone: phoneNumber,
        role: 'CLIENT', // Or 'INFLUENCER' if you have that role
        isInfluenceur: true,
        date_inscription: new Date()
      });
    } else {
      // Handle other roles
    }
    
    await user.save();
    
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.prenom} ${user.nom}`,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing registration'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        isInfluencer: user.isInfluenceur || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};