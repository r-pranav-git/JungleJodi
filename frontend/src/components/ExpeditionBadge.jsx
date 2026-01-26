// frontend/src/components/ExpeditionBadge.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { Users } from 'lucide-react';
import { matchAPI } from '../utils/api';

const ExpeditionBadge = ({ onClick }) => {
  const [activeMatches, setActiveMatches] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadMatches = async () => {
    try {
      const response = await matchAPI.getMatches({ status: 'active' });
      setActiveMatches(response.data.matches.length);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <AnimatePresence>
      {activeMatches > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className="relative p-2 rounded-lg bg-green-500/30 hover:bg-green-500/50 
            text-white border border-green-400/50"
          title="Expedition Parties"
        >
          <Users className="w-5 h-5" />
          
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full 
              flex items-center justify-center text-xs font-bold text-black"
          >
            {activeMatches}
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

ExpeditionBadge.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ExpeditionBadge;