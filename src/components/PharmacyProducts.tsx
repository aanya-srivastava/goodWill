
import React, { useState } from 'react';
import { 
  Pill, 
  Thermometer, 
  Droplet, 
  Bandage, 
  Heart, 
  Stethoscope, 
  Syringe, 
  ShoppingCart,
  Loader2 
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '../contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  category: string;
  points: number;
}

export const PharmacyProducts = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [addingId, setAddingId] = useState<number | null>(null);
  
  const products: Product[] = [
    {
      id: 1,
      name: "Paracetamol",
      description: "Pain reliever and fever reducer. Basic first-aid essential.",
      price: 5,
      icon: <Pill className="h-10 w-10 text-blood" />,
      category: "Medication",
      points: 10
    },
    {
      id: 2,
      name: "Digital Thermometer",
      description: "Accurate temperature readings with LCD display.",
      price: 15,
      icon: <Thermometer className="h-10 w-10 text-blood" />,
      category: "Equipment",
      points: 25
    },
    {
      id: 3,
      name: "ORS Solution",
      description: "Oral rehydration salts for treating dehydration.",
      price: 3,
      icon: <Droplet className="h-10 w-10 text-blood" />,
      category: "Hydration",
      points: 8
    },
    {
      id: 4,
      name: "Bandages (Pack)",
      description: "Sterile adhesive bandages in various sizes.",
      price: 4,
      icon: <Bandage className="h-10 w-10 text-blood" />,
      category: "First Aid",
      points: 12
    },
    {
      id: 5,
      name: "Antiseptic Solution",
      description: "For cleaning wounds and preventing infection.",
      price: 6,
      icon: <Droplet className="h-10 w-10 text-blood" />,
      category: "First Aid",
      points: 15
    },
    {
      id: 6,
      name: "Blood Pressure Monitor",
      description: "Digital BP monitor for home use with memory function.",
      price: 30,
      icon: <Heart className="h-10 w-10 text-blood" />,
      category: "Equipment",
      points: 40
    },
    {
      id: 7,
      name: "First Aid Kit",
      description: "Complete emergency kit with essential medical supplies.",
      price: 25,
      icon: <Stethoscope className="h-10 w-10 text-blood" />,
      category: "First Aid",
      points: 35
    },
    {
      id: 8,
      name: "Vitamin C Tablets",
      description: "Immune system support and antioxidant protection.",
      price: 8,
      icon: <Pill className="h-10 w-10 text-blood" />,
      category: "Supplements",
      points: 18
    },
    {
      id: 9,
      name: "Insulin Syringes",
      description: "Sterile disposable syringes for insulin administration.",
      price: 10,
      icon: <Syringe className="h-10 w-10 text-blood" />,
      category: "Equipment",
      points: 20
    }
  ];

  const handleAddToCart = (product: Product) => {
    const { id, name, price, points } = product;
    setAddingId(id);
    
    setTimeout(() => {
      addToCart({ id, name, price, points });
      setAddingId(null);
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart.`,
      });
    }, 800);
  };

  const categoryColors: Record<string, string> = {
    "Medication": "bg-blue-100 text-blue-700",
    "Equipment": "bg-green-100 text-green-700",
    "Hydration": "bg-cyan-100 text-cyan-700",
    "First Aid": "bg-red-100 text-red-700",
    "Supplements": "bg-purple-100 text-purple-700"
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-all duration-300 border border-blood/10">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="bg-blood/10 p-3 rounded-lg">{product.icon}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[product.category]}`}>
                  {product.category}
                </span>
              </div>
              <CardTitle className="mt-3">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{product.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xl font-bold">₹{product.price}</span>
                <span className="text-sm text-muted-foreground">Earn {product.points} points</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleAddToCart(product)} 
                disabled={addingId === product.id}
                className="w-full bg-blood hover:bg-blood/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addingId === product.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="my-8 p-6 rounded-xl bg-blood/5 border border-blood/10">
        <h2 className="text-2xl font-bold mb-4">Why These Items Are Essential</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-bold text-lg text-blood">First Aid Basics</h3>
            <p className="text-muted-foreground">Items like bandages and antiseptics are crucial for immediate wound care and preventing infections.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-bold text-lg text-blood">Fever Management</h3>
            <p className="text-muted-foreground">Paracetamol and thermometers help monitor and manage fevers effectively at home.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-bold text-lg text-blood">Health Monitoring</h3>
            <p className="text-muted-foreground">Devices like BP monitors allow you to keep track of vital health parameters regularly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
