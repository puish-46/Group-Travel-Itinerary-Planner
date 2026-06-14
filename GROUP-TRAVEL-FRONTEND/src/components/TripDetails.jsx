import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-4 rounded-xl max-w-md mb-6">
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 font-semibold text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!selectedTrip) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-400 text-lg mb-6">No trip details loaded.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 font-semibold text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Top bar with back and delete actions */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 text-sm transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Trips
          </button>
          
          {isCreator && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Trip
            </button>
          )}
        </div>

        {/* Trip Card details banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-3xl pointer-events-none"></div>
          
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 mb-6">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {selectedTrip.destination}
          </span>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            {selectedTrip.tripName}
          </h2>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-400 text-sm mb-6 border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(selectedTrip.startDate)}</span>
            </div>
            <div className="text-slate-600 hidden sm:block">•</div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(selectedTrip.endDate)}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">Trip Description</h3>
          <p className="text-slate-300 leading-relaxed mb-8">
            {selectedTrip.description || 'No description has been added to this trip yet.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-800/80 pt-8">
            <div>
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Organizer
              </h4>
              <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {selectedTrip.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{selectedTrip.createdBy?.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500">{selectedTrip.createdBy?.email || ''}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Travel Members ({selectedTrip.members?.length || 0})
              </h4>
              <div className="grid grid-cols-1 gap-2 mb-4 max-h-60 overflow-y-auto">
                {selectedTrip.members?.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-600/50 flex items-center justify-center text-xs text-white font-bold shrink-0">
                      {member.name?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-white leading-tight">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isCreator && (
                <form onSubmit={handleAddMember} className="mt-4 pt-4 border-t border-slate-800/80">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Add Member</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Add member by email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="flex-grow px-3 py-2 border border-slate-700 rounded-lg text-white bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                    <button
                      type="submit"
                      disabled={addMemberLoading}
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {addMemberLoading ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                  {addMemberError && (
                    <p className="text-xs text-red-400 mt-1.5">{addMemberError}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Feature Tabs section */}
        <div className="mt-12 bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex border-b border-slate-800 mb-6 overflow-x-auto gap-2">
            {['itinerary', 'polls', 'expenses', 'gallery'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 font-bold text-sm border-b-2 capitalize transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-350'
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
