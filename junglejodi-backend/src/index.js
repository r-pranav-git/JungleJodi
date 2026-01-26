import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import configureApp from './config/server.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Apply Express Config (Routes, Middleware)
configureApp(app);

app.listen(PORT, () => {
    console.log(`🚀 JungleJodi Backend running on http://localhost:${PORT}`);
});
