const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/animals', require('./routes/animalRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/matches', require('./routes/matchRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'JungleJodi API is roaring! 🦁' });
});

// Connect DB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});