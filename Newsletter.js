const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  interests: [{
    type: String,
    enum: [
      'web-development',
      'graphic-design',
      'video-editing',
      'music-production',
      'online-jobs',
      'computer-packages',
      'robotics-ml',
      'cyber-security',
      'all'
    ]
  }],
  subscriptionSource: {
    type: String,
    enum: ['website', 'social-media', 'referral', 'event', 'other'],
    default: 'website'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  lastEmailSent: {
    type: Date
  },
  emailCount: {
    type: Number,
    default: 0
  },
  preferences: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'occasional'],
      default: 'weekly'
    },
    categories: [{
      type: String,
      enum: ['news', 'tips', 'offers', 'events', 'updates']
    }]
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isActive: 1 });
newsletterSchema.index({ subscriptionDate: -1 });
newsletterSchema.index({ 'interests': 1 });

// Pre-save middleware to set default interests
newsletterSchema.pre('save', function(next) {
  if (this.isNew && (!this.interests || this.interests.length === 0)) {
    this.interests = ['all'];
  }
  next();
});

// Static method to get active subscribers
newsletterSchema.statics.getActiveSubscribers = function() {
  return this.find({ isActive: true });
};

// Static method to get subscribers by interest
newsletterSchema.statics.getSubscribersByInterest = function(interest) {
  return this.find({
    isActive: true,
    $or: [
      { interests: interest },
      { interests: 'all' }
    ]
  });
};

module.exports = mongoose.model('Newsletter', newsletterSchema);