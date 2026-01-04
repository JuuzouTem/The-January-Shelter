'use client';

import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Disc } from 'lucide-react'; // Disc ikonu eklendi
import { musicList } from '@/data/musicList';
import InteractiveItem from './InteractiveItem';

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  // isOpen state'ini kaldırdık, çalıyorsa player otomatik gözüksün
  const soundRef = useRef<Howl | null>(null);

  const currentTrack = musicList[currentTrackIndex];

  const playTrack = (index: number) => {
    if (soundRef.current) soundRef.current.stop();

    const track = musicList[index];
    const sound = new Howl({
      src: [track.src],
      html5: true,
      volume: 0.5,
      onend: () => handleNext()
    });

    soundRef.current = sound;
    sound.play();
    setIsPlaying(true);
    setCurrentTrackIndex(index);
  };

  const togglePlay = () => {
    if (!soundRef.current) {
      playTrack(currentTrackIndex);
    } else {
      if (isPlaying) soundRef.current.pause();
      else soundRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    playTrack((currentTrackIndex + 1) % musicList.length);
  };

  const handlePrev = () => {
    playTrack((currentTrackIndex - 1 + musicList.length) % musicList.length);
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) soundRef.current.unload();
    };
  }, []);

  return (
    <div className="relative">
      {/* Tıklanabilir Radyo Alanı */}
      <InteractiveItem label={isPlaying ? "Durdur" : "Müzik Çal"} onClick={togglePlay} className="w-full h-full">
        <div className="relative w-full h-full">
            <img 
                src="/images/items/radio.png" 
                alt="Radyo" 
                className="w-full h-full object-contain drop-shadow-xl"
            />
            {/* Müzik Çalıyorsa Radyo Titresin/Parlasın */}
            {isPlaying && (
                <motion.div
                    className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl z-[-1]"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            )}
        </div>
      </InteractiveItem>

      {/* MODERN GLASS PLAYER BAR (Ekranın Alt Ortasında Çıkar) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full shadow-2xl z-[100]"
          >
            {/* Dönen Disk Animasyonu */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full p-1"
            >
                <Disc size={24} className="text-white" />
            </motion.div>

            {/* Şarkı Bilgisi */}
            <div className="flex flex-col min-w-[120px]">
              <span className="text-xs text-gray-400 font-medium tracking-wider">NOW PLAYING</span>
              <span className="text-sm text-white font-bold whitespace-nowrap">{currentTrack.title}</span>
            </div>

            {/* Kontroller */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
              <button onClick={handlePrev} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                <SkipBack size={18} />
              </button>
              <button onClick={togglePlay} className="p-2 bg-white text-black rounded-full hover:scale-105 transition-transform">
                {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" />}
              </button>
              <button onClick={handleNext} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                <SkipForward size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadioPlayer;