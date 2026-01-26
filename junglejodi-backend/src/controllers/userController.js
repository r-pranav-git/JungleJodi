import User from '../models/User.js';
import Animal from '../models/Animal.js';
import mongoose from 'mongoose';

// @desc    Get users with their selected animals (filtered by animal criteria)
// @route   GET /api/users
export const getUsers = async (req, res) => {
    const { season, activity_period, night_mode, exclude_ids, limit } = req.query;

    let animalQuery = {};

    if (season) {
        animalQuery['metadata.season_active'] = season;
    }

    if (night_mode === 'true') {
        animalQuery['ecosystem_stats.activity_period'] = 'Nocturnal';
    } else if (activity_period) {
        animalQuery['ecosystem_stats.activity_period'] = activity_period;
    }

    if (exclude_ids) {
        const ids = exclude_ids.split(',').map(id => {
            try {
                return new mongoose.Types.ObjectId(id.trim());
            } catch (e) {
                return null;
            }
        }).filter(id => id !== null);

        if (ids.length > 0) {
            animalQuery._id = { $nin: ids };
        }
    }

    const limitNum = parseInt(limit) || 12;

    try {
        // Find animals matching the criteria
        const animals = await Animal.find(animalQuery).limit(limitNum);
        const animalIds = animals.map(animal => animal._id);

        // Find users with selected animals in the filtered list, excluding current user
        const users = await User.find({
            _id: { $ne: req.user._id },
            selected_animal_id: { $in: animalIds }
        }).populate('selected_animal_id').select('-password_hash');

        res.json({
            status: 'success',
            data: {
                users,
                total: users.length,
                has_more: false // Simplified for hackathon
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/users/me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password_hash');
        res.json({ status: 'success', data: { user } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Update territory
// @route   PATCH /api/users/territory
export const updateTerritory = async (req, res) => {
    const { cell_id, layer } = req.body;

    // Validation
    if (!/^[A-H][1-6]$/.test(cell_id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid cell format' });
    }

    try {
        const user = await User.findById(req.user._id);

        // Rate limit check: one move per hour (simple check)
        const lastClaimed = new Date(user.territory_cell.claimed_at);
        const now = new Date();
        const diffHours = (now - lastClaimed) / (1000 * 60 * 60);

        if (diffHours < 1 && user.territory_cell.cell_id) {
            // Skip check for first time setup if needed, but here we follow the rule
            // Actually, during register they set it. Let's assume they can only move once an hour after that.
            // For hackathon, maybe less restrictive? But contract says 1 hour.
            return res.status(429).json({ status: 'error', message: 'You can only move your den once per hour. Try again later.' });
        }

        user.territory_cell = {
            cell_id,
            layer,
            claimed_at: now
        };

        await user.save();
        res.json({
            status: 'success',
            message: 'Territory updated successfully',
            data: { territory_cell: user.territory_cell }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Update preferences
// @route   PATCH /api/users/preferences
export const updatePreferences = async (req, res) => {
    const { seeking_modes } = req.body;
    try {
        const user = await User.findById(req.user._id);
        user.seeking_modes = seeking_modes;
        await user.save();
        res.json({
            status: 'success',
            message: 'Preferences updated successfully',
            data: { seeking_modes: user.seeking_modes }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
