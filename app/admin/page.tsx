'use client';

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';

export default function AdminPage() {
    const { user, profile, isAuthenticated, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated || !user || !profile || profile.role !== 'admin') {
                console.log('Redirecting to /', isAuthenticated, user, profile, loading);
                router.push('/');
            }
        }
    }, [isAuthenticated, user, profile, loading, router]);

    if (loading) {
        return (<div>Loading...</div>);
    }

    return (
        <div>
            <Header /> 
            <h1>Admin Page</h1>
            <p>Welcome, {user?.email}. You have admin access.</p>
        </div>
    );
}