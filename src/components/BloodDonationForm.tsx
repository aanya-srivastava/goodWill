
import React, { useState, useEffect } from 'react';
import { PeopleInNeed } from './PeopleInNeed';
import { usePoints } from '../contexts/PointsContext';
import { toast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DonorData {
  donorName: string;
  age: string;
  gender: string;
  phone: string;
  bloodGroup: string;
  availability: Date | undefined;
  address: string;
  recentlyDonated: string;
}

export const BloodDonationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState<DonorData>({
    donorName: '',
    age: '',
    gender: 'male',
    phone: '',
    bloodGroup: 'A+',
    availability: undefined,
    address: '',
    recentlyDonated: 'no'
  });

  // Get current location
  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          setFormData(prev => ({ ...prev, address: `${latitude}, ${longitude}` }));
          setLoading(false);
          toast({
            title: "Location detected",
            description: "Your current location has been saved.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
          toast({
            title: "Location error",
            description: "Unable to get your location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      setLoading(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter address manually.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (date) {
      setFormData(prev => ({ ...prev, availability: date }));
    }
  }, [date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const age = parseInt(formData.age);
    if (age < 16 || age > 65) {
      toast({
        title: "Age restriction",
        description: "Donors must be between 16 and 65 years old.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.recentlyDonated === 'yes') {
      toast({
        title: "Recent donation",
        description: "You cannot donate if you have donated within the last 2 months.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.availability) {
      toast({
        title: "Availability required",
        description: "Please select your availability date.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      // Save donor data to localStorage
      const existingDonors = JSON.parse(localStorage.getItem('blood-donors') || '[]');
      const updatedDonors = [...existingDonors, formData];
      localStorage.setItem('blood-donors', JSON.stringify(updatedDonors));
      
      toast({
        title: "Thank you for registering!",
        description: "Your information has been saved. You may be contacted when someone needs your blood type.",
        variant: "default",
      });
      
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return <PeopleInNeed donorBloodGroup={formData.bloodGroup} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blood">Donate Blood</h2>
          <p className="text-muted-foreground">Please fill in your details to become a donor</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="donorName" className="block text-sm font-medium">
              Donor Name
            </label>
            <input
              id="donorName"
              name="donorName"
              type="text"
              required
              value={formData.donorName}
              onChange={handleChange}
              disabled={isSubmitting || loading}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Your full name"
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
              value={formData.age}
              onChange={handleChange}
              disabled={isSubmitting || loading}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Must be 16-65"
            />
            <p className="text-xs text-muted-foreground">Must be between 16 and 65 years old</p>
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
              disabled={isSubmitting || loading}
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
              disabled={isSubmitting || loading}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="We'll contact you here"
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
              disabled={isSubmitting || loading}
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
            <label htmlFor="recentlyDonated" className="block text-sm font-medium">
              Donated Blood Within Last 2 Months?
            </label>
            <select
              id="recentlyDonated"
              name="recentlyDonated"
              required
              value={formData.recentlyDonated}
              onChange={handleChange}
              disabled={isSubmitting || loading}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="availability" className="block text-sm font-medium">
              Availability (Date)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  disabled={isSubmitting || loading}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border justify-start text-left font-normal disabled:opacity-50 disabled:cursor-not-allowed",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select your availability</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium">
              Address
            </label>
            <div className="flex space-x-2">
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                disabled={isSubmitting || loading}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blood focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Your current location"
              />
              <Button 
                type="button" 
                onClick={getCurrentLocation} 
                variant="outline"
                className="px-3 py-2 bg-blood/20 hover:bg-blood/30 text-blood rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || loading}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {loading ? "Detecting..." : "Get Location"}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-3 px-4 bg-blood text-white font-medium rounded-lg shadow-sm hover:bg-blood-dark transition-colors button-effect disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register as Donor"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
