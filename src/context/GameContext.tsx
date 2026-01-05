'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Howl } from 'howler';

// Ses Tipleri
type SoundType = 'bg-music' | 'wind' | 'glitch' | 'hoot' | 'click' | 'sparkle' | 'pop';

// Sahne Tipleri
type SceneType = 'intro' | 'room' | 'sky' | 'letter';

interface GameContextType {
  currentScene: SceneType;
  changeScene: (scene: SceneType) => void;
  isAudioPlaying: boolean;
  toggleAudio: (play?: boolean) => void;
  enterShelter: () => void;
  playSound: (type: SoundType) => void; // Yeni eklenen özellik
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentScene, setCurrentScene] = useState<SceneType>('intro');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  // Müzik Referansı (Arka plan müziği için)
  const musicRef = useRef<Howl | null>(null);
  
  // SFX Referansları (Efektler için)
  const sounds = useRef<Record<string, Howl>>({});

  // Sesleri Yükle
  useEffect(() => {
    sounds.current = {
      'wind': new Howl({ src: ['/sounds/wind.mp3'], loop: true, volume: 0.2 }),
      'glitch': new Howl({ src: ['/sounds/glitch.mp3'], volume: 0.5 }),
      'hoot': new Howl({ src: ['/sounds/hoot.mp3'], volume: 0.6 }),
      'click': new Howl({ src: ['/sounds/hoot.mp3'], volume: 0.3, rate: 2.0 }), // Placeholder
      'pop': new Howl({ src: ['/sounds/hoot.mp3'], volume: 0.2, rate: 3.0 }),   // Placeholder
      'sparkle': new Howl({ src: ['/sounds/wind.mp3'], volume: 1.0, rate: 2.0 }),// Placeholder
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
    // Eğer parametre gelmezse tersine çevir
    const newState = play !== undefined ? play : !isAudioPlaying;
    setIsAudioPlaying(newState);

    if (newState) {
        // Müzik yoksa oluştur ve çal
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
        // Durdur
        musicRef.current?.pause();
    }
  };

  const enterShelter = () => {
    // Girişte rüzgarı başlat
    playSound('wind');
    toggleAudio(true);
    changeScene('room');
  };

  return (
    <GameContext.Provider value={{ 
      currentScene, 
      changeScene, 
      isAudioPlaying, 
      toggleAudio, 
      enterShelter,
      playSound 
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};