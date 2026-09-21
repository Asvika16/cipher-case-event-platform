const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    uppercase: true
  },
  roundNumber: {
    type: Number,
    required: true
  },
  answers: {
    type: Map,
    of: String,
    default: {}
  },
  score: {
    type: Number,
    default: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  submitTime: {
    type: Date,
    default: null
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  submitted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Compound index for unique team per round submission
submissionSchema.index({ teamId: 1, roundNumber: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
