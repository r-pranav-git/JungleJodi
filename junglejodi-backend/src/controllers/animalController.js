import mongoose from 'mongoose';
import Animal from '../models/Animal.js';

// @desc    Get available animals with filters
// @route   GET /api/animals
export const getAnimals = async (req, res) => {
    const { season, activity_period, night_mode, exclude_ids } = req.query;

    let query = {};

    if (season) {
        query['metadata.season_active'] = season;
    }

    if (night_mode === 'true') {
        query['ecosystem_stats.activity_period'] = 'Nocturnal';
    } else if (activity_period) {
        query['ecosystem_stats.activity_period'] = activity_period;
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
            query._id = { $nin: ids };
        }
    }

    const limitNum = parseInt(limit) || 12;

    try {
        const animals = await Animal.find(query).limit(limitNum);
        res.json({
            status: 'success',
            data: {
                animals,
                total: animals.length,
                has_more: false // Simplified for hackathon
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get single animal
// @route   GET /api/animals/:id
export const getAnimalById = async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) {
            return res.status(404).json({ status: 'error', message: 'Animal not found' });
        }
        res.json({ status: 'success', data: { animal } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
