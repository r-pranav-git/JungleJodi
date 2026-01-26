const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
  swiper_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  swiped_animal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
    index: true
  },
  
  direction: {
    type: String,
    required: true,
    enum: ['left', 'right', 'super']
  },
  
  swiped_at: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false // We have swiped_at
});

// Compound index for efficient matching queries
swipeSchema.index({ swiper_user_id: 1, swiped_animal_id: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);