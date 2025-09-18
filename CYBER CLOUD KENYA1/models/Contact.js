const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(phone) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
      },
      message: 'Please enter a valid phone number'
    }
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  service: {
    type: String,
    enum: [
      'web-development',
      'graphic-design',
      'video-editing',
      'social-media-marketing',
      'cyber-security',
      'software-sales',
      'training-programs',
      'general-inquiry'
    ],
    default: 'general-inquiry'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ service: 1 });

// Virtual for response time
contactSchema.virtual('responseTime').get(function() {
  if (this.response && this.response.respondedAt) {
    return this.response.respondedAt - this.createdAt;
  }
  return null;
});

// Pre-save middleware to set priority based on service
contactSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set priority based on service type
    const highPriorityServices = ['cyber-security'];
    const mediumPriorityServices = ['web-development', 'training-programs'];

    if (highPriorityServices.includes(this.service)) {
      this.priority = 'high';
    } else if (mediumPriorityServices.includes(this.service)) {
      this.priority = 'medium';
    } else {
      this.priority = 'low';
    }
  }
  next();
});

module.exports = mongoose.model('Contact', contactSchema);