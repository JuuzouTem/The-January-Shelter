'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import SnowFall from '@/components/Effects/SnowFall';
import RoomScene from '@/components/Room/RoomScene';
import SkyScene from '@/components/Sky/SkyScene';

export default function Home() {
  const { currentScene, enterShelter } = useGame();

  return (
    <main className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#0a0f1e]">
      
      {/* Global Arka Plan Efektleri */}
      {/* SkyScene'de kendi yıldızları olacağı için SnowFall'u sadece intro ve room için gösterebiliriz veya opaklığını azaltabiliriz */}
      <div className={currentScene === 'sky' ? 'opacity-20 transition-opacity duration-1000' : 'opacity-100'}>
         <SnowFall />
      </div>
      
      <AnimatePresence mode="wait">
        
        {/* INTRO SAHNESİ */}
        {currentScene === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-6xl font-light tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            >
              JANUARY SHELTER
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-4 text-sm md:text-lg text-slate-300 italic"
            >
              "She was born in the heart of winter..."
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 2.5, duration: 0.5 }}
              onClick={enterShelter}
              className="mt-12 px-8 py-3 bg-transparent border border-white/20 text-white rounded-full 
                         hover:bg-white/10 hover:border-accent transition-all duration-300 backdrop-blur-md"
            >
              Sığınağa Gir
            </motion.button>
          </motion.div>
        )}

        {/* ODA SAHNESİ */}
        {currentScene === 'room' && (
          <motion.div
            key="room"
            className="absolute inset-0 z-10 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 100 }} // Aşağı doğru kaybolsun, yukarı bakıyoruz hissi
            transition={{ duration: 1.5 }}
          >
            <RoomScene />
          </motion.div>
        )}

        {/* GÖKYÜZÜ SAHNESİ */}
        {currentScene === 'sky' && (
          <motion.div
            key="sky"
            className="absolute inset-0 z-30 w-full h-full"
            initial={{ opacity: 0 }} // Siyahlıktan gelsin
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <SkyScene />
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}