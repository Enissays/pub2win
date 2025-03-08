// File: routes/influencer.js
const express = require('express');
const mongoose = require('mongoose');
const Influencer = require('../models/Influencer');
const User = require('../models/User');
const Offer = require('../models/Offer');
const Application = require('../models/Application');
const Transaction = require('../models/Transaction');
const Vendor = require('../models/Vendor');
const { authenticateToken, isInfluencer } = require('../middleware/auth');
const router = express.Router();

/**
 * @route   GET /influencer/:id
 * @desc    Get influencer profile by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const influencerId = req.params.id;
    
    const influencer = await Influencer.findById(influencerId)
      .select('-paymentInfo -wallet.balance -wallet.pendingPayments');
    
    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer not found'
      });
    }
    
    // Get user data
    const user = await User.findById(influencer.userId)
      .select('pseudo profilePicture createdAt');
    
    // Count completed campaigns
    const completedCampaigns = await Application.countDocuments({
      influencerId,
      status: 'completed'
    });
    
    res.json({
      success: true,
      influencer: {
        ...influencer.toObject(),
        user,
        completedCampaigns
      }
    });
  } catch (error) {
    console.error('Get influencer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching influencer profile',
      error: error.message
    });
  }
});

/**
 * @route   POST /influencer/rate/:id
 * @desc    Rate an influencer
 * @access  Private (vendors only)
 */
router.post('/rate/:id', authenticateToken, async (req, res) => {
  try {
    const { rating } = req.body;
    const influencerId = req.params.id;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Check if user is a vendor
    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'Only vendors can rate influencers'
      });
    }
    
    // Check if the vendor has worked with this influencer
    const hasWorkedTogether = await Application.exists({
      influencerId,
      offerId: { $in: await Offer.find({ vendorId: vendor._id }).distinct('_id') },
      status: 'completed'
    });
    
    if (!hasWorkedTogether) {
      return res.status(403).json({
        success: false,
        message: 'You can only rate influencers you have worked with'
      });
    }
    
    // Get the influencer
    const influencer = await Influencer.findById(influencerId);
    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer not found'
      });
    }
    
    // Calculate new rating
    const newTotalRatings = influencer.totalRatings + 1;
    const newRating = ((influencer.rating * influencer.totalRatings) + rating) / newTotalRatings;
    
    // Update the rating
    influencer.rating = newRating;
    influencer.totalRatings = newTotalRatings;
    await influencer.save();
    
    res.json({
      success: true,
      message: 'Rating submitted successfully',
      newRating
    });
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting rating',
      error: error.message
    });
  }
});

/**
 * @route   POST /influencer/comment/:id
 * @desc    Comment on an influencer
 * @access  Private (vendors only)
 */
router.post('/comment/:id', authenticateToken, async (req, res) => {
  try {
    const { comment } = req.body;
    const influencerId = req.params.id;
    
    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
      });
    }
    
    // Check if user is a vendor
    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'Only vendors can comment on influencers'
      });
    }
    
    // Check if the vendor has worked with this influencer
    const hasWorkedTogether = await Application.exists({
      influencerId,
      offerId: { $in: await Offer.find({ vendorId: vendor._id }).distinct('_id') },
      status: 'completed'
    });
    
    if (!hasWorkedTogether) {
      return res.status(403).json({
        success: false,
        message: 'You can only comment on influencers you have worked with'
      });
    }
    
    // Get the influencer
    const influencer = await Influencer.findById(influencerId);
    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer not found'
      });
    }
    
    // Add the comment
    influencer.comments.push({
      vendorId: vendor._id,
      text: comment,
      createdAt: new Date()
    });
    await influencer.save();
    
    res.json({
      success: true,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

/**
 * @route   POST /influencer/accept/:id
 * @desc    Accept an offer
 * @access  Private (influencers only)
 */
router.post('/accept/:id', isInfluencer, async (req, res) => {
  try {
    const offerId = req.params.id;
    
    // Get the influencer
    const influencer = await Influencer.findOne({ userId: req.userId });
    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer profile not found'
      });
    }
    
    // Get the offer
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    // Check if offer is active
    if (offer.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This offer is no longer active'
      });
    }
    
    // Check if the offer is private and if the influencer is invited
    if (offer.isPrivate && !offer.invitedInfluencers.includes(influencer._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not invited to this private offer'
      });
    }
    
    // Check if the influencer has already applied
    const existingApplication = await Application.findOne({
      offerId,
      influencerId: influencer._id
    });
    
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this offer'
      });
    }
    
    // Check if the offer has reached maximum influencers
    if (offer.currentInfluencers >= offer.maxInfluencers) {
      return res.status(400).json({
        success: false,
        message: 'This offer has reached its maximum number of influencers'
      });
    }
    
    // Create a new application
    const application = new Application({
      offerId,
      influencerId: influencer._id,
      message: req.body.message || '',
      status: 'approved', // Auto-approved
      appliedAt: new Date(),
      processedAt: new Date()
    });
    
    await application.save();
    
    // Increment current influencers count
    offer.currentInfluencers += 1;
    await offer.save();
    
    // Notify the vendor via Socket.IO
    const io = req.app.get('io');
    io.to(`user_${offer.vendorId}`).emit('offer_accepted', {
      applicationId: application._id,
      offerId: offer._id,
      offerTitle: offer.title,
      influencerId: influencer._id,
      influencerName: (await User.findById(influencer.userId)).pseudo
    });
    
    res.json({
      success: true,
      message: 'Offer accepted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Offer acceptance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting offer',
      error: error.message
    });
  }
});

