'use client';

import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import ScanInput from "./components/ScanInput";

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
       Scannez un code barre pour commencer
       <div className="flex flex-col gap-4">
          <ScanInput />
        </div>
      </main>
    </div>
  );
}
