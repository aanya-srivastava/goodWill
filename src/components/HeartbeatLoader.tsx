
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface HeartbeatLoaderProps {
  onComplete: () => void;
  duration?: number;
}

export const HeartbeatLoader = ({ onComplete, duration = 3000 }: HeartbeatLoaderProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const newProgress = Math.min(100, (elapsed / duration) * 100);
      
      setProgress(newProgress);
      
      if (currentTime < endTime) {
        requestAnimationFrame(updateProgress);
      } else {
        onComplete();
      }
    };
    
    requestAnimationFrame(updateProgress);
    
    return () => {
      // Cleanup if component unmounts
    };
  }, [duration, onComplete]);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="relative">
        <Heart 
          className="heartbeat-animation text-blood h-24 w-24" 
          fill="#E63946" 
          stroke="#fff"
          strokeWidth={1.5}
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="heart-wave h-10 w-1 bg-blood rounded-full animate-pulse-wave delay-0"></div>
          <div className="heart-wave h-14 w-1 bg-blood rounded-full animate-pulse-wave delay-100"></div>
          <div className="heart-wave h-20 w-1 bg-blood rounded-full animate-pulse-wave delay-200"></div>
          <div className="heart-wave h-14 w-1 bg-blood rounded-full animate-pulse-wave delay-300"></div>
          <div className="heart-wave h-10 w-1 bg-blood rounded-full animate-pulse-wave delay-400"></div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mt-8 text-blood tracking-wider">goodwill</h1>
      <p className="text-muted-foreground mt-2">Serving humanity one heart at a time</p>
      <div className="mt-8 w-64 h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-blood transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
