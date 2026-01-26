// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import ForestScreen from './components/ForestScreen';
import { useEffect } from 'react';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-white text-xl">🌲 Loading...</div>
    </div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  // Preload critical sounds
  useEffect(() => {
    const audio = new Audio('/sounds/forest-ambient.mp3');
    audio.load();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route 
            path="/forest" 
            element={
              <PrivateRoute>
                <ForestScreen />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;