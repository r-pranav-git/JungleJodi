import express from 'express';
import { getMatches, sendMessage } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Match Routes (Mounted as /api/matches in server.js)
router.get('/', protect, getMatches);
router.post('/message', protect, sendMessage);

export default router;
