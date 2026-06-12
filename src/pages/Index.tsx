import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, PlusCircle, Pill, Heart, Users, ArrowUp } from 'lucide-react';
import { Header } from '../components/Header';
import { HeartbeatLoader } from '../components/HeartbeatLoader';
import { MobileNavigation } from '../components/MobileNavigation';

// Simulate statistics that would come from a backend
const getInitialStats = () => {
  const storedStats = localStorage.getItem('goodwill-stats');
  if (storedStats) {
    return JSON.parse(storedStats);
  }
  
  return {
    donationsCount: 2481,
    usersCount: 5723,
    recipientsCount: 1897,
    lastVisit: null
  };
};

const Index = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [stats, setStats] = useState(getInitialStats());
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [animatedDonations, setAnimatedDonations] = useState(0);
  const [animatedUsers, setAnimatedUsers] = useState(0);
  const [animatedRecipients, setAnimatedRecipients] = useState(0);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const now = new Date().getTime();
    const lastVisit = stats.lastVisit;
    const isNewSession = !lastVisit || (now - lastVisit > 30 * 60 * 1000);
    
    if (isNewSession) {
      const newStats = {
        ...stats,
        usersCount: stats.usersCount + 1,
        lastVisit: now
      };
      
      setStats(newStats);
      localStorage.setItem('goodwill-stats', JSON.stringify(newStats));
    } else {
      const newStats = {
        ...stats,
        lastVisit: now
      };
      setStats(newStats);
      localStorage.setItem('goodwill-stats', JSON.stringify(newStats));
    }
    
    setTimeout(() => {
      setStatsLoaded(true);
    }, 1000);
  }, []);
  
  useEffect(() => {
    if (!statsLoaded) return;
    
    const duration = 2000;
    const startTime = Date.now();
    
    const animateCounters = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimatedDonations(Math.floor(progress * stats.donationsCount));
      setAnimatedUsers(Math.floor(progress * stats.usersCount));
      setAnimatedRecipients(Math.floor(progress * stats.recipientsCount));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateCounters);
      }
    };
    
    animationRef.current = requestAnimationFrame(animateCounters);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [statsLoaded, stats]);
  
  const handleLoaderComplete = () => {
    setShowLoader(false);
  };
  
  return (
    <>
      {showLoader && <HeartbeatLoader onComplete={handleLoaderComplete} />}
      
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        
    <main className="flex-grow">
      
          {/* TOP HERO POSTER SECTION (With Slate-Gray Theme from image_93689f.png) */}
          <section className="relative h-[340px] md:h-[420px] w-full flex items-center justify-center overflow-hidden bg-slate-700">
            {/* Real Unsplash medical/donation background photograph */}
            <div 
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay transform scale-100"
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1600&auto=format&fit=crop')` 
              }}
            />
            {/* Slate-gray overlay wash matching image_93689f.png to ensure crisp contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/80 via-slate-700/60 to-slate-900/80" />
            
            {/* Fine vignette layout frame shadow detailing */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.4)] pointer-events-none" />
            
            {/* Content inside the poster */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center animate-slide-down">
              <span className="text-slate-200 font-bold uppercase tracking-widest text-xs md:text-sm block mb-3 drop-shadow-sm">
                Welcome to Goodwill Center
              </span>
              <h1 className="text-2xl md:text-5xl font-black uppercase text-white tracking-tight mb-4 max-w-3xl mx-auto leading-tight drop-shadow-md">
                Donate Blood and Get Real Blessings
              </h1>
             <p className="text-sm md:text-base text-slate-200 max-w-2xl mx-auto font-sans font-light tracking-wide leading-relaxed mb-6 drop-shadow-sm">
  Blood is the most precious gift that anyone can give to another person. <br className="hidden md:inline" />
  Donating blood not only saves that life, but also saves owner's lives.
</p>
              
              <div className="flex items-center justify-center gap-3">
                <Link to="/request" className="px-5 py-2.5 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider rounded-none border border-transparent hover:bg-neutral-800 transition-colors button-effect shadow-md">
                  Request Blood
                </Link>
                {/* Accent red button color pull inspired by the primary actions in image_93689f.png */}
                <Link to="/donate" className="px-5 py-2.5 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-none border border-transparent hover:bg-red-700 transition-colors button-effect shadow-md">
                  Donate Blood
                </Link>
              </div>
            </div>
          </section>

          {/* Overlapping Counter Dashboard Row */}
          <section className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-none border border-slate-200 shadow-md flex justify-between items-center transform hover:translate-y-[-2px] transition-all">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {statsLoaded ? animatedDonations.toLocaleString() : '...'}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Blood donations</p>
                </div>
                <div className="h-9 w-9 bg-rose-50 rounded-lg flex items-center justify-center">
                  <Droplet className="h-4 w-4 text-red-500 fill-red-100" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-none border border-slate-200 shadow-md flex justify-between items-center transform hover:translate-y-[-2px] transition-all">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {statsLoaded ? animatedUsers.toLocaleString() : '...'}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Active users</p>
                </div>
                <div className="h-9 w-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-none border border-slate-200 shadow-md flex justify-between items-center transform hover:translate-y-[-2px] transition-all">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {statsLoaded ? animatedRecipients.toLocaleString() : '...'}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Lives impacted</p>
                </div>
                <div className="h-9 w-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-emerald-500 fill-emerald-50" />
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Grid Layout: Action Links + Informational Block Panels */}
          <section className="max-w-4xl mx-auto px-6 pt-16 pb-12">
            <h2 className="text-base font-bold text-slate-900 mb-6 tracking-tight">How can we help you?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              {/* Side Shortcuts Stack */}
              <div className="md:col-span-4 flex flex-col gap-3">
                <Link to="/request" className="flex items-center gap-3 p-4 bg-red-500 text-white rounded-xl shadow-sm hover:bg-red-600 transition-colors group button-effect">
                  <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Droplet className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm">Receive Blood</h3>
                    <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">Request blood items when in need</p>
                  </div>
                </Link>
                
                <Link to="/donate" className="flex items-center gap-3 p-4 bg-red-400/95 text-white rounded-xl shadow-sm hover:bg-red-500 transition-colors group button-effect">
                  <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <PlusCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm">Donate Blood</h3>
                    <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">Save lives with blood donation</p>
                  </div>
                </Link>

                <Link to="/pharmacy" className="flex items-center gap-3 p-4 bg-red-400/90 text-white rounded-xl shadow-sm hover:bg-red-500 transition-colors group button-effect">
                  <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Pill className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm">Pharmacy Essentials</h3>
                    <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">Access medical resources</p>
                  </div>
                </Link>
              </div>

              {/* Informational Double Column Card Block Box */}
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-100 bg-slate-50/50 rounded-2xl p-5">
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1.5">Why Donate Blood?</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Every blood donation can save up to three lives. Blood cannot be manufactured; it can only come from generous donors like you.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-red-500 mt-3">
                    <Heart className="h-4 w-4 pulse-blood fill-red-100" />
                    <span className="font-bold text-xs">Be a lifesaver today</span>
                  </div>
                </div>

                <div className="bg-rose-50/60 rounded-xl p-4 flex flex-col justify-center border border-rose-100/40">
                  <h4 className="font-bold text-xs text-slate-800 mb-2">Did you know?</h4>
                  <ul className="space-y-2 text-[11px] text-slate-600 leading-normal">
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-500 font-bold">•</span>
                      <span>Your body replenishes the blood you donate within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-500 font-bold">•</span>
                      <span>One unit of blood can be separated into red cells, plasma and platelets</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-500 font-bold">•</span>
                      <span>A single car accident victim can require up to 100 units of blood</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Blood Donation Poster Banner */}
<div className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-4 px-6 shadow-md relative overflow-hidden">
  {/* Ambient decorative background pattern */}
  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
  
  <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
    <div className="flex items-center gap-3 text-center sm:text-left">
      <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
        <Heart className="h-5 w-5 text-white fill-white" />
      </div>
      <div>
        <h4 className="font-extrabold tracking-wide text-sm md:text-base uppercase">
          Every Drop Counts • Be A Hero Today
        </h4>
        <p className="text-xs text-rose-100 mt-0.5">
          Your single donation can save up to 3 lives. Check local active emergency requests below.
        </p>
      </div>
    </div>
    
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 text-xs font-bold tracking-wider uppercase shrink-0">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
      12 Active Urgencies Near You
    </div>
  </div>
</div>
        
        <footer className="py-6 border-t border-slate-50 text-center text-xs text-slate-400 font-medium">
          <p>© 2025 GoodWill. All rights reserved.</p>
        </footer>
        
        <MobileNavigation />
      </div>
    </>
  );
};

export default Index;