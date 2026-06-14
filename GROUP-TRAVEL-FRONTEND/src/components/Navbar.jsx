import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const Navbar = () => {
  const { isAuthenticated, logout, currentUser } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary border-b border-primary-hover sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & App name */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 text-white font-bold tracking-wider group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-accent to-yellow-500 flex items-center justify-center text-white shadow-md shadow-accent/20 group-hover:rotate-6 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span className="text-white font-black text-sm sm:text-base block">
                The Crew Canvas
              </span>
            </Link>
          </div>

          {/* Right: Navigation items */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-green-50 hover:text-accent px-3 py-2 rounded-lg text-sm font-bold transition-colors">
                  Dashboard
                </Link>
                <Link to="/dashboard" className="text-green-50 hover:text-accent px-3 py-2 rounded-lg text-sm font-bold transition-colors">
                  My Trips
                </Link>
                <Link to="/profile" className="text-green-50 hover:text-accent px-3 py-2 rounded-lg text-sm font-bold transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-hover hover:bg-green-900 text-white transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-green-50 hover:text-accent px-3 py-2 rounded-lg text-sm font-bold transition-colors">
                  Home
                </Link>
                <Link to="/login" className="text-green-50 hover:text-accent px-3 py-2 rounded-lg text-sm font-bold transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-accent hover:bg-accent-hover text-white shadow-md shadow-accent/20 hover:shadow-accent/40 transition-all cursor-pointer"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-green-100 hover:text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white transition-colors cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-primary-hover px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-green-50 hover:text-accent block px-3 py-2 rounded-lg text-base font-bold transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-green-50 hover:text-accent block px-3 py-2 rounded-lg text-base font-bold transition-colors"
              >
                My Trips
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="text-green-50 hover:text-accent block px-3 py-2 rounded-lg text-base font-bold transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-green-50 hover:text-accent block px-3 py-2 rounded-lg text-base font-bold transition-colors cursor-pointer border-t border-primary-hover pt-3 mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-green-50 hover:text-accent block px-3 py-2 rounded-lg text-base font-bold transition-colors"
              >
                Home
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-green-50 hover:text-accent block px-3 py-2 rounded-lg text-base font-bold transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="text-green-50 hover:text-accent block px-3 py-2 rounded-lg text-base font-bold transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
