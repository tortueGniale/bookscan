'use client';

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ScanInput() {
  const [barcodeValue, setBarcodeValue] = React.useState('');
  const user = useContext(AuthContext);
  const [isFocused, setIsFocused] = React.useState(false);

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
      body: JSON.stringify({ barcode: barcodeValue, profileId: user?.profile?.id }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Scan endpoint response:', data);
  }

  return (
    <>
      <input type="text"
        style={{ position: 'absolute', left: '-9999px' }}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          e.target.focus();
        }}
        autoFocus value={barcodeValue}
        onChange={(e) => setBarcodeValue(e.target.value)}
        onKeyDown={(e) => { handleKeyDown(e) }} />
      {isFocused &&
        <div>
          <div style={{ fontSize: '24px', textAlign: "center" }}>Scannez un code barre ou un ISBN pour démarrer</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div
              style={{
                width: '200px',
                height: '2px',
                backgroundColor: 'red',
                animation: 'move 1.75s linear infinite alternate'
              }}
            />
            <style jsx>{`
              @keyframes move {
                from {
                  transform: translateX(-100%);
                }
                to {
                  transform: translateX(100%);
                }
              }
            `}</style>
          </div>
        </div>
      }
      {!isFocused &&
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          Veuillez cliquer sur la fenêtre pour démarrer.
        </div>
      }
    </>
  );
}