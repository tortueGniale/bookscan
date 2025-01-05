'use client';

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

type BookScanUser = User & { role: string | null };

interface AuthContextType {
    isAuthenticated: boolean;
    user: BookScanUser | null;
    login: (username: string, password: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: () => { },
    logout: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<BookScanUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error getting session:', error);
                return;
            }
            if (data.session) {
                setIsAuthenticated(true);
                setUser(data.session.user as BookScanUser);
                router.push('/');
            }
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setIsAuthenticated(true);
                setUser(session.user as BookScanUser);
                router.push('/');
            } else {
                setIsAuthenticated(false);
                setUser(null);
                router.push('/login');
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [router]);

    const login = async (username: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: username,
            password: password,
        });

        if (error) {
            console.error('Error logging in:', error);
            return;
        }

        if (data) {
            
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('user_id', data.user?.id)
                .single();

            if (profileError) {
                console.error('Error getting role in:', profileError);
                return;
            }
            setUser({...data.user, role: profile?.role});
            setIsAuthenticated(true);
            router.push('/');
        } else {
            console.log('No data found');
        }
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
            return;
        }
        setIsAuthenticated(false);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};