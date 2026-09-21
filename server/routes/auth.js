const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Team = require('../models/Team');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { teamId, password } = req.body;

    if (!teamId || !password) {
      return res.status(400).json({ message: 'Team ID and Password are required.' });
    }

    const cleanTeamId = teamId.trim().toUpperCase();

    // Find team (admin or team)
    const team = await Team.findOne({ teamId: cleanTeamId });

    if (!team) {
      return res.status(401).json({ message: 'Invalid Team ID or Password.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, team.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Team ID or Password.' });
    }

    const token = jwt.sign(
      {
        id: team._id,
        teamId: team.teamId,
        teamName: team.teamName,
        role: team.role
      },
      process.env.JWT_SECRET || 'ciphercase_secret_key_2026_super_secure',
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user: {
        id: team._id,
        teamId: team.teamId,
        teamName: team.teamName,
        members: team.members,
        role: team.role,
        currentRound: team.currentRound,
        status: team.status,
        qualifiedRound2: team.qualifiedRound2,
        qualifiedRound3: team.qualifiedRound3
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const team = await Team.findOne({ teamId: req.user.teamId }).select('-password');
    if (!team) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user details.' });
  }
});

module.exports = router;
