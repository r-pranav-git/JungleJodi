const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  
  password_hash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [4, 'Password must be at least 4 characters']
  },
  
  secret_animal: {
    type: String,
    required: [true, 'Secret animal is required for password recovery'],
    lowercase: true,
    trim: true
  },
  
  // Profile
  display_name: {
    type: String,
    required: [true, 'Display name is required'],
    maxlength: [25, 'Display name cannot exceed 25 characters'],
    trim: true
  },
  
  // Animal Reference
  selected_animal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: [true, 'You must select an animal']
  },
  
  selected_avatar_url: {
    type: String,
    required: true,
    validate: {
      validator: function(url) {
        return url.startsWith('https://api.dicebear.com/');
      },
      message: 'Avatar must be from DiceBear API'
    }
  },
  
  // Territory
  territory_cell: {
    cell_id: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^[A-H][1-6]$/.test(v);
        },
        message: 'Cell ID must be in A1-H6 format'
      }
    },
    layer: {
      type: String,
      required: true,
      enum: ['Canopy', 'Understory', 'Forest Floor']
    },
    claimed_at: {
      type: Date,
      default: Date.now
    }
  },
  
  // Matching Preferences
  seeking_modes: [{
    type: String,
    enum: ['Romance', 'Migration', 'Food'],
    default: ['Romance']
  }],
  
  // Matched Animals (store IDs for quick lookup)
  matched_animal_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal'
  }],
  
  // Activity
  last_login: {
    type: Date,
    default: Date.now
  },
  
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to verify password
userSchema.methods.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

// Method to check secret animal
userSchema.methods.verifySecretAnimal = function(secretAnimal) {
  return this.secret_animal.toLowerCase() === secretAnimal.toLowerCase().trim();
};

// Index for fast lookups
userSchema.index({ username: 1 });
userSchema.index({ 'territory_cell.cell_id': 1 });

module.exports = mongoose.model('User', userSchema);