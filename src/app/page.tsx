'use client';

import React, { useState } from 'react'; // useState eklendi
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import SnowFall from '@/components/Effects/SnowFall';
import RoomScene from '@/components/Room/RoomScene';
import SkyScene from '@/components/Sky/SkyScene';
import LetterModal from '@/components/UI/LetterModal'; // Import eklendi

export default function Home() {
  const { currentScene, enterShelter, changeScene } = useGame();

  // Mektup modalını açma kapama mantığı
  // GameContext'te scene 'letter' olduğunda modalı render edeceğiz
  const isLetterOpen = currentScene === 'letter';

  const handleCloseLetter = () => {
    // Mektup kapanınca odaya veya gökyüzüne dön
    changeScene('room');
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0f1e] font-sans text-slate-200 selection:bg-purple-500/30">
      
      {/* Global Efektler */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${currentScene === 'sky' ? 'opacity-20' : 'opacity-100'} transition-opacity duration-1000`}>
         <SnowFall />
      </div>
      
      <AnimatePresence mode="wait">
        
        {/* --- INTRO SAHNESİ --- */}
        {currentScene === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            onClick={enterShelter}
            className="fixed inset-0 z-50 w-screen h-screen flex flex-col items-center justify-center cursor-pointer bg-transparent"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-6 p-4 text-center select-none">
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 50 }}
                className="text-5xl md:text-7xl font-extralight tracking-[0.2em] text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
              >
                JANUARY SHELTER
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="text-sm md:text-lg font-serif italic tracking-wider text-slate-300"
              >
                "She was born in the heart of winter..."
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* --- ODA SAHNESİ --- */}
        {currentScene === 'room' && (
          <motion.div
            key="room"
            className="absolute inset-0 z-10 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 1.5 }}
          >
            <RoomScene />
          </motion.div>
        )}

        {/* --- GÖKYÜZÜ SAHNESİ --- */}
        {currentScene === 'sky' && (
          <motion.div
            key="sky"
            className="absolute inset-0 z-30 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <SkyScene />
          </motion.div>
        )}

      </AnimatePresence>

      {/* --- LETTER MODAL (Global Overlay) --- */}
      {/* Sahne 'letter' olduğunda render olur */}
      <LetterModal 
        isOpen={isLetterOpen} 
        onClose={handleCloseLetter} 
      />

    </main>
  );
}