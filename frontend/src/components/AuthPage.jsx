// frontend/src/components/AuthPage.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ForestBackground from './ForestBackground';
import Soundscape from './Soundscape';
// import { authAPI, animalAPI, userAPI } from '../utils/api';
import { Eye, EyeOff, ChevronLeft, Volume2, VolumeX } from 'lucide-react';

// Reusable UI components
const Input = ({ label, type = 'text', error, ...props }) => (
  <div className="mb-4">
    <label className="block text-white/90 text-sm font-medium mb-2">
      {label}
    </label>
    <input
      type={type}
      className={`w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm 
        border ${error ? 'border-red-400' : 'border-white/30'} 
        text-white placeholder-white/60 focus:outline-none focus:ring-2 
        focus:ring-green-400 focus:border-transparent`}
      {...props}
    />
    {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-white/20 hover:bg-white/30 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  return (
    <button
      className={`px-6 py-3 rounded-lg font-semibold transition-all 
        transform hover:scale-105 active:scale-95 ${variants[variant]} 
        ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Step screens extracted out of AuthPage to keep stable component identity ---
// If these are defined inside AuthPage, each keystroke redefines them, which can
// cause React to unmount/remount and lose input focus (and re-run animations).

const AuthGate = ({ onRegister, onLogin }) => (
  <motion.div
    key="gate"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="flex flex-col items-center justify-center min-h-screen p-8"
  >
    <motion.h1
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-6xl font-bold text-white mb-4 text-center"
    >
      🌲 JungleJodi
    </motion.h1>
    
    <motion.p
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-white/80 text-lg mb-12 text-center max-w-md"
    >
      Find your perfect forest companion
    </motion.p>

    <div className="flex gap-6 flex-col sm:flex-row">
      <Button
        variant="primary"
        size="lg"
        onClick={onRegister}
        className="px-8 py-4 text-lg"
      >
        🌱 New to Forest
      </Button>
      
      <Button
        variant="secondary"
        size="lg"
        onClick={onLogin}
        className="px-8 py-4 text-lg"
      >
        🦊 Return to Den
      </Button>
    </div>
  </motion.div>
);

const RegisterForm = ({
  goBack,
  formData,
  formErrors,
  handleChange,
  handleRegister,
  isLoading,
}) => (
  <motion.div
    key="register"
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -300, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="max-w-md mx-auto px-8 py-12"
  >
    <button
      onClick={goBack}
      className="flex items-center text-white/70 hover:text-white mb-6"
    >
      <ChevronLeft className="w-4 h-4 mr-1" /> Back
    </button>

    <h2 className="text-3xl font-bold text-white mb-6">Create Your Den</h2>
    
    <Input
      label="Username"
      name="username"
      value={formData.username}
      onChange={handleChange}
      error={formErrors.username}
      placeholder="e.g., sly_fox_42"
      autoComplete="username"
    />

    <Input
      label="Password"
      name="password"
      type="password"
      value={formData.password}
      onChange={handleChange}
      error={formErrors.password}
      placeholder="Min 4 characters"
      autoComplete="new-password"
    />

    <Input
      label="Confirm Password"
      name="confirmPassword"
      type="password"
      value={formData.confirmPassword}
      onChange={handleChange}
      error={formErrors.confirmPassword}
      placeholder="Re-enter password"
    />

    <Input
      label="Display Name"
      name="displayName"
      value={formData.displayName}
      onChange={handleChange}
      error={formErrors.displayName}
      placeholder="What should we call you?"
    />

    <Input
      label="Secret Animal"
      name="secretAnimal"
      value={formData.secretAnimal}
      onChange={handleChange}
      error={formErrors.secretAnimal}
      placeholder="e.g., bluewhale (for password reset)"
      helperText="Remember this! It's your backup key"
    />

    {formErrors.general && (
      <div className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg mb-4">
        {formErrors.general}
      </div>
    )}

    <Button
      onClick={handleRegister}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? 'Creating Den...' : 'Create Den 🦊'}
    </Button>
  </motion.div>
);

const LoginForm = ({
  goBack,
  formData,
  formErrors,
  handleChange,
  handleLogin,
  onForgot,
  isLoading,
}) => (
  <motion.div
    key="login"
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -300, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="max-w-md mx-auto px-8 py-12"
  >
    <button
      onClick={goBack}
      className="flex items-center text-white/70 hover:text-white mb-6"
    >
      <ChevronLeft className="w-4 h-4 mr-1" /> Back
    </button>

    <h2 className="text-3xl font-bold text-white mb-6">Welcome Back to Your Den</h2>
    
    <Input
      label="Username"
      name="username"
      value={formData.username}
      onChange={handleChange}
      error={formErrors.username}
      placeholder="Enter your username"
    />

    <Input
      label="Password"
      name="password"
      type="password"
      value={formData.password}
      onChange={handleChange}
      error={formErrors.password}
      placeholder="Enter your password"
    />

    {formErrors.general && (
      <div className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg mb-4">
        {formErrors.general}
      </div>
    )}

    <div className="flex gap-3">
      <Button
        onClick={handleLogin}
        disabled={isLoading}
        className="flex-1"
      >
        {isLoading ? 'Entering Den...' : 'Enter Den 🦊'}
      </Button>

      <Button
        variant="secondary"
        onClick={onForgot}
        className="flex-1"
      >
        Forgot Key?
      </Button>
    </div>
  </motion.div>
);

const AnimalSelection = ({
  goBack,
  animals,
  selectedAnimal,
  selectedAvatar,
  onAnimalSelect,
  onAvatarSelect,
  onContinue,
}) => (
  <motion.div
    key="animal-selection"
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -300, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="max-w-4xl mx-auto px-8 py-12"
  >
    <button
      onClick={goBack}
      className="flex items-center text-white/70 hover:text-white mb-6"
    >
      <ChevronLeft className="w-4 h-4 mr-1" /> Back
    </button>

    <h2 className="text-3xl font-bold text-white mb-6">
      {selectedAnimal ? 'Choose Your Look' : 'Choose Your Animal Spirit'}
    </h2>

    {!selectedAnimal ? (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {animals.map((animal) => (
          <motion.div
            key={animal._id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnimalSelect(animal)}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 cursor-pointer 
              hover:bg-white/20 transition-all border border-white/20"
          >
            <img
              src={animal.profile_basics.avatar_urls[0]}
              alt={animal.common_name}
              className="w-16 h-16 mx-auto mb-2 rounded-full"
            />
            <h3 className="text-white font-semibold text-sm text-center">
              {animal.common_name}
            </h3>
            <p className="text-white/60 text-xs text-center">
              {animal.profile_basics.tags.slice(0, 2).join(', ')}
            </p>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="text-center">
        <h3 className="text-2xl text-white mb-6">{selectedAnimal.common_name}</h3>
        
        <div className="flex justify-center gap-4 mb-8">
          {selectedAnimal.profile_basics.avatar_urls.map((url, idx) => (
            <motion.img
              key={url}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAvatarSelect(url)}
              src={url}
              alt={`Avatar ${idx + 1}`}
              className={`w-20 h-20 rounded-full cursor-pointer border-4 
                ${selectedAvatar === url ? 'border-green-400' : 'border-white/20'}`}
            />
          ))}
        </div>

        <Button
          onClick={onContinue}
          disabled={!selectedAvatar}
          className="px-8 py-3"
        >
          {selectedAvatar ? 'Continue to Territory 🗺️' : 'Select an Avatar First'}
        </Button>
      </div>
    )}
  </motion.div>
);

const TerritoryClaim = ({
  goBack,
  territoryCell,
  onTerritoryClaim,
  onContinue,
}) => (
  <motion.div
    key="territory"
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -300, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="max-w-2xl mx-auto px-8 py-12"
  >
    <button
      onClick={goBack}
      className="flex items-center text-white/70 hover:text-white mb-6"
    >
      <ChevronLeft className="w-4 h-4 mr-1" /> Back
    </button>

    <h2 className="text-3xl font-bold text-white mb-6">Claim Your Territory</h2>
    <p className="text-white/80 mb-6">Choose a cell on the forest map to make your den</p>

    <div className="grid grid-cols-4 gap-2 mb-8 bg-green-900/30 p-4 rounded-lg">
      {['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 
        'C1', 'C2', 'C3', 'C4'].map((cell) => (
        <motion.button
          key={cell}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTerritoryClaim(cell)}
          className={`aspect-square rounded-lg flex items-center justify-center 
            text-white font-bold transition-all ${
            territoryCell === cell
              ? 'bg-green-600 ring-4 ring-green-300'
              : 'bg-white/10 hover:bg-white/20 border border-white/20'
          }`}
        >
          {cell}
        </motion.button>
      ))}
    </div>

    <Button
      onClick={onContinue}
      disabled={!territoryCell}
      className="w-full"
    >
      {territoryCell ? `Claim ${territoryCell} →` : 'Select a Territory Cell'}
    </Button>
  </motion.div>
);

const SeekingModeSelection = ({
  goBack,
  seekingModes,
  onSeekingModeToggle,
  completeOnboarding,
  isLoading,
}) => (
  <motion.div
    key="seeking"
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -300, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="max-w-md mx-auto px-8 py-12"
  >
    <button
      onClick={goBack}
      className="flex items-center text-white/70 hover:text-white mb-6"
    >
      <ChevronLeft className="w-4 h-4 mr-1" /> Back
    </button>

    <h2 className="text-3xl font-bold text-white mb-6">What Are You Seeking?</h2>
    <p className="text-white/80 mb-6">Select at least one mode (you can change this later)</p>

    <div className="space-y-4 mb-8">
      {[
        { id: 'Romance', icon: '🌸', label: 'Spring Romance' },
        { id: 'Migration', icon: '🍂', label: 'Migration Buddy' },
        { id: 'Food', icon: '🤝', label: 'Food-Sharing Pal' },
      ].map((mode) => (
        <motion.div
          key={mode.id}
          whileHover={{ scale: 1.02 }}
          className={`rounded-lg p-4 cursor-pointer border-2 transition-all ${
            seekingModes.includes(mode.id)
              ? 'border-green-400 bg-green-500/20'
              : 'border-white/20 bg-white/10'
          }`}
          onClick={() => onSeekingModeToggle(mode.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{mode.icon}</span>
              <span className="text-white font-medium">{mode.label}</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 ${
              seekingModes.includes(mode.id)
                ? 'border-green-400 bg-green-400'
                : 'border-white/40'
            }`}>
              {seekingModes.includes(mode.id) && (
                <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    <Button
      onClick={completeOnboarding}
      disabled={isLoading || seekingModes.length === 0}
      className="w-full"
    >
      {isLoading ? '🌲 Entering Forest...' : `Start Exploring Jungle! 🎉`}
    </Button>
  </motion.div>
);

const ForgotPasswordForm = ({
  goBack,
  formData,
  handleChange,
  authAPI,
  setStep,
  setFormErrors,
}) => {
  const [resetStep, setResetStep] = useState('verify'); // verify | reset
  const [secretAnswer, setSecretAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  return (
    <motion.div
      key="forgot"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto px-8 py-12"
    >
      <button
        onClick={goBack}
        className="flex items-center text-white/70 hover:text-white mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <h2 className="text-3xl font-bold text-white mb-6">Forgot Your Den Key?</h2>
      
      {resetStep === 'verify' ? (
        <>
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
          
          <Button
            onClick={() => {
              // Verify username exists and show secret animal prompt
              setResetStep('reset');
            }}
            className="w-full"
          >
            Verify Account
          </Button>
        </>
      ) : (
        <>
          <p className="text-white/80 mb-4">
            Secret animal: {formData.secretAnimal ? '✓ Verified' : 'Enter your secret animal'}
          </p>
          
          <Input
            label="Your Secret Animal"
            value={secretAnswer}
            onChange={(e) => setSecretAnswer(e.target.value)}
            placeholder="e.g., elephant"
          />
          
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 4 characters"
          />
          
          <Button
            onClick={async () => {
              try {
                await authAPI.resetPassword({
                  username: formData.username,
                  secret_animal: secretAnswer,
                  new_password: newPassword,
                });
                setStep('login');
              } catch (error) {
                setFormErrors({ general: error.message });
              }
            }}
            className="w-full"
          >
            Reset Password
          </Button>
        </>
      )}
    </motion.div>
  );
};

// Multi-step auth flow
const AuthPage = () => {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [step, setStep] = useState('gate'); // gate | register | login | forgot | onboarding-animal | onboarding-territory | onboarding-seeking
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    secretAnimal: '',
    displayName: '',
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Auth state
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [territoryCell, setTerritoryCell] = useState('');
  const [seekingModes, setSeekingModes] = useState(['Romance']);
  const [animals, setAnimals] = useState([]);
  
  // Load animals on mount
  useEffect(() => {
    loadAnimals();
  }, []);

  const loadAnimals = async () => {
    try {
      const response = await animalAPI.getAnimals({ limit: 12 });
      setAnimals(response.data.animals);
    } catch (error) {
      console.error('Failed to load animals:', error);
    }
  };

  // Real-time username availability check
  useEffect(() => {
    if (step !== 'register' || formData.username.length < 3) return;

    const timeout = setTimeout(async () => {
      try {
        // You'll need to add this endpoint: GET /api/auth/check-username?username=xxx
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/check-username?username=${formData.username}`
        );
        const data = await response.json();
        
        if (data.exists) {
          setFormErrors(prev => ({ ...prev, username: 'Username already taken!' }));
        } else {
          setFormErrors(prev => {
            const updated = { ...prev };
            delete updated.username;
            return updated;
          });
        }
      } catch (error) {
        // Silently fail - this is just a UX enhancement
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.username, step]);

  // Handle form changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    setFormErrors(prev => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  }, []);

  // Validation
  const validateStep = (currentStep) => {
    const errors = {};
    
    switch (currentStep) {
      case 'register':
        if (!formData.username || formData.username.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        }
        if (!formData.password || formData.password.length < 4) {
          errors.password = 'Password must be at least 4 characters';
        }
        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.secretAnimal) {
          errors.secretAnimal = 'Secret animal is required';
        }
        if (!formData.displayName) {
          errors.displayName = 'Display name is required';
        }
        break;
      case 'login':
        if (!formData.username) errors.username = 'Username required';
        if (!formData.password) errors.password = 'Password required';
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Authentication handlers
  const handleRegister = useCallback(async () => {
    if (!validateStep('register')) return;
    
    setIsLoading(true);
    try {
      // Move to animal selection
      setStep('onboarding-animal');
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateStep]);

  const handleLogin = useCallback(async () => {
    if (!validateStep('login')) return;
    
    setIsLoading(true);
    try {
      const response = await authAPI.login({
        username: formData.username,
        password: formData.password,
      });
      
      localStorage.setItem('jj_token', response.data.token);
      localStorage.setItem('jj_user', JSON.stringify(response.data.user));
      navigate('/forest');
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [formData, navigate, validateStep]);

  const handleForgotPassword = useCallback(() => setStep('forgot'), []);

  // Onboarding handlers
  const handleAnimalSelect = (animal) => {
    setSelectedAnimal(animal);
  };

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleTerritoryClaim = (cellId) => {
    setTerritoryCell(cellId);
  };

  const handleSeekingModeToggle = (mode) => {
    setSeekingModes(prev => {
      if (prev.includes(mode)) {
        return prev.length > 1 ? prev.filter(m => m !== mode) : prev;
      }
      return [...prev, mode];
    });
  };

  const completeOnboarding = async () => {
    if (!selectedAnimal || !selectedAvatar || !territoryCell) {
      setFormErrors({ general: 'Please complete all steps' });
      return;
    }

    setIsLoading(true);
    try {
      const registerData = {
        username: formData.username,
        password: formData.password,
        secret_animal: formData.secretAnimal,
        display_name: formData.displayName,
        selected_animal_id: selectedAnimal._id,
        selected_avatar_url: selectedAvatar,
        territory_cell: {
          cell_id: territoryCell,
          layer: 'Forest Floor', // Simplified for now
        },
        seeking_modes: seekingModes,
      };

      const response = await authAPI.register(registerData);
      
      localStorage.setItem('jj_token', response.data.token);
      localStorage.setItem('jj_user', JSON.stringify(response.data.user));
      navigate('/forest');
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation
  const goBack = useCallback(() => {
    if (step === 'register') setStep('gate');
    else if (step === 'login') setStep('gate');
    else if (step === 'forgot') setStep('gate');
    else if (step === 'onboarding-animal') setStep('register');
    else if (step === 'onboarding-territory') setStep('onboarding-animal');
    else if (step === 'onboarding-seeking') setStep('onboarding-territory');
  }, [step]);

  // Sound toggle button - Memoized
  const SoundToggle = useMemo(() => (
    <button
      onClick={() => setSoundEnabled(prev => !prev)}
      className="fixed bottom-4 right-4 bg-black/30 backdrop-blur-sm rounded-full p-3 
        text-white hover:bg-black/50 transition-all z-50"
    >
      {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  ), [soundEnabled]);

  const currentStepComponent = (() => {
    switch (step) {
      case 'gate':
        return (
          <AuthGate
            onRegister={() => setStep('register')}
            onLogin={() => setStep('login')}
          />
        );

      case 'register':
        return (
          <RegisterForm
            goBack={goBack}
            formData={formData}
            formErrors={formErrors}
            handleChange={handleChange}
            handleRegister={handleRegister}
            isLoading={isLoading}
          />
        );

      case 'login':
        return (
          <LoginForm
            goBack={goBack}
            formData={formData}
            formErrors={formErrors}
            handleChange={handleChange}
            handleLogin={handleLogin}
            onForgot={handleForgotPassword}
            isLoading={isLoading}
          />
        );

      case 'forgot':
        return (
          <ForgotPasswordForm
            goBack={goBack}
            formData={formData}
            handleChange={handleChange}
            authAPI={authAPI}
            setStep={setStep}
            setFormErrors={setFormErrors}
          />
        );

      case 'onboarding-animal':
        return (
          <AnimalSelection
            goBack={goBack}
            animals={animals}
            selectedAnimal={selectedAnimal}
            selectedAvatar={selectedAvatar}
            onAnimalSelect={handleAnimalSelect}
            onAvatarSelect={handleAvatarSelect}
            onContinue={() => setStep('onboarding-territory')}
          />
        );

      case 'onboarding-territory':
        return (
          <TerritoryClaim
            goBack={goBack}
            territoryCell={territoryCell}
            onTerritoryClaim={handleTerritoryClaim}
            onContinue={() => setStep('onboarding-seeking')}
          />
        );

      case 'onboarding-seeking':
        return (
          <SeekingModeSelection
            goBack={goBack}
            seekingModes={seekingModes}
            onSeekingModeToggle={handleSeekingModeToggle}
            completeOnboarding={completeOnboarding}
            isLoading={isLoading}
          />
        );

      default:
        return (
          <AuthGate
            onRegister={() => setStep('register')}
            onLogin={() => setStep('login')}
          />
        );
    }
  })();

  return (
    <>
      <ForestBackground>
        <Soundscape isEnabled={soundEnabled} />
        
        <AnimatePresence mode="wait">
          {currentStepComponent}
        </AnimatePresence>

        {SoundToggle}
      </ForestBackground>
    </>
  );
};

export default AuthPage;