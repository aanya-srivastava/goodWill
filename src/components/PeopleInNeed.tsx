

import React, { useState, useEffect } from 'react';
import { MapPin, User, Award, Heart, Droplet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '../contexts/PointsContext';

interface PeopleInNeedProps {
  donorBloodGroup: string;
}

export const PeopleInNeed: React.FC<PeopleInNeedProps> = ({ donorBloodGroup }) => {
  const { toast } = useToast();
  const { addPoints } = usePoints();
  const [hospitals, setHospitals] = useState([]);
  const [donatedTo, setDonatedTo] = useState<number | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/hospitals?bloodType=${donorBloodGroup}`)
      .then((response) => response.json())
      .then((data) => setHospitals(data))
      .catch((error) => console.error("Error fetching hospitals:", error));
  }, [donorBloodGroup]);

  const handleDonate = (hospitalId: number) => {
    fetch(`http://localhost:5000/api/donate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hospitalId, bloodType: donorBloodGroup })
    })
      .then((response) => response.json())
      .then(() => {
        setDonatedTo(hospitalId);
        addPoints(10);
        toast({ title: 'Donation Successful', description: 'You have donated blood and earned points!' });
      })
      .catch((error) => console.error("Error donating blood:", error));
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2">Hospitals in Need of {donorBloodGroup} Blood</h2>
      <ul>
        {hospitals.map((hospital) => (
          <li key={hospital.id} className="flex justify-between items-center p-2 border-b">
            <span>{hospital.name} ({hospital.location})</span>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={() => handleDonate(hospital.id)}
              disabled={donatedTo === hospital.id}
            >
              {donatedTo === hospital.id ? 'Donated' : 'Donate'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
