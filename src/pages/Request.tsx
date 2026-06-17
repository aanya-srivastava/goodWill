
import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import { BloodRequestForm } from '../components/BloodRequestForm';
import { Droplet, Heart, Clock } from 'lucide-react';
import { MobileNavigation } from '../components/MobileNavigation';
import DonorAvailabilityDashboard from '@/components/DonorAvailabilityDashboard';

const Request = () => {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-blood/10">
      <Header />
      
      <main className="flex-grow flex flex-col items-center p-6 pb-20">
        <div className="max-w-3xl w-full text-center mb-8 animate-slide-down">
          <div className="inline-block mb-2 px-3 py-1 bg-blood/10 text-blood rounded-full text-sm font-medium">
            Emergency Blood Request
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blood">
            Request Blood Donation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We'll help you find compatible donors in your area quickly. Fill out the form below with patient details.
          </p>
        </div>
        
        <div className="w-full max-w-3xl mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-blood/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blood flex items-center justify-center mr-3">
                  <Droplet className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-blood">Quick Response</h3>
                  <p className="text-xs text-muted-foreground">We connect patients with donors rapidly</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blood flex items-center justify-center mr-3">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-blood">Verified Donors</h3>
                  <p className="text-xs text-muted-foreground">All our donors are screened and verified</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blood flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-blood">24/7 Support</h3>
                  <p className="text-xs text-muted-foreground">Emergency assistance always available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DonorAvailabilityDashboard/>
        <div className="bg-white rounded-xl shadow-md border border-blood/10 p-8 w-full max-w-3xl">
          <BloodRequestForm />
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground bg-blood/5">
        <p>© 2025 GoodWill. All rights reserved.</p>
      </footer>
      
      <MobileNavigation />
    </div>
  );
};

export default Request;
