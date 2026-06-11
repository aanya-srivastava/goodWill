import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Building2, User, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "../contexts/PointsContext";

export const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { syncPoints } = usePoints();
  const [loginMode, setLoginMode] = useState<'options' | 'hospital' | 'donorLogin' | 'donorRegister'>('options');
  
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleHospitalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/api/hospitals/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      localStorage.setItem('hospitalToken', data.token);
      localStorage.setItem('hospitalId', data.hospitalId);
      localStorage.setItem('hospitalName', data.name);
      
      navigate('/hospital-dashboard');
    } catch (error) {
      toast({ title: "Error", description: "Invalid credentials. Please try again." });
    }
  };

  const handleDonorAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = loginMode === 'donorRegister' ? 'register' : 'login';
    const body = loginMode === 'donorRegister' 
      ? { name: credentials.name, email: credentials.email, password: credentials.password }
      : { email: credentials.email, password: credentials.password };

    try {
      const response = await fetch(`http://localhost:8081/api/users/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', data.name);
      
      await syncPoints();
      navigate('/donate');
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Authentication failed. Please try again." });
    }
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
            {loginMode === 'options' ? 'Choose how you want to proceed' : 
             loginMode === 'hospital' ? 'Sign in as Hospital' :
             loginMode === 'donorLogin' ? 'Sign in as Donor' : 'Register as Donor'}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {loginMode === 'options' && (
            <div className="space-y-4">
              <button
                onClick={() => setLoginMode('donorLogin')}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
              >
                <User className="h-5 w-5 mr-2" />
                Sign in as Donor
              </button>
              
              <button
                onClick={() => setLoginMode('donorRegister')}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-blood bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Register as Donor
              </button>

              <button
                onClick={() => setLoginMode('hospital')}
                className="group relative w-full flex justify-center py-3 px-4 border border-blood text-sm font-medium rounded-md text-blood bg-white hover:bg-blood/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood mt-4"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Hospital Portal
              </button>
            </div>
          )}

          {loginMode === 'hospital' && (
            <form onSubmit={handleHospitalLogin} className="space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <input
                  type="email" required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blood focus:border-blood focus:z-10 sm:text-sm"
                  placeholder="Hospital Email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
                <input
                  type="password" required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blood focus:border-blood focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blood hover:bg-blood-dark">
                <Building2 className="h-5 w-5 mr-2" /> Sign in as Hospital
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setLoginMode('options')} className="text-sm text-blood hover:text-blood-dark">
                  Back to options
                </button>
              </div>
            </form>
          )}

          {(loginMode === 'donorLogin' || loginMode === 'donorRegister') && (
            <form onSubmit={handleDonorAuth} className="space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                {loginMode === 'donorRegister' && (
                  <input
                    type="text" required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blood focus:border-blood focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    value={credentials.name}
                    onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                  />
                )}
                <input
                  type="email" required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${loginMode === 'donorLogin' ? 'rounded-t-md' : ''} focus:outline-none focus:ring-blood focus:border-blood focus:z-10 sm:text-sm`}
                  placeholder="Email Address"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
                <input
                  type="password" required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blood focus:border-blood focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blood hover:bg-blood-dark">
                {loginMode === 'donorLogin' ? <LogIn className="h-5 w-5 mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
                {loginMode === 'donorLogin' ? 'Sign In' : 'Register'}
              </button>
              <div className="text-center space-y-2">
                <button type="button" onClick={() => setLoginMode(loginMode === 'donorLogin' ? 'donorRegister' : 'donorLogin')} className="text-sm text-blood hover:text-blood-dark block w-full">
                  {loginMode === 'donorLogin' ? "Don't have an account? Register" : "Already have an account? Sign in"}
                </button>
                <button type="button" onClick={() => setLoginMode('options')} className="text-sm text-gray-500 hover:text-gray-700">
                  Back to options
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};