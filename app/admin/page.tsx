'use client';

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

export default function AdminPage() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Or a loading spinner
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome, {user.email}. You have admin access.</p>
    </div>
  );
}