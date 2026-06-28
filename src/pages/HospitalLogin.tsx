import React, { useState } from 'react';
import { Building2, Lock, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../config';

export const HospitalLogin = () => {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
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

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('hospitalToken', data.token);
      localStorage.setItem('hospitalId', data.hospitalId);
      localStorage.setItem('hospitalName', data.name);
      
      window.location.href = '/hospital-dashboard';
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-blood/5 flex items-center justify-center rounded-full">
            <Building2 className="h-8 w-8 text-blood" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hospital Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your hospital dashboard to manage blood donations
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
              disabled={loginMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blood hover:bg-blood-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blood disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-blood-dark group-hover:text-blood" />
                  </span>
                  Sign in
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 