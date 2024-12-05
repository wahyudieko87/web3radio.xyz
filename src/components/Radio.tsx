import React, { useState, useEffect, useRef } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Volume2, Volume1, VolumeX, Power, SkipBack, SkipForward, Play, Pause, Radio as RadioIcon } from 'lucide-react';

const Radio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentStation, setCurrentStation] = useState('web3');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<string[]>([]);
  const { connect } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const stations = {
    web3: 'https://web3radio.cloud/stream',
    indonesia: 'https://s1.cloudmu.id/listen/female_radio/radio.mp3'  // Example Indonesian radio stream
  };

  useEffect(() => {
    const audio = new Audio(stations[currentStation]);
    audioRef.current = audio;
    audio.volume = volume / 100;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [currentStation]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeStation = (station: 'web3' | 'indonesia') => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentStation(station);
    setIsPlaying(false);
  };

  // Simulate crypto price updates
  useEffect(() => {
    const mockPrices = [
      "BTC $50,000",
      "ETH $3,000",
      "BNB $400",
      "ADA $2",
      "DOT $30",
    ];
    setCryptoPrices(mockPrices);
  
    const interval = setInterval(() => {
      const newPrices = mockPrices.map(price => {
        const [symbol, priceString] = price.split(' ');
        const value = parseFloat(priceString.replace(/[$,]/g, '')); // Menghapus simbol $ dan koma
        const change = (Math.random() - 0.5) * 100; // Fluktuasi acak
        return `${symbol} $${(value + change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      });
      setCryptoPrices(newPrices);
    }, 5000);
  
    return () => clearInterval(interval); // Bersihkan interval
  }, []);
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Logo - positioned at the very top */}
      <div className="mb-8 flex justify-center">
        <img 
          src="/web3radio-logo.png" 
          alt="Web3 Radio" 
          className="w-32 h-32 rounded-full shadow-lg"
        />
      </div>
      
      {/* Station Selection */}
      <div className="mb-4 flex gap-2 justify-center">
        <button
          onClick={() => changeStation('web3')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
            currentStation === 'web3' 
              ? 'bg-[#00ff00] text-black' 
              : 'bg-[#333] text-gray-300'
          }`}
        >
          <RadioIcon size={16} />
          Web3 Radio
        </button>
        <button
          onClick={() => changeStation('indonesia')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
            currentStation === 'indonesia' 
              ? 'bg-[#00ff00] text-black' 
              : 'bg-[#333] text-gray-300'
          }`}
        >
          <RadioIcon size={16} />
          Radio Indonesia
        </button>
      </div>

      {/* Winamp-style container */}
      <div className="bg-[#232323] rounded-lg shadow-xl border border-[#444] select-none">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#333] p-1 flex justify-between items-center">
          <div className="text-[#00ff00] text-xs font-bold">
            {currentStation === 'web3' ? 'Web3 Radio' : 'Radio Indonesia'}
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-white text-xs">_</button>
            <button className="text-gray-400 hover:text-white text-xs">□</button>
            <button className="text-gray-400 hover:text-white text-xs">×</button>
          </div>
        </div>

        {/* Main display */}
        <div className="bg-[#000] p-4">
          <div className="h-8 bg-[#0a0a0a] border border-[#333] mb-2 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {cryptoPrices.map((price, index) => (
                <span key={index} className="text-[#00ff00] font-mono text-sm mx-4">
                  {price}
                </span>
              ))}
            </div>
          </div>

          {/* Visualizer */}
          <div className="h-16 bg-[#000] border border-[#333] mb-2">
            <div className="h-full flex items-end justify-around px-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#00ff00]"
                  style={{
                    height: `${Math.random() * 100}%`,
                    transition: 'height 150ms ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#232323] p-4">
          <div className="flex justify-between items-center mb-4">
            <button className="text-gray-400 hover:text-white">
              <SkipBack size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="bg-[#333] hover:bg-[#444] rounded-full p-2 text-white"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button className="text-gray-400 hover:text-white">
              <SkipForward size={16} />
            </button>
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-2">
            <VolumeIcon className="text-gray-400" size={16} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full h-1 bg-[#444] appearance-none rounded cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, #00ff00 0%, #00ff00 ${volume}%, #444 ${volume}%, #444 100%)`
              }}
            />
          </div>
        </div>

        {/* Wallet connection */}
        <div className="border-t border-[#444] p-4">
          {address ? (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 font-mono">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </p>
              <button
                onClick={() => disconnect()}
                className="w-full px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: injected() })}
              className="w-full px-3 py-1 bg-[#444] text-white text-xs rounded hover:bg-[#555] transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Radio;