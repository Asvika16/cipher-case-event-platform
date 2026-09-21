const express = require('express');
const router = express.Router();

const cluesData = {
  'round1-hidden1': {
    title: 'EVIDENCE CLUE #01 - ROUND 1',
    round: 1,
    clue: 'Look closely at the photograph timestamp: 6:12 PM. The power went off at 6:10 PM and returned at 6:14 PM. How could a illuminated photo of the room interior exist during the blackout?',
    hint: 'Compare Karthik\'s statement with the timestamp of Evidence 04.'
  },
  'round2-hidden1': {
    title: 'EVIDENCE CLUE #02 - ROUND 2',
    round: 2,
    clue: 'Server IP Log Entry #882: An external remote access connection was established at 7:06 PM from MAC address ending in :3F:A1.',
    hint: 'Cross-reference the MAC address with the campus Wi-Fi registration desk logs.'
  },
  'round3-hidden1': {
    title: 'EVIDENCE CLUE #03 - ROUND 3',
    round: 3,
    clue: 'Encrypted Note Fragment: "The master key was duplicated prior to 5:30 PM. The lock was opened from inside using the emergency latch."',
    hint: 'Check the door sensor audit timeline in Task 1 & Task 2.'
  }
};

// GET /api/clues/:clueId
router.get('/:clueId', (req, res) => {
  const clueId = req.params.clueId;
  const clue = cluesData[clueId];
  if (!clue) {
    return res.status(404).json({ message: 'Clue not found or invalid QR code.' });
  }
  res.json(clue);
});

module.exports = router;
