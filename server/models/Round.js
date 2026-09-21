const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'active', 'ended', 'finalized'],
    default: 'not_started'
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  resultsPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Round', roundSchema);
