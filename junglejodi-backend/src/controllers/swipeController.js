import Swipe from '../models/Swipe.js';
import Match from '../models/Match.js';
import User from '../models/User.js';
import Animal from '../models/Animal.js';

// @desc    Record a swipe
// @route   POST /api/swipes
export const recordSwipe = async (req, res) => {
    const { swiped_user_id, direction } = req.body;
    const swiper_user_id = req.user._id;

    try {
        // Validate that swiped_user_id exists and is not the same as swiper
        if (swiped_user_id === swiper_user_id.toString()) {
            return res.status(400).json({ status: 'error', message: 'You cannot swipe on yourself' });
        }

        const targetUser = await User.findById(swiped_user_id);
        if (!targetUser) {
            return res.status(404).json({ status: 'error', message: 'Target user not found' });
        }

        // Check if already swiped
        const existingSwipe = await Swipe.findOne({ swiper_user_id, swiped_user_id });
        if (existingSwipe) {
            return res.status(409).json({ status: 'error', message: 'You have already swiped on this user' });
        }

        const swipe = await Swipe.create({
            swiper_user_id,
            swiped_user_id,
            direction
        });

        let is_match = false;
        let match_data = null;

        if (direction === 'right' || direction === 'super') {
            // Check if the target user has also swiped right on the current user
            const reverseSwipe = await Swipe.findOne({
                swiper_user_id: swiped_user_id,
                swiped_user_id: swiper_user_id,
                direction: { $in: ['right', 'super'] }
            });

            if (reverseSwipe) {
                is_match = true;
                // Create match
                const newMatch = await Match.create({
                    users: [swiper_user_id, swiped_user_id],
                    matched_animal_ids: [req.user.selected_animal_id, targetUser.selected_animal_id]
                });

                // Add to both users' matched arrays
                await User.findByIdAndUpdate(swiper_user_id, { $addToSet: { matched_animal_ids: targetUser.selected_animal_id } });
                await User.findByIdAndUpdate(swiped_user_id, { $addToSet: { matched_animal_ids: req.user.selected_animal_id } });

                const partnerAnimal = await Animal.findById(targetUser.selected_animal_id);
                console.log('Partner Animal:', partnerAnimal);
                const partner = {
                    _id: targetUser._id,
                    display_name: targetUser.display_name,
                    username: targetUser.username,
                    bio: targetUser.bio,
                    selected_animal_id: targetUser.selected_animal_id
                };

                match_data = {
                    match_id: newMatch._id,
                    message: `It's a match! You've formed an Expedition Party with ${targetUser.display_name}!`,
                    partner,
                    partner_animal: partnerAnimal
                };
            }
        }

        res.json({
            status: 'success',
            message: 'Swipe recorded',
            data: {
                swipe,
                is_match,
                match_data
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
