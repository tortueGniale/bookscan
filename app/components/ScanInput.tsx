'use client';

import React, { useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';

export default function ScanInput() {
  const [barcodeValue, setBarcodeValue] = React.useState('');
  const { user } = useContext(AuthContext);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getBook(); 
      // empty html input
      setBarcodeValue('');
    }
  };

  function getBook() {

    //call an google book api to get book info
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${barcodeValue}&key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data.totalItems > 0) {
          const book = data.items[0].volumeInfo;
          console.log(book);
          // save to supabase
          supabase
            .from('scans')
            .insert([
              { barcode_type: 'EAN13', barcode_value: barcodeValue, data: book, user_id: user!.id }
            ])
            .then(response => {
              if (response.error) {
                console.error('Error saving book to Supabase:', response.error);
              } else {
                console.log('Book saved to Supabase:', response.data);
              }
            });
        } else {
          console.log('No book found');
        }
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
      });
    
    console.log(barcodeValue);
  }
  
  return (
    <input type="text" className="" onBlur={(e) => e.target.focus()} autoFocus value={barcodeValue} onChange={(e) => setBarcodeValue(e.target.value)} onKeyDown={(e) => {handleKeyDown(e)}} />
  );
}