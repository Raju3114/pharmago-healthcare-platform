import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, AuthState, User } from '../types/auth.types';
import { STORAGE_KEYS } from '../constants';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (authData: AuthResponse) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user));

      set({
        user: authData.user,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Error saving auth to storage:', error);
    }
  },

  clearAuth: async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA
      ]);

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      console.error('Error clearing auth from storage:', error);
    }
  },

  updateUser: (user: User) => {
    AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    set({ user });
  }
}));

// Initialize Auth state from AsyncStorage on app launch
export const initializeAuth = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

    if (token && userData) {
      const user: User = JSON.parse(userData);
      useAuthStore.setState({
        user,
        accessToken: token,
        refreshToken: refreshToken || null,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      useAuthStore.setState({ isLoading: false });
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    useAuthStore.setState({ isLoading: false });
  }
};
