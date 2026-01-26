// frontend/src/components/SeasonToggle.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const SEASONS = [
  { id: 'Spring', icon: '🌸', label: 'Spring' },
  { id: 'Summer', icon: '☀️', label: 'Summer' },
  { id: 'Fall', icon: '🍂', label: 'Fall' },
  { id: 'Winter', icon: '❄️', label: 'Winter' },
];

const SeasonToggle = ({ currentSeason, onSeasonChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentSeasonData = SEASONS.find(s => s.id === currentSeason);

  const handleSeasonSelect = (season) => {
    onSeasonChange(season);
    setIsOpen(false);
    
    // Play season change sound
    const audio = new Audio('/sounds/season-change.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 
          text-2xl shadow-lg flex items-center justify-center hover:bg-white/30 transition-all"
        title="Change Season"
      >
        {currentSeasonData?.icon}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20"
            />
            
            {/* Season Options */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="absolute bottom-16 right-0 bg-black/40 backdrop-blur-lg rounded-2xl p-3 
                border border-white/20 shadow-xl min-w-48"
            >
              {SEASONS.map((season) => (
                <motion.button
                  key={season.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSeasonSelect(season.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 last:mb-0 
                    transition-all ${
                    season.id === currentSeason
                      ? 'bg-green-500/40 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{season.icon}</span>
                  <span className="font-medium">{season.label}</span>
                  
                  {season.id === currentSeason && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-green-400 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

SeasonToggle.propTypes = {
  currentSeason: PropTypes.string.isRequired,
  onSeasonChange: PropTypes.func.isRequired,
};

export default SeasonToggle;