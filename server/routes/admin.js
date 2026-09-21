const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Round = require('../models/Round');
const Submission = require('../models/Submission');
const { verifyAdmin } = require('../middleware/auth');

// Apply verifyAdmin middleware to all admin endpoints
router.use(verifyAdmin);

// GET /api/admin/overview - Get full status of all 30 teams across all 3 rounds
router.get('/overview', async (req, res) => {
  try {
    const teams = await Team.find({ role: 'team' }).sort({ teamId: 1 });
    const rounds = await Round.find().sort({ roundNumber: 1 });
    const submissions = await Submission.find();

    // Map submissions by teamId and roundNumber
    const subMap = {};
    submissions.forEach(s => {
      if (!subMap[s.teamId]) subMap[s.teamId] = {};
      subMap[s.teamId][s.roundNumber] = s;
    });

    const overview = teams.map(team => {
      const tId = team.teamId;
      const r1Sub = subMap[tId] ? subMap[tId][1] : null;
      const r2Sub = subMap[tId] ? subMap[tId][2] : null;
      const r3Sub = subMap[tId] ? subMap[tId][3] : null;

      return {
        id: team._id,
        teamId: team.teamId,
        teamName: team.teamName,
        members: team.members,
        currentRound: team.currentRound,
        status: team.status,
        qualifiedRound2: team.qualifiedRound2,
        qualifiedRound3: team.qualifiedRound3,
        round1: {
          score: r1Sub ? r1Sub.score : 0,
          timeTaken: r1Sub ? r1Sub.timeTaken : 0,
          submitted: r1Sub ? r1Sub.submitted : false,
          submitTime: r1Sub ? r1Sub.submitTime : null
        },
        round2: {
          score: r2Sub ? r2Sub.score : 0,
          timeTaken: r2Sub ? r2Sub.timeTaken : 0,
          hintsUsed: r2Sub ? r2Sub.hintsUsed : 0,
          submitted: r2Sub ? r2Sub.submitted : false,
          submitTime: r2Sub ? r2Sub.submitTime : null
        },
        round3: {
          score: r3Sub ? r3Sub.score : 0,
          timeTaken: r3Sub ? r3Sub.timeTaken : 0,
          submitted: r3Sub ? r3Sub.submitted : false,
          submitTime: r3Sub ? r3Sub.submitTime : null
        }
      };
    });

    res.json({
      rounds,
      teams: overview
    });

  } catch (error) {
    console.error('Error fetching admin overview:', error);
    res.status(500).json({ message: 'Error fetching admin overview.' });
  }
});

// POST /api/admin/start-round
router.post('/start-round', async (req, res) => {
  try {
    const { roundNumber } = req.body;
    const round = await Round.findOne({ roundNumber });

    if (!round) {
      return res.status(404).json({ message: 'Round not found.' });
    }

    const now = new Date();
    const endTime = new Date(now.getTime() + round.duration * 60 * 1000);

    round.status = 'active';
    round.startTime = now;
    round.endTime = endTime;
    await round.save();

    // Update teams currentRound
    await Team.updateMany(
      { role: 'team' },
      { $set: { currentRound: roundNumber } }
    );

    res.json({ message: `Round ${roundNumber} started successfully!`, round });
  } catch (error) {
    res.status(500).json({ message: 'Error starting round.' });
  }
});

// POST /api/admin/end-round
router.post('/end-round', async (req, res) => {
  try {
    const { roundNumber } = req.body;
    const round = await Round.findOne({ roundNumber });

    if (!round) {
      return res.status(404).json({ message: 'Round not found.' });
    }

    round.status = 'ended';
    await round.save();

    res.json({ message: `Round ${roundNumber} ended successfully!`, round });
  } catch (error) {
    res.status(500).json({ message: 'Error ending round.' });
  }
});

