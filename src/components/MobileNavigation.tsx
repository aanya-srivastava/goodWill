
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Droplet, ShoppingBag, Clock, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const MobileNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  const isActive = (path: string) => location.pathname === path;
  
  const getNavItemStyles = (path: string) => {
    const baseClasses = "flex flex-col items-center justify-center";
    const activeColor = isActive(path) ? "text-blood" : "text-gray-500";
    return `${baseClasses} ${activeColor}`;
  };

  const getBgColor = (path: string) => {
    if (!isActive(path)) return "";
    
    // Pastel colors for different nav items
    const colors = {
      "/": "bg-[#FEF7CD]", // Soft Yellow
      "/donate": "bg-[#FFDEE2]", // Soft Pink
      "/pharmacy": "bg-[#D3E4FD]", // Soft Blue
      "/request": "bg-[#F2FCE2]", // Soft Green
      "/history": "bg-[#E5DEFF]", // Soft Purple
    };
    
    return colors[path as keyof typeof colors] || "bg-blood/10";
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-md">
      <div className="grid grid-cols-5 h-16">
        <Link to="/" className={getNavItemStyles('/')}>
          <div className={`p-2 rounded-full transition-transform ${getBgColor('/')} ${isActive('/') ? 'scale-110' : ''}`}>
            <Home size={20} />
          </div>
          <span className="text-xs mt-1 font-medium">Home</span>
        </Link>
        
        <Link to="/donate" className={getNavItemStyles('/donate')}>
          <div className={`p-2 rounded-full transition-transform ${getBgColor('/donate')} ${isActive('/donate') ? 'scale-110' : ''}`}>
            <Droplet size={20} />
          </div>
          <span className="text-xs mt-1 font-medium">Donate</span>
        </Link>
        
        <Link to="/pharmacy" className={getNavItemStyles('/pharmacy')}>
          <div className={`p-2 rounded-full transition-transform ${getBgColor('/pharmacy')} ${isActive('/pharmacy') ? 'scale-110' : ''}`}>
            <ShoppingBag size={20} />
          </div>
          <span className="text-xs mt-1 font-medium">Stores</span>
        </Link>
        
        <Link to="/request" className={getNavItemStyles('/request')}>
          <div className={`p-2 rounded-full transition-transform ${getBgColor('/request')} ${isActive('/request') ? 'scale-110' : ''}`}>
            <Heart size={20} />
          </div>
          <span className="text-xs mt-1 font-medium">Receive</span>
        </Link>
        
        <Link to="/history" className={getNavItemStyles('/history')}>
          <div className={`p-2 rounded-full transition-transform ${getBgColor('/history')} ${isActive('/history') ? 'scale-110' : ''}`}>
            <Clock size={20} />
          </div>
          <span className="text-xs mt-1 font-medium">History</span>
        </Link>
      </div>
    </div>
  );
};
