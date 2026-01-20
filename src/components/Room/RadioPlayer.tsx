'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Howl } from 'howler';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Disc } from 'lucide-react';
import { standardMusicList, easterEggSongs, Song } from '@/data/musicList';
import InteractiveItem from './InteractiveItem';
import { getAudioSource } from '@/utils/audioManager';

interface RadioPlayerProps {
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export interface RadioPlayerHandle {
  playSpecificSong: (id: number) => void;
}

const SONGS_PER_CYCLE = 12;
const CHANCE_INCREMENT = 0.05;

let globalLastTrackIndex = 0; 

const RadioPlayer = forwardRef<RadioPlayerHandle, RadioPlayerProps>(({ onPlayStateChange }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [trackState, setTrackState] = useState(globalLastTrackIndex); 
  
  const initialSong = trackState >= 0 
    ? standardMusicList[trackState] 
    : (trackState === -1 ? easterEggSongs.intro : easterEggSongs.main);

  const [currentSong, setCurrentSong] = useState<Song>(initialSong);
  const [playCount, setPlayCount] = useState(0);
  
  const currentBlobUrl = useRef<string | null>(null);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    globalLastTrackIndex = trackState;
  }, [trackState]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
      if (currentBlobUrl.current) {
        URL.revokeObjectURL(currentBlobUrl.current);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    playSpecificSong: (targetId: number) => {
      const targetIndex = standardMusicList.findIndex(s => s.id === targetId);
      const targetSong = standardMusicList.find(s => s.id === targetId);

      if (targetSong && targetIndex !== -1) {
        setTrackState(targetIndex);
        playSound(targetSong, targetIndex);
      }
    }
  }));

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

  const playSound = async (song: Song, index: number) => {
    if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
    }
    if (currentBlobUrl.current) {
        URL.revokeObjectURL(currentBlobUrl.current);
        currentBlobUrl.current = null;
    }

    const source = await getAudioSource(song.src);
    
    if (source.isBlob) {
        currentBlobUrl.current = source.url;
    }

    const extension = song.src.split('.').pop()?.toLowerCase() || 'mp3';

    const sound = new Howl({
      src: [source.url],
      format: [extension],
      html5: true,
      volume: 0.5,
      onend: () => handleNext(),
      onloaderror: (id, error) => {
         console.error("Müzik yükleme hatası:", error, song.src);
      }
    });
    
    soundRef.current = sound;
    sound.play();
    
    setIsPlaying(true);
    setCurrentSong(song);
    setTrackState(index);
  };

  const togglePlay = () => {
    if (!soundRef.current) {
      let songToPlay = standardMusicList[0];
      
      if (trackState >= 0 && trackState < standardMusicList.length) {
          songToPlay = standardMusicList[trackState];
      } else if (trackState === -1) {
          songToPlay = easterEggSongs.intro;
      } else if (trackState === -2) {
          songToPlay = easterEggSongs.main;
      }

      playSound(songToPlay, trackState);
    } else {
      if (isPlaying) {
        soundRef.current.pause();
        setIsPlaying(false);
      } else {
        soundRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleNext = () => {
    if (trackState === -1) {
      playSound(easterEggSongs.main, -2);
      return;
    }

    if (trackState === -2) {
      const nextIndex = Math.floor(Math.random() * standardMusicList.length);
      playSound(standardMusicList[nextIndex], nextIndex);
      return;
    }

    const nextCount = playCount + 1;
    setPlayCount(nextCount);

    const cycle = Math.floor((nextCount - 1) / SONGS_PER_CYCLE);
    const currentChance = cycle * CHANCE_INCREMENT;
    const randomChance = Math.random();

    if (currentChance > 0 && randomChance < currentChance) {
      setPlayCount(SONGS_PER_CYCLE); 
      playSound(easterEggSongs.intro, -1);
    } else {
      const nextIndex = (trackState + 1) % standardMusicList.length;
      playSound(standardMusicList[nextIndex], nextIndex);
    }
  };

  const handlePrev = () => {
    let nextIndex = 0;
    if (trackState < 0) {
        nextIndex = standardMusicList.length - 1;
    } else {
        nextIndex = (trackState - 1 + standardMusicList.length) % standardMusicList.length;
    }
    playSound(standardMusicList[nextIndex], nextIndex);
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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-[0.08vw] backdrop-blur-md border px-6 py-3 rounded-full z-[100]"
          >
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="rounded-full p-1"
              style={{ background: theme.discGradient }}
            >
                <Disc size={24} className="text-white mix-blend-overlay" />
            </motion.div>

            <div className="flex flex-col min-w-[7vw]">
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
});

RadioPlayer.displayName = "RadioPlayer";

export default RadioPlayer;