
import React, { useState } from 'react';
import { ChevronLeft, MapPin, X } from 'lucide-react';
import { HospitalMap } from "./HospitalMap";
interface HospitalListProps {
  onBack: () => void;
}

interface Hospital {
  id: number;
  name: string;
  address: string;
  distance: string;
  hours: string;
   lat: number;
  lng: number;
}

export const HospitalList: React.FC<HospitalListProps> = ({ onBack }) => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  
  // Mock data for hospitals
  const hospitals: Hospital[] = [
    {
      id: 1, 
      name: 'City General Hospital', 
      address: '123 Main Street, Downtown, 10001',
      distance: '2.5 km',
      hours: 'Open 24 hours',
       lat: 19.2183,
    lng: 73.1636
    },
    {
      id: 2, 
      name: 'Mercy Medical Center', 
      address: '456 Park Avenue, Midtown, 10002',
      distance: '3.8 km',
      hours: 'Open 24 hours',
       lat: 19.2268,
    lng: 73.1452
    },
    {
      id: 3, 
      name: 'St. John\'s Hospital', 
      address: '789 Broadway, Uptown, 10003',
      distance: '5.2 km',
      hours: '8:00 AM - 8:00 PM',
      lat: 19.2476,
    lng: 73.1725
    },
  ];
  const requests = JSON.parse(
  localStorage.getItem("blood-requests") || "[]"
);

const latestRequest =
  requests.length > 0 ? requests[requests.length - 1] : null;

const userLocation = latestRequest?.userLocation || null;
  const openMap = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <button 
        onClick={onBack}
        className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground transition-colors button-effect"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Donors
      </button>
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Nearby Hospitals</h2>
        <p className="text-muted-foreground">
          Select a hospital to view details and location
        </p>
        {userLocation ? (
    <HospitalMap
      hospitals={hospitals}
      userLocation={userLocation}
    />
  ) : (
    <div className="rounded-xl border p-6 text-muted-foreground bg-secondary/20">
      Your location is unavailable. Hospital locations are shown in the list below.
    </div>
  )}
      </div>
      
      {selectedHospital ? (
        <div className="bg-white p-6 rounded-xl border shadow-md animate-fade-in">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{selectedHospital.name}</h3>
            <button 
              onClick={() => setSelectedHospital(null)}
              className="text-muted-foreground hover:text-foreground button-effect"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p>{selectedHospital.address}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p>{selectedHospital.distance}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hours</p>
                <p>{selectedHospital.hours}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => openMap(selectedHospital.address)}
              className="flex-1 py-3 px-4 bg-blood text-white font-medium rounded-lg shadow-sm hover:bg-blood-dark transition-colors button-effect"
            >
              View on Map
            </button>
            <button 
              onClick={() => setSelectedHospital(null)}
              className="py-3 px-4 bg-secondary text-secondary-foreground font-medium rounded-lg shadow-sm hover:bg-secondary/80 transition-colors button-effect"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {hospitals.map(hospital => (
            <button 
              key={hospital.id}
              onClick={() => setSelectedHospital(hospital)}
              className="w-full flex items-center p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="h-12 w-12 rounded-full bg-blood/10 flex items-center justify-center mr-4">
                <MapPin className="h-6 w-6 text-blood" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{hospital.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                    {hospital.distance} away
                  </span>
                  <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                    {hospital.hours}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
