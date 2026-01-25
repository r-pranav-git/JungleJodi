import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import useAppStore from './store/useAppStore';
import ThemeSwitcher from './components/ThemeSwitcher';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Match from './pages/Match';
import ForestMap from './pages/ForestMap';
import { AnimatePresence, motion } from 'framer-motion';
import { Howl } from 'howler';

const forestSound = new Howl({
  src: ["/src/sounds/forest.mp3"],
  loop: true,
  volume: 0.15,
});

const Notification = () => {
  const { notification } = useAppStore();
  return (
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
  );
};

const Layout = ({ children }) => {
  const { theme } = useAppStore();

  return (
    <div className="font-sans min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
      <ThemeSwitcher />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <Notification />
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    // forestSound.play(); // Disabled basic sound for standard UI per request
    return () => forestSound.stop();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/matches" element={<Match />} />
                <Route path="/map" element={<ForestMap />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
      {!isHome && <Notification />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
