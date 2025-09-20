const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['academic', 'sports', 'cultural', 'technical', 'social', 'volunteer', 'other']
  },
  logo: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  president: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vicePresident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  secretary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  socialLinks: {
    website: String,
    instagram: String,
    facebook: String,
    twitter: String,
    linkedin: String
  },
  meetingSchedule: {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    time: String,
    location: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Club', clubSchema);
