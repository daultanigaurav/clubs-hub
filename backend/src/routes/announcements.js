const express = require('express');
const { body, validationResult } = require('express-validator');
const Announcement = require('../models/Announcement');
const Club = require('../models/Club');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const { 
      club, 
      priority, 
      search, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    let query = { isActive: true };
    
    if (club) query.club = club;
    if (priority) query.priority = priority;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'name email profilePicture')
      .populate('club', 'name logo')
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(query);

    res.json({
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single announcement
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name email profilePicture')
      .populate('club', 'name logo')
      .populate('targetClub', 'name logo')
      .populate('targetUsers', 'name email profilePicture');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create announcement
router.post('/', auth, [
  body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('targetAudience').isIn(['all', 'club_members', 'specific_club', 'specific_users']).withMessage('Invalid target audience')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const announcementData = {
      ...req.body,
      author: req.userId
    };

    // Validate target audience specific fields
    if (req.body.targetAudience === 'specific_club' && !req.body.targetClub) {
      return res.status(400).json({ message: 'Target club is required for specific club announcements' });
    }

    if (req.body.targetAudience === 'specific_users' && (!req.body.targetUsers || req.body.targetUsers.length === 0)) {
      return res.status(400).json({ message: 'Target users are required for specific users announcements' });
    }

    const announcement = new Announcement(announcementData);
    await announcement.save();

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update announcement
router.put('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if user is the author or admin
    if (announcement.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this announcement' });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email profilePicture')
     .populate('club', 'name logo');

    res.json({
      message: 'Announcement updated successfully',
      announcement: updatedAnnouncement
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete announcement
router.delete('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if user is the author or admin
    if (announcement.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this announcement' });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
