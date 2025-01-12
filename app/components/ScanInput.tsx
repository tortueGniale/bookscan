'use client';

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ScanInput() {
  const [barcodeValue, setBarcodeValue] = React.useState('');
  const user = useContext(AuthContext);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getBook();
      // empty html input
      setBarcodeValue('');
    }
  };

  async function getBook() {
    const response = await fetch(`/api/scan`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body : JSON.stringify({ barcode: barcodeValue, profileId: user?.profile?.id }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Scan endpoint response:', data);
  }

return (
  <input type="text" className="" onBlur={(e) => e.target.focus()} autoFocus value={barcodeValue} onChange={(e) => setBarcodeValue(e.target.value)} onKeyDown={(e) => { handleKeyDown(e) }} />
);
}