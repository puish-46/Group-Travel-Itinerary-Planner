import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Shield, Loader2 } from 'lucide-react';
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
      <div className="min-h-[80vh] bg-background flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  const activeUser = profile || currentUser;

  return (
    <div className="min-h-[80vh] bg-background text-text-dark flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-lg relative p-8">
        <h2 className="text-2xl font-bold text-text-dark text-center mb-6">Your Profile</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-650 text-xs p-3.5 rounded-xl text-center mb-6 font-bold">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-black text-4xl shadow-md shadow-primary/20">
              {activeUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-white border border-slate-100 text-slate-405 shrink-0">
                <User className="w-4 h-4" />
              </span>
              <div className="min-w-0 flex-1">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Full Name</label>
                <p className="text-sm font-bold text-text-dark truncate mt-0.5">{activeUser?.name || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-white border border-slate-100 text-slate-405 shrink-0">
                <Mail className="w-4 h-4" />
              </span>
              <div className="min-w-0 flex-1">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Email Address</label>
                <p className="text-sm font-bold text-text-dark truncate mt-0.5">{activeUser?.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-white border border-slate-100 text-primary shrink-0">
                <Shield className="w-4 h-4" />
              </span>
              <div className="min-w-0 flex-1">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">User Role</label>
                <p className="text-sm font-bold text-primary capitalize mt-0.5">{activeUser?.role || 'user'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
