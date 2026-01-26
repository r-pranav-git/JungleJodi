const mongoose = require('mongoose');
const Animal = require('../models/Animal');
require('dotenv').config();

const animals = [
  {
    common_name: "Red Fox",
    species_latin: "Vulpes vulpes",
    profile_basics: {
      bio: "Clever opportunist with a taste for adventure and field mice.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=fox1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=fox2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=fox3"
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
    common_name: "Gray Wolf",
    species_latin: "Canis lupus",
    profile_basics: {
      bio: "Stoic pack leader with a haunting howl and deep loyalty.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=wolf1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=wolf2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=wolf3",
        "https://api.dicebear.com/7.x/bottts/svg?seed=wolf4"
      ],
      tags: ["Pack", "Hunter", "Wild"]
    },
    ecosystem_stats: {
      diet_type: "Carnivore",
      trophic_level: 4,
      activity_period: "Nocturnal",
      biome_role: "Apex Predator",
      aggression_score: 0.85
    },
    matching_profile: {
      compatible_diets: ["Carnivore"],
      compatible_trophic_levels: [4],
      sleep_sync_start: "07:00",
      sleep_sync_end: "19:00",
      social_type: "Pack"
    },
    metadata: {
      rarity: "Uncommon",
      season_active: ["Winter", "Spring"]
    }
  },
  {
    common_name: "Capybara",
    species_latin: "Hydrochoerus hydrochaeris",
    profile_basics: {
      bio: "The world's most chill giant rodent. Friend to all animals.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=capy1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=capy2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=capy3"
      ],
      tags: ["Chill", "Social", "Wetlands"]
    },
    ecosystem_stats: {
      diet_type: "Herbivore",
      trophic_level: 2,
      activity_period: "Diurnal",
      biome_role: "Wetland Grazer",
      aggression_score: 0.1
    },
    matching_profile: {
      compatible_diets: ["Herbivore", "Omnivore"],
      compatible_trophic_levels: [1, 2],
      sleep_sync_start: "20:00",
      sleep_sync_end: "06:00",
      social_type: "Herd"
    },
    metadata: {
      rarity: "Common",
      season_active: ["Summer", "Fall"]
    }
  },
  {
    common_name: "Snow Leopard",
    species_latin: "Panthera uncia",
    profile_basics: {
      bio: "The ghost of the mountains. Rare, beautiful, and elusive.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=snow1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=snow2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=snow3",
        "https://api.dicebear.com/7.x/bottts/svg?seed=snow4",
        "https://api.dicebear.com/7.x/bottts/svg?seed=snow5"
      ],
      tags: ["Rare", "Mountain", "Ghost"]
    },
    ecosystem_stats: {
      diet_type: "Carnivore",
      trophic_level: 4,
      activity_period: "Crepuscular",
      biome_role: "Mountain Apex",
      aggression_score: 0.7
    },
    matching_profile: {
      compatible_diets: ["Carnivore"],
      compatible_trophic_levels: [4],
      sleep_sync_start: "10:00",
      sleep_sync_end: "16:00",
      social_type: "Solitary"
    },
    metadata: {
      rarity: "Endangered",
      season_active: ["Winter", "Spring"]
    }
  },
  {
    common_name: "Red Panda",
    species_latin: "Ailurus fulgens",
    profile_basics: {
      bio: "Lover of bamboo and long naps in high branches.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=redp1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=redp2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=redp3"
      ],
      tags: ["Cute", "Bamboo", "Arboreal"]
    },
    ecosystem_stats: {
      diet_type: "Herbivore",
      trophic_level: 2,
      activity_period: "Nocturnal",
      biome_role: "Forest Grazer",
      aggression_score: 0.2
    },
    matching_profile: {
      compatible_diets: ["Herbivore"],
      compatible_trophic_levels: [1, 2],
      sleep_sync_start: "06:00",
      sleep_sync_end: "18:00",
      social_type: "Solitary"
    },
    metadata: {
      rarity: "Rare",
      season_active: ["Spring", "Fall"]
    }
  },
  {
    common_name: "Honey Badger",
    species_latin: "Mellivora capensis",
    profile_basics: {
      bio: "Fearless, thick-skinned, and notoriously grumpy.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=honey1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=honey2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=honey3"
      ],
      tags: ["Fearless", "Tough", "Wild"]
    },
    ecosystem_stats: {
      diet_type: "Omnivore",
      trophic_level: 3,
      activity_period: "Nocturnal",
      biome_role: "Small Predator",
      aggression_score: 1.0
    },
    matching_profile: {
      compatible_diets: ["Omnivore", "Carnivore"],
      compatible_trophic_levels: [3],
      sleep_sync_start: "05:00",
      sleep_sync_end: "19:00",
      social_type: "Solitary"
    },
    metadata: {
      rarity: "Uncommon",
      season_active: ["Summer", "Fall"]
    }
  },
  {
    common_name: "African Elephant",
    species_latin: "Loxodonta africana",
    profile_basics: {
      bio: "Wise giant with a powerful memory and a gentle soul.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=elephant1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=elephant2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=elephant3",
        "https://api.dicebear.com/7.x/bottts/svg?seed=elephant4"
      ],
      tags: ["Wise", "Giant", "Social"]
    },
    ecosystem_stats: {
      diet_type: "Herbivore",
      trophic_level: 2,
      activity_period: "Diurnal",
      biome_role: "Savanna Engineer",
      aggression_score: 0.4
    },
    matching_profile: {
      compatible_diets: ["Herbivore"],
      compatible_trophic_levels: [1, 2],
      sleep_sync_start: "22:00",
      sleep_sync_end: "04:00",
      social_type: "Herd"
    },
    metadata: {
      rarity: "Endangered",
      season_active: ["Spring", "Summer", "Fall", "Winter"]
    }
  },
  {
    common_name: "Great Horned Owl",
    species_latin: "Bubo virginianus",
    profile_basics: {
      bio: "The silent wings of the night. Very observant.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=owl1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=owl2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=owl3"
      ],
      tags: ["Silent", "Aerial", "Wise"]
    },
    ecosystem_stats: {
      diet_type: "Carnivore",
      trophic_level: 4,
      activity_period: "Nocturnal",
      biome_role: "Aerial Predator",
      aggression_score: 0.75
    },
    matching_profile: {
      compatible_diets: ["Carnivore"],
      compatible_trophic_levels: [3, 4],
      sleep_sync_start: "06:00",
      sleep_sync_end: "18:30",
      social_type: "Pair"
    },
    metadata: {
      rarity: "Common",
      season_active: ["Fall", "Winter"]
    }
  },
  {
    common_name: "Sea Otter",
    species_latin: "Enhydra lutris",
    profile_basics: {
      bio: "Enjoys holding hands and cracking shells on the belly.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=otter1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=otter2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=otter3",
        "https://api.dicebear.com/7.x/bottts/svg?seed=otter4",
        "https://api.dicebear.com/7.x/bottts/svg?seed=otter5"
      ],
      tags: ["Playful", "Aquatic", "Keystone"]
    },
    ecosystem_stats: {
      diet_type: "Carnivore",
      trophic_level: 3,
      activity_period: "Diurnal",
      biome_role: "Kelp Guardian",
      aggression_score: 0.3
    },
    matching_profile: {
      compatible_diets: ["Carnivore", "Omnivore"],
      compatible_trophic_levels: [2, 3],
      sleep_sync_start: "21:00",
      sleep_sync_end: "07:00",
      social_type: "Pack"
    },
    metadata: {
      rarity: "Endangered",
      season_active: ["Summer", "Spring"]
    }
  },
  {
    common_name: "Wolverine",
    species_latin: "Gulo gulo",
    profile_basics: {
      bio: "Small but mighty. Don't let the size fool you.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=wolv1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=wolv2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=wolv3"
      ],
      tags: ["Fierce", "Solitary", "Tough"]
    },
    ecosystem_stats: {
      diet_type: "Carnivore",
      trophic_level: 4,
      activity_period: "Nocturnal",
      biome_role: "Scavenger",
      aggression_score: 0.9
    },
    matching_profile: {
      compatible_diets: ["Carnivore"],
      compatible_trophic_levels: [3, 4],
      sleep_sync_start: "08:00",
      sleep_sync_end: "20:00",
      social_type: "Solitary"
    },
    metadata: {
      rarity: "Rare",
      season_active: ["Winter", "Spring"]
    }
  },
  {
    common_name: "Common Raven",
    species_latin: "Corvus corax",
    profile_basics: {
      bio: "Master of puzzles and gossip in the bird world.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=raven1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=raven2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=raven3",
        "https://api.dicebear.com/7.x/bottts/svg?seed=raven4"
      ],
      tags: ["Smart", "Gothic", "Aerial"]
    },
    ecosystem_stats: {
      diet_type: "Omnivore",
      trophic_level: 3,
      activity_period: "Diurnal",
      biome_role: "Scavenger",
      aggression_score: 0.5
    },
    matching_profile: {
      compatible_diets: ["Omnivore", "Herbivore"],
      compatible_trophic_levels: [1, 2, 3],
      sleep_sync_start: "19:00",
      sleep_sync_end: "05:00",
      social_type: "Pair"
    },
    metadata: {
      rarity: "Common",
      season_active: ["Spring", "Summer", "Fall", "Winter"]
    }
  },
  {
    common_name: "Grizzly Bear",
    species_latin: "Ursus arctos horribilis",
    profile_basics: {
      bio: "Loves salmon, berries, and very long winter naps.",
      avatar_urls: [
        "https://api.dicebear.com/7.x/bottts/svg?seed=bear1",
        "https://api.dicebear.com/7.x/bottts/svg?seed=bear2",
        "https://api.dicebear.com/7.x/bottts/svg?seed=bear3"
      ],
      tags: ["Strong", "Hibernator", "Big"]
    },
    ecosystem_stats: {
      diet_type: "Omnivore",
      trophic_level: 4,
      activity_period: "Diurnal",
      biome_role: "Keystone Predator",
      aggression_score: 0.8
    },
    matching_profile: {
      compatible_diets: ["Omnivore", "Carnivore"],
      compatible_trophic_levels: [3, 4],
      sleep_sync_start: "21:00",
      sleep_sync_end: "05:00",
      social_type: "Solitary"
    },
    metadata: {
      rarity: "Uncommon",
      season_active: ["Spring", "Summer", "Fall"]
    }
  }
];

const seedAnimals = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    
    // Clear existing
    await Animal.deleteMany({});
    console.log('Cleared existing animals');
    
    // Insert new
    await Animal.insertMany(animals);
    console.log('✅ 12 animals seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAnimals();