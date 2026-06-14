import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      title: 'Shared Itinerary Builder',
      description: 'Collaborate with friends in real-time to plan day-by-day activities, map sights, and coordinate schedules.',
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Poll System',
      description: 'Can’t agree on where to eat or stay? Put it to a group vote. Set up polls and tally choices seamlessly.',
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Expense Splitting',
      description: 'Track group purchases, lodging deposits, or tickets. Split expenses fairly and calculate equal headshares.',
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Shared Photo Gallery',
      description: 'Preserve all travel memories in a single album. Upload high-res group photos directly to Cloudinary.',
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-bg-beige text-text-dark flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-primary/10 via-mountain/5 to-transparent rounded-full filter blur-3xl opacity-60 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-text-dark max-w-4xl mx-auto">
            The Crew Canvas
          </h1>
          <p className="mt-4 text-lg sm:text-2xl font-extrabold text-accent">
            Your Crew. Your Journey. One Canvas.
          </p>
          <p className="mt-6 text-base sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed font-medium">
            A collaborative platform for planning group trips, managing itineraries, sharing expenses, conducting polls, and storing travel memories.
          </p>
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 font-bold rounded-xl bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-102 transition-all cursor-pointer text-base"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-text-dark">Packed with Collaborative Features</h2>
            <p className="mt-3 text-text-muted max-w-xl mx-auto text-sm font-medium">Everything you need to keep your travel buddies organized and aligned.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm hover:border-primary/50 hover:shadow-md transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-3">{feature.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-text-dark mb-6">About The Crew Canvas</h2>
          <p className="text-text-muted leading-relaxed text-sm md:text-base font-medium">
            The Crew Canvas was built with a simple goal in mind: to remove the friction of organizing trips. No more endless chat threads, confusing spreadsheets, or manual expense math. By keeping group plans, opinions, receipts, and photos in one single unified place, we make travel as relaxing as it’s meant to be.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-hover bg-primary py-8 text-center text-xs text-green-100">
        <p>&copy; {new Date().getFullYear()} The Crew Canvas</p>
      </footer>
    </div>
  );
};

export default LandingPage;
