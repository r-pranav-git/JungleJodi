// frontend/src/utils/api.js
import axios from 'axios';

/**
 * JungleJodi API Client
 * Handles all communication with the backend API
 */

// Create axios instance with default config
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically adds JWT token to all requests if available
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jj_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request for debugging
    console.log(`🔵 ${config.method.toUpperCase()} ${config.url}`, config.params || config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject({
      status: -1,
      message: 'Failed to prepare request',
    });
  }
);

/**
 * Response Interceptor
 * Standardizes all API responses and handles common error cases
 * Returns only the response data to simplify usage
 */
API.interceptors.response.use(
  // Success handler - API contract enforces { status: "success", data: {...} }
  (response) => {
    console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    return response.data;
  },
  
  // Error handler - standardizes error format
  (error) => {
    // Network error or timeout
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject({
          status: 408,
          message: 'Request timeout. Please check your connection.',
        });
      }
      return Promise.reject({
        status: 0,
        message: 'Cannot connect to JungleJodi server. Please check your connection.',
      });
    }

    // Server responded with error
    const { status, data } = error.response;
    const message = data?.message || 'Something went wrong';
    const errors = data?.errors || [];

    // Handle specific status codes with custom logic
    switch (status) {
      case 401:
        // Unauthorized - token expired or invalid
        localStorage.removeItem('jj_token');
        localStorage.removeItem('jj_user');
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
        break;
        
      case 429:
        // Rate limited - show retry info
        return Promise.reject({
          status,
          message: 'You\'re moving too fast! Slow down for the forest.',
          retryAfter: error.response.headers['retry-after'],
        });
        
      case 422:
        // Validation errors - return field-specific errors
        return Promise.reject({
          status,
          message,
          errors,
        });
        
      case 500:
        // Server error
        return Promise.reject({
          status,
          message: 'Server error. The forest spirits are confused. Please try again later.',
        });
        
      default:
        // Generic error
        return Promise.reject({
          status,
          message,
          errors,
        });
    }
    
    return Promise.reject({ status, message, errors });
  }
);

/**
 * ============================================
 * AUTHENTICATION API
 * ============================================
 */

export const authAPI = {
  /**
   * Register a new user with complete onboarding data
   * @param {Object} userData - { username, password, secret_animal, display_name, selected_animal_id, selected_avatar_url, territory_cell, seeking_modes }
   * @returns {Promise<Object>} - { user, token }
   */
  async register(userData) {
    const response = await API.post('/auth/register', userData);
    return response;
  },

  /**
   * Login user with username and password
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} - { user, token }
   */
  async login(credentials) {
    const response = await API.post('/auth/login', credentials);
    return response;
  },

  /**
   * Check if username is available (real-time validation)
   * @param {string} username - Username to check
   * @returns {Promise<Object>} - { exists: boolean }
   */
  async checkUsername(username) {
    const response = await API.get('/auth/check-username', {
      params: { username }
    });
    return response;
  },

  /**
   * Initiate forgot password flow - verify username exists
   * @param {string} username - Username to reset
   * @returns {Promise<Object>} - Success message with next step
   */
  async forgotPassword(username) {
    const response = await API.post('/auth/forgot-password', { username });
    return response;
  },

  /**
   * Reset password using secret animal verification
   * @param {Object} resetData - { username, secret_animal, new_password }
   * @returns {Promise<Object>} - Success confirmation
   */
  async resetPassword(resetData) {
    const response = await API.post('/auth/reset-password', resetData);
    return response;
  },
};

/**
 * ============================================
 * ANIMAL API
 * ============================================
 */

export const animalAPI = {
  /**
   * Get available animals for swipe deck with filtering
   * @param {Object} filters - { season, activity_period, limit, exclude_ids, night_mode, rarity }
   * @returns {Promise<Object>} - { animals[], total, has_more }
   */
  async getAnimals(filters = {}) {
    const response = await API.get('/animals', { 
      params: filters,
      // Increase timeout for complex queries
      timeout: filters.exclude_ids ? 15000 : 10000 
    });
    return response;
  },

  /**
   * Get single animal details by ID
   * @param {string} id - Animal ObjectID
   * @returns {Promise<Object>} - { animal }
   */
  async getAnimalById(id) {
    const response = await API.get(`/animals/${id}`);
    return response;
  },
};

/**
 * ============================================
 * USER API
 * ============================================
 */

export const userAPI = {
  /**
   * Get current authenticated user profile
   * @returns {Promise<Object>} - { user }
   */
  async getMe() {
    const response = await API.get('/users/me');
    return response;
  },

  /**
   * Update user's territory cell and layer
   * @param {Object} territoryData - { cell_id, layer }
   * @returns {Promise<Object>} - { territory_cell }
   */
  async updateTerritory(territoryData) {
    const response = await API.patch('/users/territory', territoryData);
    return response;
  },

  /**
   * Update user preferences (seeking modes)
   * @param {Object} preferences - { seeking_modes[] }
   * @returns {Promise<Object>} - { seeking_modes }
   */
  async updatePreferences(preferences) {
    const response = await API.patch('/users/preferences', preferences);
    return response;
  },
};

/**
 * ============================================
 * MATCH & SWIPE API
 * ============================================
 */

export const matchAPI = {
  /**
   * Record a swipe action (left/right/super)
   * @param {Object} swipeData - { animal_id, direction }
   * @returns {Promise<Object>} - { swipe, is_match, match_data }
   */
  async swipe(swipeData) {
    const response = await API.post('/swipes', swipeData);
    return response;
  },

  /**
   * Get user's matches with optional filtering
   * @param {Object} filters - { status, limit }
   * @returns {Promise<Object>} - { matches[], total, has_more }
   */
  async getMatches(filters = {}) {
    const response = await API.get('/matches', { params: filters });
    return response;
  },

  /**
   * Send a message in an expedition
   * @param {Object} messageData - { match_id, template }
   * @returns {Promise<Object>} - { message }
   */
  async sendMessage(messageData) {
    const response = await API.post('/matches/message', messageData);
    return response;
  },
};

/**
 * ============================================
 * UTILITY API
 * ============================================
 */

export const healthAPI = {
  /**
   * Check API and database health status
   * @returns {Promise<Object>} - { status, database, timestamp, uptime }
   */
  async check() {
    const response = await API.get('/health');
    return response;
  },
};

// Default export for direct API calls if needed
export default API;