const express = require('express');
const router = express.Router();
const Round = require('../models/Round');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const Team = require('../models/Team');
const { verifyToken } = require('../middleware/auth');

// GET /api/rounds/status - Get status of all rounds + server timestamp
router.get('/status', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ roundNumber: 1 });
    res.json({
      serverTime: new Date(),
      rounds
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching round status.' });
  }
});

// GET /api/rounds/:roundNumber - Get round questions & user submission state
router.get('/:roundNumber', verifyToken, async (req, res) => {
  try {
    const roundNumber = parseInt(req.params.roundNumber);
    const teamId = req.user.teamId;

    // Check round exists & status
    const round = await Round.findOne({ roundNumber });
    if (!round) {
      return res.status(404).json({ message: 'Round not found.' });
    }

    // Check team qualification
    if (req.user.role !== 'admin') {
      const team = await Team.findOne({ teamId });
      if (!team) return res.status(404).json({ message: 'Team not found.' });

      if (roundNumber === 2 && !team.qualifiedRound2) {
        return res.status(403).json({ message: 'Your team is not qualified for Round 2.' });
      }
      if (roundNumber === 3 && !team.qualifiedRound3) {
        return res.status(403).json({ message: 'Your team is not qualified for Round 3.' });
      }
    }

    // Fetch questions without exposing correctAnswer to non-admin
    const questions = await Question.find({ roundNumber }).sort({ questionNumber: 1 });
    
    const sanitizedQuestions = questions.map(q => {
      const qObj = q.toObject();
      if (req.user.role !== 'admin') {
        delete qObj.correctAnswer;
        delete qObj.hintText; // Only revealed via hint request endpoint
      }
      return qObj;
    });

    // Fetch team submission if exists
    let submission = await Submission.findOne({ teamId, roundNumber });

    res.json({
      round,
      serverTime: new Date(),
      questions: sanitizedQuestions,
      submission: submission ? {
        answers: Object.fromEntries(submission.answers || new Map()),
        score: submission.submitted || req.user.role === 'admin' ? submission.score : undefined,
        submitted: submission.submitted,
        hintsUsed: submission.hintsUsed,
        startTime: submission.startTime,
        submitTime: submission.submitTime,
        timeTaken: submission.timeTaken
      } : null
    });

  } catch (error) {
    console.error('Error fetching round info:', error);
    res.status(500).json({ message: 'Error fetching round info.' });
  }
});

// POST /api/rounds/:roundNumber/start - Start team timer for the round
router.post('/:roundNumber/start', verifyToken, async (req, res) => {
  try {
    const roundNumber = parseInt(req.params.roundNumber);
    const teamId = req.user.teamId;

    const round = await Round.findOne({ roundNumber });
    if (!round || round.status !== 'active') {
      return res.status(400).json({ message: 'Round is not currently active.' });
    }

    let submission = await Submission.findOne({ teamId, roundNumber });
    if (!submission) {
      submission = new Submission({
        teamId,
        roundNumber,
        startTime: new Date(),
        answers: {}
      });
      await submission.save();
    }

    res.json({ message: 'Round timer started.', startTime: submission.startTime });
  } catch (error) {
    res.status(500).json({ message: 'Error starting round timer.' });
  }
});

// POST /api/rounds/:roundNumber/use-hint - Use hint (Round 2 specific)
router.post('/:roundNumber/use-hint', verifyToken, async (req, res) => {
  try {
    const roundNumber = parseInt(req.params.roundNumber);
    const teamId = req.user.teamId;
    const { questionNumber } = req.body;

    if (roundNumber !== 2) {
      return res.status(400).json({ message: 'Hints are only available in Round 2.' });
    }

    let submission = await Submission.findOne({ teamId, roundNumber });
    if (!submission) {
      submission = new Submission({ teamId, roundNumber, startTime: new Date() });
    }

    if (submission.submitted) {
      return res.status(400).json({ message: 'Round already submitted.' });
    }

    if (submission.hintsUsed >= 2) {
      return res.status(400).json({ message: 'Maximum 2 hints limit reached.' });
    }

    const question = await Question.findOne({ roundNumber, questionNumber });
    if (!question || !question.hintText) {
      return res.status(404).json({ message: 'Hint not available for this question.' });
    }

    submission.hintsUsed += 1;
    await submission.save();

    res.json({
      message: 'Hint revealed!',
      hintText: question.hintText,
      hintsUsed: submission.hintsUsed,
      penalty: question.hintPenalty || 2
    });

  } catch (error) {
    res.status(500).json({ message: 'Error requesting hint.' });
  }
});

// POST /api/rounds/:roundNumber/submit - Submit answers & calculate server score
router.post('/:roundNumber/submit', verifyToken, async (req, res) => {
  try {
    const roundNumber = parseInt(req.params.roundNumber);
    const teamId = req.user.teamId;
    const { answers } = req.body; // object { 1: "answer", 2: "B", ... }

    const round = await Round.findOne({ roundNumber });
    if (!round) {
      return res.status(404).json({ message: 'Round not found.' });
    }

    if (round.status !== 'active' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Round is no longer active for submission.' });
    }

    let submission = await Submission.findOne({ teamId, roundNumber });
    if (submission && submission.submitted && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Answers already submitted for this round.' });
    }

    if (!submission) {
      submission = new Submission({
        teamId,
        roundNumber,
        startTime: round.startTime || new Date()
      });
    }

    // Evaluate answers
    const questions = await Question.find({ roundNumber });
    let totalScore = 0;
    const answersMap = new Map();

    questions.forEach(q => {
      const qNum = q.questionNumber.toString();
      const userAnswer = (answers && answers[qNum]) ? String(answers[qNum]).trim() : '';
      answersMap.set(qNum, userAnswer);

      if (userAnswer) {
        // Compare case-insensitively for clean evaluation
        const cleanUser = userAnswer.toLowerCase().trim();
        const cleanCorrect = q.correctAnswer.toLowerCase().trim();

        if (cleanUser === cleanCorrect) {
          totalScore += q.marks;
        } else if (cleanUser.length > 2 && cleanCorrect.length > 2 && (cleanUser.includes(cleanCorrect) || cleanCorrect.includes(cleanUser))) {
          // Flexible match for text questions
          totalScore += q.marks;
        }
      }
    });

    // Apply hint penalties for Round 2
    if (roundNumber === 2 && submission.hintsUsed > 0) {
      const totalPenalty = submission.hintsUsed * 2;
      totalScore = Math.max(0, totalScore - totalPenalty);
    }

    const now = new Date();
    const startTime = submission.startTime || round.startTime || now;
    const timeTaken = Math.max(1, Math.floor((now.getTime() - new Date(startTime).getTime()) / 1000));

    submission.answers = answersMap;
    submission.score = totalScore;
    submission.submitTime = now;
    submission.timeTaken = timeTaken;
    submission.submitted = true;

    await submission.save();

    res.json({
      message: 'Round submitted successfully!',
      score: totalScore,
      timeTaken,
      hintsUsed: submission.hintsUsed
    });

  } catch (error) {
    console.error('Error submitting round:', error);
    res.status(500).json({ message: 'Error submitting round answers.' });
  }
});

module.exports = router;
