import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Plus, Compass, Users, Clock, ShieldAlert, Sparkles, Loader2, ArrowRight } from 'lucide-react';
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

  // Compute statistics for the dashboard
  const totalTrips = trips.length;
  const createdTripsCount = trips.filter(t => t.createdBy?._id === currentUser?._id).length;
  const memberTripsCount = trips.filter(t => t.createdBy?._id !== currentUser?._id).length;
  const upcomingTripsCount = trips.filter(t => new Date(t.startDate) > new Date()).length;

  return (
    <div className="min-h-screen bg-bg-beige text-text-dark pb-16">
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Welcome & Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Welcome back, {currentUser?.name || 'Traveler'}!</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-dark">
              Your Crew Canvases
            </h2>
            <p className="text-sm text-text-muted font-medium">
              Collaborative itineraries, joint expenses, and travel memories
            </p>
          </div>
          <div>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/create-trip')}
                className="w-full md:w-auto px-6 py-4 font-bold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/25 active:bg-primary-hover transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Create New Canvas
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">Total Trips</p>
              <p className="text-2xl font-black text-text-dark">{totalTrips}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl">
              <Plus className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5 font-medium font-medium">Created Trips</p>
              <p className="text-2xl font-black text-text-dark">{createdTripsCount}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">Member Trips</p>
              <p className="text-2xl font-black text-text-dark">{memberTripsCount}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Clock className="w-6 h-6 text-green-650" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">Upcoming Trips</p>
              <p className="text-2xl font-black text-text-dark">{upcomingTripsCount}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center font-medium flex items-center justify-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-650" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin h-10 w-10 text-primary" />
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white border border-slate-200/80 p-12 rounded-3xl text-center shadow-sm max-w-2xl mx-auto space-y-6">
            <Compass className="mx-auto h-16 w-16 text-slate-350" />
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-text-dark">No expeditions found</h3>
              <p className="text-text-muted max-w-sm mx-auto text-sm font-medium leading-relaxed">
                Start by creating a new canvas and invite your friends to collaborate on your route.
              </p>
            </div>
            <div className="pt-2">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/create-trip')}
                  className="px-6 py-3.5 font-bold text-sm rounded-xl bg-accent hover:bg-accent-hover text-white shadow-md shadow-accent/20 transition-all duration-300 cursor-pointer"
                >
                  Create Canvas
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-3.5 font-bold text-sm rounded-xl bg-secondary hover:bg-secondary-hover text-white transition-colors cursor-pointer inline-block"
                >
                  Login to Get Started
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-dark">Recent Trip Canvases</h3>
            </div>
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
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-accent hover:bg-accent-hover text-white transition-colors cursor-pointer shadow-sm shadow-accent/20"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
