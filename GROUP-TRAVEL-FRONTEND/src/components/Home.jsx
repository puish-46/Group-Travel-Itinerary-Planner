import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useTripStore from '../store/tripStore.js';
import useAuthStore from '../store/authStore.js';

const Home = () => {
  const { trips, getAllTrips, loading, error } = useTripStore();
  const { isAuthenticated, logout, currentUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllTrips();
  }, [getAllTrips]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
              Welcome back, {currentUser?.name || 'Traveler'}!
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Upcoming Trips</h2>
            <p className="mt-2 text-sm text-slate-400">Collaborative itineraries, expenses, and photo galleries</p>
          </div>
          <div>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/create-trip')}
                className="w-full sm:w-auto px-6 py-3 font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:bg-indigo-800 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create New Trip
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-4 rounded-xl text-center mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center shadow-xl">
            <svg className="mx-auto h-12 w-12 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M11 20.965V19a2 2 0 00-2-2h-1a2 2 0 00-2 2v1.965M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-white mb-2">No trips found</h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-6">Start by creating a new trip and invite your friends to collaborate.</p>
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/create-trip')}
                className="px-6 py-2.5 font-semibold text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Create Trip
              </button>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 font-semibold text-sm rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer inline-block"
              >
                Login to Get Started
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between hover:shadow-2xl hover:shadow-indigo-500/5 group"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {trip.tripName}
                    </h3>
                  </div>
                  <p className="text-indigo-400 font-semibold text-sm mb-3 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {trip.destination}
                  </p>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {trip.description || 'No description provided.'}
                  </p>
                  <div className="text-slate-500 text-xs flex flex-wrap gap-x-4 gap-y-1 mb-6 border-t border-slate-800/80 pt-4">
                    <span>
                      <strong className="text-slate-400">Start:</strong> {formatDate(trip.startDate)}
                    </span>
                    <span>
                      <strong className="text-slate-400">End:</strong> {formatDate(trip.endDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-auto">
                  <div className="text-xs text-slate-500">
                    Created by: <span className="text-indigo-300 font-medium">{trip.createdBy?.name || 'Unknown'}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/trip/${trip._id}`)}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
