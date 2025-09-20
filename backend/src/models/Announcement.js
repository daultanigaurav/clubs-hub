const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'club_members', 'specific_club', 'specific_users'],
    default: 'all'
  },
  targetClub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  },
  targetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date
  },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
