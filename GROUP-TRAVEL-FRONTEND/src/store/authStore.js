import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const useAuthStore = create((set) => ({
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),

  // Register user
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/user-api/register`, {
        name,
        email,
        password,
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Login user
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/user-api/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store in localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update Zustand state
      set({
        currentUser: user,
        token: token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please verify credentials.';
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      currentUser: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));

export default useAuthStore;
