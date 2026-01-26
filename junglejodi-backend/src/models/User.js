import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    secret_animal: { type: String, required: true },
    display_name: { type: String, required: true },
    selected_animal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },
    selected_avatar_url: String,
    territory_cell: {
        cell_id: String,
        layer: { type: String, enum: ['Canopy', 'Understory', 'Forest Floor'] },
        claimed_at: { type: Date, default: Date.now }
    },
    seeking_modes: [{ type: String, enum: ['Romance', 'Migration', 'Food', 'Food Pal'] }],
    matched_animal_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }],
    created_at: { type: Date, default: Date.now },
    last_login: Date,
    is_active: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
