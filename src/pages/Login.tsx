import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Building2, User, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { API_URL } from '../config';

export const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isHospitalLogin, setIsHospitalLogin] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleHospitalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/hospitals/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('hospitalToken', data.token);
      localStorage.setItem('hospitalId', data.hospitalId);
      localStorage.setItem('hospitalName', data.name);
      
      navigate('/hospital-dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
      });
    }
  };

  const handleQuickUserLogin = () => {
    // Generate a random user ID and name for quick access
    const userId = Math.random().toString(36).substring(7);
    const userName = `User_${userId}`;
    
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    
    navigate('/donate');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-blood/5 flex items-center justify-center rounded-full">
            <Heart className="h-8 w-8 text-blood" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to BloodLink
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose how you want to proceed
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {isHospitalLogin ? (
            <form onSubmit={handleHospitalLogin} className="space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blood focus:border-blood focus:z-10 sm:text-sm"
                    placeholder="Hospital Email"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blood focus:border-blood focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({ ...credentials, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Sign in as Hospital
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsHospitalLogin(false)}
                  className="text-sm text-blood hover:text-blood-dark"
                >
                  Back to options
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleQuickUserLogin}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
              >
                <User className="h-5 w-5 mr-2" />
                Continue as Donor
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>

              <button
                onClick={() => setIsHospitalLogin(true)}
                className="group relative w-full flex justify-center py-3 px-4 border border-blood text-sm font-medium rounded-md text-blood bg-white hover:bg-blood/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Hospital Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 