
import React, { useState } from 'react';
import { DonorList } from './DonorList';
import { toast } from '@/components/ui/use-toast';
import { Calendar, MapPin, Loader, Droplet, Loader2 } from 'lucide-react';

export const BloodRequestForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'male',
    phone: '',
    bloodGroup: 'A+',
    amount: '',
    hospital: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      // Save patient request to localStorage
      const existingRequests = JSON.parse(localStorage.getItem('blood-requests') || '[]');
      const updatedRequests = [...existingRequests, formData];
      localStorage.setItem('blood-requests', JSON.stringify(updatedRequests));
      
      // Scroll to the top of the page
      window.scrollTo(0, 0);
      
      setIsSubmitting(false);
      setIsSearching(true);
      
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
        setIsSubmitted(true);
        
        toast({
          title: "Request submitted",
          description: "We're connecting you with compatible donors in your area.",
          variant: "default",
        });
      }, 2000);
    }, 1500);
  };

  const getLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location obtained:", position.coords);
          // Get address from coordinates using reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log("Geocoding data:", data);
              let address = '';
              
              if (data && data.display_name) {
                address = data.display_name;
              } else if (data && data.address) {
                // Construct address from components if available
                const addr = data.address;
                const components = [
                  addr.road,
                  addr.suburb,
                  addr.city || addr.town || addr.village,
                  addr.state,
                  addr.postcode,
                  addr.country
                ].filter(Boolean);
                address = components.join(', ');
              } else {
                // Fallback to coordinates
                address = `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`;
              }
              
              setFormData(prev => ({ ...prev, address }));
              toast({
                title: "Location detected",
                description: "Your current location has been added to the form.",
              });
              setIsGettingLocation(false);
            })
            .catch(error => {
              console.error("Error getting address:", error);
              setFormData(prev => ({ 
                ...prev, 
                address: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}` 
              }));
              setIsGettingLocation(false);
              toast({
                title: "Address lookup failed",
                description: "Only coordinates available. Please enter your address manually.",
                variant: "destructive",
              });
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGettingLocation(false);
          
          let errorMessage = "Couldn't access your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += " Please check your browser permissions.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += " Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += " The request to get location timed out.";
              break;
          }
          
          toast({
            title: "Location error",
            description: errorMessage,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsGettingLocation(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return <DonorList bloodGroup={formData.bloodGroup} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {isSearching ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="relative inline-block mb-6">
            <div className="h-16 w-16 rounded-full border-4 border-blood border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Droplet className="h-8 w-8 text-blood animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-blood">Searching for donors...</h2>
          <p className="text-muted-foreground">Looking for compatible {formData.bloodGroup} donors near you</p>
          
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blood animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-blood animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 rounded-full bg-blood animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blood">Request Blood Donation</h2>
            <p className="text-muted-foreground">Please fill in the patient details</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="patientName" className="block text-sm font-medium">
                Patient Name
              </label>
              <input
                id="patientName"
                name="patientName"
                type="text"
                required
                value={formData.patientName}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Patient's full name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-medium">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                required
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Patient's age"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Contact number"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bloodGroup" className="block text-sm font-medium">
                Blood Group
              </label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                required
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium">
                Amount Required (units)
                1 units = 350ml 
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                required
                min="1"
                value={formData.amount}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Number of units needed"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="hospital" className="block text-sm font-medium">
                Hospital Name
              </label>
              <input
                id="hospital"
                name="hospital"
                type="text"
                required
                value={formData.hospital}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Name of hospital"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium">
                Address
              </label>
              <div className="flex gap-2">
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Hospital or patient location"
                />
                <button 
                  type="button"
                  onClick={getLocation}
                  className="px-3 py-2 bg-blood/20 hover:bg-blood/30 text-blood rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || isGettingLocation}
                  title="Use current location"
                >
                  {isGettingLocation ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <MapPin className="h-5 w-5" />
                  )}
                </button>
              </div>
              {isGettingLocation && (
                <p className="text-xs text-muted-foreground mt-1">Detecting your location...</p>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blood text-white font-medium rounded-lg shadow-sm hover:bg-blood-dark transition-colors button-effect disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
