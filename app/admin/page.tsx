'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';

export default function AdminPage() {
  const { user, profile, isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [scans, setScans] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user || !profile || profile.role !== 'admin') {
        console.log('Redirecting to /', isAuthenticated, user, profile, loading);
        router.push('/');
      }
    }
  }, [isAuthenticated, user, profile, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch(`/api/scan`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      const scans = await response.json();
      setScans(scans);
      setDataLoading(false);
    };

    if (isAuthenticated && profile?.role === 'admin') {
      fetchData();
    }
  }, [isAuthenticated, profile]);

  if (loading || dataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Titre</th>
            <th className="py-2 px-4 border-b text-left">Image</th>
            <th className="py-2 px-4 border-b text-left">Date du scan</th>
            <th className="py-2 px-4 border-b text-left">Scanné par</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{row.title}</td>
                <td className="py-2 px-4 border-b"><img src={row.image} alt={row.title} className="h-16" /></td>
              <td className="py-2 px-4 border-b">{new Date(row.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} {new Date(row.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
              <td className="py-2 px-4 border-b">{row.profiles?.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}