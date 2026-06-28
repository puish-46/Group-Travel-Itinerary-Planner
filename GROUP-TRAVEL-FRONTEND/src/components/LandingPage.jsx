import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Vote, Wallet, Image, Compass, ArrowRight, MapPin, Sparkles } from 'lucide-react';
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

  const handleExploreFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      title: 'Shared Itinerary Builder',
      description: 'Collaborate with friends in real-time to plan day-by-day activities, map sights, and coordinate schedules.',
      icon: <Calendar className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Poll System',
      description: 'Can’t agree on where to eat or stay? Put it to a group vote. Set up polls and tally choices seamlessly.',
      icon: <Vote className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Expense Splitting',
      description: 'Track group purchases, lodging deposits, or tickets. Split expenses fairly and calculate equal headshares.',
      icon: <Wallet className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Shared Photo Gallery',
      description: 'Preserve all travel memories in a single album. Upload high-res group photos directly to Cloudinary.',
      icon: <Image className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-beige text-text-dark flex flex-col justify-between overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 flex items-center bg-gradient-to-b from-white to-bg-beige border-b border-slate-100">
        {/* Soft Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-70 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl opacity-70 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Travel Collaboration</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-text-dark">
                The Crew Canvas
              </h1>
              
              <p className="text-lg sm:text-2xl font-extrabold text-accent leading-snug">
                Your Crew. Your Journey. One Canvas.
              </p>
              
              <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed font-medium">
                A collaborative platform for planning group trips, managing itineraries, sharing expenses, conducting polls, and storing travel memories.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 font-bold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group text-base"
                >
                  Create Your Journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleExploreFeatures}
                  className="px-8 py-4 font-bold rounded-xl bg-white border border-slate-200 text-text-dark hover:bg-slate-50 transition-all duration-300 cursor-pointer text-base text-center"
                >
                  Explore Features
                </button>
              </div>
            </div>

            {/* Right Mockup/Illustration Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[400px] lg:max-w-none bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400"></span>
                    <span className="h-3 w-3 rounded-full bg-yellow-450"></span>
                    <span className="h-3 w-3 rounded-full bg-green-400"></span>
                  </div>
                  <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Canvas Preview</span>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="h-40 bg-gradient-to-br from-primary to-blue-600 rounded-xl p-4 flex flex-col justify-between text-white shadow-inner">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">Summer 2026</span>
                      <MapPin className="w-4 h-4 text-white/80" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">Alps Road Trip</h4>
                      <p className="text-xs text-white/80 font-medium">Switzerland • 7 Days</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-text-dark">Day 1: Basecamp Hike</span>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">9:00 AM</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-text-dark">Day 2: Peak Cable Car</span>
                      <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-lg">11:30 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-b border-slate-100 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-text-dark tracking-tight">
              Packed with Collaborative Features
            </h2>
            <p className="text-text-muted max-w-xl mx-auto text-base font-medium">
              Everything you need to keep your travel buddies organized and aligned.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-bg-beige border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex items-start gap-5"
              >
                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-dark mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-bg-beige border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-text-dark tracking-tight">About The Crew Canvas</h2>
          <p className="text-text-muted leading-relaxed text-sm sm:text-base font-medium">
            The Crew Canvas was built with a simple goal in mind: to remove the friction of organizing trips. No more endless chat threads, confusing spreadsheets, or manual expense math. By keeping group plans, opinions, receipts, and photos in one single unified place, we make travel as relaxing as it’s meant to be.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-text-muted font-semibold">
        <p>&copy; {new Date().getFullYear()} The Crew Canvas. Built for travelers everywhere.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
