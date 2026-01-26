const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  // Two-way reference to users
  user_a_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  user_b_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Reference their chosen animals
  animal_a_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true
  },
  
  animal_b_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true
  },
  
  matched_at: {
    type: Date,
    default: Date.now
  },
  
  // Expedition status
  expedition_active: {
    type: Boolean,
    default: true
  },
  
  expedition_started_at: {
    type: Date,
    default: Date.now
  },
  
  // Simulated messages (not real-time)
  messages: [{
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    template: String,
    sent_at: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: false
});

// Compound index to prevent duplicate matches
matchSchema.index({ user_a_id: 1, user_b_id: 1 }, { unique: true });

// Index for finding a user's matches
matchSchema.index({
  $or: [
    { user_a_id: 1 },
    { user_b_id: 1 }
  ]
});

module.exports = mongoose.model('Match', matchSchema);