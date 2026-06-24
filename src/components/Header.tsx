import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coins, Heart, LogIn } from 'lucide-react';
import { PointsModal } from './PointsModal';
import { usePoints } from '../contexts/PointsContext';
import { Cart } from './Cart';

export const Header = () => {
  const [showPointsModal, setShowPointsModal] = useState(false);
  const { points } = usePoints();
  const location = useLocation();

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center animate-fade-in bg-gradient-to-r from-blood/10 to-blood/5">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-blood flex items-center justify-center shadow-md">
          <Heart className="h-6 w-6 text-white" fill="white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight">goodwill</h1>
          <span className="text-xs text-blood">Serving Humanity</span>
        </div>
      </Link>
      
      <div className="flex items-center gap-4">
        {localStorage.getItem('userToken') || localStorage.getItem('hospitalToken') ? (
          <button 
            onClick={() => {
              localStorage.removeItem('userToken');
              localStorage.removeItem('hospitalToken');
              localStorage.removeItem('userId');
              localStorage.removeItem('userName');
              localStorage.removeItem('hospitalId');
              localStorage.removeItem('hospitalName');
              window.location.href = '/';
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors button-effect shadow-sm"
          >
            <span className="font-medium">Logout</span>
          </button>
        ) : (
          <Link 
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blood text-white hover:bg-blood-dark transition-colors button-effect shadow-sm"
          >
            <LogIn className="h-5 w-5" />
            <span className="font-medium">Login</span>
          </Link>
        )}
        <button 
          onClick={() => setShowPointsModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-blood/10 hover:bg-blood/20 transition-colors button-effect shadow-sm"
        >
          <Coins className="h-5 w-5 text-blood" />
          <span className="font-medium">{points}</span>
        </button>
        <div className="ml-2">
          <Cart />
        </div>
      </div>

      {showPointsModal && (
        <PointsModal onClose={() => setShowPointsModal(false)} />
      )}
    </header>
  );
};