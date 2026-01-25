import { create } from 'zustand';
import { fetchMatches as apiFetchMatches, createProfile as apiCreateProfile, interactWithMatch as apiInteract } from '../utils/api';

const useAppStore = create((set, get) => ({
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
            const matches = await apiFetchMatches(userId);
            set({ matches, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch matches', error);
            set({ isLoading: false });
        }
    },

    createProfile: async (profileData) => {
        set({ isLoading: true });
        try {
            const newUser = await apiCreateProfile(profileData);
            set({ user: newUser, isLoading: false });
            return newUser;
        } catch (error) {
            console.error('Failed to create profile', error);
            set({ isLoading: false });
        }
    },

    interact: async (type, matchName) => {
        try {
            const res = await apiInteract(type, matchName);
            set({ notification: res.message });
            setTimeout(() => set({ notification: null }), 5000);
        } catch (error) {
            console.error('Interaction failed', error);
        }
    }
}));

export default useAppStore;
