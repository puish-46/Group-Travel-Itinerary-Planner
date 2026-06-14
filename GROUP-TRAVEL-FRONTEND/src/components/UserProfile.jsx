import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore.js';

const UserProfile = () => {
  const { currentUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${API_BASE_URL}/user-api/profile`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        setProfile(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-beige flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  const activeUser = profile || currentUser;

  return (
    <div className="min-h-screen bg-bg-beige text-text-dark flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-xl relative">
        <h2 className="text-3xl font-black text-text-dark text-center mb-6">User Profile</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg text-center mb-6 font-medium">
            {error}
          </div>
        )}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-accent to-yellow-500 flex items-center justify-center text-white font-black text-4xl shadow-md shadow-accent/20">
              {activeUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Full Name</label>
              <p className="text-base font-bold text-text-dark">{activeUser?.name || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Email Address</label>
              <p className="text-base font-bold text-text-dark">{activeUser?.email || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">User Role</label>
              <p className="text-base font-bold text-primary capitalize">{activeUser?.role || 'user'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
