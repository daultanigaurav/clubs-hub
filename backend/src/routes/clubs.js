const express = require('express');
const { body, validationResult } = require('express-validator');
const Club = require('../models/Club');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all clubs
router.get('/', async (req, res) => {
  try {
    // Mock data for demonstration
    const mockClubs = [
      {
        _id: '1',
        name: 'Computer Science Club',
        description: 'A club for computer science enthusiasts to collaborate on projects and learn new technologies.',
        category: 'technical',
        president: { name: 'John Doe', email: 'john@example.com' },
        members: [],
        socialLinks: {
          website: 'https://csclub.example.com',
          instagram: '@csclub'
        },
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Photography Society',
        description: 'Capture moments and share your passion for photography with fellow enthusiasts.',
        category: 'cultural',
        president: { name: 'Jane Smith', email: 'jane@example.com' },
        members: [],
        socialLinks: {
          instagram: '@photoclub'
        },
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        name: 'Basketball Team',
        description: 'Join our competitive basketball team and represent the college in tournaments.',
        category: 'sports',
        president: { name: 'Mike Johnson', email: 'mike@example.com' },
        members: [],
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      clubs: mockClubs,
      totalPages: 1,
      currentPage: 1,
      total: mockClubs.length
    });
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single club
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('president', 'name email profilePicture')
      .populate('vicePresident', 'name email profilePicture')
      .populate('secretary', 'name email profilePicture')
      .populate('members', 'name email profilePicture');

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json(club);
  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create club
router.post('/', auth, [
  body('name').trim().isLength({ min: 2 }).withMessage('Club name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['academic', 'sports', 'cultural', 'technical', 'social', 'volunteer', 'other']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clubData = {
      ...req.body,
      president: req.userId
    };

    const club = new Club(clubData);
    await club.save();

    // Add president as member
    club.members.push(req.userId);
    await club.save();

    // Add club to user's joined clubs
    await User.findByIdAndUpdate(req.userId, {
      $push: { joinedClubs: club._id }
    });

    res.status(201).json({
      message: 'Club created successfully',
      club
    });
  } catch (error) {
    console.error('Create club error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join club
router.post('/:id/join', auth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    if (club.members.includes(req.userId)) {
      return res.status(400).json({ message: 'Already a member of this club' });
    }

    club.members.push(req.userId);
    await club.save();

    // Add club to user's joined clubs
    await User.findByIdAndUpdate(req.userId, {
      $push: { joinedClubs: club._id }
    });

    res.json({ message: 'Successfully joined the club' });
  } catch (error) {
    console.error('Join club error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave club
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    if (!club.members.includes(req.userId)) {
      return res.status(400).json({ message: 'Not a member of this club' });
    }

    club.members.pull(req.userId);
    await club.save();

    // Remove club from user's joined clubs
    await User.findByIdAndUpdate(req.userId, {
      $pull: { joinedClubs: club._id }
    });

    res.json({ message: 'Successfully left the club' });
  } catch (error) {
    console.error('Leave club error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
