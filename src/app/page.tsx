'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import SnowFall from '@/components/Effects/SnowFall';
import RoomScene from '@/components/Room/RoomScene';
import SkyScene from '@/components/Sky/SkyScene';
import LetterModal from '@/components/UI/LetterModal';
import { Howl } from 'howler';
import { imageAssets, baseSfx, musicTracks } from '@/data/assets';
import { downloadToCache } from '@/utils/audioManager';

export default function Home() {
  const { currentScene, enterShelter, changeScene } = useGame();
  
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const preloadedImages = useRef<HTMLImageElement[]>([]);

  // 1. AŞAMA: Siteyi açmak için gereken hafif yükleme
  useEffect(() => {
    // Toplam: Resimler + Hafif Efektler (baseSfx)
    const totalAssets = imageAssets.length + baseSfx.length;
    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      const realPercentage = Math.round((loadedCount / totalAssets) * 100);
      const safeReal = realPercentage > 100 ? 100 : realPercentage;

      // --- EASTER EGG MANTIĞI ---
      // 28 Ocak doğum günü şakası:
      // Eğer yükleme %100 bitmediyse ama %28'i geçtiyse, ekranda %28 olarak sabit tut.
      if (safeReal < 100) {
        setProgress(safeReal >= 28 ? 28 : safeReal);
      } else {
        // Yükleme %100 bittiğinde bir anda 100 yap.
        setProgress(100);
        
        // Biraz bekletip sahneyi aç
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
      }
    };

    // Resim Yükleyici
    const loadImage = async (src: string) => {
        const img = new Image();
        img.onload = updateProgress;
        img.onerror = updateProgress;
        
        try {
            const cache = await caches.open('january-shelter-images-v1');
            const cachedRes = await cache.match(src);
            if (cachedRes) {
                const blob = await cachedRes.blob();
                img.src = URL.createObjectURL(blob);
            } else {
                img.src = src;
                cache.add(src).catch(() => {});
            }
        } catch {
            img.src = src;
        }
        preloadedImages.current.push(img);
    };

    imageAssets.forEach((src) => loadImage(src));

    // Hafif Sesleri Yükle (baseSfx kullanıyoruz)
    baseSfx.forEach((src) => {
      new Howl({
        src: [src],
        preload: true,
        onload: updateProgress,
        onloaderror: updateProgress
      });
    });

  }, []);

  // 2. AŞAMA: SİTE AÇILDIKTAN SONRA MÜZİKLERİ İNDİRME
  useEffect(() => {
    if (!isLoading) {
        const downloadMusic = async () => {
            // musicTracks listesini sırayla indiriyoruz
            for (const musicSrc of musicTracks) {
                await new Promise(r => setTimeout(r, 500));
                await downloadToCache(musicSrc);
            }
        };
        downloadMusic();
    }
  }, [isLoading]);

  const isLetterOpen = currentScene === 'letter';

  const handleCloseLetter = () => {
    changeScene('room');
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-slate-300 font-serif z-[100]">
        <motion.div 
           animate={{ opacity: [1, 0.3, 1] }} 
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
           className="text-2xl mb-4 tracking-widest"
        >
           HAZIRLANIYOR
        </motion.div>
        
        <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-purple-500/50"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
        <div className="mt-2 text-xs opacity-50">%{progress}</div>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0f1e] font-sans text-slate-200 selection:bg-purple-500/30">
      <div className={`absolute inset-0 pointer-events-none z-0 ${currentScene === 'intro' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
         <SnowFall />
      </div>
      
      <AnimatePresence mode="wait">
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

      <LetterModal isOpen={isLetterOpen} onClose={handleCloseLetter} />
    </main>
  );
}