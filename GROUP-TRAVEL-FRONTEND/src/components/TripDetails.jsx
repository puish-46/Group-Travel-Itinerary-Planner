import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Trash2, MapPin, Calendar, User, Users, Plus, Loader2 } from 'lucide-react';
import useTripStore from '../store/tripStore.js';
import useAuthStore from '../store/authStore.js';
import Itinerary from './Itinerary.jsx';
import Polls from './Polls.jsx';
import Expenses from './Expenses.jsx';
import Gallery from './Gallery.jsx';

const TripDetails = () => {
  const { tripId } = useParams();
  const { selectedTrip, getTrip, deleteTrip, loading, error } = useTripStore();
  const { currentUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('itinerary');

  const [memberEmail, setMemberEmail] = useState('');
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [addMemberError, setAddMemberError] = useState('');

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail) return;

    setAddMemberLoading(true);
    setAddMemberError('');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        `${API_BASE_URL}/trip-api/add-member/${tripId}`,
        { email: memberEmail },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      setMemberEmail('');
      // Refresh trip details
      await getTrip(tripId);
    } catch (err) {
      setAddMemberError(err.response?.data?.message || 'Failed to add member.');
    } finally {
      setAddMemberLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      getTrip(tripId);
    }
  }, [tripId, getTrip]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(tripId);
        navigate('/');
      } catch (err) {
        // Error is captured in tripStore
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isCreator = isAuthenticated && selectedTrip && currentUser && selectedTrip.createdBy?._id === currentUser._id;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-beige flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-beige flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 border border-red-200 text-red-650 text-xs p-4 rounded-xl max-w-md mb-6 font-medium">
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 font-bold text-sm rounded-xl bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20 transition-all duration-300 cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!selectedTrip) {
    return (
      <div className="min-h-screen bg-bg-beige flex flex-col items-center justify-center p-6 text-center">
        <p className="text-text-muted text-lg mb-6 font-medium">No trip details loaded.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 font-bold text-sm rounded-xl bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20 transition-all duration-300 cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-beige text-text-dark p-4 sm:p-6 pb-16">
      <div className="max-w-4xl mx-auto">
        {/* Top bar with back and delete actions */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-text-muted hover:text-primary flex items-center gap-1.5 text-xs font-bold transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          {isCreator && (
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Expedition
            </button>
          )}
        </div>

        {/* Trip Card details banner */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden mb-8">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary mb-6">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {selectedTrip.destination}
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-text-dark mb-4 tracking-tight leading-tight">
            {selectedTrip.tripName}
          </h2>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-text-muted text-sm mb-6 border-b border-slate-100 pb-6 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatDate(selectedTrip.startDate)}</span>
            </div>
            <div className="text-slate-300 hidden sm:block">•</div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatDate(selectedTrip.endDate)}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-text-dark mb-2">Trip Description</h3>
          <p className="text-text-muted text-sm leading-relaxed mb-8 font-medium">
            {selectedTrip.description || 'No description has been added to this trip yet.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                Organizer
              </h4>
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {selectedTrip.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-dark">{selectedTrip.createdBy?.name || 'Unknown'}</p>
                  <p className="text-xs text-text-muted font-medium">{selectedTrip.createdBy?.email || ''}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                Travel Members ({selectedTrip.members?.length || 0})
              </h4>
              <div className="grid grid-cols-1 gap-2 mb-4 max-h-60 overflow-y-auto">
                {selectedTrip.members?.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-xs text-primary font-bold shrink-0">
                      {member.name?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-text-dark leading-tight">{member.name}</p>
                      <p className="text-xs text-text-muted font-medium">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isCreator && (
                <form onSubmit={handleAddMember} className="mt-4 pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-text-dark mb-2">Add Member</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Add member by email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="flex-grow px-3.5 py-2.5 border border-slate-200 rounded-xl text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-semibold"
                    />
                    <button
                      type="submit"
                      disabled={addMemberLoading}
                      className="px-4 py-2.5 text-xs font-bold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-sm transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      {addMemberLoading ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                  {addMemberError && (
                    <p className="text-xs text-red-600 mt-1.5 font-medium">{addMemberError}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Feature Tabs section */}
        <div className="mt-12 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex border-b border-slate-100 mb-6 overflow-x-auto gap-2">
            {['itinerary', 'polls', 'expenses', 'gallery'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 font-bold text-sm border-b-2 capitalize transition-all cursor-pointer whitespace-nowrap relative ${
                  activeTab === tab
                    ? 'border-accent text-primary'
                    : 'border-transparent text-text-muted hover:text-primary hover:border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="transition-all duration-300">
            {activeTab === 'itinerary' && <Itinerary tripId={tripId} />}
            {activeTab === 'polls' && <Polls tripId={tripId} />}
            {activeTab === 'expenses' && <Expenses tripId={tripId} />}
            {activeTab === 'gallery' && <Gallery tripId={tripId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
