'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Howl } from 'howler';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Disc } from 'lucide-react';
import { standardMusicList, easterEggSongs, Song } from '@/data/musicList';
import InteractiveItem from './InteractiveItem';

interface RadioPlayerProps {
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const SONGS_PER_CYCLE = 12;
const CHANCE_INCREMENT = 0.05;

const RadioPlayer = ({ onPlayStateChange }: RadioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackState, setTrackState] = useState(0); 
  const [currentSong, setCurrentSong] = useState<Song>(standardMusicList[0]);
  const [playCount, setPlayCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  const getThemeStyles = () => {
    if (trackState === -1) {
      return {
        bg: "rgba(20, 10, 40, 0.9)",
        border: "rgba(236, 72, 153, 0.8)",
        shadow: "0 0 30px rgba(59, 130, 246, 0.4)",
        discGradient: "linear-gradient(135deg, #3b82f6, #ec4899)",
        labelText: "WHO'S REALLY THERE?",
        labelColor: "#ec4899",
        songTitleColor: "#60a5fa",
        iconColor: "#ffffff"
      };
    }
    if (trackState === -2) {
      return {
        bg: "rgba(0, 0, 0, 0.95)",
        border: "rgba(255, 255, 255, 0.9)",
        shadow: "0 0 0px rgba(0,0,0,0)",
        discGradient: "linear-gradient(135deg, #000000, #ffffff)",
        labelText: "DANGEROUSLY YOURS",
        labelColor: "#d1d5db",
        songTitleColor: "#ffffff",
        iconColor: "#ffffff"
      };
    }
    return {
      bg: "rgba(0, 0, 0, 0.6)",
      border: "rgba(255, 255, 255, 0.15)",
      shadow: "0 4px 20px rgba(0,0,0,0.3)",
      discGradient: "linear-gradient(135deg, #a855f7, #3b82f6)",
      labelText: "NOW PLAYING",
      labelColor: "#9ca3af",
      songTitleColor: "#ffffff",
      iconColor: "#ffffff"
    };
  };

  const theme = getThemeStyles();

  const playSound = (song: Song) => {
    if (soundRef.current) soundRef.current.stop();
    const sound = new Howl({
      src: [song.src],
      html5: true,
      volume: 0.5,
      onend: () => handleNext()
    });
    soundRef.current = sound;
    sound.play();
    setIsPlaying(true);
    setCurrentSong(song);
  };

  const togglePlay = () => {
    if (!soundRef.current) {
      playSound(standardMusicList[0]);
      setTrackState(0);
    } else {
      if (isPlaying) soundRef.current.pause();
      else soundRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (trackState === -1) {
      setTrackState(-2);
      playSound(easterEggSongs.main);
      return;
    }

    if (trackState === -2) {
      const nextIndex = Math.floor(Math.random() * standardMusicList.length);
      setTrackState(nextIndex);
      playSound(standardMusicList[nextIndex]);
      return;
    }

    const nextCount = playCount + 1;
    setPlayCount(nextCount);

    const cycle = Math.floor((nextCount - 1) / SONGS_PER_CYCLE);
    const currentChance = cycle * CHANCE_INCREMENT;

    const randomChance = Math.random();
    

    if (currentChance > 0 && randomChance < currentChance) {
      setTrackState(-1);
      playSound(easterEggSongs.intro);
      
      setPlayCount(SONGS_PER_CYCLE); 
    } else {
      const nextIndex = (trackState + 1) % standardMusicList.length;
      setTrackState(nextIndex);
      playSound(standardMusicList[nextIndex]);
    }
  };

  const handlePrev = () => {
    let nextIndex = 0;
    if (trackState < 0) {
        nextIndex = standardMusicList.length - 1;
    } else {
        nextIndex = (trackState - 1 + standardMusicList.length) % standardMusicList.length;
    }
    setTrackState(nextIndex);
    playSound(standardMusicList[nextIndex]);
  };

  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);

  return (
    <div className="relative">
      <InteractiveItem label={isPlaying ? "Durdur" : "Radyoyu Aç"} onClick={togglePlay} className="w-full h-full">
        <div className="relative w-full h-full">
            <img 
                src="/images/items/radio.png" 
                alt="Radyo" 
                className="w-full h-full object-contain drop-shadow-xl"
            />
            {isPlaying && (
                <motion.div
                    className="absolute inset-0 rounded-full blur-xl z-[-1]"
                    animate={{ 
                      scale: [1, 1.1, 1], 
                      opacity: [0.5, 0.8, 0.5],
                      backgroundColor: trackState === -1 ? "rgba(236, 72, 153, 0.5)" : 
                                       trackState === -2 ? "rgba(255, 255, 255, 0.3)" : 
                                       "rgba(250, 204, 21, 0.2)"
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            )}
        </div>
      </InteractiveItem>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              backgroundColor: theme.bg,
              borderColor: theme.border,
              boxShadow: theme.shadow
            }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 backdrop-blur-md border px-6 py-3 rounded-full z-[100]"
          >
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="rounded-full p-1"
              style={{ background: theme.discGradient }}
            >
                <Disc size={24} className="text-white mix-blend-overlay" />
            </motion.div>

            <div className="flex flex-col min-w-[120px]">
              <motion.span 
                animate={{ color: theme.labelColor }}
                className="text-xs font-medium tracking-wider"
              >
                {theme.labelText}
              </motion.span>
              
              <motion.span 
                animate={{ color: theme.songTitleColor }}
                className="text-sm font-bold whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis"
              >
                {currentSong.title}
              </motion.span>
            </div>

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