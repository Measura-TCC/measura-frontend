'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  const [user] = useState<User | null>({
    id: '1',
    name: 'John Doe',
    email: 'john@measura.com',
    role: 'admin',
  });
  const [isLoading] = useState(false);

  const login = async (email: string, password: string) => {
    console.log('Mock login with:', email, password);
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    console.log('Mock register with:', name, email, password, role);
  };

  const logout = () => {
    console.log('Mock logout'); 
  };

  return {
    user,
    isAuthenticated: true,
    isLoading,
    login,
    register,
    logout,
  };
}; 