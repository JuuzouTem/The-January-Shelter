'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Sahne tipleri
type SceneType = 'intro' | 'room' | 'sky';

interface GameContextType {
  currentScene: SceneType;
  isAudioPlaying: boolean;
  changeScene: (scene: SceneType) => void;
  toggleAudio: (play: boolean) => void;
  enterShelter: () => void; // Giriş butonuna basılınca çalışacak
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentScene, setCurrentScene] = useState<SceneType>('intro');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const changeScene = (scene: SceneType) => {
    setCurrentScene(scene);
  };

  const toggleAudio = (play: boolean) => {
    setIsAudioPlaying(play);
    // Howler.js entegrasyonu buraya gelecek (Phase 2)
  };

  const enterShelter = () => {
    toggleAudio(true);
    changeScene('room');
  };

  return (
    <GameContext.Provider value={{ currentScene, isAudioPlaying, changeScene, toggleAudio, enterShelter }}>
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