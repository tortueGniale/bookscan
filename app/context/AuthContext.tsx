'use client';

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';

type Profile = {
    role: string | null
};

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    login: (username: string, password: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    profile: null,
    loading: true,
    login: () => { },
    logout: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>({ role: null });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getProfile = async (session: Session) => {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', session.user?.id)
            .single();

        if (profileError) {
            console.error('Error getting role in:', profileError);
            return;
        }
        const userProfile = { role: profile.role };
        setProfile(userProfile);
    };

    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error getting session:', error);
                setLoading(false);
                return;
            }
            if (data.session) {
                setIsAuthenticated(true);
                setUser(data.session.user);
                await getProfile(data.session);
            }
            setLoading(false);
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setIsAuthenticated(true);
                setUser(session.user);
                getProfile(session);
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setProfile({ role: null });
                router.push('/login');
            }
            //setLoading(false);
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
            await getProfile(data.session);
            setUser(data.user);
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
        <AuthContext.Provider value={{ isAuthenticated, user, profile: profile, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};