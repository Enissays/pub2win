/*// File: routes/vendor.js
const express = require('express');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Offer = require('../models/Offer');
const Subscription = require('../models/Subscription');
const Influencer = require('../models/Influencer');
const Application = require('../models/Application');
const Transaction = require('../models/Transaction');
const { isVendor } = require('../middleware/auth');
const { validateOffer } = require('../middleware/validation');
const router = express.Router();

router.post('/subscribe', isVendor, async (req, res) => {
  try {
    const { id_abonnement } = req.body;
    
    // Find the subscription plan
    const subscriptionPlan = await Subscription.findById(id_abonnement);
    if (!subscriptionPlan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }
    
    // Get vendor profile
    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }
    
    // Create a Stripe payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${subscriptionPlan.name} Subscription`,
              description: subscriptionPlan.description
            },
            unit_amount: subscriptionPlan.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        vendorId: vendor._id.toString(),
        planId: subscriptionPlan._id.toString()
      }
    });
    
    res.json({
      success: true,
      message: 'Subscription session created',
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing subscription',
      error: error.message
    });
  }
});

router.post('/announce', isVendor, validateOffer, async (req, res) => {
  try {
    const { influenceurs, description, id_commerce } = req.body;
    
    // Make sure the commerce belongs to this vendor
    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }
    
    if (vendor._id.toString() !== id_commerce) {
      return res.status(403).json({
        success: false,
        message: 'You can only create announcements for your own business'
      });
    }
    
    // Validate that all influencer IDs exist
    const influencerCount = await Influencer.countDocuments({
      _id: { $in: influenceurs },
      status: 'active'
    });
    
    if (influencerCount !== influenceurs.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more influencer IDs are invalid'
      });
    }
    
    // Create private offer
    const newOffer = new Offer({
      ...req.body,
      vendorId: vendor._id,
      isPrivate: true,
      invitedInfluencers: influenceurs,
      status: 'active'
    });
    
    await newOffer.save();
    
    // Notify influencers (will be handled by Socket.IO)
    const io = req.app.get('io');
    influenceurs.forEach(influencerId => {
      io.to(`user_${influencerId}`).emit('new_private_offer', {
        offerId: newOffer._id,
        vendorId: vendor._id,
        vendorName: vendor.businessName,
        message: description
      });
    });
    
    res.status(201).json({
      success: true,
      message: 'Private announcement created successfully',
      offer: newOffer
    });
  } catch (error) {
    console.error('Announcement creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating announcement',
      error: error.message
    });
  }
});

router.post('/banking', isVendor, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }
    
    // Update banking information
    vendor.paymentInfo = {
      ...vendor.paymentInfo,
      ...req.body
    };
    
    await vendor.save();
    
    res.json({
      success: true,
      message: 'Banking information updated successfully'
    });
  } catch (error) {
    console.error('Banking update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating banking information',
      error: error.message
    });
  }
});

router.post('/:id/validate', isVendor, async (req, res) => {
  try {
    const applicationId = req.params.id;
    
    // Find the application
    const application = await Application.findById(applicationId)
      .populate('offerId')
      .populate('influencerId');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Check if the vendor owns this offer
    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor || application.offerId.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to validate this submission'
      });
    }
    
    // Check if application is in the right state
    if (application.status !== 'pending' || !application.submission.submittedAt) {
      return res.status(400).json({
        success: false,
        message: 'This submission is not pending validation'
      });
    }
    
    // Update application status
    application.status = 'completed';
    application.submission.approvedAt = new Date();
    application.payment.status = 'pending';
    
    // If reward type is money, process the payment
    if (application.offerId.rewardType === 'money') {
      const influencer = application.influencerId;
      
      // Create transaction
      const transaction = new Transaction({
        userId: influencer.userId,
        type: 'payment',
        amount: application.offerId.rewardValue,
        description: `Payment for campaign: ${application.offerId.title}`,
        relatedEntity: {
          entityType: 'application',
          entityId: application._id
        },
        paymentMethod: 'internal',
        status: 'completed'
      });
      
      await transaction.save();
      
      // Update influencer wallet
      influencer.wallet.balance += application.offerId.rewardValue;
      influencer.wallet.totalEarned += application.offerId.rewardValue;
      await influencer.save();
      
      // Update application payment status
      application.payment.status = 'completed';
      application.payment.processedAt = new Date();
      application.payment.transactionId = transaction._id;
    }
    
    await application.save();
    
    // Increment influencer's completed campaigns count
    await Influencer.findByIdAndUpdate(
      application.influencerId._id,
      { $inc: { completedCampaigns: 1 } }
    );
    
    // Notify the influencer via Socket.IO
    const io = req.app.get('io');
    io.to(`user_${application.influencerId.userId}`).emit('submission_validated', {
      applicationId: application._id,
      offerId: application.offerId._id,
      offerTitle: application.offerId.title,
      vendorName: vendor.businessName,
      rewardType: application.offerId.rewardType,
      rewardValue: application.offerId.rewardValue
    });
    
    res.json({
      success: true,
      message: 'Submission validated successfully',
      application
    });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating submission',
      error: error.message
    });
  }
});

router.delete('/:id/delete', isVendor, async (req, res) => {
  try {
    const offerId = req.params.id;
    
    // Find the offer
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    // Check if the vendor owns this offer
    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor || offer.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this offer'
      });
    }
    
    // Check if there are any completed applications
    const completedApplications = await Application.countDocuments({
      offerId,
      status: 'completed'
    });
    
    if (completedApplications > 0) {
      // Mark as canceled instead of deleting
      offer.status = 'canceled';
      await offer.save();
      
      return res.json({
        success: true,
        message: 'Offer has been canceled (not deleted due to completed applications)'
      });
    }
    
    // Find all pending applications
    const pendingApplications = await Application.find({
      offerId,
      status: 'pending'
    });
    
    // Notify all influencers with pending applications
    const io = req.app.get('io');
    for (const app of pendingApplications) {
      io.to(`user_${app.influencerId}`).emit('offer_canceled', {
        applicationId: app._id,
        offerId: offer._id,
        offerTitle: offer.title
      });
      
      // Update application status
      app.status = 'rejected';
      app.processedAt = new Date();
      await app.save();
    }
    
    // Delete the offer
    await Offer.deleteOne({ _id: offerId });
    
    res.json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    console.error('Offer deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting offer',
      error: error.message
    });
  }
});

module.exports = router;
*/