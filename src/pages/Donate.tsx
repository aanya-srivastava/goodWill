
import React from 'react';
import { Header } from '../components/Header';
import { BloodDonationForm } from '../components/BloodDonationForm';
import { Heart, Droplet, Award } from 'lucide-react';

const Donate = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-blood/10">
      <Header />
      
      <main className="flex-grow flex flex-col items-center p-6">
        <div className="max-w-3xl w-full text-center mb-8 animate-slide-down">
          <div className="inline-block mb-2 px-3 py-1 bg-blood/10 text-blood rounded-full text-sm font-medium">
            Make a Difference
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blood">
            Donate Blood, Save Lives
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your blood donation can be a lifeline for those in critical need. One donation can save up to three lives.
          </p>
        </div>
        
        <div className="w-full max-w-3xl mb-8">
          <div className="bg-card rounded-xl p-6 shadow-md border border-blood/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-muted rounded-xl p-4 flex flex-col items-center text-center">
                <div className="bg-blood rounded-full p-2 mb-3">
                  <Droplet className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-blood">Every Drop Matters</h3>
                <p className="text-sm">Blood is needed every 2 seconds for surgeries, treatments, and emergencies.</p>
              </div>
              
              <div className="bg-muted rounded-xl p-4 flex flex-col items-center text-center">
                <div className="bg-blood rounded-full p-2 mb-3">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-blood">Save Three Lives</h3>
                <p className="text-sm">Each donation can be separated into red cells, plasma and platelets to help multiple patients.</p>
              </div>
              
              <div className="bg-muted rounded-xl p-4 flex flex-col items-center text-center">
                <div className="bg-blood rounded-full p-2 mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-blood">Earn 15 Points</h3>
                <p className="text-sm">Get rewarded for your generosity. Redeem points for special offers and benefits.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-4 text-blood">Why Your Donation Matters</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blood mr-2 font-bold">•</span>
                    <span>Blood cannot be manufactured – it can only come from donors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blood mr-2 font-bold">•</span>
                    <span>It helps accident victims, surgery patients, and those with blood disorders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blood mr-2 font-bold">•</span>
                    <span>Regular donation helps maintain iron levels and reduces the risk of heart disease</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blood mr-2 font-bold">•</span>
                    <span>You'll earn 15 points with each donation that can be redeemed for rewards</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blood/5 rounded-xl p-4 flex flex-col justify-center">
                <h4 className="font-semibold mb-2 text-blood">Donation Process</h4>
                <ol className="space-y-2 text-sm list-decimal pl-4">
                  <li>Registration and health history review</li>
                  <li>Mini-physical examination (temperature, pulse, blood pressure)</li>
                  <li>The actual donation takes only about 8-10 minutes</li>
                  <li>Rest and refreshment after donation</li>
                  <li>The entire process takes less than an hour</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-xl shadow-md border border-blood/10 p-8 w-full max-w-3xl">
          <BloodDonationForm />
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground bg-blood/5">
        <p>© 2025 GoodWill. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Donate;
