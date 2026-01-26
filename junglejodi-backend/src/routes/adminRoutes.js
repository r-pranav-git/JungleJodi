import express from 'express';
import Animal from '../models/Animal.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Seed animals (Development Only)
// @route   POST /api/admin/seed-animals
router.post('/seed-animals', protect, async (req, res) => {
    // In a real app, we'd check req.user.isAdmin
    const animals = [
        {
            common_name: "Red Fox",
            species_latin: "Vulpes vulpes",
            profile_basics: {
                bio: "Clever opportunist with a taste for adventure and field mice.",
                avatar_urls: [
                    "https://api.dicebear.com/7.x/bottts/svg?seed=fox1",
                    "https://api.dicebear.com/7.x/bottts/svg?seed=fox2"
                ],
                tags: ["Clever", "Crepuscular", "Orange"]
            },
            ecosystem_stats: {
                diet_type: "Omnivore",
                trophic_level: 3,
                activity_period: "Crepuscular",
                biome_role: "Forest Predator",
                aggression_score: 0.6
            },
            matching_profile: {
                compatible_diets: ["Omnivore", "Herbivore"],
                compatible_trophic_levels: [2, 3],
                sleep_sync_start: "18:00",
                sleep_sync_end: "06:00",
                social_type: "Solitary"
            },
            metadata: {
                rarity: "Common",
                season_active: ["Spring", "Summer", "Fall", "Winter"]
            }
        },
        {
            common_name: "Gray Squirrel",
            species_latin: "Sciurus carolinensis",
            profile_basics: {
                bio: "Nut enthusiast and tree parkour expert.",
                avatar_urls: [
                    "https://api.dicebear.com/7.x/bottts/svg?seed=squirrel1",
                    "https://api.dicebear.com/7.x/bottts/svg?seed=squirrel2"
                ],
                tags: ["Energetic", "Diurnal", "Acrobatic"]
            },
            ecosystem_stats: {
                diet_type: "Herbivore",
                trophic_level: 2,
                activity_period: "Diurnal",
                biome_role: "Seed Disperser",
                aggression_score: 0.2
            },
            matching_profile: {
                compatible_diets: ["Herbivore"],
                compatible_trophic_levels: [2],
                sleep_sync_start: "06:00",
                sleep_sync_end: "18:00",
                social_type: "Solitary"
            },
            metadata: {
                rarity: "Common",
                season_active: ["Spring", "Summer", "Fall", "Winter"]
            }
        }
    ];

    try {
        await Animal.deleteMany({});
        const created = await Animal.insertMany(animals);
        res.status(201).json({
            status: "success",
            message: `${created.length} animals seeded successfully`,
            data: { count: created.length }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default router;
