import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen flex items-center justify-center bg-bg-beige p-6">
      <div className="max-w-xl w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-xl relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-text-muted hover:text-primary flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="text-center mt-6">
          <h2 className="text-3xl font-black text-text-dark tracking-tight">Create Trip Canvas</h2>
          <p className="mt-2 text-sm text-text-muted font-medium">Plan a new group travel route and itinerary</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(error || validationError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg text-center font-medium">
              {validationError || error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="tripName" className="block text-xs font-bold text-text-dark mb-1">
                Trip Name
              </label>
              <input
                id="tripName"
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-3.5 py-3 border border-slate-200 placeholder-slate-400 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium"
                placeholder="e.g. Mountain Expedition 2026"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="destination" className="block text-xs font-bold text-text-dark mb-1">
                Destination
              </label>
              <input
                id="destination"
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-3.5 py-3 border border-slate-200 placeholder-slate-400 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium"
                placeholder="e.g. Alps, Switzerland"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-xs font-bold text-text-dark mb-1">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3.5 py-3 border border-slate-200 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-xs font-bold text-text-dark mb-1">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3.5 py-3 border border-slate-200 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold text-text-dark mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                className="appearance-none rounded-xl relative block w-full px-3.5 py-3 border border-slate-200 placeholder-slate-400 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium"
                placeholder="What is the adventure focus or general goal?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-accent/25 hover:shadow-accent/40"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
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
