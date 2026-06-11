import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PointsConfetti } from '../components/PointsConfetti';

interface PointsContextType {
  points: number;
  addPoints: (amount: number) => void;
  showConfetti: boolean;
  syncPoints: () => Promise<void>;
  logout: () => void;
}

const PointsContext = createContext<PointsContextType>({
  points: 0,
  addPoints: () => {},
  showConfetti: false,
  syncPoints: async () => {},
  logout: () => {},
});

export const usePoints = () => useContext(PointsContext);

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const syncPoints = useCallback(async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setPoints(0);
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPoints(data.rewardPoints || 0);
      } else if (response.status === 401) {
        // Token might be expired, clear auth
        logout();
      }
    } catch (error) {
      console.error("Failed to sync points", error);
    }
  }, []);

  // Fetch points on load or token change
  useEffect(() => {
    syncPoints();
  }, [syncPoints]);

  const addPoints = async (amount: number) => {
    if (amount > 0) {
      setShowConfetti(true);
    }
    
    const floorAmount = Math.floor(amount);
    // We update local state immediately for UX
    setPoints((prev) => prev + floorAmount);

    if (floorAmount === 0) return;

    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        await fetch('http://localhost:8081/api/users/update-points', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ points: floorAmount })
        });
      } catch (err) {
        console.error("Failed to sync updated points", err);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setPoints(0);
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  return (
    <PointsContext.Provider value={{ points, addPoints, showConfetti, syncPoints, logout }}>
      {children}
      <PointsConfetti isVisible={showConfetti} onComplete={handleConfettiComplete} />
    </PointsContext.Provider>
  );
};
