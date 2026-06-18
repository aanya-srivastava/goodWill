import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogOut, Droplet, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface BloodUnit {
  type: string;
  units: number;
}

interface DonationRequest {
  _id: string;
  userName: string;
  units: number;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}

interface DonationHistory {
  _id: string;
  userName: string;
  units: number;
  bloodType: string;
  status: 'completed' | 'rejected';
  completedAt: string;
}

export const HospitalDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bloodInventory, setBloodInventory] = useState<BloodUnit[]>([]);
  const [pendingRequests, setPendingRequests] = useState<DonationRequest[]>([]);
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingOtpId, setGeneratingOtpId] = useState<string | null>(null);
  const hospitalName = localStorage.getItem('hospitalName') || 'Hospital';
  const hospitalToken = localStorage.getItem('hospitalToken');

  useEffect(() => {
    if (!hospitalToken) {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [hospitalToken]);

  const fetchDashboardData = async () => {
    try {
      // Fetch blood inventory
      const inventoryResponse = await fetch('http://localhost:8081/api/hospitals/inventory', {
        headers: {
          'Authorization': `Bearer ${hospitalToken}`,
        },
      });

      // Fetch pending requests
      const requestsResponse = await fetch('http://localhost:8081/api/hospitals/donations/pending', {
        headers: {
          'Authorization': `Bearer ${hospitalToken}`,
        },
      });

      // Fetch donation history
      const historyResponse = await fetch('http://localhost:8081/api/hospitals/donations/history', {
        headers: {
          'Authorization': `Bearer ${hospitalToken}`,
        },
      });

      if (!inventoryResponse.ok || !requestsResponse.ok || !historyResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [inventory, requests, history] = await Promise.all([
        inventoryResponse.json(),
        requestsResponse.json(),
        historyResponse.json(),
      ]);

      setBloodInventory(inventory);
      setPendingRequests(requests);
      setDonationHistory(history);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateOTP = async (requestId: string) => {
    setGeneratingOtpId(requestId);
    try {
      const hospitalId = localStorage.getItem('hospitalId');
      const response = await fetch(`http://localhost:8081/api/hospitals/${hospitalId}/generate-otp/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hospitalToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate OTP');
      }

      const { otp } = await response.json();
      toast({
        title: "OTP Generated",
        description: `OTP for verification: ${otp}`,
      });

      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate OTP.",
      });
    } finally {
      setGeneratingOtpId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hospitalToken');
    localStorage.removeItem('hospitalId');
    localStorage.removeItem('hospitalName');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-6 w-8" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-4 border-b last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-8 w-28 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-4 border-b last:border-b-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-28 mt-1" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-6 w-6 text-blood" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                {hospitalName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blood bg-blood/5 hover:bg-blood/10"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Blood Inventory */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blood Inventory</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {bloodInventory.map((blood) => (
                <div key={blood.type} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Droplet className="h-5 w-5 text-blood mr-2" />
                      <span className="font-medium">{blood.type}</span>
                    </div>
                    <span className="text-xl font-bold">{blood.units}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Requests */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Requests</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No pending requests
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {pendingRequests.map((request) => (
                    <li key={request._id} className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {request.userName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.units} units requested
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => generateOTP(request._id)}
                          disabled={generatingOtpId === request._id}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blood hover:bg-blood-dark disabled:opacity-50 disabled:cursor-not-allowed gap-1"
                        >
                          {generatingOtpId === request._id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            "Generate OTP"
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Donation History */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Donation History</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {donationHistory.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No donation history
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {donationHistory.map((donation) => (
                    <li key={donation._id} className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            {donation.status === 'completed' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <p className="text-sm font-medium text-gray-900">
                              {donation.userName}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {donation.units} units of {donation.bloodType}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(donation.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 