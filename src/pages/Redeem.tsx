
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Thermometer, Droplet, Bandage, Heart, Stethoscope, Syringe, Gift, Award, AlertTriangle, Loader2 } from 'lucide-react';
import { usePoints } from '../contexts/PointsContext';
import { useToast } from '@/hooks/use-toast';

interface RedeemItem {
  id: number;
  name: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  category: string;
}

const Redeem = () => {
  const { points, addPoints } = usePoints();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RedeemItem | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const redeemItems: RedeemItem[] = [
    {
      id: 1,
      name: "Paracetamol",
      description: "Pain reliever and fever reducer. Basic first-aid essential.",
      points: 50,
      icon: <Pill className="h-10 w-10 text-blood" />,
      category: "Medication",
    },
    {
      id: 2,
      name: "Digital Thermometer",
      description: "Accurate temperature readings with LCD display.",
      points: 150,
      icon: <Thermometer className="h-10 w-10 text-blood" />,
      category: "Equipment",
    },
    {
      id: 3,
      name: "ORS Solution",
      description: "Oral rehydration salts for treating dehydration.",
      points: 30,
      icon: <Droplet className="h-10 w-10 text-blood" />,
      category: "Hydration",
    },
    {
      id: 4,
      name: "Bandages (Pack)",
      description: "Sterile adhesive bandages in various sizes.",
      points: 40,
      icon: <Bandage className="h-10 w-10 text-blood" />,
      category: "First Aid",
    },
    {
      id: 5,
      name: "Antiseptic Solution",
      description: "For cleaning wounds and preventing infection.",
      points: 60,
      icon: <Droplet className="h-10 w-10 text-blood" />,
      category: "First Aid",
    },
    {
      id: 6,
      name: "Blood Pressure Monitor",
      description: "Digital BP monitor for home use with memory function.",
      points: 300,
      icon: <Heart className="h-10 w-10 text-blood" />,
      category: "Equipment",
    },
    {
      id: 7,
      name: "First Aid Kit",
      description: "Complete emergency kit with essential medical supplies.",
      points: 200,
      icon: <Syringe className="h-10 w-10 text-blood" />,
      category: "First Aid",
    },
    {
      id: 8,
      name: "Vitamin Supplements",
      description: "Daily multivitamin tablets for improved immunity.",
      points: 80,
      icon: <Award className="h-10 w-10 text-blood" />,
      category: "Supplements",
    }
  ];

  const handleRedeem = (item: RedeemItem) => {
    if (points < item.points) {
      toast({
        title: "Insufficient Points",
        description: `You need ${item.points - points} more points to redeem this item.`,
        variant: "destructive"
      });
      return;
    }

    setSelectedItem(item);
    setShowConfirmation(true);
  };

  const confirmRedeem = () => {
    if (!selectedItem) return;
    
    setIsProcessing(true);
    setShowConfirmation(false);
    
    // Simulate processing
    setTimeout(() => {
      // Deduct points
      addPoints(-selectedItem.points);
      
      toast({
        title: "Redemption Successful!",
        description: `You have successfully redeemed ${selectedItem.name}.`,
      });
      
      setIsProcessing(false);
      setSelectedItem(null);
    }, 1500);
  };

  const categoryColors: Record<string, string> = {
    "Medication": "bg-blue-100 text-blue-700",
    "Equipment": "bg-green-100 text-green-700",
    "Hydration": "bg-cyan-100 text-cyan-700",
    "First Aid": "bg-red-100 text-red-700",
    "Supplements": "bg-purple-100 text-purple-700"
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-white to-blood/5">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 mt-6">
        <div className="max-w-3xl w-full text-center mb-8 animate-slide-down">
          <div className="inline-block mb-2 px-3 py-1 bg-blood/10 text-blood rounded-full text-sm font-medium">
            Rewards Zone
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Redeem Your Points
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Use your donation points to get essential medical supplies for free.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blood/10 rounded-full">
            <Gift className="h-5 w-5 text-blood" />
            <span className="font-medium">Your Balance: {points} Points</span>
          </div>
        </div>
        
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {redeemItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all duration-300 border border-blood/10 flex flex-col">
              
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="bg-blood/10 p-3 rounded-lg">{item.icon}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[item.category]}`}>
                      {item.category}
                    </span>
                  </div>
                  <CardTitle className="mt-3">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{item.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xl font-bold">{item.points} Points</span>
                    <span className="text-sm text-muted-foreground">₹0.00</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleRedeem(item)} 
                    className="w-full bg-blood hover:bg-blood/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={points < item.points || isProcessing}
                  >
                    <Gift className="h-4 w-4" /> 
                    {points < item.points ? "Insufficient Points" : "Redeem Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="my-8 p-6 rounded-xl bg-blood/5 border border-blood/10">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-shrink-0">
              
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-4">How to Earn More Points</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="font-bold text-lg text-blood">Blood Donation</h3>
                    <p className="text-muted-foreground">Donate blood to earn 15 points per donation. Regular donations can quickly add up!</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="font-bold text-lg text-blood">Refer Friends</h3>
                    <p className="text-muted-foreground">Refer friends to donate and earn bonus points when they complete their first donation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Confirmation Modal */}
      {showConfirmation && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-fade-in shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Confirm Redemption</h3>
              <button 
                onClick={() => setShowConfirmation(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blood/10 p-3 rounded-lg">
                {selectedItem.icon}
              </div>
              <div>
                <h4 className="font-bold">{selectedItem.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedItem.points} Points</p>
              </div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg flex items-start gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">
                This action will deduct {selectedItem.points} points from your account. This cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowConfirmation(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-blood hover:bg-blood/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={confirmRedeem}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Redemption"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center animate-fade-in">
            <div className="relative mb-4">
              <div className="h-16 w-16 rounded-full border-4 border-blood border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplet className="h-8 w-8 text-blood animate-pulse" />
              </div>
            </div>
            <p className="text-lg font-medium">Processing your redemption...</p>
          </div>
        </div>
      )}
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© 2025 GoodWill. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Redeem;
