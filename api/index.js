const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../server/config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/rounds', require('../server/routes/rounds'));
app.use('/api/admin', require('../server/routes/admin'));
app.use('/api/clues', require('../server/routes/clues'));
app.use('/api/teams', require('../server/routes/teams'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cipher Case Server Running on Vercel', timestamp: new Date() });
});

module.exports = app;
