import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    template: { type: String, required: true },
    sent_at: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

const matchSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    matched_animal_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }],
    matched_at: { type: Date, default: Date.now },
    expedition_active: { type: Boolean, default: true },
    expedition_started_at: { type: Date, default: Date.now },
    messages: [messageSchema]
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);
export default Match;
