// frontend/src/components/ActiveMatchesModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { X, Users, MessageCircle } from 'lucide-react';

const ActiveMatchesModal = ({ matches, onClose, onMatchSelect }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full forest-card max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Active Expeditions
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Matches List */}
          <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
            {matches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/60">No active expeditions yet.</p>
                <p className="text-white/40 text-sm mt-1">Keep exploring to find matches!</p>
              </div>
            ) : (
              matches.map((match) => (
                <motion.button
                  key={match._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onMatchSelect(match)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 
                    hover:bg-white/10 border border-white/10 transition-all text-left"
                >
                  <img
                    src={match.partner.selected_avatar_url || '/api/placeholder/40/40'}
                    alt={match.partner.display_name}
                    className="w-12 h-12 rounded-full border-2 border-green-400"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate">
                      {match.partner.display_name}
                    </h3>
                    <p className="text-white/60 text-xs truncate">
                      {match.partner?.username ? `@${match.partner.username}` : 'Expedition Partner'}
                    </p>
                  </div>

                  <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

ActiveMatchesModal.propTypes = {
  matches: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    partner: PropTypes.object.isRequired,
    partner_animal: PropTypes.object,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
  onMatchSelect: PropTypes.func.isRequired,
};

export default ActiveMatchesModal;
