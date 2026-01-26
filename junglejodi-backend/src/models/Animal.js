import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
    common_name: { type: String, required: true },
    species_latin: { type: String, required: true },
    profile_basics: {
        bio: String,
        avatar_urls: [String],
        tags: [String]
    },
    ecosystem_stats: {
        diet_type: { type: String, enum: ['Herbivore', 'Carnivore', 'Omnivore'] },
        trophic_level: Number,
        activity_period: { type: String, enum: ['Diurnal', 'Nocturnal', 'Crepuscular'] },
        biome_role: String,
        aggression_score: { type: Number, min: 0, max: 1 }
    },
    matching_profile: {
        compatible_diets: [String],
        compatible_trophic_levels: [Number],
        sleep_sync_start: String,
        sleep_sync_end: String,
        social_type: { type: String, enum: ['Solitary', 'Pack', 'Pair', 'Herd'] }
    },
    metadata: {
        rarity: { type: String, enum: ['Common', 'Uncommon', 'Rare', 'Endangered'] },
        season_active: [String]
    }
}, { timestamps: true });

const Animal = mongoose.model('Animal', animalSchema);
export default Animal;
