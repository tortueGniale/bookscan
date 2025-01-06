'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';

export default function AdminPage() {
  const { user, profile, isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
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
      const { data, error } = await supabase
        .from('scans') // Remplacez 'scans' par le nom de votre table
        .select('*');

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(data);
      }
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
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Nom</th>
            <th className="py-2 px-4 border-b text-left">Titre</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{row.id}</td>
              <td className="py-2 px-4 border-b">{row.barcode_value}</td>
              <td className="py-2 px-4 border-b">{row.data.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}