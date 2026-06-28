import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, LayoutDashboard, User, LogOut, Menu, X, Route } from 'lucide-react';
import useAuthStore from '../store/authStore.js';

const Navbar = () => {
  const { isAuthenticated, logout, currentUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `relative px-3 py-2 text-sm font-semibold transition-all duration-300 ${
      isActive(path)
        ? 'text-primary'
        : 'text-text-muted hover:text-primary'
    }`;

  const mobileNavLinkClass = (path) =>
    `block px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 ${
      isActive(path)
        ? 'bg-primary/5 text-primary border-l-4 border-accent'
        : 'text-text-muted hover:text-primary hover:bg-slate-50'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & App name */}
          <div className="flex items-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              className="flex items-center gap-2.5 text-text-dark font-bold tracking-tight group"
            >
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:rotate-6 transition-transform duration-300">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-text-dark font-extrabold text-base sm:text-lg block tracking-tight">
                The Crew Canvas
              </span>
            </Link>
          </div>

          {/* Right: Navigation items */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  Dashboard
                  {isActive('/dashboard') && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent rounded-full"></span>
                  )}
                </Link>
                <Link to="/profile" className={navLinkClass('/profile')}>
                  Profile
                  {isActive('/profile') && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent rounded-full"></span>
                  )}
                </Link>

                {/* User avatar/name */}
                <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shadow-inner">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'T'}
                  </div>
                  <span className="text-xs font-bold text-text-dark max-w-[100px] truncate">
                    {currentUser?.name || 'Traveler'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-primary text-primary bg-transparent hover:bg-primary/5 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className={navLinkClass('/')}>
                  Home
                  {isActive('/') && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent rounded-full"></span>
                  )}
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-primary text-primary bg-transparent hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
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
              className="inline-flex items-center justify-center p-2 rounded-xl text-text-muted hover:text-text-dark hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-2 shadow-inner">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkClass('/dashboard')}
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkClass('/profile')}
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </span>
              </Link>

              {/* Mobile User details */}
              <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {currentUser?.name?.charAt(0).toUpperCase() || 'T'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-text-dark leading-tight">{currentUser?.name || 'Traveler'}</p>
                  <p className="text-[10px] text-text-muted font-medium truncate">{currentUser?.email || ''}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2.5 text-base font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={mobileNavLinkClass('/')}
              >
                Home
              </Link>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-center text-sm font-bold rounded-xl border border-primary text-primary bg-transparent hover:bg-primary/5 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-center text-sm font-bold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-sm transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
