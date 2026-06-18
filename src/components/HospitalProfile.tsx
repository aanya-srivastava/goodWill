import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Hospital {
  _id: string;
  name: string;
  bloodUnits: {
    [key: string]: number;
  };
}

interface HospitalProfileProps {
  hospital: Hospital;
  onClose: () => void;
  onDonate: () => void;
  isLoading?: boolean;
}

export const HospitalProfile: React.FC<HospitalProfileProps> = ({
  hospital,
  onClose,
  onDonate,
  isLoading = false,
}) => {
  const [units, setUnits] = useState(1);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{hospital.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="font-medium mb-2">Current Blood Units</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(hospital.bloodUnits).map(([type, units]) => (
                <div
                  key={type}
                  className="p-2 bg-gray-50 rounded-lg text-center"
                >
                  <div className="text-sm text-gray-500">{type}</div>
                  <div className="font-medium">{units} units</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Units to Donate
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={units}
              onChange={(e) => setUnits(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blood focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDonate}
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-blood text-white font-medium rounded-lg hover:bg-blood-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Donate Blood"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}; 