'use client';

import React, { createContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    //call supabase
    const supabaseUrl = 'https://zocebttubmqoajrzfiyi.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvY2VidHR1Ym1xb2FqcnpmaXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MzYxNzcsImV4cCI6MjA1MTQxMjE3N30.9ioW43CYTShqUPIUB1mQrZ4O2xxvaXPg8z0jZ_jtiu4';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
    });

    if (error) {
        console.error('Error logging in:', error);
        return;
    }

    if (data) {
        setIsAuthenticated(true);
        router.push('/');
    }else{
        console.log('No data found');
    }

  };

  const logout = () => {
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};