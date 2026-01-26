import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Animal from '../models/Animal.js';

dotenv.config();

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
    },
    {
        common_name: "Great Horned Owl",
        species_latin: "Bubo virginianus",
        profile_basics: {
            bio: "Silent hunter of the night with eyes like golden moons.",
            avatar_urls: [
                "https://api.dicebear.com/7.x/bottts/svg?seed=owl1",
                "https://api.dicebear.com/7.x/bottts/svg?seed=owl2"
            ],
            tags: ["Nocturnal", "Wise", "Silent"]
        },
        ecosystem_stats: {
            diet_type: "Carnivore",
            trophic_level: 4,
            activity_period: "Nocturnal",
            biome_role: "Apex Predator",
            aggression_score: 0.8
        },
        matching_profile: {
            compatible_diets: ["Carnivore"],
            compatible_trophic_levels: [3, 4],
            sleep_sync_start: "20:00",
            sleep_sync_end: "05:00",
            social_type: "Pair"
        },
        metadata: {
            rarity: "Uncommon",
            season_active: ["Spring", "Summer", "Fall", "Winter"]
        }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Animal.deleteMany({});
        const createdAnimals = await Animal.insertMany(animals);
        console.log(`✅ Seeded ${createdAnimals.length} animals!`);
        process.exit();
    } catch (error) {
        console.error(`❌ Error seeding database: ${error.message}`);
        process.exit(1);
    }
};

seedDB();
