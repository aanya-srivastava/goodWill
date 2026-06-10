
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, PlusCircle, Pill, Heart, Users, ArrowUp, BarChart3 } from 'lucide-react';
import { Header } from '../components/Header';
import { HeartbeatLoader } from '../components/HeartbeatLoader';
import { MobileNavigation } from '../components/MobileNavigation';

// Simulate statistics that would come from a backend
const getInitialStats = () => {
  // Get stored stats or use defaults
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
  const animationRef = useRef(null);

  useEffect(() => {
    // Check if this is a new session (more than 30 min since last visit)
    const now = new Date().getTime();
    const lastVisit = stats.lastVisit;
    const isNewSession = !lastVisit || (now - lastVisit > 30 * 60 * 1000);

    if (isNewSession) {
      // Increment users count if this is a new session
      const newStats = {
        ...stats,
        usersCount: stats.usersCount + 1,
        lastVisit: now
      };

      setStats(newStats);
      localStorage.setItem('goodwill-stats', JSON.stringify(newStats));
    } else {
      // Just update last visit time
      const newStats = {
        ...stats,
        lastVisit: now
      };
      setStats(newStats);
      localStorage.setItem('goodwill-stats', JSON.stringify(newStats));
    }

    // Simulate loading stats from server
    setTimeout(() => {
      setStatsLoaded(true);
    }, 1000);
  }, []);

  // Animate the counters
  useEffect(() => {
    if (!statsLoaded) return;

    const duration = 2000; // 2 seconds for counter animation
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

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-white to-blood/5">
        <Header />

        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="max-w-3xl w-full text-center mb-8 animate-slide-down">
            <div className="inline-block mb-2 px-3 py-1 bg-blood/10 text-blood rounded-full text-sm font-medium">
              Serving Humanity
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Your trusted platform for blood donation and medical help
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with donors, request blood, and access essential medical resources all in one place.
            </p>
          </div>

          {/* Stats Section */}
          <div className="w-full max-w-3xl mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-blood/10 transform hover:translate-y-[-5px] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 bg-[#FFDEE2] rounded-xl flex items-center justify-center">
                    <Droplet className="h-6 w-6 text-blood" />
                  </div>
                  <ArrowUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold mb-1 animate-count-up">
                  {statsLoaded ? animatedDonations.toLocaleString() : '...'}
                </h3>
                <p className="text-sm text-gray-500">Blood donations</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-blood/10 transform hover:translate-y-[-5px] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 bg-[#D3E4FD] rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <ArrowUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold mb-1 animate-count-up">
                  {statsLoaded ? animatedUsers.toLocaleString() : '...'}
                </h3>
                <p className="text-sm text-gray-500">Active users</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-blood/10 transform hover:translate-y-[-5px] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 bg-[#F2FCE2] rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-green-500" />
                  </div>
                  <ArrowUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold mb-1 animate-count-up">
                  {statsLoaded ? animatedRecipients.toLocaleString() : '...'}
                </h3>
                <p className="text-sm text-gray-500">Lives impacted</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-3xl mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blood/10 via-blood/5 to-blood/10 rounded-2xl transform -rotate-1"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-md border border-blood/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold mb-2">Why Donate Blood?</h3>
                    <p className="text-muted-foreground mb-3">Every blood donation can save up to three lives. Blood cannot be manufactured; it can only come from generous donors like you.</p>
                    <div className="flex items-center gap-2 text-blood">
                      <Heart className="h-5 w-5 pulse-blood" />
                      <span className="font-medium">Be a lifesaver today</span>
                    </div>
                  </div>
                  <div className="bg-blood/5 rounded-xl p-4 flex flex-col justify-center">
                    <h4 className="font-semibold mb-2">Did you know?</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blood">•</span>
                        <span>Your body replenishes the blood you donate within 24 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blood">•</span>
                        <span>One unit of blood can be separated into red cells, plasma and platelets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blood">•</span>
                        <span>A single car accident victim can require up to 100 units of blood</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <div className="text-center mb-8 animate-slide-up">
              <h2 className="text-2xl font-bold mb-8">How can we help you?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
              <Link to="/request" className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-white to-blood/5 border border-blood/10 shadow-sm hover:shadow-md transition-all group">
                <div className="h-16 w-16 rounded-full bg-blood/10 flex items-center justify-center mb-4 group-hover:bg-blood/20 transition-colors">
                  <Droplet className="h-8 w-8 text-blood" />
                </div>
                <h3 className="font-semibold text-lg">Receive Blood</h3>
                <p className="text-muted-foreground text-sm mt-2 text-center">Request blood when you or someone you know needs it</p>
              </Link>

              <Link to="/donate" className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-white to-blood/5 border border-blood/10 shadow-sm hover:shadow-md transition-all group">
                <div className="h-16 w-16 rounded-full bg-blood/10 flex items-center justify-center mb-4 group-hover:bg-blood/20 transition-colors">
                  <PlusCircle className="h-8 w-8 text-blood" />
                </div>
                <h3 className="font-semibold text-lg">Donate Blood</h3>
                <p className="text-muted-foreground text-sm mt-2 text-center">Save lives by donating your blood to those in need</p>
              </Link>

              <Link to="/pharmacy" className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-white to-blood/5 border border-blood/10 shadow-sm hover:shadow-md transition-all group">
                <div className="h-16 w-16 rounded-full bg-blood/10 flex items-center justify-center mb-4 group-hover:bg-blood/20 transition-colors">
                  <Pill className="h-8 w-8 text-blood" />
                </div>
                <h3 className="font-semibold text-lg">Pharmacy Essentials</h3>
                <p className="text-muted-foreground text-sm mt-2 text-center">Access essential medical supplies and medications</p>
              </Link>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 GoodWill. All rights reserved.</p>
        </footer>

        <MobileNavigation />
      </div>
    </>
  );
};

export default Index;
