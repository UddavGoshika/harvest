import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: async (user) => {
    try {
      await AsyncStorage.setItem('harvest_user', JSON.stringify(user));
      set({ user, isAuthenticated: !!user });
    } catch (e) {
      console.error('Failed to save user', e);
    }
  },
  loadUser: async () => {
    try {
      const savedUser = await AsyncStorage.getItem('harvest_user');
      if (savedUser) {
        set({ user: JSON.parse(savedUser), isAuthenticated: true });
      }
    } catch (e) {
      console.error('Failed to load user', e);
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem('harvest_user');
      set({ user: null, isAuthenticated: false });
    } catch (e) {
      console.error('Failed to logout', e);
    }
  },
}));
