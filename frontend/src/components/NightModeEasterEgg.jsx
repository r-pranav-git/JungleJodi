// frontend/src/components/NightModeEasterEgg.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const NightModeEasterEgg = ({ onActivate }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);

  const handleMoonClick = () => {
    setClickCount(prev => prev + 1);
    
    // Show hint on first click
    if (clickCount === 0) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    }

    // Activate on triple click
    if (clickCount >= 2) {
      setIsNightMode(true);
      onActivate();
      
      // Reset counter
      setClickCount(0);
    }

    // Reset counter after 2 seconds of inactivity
    setTimeout(() => setClickCount(0), 2000);
  };

  return (
    <div className="relative">
      {/* Moon Icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleMoonClick}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
        title="Click 3 times for night mode"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </motion.button>

      {/* Click Counter */}
      <AnimatePresence>
        {clickCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full 
              flex items-center justify-center text-xs font-bold text-black"
          >
            {clickCount}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Tooltip */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute bottom-12 right-0 bg-black/80 text-white text-xs 
              px-3 py-2 rounded-lg whitespace-nowrap"
          >
            Click {3 - clickCount} more time{clickCount < 2 ? 's' : ''} for night mode!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

NightModeEasterEgg.propTypes = {
  onActivate: PropTypes.func.isRequired,
};

export default NightModeEasterEgg;