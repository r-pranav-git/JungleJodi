// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
// import ForestScreen from './components/ForestScreen';
// import { AuthProvider, useAuth } from './context/AuthContext';

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/" />;
// };

function App() {
  return (
    // <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          {/* <Route 
            path="/forest" 
            element={
              <PrivateRoute>
                <ForestScreen />
              </PrivateRoute>
            } 
          /> */}
        </Routes>
      </BrowserRouter>
    // </AuthProvider>
  );
}

export default App;