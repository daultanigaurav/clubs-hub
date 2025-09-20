const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Club = require('../models/Club');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('joinedClubs', 'name logo category');

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedUpdates = ['name', 'bio', 'interests', 'profilePicture'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's joined clubs
router.get('/clubs', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: 'joinedClubs',
        populate: {
          path: 'president',
          select: 'name email'
        }
      });

    res.json(user.joinedClubs);
  } catch (error) {
    console.error('Get user clubs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's events
router.get('/events', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const Event = require('../models/Event');
    let query = { registeredParticipants: req.userId };
    
    if (status) {
      query.status = status;
    }

    const events = await Event.find(query)
      .populate('club', 'name logo')
      .populate('organizer', 'name email')
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const query = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    };

    const users = await User.find(query)
      .select('name email profilePicture bio')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
