import express from 'express';
import { getUsers, getMe, updateTerritory, updatePreferences } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/me', protect, getMe);
router.patch('/territory', protect, updateTerritory);
router.patch('/preferences', protect, updatePreferences);

export default router;
