'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ reset }: { reset: () => void }) {
  const gifs = [
    'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
    'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    'https://media.giphy.com/media/l2JehQ2GitHGdVG9y/giphy.gif',
    'https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif',
    'https://media.giphy.com/media/9J7tdYltWyXIY/giphy.gif',
    //'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif',
  ];


  const [selectedGif, setSelectedGif] = useState('');

  useEffect(() => {
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    setSelectedGif(randomGif);
  }, []);

  return (
    <div
      className="relative flex h-screen flex-col items-center justify-center gap-2"
      style={{
        backgroundColor: 'black',
        backgroundImage: `url(${selectedGif})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
      <h2 className="relative text-2xl font-bold text-white">Something went wrong!</h2>
      <Button onClick={() => reset()} variant="outline" className="relative">
        Try again
      </Button>
    </div>
  );
} 