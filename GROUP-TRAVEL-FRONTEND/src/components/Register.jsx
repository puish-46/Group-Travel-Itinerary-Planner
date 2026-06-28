import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, User, Mail, Lock, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore.js';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!name || !email || !password) {
      setValidationError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    try {
      await register(name, email, password);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Error is stored in the Zustand authStore
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-beige px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200/85 p-8 sm:p-10 rounded-2xl shadow-lg space-y-8 hover:shadow-xl transition-shadow duration-300">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-text-dark tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-text-muted font-medium">
            Join The Crew Canvas
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {(error || validationError) && (
            <div className="bg-red-50 border border-red-200 text-red-650 text-xs p-3.5 rounded-xl text-center font-bold">
              {validationError || error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-650 text-xs p-3.5 rounded-xl text-center font-bold">
              {successMessage}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-bold text-text-dark">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3.5 py-3 border border-slate-200 placeholder-slate-400 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email-address" className="text-xs font-bold text-text-dark">Email address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3.5 py-3 border border-slate-200 placeholder-slate-400 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-bold text-text-dark">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3.5 py-3 border border-slate-200 placeholder-slate-400 text-text-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                  placeholder="•••••••• (minimum 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  <span>Creating Account...</span>
                </span>
              ) : 'Register'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-text-muted font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-primary-hover transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
