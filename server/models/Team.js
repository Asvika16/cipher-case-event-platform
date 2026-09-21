const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  teamName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  members: [{
    type: String
  }],
  currentRound: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['active', 'qualified', 'eliminated', 'WINNER', 'RUNNER UP', 'SECOND RUNNER UP', 'FINALIST'],
    default: 'active'
  },
  qualifiedRound2: {
    type: Boolean,
    default: false
  },
  qualifiedRound3: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['team', 'admin'],
    default: 'team'
  }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
