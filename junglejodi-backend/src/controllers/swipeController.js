import Swipe from '../models/Swipe.js';
import Match from '../models/Match.js';
import User from '../models/User.js';

// @desc    Record a swipe
// @route   POST /api/swipes
export const recordSwipe = async (req, res) => {
    const { animal_id, direction } = req.body;
    const swiper_user_id = req.user._id;

    try {
        // Check if already swiped
        const existingSwipe = await Swipe.findOne({ swiper_user_id, swiped_animal_id: animal_id });
        if (existingSwipe) {
            return res.status(409).json({ status: 'error', message: 'You have already swiped on this animal' });
        }

        const swipe = await Swipe.create({
            swiper_user_id,
            swiped_animal_id: animal_id,
            direction
        });

        let is_match = false;
        let match_data = null;

        if (direction === 'right' || direction === 'super') {
            // Check for match
            // Find user(s) who own this animal_id
            const targetUsers = await User.find({ selected_animal_id: animal_id });

            for (const targetUser of targetUsers) {
                // Check if targetUser has swiped right on swiper's animal
                const reverseSwipe = await Swipe.findOne({
                    swiper_user_id: targetUser._id,
                    swiped_animal_id: req.user.selected_animal_id,
                    direction: { $in: ['right', 'super'] }
                });

                if (reverseSwipe) {
                    is_match = true;
                    // Create match
                    const newMatch = await Match.create({
                        users: [swiper_user_id, targetUser._id],
                        matched_animal_ids: [req.user.selected_animal_id, animal_id]
                    });

                    // Add to both users' matched arrays
                    await User.findByIdAndUpdate(swiper_user_id, { $addToSet: { matched_animal_ids: animal_id } });
                    await User.findByIdAndUpdate(targetUser._id, { $addToSet: { matched_animal_ids: req.user.selected_animal_id } });

                    match_data = {
                        match_id: newMatch._id,
                        message: `It's a match! You've formed an Expedition Party with ${targetUser.display_name}!`
                    };
                    break;
                }
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
