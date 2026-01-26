const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  common_name: {
    type: String,
    required: true,
    unique: true
  },
  species_latin: {
    type: String,
    required: true
  },
  
  profile_basics: {
    bio: {
      type: String,
      required: true,
      maxlength: 160
    },
    avatar_urls: {
      type: [String],
      required: true,
      validate: {
        validator: function(arr) {
          return arr.length >= 3 && arr.length <= 5;
        },
        message: 'Provide 3-5 avatar URLs'
      }
    },
    tags: [{
      type: String,
      maxlength: 12
    }]
  },
  
  ecosystem_stats: {
    diet_type: {
      type: String,
      required: true,
      enum: ['Herbivore', 'Carnivore', 'Omnivore']
    },
    trophic_level: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },
    activity_period: {
      type: String,
      required: true,
      enum: ['Diurnal', 'Nocturnal', 'Crepuscular']
    },
    biome_role: {
      type: String,
      required: true,
      maxlength: 50
    },
    aggression_score: {
      type: Number,
      required: true,
      min: 0.0,
      max: 1.0
    }
  },
  
  matching_profile: {
    compatible_diets: [{
      type: String,
      enum: ['Herbivore', 'Carnivore', 'Omnivore']
    }],
    compatible_trophic_levels: [{
      type: Number,
      min: 1,
      max: 4
    }],
    sleep_sync_start: {
      type: String,
      required: true,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    sleep_sync_end: {
      type: String,
      required: true,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    social_type: {
      type: String,
      required: true,
      enum: ['Solitary', 'Pack', 'Pair', 'Herd']
    }
  },
  
  metadata: {
    rarity: {
      type: String,
      enum: ['Common', 'Uncommon', 'Rare', 'Endangered'],
      default: 'Common'
    },
    season_active: [{
      type: String,
      enum: ['Spring', 'Summer', 'Fall', 'Winter']
    }]
  }
}, {
  timestamps: true
});

// Index for fast queries
animalSchema.index({ 'ecosystem_stats.diet_type': 1 });
animalSchema.index({ 'ecosystem_stats.activity_period': 1 });

module.exports = mongoose.model('Animal', animalSchema);