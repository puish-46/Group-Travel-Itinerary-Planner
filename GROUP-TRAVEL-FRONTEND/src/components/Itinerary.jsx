import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Trash2, Plus, Loader2, ListTodo, MapPin } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-text-dark flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Shared Itinerary
          </h3>
          <p className="text-xs text-text-muted">Coordinate plans and daily activities with your crew</p>
        </div>
      </div>

      {/* Create Day Form */}
      {isAuthenticated && (
        <form onSubmit={handleCreateDay} className="bg-slate-50 border border-slate-200/85 p-5 sm:p-6 rounded-xl">
          <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-4">Add Day Plan</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted">Day Number</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 1"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-semibold"
                value={dayNumber}
                onChange={(e) => setDayNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted">Day Title / Theme</label>
              <input
                type="text"
                placeholder="e.g. Hiking Trail & Basecamp"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-semibold"
                value={dayTitle}
                onChange={(e) => setDayTitle(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-3 text-xs font-bold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-md shadow-accent/15 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Day
              </button>
            </div>
          </div>
        </form>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-650 text-xs p-3.5 rounded-xl text-center font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : itineraries.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
          <Calendar className="w-10 h-10 text-slate-350 mx-auto mb-3" />
          <p className="text-text-muted text-sm font-medium">No itinerary days created yet.</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
          {itineraries.map((day) => (
            <div key={day._id} className="relative bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
              {/* Day Node Dot */}
              <div className="absolute -left-9 sm:-left-[41px] top-6 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary border-4 border-white shadow-sm flex items-center justify-center text-white text-[10px] font-bold">
                {day.dayNumber}
              </div>

              {/* Day title & delete day button */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-base font-bold text-text-dark">Day {day.dayNumber}</h4>
                  {day.title && (
                    <p className="text-xs text-primary font-bold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      {day.title}
                    </p>
                  )}
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => handleDeleteDay(day._id)}
                    className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-650 transition-all duration-300 cursor-pointer"
                    title="Delete Day"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Activities list */}
              <div className="space-y-2 mb-4 border-t border-slate-50 pt-4">
                {day.activities.length === 0 ? (
                  <p className="text-text-muted text-xs italic font-medium">No activities planned yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {day.activities.map((activity, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-slate-50/50 border border-slate-100 hover:border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-text-dark transition-all duration-300 group font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0"></span>
                          {activity}
                        </span>
                        {isAuthenticated && (
                          <button
                            onClick={() => handleDeleteActivity(day._id, index)}
                            className="text-slate-400 hover:text-red-650 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                            title="Delete Activity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Add activity form */}
              {isAuthenticated && (
                <form onSubmit={(e) => handleAddActivity(e, day._id)} className="flex items-center gap-2 pt-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <ListTodo className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Add new activity..."
                      className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-xl text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-semibold transition-all"
                      value={newActivity[day._id] || ''}
                      onChange={(e) => handleActivityChange(day._id, e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-primary bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1"
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
