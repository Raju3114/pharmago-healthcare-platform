import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, ThemeState } from '../types/theme.types';
import { STORAGE_KEYS } from '../constants';

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light',

  toggleTheme: async () => {
    const nextMode: ThemeMode = get().mode === 'light' ? 'dark' : 'light';
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, nextMode);
      set({ mode: nextMode });
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  },

  setTheme: async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
      set({ mode });
    } catch (error) {
      console.error('Error setting theme mode:', error);
    }
  }
}));

export const initializeTheme = async () => {
  try {
    const savedMode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
    if (savedMode === 'dark' || savedMode === 'light') {
      useThemeStore.setState({ mode: savedMode });
    }
  } catch (error) {
    console.error('Error initializing theme:', error);
  }
};
