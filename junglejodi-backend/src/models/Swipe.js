import mongoose from 'mongoose';

const swipeSchema = new mongoose.Schema({
    swiper_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    swiped_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    direction: { type: String, enum: ['left', 'right', 'super'], required: true },
    swiped_at: { type: Date, default: Date.now }
});

const Swipe = mongoose.model('Swipe', swipeSchema);
export default Swipe;