/**
 * @route   POST /influencer/:id/validate
 * @desc    Submit content for validation
 * @access  Private (influencers only)
 */
router.post('/:id/validate', isInfluencer, async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { contentLinks, contentScreenshots } = req.body;
    
    // Validate content submission
    if ((!contentLinks || contentLinks.length === 0) && 
        (!contentScreenshots || contentScreenshots.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'You must provide at least one content link or screenshot'
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
    
    // Get the application
    const application = await Application.findById(applicationId)
      .populate('offerId');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Check if this application belongs to the influencer
    if (application.influencerId.toString() !== influencer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only submit content for your own applications'
      });
    }
    
    // Check if application is in the right state
    if (application.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This application is not in the right state for content submission'
      });
    }
    
    // Update the application
    application.submission = {
      contentLinks: contentLinks || [],
      contentScreenshots: contentScreenshots || [],
      submittedAt: new Date()
    };
    
    await application.save();
    
    // Notify the vendor via Socket.IO
    const io = req.app.get('io');
    io.to(`user_${application.offerId.vendorId}`).emit('content_submitted', {
      applicationId: application._id,
      offerId: application.offerId._id,
      offerTitle: application.offerId.title,
      influencerId: influencer._id,
      influencerName: (await User.findById(influencer.userId)).pseudo
    });
    
    res.json({
      success: true,
      message: 'Content submitted successfully for validation'
    });
  } catch (error) {
    console.error('Content submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting content',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /influencer/:id/delete
 * @desc    Cancel an application
 * @access  Private (influencers only)
 */
router.delete('/:id/delete', isInfluencer, async (req, res) => {
  try {
    const applicationId = req.params.id;
    
    // Get the influencer
    const influencer = await Influencer.findOne({ userId: req.userId });
    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer profile not found'
      });
    }
    
    // Get the application
    const application = await Application.findById(applicationId)
      .populate('offerId');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Check if this application belongs to the influencer
    if (application.influencerId.toString() !== influencer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own applications'
      });
    }
    
    // Check if application is in a state that can be canceled
    if (application.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed applications cannot be canceled'
      });
    }
    
    // Delete the application
    await Application.deleteOne({ _id: applicationId });
    
    // Decrement current influencers count if the application was approved
    if (application.status === 'approved') {
      await Offer.findByIdAndUpdate(
        application.offerId._id,
        { $inc: { currentInfluencers: -1 } }
      );
    }
    
    // Notify the vendor via Socket.IO
    const io = req.app.get('io');
    io.to(`user_${application.offerId.vendorId}`).emit('application_canceled', {
      applicationId: application._id,
      offerId: application.offerId._id,
      offerTitle: application.offerId.title,
      influencerId: influencer._id,
      influencerName: (await User.findById(influencer.userId)).pseudo
    });
    
    res.json({
      success: true,
      message: 'Application canceled successfully'
    });
  } catch (error) {
    console.error('Application cancelation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error canceling application',
      error: error.message
    });
  }
});

module.exports = router;