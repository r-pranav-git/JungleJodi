import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Routes
import authRoutes from '../routes/authRoutes.js';
import animalRoutes from '../routes/animalRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import swipeRoutes from '../routes/swipeRoutes.js';
import matchRoutes from '../routes/matchRoutes.js';
import adminRoutes from '../routes/adminRoutes.js';

const configureApp = (app) => {
    // Middleware
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    }));
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/animals', animalRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/swipes', swipeRoutes);
    app.use('/api/matches', matchRoutes);
    app.use('/api/admin', adminRoutes);

    // Health Check
    app.get('/api/health', (req, res) => {
        const dbStatus = mongoose.connection.readyState;
        const statusMap = {
            0: 'Disconnected',
            1: 'Connected',
            2: 'Connecting',
            3: 'Disconnecting',
            99: 'Uninitialized'
        };

        res.json({
            status: dbStatus === 1 ? 'success' : 'warning',
            message: dbStatus === 1 ? 'JungleJodi API is roaring! 🦁' : 'API is up, but Jungle is sleeping (DB disconnected) 😴',
            data: {
                timestamp: new Date(),
                database: statusMap[dbStatus] || 'Unknown',
                hint: dbStatus !== 1 ? 'Check your MongoDB Atlas IP whitelist or DNS settings.' : null
            }
        });
    });

    app.get('/', (req, res) => {
        res.send('🌲 JungleJodi Backend is running!');
    });
};

export default configureApp;
