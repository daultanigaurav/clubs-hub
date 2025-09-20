const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventType: {
    type: String,
    enum: ['workshop', 'seminar', 'competition', 'social', 'sports', 'cultural', 'other'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    default: 0
  },
  registeredParticipants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  registrationDeadline: {
    type: Date
  },
  isRegistrationRequired: {
    type: Boolean,
    default: false
  },
  registrationFee: {
    type: Number,
    default: 0
  },
  images: [String],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
