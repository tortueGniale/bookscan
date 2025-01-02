'use client';

import React from 'react';

export default function ScanInput() {
  const [barcodeValue, setBarcodeValue] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getBook(barcodeValue); 
      // empty html input
      setBarcodeValue('');
    }
  };

  function getBook(barcode: string) {

    //call an google book api to get book info
    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${barcode}&key=AIzaSyCVDteEHb_dfX7RDxCi4tGnAcDiwKl4DGs`)
      .then(response => response.json())
      .then(data => {
        if (data.totalItems > 0) {
          const book = data.items[0].volumeInfo;
          console.log(book);
        } else {
          console.log('No book found');
        }
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
      });
    
    console.log(barcode);
  }
  
  return (
    <input type="text" className="" onBlur={(e) => e.target.focus()} autoFocus value={barcodeValue} onChange={(e) => setBarcodeValue(e.target.value)} onKeyDown={(e) => {handleKeyDown(e)}} />
  );
}