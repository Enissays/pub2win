/*const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Vendor = require('../models/Vendor');
const Influencer = require('../models/Influencer');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user (influencer or vendor)
 * @access  Public
 
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { email, pseudo, password, nom, prenom, role } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    user = new User({
      email,
      pseudo,
      password: hashedPassword,
      nom,
      prenom,
      role
    });
    
    await user.save();
    
    // Create role-specific profile
    if (role === 'vendor') {
      const vendor = new Vendor({
        userId: user._id,
        businessName: `${nom} ${prenom}'s Business`, // Default name, can be updated later
        status: 'pending' // Requires verification
      });
      await vendor.save();
    } else if (role === 'influencer') {
      const influencer = new Influencer({
        userId: user._id,
        status: 'pending', // Requires verification
        totalFollowers: 0, // Will be updated after social media verification
        rating: 0
      });
      await influencer.save();
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        pseudo: user.pseudo,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: error.message 
    });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Update last login time
    user.lastLogin = Date.now();
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        pseudo: user.pseudo,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

module.exports = router;*/