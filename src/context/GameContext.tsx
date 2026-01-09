'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Howl } from 'howler';

type SoundType = 'bg-music' | 'wind' | 'glitch' | 'hoot' | 'click' | 'sparkle' | 'pop';

type SceneType = 'intro' | 'room' | 'sky' | 'letter';

interface GameContextType {
  currentScene: SceneType;
  changeScene: (scene: SceneType) => void;
  isAudioPlaying: boolean;
  toggleAudio: (play?: boolean) => void;
  enterShelter: () => void;
  playSound: (type: SoundType) => void;
  isCakeUnlocked: boolean;
  unlockCake: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentScene, setCurrentScene] = useState<SceneType>('intro');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isCakeUnlocked, setIsCakeUnlocked] = useState(false);
  
  const musicRef = useRef<Howl | null>(null);
  const sounds = useRef<Record<string, Howl>>({});

  useEffect(() => {
    sounds.current = {
      'wind': new Howl({ src: ['/sounds/wind.mp3'], loop: true, volume: 0.2 }),
      'glitch': new Howl({ src: ['/sounds/glitch.mp3'], volume: 0.5 }),
      'hoot': new Howl({ src: ['/sounds/hoot.mp3'], volume: 0.6 }),
      'click': new Howl({ src: ['/sounds/hoot.mp3'], volume: 0.3, rate: 2.0 }),
      'pop': new Howl({ src: ['/sounds/hoot.mp3'], volume: 0.2, rate: 3.0 }),
      'sparkle': new Howl({ src: ['/sounds/wind.mp3'], volume: 1.0, rate: 2.0 }),
    };

    return () => {
      if (musicRef.current) musicRef.current.unload();
      Object.values(sounds.current).forEach(s => s.unload());
    };
  }, []);

  const changeScene = (scene: SceneType) => {
    setCurrentScene(scene);
  };

  const playSound = (type: SoundType) => {
    if (sounds.current[type]) {
      sounds.current[type].play();
    }
  };

  const toggleAudio = (play?: boolean) => {
    const newState = play !== undefined ? play : !isAudioPlaying;
    setIsAudioPlaying(newState);

    if (newState) {
        if (!musicRef.current) {
            musicRef.current = new Howl({
                src: ['/sounds/bga-music.mp3'],
                html5: true,
                loop: true,
                volume: 0.4,
            });
        }
        if (!musicRef.current.playing()) {
            musicRef.current.play();
        }
    } else {
        musicRef.current?.pause();
    }
  };


  const enterShelter = () => {

    
    toggleAudio(true);
    changeScene('room');
  };

  const unlockCake = () => {
    setIsCakeUnlocked(true);
  };

  return (
    <GameContext.Provider value={{ 
      currentScene, 
      changeScene, 
      isAudioPlaying, 
      toggleAudio, 
      enterShelter,
      playSound,
      isCakeUnlocked, 
      unlockCake
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};