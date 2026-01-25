import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Fetch all profiles/matches for a given user ID.
 * @param {string} userId - The current user's ID
 * @returns {Promise<Array>} - List of compatible matches
 */
export const fetchMatches = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/matches/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

/**
 * Create a new animal profile.
 * @param {Object} profileData - The animal profile data
 * @returns {Promise<Object>} - The created profile
 */
export const createProfile = async (profileData) => {
  try {
    const response = await axios.post(`${API_URL}/profiles`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

/**
 * Perform a forest interaction with a match.
 * @param {string} interactionType - Type of interaction (e.g., 'Tree-top Swing')
 * @param {string} matchName - Name of the matched animal
 * @returns {Promise<Object>} - Result message
 */
export const interactWithMatch = async (interactionType, matchName) => {
  try {
    const response = await axios.post(`${API_URL}/interact`, {
      type: interactionType,
      matchName,
    });
    return response.data;
  } catch (error) {
    console.error('Error in interaction:', error);
    throw error;
  }
};
