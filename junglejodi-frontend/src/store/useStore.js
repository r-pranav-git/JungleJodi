import { create } from 'zustand';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const useStore = create((set, get) => ({
    user: null,
    matches: [],
    theme: 'spring', // spring, monsoon, night
    isLoading: false,
    notification: null,

    setUser: (user) => set({ user }),
    setTheme: (theme) => set({ theme }),

    fetchMatches: async (userId) => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`${API_BASE}/matches/${userId}`);
            set({ matches: res.data, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch matches', error);
            set({ isLoading: false });
        }
    },

    createProfile: async (profileData) => {
        set({ isLoading: true });
        try {
            const res = await axios.post(`${API_BASE}/profiles`, profileData);
            set({ user: res.data, isLoading: false });
            return res.data;
        } catch (error) {
            console.error('Failed to create profile', error);
            set({ isLoading: false });
        }
    },

    interact: async (type, matchName) => {
        try {
            const res = await axios.post(`${API_BASE}/interact`, { type, matchName });
            set({ notification: res.data.message });
            setTimeout(() => set({ notification: null }), 5000);
        } catch (error) {
            console.error('Interaction failed', error);
        }
    }
}));

export default useStore;
