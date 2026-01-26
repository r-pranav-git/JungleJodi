import express from 'express';
import { getMe, updateTerritory, updatePreferences } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.patch('/territory', protect, updateTerritory);
router.patch('/preferences', protect, updatePreferences);

export default router;
