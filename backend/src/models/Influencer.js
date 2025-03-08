const mongoose = require('mongoose');

const InfluencerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  socialMedia: [{
    platform: {
      type: String,
      enum: ['instagram', 'tiktok', 'twitter', 'facebook', 'youtube', 'other'],
      required: true
    },
    handle: {
      type: String,
      required: true
    },
    url: String,
    followers: {
      type: Number,
      default: 0
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  totalFollowers: {
    type: Number,
    default: 0
  },
  contentCategories: [{
    type: String
  }],
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
  paymentInfo: {
    paypalEmail: String,
    bankName: String,
    accountName: String,
    accountNumber: String,
    iban: String,
    swift: String
  },
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    totalEarned: {
      type: Number,
      default: 0
    },
    pendingPayments: {
      type: Number,
      default: 0
    }
  },
  completedCampaigns: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  comments: [{
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
InfluencerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Influencer', InfluencerSchema);