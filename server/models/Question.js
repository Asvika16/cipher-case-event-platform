const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'text'],
    default: 'multiple_choice'
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  hintText: {
    type: String,
    default: ''
  },
  hintPenalty: {
    type: Number,
    default: 2
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
