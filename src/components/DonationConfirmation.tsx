import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Hospital {
  _id: string;
  name: string;
  bloodUnits: {
    [key: string]: number;
  };
}

interface DonationConfirmationProps {
  hospital: Hospital;
  units: number;
  onClose: () => void;
  onConfirm: (otp: string) => void;
  isLoading?: boolean;
}

export const DonationConfirmation: React.FC<DonationConfirmationProps> = ({
  hospital,
  units,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(otp);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Confirm Donation</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-gray-600">
            Please enter the OTP provided by {hospital.name} to confirm your donation
            of {units} unit(s) of blood.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blood focus:border-transparent"
                placeholder="Enter the OTP"
                required
                pattern="[0-9]{4}"
                maxLength={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-blood text-white font-medium rounded-lg hover:bg-blood-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Confirm Donation"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 