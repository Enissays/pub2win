const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  rewardType: {
    type: String,
    enum: ['money', 'discount', 'freebie'],
    required: true
  },
  rewardValue: {
    type: Number,
    required: true
  },
  rewardDetails: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  maxInfluencers: {
    type: Number,
    required: true
  },
  currentInfluencers: {
    type: Number,
    default: 0
  },
  targetAudience: {
    ageMin: Number,
    ageMax: Number,
    gender: String,
    interests: [String]
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  locationRadius: {
    type: Number, // in kilometers
    default: 0 // 0 means no location restriction
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'canceled'],
    default: 'draft'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  invitedInfluencers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
OfferSchema.index({ location: '2dsphere' });
// Index for searching by category
OfferSchema.index({ category: 1 });
// Index for active offers
OfferSchema.index({ status: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Offer', OfferSchema);
