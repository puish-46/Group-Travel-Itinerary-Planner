import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore.js';

const Itinerary = ({ tripId }) => {
  const { tripId: paramTripId } = useParams();
  const activeTripId = tripId || paramTripId;

  const { isAuthenticated } = useAuthStore();

  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [dayNumber, setDayNumber] = useState('');
  const [dayTitle, setDayTitle] = useState('');
  const [newActivity, setNewActivity] = useState({}); // Stores activity text per day: { [itineraryId]: 'text' }

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  };

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/itinerary-api/trip/${activeTripId}`);
      setItineraries(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load itineraries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTripId) {
      fetchItineraries();
    }
  }, [activeTripId]);

  const handleCreateDay = async (e) => {
    e.preventDefault();
    if (!dayNumber) {
      alert('Day number is required.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/itinerary-api/create-day`,
        {
          tripId: activeTripId,
          dayNumber: parseInt(dayNumber, 10),
          title: dayTitle,
        },
        getAuthConfig()
      );
      setDayNumber('');
      setDayTitle('');
      fetchItineraries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create day.');
    }
  };

  const handleDeleteDay = async (itineraryId) => {
    if (!window.confirm('Are you sure you want to delete this itinerary day?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/itinerary-api/delete-day/${itineraryId}`, getAuthConfig());
      fetchItineraries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete day.');
    }
  };

  const handleActivityChange = (itineraryId, value) => {
    setNewActivity((prev) => ({
      ...prev,
      [itineraryId]: value,
    }));
  };

  const handleAddActivity = async (e, itineraryId) => {
    e.preventDefault();
    const activityText = newActivity[itineraryId];
    if (!activityText || !activityText.trim()) return;

    try {
      await axios.put(
        `${API_BASE_URL}/itinerary-api/add-activity/${itineraryId}`,
        { activity: activityText.trim() },
        getAuthConfig()
      );
      handleActivityChange(itineraryId, '');
      fetchItineraries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add activity.');
    }
  };

  const handleDeleteActivity = async (itineraryId, activityIndex) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/itinerary-api/remove-activity/${itineraryId}/${activityIndex}`,
        getAuthConfig()
      );
      fetchItineraries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete activity.');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-6">Shared Itinerary</h3>

      {/* Create Day Form */}
      {isAuthenticated && (
        <form onSubmit={handleCreateDay} className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-2xl mb-8">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Add Day Plan</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Day Number</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 1"
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-white bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={dayNumber}
                onChange={(e) => setDayNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Day Title / Theme</label>
              <input
                type="text"
                placeholder="e.g. Sightseeing & Dinner"
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-white bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={dayTitle}
                onChange={(e) => setDayTitle(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Add Day
              </button>
            </div>
          </div>
        </form>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg text-center mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : itineraries.length === 0 ? (
        <p className="text-slate-400 text-center py-6 bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl">
          No itinerary days created yet.
        </p>
      ) : (
        <div className="space-y-6">
          {itineraries.map((day) => (
            <div key={day._id} className="bg-slate-950/30 border border-slate-800 rounded-2xl p-5 relative">
              {/* Day title & delete day button */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white">Day {day.dayNumber}</h4>
                  {day.title && <p className="text-sm text-indigo-300 font-medium">{day.title}</p>}
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => handleDeleteDay(day._id)}
                    className="p-1 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete Day"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Activities list */}
              <div className="space-y-2 mb-4">
                {day.activities.length === 0 ? (
                  <p className="text-slate-500 text-xs italic">No activities planned yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {day.activities.map((activity, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-slate-900/60 border border-slate-800/50 px-3.5 py-2.5 rounded-xl text-sm text-slate-300 hover:border-slate-700 transition-all group"
                      >
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                          {activity}
                        </span>
                        {isAuthenticated && (
                          <button
                            onClick={() => handleDeleteActivity(day._id, index)}
                            className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Delete Activity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Add activity form */}
              {isAuthenticated && (
                <form onSubmit={(e) => handleAddActivity(e, day._id)} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Add new activity..."
                    className="flex-1 px-3 py-2 border border-slate-700 rounded-lg text-white bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    value={newActivity[day._id] || ''}
                    onChange={(e) => handleActivityChange(day._id, e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600/20 border border-indigo-500/20 hover:bg-indigo-600 rounded-lg transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Itinerary;
