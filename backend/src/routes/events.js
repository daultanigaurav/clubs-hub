const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const Club = require('../models/Club');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    // Mock data for demonstration
    const mockEvents = [
      {
        _id: '1',
        title: 'Web Development Workshop',
        description: 'Learn modern web development technologies including React, Node.js, and MongoDB.',
        eventType: 'workshop',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
        location: 'Computer Lab',
        venue: 'Tech Building Room 101',
        club: { _id: '1', name: 'Computer Science Club', logo: '' },
        organizer: { name: 'John Doe', email: 'john@example.com' },
        maxParticipants: 30,
        registeredParticipants: [],
        isRegistrationRequired: true,
        registrationFee: 0,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        title: 'Photo Exhibition',
        description: 'Showcase your best photography work and get feedback from peers and professionals.',
        eventType: 'cultural',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
        location: 'Art Gallery',
        venue: 'Cultural Center',
        club: { _id: '2', name: 'Photography Society', logo: '' },
        organizer: { name: 'Jane Smith', email: 'jane@example.com' },
        maxParticipants: 50,
        registeredParticipants: [],
        isRegistrationRequired: true,
        registrationFee: 10,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        title: 'Basketball Tournament',
        description: 'Annual inter-college basketball tournament. Show your skills and compete for the championship.',
        eventType: 'sports',
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // 6 hours later
        location: 'Sports Complex',
        venue: 'Main Basketball Court',
        club: { _id: '3', name: 'Basketball Team', logo: '' },
        organizer: { name: 'Mike Johnson', email: 'mike@example.com' },
        maxParticipants: 20,
        registeredParticipants: [],
        isRegistrationRequired: true,
        registrationFee: 5,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      events: mockEvents,
      totalPages: 1,
      currentPage: 1,
      total: mockEvents.length
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club', 'name logo description')
      .populate('organizer', 'name email profilePicture')
      .populate('registeredParticipants', 'name email profilePicture');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event
router.post('/', auth, [
  body('title').trim().isLength({ min: 2 }).withMessage('Event title must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('club').isMongoId().withMessage('Valid club ID is required'),
  body('eventType').isIn(['workshop', 'seminar', 'competition', 'social', 'sports', 'cultural', 'other']).withMessage('Invalid event type'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is member of the club
    const club = await Club.findById(req.body.club);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    if (!club.members.includes(req.userId)) {
      return res.status(403).json({ message: 'Only club members can create events' });
    }

    const eventData = {
      ...req.body,
      organizer: req.userId
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.isRegistrationRequired) {
      return res.status(400).json({ message: 'Registration not required for this event' });
    }

    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    if (event.registeredParticipants.includes(req.userId)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    if (event.maxParticipants > 0 && event.registeredParticipants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.registeredParticipants.push(req.userId);
    await event.save();

    res.json({ message: 'Successfully registered for the event' });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unregister from event
router.post('/:id/unregister', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.registeredParticipants.includes(req.userId)) {
      return res.status(400).json({ message: 'Not registered for this event' });
    }

    event.registeredParticipants.pull(req.userId);
    await event.save();

    res.json({ message: 'Successfully unregistered from the event' });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
