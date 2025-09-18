const express = require('express');
const { body, validationResult } = require('express-validator');
const Newsletter = require('../models/Newsletter');
const { sendNewsletterConfirmation } = require('../services/emailService');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  body('interests.*')
    .optional()
    .isIn(['web-development', 'graphic-design', 'video-editing', 'music-production', 'online-jobs', 'computer-packages', 'robotics-ml', 'cyber-security', 'all'])
    .withMessage('Invalid interest selection')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, name, interests } = req.body;

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed to our newsletter'
        });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.name = name || existingSubscriber.name;
        existingSubscriber.interests = interests || existingSubscriber.interests;
        existingSubscriber.subscriptionDate = new Date();
        await existingSubscriber.save();

        // Send confirmation email
        const emailResult = await sendNewsletterConfirmation(email, name);

        return res.json({
          success: true,
          message: 'Subscription reactivated successfully!',
          data: {
            email: existingSubscriber.email,
            name: existingSubscriber.name,
            interests: existingSubscriber.interests
          }
        });
      }
    }

    // Create new subscription
    const subscriber = new Newsletter({
      email,
      name,
      interests: interests || ['all'],
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await subscriber.save();

    // Send confirmation email
    const emailResult = await sendNewsletterConfirmation(email, name);

    if (!emailResult.success) {
      console.warn('Newsletter confirmation email failed:', emailResult.error);
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        email: subscriber.email,
        name: subscriber.name,
        interests: subscriber.interests,
        subscriptionDate: subscriber.subscriptionDate
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post('/unsubscribe', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter list'
      });
    }

    if (!subscriber.isActive) {
      return res.json({
        success: true,
        message: 'You have already been unsubscribed'
      });
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   GET /api/newsletter/unsubscribe
// @desc    Unsubscribe page (for email links)
// @access  Public
router.get('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).send('Email parameter is required');
    }

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.send('Email not found in our newsletter list');
    }

    if (!subscriber.isActive) {
      return res.send('You have already been unsubscribed');
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2 style="color: #00ff2a;">Unsubscribed Successfully</h2>
        <p>You have been successfully unsubscribed from our newsletter.</p>
        <p>You can always subscribe again from our website.</p>
        <a href="/" style="color: #00ff2a;">Return to Website</a>
      </div>
    `);

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).send('Server error. Please try again later.');
  }
});

// @route   GET /api/newsletter
// @desc    Get all newsletter subscribers (Admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    let query = {};

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const subscribers = await Newsletter.find(query)
      .sort({ subscriptionDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Newsletter.countDocuments(query);

    res.json({
      success: true,
      data: subscribers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSubscribers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/newsletter/stats
// @desc    Get newsletter statistics (Admin only)
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments();
    const activeSubscribers = await Newsletter.countDocuments({ isActive: true });
    const inactiveSubscribers = await Newsletter.countDocuments({ isActive: false });

    // Get subscribers by interest
    const interestStats = await Newsletter.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$interests' },
      { $group: { _id: '$interests', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent subscriptions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSubscriptions = await Newsletter.countDocuments({
      subscriptionDate: { $gte: thirtyDaysAgo },
      isActive: true
    });

    res.json({
      success: true,
      data: {
        totalSubscribers,
        activeSubscribers,
        inactiveSubscribers,
        recentSubscriptions,
        interestStats
      }
    });

  } catch (error) {
    console.error('Get newsletter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/newsletter/:id
// @desc    Delete newsletter subscriber (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    await Newsletter.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Subscriber deleted successfully'
    });

  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;