const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rounds', require('./routes/rounds'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/clues', require('./routes/clues'));
app.use('/api/teams', require('./routes/teams'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cipher Case Server Running', timestamp: new Date() });
});

// Serve frontend in production if built locally
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API Route Not Found' });
  }
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Cipher Case API Running.');
    }
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` CIPHER CASE SERVER RUNNING ON PORT ${PORT}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
