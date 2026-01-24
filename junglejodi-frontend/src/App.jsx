import { useState, useEffect } from 'react';
import useStore from './store/useStore';
import ThemeSwitcher from './components/ThemeSwitcher';
import ProfileForm from './components/ProfileForm';
import MatchCard from './components/MatchCard';
import InteractionModal from './components/InteractionModal';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Howl } from 'howler';

const forestSound = new Howl({
  src: ["/src/sounds/forest.mp3"],
  loop: true,
  volume: 0.15,
});

function App() {
  const { user, matches, theme, fetchMatches, isLoading, notification } = useStore();
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    forestSound.play();
    return () => forestSound.stop();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchMatches(user.id);
    }
  }, [user, fetchMatches]);

  const isNight = theme === 'night';

  return (
    <div className={`theme-${theme} font-sans transition-all duration-1000 overflow-x-hidden relative`}>
      {/* Background Mist/Particle Effect */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent" />
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-30 animate-pulse bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
      </div>

      <ThemeSwitcher />

      <main className="container mx-auto px-4 py-32 min-h-screen flex flex-col items-center relative z-20">
        {!user ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full flex justify-center mt-10"
          >
            <ProfileForm />
          </motion.div>
        ) : (
          <div className="w-full max-w-7xl">
            <header className="text-center mb-16 relative">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-block p-4 glass-card mb-6"
              >
                <Sparkles size={32} className="text-green-400 animate-pulse" />
              </motion.div>
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`text-7xl font-black mb-4 drop-shadow-2xl font-serif text-white`}
              >
                Hi, <span className="text-green-300 italic">{user.species}</span>!
              </motion.h1>
              <p className="text-xl text-white/80 font-bold uppercase tracking-[0.3em] ml-1">The Realm Awaits</p>
            </header>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-32 gap-6 glass-card shadow-2xl">
                <div className="relative">
                  <Loader2 className="animate-spin text-green-400" size={64} />
                  <div className="absolute inset-0 blur-xl bg-green-400/30 animate-pulse rounded-full" />
                </div>
                <p className="text-white font-black text-2xl tracking-widest uppercase text-glow">Channeling Ecosystem Spirits...</p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                <AnimatePresence>
                  {matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onInteract={setSelectedMatch}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {matches.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card-dark p-20 text-center text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <AlertCircle size={120} />
                </div>
                <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">The Wild is Silent</h3>
                <p className="text-lg opacity-60 font-bold max-w-md mx-auto">No compatible matches found in this realm. Try switching forest modes or wait for a nomad to pass through.</p>
              </motion.div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedMatch && (
          <InteractionModal
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: 100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 100, opacity: 0, x: '-50%' }}
            className="fixed bottom-12 left-1/2 bg-white/10 backdrop-blur-2xl text-white px-10 py-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] font-black text-lg flex items-center gap-4 border border-white/20 z-[200] active:scale-95 cursor-pointer select-none"
          >
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-green-500/40">✨</div>
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
