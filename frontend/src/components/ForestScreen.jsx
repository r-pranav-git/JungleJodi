// frontend/src/components/ForestScreen.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ForestBackground from './ForestBackground';
import Soundscape from './Soundscape';
import TerritoryMap from './TerritoryMap';
import AnimalCard from './AnimalCard';
import SeasonToggle from './SeasonToggle';
import ExpeditionBadge from './ExpeditionBadge';
import NightModeEasterEgg from './NightModeEasterEgg';
import MatchBurst from './MatchBurst';
import ExpeditionParty from './ExpeditionParty';
import ActiveMatchesModal from './ActiveMatchesModal';
import { animalAPI, matchAPI, userAPI } from '../utils/api';
import { LogOut, Settings, Moon } from 'lucide-react';

const ForestScreen = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [currentSeason, setCurrentSeason] = useState('Spring');
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [showMatchBurst, setShowMatchBurst] = useState(false);
  const [newMatch, setNewMatch] = useState(null);
  const [activeMatches, setActiveMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showActiveMatchesModal, setShowActiveMatchesModal] = useState(false);
  const [showExpedition, setShowExpedition] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  // Initialize night mode based on current time
  const [nightMode, setNightMode] = useState(() => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  });



  // Determine current season
  const getSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  };

  // Load animals for swipe deck
  const loadAnimals = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userAPI.getUsers({
        season: currentSeason,
        exclude_ids: user?.matched_animal_ids?.join(',') || ''
      });
      setAnimals(response.data.users);
      setCurrentAnimalIndex(0);
    } catch (error) {
      console.error('Failed to load animals:', error);
      setAnimals([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentSeason, user?.matched_animal_ids]);

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  // Load active matches
  const loadMatches = useCallback(async () => {
    try {
      const response = await matchAPI.getMatches({ status: 'active' });
      setActiveMatches(response.data.matches);
    } catch (error) {
      console.error('Failed to load matches:', error);
    }
  }, []);

  useEffect(() => {
    loadMatches();
    // Refresh matches periodically
    const interval = setInterval(loadMatches, 30000);
    return () => clearInterval(interval);
  }, [loadMatches]);

  // Handle swipe and match detection
  const handleSwipe = async (direction) => {
    if (isLoading || animals.length === 0) return;

    const currentAnimal = animals[currentAnimalIndex];
    
    try {
      const response = await matchAPI.swipe({
        swiped_user_id: currentAnimal._id,
        direction,
      });

      // Check if it was a match
      if (response.data.is_match) {
        setNewMatch(response.data.match_data);
        setShowMatchBurst(true);
        loadMatches(); // Refresh matches list
        
        // Auto-hide burst after 3 seconds
        setTimeout(() => {
          setShowMatchBurst(false);
          setSelectedMatch(response.data.match_data);
          setShowExpedition(true);
        }, 3000);
      }

      // Move to next card
      setCurrentAnimalIndex(prev => prev + 1);
      
    } catch (error) {
      console.error('Swipe failed:', error);
    }
  };

  // Handle territory change
  const handleTerritoryChange = async (cellId) => {
    try {
      await userAPI.updateTerritory({
        cell_id: cellId,
        layer: 'Forest Floor', // Simplified
      });
      // Refresh user data
      const { userAPI: userApi } = await import('../utils/api');
      await user.getMe();
    } catch (error) {
      console.error('Failed to update territory:', error);
    }
  };

  // Night mode toggle (easter egg)
  const handleNightModeToggle = () => {
    setNightMode(!nightMode);
    // Reload animals with night filter
    loadAnimals();
  };

  if (isLoading && animals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">🌲 Loading Forest...</div>
      </div>
    );
  }

  return (
    <ForestBackground timeOfDay={nightMode ? 'night' : 'day'}>
      <Soundscape isEnabled={soundEnabled} season={currentSeason} />
      
      {/* Top Navigation Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-sm p-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user?.selected_avatar_url}
              alt="Your Avatar"
              className="w-10 h-10 rounded-full border-2 border-green-400"
            />
            <div>
              <h1 className="text-white font-bold">{user?.display_name}</h1>
              <p className="text-white/60 text-sm">Territory: {user?.territory_cell?.cell_id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Night Mode Easter Egg Trigger */}
            <NightModeEasterEgg onActivate={handleNightModeToggle} />
            
            {/* Expedition Badge */}
            <ExpeditionBadge 
              count={activeMatches.length}
              onClick={() => setShowActiveMatchesModal(true)} 
            />

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            {/* Settings */}
            <button
              onClick={() => alert('Settings coming soon!')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Territory Map (Left Side) */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <TerritoryMap
              userCell={user?.territory_cell?.cell_id}
              onCellSelect={handleTerritoryChange}
            />
          </motion.div>

          {/* Animal Card Stack (Center) */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 flex flex-col items-center justify-center min-h-96"
          >
            {animals.length > currentAnimalIndex ? (
              <AnimatePresence mode="wait">
                <AnimalCard
                  key={animals[currentAnimalIndex]._id}
                  user={animals[currentAnimalIndex]}
                  onSwipe={handleSwipe}
                />
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-white"
              >
                <h2 className="text-2xl font-bold mb-4">🌲 You're all caught up!</h2>
                <p className="text-white/80 mb-6">Come back later for more forest friends</p>
                <button
                  onClick={loadAnimals}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Refresh Animals 🔄
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Season Toggle (Floating Action Button) */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "Spring" }}
        className="fixed bottom-24 right-4 z-40"
      >
        <SeasonToggle
          currentSeason={currentSeason}
          onSeasonChange={setCurrentSeason}
        />
      </motion.div>

      {/* Match Burst Animation */}
      <AnimatePresence>
        {showMatchBurst && (
          <MatchBurst
            onComplete={() => {
              setShowMatchBurst(false);
              setTimeout(() => setShowExpedition(true), 500);
            }}
          />
        )}
      </AnimatePresence>

      {/* Active Matches Modal */}
      {showActiveMatchesModal && (
        <ActiveMatchesModal
          matches={activeMatches}
          onClose={() => setShowActiveMatchesModal(false)}
          onMatchSelect={(match) => {
            setSelectedMatch(match);
            setShowActiveMatchesModal(false);
            setShowExpedition(true);
          }}
        />
      )}

      {/* Expedition Party Modal */}
      <AnimatePresence>
        {showExpedition && selectedMatch && (
          <ExpeditionParty
            match={selectedMatch}
            onClose={() => {
              setShowExpedition(false);
              setSelectedMatch(null);
            }}
          />
        )}
      </AnimatePresence>
    </ForestBackground>
  );
};

export default ForestScreen;