// POST /api/admin/finalize-round - Auto qualification logic
router.post('/finalize-round', async (req, res) => {
  try {
    const { roundNumber } = req.body;
    const round = await Round.findOne({ roundNumber });

    if (!round) {
      return res.status(404).json({ message: 'Round not found.' });
    }

    if (roundNumber === 1) {
      // Fetch all submissions for Round 1
      const teams = await Team.find({ role: 'team' });
      const submissions = await Submission.find({ roundNumber: 1 });

      const subMap = new Map();
      submissions.forEach(s => subMap.set(s.teamId, s));

      // Calculate score & time taken list
      const teamStats = teams.map(t => {
        const sub = subMap.get(t.teamId);
        return {
          team: t,
          score: sub ? sub.score : 0,
          timeTaken: sub ? sub.timeTaken : 999999
        };
      });

      // Sort by score DESC, timeTaken ASC
      teamStats.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      });

      // Select Top 10
      const top10Ids = teamStats.slice(0, 10).map(item => item.team.teamId);

      for (let i = 0; i < teamStats.length; i++) {
        const item = teamStats[i];
        const isQualified = i < 10;
        await Team.findByIdAndUpdate(item.team._id, {
          qualifiedRound2: isQualified,
          status: isQualified ? 'qualified' : 'eliminated'
        });
      }

      round.status = 'finalized';
      await round.save();

      return res.json({
        message: 'Round 1 Finalized! Top 10 teams qualified for Round 2.',
        qualifiedTeams: top10Ids
      });

    } else if (roundNumber === 2) {
      // Only consideration among Round 1 qualified teams
      const r1QualifiedTeams = await Team.find({ role: 'team', qualifiedRound2: true });
      const r2Submissions = await Submission.find({ roundNumber: 2 });

      const subMap = new Map();
      r2Submissions.forEach(s => subMap.set(s.teamId, s));

      const teamStats = r1QualifiedTeams.map(t => {
        const sub = subMap.get(t.teamId);
        return {
          team: t,
          score: sub ? sub.score : 0,
          timeTaken: sub ? sub.timeTaken : 999999
        };
      });

      // Sort by score DESC, timeTaken ASC
      teamStats.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      });

      // Select Top 5
      const top5Ids = teamStats.slice(0, 5).map(item => item.team.teamId);

      for (let i = 0; i < teamStats.length; i++) {
        const item = teamStats[i];
        const isQualified = i < 5;
        await Team.findByIdAndUpdate(item.team._id, {
          qualifiedRound3: isQualified,
          status: isQualified ? 'qualified' : 'eliminated'
        });
      }

      round.status = 'finalized';
      await round.save();

      return res.json({
        message: 'Round 2 Finalized! Top 5 teams qualified for Round 3.',
        qualifiedTeams: top5Ids
      });

    } else if (roundNumber === 3) {
      // Round 3 final winners calculation
      const r2QualifiedTeams = await Team.find({ role: 'team', qualifiedRound3: true });
      const r3Submissions = await Submission.find({ roundNumber: 3 });

      const subMap = new Map();
      r3Submissions.forEach(s => subMap.set(s.teamId, s));

      const teamStats = r2QualifiedTeams.map(t => {
        const sub = subMap.get(t.teamId);
        return {
          team: t,
          score: sub ? sub.score : 0,
          timeTaken: sub ? sub.timeTaken : 999999
        };
      });

      teamStats.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      });

      // Rank 1: WINNER, Rank 2: RUNNER UP, Rank 3: SECOND RUNNER UP, Rank 4 & 5: FINALIST
      const winners = [];
      for (let i = 0; i < teamStats.length; i++) {
        const item = teamStats[i];
        let status = 'FINALIST';
        if (i === 0) status = 'WINNER';
        else if (i === 1) status = 'RUNNER UP';
        else if (i === 2) status = 'SECOND RUNNER UP';

        await Team.findByIdAndUpdate(item.team._id, { status });
        winners.push({ teamId: item.team.teamId, status, score: item.score, timeTaken: item.timeTaken });
      }

      round.status = 'finalized';
      round.resultsPublished = true;
      await round.save();

      return res.json({
        message: 'Round 3 Finalized! Winners calculated and Results published.',
        winners
      });
    }

    res.status(400).json({ message: 'Invalid round number.' });

  } catch (error) {
    console.error('Error finalizing round:', error);
    res.status(500).json({ message: 'Error finalizing round.' });
  }
});

// POST /api/admin/toggle-results
router.post('/toggle-results', async (req, res) => {
  try {
    const { publish } = req.body;
    await Round.updateMany({}, { resultsPublished: publish });
    res.json({ message: `Results page ${publish ? 'published' : 'hidden'}.` });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling results.' });
  }
});

// POST /api/admin/reset - DEV/TEST MODE
router.post('/reset', async (req, res) => {
  try {
    const { action, roundNumber } = req.body;

    if (action === 'reset_all') {
      // Reset all teams & rounds & submissions
      await Team.updateMany(
        { role: 'team' },
        {
          currentRound: 1,
          status: 'active',
          qualifiedRound2: false,
          qualifiedRound3: false
        }
      );

      await Round.updateMany(
        {},
        {
          status: 'not_started',
          startTime: null,
          endTime: null,
          resultsPublished: false
        }
      );

      await Submission.deleteMany({});

      return res.json({ message: 'DEVELOPMENT MODE: All teams, rounds, and submissions have been completely reset!' });
    }

    if (action === 'reset_round' && roundNumber) {
      await Submission.deleteMany({ roundNumber });
      await Round.updateOne(
        { roundNumber },
        { status: 'not_started', startTime: null, endTime: null }
      );
      return res.json({ message: `DEVELOPMENT MODE: Round ${roundNumber} reset successfully!` });
    }

    res.status(400).json({ message: 'Invalid reset action.' });

  } catch (error) {
    res.status(500).json({ message: 'Error performing dev reset.' });
  }
});

module.exports = router;
