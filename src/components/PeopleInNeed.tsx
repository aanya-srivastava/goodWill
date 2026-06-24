import React, { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "../contexts/PointsContext";
import { HospitalProfile } from "@/components/HospitalProfile";
import { DonationConfirmation } from "@/components/DonationConfirmation";
import { Skeleton } from "@/components/ui/skeleton";

interface Hospital {
  _id: string;
  name: string;
  bloodUnits: {
    [key: string]: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface DonationRequest {
  _id: string;
  status: string;
}

interface PeopleInNeedProps {
  donorBloodGroup: string;
}

export const PeopleInNeed: React.FC<PeopleInNeedProps> = ({ donorBloodGroup }) => {
  const { toast } = useToast();
  const { addPoints, syncPoints } = usePoints();
  const [donatedTo, setDonatedTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [donationUnits, setDonationUnits] = useState<number>(1);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showOtpConfirmation, setShowOtpConfirmation] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<DonationRequest | null>(null);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHospitals();
  }, [donorBloodGroup]);

  const fetchHospitals = () => {
    fetch("http://localhost:8081/api/hospitals")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch hospitals.");
        }
        return response.json();
      })
      .then((data: Hospital[]) => {
        setHospitals(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hospitals:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to fetch hospitals. Please try again.",
        });
      });
  };

  const createDonationRequest = async (hospital: Hospital) => {
    setIsCreatingRequest(true);
    try {
      const currentUserId = localStorage.getItem('userId');
      const currentUserName = localStorage.getItem('userName');
      
      if (!currentUserId || !currentUserName) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make a donation.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`http://localhost:8081/api/hospitals/${hospital._id}/donation-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          userName: currentUserName,
          units: donationUnits,
          bloodType: donorBloodGroup,
          status: 'pending',
          createdAt: new Date()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create donation request');
      }

      const data = await response.json();
      setCurrentRequest(data);
      setShowOtpConfirmation(true);
      
      toast({
        title: "Request Created",
        description: "Please ask the hospital staff to generate an OTP for your donation.",
      });
    } catch (error) {
      console.error('Error creating donation request:', error);
      toast({
        title: "Error",
        description: "Failed to create donation request. Please try again.",
      });
    } finally {
      setIsCreatingRequest(false);
    }
  };

  const handleDonate = async (otp: string) => {
    if (!selectedHospital || !currentRequest) return;
    setIsVerifyingOtp(true);

    try {
      const response = await fetch(
        `http://localhost:8081/api/hospitals/${selectedHospital._id}/verify-otp/${currentRequest._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp }),
        }
      );

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      setDonatedTo(selectedHospital._id);
      
      // Sync points from the backend
      await syncPoints();
      
      // Trigger confetti visually
      addPoints(0.0001);
      
      const pointsEarned = 15 * donationUnits;
      toast({
        title: "Congratulations!",
        description: `You've earned ${pointsEarned} points for your donation of ${donationUnits} units.`,
      });
      
      fetchHospitals();
      setSelectedHospital(null);
      setShowOtpConfirmation(false);
      setCurrentRequest(null);
    } catch (error) {
      console.error('Error verifying donation:', error);
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleHospitalClick = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const handleProfileClose = () => {
    setSelectedHospital(null);
  };

  const handleProfileDonate = () => {
    if (selectedHospital) {
      createDonationRequest(selectedHospital);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto py-8 animate-fade-in">
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-white rounded-xl border shadow-sm">
              <Skeleton className="h-5 w-40 mb-2" />
              <div className="space-y-1 mt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-32 mt-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Hospitals in Need</h2>
        <p className="text-muted-foreground">
          {hospitals.length > 0
            ? `We found ${hospitals.length} hospitals in need of blood`
            : "No hospitals found."}
        </p>
      </div>

      {donatedTo ? (
        <div className="text-center py-8 animate-fade-in">
          <h3 className="text-xl font-bold mb-2">Thank You for Your Donation!</h3>
          <p className="text-lg mb-2">You've earned {15 * donationUnits} points.</p>
          <button
            onClick={() => setDonatedTo(null)}
            className="px-4 py-2 bg-blood text-white font-medium rounded-lg shadow-sm hover:bg-blood-dark transition-colors"
          >
            Make Another Donation
          </button>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <div
                key={hospital._id}
                className="p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleHospitalClick(hospital)}
              >
                <h3 className="font-medium">{hospital.name}</h3>
                <div className="space-y-1 mt-2">
                  {Object.entries(hospital.bloodUnits).map(([type, units]) => (
                    <p key={type} className="text-sm text-muted-foreground">
                      {type}: {units} units
                    </p>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-blood mt-3">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">Click to view details</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-blood/5 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No hospitals found</h3>
              <p className="text-muted-foreground">
                There are currently no hospitals requesting blood. Please check back later.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedHospital && !showOtpConfirmation && (
        <HospitalProfile
          hospital={selectedHospital}
          onClose={handleProfileClose}
          onDonate={handleProfileDonate}
          isLoading={isCreatingRequest}
        />
      )}

      {selectedHospital && showOtpConfirmation && (
        <DonationConfirmation
          hospital={selectedHospital}
          units={donationUnits}
          onClose={() => {
            setShowOtpConfirmation(false);
            setCurrentRequest(null);
          }}
          onConfirm={handleDonate}
          isLoading={isVerifyingOtp}
        />
      )}
    </div>
  );
};