import { supabase } from '@/app/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

type ParsedScan = {
  score: 1 | 2 | 3;
  title: string;
  image: string;
  barcode_scanned: string;
  ean13: string | null;
  ean8: string | null;
  isbn10: string | null;
  isbn13: string | null;
};

type ParsedScanResponseItem = 
  ParsedScan & { profileName: string, id: number, created_at: string };
  

type UnparsedScan = {
  googleBooksData: Record<string, unknown>;
  barcodeValue: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ParsedScan> | NextApiResponse<ParsedScanResponseItem[]>) {
  console.log('barcode:', req.query.barcodeValue);

  //if POST
  switch (req.method) {
    case 'POST':
      return postHandler(req, res as NextApiResponse<ParsedScan>);
    case 'GET':
      return getHandler(req, res as NextApiResponse<ParsedScan[]>);
    default:
      res.status(405).end();
  }
  
}

function postHandler(req: NextApiRequest, res: NextApiResponse<ParsedScan>) {
  try {
    // Appel à plusieurs API
    const apiKey = process.env.NEXT_GOOGLE_BOOKS_API_KEY;
    const barcodeValue = req.body.barcode as string;
    const profileId = req.body.profileId as string;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${barcodeValue}&key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data.totalItems > 0) {
          const book = data.items[0].volumeInfo;
          const unparsedScan:UnparsedScan = { googleBooksData: book, barcodeValue: barcodeValue };
          const parsedScan:ParsedScan = parseScan(unparsedScan);
          console.log(parsedScan)
          saveToSupabase(parsedScan, profileId);
          // save to supabase
          
        } else {
          console.log('No book found');
        }
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
      });
    
    res.status(200);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500);
  }
}

async function getHandler(req: NextApiRequest, res: NextApiResponse<ParsedScanResponseItem[]>) {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('id, title, image, barcode_scanned, score, created_at, profiles(username)');

      if (error) {
        console.error('Error fetching scans from Supabase:', error);
        return res.status(500);
      }
      
      console.log('Scans fetched from Supabase:', data);

      res.status(200).json(data as unknown as ParsedScanResponseItem[]);
    } catch (error) {
      console.error('Error fetching scans:', error);
      res.status(500);
    }
  }


function parseScan(unparsedScan : UnparsedScan): ParsedScan{
  // Implémentez votre algorithme de calcul de score ici
  const parsedScan:ParsedScan = {
    score: 1,
    title: unparsedScan.googleBooksData.title as string,
    image: unparsedScan.googleBooksData.previewLink as string,
    barcode_scanned: unparsedScan.barcodeValue,
    isbn10: (unparsedScan.googleBooksData.industryIdentifiers as { type: string; identifier: string; }[])?.find((identifier: { type: string; }) => identifier.type === 'ISBN_10')?.identifier as string,
    isbn13: (unparsedScan.googleBooksData.industryIdentifiers as { type: string; identifier: string; }[])?.find((identifier: { type: string; }) => identifier.type === 'ISBN_13')?.identifier as string,
    ean13: null,
    ean8: null
  };
  return parsedScan;
}

function saveToSupabase(parsedScan:ParsedScan, profileId:string){
  supabase
    .from('scans')
    .insert([
      {...parsedScan, profile_id: profileId}
    ])
    .then(response => {
      if (response.error) {
        console.error('Error saving book to Supabase:', response.error);
      } else {
        console.log('Book saved to Supabase:', response.data);
      }
    });
}