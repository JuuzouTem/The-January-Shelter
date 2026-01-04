'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import InteractiveItem from './InteractiveItem';

const PlantGlitch = () => {
  const [isGlitching, setIsGlitching] = useState(false);

  // Ses dosyasını yükle (Varsa çalışır, yoksa hata vermez)
  const glitchSound = new Howl({
    src: ['/sounds/glitch.mp3'],
    volume: 0.5,
  });

  const triggerGlitch = () => {
    if (isGlitching) return;
    
    setIsGlitching(true);
    glitchSound.play();
    
    setTimeout(() => {
      setIsGlitching(false);
    }, 2000);
  };

  return (
    <>
      <InteractiveItem onClick={triggerGlitch} label="Masum Bitki" className="w-24 h-24 md:w-32 md:h-32">
        <motion.div
          animate={isGlitching ? { x: [-2, 2, -2, 2], rotate: [-1, 1, -1], filter: "hue-rotate(90deg)" } : {}}
          transition={{ duration: 0.1, repeat: isGlitching ? Infinity : 0 }}
          className="w-full h-full"
        >
          {/* Bitki Görseli */}
          <img 
            src="/images/items/plant.png" 
            alt="Bitki" 
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </motion.div>
      </InteractiveItem>

      {/* Glitch Overlay */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 pointer-events-none"
          >
            <motion.h1 
              animate={{ x: [-10, 10, -5, 5], skewX: [-20, 20] }}
              transition={{ duration: 0.1, repeat: Infinity }}
              className="text-5xl md:text-9xl font-black text-red-600 font-mono tracking-tighter text-center"
            >
              BİTKİ PORNOSU!
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PlantGlitch;