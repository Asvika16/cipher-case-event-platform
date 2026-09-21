const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Round = require('../models/Round');
const Submission = require('../models/Submission');

// GET /api/teams/results - Public results page endpoint
router.get('/results', async (req, res) => {
  try {
    const round3 = await Round.findOne({ roundNumber: 3 });
    const isPublished = round3 && round3.resultsPublished;

    if (!isPublished) {
      return res.json({
        published: false,
        message: 'The official Cipher Case results have not been published yet. Check back soon!'
      });
    }

    // Fetch winners & finalists
    const winners = await Team.find({
      role: 'team',
      status: { $in: ['WINNER', 'RUNNER UP', 'SECOND RUNNER UP', 'FINALIST'] }
    }).select('teamId teamName members status qualifiedRound3');

    // Fetch submissions for round 3 to sort accurately
    const submissions = await Submission.find({ roundNumber: 3 });
    const subMap = new Map();
    submissions.forEach(s => subMap.set(s.teamId, s));

    const rankedTeams = winners.map(team => {
      const sub = subMap.get(team.teamId);
      return {
        teamId: team.teamId,
        teamName: team.teamName,
        members: team.members,
        status: team.status,
        score: sub ? sub.score : 0,
        timeTaken: sub ? sub.timeTaken : 0
      };
    });

    // Custom order: WINNER first, RUNNER UP second, SECOND RUNNER UP third, then FINALISTs
    const statusPriority = {
      'WINNER': 1,
      'RUNNER UP': 2,
      'SECOND RUNNER UP': 3,
      'FINALIST': 4
    };

    rankedTeams.sort((a, b) => {
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status];
      }
      return b.score - a.score;
    });

    const winner = rankedTeams.find(t => t.status === 'WINNER') || null;
    const runnerUp = rankedTeams.find(t => t.status === 'RUNNER UP') || null;
    const secondRunnerUp = rankedTeams.find(t => t.status === 'SECOND RUNNER UP') || null;
    const finalists = rankedTeams.filter(t => t.status === 'FINALIST');

    res.json({
      published: true,
      winner,
      runnerUp,
      secondRunnerUp,
      finalists,
      allResults: rankedTeams
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Error fetching event results.' });
  }
});

module.exports = router;
