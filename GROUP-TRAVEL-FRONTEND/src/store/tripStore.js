import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to construct headers with the token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

const useTripStore = create((set) => ({
  trips: [],
  selectedTrip: null,
  loading: false,
  error: null,

  // Create a new trip (Protected)
  createTrip: async (tripData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/trip-api/create-trip`, tripData, getAuthConfig());
      set((state) => ({
        trips: [...state.trips, response.data.trip],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create trip.';
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Fetch all trips (Protected)
  getAllTrips: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/trip-api/all-trips`, getAuthConfig());
      set({ trips: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch trips.';
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Fetch details for a specific trip (Protected)
  getTrip: async (tripId) => {
    set({ loading: true, error: null, selectedTrip: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/trip-api/trip/${tripId}`, getAuthConfig());
      set({ selectedTrip: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load trip details.';
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Delete a trip (Protected, creator only)
  deleteTrip: async (tripId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/trip-api/delete-trip/${tripId}`, getAuthConfig());
      set((state) => ({
        trips: state.trips.filter((trip) => trip._id !== tripId),
        selectedTrip: state.selectedTrip?._id === tripId ? null : state.selectedTrip,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete trip.';
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));

export default useTripStore;
