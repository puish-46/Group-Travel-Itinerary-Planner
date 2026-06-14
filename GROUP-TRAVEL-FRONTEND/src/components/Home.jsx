import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useTripStore from '../store/tripStore.js';
import useAuthStore from '../store/authStore.js';

const Home = () => {
  const { trips, getAllTrips, loading, error } = useTripStore();
  const { isAuthenticated, currentUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllTrips();
  }, [getAllTrips]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Compute unique destinations for dashboard statistics
  const uniqueDestinations = [...new Set(trips.map((t) => t.destination.toLowerCase().trim()))].length;

  return (
    <div className="min-h-screen bg-bg-beige text-text-dark">
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-extrabold text-accent uppercase tracking-widest mb-1">
              Welcome back, {currentUser?.name || 'Traveler'}!
            </p>
            <h2 className="text-3xl font-black tracking-tight text-text-dark">Your Crew Canvases</h2>
            <p className="mt-2 text-sm text-text-muted font-medium">Collaborative itineraries, joint expenses, and travel memories</p>
          </div>
          <div>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/create-trip')}
                className="w-full sm:w-auto px-6 py-3.5 font-bold rounded-xl bg-accent hover:bg-accent-hover text-white shadow-md shadow-accent/20 active:bg-accent-hover transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                Create New Canvas
              </button>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Expeditions Logged</p>
            <p className="text-3xl font-black text-primary">{trips.length}</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1 font-medium">Destinations Mapped</p>
            <p className="text-3xl font-black text-accent">{uniqueDestinations}</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Crew Canvas Mode</p>
            <p className="text-3xl font-black text-secondary">Active</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center mb-8 font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center shadow-lg">
            <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M11 20.965V19a2 2 0 00-2-2h-1a2 2 0 00-2 2v1.965M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-text-dark mb-2">No expeditions found</h3>
            <p className="text-text-muted max-w-sm mx-auto mb-6 font-medium">Start by creating a new canvas and invite your friends to collaborate on your route.</p>
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/create-trip')}
                className="px-6 py-3 font-bold text-sm rounded-xl bg-accent hover:bg-accent-hover text-white shadow-md shadow-accent/20 transition-all cursor-pointer"
              >
                Create Canvas
              </button>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 font-bold text-sm rounded-xl bg-secondary hover:bg-secondary-hover text-white transition-colors cursor-pointer inline-block"
              >
                Login to Get Started
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-primary/50 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-xl font-black text-text-dark group-hover:text-primary transition-colors line-clamp-1">
                      {trip.tripName}
                    </h3>
                  </div>
                  <p className="text-primary font-bold text-sm mb-3 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {trip.destination}
                  </p>
                  <p className="text-text-muted text-sm mb-4 line-clamp-2 min-h-[40px] font-medium">
                    {trip.description || 'No description provided.'}
                  </p>
                  <div className="text-slate-500 text-xs flex flex-wrap gap-x-4 gap-y-1 mb-6 border-t border-slate-100 pt-4">
                    <span className="font-medium">
                      <strong className="text-text-dark font-bold">Start:</strong> {formatDate(trip.startDate)}
                    </span>
                    <span className="font-medium">
                      <strong className="text-text-dark font-bold">End:</strong> {formatDate(trip.endDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-auto border-t border-slate-50 pt-4">
                  <div className="text-xs text-text-muted font-medium">
                    Leader: <span className="text-secondary font-bold">{trip.createdBy?.name || 'Unknown'}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/trip/${trip._id}`)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-white transition-colors cursor-pointer shadow-sm shadow-primary/20"
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
