'use client';

import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { musicList } from '@/data/musicList'; // @ alias'ı çalışıyor artık
import InteractiveItem from './InteractiveItem';

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="relative z-30">
      <InteractiveItem label="Radyoyu Aç" onClick={() => setIsOpen(!isOpen)} className="w-24 h-24">
        <div className="relative w-full h-full">
            {/* Radyo Görseli */}
            <img 
                src="/images/items/radio.png" 
                alt="Radyo" 
                className="w-full h-full object-contain drop-shadow-lg"
            />
            {isPlaying && (
                <motion.div
                className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                />
            )}
        </div>
      </InteractiveItem>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-64 bg-[#2d3748] border-2 border-gray-600 rounded-lg p-4 shadow-2xl z-50"
          >
            <div className="bg-black text-green-500 font-mono text-xs p-2 mb-3 rounded border border-gray-700 overflow-hidden whitespace-nowrap">
              <motion.div animate={{ x: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
                {currentTrack.artist} - {currentTrack.title} *** {isPlaying ? "PLAYING" : "PAUSED"}
              </motion.div>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={handlePrev} className="text-gray-300 hover:text-white"><SkipBack size={20} /></button>
              <button onClick={togglePlay} className="text-accent hover:text-white">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={handleNext} className="text-gray-300 hover:text-white"><SkipForward size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadioPlayer;