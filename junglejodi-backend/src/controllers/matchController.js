import Match from '../models/Match.js';
import User from '../models/User.js';

// @desc    Get user's matches
// @route   GET /api/matches
export const getMatches = async (req, res) => {
    const { status } = req.query; // active, expired

    try {
        let query = { users: req.user._id };
        if (status === 'active') {
            query.expedition_active = true;
        } else if (status === 'expired') {
            query.expedition_active = false;
        }

        const matches = await Match.find(query)
            .populate('users', 'username display_name selected_avatar_url territory_cell')
            .populate('matched_animal_ids');

        // Format for frontend as per contract
        const formattedMatches = matches.map(m => {
            const partner = m.users.find(u => u._id.toString() !== req.user._id.toString());
            const partnerAnimal = m.matched_animal_ids.find(a => a._id.toString() !== req.user.selected_animal_id.toString());

            return {
                _id: m._id,
                matched_at: m.matched_at,
                expedition_active: m.expedition_active,
                expedition_started_at: m.expedition_started_at,
                partner: partner ? {
                    user_id: partner._id,
                    display_name: partner.display_name,
                    username: partner.username,
                    selected_avatar_url: partner.selected_avatar_url,
                    territory_cell: partner.territory_cell
                } : null,
                partner_animal: partnerAnimal,
                messages: m.messages.slice(-3) // last 3 messages
            };
        });

        res.json({
            status: 'success',
            data: {
                matches: formattedMatches,
                total: formattedMatches.length,
                has_more: false
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Send message
// @route   POST /api/matches/message
export const sendMessage = async (req, res) => {
    const { match_id, template } = req.body;

    try {
        const match = await Match.findById(match_id);
        if (!match) {
            return res.status(404).json({ status: 'error', message: 'Match not found' });
        }

        if (!match.users.includes(req.user._id)) {
            return res.status(403).json({ status: 'error', message: 'User is not part of this match' });
        }

        // 5 minute expiration check
        const now = new Date();
        const diffMinutes = (now - new Date(match.expedition_started_at)) / (1000 * 60);
        if (diffMinutes > 5) {
            match.expedition_active = false;
            await match.save();
            return res.status(409).json({ status: 'error', message: 'Expedition has expired' });
        }

        const message = {
            sender_id: req.user._id,
            template,
            sent_at: now,
            read: false
        };

        match.messages.push(message);
        await match.save();

        res.status(201).json({
            status: 'success',
            message: 'Message sent successfully',
            data: { message }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
