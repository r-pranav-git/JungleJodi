// frontend/src/components/AnimalCard.jsx
import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Heart, X, Info } from 'lucide-react';

const AnimalCard = ({ user, onSwipe }) => {
  const animal = user.selected_animal_id;
  const controls = useAnimation();
  const [isFlipped, setIsFlipped] = useState(false);

  // Swipe gesture configuration
  const handleDragEnd = async (event, info) => {
    const threshold = 100;
    const { offset, velocity } = info;

    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      const direction = offset.x > 0 ? 'right' : 'left';
      
      // Animate card offscreen
      await controls.start({
        x: direction === 'right' ? 1000 : -1000,
        rotate: direction === 'right' ? 30 : -30,
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
      });

      // Trigger swipe callback
      onSwipe(direction);
      
      // Play swipe sound
      const audio = new Audio(`/sounds/swipe-${direction}.mp3`);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } else {
      // Snap back to center
      controls.start({ x: 0, y: 0, rotate: 0 });
    }
  };

  const handleButtonSwipe = async (direction) => {
    await controls.start({
      x: direction === 'right' ? 500 : -500,
      rotate: direction === 'right' ? 20 : -20,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeOut' },
    });
    
    onSwipe(direction);
  };

  // Card flip for details
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-80 h-96 perspective-1000">
      <motion.div
        animate={controls}
        drag={!isFlipped}
        dragElastic={0.2}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.05 }}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ transformStyle: 'preserve-3d' }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of Card */}
        <div
          className="absolute inset-0 forest-card p-6 flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Animal Image */}
          <div className="flex-1 relative mb-4 overflow-hidden rounded-lg">
            <img
              src={animal.selected_avatar_url}
              alt={animal.display_name}
              className="w-full h-full object-cover"
            />
            
            {/* Rarity Badge */}
            {animal.metadata.rarity !== 'Common' && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                {animal.metadata.rarity}
              </div>
            )}
          </div>

          {/* Animal Info */}
          <div className="mb-4">
            <h3 className="text-white text-2xl font-bold mb-1">
              {user.display_name}
            </h3>
            <p className="text-white/60 text-sm italic mb-2">
              {animal.common_name}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {animal.profile_basics.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-white/20 rounded-full text-xs text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p className="text-white/80 text-sm">
              {animal.profile_basics.bio}
            </p>
          </div>

          {/* Ecosystem Stats */}
          <div className="bg-black/20 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
              <div>Diet: <span className="font-semibold text-white">{animal.ecosystem_stats.diet_type}</span></div>
              <div>Active: <span className="font-semibold text-white">{animal.ecosystem_stats.activity_period}</span></div>
              <div>Social: <span className="font-semibold text-white">{animal.matching_profile.social_type}</span></div>
              <div>Trophic: <span className="font-semibold text-white">Level {animal.ecosystem_stats.trophic_level}</span></div>
            </div>
          </div>

          {/* Swipe Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleButtonSwipe('left')}
              className="flex-1 py-3 bg-red-500/30 hover:bg-red-500/50 rounded-lg 
                text-white font-semibold flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Nah
            </button>

            <button
              onClick={handleFlip}
              className="px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg 
                text-white flex items-center justify-center"
            >
              <Info className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleButtonSwipe('right')}
              className="flex-1 py-3 bg-green-500/30 hover:bg-green-500/50 rounded-lg 
                text-white font-semibold flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              YIP!
            </button>
          </div>
        </div>

        {/* Back of Card (Details) */}
        <div
          className="absolute inset-0 forest-card p-6 flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <h3 className="text-white text-xl font-bold mb-4">Animal Facts</h3>
          
          <div className="space-y-3 text-white/80 text-sm">
            <div>
              <strong className="text-white">Sleep Schedule:</strong>
              <br />
              {animal.matching_profile.sleep_sync_start} - {animal.matching_profile.sleep_sync_end}
            </div>
            
            <div>
              <strong className="text-white">Compatible Diets:</strong>
              <br />
              {animal.matching_profile.compatible_diets.join(', ')}
            </div>
            
            <div>
              <strong className="text-white">Biome Role:</strong>
              <br />
              {animal.ecosystem_stats.biome_role}
            </div>

            <div>
              <strong className="text-white">Seasons Active:</strong>
              <br />
              {animal.metadata.season_active.join(', ')}
            </div>
          </div>

          <button
            onClick={handleFlip}
            className="mt-auto py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white"
          >
            Back to Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};

AnimalCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    display_name: PropTypes.string.isRequired,
    selected_animal_id: PropTypes.object.isRequired,
  }).isRequired,
  onSwipe: PropTypes.func.isRequired,
};

export default AnimalCard;