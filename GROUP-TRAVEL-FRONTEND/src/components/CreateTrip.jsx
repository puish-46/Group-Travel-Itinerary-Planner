import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, Calendar, MapPin, AlignLeft, Loader2 } from 'lucide-react';
import useTripStore from '../store/tripStore.js';

const CreateTrip = () => {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [validationError, setValidationError] = useState('');
  const { createTrip, loading, error } = useTripStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!tripName || !destination || !startDate || !endDate) {
      setValidationError('All fields except description are required.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setValidationError('Start date cannot be after end date.');
      return;
    }

    try {
      await createTrip({
        tripName,
        destination,
        description,
        startDate,
        endDate
      });
      navigate('/');
    } catch (err) {
      // Error is caught by the Zustand tripStore
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-beige p-4 sm:p-6 py-12">
      <div className="max-w-xl w-full bg-white border border-slate-200/85 p-8 sm:p-10 rounded-2xl shadow-lg relative space-y-6 hover:shadow-xl transition-shadow duration-300">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-text-muted hover:text-primary flex items-center gap-1.5 text-xs font-bold transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center space-y-2 mt-6">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-text-dark tracking-tight">Create Trip Canvas</h2>
          <p className="text-sm text-text-muted font-medium font-medium">Plan a new group travel route and itinerary</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {(error || validationError) && (
            <div className="bg-red-50 border border-red-200 text-red-650 text-xs p-3.5 rounded-xl text-center font-bold">
              {validationError || error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="tripName" className="block text-xs font-bold text-text-dark">
                Trip Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Compass className="h-4 w-4" />
                </span>
                <input
                  id="tripName"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3.5 py-3 border border-slate-200 placeholder-slate-400 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                  placeholder="e.g. Mountain Expedition 2026"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="destination" className="block text-xs font-bold text-text-dark">
                Destination
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <MapPin className="h-4 w-4" />
                </span>
                <input
                  id="destination"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3.5 py-3 border border-slate-200 placeholder-slate-400 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                  placeholder="e.g. Alps, Switzerland"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="startDate" className="block text-xs font-bold text-text-dark">
                  Start Date
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <input
                    id="startDate"
                    type="date"
                    required
                    className="appearance-none rounded-xl relative block w-full pl-10 pr-3.5 py-3 border border-slate-200 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="endDate" className="block text-xs font-bold text-text-dark">
                  End Date
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <input
                    id="endDate"
                    type="date"
                    required
                    className="appearance-none rounded-xl relative block w-full pl-10 pr-3.5 py-3 border border-slate-200 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="description" className="block text-xs font-bold text-text-dark">
                Description
              </label>
              <div className="relative">
                <span className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-text-muted">
                  <AlignLeft className="h-4 w-4" />
                </span>
                <textarea
                  id="description"
                  rows="3"
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3.5 py-3 border border-slate-200 placeholder-slate-400 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                  placeholder="What is the adventure focus or general goal?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-md shadow-primary/20 hover:shadow-primary/30"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="animate-spin h-4 w-4 text-white" />
                  <span>Creating Canvas...</span>
                </span>
              ) : 'Create Canvas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
