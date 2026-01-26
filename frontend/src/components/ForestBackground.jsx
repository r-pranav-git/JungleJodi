// frontend/src/components/ForestBackground.jsx
import { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const ForestBackground = ({ children, timeOfDay = 'auto' }) => {
  const [background, setBackground] = useState('day-spring');
  const [isNight, setIsNight] = useState(false);

  // Detect season based on current date
  const getCurrentSeason = () => {
    const month = new Date().getMonth(); // 0-11
    if (month >= 2 && month <= 4) return 'spring'; // March-May
    if (month >= 5 && month <= 7) return 'summer'; // June-August
    if (month >= 8 && month <= 10) return 'fall'; // September-November
    return 'winter'; // December-February
  };

  // Detect time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) return 'night';
    if (hour >= 6 && hour < 12) return 'morning';
    return 'day';
  };

  useEffect(() => {
    const season = getCurrentSeason();
    const time = timeOfDay === 'auto' ? getTimeOfDay() : timeOfDay;
    
    setIsNight(time === 'night');
    setBackground(`${time}-${season}`);
  }, [timeOfDay]);

  // Background gradient configurations
  const bgConfigs = {
    'day-spring': 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 50%, #228B22 100%)',
    'morning-spring': 'linear-gradient(to bottom, #FFE4B5 0%, #F0E68C 50%, #9ACD32 100%)',
    'night-spring': 'linear-gradient(to bottom, #191970 0%, #000080 50%, #000000 100%)',
    'day-summer': 'linear-gradient(to bottom, #00BFFF 0%, #32CD32 50%, #006400 100%)',
    'night-summer': 'linear-gradient(to bottom, #000033 0%, #000066 50%, #000000 100%)',
    'day-fall': 'linear-gradient(to bottom, #FFA500 0%, #FF8C00 50%, #8B4513 100%)',
    'night-fall': 'linear-gradient(to bottom, #2F1B14 0%, #4B2F20 50%, #000000 100%)',
    'day-winter': 'linear-gradient(to bottom, #E0FFFF 0%, #B0C4DE 50%, #F0F8FF 100%)',
    'night-winter': 'linear-gradient(to bottom, #0F1419 0%, #1C2833 50%, #000000 100%)',
  };

  // Forest silhouette overlay
  const forestSilhouette = {
    opacity: isNight ? 0.8 : 0.4,
    backgroundImage: `
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><path d="M0,600 Q300,400 600,500 T1200,600 L1200,800 L0,800 Z" fill="black" opacity="0.3"/></svg>')
    `,
    backgroundPosition: 'bottom center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={background}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            background: bgConfigs[background],
            filter: isNight ? 'brightness(0.7)' : 'brightness(1)',
          }}
        />
      </AnimatePresence>

      {/* Forest silhouette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={forestSilhouette}
      />

      {/* Floating particles for ambience */}
      <AnimatePresence>
        {isNight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Fireflies */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`firefly-${i}`}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Season indicator */}
      <motion.div
        className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-white font-medium">
          {background.split('-')[1].toUpperCase()} 🌲
        </span>
      </motion.div>

      {/* Children content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

ForestBackground.propTypes = {
  children: PropTypes.node.isRequired,
  timeOfDay: PropTypes.oneOf(['auto', 'day', 'night', 'morning']),
};

export default memo(ForestBackground);