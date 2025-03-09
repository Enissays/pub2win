/*// File: routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Influencer = require('../models/Influencer');
const Vendor = require('../models/Vendor');
const Transaction = require('../models/Transaction');
const { validateProfileUpdate } = require('../middleware/validation');
const { isAdmin } = require('../middleware/auth');
const router = express.Router();

/**
 * @route   PATCH /user/profile
 * @desc    Update user profile
 * @access  Private
 
router.patch('/profile', validateProfileUpdate, async (req, res) => {
  try {
    const { email, pseudo, password, nom, prenom, currentPassword } = req.body;
    
    // Get the user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // If updating password, verify current password
    if (password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    // Check if email is being changed and is already in use
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use'
        });
      }
      user.email = email;
    }
    
    // Check if pseudo is being changed and is already in use
    if (pseudo && pseudo !== user.pseudo) {
      const pseudoExists = await User.findOne({ pseudo });
      if (pseudoExists) {
        return res.status(400).json({
          success: false,
          message: 'Username is already in use'
        });
      }
      user.pseudo = pseudo;
    }
    
    // Update other fields
    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
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
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /user/profile/:id
 * @desc    Delete user account
 * @access  Private (own account) or Admin
 
router.delete('/profile/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user is deleting their own account or is an admin
    if (userId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own account'
      });
    }
    
    // Get the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete role-specific profile
    if (user.role === 'vendor') {
      await Vendor.deleteOne({ userId });
    } else if (user.role === 'influencer') {
      await Influencer.deleteOne({ userId });
    }
    
    // Delete the user
    await User.deleteOne({ _id: userId });
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
});

/**
 * @route   GET /user/wallet
 * @desc    Get user wallet information
 * @access  Private
 
router.get('/wallet', async (req, res) => {
  try {
    // Check user role
    if (req.userRole === 'influencer') {
      const influencer = await Influencer.findOne({ userId: req.userId });
      if (!influencer) {
        return res.status(404).json({
          success: false,
          message: 'Influencer profile not found'
        });
      }
      
      // Get recent transactions
      const transactions = await Transaction.find({
        userId: req.userId
      })
      .sort({ createdAt: -1 })
      .limit(10);
      
      res.json({
        success: true,
        wallet: influencer.wallet,
        transactions
      });
    } else if (req.userRole === 'vendor') {
      const vendor = await Vendor.findOne({ userId: req.userId });
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor profile not found'
        });
      }
      
      // For vendors, we might need different wallet info
      // This could be subscription details, campaign budget, etc.
      res.json({
        success: true,
        subscription: vendor.subscription,
        paymentInfo: vendor.paymentInfo
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to wallet'
      });
    }
  } catch (error) {
    console.error('Wallet fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wallet information',
      error: error.message
    });
  }
});

/**
 * @route   POST /user/wallet/withdraw
 * @desc    Request a withdrawal
 * @access  Private (influencers only)
 
router.post('/wallet/withdraw', async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Only influencers can withdraw
    if (req.userRole !== 'influencer') {
      return res.status(403).json({
        success: false,
        message: 'Only influencers can request withdrawals'
      });
    }
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid withdrawal amount'
      });
    }
    
    // Get the influencer
    const influencer = await Influencer.findOne({ userId: req.userId });
    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer profile not found'
      });
    }
    
    // Check if influencer has enough balance
    if (influencer.wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    // Create a withdrawal transaction
    const transaction = new Transaction({
      userId: req.userId,
      type: 'withdrawal',
      amount: amount,
      description: 'Withdrawal request',
      status: 'pending'
    });
    
    await transaction.save();
    
    // Update influencer wallet
    influencer.wallet.balance -= amount;
    influencer.wallet.pendingPayments += amount;
    await influencer.save();
    
    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      transaction
    });
  } catch (error) {
    console.error('Withdrawal request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting withdrawal request',
      error: error.message
    });
  }
});

module.exports = router;*/