// frontend/src/components/ExpeditionParty.jsx
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { X, Send, Users } from 'lucide-react';
import { useState } from 'react';
import { matchAPI } from '../utils/api';

const EXPEDITION_TEMPLATES = [
  { id: 'meet', text: '📍 Meet at my tree!', icon: '🌳' },
  { id: 'share', text: '🥜 Let\'s share nuts!', icon: '🥜' },
  { id: 'sunset', text: '🌅 Sunset gathering?', icon: '🌅' },
  { id: 'explore', text: '🔍 Explore together!', icon: '🔍' },
];

const ExpeditionParty = ({ match, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!selectedTemplate) return;
    
    setIsSending(true);
    try {
      await matchAPI.sendMessage({
        match_id: match.match_id,
        template: selectedTemplate.text,
      });
      
      // Close and show success
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!match) return null;

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
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full forest-card"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">Expedition Formed!</h2>
                <p className="text-white/60 text-sm">You've found a forest companion</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Match Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-lg">
            <img
              src={match.partner.selected_avatar_url}
              alt={match.partner.display_name}
              className="w-16 h-16 rounded-full border-2 border-green-400"
            />
            <div>
              <h3 className="text-white font-bold">{match.partner.display_name}</h3>
              <p className="text-white/60 text-sm">{match.partner_animal.common_name}</p>
              <p className="text-white/50 text-xs mt-1">
                Territory: {match.partner.territory_cell.cell_id}
              </p>
            </div>
          </div>

          {/* Quick Messages */}
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3">Quick Messages:</h4>
            <div className="space-y-2">
              {EXPEDITION_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'bg-green-500/30 border border-green-400'
                      : 'bg-white/10 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <span className="text-white">{template.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
              Maybe Later
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!selectedTemplate || isSending}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 
                rounded-lg text-white font-semibold flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

ExpeditionParty.propTypes = {
  match: PropTypes.shape({
    match_id: PropTypes.string.isRequired,
    partner: PropTypes.object.isRequired,
    partner_animal: PropTypes.object.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ExpeditionParty;